"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { createReadStream } = require("node:fs");
const { spawn } = require("node:child_process");

async function main() {
  const root = path.resolve(__dirname, "..");
  const output = path.join(root, "dist", "translation-pack");
  const asset = "Auralane-Offline-Translation-v1-win-x64.zip";
  await fs.mkdir(output, { recursive: true });
  const file = path.join(output, asset);
  const quote = value => "'" + value.replaceAll("'", "''") + "'";
  const source = path.join(root, "vendor", "local-translate");
  await new Promise((resolve, reject) => {
    const child = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command",
      `Compress-Archive -LiteralPath ${quote(path.join(source, "runtime"))},${quote(path.join(source, "models"))} -DestinationPath ${quote(file)} -CompressionLevel Optimal -Force`], { windowsHide: true, stdio: "inherit" });
    child.on("error", reject); child.on("exit", code => code === 0 ? resolve() : reject(new Error(`Archive build failed (${code}).`)));
  });
  const hash = crypto.createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  const manifest = { version: 1, asset, bytes: (await fs.stat(file)).size, sha256: hash.digest("hex") };
  await fs.writeFile(path.join(root, "src", "config", "translation-pack.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(JSON.stringify(manifest));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
