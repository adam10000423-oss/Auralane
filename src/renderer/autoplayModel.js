(function(root){
  "use strict";
  const key=value=>String(value||"").normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").trim();
  const title=track=>key(String(track.title||"").replace(/\((?:official (?:music )?(?:audio|video)|lyrics?|visuali[sz]er|hd|4k)\)|\[(?:official (?:music )?(?:audio|video)|lyrics?|hd|4k)\]/gi,""));
  function artists(track){
    const names=track.artists?.length?track.artists.map(a=>a.name||a.title||""):[track.artist||""];
    return [...new Set(names.flatMap(n=>n.replace(/\s*-\s*Topic$/i,"").split(/\s*(?:,|&|·|;| feat\.? | ft\.? )\s*/i)).map(key).filter(Boolean))];
  }
  function select(existing,candidates,seed,limit=10){
    const ids=new Set(),recordings=new Map(),counts=new Map(),seedArtists=new Set(artists(seed)),out=[];
    const remember=track=>{ids.add(track.videoId||track.id);const name=title(track);if(name){if(!recordings.has(name))recordings.set(name,[]);recordings.get(name).push(new Set(artists(track)));}};
    existing.forEach(remember);
    const audio=candidates.filter(t=>!t.isVideo&&t.type!=="video");
    for(const track of audio.length?audio:candidates){
      const id=track.videoId||track.id,names=artists(track),name=title(track);
      if(!/^[A-Za-z0-9_-]{11}$/.test(id||"")||ids.has(id))continue;
      if(name && recordings.get(name)?.some(known=>!known.size||!names.length||names.some(n=>known.has(n))))continue;
      if(names.some(n=>(counts.get(n)||0)>=(seedArtists.has(n)?4:2)))continue;
      out.push({...track,autoplay:true});remember(track);names.forEach(n=>counts.set(n,(counts.get(n)||0)+1));
      if(out.length>=Math.max(1,Math.min(10,limit)))break;
    }
    return out;
  }
  const api={select};if(typeof module==="object"&&module.exports)module.exports=api;else root.AuralaneAutoplayModel=api;
})(typeof window==="object"?window:globalThis);
