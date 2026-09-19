const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const AUDIO_EXTENSIONS = new Set([".mp3", ".flac", ".wav", ".aac", ".m4a", ".ogg", ".opus", ".webm"]);

function trackId(filePath) {
  return `local_${crypto.createHash("sha256").update(path.resolve(filePath)).digest("hex").slice(0, 24)}`;
}

async function audioFiles(root) {
  const output = [];
  const pending = [root];
  while (pending.length) {
    const folder = pending.pop();
    let entries = [];
    try { entries = await fs.promises.readdir(folder, { withFileTypes: true }); } catch { continue; }
    for (const entry of entries) {
      const target = path.join(folder, entry.name);
      if (entry.isDirectory()) pending.push(target);
      else if (entry.isFile() && AUDIO_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) output.push(target);
    }
  }
  return output;
}

function pictureMime(picture = {}) {
  const format = String(picture.format || "image/jpeg").toLowerCase();
  if (format.includes("png")) return { mime: "image/png", extension: ".png" };
  if (format.includes("webp")) return { mime: "image/webp", extension: ".webp" };
  return { mime: "image/jpeg", extension: ".jpg" };
}

async function scanLocalMusic(root, coverRoot, onProgress = () => {}) {
  const { parseFile } = await import("music-metadata");
  const files = await audioFiles(root);
  await fs.promises.mkdir(coverRoot, { recursive: true });
  const tracks = [];
  for (let index = 0; index < files.length; index += 1) {
    const filePath = files[index];
    const stat = await fs.promises.stat(filePath);
    let metadata = { common: {}, format: {} };
    try { metadata = await parseFile(filePath, { duration: true, skipCovers: false }); } catch {}
    const id = trackId(filePath);
    const common = metadata.common || {};
    const format = metadata.format || {};
    let thumbnail = "";
    const picture = common.picture?.[0];
    if (picture?.data?.length) {
      const kind = pictureMime(picture);
      const coverName = `${id}${kind.extension}`;
      await fs.promises.writeFile(path.join(coverRoot, coverName), picture.data);
      thumbnail = `/local-music-cover/${encodeURIComponent(coverName)}`;
    }
    tracks.push({
      id,
      videoId: id,
      kind: "track",
      type: "track",
      local: true,
      localPath: filePath,
      title: common.title || path.basename(filePath, path.extname(filePath)),
      artist: common.artist || common.albumartist || "Unknown artist",
      subtitle: [common.artist || common.albumartist, common.album].filter(Boolean).join(" · ") || "Local music",
      album: common.album ? { title: common.album } : null,
      thumbnail,
      durationSeconds: Number(format.duration || 0),
      lengthSeconds: Number(format.duration || 0),
      bitrate: Number(format.bitrate || 0),
      sampleRate: Number(format.sampleRate || 0),
      codec: format.codec || path.extname(filePath).slice(1).toUpperCase(),
      fileSize: stat.size,
      modifiedAt: stat.mtime.toISOString()
    });
    onProgress({ current: index + 1, total: files.length, title: tracks.at(-1).title });
  }
  return tracks;
}

function streamFile(filePath, request, response) {
  const stat = fs.statSync(filePath);
  const range = request.headers.range;
  const extension = path.extname(filePath).toLowerCase();
  const mime = extension === ".mp3" ? "audio/mpeg"
    : extension === ".flac" ? "audio/flac"
      : extension === ".wav" ? "audio/wav"
        : extension === ".m4a" || extension === ".aac" ? "audio/mp4"
          : extension === ".ogg" || extension === ".opus" ? "audio/ogg"
            : "audio/webm";
  if (!range) {
    response.writeHead(200, { "Content-Type": mime, "Content-Length": stat.size, "Accept-Ranges": "bytes" });
    fs.createReadStream(filePath).pipe(response);
    return;
  }
  const match = /bytes=(\d*)-(\d*)/.exec(range);
  const start = match?.[1] ? Number(match[1]) : 0;
  const end = match?.[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
  response.writeHead(206, {
    "Content-Type": mime,
    "Content-Length": end - start + 1,
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    "Accept-Ranges": "bytes"
  });
  fs.createReadStream(filePath, { start, end }).pipe(response);
}

module.exports = { scanLocalMusic, streamFile };
