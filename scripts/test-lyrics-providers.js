"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const { providerIds, labels, query, LyricsProviderError } = require("../src/main/lyricsProviders");

const context = { title: "Example", artist: "Artist", duration: 120 };
const isrc = "USABC2400001";
const ttml = '<tt xmlns="http://www.w3.org/ns/ttml"><body dur="120s"><div><p begin="12.250s" end="14s"><span begin="12.250s">Original</span> words</p></div></body></tt>';
const hit = (extras = {}) => ({ title: "Example", artist: "Artist", duration: 120, isrc, ...extras });
const biniHit = (extras = {}) => ({ track_name: "Example", artist_name: "Artist", duration: 120, isrc,
  lyricsUrl: `https://lrc.red/s/${isrc}.ttml`, ...extras });

function mock(...responses) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url: new URL(url), init });
    assert.ok(responses.length, `Unexpected request: ${url}`);
    const value = responses.shift();
    if (typeof value === "function") return value(url, init);
    if (value instanceof Response) return value;
    return new Response(typeof value === "string" ? value : JSON.stringify(value));
  };
  return { fetch, calls };
}

function errorCode(code) {
  return error => error instanceof LyricsProviderError && error.code === code;
}

test("exports immutable provider IDs and labels", () => {
  assert.equal(providerIds.length, 5);
  assert.ok(Object.isFrozen(providerIds));
  assert.ok(Object.isFrozen(labels));
  for (const id of providerIds) assert.ok(labels[id]);
});

test("lrc.red uses only the supplied real ISRC and preserves TTML timings", async () => {
  const m = mock(ttml);
  const found = await query("lrc-red", { ...context, isrc: "us-abc-24-00001" }, m);
  assert.equal(m.calls.length, 1);
  assert.equal(m.calls[0].url.href, `https://lrc.red/s/${isrc}.ttml`);
  assert.equal(found.sourceId, `lrc-red:${isrc}`);
  assert.match(found.rawLyrics, /12\.250s/);
  assert.equal(found.metadata.match, "isrc");
  assert.equal(found.metadata.format, "ttml");
});

test("lrc.red search rejects wrong edits/artists/durations, chooses closest", async () => {
  const m = mock({ hits: [hit({ title: "Example (Live)" }), hit({ artist: "Artist Tribute" }),
    hit({ duration: 124 }), hit({ duration: 122, isrc: "USABC2400002" }), hit()] }, ttml);
  const found = await query("lrc-red", context, m);
  assert.equal(found.metadata.isrc, isrc);
  assert.equal(found.metadata.durationVerified, true);
  assert.equal(m.calls[0].url.searchParams.get("q"), "Example Artist");
  assert.equal(m.calls.length, 2);
  assert.equal(m.calls[0].init.redirect, "error");
});

test("BiniLyrics sends ISRC alone, not a fabricated query identifier", async () => {
  const m = mock({ results: [biniHit()] }, ttml);
  const found = await query("binilyrics", { ...context, isrc }, m);
  assert.deepEqual([...m.calls[0].url.searchParams], [["isrc", isrc]]);
  assert.equal(found.sourceId, `binilyrics:${isrc}`);
});

test("BiniLyrics searches all candidates and sends explicit durationMs as seconds", async () => {
  const m = mock({ results: [biniHit({ track_name: "Unrelated" }), biniHit()] }, ttml);
  await query("binilyrics", { title: "Example", artist: "Artist", durationMs: 120000, album: "Album" }, m);
  assert.equal(m.calls[0].url.searchParams.get("duration"), "120");
  assert.equal(m.calls[0].url.searchParams.get("track"), "Example");
  assert.equal(m.calls[0].url.searchParams.get("album"), "Album");
  assert.equal(m.calls.length, 2);
});

test("BiniLyrics rejects a returned ISRC different from requested", async () => {
  const m = mock({ results: [biniHit({ isrc: "USABC2400002" })] });
  await assert.rejects(query("binilyrics", { ...context, isrc }, m), errorCode("NO_MATCH"));
  assert.equal(m.calls.length, 1);
});

for (const url of ["http://lrc.red/s/a", "https://evil.example/a", "https://user@lrc.red/a", "https://127.0.0.1/a"]) {
  test(`BiniLyrics refuses untrusted URL ${url}`, async () => {
    const m = mock({ results: [biniHit({ lyricsUrl: url })] });
    await assert.rejects(query("binilyrics", context, m), errorCode("INVALID_RESPONSE"));
    assert.equal(m.calls.length, 1);
  });
}

test("BiniLyrics refuses conflicting document path ISRC", async () => {
  const m = mock({ results: [biniHit({ lyricsUrl: "https://lrc.red/s/USABC2400002.ttml" })] });
  await assert.rejects(query("binilyrics", context, m), errorCode("NO_MATCH"));
});

test("Unison handles escaped nested TTML and sanitizes executable markup", async () => {
  const dirty = ttml.replace("Original", '<script>bad()</script><span onclick="bad()">Original</span>');
  const m = mock({ success: true, data: { song: "Example", artist: "Artist", id: 7,
    lyrics: JSON.stringify({ ttml: dirty.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") }) } });
  const found = await query("unison", context, m);
  assert.equal(found.sourceId, "unison:7");
  assert.doesNotMatch(found.rawLyrics, /script|onclick|bad\(\)/);
  assert.match(found.rawLyrics, /Original/);
  assert.equal(m.calls[0].url.searchParams.get("duration"), "120");
});

test("Unison plain lyrics stay plain with no invented time stamps", async () => {
  const m = mock({ success: true, data: { song: "Example", artist: "Artist", lyrics: "First line\nSecond line", syncType: "plain" } });
  const found = await query("unison", { title: "Example", artist: "Artist" }, m);
  assert.equal(found.rawLyrics, "First line\nSecond line");
  assert.equal(found.metadata.synced, false);
  assert.equal(found.metadata.durationVerified, false);
});

test("Portato preserves LRC and passes s/a/al/d query parameters", async () => {
  const m = mock({ data: { lyrics: "```lrc\n[ti:Example]\n[ar:Artist]\n[length:02:00]\n[00:12.250]<00:12.250>One <00:13.000>two\n```" } });
  const found = await query("betterlyrics-portato", { ...context, album: "Album" }, m);
  assert.equal(m.calls[0].url.pathname, "/qq/getLyrics");
  assert.deepEqual(Object.fromEntries(m.calls[0].url.searchParams), { s: "Example", a: "Artist", al: "Album", d: "120" });
  assert.match(found.rawLyrics, /\[00:12\.250\]<00:12\.250>One/);
  assert.equal(found.metadata.format, "lrc");
});

test("Portato QRC conversion uses provided millisecond starts, never interpolates", async () => {
  const m = mock({ lyrics: '<QrcInfos><LyricInfo><Lyric_1 LyricContent="[ti:Example]&#10;[ar:Artist]&#10;[12345,2000]One(12345,400) two(13000,500)"/></LyricInfo></QrcInfos>' });
  const found = await query("betterlyrics-portato", { title: "Example", artist: "Artist" }, m);
  assert.match(found.rawLyrics, /<00:12\.345>One<00:12\.745><00:13\.000> two<00:13\.500>/);
  const line = require("../src/main/lyrics").parseLyrics(found.rawLyrics).find(line => line.words?.length);
  assert.equal(line.words[0].start, 12.345);
  assert.equal(line.words[0].end, 12.745);
});

test("Genius selects a strict song result and extracts nested containers as untimed text", async () => {
  const m = mock({ response: { sections: [{ type: "artist", hits: [] }, { type: "song", hits: [
    { result: { title: "Example translated", artist_names: "Artist", url: "https://genius.com/wrong-lyrics" } },
    { result: { title: "Example", artist_names: "Artist", id: 42, url: "https://genius.com/Artist-example-lyrics" } }
  ] }] } }, '<html><body><div data-lyrics-container="true">[Verse 1]<br/>One <a href="/x"><b>two</b></a><div>three</div><br/><span data-exclude-from-selection="true">Ad</span><script>bad()</script>Four &amp; five</div><div data-lyrics-container="true">Last line<br/>42Embed</div></body></html>');
  const found = await query("genius", { title: "Example", artist: "Artist" }, m);
  assert.equal(found.rawLyrics, "[Verse 1]\nOne twothree\nFour & five\nLast line");
  assert.equal(found.metadata.synced, false);
  assert.equal(found.sourceId, "genius:42");
  assert.equal(m.calls.length, 2);
});

for (const [provider, response] of [
  ["unison", { success: true, data: { song: "Example", artist: "Artist", lyrics: "Words" } }],
  ["betterlyrics-portato", { lyrics: "[ti:Example]\n[ar:Artist]\n[00:01.000]Words" }],
  ["genius", { response: { sections: [{ type: "song", hits: [{ result: { title: "Example", artist_names: "Artist", url: "https://genius.com/example-lyrics" } }] }] } }]
]) {
  test(`${provider} cannot silently claim duration matching without duration metadata`, async () => {
    const m = mock(response);
    await assert.rejects(query(provider, context, m), errorCode("MATCH_UNVERIFIABLE"));
    assert.equal(m.calls.length, 1);
  });
}

for (const [status, code] of [[404, "NOT_FOUND"], [403, "ACCESS_DENIED"], [429, "RATE_LIMITED"], [503, "HTTP_ERROR"]]) {
  test(`HTTP ${status} remains ${code}`, async () => {
    const m = mock(new Response("failure", { status }));
    await assert.rejects(query("lrc-red", { ...context, isrc }, m), errorCode(code));
    assert.equal(m.calls.length, 1);
  });
}

for (const [body, code] of [
  ["<html>Cloudflare</html>", "INVALID_RESPONSE"],
  ['<!DOCTYPE tt [<!ENTITY x SYSTEM "file:///secret">]><tt><body><p>&x;</p></body></tt>', "INVALID_RESPONSE"],
  ["<tt><body><p>broken</body>", "INVALID_RESPONSE"],
  [JSON.stringify({ data: { error: "upstream failure", lyrics: "not lyrics" } }), "PROVIDER_ERROR"],
  ["[ar:Artist]\n[ti:Example]", "NOT_FOUND"]
]) {
  test(`rejects invalid payload ${body.slice(0, 42)}`, async () => {
    await assert.rejects(query("lrc-red", { ...context, isrc }, mock(body)), errorCode(code));
  });
}

test("JSON parse errors are not reported as no lyrics", async () => {
  await assert.rejects(query("unison", context, mock("{invalid")), errorCode("INVALID_RESPONSE"));
});

test("network errors preserve a distinct error code", async () => {
  await assert.rejects(query("unison", context, mock(() => { throw new Error("offline"); })), errorCode("NETWORK_ERROR"));
});

test("query deadline also bounds a fetch that ignores cancellation", async () => {
  await assert.rejects(query("unison", context, { timeoutMs: 20, fetch: () => new Promise(() => {}) }), errorCode("TIMEOUT"));
});

test("query deadline includes stalled body reads", async () => {
  const response = new Response(new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode("{")); } }));
  await assert.rejects(query("unison", context, { ...mock(response), timeoutMs: 20 }), errorCode("TIMEOUT"));
});

test("cancellation propagates to fetch and is not a timeout", async () => {
  const controller = new AbortController();
  let signal;
  const promise = query("unison", context, { signal: controller.signal, fetch: async (_, init) => {
    signal = init.signal;
    return new Promise(() => {});
  } });
  controller.abort();
  await assert.rejects(promise, errorCode("ABORTED"));
  assert.equal(signal.aborted, true);
});

test("pre-cancelled queries make no requests", async () => {
  const controller = new AbortController(); controller.abort();
  const m = mock();
  await assert.rejects(query("unison", context, { ...m, signal: controller.signal }), errorCode("ABORTED"));
  assert.equal(m.calls.length, 0);
});

test("streaming and declared response sizes are bounded", async () => {
  for (const response of [new Response("x".repeat(2 * 1024 * 1024 + 1)),
    new Response("small", { headers: { "content-length": "999999999" } })]) {
    await assert.rejects(query("unison", context, mock(response)), errorCode("RESPONSE_TOO_LARGE"));
  }
});

test("invalid inputs fail before networking", async () => {
  await assert.rejects(query("unknown", context), errorCode("INVALID_PROVIDER"));
  await assert.rejects(query("unison", {}), errorCode("INVALID_CONTEXT"));
  await assert.rejects(query("lrc-red", { ...context, isrc: "youtube-id" }), errorCode("INVALID_CONTEXT"));
  await assert.rejects(query("unison", { ...context, duration: -1 }), errorCode("INVALID_CONTEXT"));
  await assert.rejects(query("unison", context, { timeoutMs: Infinity }), errorCode("INVALID_OPTIONS"));
  await assert.rejects(query("unison", null), errorCode("INVALID_CONTEXT"));
  await assert.rejects(query("unison", context, null), errorCode("INVALID_OPTIONS"));
});

test("malformed nested JSON wrappers do not become plain lyrics", async () => {
  await assert.rejects(query("lrc-red", { ...context, isrc }, mock('{"lyrics":')), errorCode("INVALID_RESPONSE"));
});

test("lrc.red checks document duration even after a matching search", async () => {
  await assert.rejects(query("lrc-red", context, mock({ hits: [hit()] }, ttml.replace("120s", "130s"))), errorCode("NO_MATCH"));
});

test("cancellation between search and document fetch aborts second request", async () => {
  const controller = new AbortController();
  const m = mock({ results: [biniHit()] }, (_, init) => new Promise((resolve, reject) => {
    init.signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
    controller.abort();
  }));
  await assert.rejects(query("binilyrics", context, { ...m, signal: controller.signal }), errorCode("ABORTED"));
  assert.equal(m.calls.length, 2);
});

test("response stream failures are transport errors", async () => {
  const body = new ReadableStream({ start(controller) { controller.error(new Error("broken stream")); } });
  await assert.rejects(query("unison", context, mock(new Response(body))), errorCode("NETWORK_ERROR"));
});
