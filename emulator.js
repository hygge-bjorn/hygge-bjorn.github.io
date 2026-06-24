const rom = document.getElementById("rom");

let blobUrl = null;
let emulatorLoaded = false;

function cleanup(){

const old = document.getElementById("emulatorjs");
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

function setCore(name){

name = name.toLowerCase();

// iPhone-safe: ONLY GB/GBC
if(name.endsWith(".gb") || name.endsWith(".gbc")){
window.EJS_core = "gb";
return true;
}

return false;
}

function load(file){
if(!file) return;

cleanup();

if(!setCore(file.name)){
alert("Only GB/GBC supported on this version");
return;
}

const reader = new FileReader();

reader.onload = () => {

blobUrl = URL.createObjectURL(
new Blob([reader.result])
);

// EmulatorJS config
window.EJS_player = "#game";
window.EJS_gameUrl = blobUrl;
window.EJS_gameName = file.name;
window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
window.EJS_startOnLoaded = true;

// iOS stability flags
window.EJS_disableDatabases = true;
window.EJS_threads = 1;

// prevent duplicate loader issues
if(emulatorLoaded){
cleanup();
}

emulatorLoaded = true;

// remove old instance if exists
const old = document.getElementById("emulatorjs");
if(old) old.remove();

const script = document.createElement("script");
script.id = "emulatorjs";
script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";

script.onerror = () => {
alert("Failed to load emulator core");
};

document.body.appendChild(script);
};

reader.readAsArrayBuffer(file);
}

// ROM input
rom.onchange = e => load(e.target.files[0]);

// drag & drop support
document.body.ondragover = e => e.preventDefault();

document.body.ondrop = e => {
e.preventDefault();
load(e.dataTransfer.files[0]);
};
