const rom = document.getElementById("rom");
const sav = document.getElementById("sav");

let game = "";
let blobUrl = null;

function core(name){

name = name.toLowerCase();

if(name.endsWith(".gba")){
window.EJS_core = "mgba";
return;
}

if(name.endsWith(".gb")){
window.EJS_core = "gb";
return;
}

if(name.endsWith(".gbc")){
window.EJS_core = "gbc";
window.EJS_forceLegacyCores = true;
return;
}
}

function clean(){

const old =
document.getElementById("emulatorjs");

if(old) old.remove();

document.getElementById("game")
.innerHTML = "";

if(blobUrl){

URL.revokeObjectURL(blobUrl);

blobUrl = null;
}
}

function load(file){

if(!file) return;

game = file.name;

clean();

core(file.name);

const reader =
new FileReader();

reader.onload = ()=>{

blobUrl =
URL.createObjectURL(
new Blob([reader.result])
);

// emulator config
window.EJS_player = "#game";

window.EJS_gameUrl =
blobUrl;

window.EJS_gameName =
game;

window.EJS_pathtodata =
"https://cdn.emulatorjs.org/stable/data/";

window.EJS_startOnLoaded = true;

// IMPORTANT FOR POKEMON HACKS
window.EJS_forceLegacyCores = true;

// force Flash128K save type
window.EJS_saveType = 1;

// autosave
window.EJS_fixedSaveInterval = 5000;

// LOAD .sav FILE
const existing =
localStorage.getItem(
game + ".sav"
);

if(existing){

try{

const bytes =
Uint8Array.from(
atob(existing),
c=>c.charCodeAt(0)
);

window.EJS_loadSavURL =
URL.createObjectURL(
new Blob([bytes])
);

}catch(e){

console.log(e);
}
}

// load emulator
const script =
document.createElement("script");

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

// ROM LOAD
rom.onchange =
e=>load(
e.target.files[0]
);

// DRAG DROP
document.body.ondragover =
e=>e.preventDefault();

document.body.ondrop = e=>{

e.preventDefault();

load(
e.dataTransfer.files[0]
);
};

// IMPORT .sav
sav.onchange = ()=>{

if(!game){

alert("Load ROM first");

return;
}

const file =
sav.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload = ()=>{

try{

const base64 =
reader.result.split(",")[1];

localStorage.setItem(
game + ".sav",
base64
);

alert(
"Save imported. Reload ROM."
);

}catch(e){

alert("Import failed");
}
};

reader.readAsDataURL(file);
};

// DOWNLOAD REAL .sav
async function downloadSav(){

if(!window.EJS_emulator){

alert("Game not loaded");

return;
}

try{

const save =
await window.EJS_emulator.getSaveFile();

if(!save){

alert(
"No save found yet.\nSave in-game first."
);

return;
}

const blob =
new Blob([save]);

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
game.replace(/\.[^/.]+$/, "") + ".sav";

a.click();

}catch(err){

console.log(err);

alert("Save export failed");
}
}

// FULLSCREEN
function fullscreen(){

const g =
document.getElementById("game");

if(g.requestFullscreen){

g.requestFullscreen();
}
}
