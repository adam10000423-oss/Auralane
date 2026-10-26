# Listen Together Integration

These modules are intentionally unwired. No existing entry point, preload, HTML,
package manifest, or playback implementation was modified. Importing or constructing
the backend does not open a socket. No dependency installation is required.

## Main Process

Import `createListenTogether` and `localAddresses` from `./listenTogether`.
Create ONE `const together = createListenTogether()` per application.
Register these IPC handlers in the existing IPC setup function. The integrator must
implement `requireMainRenderer(event)` by checking BOTH `event.sender ===
mainWindow.webContents` and `event.senderFrame === mainWindow.webContents.mainFrame`.
Never accept these messages from guest pages, arbitrary windows, or subframes.

```js
ipcMain.handle("together:enable", (event, options) => {
  requireMainRenderer(event);
  return together.enable(options);
});
ipcMain.handle("together:disable", (event) => {
  requireMainRenderer(event);
  return together.disable();
});
ipcMain.handle("together:state", (event) => {
  requireMainRenderer(event);
  return together.getState();
});
ipcMain.handle("together:command", (event, command) => {
  requireMainRenderer(event);
  return together.command(command);
});
ipcMain.handle("together:addresses", (event) => {
  requireMainRenderer(event);
  return localAddresses();
});
const unsubscribeTogether = together.subscribe((event) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("together:event", event);
  }
});
```

On application shutdown, unsubscribe and await `together.disable()` before allowing
quit (use the app's existing async shutdown guard). Disable on loss/reload of the
host renderer too, so a room cannot keep playing without its host. Do not call
`enable` during app boot or restore it from persisted preferences.

`enable({host, port, allowLan})` returns `{url, token, roomId}`. Default host is
`127.0.0.1`, default port is ephemeral. LAN requires `allowLan: true` and one exact
RFC1918 IPv4 address returned by `localAddresses()`. Wildcard/public/hostname/IPv6
bindings are rejected. The share URL contains no credential. Deliver the token
separately and never persist, log, or place it in a URL, QR URL, or browser storage.
Disable/re-enable rotates the token and clears the room.

`status()` returns enabled/url/roomId/client count without the secret. `subscribe`
returns an unsubscribe function; callbacks receive committed delta events and
cannot veto commands. `getState()` returns a detached snapshot. Disabled state
and stale/invalid commands throw.

## Preload

Expose this narrow object through the existing `metro` bridge. Do not expose raw
IPC, the backend instance, or general fetch to the renderer:

```js
together: {
  enable: (options) => ipcRenderer.invoke("together:enable", options),
  disable: () => ipcRenderer.invoke("together:disable"),
  getState: () => ipcRenderer.invoke("together:state"),
  command: (command) => ipcRenderer.invoke("together:command", command),
  addresses: () => ipcRenderer.invoke("together:addresses"),
  subscribe: (callback) => {
    const listener = (_event, value) => callback(value);
    ipcRenderer.on("together:event", listener);
    return () => ipcRenderer.removeListener("together:event", listener);
  }
}
```

## Renderer

Add `togetherTools.css` as a stylesheet and `togetherTools.js` as a script before
`app.js`. Add a dedicated container, then explicitly mount:

```js
const panel = AuralaneTogether.mountTogether(container, {
  host: window.metro.together,
  onState: applyRoomState,
  onError: (error) => toast(error.message, true)
});
```

The host panel provides explicit enable/disable, address/LAN opt-in, invite display,
queue select/remove, play/pause, and seek. Initial queue publication and additions
are supplied by the host app via `command`; the panel does not access app globals.
Call `panel.dispose()` when removing it. A mounted panel starts no networking.

Commands all require `expectedSeq: snapshot.seq`. On stale sequence, refresh state
and ask the user to repeat the operation; do not silently replay index mutations.

```js
{ type: "queue", index: 0, deleteCount: 0, items: tracks, expectedSeq }
{ type: "select", index: 0, expectedSeq }
{ type: "play", expectedSeq }
{ type: "pause", expectedSeq }
{ type: "seek", position: 42.5, expectedSeq }
```

Queue inserts are at most 50 tracks per command, queue at most 200. Publish an
initial queue in chunks of 50, using each returned state's seq for the next chunk.
Tracks must be `{id, title, artist, duration}` with duration in SECONDS (0 < value
<= 86400), id matching `[A-Za-z0-9_-]{1,128}`, and title/artist at most 300 UTF-8
bytes each. Convert existing app metadata explicitly; do not pass duration labels.
Only these four fields leave the process; local paths, stream URLs, artwork URLs,
cookies and account metadata are discarded. Do not publish local-only tracks
whose ids cannot be independently resolved by a participant.

Bind existing app queue changes (`setQueue`/`persistQueue`) to queue delta commands,
and playback selection/play/pause/seek to the commands above. Route host controls
through the backend FIRST, then apply the returned state to local playback.
Use an applying-room-state guard to prevent programmatic playback callbacks from
publishing themselves back as fresh commands. Do not hook `timeupdate` into seek;
only report actual seeks and track transitions. On track end, host chooses the next
track explicitly; backend clamps at duration and pauses, but does not auto-advance.

Existing app adapters are `playTrack(track)`, `currentPlaybackSeconds()`,
`currentPlaybackDuration()`, `state.queue`, and `els.audio`. Resolve the shared id
to a playable track, await `playTrack`, wait for audio metadata before setting
`currentTime`, then apply play/pause. Embedded/YouTube playback requires equivalent
player API adapters; `els.audio` alone does not control embed playback.

For a guest renderer with its own playback resolver:

```js
let follower;
const client = AuralaneTogether.createClient({
  url, token,
  onState: (state) => follower.update(state),
  onError: reportError
});
follower = AuralaneTogether.createPlaybackFollower({
  client, loadTrack, play, pause, seek, getPosition, onError: reportError
});
client.start(); // Long-lived promise; do not await during initialization.
// Teardown: await client.stop(); await follower.dispose();
```

`loadTrack`, `play`, `pause`, `seek` may be async; `getPosition` returns seconds.
Callbacks must not publish host commands. Follower serializes operations, skips
superseded state, corrects drift >0.4s once per second, pauses within one poll when
disconnected, and surfaces autoplay/resolve failures through `onError`. A resolver
must cancel its own pending audio/network work on application teardown.

## Browser Guest and Transport

Opening the share URL serves a functional read-only room viewer with a password
token field. Join is explicit. It shows the host queue and selected track; it does
not stream host audio or pretend metadata is playable audio. Synchronized actual
audio requires the resolver callbacks above and independently authorized media.
Tokens are sent only in `Authorization: Bearer ...` headers, including SSE via
fetch streaming (not EventSource). The viewer clears the input after joining.
The standalone guest page is served by the backend, so no additional hosting or
development server is needed.

Authenticated endpoints: GET `/api/state`, `/api/time`, `/api/events`. There is NO
network command endpoint and no CORS allowance. Requests with URL queries or
foreign Host/Origin are rejected. SSE begins with a full snapshot at the current
sequence; subsequent events carry only queue deltas and playback anchors.
Reconnect always gets a fresh snapshot, not an unbounded replay log. Client rejects
sequence gaps, ignores duplicates, retries with capped backoff, and stops retrying
on 401/403. Clock offset uses a request midpoint, refreshes every 30s, and advances
with monotonic time. All commands use server time, never client timestamps.

Limits: 16 SSE clients, 64 TCP connections, 256 KiB pending SSE buffer, 10s client
liveness timeout, 5s header/request timeout, and no HTTP request bodies accepted.
Slow SSE consumers are disconnected. Closing a room destroys all connections.

HTTP on LAN is plaintext: bearer tokens and metadata are visible to someone able
to inspect LAN traffic. Use only a trusted network. No WAN forwarding, automatic
firewall changes, discovery broadcasts, cookies, relay service, audio proxy, or
automatic startup exposure is included. HTTPS/certificate management is out of
scope. The exact Host check intentionally disallows alternate hostname aliases.

## Verification

Run `node --test scripts/test-listen-together.js`. Tests use ephemeral loopback
listeners and close them. They cover auth/origin/Host checks, token rotation,
read-only guests, clock projection, stale commands, atomic queue validation,
bounded queues, current-track removal, real SSE/client synchronization, reconnect
snapshots, lifecycle cleanup, and playback callbacks.
