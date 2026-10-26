"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {createRelay}=require("./server"),{PERMISSIONS,validateSnapshot}=require("../../src/shared/onlineTogetherProtocol");
const songs=["abcdefghijk","12345678901","lmnopqrstuv"].map((id,i)=>({id,title:`Song ${i}`,artist:"Artist",duration:180}));
async function fixture(){
  const relay=createRelay();await new Promise(resolve=>relay.server.listen(0,"127.0.0.1",resolve));const base=`http://127.0.0.1:${relay.server.address().port}`;
  const request=(route,body,token)=>fetch(base+route,{method:body===undefined?"GET":"POST",headers:{"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
  const host=await(await request('/v1/rooms',{name:'Host',permissions:PERMISSIONS})).json(),route=`/v1/rooms/${host.state.code}`;
  const guest=await(await request(route+'/join',{name:'Guest'})).json();
  const state=async()=>validateSnapshot(await(await request(route+'/state',undefined,host.token)).json());
  const command=async(member,input,seq)=>request(route+'/command',{...input,expectedSeq:seq??(await state()).seq},member.token);
  await command(host,{type:'queue',tracks:songs.slice(0,2)});await command(host,{type:'playback',index:0,playing:false,position:12});
  return {relay,host,guest,state,command};
}
test('default permissions allow append only and never grant arbitrary snapshot replacement',async()=>{
  const f=await fixture();try{
    assert.deepEqual((await f.state()).permissions,PERMISSIONS);
    assert.equal((await f.command(f.guest,{type:'add',tracks:[songs[2]]})).status,200);
    let state=await f.state();assert.deepEqual(state.queue.map(t=>t.id),songs.map(t=>t.id));assert.equal(state.playback.position,12);
    for(const input of [{type:'playPause',playing:true},{type:'seek',position:50},{type:'skip',direction:1},{type:'reorder',trackId:songs[2].id,beforeId:songs[0].id},{type:'remove',trackId:songs[1].id}])assert.equal((await f.command(f.guest,input)).status,403);
    await f.command(f.host,{type:'permissions',permissions:Object.fromEntries(Object.keys(PERMISSIONS).map(k=>[k,true]))});
    for(const input of [{type:'queue',tracks:[]},{type:'playback',index:1,playing:true,position:0},{type:'permissions',permissions:PERMISSIONS}])assert.equal((await f.command(f.guest,input)).status,403);
    assert.equal((await f.command(f.guest,{type:'remove',trackId:songs[0].id})).status,403);
  }finally{await f.relay.close();}
});
test('each permission is independent; revoked and stale operations cannot bypass it',async()=>{
  const f=await fixture();try{
    const none=Object.fromEntries(Object.keys(PERMISSIONS).map(k=>[k,false]));
    await f.command(f.host,{type:'permissions',permissions:{...none,playPause:true}});
    assert.equal((await f.command(f.guest,{type:'playPause',playing:true})).status,200);
    assert.equal((await f.command(f.guest,{type:'select',trackId:songs[1].id})).status,403);
    await f.command(f.host,{type:'permissions',permissions:{...none,seek:true}});
    assert.equal((await f.command(f.guest,{type:'seek',position:50})).status,200);
    assert.equal((await f.command(f.guest,{type:'playPause',playing:false})).status,403);
    await f.command(f.host,{type:'permissions',permissions:{...none,skip:true}});
    assert.equal((await f.command(f.guest,{type:'skip',direction:1})).status,200);
    assert.equal((await f.state()).queue[(await f.state()).playback.index].id,songs[1].id);
    await f.command(f.host,{type:'permissions',permissions:{...none,add:true}});
    assert.equal((await f.command(f.guest,{type:'add',tracks:[songs[2]],next:true})).status,403);
    await f.command(f.host,{type:'permissions',permissions:{...none,add:true,reorder:true}});
    assert.equal((await f.command(f.guest,{type:'add',tracks:[songs[2]],next:true})).status,200);
    const before=await f.state();
    assert.equal((await f.command(f.guest,{type:'reorder',trackId:songs[2].id,beforeId:songs[0].id})).status,200);
    const moved=await f.state();assert.equal(moved.queue[moved.playback.index].id,songs[1].id);
    await f.command(f.host,{type:'permissions',permissions:none});
    assert.equal((await f.command(f.guest,{type:'reorder',trackId:songs[2].id,beforeId:null},before.seq)).status,403);
    await f.command(f.host,{type:'permissions',permissions:{...none,remove:true}});
    assert.equal((await f.command(f.guest,{type:'remove',trackId:songs[0].id})).status,200);
    assert.equal((await f.command(f.guest,{type:'remove',trackId:songs[1].id})).status,403);
  }finally{await f.relay.close();}
});
test('invalid permission schemas and queue metadata tampering are rejected',async()=>{
  const f=await fixture();try{
    for(const permissions of [{...PERMISSIONS,add:'true'},{...PERMISSIONS,admin:true},{}])assert.equal((await f.command(f.host,{type:'permissions',permissions})).status,400);
    assert.equal((await f.command(f.guest,{type:'add',tracks:[{...songs[0],title:'Overwritten',duration:2}]})).status,200);
    const state=await f.state();assert.equal(state.queue[0].title,songs[0].title);assert.equal(state.queue[0].duration,180);
    assert.equal((await f.command(f.guest,{type:'add',tracks:[{...songs[2],id:'file:///private'}]})).status,400);
  }finally{await f.relay.close();}
});
test('old hosts keep rooms read-only and malformed capability snapshots fail closed',async()=>{
  const relay=createRelay();await new Promise(resolve=>relay.server.listen(0,'127.0.0.1',resolve));
  try{
    const base=`http://127.0.0.1:${relay.server.address().port}`;
    const created=await(await fetch(base+'/v1/rooms',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Legacy host'})})).json();
    assert.ok(Object.values(created.state.permissions).every(value=>value===false));
    assert.throws(()=>validateSnapshot({...created.state,permissions:undefined}),error=>error.code==='INVALID_STATE');
    const legacy={...created.state};delete legacy.permissionsVersion;delete legacy.permissions;
    assert.equal(validateSnapshot(legacy).permissionsVersion,undefined);
  }finally{await relay.close();}
});
