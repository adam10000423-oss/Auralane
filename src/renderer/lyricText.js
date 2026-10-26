(function (root) {
  "use strict";
  const Parser = typeof module === "object" && module.exports
    ? require("@xmldom/xmldom").DOMParser : root.DOMParser;
  const parser = new Parser({ onError: () => {} });
  function decode(value) {
    const text = String(value ?? "");
    if (!/&(?:#[xX][\da-fA-F]+|#\d+|[A-Za-z][A-Za-z\d]+);/.test(text)) return text;
    // Escape literal markup before parsing entities; the result is always text.
    const escaped = text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/&#(x[\da-f]+|\d+);/gi, (entity, code) => {
        const point = code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code);
        return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff) ? entity : "&#65533;";
      });
    try { return parser.parseFromString(`<span>${escaped}</span>`, "text/html").documentElement.textContent; }
    catch { return text; }
  }
  function lines(values) {
    return values.map(line => ({ ...line, text: decode(line.text),
      ...(Array.isArray(line.words) ? { words: line.words.map(word => ({ ...word, text: decode(word.text) })) } : {}) }));
  }
  const api = { decode, lines };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AuralaneLyricText = api;
})(typeof globalThis === "object" ? globalThis : this);
