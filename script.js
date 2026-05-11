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

    // EmulatorJS setup
    window.EJS_player = "#game";
    window.EJS_core = core;
    window.EJS_pathtodata =
    "https://cdn.emulatorjs.org/stable/data/";
    window.EJS_gameData = romData;

    // Save callback
    window.EJS_onSaveUpdate = function(saveData){
        currentSave = saveData;
    };

    // LOAD EMULATOR
    const script = document.createElement("script");

    script.src =
    "https://cdn.emulatorjs.org/stable/data/loader.js";

    document.body.appendChild(script);
});

function downloadSav(){

    if(!currentSave){
        alert("No save found.");
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
