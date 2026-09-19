const fs = require("node:fs");
const path = require("node:path");
const { app, safeStorage } = require("electron");

const STORE_NAME = "metromusic-state.json";
const DEFAULT_UPDATE_REPOSITORY = "adam10000423-oss/Auralane";

function storePath() {
  return path.join(app.getPath("userData"), STORE_NAME);
}

function encodeSecret(value) {
  if (!value) return "";
  if (safeStorage.isEncryptionAvailable()) {
    return `safe:${safeStorage.encryptString(value).toString("base64")}`;
  }
  console.warn("[store] Secure credential storage is unavailable; the session cookie was not saved.");
  return "";
}

function decodeSecret(value) {
  if (!value) return "";
  try {
    if (value.startsWith("safe:")) {
      if (!safeStorage.isEncryptionAvailable()) return "";
      return safeStorage.decryptString(Buffer.from(value.slice(5), "base64"));
    }
    if (value.startsWith("plain:")) {
      return Buffer.from(value.slice(6), "base64").toString("utf8");
    }
  } catch (error) {
    console.warn("[store] decodeSecret failed:", error?.message || error);
    return "";
  }
  return value;
}

function readStore() {
  try {
    const raw = fs.readFileSync(storePath(), "utf8");
    const parsed = JSON.parse(raw);
    const profiles = Array.isArray(parsed.profiles)
      ? parsed.profiles.map((profile) => ({
          ...profile,
          cookie: decodeSecret(profile.cookie)
        }))
      : [];
    return {
      cookie: decodeSecret(parsed.cookie),
      visitorData: parsed.visitorData || "",
      dataSyncId: parsed.dataSyncId || "",
      account: parsed.account || null,
      profiles,
      queue: parsed.queue || [],
      playbackSession: parsed.playbackSession || null,
      likedRemovalTombstones: parsed.likedRemovalTombstones && typeof parsed.likedRemovalTombstones === "object"
        ? parsed.likedRemovalTombstones
        : {},
      recognitionHistory: Array.isArray(parsed.recognitionHistory) ? parsed.recognitionHistory.slice(0, 50) : [],
      localMusicLibrary: Array.isArray(parsed.localMusicLibrary) ? parsed.localMusicLibrary : [],
      localMusicFolders: Array.isArray(parsed.localMusicFolders) ? parsed.localMusicFolders.slice(0, 10) : [],
      shortcuts: parsed.shortcuts && typeof parsed.shortcuts === "object" ? parsed.shortcuts : {},
      preferences: parsed.preferences && typeof parsed.preferences === "object" ? parsed.preferences : {},
      updateRepository: parsed.updateRepository || DEFAULT_UPDATE_REPOSITORY,
      lyricWindowActive: Boolean(parsed.lyricWindowActive),
      lyricWindowBounds: parsed.lyricWindowBounds || null
    };
  } catch {
    return {
      cookie: "",
      visitorData: "",
      dataSyncId: "",
      account: null,
      profiles: [],
      queue: [],
      playbackSession: null,
      likedRemovalTombstones: {},
      recognitionHistory: [],
      localMusicLibrary: [],
      localMusicFolders: [],
      shortcuts: {},
      preferences: {},
      updateRepository: DEFAULT_UPDATE_REPOSITORY,
      lyricWindowActive: false,
      lyricWindowBounds: null
    };
  }
}

function writeStore(state) {
  const serializable = {
    cookie: encodeSecret(state.cookie || ""),
    visitorData: state.visitorData || "",
    dataSyncId: state.dataSyncId || "",
    account: state.account || null,
    profiles: Array.isArray(state.profiles)
      ? state.profiles.map((profile) => ({
          ...profile,
          cookie: encodeSecret(profile.cookie || "")
        }))
      : [],
    queue: state.queue || [],
    playbackSession: state.playbackSession || null,
    likedRemovalTombstones: state.likedRemovalTombstones && typeof state.likedRemovalTombstones === "object"
      ? state.likedRemovalTombstones
      : {},
    recognitionHistory: Array.isArray(state.recognitionHistory) ? state.recognitionHistory.slice(0, 50) : [],
    localMusicLibrary: Array.isArray(state.localMusicLibrary) ? state.localMusicLibrary : [],
    localMusicFolders: Array.isArray(state.localMusicFolders) ? state.localMusicFolders.slice(0, 10) : [],
    shortcuts: state.shortcuts || {},
    preferences: state.preferences || {},
    updateRepository: state.updateRepository || "",
    lyricWindowActive: Boolean(state.lyricWindowActive),
    lyricWindowBounds: state.lyricWindowBounds || null
  };
  fs.mkdirSync(path.dirname(storePath()), { recursive: true });
  fs.writeFileSync(storePath(), JSON.stringify(serializable, null, 2));
}

function clearStore() {
  try {
    fs.rmSync(storePath(), { force: true });
  } catch {
    // Best effort.
  }
}

module.exports = {
  readStore,
  writeStore,
  clearStore
};
