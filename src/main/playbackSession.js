function sanitizePlaybackSession(payload = {}) {
  const track = payload?.track && typeof payload.track === "object" ? payload.track : null;
  const currentTime = Number(payload?.currentTime || 0);
  const duration = Number(payload?.duration || 0);
  return {
    track: track?.id || track?.videoId ? track : null,
    currentTime: Number.isFinite(currentTime) && currentTime > 0 ? Math.floor(currentTime) : 0,
    duration: Number.isFinite(duration) && duration > 0 ? Math.floor(duration) : 0,
    currentIndex: Number.isFinite(Number(payload?.currentIndex)) ? Number(payload.currentIndex) : -1,
    playbackMode: String(payload?.playbackMode || "idle"),
    wasPlaying: Boolean(payload?.wasPlaying),
    shuffleEnabled: Boolean(payload?.shuffleEnabled),
    repeatMode: ["off", "all", "one"].includes(payload?.repeatMode) ? payload.repeatMode : "off",
    view: String(payload?.view || "home"),
    sidePanel: payload?.sidePanel === "lyrics" ? "lyrics" : "queue",
    lyricsExpanded: Boolean(payload?.lyricsExpanded),
    searchQuery: String(payload?.searchQuery || "").slice(0, 200),
    searchFilter: String(payload?.searchFilter || "top"),
    savedAt: payload?.savedAt || new Date().toISOString()
  };
}

function mergePlaybackSession(previousSession, payload = {}) {
  const next = sanitizePlaybackSession(payload);
  if (payload?.clearTrack === true || next.track) return next;

  const previous = sanitizePlaybackSession(previousSession || {});
  if (!previous.track) return next;

  // Renderer startup, a stopped queue, or a late unload event must not erase
  // the last playable track. It remains paused and can be resumed explicitly.
  return {
    ...next,
    track: previous.track,
    currentTime: previous.currentTime,
    duration: previous.duration,
    currentIndex: previous.currentIndex,
    playbackMode: "idle",
    wasPlaying: false,
    shuffleEnabled: previous.shuffleEnabled,
    repeatMode: previous.repeatMode
  };
}

module.exports = { sanitizePlaybackSession, mergePlaybackSession };
