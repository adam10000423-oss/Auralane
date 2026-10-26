"use strict";
const path = require("node:path");
const { _electron } = require("playwright-core");
async function main() {
  const env = { ...process.env }; delete env.ELECTRON_RUN_AS_NODE;
  const app = await _electron.launch({ executablePath: require("electron"), args: [".", "--auralane-preview"], cwd: path.join(__dirname, ".."), env, timeout: 60000 });
  try {
    const page = await app.firstWindow();
    await page.waitForFunction(() => typeof state !== "undefined" && state.queueHydrated && state.performanceTools && state.workspaceAppearance, null, { timeout: 60000 });
    await app.evaluate(({ BrowserWindow }) => { const w = BrowserWindow.getAllWindows().find(w => w.getTitle() === "Auralane"); w.webContents.setZoomFactor(1); w.setContentSize(1600, 1000); });
    const summary = await page.evaluate(async () => {
      els.audio.pause(); state.playing = false; state.settings.smartQueue = false;
      state.settings.lyricsAutoTranslate = false; state.settings.lyricsAutoRomanize = false;
      state.lyricsTranslationVisible = false; state.lyricsRomanizationVisible = false;
      state.settings.lyricColors = { enabled: true }; AuralaneLyricColors.apply(state.settings.lyricColors);
      applyInterfaceLanguage("en", false);
      state.settings.material = "glass"; state.settings.reduceTransparency = false;
      state.settings.glassTransparency = 55; state.workspaceAppearance.refresh();
      document.documentElement.dataset.colorScheme = "dark";
      applyThemeColor([76, 173, 189], false);
      const result = await window.metro.search({ query: "Counting Stars OneRepublic", filter: "songs" });
      const tracks = tracksFromResult(result);
      const track = tracks.find(t => /^Counting Stars$/i.test(t.title) && /OneRepublic/i.test(t.artist || t.subtitle || "")) || tracks[0];
      if (!track) throw new Error("No live search results for screenshot");
      window.releaseScreenshotTrack = track;
      state.currentTrack = track; state.queue = tracks.slice(0, 8); renderNow(); renderQueue();
      await playTrack(track);
      els.audio.pause(); state.playing = false;
      state.searchQuery = "Counting Stars OneRepublic"; state.searchFilter = "songs";
      els.searchInput.value = state.searchQuery; renderSearchResults(result, "songs"); switchView("search"); switchSidePanel("lyrics");
      const lyrics = await window.metro.lyrics(track, { providers: ["lyricsplus", "kugou", "lrclib"], includeYouTube: false });
      if (!lyrics?.found) throw new Error("Live lyrics unavailable for screenshot");
      window.releaseScreenshotLyrics = lyrics; renderLyrics(lyrics);
      const index = Math.max(0, lyrics.lines.findIndex(l => /dreaming about/i.test(l.text)));
      window.releaseScreenshotIndex = index;
      els.audio.currentTime = Number(lyrics.lines[index]?.time || 0) + .6;
      updateProgress();
      state.lyricsAutoSync = true; updateLyricsActive();
      scrollLyricIntoView(state.lyricsLineElements[index], { instant: true });
      toast(`${tracks.length} search results`);
      return { title:track.title, provider:lyrics.provider, lines:lyrics.lines.length, background:state.performanceTools.getSettings().video, backgroundName:state.performanceTools.getSettings().artworkName };
    });
    console.log("Live screenshot data:", JSON.stringify(summary));
    const directory = path.join(__dirname, "../docs/screenshots");
    const capture = async name => {
      await page.waitForTimeout(900);
      await page.evaluate(() => {
        els.loginLabel.textContent = "Demo";
        els.loginButton.setAttribute("aria-label", "Demo account"); els.loginButton.title = "Demo account";
        for (const avatar of [els.loginAvatar, els.accountAvatar]) { avatar.style.backgroundImage = "none"; avatar.textContent = "D"; }
        els.accountName.textContent = "Demo"; els.accountEmail.textContent = "";
        const visible = document.body.innerText;
        for (const value of [state.auth?.account?.email, state.auth?.account?.name]) {
          if (value && visible.includes(value)) throw new Error("Personal account text remains visible");
        }
        if (/C:\\Users\\|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(visible)) throw new Error("Private path or email remains visible");
      });
      await page.screenshot({ path:path.join(directory, name) }); console.log("Captured anonymous", name);
    };
    await capture("10-liquid-glass-background.png");
    await page.evaluate(() => { state.settings.lyricsFullscreenBackground = "custom"; setLyricsExpanded(true); });
    await capture("11-focus-custom-background.png");
    await page.evaluate(() => { state.lyricsShareSelection = new Set([releaseScreenshotIndex, releaseScreenshotIndex + 1]); return shareLyricsCard(); });
    await capture("12-lyric-card-editor.png");
    await page.evaluate(() => { document.querySelector('.lyrics-card-dialog')?.close(); setLyricsExpanded(false); state.settings.material = "standard"; state.workspaceAppearance.refresh(); document.documentElement.dataset.colorScheme = "light"; });
    await capture("13-standard-light.png");
    await page.evaluate(() => { state.settings.material = "glass"; document.documentElement.dataset.colorScheme = "dark"; state.workspaceAppearance.refresh(); switchView("settings"); });
    await page.locator('.workspace-settings-tabs').getByRole('button', { name:'Appearance', exact:true }).click();
    await capture("14-settings-appearance.png");
    await page.evaluate(() => { state.playing = false; els.audio.pause(); });
  } finally { await app.close(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
