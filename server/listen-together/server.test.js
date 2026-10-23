"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const WebSocket = require("ws");
const { createRelay } = require("./server");
const { validateSnapshot } = require("../../src/shared/onlineTogetherProtocol");

async function fixture(options) {
  const relay = createRelay(options);
  await new Promise(resolve => relay.server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${relay.server.address().port}`;
  return { relay, origin, request: (route, body, token, headers = {}) => fetch(origin + route, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json", ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }) }) };
}
const song = { id: "abcdefghijk", title: "Song", artist: "Artist", duration: 180 };

test("health and independently authenticated host/guest playback synchronization", async () => {
  const { relay, origin, request } = await fixture();
  let socket;
  try {
    assert.deepEqual(await (await request("/health")).json(), { ok: true, protocol: 1 });
    const host = await (await request("/v1/rooms", { name: "Host" })).json();
    const path = `/v1/rooms/${host.state.code}`;
    const guest = await (await request(path + "/join", { name: "Guest" })).json();
    assert.notEqual(host.token, guest.token);
    socket = new WebSocket(origin.replace("http:", "ws:") + path + "/events", { headers: { Authorization: `Bearer ${guest.token}` } });
    const messages = [];
    socket.on("message", raw => messages.push(JSON.parse(raw.toString())));
    await new Promise((resolve, reject) => { socket.once("open", resolve); socket.once("error", reject); });
    const queue = await (await request(path + "/command", { type: "queue", tracks: [song], expectedSeq: guest.state.seq }, host.token)).json();
    const playing = await (await request(path + "/command", { type: "playback", index: 0, playing: true, position: 42, expectedSeq: queue.seq }, host.token)).json();
    validateSnapshot(playing);
    const end = Date.now() + 2000;
    while (!messages.some(m => m.state?.playback.playing)) { assert(Date.now() < end, "Guest did not receive playback"); await new Promise(resolve => setTimeout(resolve, 10)); }
    assert(messages.some(m => m.state?.queue[0]?.id === song.id));
    assert(!JSON.stringify(messages).includes(host.token));
    assert(!JSON.stringify(messages).includes(guest.token));
    assert.equal((await request(path + "/command", { type: "queue", tracks: [], expectedSeq: playing.seq }, guest.token)).status, 403);
    await request(path + "/leave", {}, host.token);
    assert.equal((await request(path + "/state", undefined, guest.token)).status, 404);
  } finally { socket?.terminate(); await relay.close(); }
});

test("rejects browser origins, missing authentication, stale writes and invalid media IDs", async () => {
  const { relay, request } = await fixture();
  try {
    assert.equal((await request("/v1/rooms", { name: "Browser" }, null, { Origin: "https://evil.example" })).status, 403);
    const host = await (await request("/v1/rooms", { name: "Host" })).json();
    const path = `/v1/rooms/${host.state.code}`;
    assert.equal((await request(path + "/state")).status, 401);
    assert.equal((await request(path + "/state?token=" + host.token)).status, 404);
    assert.equal((await request(path + "/command", { type: "queue", tracks: [], expectedSeq: 0 }, host.token)).status, 409);
    assert.equal((await request(path + "/command", { type: "queue", tracks: [{ ...song, id: "file:///private" }], expectedSeq: host.state.seq }, host.token)).status, 400);
  } finally { await relay.close(); }
});

test("room and member capacity are bounded", async () => {
  const { relay, request } = await fixture({ maxRooms: 1 });
  try {
    const host = await (await request("/v1/rooms", { name: "Host" })).json();
    assert.equal((await request("/v1/rooms", { name: "Another" })).status, 503);
    for (let i = 0; i < 7; i++) assert.equal((await request(`/v1/rooms/${host.state.code}/join`, { name: `Guest ${i}` })).status, 200);
    assert.equal((await request(`/v1/rooms/${host.state.code}/join`, { name: "Full" })).status, 409);
  } finally { await relay.close(); }
});
