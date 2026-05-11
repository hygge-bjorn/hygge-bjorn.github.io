let currentSave = null;

let emulatorLoaded = false;

const gameDiv =
document.getElementById("game");

const romUpload =
document.getElementById("romUpload");

const savUpload =
document.getElementById("savUpload");

const downloadBtn =
document.getElementById("downloadSaveBtn");

// ROM UPLOAD
romUpload.addEventListener(
    "change",
    async function(e){

    const file = e.target.files[0];

    if(!file) return;

    await startEmulator(file);
});

// START EMULATOR
async function startEmulator(file){

    // CLEAR OLD SCREEN
    gameDiv.innerHTML = "";

    // REMOVE OLD LOADER
    const oldLoader =
    document.getElementById("ejsloader");

    if(oldLoader){
        oldLoader.remove();
    }

    emulatorLoaded = false;

    // READ ROM
    const arrayBuffer =
    await file.arrayBuffer();

    const romData =
    new Uint8Array(arrayBuffer);

    // DETECT CORE
    let core = "gba";

    if(file.name.endsWith(".gb")){
        core = "gb";
    }

    if(file.name.endsWith(".gbc")){
        core = "gb";
    }

    // EMULATORJS SETTINGS
    window.EJS_player = "#game";

    window.EJS_core = core;

    window.EJS_pathtodata = "./data/";

    window.EJS_gameData = romData;

    // DISABLE ADS/UI STUFF
    window.EJS_startOnLoaded = true;

    // SAVE CALLBACK
    window.EJS_onSaveUpdate =
    function(saveData){

        currentSave = saveData;
    };

    // GAME START CALLBACK
    window.EJS_onGameStart =
    function(){

        emulatorLoaded = true;

        console.log(
            "Game Started"
        );
    };

    // LOAD EMULATORJS
    const script =
    document.createElement("script");

    script.id = "ejsloader";

    script.src = "./data/loader.js";

    document.body.appendChild(script);
}

// DOWNLOAD SAVE
downloadBtn.addEventListener(
    "click",
    function(){

    if(!currentSave){

        alert(
            "No save data yet."
        );

        return;
    }

    const blob =
    new Blob(
        [currentSave],
        {
            type:
            "application/octet-stream"
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
});

// SAVE UPLOAD
savUpload.addEventListener(
    "change",
    async function(e){

    const file = e.target.files[0];

    if(!file) return;

    const buffer =
    await file.arrayBuffer();

    const saveArray =
    new Uint8Array(buffer);

    // STORE SAVE
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

// KEYBOARD CONTROLS
document.addEventListener(
    "keydown",
    function(e){

    if(
        !emulatorLoaded ||
        !window.EJS_emulator
    ){
        return;
    }

    switch(e.code){

        case "ArrowUp":
            EJS_emulator.setButton(
                "up",
                true
            );
            break;

        case "ArrowDown":
            EJS_emulator.setButton(
                "down",
                true
            );
            break;

        case "ArrowLeft":
            EJS_emulator.setButton(
                "left",
                true
            );
            break;

        case "ArrowRight":
            EJS_emulator.setButton(
                "right",
                true
            );
            break;

        case "KeyZ":
            EJS_emulator.setButton(
                "a",
                true
            );
            break;

        case "KeyX":
            EJS_emulator.setButton(
                "b",
                true
            );
            break;

        case "Enter":
            EJS_emulator.setButton(
                "start",
                true
            );
            break;

        case "ShiftLeft":
        case "ShiftRight":
            EJS_emulator.setButton(
                "select",
                true
            );
            break;
    }
});

// KEY RELEASE
document.addEventListener(
    "keyup",
    function(e){

    if(
        !emulatorLoaded ||
        !window.EJS_emulator
    ){
        return;
    }

    switch(e.code){

        case "ArrowUp":
            EJS_emulator.setButton(
                "up",
                false
            );
            break;

        case "ArrowDown":
            EJS_emulator.setButton(
                "down",
                false
            );
            break;

        case "ArrowLeft":
            EJS_emulator.setButton(
                "left",
                false
            );
            break;

        case "ArrowRight":
            EJS_emulator.setButton(
                "right",
                false
            );
            break;

        case "KeyZ":
            EJS_emulator.setButton(
                "a",
                false
            );
            break;

        case "KeyX":
            EJS_emulator.setButton(
                "b",
                false
            );
            break;

        case "Enter":
            EJS_emulator.setButton(
                "start",
                false
            );
            break;

        case "ShiftLeft":
        case "ShiftRight":
            EJS_emulator.setButton(
                "select",
                false
            );
            break;
    }
});
