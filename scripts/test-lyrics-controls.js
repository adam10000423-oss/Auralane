"use strict";
const {test}=require("node:test"), assert=require("node:assert/strict"), fs=require("node:fs"), vm=require("node:vm"), path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"../src/renderer/app.js"),"utf8");
function declaration(name){
  const start=source.indexOf(`function ${name}(`);
  assert.ok(start>=0,name);
  const rest=source.slice(start), end=rest.slice(1).search(/\n(?:async )?function /);
  return end<0?rest:rest.slice(0,end+1);
}
test("changing lyric versions preserves original word timing and singer roles",()=>{
  const scope={state:{currentTrack:{title:"Test"}},lyricsResultToEditableText:c=>c.rawLyrics,parseLocalLyricsText:()=>{throw new Error("Unexpected reparse");},lyricsSearchArtistFromTrack:()=>"Artist"};
  vm.createContext(scope);vm.runInContext(declaration("lyricsCandidateToResult"),scope);
  const candidate={rawLyrics:"[00:01]Hi",lines:[{time:1,text:"Hi",agent:"v2",end:2.5,words:[{start:1.2,end:2.5,text:"Hi"}]}]};
  const result=scope.lyricsCandidateToResult(candidate);
  assert.equal(result.lines,candidate.lines);assert.equal(result.lines[0].agent,"v2");assert.equal(result.lines[0].words[0].end,2.5);
});
test("rapid up/down follows picker order without jumping back to the first source",()=>{
  const versions=[0,1,2].map(i=>({providerKey:`p${i}`,sourceId:`id${i}`,lines:[{time:i,text:`Line ${i}`}]}));
  const scope={state:{lyrics:versions[0]},lyricsVersionsForSwitcher:()=>versions,lyricsContentKey:c=>`${c.providerKey}/${c.sourceId}`,els:{},requestAnimationFrame:fn=>fn()};
  scope.applyLyricsVersionSelection=v=>{scope.state.lyrics={...v,lines:v.lines.map(l=>({...l,end:99}))};};
  vm.createContext(scope);vm.runInContext(declaration("switchLyricsVersionByDirection"),scope);
  for(const expected of [1,2,2]){scope.switchLyricsVersionByDirection(1);assert.equal(scope.state.lyrics.sourceId,`id${expected}`);}
  scope.switchLyricsVersionByDirection(-1);assert.equal(scope.state.lyrics.sourceId,"id1");
});
test("queue clear cancellation leaves queue and playback untouched",async()=>{
  const queue=[{id:"song"}], scope={state:{queue,settings:{language:"en"}},queueMutationBlocked:()=>false,window:{confirm:()=>false}};
  vm.createContext(scope);vm.runInContext("async "+declaration("clearQueue"),scope);
  await scope.clearQueue();assert.equal(scope.state.queue,queue);
});
test("provider searches follow saved flags even when a hidden checkbox is stale",()=>{
  const scope={state:{settings:{lyricsSearchProviders:{netease:true,musixmatch:false}}},normalizeLyricsSettings:()=>{},normalizeLyricsProviderFlags:v=>v,normalizeLyricsProviderOrder:()=>["netease","musixmatch"]};
  vm.createContext(scope);vm.runInContext(declaration("enabledLyricsSearchProviders"),scope);
  assert.deepEqual(Array.from(scope.enabledLyricsSearchProviders()),["netease"]);
});
