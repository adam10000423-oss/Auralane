(function (root) {
  "use strict";
  const keys = ["active", "passed", "upcoming", "translation"];
  const defaults = Object.freeze({ active: "#ffffff", passed: "#ffffff", upcoming: "#808080", translation: "#dddddd" });
  function normalize(value) {
    const colors = {};
    for (const key of keys) if (/^#[\da-f]{6}$/i.test(value?.[key])) colors[key] = value[key];
    return { enabled: value?.enabled === true, ...colors };
  }
  function apply(value, element = document.documentElement) {
    const colors = normalize(value);
    element.dataset.lyricColors = colors.enabled ? "custom" : "auto";
    for (const key of keys) {
      if (colors[key] || colors.enabled) element.style.setProperty(`--lyric-custom-${key}`, colors[key] || defaults[key]);
      else element.style.removeProperty(`--lyric-custom-${key}`);
    }
  }
  const labels = {
    en: ["Lyric colors", "Custom colors", "Singing", "Sung", "Not yet sung", "Translation", "Restore defaults"],
    "zh-TW": ["歌詞顏色", "自訂顏色", "正在唱", "已唱完", "尚未唱", "翻譯", "恢復預設"],
    "zh-CN": ["歌词颜色", "自定义颜色", "正在唱", "已唱完", "尚未唱", "翻译", "恢复默认"],
    ja: ["歌詞の色", "カスタムカラー", "歌唱中", "歌唱済み", "未歌唱", "翻訳", "初期設定に戻す"],
    ko: ["가사 색상", "사용자 지정 색상", "노래 중", "노래 완료", "아직 부르지 않음", "번역", "기본값 복원"]
  };
  function init(o, grid) {
    const card = document.createElement("section"); card.className = "settings-card lyric-color-settings";
    card.dataset.workspaceCategory = "lyrics"; card.dataset.i18nSkip = "";
    const heading = document.createElement("h2"); card.append(heading);
    const toggle = document.createElement("input"); toggle.type = "checkbox"; toggle.id = "settingsLyricColors";
    const toggleLabel = document.createElement("label"); toggleLabel.className = "lyric-color-toggle";
    const toggleText = document.createElement("span"); toggleLabel.append(toggle, toggleText); card.append(toggleLabel);
    const fields = keys.map((key, index) => {
      const label = document.createElement("label"); label.className = "lyric-color-field";
      const text = document.createElement("span"), input = document.createElement("input");
      input.type = "color"; input.id = `settingsLyricColor-${key}`;
      label.append(text, input); card.append(label);
      input.addEventListener("input", () => {
        o.state.settings.lyricColors = { ...normalize(o.state.settings.lyricColors), [key]: input.value };
        apply(o.state.settings.lyricColors); o.colorsChanged?.();
      });
      input.addEventListener("change", () => o.save());
      return { key, index, text, input };
    });
    const reset = document.createElement("button"); reset.type = "button"; reset.className = "secondary"; card.append(reset);
    function refresh() {
      const names = labels[o.state.settings.language] || labels.en;
      heading.textContent = names[0]; toggleText.textContent = names[1]; reset.textContent = names[6];
      const colors = normalize(o.state.settings.lyricColors); toggle.checked = colors.enabled;
      for (const { key, index, text, input } of fields) {
        text.textContent = names[index + 2]; input.setAttribute("aria-label", names[index + 2]);
        input.value = colors[key] || defaults[key]; input.disabled = !colors.enabled;
      }
      apply(colors);
    }
    toggle.addEventListener("change", () => {
      const colors = normalize(o.state.settings.lyricColors);
      for (const { key, input } of fields) colors[key] = input.value;
      o.state.settings.lyricColors = { ...colors, enabled: toggle.checked }; refresh(); o.save(); o.colorsChanged?.();
    });
    reset.addEventListener("click", () => { o.state.settings.lyricColors = { enabled: false }; refresh(); o.save(); o.colorsChanged?.(); });
    grid.append(card); refresh(); return { refresh };
  }
  const api = { normalize, apply, init, defaults };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AuralaneLyricColors = api;
})(typeof globalThis === "object" ? globalThis : this);
