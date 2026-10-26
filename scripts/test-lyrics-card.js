"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const os = require("node:os");
test("lyrics card editor previews layouts and copies an origin-clean PNG in Electron", { timeout: 90000 }, async () => {
  const { _electron } = require("playwright-core");
  const env = { ...process.env }; delete env.ELECTRON_RUN_AS_NODE;
  const app = await _electron.launch({ executablePath: require("electron"), args: [".", "--auralane-preview"], cwd: path.join(__dirname, ".."), env, timeout: 60000 });
  try {
    const page = await app.firstWindow(); const errors = []; page.on("pageerror", e => errors.push(e.message));
    await page.waitForFunction(() => window.AuralaneLyricsCard && typeof state !== "undefined" && state.queueHydrated, null, { timeout: 60000 });
    await page.evaluate(() => {
      state.playing = false; els.audio.pause();
      state.settings.language = "zh-TW";
      state.currentTrack = { id: "card-test", title: "Auralane Preview", artist: "Auralane" };
      state.lyrics = { found: true, lines: Array.from({ length: 12 }, (_, i) => ({ text: i ? `Lyric line ${i + 1}` : "A quiet moment in the music" })) };
      state.activeLyricIndex = 0; state.lyricsShareSelection = new Set();
      return shareLyricsCard();
    });
    const dialog = page.locator(".lyrics-card-dialog"); await dialog.waitFor({ state: "visible" });
    assert.equal(await dialog.locator('.lyrics-card-lines input:checked').count(), 2);
    await dialog.getByRole("button", { name: "方形卡片", exact: true }).click();
    assert.deepEqual(await dialog.locator("canvas").evaluate(c => [c.width, c.height]), [1080, 1080]);
    await dialog.getByLabel("背景", { exact: true }).fill("#30575a");
    assert.equal(await dialog.locator("canvas").evaluate(c => c.getContext("2d").getImageData(0, 0, 1, 1).data[0]), 48);
    // A hostile remote artwork URL on the track cannot taint a text-only card.
    await page.evaluate(() => { state.currentTrack.thumbnail = "https://invalid.example/remote.jpg"; });
    await dialog.getByRole("button", { name: "複製圖片", exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.lyrics-card-status').textContent === "圖片已複製");
    const image = await app.evaluate(async ({ clipboard, nativeImage }) => {
      const items = await clipboard.read();
      const item = items.find(item => item.types.includes("image/png"));
      const png = await item.getType("image/png");
      return nativeImage.createFromBuffer(Buffer.from(await png.arrayBuffer())).getSize();
    });
    assert.equal(image.width, 1080); assert.equal(image.height, 1080);
    await dialog.getByRole("button", { name: "直式海報", exact: true }).click();
    assert.deepEqual(await dialog.locator("canvas").evaluate(c => [c.width, c.height]), [1080, 1350]);
    const inputs = dialog.locator('.lyrics-card-lines input');
    for (let i = 2; i < 8; i++) await inputs.nth(i).check();
    assert.equal(await inputs.nth(8).isDisabled(), true);
    await page.evaluate(() => { state.lyrics = { found: true, lines: [{ text: "A different song" }] }; });
    assert.equal(await dialog.locator('.lyrics-card-lines input').count(), 12);
    await page.screenshot({ path: path.join(os.tmpdir(), "auralane-lyrics-card-editor.png") });
    await page.evaluate(() => { document.documentElement.dataset.colorScheme = "light"; });
    assert.equal(await dialog.evaluate(e => getComputedStyle(e).backgroundColor), "rgb(250, 250, 253)");
    await page.screenshot({ path: path.join(os.tmpdir(), "auralane-lyrics-card-light.png") });
    await page.setViewportSize({ width: 640, height: 720 });
    const bounds = await dialog.evaluate(e => {
      const r = e.getBoundingClientRect();
      return { inside: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight, overflow: e.scrollWidth > e.clientWidth };
    });
    assert.deepEqual(bounds, { inside: true, overflow: false });
    await page.screenshot({ path: path.join(os.tmpdir(), "auralane-lyrics-card-small.png") });
    for (let i = 0; i < 8; i++) await inputs.nth(i).uncheck();
    assert.equal(await dialog.getByRole("button", { name: "複製圖片", exact: true }).isDisabled(), true);
    await page.keyboard.press("Escape"); assert.equal(await dialog.count(), 0);
    assert.deepEqual(errors, []);
  } finally { await app.close(); }
});
