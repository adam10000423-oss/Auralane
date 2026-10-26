"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const net = require("node:net");
const { EventEmitter } = require("node:events");

class IntegrationError extends Error {
  constructor(code, message, retryable = false) {
    super(message); this.code = code; this.retryable = retryable;
  }
}

function lastFmSignature(params, secret) {
  return crypto.createHash("md5").update(Object.keys(params).filter(k => !["format", "callback", "api_sig"].includes(k))
    .sort().map(k => k + String(params[k])).join("") + secret, "utf8").digest("hex");
}

// The injected alternative must itself be an encrypted/keychain-backed store.
function createSafeStorage({ filePath, safeStorage }) {
  function check() {
    if (!safeStorage?.isEncryptionAvailable() || safeStorage.getSelectedStorageBackend?.() === "basic_text") {
      throw new IntegrationError("SECURE_STORAGE_UNAVAILABLE", "OS-backed secret encryption is unavailable.");
    }
  }
  return {
    async get() {
      check();
      try { return safeStorage.decryptString(await fs.readFile(filePath)); }
      catch (error) { if (error.code === "ENOENT") return null; throw error; }
    },
    async set(_key, value) {
      check();
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      const temp = `${filePath}.${crypto.randomUUID()}.tmp`;
      try {
        await fs.writeFile(temp, safeStorage.encryptString(value), { mode: 0o600, flag: "wx" });
        await fs.rename(temp, filePath);
      } finally { await fs.rm(temp, { force: true }); }
    }
  };
}

function rpcFrame(opcode, payload) {
  const body = Buffer.from(JSON.stringify(payload));
  const header = Buffer.alloc(8);
  header.writeUInt32LE(opcode, 0); header.writeUInt32LE(body.length, 4);
  return Buffer.concat([header, body]);
}

class DiscordRPC {
  constructor({ connect = net.createConnection, platform = process.platform, env = process.env, timeoutMs = 3000 } = {}) {
    Object.assign(this, { connectSocket: connect, platform, env, timeoutMs });
    this.pending = new Map(); this.socket = null; this.ready = false;
  }
  async connect(clientId) {
    if (!/^\d{16,22}$/.test(clientId)) throw new IntegrationError("INVALID_CLIENT_ID", "Enter a Discord application ID.");
    this.close();
    const prefix = this.env.XDG_RUNTIME_DIR || this.env.TMPDIR || this.env.TMP || this.env.TEMP || "/tmp";
    for (let i = 0; i < 10; i++) {
      try {
        await this.open(this.platform === "win32" ? `\\\\?\\pipe\\discord-ipc-${i}` : path.join(prefix, `discord-ipc-${i}`), clientId);
        return { connected: true };
      } catch { this.close(); }
    }
    throw new IntegrationError("DISCORD_UNAVAILABLE", "Discord desktop IPC is unavailable. Open Discord and try again.");
  }
  open(socketPath, clientId) {
    return new Promise((resolve, reject) => {
      let buffer = Buffer.alloc(0);
      const socket = this.connectSocket({ path: socketPath }); this.socket = socket;
      const timer = setTimeout(() => { reject(new Error("IPC handshake timed out")); socket.destroy(); }, this.timeoutMs);
      const fail = () => {
        clearTimeout(timer);
        reject(new IntegrationError("DISCORD_CLOSED", "Discord IPC closed."));
        if (this.socket !== socket) return;
        this.ready = false;
        for (const item of this.pending.values()) { clearTimeout(item.timer); item.reject(new Error("Discord disconnected")); }
        this.pending.clear();
      };
      socket.on("error", fail); socket.on("close", fail);
      socket.once("connect", () => socket.write(rpcFrame(0, { v: 1, client_id: clientId })));
      socket.on("data", chunk => {
        buffer = Buffer.concat([buffer, chunk]);
        try {
          while (buffer.length >= 8) {
            const opcode = buffer.readUInt32LE(0), size = buffer.readUInt32LE(4);
            if (size > 1024 * 1024) throw new Error("Oversized IPC frame");
            if (buffer.length < size + 8) break;
            const body = JSON.parse(buffer.subarray(8, 8 + size).toString("utf8")); buffer = buffer.subarray(8 + size);
            if (opcode === 3) { socket.write(rpcFrame(4, body)); continue; }
            if (opcode === 2) throw new Error("IPC close");
            if (opcode !== 1) continue;
            if (body.evt === "READY") { clearTimeout(timer); this.ready = true; resolve(); }
            const item = this.pending.get(body.nonce);
            if (item) {
              clearTimeout(item.timer); this.pending.delete(body.nonce);
              if (body.evt === "ERROR") item.reject(new IntegrationError("DISCORD_RPC_ERROR", "Discord rejected the activity."));
              else item.resolve({ updated: true });
            }
          }
        } catch { fail(); socket.destroy(); }
      });
    });
  }
  setActivity(activity) {
    if (!this.ready) return Promise.reject(new IntegrationError("DISCORD_UNAVAILABLE", "Discord is not connected."));
    return new Promise((resolve, reject) => {
      const nonce = crypto.randomUUID();
      const timer = setTimeout(() => { this.pending.delete(nonce); reject(new Error("Discord response timed out")); }, this.timeoutMs);
      this.pending.set(nonce, { resolve, reject, timer });
      this.socket.write(rpcFrame(1, { cmd: "SET_ACTIVITY", args: { pid: process.pid, activity }, nonce }));
    });
  }
  close() { this.ready = false; this.socket?.destroy(); this.socket = null;
    for (const item of this.pending.values()) { clearTimeout(item.timer); item.reject(new Error("Discord disconnected")); }
    this.pending.clear();
  }
}

const normalize = value => String(value || "").normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const versions = title => ["live", "remix", "acoustic", "instrumental", "karaoke", "cover", "sped up", "slowed", "remaster", "radio edit"].filter(v => normalize(title).includes(v));
function seconds(track) {
  if (Number(track.durationSeconds) > 0) return Number(track.durationSeconds);
  const parts = String(track.duration || "").split(":");
  return parts.length > 1 && parts.every(p => /^\d+$/.test(p)) ? parts.reduce((a, p) => a * 60 + Number(p), 0) : 0;
}
function matchTrack(source, candidates) {
  const title = normalize(source.name), artist = normalize(source.artists?.[0]?.name);
  if (!title || !artist) return null;
  const base = value => normalize(value).replace(/\b(official|audio|video|lyrics|lyric|hd|hq)\b/g, "").replace(/\s+/g, " ").trim();
  const matches = candidates.filter(c => {
    if (!c.videoId || versions(source.name).join() !== versions(c.title).join()) return false;
    const candidateArtist = normalize(c.artist || c.artists?.map(a => a.name || a.title).join(" "));
    if (!candidateArtist.split(" ").length || !(candidateArtist === artist || candidateArtist.includes(artist))) return false;
    if (base(c.title) !== base(title)) return false;
    const duration = seconds(c);
    return duration > 0 && Math.abs(duration - source.duration_ms / 1000) <= Math.max(8, source.duration_ms / 1000 * 0.04);
  });
  return matches.length === 1 ? matches[0] : null;
}

async function createMusicIntegrations(options = {}) {
  const { fetch: fetcher = globalThis.fetch, youtube, now = Date.now } = options;
  let storage = options.secretStorage;
  if (!storage) {
    const electron = options.electron || require("electron");
    storage = createSafeStorage({ filePath: options.storagePath || path.join(electron.app.getPath("userData"), "music-integrations.enc"), safeStorage: electron.safeStorage });
  }
  const key = "auralane.musicIntegrations.v1";
  let state = JSON.parse(await storage.get(key) || "null") || { lastfm: {}, listenbrainz: {}, spotify: {}, discord: {}, outbox: [] };
  state.outbox = (state.outbox || []).slice(-200);
  const events = new EventEmitter(), rpc = options.discordRPC || new DiscordRPC(options.discordOptions);
  let active = null, pendingAuth = null, chain = Promise.resolve(), importing = false, closed = false;
  const errors = {};
  const save = () => storage.set(key, JSON.stringify(state));
  const serial = fn => (...args) => {
    const job = chain.then(() => { if (closed) throw new Error("Integrations disposed"); return fn(...args); });
    chain = job.catch(() => {}); return job;
  };
  async function request(url, init = {}) {
    let response;
    try { response = await fetcher(url, { ...init, redirect: "error", signal: AbortSignal.timeout(15000), headers: { "User-Agent": "Auralane/1.0 (music integrations)", ...init.headers } }); }
    catch { throw new IntegrationError("NETWORK_ERROR", "Service request failed or timed out.", true); }
    if (!response.ok) throw new IntegrationError(`HTTP_${response.status}`, `Service returned HTTP ${response.status}.`, response.status === 429 || response.status >= 500);
    try { return await response.json(); } catch { throw new IntegrationError("INVALID_RESPONSE", "Service returned an invalid JSON response."); }
  }
  async function lastfm(method, params = {}, config = state.lastfm) {
    if (!config.apiKey || !config.apiSecret) throw new IntegrationError("LASTFM_CONFIG_REQUIRED", "Save your Last.fm application API key and secret first.");
    const body = { method, api_key: config.apiKey, ...params };
    body.api_sig = lastFmSignature(body, config.apiSecret); body.format = "json";
    const result = await request("https://ws.audioscrobbler.com/2.0/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(body).toString() });
    if (result.error) throw new IntegrationError(`LASTFM_${result.error}`, `Last.fm rejected ${method} (${result.error}).`, [11, 16, 29].includes(Number(result.error)));
    return result;
  }
  async function listenbrainz(type, track, timestamp) {
    const item = { track_metadata: { artist_name: track.artist, track_name: track.title,
      ...(track.album ? { release_name: track.album } : {}), additional_info: { submission_client: "Auralane", duration_ms: Math.round(track.durationSeconds * 1000) } } };
    if (type !== "playing_now") item.listened_at = timestamp;
    const result = await request("https://api.listenbrainz.org/1/submit-listens", { method: "POST", headers: { Authorization: `Token ${state.listenbrainz.token}`, "Content-Type": "application/json" }, body: JSON.stringify({ listen_type: type, payload: [item] }) });
    if (result.status !== "ok") throw new IntegrationError("LISTEN_REJECTED", "ListenBrainz did not accept the submission.");
  }
  async function submit(service, track, timestamp, playing = false) {
    if (service === "listenbrainz") return listenbrainz(playing ? "playing_now" : "single", track, timestamp);
    const params = { artist: track.artist, track: track.title, duration: Math.floor(track.durationSeconds), sk: state.lastfm.sessionKey };
    if (track.album) params.album = track.album;
    if (!playing) params.timestamp = timestamp;
    const result = await lastfm(playing ? "track.updateNowPlaying" : "track.scrobble", params);
    if (!playing && Number(result.scrobbles?.["@attr"]?.accepted) !== 1) throw new IntegrationError("SCROBBLE_REJECTED", "Last.fm did not accept the scrobble.");
  }
  function connected(service) { return service === "lastfm" ? Boolean(state.lastfm.sessionKey) : Boolean(state.listenbrainz.token); }
  function status() {
    return { lastfm: { configured: Boolean(state.lastfm.apiKey), connected: connected("lastfm"), username: state.lastfm.username || "" },
      listenbrainz: { connected: connected("listenbrainz"), username: state.listenbrainz.username || "" },
      spotify: { configured: Boolean(state.spotify.clientId && state.spotify.clientSecret) },
      discord: { configured: Boolean(state.discord.clientId), connected: Boolean(rpc.ready) }, outbox: state.outbox.length, errors: { ...errors } };
  }
  async function playback({ playId, track, playing = false, seeking = false } = {}) {
    const time = now();
    if (active) {
      const delta = (time - active.last) / 1000;
      if (active.playing && !seeking && delta > 0 && delta <= 15) active.elapsed += delta;
      active.last = time;
      // Finish the previous play before a skip replaces it.
      await scrobbleActive();
    }
    if (!track) { active = null; if (rpc.ready) await rpc.setActivity(null); return status(); }
    if (!playId || !track.title || !track.artist) throw new IntegrationError("INVALID_PLAYBACK", "Playback requires a unique playId, title and artist.");
    if (active?.playId !== playId) active = { playId, track: { title: String(track.title).slice(0, 512), artist: String(track.artist).slice(0, 512), album: String(track.album || "").slice(0, 512), durationSeconds: seconds(track) }, last: time, started: Math.floor(time / 1000), elapsed: 0, sent: new Set(), announced: new Set(), playing: false };
    active.playing = Boolean(playing && !seeking);
    if (active.playing) {
      for (const service of ["lastfm", "listenbrainz"]) if (connected(service) && !active.announced.has(service)) {
        active.announced.add(service);
        try { await submit(service, active.track, active.started, true); delete errors[service]; }
        catch (error) { errors[service] = error.code || "SUBMISSION_FAILED"; }
      }
    }
    if (rpc.ready && active.presencePlaying !== active.playing) {
      active.presencePlaying = active.playing;
      try { await rpc.setActivity(active.playing ? { type: 2, details: active.track.title.slice(0, 128), state: active.track.artist.slice(0, 128) } : null); }
      catch { errors.discord = "PRESENCE_FAILED"; }
    }
    return status();
  }
  async function scrobbleActive() {
    const duration = active.track.durationSeconds;
    if (!duration || active.elapsed < Math.min(duration / 2, 240)) return;
    let changed = false;
    for (const service of ["lastfm", "listenbrainz"]) {
      if (!connected(service) || active.sent.has(service) || (service === "lastfm" && duration <= 30)) continue;
      active.sent.add(service);
      changed = true;
      try { await submit(service, active.track, active.started); delete errors[service]; }
      catch (error) {
        errors[service] = error.code || "SUBMISSION_FAILED";
        if (error.retryable) state.outbox.push({ service, track: active.track, timestamp: active.started, attempts: 1, nextAt: now() + 30000 });
      }
    }
    if (changed) { state.outbox = state.outbox.slice(-200); await save(); }
  }
  async function retryOutbox() {
    const kept = [];
    for (const item of state.outbox) {
      if (item.attempts >= 5 || now() - item.timestamp * 1000 > 7 * 86400000 || !connected(item.service)) continue;
      if (item.nextAt > now()) { kept.push(item); continue; }
      try { await submit(item.service, item.track, item.timestamp); delete errors[item.service]; }
      catch (error) {
        errors[item.service] = error.code || "SUBMISSION_FAILED";
        if (error.retryable) kept.push({ ...item, attempts: item.attempts + 1, nextAt: now() + Math.min(3600000, 30000 * 2 ** item.attempts) });
      }
    }
    state.outbox = kept.slice(-200); await save(); return status();
  }
  async function configure(service, config) {
    if (!["lastfm", "spotify", "discord"].includes(service)) throw new Error("Unsupported configuration");
    const fields = service === "lastfm" ? ["apiKey", "apiSecret"] : service === "spotify" ? ["clientId", "clientSecret"] : ["clientId"];
    const next = {};
    for (const field of fields) {
      next[field] = String(config?.[field] || "").trim();
      if (!next[field] || next[field].length > 512) throw new IntegrationError("INVALID_CONFIG", `Missing or invalid ${field}.`);
    }
    if (service === "lastfm") pendingAuth = null;
    if (service === "discord") rpc.close();
    state[service] = next; state.outbox = state.outbox.filter(i => i.service !== service);
    await save(); return status();
  }
  async function importSpotify(url, { onProgress = () => {}, signal, market = "TW" } = {}) {
    if (closed || importing) throw new IntegrationError("IMPORT_BUSY", "An import is already running or integrations are disposed.");
    let parsed; try { parsed = new URL(url); } catch { throw new IntegrationError("INVALID_PLAYLIST_URL", "Enter a public Spotify playlist URL."); }
    const id = parsed.pathname.match(/^\/(?:intl-[a-z]+\/)?playlist\/([a-zA-Z0-9]{22})\/?$/)?.[1];
    if (parsed.protocol !== "https:" || parsed.hostname !== "open.spotify.com" || parsed.port || parsed.username || parsed.password || !id) throw new IntegrationError("INVALID_PLAYLIST_URL", "Enter an https://open.spotify.com/playlist/... URL.");
    if (!/^[A-Z]{2}$/.test(market)) throw new Error("Invalid market");
    if (!youtube?.search) throw new IntegrationError("SEARCH_UNAVAILABLE", "YouTube search is not connected.");
    const config = { ...state.spotify };
    if (!config.clientId || !config.clientSecret) return { status: "unavailable", code: "SPOTIFY_CONFIG_REQUIRED", matched: [], unmatched: [] };
    importing = true;
    const matched = [], unmatched = [];
    const progress = value => { onProgress(value); events.emit("import-progress", value); };
    const check = () => { if (signal?.aborted || closed) throw new IntegrationError("IMPORT_CANCELLED", "Import cancelled."); };
    try {
      check(); progress({ phase: "loading", completed: 0 });
      const token = await request("https://accounts.spotify.com/api/token", { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" });
      if (!token.access_token) throw new IntegrationError("SPOTIFY_UNAVAILABLE", "Spotify did not issue an access token.");
      const get = endpoint => request(`https://api.spotify.com/v1${endpoint}`, { headers: { Authorization: `Bearer ${token.access_token}` } });
      const playlist = await get(`/playlists/${id}?fields=id,name,public,external_urls`);
      if (playlist.public !== true) throw new IntegrationError("NOT_PUBLIC", "Only explicitly public playlists can be imported.");
      let next = `https://api.spotify.com/v1/playlists/${id}/items?limit=50&market=${market}`;
      const rows = [], visited = new Set();
      while (next) {
        check(); const pageURL = new URL(next);
        if (pageURL.origin !== "https://api.spotify.com" || pageURL.pathname !== `/v1/playlists/${id}/items` || visited.has(next) || visited.size >= 100) throw new IntegrationError("INVALID_PAGINATION", "Spotify returned invalid or excessive pagination.");
        visited.add(next);
        const page = await get(pageURL.pathname.slice(3) + pageURL.search);
        if (!Array.isArray(page.items)) throw new IntegrationError("SPOTIFY_UNAVAILABLE", "Spotify did not return playlist items.");
        rows.push(...page.items); next = page.next;
        progress({ phase: "loading", completed: rows.length, total: page.total });
      }
      for (let index = 0; index < rows.length; index++) {
        check(); const row = rows[index], source = row.item || row.track;
        let candidate = null, reason = "No confident version match";
        if (!source || source.type !== "track" || row.is_local || source.is_local) reason = "Unavailable, local or non-music item";
        else {
          try { const result = await youtube.search(`${source.artists?.map(a => a.name).join(" ")} ${source.name}`, "songs"); check(); candidate = matchTrack(source, Array.isArray(result) ? result : result.tracks || []); }
          catch (error) { if (error.code === "IMPORT_CANCELLED") throw error; reason = "YouTube search failed"; }
        }
        if (candidate) matched.push({ index, source, track: candidate });
        else unmatched.push({ index, source: source || null, reason });
        progress({ phase: "matching", completed: index + 1, total: rows.length, matched: matched.length, unmatched: unmatched.length });
      }
      return { status: unmatched.length ? "partial" : "complete", name: playlist.name, sourceUrl: `https://open.spotify.com/playlist/${id}`, matched, unmatched };
    } catch (error) {
      if (error.code === "IMPORT_CANCELLED") return { status: "cancelled", matched, unmatched };
      return { status: "unavailable", code: error.code || "IMPORT_FAILED", message: error.message, matched: [], unmatched: [] };
    } finally { importing = false; }
  }
  return {
    status, events, configure: serial(configure), playback: serial(playback), retryOutbox: serial(retryOutbox), importSpotify,
    beginLastFmLogin: serial(async () => {
      const result = await lastfm("auth.getToken");
      if (!result.token) throw new IntegrationError("INVALID_RESPONSE", "Last.fm did not return a token.");
      pendingAuth = { token: result.token, expires: now() + 3600000 };
      return { url: `https://www.last.fm/api/auth/?${new URLSearchParams({ api_key: state.lastfm.apiKey, token: result.token })}` };
    }),
    completeLastFmLogin: serial(async () => {
      if (!pendingAuth || now() >= pendingAuth.expires) throw new IntegrationError("AUTH_EXPIRED", "Start Last.fm authorization again.");
      const result = await lastfm("auth.getSession", { token: pendingAuth.token });
      if (!result.session?.key || !result.session?.name) throw new IntegrationError("INVALID_RESPONSE", "Last.fm did not return a session.");
      state.lastfm.sessionKey = result.session.key; state.lastfm.username = result.session.name; pendingAuth = null;
      state.outbox = state.outbox.filter(i => i.service !== "lastfm"); await save(); return status();
    }),
    connectListenBrainz: serial(async token => {
      token = String(token || "").trim();
      if (!/^[a-zA-Z0-9-]{20,128}$/.test(token)) throw new IntegrationError("INVALID_TOKEN", "Enter a ListenBrainz user token.");
      const result = await request("https://api.listenbrainz.org/1/validate-token", { headers: { Authorization: `Token ${token}` } });
      if (result.valid !== true || !result.user_name) throw new IntegrationError("INVALID_TOKEN", "ListenBrainz rejected this token.");
      state.listenbrainz = { token, username: result.user_name }; state.outbox = state.outbox.filter(i => i.service !== "listenbrainz"); await save(); return status();
    }),
    connectDiscord: serial(async () => { await rpc.connect(state.discord.clientId || ""); return status(); }),
    disconnect: serial(async service => {
      if (!["lastfm", "listenbrainz", "spotify", "discord"].includes(service)) throw new Error("Unsupported service");
      state[service] = {}; state.outbox = state.outbox.filter(i => i.service !== service);
      if (service === "lastfm") pendingAuth = null;
      if (service === "discord") rpc.close();
      await save(); return status();
    }),
    async dispose() { await chain; closed = true; rpc.close(); events.removeAllListeners(); }
  };
}

module.exports = { createMusicIntegrations, createSafeStorage, DiscordRPC, IntegrationError, lastFmSignature, rpcFrame, matchTrack };
