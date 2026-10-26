(function (root) {
  "use strict";
  const live = new Set();
  function surface(word) {
    return word._fillSurface || (word._fillSurface = word.querySelector(".lyric-word-fill"));
  }
  function clip(word, progress) {
    const remaining = Math.max(0, Math.min(100, 100 - progress));
    return word.closest("[dir]")?.getAttribute("dir") === "rtl"
      ? `inset(0px 0px 0px ${remaining}%)`
      : `inset(0px ${remaining}% 0px 0px)`;
  }
  function reset(word, progress = "0%") {
    const overlay = surface(word);
    if (overlay) overlay.style.clipPath = clip(word, parseFloat(progress) || 0);
    word.classList.toggle("lyric-fill-complete", parseFloat(progress) >= 100);
    word.style.setProperty("--lyric-fill-progress", progress);
    word._fillAnimation?.cancel(); word._fillAnimation = null; live.delete(word);
  }
  function update(word, now, audio, playing) {
    for (const previous of live) if (!previous.isConnected) reset(previous);
    const start = Number(word.dataset.start), end = Number(word.dataset.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return;
    const duration = (end - start) * 1000;
    const time = Math.max(0, Math.min(duration, (now - start) * 1000));
    const overlay = surface(word);
    if (!overlay) return;
    const active = time > 0 && time < duration;
    if (active) word.classList.remove("lyric-fill-complete");
    if (!active) {
      const value = time >= duration ? "100%" : "0%";
      if (word._fillAnimation) { reset(word, value); return; }
      if (word.style.getPropertyValue("--lyric-fill-progress") !== value) reset(word, value);
      return;
    }
    let animation = word._fillAnimation;
    if (!animation) {
      word.style.setProperty("--lyric-fill-progress", `${time / duration * 100}%`);
      overlay.style.clipPath = clip(word, time / duration * 100);
      // Animate a native clipping property over solid text, not a custom
      // property inside transparent background-clipped glyphs.
      animation = overlay.animate([{ clipPath: clip(word, 0) }, { clipPath: clip(word, 100) }], { duration, easing: "linear", fill: "both" });
      animation.id = "auralane-word-fill";
      word._fillAnimation = animation; live.add(word);
      animation.currentTime = time;
      animation.onfinish = () => {
        if (word._fillAnimation === animation) {
          word.style.setProperty("--lyric-fill-progress", "100%");
          word.classList.add("lyric-fill-complete");
        }
      };
    }
    const rate = Number(audio?.playbackRate) || 1;
    if (animation.playbackRate !== rate) animation.updatePlaybackRate(rate);
    // Audio remains authoritative, including stalls, seeking and rate changes.
    if (Math.abs(Number(animation.currentTime) - time) > 45) animation.currentTime = time;
    if (playing && !audio?.paused && !audio?.seeking && (audio?.readyState ?? 4) >= 3) {
      if (animation.playState !== "running") animation.play();
    } else if (animation.playState !== "paused") { animation.pause(); animation.currentTime = time; }
  }
  function pause() { for (const word of live) { if (!word.isConnected) reset(word); else word._fillAnimation?.pause(); } }
  function clear() { for (const word of [...live]) reset(word); }
  document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });
  root.AuralaneLyricFill = { update, reset, pause, clear };
})(globalThis);
