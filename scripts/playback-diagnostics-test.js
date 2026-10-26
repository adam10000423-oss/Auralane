const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createModel, clean } = require("../src/renderer/playback-diagnostics-model");

async function main() {
  const model = createModel();
  model.resolution({ phase: "start", id: 1 }, "a");
  model.resolution({ phase: "start", id: 2 }, "b");
  model.resolution({ phase: "resolved", id: 1, client: "stale", hasStream: true }, "a");
  assert.equal(model.snapshot().client, null);
  model.resolution({ phase: "resolved", id: 2, client: "WEB", hasStream: true, mimeType: "audio/webm", bitrate: 128000, resolutionMs: 42 }, "b");
  assert.equal(model.snapshot().bitrate, 128000);
  model.resolution({ phase: "start", id: 3, retry: true }, "b", 1);
  assert.equal(model.snapshot().resolutionRetries, 1);
  model.resolution({ phase: "error", id: 3, reason: "Failed https://secret.test/?token=secret" }, "b");
  assert(!JSON.stringify(model.snapshot()).includes("token=secret"));
  model.media("playing", "Local", {});
  assert.equal(model.snapshot().mimeType, null);
  assert.equal(model.snapshot().resolutionRetries, 0);
  assert(model.snapshot().recentError);
  model.clearError();
  assert.equal(model.snapshot().recentError, null);
  assert.equal(clean("C:\\private\\music.mp3"), "[redacted path]");

  let bridge;
  let result = { streamUrl: "https://secret.test/stream", client: "WEB", mimeType: "audio/webm", bitrate: 128000 };
  let rejection;
  const calls = [];
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../src/preload.js"), "utf8"), {
    performance: { now: () => 100 },
    require: () => ({ contextBridge: { exposeInMainWorld: (_, api) => { bridge = api; } },
      ipcRenderer: { invoke: async (...args) => { calls.push(args); if (rejection) throw rejection; return result; } } })
  });
  const events = [];
  const unsubscribe = bridge.onPlaybackDiagnostic(event => events.push(event));
  bridge.onPlaybackDiagnostic(() => { throw new Error("observer failure"); });
  const payload = { videoId: "a" };
  assert.equal(await bridge.playback(payload), result);
  assert.equal(calls[0][1], payload);
  assert.equal(events[0].phase, "start");
  assert.equal(events[1].mimeType, "audio/webm");
  assert(!JSON.stringify(events).includes("secret.test"));
  rejection = new Error("resolver failed");
  await assert.rejects(bridge.playback(payload), error => error === rejection);
  assert.equal(events.at(-1).phase, "error");
  rejection = null;
  result = { attemptedProviders: ["NetEase"], candidates: [{}], errors: [{ provider: "LRCLIB", message: "timeout" }] };
  assert.equal(await bridge.searchLyrics({}, {}), result);
  assert.equal(events.at(-1).kind, "lyrics");
  assert.equal(events.at(-1).candidateCount, 1);
  unsubscribe();
  const count = events.length;
  await bridge.playback(payload);
  assert.equal(events.length, count);
  console.log("Playback diagnostics: model and preload assertions passed.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
