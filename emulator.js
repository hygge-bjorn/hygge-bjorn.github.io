const rom = document.getElementById("rom");
let blobUrl = null;

function cleanup() {
  const old = document.getElementById("emu");
  if (old) old.remove();

  document.getElementById("game").innerHTML = "";

  if (blobUrl) {
    URL.revokeObjectURL(blobUrl);
    blobUrl = null;
  }

  // Clear global config variables to prevent cross-game crashes
  window.EJS_emulator = null;
  window.EJS_gameUrl = null;
  window.EJS_player = null;
  window.EJS_gameName = null;
  window.EJS_core = null;
}

function load(file) {
  if (!file) return;

  cleanup();

  const name = file.name.toLowerCase();

  // Explicitly checks for GBA files alongside GB and GBC
  const isGBA = name.endsWith(".gba");
  const isGB = name.endsWith(".gb") || name.endsWith(".gbc");

  if (!isGBA && !isGB) {
    alert("Only GBA, GB, and GBC formats are supported.");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    blobUrl = URL.createObjectURL(new Blob([reader.result]));

    // Emulator configuration
    window.EJS_player = "#game";
    window.EJS_gameUrl = blobUrl;
    window.EJS_gameName = file.name;

    // CDN Architecture Paths
    window.EJS_pathtodata = "https://emulatorjs.org";

    // SWITCH ENGINE: Targets 'gba' engine if file is .gba, otherwise defaults to 'gb'
    window.EJS_core = isGBA ? "gba" : "gb";

    // iOS and Safari stability optimizations
    window.EJS_disableDatabases = true;
    window.EJS_threads = 1;
    window.EJS_startOnLoaded = true;

    // Small delay ensuring engine memory clears before launching loader script
    setTimeout(() => {
      const script = document.createElement("script");
      script.id = "emu";
      script.src = "https://emulatorjs.orgloader.js";

      script.onerror = () => {
        alert("Emulator failed to load (CDN or WebGL layout error).");
      };

      document.body.appendChild(script);
    }, 50);
  };

  reader.readAsArrayBuffer(file);
}

rom.onchange = e => load(e.target.files[0]);

document.body.ondragover = e => e.preventDefault();

document.body.ondrop = e => {
  e.preventDefault();
  load(e.dataTransfer.files[0]);
};
