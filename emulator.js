const rom = document.getElementById("rom");
const sav = document.getElementById("sav");

let game = "";
let blobUrl = null;

function core(name){

name = name.toLowerCase();

if(name.endsWith(".gba")){
window.EJS_core = "mgba";
window.EJS_gbaSaveType = "auto";
return "gba";
}

if(name.endsWith(".gb")){
window.EJS_core = "gb";
return "gb";
}

if(name.endsWith(".gbc")){
window.EJS_core = "gbc";
window.EJS_forceLegacyCores = true;
return "gbc";
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

window.EJS_pathtodata =
"https://cdn.emulatorjs.org/stable/data/";

window.EJS_startOnLoaded = true;
window.EJS_forceLegacyCores = true;

// ===== SAVE LOAD (PRIMARY + BACKUP) =====
const save1 = localStorage.getItem(game + ".sav");
const save2 = localStorage.getItem(game + ".sav_backup");

const existing = save1 || save2;

if(existing){

try{

const bytes =
Uint8Array.from(atob(existing),c=>c.charCodeAt(0));

window.EJS_loadStateURL =
URL.createObjectURL(new Blob([bytes]));

}catch(e){}
}

// ===== SAVE WRITE (FIXED + BACKUP) =====
window.EJS_onSaveSRAM = data=>{

if(!data) return;

const r = new FileReader();

r.onload = ()=>{

try{

const base64 = r.result.split(",")[1];

localStorage.setItem(game + ".sav", base64);
localStorage.setItem(game + ".sav_backup", base64);

}catch(e){}
};

r.readAsDataURL(data);
};

// LOAD EMULATOR
const script = document.createElement("script");

script.src =
"https://cdn.emulatorjs.org/stable/data/loader.js";

script.id = "emulatorjs";

script.onerror = ()=>{

alert("Core load failed");
};

document.body.appendChild(script);
};

reader.readAsArrayBuffer(file);
}

// ===== INPUTS =====
rom.onchange = e=>load(e.target.files[0]);

document.body.ondragover = e=>e.preventDefault();

document.body.ondrop = e=>{
e.preventDefault();
load(e.dataTransfer.files[0]);
};

// ===== SAVE UPLOAD =====
sav.onchange = ()=>{

if(!game){
alert("Load ROM first");
return;
}

const file = sav.files[0];
if(!file) return;

const r = new FileReader();

r.onload = ()=>{

try{

const base64 = r.result.split(",")[1];

localStorage.setItem(game + ".sav", base64);
localStorage.setItem(game + ".sav_backup", base64);

alert("Save uploaded. Reload ROM.");

}catch(e){
alert("Invalid save file");
}
};

r.readAsDataURL(file);
};

// ===== SAVE DOWNLOAD (FIXED RELIABILITY) =====
function downloadSav(){

if(!game){
alert("No game loaded");
return;
}

let data =
localStorage.getItem(game + ".sav") ||
localStorage.getItem(game + ".sav_backup");

if(!data){
alert("No save found. Save in-game first.");
return;
}

const a = document.createElement("a");
a.href = "data:application/octet-stream;base64," + data;
a.download = game.replace(/\.[^/.]+$/, "") + ".sav";
a.click();
}

// ===== FULLSCREEN =====
function fullscreen(){
const g = document.getElementById("game");
if(g.requestFullscreen) g.requestFullscreen();
}
