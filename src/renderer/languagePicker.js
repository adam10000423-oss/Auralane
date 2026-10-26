(function(root){
  "use strict";
  const pickers=new WeakMap();
  let closeActive=()=>{};
  const normalize=value=>String(value||"").normalize("NFKD").replace(/\p{M}/gu,"").toLocaleLowerCase();
  function searchTerms(code,native,locale){
    const terms=[code,native];
    for(const language of ["en",locale]){
      try{terms.push(new Intl.DisplayNames([language],{type:"language"}).of(code));}catch{}
      try{const region=new Intl.Locale(code).maximize().region;if(region)terms.push(region,new Intl.DisplayNames([language],{type:"region"}).of(region));}catch{}
    }
    return normalize(terms.join(" "));
  }
  function attach(select){
    if(pickers.has(select)){pickers.get(select).refresh();return;}
    const button=document.createElement("button");
    button.type="button";button.className="language-picker-trigger";button.dataset.i18nSkip="";
    button.setAttribute("aria-haspopup","dialog");button.setAttribute("aria-expanded","false");
    const label=select.closest("label")?.querySelector("strong,span");
    select.hidden=true;select.after(button);
    const refresh=()=>{button.textContent=select.selectedOptions[0]?.textContent||select.value;button.setAttribute("aria-label",`${label?.textContent||"Language"}: ${button.textContent}`);};
    select.addEventListener("change",refresh);refresh();
    button.addEventListener("click",()=>{
      closeActive();refresh();
      const locale=document.documentElement.lang||root.navigator.language||"en";
      const chinese=/^zh/i.test(locale);
      const panel=document.createElement("div");panel.className="language-picker-panel";panel.dataset.i18nSkip="";
      panel.setAttribute("role","dialog");panel.setAttribute("aria-label",button.getAttribute("aria-label"));
      const search=document.createElement("input");search.type="search";search.autocomplete="off";
      search.placeholder=chinese?"搜尋語言或國家":"Search languages or countries";search.setAttribute("aria-label",search.placeholder);
      const list=document.createElement("div");list.className="language-picker-options";list.setAttribute("role","listbox");list.setAttribute("aria-label",label?.textContent||"Language");
      const entries=[...select.options].map(option=>({code:option.value,name:option.textContent,terms:searchTerms(option.value,option.textContent,locale)}));
      let active=select.selectedIndex;
      function render(){
        const query=normalize(search.value),filtered=entries.filter(entry=>entry.terms.includes(query));
        list.replaceChildren(...filtered.map((entry,index)=>{
          const option=document.createElement("button");option.type="button";option.textContent=entry.name;option.dataset.code=entry.code;
          option.setAttribute("role","option");option.setAttribute("aria-selected",String(entry.code===select.value));option.tabIndex=-1;
          option.addEventListener("click",()=>{select.value=entry.code;select.dispatchEvent(new Event("change",{bubbles:true}));close();button.focus();});
          option.addEventListener("pointermove",()=>{active=index;highlight();});return option;
        }));
        if(!filtered.length){const empty=document.createElement("p");empty.textContent=chinese?"找不到語言":"No languages found";list.append(empty);}
        active=Math.max(0,Math.min(active,filtered.length-1));highlight();
      }
      function highlight(){[...list.querySelectorAll("button")].forEach((option,index)=>option.classList.toggle("keyboard-active",index===active));}
      function position(){const rect=button.getBoundingClientRect(),width=Math.min(Math.max(rect.width,280),innerWidth-24);panel.style.width=`${width}px`;panel.style.left=`${Math.max(12,Math.min(rect.left,innerWidth-width-12))}px`;const height=Math.min(360,innerHeight-24);panel.style.maxHeight=`${height}px`;panel.style.top=`${Math.max(12,Math.min(rect.bottom+6,innerHeight-height-12))}px`;}
      function outside(event){if(!panel.contains(event.target)&&!button.contains(event.target))close();}
      function close(){panel.remove();button.setAttribute("aria-expanded","false");document.removeEventListener("pointerdown",outside);root.removeEventListener("resize",position);document.removeEventListener("scroll",onScroll,true);closeActive=()=>{};}
      function onScroll(event){
        const target=event.target;
        if(panel.contains(target))return;
        if(target===document||target===document.scrollingElement||target instanceof Element&&target.contains(button))position();
      }
      search.addEventListener("input",()=>{active=0;render();});
      panel.addEventListener("keydown",event=>{
        if(event.key==="Escape"){event.preventDefault();event.stopPropagation();close();button.focus();}
        if(event.key==="ArrowDown"||event.key==="ArrowUp"){event.preventDefault();const options=[...list.querySelectorAll("button")];active=Math.max(0,Math.min(options.length-1,active+(event.key==="ArrowDown"?1:-1)));highlight();options[active]?.scrollIntoView({block:"nearest"});}
        if(event.key==="Enter"){event.preventDefault();list.querySelectorAll("button")[active]?.click();}
        if(event.key==="Tab")close();
      });
      panel.append(search,list);document.body.append(panel);button.setAttribute("aria-expanded","true");closeActive=close;render();position();search.focus();
      list.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"});
      document.addEventListener("pointerdown",outside);root.addEventListener("resize",position);document.addEventListener("scroll",onScroll,true);
    });
    pickers.set(select,{refresh});
  }
  root.AuralaneLanguagePicker={attach,refresh:()=>document.querySelectorAll("select[hidden]").forEach(select=>pickers.get(select)?.refresh()),searchTerms};
})(window);
