const assert = require("node:assert/strict");
const { test } = require("node:test");
const { parseLyrics, providerPayloadToLrc, musixmatchRichsyncToLrc, searchLyricsCandidates, lyricsWordTimingQuality } = require("../src/main/lyrics");

test("nested and escaped TTML responses retain real word boundaries", () => {
  const xml = '<tt xmlns="http://www.w3.org/ns/ttml"><body><p begin="1s" end="3s"><span begin="1s" end="2s">Hello </span><span begin="2s" end="3s">there</span></p></body></tt>';
  for (const payload of [xml, { data: { ttml: xml } }, JSON.stringify({ result: { lyrics: xml.replace(/</g, "&lt;").replace(/>/g, "&gt;") } })]) {
    const lines = parseLyrics(providerPayloadToLrc(payload));
    assert.equal(lines[0].words.length, 2);
    assert.equal(lines[0].words[1].start, 2);
  }
});

test("LyricsPlus syllable response does not degrade to line sync", () => {
  const raw = providerPayloadToLrc({ type: "syllable", lyrics: [{ time: 220, text: "Hello there", syllabus: [
    { text: "Hello ", time: 220, duration: 480 }, { text: "there", time: 700, duration: 500 }
  ] }] });
  const lines = parseLyrics(raw);
  assert.equal(lines[0].words.length, 2);
  assert.equal(lines[0].words[0].start, 0.22);
  assert.equal(lines[0].words[1].end, 1.2);
  assert.equal(lyricsWordTimingQuality({ lines }).valid, true);
});

test("TTML declared singer identifiers preserve separate voices and timing", () => {
  const xml='<tt xmlns="http://www.w3.org/ns/ttml" xmlns:ttm="http://www.w3.org/ns/ttml#metadata"><head><metadata><ttm:agent xml:id="singerA" type="person"/><ttm:agent xml:id="singerB" type="person"/></metadata></head><body><p begin="1s" end="3s" ttm:agent="singerA"><span begin="1s" end="3s">First</span></p><p begin="2s" end="4s" ttm:agent="singerB"><span begin="2s" end="4s">Second</span></p></body></tt>';
  const lines=parseLyrics(providerPayloadToLrc(xml));
  assert.equal(lines[0].agent,"v1");assert.equal(lines[1].agent,"v2");
  assert.equal(lines[0].time,1);assert.equal(lines[1].time,2);
  assert.equal(lines[1].words[0].end,4);
});

test("RichSync offsets use their real line anchor, not uniform interpolation", () => {
  const lines = parseLyrics(musixmatchRichsyncToLrc(JSON.stringify([{ ts: 10, te: 15, x: "Hello there", l: [{ c: "Hello", o: 0.2 }, { c: "there", o: 2.6 }] }])));
  assert.equal(lines[0].words[0].start, 10.2);
  assert.equal(lines[0].words[1].start, 12.6);
  assert.equal(lines[0].words[1].end, 15);
  assert.equal(musixmatchRichsyncToLrc("invalid"), "");
});

test("provider envelopes containing errors or candidate arrays are not lyric documents", () => {
  assert.equal(providerPayloadToLrc({ error: "Denied", lyrics: "wrong" }), "");
  assert.equal(providerPayloadToLrc({ lyrics: [{ lyrics: "candidate one" }, { lyrics: "candidate two" }] }), "");
});

test("explicitly disabled lyric provider never starts a network lookup", async () => {
  const {findLyrics}=require("../src/main/lyrics"), original=global.fetch;
  let calls=0;global.fetch=async()=>{calls++;throw new Error("Unexpected fetch");};
  try {
    const result=await findLyrics({title:"Counting Stars",artist:"OneRepublic"},{provider:"musixmatch",providers:["lrclib"]});
    assert.equal(result.found,false);assert.equal(calls,0);
    await findLyrics({title:"Counting Stars",artist:"OneRepublic"},{providers:[]});assert.equal(calls,0);
  } finally {global.fetch=original;}
});

test("KuGou KRC preserves real relative word starts and durations", () => {
  const { deflateSync } = require("node:zlib");
  const { kugouKrcToLrc } = require("../src/main/lyrics");
  const bytes = deflateSync(Buffer.from("[10000,4000]<200,600,0>Hello <1800,900,0>there"));
  const key = [64,71,97,119,94,50,116,71,81,54,49,45,206,210,110,105];
  for (let i = 0; i < bytes.length; i++) bytes[i] ^= key[i % key.length];
  const raw = kugouKrcToLrc(Buffer.concat([Buffer.from("krc1"), bytes]).toString("base64"));
  const line = parseLyrics(raw)[0];
  assert.equal(line.words[0].start, 10.2);
  assert.equal(line.words[0].end, 10.8);
  assert.equal(line.words[1].start, 11.8);
  assert.equal(line.words[1].end, 12.7);
  assert.equal(kugouKrcToLrc("invalid"), "");
});

test("transient BetterLyrics failure does not disable the next lookup", async () => {
  const original = global.fetch;
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return calls === 1 ? new Response("unavailable", { status: 503 })
      : new Response(JSON.stringify({ data: { lyrics: "[00:01.00]Hello there" } }));
  };
  try {
    const options = { providers: ["betterlyrics"] };
    const track = { title: "Example", artist: "Artist" };
    const first = await searchLyricsCandidates(track, options);
    assert.equal(first.errors.length, 1);
    const second = await searchLyricsCandidates(track, options);
    assert.equal(second.candidates.length, 1);
    assert.equal(calls, 2);
  } finally { global.fetch = original; }
});

test("KuGou bounds downloads, deduplicates hashes and access keys, and merges identical timed documents", async () => {
  const { deflateSync } = require("node:zlib");
  const key = [64,71,97,119,94,50,116,71,81,54,49,45,206,210,110,105];
  const bytes = deflateSync(Buffer.from("[1000,1000]<0,400,0>Hello <500,400,0>there"));
  for (let i = 0; i < bytes.length; i++) bytes[i] ^= key[i % key.length];
  const content = Buffer.concat([Buffer.from("krc1"), bytes]).toString("base64");
  const original = global.fetch;
  let hashes = 0, downloads = 0;
  const candidates = [{ id: "wrong-artist", accesskey: "a", singer: "Someone Else" },
    { id: "wrong-title", accesskey: "a", song: "Unrelated Recording" },
    { id: "1", accesskey: "a" }, { id: "1", accesskey: "b" },
    ...Array.from({ length: 35 }, (_, i) => ({ id: String(i + 2), accesskey: "a" }))];
  global.fetch = async (input) => {
    const url = new URL(input);
    if (url.pathname === "/api/v3/search/song") return Response.json({ data: { info: [{ hash: "same" }, { hash: "same" }] } });
    if (url.pathname === "/search") {
      if (url.searchParams.has("hash")) hashes++;
      return Response.json({ candidates });
    }
    if (url.pathname === "/download") {
      assert(!url.searchParams.get("id").startsWith("wrong-"));
      downloads++; return Response.json({ content });
    }
    throw Error("Unexpected request");
  };
  try {
    const result = await searchLyricsCandidates({ title: "Example", artist: "Artist" }, { providers: ["kugou"], limit: 50 });
    assert.equal(hashes, 1);
    assert.equal(downloads, 24);
    assert.equal(result.errors.length, 0);
    assert.equal(result.candidates.length, 1);
    assert.equal(result.candidates[0].lines[0].words[1].start, 1.5);
  } finally { global.fetch = original; }
});
