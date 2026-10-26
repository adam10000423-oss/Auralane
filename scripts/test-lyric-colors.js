"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.join(__dirname,"../src/renderer");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
function declaration(name){const start=app.search(new RegExp(`function ${name}\\(`)),tail=app.slice(start),end=tail.slice(1).search(/\n(?:async )?function /);assert.ok(start>=0,name);return tail.slice(0,end+1);}
test("lyric colors validate and persist per account without accepting CSS injection",()=>{
  const {normalize}=require("../src/main/workspacePreferences");
  assert.deepEqual(normalize({lyricColors:{enabled:true,active:"#aabbcc",passed:"url(bad)",upcoming:"#123456",translation:"#987654"}}).lyricColors,{enabled:true,active:"#aabbcc",upcoming:"#123456",translation:"#987654"});
});
test("color controls preview, reset and preserve defaults; timed syllables wrap as whole words",async()=>{
  const {chromium}=require("playwright-core"),browser=await chromium.launch({executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1000,height:800}});
    await page.setContent('<div id="grid"></div><div id="lyricsPane"><div class="lyrics-list"><button class="lyric-line active agent-v2" style="width:380px;text-align:right;font:38px Arial"><span class="lyric-original"></span><span class="lyric-translation">Translation</span></button></div></div>');
    for(const file of ["styles.css","lightTheme.css","workspacePolish.css","interactionPolish.css","lyricColors.css"])await page.addStyleTag({path:path.join(root,file)});
    await page.addScriptTag({path:path.join(root,"lyricColors.js")});
    await page.evaluate(source=>{
      window.state={settings:{language:"zh-TW"},lyricsExpanded:true};window.saved=0;window.synced=0;
      window.escapeText=value=>String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");
      window.lyricGraphemes=value=>[...value];window.eval(source);
      window.colors=AuralaneLyricColors.init({state,save:()=>saved++,colorsChanged:()=>synced++},document.querySelector("#grid"));
      const line={text:"Nobody's promised tomorrow",words:[{text:"Nobody's",start:0,end:1},{text:"promised",start:1,end:2},{text:"tomo",start:2,end:3},{text:"rrow",start:3,end:4}]};
      document.querySelector(".lyric-original").innerHTML=lyricOriginalHtml(line);
    },["alignedTimedLyricSegments","lyricOriginalHtml"].map(declaration).join("\n"));
    assert.equal(await page.locator(".lyric-wrap-word").count(),3);
    assert.equal(await page.locator(".lyric-wrap-word").last().textContent(),"tomorrow");
    assert.equal(await page.locator(".lyric-word").count(),4);
    for(const width of [260,380,600]){
      await page.locator(".lyric-line").evaluate((el,width)=>el.style.width=`${width}px`,width);
      const boxes=await page.locator(".lyric-wrap-word:last-child .lyric-word").evaluateAll(els=>els.map(el=>el.getBoundingClientRect().top));
      assert.equal(boxes[0],boxes[1],`tomorrow stays whole at ${width}`);
    }
    assert.equal(await page.evaluate(()=>document.documentElement.dataset.lyricColors),"auto");
    assert.deepEqual(await page.locator('.lyric-color-field input').evaluateAll(inputs=>inputs.map(input=>input.value)),['#ffffff','#ffffff','#808080','#dddddd']);
    await page.locator("#settingsLyricColors").check();
    for(const [key,value] of Object.entries({active:"#1267ab",passed:"#778899",upcoming:"#556677",translation:"#335544"})){
      await page.locator(`#settingsLyricColor-${key}`).evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event("input"));el.dispatchEvent(new Event("change"));},value);
    }
    assert.equal(await page.locator(".lyric-translation").evaluate(el=>getComputedStyle(el).color),"rgb(51, 85, 68)");
    await page.locator(".lyric-word").first().evaluate(el=>el.classList.add("passed"));
    assert.equal(await page.locator(".lyric-grapheme").first().evaluate(el=>getComputedStyle(el).color),"rgb(119, 136, 153)");
    await page.evaluate(()=>{document.documentElement.dataset.colorScheme="light";colors.refresh();});
    assert.equal(await page.locator(".lyric-translation").evaluate(el=>getComputedStyle(el).color),"rgb(51, 85, 68)");
    assert.ok(await page.evaluate(()=>saved>=5&&synced>=5));
    await page.screenshot({path:path.join(require("node:os").tmpdir(),"auralane-lyric-colors.png")});
    await page.getByRole("button",{name:"恢復預設"}).click();
    assert.equal(await page.evaluate(()=>document.documentElement.dataset.lyricColors),"auto");
    assert.equal(await page.locator("#settingsLyricColor-active").isDisabled(),true);
    assert.deepEqual(await page.locator('.lyric-color-field input').evaluateAll(inputs=>inputs.map(input=>input.value)),['#ffffff','#ffffff','#808080','#dddddd']);
    const fallback = await page.evaluate(()=>{
      AuralaneLyricColors.apply({enabled:true,active:'#123456'});
      const root=document.documentElement;
      return ['active','passed','upcoming','translation'].map(key=>root.style.getPropertyValue(`--lyric-custom-${key}`));
    });
    assert.deepEqual(fallback,['#123456','#ffffff','#808080','#dddddd']);
  }finally{await browser.close();}
});
