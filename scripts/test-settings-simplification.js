"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),path=require("node:path");
test("service connections use dialogs, clear secrets, and sources do not expose an always-open form",async()=>{
  const {chromium}=require("playwright-core"),root=path.join(__dirname,"../src/renderer");
  const browser=await chromium.launch({channel:"msedge",headless:true});
  try{
    const page=await browser.newPage({viewport:{width:900,height:850}}),errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    await page.route("http://localhost/fixture",route=>route.fulfill({contentType:"text/html",body:'<main id="services"></main><main id="sources"></main>'}));
    await page.goto("http://localhost/fixture");
    for(const name of ["musicWorkspace.css","integrationTools.css","sourceTools.css"])await page.addStyleTag({path:path.join(root,name)});
    for(const name of ["integrationTools.js","sourceTools.js"])await page.addScriptTag({path:path.join(root,name)});
    await page.evaluate(()=>{
      window.language="en";window.serviceStatus={lastfm:{},listenbrainz:{},discord:{},spotify:{},outbox:0};window.opened=null;
      window.services=IntegrationTools.mount(document.querySelector("#services"),{compact:true,language:()=>language,api:{
        status:async()=>serviceStatus,configure:async()=>{serviceStatus.lastfm.configured=true;},
        beginLastFmLogin:async()=>({url:"https://www.last.fm/api/auth/?token=test"}),
        completeLastFmLogin:async()=>{serviceStatus.lastfm.username="Listener";},disconnect:async()=>{},retryOutbox:async()=>{},
        connectListenBrainz:async()=>{throw new Error("Invalid token");},connectDiscord:async()=>{}
      },openExternal:async url=>{opened=url;}});
      window.sources=AuralaneSourceTools.createSourceTools(document.querySelector("#sources"),{simple:true,listSources:async()=>[],upsertSource:async()=>{},removeSource:async()=>{},checkHealth:async()=>{},setSourceHeaders:async()=>{},queryVersions:async()=>[],onSelect:async()=>{}});
    });
    await page.waitForFunction(()=>document.querySelector("#services .workspace-service-status").textContent==="Disconnected");
    assert.equal(await page.locator("#services input:visible").count(),0);
    const last=page.locator("#services .workspace-service").first();
    await last.getByRole("button",{name:"Connect",exact:true}).click();
    const editor=page.locator(".integration-editor[open]");
    await editor.locator('input[name=lastfmKey]').fill("private-key");await editor.locator('input[name=lastfmSecret]').fill("private-secret");
    await editor.getByRole("button",{name:"Connect Last.fm",exact:true}).click();
    await page.waitForFunction(()=>opened?.startsWith("https://www.last.fm/api/auth/"));
    await page.waitForFunction(()=>!document.querySelector(".integration-editor[open]"));
    assert.equal(await page.locator('input[name=lastfmSecret]').inputValue(),"");
    await last.getByRole("button",{name:"Confirm Authorization",exact:true}).click();
    await page.waitForFunction(()=>serviceStatus.lastfm.username==="Listener");
    await page.waitForFunction(()=>document.querySelector("#services .workspace-service-status").textContent==="Listener");
    assert.equal(await last.getByRole("button",{name:"Connect",exact:true}).isVisible(),false);
    await page.locator("#services .workspace-service").nth(1).getByRole("button",{name:"Connect",exact:true}).click();
    await editor.locator('input[name=listenToken]').fill("private-token");
    await editor.getByRole("button",{name:"Validate and Connect",exact:true}).click();
    await editor.getByRole("status").filter({hasText:"Invalid token"}).waitFor();
    await page.keyboard.press("Escape");assert.equal(await page.locator('input[name=listenToken]').inputValue(),"");
    await page.evaluate(async()=>{language="zh-TW";await services.refresh();});
    assert.equal(await page.locator("#services .workspace-service").nth(1).getByRole("button",{name:"連線",exact:true}).count(),1);
    assert.equal(await page.locator("#sources input:visible").count(),0);
    await page.locator("#sources").getByRole("button",{name:"Add source",exact:true}).click();
    assert.equal(await page.locator(".source-editor[open]").count(),1);
    await page.setViewportSize({width:390,height:850});
    const bounds=await page.locator(".source-editor").evaluate(el=>({scroll:el.scrollWidth,width:el.clientWidth}));assert.ok(bounds.scroll<=bounds.width+1);
    await page.keyboard.press("Escape");assert.deepEqual(errors,[]);
    await page.evaluate(()=>{services.destroy();sources.destroy();});
  }finally{await browser.close();}
});
