"use strict";
const fs = require("node:fs"), path = require("node:path"), assert = require("node:assert/strict");
async function main() {
  const root = path.join(__dirname, ".."), text = fs.readFileSync(path.join(root, "README.md"), "utf8");
  for (const match of text.matchAll(/(?:src="|\]\()((?:docs\/screenshots|src\/assets)\/[^"\)]+)/g)) assert.ok(fs.existsSync(path.join(root, match[1])), match[1]);
  assert.ok(!text.includes("15-liquid-glass-demo.gif"));
  for (const name of ["17-mini-player.png", "18-desktop-lyrics.png", "16-artist-session.png", "19-home.png", "20-library.png", "21-github-updates.png"]) assert.ok(text.includes(name), name);
  assert.ok(text.includes('width="200"'));
  console.log("README gallery, icon and local media links verified.");
  for (const badge of ["v/release/adam10000423-oss/Auralane", "license/adam10000423-oss/Auralane", "downloads/adam10000423-oss/Auralane/total", "actions/workflow/status/adam10000423-oss/Auralane/release.yml"]) {
    const response = await fetch(`https://img.shields.io/github/${badge}?style=for-the-badge`, { signal:AbortSignal.timeout(15000) });
    assert.ok(response.ok, `Badge HTTP ${response.status}`);
    const svg = await response.text();
    console.log(svg.match(/<title>(.*?)<\/title>/)?.[1] || "Badge loaded");
    assert.ok(!/inaccessible|not found|invalid|unable to select/i.test(svg));
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
