(function () {
  "use strict";
  const words = {
    en: ["Offline translation", "Download from GitHub", "Delete downloaded files", "Cancel download", "Not downloaded · Online translation remains available", "Installed", "Installing…", "Download failed. Please retry.", "Windows x64 only", "Delete offline translation and its cache?", "Download"],
    "zh-TW": ["離線翻譯", "從 GitHub 下載", "刪除下載檔案", "取消下載", "尚未下載 · 仍可使用線上翻譯", "已安裝", "安裝中…", "下載失敗，請重試。", "目前僅支援 Windows x64", "刪除離線翻譯及其快取？", "下載"],
    "zh-CN": ["离线翻译", "从 GitHub 下载", "删除下载文件", "取消下载", "尚未下载 · 仍可使用在线翻译", "已安装", "安装中…", "下载失败，请重试。", "目前仅支持 Windows x64", "删除离线翻译及其缓存？", "下载"],
    ja: ["オフライン翻訳", "GitHub からダウンロード", "ダウンロード済みファイルを削除", "ダウンロードを中止", "未ダウンロード · オンライン翻訳は利用できます", "インストール済み", "インストール中…", "ダウンロード失敗。再試行してください。", "Windows x64 のみ対応", "オフライン翻訳とキャッシュを削除しますか？", "ダウンロード"],
    ko: ["오프라인 번역", "GitHub에서 다운로드", "다운로드 파일 삭제", "다운로드 취소", "다운로드 안 됨 · 온라인 번역 사용 가능", "설치됨", "설치 중…", "다운로드 실패. 다시 시도하세요.", "Windows x64만 지원", "오프라인 번역과 캐시를 삭제할까요?", "다운로드"]
  };
  window.AuralaneTranslationPack = { init({ language, setIconButton }) {
    const parent = document.getElementById("settingsLyricsTranslateTarget")?.closest(".settings-field");
    if (!parent) return null;
    const row = document.createElement("div"); row.className = "settings-field offline-translation-setting";
    const label = document.createElement("span"), title = document.createElement("strong"), status = document.createElement("small");
    status.setAttribute("role", "status"); label.append(title, status);
    const controls = document.createElement("div"); controls.className = "offline-translation-controls";
    const progress = document.createElement("progress"); progress.max = 1; progress.hidden = true;
    const action = document.createElement("button"); action.type = "button"; action.className = "icon-button";
    controls.append(progress, action); row.append(label, controls); parent.after(row);
    let value = null, busy = false, failed = false;
    const text = () => words[language()] || words.en;
    function render() {
      const t = text(); title.textContent = t[0];
      const active = value?.phase === "downloading" || value?.phase === "installing";
      const percent = Math.min(100, Math.floor((value?.received || 0) / (value?.total || 1) * 100));
      status.textContent = failed || value?.error ? t[7] : !value ? "…" : !value.supported ? t[8] : value.phase === "installing" ? t[6] : active ? `${t[10]} ${percent}%` : value.installed ? t[5] : `${t[4]} · ${Math.ceil(value.total / 1024 ** 2)} MB`;
      progress.hidden = !active; progress.value = percent / 100;
      progress.setAttribute("aria-label", t[10]);
      setIconButton(action, active ? "close" : value?.installed ? "trash" : "download", active ? t[3] : value?.installed ? t[2] : t[1]);
      action.disabled = busy || !value?.supported;
    }
    async function request(type) {
      const response = await window.metro.featureRequest({ type: `translation.${type}`, payload: {} });
      if (!response.ok) throw new Error(response.error?.message || "Translation unavailable");
      value = response.value; failed = false; render();
    }
    action.addEventListener("click", async () => {
      if (busy || !value) return;
      const active = ["downloading", "installing"].includes(value.phase);
      if (!active && value.installed && !window.confirm(text()[9])) return;
      busy = true; render();
      try { await request(active ? "cancel" : value.installed ? "remove" : "download"); }
      catch { failed = true; }
      finally { busy = false; render(); }
    });
    window.metro.onFeatureEvent(event => { if (event.type === "translation.pack") { value = event.payload; render(); } });
    request("status").catch(() => { failed = true; render(); });
    return { refresh: render };
  } };
})();
