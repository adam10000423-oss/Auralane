(function(root){
  "use strict";
  const shown=new Set();
  function notesText(value){
    const raw=Array.isArray(value)?value.map(v=>typeof v==='string'?v:v?.note||'').join('\n\n'):String(value||'');
    const template=document.createElement('template');template.innerHTML=raw.slice(0,50000);
    template.content.querySelectorAll('script,style').forEach(e=>e.remove());
    template.content.querySelectorAll('br').forEach(e=>e.replaceWith('\n'));
    template.content.querySelectorAll('p,li,h1,h2,h3').forEach(e=>e.append('\n'));
    return template.content.textContent.trim();
  }
  function show(info,o){
    if(!info.version||shown.has(info.version))return;shown.add(info.version);
    const language=['en','zh-TW','zh-CN','ja','ko'].indexOf(o.language),i=Math.max(0,language);
    const words=[['Update available','Close','Go to update','No release notes provided.'],['有新版本可更新','關閉','前往更新','此版本未提供修改內容。'],['有新版本可更新','关闭','前往更新','此版本未提供更新内容。'],['更新があります','閉じる','更新へ','リリースノートはありません。'],['새 업데이트가 있습니다','닫기','업데이트로 이동','릴리스 노트가 없습니다.']][i];
    const dialog=document.createElement('dialog');dialog.className='startup-update-dialog';dialog.dataset.i18nSkip='';
    const head=document.createElement('header'),title=document.createElement('h2'),close=document.createElement('button');title.id='startup-update-title';dialog.setAttribute('aria-labelledby',title.id);title.textContent=words[0];close.type='button';close.className='startup-update-close';o.setIconButton(close,'close',words[1]);head.append(title,close);
    const version=document.createElement('strong');version.className='startup-update-version';version.textContent='v'+info.version;
    const notes=document.createElement('div');notes.className='startup-update-notes';notes.textContent=notesText(info.releaseNotes)||words[3];
    const actions=document.createElement('footer'),go=document.createElement('button');go.type='button';go.className='primary-action';go.textContent=words[2];actions.append(go);dialog.append(head,version,notes,actions);document.body.append(dialog);
    close.addEventListener('click',()=>dialog.close());go.addEventListener('click',()=>{dialog.close();o.openSettings();});dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();
  }
  root.AuralaneStartupUpdate={show,notesText};
})(window);
