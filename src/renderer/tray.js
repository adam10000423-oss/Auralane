const art = document.getElementById("art");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const progress = document.getElementById("progress");
const playButton = document.getElementById("playButton");
let lastState = {};

function render(state = {}) {
  lastState = state;
  document.documentElement.dataset.colorScheme=state.colorScheme==="light"?"light":"dark";
  const rgb=state.readableThemeColor||state.themeColor||[80,100,140];
  document.documentElement.style.setProperty("--theme-color",rgb.join(", "));
  document.documentElement.style.setProperty("--mini-on-accent",rgb.reduce((sum,value,index)=>sum+Number(value)*[.299,.587,.114][index],0)>150?"#101014":"#fff");
  const track = state.track || {};
  title.textContent = track.title || "Nothing playing";
  artist.textContent = track.artist || track.artists?.map((item) => item.name || item).join(", ") || "Open Auralane to choose music";
  art.style.backgroundImage = track.thumbnail ? `url(${JSON.stringify(track.thumbnail)})` : "";
  playButton.textContent = state.playing ? "Ⅱ" : "▶";
  playButton.setAttribute("aria-label", state.playing ? "Pause" : "Play");
  const duration = Number(state.duration || track.lengthSeconds || 0);
  progress.value = duration > 0 ? Math.round((Number(state.currentTime || 0) / duration) * 1000) : 0;
}

document.querySelectorAll("[data-command]").forEach((button) => button.addEventListener("click", () => {
  window.metro.sendMiniPlayerCommand({ command: button.dataset.command });
}));
document.getElementById("closeButton").addEventListener("click", () => window.metro.hideTray());
document.getElementById("openButton").addEventListener("click", () => window.metro.showMainWindow());
document.getElementById("miniButton").addEventListener("click", () => window.metro.openMiniPlayer(lastState));
progress.addEventListener("change", () => window.metro.sendMiniPlayerCommand({ command: "seek", seconds: (Number(progress.value) / 1000) * Number(lastState.duration || lastState.track?.lengthSeconds || 0) }));
window.metro.onTrayState(render);
window.metro.trayReady().then(render);
