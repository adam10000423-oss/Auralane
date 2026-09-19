const crypto = require("node:crypto");
const { DecodedSignature } = require("shazamio-core");

const USER_AGENTS = [
  "Dalvik/2.1.0 (Linux; U; Android 6.0.1; SM-G920F Build/MMB29K)",
  "Dalvik/2.1.0 (Linux; U; Android 5.1.1; SM-P905V Build/LMY47X)",
  "Dalvik/2.1.0 (Linux; U; Android 5.0; SM-G900F Build/LRX21T)"
];

function audioSamplesFromPayload(payload = {}) {
  const value = payload.samples;
  if (value instanceof ArrayBuffer) return new Float32Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Float32Array(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength));
  }
  throw new Error("Recorded audio is unavailable.");
}

function recognitionResult(response = {}) {
  const track = response.track;
  if (!track?.title) return null;
  const songSection = track.sections?.find((section) => section?.type === "SONG");
  const metadata = Array.isArray(songSection?.metadata) ? songSection.metadata : [];
  return {
    title: track.title || "",
    artist: track.subtitle || "",
    album: metadata.find((item) => item?.title === "Album")?.text || "",
    year: metadata.find((item) => item?.title === "Released")?.text || "",
    genre: track.genres?.primary || "",
    thumbnail: track.images?.coverarthq || track.images?.coverart || "",
    shazamUrl: track.url || ""
  };
}

async function sendRecognition(signature, locale = "en-US") {
  const id1 = crypto.randomUUID().toUpperCase();
  const id2 = crypto.randomUUID();
  const url = new URL(`https://amp.shazam.com/discovery/v5/en/US/android/-/tag/${id1}/${id2}`);
  for (const [key, value] of Object.entries({
    sync: "true", webv3: "true", sampling: "true", connected: "",
    shazamapiversion: "v3", sharehub: "true", video: "v3"
  })) url.searchParams.set(key, value);

  const timestamp = Math.floor(Date.now() / 1000);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Language": String(locale || "en-US").replace("-", "_"),
      "User-Agent": USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
    },
    body: JSON.stringify({
      geolocation: {},
      signature: { samplems: signature.samplems, timestamp, uri: signature.uri },
      timestamp,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Taipei"
    })
  });
  if (response.status === 429) throw new Error("Music recognition is busy. Please try again shortly.");
  if (!response.ok) throw new Error(`Music recognition failed (${response.status}).`);
  return recognitionResult(await response.json());
}

async function recognizeMusic(payload = {}) {
  const sampleRate = Math.round(Number(payload.sampleRate || 0));
  if (!Number.isFinite(sampleRate) || sampleRate < 8000 || sampleRate > 192000) {
    throw new Error("Invalid microphone sample rate.");
  }
  const samples = audioSamplesFromPayload(payload);
  if (samples.length < sampleRate * 4) throw new Error("Not enough audio was recorded. Try again.");
  const usableSamples = samples.length > sampleRate * 15 ? samples.subarray(0, sampleRate * 15) : samples;
  const signature = DecodedSignature.new(usableSamples, sampleRate, 1);
  try {
    const result = await sendRecognition({ uri: signature.uri, samplems: signature.samplems }, payload.locale);
    if (!result) throw new Error("No matching song found. Try again with clearer audio.");
    return result;
  } finally {
    signature.free();
  }
}

module.exports = { recognizeMusic };
