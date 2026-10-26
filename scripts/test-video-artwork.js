"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs/promises"),os=require("node:os"),path=require("node:path"),http=require("node:http");
const {streamFile}=require("../src/main/localMusic"),api=require("../src/renderer/performanceTools");
test("artwork accepts actual YouTube video URL variants, not playlists or impersonating hosts",()=>{
  for(const url of ["https://www.youtube.com/watch?v=dQw4w9WgXcQ","https://youtu.be/dQw4w9WgXcQ?t=30","https://m.youtube.com/shorts/dQw4w9WgXcQ","https://music.youtube.com/watch?v=dQw4w9WgXcQ","https://www.youtube.com/live/dQw4w9WgXcQ","https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"])assert.equal(api.youtubeArtworkId(url),"dQw4w9WgXcQ",url);
  for(const url of ["https://youtube.com/playlist?list=abc","https://youtube.com.evil/watch?v=dQw4w9WgXcQ","javascript:alert(1)","https://user:pass@youtube.com/watch?v=dQw4w9WgXcQ","https://youtu.be/not-an-id"])assert.equal(api.youtubeArtworkId(url),null,url);
  assert.equal(api.validateArtworkUrl("/artwork-video/12345678-1234-1234-1234-123456789abc"),"/artwork-video/12345678-1234-1234-1234-123456789abc");
  assert.equal(api.validateArtworkUrl("/artwork-video/../../secret"),null);assert.equal(api.validateArtworkUrl("file:///C:/secret.mp4"),null);
});
test("local media streaming supports bounded ranges, suffix ranges, HEAD and invalid-range rejection",async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),"auralane-video-test-")),file=path.join(dir,"sample.mp4");await fs.writeFile(file,Buffer.from("0123456789"));
  const server=http.createServer((req,res)=>streamFile(file,req,res,"video/mp4"));await new Promise(r=>server.listen(0,"127.0.0.1",r));const url=`http://127.0.0.1:${server.address().port}/video`;
  try{
    let response=await fetch(url,{headers:{Range:"bytes=2-5"}});assert.equal(response.status,206);assert.equal(response.headers.get("content-type"),"video/mp4");assert.equal(await response.text(),"2345");
    response=await fetch(url,{headers:{Range:"bytes=-3"}});assert.equal(await response.text(),"789");
    response=await fetch(url,{method:"HEAD"});assert.equal(response.headers.get("content-length"),"10");assert.equal((await response.arrayBuffer()).byteLength,0);
    for(const range of ["bytes=50-60","bytes=6-2","bytes=-0","bytes=0-1,4-5","oops"]){response=await fetch(url,{headers:{Range:range}});assert.equal(response.status,416,range);}
  }finally{await new Promise(r=>server.close(r));await fs.rm(dir,{recursive:true,force:true});}
});

test("an image source fills the application background without starting audio or video",async()=>{
  const {chromium}=require("playwright-core"),browser=await chromium.launch({channel:"msedge",headless:true});
  try{const page=await browser.newPage({viewport:{width:1000,height:800}});await page.setContent('<div id="settings"></div><div id="mediaBackground"></div><audio></audio>');
    await page.route('https://background.test/image.png',route=>route.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7V8AAAAASUVORK5CYII=','base64')}));
    for(const name of ['performanceTools.css','workspacePolish.css'])await page.addStyleTag({path:path.join(__dirname,'../src/renderer',name)});await page.addScriptTag({path:path.join(__dirname,'../src/renderer/performanceTools.js')});
    await page.evaluate(()=>{window.tools=AuralanePerformanceTools.init({container:document.querySelector('#settings'),audio:document.querySelector('audio'),background:true,artworkTarget:()=>document.querySelector('#mediaBackground')});tools.setArtwork('https://background.test/image.png');});
    await page.waitForFunction(()=>document.querySelector('#mediaBackground img').naturalWidth===1);assert.equal(await page.locator('#mediaBackground img').isVisible(),true);assert.equal(await page.evaluate(()=>document.querySelector('video').paused),true);assert.equal(await page.evaluate(()=>document.body.classList.contains('has-media-background')),true);
    const rect=await page.locator('#mediaBackground img').boundingBox();assert.equal(rect.width,1000);assert.ok(rect.height>700);await page.evaluate(()=>{tools.setArtwork('');tools.destroy();});assert.equal(await page.locator('#mediaBackground img').count(),0);
  }finally{await browser.close();}
});
test("YouTube backgrounds download once and play local files without any iframe or YouTube player requests",async()=>{
  const {chromium}=require("playwright-core"),root=path.join(__dirname,"../src/renderer");
  const clip=require("node:child_process").execFileSync("ffmpeg",["-loglevel","error","-f","lavfi","-i","testsrc=size=64x64:rate=12","-t","1","-c:v","libvpx","-f","webm","pipe:1"]);
  const server=http.createServer((req,res)=>{if(req.url.startsWith("/artwork-video/")){res.writeHead(200,{"Content-Type":"video/webm"});res.end(clip);}else{res.setHeader("Content-Type","text/html");res.end('<div id="settings"></div><div id="cover" style="width:360px;height:360px"></div><audio></audio>');}});
  await new Promise(r=>server.listen(0,"127.0.0.1",r));const browser=await chromium.launch({channel:"msedge",headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1000,height:900}}),errors=[];page.on("pageerror",e=>errors.push(e.message));
    await page.route("https://www.youtube.com/iframe_api",route=>route.fulfill({contentType:"text/javascript",body:`window.players=[];window.YT={Player:class{constructor(mount,options){this.options=options;this.calls=[];this.frame=document.createElement("iframe");mount.replaceWith(this.frame);players.push(this);setTimeout(()=>options.events.onReady({target:this}),0);}mute(){this.calls.push("mute");}playVideo(){this.calls.push("play");}pauseVideo(){this.calls.push("pause");}stopVideo(){this.calls.push("stop");}destroy(){this.calls.push("destroy");this.frame.remove();}}};window.onYouTubeIframeAPIReady();`}));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.addStyleTag({path:path.join(root,"performanceTools.css")});
    for(const name of ["youtubeArtwork.js","performanceTools.js"])await page.addScriptTag({path:path.join(root,name)});
    const playerRequests=[];page.on('request',request=>{if(/youtube/.test(request.url()))playerRequests.push(request.url());});
    await page.evaluate(()=>{
      window.expanded=false;window.playing=false;window.cleared=0;window.downloads=0;
      window.tools=AuralanePerformanceTools.init({container:document.querySelector("#settings"),audio:document.querySelector("audio"),isPlaying:()=>playing,artworkTarget:()=>expanded?document.querySelector("#cover"):null,downloadVideo:async()=>{downloads++;return{url:"/artwork-video/12345678-1234-1234-1234-123456789abc",name:"download.webm"};},chooseVideo:async()=>({url:"/artwork-video/12345678-1234-1234-1234-123456789abc",name:"sample.webm"}),clearLocalVideo:async()=>{cleared++;}});
      tools.setArtwork("https://youtu.be/dQw4w9WgXcQ");
    });
    await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
    assert.equal(await page.evaluate(()=>downloads),1);
    assert.equal(await page.locator('.apt-artwork-file-name').innerText(),'download.webm');
    await page.evaluate(()=>{expanded=true;playing=true;tools.refresh();});
    await page.waitForFunction(()=>!document.querySelector('#cover video').paused);
    assert.equal(await page.locator("#cover iframe").count(),0);
    await page.evaluate(()=>tools.updateSettings({lowPower:true}));assert.equal(await page.locator("iframe").count(),0);
    await page.evaluate(()=>{expanded=false;playing=false;tools.updateSettings({lowPower:false});});
    await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
    assert.equal(await page.evaluate(()=>downloads),1);assert.deepEqual(playerRequests,[]);
    await page.getByRole("button",{name:"Choose video or image",exact:true}).click();
    await page.waitForFunction(()=>document.querySelector("video").readyState>=2);
    assert.equal(await page.locator(".apt-artwork-file-name").innerText(),"sample.webm");assert.equal(await page.locator("input[type=url]").inputValue(),"");assert.equal(await page.evaluate(()=>document.querySelector("video").muted),true);
    await page.getByRole("button",{name:"Clear",exact:true}).click();assert.equal(await page.evaluate(()=>cleared),1);assert.equal(await page.locator("video").isVisible(),false);assert.equal(await page.evaluate(()=>tools.getSettings().video),false);
    await page.evaluate(()=>tools.destroy());assert.equal(await page.locator("iframe").count(),0);assert.deepEqual(errors,[]);
  }finally{await browser.close();await new Promise(r=>server.close(r));}
});
