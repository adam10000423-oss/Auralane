(function (root) {
  "use strict";

  function createSourceTools(container, callbacks) {
    if (!container?.ownerDocument) throw new TypeError("Expected a DOM container");
    for (const key of ["listSources", "upsertSource", "removeSource", "checkHealth", "queryVersions", "onSelect"]) {
      if (typeof callbacks?.[key] !== "function") throw new TypeError(`Missing callback: ${key}`);
    }
    const document = container.ownerDocument;
    let destroyed = false, track = null, editing = null, queryRevision = 0, listRevision = 0, busy = false, editor = null;
    const el = (tag, className, content) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (content != null) node.textContent = content;
      return node;
    };
    const shell = el("section", "source-tools");
    shell.setAttribute("aria-label", "Sources and song versions");
    const message = el("p", "st-message");
    message.setAttribute("role", "status"); message.setAttribute("aria-live", "polite");
    const heading = el("h2", "", "Sources");
    const sourceList = el("ul", "st-sources");
    const form = el("form", "st-form");
    const fields = el("fieldset", "st-fields");
    const legend = el("legend", "", "Add source"); fields.append(legend);
    const inputs = {};
    function field(key, label, type = "text") {
      const wrapper = el("label", "st-field");
      wrapper.append(el("span", "", label));
      const input = el("input"); input.type = type; input.name = key;
      input.autocomplete = "off";
      if (["id", "name", "searchUrl"].includes(key)) input.required = true;
      input.maxLength = key === "headers" ? 8192 : key === "name" ? 100 : key === "id" ? 64 : 2048;
      wrapper.append(input); fields.append(wrapper); inputs[key] = input;
      return input;
    }
    field("id", "Source ID").pattern = "[a-zA-Z0-9_-]{1,64}";
    field("name", "Name"); field("searchUrl", "Search endpoint", "url");
    field("healthUrl", "Health endpoint", "url"); field("mediaOrigins", "Allowed media origins (comma-separated)");
    const enabled = field("enabled", "Enabled", "checkbox"); enabled.checked = true;
    const headers = field("headers", "Replace private headers (JSON)", "password");
    headers.disabled = typeof callbacks.setSourceHeaders !== "function";
    headers.autocomplete = "new-password"; headers.spellcheck = false;
    const actions = el("div", "st-actions");
    function button(label, action, parent = actions) {
      const node = el("button", "", label); node.type = "button";
      node.addEventListener("click", action); parent.append(node); return node;
    }
    const save = el("button", "", "Save source"); save.type = "submit"; actions.append(save);
    button("Cancel", () => {resetForm();editor?.close();});
    const clearHeaders = button("Clear private headers", () => run(async () => {
      if (!editing || !callbacks.setSourceHeaders) return;
      await callbacks.setSourceHeaders(editing, {}); headers.value = "";
      message.textContent = "Private headers cleared.";
    }));
    clearHeaders.disabled = true;
    fields.append(actions); form.append(fields);
    const versionPanel = el("section", "st-versions"); versionPanel.hidden = true;
    const versionHeading = el("h2", "", "Song versions");
    const versionForm = el("form", "st-query");
    const queryLabel = el("label", "st-field"); queryLabel.append(el("span", "", "Version search"));
    const queryInput = el("input"); queryInput.type = "search"; queryInput.required = true; queryInput.maxLength = 500;
    queryLabel.append(queryInput);
    const search = el("button", "", "Search versions"); search.type = "submit";
    versionForm.append(queryLabel, search);
    const versionStatus = el("p", "st-message"); versionStatus.setAttribute("role", "status");
    const versions = el("ul", "st-version-list");
    versionPanel.append(versionHeading, versionForm, versionStatus, versions);
    shell.append(heading, message, sourceList, form, versionPanel); container.append(shell);
    if(callbacks.simple){
      editor=el("dialog","workspace-dialog source-editor");const title=el("header");title.append(el("h2","","Add source"));const body=el("div","workspace-dialog-body");body.append(form);editor.append(title,body);document.body.append(editor);
      const feedback=message.cloneNode(true);body.append(feedback);
      const observer=new MutationObserver(()=>{feedback.textContent=message.textContent;});observer.observe(message,{childList:true,characterData:true,subtree:true});
      editor.addEventListener("close",()=>{headers.value="";});
      editor.addEventListener("cancel",()=>{headers.value="";});
      editor._statusObserver=observer;
      const add=button("Add source",()=>{resetForm();editor.showModal();},shell);add.className="secondary";
      inputs.id.closest("label").hidden=true;
    }

    function resetForm() {
      form.reset(); editing = null; inputs.id.disabled = false; enabled.checked = true;
      headers.value = ""; clearHeaders.disabled = true; legend.textContent = "Add source";
      if(editor){inputs.id.value=`source-${crypto.randomUUID()}`;editor.querySelector("h2").textContent=callbacks.translate?.("Add source")||"Add source";}
    }
    function edit(source) {
      resetForm(); editing = source.id;
      for (const key of ["id", "name", "searchUrl", "healthUrl"]) inputs[key].value = source[key] || "";
      inputs.id.disabled = true; inputs.mediaOrigins.value = (source.mediaOrigins || []).join(", ");
      enabled.checked = source.enabled; legend.textContent = "Edit source";
      if(editor)editor.querySelector("h2").textContent=callbacks.translate?.("Edit source")||"Edit source";
      clearHeaders.disabled = !callbacks.setSourceHeaders;if(editor&&!editor.open)editor.showModal(); inputs.name.focus();
    }
    async function run(task) {
      if (destroyed || busy) return;
      busy = true; fields.disabled = true; sourceList.setAttribute("aria-busy", "true");
      try { await task(); }
      catch { if (!destroyed) message.textContent = "Source operation failed. Check the configuration and try again."; }
      finally { busy = false; if (!destroyed) { fields.disabled = false; sourceList.removeAttribute("aria-busy"); } }
    }
    async function refresh() {
      const revision = ++listRevision;
      const sources = await callbacks.listSources();
      if (destroyed || revision !== listRevision) return;
      sourceList.replaceChildren();
      if (!sources.length) sourceList.append(el("li", "st-empty", "No sources configured."));
      for (const source of sources) {
        const row = el("li", "st-source");
        const details = el("div", "st-details"); details.append(el("strong", "", source.name));
        details.append(el("span", "st-endpoint", source.searchUrl));
        const health = source.health || { state: "unknown" };
        const state = source.enabled ? health.state : "disabled";
        const status = el("span", "st-health", `${state}${health.latencyMs != null && source.enabled ? ` (${health.latencyMs} ms)` : ""}`);
        status.dataset.state = ["healthy", "unhealthy", "disabled"].includes(state) ? state : "unknown";
        details.append(status);
        const controls = el("div", "st-actions");
        const toggleLabel = el("label", "st-toggle");
        const toggle = el("input"); toggle.type = "checkbox"; toggle.checked = source.enabled;
        toggle.setAttribute("aria-label", `Enable ${source.name}`);
        toggle.addEventListener("change", () => {
          const next = toggle.checked;
          if (busy) { toggle.checked = source.enabled; return; }
          void run(async () => { await callbacks.upsertSource(configOf(source, next)); await refresh(); }).then(() => { toggle.checked = source.enabled; });
        });
        toggleLabel.append(toggle, el("span", "", "Enabled")); controls.append(toggleLabel);
        button("Edit", () => { if (!busy) edit(source); }, controls);
        const check = button("Check health", () => run(async () => { await callbacks.checkHealth(source.id); await refresh(); }), controls);
        check.disabled = !source.enabled;
        button("Remove", () => run(async () => {
          await callbacks.removeSource(source.id); if (editing === source.id) resetForm(); await refresh();
        }), controls);
        row.append(details, controls); sourceList.append(row);
      }
    }
    function configOf(source, nextEnabled = source.enabled) {
      return { id: source.id, name: source.name, searchUrl: source.searchUrl,
        healthUrl: source.healthUrl || null, enabled: nextEnabled, mediaOrigins: source.mediaOrigins };
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      void run(async () => {
        let privateHeaders;
        const rawHeaders = headers.value; headers.value = "";
        if (rawHeaders.trim()) {
          try { privateHeaders = JSON.parse(rawHeaders); } catch { message.textContent = "Private headers must be a JSON object."; return; }
          if (!privateHeaders || typeof privateHeaders !== "object" || Array.isArray(privateHeaders) || Object.values(privateHeaders).some((v) => typeof v !== "string")) {
            message.textContent = "Private headers must be a JSON object with string values."; return;
          }
          if (!callbacks.setSourceHeaders) { message.textContent = "Secure header storage is unavailable."; return; }
        }
        const config = { id: inputs.id.value.trim(), name: inputs.name.value.trim(), searchUrl: inputs.searchUrl.value.trim(),
          healthUrl: inputs.healthUrl.value.trim() || null, enabled: enabled.checked };
        if (inputs.mediaOrigins.value.trim()) config.mediaOrigins = inputs.mediaOrigins.value.split(",").map((v) => v.trim()).filter(Boolean);
        await callbacks.upsertSource(config);
        if (privateHeaders) {
          try { await callbacks.setSourceHeaders(config.id, privateHeaders); }
          catch { message.textContent = "Source saved, but private headers were not stored."; await refresh(); return; }
        }
        if (destroyed) return;
        resetForm(); editor?.close();message.textContent = "Source saved."; await refresh();
      });
    });
    async function searchVersions() {
      if (!track || destroyed) return;
      const revision = ++queryRevision, currentTrack = track;
      versions.replaceChildren(); versionStatus.textContent = "Searching..."; search.disabled = true;
      try {
        const results = await callbacks.queryVersions(currentTrack, queryInput.value.trim());
        if (destroyed || revision !== queryRevision) return;
        versionStatus.textContent = results.length ? (callbacks.versionCount?.(results.length) || `${results.length} versions`) : "No versions found.";
        for (const candidate of results) {
          const row = el("li", "st-version");
          const details = el("div", "st-details");
          details.dataset.i18nSkip = "";
          details.append(el("strong", "", candidate.title), el("span", "", candidate.artist || candidate.artists?.map((a) => a.title || a.name).join(", ") || "Unknown artist"));
          const duration = Number(candidate.durationSeconds);
          const sourceLabel = candidate.match?.matches ? "Strict match" : "Manual choice";
          const label = callbacks.translate?.(sourceLabel) || sourceLabel;
          details.append(el("span", "st-version-meta", `${Number.isFinite(duration) && duration > 0 ? `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, "0")} | ` : ""}${candidate.version ? `${candidate.version} | ` : ""}${label}`));
          const select = button("Select", async () => {
            if (destroyed || revision !== queryRevision || select.disabled) return;
            select.disabled = true;
            try {
              await callbacks.onSelect(candidate, currentTrack);
              if (!destroyed && revision === queryRevision) versionStatus.textContent = "Version selected.";
            } catch { if (!destroyed && revision === queryRevision) versionStatus.textContent = "Could not select this version."; }
            finally { if (!destroyed) select.disabled = false; }
          }, row);
          select.setAttribute("aria-label", `Select ${candidate.title} by ${candidate.artist || "unknown artist"}`);
          row.prepend(details); versions.append(row);
        }
      } catch { if (!destroyed && revision === queryRevision) versionStatus.textContent = "Version search failed. Try again."; }
      finally { if (!destroyed && revision === queryRevision) search.disabled = false; }
    }
    versionForm.addEventListener("submit", (event) => { event.preventDefault(); void searchVersions(); });
    const ready = refresh().catch(() => { if (!destroyed) message.textContent = "Could not load sources."; });
    return {
      ready, refresh,
      showVersions(nextTrack) {
        if (destroyed) return Promise.resolve();
        track = nextTrack; versionPanel.hidden = false;
        versionHeading.textContent = callbacks.versionTitle?.(nextTrack?.title || "Song") || `Versions: ${nextTrack?.title || "Song"}`;
        queryInput.value = [nextTrack?.title, nextTrack?.artist || nextTrack?.artists?.map((a) => a.title || a.name).join(" ")].filter(Boolean).join(" ");
        return searchVersions();
      },
      hideVersions() { queryRevision++; track = null; versionPanel.hidden = true; versions.replaceChildren(); search.disabled = false; },
      destroy() { destroyed = true; queryRevision++; listRevision++; headers.value = ""; editor?._statusObserver?.disconnect();editor?.remove();shell.remove(); }
    };
  }
  if (typeof module === "object" && module.exports) module.exports = { createSourceTools };
  else root.AuralaneSourceTools = Object.freeze({ createSourceTools });
})(typeof window !== "undefined" ? window : globalThis);
