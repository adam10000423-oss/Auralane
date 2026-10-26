"use strict";

const http = require("node:http");
const crypto = require("node:crypto");
const os = require("node:os");
const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");

const LIMITS = Object.freeze({ queue: 200, delta: 50, clients: 16, buffer: 262144, duration: 86400 });
const fail = (message) => { throw new Error(message); };
const integer = (n, max) => Number.isInteger(n) && n >= 0 && n <= max;
function track(value) {
  if (!value || typeof value.id !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(value.id)) fail("Invalid track id");
  if (typeof value.title !== "string" || Buffer.byteLength(value.title) > 300) fail("Invalid track title");
  if (value.artist != null && (typeof value.artist !== "string" || Buffer.byteLength(value.artist) > 300)) fail("Invalid artist");
  if (typeof value.duration !== "number" || !Number.isFinite(value.duration) || value.duration <= 0 || value.duration > LIMITS.duration) fail("Invalid duration (seconds)");
  return { id: value.id, title: value.title, artist: value.artist || "", duration: value.duration };
}
function privateAddress(host) {
  const a = host.split(".").map(Number);
  return a.length === 4 && a.every((n) => integer(n, 255)) && (a[0] === 10 || (a[0] === 172 && a[1] >= 16 && a[1] <= 31) || (a[0] === 192 && a[1] === 168));
}
function localAddresses() {
  return Object.values(os.networkInterfaces()).flat().filter((a) => a.family === "IPv4" && !a.internal && privateAddress(a.address)).map((a) => a.address);
}

// Construction is inert. Only enable() opens a listener; host commands never have HTTP routes.
function createListenTogether() {
  let server = null, token = "", roomId = "", baseUrl = "", seq = 0, queue = [];
  let playback = { index: -1, playing: false, position: 0, anchoredAt: 0 };
  let lifecycle = false;
  const epoch = Date.now() - performance.now();
  const now = () => epoch + performance.now();
  const clients = new Set();
  const listeners = new Set();
  let heartbeat;
  const copy = (v) => JSON.parse(JSON.stringify(v));
  function position(at = now()) {
    return playback.index < 0 ? 0 : Math.min(queue[playback.index].duration, playback.position + (playback.playing ? Math.max(0, at - playback.anchoredAt) / 1000 : 0));
  }
  function state() {
    const serverTime = now();
    return { roomId, seq, serverTime, queue: copy(queue), playback: { ...playback, position: position(serverTime), anchoredAt: serverTime } };
  }
  function send(res, event) {
    if (res.destroyed || res.writableLength > LIMITS.buffer || !res.write(`id: ${event.seq}\ndata: ${JSON.stringify(event)}\n\n`)) {
      clients.delete(res);
      res.destroy();
    }
  }
  function emit(type, delta) {
    const event = { type, roomId, seq: ++seq, serverTime: now(), playback: { ...playback }, ...(delta ? { delta } : {}) };
    for (const res of clients) send(res, event);
    for (const listener of listeners) { try { listener(copy(event)); } catch { /* Observers cannot veto committed state. */ } }
    return state();
  }
  function command(input) {
    if (!server || lifecycle) fail("Room is disabled");
    if (!input || typeof input !== "object") fail("Invalid command");
    if (input.expectedSeq !== seq) fail("Stale sequence; refresh state");
    const at = now();
    if (input.type === "queue") {
      const { index, deleteCount, items } = input;
      if (!integer(index, queue.length) || !integer(deleteCount, queue.length - index) || !Array.isArray(items) || items.length > LIMITS.delta || queue.length - deleteCount + items.length > LIMITS.queue) fail("Invalid queue delta");
      const additions = items.map(track);
      const oldIndex = playback.index;
      const oldPosition = position(at);
      queue.splice(index, deleteCount, ...additions);
      let next = oldIndex;
      if (oldIndex >= index + deleteCount) next += additions.length - deleteCount;
      else if (oldIndex >= index) next = -1;
      playback = { index: next, playing: next >= 0 && playback.playing, position: next >= 0 ? oldPosition : 0, anchoredAt: at };
      return emit("queue", { index, deleteCount, items: additions });
    }
    if (input.type === "select") {
      if (!integer(input.index, queue.length - 1)) fail("Invalid track index");
      playback = { index: input.index, playing: false, position: 0, anchoredAt: at };
    } else if (["play", "pause", "seek"].includes(input.type)) {
      if (playback.index < 0) fail("Select a track first");
      let seconds = position(at);
      if (input.type === "seek") {
        if (typeof input.position !== "number" || !Number.isFinite(input.position) || input.position < 0 || input.position > queue[playback.index].duration) fail("Invalid seek position");
        seconds = input.position;
      }
      playback = { ...playback, position: seconds, anchoredAt: at, playing: input.type === "play" ? true : input.type === "pause" ? false : playback.playing };
    } else fail("Unknown command");
    return emit("playback");
  }
  function authorized(req) {
    const provided = Buffer.from(req.headers.authorization || "");
    const wanted = Buffer.from(`Bearer ${token}`);
    return provided.length === wanted.length && crypto.timingSafeEqual(provided, wanted);
  }
  function handle(req, res) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
    const reply = (status, value) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(value)); };
    if (req.headers.host !== new URL(baseUrl).host || (req.headers.origin && req.headers.origin !== baseUrl)) return reply(403, { error: "Origin rejected" });
    if (req.method !== "GET" || req.url.includes("?") || req.url.includes("#")) return reply(400, { error: "GET without URL credentials required" });
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Listen Together</title><link rel="stylesheet" href="/togetherTools.css"><main id="together"></main><script src="/togetherTools.js" defer></script></html>');
    }
    const assets = { "/togetherTools.js": "text/javascript", "/togetherTools.css": "text/css" };
    if (assets[req.url]) {
      res.writeHead(200, { "Content-Type": `${assets[req.url]}; charset=utf-8` });
      const stream = fs.createReadStream(path.join(__dirname, "../renderer", req.url.slice(1)));
      stream.on("error", () => res.destroy());
      return stream.pipe(res);
    }
    if (!authorized(req)) return reply(401, { error: "Room token required" });
    if (req.url === "/api/state" || req.url === "/api/time") return reply(200, req.url === "/api/time" ? { serverTime: now() } : state());
    if (req.url !== "/api/events") return reply(404, { error: "Not found" });
    if (clients.size >= LIMITS.clients) return reply(503, { error: "Room is full" });
    res.writeHead(200, { "Content-Type": "text/event-stream", "X-Accel-Buffering": "no" });
    res.flushHeaders();
    clients.add(res);
    send(res, { type: "snapshot", ...state() });
    res.on("close", () => clients.delete(res));
  }
  async function enable({ host = "127.0.0.1", port = 0, allowLan = false } = {}) {
    if (server || lifecycle) fail("Room already enabled or changing state");
    if (!integer(port, 65535)) fail("Invalid port");
    if (host !== "127.0.0.1" && (!allowLan || !privateAddress(host) || !localAddresses().includes(host))) fail("LAN requires allowLan and an explicit local private IPv4 address");
    lifecycle = true;
    token = crypto.randomBytes(32).toString("base64url");
    roomId = crypto.randomUUID(); seq = 0; queue = [];
    playback = { index: -1, playing: false, position: 0, anchoredAt: now() };
    const candidate = http.createServer(handle);
    candidate.maxConnections = 64;
    candidate.headersTimeout = 5000; candidate.requestTimeout = 5000; candidate.keepAliveTimeout = 1000;
    try {
      await new Promise((resolve, reject) => {
        candidate.once("error", reject);
        candidate.listen(port, host, () => { candidate.removeListener("error", reject); resolve(); });
      });
      server = candidate;
      baseUrl = `http://${host}:${candidate.address().port}`;
      heartbeat = setInterval(() => {
        if (playback.playing && position() >= queue[playback.index].duration) command({ type: "pause", expectedSeq: seq });
        for (const res of clients) if (!res.write(": heartbeat\n\n") || res.writableLength > LIMITS.buffer) { clients.delete(res); res.destroy(); }
      }, 1000);
      heartbeat.unref();
      return { url: baseUrl, token, roomId };
    } catch (error) { token = ""; roomId = ""; throw error; }
    finally { lifecycle = false; }
  }
  async function disable() {
    if (lifecycle) fail("Room lifecycle operation in progress");
    if (!server) return;
    lifecycle = true;
    clearInterval(heartbeat);
    const closing = server; server = null;
    token = ""; baseUrl = "";
    for (const res of clients) res.destroy();
    clients.clear();
    try { await new Promise((resolve) => { closing.close(resolve); closing.closeAllConnections(); }); }
    finally { queue = []; roomId = ""; lifecycle = false; playback = { index: -1, playing: false, position: 0, anchoredAt: now() }; }
  }
  return {
    enable, disable, command,
    getState: () => { if (!server) fail("Room is disabled"); return state(); },
    status: () => ({ enabled: !!server, url: baseUrl, roomId, clients: clients.size }),
    subscribe: (listener) => { if (typeof listener !== "function") fail("Listener required"); listeners.add(listener); return () => listeners.delete(listener); }
  };
}

module.exports = { createListenTogether, localAddresses, LIMITS };
