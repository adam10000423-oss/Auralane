"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const app = fs.readFileSync(path.join(__dirname, "../src/renderer/app.js"), "utf8");
const start = app.indexOf("function shouldStopAfterCurrentTrack() {");
const end = app.indexOf("\nlet playbackEndedWork", start);
assert(start >= 0 && end > start);
function shouldStop({ mode = "queue", current = 0, shuffled = false, order = [0, 1, 2], failed = [] } = {}) {
  const context = { state: { sleepFinishMode: mode, currentTrack: { id: String(current) },
    shuffleEnabled: shuffled, queue: [0, 1, 2] },
    ensureShuffleOrder: () => order, queueIndexByTrackId: id => id,
    currentQueueIndex: () => current, queueTrackIsPlayable: index => !failed.includes(index) };
  return vm.runInNewContext(`${app.slice(start, end)}\nshouldStopAfterCurrentTrack()`, context);
}

test("end-queue sleep follows actual shuffled order instead of list position", () => {
  assert.equal(shouldStop({ current: 2, shuffled: true, order: [0, 2, 1] }), false);
  assert.equal(shouldStop({ current: 1, shuffled: true, order: [0, 2, 1] }), true);
  assert.equal(shouldStop({ current: 2 }), true);
  assert.equal(shouldStop({ current: 0, failed: [1, 2] }), true);
  assert.equal(shouldStop({ mode: null, current: 2 }), false);
  assert.equal(shouldStop({ mode: "track", current: 0 }), true);
});

test("a manual lyric choice while providers are pending survives the automatic search", async () => {
  const from = app.indexOf("async function searchLyricsCandidatesForCurrent(");
  const to = app.indexOf("\nfunction openLyricsSearchPanel", from);
  let complete, started;
  const pending = new Promise(resolve => { complete = resolve; });
  const searching = new Promise(resolve => { started = resolve; });
  const state = { currentTrack: { id: "song", title: "Example" }, lyricsPrefetchCandidates: new Map(),
    lyricsSearchRequest: 0, lyricsSelectionRevision: 0, settings: {}, lyricsUserSelected: false };
  let commits = 0, renders = 0;
  const noop = () => {};
  const context = { state, els: {}, console, lyricsCacheKey: () => "song", toast: noop,
    enabledLyricsSearchProviders: () => ["test"], lyricsProviderLabelByKey: x => x,
    setLyricsProviderState: noop, selectedLyricsMemoryForTrack: () => null,
    savedLyricsCandidateForTrack: () => null, localLyricsCandidateForTrack: () => null,
    appendLyricsSearchCandidates: values => state.lyricsSearchCandidates.push(...values),
    renderLyricsCandidateList: noop, selectPreferredLyricsCandidate: noop, updateLyricsSearchStatus: noop,
    updateLyricsToolState: noop, resolveLyricsSearchIdentity: async () => ({ title: "Example" }),
    searchDefinitionForProvider: () => ({ provider: "test", options: {} }),
    lyricsSearchArtistFromTrack: () => "Artist", window: { metro: { searchLyrics: () => { started(); return pending; } } },
    removeLyricsPendingProvider: noop, cacheLyricsSearchState: noop,
    persistAutomaticLyricsSelection: async () => { commits++; return { result: {} }; },
    renderLyrics: () => { renders++; } };
  const work = vm.runInNewContext(`${app.slice(from, to)}\nsearchLyricsCandidatesForCurrent()`, context);
  await searching;
  state.lyricsSelectionRevision++;
  state.lyricsUserSelected = true;
  state.lyricsSelectedCandidateIndex = 7;
  complete({ candidates: [{ title: "Automatic" }] });
  await work;
  assert.equal(commits, 0);
  assert.equal(renders, 0);
  assert.equal(state.lyricsSelectedCandidateIndex, 7);
  assert.equal(state.lyricsSearchCandidates.length, 1);
});

test("account performance settings replace previous flags without saving into new account", async () => {
  const { chromium } = require("playwright-core");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent('<main id="tools"></main>');
    await page.addScriptTag({ path: path.join(__dirname, "../src/renderer/performanceTools.js") });
    const result = await page.evaluate(() => {
      let writes = 0;
      const tools = AuralanePerformanceTools.init({ container: document.querySelector("main"),
        settings: { lowPower: true, analysis: true }, onSettingsChange: () => writes++ });
      tools.loadSettings({ reducedMotion: true });
      const second = tools.getSettings();
      tools.loadSettings(null);
      const guest = tools.getSettings();
      tools.destroy();
      return { second, guest, writes };
    });
    assert.equal(result.second.lowPower, false);
    assert.equal(result.second.analysis, false);
    assert.equal(result.second.reducedMotion, true);
    assert.equal(result.guest.reducedMotion, false);
    assert.equal(result.writes, 0);
  } finally { await browser.close(); }
});
