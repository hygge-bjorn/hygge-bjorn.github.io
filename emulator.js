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
