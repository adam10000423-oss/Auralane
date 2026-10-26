"use strict";
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createBackgroundCache,youtubeId,MAX_BYTES}=require('../src/main/backgroundCache');
test('background URLs accept only actual YouTube video IDs',()=>{
  assert.equal(youtubeId('https://youtu.be/abcdefghijk'),'abcdefghijk');
  for(const url of ['https://youtube.com.evil/watch?v=abcdefghijk','file:///abc','https://user:pass@youtube.com/watch?v=abcdefghijk','https://youtube.com/playlist?list=abc','https://youtu.be/../secret'])assert.equal(youtubeId(url),null);
});
test('video format selection does not change audio playback, and limits background resolution',async()=>{
  const {InnerTubeClient}=require('../src/main/innertube.legacy'),client=new InnerTubeClient({});
  client.request=async()=>({streamingData:{adaptiveFormats:[{url:'https://a.googlevideo.com/audio',mimeType:'audio/mp4',itag:140},{url:'https://a.googlevideo.com/1080',mimeType:'video/mp4',height:1080},{url:'https://a.googlevideo.com/720',mimeType:'video/mp4',height:720},{url:'https://a.googlevideo.com/360',mimeType:'video/mp4',height:360}]}});
  assert.equal((await client.playback('abcdefghijk')).streamUrl,'https://a.googlevideo.com/audio');
  assert.equal((await client.playback('abcdefghijk',null,'balanced',{videoOnly:true})).streamUrl,'https://a.googlevideo.com/720');
});
test('background downloads deduplicate, validate complete files, reuse offline cache and safely remove managed videos',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'auralane-background-'));let downloads=0,resolves=0;
  const clip=Buffer.alloc(32);clip.write('ftyp',4);const cache=createBackgroundCache({root,resolveVideo:async()=>{resolves++;return{mode:'direct',streamUrl:'https://r1.googlevideo.com/video',mimeType:'video/mp4',contentLength:clip.length};},fetchImpl:async()=>{downloads++;return new Response(clip,{headers:{'content-type':'video/mp4','content-length':String(clip.length)}});}});
  try{const [one,two]=await Promise.all([cache.download('https://youtu.be/abcdefghijk'),cache.download('https://youtu.be/abcdefghijk')]);assert.equal(downloads,1);assert.equal(one.path,two.path);assert.deepEqual(await fs.readFile(one.path),clip);assert.equal((await cache.download('https://youtu.be/abcdefghijk')).cached,true);assert.equal(resolves,1);
    const sentinel=path.join(root,'keep.txt');await fs.writeFile(sentinel,'keep');await cache.remove(sentinel);assert.equal(await fs.readFile(sentinel,'utf8'),'keep');await cache.remove(one.path);await assert.rejects(fs.stat(one.path),{code:'ENOENT'});
  }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('failed or redirected downloads cannot save HTML, partial files, huge files or private-host responses',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'auralane-background-reject-'));
  const cases=[{url:'https://127.0.0.1/private',response:()=>new Response('x')},{url:'https://r.googlevideo.com/video',response:()=>new Response('',{status:302,headers:{location:'http://127.0.0.1/private'}})},{url:'https://r.googlevideo.com/video',response:()=>new Response('<html/>',{headers:{'content-type':'text/html'}})},{url:'https://r.googlevideo.com/video',response:()=>new Response('x',{headers:{'content-type':'video/mp4','content-length':String(MAX_BYTES+1)}})},{url:'https://r.googlevideo.com/video',response:()=>new Response('partial',{headers:{'content-type':'video/mp4'}})}];
  try{for(const fixture of cases){const cache=createBackgroundCache({root,resolveVideo:async()=>({mode:'direct',streamUrl:fixture.url,mimeType:'video/mp4',contentLength:32}),fetchImpl:async()=>fixture.response()});await assert.rejects(cache.download('https://youtu.be/abcdefghijk'));assert.deepEqual(await fs.readdir(root),[]);}}finally{await fs.rm(root,{recursive:true,force:true});}
});
test('large videos download bounded byte ranges and assemble in order with progress',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'auralane-background-ranges-')),clip=Buffer.alloc(2*1024*1024+73,21);clip.write('ftyp',4);const ranges=[],progress=[];
  const cache=createBackgroundCache({root,resolveVideo:async()=>({mode:'direct',streamUrl:'https://r.googlevideo.com/video',mimeType:'video/mp4',contentLength:clip.length}),fetchImpl:async url=>{const [start,end]=new URL(url).searchParams.get('range').split('-').map(Number);ranges.push([start,end]);return new Response(clip.subarray(start,end+1),{status:206,headers:{'content-type':'video/mp4','content-range':`bytes ${start}-${end}/${clip.length}`}});}});
  try{const file=await cache.download('https://youtu.be/abcdefghijk',{onProgress:value=>progress.push(value)});assert.deepEqual(await fs.readFile(file.path),clip);assert.equal(ranges.length,3);assert.ok(ranges.every(([start,end])=>end-start<1024*1024));assert.equal(progress.at(-1).bytes,clip.length);}finally{await fs.rm(root,{recursive:true,force:true});}
});
