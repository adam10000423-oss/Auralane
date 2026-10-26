"use strict";
const { test } = require("node:test"), assert = require("node:assert/strict"), path = require("node:path");
test("Electron keeps completed lyric pixels during Session auto-scroll and middle-pane scroll", { timeout: 90000 }, async () => {
  const { _electron } = require("playwright-core"), env = { ...process.env }; delete env.ELECTRON_RUN_AS_NODE;
  const app = await _electron.launch({ executablePath: require("electron"), args: [".", "--auralane-preview"], cwd: path.join(__dirname, ".."), env, timeout: 60000 });
  try {
    const page = await app.firstWindow();
    await page.waitForFunction(() => typeof state !== "undefined" && state.queueHydrated && window.AuralaneLyricFill, null, { timeout: 60000 });
    await page.evaluate(() => {
      els.audio.pause(); state.playing = false; state.settings.lyricsAutoTranslate = false; state.settings.lyricsAutoRomanize = false;
      switchSidePanel("lyrics");
      renderLyrics({ found: true, synced: true, provider: "Pixel test", title: "Stability", lines: [{ time: 0, text: "Stable foreground", words: [{ text: "Stable", start: 0, end: 1 }, { text: "foreground", start: 1, end: 80 }] }] });
      const line = els.lyricsList.querySelector('.lyric-line');
      line.style.cssText = 'opacity:1!important;background:#101010!important;filter:none!important;transition:none!important;font-size:40px!important';
      AuralaneLyricColors.apply({ enabled: true, active: '#ffffff', passed: '#ffffff', upcoming: '#808080' });
      window.pixelWords = [...line.querySelectorAll('.lyric-fluid-word')];
      window.pixelAudio = { paused: false, seeking: false, readyState: 4, playbackRate: 1 };
      pixelWords[0].classList.add('passed');
      AuralaneLyricFill.update(pixelWords[0], 2, pixelAudio, true);
      window.pixelStart = performance.now();
      window.pixelTick = setInterval(() => AuralaneLyricFill.update(pixelWords[1], 2 + (performance.now() - pixelStart) / 1000, pixelAudio, true), 32);
      els.lyricsList.style.paddingTop = '80px'; els.rightPanel.scrollTop = 0;
    });
    const word = page.locator('#lyricsList .lyric-fluid-word').first(), samples = [];
    for (let i = 0; i < 48; i++) {
      await page.evaluate(i => {
        document.querySelector('.main').scrollTop = i % 2 ? 400 : 0;
        state.lyricsProgrammaticScroll = true;
        els.rightPanel.classList.remove('scrollbar-active');
        els.rightPanel.scrollTop = i % 2 ? 15 : 0;
        document.body.dataset.material = i % 8 < 4 ? 'glass' : 'standard';
      }, i);
      const png = await word.screenshot();
      if (i === 0) {
        require('node:fs').writeFileSync(path.join(require('node:os').tmpdir(), 'auralane-solid-lyric-pixel.png'), png);
      }
      const count = await app.evaluate(({ nativeImage }, bytes) => {
        const image = nativeImage.createFromBuffer(Buffer.from(bytes)), pixels = image.toBitmap();
        let white = 0;
        for (let i = 0; i < pixels.length; i += 4) if (pixels[i] > 220 && pixels[i + 1] > 220 && pixels[i + 2] > 220) white++;
        return white;
      }, [...png]);
      samples.push(count);
      assert.equal(await page.locator('#rightPanel').evaluate(e => e.classList.contains('scrollbar-active')), false);
      await page.waitForTimeout(150);
    }
    await page.evaluate(() => clearInterval(pixelTick));
    const low = Math.min(...samples), high = Math.max(...samples);
    console.log(`Completed-word pixel samples: ${samples.length}, min=${low}, max=${high}`);
    assert.ok(low > 100, "Completed glyphs remain visibly painted in every captured frame");
    assert.ok(low / high > .85, "Completed glyph coverage does not collapse during scroll/repaint");
    assert.equal(await word.evaluate(e => getComputedStyle(e).backgroundImage), "none");
  } finally { await app.close(); }
});
