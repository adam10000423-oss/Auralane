(function (root) {
  "use strict";
  const clone = (value) => JSON.parse(JSON.stringify(value));
  function applyEvent(previous, event) {
    if (event.type === "snapshot") return clone(event);
    if (!previous || event.roomId !== previous.roomId || event.seq !== previous.seq + 1) throw new Error("Sequence gap; reconnect required");
    const next = clone(previous);
    if (event.type === "queue") next.queue.splice(event.delta.index, event.delta.deleteCount, ...event.delta.items);
    else if (event.type !== "playback") throw new Error("Unknown room event");
    return { ...next, seq: event.seq, serverTime: event.serverTime, playback: clone(event.playback) };
  }
  function projectedPosition(state, serverTime) {
    const p = state.playback;
    return p.index < 0 ? 0 : Math.min(state.queue[p.index].duration, p.position + (p.playing ? Math.max(0, serverTime - p.anchoredAt) / 1000 : 0));
  }
  function createClient({ url, token, onState = () => {}, onStatus = () => {}, onError = () => {}, fetchImpl = root.fetch.bind(root) }) {
    const base = new URL(url);
    if (!["http:", "https:"].includes(base.protocol) || base.username || base.password || base.search || base.hash || base.pathname !== "/") throw new Error("Use a room origin without credentials");
    let controller, task, state = null, offset = 0, stopped = true;
    const headers = { Authorization: `Bearer ${token}` };
    const wall = Date.now() - performance.now();
    const localTime = () => wall + performance.now();
    async function request(route, signal) {
      const response = await fetchImpl(new URL(route, base), { headers, signal, cache: "no-store", credentials: "omit", redirect: "error" });
      if (!response.ok) { const error = new Error(`Room request failed (${response.status})`); error.fatal = [401, 403].includes(response.status); throw error; }
      return response;
    }
    async function run() {
      let retries = 0;
      while (!stopped) {
        controller = new AbortController();
        const signal = controller.signal;
        let watchdog, recalibrate;
        try {
          onStatus("connecting");
          watchdog = setTimeout(() => controller.abort(), 10000);
          const started = localTime();
          const timing = await (await request("/api/time", signal)).json();
          offset = timing.serverTime - (started + localTime()) / 2;
          const response = await request("/api/events", signal);
          recalibrate = setInterval(async () => {
            const start = localTime();
            try {
              const timeout = AbortSignal.timeout(5000);
              const value = await (await request("/api/time", AbortSignal.any([signal, timeout]))).json();
              if (!signal.aborted) offset = value.serverTime - (start + localTime()) / 2;
            } catch { /* Stream liveness is monitored separately. */ }
          }, 30000);
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          onStatus("connected");
          try {
            while (!stopped) {
              clearTimeout(watchdog);
              watchdog = setTimeout(() => controller.abort(), 10000);
              const { done, value } = await reader.read();
              if (done) throw new Error("Room disconnected");
              buffer += decoder.decode(value, { stream: true });
              if (buffer.length > 262144) throw new Error("Room event too large");
              let boundary;
              while ((boundary = buffer.indexOf("\n\n")) >= 0) {
                const frame = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 2);
                const data = frame.split("\n").find((line) => line.startsWith("data: "));
                if (!data) continue;
                const event = JSON.parse(data.slice(6));
                if (event.type !== "snapshot" && state && event.roomId === state.roomId && event.seq <= state.seq) continue;
                state = applyEvent(state, event); retries = 0;
                onState(clone(state));
              }
            }
          } finally { await reader.cancel().catch(() => {}); }
        } catch (error) {
          state = null;
          if (stopped) break;
          onError(error);
          onStatus("disconnected");
          if (error.fatal) { stopped = true; break; }
        } finally { clearTimeout(watchdog); clearInterval(recalibrate); controller.abort(); }
        if (!stopped) await new Promise((resolve) => {
          const timer = setTimeout(resolve, Math.min(10000, 500 * 2 ** Math.min(retries++, 5)));
          // A separate controller lets stop() cancel the reconnect delay.
          controller = new AbortController();
          controller.signal.addEventListener("abort", () => { clearTimeout(timer); resolve(); }, { once: true });
        });
      }
    }
    return {
      start() { if (!stopped) return task; stopped = false; task = run(); return task; },
      async stop() { stopped = true; controller?.abort(); await task; state = null; onStatus("disconnected"); },
      getState: () => state && clone(state),
      position: () => state ? projectedPosition(state, localTime() + offset) : 0
    };
  }

  // Callbacks resolve/play licensed audio locally; this module never shares stream URLs or files.
  function createPlaybackFollower({ client, loadTrack, play, pause, seek, getPosition, onError = () => {} }) {
    let generation = 0, loaded = "", disposed = false, pending = Promise.resolve();
    function update(state) {
      const version = ++generation;
      pending = pending.catch(() => {}).then(async () => {
        if (disposed || version !== generation) return;
        const item = state.queue[state.playback.index];
        if (!item) { await pause(); loaded = ""; return; }
        if (loaded !== item.id) { await loadTrack(item); loaded = item.id; }
        if (disposed || version !== generation) return;
        const target = client.position();
        if (Math.abs(getPosition() - target) > 0.4) await seek(target);
        if (state.playback.playing && target < item.duration) await play(); else await pause();
      }).catch(onError);
      return pending;
    }
    const timer = setInterval(() => {
      const state = client.getState();
      if (state) update(state);
      else {
        ++generation;
        pending = pending.catch(() => {}).then(() => pause()).catch(onError);
      }
    }, 1000);
    return { update, async dispose() { disposed = true; ++generation; clearInterval(timer); await pending; await pause(); } };
  }

  function mountTogether(container, { host, onState = () => {}, onError = () => {} } = {}) {
    const doc = container.ownerDocument;
    container.classList.add("together-tools");
    let client, unsubscribe, room, latest, busy = false;
    function element(tag, text, parent = container) { const node = doc.createElement(tag); if (text) node.textContent = text; parent.append(node); return node; }
    element("h2", "Listen Together");
    const status = element("p", "Disabled"); status.setAttribute("role", "status");
    const errorBox = element("p"); errorBox.setAttribute("role", "alert");
    const form = element("form");
    function input(label, type, value = "") { const wrap = element("label", label, form); const node = element("input", "", wrap); node.type = type; node.value = value; return node; }
    const address = input(host ? "Bind IPv4 address" : "Room address", "text", host ? "127.0.0.1" : root.location.origin);
    const secret = host ? null : input("Room token", "password");
    if (secret) { secret.autocomplete = "off"; secret.spellcheck = false; }
    const lan = host ? input("Allow LAN access", "checkbox") : null;
    const connect = element("button", host ? "Enable" : "Join", form); connect.type = "submit";
    const leave = element("button", host ? "Disable" : "Leave"); leave.type = "button"; leave.disabled = true;
    const invite = element("output");
    const controls = element("div"); controls.className = "together-controls";
    const playButton = element("button", "Play", controls), pauseButton = element("button", "Pause", controls);
    const seek = element("input", "", controls); seek.type = "range"; seek.min = "0"; seek.max = "1"; seek.step = "0.1"; seek.setAttribute("aria-label", "Seek");
    controls.hidden = !host;
    const current = element("p");
    const list = element("ol");
    async function attempt(fn) { if (busy) return; busy = true; errorBox.textContent = ""; try { await fn(); } catch (e) { errorBox.textContent = e.message; onError(e); } finally { busy = false; } }
    function render(state) {
      latest = state;
      const item = state.queue[state.playback.index];
      current.textContent = item ? `${item.title} - ${item.artist}` : "No track selected";
      seek.max = String(item?.duration || 1); seek.value = String(state.playback.position);
      playButton.disabled = pauseButton.disabled = seek.disabled = !item;
      list.replaceChildren();
      state.queue.forEach((track, index) => {
        const row = element("li", "", list);
        element("span", `${track.title} - ${track.artist}`, row);
        if (host) {
          const select = element("button", "Select", row); select.type = "button";
          select.onclick = () => attempt(() => send({ type: "select", index }));
          const remove = element("button", "Remove", row); remove.type = "button";
          remove.onclick = () => attempt(() => send({ type: "queue", index, deleteCount: 1, items: [] }));
        }
      });
      onState(clone(state));
    }
    async function send(command) { try { render(await host.command({ ...command, expectedSeq: latest.seq })); } catch (error) { render(await host.getState()); throw error; } }
    form.onsubmit = (event) => { event.preventDefault(); attempt(async () => {
      if (host) {
        room = await host.enable({ host: address.value.trim(), allowLan: lan.checked });
        invite.textContent = `Room: ${room.url} | Token: ${room.token}`;
        unsubscribe = host.subscribe(async () => { try { render(await host.getState()); } catch (e) { onError(e); } });
        render(await host.getState()); status.textContent = "Hosting";
      } else {
        client = createClient({ url: address.value.trim(), token: secret.value, onState: render, onStatus: (value) => { status.textContent = value; }, onError: (e) => { errorBox.textContent = e.message; onError(e); } });
        secret.value = ""; client.start();
      }
      connect.disabled = true; leave.disabled = false;
    }); };
    async function disconnect() {
      unsubscribe?.(); unsubscribe = null;
      if (host) await host.disable(); else await client?.stop();
      client = null; room = null; latest = null; invite.textContent = ""; current.textContent = ""; list.replaceChildren();
      connect.disabled = false; leave.disabled = true; controls.hidden = !host; status.textContent = "Disabled";
      playButton.disabled = pauseButton.disabled = seek.disabled = true;
    }
    leave.onclick = () => attempt(disconnect);
    playButton.onclick = () => attempt(() => send({ type: "play" }));
    pauseButton.onclick = () => attempt(() => send({ type: "pause" }));
    seek.onchange = () => attempt(() => send({ type: "seek", position: Number(seek.value) }));
    playButton.disabled = pauseButton.disabled = seek.disabled = true;
    return { disconnect, getClient: () => client, async dispose() { await disconnect(); container.replaceChildren(); } };
  }
  const api = { applyEvent, projectedPosition, createClient, createPlaybackFollower, mountTogether };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else { root.AuralaneTogether = api; if (root.document?.getElementById("together")) mountTogether(root.document.getElementById("together")); }
})(typeof window !== "undefined" ? window : globalThis);
