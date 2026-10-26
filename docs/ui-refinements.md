# Player, Glass and Replay Refinements

## Presentation

- Only Liquid Glass uses the compact 72px player, centered with a maximum width
  of 1080px. The song, artist, artwork and thin seek track form one central group.
- Switching to Standard restores the original DOM positions and existing player
  controls. No cloned buttons, extra audio elements or duplicate event handlers
  are introduced for switching modes.
- Fullscreen lyrics keeps an opaque background and hides underlying main/sidebar
  content. Compact mode overrides the legacy fullscreen grid and metadata overlay;
  Standard retains the original expanded player layout.
- The top search bar is redesigned only in Glass mode. Container queries respond
  to the actual content width, including Session panel resizing.
- Glass extends to account menus, suggestions and secondary tool popovers without
  applying blur to every song row or lyric word. Reduced transparency/power and
  dragging fallbacks remain available.

## Queue

Reordering renders the new queue synchronously before awaiting persistence. The
old drag ghost and markers are removed within that same event task. A failed save
rolls back only if the owning account and applied queue are still current, so it
cannot overwrite newer edits or another account's data.

## Replay Sources

The default source is YouTube Music account history, fetched through the existing
authenticated `FEmusic_history` integration. These are the history groups that
YouTube Music returned, not an exhaustive lifetime log or official Recap report.
No historical listening duration or annual ranking is inferred from those rows.
Data is cached per active account and refreshed explicitly; stale asynchronous
responses cannot repopulate another account's page.

The separate device view retains calendar periods, actual listening time, song
and artist rankings, independently of the cloud source. Date/export utilities
are collapsed under More; the daily chart and recording-start diagnostics no
longer occupy the main view. Existing stored records are preserved.

This distinction follows inspection of BitChord's `ReplayModel.kt` and
`ListeningStats.kt`: BitChord's Replay summaries are local elapsed-playback
aggregates, not downloaded YouTube Music listening-time totals.

## Spotify and Video Artwork

Spotify already opens `accounts.spotify.com/login` directly with an official
web-player continuation URL; regression tests assert this behavior.

Custom video artwork accepts direct HTTPS media files rather than YouTube/Spotify
page URLs. Fields are shown only when enabled. Saving a valid URL enables it,
paused settings can show a controllable preview, and fullscreen lyrics can attach
the video to its cover area. Playback errors are shown beside the artwork controls;
clearing disables/unloads it. Remote media availability and codec support remain
dependent on the URL and platform.

## Verification

- `npm run test:player`: layout bounds, repeated Standard/Glass restoration,
  fullscreen alignment and original command handlers across widths.
- `npm run test:ui`: account-history isolation, no fabricated cloud metrics,
  real video decoding/preview/fullscreen transfer, and optimistic queue ordering.
  The video test generates a small synthetic WebM using local `ffmpeg` (test-only).
- `npm run test:workspace`, `npm run test:spotify`, `npm run test:features` and
  `npm test` cover the existing workspace, integrations and bridge behavior.

Electron screenshots and real account-history loading were also inspected.

## Playlist, Lyrics and Glass Follow-up

- Spotify playlist metadata now opens the existing collection screen. Tracks are
  matched individually on demand, with in-flight deduplication, strict recording
  matching and per-account caches. Loading another page fetches metadata only.
  Direct official login, switching account, disconnect and refresh remain on the
  Spotify entry screen. No client secret is required for this web-player flow.
- Glass collection toolbars, sidebar/fullscreen controls and the 5/6-width player
  are mode-specific. Fullscreen lyrics uses an opaque scene so the home view
  cannot show through. Standard player layout remains separate.
- Settings no longer requires expanding cards. Connected services are separate
  groups; the legacy Spotify API form and duplicate tempo-analysis panel are
  hidden. Custom audio sources opens an editor only when adding/editing a source.
  Third-party services still require their own supported credentials.
- Existing Musixmatch controls are now bound correctly. Provider selections are
  shared by automatic searches, manual searches and prefetch, including YouTube
  fallback. Locally saved lyrics are not considered a network search.
- Source cycling preserves rich word timing and explicit singer roles. TTML
  declared speaker IDs map to the existing voice layout. Lyrics without singer
  metadata are not assigned invented left/right roles.
- Music recognition routes its query to ordinary Search instead of candidate
  cards. Queue clear asks for confirmation; Liked Songs is last in the Library
  group. Online room display names default to the account name plus `'s room`.
- All eleven current home chips returned real YouTube Music sections during
  Electron checks. Filtered views retain their endpoint, parameters and server
  ordering. Personalized contents cannot be identical across different accounts.

Additional tests: `node --test scripts/test-lyrics-controls.js` covers rapid
source cycling, original timing preservation, disabled flags and queue cancel.
Spotify login was signed out in the tested preview: authenticated pagination and
lazy matching were verified with fixtures, not a newly completed real login.

## Final Audit and Autoplay

The latest requested width supersedes the previous 5/6 layout: Glass now-playing
is 2/3 of the viewport on desktop, retaining the narrow-screen layout.

Connected services show a status and Connect/Disconnect, with credentials in
separate native dialogs rather than permanent forms or expanding sections.
Closing cancels and clears secret fields; authentication errors remain visible
inside the dialog. Unsupported credential-free service login is not simulated.

Material, provider flags and the autoplay preference now use the durable main
process store, account-scoped and validated. This avoids the loopback server's
changing origin resetting those localStorage-only preferences. A real Electron
restart retained Glass and an explicitly disabled Musixmatch checkbox; the
provider was excluded from searches. All providers were re-enabled afterward.

Autoplay is distinct from rule-based smart playlists. It defaults on, can be
disabled in Playback, and requests a YouTube Music station only once the original
queue and its continuation pages are exhausted. Batches contain at most ten
recommendations, prefer audio, reject repeated recordings and cap each artist.
Existing shuffle history is retained rather than reseeded. Offline, queue lock,
repeat modes, sleep-finish modes and guest controls take precedence. Stale network
responses cannot append into another queue or account, and duplicate ended
callbacks share one advancement.

Reference behavior inspected in BitChord's DesktopAutoplay.kt, Autoplay.kt and
QueueBuilder.kt. Actual YouTube Music station testing returned fifty candidates
and ten new recommendations without mutating the user's queue.

Additional verification: npm run test:autoplay, npm run test:ui and
npm run test:features include recommendation races, persisted flags, credential
dialogs and source-cycling regressions. External personalized feeds are not
promised to match another app's account-specific contents exactly.

## Lyric Line Motion

Consecutive lyric changes now lift and settle the incoming line over 620ms, with
a small translation/romanization stagger. Only the line text containers animate;
word timing, role metadata, source selection and list geometry are untouched.
Opacity fades accompany the existing native smooth scroll. Low-power/reduced
motion and large timeline jumps avoid the entrance animation; desktop floating
lyrics are unchanged. No persistent per-glyph layer or blur animation is added.

## YouTube and Local Video Artwork

Video artwork accepts YouTube watch, short, shorts, live and embed URLs, plus
direct HTTPS video files. YouTube uses the official privacy-enhanced IFrame API
player, muted by default, retaining the player UI and minimum display size.
Embeds rejected with 101/150 are identified explicitly; unavailable players or
buffering timeouts restore the static artwork. No download/extraction workaround
is used to override upstream restrictions.

The native picker selects MP4, M4V, WebM or MOV files. Actual playback depends on
the file's codec. Main retains the selected path; renderer gets a random,
account-scoped loopback capability URL and the basename only. Requests cannot
choose arbitrary paths, require the active account's token, and support byte
ranges and HEAD. Clear forgets the selection, never deletes the user's file.

Artwork settings and local references survive restart. Switching account, source,
fullscreen target, reduced-motion or low-power mode releases the previous player.
Tests cover real WebM decoding for local/HTTPS sources and mocked official API
playback/lifecycle for YouTube. Live testing observed a 150 rejection for one
music video and buffering for the official demo; successful live YouTube playback
has not been confirmed on this machine.

## Workspace Polish (2026-10-25)

The newer background setting supersedes the artwork-only placement above. A
single global muted video or image now fills the app behind readable surfaces.
The native picker also accepts JPEG, PNG, WebP, GIF and AVIF; Clear forgets the
association without deleting the file. Expanded lyrics hides the underlying
workspace and background. Low-power/reduced-motion stops video playback.
YouTube still uses the official embed, so provider embedding restrictions apply.

- Spotify ignores OAuth ERR_ABORTED navigation, keeps the native popup/opener,
  and does not parent the popup to a login window that Spotify may close. Its
  temporary session uses an in-memory cache and preconnect. Real Google account
  authorization still requires user verification; no passwords are automated.
- Glass player has a shorter center track (60% desktop width, capped at 1040px),
  a direct download button, neutral unliked heart and artwork expand overlay.
- Every song download action is followed by a like toggle. Liked hearts are red.
- Replay local periods occupy their own row; More and the artist ranking list
  are removed. Songs reuse the Liked Songs row renderer. Cloud history refreshes
  after sixty seconds; today's actual device listens are identified separately.
- Explore follows BitChord's server-defined moods/genres, deduplicated by browse
  ID plus params. Its cover is the first actual playlist image inside that exact
  category, lazily requested with two workers and cached for opening the page.
  References: BitChord ExploreScreen.kt, InnertubeParser.parseMoodAndGenres and
  YtMusicRepository.moodGenreArtwork; independently implemented, no code copied.
- Fresh lyric searches display the first usable word-timed result immediately,
  falling back to line/plain only after providers finish. No provider is pinned
  above others; saved/manual selections remain authoritative. Settings source
  controls are hidden; manual search source toggles still filter every request.
  Interface translation excludes lyric nodes; explicit lyric translations remain
  separate auxiliary lines. Play Next immediately begins lyric prefetch.
- Source text and translation-language selectors support the translation language
  catalog with native-language names. Fresh profiles use system preferred language;
  existing choices are not overwritten. Additional interface languages translate
  only static app dictionaries on demand and cache them; offline/untranslated
  strings fall back to English. This is not human-reviewed complete localization.
- Light/dark/system surfaces are independent of the accent. Black/white accents
  are available; text accents meet 4.5:1 against their light/dark reference surface.
- A full-height invisible drag placeholder moves to the prospective queue slot.
  Drop still renders optimistically before disk persistence. Recommendations fill
  the queue tail to ten ahead, separated from originals; deleted/consumed IDs are
  excluded from refill. Later playlist pages insert before recommendations.
  Offline, locked queues, repeat modes, sleep and Together guests retain priority.
  A provider failure or insufficient unique candidates can leave fewer than ten;
  no fake songs or forced retries are used to fill that gap.
- Editable text/URL/email/password/number/search fields and textareas get a clear
  action that dispatches existing input/change events. Range, checkbox, file and
  readonly controls are deliberately excluded.

## Light Theme Audit (2026-10-25)

- A final, light-only stylesheet covers menus, dialogs, hover/pressed/focus and
  disabled controls, form fields, shortcuts, sliders, loading placeholders and
  lyric tools in standard and glass materials. Artwork retains its actual colors.
- Expanded lyrics uses an opaque light surface, not a forced dark palette or a
  transparent copy of the workspace. Word progress retains its theme accent;
  unplayed glyphs use a readable slate fill without glow.
- Mini, tray and floating lyric snapshots now include the effective color scheme.
  Their light palettes preserve window dimensions, drag behavior and lyric data.
  Native control theming follows the app, without changing the OS preference.
- `npm run test:theme` checks both materials and interaction states, auxiliary
  window updates and unchanged dark surfaces. It uses the installed Edge binary.

## Lyric Intro And Backing Vocals

Backing presentation now opens 350ms before its timestamp and closes 450ms after
its end; these are visual margins only, not active-word or main-line timestamps.
Intrinsic-height, padding and opacity transitions animate the layout, with zero
inactive row space. Automatic sync re-anchors once the height transition ends.
Search groups draw focus only on their outer container. The compact sleep menu
is a separate viewport-bounded popover beside More, which remains open. It is
portaled outside the player's glass layer so backdrop filtering cannot clip it.
Label clicks and timer selection retain their normal behavior.

Device selection also uses an independent body-level popover, not a descendant
of More's scrolling glass panel. Its position is recomputed after enumeration;
closing More resets both device-menu visibility and its open state. Lyric source
comparison accepts a null current selection, and provider error rows have bounded
label columns. Card export uses a dedicated OffscreenCanvas when supported, with
a fresh HTML canvas fallback; neither path draws cross-origin artwork.

- Timed lyrics with an instrumental opening include a real, keyboard-accessible
  intro row in both lyric lists. It seeks to song time zero and reactivates after
  backward seeks, including paused seeks. Normal lyric indexes remain unchanged.
- Backing vocals occupy no layout space outside their own timestamp interval.
  Their larger text fades in while active; layout changes re-anchor the main line
  only when automatic sync is enabled. Reduced-motion and low-power modes omit
  these animations. Existing provider timestamps and word progress are retained.
- `scripts/test-lyric-presentation.js` covers intro replay, focus view, backward
  seeks, real backing intervals and removal of inactive backing-row space.
