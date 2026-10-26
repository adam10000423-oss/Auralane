# Standalone Lyrics Providers

Only new files belong to this implementation. No registration, IPC, renderer,
provider ordering, cooldown, quality ranking, or fallback changes are included.
No publishing is performed. No requests are made on import.

## Exact CommonJS API

```js
const {
  providerIds, labels, query, LyricsProviderError
} = require("./lyricsProviders"); // From another src/main module.

const controller = new AbortController();
const result = await query("binilyrics", {
  title: "Pay That Toll",
  artist: "OneRepublic",
  // album: "...",           // Optional string.
  // durationSeconds: 123,   // Actual recording duration, not lyric end time.
  // durationMs: 123000,     // Alternative; takes precedence over seconds.
  // isrc: "..."            // Real recording ISRC only; never a video ID.
}, {
  signal: controller.signal,
  timeoutMs: 10000
  // fetch: globalThis.fetch // Optional WHATWG fetch injection for tests.
});
// controller.abort() cancels the entire lookup, including document retrieval.
```

Exports:

- `providerIds`: frozen array: `lrc-red`, `binilyrics`, `unison`,
  `betterlyrics-portato`, `genius`.
- `labels`: frozen ID-to-display-label map: lrc.red, BiniLyrics, Unison,
  BetterLyrics Portato, Genius.
- `query(provider, context, options?)`: async; resolves one result or throws.
- `LyricsProviderError`: Error subclass with `code`, `provider`, and optional
  HTTP `status` or underlying `cause`.

Context requires `title` and `artist`. Aliases: `trackName`, `artistName`,
`albumName`, and `duration` (seconds). Duration precedence is `durationMs`,
`durationSeconds`, `duration`. Zero/omitted duration means unknown. Negative,
nonfinite durations and malformed nonempty ISRCs fail before networking.
ISRCs are uppercased and separator hyphens removed; none are synthesized.

Result shape:

```js
{
  rawLyrics: "...",       // Sanitized TTML, LRC/enhanced LRC, or plain text.
  sourceId: "binilyrics:USABC2400001", // Provider-prefixed stable identity.
  metadata: {
    provider: "binilyrics", label: "BiniLyrics",
    title: "...", artist: "...", duration: 123, isrc: "...",
    match: "metadata",   // Or "isrc" for supplied-ISRC lookups.
    durationVerified: true,
    format: "ttml",      // "ttml", "lrc", or "plain".
    synced: true, requests: 2
  }
}
```

Unreported identity fields are `null`, not copied from the query. Do not treat
`metadata.synced` as a quality score or infer word quality from the provider.
The parent should parse `rawLyrics` using its current parser, then apply its
existing quality ranking. Untimed text has no fabricated `[00:00]` stamps.
TTML is preserved, including supplied span timing. QRC is reduced to line LRC
using supplied millisecond line starts; word interpolation is never performed.

## Strict Matching And Limitations

Search candidates require exact normalized title and artist equality. Unicode
case, punctuation and spacing are normalized. Only bracketed official-video/
lyrics presentation labels are removed. Live, remix, remastered, featured-artist
and other version/credit differences are intentionally NOT discarded.
Candidate lists are bounded at 50 entries and closest duration wins.

When the caller supplies duration, the result must expose a recording duration
within **3 seconds**. Missing duration causes `MATCH_UNVERIFIABLE`, not a guessed
match. Portato can verify title/artist from QRC/LRC `ti`/`ar` tags, duration from
`length`, and TTML from explicit `body dur`. Final sung-word timing is never
used as recording duration. Missing title/artist also fails closed.

Supplied ISRC lookups for lrc.red and BiniLyrics establish recording identity
without requiring all metadata fields. Any returned contradictory title,
artist, ISRC or duration still fails. BiniLyrics must echo the requested ISRC.
No fallback to a different recording occurs after an ISRC miss.

**Integration consequence:** Genius generally returns no duration, so a query
with duration will usually reject it as unverifiable. Unison and Portato can
also omit required metadata. A caller that intentionally omits duration can
receive title/artist-verified lyrics, with `durationVerified: false`; that is
not equivalent to full recording verification. Do not silently drop duration
on retry. No live availability claim is made for Pay That Toll or other songs.

## Transport And Errors

One whole-query deadline defaults to 10 seconds, configurable from 1 to 30000
milliseconds. At most two GETs, 2 MiB per response, no retries or redirects.
Cancellation/deadline include body reads and propagate to fetch. Remote document
URLs must use HTTPS on explicit provider hosts, without credentials or ports.
Markup is parsed with the existing xmldom dependency; DTDs/entities and HTML
challenge pages are refused, scripts and external-resource attributes removed.
Genius HTML is reduced to text from lyrics containers only.

Error codes:

- `INVALID_PROVIDER`, `INVALID_CONTEXT`, `INVALID_OPTIONS`: caller errors.
- `NOT_FOUND`: empty results/lyrics or HTTP 404.
- `NO_MATCH`: contradictory metadata or no strictly matching recording.
- `MATCH_UNVERIFIABLE`: required identity/duration metadata absent.
- `ABORTED`, `TIMEOUT`: caller cancellation vs whole-query deadline.
- `ACCESS_DENIED`: HTTP 401/403; `RATE_LIMITED`: HTTP 429.
- `HTTP_ERROR`: other unsuccessful statuses, including 5xx.
- `NETWORK_ERROR`: transport/body failures.
- `INVALID_RESPONSE`: invalid JSON/XML, untrusted URL, missing payload/schema.
- `PROVIDER_ERROR`: explicit upstream failure envelope.
- `RESPONSE_TOO_LARGE`, `REQUEST_LIMIT`: safety limits.

Failures are never cached or converted into successful empty lyrics.

## Contract Research And Tests

Endpoint contracts were inspected from public BitChord source at commit
`edc1e6f36febf71a118e649411d2fc21b70ead45` on 2026-10-23. This module was
independently implemented; no GPL implementation or fixtures were copied.
Tests use invented lyric text and mocked requests, not third-party lyrics.

Contract references:

- [lrc.red](https://github.com/kushagrasinghx/BitChord/blob/edc1e6f36febf71a118e649411d2fc21b70ead45/shared/src/jvmSharedMain/kotlin/com/music/bitchord/data/lyrics/LrcRed.kt): `/search.json?q=`, `/s/{ISRC}.ttml`.
- [BiniLyrics](https://github.com/kushagrasinghx/BitChord/blob/edc1e6f36febf71a118e649411d2fc21b70ead45/shared/src/jvmSharedMain/kotlin/com/music/bitchord/data/lyrics/BiniLyrics.kt): `https://lyrics-api.binimum.org/`, ISRC-only or track/artist/album/duration search, `results[].lyricsUrl`.
- [Unison](https://github.com/kushagrasinghx/BitChord/blob/edc1e6f36febf71a118e649411d2fc21b70ead45/shared/src/jvmSharedMain/kotlin/com/music/bitchord/data/lyrics/Unison.kt): `https://unison.boidu.dev/lyrics`, song/artist/album/duration, success/data envelope.
- [Portato](https://github.com/kushagrasinghx/BitChord/blob/edc1e6f36febf71a118e649411d2fc21b70ead45/shared/src/jvmSharedMain/kotlin/com/music/bitchord/data/lyrics/BetterLyrics.kt): `https://lyrics-api.boidu.dev/qq/getLyrics`, s/a/al/d.
- [Genius](https://github.com/kushagrasinghx/BitChord/blob/edc1e6f36febf71a118e649411d2fc21b70ead45/shared/src/jvmSharedMain/kotlin/com/music/bitchord/data/lyrics/Genius.kt): `/api/search/multi?q=`, song-section hits, HTML lyrics containers. Plain only.

Run independently, without modifying package.json:

```powershell
node scripts/test-lyrics-providers.js
```
