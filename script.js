let currentSave = null;

document
.getElementById("romUpload")
.addEventListener("change", async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();

    const romData = new Uint8Array(arrayBuffer);

    let core = "gba";

    // Detect GB/GBC
    if (file.name.endsWith(".gb")) {
        core = "gb";
    }

    if (file.name.endsWith(".gbc")) {
        core = "gb";
    }

    // Clear previous emulator
    document.getElementById("game").innerHTML = "";

    // EmulatorJS settings
    window.EJS_player = "#game";

    window.EJS_core = core;

    // LOCAL DATA FOLDER
    window.EJS_pathtodata = "./data/";

    window.EJS_gameData = romData;

    // Save callback
    window.EJS_onSaveUpdate = function(saveData){

        currentSave = saveData;
    };

    // Load emulator
    const script = document.createElement("script");

    script.src = "./data/loader.js";

    document.body.appendChild(script);
});

// DOWNLOAD .SAV
function downloadSav(){

    if(!currentSave){

        alert("No save found yet.");

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

// UPLOAD .SAV
document
.getElementById("savUpload")
.addEventListener("change", async (e)=>{

    const file = e.target.files[0];

    if(!file) return;

    const buffer = await file.arrayBuffer();

    const saveArray = new Uint8Array(buffer);

    // Store save locally
    localStorage.setItem(
        "EJS_SAVE",
        JSON.stringify(Array.from(saveArray))
    );

    alert(
        "Save uploaded. Reload ROM."
    );
});

// CUSTOM CONTROLS
document.addEventListener("keydown", function(e){

    if(!window.EJS_emulator) return;

    switch(e.code){

        case "ArrowUp":
            EJS_emulator.setButton("up", true);
            break;

        case "ArrowDown":
            EJS_emulator.setButton("down", true);
            break;

        case "ArrowLeft":
            EJS_emulator.setButton("left", true);
            break;

        case "ArrowRight":
            EJS_emulator.setButton("right", true);
            break;

        case "KeyZ":
            EJS_emulator.setButton("a", true);
            break;

        case "KeyX":
            EJS_emulator.setButton("b", true);
            break;

        case "Enter":
            EJS_emulator.setButton("start", true);
            break;

        case "ShiftLeft":
        case "ShiftRight":
            EJS_emulator.setButton("select", true);
            break;
    }
});

document.addEventListener("keyup", function(e){

    if(!window.EJS_emulator) return;

    switch(e.code){

        case "ArrowUp":
            EJS_emulator.setButton("up", false);
            break;

        case "ArrowDown":
            EJS_emulator.setButton("down", false);
            break;

        case "ArrowLeft":
            EJS_emulator.setButton("left", false);
            break;

        case "ArrowRight":
            EJS_emulator.setButton("right", false);
            break;

        case "KeyZ":
            EJS_emulator.setButton("a", false);
            break;

        case "KeyX":
            EJS_emulator.setButton("b", false);
            break;

        case "Enter":
            EJS_emulator.setButton("start", false);
            break;

        case "ShiftLeft":
        case "ShiftRight":
            EJS_emulator.setButton("select", false);
            break;
    }
});
