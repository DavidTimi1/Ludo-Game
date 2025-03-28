import { playClick } from "./audio";

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
// document.getElementById("switch-cont").addEventListener('mousedown',changeAUTO);
document.getElementById("switch-cont").addEventListener('click',changeAUTO);

let AUTO = false;

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

export const pauseAll = () => {
    playClick();
    pausedGame = true;
    pauseBtn.classList.add("invisible");
    document.getElementsByClassName("Overlay")[0].classList.remove("hidden");
    document.getElementById("pause-overlay").classList.remove("hidden");
}