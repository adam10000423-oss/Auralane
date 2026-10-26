"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { SourceManager } = require("./sourceManager");
const { createListenTogether, localAddresses } = require("./listenTogether");
const { createOnlineTogether } = require("./onlineTogether");
const { TranslationPack } = require("./translationPack");
const { createMusicIntegrations, createSafeStorage } = require("./musicIntegrations");
const { createSpotifyLibrary } = require("./spotifyLibrary");
const { createSpotifyAccounts } = require("./spotifyAccounts");

const CHANNEL = "features:request";
const EVENT = "features:event";
const fault = (code) => Object.assign(new Error(code), { code });
const object = (v) => v && typeof v === "object" && !Array.isArray(v);
function shape(v, required = [], optional = []) {
  if (!object(v) || required.some(k => !Object.hasOwn(v, k)) || Object.keys(v).some(k => !required.includes(k) && !optional.includes(k))) throw fault("INVALID_REQUEST");
}
function string(v, max = 2048) { if (typeof v !== "string" || !v.trim() || v.length > max) throw fault("INVALID_REQUEST"); return v; }
function integer(v, max = 1000000) { if (!Number.isInteger(v) || v < 0 || v > max) throw fault("INVALID_REQUEST"); return v; }
function boolean(v) { if (typeof v !== "boolean") throw fault("INVALID_REQUEST"); return v; }
function track(v) {
  if (!object(v)) throw fault("INVALID_REQUEST");
  string(v.title, 512);
  if (v.artist !== undefined && typeof v.artist !== "string") throw fault("INVALID_REQUEST");
  return v;
}
async function atomicJSON(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${crypto.randomUUID()}.tmp`;
  try { await fs.writeFile(temp, JSON.stringify(value), { flag: "wx", mode: 0o600 }); await fs.rename(temp, file); }
  finally { await fs.rm(temp, { force: true }); }
}

/** After app.whenReady(). One invocation per application. No room or service is connected at boot.
 * Bridge: featureRequest({type,payload:{...}}) -> {ok:true,value}|{ok:false,error:{code,message}}.
 * onFeatureEvent receives {type,payload}; dispose must be awaited by the parent's shutdown guard.
 * dependencies is an optional test-only factory override; never pass it over IPC.
 */
async function registerFeatures({ ipcMain, mainWindow, youtube, app, safeStorage, getState, setState, localTranslation, dependencies = {} }) {
  if (!ipcMain?.handle || typeof mainWindow !== "function" || !app?.getPath) throw new TypeError("Invalid feature host dependencies");
  const root = app.getPath("userData");
  const translationPack = new TranslationPack({ root, stop: () => localTranslation?.stopAndWait() });
  if (localTranslation) localTranslation.isAvailable = () => !translationPack.removing;
  const configFile = path.join(root, "feature-sources.json");
  const encrypted = createSafeStorage({ filePath: path.join(root, "feature-source-secrets.enc"), safeStorage });
  async function readSecrets() {
    try { await fs.access(path.join(root, "feature-source-secrets.enc")); }
    catch (error) { if (error.code === "ENOENT") return {}; throw error; }
    return JSON.parse(await encrypted.get() || "{}");
  }
  const secrets = {
    async get(id) { const data = await readSecrets(); return Object.hasOwn(data, id) ? data[id] : null; },
    async set(id, value) { const data = await readSecrets(); Object.defineProperty(data, id, { value, enumerable: true, configurable: true, writable: true }); await encrypted.set(null, JSON.stringify(data)); },
    async delete(id) { const data = await readSecrets(); if (Object.hasOwn(data, id)) { delete data[id]; await encrypted.set(null, JSON.stringify(data)); } }
  };
  let config = [], configError = null, disposed = false, integration = null, telemetry = false, importJob = null;
  try {
    const saved = JSON.parse(await fs.readFile(configFile, "utf8"));
    shape(saved, ["version", "sources"]);
    if (saved.version !== 1 || !Array.isArray(saved.sources)) throw fault("SOURCE_CONFIG_INVALID");
    config = saved.sources;
  } catch (e) { if (e.code !== "ENOENT") configError = "SOURCE_CONFIG_INVALID"; }
  const yt = { search(...args) { const service = youtube?.(); if (!service?.search) throw fault("SEARCH_UNAVAILABLE"); return service.search(...args); } };
  const Source = dependencies.SourceManager || SourceManager;
  let sources;
  try { sources = new Source({ sources: config, secureStore: secrets, youtube: yt }); }
  catch { configError = "SOURCE_CONFIG_INVALID"; sources = new Source({ secureStore: secrets, youtube: yt }); }
  const room = (dependencies.createListenTogether || createListenTogether)();
  const onlineConfigFile = path.join(root, "online-together.json");
  let onlineUrl = require("../config/online-together.json").serverUrl || "";
  try { onlineUrl = JSON.parse(await fs.readFile(onlineConfigFile, "utf8")).serverUrl || onlineUrl; }
  catch (error) { if (error.code !== "ENOENT") onlineUrl = ""; }
  let online;
  try { online = createOnlineTogether({ url: onlineUrl }); }
  catch { online = createOnlineTogether(); }
  let roomChain = Promise.resolve(), sourceChain = Promise.resolve();
  function serialRoom(fn) { const next = roomChain.then(fn); roomChain = next.catch(() => {}); return next; }
  function serialSource(fn) { const next = sourceChain.then(fn); sourceChain = next.catch(() => {}); return next; }
  function emit(type, payload) {
    const window = mainWindow();
    if (!disposed && window && !window.isDestroyed?.() && !window.webContents?.isDestroyed?.()) window.webContents.send(EVENT, { type, payload });
  }
  function guard(event) {
    const window = mainWindow(), contents = window?.webContents;
    if (disposed || !contents || window.isDestroyed?.() || contents.isDestroyed?.() || event.sender !== contents || !contents.mainFrame || event.senderFrame !== contents.mainFrame) throw fault("FORBIDDEN");
  }
  async function music() {
    if (!integration) {
      integration = (dependencies.createMusicIntegrations || createMusicIntegrations)({ youtube: yt, electron: { app, safeStorage } });
      integration = await integration.catch(error => { integration = null; throw error; });
    }
    return integration;
  }
  const offRoom = room.subscribe(() => emit("room.state", room.getState()));
  const offOnline = online.subscribe(value => emit("online.state", value));
  const offTranslation = translationPack.subscribe(value => emit("translation.pack", value));
  const saveSources = async () => { await atomicJSON(configFile, { version: 1, sources: sources.exportConfig() }); configError = null; };
  const handlers = Object.create(null);
  const add = (name, required, optional, fn) => { handlers[name] = p => { shape(p, required, optional); return fn(p); }; };
  let spotify = null, spotifyAccount = "";
  function spotifyFor(account) {
    string(account, 256);
    if (!spotify || spotifyAccount !== account) {
      spotify?.dispose(); spotifyAccount = account;
      spotify = createSpotifyAccounts({ account, root, single: true, createLibrary: dependencies.createSpotifyLibrary || createSpotifyLibrary,
        options: { youtube: yt, parent: mainWindow, emit: (type, payload) => emit(type, { ...payload, account }) } });
    }
    return spotify;
  }
  add("spotify.status", ["account"], [], p => spotifyFor(p.account).status());
  add("spotify.login", ["account"], [], p => spotifyFor(p.account).signIn());
  add("spotify.disconnect", ["account"], [], p => spotifyFor(p.account).disconnect());
  add("spotify.page", ["account", "id", "offset"], ["profileId"], p => { string(p.id, 32); integer(p.offset);if(p.profileId!==undefined)string(p.profileId,36);return spotifyFor(p.account).page(p.id, p.offset, p.profileId); });
  add("spotify.match", ["account", "ids"], [], p => spotifyFor(p.account).match(p.ids, value => emit("spotify.progress", { ...value, account: p.account })));
  add("spotify.resolve", ["account", "id"], ["source"], p => spotifyFor(p.account).resolve(string(p.id,22),p.source));
  add("spotify.cancel", ["account"], [], p => { spotifyFor(p.account).cancel(); return null; });
  add("translation.status", [], [], () => translationPack.status());
  add("translation.download", [], [], () => translationPack.start());
  add("translation.cancel", [], [], () => translationPack.cancel());
  add("translation.remove", [], [], () => translationPack.remove());
  add("host.status", [], [], () => ({ sourceConfigError: configError, room: room.status(), playbackEnabled: telemetry }));
  add("sources.list", [], [], () => { if (configError) throw fault(configError); return sources.listSources(); });
  add("sources.upsert", ["config"], [], p => serialSource(async () => { sources.upsertSource(p.config); await saveSources(); return sources.listSources(); }));
  add("sources.remove", ["id"], [], p => serialSource(async () => { await sources.removeSource(string(p.id, 64)); await saveSources(); return sources.listSources(); }));
  add("sources.headers", ["id", "headers"], [], p => serialSource(async () => { await sources.setSourceHeaders(string(p.id, 64), p.headers); return null; }));
  add("sources.health", ["id"], [], p => sources.checkHealth(string(p.id, 64)));
  add("sources.search", ["id", "query"], [], p => sources.search(string(p.id, 64), string(p.query, 500)));
  add("sources.matches", ["track"], [], p => sources.findMatches(track(p.track)));
  add("sources.versions", ["track", "query"], [], p => { if (typeof p.query !== "string" || p.query.length > 500) throw fault("INVALID_REQUEST"); return sources.queryVersions(track(p.track), p.query); });
  add("sources.probe", ["id", "url"], [], p => sources.probeMedia(string(p.id, 64), string(p.url)));
  add("room.status", [], [], () => room.status());
  add("online.status", [], [], () => online.status());
  add("online.configure", ["url"], [], p => serialRoom(async () => {
    if (typeof p.url !== "string" || p.url.length > 2048) throw fault("INVALID_SERVER");
    const previous = online.status().serverUrl;
    const result = online.configure(p.url);
    try { await atomicJSON(onlineConfigFile, { serverUrl: result.serverUrl }); }
    catch (error) { online.configure(previous); throw error; }
    return result;
  }));
  add("online.create", ["name"], ["permissions"], p => serialRoom(async () => { string(p.name, 40); await room.disable(); return online.create(p.name, p.permissions); }));
  add("online.join", ["name", "code"], [], p => serialRoom(async () => { string(p.name, 40); string(p.code, 20); await room.disable(); return online.join(p.name, p.code); }));
  add("online.leave", [], [], () => online.leave());
  add("online.publish", ["tracks"], [], p => online.publish(p.tracks));
  add("online.permissions", ["permissions"], [], p => online.permissions(p.permissions));
  add("online.action", ["action"], ["playing", "position", "direction", "trackId", "beforeId", "tracks", "next"], p => online.action(p));
  add("online.playback", ["index", "playing", "position"], [], p => {
    if (!Number.isInteger(p.index) || p.index < -1 || p.index > 199 || typeof p.playing !== "boolean" || !Number.isFinite(p.position) || p.position < 0 || p.position > 86400) throw fault("INVALID_REQUEST");
    return online.playback(p);
  });
  add("room.addresses", [], [], () => localAddresses());
  add("room.state", [], [], () => room.getState());
  add("room.enable", [], ["host", "port", "allowLan"], p => {
    if (online.status().enabled) throw fault("ALREADY_IN_ROOM");
    if (p.host !== undefined) string(p.host, 64);
    if (p.port !== undefined) integer(p.port, 65535);
    if (p.allowLan !== undefined) boolean(p.allowLan);
    return serialRoom(() => room.enable(p));
  });
  add("room.disable", [], [], () => serialRoom(async () => { await room.disable(); emit("room.disabled", null); return null; }));
  add("room.command", ["command"], [], p => {
    const c = p.command;
    const fields = { queue: ["index", "deleteCount", "items"], select: ["index"], play: [], pause: [], seek: ["position"] };
    if (!object(c) || !Object.hasOwn(fields, c.type)) throw fault("INVALID_REQUEST");
    shape(c, ["type", "expectedSeq", ...fields[c.type]]); integer(c.expectedSeq);
    return serialRoom(() => room.command(c));
  });
  add("room.publish", ["tracks"], [], p => {
    if (!Array.isArray(p.tracks) || p.tracks.length > 200) throw fault("INVALID_REQUEST");
    const tracks = p.tracks.map(t => {
      shape(t, ["id", "title", "artist", "duration"]);
      if (!/^[A-Za-z0-9_-]{1,128}$/.test(t.id) || typeof t.title !== "string" || Buffer.byteLength(t.title) > 300 || typeof t.artist !== "string" || Buffer.byteLength(t.artist) > 300 || !Number.isFinite(t.duration) || t.duration <= 0 || t.duration > 86400) throw fault("INVALID_ROOM_TRACK");
      return { id: t.id, title: t.title, artist: t.artist, duration: t.duration };
    });
    return serialRoom(() => {
      let snapshot = room.getState();
      snapshot = room.command({ type: "queue", index: 0, deleteCount: snapshot.queue.length, items: [], expectedSeq: snapshot.seq });
      for (let i = 0; i < tracks.length; i += 50) snapshot = room.command({ type: "queue", index: i, deleteCount: 0, items: tracks.slice(i, i + 50), expectedSeq: snapshot.seq });
      return snapshot;
    });
  });
  add("integrations.status", [], [], async () => ({ ...(await music()).status(), playbackEnabled: telemetry }));
  add("integrations.configure", ["service", "config"], [], async p => {
    const fields = { lastfm: ["apiKey", "apiSecret"], spotify: ["clientId", "clientSecret"], discord: ["clientId"] };
    if (!Object.hasOwn(fields, p.service)) throw fault("INVALID_REQUEST");
    shape(p.config, fields[p.service]); fields[p.service].forEach(k => string(p.config[k], 512));
    return (await music()).configure(p.service, p.config);
  });
  for (const method of ["beginLastFmLogin", "completeLastFmLogin", "connectDiscord", "retryOutbox"]) add(`integrations.${method}`, [], [], async () => (await music())[method]());
  add("integrations.connectListenBrainz", ["token"], [], async p => (await music()).connectListenBrainz(string(p.token, 128)));
  add("integrations.disconnect", ["service"], [], async p => {
    if (!["lastfm", "listenbrainz", "spotify", "discord"].includes(p.service)) throw fault("INVALID_REQUEST");
    return (await music()).disconnect(p.service);
  });
  add("integrations.enablePlayback", ["enabled"], [], async p => {
    telemetry = boolean(p.enabled);
    if (!telemetry && integration) await (await integration).playback({ track: null });
    return { enabled: telemetry };
  });
  add("integrations.playback", ["playId", "track", "playing", "seeking"], [], async p => {
    string(p.playId, 128); boolean(p.playing); boolean(p.seeking);
    if (p.track !== null) { shape(p.track, ["title", "artist", "durationSeconds"], ["album"]); string(p.track.title, 512); string(p.track.artist, 512); if (!Number.isFinite(p.track.durationSeconds) || p.track.durationSeconds < 0 || p.track.durationSeconds > 86400 || (p.track.album !== undefined && typeof p.track.album !== "string")) throw fault("INVALID_REQUEST"); }
    if (!telemetry) return { enabled: false };
    return (await music()).playback(p);
  });
  add("integrations.import", ["id", "url", "market"], [], async p => {
    string(p.id, 128); string(p.url); if (!/^[A-Z]{2}$/.test(p.market)) throw fault("INVALID_REQUEST");
    if (importJob) throw fault("IMPORT_BUSY");
    const controller = new AbortController(); importJob = { id: p.id, controller };
    try { return await (await music()).importSpotify(p.url, { market: p.market, signal: controller.signal, onProgress: value => emit("integrations.importProgress", { id: p.id, ...value }) }); }
    finally { importJob = null; }
  });
  add("integrations.cancelImport", ["id"], [], p => { string(p.id, 128); if (importJob?.id === p.id) importJob.controller.abort(); return null; });
  add("integrations.openExternal", ["url"], [], async p => {
    const url = new URL(string(p.url));
    if (url.origin !== "https://www.last.fm" || url.pathname !== "/api/auth/" || url.username || url.password || url.hash || [...url.searchParams.keys()].some(k => !["api_key", "token"].includes(k))) throw fault("INVALID_REQUEST");
    await (dependencies.shell || require("electron").shell).openExternal(url.href); return null;
  });
  ipcMain.handle("features:request", async (event, request) => {
    try {
      guard(event); shape(request, ["type"], ["payload"]); string(request.type, 80);
      if (Buffer.byteLength(JSON.stringify(request)) > 262144) throw fault("REQUEST_TOO_LARGE");
      if (!Object.hasOwn(handlers, request.type)) throw fault("UNKNOWN_REQUEST");
      return { ok: true, value: await handlers[request.type](request.payload ?? {}) };
    } catch (error) {
      const code = /^[A-Z][A-Z0-9_]{1,63}$/.test(error.code || "") ? error.code : "FEATURE_FAILED";
      return { ok: false, error: { code, message: code } };
    }
  });
  const lifecycle = [];
  const reset = () => { telemetry = false; importJob?.controller.abort(); void online.leave().catch(() => {}); void serialRoom(() => room.disable()).catch(() => {}); };
  const contents = mainWindow()?.webContents;
  function listen(target, name, fn) { if (target?.on) { target.on(name, fn); lifecycle.push(() => target.removeListener(name, fn)); } }
  listen(contents, "did-start-navigation", (_e, _url, _inPlace, isMainFrame) => { if (isMainFrame) reset(); });
  listen(contents, "render-process-gone", reset); listen(contents, "destroyed", reset);
  // The parent owns async quit prevention; this listener only starts fail-closed cleanup.
  listen(app, "before-quit", reset);
  return {
    requestTypes: Object.freeze(Object.keys(handlers)),
    async dispose() {
      if (disposed) return; disposed = true; telemetry = false;
      ipcMain.removeHandler(CHANNEL); lifecycle.forEach(fn => fn()); offRoom(); offOnline(); offTranslation(); importJob?.controller.abort();
      await translationPack.cancel();
      spotify?.dispose();
      await online.dispose();
      await serialRoom(() => room.disable()); await sourceChain;
      if (integration) await (await integration).dispose();
    }
  };
}

module.exports = { registerFeatures };
