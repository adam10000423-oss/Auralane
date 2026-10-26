"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const model=require("../src/renderer/autoplayModel"),prefs=require("../src/main/workspacePreferences");
const source=fs.readFileSync(path.join(__dirname,"../src/renderer/app.js"),"utf8");
function declaration(name){const start=source.indexOf(`function ${name}(`);const rest=source.slice(start),end=rest.slice(1).search(/\n(?:async )?function /);return rest.slice(0,end+1);}
const seed={id:"aaaaaaaaaaa",title:"Seed",artist:"Artist"};
function fixture(){
  let finish;const response=new Promise(resolve=>{finish=resolve;});
  const scope={state:{settings:{smartQueue:true},queue:[seed],queueSource:{type:"playlist",continuations:[]},currentTrack:seed,repeatMode:"off",playbackFailedIds:new Set(),shuffleEnabled:false},owner:"a",window:{AuralaneAutoplayModel:model,metro:{queue:()=>response}},setTimeout,clearTimeout,console,uniqueTracks:v=>v,tracksFromResult:r=>r.tracks,renderQueue:()=>{},persistQueue:async()=>{}};
  scope.accountStorageId=()=>scope.owner;scope.nextQueueIndex=()=>scope.state.queue.length>1?1:-1;
  scope.currentQueueIndex=()=>scope.state.queue.findIndex(t=>t.id===scope.state.currentTrack.id);scope.scheduleSmartQueue=()=>{};
  vm.createContext(scope);vm.runInContext(declaration("canAppendSmartQueue")+"\nlet smartQueueRequest=null,smartQueueCooldown=0;const smartQueueHistory=new Set(),smartQueuePool=new Map();\nasync "+declaration("appendSmartQueueFromTrack"),scope);
  return {scope,finish};
}
test("recommendations exclude existing recordings, prefer audio, cap artists and append at most ten",()=>{
  const input=[{id:"bbbbbbbbbbb",title:"Seed (Official Video)",artist:"Artist"},...Array.from({length:30},(_,i)=>({id:`${i}`.padStart(11,"0"),title:`Song ${i}`,artist:`Artist ${i%8}`}))];
  const tracks=model.select([seed],input,seed);assert.equal(tracks.length,10);assert.ok(!tracks.some(t=>t.title.startsWith("Seed")));assert.ok(tracks.every(t=>t.autoplay));
  const counts={};tracks.forEach(t=>counts[t.artist]=(counts[t.artist]||0)+1);assert.ok(Object.values(counts).every(n=>n<=2));
  assert.equal(model.select([],[{id:"bbbbbbbbbbb",title:"Video",isVideo:true},{id:"ccccccccccc",title:"Audio"}],seed)[0].title,"Audio");
});
test("autoplay appends only once concurrently and never re-adds removed recommendations",async()=>{
  const f=fixture(),one=f.scope.appendSmartQueueFromTrack();assert.equal(await f.scope.appendSmartQueueFromTrack(),false);
  f.finish({tracks:[{id:"bbbbbbbbbbb",title:"New",artist:"Other"}]});assert.equal(await one,true);assert.equal(f.scope.state.queue.length,2);assert.equal(f.scope.state.queue[1].autoplay,true);
  assert.equal(await f.scope.appendSmartQueueFromTrack(),false);
});
test("offline, queue lock, repeats, sleep and guests disable radio, but pending pages do not",()=>{
  for(const mutate of [s=>s.settings.smartQueue=false,s=>s.settings.offlineMode=true,s=>s.settings.queueLock=true,s=>s.repeatMode="all",s=>s.repeatMode="one",s=>s.sleepFinishMode="queue",s=>s.onlineTogether={isGuest:()=>true},s=>s.queueSource.type="podcast"]){const f=fixture();mutate(f.scope.state);assert.equal(f.scope.canAppendSmartQueue(),false);}
  const f=fixture();f.scope.state.queueSource.continuations=[{token:"next"}];assert.equal(f.scope.canAppendSmartQueue(),true);
});
test("in-flight recommendations cannot overwrite a changed queue or another account",async()=>{
  for(const mutate of [s=>s.owner="b",s=>s.state.queue=[{id:"ccccccccccc"}],s=>s.state.settings.smartQueue=false]){const f=fixture(),pending=f.scope.appendSmartQueueFromTrack();mutate(f.scope);f.finish({tracks:[{id:"bbbbbbbbbbb",title:"New",artist:"Other"}]});assert.equal(await pending,false);}
});

test("recommendations appear before the original list ends and refill a removed song with a different ID",async()=>{
  const f=fixture();f.scope.state.queue.push({id:"originalxxx",title:"Original"});
  const pending=f.scope.appendSmartQueueFromTrack();f.finish({tracks:Array.from({length:25},(_,i)=>({id:String(i).padStart(11,"0"),title:`Recommendation ${i}`,artist:`Artist ${i}`}))});
  assert.equal(await pending,true);assert.equal(f.scope.state.queue.length,12);const removed=f.scope.state.queue.splice(2,1)[0];
  assert.equal(await f.scope.appendSmartQueueFromTrack(),true);assert.equal(f.scope.state.queue.length,12);assert.ok(!f.scope.state.queue.some(track=>track.id===removed.id));assert.equal(f.scope.state.queue.filter(track=>track.autoplay).length,10);
});
test("duplicate ended callbacks share one recommendation request and play the appended song once",async()=>{
  const f=fixture(),played=[];
  Object.assign(f.scope,{shouldStopAfterCurrentTrack:()=>false,maybeAutoLoadMoreQueue:async()=>{},playQueueIndex:async index=>played.push(index),setPlaybackModeLabel:()=>{},renderNow:()=>{}});
  f.scope.state.playbackRequestId=1;
  vm.runInContext("let playbackEndedWork=null;\n"+declaration("handlePlaybackEnded")+"\nasync "+declaration("advanceAfterPlaybackEnded"),f.scope);
  const first=f.scope.handlePlaybackEnded(),second=f.scope.handlePlaybackEnded();assert.equal(first,second);
  f.finish({tracks:[{id:"bbbbbbbbbbb",title:"New",artist:"Other"}]});
  await first;assert.deepEqual(played,[1]);assert.equal(f.scope.state.queue.length,2);
});
test("workspace preferences survive a disk round-trip and remain account scoped",()=>{
  let state={account:{email:"a@example.com"},preferences:{}};
  prefs.save(state,{account:prefs.read(state).workspaceAccount,value:{material:"glass",smartQueue:false,lyricsSearchProviders:{musixmatch:false},performance:{video:true,artworkUrl:"/artwork-video/12345678-1234-1234-1234-123456789abc",artworkName:"clip.mp4"}}});
  state=JSON.parse(JSON.stringify(state));assert.equal(prefs.read(state).workspace.lyricsSearchProviders.musixmatch,false);assert.equal(prefs.read(state).workspace.material,"glass");assert.equal(prefs.read(state).workspace.smartQueue,false);
  assert.equal(prefs.read(state).workspace.performance.artworkName,"clip.mp4");assert.equal(prefs.read(state).workspace.performance.video,true);
  state.account={email:"b@example.com"};assert.equal(prefs.read(state).workspace,null);
  assert.throws(()=>prefs.save(state,{account:"a-example-com",value:{}}),/Account changed/);
  assert.equal(prefs.normalize().lyricsSearchProviders.musixmatch,true);
  assert.equal(prefs.normalize({material:"evil",lyricsSearchProviders:{unknown:false}}).material,"standard");
});
