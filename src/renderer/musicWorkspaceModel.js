(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AuralaneWorkspaceModel = api;
})(typeof window === "object" ? window : globalThis, function () {
  "use strict";
  const day = time => { const d = new Date(time); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const id = track => String(track?.id || track?.videoId || "");
  const artist = track => String(track?.artist || track?.artists?.map(a => typeof a === "string" ? a : a.name || a.title).filter(Boolean).join(", ") || "");
  const indexes = new WeakMap();
  function index(data) {
    let cached = indexes.get(data);
    if (!cached || cached.count !== data.records.length) {
      cached = { records: new Map(data.records.map(v => [v.day + "|" + id(v.track), v])), count: data.records.length, pruned: "", revision: 0, history: null };
      indexes.set(data, cached);
    }
    return cached;
  }
  function duration(track) {
    const n = Number(track?.durationSeconds || track?.lengthSeconds);
    if (Number.isFinite(n) && n > 0) return n;
    if (typeof track?.duration === "string" && /^\d+(?::\d{2}){1,2}$/.test(track.duration)) return track.duration.split(":").reduce((s, v) => s * 60 + Number(v), 0);
    return null;
  }
  function blank() { return { version: 1, rules: [], records: [], since: Date.now() }; }
  function normalize(value) {
    if (value?.version !== 1 || !Array.isArray(value.records) || !Array.isArray(value.rules)) return blank();
    return { ...blank(), since: Number(value.since) || Date.now(), rules: value.rules.filter(v => { try { return typeof v.id === "string" && Boolean(validateRule(v)); } catch { return false; } }),
      records: value.records.filter(v => /^\d{4}-\d{2}-\d{2}$/.test(v.day) && id(v.track) && Number.isFinite(v.seconds) && v.seconds >= 0 && Number.isFinite(v.plays) && v.plays >= 0 && Number.isFinite(v.lastPlayed)) };
  }
  function credit(data, track, seconds, time, counted = false) {
    if (!id(track) || !Number.isFinite(seconds) || seconds <= 0 || seconds > 10) return;
    const stamp = day(time);
    const cached = index(data), key = stamp + "|" + id(track);
    let record = cached.records.get(key);
    if (!record) { record = { day: stamp, track: { ...track }, seconds: 0, plays: 0, lastPlayed: time }; data.records.push(record); cached.records.set(key, record); cached.count++; }
    record.seconds += seconds; record.plays += counted ? 1 : 0; record.lastPlayed = time;
    cached.revision++; cached.history = null;
    if (cached.pruned !== stamp) {
      const cutoff = new Date(time); cutoff.setDate(cutoff.getDate() - 800);
      const first = day(cutoff); data.records = data.records.filter(v => v.day >= first);
      cached.records = new Map(data.records.map(v => [v.day + "|" + id(v.track), v])); cached.count = data.records.length; cached.pruned = stamp;
    }
    return record;
  }
  function range(period, reference = Date.now()) {
    const d = new Date(reference), start = new Date(d.getFullYear(), d.getMonth(), d.getDate()); let end;
    if (period === "week") { start.setDate(start.getDate() - (start.getDay() + 6) % 7); end = new Date(start); end.setDate(end.getDate() + 7); }
    else if (period === "month") { start.setDate(1); end = new Date(start.getFullYear(), start.getMonth() + 1, 1); }
    else if (period === "year") { start.setMonth(0, 1); end = new Date(start.getFullYear() + 1, 0, 1); }
    else throw new Error("Invalid listening period");
    return { from: day(start), until: day(end) };
  }
  function replay(data, period, time = Date.now()) {
    const { from, until } = range(period, time), songs = new Map(), artists = new Map(), days = new Map();
    for (const r of data.records) {
      if (r.day < from || r.day >= until) continue;
      const key = id(r.track), song = songs.get(key) || { track: r.track, seconds: 0, plays: 0 };
      song.seconds += r.seconds; song.plays += r.plays; songs.set(key, song);
      const names = Array.isArray(r.track.artists) && r.track.artists.length ? r.track.artists.map(a => ({ id: a.id || a.browseId || a.name || a.title || a, name: a.name || a.title || a })) : [{ id: r.track.artistId || artist(r.track), name: artist(r.track) }];
      for (const a of names) {
        if (!a.name) continue;
        const ar = artists.get(String(a.id)) || { id: String(a.id), name: String(a.name), seconds: 0, plays: 0 };
        ar.seconds += r.seconds; ar.plays += r.plays; artists.set(ar.id, ar);
      }
      days.set(r.day, (days.get(r.day) || 0) + r.seconds);
    }
    const sort = values => [...values].sort((a, b) => b.seconds - a.seconds || b.plays - a.plays);
    return { from, until, songs: sort(songs.values()), artists: sort(artists.values()), days: [...days].sort(), seconds: [...days.values()].reduce((a, b) => a + b, 0) };
  }
  function history(data) {
    const cached = index(data); if (cached.history) return cached.history;
    const result = new Map();
    for (const r of data.records) { const key = id(r.track), v = result.get(key) || { plays: 0, seconds: 0, lastPlayed: 0 }; v.plays += r.plays; v.seconds += r.seconds; v.lastPlayed = Math.max(v.lastPlayed, r.lastPlayed); result.set(key, v); }
    cached.history = result; return result;
  }
  const fields = ["artist", "liked", "downloaded", "plays", "recent", "duration"];
  function validateRule(rule) {
    if (!rule || !String(rule.name || "").trim() || String(rule.name).length > 80 || !["all", "any"].includes(rule.mode) || !Array.isArray(rule.conditions) || !rule.conditions.length || rule.conditions.length > 12) throw new Error("Invalid playlist rule");
    if (!["title", "recent", "plays", "duration"].includes(rule.sort) || !Number.isInteger(rule.limit) || rule.limit < 1 || rule.limit > 2000) throw new Error("Invalid playlist sort or limit");
    for (const c of rule.conditions) {
      if (!fields.includes(c.field)) throw new Error("Invalid condition");
      if (["liked", "downloaded"].includes(c.field)) { if (typeof c.value !== "boolean") throw new Error("Invalid condition value"); }
      else if (c.field === "artist") { if (typeof c.value !== "string" || !c.value.trim()) throw new Error("Enter an artist"); }
      else if (!Number.isFinite(Number(c.value)) || Number(c.value) < 0 || (c.field === "recent" && Number(c.value) < 1) || !["min", "max"].includes(c.op)) throw new Error("Invalid numeric condition");
    }
    return rule;
  }
  function evaluate(rule, tracks, data, options = {}) {
    validateRule(rule); const stats = history(data), now = options.now ?? Date.now(), unique = new Map();
    for (const track of tracks) if (id(track)) unique.set(id(track), track);
    const results = [...unique.values()].filter(track => {
      const st = stats.get(id(track)) || { plays: 0, lastPlayed: 0 };
      const values = rule.conditions.map(c => {
        if (c.field === "artist") return artist(track).toLocaleLowerCase().includes(String(c.value).trim().toLocaleLowerCase());
        if (c.field === "liked" || c.field === "downloaded") {
          const value = (c.field === "liked" ? options.liked : options.downloaded)?.(track);
          return typeof value === "boolean" && value === c.value;
        }
        if (c.field === "recent") return st.lastPlayed > 0 && (c.op === "max" ? now - st.lastPlayed <= Number(c.value) * 86400000 : now - st.lastPlayed >= Number(c.value) * 86400000);
        const value = c.field === "duration" ? duration(track) : st.plays;
        return value !== null && (c.op === "min" ? value >= Number(c.value) : value <= Number(c.value));
      });
      return rule.mode === "all" ? values.every(Boolean) : values.some(Boolean);
    });
    results.sort((a, b) => {
      if (rule.sort === "title") return String(a.title).localeCompare(String(b.title));
      if (rule.sort === "duration") return (duration(a) ?? Infinity) - (duration(b) ?? Infinity);
      const property = rule.sort === "recent" ? "lastPlayed" : "plays";
      return (stats.get(id(b))?.[property] || 0) - (stats.get(id(a))?.[property] || 0) || String(a.title).localeCompare(String(b.title));
    });
    return results.slice(0, rule.limit);
  }
  return { day, id, artist, duration, blank, normalize, credit, replay, history, evaluate, validateRule, fields };
});
