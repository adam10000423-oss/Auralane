(function(){
  "use strict";
  window.AuralaneWorkspacePolish={init(o){
    let frame=0;
    const color=document.createElement("select");color.id="settingsColorScheme";color.dataset.i18nSkip="";
    for(const [value,label]of [["dark","Dark"],["light","Light"],["system","System"]]){const option=document.createElement("option");option.value=value;option.textContent=label;color.append(option);}
    const row=document.createElement("label");row.className="settings-field";const label=document.createElement("strong");label.textContent="Color scheme";row.append(label,color);
    document.getElementById("settingsThemeMode")?.closest(".settings-field")?.after(row);
    color.addEventListener("change",()=>{o.state.settings.colorScheme=color.value;o.applyScheme();o.save();});
    const system=matchMedia("(prefers-color-scheme: light)");system.addEventListener("change",()=>o.applyScheme());
    const theme=document.getElementById("settingsThemeMode");for(const value of ["white","black"]){if(![...theme.options].some(option=>option.value===value)){const option=document.createElement("option");option.value=value;option.textContent=value==="white"?"White":"Black";theme.append(option);}}
    for(const id of ["settingsLyricsSource","settingsLyricsPriority"]){const field=document.getElementById(id)?.closest(".settings-field");if(field)field.hidden=true;}
    document.querySelector(".lyrics-source-switches")?.setAttribute("hidden","");
    const cover=document.getElementById("nowArt"),expand=document.createElement("button");expand.type="button";expand.className="cover-expand-button";o.setIconButton(expand,"expand","Expand lyrics");expand.addEventListener("click",event=>{event.stopPropagation();o.expand();});cover.append(expand);
    const fullCover=document.getElementById("lyricsFullscreenCoverArt");
    if(fullCover){const collapse=expand.cloneNode();o.setIconButton(collapse,"collapse","Restore lyrics panel");collapse.addEventListener("click",event=>{event.stopPropagation();o.expand();});fullCover.removeAttribute("aria-hidden");fullCover.append(collapse);}
    const wraps=new WeakMap();
    function setupInput(input){
      if(wraps.has(input)){wraps.get(input).hidden=!input.value;return;}
      if(input.closest(".workspace-clear-wrap")||input.disabled||input.readOnly)return;
      const wrap=document.createElement("span"),button=document.createElement("button");wrap.className="workspace-clear-wrap";input.before(wrap);wrap.append(input,button);button.type="button";button.className="input-clear";o.setIconButton(button,"close","Clear");
      const update=()=>{button.hidden=!input.value;};input.addEventListener("input",update);input.addEventListener("change",update);
      button.addEventListener("click",event=>{event.preventDefault();input.value="";input.dispatchEvent(new Event("input",{bubbles:true}));input.dispatchEvent(new Event("change",{bubbles:true}));input.focus();update();});wraps.set(input,button);update();
    }
    function refresh(){
      frame=0;
      for(const input of document.querySelectorAll('input:not([type]),input[type=text],input[type=search],input[type=url],input[type=email],input[type=password],input[type=number],textarea'))setupInput(input);
      color.value=o.state.settings.colorScheme||"dark";
      theme.value=o.state.settings.themeMode||"auto";
      const lang=o.state.settings.language,zh=lang==="zh-TW"||lang==="zh-CN";label.textContent=zh?"明暗模式":"Color scheme";
      const labels=zh?["深色","淺色","跟隨系統"]:["Dark","Light","System"];[...color.options].forEach((option,i)=>option.textContent=labels[i]);
      o.refreshLikes();
    }
    const inputSelector='input:not([type]),input[type=text],input[type=search],input[type=url],input[type=email],input[type=password],input[type=number],textarea';
    const pendingInputs=new Set();
    const observer=new MutationObserver(records=>{
      for(const record of records)for(const node of record.addedNodes){
        if(node.nodeType!==1||node.closest(".lyric-line,svg"))continue;
        if(node.matches(inputSelector))pendingInputs.add(node);
        for(const input of node.querySelectorAll(inputSelector))pendingInputs.add(input);
      }
      if(!frame&&pendingInputs.size)frame=requestAnimationFrame(()=>{frame=0;for(const input of pendingInputs)if(input.isConnected)setupInput(input);pendingInputs.clear();});
    });observer.observe(document.body,{childList:true,subtree:true});
    document.addEventListener("keydown",event=>{if(event.defaultPrevented)return;const target=event.target.closest?.("[data-track-like],[data-download-trigger]");if(target&&(event.key==="Enter"||event.key===" ")){event.preventDefault();target.click();}});
    o.applyScheme();refresh();return {refresh};
  }};
})();
