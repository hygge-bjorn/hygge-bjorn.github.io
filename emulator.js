const rom = document.getElementById("rom");
const sav = document.getElementById("sav");

let game = "";
let blobUrl = null;
let latestSave = null;

function core(name){

name = name.toLowerCase();

// GBA
if(name.endsWith(".gba")){
window.EJS_core = "mgba";
window.EJS_gbaSaveType = "auto";
return "gba";
}

// GB
if(name.endsWith(".gb")){
window.EJS_core = "gb";
return "gb";
}

// GBC
if(name.endsWith(".gbc")){
window.EJS_core = "gbc";
window.EJS_forceLegacyCores = true;
return "gbc";
}

// SNES
if(
name.endsWith(".smc") ||
name.endsWith(".sfc")
){
window.EJS_core = "snes";
return "snes";
}

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

latestSave = null;
}

function load(file){

if(!file) return;

game = file.name;

clean();

const type = core(file.name);

if(!type){

alert("Unsupported ROM");

return;
}

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

// load save if exists
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

// save callback
window.EJS_onSaveUpdate = function(e){

try{

if(!e || !e.save) return;

const bytes =
new Uint8Array(e.save);

let binary = "";

for(let i=0;i<bytes.length;i++){

binary +=
String.fromCharCode(bytes[i]);
}

const base64 =
btoa(binary);

latestSave = base64;

localStorage.setItem(
game + ".sav",
base64
);

}catch(err){}
};

const script =
document.createElement("script");

script.src =
"https://cdn.emulatorjs.org/stable/data/loader.js";

script.id =
"emulatorjs";

script.onerror = ()=>{

alert("Core load failed");
};

document.body.appendChild(script);
};

reader.readAsArrayBuffer(file);
}

// ROM INPUT
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

// IMPORT SAVE
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

// EXPORT SAVE
function downloadSav(){

const data =
latestSave ||
localStorage.getItem(
game + ".sav"
);

if(!data){

alert(
"No save found yet. Save in-game first."
);

return;
}

const a =
document.createElement("a");

a.href =
"data:application/octet-stream;base64,"
+ data;

a.download =
game.replace(/\.[^/.]+$/, "")
+ ".sav";

a.click();
}

// FULLSCREEN
function fullscreen(){

const g =
document.getElementById("game");

if(g.requestFullscreen){

g.requestFullscreen();
}
}
// ===== GAMEPAD SUPPORT =====

let gamepadIndex = null;

window.addEventListener(
"gamepadconnected",
e=>{

gamepadIndex = e.gamepad.index;

console.log(
"Controller connected:",
e.gamepad.id
);

alert(
"Controller connected"
);
});

window.addEventListener(
"gamepaddisconnected",
()=>{

gamepadIndex = null;
});

const keyMap = {

12:"ArrowUp",
13:"ArrowDown",
14:"ArrowLeft",
15:"ArrowRight",

0:"x", // A
1:"z", // B

9:"Enter", // Start
8:"Shift" // Select
};

const pressed = {};

function pressKey(key){

document.dispatchEvent(
new KeyboardEvent(
"keydown",
{key:key}
));
}

function releaseKey(key){

document.dispatchEvent(
new KeyboardEvent(
"keyup",
{key:key}
));
}

function pollGamepad(){

if(gamepadIndex === null){

requestAnimationFrame(
pollGamepad
);

return;
}

const gp =
navigator.getGamepads?.()
?.[gamepadIndex];

if(!gp){

requestAnimationFrame(
pollGamepad
);

return;
}

for(const b in keyMap){

const key =
keyMap[b];

const down =
gp.buttons[b]?.pressed;

if(down && !pressed[b]){

pressKey(key);

pressed[b] = true;
}

if(!down && pressed[b]){

releaseKey(key);

pressed[b] = false;
}
}

requestAnimationFrame(
pollGamepad
);
}

pollGamepad();
