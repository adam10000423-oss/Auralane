"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),path=require("node:path");
const lyricText=require("../src/renderer/lyricText"),{parseLyrics}=require("../src/main/lyrics");
test("HTML lyric entities decode without changing word times or singer roles",()=>{
  const lines=parseLyrics('[00:01.00]{v2}We&apos;re &quot;here&quot; &amp; &#x1F3B5;\n<We&apos;re:1:2|&lt;here&gt;:2:3>');
  assert.equal(lines[0].text,'We\'re "here" & 🎵');
  assert.equal(lines[0].agent,'v2');assert.equal(lines[0].time,1);
  assert.deepEqual(lines[0].words,[{text:"We're",start:1,end:2},{text:'<here>',start:2,end:3}]);
  assert.equal(lyricText.decode('&rsquo; &nbsp; &#39; &unknown;'),'’ \u00a0 \' &unknown;');
  assert.equal(lyricText.decode('&#99999999; &#xD800;'),'\ufffd \ufffd');
});
test("browser decoding stays text-only; cover click focus clears and Session header remains aligned",async()=>{
  const {chromium}=require('playwright-core'),browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:600,height:400}});
    await page.setContent('<style>body{--ink:#191b20;--muted:#535966;--line-soft:#ddd}.queue-head{display:grid;height:70px;box-sizing:border-box;width:280px}.queue-action{display:grid;place-items:center}#nowArt{width:56px;height:56px;background:#eee}</style><div class="queue-head"><div><span class="eyebrow">播放工作階段</span><span id="queueStatus">佇列中有 311 首歌曲 - Liked Songs.</span></div><div class="queue-actions"><button id="lyricsExpandButton">⛶</button></div></div><div id="nowArt"><button class="cover-expand-button">Expand</button></div><div id="text"></div>');
    await page.addStyleTag({path:path.join(__dirname,'../src/renderer/workspacePolish.css')});
    await page.addScriptTag({path:path.join(__dirname,'../src/renderer/lyricText.js')});
    const text=await page.evaluate(()=>{document.querySelector('#text').textContent=AuralaneLyricText.decode('We&apos;re &lt;img src=x onerror=alert(1)&gt;');return document.querySelector('#text').textContent;});
    assert.equal(text,"We're <img src=x onerror=alert(1)>");assert.equal(await page.locator('#text img').count(),0);
    const cover=page.locator('.cover-expand-button');await cover.click();await page.mouse.move(500,350);
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('.cover-expand-button')).opacity==='0');
    await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('.cover-expand-button')).opacity==='1');
    for(const lyrics of [false,true]){
      await page.evaluate(lyrics=>document.body.classList.toggle('showing-lyrics',lyrics),lyrics);
      const heading=await page.locator('.queue-head').boundingBox(),button=await page.locator('#lyricsExpandButton').boundingBox();
      assert.equal(heading.height,70);assert.equal(button.width,38);assert.ok(button.x+button.width<=heading.x+heading.width);
      assert.equal(await page.locator('.queue-head').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
    }
  }finally{await browser.close();}
});
