"use strict";

const fs = require("node:fs/promises");
const { createReadStream } = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");

async function main() {
  const root = path.resolve(__dirname, "..");
  const manifest = require("../src/config/translation-pack.json");
  const file = path.join(root, "dist", "translation-pack", manifest.asset);
  const hash = crypto.createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  if ((await fs.stat(file)).size !== manifest.bytes || hash.digest("hex") !== manifest.sha256) throw new Error("Pack does not match pinned manifest.");
  // Ask the existing Git credential manager; never persist or print its response.
  const credential = execFileSync("git", ["credential", "fill"], {
    cwd: root, input: "protocol=https\nhost=github.com\n\n", encoding: "utf8", timeout: 30000,
    windowsHide: true, stdio: ["pipe", "pipe", "pipe"], env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never" }
  });
  const token = credential.split(/\r?\n/).find(line => line.startsWith("password="))?.slice(9);
  if (!token) throw new Error("GitHub credentials unavailable.");
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  const api = "https://api.github.com/repos/adam10000423-oss/Auralane";
  async function json(url, options = {}) {
    const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
    if (!response.ok) throw new Error(`GitHub request failed (${response.status}).`);
    return response.json();
  }
  let response = await fetch(`${api}/releases/tags/offline-translation-v1`, { headers });
  let release;
  if (response.status === 404) release = await json(`${api}/releases`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      tag_name: "offline-translation-v1", target_commitish: "main", name: "Offline Translation Pack v1 (Windows x64)",
      prerelease: true, make_latest: "false",
      body: "Optional offline translation data, not an application update. Download and remove it in Settings > Lyrics. Online translation does not require this pack.\n\nWindows x64 runtime plus English, Traditional/Simplified Chinese, Japanese and Korean Argos/OPUS-MT models. Model attribution and CC-BY 4.0 notices are preserved inside the .argosmodel archives (README.md); see https://www.argosopentech.com/ and https://github.com/Helsinki-NLP/Opus-MT . Runtime dependency license files are preserved.\n\nSHA-256: `" + manifest.sha256 + "`\nBytes: " + manifest.bytes
    })
  });
  else { if (!response.ok) throw new Error(`GitHub release lookup failed (${response.status}).`); release = await response.json(); }
  const existing = release.assets.find(asset => asset.name === manifest.asset);
  if (existing) {
    if (existing.size !== manifest.bytes || (existing.digest && existing.digest !== `sha256:${manifest.sha256}`)) throw new Error("Existing release asset differs. Never replace immutable pack v1.");
    console.log(`Already uploaded: ${existing.browser_download_url}`); return;
  }
  const upload = release.upload_url.replace(/\{.*$/, "") + "?name=" + encodeURIComponent(manifest.asset);
  const asset = await json(upload, { method: "POST", duplex: "half", body: createReadStream(file), headers: { "Content-Type": "application/zip", "Content-Length": String(manifest.bytes) } });
  if (asset.digest && asset.digest !== `sha256:${manifest.sha256}`) throw new Error("GitHub asset digest mismatch.");
  console.log(`Uploaded: ${asset.browser_download_url}`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
