# Music Integration Contract

These standalone modules do not register IPC or modify the application entry points.

## Main process

```js
const { createMusicIntegrations } = require('./musicIntegrations');
const integrations = await createMusicIntegrations({ youtube });
```

Initialize after Electron `app.whenReady()`. Without `secretStorage`, encrypted state is saved to `userData/music-integrations.enc` with Electron `safeStorage`. Optional `storagePath` overrides that path. Unavailable encryption and Linux `basic_text` fail closed. An injected `secretStorage` must implement asynchronous `get(key)` returning a JSON string or null and `set(key, JSONString)`, and must encrypt all persisted values. Never use renderer localStorage or a plaintext preferences store for this contract.

Factory options also include `fetch`, `now` (milliseconds), `electron`, `discordRPC`, and `discordOptions` for testing. No credentials are embedded in the source.

Returned API:

| Method | Contract |
| --- | --- |
| `status()` | Synchronous redacted service status, usernames, error codes, outbox count. |
| `configure('lastfm', {apiKey, apiSecret})` | Saves user application credentials; clears old session and queued submissions. |
| `beginLastFmLogin()` | Signed `auth.getToken`; returns `{url}`. Open in external browser. |
| `completeLastFmLogin()` | Signed `auth.getSession` using pending token after explicit user authorization; persists session. Not OAuth. |
| `connectListenBrainz(token)` | Validates token with official endpoint before saving. |
| `configure('spotify', {clientId, clientSecret})` | Saves user application credentials for official client-credentials access. No user OAuth is claimed. |
| `configure('discord', {clientId})` | Saves Discord application ID, never an account password/token. |
| `connectDiscord()` | Connects desktop IPC and waits for READY. |
| `disconnect(service)` | Removes that service's credentials and queued submissions; closes Discord when applicable. |
| `playback({playId, track, playing, seeking})` | Heartbeat and transition updates. `track` has `title`, `artist`, optional `album`, and `durationSeconds` (or colon-formatted `duration`). |
| `retryOutbox()` | Retries due failed listens; parent schedules e.g. every 30 seconds with error handling. No internal timer. |
| `importSpotify(url, {market='TW', signal, onProgress})` | Reads public playlist metadata and paginated `/v1/playlists/{id}/items`, then calls injected `youtube.search(query, 'songs')`. Does not save playlists. |
| `events` | Node EventEmitter; `import-progress` payload is `{phase,completed,total?,matched?,unmatched?}`. |
| `dispose()` | Waits for queued operations, closes IPC, removes progress listeners. Parent clears its retry/heartbeat timers. |

Call `playback` every 1-5 seconds while playing and on pause, resume, buffering, seek, skip, and stop. Use `playing:false` when paused/buffering, `seeking:true` during seek, and `{track:null}` on stop. A `playId` identifies one listening occurrence; generate a new ID for each replay, even for the same track. Do not derive playId only from videoId. Gaps over 15 seconds receive no listening credit. Position jumps do not count. Unknown duration does not scrobble. ListenBrainz submits at half duration or 240 seconds; Last.fm additionally excludes tracks of 30 seconds or less. Each service submits once per playId. Connecting/changing accounts should occur between listening occurrences.

Transient network, HTTP 429/5xx, and temporary Last.fm errors enter an encrypted outbox of at most 200 listens, five attempts, seven-day expiry, with exponential backoff. Playing-now updates never queue. Disconnect or account reconfiguration purges that service's queue. Like other network submission clients, a timeout after server acceptance can yield a duplicate on retry; there is no cross-service exactly-once guarantee.

Import result: `{status, name?, sourceUrl?, code?, message?, matched, unmatched}`. Status is `complete`, `partial`, `unavailable`, or `cancelled`. Matches are `{index,source,track}`; unmatched items are `{index,source,reason}`. Preserve indexes when presenting review results. Parent saves only confirmed matched tracks. An access block returns `unavailable`, never a fabricated success. Private/local/non-music items are not imported. Ambiguous versions remain unmatched. Limits: one concurrent import, at most 100 pages of 50 items. Cancellation is checked between requests/searches; an in-flight request can take up to the 15-second request timeout (injected search must provide its own timeout).

## Renderer

Load `src/renderer/integrationTools.css` and `src/renderer/integrationTools.js`, then:

```js
const tools = IntegrationTools.mount(container, {
  api: integrationBridge,
  openExternal: url => integrationBridge.openExternal(url),
  onImported: result => reviewOrSaveMatchedPlaylist(result)
});
// tools.refresh(); tools.destroy();
```

CommonJS also exports `{mount}`. `api` implements the main methods above as promise-returning bridge calls; renderer does not use Electron or Node directly. `onImported` runs only for complete/partial results; it must perform actual playlist creation or review. Secrets are cleared after successful configuration, never returned by status, and never inserted using HTML parsing.

Functions and AbortSignal are not IPC-serializable. The parent bridge must convert `importSpotify(url,{market,signal,onProgress})` into an import request, route validated main-process progress events to `onProgress`, map signal abort to a main-owned AbortController, and remove listeners on completion. Allow only trusted application frames, validate payloads, and expose only allowlisted methods. Validate external URLs in main before opening them; allow the Last.fm HTTPS `/api/auth/` authorization URL, not arbitrary renderer-provided schemes. Never expose the service object, storage, or general-purpose IPC to renderer code.

## Other exports and verification

`src/main/musicIntegrations.js` additionally exports `createSafeStorage({filePath,safeStorage})`, `DiscordRPC`, `IntegrationError`, `lastFmSignature(params,secret)`, `rpcFrame(opcode,payload)`, and `matchTrack(source,candidates)`.

Run `node --test scripts/test-music-integrations.js`. Tests use mocked HTTP, encrypted storage, and local IPC; no live credentials or publishing are involved. Live provider approval, OS keychain availability, Discord desktop availability, and Spotify application permissions must still be verified by the parent application's real environment.

Protocol references: [Last.fm desktop auth](https://www.last.fm/api/authspec), [Last.fm scrobbling](https://www.last.fm/api/scrobbling), [ListenBrainz](https://listenbrainz.readthedocs.io/en/latest/users/api/core.html), [Discord IPC](https://docs.discord.com/developers/topics/rpc), [Spotify playlist items](https://developer.spotify.com/documentation/web-api/reference/get-playlists-items).
