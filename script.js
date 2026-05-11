let currentSave = null;

document
.getElementById("romUpload")
.addEventListener("change", async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();

    const romData = new Uint8Array(arrayBuffer);

    let core = "gba";

    if (file.name.endsWith(".gb")) {
        core = "gb";
    }

    if (file.name.endsWith(".gbc")) {
        core = "gb";
    }

    document.getElementById("game").innerHTML = "";

    window.EJS_player = "#game";
    window.EJS_core = core;
    window.EJS_pathtodata =
    "https://cdn.emulatorjs.org/stable/data/";
    window.EJS_gameData = romData;

    const script = document.createElement("script");

    script.src =
    "https://cdn.emulatorjs.org/stable/data/loader.js";

    document.body.appendChild(script);
});

window.EJS_onSaveUpdate = function(saveData){

    currentSave = saveData;
};

function downloadSav(){

    if(!currentSave){
        alert("No save yet.");
        return;
    }

    const blob = new Blob(
        [currentSave],
        {
            type:"application/octet-stream"
        }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "game.sav";

    a.click();

    URL.revokeObjectURL(url);
}

document
.getElementById("savUpload")
.addEventListener("change", async (e)=>{

    const file = e.target.files[0];

    if(!file) return;

    const buffer = await file.arrayBuffer();

    const saveArray = new Uint8Array(buffer);

    localStorage.setItem(
        "EJS_SAVE",
        JSON.stringify(Array.from(saveArray))
    );

    alert("Save uploaded. Reload ROM.");
});
