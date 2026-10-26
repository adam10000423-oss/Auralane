(function (root, factory) {
  const api = factory(); if (typeof module === "object" && module.exports) module.exports = api; else root.AuralaneAutomix = api;
})(typeof window === "object" ? window : globalThis, function () {
  "use strict";
  const curve = (incoming, count = 128) => Float32Array.from({ length: count }, (_, i) => incoming ? Math.sin(i / (count - 1) * Math.PI / 2) : Math.cos(i / (count - 1) * Math.PI / 2));
  function plan(a, b, duration, seconds) {
    const standard = { kind: "standard", start: duration - seconds, cue: 0, seconds, rate: 1 };
    if (!a?.trusted || !b?.trusted || duration < 45 || !Number.isFinite(a.bpm) || !Number.isFinite(b.bpm) || !Number.isFinite(a.offset) || !Number.isFinite(b.offset)) return standard;
    let rate = a.bpm / b.bpm; if (rate < .97 || rate > 1.03) return standard;
    const beat = 60 / a.bpm, bars = Math.max(1, Math.floor(seconds / beat / 4)), fade = Math.min(12, bars * 4 * beat);
    const first = Math.max(duration - 16, a.offset + Math.floor((duration - fade - a.offset) / beat) * beat);
    return { kind: "smart", start: first, cue: Math.max(0, b.offset), seconds: Math.min(fade, duration - first), rate, outgoingOffset: a.offset, beat, incomingBeat: 60 / b.bpm };
  }
  function init(o) {
    const audio = o.audio, cache = new Map();
    let key = "", revision = 0, prep = null, preparing = false, transitioning = false, handingOver = false, expected = "", tail = null, tailSource = null, tailGain = null, timer = null, controller = null, disposed = false, cooldown = 0;
    const phrases = {
      en: ["Transition", "Off", "Crossfade", "Automix", "Beat-aligned transition", "Crossfade transition"],
      "zh-TW": ["歌曲銜接", "關閉", "淡入淡出", "智慧銜接", "拍點對齊銜接", "淡入淡出銜接"],
      "zh-CN": ["歌曲衔接", "关闭", "淡入淡出", "智能衔接", "拍点对齐衔接", "淡入淡出衔接"],
      ja: ["曲のつなぎ", "オフ", "クロスフェード", "Automix", "ビート同期", "クロスフェード中"],
      ko: ["곡 전환", "끄기", "크로스페이드", "Automix", "비트 동기화 전환", "크로스페이드 전환"]
    };
    const t = () => phrases[o.state.settings.language] || phrases.en;
    const mode = () => o.state.settings.automixMode || (o.state.settings.crossfadeSeconds ? "standard" : "off");
    function blocked() { return mode() === "off" || o.blocked() || !o.state.playing || audio.paused || audio.seeking || audio.muted || (o.state.settings.dspSpeed || 1) !== 1 || o.state.settings.skipSilence || !Number.isFinite(audio.duration) || audio.duration < 30 || /\b(podcast|audiobook|live|concert)\b/i.test(o.state.currentTrack?.title || ""); }
    const setting = document.createElement("label"); setting.className = "settings-field"; setting.dataset.i18nSkip = "";
    const label = document.createElement("strong"), select = document.createElement("select");
    for (const value of ["off", "standard", "smart"]) { const option = document.createElement("option"); option.value = value; select.append(option); }
    setting.append(label, select); document.getElementById("settingsCrossfade")?.closest(".settings-field")?.before(setting);
    const indicator = document.createElement("span"); indicator.className = "automix-status"; indicator.hidden = true; indicator.dataset.i18nSkip = ""; indicator.setAttribute("role", "status"); document.querySelector(".player")?.append(indicator);
    function refresh() { label.textContent = t()[0]; select.setAttribute("aria-label", t()[0]); select.value = mode(); [...select.options].forEach((option, i) => { option.textContent = t()[i + 1]; }); }
    select.addEventListener("change", () => { cancel(); o.state.settings.automixMode = select.value; if (select.value !== "off" && !o.state.settings.crossfadeSeconds) o.state.settings.crossfadeSeconds = 6; o.save(); o.syncSettings(); refresh(); });
    function disposeTail() {
      if (tail) { tail.pause(); tail.removeAttribute("src"); tail.load(); }
      tailSource?.disconnect(); tailGain?.disconnect(); tail = null; tailSource = null; tailGain = null;
    }
    function cancel() {
      revision++; controller?.abort(); controller = null; preparing = false; prep = null; key = ""; expected = ""; transitioning = false; handingOver = false;
      if (timer) clearInterval(timer); timer = null; disposeTail();
      const graph = o.graph(false); if (graph) { graph.gain.gain.cancelScheduledValues(graph.context.currentTime); graph.gain.gain.setValueAtTime(1, graph.context.currentTime); }
      audio.playbackRate = o.state.settings.dspSpeed || 1; indicator.hidden = true;
    }
    async function analyze(url, duration, tailWindow, signal) {
      const cacheKey = `${url}|${tailWindow}`; if (cache.has(cacheKey)) return cache.get(cacheKey);
      if (duration > 480 || o.state.performancePolicy?.lowPower || !window.AuralaneBeatDetector) return null;
      const response = await fetch(url, { signal }); if (!response.ok || !response.body || Number(response.headers.get("content-length")) > 20 * 1024 ** 2) throw new Error("Analysis unavailable");
      const chunks = []; let bytes = 0;
      for await (const chunk of response.body) { bytes += chunk.length; if (bytes > 20 * 1024 ** 2) { await response.body.cancel().catch(() => {}); throw new Error("Analysis size limit"); } chunks.push(chunk); }
      signal.throwIfAborted();
      const buffer = new Uint8Array(bytes); let offset = 0; for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.length; }
      // The detector skips a quarter-second in integer sample indices.
      // Use a rate divisible by four; 22050 produces fractional indices.
      const context = new OfflineAudioContext(1, 1, 24000), decoded = await context.decodeAudioData(buffer.buffer);
      signal.throwIfAborted();
      const start = tailWindow ? Math.max(0, decoded.duration - 32) : 0;
      const size = Math.min(14, (decoded.duration - start) / 2);
      if (size < 8) return null;
      const a = await window.AuralaneBeatDetector.guess(decoded, start, size), b = await window.AuralaneBeatDetector.guess(decoded, start + size, size);
      signal.throwIfAborted();
      const result = { bpm: a.tempo || a.bpm, offset: start + a.offset, trusted: Math.abs((a.tempo || a.bpm) - (b.tempo || b.bpm)) < 1.5 };
      cache.set(cacheKey, result); while (cache.size > 8) cache.delete(cache.keys().next().value); return result;
    }
    async function prepare(signature, next, seconds) {
      preparing = true; key = signature; const token = revision; const abort = new AbortController(); controller = abort;
      const signal = AbortSignal.any([abort.signal, AbortSignal.timeout(20000)]);
      try {
        const source = audio.currentSrc, duration = audio.duration, playback = await o.resolve(next);
        if (token !== revision || !playback?.streamUrl || playback.mode === "webview") return;
        let a = null, b = null;
        if (mode() === "smart") {
          try { a = await analyze(source, duration, true, signal); b = await analyze(playback.streamUrl, Number(next.lengthSeconds || next.durationSeconds) || 240, false, signal); } catch { /* Use a genuine crossfade when beat evidence is unavailable. */ }
        }
        if (token !== revision || abort.signal.aborted || disposed) return;
        const strategy = mode() === "smart" ? plan(a, b, duration, seconds) : plan(null, null, duration, seconds);
        const graph = o.graph(true); if (!graph) return;
        tail = new Audio(); tail.crossOrigin = audio.crossOrigin || null; tail.preload = "auto"; tail.src = source;
        tailSource = graph.context.createMediaElementSource(tail); tailGain = graph.context.createGain(); tailGain.gain.value = 0;
        tailSource.connect(tailGain); tailGain.connect(graph.destination);
        tail.addEventListener("loadedmetadata", () => { if (token === revision && tail) tail.currentTime = Math.max(0, strategy.start - 1); }, { once: true }); tail.load();
        prep = { signature, next, playback, strategy }; key = signature;
      } catch { cooldown = performance.now() + 15000; }
      finally { if (token === revision) preparing = false; }
    }
    async function transition() {
      if (!prep || !tail || tail.readyState < 2 || transitioning) return;
      const token = revision, current = prep, graph = o.graph(true); if (!graph) return;
      transitioning = true; expected = current.next.id;
      try {
        const position = audio.currentTime; tail.currentTime = position; tail.volume = audio.volume; tail.muted = audio.muted;
        await tail.play(); if (token !== revision) return;
        graph.gain.gain.setValueAtTime(0, graph.context.currentTime); tailGain.gain.setValueAtTime(1, graph.context.currentTime);
        indicator.textContent = t()[current.strategy.kind === "smart" ? 4 : 5]; indicator.hidden = false;
        handingOver = true;
        const success = await o.play(current.next, { automixTransition: true, preparedPlayback: current.playback, startTime: current.strategy.cue });
        if (token !== revision) return;
        if (success === false || audio.paused) throw new Error("Transition playback unavailable");
        audio.preservesPitch = true; audio.playbackRate = current.strategy.rate;
        if (current.strategy.kind === "smart") {
          const { beat, incomingBeat, outgoingOffset, cue, rate } = current.strategy;
          const phase = ((tail.currentTime - outgoingOffset) % beat + beat) % beat;
          const target = cue + Math.max(0, Math.floor((audio.currentTime - cue) / incomingBeat)) * incomingBeat + phase * rate;
          if (Math.abs(audio.currentTime - target) > .015) await new Promise(resolve => {
            const done = () => { clearTimeout(timeout); audio.removeEventListener("seeked", done); resolve(); };
            const timeout = setTimeout(done, 1000); audio.addEventListener("seeked", done, { once: true }); audio.currentTime = target;
          });
        }
        handingOver = false;
        if (token !== revision || audio.paused || !tail) return;
        const length = Math.max(.2, Math.min(current.strategy.seconds, tail.duration - tail.currentTime));
        const start = graph.context.currentTime;
        graph.gain.gain.setValueCurveAtTime(curve(true), start, length); tailGain.gain.setValueCurveAtTime(curve(false), start, length);
        timer = setInterval(() => {
          if (token !== revision) return;
          if (audio.muted) tail.muted = true; else { tail.muted = false; tail.volume = audio.volume; }
          if (graph.context.currentTime >= start + length) {
            graph.gain.gain.cancelScheduledValues(graph.context.currentTime); graph.gain.gain.setValueAtTime(1, graph.context.currentTime);
            disposeTail(); clearInterval(timer); timer = null; transitioning = false; expected = ""; prep = null; key = ""; indicator.hidden = true;
            audio.playbackRate = o.state.settings.dspSpeed || 1;
          }
        }, 80);
      } catch { if (token === revision) { cancel(); cooldown = performance.now() + 15000; } }
    }
    function tick() {
      if (disposed) return;
      if (transitioning) { if (o.blocked() || (expected && o.state.currentTrack?.id !== expected && audio.currentTime < 1)) cancel(); return; }
      if (blocked()) { if (prep || preparing) cancel(); return; }
      const next = o.next(); if (!next) return;
      const seconds = Math.max(1, Math.min(12, Number(o.state.settings.crossfadeSeconds) || 6));
      const signature = `${o.state.currentTrack.id}|${next.id}|${audio.currentSrc}|${seconds}|${mode()}`;
      if (key && key !== signature) cancel();
      const remaining = audio.duration - audio.currentTime;
      if (!prep && !preparing && performance.now() >= cooldown && remaining <= 60 && remaining > seconds + 2) void prepare(signature, next, seconds);
      if (prep && audio.currentTime >= prep.strategy.start) void transition();
    }
    const transport = () => { if ((transitioning || preparing || prep) && !handingOver) cancel(); };
    function phaseError() {
      if (!prep || !tail || prep.strategy.kind !== "smart" || handingOver) return null;
      const s = prep.strategy, a = ((tail.currentTime - s.outgoingOffset) / s.beat % 1 + 1) % 1, b = ((audio.currentTime - s.cue) / s.incomingBeat % 1 + 1) % 1;
      const delta = Math.abs(a - b); return Math.min(delta, 1 - delta) * s.beat;
    }
    audio.addEventListener("pause", transport); audio.addEventListener("seeking", transport);
    refresh(); return { tick, cancel, refresh, isTransitioning: () => transitioning, getState: () => ({ preparing, prepared: Boolean(prep), transitioning, kind: prep?.strategy.kind || "idle", phaseError: phaseError() }), destroy() { disposed = true; cancel(); audio.removeEventListener("pause", transport); audio.removeEventListener("seeking", transport); setting.remove(); indicator.remove(); } };
  }
  return { plan, curve, init };
});
