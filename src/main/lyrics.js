const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { transliterate } = require("transliteration");
const { DOMParser } = require("@xmldom/xmldom");

const LRCLIB_ORIGIN = "https://lrclib.net";
const LYRICS_OVH_ORIGIN = "https://api.lyrics.ovh";
const KUGOU_ORIGIN = "https://lyrics.kugou.com";
const KUGOU_MOBILE_ORIGIN = "https://mobileservice.kugou.com";
const NETEASE_ORIGIN = "https://music.163.com";
const BETTER_LYRICS_ORIGIN = "https://lyrics-api.boidu.dev";
const PAXSENIX_ORIGIN = "https://lyrics.paxsenix.org";
const MUSIXMATCH_ORIGIN = "https://apic.musixmatch.com";
const MUSIXMATCH_SIGNATURE_SECRET = "mNdca@6W7TeEcFn6*3.s97sJ*yPMd";
const ITUNES_SEARCH_ORIGIN = "https://itunes.apple.com";
const APPLE_MUSIC_ORIGIN = "https://beta.music.apple.com";
const APPLE_MUSIC_API_ORIGIN = "https://amp-api.music.apple.com";
const GOOGLE_TRANSLATE_ORIGIN = "https://translate.googleapis.com";
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const AUTO_PROVIDER = "auto";
const LOCAL_PROVIDER = "local";
const BETTER_LYRICS_PROVIDER = "betterlyrics";
const LRCLIB_PROVIDER = "lrclib";
const KUGOU_PROVIDER = "kugou";
const NETEASE_PROVIDER = "netease";
const PAXSENIX_PROVIDER = "paxsenix";
const LYRICS_PLUS_PROVIDER = "lyricsplus";
const YOUTUBE_TRANSCRIPT_PROVIDER = "youtube-transcript";
const LYRICS_OVH_PROVIDER = "lyrics-ovh";
const MUSIXMATCH_PROVIDER = "musixmatch";
const MYMEMORY_ORIGIN = "https://api.mymemory.translated.net";
const DEFAULT_FETCH_TIMEOUT_MS = 6500;
// Leave room for the reference extension's Google fallback endpoint while
// keeping the IPC request inside the renderer's two-second budget.
const TRANSLATION_FETCH_TIMEOUT_MS = 3500;
const LYRIC_SEARCH_FETCH_TIMEOUT_MS = 3200;
const LRCLIB_EXACT_SEARCH_TIMEOUT_MS = 4800;
const LRCLIB_BROAD_SEARCH_TIMEOUT_MS = 3600;
const KUGOU_FETCH_TIMEOUT_MS = 6500;
const KUGOU_DURATION_TOLERANCE_SECONDS = 8;
const EXTENDED_LYRICS_FETCH_TIMEOUT_MS = 15000;
const PROVIDER_COOLDOWN_MS = 30 * 60 * 1000;
const providerCooldowns = new Map();
const MUSIXMATCH_APP_ID = "android-player-v1.0";
const MUSIXMATCH_TOKEN_TTL_MS = 25 * 60 * 1000;
let cachedMusixmatchToken = { token: "", expiresAt: 0 };
let activeTokenPromise = null;

const TOKEN_CACHE_PATH = path.join(os.tmpdir(), "metromusic_musixmatch_token.json");

function loadCachedMusixmatchToken() {
  try {
    if (fs.existsSync(TOKEN_CACHE_PATH)) {
      const raw = fs.readFileSync(TOKEN_CACHE_PATH, "utf8");
      const data = JSON.parse(raw);
      if (data.token && data.expiresAt > Date.now()) {
        return data;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function saveCachedMusixmatchToken(token, expiresAt) {
  try {
    const data = { token, expiresAt };
    fs.writeFileSync(TOKEN_CACHE_PATH, JSON.stringify(data), "utf8");
  } catch (e) {
    // ignore
  }
}

async function getMusixmatchUserToken(options = {}) {
  const now = Date.now();
  if (!options.forceRefresh) {
    if (cachedMusixmatchToken.token && now < cachedMusixmatchToken.expiresAt) {
      return cachedMusixmatchToken.token;
    }
    const diskCache = loadCachedMusixmatchToken();
    if (diskCache) {
      cachedMusixmatchToken = diskCache;
      return cachedMusixmatchToken.token;
    }
  }
  
  if (activeTokenPromise) {
    return activeTokenPromise;
  }
  
  activeTokenPromise = (async () => {
    const nowDate = new Date();
    const timestamp = nowDate.toISOString().replace(/\.\d+Z$/, 'Z');
    
    const url = new URL("/ws/1.1/token.get", MUSIXMATCH_ORIGIN);
    url.searchParams.set("adv_id", randomUuid());
    url.searchParams.set("root", "0");
    url.searchParams.set("sideloaded", "0");
    url.searchParams.set("app_id", MUSIXMATCH_APP_ID);
    url.searchParams.set("build_number", "2022090901");
    url.searchParams.set("guid", randomGuid());
    url.searchParams.set("lang", "en_US");
    url.searchParams.set("model", "manufacturer/Google brand/Google model/Pixel 6");
    url.searchParams.set("timestamp", timestamp);
    url.searchParams.set("format", "json");
    
    const signedUrl = signMusixmatchUrl(url, nowDate);
    try {
      const data = await fetchJson(signedUrl, { headers: musixmatchHeaders() }, 10000, "Musixmatch token");
      const token = String(data?.message?.body?.user_token || "").trim();
      if (!token) throw new Error("Empty token response");
      const expiresAt = now + MUSIXMATCH_TOKEN_TTL_MS;
      cachedMusixmatchToken = { token, expiresAt };
      saveCachedMusixmatchToken(token, expiresAt);
      return token;
    } finally {
      activeTokenPromise = null;
    }
  })();
  
  try {
    return await activeTokenPromise;
  } catch (error) {
    if (cachedMusixmatchToken.token) return cachedMusixmatchToken.token;
    throw error;
  }
}
const LYRICS_PLUS_BASE_URLS = [
  "https://lyricsplus.binimum.org",
  "https://lyricsplus.atomix.one",
  "https://lyricsplus.prjktla.my.id",
  "https://lyricsplus-seven.vercel.app"
];
const ONLINE_LYRIC_PROVIDERS = [
  NETEASE_PROVIDER,
  MUSIXMATCH_PROVIDER,
  BETTER_LYRICS_PROVIDER,
  LRCLIB_PROVIDER,
  KUGOU_PROVIDER,
  PAXSENIX_PROVIDER,
  LYRICS_PLUS_PROVIDER,
  LYRICS_OVH_PROVIDER
];
const PROVIDER_LABELS = {
  [AUTO_PROVIDER]: "Auto",
  [LOCAL_PROVIDER]: "Local LRC",
  [BETTER_LYRICS_PROVIDER]: "BetterLyrics",
  [NETEASE_PROVIDER]: "NetEase Music",
  [LRCLIB_PROVIDER]: "LRCLIB",
  [MUSIXMATCH_PROVIDER]: "Musixmatch",
  [KUGOU_PROVIDER]: "KuGou",
  [PAXSENIX_PROVIDER]: "Paxsenix",
  [LYRICS_PLUS_PROVIDER]: "LyricsPlus",
  [YOUTUBE_TRANSCRIPT_PROVIDER]: "YouTube transcript",
  [LYRICS_OVH_PROVIDER]: "Lyrics.ovh"
};

const TITLE_CLEANUP_PATTERNS = [
  /\s*\(.*?(official|video|audio|lyrics|lyric|visualizer|hd|hq|4k|remaster|remix|live|acoustic|version|edit|extended|radio|clean|explicit).*?\)/gi,
  /\s*\[.*?(official|video|audio|lyrics|lyric|visualizer|hd|hq|4k|remaster|remix|live|acoustic|version|edit|extended|radio|clean|explicit).*?\]/gi,
  /\s*\|.*$/g,
  /\s+-\s+(official|video|audio|lyrics|lyric|visualizer).*$/gi,
  /\s*\(feat\..*?\)/gi,
  /\s*\(ft\..*?\)/gi,
  /\s+feat\..*$/gi,
  /\s+ft\..*$/gi
];

const FEATURING_PATTERNS = [
  /\s*\(feat(?:uring)?\.?\s+[^)]+\)/gi,
  /\s*\(ft\.?\s+[^)]+\)/gi,
  /\s*\[[fF]eat(?:uring)?\.?\s+[^\]]+\]/g,
  /\s*\[[fF]t\.?\s+[^\]]+\]/g,
  /\s+(?:feat|featuring|ft)\.?\s+.+$/gi,
  /\s+with\s+.+$/gi
];

const FEATURING_SEPARATORS = [" feat. ", " feat ", " ft. ", " ft ", " featuring ", " with "];
const ARTIST_GROUP_SEPARATORS = [" • ", " · ", " x ", " X ", " × ", " / ", " \\ ", "; ", "；"];
const AMBIGUOUS_SEPARATORS = [" - ", " & ", " and ", ", ", "、", "，", " 與 ", " 和 ", " 及 "];

function normalizeArtistKey(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+/gi, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function usesNonLatinScript(value) {
  return /[^\p{Script=Latin}\p{Number}\p{Punctuation}\p{Separator}\p{Mark}]/u.test(String(value || ""));
}

function transliterateArtist(value) {
  const raw = String(value || "");
  try {
    const t = transliterate(raw, { unknown: "?" }).replace(/\?+/g, "").trim();
    if (!t) return "";
    return normalizeArtistKey(t);
  } catch {
    return "";
  }
}

function removeFeaturingFromArtist(artist) {
  let cleaned = String(artist || "").trim();
  for (const pattern of FEATURING_PATTERNS) {
    cleaned = cleaned.replace(pattern, "");
  }
  for (const sep of FEATURING_SEPARATORS) {
    const lower = cleaned.toLowerCase();
    const idx = lower.indexOf(sep.toLowerCase());
    if (idx > 0) {
      cleaned = cleaned.slice(0, idx);
      break;
    }
  }
  return cleaned.replace(/\s+/g, " ").trim();
}

function splitArtistNames(artist) {
  const raw = String(artist || "").trim();
  if (!raw) return [];

  const base = removeFeaturingFromArtist(raw);
  const tokens = new Set([normalizeArtistKey(base)]);

  const trySplit = (separator) => {
    const lower = base.toLowerCase();
    const sepLower = separator.toLowerCase();
    const idx = lower.indexOf(sepLower);
    if (idx <= 0 || idx + sepLower.length >= lower.length) return;
    const left = base.slice(0, idx).trim();
    const right = base.slice(idx + separator.length).trim();
    if (left && right) {
      tokens.add(normalizeArtistKey(left));
      tokens.add(normalizeArtistKey(right));
    }
  };

  for (const sep of ARTIST_GROUP_SEPARATORS) trySplit(sep);
  for (const sep of AMBIGUOUS_SEPARATORS) trySplit(sep);

  const pieces = base.split(/\s*(?:,|、|\/|;|\|| feat\.?| ft\.?| featuring | with | x | × | and |&|•|·|-)\s*/i)
    .map((s) => s.trim())
    .filter(Boolean);
  if (pieces.length > 1 && pieces.length <= 6) {
    for (const p of pieces) tokens.add(normalizeArtistKey(p));
  }

  tokens.delete("");
  return [...tokens].filter((t) => t && t.length >= 2);
}

function cleanArtist(artist) {
  return removeFeaturingFromArtist(artist);
}

function artistFromTrack(track) {
  const linkedArtists = (track?.artists || [])
    .map((artist) => cleanArtist(artist?.title || artist?.name || ""))
    .filter(Boolean);
  if (linkedArtists.length) {
    return [...new Set(linkedArtists.map((a) => a.trim()))].join(", ");
  }
  if (track?.artist) return cleanArtist(track.artist);
  const subtitle = String(track?.subtitle || "");
  const parts = subtitle.split(/[•·|]/).map((part) => part.trim()).filter(Boolean);
  const firstUseful = parts.find((part) => !/^(song|video|album|single|ep|youtube music|\d+:\d+)$/i.test(part));
  return cleanArtist(firstUseful || subtitle);
}

function extractAllArtistTokens(track, overrides = {}) {
  const tokens = new Set();

  const pushRaw = (raw) => {
    const base = cleanArtist(raw);
    if (!base) return;
    tokens.add(base);
    const nk = normalizeArtistKey(base);
    if (nk) tokens.add(nk);
    const tr = transliterateArtist(base);
    if (tr && tr !== nk) tokens.add(tr);
    for (const piece of splitArtistNames(base)) {
      tokens.add(piece);
    }
  };

  const overridden = String(overrides.artist ?? "").trim();
  if (overridden) pushRaw(overridden);

  (track?.artists || []).forEach((artist) => {
    const raw = artist?.title || artist?.name || "";
    if (raw) pushRaw(raw);
  });

  if (track?.artist) pushRaw(track.artist);

  const subtitle = String(track?.subtitle || "");
  const subtitleParts = subtitle.split(/[•·|]/).map((p) => p.trim()).filter(Boolean);
  for (const part of subtitleParts) {
    if (!/^(song|video|album|single|ep|youtube music|\d+:\d+)$/i.test(part)) {
      pushRaw(part);
    }
  }

  const titleMatch = String(track?.title || "").match(/^(.+?)\s+[-–—]\s+(.+)$/);
  if (titleMatch?.[1]) pushRaw(titleMatch[1]);

  const uploader = String(track?.uploader || track?.author || track?.channelTitle || track?.ownerName || "").trim();
  if (uploader) {
    const nk = normalizeArtistKey(uploader);
    const likelyChannel = /(vevo|official|channel|youtube|topic|tv|music|records|productions|studio|entertainment)$/i.test(nk);
    if (!likelyChannel) pushRaw(uploader);
  }

  return [...tokens].filter(Boolean);
}

function walk(value, visitor) {
  if (!value || typeof value !== "object") return;
  visitor(value);
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visitor);
    return;
  }
  for (const item of Object.values(value)) walk(item, visitor);
}

function textFromObject(value) {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object") return "";
  if (typeof value.simpleText === "string") return value.simpleText.trim();
  if (typeof value.text === "string") return value.text.trim();
  if (Array.isArray(value.runs)) return value.runs.map((run) => run.text || "").join("").trim();
  if (value.content) return textFromObject(value.content);
  if (value.snippet) return textFromObject(value.snippet);
  if (value.cue) return textFromObject(value.cue);
  if (value.line) return textFromObject(value.line);
  return "";
}

function numberFromMilliseconds(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return number >= 1000 ? number / 1000 : number;
}

function cleanTitle(title) {
  let cleaned = String(title || "").trim();
  for (const pattern of TITLE_CLEANUP_PATTERNS) cleaned = cleaned.replace(pattern, "");
  return cleaned.replace(/\s+/g, " ").trim();
}

function secondsFromTrack(track) {
  const value = Number(track?.lengthSeconds || track?.duration || track?.durationSeconds || 0);
  return Number.isFinite(value) && value > 0 ? Math.round(value) : null;
}

function providerLabel(provider) {
  return PROVIDER_LABELS[provider] || PROVIDER_LABELS[AUTO_PROVIDER];
}

function candidateValues(values) {
  const seen = new Set();
  const list = [];
  for (const value of values || []) {
    const normalized = String(value || "").replace(/\s+/g, " ").trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    list.push(normalized);
  }
  return list;
}

function lyricsSearchContext(track, overrides = {}) {
  const rawTitle = String(overrides.title ?? track?.title ?? "").trim();
  const cleanedTitle = cleanTitle(rawTitle);
  const title = cleanedTitle || rawTitle;
  const primaryArtist = cleanArtist(overrides.artist ?? "") || artistFromTrack(track);
  const duration = secondsFromTrack(track);
  const album = String(overrides.album ?? track?.album?.title ?? track?.album ?? "").trim();
  const rawArtist = String(track?.artist || "").trim();

  const artistTokenSet = new Set();
  const pushArtist = (raw) => {
    if (!raw) return;
    const base = String(raw).replace(/\s+/g, " ").trim();
    if (!base) return;
    artistTokenSet.add(base);
    const nk = normalizeArtistKey(base);
    if (nk) artistTokenSet.add(nk);
    const tr = transliterateArtist(base);
    if (tr && tr !== nk) artistTokenSet.add(tr);
    for (const piece of splitArtistNames(base)) {
      artistTokenSet.add(piece);
    }
  };

  pushArtist(primaryArtist);
  pushArtist(overrides.artist ?? "");
  pushArtist(rawArtist);
  (track?.artists || []).forEach((artist) => {
    pushArtist(artist?.title || artist?.name || "");
  });
  extractAllArtistTokens(track, overrides).forEach((token) => artistTokenSet.add(token));

  const artistCandidatesFull = candidateValues([...artistTokenSet]);
  const primaryArtistCandidates = candidateValues([primaryArtist, rawArtist]);

  return {
    title,
    rawTitle,
    artist: primaryArtist,
    duration,
    album,
    titleCandidates: candidateValues([title, rawTitle]),
    artistCandidates: primaryArtistCandidates.length ? primaryArtistCandidates : [primaryArtist],
    artistTokens: artistCandidatesFull
  };
}

function tokenizeWords(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+/gi, " ")
    .trim()
    .split(/\s+/)
    .filter((word) => word && word.length > 1);
}

function artistSimilarity(sourceArtistTokens, resultArtistName) {
  const resultRaw = cleanArtist(resultArtistName);
  if (!resultRaw || !sourceArtistTokens?.length) return 0;

  const resultVariants = new Set();
  resultVariants.add(normalizeArtistKey(resultRaw));
  const tr = transliterateArtist(resultRaw);
  if (tr) resultVariants.add(tr);
  for (const piece of splitArtistNames(resultRaw)) {
    resultVariants.add(piece);
  }

  const resultPieces = [...resultVariants].filter(Boolean);
  const sourceTokens = sourceArtistTokens.map((t) => String(t || "").trim()).filter(Boolean);

  if (!resultPieces.length || !sourceTokens.length) return 0;

  let best = 0;
  for (const source of sourceTokens) {
    const sourceNorm = normalizeArtistKey(source) || source.toLowerCase();
    for (const result of resultPieces) {
      if (!result) continue;
      if (sourceNorm === result) return 1;
      if (sourceNorm.includes(result) || result.includes(sourceNorm)) {
        best = Math.max(best, 0.88);
      }
      const resultWords = tokenizeWords(result);
      const sourceWords = tokenizeWords(sourceNorm);
      if (resultWords.length && sourceWords.length) {
        const overlap = resultWords.filter((w) => sourceWords.includes(w)).length;
        const jaccard = overlap / Math.max(1, resultWords.length + sourceWords.length - overlap);
        if (jaccard >= 0.7) best = Math.max(best, 0.9 + jaccard * 0.1);
        else if (overlap >= Math.min(2, Math.min(resultWords.length, sourceWords.length))) best = Math.max(best, 0.78 + overlap * 0.02);
      }
      const levScore = similarity(sourceNorm, result);
      if (levScore > best) best = levScore;
    }
  }
  return best;
}

function similarity(a, b) {
  const left = String(a || "").toLowerCase().trim();
  const right = String(b || "").toLowerCase().trim();
  if (!left || !right) return 0;
  if (left === right) return 1;
  if (left.includes(right) || right.includes(left)) return 0.82;

  const leftWords = tokenizeWords(left);
  const rightWords = tokenizeWords(right);
  if (leftWords.length && rightWords.length) {
    const overlap = leftWords.filter((w) => rightWords.includes(w)).length;
    const smaller = Math.min(leftWords.length, rightWords.length);
    if (overlap === smaller) return 0.9;
    if (overlap >= smaller * 0.75) return 0.8;
  }

  const rows = left.length + 1;
  const cols = right.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return 1 - matrix[left.length][right.length] / Math.max(left.length, right.length);
}

function scoreResult(result, title, artist, duration, artistTokens = null) {
  let score = 0;
  score += similarity(title, result.trackName) * 5;

  const artistScore = artistTokens && artistTokens.length
    ? artistSimilarity(artistTokens, result.artistName)
    : similarity(artist, result.artistName);
  score += artistScore * 4;

  if (artistScore >= 0.95) score += 1.5;
  else if (artistScore >= 0.85) score += 0.8;
  else if (artistScore >= 0.7) score += 0.3;

  if (result.syncedLyrics) score += 2;
  if (duration && result.duration) {
    const diff = Math.abs(Number(result.duration) - duration);
    score += Math.max(0, 2 - diff / 5);
  }
  return score;
}

function scorePaxsenixResult(result, context) {
  let score = 0;
  score += similarity(context.title, result.trackName) * 5;

  const artistScore = context.artistTokens && context.artistTokens.length
    ? artistSimilarity(context.artistTokens, result.artistName)
    : similarity(context.artist, result.artistName);
  score += artistScore * 4;

  if (artistScore >= 0.95) score += 1.5;
  else if (artistScore >= 0.85) score += 0.8;
  else if (artistScore >= 0.7) score += 0.3;

  if (context.duration && result.duration) {
    const diff = Math.abs(Number(result.duration) - context.duration);
    score += Math.max(0, 3 - diff / 4);
  }
  if (/remix/i.test(result.trackName || "") && !/remix/i.test(context.title || "")) score -= 2;
  if (/mixed/i.test(result.trackName || "") && !/mixed/i.test(context.title || "")) score -= 2;
  return score;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS, label = "Request") {
  if (!timeoutMs || timeoutMs <= 0) {
    return fetch(url, options);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } catch (error) {
    if (error?.name === "AbortError") throw new Error(`${label} timed out`);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function queryLyrics(params, options = {}) {
  const url = new URL("/api/search", LRCLIB_ORIGIN);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  const response = await fetchWithTimeout(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": USER_AGENT
    }
  }, options.timeoutMs || DEFAULT_FETCH_TIMEOUT_MS, "LRCLIB");

  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`LRCLIB failed (${response.status})`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

async function queryLyricsOvh(artist, title, options = {}) {
  const response = await fetchWithTimeout(
    `${LYRICS_OVH_ORIGIN}/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
    {
      headers: {
        "Accept": "application/json",
        "User-Agent": USER_AGENT
      }
    },
    options.timeoutMs || DEFAULT_FETCH_TIMEOUT_MS,
    "Lyrics.ovh"
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Lyrics.ovh failed (${response.status})`);
  const data = await response.json();
  return typeof data?.lyrics === "string" ? data.lyrics : "";
}

async function fetchJson(url, options = {}, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS, label = "Request") {
  const { headers, ...restOptions } = options;
  const response = await fetchWithTimeout(
    url,
    {
      ...restOptions,
      headers: {
        "Accept": "application/json, text/plain, */*",
        "User-Agent": USER_AGENT,
        ...(headers || {})
      }
    },
    timeoutMs,
    label
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${label} failed (${response.status})`);
  return response.json();
}

async function fetchText(url, options = {}, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS, label = "Request") {
  const { headers, ...restOptions } = options;
  const response = await fetchWithTimeout(
    url,
    {
      ...restOptions,
      headers: {
        "Accept": "text/html, text/plain, */*",
        "User-Agent": USER_AGENT,
        ...(headers || {})
      }
    },
    timeoutMs,
    label
  );
  if (response.status === 404) return "";
  if (!response.ok) throw new Error(`${label} failed (${response.status})`);
  return response.text();
}

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)));
}

function attrFromTag(tag, name) {
  const pattern = new RegExp(`(?:^|\\s)(?:[\\w-]+:)?${name}\\s*=\\s*["']([^"']+)["']`, "i");
  return String(tag || "").match(pattern)?.[1] || "";
}

function normalizeLyricsAgent(value) {
  const normalized = String(value || "").trim().toLowerCase();
  const match = normalized.match(/(?:^|[^0-9])(1000|1|2)(?:$|[^0-9])/);
  return match ? `v${match[1]}` : (/^v\d+$/i.test(normalized) ? normalized : "");
}

function agentFromRoleText(value) {
  const text = String(value || "").trim();
  return normalizeLyricsAgent(
    text.match(/^\{agent:([^}]+)\}/i)?.[1] ||
    text.match(/^\{(v?\d+)\}/i)?.[1] ||
    text.match(/^\[(v?\d+)\]/i)?.[1] ||
    text.match(/^(?:agent|voice|singer)?\s*(v?\d+)\s*:/i)?.[1] ||
    ""
  );
}

function parseTtmlTime(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const seconds = raw.match(/^(\d+(?:\.\d+)?)s$/i);
  if (seconds) return Number(seconds[1]);
  const millis = raw.match(/^(\d+(?:\.\d+)?)ms$/i);
  if (millis) return Number(millis[1]) / 1000;
  const clock = raw.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?$/);
  if (!clock) return null;
  const hours = clock[1] ? Number(clock[1]) : 0;
  const minutes = Number(clock[2]);
  const secondsPart = Number(clock[3]);
  const fraction = clock[4] ? Number(clock[4].padEnd(3, "0").slice(0, 3)) / 1000 : 0;
  return hours * 3600 + minutes * 60 + secondsPart + fraction;
}

function textFromTtmlFragment(fragment) {
  return decodeHtmlEntities(String(fragment || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim());
}

function activeTtmlContainerContext(source, endIndex) {
  const stack = [];
  const tagRegex = /<(\/?)div\b([^>]*)>/gi;
  const prefix = source.slice(0, Math.max(0, endIndex));
  let match;
  while ((match = tagRegex.exec(prefix))) {
    if (match[1]) stack.pop();
    else stack.push(match[2] || "");
  }

  let agent = "";
  let role = "";
  for (let index = stack.length - 1; index >= 0; index -= 1) {
    if (!agent) agent = attrFromTag(stack[index], "agent");
    if (!role) role = attrFromTag(stack[index], "role");
    if (agent && role) break;
  }
  return { agent, role };
}

function ttmlNodeName(node) {
  return String(node?.localName || node?.nodeName || "").split(":").pop().toLowerCase();
}

function ttmlAttribute(element, name) {
  if (!element?.getAttribute) return "";
  const direct = element.getAttribute(name);
  if (direct) return direct;
  for (let index = 0; index < (element.attributes?.length || 0); index += 1) {
    const attribute = element.attributes.item(index);
    if (ttmlNodeName(attribute) === name.toLowerCase()) return attribute.value || "";
  }
  return "";
}

function ttmlElementChildren(node) {
  const children = [];
  for (let child = node?.firstChild; child; child = child.nextSibling) {
    if (child.nodeType === 1) children.push(child);
  }
  return children;
}

function ttmlInheritedAttribute(element, name, boundary = null) {
  for (let current = element; current; current = current.parentNode) {
    const value = ttmlAttribute(current, name);
    if (value) return value;
    if (current === boundary) break;
  }
  return "";
}

function ttmlIgnoredRole(value) {
  return /(?:^|\s)x-(?:translation|roman)(?:\s|$)/i.test(String(value || ""));
}

function ttmlBackgroundRole(value) {
  return /(?:^|[-_\s])(?:x-)?bg(?:$|[-_\s])|background/i.test(String(value || ""));
}

function ttmlWhitespaceBefore(element, boundary) {
  let current = element;
  while (current && current !== boundary) {
    let sibling = current.previousSibling;
    while (sibling) {
      const text = String(sibling.textContent || "");
      if (text) return /\s$/.test(text);
      sibling = sibling.previousSibling;
    }
    current = current.parentNode;
  }
  return false;
}

function ttmlTimedSpans(root, paragraph, offset, backgroundMode = false) {
  const timed = [];
  const visit = (element) => {
    if (element.nodeType !== 1) return;
    const role = ttmlInheritedAttribute(element, "role", paragraph);
    if (ttmlIgnoredRole(role)) return;
    const isBackground = ttmlBackgroundRole(role);
    if (backgroundMode !== isBackground && element !== root) {
      if (isBackground || backgroundMode) return;
    }

    const childSpans = ttmlElementChildren(element).filter((child) => ttmlNodeName(child) === "span");
    const timedChildren = childSpans.some((child) =>
      parseTtmlTime(ttmlAttribute(child, "begin")) != null ||
      parseTtmlTime(ttmlAttribute(child, "end")) != null
    );
    const start = parseTtmlTime(ttmlAttribute(element, "begin"));
    const end = parseTtmlTime(ttmlAttribute(element, "end"));
    const text = String(element.textContent || "").trim();

    if (ttmlNodeName(element) === "span" && !timedChildren && text &&
        Number.isFinite(start) && Number.isFinite(end) && end > start) {
      timed.push({
        text: text.replace(/[|<>]/g, "").trim(),
        start: start + offset,
        end: end + offset,
        spaceBefore: /^\s/.test(String(element.textContent || "")) ||
          ttmlWhitespaceBefore(element, paragraph)
      });
      return;
    }
    childSpans.forEach(visit);
  };
  visit(root);
  return timed.filter((word) => word.text);
}

function ttmlPlainText(root, paragraph, backgroundMode = false) {
  const collect = (node) => {
    if (node.nodeType === 3) return node.nodeValue || "";
    if (node.nodeType !== 1) return "";
    const role = ttmlInheritedAttribute(node, "role", paragraph);
    if (ttmlIgnoredRole(role)) return "";
    const isBackground = ttmlBackgroundRole(role);
    if (node !== root && isBackground !== backgroundMode && (isBackground || backgroundMode)) return "";
    return [...Array(node.childNodes?.length || 0).keys()]
      .map((index) => collect(node.childNodes.item(index)))
      .join("");
  };
  return collect(root).replace(/\s+/g, " ").trim();
}

function ttmlWordsText(words) {
  return words.reduce((text, word, index) => {
    const separator = index > 0 && word.spaceBefore && !/\s$/.test(text) ? " " : "";
    return `${text}${separator}${word.text}`;
  }, "").trim();
}

function ttmlElements(document, name) {
  const all = document?.getElementsByTagName?.("*");
  return [...Array(all?.length || 0).keys()]
    .map((index) => all.item(index))
    .filter((element) => ttmlNodeName(element) === name.toLowerCase());
}

function ttmlToLrc(ttml) {
  const source = String(ttml || "").trim();
  if (!source) return "";
  let parseError = "";
  const document = new DOMParser({
    onError: (level, message) => {
      if (level === "error" || level === "fatalError") parseError = String(message || level);
    }
  }).parseFromString(source, "application/xml");
  if (!document?.documentElement || parseError || document.getElementsByTagName("parsererror").length) return "";

  const audioNodes = ttmlElements(document, "audio");
  const offset = Number(audioNodes.map((node) => ttmlAttribute(node, "lyricOffset"))
    .find(Boolean) || 0) || 0;
  const paragraphs = ttmlElements(document, "p");
  const parsed = [];

  const addLine = (root, paragraph, isBackground) => {
    const words = ttmlTimedSpans(root, paragraph, offset, isBackground);
    const explicitStart = parseTtmlTime(ttmlAttribute(root, "begin"));
    const paragraphStart = parseTtmlTime(ttmlAttribute(paragraph, "begin"));
    const start = Number.isFinite(explicitStart)
      ? explicitStart + offset
      : (words[0]?.start ?? (Number.isFinite(paragraphStart) ? paragraphStart + offset : null));
    if (!Number.isFinite(start)) return;
    const text = words.length ? ttmlWordsText(words) : ttmlPlainText(root, paragraph, isBackground);
    if (!text) return;
    const rawAgent = ttmlInheritedAttribute(root, "agent", paragraph.parentNode);
    parsed.push({ start, text, words, isBackground, agent: normalizeLyricsAgent(rawAgent) });
  };

  for (const paragraph of paragraphs) {
    const paragraphRole = ttmlInheritedAttribute(paragraph, "role", paragraph.parentNode);
    const paragraphIsBackground = ttmlBackgroundRole(paragraphRole);
    addLine(paragraph, paragraph, paragraphIsBackground);
    if (!paragraphIsBackground) {
      const backgroundRoots = [];
      const findBackground = (element) => {
        for (const child of ttmlElementChildren(element)) {
          if (ttmlBackgroundRole(ttmlInheritedAttribute(child, "role", paragraph))) {
            backgroundRoots.push(child);
          } else {
            findBackground(child);
          }
        }
      };
      findBackground(paragraph);
      backgroundRoots.forEach((root) => addLine(root, paragraph, true));
    }
  }

  parsed.sort((left, right) => left.start - right.start || Number(left.isBackground) - Number(right.isBackground));
  return parsed.flatMap((line) => {
    const role = line.isBackground ? "{bg}" : (line.agent ? `{agent:${line.agent}}` : "");
    const output = [`${formatLyricsTimestamp(line.start)}${role}${line.text}`];
    if (line.words.length) {
      output.push(`<${line.words.map((word) => `${word.text}:${word.start}:${word.end}`).join("|")}>`);
    }
    return output;
  }).join("\n");
}

function lyricsPlusToLrc(response) {
  const lyrics = Array.isArray(response?.lyrics) ? response.lyrics : [];
  if (!lyrics.length) return "";
  const isWordSync = String(response?.type || "").toLowerCase() === "word";
  const lines = [];
  let lastWasBg = false;
  for (const line of lyrics) {
    const timeMs = Number(line?.time || 0);
    const mainWords = Array.isArray(line?.syllabus)
      ? line.syllabus.filter((word) => !word?.isBackground)
      : [];
    const bgWords = Array.isArray(line?.syllabus)
      ? line.syllabus.filter((word) => word?.isBackground)
      : [];
    const agent = normalizeLyricsAgent(line?.element?.singer);
    const agentTag = agent ? `{agent:${agent}}` : "";
    const mainText = isWordSync && mainWords.length
      ? mainWords.map((word) => word.text || "").join("").trim()
      : String(line?.text || "").trim();
    if (mainText) {
      lines.push(`${formatLyricsTimestamp(timeMs / 1000)}${agentTag}${mainText}`);
      lastWasBg = false;
      if (isWordSync && mainWords.length) {
        lines.push(`<${mainWords
          .filter((word) => String(word?.text || "").trim())
          .map((word) => `${String(word.text).replace(/[|<>]/g, "").trim()}:${Number(word.time || 0) / 1000}:${(Number(word.time || 0) + Number(word.duration || 0)) / 1000}`)
          .join("|")}>`);
      }
    }
    if (bgWords.length) {
      const bgText = bgWords.map((word) => word.text || "").join("").trim();
      if (bgText) {
        const bgTime = Math.min(...bgWords.map((word) => Number(word.time || timeMs)));
        lines.push(`${formatLyricsTimestamp(bgTime / 1000)}${lastWasBg ? "" : "{bg}"}${bgText}`);
        lastWasBg = true;
        if (isWordSync) {
          lines.push(`<${bgWords
            .filter((word) => String(word?.text || "").trim())
            .map((word) => `${String(word.text).replace(/[|<>]/g, "").trim()}:${Number(word.time || 0) / 1000}:${(Number(word.time || 0) + Number(word.duration || 0)) / 1000}`)
            .join("|")}>`);
        }
      }
    }
  }
  return lines.join("\n");
}

function paxsenixResponseToLrc(response) {
  if (response?.ttmlContent) {
    const lrc = ttmlToLrc(response.ttmlContent);
    if (lrc) return lrc;
  }
  if (response?.elrcMultiPerson) return String(response.elrcMultiPerson).trim();
  if (response?.elrc) return String(response.elrc).trim();
  if (response?.plain) return String(response.plain).trim();
  const content = Array.isArray(response?.content) ? response.content : [];
  if (!content.length) return "";
  const hasWordLevel = String(response?.type || "").toLowerCase() === "syllable";
  const lines = [];
  for (const line of content) {
    const words = Array.isArray(line?.text) ? line.text : [];
    const text = words
      .map((word) => word.text || "")
      .join(hasWordLevel ? "" : " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    if (!hasWordLevel) {
      lines.push(text);
      continue;
    }
    const timeMs = Number(line.timestamp || 0);
    const agent = line.background ? "{bg}" : (line.oppositeTurn ? "{agent:v2}" : "{agent:v1}");
    lines.push(`${formatLyricsTimestamp(timeMs / 1000)}${agent}${text}`);
    lines.push(`<${words
      .filter((word) => String(word?.text || "").trim())
      .map((word) => `${String(word.text).replace(/[|<>]/g, "").trim()}:${Number(word.timestamp || 0) / 1000}:${Number(word.endtime || 0) / 1000}`)
      .join("|")}>`);
  }
  return lines.join("\n");
}

function kugouKeyword(context) {
  return [context.title, context.artist].filter(Boolean).join(" - ") +
    (context.album ? ` ${context.album}` : "");
}

function kugouDurationSeconds(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return null;
  return number > 1000 ? Math.round(number / 1000) : Math.round(number);
}

function normalizeKugouLyrics(rawLyrics) {
  return String(rawLyrics || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\[\d{1,2}:\d{2}\.\d{2,3}\]/.test(line))
    .join("\n");
}

function neteaseYrcToLrc(rawLyrics) {
  const output = [];
  for (const rawLine of String(rawLyrics || "").split(/\r?\n/)) {
    const lineMatch = rawLine.trim().match(/^\[(\d+),(\d+)\](.*)$/);
    if (!lineMatch) continue;
    const lineStartMs = Number(lineMatch[1]);
    const content = lineMatch[3] || "";
    const timingPattern = /\((\d+),(\d+),(?:\d+)\)/g;
    const matches = [...content.matchAll(timingPattern)];
    if (!matches.length) continue;
    const words = matches.map((match, index) => {
      const nextIndex = matches[index + 1]?.index ?? content.length;
      const text = content.slice(match.index + match[0].length, nextIndex);
      const startMs = Number(match[1]);
      const durationMs = Number(match[2]);
      return {
        text: text.replace(/[|<>]/g, ""),
        start: startMs / 1000,
        end: (startMs + Math.max(1, durationMs)) / 1000
      };
    }).filter((word) => word.text && Number.isFinite(word.start) && Number.isFinite(word.end));
    const text = words.map((word) => word.text).join("").trim();
    if (!text || !words.length) continue;
    output.push(`${formatLyricsTimestamp(lineStartMs / 1000)}${text}`);
    output.push(`<${words.map((word) => `${word.text}:${word.start}:${word.end}`).join("|")}>`);
  }
  return output.join("\n");
}

function randomGuid() {
  return crypto.randomBytes(8).toString("hex");
}

function randomUuid() {
  return crypto.randomUUID();
}

function getMxmDateStr(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function signMusixmatchUrl(urlObj, date = new Date()) {
  const urlString = urlObj.toString();
  const hmac = crypto.createHmac("sha1", MUSIXMATCH_SIGNATURE_SECRET);
  hmac.update(urlString);
  hmac.update(getMxmDateStr(date));
  const sig = hmac.digest("base64") + "\n";
  
  const signedUrl = new URL(urlString);
  signedUrl.searchParams.set("signature", sig);
  signedUrl.searchParams.set("signature_protocol", "sha1");
  return signedUrl;
}

function musixmatchHeaders() {
  return {
    "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 13; Pixel 6 Build/T3B2.230316.003)",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Cookie": "AWSELBCORS=0; AWSELB=0"
  };
}

function musixmatchTrackMetadata(track = {}) {
  const info = track || {};
  return {
    id: info.track_id ?? info.common_track_id ?? info.track_mbid ?? "",
    trackName: String(info.track_name || "").trim(),
    artistName: String(info.artist_name || "").trim(),
    albumName: String(info.album_name || "").trim(),
    duration: Number(info.track_length) || null,
    hasSubtitle: Number(info.has_subtitles) === 1 || info.subtitle_id != null,
    hasLyrics: Number(info.has_lyrics) === 1 || info.lyrics_id != null,
    instrumental: Number(info.instrumental) === 1,
    explicit: Number(info.explicit) === 1
  };
}

function cleanMusixmatchWatermark(text) {
  if (!text) return "";
  return String(text)
    .replace(/^\s*\*\*\*\*\*\*\*\*\*.*$/gm, "")
    .replace(/^\s*This Lyrics is NOT for Commercial use.*$/gim, "")
    .replace(/^\s*Lyrics powered by .+$/gim, "")
    .replace(/^\s*Writer\(s\):.*$/gim, "")
    .replace(/^\s*Copyright:.*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseMusixmatchSubtitle(subtitleBody) {
  const raw = String(subtitleBody || "").trim();
  if (!raw) return "";
  return raw;
}

async function queryMusixmatchTracks(context, options = {}) {
  if (!context.title) return [];
  const timeoutMs = options.noTimeout ? 0 : DEFAULT_FETCH_TIMEOUT_MS;
  const titleCandidates = Array.isArray(context.titleCandidates) && context.titleCandidates.length
    ? context.titleCandidates.slice(0, 3)
    : [context.title];
  const artistCandidates = Array.isArray(context.artistCandidates) && context.artistCandidates.length
    ? context.artistCandidates.slice(0, 3)
    : [context.artist];
  const collected = [];
  const seen = new Set();
  const userToken = await getMusixmatchUserToken();
  const runQuery = async (forceRefresh = false, artistless = false) => {
    const token = forceRefresh ? await getMusixmatchUserToken({ forceRefresh: true }) : userToken;
    let got401 = false;
    for (const title of titleCandidates) {
      if (!title) continue;
      for (const artist of artistless ? [""] : artistCandidates) {
        const url = new URL("/ws/1.1/track.search", MUSIXMATCH_ORIGIN);
        url.searchParams.set("app_id", MUSIXMATCH_APP_ID);
        url.searchParams.set("usertoken", token);
        url.searchParams.set("format", "json");
        url.searchParams.set("page_size", "6");
        url.searchParams.set("page", "1");
        url.searchParams.set("q_track", String(title || ""));
        if (artist) url.searchParams.set("q_artist", String(artist));
        if (context.duration) url.searchParams.set("f_duration_from", String(Math.max(0, Math.floor(context.duration - 12))));
        if (context.duration) url.searchParams.set("f_duration_to", String(Math.ceil(context.duration + 12)));
        if (context.album) url.searchParams.set("q_album", String(context.album));
        const signedUrl = signMusixmatchUrl(url);
        let data;
        try {
          data = await fetchJson(signedUrl, { headers: musixmatchHeaders() }, timeoutMs, "Musixmatch search");
        } catch (error) {
          const msg = errorMessage(error);
          if (/401|unauthorized/i.test(msg)) got401 = true;
          continue;
        }
        const status = Number(data?.message?.header?.status_code);
        if (status === 401) got401 = true;
        const list = Array.isArray(data?.message?.body?.track_list) ? data.message.body.track_list : [];
        for (const entry of list) {
          const meta = musixmatchTrackMetadata(entry.track || {});
          if (!meta.id) continue;
          const key = `${meta.id}:${String(meta.trackName || "").toLowerCase()}:${String(meta.artistName || "").toLowerCase()}`;
          if (seen.has(key)) continue;
          seen.add(key);
          collected.push(meta);
        }
      }
    }
    return got401;
  };
  const got401First = await runQuery(false);
  if (got401First && collected.length === 0) await runQuery(true);
  if ((collected.length === 0 || usesNonLatinScript(context.artist)) && context.artist) {
    await runQuery(got401First, true);
  }
  return collected;
}

async function queryMusixmatchSubtitle(trackId, options = {}) {
  if (!trackId) return null;
  const timeoutMs = options.noTimeout ? 0 : DEFAULT_FETCH_TIMEOUT_MS;
  const userToken = await getMusixmatchUserToken();
  const makeParams = (token) => [
    ["app_id", MUSIXMATCH_APP_ID],
    ["usertoken", token],
    ["format", "json"],
    ["track_id", String(trackId)],
    ["subtitle_format", "lrc"]
  ];
  const runFetch = async (token) => {
    let got401 = false;
    const subtitleUrl = new URL("/ws/1.1/track.subtitle.get", MUSIXMATCH_ORIGIN);
    for (const [k, v] of makeParams(token)) subtitleUrl.searchParams.set(k, v);
    const signedSubtitleUrl = signMusixmatchUrl(subtitleUrl);
    try {
      const data = await fetchJson(signedSubtitleUrl, { headers: musixmatchHeaders() }, timeoutMs, "Musixmatch subtitle");
      const status = Number(data?.message?.header?.status_code);
      if (status === 401) got401 = true;
      const subtitle = data?.message?.body?.subtitle;
      if (subtitle?.subtitle_body) {
        const cleaned = cleanMusixmatchWatermark(parseMusixmatchSubtitle(subtitle.subtitle_body));
        if (cleaned) return { result: { type: "subtitle", language: subtitle.subtitle_language || "", body: cleaned }, got401 };
      }
    } catch (error) {
      if (/401|unauthorized/i.test(errorMessage(error))) got401 = true;
    }
    const lyricsUrl = new URL("/ws/1.1/track.lyrics.get", MUSIXMATCH_ORIGIN);
    for (const [k, v] of makeParams(token)) lyricsUrl.searchParams.set(k, v);
    const signedLyricsUrl = signMusixmatchUrl(lyricsUrl);
    try {
      const data = await fetchJson(signedLyricsUrl, { headers: musixmatchHeaders() }, timeoutMs, "Musixmatch lyrics");
      const status = Number(data?.message?.header?.status_code);
      if (status === 401) got401 = true;
      const lyrics = data?.message?.body?.lyrics;
      if (lyrics?.lyrics_body) {
        const cleaned = cleanMusixmatchWatermark(String(lyrics.lyrics_body));
        if (cleaned) return { result: { type: "lyrics", language: lyrics.lyrics_language || "", body: cleaned }, got401 };
      }
    } catch (error) {
      if (/401|unauthorized/i.test(errorMessage(error))) got401 = true;
    }
    return { result: null, got401 };
  };
  const first = await runFetch(userToken);
  if (first.result) return first.result;
  if (first.got401) {
    const freshToken = await getMusixmatchUserToken({ forceRefresh: true });
    const retry = await runFetch(freshToken);
    if (retry.result) return retry.result;
  }
  return null;
}

async function findLyricsCandidatesFromMusixmatch(context, limit = 8, options = {}) {
  if (!context.title) return [];
  const tracks = await queryMusixmatchTracks(context, options);
  if (!tracks.length) return [];
  const ranked = tracks
    .map((track) => ({
      track,
      score: scoreResult(track, context.title, context.artist, context.duration, context.artistTokens)
    }))
    .filter(({ score }) => score >= 3.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(3, Math.min(limit, 8)));
  const settled = await Promise.allSettled(ranked.map(async ({ track, score }) => {
    const fetched = await queryMusixmatchSubtitle(track.id, options);
    if (!fetched || !fetched.body) return null;
    const isSubtitle = fetched.type === "subtitle";
    const hasTiming = isSubtitle && /^\s*\[\d{1,2}:\d{2}/m.test(fetched.body);
    return makeLyricsCandidate({
      context,
      providerKey: MUSIXMATCH_PROVIDER,
      sourceId: `musixmatch:${track.id}:${fetched.language || "xx"}`,
      title: track.trackName,
      artist: track.artistName,
      album: track.albumName,
      duration: track.duration,
      synced: hasTiming,
      rawLyrics: fetched.body,
      score: score + (isSubtitle ? 3 : 1)
    });
  }));
  const candidates = settled
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => r.value);
  const errors = settled
    .filter((r) => r.status === "rejected")
    .map((r) => errorMessage(r.reason));
  if (!candidates.length && errors.length) throw new Error(uniqueErrorSummary(errors) || "Musixmatch failed");
  return dedupeLyricsCandidates(candidates)
    .sort((left, right) => compareLyricsQuality(left, right, [MUSIXMATCH_PROVIDER]))
    .slice(0, limit);
}

function neteaseSongMetadata(song = {}) {
  const artists = Array.isArray(song.artists) ? song.artists : (Array.isArray(song.ar) ? song.ar : []);
  const album = song.album || song.al || {};
  const durationMs = Number(song.duration || song.dt || 0);
  return {
    id: song.id,
    trackName: String(song.name || "").trim(),
    artistName: artists.map((artist) => artist?.name).filter(Boolean).join(", "),
    albumName: String(album?.name || "").trim(),
    duration: Number.isFinite(durationMs) && durationMs > 0 ? durationMs / 1000 : null
  };
}

async function queryNeteaseSongs(context, options = {}) {
  const search = async (keyword) => {
    const url = new URL("/api/cloudsearch/pc", NETEASE_ORIGIN);
    const params = { s: keyword, type: 1, offset: 0, limit: 12, total: true };
    const data = await fetchJson(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: `${NETEASE_ORIGIN}/`,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
      },
      body: new URLSearchParams(params).toString()
    }, options.timeoutMs ?? DEFAULT_FETCH_TIMEOUT_MS, "NetEase Music search");
    return (Array.isArray(data?.result?.songs) ? data.result.songs : [])
      .map(neteaseSongMetadata)
      .filter((song) => song.id && song.trackName);
  };
  const exact = await search([context.title, context.artist].filter(Boolean).join(" "));
  return exact.length || !context.artist ? exact : search(context.title);
}

async function queryNeteaseLyrics(id, options = {}) {
  const url = new URL("/api/song/lyric", NETEASE_ORIGIN);
  url.searchParams.set("id", String(id));
  for (const key of ["lv", "kv", "tv", "yv"]) url.searchParams.set(key, "-1");
  return fetchJson(url, {
    headers: { Referer: `${NETEASE_ORIGIN}/song?id=${encodeURIComponent(id)}` }
  }, options.timeoutMs ?? DEFAULT_FETCH_TIMEOUT_MS, "NetEase Music lyrics");
}

async function queryKugouSongs(context, options = {}) {
  const url = new URL("/api/v3/search/song", KUGOU_MOBILE_ORIGIN);
  url.searchParams.set("version", "9108");
  url.searchParams.set("plat", "0");
  url.searchParams.set("pagesize", "8");
  url.searchParams.set("showtype", "0");
  url.searchParams.set("keyword", kugouKeyword(context));
  const data = await fetchJson(
    url,
    {},
    options.timeoutMs ?? KUGOU_FETCH_TIMEOUT_MS,
    "KuGou song search"
  );
  return Array.isArray(data?.data?.info) ? data.data.info : [];
}

async function queryKugouLyricsByHash(hash, options = {}) {
  if (!hash) return [];
  const url = new URL("/search", KUGOU_ORIGIN);
  url.searchParams.set("ver", "1");
  url.searchParams.set("man", "yes");
  url.searchParams.set("client", "pc");
  url.searchParams.set("hash", hash);
  const data = await fetchJson(url, {}, options.timeoutMs ?? KUGOU_FETCH_TIMEOUT_MS, "KuGou lyric search");
  return Array.isArray(data?.candidates) ? data.candidates : [];
}

async function queryKugouLyricsByKeyword(context, options = {}) {
  const url = new URL("/search", KUGOU_ORIGIN);
  url.searchParams.set("ver", "1");
  url.searchParams.set("man", "yes");
  url.searchParams.set("client", "pc");
  url.searchParams.set("keyword", kugouKeyword(context));
  if (context.duration) url.searchParams.set("duration", String(Math.round(context.duration * 1000)));
  const data = await fetchJson(url, {}, options.timeoutMs ?? KUGOU_FETCH_TIMEOUT_MS, "KuGou lyric search");
  return Array.isArray(data?.candidates) ? data.candidates : [];
}

async function downloadKugouLyrics(candidate, options = {}) {
  if (!candidate?.id || !candidate?.accesskey) return "";
  const url = new URL("/download", KUGOU_ORIGIN);
  url.searchParams.set("fmt", "lrc");
  url.searchParams.set("charset", "utf8");
  url.searchParams.set("client", "pc");
  url.searchParams.set("ver", "1");
  url.searchParams.set("id", String(candidate.id));
  url.searchParams.set("accesskey", candidate.accesskey);
  const data = await fetchJson(url, {}, options.timeoutMs ?? KUGOU_FETCH_TIMEOUT_MS, "KuGou lyric download");
  const content = typeof data?.content === "string" ? data.content : "";
  if (!content) return "";
  return normalizeKugouLyrics(Buffer.from(content, "base64").toString("utf8"));
}

async function queryBetterLyrics(context, options = {}) {
  if ((providerCooldowns.get(BETTER_LYRICS_PROVIDER) || 0) > Date.now()) return "";
  const url = new URL("/getLyrics", BETTER_LYRICS_ORIGIN);
  url.searchParams.set("s", context.title);
  url.searchParams.set("a", context.artist);
  if (context.duration) url.searchParams.set("d", String(context.duration));
  if (context.album) url.searchParams.set("al", context.album);
  try {
    const data = await fetchJson(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      },
      options.timeoutMs ?? EXTENDED_LYRICS_FETCH_TIMEOUT_MS,
      "BetterLyrics"
    );
    return typeof data?.ttml === "string" ? ttmlToLrc(data.ttml) : "";
  } catch {
    providerCooldowns.set(BETTER_LYRICS_PROVIDER, Date.now() + PROVIDER_COOLDOWN_MS);
    return "";
  }
}

async function queryLyricsPlus(context, options = {}) {
  if ((providerCooldowns.get(LYRICS_PLUS_PROVIDER) || 0) > Date.now()) {
    return { lrc: "", sourceId: "lyricsplus" };
  }
  const timeoutMs = options.timeoutMs ?? EXTENDED_LYRICS_FETCH_TIMEOUT_MS;
  const errors = [];
  for (const baseUrl of LYRICS_PLUS_BASE_URLS) {
    try {
      const url = new URL("/v2/lyrics/get", baseUrl);
      url.searchParams.set("title", context.title);
      url.searchParams.set("artist", context.artist);
      if (context.duration) url.searchParams.set("duration", String(context.duration));
      if (context.album) url.searchParams.set("album", context.album);
      const data = await fetchJson(url, {}, timeoutMs, "LyricsPlus");
      const lrc = lyricsPlusToLrc(data);
      if (lrc) return { lrc, sourceId: `lyricsplus:${baseUrl}` };
    } catch (error) {
      errors.push(errorMessage(error));
    }
  }
  if (errors.length) providerCooldowns.set(LYRICS_PLUS_PROVIDER, Date.now() + PROVIDER_COOLDOWN_MS);
  return { lrc: "", sourceId: "lyricsplus" };
}

let appleMusicToken = "";

async function getAppleMusicToken(options = {}) {
  if (appleMusicToken) return appleMusicToken;
  const timeoutMs = options.timeoutMs ?? EXTENDED_LYRICS_FETCH_TIMEOUT_MS;
  const mainPage = await fetchText(APPLE_MUSIC_ORIGIN, {}, timeoutMs, "Apple Music token page");
  const scriptMatch = mainPage.match(/\/assets\/index~[^"'<>]+\.js/);
  if (!scriptMatch) throw new Error("Could not find Apple Music token script");
  const script = await fetchText(`${APPLE_MUSIC_ORIGIN}${scriptMatch[0]}`, {}, timeoutMs, "Apple Music token script");
  const tokenMatch = script.match(/eyJh[^"']+/);
  if (!tokenMatch) throw new Error("Could not find Apple Music token");
  appleMusicToken = tokenMatch[0];
  return appleMusicToken;
}

async function searchPaxsenixAppleMusic(context, options = {}) {
  const timeoutMs = options.timeoutMs ?? EXTENDED_LYRICS_FETCH_TIMEOUT_MS;
  const itunesUrl = new URL("/search", ITUNES_SEARCH_ORIGIN);
  itunesUrl.searchParams.set("term", [context.title, context.artist].filter(Boolean).join(" "));
  itunesUrl.searchParams.set("media", "music");
  itunesUrl.searchParams.set("entity", "song");
  itunesUrl.searchParams.set("limit", "25");
  itunesUrl.searchParams.set("country", "US");
  try {
    const data = await fetchJson(
      itunesUrl,
      {},
      timeoutMs,
      "Paxsenix iTunes search"
    );
    const results = Array.isArray(data?.results) ? data.results : [];
    if (results.length) {
      return results.map((item) => ({
        id: String(item.trackId || ""),
        trackName: item.trackName || "",
        artistName: item.artistName || "",
        albumName: item.collectionName || "",
        duration: item.trackTimeMillis ? Math.round(Number(item.trackTimeMillis) / 1000) : null
      })).filter((item) => item.id);
    }
    return [];
  } catch {
    // Older Apple Music catalog search remains as a compatibility fallback.
  }

  const token = await getAppleMusicToken(options);
  const url = new URL("/v1/catalog/us/search", APPLE_MUSIC_API_ORIGIN);
  url.searchParams.set("term", [context.title, context.artist].filter(Boolean).join(" "));
  url.searchParams.set("types", "songs");
  url.searchParams.set("limit", "25");
  url.searchParams.set("l", "en-US");
  url.searchParams.set("platform", "web");
  url.searchParams.set("format[resources]", "map");
  url.searchParams.set("include[songs]", "artists");
  url.searchParams.set("extend", "artistUrl");
  const data = await fetchJson(
    url,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Origin": "https://music.apple.com",
        "Referer": "https://music.apple.com/",
        "Accept-Language": "en-US,en;q=0.5",
        "x-apple-renewal": "true"
      }
    },
    timeoutMs,
    "Paxsenix Apple Music search"
  );
  const ids = Array.isArray(data?.results?.songs?.data) ? data.results.songs.data : [];
  const resources = data?.resources?.songs || {};
  return ids.map((item) => {
    const detail = resources[item.id] || item;
    const attr = detail.attributes || {};
    return {
      id: item.id,
      trackName: attr.name || "",
      artistName: attr.artistName || "",
      albumName: attr.albumName || "",
      duration: attr.durationInMillis ? Math.round(Number(attr.durationInMillis) / 1000) : null
    };
  }).filter((item) => item.id);
}

async function queryPaxsenixLyricsById(id, options = {}) {
  if (!id) return "";
  const url = new URL("/apple-music/lyrics", PAXSENIX_ORIGIN);
  url.searchParams.set("id", id);
  const data = await fetchJson(
    url,
    {
      headers: {
        "User-Agent": "Auralane/0.1"
      }
    },
    options.timeoutMs ?? EXTENDED_LYRICS_FETCH_TIMEOUT_MS,
    "Paxsenix lyrics"
  );
  return paxsenixResponseToLrc(data);
}

function parseTimestamp(minutes, seconds, fraction) {
  const millis = fraction
    ? Number(fraction.padEnd(3, "0").slice(0, 3))
    : 0;
  return Number(minutes) * 60 + Number(seconds) + millis / 1000;
}

function parseTimestampText(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?$/);
  return match ? parseTimestamp(match[1], match[2], match[3]) : null;
}

function formatLyricsTimestamp(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const rest = Math.floor(safeSeconds % 60);
  const centiseconds = Math.floor((safeSeconds - Math.floor(safeSeconds)) * 100);
  return `[${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}]`;
}

function lyricsTextFromLines(lines = []) {
  return (lines || []).map((line) => {
    const text = String(line?.text || "").trim();
    if (!text) return "";
    const role = line.isBackground ? "{bg}" : line.agent ? `{agent:${line.agent}}` : "";
    const header = line.time == null ? `${role}${text}` : `${formatLyricsTimestamp(line.time)}${role}${text}`;
    if (!Array.isArray(line.words) || !line.words.length) return header;
    const block = line.words
      .filter((word) => word?.text && Number.isFinite(Number(word.start)) && Number.isFinite(Number(word.end)))
      .map((word) => `${String(word.text).replace(/[|<>]/g, "").trim()}:${Number(word.start)}:${Number(word.end)}`)
      .filter(Boolean)
      .join("|");
    return block ? `${header}\n<${block}>` : header;
  }).filter(Boolean).join("\n");
}

function isCreditLine(text) {
  const value = String(text || "").trim().toLowerCase();
  return !value ||
    value.startsWith("synced by") ||
    value.startsWith("lyrics by") ||
    value.startsWith("music by") ||
    value.startsWith("arranged by");
}

function expandParentheticalBackgroundLines(sourceLines = []) {
  const expanded = [];
  const tokenize = (value) => String(value || "").trim().split(/\s+/).filter(Boolean);
  for (let sourceIndex = 0; sourceIndex < sourceLines.length; sourceIndex += 1) {
    const sourceLine = sourceLines[sourceIndex];
    const line = { ...sourceLine };
    const matches = [...String(line.text || "").matchAll(/\(([^()]+)\)/g)];
    if (line.isBackground || !matches.length) {
      expanded.push(line);
      continue;
    }
    const lineStart = line.time == null ? NaN : Number(line.time);
    if (!Number.isFinite(lineStart)) {
      expanded.push(line);
      continue;
    }
    const backgroundText = matches.map((match) => match[1].trim()).filter(Boolean).join(" ");
    const mainText = String(line.text || "")
      .replace(/\s*\([^()]+\)/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!backgroundText || !mainText) {
      expanded.push(line);
      continue;
    }

    const sourceWords = Array.isArray(line.words) ? line.words : [];
    const mainWordCount = tokenize(mainText).length;
    const mainWords = sourceWords.slice(0, Math.min(mainWordCount, sourceWords.length));
    const timedBackgroundWords = sourceWords.slice(mainWordCount);
    line.text = mainText;
    if (sourceWords.length) line.words = mainWords;
    expanded.push(line);

    const backgroundTokens = tokenize(backgroundText);
    const usableTimedWords = timedBackgroundWords.length > backgroundTokens.length
      ? timedBackgroundWords.slice(-backgroundTokens.length)
      : timedBackgroundWords;
    const missingCount = Math.max(0, backgroundTokens.length - usableTimedWords.length);
    const firstTimedStart = Math.min(
      ...usableTimedWords.map((word) => Number(word.start)).filter(Number.isFinite)
    );
    const mainEnd = Math.max(
      Number(line.time || 0),
      ...mainWords.map((word) => Number(word.end)).filter(Number.isFinite)
    );
    const secondsPerToken = 0.38;
    const inferredDuration = Math.max(0.52, backgroundTokens.length * secondsPerToken);
    const nextTimedLine = sourceLines.slice(sourceIndex + 1).find((candidate) =>
      candidate?.time != null && Number.isFinite(Number(candidate.time)) && Number(candidate.time) > lineStart
    );
    const mainTokenCount = Math.max(1, tokenize(mainText).length);
    const estimatedLineSpan = Math.max(1.2, Math.min(10, mainTokenCount * 0.5 + 1.4));
    const availableLineSpan = nextTimedLine
      ? Math.max(0.1, Math.min(Number(nextTimedLine.time) - lineStart, estimatedLineSpan))
      : estimatedLineSpan;
    const originalText = String(line.text || "");
    const firstParentheticalIndex = Math.max(0, Number(matches[0]?.index || 0));
    const textWithoutParenthesesLength = Math.max(1, originalText.replace(/\s*\([^()]+\)/g, "").trim().length);
    const placementRatio = Math.max(0, Math.min(1, firstParentheticalIndex / textWithoutParenthesesLength));
    const inferredByPlacement = lineStart + Math.max(0, availableLineSpan - inferredDuration) * placementRatio;
    const inferredTokenDuration = inferredDuration / Math.max(1, backgroundTokens.length);
    const inferredStart = Number.isFinite(firstTimedStart)
      ? Math.max(lineStart, firstTimedStart - (missingCount * secondsPerToken))
      : Math.max(lineStart, inferredByPlacement, mainEnd > lineStart ? mainEnd - inferredDuration : lineStart);
    const inferredWords = backgroundTokens.slice(0, missingCount).map((text, index) => ({
      text,
      start: inferredStart + (index * inferredTokenDuration),
      end: inferredStart + ((index + 1) * inferredTokenDuration)
    }));
    const backgroundWords = [
      ...inferredWords,
      ...usableTimedWords.map((word, index) => ({
        ...word,
        text: backgroundTokens[missingCount + index] || word.text
      }))
    ];
    const backgroundStart = Math.min(
      ...backgroundWords.map((word) => Number(word.start)).filter(Number.isFinite)
    );
    expanded.push({
      time: Number.isFinite(backgroundStart) ? backgroundStart : Number(line.time),
      text: backgroundText,
      words: backgroundWords,
      isBackground: true,
      inferredBackground: true
    });
  }
  return expanded.sort((a, b) => (a.time ?? Number.MAX_SAFE_INTEGER) - (b.time ?? Number.MAX_SAFE_INTEGER));
}

function parseLyrics(text) {
  const lines = [];
  const timestamp = /\[(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?\]/g;
  const inlineWordTimestamp = /<(\d{1,2}):(\d{2})\.(\d{2,3})>([^<]*)/g;
  let lastLine = null;

  const parseStructuredWordBlock = (value) => {
    const body = String(value || "").trim().replace(/^</, "").replace(/>$/, "");
    return body.split("|").map((part) => {
      const endSplit = part.lastIndexOf(":");
      const startSplit = endSplit > 0 ? part.lastIndexOf(":", endSplit - 1) : -1;
      if (startSplit <= 0 || endSplit <= startSplit) return null;
      const start = Number(part.slice(startSplit + 1, endSplit));
      const end = Number(part.slice(endSplit + 1));
      const word = part.slice(0, startSplit).trim();
      if (!word || !Number.isFinite(start) || !Number.isFinite(end)) return null;
      return { text: word, start, end };
    }).filter(Boolean);
  };

  const parseInlineWords = (value, lineEnd = null) => {
    const matches = [...String(value || "").matchAll(inlineWordTimestamp)];
    if (!matches.length) return [];
    const words = [];
    for (let index = 0; index < matches.length; index += 1) {
      const match = matches[index];
      const start = parseTimestamp(match[1], match[2], match[3]);
      const next = matches[index + 1]
        ? parseTimestamp(matches[index + 1][1], matches[index + 1][2], matches[index + 1][3])
        : lineEnd;
      const rawWords = String(match[4] || "").trim().split(/\s+/).filter(Boolean);
      if (!rawWords.length) continue;
      const end = Number.isFinite(next) && next > start ? next : start + 0.5;
      rawWords.forEach((word, wordIndex) => {
        const wordStart = start + ((end - start) * wordIndex / rawWords.length);
        const wordEnd = start + ((end - start) * (wordIndex + 1) / rawWords.length);
        words.push({ text: word, start: wordStart, end: wordEnd });
      });
    }
    return words;
  };

  for (const rawLine of String(text || "").split(/\r?\n/)) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;
    const bgMatch = trimmed.match(/^\[bg:\s*(.*)\]$/i);
    if (bgMatch) {
      const words = parseInlineWords(bgMatch[1]);
      const lyricText = bgMatch[1].replace(inlineWordTimestamp, "$4").trim();
      if (!isCreditLine(lyricText)) {
        lastLine = {
          time: words[0]?.start ?? null,
          text: lyricText,
          words,
          isBackground: true
        };
        lines.push(lastLine);
      }
      continue;
    }
    if (/^<[^>]+>$/.test(trimmed)) {
      if (lastLine) {
        const words = parseStructuredWordBlock(trimmed);
        if (words.length) lastLine.words = words;
      }
      continue;
    }

    const matches = [...trimmed.matchAll(timestamp)];
    const roleText = trimmed.replace(timestamp, "").trim();
    const agent = agentFromRoleText(roleText);
    const isBackground = /^\{bg\}/i.test(roleText);
    let lyricText = trimmed
      .replace(timestamp, "")
      .replace(/^\{agent:[^}]+\}/i, "")
      .replace(/^\{v?\d+\}/i, "")
      .replace(/^\[v?\d+\]/i, "")
      .replace(/^\{bg\}/i, "")
      .replace(/^(?:agent|voice|singer)?\s*v?\d+\s*:\s*/i, "")
      .trim();
    const inlineWords = parseInlineWords(lyricText);
    lyricText = lyricText.replace(inlineWordTimestamp, "$4").trim();
    if (isCreditLine(lyricText)) continue;

    if (!matches.length) {
      lastLine = { time: null, text: lyricText, agent, isBackground, ...(inlineWords.length ? { words: inlineWords } : {}) };
      lines.push(lastLine);
      continue;
    }

    for (const match of matches) {
      lastLine = {
        time: parseTimestamp(match[1], match[2], match[3]),
        text: lyricText,
        agent,
        isBackground,
        ...(inlineWords.length ? { words: inlineWords } : {})
      };
      lines.push(lastLine);
    }
  }

  return expandParentheticalBackgroundLines(lines);
}

function emptyLyricsResult(context, provider, attemptedProviders = [provider]) {
  return {
    found: false,
    provider: providerLabel(provider),
    providerKey: provider,
    attemptedProviders: attemptedProviders.map(providerLabel),
    title: context.title || context.rawTitle || "",
    artist: context.artist,
    album: context.album,
    synced: false,
    lines: []
  };
}

function lyricsCandidatePreview(lines = []) {
  return (lines || [])
    .map((line) => String(line?.text || "").trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(" / ");
}

function makeLyricsCandidate({
  context,
  providerKey,
  sourceId,
  title,
  artist,
  album,
  duration,
  synced,
  rawLyrics,
  score = 0
}) {
  const lines = parseLyrics(rawLyrics);
  if (!lines.length) return null;
  return {
    found: true,
    provider: providerLabel(providerKey),
    providerKey,
    sourceId,
    sourceTitle: title || "",
    sourceArtist: artist || "",
    title: title || context.title,
    artist: artist || context.artist,
    album: album || context.album || "",
    duration: duration || context.duration || null,
    trackDuration: context.duration || duration || null,
    synced: Boolean(synced),
    score,
    lineCount: lines.length,
    rawLyrics: String(rawLyrics || ""),
    preview: lyricsCandidatePreview(lines),
    lines
  };
}

function candidateMatchesSearchArtist(context, candidate) {
  const sourceArtist = String(candidate?.sourceArtist || "").trim();
  if (!sourceArtist || !context.artistTokens?.length) return true;
  // Exact-title collisions are common. A provider-supplied artist must agree
  // with the account track identity before timing quality is considered.
  if (artistSimilarity(context.artistTokens, sourceArtist) >= 0.55) return true;

  // YouTube Music localizes some artist names (for example, "1世代" for
  // "One Direction"). Accept the provider identity only when the title is
  // exact, the recording length agrees, and the names use different scripts.
  const expectedTitle = normalizeArtistKey(context.title);
  const sourceTitle = normalizeArtistKey(candidate?.sourceTitle || candidate?.title || "");
  const expectedDuration = Number(context.duration || 0);
  const candidateDuration = Number(candidate?.duration || candidate?.trackDuration || 0);
  const durationMatches = expectedDuration > 0 && candidateDuration > 0 &&
    Math.abs(expectedDuration - candidateDuration) <= 12;
  const scriptsDiffer = usesNonLatinScript(context.artist) !== usesNonLatinScript(sourceArtist);
  return Boolean(expectedTitle && expectedTitle === sourceTitle && durationMatches && scriptsDiffer);
}

function candidateMatchesSearchTitle(context, candidate) {
  const sourceTitle = String(candidate?.sourceTitle || "").trim();
  if (!sourceTitle) return true;
  const expectedTitles = context.titleCandidates?.length
    ? context.titleCandidates
    : [context.title, context.rawTitle].filter(Boolean);
  return expectedTitles.some((title) => similarity(title, sourceTitle) >= 0.55);
}

function normalizeLyricsTimingText(value) {
  return String(value || "").normalize("NFKC").toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function lyricsWordTimingQuality(candidate = {}) {
  const lines = Array.isArray(candidate.lines) && candidate.lines.length
    ? candidate.lines
    : parseLyrics(candidate.rawLyrics || candidate.syncedLyrics || candidate.plainLyrics || "");
  const meaningful = lines.filter((line) => String(line?.text || "").trim());
  const primary = meaningful.filter((line) => !line?.isBackground);
  const checked = primary.length ? primary : meaningful;
  let timedLines = 0;
  let totalWords = 0;
  let validWords = 0;
  let textScoreTotal = 0;
  let invalidOrder = false;
  const maximumPlausibleWordDuration = 12;
  for (const line of checked) {
    const words = Array.isArray(line?.words) ? line.words : [];
    if (words.length) timedLines += 1;
    totalWords += words.length;
    let previousStart = -Infinity;
    const valid = words.filter((word) => {
      const start = Number(word?.start);
      const end = Number(word?.end);
      const duration = end - start;
      const okay = Number.isFinite(start) && Number.isFinite(end) && end > start &&
        duration <= maximumPlausibleWordDuration && start >= previousStart - 0.02;
      if (Number.isFinite(start)) previousStart = Math.max(previousStart, start);
      if (!okay) invalidOrder = true;
      return okay;
    });
    validWords += valid.length;
    const lineText = normalizeLyricsTimingText(line.text);
    const timedText = normalizeLyricsTimingText(valid.map((word) => word.text || "").join(""));
    textScoreTotal += lineText && timedText && lineText === timedText ? 1 : 0;
  }
  const lineCoverage = checked.length ? timedLines / checked.length : 0;
  const wordValidity = totalWords ? validWords / totalWords : 0;
  const textCoverage = checked.length ? textScoreTotal / checked.length : 0;
  return {
    lineCoverage,
    wordValidity,
    textCoverage,
    valid: checked.length > 0 && lineCoverage >= 0.95 && wordValidity >= 0.98 &&
      textCoverage >= 0.9 && !invalidOrder
  };
}

function lyricsTimingTier(candidate = {}) {
  const lines = Array.isArray(candidate.lines) && candidate.lines.length
    ? candidate.lines
    : parseLyrics(candidate.rawLyrics || candidate.syncedLyrics || candidate.plainLyrics || "");
  if (lyricsWordTimingQuality({ ...candidate, lines }).valid) return 3;
  if (candidate.synced || lines.some((line) => line?.time != null && Number.isFinite(Number(line.time)))) return 2;
  return 1;
}

function lyricsAgentTier(candidate = {}) {
  const lines = Array.isArray(candidate.lines) && candidate.lines.length
    ? candidate.lines
    : parseLyrics(candidate.rawLyrics || candidate.syncedLyrics || candidate.plainLyrics || "");
  return lines.some((line) =>
    ["v1", "v2", "v1000"].includes(normalizeLyricsAgent(line?.agent))
  ) ? 1 : 0;
}

function lyricsCompleteness(candidate = {}) {
  const lines = Array.isArray(candidate.lines) && candidate.lines.length
    ? candidate.lines
    : parseLyrics(candidate.rawLyrics || candidate.syncedLyrics || candidate.plainLyrics || "");
  const meaningful = lines.filter((line) => String(line?.text || "").trim());
  const timedValues = meaningful.flatMap((line) => [
    ...(line?.time == null ? [] : [Number(line.time)]),
    ...(line?.words || []).flatMap((word) => word?.start == null ? [] : [Number(word.start)])
  ]).filter(Number.isFinite);
  const timedEnds = meaningful.flatMap((line) => [
    ...(line?.time == null ? [] : [Number(line.time)]),
    ...(line?.words || []).flatMap((word) => word?.end == null ? [] : [Number(word.end)])
  ]).filter(Number.isFinite);
  return {
    lines: meaningful.length,
    characters: meaningful.reduce((total, line) => total + String(line.text || "").trim().length, 0),
    firstTime: timedValues.length ? Math.min(...timedValues) : null,
    lastTime: timedEnds.length ? Math.max(...timedEnds) : null
  };
}

function lyricsCoverageScore(candidate = {}) {
  const completeness = lyricsCompleteness(candidate);
  if (completeness.firstTime == null || completeness.lastTime == null) return 0;
  const duration = Number(candidate.trackDuration || candidate.duration || 0);
  const beginsNearStart = completeness.firstTime <= 10 ? 2 : completeness.firstTime <= 25 ? 1 : 0;
  const endingCoverage = duration > 0
    ? Math.max(0, Math.min(2, (completeness.lastTime / duration) * 2))
    : 1;
  return beginsNearStart * 3 + endingCoverage;
}

function lyricsLikelyIncomplete(candidate = {}) {
  const completeness = lyricsCompleteness(candidate);
  const duration = Number(candidate.trackDuration || candidate.duration || 0);
  if (duration < 60 || completeness.firstTime == null || completeness.lastTime == null) return false;
  const startsTooLate = completeness.firstTime > Math.min(45, duration * 0.28);
  const endsTooEarly = completeness.lastTime < duration * 0.68;
  return startsTooLate || endsTooEarly || completeness.lines < 4;
}

function dedupeLyricsCandidates(candidates = []) {
  const seen = new Set();
  const unique = [];
  for (const candidate of candidates) {
    const key = [
      candidate.providerKey,
      candidate.sourceId || "",
      candidate.title || "",
      candidate.artist || "",
      candidate.rawLyrics?.slice(0, 160) || ""
    ].join(":").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(candidate);
  }
  return unique;
}

function lrclibCandidateId(item) {
  return `lrclib:${item.id || [item.trackName, item.artistName, item.albumName, item.duration].filter(Boolean).join(":")}`;
}

function errorMessage(error) {
  return error?.message || String(error || "Request failed");
}

function uniqueErrorSummary(errors = []) {
  return [...new Set(errors.filter(Boolean))].slice(0, 3).join("; ");
}

function lrclibCandidateFromItem(context, item) {
  const rawLyrics = item.syncedLyrics || item.plainLyrics || "";
  if (!rawLyrics) return null;
  return makeLyricsCandidate({
    context,
    providerKey: LRCLIB_PROVIDER,
    sourceId: lrclibCandidateId(item),
    title: item.trackName,
    artist: item.artistName,
    album: item.albumName,
    duration: item.duration,
    synced: Boolean(item.syncedLyrics),
    rawLyrics,
    score: scoreResult(item, context.title, context.artist, context.duration, context.artistTokens)
  });
}

function kugouCandidateId(candidate) {
  return `kugou:${candidate.id || ""}:${candidate.accesskey || ""}`;
}

async function kugouCandidateFromItem(context, candidate, options = {}) {
  const rawLyrics = await downloadKugouLyrics(candidate, options);
  if (!rawLyrics) return null;
  const candidateDuration = kugouDurationSeconds(candidate.duration) || context.duration;
  return makeLyricsCandidate({
    context,
    providerKey: KUGOU_PROVIDER,
    sourceId: kugouCandidateId(candidate),
    title: context.title,
    artist: context.artist,
    album: context.album,
    duration: candidateDuration,
    synced: true,
    rawLyrics,
    score: 2 + (context.duration && candidateDuration
      ? Math.max(0, 2 - Math.abs(context.duration - candidateDuration) / 5)
      : 0)
  });
}

async function findLyricsCandidatesFromLrclib(context, limit = 8, options = {}) {
  if (!context.titleCandidates?.length) return [];
  const exactTimeoutMs = options.noTimeout ? 0 : LRCLIB_EXACT_SEARCH_TIMEOUT_MS;
  const broadTimeoutMs = options.noTimeout ? 0 : LRCLIB_BROAD_SEARCH_TIMEOUT_MS;

  const queries = [
    { params: { track_name: context.title, artist_name: context.artist, album_name: context.album }, timeoutMs: exactTimeoutMs },
    { params: { track_name: context.title, artist_name: context.artist }, timeoutMs: exactTimeoutMs },
    { params: { track_name: context.title }, timeoutMs: broadTimeoutMs },
    { params: { q: [context.artist, context.title].filter(Boolean).join(" ") }, timeoutMs: broadTimeoutMs },
    { params: { q: context.title }, timeoutMs: broadTimeoutMs }
  ];

  const seenItems = new Set();
  const candidates = [];
  const errors = [];
  const settledQueries = await Promise.allSettled(
    queries.map((query) => queryLyrics(query.params, { timeoutMs: query.timeoutMs }))
  );
  for (const queryResult of settledQueries) {
    if (queryResult.status !== "fulfilled") {
      errors.push(errorMessage(queryResult.reason));
      continue;
    }
    const items = queryResult.value;
    for (const item of items) {
      const key = item.id || `${item.trackName}:${item.artistName}:${item.albumName}:${item.duration}`;
      if (seenItems.has(key)) continue;
      seenItems.add(key);
      const candidate = lrclibCandidateFromItem(context, item);
      if (candidate) candidates.push(candidate);
    }
    if (candidates.length >= limit) break;
  }

  if (!candidates.length && errors.length) {
    throw new Error(uniqueErrorSummary(errors) || "LRCLIB search failed");
  }

  return dedupeLyricsCandidates(candidates)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function findLyricsCandidatesFromLyricsOvh(context, options = {}) {
  if (!context.titleCandidates?.length) return [];
  const timeoutMs = options.noTimeout ? 0 : LYRIC_SEARCH_FETCH_TIMEOUT_MS;
  const titleCandidates = context.titleCandidates.length ? context.titleCandidates : [context.title];
  const artistCandidates = context.artistCandidates.length ? context.artistCandidates : [context.artist];
  const pairs = [];
  for (const artist of artistCandidates.slice(0, 3)) {
    for (const title of titleCandidates.slice(0, 2)) pairs.push({ artist, title });
  }

  const settledQueries = await Promise.allSettled(
    pairs.map(async ({ artist, title }) => {
      const rawLyrics = await queryLyricsOvh(artist, title, { timeoutMs });
      if (!rawLyrics) return null;
      const artistScore = context.artistTokens && context.artistTokens.length
        ? artistSimilarity(context.artistTokens, artist)
        : similarity(artist, context.artist);
      return makeLyricsCandidate({
        context,
        providerKey: LYRICS_OVH_PROVIDER,
        sourceId: `lyrics-ovh:${artist}:${title}`,
        title,
        artist,
        album: context.album,
        duration: context.duration,
        synced: false,
        rawLyrics,
        score: 1 + similarity(title, context.title) * 1.2 + artistScore * 1.5
      });
    })
  );

  const candidates = settledQueries
    .filter((result) => result.status === "fulfilled" && result.value)
    .map((result) => result.value);

  if (!candidates.length) {
    const errors = settledQueries
      .filter((result) => result.status === "rejected")
      .map((result) => errorMessage(result.reason));
    if (errors.length) throw new Error(uniqueErrorSummary(errors) || "Lyrics.ovh search failed");
  }

  return dedupeLyricsCandidates(candidates);
}

async function findLyricsCandidatesFromKugou(context, limit = 8, options = {}) {
  if (!context.titleCandidates?.length) return [];
  const timeoutMs = options.noTimeout ? 0 : KUGOU_FETCH_TIMEOUT_MS;
  const seen = new Set();
  const rawCandidates = [];
  const errors = [];

  try {
    const songs = await queryKugouSongs(context, { timeoutMs });
    const hashJobs = songs
      .filter((song) => {
        const duration = kugouDurationSeconds(song.duration);
        return !context.duration || !duration ||
          Math.abs(duration - context.duration) <= KUGOU_DURATION_TOLERANCE_SECONDS;
      })
      .slice(0, 8)
      .map((song) => queryKugouLyricsByHash(song.hash, { timeoutMs }));
    const hashResults = await Promise.allSettled(hashJobs);
    for (const result of hashResults) {
      if (result.status !== "fulfilled") {
        errors.push(errorMessage(result.reason));
        continue;
      }
      rawCandidates.push(...result.value);
    }
  } catch (error) {
    errors.push(errorMessage(error));
  }

  try {
    rawCandidates.push(...await queryKugouLyricsByKeyword(context, { timeoutMs }));
  } catch (error) {
    errors.push(errorMessage(error));
  }

  const downloadTargets = [];
  for (const candidate of rawCandidates) {
    const key = kugouCandidateId(candidate);
    if (seen.has(key) || !candidate?.id || !candidate?.accesskey) continue;
    seen.add(key);
    downloadTargets.push(candidate);
    if (downloadTargets.length >= Math.max(limit * 2, 8)) break;
  }

  const downloads = await Promise.allSettled(
    downloadTargets.map((candidate) => kugouCandidateFromItem(context, candidate, { timeoutMs }))
  );
  const candidates = downloads
    .filter((result) => result.status === "fulfilled" && result.value)
    .map((result) => result.value);
  for (const result of downloads) {
    if (result.status === "rejected") errors.push(errorMessage(result.reason));
  }

  if (!candidates.length && errors.length) {
    throw new Error(uniqueErrorSummary(errors) || "KuGou search failed");
  }

  return dedupeLyricsCandidates(candidates)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function findLyricsCandidatesFromNetease(context, limit = 8, options = {}) {
  if (!context.title) return [];
  const timeoutMs = options.noTimeout ? 0 : DEFAULT_FETCH_TIMEOUT_MS;
  const songs = await queryNeteaseSongs(context, { timeoutMs });
  const ranked = songs
    .map((song) => ({
      song,
      score: scoreResult(song, context.title, context.artist, context.duration, context.artistTokens)
    }))
    .filter(({ score }) => score >= 4)
    .sort((left, right) => right.score - left.score)
    .slice(0, Math.max(3, Math.min(limit, 6)));
  const settled = await Promise.allSettled(ranked.map(async ({ song, score }) => {
    const response = await queryNeteaseLyrics(song.id, { timeoutMs });
    const wordSynced = neteaseYrcToLrc(response?.yrc?.lyric);
    const lineSynced = String(response?.lrc?.lyric || "").trim();
    const rawLyrics = wordSynced || lineSynced;
    if (!rawLyrics) return null;
    return makeLyricsCandidate({
      context,
      providerKey: NETEASE_PROVIDER,
      sourceId: `netease:${song.id}`,
      title: song.trackName,
      artist: song.artistName,
      album: song.albumName,
      duration: song.duration,
      synced: Boolean(wordSynced || /^\[\d{1,2}:\d{2}/m.test(lineSynced)),
      rawLyrics,
      score: score + (wordSynced ? 3 : 1)
    });
  }));
  const candidates = settled
    .filter((result) => result.status === "fulfilled" && result.value)
    .map((result) => result.value);
  const errors = settled
    .filter((result) => result.status === "rejected")
    .map((result) => errorMessage(result.reason));
  if (!candidates.length && errors.length) {
    throw new Error(uniqueErrorSummary(errors) || "NetEase Music failed");
  }
  const seenLyrics = new Set();
  const uniqueCandidates = candidates.filter((candidate) => {
    const key = String(candidate.rawLyrics || "").trim();
    if (!key || seenLyrics.has(key)) return false;
    seenLyrics.add(key);
    return true;
  });
  return dedupeLyricsCandidates(uniqueCandidates)
    .sort((left, right) => compareLyricsQuality(left, right, [NETEASE_PROVIDER]))
    .slice(0, limit);
}

async function findNeteaseCandidateBySourceId(context, sourceId, options = {}) {
  const numericId = String(sourceId || "").trim().replace(/^netease:/i, "");
  if (!/^\d+$/.test(numericId)) return null;
  const timeoutMs = options.noTimeout ? 0 : DEFAULT_FETCH_TIMEOUT_MS;
  const response = await queryNeteaseLyrics(numericId, { timeoutMs });
  const wordSynced = neteaseYrcToLrc(response?.yrc?.lyric);
  const lineSynced = String(response?.lrc?.lyric || "").trim();
  const rawLyrics = wordSynced || lineSynced;
  if (!rawLyrics) return null;
  return makeLyricsCandidate({
    context,
    providerKey: NETEASE_PROVIDER,
    sourceId: `netease:${numericId}`,
    title: context.title,
    artist: context.artist,
    album: context.album,
    duration: context.duration,
    synced: Boolean(wordSynced || /^\[\d{1,2}:\d{2}/m.test(lineSynced)),
    rawLyrics,
    score: Number.MAX_SAFE_INTEGER
  });
}

async function findLyricsCandidatesFromBetterLyrics(context, limit = 4, options = {}) {
  if (!context.title || !context.artist) return [];
  const timeoutMs = options.noTimeout ? 0 : EXTENDED_LYRICS_FETCH_TIMEOUT_MS;
  const rawLyrics = await queryBetterLyrics(context, { timeoutMs });
  const candidate = makeLyricsCandidate({
    context,
    providerKey: BETTER_LYRICS_PROVIDER,
    sourceId: `betterlyrics:${context.title}:${context.artist}:${context.duration || ""}`,
    title: context.title,
    artist: context.artist,
    album: context.album,
    duration: context.duration,
    synced: true,
    rawLyrics,
    score: 4
  });
  return candidate ? [candidate].slice(0, limit) : [];
}

async function findLyricsCandidatesFromLyricsPlus(context, limit = 4, options = {}) {
  if (!context.title || !context.artist) return [];
  const timeoutMs = options.noTimeout ? 0 : EXTENDED_LYRICS_FETCH_TIMEOUT_MS;
  const result = await queryLyricsPlus(context, { timeoutMs });
  const candidate = makeLyricsCandidate({
    context,
    providerKey: LYRICS_PLUS_PROVIDER,
    sourceId: result.sourceId || `lyricsplus:${context.title}:${context.artist}`,
    title: context.title,
    artist: context.artist,
    album: context.album,
    duration: context.duration,
    synced: true,
    rawLyrics: result.lrc,
    score: 3.8
  });
  return candidate ? [candidate].slice(0, limit) : [];
}

async function findLyricsCandidatesFromPaxsenix(context, limit = 6, options = {}) {
  if (!context.title || !context.artist) return [];
  const timeoutMs = options.noTimeout ? 0 : EXTENDED_LYRICS_FETCH_TIMEOUT_MS;
  const results = await searchPaxsenixAppleMusic(context, { timeoutMs });
  const ranked = results
    .map((item) => ({ item, score: scorePaxsenixResult(item, context) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(3, Math.min(limit, 8)));
  const settled = await Promise.allSettled(ranked.map(async ({ item, score }) => {
    const rawLyrics = await queryPaxsenixLyricsById(item.id, { timeoutMs });
    if (!rawLyrics) return null;
    return makeLyricsCandidate({
      context,
      providerKey: PAXSENIX_PROVIDER,
      sourceId: `paxsenix:${item.id}`,
      title: item.trackName || context.title,
      artist: item.artistName || context.artist,
      album: item.albumName || context.album,
      duration: item.duration || context.duration,
      synced: /^\[\d{1,2}:\d{2}/m.test(rawLyrics) || /<[^>]+:\d/.test(rawLyrics),
      rawLyrics,
      score
    });
  }));
  const candidates = settled
    .filter((result) => result.status === "fulfilled" && result.value)
    .map((result) => result.value);
  const errors = settled
    .filter((result) => result.status === "rejected")
    .map((result) => errorMessage(result.reason));
  if (!candidates.length && errors.length) throw new Error(uniqueErrorSummary(errors) || "Paxsenix failed");
  return dedupeLyricsCandidates(candidates).slice(0, limit);
}

async function findLyricsFromLrclib(context) {
  if (!context.titleCandidates?.length) return emptyLyricsResult(context, LRCLIB_PROVIDER);

  const queries = [
    { track_name: context.title, artist_name: context.artist },
    { track_name: context.title },
    { q: [context.artist, context.title].filter(Boolean).join(" ") },
    { q: context.title }
  ];

  const seen = new Set();
  const results = [];
  for (const params of queries) {
    const items = await queryLyrics(params);
    for (const item of items) {
      const key = item.id || `${item.trackName}:${item.artistName}:${item.albumName}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (item.syncedLyrics || item.plainLyrics) results.push(item);
    }
    if (results.length) break;
  }

  if (!results.length) {
    return emptyLyricsResult(context, LRCLIB_PROVIDER);
  }

  const best = results
    .map((item) => ({ item, score: scoreResult(item, context.title, context.artist, context.duration, context.artistTokens) }))
    .sort((a, b) => b.score - a.score)[0].item;
  const raw = best.syncedLyrics || best.plainLyrics || "";

  return {
    found: true,
    provider: providerLabel(LRCLIB_PROVIDER),
    providerKey: LRCLIB_PROVIDER,
    attemptedProviders: [providerLabel(LRCLIB_PROVIDER)],
    title: best.trackName || context.title,
    artist: best.artistName || context.artist,
    album: best.albumName || "",
    duration: best.duration || context.duration,
    synced: Boolean(best.syncedLyrics),
    rawLyrics: raw,
    lines: parseLyrics(raw)
  };
}

async function findLyricsFromLyricsOvh(context) {
  if (!context.titleCandidates?.length) return emptyLyricsResult(context, LYRICS_OVH_PROVIDER);
  const titleCandidates = context.titleCandidates.length ? context.titleCandidates : [context.title];
  const artistCandidates = context.artistCandidates.length ? context.artistCandidates : [context.artist];

  for (const artist of artistCandidates) {
    for (const title of titleCandidates) {
      const lyrics = await queryLyricsOvh(artist, title);
      if (!lyrics) continue;
      const lines = parseLyrics(lyrics);
      if (!lines.length) continue;
      return {
        found: true,
        provider: providerLabel(LYRICS_OVH_PROVIDER),
        providerKey: LYRICS_OVH_PROVIDER,
        attemptedProviders: [providerLabel(LYRICS_OVH_PROVIDER)],
        title,
        artist,
        album: context.album,
        duration: context.duration,
        synced: false,
        rawLyrics: lyrics,
        lines
      };
    }
  }

  return emptyLyricsResult(context, LYRICS_OVH_PROVIDER);
}

async function findLyricsFromKugou(context) {
  const candidates = await findLyricsCandidatesFromKugou(context, 1);
  const best = candidates[0];
  if (!best) return emptyLyricsResult(context, KUGOU_PROVIDER);
  return {
    ...best,
    attemptedProviders: [providerLabel(KUGOU_PROVIDER)]
  };
}

async function findLyricsFromCandidateProvider(context, provider) {
  const candidates = provider === BETTER_LYRICS_PROVIDER
    ? await findLyricsCandidatesFromBetterLyrics(context, 1)
    : provider === PAXSENIX_PROVIDER
      ? await findLyricsCandidatesFromPaxsenix(context, 1)
      : provider === LYRICS_PLUS_PROVIDER
        ? await findLyricsCandidatesFromLyricsPlus(context, 1)
        : [];
  const best = candidates[0];
  if (!best) return emptyLyricsResult(context, provider);
  return {
    ...best,
    attemptedProviders: [providerLabel(provider)]
  };
}

function transcriptRendererFromNode(node) {
  return node.transcriptCueRenderer ||
    node.transcriptSegmentRenderer ||
    node.timedTranscriptSegmentRenderer ||
    node.captionCueRenderer ||
    null;
}

function transcriptStartSeconds(renderer) {
  return numberFromMilliseconds(
    renderer.startOffsetMs ??
    renderer.startMs ??
    renderer.startTimeMs ??
    renderer.startTime ??
    renderer.cueRange?.startOffsetMs ??
    renderer.cueRange?.startMs
  );
}

function transcriptText(renderer) {
  return textFromObject(renderer.cue) ||
    textFromObject(renderer.snippet) ||
    textFromObject(renderer.text) ||
    textFromObject(renderer.line) ||
    textFromObject(renderer);
}

function lyricsTextFromMusicLyricsResponse(response) {
  const candidates = [];
  walk(response, (node) => {
    const shelf = node.musicDescriptionShelfRenderer;
    const description = textFromObject(shelf?.description);
    if (description) candidates.push(description);

    const text = textFromObject(node.description) || textFromObject(node.text);
    if (text && text.includes("\n")) candidates.push(text);
  });

  return candidates
    .map((text) => String(text || "").replace(/\r\n/g, "\n").trim())
    .filter((text) => {
      const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
      return lines.length >= 4 && !lines.every(isCreditLine);
    })
    .sort((a, b) => b.length - a.length)[0] || "";
}

function lyricsFromTranscriptResponse(response, track = {}) {
  const context = lyricsSearchContext(track);
  const seen = new Set();
  const lines = [];

  walk(response, (node) => {
    const renderer = transcriptRendererFromNode(node);
    if (!renderer) return;
    const text = transcriptText(renderer).replace(/\s+/g, " ").trim();
    if (!text || isCreditLine(text)) return;
    const time = transcriptStartSeconds(renderer);
    const key = `${time ?? "plain"}:${text}`;
    if (seen.has(key)) return;
    seen.add(key);
    lines.push({ time, text });
  });

  lines.sort((a, b) => (a.time ?? Number.MAX_SAFE_INTEGER) - (b.time ?? Number.MAX_SAFE_INTEGER));

  if (!lines.length) {
    const plainLyrics = lyricsTextFromMusicLyricsResponse(response);
    if (plainLyrics) {
      const plainLines = plainLyrics
        .split(/\n+/)
        .map((line) => line.replace(/\s+/g, " ").trim())
        .filter((line) => line && !isCreditLine(line))
        .map((text) => ({ time: null, text }));
      if (plainLines.length) {
        return {
          found: true,
          provider: "YouTube Music",
          providerKey: YOUTUBE_TRANSCRIPT_PROVIDER,
          attemptedProviders: ["YouTube Music"],
          title: context.title || track.title || "",
          artist: context.artist || track.artist || "",
          album: context.album || "",
          duration: context.duration,
          synced: false,
          rawLyrics: plainLines.map((line) => line.text).join("\n"),
          lines: plainLines
        };
      }
    }
    return emptyLyricsResult(context, YOUTUBE_TRANSCRIPT_PROVIDER);
  }

  return {
    found: true,
    provider: providerLabel(YOUTUBE_TRANSCRIPT_PROVIDER),
    providerKey: YOUTUBE_TRANSCRIPT_PROVIDER,
    attemptedProviders: [providerLabel(YOUTUBE_TRANSCRIPT_PROVIDER)],
    title: context.title || track.title || "",
    artist: context.artist || track.artist || "",
    album: context.album || "",
    duration: context.duration,
    synced: lines.some((line) => line.time != null),
    rawLyrics: lyricsTextFromLines(lines),
    lines
  };
}

async function translateText(text, targetLanguage, sourceLanguage, timeoutMs = TRANSLATION_FETCH_TIMEOUT_MS) {
  const url = new URL("/get", MYMEMORY_ORIGIN);
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", `${sourceLanguage || "en"}|${targetLanguage || "zh-TW"}`);
  const response = await fetchWithTimeout(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": USER_AGENT
    }
  }, timeoutMs, "MyMemory translation");
  if (!response.ok) throw new Error(`Translation failed (${response.status})`);
  const data = await response.json();
  const translated = data?.responseData?.translatedText;
  if (!translated) throw new Error(data?.responseDetails || "Translation failed.");
  return String(translated).trim();
}

async function translateTextBatch(texts, targetLanguage, sourceLanguage) {
  const separator = "\n[|||]\n";
  const url = new URL("/translate_a/single", GOOGLE_TRANSLATE_ORIGIN);
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", sourceLanguage || "auto");
  url.searchParams.set("tl", targetLanguage || "zh-TW");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", texts.join(separator));
  const headers = { "Accept": "application/json", "User-Agent": USER_AGENT };
  const parseGoogle = (data) => {
    const translated = (data?.[0] || []).map((part) => part?.[0] || "").join("").trim();
    const parts = translated.split(/\s*\[\|\|\|\]\s*/);
    if (parts.length !== texts.length) throw new Error("Translation response did not preserve lyric lines.");
    return parts.map((part) => String(part || "").trim());
  };
  try {
    const response = await fetchWithTimeout(url, { headers }, TRANSLATION_FETCH_TIMEOUT_MS, "Google translation");
    if (!response.ok) throw new Error(`Translation failed (${response.status})`);
    return parseGoogle(await response.json());
  } catch (primaryError) {
    // Same fallback used by the reference extension when the main Google
    // Translate endpoint is rate-limited. It returns a compact string array.
    const fallbackUrl = new URL("https://clients5.google.com/translate_a/t");
    fallbackUrl.searchParams.set("client", "dict-chrome-ex");
    fallbackUrl.searchParams.set("sl", sourceLanguage || "auto");
    fallbackUrl.searchParams.set("tl", targetLanguage || "zh-TW");
    fallbackUrl.searchParams.set("q", texts.join(separator));
    try {
      const response = await fetchWithTimeout(fallbackUrl, { headers }, TRANSLATION_FETCH_TIMEOUT_MS, "Google fallback translation");
      if (!response.ok) throw new Error(`Translation fallback failed (${response.status})`);
      const data = await response.json();
      const rawFirst = Array.isArray(data) ? (Array.isArray(data[0]) ? data[0][0] : data[0]) : "";
      const translated = String(rawFirst || "").trim();
      const parts = translated.split(/\s*\[\|\|\|\]\s*/);
      if (parts.length !== texts.length || parts.every((part) => !String(part).trim())) {
        throw new Error("Translation fallback did not preserve lyric lines.");
      }
      return parts.map((part) => String(part || "").trim());
    } catch (fallbackError) {
      throw primaryError || fallbackError;
    }
  }
}

function translationLooksDegenerate(sourceText, translatedText) {
  const source = String(sourceText || "").normalize("NFKC").replace(/[\s\p{P}\p{S}]+/gu, "");
  const translated = String(translatedText || "").normalize("NFKC").replace(/[\s\p{P}\p{S}]+/gu, "");
  if (translated.length < 24) return false;
  if (translated.length > Math.max(120, source.length * 8 + 32)) return true;

  const frequencies = new Map();
  for (const character of translated) frequencies.set(character, (frequencies.get(character) || 0) + 1);
  const dominantCount = Math.max(0, ...frequencies.values());
  if (translated.length > Math.max(32, source.length * 3 + 12) && dominantCount / translated.length >= 0.38) {
    return true;
  }

  for (let unitLength = 1; unitLength <= Math.min(12, Math.floor(translated.length / 4)); unitLength += 1) {
    let runLength = unitLength;
    for (let index = unitLength; index + unitLength <= translated.length; index += unitLength) {
      if (translated.slice(index, index + unitLength) !== translated.slice(index - unitLength, index)) {
        runLength = unitLength;
        continue;
      }
      runLength += unitLength;
      if (runLength >= unitLength * 5 && runLength / translated.length >= 0.55 && translated.length > source.length * 2) {
        return true;
      }
    }
  }
  return false;
}

function repairTranslatedPunctuation(sourceText, translatedText) {
  const source = String(sourceText || "");
  let text = String(translatedText || "");
  // Some translation responses turn comma punctuation into an underscore.
  // Only repair that artifact when the source line actually contains commas
  // and the translated line has no real comma punctuation of its own.
  if (source.includes(",") && text.includes("_") && !text.includes(",")) {
    text = text.replace(/\s*_\s*/g, ", ").replace(/,\s*,/g, ",");
  }
  return text;
}

function sanitizeTranslationResult(sourceLines = [], result = {}) {
  const rejectedLineIndexes = [];
  const translatedLines = Array.isArray(result?.lines) ? result.lines : [];
  const lines = (sourceLines || []).map((line, index) => {
    const text = repairTranslatedPunctuation(line?.text, String(translatedLines[index]?.text || translatedLines[index] || ""))
      .replace(/[\u200b-\u200d\ufeff]/g, "")
      .replace(/[ \t]+/g, " ")
      .trim();
    if (text && translationLooksDegenerate(line?.text, text)) {
      rejectedLineIndexes.push(index);
      return { text: "" };
    }
    return { text };
  });
  return { ...result, lines, rejectedLineIndexes };
}

async function translateLyrics(lines = [], options = {}) {
  const targetLanguage = String(options.targetLanguage || "zh-TW");
  const sourceLanguage = String(options.sourceLanguage || "auto");
  const unique = [];
  const seen = new Set();
  for (const line of lines || []) {
    const text = String(line?.text || "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    unique.push(text);
  }

  const translations = new Map();
  const pending = unique.slice(0, 220);
  const batches = [];
  let batch = [];
  let batchLength = 0;
  for (const text of pending) {
    if (batch.length && (batch.length >= 35 || batchLength + text.length > 2800)) {
      batches.push(batch);
      batch = [];
      batchLength = 0;
    }
    batch.push(text);
    batchLength += text.length + 8;
  }
  if (batch.length) batches.push(batch);

  let provider = "Google Translate";
  let googleError = null;
  try {
    // Independent batches can be sent together; sequential requests made a
    // long lyric sheet wait for every previous network round trip.
    const translatedBatches = await Promise.allSettled(
      batches.map((texts) => translateTextBatch(texts, targetLanguage, sourceLanguage))
    );
    translatedBatches.forEach((result, batchIndex) => {
      if (result.status === "rejected") {
        googleError = googleError || result.reason;
        return;
      }
      batches[batchIndex].forEach((text, index) => translations.set(text, result.value[index] || ""));
    });
  } catch (error) {
    googleError = error;
  }

  const unresolved = pending.filter((text) => !translations.has(text));
  if (unresolved.length) {
    provider = "MyMemory";
    // Keep the fallback bounded and only retry batches that actually failed.
    // This mirrors the reference extension's progressive behavior: available
    // lines remain usable while the failed portion gets a second provider.
    const concurrency = 6;
    const fallbackDeadline = Date.now() + 1500;
    let cursor = 0;
    let fallbackError = null;
    const worker = async () => {
      while (cursor < unresolved.length && Date.now() < fallbackDeadline) {
        const index = cursor++;
        const text = unresolved[index];
        try {
          translations.set(text, await translateText(text, targetLanguage, sourceLanguage === "auto" ? "en" : sourceLanguage, 1200));
        } catch (error) {
          fallbackError = fallbackError || error;
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, unresolved.length) }, worker));
    if (!translations.size && fallbackError) {
      if (fallbackError?.message?.includes("429")) {
        throw new Error("Translation service is temporarily rate limited. Please try again shortly.");
      }
      throw googleError || fallbackError;
    }
  }

  return {
    provider,
    targetLanguage,
    sourceLanguage,
    lines: (lines || []).map((line) => ({
      text: translations.get(String(line?.text || "").trim()) || ""
    }))
  };
}

async function findLyricsFromProvider(context, provider) {
  if (provider === LYRICS_OVH_PROVIDER) return findLyricsFromLyricsOvh(context);
  if (provider === KUGOU_PROVIDER) return findLyricsFromKugou(context);
  if (provider === NETEASE_PROVIDER) {
    const best = (await findLyricsCandidatesFromNetease(context, 1))[0];
    return best
      ? { ...best, attemptedProviders: [providerLabel(NETEASE_PROVIDER)] }
      : emptyLyricsResult(context, NETEASE_PROVIDER);
  }
  if (provider === MUSIXMATCH_PROVIDER) {
    const best = (await findLyricsCandidatesFromMusixmatch(context, 1))[0];
    return best
      ? { ...best, attemptedProviders: [providerLabel(MUSIXMATCH_PROVIDER)] }
      : emptyLyricsResult(context, MUSIXMATCH_PROVIDER);
  }
  if ([BETTER_LYRICS_PROVIDER, PAXSENIX_PROVIDER, LYRICS_PLUS_PROVIDER].includes(provider)) {
    return findLyricsFromCandidateProvider(context, provider);
  }
  return findLyricsFromLrclib(context);
}

function wordTimedLineCount(candidate = {}) {
  const lines = Array.isArray(candidate.lines) && candidate.lines.length
    ? candidate.lines
    : parseLyrics(candidate.rawLyrics || candidate.syncedLyrics || candidate.plainLyrics || "");
  return lines.filter((line) =>
    Array.isArray(line?.words) &&
    line.words.some((word) =>
      word.start != null && word.end != null &&
      Number.isFinite(Number(word.start)) && Number.isFinite(Number(word.end))
    )
  ).length;
}

function compareLyricsQuality(left = {}, right = {}, providerOrder = []) {
  const leftTier = lyricsTimingTier(left);
  const rightTier = lyricsTimingTier(right);

  // A partial word-synced result must not outrank lyrics that cover the song.
  // Use the actual track duration rather than a provider's possibly truncated duration.
  const leftIncomplete = lyricsLikelyIncomplete(left);
  const rightIncomplete = lyricsLikelyIncomplete(right);
  if (leftIncomplete !== rightIncomplete) return leftIncomplete ? 1 : -1;

  // 1. 完整性通過後，再優先 Tier 3 (詞級時間) > Tier 2 > Tier 1。
  if (rightTier !== leftTier) {
    return rightTier - leftTier;
  }

  const leftComp = lyricsCompleteness(left);
  const rightComp = lyricsCompleteness(right);

  const leftFirst = leftComp.firstTime == null ? Number.POSITIVE_INFINITY : leftComp.firstTime;
  const rightFirst = rightComp.firstTime == null ? Number.POSITIVE_INFINITY : rightComp.firstTime;
  const leftCoverage = lyricsCoverageScore(left);
  const rightCoverage = lyricsCoverageScore(right);

  // 2. 若同為 Tier 3 (詞級時間)：單詞時間戳的行數越多 / 歌詞越長越優先
  if (leftTier === 3) {
    // 2a. 第一優先：有單詞時間的行數越多越完整 (每個詞都有時間戳，也就是你說的「時間分每個詞多一點」)
    const leftWordLines = wordTimedLineCount(left);
    const rightWordLines = wordTimedLineCount(right);
    const wordLineDiff = rightWordLines - leftWordLines;
    if (wordLineDiff !== 0) {
      return wordLineDiff;
    }

    const agentDifference = lyricsAgentTier(right) - lyricsAgentTier(left);
    if (agentDifference) return agentDifference;

    // 2b. 詞時間行數相同：歌詞字元數越長越完整 (你說的「歌詞最長的放第一」)
    if (rightComp.characters !== leftComp.characters) {
      return rightComp.characters - leftComp.characters;
    }

    // 2c. 字元數相同：總句數越多越完整
    const lineDiff = rightComp.lines - leftComp.lines;
    if (lineDiff !== 0) {
      return lineDiff;
    }

    // 2d. 仍相同：比較覆蓋度 (越接近歌曲結尾越完整)
    const coverageDiff = rightCoverage - leftCoverage;
    if (coverageDiff !== 0) return coverageDiff;

    // 2e. 最後才比：第一句開頭時間越早越好 (firstTime)
    if (Math.abs(leftFirst - rightFirst) > 0.001) {
      return leftFirst - rightFirst;
    }
  }
  // 3. 若同為 Tier 2 (句級時間)：歌詞越長、句數越多越優先
  else if (leftTier === 2) {
    // 3a. 第一優先：歌詞字元數越長越完整 (最長的歌詞放前面)
    if (rightComp.characters !== leftComp.characters) {
      return rightComp.characters - leftComp.characters;
    }

    // 3b. 字元數相同：總句數越多越完整
    const lineDiff = rightComp.lines - leftComp.lines;
    if (lineDiff !== 0) {
      return lineDiff;
    }

    // 3c. 再比覆蓋度
    const coverageDiff = rightCoverage - leftCoverage;
    if (coverageDiff !== 0) return coverageDiff;

    // 3d. 最後比 firstTime
    if (Math.abs(leftFirst - rightFirst) > 0.001) {
      return leftFirst - rightFirst;
    }
  }
  // 4. 若同為 Tier 1 (純文字/完全沒有任何時間戳)：
  //    一律照總字元數排序 — 字數最多放最前面、字數最少丟到最後面
  else {
    // 4a. 唯一優先：總字元數 characters，字多者必勝、字少者排到後面
    if (rightComp.characters !== leftComp.characters) {
      return rightComp.characters - leftComp.characters;
    }

    // 4b. 字元數完全相同時才用句數當參考 (否則一律不影響字數優先)
    const lineDiff = rightComp.lines - leftComp.lines;
    if (lineDiff !== 0) return lineDiff;

    // 4c. 其餘如 firstTime/coverage 對純文字皆無意義，完全忽略
    //    直接跳過去共用 Tiebreakers (agent/score/provider) 而已
  }

  // 5. Tiebreakers (各分級最終平手時才進入；Tier 1 純文字只有在字數+句數都一樣才會到這裡)
  const agentDifference = lyricsAgentTier(right) - lyricsAgentTier(left);
  if (agentDifference) return agentDifference;
  // Tier 1 純文字：這次把 characters 再比一次當作最後防線，
  // 確保任何情況下字數不同都不可能因 score/provider 而逆轉順序
  if (leftTier === 1 && rightComp.characters !== leftComp.characters) {
    return rightComp.characters - leftComp.characters;
  }
  const scoreDifference = Number(right.score || 0) - Number(left.score || 0);
  if (scoreDifference) return scoreDifference;
  return providerOrder.indexOf(left.providerKey) - providerOrder.indexOf(right.providerKey);
}

async function findLyrics(track, options = {}) {
  const context = lyricsSearchContext(track);
  const preferredProvider = String(options.provider || AUTO_PROVIDER);
  if (!context.titleCandidates?.length) {
    return emptyLyricsResult(context, preferredProvider, []);
  }
  const autoProviders = Array.isArray(options.providers)
    ? options.providers.map(String).filter((provider) => ONLINE_LYRIC_PROVIDERS.includes(provider))
    : [];
  const providers = preferredProvider === AUTO_PROVIDER
    ? (autoProviders.length ? autoProviders : ONLINE_LYRIC_PROVIDERS)
    : [preferredProvider];
  if (preferredProvider !== AUTO_PROVIDER) {
    const result = await findLyricsFromProvider(context, providers[0]);
    return result?.found && result.lines?.length
      ? { ...result, attemptedProviders: [providerLabel(providers[0])] }
      : emptyLyricsResult(context, preferredProvider, providers);
  }

  const settled = await Promise.allSettled(
    providers.map((provider) => findLyricsFromProvider(context, provider))
  );
  const candidates = settled
    .filter((result) => result.status === "fulfilled" && result.value?.found && result.value.lines?.length)
    .map((result) => result.value)
    .sort((left, right) => compareLyricsQuality(left, right, providers));
  if (candidates.length) {
    return {
      ...candidates[0],
      attemptedProviders: providers.map(providerLabel),
      qualityCompared: candidates.length
    };
  }
  return emptyLyricsResult(context, preferredProvider, providers);
}

async function searchLyricsCandidates(track, options = {}) {
  const context = lyricsSearchContext(track, {
    title: options.title,
    artist: options.artist,
    album: options.album
  });
  const requestedLimit = Number(options.limit);
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
    ? Math.min(100, Math.floor(requestedLimit))
    : 50;
  const providers = Array.isArray(options.providers)
    ? options.providers.map(String)
    : ONLINE_LYRIC_PROVIDERS.slice();
  const providerSearchOptions = {
    noTimeout: options.noTimeout === true
  };
  const attemptedProviders = [];
  const errors = [];
  const candidates = [];

  // Restore metadata-only selections from older Auralane versions without
  // waiting for every provider search. At present NetEase is the provider with
  // a stable source id that can be fetched directly.
  if (options.sourceId && providers.includes(NETEASE_PROVIDER)) {
    try {
      const exact = await findNeteaseCandidateBySourceId(context, options.sourceId, providerSearchOptions);
      if (exact) {
        return {
          title: context.title || context.rawTitle || "",
          artist: context.artist,
          album: context.album,
          candidates: [exact],
          attemptedProviders: [providerLabel(NETEASE_PROVIDER)],
          errors: []
        };
      }
    } catch (error) {
      errors.push({ provider: providerLabel(NETEASE_PROVIDER), message: errorMessage(error) });
    }
  }

  if (!context.titleCandidates?.length) {
    return {
      title: context.title || context.rawTitle || "",
      artist: context.artist,
      candidates: [],
      attemptedProviders,
      errors
    };
  }

  const providerJobs = providers.map(async (provider) => {
    if (provider === LRCLIB_PROVIDER) {
      return {
        provider,
        candidates: await findLyricsCandidatesFromLrclib(context, limit, providerSearchOptions)
      };
    }
    if (provider === BETTER_LYRICS_PROVIDER) {
      return {
        provider,
        candidates: await findLyricsCandidatesFromBetterLyrics(context, limit, providerSearchOptions)
      };
    }
    if (provider === KUGOU_PROVIDER) {
      return {
        provider,
        candidates: await findLyricsCandidatesFromKugou(context, limit, providerSearchOptions)
      };
    }
    if (provider === NETEASE_PROVIDER) {
      return {
        provider,
        candidates: await findLyricsCandidatesFromNetease(context, limit, providerSearchOptions)
      };
    }
    if (provider === MUSIXMATCH_PROVIDER) {
      return {
        provider,
        candidates: await findLyricsCandidatesFromMusixmatch(context, limit, providerSearchOptions)
      };
    }
    if (provider === PAXSENIX_PROVIDER) {
      return {
        provider,
        candidates: await findLyricsCandidatesFromPaxsenix(context, limit, providerSearchOptions)
      };
    }
    if (provider === LYRICS_PLUS_PROVIDER) {
      return {
        provider,
        candidates: await findLyricsCandidatesFromLyricsPlus(context, limit, providerSearchOptions)
      };
    }
    if (provider === LYRICS_OVH_PROVIDER) {
      return {
        provider,
        candidates: await findLyricsCandidatesFromLyricsOvh(context, providerSearchOptions)
      };
    }
    return { provider, candidates: [] };
  });
  const providerResults = await Promise.allSettled(providerJobs);
  for (const [index, result] of providerResults.entries()) {
    const provider = result.status === "fulfilled" ? result.value.provider : providers[index];
    attemptedProviders.push(providerLabel(provider));
    if (result.status === "fulfilled") {
      candidates.push(...result.value.candidates);
    } else {
      errors.push({
        provider: providerLabel(provider),
        message: result.reason?.message || String(result.reason)
      });
    }
  }

  return {
    title: context.title || context.rawTitle || "",
    artist: context.artist,
    album: context.album,
    candidates: dedupeLyricsCandidates(candidates)
      .filter((candidate) => candidateMatchesSearchTitle(context, candidate))
      .filter((candidate) => candidateMatchesSearchArtist(context, candidate))
      .sort((a, b) => compareLyricsQuality(a, b, providers))
      .slice(0, limit),
    attemptedProviders,
    errors
  };
}

module.exports = {
  compareLyricsQuality,
  findLyrics,
  searchLyricsCandidates,
  lyricsFromTranscriptResponse,
  lyricsTextFromLines,
  parseLyrics,
  ttmlToLrc,
  neteaseYrcToLrc,
  lyricsWordTimingQuality,
  sanitizeTranslationResult,
  translationLooksDegenerate,
  translateLyrics,
  providerLabel
};
