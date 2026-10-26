"use strict";
const PROVIDERS=["netease","musixmatch","betterlyrics","lrclib","kugou","paxsenix","lyricsplus","lyrics-ovh","youtube-transcript","lrc-red","binilyrics","unison","betterlyrics-portato","genius"];
function accountId(account={},signedIn=false){
  const normalized=String(account?.email||account?.channelHandle||account?.name||(signedIn?"signed-in":"guest")).toLowerCase();
  const ascii=normalized.replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48);
  if(ascii)return ascii;
  const unicode=[...normalized].map(c=>c.codePointAt(0).toString(36)).join("-").slice(0,48);
  return unicode?`id-${unicode}`:"guest";
}
function normalize(value={}){
  return {material:value.material==="glass"?"glass":"standard",smartQueue:value.smartQueue!==false,
    ...(value.lyricColors&&typeof value.lyricColors==="object"?{lyricColors:require("../renderer/lyricColors").normalize(value.lyricColors)}:{}),
    reduceTransparency:value.reduceTransparency===true,
    ...(["song","theme","plain","custom"].includes(value.lyricsFullscreenBackground)?{lyricsFullscreenBackground:value.lyricsFullscreenBackground}:{}),
    ...(typeof value.glassTransparency==="number"&&Number.isFinite(value.glassTransparency)?{glassTransparency:Math.max(0,Math.min(75,Math.round(value.glassTransparency)))}:{}),
    ...(typeof value.volume==="number"&&Number.isFinite(value.volume)?{volume:Math.max(0,Math.min(1,value.volume))}:{}),
    ...(["light","dark","system"].includes(value.colorScheme)?{colorScheme:value.colorScheme}:{}),
    ...(typeof value.themeMode==="string"&&/^[a-z-]{1,20}$/.test(value.themeMode)?{themeMode:value.themeMode}:{}),
    ...(typeof value.language==="string"&&/^[a-z]{2,3}(?:-[A-Za-z]{2,4})?$/.test(value.language)?{language:value.language}:{}),
    ...(typeof value.lyricsTranslateTarget==="string"&&/^[a-z]{2,3}(?:-[A-Za-z]{2,4})?$/.test(value.lyricsTranslateTarget)?{lyricsTranslateTarget:value.lyricsTranslateTarget}:{}),
    lyricsProviderControlsVersion:2,smartQueueControlsVersion:1,
    ...(value.performance&&typeof value.performance==="object"?{performance:normalizePerformance(value.performance)}:{}),
    lyricsSearchProviders:Object.fromEntries(PROVIDERS.map(key=>[key,value.lyricsSearchProviders?.[key]!==false]))};
}
function normalizePerformance(value){
  let url=String(value.artworkUrl||"").slice(0,4096);
  if(!/^\/artwork-video\/[a-f0-9-]{36}$/.test(url)){try{const parsed=new URL(url);if(parsed.protocol!=="https:"||parsed.username||parsed.password)url="";}catch{url="";}}
  return {lowPower:value.lowPower===true,reducedMotion:value.reducedMotion===true,analysis:false,adaptive:false,video:value.video===true,artworkUrl:url,artworkName:String(value.artworkName||"").slice(0,200)};
}
function read(state){
  const key=accountId(state.account,Boolean(state.account||state.cookie));
  const value=state.preferences?.workspaceProfiles?.[key];
  return {workspaceAccount:key,workspace:value?normalize(value):null};
}
function save(state,payload){
  const {workspaceAccount:key}=read(state);
  if(payload.account!==key)throw new Error("Account changed.");
  if(!payload.value||typeof payload.value!=="object"||Array.isArray(payload.value))throw new Error("Invalid workspace preferences.");
  const profiles={...state.preferences?.workspaceProfiles,[key]:normalize(payload.value)};
  const keys=Object.keys(profiles);for(const old of keys.slice(0,Math.max(0,keys.length-200)))if(old!==key)delete profiles[old];
  state.preferences={...state.preferences,workspaceProfiles:profiles};
  return read(state);
}
module.exports={accountId,normalize,read,save};
