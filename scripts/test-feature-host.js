"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { EventEmitter } = require("node:events");
const { registerFeatures } = require("../src/main/featureHost");
const { roomTracks, translate } = require("../src/renderer/featureHost");

async function fixture(root) {
  const directory = root || await fs.mkdtemp(path.join(os.tmpdir(), "auralane-host-"));
  const handlers = new Map(), events = [], calls = [];
  const contents = Object.assign(new EventEmitter(), { mainFrame: {}, send: (channel, value) => events.push({ channel, value }) });
  const window = { webContents: contents };
  const api = { status: () => ({ lastfm: {}, listenbrainz: {}, discord: {}, spotify: {}, outbox: 0 }),
    configure: async (...args) => { calls.push(args); return api.status(); },
    playback: async value => { calls.push(["playback", value]); return api.status(); },
    dispose: async () => {},
    importSpotify: async (_url, { signal, onProgress }) => {
      onProgress({ phase: "matching", completed: 1, total: 1 });
      await new Promise(resolve => { if (signal.aborted) resolve(); else signal.addEventListener("abort", resolve, { once: true }); });
      return { status: "cancelled", matched: [], unmatched: [] };
    }
  };
  const options = { ipcMain: { handle: (name, fn) => handlers.set(name, fn), removeHandler: name => handlers.delete(name) },
    app: Object.assign(new EventEmitter(), { getPath: () => directory }), mainWindow: () => window, youtube: () => ({ search: async () => ({ tracks: [] }) }),
    safeStorage: { isEncryptionAvailable: () => true, encryptString: value => Buffer.from(Buffer.from(value).toString("base64")), decryptString: value => Buffer.from(value.toString(), "base64").toString() },
    dependencies: { createMusicIntegrations: async () => api } };
  const host = await registerFeatures(options);
  const event = { sender: contents, senderFrame: contents.mainFrame };
  return { host, directory, events, calls, contents, options, handlers, event,
    request: (type, payload = {}, sender = event) => handlers.get("features:request")(sender, { type, payload }) };
}

test("single IPC, strict main-frame guard, typed allowlist, and opt-in playback", async () => {
  const h = await fixture();
  try {
    assert.deepEqual([...h.handlers.keys()], ["features:request"]);
    assert.equal((await h.request("room.enable", {}, { sender: h.contents, senderFrame: {} })).error.code, "FORBIDDEN");
    assert.equal((await h.request("constructor")).error.code, "UNKNOWN_REQUEST");
    assert.equal((await h.request("room.enable", { unexpected: true })).error.code, "INVALID_REQUEST");
    assert.equal((await h.request("room.status")).value.enabled, false);
    const playback = { playId: "one", track: { title: "Title", artist: "Artist", durationSeconds: 100 }, playing: true, seeking: false };
    assert.equal((await h.request("integrations.playback", playback)).ok, true); assert.equal(h.calls.length, 0);
    await h.request("integrations.enablePlayback", { enabled: true }); await h.request("integrations.playback", playback);
    assert.equal(h.calls.length, 1);
  } finally { await h.host.dispose(); await fs.rm(h.directory, { recursive: true, force: true }); }
});

test("source config survives restart; private headers only enter encrypted own file", async () => {
  const h = await fixture();
  const config = { id: "custom", name: "Custom", searchUrl: "https://music.example/search", enabled: true };
  try {
    assert.equal((await h.request("sources.upsert", { config })).ok, true);
    assert.equal((await h.request("sources.headers", { id: "custom", headers: { authorization: "Bearer private-token" } })).ok, true);
    const plain = await fs.readFile(path.join(h.directory, "feature-sources.json"), "utf8");
    assert(!plain.includes("private-token"));
    assert(!(await fs.readFile(path.join(h.directory, "feature-source-secrets.enc"))).includes(Buffer.from("private-token")));
    await h.host.dispose();
    const next = await fixture(h.directory);
    try {
      assert.equal((await next.request("sources.list")).value[0].id, "custom");
      assert.equal((await next.request("sources.remove", { id: "custom" })).ok, true);
      assert.equal((await next.request("sources.list")).value.length, 0);
    } finally { await next.host.dispose(); }
  } finally { await h.host.dispose(); await fs.rm(h.directory, { recursive: true, force: true }); }
});

test("room publishes 51 real tracks in bounded deltas, cancellation routes progress, reload disables", async () => {
  const h = await fixture();
  try {
    const tracks = Array.from({ length: 51 }, (_, i) => ({ id: `id${i}`, title: `Title ${i}`, artist: "Artist", duration: 120 }));
    assert.equal((await h.request("room.enable")).ok, true);
    const snapshot = (await h.request("room.publish", { tracks })).value;
    assert.equal(snapshot.queue.length, 51); assert.equal(snapshot.seq, 3);
    assert(h.events.some(event => event.value.type === "room.state"));
    assert.equal((await h.request("room.command", { command: { type: "select", index: 1, expectedSeq: snapshot.seq } })).value.playback.index, 1);
    const pending = h.request("integrations.import", { id: "job", url: "https://open.spotify.com/playlist/example", market: "TW" });
    await new Promise(resolve => setImmediate(resolve));
    assert(h.events.some(event => event.value.type === "integrations.importProgress" && event.value.payload.id === "job"));
    await h.request("integrations.cancelImport", { id: "job" });
    assert.equal((await pending).value.status, "cancelled");
    h.contents.emit("did-start-navigation", {}, "file:///app", false, true);
    await new Promise(resolve => setTimeout(resolve, 20));
    assert.equal((await h.request("room.status")).value.enabled, false);
    assert.throws(() => roomTracks([{ id: "local", local: true, durationSeconds: 100 }]));
    for (const language of ["zh-TW", "zh-CN", "ja", "ko"]) assert.notEqual(translate("Sources", language), "Sources");
  } finally { await h.host.dispose(); await fs.rm(h.directory, { recursive: true, force: true }); }
});

test("real modules mount in browser; queue controls invoke playback; five languages fit", async () => {
  const { chromium } = require("playwright-core");
  const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true });
  const h = await fixture();
  try {
    const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    await page.setContent('<main><section id="settingsView"><div class="settings-grid"></div></section><section id="queuePane"></section><audio id="audio"></audio></main>');
    await page.exposeFunction("featureRequest", (value) => h.request(value.type, value.payload));
    h.contents.send = (_channel, event) => { void page.evaluate(value => window.featureEvent?.(value), event).catch(() => {}); };
    await page.evaluate(() => { window.metro = { featureRequest: window.featureRequest, onFeatureEvent: fn => { window.featureEvent = fn; return () => { window.featureEvent = null; }; } }; });
    for (const file of ["listeningTools", "sourceTools", "togetherTools", "integrationTools", "featureHost"]) {
      await page.addStyleTag({ path: path.join(__dirname, `../src/renderer/${file}.css`) });
      await page.addScriptTag({ path: path.join(__dirname, `../src/renderer/${file}.js`) });
    }
    await page.evaluate(async () => {
      window.state = { queue: [{ id: "a", title: "Alpha", artist: "Artist", durationSeconds: 120 }, { id: "b", title: "Beta", artist: "Artist", durationSeconds: 120 }], currentIndex: 0, settings: { language: "en" } };
      state.currentTrack = state.queue[0]; window.played = []; window.controls = [];
      let position = 0;
      const storage = { getItem: () => null, setItem: () => {} };
      window.host = AuralaneFeatureHost.init({ state, els: { audio: document.querySelector("audio"), queuePane: document.querySelector("#queuePane") }, storage,
        playTrack: async track => { played.push(track.id); state.currentTrack = track; }, persistQueue: async () => true,
        renderQueue: () => {}, renderNow: () => {}, getAccountId: () => "guest", toast: message => { window.lastToast = message; },
        playback: { getPosition: () => position, seek: async value => { position = value; }, play: async () => { controls.push("play"); }, pause: async () => { controls.push("pause"); } }
      }); await host.ready;
    });
    assert.equal(await page.evaluate(() => Object.keys(host.modules).length), 5);
    await page.locator("details").filter({ has: page.locator("summary", { hasText: "Listen Together" }) }).locator("summary").click();
    await page.getByRole("button", { name: "Enable", exact: true }).click();
    await page.waitForFunction(() => document.querySelector(".together-tools output").textContent.includes("Token:"));
    assert.equal((await h.request("room.state")).value.queue.length, 2);
    await page.locator(".together-tools li").nth(1).getByRole("button", { name: "Select", exact: true }).click();
    await page.waitForFunction(() => played.includes("b"));
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await page.waitForFunction(() => controls.includes("play"));
    await page.evaluate(() => host.showVersions(state.currentTrack));
    await page.waitForFunction(() => document.querySelector(".feature-host-versions .st-versions").hidden === false);
    for (const language of ["en", "zh-TW", "zh-CN", "ja", "ko"]) {
      await page.evaluate(async language => { state.settings.language = language; await host.refresh(); }, language);
      for (const width of [390, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        assert(await page.locator(".feature-host").first().evaluate(el => el.scrollWidth <= el.clientWidth + 1), `${language} ${width}`);
      }
    }
    await page.evaluate(() => {
      const metadata = document.createElement("strong"); metadata.textContent = "Sources";
      const details = document.createElement("div"); details.className = "st-details"; details.append(metadata);
      document.querySelector(".source-tools").append(details);
    });
    await page.waitForTimeout(30);
    assert.equal(await page.locator(".source-tools .st-details strong").last().textContent(), "Sources");
    await page.screenshot({ path: path.join(os.tmpdir(), "auralane-feature-host.png"), fullPage: true });
    await page.evaluate(() => host.dispose()); assert.equal(await page.locator(".feature-host").count(), 0);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); await h.host.dispose(); await fs.rm(h.directory, { recursive: true, force: true }); }
});
