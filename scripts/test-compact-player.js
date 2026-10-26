"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
test("compact player preserves original commands, fits desktop/mobile, and exposes secondary controls", async () => {
  const { chromium } = require("playwright-core"), root = path.join(__dirname, "../src/renderer");
  const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } }), errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.setContent('<!doctype html><html><body></body></html>');
    await page.evaluate(html => {
      const source = new DOMParser().parseFromString(html, "text/html"); document.body.append(source.querySelector("footer.player"));
      window.calls = []; window.language = "en"; window.glass = true;
      for (const id of ["shareButton", "currentDownloadButton", "sleepButton", "audioOutputButton", "playButton", "shuffleButton", "repeatButton", "queueButton", "lyricsButton"]) {
        const button = document.getElementById(id); button.disabled = false;
        button.addEventListener("click", () => { calls.push(id); if (id === "sleepButton") document.getElementById("sleepMenu").classList.toggle("hidden"); if (id === "audioOutputButton") document.getElementById("audioOutputMenu").classList.toggle("hidden"); });
      }
      document.getElementById("nowTitle").textContent = "Stranger Things (Alan Walker Remix) - A very long title to verify truncation";
      document.getElementById("nowSubtitle").textContent = "Kygo · OneRepublic";
    }, await fs.readFile(path.join(root, "index.html"), "utf8"));
    await page.evaluate(()=>{document.body.insertAdjacentHTML('beforeend','<div id="qualityMenu" class="quality-menu hidden"><button>High</button></div>');document.querySelector('#nowQualityButton').addEventListener('click',()=>document.querySelector('#qualityMenu').classList.toggle('hidden'));});
    for (const file of ["styles.css", "musicWorkspace.css", "compactPlayer.css", "glassRefinements.css", "workspacePolish.css"]) await page.addStyleTag({ path: path.join(root, file) });
    await page.addScriptTag({ path: path.join(root, "compactPlayer.js") });
    await page.evaluate(() => {
      window.compact = AuralaneCompactPlayer.init({ audio: document.getElementById("audio"), language: () => language, isGlass: () => glass,
        setIconButton: (b, icon, label) => { b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 12h16"/></svg>'; b.title = label; b.setAttribute("aria-label", label); } });
    });
    for (const width of [1920, 1280, 800, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const bounds = await page.locator("footer.player").evaluate(el => {
        const r = el.getBoundingClientRect(); return { height: r.height, left: r.left, right: r.right, width: innerWidth, overflow: el.scrollWidth > el.clientWidth + 1, controls: [...el.querySelectorAll('.controls button,.player-right > button')].filter(b => getComputedStyle(b).display !== "none").map(b => { const r = b.getBoundingClientRect(); return { id: b.id, left: r.left, right: r.right, top: r.top, bottom: r.bottom }; }) };
      });
      assert.equal(bounds.height, 72); assert.equal(bounds.overflow, false, JSON.stringify(bounds)); assert.ok(bounds.left >= 0 && bounds.right <= width, JSON.stringify(bounds));
      if(width>1000)assert.ok((bounds.right-bounds.left)/width<=0.601 && bounds.right-bounds.left<=1041,JSON.stringify(bounds));
      assert.equal(await page.locator(".player-right > #currentDownloadButton").count(),1);
      for (const button of bounds.controls) { assert.ok(button.left >= 0 && button.right <= width, JSON.stringify(button)); }
      assert.equal(await page.locator("#seekBar").count(), 1); assert.equal(await page.locator("#volumeBar").count(), 1);
    }
    await page.getByRole("button", { name: "More player controls" }).click();
    for (const id of ["queueButton", "lyricsButton"]) { assert.equal(await page.locator(`#${id}`).isVisible(), false); }
    for (const id of ["shuffleButton", "repeatButton"]) { assert.equal(await page.locator(`#compactMorePanel #${id}`).isVisible(), true); }
    await page.locator("#shuffleButton").click(); assert.equal(await page.evaluate(() => calls.includes("shuffleButton")), true);
    await page.locator("#shareButton").click(); assert.equal(await page.locator("#compactMorePanel").isVisible(), false);
    await page.evaluate(()=>document.addEventListener('click',event=>{const menu=document.querySelector('#sleepMenu'),button=document.querySelector('#sleepButton');if(!menu.contains(event.target)&&!button.contains(event.target))menu.classList.add('hidden');}));
    await page.getByRole("button", { name: "More player controls" }).click(); await page.locator('.compact-menu-row').filter({has:page.locator('#sleepButton')}).locator('.compact-menu-label').click(); assert.equal(await page.locator("#sleepMenu").isVisible(), true);
    assert.equal(await page.locator('body > #sleepMenu').count(),1);
    const sub=await page.locator('#sleepMenu').boundingBox(),more=await page.locator('#compactMorePanel').boundingBox();
    assert.ok(sub.x>=0&&sub.y>=0&&sub.x+sub.width<=390&&sub.y+sub.height<=900,JSON.stringify(sub));
    assert.ok(sub.x!==more.x||sub.y!==more.y);
    assert.equal(await page.locator('#compactMorePanel').isVisible(),true);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.getByRole("button", { name: "Volume", exact: true }).click(); assert.equal(await page.locator("#volumeBar").isVisible(), true);
    await page.locator("#volumeBar").fill("0.4"); assert.equal(await page.locator(".compact-volume-value").textContent(), "40%");
    await page.keyboard.press("Escape"); assert.equal(await page.locator(".compact-volume-panel").isVisible(), false);
    await page.getByRole("button", { name: "More player controls" }).click(); await page.locator("#audioOutputButton").click(); assert.equal(await page.locator("#audioOutputMenu").isVisible(), true);
    await page.locator('#nowQualityButton').click();await page.locator('#qualityMenu button').click();assert.equal(await page.locator('#compactMorePanel').isVisible(),true);
    for (const width of [390,1280]) {
      await page.setViewportSize({ width, height:900 });
      for (let cycle=0;cycle<3;cycle++) {
        await page.evaluate(() => { glass=false; compact.refresh(); });
        assert.equal(await page.locator(".player-center > .progress-row").count(),1);
        assert.equal(await page.locator(".now-title-line #nowQualityButton").count(),1);
        assert.equal(await page.locator(".player-track-actions #shareButton").count(),1);
        assert.equal(await page.locator("body.compact-player").count(),0);
        await page.evaluate(() => { glass=true; compact.refresh(); });
        assert.equal(await page.locator(".now .progress-row").count(),1);
        assert.equal(await page.locator("#compactMorePanel #shareButton").count(),1);
      }
      await page.evaluate(() => document.body.classList.add("lyrics-maximized"));
      assert.equal(await page.locator(".now").isVisible(),true); assert.equal(await page.locator(".player-right").isVisible(),true);
      const positions=await page.evaluate(()=>{const a=document.querySelector(".player-center").getBoundingClientRect(),b=document.querySelector(".now").getBoundingClientRect(),c=document.querySelector(".player-right").getBoundingClientRect();return {a:a.right,b:b.left,bRight:b.right,c:c.left};});
      assert.ok(positions.a<=positions.b && positions.bRight<=positions.c,JSON.stringify(positions));
      await page.evaluate(() => document.body.classList.remove("lyrics-maximized"));
    }
    for (const lang of ["en", "zh-TW", "zh-CN", "ja", "ko"]) await page.evaluate(lang => { language = lang; compact.refresh(); }, lang);
    await page.screenshot({ path: path.join(require("node:os").tmpdir(), "auralane-compact-player-fixture.png") });
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
