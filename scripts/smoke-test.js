const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const vm = require("node:vm");
const { InnerTubeClient } = require("../src/main/innertube.legacy");
const { YouTube } = require("../src/main/innertube");
const { compareLyricsQuality, lyricsWordTimingQuality, neteaseYrcToLrc, parseLyrics, sanitizeTranslationResult, translationLooksDegenerate, ttmlToLrc } = require("../src/main/lyrics");
const { mergePlaybackSession } = require("../src/main/playbackSession");
const { mergeMacUpdateMetadata } = require("./merge-mac-update-metadata");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function JavaScriptFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return JavaScriptFiles(target);
    return entry.isFile() && entry.name.endsWith(".js") ? [target] : [];
  });
}

for (const file of JavaScriptFiles(path.join(root, "src"))) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  assert.equal(result.status, 0, `${path.relative(root, file)} failed syntax check:\n${result.stderr}`);
}

const indexHtml = read("src/renderer/index.html");
const appSource = read("src/renderer/app.js");
const stylesSource = read("src/renderer/styles.css");
const preloadSource = read("src/preload.js");
const mainSource = read("src/main/main.js");
const storeSource = read("src/main/store.js");
const lyricsSource = read("src/main/lyrics.js");
const generatedI18nSource = read("src/renderer/i18n.generated.js");

const i18nSandbox = { window: {} };
vm.runInNewContext(generatedI18nSource, i18nSandbox, { filename: "i18n.generated.js" });
const componentI18n = i18nSandbox.window.AURALANE_COMPONENT_I18N;
assert.ok(componentI18n, "Generated component translation dictionary is missing.");
const decodeHtml = (value) => String(value || "")
  .replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;|&#039;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&times;/g, "×")
  .replace(/&#\d+;/g, " ").replace(/\s+/g, " ").trim();
const interfaceSources = new Set();
for (const match of indexHtml.matchAll(/>([^<>]+)</g)) {
  const value = decodeHtml(match[1]);
  if (value && /[A-Za-z]/.test(value)) interfaceSources.add(value);
}
for (const match of indexHtml.matchAll(/(?:placeholder|title|aria-label)="([^"]+)"/g)) {
  const value = decodeHtml(match[1]);
  if (value && /[A-Za-z]/.test(value)) interfaceSources.add(value);
}
for (const match of appSource.matchAll(/>([^<>{}\n]+)</g)) {
  const value = decodeHtml(match[1]);
  if (!value || value.length > 180 || !/[A-Za-z]/.test(value) || /[=;`]|&&/.test(value)) continue;
  if (/^[A-Za-z_$][\w$.]*$/.test(value) && value.includes(".")) continue;
  interfaceSources.add(value);
}
for (const match of appSource.matchAll(/(?:placeholder|title|aria-label)=["']([^"'${}]+)["']/g)) {
  const value = decodeHtml(match[1]);
  if (value && value.length <= 180 && /[A-Za-z]/.test(value)) interfaceSources.add(value);
}
for (const language of ["en", "zh-TW", "zh-CN", "ja", "ko"]) {
  const missing = [...interfaceSources].filter((source) => !componentI18n[language]?.[source]);
  assert.deepEqual(missing, [], `${language} component translations missing: ${missing.join(" | ")}`);
}

const htmlIds = new Set([...indexHtml.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]));
const rendererIds = [...appSource.matchAll(/document\.getElementById\(["']([^"']+)["']\)/g)].map((match) => match[1]);
const missingIds = [...new Set(rendererIds.filter((id) => !htmlIds.has(id)))];
assert.deepEqual(missingIds, [], `Renderer references missing DOM ids: ${missingIds.join(", ")}`);

const invokedChannels = new Set([...preloadSource.matchAll(/ipcRenderer\.invoke\(["']([^"']+)["']/g)].map((match) => match[1]));
const handledChannels = new Set([
  ...[...mainSource.matchAll(/ipcMain\.handle\(["']([^"']+)["']/g)].map((match) => match[1]),
  ...[...mainSource.matchAll(/ipcMain\.on\(["']([^"']+)["']/g)].map((match) => match[1])
]);
const missingHandlers = [...invokedChannels].filter((channel) => !handledChannels.has(channel));
assert.deepEqual(missingHandlers, [], `Preload IPC channels without Main handlers: ${missingHandlers.join(", ")}`);

const guestClient = new InnerTubeClient({});
const guestHeaders = guestClient.authHeaders(true);
assert.equal(guestHeaders.Cookie, undefined, "Guest requests must not reuse account cookies.");
assert.equal(guestHeaders.Authorization, undefined, "Guest requests must not send account authorization.");
assert.equal(guestClient.context(true).user.onBehalfOfUser, undefined, "Guest requests must not use an account data sync id.");

const signedInClient = new InnerTubeClient({ cookie: "SAPISID=test-secret", dataSyncId: "sync-id" });
const signedInHeaders = signedInClient.authHeaders(true);
assert.match(signedInHeaders.Authorization, /^SAPISIDHASH /, "Signed-in requests should produce an authorization header.");
assert.equal(signedInClient.context(true).user.onBehalfOfUser, "sync-id");
assert.equal(typeof new YouTube({}).artistItems, "function", "YouTube facade must expose artist item pages.");

assert.match(mainSource, /function requireSignedIn\(\)/, "Main process must guard account mutations.");
assert.match(mainSource, /auralane-login-add-\$\{crypto\.randomUUID\(\)\}/, "Adding an account must use an isolated login session.");
assert.match(mainSource, /async function replacePlaybackLoginSession[\s\S]*?clearStorageData[\s\S]*?cookies\.set/, "Switching accounts must replace the web playback session.");
assert.match(mainSource, /ipcMain\.handle\("auth:switch-profile"[\s\S]*?replacePlaybackLoginSession\(profile\.cookie\)/, "Saved-account switching must also switch web playback credentials.");
assert.match(preloadSource, /switchAccountProfile:.*auth:switch-profile/, "The renderer must expose saved-account switching through preload.");
assert.match(indexHtml, /id="accountSwitcher"[\s\S]*?id="accountAddButton"[\s\S]*?id="accountManageButton"/, "The top bar must expose account switching and account management.");
assert.match(storeSource, /profiles:[\s\S]*?cookie: encodeSecret\(profile\.cookie/, "Every saved account cookie must be encrypted before it is written to disk.");
assert.doesNotMatch(indexHtml, /GitHub updates[\s\S]{0,80}new-badge/, "The GitHub updates heading must not carry a permanent New badge.");
assert.match(indexHtml, /id="sidebarReleaseNotice"[\s\S]*?id="sidebarReleaseDismiss"/, "A dismissible sidebar release notice is required.");
assert.match(appSource, /IntersectionObserver[\s\S]*?settingsNavVisible[\s\S]*?renderSidebarUpdateNotice/, "The release notice must react to Settings visibility in the sidebar.");
assert.match(appSource, /auralane:update-notice-dismissed:\$\{version\}/, "Release-notice dismissal must be scoped to a single version.");
assert.match(mainSource, /if \(app\.isPackaged\)[\s\S]*?autoUpdater\.checkForUpdates/, "Every packaged app launch must check GitHub Releases.");
const mergedMacUpdate = mergeMacUpdateMetadata(
  "version: 1.0.3\nfiles:\n  - url: Auralane-1.0.3-x64.zip\n    sha512: x64zip\n    size: 10\n  - url: Auralane-1.0.3-x64.dmg\n    sha512: x64dmg\n    size: 11\npath: Auralane-1.0.3-x64.zip\nsha512: x64zip\nreleaseDate: '2026-09-20T00:00:00.000Z'\n",
  "version: 1.0.3\nfiles:\n  - url: Auralane-1.0.3-arm64.zip\n    sha512: armzip\n    size: 12\n  - url: Auralane-1.0.3-arm64.dmg\n    sha512: armdmg\n    size: 13\npath: Auralane-1.0.3-arm64.zip\nsha512: armzip\nreleaseDate: '2026-09-20T00:01:00.000Z'\n"
);
assert.equal(mergedMacUpdate.files.length, 4, "Merged macOS update metadata must retain both architectures and package formats.");
assert.equal(mergedMacUpdate.releaseDate, "2026-09-20T00:01:00.000Z", "Merged macOS metadata must keep the newest build date.");
assert.match(appSource, /contextVersion !== state\.syncContextVersion/, "Sync worker must stop after an account context switch.");
assert.match(appSource, /if \(!state\.auth\?\.signedIn\)/, "Guest UI must gate account-only synchronization.");
assert.match(appSource, /state\.auth\?\.signedIn && state\.settings\.webFallback/, "Guest playback must never open the web fallback.");
assert.match(mainSource, /function registerOnlineAudioStream[\s\S]*?upstreamStreamUrl[\s\S]*?\/online-audio\//, "Direct YouTube audio must be exposed through the same-origin local proxy.");
assert.match(mainSource, /async function proxyOnlineAudio[\s\S]*?request\.headers\.range[\s\S]*?Readable\.fromWeb/, "The online audio proxy must forward byte ranges and stream the upstream response.");
assert.match(mainSource, /ipcMain\.handle\("ytm:playback"[\s\S]*?registerOnlineAudioStream/, "Playback IPC must return the local proxy URL rather than a raw cross-origin Googlevideo URL.");
assert.match(mainSource, /translateLyrics[\s\S]*?localTranslation\.translateLyrics/, "Lyrics translation must use the bundled offline engine after online providers fail.");
const runawayTranslation = "\u6709\u6211\u88ab\u60f3\u627e".repeat(30);
assert.equal(translationLooksDegenerate("I was meant to find", runawayTranslation), true, "Runaway repeated translations must be rejected.");
assert.equal(translationLooksDegenerate("I was meant to find", "\u6211\u6ce8\u5b9a\u8981\u53bb\u5c0b\u627e"), false, "Normal translations must remain visible.");
assert.equal(translationLooksDegenerate("la la la la la la", "\u5566\u5566\u5566\u5566\u5566\u5566"), false, "Legitimate repeated lyrics must not be rejected.");
assert.equal(sanitizeTranslationResult(
  [{ text: "I was meant to find" }],
  { provider: "test", lines: [{ text: runawayTranslation }] }
).lines[0].text, "", "Rejected translations must not occupy lyric layout space.");
assert.match(mainSource, /canonicalMetadataYouTube = new YouTube\([\s\S]*?hl: "en"[\s\S]*?canonicalMetadataYouTube\.locale = \{[\s\S]*?hl: "en"/, "Canonical artist metadata must use a separate English InnerTube context.");
assert.match(mainSource, /function canonicalLyricsLookup\([\s\S]*?trackArtistReferences\(track\)[\s\S]*?track: \{ \.\.\.track, artist: canonicalArtist, artists \}/, "Lyrics lookup must resolve canonical artist names by browseId without mutating renderer track metadata.");
assert.match(mainSource, /if \(!isAutomaticLyricsArtist\(track, options\.artist\)\) return \{ track, options \}/, "A manually edited lyrics artist must not be replaced by canonical metadata.");
assert.match(mainSource, /ipcMain\.handle\("lyrics:search"[\s\S]*?canonicalLyricsLookup\(track, options\)[\s\S]*?searchLyricsCandidates\(lookup\.track, lookup\.options\)/, "Lyrics candidate search must use canonical artist metadata.");
assert.match(mainSource, /mainWindow = null;[\s\S]*?process\.platform !== "darwin"\) app\.quit\(\)/, "Closing the main window must terminate the desktop process on Windows and Linux.");
assert.match(mainSource, /if \(!mainWindow \|\| mainWindow\.isDestroyed\(\)\)[\s\S]*?createMainWindow\(\)/, "A second launch must recreate a missing main window instead of leaving a hidden process.");
assert.match(appSource, /streamErrorRetry[\s\S]*?state\.playbackStreams\.delete\(track\.id\)[\s\S]*?playTrack\(track, \{ streamRetry: true, startTime \}\)/, "A media-element stream failure must discard the old URL and resolve it once more.");
assert.match(appSource, /parseYouTubeMusicUrl/, "URL playback support is missing.");
assert.match(appSource, /updateSkipSilence/, "Skip-silence processing is missing.");
assert.match(mainSource, /if \(state\.lyricWindowActive\) createLyricWindow\(\);/, "Floating lyrics must reopen when the previous session left them active.");
assert.match(mainSource, /preserveLyricActiveOnClose = true;/, "App shutdown must preserve the floating lyrics active state.");
assert.match(appSource, /lyricWidgetActive = Boolean\(lyricWindowStatus\?\.active\);/, "Renderer must restore the floating lyrics button state.");
assert.match(appSource, /saved choice -> render immediately, search only in the background/, "Saved lyrics must remain authoritative while providers refresh in the background.");
assert.match(lyricsSource, /return exact\.length \|\| !context\.artist \? exact : search\(context\.title\)/, "NetEase must retry by title when a localized artist name returns no songs.");
assert.match(lyricsSource, /expectedTitle === sourceTitle && durationMatches && scriptsDiffer/, "Lyrics matching must support localized artist aliases only for an exact title and matching duration.");
assert.match(lyricsSource, /usesNonLatinScript\(context\.artist\)[\s\S]*?runQuery\(got401First, true\)/, "Musixmatch must include a title-only lookup for localized artist names.");
assert.match(appSource, /const providerDifference = compareNetEaseFirst\(a, b\)/, "Lyrics results must preserve NetEase/Musixmatch provider order without pinning the saved source.");
assert.match(appSource, /if \(immediateSavedResult \|\| consumedPrefetchResult\?\.result \|\| restoredLegacyResult\?\.result\) \{[\s\S]*?void searchPromise\.catch\(\(\) => \{\}\);[\s\S]*?return;/, "A saved or prefetched lyric must render immediately and prevent background search from replacing it.");
assert.match(appSource, /!hadPersistedLyrics[\s\S]*?persistAutomaticLyricsSelection\(searchTrack, selectedCandidate\)/, "Automatic lyric selection may persist result #1 only when the song has no saved version.");
assert.match(appSource, /if \(rightTier !== leftTier\) return rightTier - leftTier;[\s\S]*?rightOrderedCompleteness\.lines - leftOrderedCompleteness\.lines/, "Lyrics must rank word timing first and then line count descending.");
const reloadLyricsSource = appSource.slice(appSource.indexOf("async function reloadCurrentLyrics()"), appSource.indexOf("els.lyricsReloadButton?.addEventListener"));
assert.equal((reloadLyricsSource.match(/searchLyricsCandidatesForCurrent/g) || []).length, 0, "Reload must not start a second provider search after loadLyricsForTrack.");
assert.match(appSource, /recordMusicRecognitionSample\(12000, sourceType\)/, "Music recognition must capture a deliberate 12-second sample from the selected source.");
assert.match(appSource, /window\.metro\.recognizeMusic/, "Music recognition must send an audio fingerprint for identification.");
assert.match(mainSource, /ipcMain\.handle\("music:recognize"/, "Main process music recognition handler is missing.");
assert.match(mainSource, /function rememberAccountUnlike\(videoId\)/, "Successful unlikes must be persisted outside renderer localStorage.");
assert.match(mainSource, /filterAccountUnlikes\(await retryTransientYouTubeRequest/, "Stale YouTube liked browse results must be filtered by the durable account tombstone.");
assert.match(mainSource, /filterAccountUnlikes\(await youtube\.libraryOverview\(\)\)/, "Library overview must use the same durable unlike filter.");
assert.match(appSource, /scrollLyricIntoView\(activeLyricElement\(\), \{ instant: true \}\)/, "Maximized lyrics must re-anchor before the next lyric changes.");
assert.match(appSource, /if \(options\.instant\)/, "Lyrics scrolling must support an immediate geometry-stabilizing alignment.");

const savedPlayback = {
  track: { id: "last-song", title: "Last song" },
  currentTime: 91,
  duration: 240,
  currentIndex: 4,
  shuffleEnabled: true,
  repeatMode: "all"
};
const preservedPlayback = mergePlaybackSession(savedPlayback, {
  track: null,
  view: "library",
  sidePanel: "lyrics"
});
assert.equal(preservedPlayback.track.id, "last-song", "An empty renderer snapshot must preserve the last playable track.");
assert.equal(preservedPlayback.currentTime, 91, "An empty renderer snapshot must preserve the resume position.");
assert.equal(preservedPlayback.shuffleEnabled, true, "An empty renderer snapshot must preserve shuffle mode.");
assert.equal(preservedPlayback.repeatMode, "all", "An empty renderer snapshot must preserve repeat mode.");
assert.equal(preservedPlayback.view, "library", "Non-playback UI state should still be refreshed.");
assert.equal(preservedPlayback.wasPlaying, false, "Restored playback must remain paused until the user presses play.");
const clearedPlayback = mergePlaybackSession(savedPlayback, { track: null, clearTrack: true });
assert.equal(clearedPlayback.track, null, "Explicit data clearing must remove the saved track.");

const wordTimedLyrics = {
  lines: [
    { time: 20, text: "Short", words: [{ start: 20, end: 20.5, text: "Short" }] }
  ]
};
const richTtml = `<?xml version="1.0" encoding="UTF-8"?>
<tt xmlns="http://www.w3.org/ns/ttml" xmlns:ttm="http://www.w3.org/ns/ttml#metadata">
  <body><div ttm:agent="v1"><p>
    <span begin="10.000s" end="10.300s">Hel</span><span begin="10.300s" end="10.600s">lo</span>
    <span begin="10.600s" end="11.000s">world</span>
    <span ttm:role="x-translation">哈囉世界</span>
    <span ttm:role="x-bg"><span begin="10.700s" end="11.100s">hey</span></span>
  </p></div></body>
</tt>`;
const richLrc = ttmlToLrc(richTtml);
assert.match(richLrc, /\[00:10\.00\]\{agent:v1\}Hello world/, "TTML syllables must display as one continuous word without losing their timings.");
assert.match(richLrc, /<Hel:10:10\.3\|lo:10\.3:10\.6\|world:10\.6:11>/, "TTML must preserve source-provided span timings.");
assert.doesNotMatch(richLrc, /哈囉世界/, "Embedded translations must not be mixed into original lyrics.");
assert.match(richLrc, /\{bg\}hey/, "TTML background vocals must be emitted separately.");
const lineOnlyLrc = ttmlToLrc(`<tt xmlns="http://www.w3.org/ns/ttml"><body><p begin="5s" end="8s">A line without word timing</p></body></tt>`);
assert.equal(parseLyrics(lineOnlyLrc)[0]?.words?.length || 0, 0, "Line timing must never be fabricated into word timing.");
const prefixedTtml = `<tt:tt xmlns:tt="http://www.w3.org/ns/ttml"><tt:body><tt:p begin="1s"><tt:span begin="1s" end="2s">Prefix</tt:span></tt:p></tt:body></tt:tt>`;
assert.match(ttmlToLrc(prefixedTtml), /Prefix/, "Namespace-prefixed TTML elements must be parsed.");
const neteaseLrc = neteaseYrcToLrc("[6190,4440](6190,2190,0)Hello(8380,540,0), (8920,360,0)it's (9280,1350,0)me");
const neteaseLines = parseLyrics(neteaseLrc);
assert.equal(neteaseLines[0]?.text, "Hello, it's me", "NetEase YRC text must remain intact.");
assert.equal(neteaseLines[0]?.words?.length, 4, "NetEase YRC must retain per-word timing.");
assert.equal(lyricsWordTimingQuality({ lines: neteaseLines }).valid, true, "NetEase YRC must qualify as word-synced lyrics.");
assert.equal(lyricsWordTimingQuality({
  lines: [{
    time: 0,
    text: "one impossible word",
    words: [
      { text: "one", start: 0, end: 30 },
      { text: "impossible", start: 30, end: 60 },
      { text: "word", start: 60, end: 90 }
    ]
  }]
}).valid, false, "Implausibly long per-word timings must not qualify as high-quality word-synced lyrics.");
assert.equal(
  lyricsWordTimingQuality({ lines: parseLyrics(richLrc) }).valid,
  true,
  "Complete source-provided TTML word timing must pass strict quality validation."
);
const manyLineSyncedLyrics = {
  synced: true,
  lines: Array.from({ length: 30 }, (_, index) => ({ time: index + 10, text: `Line ${index}` }))
};
const earlyPlainLyrics = {
  lines: Array.from({ length: 20 }, (_, index) => ({ text: `Plain ${index}` }))
};
assert.ok(
  compareLyricsQuality(wordTimedLyrics, manyLineSyncedLyrics) < 0,
  "Word-timed lyrics must rank before candidates with more line-timed lyrics."
);
const partialWordTimedLyrics = {
  trackDuration: 240,
  lines: Array.from({ length: 18 }, (_, index) => ({
    time: index * 4,
    text: `Partial ${index}`,
    words: [{ start: index * 4, end: index * 4 + 1, text: `Partial ${index}` }]
  }))
};
const completeLineTimedLyrics = {
  trackDuration: 240,
  synced: true,
  lines: Array.from({ length: 32 }, (_, index) => ({ time: index * 7, text: `Complete ${index}` }))
};
assert.ok(
  compareLyricsQuality(completeLineTimedLyrics, partialWordTimedLyrics) < 0,
  "A word-timed candidate missing most of the song must not outrank complete lyrics."
);
const duetWordTimedLyrics = {
  lines: [
    {
      time: 20,
      text: "Duet",
      agent: "v2",
      words: [{ start: 20, end: 20.5, text: "Duet" }]
    }
  ]
};
assert.ok(
  compareLyricsQuality(duetWordTimedLyrics, wordTimedLyrics) < 0,
  "Duet-ready lyrics must rank first when word timing quality is equal."
);
assert.ok(
  compareLyricsQuality(manyLineSyncedLyrics, earlyPlainLyrics) < 0,
  "After word timing, candidates with more meaningful lines must rank first."
);
const earlyLineTimedLyrics = {
  synced: true,
  lines: Array.from({ length: 30 }, (_, index) => ({ time: index + 1, text: `Early ${index}` }))
};
assert.ok(
  compareLyricsQuality(earlyLineTimedLyrics, manyLineSyncedLyrics) < 0,
  "When timing and line count tie, lyrics beginning earlier must rank first."
);
assert.match(
  appSource,
  /if \(leftIncomplete !== rightIncomplete\) return leftIncomplete \? 1 : -1;/,
  "Manual lyrics search must reject incomplete timed candidates before comparing timing quality."
);
assert.match(
  appSource,
  /if \(rightTier !== leftTier\)/,
  "Manual lyrics search must prefer word timing after completeness checks."
);
assert.match(mainSource, /music:recognition-history/, "Music recognition history IPC is missing.");
assert.match(appSource, /toggleRecognitionHistory/, "Recognition history UI is missing.");
assert.match(appSource, /data-recognition-search/, "Recognition history entries cannot be searched again.");
assert.match(mainSource, /lyrics:cache-save/, "Durable lyrics cache IPC is missing.");
assert.match(appSource, /cacheHighQualityLyrics/, "High-quality lyrics are not cached.");
assert.match(appSource, /data-lyrics-quick-version/, "Expanded lyrics version switcher is missing.");
assert.doesNotMatch(appSource, /rememberQueueUndo|queueUndoSnapshot/, "Removed queue undo behavior must not remain wired.");
assert.doesNotMatch(indexHtml + appSource, /data-playlist-move|activeCollectionPlaylistMoveId|reorderPlaylistItem/, "Playlist order adjustment UI and renderer behavior must be removed.");
assert.match(appSource, /window\.metro\.libraryOverview\(\),\s*window\.metro\.likedSongs\(\)/, "Library must sync the same account-backed Liked Songs source.");
assert.match(appSource, /const canonicalLikedTracks = state\.likedData\s*\? likedRawTracks\(state\.likedData\)\s*: \[\]/, "Library songs must never fall back to mixed library browse videos.");
assert.match(appSource, /state\.lyricsExpanded \? "collapse" : "expand"/, "Expanded lyrics icon does not switch to collapse.");
assert.doesNotMatch(indexHtml, /id="focusButton"/, "The duplicate bottom-right fullscreen button should be removed.");
assert.match(appSource, /focusCloseButton\.innerHTML = standardIconSvg\("collapse"\)/, "Focus mode still needs a visible close control.");
assert.match(appSource, /--lyrics-backdrop-image/, "Expanded lyrics does not receive the current song backdrop.");
assert.match(appSource, /requestFullscreen/, "Expanded lyrics does not remove the native top strip with fullscreen mode.");
assert.match(indexHtml, /id="collectionLayoutButton"/, "Collection grid/list control must be available in the hero actions.");
assert.match(indexHtml, /id="collectionSearchBar"[\s\S]*?id="collectionSearchInput"/, "Playlist and Liked Music collection pages need a track search field.");
assert.match(appSource, /const visibleTracks = playlistView \? filterByQuery\(tracks, state\.collectionQuery\) : tracks;/, "Collection search must be limited to playlist-like pages, not artist pages.");
assert.match(appSource, /async function loadArtistPopularQueue[\s\S]*?targetSize = artistShuffleLimit\(\)[\s\S]*?artistItems: true[\s\S]*?while \(tracks\.length < targetSize/, "Artist Play and Shuffle must load the configured 100-song Popular songs page instead of the short artist preview.");
assert.match(appSource, /els\.artistPlayButton\.addEventListener[\s\S]*?loadArtistPopularQueue\(els\.artistPlayButton\)/, "Artist Play must use the full Popular songs queue.");
const artistShuffleHandler = appSource.slice(appSource.indexOf('els.artistShuffleButton.addEventListener'), appSource.indexOf('els.artistRadioButton.addEventListener'));
assert.match(artistShuffleHandler, /loadArtistPopularQueue[\s\S]*?reshuffleArtistTracks[\s\S]*?ensureShuffleOrder\(\{ renew: true \}\)/, "Every Artist Shuffle click must generate and activate a fresh order.");
assert.doesNotMatch(artistShuffleHandler, /trackFromArtistEndpoint/, "Artist Shuffle must not use YouTube's repeatable fixed shuffle endpoint.");
assert.doesNotMatch(indexHtml, /class="brand"/, "The removed Auralane Music sidebar brand block must not return.");
assert.match(appSource, /trackRows\._items = visibleTracks;[\s\S]*?trackRows\._playbackItems = tracks;/, "Filtered collection rows must still play from the complete playlist context.");
assert.match(indexHtml, /id="likedLayoutButton"/, "Liked Songs grid/list control must be in the top action row.");
assert.match(appSource, /data-item-key=/, "Home collection cards need stable identities instead of index-only routing.");
assert.match(appSource, /HOME_LISTENING_HISTORY_KEY = "auralane:homeListeningHistory"/, "Home listening history must survive account sign-out.");
assert.match(appSource, /function loadHomeDiscoveryMemory\(\)[\s\S]*?localStorageValuesWithPrefix\(QUEUE_HISTORY_KEY/, "Home must migrate existing account-scoped listening history into device recommendations.");
assert.match(appSource, /const deviceTracks = uniqueTracks\(\[[\s\S]*?state\.offlineCache\?\.tracks[\s\S]*?state\.localMusicData\?\.tracks/, "Guest Home must use downloaded and local songs when account data is unavailable.");
assert.match(appSource, /RANDOMIZED_HOME_KEYS = new Set\(\[[\s\S]*?"listen-again"[\s\S]*?"forgotten-favorites"[\s\S]*?"speed-dial"[\s\S]*?"quick-access"/, "Only the four Metrolist-style local Home sections should be randomized at the top.");
assert.match(appSource, /requestId !== state\.collectionRequestId/, "Stale collection responses must not replace the active collection.");
assert.match(appSource, /likedRowsHtml\(visibleTracks, \{ selectable: false, detailLabel: label \}\)/, "Collection track lists must use the Liked Songs row presentation.");
assert.match(appSource, /async function persistAutomaticLyricsSelection/, "Automatically selected lyrics need a durable persistence path.");
assert.match(appSource, /saveLocalLyricsForTrack\(track, rawLyrics/, "Automatic lyrics must save the complete selected result locally.");
assert.match(appSource, /await cacheHighQualityLyrics\(track, result, \{ force: true \}\)/, "Automatic lyrics must finish writing the durable disk cache.");
assert.match(appSource, /const remembered = selectedLyricsMemoryForTrack\(track\);[\s\S]*?incomingFingerprint !== rememberedFingerprint\) return;/, "Background cache refreshes must not overwrite a listener's saved lyric version.");
assert.match(appSource, /const selectedCandidate = state\.lyricsSearchCandidates\[0\][\s\S]*?persistAutomaticLyricsSelection\(searchTrack, selectedCandidate\)/, "Automatic lyrics must use and save the first visible result.");
assert.match(appSource, /function preferredLyricsCandidateIndex\(\)[\s\S]*?return state\.lyricsSearchCandidates\.length \? 0 : -1;/, "The first visible lyrics result must be the sole preferred candidate.");
assert.match(appSource, /function switchLyricsVersionByDirection[\s\S]*?applyLyricsVersionSelection\(versions\[nextIndex\]/, "Arrow-key lyrics source navigation must use the shared save path.");
assert.match(appSource, /event\.key === "ArrowUp" \|\| event\.key === "ArrowDown"[\s\S]*?switchLyricsVersionByDirection/, "Lyrics views must support ArrowUp and ArrowDown source switching.");
assert.match(appSource, /const cached = await window\.metro\.cachedLyrics\(track\.id \|\| track\.videoId\)[\s\S]*?durableCandidate = \{ \.\.\.cached\.result, rawLyrics, cached: true \}/, "Main playback must restore a durable disk-cached lyric before searching providers.");
assert.match(appSource, /saveLocalLyricsForTrack\(track, rawLyrics,[\s\S]*?saveLyricsMemoryForTrack\(track, durableCandidate, rawLyrics\)[\s\S]*?assertLyricsSelectionPersisted/, "A durable lyrics-cache hit must repair both account-scoped saved copies.");
assert.match(appSource, /const persistedCandidate = savedCandidate \|\| localCandidate \|\| durableCandidate/, "Previously saved automatic lyrics must load before another network search.");
assert.match(appSource, /getByteTimeDomainData\(visualizerTimeData\)/, "Vinyl contour must use the real time-domain waveform instead of wrapping FFT bins into a blob.");
assert.match(appSource, /if \(visualizerIdleReset\) return;[\s\S]*?visualizerIdleReset = true;/, "A paused visualizer must not rewrite fullscreen styles on every animation frame.");
assert.match(appSource, /lineIndex === activeIndex[\s\S]*?els\.moreMenu\?\.classList\.contains\("hidden"\)[\s\S]*?scrollLyricIntoView/, "Session lyric auto-scroll must pause while a global song menu is open.");
assert.match(appSource, /function hideMoreMenu\(\)[\s\S]*?activeSidePanel === "lyrics"[\s\S]*?scrollLyricIntoView\(activeLyricElement\(\), \{ instant: true \}\)/, "Closing a song menu must re-anchor session lyrics exactly once.");
assert.match(appSource, /function showMoreMenu[\s\S]*?activeSidePanel === "lyrics"[\s\S]*?lyricsScrollContainer\?\.scrollTo\([\s\S]*?behavior: "auto"/, "Opening a song menu must stop an already-running native session lyric scroll.");
assert.match(appSource, /querySelectorAll\("\.lyric-word, \.lyric-text-token"\)[\s\S]*?--lyric-overflow-font-size/, "Session lyric wrapping must measure both timed and plain complete-word tokens.");
assert.match(appSource, /lyricsSourceMenuOpen \? 66 : state\.lyricsExpanded \? 33 : 16/, "Opening the fullscreen lyrics source picker must reserve main-thread time for pointer interaction.");
assert.match(stylesSource, /\.lyrics-version-menu \{[\s\S]*?contain: layout paint;[\s\S]*?transform: translateZ\(0\);/, "The fullscreen lyrics source menu must paint independently from the animated backdrop.");
assert.match(stylesSource, /#lyricsPane \.lyric-word,[\s\S]*?word-break: keep-all !important;/, "Session lyrics must wrap between whole words rather than splitting letters.");
assert.match(stylesSource, /\.lyric-word\.lyric-word-overflow,[\s\S]*?font-size: var\(--lyric-overflow-font-size, 1em\)/, "An over-wide lyric token must shrink intact instead of enabling anywhere wrapping.");
assert.match(appSource, /const previousIndex = \(index - 1 \+ lobeCount\) % lobeCount[\s\S]*?const nextIndex = \(index \+ 1\) % lobeCount/, "Vinyl waveform smoothing must cross the first/last seam circularly.");
assert.match(appSource, /const sourceNextIndex = \(sourceIndex \+ 1\) % lobeCount/, "Vinyl waveform interpolation must wrap smoothly across the circular seam.");
assert.match(appSource, /const lobeCount = 144/, "Vinyl audio ring must retain many independently reacting peaks.");
assert.match(appSource, /sequenceIndex \* \.61803398875/, "Vinyl audio bands must be interleaved without mirrored frequency ordering.");
assert.match(appSource, /energy \/ samples\) \* \.7 \+ \(flux \/ samples\) \* 2\.25/, "Vinyl peaks must combine real band energy with transient spectral flux.");
assert.match(appSource, /if \(!els\.lyricsQuickSettings\?\.open\) return;[\s\S]*?event\.target\.closest\("#lyricsQuickSettings"\)[\s\S]*?lyricsQuickSettings\.open = false/, "Display settings must close when the user clicks outside the drawer.");
assert.match(appSource, /function lyricsContainTrackTitle\([\s\S]*?compactLyrics\.includes/, "Lyrics ranking must detect whether the lyric body contains the song title.");
assert.match(appSource, /function compareLyricsCandidateQuality[\s\S]*?lineCoverage[\s\S]*?titleDifference[\s\S]*?rightCompleteness\.lines/, "Lyrics quality must rank timing completeness, then title match, then line count.");
assert.match(appSource, /lyricsTargetTitle: baseOptions\.title/, "Manual and automatic lyrics search candidates must carry the resolved song title into ranking.");
assert.match(appSource, /function normalizedLyricsSourceId[\s\S]*?replace\(\/\^netease:\//, "Legacy NetEase source ids must match current prefixed candidate ids.");
assert.doesNotMatch(appSource, /const selectedCandidate = rememberedIndex >= 0/, "Saved metadata must not override the first visible search result.");
assert.match(appSource, /function cachedLyricsMatchTrackIdentity[\s\S]*?lyricsIdentityTitleScore/, "Durable lyrics cache entries must be validated against the current song title.");
assert.match(appSource, /function cachedLyricsMatchTrackIdentity[\s\S]*?expectedArtists[\s\S]*?resultArtist[\s\S]*?expectedArtists\.some/, "Durable lyrics cache entries must also be validated against the performing artist.");
assert.match(appSource, /const queueIdentityTrack = state\.queue\.find[\s\S]*?queueIdentityTrack\?\.artist[\s\S]*?queueIdentityTrack\?\.artists/, "Lyrics identity validation must accept localized artist aliases from the same queued video id.");
assert.match(appSource, /const stalePersistedCandidate = savedCandidate \|\| localCandidate;[\s\S]*?clearLyricsSelectionForTrack\(track\)/, "A saved lyric belonging to another artist must be cleared before it can become authoritative.");
assert.match(appSource, /if \(cachedLyricsMatchTrackIdentity\(cached\.result, track\)\)[\s\S]*?clearCachedLyrics/, "A mismatched cached lyric must be rejected and cleared.");
assert.match(lyricsSource, /function candidateMatchesSearchArtist[\s\S]*?artistSimilarity\(context\.artistTokens, sourceArtist\) >= 0\.55/, "Provider candidates must retain and validate their real artist identity.");
assert.match(lyricsSource, /dedupeLyricsCandidates\(candidates\)[\s\S]*?candidateMatchesSearchTitle[\s\S]*?candidateMatchesSearchArtist/, "Unrelated same-name lyrics must be filtered before ranking.");
assert.match(lyricsSource, /async function findNeteaseCandidateBySourceId[\s\S]*?queryNeteaseLyrics\(numericId/, "Legacy NetEase selections need a direct source-id restore path.");
assert.match(appSource, /async function restoreLegacyLyricsSelection[\s\S]*?sourceId: memory\.sourceId[\s\S]*?persistAutomaticLyricsSelection/, "Metadata-only lyrics selections must be restored and fully persisted before broad search.");
assert.match(appSource, /const waitingText = restoringLegacySelection \? "Restoring saved lyrics\.\.\."/, "Saved-source restoration must not misleadingly remain labelled as a broad lyrics search.");
assert.match(appSource, /const prefetchedCandidate = !forceReload && !persistedCandidate[\s\S]*?lyricsPrefetchCache\.get\(prefetchKey\)/, "Main lyrics loading must consume an available next-track prefetch.");
assert.match(appSource, /immediateSavedResult \|\| immediatePrefetchedResult[\s\S]*?renderLyrics\(immediateResult\)/, "A prefetched lyric must render immediately instead of showing Searching lyrics.");
assert.match(appSource, /persistAutomaticLyricsSelection\(track, prefetchedCandidate\)[\s\S]*?lyricsPrefetchCache\.delete\(prefetchKey\)/, "A consumed prefetch must be persisted once, then removed from memory.");
assert.match(appSource, /sourceId: candidate\.sourceId \|\| ""/, "Prefetched lyrics must retain their exact provider source id.");
assert.match(appSource, /upcomingTracksForLyricsPrefetch\(track, 5\)/, "Lyrics prefetch must warm the next five queue tracks.");
assert.match(appSource, /for \(let index = 0; index < searches\.length; index \+= 3\)[\s\S]*?lyricsPrefetchCandidates\.set\(cacheKey, sortedCandidates\)/, "Next-track prefetch must fetch bounded provider batches and retain ordered backup candidates.");
assert.match(appSource, /const hasPersistedLyrics = Boolean[\s\S]*?if \(!hasPersistedLyrics\)[\s\S]*?lyricsPrefetchCache\.set/, "Prefetched alternatives must not overwrite a song that already has saved lyrics.");
assert.match(reloadLyricsSource, /persistAutomaticLyricsSelection\(track, replacement\)/, "Reload must persist the first refreshed result through the complete durable save path.");
assert.match(appSource, /analyserNode\.fftSize = 2048/, "Audio-reactive cover analysis should use a bounded FFT size to leave GPU/CPU headroom.");
assert.match(appSource, /low: \[35, 180\][\s\S]*?mid: \[180, 2200\][\s\S]*?high: \[2200,/, "Square cover feedback must analyse low, mid and high frequency bands independently.");
assert.match(appSource, /positiveFlux \+= Math\.max\(0, current - before\)/, "Square cover feedback must use half-wave spectral flux for real attacks.");
assert.match(appSource, /kickStrength[\s\S]*?snareStrength[\s\S]*?hatStrength[\s\S]*?updateSquareCoverBeatClock/, "Square cover motion must map separate transient classes onto its feedback.");
assert.doesNotMatch(preloadSource + mainSource + appSource, /alignLyricsCandidates|analyzeVocalTrack|lyrics:align-candidates|lyrics:analyze-track/, "CPU-heavy vocal separation must not run during lyrics lookup or prefetch.");

(async () => {
  const originalFetch = global.fetch;
  const requestHeaders = [];
  const capturedRequests = [];
  global.fetch = async (url, options = {}) => {
    requestHeaders.push(options.headers || {});
    capturedRequests.push({ url: String(url), body: JSON.parse(options.body || "{}"), headers: options.headers || {} });
    return {
      ok: true,
      json: async () => ({
        playabilityStatus: { status: "OK" },
        videoDetails: { videoId: "guest-video", title: "Guest test", author: "Auralane", lengthSeconds: "180" },
        streamingData: {
          adaptiveFormats: [{
            itag: 251,
            mimeType: "audio/webm; codecs=\"opus\"",
            bitrate: 128000,
            contentLength: "1024",
            url: "https://example.invalid/guest-audio"
          }]
        }
      })
    };
  };
  try {
    const guestPlayback = await guestClient.playback("guest-video");
    assert.equal(guestPlayback.mode, "direct", "Guest playback should resolve a direct stream without an account.");
    assert.ok(requestHeaders.length > 0, "Guest playback did not make a player request.");
    assert.ok(requestHeaders.every((headers) => !headers.Cookie && !headers.Authorization), "Guest playback leaked account headers.");
    await signedInClient.likeVideo("liked-video");
    await signedInClient.unlikeVideo("liked-video");
    const likeRequest = capturedRequests.find((request) => request.url.includes("/like/like"));
    const unlikeRequest = capturedRequests.find((request) => request.url.includes("/like/removelike"));
    assert.equal(likeRequest?.body?.target?.videoId, "liked-video", "Like must mutate the exact YouTube Music video id.");
    assert.equal(unlikeRequest?.body?.target?.videoId, "liked-video", "Unlike must mutate the exact YouTube Music video id.");
    assert.equal(likeRequest?.body?.context?.client?.clientName, "WEB_REMIX", "Likes must use the YouTube Music WEB_REMIX client.");
    assert.equal(likeRequest?.headers?.["X-Origin"], "https://music.youtube.com", "YouTube Music mutations require the X-Origin header used by Metrolist.");
    assert.equal(likeRequest?.headers?.["X-Goog-AuthUser"], "0", "YouTube Music mutations require the selected Google account header.");
    assert.equal(likeRequest?.headers?.["Cache-Control"], "no-cache", "Account mutations and refreshes must not reuse stale YouTube Music responses.");
  } finally {
    global.fetch = originalFetch;
  }
  console.log(`Smoke checks passed: ${JavaScriptFiles(path.join(root, "src")).length} JavaScript files, ${rendererIds.length} DOM references, ${invokedChannels.size} IPC invokes, guest playback transport.`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
