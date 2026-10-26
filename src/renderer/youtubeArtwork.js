(function(root){
  "use strict";
  let pending=null;
  function load(){
    if(root.YT?.Player)return Promise.resolve(root.YT);
    if(pending)return pending;
    pending=new Promise((resolve,reject)=>{
      const script=document.createElement("script"),previous=root.onYouTubeIframeAPIReady;
      const finish=()=>{clearTimeout(timer);if(root.onYouTubeIframeAPIReady===ready)root.onYouTubeIframeAPIReady=previous;};
      function ready(){finish();try{previous?.();}catch{}resolve(root.YT);}
      const timer=setTimeout(()=>{finish();script.remove();reject(new Error("YouTube player timed out"));},12000);
      root.onYouTubeIframeAPIReady=ready;
      script.src="https://www.youtube.com/iframe_api";script.async=true;
      script.onerror=()=>{finish();script.remove();reject(new Error("YouTube player unavailable"));};
      document.head.append(script);
    }).catch(error=>{pending=null;throw error;});
    return pending;
  }
  function create(container,id,{playing=false,preview=false,onError=()=>{}}={}){
    let player=null,disposed=false,shouldPlay=playing,ready=false,readyTimer=null,bufferTimer=null;
    const mount=container.ownerDocument.createElement("div");container.append(mount);
    function sync(){if(!ready||disposed)return;player.mute();if(shouldPlay)player.playVideo();else player.pauseVideo();}
    function failPlayer(reason){if(disposed)return;clearTimeout(readyTimer);clearTimeout(bufferTimer);ready=false;try{player?.destroy();}catch{}onError(typeof reason?.data==="number"?reason.data:reason);}
    load().then(YT=>{
      if(disposed)return;
      readyTimer=setTimeout(()=>{if(!ready)failPlayer();},12000);
      player=new YT.Player(mount,{width:"100%",height:"100%",videoId:id,host:"https://www.youtube-nocookie.com",playerVars:{autoplay:0,mute:1,playsinline:1,loop:1,playlist:id,controls:1,disablekb:1,fs:0,origin:root.location.origin},events:{
        onReady:event=>{clearTimeout(readyTimer);player=event.target;ready=true;sync();},
        onStateChange:event=>{if(disposed)return;clearTimeout(bufferTimer);if(event.data===3)bufferTimer=setTimeout(failPlayer,15000);event.target.mute();if(!preview&&!shouldPlay&&event.data===1)event.target.pauseVideo();},
        onError:failPlayer,onAutoplayBlocked:failPlayer
      }});
    }).catch(failPlayer);
    return {setPlaying(value){shouldPlay=!!value;sync();},destroy(){disposed=true;clearTimeout(readyTimer);clearTimeout(bufferTimer);try{player?.destroy();}catch{}container.replaceChildren();}};
  }
  root.AuralaneYouTubeArtwork={create};
})(window);
