"use strict";
const WebSocket = require("ws");
const { performance } = require("node:perf_hooks");
const { LIMITS, permissions, fault, object, name, roomCode, tracks, position, validateSnapshot } = require("../shared/onlineTogetherProtocol");

function serverUrl(value, allowLocal = false) {
  if (value === "") return "";
  let url; try { url = new URL(value); } catch { throw fault("INVALID_SERVER"); }
  if ((url.protocol !== "https:" && !(allowLocal && url.protocol === "http:" && ["127.0.0.1", "localhost"].includes(url.hostname))) ||
      url.username || url.password || url.search || url.hash || url.pathname !== "/") throw fault("INVALID_SERVER");
  return url.origin;
}
function createOnlineTogether({ url = "", allowLocal = false, fetchImpl = fetch, heartbeatMs = 10000, WebSocketImpl = WebSocket } = {}) {
  let base = serverUrl(url, allowLocal), membership = null, snapshot = null, socket = null, reconnect = null;
  let offset = 0, bestRtt = Infinity, generation = 0, disposed = false, connected = false, pingTimer = null, failures = 0;
  const observers = new Set();
  const epoch = Date.now() - performance.now(), now = () => epoch + performance.now();
  const pingSamples = new Set();
  function status() {
    return { configured: !!base, serverUrl: base, enabled: !!membership, connected, code: snapshot?.code || "", capabilities:["member-permissions"],
      memberId: membership?.memberId || "", host: !!membership?.host,
      state: snapshot ? { ...structuredClone(snapshot), targetPosition: position(snapshot, now() + offset),
        startsIn: Math.max(0, snapshot.playback.anchoredAt - (now() + offset)), clientTime: now() } : null };
  }
  function emit(error) { const value = { ...status(), ...(error ? { error } : {}) }; for (const fn of observers) { try { fn(value); } catch {} } }
  async function request(route, { method = "GET", body, token, signal } = {}) {
    if (!base) throw fault("SERVER_NOT_CONFIGURED");
    const response = await fetchImpl(`${base}${route}`, { method, redirect: "error", cache: "no-store",
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(8000)]) : AbortSignal.timeout(8000),
      headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}) });
    if (Number(response.headers.get("content-length")) > LIMITS.payload) throw fault("INVALID_RESPONSE");
    let size = 0, chunks = [];
    for await (const chunk of response.body) { size += chunk.length; if (size > LIMITS.payload) throw fault("INVALID_RESPONSE"); chunks.push(Buffer.from(chunk)); }
    let value; try { value = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw fault("INVALID_RESPONSE"); }
    if (!response.ok) throw fault(/^[A-Z_]{2,40}$/.test(value?.error || "") ? value.error : "CONNECTION_FAILED", response.status);
    return value;
  }
  function accept(value) {
    const next = validateSnapshot(value);
    if (snapshot && (next.code !== snapshot.code || next.seq < snapshot.seq)) return;
    snapshot = next; emit();
  }
  async function calibrate(signal) {
    const start = now(), value = await request("/v1/time", { signal }), finish = now();
    if (!Number.isFinite(value.serverTime) || value.protocol !== 1) throw fault("INVALID_RESPONSE");
    offset = value.serverTime - (start + finish) / 2; bestRtt = finish - start;
  }
  function disconnect() {
    connected = false; clearTimeout(reconnect); clearInterval(pingTimer); pingTimer = null;
    if (socket) { socket.removeAllListeners(); socket.on("error", () => {}); socket.terminate(); socket = null; }
    pingSamples.clear();
  }
  function connect(version) {
    if (!membership || version !== generation || disposed) return;
    const endpoint = new URL(`/v1/rooms/${snapshot.code}/events`, base);
    endpoint.protocol = endpoint.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocketImpl(endpoint, { headers: { Authorization: `Bearer ${membership.token}` },
      handshakeTimeout: 8000, followRedirects: false, maxPayload: LIMITS.payload, perMessageDeflate: false });
    socket = ws; let lastFrame = now();
    ws.on("open", () => {
      if (version !== generation) return ws.terminate();
      connected = true; failures = 0; emit();
      const ping = () => {
        if (now() - lastFrame > 25000) return ws.terminate();
        const clientTime = now(); pingSamples.add(clientTime);
        while (pingSamples.size > 5) pingSamples.delete(pingSamples.values().next().value);
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "ping", clientTime }));
      };
      ping(); pingTimer = setInterval(ping, heartbeatMs); pingTimer.unref();
    });
    ws.on("message", (data, binary) => {
      if (version !== generation) return;
      try {
        if (binary) throw fault("INVALID_RESPONSE");
        const value = JSON.parse(data.toString()); lastFrame = now();
        if (value.type === "state") accept(value.state);
        else if (value.type === "pong" && pingSamples.has(value.clientTime) && Number.isFinite(value.serverTime)) {
          pingSamples.delete(value.clientTime);
          const rtt = now() - value.clientTime;
          if (rtt >= 0 && (rtt <= bestRtt * 1.1 || bestRtt === Infinity)) { bestRtt = rtt; offset = value.serverTime - (value.clientTime + now()) / 2; }
        } else throw fault("INVALID_RESPONSE");
      } catch { ws.close(1008, "INVALID_RESPONSE"); }
    });
    ws.on("error", () => {});
    ws.on("unexpected-response", (_req, response) => {
      response.resume(); ws.terminate();
      if ([401, 403, 404].includes(response.statusCode)) { membership = null; snapshot = null; ++generation; disconnect(); emit("ROOM_CLOSED"); }
    });
    ws.on("close", code => {
      clearInterval(pingTimer); pingTimer = null;
      if (version !== generation || disposed) return;
      connected = false;
      if ([4001, 4004, 1008].includes(code)) { membership = null; snapshot = null; emit(code === 4001 ? "SESSION_REPLACED" : "ROOM_CLOSED"); return; }
      emit("RECONNECTING");
      reconnect = setTimeout(() => connect(version), Math.min(15000, 500 * 2 ** Math.min(failures++, 5)) + Math.random() * 200);
      reconnect.unref();
    });
  }
  let joining = false, commands = Promise.resolve();
  async function enter(displayName, code, roomPermissions) {
    if (disposed || membership || joining) throw fault("ALREADY_IN_ROOM");
    name(displayName); if (code) roomCode(code);
    joining = true; const version = ++generation;
    try {
      // Free hosting can need a minute to wake. Only the harmless clock request
      // is retried; room creation itself is never retried automatically.
      const deadline = now() + 85000;
      while (true) {
        if (version !== generation || disposed) throw fault("CANCELLED");
        try { await calibrate(); break; }
        catch (error) {
          if (now() >= deadline || error.code === "SERVER_NOT_CONFIGURED" || version !== generation) throw error;
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
      if (version !== generation || disposed) throw fault("CANCELLED");
      const value = await request(code ? `/v1/rooms/${roomCode(code)}/join` : "/v1/rooms", { method: "POST", body: { name: displayName, ...(!code ? { permissions: permissions(roomPermissions) } : {}) } });
      if (!object(value) || !/^[A-Za-z0-9_-]{43}$/.test(value.token) || !/^[a-f0-9]{24}$/.test(value.memberId)) throw fault("INVALID_RESPONSE");
      const next = validateSnapshot(value.state);
      if (version !== generation || disposed) {
        await request(`/v1/rooms/${next.code}/leave`, { method: "POST", token: value.token }).catch(() => {});
        throw fault("CANCELLED");
      }
      membership = { token: value.token, memberId: value.memberId, host: !code }; snapshot = next;
      connect(version); emit(); return status();
    } catch (error) { throw fault(error.code || "CONNECTION_FAILED"); }
    finally { joining = false; }
  }
  async function leave() {
    ++generation; const previous = membership, code = snapshot?.code;
    membership = null; snapshot = null; disconnect(); emit();
    if (previous && code) {
      try { await request(`/v1/rooms/${code}/leave`, { method: "POST", token: previous.token }); }
      catch (error) {
        if (![401,404].includes(error.status)) { emit("CONNECTION_FAILED"); return { ...status(), error:"CONNECTION_FAILED" }; }
      }
    }
    return status();
  }
  function command(input) {
    const version = generation;
    const work = commands.catch(() => {}).then(async () => {
      if (!membership) throw fault("NOT_IN_ROOM");
      if (!membership.host && ["queue", "playback", "permissions"].includes(input.type)) throw fault("HOST_ONLY");
      if (!["queue", "playback"].includes(input.type) && snapshot?.permissionsVersion !== 1) throw fault("SERVER_UPDATE_REQUIRED");
      if (!connected || version !== generation) throw fault("RECONNECTING");
      const token = membership.token, code = snapshot.code;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const value = await request(`/v1/rooms/${code}/command`, { method: "POST", token,
            body: { ...input, expectedSeq: snapshot.seq } });
          if (version !== generation) throw fault("CANCELLED");
          accept(value); return status();
        } catch (error) {
          if (error.code !== "STALE_STATE" || attempt) throw fault(error.code || "CONNECTION_FAILED");
          const value = await request(`/v1/rooms/${code}/state`, { token });
          if (version !== generation) throw fault("CANCELLED"); accept(value);
          if (["queue", "playback"].includes(input.type)) throw fault("STALE_STATE", 409);
        }
      }
    });
    commands = work.catch(() => {}); return work;
  }
  return { status, create: (displayName, roomPermissions) => enter(displayName, undefined, roomPermissions), join: (displayName, code) => enter(displayName, code), leave,
    permissions: value => command({ type: "permissions", permissions: permissions(value) }),
    action: value => {
      if (!object(value) || !["playPause", "skip", "select", "seek", "add", "reorder", "remove"].includes(value.action)) throw fault("INVALID_COMMAND");
      const { action, ...payload } = value;
      if (Object.hasOwn(payload, "type") || Object.hasOwn(payload, "expectedSeq")) throw fault("INVALID_COMMAND");
      return command({ ...payload, type: action });
    },
    publish: value => command({ type: "queue", tracks: tracks(value) }),
    playback: value => {
      const duration = value.index >= 0 ? snapshot?.queue[value.index]?.duration || 86400 : 0;
      const lead = value.playing ? 0.35 + Math.min(bestRtt / 2, 500) / 1000 : 0;
      return command({ type: "playback", ...value, position: Math.min(duration, value.position + lead) });
    },
    configure(value) { if (membership || joining) throw fault("ALREADY_IN_ROOM"); base = serverUrl(value, allowLocal); emit(); return status(); },
    subscribe(fn) { observers.add(fn); return () => observers.delete(fn); },
    async dispose() { disposed = true; await leave(); observers.clear(); } };
}
module.exports = { createOnlineTogether, serverUrl };
