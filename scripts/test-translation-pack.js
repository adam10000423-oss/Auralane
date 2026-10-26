"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { TranslationPack, safeEntry } = require("../src/main/translationPack");

// A minimal stored ZIP fixture keeps these tests independent of external tools.
function zip(files) {
  const local = [], central = []; let offset = 0;
  for (const [name, text] of Object.entries(files)) {
    const n = Buffer.from(name), data = Buffer.from(text); let crc = 0xffffffff;
    for (const byte of data) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
    crc = (crc ^ 0xffffffff) >>> 0;
    const head = Buffer.alloc(30); head.writeUInt32LE(0x04034b50); head.writeUInt16LE(20, 4);
    head.writeUInt32LE(crc, 14); head.writeUInt32LE(data.length, 18); head.writeUInt32LE(data.length, 22); head.writeUInt16LE(n.length, 26);
    const dir = Buffer.alloc(46); dir.writeUInt32LE(0x02014b50); dir.writeUInt16LE(20, 4); dir.writeUInt16LE(20, 6);
    dir.writeUInt32LE(crc, 16); dir.writeUInt32LE(data.length, 20); dir.writeUInt32LE(data.length, 24); dir.writeUInt16LE(n.length, 28); dir.writeUInt32LE(offset, 42);
    local.push(head, n, data); central.push(dir, n); offset += head.length + n.length + data.length;
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50);
  end.writeUInt16LE(Object.keys(files).length, 8); end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}
function files() {
  return Object.fromEntries(["runtime/local_translate.exe", ...["en_ja", "en_ko", "en_zh", "en_zt", "ja_en", "ko_en", "zh_en", "zt_en"].map(n => `models/${n}.argosmodel`)].map(n => [n, "test fixture"]));
}
async function fixture(t, data = zip(files()), options = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "auralane-pack-"));
  const manifest = { asset: "test.zip", bytes: data.length, sha256: crypto.createHash("sha256").update(data).digest("hex") };
  const service = new TranslationPack({ root, platform: "win32", arch: "x64", manifest, fetchImpl: async () => new Response(data), ...options });
  t.after(async () => { await service.cancel(); await fs.rm(root, { recursive: true, force: true }); });
  return service;
}
test("safe archive paths reject escape, drives and alternate streams", () => {
  for (const n of ["../evil", "/runtime/x", "runtime/../../x", "runtime/./x", "C:/x", "runtime/x:evil", "runtime\\x", "evil/file"]) assert.equal(safeEntry(n), false, n);
  assert.equal(safeEntry("runtime/_internal/data.dll"), true);
});
test("download, verify, install, restart and delete with cache; no unrelated data removed", async t => {
  const s = await fixture(t); let stopped = 0; s.stop = async () => { stopped++; };
  await fs.writeFile(path.join(s.root, "keep.txt"), "personal data");
  assert.equal((await s.status()).installed, false);
  await s.start(); await s.job;
  assert.equal((await s.status()).installed, true); assert.equal((await s.status()).error, "");
  const next = new TranslationPack({ root: s.root, manifest: s.manifest }); assert.equal(await next.installed(), true);
  await fs.mkdir(s.cache); await fs.writeFile(path.join(s.cache, "model"), "cache");
  await s.remove(); assert.equal(await s.installed(), false);
  await assert.rejects(fs.access(s.cache)); assert.equal(await fs.readFile(path.join(s.root, "keep.txt"), "utf8"), "personal data"); assert.equal(stopped, 2);
});
test("checksum failure leaves no installed or partial files and retry succeeds", async t => {
  const s = await fixture(t); s.manifest.sha256 = "0".repeat(64);
  await s.start(); await s.job; assert.match((await s.status()).error, /checksum/); assert.equal(await s.installed(), false);
  await assert.rejects(fs.access(path.join(s.root, "offline-translation-staging")));
  s.manifest.sha256 = crypto.createHash("sha256").update(zip(files())).digest("hex");
  await s.start(); await s.job; assert.equal(await s.installed(), true);
});
test("malicious ZIP, incomplete runtime and HTTP failure cannot be installed", async t => {
  for (const data of [zip({ ...files(), "runtime/../../escape": "evil" }), zip({ "models/en_zt.argosmodel": "incomplete" })]) {
    const s = await fixture(t, data); await s.start(); await s.job; assert.equal(await s.installed(), false); assert.equal((await s.status()).phase, "error");
  }
  const s = await fixture(t, undefined, { fetchImpl: async () => new Response("not found", { status: 404 }) });
  await s.start(); await s.job; assert.match((await s.status()).error, /404/);
});
test("cancel stops download; remove also cancels; concurrent starts make one request", async t => {
  let calls = 0;
  const s = await fixture(t, undefined, { fetchImpl: async (_url, { signal }) => {
    calls++; signal.throwIfAborted(); return new Promise((resolve, reject) => { signal.addEventListener("abort", () => reject(signal.reason), { once: true }); });
  } });
  await Promise.all([s.start(), s.start()]); assert.equal(calls <= 1, true);
  await s.cancel(); assert.equal((await s.status()).phase, "idle"); assert.equal((await s.status()).error, "");
  await s.start(); await s.remove(); assert.equal(await s.installed(), false);
});
test("unsupported platforms do not fetch and package excludes translation vendor", async t => {
  const s = await fixture(t, undefined, { platform: "darwin" }); await assert.rejects(s.start(), /Windows/);
  const config = require("../package.json"); assert.equal(config.build.win.extraResources, undefined);
});
