// add sounds and images
// settings panel
// 

import { playClick, playGlow, playSafe, playSelect, playSlide, playStop } from "./audio";
import { almostHome, initCell } from "./cells";
import { getPlayers } from "./pregame";
import { canRoll, die, rollDice, setRoll, timesPlayedSix, transitionEnd } from "./Roll_The_Dice/roll_dice";
import { pauseAll } from "./settings";


// object creator for ludo pieces
function Pieces(color) {
    this.id = null;
    this.color = color;
    this.pos = color + "house";
    this.out = this.done = false;
}

let leaderboard = [];
let colorboard = [];

const pauseBtn = document.getElementById("pause-all");
pauseBtn.onclick = pauseAll;
export let pausedGame = false;

// list of all the pieces
let allPieces = [];


let coloredPieces = color => allPieces.filter(p => p.color == color);

let redPieces = [];
let bluePieces = [];
let greenPieces = [];
let yellowPieces = [];

export let outPieces = color => getGroup(color).filter(p => p.out);
export let donePieces = color => getGroup(color).filter(p => p.done);


const getGroup = color => {
    switch (color) {
        case 'red': return redPieces;
        case 'blue': return bluePieces;
        case 'green': return greenPieces;
        case 'yellow': return yellowPieces;
    }
}

export const makePieces = () => {
    // for each color
    const colors = getPlayers().map(p => p.color);

    for (let color of colors) {
        // for all pieces in the colour group
        for (let j = 0; j < 4; j++) {
            // unstring to get each colour group
            let p = new Pieces(color);
            allPieces.push(p);
            p.id = color + "p" + j;

            // the visual representation of each piece
            // let imgStr = `<svg id=${p.id} class="all-pieces ${color}pieces z-10" height=${width} width=${width}>
            //     <circle style= 'cx: ${width / 2}px; cy: ${width / 2}px; r: ${width / 2 - 5}px; stroke: grey; stroke-width: 3px; fill: ${p.color};'/>
            // </svg>`;
            let imgStr = `<div id=${p.id} class="all-pieces ${color}pieces z-10 aspect-square rounded-full">
                <div class="aspect-square rounded-full w-full h-full" style="background-color:${p.color};">
                </div>
            </div>`;

            let pseudo = document.createElement("div"); pseudo.innerHTML = imgStr;

            // put all pieces in their houses
            document.getElementById(`${color}house${j}`).appendChild(pseudo.firstElementChild);
        }
    }

    redPieces = coloredPieces("red");
    bluePieces = coloredPieces("blue");
    greenPieces = coloredPieces("green");
    yellowPieces = coloredPieces("yellow");
}



// initailize the turn to a non-zero value
export let turn = -1;
let activePlayer;
export let getActivePlayer = _ => activePlayer;


export let AUTO = false;

let inputs = document.querySelectorAll(".register input");
let inputWrap = elem => elem.closest("label");



// to update the turn count
export function updateTurn() {
    const players = getPlayers();

    do {
        turn = (turn + 1) % players.length;

    } while ( donePieces(players[turn].color).length == 4);

    activePlayer = players[turn];
    const activeColor = activePlayer.color;

    const turnBanner = document.getElementById(`turn-div`);
    turnBanner.innerHTML = `${activePlayer.name}'s turn`;
    turnBanner.style.color = activeColor;

    // open the next players turn
    document.querySelector(`.player-card[data-colgroup="${activeColor}"] .dice-wrapper`).appendChild(die);

    setRoll(true)

    if (activePlayer.isBot)
        setTimeout(rollDice, 500);
}


let canPlay = false;

// check whether the selected piece can be played
export const playables = (roll, color) => {
    let colP = getGroup(color), canBePlayed = [];
    canPlay = true;

    // if computer is to play
    const isBot = activePlayer.isBot;
    const activeColor = activePlayer.color;

    let done = false, e;

    // iterate through all the pieces in the colour group
    for (let seed of colP) {
        // let seedId = colP[g].id;
        // let seedLoc = colP[g].pos;
        let playable = false;

        if (seed.pos == color + "house" && !seed.out) {
            if (roll == 6) {
                // if the piece is in the colour house and  six was rolled
                playable = true;
                canBePlayed.push(seed);
            }

        } else if (!seed.pos.includes("finish") || !seed.done) {
            if (!seed.pos.includes("Spec")) {
                playable = true;
                canBePlayed.push(seed);

            } else {
                let x = eval(seed.pos.split(color)[1]);
                let y = x + roll;
                if (y <= 6) {
                    playable = true;
                    canBePlayed.push(seed);
                }
            }
        }

        if (playable){
            document.getElementById(seed.id).classList.add("glow");
        }
    }

    if (canBePlayed.length) {

        // if a user is to play and auto play is off
        if (!isBot && !AUTO){
            playGlow();

            canBePlayed.forEach( seed => {
                const seedElem = document.getElementById(seed.id);
    
                seedElem.addEventListener('click', e = () => {
                    // if it is side's turn
                    if (seed.id.includes(activeColor) && canPlay) {
                        playSelect();
                        play(roll, seed);
                        
                        canBePlayed.map( a => document.getElementById(`${a.id}`)).forEach(b => removeEventListener('click', b))
                    }
                }, {once: true})
        })

        } else {
            if (canBePlayed.length === 1) {
                play(roll, canBePlayed[0]);
                done = true;

            } else {
                // checking for duplicacy of positions
                for (let p = 1; p < canBePlayed.length; p++) {
                    let any = canBePlayed[p], standard = canBePlayed[0];

                    if (any.pos == standard.pos) {
                        if (p != canBePlayed.length - 1)
                            continue;

                        play(roll, standard);
                        done = true;
                    } else break;
                }
            }

            // analyse computer's play
            if (isBot && !done) {
                let playZone = [];
                let rolled = roll;

                for (let q = 0; q < canBePlayed.length; q++) {
                    let seed = canBePlayed[q];

                    // house
                    // capture
                    // finish
                    // unsafe pieces
                    // safe

                    if (seed.pos == color + "house")
                        playZone.push("house");

                    else {
                        // if in the special series
                        if (seed.pos.includes("Spec")) {
                            let foreTell = eval(seed.pos.split(color)[1]) + rolled;

                            playZone.push(foreTell < 6 ? "safe" : "finish");
                        } else {
                            let sum = eval(seed.pos.split("cell")[1]) + rolled, oth = sum > 52 ? sum - 52 : sum

                            if (document.getElementById(`cell${oth}`).classList.contains("occupied")
                                && !document.getElementById(`cell${oth}`).classList.contains(`${color}p`)
                            ) {
                                playZone.push("capture");

                            } else if ((sum > almostHome[color] && sum < initCell[color] + rolled) || (color == "green" && sum > 51)) {
                                const dist = sum - almostHome[color];

                                playZone.push(dist < 6 ? "safe" : "finish");
                            } else if (document.getElementById(`${seed.pos}`).classList.contains("safe")) {
                                playZone.push("safe");
                            } else {
                                playZone.push("unsafe");
                            }
                        }
                    }
                }

                let index;
                if (playZone.includes("house")) {
                    index = playZone.lastIndexOf("house");
                } else if (playZone.includes("capture")) {
                    index = playZone.lastIndexOf("capture");
                } else if (playZone.includes("finish")) {
                    index = playZone.lastIndexOf("finish");
                } else if (playZone.includes("unsafe")) {
                    index = playZone.lastIndexOf("unsafe");
                } else {
                    index = playZone.lastIndexOf("safe");
                }

                play(roll, canBePlayed[index]);

            }

        }
    } else {
        setTimeout(updateTurn, 500);
    }

}


const play = (roll, piece) => {
    let ID = piece.id;
    let gps = piece.pos;
    let side = piece.color;
    let repeat = roll === 6;
    
    let groupHome = document.querySelector(`#cell${initCell[side]}`);

    let pieceElem = document.getElementById(`${ID}`);
    let dest, destElem;

    // iterate through all the pieces in the colour group
    if (roll < 6 && !piece.out)
        return;

    if (gps == `${side}house` && repeat) {
        piece.out = true;
        const startPos = pieceElem.getBoundingClientRect();
        const endPos = groupHome.getBoundingClientRect();
        
        let done = false;

        const pluto =() => {
            if (done) return

            done = true;
            groupHome.appendChild(pieceElem);
            pieceElem.style.position = pieceElem.style.top = pieceElem.style.left = '';

            const lastMove = groupHome.id;
            // arrangePile(lastMove);
            piece.pos = groupHome.id;

            if (timesPlayedSix || repeat) {
                repeat = false;
                setRoll(true);

                if (activePlayer.isBot)
                    setTimeout(rollDice, 1000);
            }
        }

        setTimeout(() => {
            pieceElem.style.left = (endPos.x - startPos.x) + "px";
            pieceElem.style.top = (endPos.y - startPos.y) + "px";

            // failsafe
            setTimeout(pluto, 500);
        });

        playSafe()

    } else {
        // check for stacks of pieces on top of each other
        let stackLength = document.querySelectorAll(`#${gps} .${side}pieces`).length;
        if (stackLength == 1) {
            document.getElementById(gps).classList.remove(`${side}p`, "occupied");
        } else if (stackLength == 2) {
            document.getElementById(gps).classList.remove(`${side}block`, 'block');
        }

        let cont = document.getElementById(gps);
        let cellNo = eval(gps.split(gps.includes("Spec") ? side : "cell")[1]);

        dest = getDestination(piece, cellNo, roll);

        destElem = document.getElementById(dest);

        let moved = false;
        
        // visually move the piece
        move(pieceElem, side, cont, destElem)
        
        const pluto = () => {
            if (moved) return

            moved = true;
            setTimeout(() => {
                destElem.appendChild(pieceElem);
                pieceElem.style.position = pieceElem.style.top = pieceElem.style.left = '';
            })


            // arrange the last pile
            // arrangePile(gps);

            piece.pos = dest;

            if (destElem.classList.contains("safe")) {
                // arrange the new pile
                playSafe();
                // arrangePile(dest);
            } else {
                // if not a safe zone
                let curSide = side + "p";

                // if a piece already lives there
                if (destElem.classList.contains("occupied")) {
                    // same group? form a block
                    if (destElem.classList.contains(curSide)) {
                        destElem.classList.add(`${side}block`, "block");

                        playSafe();

                        // not the same group and a bock exists? back to base
                    } else if (destElem.classList.contains("block")) {
                        goBack(piece);

                        // this means of a different group send to its base
                    } else {
                        repeat = true;
                        let capParts = destElem.getElementsByClassName("all-pieces")[0].id.split("p");
                        destElem.classList.remove(capParts[0] + "p");
                        destElem.classList.add(curSide);

                        // send back to base
                        goBack(getGroup(capParts[0])[capParts[1]]);
                    }

                } else {
                    destElem.classList.add("occupied", curSide);
                    playStop();
                }
            }

            // arrangePile(dest);
            if (destElem.classList.contains("finish")) {
                piece.pos = "finish";
                safeAud.play();
                if (donePieces(side).length == 4)
                    winner(side);
            }

            if (timesPlayedSix || repeat) {
                setRoll(true);

                if (activePlayer.isBot)
                    setTimeout(rollDice, 500);
            } else
                updateTurn();
        };

        addEventListener('transitionsEnded', pluto, { once: true });

    }

    document.querySelectorAll(".all-pieces.glow").forEach(g => {
        g.classList.remove("glow")
    });

    canPlay = false;
}


function arrangePile(address, item) {
    let arr, cell;
    if (arguments.length > 1) {
        cell = document.getElementById(`cell1`);
        arr = [item];
    } else {
        cell = document.getElementById(address);
        arr = cell.getElementsByClassName("all-pieces");
    }

    for (let piece of arr)
        piece.classList.add("no-trans");

    let len = arr.length;

    let cellWidth = cell.clientWidth - 7;
    if (len == 1) {
        arr[0].style.height = `${cellWidth}px`;
        arr[0].style.width = `${cellWidth}px`;
        arr[0].children[0].style.strokeWidth = "3px";
        arr[0].children[0].style.r = `${(cellWidth / 2) - 5}px`;
        arr[0].children[0].style.cx = `${cellWidth / 2}px`;
        arr[0].children[0].style.cy = `${cellWidth / 2}px`;

    } else {

        for (let i = 0; i < len; i++) {
            if (len == 3 && i == 2) {
                arr[i].style.width = `${cellWidth}px`;
                arr[i].children[0].style.cx = `${cellWidth / 2}px`;
            } else {
                arr[i].style.width = `${cellWidth / 2}px`;
                if (i % 2) {
                    arr[i].children[0].style.cx = `${cellWidth * 0.25}px`;
                } else {
                    arr[i].children[0].style.cx = `${cellWidth * 0.25}px`;
                }
            }
            if (i < 2) {
                arr[i].children[0].style.cy = `${cellWidth * 0.25}px`;
            } else {
                arr[i].children[0].style.cy = `${cellWidth * 0.25}px`;
            }
            arr[i].children[0].style.strokeWidth = "2px";
            arr[i].style.height = `${cellWidth / 2}px`;
            arr[i].children[0].style.r = `${(cellWidth / 4) - 3}px`;
        }


    }


    for (let piece of arr)
        piece.classList.remove("no-trans");
}

function move(pieceElem, color, orignElem, destElem){
    const startPos = orignElem.getBoundingClientRect();
    translateTo(Cell(orignElem).getNext(color));

    function translateTo(next){
        let nextElem = document.querySelector(next);
        const nextPos =  nextElem.getBoundingClientRect();
        
        let transitioned = false;
        const transitionPiece = () => {
            if (transitioned) return;
            transitioned = true;

            if (destElem != nextElem){
                // after transition move to next
                return translateTo(Cell(nextElem).getNext(color))
            }
            dispatchEvent(new Event('transitionsEnded'));
        }

        setTimeout(transitionPiece, 400);
        pieceElem.addEventListener(transitionEnd, transitionPiece, { once: true })

        // move to positon
        pieceElem.style.left = (nextPos.x - startPos.x) + "px";
        pieceElem.style.top = (nextPos.y - startPos.y) + "px";
    }

    function Cell(elem){
        return elem.cell
    }
}

function goBack(obj) {
    const {pos, id, color} = obj;
    let orignElem = document.getElementById(pos), pieceElem = document.getElementById(id);
    const startPos = orignElem.getBoundingClientRect();
    
    playCapture();
    translateTo(`#${color}house${id.slice(-1)}`);

    function translateTo(prev){
        let prevElem = document.querySelector(prev);
        const prevPos = prevElem.getBoundingClientRect();
        
        let transitioned = false;
        const transitionPiece = () => {
            if (transitioned) return;
            transitioned = true;
            
            dispatchEvent(new Event('transitionsEnded'));
        }

        setTimeout(transitionPiece, 400);
        pieceElem.addEventListener(transitionEnd, transitionPiece, { once: true });

        // move to positon
        pieceElem.style.left = (prevPos.x - startPos.x) + "px";
        pieceElem.style.top = (prevPos.y - startPos.y) + "px";
    }
}


function getDestination(item, prevPos, count) {
    let itemLoc = item.pos;
    let itemCol = item.color;

    if (itemLoc.includes("Spec")) {
        let newPos = prevPos + count;
        if (newPos == 6){
            // add to finish
            item.out = false;
            item.done = true;
        }
        
        return (`cellSpec${itemCol}${newPos}`);

    }
    // else
    let c = prevPos + count;

    if ((c > almostHome[itemCol] && prevPos < initCell[itemCol]) || (itemCol == "green" && c > 51)) {
        let newGps = c - almostHome[itemCol];

        if (newGps == 6){
            // else add to finish
            item.out = false;
            item.done = true;
        }

        return `cellSpec${itemCol}${newGps}`;
    }
    // else
    c = c > 52 ? c - 52 : c;
    return `cell${c}`;
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


const restartGame = () => {
    turn = -1;
    clearAll();
    closeOverlays();
    pauseBtn.classList.remove("invisible");
    setRoll(true);
    rollDice();
}

const verify = func => {
    playClick();
    pausedGame = true;
    pauseBtn.classList.add("invisible");
    document.getElementById("pause-overlay").classList.add("hidden");
    document.getElementById("store-act").innerHTML = func;
    document.getElementsByClassName("Overlay")[0].classList.remove("hidden");
    document.getElementById("verify-overlay").classList.remove("hidden");
}

const winner = color => {
    // when someone completes his pieces
    let overlay = document.getElementById("winner-overlay");
    pausedGame = true;
    pauseBtn.classList.add("invisible");
    const colors = getPlayers().map(p => p.color);

    // add to the leaderboard
    colorboard.push(color);
    let playerName = document.querySelector(`#p-${color}-turn .player-name`).innerText;
    leaderboard.push(playerName);

    let ranks = overlay.getElementsByClassName("rank");

    let unranked = overlay.getElementsByClassName("fa-ul")[0];
    unranked.innerHTML = "";

    let options = overlay.getElementsByTagName("button");
    for (let option of options) option.classList.add("hidden");

    let overOptions = overlay.querySelectorAll("button.over");
    let pausedOptions = overlay.querySelectorAll("button.paused");
    let head = document.getElementById("situation");

    // if there is only one other person not on the leaderboard, he is last
    if (colors.length - leaderboard.length == 1) {
        overOptions.forEach(option => {
            option.classList.remove("hidden");
        });
        head.innerText = "Game Over"

        // check for the remaining player
        for (let color of colors) {
            if (!colorboard.includes(color)) {
                // add the last player to the end of the ranking
                colorboard.push(color);
                let pName = document.querySelector(`#p-${color}-turn .player-name`).innerText;
                leaderboard.push(pName);
            }
        }

    } else {
        pausedOptions.forEach(option => {
            option.classList.remove("hidden");
        });
        head.innerText = "Paused";

        let notRanked = colors.filter(c => !colorboard.includes(c));
        for (let color of notRanked) {
            pausedGame = false;
            let playerName = document.querySelector(`#p-${color}-turn .player-name`).innerText;
            unranked.insertAdjacentHTML("beforeend",
                `<li style="color: ${color};">
                    <span class="fa-li">
                    <i style="color: ${colors[i]};" class="fa-solid fa-spinner fa-pulse"></i>
                    </span>${playerName}
                </li>`
            );
        }
    }

    for (let i = 0; i < leaderboard.length; i++) {
        ranks[i].innerText = leaderboard[i];
        ranks[i].style.color = colorboard[i];
        ranks[i].classList.remove("hidden");
    }

    document.getElementsByClassName("Overlay").classList.remove("hidden");
    document.getElementById("winner-overlay").classList.remove("hidden");
}


const vertAction = () => {
    playClick();
    pausedGame = false;
    document.getElementsByClassName("Overlay").classList.add("hidden");
    document.getElementById("verify-overlay").classList.add("hidden");
    let action = document.getElementById("store-act").innerHTML;
    eval(action);
}


const closeVert = () => {
    playClick();
    document.getElementById("store-act").innerHTML = "";
    closeOverlays();

    pausedGame = false;
    pauseBtn.classList.remove("invisible");
    
    if (activePlayer.isBot) setTimeout(rollDice, 500);
}


const resume = () => {
    playClick();
    closeOverlays();
    pausedGame = false;
    pauseBtn.classList.remove("invisible");

    if (activePlayer.isBot) setTimeout(rollDice, 500);
}


function closeOverlays() {
    ["#winner-overlay", "#pause-overlay", "#verify-overlay", ".Overlay"]
        .forEach(str => document.querySelector(str).classList.add("hidden"))
}

