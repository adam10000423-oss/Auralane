const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "src", "renderer", "index.html");
const rendererPath = path.join(root, "src", "renderer", "app.js");
const outputPath = path.join(root, "src", "renderer", "i18n.generated.js");
const html = fs.readFileSync(htmlPath, "utf8");
const rendererSource = fs.readFileSync(rendererPath, "utf8");

const decodeHtml = (value) => String(value || "")
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, "\"")
  .replace(/&#39;|&#039;/g, "'")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&times;/g, "×")
  .replace(/&#\d+;/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const sources = new Set();
for (const match of html.matchAll(/>([^<>]+)</g)) {
  const text = decodeHtml(match[1]);
  if (text && /[A-Za-z]/.test(text)) sources.add(text);
}
for (const match of html.matchAll(/(?:placeholder|title|aria-label)="([^"]+)"/g)) {
  const text = decodeHtml(match[1]);
  if (text && /[A-Za-z]/.test(text)) sources.add(text);
}
for (const match of rendererSource.matchAll(/>([^<>{}\n]+)</g)) {
  const text = decodeHtml(match[1]);
  if (!text || text.length > 180 || !/[A-Za-z]/.test(text) || /[=;`]|&&/.test(text)) continue;
  if (/^[A-Za-z_$][\w$.]*$/.test(text) && text.includes(".")) continue;
  sources.add(text);
}
for (const match of rendererSource.matchAll(/(?:placeholder|title|aria-label)=["']([^"'${}]+)["']/g)) {
  const text = decodeHtml(match[1]);
  if (text && text.length <= 180 && /[A-Za-z]/.test(text)) sources.add(text);
}
for (const match of rendererSource.matchAll(/componentText\(["']([^"']+)["']\)/g)) {
  const text = decodeHtml(match[1]);
  if (text && text.length <= 180 && /[A-Za-z]/.test(text)) sources.add(text);
}

const protectedNames = [
  "Auralane", "YouTube Music", "YouTube", "BetterLyrics", "LRCLIB", "KuGou",
  "Paxsenix", "LyricsPlus", "Lyrics.ovh", "LRC", "DSP", "ReplayGain"
];
const languageTargets = {
  "zh-TW": "zh-TW",
  "zh-CN": "zh-CN",
  ja: "ja",
  ko: "ko"
};
const separator = "\n<<<AURALANE_I18N_SPLIT_7F3A>>>\n";

const overrides = {
  "zh-TW": {
    "Back to artist": "返回藝人頁",
    Play: "播放", Pause: "暫停", Search: "搜尋", Copy: "複製", Share: "分享",
    Translate: "翻譯", Romanize: "羅馬拼音", Duet: "雙人", Timeline: "時間軸",
    More: "更多", Reload: "重新載入", Reset: "重設", Sync: "同步", Find: "尋找",
    Use: "使用", Preview: "預覽", Close: "關閉", Save: "儲存", Delete: "刪除",
    Rename: "重新命名", Refresh: "重新整理", Back: "返回", Next: "下一首",
    Previous: "上一首", Shuffle: "隨機播放", Follow: "追蹤", Radio: "電台",
    Import: "匯入", Export: "匯出", All: "全部", Recent: "最近", Artists: "藝人",
    Albums: "專輯", Podcasts: "Podcast", Settings: "設定", Lyrics: "歌詞",
    Queue: "佇列", General: "一般", Playback: "播放", Storage: "儲存空間",
    "Timing adjustment": "時間微調", "Auto translate next songs": "自動翻譯下一首歌曲",
    "Clear local music": "清除本地音樂", "Change the current filters or rescan your folders.": "變更目前的篩選條件或重新掃描資料夾。",
    "No local music yet": "尚無本地音樂", "Add a folder to build your local music library.": "新增資料夾以建立本地音樂庫。"
  },
  "zh-CN": {
    "Back to artist": "返回艺人页",
    Play: "播放", Pause: "暂停", Search: "搜索", Copy: "复制", Share: "分享",
    Translate: "翻译", Romanize: "罗马拼音", Duet: "双人", Timeline: "时间轴",
    More: "更多", Reload: "重新加载", Reset: "重置", Sync: "同步", Find: "查找",
    Use: "使用", Preview: "预览", Close: "关闭", Save: "保存", Delete: "删除",
    Rename: "重命名", Refresh: "刷新", Back: "返回", Next: "下一首",
    Previous: "上一首", Shuffle: "随机播放", Follow: "关注", Radio: "电台",
    Import: "导入", Export: "导出", All: "全部", Recent: "最近", Artists: "艺人",
    Albums: "专辑", Podcasts: "播客", Settings: "设置", Lyrics: "歌词",
    Queue: "队列", General: "常规", Playback: "播放", Storage: "存储空间",
    "Timing adjustment": "时间微调", "Auto translate next songs": "自动翻译下一首歌曲",
    "Clear local music": "清除本地音乐", "Change the current filters or rescan your folders.": "更改当前筛选条件或重新扫描文件夹。",
    "No local music yet": "暂无本地音乐", "Add a folder to build your local music library.": "添加文件夹以建立本地音乐库。"
  },
  ja: {
    "Back to artist": "アーティストページに戻る",
    Play: "再生", Pause: "一時停止", Search: "検索", Copy: "コピー", Share: "共有",
    Translate: "翻訳", Romanize: "ローマ字", Duet: "デュエット", Timeline: "タイムライン",
    More: "その他", Reload: "再読み込み", Reset: "リセット", Sync: "同期", Find: "検索",
    Use: "使用", Preview: "プレビュー", Close: "閉じる", Save: "保存", Delete: "削除",
    Rename: "名前を変更", Refresh: "更新", Back: "戻る", Next: "次へ",
    Previous: "前へ", Shuffle: "シャッフル", Follow: "フォロー", Radio: "ラジオ",
    Import: "インポート", Export: "エクスポート", All: "すべて", Recent: "最近",
    Artists: "アーティスト", Albums: "アルバム", Podcasts: "ポッドキャスト",
    Settings: "設定", Lyrics: "歌詞", Queue: "キュー", General: "一般",
    Playback: "再生", Storage: "ストレージ", "Timing adjustment": "タイミング調整",
    "Auto translate next songs": "次の曲も自動翻訳", "Clear local music": "ローカル音楽を消去",
    "Change the current filters or rescan your folders.": "現在のフィルターを変更するか、フォルダーを再スキャンしてください。",
    "No local music yet": "ローカル音楽はまだありません", "Add a folder to build your local music library.": "フォルダーを追加してローカル音楽ライブラリを作成します。"
  },
  ko: {
    "Back to artist": "아티스트 페이지로 돌아가기",
    Play: "재생", Pause: "일시중지", Search: "검색", Copy: "복사", Share: "공유",
    Translate: "번역", Romanize: "로마자", Duet: "듀엣", Timeline: "타임라인",
    More: "더보기", Reload: "다시 불러오기", Reset: "초기화", Sync: "동기화", Find: "찾기",
    Use: "사용", Preview: "미리보기", Close: "닫기", Save: "저장", Delete: "삭제",
    Rename: "이름 바꾸기", Refresh: "새로고침", Back: "뒤로", Next: "다음",
    Previous: "이전", Shuffle: "셔플", Follow: "팔로우", Radio: "라디오",
    Import: "가져오기", Export: "내보내기", All: "전체", Recent: "최근",
    Artists: "아티스트", Albums: "앨범", Podcasts: "팟캐스트", Settings: "설정",
    Lyrics: "가사", Queue: "대기열", General: "일반", Playback: "재생",
    Storage: "저장공간", "Timing adjustment": "타이밍 조정",
    "Auto translate next songs": "다음 곡 자동 번역", "Clear local music": "로컬 음악 지우기",
    "Change the current filters or rescan your folders.": "현재 필터를 변경하거나 폴더를 다시 스캔하세요.",
    "No local music yet": "아직 로컬 음악이 없습니다", "Add a folder to build your local music library.": "폴더를 추가하여 로컬 음악 라이브러리를 만드세요."
  }
};

function protectNames(text) {
  const names = [];
  let protectedText = text;
  for (const name of protectedNames) {
    if (!protectedText.toLowerCase().includes(name.toLowerCase())) continue;
    const token = `ZXQAURALANE${names.length}QXZ`;
    names.push(name);
    protectedText = protectedText.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), token);
  }
  return { protectedText, names };
}

function restoreNames(text, names) {
  let restored = String(text || "");
  names.forEach((name, index) => {
    restored = restored.replace(new RegExp(`ZXQAURALANE${index}QXZ`, "gi"), name);
  });
  return restored;
}

async function translateBatch(values, target) {
  const protectedValues = values.map(protectNames);
  const query = protectedValues.map((item) => item.protectedText).join(separator);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translation request failed (${response.status})`);
  const data = await response.json();
  const translated = (data?.[0] || []).map((part) => part?.[0] || "").join("");
  const parts = translated.split(/<<<AURALANE_I18N_SPLIT_7F3A>>>/).map((part) => part.trim());
  if (parts.length !== values.length) throw new Error(`Translation batch split mismatch: ${parts.length}/${values.length}`);
  return parts.map((part, index) => restoreNames(part, protectedValues[index].names));
}

function batches(values, maxCharacters = 1200) {
  const result = [];
  let current = [];
  let length = 0;
  for (const value of values) {
    if (current.length && length + value.length + separator.length > maxCharacters) {
      result.push(current);
      current = [];
      length = 0;
    }
    current.push(value);
    length += value.length + separator.length;
  }
  if (current.length) result.push(current);
  return result;
}

async function main() {
  const values = [...sources].sort((left, right) => left.localeCompare(right));
  let dictionaries = {};
  if (process.argv.includes("--incremental") && fs.existsSync(outputPath)) {
    const sandbox = { window: {} };
    require("node:vm").runInNewContext(fs.readFileSync(outputPath, "utf8"), sandbox);
    dictionaries = sandbox.window.AURALANE_COMPONENT_I18N || {};
  }
  dictionaries.en = { ...dictionaries.en, ...Object.fromEntries(values.map((value) => [value, value])) };
  for (const [language, target] of Object.entries(languageTargets)) {
    const dictionary = dictionaries[language] || {};
    for (const batch of batches(values.filter((value) => !dictionary[value]))) {
      const translated = await translateBatch(batch, target);
      batch.forEach((source, index) => {
        dictionary[source] = overrides[language]?.[source] || translated[index] || source;
      });
    }
    dictionaries[language] = dictionary;
  }
  const output = [
    "/* Generated by scripts/generate-i18n.js. Do not edit by hand. */",
    `window.AURALANE_COMPONENT_I18N = ${JSON.stringify(dictionaries, null, 2)};`,
    ""
  ].join("\n");
  fs.writeFileSync(outputPath, output, "utf8");
  console.log(`Generated ${values.length} interface strings for ${Object.keys(dictionaries).length} languages.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
