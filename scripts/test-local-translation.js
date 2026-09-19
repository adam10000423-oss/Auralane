const path = require("node:path");
const os = require("node:os");
const fs = require("node:fs");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const executable = path.join(root, "vendor", "local-translate", "runtime", "local_translate.exe");
const models = path.join(root, "vendor", "local-translate", "models");
const cache = path.join(os.tmpdir(), "auralane-local-translation-test");
const sourceLanguage = process.argv[2] || "en";
const targetLanguage = process.argv[3] || "zh-TW";
const sampleText = process.argv[4] || "Never gonna give you up";

if (!fs.existsSync(executable)) throw new Error(`Missing offline translator: ${executable}`);
const child = spawn(executable, [], {
  windowsHide: true,
  stdio: ["pipe", "pipe", "pipe"],
  env: {
    ...process.env,
    AURALANE_TRANSLATION_MODELS: models,
    AURALANE_TRANSLATION_CACHE: cache,
    PYTHONIOENCODING: "utf-8"
  }
});

let buffer = "";
let stderr = "";
const timer = setTimeout(() => {
  child.kill();
  throw new Error(`Offline translation test timed out. ${stderr}`);
}, 120000);

child.stderr.setEncoding("utf8");
child.stderr.on("data", (chunk) => { stderr += chunk; });
child.stdout.setEncoding("utf8");
child.stdout.on("data", (chunk) => {
  buffer += chunk;
  if (!buffer.includes("\n")) return;
  clearTimeout(timer);
  const response = JSON.parse(buffer.slice(0, buffer.indexOf("\n")));
  child.kill();
  if (!response.ok || response.provider !== "Auralane Offline" || !response.translations?.[0]) {
    throw new Error(`Offline translation failed: ${JSON.stringify(response)} ${stderr}`);
  }
  console.log(JSON.stringify(response));
});
child.once("error", (error) => {
  clearTimeout(timer);
  throw error;
});
child.stdin.write(`${JSON.stringify({
  id: 1,
  texts: [sampleText],
  sourceLanguage,
  targetLanguage
})}\n`);
