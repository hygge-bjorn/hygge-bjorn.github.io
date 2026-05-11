window.EJS_onGameStart = function() {

    document.addEventListener("keydown", handleDown);
    document.addEventListener("keyup", handleUp);
};

function handleDown(e){

    const key = mapKey(e.code, true);
    if (key) EJS_emulator.setButton(key, true);
}

function handleUp(e){

    const key = mapKey(e.code, false);
    if (key) EJS_emulator.setButton(key, false);
}

function mapKey(code, down){

    switch(code){

        case "ArrowUp": return "up";
        case "ArrowDown": return "down";
        case "ArrowLeft": return "left";
        case "ArrowRight": return "right";

        case "KeyZ": return "a";
        case "KeyX": return "b";

        case "Enter": return "start";

        case "ShiftLeft":
        case "ShiftRight": return "select";

    }

    return null;
}
