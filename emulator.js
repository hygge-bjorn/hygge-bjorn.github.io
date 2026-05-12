const rom = document.getElementById("rom");
const sav = document.getElementById("sav");

let game = "";
let blobUrl = null;

function core(name){

name = name.toLowerCase();

if(name.endsWith(".gba")) return "gba";
if(name.endsWith(".gb")) return "gb";
if(name.endsWith(".gbc")) return "gb";

return null;
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

const c = core(file.name);

if(!c){

alert("Unsupported ROM");

return;
}

game = file.name;

clean();

const reader = new FileReader();

reader.onload = ()=>{

blobUrl =
URL.createObjectURL(
new Blob([reader.result])
);

window.EJS_player = "#game";

window.EJS_core = c;

window.EJS_gameName = game;

window.EJS_gameUrl = blobUrl;

// IMPORTANT FIX
window.EJS_pathtodata =
"https://cdn.emulatorjs.org/stable/data/";

// SAVE LOAD
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

// SAVE STORE
window.EJS_onSaveSRAM =
data=>{

const r =
new FileReader();

r.onload = ()=>{

try{

localStorage.setItem(
game + ".sav",
r.result.split(",")[1]
);

}catch(e){}
};

r.readAsDataURL(data);
};

const script =
document.createElement("script");

// IMPORTANT FIX
script.src =
"https://cdn.emulatorjs.org/stable/data/loader.js";

script.id =
"emulatorjs";

script.onerror = ()=>{

alert(
"Could not load EmulatorJS"
);
};

document.body.appendChild(script);
};

reader.readAsArrayBuffer(file);
}

rom.onchange =
e=>load(
e.target.files[0]
);

document.body.ondragover =
e=>e.preventDefault();

document.body.ondrop = e=>{

e.preventDefault();

load(
e.dataTransfer.files[0]
);
};

sav.onchange = ()=>{

if(!game){

alert("Load ROM first");

return;
}

const file =
sav.files[0];

if(!file) return;

const r =
new FileReader();

r.onload = ()=>{

try{

localStorage.setItem(
game + ".sav",
r.result.split(",")[1]
);

alert(
"Save uploaded. Reload ROM."
);

}catch(e){

alert("Bad save");
}
};

r.readAsDataURL(file);
};

function downloadSav(){

if(!game){

alert("No game");

return;
}

const data =
localStorage.getItem(
game + ".sav"
);

if(!data){

alert("No save");

return;
}

const a =
document.createElement("a");

a.href =
"data:application/octet-stream;base64,"
+ data;

a.download =
game + ".sav";

a.click();
}

function fullscreen(){

const g =
document.getElementById("game");

if(g.requestFullscreen){

g.requestFullscreen();
}
}
