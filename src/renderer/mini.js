const els = {
  dragHandle: document.querySelector(".mini-drag-hint"),
  shell: document.getElementById("miniShell"),
  bg: document.getElementById("miniBg"),
  artButton: document.getElementById("miniArtButton"),
  art: document.getElementById("miniArt"),
  trackInfo: document.getElementById("trackInfoButton"),
  title: document.getElementById("miniTitle"),
  artist: document.getElementById("miniArtist"),
  currentTime: document.getElementById("miniCurrentTime"),
  duration: document.getElementById("miniDuration"),
  seek: document.getElementById("miniSeek"),
  previous: document.getElementById("previousButton"),
  play: document.getElementById("playButton"),
  next: document.getElementById("nextButton"),
  like: document.getElementById("likeButton"),
  volumeButton: document.getElementById("volumeButton"),
  volumePopover: document.getElementById("volumePopover"),
  volume: document.getElementById("volumeRange"),
  pin: document.getElementById("pinButton"),
  restore: document.getElementById("restoreButton"),
  close: document.getElementById("closeButton")
};

const ICON_PATHS = {
  "grip-horizontal": '<circle cx="6" cy="9" r="1"/><circle cx="12" cy="9" r="1"/><circle cx="18" cy="9" r="1"/><circle cx="6" cy="15" r="1"/><circle cx="12" cy="15" r="1"/><circle cx="18" cy="15" r="1"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  "skip-back": '<polygon points="19 20 9 12 19 4 19 20"/><path d="M5 19V5"/>',
  "skip-forward": '<polygon points="5 4 15 12 5 20 5 4"/><path d="M19 5v14"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/>',
  "volume-2": '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  "volume-1": '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>',
  "volume-x": '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>',
  pin: '<path d="M12 17v5"/><path d="M5 17h14"/><path d="M6 3h12"/><path d="M8 3v7l-2 2v2h12v-2l-2-2V3"/>',
  "pin-off": '<path d="m2 2 20 20"/><path d="M12 17v5"/><path d="M5 17h12"/><path d="M6 3h12"/><path d="M8 3v5"/><path d="m16 8 2 4v2h-4"/>',
  "maximize-2": '<path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="M9 21H3v-6"/><path d="m3 21 7-7"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
};

const state = {
  payload: null,
  seeking: false,
  alwaysOnTop: true,
  timelineAnchor: 0,
  timelineAnchorAt: performance.now(),
  timelinePlaying: false,
  playbackRate: 1,
  animationFrame: 0,
  dragPointerId: null
};

const MINI_UI_FALLBACKS = {
  en: {},
  "zh-TW": {
    "Open main window": "開啟主視窗", "Open current song in main window": "在主視窗開啟目前歌曲",
    "Playback progress": "播放進度", "Playback controls": "播放控制", "Adjust volume": "調整音量",
    Volume: "音量", Previous: "上一首", Play: "播放", Pause: "暫停", Next: "下一首",
    "Like current song": "喜歡目前歌曲", Unlike: "取消喜歡", "Keep on top": "保持置頂",
    "Cancel always on top": "取消置頂", "Close mini player": "關閉迷你播放器", Close: "關閉",
    "Nothing playing": "尚未播放歌曲", "Unknown song": "未知歌曲", "Window controls": "視窗控制",
    "Drag to move mini player": "拖曳以移動迷你播放器"
  },
  "zh-CN": {
    "Open main window": "打开主窗口", "Open current song in main window": "在主窗口打开当前歌曲",
    "Playback progress": "播放进度", "Playback controls": "播放控制", "Adjust volume": "调整音量",
    Volume: "音量", Previous: "上一首", Play: "播放", Pause: "暂停", Next: "下一首",
    "Like current song": "喜欢当前歌曲", Unlike: "取消喜欢", "Keep on top": "保持置顶",
    "Cancel always on top": "取消置顶", "Close mini player": "关闭迷你播放器", Close: "关闭",
    "Nothing playing": "尚未播放歌曲", "Unknown song": "未知歌曲", "Window controls": "窗口控制",
    "Drag to move mini player": "拖动以移动迷你播放器"
  },
  ja: {
    "Open main window": "メインウィンドウを開く", "Open current song in main window": "現在の曲をメインウィンドウで開く",
    "Playback progress": "再生位置", "Playback controls": "再生コントロール", "Adjust volume": "音量を調整",
    Volume: "音量", Previous: "前へ", Play: "再生", Pause: "一時停止", Next: "次へ",
    "Like current song": "現在の曲にいいね", Unlike: "いいねを取り消す", "Keep on top": "常に手前に表示",
    "Cancel always on top": "常に手前を解除", "Close mini player": "ミニプレーヤーを閉じる", Close: "閉じる",
    "Nothing playing": "再生中の曲はありません", "Unknown song": "不明な曲", "Window controls": "ウィンドウ操作",
    "Drag to move mini player": "ドラッグしてミニプレーヤーを移動"
  },
  ko: {
    "Open main window": "메인 창 열기", "Open current song in main window": "현재 곡을 메인 창에서 열기",
    "Playback progress": "재생 진행률", "Playback controls": "재생 컨트롤", "Adjust volume": "볼륨 조절",
    Volume: "볼륨", Previous: "이전", Play: "재생", Pause: "일시중지", Next: "다음",
    "Like current song": "현재 곡 좋아요", Unlike: "좋아요 취소", "Keep on top": "항상 위에 표시",
    "Cancel always on top": "항상 위에 표시 해제", "Close mini player": "미니 플레이어 닫기", Close: "닫기",
    "Nothing playing": "재생 중인 곡 없음", "Unknown song": "알 수 없는 곡", "Window controls": "창 제어",
    "Drag to move mini player": "드래그하여 미니 플레이어 이동"
  }
};

function miniText(source) {
  const language = state.payload?.language || "en";
  const dictionary = window.AURALANE_COMPONENT_I18N || {};
  return MINI_UI_FALLBACKS[language]?.[source] || dictionary[language]?.[source] || dictionary.en?.[source] || source;
}

function applyMiniLanguage() {
  document.title = `${miniText("Mini player")} · Auralane`;
  const labels = [
    [els.artButton, "aria-label", "Open main window"],
    [els.trackInfo, "aria-label", "Open current song in main window"],
    [els.seek, "aria-label", "Playback progress"],
    [document.querySelector(".mini-controls"), "aria-label", "Playback controls"],
    [document.querySelector(".mini-window-actions"), "aria-label", "Window controls"],
    [els.volumeButton, "aria-label", "Adjust volume"], [els.volumeButton, "title", "Volume"],
    [els.volume, "aria-label", "Volume"],
    [els.previous, "aria-label", "Previous"], [els.previous, "title", "Previous"],
    [els.play, "aria-label", state.payload?.playing ? "Pause" : "Play"],
    [els.play, "title", state.payload?.playing ? "Pause" : "Play"],
    [els.next, "aria-label", "Next"], [els.next, "title", "Next"],
    [els.like, "aria-label", state.payload?.track?.liked ? "Unlike" : "Like current song"],
    [els.like, "title", state.payload?.track?.liked ? "Unlike" : "Like current song"],
    [els.pin, "title", state.alwaysOnTop ? "Keep on top" : "Cancel always on top"],
    [els.pin, "aria-label", state.alwaysOnTop ? "Keep on top" : "Cancel always on top"],
    [els.restore, "aria-label", "Open main window"], [els.restore, "title", "Open main window"],
    [els.close, "aria-label", "Close mini player"], [els.close, "title", "Close"]
  ];
  for (const [element, attribute, source] of labels) if (element) element.setAttribute(attribute, miniText(source));
  const dragHandle = document.querySelector(".mini-drag-hint");
  if (dragHandle) dragHandle.title = miniText("Drag to move mini player");
}

for (const icon of document.querySelectorAll("[data-mini-icon]")) {
  setIcon(icon, icon.dataset.miniIcon);
}

function iconSvg(name) {
  return `<svg class="icon-${name}" viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;
}

function setIcon(target, name) {
  const host = target?.matches?.("[data-mini-icon]") ? target : target?.querySelector?.("[data-mini-icon]");
  if (!host || !ICON_PATHS[name]) return;
  host.dataset.miniIcon = name;
  host.innerHTML = iconSvg(name);
}

function formatClock(seconds) {
  const value = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(value / 60);
  const wholeSeconds = Math.floor(value % 60);
  return `${minutes}:${String(wholeSeconds).padStart(2, "0")}`;
}

function normalizeRgb(rgb) {
  const fallback = [255, 92, 104];
  const source = Array.isArray(rgb) ? rgb : fallback;
  return fallback.map((fallbackValue, index) => {
    const value = Number(source[index]);
    return Math.max(0, Math.min(255, Number.isFinite(value) ? Math.round(value) : fallbackValue));
  });
}

function applyThemeColor(rgb) {
  document.documentElement.style.setProperty("--theme-color", normalizeRgb(rgb).join(", "));
}

function setButtonState(button, active, disabled = false) {
  if (!button) return;
  button.classList.toggle("active", Boolean(active));
  button.disabled = Boolean(disabled);
}

function safeArtworkUrl(value) {
  return String(value || "").replace(/["\\\n\r]/g, (character) => encodeURIComponent(character));
}

function anchorTimeline(payload) {
  const rate = Math.max(0.25, Math.min(4, Number(payload?.playbackRate) || 1));
  const sentAt = Number(payload?.sentAt);
  const transit = payload?.playing && Number.isFinite(sentAt)
    ? Math.max(0, Math.min(0.5, (Date.now() - sentAt) / 1000)) * rate
    : 0;
  state.timelineAnchor = Math.max(0, Number(payload?.currentTime) || 0) + transit;
  state.timelineAnchorAt = performance.now();
  state.timelinePlaying = Boolean(payload?.playing);
  state.playbackRate = rate;
}

function timelineNow() {
  const elapsed = state.timelinePlaying ? ((performance.now() - state.timelineAnchorAt) / 1000) * state.playbackRate : 0;
  const duration = Number(state.payload?.duration) || 0;
  return duration ? Math.min(duration, state.timelineAnchor + elapsed) : state.timelineAnchor + elapsed;
}

function renderProgress(seconds = timelineNow()) {
  const duration = Number(state.payload?.duration) || 0;
  const progress = duration ? Math.max(0, Math.min(1000, (seconds / duration) * 1000)) : 0;
  if (!state.seeking) els.seek.value = String(progress);
  els.seek.style.setProperty("--range-progress", `${progress / 10}%`);
  els.currentTime.textContent = formatClock(seconds);
  els.duration.textContent = state.payload?.playbackMode === "embed" ? "Web" : formatClock(duration);
}

function ensureTimelineAnimation() {
  if (state.animationFrame) return;
  const tick = () => {
    state.animationFrame = 0;
    if (!state.seeking) renderProgress();
    if (state.timelinePlaying) state.animationFrame = requestAnimationFrame(tick);
  };
  state.animationFrame = requestAnimationFrame(tick);
}

function updateVolumePresentation(volume) {
  const value = Math.max(0, Math.min(1, Number(volume) || 0));
  els.volume.value = String(value);
  els.volume.style.setProperty("--range-progress", `${value * 100}%`);
  setIcon(els.volumeButton, value <= 0 ? "volume-x" : value < 0.5 ? "volume-1" : "volume-2");
  els.volumeButton.title = `${miniText("Volume")} ${Math.round(value * 100)}%`;
  els.volumeButton.setAttribute("aria-label", els.volumeButton.title);
}

function renderEmpty() {
  applyMiniLanguage();
  document.body.classList.add("mini-empty");
  document.body.classList.remove("mini-playing");
  els.bg.style.backgroundImage = "";
  els.art.style.backgroundImage = "";
  els.title.textContent = miniText("Nothing playing");
  els.artist.textContent = "Auralane";
  els.seek.disabled = true;
  setButtonState(els.previous, false, true);
  setButtonState(els.play, false, true);
  setButtonState(els.next, false, true);
  setButtonState(els.like, false, true);
  setIcon(els.play, "play");
  renderProgress(0);
  updateVolumePresentation(1);
}

function render(payload = state.payload) {
  state.payload = payload || null;
  applyMiniLanguage();
  if (payload?.themeColor) applyThemeColor(payload.themeColor);
  const track = payload?.track || null;
  if (!track) {
    state.timelinePlaying = false;
    renderEmpty();
    return;
  }

  document.body.classList.remove("mini-empty");
  document.body.classList.toggle("mini-playing", Boolean(payload.playing));
  const artwork = safeArtworkUrl(track.thumbnail);
  const artworkImage = artwork ? `url("${artwork}")` : "";
  els.bg.style.backgroundImage = artworkImage;
  els.art.style.backgroundImage = artworkImage;
  els.title.textContent = track.title || miniText("Unknown song");
  els.artist.textContent = track.artist || track.subtitle || "YouTube Music";

  anchorTimeline(payload);
  els.seek.disabled = !payload.canSeek;
  renderProgress();
  ensureTimelineAnimation();
  updateVolumePresentation(payload.volume);

  setButtonState(els.previous, false, !payload.hasPrevious);
  setButtonState(els.play, payload.playing, false);
  setButtonState(els.next, false, !payload.hasNext);
  setButtonState(els.like, track.liked, false);
  setIcon(els.play, payload.playing ? "pause" : "play");

  const playLabel = miniText(payload.playing ? "Pause" : "Play");
  els.play.title = playLabel;
  els.play.setAttribute("aria-label", playLabel);
  const likeLabel = miniText(track.liked ? "Unlike" : "Like current song");
  els.like.title = likeLabel;
  els.like.setAttribute("aria-label", likeLabel);
}

function send(command, payload = {}) {
  window.metro?.sendMiniPlayerCommand?.({ command, ...payload });
}

function showMainWindow() {
  send("restore-main");
}

function setVolumePopover(open) {
  els.volumePopover.hidden = !open;
  els.volumeButton.setAttribute("aria-expanded", String(open));
}

els.play.addEventListener("click", () => send("play-toggle"));
els.previous.addEventListener("click", () => send("previous"));
els.next.addEventListener("click", () => send("next"));
els.like.addEventListener("click", () => send("like"));
els.artButton.addEventListener("click", showMainWindow);
els.trackInfo.addEventListener("click", showMainWindow);

els.dragHandle.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  state.dragPointerId = event.pointerId;
  els.dragHandle.setPointerCapture(event.pointerId);
  els.dragHandle.classList.add("dragging");
  window.metro?.startMiniDrag?.({ screenX: event.screenX, screenY: event.screenY });
  event.preventDefault();
});

els.dragHandle.addEventListener("pointermove", (event) => {
  if (state.dragPointerId !== event.pointerId) return;
  window.metro?.moveMiniDrag?.({ screenX: event.screenX, screenY: event.screenY });
});

function endMiniDrag(event) {
  if (state.dragPointerId === null || (event && event.pointerId !== state.dragPointerId)) return;
  if (els.dragHandle.hasPointerCapture(state.dragPointerId)) {
    els.dragHandle.releasePointerCapture(state.dragPointerId);
  }
  state.dragPointerId = null;
  els.dragHandle.classList.remove("dragging");
  window.metro?.endMiniDrag?.();
}

els.dragHandle.addEventListener("pointerup", endMiniDrag);
els.dragHandle.addEventListener("pointercancel", endMiniDrag);
els.dragHandle.addEventListener("lostpointercapture", endMiniDrag);

els.seek.addEventListener("input", () => {
  state.seeking = true;
  const duration = Number(state.payload?.duration) || 0;
  const seconds = duration ? (Number(els.seek.value) / 1000) * duration : 0;
  els.seek.style.setProperty("--range-progress", `${Number(els.seek.value) / 10}%`);
  els.currentTime.textContent = formatClock(seconds);
});

els.seek.addEventListener("change", () => {
  const duration = Number(state.payload?.duration) || 0;
  const seconds = duration ? (Number(els.seek.value) / 1000) * duration : 0;
  state.seeking = false;
  state.timelineAnchor = seconds;
  state.timelineAnchorAt = performance.now();
  send("seek", { seconds });
  ensureTimelineAnimation();
});

els.volumeButton.addEventListener("click", (event) => {
  event.stopPropagation();
  setVolumePopover(els.volumePopover.hidden);
});

els.volumePopover.addEventListener("click", (event) => event.stopPropagation());
els.volume.addEventListener("input", () => {
  const volume = Number(els.volume.value);
  updateVolumePresentation(volume);
  send("volume", { volume });
});

document.addEventListener("click", () => setVolumePopover(false));

els.pin.addEventListener("click", async () => {
  state.alwaysOnTop = !state.alwaysOnTop;
  const result = await window.metro?.setMiniAlwaysOnTop?.(state.alwaysOnTop);
  if (result && Object.prototype.hasOwnProperty.call(result, "alwaysOnTop")) {
    state.alwaysOnTop = Boolean(result.alwaysOnTop);
  }
  renderPinState();
});

function renderPinState() {
  els.pin.classList.toggle("active", state.alwaysOnTop);
  setIcon(els.pin, state.alwaysOnTop ? "pin" : "pin-off");
  const label = miniText(state.alwaysOnTop ? "Cancel always on top" : "Keep on top");
  els.pin.title = label;
  els.pin.setAttribute("aria-label", label);
}

els.restore.addEventListener("click", showMainWindow);
els.close.addEventListener("click", () => window.metro?.closeMiniPlayer?.());

window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "w") {
    event.preventDefault();
    window.metro?.closeMiniPlayer?.();
    return;
  }
  if (event.key === "Escape") {
    setVolumePopover(false);
    return;
  }
  if (event.code === "Space" && event.target?.tagName !== "INPUT") {
    event.preventDefault();
    send("play-toggle");
  }
});

window.metro?.onMiniPlayerState?.((payload) => render(payload));
window.metro?.onMiniPlayerWindowState?.((payload) => {
  if (!payload || !Object.prototype.hasOwnProperty.call(payload, "alwaysOnTop")) return;
  state.alwaysOnTop = Boolean(payload.alwaysOnTop);
  renderPinState();
});

renderEmpty();
renderPinState();
window.metro?.miniPlayerReady?.().then((result) => {
  if (result && Object.prototype.hasOwnProperty.call(result, "alwaysOnTop")) {
    state.alwaysOnTop = Boolean(result.alwaysOnTop);
    renderPinState();
  }
});
