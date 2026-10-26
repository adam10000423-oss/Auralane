(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AuralaneListeningTools = api;
})(typeof window === "object" ? window : null, function () {
  "use strict";

  const LIMITS = Object.freeze({ snapshots: 20, tracks: 500, days: 800, bytes: 2000000 });
  const PREFIX = "auralane:listening-tools:v1:";
  const clean = (value, max = 300) => typeof value === "string" ? value.slice(0, max) : "";
  const number = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const dayKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  function trackData(track) {
    if (!track || typeof track !== "object") return null;
    const id = clean(track.id || track.videoId, 512).trim();
    if (!id) return null;
    const result = { id, videoId: id, title: clean(track.title), artist: clean(track.artist) };
    for (const key of ["duration", "thumbnail", "localPath", "codec", "mimeType", "albumId", "artistId"]) {
      if (typeof track[key] === "string") result[key] = clean(track[key], 2048);
    }
    for (const key of ["lengthSeconds", "durationSeconds"]) {
      if (number(track[key]) > 0) result[key] = track[key];
    }
    for (const key of ["local", "offlineOnly", "downloaded", "explicit"]) {
      if (typeof track[key] === "boolean") result[key] = track[key];
    }
    if (typeof track.album === "string") result.album = clean(track.album);
    else if (track.album && typeof track.album === "object") {
      result.album = { id: clean(track.album.id), name: clean(track.album.name), title: clean(track.album.title) };
    }
    if (Array.isArray(track.artists)) result.artists = track.artists.slice(0, 20).map((artist) =>
      typeof artist === "string" ? clean(artist) : { id: clean(artist?.id), name: clean(artist?.name) });
    return result;
  }

  function normalizeSnapshot(value) {
    if (!value || typeof value !== "object" || !clean(value.id, 100)) return null;
    const tracks = Array.isArray(value.tracks) ? value.tracks.slice(0, LIMITS.tracks).map(trackData).filter(Boolean) : [];
    if (!tracks.length) return null;
    return {
      id: clean(value.id, 100), name: clean(value.name, 80).trim() || "Queue snapshot",
      createdAt: Math.max(0, number(value.createdAt)), tracks,
      currentIndex: Number.isInteger(value.currentIndex) && value.currentIndex >= 0 && value.currentIndex < tracks.length ? value.currentIndex : 0,
      position: Math.max(0, Math.min(604800, number(value.position)))
    };
  }

  function normalize(value) {
    const result = { version: 1, snapshots: [], days: [] };
    if (!value || value.version !== 1) return result;
    const ids = new Set();
    for (const entry of (Array.isArray(value.snapshots) ? value.snapshots : []).slice(0, LIMITS.snapshots)) {
      const snapshot = normalizeSnapshot(entry);
      if (snapshot && !ids.has(snapshot.id)) { ids.add(snapshot.id); result.snapshots.push(snapshot); }
    }
    const dates = new Set();
    for (const entry of (Array.isArray(value.days) ? value.days : []).slice(-LIMITS.days)) {
      if (!entry || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) || dates.has(entry.date)) continue;
      const parsed = new Date(`${entry.date}T12:00:00`);
      if (!Number.isFinite(parsed.getTime()) || dayKey(parsed) !== entry.date) continue;
      dates.add(entry.date);
      result.days.push({ date: entry.date, seconds: Math.max(0, Math.min(90000, number(entry.seconds))) });
    }
    result.days.sort((a, b) => a.date.localeCompare(b.date));
    return result;
  }

  function create(options = {}) {
    if (typeof options.getAccountId !== "function") throw new TypeError("getAccountId callback is required (use a stable guest ID when signed out).");
    const getState = typeof options.state === "function" ? options.state : () => options.state;
    if (!getState()) throw new TypeError("state object or getter is required.");
    const audio = options.els?.audio;
    if (!audio?.addEventListener) throw new TypeError("els.audio is required.");
    const doc = options.document || (typeof document === "object" ? document : null);
    const life = options.lifecycleTarget || (typeof window === "object" ? window : null);
    let storage = options.storage;
    if (!storage) { try { storage = window.localStorage; } catch { /* Report unavailable storage on first write. */ } }
    const now = options.now || Date.now;
    const monotonic = options.monotonicNow || (() => performance.now());
    let scope, key, data, pending = false, lastWrite = 0, baseline = null, running = false;
    let undo = null, panel = null, ui = null, timer = null, disposed = false, busy = false, lastError = "";
    const listeners = [];

    function pruneDays() {
      const cutoff = new Date(now());
      cutoff.setDate(cutoff.getDate() - LIMITS.days + 1);
      const first = dayKey(cutoff);
      data.days = data.days.filter((entry) => entry.date >= first).slice(-LIMITS.days);
    }

    function report(error) {
      lastError = error instanceof Error ? error.message : String(error);
      if (ui) ui.status.textContent = lastError;
      if (options.onError) {
        try { options.onError(new Error(lastError)); } catch { /* Error reporters must not interrupt audio cleanup. */ }
      }
    }

    function write(next = data) {
      try {
        if (!storage?.setItem) throw new Error("Local storage is unavailable; changes are not saved.");
        const json = JSON.stringify(next);
        if (json.length * 2 > LIMITS.bytes) throw new Error("Listening tools storage limit reached. Delete a snapshot first.");
        storage.setItem(key, json);
        pending = false;
        lastWrite = monotonic();
        lastError = "";
        return true;
      } catch (error) { report(error); return false; }
    }

    function ensureScope() {
      const next = options.getAccountId();
      if (typeof next !== "string" || !next.trim() || next.length > 256) throw new TypeError("getAccountId must return a nonempty stable string of at most 256 characters.");
      if (next === scope) return false;
      if (pending && data && !write()) throw new Error("Cannot change account until unsaved listening data can be stored.");
      scope = next;
      key = PREFIX + encodeURIComponent(scope);
      data = normalize(null);
      baseline = null;
      running = false;
      undo = null;
      lastError = "";
      try {
        const raw = storage?.getItem(key);
        if (raw) {
          if (raw.length * 2 > LIMITS.bytes) throw new Error("Stored listening data exceeds its size limit.");
          data = normalize(JSON.parse(raw));
          pruneDays();
        }
      } catch (error) { report(new Error(`Could not read listening data: ${error.message}`)); }
      return true;
    }

    function point() {
      const state = getState();
      const track = state.currentTrack;
      return {
        time: monotonic(), wall: now(), media: Number(audio.currentTime), rate: Number(audio.playbackRate) || 1,
        identity: JSON.stringify([track?.id || track?.videoId || "", audio.currentSrc || audio.src || ""]),
        eligible: Boolean((track?.id || track?.videoId) && !audio.seeking &&
          !audio.muted && Number(audio.volume) > 0 && !audio.dataset?.gamePlayer &&
          state.playbackMode !== "embed" && state.playbackMode !== "web")
      };
    }

    function addSeconds(seconds, end) {
      // Split confirmed elapsed listening at local midnight, not by the song's timeline.
      let start = end - seconds * 1000;
      while (start < end) {
        const date = new Date(start);
        const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime();
        const stop = Math.min(midnight, end);
        const dateKey = dayKey(date);
        let bucket = data.days.find((entry) => entry.date === dateKey);
        if (!bucket) { bucket = { date: dateKey, seconds: 0 }; data.days.push(bucket); }
        bucket.seconds = Math.min(90000, bucket.seconds + (stop - start) / 1000);
        start = stop;
      }
      data.days.sort((a, b) => a.date.localeCompare(b.date));
      pruneDays();
      pending = true;
    }

    function sample(allowStopped = false) {
      ensureScope();
      const current = point();
      if (running && baseline && baseline.eligible && current.eligible &&
          baseline.identity === current.identity && (allowStopped || (!audio.paused && !audio.ended))) {
        const elapsed = (current.time - baseline.time) / 1000;
        const advance = current.media - baseline.media;
        const wallElapsed = (current.wall - baseline.wall) / 1000;
        // Long suspend gaps, clock jumps, and discontinuous timeline changes are never credited.
        if (elapsed > 0 && elapsed <= 10 && Math.abs(wallElapsed - elapsed) < 1 &&
            advance > 0 && baseline.rate > 0 && advance <= elapsed * baseline.rate + 0.35) {
          const credited = Math.min(elapsed, advance / baseline.rate);
          addSeconds(credited, current.wall);
          options.onCredit?.(trackData(getState().currentTrack), credited, current.wall);
        }
      }
      baseline = current;
      if (pending && current.time - lastWrite >= 5000) write();
    }

    function listen(target, type, handler) {
      const guarded = () => {
        if (disposed) return;
        try { handler(); } catch (error) { report(error); }
      };
      target?.addEventListener(type, guarded);
      listeners.push(() => target?.removeEventListener(type, guarded));
    }

    function begin() {
      ensureScope();
      baseline = point();
      running = !audio.paused && !audio.seeking && !audio.ended;
    }

    function stop(credit) {
      if (credit) sample(true);
      else ensureScope();
      running = false;
      baseline = null;
      if (pending) write();
      renderSummary();
    }

    function listSnapshots() { ensureScope(); return clone(data.snapshots); }

    function saveSnapshot(name) {
      ensureScope();
      const state = getState();
      if (!Array.isArray(state.queue) || !state.queue.length) throw new Error("The queue is empty.");
      if (state.queue.length > LIMITS.tracks) throw new Error(`Snapshots support up to ${LIMITS.tracks} tracks; the queue was not truncated.`);
      if (data.snapshots.length >= LIMITS.snapshots) throw new Error(`Keep up to ${LIMITS.snapshots} snapshots. Delete one first.`);
      const tracks = state.queue.map(trackData);
      if (tracks.some((track) => !track)) throw new Error("The queue contains a track without an ID.");
      const currentIndex = Number.isInteger(state.currentIndex) && tracks[state.currentIndex]?.id === state.currentTrack?.id
        ? state.currentIndex : tracks.findIndex((track) => track.id === state.currentTrack?.id);
      const snapshot = normalizeSnapshot({
        id: `${now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`,
        name: clean(name, 80).trim() || `Queue ${new Date(now()).toLocaleDateString()}`,
        createdAt: now(), tracks, currentIndex: Math.max(0, currentIndex),
        position: currentIndex >= 0 && !audio.dataset?.gamePlayer ? number(Number(audio.currentTime)) : 0
      });
      const next = { ...data, snapshots: [snapshot, ...data.snapshots] };
      if (!write(next)) throw new Error(lastError);
      data = next;
      render();
      return clone(snapshot);
    }

    function deleteSnapshot(id) {
      ensureScope();
      const index = data.snapshots.findIndex((entry) => entry.id === id);
      if (index < 0) return false;
      const entry = data.snapshots[index];
      const next = { ...data, snapshots: data.snapshots.filter((item) => item.id !== id) };
      if (!write(next)) throw new Error(lastError);
      data = next;
      undo = { entry, index, scope };
      render();
      return true;
    }

    function undoDelete() {
      ensureScope();
      if (!undo || undo.scope !== scope) return false;
      if (data.snapshots.length >= LIMITS.snapshots) throw new Error("Delete another snapshot before undoing.");
      const snapshots = [...data.snapshots];
      snapshots.splice(Math.min(undo.index, snapshots.length), 0, undo.entry);
      const next = { ...data, snapshots };
      if (!write(next)) throw new Error(lastError);
      data = next;
      undo = null;
      render();
      return true;
    }

    async function restoreSnapshot(id, settings = {}) {
      if (options.canRestore?.() === false) throw new Error("The room host controls the queue.");
      ensureScope();
      if (busy) throw new Error("A snapshot restore is already in progress.");
      const state = getState();
      if (state.settings?.queueLock) throw new Error("Unlock the queue before restoring a snapshot.");
      const entry = data.snapshots.find((item) => item.id === id);
      if (!entry) throw new Error("Snapshot not found.");
      if (typeof options.persist !== "function") throw new Error("A queue persist callback is required to restore snapshots.");
      if (settings.play && typeof options.play !== "function") throw new Error("A play callback is required for autoplay.");
      const owner = scope;
      const previous = { queue: state.queue, currentIndex: state.currentIndex, queueSource: state.queueSource,
        shuffleOrder: state.shuffleOrder, shuffleSignature: state.shuffleSignature };
      const restored = clone(entry.tracks);
      busy = true;
      render();
      try {
        state.queue = restored;
        state.queueSource = { type: "snapshot", title: entry.name, continuations: [] };
        state.currentIndex = restored.findIndex((track) => track.id === state.currentTrack?.id);
        state.shuffleOrder = [];
        state.shuffleSignature = "";
        try {
          const result = await options.persist(state.queue, { reason: "snapshot-restore", accountId: owner });
          if (result === false) throw new Error("Queue persistence was rejected.");
        } catch (error) {
          if (options.getAccountId() === owner && state.queue === restored) Object.assign(state, previous);
          throw error;
        }
        if (options.getAccountId() !== owner) throw new Error("Account changed during restore; playback was not started. Reload the active account queue.");
        if (settings.play) {
          const result = await options.play(restored[entry.currentIndex], { startTime: entry.position });
          if (result === false) throw new Error("Queue restored, but playback was rejected.");
        }
        return clone(entry);
      } finally {
        busy = false;
        if (options.render) options.render();
        if (!disposed) render();
      }
    }

    function summary(period = "week", reference = new Date(now())) {
      ensureScope();
      if (!["week", "month", "year"].includes(period)) throw new Error("Period must be week, month, or year.");
      const date = new Date(reference);
      if (!Number.isFinite(date.getTime())) throw new Error("Invalid summary date.");
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      let end;
      if (period === "week") {
        start.setDate(start.getDate() - (start.getDay() + 6) % 7);
        end = new Date(start); end.setDate(end.getDate() + 7);
      } else if (period === "month") {
        start.setDate(1); end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      } else {
        start.setMonth(0, 1); end = new Date(start.getFullYear() + 1, 0, 1);
      }
      const from = dayKey(start), until = dayKey(end);
      const days = data.days.filter((entry) => entry.date >= from && entry.date < until);
      return { period, start: from, endExclusive: until, seconds: days.reduce((sum, entry) => sum + entry.seconds, 0),
        activeDays: days.filter((entry) => entry.seconds > 0).length, days: clone(days) };
    }

    function exportStats(format = "json", period = "year", reference) {
      if (!["json", "csv"].includes(format)) throw new Error("Export format must be json or csv.");
      sample();
      if (pending) write();
      const result = summary(period, reference);
      const content = format === "json" ? JSON.stringify({ version: 1, generatedAt: new Date(now()).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, unit: "elapsed audible seconds", retentionDays: LIMITS.days, ...result }, null, 2)
        : "date,listening_seconds\r\n" + result.days.map((entry) => `${entry.date},${entry.seconds.toFixed(3)}`).join("\r\n") + "\r\n";
      return { filename: `auralane-listening-${period}-${result.start}.${format}`,
        mime: format === "json" ? "application/json" : "text/csv", content };
    }

    function node(tag, text, className) {
      const element = doc.createElement(tag);
      if (text !== undefined) element.textContent = text;
      if (className) element.className = className;
      return element;
    }

    async function action(callback, message) {
      try { await callback(); if (ui) ui.status.textContent = lastError || message; }
      catch (error) { report(error); }
    }

    function button(label, handler) {
      const element = node("button", label);
      element.type = "button";
      element.addEventListener("click", handler);
      return element;
    }

    function renderSummary() {
      if (!ui || options.snapshotsOnly) return;
      const result = summary(ui.period.value, `${ui.date.value || dayKey(new Date(now()))}T12:00:00`);
      const seconds = Math.floor(result.seconds);
      ui.total.textContent = `${Math.floor(seconds / 3600)}h ${Math.floor(seconds % 3600 / 60)}m ${seconds % 60}s`;
      ui.active.textContent = `${result.activeDays} active ${result.activeDays === 1 ? "day" : "days"}`;
      ui.range.textContent = `${result.start} to ${result.endExclusive} (exclusive)`;
    }

    function render() {
      if (!ui || disposed) return;
      ensureScope();
      ui.list.replaceChildren();
      ui.count.textContent = `${data.snapshots.length}/${LIMITS.snapshots}`;
      ui.undo.disabled = !undo || busy;
      ui.save.disabled = busy;
      if (!data.snapshots.length) ui.list.append(node("p", "No queue snapshots.", "alt-muted"));
      for (const entry of data.snapshots) {
        const row = node("li", undefined, "alt-snapshot");
        const detail = node("div", undefined, "alt-detail");
        detail.setAttribute("data-i18n-skip", "");
        detail.append(node("strong", entry.name), node("small", `${entry.tracks.length} tracks - ${new Date(entry.createdAt).toLocaleString()}`));
        const controls = node("div", undefined, "alt-actions");
        const restore = button("Restore", () => action(() => restoreSnapshot(entry.id, { play: ui.autoplay.checked }), "Queue restored."));
        const remove = button("Delete", () => action(() => deleteSnapshot(entry.id), "Snapshot deleted."));
        restore.disabled = busy; remove.disabled = busy;
        restore.setAttribute("aria-label", `Restore ${entry.name}`);
        remove.setAttribute("aria-label", `Delete ${entry.name}`);
        controls.append(restore, remove); row.append(detail, controls); ui.list.append(row);
      }
      renderSummary();
      if (lastError) ui.status.textContent = lastError;
    }

    function mount(host) {
      if (!doc || !host?.append) throw new TypeError("A settings panel host element is required.");
      if (panel) panel.remove();
      panel = node("section", undefined, "auralane-listening-tools");
      panel.setAttribute("aria-label", "Queue snapshots and listening");
      const header = node("div", undefined, "alt-heading");
      const count = node("small"); header.append(node("h3", "Queue snapshots"), count);
      const form = node("form", undefined, "alt-save");
      const name = node("input"); name.type = "text"; name.maxLength = 80; name.placeholder = "Snapshot name";
      name.setAttribute("aria-label", "Snapshot name");
      const save = node("button", "Save queue"); save.type = "submit";
      form.append(name, save);
      form.addEventListener("submit", (event) => { event.preventDefault(); action(() => { saveSnapshot(name.value); name.value = ""; }, "Queue saved."); });
      const row = node("div", undefined, "alt-actions");
      const label = node("label", undefined, "alt-check");
      const autoplay = node("input"); autoplay.type = "checkbox";
      label.append(autoplay, node("span", "Play on restore"));
      const undoButton = button("Undo delete", () => action(undoDelete, "Snapshot restored."));
      row.append(label, undoButton);
      const list = node("ul", undefined, "alt-list");
      const stats = node("section", undefined, "alt-stats");
      const filters = node("div", undefined, "alt-actions");
      const period = node("select"); period.setAttribute("aria-label", "Listening period");
      for (const [value, text] of [["week", "Week"], ["month", "Month"], ["year", "Year"]]) {
        const option = node("option", text); option.value = value; period.append(option);
      }
      const date = node("input"); date.type = "date"; date.value = dayKey(new Date(now())); date.setAttribute("aria-label", "Date within listening period");
      const format = node("select"); format.setAttribute("aria-label", "Export format");
      for (const value of ["json", "csv"]) { const option = node("option", value.toUpperCase()); option.value = value; format.append(option); }
      const download = button("Export", () => action(async () => {
        const file = exportStats(format.value, period.value, `${date.value}T12:00:00`);
        if (options.onExport) { await options.onExport(file); return; }
        const url = URL.createObjectURL(new Blob([file.content], { type: file.mime }));
        const anchor = node("a"); anchor.href = url; anchor.download = file.filename;
        doc.body.append(anchor); anchor.click(); anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "Listening export ready."));
      filters.append(period, date, format, download);
      period.addEventListener("change", () => action(() => { sample(); renderSummary(); }, ""));
      date.addEventListener("change", () => action(renderSummary, ""));
      const total = node("strong", "", "alt-total"), active = node("span"), range = node("small", "", "alt-muted");
      const metrics = node("div", undefined, "alt-actions"); metrics.append(total, active);
      stats.append(node("h3", "Listening time"), filters, metrics, range);
      const status = node("p", "", "alt-status"); status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
      panel.append(header, form, row, list, ...(options.snapshotsOnly ? [] : [stats]), status);
      ui = { count, name, save, autoplay, undo: undoButton, list, period, date, total, active, range, status };
      host.append(panel); render();
      return panel;
    }

    ensureScope();
    listen(audio, "playing", begin);
    listen(audio, "timeupdate", () => { sample(); renderSummary(); });
    for (const type of ["pause", "waiting", "stalled", "ended"]) listen(audio, type, () => stop(true));
    for (const type of ["seeking", "emptied", "loadstart", "abort", "error"]) listen(audio, type, () => stop(false));
    listen(audio, "seeked", begin);
    listen(audio, "ratechange", () => { baseline = point(); });
    listen(audio, "volumechange", () => { baseline = point(); });
    listen(life, "pagehide", () => stop(true));
    listen(life, "beforeunload", () => stop(true));
    if (!audio.paused && !audio.seeking && audio.readyState >= 3) begin();
    if (options.autoTick !== false) timer = setInterval(() => {
      try { sample(); renderSummary(); } catch (error) { report(error); }
    }, 1000);

    return {
      mount, render, saveSnapshot, listSnapshots, restoreSnapshot, deleteSnapshot, undoDelete, summary, exportStats,
      tick: () => { if (!disposed) sample(); },
      refreshAccount: () => { ensureScope(); if (!audio.paused && audio.readyState >= 3) begin(); render(); },
      flush: () => { sample(); return !pending || write(); },
      destroy: () => {
        if (disposed) return;
        try { stop(true); }
        finally {
          disposed = true;
          if (timer !== null) clearInterval(timer);
          listeners.forEach((remove) => remove());
          panel?.remove(); panel = null; ui = null;
        }
      }
    };
  }

  function init(options) {
    const instance = create(options);
    try { if (options.host || options.els?.listeningToolsHost) instance.mount(options.host || options.els.listeningToolsHost); }
    catch (error) { instance.destroy(); throw error; }
    return instance;
  }

  return Object.freeze({ create, init, limits: LIMITS });
});
