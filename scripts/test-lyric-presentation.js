"use strict";
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),os=require('node:os');
const app=fs.readFileSync(path.join(__dirname,'../src/renderer/app.js'),'utf8');
function declaration(name){const start=app.search(new RegExp(`function ${name}\\(`)),tail=app.slice(start),end=tail.slice(1).search(/\n(?:async )?function /);assert.ok(start>=0,name);return tail.slice(0,end+1);}
const lines=[{time:10,text:'Main',words:[{text:'Main',start:10,end:18}]},{time:12,text:'Backing vocals',isBackground:true,words:[{text:'Backing',start:12,end:14}]},{time:20,text:'Next'}];
test('backing vocals only open their real interval, including backward seeks',()=>{
  const context={state:{}};vm.createContext(context);
  for(const name of ['lyricLineEndTime','rebuildLyricsPlaybackIndex','mainLyricIndexAt','lyricPlaybackState'])vm.runInContext(declaration(name),context);
  context.rebuildLyricsPlaybackIndex(lines);
  for(const [now,visible] of [[0,false],[11.64,false],[11.7,true],[12,true],[13.99,true],[14.2,true],[14.46,false],[25,false],[13,true],[0,false]])assert.equal(context.lyricPlaybackState(lines,now).visibleBackground.has(1),visible,`time ${now}`);
  assert.equal(context.lyricPlaybackState(lines,11.7).active.has(1),false);
  assert.equal(context.lyricPlaybackState(lines,14.2).active.has(1),false);
});
test('intro lives inside the lyric list, seeks to zero, and resumes animation after seeking back',async()=>{
  const {chromium}=require('playwright-core'),browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:800,height:700}});
    await page.setContent('<div id="lyricsList" class="lyrics-list"></div><div id="focusLyricsList" class="focus-lyrics-list"></div><div id="focusMode" class="hidden"></div>');
    for(const file of ['styles.css','workspacePolish.css'])await page.addStyleTag({path:path.join(__dirname,'../src/renderer',file)});
    await page.evaluate(({source,lines})=>{
      window.state={lyrics:{synced:true,lines},lyricsAutoSync:true,focusLyricsAutoSync:true};
      window.els={lyricsList:document.querySelector('#lyricsList'),focusLyricsList:document.querySelector('#focusLyricsList'),focusMode:document.querySelector('#focusMode'),audio:{currentTime:30}};
      window.scrolls=0;window.scrollLyricIntoView=window.scrollFocusLyricIntoView=()=>scrolls++;
      window.usesAudioTimeline=()=>true;window.setLyricsAutoSync=window.setFocusLyricsAutoSync=()=>{};
      window.updateProgress=()=>{};window.updateLyricsActive=()=>updateLyricsIntro(els.audio.currentTime);
      window.eval(source);
      const html=lyricsIntroHtml(state.lyrics)+'<button class="lyric-line">Main</button><button class="lyric-line background-vocal"><span class="lyric-original">Backing vocals</span></button><button class="lyric-line">Next</button>';
      els.lyricsList.innerHTML=html;els.focusLyricsList.innerHTML=html;
      els.lyricsList.addEventListener('click',event=>seekLyricsIntro(event));
      window.setIntroTime=now=>updateLyricsIntro(now);
      updateLyricsIntro(0);
    },{source:['lyricsIntroHtml','styleLyricsIntro','updateLyricsIntro','seekLyricsIntro'].map(declaration).join('\n'),lines});
    const intro=page.locator('#lyricsList .lyrics-intro');
    assert.ok(await intro.evaluate(e=>e.classList.contains('active')));
    assert.equal(await page.locator('#lyricsList .lyric-line').count(),3);
    await page.evaluate(()=>setIntroTime(11));assert.equal(await intro.evaluate(e=>e.classList.contains('active')),false);
    await intro.click();assert.equal(await page.evaluate(()=>els.audio.currentTime),0);assert.ok(await intro.evaluate(e=>e.classList.contains('active')));
    await page.evaluate(()=>{setIntroTime(11);setIntroTime(0);updateLyricsIntro(0,true);});
    await page.screenshot({path:path.join(os.tmpdir(),'auralane-intro-lyrics-preview.png')});
    assert.ok(await page.locator('#focusLyricsList .lyrics-intro').evaluate(e=>e.classList.contains('active')));
    const bg=page.locator('#lyricsList .background-vocal');assert.equal((await bg.boundingBox()).height,0);
    const before=await page.locator('#lyricsList').evaluate(e=>e.getBoundingClientRect().height);
    const heights=await bg.evaluate(e=>{
      e.classList.add('background-active');getComputedStyle(e).height;
      const animations=e.getAnimations();for(const animation of animations){animation.pause();animation.currentTime=160;}
      const middle=e.getBoundingClientRect().height;
      for(const animation of animations)animation.currentTime=320;
      const end=e.getBoundingClientRect().height;
      for(const animation of animations)animation.finish();
      return {middle,end};
    });
    assert.ok(heights.middle>0&&heights.end>heights.middle);assert.ok(parseFloat(await bg.evaluate(e=>getComputedStyle(e).fontSize))>=18);
    await bg.evaluate(e=>e.classList.remove('background-active'));
    await page.waitForFunction(()=>document.querySelector('#lyricsList .background-vocal').getBoundingClientRect().height<.5);
    await page.waitForFunction(before=>Math.abs(document.querySelector('#lyricsList').getBoundingClientRect().height-before)<.5,before);
  }finally{await browser.close();}
});
