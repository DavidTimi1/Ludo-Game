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

export function playError(){
    errorAud.play();
}

export function playClick(){
    clickAud.play();
}

export function playSelect(){
    selectAud.play()
}

export function playCapture(){
    captureAud.play()
}

export function playGlow(){
    glowAud.play()
}

export function playSafe(){
    safeAud.play()
}

export function playSlide(){
    slideAud.play()
}

export function playRoll(){
    rollAud.play()
}

export function playStop(){
    outAud.play()
}