"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const { createSpotifyLibrary, parsePage, variables, allowedNavigation } = require("../src/main/spotifyLibrary");
const id = "1234567890123456789012";
const track = { name: "Counting Stars", uri: `spotify:track:${id}`, artists: { items: [{ profile: { name: "OneRepublic" } }] }, duration: { totalMilliseconds: 257000 }, albumOfTrack: { name: "Native", coverArt: { sources: [{ width: 64, url: "https://i.scdn.co/small" }, { width: 640, url: "https://i.scdn.co/large" }] } } };
function fixture(search,loadError,timeout=50) {
  const windows = [], requests = [], partitions = [], agents = [], sessions = [], copied=[]; let response = null;
  function makeSession(){
  const session = new EventEmitter();session._cookie=false;
  Object.assign(session, {
    getUserAgent: () => "Mozilla/5.0 Auralane/1.0.5 Chrome/152.0.0.0 Electron/44.4.3 Safari/537.36",
    setUserAgent: agent => agents.push(agent),
    setPermissionRequestHandler(fn) { session._permissionRequest=fn; }, setPermissionCheckHandler(fn) { session._permissionCheck=fn; },
    cookies: { get: async () => session._cookie ? [{ name: "sp_dc", value: "never-return-this" }] : [],set:async value=>{copied.push(value);session._cookie=true;} },
    webRequest: { onBeforeSendHeaders(filter, fn) { session._hook = fn || null; } },
    clearStorageData: async () => { session._cookie = false; }, clearCache: async () => {},
    fetch: async (url, options) => { if(url==='https://api.spotify.com/v1/me')return new Response(JSON.stringify({display_name:'Actual listener',id:'listener'}));requests.push({ url, options }); return response; }
  });sessions.push(session);return session;}
  class Window extends EventEmitter {
    constructor(options) { super(); this.options = options; this.webContents = new EventEmitter();this.webContents.getURL=()=>this.url||"about:blank"; this.webContents.setWindowOpenHandler = fn => { this.popup = fn; }; windows.push(this); }
    loadURL(url) { this.url = url; return loadError?Promise.reject(loadError):Promise.resolve(); }
    show() {} isDestroyed() { return this.dead; }
    destroy() { this.dead = true; this.emit("closed"); }
  }
  const lib = createSpotifyLibrary({ account: "profile1", electron: { session: { fromPartition: p => { partitions.push(p); return makeSession(); } }, BrowserWindow: Window }, youtube: { search: search || (async () => [{ videoId: "abcdefghijk", title: "Counting Stars", artist: "OneRepublic", duration: "4:17" }]) }, timeout });
  return { lib, windows, requests, partitions, agents, sessions, copied, Window,
    cookie: value => { (windows.at(-1)?.options.webPreferences.session||sessions[0])._cookie=value; }, response: value => { response = value; },
    capture: async () => { (windows.at(-1)?.options.webPreferences.session||sessions[0])._hook?.({ requestHeaders: { Authorization: "Bearer a-real-browser-token-with-enough-length", "Client-Token": "browser-client" } }, () => {}); await new Promise(r => setImmediate(r)); }
  };
}
test("Spotify parser keeps playlist identity, best actual cover and raw pagination counts", () => {
  const result = parsePage("libraryV3", { data: { me: { libraryV3: { totalCount: 3, items: [{ item: { _uri: `spotify:playlist:${id}`, data: { __typename: "Playlist", name: "My music", ownerV2: { data: { name: "Owner" } }, images: { items: [{ sources: [{ width: 640, url: "https://i.scdn.co/full" }, { width: 64, url: "https://i.scdn.co/tiny" }] }] } } } }, { item: { data: { __typename: "Folder" } } }] } } } });
  assert.equal(result.rawCount, 2); assert.equal(result.total, 3); assert.equal(result.items.length, 1); assert.equal(result.items[0].image, "https://i.scdn.co/full");
  assert.throws(() => parsePage("libraryV3", { errors: [{ message: "PersistedQueryNotFound" }] }), { code: "SPOTIFY_API_CHANGED" });
  assert.throws(() => parsePage("libraryV3", {}), { code: "SPOTIFY_API_CHANGED" });
});

test('official cookie landing completes login without waiting for the DRM player; token responses renew metadata auth',async()=>{
  const f=fixture(undefined,undefined,2000);
  try{
    const login=f.lib.signIn(),visible=f.windows.at(-1);f.cookie(true);visible.url='https://open.spotify.com/';visible.webContents.emit('did-navigate');
    assert.equal((await login).connected,true);assert.equal(visible.dead,true);assert.equal(f.requests.length,0);
    f.response(Response.json({data:{me:{libraryV3:{items:[],totalCount:0}}}}));
    const page=f.lib.page('library',0);await new Promise(r=>setImmediate(r));const hidden=f.windows.at(-1),debug=new EventEmitter();let attached=false;
    Object.assign(debug,{bodies:new Map(),isAttached:()=>attached,attach:()=>{attached=true;},detach:()=>{attached=false;},sendCommand:async(method,p)=>method==='Network.getResponseBody'?{body:debug.bodies.get(p.requestId)}:{}});hidden.webContents.debugger=debug;
    hidden.webContents.emit('did-start-navigation',{},'https://accounts.google.com/',false,true);assert.equal(attached,false);
    hidden.webContents.emit('did-start-navigation',{},'https://open.spotify.com/',false,true);assert.equal(attached,true);
    const emitToken=(id,anonymous)=>{debug.bodies.set(id,JSON.stringify({accessToken:'an-official-browser-token-long-enough',isAnonymous:anonymous,accessTokenExpirationTimestampMs:Date.now()+600000}));debug.emit('message',{},'Network.responseReceived',{requestId:id,response:{status:200,url:'https://open.spotify.com/api/token'}});debug.emit('message',{},'Network.loadingFinished',{requestId:id});};
    emitToken('anonymous',true);await new Promise(r=>setImmediate(r));assert.equal(f.requests.length,0);
    emitToken('signed-in',false);assert.equal((await page).items.length,0);assert.equal(f.requests.length,1);
    assert.equal(JSON.stringify(await f.lib.status()).includes('an-official-browser-token'),false);
  }finally{f.lib.dispose();}
});
test("Spotify playlist and liked parsers preserve real song metadata and reject episodes", () => {
  const playlist = parsePage("fetchPlaylist", { data: { playlistV2: { content: { totalCount: 2, items: [{ itemV2: { data: track } }, { itemV2: { data: { name: "Podcast", uri: `spotify:episode:${id}` } } }] } } } });
  assert.equal(playlist.rawCount, 2); assert.equal(playlist.items[0].duration_ms, 257000); assert.equal(playlist.items[0].image, "https://i.scdn.co/large");
  const liked = parsePage("fetchLibraryTracks", { data: { me: { library: { tracks: { items: [{ track: { _uri: track.uri, data: { ...track, uri: undefined } } }] } } } } });
  assert.equal(liked.items[0].id, id); assert.equal(variables("fetchPlaylist", id, 100).offset, 100);
});
test("login is sandboxed, anonymous bearer is ignored, credentials never leave main", async () => {
  const f = fixture();
  try {
    assert.equal((await f.lib.status()).connected, false);
    const promise = f.lib.signIn(); await f.capture(); assert.equal(f.lib.state().connected, false);
    const w = f.windows[0]; assert.equal(w.options.webPreferences.nodeIntegration, false); assert.equal(w.options.webPreferences.sandbox, true); assert.equal(w.options.webPreferences.contextIsolation, true); assert.equal(w.options.webPreferences.preload, undefined);
    assert.equal(new URL(w.url).origin, "https://accounts.spotify.com");
    assert.equal(f.agents.length,0,"login must retain the native UA, like YouTube Music");
    assert.notEqual(w.options.webPreferences.session,f.sessions[0]);assert.match(f.partitions[1],/^auralane-spotify-login-/);
    assert.match(f.partitions[0], /^persist:auralane-spotify-[0-9a-f]{24}$/);
    f.cookie(true); await f.capture(); const status = await promise; assert.equal(status.connected, true); assert.equal(JSON.stringify(status).includes("Bearer"), false); assert.equal(w.dead, true);
    assert.equal(f.copied.length,1);assert.equal(f.copied[0].name,"sp_dc");assert.equal(f.copied[0].url,"https://open.spotify.com");assert.equal(f.sessions[1]._cookie,false);
    assert.equal((await f.lib.status()).displayName,'Actual listener');
    assert.equal(w.popup({ url: "file:///C:/secrets" }).action, "deny");
    assert.equal(allowedNavigation("https://open.spotify.com/collection/playlists"), true);
    assert.equal(allowedNavigation("https://www.google.com/accounts/SetSID"), true);
    assert.equal(allowedNavigation("https://accounts.google.com.tw/accounts/SetSID"), true);
    for(const domain of require('../src/config/google-login-domains.json').domains.split(' ')){
      assert.equal(allowedNavigation(`https://accounts.${domain}/accounts/SetSID`),true,domain);
      assert.equal(allowedNavigation(`https://accounts.${domain}.evil.test/`),false,domain);
    }
    assert.equal(allowedNavigation("https://accounts.google.com.tw.evil.test/accounts/SetSID"), false);
    assert.equal(allowedNavigation("https://evilgoogle.com.tw/accounts/SetSID"), false);
    assert.equal(allowedNavigation("https://accounts.spotify.com.evil.test/login"), false);
    assert.equal(allowedNavigation("https://evilgoogle.com/login"), false);
    const login=f.sessions[1],contents={getURL:()=>"https://accounts.google.com/signin"};
    assert.equal(login._permissionCheck(contents,'storage-access','https://accounts.spotify.com'),true);
    assert.equal(login._permissionCheck(contents,'storage-access','https://evil.test'),false);
    assert.equal(login._permissionCheck(contents,'media','https://accounts.google.com'),false);
    for (const url of ["http://open.spotify.com", "https://open.spotify.com.evil.test", "javascript:alert(1)", "file:///x", "https://user:pass@open.spotify.com", "https://open.spotify.com:444"]) assert.equal(allowedNavigation(url), false);
    await f.lib.disconnect(); assert.equal((await f.lib.status()).connected, false);
  } finally { f.lib.dispose(); }
});
test("paged metadata can match only fetched IDs, handles unknown API/rate limit and disconnect", async () => {
  const f = fixture();
  try {
    const login = f.lib.signIn(); f.cookie(true); await f.capture(); await login;
    f.response(new Response(JSON.stringify({ data: { playlistV2: { content: { totalCount: 102, items: [{ itemV2: { data: track } }] } } } })));
    const page = await f.lib.page(id, 100); assert.equal(page.next, 101);
    assert.equal(f.requests[0].url, "https://api-partner.spotify.com/pathfinder/v2/query");
    assert.equal(JSON.parse(f.requests[0].options.body).variables.offset, 100);
    await assert.rejects(f.lib.match(["not-fetched"]), { code: "INVALID_REQUEST" });
    const result = await f.lib.match([id]); assert.equal(result.matched[0].track.id, "abcdefghijk"); assert.equal(result.unmatched.length, 0);
    f.response(new Response("", { status: 429 })); await assert.rejects(f.lib.page("library", 0), { code: "SPOTIFY_RATE_LIMITED" });
    await f.lib.disconnect(); await assert.rejects(f.lib.match([id]), { code: "INVALID_REQUEST" });
    await assert.rejects(f.lib.page("https://evil.test", 0), { code: "INVALID_REQUEST" });
  } finally { f.lib.dispose(); }
});
test("closing login and disposing pending login settle promises without hanging", async () => {
  const f = fixture(); const login = f.lib.signIn(); f.windows[0].destroy(); await assert.rejects(login, { code: "SPOTIFY_LOGIN_CANCELLED" });
  const again = f.lib.signIn(); f.lib.dispose(); await assert.rejects(again, { code: "SPOTIFY_CLOSED" });
});

test("an OAuth-superseded initial navigation does not close sign-in or reject the login",async()=>{
  const f=fixture(undefined,Object.assign(new Error("Navigation superseded"),{code:"ERR_ABORTED",errno:-3}));
  try{const pending=f.lib.signIn();await new Promise(r=>setImmediate(r));assert.equal(f.windows[0].dead,undefined);assert.equal(f.lib.state().signingIn,true);f.cookie(true);await f.capture();assert.equal((await pending).connected,true);}finally{f.lib.dispose();}
});

test("Google OAuth retains its popup and opener while official completion redirects remain allowed",async()=>{
  const f=fixture();
  try{
    const pending=f.lib.signIn(),parent=f.windows[0],original=parent.url;
    const options=parent.popup({url:"https://accounts.google.com/o/oauth2/auth?state=private-state"});
    assert.equal(options.action,"allow");assert.equal(parent.url,original);
    assert.equal(parent.popup({url:"about:blank"}).action,"allow");
    assert.equal(options.overrideBrowserWindowOptions.webPreferences.session,parent.options.webPreferences.session);
    assert.equal(options.overrideBrowserWindowOptions.webPreferences.nodeIntegration,false);
    assert.equal(options.overrideBrowserWindowOptions.webPreferences.sandbox,true);
    const popup=new f.Window(options.overrideBrowserWindowOptions);
    parent.webContents.emit("did-create-window",popup);
    let blocked=false;
    popup.webContents.emit("will-redirect",{preventDefault(){blocked=true;}},"https://accounts.youtube.com/accounts/SetSID?token=private-token");
    assert.equal(blocked,false);
    popup.webContents.emit("will-navigate",{preventDefault(){blocked=true;}},"https://unsafe.test/?token=private-token");
    assert.equal(blocked,true);assert.equal(f.lib.state().loginBlockedHost,"unsafe.test");
    assert.equal(JSON.stringify(f.lib.state()).includes("private-token"),false);
    f.cookie(true);await f.capture();await pending;
    assert.equal(parent.dead,true);assert.equal(popup.dead,true);
  }finally{f.lib.dispose();}
});

test("lazy Spotify resolution deduplicates one requested song and rejects unrelated results", async () => {
  let calls = 0;
  const f = fixture(async () => { calls++; await new Promise(r=>setTimeout(r,5)); return [
    {videoId:"wrongartist",title:"Counting Stars",artist:"Someone Else",duration:"4:17"},
    {videoId:"abcdefghijk",title:"Counting Stars",artist:"OneRepublic",duration:"4:17"}
  ]; });
  const source={id,name:"Counting Stars",artists:[{name:"OneRepublic"}],duration_ms:257000,image:"https://i.scdn.co/original"};
  try {
    const [a,b]=await Promise.all([f.lib.resolve(id,source),f.lib.resolve(id,source)]);
    assert.equal(calls,1);assert.equal(a.id,"abcdefghijk");assert.deepEqual(a,b);assert.equal(a.thumbnail,source.image);
    await f.lib.resolve(id,source);assert.equal(calls,1);
    await f.lib.disconnect();await f.lib.resolve(id,source);assert.equal(calls,2);
    await assert.rejects(f.lib.resolve("invalid",source),{code:"INVALID_REQUEST"});
    const other={...source,id:"abcdefghijklmnopqrstuv",name:"Not this song"};
    await assert.rejects(f.lib.resolve(other.id,other),{code:"SPOTIFY_NO_MATCH"});
  } finally {f.lib.dispose();}
});
test("Spotify browser page paginates, imports in order, protects account changes and fits five languages", async () => {
  const { chromium } = require("playwright-core"), path = require("node:path");
  const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } }); const errors = []; page.on("pageerror", e => errors.push(e.message));
    await page.setContent('<section id="spotifyView" class="workspace-spotify"></section>');
    await page.addStyleTag({ path: path.join(__dirname, "../src/renderer/styles.css") });
    await page.addStyleTag({ path: path.join(__dirname, "../src/renderer/musicWorkspace.css") });
    await page.addScriptTag({ path: path.join(__dirname, "../src/renderer/spotifyLibrary.js") });
    await page.evaluate(() => {
      window.owner = "a"; window.connected = false; window.saved = null; window.played = null; window.calls = [];
      window.state = { activeView: "spotify", settings: { language: "en" } };
      window.metro = { featureRequest: async ({ type, payload }) => {
        calls.push({ type, payload }); let value = {};
        if (type === "spotify.status") value = { connected };
        if (type === "spotify.login") { connected = true; value = { connected: true }; }
        if (type === "spotify.disconnect") { connected = false; value = { connected: false }; }
        if (type === "spotify.page") {
          const library = payload.id === "library", count = library ? 1 : payload.offset === 0 ? 100 : 2;
          value = { items: Array.from({ length: count }, (_, i) => library ? { id: "1234567890123456789012", name: "Native", owner: "OneRepublic", image: "" } : { id: String(i + payload.offset), name: `Song ${i + payload.offset}`, artists: [{ name: "OneRepublic" }], image: "" }), total: library ? 1 : 102, next: library || payload.offset > 0 ? null : 100 };
        }
        if (type === "spotify.match") value = { matched: payload.ids.map((id, index) => ({ index, track: { id, title: `Song ${id}` } })), unmatched: [] };
        return { ok: true, value };
      }, onFeatureEvent: () => () => {} };
      window.spotify = AuralaneSpotify.init({ state, getAccountId: () => owner, icon: () => '<svg viewBox="0 0 24 24"><path d="M4 12h16"/></svg>', setIconButton: (b, icon, name) => { b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 12h16"/></svg>'; b.setAttribute("aria-label", name); }, playTracks: tracks => { played = tracks; }, savePlaylist: (name, tracks) => { saved = { name, tracks }; } });
    });
    await page.getByRole("button", { name: "Sign in to Spotify", exact: true }).click();
    await page.getByRole("button", { name: "Native OneRepublic", exact: true }).click();
    await page.waitForFunction(() => document.querySelectorAll(".workspace-song-list li").length === 100);
    await page.getByRole("button", { name: "Save as playlist", exact: true }).click();
    await page.waitForFunction(() => Boolean(saved));
    assert.equal(await page.evaluate(() => saved.tracks.length), 102);
    assert.equal(await page.evaluate(() => saved.tracks[101].id), "spotify-101");
    assert.equal(await page.evaluate(() => saved.tracks[101].spotifySource.id), "101");
    assert.equal(await page.evaluate(() => calls.filter(c=>c.type==="spotify.match").length),0);
    assert.equal(await page.locator(".workspace-song-list li").count(), 100);
    await page.getByRole("button", { name: "Show more", exact: true }).click();
    assert.equal(await page.locator(".workspace-song-list li").count(), 102);
    for (const language of ["en", "zh-TW", "zh-CN", "ja", "ko"]) for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 }); await page.evaluate(language => { state.settings.language = language; spotify.refresh(); }, language);
      const fit = await page.locator("#spotifyView").evaluate(el => ({ okay: el.scrollWidth <= el.clientWidth + 1, bad: [...el.querySelectorAll("*")].filter(n => n.scrollWidth > n.clientWidth + 1).map(n => `${n.className}:${n.clientWidth}/${n.scrollWidth}`) }));
      assert.equal(fit.okay, true, `${language} ${width} ${fit.bad.join(",")}`);
    }
    await page.evaluate(() => { owner = "b"; connected = false; spotify.refresh(); });
    await page.waitForFunction(() => !document.querySelectorAll(".workspace-song-list li").length);
    assert.equal(await page.getByText("Native", { exact: true }).count(), 0);
    await page.evaluate(()=>{
      spotify.destroy();connected=true;state.activeView="spotify";window.collection=null;
      window.spotify=AuralaneSpotify.init({state,getAccountId:()=>owner,icon:()=>"",setIconButton:(button,icon,label)=>button.setAttribute("aria-label",label),openCollection:(playlist,tracks,next,total)=>{window.collection={playlist,tracks,next,total};state.activeView="collection";},playTracks:()=>{throw new Error("Unexpected eager playback");},savePlaylist:()=>{}});
    });
    await page.getByRole("button",{name:"Native OneRepublic",exact:true}).click();
    await page.waitForFunction(()=>Boolean(window.collection));
    assert.equal(await page.evaluate(()=>collection.tracks.length),100);
    assert.equal(await page.evaluate(()=>collection.next),100);
    assert.equal(await page.evaluate(()=>collection.total),102);
    assert.equal(await page.evaluate(()=>collection.tracks.every(t=>t.spotifySource&&!t.videoId)),true);
    await page.evaluate(()=>{state.queue=[{id:"abcdefghijk",spotifyOrigin:collection.tracks[0].spotifySource.id,title:"Resolved song"}];});
    await page.evaluate(()=>spotify.loadMore());
    assert.equal(await page.evaluate(()=>collection.tracks.length),102);
    assert.equal(await page.evaluate(()=>collection.tracks[0].id),"abcdefghijk");
    assert.equal(await page.evaluate(()=>calls.filter(c=>c.type==="spotify.match").length),0);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
