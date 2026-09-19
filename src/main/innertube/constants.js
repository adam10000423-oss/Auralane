const ORIGIN = "https://music.youtube.com";
const API_URL = `${ORIGIN}/youtubei/v1`;
const REFERER = `${ORIGIN}/`;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0";

const WEB_REMIX = {
  clientName: "WEB_REMIX",
  clientVersion: "1.20260213.01.00",
  clientId: "67",
  userAgent: USER_AGENT,
  loginSupported: true
};

const WEB = {
  clientName: "WEB",
  clientVersion: "2.20260213.00.00",
  clientId: "1",
  userAgent: USER_AGENT,
  loginSupported: false
};

const WEB_CREATOR = {
  clientName: "WEB_CREATOR",
  clientVersion: "1.20260213.00.00",
  clientId: "62",
  userAgent: USER_AGENT,
  loginSupported: true
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
  loginSupported: false
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
  loginSupported: false
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
  { client: WEB_REMIX, login: true },
  { client: WEB_CREATOR, login: true },
  { client: ANDROID_VR_143, login: false },
  { client: ANDROID_VR_161, login: false },
  { client: ANDROID_CREATOR, login: true }
];

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
  landing: { kind: "landing", label: "Library landing", browseId: "FEmusic_library_landing" },
  songs: { kind: "songs", label: "Liked songs", browseId: "FEmusic_liked_videos" },
  playlists: { kind: "playlists", label: "Saved playlists", browseId: "FEmusic_liked_playlists" },
  albums: { kind: "albums", label: "Liked albums", browseId: "FEmusic_liked_albums" },
  artists: { kind: "artists", label: "Subscribed artists", browseId: "FEmusic_library_corpus_artists" }
};

module.exports = {
  ORIGIN, API_URL, REFERER, USER_AGENT,
  WEB, WEB_REMIX, WEB_CREATOR, ANDROID_VR_143, ANDROID_VR_161, ANDROID_CREATOR,
  STREAM_CLIENTS,
  LIBRARY_ADD_ICONS, LIBRARY_SAVED_ICONS,
  SEARCH_FILTERS, LIBRARY_SOURCES
};
