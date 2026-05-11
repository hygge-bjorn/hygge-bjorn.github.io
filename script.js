let currentSave = null;
let currentState = null;

async function startEmulator(file){

    const arrayBuffer = await file.arrayBuffer();

    const romData = new Uint8Array(arrayBuffer);

    let core = "gba";

    if(file.name.endsWith(".gb")){
        core = "gb";
    }

    if(file.name.endsWith(".gbc")){
        core = "gb";
    }

    // CLEAR OLD SCREEN
    document.getElementById("game").innerHTML = "";

    // REMOVE OLD LOADER
    const oldLoader =
    document.getElementById("ejsloader");

    if(oldLoader){
        oldLoader.remove();
    }

    // EMULATOR CONFIG
    window.EJS_player = "#game";

    window.EJS_core = core;

    window.EJS_pathtodata = "https://www.emulatorjs.com/data/";

    window.EJS_gameData = romData;

    // SAVE CALLBACK
    window.EJS_onSaveUpdate = function(saveData){

        currentSave = saveData;
    };

    // STATE CALLBACK
    window.EJS_onStateUpdate = function(stateData){

        currentState = stateData;
    };

    // LOAD LOADER.JS
    const script =
    document.createElement("script");

    script.id = "ejsloader";

    script.src = "https://www.emulatorjs.com/data/loader.js";

    document.body.appendChild(script);
}

// ROM UPLOAD
document
.getElementById("romUpload")
.addEventListener("change", function(e){

    const file = e.target.files[0];

    if(!file) return;

    startEmulator(file);
});

// DOWNLOAD SAVE
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

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download = "game.sav";

    a.click();

    URL.revokeObjectURL(url);
}

// DOWNLOAD STATE
function downloadState(){

    if(!currentState){

        alert("No state found.");

        return;
    }

    const blob = new Blob(
        [currentState],
        {
            type:"application/octet-stream"
        }
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download = "game.state";

    a.click();

    URL.revokeObjectURL(url);
}

// UPLOAD SAVE
document
.getElementById("savUpload")
.addEventListener("change", async function(e){

    const file = e.target.files[0];

    if(!file) return;

    const buffer =
    await file.arrayBuffer();

    const saveArray =
    new Uint8Array(buffer);

    localStorage.setItem(
        "EJS_SAVE",
        JSON.stringify(
            Array.from(saveArray)
        )
    );

    alert(
        "Save uploaded. Reload ROM."
    );
});

// UPLOAD STATE
document
.getElementById("stateUpload")
.addEventListener("change", async function(e){

    const file = e.target.files[0];

    if(!file) return;

    const buffer =
    await file.arrayBuffer();

    const stateArray =
    new Uint8Array(buffer);

    localStorage.setItem(
        "EJS_STATE",
        JSON.stringify(
            Array.from(stateArray)
        )
    );

    alert(
        "State uploaded. Reload ROM."
    );
});
