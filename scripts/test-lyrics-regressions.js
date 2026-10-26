"use strict";
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../src/renderer/app.js'),'utf8');
function declaration(name){const start=source.search(new RegExp(`(?:async )?function ${name}\\(`)),tail=source.slice(start),end=tail.slice(1).search(/\n(?:async )?function /);return tail.slice(0,end+1);}
test('source picker accepts search results while current lyrics is null',()=>{
  const scope={state:{lyrics:null,lyricsSearchCandidates:[{provider:'Provider',lines:[{time:1,text:'Lyrics'}]}]},els:{lyricsVersionButton:{},lyricsVersionMenu:{}},escapeText:String,candidateQualityLabel:()=>"line synced",parseLocalLyricsText:()=>[]};vm.createContext(scope);
  for(const name of ['lyricsCandidateKey','lyricsContentKey','lyricsVersionsForSwitcher','renderLyricsVersionSwitcher'])vm.runInContext(declaration(name),scope);
  assert.equal(scope.lyricsContentKey(null),'');assert.equal(scope.lyricsCandidateKey(null),'');scope.renderLyricsVersionSwitcher();assert.match(scope.els.lyricsVersionMenu.innerHTML,/Provider/);
});
test('lyric cards export a fresh PNG without drawing cross-origin artwork',async()=>{
  const {chromium}=require('playwright-core'),browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try{
    const page=await browser.newPage();await page.setContent('<div></div>');
    await page.addScriptTag({path:path.join(__dirname,'../src/renderer/lyricsCard.js')});
    for(const layout of ['quote','square','poster']){
      const exported=await page.evaluate(async layout=>{
        const canvas=document.createElement('canvas');
        AuralaneLyricsCard.paint(canvas,{layout,background:'#183d45',color:'#ffffff',title:'Original title',artist:'Artist',lines:['Original lyrics']});
        const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
        return {type:blob.type,size:blob.size,signature:[...new Uint8Array(await blob.arrayBuffer()).slice(0,8)]};
      },layout);
      assert.equal(exported.type,'image/png');assert.ok(exported.size>1000);assert.deepEqual(exported.signature,[137,80,78,71,13,10,26,10]);
    }
    assert.doesNotMatch(fs.readFileSync(path.join(__dirname,'../src/main/main.js'),'utf8'),/appendSwitch\("disable-reading-from-canvas"/);
  }finally{await browser.close();}
});
test('device menu escapes clipped glass panels and provider failures keep readable columns',async()=>{
  const {chromium}=require('playwright-core'),browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:800}});
    await page.setContent('<div class="compact-more-panel" style="position:fixed;right:12px;bottom:60px;width:300px;height:100px;overflow:auto"><div class="audio-output-control"><button id="audioOutputButton">Output</button><div id="audioOutputMenu" class="audio-output-menu hidden"><div>Devices</div><button>Headphones</button><button>Speakers</button></div></div></div><div class="lyrics-provider-state error"><strong>BetterLyrics</strong><span>Unavailable · Provider temporarily unavailable.</span></div>');
    for(const file of ['styles.css','compactPlayer.css','workspacePolish.css','lightTheme.css'])await page.addStyleTag({path:path.join(__dirname,'../src/renderer',file)});
    await page.evaluate(code=>{document.documentElement.dataset.colorScheme='light';window.state={audioOutputMenuOpen:false};window.els={audioOutputMenu:document.querySelector('#audioOutputMenu'),audioOutputButton:document.querySelector('#audioOutputButton')};window.renderAudioOutputControl=()=>{};window.refreshAudioOutputDevices=async()=>{};window.eval(code);},['positionAudioOutputMenu','setAudioOutputMenuOpen'].map(declaration).join('\n'));
    for(const width of [390,1280]){
      await page.setViewportSize({width,height:800});await page.evaluate(()=>setAudioOutputMenuOpen(true));
      const geometry=await page.locator('#audioOutputMenu').evaluate(e=>{const r=e.getBoundingClientRect();return {portal:e.parentElement===document.body,visible:!e.classList.contains('hidden'),inside:r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,covered:!e.contains(document.elementFromPoint(r.x+r.width/2,r.y+20))};});
      assert.deepEqual(geometry,{portal:true,visible:true,inside:true,covered:false});
      await page.locator('.lyrics-provider-state').evaluate(e=>e.style.width='280px');
      const readable=await page.locator('.lyrics-provider-state strong').boundingBox();assert.ok(readable.width>=80);
      assert.equal(await page.locator('.lyrics-provider-state').evaluate(e=>e.getBoundingClientRect().height<120),true);
    }
  }finally{await browser.close();}
});
