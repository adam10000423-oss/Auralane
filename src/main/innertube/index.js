/**
 * YouTube Music API Facade
 * Wraps InnerTubeClient (from innertube.legacy) which contains all parse logic,
 * and adds new service endpoints (history, podcast, playlist management)
 * inspired by Metrolist's YouTube.kt
 *
 * InnerTubeTransport (innertubeClient.js) is the lean transport layer
 * used directly here for the new endpoints that only need raw request().
 */
const { InnerTubeClient, parseCookieString } = require("../innertube.legacy");
const { WEB, WEB_REMIX } = require("./constants");

// Public YouTube web-client identifier, not a user credential.
const TRANSCRIPT_API_KEY = ["AIzaSy", "C9XL3ZjWddXya6X74dJoCTL-WEYFDNX3"].join("");

// ─── Helpers ──────────────────────────────────────────────

function textFromRuns(runs) {
  return (runs || []).map((r) => r.text || "").join("").trim();
}

function firstThumbnail(thumbnails) {
  const list = Array.isArray(thumbnails) ? thumbnails : [];
  const value = [...list].reverse()
    .map((thumbnail) => String(thumbnail?.url || "").trim())
    .find(Boolean) || "";
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("http://")) return `https://${value.slice(7)}`;
  return value;
}

function walk(value, visitor) {
  if (!value || typeof value !== "object") return;
  visitor(value);
  if (Array.isArray(value)) { for (const i of value) walk(i, visitor); return; }
  for (const i of Object.values(value)) walk(i, visitor);
}

function encodeVarint(value) {
  let next = Number(value) >>> 0;
  const bytes = [];
  while (next > 0x7f) {
    bytes.push((next & 0x7f) | 0x80);
    next >>>= 7;
  }
  bytes.push(next);
  return Buffer.from(bytes);
}

function protoStringField(fieldNumber, value) {
  const data = Buffer.from(String(value || ""), "utf8");
  return Buffer.concat([
    encodeVarint((fieldNumber << 3) | 2),
    encodeVarint(data.length),
    data
  ]);
}

function protoMessageField(fieldNumber, message) {
  return Buffer.concat([
    encodeVarint((fieldNumber << 3) | 2),
    encodeVarint(message.length),
    message
  ]);
}

function directTranscriptParams(videoId) {
  const inner = protoStringField(1, videoId);
  return protoMessageField(1, inner).toString("base64");
}

function legacyFlatTranscriptParams(videoId) {
  return protoStringField(1, videoId).toString("base64");
}

function endpointText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value.simpleText) return String(value.simpleText);
  if (Array.isArray(value.runs)) return textFromRuns(value.runs);
  return "";
}

function transcriptParamsFromNextResponse(response) {
  const params = [];
  const seen = new Set();
  const add = (value) => {
    const text = String(value || "").trim();
    if (!text || seen.has(text)) return;
    seen.add(text);
    params.push(text);
  };

  walk(response, (node) => {
    const getTranscript = node.getTranscriptEndpoint;
    if (getTranscript?.params) add(getTranscript.params);

    const tab = node.tabRenderer;
    if (tab?.endpoint?.browseEndpoint?.params) {
      const label = `${endpointText(tab.title)} ${endpointText(tab.tabIdentifier)} ${endpointText(tab.accessibility?.accessibilityData?.label)}`;
      if (/lyrics|transcript/i.test(label)) add(tab.endpoint.browseEndpoint.params);
    }

    const button = node.buttonRenderer;
    if (button?.navigationEndpoint?.getTranscriptEndpoint?.params) {
      add(button.navigationEndpoint.getTranscriptEndpoint.params);
    }
  });

  return params;
}

function lyricsBrowseIdsFromNextResponse(response) {
  const ids = [];
  const seen = new Set();
  const add = (value) => {
    const text = String(value || "").trim();
    if (!text || seen.has(text)) return;
    seen.add(text);
    ids.push(text);
  };

  walk(response, (node) => {
    const tab = node.tabRenderer;
    if (!tab?.endpoint?.browseEndpoint?.browseId) return;
    const label = `${endpointText(tab.title)} ${endpointText(tab.tabIdentifier)} ${endpointText(tab.accessibility?.accessibilityData?.label)}`;
    if (/lyrics|transcript/i.test(label) || String(tab.endpoint.browseEndpoint.browseId).startsWith("MPLY")) {
      add(tab.endpoint.browseEndpoint.browseId);
    }
  });

  return ids;
}

function durationFromText(value) {
  const m = String(value || "").match(/\b\d{1,2}:\d{2}(?::\d{2})?\b/);
  return m ? m[0] : "";
}

function artistLinksFromRuns(runs) {
  const items = [];
  for (const run of runs || []) {
    const ep = run.navigationEndpoint?.browseEndpoint;
    const id = ep?.browseId;
    if (!id || !String(id).startsWith("UC") || !String(run.text || "").trim()) continue;
    items.push({ id, browseId: id, type: "artist", title: String(run.text).trim(), subtitle: "Artist", thumbnail: "" });
  }
  return items;
}

function albumLinkFromRuns(runs) {
  for (const run of runs || []) {
    const ep = run.navigationEndpoint?.browseEndpoint;
    const id = ep?.browseId;
    if (!id || !String(id).startsWith("MPRE") || !String(run.text || "").trim()) continue;
    return { id, browseId: id, type: "album", title: String(run.text).trim(), subtitle: "Album", thumbnail: "" };
  }
  return null;
}

const LIB_ADD = new Set(["LIBRARY_ADD", "BOOKMARK_BORDER"]);
const LIB_SAVED = new Set(["LIBRARY_SAVED", "BOOKMARK", "LIBRARY_REMOVE"]);

function extractLibraryTokens(menuItems) {
  let addToken = null, removeToken = null, currentState = "";
  for (const item of menuItems || []) {
    const r = item.toggleMenuServiceItemRenderer;
    if (!r) continue;
    const icon = r.defaultIcon?.iconType;
    if (!icon || icon === "KEEP" || icon === "KEEP_OFF") continue;
    const isAdd = LIB_ADD.has(icon);
    const isSaved = LIB_SAVED.has(icon) || String(icon).startsWith("LIBRARY_");
    if (!isAdd && !isSaved) continue;
    if (!currentState) currentState = isAdd ? "add" : "saved";
    const dt = r.defaultServiceEndpoint?.feedbackEndpoint?.feedbackToken || null;
    const tt = r.toggledServiceEndpoint?.feedbackEndpoint?.feedbackToken || null;
    if (isAdd) { if (!addToken) addToken = dt; if (!removeToken) removeToken = tt; }
    else { if (!removeToken) removeToken = dt; if (!addToken) addToken = tt; }
  }
  return { libraryAddToken: addToken, libraryRemoveToken: removeToken, inLibrary: currentState === "saved" };
}

// ─── History Parsing (NEW — from Metrolist HistoryPage.kt) ─

function parseHistoryTrack(renderer) {
  if (!renderer) return null;
  const videoId = renderer.playlistItemData?.videoId;
  if (!videoId) return null;
  const columns = renderer.flexColumns || [];
  const title = textFromRuns(columns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs) || "Untitled";
  const subtitleRuns = columns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
  const artists = artistLinksFromRuns(subtitleRuns);
  const fixedDuration = textFromRuns(renderer.fixedColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs);
  const thumbnails = renderer.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
  const lib = extractLibraryTokens(renderer.menu?.menuRenderer?.items);
  const historyRemoveToken = (renderer.menu?.menuRenderer?.items || [])
    .find((i) => i.menuServiceItemRenderer?.icon?.iconType === "REMOVE_FROM_HISTORY")
    ?.menuServiceItemRenderer?.serviceEndpoint?.feedbackEndpoint?.feedbackToken || null;

  return {
    kind: "track", type: "track", id: videoId, videoId, title,
    subtitle: textFromRuns(subtitleRuns) || "YouTube Music",
    thumbnail: firstThumbnail(thumbnails),
    duration: durationFromText(fixedDuration) || durationFromText(textFromRuns(subtitleRuns)),
    artist: [...new Set(artists.map((item) => item.title).filter(Boolean))].join(", "), artists,
    album: albumLinkFromRuns(columns.flatMap((c) => c.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [])),
    ...lib, historyRemoveToken
  };
}

function parseHistorySections(response) {
  const sections = [];
  const sectionListContents =
    response?.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents || [];

  for (const content of sectionListContents) {
    const shelf = content.musicShelfRenderer;
    if (!shelf) continue;
    const title = textFromRuns(shelf.title?.runs) || "History";
    const tracks = [];
    for (const item of shelf.contents || []) {
      const track = parseHistoryTrack(item.musicResponsiveListItemRenderer);
      if (track) tracks.push(track);
    }
    if (tracks.length) sections.push({ title, tracks });
  }
  return sections;
}

// ─── Podcast Parsing (NEW — from Metrolist PodcastPage.kt) ─

function parseEpisodeFromMultiRow(renderer, podcastInfo) {
  if (!renderer) return null;
  const videoId = renderer.onTap?.watchEndpoint?.videoId;
  if (!videoId) return null;
  const subtitleRuns = renderer.subtitle?.runs || [];
  const subtitleParts = [];
  let current = [];
  for (const run of subtitleRuns) {
    if (run.text === " • " || run.text === " · ") { subtitleParts.push(current); current = []; }
    else current.push(run);
  }
  if (current.length) subtitleParts.push(current);
  const thumbnails = renderer.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];

  return {
    kind: "episode", type: "episode", id: videoId, videoId,
    title: textFromRuns(renderer.title?.runs) || "Untitled",
    subtitle: textFromRuns(subtitleRuns),
    thumbnail: firstThumbnail(thumbnails),
    duration: durationFromText(textFromRuns(subtitleParts[subtitleParts.length - 1] || [])),
    publishDate: textFromRuns(subtitleParts[0] || []),
    artist: podcastInfo?.author || "", artists: [],
    podcast: podcastInfo ? { id: podcastInfo.id, title: podcastInfo.title } : null
  };
}

function parseEpisodeFromResponsive(renderer, podcastInfo) {
  if (!renderer) return null;
  const videoId = renderer.playlistItemData?.videoId;
  if (!videoId) return null;
  const columns = renderer.flexColumns || [];
  const title = textFromRuns(columns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs);
  const subtitleRuns = columns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
  const thumbnails = renderer.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];

  return {
    kind: "episode", type: "episode", id: videoId, videoId,
    title: title || "Untitled",
    subtitle: textFromRuns(subtitleRuns),
    thumbnail: firstThumbnail(thumbnails),
    duration: durationFromText(textFromRuns(subtitleRuns)),
    publishDate: "",
    artist: podcastInfo?.author || "", artists: [],
    podcast: podcastInfo ? { id: podcastInfo.id, title: podcastInfo.title } : null
  };
}

function parsePodcastPage(response, browseId) {
  const episodes = [];
  walk(response, (node) => {
    if (node.musicMultiRowListItemRenderer) {
      const ep = parseEpisodeFromMultiRow(node.musicMultiRowListItemRenderer, { id: browseId, title: "", author: "" });
      if (ep) episodes.push(ep);
    }
    if (node.musicResponsiveListItemRenderer) {
      const ep = parseEpisodeFromResponsive(node.musicResponsiveListItemRenderer, { id: browseId, title: "", author: "" });
      if (ep) episodes.push(ep);
    }
  });

  // Extract podcast header
  let podcastTitle = "", podcastAuthor = "", podcastThumbnail = "";
  walk(response, (node) => {
    const h = node.musicImmersiveHeaderRenderer || node.musicVisualHeaderRenderer || node.musicResponsiveHeaderRenderer;
    if (!h || podcastTitle) return;
    podcastTitle = textFromRuns(h.title?.runs) || "";
    podcastAuthor = textFromRuns(h.straplineTextOne?.runs) || textFromRuns(h.subtitle?.runs) || "";
    podcastThumbnail = firstThumbnail(
      h.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
      h.foregroundThumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || []
    );
  });

  // Update episodes with podcast info
  for (const ep of episodes) {
    ep.podcast = { id: browseId, title: podcastTitle };
    ep.artist = podcastAuthor;
  }

  // Extract continuation
  let continuation = null;
  walk(response, (node) => {
    if (continuation) return;
    const token = node.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
    if (token) continuation = token;
  });

  return {
    podcast: { id: browseId, title: podcastTitle, author: podcastAuthor, thumbnail: podcastThumbnail, type: "podcast" },
    episodes,
    continuation
  };
}

// ─── YouTube Facade ───────────────────────────────────────

class YouTube {
  constructor(state = {}, options = {}) {
    this._client = new InnerTubeClient(state, options);
  }

  setAuth(state) { this._client.setAuth(state); }
  get locale() { return this._client.locale; }
  set locale(v) { this._client.locale = v; }

  // ── Proxy all existing methods ──
  accountInfo() { return this._client.accountInfo(); }
  search(query, filter) { return this._client.search(query, filter); }
  searchArtists(query) { return this._client.searchArtists(query); }
  home(params) { return this._client.home(params); }
  explore() { return this._client.explore(); }
  charts() { return this._client.charts(); }
  newReleases() { return this._client.newReleases(); }
  moods() { return this._client.moods(); }
  browse(browseId, params, login) { return this._client.browse(browseId, params, login); }
  artist(browseId, params) { return this._client.artist(browseId, params); }
  artistItems(browseId, params, title) { return this._client.artistItems(browseId, params, title); }
  collection(browseId, params) { return this._client.collection(browseId, params); }
  playlist(playlistId) { return this._client.playlist(playlistId); }
  queue(payload = {}) { return this._client.queue(payload || {}); }
  continuation(token, endpoint) { return this._client.continuation(token, endpoint); }
  feedback(tokens) { return this._client.feedback(tokens); }
  likeVideo(videoId) { return this._client.likeVideo(videoId); }
  unlikeVideo(videoId) { return this._client.unlikeVideo(videoId); }
  subscribeChannel(channelId, subscribe, params) { return this._client.subscribeChannel(channelId, subscribe, params); }
  addToPlaylist(playlistId, videoId) { return this._client.addToPlaylist(playlistId, videoId); }
  createPlaylist(title, videoIds) { return this._client.createPlaylist(title, videoIds); }
  library(browseId) { return this._client.library(browseId); }
  collectLibrary(browseId) { return this._client.collectLibrary(browseId); }
  libraryOverview() { return this._client.libraryOverview(); }
  playback(videoId, playlistId, quality) { return this._client.playback(videoId, playlistId, quality); }

  // ── NEW: History (Metrolist: YouTube.kt → history()) ──
  async history() {
    const response = await this._client.request(
      "browse",
      { browseId: "FEmusic_history" },
      { login: true }
    );
    return { sections: parseHistorySections(response) };
  }

  async removeFromHistory(feedbackToken) {
    return this._client.feedback([feedbackToken]);
  }

  // ── NEW: Podcast (Metrolist: YouTube.kt → podcast()) ──
  async podcast(browseId) {
    const response = await this._client.request(
      "browse",
      { browseId },
      { login: false }
    );
    return parsePodcastPage(response, browseId);
  }

  async podcastContinuation(token) {
    const response = await this._client.request(
      "browse",
      { continuation: token },
      { login: false }
    );
    const episodes = [];
    walk(response, (node) => {
      if (node.musicMultiRowListItemRenderer) {
        const ep = parseEpisodeFromMultiRow(node.musicMultiRowListItemRenderer, null);
        if (ep) episodes.push(ep);
      }
      if (node.musicResponsiveListItemRenderer) {
        const ep = parseEpisodeFromResponsive(node.musicResponsiveListItemRenderer, null);
        if (ep) episodes.push(ep);
      }
    });
    let nextToken = null;
    walk(response, (node) => {
      if (nextToken) return;
      const t = node.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
      if (t) nextToken = t;
    });
    return { episodes, continuation: nextToken };
  }

  // ── NEW: Playlist CRUD (Metrolist: YouTube.kt → edit_playlist) ──
  async removeFromPlaylist(playlistId, videoId, setVideoId) {
    return this._client.request("browse/edit_playlist", {
      playlistId: String(playlistId || "").replace(/^VL/, ""),
      actions: [{ action: "ACTION_REMOVE_VIDEO", removedVideoId: videoId, setVideoId }]
    }, { login: true });
  }

  async renamePlaylist(playlistId, name) {
    return this._client.request("browse/edit_playlist", {
      playlistId: String(playlistId || "").replace(/^VL/, ""),
      actions: [{ action: "ACTION_SET_PLAYLIST_NAME", playlistName: name }]
    }, { login: true });
  }

  async deletePlaylist(playlistId) {
    return this._client.request("playlist/delete", {
      playlistId: String(playlistId || "").replace(/^VL/, "")
    }, { login: true });
  }

  async moveSongInPlaylist(playlistId, setVideoId, successorSetVideoId) {
    const normalizedPlaylistId = String(playlistId || "").trim();
    const normalizedSetVideoId = String(setVideoId || "").trim();
    const normalizedSuccessorId = String(successorSetVideoId || "").trim();
    if (!normalizedPlaylistId) throw new Error("Cannot move a song without a playlist id.");
    if (!normalizedSetVideoId) throw new Error("Cannot move a song without its playlist item id.");
    if (normalizedSuccessorId && normalizedSuccessorId === normalizedSetVideoId) {
      throw new Error("Cannot move a playlist item before itself.");
    }
    const action = {
      action: "ACTION_MOVE_VIDEO_BEFORE",
      setVideoId: normalizedSetVideoId
    };
    if (normalizedSuccessorId) {
      action.movedSetVideoIdSuccessor = normalizedSuccessorId;
    }
    const playlistIds = normalizedPlaylistId.startsWith("VL")
      ? [normalizedPlaylistId, normalizedPlaylistId.slice(2)]
      : [`VL${normalizedPlaylistId}`, normalizedPlaylistId];
    let firstError = null;
    for (const candidatePlaylistId of [...new Set(playlistIds.filter(Boolean))]) {
      try {
        return await this._client.request("browse/edit_playlist", {
          playlistId: candidatePlaylistId,
          actions: [action]
        }, { login: true });
      } catch (error) {
        if (!firstError) firstError = error;
        if (!/400|invalid argument|badRequest/i.test(String(error?.message || error))) throw error;
      }
    }
    throw firstError || new Error("YouTube Music rejected the playlist move request.");
  }

  // ── NEW: Search Suggestions (Metrolist: YouTube.kt → searchSuggestions()) ──
  async searchSuggestions(query) {
    const response = await this._client.request("music/get_search_suggestions", { input: query }, { login: false });
    const suggestions = [];
    const contents = response?.contents || [];
    for (const section of contents) {
      const items = section?.searchSuggestionsSectionRenderer?.contents || [];
      for (const item of items) {
        const text = textFromRuns(item.searchSuggestionRenderer?.suggestion?.runs);
        if (text) suggestions.push(text);
      }
    }
    return suggestions;
  }

  // ── NEW: Get Transcript (Metrolist: InnerTube.kt → getTranscript()) ──
  async getTranscript(videoId) {
    // Message: { 1: { 1: videoId } }  → 0x0a (field1 LEN) + len + 0x0a (field1 LEN) + len + bytes
    const cleanVideoId = String(videoId || "").trim();
    if (!cleanVideoId) throw new Error("Cannot get transcript without a video id.");
    const errors = [];
    const requestTranscript = async (params, options = {}) => this._client.request(
      `https://music.youtube.com/youtubei/v1/get_transcript?key=${TRANSCRIPT_API_KEY}&prettyPrint=false`,
      { params },
      {
        client: options.client || WEB,
        login: Boolean(options.login)
      }
    );

    const attempts = [
      { label: "direct", params: directTranscriptParams(cleanVideoId), client: WEB, login: false }
    ];
    const lyricsBrowseIds = [];

    try {
      const next = await this._client.request("next", { videoId: cleanVideoId }, { client: WEB_REMIX, login: true });
      for (const params of transcriptParamsFromNextResponse(next)) {
        attempts.push({ label: "watch-next", params, client: WEB_REMIX, login: true });
        attempts.push({ label: "watch-next-web", params, client: WEB, login: false });
      }
      lyricsBrowseIds.push(...lyricsBrowseIdsFromNextResponse(next));
    } catch (error) {
      errors.push(`next: ${error?.message || String(error)}`);
    }

    attempts.push({ label: "legacy-flat", params: legacyFlatTranscriptParams(cleanVideoId), client: WEB, login: false });

    const seen = new Set();
    for (const attempt of attempts) {
      const key = `${attempt.label}:${attempt.params}:${attempt.client?.clientName}:${attempt.login ? "1" : "0"}`;
      if (!attempt.params || seen.has(key)) continue;
      seen.add(key);
      try {
        return await requestTranscript(attempt.params, attempt);
      } catch (error) {
        errors.push(`${attempt.label}: ${error?.message || String(error)}`);
      }
    }

    for (const browseId of [...new Set(lyricsBrowseIds)]) {
      try {
        return await this._client.request("browse", { browseId }, { client: WEB_REMIX, login: true });
      } catch (error) {
        errors.push(`lyrics-tab: ${error?.message || String(error)}`);
      }
      try {
        return await this._client.request("browse", { browseId }, { client: WEB, login: false });
      } catch (error) {
        errors.push(`lyrics-tab-web: ${error?.message || String(error)}`);
      }
    }

    throw new Error(errors[errors.length - 1] || "Transcript is not available for this song.");
  }
}

module.exports = { YouTube, parseCookieString };
