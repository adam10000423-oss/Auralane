"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.join(__dirname,"../src/renderer"),app=fs.readFileSync(path.join(root,"app.js"),"utf8");
function declaration(name){const start=app.indexOf(`function ${name}(`),tail=app.slice(start);assert.ok(start>=0);return tail.slice(0,tail.indexOf('\n}')+2);}

test("automatic lyric following does not flash the scrollbar, manual scrolling still shows it", () => {
  let listener, shows = 0;
  const context = { state: { activeSidePanel: "lyrics", lyricsProgrammaticScroll: true }, document: { addEventListener: (_, fn) => { listener = fn; } }, clearTimeout() {}, setTimeout: () => 1 };
  vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(root, "interactionPolish.js"), "utf8"), context);
  const panel = { id: "rightPanel", matches: () => true, classList: { add: () => shows++, remove() {} } };
  listener({ target: panel }); assert.equal(shows, 0);
  context.state.lyricsProgrammaticScroll = false; listener({ target: panel }); assert.equal(shows, 1);
  context.state.lyricsProgrammaticScroll = true; listener({ target: { ...panel, id: "main" } }); assert.equal(shows, 2);
});

for (const focus of [false, true]) test(`${focus ? "fullscreen" : "Session"} advancing early to the next line preserves the previous word fill`, () => {
  const updated = [];
  const elements = [0, 1].map(index => ({ index, classList: { contains: () => false, toggle: () => {} }, style: { setProperty() {} } }));
  const context = {
    state: { lyrics: { synced: true, lines: [{ time: 0 }, { time: 10 }] }, activeSidePanel: "lyrics", activeLyricIndex: 0, focusActiveLyricIndex: 0, lyricsActiveDomIndexes: new Set([0]), focusLyricsActiveDomIndexes: new Set([0]), lyricsLineElements: elements, focusLyricsLineElements: elements, lyricsPlaybackSignature: "old", focusLyricsPlaybackSignature: "old" },
    document: { hidden: false }, window: {}, els: { moreMenu: { classList: { contains: () => false } } },
    usesAudioTimeline: () => true, lyricsTimelineNow: () => 9.9,
    lyricPlaybackState: () => ({ targetIndex: 1, active: new Set([1]), visibleBackground: new Set() }),
    lyricLineEndTime: () => 10, updateLyricsIntro() {}, syncLyricWidget() {},
    updateWordHighlights: (element, now) => updated.push([element.index, now]),
    resetLyricWordHighlights: () => { throw new Error("Sung word reset to zero"); }, lyricsMotionDisabled: () => true
  };
  vm.createContext(context);
  const name = focus ? "updateFocusLyricsActive" : "updateLyricsActive";
  vm.runInContext(declaration(name), context); context[name]();
  assert.ok(updated.some(([index, now]) => index === 0 && now === 9.9));
  assert.ok(updated.some(([index]) => index === 1));
});
test("scrolling the middle pane cannot suspend lyric painting",()=>{
  const context={state:{lyricsInteractionUntil:0},performance:{now:()=>1000}};vm.createContext(context);vm.runInContext(declaration('deferDetailedLyricPainting'),context);
  context.deferDetailedLyricPainting({target:{closest:()=>null}});assert.equal(context.state.lyricsInteractionUntil,0);
  context.deferDetailedLyricPainting({target:{closest:()=>({})}});assert.equal(context.state.lyricsInteractionUntil,1180);
});
test("line movement never dims the sentence, even when interrupted while scrolling the middle pane",async()=>{
  const {chromium}=require('playwright-core'),browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1000,height:650}});
    await page.setContent('<style>body{margin:0;display:grid;grid-template-columns:650px 350px;background:#18191d;color:white;font:26px Arial}.main{height:650px;overflow:auto}.main article{height:100px;background:#333;margin:8px}#lyricsPane{padding:100px 20px}.lyric-original,.lyric-translation{display:block}</style><main class="main"></main><section id="lyricsPane"><button class="lyric-line active"><span class="lyric-original">Nobody promised tomorrow</span><span class="lyric-translation">Translation</span></button></section>');
    await page.addScriptTag({path:path.join(root,'lyricMotion.js')});
    await page.evaluate(()=>{document.querySelector('.main').innerHTML='<article>Album</article>'.repeat(100);});
    const frames=await page.evaluate(()=>{
      const line=document.querySelector('.lyric-line'),samples=[];
      AuralaneLyricMotion.enter(line);
      const animations=()=>line.getAnimations({subtree:true}).filter(a=>a.effect.target.parentElement===line);
      for(const time of [0,20,120,250,500]){
        for(const a of animations()){a.pause();a.currentTime=time;}
        document.querySelector('.main').scrollTop=time*2;
        samples.push([...line.children].map(node=>Number(getComputedStyle(node).opacity)));
      }
      AuralaneLyricMotion.enter(line);
      for(const a of animations()){a.pause();a.currentTime=0;}
      samples.push([...line.children].map(node=>Number(getComputedStyle(node).opacity)));
      return {samples,opacityFrames:animations().flatMap(a=>a.effect.getKeyframes()).some(frame=>Object.hasOwn(frame,'opacity'))};
    });
    assert.equal(frames.opacityFrames,false);assert.ok(frames.samples.flat().every(opacity=>opacity===1));
    await page.mouse.move(300,300);await page.mouse.wheel(0,600);
    assert.ok(await page.locator('.main').evaluate(el=>el.scrollTop>0));
  }finally{await browser.close();}
});
test("completed words use solid glyphs and keep their color across seeks",async()=>{
  const {chromium}=require('playwright-core'),browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage();
    await page.setContent('<div class="lyrics-list"><div class="lyric-line active"><span class="lyric-original"><span class="lyric-word lyric-fluid-word" data-start="1" data-end="3">Tomorrow<span class="lyric-word-fill" aria-hidden="true">Tomorrow</span></span></span></div></div>');
    for(const name of ['styles.css','lightTheme.css','workspacePolish.css','lyricColors.css','renderPerformance.css'])await page.addStyleTag({path:path.join(root,name)});
    for(const name of ['lyricColors.js','lyricFill.js'])await page.addScriptTag({path:path.join(root,name)});
    for(const scheme of ['dark','light']){
      const frames=await page.evaluate(scheme=>{
        document.documentElement.dataset.colorScheme=scheme;AuralaneLyricColors.apply({enabled:true});
        const word=document.querySelector('.lyric-word'),audio={paused:true,readyState:4,playbackRate:1};
        return [0,1.2,2.99,3.01,5,1.5].map(now=>{
          word.classList.toggle('passed',now>=3);word.classList.toggle('current',now>=1&&now<3);
          AuralaneLyricFill.update(word,now,audio,false);
          const css=getComputedStyle(word);
          return {fill:css.webkitTextFillColor,background:css.backgroundImage,transition:css.transitionProperty,base:word.style.getPropertyValue('--lyric-fill-progress'),animation:Boolean(word._fillAnimation)};
        });
      },scheme);
      for(const frame of frames){assert.notEqual(frame.fill,'rgba(0, 0, 0, 0)');assert.equal(frame.background,'none');assert.equal(frame.transition,'none');}
      assert.equal(frames[3].base,'100%');assert.equal(frames[3].animation,false);assert.equal(frames[5].animation,true);
    }
  }finally{await browser.close();}
});
