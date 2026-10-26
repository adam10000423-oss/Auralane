"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { SourceManager, matchTrack, validateConfig, mediaInfo } = require("../src/main/sourceManager");

const config = { id: "catalog", name: "Catalog", searchUrl: "https://catalog.example/search", healthUrl: "https://catalog.example/health" };
const track = { id: "1", title: "Song", artist: "Artist", durationSeconds: 200 };
const json = (body, options = {}) => new Response(JSON.stringify(body), { headers: { "content-type": "application/json" }, ...options });
const manager = (fetchImpl, extra = {}) => new SourceManager({ sources: [config], fetchImpl, ...extra });

test("no default providers or assumed lossless hosts", () => {
  assert.deepEqual(new SourceManager().exportConfig(), []);
  assert.deepEqual(new SourceManager().diagnostics(), []);
});
test("declarative source validation rejects executable fields, unsafe URLs and inline credentials", () => {
  for (const searchUrl of ["http://catalog.example/search", "file:///tmp/x", "https://user:pass@catalog.example/", "https://catalog.example/search?token=secret", "https://127.0.0.1/", "https://10.0.0.1/", "https://[::1]/", "https://[::ffff:127.0.0.1]/", "https://host.local/", "https://catalog.example:444/"]) {
    assert.throws(() => validateConfig({ ...config, searchUrl }));
  }
  for (const field of ["script", "headers", "transform", "quality"]) assert.throws(() => validateConfig({ ...config, [field]: "secret" }));
  assert.throws(() => validateConfig({ ...config, healthUrl: "https://elsewhere.example/health" }));
  assert.throws(() => validateConfig({ ...config, mediaOrigins: ["https://catalog.example/path"] }));
  assert.throws(() => new SourceManager({ sources: [config, config] }));
});
test("source CRUD returns detached snapshots and clears health on edits", async () => {
  const m = manager(async () => json({ ok: true }));
  assert.equal(m.getHealth("catalog").state, "unknown");
  assert.equal((await m.checkHealth("catalog")).state, "healthy");
  const listing = m.listSources(); listing[0].mediaOrigins.push("https://evil.example");
  assert.equal(m.exportConfig()[0].mediaOrigins.length, 1);
  m.upsertSource({ ...config, enabled: false });
  assert.equal((await m.checkHealth("catalog")).state, "disabled");
  await m.removeSource("catalog"); assert.deepEqual(m.listSources(), []);
});
test("search uses encoded q and whitelists bounded metadata, not claimed quality", async () => {
  let requested;
  const m = manager(async (url) => {
    requested = new URL(url);
    return json({ tracks: [{ ...track, url: "https://catalog.example/audio?id=1", codec: "flac", quality: "lossless", headers: { Authorization: "secret" } }, track] });
  });
  const results = await m.search("catalog", "Song & Artist");
  assert.equal(requested.searchParams.get("q"), "Song & Artist");
  assert.equal(results.length, 1); assert.equal(results[0].media, null);
  assert.equal(results[0].codec, undefined); assert.equal(results[0].headers, undefined);
  assert.equal(m.getHealth("catalog").state, "healthy");
});
test("unsafe and unapproved media never become playable", async () => {
  const m = manager(async () => json({ tracks: ["http://catalog.example/a", "https://other.example/a", "https://127.0.0.1/a"].map((url, i) => ({ ...track, id: String(i), url })) }));
  assert.ok((await m.search("catalog", "Song")).every((t) => t.url === null));
  await assert.rejects(m.probeMedia("catalog", "https://other.example/a"), /not allowed/);
});
test("request rejects redirects, error statuses, non-JSON, malformed JSON and excessive results", async () => {
  const cases = [
    [() => new Response("", { status: 302, headers: { location: "https://elsewhere.example/" } }), "HTTP"],
    [() => new Response("", { status: 401 }), "HTTP"],
    [() => new Response("{}", { headers: { "content-type": "text/html" } }), "CONTENT_TYPE"],
    [() => new Response("{", { headers: { "content-type": "application/json" } }), "INVALID_JSON"],
    [() => json({ tracks: Array(101).fill(track) }), "INVALID_RESULTS"],
    [() => json({ items: [] }), "INVALID_RESULTS"]
  ];
  for (const [response, code] of cases) {
    const m = manager(async () => response());
    await assert.rejects(m.search("catalog", "Song"), { code });
    assert.equal(m.getHealth("catalog").error, code);
  }
});
test("both declared and chunked bodies are byte bounded", async () => {
  for (const declared of [false, true]) {
    const m = manager(async () => new Response("x".repeat(101), { headers: { "content-type": "application/json", ...(declared ? { "content-length": "101" } : {}) } }), { maxBytes: 100 });
    await assert.rejects(m.search("catalog", "Song"), { code: "TOO_LARGE" });
  }
});
test("whole request deadline covers hanging fetch, secret store and response body", async () => {
  const hanging = new Promise(() => {});
  const variants = [
    manager(() => hanging, { timeoutMs: 15 }),
    manager(async () => json({ tracks: [] }), { timeoutMs: 15, secureStore: { get: () => hanging } }),
    manager(async () => new Response(new ReadableStream({ start() {} }), { headers: { "content-type": "application/json" } }), { timeoutMs: 15 })
  ];
  for (const m of variants) await assert.rejects(m.search("catalog", "Song"), { code: "TIMEOUT" });
});
test("concurrent request count is bounded", async () => {
  const m = manager(() => new Promise(() => {}), { timeoutMs: 20 });
  const requests = Array.from({ length: 4 }, () => m.search("catalog", "Song").catch((e) => e.code));
  await assert.rejects(m.search("catalog", "Song"), { code: "NETWORK" });
  assert.deepEqual(await Promise.all(requests), Array(4).fill("TIMEOUT"));
});
test("secure headers are stored separately, used only same-origin, never exported", async () => {
  const values = new Map(); const calls = [];
  const secureStore = { get: async (id) => values.get(id), set: async (id, value) => values.set(id, value), delete: async (id) => values.delete(id) };
  const m = manager(async (_url, options) => {
    calls.push(options); return options.method === "HEAD" ? new Response(null, { headers: { "content-type": "audio/flac" } }) : json({ tracks: [] });
  }, { secureStore });
  m.upsertSource({ ...config, mediaOrigins: ["https://cdn.example", "https://catalog.example"] });
  await m.setSourceHeaders("catalog", { Authorization: "Bearer super-secret" });
  await m.search("catalog", "Song");
  assert.equal(calls[0].headers.authorization, "Bearer super-secret");
  assert.equal(calls[0].redirect, "error");
  await m.probeMedia("catalog", "https://cdn.example/file");
  assert.equal(calls[1].headers.authorization, undefined);
  assert.doesNotMatch(JSON.stringify([m.exportConfig(), m.listSources(), m.diagnostics()]), /super-secret|Authorization/i);
  for (const headers of [{ Host: "evil" }, { Cookie: "secret" }, { "X-Key": "secret\r\ninjected" }, { "Accept-Encoding": "gzip" }]) {
    await assert.rejects(m.setSourceHeaders("catalog", headers));
  }
  await m.removeSource("catalog"); assert.equal(values.size, 0);
});
test("no plaintext fallback when secure storage is missing", async () => {
  await assert.rejects(manager(async () => json({})).setSourceHeaders("catalog", { Authorization: "secret" }), { code: "SECRET_STORE" });
});
test("diagnostics omit query, endpoints, credentials and raw transport errors", async () => {
  const m = manager(async () => { throw new Error("https://secret.example/?token=secret Authorization: password"); });
  await assert.rejects(m.search("catalog", "private query"), { message: "NETWORK" });
  const diagnostics = JSON.stringify(m.diagnostics());
  assert.doesNotMatch(diagnostics, /https|secret|password|private|Catalog/);
});
test("strict title, artist, duration, version and explicitness matching", () => {
  assert.equal(matchTrack(track, { ...track, title: "Song (Official Audio)", duration: "3:20", durationSeconds: null }).matches, true);
  assert.equal(matchTrack(track, { ...track, durationSeconds: 203 }).matches, true);
  for (const change of [
    { title: "Another Song" }, { artist: "Artist Tribute" }, { artist: "Other Artist" },
    { durationSeconds: 204 }, { durationSeconds: null }, { title: "Song (Live)" },
    { title: "Song - Remix" }, { title: "Song (Remastered 2025)" }, { title: "Song (Acoustic)" },
    { title: "Song (Sped Up)" }, { version: "instrumental" }, { explicit: false }, { explicit: true }
  ]) assert.equal(matchTrack(track, { ...track, ...change }).matches, false, JSON.stringify(change));
  assert.equal(matchTrack({ ...track, title: "Song (Live in Paris)" }, { ...track, title: "Song (Live in London)" }).matches, false);
  assert.equal(matchTrack({ ...track, explicit: false }, { ...track, explicit: true }).matches, false);
});
test("artist sets must match completely, independent of order", () => {
  const expected = { ...track, artists: [{ title: "Artist" }, { title: "Guest" }] };
  assert.equal(matchTrack(expected, { ...track, artists: ["Guest", "Artist"] }).matches, true);
  assert.equal(matchTrack(expected, track).matches, false);
});
test("findMatches filters mismatches and isolates failed/disabled sources", async () => {
  const m = manager(async (url) => {
    if (url.includes("broken")) throw Error("private");
    return json({ tracks: [track, { ...track, id: "2", title: "Song (Live)" }] });
  });
  m.upsertSource({ ...config, id: "broken", searchUrl: "https://broken.example/search", healthUrl: null });
  m.upsertSource({ ...config, id: "off", enabled: false });
  const result = await m.findMatches(track);
  assert.equal(result.matches.length, 1);
  assert.deepEqual(result.errors, [{ sourceId: "broken", code: "NETWORK" }]);
});
test("media codec and quality come from actual response headers only", async () => {
  const m = manager(async () => new Response(null, { headers: { "content-type": 'audio/mp4; codecs="mp4a.40.2"', "icy-br": "256" } }));
  const info = await m.probeMedia("catalog", "https://catalog.example/audio.flac");
  assert.equal(info.codec, "mp4a.40.2"); assert.equal(info.lossless, false); assert.equal(info.bitrateKbps, 256);
  assert.equal(info.verifiedAudioBytes, false);
  for (const mime of ["audio/mp4", "audio/ogg", "audio/wav", "application/octet-stream"]) {
    const unknown = mediaInfo(new Headers({ "content-type": mime }));
    assert.equal(unknown.codec, null); assert.equal(unknown.lossless, null);
  }
  assert.equal(mediaInfo(new Headers({ "content-type": "audio/flac" })).lossless, true);
});
test("manual versions retain recording variants but reject unrelated songs and artists", async () => {
  let args;
  const m = new SourceManager({ youtube: { search: async (...input) => {
    args = input; return { tracks: [track, track, { ...track, id: "2", title: "Song (Live)" }, { ...track, id: "3", title: "Unrelated song" }, { ...track, id: "4", artist: "Different artist", artists: [{ title: "Different artist" }] }] };
  } } });
  const versions = await m.queryVersions(track, "Song alternate versions");
  assert.deepEqual(args, ["Song alternate versions", "songs"]);
  assert.equal(versions.length, 2);
  assert.equal(versions[0].match.matches, true); assert.equal(versions[1].match.matches, false);
  assert.ok(versions.every((v) => v.manualSelection && v.sourceId === "youtube" && v.media === null));
});
test("manual version timeout and transport errors remain sanitized", async () => {
  const m = new SourceManager({ youtube: { search: () => new Promise(() => {}) }, timeoutMs: 10 });
  await assert.rejects(m.queryVersions(track), { code: "TIMEOUT" });
  await assert.rejects(new SourceManager({ youtube: { search: () => { throw new Error("secret"); } } }).queryVersions(track), { message: "NETWORK" });
});
