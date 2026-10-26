"use strict";

const https = require("node:https");
const dns = require("node:dns");
const net = require("node:net");
const { Readable } = require("node:stream");

const MAX_SOURCES = 20;
const MAX_RESULTS = 100;
const ERROR_CODES = new Set(["TIMEOUT", "TOO_LARGE", "HTTP", "CONTENT_TYPE", "INVALID_JSON", "INVALID_RESULTS", "NETWORK", "DISABLED", "SECRET_STORE"]);

function failure(code) { return Object.assign(new Error(code), { code }); }
function text(value, max = 500) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function publicAddress(address) {
  if (net.isIP(address) === 4) {
    const [a, b] = address.split(".").map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && [0, 168].includes(b)) ||
      (a === 198 && [18, 19, 51].includes(b)) || (a === 203 && b === 0));
  }
  // Only global unicast IPv6; mapped IPv4, local, multicast and documentation are excluded.
  return net.isIP(address) === 6 && /^[23]/i.test(address) && !/^2001:(?:db8|0:|10:|20:)/i.test(address);
}
function secureUrl(value, endpoint = false) {
  let url;
  try { url = new URL(value); } catch { throw new TypeError("Expected an absolute HTTPS URL"); }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (url.protocol !== "https:" || url.username || url.password || url.hash ||
      (endpoint && url.search) || (url.port && url.port !== "443") ||
      host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") ||
      (net.isIP(host) && !publicAddress(host))) throw new TypeError("Unsafe HTTPS URL");
  return url;
}
function safeLookup(hostname, options, callback) {
  dns.lookup(hostname, { all: true, verbatim: true }, (error, addresses) => {
    if (error) return callback(error);
    if (!addresses.length || addresses.some(({ address }) => !publicAddress(address))) return callback(failure("NETWORK"));
    if (options?.all) callback(null, addresses);
    else callback(null, addresses[0].address, addresses[0].family);
  });
}

// Validate DNS at the socket lookup, not in a separate preflight vulnerable to rebinding.
function nativeFetch(url, { method, headers, signal }) {
  return new Promise((resolve, reject) => {
    const request = https.request(url, { method, headers, signal, lookup: safeLookup, agent: false }, (response) => {
      const responseHeaders = new Headers();
      for (const [key, value] of Object.entries(response.headers)) {
        if (value != null) responseHeaders.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
      resolve({ status: response.statusCode, headers: responseHeaders,
        body: Readable.toWeb(response), url: String(url) });
    });
    request.on("error", reject);
    request.end();
  });
}
function validateConfig(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new TypeError("Expected a source object");
  const allowed = new Set(["id", "name", "searchUrl", "healthUrl", "enabled", "mediaOrigins"]);
  if (Object.keys(input).some((key) => !allowed.has(key))) throw new TypeError("Unsupported source field; credentials belong in the secure store");
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(input.id) || input.id === "youtube") throw new TypeError("Invalid source id");
  if (typeof input.name !== "string" || !input.name.trim() || input.name.length > 100) throw new TypeError("Invalid source name");
  if (input.enabled !== undefined && typeof input.enabled !== "boolean") throw new TypeError("Invalid enabled flag");
  const searchUrl = secureUrl(input.searchUrl, true).href;
  const healthUrl = input.healthUrl ? secureUrl(input.healthUrl, true).href : null;
  if (healthUrl && new URL(healthUrl).origin !== new URL(searchUrl).origin) throw new TypeError("Health endpoint must share the search origin");
  const origins = input.mediaOrigins ?? [new URL(searchUrl).origin];
  if (!Array.isArray(origins) || origins.length > 10) throw new TypeError("Invalid media origins");
  const mediaOrigins = [...new Set(origins.map((origin) => {
    const url = secureUrl(origin, true);
    if (url.pathname !== "/") throw new TypeError("Expected a media origin");
    return url.origin;
  }))];
  return { id: input.id, name: input.name.trim(), searchUrl, healthUrl, enabled: input.enabled !== false, mediaOrigins };
}
function validateHeaders(input) {
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).length > 16) throw new TypeError("Invalid headers");
  const result = {};
  for (const [name, value] of Object.entries(input)) {
    if (!/^[!#$%&'*+.^_`|~0-9a-z-]+$/i.test(name) ||
        /^(host|cookie|set-cookie|connection|content-length|transfer-encoding|upgrade|proxy-.*|sec-.*|accept-encoding|range)$/i.test(name) ||
        typeof value !== "string" || value.length > 4096 || /[^\x20-\x7e]/.test(value)) throw new TypeError("Unsafe header");
    result[name.toLowerCase()] = value;
  }
  return result;
}
function normalize(value) {
  return text(value).normalize("NFKC").toLocaleLowerCase("en-US").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}
function seconds(track) {
  for (const value of [track?.durationSeconds, track?.lengthSeconds, track?.duration]) {
    if (value == null || value === "") continue;
    if (typeof value === "number" || /^\d+(?:\.\d+)?$/.test(String(value))) {
      const n = Number(value);
      if (Number.isFinite(n) && n > 0) return n;
    }
    if (typeof value === "string" && /^\d+(?::[0-5]\d){1,2}$/.test(value)) return value.split(":").reduce((sum, part) => sum * 60 + Number(part), 0) || null;
  }
  return null;
}
const VARIANT = /\b(live|remix|remaster(?:ed)?|acoustic|instrumental|karaoke|cover|sped[ -]?up|slowed|radio|edit|extended|clean|explicit|demo|mono|stereo|re[ -]?recorded|version|mix)\b/i;
function identity(track) {
  const variants = [];
  let title = text(track?.title);
  title = title.replace(/\([^)]*\)|\[[^\]]*\]/g, (part) => {
    if (VARIANT.test(part)) { variants.push(normalize(part)); return " "; }
    if (/^[([]\s*(?:official\s+)?(?:music\s+video|audio|video|lyric(?:s| video)?|visualizer)\s*[)\]]$/i.test(part)) return " ";
    return part;
  });
  title = title.replace(/\s+[-\u2013\u2014]\s+(.+)$/, (whole, suffix) => {
    if (VARIANT.test(suffix)) { variants.push(normalize(suffix)); return ""; }
    if (/^(?:official\s+)?(?:music\s+video|audio|video|lyrics|visualizer)$/i.test(suffix)) return "";
    return whole;
  });
  if (text(track?.version)) variants.push(normalize(track.version));
  if (typeof track?.explicit === "boolean") variants.push(track.explicit ? "explicit" : "clean");
  const artists = Array.isArray(track?.artists) && track.artists.length
    ? track.artists.map((artist) => normalize(typeof artist === "string" ? artist : artist?.title || artist?.name))
    : [normalize(track?.artist)];
  return { title: normalize(title), artists: [...new Set(artists.filter(Boolean))].sort().join("|"),
    version: [...new Set(variants.filter(Boolean))].sort().join("|"), duration: seconds(track) };
}
function matchTrack(expected, candidate) {
  const a = identity(expected), b = identity(candidate);
  const reasons = [];
  if (!a.title || !b.title || a.title !== b.title) reasons.push("title");
  if (!a.artists || !b.artists || a.artists !== b.artists) reasons.push("artist");
  if (!a.duration || !b.duration) reasons.push("missing-duration");
  else if (Math.abs(a.duration - b.duration) > Math.min(3, a.duration * 0.02)) reasons.push("duration");
  if (a.version !== b.version) reasons.push("version");
  return { matches: reasons.length === 0, reasons, durationDelta: a.duration && b.duration ? Math.abs(a.duration - b.duration) : null };
}
function mediaInfo(headers) {
  const contentType = (headers.get("content-type") || "").toLowerCase();
  const mime = contentType.split(";")[0].trim();
  let codec = null, lossless = null;
  if (["audio/flac", "audio/x-flac"].includes(mime)) { codec = "flac"; lossless = true; }
  else if (mime === "audio/mpeg") { codec = "mp3"; lossless = false; }
  else if (["audio/aac", "audio/aacp"].includes(mime)) { codec = "aac"; lossless = false; }
  else {
    const declared = contentType.match(/codecs\s*=\s*"?([a-z0-9. -]+)/)?.[1]?.trim();
    if (declared && /^(opus|vorbis|flac|alac|mp4a\.40\.\d+)$/.test(declared)) {
      codec = declared;
      lossless = ["flac", "alac"].includes(codec);
    }
  }
  const bitrate = Number(headers.get("icy-br"));
  return { contentType: text(contentType, 200), codec, lossless,
    bitrateKbps: Number.isFinite(bitrate) && bitrate > 0 && bitrate <= 10000 ? bitrate : null,
    evidence: "response-headers", verifiedAudioBytes: false };
}

class SourceManager {
  #sources = new Map();
  #health = new Map();
  #fetch;
  #secrets;
  #youtube;
  #timeout;
  #maxBytes;
  #active = 0;
  constructor({ sources = [], fetchImpl = nativeFetch, secureStore = null, youtube = null, timeoutMs = 8000, maxBytes = 1024 * 1024 } = {}) {
    if (!Array.isArray(sources) || sources.length > MAX_SOURCES) throw new TypeError("Too many sources");
    if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 30000 || !Number.isInteger(maxBytes) || maxBytes < 1 || maxBytes > 4 * 1024 * 1024) throw new TypeError("Invalid network limits");
    this.#fetch = fetchImpl; this.#secrets = secureStore; this.#youtube = youtube;
    this.#timeout = timeoutMs; this.#maxBytes = maxBytes;
    for (const source of sources) {
      if (this.#sources.has(source.id)) throw new TypeError("Duplicate source id");
      this.upsertSource(source);
    }
  }
  upsertSource(input) {
    const source = validateConfig(input);
    if (!this.#sources.has(source.id) && this.#sources.size >= MAX_SOURCES) throw new TypeError("Too many sources");
    this.#sources.set(source.id, source);
    this.#health.delete(source.id);
    return structuredClone(source);
  }
  #source(id) {
    const source = this.#sources.get(id);
    if (!source) throw new TypeError("Unknown source");
    return source;
  }
  async removeSource(id) {
    this.#source(id);
    if (this.#secrets) await this.#secrets.delete(id);
    this.#sources.delete(id); this.#health.delete(id);
  }
  async setSourceHeaders(id, headers) {
    this.#source(id);
    const safe = validateHeaders(headers);
    if (!this.#secrets) throw failure("SECRET_STORE");
    // The host supplies an OS-backed encrypted store with async get/set/delete.
    await this.#secrets.set(id, safe);
  }
  listSources() {
    return [...this.#sources.values()].map((source) => ({ ...structuredClone(source), health: this.getHealth(source.id) }));
  }
  exportConfig() { return [...this.#sources.values()].map((source) => structuredClone(source)); }
  getHealth(id) { this.#source(id); return { ...(this.#health.get(id) || { state: "unknown", checkedAt: null, latencyMs: null, error: null }) }; }
  diagnostics() {
    // No endpoints, names, queries, media URLs, headers or upstream error messages.
    return [...this.#sources.values()].map(({ id, enabled }) => ({ id, enabled, health: this.getHealth(id) }));
  }
  async #request(source, url, method = "GET") {
    if (!source.enabled) throw failure("DISABLED");
    if (this.#active >= 4) throw failure("NETWORK");
    this.#active++;
    const controller = new AbortController();
    let reader;
    let timer;
    const deadline = new Promise((_, reject) => {
      timer = setTimeout(() => { controller.abort(); reject(failure("TIMEOUT")); }, this.#timeout);
    });
    const work = (async () => {
      // Never forward source credentials to a different media origin.
      const stored = url.origin === new URL(source.searchUrl).origin && this.#secrets ? await this.#secrets.get(source.id) : {};
      if (controller.signal.aborted) throw failure("TIMEOUT");
      const headers = { ...validateHeaders(stored || {}), accept: method === "HEAD" ? "audio/*" : "application/json", "accept-encoding": "identity" };
      const response = await this.#fetch(url.href, { method, headers, signal: controller.signal, redirect: "error" });
      if (controller.signal.aborted) { await response.body?.cancel().catch(() => {}); throw failure("TIMEOUT"); }
      reader = response.body?.getReader();
      if (response.status < 200 || response.status >= 300) throw failure("HTTP");
      if (response.url && new URL(response.url).href !== url.href) throw failure("HTTP");
      if (method === "HEAD") return mediaInfo(response.headers);
      if (!/^application\/(?:[a-z0-9.+-]+\+)?json(?:\s*;|$)/i.test(response.headers.get("content-type") || "") ||
          ![null, "identity"].includes(response.headers.get("content-encoding"))) throw failure("CONTENT_TYPE");
      if (Number(response.headers.get("content-length")) > this.#maxBytes) throw failure("TOO_LARGE");
      const chunks = []; let size = 0;
      if (!reader) throw failure("INVALID_JSON");
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > this.#maxBytes) throw failure("TOO_LARGE");
        chunks.push(Buffer.from(value));
      }
      try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw failure("INVALID_JSON"); }
    })();
    try { return await Promise.race([work, deadline]); }
    catch (error) { throw failure(ERROR_CODES.has(error?.code) ? error.code : "NETWORK"); }
    finally {
      clearTimeout(timer); controller.abort();
      if (reader) void reader.cancel().catch(() => {});
      this.#active--;
    }
  }
  async #observed(source, operation) {
    const started = Date.now();
    try {
      const result = await operation();
      this.#health.set(source.id, { state: "healthy", checkedAt: new Date().toISOString(), latencyMs: Date.now() - started, error: null });
      return result;
    } catch (error) {
      this.#health.set(source.id, { state: source.enabled ? "unhealthy" : "disabled", checkedAt: new Date().toISOString(), latencyMs: Date.now() - started, error: ERROR_CODES.has(error.code) ? error.code : "INVALID_RESULTS" });
      throw error;
    }
  }
  async checkHealth(id) {
    const source = this.#source(id);
    try { await this.#observed(source, () => this.#request(source, new URL(source.healthUrl || source.searchUrl))); } catch { /* Status is returned, not upstream errors. */ }
    return this.getHealth(id);
  }
  async search(id, query) {
    const source = this.#source(id);
    if (typeof query !== "string" || !query.trim() || query.length > 500) throw new TypeError("Invalid query");
    return this.#observed(source, async () => {
      const url = new URL(source.searchUrl); url.searchParams.set("q", query.trim());
      const data = await this.#request(source, url);
      if (!data || !Array.isArray(data.tracks) || data.tracks.length > MAX_RESULTS) throw failure("INVALID_RESULTS");
      const results = [], seen = new Set();
      for (const item of data.tracks) {
        if (!item || !text(item.id) || !text(item.title)) continue;
        const id = text(item.id);
        if (seen.has(id)) continue;
        let mediaUrl = null;
        if (item.url) {
          try {
            const media = secureUrl(item.url);
            if (source.mediaOrigins.includes(media.origin)) mediaUrl = media.href;
          } catch { /* Unsafe media is never offered as playable. */ }
        }
        seen.add(id);
        results.push({ id, sourceId: source.id, title: text(item.title), artist: text(item.artist),
          artists: Array.isArray(item.artists) ? item.artists.slice(0, 20).map((artist) => ({ title: text(typeof artist === "string" ? artist : artist?.title || artist?.name) })).filter((artist) => artist.title) : [],
          durationSeconds: seconds(item), version: text(item.version),
          ...(typeof item.explicit === "boolean" ? { explicit: item.explicit } : {}),
          url: mediaUrl, media: null });
      }
      return results;
    });
  }
  async findMatches(track) {
    const query = [text(track?.title), text(track?.artist) || (track?.artists || []).map((a) => typeof a === "string" ? a : a.title || a.name).join(" ")].filter(Boolean).join(" ");
    const matches = [], errors = [];
    // Sequential sources keep requests bounded even with the maximum source count.
    for (const source of this.#sources.values()) {
      if (!source.enabled) continue;
      try {
        for (const candidate of await this.search(source.id, query)) {
          const match = matchTrack(track, candidate);
          if (match.matches) matches.push({ ...candidate, match });
        }
      } catch (error) { errors.push({ sourceId: source.id, code: ERROR_CODES.has(error.code) ? error.code : "NETWORK" }); }
    }
    return { matches, errors };
  }
  async probeMedia(id, mediaUrl) {
    const source = this.#source(id), url = secureUrl(mediaUrl);
    if (!source.mediaOrigins.includes(url.origin)) throw new TypeError("Media origin is not allowed");
    const info = await this.#request(source, url, "HEAD");
    if (!info.contentType.startsWith("audio/") && !info.contentType.startsWith("application/ogg")) throw failure("CONTENT_TYPE");
    return info;
  }
  async queryVersions(track, query = "") {
    if (!this.#youtube || typeof this.#youtube.search !== "function") throw new TypeError("YouTube search is not configured");
    const actualQuery = text(query) || [text(track?.title), text(track?.artist)].filter(Boolean).join(" ");
    if (!actualQuery) throw new TypeError("Invalid query");
    let timer;
    try {
      const page = await Promise.race([
        Promise.resolve().then(() => this.#youtube.search(actualQuery, "songs")),
        new Promise((_, reject) => { timer = setTimeout(() => reject(failure("TIMEOUT")), this.#timeout); })
      ]);
      const seen = new Set();
      return (Array.isArray(page?.tracks) ? page.tracks : []).slice(0, MAX_RESULTS).flatMap((item) => {
        const id = text(item?.videoId || item?.id);
        if (!id || seen.has(id)) return [];
        seen.add(id);
        const candidate = { id, videoId: id, sourceId: "youtube", title: text(item.title), artist: text(item.artist),
          artists: Array.isArray(item.artists) ? item.artists.slice(0, 20).map((a) => ({ title: text(typeof a === "string" ? a : a?.title || a?.name) })) : [],
          durationSeconds: seconds(item), version: text(item.version),
          ...(typeof item.explicit === "boolean" ? { explicit: item.explicit } : {}), media: null };
        const match = matchTrack(track, candidate);
        if (match.reasons.includes("title") || match.reasons.includes("artist")) return [];
        return [{ ...candidate, match, manualSelection: true }];
      }).sort((a, b) => Number(b.match.matches) - Number(a.match.matches) || (a.match.durationDelta ?? Infinity) - (b.match.durationDelta ?? Infinity));
    } catch (error) { throw failure(error?.code === "TIMEOUT" ? "TIMEOUT" : "NETWORK"); }
    finally { clearTimeout(timer); }
  }
}

module.exports = { SourceManager, matchTrack, validateConfig, mediaInfo };
