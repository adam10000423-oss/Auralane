"use strict";

// Independent wire-contract adapters. No application state or provider fallback.
const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");

const labels = Object.freeze({
  "lrc-red": "lrc.red",
  binilyrics: "BiniLyrics",
  unison: "Unison",
  "betterlyrics-portato": "BetterLyrics Portato",
  genius: "Genius"
});
const providerIds = Object.freeze(Object.keys(labels));
const MAX_BYTES = 2 * 1024 * 1024;
const CONTENT_KEYS = ["ttml", "ttmlContent", "syncedLyrics", "lrc", "lyrics", "plainLyrics", "content", "text", "data", "result", "response"];

class LyricsProviderError extends Error {
  constructor(code, provider, message, details = {}) {
    super(message);
    this.name = "LyricsProviderError";
    this.code = code;
    this.provider = provider;
    Object.assign(this, details);
  }
}

function normalized(value) {
  return String(value || "").normalize("NFKC").toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function titleKey(value) {
  // Only remove presentation labels, never live/remix/edit/version qualifiers.
  return normalized(String(value || "").replace(/\s*[([]\s*(?:official (?:music )?(?:video|audio)|lyrics?|lyric video)\s*[)\]]/gi, ""));
}

function isrcOf(value) {
  const code = String(value || "").trim().toUpperCase().replace(/-/g, "");
  return /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(code) ? code : null;
}

function seconds(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function urlWith(base, params) {
  const url = new URL(base);
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  return url.href;
}

function safeUrl(value, hosts, fail) {
  let url;
  try { url = new URL(value); } catch { throw fail("INVALID_RESPONSE", "Invalid document URL"); }
  if (url.protocol !== "https:" || url.username || url.password || url.port || !hosts.includes(url.hostname)) {
    throw fail("INVALID_RESPONSE", "Untrusted document URL");
  }
  return url.href;
}

function rejectEnvelope(value, fail) {
  if (value && typeof value === "object" && !Array.isArray(value) &&
      (value.success === false || value.ok === false || value.isError === true ||
       (value.error !== undefined && value.error !== null && value.error !== false && value.error !== ""))) {
    throw fail("PROVIDER_ERROR", "Provider returned an error envelope");
  }
}

function unwrap(value, fail, depth = 0) {
  if (depth > 8) throw fail("INVALID_RESPONSE", "Lyrics wrapper is too deeply nested");
  rejectEnvelope(value, fail);
  if (typeof value === "string") {
    const text = value.replace(/^\uFEFF/, "").trim().replace(/^```(?:xml|ttml|lrc|json|text)?\s*\n([\s\S]*?)\n```$/i, "$1");
    if (/^[{["]/.test(text)) {
      try { return unwrap(JSON.parse(text), fail, depth + 1); }
      catch (error) {
        if (error instanceof LyricsProviderError) throw error;
        if (/^[{"]/.test(text)) throw fail("INVALID_RESPONSE", "Malformed JSON lyrics wrapper");
      }
    }
    return text;
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const key of CONTENT_KEYS) {
      if (value[key] !== undefined && value[key] !== null && value[key] !== "") return unwrap(value[key], fail, depth + 1);
    }
  }
  throw fail("INVALID_RESPONSE", "Missing textual lyrics payload");
}

function xmlDocument(text, fail, html = false) {
  if (/<!DOCTYPE|<!ENTITY/i.test(text)) throw fail("INVALID_RESPONSE", "DTD/entity declarations are not accepted");
  try {
    return new DOMParser({ onError: (level, message) => {
      if (!html && level !== "warning") throw new Error(message);
    } }).parseFromString(text, html ? "text/html" : "application/xml");
  } catch { throw fail("INVALID_RESPONSE", "Malformed lyric document"); }
}

function elements(root) {
  return Array.from(root.getElementsByTagName("*"));
}

function clockSeconds(value) {
  if (/^\d+(?:\.\d+)?s$/.test(value)) return Number(value.slice(0, -1));
  if (/^\d+(?:\.\d+)?ms$/.test(value)) return Number(value.slice(0, -2)) / 1000;
  if (!/^\d+:\d{2}(?::\d{2})?(?:\.\d+)?$/.test(value)) return null;
  return value.split(":").reduce((n, part) => n * 60 + Number(part), 0);
}

function lyricPayload(value, fail) {
  let raw = unwrap(value, fail).replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");
  if (/^&lt;(?:\?xml|tt[\s&])/i.test(raw)) {
    raw = raw.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
      .replace(/&apos;|&#39;/g, "'").replace(/&amp;/g, "&");
  }
  if (!raw || /^(?:lyrics? (?:not found|unavailable)|not found|error\b)/i.test(raw)) {
    throw fail("NOT_FOUND", "No lyrics returned");
  }
  if (raw.startsWith("<")) {
    const doc = xmlDocument(raw, fail);
    if (doc.documentElement.localName === "QrcInfos") {
      const entry = elements(doc).find(node => node.hasAttribute("LyricContent"));
      if (!entry) throw fail("INVALID_RESPONSE", "Missing QRC lyrics");
      raw = entry.getAttribute("LyricContent");
    } else {
      const root = doc.documentElement;
      if (root.localName !== "tt" || (root.namespaceURI && root.namespaceURI !== "http://www.w3.org/ns/ttml")) {
        throw fail("INVALID_RESPONSE", "Unexpected markup instead of lyrics");
      }
      const nodes = elements(doc);
      const allowed = new Set(["tt", "head", "metadata", "title", "agent", "name", "styling", "style", "layout", "region", "body", "div", "p", "span", "br"]);
      for (const node of nodes) {
        if (!allowed.has(node.localName)) { node.parentNode?.removeChild(node); continue; }
        for (const attr of Array.from(node.attributes)) {
          if (/^on/i.test(attr.name) || /(?:href|src)$/i.test(attr.localName)) node.removeAttributeNode(attr);
        }
      }
      const paragraphs = elements(doc).filter(node => node.localName === "p" && node.textContent.trim());
      if (!paragraphs.length) throw fail("NOT_FOUND", "TTML contains no lyric lines");
      const timed = paragraphs.some(node => node.hasAttribute("begin") || elements(node).some(child => child.hasAttribute("begin")));
      const body = elements(doc).find(node => node.localName === "body");
      return { rawLyrics: new XMLSerializer().serializeToString(doc), format: "ttml", synced: timed,
        duration: body ? clockSeconds(body.getAttribute("dur") || "") : null };
    }
  }
  const info = {};
  for (const [tag, field] of [["ti", "title"], ["ar", "artist"], ["length", "duration"]]) {
    const match = raw.match(new RegExp(`^\\[${tag}:([^\\]\\n]*)\\]`, "mi"));
    if (match) info[field] = tag === "length" ? clockSeconds(match[1]) : match[1];
  }
  const qrc = /^\[\d+,\d+\]/m.test(raw);
  if (qrc) {
    raw = raw.split("\n").map(line => {
      const match = line.match(/^\[(\d+),(\d+)\](.*)$/);
      if (!match) return line;
      const ms = Number(match[1]);
      const stamp = `${String(Math.floor(ms / 60000)).padStart(2, "0")}:${(ms % 60000 / 1000).toFixed(3).padStart(6, "0")}`;
      const body = match[3];
      const stampOf = (value) => `${String(Math.floor(value / 60000)).padStart(2, "0")}:${(value % 60000 / 1000).toFixed(3).padStart(6, "0")}`;
      const prefix = /^\(\d+,\d+/.test(body);
      const runs = [...body.matchAll(prefix ? /\((\d+),(\d+)(?:,\d+)?\)([^()]*)/g : /([^()]*)\((\d+),(\d+)(?:,\d+)?\)/g)];
      const valid = runs.filter(run => Number(run[prefix ? 2 : 3]) > 0);
      if (valid.length) {
        const timed = valid.map(run => {
          const start = Number(run[prefix ? 1 : 2]);
          return `<${stampOf(start)}>${run[prefix ? 3 : 1]}<${stampOf(start + Number(run[prefix ? 2 : 3]))}>`;
        }).join("");
        const last = valid.at(-1);
        const end = Number(last[prefix ? 1 : 2]) + Number(last[prefix ? 2 : 3]);
        return `[${stamp}]${timed}<${stampOf(end)}>`;
      }
      return `[${stamp}]${body.replace(/\(\d+,\d+(?:,\d+)?\)/g, "")}`;
    }).join("\n");
  }
  // Strip markup, retaining only actual enhanced-LRC time tokens.
  raw = raw.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, "")
    .replace(/<(?!\d+:\d{2}(?:\.\d+)?\s*>)[^>]*>/g, "").trim();
  if (!raw.replace(/^\[[a-z]+:[^\n]*\]$/gmi, "").trim()) throw fail("NOT_FOUND", "Lyrics contain only metadata");
  const synced = /^\[\d+:\d{2}(?:\.\d+)?\]/m.test(raw);
  return { rawLyrics: raw, format: synced ? "lrc" : "plain", synced, ...info };
}

function matchState(item, context, fail, isrcLookup = false) {
  const title = item.title ?? item.track_name ?? item.trackName ?? item.song;
  const artist = item.artist ?? item.artist_name ?? item.artistName ?? item.artist_names ?? item.primary_artist?.name;
  const duration = seconds(item.duration ?? item.durationSeconds);
  const code = isrcOf(item.isrc);
  if ((title && titleKey(title) !== titleKey(context.title)) ||
      (artist && normalized(artist) !== normalized(context.artist)) ||
      (duration && context.duration && Math.abs(duration - context.duration) > 3) ||
      (context.isrc && code && context.isrc !== code)) {
    throw fail("NO_MATCH", "Recording metadata does not match");
  }
  if (!isrcLookup && (!title || !artist || (context.duration && !duration))) {
    if (context.allowUnverifiedMetadata) return { title: title || null, artist: artist || null, duration, isrc: code, match: "query", durationVerified: false };
    throw fail("MATCH_UNVERIFIABLE", "Provider omitted required recording metadata");
  }
  return { title: title || null, artist: artist || null, duration, isrc: code,
    match: isrcLookup ? "isrc" : "metadata", durationVerified: Boolean(duration && context.duration) };
}

function choose(items, context, fail, isrcLookup = false) {
  if (!Array.isArray(items)) throw fail("INVALID_RESPONSE", "Missing provider result list");
  if (!items.length) throw fail("NOT_FOUND", "No lyrics results");
  let unverifiable = false;
  const matches = [];
  for (const item of items.slice(0, 50)) {
    if (!item || typeof item !== "object") continue;
    try {
      if (isrcLookup && isrcOf(item.isrc) !== context.isrc) continue;
      matches.push({ item, metadata: matchState(item, context, fail, isrcLookup) });
    } catch (error) {
      if (error.code === "MATCH_UNVERIFIABLE") unverifiable = true;
      else if (error.code !== "NO_MATCH") throw error;
    }
  }
  matches.sort((a, b) => Math.abs((a.metadata.duration || 0) - (context.duration || 0)) - Math.abs((b.metadata.duration || 0) - (context.duration || 0)));
  if (!matches.length) throw fail(unverifiable ? "MATCH_UNVERIFIABLE" : "NO_MATCH", "No strictly matching recording");
  return matches[0];
}

function geniusText(html, fail) {
  const doc = xmlDocument(html, fail, true);
  const all = elements(doc);
  let containers = all.filter(node => node.getAttribute("data-lyrics-container") === "true");
  if (!containers.length) containers = all.filter(node => /(?:^|\s)lyrics(?:\s|$)/.test(node.getAttribute("class") || ""));
  const textOf = node => {
    if (node.nodeType === 3) return node.data;
    if (node.nodeType !== 1) return "";
    if (/^(script|style|button|iframe)$/i.test(node.localName) || node.getAttribute("data-exclude-from-selection") === "true") return "";
    if (node.localName === "br") return "\n";
    return (node.localName === "p" ? "\n" : "") + Array.from(node.childNodes).map(textOf).join("");
  };
  const raw = containers.map(textOf).join("\n").replace(/\u00a0/g, " ")
    .replace(/^\s*You might also like\s*$/gmi, "").replace(/\d*Embed\s*$/i, "").trim();
  if (!raw) throw fail("NOT_FOUND", "No Genius lyrics containers");
  return raw;
}

async function query(provider, input = {}, options = {}) {
  const fail = (code, message, details) => new LyricsProviderError(code, provider, message, details);
  if (!providerIds.includes(provider)) throw fail("INVALID_PROVIDER", "Unknown lyrics provider");
  if (!input || typeof input !== "object" || Array.isArray(input)) throw fail("INVALID_CONTEXT", "Context must be an object");
  if (!options || typeof options !== "object" || Array.isArray(options)) throw fail("INVALID_OPTIONS", "Options must be an object");
  if (options.signal && (typeof options.signal.addEventListener !== "function" || typeof options.signal.removeEventListener !== "function")) {
    throw fail("INVALID_OPTIONS", "signal must be an AbortSignal");
  }
  const context = {
    title: String(input.title || input.trackName || "").trim(),
    artist: String(input.artist || input.artistName || "").trim(),
    album: String(input.album || input.albumName || "").trim(),
    duration: seconds(input.durationMs === undefined ? input.durationSeconds ?? input.duration : Number(input.durationMs) / 1000),
    isrc: isrcOf(input.isrc)
  };
  context.allowUnverifiedMetadata = options.allowUnverifiedMetadata === true;
  if (input.isrc && !context.isrc) throw fail("INVALID_CONTEXT", "Invalid ISRC; no synthetic identifiers are accepted");
  if (!context.title || !context.artist) throw fail("INVALID_CONTEXT", "Title and artist are required");
  if ([input.durationMs, input.durationSeconds, input.duration].some(value => value !== undefined && value !== null && (!Number.isFinite(Number(value)) || Number(value) < 0))) {
    throw fail("INVALID_CONTEXT", "Duration must be nonnegative seconds (or explicit durationMs)");
  }
  const timeoutMs = options.timeoutMs ?? 10000;
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1 || timeoutMs > 30000) throw fail("INVALID_OPTIONS", "timeoutMs must be 1..30000");
  const fetcher = options.fetch || globalThis.fetch;
  if (typeof fetcher !== "function") throw fail("INVALID_OPTIONS", "A fetch implementation is required");
  if (options.signal?.aborted) throw fail("ABORTED", "Lyrics query cancelled");
  const controller = new AbortController();
  let timedOut = false;
  let requests = 0;
  const readers = new Set();
  let abortReject;
  const aborted = new Promise((_, reject) => { abortReject = reject; });
  const cancel = () => {
    controller.abort();
    for (const reader of readers) reader.cancel().catch(() => {});
    abortReject(fail(timedOut ? "TIMEOUT" : "ABORTED", timedOut ? "Lyrics query deadline exceeded" : "Lyrics query cancelled"));
  };
  options.signal?.addEventListener("abort", cancel, { once: true });
  const timer = setTimeout(() => { timedOut = true; cancel(); }, timeoutMs);

  async function get(url, json = false) {
    if (++requests > 2) throw fail("REQUEST_LIMIT", "Lyrics request budget exceeded");
    const work = async () => {
      let response;
      try {
        response = await fetcher(url, { signal: controller.signal, redirect: "error", headers: {
          "User-Agent": "Auralane", Accept: json ? "application/json" : "text/plain,application/xml,text/html,application/json"
        } });
      } catch (error) {
        if (controller.signal.aborted) throw fail(timedOut ? "TIMEOUT" : "ABORTED", "Lyrics request interrupted");
        throw fail("NETWORK_ERROR", "Lyrics request failed", { cause: error });
      }
      if (!response.ok) {
        await response.body?.cancel().catch(() => {});
        const code = response.status === 404 ? "NOT_FOUND" : response.status === 429 ? "RATE_LIMITED" :
          [401, 403].includes(response.status) ? "ACCESS_DENIED" : "HTTP_ERROR";
        throw fail(code, `Provider HTTP ${response.status}`, { status: response.status });
      }
      if (Number(response.headers.get("content-length")) > MAX_BYTES) {
        await response.body?.cancel().catch(() => {});
        throw fail("RESPONSE_TOO_LARGE", "Lyrics response exceeds 2 MiB");
      }
      const reader = response.body?.getReader();
      if (!reader) throw fail("INVALID_RESPONSE", "Missing response stream");
      readers.add(reader);
      const chunks = [];
      let size = 0;
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > MAX_BYTES) throw fail("RESPONSE_TOO_LARGE", "Lyrics response exceeds 2 MiB");
          chunks.push(Buffer.from(value));
        }
      } catch (error) {
        if (error instanceof LyricsProviderError) throw error;
        throw fail(controller.signal.aborted ? (timedOut ? "TIMEOUT" : "ABORTED") : "NETWORK_ERROR", "Lyrics response stream failed", { cause: error });
      } finally {
        readers.delete(reader);
        await reader.cancel().catch(() => {});
        reader.releaseLock();
      }
      const text = Buffer.concat(chunks).toString("utf8").replace(/^\uFEFF/, "");
      if (!json) return text;
      try { const data = JSON.parse(text); rejectEnvelope(data, fail); return data; }
      catch (error) {
        if (error instanceof LyricsProviderError) throw error;
        throw fail("INVALID_RESPONSE", "Provider returned invalid JSON");
      }
    };
    return Promise.race([work(), aborted]);
  }

  function result(payload, metadata, id) {
    return { rawLyrics: payload.rawLyrics, sourceId: `${provider}:${id}`, metadata: {
      ...metadata, provider, label: labels[provider], format: payload.format, synced: payload.synced, requests
    } };
  }

  try {
    if (provider === "lrc-red") {
      let metadata;
      let code = context.isrc;
      if (!code) {
        const data = await get(urlWith("https://lrc.red/search.json", { q: `${context.title} ${context.artist}` }), true);
        if (!Array.isArray(data.hits)) throw fail("INVALID_RESPONSE", "Missing provider result list");
        const found = choose(data.hits.filter(item => item && isrcOf(item.isrc)), context, fail);
        metadata = found.metadata;
        code = isrcOf(found.item.isrc);
        if (!code) throw fail("INVALID_RESPONSE", "Search result has no valid ISRC");
      }
      const payload = lyricPayload(await get(`https://lrc.red/s/${code}.ttml`), fail);
      if (payload.duration && context.duration && Math.abs(payload.duration - context.duration) > 3) throw fail("NO_MATCH", "Document duration does not match");
      metadata ||= matchState({ isrc: code, duration: payload.duration }, context, fail, true);
      return result(payload, metadata, code);
    }
    if (provider === "binilyrics") {
      const params = context.isrc ? { isrc: context.isrc } : {
        track: context.title, artist: context.artist, album: context.album, duration: context.duration
      };
      const data = await get(urlWith("https://lyrics-api.binimum.org/", params), true);
      const found = choose(data.results, context, fail, Boolean(context.isrc));
      const url = safeUrl(found.item.lyricsUrl, ["lrc.red", "lyrics-api.binimum.org"], fail);
      const pathCode = new URL(url).pathname.match(/^\/s\/([A-Z0-9]+)\.ttml$/)?.[1];
      if (pathCode && found.metadata.isrc && pathCode !== found.metadata.isrc) throw fail("NO_MATCH", "Document ISRC does not match result");
      const payload = lyricPayload(await get(url), fail);
      if (payload.duration && context.duration && Math.abs(payload.duration - context.duration) > 3) throw fail("NO_MATCH", "Document duration does not match");
      return result(payload, found.metadata, found.metadata.isrc || url);
    }
    if (provider === "unison" || provider === "betterlyrics-portato") {
      const unison = provider === "unison";
      const url = unison ? urlWith("https://unison.boidu.dev/lyrics", {
        song: context.title, artist: context.artist, album: context.album, duration: context.duration
      }) : urlWith("https://lyrics-api.boidu.dev/qq/getLyrics", {
        s: context.title, a: context.artist, al: context.album, d: context.duration
      });
      const data = await get(url, true);
      if (unison && data.success !== true) throw fail("INVALID_RESPONSE", "Missing Unison success envelope");
      const entry = unison ? data.data : data;
      const payload = lyricPayload(entry, fail);
      const metadata = matchState({ ...payload, ...entry.metadata, ...entry, duration: entry.duration ?? entry.metadata?.duration ?? payload.duration }, context, fail);
      return result(payload, metadata, entry.id ?? new URL(url).searchParams.toString());
    }
    const data = await get(urlWith("https://genius.com/api/search/multi", { q: `${context.title} ${context.artist}` }), true);
    const sections = data.response?.sections;
    if (!Array.isArray(sections)) throw fail("INVALID_RESPONSE", "Missing Genius search sections");
    const items = sections.filter(section => section.type === "song").flatMap(section =>
      Array.isArray(section.hits) ? section.hits.map(hit => hit.result) : []);
    const found = choose(items, context, fail);
    const url = safeUrl(found.item.url, ["genius.com", "www.genius.com"], fail);
    if (!/-lyrics$/i.test(new URL(url).pathname)) throw fail("NO_MATCH", "Genius result is not a lyrics page");
    const rawLyrics = geniusText(await get(url), fail);
    return result({ rawLyrics, format: "plain", synced: false }, found.metadata, found.item.id ?? url);
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", cancel);
  }
}

module.exports = { providerIds, labels, query, LyricsProviderError };
