"use strict";
const LIMITS = Object.freeze({ queue: 200, members: 8, payload: 196608, rooms: 100 });
const fault = (code, status = 400) => Object.assign(new Error(code), { code, status });
const object = value => value && typeof value === "object" && !Array.isArray(value);
const PERMISSIONS = Object.freeze({ playPause: false, skip: false, seek: false, add: true, reorder: false, remove: false });
function permissions(value = PERMISSIONS) {
  if (!object(value) || Object.keys(value).length !== Object.keys(PERMISSIONS).length ||
      Object.keys(value).some(key => !Object.hasOwn(PERMISSIONS, key) || typeof value[key] !== "boolean")) throw fault("INVALID_PERMISSIONS");
  return Object.fromEntries(Object.keys(PERMISSIONS).map(key => [key, value[key]]));
}
function tracks(value) {
  if (!Array.isArray(value) || value.length > LIMITS.queue) throw fault("INVALID_QUEUE");
  const seen = new Set();
  return value.map(item => {
    if (!object(item) || typeof item.id !== "string" || !/^[A-Za-z0-9_-]{11}$/.test(item.id) || seen.has(item.id) ||
        typeof item.title !== "string" || !item.title.trim() || item.title.length > 300 ||
        typeof item.artist !== "string" || item.artist.length > 300 ||
        !Number.isFinite(item.duration) || item.duration < 0 || item.duration > 86400) throw fault("INVALID_QUEUE");
    seen.add(item.id);
    return { id: item.id, title: item.title, artist: item.artist, duration: item.duration };
  });
}
function roomCode(value) {
  const code = typeof value === "string" ? value.replace(/[\s-]/g, "").toUpperCase() : "";
  if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code)) throw fault("INVALID_CODE");
  return code;
}
function name(value) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > 40 || /[\x00-\x1f\x7f]/.test(value)) throw fault("INVALID_NAME");
  return value.trim();
}
function position(snapshot, now) {
  const p = snapshot.playback, item = snapshot.queue[p.index];
  if (!item) return 0;
  return Math.min(item.duration || 86400, Math.max(0, p.position + (p.playing ? Math.max(0, now - p.anchoredAt) / 1000 : 0)));
}
function validateSnapshot(value) {
  if (!object(value) || value.protocol !== 1 || !Number.isSafeInteger(value.seq) || value.seq < 0 || !Number.isFinite(value.serverTime)) throw fault("INVALID_STATE");
  const queue = tracks(value.queue), p = value.playback;
  if (value.permissionsVersion === 1 && !object(value.permissions)) throw fault("INVALID_STATE");
  if (!object(p) || !Number.isInteger(p.index) || p.index < -1 || p.index >= queue.length ||
      typeof p.playing !== "boolean" || !Number.isFinite(p.position) || p.position < 0 ||
      !Number.isFinite(p.anchoredAt) || p.position > (p.index >= 0 ? queue[p.index].duration || 86400 : 0) ||
      (p.index === -1 && p.playing) || !Array.isArray(value.members) || value.members.length > LIMITS.members) throw fault("INVALID_STATE");
  return { protocol: 1, code: roomCode(value.code), seq: value.seq, serverTime: value.serverTime, queue,
    ...(value.permissionsVersion === 1 ? { permissionsVersion: 1, permissions: permissions(value.permissions),
      actorId: typeof value.actorId === "string" && /^[a-f0-9]{24}$/.test(value.actorId) ? value.actorId : "" } : {}),
    playback: { index: p.index, playing: p.playing, position: p.position, anchoredAt: p.anchoredAt },
    members: value.members.map(member => {
      if (!object(member) || typeof member.id !== "string" || !/^[a-f0-9]{24}$/.test(member.id) || typeof member.host !== "boolean") throw fault("INVALID_STATE");
      return { id: member.id, name: name(member.name), host: member.host };
    }) };
}
module.exports = { LIMITS, PERMISSIONS, permissions, fault, object, tracks, roomCode, name, position, validateSnapshot };
