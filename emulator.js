const rom = document.getElementById("rom");
const sav = document.getElementById("sav");

let game = "";
let blobUrl = null;
let latestSave = null;

function core(name){

name = name.toLowerCase();

window.EJS_forceLegacyCores = true;

if(name.endsWith(".gba")){
window.EJS_core = "mgba";

/*
FORCE FLASH 128K SAVES
Fixes many Pokemon games/hacks
*/
window.EJS_saveType = 1;

return;
}

if(name.endsWith(".gb")){
window.EJS_core = "gb";
return;
}

if(name.endsWith(".gbc")){
window.EJS_core = "gbc";
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

latestSave = null;
}

function load(file){

if(!file) return;

game = file.name;

clean();

core(file.name);

const reader = new FileReader();

reader.onload = ()=>{

blobUrl =
URL.createObjectURL(
new Blob([reader.result])
);

window.EJS_player = "#game";

window.EJS_gameUrl =
blobUrl;

window.EJS_gameName =
game;

window.EJS_pathtodata =
"https://cdn.emulatorjs.org/stable/data/";

window.EJS_startOnLoaded = true;

/*
AUTOSAVE EVERY 5 SECONDS
*/
window.EJS_fixedSaveInterval = 5000;

/*
LOAD REAL .SAV FILE
NOT SAVE STATES
*/
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

/*
REAL SAVE CALLBACK
*/
window.EJS_onSaveUpdate =
function(e){

try{

if(!e || !e.save) return;

const bytes =
new Uint8Array(e.save);

let binary = "";

for(let i=0;i<bytes.length;i++){

binary +=
String.fromCharCode(
bytes[i]
);
}

const base64 =
btoa(binary);

latestSave = base64;

localStorage.setItem(
game + ".sav",
base64
);

console.log(
"SAV UPDATED"
);

}catch(err){

console.log(err);
}
};

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

/*
ROM LOAD
*/
rom.onchange =
e=>load(
e.target.files[0]
);

/*
DRAG DROP
*/
document.body.ondragover =
e=>e.preventDefault();

document.body.ondrop = e=>{

e.preventDefault();

load(
e.dataTransfer.files[0]
);
};

/*
IMPORT .SAV
*/
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

/*
DOWNLOAD REAL .SAV
*/
function downloadSav(){

const data =
latestSave ||
localStorage.getItem(
game + ".sav"
);

if(!data){

alert(
"No save found yet.\nSave in-game first and wait 5-10 seconds."
);

return;
}

const a =
document.createElement("a");

a.href =
"data:application/octet-stream;base64," + data;

a.download =
game.replace(
/\.[^/.]+$/,
""
) + ".sav";

document.body.appendChild(a);

a.click();

document.body.removeChild(a);

console.log(
"SAV DOWNLOADED"
);
}

/*
FULLSCREEN
*/
function fullscreen(){

const g =
document.getElementById("game");

if(g.requestFullscreen){

g.requestFullscreen();
}
}
