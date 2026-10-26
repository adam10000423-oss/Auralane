"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs/promises"),path=require("node:path"),os=require("node:os"),{chromium}=require("playwright-core");
const root=path.join(__dirname,"../src/renderer"),executablePath="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
async function documentFixture(page,file,{skipLight=false}={}){
  await page.route("https://auralane.test/**",route=>route.fulfill({contentType:"text/html",body:"<!doctype html><html></html>"}));
  await page.goto("https://auralane.test/");
  const source=await fs.readFile(path.join(root,file),"utf8");
  const parsed=await page.evaluate(source=>{const doc=new DOMParser().parseFromString(source,"text/html"),styles=[...doc.querySelectorAll('link[rel="stylesheet"]')].map(el=>el.getAttribute("href"));doc.querySelectorAll("script,link").forEach(el=>el.remove());return {html:doc.documentElement.outerHTML,styles};},source);
  await page.setContent(parsed.html);
  for(const name of parsed.styles)if(!skipLight||name!=="lightTheme.css")await page.addStyleTag({path:path.join(root,name)});
  await page.addStyleTag({content:"*,*::before,*::after{animation:none!important;transition:none!important}"});
}
async function colors(page,selector){return page.locator(selector).first().evaluate(el=>{
  const s=getComputedStyle(el),canvas=document.createElement("canvas");canvas.width=canvas.height=1;const ctx=canvas.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,1,1);ctx.fillStyle=s.backgroundColor;ctx.fillRect(0,0,1,1);const rgb=[...ctx.getImageData(0,0,1,1).data].slice(0,3);
  return {bg:s.backgroundColor,rgb,color:s.color,image:s.backgroundImage,shadow:s.boxShadow};
});}
test("all main surfaces, popovers and neutral controls stay light in standard/glass and hover/focus/pressed states",async()=>{
  const browser=await chromium.launch({executablePath,headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});await documentFixture(page,"index.html");
    await page.evaluate(()=>{
      document.documentElement.dataset.colorScheme="light";document.documentElement.style.setProperty("--readable-accent","139, 49, 69");document.documentElement.style.setProperty("--lyrics-accent-color","139, 49, 69");document.documentElement.style.setProperty("--on-accent","#fff");
      document.body.classList.remove("player-empty");
      for(const selector of ["#moreMenu","#qualityMenu","#audioOutputMenu","#lyricsVersionMenu"])document.querySelector(selector)?.insertAdjacentHTML("beforeend",'<button data-theme-fixture>Sample action</button>');
      document.querySelector('#likedResults').insertAdjacentHTML('beforeend','<div class="row"><span class="row-download" role="button">Download</span><span class="row-like liked" role="button">Liked</span><span class="unified-more-trigger" role="button">More</span></div>');
      document.body.insertAdjacentHTML("beforeend",'<dialog class="online-room-dialog"><input placeholder="Room"><button>Join</button></dialog><dialog class="workspace-dialog"><button>Connect</button><input placeholder="Key"></dialog>');
    });
    const selectors=[".sidebar-collapse","#lyricsExpandButton",".row-download",".row-like",".unified-more-trigger",".secondary","#shuffleButton","#prevButton","#nextButton","#repeatButton","#shareButton","#audioOutputButton","#accountLogin","#logoutButton",".actions-grid button",".lyrics-sync-button",".focus-close",".settings-card button",".online-room-dialog button",".workspace-dialog button","#moreMenu button","#qualityMenu button","#audioOutputMenu button","#lyricsVersionMenu button"];
    const surfaces=[".more-menu",".quality-menu",".sleep-menu",".audio-output-menu",".account-switcher",".search-suggestions",".recognition-history-panel",".lyrics-quick-drawer",".lyrics-more-popover",".lyrics-version-menu",".playlist-modal",".command-panel",".recognition-modal",".lyrics-search-modal",".lyrics-timeline-modal",".collection-hero",".artist-hero",".podcast-hero",".local-playlist-panel","kbd",".online-room-dialog",".workspace-dialog"];
    const cdp=await page.context().newCDPSession(page);await cdp.send("DOM.enable");await cdp.send("CSS.enable");
    const {root:dom}=await cdp.send("DOM.getDocument");
    for(const material of ["standard","glass"]){
      await page.evaluate(material=>document.body.dataset.material=material,material);
      for(const selector of surfaces){const value=await colors(page,selector);assert.ok(Math.min(...value.rgb)>180,`${material} surface ${selector}: ${JSON.stringify(value)}`);}
      for(const selector of selectors){
        const {nodeId}=await cdp.send("DOM.querySelector",{nodeId:dom.nodeId,selector});assert.ok(nodeId,selector);
        for(const pseudoClasses of [[],["hover"],["focus-visible"],["active"]]){
          await cdp.send("CSS.forcePseudoState",{nodeId,forcedPseudoClasses:pseudoClasses});
          const value=await colors(page,selector);assert.ok(Math.min(...value.rgb)>170,`${material} ${selector} ${pseudoClasses}: ${JSON.stringify(value)}`);
        }
        await cdp.send("CSS.forcePseudoState",{nodeId,forcedPseudoClasses:[]});
      }
      await page.evaluate(()=>document.body.classList.add("lyrics-maximized"));
      for(const selector of ["body",".queue-panel","footer.player",".native-titlebar",".lyrics-version-button","#lyricsOffsetValue"]){const value=await colors(page,selector);assert.ok(Math.min(...value.rgb)>180,`expanded ${material} ${selector}: ${JSON.stringify(value)}`);}
      assert.equal((await colors(page,'#lyricsOffsetValue')).color,'rgb(25, 27, 32)');
      for(const id of ['prevButton','nextButton'])assert.equal((await colors(page,'#'+id)).color,'rgb(25, 27, 32)');
      await page.locator('#lyricsVersionButton').evaluate(el=>{el.disabled=false;el.setAttribute('aria-expanded','true');});
      assert.ok(Math.min(...(await colors(page,'.lyrics-version-button')).rgb)>180);
      await page.locator('#lyricsVersionButton').evaluate(el=>el.setAttribute('aria-expanded','false'));
      await page.evaluate(()=>document.body.classList.remove("lyrics-maximized"));
      await page.locator('#lyricsSearchButton').evaluate(el=>el.disabled=false);
      const primary=await colors(page,'#lyricsSearchButton');assert.ok(Math.min(...primary.rgb)<160,`primary must keep its accent fill: ${JSON.stringify(primary)}`);
    }
    await page.evaluate(()=>{
      document.querySelector('#lyricsPane').classList.remove('hidden');document.querySelector('#queuePane').classList.add('hidden');
      const panel=document.querySelector('#rightPanel');panel.style.height='420px';panel.style.overflow='auto';
      document.querySelector('#lyricsList').style.height='2000px';document.querySelector('#lyricsOffsetValue').textContent='0毫秒';panel.scrollTop=500;
    });
    const geometry=await page.evaluate(()=>({tabs:document.querySelector('.side-tabs').getBoundingClientRect().bottom,meta:document.querySelector('.lyrics-meta').getBoundingClientRect().top,wrap:document.querySelector('#lyricsOffsetValue').scrollWidth>document.querySelector('#lyricsOffsetValue').clientWidth}));
    assert.ok(geometry.meta>=geometry.tabs+4,`lyric metadata must stay below tabs: ${JSON.stringify(geometry)}`);assert.equal(geometry.wrap,false);
    for(const policy of ["reduce","power","drag"]){await page.evaluate(policy=>{document.body.dataset.reduceTransparency=String(policy==="reduce");document.documentElement.classList.toggle("apt-low-power",policy==="power");document.body.classList.toggle("workspace-dragging",policy==="drag");},policy);assert.ok(Math.min(...(await colors(page,".more-menu")).rgb)>180,policy);}
    const disabled=await colors(page,'#lyricsUseCandidateButton');assert.equal(disabled.color,'rgb(101, 107, 119)');assert.ok(Math.min(...disabled.rgb)>180);
    for(const id of ['searchInput','collectionSearchInput','likedSearchInput','downloadedSearchInput','librarySearchInput','playlistsSearchInput','localMusicSearchInput']){
      const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:dom.nodeId,selector:'#'+id});
      await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:['focus','focus-visible']});
      const field=await page.locator('#'+id).evaluate(e=>({outline:getComputedStyle(e).outlineStyle,bg:getComputedStyle(e).backgroundColor}));
      assert.equal(field.outline,'none',id);assert.equal(field.bg,'rgba(0, 0, 0, 0)',id);
    }
    await page.evaluate(()=>{document.documentElement.classList.remove('apt-low-power');document.body.classList.remove('workspace-dragging');document.body.dataset.reduceTransparency='false';document.querySelectorAll('.view').forEach(el=>el.classList.add('hidden'));document.querySelector('#settingsView').classList.remove('hidden');});
    await page.screenshot({path:path.join(os.tmpdir(),"auralane-light-settings-audit.png")});
    await cdp.detach();
  }finally{await browser.close();}
});

test("auxiliary windows receive light/dark updates without changing text, timing or dimensions",async()=>{
  const browser=await chromium.launch({executablePath,headless:true});
  try{
    const mini=await browser.newPage({viewport:{width:480,height:180}});await documentFixture(mini,"mini.html");
    await mini.evaluate(()=>{window.metro={onMiniPlayerState:fn=>{window.pushMini=fn;},onMiniPlayerWindowState:()=>{},miniPlayerReady:async()=>({})};});await mini.addScriptTag({path:path.join(root,"mini.js")});
    const payload={colorScheme:"light",themeColor:[10,90,150],readableThemeColor:[10,80,130],track:{id:"song",title:"Original song",artist:"Artist"},duration:120,currentTime:30,playing:false,canSeek:true,volume:.6};
    await mini.evaluate(payload=>pushMini(payload),payload);
    const rect=await mini.locator(".mini-shell").boundingBox();assert.ok(Math.min(...(await colors(mini,".mini-shell")).rgb)>180);assert.ok(Math.min(...(await colors(mini,".mini-volume-popover")).rgb)>180);
    await mini.locator('#volumeButton').hover();assert.notEqual((await colors(mini,'#volumeButton')).color,'rgb(255, 255, 255)');
    await mini.evaluate(payload=>pushMini({...payload,colorScheme:"dark"}),payload);assert.ok(Math.max(...(await colors(mini,".mini-shell")).rgb)<100);assert.deepEqual(await mini.locator(".mini-shell").boundingBox(),rect);assert.equal(await mini.locator("#miniTitle").textContent(),"Original song");
    const lyrics=await browser.newPage({viewport:{width:800,height:108}});await documentFixture(lyrics,"lyrics.html");
    await lyrics.evaluate(()=>{window.metro={onLyricUpdate:fn=>{window.pushLyrics=fn;}};});await lyrics.addScriptTag({path:path.join(root,"lyrics.js")});
    const line={trackId:"one",trackTitle:"Original song",currentLine:"Original lyrics",themeColor:"#eaf8ff",playing:false,position:0,lines:[{key:"line",time:0,text:"Original lyrics",words:[]}],settings:{colorScheme:"light",opacity:65,font:"system"}};
    await lyrics.evaluate(line=>pushLyrics(line),line);assert.ok(Math.min(...(await colors(lyrics,".lyrics-container")).rgb)>180);assert.equal(await lyrics.locator("#currentLine").textContent(),"Original lyrics");
    const accent=await lyrics.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--lyrics-accent-rgb').split(',').map(Number));assert.ok(Math.max(...accent)<140,`light accent must stay readable: ${accent}`);
    await lyrics.evaluate(line=>pushLyrics({...line,settings:{...line.settings,colorScheme:"dark"}}),line);assert.ok(Math.max(...(await colors(lyrics,".lyrics-container")).rgb)<130);assert.equal(await lyrics.locator("#currentLine").textContent(),"Original lyrics");
    await lyrics.screenshot({path:path.join(os.tmpdir(),"auralane-lyrics-theme-audit.png")});
    const tray=await browser.newPage({viewport:{width:340,height:400}});await documentFixture(tray,"tray.html");await tray.evaluate(()=>{window.metro={onTrayState:fn=>{window.pushTray=fn;},trayReady:async()=>({})};});await tray.addScriptTag({path:path.join(root,"tray.js")});await tray.evaluate(payload=>pushTray(payload),payload);assert.ok(Math.min(...(await colors(tray,".tray-player")).rgb)>180);
  }finally{await browser.close();}
});

test("new light-theme sheets do not change any dark-mode surfaces",async()=>{
  const browser=await chromium.launch({executablePath,headless:true});
  try{const page=await browser.newPage();await documentFixture(page,"index.html",{skipLight:true});await page.evaluate(()=>{document.documentElement.dataset.colorScheme='dark';document.body.dataset.material='glass';});const selectors=['.more-menu','.playlist-modal','.sidebar-collapse','.sleep-menu','.artist-hero'];const before=await Promise.all(selectors.map(selector=>colors(page,selector)));await page.addStyleTag({path:path.join(root,'lightTheme.css')});const after=await Promise.all(selectors.map(selector=>colors(page,selector)));assert.deepEqual(after,before);}finally{await browser.close();}
});
