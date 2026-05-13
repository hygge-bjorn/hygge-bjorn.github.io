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

// load save (only visual, not source of truth)
const save = localStorage.getItem(game + ".sav");

if(save){
try{
const bytes =
Uint8Array.from(atob(save),c=>c.charCodeAt(0));

window.EJS_loadStateURL =
URL.createObjectURL(new Blob([bytes]));
}catch(e){}
}

// IMPORTANT: DO NOT RELY ON THIS (kept only as fallback)
window.EJS_onSaveSRAM = ()=>{};

// loader
const script = document.createElement("script");
script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
script.id = "emulatorjs";

document.body.appendChild(script);

// 🔥 AUTO-SAVE POLLING (REAL FIX)
setInterval(async ()=>{

try{

const dbs = await indexedDB.databases?.();

if(!dbs) return;

for(const db of dbs){

if(!db.name.includes("emulator")) continue;

const request = indexedDB.open(db.name);

request.onsuccess = ()=>{

try{

const idb = request.result;

const tx = idb.transaction(idb.objectStoreNames, "readonly");

for(const store of idb.objectStoreNames){

const obj = tx.objectStore(store).getAll();

obj.onsuccess = ()=>{

const data = obj.result;

if(!data || !data.length) return;

// find largest buffer (likely SRAM)
let best = null;

for(const item of data){
if(item instanceof ArrayBuffer || item?.buffer){
best = item;
}
}

if(best){

const bytes = new Uint8Array(best);

const base64 = btoa(
String.fromCharCode(...bytes)
);

localStorage.setItem(game + ".sav", base64);
}

};

}

}catch(e){}
};

}

}catch(e){}

},5000);

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

sav.onchange = ()=>{

if(!game) return alert("Load ROM first");

const file = sav.files[0];
if(!file) return;

const r = new FileReader();

r.onload = ()=>{

const base64 = r.result.split(",")[1];

localStorage.setItem(game + ".sav", base64);

alert("Save imported");
};

r.readAsDataURL(file);
};

// 🔥 REAL FIX DOWNLOAD
function downloadSav(){

if(!game){
alert("No game loaded");
return;
}

const data = localStorage.getItem(game + ".sav");

if(!data){
alert("No save found yet. Save in-game first.");
return;
}

const a = document.createElement("a");
a.href = "data:application/octet-stream;base64," + data;
a.download = game.replace(/\.[^/.]+$/, "") + ".sav";
a.click();
}

function fullscreen(){
const g = document.getElementById("game");
if(g.requestFullscreen) g.requestFullscreen();
}
