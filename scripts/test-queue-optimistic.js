"use strict";
const { test } = require("node:test"), assert = require("node:assert/strict"), fs = require("node:fs"), vm = require("node:vm");
const source = fs.readFileSync(require("node:path").join(__dirname, "../src/renderer/app.js"), "utf8");
const body = name => source.slice(source.indexOf(`async function ${name}(`), source.indexOf("\nfunction ", source.indexOf(`async function ${name}(`)));
function setup() {
  const frames = [], state = { queue: [{ id:"a" },{ id:"b" },{ id:"c" }], currentTrack:{ id:"b" }, currentIndex:1, queueSource:{title:"Queue"} };
  let resolve, reject;
  const saving = new Promise((a,b)=>{resolve=a;reject=b;});
  const scope = { state, frames, owner:"a", queueMutationBlocked:()=>false, captureQueueBackup:()=>{}, uniqueTracks: v=>v,
    accountStorageId:()=>scope.owner, renderQueue:()=>frames.push(state.queue.map(t=>t.id).join(",")), renderNow:()=>{}, persistQueue:()=>saving, toast:()=>{} };
  vm.createContext(scope); vm.runInContext(body("setQueue") + "\n" + body("reorderQueueItem"),scope);
  return { scope,state,frames,resolve,reject };
}
test("dropping reorders the rendered queue before persistence resolves, without old-position frame",async()=>{
  const f=setup(), pending=f.scope.reorderQueueItem(0,3);
  assert.deepEqual(f.frames,["b,c,a"]); assert.equal(f.state.currentIndex,0);
  f.resolve(); await pending; assert.deepEqual(f.frames,["b,c,a"]);
});
test("failed persistence rolls back, but never overwrites a newer queue or another account",async()=>{
  const f=setup(), pending=f.scope.reorderQueueItem(0,3); f.reject(new Error("disk")); await assert.rejects(pending,/disk/); assert.deepEqual(f.frames,["b,c,a","a,b,c"]);
  const g=setup(), newer=g.scope.reorderQueueItem(0,3); g.state.queue=[{id:"new"}];g.scope.owner="b";g.reject(new Error("disk"));await assert.rejects(newer,/disk/);assert.equal(g.state.queue[0].id,"new");
});
