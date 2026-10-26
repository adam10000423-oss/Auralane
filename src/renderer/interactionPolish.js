(function(){
  "use strict";
  const timers=new WeakMap();
  document.addEventListener("scroll",event=>{
    const target=event.target;
    if(!target.matches?.(".sidebar,.main,#rightPanel"))return;
    if(target.id === "rightPanel" && typeof state !== "undefined" && state.activeSidePanel === "lyrics" && state.lyricsProgrammaticScroll) return;
    clearTimeout(timers.get(target));target.classList.add("scrollbar-active");
    timers.set(target,setTimeout(()=>target.classList.remove("scrollbar-active"),800));
  },true);
})();
