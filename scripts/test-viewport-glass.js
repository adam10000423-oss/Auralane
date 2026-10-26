"use strict";
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),{chromium}=require('playwright-core');
const root=path.join(__dirname,'../src/renderer'),executablePath='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
async function fixture(page){
  const html=await fs.readFile(path.join(root,'index.html'),'utf8');
  const parsed=await page.evaluate(html=>{const doc=new DOMParser().parseFromString(html,'text/html'),styles=[...doc.querySelectorAll('link[rel=stylesheet]')].map(link=>link.getAttribute('href'));doc.querySelectorAll('script,link').forEach(e=>e.remove());return{html:doc.documentElement.outerHTML,styles};},html);
  await page.setContent(parsed.html);for(const file of parsed.styles)await page.addStyleTag({path:path.join(root,file)});
}
test('the shell fills exactly below the titlebar and inner scrolling cannot move the desktop or expose a bottom gap',async()=>{
  const browser=await chromium.launch({executablePath,headless:true});
  try{
    const page=await browser.newPage();await fixture(page);
    await page.evaluate(()=>{document.querySelectorAll('.view').forEach(e=>e.classList.add('hidden'));document.querySelector('#settingsView').classList.remove('hidden');const target=document.createElement('button');target.id='bottom-target';target.textContent='Bottom';target.style.marginTop='2200px';document.querySelector('#settingsView').append(target);});
    for(const viewport of [{width:1536,height:816},{width:1280,height:720},{width:980,height:650}]){
      await page.setViewportSize(viewport);
      for(const material of ['standard','glass'])for(const scheme of ['light','dark'])for(const media of [false,true]){
        const result=await page.evaluate(({material,scheme,media})=>{
          document.body.dataset.material=material;document.documentElement.dataset.colorScheme=scheme;document.body.classList.toggle('has-media-background',media);
          document.querySelector('#bottom-target').scrollIntoView({block:'center'});window.scrollTo(0,1000);
          const shell=document.querySelector('.shell').getBoundingClientRect();return{scroll:scrollY,top:shell.top,bottom:shell.bottom,document:document.documentElement.scrollHeight,height:innerHeight,innerScroll:document.querySelector('.main').scrollTop};
        },{material,scheme,media});
        assert.equal(result.scroll,0);assert.ok(Math.abs(result.top-34)<1);assert.ok(Math.abs(result.bottom-result.height)<1);assert.ok(result.document<=result.height+1);assert.ok(result.innerScroll>0);
      }
    }
  }finally{await browser.close();}
});
test('glass transparency previews instantly, persists, includes Settings, and does not alter standard or fullscreen surfaces',async()=>{
  const browser=await chromium.launch({executablePath,headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900}});await fixture(page);
    for(const name of ['musicWorkspace.js','workspaceAppearance.js'])await page.addScriptTag({path:path.join(root,name)});
    await page.evaluate(()=>{
      document.documentElement.dataset.colorScheme='light';document.body.classList.add('has-media-background');
      window.state={settings:{language:'zh-TW',material:'glass'}};window.saved=[];
      window.appearance=AuralaneWorkspaceAppearance.init({state,save:()=>saved.push({...state.settings})});appearance.show('appearance');
      document.querySelectorAll('.view').forEach(e=>e.classList.add('hidden'));document.querySelector('#settingsView').classList.remove('hidden');
      window.surfaceAlpha=selector=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');ctx.fillStyle=getComputedStyle(document.querySelector(selector)).backgroundColor;ctx.fillRect(0,0,1,1);return ctx.getImageData(0,0,1,1).data[3]/255;};
      window.setTransparency=value=>{const input=document.querySelector('#settingsGlassTransparency');input.value=String(value);input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));};
      const row=document.createElement('div');row.className='row';row.id='opacity-song';row.innerHTML='<span>Song title</span><button>Play</button>';document.querySelector('[data-workspace-category=appearance]').append(row);
    });
    const panel='.settings-card[data-workspace-category=appearance]';
    await page.evaluate(()=>setTransparency(15));const solid=await page.evaluate(selector=>surfaceAlpha(selector),panel);
    await page.evaluate(()=>setTransparency(75));const transparent=await page.evaluate(selector=>surfaceAlpha(selector),panel);
    assert.ok(solid>.8);assert.ok(transparent<.3);assert.ok(Math.abs(await page.evaluate(()=>surfaceAlpha('.settings-category-nav'))-transparent)<.02);assert.equal(await page.evaluate(()=>saved.at(-1).glassTransparency),75);
    assert.ok(Math.abs(await page.evaluate(()=>surfaceAlpha('#opacity-song'))-transparent)<.02);
    assert.equal(await page.locator('#opacity-song span').evaluate(e=>getComputedStyle(e).opacity),'1');
    await page.locator('#opacity-song').evaluate(e=>e.classList.add('active'));const activeAlpha=await page.evaluate(()=>surfaceAlpha('#opacity-song'));assert.ok(activeAlpha<.4);await page.evaluate(()=>setTransparency(15));await page.waitForFunction(alpha=>surfaceAlpha('#opacity-song')>alpha+.3,activeAlpha);
    await page.evaluate(()=>{state.settings.material='standard';appearance.refresh();});
    assert.equal(await page.locator('#settingsGlassTransparency').isDisabled(),true);
    const before=await page.locator(panel).evaluate(e=>getComputedStyle(e).backgroundColor);await page.evaluate(()=>setTransparency(10));assert.equal(await page.locator(panel).evaluate(e=>getComputedStyle(e).backgroundColor),before);
    await page.evaluate(()=>{state.settings.material='glass';appearance.refresh();document.body.classList.add('lyrics-maximized');});
    const fullscreen=await page.locator('#rightPanel').evaluate(e=>getComputedStyle(e).backgroundColor);await page.evaluate(()=>setTransparency(75));assert.equal(await page.locator('#rightPanel').evaluate(e=>getComputedStyle(e).backgroundColor),fullscreen);
    const {normalize}=require('../src/main/workspacePreferences');assert.equal(normalize({glassTransparency:120}).glassTransparency,75);assert.equal(normalize({glassTransparency:NaN}).glassTransparency,undefined);assert.equal(normalize({glassTransparency:45,reduceTransparency:true}).reduceTransparency,true);
  }finally{await browser.close();}
});

test('clear buttons remain centered, scrollbars are transient, and fullscreen retains the selected background',async()=>{
  const browser=await chromium.launch({executablePath,headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900}});await fixture(page);await page.addScriptTag({path:path.join(root,'workspacePolish.js')});await page.addScriptTag({path:path.join(root,'interactionPolish.js')});
    await page.evaluate(()=>{document.documentElement.dataset.colorScheme='dark';document.body.dataset.material='glass';AuralaneWorkspacePolish.init({state:{settings:{}},applyScheme:()=>{},save:()=>{},refreshLikes:()=>{},expand:()=>{},setIconButton:(b)=>{b.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 6 18 18M18 6 6 18"/></svg>';}});const input=document.querySelector('#searchInput');input.value='search';input.dispatchEvent(new Event('input'));});
    const geometry=await page.locator('#searchInput').evaluate(input=>{const b=input.parentElement.querySelector('.input-clear'),r=b.getBoundingClientRect(),i=input.getBoundingClientRect();return{width:r.width,height:r.height,center:Math.abs(r.y+r.height/2-i.y-i.height/2),right:r.right<=i.right};});
    assert.equal(geometry.width,26);assert.equal(geometry.height,26);assert.ok(geometry.center<1);assert.equal(geometry.right,true);
    await page.evaluate(()=>document.querySelector('.main').dispatchEvent(new Event('scroll')));assert.equal(await page.locator('.main').evaluate(e=>e.classList.contains('scrollbar-active')),true);await page.waitForFunction(()=>!document.querySelector('.main').classList.contains('scrollbar-active'));
    await page.evaluate(()=>document.body.classList.add('has-media-background','lyrics-maximized','lyrics-custom-backdrop'));
    assert.equal(await page.locator('#mediaBackground').evaluate(e=>getComputedStyle(e).visibility),'visible');assert.equal(await page.locator('#rightPanel').evaluate(e=>getComputedStyle(e).scrollbarWidth),'none');assert.equal(await page.locator('#homeChips').evaluate(e=>getComputedStyle(e).scrollbarWidth),'none');
  }finally{await browser.close();}
});

test('fullscreen custom media is an explicit choice and removing it restores Theme without changing the main background',async()=>{
  const browser=await chromium.launch({executablePath,headless:true});
  try{
    const page=await browser.newPage();await fixture(page);
    const app=await fs.readFile(path.join(root,'app.js'),'utf8'),begin=app.indexOf('function updateExpandedLyricsBackdrop('),end=app.indexOf('\nfunction setLyricsExpanded(',begin);
    await page.evaluate(source=>{
      window.media={video:true,artworkUrl:'https://media.test/background.mp4'};window.state={settings:{lyricsFullscreenBackground:'theme'},currentTrack:{id:'song'},performanceTools:{getSettings:()=>media}};
      window.els={lyricsQuickBackground:document.querySelector('#lyricsQuickBackground')};window.thumbnailBackground=()=>'';
      document.documentElement.dataset.colorScheme='dark';document.body.classList.add('has-media-background','lyrics-maximized');
      window.eval(source);updateExpandedLyricsBackdrop();
    },app.slice(begin,end));
    assert.equal(await page.locator('option[value=custom]').evaluate(e=>e.hidden),false);assert.equal(await page.locator('#mediaBackground').evaluate(e=>getComputedStyle(e).visibility),'hidden');
    await page.evaluate(()=>{state.settings.lyricsFullscreenBackground='custom';updateExpandedLyricsBackdrop();});
    assert.equal(await page.locator('#mediaBackground').evaluate(e=>getComputedStyle(e).visibility),'visible');
    await page.evaluate(()=>{state.settings.lyricsFullscreenBackground='theme';updateExpandedLyricsBackdrop();});assert.equal(await page.locator('#mediaBackground').evaluate(e=>getComputedStyle(e).visibility),'hidden');assert.equal(await page.evaluate(()=>media.video),true);
    await page.evaluate(()=>{state.settings.lyricsFullscreenBackground='custom';media.artworkUrl='';updateExpandedLyricsBackdrop();});
    assert.equal(await page.locator('option[value=custom]').evaluate(e=>e.hidden),true);assert.equal(await page.locator('#lyricsQuickBackground').inputValue(),'theme');
    assert.equal(require('../src/main/workspacePreferences').normalize({lyricsFullscreenBackground:'custom'}).lyricsFullscreenBackground,'custom');
  }finally{await browser.close();}
});
