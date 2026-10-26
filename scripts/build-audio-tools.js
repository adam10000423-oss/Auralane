"use strict";
const path = require("node:path");
const fs = require("node:fs");
const result = require("esbuild").buildSync({ stdin: { contents: 'export { guess } from "web-audio-beat-detector";', resolveDir: path.resolve(__dirname, "..") },
  bundle: true, format: "iife", globalName: "AuralaneBeatDetector", platform: "browser", target: "chrome120", minify: true,
  metafile: true, banner: { js: "/*! Third-party notices: audio-tools.generated.LICENSE.txt */" },
  legalComments: "inline", outfile: path.resolve(__dirname, "../src/renderer/audio-tools.generated.js") });
const packages = new Set();
for (const input of Object.keys(result.metafile.inputs)) {
  if (!input.includes("node_modules/")) continue;
  let directory = path.dirname(path.resolve(input));
  while (!fs.existsSync(path.join(directory, "package.json")) && path.dirname(directory) !== directory) directory = path.dirname(directory);
  packages.add(directory);
}
const notices = [...packages].sort().map(directory => {
  const pkg = JSON.parse(fs.readFileSync(path.join(directory, "package.json"), "utf8"));
  const file = fs.readdirSync(directory).find(name => /^licen[cs]e(?:\.md|\.txt)?$/i.test(name));
  if (!file) throw new Error(`Missing bundled license for ${pkg.name}`);
  return `${pkg.name} ${pkg.version}\n${"=".repeat(60)}\n${fs.readFileSync(path.join(directory, file), "utf8")}`;
});
fs.writeFileSync(path.resolve(__dirname, "../src/renderer/audio-tools.generated.LICENSE.txt"), notices.join("\n\n"));
