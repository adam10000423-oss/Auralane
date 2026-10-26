"use strict";
const { test } = require("node:test"), assert = require("node:assert/strict"), path = require("node:path"), http = require("node:http");
const { chromium } = require("playwright-core");
const root = path.join(__dirname,"../src/renderer");
test("YouTube Replay uses account history without fabricated stats and ignores stale account responses",async()=>{
  const server=http.createServer((_req,res)=>{res.setHeader("Content-Type","text/html");res.end('<!doctype html><meta charset="utf-8">');});
  await new Promise(r=>server.listen(0,"127.0.0.1",r));
  const browser=await chromium.launch({executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",headless:true});
  try {
    const page=await browser.newPage();await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.setContent('<section id="replayView"></section><section id="syncedPlaylistsSection"></section><audio></audio>');
    for(const f of ["styles.css","musicWorkspace.css"])await page.addStyleTag({path:path.join(root,f)});
    for(const f of ["musicWorkspaceModel.js","musicWorkspace.js"])await page.addScriptTag({path:path.join(root,f)});
    await page.evaluate(async()=>{
      window.owner="a";window.fail=false;window.requests=[];window.state={activeView:"replay",settings:{language:"en"}};
      window.workspace=await AuralaneMusicWorkspace.init({state,audio:document.querySelector("audio"),getAccountId:()=>owner,getTracks:()=>[],thumbnail:()=>"",icon:()=>"",toast:()=>{},setIconButton:(b,i,t)=>{b.textContent=i;b.setAttribute("aria-label",t);},playTracks:()=>{},queueTracks:()=>{},signedIn:()=>true,
        youtubeHistory:()=>{requests.push(owner);if(fail)return Promise.reject(new Error("network"));if(owner==="a")return new Promise(r=>window.resolveOld=r);return Promise.resolve({sections:[{title:"Today",tracks:[{id:"b",title:"Actual YouTube history",artist:"OneRepublic"}]}]});}});
    });
    await page.evaluate(async()=>{owner="b";await workspace.account();});
    await page.getByText("Actual YouTube history",{exact:true}).waitFor();
    await page.evaluate(()=>resolveOld({sections:[{title:"Old account",tracks:[{id:"a",title:"Stale song"}]}]}));
    assert.equal(await page.getByText("Stale song").count(),0);assert.equal(await page.locator(".workspace-replay-metrics").count(),0);
    assert.equal(await page.locator('button[aria-pressed="true"]').textContent(),"YouTube Music");
    await page.evaluate(()=>workspace.refresh());assert.deepEqual(await page.evaluate(()=>requests),["a","b"]);
    await page.getByRole("button",{name:"On this device",exact:true}).click();assert.equal(await page.locator(".workspace-replay-metrics").count(),1);
    await page.getByRole("button",{name:"YouTube Music",exact:true}).click();
    await page.evaluate(()=>{fail=true;});await page.getByRole("button",{name:"Refresh",exact:true}).click();await page.getByText("Could not load listening history",{exact:true}).waitFor();
    assert.equal(await page.locator(".workspace-replay-metrics").count(),0);
    await page.evaluate(()=>workspace.destroy());
  }finally{await browser.close();await new Promise(r=>server.close(r));}
});
test("video artwork saves paused previews, enables the feature, reports invalid pages and follows fullscreen target",async()=>{
  const browser=await chromium.launch({executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",headless:true,args:["--autoplay-policy=no-user-gesture-required"]});
  try {
    const page=await browser.newPage(); const transport=[];page.on("requestfailed",r=>transport.push(r.failure()?.errorText));page.on("response",r=>{if(r.url().includes("artwork.test"))transport.push(r.status());});await page.setContent('<div id="settings"></div><div id="cover"></div><audio></audio>');
    await page.addStyleTag({path:path.join(root,"performanceTools.css")});await page.addScriptTag({path:path.join(root,"performanceTools.js")});
    const clip=require("node:child_process").execFileSync("ffmpeg",["-loglevel","error","-f","lavfi","-i","testsrc=size=64x64:rate=12","-t","1","-c:v","libvpx","-f","webm","pipe:1"],{maxBuffer:2*1024*1024});
    await page.route("https://artwork.test/cover.webm",route=>route.fulfill({status:200,contentType:"video/webm",headers:{"Access-Control-Allow-Origin":"*","Content-Length":String(clip.length)},body:Buffer.from(clip)}));
    await page.evaluate(()=>{
      window.expanded=false;window.playing=false;
      window.tools=AuralanePerformanceTools.init({container:document.querySelector("#settings"),audio:document.querySelector("audio"),settings:{video:false},isPlaying:()=>playing,getTrackId:()=>"track",artworkTarget:()=>expanded?document.querySelector("#cover"):null});
    });
    assert.equal(await page.locator(".apt-artwork-form").isVisible(),false);
    assert.equal(await page.evaluate(()=>tools.setArtwork("https://youtube.com/watch?v=x")),false);assert.match(await page.locator(".apt-artwork-status").textContent(),/HTTPS/);
    assert.equal(await page.evaluate(()=>tools.setArtwork("https://artwork.test/cover.webm")),true);
    await page.waitForFunction(()=>document.querySelector("video").readyState>=2,{},{timeout:5000}).catch(async error=>{ throw new Error(error.message+" "+JSON.stringify({clipBytes:clip.length,transport,state:await page.evaluate(()=>{const v=document.querySelector("video");return {ready:v.readyState,network:v.networkState,error:v.error?.message,src:v.currentSrc,hidden:v.hidden,settings:tools.getSettings(),rect:document.querySelector("form").getClientRects().length,status:document.querySelector(".apt-artwork-status").textContent};})})); });
    assert.equal(await page.evaluate(()=>tools.getSettings().video),true);assert.equal(await page.locator("video").isVisible(),true);
    await page.evaluate(()=>{expanded=true;playing=true;tools.refresh();});await page.waitForFunction(()=>document.querySelector("#cover video")&&!document.querySelector("#cover video").paused);
    await page.evaluate(()=>{expanded=false;playing=false;tools.refresh();});assert.equal(await page.locator("#settings video").count(),1);
    await page.evaluate(()=>tools.setArtwork(""));assert.equal(await page.evaluate(()=>tools.getSettings().video),false);assert.equal(await page.locator("video").isVisible(),false);
    await page.evaluate(()=>tools.destroy());
  }finally{await browser.close();}
});
