(function () {
  "use strict";
  const M = window.AuralaneWorkspaceModel;
  const keys = ["replay", "smart", "create", "edit", "remove", "name", "all", "any", "artist", "liked", "downloaded", "plays", "recent", "duration", "min", "max", "yes", "no", "add", "save", "cancel", "sort", "limit", "preview", "songs", "artists", "week", "month", "year", "empty", "time", "play", "queue", "rules", "title", "matches", "deleteConfirm", "export", "since", "day", "none", "snapshot", "versions", "glass", "standard", "liquid", "reduce", "error"];
  const rows = {
    en: ["Replay", "Smart playlists", "Create smart playlist", "Edit", "Delete", "Name", "Match all", "Match any", "Artist contains", "Liked", "Downloaded", "Play count", "Last played (days)", "Duration (seconds)", "At least", "At most", "Yes", "No", "Add condition", "Save", "Cancel", "Sort", "Song limit", "Preview", "Songs", "Artists", "Week", "Month", "Year", "No listening history in this period", "Listening time", "Play", "Add to queue", "Rules", "Title", "matches", "Delete this smart playlist?", "Export JSON", "Detailed history since", "Date", "No matching songs", "Queue snapshots", "Other versions", "Appearance", "Standard", "Liquid Glass", "Reduce transparency", "Could not save changes"],
    "zh-TW": ["聆聽回顧", "智慧歌單", "建立智慧歌單", "編輯", "刪除", "名稱", "全部符合", "任一符合", "歌手包含", "已按讚", "已下載", "播放次數", "最近播放（天）", "歌曲長度（秒）", "至少", "至多", "是", "否", "新增條件", "儲存", "取消", "排序", "歌曲上限", "預覽", "歌曲", "歌手", "週", "月", "年", "這段期間尚無聆聽紀錄", "聆聽時間", "播放", "加入佇列", "規則", "歌名", "首符合", "刪除此智慧歌單？", "匯出 JSON", "詳細紀錄開始於", "日期", "沒有符合的歌曲", "佇列快照", "其他版本", "外觀", "標準", "Liquid Glass", "降低透明度", "無法儲存變更"],
    "zh-CN": ["收听回顾", "智能歌单", "创建智能歌单", "编辑", "删除", "名称", "全部符合", "任一符合", "歌手包含", "已点赞", "已下载", "播放次数", "最近播放（天）", "歌曲长度（秒）", "至少", "至多", "是", "否", "新增条件", "保存", "取消", "排序", "歌曲上限", "预览", "歌曲", "歌手", "周", "月", "年", "这段期间暂无收听记录", "收听时间", "播放", "加入队列", "规则", "歌名", "首符合", "删除此智能歌单？", "导出 JSON", "详细记录开始于", "日期", "没有符合的歌曲", "队列快照", "其他版本", "外观", "标准", "Liquid Glass", "降低透明度", "无法保存更改"],
    ja: ["リプレイ", "スマートプレイリスト", "スマートプレイリストを作成", "編集", "削除", "名前", "すべて一致", "いずれか一致", "アーティストを含む", "お気に入り", "ダウンロード済み", "再生回数", "最近の再生（日）", "曲の長さ（秒）", "以上", "以下", "はい", "いいえ", "条件を追加", "保存", "キャンセル", "並び順", "曲数の上限", "プレビュー", "曲", "アーティスト", "週", "月", "年", "この期間の再生履歴はありません", "再生時間", "再生", "キューに追加", "条件", "曲名", "曲一致", "このスマートプレイリストを削除しますか？", "JSON を書き出す", "詳細履歴の開始日", "日付", "一致する曲がありません", "キューのスナップショット", "他のバージョン", "外観", "標準", "Liquid Glass", "透明度を下げる", "変更を保存できません"],
    ko: ["감상 회고", "스마트 재생목록", "스마트 재생목록 만들기", "편집", "삭제", "이름", "모두 일치", "하나 이상 일치", "아티스트 포함", "좋아요", "다운로드됨", "재생 횟수", "최근 재생 (일)", "곡 길이 (초)", "이상", "이하", "예", "아니요", "조건 추가", "저장", "취소", "정렬", "최대 곡 수", "미리 보기", "곡", "아티스트", "주", "월", "년", "이 기간의 감상 기록이 없습니다", "감상 시간", "재생", "대기열에 추가", "조건", "제목", "곡 일치", "이 스마트 재생목록을 삭제할까요?", "JSON 내보내기", "상세 기록 시작일", "날짜", "일치하는 곡이 없습니다", "대기열 스냅샷", "다른 버전", "모양", "표준", "Liquid Glass", "투명도 줄이기", "변경 사항을 저장할 수 없습니다"]
  };
  function text(key, language) {
    if (key === "transparency") return ({ "zh-TW": "元件透明度", "zh-CN": "组件透明度", ja: "コンポーネントの透明度", ko: "구성 요소 투명도" })[language] || "Component transparency";
    if (key === "more") return ({ "zh-TW": "顯示更多", "zh-CN": "显示更多", ja: "さらに表示", ko: "더 보기" })[language] || "Show more";
    if (key === "export") return ({ "zh-TW": "匯出", "zh-CN": "导出", ja: "書き出す", ko: "내보내기" })[language] || "Export";
    if (key === "material") return ({ "zh-TW": "介面材質", "zh-CN": "界面材质", ja: "インターフェース素材", ko: "인터페이스 재질" })[language] || "Interface material";
    return (rows[language] || rows.en)[keys.indexOf(key)] || key;
  }
  function database() {
    return new Promise((resolve, reject) => {
      let blocked = false;
      const request = indexedDB.open("auralane-workspace", 2);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains("accounts")) request.result.createObjectStore("accounts");
        if (!request.result.objectStoreNames.contains("records")) {
          const records = request.result.createObjectStore("records"); records.createIndex("account", "account"); records.createIndex("accountDay", ["account", "day"]);
        }
      };
      request.onblocked = () => { blocked = true; reject(new Error("Close other Auralane preview windows to update listening storage.")); };
      request.onerror = () => reject(request.error); request.onsuccess = () => { if (blocked) { request.result.close(); return; } request.result.onversionchange = () => request.result.close(); resolve(request.result); };
    });
  }
  async function init(o) {
    const db = await database(), cleanup = [];
    let data = M.blank(), owner = "", revision = 0, period = "week", selectedDate = M.day(Date.now()), exportFormat = "json", dirty = false, write = Promise.resolve(), loading = false;
    let activeRule = null, playbackSession = { id: "", seconds: 0, counted: false },dateChosen=false;
    let replaySource = o.youtubeHistory ? "youtube" : "local", cloud = null, disposed = false;
    const remoteText = key => {
      const values = {
        en: ["YouTube Music", "On this device", "Recent listening", "Refresh", "Sign in to YouTube Music", "Could not load listening history", "Loading…", "No listening history", "More", "History available from YouTube Music; not a complete listening-time report."],
        "zh-TW": ["YouTube Music", "這部裝置", "最近聆聽", "重新整理", "請登入 YouTube Music", "無法載入聆聽紀錄", "載入中…", "尚無聆聽紀錄", "更多", "顯示 YouTube Music 可取得的歷史紀錄，並非完整聆聽時數報表。"],
        "zh-CN": ["YouTube Music", "这台设备", "最近收听", "刷新", "请登录 YouTube Music", "无法加载收听记录", "加载中…", "暂无收听记录", "更多", "显示 YouTube Music 可获取的历史记录，并非完整收听时长报表。"],
        ja: ["YouTube Music", "このデバイス", "最近の再生", "更新", "YouTube Music にログインしてください", "再生履歴を読み込めません", "読み込み中…", "再生履歴はありません", "その他", "YouTube Music から取得できた履歴です。完全な再生時間の集計ではありません。"],
        ko: ["YouTube Music", "이 기기", "최근 감상", "새로 고침", "YouTube Music에 로그인하세요", "감상 기록을 불러올 수 없습니다", "불러오는 중…", "감상 기록 없음", "더 보기", "YouTube Music에서 제공한 기록이며 전체 감상 시간 통계는 아닙니다."]
      };
      return (values[o.state.settings.language] || values.en)[["youtube", "local", "recent", "refresh", "login", "error", "loading", "empty", "more", "scope"].indexOf(key)] || key;
    };
    function loadCloud(force = false) {
      if (!o.youtubeHistory || !o.signedIn?.()) return;
      if (!force && cloud?.owner === owner && (cloud.pending || Date.now() - cloud.loadedAt < 60000)) return;
      const entry = { owner, pending: true, value: cloud?.owner===owner?cloud.value:null, error: false,loadedAt:Date.now() }; cloud = entry;
      let timer;
      Promise.race([Promise.resolve().then(() => o.youtubeHistory()), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("TIMEOUT")), 20000); })])
        .then(value => { if (!Array.isArray(value?.sections)) throw new Error("INVALID_HISTORY"); entry.value = value; })
        .catch(() => { entry.error = true; })
        .finally(() => { clearTimeout(timer); entry.pending = false; if (!disposed && cloud === entry && entry.owner === owner && owner === String(o.getAccountId())) renderReplay(); });
    }
    let changed = new Map(), lastPruned = "";
    const t = key => text(key, o.state.settings.language);
    function flush() {
      if (!dirty || loading) return write;
      const saved = structuredClone({ ...data, records: [], splitRecords: true }), records = structuredClone([...changed.values()]), key = owner;
      changed.clear(); dirty = false;
      write = write.catch(() => {}).then(() => new Promise((resolve, reject) => {
        const tx = db.transaction(["accounts", "records"], "readwrite"), target = tx.objectStore("records");
        tx.objectStore("accounts").put(saved, key);
        for (const record of records) target.put({ account: key, day: record.day, value: record }, [key, record.day, M.id(record.track)]);
        const today = M.day(Date.now());
        if (today !== lastPruned) {
          const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 800);
          const cursor = target.index("accountDay").openKeyCursor(IDBKeyRange.bound([key, ""], [key, M.day(cutoff)], false, true));
          cursor.onsuccess = () => { if (cursor.result) { target.delete(cursor.result.primaryKey); cursor.result.continue(); } };
        }
        tx.oncomplete = () => { if (owner === key) lastPruned = today; resolve(); }; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
      })).catch(error => {
        if (owner === key) { dirty = true; for (const record of records) { const id = record.day + "|" + M.id(record.track); if (!changed.has(id)) changed.set(id, record); } }
        o.toast(t("error"), true); throw error;
      });
      return write;
    }
    function readAccount(key) {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(["accounts", "records"], "readonly"), meta = tx.objectStore("accounts").get(key), records = tx.objectStore("records").index("account").getAll(key);
        tx.oncomplete = () => resolve(meta.result?.splitRecords ? { ...meta.result, records: records.result.map(r => r.value) } : meta.result);
        tx.onerror = () => reject(tx.error);
      });
    }
    async function account() {
      const key = String(o.getAccountId()), token = ++revision;
      if (editor.open) editor.close(); if (details.open) details.close();
      smart.replaceChildren(); replay.replaceChildren();
      await flush(); if (token !== revision) return; loading = true;
      const saved = await readAccount(key);
      if (token !== revision || key !== String(o.getAccountId())) return;
      owner = key; data = M.normalize(saved); playbackSession = { id: "", seconds: 0, counted: false }; loading = false;
      changed = new Map(); lastPruned = "";
      if (saved && !saved.splitRecords && data.records.length) { for (const record of data.records) changed.set(record.day + "|" + M.id(record.track), record); dirty = true; await flush(); }
      if (editor.open) editor.close(); activeRule = null; refresh();
    }
    const node = (tag, content, className) => { const v = document.createElement(tag); if (content !== undefined) v.textContent = content; if (className) v.className = className; return v; };
    function button(icon, key, fn) { const b = node("button", undefined, "icon-button workspace-icon"); b.type = "button"; o.setIconButton(b, icon, t(key)); b.addEventListener("click", () => Promise.resolve().then(fn).catch(e => o.toast(e.message, true))); return b; }
    function select(options, value, changed) { const s = node("select"); for (const [key, label] of options) { const opt = node("option", t(label)); opt.value = key; s.append(opt); } s.value = value; if (changed) s.addEventListener("change", changed); return s; }
    function field(key, control) { const label = node("label", undefined, "workspace-field"); label.append(node("span", t(key)), control); control.setAttribute("aria-label", t(key)); return label; }
    function dialog(key) { const d = node("dialog", undefined, "workspace-dialog"); d.dataset.i18nSkip = ""; const head = node("header"); head.append(node("h2", t(key)), button("close", "cancel", () => d.close())); d.append(head); document.body.append(d); d.addEventListener("click", event => { if (event.target === d) { const r = d.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) d.close(); } }); return d; }
    const replay = document.getElementById("replayView"); replay.dataset.i18nSkip = "";
    const smart = node("section", undefined, "workspace-smart"); smart.dataset.i18nSkip = "";
    document.getElementById("syncedPlaylistsSection").before(smart);
    const editor = dialog("create"), editorBody = node("div", undefined, "workspace-dialog-body"); editor.append(editorBody);
    const details = dialog("smart"), results = node("div", undefined, "workspace-dialog-body"); details.append(results);
    function evaluate(rule) { return M.evaluate(rule, [...data.records.map(r => r.track), ...o.getTracks()], data, { liked: o.isLiked, downloaded: o.isDownloaded }); }
    function list(parent, tracks, metrics) {
      if(o.renderSongs){o.renderSongs(parent,tracks);return;}
      const ul = node("ol", undefined, "workspace-song-list"); parent.append(ul);
      let cursor = 0;
      const more = node("button", t("more")); more.type = "button";
      function appendBatch() {
      const end = Math.min(tracks.length, cursor + 100);
      tracks.slice(cursor, end).forEach((track, index) => {
        const i = cursor + index;
        const li = node("li"), number = node("span", String(i + 1), "workspace-rank"), art = node("img"), copy = node("div", undefined, "workspace-song-copy");
        const url = o.thumbnail(track); if (url) { art.src = url; art.alt = ""; art.loading = "lazy"; art.referrerPolicy = "no-referrer"; } else art.hidden = true;
        copy.append(node("strong", track.title || ""), node("small", M.artist(track)));
        li.append(number, art, copy); if (metrics) li.append(node("small", metrics(i), "workspace-metric"));
        li.append(button("play", "play", () => o.playTracks(tracks, i))); ul.append(li);
      });
      cursor = end; more.hidden = cursor >= tracks.length;
      }
      more.addEventListener("click", appendBatch); appendBatch();
      if (tracks.length > 100) parent.append(more);
      if (!tracks.length) parent.append(node("p", t("none"), "status"));
    }
    function showRule(rule) {
      activeRule = rule.id; results.replaceChildren(); details.querySelector("h2").textContent = rule.name;
      const tracks = evaluate(rule), tools = node("div", undefined, "workspace-toolbar");
      tools.append(node("span", `${tracks.length} ${t("matches")}`), button("play", "play", () => o.playTracks(tracks, 0)), button("queue", "queue", () => o.queueTracks(tracks)), button("edit", "edit", () => { details.close(); edit(rule); }), button("trash", "remove", async () => {
        if (!confirm(t("deleteConfirm"))) return;
        const previous = data.rules; data.rules = previous.filter(v => v.id !== rule.id); dirty = true;
        try { await flush(); } catch (error) { data.rules = previous; throw error; }
        details.close(); renderSmart();
      }));
      results.append(tools); list(results, tracks); if (!details.open) details.showModal();
    }
    function edit(rule) {
      editorBody.replaceChildren(); editor.querySelector("h2").textContent = t(rule ? "edit" : "create");
      let conditions = structuredClone(rule?.conditions || [{ field: "liked", value: true, op: "min" }]);
      const form = node("form"), name = node("input"); name.required = true; name.maxLength = 80; name.value = rule?.name || "";
      const mode = select([["all", "all"], ["any", "any"]], rule?.mode || "all");
      const sort = select([["title", "title"], ["plays", "plays"], ["recent", "recent"], ["duration", "duration"]], rule?.sort || "title");
      const limit = node("input"); limit.type = "number"; limit.min = 1; limit.max = 2000; limit.required = true; limit.value = rule?.limit || 100;
      const controls = node("div", undefined, "workspace-rule-settings"); controls.append(field("name", name), field("rules", mode), field("sort", sort), field("limit", limit));
      const conditionsHost = node("div", undefined, "workspace-conditions"), preview = node("div", undefined, "workspace-preview"), message = node("p", "", "status"); message.setAttribute("role", "status");
      const build = () => ({ id: rule?.id || crypto.randomUUID(), name: name.value.trim(), mode: mode.value, sort: sort.value, limit: Number(limit.value), conditions: structuredClone(conditions), updatedAt: Date.now() });
      function renderConditions() {
        conditionsHost.replaceChildren();
        conditions.forEach((c, i) => {
          const row = node("div", undefined, "workspace-condition"), property = select(M.fields.map(v => [v, v]), c.field, () => {
            c.field = property.value; c.value = ["liked", "downloaded"].includes(c.field) ? true : c.field === "artist" ? "" : c.field === "recent" ? 30 : 0; c.op = c.field === "recent" ? "max" : "min"; renderConditions();
          }); property.setAttribute("aria-label", t("rules")); row.append(property);
          if (["liked", "downloaded"].includes(c.field)) { const v = select([["true", "yes"], ["false", "no"]], String(c.value), () => { c.value = v.value === "true"; }); row.append(v); }
          else {
            if (c.field !== "artist") { const op = select([["min", "min"], ["max", "max"]], c.op || "min", () => { c.op = op.value; }); row.append(op); }
            const v = node("input"); v.type = c.field === "artist" ? "text" : "number"; v.value = c.value; v.required = true; v.min = c.field === "recent" ? 1 : 0; v.maxLength = 300; v.setAttribute("aria-label", t(c.field)); v.addEventListener("input", () => { c.value = v.type === "number" ? Number(v.value) : v.value; }); row.append(v);
          }
          const remove = button("close", "remove", () => { conditions.splice(i, 1); renderConditions(); }); remove.disabled = conditions.length <= 1; row.append(remove); conditionsHost.append(row);
        });
      }
      const toolbar = node("div", undefined, "workspace-toolbar");
      const add = button("playlist", "add", () => { if (conditions.length >= 12) return; conditions.push({ field: "artist", value: "", op: "min" }); renderConditions(); });
      const check = node("button", t("preview")); check.type = "button"; check.addEventListener("click", () => {
        try { const proposal = build(); proposal.name ||= t("smart"); const tracks = evaluate(proposal); preview.replaceChildren(node("p", `${tracks.length} ${t("matches")}`)); list(preview, tracks.slice(0, 10)); message.textContent = ""; } catch (error) { message.textContent = error.message; }
      });
      const save = node("button", t("save"), "primary-action"); save.type = "submit"; toolbar.append(add, check, save);
      form.append(controls, conditionsHost, toolbar, message, preview); editorBody.append(form); renderConditions();
      const editingAccount = owner;
      form.addEventListener("submit", async event => {
        event.preventDefault(); save.disabled = true;
        try {
          if (loading || owner !== editingAccount || String(o.getAccountId()) !== editingAccount) throw new Error(t("error"));
          const value = M.validateRule(build()), previous = data.rules;
          data.rules = [value, ...previous.filter(v => v.id !== value.id)]; dirty = true;
          try { await flush(); } catch (error) { data.rules = previous; throw error; }
          editor.close(); renderSmart();
        } catch (error) { message.textContent = error.message; }
        finally { save.disabled = false; }
      });
      editor.showModal(); name.focus();
    }
    function renderSmart() {
      if (!smart.isConnected) return;
      if (loading || owner !== String(o.getAccountId())) { smart.replaceChildren(); return; }
      smart.hidden = o.state.playlistsFilter === "synced";
      smart.replaceChildren(); const head = node("div", undefined, "section-head"); head.append(node("h2", t("smart")), button("playlist", "create", () => edit())); smart.append(head);
      const cards = node("div", undefined, "cards"); smart.append(cards);
      const query = String(o.state.playlistsQuery || "").toLocaleLowerCase();
      for (const rule of data.rules.filter(v => v.name.toLocaleLowerCase().includes(query))) {
        const matches = evaluate(rule), card = node("button", undefined, "workspace-playlist-card"); card.type = "button";
        const cover = o.thumbnail(matches[0]); if (cover) { const img = node("img"); img.src = cover; img.alt = ""; img.loading = "lazy"; card.append(img); }
        else { const icon = node("span", undefined, "workspace-playlist-placeholder"); icon.innerHTML = o.icon("playlist"); card.append(icon); }
        card.append(node("strong", rule.name), node("small", `${t("smart")} · ${matches.length} ${t("songs")}`)); card.addEventListener("click", () => showRule(rule)); cards.append(card);
      }
    }
    function renderReplay() {
      if (disposed) return;
      if (o.state.activeView !== "replay") return;
      if (loading || owner !== String(o.getAccountId())) { replay.replaceChildren(); return; }
      if(!dateChosen)selectedDate=M.day(Date.now());
      replay.replaceChildren(); const result = M.replay(data, period, new Date(selectedDate + "T12:00:00").getTime());
      const header = node("div", undefined, "section-head workspace-replay-heading"), copy = node("div"); copy.append(node("span", "Auralane", "eyebrow"), node("h1", t("replay")));
      const toolbar = node("div", undefined, "workspace-toolbar");
      if (o.youtubeHistory) {
        for (const source of ["youtube", "local"]) { const tab = node("button", remoteText(source), "chip"); tab.type = "button"; tab.classList.toggle("active", replaySource === source); tab.setAttribute("aria-pressed", String(replaySource === source)); tab.addEventListener("click", () => { replaySource = source; renderReplay(); }); toolbar.append(tab); }
      }
      if (replaySource === "youtube") {
        const reload = node("button", undefined, "icon-button workspace-icon"); reload.type = "button"; o.setIconButton(reload, "refresh", remoteText("refresh")); reload.disabled = cloud?.owner === owner && cloud.pending;
        reload.addEventListener("click", () => { loadCloud(true); renderReplay(); }); toolbar.append(reload); header.append(copy, toolbar); replay.append(header);
        if (!o.signedIn?.()) { replay.append(node("p", remoteText("login"), "status")); return; }
        loadCloud();
        const today=M.day(Date.now()),recent=[...data.records].filter(record=>record.day===today).sort((a,b)=>b.lastPlayed-a.lastPlayed).map(record=>record.track);
        if(recent.length){const section=node("section");section.append(node("h2",({"zh-TW":"今天在這部裝置聆聽","zh-CN":"今天在此设备收听",ja:"今日このデバイスで再生",ko:"오늘 이 기기에서 감상"})[o.state.settings.language]||"Today on this device"));list(section,recent);replay.append(section);}
        if (cloud?.pending&&!cloud.value) { replay.append(node("p", remoteText("loading"), "status")); return; }
        if (cloud?.error) { replay.append(node("p", remoteText("error"), "status")); return; }
        replay.append(node("p", remoteText("scope"), "status"));
        if (!cloud?.value?.sections?.length) replay.append(node("p", remoteText("empty"), "status"));
        for (const group of cloud?.value?.sections || []) { const section = node("section"); section.append(node("h2", group.title || remoteText("recent"))); list(section, group.tracks || []); replay.append(section); }
        return;
      }
      const filters=node("div",undefined,"workspace-toolbar replay-periods");
      for (const p of ["week", "month", "year"]) { const b = node("button", t(p), "chip"); b.type = "button"; b.classList.toggle("active", period === p); b.setAttribute("aria-pressed", String(period === p)); b.addEventListener("click", () => { period = p; renderReplay(); }); filters.append(b); }
      const advanced = node("div", undefined, "replay-options"); filters.append(advanced);
      const date = node("input"); date.type = "date"; date.value = selectedDate; date.setAttribute("aria-label", t("day")); date.addEventListener("change", () => { if (date.value) { selectedDate = date.value;dateChosen=true; renderReplay(); } }); advanced.append(date);
      const format = select([["json", "JSON"], ["csv", "CSV"]], exportFormat, () => { exportFormat = format.value; }); format.setAttribute("aria-label", t("export")); advanced.append(format);
      advanced.append(button("download", "export", () => {
        const cell = value => { let v = String(value ?? ""); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return '"' + v.replaceAll('"', '""') + '"'; };
        const content = exportFormat === "json" ? JSON.stringify(result, null, 2) : "song_id,title,artist,listening_seconds,plays\r\n" + result.songs.map(s => [M.id(s.track), s.track.title, M.artist(s.track), s.seconds, s.plays].map(cell).join(",")).join("\r\n");
        const url = URL.createObjectURL(new Blob([content], { type: exportFormat === "json" ? "application/json" : "text/csv;charset=utf-8" })); const a = node("a"); a.href = url; a.download = `Auralane-Replay-${result.from}.${exportFormat}`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      })); header.append(copy, toolbar); replay.append(header,filters);
      const legacy = o.legacySummary?.(period, new Date(selectedDate + "T12:00:00"));
      const total = Math.max(result.seconds, legacy?.seconds || 0), metrics = node("div", undefined, "workspace-replay-metrics");
      for (const [label, value] of [["time", `${Math.floor(total / 3600)}h ${Math.floor(total % 3600 / 60)}m`], ["songs", result.songs.length]]) { const metric = node("div"); metric.append(node("small", t(label)), node("strong", String(value))); metrics.append(metric); }
      replay.append(metrics);
      if (!result.songs.length) { replay.append(node("p", t("empty"), "status")); return; }
      const columns = node("div", undefined, "workspace-replay-songs"), songSection = node("section");
      songSection.append(node("h2", t("songs"))); list(songSection, result.songs.map(v => v.track), i => `${Math.floor(result.songs[i].seconds / 60)}m · ${result.songs[i].plays}`);
      columns.append(songSection); replay.append(columns);
    }
    function refresh() {
      const nav = document.querySelector('.nav[data-view="replay"] .nav-text'); if (nav) nav.textContent = t("replay");
      if (o.state.activeView === "replay") renderReplay();
      if (o.state.activeView === "playlists") renderSmart();
    }
    function onCredit(track, seconds, time) {
      if (loading || owner !== String(o.getAccountId())) return;
      if (playbackSession.id !== M.id(track)) playbackSession = { id: M.id(track), seconds: 0, counted: false };
      playbackSession.seconds += seconds;
      const threshold = Math.max(30, Math.min((M.duration(track) || 60) / 2, 240));
      const counted = !playbackSession.counted && playbackSession.seconds >= threshold;
      if (counted) playbackSession.counted = true;
      const record = M.credit(data, track, seconds, time, counted); if (record) changed.set(record.day + "|" + M.id(record.track), record); dirty = true;
    }
    const timer = setInterval(() => { void flush().catch(() => {}); if (!document.hidden && o.state.activeView === "replay" && !replay.querySelector("input:focus,select:focus,textarea:focus") && !editor.open && !details.open) renderReplay(); }, 10000);
    const ended = () => { playbackSession = { id: "", seconds: 0, counted: false }; };
    o.audio.addEventListener("ended", ended); cleanup.push(() => o.audio.removeEventListener("ended", ended));
    o.audio.addEventListener("loadstart", ended); cleanup.push(() => o.audio.removeEventListener("loadstart", ended));
    const leave = () => { void flush().catch(() => {}); }; window.addEventListener("pagehide", leave); cleanup.push(() => window.removeEventListener("pagehide", leave));
    for (const type of ["pause", "ended", "waiting"]) { o.audio.addEventListener(type, leave); cleanup.push(() => o.audio.removeEventListener(type, leave)); }
    await account();
    return { refresh, account, onCredit, renderSmart, renderReplay, text: t,
      async exportData() {
        await flush();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(["accounts", "records"], "readonly"), store = tx.objectStore("accounts"), keys = store.getAllKeys(), values = store.getAll(), records = tx.objectStore("records").getAll();
          tx.oncomplete = () => {
            const byAccount = new Map(); for (const record of records.result) { if (!byAccount.has(record.account)) byAccount.set(record.account, []); byAccount.get(record.account).push(record.value); }
            resolve({ version: 1, accounts: keys.result.map((key, i) => ({ key, data: values.result[i].splitRecords ? { ...values.result[i], records: byAccount.get(key) || [] } : values.result[i] })) });
          };
          tx.onerror = () => reject(tx.error);
        });
      },
      async importData(value) {
        if (value?.version !== 1 || !Array.isArray(value.accounts) || value.accounts.length > 100 || value.accounts.some(v => typeof v.key !== "string" || v.key.length > 256 || !v.key || v.data?.version !== 1 || !Array.isArray(v.data.records) || v.data.records.length > 500000 || !Array.isArray(v.data.rules))) throw new Error("Invalid listening backup");
        if (new Set(value.accounts.map(v => v.key)).size !== value.accounts.length) throw new Error("Duplicate backup accounts");
        await flush(); loading = true; if (editor.open) editor.close(); if (details.open) details.close();
        try {
          await new Promise((resolve, reject) => {
            const tx = db.transaction(["accounts", "records"], "readwrite"), target = tx.objectStore("records");
            for (const entry of value.accounts) {
              const normalized = M.normalize(entry.data); tx.objectStore("accounts").put({ ...normalized, records: [], splitRecords: true }, entry.key);
              const request = target.index("account").openKeyCursor(IDBKeyRange.only(entry.key));
              request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) { target.delete(cursor.primaryKey); cursor.continue(); }
                else for (const record of normalized.records) target.put({ account: entry.key, day: record.day, value: record }, [entry.key, record.day, M.id(record.track)]);
              };
            }
            tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
          });
          dirty = false; changed.clear();
        } finally { loading = false; }
        await account();
      },
      getData: () => data, async destroy() { disposed = true; cloud = null; clearInterval(timer); cleanup.forEach(fn => fn()); await flush(); editor.remove(); details.remove(); smart.remove(); db.close(); } };
  }
  window.AuralaneMusicWorkspace = { init, text };
})();
