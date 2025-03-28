import { playClick } from "./audio";
import { rollDice, setRoll } from "./Roll_The_Dice/roll_dice";
import { closeOverlays, getActivePlayer } from "./script";

export let pausedGame = false;
export let AUTO = true;

function changeAUTO(){
    if (document.getElementById("switch-cont").classList.contains("on")){
        document.getElementById("switch-cont").classList.remove("on");
        AUTO = false;
        document.getElementById("switch-cont").style.backgroundColor = "#999";
        document.getElementById("auto-off").style.backgroundColor = "white";
        document.getElementById("auto-on").style.backgroundColor = "transparent";
    } else {
        document.getElementById("switch-cont").classList.add("on");
        AUTO = true;
        document.getElementById("switch-cont").style.backgroundColor = "blue";
        document.getElementById("auto-on").style.backgroundColor = "white";
        document.getElementById("auto-off").style.backgroundColor = "transparent";
    }
    playClick();
}

document.getElementById("auto-play").addEventListener('click',changeAUTO);

export const toggleSettings = (n)=>{
    let wrapper = document.getElementsByClassName("settings-wrapper")[0];
    let wheels = document.getElementsByClassName("fa-gear");
    let wrapperBox = document.getElementsByClassName("settings-container")[0];
    playClick();

    if (n == "in"){
        wheels[0].style.transform = wheels[1].style.transform = "rotate(0deg)";
        setTimeout (function (){
            wrapperBox.style.zIndex = "-5";
        }, 400);
        wrapper.classList.add("close");

    } else {
        wheels[0].style.transform = wheels[1].style.transform = "rotate(720deg)";
        wrapper.classList.remove("close");
        setTimeout (function (){
            wrapperBox.style.zIndex = "20";
        }, 100);
    }
    
}
let soundVol;
let musicVol;

const vol = (type)=>{
    let hidden = document.querySelector(".hidden");
    playClick();
    if (type == "vol"){
        soundVol = document.getElementById("vol-slide").value;
        let activeIcon = document.querySelector("#vol-icon .active");
        hidden.appendChild(activeIcon);
        activeIcon.classList.remove("active");
        if (soundVol == 0){
            document.querySelector("#vol-icon").appendChild(document.querySelector(".fa-volume-xmark"));
            document.querySelector(".fa-volume-xmark").classList.add("active");
        } else if (soundVol <= 3 && soundVol > 0){
            document.querySelector("#vol-icon").appendChild(document.querySelector(".fa-volume-low"));
            document.querySelector(".fa-volume-low").classList.add("active");
        } else {
            document.querySelector("#vol-icon").appendChild(document.querySelector(".fa-volume-high"));
            document.querySelector(".fa-volume-high").classList.add("active");
        }
        document.querySelectorAll(".game-sound").forEach(sound =>{
            sound.volume = soundVol / 5;
        });
    } else {
        musicVol = document.getElementById("music-slide").value;
        let activeIcon = document.querySelector("#music-icon .active");
        hidden.appendChild(activeIcon);
        activeIcon.classList.remove("active");
        if (musicVol == 0){
            document.querySelector("#vol-icon").appendChild(document.querySelector(".music-slash"));
            document.querySelector(".music-slash").classList.add("acive");
        } else {
            document.querySelector("#vol-icon").appendChild(document.querySelector(".fa-music"));
            document.querySelector(".fa-music").classList.add("acive");
        }
        document.querySelectorAll(".music-sound").forEach(sound =>{
            sound.volume = musicVol / 5;
        });
    }
}


const pauseBtn = document.getElementById("pause-all");
for (let btn of document.getElementsByClassName("resume-btn")) 
    btn.addEventListener("click", resumeGame);

for (let btn of document.getElementsByClassName("vert-restart")) 
    btn.addEventListener("click", () => verify(restartGame));

for (let btn of document.getElementsByClassName("vert-mainmenu")) 
    btn.addEventListener("click", () => verify(toMainMenu));


export const pauseAll = () => {
    playClick();
    pausedGame = true;
    pauseBtn.classList.add("invisible");
    document.getElementsByClassName("Overlay")[0].classList.remove("hidden");
    document.getElementById("pause-overlay").classList.remove("hidden");
}

export function resumeGame(){
    playClick();
    closeOverlays();
    pausedGame = false;
    pauseBtn.classList.remove("invisible");

    if (getActivePlayer().isBot) setTimeout(rollDice, 500);
}



const performApprovedAction = (action) => {
    playClick();
    pausedGame = false;
    document.getElementsByClassName("Overlay").classList.add("hidden");
    document.getElementById("verify-overlay").classList.add("hidden");
    action?.();
}

function restartGame(){
    turn = -1;
    clearAll();
    closeOverlays();
    pauseBtn.classList.remove("invisible");
    setRoll(true);
    rollDice();
}

function verify(func){
    playClick();
    pausedGame = true;
    pauseBtn.classList.add("invisible");
    document.getElementById("pause-overlay").classList.add("hidden");
    document.getElementsByClassName("Overlay")[0].classList.remove("hidden");
    document.getElementById("verify-overlay").classList.remove("hidden");

    document.getElementById("verify-yes").onclick = () => performApprovedAction(func);
    document.getElementById("verify-no").onclick = resumeGame;

    // stop listening
    document.getElementById("verify-yes").onclick = document.getElementById("verify-no").onclick = null;
}


const clearAll = () => {
    turn = -1;
    for (let color of colors) {
        let group = getGroup(color)

        let allCells = document.getElementsByTagName("td");
        for (let cell of allCells)
            cell.classList.remove(`${color}p`, "occupied", `${color}block`, "block");

        for (let i = 0; i < 4; i++) {
            let p = document.getElementById(group[i].id);
            // arrangePile(null, p);
            document.getElementById(`${color}house`).append(p);
            group[i].pos = color + "house";

            turnDivs[i].classList.add("hidden");
        }
    }
    timesPlayedSix = 0;
}


const inputs = document.querySelectorAll(".register input");
const inputWrap = elem => elem.closest("label");

const toMainMenu = () => {
    clearAll();
    closeOverlays();

    inputs.forEach(inp => {
        inp.classList.remove("valid");
        inp.value = ""

        let wrap = inputWrap(inp);
        wrap.classList.remove("valid");
        wrap.classList.add("hidden");
    });

    setRoll(true);
    document.getElementsByClassName("game-wrapper")[0].classList.add("invisible");
    document.getElementById("preGame-overlay").classList.remove("hidden");
    document.getElementsByClassName("_0")[0].classList.remove("hidden");
}
