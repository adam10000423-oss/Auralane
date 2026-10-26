"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { createWriteStream } = require("node:fs");
const { pipeline } = require("node:stream/promises");
const yauzl = require("yauzl");

const ROOT = "https://github.com/adam10000423-oss/Auralane/releases/download/offline-translation-v1/";
function safeEntry(name) {
  return typeof name === "string" && !name.includes("\\") && !name.includes(":") &&
    !name.startsWith("/") && !name.split("/").some(v => v === ".." || v === ".") &&
    /^(runtime|models)\//.test(name);
}
async function unpack(file, destination, signal) {
  const zip = await new Promise((resolve, reject) => yauzl.open(file, { lazyEntries: true }, (e, z) => e ? reject(e) : resolve(z)));
  let total = 0, count = 0;
  await new Promise((resolve, reject) => {
    const fail = error => { zip.close(); reject(error); };
    zip.on("error", fail); zip.on("end", resolve);
    zip.on("entry", async entry => {
      try {
        signal.throwIfAborted();
        total += entry.uncompressedSize;
        const mode = (entry.externalFileAttributes >>> 16) & 0xf000;
        if (!safeEntry(entry.fileName) || mode === 0xa000 || ++count > 10000 || total > 2 * 1024 ** 3) throw new Error("Invalid translation archive.");
        const target = path.join(destination, entry.fileName);
        if (entry.fileName.endsWith("/")) await fs.mkdir(target, { recursive: true });
        else {
          await fs.mkdir(path.dirname(target), { recursive: true });
          const stream = await new Promise((r, j) => zip.openReadStream(entry, (e, s) => e ? j(e) : r(s)));
          await pipeline(stream, createWriteStream(target, { flags: "wx" }), { signal });
        }
        zip.readEntry();
      } catch (error) { fail(error); }
    });
    zip.readEntry();
  });
}

class TranslationPack {
  constructor({ root, stop = () => {}, manifest = require("../config/translation-pack.json"), platform = process.platform, arch = process.arch, fetchImpl = fetch }) {
    this.root = path.resolve(root); this.directory = path.join(this.root, "offline-translation");
    this.cache = path.join(this.root, "translation-models"); this.manifest = manifest;
    this.stop = stop; this.supported = platform === "win32" && arch === "x64";
    this.fetch = fetchImpl;
    this.state = { phase: "idle", received: 0, total: manifest.bytes || 0, error: "" };
    this.listeners = new Set(); this.job = null; this.controller = null; this.removing = false;
  }
  async installed() {
    try {
      await fs.access(path.join(this.directory, "runtime", "local_translate.exe"));
      return JSON.parse(await fs.readFile(path.join(this.directory, "installed.json"), "utf8")).sha256 === this.manifest.sha256;
    }
    catch { return false; }
  }
  async status() { return { ...this.state, supported: this.supported, installed: await this.installed() }; }
  emit() { this.status().then(value => { for (const listener of this.listeners) listener(value); }).catch(() => {}); }
  subscribe(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  async start() {
    if (this.job || this.removing) return this.status();
    if (!this.supported) throw new Error("Offline translation currently supports Windows x64 only.");
    if (await this.installed()) return this.status();
    if (this.job || this.removing) return this.status();
    this.controller = new AbortController();
    const signal = this.controller.signal;
    this.state = { phase: "downloading", received: 0, total: this.manifest.bytes, error: "" }; this.emit();
    this.job = this.install(signal).catch(error => {
      this.state.phase = signal.aborted ? "idle" : "error";
      this.state.error = signal.aborted ? "" : String(error.message).slice(0, 250);
    }).finally(() => { this.job = null; this.controller = null; this.emit(); });
    return this.status();
  }
  async install(signal) {
    const staging = path.join(this.root, "offline-translation-staging");
    const archive = path.join(staging, "pack.zip"), extracted = path.join(staging, "content");
    try {
      await fs.rm(staging, { recursive: true, force: true });
      await fs.mkdir(extracted, { recursive: true });
      const { asset, sha256, bytes } = this.manifest;
      if (!/^[a-zA-Z0-9._-]+\.zip$/.test(asset) || !/^[a-f0-9]{64}$/.test(sha256) || !Number.isSafeInteger(bytes) || bytes > 1024 ** 3) throw new Error("Invalid translation manifest.");
      const response = await this.fetch(ROOT + asset, { signal: AbortSignal.any([signal, AbortSignal.timeout(30 * 60 * 1000)]) });
      if (response.url) {
        const url = new URL(response.url);
        if (url.protocol !== "https:" || !["github.com", "release-assets.githubusercontent.com", "objects.githubusercontent.com"].includes(url.hostname)) throw new Error("Unexpected translation download origin.");
      }
      if (!response.ok || !response.body) throw new Error(`Translation download failed (HTTP ${response.status}).`);
      const hash = crypto.createHash("sha256");
      const output = await fs.open(archive, "wx"); let last = 0;
      try {
        for await (const chunk of response.body) {
          signal.throwIfAborted(); this.state.received += chunk.length;
          if (this.state.received > bytes) throw new Error("Translation download exceeded expected size.");
          hash.update(chunk); await output.writeFile(chunk);
          if (Date.now() - last > 200) { last = Date.now(); this.emit(); }
        }
      } finally { await output.close(); }
      if (this.state.received !== bytes || hash.digest("hex") !== sha256) throw new Error("Translation checksum mismatch.");
      this.state.phase = "installing"; this.emit();
      await unpack(archive, extracted, signal);
      await fs.access(path.join(extracted, "runtime", "local_translate.exe"));
      for (const name of ["en_ja", "en_ko", "en_zh", "en_zt", "ja_en", "ko_en", "zh_en", "zt_en"]) await fs.access(path.join(extracted, "models", name + ".argosmodel"));
      signal.throwIfAborted();
      await fs.writeFile(path.join(extracted, "installed.json"), JSON.stringify({ sha256 }));
      await this.stop(); await fs.rename(extracted, this.directory);
      this.state.phase = "idle";
    } finally { await fs.rm(staging, { recursive: true, force: true }); }
  }
  async cancel() { this.controller?.abort(); await this.job; return this.status(); }
  async remove() {
    if (this.removing) throw new Error("Translation removal already running.");
    this.removing = true;
    try {
      await this.cancel(); await this.stop();
      await fs.rm(this.directory, { recursive: true, force: true });
      await fs.rm(this.cache, { recursive: true, force: true });
      this.state = { phase: "idle", received: 0, total: this.manifest.bytes, error: "" }; this.emit();
      return this.status();
    } finally { this.removing = false; }
  }
}
module.exports = { TranslationPack, safeEntry, unpack };
