<script>
const rom = document.getElementById("rom");
const sav = document.getElementById("sav");

let game = "";
let loading = false;
let blobUrl = null;

function core(name){

name = name.toLowerCase();

if(name.endsWith(".gba")) return "gba";
if(name.endsWith(".gb")) return "gb";
if(name.endsWith(".gbc")) return "gb";

return null;
}

function clean(){

try{

const old =
document.getElementById("ejs");

if(old) old.remove();

document.getElementById("game")
.innerHTML = "";

if(blobUrl){

URL.revokeObjectURL(blobUrl);

blobUrl = null;
}

delete window.EJS_player;
delete window.EJS_gameUrl;
delete window.EJS_core;
delete window.EJS_gameName;
delete window.EJS_pathtodata;
delete window.EJS_loadStateURL;
delete window.EJS_onSaveSRAM;

}catch(e){}
}

function load(file){

if(loading) return;

if(!file) return;

const c = core(file.name);

if(!c){

alert("Unsupported ROM");

return;
}

loading = true;

game = file.name;

clean();

const r = new FileReader();

r.onerror = ()=>{

loading = false;

alert("ROM read failed");
};

r.onload = ()=>{

try{

blobUrl =
URL.createObjectURL(
new Blob([r.result])
);

window.EJS_player = "#game";

window.EJS_gameUrl =
blobUrl;

window.EJS_core = c;

window.EJS_gameName =
game;

window.EJS_pathtodata =
"https://cdn.emulatorjs.org/stable/data/";

window.EJS_startOnLoaded =
true;

// SAVE HANDLER
window.EJS_onSaveSRAM =
data=>{

try{

const sr =
new FileReader();

sr.onload = ()=>{

try{

localStorage.setItem(
game + ".sav",
sr.result.split(",")[1]
);

}catch(e){}
};

sr.readAsDataURL(data);

}catch(e){}
};

// LOAD SAVE
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

// LOAD EMULATORJS
const s =
document.createElement("script");

s.id = "ejs";

s.src =
"https://cdn.emulatorjs.org/stable/data/loader.js?v="
+ Date.now();

s.onload = ()=>{

loading = false;
};

s.onerror = ()=>{

loading = false;

alert("Core load failed");
};

document.body.appendChild(s);

}catch(e){

loading = false;

alert("Emulator crashed");
}
};

r.readAsArrayBuffer(file);
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

// SAVE UPLOAD
sav.onchange = ()=>{

if(!game){

alert("Load ROM first");

return;
}

const f = sav.files[0];

if(!f) return;

const r = new FileReader();

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

r.onerror = ()=>{

alert("Save read failed");
};

r.readAsDataURL(f);
};

// SAVE DOWNLOAD
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

// FULLSCREEN
function fullscreen(){

const g =
document.getElementById("game");

if(
g.requestFullscreen
){
g.requestFullscreen();
}
}

// ERROR PROTECTION
window.onerror =
()=>true;

window.onunhandledrejection =
()=>true;
</script>
