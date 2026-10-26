"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { createMusicIntegrations, createSafeStorage, lastFmSignature, DiscordRPC, rpcFrame, matchTrack } = require("../src/main/musicIntegrations");

const response = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => data });
const token = "12345678-1234-1234-1234-123456789abc";
const track = { title: "Song", artist: "Artist", durationSeconds: 60 };
function fixture(fetch, extra = {}) {
  let time = 1700000000000, stored = null;
  const storage = { get: async () => stored, set: async (_key, value) => { stored = value; } };
  return { create: () => createMusicIntegrations({ secretStorage: storage, fetch, now: () => time, ...extra }),
    advance: ms => { time += ms; }, read: () => JSON.parse(stored), storage };
}

test("Last.fm signatures sort UTF-8 parameters and exclude transport fields", () => {
  const params = { token: "abc", method: "auth.getSession", api_key: "key", format: "json", callback: "ignored", api_sig: "ignored" };
  assert.equal(lastFmSignature(params, "secret"), crypto.createHash("md5").update("api_keykeymethodauth.getSessiontokenabcsecret").digest("hex"));
});

test("real Last.fm token URL/session sequence is signed and secrets are redacted", async () => {
  const calls = [];
  const f = fixture(async (url, init) => {
    assert.equal(url, "https://ws.audioscrobbler.com/2.0/");
    const body = Object.fromEntries(new URLSearchParams(init.body)); calls.push(body);
    assert.equal(body.api_sig, lastFmSignature(body, "secret"));
    return response(body.method === "auth.getToken" ? { token: "request-token" } : { session: { key: "session-secret", name: "alice" } });
  });
  const api = await f.create();
  await api.configure("lastfm", { apiKey: "key", apiSecret: "secret" });
  const login = await api.beginLastFmLogin();
  assert.equal(new URL(login.url).searchParams.get("token"), "request-token");
  await api.completeLastFmLogin();
  assert.equal(calls[1].token, "request-token");
  assert.equal(api.status().lastfm.username, "alice");
  assert.equal(f.read().lastfm.sessionKey, "session-secret");
  assert.equal(JSON.stringify(api.status()).includes("secret"), false);
  await assert.rejects(api.completeLastFmLogin(), { code: "AUTH_EXPIRED" });
  await api.dispose();
});

test("Last.fm unauthorized or expired approval never creates a session", async () => {
  const f = fixture(async (_url, init) => response(new URLSearchParams(init.body).get("method") === "auth.getToken" ? { token: "pending" } : { error: 14 }));
  const api = await f.create(); await api.configure("lastfm", { apiKey: "key", apiSecret: "secret" });
  await api.beginLastFmLogin(); await assert.rejects(api.completeLastFmLogin(), { code: "LASTFM_14" });
  assert.equal(api.status().lastfm.connected, false);
  f.advance(3600001); await assert.rejects(api.completeLastFmLogin(), { code: "AUTH_EXPIRED" }); await api.dispose();
});

test("ListenBrainz validates with header and playing_now has no timestamp", async () => {
  const calls = [];
  const f = fixture(async (url, init) => {
    assert.equal(init.headers.Authorization, `Token ${token}`); calls.push({ url, init });
    return response(url.endsWith("validate-token") ? { valid: true, user_name: "bob" } : { status: "ok" });
  });
  const api = await f.create(); await api.connectListenBrainz(token);
  await api.playback({ playId: "1", track, playing: true });
  const body = JSON.parse(calls[1].init.body);
  assert.equal(body.listen_type, "playing_now"); assert.equal("listened_at" in body.payload[0], false);
  assert.equal(body.payload[0].track_metadata.artist_name, "Artist"); await api.dispose();
});

test("ListenBrainz invalid token never persists or connects", async () => {
  const f = fixture(async () => response({ valid: false })); const api = await f.create();
  await assert.rejects(api.connectListenBrainz(token), { code: "INVALID_TOKEN" });
  assert.equal(api.status().listenbrainz.connected, false); assert.equal(f.read(), null); await api.dispose();
});

test("actual elapsed playback excludes pauses, seeks, suspension and deduplicates", async () => {
  const bodies = [];
  const f = fixture(async (url, init) => {
    if (url.endsWith("validate-token")) return response({ valid: true, user_name: "bob" });
    bodies.push(JSON.parse(init.body)); return response({ status: "ok" });
  });
  const api = await f.create(); await api.connectListenBrainz(token);
  const update = (playing, seeking = false) => api.playback({ playId: "1", track, playing, seeking });
  await update(true); f.advance(10000); await update(false); // 10 seconds
  f.advance(60000); await update(true); // paused
  f.advance(10000); await update(true, true); // seek: no credit
  f.advance(1000); await update(true);
  f.advance(60000); await update(true); // suspended: no credit
  assert.equal(bodies.filter(b => b.listen_type === "single").length, 0);
  f.advance(10000); await update(true); f.advance(10000); await update(true);
  f.advance(10000); await update(true);
  assert.equal(bodies.filter(b => b.listen_type === "single").length, 1);
  assert.equal(bodies.find(b => b.listen_type === "single").payload[0].listened_at, 1700000000);
  await api.playback({ track: null }); await api.dispose();
});

test("Last.fm excludes short tracks and honors four-minute threshold", async () => {
  const methods = [];
  const f = fixture(async (_url, init) => {
    const method = new URLSearchParams(init.body).get("method"); methods.push(method);
    return response(method === "auth.getToken" ? { token: "t" } : method === "auth.getSession" ? { session: { key: "s", name: "a" } } : { scrobbles: { "@attr": { accepted: 1 } } });
  });
  const api = await f.create(); await api.configure("lastfm", { apiKey: "k", apiSecret: "s" }); await api.beginLastFmLogin(); await api.completeLastFmLogin();
  await api.playback({ playId: "short", track: { ...track, durationSeconds: 20 }, playing: true });
  f.advance(15000); await api.playback({ playId: "short", track, playing: true });
  assert.equal(methods.includes("track.scrobble"), false);
  const long = { ...track, durationSeconds: 1000 };
  await api.playback({ playId: "long", track: long, playing: true });
  for (let i = 0; i < 16; i++) { f.advance(15000); await api.playback({ playId: "long", track: long, playing: true }); }
  assert.equal(methods.filter(m => m === "track.scrobble").length, 1); await api.dispose();
});

test("failed outbox retries with original timestamp, bounded attempts and disconnect purge", async () => {
  let fail = true; const singles = [];
  const f = fixture(async (url, init) => {
    if (url.endsWith("validate-token")) return response({ valid: true, user_name: "bob" });
    const body = JSON.parse(init.body);
    if (body.listen_type === "single") { singles.push(body); if (fail) return response({}, 503); }
    return response({ status: "ok" });
  });
  const api = await f.create(); await api.connectListenBrainz(token);
  await api.playback({ playId: "1", track, playing: true });
  for (let i = 0; i < 2; i++) { f.advance(15000); await api.playback({ playId: "1", track, playing: true }); }
  assert.equal(api.status().outbox, 1); await api.retryOutbox(); assert.equal(singles.length, 1);
  f.advance(30000); fail = false; await api.retryOutbox(); assert.equal(api.status().outbox, 0);
  assert.deepEqual(singles[0], singles[1]);
  fail = true; await api.playback({ playId: "2", track, playing: true });
  for (let i = 0; i < 2; i++) { f.advance(15000); await api.playback({ playId: "2", track, playing: true }); }
  for (let i = 0; i < 5; i++) { f.advance(3600000); await api.retryOutbox(); }
  assert.equal(api.status().outbox, 0);
  await api.disconnect("listenbrainz"); assert.equal(f.read().listenbrainz.token, undefined); await api.dispose();
});

test("outbox caps at 200 and persists across initialization", async () => {
  const state = { lastfm: {}, listenbrainz: { token, username: "bob" }, spotify: {}, discord: {}, outbox: Array.from({ length: 250 }, () => ({ service: "listenbrainz", timestamp: 1700000000, attempts: 1, nextAt: 1700009999999, track })) };
  const api = await createMusicIntegrations({ secretStorage: { get: async () => JSON.stringify(state), set: async () => {} }, now: () => 1700000000000 });
  assert.equal(api.status().outbox, 200); await api.disconnect("listenbrainz"); assert.equal(api.status().outbox, 0); await api.dispose();
});

test("safeStorage refuses plaintext backend and encrypted file round-trips", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "auralane-integrations-"));
  const filePath = path.join(dir, "secrets.enc");
  try {
    const unavailable = createSafeStorage({ filePath, safeStorage: { isEncryptionAvailable: () => false } });
    await assert.rejects(unavailable.set("k", "secret"), { code: "SECURE_STORAGE_UNAVAILABLE" });
    const basic = createSafeStorage({ filePath, safeStorage: { isEncryptionAvailable: () => true, getSelectedStorageBackend: () => "basic_text" } });
    await assert.rejects(basic.get(), { code: "SECURE_STORAGE_UNAVAILABLE" });
    const key = crypto.randomBytes(32), iv = crypto.randomBytes(16);
    const safe = createSafeStorage({ filePath, safeStorage: { isEncryptionAvailable: () => true,
      encryptString(value) { const c = crypto.createCipheriv("aes-256-cbc", key, iv); return Buffer.concat([c.update(value), c.final()]); },
      decryptString(value) { const c = crypto.createDecipheriv("aes-256-cbc", key, iv); return Buffer.concat([c.update(value), c.final()]).toString(); } } });
    assert.equal(await safe.get(), null); await safe.set("k", "top-secret");
    assert.equal((await fs.readFile(filePath)).includes(Buffer.from("top-secret")), false);
    assert.equal(await safe.get(), "top-secret");
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});

const playlistId = "1234567890123456789012", playlistUrl = `https://open.spotify.com/playlist/${playlistId}`;
const source = { type: "track", name: "Song", artists: [{ name: "Artist" }], duration_ms: 60000 };
const candidate = { videoId: "video", title: "Song (Official Audio)", artist: "Artist", durationSeconds: 60 };
test("matching rejects wrong versions, artist, duration and ambiguity", () => {
  assert.equal(matchTrack(source, [candidate]), candidate);
  for (const altered of [{ ...candidate, title: "Song Live" }, { ...candidate, artist: "Other" }, { ...candidate, durationSeconds: 100 }, { ...candidate, durationSeconds: 0 }]) assert.equal(matchTrack(source, [altered]), null);
  assert.equal(matchTrack(source, [candidate, { ...candidate, videoId: "duplicate" }]), null);
});

test("Spotify official public items endpoint paginates, reports unmatched and progress", async () => {
  const calls = [], progress = [];
  const f = fixture(async (url, init) => {
    calls.push(url);
    if (url.includes("/api/token")) { assert.equal(init.body, "grant_type=client_credentials"); return response({ access_token: "app-token" }); }
    assert.equal(init.headers.Authorization, "Bearer app-token");
    if (url.includes("?fields=")) return response({ public: true, name: "Public" });
    if (!url.includes("offset=")) return response({ items: [{ item: source }], next: `https://api.spotify.com/v1/playlists/${playlistId}/items?offset=1`, total: 2 });
    return response({ items: [{ item: { ...source, name: "Song Live" } }], next: null, total: 2 });
  }, { youtube: { search: async () => ({ tracks: [candidate] }) } });
  const api = await f.create(); await api.configure("spotify", { clientId: "id", clientSecret: "secret" });
  const result = await api.importSpotify(playlistUrl, { onProgress: p => progress.push(p) });
  assert.equal(result.status, "partial"); assert.equal(result.matched.length, 1); assert.equal(result.unmatched.length, 1);
  assert.ok(calls.some(url => url.includes("/items?limit=50&market=TW")));
  assert.equal(progress.at(-1).completed, 2); await api.dispose();
});

test("Spotify 403, private playlists, missing credentials and hostile pagination never succeed", async () => {
  for (const mode of ["blocked", "private", "hostile", "missing"]) {
    const f = fixture(async url => {
      if (url.includes("/api/token")) return response({ access_token: "t" });
      if (mode === "blocked") return response({}, 403);
      if (url.includes("?fields=")) return response({ public: mode !== "private" });
      return response({ items: [], next: "https://evil.example/steal" });
    }, { youtube: { search: async () => [] } });
    const api = await f.create(); if (mode !== "missing") await api.configure("spotify", { clientId: "id", clientSecret: "s" });
    const result = await api.importSpotify(playlistUrl);
    assert.equal(result.status, "unavailable"); assert.deepEqual(result.matched, []); await api.dispose();
  }
});

test("Spotify rejects non-playlist URLs and supports cancellation", async () => {
  const f = fixture(async () => { throw new Error("must not fetch"); }, { youtube: { search: async () => [] } });
  const api = await f.create(); await api.configure("spotify", { clientId: "id", clientSecret: "s" });
  for (const url of ["https://evil.example/playlist/123", "http://open.spotify.com/playlist/123", "spotify:playlist:123"]) await assert.rejects(api.importSpotify(url), { code: "INVALID_PLAYLIST_URL" });
  const controller = new AbortController(); controller.abort();
  assert.equal((await api.importSpotify(playlistUrl, { signal: controller.signal })).status, "cancelled"); await api.dispose();
});

class MockSocket extends EventEmitter {
  constructor() { super(); this.writes = []; this.destroyed = false; queueMicrotask(() => this.emit("connect")); }
  write(buffer) {
    const opcode = buffer.readUInt32LE(0), body = JSON.parse(buffer.subarray(8)); this.writes.push({ opcode, body });
    queueMicrotask(() => {
      if (opcode === 0) {
        const frame = rpcFrame(1, { evt: "READY", data: {} }); this.emit("data", frame.subarray(0, 5)); this.emit("data", frame.subarray(5));
      }
      if (body.cmd === "SET_ACTIVITY") this.emit("data", rpcFrame(1, { cmd: body.cmd, nonce: body.nonce, data: {} }));
    });
  }
  destroy() { this.destroyed = true; queueMicrotask(() => this.emit("close")); }
}
test("Discord performs IPC handshake, fragmented frames, ping/pong and acknowledged activity", async () => {
  let socket, socketPath;
  const rpc = new DiscordRPC({ platform: "win32", connect: args => { socketPath = args.path; return (socket = new MockSocket()); }, timeoutMs: 100 });
  await rpc.connect("123456789012345678"); assert.ok(socketPath.endsWith("discord-ipc-0"));
  assert.deepEqual(socket.writes[0], { opcode: 0, body: { v: 1, client_id: "123456789012345678" } });
  await rpc.setActivity({ type: 2, details: "Song", state: "Artist" });
  assert.equal(socket.writes[1].body.cmd, "SET_ACTIVITY"); assert.equal(socket.writes[1].body.args.pid, process.pid);
  socket.emit("data", rpcFrame(3, { nonce: "ping" })); assert.equal(socket.writes.at(-1).opcode, 4);
  await rpc.setActivity(null); rpc.close(); assert.equal(socket.destroyed, true);
});

test("Discord unavailable and malformed frames fail explicitly", async () => {
  let tries = 0;
  const rpc = new DiscordRPC({ timeoutMs: 20, connect: () => { tries++; const s = new EventEmitter(); s.destroy = () => {}; queueMicrotask(() => s.emit("error", new Error("absent"))); return s; } });
  await assert.rejects(rpc.connect("123456789012345678"), { code: "DISCORD_UNAVAILABLE" }); assert.equal(tries, 10);
  await assert.rejects(rpc.setActivity({}), { code: "DISCORD_UNAVAILABLE" });
  await assert.rejects(rpc.connect("password"), { code: "INVALID_CLIENT_ID" }); rpc.close();
});
