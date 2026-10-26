(function (root) {
  "use strict";

  const labels = {
    "Feature tools": ["功能工具", "功能工具", "機能ツール", "기능 도구"],
    "Listening tools": ["聆聽工具", "聆听工具", "リスニングツール", "감상 도구"],
    "Library and sync": ["音樂庫與同步", "音乐库与同步", "ライブラリと同期", "보관함 및 동기화"],
    "Sources": ["音源", "音源", "音源", "음원"],
    "Custom audio sources": ["自訂音源", "自定义音源", "カスタム音源", "사용자 지정 음원"],
    "Connected apps": ["連線應用程式", "连接应用", "連携アプリ", "연결된 앱"],
    "Connect Last.fm": ["連線 Last.fm", "连接 Last.fm", "Last.fm に接続", "Last.fm 연결"],
    "Listen Together": ["一起聽", "一起听", "一緒に聴く", "함께 듣기"],
    "Music Integrations": ["音樂整合", "音乐集成", "音楽連携", "음악 연동"],
    "Publish queue": ["發佈佇列", "发布队列", "キューを公開", "대기열 게시"],
    "Song versions": ["歌曲版本", "歌曲版本", "曲のバージョン", "곡 버전"],
    "Submit listens and presence": ["傳送聆聽紀錄與動態", "发送收听记录与动态", "再生履歴とアクティビティを送信", "감상 기록 및 활동 전송"],
    "Review import": ["檢閱匯入", "检查导入", "インポートを確認", "가져오기 검토"],
    "Add selected to queue": ["加入所選歌曲至佇列", "将所选歌曲加入队列", "選択した曲をキューに追加", "선택한 곡을 대기열에 추가"],
    "Add all matched": ["加入全部符合歌曲", "添加全部匹配歌曲", "一致した曲をすべて追加", "일치하는 곡 모두 추가"],
    "Cancel": ["取消", "取消", "キャンセル", "취소"],
    "Enable": ["啟用", "启用", "有効にする", "활성화"],
    "Enabled": ["已啟用", "已启用", "有効", "활성화됨"],
    "Disabled": ["已停用", "已停用", "無効", "비활성화됨"],
    "Disable": ["停用", "停用", "無効にする", "비활성화"],
    "Play": ["播放", "播放", "再生", "재생"],
    "Pause": ["暫停", "暂停", "一時停止", "일시 정지"],
    "Select": ["選取", "选择", "選択", "선택"],
    "Remove": ["移除", "移除", "削除", "제거"],
    "Edit": ["編輯", "编辑", "編集", "편집"],
    "Save source": ["儲存音源", "保存音源", "音源を保存", "음원 저장"],
    "Add source": ["新增音源", "添加音源", "音源を追加", "음원 추가"],
    "Edit source": ["編輯音源", "编辑音源", "音源を編集", "음원 편집"],
    "Source ID": ["音源 ID", "音源 ID", "音源 ID", "음원 ID"],
    "Name": ["名稱", "名称", "名前", "이름"],
    "Search endpoint": ["搜尋端點", "搜索端点", "検索エンドポイント", "검색 엔드포인트"],
    "Health endpoint": ["健康檢查端點", "健康检查端点", "ヘルスチェック先", "상태 확인 엔드포인트"],
    "Allowed media origins (comma-separated)": ["允許的媒體來源（逗號分隔）", "允许的媒体来源（逗号分隔）", "許可するメディア元（カンマ区切り）", "허용 미디어 출처 (쉼표 구분)"],
    "Replace private headers (JSON)": ["取代私密標頭（JSON）", "替换私密请求头（JSON）", "非公開ヘッダーを置換（JSON）", "비공개 헤더 교체 (JSON)"],
    "Clear private headers": ["清除私密標頭", "清除私密请求头", "非公開ヘッダーを消去", "비공개 헤더 지우기"],
    "Check health": ["檢查狀態", "检查状态", "状態を確認", "상태 확인"],
    "No sources configured.": ["尚未設定音源。", "尚未配置音源。", "音源が未設定です。", "설정된 음원이 없습니다."],
    "Version search": ["版本搜尋", "版本搜索", "バージョン検索", "버전 검색"],
    "Search versions": ["搜尋版本", "搜索版本", "バージョンを検索", "버전 검색"],
    "Searching...": ["搜尋中...", "搜索中...", "検索中...", "검색 중..."],
    "No versions found.": ["找不到版本。", "未找到版本。", "見つかりませんでした。", "버전이 없습니다."],
    "Strict match": ["精確符合", "精确匹配", "完全一致", "정확히 일치"],
    "Manual choice": ["手動選擇", "手动选择", "手動選択", "직접 선택"],
    "Bind IPv4 address": ["綁定 IPv4 位址", "绑定 IPv4 地址", "バインド IPv4 アドレス", "바인딩 IPv4 주소"],
    "Allow LAN access": ["允許區域網路存取", "允许局域网访问", "LAN アクセスを許可", "LAN 접속 허용"],
    "Hosting": ["正在主持", "正在主持", "ホスト中", "호스팅 중"],
    "No track selected": ["尚未選取歌曲", "尚未选择歌曲", "曲が未選択です", "선택한 곡 없음"],
    "Working...": ["處理中...", "处理中...", "処理中...", "처리 중..."],
    "Saved.": ["已儲存。", "已保存。", "保存しました。", "저장되었습니다."],
    "Application API key": ["應用程式 API 金鑰", "应用 API 密钥", "アプリ API キー", "앱 API 키"],
    "Application API secret": ["應用程式 API 密鑰", "应用 API 私钥", "アプリ API シークレット", "앱 API 시크릿"],
    "Save API Configuration": ["儲存 API 設定", "保存 API 配置", "API 設定を保存", "API 설정 저장"],
    "Authorize Last.fm": ["授權 Last.fm", "授权 Last.fm", "Last.fm を認証", "Last.fm 인증"],
    "Start Authorization": ["開始授權", "开始授权", "認証を開始", "인증 시작"],
    "Confirm Authorization": ["確認授權", "确认授权", "認証を確認", "인증 확인"],
    "User token": ["使用者權杖", "用户令牌", "ユーザートークン", "사용자 토큰"],
    "Validate and Connect": ["驗證並連線", "验证并连接", "検証して接続", "확인 후 연결"],
    "Application ID": ["應用程式 ID", "应用 ID", "アプリ ID", "앱 ID"],
    "Save and Connect": ["儲存並連線", "保存并连接", "保存して接続", "저장 후 연결"],
    "Application client ID": ["應用程式用戶端 ID", "应用客户端 ID", "クライアント ID", "클라이언트 ID"],
    "Application client secret": ["應用程式用戶端密鑰", "应用客户端密钥", "クライアントシークレット", "클라이언트 시크릿"],
    "Save Spotify Configuration": ["儲存 Spotify 設定", "保存 Spotify 配置", "Spotify 設定を保存", "Spotify 설정 저장"],
    "Remove Spotify Configuration": ["移除 Spotify 設定", "移除 Spotify 配置", "Spotify 設定を削除", "Spotify 설정 제거"],
    "Public playlist URL": ["公開播放清單網址", "公开播放列表网址", "公開プレイリスト URL", "공개 재생목록 URL"],
    "Market": ["市場", "市场", "市場", "지역"],
    "Import Playlist": ["匯入播放清單", "导入播放列表", "プレイリストをインポート", "재생목록 가져오기"],
    "Cancel Import": ["取消匯入", "取消导入", "インポートを中止", "가져오기 취소"],
    "Retry Pending Listens": ["重試待傳紀錄", "重试待发送记录", "保留中の履歴を再送", "대기 기록 다시 전송"],
    "Queue snapshots": ["佇列快照", "队列快照", "キューのスナップショット", "대기열 스냅샷"],
    "No queue snapshots.": ["尚無佇列快照。", "暂无队列快照。", "スナップショットはありません。", "저장된 스냅샷이 없습니다."],
    "Version selected.": ["已選取版本。", "已选择版本。", "バージョンを選択しました。", "버전을 선택했습니다."],
    "Version search failed. Try again.": ["版本搜尋失敗，請重試。", "版本搜索失败，请重试。", "検索に失敗しました。再試行してください。", "버전 검색 실패. 다시 시도하세요."],
    "Listening time": ["聆聽時間", "收听时间", "リスニング時間", "감상 시간"],
    "Save snapshot": ["儲存快照", "保存快照", "スナップショットを保存", "스냅샷 저장"],
    "Save queue": ["儲存佇列", "保存队列", "キューを保存", "대기열 저장"],
    "Snapshot name": ["快照名稱", "快照名称", "スナップショット名", "스냅샷 이름"],
    "Play on restore": ["還原後播放", "恢复后播放", "復元後に再生", "복원 후 재생"],
    "Undo delete": ["復原刪除", "撤销删除", "削除を取り消す", "삭제 취소"],
    "Restore": ["還原", "恢复", "復元", "복원"],
    "Delete": ["刪除", "删除", "削除", "삭제"],
    "Export": ["匯出", "导出", "エクスポート", "내보내기"],
    "Week": ["週", "周", "週", "주"],
    "Month": ["月", "月", "月", "월"],
    "Year": ["年", "年", "年", "년"],
    "Feature unavailable": ["功能無法使用", "功能不可用", "機能を利用できません", "기능을 사용할 수 없습니다"],
    "Playback adapter required": ["需要播放控制介面", "需要播放控制接口", "再生アダプターが必要です", "재생 어댑터가 필요합니다"],
    "Queue contains unsupported tracks": ["佇列含不支援的歌曲", "队列包含不支持的歌曲", "キューに非対応の曲があります", "대기열에 지원되지 않는 곡이 있습니다"],
    "Queue is locked": ["佇列已鎖定", "队列已锁定", "キューがロックされています", "대기열이 잠겨 있습니다"],
    "Account changed": ["帳戶已變更", "账户已更改", "アカウントが変更されました", "계정이 변경되었습니다"],
    "Choose a song": ["請選擇歌曲", "请选择歌曲", "曲を選択してください", "곡을 선택하세요"]
  };
  const languages = ["zh-TW", "zh-CN", "ja", "ko"];
  function translate(text, language = "en") { return labels[text]?.[languages.indexOf(language)] || text; }
  function duration(track) {
    const n = Number(track?.durationSeconds || track?.lengthSeconds);
    if (n > 0 && Number.isFinite(n)) return n;
    const value = track?.duration;
    if (typeof value === "number") return value;
    return typeof value === "string" && /^\d+(?::[0-5]\d){1,2}$/.test(value) ? value.split(":").reduce((sum, part) => sum * 60 + Number(part), 0) : 0;
  }
  function roomTracks(queue) {
    if (!Array.isArray(queue) || queue.length > 200) throw new Error("Queue contains unsupported tracks");
    return queue.map(t => {
      const id = t.videoId || t.id, seconds = duration(t);
      if (t.local || t.localPath || t.offlineOnly || (t.sourceId && t.sourceId !== "youtube") || !/^[A-Za-z0-9_-]{1,128}$/.test(id) || !seconds || seconds > 86400) throw new Error("Queue contains unsupported tracks");
      return { id, title: t.title || "", artist: t.artist || t.artists?.map(a => a.title || a.name || a).join(", ") || "", duration: seconds };
    });
  }

  /** Call after all four tool scripts and the parent bridge have loaded.
   * Optional: settingsHost,queueHost,bridge,translate(text,language),playback:{play,pause,seek,getPosition},
   * onSelectSource(candidate,original), storage, onExport. No performance or lyrics ownership.
   * Parent calls syncQueue after queue mutations; syncPlayback on embed transitions; refresh after account/language changes.
   */
  function init(options) {
    const { state, els, playTrack, persistQueue, renderQueue, renderNow, getAccountId } = options;
    for (const [key, value] of Object.entries({ playTrack, persistQueue, renderQueue, renderNow, getAccountId })) if (typeof value !== "function") throw new TypeError(`Missing callback: ${key}`);
    if (!state || !els?.audio) throw new TypeError("state and els.audio are required");
    const getState = typeof state === "function" ? state : () => state;
    const doc = options.document || root.document, bridge = options.bridge || root.metro;
    const settingsParent = options.settingsHost || doc.querySelector("#settingsView .settings-grid");
    const queueParent = options.queueHost || els.queuePane || doc.getElementById("queuePane");
    if (!settingsParent || !queueParent) throw new TypeError("Settings and queue mount targets are required");
    const audio = els.audio, cleanup = [], modules = {};
    let disposed = false, applying = 0, publishing = false, roomEnabled = false, playbackEnabled = false;
    let appliedRoom = "", appliedSeq = -1, lastTrack = null, lastPosition = 0, playId = "", lastTelemetry = 0;
    let roomWork = Promise.resolve(), syncWork = Promise.resolve(), queueWork = Promise.resolve(), publishedQueue = "", importCounter = 0;
    const subscribers = new Set(), progressSubscribers = new Set();
    const t = text => options.translate?.(text, getState().settings?.language || "en") || translate(text, getState().settings?.language);
    const report = error => { if (!disposed) { status.textContent = `${t(error.message || "Feature unavailable")}${error.code ? ` (${error.code})` : ""}`; options.toast?.(status.textContent, true); } };
    const run = fn => Promise.resolve().then(fn).catch(report);
    function node(tag, text, parent) { const el = doc.createElement(tag); if (text) el.textContent = text; parent?.append(el); return el; }
    const settings = node("section", null, settingsParent); settings.className = "feature-host";
    const queue = node("section", null, queueParent); queue.className = "feature-host feature-host-queue";
    const status = node("p", null, settings); status.setAttribute("role", "status"); status.className = "feature-host-status";
    function section(parent, label) { const flat=options.integratedLayout && parent===settings; const details = node(flat?"section":"details", null, parent); node(flat?"h2":"summary", label, details); const host = node("div", null, details); host.className = "feature-host-body"; return host; }
    const sourceHost = section(settings, options.integratedLayout?"Custom audio sources":"Sources"), integrationHost = section(settings, options.integratedLayout?"Connected apps":"Music Integrations");
    const syncHost = options.integratedLayout ? section(settings, "Library and sync") : null;
    if (options.integratedLayout) {
      settings.classList.add("workspace-integrated-settings");
      for (const [host, category] of [[sourceHost, "advanced"], [integrationHost, "connections"], [syncHost, "sync"]]) { host.parentElement.classList.add("settings-card"); host.parentElement.dataset.workspaceCategory = category; }
      integrationHost.parentElement.open = true; syncHost.parentElement.dataset.workspaceCategory="retired";syncHost.parentElement.hidden=true;
    }
    function managedDialog(label) {
      const dialog = node("dialog", null, doc.body); dialog.className = "workspace-dialog feature-host";
      const heading = node("header", null, dialog); node("h2", label, heading);
      const close = node("button", null, heading); close.type = "button"; options.setIconButton?.(close, "close", t("Cancel"));
      close.className = "icon-button workspace-icon";
      close.setAttribute("aria-label", t("Cancel")); if (!options.setIconButton) close.textContent = "×";
      close.addEventListener("click", () => dialog.close());
      const body = node("div", null, dialog); body.className = "workspace-dialog-body";
      dialog.addEventListener("click", event => { if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); });
      cleanup.push(() => dialog.remove()); return { dialog, body };
    }
    const snapshots = options.integratedLayout ? managedDialog("Queue snapshots") : null;
    const listeningHost = snapshots?.body || section(queue, "Listening tools"), togetherHost = options.onlineTogether ? null : section(queue, "Listen Together");
    if (snapshots) {
      const tools = doc.querySelector(".queue-tools");
      const launch = node("button", null, tools); launch.className = "queue-tool"; launch.type = "button";
      options.setIconButton?.(launch, "bookmark", t("Queue snapshots"));
      launch.addEventListener("click", () => { modules.listening?.render(); snapshots.dialog.showModal(); }); cleanup.push(() => launch.remove());
    }
    function commandButton(parent, label, fn) { const button = node("button", label, parent); button.type = "button"; button.addEventListener("click", () => run(fn)); return button; }
    async function request(type, payload = {}) {
      if (disposed) throw new Error("Feature host disposed");
      if (!bridge?.featureRequest) throw new Error("Feature unavailable");
      const result = await bridge.featureRequest({ type, payload });
      if (!result?.ok) throw Object.assign(new Error(result?.error?.message || "Feature unavailable"), { code: result?.error?.code });
      return result.value;
    }
    function listen(target, type, fn) { target.addEventListener(type, fn); cleanup.push(() => target.removeEventListener(type, fn)); }
    const controls = options.playback || {
      getPosition: () => audio.currentTime || 0,
      play: () => { if (getState().playbackMode === "web") throw new Error("Playback adapter required"); return audio.play(); },
      pause: () => { if (getState().playbackMode === "web") throw new Error("Playback adapter required"); audio.pause(); },
      async seek(seconds) {
        if (getState().playbackMode === "web") throw new Error("Playback adapter required");
        if (audio.readyState < 1) await new Promise((resolve, reject) => {
          const finish = error => { clearTimeout(timer); audio.removeEventListener("loadedmetadata", loaded); audio.removeEventListener("error", failed); error ? reject(error) : resolve(); };
          const loaded = () => finish(), failed = () => finish(new Error("Playback adapter required"));
          const timer = setTimeout(failed, 10000); audio.addEventListener("loadedmetadata", loaded); audio.addEventListener("error", failed);
        });
        audio.currentTime = seconds;
      }
    };
    const render = () => { renderQueue(); renderNow(); };
    function applyRoomState(snapshot) {
      if (publishing || disposed) return Promise.resolve();
      roomWork = roomWork.catch(() => {}).then(async () => {
        if (disposed || (snapshot.roomId === appliedRoom && snapshot.seq <= appliedSeq)) return;
        appliedRoom = snapshot.roomId; appliedSeq = snapshot.seq; applying++;
        try {
          const s = getState(), old = s.queue;
          publishedQueue = JSON.stringify(snapshot.queue);
          const next = snapshot.queue.map(item => old.find(t => (t.videoId || t.id) === item.id) || { ...item, videoId: item.id, durationSeconds: item.duration });
          if (JSON.stringify(old.map(t => t.videoId || t.id)) !== JSON.stringify(next.map(t => t.videoId || t.id))) {
            if (s.settings?.queueLock || s.queueLock) throw new Error("Queue is locked");
            s.queue = next;
            try { if (await persistQueue() === false) throw new Error("Queue persistence rejected"); } catch (error) { s.queue = old; throw error; }
          }
          const selected = next[snapshot.playback.index];
          if (!selected) { await controls.pause(); render(); return; }
          s.currentIndex = snapshot.playback.index;
          if ((s.currentTrack?.videoId || s.currentTrack?.id) !== (selected.videoId || selected.id)) {
            if (await playTrack(selected) === false) throw new Error("Playback adapter required");
          }
          if (Math.abs(controls.getPosition() - snapshot.playback.position) > 0.4) await controls.seek(snapshot.playback.position);
          if (snapshot.playback.playing) await controls.play(); else await controls.pause();
          render();
        } finally { applying--; }
        await syncPlayback({ force: true, publishRoom: false });
      });
      return roomWork;
    }
    async function syncPlayback({ seeking = audio.seeking, playing = !audio.paused && !audio.ended && audio.readyState >= 3, force = false, publishRoom = true } = {}) {
      if (disposed || applying || publishing) return;
      const s = getState(), current = s.currentTrack, position = controls.getPosition();
      const changed = current !== lastTrack || (position + 2 < lastPosition && position < 2);
      if (changed || !playId) { playId = root.crypto?.randomUUID?.() || `play-${Date.now()}-${Math.random().toString(36).slice(2)}`; lastTrack = current; }
      lastPosition = position;
      if (playbackEnabled && (force || changed || Date.now() - lastTelemetry >= 4000)) {
        lastTelemetry = Date.now();
        const artist = current?.artist || current?.artists?.map(a => a.title || a.name || a).join(", ");
        await request("integrations.playback", { playId, track: current && artist ? { title: current.title, artist, album: typeof current.album === "string" ? current.album : current.album?.title || current.album?.name || "", durationSeconds: duration(current) } : null, playing, seeking: Boolean(seeking) });
      }
      if (roomEnabled && publishRoom) {
        syncWork = syncWork.catch(() => {}).then(async () => {
          if (applying || publishing || !roomEnabled || disposed) return;
          let snapshot = await request("room.state");
          const index = snapshot.queue.findIndex(t => t.id === (current?.videoId || current?.id));
          const send = async command => { snapshot = await request("room.command", { command: { ...command, expectedSeq: snapshot.seq } }); };
          if (index < 0) { if (snapshot.playback.playing) await send({ type: "pause" }); return; }
          publishing = true;
          try {
            if (snapshot.playback.index !== index) await send({ type: "select", index });
            if (seeking || Math.abs(snapshot.playback.position - position) > 2) await send({ type: "seek", position: Math.min(position, snapshot.queue[index].duration) });
            if (snapshot.playback.playing !== playing) await send({ type: playing ? "play" : "pause" });
          } finally { publishing = false; }
        });
        await syncWork;
      }
    }
    function syncQueue() {
      if (!roomEnabled || applying || disposed) return Promise.resolve();
      queueWork = queueWork.catch(() => {}).then(async () => {
        if (!roomEnabled || applying || disposed) return;
        const tracks = roomTracks(getState().queue), signature = JSON.stringify(tracks);
        if (signature === publishedQueue) return;
        await syncWork;
        publishing = true;
        try { await request("room.publish", { tracks }); publishedQueue = signature; } finally { publishing = false; }
        await syncPlayback({ force: true });
      });
      return queueWork;
    }
    const host = {
      async enable(config) {
        const tracks = roomTracks(getState().queue);
        const invite = await request("room.enable", config); roomEnabled = true;
        publishing = true;
        try { await request("room.publish", { tracks }); publishedQueue = JSON.stringify(tracks); }
        catch (error) { await request("room.disable"); roomEnabled = false; throw error; }
        finally { publishing = false; }
        await syncPlayback({ force: true }); return invite;
      },
      async disable() { await request("room.disable"); roomEnabled = false; },
      getState: () => request("room.state"),
      command: command => request("room.command", { command }),
      subscribe(fn) { subscribers.add(fn); return () => subscribers.delete(fn); }
    };
    const sourceCallbacks = {
      translate: t,
      versionCount: count => ({ "zh-TW": `${count} 個版本`, "zh-CN": `${count} 个版本`, ja: `${count} バージョン`, ko: `${count}개 버전` })[getState().settings?.language] || `${count} versions`,
      versionTitle: title => ({ "zh-TW": `其他版本：${title}`, "zh-CN": `其他版本：${title}`, ja: `他のバージョン：${title}`, ko: `다른 버전: ${title}` })[getState().settings?.language] || `Versions: ${title}`,
      listSources: () => request("sources.list"), upsertSource: config => request("sources.upsert", { config }),
      removeSource: id => request("sources.remove", { id }), setSourceHeaders: (id, headers) => request("sources.headers", { id, headers }),
      checkHealth: id => request("sources.health", { id }), queryVersions: (track, query) => request("sources.versions", { track, query }),
      async onSelect(candidate, original) {
        if (options.onSelectSource) return options.onSelectSource(candidate, original);
        if (candidate.sourceId !== "youtube") throw new Error("Playback adapter required");
        const result = await playTrack({ ...candidate, id: candidate.videoId || candidate.id });
        if (result === false) throw new Error("Playback was rejected");
        render(); await syncPlayback({ force: true });
      }
    };
    function mount(name, fn) { try { modules[name] = fn(); } catch (error) { report(error); } }
    mount("sources", () => root.AuralaneSourceTools.createSourceTools(sourceHost, {...sourceCallbacks,simple:options.integratedLayout}));
    const versionDialog = options.integratedLayout ? managedDialog("Song versions") : null;
    const versionHost = versionDialog?.body || section(queue, "Song versions"); versionHost.classList.add("feature-host-versions");
    mount("versions", () => root.AuralaneSourceTools.createSourceTools(versionHost, sourceCallbacks));
    if (versionDialog) versionDialog.dialog.addEventListener("close", () => modules.versions?.hideVersions());
    if (!options.integratedLayout) commandButton(versionHost, "Search versions", () => {
      if (!getState().currentTrack) throw new Error("Choose a song");
      return modules.versions?.showVersions(getState().currentTrack);
    });
    mount("listening", () => root.AuralaneListeningTools.init({ state, els, getAccountId, host: listeningHost, document: doc,
      storage: options.storage, onExport: options.onExport, onError: report, play: playTrack,
      snapshotsOnly: Boolean(options.integratedLayout), onCredit: options.onCredit,
      canRestore: () => !getState().onlineTogether?.blockAction(),
      persist: async () => { const result = await persistQueue(); if (result !== false) await syncQueue(); return result; }, render }));
    if (togetherHost) {
      mount("together", () => root.AuralaneTogether.mountTogether(togetherHost, { host, onState: snapshot => { void applyRoomState(snapshot).catch(report); }, onError: report }));
      commandButton(togetherHost, "Publish queue", syncQueue);
    }
    const optLabel = node("label", null, integrationHost), optIn = node("input", null, optLabel); optIn.type = "checkbox";
    node("span", "Submit listens and presence", optLabel);
    listen(optIn, "change", () => run(async () => {
      optIn.disabled = true;
      try { const result = await request("integrations.enablePlayback", { enabled: optIn.checked }); playbackEnabled = result.enabled; playId = ""; await syncPlayback({ force: true }); }
      catch (error) { playbackEnabled = false; optIn.checked = false; throw error; }
      finally { optIn.disabled = false; }
    }));
    const review = node("section", null, integrationHost); review.className = "feature-host-review"; review.hidden = true;
    function reviewImport(result) {
      const owner = getAccountId(); review.replaceChildren(); review.hidden = false;
      node("h3", "Review import", review); const list = node("ul", null, review), selected = new Set(result.matched);
      for (const item of result.matched) {
        const row = node("li", null, list);
        node("span", `${item.index + 1}. ${item.track.title} - ${item.track.artist || ""}`, row);
        commandButton(row, "Remove", () => { selected.delete(item); row.remove(); });
      }
      const addAll = commandButton(review, "Add all matched", async () => {
        const s = getState(); if (owner !== getAccountId()) throw new Error("Account changed");
        if (s.settings?.queueLock || s.queueLock) throw new Error("Queue is locked");
        addAll.disabled = true;
        const old = s.queue; s.queue = [...old, ...[...selected].map(item => item.track)];
        try {
          if (await persistQueue() === false) throw new Error("Queue persistence rejected");
        } catch (error) { s.queue = old; addAll.disabled = false; throw error; }
        review.hidden = true; review.replaceChildren(); render(); await syncQueue();
      });
      commandButton(review, "Cancel", () => { review.hidden = true; review.replaceChildren(); });
    }
    const integrationAPI = {
      status: () => request("integrations.status"), configure: (service, config) => request("integrations.configure", { service, config }),
      disconnect: service => request("integrations.disconnect", { service }), connectListenBrainz: token => request("integrations.connectListenBrainz", { token }),
      async importSpotify(url, { market = "TW", signal, onProgress } = {}) {
        const id = `import-${Date.now()}-${++importCounter}`, owner = getAccountId();
        const progress = value => { if (value.id === id) onProgress?.(value); };
        const abort = () => { void request("integrations.cancelImport", { id }).catch(report); };
        progressSubscribers.add(progress); signal?.addEventListener("abort", abort);
        try {
          if (signal?.aborted) return { status: "cancelled", matched: [], unmatched: [] };
          const result = await request("integrations.import", { id, url, market });
          if (owner !== getAccountId()) throw new Error("Account changed");
          return result;
        } finally { progressSubscribers.delete(progress); signal?.removeEventListener("abort", abort); }
      }
    };
    for (const method of ["beginLastFmLogin", "completeLastFmLogin", "connectDiscord", "retryOutbox"]) integrationAPI[method] = () => request(`integrations.${method}`);
    mount("integrations", () => root.IntegrationTools.mount(integrationHost, { api: integrationAPI, compact: options.integratedLayout, spotifyContainer: syncHost, language: () => getState().settings?.language, openExternal: url => request("integrations.openExternal", { url }), onImported: reviewImport }));
    if (bridge?.onFeatureEvent) cleanup.push(bridge.onFeatureEvent(event => {
      if (disposed || !event) return;
      if (event.type === "room.state") { roomEnabled = true; subscribers.forEach(fn => { try { fn(event.payload); } catch (error) { report(error); } }); }
      if (event.type === "room.disabled") roomEnabled = false;
      if (event.type === "integrations.importProgress") progressSubscribers.forEach(fn => fn(event.payload));
    }));
    else report(new Error("Feature unavailable"));
    for (const type of ["playing", "pause", "seeked", "ended", "waiting", "seeking", "emptied"]) listen(audio, type, () => {
      void syncPlayback({ force: true, seeking: type === "seeking", playing: type === "playing" ? true : ["waiting", "ended", "emptied", "pause"].includes(type) ? false : !audio.paused }).catch(report);
    });
    listen(audio, "timeupdate", () => { if (playbackEnabled && Date.now() - lastTelemetry >= 4000) void syncPlayback().catch(report); });
    // Translate known UI literals only; preserve arbitrary titles, URLs, input values and secrets.
    const originals = new WeakMap();
    function localize(parent) {
      if(parent===settings)for(const dialog of doc.querySelectorAll(".source-editor,.integration-editor"))localize(dialog);
      for (const child of parent.childNodes) {
        if (child.nodeType === 3) {
          // Only UI literals in known control surfaces, never metadata/result containers.
          const owner = child.parentElement;
          if (!owner?.closest("button, summary, legend, h2, h3, label, option, [role=status], .alt-muted") || owner.closest(".st-details, .st-version-meta, .st-endpoint, .alt-detail, .integration-tools-results, .feature-host-review li span")) continue;
          const original = originals.get(child) || child.nodeValue;
          if (labels[original] || originals.has(child)) { originals.set(child, original); const next = t(original); if (child.nodeValue !== next) child.nodeValue = next; }
        } else if (child.nodeType === 1 && !["INPUT", "TEXTAREA", "SCRIPT"].includes(child.tagName)) localize(child);
      }
    }
    const observer = root.MutationObserver ? new root.MutationObserver(records => {
      for (const record of records) if (record.type === "characterData" && originals.has(record.target)) {
        const previous = originals.get(record.target); if (record.target.nodeValue !== t(previous)) originals.delete(record.target);
      }
      localize(settings); localize(queue); if (snapshots) localize(snapshots.dialog); if (versionDialog) localize(versionDialog.dialog);
    }) : null;
    observer?.observe(settings, { childList: true, subtree: true, characterData: true });
    observer?.observe(queue, { childList: true, subtree: true, characterData: true });
    if (snapshots) observer?.observe(snapshots.dialog, { childList: true, subtree: true, characterData: true });
    if (versionDialog) observer?.observe(versionDialog.dialog, { childList: true, subtree: true, characterData: true });
    localize(settings); localize(queue);
    if (snapshots) localize(snapshots.dialog); if (versionDialog) localize(versionDialog.dialog);
    const ready = Promise.all([modules.sources?.ready, request("host.status").then(value => { if (value.sourceConfigError) report(new Error(value.sourceConfigError)); }).catch(report)]);
    return {
      ready, modules, syncQueue, syncPlayback,
      async refresh() { modules.listening?.refreshAccount(); await modules.sources?.refresh(); await modules.integrations?.refresh(); localize(settings); localize(queue); if (snapshots) localize(snapshots.dialog); if (versionDialog) localize(versionDialog.dialog); },
      showVersions: track => { if (versionDialog) { if (!versionDialog.dialog.open) versionDialog.dialog.showModal(); } else versionHost.parentNode.open = true; return modules.versions?.showVersions(track); },
      async dispose() {
        if (disposed) return;
        observer?.disconnect(); cleanup.forEach(fn => { if (typeof fn === "function") fn(); });
        modules.integrations?.destroy(); modules.listening?.destroy(); modules.sources?.destroy(); modules.versions?.destroy();
        try { await modules.together?.dispose(); await request("integrations.enablePlayback", { enabled: false }); }
        finally { disposed = true; await roomWork.catch(() => {}); settings.remove(); queue.remove(); }
      }
    };
  }
  const api = Object.freeze({ init, translate, roomTracks });
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AuralaneFeatureHost = api;
})(typeof window !== "undefined" ? window : globalThis);
