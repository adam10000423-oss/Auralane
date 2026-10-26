"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),path=require("node:path"),os=require("node:os");
test("Electron retains Queue nodes and renders continuous Session lyrics without page errors",{timeout:90000},async()=>{
  const {_electron}=require("playwright-core"),env={...process.env};delete env.ELECTRON_RUN_AS_NODE;
  const app=await _electron.launch({executablePath:require("electron"),args:[".","--auralane-preview"],cwd:path.join(__dirname,".."),env,timeout:60000});
  try{
    const page=await app.firstWindow(),errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.waitForFunction(()=>typeof state!=="undefined"&&state.queueHydrated&&state.workspaceAppearance&&window.AuralaneQueueRenderer&&window.AuralaneLyricFill,null,{timeout:60000});
    await page.waitForFunction(()=>[...document.querySelectorAll('.nav[data-view]')].every(nav=>nav.querySelector('.nav-icon')));
    const result=await page.evaluate(async()=>{
      state.settings.smartQueue=false;state.settings.lyricsAutoTranslate=false;state.settings.lyricsAutoRomanize=false;
      state.queue=Array.from({length:400},(_,i)=>({id:`perf-${i}`,title:`Performance song ${i}`,artist:'Auralane test',type:'song'}));
      state.currentTrack=state.queue[0];state.playing=false;renderQueue();
      const first=els.queueList.querySelector('.queue-row'),observer=new MutationObserver(()=>{});observer.observe(els.queueList,{childList:true,subtree:true});
      for(let i=0;i<8;i++)renderQueue();const mutations=observer.takeRecords().filter(r=>r.addedNodes.length||r.removedNodes.length).length;observer.disconnect();
      switchSidePanel('lyrics');
      renderLyrics({found:true,synced:true,title:'Continuous word fill',provider:'Local test',lines:[{time:0,text:'Nobody promised tomorrow',words:[{text:'Nobody',start:0,end:2},{text:'promised',start:2,end:4},{text:'tomo',start:4,end:5},{text:'rrow',start:5,end:6}]}]});
      const line=els.lyricsList.querySelector('.lyric-line');
      state.activeLyricIndex=0;line.classList.add('active');
      const word=line.querySelector('.lyric-fluid-word');
      AuralaneLyricFill.update(word,1,els.audio,false);
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      return {count:els.queueList.querySelectorAll('.queue-row').length,retained:first===els.queueList.querySelector('.queue-row'),mutations,fluid:line.querySelectorAll('.lyric-fluid-word').length,letters:line.querySelectorAll('.lyric-grapheme').length,progress:parseFloat(getComputedStyle(word).getPropertyValue('--lyric-fill-progress'))};
    });
    assert.equal(result.count,400);assert.equal(result.retained,true);assert.equal(result.mutations,0);assert.equal(result.fluid,4);assert.equal(result.letters,0);assert.ok(Math.abs(result.progress-50)<1);
    await page.screenshot({path:path.join(os.tmpdir(),'auralane-electron-fluid-session.png')});
    assert.deepEqual(errors,[]);
    console.log('Electron rendering:',JSON.stringify(result));
  }finally{await app.close();}
});
