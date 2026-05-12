const rom = document.getElementById("rom");
const sav = document.getElementById("sav");

let game = "";
let blobUrl = null;

function core(name){

name = name.toLowerCase();

if(name.endsWith(".gba")) return "gba";

if(name.endsWith(".gb")) return "gb";

if(name.endsWith(".gbc")) return "gbc";

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

window.EJS_pathtodata =
"https://cdn.emulatorjs.org/stable/data/";

// load save
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

// save handler
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

// iphone safari fixes
window.EJS_startOnLoaded = true;

window.EJS_color = "#000";

window.EJS_volume = 1;

window.EJS_defaultOptions = {
fullscreenOnLoad:false
};

const script =
document.createElement("script");

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

// ROM picker
rom.onchange =
e=>load(
e.target.files[0]
);

// drag/drop
document.body.ondragover =
e=>e.preventDefault();

document.body.ondrop = e=>{

e.preventDefault();

load(
e.dataTransfer.files[0]
);
};

// upload save
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

// download save
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

// fullscreen
function fullscreen(){

const g =
document.getElementById("game");

if(g.requestFullscreen){

g.requestFullscreen();
}
}
