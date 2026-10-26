"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const fault = code => Object.assign(new Error(code), { code });

function createSpotifyAccounts({ account, root, createLibrary, options, single = false }) {
  const file = path.join(root, "spotify-accounts", `${crypto.createHash("sha256").update(account).digest("hex")}.json`);
  let profiles = [{ id: "default", name: "Spotify" }], active = "default", revision = 0, disposed = false, pending = null, mutating = false;
  const instances = new Map();
  const ready = (async () => {
    try {
      const saved = JSON.parse(await fs.readFile(file, "utf8"));
      if (!Array.isArray(saved.profiles) || !saved.profiles.length || saved.profiles.length > 10 ||
          saved.profiles.some(p => !p || !/^(?:default|[a-f0-9-]{36})$/.test(p.id) || typeof p.name !== "string" || !p.name.trim() || p.name.length > 80) ||
          new Set(saved.profiles.map(p => p.id)).size !== saved.profiles.length || !saved.profiles.some(p => p.id === saved.active)) throw fault("SPOTIFY_ACCOUNTS_INVALID");
      profiles = saved.profiles.map(p => ({ id: p.id, name: p.name })); active = saved.active;
    } catch (error) { if (error.code !== "ENOENT") throw error; }
    if(single&&!disposed){
      const candidates=[...profiles];if(!candidates.some(p=>p.id==="default"))candidates.push({id:"default",name:"Spotify"});
      const connected=await Promise.all(candidates.map(async p=>({...p,connected:Boolean((await library(p.id).status()).connected)})));
      if(disposed)return;
      const keep=connected.find(p=>p.id===active&&p.connected)||connected.find(p=>p.connected)||connected.find(p=>p.id===active)||connected[0];
      profiles=[{id:keep.id,name:keep.name}];active=keep.id;await save();
      for(const profile of connected)if(profile.id!==active){await library(profile.id).disconnect();library(profile.id).dispose();instances.delete(profile.id);}
    }
  })();
  ready.catch(() => {});
  async function check() { await ready; if (disposed) throw fault("SPOTIFY_CLOSED"); }
  async function exclusive(fn) {
    await check(); if (mutating) throw fault("SPOTIFY_BUSY"); mutating = true;
    try { return await fn(); } finally { mutating = false; }
  }
  function library(id = active) {
    if (!instances.has(id)) instances.set(id, createLibrary({ ...options,
      // Preserve the original partition for the already-connected account.
      account: id === "default" ? account : `${account}:spotify:${id}`,
      emit: (type, value) => { if (!disposed && (id === active || id === pending?.id)) options.emit?.(type, { ...value, profileId: id }); }
    }));
    return instances.get(id);
  }
  async function save() {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const temp = `${file}.${crypto.randomUUID()}.tmp`;
    try {
      await fs.writeFile(temp, JSON.stringify({ version: 1, active, profiles }), { flag: "wx", mode: 0o600 });
      for(let attempt=0;;attempt++){
        try{await fs.rename(temp,file);break;}
        catch(error){if(attempt>=3||!["EPERM","EBUSY","EACCES"].includes(error.code))throw error;await new Promise(resolve=>setTimeout(resolve,30*2**attempt));}
      }
    }
    finally { await fs.rm(temp, { force: true }); }
  }
  async function status() {
    await check();
    const stamp = revision, id = active;
    let namesChanged=false;
    const entries = await Promise.all(profiles.map(async profile => {
      const value=await library(profile.id).status();
      if(value.displayName&&profile.name!==value.displayName){profile.name=value.displayName;namesChanged=true;}
      if(/^Spotify \d+$/.test(profile.name)){profile.name="Spotify";namesChanged=true;}
      return {...profile,connected:Boolean(value.connected)};
    }));
    const selected = await library(id).status();
    if (stamp !== revision) return status();
    if(namesChanged)await save();
    return { ...selected, activeProfile: id, accounts: entries, signingIn: Boolean(pending) || Boolean(library(id).state?.()?.signingIn) };
  }
  async function invoke(method, ...args) {
    await check(); const stamp = revision, instance = library(); const result = await instance[method](...args);
    if (disposed || stamp !== revision) throw fault("SPOTIFY_CANCELLED");
    return result;
  }
  async function select(id) {
    await check(); if (pending || !profiles.some(p => p.id === id)) throw fault("INVALID_REQUEST");
    const previous = active; library().cancel(); revision++; active = id;
    try { await save(); } catch (error) { active = previous; throw error; }
    return status();
  }
  async function add() {
    await check(); if (pending || profiles.length >= 10) throw fault("SPOTIFY_BUSY");
    const profile = { id: crypto.randomUUID(), name: "Spotify" };
    pending = profile;
    const previous = active;
    const candidate = library(profile.id);
    try {
      await candidate.signIn(); await check();
      profiles.push(profile); active = profile.id; revision++;
      try { await save(); } catch (error) { profiles = profiles.filter(p => p.id !== profile.id); active = previous; throw error; }
      pending = null; return await status();
    } catch (error) {
      await candidate.disconnect().catch(() => {}); candidate.dispose(); instances.delete(profile.id); throw error;
    } finally { pending = null; }
  }
  async function rename(id, name) {
    await check(); const profile = profiles.find(p => p.id === id);
    if (pending || !profile || typeof name !== "string" || !name.trim() || name.trim().length > 80) throw fault("INVALID_REQUEST");
    const previous = profile.name; profile.name = name.trim();
    try { await save(); } catch (error) { profile.name = previous; throw error; }
    return status();
  }
  async function remove(id) {
    await check(); if (pending || !profiles.some(p => p.id === id)) throw fault("INVALID_REQUEST");
    await library(id).disconnect(); library(id).dispose(); instances.delete(id); revision++;
    profiles = profiles.filter(p => p.id !== id);
    if (!profiles.length) profiles = [{ id: "default", name: "Spotify" }];
    if (active === id) active = profiles[0].id;
    await save(); return status();
  }
  return {
    status, select: id => single?Promise.reject(fault("UNKNOWN_REQUEST")):exclusive(() => select(id)), add: () => single?Promise.reject(fault("UNKNOWN_REQUEST")):exclusive(add), rename: (id,name) => single?Promise.reject(fault("UNKNOWN_REQUEST")):exclusive(() => rename(id,name)), remove: id => single?Promise.reject(fault("UNKNOWN_REQUEST")):exclusive(() => remove(id)),
    signIn: () => exclusive(async () => { await invoke("signIn"); return status(); }),
    disconnect: () => exclusive(async () => { await invoke("disconnect"); revision++; return status(); }),
    async page(id, offset, profileId) {
      await check(); if (profileId && profileId !== active) throw fault("SPOTIFY_CANCELLED");
      const stamp=revision,result=await library().page(id,offset);
      if(disposed||stamp!==revision)throw fault("SPOTIFY_CANCELLED");return result;
    },
    match: (...args) => invoke("match", ...args), resolve: (...args) => invoke("resolve", ...args),
    cancel() { if (pending) instances.get(pending.id)?.cancel(); instances.get(active)?.cancel(); },
    dispose() { disposed = true; revision++; for (const instance of instances.values()) instance.dispose(); instances.clear(); }
  };
}
module.exports = { createSpotifyAccounts };
