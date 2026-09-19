const { app } = require("electron");
const { PoTokenProvider } = require("../src/main/poToken");
const { InnerTubeClient } = require("../src/main/innertube.legacy");

app.whenReady().then(async () => {
  const provider = new PoTokenProvider();
  try {
    const result = await new InnerTubeClient({}, { poTokenProvider: provider }).playback(
      process.argv[2] || "v4w5N85H1aM"
    );
    const summary = JSON.stringify({
      mode: result.mode,
      client: result.client,
      itag: result.itag,
      attempts: result.attempts?.map(({ client, version, status, reason, directAudioFormats, cipherAudioFormats }) => ({
        client,
        version,
        status,
        reason,
        directAudioFormats,
        cipherAudioFormats
      }))
    }, null, 2);
    console.log(summary);
    process.exitCode = result.mode === "direct" ? 0 : 1;
  } catch (error) {
    console.error(error?.stack || error);
    process.exitCode = 1;
  } finally {
    await provider.close();
    app.quit();
  }
});
