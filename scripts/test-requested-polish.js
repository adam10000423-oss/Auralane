"use strict";
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),app=fs.readFileSync(path.join(root,'src/renderer/app.js'),'utf8');
function declaration(name,source=app){const start=source.search(new RegExp(`(?:async )?function ${name}\\(`));assert.ok(start>=0,name);const tail=source.slice(start),end=tail.slice(1).search(/\n(?:async )?function /);return tail.slice(0,end<0?undefined:end+1);}
test('localized featuring labels are removed only from query identity, not real non-English titles',()=>{
  const scope={};vm.createContext(scope);vm.runInContext(declaration('cleanLyricsIdentityTitle'),scope);
  for(const name of ['Let Me Love You (合作演出：Justin Bieber)','Let Me Love You (feat. Justin Bieber)','Let Me Love You（合作演出：Justin Bieber）'])assert.equal(scope.cleanLyricsIdentityTitle(name),'Let Me Love You');
  for(const name of ['夜に駆ける','告白氣球','晴天 (Live)','Without You (Remix)'])assert.equal(scope.cleanLyricsIdentityTitle(name),name);
});
test('collection menus never show track-only artist, album, version, download or next actions',()=>{
  const names=['play','queue','radio','share','play-next','artist','album','playlist','versions','cache-offline','follow','unfollow','remove-queue','remove-history','remove-playlist','details'];
  function button(action){return {dataset:{moreAction:action},classList:{values:new Set(),toggle(name,on){if(on)this.values.add(name);else this.values.delete(name);}},disabled:false};}
  const buttons=names.map(button),menu={querySelectorAll:()=>buttons,classList:{contains:()=>false,remove:()=>{}},style:{},offsetWidth:200,offsetHeight:300};
  const scope={state:{activeSidePanel:'queue',settings:{},offlineCachePending:new Set()},els:{moreMenu:menu},window:{innerWidth:1000,innerHeight:800},trackIsLiked:()=>false,primaryArtistFromItem:()=>({title:'Misleading collection subtitle'}),albumFromItem:()=>null,isOfflineCached:()=>false,downloadFailure:()=>null,artistChannelId:()=>'',isPlaylistCollection:()=>false,activeCollectionPlaylistId:()=>'',setMoreActionLabel:()=>{},checkMoreFollowState:()=>{}};
  vm.createContext(scope);for(const name of ['isTrackItem','isPodcastItem','isPlayableBrowseItem','showMoreMenu'])vm.runInContext(declaration(name),scope);
  for(const item of [{id:'LM',browseId:'LM',type:'playlist'},{id:'saved',type:'playlist'},{id:'album',browseId:'MPREb',type:'album'}]){
    scope.showMoreMenu(item,{right:400,top:20});
    for(const action of ['play-next','album','playlist','versions','cache-offline','details'])assert.ok(buttons.find(b=>b.dataset.moreAction===action).classList.values.has('hidden'),`${item.type}: ${action}`);
    if(item.type==='playlist')assert.ok(buttons.find(b=>b.dataset.moreAction==='artist').classList.values.has('hidden'));
  }
  assert.equal(scope.isTrackItem({id:'song',type:'track'}),true);
});
test('follow menu waits for verified state, switches its action and ignores a stale account or menu',async()=>{
  const buttons=['follow','unfollow'].map(action=>({dataset:{moreAction:action},classList:{toggle(name,on){this.hidden=on;}},disabled:false}));
  const item={id:'song',type:'track'};let resolve;const scope={state:{moreItem:item},els:{moreMenu:{querySelectorAll:()=>buttons}},account:'one',accountStorageId:()=>scope.account,artistChannelId:a=>a?.channelId,isTrackItem:()=>true,resolveArtistForMutation:()=>new Promise(r=>{resolve=r;})};
  vm.createContext(scope);for(const name of ['renderMoreFollowState','checkMoreFollowState'])vm.runInContext(declaration(name),scope);
  const pending=scope.checkMoreFollowState(item);assert.ok(buttons.every(b=>b.classList.hidden));resolve({channelId:'UCone',subscribed:true});await pending;assert.equal(buttons[0].classList.hidden,true);assert.equal(buttons[1].classList.hidden,false);
  scope.renderMoreFollowState({channelId:'UCone',subscribed:false});assert.equal(buttons[0].classList.hidden,false);assert.equal(buttons[1].classList.hidden,true);
  const stale=scope.checkMoreFollowState(item);scope.account='two';resolve({channelId:'UCone',subscribed:true});await stale;assert.ok(buttons.every(b=>b.classList.hidden));
});
test('promoting a recommendation keeps one contiguous recommendation tail without mutating original items',async()=>{
  const recommendation={id:'r1',autoplay:true},state={queue:[{id:'a'},{id:'b'},recommendation,{id:'r2',autoplay:true}]};
  const scope={state,queueMutationBlocked:()=>false,setQueue:async items=>{state.queue=items;},toast:()=>{}};vm.createContext(scope);vm.runInContext(declaration('reorderQueueItem'),scope);
  await scope.reorderQueueItem(2,1);assert.deepEqual(Array.from(state.queue,v=>v.id),['a','r1','b','r2']);assert.equal(state.queue[1].autoplay,false);assert.equal(recommendation.autoplay,true);
  await scope.reorderQueueItem(0,4);assert.deepEqual(Array.from(state.queue,v=>v.id),['r1','b','a','r2']);
});
test('durable volume is bounded and lyric loading cannot reset the queue scroller',()=>{
  const {normalize}=require('../src/main/workspacePreferences');for(const [value,want]of [[.23,.23],[2,1],[-1,0]])assert.equal(normalize({volume:value}).volume,want);assert.equal(normalize({volume:NaN}).volume,undefined);
  assert.match(app,/if \(state\.activeSidePanel === "lyrics"\) els\.rightPanel\.scrollTop=0/);
  assert.doesNotMatch(declaration('loadCollection'),/skeletonHtml\("hero"\)/);
});
test('floating lyric audio clock freezes during buffering, caps lost heartbeats and resumes on fresh anchors',()=>{
  const scope={state:{playing:true},els:{audio:{paused:false,ended:false,seeking:false,readyState:4}},lyricAudioWaiting:false};vm.createContext(scope);vm.runInContext(declaration('lyricWidgetIsPlaying'),scope);
  assert.equal(scope.lyricWidgetIsPlaying(),true);scope.lyricAudioWaiting=true;assert.equal(scope.lyricWidgetIsPlaying(),false);scope.lyricAudioWaiting=false;scope.els.audio.readyState=2;assert.equal(scope.lyricWidgetIsPlaying(),false);
  const widget=fs.readFileSync(path.join(root,'src/renderer/lyrics.js'),'utf8'),clock={timelineAnchor:10,timelineAnchorAt:0,timelineRate:1,timelinePlaying:true,performance:{now:()=>9000}};vm.createContext(clock);vm.runInContext(declaration('timelineNow',widget),clock);assert.equal(clock.timelineNow(),12);clock.timelinePlaying=false;assert.equal(clock.timelineNow(),10);clock.timelinePlaying=true;clock.timelineAnchor=30;clock.timelineAnchorAt=8500;assert.equal(clock.timelineNow(),30.5);
});
test('searchable language pickers preserve native labels, support country search and dispatch existing change events',async()=>{
  const {chromium}=require('playwright-core'),browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try{
    const page=await browser.newPage({locale:'zh-TW',viewport:{width:900,height:700}});await page.setContent('<html lang="zh-TW"><body><label><strong>介面語言</strong><select id="ui"></select></label><label><strong>翻譯語言</strong><select id="translation"></select></label></body></html>');
    await page.addStyleTag({path:path.join(root,'src/renderer/requestedPolish.css')});for(const name of ['languagePicker.js','languageCatalog.js','startupUpdate.js'])await page.addScriptTag({path:path.join(root,'src/renderer',name)});
    await page.evaluate(()=>{window.changes=[];for(const id of ['ui','translation']){const select=document.getElementById(id);AuralaneLanguages.populate(select,'zh-TW');select.addEventListener('change',()=>changes.push([id,select.value]));}});
    assert.equal(await page.evaluate(()=>AuralaneLanguages.nativeName('ab')),'Аҧсуа');assert.equal(await page.evaluate(()=>AuralaneLanguages.nativeName('sq')),'shqip');
    for(const [index,query,name,code]of [[0,'Japan','日本語','ja'],[1,'Taiwan','繁體中文','zh-TW']]){
      await page.locator('.language-picker-trigger').nth(index).click();
      await page.evaluate(()=>{const lyrics=document.createElement('div');lyrics.id='autoscrolling-lyrics';document.body.append(lyrics);lyrics.dispatchEvent(new Event('scroll'));lyrics.remove();});
      assert.equal(await page.locator('.language-picker-panel').isVisible(),true);
      await page.locator('.language-picker-panel input').fill(query);await page.getByRole('option',{name,exact:true}).click();assert.equal(await page.locator('select').nth(index).inputValue(),code);
    }
    assert.equal((await page.evaluate(()=>changes)).length,2);
    await page.evaluate(()=>{window.opened=0;AuralaneStartupUpdate.show({version:'9.9.9',releaseNotes:'<p>Fixes</p><script>window.pwned=1</script>'},{language:'zh-TW',setIconButton:(button,icon,label)=>{button.textContent='X';button.setAttribute('aria-label',label);},openSettings:()=>opened++});});
    assert.equal(await page.locator('.startup-update-notes').innerText(),'Fixes');assert.equal(await page.evaluate(()=>window.pwned),undefined);await page.getByRole('button',{name:'前往更新',exact:true}).click();assert.equal(await page.evaluate(()=>opened),1);
  }finally{await browser.close();}
});

test('Explore hydrates real category artwork with a valid CSS URL while Moods remains text-only',async()=>{
  const {chromium}=require('playwright-core'),browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try{
    const page=await browser.newPage();await page.setContent('<div id="moods"></div><div id="explore"></div>');
    await page.evaluate(source=>{
      window.els={moodsResults:document.getElementById('moods'),exploreResults:document.getElementById('explore')};
      window.uniqueBrowseItems=v=>v;window.browseItemKey=item=>item.params;window.calls=0;
      window.thumbnailUrls=item=>item.thumbnail?[item.thumbnail]:[];window.escapeText=text=>String(text).replace(/"/g,'&quot;');
      window.categoryPage=async()=>{calls++;return{sections:[{items:[{thumbnail:'https://art.test/cover.jpg'}]}]};};
      eval(source);
      const items=[{title:'Focus',browseId:'FEmusic_moods_and_genres_category',params:'focus',stripeColor:123}];
      renderCategoryGrid(els.moodsResults,items);renderCategoryGrid(els.exploreResults,items);
    },['cssUrl','thumbnailBackground','thumbnailStyle','renderCategoryGrid'].map(name=>declaration(name)).join('\n'));
    await page.waitForFunction(()=>document.querySelector('#explore .thumb').style.backgroundImage.includes('https://art.test/cover.jpg'));
    assert.equal(await page.locator('#moods .thumb').count(),0);assert.equal(await page.locator('#explore .category-text-only').count(),0);assert.equal(await page.evaluate(()=>calls),1);
  }finally{await browser.close();}
});

test('media actions are idempotent and unsupported actions do not prevent headset next/previous handlers',()=>{
  const actions={},clicks={play:0,next:0,prev:0},scope={state:{playing:true},els:{audio:{paused:false,ended:false},playButton:{click:()=>clicks.play++},nextButton:{click:()=>clicks.next++},prevButton:{click:()=>clicks.prev++}},navigator:{mediaSession:{setActionHandler(action,handler){if(action==='seekto')throw Error('unsupported');actions[action]=handler;}}},usesAudioTimeline:()=>true};
  vm.createContext(scope);vm.runInContext(declaration('setupMediaSession'),scope);scope.setupMediaSession();
  actions.play();assert.equal(clicks.play,0);actions.pause();assert.equal(clicks.play,1);scope.els.audio.paused=true;actions.pause();assert.equal(clicks.play,1);actions.play();assert.equal(clicks.play,2);actions.nexttrack();actions.previoustrack();assert.equal(clicks.next,1);assert.equal(clicks.prev,1);
});

test('media shortcut refresh retries failed registrations without unbinding working controls',()=>{
  const source=fs.readFileSync(path.join(root,'src/main/main.js'),'utf8'),registered=new Set(['MediaPlayPause']),attempts=[],scope={mediaShortcuts:[['MediaPlayPause','play-toggle'],['MediaNextTrack','next'],['MediaPreviousTrack','previous']],sendMediaCommand:()=>{},globalShortcut:{isRegistered:key=>registered.has(key),register:key=>{attempts.push(key);if(key==='MediaNextTrack'){registered.add(key);return true;}return false;}}};
  vm.createContext(scope);vm.runInContext(declaration('refreshMediaShortcuts',source),scope);let result=scope.refreshMediaShortcuts();assert.equal(result.MediaPlayPause,true);assert.equal(result.MediaNextTrack,true);assert.equal(result.MediaPreviousTrack,false);scope.refreshMediaShortcuts();assert.deepEqual(attempts,['MediaNextTrack','MediaPreviousTrack','MediaPreviousTrack']);
});

test('Spotify no-match songs are marked and skipped, while network errors and newer playback stop the skip chain',async()=>{
  function fixture(code){
    const bad={id:'bad',spotifySource:{id:'bad'}},good={id:'good',local:true};let plays=0,pauses=0;
    const state={queue:[bad,good],settings:{},playbackFailedIds:new Set(),playbackFailures:new Map(),playbackFailureReasons:new Map(),playbackRetryLimit:2,currentTrack:null};
    const noop=()=>{},scope={state,spotifyPlayRevision:0,window:{location:{origin:'http://local.test'}},els:{audio:{dataset:{},removeAttribute:noop,play:async()=>{plays++;},pause:()=>{pauses++;}},lyricsTitle:{},lyricsStatus:{},lyricsList:{}},blockPlaybackForGame:()=>false,componentText:v=>v,toast:noop,resolveSpotifyTrack:async()=>{throw Object.assign(Error('No match'),{code});},persistQueue:async()=>{},renderQueue:noop,renderNow:noop,playbackFailureMessage:v=>v,patchTrackState:(id,patch)=>{state.queue=state.queue.map(t=>t.id===id?{...t,...patch}:t);},resetPlaybackFormatFallback:noop,beginPlaybackRequest:()=>1,rememberQueueHistory:noop,followCurrentQueueTrack:noop,followCurrentTrackInCollection:noop,maybeAutoLoadMoreQueue:async()=>{},isCurrentPlaybackRequest:()=>true,stopEmbedPlayer:noop,setPlaybackModeLabel:noop,applySelectedAudioOutput:async()=>{},applyAudioStartTime:async()=>{},maybeNotifyTrack:async()=>{},loadLyricsForTrack:noop};
    vm.createContext(scope);for(const name of ['markPlaybackFailure','playTrack'])vm.runInContext(declaration(name),scope);return{scope,state,bad,good,plays:()=>plays,pauses:()=>pauses};
  }
  const one=fixture('SPOTIFY_NO_MATCH');assert.equal(await one.scope.playTrack(one.bad),true);assert.equal(one.plays(),1);assert.equal(one.state.queue[0].playbackFailed,true);assert.equal(one.state.currentTrack.id,'good');
  const two=fixture('NETWORK_ERROR');assert.equal(await two.scope.playTrack(two.bad),false);assert.equal(two.plays(),0);assert.equal(two.state.queue[0].playbackFailed,undefined);
  const three=fixture('SPOTIFY_NO_MATCH');three.state.queue=[three.bad];assert.equal(await three.scope.playTrack(three.bad),false);assert.equal(three.pauses(),1);
  const four=fixture('SPOTIFY_NO_MATCH');four.scope.persistQueue=async()=>{four.scope.spotifyPlayRevision++;};assert.equal(await four.scope.playTrack(four.bad),false);assert.equal(four.plays(),0);
});

test('floating lyrics send pause and resume anchors directly from audio events without opening Session',()=>{
  const start=app.indexOf('let lyricAudioWaiting = false;'),end=app.indexOf('\n',app.indexOf('els.audio.addEventListener("timeupdate"',start));
  const events={},sent=[],audio={paused:false,ended:false,seeking:false,readyState:4,playbackRate:1,addEventListener:(name,fn)=>{events[name]=fn;}};
  const scope={lyricWidgetActive:true,state:{playing:true,currentTrack:{id:'song'},activeSidePanel:'queue'},els:{audio},performance:{now:()=>1000},lyricsTimelineNow:()=>12,Date,window:{metro:{updateLyricText:v=>sent.push(v)}}};vm.createContext(scope);vm.runInContext(app.slice(start,end),scope);
  events.waiting();assert.equal(sent.at(-1).playing,false);assert.equal(sent.at(-1).clockOnly,true);events.playing();assert.equal(sent.at(-1).playing,true);assert.equal(sent.at(-1).position,12);audio.paused=true;events.pause();assert.equal(sent.at(-1).playing,false);
});

test('small lyric scrolls animate back without disabling sync; deliberate scrolling unlocks the timeline',()=>{
  const begin=app.indexOf('function handleLyricScrollGesture('),end=app.indexOf('\nels.lyricsList.addEventListener("wheel"',begin);
  let timer,repairs=0;const state={lyricsAutoSync:true,currentTrack:{id:'song'}},host={scrollTop:400,clientHeight:600};
  const scope={state,els:{rightPanel:host},lyricScrollGestures:new Map(),performance:{now:()=>1000},setTimeout:fn=>{timer=fn;return 1;},clearTimeout:()=>{},cancelAnimationFrame:()=>{},setLyricsAutoSync:value=>{state.lyricsAutoSync=value;},scrollLyricIntoView:()=>repairs++,activeLyricElement:()=>({})};
  vm.createContext(scope);vm.runInContext(app.slice(begin,end),scope);
  scope.handleLyricScrollGesture({deltaY:12,target:{closest:()=>null}});assert.equal(state.lyricsAutoSync,true);host.scrollTop=412;timer();assert.equal(repairs,1);assert.equal(state.lyricsAutoSync,true);
  scope.handleLyricScrollGesture({deltaY:150,target:{closest:()=>null}});assert.equal(state.lyricsAutoSync,false);assert.equal(repairs,1);
});
