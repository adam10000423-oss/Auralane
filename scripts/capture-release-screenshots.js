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
    await page.setViewportSize({ width:1600, height:1000 });
    const summary = await page.evaluate(async () => {
      els.audio.pause(); state.playing = false; state.settings.smartQueue = false;
      state.settings.lyricsAutoTranslate = false; state.settings.lyricsAutoRomanize = false;
      state.lyricsTranslationVisible = false; state.lyricsRomanizationVisible = false;
      state.settings.lyricColors = { enabled: true }; AuralaneLyricColors.apply(state.settings.lyricColors);
      applyInterfaceLanguage("en", false);
      state.settings.material = "glass"; state.settings.reduceTransparency = false;
      state.settings.glassTransparency = 55; state.workspaceAppearance.refresh();
      if (state.performanceTools.getSettings().artworkUrl) state.performanceTools.updateSettings({ video:true });
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
    const anonymize = () => page.evaluate(() => {
        els.loginLabel.textContent = "Demo";
        els.loginButton.setAttribute("aria-label", "Demo account"); els.loginButton.title = "Demo account";
        for (const avatar of [els.loginAvatar, els.accountAvatar]) { avatar.style.backgroundImage = "none"; avatar.textContent = "D"; }
        els.accountName.textContent = "Demo"; els.accountEmail.textContent = "";
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (node.parentElement?.closest("script,style")) continue;
          for (const value of [state.auth?.account?.email, state.auth?.account?.name]) if (value) node.textContent = node.textContent.replaceAll(value, "Demo");
        }
        const visible = document.body.innerText;
        for (const value of [state.auth?.account?.email, state.auth?.account?.name]) {
          if (value && visible.includes(value)) throw new Error("Personal account text remains visible");
        }
        if (/C:\\Users\\|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(visible)) throw new Error("Private path or email remains visible");
      });
    const capture = async name => {
      if (process.env.CAPTURE_ONLY && process.env.CAPTURE_ONLY !== name) return;
      await page.waitForTimeout(900);
      await anonymize();
      await page.screenshot({ path:path.join(directory, name) }); console.log("Captured anonymous", name);
    };
    if (process.argv.includes("--record-demo")) {
      await app.evaluate(async ({ BrowserWindow, desktopCapturer, session }) => {
        const w = BrowserWindow.getAllWindows().find(w => w.getTitle() === "Auralane");
        w.restore(); w.setPosition(0, 0); w.setContentSize(1280, 760); w.setResizable(false);
        w.setAlwaysOnTop(true); w.show(); w.focus(); w.webContents.setBackgroundThrottling(false);
        const id = w.getMediaSourceId();
        const sources = await desktopCapturer.getSources({ types:["window"], thumbnailSize:{ width:0, height:0 } });
        const source = sources.find(source => source.id === id);
        if (!source) throw new Error("Demo window capture source unavailable");
        session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
          if (request.frame?.url !== w.webContents.getURL()) return callback({});
          callback({ video:source });
        });
      });
      await page.setViewportSize({ width:1280, height:760 });
      await anonymize();
      const media = await page.evaluate(() => {
        const video = document.querySelector('#mediaBackground video');
        if (!video || video.hidden || video.readyState < 2) throw new Error("Background video is not ready");
        return { paused:video.paused, width:video.videoWidth, height:video.videoHeight };
      });
      if (media.paused) throw new Error("Background video is paused");
      const bytes = await page.evaluate(async () => {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video:{ frameRate:{ ideal:30, max:30 } }, audio:false });
        try {
          const recorder = new MediaRecorder(stream, { mimeType:"video/webm;codecs=vp8", videoBitsPerSecond:8000000 }), chunks = [];
          recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
          await new Promise((resolve, reject) => {
            recorder.onstop = resolve; recorder.onerror = event => reject(new Error(event.error?.message || "Screen recording failed"));
            recorder.start(500); setTimeout(() => recorder.stop(), 12000);
          });
          return Array.from(new Uint8Array(await new Blob(chunks, { type:"video/webm" }).arrayBuffer()));
        } finally { stream.getTracks().forEach(track => track.stop()); }
      });
      const fs = require("node:fs/promises"), os = require("node:os");
      const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "auralane-video-")), webm = path.join(temporary, "capture.webm");
      await fs.writeFile(webm, Buffer.from(bytes));
      require("node:child_process").execFileSync(process.env.FFMPEG_PATH || "ffmpeg", ["-y", "-hide_banner", "-loglevel", "warning", "-i", webm, "-vf", "fps=30,scale=1280:-2:flags=lanczos", "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", path.join(directory, "15-liquid-glass-demo.mp4")], { windowsHide:true, stdio:"pipe" });
      console.log("Recorded anonymous Auralane window directly (12 seconds, 30 FPS target)");
      return;
    }
    if (process.argv.includes("--original-gallery")) {
      await page.evaluate(async () => {
        state.performanceTools.updateSettings({ video:false });
        const candidates = await window.metro.searchArtists("OneRepublic");
        const artist = candidates.find(a => /OneRepublic|共和世代/i.test(a.title)) || candidates[0];
        if (!artist?.browseId) throw new Error("Public artist unavailable");
        const result = await window.metro.artist({ browseId:artist.browseId, params:artist.params || null });
        window.releaseArtist = artist; window.releaseArtistResult = result;
        renderArtist(result, artist); switchView("artist"); toast("OneRepublic artist page");
      });
      await capture("16-artist-session.png");
      await page.evaluate(() => window.metro.closeMiniPlayer());
      const miniOpened = app.waitForEvent("window", { timeout:15000 });
      await page.evaluate(() => window.metro.openMiniPlayer(miniPlayerStateSnapshot()));
      const mini = await miniOpened;
      await mini.waitForURL('**/mini.html');
      await mini.waitForFunction(() => document.querySelector('#miniTitle')?.textContent === 'Counting Stars');
      await mini.screenshot({ path:path.join(directory,"17-mini-player.png"), omitBackground:true });
      await page.evaluate(() => window.metro.closeMiniPlayer());
      await page.evaluate(async () => {
        const index=state.activeLyricIndex;
        if(index<0)throw new Error("No active lyric for desktop preview");
        const translated=await window.metro.translateLyrics([state.lyrics.lines[index]],{targetLanguage:'zh-TW',sourceLanguage:'auto'});
        const lines=state.lyrics.lines.map(()=>({text:''}));lines[index]=translated.lines[0];
        state.lyricsTranslation={...translated,lines};state.lyricsTranslationVisible=true;
      });
      await app.evaluate(({BrowserWindow}) => { for(const w of BrowserWindow.getAllWindows())if(w.webContents.getURL().endsWith('/lyrics.html'))w.close(); });
      const lyricsOpened = app.waitForEvent("window", { timeout:15000 });
      await page.evaluate(() => toggleLyricWidget());
      const lyricsWindow = await lyricsOpened;
      await lyricsWindow.waitForURL('**/lyrics.html');
      await lyricsWindow.waitForFunction(() => !['Auralane','Counting Stars'].includes(document.querySelector('#currentLine')?.textContent));
      await lyricsWindow.screenshot({ path:path.join(directory,"18-desktop-lyrics.png"), omitBackground:true });
      await page.evaluate(async () => { await toggleLyricWidget(); const result = await window.metro.home({}); renderHome(result); switchView('home'); toast('Home loaded'); });
      await capture("19-home.png");
      await page.evaluate(async () => {
        const result = await window.metro.search({ query:'OneRepublic', filter:'playlists' });
        const albums = (releaseArtistResult.sections || []).flatMap(section => section.items || []).filter(item => item.type === 'album');
        state.libraryFilter='all'; state.libraryQuery=''; state.likedData={tracks:state.queue};
        renderLibrary({ playlists:result.items || result.playlists || [], albums, artists:[releaseArtist], songs:state.queue, podcasts:[], downloads:[] });
        els.libraryStatus.textContent='Demo library using public collections'; switchView('library'); toast('Demo library');
      });
      await capture("20-library.png");
      await page.evaluate(() => { switchView('settings'); });
      await page.locator('.workspace-settings-tabs').getByRole('button',{name:'General',exact:true}).click();
      await page.locator('#githubUpdatesCard').evaluate(e => e.scrollIntoView({block:'center'}));
      await anonymize();
      await page.locator('#githubUpdatesCard').screenshot({path:path.join(directory,"21-github-updates.png")});
      console.log("Captured original README gallery with current anonymous UI");
      return;
    }
    await capture("10-liquid-glass-background.png");
    await page.evaluate(() => {
      state.performanceTools.updateSettings({ video:false });
      state.settings.lyricsFullscreenBackground = "theme";
      setLyricsExpanded(true);
    });
    await capture("11-focus-lyrics.png");
    await page.evaluate(() => { state.lyricsShareSelection = new Set([releaseScreenshotIndex, releaseScreenshotIndex + 1]); return shareLyricsCard(); });
    await capture("12-lyric-card-editor.png");
    await page.evaluate(() => { document.querySelector('.lyrics-card-dialog')?.close(); setLyricsExpanded(false); state.settings.material = "standard"; state.workspaceAppearance.refresh(); AuralaneLyricColors.apply({ enabled:false }); document.documentElement.dataset.colorScheme = "light"; });
    await capture("13-standard-light.png");
    await page.evaluate(() => { state.settings.material = "glass"; document.documentElement.dataset.colorScheme = "dark"; state.workspaceAppearance.refresh(); switchView("settings"); });
    await page.locator('.workspace-settings-tabs').getByRole('button', { name:'Appearance', exact:true }).click();
    await capture("14-settings-appearance.png");
    await page.evaluate(() => { state.playing = false; els.audio.pause(); });
  } finally { await app.close(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
