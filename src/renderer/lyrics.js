const container = document.getElementById("lyricsContainer");
const currentEl = document.getElementById("currentLine");
const secondaryEl = document.getElementById("secondaryLine");
const modeButton = document.getElementById("modeButton");
const dockButton = document.getElementById("dockButton");
const closeButton = document.getElementById("closeButton");

const MODES = ["compact", "next", "translation"];
const MODE_LABELS = {
  compact: "Current lyrics (single line)",
  next: "Current lyrics and next line",
  translation: "Current lyrics and translation"
};
const MODE_STORAGE_KEY = "auralane:desktop-lyrics-mode";

let mode = readMode();
let payload = null;
let renderedLineKey = "";
let animationFrame = 0;
let timelineAnchor = 0;
let timelineAnchorAt = performance.now();
let timelinePlaying = false;
let timelineRate = 1;

const WIDGET_UI_FALLBACKS = {
  en: {},
  "zh-TW": {
    "Current lyrics (single line)": "目前歌詞（單行）", "Current lyrics and next line": "目前歌詞與下一行",
    "Current lyrics and translation": "目前歌詞與翻譯", "Switch display mode": "切換顯示模式",
    "Move to top of screen": "移到螢幕上方", "Close floating lyrics": "關閉浮動歌詞",
    "Drag to move floating lyrics": "拖曳以移動浮動歌詞", "No translation available": "沒有可用的翻譯"
  },
  "zh-CN": {
    "Current lyrics (single line)": "当前歌词（单行）", "Current lyrics and next line": "当前歌词与下一行",
    "Current lyrics and translation": "当前歌词与翻译", "Switch display mode": "切换显示模式",
    "Move to top of screen": "移到屏幕顶部", "Close floating lyrics": "关闭浮动歌词",
    "Drag to move floating lyrics": "拖动以移动浮动歌词", "No translation available": "没有可用的翻译"
  },
  ja: {
    "Current lyrics (single line)": "現在の歌詞（1行）", "Current lyrics and next line": "現在の歌詞と次の行",
    "Current lyrics and translation": "現在の歌詞と翻訳", "Switch display mode": "表示モードを切り替え",
    "Move to top of screen": "画面上部へ移動", "Close floating lyrics": "フローティング歌詞を閉じる",
    "Drag to move floating lyrics": "ドラッグしてフローティング歌詞を移動", "No translation available": "翻訳はありません"
  },
  ko: {
    "Current lyrics (single line)": "현재 가사(한 줄)", "Current lyrics and next line": "현재 가사와 다음 줄",
    "Current lyrics and translation": "현재 가사와 번역", "Switch display mode": "표시 모드 전환",
    "Move to top of screen": "화면 위로 이동", "Close floating lyrics": "플로팅 가사 닫기",
    "Drag to move floating lyrics": "드래그하여 플로팅 가사 이동", "No translation available": "번역 없음"
  }
};

function widgetText(source) {
  const language = payload?.language || "en";
  const dictionary = window.AURALANE_COMPONENT_I18N || {};
  return WIDGET_UI_FALLBACKS[language]?.[source] || dictionary[language]?.[source] || dictionary.en?.[source] || source;
}

function applyWidgetLanguage() {
  const language = payload?.language || "en";
  document.documentElement.lang = { en: "en", "zh-TW": "zh-Hant", "zh-CN": "zh-Hans", ja: "ja", ko: "ko" }[language] || "en";
  document.title = `${widgetText("Desktop lyrics")} · Auralane`;
  const modeLabel = widgetText(MODE_LABELS[mode]);
  modeButton.title = modeLabel;
  modeButton.setAttribute("aria-label", modeLabel);
  dockButton.title = widgetText("Move to top of screen");
  dockButton.setAttribute("aria-label", dockButton.title);
  closeButton.title = widgetText("Close floating lyrics");
  closeButton.setAttribute("aria-label", closeButton.title);
  document.querySelector(".drag-surface")?.setAttribute("title", widgetText("Drag to move floating lyrics"));
}

applyMode(false);
applyWidgetLanguage();
requestAnimationFrame(() => applyMode(true));

window.metro.onLyricUpdate((nextPayload) => {
  if (!nextPayload) return;
  const trackChanged = Boolean(nextPayload.trackId && nextPayload.trackId !== payload?.trackId);
  payload = nextPayload;
  applyWidgetLanguage();
  if (trackChanged) {
    renderedLineKey = "";
    currentEl.replaceChildren();
    secondaryEl.textContent = "";
    secondaryEl.hidden = true;
  }
  applyDisplaySettings(payload.settings || payload);
  applyTheme(payload.themeColor);
  anchorTimeline(payload);
  selectTimelineLine(timelineNow());
  renderPayload();
});

modeButton.addEventListener("click", () => {
  mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
  localStorage.setItem(MODE_STORAGE_KEY, mode);
  applyMode(true);
  renderPayload();
});

dockButton.addEventListener("click", () => {
  window.metro.moveLyricWindowTop();
});

closeButton.addEventListener("click", () => {
  window.metro.toggleLyricWindow();
});

window.addEventListener("resize", fitText, { passive: true });

function readMode() {
  const saved = localStorage.getItem(MODE_STORAGE_KEY);
  return MODES.includes(saved) ? saved : "compact";
}

function applyMode(resizeWindow) {
  container.dataset.mode = mode;
  modeButton.title = widgetText(MODE_LABELS[mode]);
  modeButton.setAttribute("aria-label", modeButton.title);
  if (resizeWindow) {
    const targetHeight = mode === "compact" ? 72 : 104;
    try {
      window.resizeTo(Math.max(360, window.outerWidth), targetHeight);
    } catch {
      // The mode still works when the window manager blocks programmatic resize.
    }
  }
}

function anchorTimeline(nextPayload) {
  const position = Number(nextPayload.position);
  const sentAt = Number(nextPayload.sentAt);
  timelineRate = Math.max(0.25, Math.min(4, Number(nextPayload.playbackRate) || 1));
  timelinePlaying = Boolean(nextPayload.playing);
  const transitSeconds = timelinePlaying && Number.isFinite(sentAt)
    ? Math.max(0, Math.min(0.5, (Date.now() - sentAt) / 1000)) * timelineRate
    : 0;
  timelineAnchor = Number.isFinite(position) ? position + transitSeconds : 0;
  timelineAnchorAt = performance.now();
}

function timelineNow() {
  if (!timelinePlaying) return timelineAnchor;
  return timelineAnchor + ((performance.now() - timelineAnchorAt) / 1000) * timelineRate;
}

function selectTimelineLine(now) {
  const lines = Array.isArray(payload?.lines) ? payload.lines : [];
  if (!lines.length) {
    const nextKey = `plain:${payload?.trackId || payload?.trackTitle || ""}:${payload?.currentLine || ""}`;
    const changed = nextKey !== renderedLineKey || payload.current !== null || payload.next !== null;
    payload.current = null;
    payload.next = null;
    payload.currentLine = payload.trackTitle || payload.currentLine || "Auralane";
    payload.nextLine = payload.nextLine || "";
    return changed;
  }

  let low = 0;
  let high = lines.length - 1;
  let index = -1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    const start = Number(lines[middle]?.time);
    if (Number.isFinite(start) && start <= now) {
      index = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  const current = index >= 0 ? lines[index] : null;
  const next = index + 1 < lines.length ? lines[index + 1] : null;
  const nextKey = current?.key || "";
  const changed = nextKey !== (payload.current?.key || "");
  payload.current = current;
  payload.next = next;
  payload.currentLine = current?.text || payload.trackTitle || "Auralane";
  payload.nextLine = next?.text || "";
  return changed;
}

function renderPayload(scheduleLoop = true) {
  if (!payload) return;
  const line = payload.current;
  const lineKey = line?.key || `plain:${payload.currentLine || ""}`;
  if (lineKey !== renderedLineKey) {
    renderedLineKey = lineKey;
    renderCurrentLine(line, payload.currentLine || "Auralane");
  }
  renderSecondaryLine();
  requestAnimationFrame(fitText);
  if (scheduleLoop) ensureAnimationLoop();
}

function renderCurrentLine(line, fallbackText) {
  currentEl.replaceChildren();
  const words = Array.isArray(line?.words) ? line.words : [];
  const timedWords = words.filter((word) => Number.isFinite(Number(word.start)) && Number.isFinite(Number(word.end)));
  if (!words.length || timedWords.length !== words.length) {
    currentEl.classList.add("plain");
    currentEl.textContent = line?.text || fallbackText;
    return;
  }

  currentEl.classList.remove("plain");
  const fragment = document.createDocumentFragment();
  for (const word of words) {
    if (word.prefix) fragment.append(document.createTextNode(word.prefix));
    const wrapper = document.createElement("span");
    wrapper.className = "karaoke-word";
    wrapper.dataset.start = String(word.start);
    wrapper.dataset.end = String(word.end);

    const base = document.createElement("span");
    base.textContent = word.text;
    const fill = document.createElement("span");
    fill.className = "karaoke-word-fill";
    fill.textContent = word.text;
    fill.setAttribute("aria-hidden", "true");
    wrapper.append(base, fill);
    fragment.append(wrapper);
    if (word.suffix) fragment.append(document.createTextNode(word.suffix));
  }
  currentEl.append(fragment);
}

function renderSecondaryLine() {
  const current = payload?.current;
  const next = payload?.next;
  let text = "";
  if (mode === "next") text = next?.text || payload?.nextLine || "";
  if (mode === "translation") {
    text = current?.translation || current?.romanization || widgetText("No translation available");
  }
  secondaryEl.textContent = text;
  secondaryEl.hidden = mode === "compact" || !text;
}

function ensureAnimationLoop() {
  if (animationFrame) return;
  const tick = () => {
    animationFrame = 0;
    const now = timelineNow();
    if (selectTimelineLine(now)) renderPayload(false);
    updateWordProgress(now);
    if (timelinePlaying && (Array.isArray(payload?.lines) || currentEl.querySelector(".karaoke-word"))) {
      animationFrame = requestAnimationFrame(tick);
    }
  };
  animationFrame = requestAnimationFrame(tick);
}

function updateWordProgress(now) {
  for (const word of currentEl.querySelectorAll(".karaoke-word")) {
    const start = Number(word.dataset.start);
    const end = Number(word.dataset.end);
    const progress = now <= start ? 0 : now >= end ? 100 : ((now - start) / Math.max(0.01, end - start)) * 100;
    const rounded = Math.round(Math.max(0, Math.min(100, progress)) * 2) / 2;
    if (word._lastProgress !== rounded) {
      word.style.setProperty("--word-progress", `${rounded}%`);
      word._lastProgress = rounded;
    }
    word.classList.toggle("current", now >= start && now < end);
  }
}

function fitText() {
  fitElement(currentEl, 25, 15);
  fitElement(secondaryEl, 14, 11);
}

function fitElement(element, preferredSize, minimumSize) {
  element.style.fontSize = `${preferredSize}px`;
  if (element.hidden || element.clientWidth <= 0 || element.scrollWidth <= element.clientWidth) return;
  const fitted = Math.max(minimumSize, Math.floor(preferredSize * element.clientWidth / element.scrollWidth));
  element.style.fontSize = `${fitted}px`;
}

function applyDisplaySettings(settings = {}) {
  const opacity = Math.max(20, Math.min(95, Number(settings.opacity ?? settings.desktopLyricsOpacity ?? 65))) / 100;
  const panelOpacity = 0.46 + opacity * 0.34;
  document.documentElement.style.setProperty("--panel-opacity", panelOpacity.toFixed(2));
  document.documentElement.style.setProperty("--panel-hover-opacity", Math.min(0.86, panelOpacity + 0.08).toFixed(2));
  const font = ["system", "serif", "mono"].includes(settings.font) ? settings.font : "system";
  if (font === "system") document.documentElement.removeAttribute("data-font");
  else document.documentElement.dataset.font = font;
}

function applyTheme(themeColor) {
  if (!themeColor) return;
  document.documentElement.style.setProperty("--theme-color", themeColor);
  const rgb = parseRGB(themeColor);
  if (rgb) {
    document.documentElement.style.setProperty("--theme-color-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    const readable = readableLyricsAccent(rgb);
    document.documentElement.style.setProperty("--lyrics-accent-rgb", `${readable.r}, ${readable.g}, ${readable.b}`);
  }
}

function readableLyricsAccent(rgb) {
  const color = {
    r: Math.max(0, Math.min(255, Number(rgb.r) || 0)),
    g: Math.max(0, Math.min(255, Number(rgb.g) || 0)),
    b: Math.max(0, Math.min(255, Number(rgb.b) || 0))
  };
  while (relativeLuminance(color) < 0.5) {
    color.r += (255 - color.r) * 0.1;
    color.g += (255 - color.g) * 0.1;
    color.b += (255 - color.b) * 0.1;
  }
  return {
    r: Math.round(color.r),
    g: Math.round(color.g),
    b: Math.round(color.b)
  };
}

function relativeLuminance({ r, g, b }) {
  const channel = (value) => {
    const normalized = value / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return channel(r) * 0.2126 + channel(g) * 0.7152 + channel(b) * 0.0722;
}

function parseRGB(color) {
  const value = String(color || "").trim();
  if (value.startsWith("rgb")) {
    const parts = value.match(/[\d.]+/g);
    if (parts?.length >= 3) return { r: parts[0], g: parts[1], b: parts[2] };
  }
  const hex = value.replace(/^#/, "");
  if (/^[\da-f]{3}$/i.test(hex)) {
    return { r: parseInt(hex[0] + hex[0], 16), g: parseInt(hex[1] + hex[1], 16), b: parseInt(hex[2] + hex[2], 16) };
  }
  if (/^[\da-f]{6}$/i.test(hex)) {
    return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
  }
  return null;
}
