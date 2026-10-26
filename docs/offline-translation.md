# Optional Offline Translation

The application package does not include the offline engine or models. In Settings > Lyrics, download the optional Windows x64 translation pack from this repository's GitHub Releases. Online translation remains available without the pack. The downloaded files belong to the device, not to a signed-in music account.

The pack is SHA-256 pinned in `src/config/translation-pack.json`. Downloads use a temporary directory, enforce the expected size, verify the digest, reject unsafe archive paths/symlinks and then activate the complete installation. Interrupted or failed downloads do not activate a partial installation. Cancellation discards partial files; the next attempt starts again.

Delete in the same settings row to stop the engine and remove both downloaded files and extracted model caches. Music downloads, playlists and lyrics are not removed. Application updates preserve this separate installation. macOS/Linux offline runtime packs are not available yet.

## Maintainers

1. Place the verified Windows x64 runtime and Argos models under `vendor/local-translate/runtime` and `vendor/local-translate/models`.
2. Run `node scripts/build-translation-pack.js`. This generates the ZIP and pinned manifest.
3. Run `node --test scripts/test-translation-pack.js`.
4. Run `node scripts/publish-translation-pack.js` using the existing Git credential manager. This publishes a separate non-latest prerelease asset, not a new application release. It never replaces an existing pack.
5. Ship the manifest and download manager in the next application version. Future pack revisions must use a new immutable tag/asset and corresponding pinned manifest.

Models contain their original OPUS-MT author attribution and CC-BY 4.0 notices in each `.argosmodel` ZIP's README. Runtime dependencies retain their bundled license files. No account credentials or user data belong in these packs.
