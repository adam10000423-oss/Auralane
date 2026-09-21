const crypto = require("node:crypto");
const models = require("./models");

const ORIGIN = "https://music.youtube.com";
const API_URL = `${ORIGIN}/youtubei/v1`;
const REFERER = `${ORIGIN}/`;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0";

const WEB_REMIX = {
  clientName: "WEB_REMIX",
  clientVersion: "1.20260213.01.00",
  clientId: "67",
  userAgent: USER_AGENT,
  loginSupported: true,
  useWebPoTokens: true
};

const WEB_CREATOR = {
  clientName: "WEB_CREATOR",
  clientVersion: "1.20260213.00.00",
  clientId: "62",
  userAgent: USER_AGENT,
  loginSupported: true
};

// Keep this anonymous playback set aligned with Metrolist's
// ContentAwareFallbackStrategy. These device clients can return direct media
// URLs without relying on an authenticated YouTube Music web session.
const VISIONOS = {
  clientName: "VISIONOS",
  clientVersion: "0.1",
  clientId: "101",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  osName: "visionOS",
  osVersion: "1.3.21O771",
  deviceMake: "Apple",
  deviceModel: "RealityDevice14,1",
  loginSupported: false
};

const ANDROID_VR_165 = {
  clientName: "ANDROID_VR",
  clientVersion: "1.65.10",
  clientId: "28",
  userAgent: "com.google.android.apps.youtube.vr.oculus/1.65.10 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip",
  osName: "Android",
  osVersion: "12L",
  deviceMake: "Oculus",
  deviceModel: "Quest 3",
  androidSdkVersion: "32",
  loginSupported: false,
  includeUserAgentInContext: true
};

const ANDROID_VR_143 = {
  clientName: "ANDROID_VR",
  clientVersion: "1.43.32",
  clientId: "28",
  userAgent: "com.google.android.apps.youtube.vr.oculus/1.43.32 (Linux; U; Android 12; en_US; Quest 3; Build/SQ3A.220605.009.A1; Cronet/107.0.5284.2)",
  osName: "Android",
  osVersion: "12",
  deviceMake: "Oculus",
  deviceModel: "Quest 3",
  androidSdkVersion: "32",
  loginSupported: false,
  includeUserAgentInContext: true
};

const ANDROID_VR_161 = {
  clientName: "ANDROID_VR",
  clientVersion: "1.61.48",
  clientId: "28",
  userAgent: "com.google.android.apps.youtube.vr.oculus/1.61.48 (Linux; U; Android 12; en_US; Quest 3; Build/SQ3A.220605.009.A1; Cronet/132.0.6808.3)",
  osName: "Android",
  osVersion: "12",
  deviceMake: "Oculus",
  deviceModel: "Quest 3",
  androidSdkVersion: "32",
  loginSupported: false,
  includeUserAgentInContext: true
};

const TVHTML5 = {
  clientName: "TVHTML5",
  clientVersion: "7.20260114.12.00",
  clientId: "7",
  userAgent: "Mozilla/5.0 (ChromiumStylePlatform) Cobalt/25.lts.30.1034943-gold (unlike Gecko), Unknown_TV_Unknown_0/Unknown (Unknown, Unknown)",
  loginSupported: true,
  includeUserAgentInContext: true,
  useWebPoTokens: true
};

const ANDROID_CREATOR = {
  clientName: "ANDROID_CREATOR",
  clientVersion: "25.03.101",
  clientId: "14",
  userAgent: "com.google.android.apps.youtube.creator/25.03.101 (Linux; U; Android 15; en_US; Pixel 9 Pro Fold; Build/AP3A.241005.015.A2; Cronet/132.0.6779.0)",
  osName: "Android",
  osVersion: "15",
  deviceMake: "Google",
  deviceModel: "Pixel 9 Pro Fold",
  androidSdkVersion: "35",
  loginSupported: true
};

const STREAM_CLIENTS = [
  { client: VISIONOS, login: false },
  { client: ANDROID_VR_165, login: false },
  { client: ANDROID_VR_143, login: false },
  { client: WEB_REMIX, login: true },
  { client: TVHTML5, login: true },
  { client: ANDROID_VR_161, login: false },
  { client: WEB_CREATOR, login: true },
  { client: ANDROID_CREATOR, login: true }
];

function systemYouTubeLocale() {
  const language = Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
  const parts = language.split("-");
  const region = [...parts].reverse().find((part) => /^[A-Z]{2}$/.test(part));
  return {
    gl: region || "US",
    hl: language
  };
}

const LIBRARY_ADD_ICONS = new Set(["LIBRARY_ADD", "BOOKMARK_BORDER"]);
const LIBRARY_SAVED_ICONS = new Set(["LIBRARY_SAVED", "BOOKMARK", "LIBRARY_REMOVE"]);
const SEARCH_FILTERS = {
  top: null,
  songs: "EgWKAQIIAWoKEAkQBRAKEAMQBA%3D%3D",
  videos: "EgWKAQIQAWoKEAkQChAFEAMQBA%3D%3D",
  albums: "EgWKAQIYAWoKEAkQChAFEAMQBA%3D%3D",
  artists: "EgWKAQIgAWoKEAkQChAFEAMQBA%3D%3D",
  playlists: "EgeKAQQoAEABagoQAxAEEAoQCRAF",
  featuredPlaylists: "EgeKAQQoADgBagwQDhAKEAMQBRAJEAQ%3D",
  podcasts: "EgWKAQJQAWoKEAkQChAFEAMQBA%3D%3D",
  episodes: "EgWKAQJYAWoKEAkQChAFEAMQBA%3D%3D"
};
const LIBRARY_SOURCES = {
  landing: {
    kind: "landing",
    label: "Library landing",
    browseId: "FEmusic_library_landing"
  },
  songs: {
    kind: "songs",
    label: "Liked songs",
    browseId: "FEmusic_liked_videos"
  },
  playlists: {
    kind: "playlists",
    label: "Saved playlists",
    browseId: "FEmusic_liked_playlists"
  },
  albums: {
    kind: "albums",
    label: "Liked albums",
    browseId: "FEmusic_liked_albums"
  },
  artists: {
    kind: "artists",
    label: "Subscribed artists",
    browseId: "FEmusic_library_corpus_artists"
  },
  recentActivity: {
    kind: "recentActivity",
    label: "Recent activity",
    continuation: "4qmFsgIrEhdGRW11c2ljX2xpYnJhcnlfbGFuZGluZxoQZ2dNR0tnUUlCaEFCb0FZQg%3D%3D"
  }
};

function parseCookieString(cookie) {
  return Object.fromEntries(
    String(cookie || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return index === -1 ? [part, ""] : [part.slice(0, index), part.slice(index + 1)];
      })
  );
}

function authCookieValue(cookie) {
  const parsed = parseCookieString(cookie);
  return parsed.SAPISID || parsed["__Secure-3PAPISID"] || parsed["__Secure-1PAPISID"] || parsed.APISID || "";
}

function sha1(value) {
  return crypto.createHash("sha1").update(value).digest("hex");
}

function textFromRuns(runs) {
  return (runs || []).map((run) => run.text || "").join("").trim();
}

function textFromObject(value) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (value.simpleText) return String(value.simpleText).trim();
  if (value.runs) return textFromRuns(value.runs);
  return "";
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
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visitor);
    return;
  }
  for (const item of Object.values(value)) walk(item, visitor);
}

function dedupeTracks(items) {
  const seen = new Set();
  const tracks = [];
  for (const item of items) {
    if (!item?.id || seen.has(item.id)) continue;
    seen.add(item.id);
    tracks.push(item);
  }
  return tracks;
}

function dedupeBrowseItems(items) {
  const seen = new Set();
  return (items || []).filter((item) => {
    const key = `${item.browseId || item.id}:${item.params || ""}`;
    if (!item?.browseId || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeMixedItems(items) {
  const seen = new Set();
  return (items || []).filter((item) => {
    const id = item?.browseId || item?.id;
    if (!id) return false;
    const key = `${id}:${item?.params || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function durationFromText(value) {
  const match = String(value || "").match(/\b\d{1,2}:\d{2}(?::\d{2})?\b/);
  return match ? match[0] : "";
}

function yearFromText(value) {
  const match = String(value || "").match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : "";
}

function pageTypeFromBrowseEndpoint(endpoint) {
  return endpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType || "";
}

function artistLinksFromRuns(runs) {
  const items = [];
  for (const run of runs || []) {
    const endpoint = run.navigationEndpoint?.browseEndpoint;
    const browseId = endpoint?.browseId;
    const isArtist = typeFromBrowseId(browseId) === "artist" || pageTypeFromBrowseEndpoint(endpoint) === "MUSIC_PAGE_TYPE_ARTIST";
    if (!browseId || !isArtist || !String(run.text || "").trim()) continue;
    items.push({
      id: browseId,
      browseId,
      params: endpoint.params || null,
      type: "artist",
      title: String(run.text).trim(),
      subtitle: "Artist",
      thumbnail: ""
    });
  }
  return dedupeBrowseItems(items);
}

function artistLabel(artists = [], fallback = "") {
  const names = [];
  for (const artist of artists || []) {
    const name = String(artist?.title || artist?.name || "").trim();
    if (name && !names.includes(name)) names.push(name);
  }
  return names.join(", ") || String(fallback || "").trim();
}

function albumLinkFromRuns(runs) {
  for (const run of runs || []) {
    const endpoint = run.navigationEndpoint?.browseEndpoint;
    const browseId = endpoint?.browseId;
    const isAlbum = typeFromBrowseId(browseId) === "album" || pageTypeFromBrowseEndpoint(endpoint) === "MUSIC_PAGE_TYPE_ALBUM";
    if (!browseId || !isAlbum || !String(run.text || "").trim()) continue;
    return {
      id: browseId,
      browseId,
      params: endpoint.params || null,
      type: "album",
      title: String(run.text).trim(),
      subtitle: "Album",
      thumbnail: ""
    };
  }
  return null;
}

function libraryIconType(iconType) {
  if (!iconType || iconType === "KEEP" || iconType === "KEEP_OFF") return "";
  if (LIBRARY_ADD_ICONS.has(iconType)) return "add";
  if (LIBRARY_SAVED_ICONS.has(iconType) || String(iconType).startsWith("LIBRARY_")) return "saved";
  return "";
}

function extractLibraryTokens(menuItems) {
  let addToken = null;
  let removeToken = null;
  let currentState = "";
  for (const item of menuItems || []) {
    const renderer = item.toggleMenuServiceItemRenderer;
    if (!renderer) continue;
    const iconState = libraryIconType(renderer.defaultIcon?.iconType);
    if (!iconState) continue;
    if (!currentState) currentState = iconState;

    const defaultToken = renderer.defaultServiceEndpoint?.feedbackEndpoint?.feedbackToken || null;
    const toggledToken = renderer.toggledServiceEndpoint?.feedbackEndpoint?.feedbackToken || null;
    if (iconState === "add") {
      if (!addToken) addToken = defaultToken;
      if (!removeToken) removeToken = toggledToken;
    } else {
      if (!removeToken) removeToken = defaultToken;
      if (!addToken) addToken = toggledToken;
    }
  }
  return {
    libraryAddToken: addToken,
    libraryRemoveToken: removeToken,
    inLibrary: currentState === "saved"
  };
}

function extractToggleButtonTokens(buttons) {
  for (const button of buttons || []) {
    const renderer = button.toggleButtonRenderer;
    if (!renderer) continue;
    const defaultToken = renderer.defaultServiceEndpoint?.feedbackEndpoint?.feedbackToken || null;
    const toggledToken = renderer.toggledServiceEndpoint?.feedbackEndpoint?.feedbackToken || null;
    const defaultIcon = renderer.defaultIcon?.iconType;
    const toggledIcon = renderer.toggledIcon?.iconType;
    const defaultState = libraryIconType(defaultIcon);
    const toggledState = libraryIconType(toggledIcon);
    if (!defaultToken && !toggledToken) continue;
    if (defaultState === "add" || toggledState === "saved") {
      return {
        libraryAddToken: defaultToken,
        libraryRemoveToken: toggledToken,
        inLibrary: false
      };
    }
    if (defaultState === "saved" || toggledState === "add") {
      return {
        libraryAddToken: toggledToken,
        libraryRemoveToken: defaultToken,
        inLibrary: true
      };
    }
  }
  return {
    libraryAddToken: null,
    libraryRemoveToken: null,
    inLibrary: false
  };
}

function mergeLibraryTokens(...states) {
  const merged = {
    libraryAddToken: null,
    libraryRemoveToken: null,
    inLibrary: false
  };
  for (const state of states) {
    if (!state) continue;
    if (!merged.libraryAddToken && state.libraryAddToken) merged.libraryAddToken = state.libraryAddToken;
    if (!merged.libraryRemoveToken && state.libraryRemoveToken) merged.libraryRemoveToken = state.libraryRemoveToken;
    if (state.inLibrary) merged.inLibrary = true;
  }
  return merged;
}

function watchEndpointInfo(endpoint) {
  const watch = endpoint?.watchEndpoint || endpoint?.watchPlaylistEndpoint || endpoint;
  if (!watch?.videoId && !watch?.playlistId) return null;
  return {
    videoId: watch.videoId || null,
    playlistId: watch.playlistId || null,
    params: watch.params || null,
    index: Number.isFinite(Number(watch.index)) ? Number(watch.index) : null,
    playlistSetVideoId: watch.playlistSetVideoId || null
  };
}

function subscribeInfoFromRenderer(renderer) {
  const button =
    renderer?.subscriptionButton?.subscribeButtonRenderer ||
    renderer?.subscriptionButton2?.subscribeButtonRenderer ||
    null;
  if (!button) {
    return {
      channelId: null,
      subscribed: false,
      subscriberCount: "",
      subscribeParams: "EgIIAhgA"
    };
  }
  return {
    channelId: button.channelId || null,
    subscribed: button.subscribed === true,
    subscriberCount:
      textFromObject(button.subscriberCountWithSubscribeText) ||
      textFromObject(button.longSubscriberCountText) ||
      textFromObject(button.shortSubscriberCountText),
    subscribeParams:
      button.serviceEndpoint?.subscribeEndpoint?.params ||
      button.defaultServiceEndpoint?.subscribeEndpoint?.params ||
      "EgIIAhgA"
  };
}

function extractSubscribeInfo(response) {
  let info = null;
  walk(response, (node) => {
    if (info?.channelId) return;
    const renderer = node.subscribeButtonRenderer;
    if (!renderer) return;
    info = {
      channelId: renderer.channelId || null,
      subscribed: renderer.subscribed === true,
      subscriberCount:
        textFromObject(renderer.subscriberCountWithSubscribeText) ||
        textFromObject(renderer.longSubscriberCountText) ||
        textFromObject(renderer.shortSubscriberCountText),
      subscribeParams:
        renderer.serviceEndpoint?.subscribeEndpoint?.params ||
        renderer.defaultServiceEndpoint?.subscribeEndpoint?.params ||
        "EgIIAhgA"
    };
  });
  return info || {
    channelId: null,
    subscribed: false,
    subscriberCount: "",
    subscribeParams: "EgIIAhgA"
  };
}

function extractArtistWatchInfo(response) {
  let radioEndpoint = null;
  let shuffleEndpoint = null;
  walk(response, (node) => {
    if (!radioEndpoint && node.startRadioButton?.buttonRenderer) {
      radioEndpoint = watchEndpointInfo(node.startRadioButton.buttonRenderer.navigationEndpoint);
    }
    if (!shuffleEndpoint && node.playButton?.buttonRenderer) {
      shuffleEndpoint = watchEndpointInfo(node.playButton.buttonRenderer.navigationEndpoint);
    }
  });
  return { radioEndpoint, shuffleEndpoint };
}

function trackFromRenderer(renderer) {
  if (!renderer) return null;

  const overlayEndpoint =
    renderer.overlay?.musicItemThumbnailOverlayRenderer?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint;
  const endpoint = renderer.flexColumns
    ?.flatMap((column) => column.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [])
    ?.map((run) => run.navigationEndpoint?.watchEndpoint)
    ?.find((item) => item?.videoId);
  const watchEndpoint = overlayEndpoint || endpoint || renderer.navigationEndpoint?.watchEndpoint;
  const menuVideoId =
    renderer.menu?.menuRenderer?.items
      ?.map((item) => item.menuServiceItemRenderer?.serviceEndpoint?.playlistEditEndpoint?.actions?.[0]?.addedVideoId)
      ?.find(Boolean);
  const videoId = watchEndpoint?.videoId || renderer.playlistItemData?.videoId || menuVideoId;
  if (!videoId) return null;

  const columns = renderer.flexColumns || [];
  const allRuns = columns.flatMap((column) => column.musicResponsiveListItemFlexColumnRenderer?.text?.runs || []);
  const title = textFromRuns(columns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs) || "Untitled";
  const subtitleRuns = columns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
  const artists = artistLinksFromRuns(subtitleRuns);
  const subtitle = textFromRuns(subtitleRuns) || "YouTube Music";
  const fixedDuration = textFromRuns(renderer.fixedColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs);
  const thumbnails =
    renderer.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
    renderer.thumbnail?.thumbnails ||
    [];
  const libraryTokens = extractLibraryTokens(renderer.menu?.menuRenderer?.items);
  const album = albumLinkFromRuns(allRuns);

  return {
    kind: "track",
    type: "track",
    id: videoId,
    videoId,
    title,
    subtitle,
    thumbnail: firstThumbnail(thumbnails),
    duration: durationFromText(fixedDuration) || durationFromText(subtitle),
    artist: artistLabel(artists),
    artists,
    album,
    playlistId: watchEndpoint?.playlistId || null,
    params: watchEndpoint?.params || null,
    index: Number.isFinite(Number(watchEndpoint?.index)) ? Number(watchEndpoint.index) : null,
    setVideoId: renderer.playlistItemData?.playlistSetVideoId || watchEndpoint?.playlistSetVideoId || null,
    ...libraryTokens
  };
}

function trackFromTwoRowRenderer(renderer) {
  if (!renderer) return null;
  const watchEndpoint =
    renderer.thumbnailOverlay?.musicItemThumbnailOverlayRenderer?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint ||
    renderer.navigationEndpoint?.watchEndpoint;
  const videoId = watchEndpoint?.videoId;
  if (!videoId) return null;

  const thumbnails =
    renderer.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
    renderer.thumbnail?.thumbnails ||
    [];
  const subtitleRuns = renderer.subtitle?.runs || [];
  const artists = artistLinksFromRuns(subtitleRuns);
  const libraryTokens = extractLibraryTokens(renderer.menu?.menuRenderer?.items);
  const album = albumLinkFromRuns(subtitleRuns);

  return {
    kind: "track",
    type: "track",
    id: videoId,
    videoId,
    title: textFromRuns(renderer.title?.runs) || "Untitled",
    subtitle: textFromRuns(subtitleRuns) || "YouTube Music",
    thumbnail: firstThumbnail(thumbnails),
    duration: durationFromText(textFromRuns(subtitleRuns)),
    artist: artistLabel(artists),
    artists,
    album,
    playlistId: watchEndpoint?.playlistId || null,
    params: watchEndpoint?.params || null,
    index: Number.isFinite(Number(watchEndpoint?.index)) ? Number(watchEndpoint.index) : null,
    setVideoId: watchEndpoint?.playlistSetVideoId || null,
    ...libraryTokens
  };
}

function trackFromMultiRowRenderer(renderer) {
  if (!renderer) return null;
  const watchEndpoint =
    renderer.overlay?.musicItemThumbnailOverlayRenderer?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint ||
    renderer.onTap?.watchEndpoint;
  const videoId = watchEndpoint?.videoId;
  if (!videoId) return null;

  const thumbnails =
    renderer.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
    renderer.thumbnail?.thumbnails ||
    [];
  const subtitleParts = [
    textFromObject(renderer.secondTitle),
    textFromObject(renderer.subtitle)
  ].filter(Boolean);
  const artists = artistLinksFromRuns(renderer.secondTitle?.runs || renderer.subtitle?.runs || []);
  const libraryTokens = extractLibraryTokens(renderer.menu?.menuRenderer?.items);
  const album = albumLinkFromRuns(renderer.secondTitle?.runs || renderer.subtitle?.runs || []);

  return {
    kind: "track",
    type: "track",
    id: videoId,
    videoId,
    title: textFromObject(renderer.title) || "Untitled",
    subtitle: subtitleParts.join(" - ") || "YouTube Music",
    thumbnail: firstThumbnail(thumbnails),
    duration: durationFromText(subtitleParts.join(" - ")),
    artist: artistLabel(artists),
    artists,
    album,
    playlistId: watchEndpoint?.playlistId || null,
    params: watchEndpoint?.params || null,
    index: Number.isFinite(Number(watchEndpoint?.index)) ? Number(watchEndpoint.index) : null,
    setVideoId: watchEndpoint?.playlistSetVideoId || null,
    ...libraryTokens
  };
}

function trackFromPlaylistPanelRenderer(renderer) {
  if (!renderer?.videoId) return null;
  const watchEndpoint = renderer.navigationEndpoint?.watchEndpoint || renderer.navigationEndpoint?.watchPlaylistEndpoint || {};
  const subtitleRuns = renderer.longBylineText?.runs || renderer.shortBylineText?.runs || [];
  const subtitle = textFromRuns(subtitleRuns) || "YouTube Music";
  const artists = artistLinksFromRuns(subtitleRuns);
  const album = albumLinkFromRuns(subtitleRuns);
  const thumbnails =
    renderer.thumbnail?.thumbnails ||
    renderer.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
    [];
  const libraryTokens = extractLibraryTokens(renderer.menu?.menuRenderer?.items);

  return {
    kind: "track",
    type: "track",
    id: renderer.videoId,
    videoId: renderer.videoId,
    title: textFromRuns(renderer.title?.runs) || "Untitled",
    subtitle,
    thumbnail: firstThumbnail(thumbnails),
    duration: durationFromText(textFromRuns(renderer.lengthText?.runs)),
    artist: artistLabel(artists),
    artists,
    album,
    playlistId: watchEndpoint?.playlistId || null,
    params: watchEndpoint?.params || null,
    index: Number.isFinite(Number(watchEndpoint?.index)) ? Number(watchEndpoint.index) : null,
    setVideoId: watchEndpoint?.playlistSetVideoId || renderer.playlistSetVideoId || null,
    selected: renderer.selected === true,
    ...libraryTokens
  };
}

function typeFromBrowseId(browseId) {
  if (String(browseId || "").startsWith("VL")) return "playlist";
  if (String(browseId || "").startsWith("MPRE")) return "album";
  if (String(browseId || "").startsWith("UC")) return "artist";
  return "browse";
}

function typeFromBrowseEndpoint(endpoint) {
  const browseId = endpoint?.browseId;
  const pageType = pageTypeFromBrowseEndpoint(endpoint);
  if (pageType === "MUSIC_PAGE_TYPE_ALBUM") return "album";
  if (pageType === "MUSIC_PAGE_TYPE_ARTIST" || pageType === "MUSIC_PAGE_TYPE_USER_CHANNEL") return "artist";
  if (pageType === "MUSIC_PAGE_TYPE_PLAYLIST") return "playlist";
  if (pageType.includes("PODCAST")) return "podcast";
  return typeFromBrowseId(browseId);
}

function playlistFromRenderer(renderer) {
  if (!renderer) return null;
  const endpoint = renderer.navigationEndpoint?.browseEndpoint;
  const browseId = endpoint?.browseId;
  if (!browseId) return null;
  const title = textFromRuns(renderer.title?.runs) || "Untitled playlist";
  const subtitle = textFromRuns(renderer.subtitle?.runs) || "";
  const thumbnails = renderer.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails || renderer.thumbnail?.thumbnails || [];
  const type = typeFromBrowseEndpoint(endpoint);
  return {
    kind: type,
    id: browseId.replace(/^VL/, ""),
    browseId,
    params: endpoint.params || null,
    type,
    title,
    subtitle,
    thumbnail: firstThumbnail(thumbnails),
    year: yearFromText(subtitle)
  };
}

function browseItemFromNavigationButton(renderer) {
  if (!renderer) return null;
  const endpoint = renderer.clickCommand?.browseEndpoint || renderer.navigationEndpoint?.browseEndpoint;
  const browseId = endpoint?.browseId;
  if (!browseId) return null;
  return {
    kind: typeFromBrowseEndpoint(endpoint),
    id: browseId,
    browseId,
    params: endpoint.params || null,
    type: typeFromBrowseEndpoint(endpoint),
    title: textFromRuns(renderer.buttonText?.runs) || textFromRuns(renderer.text?.runs) || "Browse",
    subtitle: "YouTube Music",
    thumbnail: ""
  };
}

function browseItemFromCardShelf(renderer) {
  if (!renderer) return null;
  const titleRuns = renderer.title?.runs || renderer.header?.musicCardShelfHeaderBasicRenderer?.title?.runs || [];
  const titleRun = titleRuns.find((run) => run?.navigationEndpoint?.browseEndpoint) || titleRuns[0] || {};
  const endpoint =
    titleRun.navigationEndpoint?.browseEndpoint ||
    renderer.navigationEndpoint?.browseEndpoint ||
    renderer.onTap?.browseEndpoint;
  const browseId = endpoint?.browseId;
  if (!browseId) return null;
  const subtitleRuns = renderer.subtitle?.runs || [];
  const thumbnails =
    renderer.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
    renderer.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
    renderer.thumbnail?.thumbnails ||
    [];
  const type = typeFromBrowseEndpoint(endpoint);
  return {
    kind: type,
    id: type === "playlist" ? browseId.replace(/^VL/, "") : browseId,
    browseId,
    params: endpoint.params || null,
    type,
    title: textFromRuns(titleRuns) || "Browse",
    subtitle: textFromRuns(subtitleRuns) || (type === "artist" ? "Artist" : "YouTube Music"),
    thumbnail: firstThumbnail(thumbnails)
  };
}

function extractTracks(response) {
  const items = [];
  walk(response, (node) => {
    const renderer = node.musicResponsiveListItemRenderer;
    if (renderer) {
      const track = trackFromRenderer(renderer);
      if (track) items.push(track);
    }
    const twoRowRenderer = node.musicTwoRowItemRenderer;
    if (twoRowRenderer) {
      const track = trackFromTwoRowRenderer(twoRowRenderer);
      if (track) items.push(track);
    }
    const multiRowRenderer = node.musicMultiRowListItemRenderer;
    if (multiRowRenderer) {
      const track = trackFromMultiRowRenderer(multiRowRenderer);
      if (track) items.push(track);
    }
    const panelRenderer = node.playlistPanelVideoRenderer;
    if (panelRenderer) {
      const track = trackFromPlaylistPanelRenderer(panelRenderer);
      if (track) items.push(track);
    }
  });
  return dedupeTracks(items);
}

function extractSelectedQueueIndex(response) {
  const tracks = [];
  walk(response, (node) => {
    if (node.playlistPanelVideoRenderer) {
      tracks.push(node.playlistPanelVideoRenderer);
    }
  });
  const index = tracks.findIndex((item) => item.selected === true);
  return index >= 0 ? index : null;
}

function extractAutomixEndpoint(response) {
  let endpoint = null;
  walk(response, (node) => {
    if (endpoint) return;
    const candidate =
      node.automixPreviewVideoRenderer?.content?.automixPlaylistVideoRenderer?.navigationEndpoint?.watchPlaylistEndpoint ||
      node.automixPreviewVideoRenderer?.content?.automixPlaylistVideoRenderer?.navigationEndpoint?.watchEndpoint;
    if (candidate?.videoId || candidate?.playlistId) endpoint = watchEndpointInfo(candidate);
  });
  return endpoint;
}

function extractWatchTabBrowseEndpoint(response, index) {
  const tabs =
    response?.contents?.singleColumnMusicWatchNextResultsRenderer
      ?.tabbedRenderer?.watchNextTabbedResultsRenderer?.tabs ||
    [];
  const endpoint = tabs[index]?.tabRenderer?.endpoint?.browseEndpoint;
  if (!endpoint?.browseId) return null;
  return {
    browseId: endpoint.browseId,
    params: endpoint.params || null
  };
}

function extractPlaylists(response) {
  const items = [];
  walk(response, (node) => {
    const renderer = node.musicTwoRowItemRenderer;
    if (renderer) {
      const playlist = playlistFromRenderer(renderer);
      if (playlist) items.push(playlist);
    }
  });
  return dedupeBrowseItems(items);
}

function extractBrowseItems(response) {
  const items = [];
  walk(response, (node) => {
    const twoRowRenderer = node.musicTwoRowItemRenderer;
    if (twoRowRenderer) {
      const item = playlistFromRenderer(twoRowRenderer);
      if (item) items.push(item);
    }

    const buttonRenderer = node.musicNavigationButtonRenderer;
    if (buttonRenderer) {
      const item = browseItemFromNavigationButton(buttonRenderer);
      if (item) items.push(item);
    }

    const cardRenderer = node.musicCardShelfRenderer;
    if (cardRenderer) {
      const item = browseItemFromCardShelf(cardRenderer);
      if (item) items.push(item);
    }
  });

  return dedupeBrowseItems(items);
}

function chipFromRenderer(renderer) {
  if (!renderer) return null;
  const endpoint = renderer.navigationEndpoint?.browseEndpoint || renderer.endpoint?.browseEndpoint;
  const title = textFromObject(renderer.text) || textFromObject(renderer.title);
  if (!title) return null;
  return {
    title,
    browseId: endpoint?.browseId || "FEmusic_home",
    params: endpoint?.params || null,
    selected: Boolean(renderer.isSelected)
  };
}

function headerBrowseEndpoint(header) {
  return (
    header?.moreContentButton?.buttonRenderer?.navigationEndpoint?.browseEndpoint ||
    header?.title?.runs?.map((run) => run.navigationEndpoint?.browseEndpoint).find(Boolean) ||
    null
  );
}

function sectionFromCarousel(renderer) {
  if (!renderer) return null;
  const header = renderer.header?.musicCarouselShelfBasicHeaderRenderer || {};
  const title = textFromObject(header.title) || "Recommended";
  const subtitle = textFromObject(header.strapline) || textFromObject(header.subtitle);
  const endpoint = headerBrowseEndpoint(header);
  const tracks = [];
  const items = [];

  for (const content of renderer.contents || []) {
    const responsive = content.musicResponsiveListItemRenderer;
    if (responsive) {
      const track = trackFromRenderer(responsive);
      if (track) tracks.push(track);
    }

    const twoRow = content.musicTwoRowItemRenderer;
    if (twoRow) {
      const track = trackFromTwoRowRenderer(twoRow);
      if (track) tracks.push(track);
      const item = playlistFromRenderer(twoRow);
      if (item) items.push(item);
    }

    const multiRow = content.musicMultiRowListItemRenderer;
    if (multiRow) {
      const track = trackFromMultiRowRenderer(multiRow);
      if (track) tracks.push(track);
    }
  }

  const sectionTracks = dedupeTracks(tracks);
  const sectionItems = dedupeBrowseItems(items);
  if (!sectionTracks.length && !sectionItems.length) return null;

  return {
    title,
    subtitle,
    browseId: endpoint?.browseId || null,
    params: endpoint?.params || null,
    tracks: sectionTracks,
    items: sectionItems
  };
}

function sectionFromShelf(renderer) {
  if (!renderer) return null;
  const title = textFromObject(renderer.title) || "Songs";
  const endpoint = renderer.title?.runs
    ?.map((run) => run.navigationEndpoint?.browseEndpoint)
    .find(Boolean) || null;
  const tracks = extractTracks(renderer);
  const items = extractBrowseItems(renderer);
  if (!tracks.length && !items.length) return null;
  return {
    title,
    subtitle: "",
    browseId: endpoint?.browseId || null,
    params: endpoint?.params || null,
    type: "songs",
    tracks,
    items
  };
}

function extractArtistSections(response) {
  const contents = response?.contents
    ?.singleColumnBrowseResultsRenderer
    ?.tabs?.[0]
    ?.tabRenderer
    ?.content
    ?.sectionListRenderer
    ?.contents || [];
  return contents.map((content) => {
    if (content?.musicShelfRenderer) return sectionFromShelf(content.musicShelfRenderer);
    if (content?.musicCarouselShelfRenderer) return sectionFromCarousel(content.musicCarouselShelfRenderer);
    return null;
  }).filter(Boolean);
}

function extractHomeChips(response) {
  const chips = [];
  walk(response, (node) => {
    const renderer = node.chipCloudChipRenderer;
    const chip = chipFromRenderer(renderer);
    if (chip) chips.push(chip);
  });

  const seen = new Set();
  return chips.filter((chip) => {
    const key = `${chip.title}:${chip.params || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractHomeSections(response) {
  const sections = [];
  walk(response, (node) => {
    const renderer = node.musicCarouselShelfRenderer;
    const section = sectionFromCarousel(renderer);
    if (section) sections.push(section);
  });

  const seen = new Set();
  return sections.filter((section) => {
    const firstItem = section.tracks[0]?.id || section.items[0]?.browseId || "";
    const key = `${section.title}:${firstItem}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function artistItemsSection(response) {
  const contents = response?.contents
    ?.singleColumnBrowseResultsRenderer
    ?.tabs?.[0]
    ?.tabRenderer
    ?.content
    ?.sectionListRenderer
    ?.contents || [];
  return contents.find((content) =>
    content?.gridRenderer ||
    content?.musicCarouselShelfRenderer ||
    content?.musicPlaylistShelfRenderer ||
    content?.musicShelfRenderer
  ) || null;
}

function artistItemsPage(response, fallback = {}) {
  const section = artistItemsSection(response);
  const renderer =
    section?.gridRenderer ||
    section?.musicCarouselShelfRenderer ||
    section?.musicPlaylistShelfRenderer ||
    section?.musicShelfRenderer ||
    response;
  const title =
    textFromObject(section?.gridRenderer?.header?.gridHeaderRenderer?.title) ||
    textFromObject(section?.musicCarouselShelfRenderer?.header?.musicCarouselShelfBasicHeaderRenderer?.title) ||
    textFromObject(section?.musicShelfRenderer?.title) ||
    fallback.title ||
    textFromObject(response?.header?.musicHeaderRenderer?.title) ||
    "Artist";
  const header = {
    ...extractPageHeader(response, fallback),
    title
  };
  return models.normalizePageResult({
    header,
    tracks: extractTracks(renderer),
    items: extractBrowseItems(renderer),
    playlists: extractPlaylists(renderer),
    sections: [],
    continuations: extractContinuations(renderer)
  }, fallback);
}

function extractArtistLinks(response) {
  const items = [];
  walk(response, (node) => {
    if (node.text && node.navigationEndpoint?.browseEndpoint) {
      items.push(...artistLinksFromRuns([node]));
    }

    const twoRow = node.musicTwoRowItemRenderer;
    const item = playlistFromRenderer(twoRow);
    if (item?.type === "artist") items.push(item);
  });
  return dedupeBrowseItems(items);
}

function extractArtistHeader(response) {
  let header = null;
  let description = "";

  walk(response, (node) => {
    if (!description && node.musicDescriptionShelfRenderer) {
      description =
        textFromObject(node.musicDescriptionShelfRenderer.description) ||
        textFromObject(node.musicDescriptionShelfRenderer.shelfHeader?.musicDescriptionShelfHeaderRenderer?.description);
    }

    if (header) return;
    const renderer =
      node.musicImmersiveHeaderRenderer ||
      node.musicVisualHeaderRenderer ||
      node.musicHeaderRenderer;
    if (!renderer) return;

    const thumbnails =
      renderer.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
      renderer.thumbnail?.thumbnails ||
      renderer.foregroundThumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
      [];
    const subscribe = subscribeInfoFromRenderer(renderer);
    const monthlyListeners = textFromObject(renderer.monthlyListenerCount);
    header = {
      title: textFromObject(renderer.title) || "Artist",
      subtitle: textFromObject(renderer.subtitle) || textFromObject(renderer.secondSubtitle) || monthlyListeners || "Artist",
      description: textFromObject(renderer.description),
      thumbnail: firstThumbnail(thumbnails),
      background: firstThumbnail(thumbnails),
      channelId: subscribe.channelId,
      subscribed: subscribe.subscribed,
      subscriberCount: subscribe.subscriberCount,
      monthlyListeners,
      subscribeParams: subscribe.subscribeParams,
      shuffleEndpoint: watchEndpointInfo(renderer.playButton?.buttonRenderer?.navigationEndpoint),
      radioEndpoint: watchEndpointInfo(renderer.startRadioButton?.buttonRenderer?.navigationEndpoint)
    };
  });

  if (header) {
    const subscribe = extractSubscribeInfo(response);
    const actions = extractArtistWatchInfo(response);
    if (!header.description) header.description = description;
    header.channelId = header.channelId || subscribe.channelId;
    header.subscribed = header.subscribed || subscribe.subscribed;
    header.subscriberCount = header.subscriberCount || subscribe.subscriberCount;
    header.subscribeParams = header.subscribeParams || subscribe.subscribeParams;
    header.radioEndpoint = header.radioEndpoint || actions.radioEndpoint;
    header.shuffleEndpoint = header.shuffleEndpoint || actions.shuffleEndpoint;
  }
  return header || {
    title: "Artist",
    subtitle: "YouTube Music",
    description,
    thumbnail: "",
    background: ""
  };
}

function extractContinuations(response, endpoint = "browse") {
  const continuations = [];
  walk(response, (node) => {
    const renderer = node.continuationItemRenderer;
    const token =
      renderer?.continuationEndpoint?.continuationCommand?.token ||
      renderer?.continuationEndpoint?.continuationCommand?.continuation ||
      renderer?.button?.buttonRenderer?.command?.continuationCommand?.token ||
      renderer?.button?.buttonRenderer?.command?.continuationCommand?.continuation ||
      node.continuationCommand?.token ||
      node.continuationCommand?.continuation ||
      node.nextContinuationData?.continuation;
    if (!token) return;
    continuations.push({
      token,
      endpoint
    });
  });

  const seen = new Set();
  return continuations.filter((item) => {
    if (seen.has(item.token)) return false;
    seen.add(item.token);
    return true;
  });
}

function extractPlaylistId(response) {
  const canonical = response?.microformat?.microformatDataRenderer?.urlCanonical || "";
  const fromUrl = canonical.includes("=") ? canonical.substring(canonical.lastIndexOf("=") + 1) : "";
  if (fromUrl) return fromUrl.replace(/^VL/, "");

  let playlistId = "";
  walk(response, (node) => {
    if (playlistId) return;
    const endpoint = node.watchPlaylistEndpoint || node.watchEndpoint;
    const candidate = endpoint?.playlistId || endpoint?.playlistSetVideoId;
    if (candidate) playlistId = String(candidate).replace(/^VL/, "");
  });
  return playlistId || "";
}

function extractPlaylistShelfTracks(response) {
  const tracks = [];
  const appendTracks = (contents) => {
    for (const content of contents || []) {
      const renderer = content.musicResponsiveListItemRenderer;
      const track = trackFromRenderer(renderer);
      if (track) tracks.push(track);
    }
  };

  walk(response, (node) => {
    appendTracks(node.musicPlaylistShelfRenderer?.contents);
    appendTracks(node.musicShelfContinuation?.contents);
    appendTracks(node.sectionListContinuation?.contents?.flatMap((content) => content.musicPlaylistShelfRenderer?.contents || []));
    appendTracks(node.appendContinuationItemsAction?.continuationItems);
  });

  return dedupeTracks(tracks);
}

function mergeContinuationResult(base, next) {
  return models.mergePageResults({
    header: base.header,
    tracks: dedupeTracks([...(base.tracks || []), ...(next.tracks || [])]),
    items: dedupeBrowseItems([...(base.items || []), ...(next.items || [])]),
    playlists: dedupeBrowseItems([...(base.playlists || []), ...(next.playlists || [])]),
    sections: [...(base.sections || []), ...(next.sections || [])],
    continuations: next.continuations || []
  });
}

function headerRendererFromNode(node) {
  return (
    node.musicResponsiveHeaderRenderer ||
    node.musicDetailHeaderRenderer ||
    node.musicEditablePlaylistDetailHeaderRenderer ||
    node.musicImmersiveHeaderRenderer ||
    node.musicVisualHeaderRenderer ||
    node.musicHeaderRenderer ||
    null
  );
}

function headerThumbnail(renderer) {
  const thumbnails =
    renderer?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
    renderer?.thumbnail?.thumbnails ||
    renderer?.foregroundThumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
    renderer?.background?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
    renderer?.background?.thumbnails ||
    [];
  return firstThumbnail(thumbnails);
}

function extractPageHeader(response, fallback = {}) {
  let header = null;
  let description = "";

  walk(response, (node) => {
    if (!description && node.musicDescriptionShelfRenderer) {
      description =
        textFromObject(node.musicDescriptionShelfRenderer.description) ||
        textFromObject(node.musicDescriptionShelfRenderer.shelfHeader?.musicDescriptionShelfHeaderRenderer?.description);
    }

    if (header) return;
    const renderer = headerRendererFromNode(node);
    if (!renderer) return;

    const thumbnail = headerThumbnail(renderer);
    const subtitleParts = [
      textFromObject(renderer.subtitle),
      textFromObject(renderer.secondSubtitle),
      textFromObject(renderer.straplineTextOne),
      textFromObject(renderer.straplineTextTwo)
    ].filter(Boolean);
    const libraryTokens = mergeLibraryTokens(
      extractLibraryTokens(renderer.menu?.menuRenderer?.items),
      extractToggleButtonTokens(renderer.buttons),
      extractToggleButtonTokens(renderer.subtitleBadges)
    );

    header = {
      type: fallback.type || typeFromBrowseId(fallback.browseId),
      browseId: fallback.browseId || null,
      title: textFromObject(renderer.title) || fallback.title || "YouTube Music",
      subtitle: subtitleParts.join(" - ") || fallback.subtitle || "YouTube Music",
      description: textFromObject(renderer.description) || fallback.description || "",
      thumbnail: thumbnail || fallback.thumbnail || "",
      background: thumbnail || fallback.thumbnail || "",
      ...libraryTokens
    };
  });

  if (header && !header.description) header.description = description;
  return header || {
    type: fallback.type || typeFromBrowseId(fallback.browseId),
    browseId: fallback.browseId || null,
    title: fallback.title || "YouTube Music",
    subtitle: fallback.subtitle || "YouTube Music",
    description: fallback.description || description,
    thumbnail: fallback.thumbnail || "",
    background: fallback.thumbnail || ""
  };
}

function packageResult(response, fallback = {}) {
  const continuationEndpoint = fallback.continuationEndpoint || fallback.endpoint || "browse";
  return models.normalizePageResult({
    header: extractPageHeader(response, fallback),
    tracks: extractTracks(response),
    items: extractBrowseItems(response),
    playlists: extractPlaylists(response),
    sections: extractHomeSections(response),
    continuations: extractContinuations(response, continuationEndpoint)
  }, fallback);
}

function needsBrowseLogin(browseId, login = false) {
  const value = String(browseId || "");
  return login || value.startsWith("FEmusic_library") || value === "VLSE" || value === "VLRDPN" || value.startsWith("VL");
}

function extractAccountInfo(response) {
  let account = null;
  walk(response, (node) => {
    const renderer = node.activeAccountHeaderRenderer;
    if (!renderer || account) return;
    account = {
      name: textFromRuns(renderer.accountName?.runs) || "Signed in",
      email: textFromRuns(renderer.email?.runs) || "",
      channelHandle: textFromRuns(renderer.channelHandle?.runs) || "",
      thumbnail: firstThumbnail(renderer.accountPhoto?.thumbnails)
    };
  });
  return account;
}

function librarySourceSummary(page, count) {
  return {
    kind: page.source?.kind || "library",
    label: page.source?.label || page.header?.title || "Library",
    browseId: page.source?.browseId || page.header?.browseId || "",
    ok: page.ok !== false,
    error: page.error || null,
    count,
    pagesLoaded: page.pagesLoaded || 0,
    complete: page.complete === true,
    hasMore: Boolean(page.continuations?.length),
    tracks: page.tracks?.length || 0,
    items: (page.items?.length || 0) + (page.playlists?.length || 0)
  };
}

function chooseAudioFormat(response, quality = "auto", options = {}) {
  const excludedItags = new Set((options.excludeItags || []).map(Number).filter(Number.isFinite));
  const formats = response?.streamingData?.adaptiveFormats || [];
  const audio = formats
    .filter((format) => String(format.mimeType || "").startsWith("audio/"))
    .filter((format) => format.url)
    .filter((format) => !excludedItags.has(Number(format.itag)))
    .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
  if (!audio.length) return null;
  if (quality === "data-saver") return audio.at(-1);
  if (quality === "balanced") return audio.find((format) => Number(format.bitrate || 0) <= 160000) || audio[Math.floor(audio.length / 2)];
  return audio[0];
}

function streamingSummary(response) {
  const formats = response?.streamingData?.adaptiveFormats || [];
  const audio = formats.filter((format) => String(format.mimeType || "").startsWith("audio/"));
  return {
    status: response?.playabilityStatus?.status || "UNKNOWN",
    reason: response?.playabilityStatus?.reason || "",
    audioFormats: audio.length,
    directAudioFormats: audio.filter((format) => format.url).length,
    cipherAudioFormats: audio.filter((format) => format.signatureCipher || format.cipher).length
  };
}

class InnerTubeClient {
  constructor(state, options = {}) {
    this.cookie = state.cookie || "";
    this.visitorData = state.visitorData || "";
    this.dataSyncId = state.dataSyncId || "";
    this.locale = state.locale || systemYouTubeLocale();
    this.poTokenProvider = options.poTokenProvider || null;
  }

  setAuth(state) {
    this.cookie = state.cookie || "";
    this.visitorData = state.visitorData || "";
    this.dataSyncId = state.dataSyncId || "";
  }

  context(includeLogin = false, client = WEB_REMIX) {
    return {
      client: {
        clientName: client.clientName,
        clientVersion: client.clientVersion,
        osName: client.osName || undefined,
        osVersion: client.osVersion || undefined,
        deviceMake: client.deviceMake || undefined,
        deviceModel: client.deviceModel || undefined,
        androidSdkVersion: client.androidSdkVersion || undefined,
        userAgent: client.includeUserAgentInContext ? client.userAgent : undefined,
        gl: this.locale.gl,
        hl: this.locale.hl,
        visitorData: this.visitorData || undefined
      },
      user: {
        onBehalfOfUser: includeLogin && client.loginSupported && this.dataSyncId ? this.dataSyncId : undefined
      }
    };
  }

  authHeaders(includeLogin, client = WEB_REMIX) {
    const headers = {
      "Accept": "application/json",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      "Referer": REFERER,
      "Origin": ORIGIN,
      "X-Origin": ORIGIN,
      "User-Agent": client.userAgent || USER_AGENT,
      "X-Goog-Api-Format-Version": "1",
      "X-YouTube-Client-Name": client.clientId,
      "X-YouTube-Client-Version": client.clientVersion
    };

    if (includeLogin && client.loginSupported && this.cookie) {
      headers.Cookie = this.cookie;
      headers["X-Goog-AuthUser"] = "0";
      headers["X-Youtube-Bootstrap-Logged-In"] = "true";
      const sapisid = authCookieValue(this.cookie);
      if (sapisid) {
        const timestamp = Math.floor(Date.now() / 1000);
        headers.Authorization = `SAPISIDHASH ${timestamp}_${sha1(`${timestamp} ${sapisid} ${ORIGIN}`)}`;
      }
    }

    if (this.visitorData) headers["X-Goog-Visitor-Id"] = this.visitorData;
    return headers;
  }

  async request(endpoint, body, options = {}) {
    const includeLogin = Boolean(options.login);
    const client = options.client || WEB_REMIX;
    const url = endpoint.startsWith("http") ? endpoint : `${API_URL}/${endpoint}?prettyPrint=false`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.authHeaders(includeLogin, client),
      body: JSON.stringify({
        context: this.context(includeLogin, client),
        ...body
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`${endpoint} failed (${response.status}): ${text.slice(0, 600)}`);
    }
    return response.json();
  }

  async accountInfo() {
    const response = await this.request("account/account_menu", {}, { login: true });
    return extractAccountInfo(response);
  }

  searchParams(filter = "top") {
    if (!filter) return null;
    if (SEARCH_FILTERS[filter] !== undefined) return SEARCH_FILTERS[filter];
    return String(filter);
  }

  async search(query, filter = "top") {
    const params = this.searchParams(filter);
    const response = await this.request("search", {
      query,
      params: params || undefined
    }, { login: false });
    const tracks = extractTracks(response);
    const items = extractBrowseItems(response);
    const normalizedQuery = String(query || "").trim().toLowerCase();
    const exactArtist = items.find((item) =>
      item.type === "artist" && String(item.title || "").trim().toLowerCase() === normalizedQuery
    );
    if (exactArtist) {
      for (const track of tracks) {
        if (track.artist || track.artists?.length) continue;
        track.artist = exactArtist.title;
        track.artists = [{
          id: exactArtist.browseId,
          browseId: exactArtist.browseId,
          type: "artist",
          title: exactArtist.title,
          subtitle: "Artist",
          thumbnail: exactArtist.thumbnail || ""
        }];
      }
    }
    return models.normalizePageResult({
      header: {
        type: "search",
        title: query || "Search",
        subtitle: filter && filter !== "top" ? `${filter} results` : "Search results"
      },
      tracks,
      items,
      playlists: extractPlaylists(response),
      sections: extractHomeSections(response),
      continuations: extractContinuations(response, "search")
    }, { type: "search", title: query || "Search", endpoint: "search", filter });
  }

  async searchArtists(query) {
    const response = await this.request("search", { query }, { login: false });
    return extractArtistLinks(response);
  }

  async browse(browseId, params = null, login = false) {
    const response = await this.request("browse", { browseId, params: params || undefined }, { login: needsBrowseLogin(browseId, login) });
    return packageResult(response, { browseId, params, type: typeFromBrowseId(browseId) });
  }

  async home(params = null, browseId = "FEmusic_home") {
    const targetBrowseId = browseId || "FEmusic_home";
    const response = await this.request("browse", { browseId: targetBrowseId, params: params || undefined }, { login: true });
    return models.normalizePageResult({
      header: extractPageHeader(response, { browseId: targetBrowseId, type: "home", title: "Home" }),
      chips: extractHomeChips(response),
      sections: extractHomeSections(response),
      tracks: extractTracks(response),
      items: extractBrowseItems(response),
      playlists: extractPlaylists(response),
      continuations: extractContinuations(response)
    }, { browseId: targetBrowseId, type: "home", title: "Home", endpoint: "browse" });
  }

  async explore() {
    return this.browse("FEmusic_explore", null, true);
  }

  async charts() {
    return this.browse("FEmusic_charts", "ggMGCgQIgAQ%3D", true);
  }

  async newReleases() {
    return this.browse("FEmusic_new_releases_albums", null, true);
  }

  async moods() {
    return this.browse("FEmusic_moods_and_genres", null, true);
  }

  async browseContinuation(token, login = true) {
    const response = await this.request("browse", { continuation: token }, { login });
    const result = packageResult(response, { type: "continuation" });
    const playlistTracks = extractPlaylistShelfTracks(response);
    if (playlistTracks.length) result.tracks = playlistTracks;
    return result;
  }

  async collectPlaylistTracks(browseId, login = true, maxPages = Number.POSITIVE_INFINITY, params = null) {
    let response = await this.request("browse", { browseId, params: params || undefined }, { login });
    let tracks = extractPlaylistShelfTracks(response);
    let continuations = extractContinuations(response);
    const seenContinuations = new Set();
    let pageCount = 0;

    while (continuations[0]?.token && pageCount < maxPages) {
      const token = continuations[0].token;
      if (seenContinuations.has(token)) break;
      seenContinuations.add(token);
      pageCount += 1;

      const next = await this.browseContinuation(token, login);
      tracks = dedupeTracks([...tracks, ...(next.tracks || [])]);
      continuations = next.continuations || [];
      if (!(next.tracks || []).length) break;
    }

    return {
      response,
      tracks,
      continuations,
      pagesLoaded: pageCount + 1
    };
  }

  async artist(browseId, params = null) {
    const response = await this.request("browse", { browseId, params: params || undefined }, { login: true });
    const artistSections = extractArtistSections(response);
    const popularSection = artistSections.find((section) => section.type === "songs") || null;
    const remainingSections = artistSections.filter((section) => section !== popularSection);
    return models.normalizePageResult({
      header: {
        ...extractArtistHeader(response),
        popularBrowseId: popularSection?.browseId || null,
        popularParams: popularSection?.params || null,
        popularTitle: popularSection?.title || "Popular songs"
      },
      tracks: popularSection?.tracks || [],
      sections: remainingSections,
      items: extractBrowseItems(response),
      playlists: extractPlaylists(response),
      relatedArtists: extractArtistLinks(response).filter((item) => item.browseId !== browseId),
      continuations: extractContinuations(response)
    }, { browseId, params, type: "artist", endpoint: "browse" });
  }

  async artistItems(browseId, params = null, title = "") {
    const response = await this.request("browse", {
      browseId,
      params: params || undefined
    }, { login: true });
    return artistItemsPage(response, {
      browseId,
      params,
      title,
      type: "artist-items",
      endpoint: "browse"
    });
  }

  async playlist(playlistId) {
    const response = await this.request("browse", { browseId: `VL${playlistId}` }, { login: true });
    const tracks = extractPlaylistShelfTracks(response);
    return models.normalizePageResult({
      header: extractPageHeader(response, { browseId: `VL${playlistId}`, type: "playlist" }),
      tracks: tracks.length ? tracks : extractTracks(response),
      items: extractBrowseItems(response),
      playlists: extractPlaylists(response),
      sections: extractHomeSections(response),
      continuations: extractContinuations(response)
    }, { browseId: `VL${playlistId}`, type: "playlist", endpoint: "browse" });
  }

  async albumCollection(browseId, params = null) {
    const response = await this.request("browse", { browseId, params: params || undefined }, { login: needsBrowseLogin(browseId) });
    const playlistId = extractPlaylistId(response);
    const header = {
      ...extractPageHeader(response, { browseId, params, type: "album" }),
      playlistId
    };
    let tracks = extractPlaylistShelfTracks(response);
    let continuations = extractContinuations(response);
    let pagesLoaded = 1;

    if (playlistId) {
      const collected = await this.collectPlaylistTracks(`VL${playlistId}`, needsBrowseLogin(`VL${playlistId}`));
      tracks = collected.tracks.length ? collected.tracks : tracks;
      continuations = collected.continuations;
      pagesLoaded = collected.pagesLoaded;
    }

    return models.normalizePageResult({
      header,
      tracks: tracks.length ? tracks : extractTracks(response),
      items: extractBrowseItems(response),
      playlists: extractPlaylists(response),
      sections: extractHomeSections(response),
      continuations,
      pagesLoaded
    }, { browseId, params, type: "album", endpoint: "browse" });
  }

  async playlistCollection(browseId, params = null) {
    const normalizedBrowseId = String(browseId || "").startsWith("VL") ? browseId : `VL${browseId}`;
    const collected = await this.collectPlaylistTracks(normalizedBrowseId, true, Number.POSITIVE_INFINITY, params);
    const response = collected.response;
    const playlistTracks = collected.tracks;
    const result = packageResult(response, { browseId: normalizedBrowseId, params, type: "playlist" });
    return models.normalizePageResult({
      ...result,
      tracks: playlistTracks.length ? playlistTracks : result.tracks,
      continuations: collected.continuations,
      pagesLoaded: collected.pagesLoaded
    }, { browseId: normalizedBrowseId, params, type: "playlist", endpoint: "browse" });
  }

  async collection(browseId, params = null) {
    const type = typeFromBrowseId(browseId);
    if (type === "album") return this.albumCollection(browseId, params);
    if (type === "playlist") return this.playlistCollection(browseId, params);
    const response = await this.request("browse", { browseId, params: params || undefined }, { login: needsBrowseLogin(browseId) });
    return packageResult(response, { browseId, params, type: typeFromBrowseId(browseId) });
  }

  async continuation(token, endpoint = "browse") {
    if (endpoint === "search") {
      const response = await this.request("search", { continuation: token }, { login: false });
      return models.normalizePageResult({
        header: { type: "search", title: "More results", subtitle: "Search continuation" },
        tracks: extractTracks(response),
        items: extractBrowseItems(response),
        playlists: extractPlaylists(response),
        sections: extractHomeSections(response),
        continuations: extractContinuations(response, "search")
      }, { type: "search", endpoint: "search" });
    }
    if (endpoint === "next") {
      const response = await this.request("next", { continuation: token }, { login: true });
      return packageResult(response, { type: "continuation", endpoint: "next", title: "Up next" });
    }
    return this.browseContinuation(token, true);
  }

  async queue(videoId, playlistId = null, continuation = null) {
    const payload = typeof videoId === "object" && videoId !== null
      ? videoId
      : { videoId, playlistId, continuation };
    const requestedPlaylistId = payload.playlistId || null;
    const requestedVideoId = payload.videoId || null;
    continuation = payload.continuation || continuation || null;
    if (continuation) return this.continuation(continuation, "next");
    if (!requestedVideoId) return models.normalizePageResult({ tracks: [], continuations: [] }, { type: "queue", endpoint: "next" });

    const queueBody = (endpoint, useRadioFallback = true) => {
      const body = {
        videoId: endpoint.videoId || requestedVideoId,
        playlistId: endpoint.playlistId || (useRadioFallback ? `RDAMVM${endpoint.videoId || requestedVideoId}` : undefined)
      };
      if (endpoint.playlistSetVideoId || endpoint.setVideoId) body.playlistSetVideoId = endpoint.playlistSetVideoId || endpoint.setVideoId;
      if (endpoint.params) body.params = endpoint.params;
      if (Number.isFinite(Number(endpoint.index))) body.index = Number(endpoint.index);
      Object.keys(body).forEach((key) => body[key] === undefined && delete body[key]);
      return body;
    };

    const resultFromResponse = (response, fallback = {}) => models.normalizePageResult({
      header: {
        ...extractPageHeader(response, { type: "queue", title: "Up next", subtitle: "YouTube Music" }),
        currentIndex: extractSelectedQueueIndex(response)
      },
      tracks: extractTracks(response),
      items: extractBrowseItems(response),
      playlists: extractPlaylists(response),
      sections: extractHomeSections(response),
      continuations: extractContinuations(response, "next")
    }, { type: "queue", title: fallback.title || "Up next", endpoint: "next" });

    const expandQueueResult = async (baseResponse, baseResult) => {
      let expanded = baseResult;
      const automixEndpoint = extractAutomixEndpoint(baseResponse);
      if (automixEndpoint?.playlistId) {
        try {
          const automixResponse = await this.request("next", queueBody(automixEndpoint, false), { login: true });
          const automixResult = resultFromResponse(automixResponse, { title: expanded.header?.title });
          expanded = models.normalizePageResult({
            ...expanded,
            tracks: dedupeTracks([...(expanded.tracks || []), ...(automixResult.tracks || [])]),
            continuations: automixResult.continuations?.length ? automixResult.continuations : expanded.continuations
          }, { type: "queue", title: expanded.header?.title || "Up next", endpoint: "next" });
        } catch {
          // The normal next result is still usable when automix is unavailable.
        }
      }

      if ((expanded.tracks || []).length <= 1) {
        const relatedEndpoint = extractWatchTabBrowseEndpoint(baseResponse, 2);
        if (relatedEndpoint?.browseId) {
          try {
            const relatedResponse = await this.request("browse", {
              browseId: relatedEndpoint.browseId,
              params: relatedEndpoint.params || undefined
            }, { login: true });
            const relatedTracks = extractTracks(relatedResponse).filter((item) => item.id !== requestedVideoId);
            if (relatedTracks.length) {
              expanded = models.normalizePageResult({
                ...expanded,
                tracks: dedupeTracks([...(expanded.tracks || []), ...relatedTracks]),
                sections: extractHomeSections(relatedResponse)
              }, { type: "queue", title: expanded.header?.title || "Up next", endpoint: "next" });
            }
          } catch {
            // Related is a fallback; keep the original queue if it fails.
          }
        }
      }

      return expanded;
    };

    const initialEndpoint = {
      videoId: requestedVideoId,
      playlistId: requestedPlaylistId,
      playlistSetVideoId: payload.playlistSetVideoId || payload.setVideoId || null,
      params: payload.params || null,
      index: payload.index ?? null
    };

    let response = await this.request("next", queueBody(initialEndpoint), { login: true });
    let result = await expandQueueResult(response, resultFromResponse(response));

    if (result.tracks.length <= 1 && !requestedPlaylistId) {
      response = await this.request("next", queueBody(initialEndpoint, false), { login: true });
      result = await expandQueueResult(response, resultFromResponse(response));
    }

    return result;
  }

  async feedback(tokens) {
    const response = await this.request("feedback", {
      feedbackTokens: tokens,
      isFeedbackTokenUnencrypted: false,
      shouldMerge: false
    }, { login: true });
    return {
      ok: response?.feedbackResponses ? response.feedbackResponses.every((item) => item.isProcessed !== false) : true,
      response
    };
  }

  async likeVideo(videoId) {
    if (!videoId) throw new Error("Cannot like a song without a video id.");
    const response = await this.request("like/like", { target: { videoId } }, { login: true });
    return { ok: true, liked: true, response };
  }

  async unlikeVideo(videoId) {
    if (!videoId) throw new Error("Cannot unlike a song without a video id.");
    const response = await this.request("like/removelike", { target: { videoId } }, { login: true });
    return { ok: true, liked: false, response };
  }

  async subscribeChannel(channelId, subscribe = true, params = null) {
    if (!channelId) throw new Error("Cannot update artist following without a channel id.");
    const endpoint = subscribe ? "subscription/subscribe" : "subscription/unsubscribe";
    const response = await this.request(endpoint, {
      channelIds: [channelId],
      params: params || "EgIIAhgA"
    }, { login: true });
    return { ok: true, subscribed: Boolean(subscribe), response };
  }

  async addToPlaylist(playlistId, videoId) {
    const response = await this.request("browse/edit_playlist", {
      playlistId: String(playlistId || "").replace(/^VL/, ""),
      actions: [
        {
          action: "ACTION_ADD_VIDEO",
          addedVideoId: videoId
        }
      ]
    }, { login: true });
    return { ok: true, response };
  }

  async createPlaylist(title, videoIds = []) {
    const response = await this.request("playlist/create", {
      title,
      privacyStatus: "PRIVATE",
      videoIds: videoIds.length ? videoIds : undefined
    }, { login: true });
    return {
      playlistId: response.playlistId || "",
      response
    };
  }

  async library(browseId) {
    const response = await this.request("browse", { browseId }, { login: true });
    return models.normalizePageResult({
      header: extractPageHeader(response, { browseId, type: "library" }),
      tracks: extractTracks(response),
      items: extractBrowseItems(response),
      playlists: extractPlaylists(response),
      sections: extractHomeSections(response),
      continuations: extractContinuations(response)
    }, { browseId, type: "library", endpoint: "browse" });
  }

  async collectLibrary(browseId, maxPages = 20) {
    let result = await this.library(browseId);
    let pagesLoaded = 1;
    const seenContinuations = new Set();

    while (result.continuations?.[0]?.token && pagesLoaded < maxPages) {
      const continuation = result.continuations[0];
      if (seenContinuations.has(continuation.token)) break;
      seenContinuations.add(continuation.token);
      const next = await this.browseContinuation(continuation.token, true);
      result = models.mergePageResults(result, next);
      pagesLoaded += 1;
    }

    return {
      ...result,
      pagesLoaded,
      complete: !(result.continuations || []).length
    };
  }

  async libraryOverview() {
    const safeLibrary = async (source) => {
      try {
        const page = await this.collectLibrary(source.browseId);
        return {
          ...page,
          source,
          ok: true,
          error: null
        };
      } catch (error) {
        return {
          header: { type: "library", browseId: source.browseId, title: source.label },
          tracks: [],
          items: [],
          playlists: [],
          sections: [],
          continuations: [],
          pagesLoaded: 0,
          complete: false,
          source,
          ok: false,
          error: error.message
        };
      }
    };
    const safeRecentActivity = async (source) => {
      try {
        const page = await this.browseContinuation(source.continuation, true);
        return {
          ...page,
          source,
          ok: true,
          error: null,
          complete: !(page.continuations || []).length,
          pagesLoaded: 1
        };
      } catch (error) {
        return {
          header: { type: "library", title: source.label },
          tracks: [],
          items: [],
          playlists: [],
          sections: [],
          continuations: [],
          pagesLoaded: 0,
          complete: false,
          source,
          ok: false,
          error: error.message
        };
      }
    };

    const [landing, songs, playlists, albums, artists, recentActivity] = await Promise.all([
      safeLibrary(LIBRARY_SOURCES.landing),
      safeLibrary(LIBRARY_SOURCES.songs),
      safeLibrary(LIBRARY_SOURCES.playlists),
      safeLibrary(LIBRARY_SOURCES.albums),
      safeLibrary(LIBRARY_SOURCES.artists),
      safeRecentActivity(LIBRARY_SOURCES.recentActivity)
    ]);
    const landingItems = [...(landing.items || []), ...(landing.playlists || [])];
    const playlistItems = dedupeBrowseItems([
      ...(playlists.items || []),
      ...(playlists.playlists || []),
      ...landingItems.filter((item) => item.type === "playlist")
    ]).filter((item) => !["LM", "SE"].includes(String(item.id || item.browseId || "").replace(/^VL/, "")));
    const albumItems = dedupeBrowseItems([
      ...(albums.items || []),
      ...(albums.playlists || []),
      ...landingItems.filter((item) => item.type === "album")
    ]);
    const artistItems = dedupeBrowseItems([
      ...(artists.items || []),
      ...(artists.playlists || []),
      ...landingItems.filter((item) => item.type === "artist")
    ]);
    // FEmusic_liked_videos is the canonical source for liked songs. The library
    // landing page can also contain recent/recommended tracks that are not liked.
    const songItems = dedupeTracks(songs.tracks || []);
    const recentItems = dedupeMixedItems([
      ...(recentActivity.tracks || []),
      ...(recentActivity.items || []),
      ...(recentActivity.playlists || []),
      ...(landing.tracks || []),
      ...landingItems
    ]);
    const sources = {
      songs: librarySourceSummary(songs, songItems.length),
      playlists: librarySourceSummary(playlists, playlistItems.length),
      albums: librarySourceSummary(albums, albumItems.length),
      artists: librarySourceSummary(artists, artistItems.length),
      landing: librarySourceSummary(landing, landingItems.length + (landing.tracks || []).length),
      recentActivity: librarySourceSummary(recentActivity, recentItems.length)
    };

    return {
      songs: songItems,
      playlists: playlistItems,
      albums: albumItems,
      artists: artistItems,
      recent: recentItems,
      sources,
      sync: {
        updatedAt: new Date().toISOString(),
        complete: Object.values(sources).every((source) => source.ok && source.complete),
        partial: Object.values(sources).some((source) => source.ok),
        errors: Object.fromEntries(
          Object.entries(sources)
            .filter(([, source]) => source.error)
            .map(([key, source]) => [key, source.error])
        )
      },
      errors: {
        landing: landing.error,
        songs: songs.error,
        playlists: playlists.error,
        albums: albums.error,
        artists: artists.error,
        recentActivity: recentActivity.error
      }
    };
  }

  async playback(videoId, playlistId = null, quality = "auto", options = {}) {
    const attempts = [];
    let details = {
      title: "",
      author: "",
      lengthSeconds: 0,
      videoId
    };

    let poTokens = null;
    if (this.poTokenProvider) {
      try {
        poTokens = await this.poTokenProvider.tokens(videoId, this.visitorData);
        if (poTokens.visitorData) this.visitorData = poTokens.visitorData;
      } catch {
        poTokens = null;
      }
    }

    const excludedClients = new Set((options.excludeClients || []).map((value) => String(value || "").toUpperCase()));
    // A valid WEB_REMIX player response can still carry media URLs that return
    // 403. Keep the proven direct-stream clients first and retain WEB_REMIX as
    // a later authenticated fallback instead of promoting it when PoTokens exist.
    const orderedClients = STREAM_CLIENTS
      .filter(({ client }) => !excludedClients.has(String(client.clientName || "").toUpperCase()));
    for (const attempt of orderedClients) {
      try {
        const body = { videoId, playlistId };
        if (attempt.client.useWebPoTokens && poTokens?.playerRequestPoToken) {
          body.serviceIntegrityDimensions = { poToken: poTokens.playerRequestPoToken };
        }
        const response = await this.request("player", body, attempt);
        details = {
          title: response.videoDetails?.title || details.title,
          author: response.videoDetails?.author || details.author,
          lengthSeconds: Number(response.videoDetails?.lengthSeconds || details.lengthSeconds || 0),
          videoId: response.videoDetails?.videoId || videoId
        };

        const summary = streamingSummary(response);
        attempts.push({
          client: attempt.client.clientName,
          version: attempt.client.clientVersion,
          ...summary
        });

        const format = chooseAudioFormat(response, quality, options);
        if (!format) continue;

        const availableAudioFormats = (response?.streamingData?.adaptiveFormats || [])
          .filter((candidate) => String(candidate.mimeType || "").startsWith("audio/") && candidate.url)
          .map((candidate) => ({
            itag: Number(candidate.itag || 0),
            mimeType: candidate.mimeType || "",
            bitrate: Number(candidate.bitrate || 0)
          }));

        const streamUrl = attempt.client.useWebPoTokens && poTokens?.streamingDataPoToken
          ? `${format.url}${format.url.includes("?") ? "&" : "?"}pot=${encodeURIComponent(poTokens.streamingDataPoToken)}`
          : format.url;
        return {
          mode: "direct",
          quality,
          client: attempt.client.clientName,
          requestHeaders: {
            "User-Agent": attempt.client.userAgent || USER_AGENT,
            ...(attempt.client.clientName === "WEB_REMIX"
              ? { "Origin": ORIGIN, "Referer": REFERER }
              : {})
          },
          streamUrl,
          itag: format.itag,
          mimeType: format.mimeType,
          bitrate: format.bitrate,
          audioSampleRate: format.audioSampleRate,
          contentLength: Number(format.contentLength || 0),
          expiresInSeconds: Number(response.streamingData?.expiresInSeconds || 0),
          availableAudioFormats,
          attempts,
          details
        };
      } catch (error) {
        attempts.push({
          client: attempt.client.clientName,
          version: attempt.client.clientVersion,
          status: "ERROR",
          reason: error.message
        });
      }
    }

    return {
      mode: "webview",
      reason: "No direct audio URL was returned by the supported clients.",
      attempts,
      details
    };
  }
}

module.exports = {
  InnerTubeClient,
  parseCookieString
};
