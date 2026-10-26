const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require("playwright-core");

(async () => {
  const browser = await chromium.launch({ executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent('<html lang="en"><body><div id="settingsView"><nav id="settingsCategoryNav"><button class="active" data-settings-category="playback">Playback</button></nav><div class="settings-grid"></div></div><audio id="audio"></audio></body></html>');
    await page.addStyleTag({ path: path.join(__dirname, "../src/renderer/styles.css") });
    await page.addStyleTag({ path: path.join(__dirname, "../src/renderer/playback-diagnostics.css") });
    await page.evaluate(() => {
      window.metro = { onPlaybackDiagnostic: callback => { window.diagnosticEvent = callback; return () => {}; }, copyText: async text => { window.copiedDiagnostic = text; } };
    });
    for (const file of ["playback-diagnostics-model.js", "playback-diagnostics.js"]) {
      await page.addScriptTag({ path: path.join(__dirname, "../src/renderer", file) });
    }
    await page.evaluate(() => {
      window.diagnosticEvent({ phase: "start", id: 1, videoId: "a" });
      window.diagnosticEvent({ phase: "resolved", id: 1, videoId: "a", hasStream: true, client: "WEB", itag: 251, mimeType: "audio/webm; codecs=opus", bitrate: 128000, resolutionMs: 125 });
      for (let i = 0; i < 12; i++) window.diagnosticEvent({ kind: "lyrics", providers: ["NetEase"], candidateCount: 2, elapsedMs: 20, errors: [{ provider: "LRCLIB", message: "https://secret.test/token=private" }] });
    });
    assert.equal(await page.locator(".playback-diagnostic-history li").count(), 8);
    assert((await page.locator("#playbackDiagnostics").innerText()).includes("128 kbps"));
    assert(!(await page.locator("#playbackDiagnostics").innerText()).includes("secret.test"));
    for (const [lang, title] of [["en", "Playback diagnostics"], ["zh-Hant", "播放診斷"], ["zh-Hans", "播放诊断"], ["ja", "再生診断"], ["ko", "재생 진단"]]) {
      await page.evaluate(lang => { document.documentElement.lang = lang; }, lang);
      await page.waitForFunction(title => document.querySelector("#playbackDiagnostics h2").textContent === title, title);
      for (const width of [390, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        assert(await page.locator("#playbackDiagnostics").evaluate(card => card.scrollWidth <= card.clientWidth + 1), `${lang} at ${width}px overflows`);
      }
    }
    await page.evaluate(() => { document.documentElement.lang = "en"; });
    await page.getByRole("button", { name: "Copy diagnostics", exact: true }).click();
    assert(await page.evaluate(() => JSON.parse(window.copiedDiagnostic).lyricsHistory.length === 8));
    await page.screenshot({ path: path.join(require("node:os").tmpdir(), "auralane-playback-diagnostics.png"), fullPage: true });
    await page.evaluate(() => window.auralanePlaybackDiagnostics.dispose());
    assert.equal(await page.locator("#playbackDiagnostics").count(), 0);
    console.log("Playback diagnostics: real-browser UI, five languages, 390/1280px layout, bounded lyrics, copy, and cleanup passed.");
  } finally { await browser.close(); }
})().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1); });
