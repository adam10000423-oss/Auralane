function asString(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value).trim() || fallback;
}

function normalizeBool(value) {
  return value === true;
}

function inferItemType(item = {}) {
  const browseId = asString(item.browseId || item.id);
  if (item.type) return item.type;
  if (item.kind) return item.kind;
  if (browseId.startsWith("MPRE")) return "album";
  if (browseId.startsWith("UC")) return "artist";
  if (browseId.startsWith("VL")) return "playlist";
  if (browseId.startsWith("MPS") || browseId.startsWith("MPED")) return "podcast";
  return "browse";
}

function normalizeContinuation(input = {}, fallback = {}) {
  const token = asString(input.token || input.continuation);
  if (!token) return null;
  return {
    token,
    endpoint: asString(input.endpoint, fallback.endpoint || "browse")
  };
}

function normalizeArtist(input = {}) {
  const browseId = asString(input.browseId || input.id);
  const title = asString(input.title || input.name, "Artist");
  return {
    id: browseId || title,
    browseId: browseId || null,
    params: input.params || null,
    type: "artist",
    kind: "artist",
    title,
    subtitle: asString(input.subtitle, "Artist"),
    thumbnail: asString(input.thumbnail)
  };
}

function normalizeAlbum(input = {}) {
  const browseId = asString(input.browseId || input.id);
  if (!browseId && !input.title) return null;
  return {
    id: browseId || asString(input.id || input.title),
    browseId: browseId || null,
    params: input.params || null,
    type: "album",
    kind: "album",
    title: asString(input.title, "Album"),
    subtitle: asString(input.subtitle, "Album"),
    thumbnail: asString(input.thumbnail),
    year: asString(input.year)
  };
}

function normalizeTrack(input = {}) {
  const videoId = asString(input.videoId || input.id);
  if (!videoId) return null;
  const artists = (input.artists || []).map(normalizeArtist).filter(Boolean);
  const album = input.album ? normalizeAlbum(input.album) : null;
  const artistNames = [...new Set(artists.map((item) => asString(item.title)).filter(Boolean))];
  const artist = asString(artistNames.join(", ") || input.artist);
  return {
    ...input,
    id: videoId,
    videoId,
    type: "track",
    kind: "track",
    title: asString(input.title, "Untitled"),
    subtitle: asString(input.subtitle || artist, "YouTube Music"),
    thumbnail: asString(input.thumbnail),
    duration: asString(input.duration),
    durationSeconds: Number.isFinite(Number(input.durationSeconds)) ? Number(input.durationSeconds) : null,
    artist,
    artists,
    album,
    playlistId: input.playlistId || null,
    setVideoId: input.setVideoId || null,
    inLibrary: normalizeBool(input.inLibrary),
    libraryAddToken: input.libraryAddToken || null,
    libraryRemoveToken: input.libraryRemoveToken || null
  };
}

function normalizeBrowseItem(input = {}) {
  const type = inferItemType(input);
  if (type === "artist") return normalizeArtist(input);
  if (type === "album") return normalizeAlbum(input);

  const browseId = asString(input.browseId || input.id);
  if (!browseId) return null;
  const id = type === "playlist" ? browseId.replace(/^VL/, "") : browseId;
  return {
    ...input,
    id: asString(input.id, id),
    browseId,
    params: input.params || null,
    type,
    kind: type,
    title: asString(input.title, type === "playlist" ? "Playlist" : "Browse"),
    subtitle: asString(input.subtitle, type === "playlist" ? "Playlist" : "YouTube Music"),
    thumbnail: asString(input.thumbnail),
    year: asString(input.year)
  };
}

function dedupeBy(items, keyFactory) {
  const seen = new Set();
  const result = [];
  for (const item of items || []) {
    if (!item) continue;
    const key = keyFactory(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function dedupeTracks(items) {
  return dedupeBy((items || []).map(normalizeTrack), (item) => item.id);
}

function dedupeBrowseItems(items) {
  return dedupeBy((items || []).map(normalizeBrowseItem), (item) => `${item.browseId || item.id}:${item.params || ""}:${item.type || ""}`);
}

function normalizeSection(input = {}, index = 0) {
  const tracks = dedupeTracks(input.tracks || []);
  const items = dedupeBrowseItems(input.items || []);
  const continuations = (input.continuations || []).map(normalizeContinuation).filter(Boolean);
  if (!tracks.length && !items.length && !continuations.length) return null;
  return {
    id: asString(input.id, `${asString(input.title, "section").toLowerCase().replace(/\s+/g, "-")}-${index}`),
    title: asString(input.title, "More"),
    subtitle: asString(input.subtitle),
    browseId: input.browseId || null,
    params: input.params || null,
    type: asString(input.type, "section"),
    tracks,
    items,
    continuations
  };
}

function normalizeHeader(input = {}, fallback = {}) {
  const browseId = input.browseId || fallback.browseId || null;
  const type = input.type || fallback.type || inferItemType({ browseId });
  return {
    ...input,
    type,
    browseId,
    params: input.params || fallback.params || null,
    title: asString(input.title || fallback.title, "YouTube Music"),
    subtitle: asString(input.subtitle || fallback.subtitle, "YouTube Music"),
    description: asString(input.description || fallback.description),
    thumbnail: asString(input.thumbnail || fallback.thumbnail),
    background: asString(input.background || input.thumbnail || fallback.background || fallback.thumbnail),
    playlistId: input.playlistId || fallback.playlistId || null,
    inLibrary: normalizeBool(input.inLibrary || fallback.inLibrary),
    libraryAddToken: input.libraryAddToken || fallback.libraryAddToken || null,
    libraryRemoveToken: input.libraryRemoveToken || fallback.libraryRemoveToken || null
  };
}

function normalizePageResult(input = {}, fallback = {}) {
  const source = Array.isArray(input) ? { tracks: input } : (input || {});
  const header = normalizeHeader(source.header || {}, fallback);
  const tracks = dedupeTracks(source.tracks || []);
  const items = dedupeBrowseItems(source.items || []);
  const playlists = dedupeBrowseItems(source.playlists || []).filter((item) => item.type === "playlist");
  const sections = (source.sections || []).map(normalizeSection).filter(Boolean);
  const continuations = (source.continuations || []).map((item) => normalizeContinuation(item, fallback)).filter(Boolean);

  return {
    header,
    tracks,
    items,
    playlists,
    sections,
    continuations,
    chips: source.chips || [],
    relatedArtists: dedupeBrowseItems(source.relatedArtists || []).filter((item) => item.type === "artist"),
    pagesLoaded: Number.isFinite(Number(source.pagesLoaded)) ? Number(source.pagesLoaded) : undefined,
    meta: {
      source: fallback.source || source.meta?.source || "innertube",
      endpoint: fallback.endpoint || source.meta?.endpoint || "",
      normalizedAt: new Date().toISOString()
    }
  };
}

function mergePageResults(base = {}, next = {}) {
  return normalizePageResult({
    header: base.header || next.header,
    tracks: [...(base.tracks || []), ...(next.tracks || [])],
    items: [...(base.items || []), ...(next.items || [])],
    playlists: [...(base.playlists || []), ...(next.playlists || [])],
    sections: [...(base.sections || []), ...(next.sections || [])],
    continuations: next.continuations || [],
    chips: base.chips || next.chips || [],
    relatedArtists: [...(base.relatedArtists || []), ...(next.relatedArtists || [])],
    pagesLoaded: next.pagesLoaded || base.pagesLoaded
  }, base.header || next.header || {});
}

module.exports = {
  normalizeTrack,
  normalizeBrowseItem,
  normalizeSection,
  normalizeHeader,
  normalizePageResult,
  normalizeContinuation,
  dedupeTracks,
  dedupeBrowseItems,
  mergePageResults
};
