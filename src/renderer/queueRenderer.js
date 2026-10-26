(function (root) {
  "use strict";
  function create(host) {
    let entries = new Map();
    const template = document.createElement("template");
    function render(items, htmlFor, versionFor) {
      if (!entries.size) host.replaceChildren();
      const next = new Map(), occurrences = new Map();
      let cursor = host.firstChild;
      const place = node => {
        if (node === cursor) cursor = cursor.nextSibling;
        else host.insertBefore(node, cursor);
      };
      for (let index = 0; index < items.length; index++) {
        const id = String(items[index].id || ""), occurrence = occurrences.get(id) || 0;
        occurrences.set(id, occurrence + 1);
        const key = `${id}:${occurrence}`, version = versionFor?.(items[index], index);
        let entry = entries.get(key);
        const html = entry && versionFor && entry.version === version ? null : htmlFor(items[index], index);
        // Index-only changes must not rebuild a song or destroy keyboard focus.
        const signature = html?.replace(/data-(?:index|queue-remove|queue-play)="\d+"/g, 'data-position=""');
        if (!entry || html !== null && entry.signature !== signature) {
          template.innerHTML = html;
          const parsed = template.content.querySelector(".queue-row");
          const divider = template.content.querySelector(".queue-recommendation-divider");
          if (entry) {
            entry.row.className = parsed.className;
            const main = parsed.querySelector(".queue-main"), actions = parsed.querySelector(".queue-row-actions");
            if (main?.outerHTML !== entry.row.querySelector(".queue-main")?.outerHTML) entry.row.querySelector(".queue-main")?.replaceWith(main);
            if (actions?.outerHTML !== entry.row.querySelector(".queue-row-actions")?.outerHTML) entry.row.querySelector(".queue-row-actions")?.replaceWith(actions);
            if (!divider) { if (entry.divider && entry.divider === cursor) cursor = cursor.nextSibling; entry.divider?.remove(); entry.divider = null; }
            else if (!entry.divider) entry.divider = divider;
            else if (entry.divider.textContent !== divider.textContent) entry.divider.textContent = divider.textContent;
            entry.signature = signature;
          } else entry = { row: parsed, divider, signature };
          entry.buttons = entry.row.querySelectorAll("[data-queue-remove],[data-queue-play]");
          entry.position = undefined;
        }
        entry.version = version;
        if (entry.position !== index) {
          if (entry.row.dataset.index !== String(index)) entry.row.dataset.index = String(index);
          for (const button of entry.buttons) {
            if (button.hasAttribute("data-queue-remove") && button.dataset.queueRemove !== String(index)) button.dataset.queueRemove = String(index);
            if (button.hasAttribute("data-queue-play") && button.dataset.queuePlay !== String(index)) button.dataset.queuePlay = String(index);
          }
          entry.position = index;
        }
        if (entry.divider) place(entry.divider);
        place(entry.row); next.set(key, entry);
      }
      for (const [key, entry] of entries) if (!next.has(key)) { entry.divider?.remove(); entry.row.remove(); }
      entries = next;
    }
    return { render, clear() { entries.clear(); host.replaceChildren(); } };
  }
  root.AuralaneQueueRenderer = { create };
})(globalThis);
