document.addEventListener("keydown", function(e) {

    if (!window.EJS_emulator) return;

    switch(e.code) {

        // D-PAD
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

        // A / B
        case "KeyZ":
            EJS_emulator.setButton("a", true);
            break;

        case "KeyX":
            EJS_emulator.setButton("b", true);
            break;

        // Start / Select
        case "Enter":
            EJS_emulator.setButton("start", true);
            break;

        case "ShiftLeft":
        case "ShiftRight":
            EJS_emulator.setButton("select", true);
            break;
    }
});

document.addEventListener("keyup", function(e) {

    if (!window.EJS_emulator) return;

    switch(e.code) {

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
