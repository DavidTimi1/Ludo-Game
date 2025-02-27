let PLAYERS = [];
let MODE = null;
let CURRENT_STAGE = "init";

function getMode(){ return MODE }
function getPlayers(){ return PLAYERS }


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
            <button type="button" class="icon-btn bg-red-600 absolute top-1/2 -translate-y-1/2 left-[calc(100% + 5px)]">
                <i class="fa-solid fa-xmark></i>
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
    count = inputs.length;
    addPlayerBtn.hidden = addPlayerBtn.disabled = false;

    if (count < 3) return 
    
    inputs[count - 1].closest(".w-full").remove();
}

document.getElementById("registration-form")
.onsubmit = registerPlayers;

function registerPlayers(e){
    e.preventDefault();

    let form = e.target;
    GTG = false // NOT GOOD TO GO!!!
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
            color: allColors[i]
        })
    })

    if (GTG){
        // next process (start game)
        overlay(3);
        return
    }

    PLAYERS = []
}