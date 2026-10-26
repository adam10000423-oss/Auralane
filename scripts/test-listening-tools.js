"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const Tools = require("../src/renderer/listeningTools.js");

class Audio extends EventTarget {
  constructor() {
    super();
    Object.assign(this, { currentTime: 0, playbackRate: 1, currentSrc: "file:track-a", paused: true,
      ended: false, seeking: false, muted: false, volume: 1, readyState: 4, dataset: {} });
  }
  event(type) { this.dispatchEvent(new Event(type)); }
}

class MemoryStorage {
  constructor() { this.values = new Map(); this.fail = false; }
  getItem(key) { return this.values.get(key) || null; }
  setItem(key, value) {
    if (this.fail) throw new Error("Quota exceeded");
    this.values.set(key, value);
  }
}

function setup(extra = {}) {
  let wall = new Date(2026, 9, 23, 12).getTime(), mono = 0, account = "alpha";
  const audio = new Audio(), storage = new MemoryStorage(), life = new EventTarget();
  const state = { queue: [{ id: "a", title: "Alpha", local: true }, { id: "b", title: "Beta" }],
    currentTrack: { id: "a" }, currentIndex: 0, playbackMode: "local", settings: {}, shuffleOrder: [1, 0], shuffleSignature: "old" };
  const errors = [], persisted = [], played = [];
  const api = Tools.create({ state, els: { audio }, storage, lifecycleTarget: life, autoTick: false,
    getAccountId: () => account, now: () => wall, monotonicNow: () => mono,
    persist: async (queue) => { persisted.push(structuredClone(queue)); },
    play: async (...args) => { played.push(args); }, onError: (error) => errors.push(error.message), ...extra });
  return { api, state, audio, storage, life, errors, persisted, played,
    account: (value) => { account = value; }, wall: (value) => { wall = value; },
    advance: (seconds, media = seconds * audio.playbackRate) => { mono += seconds * 1000; wall += seconds * 1000; audio.currentTime += media; },
    start: () => { audio.paused = false; audio.event("playing"); },
    total: (period = "year", reference) => api.summary(period, reference).seconds };
}

test("browser factory and CommonJS expose the same explicit init API without side effects", () => {
  const source = fs.readFileSync(path.join(__dirname, "../src/renderer/listeningTools.js"), "utf8");
  const context = { window: {} };
  vm.runInNewContext(source, context);
  assert.equal(typeof context.window.AuralaneListeningTools.create, "function");
  assert.equal(typeof context.window.AuralaneListeningTools.init, "function");
  assert.throws(() => Tools.create(), /getAccountId/);
});

test("counts elapsed audible time, not media duration, including speed changes", () => {
  const h = setup(); h.start(); h.advance(3); h.audio.event("timeupdate");
  assert.equal(h.total(), 3);
  h.audio.playbackRate = 2; h.audio.event("ratechange"); h.advance(3); h.api.tick();
  assert.equal(h.total(), 6);
  h.audio.playbackRate = 0.5; h.audio.event("ratechange"); h.advance(2); h.api.tick();
  assert.equal(h.total(), 8);
  h.api.destroy();
});

test("pause tail is counted once; pause and buffering gaps never accrue", () => {
  const h = setup(); h.start(); h.advance(2); h.audio.paused = true; h.audio.event("pause");
  assert.equal(h.total(), 2);
  h.advance(200, 0); h.api.tick(); h.audio.event("pause"); assert.equal(h.total(), 2);
  h.start(); h.advance(1); h.audio.event("waiting");
  h.advance(100, 0); h.api.tick(); assert.equal(h.total(), 3);
  h.audio.event("playing"); h.advance(1); h.api.tick(); assert.equal(h.total(), 4);
  h.api.destroy();
});

test("seeks in both directions, unannounced timeline jumps, and suspended clocks do not inflate totals", () => {
  const h = setup(); h.start(); h.advance(1); h.api.tick();
  h.audio.seeking = true; h.audio.event("seeking"); h.advance(1, 200);
  h.audio.seeking = false; h.audio.event("seeked"); h.advance(1); h.api.tick();
  assert.equal(h.total(), 2);
  h.audio.seeking = true; h.audio.event("seeking"); h.advance(1, -100);
  h.audio.seeking = false; h.audio.event("seeked"); h.advance(1); h.api.tick();
  h.advance(1, 100); h.api.tick(); assert.equal(h.total(), 3);
  h.advance(100, 100); h.api.tick(); assert.equal(h.total(), 3);
  h.advance(1); h.api.tick(); assert.equal(h.total(), 4);
  h.api.destroy();
});

test("mute, zero volume, previews, embeds, stalled playback, and track/source transitions are excluded", () => {
  const h = setup(); h.start(); h.advance(1); h.api.tick();
  h.audio.muted = true; h.audio.event("volumechange"); h.advance(2); h.api.tick();
  h.audio.muted = false; h.audio.volume = 0; h.audio.event("volumechange"); h.advance(2); h.api.tick();
  h.audio.volume = 1; h.audio.event("volumechange");
  h.audio.dataset.gamePlayer = "preview"; h.advance(2); h.api.tick();
  delete h.audio.dataset.gamePlayer; h.api.tick();
  h.state.playbackMode = "web"; h.advance(2); h.api.tick();
  h.state.playbackMode = "local"; h.api.tick();
  h.advance(1, 0); h.api.tick();
  h.state.currentTrack = { id: "b" }; h.advance(1); h.api.tick();
  h.audio.currentSrc = "file:track-b"; h.advance(1); h.api.tick();
  assert.equal(h.total(), 1);
  h.advance(1); h.api.tick(); assert.equal(h.total(), 2);
  h.audio.event("stalled"); h.advance(4); h.api.tick(); assert.equal(h.total(), 2);
  h.api.destroy();
});

test("ended and pagehide flush once and teardown detaches every audio listener", () => {
  const h = setup(); h.start(); h.advance(1); h.audio.ended = true; h.audio.event("ended");
  assert.equal(h.total(), 1);
  h.audio.ended = false; h.start(); h.advance(1); h.life.dispatchEvent(new Event("pagehide"));
  assert.equal(h.total(), 2);
  h.api.destroy(); h.api.destroy(); h.start(); h.advance(1); h.audio.event("timeupdate");
  assert.equal(h.total(), 2);
  assert.equal([...h.storage.values.values()].map(JSON.parse)[0].days[0].seconds, 2);
});

test("snapshots are defensive copies with bounded metadata, local flags, order, index and position", async () => {
  const h = setup(); h.audio.currentTime = 42;
  h.state.queue[0].streamUrl = "secret ephemeral URL";
  const entry = h.api.saveSnapshot("  My queue  ");
  assert.equal(entry.name, "My queue"); assert.equal(entry.position, 42);
  assert.equal(entry.tracks[0].local, true); assert.equal(entry.tracks[0].streamUrl, undefined);
  entry.tracks[0].title = "mutated"; h.api.listSnapshots()[0].tracks.reverse();
  h.state.queue = [{ id: "c" }]; h.state.currentTrack = { id: "c" };
  await h.api.restoreSnapshot(entry.id);
  assert.deepEqual(h.state.queue.map((item) => item.id), ["a", "b"]);
  assert.equal(h.state.currentIndex, -1); assert.equal(h.state.currentTrack.id, "c");
  assert.deepEqual(h.state.shuffleOrder, []); assert.equal(h.state.queueSource.type, "snapshot");
  assert.equal(h.played.length, 0); assert.equal(h.persisted.length, 1);
  await h.api.restoreSnapshot(entry.id, { play: true });
  assert.equal(h.played[0][0].id, "a"); assert.equal(h.played[0][1].startTime, 42);
  h.api.destroy();
});

test("queue lock, restore failures, missing callbacks and concurrent restores have explicit outcomes", async () => {
  let fail = true, release;
  const h = setup({ persist: async () => { if (fail) throw new Error("disk failure"); await new Promise((resolve) => { release = resolve; }); } });
  const entry = h.api.saveSnapshot("Queue"); const old = [{ id: "old" }]; h.state.queue = old;
  h.state.settings.queueLock = true;
  await assert.rejects(h.api.restoreSnapshot(entry.id), /Unlock/); h.state.settings.queueLock = false;
  await assert.rejects(h.api.restoreSnapshot(entry.id), /disk failure/); assert.equal(h.state.queue, old);
  fail = false;
  const pending = h.api.restoreSnapshot(entry.id);
  await assert.rejects(h.api.restoreSnapshot(entry.id), /already in progress/); release(); await pending;
  h.api.destroy();
  const noPersist = setup({ persist: undefined });
  const saved = noPersist.api.saveSnapshot("Missing callback");
  await assert.rejects(noPersist.api.restoreSnapshot(saved.id), /persist callback/); noPersist.api.destroy();
});

test("delete undo is persistent, single-level and scoped to the owning account", () => {
  const h = setup(); const one = h.api.saveSnapshot("One"), two = h.api.saveSnapshot("Two");
  assert.equal(h.api.deleteSnapshot(one.id), true); assert.equal(h.api.undoDelete(), true);
  assert.deepEqual(h.api.listSnapshots().map((entry) => entry.id), [two.id, one.id]);
  assert.equal(h.api.undoDelete(), false); h.api.deleteSnapshot(two.id);
  h.account("beta"); h.api.refreshAccount(); assert.equal(h.api.undoDelete(), false);
  assert.equal(h.api.listSnapshots().length, 0);
  h.account("alpha"); h.api.refreshAccount(); assert.equal(h.api.listSnapshots()[0].id, one.id);
  h.api.destroy();
});

test("automatic account detection does not transfer listening time or snapshots", () => {
  const h = setup(); h.api.saveSnapshot("Alpha"); h.start(); h.advance(2); h.api.tick();
  h.account("beta"); h.advance(1); h.api.tick(); assert.equal(h.total(), 0);
  assert.equal(h.api.listSnapshots().length, 0);
  h.start(); h.advance(3); h.api.tick(); assert.equal(h.total(), 3);
  h.account("alpha"); h.api.refreshAccount(); assert.equal(h.total(), 2);
  assert.equal(h.api.listSnapshots().length, 1); h.api.destroy();
});

test("storage failures never pretend snapshot mutations succeeded and pending stats can retry", () => {
  const h = setup(); const entry = h.api.saveSnapshot("Keep"); h.storage.fail = true;
  assert.throws(() => h.api.deleteSnapshot(entry.id), /Quota/);
  assert.throws(() => h.api.saveSnapshot("Failed"), /Quota/);
  assert.equal(h.api.listSnapshots().length, 1);
  h.start(); h.advance(6); h.api.tick(); assert.equal(h.total(), 6);
  h.storage.fail = false; assert.equal(h.api.flush(), true);
  assert.equal(JSON.parse([...h.storage.values.values()][0]).days[0].seconds, 6); h.api.destroy();
});

test("bounds snapshots, tracks, document bytes, corrupt storage and malformed stored data", () => {
  const h = setup();
  h.state.queue = Array.from({ length: Tools.limits.tracks + 1 }, (_, index) => ({ id: String(index) }));
  assert.throws(() => h.api.saveSnapshot("Too large"), /not truncated/);
  h.state.queue = [{ id: "a" }];
  for (let index = 0; index < Tools.limits.snapshots; index++) h.api.saveSnapshot(String(index));
  assert.throws(() => h.api.saveSnapshot("Too many"), /Delete one/);
  h.api.destroy();
  const storage = new MemoryStorage(); storage.setItem("auralane:listening-tools:v1:alpha", "{broken");
  const corrupt = setup({ storage }); assert.equal(corrupt.api.listSnapshots().length, 0);
  assert.match(corrupt.errors[0], /Could not read/); corrupt.api.destroy();
  storage.setItem("auralane:listening-tools:v1:alpha", JSON.stringify({ version: 1,
    snapshots: [{ id: "x", tracks: [{ id: "a" }], currentIndex: 999, position: -5 }],
    days: [{ date: "2026-02-31", seconds: 100 }, { date: "2026-10-23", seconds: -5 }] }));
  const sanitized = setup({ storage });
  assert.equal(sanitized.api.listSnapshots()[0].currentIndex, 0);
  assert.equal(sanitized.api.listSnapshots()[0].position, 0); assert.equal(sanitized.total(), 0);
  sanitized.api.destroy();
  const enormous = setup();
  enormous.state.queue = Array.from({ length: 500 }, (_, index) => ({ id: String(index), localPath: "a".repeat(2048), thumbnail: "b".repeat(2048) }));
  assert.throws(() => enormous.api.saveSnapshot("Oversize"), /storage limit/);
  assert.equal(enormous.api.listSnapshots().length, 0); enormous.api.destroy();
});

test("local-midnight splitting and calendar week/month/year summaries are exact", () => {
  const h = setup(); h.wall(new Date(2026, 9, 31, 23, 59, 58).getTime());
  h.start(); h.advance(4); h.api.tick();
  assert.equal(h.total("month", new Date(2026, 9, 31)), 2);
  assert.equal(h.total("month", new Date(2026, 10, 1)), 2);
  assert.equal(h.total("year"), 4);
  const week = h.api.summary("week", new Date(2026, 10, 1));
  assert.equal(week.start, "2026-10-26"); assert.equal(week.endExclusive, "2026-11-02");
  assert.equal(week.activeDays, 2); assert.equal(week.seconds, 4);
  h.wall(new Date(2026, 11, 31, 23, 59, 59).getTime()); h.audio.event("playing"); h.advance(2); h.api.tick();
  assert.equal(h.total("year", new Date(2026, 11, 31)), 5);
  assert.equal(h.total("year", new Date(2027, 0, 1)), 1);
  h.api.destroy();
});

test("exports selected-period daily seconds without executable metadata or account identities", () => {
  const h = setup(); h.api.saveSnapshot("=HYPERLINK(unsafe)"); h.start(); h.advance(3); h.api.tick();
  const json = h.api.exportStats("json", "year"); const parsed = JSON.parse(json.content);
  assert.equal(parsed.seconds, 3); assert.equal(parsed.unit, "elapsed audible seconds");
  assert.equal(parsed.snapshots, undefined); assert.equal(parsed.accountId, undefined);
  const csv = h.api.exportStats("csv", "year");
  assert.equal(csv.content, "date,listening_seconds\r\n2026-10-23,3.000\r\n");
  assert.match(csv.filename, /2026-01-01.csv$/);
  assert.throws(() => h.api.exportStats("html"), /format/); assert.throws(() => h.api.summary("day"), /Period/);
  h.api.destroy();
});

// A small DOM double deliberately rejects HTML sinks, while exercising real UI handlers.
class Element extends EventTarget {
  constructor(tag) { super(); this.tagName = tag; this.children = []; this.attributes = {}; this.value = ""; this.checked = false; }
  set innerHTML(_) { throw new Error("Unsafe HTML sink"); }
  set textContent(value) { this.text = String(value); this.children = []; }
  get textContent() { return (this.text || "") + this.children.map((child) => child.textContent).join(""); }
  append(...children) { for (const child of children) { child.parent = this; this.children.push(child); if (this.tagName === "select" && !this.value) this.value = child.value; } }
  replaceChildren(...children) { this.children = []; this.append(...children); }
  setAttribute(name, value) { this.attributes[name] = value; }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter((entry) => entry !== this); }
  click() { this.dispatchEvent(new Event("click")); }
  all() { return [this, ...this.children.flatMap((child) => child.all())]; }
}

test("settings panel saves, restores, deletes, undoes, filters and exports through real handlers with textContent", async () => {
  const document = { createElement: (tag) => new Element(tag), body: new Element("body") };
  let exported;
  const h = setup({ document, onExport: (file) => { exported = file; } });
  const panel = h.api.mount(document.body);
  const find = (tag, text) => panel.all().find((entry) => entry.tagName === tag && entry.textContent === text);
  const input = panel.all().find((entry) => entry.attributes["aria-label"] === "Snapshot name");
  input.value = '<img src=x onerror="alert(1)">';
  panel.all().find((entry) => entry.tagName === "form").dispatchEvent(new Event("submit", { cancelable: true }));
  await new Promise(setImmediate);
  assert.equal(h.api.listSnapshots()[0].name, '<img src=x onerror="alert(1)">');
  assert.equal(panel.all().some((entry) => entry.tagName === "img"), false);
  h.state.queue = []; find("button", "Restore").click(); await new Promise(setImmediate);
  assert.equal(h.state.queue.length, 2);
  find("button", "Delete").click(); await new Promise(setImmediate); assert.equal(h.api.listSnapshots().length, 0);
  find("button", "Undo delete").click(); await new Promise(setImmediate); assert.equal(h.api.listSnapshots().length, 1);
  const period = panel.all().find((entry) => entry.attributes["aria-label"] === "Listening period");
  period.value = "month"; period.dispatchEvent(new Event("change")); await new Promise(setImmediate);
  find("button", "Export").click(); await new Promise(setImmediate); assert.match(exported.filename, /month/);
  assert.equal(panel.all().find((entry) => entry.attributes.role === "status").attributes["aria-live"], "polite");
  h.api.destroy(); assert.equal(document.body.children.length, 0);
});
