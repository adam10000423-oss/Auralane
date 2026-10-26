"use strict";
const assert = require("node:assert/strict");
const { createOnlineTogether } = require("../src/main/onlineTogether");
async function waitFor(check) {
  const deadline = Date.now() + 15000;
  while (!check()) {
    if (Date.now() > deadline) throw Error("Live synchronization timed out");
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
async function verify(url) {
  const host = createOnlineTogether({ url }), guest = createOnlineTogether({ url });
  try {
    await host.create("Auralane verification host"); await waitFor(() => host.status().connected);
    assert.equal(host.status().state.permissionsVersion, 1);
    await host.publish([
      { id:"abcdefghijk", title:"Connection check", artist:"Auralane", duration:180 },
      { id:"12345678901", title:"Permission check", artist:"Auralane", duration:180 }
    ]);
    await host.playback({ index:0, playing:false, position:12 });
    await guest.join("Auralane verification member", host.status().code); await waitFor(() => guest.status().connected);
    await assert.rejects(guest.action({ action:"playPause", playing:true }), error => error.code === "PERMISSION_DENIED");
    await host.permissions({ ...host.status().state.permissions, playPause:true, seek:true, reorder:true });
    await waitFor(() => guest.status().state.permissions.playPause);
    await guest.action({ action:"playPause", playing:false });
    await guest.action({ action:"seek", position:24 });
    await waitFor(() => host.status().state.playback.position === 24);
    await guest.action({ action:"reorder", trackId:"12345678901", beforeId:"abcdefghijk" });
    await waitFor(() => host.status().state.queue[0].id === "12345678901");
    assert.equal(host.status().state.queue[host.status().state.playback.index].id, "abcdefghijk");
    await guest.action({ action:"add", tracks:[{ id:"lmnopqrstuv", title:"Append check", artist:"Auralane", duration:180 }] });
    await waitFor(() => host.status().state.queue.length === 3);
    await host.permissions({ ...host.status().state.permissions, add:false, playPause:false });
    await waitFor(() => !guest.status().state.permissions.add);
    await assert.rejects(guest.action({ action:"add", tracks:[] }), error => error.code === "PERMISSION_DENIED");
    await assert.rejects(guest.action({ action:"playPause", playing:true }), error => error.code === "PERMISSION_DENIED");
    console.log(JSON.stringify({ server:url, permissionsVersion:1, websocket:true, hostSettings:true,
      memberActions:true, liveRevocation:true, currentSongPreserved:true }));
  } finally {
    await guest.dispose(); await host.dispose();
    console.log(JSON.stringify({ verificationRoomClosed:!host.status().enabled }));
  }
}
if (require.main === module) verify(process.argv[2]).catch(error => {
  console.error(JSON.stringify({ error:error.code || error.message })); process.exitCode = 1;
});
