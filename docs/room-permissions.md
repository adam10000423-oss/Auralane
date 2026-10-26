# Listen Together: Host Permissions

Open a room, then select the settings icon beside its title. Hosts can change
permissions immediately. Listeners can inspect the same settings but cannot edit
them. Successful settings are remembered locally per Auralane account for the
next room; the relay remains authoritative for the current room.

| Permission | New-room default | Scope |
| --- | --- | --- |
| Play / pause | Off | Shared playback, not personal volume |
| Switch songs | Off | Previous, next, or select an existing room track |
| Seek playback | Off | Seek bar, lyric clicks, desktop/media seek commands |
| Add songs | On | Append YouTube tracks to the shared queue |
| Reorder queue | Off | Drag an existing song to a stable song-ID destination |
| Remove queued songs | Off | Remove upcoming/previous tracks, not the current song |

Adding a new song with Play next requires both Add and Reorder. Moving an
existing room song to Play next requires Reorder. Clearing/replacing the entire
queue and removing the current track remain host-only, even when all six
permissions are enabled. Local volume, output devices, lyrics and translation
preferences are not shared or restricted.

## Server Enforcement

The existing authenticated `/v1/rooms/:code/command` endpoint now accepts
`permissions` (host only) and the narrow commands `playPause`, `skip`, `select`,
`seek`, `add`, `reorder`, and `remove`. Each command checks the member token,
current room permissions, expected sequence, payload and queue limits. Guest
clients may never send legacy whole-queue or whole-playback replacements.

Queue edits use song IDs, not stale positional indices. They preserve the current
song and audio-clock position. A sequence conflict refreshes authoritative state;
legacy host queue/playback snapshots are not blindly retried over member edits.
Permissions are rechecked for every command, including queued/retried actions.

Room snapshots retain protocol 1 and add `permissionsVersion: 1`, the six boolean
`permissions`, and the last command's public member ID (`actorId`). No room tokens
are broadcast. New hosts apply member-authored snapshots before publishing local
state, preventing their periodic sync from undoing a member's action.

## Deployment and Compatibility

Deploy `server/listen-together/server.js` and
`src/shared/onlineTogetherProtocol.js` together before distributing the desktop
update. No database or additional secret is required.

An old server without `permissionsVersion` remains usable in host-only mode;
the settings panel explains that a server update is required and disables its
switches. Rooms created by old hosts that do not send initial permissions remain
read-only for listeners, because those hosts cannot apply member-authored state.

The main-process status separately advertises `capabilities: ["member-permissions"]`.
After a renderer-only reload, a new page talking to an old main process omits
unsupported create fields and explains that Auralane must be restarted, rather
than reporting a network failure. Main-process support and relay support are
checked independently.

Changing local files alone does not update the public Render relay. Follow
[the relay deployment guide](online-together-deployment.md) when deploying.

## Verification

Run `npm run test:online` and `npm test`. Coverage includes independent host and
guest audio clocks, member queue changes reaching the host, live revocation,
read-only guest settings, remembered preferences, old guest command rejection,
malformed permission objects, metadata tampering, queue limits, and personal
queue/control restoration after leaving. The UI test checks five languages at
mobile and desktop widths.
