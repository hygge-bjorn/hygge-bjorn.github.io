const rom = document.getElementById("rom");

let blobUrl = null;
let scriptLoaded = false;

function cleanup(){

const old = document.getElementById("emu");
if(old) old.remove();

document.getElementById("game").innerHTML = "";

if(blobUrl){
URL.revokeObjectURL(blobUrl);
blobUrl = null;
}

window.EJS_emulator = null;
window.EJS_gameUrl = null;
window.EJS_player = null;
}

function load(file){
if(!file) return;

cleanup();

const name = file.name.toLowerCase();

// iPhone-safe only
if(!(name.endsWith(".gb") || name.endsWith(".gbc"))){
alert("Only GB/GBC supported");
return;
}

const reader = new FileReader();

reader.onload = () => {

blobUrl = URL.createObjectURL(new Blob([reader.result]));

// IMPORTANT: config BEFORE loader
window.EJS_player = "#game";
window.EJS_gameUrl = blobUrl;
window.EJS_gameName = file.name;

// FIXED CDN (important for iPhone stability)
window.EJS_pathtodata = "https://cdn.emulatorjs.org/latest/data/";

// GB core only (stable on iPhone)
window.EJS_core = "gb";

// iOS stability flags
window.EJS_disableDatabases = true;
window.EJS_threads = 1;
window.EJS_startOnLoaded = true;

// prevent duplicate crashes
const old = document.getElementById("emu");
if(old) old.remove();

setTimeout(() => {

const script = document.createElement("script");
script.id = "emu";
script.src = "https://cdn.emulatorjs.org/latest/data/loader.js";

script.onerror = () => {
alert("Emulator failed to load (CDN/WebGL issue)");
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
