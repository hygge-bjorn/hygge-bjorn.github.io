const rom = document.getElementById("rom");
const sav = document.getElementById("sav");

let game = "";
let blobUrl = null;

function core(name){

name = name.toLowerCase();

// GBA
if(name.endsWith(".gba")){
window.EJS_core = "gba";
return "gba";
}

// GB
if(name.endsWith(".gb")){
window.EJS_core = "gb";
return "gb";
}

// GBC (FIXED)
if(name.endsWith(".gbc")){
window.EJS_core = "gb";
window.EJS_forceLegacyCores = true;
return "gb";
}

return null;
}

function clean(){

const old = document.getElementById("emulatorjs");
if(old) old.remove();

document.getElementById("game").innerHTML = "";

if(blobUrl){
URL.revokeObjectURL(blobUrl);
blobUrl = null;
}
}

function load(file){

if(!file) return;

const c = core(file.name);

if(!c){
alert("Unsupported ROM");
return;
}

game = file.name;

clean();

const reader = new FileReader();

reader.onload = ()=>{

blobUrl = URL.createObjectURL(new Blob([reader.result]));

window.EJS_player = "#game";
window.EJS_gameUrl = blobUrl;
window.EJS_gameName = game;

// IMPORTANT FIX FOR GBC CORE LOADING
window.EJS_pathtodata =
"https://cdn.emulatorjs.org/stable/data/";

window.EJS_forceLegacyCores = true;
window.EJS_startOnLoaded = true;

// SAVE LOAD
const existing = localStorage.getItem(game + ".sav");

if(existing){
try{
const bytes = Uint8Array.from(atob(existing),c=>c.charCodeAt(0));
window.EJS_loadStateURL = URL.createObjectURL(new Blob([bytes]));
}catch(e){}
}

// SAVE WRITE
window.EJS_onSaveSRAM = data=>{
const r = new FileReader();
r.onload = ()=>{
try{
localStorage.setItem(game + ".sav", r.result.split(",")[1]);
}catch(e){}
};
r.readAsDataURL(data);
};

// LOAD EMULATOR
const script = document.createElement("script");
script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
script.id = "emulatorjs";

script.onerror = ()=>alert("Core load failed");

document.body.appendChild(script);
};

reader.readAsArrayBuffer(file);
}

// INPUTS
rom.onchange = e=>load(e.target.files[0]);

document.body.ondragover = e=>e.preventDefault();
document.body.ondrop = e=>{
e.preventDefault();
load(e.dataTransfer.files[0]);
};

// SAVE UPLOAD
sav.onchange = ()=>{

if(!game) return alert("Load ROM first");

const file = sav.files[0];
if(!file) return;

const r = new FileReader();

r.onload = ()=>{
try{
localStorage.setItem(game + ".sav", r.result.split(",")[1]);
alert("Save uploaded. Reload ROM.");
}catch(e){
alert("Bad save");
}
};

r.readAsDataURL(file);
};

// SAVE DOWNLOAD
function downloadSav(){

if(!game) return alert("No game");

const data = localStorage.getItem(game + ".sav");

if(!data) return alert("No save");

const a = document.createElement("a");
a.href = "data:application/octet-stream;base64," + data;
a.download = game + ".sav";
a.click();
}

// FULLSCREEN
function fullscreen(){
const g = document.getElementById("game");
if(g.requestFullscreen) g.requestFullscreen();
}
