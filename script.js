let currentRom = null;
let emulator = null;

// IndexedDB simple save system
const DB_NAME = "retro-saves";
const STORE = "files";

function openDB() {
  return new Promise((resolve) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
  });
}

async function saveFile(key, data) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(data, key);
}

async function loadFile(key) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readonly");
  return tx.objectStore(STORE).get(key);
}

// Load emulator
function loadGame(file) {
  currentRom = file;

  const reader = new FileReader();
  reader.onload = function (e) {
    const romData = e.target.result;

    startEmulator(file.name, romData);
  };
  reader.readAsArrayBuffer(file);
}

// Emulator init (EmulatorJS)
function startEmulator(name, buffer) {
  document.getElementById("screen").innerHTML = "";

  EJS_player = "#screen";
  EJS_gameName = name;
  EJS_gameUrl = URL.createObjectURL(new Blob([buffer]));
  EJS_core = getCore(name);

  // save support
  EJS_onSaveState = function (state) {
    saveFile(name + ".state", state);
  };

  EJS_onSaveSRAM = function (sav) {
    saveFile(name + ".sav", sav);
  };

  emulator = new EJS(EmulatorJS);
}

// choose core automatically
function getCore(name) {
  if (name.endsWith(".gb")) return "gb";
  if (name.endsWith(".gbc")) return "gb";
  if (name.endsWith(".gba")) return "gba";
  if (name.endsWith(".nds")) return "nds"; // experimental (melonDS)
  return "gba";
}

// File input
document.getElementById("romInput").addEventListener("change", (e) => {
  loadGame(e.target.files[0]);
});

// Drag & drop
const dropZone = document.getElementById("dropZone");

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  loadGame(e.dataTransfer.files[0]);
});
