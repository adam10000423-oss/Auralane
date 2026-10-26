"use strict";
const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
test('new room UI can create through an already-running old main process without unsupported fields',async()=>{
  const {chromium}=require('playwright-core'),browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage();
    await page.setContent('<div id="queuePane"><div class="queue-tools"></div></div><audio></audio>');
    await page.addStyleTag({path:path.join(__dirname,'../src/renderer/onlineTogetherTools.css')});
    await page.addScriptTag({path:path.join(__dirname,'../src/renderer/onlineTogetherTools.js')});
    await page.evaluate(async()=>{
      window.requests=[];
      let legacy={configured:true,enabled:false,connected:false,serverUrl:'https://rooms.example'};
      window.controls=AuralaneOnlineTogether.init({state:{settings:{language:'zh-TW'},queue:[]},audio:document.querySelector('audio'),getAccountId:()=>"compat",getQueue:()=>[],getPosition:()=>0,persistQueue:async()=>{},render:()=>{},stopPlayback:()=>{},playTrack:async()=>true,
        bridge:{featureRequest:async({type,payload})=>{
          requests.push({type,payload});
          if(type==='online.create'){
            if(Object.keys(payload).some(key=>key!=='name'))return {ok:false,error:{code:'INVALID_REQUEST'}};
            legacy={...legacy,enabled:true,host:true,connected:true,code:'ABC234',state:{queue:[],playback:{index:-1,playing:false,anchoredAt:0},members:[],targetPosition:0,startsIn:0}};
          }
          if(type==='online.leave')legacy={...legacy,enabled:false};
          return {ok:true,value:legacy};
        }}
      });await controls.ready;
    });
    await page.locator('.online-room-launcher').click();await page.getByRole('button',{name:'建立房間',exact:true}).click();
    await page.waitForFunction(()=>controls.isActive());
    const sent=await page.evaluate(()=>requests.find(r=>r.type==='online.create').payload);
    assert.deepEqual(Object.keys(sent),['name']);
    await page.locator('.online-room-settings-button').click();
    assert.match(await page.locator('.online-room-permission-status').textContent(),/重新啟動/);
    assert.equal(await page.locator('[data-room-permission="add"]').isDisabled(),true);
    assert.equal(await page.locator('.online-room-status').textContent(),'');
    await page.evaluate(()=>controls.dispose());
  }finally{await browser.close();}
});
