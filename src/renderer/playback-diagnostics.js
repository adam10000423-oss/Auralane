(function () {
  "use strict";
  const audio = document.getElementById("audio");
  const grid = document.querySelector("#settingsView .settings-grid");
  if (!audio || !grid || window.auralanePlaybackDiagnostics) return;
  const model = window.AuralanePlaybackDiagnosticsModel.createModel();
  const dictionaries = {
    "zh-TW": ["播放診斷", "來源狀態", "來源", "音訊用戶端", "Itag", "MIME", "位元率", "解析延遲 (IPC)", "解析重試", "媒體重試", "最近錯誤", "複製診斷", "清除最近錯誤", "歌詞來源記錄", "無法取得", "無", "閒置", "解析中", "線上", "已解析", "錯誤", "播放中", "已暫停", "緩衝中", "停滯", "載入中", "就緒", "已結束", "本機", "已下載", "其他", "診斷已複製。", "無法複製診斷。", "最近錯誤已清除。", "候選結果", "正常", "部分失敗"],
    "zh-CN": ["播放诊断", "来源状态", "来源", "音频客户端", "Itag", "MIME", "比特率", "解析延迟 (IPC)", "解析重试", "媒体重试", "最近错误", "复制诊断", "清除最近错误", "歌词来源记录", "无法获取", "无", "空闲", "解析中", "在线", "已解析", "错误", "播放中", "已暂停", "缓冲中", "停滞", "加载中", "就绪", "已结束", "本地", "已下载", "其他", "诊断已复制。", "无法复制诊断。", "最近错误已清除。", "候选结果", "正常", "部分失败"],
    ja: ["再生診断", "ソースの状態", "ソース", "音声クライアント", "Itag", "MIME", "ビットレート", "解決遅延 (IPC)", "解決の再試行", "メディアの再試行", "最近のエラー", "診断をコピー", "最近のエラーを消去", "歌詞ソースの履歴", "取得不可", "なし", "待機", "解決中", "オンライン", "解決済み", "エラー", "再生中", "一時停止", "バッファリング", "停止中", "読み込み中", "準備完了", "終了", "ローカル", "ダウンロード済み", "その他", "診断をコピーしました。", "診断をコピーできません。", "最近のエラーを消去しました。", "候補", "正常", "一部失敗"],
    ko: ["재생 진단", "소스 상태", "소스", "오디오 클라이언트", "Itag", "MIME", "비트 전송률", "확인 지연 (IPC)", "확인 재시도", "미디어 재시도", "최근 오류", "진단 복사", "최근 오류 지우기", "가사 소스 기록", "사용 불가", "없음", "대기", "확인 중", "온라인", "확인됨", "오류", "재생 중", "일시 중지", "버퍼링", "정체", "로딩", "준비됨", "종료", "로컬", "다운로드됨", "기타", "진단이 복사되었습니다.", "진단을 복사할 수 없습니다.", "최근 오류를 지웠습니다.", "후보", "정상", "일부 실패"]
  };
  const english = ["Playback diagnostics", "Source health", "Source", "Audio client", "Itag", "MIME", "Bitrate", "Resolution latency (IPC)", "Resolution retries", "Media retries", "Recent error", "Copy diagnostics", "Clear recent error", "Lyrics source history", "Unavailable", "None", "Idle", "Resolving", "Online", "Resolved", "Error", "Playing", "Paused", "Buffering", "Stalled", "Loading", "Ready", "Ended", "Local", "Downloaded", "Other", "Diagnostics copied.", "Could not copy diagnostics.", "Recent error cleared.", "candidates", "Healthy", "Partial failure"];
  function t(text) {
    const index = english.indexOf(text);
    const language = ({ "zh-Hant": "zh-TW", "zh-Hans": "zh-CN" })[document.documentElement.lang] || document.documentElement.lang;
    return dictionaries[language]?.[index] || text;
  }
  const lyricsHistory = [];
  const card = document.createElement("section");
  card.id = "playbackDiagnostics";
  card.className = "settings-card";
  card.dataset.settingsSection = "playback";
  card.setAttribute("data-i18n-skip", "");
  const heading = document.createElement("h2");
  heading.textContent = "Playback diagnostics";
  card.append(heading);
  const fields = {};
  const labels = [];
  for (const label of ["Source health", "Source", "Audio client", "Itag", "MIME", "Bitrate", "Resolution latency (IPC)", "Resolution retries", "Media retries", "Recent error"]) {
    const row = document.createElement("div");
    row.className = "settings-field";
    const name = document.createElement("strong");
    name.textContent = label;
    labels.push([name, label]);
    const value = document.createElement("span");
    value.className = "playback-diagnostic-value";
    row.append(name, value);
    card.append(row);
    fields[label] = value;
  }
  const lyricsHeading = document.createElement("h3");
  card.append(lyricsHeading);
  const lyricsList = document.createElement("ul");
  lyricsList.className = "playback-diagnostic-history";
  card.append(lyricsList);
  const actions = document.createElement("div");
  actions.className = "playback-diagnostic-actions";
  function button(label, action) {
    const element = document.createElement("button");
    element.type = "button";
    element.className = "secondary-button";
    element.textContent = label;
    element.addEventListener("click", action);
    actions.append(element);
    labels.push([element, label]);
  }
  const feedback = document.createElement("small");
  feedback.setAttribute("role", "status");
  button("Copy diagnostics", async () => {
    try {
      if (!window.metro?.copyText) throw new Error("Clipboard unavailable");
      await window.metro.copyText(JSON.stringify(snapshot(), null, 2));
      feedback.dataset.message = "Diagnostics copied.";
    } catch { feedback.dataset.message = "Could not copy diagnostics."; }
    render();
  });
  button("Clear recent error", () => { model.clearError(); feedback.dataset.message = "Recent error cleared."; render(); });
  actions.append(feedback);
  card.append(actions);
  grid.append(card);
  function render() {
    heading.textContent = t("Playback diagnostics");
    labels.forEach(([element, label]) => { element.textContent = t(label); });
    feedback.textContent = t(feedback.dataset.message || "");
    lyricsHeading.textContent = t("Lyrics source history");
    lyricsList.replaceChildren();
    for (const entry of lyricsHistory) {
      const item = document.createElement("li");
      item.textContent = `${entry.at} | ${entry.providers.join(", ") || t("None")} | ${Math.round(entry.elapsedMs)} ms | ${entry.candidateCount} ${t("candidates")} | ${t(entry.errors.length ? "Partial failure" : "Healthy")}${entry.errors.length ? ": " + entry.errors.map(error => `${error.provider}: ${error.message}`).join("; ") : ""}`;
      lyricsList.append(item);
    }
    if (!lyricsHistory.length) lyricsList.textContent = t("None");
    const state = model.snapshot();
    const values = [state.health, state.source, state.client, state.itag, state.mimeType,
      state.bitrate ? `${Math.round(state.bitrate / 1000)} kbps` : null,
      state.resolutionMs ? `${Math.round(state.resolutionMs)} ms` : null,
      state.resolutionRetries, state.mediaRetries,
      state.recentError ? `${state.recentError.at} | ${state.recentError.stage}: ${state.recentError.message}` : "None"];
    Object.values(fields).forEach((field, index) => { field.textContent = t(values[index] ?? "Unavailable"); });
  }
  function source() {
    const url = audio.getAttribute("src") || "";
    if (!url) return "None";
    if (url.includes("/local-music-audio/")) return "Local";
    if (url.includes("/offline-cache/")) return "Downloaded";
    if (url.includes("/online-audio/") || /^https?:/i.test(url)) return "Online";
    return "Other";
  }
  function update(type = "") {
    if (audio.dataset.gamePlayer) return;
    const codes = { 1: "Playback aborted", 2: "Network error", 3: "Audio decoding failed", 4: "Audio source not supported" };
    model.media(type, source(), audio.dataset, audio.error ? `MediaError ${audio.error.code}: ${codes[audio.error.code] || "Unknown media error"}` : null);
    render();
  }
  const events = ["loadstart", "playing", "pause", "waiting", "stalled", "canplay", "ended", "emptied", "error"];
  const handlers = events.map(type => {
    const handler = () => update(type);
    // Capture before the app's error recovery changes the source or retry dataset.
    audio.addEventListener(type, handler, true);
    return [type, handler];
  });
  const observer = new MutationObserver(records => update(records.some(record => record.attributeName === "src") ? "sourcechange" : ""));
  observer.observe(audio, { attributes: true, attributeFilter: ["src", "data-playback-client", "data-playback-itag", "data-stream-error-retry", "data-playback-request-id"] });
  const unsubscribe = window.metro?.onPlaybackDiagnostic?.(event => {
    if (event.kind === "lyrics") {
      const clean = window.AuralanePlaybackDiagnosticsModel.clean;
      lyricsHistory.unshift({ at: new Date().toISOString(), elapsedMs: Math.max(0, Number(event.elapsedMs) || 0),
        providers: (event.providers || []).slice(0, 16).map(clean), candidateCount: Math.max(0, Number(event.candidateCount) || 0),
        errors: (event.errors || []).slice(0, 16).map(error => ({ provider: clean(error.provider), message: clean(error.message) })) });
      lyricsHistory.length = Math.min(8, lyricsHistory.length);
      render();
      return;
    }
    if (audio.dataset.gamePlayer) return;
    model.resolution(event, event.videoId, Number(audio.dataset.streamErrorRetry) || 0);
    render();
  });
  const nav = document.getElementById("settingsCategoryNav");
  function filter() {
    card.classList.toggle("settings-filtered-out", nav?.querySelector(".active")?.dataset.settingsCategory !== "playback");
  }
  nav?.addEventListener("click", filter);
  filter();
  render();
  const languageObserver = new MutationObserver(render);
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  function snapshot() { return { ...model.snapshot(), lyricsHistory: JSON.parse(JSON.stringify(lyricsHistory)) }; }
  window.auralanePlaybackDiagnostics = Object.freeze({
    getSnapshot: snapshot,
    clearRecentError: () => { model.clearError(); render(); },
    dispose: () => {
      observer.disconnect();
      languageObserver.disconnect();
      unsubscribe?.();
      handlers.forEach(([type, handler]) => audio.removeEventListener(type, handler, true));
      nav?.removeEventListener("click", filter);
      card.remove();
      delete window.auralanePlaybackDiagnostics;
    }
  });
})();
