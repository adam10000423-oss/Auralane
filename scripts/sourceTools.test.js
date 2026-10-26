"use strict";

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
let chromium;
try { ({ chromium } = require("playwright-core")); } catch { /* Browser tests require an available Playwright installation. */ }
const executablePath = [process.env.SOURCE_TOOLS_BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe"].find((p) => p && fs.existsSync(p));
const available = Boolean(chromium && executablePath);
let browser;
before(async () => { if (available) browser = await chromium.launch({ executablePath, headless: true }); });
after(async () => { await browser?.close(); });

async function fixture(viewport = { width: 1000, height: 900 }) {
  const page = await browser.newPage({ viewport });
  await page.setContent('<main id="root"></main>');
  await page.addStyleTag({ path: path.resolve(__dirname, "../src/renderer/sourceTools.css") });
  await page.addScriptTag({ path: path.resolve(__dirname, "../src/renderer/sourceTools.js") });
  await page.evaluate(async () => {
    window.calls = []; window.sources = [];
    window.callbacks = {
      listSources: async () => window.sources,
      upsertSource: async (config) => {
        window.calls.push(["save", config]);
        window.sources = [...window.sources.filter((s) => s.id !== config.id), { ...config, mediaOrigins: config.mediaOrigins || [new URL(config.searchUrl).origin], health: { state: "unknown" } }];
      },
      removeSource: async (id) => { window.calls.push(["remove", id]); window.sources = window.sources.filter((s) => s.id !== id); },
      checkHealth: async (id) => { window.calls.push(["health", id]); window.sources.find((s) => s.id === id).health = { state: "healthy", latencyMs: 23 }; },
      setSourceHeaders: async (id, headers) => { window.calls.push(["headers", id, headers]); },
      queryVersions: async (track, query) => {
        window.calls.push(["query", track, query]);
        return [{ id: "v1", sourceId: "youtube", title: '<img src=x onerror="window.bad=1">', artist: "Artist", durationSeconds: 200, match: { matches: false }, manualSelection: true }];
      },
      onSelect: async (...args) => { window.calls.push(["select", ...args]); }
    };
    window.tools = window.AuralaneSourceTools.createSourceTools(document.getElementById("root"), window.callbacks);
    await window.tools.ready;
  });
  return page;
}
test("renderer settings CRUD, headers, enabled toggle and health call only supplied callbacks", { skip: !available }, async () => {
  const page = await fixture();
  try {
    await page.getByLabel("Source ID", { exact: true }).fill("catalog");
    await page.getByLabel("Name", { exact: true }).fill("Catalog");
    await page.getByLabel("Search endpoint", { exact: true }).fill("https://catalog.example/search");
    await page.getByLabel("Replace private headers (JSON)", { exact: true }).fill('{"Authorization":"Bearer private"}');
    await page.getByRole("button", { name: "Save source", exact: true }).click();
    await page.getByText("Source saved.", { exact: true }).waitFor();
    assert.equal(await page.getByLabel("Replace private headers (JSON)", { exact: true }).inputValue(), "");
    const calls = await page.evaluate(() => window.calls);
    assert.deepEqual(calls[1], ["headers", "catalog", { Authorization: "Bearer private" }]);
    assert.equal(calls[0][1].headers, undefined);
    await page.getByRole("button", { name: "Check health", exact: true }).click();
    await page.getByText("healthy (23 ms)", { exact: true }).waitFor();
    await page.getByLabel("Enable Catalog", { exact: true }).uncheck();
    await page.getByText("disabled", { exact: true }).waitFor();
    assert.equal(await page.getByRole("button", { name: "Check health", exact: true }).isDisabled(), true);
    await page.getByRole("button", { name: "Edit", exact: true }).click();
    assert.equal(await page.getByLabel("Source ID", { exact: true }).isDisabled(), true);
    await page.getByRole("button", { name: "Clear private headers", exact: true }).click();
    await page.getByText("Private headers cleared.", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Remove", exact: true }).click();
    await page.getByText("No sources configured.", { exact: true }).waitFor();
  } finally { await page.close(); }
});
test("version picker renders untrusted text safely and forwards explicit user selection", { skip: !available }, async () => {
  const page = await fixture();
  try {
    await page.evaluate(() => window.tools.showVersions({ id: "original", title: "Song", artist: "Artist" }));
    assert.equal(await page.locator(".st-version img").count(), 0);
    assert.equal(await page.evaluate(() => window.bad), undefined);
    assert.equal(await page.getByText(/Manual choice/).count(), 1);
    await page.getByRole("button", { name: /^Select / }).click();
    await page.getByText("Version selected.", { exact: true }).waitFor();
    const selection = await page.evaluate(() => window.calls.find((c) => c[0] === "select"));
    assert.equal(selection[1].id, "v1"); assert.equal(selection[2].id, "original");
  } finally { await page.close(); }
});
test("stale version results and destroyed instances cannot repopulate the UI", { skip: !available }, async () => {
  const page = await fixture();
  try {
    await page.evaluate(async () => {
      window.pending = {};
      window.callbacks.queryVersions = (_track, query) => new Promise((resolve) => { window.pending[query] = resolve; });
      window.oldQuery = window.tools.showVersions({ title: "Old", artist: "Artist" });
      window.newQuery = window.tools.showVersions({ title: "New", artist: "Artist" });
      window.pending["New Artist"]([{ id: "new", title: "New result", artist: "Artist" }]);
      await window.newQuery;
      window.pending["Old Artist"]([{ id: "old", title: "Old result", artist: "Artist" }]);
      await window.oldQuery;
    });
    assert.equal(await page.getByText("New result", { exact: true }).count(), 1);
    assert.equal(await page.getByText("Old result", { exact: true }).count(), 0);
    await page.evaluate(() => { window.tools.hideVersions(); window.tools.destroy(); });
    assert.equal(await page.locator(".source-tools").count(), 0);
  } finally { await page.close(); }
});
test("operation errors do not expose upstream secrets", { skip: !available }, async () => {
  const page = await fixture();
  try {
    await page.evaluate(async () => {
      window.callbacks.queryVersions = async () => { throw Error("Authorization secret private endpoint"); };
      await window.tools.showVersions({ title: "Song", artist: "Artist" });
    });
    assert.equal(await page.getByText("Version search failed. Try again.", { exact: true }).count(), 1);
    assert.doesNotMatch(await page.locator("#root").innerText(), /Authorization secret/);
  } finally { await page.close(); }
});
test("desktop and mobile controls fit without horizontal overflow", { skip: !available }, async () => {
  for (const width of [1000, 375]) {
    const page = await fixture({ width, height: 1000 });
    try {
      await page.evaluate(async () => {
        await window.callbacks.upsertSource({ id: "long", name: "Long source ".repeat(7), searchUrl: `https://catalog.example/${"path".repeat(35)}`, enabled: true });
        await window.tools.refresh();
        await window.tools.showVersions({ title: "Long song ".repeat(12), artist: "Artist" });
      });
      const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, width: window.innerWidth }));
      assert.ok(dimensions.scroll <= dimensions.width, JSON.stringify(dimensions));
      const buttons = await page.locator(".source-tools button:visible").evaluateAll((nodes) => nodes.map((n) => ({ width: n.clientWidth, scroll: n.scrollWidth })));
      assert.ok(buttons.every((b) => b.scroll <= b.width));
      const selectSize = await page.locator(".st-version > button").boundingBox();
      assert.ok(selectSize.width >= 72 && selectSize.height < 50, JSON.stringify(selectSize));
      await page.screenshot({ path: path.join(os.tmpdir(), `auralane-source-tools-${width}.png`), fullPage: true });
    } finally { await page.close(); }
  }
});
