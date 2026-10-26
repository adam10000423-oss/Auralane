"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const { chromium } = require("playwright-core");
const { createRelay } = require("../server/listen-together/server");
const { createOnlineTogether } = require("../src/main/onlineTogether");

test("host/join UI synchronizes real audio timelines, restores personal queue, and fits five languages", async () => {
  const relay = createRelay();
  await new Promise(resolve => relay.server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${relay.server.address().port}`;
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const clients = [];
  let releaseCreation;
  try {
    const pages = [];
    for (let i = 0; i < 2; i++) {
      const context = await browser.newContext();
      const page = await context.newPage(); pages.push(page);
      await page.route("https://auralane-ui.test/", route => route.fulfill({ contentType: "text/html", body: '<div id="queuePane"><div class="queue-tools"></div></div><button id="playButton">Play</button><button id="prevButton">Previous</button><button id="nextButton">Next</button><input id="seekBar" type="range"><audio id="audio"></audio>' }));
      await page.goto("https://auralane-ui.test/");
      const renderer = path.join(__dirname, '../src/renderer');
      for(const match of fs.readFileSync(path.join(renderer,'index.html'),'utf8').matchAll(/<link rel="stylesheet" href="([^"]+)"/g))await page.addStyleTag({path:path.join(renderer,match[1])});
      const appSource=fs.readFileSync(path.join(renderer,'app.js'),'utf8');
      await page.addScriptTag({content:appSource.slice(appSource.indexOf('const STANDARD_ICON_PATHS ='),appSource.indexOf('function upgradeInterfaceIcons('))+appSource.slice(appSource.indexOf('function setIconButton('),appSource.indexOf('\nfunction normalizeThumbnailUrl('))});
      await page.evaluate(()=>{document.documentElement.dataset.colorScheme='dark';document.body.dataset.material='standard';});
      await page.addScriptTag({ path: path.join(__dirname, "../src/renderer/onlineTogetherTools.js") });
      const client = createOnlineTogether({ url, allowLocal: true }); clients.push(client);
      await page.exposeFunction("featureRequest", async ({ type, payload }) => {
        try {
          if (i === 0 && type === "online.create") await new Promise(resolve => { releaseCreation = resolve; });
          const value = await ({ "online.status": () => client.status(), "online.create": () => client.create(payload.name, payload.permissions),
            "online.join": () => client.join(payload.name, payload.code), "online.leave": () => client.leave(),
            "online.publish": () => client.publish(payload.tracks), "online.playback": () => client.playback(payload),
            "online.permissions": () => client.permissions(payload.permissions), "online.action": () => client.action(payload),
            "online.configure": () => client.configure(payload.url) })[type]();
          return { ok: true, value };
        } catch (error) { return { ok: false, error: { code: error.code || "failed" } }; }
      });
      client.subscribe(value => { void page.evaluate(payload => window.roomEvent?.({ type: "online.state", payload }), value).catch(() => {}); });
      await page.evaluate(async index => {
        const audio = document.querySelector("audio"); audio.muted = true;
        const bytes = new Uint8Array(44 + 8000 * 60), view = new DataView(bytes.buffer);
        const text = (offset, value) => [...value].forEach((c, n) => { bytes[offset + n] = c.charCodeAt(0); });
        text(0, "RIFF"); view.setUint32(4, bytes.length - 8, true); text(8, "WAVEfmt ");
        view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
        view.setUint32(24, 8000, true); view.setUint32(28, 8000, true); view.setUint16(32, 1, true); view.setUint16(34, 8, true);
        text(36, "data"); view.setUint32(40, bytes.length - 44, true); bytes.fill(128, 44);
        window.mediaUrl = URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
        const shared = { id: "abcdefghijk", title: "Shared song", artist: "Artist", duration: 60 };
        const personal = { id: "12345678901", title: "Personal song", artist: "Artist", duration: 60 };
        window.state = { queue: [index ? personal : shared], settings: { language: "en" }, currentTrack: null, playbackMode: "idle" };
        window.toolOptions = { state, audio,
          setIconButton,
          bridge: { featureRequest: window.featureRequest, onFeatureEvent: fn => { window.roomEvent = fn; return () => { window.roomEvent = null; }; } },
          getAccountId: () => "test", getQueue: () => state.queue, getPosition: () => audio.currentTime,
          persistQueue: async () => {}, render: () => {}, stopPlayback: () => { audio.pause(); audio.removeAttribute("src"); audio.load(); state.currentTrack = null; state.playbackMode = "idle"; },
          playTrack: async track => { if (!audio.muted) throw Error("Room tracks must load silently"); state.currentTrack = track; state.playbackMode = "audio"; audio.src = mediaUrl; await audio.play(); return true; } };
        window.controls = AuralaneOnlineTogether.init(toolOptions);
        await controls.ready;
      }, i);
    }
    const [host, guest] = pages;
    await host.locator(".online-room-launcher").click();
    await host.locator(".online-room-entry > label input").fill("Host");
    await host.getByRole("button", { name: "Create room", exact: true }).click();
    assert.equal(await host.getByRole('button',{name:'Creating…',exact:true}).getAttribute('aria-busy'),'true');
    assert.equal(await host.getByRole('button',{name:'Creating…',exact:true}).isDisabled(),true);
    releaseCreation();
    await host.waitForFunction(() => document.querySelector(".online-room-connection").textContent.includes("Connected"));
    const code = await host.locator(".online-room-code-row strong").textContent();
    await guest.locator(".online-room-launcher").click();
    await guest.locator(".online-room-entry > label input").fill("Guest");
    await guest.evaluate(() => { document.querySelector("audio").muted = false; });
    await guest.locator(".online-room-divider input").fill(code);
    await guest.getByRole("button", { name: "Join room", exact: true }).click();
    await guest.waitForFunction(() => controls.isGuest());
    await host.evaluate(async () => {
      const audio = document.querySelector("audio");
      state.currentTrack = state.queue[0]; state.playbackMode = "audio"; audio.src = mediaUrl;
      await audio.play(); audio.currentTime = 10;
    });
    await guest.waitForFunction(() => state.currentTrack?.id === "abcdefghijk" && !document.querySelector("audio").paused && document.querySelector("audio").currentTime > 9, { timeout: 15000 });
    const hostTime = await host.evaluate(() => document.querySelector("audio").currentTime);
    const guestTime = await guest.evaluate(() => document.querySelector("audio").currentTime);
    assert.equal(await guest.evaluate(() => document.querySelector("audio").muted), false);
    assert(Math.abs(hostTime - guestTime) < 0.8, `Timelines differ: ${hostTime}, ${guestTime}`);
    await host.evaluate(() => { const audio = document.querySelector("audio"); audio.pause(); audio.currentTime = 25; });
    await guest.waitForFunction(() => document.querySelector("audio").paused && Math.abs(document.querySelector("audio").currentTime - 25) < 0.6);
    assert.equal(await guest.locator('#playButton').isDisabled(),true);
    assert.equal(await guest.evaluate(()=>controls.can('add')),true);
    assert.equal(await guest.evaluate(()=>controls.perform('playPause',{playing:true})),false);
    await host.locator('.online-room-settings-button').click();
    for(const key of ['playPause','seek','skip','reorder','remove']){
      await host.locator(`[data-room-permission="${key}"]`).check();
      await host.waitForFunction(key=>!document.querySelector(`[data-room-permission="${key}"]`).disabled,key);
      await guest.waitForFunction(key=>controls.can(key),key);
    }
    assert.equal(await guest.locator('#playButton').isDisabled(),false);
    assert.equal(await guest.evaluate(()=>controls.perform('playPause',{playing:true})),true);
    await host.waitForFunction(()=>!document.querySelector('audio').paused);
    assert.equal(await guest.evaluate(()=>controls.perform('seek',{position:18})),true);
    await host.waitForFunction(()=>Math.abs(document.querySelector('audio').currentTime-18)<1.5);
    assert.equal(await guest.evaluate(()=>controls.enqueue([
      {id:'lmnopqrstuv',title:'Member song A',artist:'Artist',duration:60},
      {id:'zyxwvutsrqp',title:'Member song B',artist:'Artist',duration:60}
    ])),true);
    await host.waitForFunction(()=>state.queue.length===3);
    assert.equal(await guest.evaluate(()=>controls.perform('reorder',{trackId:'zyxwvutsrqp',beforeId:'abcdefghijk'})),true);
    await host.waitForFunction(()=>state.queue[0]?.id==='zyxwvutsrqp');
    assert.equal(await host.evaluate(()=>state.currentTrack.id),'abcdefghijk');
    assert.equal(await guest.evaluate(()=>controls.perform('remove',{trackId:'lmnopqrstuv'})),true);
    await host.waitForFunction(()=>state.queue.length===2);
    assert.equal(await guest.evaluate(()=>controls.perform('skip',{direction:-1})),true);
    await host.waitForFunction(()=>state.currentTrack?.id==='zyxwvutsrqp'&&!document.querySelector('audio').paused);
    await guest.waitForFunction(()=>state.currentTrack?.id==='zyxwvutsrqp');
    await host.locator('[data-room-permission="playPause"]').uncheck();
    await guest.waitForFunction(()=>!controls.can('playPause'));
    assert.equal(await guest.locator('#playButton').isDisabled(),true);
    assert.equal(await guest.evaluate(()=>controls.perform('playPause',{playing:false})),false);
    assert.equal(await host.evaluate(()=>JSON.parse(localStorage.getItem('auralane:room-permissions:test')).playPause),false);
    await guest.locator('.online-room-settings-button').click();
    assert.equal(await guest.locator('[data-room-permission="add"]').isDisabled(),true);
    for(const scheme of ['dark','light'])for(const material of ['standard','glass']){
      await host.evaluate(({scheme,material})=>{document.documentElement.dataset.colorScheme=scheme;document.body.dataset.material=material;},{scheme,material});
      assert.equal(await host.locator('.online-room-dialog').first().evaluate(el=>el.scrollWidth>el.clientWidth+1),false);
      const settings=await host.locator('.online-room-settings-button').boundingBox(),close=await host.locator('.online-room-head > .icon-button').last().boundingBox();
      assert.ok(Math.abs(settings.y+settings.height/2-close.y-close.height/2)<1);
      await host.screenshot({path:path.join(require('node:os').tmpdir(),`auralane-host-permissions-${scheme}-${material}.png`)});
    }
    for (const language of ["en", "zh-TW", "zh-CN", "ja", "ko"]) {
      for (const width of [390, 1280]) {
        await guest.setViewportSize({ width, height: 820 });
        await guest.evaluate(async language => { state.settings.language = language; await controls.refresh(); }, language);
        assert.equal(await guest.evaluate(() => { const d = document.querySelector("dialog"); return d.scrollWidth > d.clientWidth + 1; }), false);
      }
    }
    await guest.evaluate(async () => { state.settings.language = "en"; await controls.refresh(); });
    await guest.getByRole("button", { name: "Leave room", exact: true }).click();
    await guest.waitForFunction(() => !controls.isGuest() && state.queue[0]?.id === "12345678901");
    assert.equal(await guest.locator('#playButton').isDisabled(),false);
    assert.equal(await guest.evaluate(() => document.querySelector("audio").paused), true);
    assert.equal(await guest.evaluate(async () => {
      await controls.dispose();
      const queue = [...state.queue];
      localStorage.setItem("auralane:online-room-backup:test", JSON.stringify({ version: 1, queue, track: null, position: 0, source: null }));
      state.queue = [{ id: "abcdefghijk", title: "Room song", artist: "Artist", duration: 60 }];
      window.controls = AuralaneOnlineTogether.init(toolOptions); await controls.ready;
      return state.queue[0].id === "12345678901" && localStorage.getItem("auralane:online-room-backup:test") === null;
    }), true);
    await host.getByRole('button',{name:'End room',exact:true}).click();
    await host.locator('.online-room-confirmation').getByRole('button',{name:'Cancel',exact:true}).click();
    assert.equal(await host.evaluate(()=>controls.isActive()),true);
    await host.getByRole('button',{name:'End room',exact:true}).click();
    await host.locator('.online-room-confirmation').getByRole('button',{name:'End room',exact:true}).click();
    await host.waitForFunction(()=>!controls.isActive());
    assert.equal(clients[0].status().enabled,false);
    for (const page of pages) await page.evaluate(() => controls.dispose());
  } finally {
    for (const client of clients) await client.dispose();
    await browser.close(); await relay.close();
  }
});
