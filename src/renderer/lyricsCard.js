(function (root) {
  "use strict";
  const presets = {
    quote: { width: 1200, height: 720, size: 58, background: "#182328", color: "#ffffff" },
    square: { width: 1080, height: 1080, size: 64, background: "#e8f0f1", color: "#17272c" },
    poster: { width: 1080, height: 1350, size: 76, background: "#183d45", color: "#ffffff" }
  };
  const messages = {
    en: ["Share lyrics", "Lyrics", "Layout", "Quote", "Square", "Poster", "Background", "Text color", "Copy image", "Download", "Close", "Select up to 8 lines", "Select at least one line.", "Image copied", "Could not copy image. You can download it instead.", "Copying...", "Preview", "These lines do not fit. Select fewer lines."],
    "zh-TW": ["分享歌詞", "歌詞", "版型", "橫式引言", "方形卡片", "直式海報", "背景", "文字顏色", "複製圖片", "下載", "關閉", "最多選擇 8 行", "請至少選擇一行歌詞。", "圖片已複製", "無法複製圖片，請改用下載。", "複製中…", "即時預覽", "歌詞太長，請減少選取行數。"],
    "zh-CN": ["分享歌词", "歌词", "版型", "横式引言", "方形卡片", "直式海报", "背景", "文字颜色", "复制图片", "下载", "关闭", "最多选择 8 行", "请至少选择一行歌词。", "图片已复制", "无法复制图片，请改用下载。", "复制中…", "实时预览", "歌词太长，请减少选取行数。"],
    ja: ["歌詞を共有", "歌詞", "レイアウト", "横長", "正方形", "ポスター", "背景", "文字色", "画像をコピー", "ダウンロード", "閉じる", "最大8行", "歌詞を選択してください。", "コピーしました", "コピーできません。ダウンロードをご利用ください。", "コピー中…", "プレビュー", "歌詞が長すぎます。行数を減らしてください。"],
    ko: ["가사 공유", "가사", "레이아웃", "가로", "정사각형", "포스터", "배경", "글자 색", "이미지 복사", "다운로드", "닫기", "최대 8줄", "가사를 선택하세요.", "이미지 복사 완료", "복사할 수 없습니다. 다운로드를 이용하세요.", "복사 중…", "미리 보기", "가사가 너무 깁니다. 줄 수를 줄이세요."]
  };
  function wrap(ctx, text, width) {
    const tokens = String(text).match(/\s+|[^\s\u2e80-\u9fff\u3040-\u30ff\uac00-\ud7af]+|[\u2e80-\u9fff\u3040-\u30ff\uac00-\ud7af]/gu) || [];
    const lines = []; let line = "";
    for (const token of tokens) {
      if (line && ctx.measureText(line + token).width > width) { lines.push(line.trim()); line = ""; }
      // An unusually long unbroken word must still fit within the image.
      if (ctx.measureText(token).width > width) {
        for (const char of Array.from(token)) {
          if (line && ctx.measureText(line + char).width > width) { lines.push(line); line = ""; }
          line += char;
        }
      } else line += line ? token : token.trimStart();
    }
    if (line.trim()) lines.push(line.trim()); return lines;
  }
  function ellipsis(ctx, value, width) {
    let text = String(value || "");
    if (ctx.measureText(text).width <= width) return text;
    while (text && ctx.measureText(text + "...").width > width) text = Array.from(text).slice(0, -1).join("");
    return text + "...";
  }
  function paint(canvas, model) {
    const preset = presets[model.layout] || presets.quote;
    canvas.width = preset.width; canvas.height = preset.height;
    const ctx = canvas.getContext("2d");
    const pad = 88, width = canvas.width - pad * 2, available = canvas.height - 340;
    ctx.fillStyle = model.background; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = model.color;
    let size = preset.size, lines;
    do {
      ctx.font = `600 ${size}px "Segoe UI", sans-serif`;
      lines = model.lines.flatMap(text => wrap(ctx, text, width));
      if (lines.length * size * 1.42 <= available || size <= 26) break;
      size -= 2;
    } while (size >= 26);
    const fits = lines.length * size * 1.42 <= available;
    if (fits) {
      let y = 130 + Math.max(0, (available - lines.length * size * 1.42) / 2);
      for (const text of lines) { ctx.fillText(text, pad, y); y += size * 1.42; }
    }
    ctx.globalAlpha = 0.35; ctx.fillRect(pad, canvas.height - 206, width, 2); ctx.globalAlpha = 1;
    ctx.font = '600 32px "Segoe UI", sans-serif'; ctx.fillText(ellipsis(ctx, model.title, width), pad, canvas.height - 148);
    ctx.globalAlpha = 0.75; ctx.font = '24px "Segoe UI", sans-serif';
    ctx.fillText(ellipsis(ctx, model.artist, width), pad, canvas.height - 108);
    ctx.font = '20px "Segoe UI", sans-serif'; ctx.fillText("Auralane", pad, canvas.height - 52); ctx.globalAlpha = 1;
    return fits;
  }
  function open(options) {
    const doc = root.document, t = messages[options.language] || messages.en;
    const previous = doc.querySelector(".lyrics-card-dialog"); if (previous) { previous.close(); previous.remove(); }
    const dialog = doc.createElement("dialog"); dialog.className = "lyrics-card-dialog"; dialog.dataset.i18nSkip = "";
    dialog.setAttribute("aria-label", t[0]);
    function node(tag, parent, cls, text) { const e = doc.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; parent.append(e); return e; }
    function button(parent, text, cls) { const e = node("button", parent, cls, text); e.type = "button"; return e; }
    const header = node("header", dialog, "lyrics-card-header"); node("h2", header, "", t[0]);
    const close = button(header, "", "lyrics-card-close"); close.setAttribute("aria-label", t[10]); close.title = t[10];
    close.innerHTML = '<span aria-hidden="true">&times;</span>'; close.onclick = () => dialog.close();
    const body = node("div", dialog, "lyrics-card-body"), controls = node("div", body, "lyrics-card-controls");
    const fieldset = node("fieldset", controls, "lyrics-card-layouts"); node("legend", fieldset, "", t[2]);
    const layout = presets[options.layout] ? options.layout : "quote";
    const model = { layout, background: presets[layout].background, color: presets[layout].color, title: options.title || "Auralane", artist: options.artist || "", lines: [] };
    const layoutButtons = Object.keys(presets).map((key, i) => {
      const b = button(fieldset, t[3 + i]); b.setAttribute("aria-pressed", String(key === model.layout));
      b.onclick = () => { model.layout = key; model.background = presets[key].background; model.color = presets[key].color; bg.value = model.background; fg.value = model.color; layoutButtons.forEach(x => x.setAttribute("aria-pressed", String(x === b))); update(); };
      return b;
    });
    const colors = node("div", controls, "lyrics-card-colors");
    function color(label, value) { const l = node("label", colors); node("span", l, "", label); const input = node("input", l); input.type = "color"; input.value = value; input.setAttribute("aria-label", label); return input; }
    const bg = color(t[6], model.background), fg = color(t[7], model.color);
    bg.oninput = () => { model.background = bg.value; update(); }; fg.oninput = () => { model.color = fg.value; update(); };
    node("h3", controls, "", t[1]); const count = node("small", controls, "", t[11]);
    const list = node("div", controls, "lyrics-card-lines"); list.setAttribute("aria-label", t[1]);
    const selected = new Set((options.selected || []).filter(i => options.lines[i]).slice(0, 8));
    if (!selected.size) selected.add(Math.max(0, options.lines.findIndex(line => line.trim())));
    const checkboxes = options.lines.map((text, i) => {
      if (!text.trim()) return null;
      const label = node("label", list), input = node("input", label); input.type = "checkbox"; input.checked = selected.has(i);
      node("span", label, "", text); input.onchange = () => { if (input.checked) selected.add(i); else selected.delete(i); update(); }; return input;
    });
    const preview = node("section", body, "lyrics-card-preview"); preview.setAttribute("aria-label", t[16]);
    const canvas = node("canvas", preview); canvas.setAttribute("role", "img"); canvas.setAttribute("aria-label", t[16]);
    const status = node("p", dialog, "lyrics-card-status"); status.setAttribute("role", "status");
    const footer = node("footer", dialog, "lyrics-card-footer");
    const download = button(footer, t[9], "secondary"), copy = button(footer, t[8], "primary");
    let valid = false, busy = false;
    function update() {
      model.lines = [...selected].sort((a, b) => a - b).map(i => options.lines[i]);
      checkboxes.forEach((input, i) => { if (input) input.disabled = !selected.has(i) && selected.size >= 8; });
      count.textContent = `${selected.size}/8 · ${t[11]}`;
      valid = paint(canvas, model) && selected.size > 0;
      status.textContent = !selected.size ? t[12] : !valid ? t[17] : "";
      copy.disabled = download.disabled = !valid || busy;
    }
    async function blob() {
      // Always rasterize into a fresh, origin-clean canvas. No remote artwork or
      // app canvas is ever drawn into either the preview or exported image.
      const clean = doc.createElement("canvas");
      if (!paint(clean, model)) throw new Error(t[17]);
      return new Promise((resolve, reject) => clean.toBlob(value => value ? resolve(value) : reject(new Error("PNG export failed")), "image/png"));
    }
    copy.onclick = async () => {
      if (!valid || busy) return; busy = true; update(); copy.textContent = t[15];
      try { const png = await blob(); await root.navigator.clipboard.write([new root.ClipboardItem({ "image/png": png })]); status.textContent = t[13]; }
      catch (error) { status.textContent = t[14]; console.warn("Lyrics card copy failed", error.name); }
      finally { busy = false; copy.textContent = t[8]; copy.disabled = download.disabled = !valid; }
    };
    download.onclick = async () => {
      if (!valid || busy) return;
      try { const url = URL.createObjectURL(await blob()), anchor = doc.createElement("a"); anchor.href = url; anchor.download = `${model.title.replace(/[\\/:*?"<>|]+/g, "_")}-lyrics.png`; anchor.click(); root.setTimeout(() => URL.revokeObjectURL(url), 1000); }
      catch (error) { status.textContent = error.message; }
    };
    const restoreFocus = doc.activeElement;
    dialog.addEventListener("close", () => { dialog.remove(); if (restoreFocus?.isConnected) restoreFocus.focus({ preventScroll: true }); }, { once: true });
    dialog.addEventListener("click", event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
    doc.body.append(dialog); update(); dialog.showModal(); close.focus();
    return dialog;
  }
  const api = { open, paint, wrap, presets };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AuralaneLyricsCard = api;
})(typeof window !== "undefined" ? window : globalThis);
