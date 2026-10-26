"use strict";
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createSpotifyAccounts}=require('../src/main/spotifyAccounts');
async function fixture(){
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'auralane-spotify-accounts-')),stores=new Map(),created=[];
  let rejectLogin=false,delayedPage=null;
  function createLibrary({account}){
    created.push(account);if(!stores.has(account))stores.set(account,{connected:account==='owner'});const data=stores.get(account);
    return {state:()=>({connected:data.connected}),status:async()=>({connected:data.connected,displayName:data.name}),
      signIn:async()=>{if(rejectLogin)throw Object.assign(new Error('cancel'),{code:'SPOTIFY_LOGIN_CANCELLED'});data.connected=true;},
      disconnect:async()=>{data.connected=false;},cancel:()=>{},dispose:()=>{},page:async()=>delayedPage?delayedPage():({items:[{name:account}]}),resolve:async()=>({id:'song'}),match:async()=>({})};
  }
  const options={account:'owner',root,createLibrary,options:{}},manager=createSpotifyAccounts(options);
  return {root,manager,options,stores,created,reject:()=>{rejectLogin=true;},delay:fn=>{delayedPage=fn;},cleanup:async()=>{manager.dispose();await fs.rm(root,{recursive:true,force:true});}};
}
test('preserves legacy login, isolates sessions, persists selection, and only logs out selected Spotify profile',async()=>{
  const f=await fixture();let next;
  try{
    const old=await f.manager.status();assert.equal(old.connected,true);assert.equal(old.activeProfile,'default');assert.deepEqual(f.created,['owner']);
    f.stores.get('owner').name='Real Spotify name';assert.equal((await f.manager.status()).accounts[0].name,'Real Spotify name');
    const added=await f.manager.add(),id=added.activeProfile;assert.notEqual(id,'default');assert.equal(added.accounts.length,2);assert.equal(added.signingIn,false);assert.ok(f.created.includes(`owner:spotify:${id}`));
    await f.manager.rename(id,'Second account');await f.manager.select('default');assert.equal((await f.manager.status()).connected,true);
    await assert.rejects(f.manager.page('library',0,id),{code:'SPOTIFY_CANCELLED'});
    await f.manager.disconnect();let status=await f.manager.status();assert.equal(status.connected,false);assert.equal(status.accounts.find(p=>p.id===id).connected,true);
    await f.manager.select(id);f.manager.dispose();next=createSpotifyAccounts(f.options);status=await next.status();assert.equal(status.activeProfile,id);assert.equal(status.connected,true);assert.equal(status.accounts.find(p=>p.id===id).name,'Second account');
    const files=await fs.readdir(path.join(f.root,'spotify-accounts')),raw=await fs.readFile(path.join(f.root,'spotify-accounts',files[0]),'utf8');assert.equal(/cookie|bearer|authorization|password|sp_dc/i.test(raw),false);
    status=await next.remove(id);assert.equal(status.accounts.length,1);assert.equal(status.activeProfile,'default');assert.equal(f.stores.get(`owner:spotify:${id}`).connected,false);
  }finally{next?.dispose();await f.cleanup();}
});
test('cancelled account addition preserves original account and stale pages cannot cross profile switches',async()=>{
  const f=await fixture();
  try{
    const added=await f.manager.add(),id=added.activeProfile;await f.manager.select('default');
    let finish;f.delay(()=>new Promise(r=>{finish=r;}));const page=f.manager.page('library',0,'default');await new Promise(r=>setImmediate(r));
    await f.manager.select(id);finish({items:['old-private-data']});await assert.rejects(page,{code:'SPOTIFY_CANCELLED'});
    f.reject();await assert.rejects(f.manager.add(),{code:'SPOTIFY_LOGIN_CANCELLED'});const state=await f.manager.status();assert.equal(state.activeProfile,id);assert.equal(state.connected,true);assert.equal(state.accounts.length,2);
    await assert.rejects(f.manager.select('../other-owner'),{code:'INVALID_REQUEST'});
  }finally{await f.cleanup();}
});
test('single-account migration rescues a valid original login and preserves it across restarts',async()=>{
  const f=await fixture();let manager,restarted;
  try{
    await f.manager.status();f.manager.dispose();const id='12345678-1234-1234-1234-123456789abc';f.stores.set(`owner:spotify:${id}`,{connected:false});
    const crypto=require('node:crypto'),dir=path.join(f.root,'spotify-accounts');await fs.mkdir(dir,{recursive:true});
    await fs.writeFile(path.join(dir,crypto.createHash('sha256').update('owner').digest('hex')+'.json'),JSON.stringify({active:id,profiles:[{id:'default',name:'Original'},{id,name:'Failed addition'}]}));
    manager=createSpotifyAccounts({...f.options,single:true});let status=await manager.status();assert.equal(status.accounts.length,1);assert.equal(status.activeProfile,'default');assert.equal(status.connected,true);
    await assert.rejects(manager.add(),{code:'UNKNOWN_REQUEST'});manager.dispose();
    restarted=createSpotifyAccounts({...f.options,single:true});assert.equal((await restarted.status()).connected,true);
    await restarted.disconnect();restarted.dispose();restarted=createSpotifyAccounts({...f.options,single:true});assert.equal((await restarted.status()).connected,false);
  }finally{manager?.dispose();restarted?.dispose();await f.cleanup();}
});
test('single-account controls show the account name, sign out and sign in, without account-switch controls',async()=>{
  const {chromium}=require('playwright-core'),browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.setContent('<section id="spotifyView" class="workspace-spotify"></section>');
    for(const file of ['styles.css','musicWorkspace.css','workspacePolish.css','lightTheme.css'])await page.addStyleTag({path:path.join(__dirname,'../src/renderer',file)});
    await page.addScriptTag({path:path.join(__dirname,'../src/renderer/spotifyLibrary.js')});
    await page.evaluate(()=>{
      document.documentElement.dataset.colorScheme='light';window.state={activeView:'spotify',settings:{language:'en'}};
      window.profiles=[{id:'default',name:'Actual Spotify name',connected:true}];window.active='default';window.calls=[];
      window.metro={onFeatureEvent:()=>()=>{},featureRequest:async({type,payload})=>{
        calls.push(type);let value;
        if(type==='spotify.login')profiles[0].connected=true;
        if(type==='spotify.disconnect')profiles.find(p=>p.id===active).connected=false;
        if(type==='spotify.page')value={items:[{id:'playlist',name:'Playlist '+active,owner:'Owner'}],next:null,total:1};
        else value={activeProfile:active,accounts:profiles.map(p=>({...p})),connected:profiles.find(p=>p.id===active).connected};
        return {ok:true,value};
      }};
      window.spotify=AuralaneSpotify.init({state,getAccountId:()=>'owner',icon:()=>'',setIconButton:(b,icon,name)=>b.setAttribute('aria-label',name)});
    });
    await page.getByText('Actual Spotify name',{exact:true}).waitFor();
    assert.equal(await page.locator('.spotify-account-select').count(),0);
    assert.equal(await page.getByRole('button',{name:'Add Spotify account',exact:true}).count(),0);
    await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByRole('button',{name:'Sign in to Spotify',exact:true}).waitFor();
    assert.equal(await page.evaluate(()=>profiles[0].connected),false);
    await page.getByRole('button',{name:'Sign in to Spotify',exact:true}).click();await page.getByText('Actual Spotify name',{exact:true}).waitFor();
    for(const width of [390,1280])for(const language of ['en','zh-TW','zh-CN','ja','ko']){
      await page.setViewportSize({width,height:800});await page.evaluate(language=>{state.settings.language=language;spotify.refresh();},language);
      assert.equal(await page.locator('#spotifyView').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true,`${width} ${language}`);
    }
    await page.screenshot({path:path.join(os.tmpdir(),'auralane-spotify-accounts.png')});assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});
