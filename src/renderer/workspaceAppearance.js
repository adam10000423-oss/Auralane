(function () {
  "use strict";
  const groups = ["general", "appearance", "playback", "lyrics", "sync", "connections", "advanced"];
  const labels = {
    en: ["General", "Appearance", "Playback", "Lyrics", "Library and sync", "Connections", "Advanced"],
    "zh-TW": ["一般", "外觀", "播放", "歌詞", "音樂庫與同步", "連線服務", "進階"],
    "zh-CN": ["常规", "外观", "播放", "歌词", "音乐库与同步", "连接服务", "高级"],
    ja: ["一般", "外観", "再生", "歌詞", "ライブラリと同期", "連携サービス", "詳細"],
    ko: ["일반", "모양", "재생", "가사", "보관함 및 동기화", "연결 서비스", "고급"]
  };
  window.AuralaneWorkspaceAppearance = { init(o) {
    const grid = document.querySelector("#settingsView .settings-grid"); if (!grid) return;
    let active = "general";
    const nav = document.getElementById("settingsCategoryNav") || document.createElement("nav"); nav.className = "settings-category-nav workspace-settings-tabs"; nav.setAttribute("aria-label", "Settings"); nav.dataset.i18nSkip = "";
    if (!nav.isConnected) grid.before(nav);
    const appearance = document.createElement("section"); appearance.className = "settings-card"; appearance.dataset.workspaceCategory = "appearance"; appearance.dataset.i18nSkip = "";
    const heading = document.createElement("h2"); appearance.append(heading); grid.prepend(appearance);
    const text = key => window.AuralaneMusicWorkspace.text(key, o.state.settings.language);
    const lyricColors = window.AuralaneLyricColors?.init(o, grid);
    function field(key, input) { const row = document.createElement("label"); row.className = "settings-field workspace-appearance-field"; const label = document.createElement("strong"); row.append(label, input); appearance.append(row); return () => { label.textContent = text(key); input.setAttribute("aria-label", text(key)); }; }
    const material = document.createElement("select"); for (const value of ["standard", "glass"]) { const option = document.createElement("option"); option.value = value; material.append(option); }
    const reduce = document.createElement("input"); reduce.type = "checkbox";
    const refreshLabels = [field("material", material), field("reduce", reduce)];
    const transparencyControl = document.createElement("div"); transparencyControl.className = "glass-transparency-control";
    const transparency = document.createElement("input"); transparency.type = "range"; transparency.id = "settingsGlassTransparency"; transparency.min = "0"; transparency.max = "75"; transparency.step = "1";
    const transparencyValue = document.createElement("output"); transparencyValue.htmlFor = transparency.id;
    transparencyControl.append(transparency, transparencyValue);
    refreshLabels.push(field("transparency", transparencyControl));
    let transparencySaveTimer;
    function applyTransparency() {
      const raw = Number(o.state.settings.glassTransparency);
      const value = Number.isFinite(raw) ? Math.max(0, Math.min(75, Math.round(raw))) : 35;
      o.state.settings.glassTransparency = value;
      transparency.value = String(value); transparencyValue.textContent = `${value}%`;
      transparency.setAttribute("aria-label", text("transparency")); transparency.setAttribute("aria-valuetext", `${value}%`);
      transparency.disabled = o.state.settings.material !== "glass" || o.state.settings.reduceTransparency === true;
      document.body.style.setProperty("--glass-surface-fill", `${100 - value}%`);
    }
    transparency.addEventListener("input", () => {
      o.state.settings.glassTransparency = Number(transparency.value); applyTransparency();
      clearTimeout(transparencySaveTimer); transparencySaveTimer = setTimeout(() => o.save(), 160);
    });
    transparency.addEventListener("change", () => { clearTimeout(transparencySaveTimer); o.save(); });
    const theme = document.getElementById("settingsThemeMode")?.closest(".settings-field"); if (theme) appearance.append(theme);
    function apply() {
      document.body.dataset.material = o.state.settings.material === "glass" ? "glass" : "standard";
      document.body.dataset.reduceTransparency = String(o.state.settings.reduceTransparency === true);
      material.value = o.state.settings.material === "glass" ? "glass" : "standard"; reduce.checked = o.state.settings.reduceTransparency === true;
      applyTransparency();
      o.state.compactPlayer?.refresh();
    }
    material.addEventListener("change", () => { o.state.settings.material = material.value; o.save(); apply(); });
    reduce.addEventListener("change", () => { o.state.settings.reduceTransparency = reduce.checked; o.save(); apply(); });
    function classify(card) {
      if (card.dataset.workspaceCategory) return;
      const has = selector => Boolean(card.querySelector(selector));
      card.dataset.workspaceCategory = has("#smartPlaylistRule") ? "retired" : has("#settingsLyricsSource, #settingsDesktopLyricsFont") ? "lyrics" : has("#settingsCrossfade, #settingsDSPSpeed, .eq-band") ? "playback" : has("#settingsLibraryAutoRefresh, #settingsLibraryDefaultSort, #syncOutboxList, #downloadManagerList, #settingsCacheSize, #settingsBackupExport") ? "sync" : has("#settingsDebugLogs, .playback-diagnostic-value, #healthCheckRun, #settingsResetLayout, #playbackStatsResults") ? "advanced" : "general";
    }
    function refresh() {
      lyricColors?.refresh();
      for(const old of grid.querySelectorAll("details.settings-card")){
        const section=document.createElement("section");section.className=old.className;for(const [key,value]of Object.entries(old.dataset))section.dataset[key]=value;
        for(const child of [...old.childNodes]){if(child.nodeName==="SUMMARY"){const h=document.createElement("h2");h.append(...child.childNodes);section.append(h);}else section.append(child);}old.replaceWith(section);
      }
      const names = labels[o.state.settings.language] || labels.en; heading.textContent = names[1]; nav.replaceChildren();
      for (const [index, key] of groups.entries()) {
        if (key === "connections") continue;
        const button = document.createElement("button"); button.type = "button"; button.textContent = names[index]; button.classList.toggle("active", key === active); button.setAttribute("aria-pressed", String(key === active));
        button.addEventListener("click", () => { active = key; refresh(); }); nav.append(button);
      }
      for (const card of grid.querySelectorAll(":scope > .settings-card, :scope > .feature-host > .settings-card")) { classify(card); card.classList.remove("settings-filtered-out"); card.hidden = card.dataset.workspaceCategory !== active; }
      o.state.performanceTools?.refresh();
      refreshLabels.forEach(fn => fn()); material.options[0].textContent = text("standard"); material.options[1].textContent = text("liquid"); apply();
      for (const summary of grid.querySelectorAll("[data-performance-summary]")) summary.textContent = (window.AuralanePerformanceTools?.dictionaries[o.state.settings.language] || window.AuralanePerformanceTools?.dictionaries.en)?.analysis || names[2];
    }
    const observer = new MutationObserver(records => { if (records.some(record => [...record.addedNodes].some(node => node.nodeType === 1 && (node.matches?.(".settings-card") || node.classList?.contains("feature-host"))))) refresh(); });
    observer.observe(grid, { childList: true, subtree: true });
    document.addEventListener("dragstart", () => document.body.classList.add("workspace-dragging"));
    document.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      if (event.target.closest(".panel-resizer") || event.target.closest(".queue-row[data-index]") && !event.target.closest("button,[role=button]") && !o.state.settings.queueLock) document.body.classList.add("workspace-dragging");
    }, true);
    for (const type of ["dragend", "drop", "pointerup", "pointercancel"]) document.addEventListener(type, () => document.body.classList.remove("workspace-dragging"));
    window.addEventListener("blur", () => document.body.classList.remove("workspace-dragging"));
    function organizePerformance(section) {
      const panel = section.querySelector(".auralane-performance-tools"); if (!panel) return;
      const toggles = [...panel.querySelectorAll(".apt-toggle")];
      const general = document.createElement("section"); general.className = "settings-card auralane-performance-tools"; general.dataset.workspaceCategory = "general";
      const h = panel.querySelector("h3"); if (h) general.append(h);
      general.append(...toggles.slice(0, 2)); grid.append(general);
      const audio = document.createElement("section"); audio.className = "settings-card auralane-performance-tools"; audio.dataset.workspaceCategory = "retired";
      const summary = document.createElement("h2"); summary.dataset.performanceSummary = ""; audio.append(summary, ...toggles.slice(2, 4));
      for (const child of [...panel.children]) if (child !== toggles[4] && !child.matches(".apt-artwork-form,.apt-artwork,.apt-artwork-status")) audio.append(child);
      const repeated=audio.querySelectorAll("h3");for(const el of repeated)el.remove();
      grid.append(audio);
      const visual = document.createElement("div"); visual.className = "auralane-performance-tools";
      visual.append(...[toggles[4], panel.querySelector(".apt-artwork-form"), panel.querySelector(".apt-artwork-status"), panel.querySelector(".apt-artwork"),panel.querySelector(".apt-youtube-artwork")].filter(Boolean)); appearance.append(visual);
      section.remove(); refresh();
    }
    refresh(); return { refresh, organizePerformance, show: key => { if (groups.includes(key)) { active = key; refresh(); } }, destroy() { clearTimeout(transparencySaveTimer); observer.disconnect(); nav.remove(); } };
  } };
})();
