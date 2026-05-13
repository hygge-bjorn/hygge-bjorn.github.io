const rom = document.getElementById("rom");
const sav = document.getElementById("sav");

let game = "";
let blobUrl = null;
let emulatorReady = false;

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

emulatorReady = false;
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

window.EJS_forceLegacyCores = true;

// IMPORT SAV IF EXISTS
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

window.EJS_loadStateURL =
URL.createObjectURL(
new Blob([bytes])
);

}catch(e){}
}

const script =
document.createElement("script");

script.src =
"https://cdn.emulatorjs.org/stable/data/loader.js";

script.id = "emulatorjs";

script.onload = ()=>{

emulatorReady = true;
};

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

// IMPORT SAV
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

// REAL SAVE EXPORT
async function downloadSav(){

if(!emulatorReady){

alert("Game not ready");

return;
}

try{

// EmulatorJS internal storage
const db =
await new Promise((resolve,reject)=>{

const req =
indexedDB.open("EJS_STORAGE");

req.onsuccess =
()=>resolve(req.result);

req.onerror =
()=>reject();
});

const tx =
db.transaction(
["files"],
"readonly"
);

const store =
tx.objectStore("files");

const req =
store.getAll();

req.onsuccess = ()=>{

const result = req.result;

if(!result || !result.length){

alert(
"No save found. Save in-game first."
);

return;
}

// find SRAM
let save = null;

for(const item of result){

if(
item &&
item.file &&
item.file.size > 1000
){
save = item.file;
}
}

if(!save){

alert("No SRAM found");

return;
}

const a =
document.createElement("a");

a.href =
URL.createObjectURL(save);

a.download =
game.replace(/\.[^/.]+$/, "")
+ ".sav";

a.click();
};

}catch(e){

alert(
"Save export failed"
);
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
