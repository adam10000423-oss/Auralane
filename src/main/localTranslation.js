const path = require("node:path");
const { spawn } = require("node:child_process");
const { app } = require("electron");

class LocalTranslationService {
  constructor() {
    this.process = null;
    this.buffer = "";
    this.sequence = 0;
    this.pending = new Map();
  }

  paths() {
    const root = app.isPackaged
      ? path.join(process.resourcesPath, "local-translate")
      : path.join(app.getAppPath(), "vendor", "local-translate");
    return {
      executable: app.isPackaged
        ? path.join(root, "runtime", "local_translate.exe")
        : path.join(root, "runtime", "local_translate.exe"),
      models: path.join(root, "models"),
      cache: path.join(app.getPath("userData"), "translation-models")
    };
  }

  ensureProcess() {
    if (this.process && !this.process.killed) return this.process;
    const locations = this.paths();
    this.process = spawn(locations.executable, [], {
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
      env: {
        ...process.env,
        PYTHONIOENCODING: "utf-8",
        AURALANE_TRANSLATION_MODELS: locations.models,
        AURALANE_TRANSLATION_CACHE: locations.cache
      }
    });
    this.process.stdout.setEncoding("utf8");
    this.process.stdout.on("data", (chunk) => this.consume(chunk));
    this.process.stderr.on("data", (chunk) => console.warn(`[offline-translate] ${String(chunk).trim()}`));
    this.process.once("error", (error) => this.failAll(error));
    this.process.once("exit", (code) => this.failAll(new Error(`Offline translation engine exited (${code ?? "unknown"}).`)));
    return this.process;
  }

  consume(chunk) {
    this.buffer += chunk;
    while (this.buffer.includes("\n")) {
      const newline = this.buffer.indexOf("\n");
      const line = this.buffer.slice(0, newline).trim();
      this.buffer = this.buffer.slice(newline + 1);
      if (!line) continue;
      try {
        const response = JSON.parse(line);
        const request = this.pending.get(response.id);
        if (!request) continue;
        this.pending.delete(response.id);
        clearTimeout(request.timer);
        if (response.ok) request.resolve(response);
        else request.reject(new Error(response.error || "Offline translation failed."));
      } catch (error) {
        console.warn("[offline-translate] Invalid response", error?.message || error);
      }
    }
  }

  failAll(error) {
    const failedProcess = this.process;
    this.process = null;
    if (failedProcess && !failedProcess.killed) failedProcess.kill();
    for (const request of this.pending.values()) {
      clearTimeout(request.timer);
      request.reject(error);
    }
    this.pending.clear();
  }

  request(payload) {
    const child = this.ensureProcess();
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        // A stuck model process must not hold the next translation hostage.
        this.failAll(new Error("Offline translation timed out."));
      }, 1800);
      this.pending.set(id, { resolve, reject, timer });
      child.stdin.write(`${JSON.stringify({ id, ...payload })}\n`, "utf8");
    });
  }

  async translateLyrics(lines = [], options = {}) {
    const texts = [];
    const indexes = [];
    const seen = new Map();
    for (const line of lines || []) {
      const text = String(line?.text || "").trim();
      if (!text || seen.has(text)) continue;
      seen.set(text, texts.length);
      texts.push(text);
    }
    const response = await this.request({
      texts,
      targetLanguage: String(options.targetLanguage || "zh-TW"),
      sourceLanguage: String(options.sourceLanguage || "auto")
    });
    return {
      provider: response.provider || "Auralane Offline",
      targetLanguage: String(options.targetLanguage || "zh-TW"),
      sourceLanguage: String(options.sourceLanguage || "auto"),
      lines: (lines || []).map((line) => {
        const text = String(line?.text || "").trim();
        const index = seen.get(text);
        return { text: Number.isInteger(index) ? String(response.translations?.[index] || "") : "" };
      })
    };
  }

  close() {
    if (this.process && !this.process.killed) this.process.kill();
    this.process = null;
    this.failAll(new Error("Offline translation engine closed."));
  }
}

module.exports = { LocalTranslationService };
