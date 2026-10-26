(function () {
  "use strict";
  const keys = ["login", "logout", "refresh", "liked", "more", "back", "loading", "empty", "play", "import", "cancel", "matching", "unmatched", "error", "expired", "changed", "network", "busy", "saved", "songs", "retry"];
  const labels = {
    en: ["Sign in to Spotify", "Disconnect", "Refresh", "Liked Songs", "Show more", "Back", "Loading…", "No items", "Play", "Save as playlist", "Cancel", "Matching", "Could not match", "Spotify is unavailable", "Sign in to Spotify to continue", "Spotify changed its web interface. Please update Auralane.", "Connection failed. Try again.", "Another operation is running", "Playlist saved", "songs", "Retry"],
    "zh-TW": ["登入 Spotify", "中斷連線", "重新整理", "喜歡的歌曲", "顯示更多", "返回", "載入中…", "沒有項目", "播放", "儲存為播放清單", "取消", "比對中", "無法比對", "Spotify 暫時無法使用", "請登入 Spotify 後繼續", "Spotify 的網頁介面已變更，請更新 Auralane。", "連線失敗，請重試。", "另一項操作正在進行", "已儲存播放清單", "首歌曲", "重試"],
    "zh-CN": ["登录 Spotify", "断开连接", "刷新", "喜欢的歌曲", "显示更多", "返回", "加载中…", "没有项目", "播放", "保存为播放列表", "取消", "匹配中", "无法匹配", "Spotify 暂时无法使用", "请登录 Spotify 后继续", "Spotify 的网页接口已变更，请更新 Auralane。", "连接失败，请重试。", "另一项操作正在进行", "已保存播放列表", "首歌曲", "重试"],
    ja: ["Spotify にログイン", "接続解除", "更新", "お気に入りの曲", "さらに表示", "戻る", "読み込み中…", "項目なし", "再生", "プレイリストに保存", "キャンセル", "照合中", "一致する曲なし", "Spotify を利用できません", "Spotify にログインしてください", "Spotify の仕様が変わりました。Auralane を更新してください。", "接続できません。再試行してください。", "別の操作が進行中です", "プレイリストを保存しました", "曲", "再試行"],
    ko: ["Spotify 로그인", "연결 해제", "새로 고침", "좋아요 표시한 곡", "더 보기", "뒤로", "불러오는 중…", "항목 없음", "재생", "재생목록으로 저장", "취소", "매칭 중", "일치하는 곡 없음", "Spotify를 사용할 수 없습니다", "Spotify에 로그인하세요", "Spotify 인터페이스가 변경되었습니다. Auralane을 업데이트하세요.", "연결하지 못했습니다. 다시 시도하세요.", "다른 작업이 진행 중입니다", "재생목록을 저장했습니다", "곡", "다시 시도"]
  };
  window.AuralaneSpotify = { init(o) {
    const host = document.getElementById("spotifyView"); host.dataset.i18nSkip = "";
    const n = (tag, value, cls) => { const e = document.createElement(tag); if (value !== undefined) e.textContent = value; if (cls) e.className = cls; return e; };
    const t = key => {
      const extra = { shuffle:["Shuffle","隨機播放","随机播放","シャッフル","무작위 재생"], switch:["Switch Spotify account","切換 Spotify 帳號","切换 Spotify 账号","Spotify アカウントを切り替え","Spotify 계정 전환"] };
      Object.assign(extra, {
        logout:["Sign out","登出","退出登录","ログアウト","로그아웃"],
        addAccount:["Add Spotify account","新增 Spotify 帳號","新增 Spotify 账号","Spotify アカウントを追加","Spotify 계정 추가"],
        renameAccount:["Rename account","重新命名帳號","重命名账号","アカウント名を変更","계정 이름 변경"],
        removeAccount:["Remove saved account","移除已儲存帳號","移除已保存账号","保存したアカウントを削除","저장된 계정 제거"],
        confirmRemove:["Remove this Spotify account from this device?","要從此裝置移除這個 Spotify 帳號嗎？","要从此设备移除这个 Spotify 账号吗？","このデバイスから Spotify アカウントを削除しますか？","이 기기에서 Spotify 계정을 제거할까요?"],
        signedOut:["Signed out","已登出","已退出","ログアウト済み","로그아웃됨"]
      });
      return extra[key]?.[Math.max(0,["en","zh-TW","zh-CN","ja","ko"].indexOf(o.state.settings.language))] || (labels[o.state.settings.language] || labels.en)[keys.indexOf(key)] || key;
    };
    const loginWaiting = () => ({ "zh-TW": "請在 Spotify 視窗完成登入", "zh-CN": "请在 Spotify 窗口完成登录", ja: "Spotify のウィンドウでログインしてください", ko: "Spotify 창에서 로그인을 완료하세요" })[o.state.settings.language] || "Complete sign-in in the Spotify window";
    let owner = "", revision = 0, connected = false, loaded = false, busy = false, selected = null, items = [], next = 0, total = null, notice = "", failure = "";
    let matching = false, signingIn = false, completed = 0, matchTotal = 0, unmatched = [], shown = 100, cancelled = false;
    let profiles = [], activeProfile = "";
    const account = () => String(o.getAccountId());
    async function request(type, payload = {}, independent = false) {
      const expected = owner, version = revision;
      const result = await window.metro.featureRequest({ type: `spotify.${type}`, payload: { account: expected, ...payload } });
      if (expected !== account() || expected !== owner || version !== revision) throw Object.assign(new Error("STALE"), { code: "STALE" });
      if (cancelled && type !== "cancel" && !independent) throw Object.assign(new Error("SPOTIFY_CANCELLED"), { code: "SPOTIFY_CANCELLED" });
      if (!result.ok) throw Object.assign(new Error(result.error.code), { code: result.error.code }); return result.value;
    }
    function message(error) {
      if (error.code === "STALE") return "";
      if (/SIGN_IN_REQUIRED/.test(error.code)) { connected = false; return t("expired"); }
      if (/API_CHANGED/.test(error.code)) return t("changed");
      if (/CANCELLED/.test(error.code)) return "";
      if (/BUSY/.test(error.code)) return t("busy");
      if (/NETWORK|TIMEOUT|RATE_LIMITED/.test(error.code)) return t("network");
      return t("error");
    }
    async function run(fn) {
      if (busy) return; busy = true; cancelled = false; failure = ""; notice = ""; const version = revision; render();
      try { await fn(); } catch (error) { if (version === revision) failure = message(error); }
      finally { if (version === revision) { busy = false; matching = false; signingIn = false; render(); } }
    }
    function button(icon, key, fn, enabled = true) {
      const b = n("button", undefined, "icon-button workspace-icon"); b.type = "button"; o.setIconButton(b, icon, t(key)); b.disabled = !enabled;
      b.addEventListener("click", fn); return b;
    }
    function art(src, target) {
      if (src) { const img = n("img"); img.src = src; img.alt = ""; img.loading = "lazy"; img.referrerPolicy = "no-referrer"; img.addEventListener("error", () => img.remove(), { once: true }); target.append(img); }
      else { const placeholder = n("span", undefined, "workspace-playlist-placeholder"); placeholder.innerHTML = o.icon("playlist"); target.append(placeholder); }
    }
    async function appendPage() {
      if (next === null) return;
      const page = await request("page", { id: selected?.id || "library", offset: next,...(activeProfile?{profileId:activeProfile}:{}) });
      items.push(...page.items); next = page.next; total = page.total; loaded = true;
      if(!selected&&profiles.some(profile=>profile.id===activeProfile&&profile.name==="Spotify"))applyAccounts(await request("status"));
      if(selected && page.image)selected={...selected,image:page.image};
    }
    async function open(playlist) {
      const startingView=o.state.activeView;
      selected = playlist; items = []; next = 0; total = null; unmatched = []; shown = 100; await appendPage();
      if (playlist && o.openCollection && startingView===o.state.activeView) publishCollection();
    }
    function pendingTracks(sources = items) {
      const ready=new Map([...(o.state.collectionResult?.tracks||[]),...(o.state.queue||[])].filter(track=>track.spotifyOrigin).map(track=>[track.spotifyOrigin,track]));
      return sources.map(source => ready.get(source.id) || ({id:`spotify-${source.id}`,title:source.name,artist:source.artists.map(a=>a.name).join(", "),artists:source.artists,album:source.album,thumbnail:source.image,durationSeconds:source.duration_ms/1000,lengthSeconds:source.duration_ms/1000,type:"track",kind:"track",spotifyAccount:owner,spotifySource:source}));
    }
    function publishCollection() {
      if (!selected || owner !== account()) return;
      o.openCollection?.({...selected,spotifyProfile:activeProfile||"default",name:selected.id==="liked"?t("liked"):selected.name},pendingTracks(),next,total);
    }
    async function loadMore() { return run(async()=>{await appendPage();if(selected && o.state.activeView==="collection")publishCollection();}); }
    async function lazyPlay(sources, shuffle = false) {
      const tracks=pendingTracks(sources);if(shuffle)for(let i=tracks.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[tracks[i],tracks[j]]=[tracks[j],tracks[i]];}
      if(tracks.length)await o.playTracks(tracks,0);
    }
    async function match(sources, save) {
      matching = true; completed = 0; matchTotal = sources.length; unmatched = []; render();
      const result = await request("match", { ids: sources.map(s => s.id) });
      matching = false; unmatched = result.unmatched.map(row => row.source);
      const tracks = result.matched.sort((a, b) => a.index - b.index).map(row => row.track);
      if (!tracks.length) { notice = t("unmatched"); return; }
      if (save) { await o.savePlaylist(selected.id === "liked" ? `Spotify · ${t("liked")}` : selected.name, tracks); notice = t("saved"); }
      else await o.playTracks(tracks, 0);
    }
    async function importAll() {
      while (next !== null) { await appendPage(); render(); }
      await o.savePlaylist(selected.id==="liked"?`Spotify · ${t("liked")}`:selected.name,pendingTracks());notice=t("saved");
    }
    function applyAccounts(result) {
      if (Array.isArray(result?.accounts)) profiles = result.accounts;
      if (result?.activeProfile) activeProfile = result.activeProfile;
      connected = Boolean(result?.connected);
    }
    async function changeAccount(type, payload = {}) {
      if (type === "accounts.add") { signingIn = true; render(); }
      try { applyAccounts(await request(type,payload)); }
      finally { signingIn = false; }
      selected = null; items = []; unmatched = []; next = 0; total = null; loaded = false;
      if (connected) await open(null); else loaded = true;
    }
    function render() {
      host.replaceChildren();
      const head = n("div", undefined, "section-head workspace-replay-heading"), title = n("div"); title.append(n("span", "Spotify", "eyebrow"), n("h1", selected?.id === "liked" ? t("liked") : selected?.name || "Spotify"));
      const tools = n("div", undefined, "workspace-toolbar");
      const profile=profiles.find(p=>p.id===activeProfile);
      if(connected&&profile?.name&&profile.name!=="Spotify")tools.append(n("span",profile.name,"spotify-account-name"));
      if (selected) tools.append(button("arrow-left", "back", () => run(() => open(null)), !busy));
      tools.append(button("refresh", "refresh", () => run(async () => { if (connected) await open(selected); else await initialize(); }), !busy));
      if (connected) {
        tools.append(button("user-minus", "logout", () => run(() => changeAccount("disconnect")), !busy));
      }
      else tools.append(button("user", "login", () => run(async () => { signingIn = true; render();const result=await request("login");applyAccounts(result); signingIn = false; connected = true; await open(null); }), !busy));
      head.append(title, tools); host.append(head);
      const status = n("p", signingIn ? loginWaiting() : matching ? `${t("matching")} ${completed}/${matchTotal}` : busy ? t("loading") : failure || notice || (!connected ? t("expired") : ""), "status"); status.setAttribute("role", "status"); host.append(status);
      if (busy) host.append(button("close", "cancel", () => { cancelled = true; void request("cancel").catch(() => {}); }));
      if (failure) host.append(button("refresh", "retry", () => run(async () => { if (connected) await open(selected); else await initialize(); }), !busy));
      if (!connected) return;
      if (selected) {
        const info = n("div", undefined, "spotify-playlist-heading"); art(selected.image, info);
        const copy = n("div"); copy.append(n("p", `${items.length}${total === null ? "" : ` / ${total}`} ${t("songs")}`), n("small", selected.owner || "")); info.append(copy);
        info.append(button("play", "play", () => run(() => lazyPlay(items)), !busy && items.length > 0), button("shuffle", "shuffle", () => run(() => lazyPlay(items,true)), !busy && items.length > 0), button("playlist", "import", () => run(importAll), !busy && items.length > 0)); host.append(info);
        const list = n("ol", undefined, "workspace-song-list");
        for (const [index, source] of items.slice(0, shown).entries()) {
          const li = n("li"); li.append(n("small", String(index + 1), "workspace-rank")); art(source.image, li);
          const copy = n("div", undefined, "workspace-song-copy"); copy.append(n("strong", source.name), n("small", source.artists.map(a => a.name).join(", "))); li.append(copy);
          li.append(button("play", "play", () => run(() => lazyPlay([source])), !busy)); list.append(li);
        } host.append(list);
      } else {
        const grid = n("div", undefined, "spotify-playlists");
        const liked = { id: "liked", name: t("liked"), image: "https://misc.scdn.co/liked-songs/liked-songs-640.png" };
        for (const playlist of [...items, liked]) {
          const b = n("button", undefined, "workspace-playlist-card"); b.type = "button"; b.disabled = busy; art(playlist.image, b); b.append(n("strong", playlist.name), n("small", playlist.owner || "Spotify"));
          b.addEventListener("click", () => run(() => open(playlist))); grid.append(b);
        } host.append(grid);
      }
      if (next !== null || selected && shown < items.length) { const b = n("button", t("more"), "spotify-more"); b.disabled = busy; b.addEventListener("click", () => run(async () => { if (!selected || shown >= items.length) await appendPage(); shown += 100; })); host.append(b); }
      if (loaded && !items.length && selected) host.append(n("p", t("empty"), "status"));
      if (unmatched.length) { const details = n("details"); details.append(n("summary", `${t("unmatched")} · ${unmatched.length}`)); const ul = n("ul"); for (const song of unmatched) ul.append(n("li", `${song.name} · ${song.artists.map(a => a.name).join(", ")}`)); details.append(ul); host.append(details); }
    }
    async function initialize() { const result = await request("status"); applyAccounts(result); if (connected) await open(null); else loaded = true; }
    function refresh() {
      if (owner !== account()) { owner = account(); revision++; connected = false; loaded = false; busy = false; signingIn = false; selected = null; items = []; unmatched = []; next = 0; notice = ""; failure = "";profiles=[];activeProfile=""; }
      if (o.state.activeView !== "spotify") return;
      if (!loaded && !busy) void run(initialize); else {
        if (selected && o.openCollection) { selected=null;items=[];next=0;total=null;void run(()=>open(null)); }
        else render();
      }
    }
    const off = window.metro.onFeatureEvent?.(event => {
      if (event.payload?.account !== owner || owner !== account()) return;
      if(event.type==="spotify.state" && event.payload.loginBlockedHost){
        failure=({"zh-TW":"登入跳轉遭安全檢查阻擋，請返回 Spotify 重試。","zh-CN":"登录跳转被安全检查阻止，请返回 Spotify 重试。",ja:"ログイン先への移動がブロックされました。Spotify から再試行してください。",ko:"로그인 이동이 차단되었습니다. Spotify에서 다시 시도하세요."})[o.state.settings.language]||"A sign-in redirect was blocked. Return to Spotify and retry.";
        if(o.state.activeView==="spotify")render();
      }
      if (event.type === "spotify.progress" && matching) { completed = event.payload.completed; matchTotal = event.payload.total; if (o.state.activeView === "spotify") { const status = host.querySelector('[role="status"]'); if (status) status.textContent = `${t("matching")} ${completed}/${matchTotal}`; } }
    });
    refresh(); return { refresh, loadMore, async pageForQueue(continuation) { const profileId=continuation.profileId||"default";const page=await request("page",{id:continuation.token,offset:continuation.offset,profileId},true);return {tracks:pendingTracks(page.items),continuations:page.next===null?[]:[{token:continuation.token,endpoint:"spotify",offset:page.next,profileId}]}; }, destroy: () => { revision++; off?.(); host.replaceChildren(); } };
  } };
})();
