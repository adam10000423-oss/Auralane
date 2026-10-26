"use strict";
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/renderer/app.js'),'utf8');
function declaration(name){const start=source.search(new RegExp(`(?:async )?function ${name}\\(`)),tail=source.slice(start),end=tail.slice(1).search(/\n(?:async )?function /);return tail.slice(0,end+1);}
test('Windows device aliases do not duplicate the same physical headset',()=>{
  const scope={state:{audioOutputDevices:[]}};vm.createContext(scope);for(const name of ['normalizeAudioOutputDeviceId','normalizedAudioOutputDevices'])vm.runInContext(declaration(name),scope);
  const list=scope.normalizedAudioOutputDevices([{deviceId:'default',groupId:'headset',label:'Default - Headset'},{deviceId:'communications',groupId:'headset',label:'Communications - Headset'},{deviceId:'real',groupId:'headset',label:'Headset'},{deviceId:'speaker',groupId:'speaker',label:'Speakers'}]);
  assert.deepEqual(Array.from(list,d=>d.deviceId),['default','real','speaker']);assert.equal(list[0].label,'');
});
test('WebAudio routes through its context; failure never saves a false selected device',async()=>{
  const calls=[],scope={state:{settings:{},audioOutputDeviceId:'default'},els:{audio:{setSinkId:()=>{throw new Error('MediaElementSource cannot switch');}}},normalizeAudioOutputDeviceId:x=>x,audioOutputSwitchSupported:()=>true,safeAudioContext:()=>({setSinkId:async id=>calls.push(id)}),saveAppearanceSettings:()=>{},renderAudioOutputControl:()=>{},syncMiniPlayerSoon:()=>{},toast:()=>{},currentAudioOutputLabel:x=>x};
  vm.createContext(scope);vm.runInContext(declaration('applyAudioOutputDevice'),scope);
  assert.equal(await scope.applyAudioOutputDevice('headset',{silent:true}),true);assert.deepEqual(calls,['headset']);assert.equal(scope.state.audioOutputDeviceId,'headset');
  scope.safeAudioContext=()=>({setSinkId:async()=>{throw new Error('Device removed');}});
  assert.equal(await scope.applyAudioOutputDevice('removed',{silent:true}),false);assert.equal(scope.state.audioOutputDeviceId,'headset');assert.equal(scope.state.audioOutputError,'Device removed');
  let media='';scope.safeAudioContext=()=>null;scope.els.audio.setSinkId=async id=>{media=id;};assert.equal(await scope.applyAudioOutputDevice('direct',{silent:true}),true);assert.equal(media,'direct');
});
