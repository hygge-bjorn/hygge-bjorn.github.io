const rom = document.getElementById("rom");

let blobUrl = null;
let scriptLoaded = false;

function cleanup(){
document.getElementById("game").innerHTML = "";

if(blobUrl){
URL.revokeObjectURL(blobUrl);
blobUrl = null;
}
}

function load(file){
if(!file) return;

cleanup();

const name = file.name.toLowerCase();

// ONLY GB/GBC (important for iPhone stability)
if(!(name.endsWith(".gb") || name.endsWith(".gbc"))){
alert("Only GB/GBC supported on iPhone");
return;
}

const reader = new FileReader();

reader.onload = () => {

blobUrl = URL.createObjectURL(new Blob([reader.result]));

// IMPORTANT: set BEFORE loading script
window.EJS_player = "#game";
window.EJS_gameUrl = blobUrl;
window.EJS_gameName = file.name;
window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
window.EJS_core = "gb";
window.EJS_startOnLoaded = true;

// remove old script completely
const old = document.getElementById("emu");
if(old) old.remove();

// FORCE fresh load (iOS fix)
setTimeout(() => {

const script = document.createElement("script");
script.id = "emu";
script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";

script.onload = () => {
scriptLoaded = true;
};

script.onerror = () => {
alert("Failed to load emulator");
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
