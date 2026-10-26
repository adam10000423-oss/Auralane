(function () {
  "use strict";
  const words = {
    en: ["More player controls", "Volume", "Audio quality"],
    "zh-TW": ["更多播放控制", "音量", "音質"],
    "zh-CN": ["更多播放控制", "音量", "音质"],
    ja: ["その他の再生操作", "音量", "音質"],
    ko: ["추가 재생 설정", "음량", "음질"]
  };
  window.AuralaneCompactPlayer = { init(o) {
    const player = document.querySelector("footer.player");
    if (!player || player.dataset.compactReady) return;
    player.dataset.compactReady = "true"; document.body.classList.add("compact-player");
    const center = player.querySelector(".player-center"), now = player.querySelector(".now"), right = player.querySelector(".player-right");
    const progress = player.querySelector(".progress-row"), copy = now.children[1];
    const placements = [center, progress, ...["volumeBar", "nowQualityButton", "shareButton", "currentDownloadButton", "lyricWidgetButton", "miniPlayerButton", "sleepButton", "playbackMode", "likeButton", "lyricsButton", "queueButton", "sleepMenu", "shuffleButton", "repeatButton"].map(id => document.getElementById(id)), player.querySelector(".audio-output-control")].map(element => {
      const anchor = document.createComment("player-layout"); element.before(anchor); return { element, anchor };
    });
    const originalRight = [...right.childNodes]; let enabled = true;
    player.prepend(center); copy.append(progress);
    const volume = document.getElementById("volumeBar"), quality = document.getElementById("nowQualityButton");
    const seek = document.getElementById("seekBar");
    const paintSeek = () => seek.style.setProperty("--seek-position", `${Math.max(0, Math.min(100, Number(seek.value) / Number(seek.max) * 100))}%`);
    for (const event of ["timeupdate", "seeked", "loadedmetadata", "emptied"]) o.audio.addEventListener(event, paintSeek);
    seek.addEventListener("input", paintSeek); paintSeek();
    const make = (tag, cls) => { const el = document.createElement(tag); el.className = cls; return el; };
    const volumePanel = make("div", "compact-volume-panel"), morePanel = make("div", "compact-more-panel");
    volumePanel.dataset.i18nSkip = morePanel.dataset.i18nSkip = "";
    volumePanel.hidden = morePanel.hidden = true;
    volumePanel.id = "compactVolumePanel"; morePanel.id = "compactMorePanel";
    const volumeButton = make("button", "utility-button icon-button compact-volume-button"), moreButton = make("button", "utility-button icon-button compact-more-button");
    volumeButton.dataset.i18nSkip = moreButton.dataset.i18nSkip = "";
    for (const [button, panel] of [[volumeButton, volumePanel], [moreButton, morePanel]]) {
      button.type = "button"; button.setAttribute("aria-expanded", "false"); button.setAttribute("aria-controls", panel.id); button.setAttribute("aria-haspopup", "dialog");
      panel.setAttribute("role", "dialog");
      button.addEventListener("click", () => {
        const open = panel.hidden; close(); panel.hidden = !open; button.setAttribute("aria-expanded", String(open));
      });
    }
    const volumeText = make("span", "compact-volume-value");
    volumePanel.append(volume, volumeText);
    function volumeState() { const value = Number(volume.value); volumeText.textContent = `${Math.round(value * 100)}%`; volumeButton.classList.toggle("muted", value === 0); }
    volume.addEventListener("input", volumeState); o.audio.addEventListener("volumechange", volumeState); volumeState();
    const labels = [];
    for (const id of ["shareButton", "lyricWidgetButton", "miniPlayerButton", "sleepButton"]) {
      const button = document.getElementById(id), row = make("div", "compact-menu-row"), label = make("span", "compact-menu-label");
      row.append(button, label); labels.push({ button, label }); morePanel.append(row);
      row.addEventListener("click", event => { if (!event.target.closest("button")) { event.stopPropagation();button.click(); } });
      if (id !== "sleepButton") button.addEventListener("click", close);
    }
    const output = player.querySelector(".audio-output-control"); morePanel.append(output);
    const qualityRow = make("div", "compact-quality-row"), qualityLabel = make("span", "compact-menu-label"); qualityRow.append(qualityLabel, quality); morePanel.append(qualityRow);
    const mode = document.getElementById("playbackMode"); morePanel.append(mode);
    const primary = ["likeButton", "currentDownloadButton", "lyricsButton", "queueButton"].map(id => document.getElementById(id));
    const sleep = document.getElementById("sleepMenu");
    right.replaceChildren(...primary, volumeButton, moreButton, volumePanel, morePanel);document.body.append(sleep);
    function positionSleep() {
      if(sleep.classList.contains("hidden")||!enabled)return;
      const anchor=morePanel.getBoundingClientRect(),gap=8,width=Math.min(220,innerWidth-24);
      sleep.style.width=width+"px";
      const left=anchor.left-width-gap>=12?anchor.left-width-gap:Math.min(innerWidth-width-12,anchor.right+gap);
      sleep.style.left=Math.max(12,left)+"px";
      sleep.style.top=Math.max(12,Math.min(anchor.top,innerHeight-sleep.offsetHeight-12))+"px";
    }
    document.getElementById("sleepButton").addEventListener("click",()=>{positionSleep();requestAnimationFrame(positionSleep);});
    function close() {
      volumePanel.hidden = morePanel.hidden = true;
      volumeButton.setAttribute("aria-expanded", "false"); moreButton.setAttribute("aria-expanded", "false");
      document.getElementById("audioOutputMenu")?.classList.add("hidden");
      o.closeAudioOutput?.();
      sleep.classList.add("hidden");document.getElementById("qualityMenu")?.classList.add("hidden");
    }
    const inside = target => right.contains(target) || target.closest?.("#qualityMenu,#sleepMenu,#audioOutputMenu");
    document.addEventListener("pointerdown", event => { if (!inside(event.target)) close(); });
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      const trigger = !morePanel.hidden ? moreButton : !volumePanel.hidden ? volumeButton : null;
      close(); trigger?.focus();
    });
    document.addEventListener("focusin", event => { if (!inside(event.target)) close(); });
    window.addEventListener("resize", close);
    const refreshLabels = () => { for (const { button, label } of labels) { const text = button.getAttribute("aria-label") || button.title; if (label.textContent !== text) label.textContent = text; label.classList.toggle("disabled", button.disabled); } };
    const observer = new MutationObserver(refreshLabels);
    for (const { button } of labels) observer.observe(button, { attributes: true, attributeFilter: ["aria-label", "title", "disabled"] });
    const narrow = window.matchMedia("(max-width: 680px)"), extra = [];
    for (const button of [document.getElementById("shuffleButton"), document.getElementById("repeatButton"), primary[2], primary[3], volumeButton]) {
      const row = make("div", "compact-menu-row"), label = make("span", "compact-menu-label"); row.append(label); morePanel.append(row); row.hidden = true;
      labels.push({ button, label }); extra.push({ button, row });
      observer.observe(button, { attributes: true, attributeFilter: ["aria-label", "title", "disabled"] });
      row.addEventListener("click", event => { if (!event.target.closest("button")) button.click(); });
    }
    function fit() {
      close();
      if (!enabled) return;
      for (const { button, row } of extra) {
        row.hidden = !narrow.matches;
        if (narrow.matches) row.prepend(button);
      }
      if (!narrow.matches) {
        const controls = center.querySelector(".controls"); controls.prepend(document.getElementById("shuffleButton")); controls.append(document.getElementById("repeatButton"));
        right.prepend(...primary, volumeButton);
      }
      refreshLabels();
    }
    narrow.addEventListener("change", fit); fit();
    function refresh() {
      const next = o.isGlass ? o.isGlass() : true;
      if (next !== enabled) {
        close(); enabled = next; document.body.classList.toggle("compact-player", enabled);
        if (!enabled) {
          sleep.style.left="";sleep.style.top="";sleep.style.width="";
          right.replaceChildren(...originalRight);
          for (const { element, anchor } of placements) anchor.after(element);
        } else {
          player.prepend(center); copy.append(progress);
          for (const { button, label } of labels.slice(0, 4)) label.parentElement.prepend(button);
          morePanel.append(output, qualityRow, mode); qualityRow.append(quality);
          volumePanel.prepend(volume); right.replaceChildren(...primary, volumeButton, moreButton, volumePanel, morePanel);document.body.append(sleep);
          fit();
        }
      }
      const [more, sound, fidelity] = words[o.language()] || words.en;
      o.setIconButton(volumeButton, "audio-output", sound); o.setIconButton(moreButton, "more", more);
      morePanel.setAttribute("aria-label", more); volumePanel.setAttribute("aria-label", sound); qualityLabel.textContent = fidelity;
      refreshLabels(); volumeState();
    }
    refresh(); return { refresh, close };
  } };
})();
