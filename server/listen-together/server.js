"use strict";
const http = require("node:http");
const crypto = require("node:crypto");
const { performance } = require("node:perf_hooks");
const { WebSocketServer, WebSocket } = require("ws");
const { LIMITS, PERMISSIONS, permissions, fault, object, tracks, roomCode, name, position } = require("../../src/shared/onlineTogetherProtocol");

function createRelay(options = {}) {
  const rooms = new Map(), rates = new Map();
  const epoch = Date.now() - performance.now();
  const now = options.now || (() => epoch + performance.now());
  const maxRooms = options.maxRooms || LIMITS.rooms;
  const hash = token => crypto.createHash("sha256").update(token).digest("hex");
  const wss = new WebSocketServer({ noServer: true, maxPayload: 4096, perMessageDeflate: false });
  let closing = false;
  function rate(key, limit, windowMs = 60000) {
    const at = now(); let entry = rates.get(key);
    if (!entry || entry.until <= at) {
      if (!entry && rates.size >= 10000) throw fault("SERVER_BUSY", 503);
      rates.set(key, entry = { count: 0, until: at + windowMs });
    }
    if (++entry.count > limit) throw fault("RATE_LIMITED", 429);
  }
  function snapshot(room) {
    return { protocol: 1, code: room.code, seq: room.seq, serverTime: now(), queue: room.queue,
      permissionsVersion: 1, permissions: { ...room.permissions }, actorId: room.actorId || "",
      playback: { ...room.playback }, members: [...room.members.values()].map(m => ({ id: m.id, name: m.name, host: m.host })) };
  }
  function send(socket, value) {
    if (socket.readyState !== WebSocket.OPEN) return;
    if (socket.bufferedAmount > LIMITS.payload * 2) return socket.terminate();
    socket.send(JSON.stringify(value));
  }
  function broadcast(room, changed = true) {
    if (changed) room.seq++;
    const event = { type: "state", state: snapshot(room) };
    for (const member of room.members.values()) if (member.socket) send(member.socket, event);
  }
  function closeRoom(room) {
    rooms.delete(room.code);
    for (const m of room.members.values()) if (m.socket) m.socket.close(4004, "ROOM_CLOSED");
  }
  function authorize(req, code) {
    const room = rooms.get(code); if (!room) throw fault("ROOM_NOT_FOUND", 404);
    const header = req.headers.authorization || "";
    if (!/^Bearer [A-Za-z0-9_-]{43}$/.test(header)) throw fault("UNAUTHORIZED", 401);
    const member = room.members.get(hash(header.slice(7)));
    if (!member) throw fault("UNAUTHORIZED", 401);
    return { room, member };
  }
  function addMember(room, displayName, host) {
    if (room.members.size >= LIMITS.members) throw fault("ROOM_FULL", 409);
    const token = crypto.randomBytes(32).toString("base64url");
    const member = { id: crypto.randomBytes(12).toString("hex"), name: name(displayName), host, socket: null, lastSeen: now() };
    room.members.set(hash(token), member); broadcast(room);
    return { protocol: 1, token, memberId: member.id, state: snapshot(room) };
  }
  async function body(req) {
    if (!/^application\/json(?:;|$)/i.test(req.headers["content-type"] || "")) throw fault("JSON_REQUIRED", 415);
    let size = 0, chunks = [];
    for await (const chunk of req) {
      size += chunk.length; if (size > LIMITS.payload) throw fault("PAYLOAD_TOO_LARGE", 413);
      chunks.push(chunk);
    }
    let value; try { value = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw fault("INVALID_JSON"); }
    if (!object(value)) throw fault("INVALID_REQUEST");
    return value;
  }
  function origin(req) {
    // Desktop clients connect from the main process and send no browser Origin.
    if (req.headers.origin) throw fault("ORIGIN_REJECTED", 403);
    if (options.publicOrigin && req.headers.host !== new URL(options.publicOrigin).host) throw fault("ORIGIN_REJECTED", 403);
  }
  function ip(req) {
    return options.trustProxy ? String(req.headers["x-forwarded-for"] || req.socket.remoteAddress).split(",").at(-1).trim().slice(0, 100)
      : req.socket.remoteAddress || "unknown";
  }
  function commit(room, input, member) {
    if (!member.host && !["playPause", "skip", "select", "seek", "add", "reorder", "remove"].includes(input.type)) throw fault("HOST_ONLY", 403);
    const permission = input.type === "select" ? "skip" : input.type;
    if (!member.host && room.permissions[permission] !== true) throw fault("PERMISSION_DENIED", 403);
    if (input.expectedSeq !== room.seq) throw fault("STALE_STATE", 409);
    const at = now(), current = room.queue[room.playback.index]?.id, seconds = position(snapshot(room), at);
    function preserveQueue(next) {
      const index = next.findIndex(track => track.id === current);
      room.queue = tracks(next);
      room.playback = { index, playing: index >= 0 && room.playback.playing,
        position: index >= 0 ? Math.min(next[index].duration || 86400, seconds) : 0, anchoredAt: at };
    }
    if (input.type === "permissions") {
      room.permissions = permissions(input.permissions);
    } else if (input.type === "add") {
      const incoming = tracks(input.tracks);
      if (input.next !== undefined && typeof input.next !== "boolean") throw fault("INVALID_COMMAND");
      if (input.next && !member.host && !room.permissions.reorder) throw fault("PERMISSION_DENIED", 403);
      if (input.next && incoming.some(track => room.queue.some(existing => existing.id === track.id))) throw fault("INVALID_QUEUE");
      const additions = incoming.filter(track => !room.queue.some(existing => existing.id === track.id));
      const next = [...room.queue]; next.splice(input.next ? Math.max(0, room.playback.index + 1) : next.length, 0, ...additions);
      preserveQueue(next);
    } else if (input.type === "reorder" || input.type === "remove") {
      const index = room.queue.findIndex(track => track.id === input.trackId);
      if (index < 0) throw fault("TRACK_NOT_FOUND", 409);
      if (input.type === "remove") {
        if (!member.host && (room.queue.length <= 1 || input.trackId === current)) throw fault("HOST_ONLY", 403);
        preserveQueue(room.queue.filter((_, i) => i !== index));
      } else {
        const next = room.queue.filter((_, i) => i !== index);
        const target = input.beforeId === null ? next.length : next.findIndex(track => track.id === input.beforeId);
        if (target < 0) throw fault("TRACK_NOT_FOUND", 409);
        next.splice(target, 0, room.queue[index]); preserveQueue(next);
      }
    } else if (input.type === "playPause" || input.type === "seek" || input.type === "skip" || input.type === "select") {
      let index = room.playback.index, playing = room.playback.playing, target = seconds;
      if (input.type === "playPause") {
        if (typeof input.playing !== "boolean") throw fault("INVALID_PLAYBACK");
        playing = input.playing;
      } else if (input.type === "seek") {
        if (!Number.isFinite(input.position) || input.position < 0 || input.position > (room.queue[index]?.duration || 86400)) throw fault("INVALID_PLAYBACK");
        target = input.position;
      } else {
        if (input.type === "skip") {
          if (input.direction !== 1 && input.direction !== -1) throw fault("INVALID_PLAYBACK");
          index += input.direction;
        } else index = room.queue.findIndex(track => track.id === input.trackId);
        playing = true; target = 0;
      }
      if (index < 0 || index >= room.queue.length) throw fault("TRACK_NOT_FOUND", 409);
      room.playback = { index, playing, position: target, anchoredAt: at + (playing ? 350 : 0) };
    } else if (input.type === "queue") {
      const next = tracks(input.tracks), id = room.queue[room.playback.index]?.id;
      const index = next.findIndex(t => t.id === id), at = now(), seconds = position(snapshot(room), at);
      room.queue = next;
      room.playback = { index, playing: index >= 0 && room.playback.playing,
        position: index >= 0 ? Math.min(next[index].duration || 86400, seconds) : 0, anchoredAt: at };
    } else if (input.type === "playback") {
      const { index, playing, position: seconds } = input;
      if (!Number.isInteger(index) || index < -1 || index >= room.queue.length || typeof playing !== "boolean" ||
          !Number.isFinite(seconds) || seconds < 0 || seconds > (index >= 0 ? room.queue[index].duration || 86400 : 0) || (index < 0 && playing)) throw fault("INVALID_PLAYBACK");
      room.playback = { index, playing, position: seconds, anchoredAt: now() + (playing ? 350 : 0) };
    } else throw fault("INVALID_COMMAND");
    room.actorId = member.id;
    broadcast(room);
    return snapshot(room);
  }
  const server = http.createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store"); res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
    const reply = (status, data) => { if (!res.destroyed) { res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" }); res.end(JSON.stringify(data)); } };
    try {
      if (closing) throw fault("SERVER_BUSY", 503);
      origin(req);
      if (req.url === "/health" && req.method === "GET") return reply(200, { ok: true, protocol: 1, features: ["unknown-duration"] });
      rate(`all:${ip(req)}`, 180);
      if (req.url === "/v1/time" && req.method === "GET") return reply(200, { protocol: 1, serverTime: now() });
      if (req.url === "/v1/rooms" && req.method === "POST") {
        rate(`create:${ip(req)}`, 5, 600000);
        const input = await body(req); name(input.name);
        if (rooms.size >= maxRooms) throw fault("SERVER_BUSY", 503);
        let code;
        do { code = Array.from(crypto.randomBytes(6), b => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join(""); } while (rooms.has(code));
        // Old hosts do not apply member-authored state. Keep their rooms
        // read-only until a permissions-aware client explicitly opts in.
        const roomPermissions = input.permissions === undefined ? Object.fromEntries(Object.keys(PERMISSIONS).map(key => [key, false])) : permissions(input.permissions);
        const room = { code, seq: 0, createdAt: now(), members: new Map(), queue: [], permissions: roomPermissions, playback: { index: -1, position: 0, playing: false, anchoredAt: now() } };
        rooms.set(code, room);
        return reply(201, addMember(room, input.name, true));
      }
      const match = /^\/v1\/rooms\/([A-Z2-9]{6})\/(join|state|command|leave)$/.exec(req.url || "");
      if (!match) throw fault("NOT_FOUND", 404);
      const code = roomCode(match[1]), action = match[2];
      if (action === "join" && req.method === "POST") {
        rate(`join:${ip(req)}`, 20);
        const input = await body(req), displayName = name(input.name), room = rooms.get(code);
        if (!room) throw fault("ROOM_NOT_FOUND", 404);
        return reply(200, addMember(room, displayName, false));
      }
      const { room, member } = authorize(req, code); member.lastSeen = now();
      if (action === "state" && req.method === "GET") return reply(200, snapshot(room));
      if (action === "leave" && req.method === "POST") {
        if (member.host) closeRoom(room);
        else { room.members.delete(hash(req.headers.authorization.slice(7))); member.socket?.close(1000); broadcast(room); }
        return reply(200, { ok: true });
      }
      if (action === "command" && req.method === "POST") {
        rate(`command:${member.id}`, 120);
        return reply(200, commit(room, await body(req), member));
      }
      throw fault("NOT_FOUND", 404);
    } catch (error) { reply(error.status || 500, { error: error.code || "SERVER_ERROR" }); }
  });
  server.maxConnections = 512; server.requestTimeout = 10000; server.headersTimeout = 10000;
  server.on("upgrade", (req, socket, head) => {
    socket.on("error", () => {});
    try {
      origin(req); rate(`socket:${ip(req)}`, 20);
      const match = /^\/v1\/rooms\/([A-Z2-9]{6})\/events$/.exec(req.url || "");
      if (!match || closing) throw fault("NOT_FOUND", 404);
      const { room, member } = authorize(req, roomCode(match[1]));
      wss.handleUpgrade(req, socket, head, ws => {
        member.socket?.close(4001, "REPLACED"); member.socket = ws; member.lastSeen = now(); ws.alive = true;
        ws.on("error", () => {});
        ws.on("pong", () => { ws.alive = true; member.lastSeen = now(); });
        ws.on("close", () => { if (member.socket === ws) { member.socket = null; member.lastSeen = now(); } });
        ws.on("message", (raw, binary) => {
          try {
            rate(`message:${member.id}`, 60);
            if (binary) throw fault("INVALID_MESSAGE");
            const value = JSON.parse(raw.toString());
            if (value.type !== "ping" || !Number.isFinite(value.clientTime)) throw fault("INVALID_MESSAGE");
            send(ws, { type: "pong", clientTime: value.clientTime, serverTime: now() });
          } catch { ws.close(1008, "INVALID_MESSAGE"); }
        });
        send(ws, { type: "state", state: snapshot(room) });
      });
    } catch (error) { socket.end(`HTTP/1.1 ${error.status || 400} Rejected\r\nConnection: close\r\n\r\n`); }
  });
  const heartbeat = setInterval(() => {
    const at = now();
    for (const [key, value] of rates) if (value.until < at) rates.delete(key);
    for (const room of rooms.values()) {
      const host = [...room.members.values()].find(m => m.host);
      if (at - room.createdAt > 43200000 || !host || (!host.socket && at - host.lastSeen > 60000)) { closeRoom(room); continue; }
      for (const [key, member] of room.members) {
        if (!member.host && !member.socket && at - member.lastSeen > 60000) { room.members.delete(key); room.seq++; }
        const socket = member.socket;
        if (socket) { if (!socket.alive) socket.terminate(); else { socket.alive = false; socket.ping(); } }
      }
      broadcast(room, false);
    }
  }, options.heartbeatMs || 5000);
  heartbeat.unref();
  return { server, async close() {
    closing = true; clearInterval(heartbeat);
    for (const room of rooms.values()) closeRoom(room);
    for (const socket of wss.clients) socket.terminate();
    await new Promise(resolve => wss.close(resolve));
    await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
  } };
}
if (require.main === module) {
  const relay = createRelay({ trustProxy: process.env.TRUST_PROXY === "1", publicOrigin: process.env.PUBLIC_ORIGIN || undefined });
  relay.server.listen(Number(process.env.PORT || 8080), "0.0.0.0", () => console.log("Auralane room relay listening"));
  for (const signal of ["SIGTERM", "SIGINT"]) process.once(signal, () => { void relay.close().then(() => process.exit(0)); });
}
module.exports = { createRelay };
