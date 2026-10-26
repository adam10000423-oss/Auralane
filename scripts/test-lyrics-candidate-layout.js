"use strict";
const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),os=require('node:os');
const {chromium}=require('playwright-core');
test('lyric candidate title keeps the full width instead of yielding it to provider metadata',async()=>{
  const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1000,height:800}});
    await page.setContent('<div class="lyrics-candidate-list"><button class="lyrics-candidate active"><span><strong>I Lose Myself (Alesso vs OneRepublic)</strong><small>OneRepublic</small></span><em>Musixmatch · word synced · 100% word lines · title match · 27 lines</em><p>Original lyrics preview</p></button></div>');
    for(const file of ['styles.css','workspacePolish.css','lightTheme.css'])await page.addStyleTag({path:path.join(__dirname,'../src/renderer',file)});
    for(const scheme of ['light','dark'])for(const width of [280,400,880]){
      await page.evaluate(({scheme,width})=>{document.documentElement.dataset.colorScheme=scheme;document.querySelector('.lyrics-candidate-list').style.width=width+'px';},{scheme,width});
      const layout=await page.evaluate(()=>{const button=document.querySelector('button'),title=document.querySelector('strong'),source=document.querySelector('em'),b=button.getBoundingClientRect(),t=title.getBoundingClientRect(),s=source.getBoundingClientRect();return {width:b.width,height:b.height,titleWidth:t.width,titleBottom:t.bottom,sourceTop:s.top,overflow:button.scrollWidth>button.clientWidth};});
      assert.ok(layout.titleWidth>=width-30,JSON.stringify(layout));assert.ok(layout.height<230,JSON.stringify(layout));assert.ok(layout.sourceTop>=layout.titleBottom);assert.equal(layout.overflow,false);
    }
    await page.screenshot({path:path.join(os.tmpdir(),'auralane-lyrics-candidate-layout.png')});
  }finally{await browser.close();}
});
