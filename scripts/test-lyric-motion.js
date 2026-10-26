"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),path=require("node:path");
test("line transitions animate only line containers, preserve words, and respect disabled motion",async()=>{
  const {chromium}=require("playwright-core"),browser=await chromium.launch({channel:"msedge",headless:true});
  try{
    const page=await browser.newPage({viewport:{width:900,height:700}});
    await page.setContent('<section id="lyricsPane"><button class="lyric-line agent-v2" style="text-align:right"><span class="lyric-original"><span class="lyric-grapheme" style="--grapheme-progress:.4">Hello</span></span><span class="lyric-translation">Translation</span></button></section>');
    await page.addStyleTag({content:'.lyric-line{width:600px;color:white;background:#141416;border:0;padding:24px;font:600 32px sans-serif}.lyric-original,.lyric-translation{display:block}.lyric-translation{font-size:20px;color:#aaa;margin-top:12px}'});
    await page.addStyleTag({path:path.join(__dirname,"../src/renderer/lyricMotion.css")});
    await page.addScriptTag({path:path.join(__dirname,"../src/renderer/lyricMotion.js")});
    const frame=await page.evaluate(()=>{
      const line=document.querySelector(".lyric-line"),text=line.textContent;
      AuralaneLyricMotion.enter(line);
      const effects=line.getAnimations({subtree:true}).filter(a=>a.effect.target.parentElement===line);
      effects.forEach(a=>{a.pause();a.currentTime=250;});
      return {count:effects.length,wordAnimations:line.querySelector(".lyric-grapheme").getAnimations().length,textUnchanged:line.textContent===text,progress:line.querySelector(".lyric-grapheme").style.getPropertyValue("--grapheme-progress"),duration:effects[0].effect.getTiming().duration,delays:effects.map(a=>a.effect.getTiming().delay),origin:effects[0].effect.getKeyframes()[0].transformOrigin,transform:getComputedStyle(line.firstElementChild).transform};
    });
    assert.equal(frame.count,2);assert.equal(frame.wordAnimations,0);assert.equal(frame.textUnchanged,true);assert.equal(frame.progress,".4");assert.equal(frame.duration,620);assert.deepEqual(frame.delays,[0,45]);assert.equal(frame.origin,"right center");assert.notEqual(frame.transform,"none");
    const ended=await page.evaluate(async()=>{
      const line=document.querySelector(".lyric-line"),before=line.getAnimations({subtree:true}).filter(a=>a.effect.target.parentElement===line);
      AuralaneLyricMotion.enter(line);const replacement=line.getAnimations({subtree:true}).filter(a=>a.effect.target.parentElement===line);replacement.forEach(a=>a.finish());
      await Promise.all(replacement.map(a=>a.finished));await Promise.resolve();
      AuralaneLyricMotion.enter(line,{disabled:true});
      return {oldCancelled:before.every(a=>a.playState==="idle"),animations:line.getAnimations({subtree:true}).filter(a=>a.effect.target.parentElement===line).length,transform:getComputedStyle(line.firstElementChild).transform};
    });
    assert.equal(ended.oldCancelled,true);assert.equal(ended.animations,0);assert.equal(ended.transform,"none");
  }finally{await browser.close();}
});
