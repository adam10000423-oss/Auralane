"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.join(__dirname,"../src/renderer"),source=fs.readFileSync(path.join(root,"app.js"),"utf8");
function declaration(name){const start=source.search(new RegExp(`function ${name}\\(`)),tail=source.slice(start),end=tail.slice(1).search(/\n(?:async )?function /);assert.ok(start>=0,name);return tail.slice(0,end+1);}
async function browserTest(run){const {chromium}=require("playwright-core"),browser=await chromium.launch({executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",headless:true});try{await run(await browser.newPage({viewport:{width:1100,height:800}}));}finally{await browser.close();}}
test("600-song queue keeps existing nodes, indices, focus and one recommendation boundary",()=>browserTest(async page=>{
  await page.setContent('<div id="queueList"></div>');
  await page.addScriptTag({path:path.join(root,"queueRenderer.js")});
  const result=await page.evaluate(()=>{
    const host=document.querySelector("#queueList"),renderer=AuralaneQueueRenderer.create(host);
    let items=Array.from({length:600},(_,i)=>({id:String(i),autoplay:i>=590}));
    const html=(item,index)=>`${item.autoplay&&!items[index-1]?.autoplay?'<div class="queue-recommendation-divider">Recommended</div>':''}<div class="queue-row" data-track-id="${item.id}" data-index="${index}"><div class="queue-main">Song ${item.id}</div><div class="queue-row-actions"><button data-queue-remove="${index}">Remove</button><button data-queue-play="${index}">Play</button></div></div>`;
    renderer.render(items,html);
    const originals=new Map([...host.querySelectorAll(".queue-row")].map(row=>[row.dataset.trackId,row]));
    const focus=host.querySelector('[data-track-id="2"] button');focus.focus();
    const observer=new MutationObserver(()=>{});observer.observe(host,{subtree:true,childList:true});
    for(let i=0;i<10;i++)renderer.render(items,html);
    const unchanged=observer.takeRecords().reduce((n,r)=>n+r.addedNodes.length+r.removedNodes.length,0),focusKept=document.activeElement===focus;
    const [moved]=items.splice(595,1);moved.autoplay=false;items.splice(3,0,moved);
    renderer.render(items,html);
    const kept=[...host.querySelectorAll(".queue-row")].every(row=>originals.get(row.dataset.trackId)===row);
    const indices=[...host.querySelectorAll(".queue-row")].every((row,index)=>Number(row.dataset.index)===index&&Number(row.querySelector('[data-queue-play]').dataset.queuePlay)===index);
    const boundary=host.querySelectorAll('.queue-recommendation-divider').length;
    items=items.map(item=>({...item,autoplay:false}));renderer.render(items,html);
    const removedBoundary=host.querySelectorAll('.queue-recommendation-divider').length;
    return {unchanged,focusKept,kept,indices,boundary,removedBoundary};
  });
  assert.deepEqual(result,{unchanged:0,focusKept:true,kept:true,indices:true,boundary:1,removedBoundary:0});
}));
test("retained queue benchmark avoids rebuilding 500 rows on playback-only updates",()=>browserTest(async page=>{
  await page.setContent('<div id="legacy"></div><div id="retained"></div>');await page.addScriptTag({path:path.join(root,'queueRenderer.js')});
  const metrics=await page.evaluate(()=>{
    const items=Array.from({length:500},(_,i)=>({id:String(i)})),html=(item,index)=>`<div class="queue-row" data-index="${index}"><div class="queue-main"><span>Song ${item.id}</span></div><div class="queue-row-actions"><button data-queue-play="${index}">Play</button></div></div>`;
    const old=document.querySelector('#legacy'),next=document.querySelector('#retained'),renderer=AuralaneQueueRenderer.create(next);
    old.innerHTML=items.map(html).join('');renderer.render(items,html);
    const legacyObserver=new MutationObserver(()=>{}),newObserver=new MutationObserver(()=>{});
    legacyObserver.observe(old,{childList:true,subtree:true});newObserver.observe(next,{childList:true,subtree:true});
    let t=performance.now();for(let i=0;i<20;i++)old.innerHTML=items.map(html).join('');const legacyMs=performance.now()-t;
    renderer.render(items,html,item=>item.id);
    t=performance.now();for(let i=0;i<20;i++)renderer.render(items,html,item=>item.id);const retainedMs=performance.now()-t;
    const added=observer=>observer.takeRecords().reduce((n,r)=>n+r.addedNodes.length,0);
    return {legacyMs,retainedMs,legacyAdded:added(legacyObserver),retainedAdded:added(newObserver)};
  });
  console.log('Synthetic queue benchmark:',JSON.stringify(metrics));
  assert.equal(metrics.legacyAdded,10000);assert.equal(metrics.retainedAdded,0);
}));
test("Session and fullscreen word fill is continuous, audio-aligned, pausable and uses no letter nodes",()=>browserTest(async page=>{
  await page.setContent('<section id="lyricsPane"><div class="lyrics-list"><button class="lyric-line active"><span class="lyric-original"></span></button></div></section>');
  for(const name of ['styles.css','lightTheme.css','workspacePolish.css','lyricColors.css','renderPerformance.css'])await page.addStyleTag({path:path.join(root,name)});
  await page.addScriptTag({path:path.join(root,'lyricFill.js')});
  await page.evaluate(code=>{
    document.documentElement.dataset.colorScheme='dark';
    window.state={lyricsExpanded:false,playing:true};window.escapeText=s=>s;window.eval(code);
    document.querySelector('.lyric-original').innerHTML=lyricOriginalHtml({text:'Nobody promised tomorrow',words:[{text:'Nobody',start:0,end:1},{text:'promised',start:1,end:2},{text:'tomo',start:2,end:3},{text:'rrow',start:3,end:4}]});
    window.audio={paused:false,seeking:false,readyState:4,playbackRate:1};
    window.word=document.querySelector('.lyric-fluid-word');
    AuralaneLyricFill.update(word,.25,audio,true);word._fillAnimation.pause();word._fillAnimation.currentTime=250;
  },['alignedTimedLyricSegments','lyricOriginalHtml'].map(declaration).join('\n'));
  assert.equal(await page.locator('.lyric-grapheme').count(),0);
  assert.equal(await page.locator('.lyric-fluid-word').count(),4);
  await page.waitForFunction(()=>getComputedStyle(word.querySelector('.lyric-word-fill')).clipPath.includes('75%'));
  await page.evaluate(()=>word._fillAnimation.currentTime=625);
  await page.waitForFunction(()=>getComputedStyle(word.querySelector('.lyric-word-fill')).clipPath.includes('37.5%'));
  const controls=await page.evaluate(()=>{
    AuralaneLyricFill.update(word,.7,audio,false);
    const paused=word._fillAnimation.playState;
    AuralaneLyricFill.update(word,.1,audio,false);const seek=word._fillAnimation.currentTime;
    audio.playbackRate=1.5;AuralaneLyricFill.update(word,.3,audio,true);const rate=word._fillAnimation.playbackRate;
    audio.readyState=2;AuralaneLyricFill.update(word,.32,audio,true);const buffered=word._fillAnimation.playState;
    AuralaneLyricFill.update(word,1.2,audio,false);const finished=word.style.getPropertyValue('--lyric-fill-progress');
    AuralaneLyricFill.reset(word);return {paused,seek,rate,buffered,finished,animations:word.getAnimations({subtree:true}).filter(a=>a.id==='auralane-word-fill').length};
  });
  assert.deepEqual(controls,{paused:'paused',seek:100,rate:1.5,buffered:'paused',finished:'100%',animations:0});
  for(const scheme of ['dark','light'])for(const full of [false,true]){
    await page.evaluate(({scheme,full})=>{document.documentElement.dataset.colorScheme=scheme;document.body.classList.toggle('lyrics-maximized',full);AuralaneLyricFill.update(word,.5,audio,false);},{scheme,full});
    assert.equal(await page.locator('.lyric-fluid-word').first().evaluate(el=>getComputedStyle(el).backgroundImage),'none');
    assert.notEqual(await page.locator('.lyric-fluid-word').first().evaluate(el=>getComputedStyle(el).webkitTextFillColor),'rgba(0, 0, 0, 0)');
  }
  await page.screenshot({path:path.join(require('node:os').tmpdir(),'auralane-fluid-lyrics.png')});
}));
test("hidden Session updates logical time for floating lyrics without touching lyric DOM",()=>{
  const context={window:{},state:{lyrics:{synced:true,lines:[{time:1,text:'First'}]},activeSidePanel:'queue',activeLyricIndex:-1},document:{hidden:false},usesAudioTimeline:()=>true,lyricsTimelineNow:()=>2,lyricPlaybackState:()=>({targetIndex:0}),widgetUpdates:0,syncLyricWidget:()=>context.widgetUpdates++,updateLyricsIntro:()=>{throw new Error('Hidden DOM work');}};
  vm.createContext(context);vm.runInContext(declaration('updateLyricsActive'),context);context.updateLyricsActive();context.updateLyricsActive();
  assert.equal(context.state.activeLyricIndex,0);assert.equal(context.widgetUpdates,1);assert.equal(context.state.lyricsPlaybackSignature,null);
});
test("floating lyrics reuse their timeline and only resend it for source, translation or color changes",()=>{
  const sent=[];
  const context={lyricWidgetActive:true,state:{settings:{desktopLyricsOpacity:65},lyrics:{found:true,lines:[{text:'Hello',time:1,words:[]}]},activeLyricIndex:0,currentTrack:{id:'song'},lyricsTranslationVisible:false},
    window:{metro:{updateLyricText:value=>sent.push(value)}},document:{documentElement:{dataset:{colorScheme:'dark'}}},els:{audio:{playbackRate:1}},getThemeColorHex:()=>"#112233",lyricsTimelineNow:()=>1.5,lyricWidgetIsPlaying:()=>true,
    translatedTextForLine:()=>"",romanizedTextForLine:()=>"",alignedTimedLyricSegments:()=>[]};
  vm.createContext(context);vm.runInContext(declaration('syncLyricWidget'),context);
  context.syncLyricWidget();context.syncLyricWidget();
  assert.equal(sent[0].lines.length,1);assert.equal(sent[1].clockOnly,true);assert.equal(sent[1].lines,undefined);
  context.state.lyricsTranslation={lines:[{text:'Translation'}]};context.syncLyricWidget();assert.equal(sent[2].lines.length,1);
  context.state.settings.desktopLyricsOpacity=75;context.syncLyricWidget();assert.equal(sent[3].settings.opacity,75);assert.equal(sent[3].clockOnly,undefined);
});
