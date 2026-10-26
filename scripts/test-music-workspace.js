"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const http = require("node:http");
const os = require("node:os");
const M = require("../src/renderer/musicWorkspaceModel");
const A = require("../src/renderer/automix");
const song = { id: "song", title: "Counting Stars", artist: "OneRepublic", durationSeconds: 240 };
test("Replay aggregates real credited seconds, artists and plays inside calendar periods", () => {
  const d = M.blank(), at = new Date(2026, 9, 24, 12).getTime();
  for (let i = 0; i < 70; i++) M.credit(d, song, 1, at + i * 1000, i === 59);
  M.credit(d, song, 600, at); // Timeline seeks never create listening time.
  M.credit(d, { ...song, id: "old" }, 1, new Date(2025, 9, 24).getTime());
  const result = M.replay(d, "week", at);
  assert.equal(result.seconds, 70); assert.equal(result.songs[0].plays, 1); assert.equal(result.artists[0].name, "OneRepublic");
  assert.equal(result.from, "2026-10-19"); assert.equal(result.until, "2026-10-26");
});
test("smart rules match all or any, never treat unknown duration/status as zero, sort and limit deterministically", () => {
  const d = M.blank(), songs = [song, { id: "b", title: "Unknown", artist: "Other" }, { ...song, id: "c", title: "Alpha", durationSeconds: 90 }];
  const rule = { name: "Short favorites", mode: "all", conditions: [{ field: "liked", value: true }, { field: "duration", op: "max", value: 100 }], sort: "title", limit: 10 };
  assert.deepEqual(M.evaluate(rule, songs, d, { liked: () => true }).map(v => v.id), ["c"]);
  assert.equal(M.evaluate(rule, songs, d).length, 0);
  rule.mode = "any"; rule.limit = 1; assert.equal(M.evaluate(rule, songs, d, { liked: () => true })[0].id, "c");
  assert.equal(M.duration({ duration: "3:30" }), 210); assert.equal(M.duration({}), null);
  assert.throws(() => M.evaluate({ ...rule, conditions: [{ field: "invalid", value: 1 }] }, songs, d));
});
test("history-based smart rules reuse real statistics, deduplicate tracks and keep stable title tie-breaks", () => {
  const d = M.blank(), at = Date.now(); M.credit(d, song, 1, at, true);
  const rule = { name: "Played", mode: "all", conditions: [{ field: "plays", op: "min", value: 1 }, { field: "recent", op: "max", value: 7 }], sort: "plays", limit: 100 };
  assert.equal(M.evaluate(rule, [song, song], d, { now: at }).length, 1);
  assert.equal(M.evaluate(rule, [song], d, { now: at + 8 * 86400000 }).length, 0);
});
test("Automix plans real beat offsets, bounded tempo changes and equal-power curves; uncertain evidence falls back", () => {
  const a = { bpm: 120, offset: .15, trusted: true }, b = { bpm: 118, offset: .2, trusted: true };
  const result = A.plan(a, b, 200, 8); assert.equal(result.kind, "smart"); assert.ok(Math.abs(result.rate - 120 / 118) < .001);
  assert.ok(Math.abs((result.start - a.offset) / .5 - Math.round((result.start - a.offset) / .5)) < .001);
  assert.equal(A.plan(a, { ...b, bpm: 90 }, 200, 8).kind, "standard");
  assert.equal(A.plan(a, { ...b, trusted: false }, 200, 8).kind, "standard");
  const up = A.curve(true), down = A.curve(false); for (let i = 0; i < up.length; i++) assert.ok(Math.abs(up[i] ** 2 + down[i] ** 2 - 1) < 1e-6);
});
function wav(seconds = 48, clicks = false) {
  const rate = 22050, data = Buffer.alloc(44 + seconds * rate * 2);
  data.write("RIFF"); data.writeUInt32LE(data.length - 8, 4); data.write("WAVEfmt ", 8); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22); data.writeUInt32LE(rate, 24); data.writeUInt32LE(rate * 2, 28); data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34); data.write("data", 36); data.writeUInt32LE(data.length - 44, 40);
  for (let i = 0; i < seconds * rate; i++) { const t = i / rate, phase = t % .5; data.writeInt16LE(Math.round((clicks ? (phase < .06 ? .9 : 0) : Math.sin(t * Math.PI * 2 * 440) * .01) * 32767), 44 + i * 2); }
  return data;
}
test("real browser: rule preview/save/account isolation, Replay, five languages and responsive screenshots", async () => {
  const { chromium } = require("playwright-core"), audio = wav(), clicks = wav(48, true);
  const server = http.createServer(async (req, res) => {
    if (["/audio.wav", "/click.wav"].includes(req.url?.split("?")[0])) { const data = req.url.startsWith("/click") ? clicks : audio; res.writeHead(200, { "Content-Type": "audio/wav", "Content-Length": data.length, "Accept-Ranges": "bytes" }); res.end(data); return; }
    try { const filename = path.basename(new URL(req.url, "http://localhost").pathname); const file = await fs.readFile(path.join(__dirname, "../src/renderer", filename)); res.setHeader("Content-Type", filename.endsWith(".js") ? "application/javascript; charset=utf-8" : "text/css; charset=utf-8"); res.end(file); }
    catch { res.setHeader("Content-Type", "text/html; charset=utf-8"); res.end("<!doctype html><meta charset=utf-8><title>Workspace Test</title>"); }
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true, args: ["--autoplay-policy=no-user-gesture-required"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } }); const errors = []; page.on("pageerror", e => errors.push(e.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.setContent('<button class="nav" data-view="replay"><span class="nav-text">Replay</span></button><section id="replayView"></section><section id="syncedPlaylistsSection"></section><audio id="audio"></audio>');
    for (const file of ["styles.css", "musicWorkspace.css"]) await page.addStyleTag({ url: "/" + file });
    for (const file of ["musicWorkspaceModel.js", "musicWorkspace.js", "audio-tools.generated.js", "automix.js"]) await page.addScriptTag({ url: "/" + file });
    await page.evaluate(async song => {
      const old = await new Promise((resolve, reject) => { const r = indexedDB.open("auralane-workspace", 1); r.onupgradeneeded = () => r.result.createObjectStore("accounts"); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
      const legacy = AuralaneWorkspaceModel.blank(); AuralaneWorkspaceModel.credit(legacy, song, 5, Date.now(), false);
      await new Promise((resolve, reject) => { const tx = old.transaction("accounts", "readwrite"); tx.objectStore("accounts").put(legacy, "legacy"); tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); }); old.close();
      window.owner = "a"; window.songs = [song, { ...song, id: "b", title: "Without You", artist: "Avicii" }]; window.state = { activeView: "playlists", playlistsFilter: "all", settings: { language: "en" } };
      const icon = '<svg viewBox="0 0 24 24"><path d="M12 4v16M4 12h16"/></svg>';
      window.workspace = await AuralaneMusicWorkspace.init({ state, audio: document.querySelector("audio"), getAccountId: () => owner, getTracks: () => songs, isLiked: () => true, isDownloaded: () => false, thumbnail: () => "", icon: () => icon,
        setIconButton: (b, _i, label) => { b.innerHTML = icon; b.setAttribute("aria-label", label); }, toast: message => { window.lastToast = message; }, playTracks: () => {}, queueTracks: () => {} });
    }, song);
    await page.getByRole("button", { name: "Create smart playlist", exact: true }).click(); await page.getByLabel("Name", { exact: true }).fill("Favorites");
    await page.getByRole("button", { name: "Preview", exact: true }).click(); assert.match(await page.locator(".workspace-preview").textContent(), /2 matches/);
    await page.getByRole("button", { name: "Save", exact: true }).click(); await page.waitForFunction(() => !document.querySelector("dialog").open);
    assert.equal(await page.locator(".workspace-playlist-card").count(), 1);
    await page.evaluate(async () => { owner = "b"; await workspace.account(); }); assert.equal(await page.locator(".workspace-playlist-card").count(), 0);
    await page.evaluate(async () => { owner = "a"; await workspace.account(); state.activeView = "replay"; for (let i = 0; i < 125; i++) workspace.onCredit(songs[0], 1, Date.now()); workspace.refresh(); });
    assert.equal(await page.evaluate(async () => {
      owner = "b"; const first = workspace.account(); owner = "a"; const second = workspace.account(); await Promise.all([first, second]); return workspace.getData().rules[0]?.name;
    }), "Favorites");
    assert.equal(await page.evaluate(async () => { owner = "legacy"; await workspace.account(); owner = "a"; await workspace.account(); owner = "legacy"; await workspace.account(); const seconds = workspace.getData().records.reduce((sum, r) => sum + r.seconds, 0); owner = "a"; await workspace.account(); return seconds; }), 5);
    assert.match(await page.locator(".workspace-replay-metrics").textContent(), /2m/);
    for (const lang of ["en", "zh-TW", "zh-CN", "ja", "ko"]) for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 }); await page.evaluate(lang => { state.settings.language = lang; workspace.refresh(); }, lang);
      const fit = await page.locator("#replayView").evaluate(el => ({ fits: el.scrollWidth <= el.clientWidth + 1, overflowing: [el,...el.querySelectorAll("*")].filter(n => n.scrollWidth > n.clientWidth + 1).map(n => `${n.tagName}.${n.className}:${n.clientWidth}/${n.scrollWidth}:${n.textContent.slice(0,60)}`) }));
      assert.equal(fit.fits, true, `${lang} ${width}: ${fit.overflowing.join(" | ")}`);
    }
    await page.screenshot({ path: path.join(os.tmpdir(), "auralane-replay-workspace.png"), fullPage: true });
    assert.equal(await page.locator("#replayView .replay-options summary").count(),0);
    await page.locator("#replayView .workspace-toolbar select").selectOption("csv");
    const downloaded = page.waitForEvent("download"); await page.locator("#replayView .workspace-toolbar .workspace-icon").click();
    const csvFile = await downloaded, csv = await fs.readFile(await csvFile.path(), "utf8");
    assert.match(csv, /song_id,title,artist,listening_seconds,plays/); assert.match(csv, /Counting Stars/); assert.match(csvFile.suggestedFilename(), /\.csv$/);
    assert.equal(await page.evaluate(async () => { const backup = await workspace.exportData(); await workspace.importData({ version: 1, accounts: [{ key: "a", data: AuralaneWorkspaceModel.blank() }] }); if (workspace.getData().rules.length) throw new Error("Import did not replace data"); await workspace.importData(backup); return workspace.getData().rules[0]?.name; }), "Favorites");
    const measured = await page.evaluate(async () => {
      const context = new OfflineAudioContext(1, 1, 24000), buffer = await context.decodeAudioData(await (await fetch("/click.wav")).arrayBuffer());
      const inputMax = buffer.getChannelData(0).reduce((a,b) => Math.max(a,b), 0);
      try { return await AuralaneBeatDetector.guess(buffer, 0, 14); }
      catch (error) { throw new Error(`${error.message}; input peak=${inputMax}, duration=${buffer.duration}, sampleRate=${buffer.sampleRate}`); }
    });
    assert.ok(Math.abs(measured.bpm - 120) < 2, JSON.stringify(measured));
    await page.evaluate(async () => {
      document.body.insertAdjacentHTML("beforeend", '<label class="settings-field"><input id="settingsCrossfade"></label><div class="player"></div>');
      const audio = document.querySelector("audio"), context = new AudioContext(), gain = context.createGain();
      context.createMediaElementSource(audio).connect(gain); gain.connect(context.destination); await context.resume();
      window.testGain = gain; window.testContext = context;
      state.currentTrack = songs[0]; state.playing = true; state.settings = { language: "en", automixMode: "standard", crossfadeSeconds: 2 };
      window.mixOptions = { state, audio, graph: () => ({ context, gain, destination: context.destination }), save: () => {}, syncSettings: () => {}, blocked: () => false, next: () => songs[1], resolve: async () => ({ streamUrl: new URL("/audio.wav?next=1", location.href).href }),
        play: async track => { state.currentTrack = track; audio.src = "/audio.wav?next=1"; audio.load(); await new Promise(r => audio.addEventListener("loadedmetadata", r, { once: true })); await audio.play(); return true; }
      }; window.mix = AuralaneAutomix.init(mixOptions);
      audio.src = "/audio.wav"; await audio.play(); audio.currentTime = 43.2;
    });
    await page.waitForTimeout(200); await page.evaluate(() => mix.tick());
    await page.waitForFunction(() => mix.getState().prepared);
    await page.evaluate(() => { window.mixTick = setInterval(() => mix.tick(), 80); });
    await page.waitForFunction(() => mix.isTransitioning());
    await page.waitForFunction(() => state.currentTrack.id === songs[1].id && !document.querySelector("audio").paused);
    await page.waitForTimeout(250);
    const blend = await page.evaluate(() => testGain.gain.value); assert.ok(blend > 0 && blend < 1, `Real incoming gain: ${blend}`);
    await page.waitForFunction(() => !mix.isTransitioning());
    assert.equal(await page.evaluate(() => testGain.gain.value), 1);
    await page.evaluate(async () => {
      clearInterval(mixTick); mix.destroy(); const audio = document.querySelector("audio"); audio.pause();
      state.settings.automixMode = "smart"; state.currentTrack = songs[0];
      mixOptions.resolve = async () => ({ streamUrl: new URL("/click.wav?next=1", location.href).href });
      mixOptions.play = async track => { state.currentTrack = track; audio.src = "/click.wav?next=1"; audio.load(); await new Promise(r => audio.addEventListener("loadedmetadata", r, { once: true })); await audio.play(); return true; };
      window.mix = AuralaneAutomix.init(mixOptions); audio.src = "/click.wav"; await audio.play(); audio.currentTime = 38;
    });
    await page.waitForTimeout(200); await page.evaluate(() => { mix.tick(); window.mixTick = setInterval(() => mix.tick(), 80); });
    await page.waitForFunction(() => mix.getState().prepared); assert.equal(await page.evaluate(() => mix.getState().kind), "smart");
    await page.waitForFunction(() => mix.getState().transitioning && mix.getState().phaseError !== null);
    await page.waitForTimeout(150);
    const phaseError = await page.evaluate(() => mix.getState().phaseError); assert.ok(phaseError !== null && phaseError < .12, `Measured beat phase error: ${phaseError}`);
    await page.evaluate(() => document.querySelector("audio").pause());
    await page.waitForFunction(() => !mix.isTransitioning() && Math.abs(testGain.gain.value - 1) < 1e-6);
    await page.evaluate(async () => { clearInterval(mixTick); mix.destroy(); await testContext.close(); });
    await page.evaluate(() => workspace.destroy()); assert.deepEqual(errors, []);
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
});
