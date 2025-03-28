import { playRoll } from "../audio";
import { getActivePlayer, outPieces, playables, turn, updateTurn } from "../script";
import { pausedGame } from "../settings";

const dieImages = ["dice-01.svg", "dice-02.svg", "dice-03.svg", "dice-04.svg", "dice-05.svg", "dice-06.svg"];
export const die = document.getElementById("die-1");

let dieRoll = null;

export let timesPlayedSix = 0, canRoll = true;


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

export const transitionEnd = getTransitionEndEventName();


export function rollDice() {
    if (canRoll && !pausedGame && turn >= 0) {

        canRoll = false;
        die.classList.add("spin");

        playRoll();

        let f;
        setTimeout( f = function (iter = 0) {
            let rolling = Math.floor(Math.random() * 6);
            
            die.setAttribute("src", `./Roll_The_Dice/${dieImages[rolling]}`);

            if (iter < 4) {
                setTimeout(f, 100, iter + 1);

            } else {
                die.classList.remove("spin");
                die.setAttribute("src", `./Roll_The_Dice/${dieImages[rolling]}`);
                dieRoll = rolling + 1;
                useRolled(dieRoll);
            }
        }, 300);
    }
}

function useRolled(value){
    canRoll = false;
    const activeColor = getActivePlayer().color;
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

export function initDice() {
    die.onclick = callRoll;
    const randomVal = Math.floor(Math.random() * 6);
    die.setAttribute("src", `./Roll_The_Dice/${dieImages[randomVal]}`);
}

function callRoll() {
    if (!getActivePlayer().isBot) {
        rollDice();
    }
}

export function setRoll(bool){
    canRoll = bool;
}