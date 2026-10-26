"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const app=fs.readFileSync(path.join(__dirname,"../src/renderer/app.js"),"utf8"),languages=require("../src/renderer/languageCatalog");
test("Explore excludes duplicated personalized shortcuts and retains exact category params and colors",async()=>{
  const {InnerTubeClient}=require('../src/main/innertube.legacy'),client=new InnerTubeClient({locale:{gl:'TW',hl:'zh-TW'}});
  const item=(title,params)=>({musicNavigationButtonRenderer:{buttonText:{runs:[{text:title}]},clickCommand:{browseEndpoint:{browseId:'FEmusic_moods_and_genres_category',params}},solid:{leftStripeColor:4288988671}}});
  const grid=(title,items)=>({gridRenderer:{header:{gridHeaderRenderer:{title:{runs:[{text:title}]}}},items}});
  client.request=async()=>({contents:{singleColumnBrowseResultsRenderer:{tabs:[{tabRenderer:{content:{sectionListRenderer:{contents:[grid('為你推薦',[item('Focus','focus')]),grid('Moods',[item('Relax','relax'),item('Focus','focus')])]}}}}]}}});
  const result=await client.moods();assert.deepEqual(result.items.map(item=>item.params),['relax','focus']);assert.equal(result.items[0].stripeColor,4288988671);assert.equal(result.tracks.length,0);
});
function declaration(name){const start=app.search(new RegExp(`(?:async )?function ${name}\\(`)),tail=app.slice(start),end=tail.slice(1).search(/\n(?:async )?function /);return tail.slice(0,end+1);}
test("language selection uses device language and never changes Chinese written form based on UI",()=>{
  assert.equal(languages.detect(["zh-HK"]),"zh-TW");assert.equal(languages.detect(["zh-CN"]),"zh-CN");assert.equal(languages.detect(["de-DE"]),"de");assert.equal(languages.detect(["pt-BR"]),"pt-BR");assert.ok(languages.codes.length>=200);assert.equal(new Set(languages.codes).size,languages.codes.length);for(const code of languages.codes)assert.ok(languages.nativeName(code));
});
test("theme text contrast reaches WCAG AA on both light and dark surfaces, including black and white",()=>{
  const context={DEFAULT_THEME_RGB:[237,85,100]};vm.createContext(context);for(const name of ["normalizeRgb","mixRgb","readableThemeColor"])vm.runInContext(declaration(name),context);
  const l=rgb=>rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  for(const rgb of [[0,0,0],[255,255,255],[8,35,75],[255,190,3],[95,35,135]])for(const light of [false,true]){const color=context.readableThemeColor(rgb,light),a=l(color),b=l(light?[245,246,248]:[28,28,32]);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5);}
});
test("the first arriving word-synced lyric displays before slower providers finish and is not replaced",async()=>{
  let slow,shown=[];const state={currentTrack:{id:"song",title:"Song"},settings:{},lyricsPrefetchCandidates:new Map(),lyricsSearchRequest:0,lyricsSelectionRevision:0,lyricsUserSelected:false};
  const noop=()=>{},word={sourceId:"fast",providerKey:"fast",title:"Song",found:true,synced:true,lines:[{time:1,text:"original",words:[{start:1,end:2,text:"original"}]}]},plain={sourceId:"slow",providerKey:"slow",title:"Song",found:true,synced:true,lines:[{time:1,text:"other"}]};
  const scope={state,els:{},console,lyricsCacheKey:()=>"song",enabledLyricsSearchProviders:()=>["slow","fast"],lyricsProviderLabelByKey:v=>v,setLyricsProviderState:noop,selectedLyricsMemoryForTrack:()=>null,savedLyricsCandidateForTrack:()=>null,localLyricsCandidateForTrack:()=>null,
    appendLyricsSearchCandidates:values=>{for(const candidate of values)if(!state.lyricsSearchCandidates.some(v=>v.sourceId===candidate.sourceId))state.lyricsSearchCandidates.push(candidate);},renderLyricsCandidateList:noop,selectPreferredLyricsCandidate:noop,updateLyricsSearchStatus:noop,updateLyricsToolState:noop,resolveLyricsSearchIdentity:async()=>({title:"Song",artist:"Artist"}),searchDefinitionForProvider:p=>({provider:p,options:{p}}),lyricsSearchArtistFromTrack:()=>"Artist",removeLyricsPendingProvider:noop,cacheLyricsSearchState:noop,lyricsCandidateToResult:v=>v,lyricsContentKey:v=>v.sourceId,persistAutomaticLyricsSelection:async()=>({}),renderLyrics:v=>{state.lyrics=v;shown.push(v.sourceId);},window:{metro:{searchLyrics:(_track,options)=>options.p==="fast"?Promise.resolve({candidates:[word]}):new Promise(r=>{slow=r;})}}};
  vm.createContext(scope);vm.runInContext(declaration("searchLyricsCandidatesForCurrent"),scope);const pending=scope.searchLyricsCandidatesForCurrent();await new Promise(r=>setImmediate(r));assert.deepEqual(shown,["fast"]);slow({candidates:[plain]});await pending;assert.deepEqual(shown,["fast"]);
});
test("queue placeholder remains full-height and tracks the insertion target without changing stored order",()=>{
  const css=fs.readFileSync(path.join(__dirname,"../src/renderer/workspacePolish.css"),"utf8");assert.match(css,/\.queue-row\.dragging\s*\{[^}]*display:grid !important;visibility:hidden/);
  assert.match(declaration("markQueueDropTarget"),/insertBefore\(draggingRow,target\)/);assert.doesNotMatch(declaration("markQueueDropTarget"),/persistQueue|state\.queue\s*=/);
});

test("Play next starts lyric prefetch before queue persistence finishes",async()=>{
  let complete;const prefetch=[];const scope={state:{currentTrack:{id:"a"},queue:[{id:"a"}]},queueMutationBlocked:()=>false,isTrackItem:()=>true,toast:()=>{},renderQueue:()=>{},persistQueue:()=>new Promise(r=>{complete=r;}),prefetchSingleTrackLyrics:track=>prefetch.push(track.id)};
  vm.createContext(scope);vm.runInContext(declaration("playNext"),scope);const work=scope.playNext({id:"b",title:"Next"});await new Promise(r=>setImmediate(r));assert.deepEqual(prefetch,["b"]);complete();await work;
});

test("real controls clear text with events, hide obsolete provider settings and preserve drag geometry",async()=>{
  const {chromium}=require("playwright-core"),browser=await chromium.launch({channel:"msedge",headless:true});
  try{const page=await browser.newPage({viewport:{width:1000,height:800}});await page.setContent('<div id="settingsView"><label class="settings-field"><select id="settingsThemeMode"><option value="auto">Auto</option></select></label><label class="settings-field"><select id="settingsLyricsSource"></select></label><label class="settings-field"><select id="settingsLyricsPriority"></select></label><div class="settings-field lyrics-source-switches"></div><input id="query" value="text"></div><div id="nowArt"></div><div id="lyricsList"></div><div id="queueList"><div class="queue-row dragging" data-index="0" style="height:80px">A</div><div class="queue-row" data-index="1" style="height:80px">B</div><div class="queue-row" data-index="2" style="height:80px">C</div></div>');
    await page.addStyleTag({path:path.join(__dirname,"../src/renderer/workspacePolish.css")});await page.addScriptTag({path:path.join(__dirname,"../src/renderer/workspacePolish.js")});
    await page.evaluate(()=>{window.events=[];document.querySelector('#query').addEventListener('input',()=>events.push('input'));document.querySelector('#query').addEventListener('change',()=>events.push('change'));AuralaneWorkspacePolish.init({state:{settings:{}},setIconButton:(button,icon,title)=>{button.textContent=icon;button.title=title;},refreshLikes:()=>{},applyScheme:()=>{},save:()=>{},expand:()=>{}});});
    await page.locator('#query + .input-clear').click();assert.equal(await page.locator('#query').inputValue(),"");assert.deepEqual(await page.evaluate(()=>events),["input","change"]);assert.equal(await page.locator('#settingsLyricsSource').isVisible(),false);
    await page.evaluate(source=>{window.state={queueDragFrom:0};window.els={queueList:document.querySelector('#queueList')};eval(source);markQueueDropTarget(document.querySelector('[data-index="2"]'),3);},declaration('markQueueDropTarget'));
    const drag=await page.evaluate(()=>({order:[...document.querySelector('#queueList').children].map(el=>el.dataset.index),height:document.querySelector('.dragging').getBoundingClientRect().height,display:getComputedStyle(document.querySelector('.dragging')).display}));assert.deepEqual(drag.order,["1","2","0"]);assert.equal(drag.height,80);assert.equal(drag.display,"grid");
  }finally{await browser.close();}
});
