# Spotify Library

The Library sidebar now has a Spotify page. Users sign in on Spotify's real web
player inside a sandboxed, isolated Electron window. An application client secret
is not required for this path. The older public-playlist API form is no longer
displayed in Settings.

## Data and Playback

- The page lists Spotify playlists and Liked Songs using the signed-in web session.
- Playlist pages retain Spotify's titles, artwork and ordering. Source metadata
  is not translated by interface localization.
- Library and track pages use raw server item counts for pagination, including
  entries filtered out as folders, unavailable tracks or podcasts. There is no
  arbitrary 100-song import limit. Rendering is batched in 100-row increments.
- Save as playlist loads source metadata and saves lazy track references. Playback
  matches individual recordings using strict title/artist/version/duration checks.
- Unmatched tracks are shown explicitly. A match does not grant Spotify audio
  playback: audio is resolved through the existing YouTube Music player.
- Matching is on demand, not an up-front wait for the complete playlist.
  Source metadata retained in memory is bounded to 10,000 unique tracks.

## Authentication and Limitations

Interactive sign-in now completes on the official Spotify landing with a saved
`sp_dc` cookie; it no longer waits for the DRM player to start. A live diagnostic
observed unsupported key-system and React errors after a successful Google
handoff. Metadata token renewal observes only Spotify's own non-anonymous token
responses in the main process, independently of playback readiness. No DRM media
is decrypted or played through this integration. Token observation is detached
before navigating to identity providers; no passwords or token values enter the
renderer bridge or logs. Name lookup is bounded and never gates login completion.

The implementation independently follows the data flow studied in
[BitChord's SpotifyLibrary](https://github.com/kushagrasinghx/BitChord/blob/main/shared/src/jvmSharedMain/kotlin/com/music/bitchord/data/spotify/SpotifyLibrary.kt):
real web-player authentication, playlist/liked metadata and YouTube Music matching.
No BitChord application source is vendored.

Spotify's web-player GraphQL operations are undocumented and may change or be
restricted. Auralane reports authentication, transport and interface errors rather
than presenting failed requests as empty collections. This is not a supported
Spotify OAuth integration and cannot be guaranteed to remain compatible.

The web-player's outgoing authenticated requests supply session credentials in
main-process memory. Anonymous sessions without a signed-in cookie are ignored.
No password fields, cookie values, bearer tokens or client tokens are sent to the
Auralane renderer or included in backups. Each Auralane account uses a separately
hashed persistent Electron session partition. Disconnect clears that partition's
site data/cache and forgets in-memory credentials/metadata. Credentials are not
written to a new app-managed plaintext configuration file; Chromium manages its
own persistent site session.

Login windows have no preload, no Node integration, sandbox/context isolation
enabled, denied permissions/downloads and a narrow HTTPS navigation allowlist.
All feature IPC is guarded by the existing main-window/main-frame checks.

Visible login now uses the same native user agent and new in-memory session
pattern as YouTube Music, rather than rewriting the UA. Only Spotify's own
sp_dc session cookie is moved into its account-scoped persistent partition after
authenticated web-player requests are observed. Google cookies stay in memory
and are discarded when login finishes or is cancelled.

YouTube Music's Google ServiceLogin is a first-party flow; Spotify's Google
button invokes a different third-party flow. Matching window configuration does
not override Google's embedded-browser restrictions and is not proof that Google
login will work. A blocked third-party flow still requires an approved browser
authorization path or Spotify's own supported email/password login.

OAuth popup windows now retain the native opener relationship instead of being
converted to same-window navigation. New windows from trusted login origins may
start on about:blank, but all subsequent navigation remains allowlisted and
sandboxed. Google's accounts.youtube.com completion domain is included; unknown
redirect hosts are reported without logging query strings or login credentials.
Real Google password submission must still be performed and verified by the user.

The login navigation boundary now follows BitChord's SpotifyLoginScreen.kt host
families (Spotify/scdn, Google/gstatic, Facebook and Apple), with HTTPS-only and
dot-boundary subdomain checks; the existing accounts.youtube.com handoff remains
allowed. Login-only storage-access permissions require trusted requesting and
top-level origins. Camera, microphone and other permissions remain denied, native
UA and sandboxing remain intact. This fixes local redirect/storage blockers, not
Google's embedded-browser policy, and is not proof of a completed Google login.

## Saved Spotify Accounts

The current UI is single-account only. It retains one persistent Chromium session
per Auralane profile and exposes only Sign in, Sign out and Refresh. On migration
from the experimental multi-account UI, a connected selected profile is kept;
otherwise an existing connected profile (including the original partition) is
retained. Other saved sessions are disconnected and the index is reduced to one.
Closing or restarting the app disposes runtime windows/tokens, not the persistent
Spotify cookie. Only explicit Sign out clears it. Provider expiry or revocation
can still require another sign-in.

The multi-account description below documents the previous experimental format
used by the migration reader, not currently available UI controls.

Default numbered labels are no longer used. Account names come from Spotify's
authenticated `/v1/me` display name (or Spotify ID), with the official web-player
profile control as a fallback when Web API scope is unavailable. Failed name
lookups are bounded and briefly cached. The last known name remains in the
non-secret account index. Google regional login redirects use a bundled explicit
allowlist from `https://www.google.com/supported_domains`; lookalike domains,
non-HTTPS URLs, credentials in URLs and non-default ports remain blocked. This
does not override Spotify's country availability or Google account restrictions.

Each Auralane account can retain up to ten isolated Spotify profiles. The first
profile reuses the original session partition, preserving an existing sign-in.
Adding another profile opens a fresh login and never clears the active profile;
cancelling leaves the original account and playlist results intact. Switching
selects a saved session. Sign out clears only that profile's session; Remove
requires confirmation and also removes its local entry. Labels can be renamed.

An atomic JSON index stores only random profile IDs, display labels and selection;
cookies remain in Chromium's session storage. In-flight pages are revision-checked
and queue pagination is profile-bound, so switching cannot append another
profile's private playlist results. Public saved track metadata remains playable
through the existing on-demand YouTube Music matching flow.

## Regression Tests

Live sign-in diagnostics identified a blocked `accounts.google.com.tw` handoff
after password submission. The bounded Google Taiwan domain is now allowed;
suffix lookalikes remain rejected. This was an application navigation block,
not evidence of an incorrect password. A real completed sign-in still requires
verification after restarting the main process.

`npm run test:spotify` covers real browser rendering with mocked service responses,
102-track pagination/import order, five languages at 390/1280px, account changes,
parser behavior, best-cover selection, authentication isolation, cancellation and
error handling. This does not replace signing in to a real Spotify account and
checking current upstream compatibility; that validation is still required.

## Glass Appearance

Liquid Glass now uses a 38%-opaque neutral base, 22px stationary blur, stronger
edge highlights, inset depth and 24-26px rounded primary surfaces. Settings and
navigation receive inexpensive translucent fills rather than per-card blur.
Song rows and lyric words never receive backdrop filters. Reduced transparency,
low-power mode and active queue/panel dragging retain solid, non-blurred fallbacks.
