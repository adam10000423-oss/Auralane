(function (root) {
  const windows = Object.freeze({ perfect: .07, great: .13, good: .18 });
  const difficulties = Object.freeze({ easy: { gap: .42, holds: false, chords: false }, normal: { gap: .23, holds: true, chords: false }, expert: { gap: .105, holds: true, chords: true } });
  function words(text) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "word" }).segment(text), (part) => ({ value: part.segment, word: Boolean(part.isWordLike) }));
  }
  function judge(delta) {
    const distance = Math.abs(delta);
    return distance <= windows.perfect ? "perfect" : distance <= windows.great ? "great" : distance <= windows.good ? "good" : null;
  }
  function chartForLevel(chart, level) {
    const config = difficulties[level] || difficulties.normal;
    const result = [];
    const occupied = [-Infinity, -Infinity, -Infinity, -Infinity];
    let previous = -Infinity;
    for (const source of [...chart].sort((a, b) => a.time - b.time || a.lane - b.lane)) {
      const chord = config.chords && source.chord && Math.abs(source.time - previous) < .001;
      if ((!chord && source.time - previous < config.gap) || source.time < occupied[source.lane] + .12) continue;
      const note = { ...source, state: "pending", type: config.holds ? source.type : "tap", duration: config.holds ? source.duration || 0 : 0 };
      occupied[note.lane] = note.time + note.duration;
      previous = note.time;
      result.push(note);
    }
    return result;
  }
  function songIdentity(track) {
    const clean = (value) => String(value || "").normalize("NFKC").toLocaleLowerCase().replace(/\s*\((official|lyrics?|audio|video)[^)]*\)/gi, "").replace(/[^\p{L}\p{N}]/gu, "");
    return `${clean(track?.title)}|${clean(track?.artist)}`;
  }
  function sameSong(a, b) {
    return Boolean(a && b && (String(a.id) === String(b.id) || (a.title && a.artist && b.title && b.artist && songIdentity(a) === songIdentity(b))));
  }
  const api = { windows, difficulties, words, judge, chartForLevel, sameSong };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.AuralaneGameRules = api;
})(typeof window === "undefined" ? globalThis : window);
