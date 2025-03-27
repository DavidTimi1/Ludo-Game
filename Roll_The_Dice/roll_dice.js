const dieImages = ["dice-01.svg", "dice-02.svg", "dice-03.svg", "dice-04.svg", "dice-05.svg", "dice-06.svg"];
const die = document.getElementById("die-1");

let pause = false;
let dieRoll = null;
let canRoll = true;

let timesPlayedSix = 0;


function getTransitionEndEventName() {
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



function initDice() {
    die.onclick = callRoll;

    const randomVal = Math.floor(Math.random() * 6);

    die.setAttribute("src", `./Roll_The_Dice/${dieImages[randomVal]}`);
}

function rollDice() {
    if (canRoll && !pause && turn >= 0) {

        canRoll = false;
        die.classList.add("spin");

        rollAud.play();

        setTimeout( f = function (iter = 0) {
            let rolling = Math.floor(Math.random() * 6);
            
            die.setAttribute("src", `./Roll_The_Dice/${dieImages[rolling]}`);

            if (iter < 4) {
                setTimeout(f, 100, iter + 1);

            } else {
                die.classList.remove("spin");
                dieRoll = rolling + 1;
                useRolled(dieRoll);
            }
        }, 300);
    }
}

function useRolled(value){
    canRoll = false;
    if (
        (value < 6 && !outPieces(activeColor).length)
        || (value == 6 && timesPlayedSix == 2)
    ) {
        timesPlayedSix = 0;
        setTimeout(updateTurn, 500);

    } else {
        timesPlayedSix = (value == 6) ? timesPlayedSix + 1 : 0;

        playables(value, activeColor);
    }
}


function callRoll() {
    if (!bot) {
        rollDice();
    }
}
