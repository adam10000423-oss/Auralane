# Music Workspace

## Navigation and Layout

- Replay is an independent Library-section sidebar destination.
- Smart playlists live on the existing Playlists page, with an on-demand rule editor and song preview. The earlier settings-only preset creator is no longer presented as the smart-playlist interface.
- Queue snapshots open from the Session bookmark button. Song versions open from each song's menu. No management panels remain stacked beneath the queue.
- Settings reuse the original category rail: General, Appearance, Playback, Lyrics, Library and sync, Advanced. The empty Connections category is removed. Spotify has a dedicated sidebar page; source and integration configuration use on-demand editors rather than permanent stacks beneath Queue.

## Listening Data

The existing audible-time sampler also credits per-song daily records. Pauses, buffering, muted/zero-volume audio and seeks do not fabricate time. Play counts are distinct from seconds: a session counts once after at least 30 seconds and half the duration, capped at four minutes. Unknown duration uses a 30-second threshold. A new track load or ended event resets the session counter, while a pause does not.

IndexedDB stores account-separated rule metadata and individual daily song records. Periodic saves write only changed records, not the whole listening history. Version-one aggregate documents migrate on first access. Retention is 800 local-calendar days. Replay loads/renders when opened; invisible pages do not rebuild charts. Songs and artists rank by actual credited time, with play counts separate. Prior daily-only totals remain visible without inventing past rankings. Account switching invalidates pending reads and dismisses open editors. App backup/restore includes the new database.

Smart rules support all/any conditions, artist text, known liked/download status, recorded play counts, recent listening and known duration. Unknown values do not match false/zero conditions. Source candidates are saved library/local/downloaded/playlist songs plus actual listening history, not a fabricated global catalog. Rules are evaluated when the page or preview opens. Playing a result takes a queue snapshot, not a live queue that changes under playback.

## Automix

The previous early-next implementation has been replaced by a two-track overlap using the existing DSP graph and equal-power gain envelopes. Modes are Off, Crossfade and Automix. Existing nonzero crossfade settings map to Crossfade until changed.

Automix uses the MIT `web-audio-beat-detector` worker-backed library, checks tempo agreement between independent windows, considers the current recording's outro and next recording's intro, and allows at most a three-percent tempo adjustment with the media element's pitch preservation. It aligns media phases again after the incoming stream resolves, rather than assuming network preparation was instantaneous. Uncertain or incompatible evidence falls back to a real crossfade. This is a conservative beat-aligned mixer, not a vocal-separation or harmonic-key DJ engine.

Analysis is optional, sequential and bounded to streams of at most 20 MiB and recordings up to eight minutes. It may perform an additional audio download; ordinary playback never waits for analysis. URLs identify the analyzed recording so alternate recordings do not reuse its timing. Pausing, seeking, manual song changes, account/queue edits and stop cancel prepared transitions and restore unity gain. Listen Together, end-of-track sleep, unsupported web playback, skip-silence and nonstandard DSP speed prevent mixing. Low-power mode avoids tempo analysis.

## Appearance

Appearance offers Standard or an optional lightweight Liquid Glass-inspired material plus reduced transparency. The main player, top controls, Session tabs and popup surfaces use restrained translucent blur. The sidebar and mini player use inexpensive tints. Lists and lyrics do not receive refraction, per-letter shadows or translucent text. Queue drags and panel resizing temporarily disable backdrop blur; low-power mode disables it. Full animated lens distortion is deliberately not implemented.

## Verification

```sh
npm run build:audio
npm test
npm run test:workspace
npm run test:features
npm run test:online
```

Workspace tests cover rule evaluation, real recorded rankings, account races, v1 storage migration, backup replacement/restoration, five-language narrow/desktop layouts, a synthetic 120-BPM signal through the real detector, actual two-track gain changes, measured media beat phase and pause cancellation. Electron screenshots additionally verify the existing app shell and category rail. These tests do not establish perceptual transition quality for every music genre or guarantee support for every remote recording.
