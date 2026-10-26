"use strict";

const crypto = require("node:crypto");
const { matchTrack } = require("./musicIntegrations");
const googleLoginDomains = require("../config/google-login-domains.json").domains.split(" ");
const ENDPOINT = "https://api-partner.spotify.com/pathfinder/v2/query";
const OPERATIONS = {
  libraryV3: "973e511ca44261fda7eebac8b653155e7caee3675abb4fb110cc1b8c78b091c3",
  fetchPlaylist: "346811f856fb0b7e4f6c59f8ebea78dd081c6e2fb01b77c954b26259d5fc6763",
  fetchLibraryTracks: "087278b20b743578a6262c2b0b4bcd20d879c503cc359a2285baf083ef944240"
};
const fault = code => Object.assign(new Error(code), { code });
function image(value) {
  const sources = value?.items?.[0]?.sources || value?.sources || [];
  return [...sources].sort((a, b) => (b.width || 0) - (a.width || 0)).map(s => s.url).find(url => {
    try { return new URL(url).protocol === "https:"; } catch { return false; }
  }) || "";
}
function parsePage(operation, root) {
  if (root.errors?.length) throw fault("SPOTIFY_API_CHANGED");
  const library = operation === "libraryV3";
  const data = library ? root.data?.me?.libraryV3 : operation === "fetchPlaylist" ? root.data?.playlistV2?.content : root.data?.me?.library?.tracks;
  if (!Array.isArray(data?.items)) throw fault("SPOTIFY_API_CHANGED");
  const items = [];
  for (const row of data.items) {
    if (library) {
      const wrapper = row.item, item = wrapper?.data, id = wrapper?._uri?.match(/^spotify:playlist:([A-Za-z0-9]{22})$/)?.[1];
      if (id && item?.name && item.__typename === "Playlist") items.push({ id, name: String(item.name), owner: item.ownerV2?.data?.name || "", image: image(item.images) });
    } else {
      const wrapper = row.itemV2 || row.track, item = wrapper?.data;
      const id = (item?.uri || item?._uri || wrapper?._uri)?.match(/^spotify:track:([A-Za-z0-9]{22})$/)?.[1];
      if (!id || !item?.name) continue;
      const artists = (item.artists?.items || []).map(a => ({ name: a.profile?.name || "" })).filter(a => a.name);
      items.push({ id, name: String(item.name), artists, album: item.albumOfTrack?.name || "", duration_ms: (item.trackDuration || item.duration)?.totalMilliseconds || 0, image: image(item.albumOfTrack?.coverArt) });
    }
  }
  return { items, rawCount: data.items.length, total: Number.isFinite(data.totalCount) ? data.totalCount : null };
}
function variables(operation, id, offset) {
  if (operation === "libraryV3") return { filters: ["Playlists"], order: null, textFilter: "", features: ["LIKED_SONGS", "YOUR_EPISODES_V2", "PRERELEASES", "EVENTS"], limit: 50, offset, flatten: true, expandedFolders: [], folderUri: null, includeFoldersWhenFlattening: false };
  return operation === "fetchPlaylist" ? { uri: `spotify:playlist:${id}`, offset, limit: 100, enableWatchFeedEntrypoint: false } : { offset, limit: 100 };
}
function allowedNavigation(url) {
  try {
    const u = new URL(url);
    const hosts = ["spotify.com", "scdn.co", "google.com", "google.com.tw", "gstatic.com", "facebook.com", "apple.com"];
    return u.protocol === "https:" && !u.username && !u.password && !u.port &&
      (u.hostname === "accounts.youtube.com" || hosts.some(host => u.hostname === host || u.hostname.endsWith(`.${host}`)) || googleLoginDomains.some(host => u.hostname === `accounts.${host}` || u.hostname === `www.${host}` || u.hostname === host));
  }
  catch { return false; }
}
function loginStoragePermission(contents, permission, details = {}) {
  return ["storage-access", "top-level-storage-access"].includes(permission) &&
    allowedNavigation(contents?.getURL?.() || "") &&
    allowedNavigation(details.requestingUrl || details.requestingOrigin || contents?.getURL?.() || "");
}

// Authentication stays inside an isolated real Spotify web player. No passwords,
// cookies or bearer tokens are exposed through the renderer bridge.
function createSpotifyLibrary({ electron = require("electron"), account, youtube, parent, emit = () => {}, timeout = 20000 }) {
  const partition = `persist:auralane-spotify-${crypto.createHash("sha256").update(account).digest("hex").slice(0, 24)}`;
  const session = electron.session.fromPartition(partition);
  let window = null, credentials = null, disposed = false, generation = 0, waiting = null, job = null, loginBlockedHost = "";
  const loginPopups=new Set();
  let displayName="", profileRequest=null, lastProfileAttempt=0, cookieConnected=false, capturedClientToken="";
  async function webAccountName() {
    for(let attempt=0;attempt<4;attempt++){
      const page=[window,...loginPopups].find(w=>w&&!w.isDestroyed()&&w.webContents.getURL?.().startsWith("https://open.spotify.com/"));
      if(!page||typeof page.webContents.executeJavaScript!=="function")return "";
      let timer;
      const name=await Promise.race([page.webContents.executeJavaScript(`(()=>{const p=document.querySelector('[data-testid="user-widget-link"]');if(!p)return '';return p.getAttribute('title')||p.getAttribute('aria-label')||p.textContent||'';})()`).catch(()=>""),new Promise(resolve=>{timer=setTimeout(()=>resolve(""),400);})]).finally(()=>clearTimeout(timer));
      const value=String(name).trim().slice(0,80);
      if(value.length>1&&!/^(profile|your profile|user profile|account|個人檔案|個人資料|プロフィール|프로필)$/i.test(value))return value;
      await new Promise(resolve=>setTimeout(resolve,250));
    }
    return "";
  }
  async function accountName() {
    if(displayName||!credentials)return displayName;
    if(!profileRequest&&Date.now()-lastProfileAttempt<60000)return "";
    if(!profileRequest){const revision=generation,auth=credentials.authorization;
      lastProfileAttempt=Date.now();
      profileRequest=(async()=>{let name="";try{
        try{const response=await session.fetch("https://api.spotify.com/v1/me",{headers:{Authorization:auth,...(credentials?.clientToken?{"Client-Token":credentials.clientToken}:{})},signal:AbortSignal.timeout(3000)});
          if(response.ok){const profile=await response.json();name=String(profile.display_name||profile.id||"").trim().slice(0,80);}
        }catch{ /* The web player can expose the display name without Web API scope. */ }
        if(!name)name=await webAccountName();
        if(!disposed&&revision===generation){displayName=name;return name;}return "";
      }finally{profileRequest=null;}})();
    }
    return profileRequest;
  }
  const cache = new Map(), resolved = new Map(), resolving = new Map();
  const state = () => ({ connected: Boolean(credentials||cookieConnected), signingIn: Boolean(waiting), busy: Boolean(job),loginBlockedHost });
  const notify = () => emit("spotify.state", state());
  session.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  session.setPermissionCheckHandler(() => false);
  const denyDownload = (_event, item) => item.cancel();
  session.on("will-download", denyDownload);
  async function retainSpotifyCookie(target,revision) {
    const cookies=await target.cookies.get({url:"https://open.spotify.com",name:"sp_dc"});
    if(!cookies.length||disposed||revision!==generation)return false;
    if(target!==session){const cookie=cookies[0];await session.cookies.set({url:"https://open.spotify.com",name:"sp_dc",value:cookie.value,domain:".spotify.com",path:"/",secure:true,httpOnly:true,...(Number.isFinite(cookie.expirationDate)?{expirationDate:cookie.expirationDate}:{}),sameSite:cookie.sameSite||"no_restriction"});await session.cookies.flushStore?.();}
    if(disposed||revision!==generation)return false;cookieConnected=true;return true;
  }
  async function acceptAuthentication(target,auth,client,expires) {
    const revision = generation;
    if(disposed||!/^Bearer [^\s]{20,8192}$/.test(auth||"")||!await retainSpotifyCookie(target,revision))return;
      credentials = { authorization: auth, clientToken: typeof client === "string" && client.length <= 8192 ? client : capturedClientToken, expires: Number.isFinite(expires)&&expires>Date.now()?Math.min(expires,Date.now()+3600000):Date.now()+45*60000 };
      void accountName().then(()=>notify()).catch(()=>{});
      if(disposed||revision!==generation)return;
      if (waiting) { const pending = waiting; waiting = null; pending.resolve(state()); }
      notify();
  }
  function captureSession(target,copySpotifySession=false){target.webRequest.onBeforeSendHeaders({ urls: ["https://api-partner.spotify.com/*"] }, (details, callback) => {
    const entries=Object.entries(details.requestHeaders),header=name=>entries.find(([key])=>key.toLowerCase()===name)?.[1];
    void acceptAuthentication(target,header("authorization"),header("client-token")).catch(()=>{if(copySpotifySession&&waiting){const pending=waiting;waiting=null;closeWindow();pending.reject(fault("SPOTIFY_SESSION_STORAGE_FAILED"));notify();}});
    callback({ requestHeaders: details.requestHeaders });
  });}
  function observeOfficialTokens(target,targetSession) {
    const debug=target.webContents.debugger;if(!debug||debug.isAttached?.())return;
    try{debug.attach("1.3");}catch{return;}
    const bodies=new Map();
    const onMessage=(_event,method,params)=>{
      if(method==="Network.responseReceived"&&params.response.status===200){
        try{const url=new URL(params.response.url);if(url.origin==="https://open.spotify.com"&&["/api/token","/get_access_token"].includes(url.pathname))bodies.set(params.requestId,"access");
          if(url.origin==="https://clienttoken.spotify.com"&&url.pathname==="/v1/clienttoken")bodies.set(params.requestId,"client");}catch{}
      }
      if(method!=="Network.loadingFinished"||!bodies.has(params.requestId))return;
      const kind=bodies.get(params.requestId);bodies.delete(params.requestId);
      void debug.sendCommand("Network.getResponseBody",{requestId:params.requestId}).then(async result=>{
        if(disposed||result.body.length>512000)return;
        const text=result.base64Encoded?Buffer.from(result.body,"base64").toString("utf8"):result.body,value=JSON.parse(text);
        if(kind==="client"){const token=value.granted_token?.token;if(typeof token==="string"&&token.length<=8192){capturedClientToken=token;if(credentials)credentials.clientToken=token;}return;}
        if(value.isAnonymous!==false)return;
        await acceptAuthentication(targetSession,`Bearer ${value.accessToken||""}`,capturedClientToken,Number(value.accessTokenExpirationTimestampMs));
      }).catch(()=>{});
    };
    debug.on("message",onMessage);void debug.sendCommand("Network.enable").catch(()=>{});
    const stop=()=>{bodies.clear();debug.removeListener("message",onMessage);try{debug.detach();}catch{}};
    target.once("closed",stop);return stop;
  }
  captureSession(session);
  function closeWindow() {for(const popup of loginPopups)if(!popup.isDestroyed())popup.destroy();loginPopups.clear();if (window && !window.isDestroyed()) window.destroy(); window = null; }
  function signIn(visible = true) {
    if (disposed) return Promise.reject(fault("SPOTIFY_CLOSED"));
    if (waiting) { if (visible) window?.show(); return waiting.promise; }
    if (visible && credentials) { closeWindow(); credentials = null;displayName=""; cache.clear(); generation++; }
    let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; });
    const pending = { promise, resolve, reject }; waiting = pending;loginBlockedHost="";
    // Match YouTube Music's fresh, sandboxed login session and native UA.
    // Only Spotify's own session cookie is retained; Google cookies stay temporary.
    const loginSession=visible?electron.session.fromPartition(`auralane-spotify-login-${crypto.randomUUID()}`,{cache:true}):session;
    loginSession.preconnect?.({url:"https://accounts.spotify.com",numSockets:2});
    if(visible){
      loginSession.setPermissionRequestHandler((contents,permission,callback,details)=>callback(loginStoragePermission(contents,permission,details)));
      loginSession.setPermissionCheckHandler((contents,permission,origin)=>loginStoragePermission(contents,permission,{requestingOrigin:origin}));
      loginSession.on("will-download",denyDownload);captureSession(loginSession,true);
    }
    let landingTimer = null;
    const timer = setTimeout(() => { if (waiting === pending) { waiting = null; closeWindow(); reject(fault(visible ? "SPOTIFY_LOGIN_TIMEOUT" : "SPOTIFY_SIGN_IN_REQUIRED")); notify(); } }, visible ? 5 * 60000 : timeout);
    promise.finally(() => { clearTimeout(timer); clearTimeout(landingTimer); }).catch(() => {});
    if(visible)promise.finally(()=>{loginSession.webRequest.onBeforeSendHeaders(null);loginSession.removeListener("will-download",denyDownload);void loginSession.clearStorageData().catch(()=>{});}).catch(()=>{});
    closeWindow();
    window = new electron.BrowserWindow({ width: 980, height: 760, show: visible, title: "Spotify", parent: parent?.(), autoHideMenuBar: true,
      webPreferences: { session:loginSession, nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true } });
    function reportBlocked(url){
      try{loginBlockedHost=new URL(url).hostname;}catch{loginBlockedHost="unsupported";}
      notify();
    }
    function guardLoginWindow(target){
      let stopTokens=null;
      target.webContents.on("did-start-navigation",(_event,url,_inPlace,main)=>{
        if(main===false)return;
        if(url.startsWith("https://open.spotify.com/")){if(!stopTokens)stopTokens=observeOfficialTokens(target,loginSession);}
        else {stopTokens?.();stopTokens=null;}
      });
      const completeCookieLogin=async()=>{
        if(!visible||waiting!==pending||!target.webContents.getURL?.().startsWith("https://open.spotify.com/"))return;
        if(await retainSpotifyCookie(loginSession,generation)&&waiting===pending){waiting=null;pending.resolve(state());notify();}
      };
      target.webContents.on("did-navigate",()=>{void completeCookieLogin().catch(()=>{});});
      target.webContents.on("did-finish-load",()=>{void completeCookieLogin().catch(()=>{});});
      // A navigation supersedes the previous load during OAuth. ERR_ABORTED
      // is not an authentication failure and must not destroy the opener.
      target.webContents.on("did-start-navigation",()=>clearTimeout(landingTimer));
      target.webContents.setWindowOpenHandler(({url})=>{
        const trustedBlank=url==="about:blank"&&allowedNavigation(target.webContents.getURL());
        if((!trustedBlank&&!allowedNavigation(url))||loginPopups.size>=4){reportBlocked(url);return {action:"deny"};}
        return {action:"allow",overrideBrowserWindowOptions:{parent:parent?.(),show:visible,width:980,height:760,autoHideMenuBar:true,webPreferences:{session:loginSession,nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}}};
      });
      target.webContents.on("did-create-window",popup=>{
        loginPopups.add(popup);popup.on("closed",()=>loginPopups.delete(popup));guardLoginWindow(popup);
      });
      for(const eventName of ["will-navigate","will-redirect"])target.webContents.on(eventName,(event,url)=>{
        if(!url.startsWith("https://open.spotify.com/")){stopTokens?.();stopTokens=null;}
        if(!allowedNavigation(url)){event.preventDefault();reportBlocked(url);}
      });
    }
    guardLoginWindow(window);
    window.webContents.on("did-finish-load", () => {
      clearTimeout(landingTimer);
      if (!window?.webContents.getURL?.().startsWith("https://open.spotify.com/")) return;
      landingTimer = setTimeout(() => {
        if (waiting !== pending) return;
        waiting = null; closeWindow(); reject(fault("SPOTIFY_PLAYER_UNAVAILABLE")); notify();
      }, timeout);
    });
    window.on("closed", () => {
      const child=[...loginPopups].find(popup=>!popup.isDestroyed());
      if(waiting===pending&&child){window=child;child.show?.();child.once("closed",()=>{if(waiting===pending){waiting=null;window=null;reject(fault("SPOTIFY_LOGIN_CANCELLED"));notify();}});return;}
      window = null; if (waiting === pending) { waiting = null; reject(fault("SPOTIFY_LOGIN_CANCELLED")); notify(); }
    });
    const destination = visible ? "https://accounts.spotify.com/login?continue=" + encodeURIComponent("https://open.spotify.com/collection/playlists") : "https://open.spotify.com/collection/playlists";
    void window.loadURL(destination).catch(error => {
      if(error?.code==="ERR_ABORTED" || error?.errno===-3)return;
      if (waiting === pending) { waiting = null; closeWindow(); reject(fault("SPOTIFY_NETWORK")); notify(); }
    });
    // Leave the official page alive only long enough to establish the session.
    promise.then(() => closeWindow(), () => {}); notify(); return promise;
  }
  async function auth() {
    if (disposed) throw fault("SPOTIFY_CLOSED");
    if (credentials && credentials.expires > Date.now()) return credentials;
    const cookies = await session.cookies.get({ url: "https://open.spotify.com", name: "sp_dc" });
    if (!cookies.length) throw fault("SPOTIFY_SIGN_IN_REQUIRED");
    await signIn(false); return credentials;
  }
  async function query(operation, vars, retried = false) {
    const token = await auth(), revision = generation;
    const response = await session.fetch(ENDPOINT, { method: "POST", redirect: "error", signal: AbortSignal.timeout(12000),
      headers: { "Content-Type": "application/json", Authorization: token.authorization, ...(token.clientToken ? { "Client-Token": token.clientToken } : {}), "app-platform": "WebPlayer", Origin: "https://open.spotify.com", Referer: "https://open.spotify.com/" },
      body: JSON.stringify({ operationName: operation, variables: vars, extensions: { persistedQuery: { version: 1, sha256Hash: OPERATIONS[operation] } } }) });
    if (disposed || revision !== generation) throw fault("SPOTIFY_CLOSED");
    if (response.status === 401) { credentials = null; notify(); if (!retried) return query(operation, vars, true); throw fault("SPOTIFY_SIGN_IN_REQUIRED"); }
    if (response.status === 429) throw fault("SPOTIFY_RATE_LIMITED");
    if (!response.ok) throw fault("SPOTIFY_NETWORK");
    const chunks = []; let bytes = 0;
    for await (const chunk of response.body) { bytes += chunk.length; if (bytes > 8 * 1024 * 1024) throw fault("SPOTIFY_RESPONSE_TOO_LARGE"); chunks.push(Buffer.from(chunk)); }
    const text = Buffer.concat(chunks).toString("utf8");
    let root; try { root = JSON.parse(text); } catch { throw fault("SPOTIFY_API_CHANGED"); }
    return root;
  }
  async function page(id, offset) {
    if (id !== "library" && id !== "liked" && !/^[A-Za-z0-9]{22}$/.test(id)) throw fault("INVALID_REQUEST");
    if (!Number.isInteger(offset) || offset < 0 || offset > 1000000) throw fault("INVALID_REQUEST");
    const operation = id === "library" ? "libraryV3" : id === "liked" ? "fetchLibraryTracks" : "fetchPlaylist";
    const root = await query(operation, variables(operation, id, offset));
    const result = parsePage(operation, root);
    // Cache only source metadata actually returned by Spotify, never caller-supplied search text.
    if (id !== "library") for (const source of result.items) { cache.set(source.id, source); if (cache.size > 10000) cache.delete(cache.keys().next().value); }
    return { ...result, image: operation === "fetchPlaylist" ? image(root.data?.playlistV2?.images) : "", next: result.rawCount && (result.total === null ? result.rawCount === (id === "library" ? 50 : 100) : offset + result.rawCount < result.total) ? offset + result.rawCount : null };
  }
  async function match(ids, onProgress = () => {}) {
    if (job) throw fault("SPOTIFY_BUSY");
    if (!Array.isArray(ids) || !ids.length || ids.length > 10000 || ids.some(id => typeof id !== "string" || !cache.has(id))) throw fault("INVALID_REQUEST");
    const sources = ids.map(id => cache.get(id)), revision = generation;
    const active = { cancelled: false }; job = active; const matched = [], unmatched = [];
    const check = () => { if (disposed || active.cancelled || revision !== generation) throw fault("SPOTIFY_CANCELLED"); };
    try {
      for (let i = 0; i < sources.length; i++) {
        check(); const source = sources[i]; let track = null;
        try { const result = await youtube.search(`${source.artists.map(a => a.name).join(" ")} ${source.name}`, "songs"); check(); track = matchTrack(source, Array.isArray(result) ? result : result.tracks || []); }
        catch (error) { check(); if (error.code === "SPOTIFY_CANCELLED") throw error; }
        if (track) matched.push({ index: i, track: { ...track, id: track.videoId || track.id }, source });
        else unmatched.push({ index: i, source });
        onProgress({ completed: i + 1, total: sources.length, matched: matched.length });
      }
      return { matched, unmatched };
    } finally { if (job === active) job = null; }
  }
  async function resolve(id, fallback) {
    if (disposed) throw fault("SPOTIFY_CLOSED");
    if (!/^[A-Za-z0-9]{22}$/.test(id)) throw fault("INVALID_REQUEST");
    if (resolved.has(id)) return resolved.get(id);
    if (resolving.has(id)) return resolving.get(id);
    const source = cache.get(id) || fallback;
    if (!source || source.id !== id || typeof source.name !== "string" || !source.name.trim() || source.name.length > 512 || !Array.isArray(source.artists) || source.artists.length > 12 || source.artists.some(a => typeof a.name !== "string" || a.name.length > 128) || !Number.isFinite(source.duration_ms) || source.duration_ms < 0 || source.duration_ms > 86400000) throw fault("INVALID_REQUEST");
    const revision = generation;
    const task = (async () => {
      let timer;
      try {
        const result = await Promise.race([youtube.search(`${source.name} ${source.artists.map(a=>a.name).join(" ")}`, "songs"), new Promise((_,reject)=>{timer=setTimeout(()=>reject(fault("SPOTIFY_NETWORK")),12000);})]);
        if (disposed || revision !== generation) throw fault("SPOTIFY_CLOSED");
        const candidates = (Array.isArray(result) ? result : result.tracks || []).filter(c => matchTrack(source,[c]));
        const duration = c => Number(c.durationSeconds || c.lengthSeconds || (typeof c.duration === "number" ? c.duration : String(c.duration || "").split(":").reduce((n,p)=>n*60+Number(p),0)));
        candidates.sort((a,b)=>Math.abs(duration(a)-source.duration_ms/1000)-Math.abs(duration(b)-source.duration_ms/1000));
        const selected = candidates[0]; if (!selected) throw fault("SPOTIFY_NO_MATCH");
        const track = {...selected,id:selected.videoId||selected.id,videoId:selected.videoId||selected.id,title:source.name,artist:source.artists.map(a=>a.name).join(", "),thumbnail:source.image||selected.thumbnail,spotifyOrigin:id};
        resolved.set(id,track); if(resolved.size>1000)resolved.delete(resolved.keys().next().value); return track;
      } finally { clearTimeout(timer); if(resolving.get(id)===task)resolving.delete(id); }
    })();
    resolving.set(id,task); return task;
  }
  function cancel() { if (job) job.cancelled = true; if (waiting) { const pending = waiting; waiting = null; closeWindow(); pending.reject(fault("SPOTIFY_LOGIN_CANCELLED")); notify(); } }
  function dispose() { disposed = true; generation++; if (waiting) { waiting.reject(fault("SPOTIFY_CLOSED")); waiting = null; } cancel(); credentials = null; cache.clear(); resolved.clear(); resolving.clear(); closeWindow(); session.webRequest.onBeforeSendHeaders(null); session.removeListener("will-download", denyDownload); }
  return {
    state, signIn, page, match, resolve, cancel,
    async status() { const cookies = await session.cookies.get({ url: "https://open.spotify.com", name: "sp_dc" });return { ...state(), connected: Boolean(credentials || cookies.length),displayName:await accountName() }; },
    async disconnect() { generation++; cancel(); credentials = null;cookieConnected=false;displayName=""; cache.clear(); resolved.clear(); resolving.clear(); if (waiting) { waiting.reject(fault("SPOTIFY_LOGIN_CANCELLED")); waiting = null; } closeWindow(); await session.clearStorageData(); await session.clearCache(); notify(); return state(); },
    dispose
  };
}
module.exports = { createSpotifyLibrary, parsePage, variables, allowedNavigation };
