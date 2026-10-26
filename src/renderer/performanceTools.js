/* Standalone integration (load performanceTools.css separately):
 * const tools = AuralanePerformanceTools.init({ container, getAnalyser: () => analyserNode,
 *   isPlaying: () => state.playing, getTrackId: () => state.currentTrack?.id,
 *   audio: els.audio, language: () => state.settings.language, settings: savedSettings,
 *   onSettingsChange: settings => persist(settings),
 *   onPerformanceChange: policy => updateHostRenderPolicy(policy),
 *   onApplyCrossfade: seconds => applyCrossfadeSeconds(seconds) });
 * Call refresh() after track/playback changes not represented by audio events.
 * Host RAF loops must consume policy.visualizerFps/animations; CSS cannot stop JS.
 * setArtwork(url) replaces the current user-configured HTTPS video (never a search).
 * destroy() releases timers, media and listeners. No audio graph/rate changes.
 * Pure tests: node src/renderer/performanceTools.js
 */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AuralanePerformanceTools = api;
})(typeof window === "object" ? window : null, function () {
  "use strict";
  const LIMITS = Object.freeze({ bins: 256, frames: 1500, onsets: 128, windowMs: 30000, minBpm: 60, maxBpm: 180 });
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const median = values => {
    const sorted = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length ? (sorted[middle] + sorted[Math.max(0, Math.ceil(sorted.length / 2) - 1)]) / 2 : 0;
  };
  const keys = ["title", "power", "motion", "analysis", "adaptive", "video", "url", "save", "clear", "apply", "idle", "waiting", "uncertain", "bpm", "suggestion", "invalid", "failed", "unavailable", "seconds"];
  const rows = {
    en: ["Performance", "Low power", "Reduce animations", "Analyze tempo", "Adaptive crossfade suggestion", "Video artwork", "HTTPS video URL", "Save", "Clear", "Apply crossfade", "Analysis off", "Listening for onsets", "Tempo uncertain", "Estimated BPM", "Suggested crossfade", "Enter an HTTPS URL without credentials.", "Video could not play.", "Audio analysis unavailable", "seconds"],
    "zh-TW": ["效能", "低耗電", "減少動畫", "分析節奏", "自適應淡入淡出建議", "動態影片封面", "HTTPS 影片網址", "儲存", "清除", "套用淡入淡出", "分析已關閉", "正在偵測起音", "節奏不確定", "預估 BPM", "建議淡入淡出", "請輸入不含帳密的 HTTPS 網址。", "無法播放影片。", "無法分析音訊", "秒"],
    "zh-CN": ["性能", "低功耗", "减少动画", "分析节奏", "自适应淡入淡出建议", "动态视频封面", "HTTPS 视频网址", "保存", "清除", "应用淡入淡出", "分析已关闭", "正在检测起音", "节奏不确定", "预估 BPM", "建议淡入淡出", "请输入不含账号密码的 HTTPS 网址。", "无法播放视频。", "无法分析音频", "秒"],
    ja: ["パフォーマンス", "省電力", "アニメーションを減らす", "テンポを分析", "クロスフェードの自動提案", "動画アートワーク", "HTTPS 動画 URL", "保存", "クリア", "クロスフェードを適用", "分析オフ", "オンセットを検出中", "テンポ不明", "推定 BPM", "推奨クロスフェード", "認証情報のない HTTPS URL を入力してください。", "動画を再生できません。", "音声分析を利用できません", "秒"],
    ko: ["성능", "저전력", "애니메이션 줄이기", "템포 분석", "적응형 크로스페이드 제안", "동영상 아트워크", "HTTPS 동영상 URL", "저장", "지우기", "크로스페이드 적용", "분석 꺼짐", "온셋 감지 중", "템포 불확실", "예상 BPM", "권장 크로스페이드", "인증 정보가 없는 HTTPS URL을 입력하세요.", "동영상을 재생할 수 없습니다.", "오디오 분석을 사용할 수 없음", "초"]
  };
  const dictionaries = Object.freeze(Object.fromEntries(Object.entries(rows).map(([lang, values]) =>
    [lang, Object.freeze(Object.fromEntries(keys.map((key, i) => [key, values[i]])))])));

  function validateArtworkUrl(value) {
    if (typeof value !== "string" || value.length > 4096) return null;
    if (!value.trim()) return "";
    if(/^\/artwork-video\/[a-f0-9-]{36}$/.test(value.trim()))return value.trim();
    try {
      const url = new URL(value.trim());
      return url.protocol === "https:" && !url.username && !url.password && url.hostname ? url.href : null;
    } catch { return null; }
  }

  function youtubeArtworkId(value){
    try{
      const url=new URL(value);
      if(url.protocol!=="https:"||url.username||url.password)return null;
      const host=url.hostname.toLowerCase(),parts=url.pathname.split("/").filter(Boolean);
      const id=host==="youtu.be"?parts[0]:["youtube.com","www.youtube.com","m.youtube.com","music.youtube.com","www.youtube-nocookie.com"].includes(host)?url.pathname==="/watch"?url.searchParams.get("v"):["embed","shorts","live"].includes(parts[0])?parts[1]:null:null;
      return /^[A-Za-z0-9_-]{11}$/.test(id||"")?id:null;
    }catch{return null;}
  }

  function normalizeSettings(value = {}) {
    if (!value || typeof value !== "object" || Array.isArray(value)) value = {};
    return { lowPower: value.lowPower === true, reducedMotion: value.reducedMotion === true,
      analysis: value.analysis === true, adaptive: value.adaptive === true,
      video: value.video === true, artworkUrl: validateArtworkUrl(value.artworkUrl) || "",artworkName:String(value.artworkName||"").slice(0,200) };
  }

  // Adjacent intervals avoid quadratic pair comparisons. Require consistent evidence,
  // and abstain instead of folding arbitrary intervals into plausible tempo values.
  function estimateTempo(onsets) {
    const times = Array.from(onsets || []).slice(-LIMITS.onsets).filter(Number.isFinite);
    const intervals = [];
    for (let i = 1; i < times.length; i++) {
      const delta = times[i] - times[i - 1];
      if (delta >= 60000 / LIMITS.maxBpm - 25 && delta <= 60000 / LIMITS.minBpm + 25) intervals.push(delta);
    }
    if (intervals.length < 7) return { bpm: null, confidence: 0, onsets: times.length };
    let cluster = [];
    for (const interval of intervals) {
      const nearby = intervals.filter(value => Math.abs(value - interval) <= interval * 0.07);
      if (nearby.length > cluster.length) cluster = nearby;
    }
    const period = cluster.reduce((sum, value) => sum + value, 0) / cluster.length;
    const deviation = median(cluster.map(value => Math.abs(value - period))) / period;
    const confidence = clamp(cluster.length / Math.max(1, times.length - 1) * (1 - deviation * 4), 0, 1);
    const bpm = Math.round(60000 / period * 10) / 10;
    return { bpm: confidence >= 0.65 && bpm >= 59.5 && bpm <= 180.5 ? clamp(bpm, 60, 180) : null,
      confidence, onsets: times.length };
  }

  function suggestCrossfade(result, maxSeconds = 12) {
    if (!result || !Number.isFinite(result.bpm) || result.bpm < 60 || result.bpm > 180 ||
        !Number.isFinite(result.confidence) || result.confidence < 0.65) return null;
    const maximum = Number.isFinite(maxSeconds) ? clamp(maxSeconds, 0, 12) : 12;
    // Four measured beats of overlap, not beat alignment or tempo stretching.
    return Math.round(Math.min(maximum, 240 / result.bpm) * 10) / 10;
  }

  function createAnalysis() {
    let previous = null, frames = [], onsets = [], lastTime = -Infinity, lastOnset = -Infinity;
    function reset() { previous = null; frames = []; onsets = []; lastTime = -Infinity; lastOnset = -Infinity; }
    function push(spectrum, time) {
      if (!spectrum || !Number.isFinite(time) || spectrum.length < 1 || spectrum.length > 32768) return false;
      if (time <= lastTime) return false;
      if (time - lastTime > 500) reset();
      lastTime = time;
      const size = Math.min(LIMITS.bins, spectrum.length);
      const current = new Float32Array(size);
      let flux = 0, energy = 0;
      for (let i = 0; i < size; i++) {
        const value = Number.isFinite(spectrum[i]) ? clamp(spectrum[i], 0, 255) / 255 : 0;
        current[i] = value;
        energy += value;
        if (previous?.length === size) flux += Math.max(0, value - previous[i]);
      }
      flux /= size;
      const recent = frames.filter(frame => time - frame.time <= 1500).map(frame => frame.flux);
      const baseline = median(recent);
      const spread = median(recent.map(value => Math.abs(value - baseline)));
      const onset = recent.length >= 8 && energy / size > 0.015 &&
        flux > Math.max(0.018, baseline + 3 * spread) && time - lastOnset >= 280;
      if (onset) { onsets.push(time); lastOnset = time; }
      frames.push({ time, flux });
      frames = frames.filter(frame => time - frame.time <= LIMITS.windowMs).slice(-LIMITS.frames);
      onsets = onsets.filter(value => time - value <= LIMITS.windowMs).slice(-LIMITS.onsets);
      previous = current;
      return onset;
    }
    return { push, reset, result: () => estimateTempo(onsets),
      stats: () => ({ frames: frames.length, onsets: onsets.length, bins: previous?.length || 0 }) };
  }

  function init(options = {}) {
    const container = options.container;
    const doc = container?.ownerDocument;
    if (!doc || !container.appendChild) throw new TypeError("container element is required");
    const win = doc.defaultView;
    const scope = options.motionRoot || doc.documentElement;
    if (scope.hasAttribute("data-auralane-performance")) throw new Error("Performance tools already initialized for this root");
    const media = win.matchMedia?.("(prefers-reduced-motion: reduce)");
    const engine = createAnalysis();
    let settings = normalizeSettings(options.settings), disposed = false, timer = null, analyser = null, buffer = null;
    let track = options.getTrackId?.(), policy, lastResultAt = -Infinity, status = "idle", videoError = false,videoErrorCode=null;
    let result = { bpm: null, confidence: 0 }, seconds = null, generation = 0, currentUrl = "", suspended = false,youtube=null,imageMode=false,downloading=false,downloadPercent=null;
    const removers = [], labels = [], controls = {};
    const panel = doc.createElement("section");
    panel.className = "auralane-performance-tools";
    const t = key => {
      const lang = typeof options.language === "function" ? options.language() : options.language || "en";
      const translated = options.translate?.(`performance.${key}`, lang);
      return translated && translated !== `performance.${key}` ? translated : (dictionaries[lang] || dictionaries.en)[key];
    };
    const text = (element, key) => { labels.push([element, key]); element.textContent = t(key); return element; };
    const listen = (target, event, fn) => {
      target?.addEventListener?.(event, fn);
      removers.push(() => target?.removeEventListener?.(event, fn));
    };
    const heading = text(doc.createElement("h3"), "title");
    panel.appendChild(heading);
    for (const key of ["lowPower", "reducedMotion", "analysis", "adaptive", "video"]) {
      const label = doc.createElement("label"), input = doc.createElement("input");
      input.type = "checkbox";
      controls[key] = input;
      label.className = "apt-toggle";
      label.append(input, text(doc.createElement("span"), { lowPower: "power", reducedMotion: "motion" }[key] || key));
      listen(input, "change", () => updateSettings({ [key]: input.checked }));
      panel.appendChild(label);
    }
    const form = doc.createElement("form"), urlLabel = text(doc.createElement("label"), "url");
    const videoLabel = () => ({"zh-TW":"YouTube、影片或圖片網址","zh-CN":"YouTube、视频或图片网址",ja:"YouTube・動画・画像 URL",ko:"YouTube, 동영상 또는 이미지 URL"})[typeof options.language === "function" ? options.language() : options.language] || "YouTube, video or image URL";
    form.className = "apt-artwork-form";
    const input = doc.createElement("input");
    input.type = "url"; input.maxLength = 4096; input.autocomplete = "off"; input.placeholder = "https://youtu.be/…";
    urlLabel.appendChild(input);
    const save = text(doc.createElement("button"), "save"), clear = text(doc.createElement("button"), "clear");
    save.type = "submit"; clear.type = "button";
    const choose=doc.createElement("button");choose.type="button";choose.hidden=typeof options.chooseVideo!=="function";
    const fileName=doc.createElement("span");fileName.className="apt-artwork-file-name";fileName.dataset.i18nSkip="";
    form.append(urlLabel, save, choose, clear,fileName);
    listen(form, "submit", event => { event.preventDefault(); setArtwork(input.value); });
    listen(clear, "click", () => {setArtwork("");Promise.resolve(options.clearLocalVideo?.()).catch(()=>{if(!disposed)artworkMessage.textContent=t("failed");});});
    listen(choose,"click",async()=>{choose.disabled=true;const owner=options.getAccountId?.();try{const result=await options.chooseVideo();if(disposed||owner!==options.getAccountId?.()||result?.canceled)return;if(result?.url)setArtwork(result.url,result.name);}catch{artworkMessage.textContent=t("failed");}finally{choose.disabled=false;}});
    const output = doc.createElement("output"), message = doc.createElement("p");
    output.className = "apt-result"; message.className = "apt-status"; message.setAttribute("role", "status");
    const apply = text(doc.createElement("button"), "apply");
    apply.type = "button";
    listen(apply, "click", () => { if (seconds !== null && options.onApplyCrossfade) options.onApplyCrossfade(seconds); });
    const video = doc.createElement("video");
    const artworkMessage = doc.createElement("p"); artworkMessage.className = "apt-artwork-status"; artworkMessage.setAttribute("role", "status");
    video.className = "apt-artwork"; video.muted = true; video.defaultMuted = true;
    video.loop = true; video.playsInline = true; video.preload = "none";
    video.setAttribute("aria-hidden", "true"); video.disablePictureInPicture = true;
    video.hidden = true;
    const youtubeMount=doc.createElement("div");youtubeMount.className="apt-youtube-artwork";youtubeMount.hidden=true;
    const image=doc.createElement("img");image.className="apt-background-image";image.alt="";image.hidden=true;image.referrerPolicy="no-referrer";
    panel.append(form, artworkMessage, output, apply, message, video,youtubeMount,image);
    container.appendChild(panel);

    function playing() { return options.isPlaying ? options.isPlaying() === true : Boolean(options.audio && !options.audio.paused && !options.audio.ended); }
    function eligible() { return !disposed && !suspended && !doc.hidden && !options.audio?.seeking && playing(); }
    function render() {
      for (const [element, key] of labels) {
        if (element === urlLabel) element.firstChild.textContent = videoLabel();
        else if(key==="video")element.textContent=({"zh-TW":"影片／圖片背景","zh-CN":"视频／图片背景",ja:"動画／画像背景",ko:"동영상 / 이미지 배경"})[typeof options.language==="function"?options.language():options.language]||"Video background";
        else element.textContent = t(key);
      }
      for (const key of Object.keys(controls)) controls[key].checked = settings[key];
      form.hidden = !settings.video;
      if (doc.activeElement !== input) input.value = settings.artworkUrl.startsWith("/artwork-video/")?"":settings.artworkUrl;
      fileName.textContent=settings.artworkUrl.startsWith("/artwork-video/")?settings.artworkName:"";
      choose.textContent=({"zh-TW":"選擇影片或圖片","zh-CN":"选择视频或图片",ja:"動画・画像を選択",ko:"동영상 또는 이미지 선택"})[typeof options.language==="function"?options.language():options.language]||"Choose video or image";
      seconds = settings.adaptive && settings.analysis ? suggestCrossfade(result, options.maxCrossfadeSeconds) : null;
      output.textContent = result.bpm && settings.analysis ? `${t("bpm")}: ${result.bpm} | ${Math.round(result.confidence * 100)}%` : t(status);
      if (seconds !== null) output.textContent += ` | ${t("suggestion")}: ${seconds} ${t("seconds")}`;
      apply.hidden = !settings.adaptive;
      apply.disabled = seconds === null || typeof options.onApplyCrossfade !== "function";
      const lang=typeof options.language==="function"?options.language():options.language;
      save.disabled=downloading;form.setAttribute("aria-busy",String(downloading));
      const embedDenied=({"zh-TW":"這部 YouTube 影片不允許嵌入播放，請換其他影片或本機檔案。","zh-CN":"此 YouTube 视频不允许嵌入播放，请换其他视频或本地文件。",ja:"この YouTube 動画は埋め込み再生できません。別の動画かローカルファイルを選択してください。",ko:"이 YouTube 동영상은 삽입 재생이 허용되지 않습니다. 다른 동영상이나 로컬 파일을 선택하세요."})[lang]||"This YouTube video does not allow embedded playback. Choose another video or a local file.";
      const downloadText=({"zh-TW":"正在下載背景影片…","zh-CN":"正在下载背景视频…",ja:"背景動画をダウンロード中…",ko:"배경 동영상 다운로드 중…"})[lang]||"Downloading background video…";
      artworkMessage.textContent = downloading ? downloadText+(downloadPercent===null?"":` ${downloadPercent}%`) : videoError ? [101,150].includes(videoErrorCode)?embedDenied:t("failed")+(videoErrorCode?` (YouTube ${videoErrorCode})`:"") : "";
    }
    function unloadVideo() {
      youtube?.destroy();youtube=null;youtubeMount.hidden=true;
      downloading=false;
      image.hidden=true;image.removeAttribute("src");imageMode=false;
      doc.body.classList.remove("has-media-background");
      generation++; currentUrl = ""; video.pause(); video.removeAttribute("src"); video.load(); video.hidden = true;
    }
    function syncVideo() {
      form.hidden = !settings.video;
      const target = options.artworkTarget?.();
      const destination=target||form.parentElement;
      if(image.parentElement!==destination)destination?.append(image);
      if(youtubeMount.parentElement!==destination){youtube?.destroy();youtube=null;if(youtubeArtworkId(currentUrl))currentUrl="";destination?.append(youtubeMount);}
      if (target && video.parentElement !== target) target.append(video);
      else if (!target && form.parentElement && video.parentElement !== form.parentElement) form.parentElement.append(video);
      const preview = !target && form.getClientRects().length > 0;
      video.controls = preview; video.setAttribute("aria-hidden", String(!preview));
      const isImage=currentUrl===settings.artworkUrl&&imageMode||/\.(?:png|jpe?g|webp|gif|avif)(?:[?#]|$)/i.test(settings.artworkName||settings.artworkUrl);
      const moving=options.background||playing();
      const allowed = !disposed && !suspended && !doc.hidden && (preview || target && (options.background||eligible())) && settings.video && (isImage||!policy.reducedMotion&&!settings.lowPower) && settings.artworkUrl && (!options.isOffline?.()||settings.artworkUrl.startsWith("/artwork-video/"));
      if (!allowed) { if (currentUrl) unloadVideo(); return; }
      if (currentUrl === settings.artworkUrl) { if (!downloading&&!videoError&&!isImage&&target && moving) void video.play()?.catch(() => {}); return; }
      currentUrl = settings.artworkUrl; videoError = false;videoErrorCode=null;
      const token = ++generation;
      doc.body.classList.toggle("has-media-background",Boolean(options.background));
      imageMode=false;
      if(isImage){imageMode=true;video.hidden=true;youtubeMount.hidden=true;image.hidden=false;image.src=currentUrl;return;}
      const youtubeId=youtubeArtworkId(currentUrl);
      if(youtubeId){
        video.hidden=true;youtubeMount.hidden=true;doc.body.classList.remove("has-media-background");
        if(typeof options.downloadVideo!=="function"){videoError=true;render();return;}
        const owner=options.getAccountId?.();downloading=true;downloadPercent=null;render();
        void options.downloadVideo(currentUrl,progress=>{if(disposed||token!==generation||!downloading)return;const percent=progress.total>0?Math.min(100,Math.floor(progress.bytes/progress.total*100)):null;if(percent!==downloadPercent){downloadPercent=percent;render();}}).then(local=>{
          if(disposed||token!==generation||owner!==options.getAccountId?.())return;
          if(!/^\/artwork-video\/[a-f0-9-]{36}$/.test(local?.url||""))throw new Error("Invalid downloaded background.");
          downloading=false;currentUrl="";updateSettings({artworkUrl:local.url,artworkName:local.name||"background.mp4"});
        }).catch(error=>{if(disposed||token!==generation)return;downloading=false;videoError=true;artworkMessage.title=error?.message||"";render();});return;
      }
      video.src = currentUrl; video.hidden = false;
      video.preload = preview ? "auto" : "metadata";
      const promise = moving ? video.play() : (video.load(), null);
      promise?.catch(() => { if (!disposed && token === generation) { videoError = true; video.pause(); video.hidden = true; render(); } });
    }
    function clearAnalysis() {
      engine.reset(); result = { bpm: null, confidence: 0 }; lastResultAt = -Infinity;
      analyser = null; buffer = null;
    }
    function tick() {
      timer = null;
      if (!eligible() || !settings.analysis) return;
      try {
        const nextTrack = options.getTrackId?.();
        if (nextTrack !== track) { track = nextTrack; clearAnalysis(); }
        const next = options.getAnalyser?.();
        const count = next?.frequencyBinCount;
        if (!next?.getByteFrequencyData || !Number.isInteger(count) || count < 1 || count > 32768) {
          clearAnalysis(); status = "unavailable";
        } else {
          if (next !== analyser || buffer?.length !== count) { clearAnalysis(); analyser = next; buffer = new Uint8Array(count); }
          next.getByteFrequencyData(buffer);
          const now = win.performance.now();
          engine.push(buffer, now);
          if (now - lastResultAt >= 1000) {
            result = engine.result(); lastResultAt = now;
            status = result.onsets >= 8 && !result.bpm ? "uncertain" : "waiting";
          }
        }
      } catch { clearAnalysis(); status = "unavailable"; }
      render(); schedule();
    }
    function schedule() {
      if (timer === null && eligible() && settings.analysis) timer = win.setTimeout(tick, settings.lowPower ? 100 : 20);
    }
    function refresh() {
      if (disposed) return;
      const nextTrack = options.getTrackId?.();
      if (nextTrack !== track) { track = nextTrack; clearAnalysis(); }
      const reducedMotion = settings.reducedMotion || Boolean(media?.matches) || settings.lowPower;
      const nextPolicy = { lowPower: settings.lowPower, reducedMotion, hidden: doc.hidden || suspended,
        animations: !reducedMotion && !doc.hidden && !suspended, visualizerFps: doc.hidden || suspended || reducedMotion ? 0 : 60 };
      const changed = JSON.stringify(nextPolicy) !== JSON.stringify(policy);
      policy = Object.freeze(nextPolicy);
      scope.setAttribute("data-auralane-performance", "active");
      scope.classList.toggle("apt-low-power", settings.lowPower);
      scope.classList.toggle("apt-reduced-motion", reducedMotion);
      if (timer !== null) { win.clearTimeout(timer); timer = null; }
      if (!eligible() || !settings.analysis) clearAnalysis();
      status = settings.analysis ? "waiting" : "idle";
      syncVideo(); render(); schedule();
      if (changed) options.onPerformanceChange?.(policy);
    }
    function updateSettings(patch) {
      if (disposed) return;
      settings = normalizeSettings({ ...settings, ...patch });
      refresh(); options.onSettingsChange?.({ ...settings });
    }
    function loadSettings(value) {
      if (disposed) return;
      settings = normalizeSettings(value);
      videoError = false;
      clearAnalysis();
      refresh();
    }
    function setArtwork(url,name="") {
      if (disposed) return false;
      const valid = validateArtworkUrl(url);
      if (valid === null) { artworkMessage.textContent = t("invalid"); return false; }
      if(valid?.startsWith("https:") && (["youtube.com","www.youtube.com","m.youtube.com","music.youtube.com","youtu.be","www.youtube-nocookie.com"].includes(new URL(valid).hostname)&&!youtubeArtworkId(valid)||new URL(valid).hostname==="open.spotify.com")){artworkMessage.textContent=t("invalid");return false;}
      videoError = false;
      if (currentUrl) unloadVideo();
      updateSettings({ artworkUrl: valid, artworkName:name,video: Boolean(valid) }); input.value = valid.startsWith("/artwork-video/")?"":valid; return true;
    }
    listen(video, "error", () => { if (currentUrl) { videoError = true; video.hidden = true; video.pause();image.src=currentUrl;image.hidden=false;render(); } });
    listen(image,"load",()=>{if(currentUrl&&image.src){imageMode=true;videoError=false;doc.body.classList.toggle("has-media-background",Boolean(options.background));render();}});
    listen(image,"error",()=>{if(currentUrl){videoError=true;image.hidden=true;doc.body.classList.remove("has-media-background");render();}});
    listen(doc, "visibilitychange", refresh);
    listen(win,"resize",refresh);
    listen(win, "pagehide", () => { suspended = true; refresh(); });
    listen(win, "pageshow", () => { suspended = false; refresh(); });
    listen(media, "change", refresh);
    for (const event of ["play", "pause", "ended", "emptied", "loadedmetadata", "seeking", "seeked"]) listen(options.audio, event, refresh);
    refresh();
    return { refresh, updateSettings, loadSettings, setArtwork, getSettings: () => ({ ...settings }), getPolicy: () => policy,
      getAnalysis: () => ({ ...result }), destroy() {
        if (disposed) return;
        disposed = true;
        if (timer !== null) win.clearTimeout(timer);
        removers.forEach(remove => remove()); unloadVideo(); clearAnalysis(); video.remove();youtubeMount.remove();image.remove(); panel.remove();
        scope.classList.remove("apt-low-power", "apt-reduced-motion"); scope.removeAttribute("data-auralane-performance");
        options.onPerformanceChange?.(Object.freeze({ lowPower: false, reducedMotion: Boolean(media?.matches),
          hidden: doc.hidden, animations: !media?.matches && !doc.hidden, visualizerFps: media?.matches || doc.hidden ? 0 : 60 }));
      } };
  }
  return Object.freeze({ init, createAnalysis, estimateTempo, suggestCrossfade, validateArtworkUrl,youtubeArtworkId, normalizeSettings, dictionaries, LIMITS });
});

if (typeof module === "object" && require.main === module) {
  const test = require("node:test"), assert = require("node:assert/strict");
  const api = module.exports;
  test("steady pulses produce measured BPM across the supported range", () => {
    for (const bpm of [60, 90, 120, 150, 180]) {
      const engine = api.createAnalysis();
      for (let time = 0; time <= 20000; time += 20) {
        const pulse = time % (60000 / bpm) < 22;
        engine.push(new Uint8Array(256).fill(pulse ? 220 : 3), time);
      }
      assert.ok(Math.abs(engine.result().bpm - bpm) < 2, JSON.stringify({ bpm, result: engine.result() }));
      assert.ok(engine.result().confidence >= 0.65);
    }
  });
  test("silence, constant energy, sparse and irregular evidence abstain", () => {
    for (const value of [0, 100, 255]) {
      const engine = api.createAnalysis();
      for (let time = 0; time < 15000; time += 20) engine.push(new Uint8Array(256).fill(value), time);
      assert.equal(engine.result().bpm, null);
    }
    assert.equal(api.estimateTempo([0, 500, 1000]).bpm, null);
    assert.equal(api.estimateTempo([0, 340, 800, 1700, 2280, 3040, 3690, 4100, 5100, 5820]).bpm, null);
  });
  test("jitter, missed beats, confidence and crossfade bounds", () => {
    const onsets = Array.from({ length: 30 }, (_, i) => i * 500 + (i % 3 - 1) * 8).filter((_, i) => i !== 12);
    const result = api.estimateTempo(onsets);
    assert.ok(Math.abs(result.bpm - 120) < 2);
    assert.ok(Math.abs(api.suggestCrossfade(result) - 2) < 0.1);
    assert.equal(api.suggestCrossfade(result, 1), 1);
    assert.equal(api.suggestCrossfade({ bpm: 120, confidence: 0.2 }), null);
    assert.equal(api.suggestCrossfade({ bpm: NaN, confidence: 1 }), null);
  });
  test("analysis memory is bounded, gaps reset, invalid time is ignored", () => {
    const engine = api.createAnalysis();
    for (let time = 0; time < 120000; time += 20) engine.push(new Uint8Array(1024).fill(time % 500 === 0 ? 200 : 0), time);
    assert.ok(engine.stats().frames <= api.LIMITS.frames);
    assert.ok(engine.stats().onsets <= api.LIMITS.onsets);
    assert.equal(engine.stats().bins, api.LIMITS.bins);
    const before = engine.stats();
    assert.equal(engine.push([255], NaN), false);
    assert.equal(engine.push([255], 0), false);
    assert.deepEqual(engine.stats(), before);
    engine.push([255], 130000);
    assert.equal(engine.stats().frames, 1);
    assert.equal(engine.result().bpm, null);
    engine.reset(); assert.equal(engine.stats().frames, 0);
  });
  test("artwork validation, safe defaults and complete five-language strings", () => {
    for (const url of ["http://example.com/v.mp4", "javascript:alert(1)", "file:///tmp/v", "https://user:pass@example.com/v", "//example.com/v"]) assert.equal(api.validateArtworkUrl(url), null);
    assert.equal(api.validateArtworkUrl("https://example.com/v.mp4?x=1"), "https://example.com/v.mp4?x=1");
    assert.equal(api.validateArtworkUrl(""), "");
    assert.equal(api.normalizeSettings({ analysis: "true" }).analysis, false);
    assert.equal(Object.keys(api.dictionaries).length, 5);
    for (const dictionary of Object.values(api.dictionaries)) {
      assert.deepEqual(Object.keys(dictionary), Object.keys(api.dictionaries.en));
      assert.ok(Object.values(dictionary).every(value => typeof value === "string" && value.length));
    }
  });
}
