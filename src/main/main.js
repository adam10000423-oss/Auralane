const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");
const http = require("node:http");
const { Readable } = require("node:stream");
const { pathToFileURL } = require("node:url");
const { app, BrowserWindow, Menu, Tray, clipboard, desktopCapturer, dialog, globalShortcut, ipcMain, nativeImage, powerSaveBlocker, screen, session, shell } = require("electron");

// A separate profile can be used for local build verification while an
// installed Auralane instance is running. Normal launches remain single-instance.
const BUILD_PREVIEW = process.argv.includes("--auralane-preview");
const SINGLE_INSTANCE_LOCK = BUILD_PREVIEW || app.requestSingleInstanceLock();
if (!SINGLE_INSTANCE_LOCK) {
  app.quit();
}

app.commandLine.appendSwitch("disable-gpu-shader-disk-cache");
app.commandLine.appendSwitch("disable-reading-from-canvas");
app.commandLine.appendSwitch("disk-cache-size", "1");
app.commandLine.appendSwitch("media-cache-size", "1");
app.commandLine.appendSwitch("enable-features", "VaapiVideoDecoder");
app.commandLine.appendSwitch("disable-features", "BackgroundServiceWorkerDatabase,ServiceWorkerDiskCache,ServiceWorkerImportedScriptUpdateCheck");

function removeDirRecursiveSafe(targetPath) {
  try {
    if (!fs.existsSync(targetPath)) return true;
    const stat = fs.lstatSync(targetPath);
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(targetPath);
      for (const entry of entries) {
        const entryPath = path.join(targetPath, entry);
        removeDirRecursiveSafe(entryPath);
      }
      fs.rmdirSync(targetPath, { maxRetries: 3, retryDelay: 60 });
    } else {
      fs.unlinkSync(targetPath);
    }
    return true;
  } catch (error) {
    console.warn(`[cache-cleanup] Unable to remove ${targetPath}: ${error?.message || error}`);
    return false;
  }
}

function cleanStaleCaches() {
  let userDataDir;
  try {
    userDataDir = app.getPath("userData");
  } catch {
    try { userDataDir = app.getPath("appData"); } catch { return; }
  }
  const cacheTargets = [
    path.join(userDataDir, "Cache"),
    path.join(userDataDir, "GPUCache"),
    path.join(userDataDir, "Code Cache"),
    path.join(userDataDir, "DawnCache"),
    path.join(userDataDir, "Service Worker"),
    path.join(userDataDir, "Session Storage"),
    path.join(userDataDir, "IndexedDB"),
    path.join(userDataDir, "SharedWorker"),
    path.join(userDataDir, "WebStorage"),
    path.join(userDataDir, "blob_storage"),
    path.join(userDataDir, "Prefetch")
  ];
  let cleanedAny = false;
  for (const target of cacheTargets) {
    if (removeDirRecursiveSafe(target)) cleanedAny = true;
  }
  const localAppData = process.env.LOCALAPPDATA || process.env.LocalAppData;
  if (localAppData) {
    const prodLocal = path.join(localAppData, app.name || "Auralane");
    for (const sub of ["Cache", "GPUCache", "Code Cache", "DawnCache", "Service Worker", "IndexedDB", "Session Storage"]) {
      const p = path.join(prodLocal, sub);
      if (fs.existsSync(p) && removeDirRecursiveSafe(p)) cleanedAny = true;
    }
    if (!app.isPackaged) {
      const devLocal = path.join(localAppData, "Electron");
      for (const sub of ["Cache", "GPUCache", "Code Cache", "Service Worker", "IndexedDB", "Session Storage"]) {
        const p = path.join(devLocal, sub);
        if (fs.existsSync(p) && removeDirRecursiveSafe(p)) cleanedAny = true;
      }
    }
  }
  if (cleanedAny) {
    console.log("[cache-cleanup] Stale cache directories removed on startup.");
  }
}

cleanStaleCaches();
const { autoUpdater } = require("electron-updater");
const { transliterate } = require("transliteration");
const { YouTube, parseCookieString } = require("./innertube");
const { PoTokenProvider } = require("./poToken");
const { findLyrics, parseLyrics, searchLyricsCandidates, lyricsFromTranscriptResponse, lyricsTextFromLines, sanitizeTranslationResult, translateLyrics } = require("./lyrics");
const { createOfflineCache } = require("./offlineCache");
const { readStore, writeStore, clearStore } = require("./store");
const { mergePlaybackSession } = require("./playbackSession");
const { recognizeMusic } = require("./musicRecognition");
const { scanLocalMusic, streamFile } = require("./localMusic");
const { LocalTranslationService } = require("./localTranslation");

let mainWindow;
let loginWindow;
let state;
let youtube;
let canonicalMetadataYouTube;
let poTokenProvider;
let offlineCache;
let lyricWindow = null;
let lastLyricPayload = null;
let preserveLyricActiveOnClose = false;
let miniWindow = null;
let miniAlwaysOnTop = true;
let miniDragState = null;
let installUpdateAfterDownload = false;
const PLAYBACK_LOGIN_PARTITION = "persist:auralane-login";
const DEFAULT_UPDATE_REPOSITORY = "adam10000423-oss/Auralane";
const canonicalArtistCache = new Map();
const artworkColorCache = new Map();

function pixelHueAndSaturation(red, green, blue) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;
  if (!delta) return { hue: 0, saturation: 0, lightness };
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  return { hue: ((hue * 60) + 360) % 360, saturation, lightness };
}

function dominantArtworkColor(bitmap) {
  const hueBins = Array.from({ length: 18 }, () => ({ score: 0, red: 0, green: 0, blue: 0, weight: 0 }));
  const neutral = { score: 0, red: 0, green: 0, blue: 0, weight: 0 };
  for (let index = 0; index + 3 < bitmap.length; index += 4) {
    const blue = bitmap[index];
    const green = bitmap[index + 1];
    const red = bitmap[index + 2];
    const alpha = bitmap[index + 3] / 255;
    const luma = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
    if (alpha < 0.5 || luma < 0.06 || luma > 0.95) continue;
    const { hue, saturation, lightness } = pixelHueAndSaturation(red, green, blue);
    const midtone = 1 - Math.min(1, Math.abs(lightness - 0.52) / 0.52);
    const colorWeight = alpha * (0.3 + (saturation ** 1.45) * 2.7) * (0.65 + midtone * 0.7);
    const bucket = saturation >= 0.13 ? hueBins[Math.floor(hue / 20) % hueBins.length] : neutral;
    bucket.score += colorWeight;
    bucket.red += red * colorWeight;
    bucket.green += green * colorWeight;
    bucket.blue += blue * colorWeight;
    bucket.weight += colorWeight;
  }

  let winningIndex = -1;
  let winningScore = 0;
  for (let index = 0; index < hueBins.length; index += 1) {
    const previous = hueBins[(index + hueBins.length - 1) % hueBins.length].score;
    const next = hueBins[(index + 1) % hueBins.length].score;
    const neighborhoodScore = hueBins[index].score + (previous + next) * 0.38;
    if (neighborhoodScore > winningScore) {
      winningScore = neighborhoodScore;
      winningIndex = index;
    }
  }

  const selected = winningIndex >= 0 && winningScore > neutral.score * 0.08
    ? [
        hueBins[(winningIndex + hueBins.length - 1) % hueBins.length],
        hueBins[winningIndex],
        hueBins[(winningIndex + 1) % hueBins.length]
      ]
    : [neutral];
  const combined = selected.reduce((result, bucket, index) => {
    const influence = index === 1 && selected.length === 3 ? 1 : 0.38;
    result.red += bucket.red * influence;
    result.green += bucket.green * influence;
    result.blue += bucket.blue * influence;
    result.weight += bucket.weight * influence;
    return result;
  }, { red: 0, green: 0, blue: 0, weight: 0 });
  if (!combined.weight) return null;
  return [combined.red, combined.green, combined.blue].map((value) => Math.round(value / combined.weight));
}

async function artworkDominantColor(urls = []) {
  for (const rawUrl of urls) {
    const url = String(rawUrl || "").trim();
    if (!/^https?:\/\//i.test(url)) continue;
    if (artworkColorCache.has(url)) return artworkColorCache.get(url);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) continue;
      const image = nativeImage.createFromBuffer(Buffer.from(await response.arrayBuffer()));
      if (image.isEmpty()) continue;
      const bitmap = image.resize({ width: 40, height: 40, quality: "good" }).toBitmap();
      const color = dominantArtworkColor(bitmap);
      if (!color) continue;
      artworkColorCache.set(url, color);
      while (artworkColorCache.size > 128) artworkColorCache.delete(artworkColorCache.keys().next().value);
      return color;
    } catch {
      // Try the next thumbnail size or host.
    }
  }
  return null;
}

function setYouTubeAuth(nextState) {
  youtube?.setAuth(nextState);
  canonicalMetadataYouTube?.setAuth(nextState);
}

function trackArtistReferences(track = {}) {
  const linked = Array.isArray(track.artists) ? track.artists : [];
  const references = linked.map((artist) => ({
    artist,
    browseId: String(artist?.browseId || artist?.id || "").trim(),
    name: String(artist?.title || artist?.name || "").trim()
  })).filter((entry) => entry.browseId.startsWith("UC"));
  const directBrowseId = String(track.artistBrowseId || track.channelId || "").trim();
  if (!references.length && directBrowseId.startsWith("UC")) {
    references.push({ artist: null, browseId: directBrowseId, name: String(track.artist || "").trim() });
  }
  return references;
}

function isAutomaticLyricsArtist(track, requestedArtist) {
  const requested = String(requestedArtist || "").trim().toLocaleLowerCase();
  if (!requested) return true;
  const names = [
    track?.artist,
    ...(Array.isArray(track?.artists) ? track.artists.map((artist) => artist?.title || artist?.name) : [])
  ].map((name) => String(name || "").trim().toLocaleLowerCase()).filter(Boolean);
  return names.includes(requested);
}

async function canonicalArtistName(browseId) {
  if (!browseId || !canonicalMetadataYouTube) return "";
  if (canonicalArtistCache.has(browseId)) return canonicalArtistCache.get(browseId);
  const pending = canonicalMetadataYouTube.artist(browseId)
    .then((result) => {
      const title = String(result?.header?.title || "").trim();
      return title && title !== "Artist" ? title : "";
    })
    .catch(() => "");
  canonicalArtistCache.set(browseId, pending);
  while (canonicalArtistCache.size > 256) canonicalArtistCache.delete(canonicalArtistCache.keys().next().value);
  return pending;
}

async function canonicalLyricsLookup(track = {}, options = {}) {
  if (!isAutomaticLyricsArtist(track, options.artist)) return { track, options };
  const references = trackArtistReferences(track);
  if (!references.length) return { track, options };
  const resolved = await Promise.all(references.map(async (reference) => ({
    ...reference,
    canonicalName: await canonicalArtistName(reference.browseId)
  })));
  if (!resolved.some((entry) => entry.canonicalName)) return { track, options };

  const names = resolved.map((entry) => entry.canonicalName || entry.name).filter(Boolean);
  const canonicalArtist = [...new Set(names)].join(", ");
  if (!canonicalArtist) return { track, options };
  const namesById = new Map(resolved.map((entry) => [entry.browseId, entry.canonicalName || entry.name]));
  const artists = Array.isArray(track.artists)
    ? track.artists.map((artist) => {
        const browseId = String(artist?.browseId || artist?.id || "").trim();
        const name = namesById.get(browseId);
        return name ? { ...artist, title: name, name } : artist;
      })
    : [];
  return {
    track: { ...track, artist: canonicalArtist, artists },
    options: { ...options, artist: canonicalArtist }
  };
}
let lastMiniPlayerState = null;
let rendererServer = null;
let rendererOrigin = "";
const onlineAudioStreams = new Map();
let tray = null;
let trayWindow = null;
let updateConfiguredRepository = "";
let expandedLyricsPowerBlockerId = null;
let isQuitting = false;
const localTranslation = new LocalTranslationService();

const APP_ID = "com.auralane.desktop";
const APP_ICON = path.join(__dirname, "..", "assets", process.platform === "win32" ? "auralane-icon.ico" : "auralane-icon.png");
const RENDERER_ROOT = path.join(__dirname, "..", "renderer");
const LOCAL_COVER_ROOT = () => path.join(app.getPath("userData"), "local-music-covers");
const LYRICS_TRANSCRIPT_TIMEOUT_MS = 4200;
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function rejectAfter(ms, message) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
}

function isTransientYouTubeError(error) {
  const message = String(error?.message || error || "");
  return /(?:failed \((?:429|500|502|503|504)\)|backendError|UNAVAILABLE|fetch failed|ECONNRESET|ETIMEDOUT|socket hang up)/i.test(message);
}

async function retryTransientYouTubeRequest(operation, attempts = 4) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isTransientYouTubeError(error) || attempt === attempts - 1) throw error;
      const delayMs = Math.min(2400, 400 * (2 ** attempt)) + Math.floor(Math.random() * 180);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

function savePlaybackSession(payload = {}) {
  state.playbackSession = mergePlaybackSession(state.playbackSession, payload);
  writeStore(state);
  return state.playbackSession;
}

function setExpandedLyricsKeepAwake(enabled) {
  if (enabled) {
    if (!expandedLyricsPowerBlockerId || !powerSaveBlocker.isStarted(expandedLyricsPowerBlockerId)) {
      expandedLyricsPowerBlockerId = powerSaveBlocker.start("prevent-display-sleep");
    }
  } else if (expandedLyricsPowerBlockerId && powerSaveBlocker.isStarted(expandedLyricsPowerBlockerId)) {
    powerSaveBlocker.stop(expandedLyricsPowerBlockerId);
    expandedLyricsPowerBlockerId = null;
  }
  return Boolean(expandedLyricsPowerBlockerId);
}

function normalizeRepository(value) {
  const match = String(value || "").trim().match(/^(?:https?:\/\/github\.com\/)?([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i);
  return match ? `${match[1]}/${match[2]}` : "";
}

function isTrustedRendererUrl(value) {
  try {
    const url = new URL(value);
    if (rendererOrigin && url.origin === rendererOrigin) return true;
    return url.protocol === "file:" && url.pathname.includes("/renderer/");
  } catch {
    return false;
  }
}

function openExternalHttps(value) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:") void shell.openExternal(url.toString());
  } catch {
    // Ignore invalid or non-HTTPS external links.
  }
}

function hardenLocalWindow(window) {
  window.webContents.setWindowOpenHandler(({ url }) => {
    openExternalHttps(url);
    return { action: "deny" };
  });
  window.webContents.on("will-navigate", (event, url) => {
    if (isTrustedRendererUrl(url)) return;
    event.preventDefault();
    openExternalHttps(url);
  });
}

function configureUpdater(repository) {
  const normalized = normalizeRepository(repository);
  if (!normalized) throw new Error("Enter a GitHub repository as owner/repository.");
  if (updateConfiguredRepository === normalized) return normalized;
  const [owner, repo] = normalized.split("/");
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.setFeedURL({ provider: "github", owner, repo });
  updateConfiguredRepository = normalized;
  return normalized;
}

function sendUpdateEvent(type, payload = {}) {
  mainWindow?.webContents.send("update:event", { type, ...payload });
}

autoUpdater.on("checking-for-update", () => sendUpdateEvent("checking"));
autoUpdater.on("update-available", (info) => sendUpdateEvent("available", { version: info.version, releaseName: info.releaseName || "" }));
autoUpdater.on("update-not-available", (info) => sendUpdateEvent("current", { version: info?.version || app.getVersion() }));
autoUpdater.on("download-progress", (progress) => sendUpdateEvent("progress", {
  percent: Number(progress.percent || 0),
  transferred: Number(progress.transferred || 0),
  total: Number(progress.total || 0),
  bytesPerSecond: Number(progress.bytesPerSecond || 0)
}));
autoUpdater.on("update-downloaded", (info) => {
  sendUpdateEvent("downloaded", { version: info.version });
  if (installUpdateAfterDownload) {
    installUpdateAfterDownload = false;
    setTimeout(() => autoUpdater.quitAndInstall(true, true), 500);
  }
});
autoUpdater.on("error", (error) => sendUpdateEvent("error", { message: error?.message || "Update failed." }));

function lyricsCachePath(trackId) {
  const key = crypto.createHash("sha256").update(String(trackId || "")).digest("hex");
  return path.join(app.getPath("userData"), "lyrics-cache", `${key}.json`);
}

function readCachedLyrics(trackId) {
  if (!trackId) return null;
  try {
    const value = JSON.parse(fs.readFileSync(lyricsCachePath(trackId), "utf8"));
    if (!value?.result?.found || !Array.isArray(value.result.lines)) return null;
    const hasLegacyBackgroundTiming = value.result.lines.some((line, index, lines) => {
      if (!line?.isBackground || !line?.inferredBackground || !Number.isFinite(Number(line.time))) return false;
      for (let previous = index - 1; previous >= 0; previous -= 1) {
        if (lines[previous]?.isBackground) continue;
        return Number.isFinite(Number(lines[previous]?.time))
          && Math.abs(Number(line.time) - Number(lines[previous].time)) < 0.02;
      }
      return false;
    });
    if (hasLegacyBackgroundTiming && value.result.rawLyrics) {
      const reparsedLines = parseLyrics(value.result.rawLyrics);
      if (reparsedLines.length) {
        return writeCachedLyrics(trackId, {
          ...value.result,
          lines: reparsedLines,
          synced: reparsedLines.some((line) => line.time != null)
        });
      }
    }
    return value;
  } catch {
    return null;
  }
}

function writeCachedLyrics(trackId, result) {
  if (!trackId || !result?.found || !Array.isArray(result.lines) || !result.lines.length) return null;
  const target = lyricsCachePath(trackId);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const value = { trackId: String(trackId), cachedAt: new Date().toISOString(), result };
  const temporary = `${target}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(value), "utf8");
  fs.renameSync(temporary, target);
  return value;
}

function clearCachedLyrics(trackId) {
  if (!trackId) return false;
  try {
    fs.rmSync(lyricsCachePath(trackId), { force: true });
    return true;
  } catch {
    return false;
  }
}

function registerOnlineAudioStream(playback = {}) {
  const upstreamUrl = String(playback.streamUrl || playback.upstreamStreamUrl || "");
  if (!upstreamUrl || !rendererOrigin) return playback;
  const token = crypto.randomUUID();
  const ttlSeconds = Math.max(120, Number(playback.expiresInSeconds || 0) || 21600);
  onlineAudioStreams.set(token, {
    url: upstreamUrl,
    requestHeaders: playback.requestHeaders || {},
    mimeType: playback.mimeType || "audio/webm",
    contentLength: Number(playback.contentLength || 0),
    expiresAt: Date.now() + Math.max(60, ttlSeconds - 60) * 1000
  });
  const now = Date.now();
  for (const [key, entry] of onlineAudioStreams) {
    if (entry.expiresAt <= now || onlineAudioStreams.size > 64) onlineAudioStreams.delete(key);
  }
  return {
    ...playback,
    upstreamStreamUrl: upstreamUrl,
    streamUrl: `${rendererOrigin}/online-audio/${token}`
  };
}

async function proxyOnlineAudio(token, request, response) {
  const entry = onlineAudioStreams.get(token);
  if (!entry || entry.expiresAt <= Date.now()) {
    onlineAudioStreams.delete(token);
    response.writeHead(410, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    response.end("Online audio stream expired");
    return;
  }
  const headers = { ...entry.requestHeaders };
  if (request.headers.range) {
    const openRange = String(request.headers.range).match(/^bytes=(\d+)-$/i);
    if (openRange) {
      const start = Number(openRange[1]);
      const maximumEnd = start + (1024 * 1024) - 1;
      const end = entry.contentLength > 0
        ? Math.min(maximumEnd, entry.contentLength - 1)
        : maximumEnd;
      headers.Range = `bytes=${start}-${Math.max(start, end)}`;
    } else {
      headers.Range = request.headers.range;
    }
  }
  const controller = new AbortController();
  response.once("close", () => {
    if (!response.writableEnded) controller.abort();
  });
  try {
    const upstream = await fetch(entry.url, { method: request.method === "HEAD" ? "HEAD" : "GET", headers, signal: controller.signal });
    const responseHeaders = {
      "Content-Type": upstream.headers.get("content-type") || entry.mimeType || "audio/webm",
      "Cache-Control": "no-store",
      "Accept-Ranges": upstream.headers.get("accept-ranges") || "bytes"
    };
    for (const name of ["content-length", "content-range", "etag", "last-modified"]) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders[name] = value;
    }
    response.writeHead(upstream.status, responseHeaders);
    if (request.method === "HEAD" || !upstream.body) {
      response.end();
      return;
    }
    Readable.fromWeb(upstream.body).on("error", () => response.destroy()).pipe(response);
  } catch (error) {
    if (error?.name === "AbortError") return;
    if (!response.headersSent) response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    response.end("Online audio proxy failed");
  }
}

function transcriptUnavailable(error) {
  const message = String(error?.message || error || "");
  return /invalid argument|badRequest|INVALID_ARGUMENT|precondition check failed|get_transcript.*failed \(400\)/i.test(message);
}

function friendlyLyricsSearchError(provider, error) {
  const message = String(error?.message || error || "").trim();
  if (!message) return null;
  if (/timed out/i.test(message)) {
    return {
      provider,
      message: provider === "LRCLIB" ? "did not respond in time" : "timed out"
    };
  }
  if (provider === "YouTube transcript") {
    if (transcriptUnavailable(error)) return null;
    return { provider, message: "lookup failed" };
  }
  return {
    provider,
    message: message.replace(/\s+/g, " ").slice(0, 180)
  };
}

function startRendererServer() {
  if (rendererServer && rendererOrigin) return Promise.resolve(rendererOrigin);

  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      try {
        const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
        let pathname = decodeURIComponent(requestUrl.pathname || "/");
        if (pathname === "/") pathname = "/index.html";

        if (pathname.startsWith("/local-music-audio/")) {
          const id = decodeURIComponent(pathname.slice("/local-music-audio/".length));
          const track = (state?.localMusicLibrary || []).find((item) => item.id === id);
          if (!track?.localPath || !fs.existsSync(track.localPath)) {
            response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Local track not found");
            return;
          }
          streamFile(track.localPath, request, response);
          return;
        }

        if (pathname.startsWith("/local-music-cover/")) {
          const name = path.basename(decodeURIComponent(pathname.slice("/local-music-cover/".length)));
          const target = path.join(LOCAL_COVER_ROOT(), name);
          if (!target.startsWith(`${LOCAL_COVER_ROOT()}${path.sep}`) || !fs.existsSync(target)) {
            response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Cover not found");
            return;
          }
          response.writeHead(200, { "Content-Type": MIME_TYPES[path.extname(target).toLowerCase()] || "image/jpeg", "Cache-Control": "public, max-age=86400" });
          fs.createReadStream(target).pipe(response);
          return;
        }

        if (pathname.startsWith("/offline-cache/")) {
          const videoId = decodeURIComponent(pathname.slice("/offline-cache/".length));
          if (!offlineCache?.stream) {
            response.writeHead(503, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Offline cache is not ready");
            return;
          }
          offlineCache.stream(videoId, request, response).catch(() => {
            if (!response.headersSent) {
              response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            }
            response.end("Offline stream failed");
          });
          return;
        }

        if (pathname.startsWith("/online-audio/")) {
          const token = path.basename(pathname.slice("/online-audio/".length));
          proxyOnlineAudio(token, request, response).catch(() => {
            if (!response.headersSent) response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Online audio proxy failed");
          });
          return;
        }

        const target = path.resolve(RENDERER_ROOT, `.${pathname}`);
        if (!target.startsWith(`${RENDERER_ROOT}${path.sep}`)) {
          response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
          response.end("Forbidden");
          return;
        }

        fs.readFile(target, (error, data) => {
          if (error) {
            response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Not found");
            return;
          }
          response.writeHead(200, {
            "Content-Type": MIME_TYPES[path.extname(target).toLowerCase()] || "application/octet-stream",
            "Cache-Control": "no-store"
          });
          response.end(data);
        });
      } catch {
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Internal server error");
      }
    });

    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      rendererServer = server;
      rendererOrigin = `http://127.0.0.1:${server.address().port}`;
      resolve(rendererOrigin);
    });
  });
}

function createLyricWindow() {
  if (lyricWindow && !lyricWindow.isDestroyed()) {
    lyricWindow.focus();
    return;
  }

  const hasCompactLayout = state?.lyricWindowLayoutVersion === 2;
  const savedBounds = hasCompactLayout ? (state?.lyricWindowBounds || {}) : {};
  lyricWindow = new BrowserWindow({
    x: Number.isFinite(savedBounds.x) ? savedBounds.x : undefined,
    y: Number.isFinite(savedBounds.y) ? savedBounds.y : undefined,
    width: Number.isFinite(savedBounds.width) ? Math.max(360, savedBounds.width) : 620,
    height: Number.isFinite(savedBounds.height) ? Math.max(56, savedBounds.height) : 72,
    minWidth: 360,
    minHeight: 56,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    maximizable: false,
    fullscreenable: false,
    thickFrame: true,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false
    }
  });
  hardenLocalWindow(lyricWindow);

  lyricWindow.loadFile(path.join(__dirname, "..", "renderer", "lyrics.html"));
  lyricWindow.webContents.once("did-finish-load", () => {
    if (lastLyricPayload && lyricWindow && !lyricWindow.isDestroyed()) {
      lyricWindow.webContents.send("lyric:changed", lastLyricPayload);
    }
  });
  state.lyricWindowActive = true;
  state.lyricWindowLayoutVersion = 2;
  writeStore(state);

  const persistLyricBounds = () => {
    if (!lyricWindow || lyricWindow.isDestroyed()) return;
    state.lyricWindowBounds = lyricWindow.getBounds();
    writeStore(state);
  };
  lyricWindow.on("move", persistLyricBounds);
  lyricWindow.on("resize", persistLyricBounds);

  lyricWindow.on("closed", () => {
    lyricWindow = null;
    if (!preserveLyricActiveOnClose) {
      state.lyricWindowActive = false;
      writeStore(state);
    }
    preserveLyricActiveOnClose = false;
    mainWindow?.webContents.send("lyric:widget-closed");
  });
}

function closeAuxiliaryWindows() {
  if (lyricWindow && !lyricWindow.isDestroyed()) {
    preserveLyricActiveOnClose = true;
    lyricWindow.close();
  }
  if (miniWindow && !miniWindow.isDestroyed()) miniWindow.close();
  if (trayWindow && !trayWindow.isDestroyed()) trayWindow.close();
}

function sendMiniPlayerState(payload = lastMiniPlayerState) {
  if (!miniWindow || miniWindow.isDestroyed() || !payload) return;
  miniWindow.webContents.send("mini:state", payload);
}

function miniPlayerUrl() {
  return rendererOrigin
    ? `${rendererOrigin}/mini.html`
    : pathToFileURL(path.join(__dirname, "..", "renderer", "mini.html")).toString();
}

function createMiniWindow(initialState = null) {
  if (miniWindow && !miniWindow.isDestroyed()) {
    miniWindow.show();
    miniWindow.focus();
    sendMiniPlayerState(initialState || lastMiniPlayerState);
    return miniWindow;
  }

  if (initialState) lastMiniPlayerState = initialState;

  if (typeof state?.miniAlwaysOnTop === "boolean") miniAlwaysOnTop = state.miniAlwaysOnTop;
  const hasCurrentMiniLayout = state?.miniWindowLayoutVersion === 4;
  const savedBounds = hasCurrentMiniLayout ? (state?.miniWindowBounds || {}) : {};

  miniWindow = new BrowserWindow({
    x: Number.isFinite(savedBounds.x) ? savedBounds.x : undefined,
    y: Number.isFinite(savedBounds.y) ? savedBounds.y : undefined,
    width: Number.isFinite(savedBounds.width) ? Math.max(320, Math.min(480, savedBounds.width)) : 380,
    height: Number.isFinite(savedBounds.height) ? Math.max(140, Math.min(166, savedBounds.height)) : 154,
    minWidth: 320,
    minHeight: 140,
    maxWidth: 480,
    maxHeight: 166,
    title: "Auralane Mini Player",
    icon: APP_ICON,
    frame: false,
    transparent: true,
    resizable: true,
    maximizable: false,
    fullscreenable: false,
    alwaysOnTop: miniAlwaysOnTop,
    backgroundColor: "#00000000",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  hardenLocalWindow(miniWindow);

  miniWindow.removeMenu();
  miniWindow.setMenuBarVisibility(false);
  miniWindow.setAlwaysOnTop(miniAlwaysOnTop, "floating");
  state.miniWindowLayoutVersion = 4;
  writeStore(state);

  const persistMiniBounds = () => {
    if (!miniWindow || miniWindow.isDestroyed()) return;
    state.miniWindowBounds = miniWindow.getBounds();
    writeStore(state);
  };
  miniWindow.on("move", persistMiniBounds);
  miniWindow.on("resize", persistMiniBounds);

  miniWindow.webContents.on("before-input-event", (event, input) => {
    if (!input.control && !input.meta) return;
    const key = String(input.key || "").toLowerCase();
    if (key === "w") {
      event.preventDefault();
      miniWindow?.close();
    } else if (key === "r") {
      event.preventDefault();
      miniWindow?.reload();
    }
  });

  miniWindow.once("ready-to-show", () => {
    miniWindow?.show();
    sendMiniPlayerState();
  });

  miniWindow.webContents.on("did-finish-load", () => {
    sendMiniPlayerState();
  });

  miniWindow.on("closed", () => {
    miniDragState = null;
    miniWindow = null;
    mainWindow?.webContents.send("mini:closed");
  });

  miniWindow.loadURL(miniPlayerUrl());
  return miniWindow;
}

function sendPlaybackCommand(command) {
  mainWindow?.webContents.send("mini:command", { command });
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    if (app.isReady()) createMainWindow();
    return;
  }
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

function sendTrayState() {
  if (!trayWindow || trayWindow.isDestroyed()) return;
  trayWindow.webContents.send("tray:state", lastMiniPlayerState || {});
}

function positionTrayWindow() {
  if (!trayWindow || trayWindow.isDestroyed()) return;
  const cursor = screen.getCursorScreenPoint();
  const area = screen.getDisplayNearestPoint(cursor).workArea;
  const bounds = trayWindow.getBounds();
  trayWindow.setPosition(
    Math.max(area.x + 8, Math.min(cursor.x - Math.round(bounds.width / 2), area.x + area.width - bounds.width - 8)),
    Math.max(area.y + 8, area.y + area.height - bounds.height - 8),
    false
  );
}

function createTrayWindow() {
  if (trayWindow && !trayWindow.isDestroyed()) return trayWindow;
  trayWindow = new BrowserWindow({
    width: 330,
    height: 390,
    frame: false,
    transparent: true,
    show: false,
    skipTaskbar: true,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  hardenLocalWindow(trayWindow);
  trayWindow.removeMenu();
  trayWindow.loadFile(path.join(RENDERER_ROOT, "tray.html"));
  trayWindow.on("blur", () => trayWindow?.hide());
  trayWindow.on("closed", () => { trayWindow = null; });
  trayWindow.webContents.on("did-finish-load", sendTrayState);
  return trayWindow;
}

function toggleTrayWindow() {
  const window = createTrayWindow();
  if (window.isVisible()) {
    window.hide();
    return;
  }
  positionTrayWindow();
  window.show();
  window.focus();
  sendTrayState();
}

function createTray() {
  if (tray) return;
  try {
    tray = new Tray(APP_ICON);
    tray.setToolTip("Auralane");
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: "Show Auralane", click: showMainWindow },
      { label: "Mini player", click: () => createMiniWindow(lastMiniPlayerState) },
      { type: "separator" },
      { label: "Play / Pause", click: () => sendPlaybackCommand("play-toggle") },
      { label: "Previous", click: () => sendPlaybackCommand("previous") },
      { label: "Next", click: () => sendPlaybackCommand("next") },
      { type: "separator" },
      { label: "Quit", click: () => app.quit() }
    ]));
    tray.on("click", toggleTrayWindow);
    tray.on("double-click", showMainWindow);
  } catch (error) {
    console.warn("Tray unavailable", error?.message || error);
  }
}

function registerGlobalShortcuts() {
  globalShortcut.unregisterAll();
  const configured = state?.shortcuts || {};
  const shortcuts = [
    ["MediaPlayPause", "play-toggle"],
    ["MediaNextTrack", "next"],
    ["MediaPreviousTrack", "previous"],
    [configured.playPause || "CommandOrControl+Alt+Space", "play-toggle"],
    [configured.next || "CommandOrControl+Alt+Right", "next"],
    [configured.previous || "CommandOrControl+Alt+Left", "previous"],
    [configured.showMain || "CommandOrControl+Alt+M", "restore-main"]
  ];
  for (const [accelerator, command] of shortcuts) {
    try {
      globalShortcut.register(accelerator, () => {
        if (command === "restore-main") showMainWindow();
        else sendPlaybackCommand(command);
      });
    } catch (error) {
      console.warn(`Shortcut unavailable: ${accelerator}`, error?.message || error);
    }
  }
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 980,
    minHeight: 650,
    title: "Auralane",
    icon: APP_ICON,
    backgroundColor: "#111111",
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#050505",
      symbolColor: "#f5f5f6",
      height: 34
    },
    webPreferences: {
      preload: path.join(__dirname, "..", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webviewTag: true
    }
  });
  hardenLocalWindow(mainWindow);
  mainWindow.webContents.on("will-attach-webview", (event, webPreferences, params) => {
    const source = String(params.src || "about:blank");
    const trusted = source === "about:blank" || /^https:\/\/music\.youtube\.com(?:\/|$)/i.test(source);
    if (!trusted) {
      event.preventDefault();
      return;
    }
    delete webPreferences.preload;
    webPreferences.nodeIntegration = false;
    webPreferences.contextIsolation = true;
    webPreferences.sandbox = true;
  });
  mainWindow.removeMenu();
  mainWindow.setMenuBarVisibility(false);
  mainWindow.webContents.on("console-message", (event) => {
    const level = event.level;
    const message = String(event.message || "");
    const line = event.line || 0;
    const sourceId = event.sourceId || "";
    const prefix = `[renderer:${path.basename(sourceId || "main")}:${line}]`;
    if (level === 3) console.error(prefix, message);
    else if (level === 2) console.warn(prefix, message);
    else if (message.startsWith("[ui]") || message.startsWith("[boot-ui]")) console.log(prefix, message);
  });
  mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
    console.error(`[renderer] did-fail-load: ${validatedURL} -> ${errorCode} ${errorDescription}`);
  });
  mainWindow.webContents.on("unresponsive", () => {
    console.warn("[renderer] main window is unresponsive.");
  });
  mainWindow.webContents.on("crashed", (event, killed) => {
    console.error(`[renderer] main window ${killed ? "was killed" : "crashed"}.`);
  });
  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    console.error(`[renderer] render-process-gone: reason=${details?.reason}, exitCode=${details?.exitCode}`);
  });
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (!input.control && !input.meta) return;
    const key = String(input.key || "").toLowerCase();
    if (key === "w") {
      event.preventDefault();
      mainWindow.close();
    } else if (key === "r") {
      event.preventDefault();
      mainWindow.reload();
    }
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
    closeAuxiliaryWindows();
    if (!isQuitting && process.platform !== "darwin") app.quit();
  });
  mainWindow.on("leave-full-screen", () => {
    mainWindow?.webContents.send("app:fullscreen-changed", false);
  });

  if (rendererOrigin) {
    mainWindow.loadURL(`${rendererOrigin}/index.html`);
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "renderer", "index.html"));
  }
}

function installYouTubeEmbedHeaders() {
  const youtubeEmbedReferrer = rendererOrigin ? `${rendererOrigin}/index.html` : "https://www.youtube.com/";
  const youtubeEmbedOrigin = rendererOrigin || "https://www.youtube.com";
  const filter = {
    urls: [
      "*://www.youtube.com/*",
      "*://youtube.com/*",
      "*://www.youtube-nocookie.com/*",
      "*://youtube-nocookie.com/*",
      "*://*.googlevideo.com/*",
      "*://*.ytimg.com/*",
      "*://i.ytimg.com/*"
    ]
  };

  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    const requestHeaders = { ...details.requestHeaders };
    requestHeaders.Referer = youtubeEmbedReferrer;
    requestHeaders.Origin = youtubeEmbedOrigin;
    callback({ requestHeaders });
  });
}

function cookieHeader(cookies) {
  return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

async function getMusicCookies(loginSession) {
  const cookies = await loginSession.cookies.get({ url: "https://music.youtube.com" });
  return cookieHeader(cookies);
}

async function replacePlaybackLoginSession(cookie = "") {
  const playbackSession = session.fromPartition(PLAYBACK_LOGIN_PARTITION);
  await playbackSession.clearStorageData({
    storages: ["cookies", "localstorage", "indexdb", "cachestorage", "serviceworkers"]
  });
  const parsed = parseCookieString(cookie);
  for (const [name, value] of Object.entries(parsed)) {
    if (!name || value === undefined || value === null) continue;
    await playbackSession.cookies.set({
      url: "https://music.youtube.com",
      name,
      value: String(value),
      path: "/",
      secure: true,
      sameSite: "no_restriction"
    });
  }
  await playbackSession.cookies.flushStore();
}

async function getYtConfig(win) {
  try {
    return await win.webContents.executeJavaScript(`
      (() => ({
        visitorData: window.yt?.config_?.VISITOR_DATA || "",
        dataSyncId: (window.yt?.config_?.DATASYNC_ID || "").split("||")[0]
      }))()
    `);
  } catch {
    return { visitorData: "", dataSyncId: "" };
  }
}

function authCookieValue(cookie) {
  const parsed = parseCookieString(cookie);
  return parsed.SAPISID || parsed["__Secure-3PAPISID"] || parsed["__Secure-1PAPISID"] || parsed.APISID || "";
}

function requireSignedIn() {
  if (!state?.cookie || !authCookieValue(state.cookie)) {
    throw new Error("Sign in to sync this change with YouTube Music.");
  }
}

async function validateAndSaveLogin(cookie, ytConfig) {
  const nextState = {
    ...state,
    cookie,
    visitorData: ytConfig.visitorData || state.visitorData || "",
    dataSyncId: ytConfig.dataSyncId || state.dataSyncId || ""
  };
  const previousState = state;
  setYouTubeAuth(nextState);
  let account = null;
  try {
    account = await youtube.accountInfo();
  } catch (error) {
    setYouTubeAuth(previousState);
    throw error;
  }
  if (!account) {
    setYouTubeAuth(previousState);
    throw new Error("Could not read account info from YouTube Music.");
  }
  try {
    await replacePlaybackLoginSession(cookie);
  } catch (error) {
    setYouTubeAuth(previousState);
    throw error;
  }
  state = { ...nextState, account };
  upsertCurrentAccountProfile();
  writeStore(state);
  mainWindow?.webContents.send("auth:changed", authSummary());
  return authSummary();
}

function profileKey(account = {}, cookie = "") {
  const value = account.email || account.channelHandle || authCookieValue(cookie) || account.name || Date.now();
  const encoded = Buffer.from(String(value), "utf8")
    .toString("base64")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 36);
  return `profile-${encoded || Date.now()}`;
}

function matchingAccountProfile(account = {}, cookie = "") {
  const email = String(account.email || "").trim().toLocaleLowerCase();
  const channelHandle = String(account.channelHandle || "").trim().toLocaleLowerCase();
  const id = profileKey(account, cookie);
  return (state.profiles || []).find((profile) => {
    if (profile.id === id) return true;
    const profileEmail = String(profile.account?.email || profile.email || "").trim().toLocaleLowerCase();
    const profileHandle = String(profile.account?.channelHandle || profile.channelHandle || "").trim().toLocaleLowerCase();
    return Boolean((email && profileEmail === email) || (channelHandle && profileHandle === channelHandle));
  }) || null;
}

function safeProfile(profile = {}) {
  const active = Boolean(profile.id && activeProfileId() === profile.id);
  return {
    id: profile.id || "",
    name: profile.account?.name || profile.name || "Saved account",
    email: profile.account?.email || profile.email || "",
    channelHandle: profile.account?.channelHandle || profile.channelHandle || "",
    thumbnail: profile.account?.thumbnail || profile.thumbnail || "",
    savedAt: profile.savedAt || "",
    lastUsedAt: profile.lastUsedAt || "",
    active
  };
}

function safeAccountProfiles() {
  return (state.profiles || []).map(safeProfile);
}

function activeProfileId() {
  if (!state.cookie && !state.account) return "";
  const currentProfile = matchingAccountProfile(state.account || {}, state.cookie || "");
  return currentProfile?.id || profileKey(state.account || {}, state.cookie || "");
}

function upsertCurrentAccountProfile() {
  if (!state.cookie || !state.account) return null;
  const now = new Date().toISOString();
  const existing = matchingAccountProfile(state.account, state.cookie);
  const id = existing?.id || profileKey(state.account, state.cookie);
  const profile = {
    ...(existing || {}),
    id,
    cookie: state.cookie,
    visitorData: state.visitorData || "",
    dataSyncId: state.dataSyncId || "",
    account: state.account,
    name: state.account?.name || existing?.name || "Saved account",
    email: state.account?.email || existing?.email || "",
    channelHandle: state.account?.channelHandle || existing?.channelHandle || "",
    thumbnail: state.account?.thumbnail || existing?.thumbnail || "",
    savedAt: existing?.savedAt || now,
    lastUsedAt: now
  };
  state.profiles = [
    profile,
    ...(state.profiles || []).filter((item) => item.id !== id)
  ].slice(0, 8);
  return profile;
}

function authSummary() {
  return {
    signedIn: Boolean(state.account || (state.cookie && authCookieValue(state.cookie))),
    account: state.account,
    hasVisitorData: Boolean(state.visitorData),
    hasDataSyncId: Boolean(state.dataSyncId),
    profiles: safeAccountProfiles()
  };
}

function likedTombstoneAccountKey() {
  const account = state.account || {};
  return String(account.email || account.channelHandle || account.name || "signed-in")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .trim();
}

function pruneLikedRemovalTombstones() {
  const now = Date.now();
  const all = state.likedRemovalTombstones && typeof state.likedRemovalTombstones === "object"
    ? state.likedRemovalTombstones
    : {};
  let changed = false;
  for (const [accountKey, entries] of Object.entries(all)) {
    if (!entries || typeof entries !== "object") {
      delete all[accountKey];
      changed = true;
      continue;
    }
    for (const [videoId, expiresAt] of Object.entries(entries)) {
      if (!Number.isFinite(Number(expiresAt)) || Number(expiresAt) <= now) {
        delete entries[videoId];
        changed = true;
      }
    }
    if (!Object.keys(entries).length) {
      delete all[accountKey];
      changed = true;
    }
  }
  state.likedRemovalTombstones = all;
  if (changed) writeStore(state);
  return all;
}

function rememberAccountUnlike(videoId) {
  const id = String(videoId || "").trim();
  if (!id) return;
  const all = pruneLikedRemovalTombstones();
  const accountKey = likedTombstoneAccountKey();
  // Keep the exclusion until an explicit re-like clears it. Auralane uses a
  // long expiry only for backward-compatible storage/pruning semantics.
  all[accountKey] = { ...(all[accountKey] || {}), [id]: Date.now() + (10 * 365 * 24 * 60 * 60 * 1000) };
  state.likedRemovalTombstones = all;
  writeStore(state);
}

function clearAccountUnlike(videoId) {
  const id = String(videoId || "").trim();
  if (!id) return;
  const all = pruneLikedRemovalTombstones();
  const entries = all[likedTombstoneAccountKey()];
  if (!entries || !Object.hasOwn(entries, id)) return;
  delete entries[id];
  writeStore(state);
}

function accountUnlikeIds() {
  const all = pruneLikedRemovalTombstones();
  return new Set(Object.keys(all[likedTombstoneAccountKey()] || {}));
}

function filterAccountUnlikes(result) {
  if (!result || typeof result !== "object") return result;
  const removed = accountUnlikeIds();
  if (!removed.size) return result;
  const allowed = (track) => !removed.has(String(track?.id || track?.videoId || ""));
  return {
    ...result,
    tracks: Array.isArray(result.tracks) ? result.tracks.filter(allowed) : result.tracks,
    songs: Array.isArray(result.songs) ? result.songs.filter(allowed) : result.songs,
    sections: Array.isArray(result.sections)
      ? result.sections.map((section) => ({
          ...section,
          tracks: Array.isArray(section?.tracks) ? section.tracks.filter(allowed) : section?.tracks
        }))
      : result.sections
  };
}

async function openLoginWindow() {
  if (loginWindow && !loginWindow.isDestroyed()) {
    loginWindow.focus();
    return;
  }

  const loginPartition = `auralane-login-add-${crypto.randomUUID()}`;
  const loginSession = session.fromPartition(loginPartition, { cache: false });
  await loginSession.clearStorageData();
  loginWindow = new BrowserWindow({
    width: 980,
    height: 760,
    title: "Sign in to YouTube Music",
    icon: APP_ICON,
    parent: mainWindow,
    modal: false,
    backgroundColor: "#111111",
    webPreferences: {
      partition: loginPartition,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  let loginCompletionPending = false;
  const tryComplete = async () => {
    if (loginCompletionPending) return;
    const currentUrl = loginWindow?.webContents.getURL() || "";
    if (!currentUrl.startsWith("https://music.youtube.com")) return;
    const cookie = await getMusicCookies(loginSession);
    if (!authCookieValue(cookie)) return;
    loginCompletionPending = true;
    const ytConfig = await getYtConfig(loginWindow);
    try {
      await validateAndSaveLogin(cookie, ytConfig);
      loginWindow?.close();
    } catch (error) {
      loginCompletionPending = false;
      mainWindow?.webContents.send("app:error", error.message);
    }
  };

  loginWindow.webContents.on("did-finish-load", () => { tryComplete(); });
  loginWindow.webContents.on("did-navigate", () => { tryComplete(); });
  loginWindow.webContents.on("did-navigate-in-page", () => { tryComplete(); });

  loginWindow.on("closed", () => {
    loginWindow = null;
    loginSession.clearStorageData().catch(() => {});
  });

  loginWindow.loadURL("https://accounts.google.com/ServiceLogin?continue=https%3A%2F%2Fmusic.youtube.com");
}

function registerIpc() {
  // ── Auth ──
  ipcMain.handle("auth:status", () => authSummary());
  ipcMain.handle("auth:login", async () => { await openLoginWindow(); return { opened: true }; });
  ipcMain.handle("auth:profiles", () => safeAccountProfiles());
  ipcMain.handle("auth:save-profile", () => {
    const profile = upsertCurrentAccountProfile();
    if (!profile) throw new Error("Sign in before saving this account.");
    writeStore(state);
    mainWindow?.webContents.send("auth:changed", authSummary());
    return safeAccountProfiles();
  });
  ipcMain.handle("auth:switch-profile", async (_event, profileId) => {
    const profile = (state.profiles || []).find((item) => item.id === profileId);
    if (!profile?.cookie) throw new Error("Saved account is missing or expired.");
    const previousState = state;
    const nextState = {
      ...state,
      cookie: profile.cookie,
      visitorData: profile.visitorData || "",
      dataSyncId: profile.dataSyncId || "",
      account: profile.account || null
    };
    setYouTubeAuth(nextState);
    let account = null;
    try {
      account = await youtube.accountInfo();
      await replacePlaybackLoginSession(profile.cookie);
    } catch (error) {
      setYouTubeAuth(previousState);
      await replacePlaybackLoginSession(previousState.cookie || "").catch(() => {});
      throw error;
    }
    if (!account) {
      setYouTubeAuth(previousState);
      throw new Error("Could not validate this saved YouTube Music account.");
    }
    state = { ...nextState, account };
    upsertCurrentAccountProfile();
    writeStore(state);
    mainWindow?.webContents.send("auth:changed", authSummary());
    return authSummary();
  });
  ipcMain.handle("auth:delete-profile", async (_event, profileId) => {
    const deletingActiveProfile = activeProfileId() === profileId;
    state.profiles = (state.profiles || []).filter((item) => item.id !== profileId);
    if (deletingActiveProfile) {
      state = { ...state, cookie: "", visitorData: "", dataSyncId: "", account: null };
      setYouTubeAuth(state);
      await replacePlaybackLoginSession("");
    }
    writeStore(state);
    mainWindow?.webContents.send("auth:changed", authSummary());
    return safeAccountProfiles();
  });
  ipcMain.handle("app:copy-text", (_event, text) => {
    clipboard.writeText(String(text || ""));
    return { ok: true };
  });
  ipcMain.handle("app:save-text-file", async (_event, payload = {}) => {
    const content = String(payload.content || "");
    if (Buffer.byteLength(content, "utf8") > 20 * 1024 * 1024) {
      throw new Error("Export is larger than the 20 MB safety limit.");
    }
    const filters = Array.isArray(payload.filters) && payload.filters.length
      ? payload.filters
      : [{ name: "JSON", extensions: ["json"] }];
    const result = await dialog.showSaveDialog(mainWindow || undefined, {
      title: String(payload.title || "Export Auralane data"),
      defaultPath: String(payload.defaultPath || "auralane-export.json"),
      filters
    });
    if (result.canceled || !result.filePath) return { canceled: true };
    await fs.promises.writeFile(result.filePath, content, "utf8");
    return { canceled: false, filePath: result.filePath };
  });
  ipcMain.handle("app:close-window", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
    return { ok: true };
  });
  ipcMain.handle("app:reload-window", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.reload();
    return { ok: true };
  });
  ipcMain.handle("app:set-fullscreen", (event, value) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return { ok: false };
    win.setFullScreen(Boolean(value));
    return { ok: true };
  });
  ipcMain.handle("app:set-titlebar-theme", (event, payload = {}) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return { ok: false };
    const color = /^#[0-9a-f]{6}$/i.test(payload.color || "") ? payload.color : "#050505";
    const symbolColor = /^#[0-9a-f]{6}$/i.test(payload.symbolColor || "") ? payload.symbolColor : "#f5f5f6";
    if (typeof win.setTitleBarOverlay === "function") {
      win.setTitleBarOverlay({ color, symbolColor, height: 34 });
    }
    win.setBackgroundColor(color);
    return { ok: true };
  });
  ipcMain.handle("app:extract-artwork-color", (_event, urls = []) => artworkDominantColor(
    Array.isArray(urls) ? urls.slice(0, 6) : []
  ));
  ipcMain.handle("app:set-expanded-lyrics-keep-awake", (_event, enabled) => ({
    active: setExpandedLyricsKeepAwake(Boolean(enabled))
  }));
  ipcMain.handle("session:get", () => state.playbackSession || null);
  ipcMain.handle("preferences:get", () => ({ ...(state.preferences || {}) }));
  ipcMain.handle("preferences:set", (_event, payload = {}) => {
    const key = String(payload.key || "");
    if (key !== "lyricsAutoTranslate") throw new Error("Unsupported preference.");
    state.preferences = { ...(state.preferences || {}), [key]: Boolean(payload.value) };
    writeStore(state);
    return { ...state.preferences };
  });
  ipcMain.handle("session:save", (_event, payload = {}) => savePlaybackSession(payload));
  ipcMain.on("session:save-sync", (event, payload = {}) => {
    try {
      event.returnValue = savePlaybackSession(payload);
    } catch (error) {
      event.returnValue = { error: error?.message || "Session save failed." };
    }
  });
  ipcMain.handle("mini:toggle", (_event, payload = {}) => {
    if (payload?.state) lastMiniPlayerState = payload.state;
    if (miniWindow && !miniWindow.isDestroyed()) {
      miniWindow.close();
      return { active: false, alwaysOnTop: miniAlwaysOnTop };
    }
    createMiniWindow(lastMiniPlayerState);
    return { active: true, alwaysOnTop: miniAlwaysOnTop };
  });
  ipcMain.handle("mini:open", (_event, payload = {}) => {
    if (payload?.state) lastMiniPlayerState = payload.state;
    createMiniWindow(lastMiniPlayerState);
    return { active: true, alwaysOnTop: miniAlwaysOnTop };
  });
  ipcMain.handle("mini:close", () => {
    if (miniWindow && !miniWindow.isDestroyed()) miniWindow.close();
    return { active: false, alwaysOnTop: miniAlwaysOnTop };
  });
  ipcMain.handle("mini:ready", () => {
    sendMiniPlayerState();
    return { active: Boolean(miniWindow && !miniWindow.isDestroyed()), alwaysOnTop: miniAlwaysOnTop };
  });
  ipcMain.handle("mini:status", () => ({
    active: Boolean(miniWindow && !miniWindow.isDestroyed()),
    alwaysOnTop: miniAlwaysOnTop
  }));
  ipcMain.on("mini:drag-start", (event, payload = {}) => {
    if (!miniWindow || miniWindow.isDestroyed() || event.sender !== miniWindow.webContents) return;
    const screenX = Number(payload.screenX);
    const screenY = Number(payload.screenY);
    if (!Number.isFinite(screenX) || !Number.isFinite(screenY)) return;
    const bounds = miniWindow.getBounds();
    miniDragState = { screenX, screenY, bounds };
    try { miniWindow.setResizable(false); } catch {}
  });
  ipcMain.on("mini:drag-move", (event, payload = {}) => {
    if (!miniDragState || !miniWindow || miniWindow.isDestroyed() || event.sender !== miniWindow.webContents) return;
    const screenX = Number(payload.screenX);
    const screenY = Number(payload.screenY);
    if (!Number.isFinite(screenX) || !Number.isFinite(screenY)) return;
    miniWindow.setBounds({
      x: Math.round(miniDragState.bounds.x + screenX - miniDragState.screenX),
      y: Math.round(miniDragState.bounds.y + screenY - miniDragState.screenY),
      width: miniDragState.bounds.width,
      height: miniDragState.bounds.height
    });
  });
  ipcMain.on("mini:drag-end", (event) => {
    if (miniWindow && !miniWindow.isDestroyed() && event.sender === miniWindow.webContents) {
      miniDragState = null;
      try { miniWindow.setResizable(true); } catch {}
    }
  });
  ipcMain.handle("mini:update-state", (_event, payload = {}) => {
    lastMiniPlayerState = payload;
    sendMiniPlayerState(payload);
    sendTrayState();
    return { ok: true, active: Boolean(miniWindow && !miniWindow.isDestroyed()), alwaysOnTop: miniAlwaysOnTop };
  });
  ipcMain.handle("mini:command", (_event, payload = {}) => {
    const command = String(payload.command || "");
    if (command === "restore-main") {
      if (mainWindow && !mainWindow.isDestroyed()) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
      }
      return { ok: true };
    }
    mainWindow?.webContents.send("mini:command", payload);
    return { ok: true };
  });
  ipcMain.handle("tray:ready", () => {
    sendTrayState();
    return lastMiniPlayerState || {};
  });
  ipcMain.handle("tray:hide", () => {
    trayWindow?.hide();
    return { ok: true };
  });
  ipcMain.handle("mini:set-always-on-top", (_event, value) => {
    miniAlwaysOnTop = Boolean(value);
    state.miniAlwaysOnTop = miniAlwaysOnTop;
    writeStore(state);
    if (miniWindow && !miniWindow.isDestroyed()) {
      miniWindow.setAlwaysOnTop(miniAlwaysOnTop, "floating");
      miniWindow.webContents.send("mini:window-state", { alwaysOnTop: miniAlwaysOnTop });
    }
    return { ok: true, alwaysOnTop: miniAlwaysOnTop };
  });
  ipcMain.handle("mini:show-main", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
    return { ok: true };
  });
  ipcMain.handle("auth:logout", async () => {
    const currentProfileId = activeProfileId();
    state.profiles = (state.profiles || []).filter((profile) => profile.id !== currentProfileId);
    state = { ...state, cookie: "", visitorData: "", dataSyncId: "", account: null };
    setYouTubeAuth(state);
    writeStore(state);
    await replacePlaybackLoginSession("");
    const summary = authSummary();
    mainWindow?.webContents.send("auth:changed", summary);
    return summary;
  });
  ipcMain.handle("auth:clear-all", async () => {
    clearStore();
    await offlineCache?.clear?.();
    state = readStore();
    setYouTubeAuth(state);
    await replacePlaybackLoginSession("");
    const summary = authSummary();
    mainWindow?.webContents.send("auth:changed", summary);
    return summary;
  });

  // ── Existing YTM endpoints (unchanged behavior) ──
  ipcMain.handle("ytm:search", async (_event, payload) => {
    if (typeof payload === "string") return youtube.search(payload);
    return youtube.search(payload?.query || "", payload?.filter || "top");
  });
  ipcMain.handle("music:recognize", async (_event, payload = {}) => {
    const result = await recognizeMusic(payload);
    const identity = `${result.title || ""}:${result.artist || ""}`.trim().toLowerCase();
    const entry = {
      ...result,
      id: Buffer.from(identity, "utf8").toString("base64url").slice(0, 80),
      recognizedAt: new Date().toISOString()
    };
    state.recognitionHistory = [
      entry,
      ...(state.recognitionHistory || []).filter((item) => item.id !== entry.id)
    ].slice(0, 50);
    writeStore(state);
    return entry;
  });
  ipcMain.handle("music:recognition-history", () => state.recognitionHistory || []);
  ipcMain.handle("music:remove-recognition", (_event, id) => {
    state.recognitionHistory = (state.recognitionHistory || []).filter((item) => item.id !== String(id || ""));
    writeStore(state);
    return state.recognitionHistory;
  });
  ipcMain.handle("music:clear-recognition-history", () => {
    state.recognitionHistory = [];
    writeStore(state);
    return [];
  });
  ipcMain.handle("local-music:list", () => ({
    tracks: state.localMusicLibrary || [],
    folders: state.localMusicFolders || []
  }));
  ipcMain.handle("local-music:clear", () => {
    state.localMusicLibrary = [];
    state.localMusicFolders = [];
    writeStore(state);
    return { tracks: [], folders: [] };
  });
  ipcMain.handle("local-music:select-folder", async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, { properties: ["openDirectory"] });
    if (result.canceled || !result.filePaths[0]) return { canceled: true };
    const folderPath = result.filePaths[0];
    const tracks = await scanLocalMusic(folderPath, LOCAL_COVER_ROOT(), (progress) => {
      event.sender.send("local-music:progress", progress);
    });
    const folder = { path: folderPath, name: path.basename(folderPath), scannedAt: new Date().toISOString(), count: tracks.length };
    state.localMusicFolders = [folder, ...(state.localMusicFolders || []).filter((item) => item.path !== folderPath)].slice(0, 10);
    const otherTracks = (state.localMusicLibrary || []).filter((item) => !String(item.localPath || "").startsWith(`${folderPath}${path.sep}`));
    state.localMusicLibrary = [...tracks, ...otherTracks];
    writeStore(state);
    return { canceled: false, tracks: state.localMusicLibrary, folders: state.localMusicFolders, activeFolder: folderPath };
  });
  ipcMain.handle("local-music:rescan", async (event, folderPath) => {
    const resolved = path.resolve(String(folderPath || ""));
    if (!(state.localMusicFolders || []).some((item) => path.resolve(item.path) === resolved)) throw new Error("Choose this music folder again before scanning it.");
    const tracks = await scanLocalMusic(resolved, LOCAL_COVER_ROOT(), (progress) => event.sender.send("local-music:progress", progress));
    state.localMusicLibrary = [
      ...tracks,
      ...(state.localMusicLibrary || []).filter((item) => !String(item.localPath || "").startsWith(`${resolved}${path.sep}`))
    ];
    state.localMusicFolders = (state.localMusicFolders || []).map((item) => item.path === resolved
      ? { ...item, scannedAt: new Date().toISOString(), count: tracks.length }
      : item);
    writeStore(state);
    return { tracks: state.localMusicLibrary, folders: state.localMusicFolders, activeFolder: resolved };
  });
  ipcMain.handle("shortcuts:get", () => state.shortcuts || {});
  ipcMain.handle("shortcuts:set", (_event, shortcuts = {}) => {
    state.shortcuts = {
      playPause: String(shortcuts.playPause || ""),
      next: String(shortcuts.next || ""),
      previous: String(shortcuts.previous || ""),
      showMain: String(shortcuts.showMain || "")
    };
    writeStore(state);
    registerGlobalShortcuts();
    return state.shortcuts;
  });
  ipcMain.handle("update:status", () => ({ packaged: app.isPackaged, version: app.getVersion(), repository: state.updateRepository || DEFAULT_UPDATE_REPOSITORY }));
  ipcMain.handle("update:check", async (_event, repository) => {
    const normalized = configureUpdater(repository || state.updateRepository || DEFAULT_UPDATE_REPOSITORY);
    state.updateRepository = normalized;
    writeStore(state);
    if (!app.isPackaged) return { packaged: false, version: app.getVersion(), repository: normalized };
    const result = await autoUpdater.checkForUpdates();
    return { packaged: true, version: app.getVersion(), repository: normalized, available: Boolean(result?.isUpdateAvailable), latest: result?.updateInfo?.version || "" };
  });
  ipcMain.handle("update:download", async (_event, payload = {}) => {
    if (!app.isPackaged) throw new Error("Updates can only be downloaded from an installed build.");
    installUpdateAfterDownload = Boolean(payload.installAfterDownload);
    await autoUpdater.downloadUpdate();
    return { ok: true };
  });
  ipcMain.handle("update:install", () => {
    if (!app.isPackaged) return { ok: false };
    setImmediate(() => autoUpdater.quitAndInstall(true, true));
    return { ok: true };
  });
  ipcMain.handle("ytm:search-artists", async (_event, query) => youtube.searchArtists(query));
  ipcMain.handle("ytm:home", async (_event, payload = {}) => youtube.home(payload.params || null, payload.browseId || "FEmusic_home"));
  ipcMain.handle("ytm:explore", async () => youtube.explore());
  ipcMain.handle("ytm:charts", async () => youtube.charts());
  ipcMain.handle("ytm:new-releases", async () => youtube.newReleases());
  ipcMain.handle("ytm:moods", async () => youtube.moods());
  ipcMain.handle("ytm:browse", async (_event, payload) =>
    youtube.browse(payload.browseId, payload.params || null, Boolean(payload.login))
  );
  ipcMain.handle("ytm:artist", async (_event, payload) => youtube.artist(payload.browseId, payload.params || null));
  ipcMain.handle("ytm:collection", async (_event, payload) => (
    payload?.artistItems
      ? youtube.artistItems(payload.browseId, payload.params || null, payload.title || "")
      : youtube.collection(payload.browseId, payload.params || null)
  ));
  ipcMain.handle("ytm:continue", async (_event, payload) => youtube.continuation(payload.token, payload.endpoint || "browse"));
  ipcMain.handle("ytm:feedback", async (_event, payload) => { requireSignedIn(); return youtube.feedback(payload.tokens || []); });
  ipcMain.handle("ytm:like-video", async (_event, videoId) => {
    requireSignedIn();
    const result = await youtube.likeVideo(videoId);
    if (result?.ok !== false) clearAccountUnlike(videoId);
    return result;
  });
  ipcMain.handle("ytm:unlike-video", async (_event, videoId) => {
    requireSignedIn();
    const result = await youtube.unlikeVideo(videoId);
    if (result?.ok !== false) rememberAccountUnlike(videoId);
    return result;
  });
  ipcMain.handle("ytm:subscribe-channel", async (_event, payload = {}) => {
    requireSignedIn();
    let channelId = String(payload.channelId || "").trim();
    const browseId = String(payload.browseId || "").trim();
    if (browseId) {
      try {
        const artist = await youtube.artist(browseId);
        channelId = String(artist?.header?.channelId || channelId).trim();
      } catch {
        // Keep the supplied channel id when the artist page cannot be refreshed.
      }
    }
    if (!channelId.startsWith("UC") && browseId.startsWith("UC")) channelId = browseId;
    return youtube.subscribeChannel(channelId, payload.subscribe !== false, payload.params || null);
  });
  ipcMain.handle("ytm:add-to-playlist", async (_event, payload) => { requireSignedIn(); return youtube.addToPlaylist(payload.playlistId, payload.videoId); });
  ipcMain.handle("ytm:create-playlist", async (_event, payload) => { requireSignedIn(); return youtube.createPlaylist(payload.title, payload.videoIds || []); });
  ipcMain.handle("ytm:liked-songs", async () => {
    requireSignedIn();
    return filterAccountUnlikes(await retryTransientYouTubeRequest(() => youtube.collectLibrary("FEmusic_liked_videos")));
  });
  ipcMain.handle("ytm:library-songs", async () => { requireSignedIn(); return youtube.library("FEmusic_liked_videos"); });
  ipcMain.handle("ytm:library-overview", async () => { requireSignedIn(); return filterAccountUnlikes(await youtube.libraryOverview()); });
  ipcMain.handle("ytm:saved-playlists", async () => { requireSignedIn(); return youtube.library("FEmusic_liked_playlists"); });
  ipcMain.handle("ytm:playlist", async (_event, playlistId) => youtube.playlist(playlistId));
  ipcMain.handle("ytm:queue", async (_event, payload) => youtube.queue(payload || {}));
  ipcMain.handle("ytm:playback", async (_event, payload) => {
    try {
      return registerOnlineAudioStream(await youtube.playback(
        payload.videoId,
        payload.playlistId || null,
        payload.quality || "auto",
        {
          excludeItags: payload.excludeItags || [],
          excludeClients: payload.excludeClients || []
        }
      ));
    } catch (error) {
      return { mode: "webview", reason: error.message || "Direct audio playback failed.", details: { videoId: payload.videoId } };
    }
  });
  ipcMain.handle("lyrics:find", async (_event, payload = {}) => {
    const track = payload?.track || payload;
    const options = payload?.options || {};
    try {
      const provider = String(options.provider || "auto");
      const canonicalLookupPromise = canonicalLyricsLookup(track, options);
      const loadTranscript = async () => {
        if (!track?.id && !track?.videoId) {
          return lyricsFromTranscriptResponse(null, track);
        }
        const response = await youtube.getTranscript(track.id || track.videoId);
        return lyricsFromTranscriptResponse(response, track);
      };

      if (provider === "youtube-transcript") {
        return await loadTranscript();
      }

      const lookup = await canonicalLookupPromise;
      const result = await findLyrics(lookup.track, lookup.options);
      if (provider === "auto" && (!result?.found || !result.lines?.length)) {
        try {
          const transcript = await loadTranscript();
          if (transcript?.found && transcript.lines?.length) {
            return {
              ...transcript,
              attemptedProviders: [
                ...(result?.attemptedProviders || []),
                transcript.provider
              ].filter(Boolean)
            };
          }
          return {
            ...result,
            attemptedProviders: [
              ...(result?.attemptedProviders || []),
              "YouTube transcript"
            ].filter(Boolean)
          };
        } catch {
          return result;
        }
      }
      return result;
    } catch (error) {
      const provider = String(options.provider || "auto");
      const debugTrack = {
        id: track?.id || track?.videoId || "",
        title: track?.title || "",
        artist: track?.artist || "",
        subtitle: track?.subtitle || ""
      };
      if (!transcriptUnavailable(error)) {
        console.error("lyrics:find failed", {
          provider,
          track: debugTrack,
          error: error?.message || String(error)
        });
      }
      const friendlyError = provider === "youtube-transcript"
        ? (friendlyLyricsSearchError("YouTube transcript", error)?.message || "Transcript is not available for this song.")
        : (friendlyLyricsSearchError(provider === "lrclib" ? "LRCLIB" : provider, error)?.message || "Lyrics lookup failed.");
      return {
        found: false,
        provider: "Error",
        providerKey: provider,
        attemptedProviders: [],
        title: debugTrack.title,
        artist: debugTrack.artist,
        album: "",
        synced: false,
        lines: [],
        error: friendlyError,
        debugTrack
      };
    }
  });
  ipcMain.handle("lyrics:translate", async (_event, payload = {}) => {
    const lines = payload.lines || [];
    const options = payload.options || {};
    const requests = [];
    const bounded = (promise, timeoutMs = 6000) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Translation timed out.")), timeoutMs);
      promise.then(resolve, reject).finally(() => clearTimeout(timer));
    });
    const usable = (promise) => promise.then((result) => {
      if (!result?.lines?.some((line) => line.text)) throw new Error("Translation returned no usable lines.");
      return result;
    });
    if (process.env.AURALANE_FORCE_OFFLINE_TRANSLATION !== "1") {
      requests.push(
        bounded(usable(translateLyrics(lines, options).then((result) => sanitizeTranslationResult(lines, result))))
      );
    }
    requests.push(
      bounded(usable(localTranslation.translateLyrics(lines, options).then((result) => sanitizeTranslationResult(lines, result))))
    );
    try {
      // Whichever provider produces a usable response first wins. This avoids
      // waiting for a slow online failure before starting the local fallback.
      return await Promise.any(requests);
    } catch (error) {
      const reason = error?.errors?.find?.((entry) => entry)?.message || error?.message || "Translation unavailable.";
      throw new Error(`Translation unavailable: ${reason}`);
    }
  });
  ipcMain.handle("lyrics:cache-get", (_event, trackId) => readCachedLyrics(trackId));
  ipcMain.handle("lyrics:cache-save", (_event, payload = {}) => writeCachedLyrics(payload.trackId, payload.result));
  ipcMain.handle("lyrics:cache-clear", (_event, trackId) => clearCachedLyrics(trackId));
  ipcMain.handle("lyrics:romanize", (_event, payload = {}) => {
    const lines = Array.isArray(payload.lines) ? payload.lines : [];
    return {
      provider: "Auralane transliteration",
      lines: lines.map((line) => ({
        text: transliterate(String(line?.text || ""), {
          unknown: "?",
          replace: [["&", " and "]]
        }).replace(/\s+/g, " ").trim()
      }))
    };
  });
  ipcMain.handle("lyrics:search", async (_event, payload = {}) => {
    const track = payload?.track || payload;
    const options = payload?.options || {};
    const canonicalLookupPromise = canonicalLyricsLookup(track, options);
    const transcriptPromise = options.includeYouTube !== false && (track?.id || track?.videoId)
      ? (options.noTimeout
          ? youtube.getTranscript(track.id || track.videoId)
          : Promise.race([
              youtube.getTranscript(track.id || track.videoId),
              rejectAfter(LYRICS_TRANSCRIPT_TIMEOUT_MS, "YouTube transcript timed out")
            ]))
      : null;
    const lookup = await canonicalLookupPromise;
    const result = await searchLyricsCandidates(lookup.track, lookup.options);

    if (transcriptPromise) {
      try {
        const response = await transcriptPromise;
        const transcript = lyricsFromTranscriptResponse(response, track);
        if (transcript?.found && transcript.lines?.length) {
          result.candidates.push({
            ...transcript,
            trackDuration: Number(track.duration || transcript.duration || 0) || null,
            sourceId: `youtube-transcript:${track.id || track.videoId}`,
            lineCount: transcript.lines.length,
            rawLyrics: transcript.rawLyrics || lyricsTextFromLines(transcript.lines),
            preview: transcript.lines
              .map((line) => String(line?.text || "").trim())
              .filter(Boolean)
              .slice(0, 3)
              .join(" / "),
            score: 0.5
          });
          result.attemptedProviders.push(transcript.provider);
        } else {
          result.attemptedProviders.push("YouTube transcript");
        }
      } catch (error) {
        result.attemptedProviders.push("YouTube transcript");
        const transcriptError = friendlyLyricsSearchError("YouTube transcript", error);
        if (transcriptError) result.errors.push(transcriptError);
      }
    }

    result.errors = (result.errors || [])
      .map((error) => friendlyLyricsSearchError(error.provider || "Lyrics", error.message || error))
      .filter(Boolean);
    const lyricsLimit = Number(options.limit);
    const maxLyricsResults = Number.isFinite(lyricsLimit) && lyricsLimit > 0
      ? Math.min(100, Math.floor(lyricsLimit))
      : 50;
    result.candidates = result.candidates.slice(0, maxLyricsResults);
    return result;
  });
  ipcMain.handle("queue:get", () => state.queue || []);
  ipcMain.handle("queue:set", (_event, queue) => {
    state.queue = Array.isArray(queue) ? queue : [];
    writeStore(state);
    return state.queue;
  });

  // Offline audio cache. This only stores direct audio streams the player can
  // already resolve; webview fallback tracks are intentionally not cached.
  ipcMain.handle("cache:list", async () => offlineCache.list());
  ipcMain.handle("cache:get", async (_event, videoId) => offlineCache.get(videoId));
  ipcMain.handle("cache:remove", async (_event, videoId) => offlineCache.remove(videoId));
  ipcMain.handle("cache:clear", async () => offlineCache.clear());
  ipcMain.handle("cache:open-folder", async () => {
    await offlineCache.ensureRoot();
    const folderPath = offlineCache.rootPath();
    const error = await shell.openPath(folderPath);
    return error ? { opened: false, path: folderPath, error } : { opened: true, path: folderPath };
  });
  ipcMain.handle("cache:save-track", async (_event, payload = {}) => {
    const track = payload.track || {};
    let playback = payload.playback || null;
    if (playback?.upstreamStreamUrl) playback = { ...playback, streamUrl: playback.upstreamStreamUrl };
    if (!playback?.streamUrl && track.id) {
      playback = await youtube.playback(track.id, track.playlistId || null);
    }
    return offlineCache.saveTrack({
      track,
      playback,
      maxBytes: Number(payload.cacheSizeMb || 512) * 1024 * 1024,
      evictable: payload.evictable === true
    });
  });

  // ── NEW: History (Metrolist-inspired) ──
  ipcMain.handle("ytm:history", async () => { requireSignedIn(); return youtube.history(); });
  ipcMain.handle("ytm:history-remove", async (_event, feedbackToken) => { requireSignedIn(); return youtube.removeFromHistory(feedbackToken); });

  // ── NEW: Podcast ──
  ipcMain.handle("ytm:podcast", async (_event, browseId) => youtube.podcast(browseId));
  ipcMain.handle("ytm:podcast-continue", async (_event, token) => youtube.podcastContinuation(token));

  // ── NEW: Playlist CRUD ──
  ipcMain.handle("ytm:remove-from-playlist", async (_event, payload) => { requireSignedIn(); return youtube.removeFromPlaylist(payload.playlistId, payload.videoId, payload.setVideoId); });
  ipcMain.handle("ytm:rename-playlist", async (_event, payload) => { requireSignedIn(); return youtube.renamePlaylist(payload.playlistId, payload.name); });
  ipcMain.handle("ytm:delete-playlist", async (_event, playlistId) => { requireSignedIn(); return youtube.deletePlaylist(playlistId); });
  ipcMain.handle("ytm:move-song-in-playlist", async (_event, payload) => { requireSignedIn(); return youtube.moveSongInPlaylist(payload.playlistId, payload.setVideoId, payload.successorSetVideoId); });

  // ── NEW: Search Suggestions ──
  ipcMain.handle("ytm:search-suggestions", async (_event, query) => youtube.searchSuggestions(query));

  // ── NEW: Transcript ──
  ipcMain.handle("ytm:get-transcript", async (_event, videoId) => {
    try {
      return await youtube.getTranscript(videoId);
    } catch (error) {
      if (transcriptUnavailable(error)) throw new Error("Transcript is not available for this song.");
      throw error;
    }
  });

  // ── NEW: Desktop Lyrics Widget ──
  ipcMain.handle("lyric:toggle", () => {
    if (lyricWindow && !lyricWindow.isDestroyed()) {
      state.lyricWindowActive = false;
      writeStore(state);
      lyricWindow.close();
      return { active: false };
    } else {
      createLyricWindow();
      return { active: true };
    }
  });
  ipcMain.handle("lyric:status", () => ({
    active: Boolean(lyricWindow && !lyricWindow.isDestroyed())
  }));

  ipcMain.handle("lyric:move-top", () => {
    if (lyricWindow && !lyricWindow.isDestroyed()) {
      const bounds = lyricWindow.getBounds();
      const workArea = screen.getDisplayMatching(bounds).workArea;
      lyricWindow.setPosition(
        Math.round(workArea.x + (workArea.width - bounds.width) / 2),
        workArea.y + 12
      );
      return { moved: true };
    }
    return { moved: false };
  });

  ipcMain.handle("lyric:update", (_event, payload) => {
    lastLyricPayload = payload;
    if (lyricWindow && !lyricWindow.isDestroyed()) {
      lyricWindow.webContents.send("lyric:changed", payload);
    }
  });

  ipcMain.handle("lyric:ignore-mouse", (_event, ignore) => {
    if (lyricWindow && !lyricWindow.isDestroyed()) {
      lyricWindow.setIgnoreMouseEvents(ignore, { forward: true });
    }
  });
}

app.whenReady().then(async () => {
  console.log("[boot] step 1/10: app ready, setting AppUserModelID");
  app.setAppUserModelId(APP_ID);
  Menu.setApplicationMenu(null);

  console.log("[boot] step 2/10: reading state store");
  try {
    state = readStore();
    console.log("[boot]   store read OK, signedIn=", Boolean(state?.account || state?.cookie));
  } catch (error) {
    console.error("[boot]   store read FAILED, using empty state:", error?.message || error);
    state = {
      cookie: "", visitorData: "", dataSyncId: "", account: null, profiles: [], queue: [],
      playbackSession: null, recognitionHistory: [], localMusicLibrary: [], localMusicFolders: [],
      shortcuts: {}, updateRepository: DEFAULT_UPDATE_REPOSITORY, lyricWindowActive: false, lyricWindowBounds: null
    };
  }
  try {
    await replacePlaybackLoginSession(state.cookie || "");
  } catch (error) {
    console.warn("[boot]   playback account session could not be restored:", error?.message || error);
  }

  console.log("[boot] step 3/10: constructing PoToken/YouTube");
  poTokenProvider = new PoTokenProvider();
  youtube = new YouTube(state, { poTokenProvider });
  canonicalMetadataYouTube = new YouTube({
    ...state,
    locale: { gl: youtube.locale?.gl || "US", hl: "en" }
  }, { poTokenProvider });
  canonicalMetadataYouTube.locale = { gl: youtube.locale?.gl || "US", hl: "en" };

  console.log("[boot] step 4/10: creating offline cache");
  offlineCache = createOfflineCache(app);
  try {
    await Promise.race([
      offlineCache.normalizeFileNames?.(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("offline cache normalize timed out")), 5000))
    ]);
    console.log("[boot]   offline cache normalize OK");
  } catch (error) {
    console.warn("[boot]   offline cache normalize skipped:", error?.message || error);
  }

  console.log("[boot] step 5/10: registering IPC handlers");
  registerIpc();

  console.log("[boot] step 6/10: starting renderer HTTP server");
  try {
    await Promise.race([
      startRendererServer(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("renderer server bind timed out")), 8000))
    ]);
    console.log("[boot]   renderer server listening on", rendererOrigin);
  } catch (error) {
    console.error("[boot]   renderer server FAILED, falling back to file:// protocol:", error?.message || error);
    rendererServer = null;
    rendererOrigin = "";
  }

  console.log("[boot] step 7/10: installing YouTube embed headers & session hooks");
  installYouTubeEmbedHeaders();
  session.defaultSession.setDisplayMediaRequestHandler(async (_request, callback) => {
    try {
      const sources = await desktopCapturer.getSources({ types: ["screen", "window"], thumbnailSize: { width: 0, height: 0 } });
      callback({ video: sources[0], audio: process.platform === "win32" ? "loopback" : undefined });
    } catch {
      callback({});
    }
  }, { useSystemPicker: true });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const url = details.url || "";
    if (url.includes("googlevideo.com") || url.includes("videoplayback") || url.includes("yt3.ggpht.com") || url.includes("lh3.googleusercontent.com")) {
      details.responseHeaders["Access-Control-Allow-Origin"] = ["*"];
    }
    callback({ responseHeaders: details.responseHeaders });
  });

  console.log("[boot] step 8/10: creating main window");
  createMainWindow();
  app.on("second-instance", () => {
    showMainWindow();
  });
  if (state.lyricWindowActive) createLyricWindow();

  console.log("[boot] step 9/10: creating tray & global shortcuts");
  createTray();
  registerGlobalShortcuts();

  if (app.isPackaged) {
    try {
      configureUpdater(state.updateRepository || DEFAULT_UPDATE_REPOSITORY);
      setTimeout(() => autoUpdater.checkForUpdates().catch((error) => sendUpdateEvent("error", { message: error.message })), 2500);
    } catch (error) {
      sendUpdateEvent("error", { message: error.message });
    }
  }

  console.log("[boot] step 10/10: all modules ready.");

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
}).catch((error) => {
  console.error("[boot] FATAL: whenReady promise chain crashed:", error?.message || error, error?.stack || "");
  try {
    dialog.showErrorBox("Auralane 啟動失敗", String(error?.message || error || "未知錯誤") + "\n\n請聯絡開發者或嘗試刪除 %APPDATA%\\Auralane 資料夾後重試。");
  } catch {}
  app.quit();
});

app.on("will-quit", async (event) => {
  isQuitting = true;
  setExpandedLyricsKeepAwake(false);
  closeAuxiliaryWindows();
  localTranslation.close();
  globalShortcut.unregisterAll();
  poTokenProvider?.close();
  tray?.destroy();
  tray = null;
  if (rendererServer) {
    try { rendererServer.close(); } catch {}
    rendererServer = null;
    rendererOrigin = "";
  }
  try {
    await Promise.all([
      session.defaultSession.clearCache(),
      session.defaultSession.clearHostResolverCache(),
      session.defaultSession.clearStorageData({
        storages: ["cachestorage", "serviceworkers"],
        quotas: ["temporary", "persistent", "syncable"]
      })
    ]);
  } catch {}
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
