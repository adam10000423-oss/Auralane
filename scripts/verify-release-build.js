"use strict";
const fs = require("node:fs"), path = require("node:path"), assert = require("node:assert/strict"), crypto = require("node:crypto");
async function main() {
  const directory = path.resolve(process.argv[2] || "dist/release-1.1.0");
  const version = require("../package.json").version;
  const asar = await import("@electron/asar");
  const archive = path.join(directory, "win-unpacked/resources/app.asar");
  const files = asar.listPackage(archive).map(file => file.replaceAll("\\", "/"));
  assert.equal(JSON.parse(asar.extractFile(archive, "package.json")).version, version);
  assert.ok(!files.some(file => /^\/(?:vendor|background-videos|offline-translation|\.git|docs)(?:\/|$)/.test(file)));
  assert.ok(!asar.extractFile(archive, path.join("src", "main", "main.js")).toString().includes('appendSwitch("disable-reading-from-canvas")'));
  assert.ok(files.includes("/src/renderer/lyricsCard.js"));
  const metadata = require("js-yaml").load(fs.readFileSync(path.join(directory, "latest.yml"), "utf8"));
  assert.equal(metadata.version, version);
  assert.equal(metadata.path, `Auralane-Setup-${version}-x64.exe`);
  for (const entry of metadata.files) {
    const data = fs.readFileSync(path.join(directory, entry.url));
    assert.equal(crypto.createHash("sha512").update(data).digest("base64"), entry.sha512);
  }
  for (const kind of ["Setup", "Portable"]) {
    const name = `Auralane-${kind}-${version}-x64.exe`, bytes = fs.statSync(path.join(directory, name)).size;
    assert.ok(bytes > 50 * 1024 ** 2 && bytes < 300 * 1024 ** 2);
    console.log(`${name}: ${(bytes / 1024 ** 2).toFixed(1)} MiB`);
  }
  const { _electron } = require("playwright-core"), env = { ...process.env }; delete env.ELECTRON_RUN_AS_NODE;
  const app = await _electron.launch({ executablePath: path.join(directory, "win-unpacked/Auralane.exe"), args: ["--auralane-preview"], env, timeout: 60000 });
  try {
    const page = await app.firstWindow(), errors = []; page.on("pageerror", e => errors.push(e.message));
    await page.waitForFunction(() => typeof state !== "undefined" && state.queueHydrated && state.onlineTogether && window.AuralaneLyricsCard && window.AuralaneLyricFill, null, { timeout: 60000 });
    assert.equal(await app.evaluate(({ app }) => app.getVersion()), version);
    assert.equal(await app.evaluate(() => process.versions.electron), require("../package.json").devDependencies.electron);
    assert.deepEqual(errors, []);
    console.log(`Packaged ${version} boot, modules, exclusions and updater hashes verified.`);
  } finally { await app.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
