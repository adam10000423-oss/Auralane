"use strict";
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const {createWriteStream}=require('node:fs'),{Readable,Transform}=require('node:stream'),{pipeline}=require('node:stream/promises');
const MAX_BYTES=256*1024*1024;
const CHUNK_BYTES=1024*1024;
function youtubeId(value){
  try{const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password)return null;const host=url.hostname.toLowerCase();let id;
    if(host==='youtu.be')id=url.pathname.split('/')[1];
    else if(['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com','www.youtube-nocookie.com'].includes(host))id=url.pathname==='/watch'?url.searchParams.get('v'):/^\/(?:embed|shorts|live)\/([^/]+)/.exec(url.pathname)?.[1];
    return /^[A-Za-z0-9_-]{11}$/.test(id||'')?id:null;
  }catch{return null;}
}
function allowedMedia(value){try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password&&(!url.port||url.port==='443')&&url.hostname.endsWith('.googlevideo.com');}catch{return false;}}
function createBackgroundCache({root,resolveVideo,fetchImpl=fetch}){
  const pending=new Map();
  async function download(value,{onProgress=()=>{}}={}){
    const id=youtubeId(value);if(!id)throw new Error('Invalid YouTube video URL.');
    if(pending.has(id))return pending.get(id);
    const task=(async()=>{
      await fs.mkdir(root,{recursive:true});
      for(const extension of ['.mp4','.webm']){const file=path.join(root,id+extension);try{const stat=await fs.stat(file);if(stat.isFile()&&stat.size>0&&stat.size<=MAX_BYTES)return {path:file,name:`YouTube ${id}${extension}`,cached:true};}catch{}}
      const video=await resolveVideo(id);
      if(video.mode!=='direct'||!allowedMedia(video.streamUrl)||!/^video\/(mp4|webm)\b/.test(video.mimeType||''))throw new Error('This YouTube video cannot be downloaded as a background.');
      const expected=Number(video.contentLength)||0;if(expected>MAX_BYTES)throw new Error('Background video exceeds 256 MB.');
      const extension=video.mimeType.startsWith('video/mp4')?'.mp4':'.webm',target=path.join(root,id+extension),partial=path.join(root,`${id}.${crypto.randomUUID()}.part`);
      const signal=AbortSignal.timeout(600000);let url=video.streamUrl;
      if(expected>0){const parsed=new URL(url);parsed.searchParams.set('range',`0-${expected-1}`);url=parsed.toString();}
      try{
        if(expected>0){
          const handle=await fs.open(partial,'wx'),controller=new AbortController();let cursor=0,completed=0;
          const joint=AbortSignal.any([signal,controller.signal]);
          async function chunk(start,end){
            let lastError;
            for(let attempt=0;attempt<3;attempt++){
              let response;
              try{
                const parsed=new URL(video.streamUrl);parsed.searchParams.delete('range');
                if(attempt!==1)parsed.searchParams.set('range',`${start}-${end}`);
                let next=parsed.toString();
                const partSignal=AbortSignal.any([joint,AbortSignal.timeout(30000)]);
                for(let redirects=0;redirects<=4;redirects++){
                  if(!allowedMedia(next))throw new Error('Untrusted background media host.');
                  response=await fetchImpl(next,{headers:{...video.requestHeaders,Accept:'video/mp4,video/webm',...(attempt?{Range:`bytes=${start}-${end}`}:{})},redirect:'manual',signal:partSignal});
                  if(![301,302,303,307,308].includes(response.status))break;
                  const location=response.headers.get('location');await response.body?.cancel();if(!location||redirects===4)throw new Error('Background video redirect failed.');next=new URL(location,next).toString();
                }
                if(!response?.ok||!response.body)throw new Error(`Background download failed (${response?.status||0}).`);
                if(!/^(?:video\/(?:mp4|webm)|application\/octet-stream)\b/.test(response.headers.get('content-type')||''))throw new Error('Background response is not a video.');
                const length=Number(response.headers.get('content-length'))||0,limit=end-start+1;
                if(length>limit)throw new Error('Unexpected background range size.');
                const range=response.headers.get('content-range');
                if(range&&range!==`bytes ${start}-${end}/${expected}`)throw new Error('Unexpected background range.');
                let size=0;const chunks=[];
                for await(const bytes of response.body){size+=bytes.length;if(size>limit)throw new Error('Unexpected background range size.');chunks.push(Buffer.from(bytes));}
                if(size!==limit)throw new Error('Background video download was incomplete.');
                const bytes=Buffer.concat(chunks);let written=0;
                while(written<bytes.length){const result=await handle.write(bytes,written,bytes.length-written,start+written);if(!result.bytesWritten)throw new Error('Background file write failed.');written+=result.bytesWritten;}
                completed+=size;onProgress({bytes:completed,total:expected});return;
              }catch(error){lastError=error;await response?.body?.cancel().catch(()=>{});if(joint.aborted)throw error;}
            }
            throw lastError;
          }
          async function worker(){while(cursor<expected){const start=cursor;cursor+=CHUNK_BYTES;await chunk(start,Math.min(expected-1,start+CHUNK_BYTES-1));}}
          const jobs=Array.from({length:Math.min(3,Math.ceil(expected/CHUNK_BYTES))},worker);
          try{await Promise.all(jobs);}catch(error){controller.abort();await Promise.allSettled(jobs);throw error;}finally{await handle.close();}
        }else{
        let response;
        for(let redirects=0;redirects<=4;redirects++){
          if(!allowedMedia(url))throw new Error('Untrusted background media host.');
          response=await fetchImpl(url,{headers:{...video.requestHeaders,Accept:'video/mp4,video/webm',...(expected?{Range:`bytes=0-${expected-1}`}:{})},redirect:'manual',signal});
          if(![301,302,303,307,308].includes(response.status))break;
          const location=response.headers.get('location');await response.body?.cancel();if(!location||redirects===4)throw new Error('Background video redirect failed.');url=new URL(location,url).toString();
        }
        if(!response?.ok||!response.body)throw new Error(`Background download failed (${response?.status||0}).`);
        const length=Number(response.headers.get('content-length'))||0;if(length>MAX_BYTES)throw new Error('Background video exceeds 256 MB.');
        const type=response.headers.get('content-type')||'';if(!/^(?:video\/(?:mp4|webm)|application\/octet-stream)\b/.test(type))throw new Error('Background response is not a video.');
        let bytes=0;
        const limit=new Transform({transform(chunk,encoding,callback){bytes+=chunk.length;callback(bytes>MAX_BYTES?new Error('Background video exceeds 256 MB.'):null,chunk);}});
        await pipeline(Readable.fromWeb(response.body),limit,createWriteStream(partial,{flags:'wx'}),{signal});
        if(!bytes||(expected&&bytes!==expected)||(length&&bytes!==length))throw new Error('Background video download was incomplete.');
        }
        const handle=await fs.open(partial,'r'),head=Buffer.alloc(16);try{await handle.read(head,0,16,0);}finally{await handle.close();}
        if(extension==='.mp4'?head.toString('ascii',4,8)!=='ftyp':head.readUInt32BE(0)!==0x1a45dfa3)throw new Error('Invalid background video container.');
        await fs.rename(partial,target);return {path:target,name:`YouTube ${id}${extension}`,cached:false};
      }catch(error){await fs.rm(partial,{force:true}).catch(()=>{});throw error;}
    })().finally(()=>pending.delete(id));pending.set(id,task);return task;
  }
  async function remove(file){if(path.dirname(path.resolve(file))!==path.resolve(root)||!/^[-\w]{11}\.(mp4|webm)$/.test(path.basename(file)))return;await fs.rm(file,{force:true});}
  return {download,remove};
}
module.exports={youtubeId,allowedMedia,createBackgroundCache,MAX_BYTES};
