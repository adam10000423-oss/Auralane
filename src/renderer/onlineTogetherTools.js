(function (root) {
  "use strict";
  const strings = {
    title: ["Listen Together", "一起聽", "一起听", "一緒に聴く", "함께 듣기"],
    name: ["Display name", "顯示名稱", "显示名称", "表示名", "표시 이름"],
    code: ["Room code", "房間代碼", "房间代码", "ルームコード", "방 코드"],
    create: ["Create room", "建立房間", "创建房间", "ルームを作成", "방 만들기"],
    creating: ["Creating…", "建立中…", "创建中…", "作成中…", "만드는 중…"],
    joining: ["Joining…", "加入中…", "加入中…", "参加中…", "참가 중…"],
    join: ["Join room", "加入房間", "加入房间", "ルームに参加", "방 참가"],
    leave: ["Leave room", "離開房間", "离开房间", "ルームを退出", "방 나가기"],
    end: ["End room", "結束房間", "结束房间", "ルームを終了", "방 종료"],
    copy: ["Copy room code", "複製房間代碼", "复制房间代码", "コードをコピー", "방 코드 복사"],
    close: ["Close", "關閉", "关闭", "閉じる", "닫기"],
    cancel: ["Cancel", "取消", "取消", "キャンセル", "취소"],
    connected: ["Connected", "已連線", "已连接", "接続済み", "연결됨"],
    connecting: ["Connecting…", "連線中…", "连接中…", "接続中…", "연결 중…"],
    working: ["Connecting to service…", "正在連線至服務…", "正在连接服务…", "サービスに接続中…", "서비스 연결 중…"],
    host: ["Host", "主持人", "主持人", "ホスト", "호스트"],
    guest: ["Listener", "聽眾", "听众", "リスナー", "청취자"],
    hostControls: ["Playback is controlled by the host", "由主持人控制播放", "由主持人控制播放", "ホストが再生を操作します", "호스트가 재생을 제어합니다"],
    hostSettings: ["Host settings", "房主設定", "房主设置", "ホスト設定", "호스트 설정"],
    yourPermissions: ["Room permissions", "房間操作權限", "房间操作权限", "ルームの権限", "방 권한"],
    playPause: ["Play / pause", "播放／暫停", "播放／暂停", "再生・一時停止", "재생 / 일시 정지"],
    skip: ["Switch songs", "切換歌曲", "切换歌曲", "曲の切り替え", "곡 전환"],
    seek: ["Seek playback", "調整播放進度", "调整播放进度", "再生位置の変更", "재생 위치 변경"],
    add: ["Add songs", "新增歌曲", "添加歌曲", "曲を追加", "곡 추가"],
    reorder: ["Reorder queue", "調整歌曲順序", "调整歌曲顺序", "キューの並べ替え", "대기열 순서 변경"],
    remove: ["Remove queued songs", "移除待播歌曲", "移除待播歌曲", "待機中の曲を削除", "대기 중인 곡 삭제"],
    PERMISSION_DENIED: ["The host has not allowed this action.", "房主未開放此操作。", "房主未开放此操作。", "ホストがこの操作を許可していません。", "호스트가 이 작업을 허용하지 않았습니다."],
    HOST_ONLY: ["Only the host can replace the queue or remove the current song.", "只有房主能取代整份佇列或移除正在播放的歌曲。", "只有房主能替换整个队列或移除正在播放的歌曲。", "キューの置換と再生中の曲の削除はホストのみ可能です。", "대기열 교체와 현재 곡 삭제는 호스트만 가능합니다."],
    SERVER_UPDATE_REQUIRED: ["Update the room server to enable member permissions.", "請先更新房間伺服器，才能使用成員權限。", "请先更新房间服务器，才能使用成员权限。", "メンバー権限を使うにはサーバーを更新してください。", "참가자 권한을 사용하려면 서버를 업데이트하세요."],
    RESTART_REQUIRED: ["Restart Auralane to load the updated connection component.", "請重新啟動 Auralane，載入新版連線元件。", "请重新启动 Auralane，加载新版连接组件。", "接続機能を更新するにはAuralaneを再起動してください。", "업데이트된 연결 기능을 사용하려면 Auralane을 다시 시작하세요."],
    INVALID_REQUEST: ["The connection component rejected this request. Restart Auralane.", "連線元件版本不一致，請重新啟動 Auralane。", "连接组件版本不一致，请重新启动 Auralane。", "接続機能のバージョンが一致しません。再起動してください。", "연결 기능의 버전이 맞지 않습니다. Auralane을 다시 시작하세요."],
    UNKNOWN_REQUEST: ["Restart Auralane to load the updated connection component.", "請重新啟動 Auralane，載入新版連線元件。", "请重新启动 Auralane，加载新版连接组件。", "Auralaneを再起動してください。", "Auralane을 다시 시작하세요."],
    TRACK_NOT_FOUND: ["This song is not in the shared queue. Add it first.", "這首歌不在房間佇列，請先新增歌曲。", "这首歌不在房间队列，请先添加。", "先に共有キューへ曲を追加してください。", "먼저 공유 대기열에 곡을 추가하세요."],
    members: ["Members", "成員", "成员", "メンバー", "참가자"],
    advanced: ["Server", "伺服器", "服务器", "サーバー", "서버"],
    save: ["Save", "儲存", "保存", "保存", "저장"],
    retry: ["Retry playback", "重試播放", "重试播放", "再生を再試行", "재생 다시 시도"],
    notConfigured: ["The online service is not configured.", "尚未設定線上服務。", "尚未配置在线服务。", "サービスが未設定です。", "온라인 서비스가 설정되지 않았습니다."],
    failed: ["Could not connect. Please try again.", "無法連線，請稍後重試。", "无法连接，请稍后重试。", "接続できません。再試行してください。", "연결할 수 없습니다. 다시 시도하세요."],
    ROOM_NOT_FOUND: ["Room not found.", "找不到房間。", "找不到房间。", "ルームが見つかりません。", "방을 찾을 수 없습니다."],
    ROOM_FULL: ["This room is full.", "房間已滿。", "房间已满。", "ルームが満員です。", "방이 가득 찼습니다."],
    RATE_LIMITED: ["Too many attempts. Try again later.", "操作過於頻繁，請稍後重試。", "操作过于频繁，请稍后重试。", "時間をおいて再試行してください。", "잠시 후 다시 시도하세요."],
    ROOM_CLOSED: ["The room has ended.", "房間已結束。", "房间已结束。", "ルームが終了しました。", "방이 종료되었습니다."],
    INVALID_CODE: ["Enter a valid six-character room code.", "請輸入正確的六碼房間代碼。", "请输入正确的六码房间代码。", "6文字のコードを入力してください。", "올바른 6자리 방 코드를 입력하세요."],
    INVALID_QUEUE: ["Only YouTube songs can be shared in this room.", "一起聽目前只支援 YouTube 歌曲。", "一起听目前只支持 YouTube 歌曲。", "YouTubeの曲のみ共有できます。", "YouTube 노래만 공유할 수 있습니다."],
    UNSUPPORTED_PLAYBACK: ["This playback source cannot be synchronized.", "目前的播放來源無法同步。", "当前播放来源无法同步。", "この再生ソースは同期できません。", "이 재생 소스는 동기화할 수 없습니다."],
    playbackFailed: ["This song could not play. Retry or leave the room.", "這首歌無法播放，可以重試或離開房間。", "这首歌无法播放，可以重试或离开房间。", "曲を再生できません。再試行または退出してください。", "노래를 재생할 수 없습니다. 다시 시도하거나 나가세요."],
    copied: ["Room code copied", "已複製房間代碼", "已复制房间代码", "コードをコピーしました", "방 코드를 복사했습니다"],
    confirmEnd: ["End this room for everyone?", "確定要為所有成員結束房間？", "确定要为所有成员结束房间？", "全員のルームを終了しますか？", "모든 참가자의 방을 종료할까요?"]
  };
  function queueTracks(queue, currentTrack, audioDuration, includePlayed = false) {
    const currentId = currentTrack?.videoId || currentTrack?.id;
    if (currentTrack && (currentTrack.local || currentTrack.localPath || !/^[A-Za-z0-9_-]{11}$/.test(currentId))) throw Object.assign(Error(), { code: "INVALID_QUEUE" });
    const currentIndex = queue.findIndex(track => (track.videoId || track.id) === currentId);
    const start = includePlayed ? queue.length > 200 ? Math.max(0, currentIndex - 100) : 0 : Math.max(0, currentIndex);
    return queue.slice(start).filter(track => !track.local && !track.localPath && /^[A-Za-z0-9_-]{11}$/.test(track.videoId || track.id))
      .slice(0, 200).map(track => {
        const id = track.videoId || track.id;
        let duration = Number(track.durationSeconds || track.lengthSeconds || (typeof track.duration === "number" ? track.duration : 0));
        if (!duration && typeof track.duration === "string" && /^\d+(?::[0-5]\d){1,2}$/.test(track.duration)) duration = track.duration.split(":").reduce((n, part) => n * 60 + Number(part), 0);
        if (id === currentId && Number.isFinite(audioDuration) && audioDuration > 0) duration = audioDuration;
        return { id, title: String(track.title || id).slice(0, 300),
          artist: String(typeof track.artist === "string" ? track.artist : track.artists?.map(a => a.name || a.title || a).join(", ") || "").slice(0, 300),
          duration: Number.isFinite(duration) && duration > 0 && duration <= 86400 ? duration : 0 };
      });
  }
  function init(options) {
    const { state, audio, playTrack, persistQueue, render, getPosition, stopPlayback } = options;
    const doc = options.document || root.document, bridge = options.bridge || root.metro;
    const toolbar = options.toolbar || doc.querySelector("#queuePane .queue-tools");
    if (!toolbar || !bridge?.featureRequest) throw Error("Online room dependencies missing");
    let remote = { enabled: false, connected: false }, receivedAt = 0, disposed = false, busy = false;
    let applying = false, syncBusy = false, pendingHostSync = false, backup = null, failedTrack = "", lastQueue = "", lastPlayback = "";
    let account = options.getAccountId(), generation = 0, notice = "", timer, lastCorrection = -Infinity;
    let pendingRemote = false, permissionsOpen = false;
    let pendingPermissions = null;
    const permissionKeys = ["playPause", "skip", "seek", "add", "reorder", "remove"];
    const defaultPermissions = { playPause:false, skip:false, seek:false, add:true, reorder:false, remove:false };
    const lockedControls = new Map();
    const allowed = action => !remote.enabled || remote.host || remote.capabilities?.includes("member-permissions") && remote.state?.permissionsVersion === 1 && remote.state.permissions?.[action === "select" ? "skip" : action] === true;
    const removers = [];
    const t = key => (strings[key] || strings.failed)[Math.max(0, ["en", "zh-TW", "zh-CN", "ja", "ko"].indexOf(state.settings.language))];
    const node = (tag, parent, className) => { const el = doc.createElement(tag); if (className) el.className = className; parent?.append(el); return el; };
    const labels = [];
    const label = (el, key) => { labels.push([el, key]); el.textContent = t(key); return el; };
    const button = (parent, key, handler, className = "secondary") => {
      const el = label(node("button", parent, className), key); el.type = "button";
      el.addEventListener("click", () => { void handler(); }); return el;
    };
    function icon(el, key, name) {
      options.setIconButton?.(el, name, t(key));
      if (!options.setIconButton) el.textContent = t(key);
      el.title = t(key); el.setAttribute("aria-label", t(key));
    }
    const launcher = node("button", toolbar, "queue-tool online-room-launcher"); launcher.type = "button";
    const dialog = node("dialog", doc.body, "online-room-dialog");
    const header = node("header", dialog, "online-room-head"); label(node("h2", header), "title");
    const settingsButton = node("button", header, "icon-button online-room-settings-button"); settingsButton.type = "button"; settingsButton.hidden = true;
    settingsButton.addEventListener("click", () => { permissionsOpen = !permissionsOpen; refreshLabels(); });
    const close = node("button", header, "icon-button"); close.type = "button"; close.addEventListener("click", () => dialog.close());
    const status = node("p", dialog, "online-room-status"); status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
    const entry = node("form", dialog, "online-room-entry"); entry.addEventListener("submit", e => { e.preventDefault(); void enter(false); });
    const nameLabel = node("label", entry); label(node("span", nameLabel), "name");
    const displayName = node("input", nameLabel); displayName.maxLength = 40; displayName.required = true; displayName.autocomplete = "nickname";
    displayName.value = `${String(state.auth?.account?.name || "Name").slice(0, 33)}'s room`;
    let entryAction = null;
    const create = button(entry, "create", () => enter(true), "primary");
    const divider = node("div", entry, "online-room-divider");
    const codeLabel = node("label", divider); label(node("span", codeLabel), "code");
    const code = node("input", codeLabel); code.maxLength = 12; code.autocomplete = "off"; code.spellcheck = false;
    code.setAttribute("autocapitalize", "characters"); code.placeholder = "ABC234";
    const join = button(divider, "join", () => enter(false));
    const cancel = button(entry, "cancel", async () => { await request("online.leave").catch(() => showError("failed")); }); cancel.hidden = true;
    const active = node("section", dialog, "online-room-active"); active.hidden = true;
    const codeRow = node("div", active, "online-room-code-row");
    const codeGroup = node("div", codeRow); label(node("small", codeGroup), "code"); const roomCode = node("strong", codeGroup);
    const copy = node("button", codeRow, "icon-button"); copy.type = "button";
    copy.addEventListener("click", () => { void root.navigator.clipboard.writeText(remote.code || "").then(() => options.toast?.(t("copied"))).catch(() => showError("failed")); });
    const connection = node("p", active, "online-room-connection");
    label(node("h3", active), "members"); const members = node("ul", active, "online-room-members");
    const role = label(node("p", active, "online-room-role"), "hostControls");
    const permissionPanel = node("section", active, "online-room-permissions"); permissionPanel.hidden = true;
    const permissionHeading = node("h3", permissionPanel);
    const permissionStatus = node("p", permissionPanel, "online-room-permission-status"); permissionStatus.setAttribute("role", "status");
    const permissionInputs = new Map();
    for (const key of permissionKeys) {
      const row = node("label", permissionPanel, "online-room-permission-row"); label(node("span", row), key);
      const input = node("input", row); input.type = "checkbox"; input.dataset.roomPermission = key;
      input.addEventListener("change", () => {
        if (busy || !remote.host) { refreshLabels(); return; }
        const next = { ...remote.state.permissions, [key]: input.checked };
        pendingPermissions = next;
        void run(async () => {
          update(await request("online.permissions", { permissions: next }));
          root.localStorage.setItem(`auralane:room-permissions:${account}`, JSON.stringify(next));
        }).finally(() => { pendingPermissions = null; refreshLabels(); });
      }); permissionInputs.set(key, input);
    }
    const retry = button(active, "retry", async () => { failedTrack = ""; notice = ""; await tick(); }); retry.hidden = true;
    const leave = button(active, "leave", leaveRoom, "secondary online-room-leave");
    const advanced = node("details", dialog, "online-room-advanced"); label(node("summary", advanced), "advanced");
    const serverForm = node("form", advanced); const serverLabel = node("label", serverForm); label(node("span", serverLabel), "advanced");
    const serverInput = node("input", serverLabel); serverInput.type = "url"; serverInput.required = true;
    const save = label(node("button", serverForm, "secondary"), "save"); save.type = "submit";
    serverForm.addEventListener("submit", e => { e.preventDefault(); void run(async () => update(await request("online.configure", { url: serverInput.value.trim() }))); });
    launcher.addEventListener("click", () => { refreshLabels(); if (!dialog.open) dialog.showModal(); });
    function request(type, payload = {}) { return bridge.featureRequest({ type, payload }).then(result => {
      if (!result?.ok) throw Object.assign(Error(result?.error?.code || "failed"), { code: result?.error?.code }); return result.value;
    }); }
    function showError(key) { notice = key; status.textContent = t(key); }
    const backupKey = () => `auralane:online-room-backup:${account}`;
    function saveBackup() {
      const serialized = JSON.stringify({ version: 1, ...backup });
      if (serialized.length > 2000000 || backup.queue.length > 2000) throw Error("Backup too large");
      root.localStorage.setItem(backupKey(), serialized);
      if (root.localStorage.getItem(backupKey()) !== serialized) throw Error("Backup failed");
    }
    function recoverBackup() {
      try {
        const saved = JSON.parse(root.localStorage.getItem(backupKey()) || "null");
        if (saved?.version === 1 && Array.isArray(saved.queue) && saved.queue.length <= 2000 &&
            saved.queue.every(item => item && typeof item.id === "string") && Number.isFinite(saved.position)) {
          backup = saved; restore();
        }
      } catch { showError("failed"); }
    }
    function refreshLabels() {
      labels.forEach(([el, key]) => { el.textContent = t(key); });
      icon(launcher, "title", "radio"); icon(close, "close", "close"); icon(copy, "copy", "share");
      icon(settingsButton, remote.host ? "hostSettings" : "yourPermissions", "settings");
      settingsButton.hidden = !remote.enabled; settingsButton.setAttribute("aria-expanded", String(permissionsOpen));
      permissionPanel.hidden = !remote.enabled || !permissionsOpen;
      permissionHeading.textContent = t(remote.host ? "hostSettings" : "yourPermissions");
      permissionStatus.textContent = !remote.enabled ? "" : !remote.capabilities?.includes("member-permissions") ? t("RESTART_REQUIRED") : remote.state?.permissionsVersion !== 1 ? t("SERVER_UPDATE_REQUIRED") : "";
      for (const [key, input] of permissionInputs) { input.checked = (pendingPermissions || remote.state?.permissions)?.[key] === true; input.disabled = busy || !remote.host || !remote.capabilities?.includes("member-permissions") || remote.state?.permissionsVersion !== 1; }
      refreshControls();
      leave.textContent = t(remote.host ? "end" : "leave");
      launcher.classList.toggle("active", !!remote.enabled);
      launcher.setAttribute("aria-haspopup", "dialog"); launcher.setAttribute("aria-label", t("title"));
      entry.hidden = !!remote.enabled; active.hidden = !remote.enabled;
      create.disabled = busy || !remote.configured; join.disabled = busy || !remote.configured;
      create.textContent = t(busy && entryAction === "create" ? "creating" : "create");
      join.textContent = t(busy && entryAction === "join" ? "joining" : "join");
      for (const [el,action] of [[create,"create"],[join,"join"]]) {
        const pending = busy && entryAction === action;
        el.classList.toggle("room-request-pending",pending);el.setAttribute("aria-busy",String(pending));
      }
      cancel.hidden = !busy;
      save.disabled = busy || !!remote.enabled; serverInput.disabled = busy || !!remote.enabled;
      leave.disabled = busy; role.hidden = !!remote.host;
      if (!remote.host && remote.state?.permissionsVersion === 1) role.textContent = t("yourPermissions");
      roomCode.textContent = remote.code || "";
      status.textContent = busy ? t("working") : notice ? t(notice) : !remote.configured ? t("notConfigured") : "";
      connection.textContent = `${t(remote.connected ? "connected" : "connecting")} · 1×`;
      retry.hidden = !failedTrack;
      members.replaceChildren();
      for (const member of remote.state?.members || []) {
        const item = node("li", members); node("span", item).textContent = member.name;
        node("small", item).textContent = t(member.host ? "host" : "guest");
      }
    }
    async function run(work) {
      if (busy || disposed) return;
      busy = true; notice = ""; refreshLabels();
      try { await work(); }
      catch (error) { if (error.code !== "CANCELLED") showError(strings[error.code] ? error.code : "failed"); }
      finally { busy = false; refreshLabels(); }
    }
    function update(value) {
      if (disposed || !value) return;
      const wasGuest = remote.enabled && !remote.host;
      if (remote.enabled && value.enabled && value.host && value.state?.seq > (remote.state?.seq ?? -1) &&
          value.state?.actorId && value.state.actorId !== value.memberId) pendingRemote = true;
      if (remote.enabled && !value.enabled) audio.playbackRate = state.settings.dspSpeed || 1;
      if (value.state?.playback.anchoredAt !== remote.state?.playback.anchoredAt) lastCorrection = -Infinity;
      remote = value; receivedAt = performance.now();
      if (remote.enabled) audio.playbackRate = 1;
      if (value.error && value.error !== "RECONNECTING") notice = strings[value.error] ? value.error : "failed";
      if (wasGuest && !remote.enabled) { generation++; restore(); }
      if (doc.activeElement !== serverInput) serverInput.value = remote.serverUrl || "";
      refreshLabels();
    }
    async function enter(host) {
      if (busy) return;
      if (!displayName.reportValidity()) return;
      const cleaned = code.value.replace(/[\s-]/g, "").toUpperCase();
      if (!host && !/^[A-HJ-NP-Z2-9]{6}$/.test(cleaned)) { showError("INVALID_CODE"); return; }
      entryAction = host ? "create" : "join";
      try { await run(async () => {
        if (state.playbackMode === "embed") throw Object.assign(Error(), { code: "UNSUPPORTED_PLAYBACK" });
        if (state.settings.offlineMode) throw Object.assign(Error(), { code: "UNSUPPORTED_PLAYBACK" });
        if (host) options.getQueue();
        else {
          backup = { queue: [...state.queue], track: state.currentTrack, position: getPosition(), source: state.queueSource };
          try { saveBackup(); } catch (error) { backup = null; throw error; }
          audio.pause();
        }
        try {
          let permissions = { ...defaultPermissions };
          if (host) { try { const saved = JSON.parse(root.localStorage.getItem(`auralane:room-permissions:${account}`) || "null");
            if (saved && permissionKeys.every(key => typeof saved[key] === "boolean")) permissions = Object.fromEntries(permissionKeys.map(key => [key, saved[key]])); } catch {} }
          update(await request(host ? "online.create" : "online.join", { name: displayName.value.trim(), ...(host ? remote.capabilities?.includes("member-permissions") ? { permissions } : {} : { code: cleaned }) }));
          pendingRemote = false;
          lastQueue = ""; lastPlayback = ""; failedTrack = ""; generation++;
        } catch (error) { restore(); throw error; }
      }); } finally { entryAction = null; refreshLabels(); }
    }
    function restore() {
      if (!backup) return;
      const saved = backup; backup = null;
      const key = backupKey(), stored = root.localStorage.getItem(key);
      applying = true;
      try {
        stopPlayback(); state.queue = saved.queue; state.queueSource = saved.source;
        state.currentTrack = saved.track; state.currentIndex = state.queue.findIndex(t => t.id === saved.track?.id);
        state.restoredPlaybackTime = saved.position; render();
        void persistQueue().then(() => {
          if (root.localStorage.getItem(key) === stored) root.localStorage.removeItem(key);
        }).catch(() => showError("failed"));
      } finally { applying = false; }
    }
    let confirmingEnd = false;
    function confirmRoomEnd() {
      return new Promise(resolve => {
        const confirmation = node("dialog", doc.body, "online-room-dialog online-room-confirmation");
        confirmation.dataset.i18nSkip = "";
        const question = label(node("h2", confirmation), "confirmEnd");
        question.id = "online-room-confirm-end"; confirmation.setAttribute("aria-labelledby", question.id);
        const actions = node("div", confirmation, "online-room-confirm-actions");
        let accepted = false;
        const cancelEnd = button(actions, "cancel", () => confirmation.close());
        button(actions, "end", () => { accepted = true; confirmation.close(); }, "primary");
        confirmation.addEventListener("close", () => { confirmation.remove(); resolve(accepted); }, {once:true});
        confirmation.showModal(); cancelEnd.focus();
      });
    }
    async function leaveRoom() {
      if (busy || confirmingEnd || !remote.enabled) return;
      const room = remote.code, owner = account;
      if (remote.host) {
        confirmingEnd = true;
        const accepted = await confirmRoomEnd(); confirmingEnd = false;
        if (!accepted || !remote.enabled || remote.code !== room || owner !== account) return;
      }
      await run(async () => {
        generation++;
        const result = await request("online.leave");
        update(result || await request("online.status")); restore();
      });
    }
    async function syncHost(force = false, playingOverride) {
      if (syncBusy) { if (force) pendingHostSync = true; return; }
      if (disposed || applying || pendingRemote || !remote.enabled || !remote.host || !remote.connected) return;
      syncBusy = true;
      const version = generation;
      try {
        if (state.playbackMode === "embed") {
          await request("online.leave"); update(await request("online.status")); showError("UNSUPPORTED_PLAYBACK"); return;
        }
        const queue = options.getQueue(), signature = JSON.stringify(queue);
        if (signature !== lastQueue) { const value=await request("online.publish", { tracks: queue });if(version!==generation)return;update(value); lastQueue = signature; }
        const index = queue.findIndex(t => t.id === (state.currentTrack?.videoId || state.currentTrack?.id));
        const playing = index >= 0 && (playingOverride ?? (!audio.paused && !audio.ended && audio.readyState >= 3));
        const key = `${index}:${playing}`;
        const seconds = index < 0 ? 0 : Math.min(queue[index].duration || 86400, getPosition());
        if (force || key !== lastPlayback || Math.abs(seconds - target()) > 1.25) {
          const value=await request("online.playback", { index, playing, position: seconds });if(version!==generation)return;update(value); lastPlayback = key;
        }
      } catch (error) { if(version===generation&&remote.enabled&&!["CANCELLED","STALE_STATE"].includes(error.code))showError(strings[error.code] ? error.code : "failed"); }
      finally { syncBusy = false; if (pendingHostSync) { pendingHostSync = false; void syncHost(true); } }
    }
    function target() {
      const s = remote.state; if (!s) return 0;
      const elapsed = performance.now() - receivedAt;
      return Math.min(s.queue[s.playback.index]?.duration || 86400,
        s.targetPosition + (s.playback.playing ? Math.max(0, elapsed - s.startsIn) / 1000 : 0));
    }
    async function tick() {
      if (disposed || applying || !remote.enabled) return;
      if (remote.host && !pendingRemote) return syncHost();
      if (!remote.connected) { audio.pause(); return; }
      const s = remote.state, item = s?.queue[s.playback.index], version = generation;
      if (!s) { audio.pause(); return; }
      if (item && failedTrack === item.id) return;
      applying = true;
      let changed = false;
      try {
        const ids = state.queue.map(t => t.videoId || t.id).join(",");
        if (ids !== s.queue.map(t => t.id).join(",")) {
          state.queue = s.queue.map(t => ({ ...t, videoId: t.id, durationSeconds: t.duration })); state.queueSource = null;
          changed = true;
          await persistQueue();
        }
        if (!item) {
          stopPlayback();
          if (remote.host) { pendingRemote = remote.state?.seq !== s.seq; lastQueue = JSON.stringify(options.getQueue()); lastPlayback = "-1:false"; }
          if (changed) render(); return;
        }
        if ((state.currentTrack?.videoId || state.currentTrack?.id) !== item.id || state.playbackMode === "idle") {
          const muted = audio.muted;
          audio.muted = true;
          try {
            if (await playTrack({ ...item, videoId: item.id, durationSeconds: item.duration,
              thumbnail: `https://i.ytimg.com/vi/${item.id}/mqdefault.jpg` }, { roomSync:true }) === false) throw Error("Playback failed");
          } finally { audio.pause(); audio.muted = muted; }
          if (version !== generation || !remote.enabled) return;
          if (state.playbackMode === "embed") throw Error("Unsupported playback");
          audio.pause();
          changed = true; lastCorrection = -Infinity;
        }
        if (remote.state?.queue[remote.state.playback.index]?.id !== item.id) { audio.pause(); return; }
        if (audio.readyState < 1) return;
        const seconds = target();
        const delay = (remote.state?.startsIn || 0) - (performance.now() - receivedAt);
        if (Math.abs(getPosition() - seconds) > 0.45 && performance.now() - lastCorrection > 2500) {
          audio.currentTime = seconds; lastCorrection = performance.now();
        }
        if (remote.state.playback.playing && delay <= 0 && seconds < (item.duration || 86400)) { if (audio.paused) await audio.play(); }
        else audio.pause();
        if (remote.host) {
          pendingRemote = remote.state?.seq !== s.seq || delay > 0 || remote.state.playback.playing && audio.paused;
          lastQueue = JSON.stringify(options.getQueue()); lastPlayback = `${s.playback.index}:${s.playback.playing}`;
        }
        if (changed) render();
      } catch { failedTrack = item?.id || ""; stopPlayback(); notice = "playbackFailed"; refreshLabels(); }
      finally { applying = false; }
    }
    const off = bridge.onFeatureEvent?.(event => { if (event.type === "online.state") update(event.payload); });
    for (const event of ["playing", "pause", "seeked", "ended", "waiting"]) {
      const handler = () => { if (!applying) void syncHost(true, ["pause", "ended", "waiting"].includes(event) ? false : event === "playing" ? true : undefined); };
      audio.addEventListener(event, handler); removers.push(() => audio.removeEventListener(event, handler));
    }
    let lastHostTick = -Infinity;
    timer = root.setInterval(() => {
      if (remote.host) { if (performance.now() - lastHostTick < 500) return; lastHostTick = performance.now(); }
      void tick();
    }, 80);
    const ready = request("online.status").then(value => { update(value); if (!value.enabled) recoverBackup(); }).catch(() => showError("failed"));
    refreshLabels();
    function refreshControls() {
      const selectors = { playPause:"#playButton", skip:"#prevButton,#nextButton,[data-queue-play]", seek:"#seekBar", remove:"[data-queue-remove]" };
      for (const [action, selector] of Object.entries(selectors)) for (const el of doc.querySelectorAll(selector)) {
        const effective = action === "skip" && el.hasAttribute("data-queue-play") && el.closest(".queue-row")?.dataset.trackId === remote.state?.queue[remote.state.playback.index]?.id ? "playPause" : action;
        const currentRemoval = action === "remove" && el.closest(".queue-row")?.dataset.trackId === remote.state?.queue[remote.state.playback.index]?.id;
        const denied = remote.enabled && !remote.host && (!allowed(effective) || currentRemoval);
        if (denied && !lockedControls.has(el)) lockedControls.set(el, { disabled:el.disabled, title:el.title });
        if (denied) { el.disabled = true; el.title = t("PERMISSION_DENIED"); }
        else if (lockedControls.has(el)) { const previous = lockedControls.get(el); el.disabled = previous.disabled; el.title = previous.title; lockedControls.delete(el); }
      }
      for (const el of lockedControls.keys()) if (!el.isConnected) lockedControls.delete(el);
      if (remote.enabled && !remote.host && !allowed("reorder")) options.cancelDrag?.();
    }
    async function perform(action, payload = {}) {
      if (!remote.enabled || !remote.connected || !allowed(action) || payload.next && !allowed("reorder")) {
        options.toast?.(t("PERMISSION_DENIED")); return false;
      }
      try { const value = await request("online.action", { action, ...payload }); update(value); await tick(); return true; }
      catch (error) { showError(strings[error.code] ? error.code : "failed"); options.toast?.(t(strings[error.code] ? error.code : "failed")); return false; }
    }
    refreshControls();
    async function enqueue(items, next = false) {
      try {
        const tracks = queueTracks(items, null, 0);
        if (!tracks.length || tracks.length !== items.length) throw Object.assign(Error(), { code:"INVALID_QUEUE" });
        if (next && tracks.length === 1 && remote.state?.queue.some(item => item.id === tracks[0].id)) {
          const queue = remote.state.queue, current = queue[remote.state.playback.index];
          if (tracks[0].id === current?.id) return false;
          const remaining = queue.filter(item => item.id !== tracks[0].id), index = remaining.findIndex(item => item.id === current?.id);
          return perform("reorder", { trackId:tracks[0].id, beforeId:remaining[index + 1]?.id || null });
        }
        return perform("add", { tracks, next });
      } catch { options.toast?.(t("INVALID_QUEUE")); return false; }
    }
    return { ready, syncQueue: () => syncHost(), perform, enqueue, can:allowed, refreshControls,
      isActive: () => !!remote.enabled, isGuest: () => !!remote.enabled && !remote.host, isApplying: () => applying,
      blockAction(action) { if (remote.enabled && !remote.host && !applying && !allowed(action)) { options.toast?.(t("PERMISSION_DENIED")); return true; } return false; },
      async refresh() {
        const next = options.getAccountId();
        if (next !== account) { account = next; generation++; backup = null; displayName.value=`${String(state.auth?.account?.name || "Name").slice(0,33)}'s room`;await request("online.leave"); update(await request("online.status")); recoverBackup(); }
        refreshLabels();
      },
      async dispose() { if (disposed) return; disposed = true; generation++; root.clearInterval(timer); off?.(); removers.forEach(fn => fn()); await request("online.leave").catch(() => {}); remote = { enabled:false }; refreshControls(); launcher.remove(); dialog.remove(); }
    };
  }
  const api = { init, queueTracks };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AuralaneOnlineTogether = api;
})(typeof window === "object" ? window : globalThis);
