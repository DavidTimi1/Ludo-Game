let images = ["dice-01.svg","dice-02.svg","dice-03.svg","dice-04.svg","dice-05.svg","dice-06.svg"];
let die = document.getElementById("die-1");

let pause = false;
let dieRoll = null;
let can = true;


function getTransitionEndEventName(){
    let transitions = {
        transition: "transitionend",
        OTransition: "oTransitionEnd",
        MozTransition: "transitionend",
        WebkitTransition: "webkitTransitionEnd"
    }
    let bodyStyle = document.body.style;
    for (let transition in transitions)
        if (bodyStyle[transition] != undefined)
            return transitions[transition];
}

const transitionEnd = getTransitionEndEventName();


function rollDice(){
    if (can && !pause){
        can = false;
        die.classList.add("spin");

        if (turn >= 0){
            rollAud.play();
            for (let count = 0; count < 3; count++){
                setTimeout(function(){
                    let rolling = Math.floor( Math.random()*7 );
                    if (rolling == 6) rolling = 5;

                    die.setAttribute("src", `./Roll_The_Dice/${images[rolling]}`);
                }, 300);
            }
        } else {
            let rolling = Math.floor( Math.random()*7 );
            if (rolling == 6) rolling = 5;

            die.setAttribute("src", `./Roll_The_Dice/${images[rolling]}`);
        }

        setTimeout(function(){
            die.classList.remove("spin");
            if (turn >= 0)
            {
                let dieValue = Math.floor(Math.random() * (outPieces(activeColor).length? 9 : 7));
    
                if (dieValue > 5) dieValue = 5;
    
                dieRoll = dieValue + 1;
                document.getElementById("store-roll").innerHTML = dieRoll;
                die.setAttribute("src", `./Roll_The_Dice/${images[dieValue]}`);
                halt = false;

                if (
                    (dieRoll < 6 && !outPieces(activeColor).length)
                    || (dieRoll == 6 && document.getElementById("store").innerHTML == 2)
                ){
                    document.getElementById("store").innerHTML = "";
                    setTimeout(updateTurn, 500);

                } else {
                    if (dieRoll != 6) document.getElementById("store").innerHTML = "";

                    playables(dieRoll, activeColor);
                    
                }
            } else {
                setTimeout(updateTurn, 500);
            }
        }, 1000);
    }
}


function callRoll(){
    if(!bot){
        rollDice();
    }
}

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
    clickAud.play();
}
// document.getElementById("switch-cont").addEventListener('mousedown',changeAUTO);
document.getElementById("switch-cont").addEventListener('click',changeAUTO);


let toggleSettings = (n)=>{
    let wrapper = document.getElementsByClassName("settings-wrapper")[0];
    let wheels = document.getElementsByClassName("fa-gear");
    let wrapperBox = document.getElementsByClassName("settings-container")[0];
    clickAud.play();

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

let vol = (type)=>{
    let hide = document.querySelector(".hide");
    clickAud.play();
    if (type == "vol"){
        soundVol = document.getElementById("vol-slide").value;
        let activeIcon = document.querySelector("#vol-icon .active");
        hide.appendChild(activeIcon);
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
        hide.appendChild(activeIcon);
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

