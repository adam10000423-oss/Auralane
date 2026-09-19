# Auralane

Auralane is a desktop music player for YouTube Music, built with Electron. It combines discovery, queue management, local music, offline playback, synchronized lyrics, translation, desktop lyrics, and compact player experiences in one focused interface.

> Auralane is an independent, unofficial client. It is not affiliated with or endorsed by Google or YouTube.

## Download

| Platform | Package | Notes |
| --- | --- | --- |
| Windows | [Installer (`Setup.exe`)](https://github.com/adam10000423-oss/Auralane/releases/latest) | Recommended. Supports automatic updates. |
| Windows | [Portable (`.exe`)](https://github.com/adam10000423-oss/Auralane/releases/latest) | Runs without installation. |
| macOS Apple silicon | [DMG / ZIP](https://github.com/adam10000423-oss/Auralane/releases/latest) | For M-series Macs. |
| macOS Intel | [DMG / ZIP](https://github.com/adam10000423-oss/Auralane/releases/latest) | For Intel Macs. |

Unsigned macOS builds may require using **Open** from Finder's context menu on first launch. Release files and checksums are published on the [latest release page](https://github.com/adam10000423-oss/Auralane/releases/latest).

## Interface

### Search and synchronized lyrics

![Search results for Without You with synchronized lyrics](docs/screenshots/01-search-without-you.png)

### Home and personal discovery

![Auralane home](docs/screenshots/02-home.png)

### Library

![Auralane library](docs/screenshots/03-library.png)

### Full-screen lyrics

![Full-screen synchronized and translated lyrics for Without You](docs/screenshots/05-focus-lyrics.png)

| Mini player | Desktop lyrics |
| --- | --- |
| ![Auralane mini player](docs/screenshots/06-mini-player.png) | ![Auralane floating desktop lyrics](docs/screenshots/07-desktop-lyrics.png) |

### GitHub updates

![Built-in GitHub update settings](docs/screenshots/04-settings-updates.png)

## Features

### Music discovery and playback

- Search songs, videos, albums, artists, playlists, and podcasts.
- Browse Home, Explore, Charts, new releases, moods, and genres.
- Direct audio playback with YouTube Music web fallback when required.
- Queue reordering, play next, add to queue, queue lock, shuffle, and repeat.
- Playback quality selection, output-device selection, crossfade, gapless playback, ReplayGain, and silence skipping.
- Media keys, system tray controls, global shortcuts, sleep timer, and playback-session restore.
- Theme colors can follow the current song artwork.

### Lyrics

- Plain, line-synchronized, and word-synchronized karaoke lyrics.
- Lyrics sources include NetEase Music, Musixmatch, BetterLyrics, LRCLIB, KuGou, Paxsenix, LyricsPlus, Lyrics.ovh, and YouTube transcripts.
- Source comparison and manual result selection.
- Per-song timing offset and a timeline editor.
- Translation, romanization, translation cache, and editable translated lines.
- Full-screen focus lyrics, Session lyrics, floating desktop lyrics, and lyric sharing.
- Lyrics keep following playback even when the Session panel is hidden.

### Library and offline use

- YouTube Music liked songs, playlists, albums, artists, history, and subscriptions.
- Like or unlike tracks directly from lists and the player.
- Download manager with pause, resume, retry, and failed-item cleanup.
- Offline cache and offline-only playback.
- Local music folder scanning, filtering, sorting, and playback.
- Local playlists, smart playlists, backup import/export, and layout restore.

### Desktop experience

- Resizable Session panel with Queue and Lyrics views.
- Compact mini player with an external drag handle.
- Always-on-top desktop lyrics with synchronized translation.
- English, Traditional Chinese, Simplified Chinese, Japanese, and Korean interface languages.
- Automatic update checks through GitHub Releases. The installed Windows build downloads, installs, and reopens a new version after one click on **Update now**.

## Run from source

Requirements:

- Node.js 22 or newer
- npm 10 or newer

```powershell
git clone https://github.com/adam10000423-oss/Auralane.git
cd Auralane
npm install
npm start
```

The bundled local translation runtime and language models are optional release components and are not stored in Git because of their size. Source builds automatically use available online translation providers when the local runtime is absent.

## Build packages

```powershell
npm ci
npm test
npm run dist
```

Build output is written to `dist/`. Windows produces an NSIS installer and a portable executable. macOS packages are built on macOS runners for both Intel and Apple silicon.

Creating a tag such as `v1.0.1` triggers the GitHub Actions release workflow and publishes the update metadata required by `electron-updater`.

## Privacy and security

- The renderer uses context isolation, sandboxing, and no Node.js integration.
- Embedded web playback is restricted to `music.youtube.com`.
- External navigation is limited to HTTPS and opens outside the app.
- Session cookies use Electron `safeStorage`; Auralane does not persist them when secure OS storage is unavailable.
- Account data, queues, downloads, local file paths, lyrics caches, and playback history remain on the local device.
- CI checks production dependencies and runs the project test suite for releases and pull requests.

See [SECURITY.md](SECURITY.md) for responsible vulnerability reporting.

## Documentation

- [Detailed user guide](USER_GUIDE.md)
- [Release history](https://github.com/adam10000423-oss/Auralane/releases)
- [Issue tracker](https://github.com/adam10000423-oss/Auralane/issues)

## License

[MIT](LICENSE)
