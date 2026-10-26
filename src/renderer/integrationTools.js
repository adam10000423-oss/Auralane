(function (root) {
  "use strict";

  // No Electron/Node access: the parent supplies a narrowly scoped async bridge.
  function mount(container, { api, openExternal, onImported = () => {}, compact = false, spotifyContainer, language = () => "en" }) {
    if (!container || !api) throw new Error("IntegrationTools requires a container and API bridge");
    const doc = container.ownerDocument;
    const panel = doc.createElement("section"); panel.className = "integration-tools";
    const heading = doc.createElement("h2"); heading.textContent = "Music Integrations"; panel.append(heading);
    const notice = doc.createElement("p"); notice.setAttribute("role", "status"); notice.setAttribute("aria-live", "polite");
    const account = doc.createElement("p"); account.className = "integration-tools-status";
    const buttons = [], cleanups = [];
    let destroyed = false, busy = false, controller = null, loginUrl = null;
    const editors=[];
    let lastConfigured=false;
    const captions={"zh-TW":["連線","取消"],"zh-CN":["连接","取消"],ja:["接続","キャンセル"],ko:["연결","취소"]};
    const fields = {};
    function element(tag, text, parent = panel) {
      const node = doc.createElement(tag); if (text) node.textContent = text; parent.append(node); return node;
    }
    const groups = [];
    function group(title) {
      const group = element(compact ? "section" : "fieldset", "", title === "Spotify Public Playlist" && spotifyContainer ? spotifyContainer : panel);
      group.className = compact ? "workspace-service" : "";
      const heading = element(compact ? "h3" : "legend", title, group);
      const status = compact ? element("small", "", heading) : null; if (status) status.className = "workspace-service-status";
      groups.push({ group, title, status }); return group;
    }
    function input(parent, key, title, type = "password") {
      const label = element("label", title, parent), field = element("input", "", label);
      field.type = type; field.name = key; field.autocomplete = "off"; field.required = true;
      fields[key] = field; return field;
    }
    function action(parent, title, handler, { submit = false, persistent = false } = {}) {
      const button = element("button", title, parent); button.type = submit ? "submit" : "button";
      if (!persistent) buttons.push(button);
      const listener = event => { event.preventDefault(); run(handler); };
      if (submit) parent.addEventListener("submit", listener); else button.addEventListener("click", listener);
      cleanups.push(() => (submit ? parent : button).removeEventListener(submit ? "submit" : "click", listener));
      return button;
    }
    async function refresh() {
      const status = await api.status();
      if (destroyed) return;
      if (compact) {
        const labels = ({ "zh-TW": ["已連線", "未連線", "已設定"], "zh-CN": ["已连接", "未连接", "已配置"], ja: ["接続済み", "未接続", "設定済み"], ko: ["연결됨", "연결 안 됨", "설정됨"] })[language()] || ["Connected", "Disconnected", "Configured"];
        const values = [status.lastfm.username || (status.lastfm.configured ? labels[2] : labels[1]), status.listenbrainz.username || labels[1], status.discord.connected ? labels[0] : labels[1], status.spotify.configured ? labels[2] : labels[1]];
        groups.forEach((entry, index) => { entry.status.textContent = values[index]; }); account.hidden = true;
        lastForm.hidden=Boolean(status.lastfm.username);brainzForm.hidden=Boolean(status.listenbrainz.username);discordForm.hidden=Boolean(status.discord.connected);
        fields.lastfmKey.required=fields.lastfmSecret.required=!status.lastfm.configured;
        disconnectLast.hidden=!status.lastfm.username;disconnectBrainz.hidden=!status.listenbrainz.username;disconnectDiscord.hidden=!status.discord.connected;
        confirmLast.hidden=!loginUrl;
        lastConfigured=Boolean(status.lastfm.configured);
        for(const editor of editors){
          const connected=editor.service===last?Boolean(status.lastfm.username):editor.service===brainz?Boolean(status.listenbrainz.username):Boolean(status.discord.connected);
          editor.open.hidden=connected;
          editor.open.textContent=(captions[language()]||["Connect","Cancel"])[0];
          editor.cancel.textContent=(captions[language()]||["Connect","Cancel"])[1];
          if(connected || editor.service===last&&loginUrl)editor.dialog.close();
        }
      } else account.textContent = `Last.fm: ${status.lastfm.username || (status.lastfm.configured ? "configured" : "disconnected")} | ListenBrainz: ${status.listenbrainz.username || "disconnected"} | Discord: ${status.discord.connected ? "connected" : "disconnected"} | Spotify: ${status.spotify.configured ? "configured" : "not configured"} | Pending listens: ${status.outbox}`;
    }
    async function run(handler) {
      if (busy || destroyed) return;
      busy = true; buttons.forEach(b => { b.disabled = true; }); notice.textContent = "Working...";
      try { const message = await handler(); if (!destroyed) { await refresh(); notice.textContent = message || (compact ? "" : "Saved."); if (compact) setTimeout(() => { if (!busy) notice.textContent = ""; }, 4000); } }
      catch (error) { if (!destroyed) notice.textContent = error.message || "Integration request failed."; }
      finally { busy = false; if (!destroyed) buttons.forEach(b => { b.disabled = false; }); }
    }
    const last = group("Last.fm"), lastForm = element("form", "", last);
    input(lastForm, "lastfmKey", "Application API key"); input(lastForm, "lastfmSecret", "Application API secret");
    action(lastForm, compact ? "Connect Last.fm" : "Save API Configuration", async () => {
      if(fields.lastfmKey.value || fields.lastfmSecret.value || !compact) await api.configure("lastfm", { apiKey: fields.lastfmKey.value, apiSecret: fields.lastfmSecret.value });
      fields.lastfmKey.value = ""; fields.lastfmSecret.value = ""; loginUrl = null;
      if(compact){const result=await api.beginLastFmLogin();const url=new URL(result.url);if(url.origin!=="https://www.last.fm"||url.pathname!=="/api/auth/")throw new Error("Invalid authorization URL");loginUrl=url.href;loginLink.href=loginUrl;loginLink.hidden=false;await openExternal?.(loginUrl);return "Confirm Authorization";}
      return "Last.fm API configuration saved.";
    }, { submit: true });
    const loginLink = element("a", "Authorize Last.fm", last); loginLink.hidden = true; loginLink.rel = "noopener noreferrer"; loginLink.target = "_blank";
    const startLast=action(last, "Start Authorization", async () => {
      const result = await api.beginLastFmLogin(); const url = new URL(result.url);
      if (url.origin !== "https://www.last.fm" || url.pathname !== "/api/auth/") throw new Error("Invalid Last.fm authorization URL");
      loginUrl = url.href; loginLink.href = loginUrl; loginLink.hidden = false;
      return "Authorization URL ready. Complete authorization on Last.fm, then confirm below.";
    });
    startLast.hidden=compact;
    const follow = event => {
      if (!openExternal || !loginUrl) return;
      event.preventDefault(); run(async () => { await openExternal(loginUrl); return "Last.fm opened in your browser."; });
    };
    loginLink.addEventListener("click", follow); cleanups.push(() => loginLink.removeEventListener("click", follow));
    const confirmLast=action(last, "Confirm Authorization", async () => { await api.completeLastFmLogin(); loginLink.hidden = true; loginUrl = null; return "Last.fm connected."; });
    const disconnectLast=action(last, "Disconnect Last.fm", async () => { await api.disconnect("lastfm"); loginLink.hidden = true; loginUrl = null; return "Last.fm disconnected."; });

    const brainz = group("ListenBrainz"), brainzForm = element("form", "", brainz);
    input(brainzForm, "listenToken", "User token");
    action(brainzForm, "Validate and Connect", async () => { await api.connectListenBrainz(fields.listenToken.value); fields.listenToken.value = ""; return "ListenBrainz token validated."; }, { submit: true });
    const disconnectBrainz=action(brainz, "Disconnect ListenBrainz", () => api.disconnect("listenbrainz").then(() => "ListenBrainz disconnected."));

    const discord = group("Discord Rich Presence"), discordForm = element("form", "", discord);
    input(discordForm, "discordClient", "Application ID", "text");
    action(discordForm, "Save and Connect", async () => { await api.configure("discord", { clientId: fields.discordClient.value }); await api.connectDiscord(); return "Discord desktop connected."; }, { submit: true });
    const disconnectDiscord=action(discord, "Disconnect Discord", () => api.disconnect("discord").then(() => "Discord disconnected."));

    const spotify = group("Spotify Public Playlist"), spotifyForm = element("form", "", spotify);
    if(compact)spotify.hidden=true;
    input(spotifyForm, "spotifyClient", "Application client ID"); input(spotifyForm, "spotifySecret", "Application client secret");
    action(spotifyForm, "Save Spotify Configuration", async () => {
      await api.configure("spotify", { clientId: fields.spotifyClient.value, clientSecret: fields.spotifySecret.value });
      fields.spotifyClient.value = ""; fields.spotifySecret.value = "";
    }, { submit: true });
    action(spotify, "Remove Spotify Configuration", () => api.disconnect("spotify").then(() => "Spotify configuration removed."));
    const importForm = element("form", "", spotify);
    input(importForm, "playlist", "Public playlist URL", "url");
    const market = input(importForm, "market", "Market", "text"); market.value = "TW"; market.maxLength = 2; market.pattern = "[A-Z]{2}";
    const progress = element("progress", "", spotify); progress.max = 1; progress.value = 0;
    progress.setAttribute("aria-label", "Playlist import progress");
    const resultList = element("ul", "", spotify); resultList.className = "integration-tools-results";
    action(importForm, "Import Playlist", async () => {
      resultList.replaceChildren(); controller = new AbortController();
      try {
        const result = await api.importSpotify(fields.playlist.value, { market: market.value, signal: controller.signal, onProgress(value) {
          if (destroyed) return;
          progress.max = value.total || Math.max(value.completed, 1); progress.value = value.completed;
          notice.textContent = `${value.phase}: ${value.completed}${value.total != null ? ` / ${value.total}` : ""}`;
        } });
        if (destroyed) return;
        for (const item of result.unmatched || []) element("li", `${item.source?.name || "Unavailable item"}: ${item.reason}`, resultList);
        if (result.status === "unavailable") throw new Error(`Spotify import unavailable: ${result.message || result.code}`);
        if (result.status === "cancelled") return "Import cancelled. No playlist was saved.";
        await onImported(result);
        return `${result.matched.length} matched, ${result.unmatched.length} unmatched.`;
      } finally { controller = null; }
    }, { submit: true });
    // Cancellation must remain usable while the other actions are disabled.
    const cancel = element("button", "Cancel Import", spotify); cancel.type = "button";
    const abort = () => controller?.abort(); cancel.addEventListener("click", abort); cleanups.push(() => cancel.removeEventListener("click", abort));
    action(panel, "Retry Pending Listens", () => api.retryOutbox().then(() => "Pending listens checked."));
    if(compact){
      for(const [service,form,title]of [[last,lastForm,"Last.fm"],[brainz,brainzForm,"ListenBrainz"],[discord,discordForm,"Discord Rich Presence"]]){
        const dialog=doc.createElement("dialog");dialog.className="workspace-dialog integration-editor integration-tools";
        const header=element("header","",dialog);element("h2",title,header);
        const cancel=element("button",(captions[language()]||["Connect","Cancel"])[1],header);cancel.type="button";
        const body=element("div","",dialog);body.className="workspace-dialog-body";body.append(form);
        const feedback=element("p","",body);feedback.setAttribute("role","status");
        const watcher=new MutationObserver(()=>{feedback.textContent=notice.textContent;});watcher.observe(notice,{childList:true,characterData:true,subtree:true});
        doc.body.append(dialog);
        const open=element("button",(captions[language()]||["Connect","Cancel"])[0],service);open.type="button";
        open.addEventListener("click",()=>{if(busy)return;if(service===last&&lastConfigured){lastForm.requestSubmit();return;}feedback.textContent="";dialog.showModal();});
        const clearSecrets=()=>{for(const field of form.querySelectorAll("input[type=password]"))field.value="";};
        cancel.addEventListener("click",()=>{clearSecrets();dialog.close();});
        dialog.addEventListener("close",clearSecrets);dialog.addEventListener("cancel",clearSecrets);
        editors.push({service,dialog,open,cancel});cleanups.push(()=>{watcher.disconnect();dialog.remove();});
      }
    }
    panel.append(account, notice); container.append(panel);
    run(async () => { await refresh(); return ""; });
    return { refresh, destroy() { destroyed = true; controller?.abort(); cleanups.forEach(fn => fn()); groups.forEach(v => v.group.remove()); panel.remove(); } };
  }
  const exports = { mount };
  if (typeof module === "object" && module.exports) module.exports = exports;
  else root.IntegrationTools = exports;
})(typeof globalThis === "object" ? globalThis : this);
