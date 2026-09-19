# Auralane 詳細使用說明

這份文件整理 Auralane Desktop 的日常使用方式，包含登入、播放、喜愛歌曲、歌詞、離線模式與 Library 同步。

## 1. 啟動與登入

1. 在專案資料夾執行：

   ```powershell
   npm.cmd start
   ```

2. 第一次使用時按 `Login`。
3. App 會開啟 Google / YouTube Music 登入頁面。
4. 登入完成後，Auralane 會保存本機 session cookie。
5. 回到主畫面後可按 `Load home`、`Search`、`Library` 或 `Liked songs` 開始使用。

注意：

- Auralane 不要求你輸入 Google 密碼到自訂表單。
- Session 只存在本機。
- 若帳號狀態異常，可到 Account 頁登出後重新登入。

## 2. 播放音樂

### 搜尋播放

1. 在上方搜尋框輸入歌曲、藝人、專輯或播放清單。
2. 選擇搜尋分類：Top、Songs、Videos、Albums、Artists、Playlists、Podcasts。
3. 點一首歌即可播放。

### 佇列 Queue

- 點歌曲的更多選單可 `Play next` 或 `Add to queue`。
- 右側 Queue 顯示目前佇列。
- 可拖曳排序。
- 開啟 `Queue Lock` 後，不能移除或重排佇列。

### 上一首按鈕

- 當目前歌曲播放超過 1 秒時，按上一首會重新播放目前歌曲，時間回到 `0:00`。
- 當目前歌曲播放在 1 秒內，按上一首才會跳到上一首歌。
- 按鈕外觀不變。

## 3. 喜愛歌曲

### 愛心按鈕

- 播放列右下角的愛心會真實呼叫 YouTube Music：
  - 未按讚時點擊：加入 Liked Songs。
  - 已按讚時點擊：從 Liked Songs 移除。
- 操作完成後，App 會重新同步 liked songs 狀態。

### Liked Songs 頁面

1. 點左側 `Liked songs`。
2. 可搜尋、排序、播放或 shuffle。
3. 每首歌左側有 checkbox。
4. 勾選多首後按 `Unlike selected`，會逐首呼叫 YouTube Music 移除喜愛。

### 狀態判斷

- Auralane 不再把一般 `inLibrary` 當成愛心狀態。
- 愛心狀態以 `liked`、Liked Songs 清單、Library songs 同步結果為準。

## 4. Library 同步

Library 頁會顯示：

- Liked songs
- Saved playlists
- Saved albums
- Subscribed artists
- Recent activity

每張同步卡會顯示：

- item 數量
- synced 或 partial sync
- pages loaded
- 最後同步時間
- Refresh 按鈕

### partial sync 是什麼

YouTube Music 有時會回傳不完整資料，或仍有 continuation 還沒載完。這時 UI 會顯示 partial sync，代表目前資料可用，但可能不是完整清單。

## 5. 離線模式

### 下載歌曲

- 播放列的下載按鈕可下載目前歌曲。
- Liked Songs 或 Downloaded 頁可批次下載。
- 下載內容存在本機 cache。

### Offline mode

在 Settings 開啟 `Offline mode` 後：

- 只播放已下載歌曲。
- 佇列中未下載歌曲會顯示不可用。
- 若 library 載入失敗但本機有下載內容，App 會顯示 downloaded songs。

## 6. 歌詞來源

Auralane 目前支援：

- BetterLyrics
- LRCLIB
- KuGou
- Paxsenix
- LyricsPlus
- Lyrics.ovh
- YouTube transcript

Metrolist 的主要 provider 順序是 BetterLyrics、LrcLib、KuGou、Paxsenix、LyricsPlus、YouTubeSubtitle、YouTube。Auralane 使用相近順序，並另外保留 Lyrics.ovh。

### Settings 裡的 Lyrics source

- `Auto`：依照 Provider priority 自動搜尋。
- 指定 provider：只用指定來源。
- `Local LRC`：只使用你保存到本機的歌詞。

### Provider priority

Settings 可以選預設優先順序：

- Metrolist style
- LRCLIB first
- Word sync first
- Plain lyrics first
- YouTube transcript first

### Search sources toggle

可分別開關每個來源。Lyrics Search 會依照啟用來源搜尋，而且比較慢回來的來源會在完成後再加入結果列表。

## 7. Lyrics Search

1. 播放一首歌。
2. 開啟右側 Lyrics。
3. 按 `Search`。
4. 中央浮動視窗會顯示搜尋欄、來源 toggle、結果列表與編輯區。
5. 點結果後可先 Preview。
6. 按 `Use` 後，歌詞會保存到本機，之後同一首歌優先使用這個版本。

### 歌詞版本記憶

同一首歌選過的 provider、sourceId、版本 fingerprint 會保存在本機。下次搜尋時會優先選中同版本；播放時本機保存歌詞會優先載入。

## 8. Lyrics offset

每首歌都能獨立調整歌詞偏移：

- `-500ms`
- `+500ms`
- `Reset`

用途：

- 如果歌詞太早出現，調整 offset。
- 如果歌詞太晚出現，調整 offset。
- 設定會依歌曲 ID 存在本機，下次播放同一首歌自動套用。

## 9. 同步按鈕

右側 session lyrics、放大 lyrics、Focus/fullscreen lyrics 都有同步按鈕。

同步按鈕的行為：

- 手動滾動歌詞後，App 會暫停自動跟隨，並在歌詞區中央下方顯示 `Sync`。
- 按 `Sync` 後，會跳回目前播放中的歌詞行，並恢復自動跟隨。
- 已同步時按鈕會隱藏。
- 沒有 synced lyrics 或使用 web embed 播放時，按鈕會隱藏或停用。

## 10. 逐字 karaoke

部分來源會提供 word-level timing。Auralane 支援兩種格式：

```lrc
[00:01.00]<00:01.00>Hello <00:01.30>world
```

或：

```lrc
[00:01.00]Hello world
<Hello:1:1.3|world:1.3:1.8>
```

`<word:start:end>` 的意思是：

- `word`：顯示的字或詞。
- `start`：這個字開始高亮的秒數。
- `end`：這個字結束高亮的秒數。

播放時，目前字會有 karaoke 高亮。

## 11. 歌詞翻譯

- 按 `Translate` 會翻譯目前歌詞。
- 翻譯結果會依歌曲、provider、語言與歌詞 fingerprint 快取在本機。
- 顯示翻譯時，Alt 點某一句歌詞可手動修正翻譯。
- 修正後會寫回本機快取。

## 12. 歌詞分享卡片

1. 在右側 Lyrics 中按住 Shift 點選想分享的幾句歌詞。
2. 按 `Share card`。
3. App 會產生 PNG 歌詞卡片。
4. 若系統支援，圖片會複製到剪貼簿；否則會下載 PNG。

沒有選取時，App 會使用目前播放中的歌詞行與下一句。

## 13. Focus / fullscreen lyrics

- 按播放列的 Focus 按鈕進入沉浸式歌詞畫面。
- 歌詞會自動跟隨播放。
- 手動滾動後，中央下方會出現 `Sync`。
- 按 `Sync` 回到目前歌詞。
- 按右上角 `x` 或 Esc 離開。

## 14. 桌面小窗與 Mini player

- Desktop lyrics：顯示桌面浮動歌詞窗。
- Mini player：顯示小型控制視窗。
- Mini player 支援播放、暫停、上一首、下一首與愛心狀態顯示。

## 15. 常見問題

### 為什麼某些歌播放失敗？

YouTube Music direct audio 可能需要不同 client、簽名或 token。若 direct playback 失敗，可在 Settings 開啟 Web fallback。

### 為什麼 YouTube transcript 有時沒有？

不是每支影片都有 transcript；有些影片會回傳 invalid argument 或 precondition failed。App 會把這種情況當成該來源不可用。

### 為什麼 Lyrics.ovh 很快但其他來源比較慢？

Lyrics.ovh API 很簡單，只回 plain lyrics。BetterLyrics、Paxsenix、LyricsPlus 需要 TTML、Apple Music 搜尋或多伺服器查詢，所以可能較慢。Lyrics Search 會讓慢來源完成後再加入清單。

### 為什麼 Paxsenix 偶爾失敗？

Paxsenix 需要從 Apple Music web 前端取得 token。Apple Music 前端改版或網路阻擋時會失敗。

### partial sync 需要擔心嗎？

不一定。partial sync 只代表 YouTube Music 回傳的資料可能還有 continuation 或部分來源不完整。可按 Refresh 再同步。

## 16. 檔案位置

常用檔案：

```text
src/main/lyrics.js
src/main/main.js
src/main/innertube/index.js
src/main/innertube.legacy.js
src/renderer/app.js
src/renderer/index.html
src/renderer/styles.css
```

打包輸出：

```text
dist/
```

本機資料大多存在 Electron app data 與 browser localStorage 中，包含 session、local lyrics、lyrics offset、translation cache、lyrics source memory、offline cache metadata。
