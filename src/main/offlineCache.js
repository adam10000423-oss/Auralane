const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const { Readable } = require("node:stream");
const { pipeline } = require("node:stream/promises");
const { pathToFileURL } = require("node:url");

const INDEX_FILE = "index.json";
const DEFAULT_LIMIT_BYTES = 512 * 1024 * 1024;

const AUDIO_EXTENSIONS = new Map([
  ["audio/mp4", ".m4a"],
  ["audio/mpeg", ".mp3"],
  ["audio/webm", ".webm"],
  ["audio/ogg", ".ogg"],
  ["audio/opus", ".opus"],
  ["audio/aac", ".aac"],
  ["audio/flac", ".flac"],
  ["audio/wav", ".wav"],
  // YouTube audio-only streams commonly respond with video/* containers.
  ["video/mp4", ".m4a"],
  ["video/webm", ".webm"]
]);

function videoIdFromTrack(track) {
  return String(track?.id || track?.videoId || "").trim();
}

function safeFileBase(value) {
  return String(value || "track")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 96) || "track";
}

function safeFileNameSegment(value, fallback = "track", maxLength = 120) {
  const cleaned = String(value || "")
    .normalize("NFKC")
    .replace(/[<>:"/\\|?*\x00-\x1F]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[. ]+|[. ]+$/g, "")
    .slice(0, maxLength)
    .trim();
  if (!cleaned || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(cleaned)) return fallback;
  return cleaned;
}

function cacheFileBase(track, videoId) {
  const id = safeFileBase(videoId || track?.id || track?.videoId);
  const title = safeFileNameSegment(track?.title, "Unknown track", 90);
  const artist = safeFileNameSegment(track?.artist || track?.subtitle || "", "", 60);
  const humanName = artist && artist.toLowerCase() !== title.toLowerCase()
    ? `${title} - ${artist}`
    : title;
  const suffix = ` [${id}]`;
  return `${safeFileNameSegment(humanName, "Unknown track", Math.max(40, 180 - suffix.length))}${suffix}`;
}

function cacheFileNameFor(track, videoId, mimeType) {
  return `${cacheFileBase(track, videoId)}${extensionFromMime(mimeType)}`;
}

function baseMimeType(value) {
  return String(value || "").split(";")[0].trim().toLowerCase();
}

function extensionFromMime(value) {
  return AUDIO_EXTENSIONS.get(baseMimeType(value)) || ".audio";
}

function isAllowedMediaType(value) {
  const mime = baseMimeType(value);
  if (!mime) return true;
  if (mime.startsWith("audio/")) return true;
  if (mime === "application/octet-stream") return true;
  return mime === "video/mp4" || mime === "video/webm";
}

function withYouTubeRange(url, contentLength) {
  const length = Number(contentLength) || 0;
  if (!url || length <= 1 || url.startsWith("data:")) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("range", `0-${length - 1}`);
    return parsed.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}range=0-${length - 1}`;
  }
}

function downloadHeaders(contentLength = 0, ranged = false, requestHeaders = {}) {
  const headers = {
    "Accept": "audio/*,video/webm,video/mp4,application/octet-stream;q=0.9,*/*;q=0.8",
    "User-Agent": "Mozilla/5.0 Auralane/0.1 Electron",
    ...requestHeaders
  };
  const length = Number(contentLength) || 0;
  if (ranged && length > 1) headers.Range = `bytes=0-${length - 1}`;
  return headers;
}

function normalizeLimitBytes(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return DEFAULT_LIMIT_BYTES;
  return Math.max(128 * 1024 * 1024, Math.min(4096 * 1024 * 1024, Math.round(number)));
}

function normalizeTrack(track) {
  const id = videoIdFromTrack(track);
  const artist = track?.artist || track?.author || track?.subtitle || "";
  return {
    id,
    videoId: id,
    title: track?.title || "Unknown track",
    subtitle: track?.subtitle || artist || "Cached track",
    artist,
    artists: Array.isArray(track?.artists) ? track.artists : [],
    album: track?.album || null,
    thumbnail: track?.thumbnail || "",
    duration: track?.duration || "",
    lengthSeconds: Number(track?.lengthSeconds || 0) || 0,
    playlistId: track?.playlistId || "",
    type: "track",
    kind: "track"
  };
}

function createOfflineCache(app) {
  const root = path.join(app.getPath("userData"), "offline-cache");
  const indexPath = path.join(root, INDEX_FILE);

  async function ensureRoot() {
    await fsp.mkdir(root, { recursive: true });
  }

  async function readIndex() {
    try {
      const raw = await fsp.readFile(indexPath, "utf8");
      const parsed = JSON.parse(raw);
      return {
        version: 1,
        items: parsed?.items && typeof parsed.items === "object" ? parsed.items : {}
      };
    } catch {
      return { version: 1, items: {} };
    }
  }

  async function writeIndex(index) {
    await ensureRoot();
    await fsp.writeFile(indexPath, JSON.stringify({
      version: 1,
      updatedAt: new Date().toISOString(),
      items: index.items || {}
    }, null, 2));
  }

  async function fileStat(filePath) {
    try {
      const stat = await fsp.stat(filePath);
      return stat.isFile() ? stat : null;
    } catch {
      return null;
    }
  }

  async function migrateRecordFileName(record) {
    if (!record?.videoId || !record?.fileName) return false;
    const desiredName = cacheFileNameFor(record.track || {}, record.videoId, record.mimeType || record.playback?.mimeType || "");
    if (!desiredName || record.fileName === desiredName) return false;
    const currentPath = path.join(root, record.fileName);
    const currentStat = await fileStat(currentPath);
    if (!currentStat) return false;
    const desiredPath = path.join(root, desiredName);
    const desiredStat = await fileStat(desiredPath);
    if (desiredStat) {
      await fsp.rm(currentPath, { force: true }).catch(() => {});
    } else {
      await fsp.rename(currentPath, desiredPath);
    }
    record.fileName = desiredName;
    return true;
  }

  async function migrateIndexFileNames(index) {
    let changed = false;
    for (const record of Object.values(index.items || {})) {
      try {
        changed = await migrateRecordFileName(record) || changed;
      } catch {
        // Keep the existing cache path if the file is busy or cannot be renamed.
      }
    }
    if (changed) await writeIndex(index);
    return changed;
  }

  function publicTrack(record) {
    const filePath = path.join(root, record.fileName || "");
    return {
      ...record.track,
      id: record.videoId,
      videoId: record.videoId,
      type: "track",
      kind: "track",
      cached: true,
      offlineCached: true,
      cachedAt: record.cachedAt,
      cacheSize: record.size || 0,
      mimeType: record.mimeType || "",
      downloadMethod: record.playback?.downloadMethod || "",
      playback: record.playback || {},
      streamUrl: `/offline-cache/${encodeURIComponent(record.videoId)}`,
      fileUrl: pathToFileURL(filePath).href
    };
  }

  function statsFor(index) {
    const records = Object.values(index.items || {});
    const bytes = records.reduce((total, record) => total + (Number(record.size) || 0), 0);
    return {
      count: records.length,
      bytes,
      root
    };
  }

  async function pruneMissing(index) {
    const missingIds = [];
    for (const [videoId, record] of Object.entries(index.items || {})) {
      if (!record?.fileName || !await fileStat(path.join(root, record.fileName))) {
        delete index.items[videoId];
        missingIds.push(videoId);
      }
    }
    if (missingIds.length) await writeIndex(index);
    return missingIds;
  }

  async function list() {
    const index = await readIndex();
    const missingIds = await pruneMissing(index);
    await migrateIndexFileNames(index);
    const tracks = Object.values(index.items || {})
      .sort((a, b) => String(b.cachedAt || "").localeCompare(String(a.cachedAt || "")))
      .map(publicTrack);
    return {
      ...statsFor(index),
      missingCount: missingIds.length,
      missingIds,
      tracks,
      items: tracks
    };
  }

  async function get(videoId) {
    const id = String(videoId || "").trim();
    if (!id) return null;
    const index = await readIndex();
    const record = index.items[id];
    if (!record) return null;
    if (!await fileStat(path.join(root, record.fileName || ""))) {
      delete index.items[id];
      await writeIndex(index);
      return null;
    }
    try {
      if (await migrateRecordFileName(record)) await writeIndex(index);
    } catch {
      // Keep serving the old cache path if the file cannot be renamed right now.
    }
    return publicTrack(record);
  }

  async function filePath(videoId) {
    const id = String(videoId || "").trim();
    if (!id) return null;
    const index = await readIndex();
    const record = index.items[id];
    if (!record?.fileName) return null;
    const target = path.join(root, record.fileName);
    return await fileStat(target) ? target : null;
  }

  async function remove(videoId) {
    const id = String(videoId || "").trim();
    if (!id) return list();
    const index = await readIndex();
    const record = index.items[id];
    if (record?.fileName) {
      await fsp.rm(path.join(root, record.fileName), { force: true }).catch(() => {});
    }
    delete index.items[id];
    await writeIndex(index);
    return list();
  }

  async function clear() {
    await fsp.rm(root, { recursive: true, force: true }).catch(() => {});
    await ensureRoot();
    await writeIndex({ version: 1, items: {} });
    return { count: 0, bytes: 0, root, tracks: [], items: [] };
  }

  async function normalizeFileNames() {
    await ensureRoot();
    const index = await readIndex();
    await pruneMissing(index);
    await migrateIndexFileNames(index);
    return statsFor(index);
  }

  async function stream(videoId, request, response) {
    const id = String(videoId || "").trim();
    if (!id) {
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Missing video id");
      return;
    }

    const index = await readIndex();
    const record = index.items[id];
    try {
      if (record && await migrateRecordFileName(record)) await writeIndex(index);
    } catch {
      // Keep serving the old cache path if the file cannot be renamed right now.
    }
    const filePath = record?.fileName ? path.join(root, record.fileName) : "";
    const stat = filePath ? await fileStat(filePath) : null;
    if (!record || !stat) {
      if (record) {
        delete index.items[id];
        await writeIndex(index);
      }
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Offline file not found");
      return;
    }

    const size = stat.size;
    const mimeType = record.mimeType || "application/octet-stream";
    const range = request.headers.range || "";
    const headers = {
      "Content-Type": mimeType,
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-store"
    };

    if (range.startsWith("bytes=")) {
      const [startText, endText] = range.slice(6).split("-");
      const start = Math.max(0, Number.parseInt(startText, 10) || 0);
      const end = Number.isFinite(Number.parseInt(endText, 10))
        ? Math.min(size - 1, Number.parseInt(endText, 10))
        : size - 1;
      if (start >= size || end < start) {
        response.writeHead(416, { "Content-Range": `bytes */${size}` });
        response.end();
        return;
      }
      response.writeHead(206, {
        ...headers,
        "Content-Length": end - start + 1,
        "Content-Range": `bytes ${start}-${end}/${size}`
      });
      fs.createReadStream(filePath, { start, end }).pipe(response);
      return;
    }

    response.writeHead(200, {
      ...headers,
      "Content-Length": size
    });
    fs.createReadStream(filePath).pipe(response);
  }

  async function cleanupToLimit(index, limitBytes, keepVideoId) {
    let records = Object.values(index.items || {});
    let total = records.reduce((sum, record) => sum + (Number(record.size) || 0), 0);
    if (total <= limitBytes) return [];

    records = records
      .filter((record) => record.videoId !== keepVideoId && record.evictable === true)
      .sort((a, b) => String(a.cachedAt || "").localeCompare(String(b.cachedAt || "")));

    const removed = [];
    for (const record of records) {
      if (total <= limitBytes) break;
      if (record.fileName) await fsp.rm(path.join(root, record.fileName), { force: true }).catch(() => {});
      total -= Number(record.size) || 0;
      delete index.items[record.videoId];
      removed.push(record.videoId);
    }
    return removed;
  }

  async function downloadToFile(url, filePath, options = {}) {
    if (typeof fetch !== "function") throw new Error("Offline cache requires Electron's fetch runtime.");
    const response = await fetch(url, {
      headers: downloadHeaders(options.contentLength, options.rangeHeader, options.requestHeaders),
      redirect: "follow"
    });
    if (!response.ok) throw new Error(`Audio download failed with HTTP ${response.status}.`);
    const responseMime = response.headers.get("content-type") || "";
    if (responseMime && !isAllowedMediaType(responseMime)) {
      throw new Error(`Unexpected audio response type: ${responseMime}`);
    }
    if (!response.body) {
      const buffer = Buffer.from(await response.arrayBuffer());
      await fsp.writeFile(filePath, buffer);
      return { mimeType: responseMime, size: buffer.length };
    }
    await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(filePath));
    const stat = await fileStat(filePath);
    return { mimeType: responseMime, size: stat?.size || 0 };
  }

  async function downloadWithFallbacks(streamUrl, filePath, playback) {
    const contentLength = Number(playback.contentLength || 0) || 0;
    const requestHeaders = playback.requestHeaders || {};
    const attempts = [
      {
        label: "metrolist-range-query",
        url: withYouTubeRange(streamUrl, contentLength),
        options: { contentLength, rangeHeader: false, requestHeaders }
      },
      {
        label: "range-header",
        url: streamUrl,
        options: { contentLength, rangeHeader: true, requestHeaders }
      },
      {
        label: "plain-stream",
        url: streamUrl,
        options: { contentLength: 0, rangeHeader: false, requestHeaders }
      }
    ];
    const uniqueAttempts = attempts.filter((attempt, index, all) =>
      attempt.url && all.findIndex((other) => other.url === attempt.url && other.options.rangeHeader === attempt.options.rangeHeader) === index
    );
    const errors = [];
    for (const attempt of uniqueAttempts) {
      await fsp.rm(filePath, { force: true }).catch(() => {});
      try {
        const result = await downloadToFile(attempt.url, filePath, attempt.options);
        return { ...result, method: attempt.label };
      } catch (error) {
        errors.push(`${attempt.label}: ${error.message || error}`);
      }
    }
    throw new Error(`Audio download failed. ${errors.join(" | ")}`);
  }

  async function saveTrack(payload = {}) {
    const track = normalizeTrack(payload.track || {});
    const playback = payload.playback || {};
    const streamUrl = playback.streamUrl || payload.streamUrl || "";
    if (!track.id) throw new Error("Cannot cache a track without a video id.");
    if (playback.mode === "webview" || !streamUrl) {
      throw new Error("Only direct audio streams can be cached for offline playback.");
    }

    await ensureRoot();
    const index = await readIndex();
    const existing = index.items[track.id];
    if (existing && await fileStat(path.join(root, existing.fileName || ""))) {
      try {
        if (await migrateRecordFileName(existing)) await writeIndex(index);
      } catch {
        // Keep the existing cache path if the file cannot be renamed right now.
      }
      return { track: publicTrack(existing), stats: statsFor(index), alreadyCached: true };
    }

    const declaredMime = playback.mimeType || payload.mimeType || "";
    const fileName = cacheFileNameFor(track, track.id, declaredMime);
    const filePath = path.join(root, fileName);
    const tempPath = `${filePath}.part`;

    await fsp.rm(tempPath, { force: true }).catch(() => {});
    let result;
    try {
      result = await downloadWithFallbacks(streamUrl, tempPath, playback);
    } catch (error) {
      await fsp.rm(tempPath, { force: true }).catch(() => {});
      throw error;
    }
    const finalMime = declaredMime || result.mimeType;
    const finalName = cacheFileNameFor(track, track.id, finalMime || result.mimeType);
    const finalPath = path.join(root, finalName);
    await fsp.rm(finalPath, { force: true }).catch(() => {});
    await fsp.rename(tempPath, finalPath);

    const stat = await fileStat(finalPath);
    const record = {
      videoId: track.id,
      track,
      fileName: finalName,
      mimeType: finalMime || declaredMime || "audio/unknown",
      size: stat?.size || result.size || 0,
      cachedAt: new Date().toISOString(),
      evictable: payload.evictable === true,
      playback: {
        client: playback.client || "",
        itag: playback.itag || 0,
        bitrate: playback.bitrate || 0,
        audioSampleRate: playback.audioSampleRate || "",
        contentLength: Number(playback.contentLength || 0) || 0,
        downloadMethod: result.method || "",
        expiresInSeconds: playback.expiresInSeconds || 0
      }
    };

    index.items[track.id] = record;
    const evictedIds = await cleanupToLimit(index, normalizeLimitBytes(payload.maxBytes), track.id);
    await writeIndex(index);

    return {
      track: publicTrack(record),
      stats: statsFor(index),
      alreadyCached: false,
      evictedIds
    };
  }

  return {
    rootPath: () => root,
    ensureRoot,
    list,
    get,
    filePath,
    remove,
    clear,
    normalizeFileNames,
    saveTrack,
    stream
  };
}

module.exports = {
  createOfflineCache
};
