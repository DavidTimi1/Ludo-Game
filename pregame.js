import { playClick, playError } from "./audio";
import { allColors } from "./cells";
import { initDice } from "./Roll_The_Dice/roll_dice";
import { makePieces, updateTurn } from "./script";
import { toggleSettings } from "./settings";

let PLAYERS = [];
let MODE = null;
let CURRENT_STAGE = "init";

export function getMode(){ return MODE }
export function getPlayers(){ return PLAYERS }


const flow = ["init", "mode", "players"];


const MODES = ["friends", "online", "pass", "computer"]

document.querySelectorAll("button[data-mode]")
.forEach( btn => {
    btn.onclick = () => {
        if (MODE === null){
            setMode(btn);
        }
    }
})

function setMode(btn){
    const {dataset: {mode}} = btn;

    if (MODES.includes(mode)){
        MODE = mode;

        // next registration process
        overlay(2)
    }
}


const addPlayerBtn = document.getElementById("add-player");
addPlayerBtn.onclick = addPlayer;

function addPlayer(e){
    const count = document.getElementById("registration-form").querySelectorAll("input:not(:disabled)").length;
    if (count > 3) return 

    
    const tmp = document.createElement("div");
    tmp.className = "w-full";
    tmp.insertAdjacentHTML('beforeend', `
            <label class="nameInput flex align-center justify-center gap-2 focus-within:border-yellow-600 border rounded-xl bg-slate-800">
                <div class="usr-icon w-7 aspect-square rounded-full"></div>
                <input type="text" class="xinput bg-inherit outline-none border-none" placeholder="Player ${count + 1} Name" value="BOT" autocapitalize="characters" maxlength="15">
            </label>
            <button type="button" class="icon-btn bg-red-600 absolute top-1/2 -translate-y-1/2 left-full">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `)
    
    tmp.getElementsByTagName("button")[0].onclick = removePlayer;        
    
    addPlayerBtn.insertAdjacentElement("beforebegin", tmp);
    
    if (count === 3){
        addPlayerBtn.hidden = addPlayerBtn.disabled = true;
    }
}


function removePlayer(e){
    e.stopPropagation();

    const inputs = document.querySelectorAll("#registration-form .nameInput:not( :disabled)");
    const count = inputs.length;
    addPlayerBtn.hidden = addPlayerBtn.disabled = false;

    if (count < 3) return 
    
    inputs[count - 1].closest(".w-full").remove();
}

document.getElementById("registration-form")
.onsubmit = registerPlayers;

function registerPlayers(e){
    e.preventDefault();

    let form = e.target, GTG = false // NOT GOOD TO GO!!!
    const errorElem = document.getElementById("reg-error");
    
    let usedNames = [];
    let allBots = true;

    // ensure all player names are validly filled
    const submitted = form.querySelectorAll("input:not(:disabled)"), len = submitted.length;

    submitted.forEach( (input, i) => {
        const name = input.value || "BOT";

        // if there are player name errors don't show gameboard
        if (name == "BOT") {

            if (i == len - 1 && allBots) {
                errorElem.hidden = false;
                errorElem.innerText = "There must be at least 1 User Player";
                playError();
                return;
            }

        } else {
            if (usedNames.includes(name)) {
                errorElem.hidden = false;
                errorElem.innerText = "Two players cannot have same name";
                playError();
                return;
            }

            allBots = false;
            usedNames.push(name);
        }

        GTG = i === len-1;
        
        PLAYERS.push({
            name: input.value,
            icon: "BOT" ? robotIcon : playerIcon,
            color: allColors[i],
            isBot: name === "BOT",
        })
    })

    if (GTG){
        // next process (start game)
        overlay(3);
        return
    }

    PLAYERS = []
}


const robotIcon = `<i class="fa-solid fa-robot"></i>`;
const playerIcon = `<i class="fa-solid fa-user"></i>`
const iconSpaces = document.getElementsByClassName("user-icon");


let playersNo = n => {

    // when registration is ongoing
    for (let i = 0; i < inputs.length; i++) {
        let inp = inputs[i];
        // change colour of the registration field
        let color = inp.classList[0];

        // for number of selected players
        if (!inputWrap(inp).classList.contains("hidden")) {
            inp.classList.add("valid");

            inp.onfocus = ev => {
                if (inp.value == "BOT") {
                    inp.value = "";
                    iconSpaces[i].innerHTML = playerIcon;
                    iconSpaces[i].childNodes[0].style.color = color;
                }
            }

            inp.onblur = ev => {
                if (!inp.value) {
                    inp.value = "BOT";
                    iconSpaces[i].innerHTML = robotIcon;
                    iconSpaces[i].childNodes[0].style.color = color;
                }
            }
            addEventListener('close reg', () => { inp.onblur = inp.onfocus = null }, { once: true })
        }
    }
}


document.getElementById('init-btn').onclick = () => {overlay(1)};

const overlay = count => {
    // when switching between overlays
    // if this is the lst overlay
    if (count != 3) {
        playClick();
        document.getElementsByClassName(`_${count - 1}`)[0].classList.add("hidden");
        document.getElementsByClassName(`_${count}`)[0].classList.remove("hidden");

        if (count != 2) dispatchEvent(new Event('close reg'))

    } else {
        // show players cards
        const players = getPlayers();

        for (let p of players){
            const {name, color, icon} = p;
            const card = document.querySelector(`.player-card[data-colgroup="${color}"]`);
            
            card.getElementsByClassName("p-name")[0].innerHTML = name;
            card.getElementsByClassName("p-icon")[0].innerHTML = icon;
        }

        const pauseBtn = document.getElementById("pause-all");
        pauseBtn.classList.remove("invisible");
        makePieces();

        // show the gameboard
        document.getElementsByClassName(`_${count - 1}`)[0].classList.add("hidden");
        document.getElementsByClassName(`_${count}`)[0].classList.remove("invisible");
        document.getElementById("preGame-overlay").classList.add("hidden");
   
        initDice()
        updateTurn();
        
    }

}