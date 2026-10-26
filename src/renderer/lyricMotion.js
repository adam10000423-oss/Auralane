(function(root){
  "use strict";
  const running=new WeakMap();
  function enter(line,{disabled=false,reverse=false}={}){
    if(!line||!line.isConnected||disabled||line.classList.contains("background-vocal"))return;
    const children=[...line.children].filter(node=>node.matches(".lyric-original,.lyric-romanization,.lyric-translation"));
    const origin=root.getComputedStyle(line).textAlign==="right"?"right center":root.getComputedStyle(line).textAlign==="center"?"center center":"left center";
    children.forEach((node,index)=>{
      const previous=running.get(node);
      const interrupted=previous&&previous.playState!=="finished"&&previous.playState!=="idle";
      const from=interrupted?root.getComputedStyle(node).transform:null;
      previous?.cancel();
      if(typeof node.animate!=="function")return;
      const shift=(reverse?-1:1)*(index?9:14);
      const animation=node.animate([
        {transform:from||`translateY(${shift}px) scale(.98)`,transformOrigin:origin},
        {transform:`translateY(${reverse?1:-1}px) scale(1.004)`,offset:.74,transformOrigin:origin},
        {transform:"none",transformOrigin:origin}
      ],{duration:index?540:620,delay:index*45,easing:"cubic-bezier(.22,.72,.16,1)",fill:"backwards"});
      running.set(node,animation);
      animation.finished.catch(()=>{}).finally(()=>{if(running.get(node)===animation)running.delete(node);});
    });
  }
  root.AuralaneLyricMotion={enter};
})(window);
