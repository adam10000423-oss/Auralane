const fs = require("node:fs");
const yaml = require("js-yaml");

function mergeMacUpdateMetadata(x64Source, arm64Source) {
  const x64 = yaml.load(x64Source);
  const arm64 = yaml.load(arm64Source);
  if (!x64?.version || x64.version !== arm64?.version) {
    throw new Error("macOS update metadata versions do not match.");
  }
  const files = [];
  const seen = new Set();
  for (const file of [...(x64.files || []), ...(arm64.files || [])]) {
    if (!file?.url || seen.has(file.url)) continue;
    seen.add(file.url);
    files.push(file);
  }
  if (!files.some((file) => /-x64\.(?:zip|dmg)$/i.test(file.url))) {
    throw new Error("Intel macOS update files are missing.");
  }
  if (!files.some((file) => /-arm64\.(?:zip|dmg)$/i.test(file.url))) {
    throw new Error("Apple silicon update files are missing.");
  }
  return {
    version: x64.version,
    files,
    path: x64.path || files[0].url,
    sha512: x64.sha512 || files[0].sha512,
    releaseDate: [x64.releaseDate, arm64.releaseDate].filter(Boolean).sort().at(-1)
  };
}

if (require.main === module) {
  const [x64Path, arm64Path, outputPath] = process.argv.slice(2);
  if (!x64Path || !arm64Path || !outputPath) {
    throw new Error("Usage: merge-mac-update-metadata <x64.yml> <arm64.yml> <output.yml>");
  }
  const merged = mergeMacUpdateMetadata(
    fs.readFileSync(x64Path, "utf8"),
    fs.readFileSync(arm64Path, "utf8")
  );
  fs.writeFileSync(outputPath, yaml.dump(merged, { lineWidth: -1, noRefs: true }));
}

module.exports = { mergeMacUpdateMetadata };
