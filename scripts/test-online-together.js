"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const WebSocket = require("ws");
const { createRelay } = require("../server/listen-together/server");
const { createOnlineTogether, serverUrl } = require("../src/main/onlineTogether");
const { validateSnapshot, position } = require("../src/shared/onlineTogetherProtocol");
const { queueTracks } = require("../src/renderer/onlineTogetherTools");
const song = { id: "abcdefghijk", title: "Song", artist: "Artist", duration: 200 };
async function waitFor(predicate, ms = 5000) {
  const end = Date.now() + ms;
  while (!predicate()) { if (Date.now() > end) throw Error("Timed out"); await new Promise(resolve => setTimeout(resolve, 20)); }
}
async function fixture(options) {
  const relay = createRelay(options);
  await new Promise(resolve => relay.server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${relay.server.address().port}`;
  return { relay, url, request: (route, value, token, headers = {}) => fetch(url + route, {
    method: value === undefined ? "GET" : "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    ...(value === undefined ? {} : { body: JSON.stringify(value) }) }) };
}

test("public server URLs require TLS; responses have validated, bounded state", () => {
  assert.equal(serverUrl("https://rooms.example/"), "https://rooms.example");
  for (const url of ["http://rooms.example", "https://user:secret@rooms.example", "https://rooms.example/?token=x", "https://rooms.example/path", "file:///tmp/x"]) assert.throws(() => serverUrl(url));
  assert.throws(() => serverUrl("http://127.0.0.1:1234"));
  assert.equal(serverUrl("http://127.0.0.1:1234", true), "http://127.0.0.1:1234");
  assert.throws(() => validateSnapshot({}));
  assert.equal(position({ queue: [song], playback: { index: 0, playing: true, position: 20, anchoredAt: 1500 } }, 1000), 20);
});
test("member action permissions remain authoritative after leaving and reconnecting", async () => {
  const {relay,url}=await fixture(),host=createOnlineTogether({url,allowLocal:true}),guest=createOnlineTogether({url,allowLocal:true});
  try{
    await host.create('Host');await waitFor(()=>host.status().connected);await host.publish([song]);
    const code=host.status().code;await guest.join('Guest',code);await waitFor(()=>guest.status().connected);
    const permissions={...host.status().state.permissions,add:false};await host.permissions(permissions);
    await waitFor(()=>guest.status().state?.permissions.add===false);
    await assert.rejects(guest.action({action:'add',tracks:[{...song,id:'12345678901'}]}),error=>error.code==='PERMISSION_DENIED');
    await assert.rejects(guest.permissions(permissions),error=>error.code==='HOST_ONLY');
    await guest.leave();await guest.join('Guest',code);await waitFor(()=>guest.status().connected);
    assert.equal(guest.status().state.permissions.add,false);
    await host.permissions({...permissions,add:true});await waitFor(()=>guest.status().state?.permissions.add===true);
    await guest.action({action:'add',tracks:[{...song,id:'12345678901'}]});
    await waitFor(()=>host.status().state.queue.length===2);
  }finally{await guest.dispose();await host.dispose();await relay.close();}
});

test("large personal queues share only upcoming tracks and do not invent missing durations", () => {
  const queue = Array.from({ length: 289 }, (_, index) => ({ id: String(index).padStart(11, "0"), title: `Song ${index}`, artist: "Artist", duration: "" }));
  const result = queueTracks(queue, queue[20], 180);
  assert.equal(result.length, 200);
  assert.equal(result[0].id, queue[20].id);
  assert.equal(result[0].duration, 180);
  assert.equal(result[1].duration, 0);
  assert.equal(queue.length, 289);
  assert.throws(() => queueTracks(queue, { id: "local", localPath: "private" }, 10), error => error.code === "INVALID_QUEUE");
});

test("a room never silently falls back to an unsynchronized embedded player", () => {
  const fs = require("node:fs"), vm = require("node:vm"), path = require("node:path");
  const source = fs.readFileSync(path.join(__dirname, "../src/renderer/app.js"), "utf8");
  const from = source.indexOf("function webFallbackAllowed() {");
  const to = source.indexOf("\nfunction playbackFailureMessage", from);
  for (const active of [true, false]) {
    const state = { auth: { signedIn: true }, settings: { webFallback: true }, onlineTogether: { isActive: () => active } };
    assert.equal(vm.runInNewContext(source.slice(from, to) + "\nwebFallbackAllowed()", { state }), !active);
  }
});

test("cancelling during clock calibration never creates an unwanted room", async () => {
  let release, started, calls = [];
  const beginning = new Promise(resolve => { started = resolve; });
  const client = createOnlineTogether({ url: "https://rooms.example", fetchImpl: async url => {
    calls.push(new URL(url).pathname); started();
    await new Promise(resolve => { release = resolve; });
    return Response.json({ protocol: 1, serverTime: Date.now() });
  } });
  const entering = client.create("Host");
  const rejected = assert.rejects(entering, /CANCELLED/);
  await beginning; await client.leave(); release(); await rejected;
  assert.deepEqual(calls, ["/v1/time"]);
  assert.equal(client.status().enabled, false);
  await client.dispose();
});

test("two independent desktop clients create, join, sync queue/playback, and keep tokens private", async () => {
  const { relay, url } = await fixture();
  const host = createOnlineTogether({ url, allowLocal: true, heartbeatMs: 100 });
  const guest = createOnlineTogether({ url, allowLocal: true, heartbeatMs: 100 });
  try {
    await host.create("Host"); await waitFor(() => host.status().connected);
    await host.publish([song]);
    await guest.join("Guest", host.status().code); await waitFor(() => guest.status().connected);
    await host.playback({ index: 0, playing: true, position: 42 });
    await waitFor(() => guest.status().state?.playback.index === 0);
    assert.equal(guest.status().state.queue[0].title, song.title);
    assert(guest.status().state.targetPosition >= 42 && guest.status().state.targetPosition < 44);
    assert.equal(host.status().state.members.length, 2);
    assert.equal(guest.status().host, false);
    assert(!JSON.stringify(host.status()).includes('"token"'));
    await assert.rejects(guest.playback({ index: 0, playing: false, position: 0 }), /HOST_ONLY/);
    await host.playback({ index: 0, playing: false, position: 55 });
    await waitFor(() => guest.status().state?.playback.position === 55);
    await host.leave(); await waitFor(() => !guest.status().enabled);
  } finally { await host.dispose(); await guest.dispose(); await relay.close(); }
});

test("an interrupted socket rejoins with its existing membership and the latest playback", async () => {
  const { relay, url } = await fixture();
  const sockets = [];
  class ObservedSocket extends WebSocket { constructor(...args) { super(...args); sockets.push(this); } }
  const host = createOnlineTogether({ url, allowLocal: true });
  const guest = createOnlineTogether({ url, allowLocal: true, WebSocketImpl: ObservedSocket });
  try {
    await host.create("Host"); await waitFor(() => host.status().connected);
    await host.publish([song]); await guest.join("Guest", host.status().code);
    await waitFor(() => guest.status().connected);
    const id = guest.status().memberId;
    sockets[0].terminate(); await waitFor(() => !guest.status().connected);
    await host.playback({ index: 0, playing: false, position: 30 });
    await waitFor(() => guest.status().connected && guest.status().state?.playback.position === 30);
    assert.equal(guest.status().memberId, id);
    assert.equal(guest.status().state.members.length, 2);
  } finally { await guest.dispose(); await host.dispose(); await relay.close(); }
});

test("HTTP guards reject uninvited access, browser origins, guest commands, stale state and secret URL parameters", async () => {
  const { relay, request } = await fixture();
  try {
    const created = await (await request("/v1/rooms", { name: "Host" })).json();
    const route = `/v1/rooms/${created.state.code}`;
    assert.equal((await request(route + "/state")).status, 401);
    assert.equal((await request(route + "/state?token=" + created.token)).status, 404);
    assert.equal((await request("/v1/rooms", { name: "Browser" }, null, { Origin: "https://evil.example" })).status, 403);
    const joined = await (await request(route + "/join", { name: "Guest" })).json();
    assert.equal((await request(route + "/command", { type: "queue", tracks: [song], expectedSeq: joined.state.seq }, joined.token)).status, 403);
    assert.equal((await request(route + "/command", { type: "queue", tracks: [song], expectedSeq: 0 }, created.token)).status, 409);
    const invalid = await request(route + "/command", { type: "queue", tracks: [{ ...song, id: "local-path" }], expectedSeq: joined.state.seq }, created.token);
    assert.equal(invalid.status, 400);
    assert.equal((await request(route + "/state", undefined, created.token)).status, 200);
    assert.equal((await request("/v1/rooms", { name: "\u0001" })).status, 400);
  } finally { await relay.close(); }
});

test("room capacity and creation rate are bounded", async () => {
  const { relay, request } = await fixture({ maxRooms: 1 });
  try {
    const created = await (await request("/v1/rooms", { name: "Host" })).json();
    assert.equal((await request("/v1/rooms", { name: "Other" })).status, 503);
    for (let i = 0; i < 7; i++) assert.equal((await request(`/v1/rooms/${created.state.code}/join`, { name: `Guest ${i}` })).status, 200);
    assert.equal((await request(`/v1/rooms/${created.state.code}/join`, { name: "Overflow" })).status, 409);
  } finally { await relay.close(); }
});

test("WebSocket authentication uses headers, never tokens in the URL", async () => {
  const { relay, url, request } = await fixture();
  try {
    const created = await (await request("/v1/rooms", { name: "Host" })).json();
    const ws = new WebSocket(`${url.replace("http:", "ws:")}/v1/rooms/${created.state.code}/events?token=${created.token}`);
    const status = await new Promise(resolve => { ws.on("error", () => {}); ws.on("unexpected-response", (_req, response) => { resolve(response.statusCode); response.resume(); ws.terminate(); }); });
    assert.equal(status, 404);
  } finally { await relay.close(); }
});
