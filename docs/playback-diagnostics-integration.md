# Playback diagnostics integration

Shared files are released: no further edits to `src/preload.js` or
`src/renderer/index.html` are required by this module.

## Wiring already installed

- `index.html` loads `playback-diagnostics.css`, then
  `playback-diagnostics-model.js` and `playback-diagnostics.js` after `app.js`.
- Preload wraps the existing `metro.playback` and `metro.searchLyrics` calls.
  The original return values and thrown errors are preserved. Observations are
  delivered through `metro.onPlaybackDiagnostic(callback)`; its return value
  unsubscribes. No new IPC channels or main-process changes are required.
- Keep `#audio`, `#settingsView .settings-grid`, and `#settingsCategoryNav`.
  The module creates its own settings card with `data-settings-section=playback`.
- Audio observations use existing `playbackClient`, `playbackItag`,
  `streamErrorRetry`, `playbackRequestId`, and `gamePlayer` dataset values.
  MutationObserver is limited to those attributes and `src` on `#audio`.
- Language follows `document.documentElement.lang`: en, zh-Hant, zh-Hans,
  ja, ko (zh-TW and zh-CN also accepted). The card opts out of automatic
  text translation so live diagnostic values are not rewritten.

## Public renderer API

`window.auralanePlaybackDiagnostics.getSnapshot()` returns a detached snapshot.
`clearRecentError()` clears the recent playback error.
`dispose()` removes the card, listeners, and both observers.

## Measurement boundaries

Resolution latency measures the entire `ytm:playback` IPC round trip, not pure
network latency. Resolution retries observe calls carrying excluded formats or
clients; media retries retain the peak `streamErrorRetry` value until a fresh
resolution/source. Internal retries inside the main-process resolver are not
available, and retries without exclusion metadata cannot be distinguished from
a fresh same-track request. To measure those precisely, the parent should add
an explicit attempt identifier/retry count to its resolver result and update the
observer contract; the module does not invent these measurements.

Lyrics history retains eight completed `searchLyrics` calls, with at most 16
providers/errors each. Provider errors and candidate counts come from the real
search result, not active health probes. A successful zero-candidate search
means the search completed, not that a matching lyric exists. `lyrics:find`
is not observed. Concurrent results are listed by completion time.

Client/MIME/bitrate are unavailable for local/downloaded media without metadata.
Webview playback has no HTML audio telemetry; this card diagnoses the direct
audio resolver and `#audio`, not the embedded player's internal state.
Stream URLs are not copied; URLs and Windows paths in errors are redacted.
Error messages from services are retained as technical diagnostic text in their
original language. Labels and statuses support all five interface languages.

## Verification

- `node scripts/playback-diagnostics-test.js`
- `node scripts/playback-diagnostics-browser-test.js` (installed Edge required)
- `npm test`

Browser checks use controlled resolver observations with the real module and
existing stylesheet, test all five languages at 390/1280px, copy, bounded lyrics,
redaction, and disposal. They do not claim authenticated live playback coverage.
No publishing or packaging was performed.
