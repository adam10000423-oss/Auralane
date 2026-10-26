(function (root) {
  "use strict";
  function clean(value) {
    return String(value || "").replace(/(?:https?:\/\/|file:\/\/)[^\s<>"']+/gi, "[redacted URL]")
      .replace(/[A-Za-z]:[\\/][^\r\n<>"']+/g, "[redacted path]").slice(0, 500);
  }
  function positive(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : null;
  }
  function createModel() {
    let current = { request: "", health: "Idle", source: "None", client: null, itag: null,
      mimeType: null, bitrate: null, resolutionMs: null, resolutionRetries: 0, mediaRetries: 0 };
    let recentError = null;
    let latest = 0;
    let activeRequest = "";
    const pending = new Map();
    function error(message, stage) {
      recentError = { at: new Date().toISOString(), stage, message: clean(message),
        client: current.client, itag: current.itag, source: current.source };
      current.health = "Error";
    }
    return {
      resolution(event, request, mediaRetries = 0) {
        request = String(request || "");
        if (event.phase === "start") {
          if (request !== activeRequest || !event.retry) {
            current.resolutionRetries = mediaRetries > 0 ? current.resolutionRetries : 0;
            current.mediaRetries = mediaRetries > 0 ? Math.max(current.mediaRetries, mediaRetries) : 0;
          } else current.resolutionRetries += 1;
          activeRequest = request;
          latest = event.id;
          pending.set(event.id, request);
          if (pending.size > 16) pending.delete(pending.keys().next().value);
          Object.assign(current, { request, health: "Resolving", source: "Online", client: null,
            itag: null, mimeType: null, bitrate: null, resolutionMs: null });
          return;
        }
        const belongs = pending.get(event.id);
        pending.delete(event.id);
        if (belongs === undefined || belongs !== request || latest !== event.id) return;
        Object.assign(current, { resolutionMs: positive(event.resolutionMs), client: clean(event.client) || null,
          itag: positive(event.itag), mimeType: clean(event.mimeType) || null, bitrate: positive(event.bitrate) });
        if (event.phase === "error" || !event.hasStream || event.mode === "webview") {
          error(event.reason || "No direct audio stream returned.", "resolution");
        } else current.health = "Resolved";
      },
      media(type, source, dataset, mediaError) {
        if (dataset.gamePlayer) return;
        if (source !== "Online" && (current.health !== "Resolving" || type === "sourcechange" || type === "loadstart")) {
          Object.assign(current, { source, client: null, itag: null, mimeType: null, bitrate: null,
            resolutionMs: null, resolutionRetries: 0, mediaRetries: 0 });
          activeRequest = "";
          latest = 0;
          pending.clear();
        }
        current.request = String(dataset.playbackRequestId || "");
        if (source === "Online") {
          current.mediaRetries = Math.max(current.mediaRetries, Number(dataset.streamErrorRetry) || 0);
          current.client = clean(dataset.playbackClient) || current.client;
          current.itag = positive(dataset.playbackItag) || current.itag;
        }
        if (type === "error") error(mediaError || "Media playback failed.", "media");
        else if (type) current.health = ({ playing: "Playing", pause: "Paused", waiting: "Buffering",
          stalled: "Stalled", loadstart: "Loading", canplay: "Ready", ended: "Ended", emptied: "Idle" })[type] || current.health;
      },
      clearError() { recentError = null; },
      snapshot() { return JSON.parse(JSON.stringify({ ...current, recentError })); }
    };
  }
  const api = { createModel, clean };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AuralanePlaybackDiagnosticsModel = api;
})(typeof window === "object" ? window : globalThis);
