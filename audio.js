let clickAud = document.getElementById("click-sound");
let errorAud = document.getElementById("error-sound");
let outAud = document.getElementById("out-sound");
let selectAud = document.getElementById("select-sound");
let captureAud = document.getElementById("capture-sound");
let rollAud = document.getElementById("roll-sound");
let safeAud = document.getElementById("safe-sound");
let glowAud = document.getElementById("glow-sound");
let slideAud = document.getElementById("slide-sound");
// let pulse = document.getElementById("glow-sound");

function playError(){
    errorAud.play();
}

function playClick(){
    clickAud.play();
}

function playSelect(){
    selectAud.play()
}

function playCapture(){
    captureAud.play()
}