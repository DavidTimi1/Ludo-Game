// add sounds and images
// settings panel
// 

// object creator for ludo pieces
function Pieces(color) {
    this.id = null;
    this.color = color;
    this.pos = color + "house";
    this.out = this.done = false;
}

let leaderboard = [];
let colorboard = [];

// available colours
let colors = [];

const pauseBtn = document.getElementById("pause-all");

// the width and height of all the playable cells
let width = document.querySelector("#cell1").getBoundingClientRect().width - 5;

// list of all the pieces
let allPieces = [];


let coloredPieces = color => allPieces.filter(p => p.color == color);

let redPieces = [];
let bluePieces = [];
let greenPieces = [];
let yellowPieces = [];

let outPieces = color => getGroup(color).filter(p => p.out)
let donePieces = color => getGroup(color).filter(p => p.done)


let getGroup = color => {
    switch (color) {
        case 'red': return redPieces;
        case 'blue': return bluePieces;
        case 'green': return greenPieces;
        case 'yellow': return yellowPieces;
    }
}

let makePieces = () => {
    // for each color
    for (let color of colors) {
        // for all pieces in the colour group
        for (let j = 0; j < 4; j++) {
            // unstring to get each colour group
            let p = new Pieces(color);
            allPieces.push(p);
            p.id = color + "p" + j;

            // the visual representation of each piece
            let imgStr = `<svg id=${p.id} class="all-pieces ${color}pieces" height=${width} width=${width}>
                <circle style= 'cx: ${width / 2}px; cy: ${width / 2}px; r: ${width / 2 - 5}px; stroke: grey; stroke-width: 3px; fill: ${p.color};'/>
            </svg>`;

            let pseudo = document.createElement("div"); pseudo.innerHTML = imgStr;

            // put all pieces in their houses
            document.getElementById(`${color}house`).appendChild(pseudo.firstElementChild);
        }
    }

    redPieces = coloredPieces("red");
    bluePieces = coloredPieces("blue");
    greenPieces = coloredPieces("green");
    yellowPieces = coloredPieces("yellow");
}





// initailize the turn to a non-zero value
let turn = -1;
let activeColor;
let activePlayer;


let N_O_P, AUTO = true;


let overlay = count => {
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
        N_O_P = players.length;

        for (let p of players){
            const {name, color, icon} = p;
            const card = document.querySelector(`.player-card[data-colgroup="${color}"]`);
            
            card.getElementsByClassName("p-name")[0].innerHTML = name;
            card.getElementsByClassName("p-icon")[0].innerHTML = icon;
        }

        pauseBtn.classList.remove("invisible");
        colors = players.map( p => p.color);
        makePieces();

        // show the gameboard
        document.getElementsByClassName(`_${count - 1}`)[0].classList.add("hidden");
        document.getElementsByClassName(`_${count}`)[0].classList.remove("invisible");
        document.getElementById("preGame-overlay").classList.add("hidden");
   
        initDice()
        updateTurn();
        
    }

}


let inputs = document.querySelectorAll(".register input");
let inputWrap = elem => elem.closest("label");
let robotIcon = `<i class="fa-solid fa-robot"></i>`;
let playerIcon = `<i class="fa-solid fa-user"></i>`
let iconSpaces = document.getElementsByClassName("user-icon");


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



let bot = false;

// to update the turn count
function updateTurn() {
    const players = getPlayers();

    do {
        turn = (turn + 1) % N_O_P;

    } while ( donePieces(players[turn].color).length == 4);

    activePlayer = players[turn];
    activeColor = activePlayer.color;

    const turnBanner = document.getElementById(`turn-div`);
    turnBanner.innerHTML = `${activePlayer.name}'s turn`;
    turnBanner.style.color = activeColor;

    // open the next players turn
    document.querySelector(`.player-card[data-colgroup="${activeColor}"] .dice-wrapper`).appendChild(die);

    setTimeout(function () {
        if (activePlayer.name === "BOT") {
            bot = can = true;
            rollDice();
            
        } else {
            can = true;
            bot = false;
        }
    }, 1500);
}



let halt = false;

// check whether the selected piece can be played
let playables = (roll, color) => {
    let colP = getGroup(color), canPlay = [];
    halt = false;

    let done = bot = false;

    // iterate through all the pieces in the colour group
    for (let seed of colP) {
        // let seedId = colP[g].id;
        // let seedLoc = colP[g].pos;

        let seedElem = document.getElementById(`${seed.id}`).children[0];
        let glow = false;

        if (seed.pos == color + "house" && !seed.out) {
            if (roll == 6) {
                // if the piece is in the colour house and  six was rolled
                glow = true;
                canPlay.push(seed);
            }
        } else if (!seed.pos.includes("finish") || !seed.done) {
            if (!seed.pos.includes("Spec")) {
                glow = true;
                canPlay.push(seed);
            } else {
                let x = eval(seed.pos.split(color)[1]);
                let y = x + roll;
                if (y <= 6) {
                    glow = true;
                    canPlay.push(seed);
                }
            }
        }

        if (glow) {
            seedElem.classList.add("glow");

            // document.getElementById("store").innerHTML = this;
            document.getElementById(`${seed.id}`).addEventListener('click', function e() {
                // if it is side's turn
                if (seed.id.includes(activeColor) && !halt) {
                    playSelect();
                    play(eval(document.getElementById("store-roll").innerHTML), seed);
                }
            });
        }
    }

    if (canPlay.length) {
        // if computer is to play
        if (activePlayer == "BOT") bot = true;

        // if a user is to play and auto play is off
        if (!bot && !AUTO)
            glowAud.play();

        else if (!halt) {
            if (canPlay.length == 1) {
                play(eval(document.getElementById("store-roll").innerHTML), canPlay[0]);
                done = true;

            } else {
                // checking for duplicacy of positions
                for (let p = 1; p < canPlay.length; p++) {
                    let any = canPlay[p], standard = canPlay[0];

                    if (any.pos == standard.pos) {
                        if (p != canPlay.length - 1)
                            continue;

                        play(eval(document.getElementById("store-roll").innerHTML), standard);
                        done = true;
                    } else break;
                }
                if (!done && !bot) {
                    glowAud.play();
                }
            }

            // analyse computer's play
            if (bot && !done) {
                let playZone = [];
                let rolled = eval(document.getElementById("store-roll").innerHTML);

                for (let q = 0; q < canPlay.length; q++) {
                    let seed = canPlay[q];

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
                                dist = sum - almostHome[color];

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
                play(rolled, canPlay[index]);
            }

        }
    } else {
        setTimeout(updateTurn, 1000);
    }
}


let selected = null;
let repeat = false;

let play = (roll, piece) => {
    let ID = piece.id;
    let gps = piece.pos;
    let side = piece.color;
    
    let groupHome = document.querySelector(`#cell${initCell[side]}`);

    let pieceElem = document.getElementById(`${ID}`);
    let lastMove, dest, destElem;

    // iterate through all the pieces in the colour group
    if (roll < 6 && !piece.out)
        return;

    if (roll == 6) repeat = true;

    if (gps == `${side}house`) {
        piece.out = true;
        pieceElem.classList.add("no-trans");

        pieceElem.style.position = "absolute";
        pieceElem.style.top = pieceElem.getBoundingClientRect().y + "px";
        pieceElem.style.left = pieceElem.getBoundingClientRect().x + "px";

        pieceElem.classList.remove("no-trans");

        pieceElem.style.left = groupHome.getBoundingClientRect().x + "px";
        pieceElem.style.top = groupHome.getBoundingClientRect().y + "px";

        safeAud.play();

        let done = false;

        addEventListener('transitionsEnded', pluto, { once: true })
        // failsafe
        setTimeout(pluto, 500);

        function pluto() {
            if (done) return

            done = true;
            pieceElem.classList.add("no-trans");
            pieceElem.style.position = pieceElem.style.top = pieceElem.style.left = "";

            groupHome.appendChild(pieceElem);
            lastMove = groupHome.id;
            arrangePile(lastMove);
            piece.pos = groupHome.id;


            if (repeat) {
                let store = document.getElementById("store");
                store.innerHTML = store.innerHTML == 1 ? 2 : 1;

                repeat = false;

                can = true;
                if (activePlayer == "BOT")
                    setTimeout(rollDice, 1000);
            }
        }

    } else {
        // check for stacks of pieces on top of each other
        let stackLength = document.querySelectorAll(`#${gps} .${side}pieces`).length;
        if (stackLength == 1) {
            document.getElementById(gps).classList.remove(`${side}p`, "occupied");
        } else if (stackLength == 2) {
            document.getElementById(gps).classList.remove(`${side}block`, 'block');
        }

        pieceElem.classList.add("no-trans");

        let cont = document.getElementById(gps), contPos = cont.getBoundingClientRect();
        let cellNo = eval(gps.split(gps.includes("Spec") ? side : "cell")[1]);

        // set initial position 
        pieceElem.style.position = "absolute";
        pieceElem.style.top = contPos.y + "px";
        pieceElem.style.left = contPos.x + "px";
        pieceElem.classList.remove("no-trans");

        slideAud.play();
        dest = getDestination(piece, cellNo, roll);

        destElem = document.getElementById(dest);

        let moved = false;
        
        // visually move the piece
        move(pieceElem, side, cont, destElem)

        addEventListener('transitionsEnded', pluto, { once: true })
        // failsafe
        // setTimeout(pluto, 500);


        function pluto() {
            if (moved) return

            moved = true;
            pieceElem.classList.add("no-trans");
            destElem.appendChild(pieceElem);

            pieceElem.style.position = pieceElem.style.top = pieceElem.style.left = "";

            // arrange the last pile
            arrangePile(gps);

            piece.pos = dest;

            slideAud.pause();
            slideAud.currentTime = 0;

            if (destElem.classList.contains("safe")) {
                // arrange the new pile
                safeAud.play();
                arrangePile(dest);
            } else {
                // if not a safe zone
                let curSide = side + "p";

                // if a piece already lives there
                if (destElem.classList.contains("occupied")) {
                    // same group? form a block
                    if (destElem.classList.contains(curSide)) {
                        destElem.classList.add(`${side}block`, "block");

                        safeAud.play();

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
                    outAud.play();
                }
            }

            arrangePile(dest);
            if (destElem.classList.contains("finish")) {
                piece.pos = "finish";
                safeAud.play();
                if (donePieces(side).length == 4)
                    winner(side);
            }

            if (repeat) {
                let store = document.getElementById("store");
                store.innerHTML = store.innerHTML == 1 ? 2 : 1;

                repeat = false;

                can = true;
                if (activePlayer == "BOT")
                    setTimeout(rollDice, 1000);
            } else
                updateTurn();
        };
    }

    document.querySelectorAll(".all-pieces .glow").forEach(g => g.classList.remove("glow"));

    halt = true;
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
    // // if on same line of movement
    // if (orignElem.dataset.move == destElem.dataset.move){
    //     pieceElem.style.left = destElem.getBoundingClientRect().x + "px";
    //     pieceElem.style.top = destElem.getBoundingClientRect().y + "px";
    //     dispatchEvent(new Event('transitionsEnded'));

    // } else {
    //     if (destElem.dataset.move == "hor") {
    //         pieceElem.style.top = destElem.getBoundingClientRect().y + "px";

    //         pieceElem.addEventListener(transitionEnd, () => {
    //             pieceElem.style.left = destElem.getBoundingClientRect().x + "px";
    //             pieceElem.addEventListener(transitionEnd, () => {
    //                 pieceElem.style.top = destElem.getBoundingClientRect().y + "px";
    //                 dispatchEvent(new Event('transitionsEnded'));
    //             }, { once: true })
    //         }, { once: true })
    //     } else {
    //         pieceElem.style.left = destElem.getBoundingClientRect().x + "px";

    //         pieceElem.addEventListener(transitionEnd, () => {
    //             pieceElem.style.top = destElem.getBoundingClientRect().y + "px";
    //             pieceElem.addEventListener(transitionEnd, () => {
    //                 pieceElem.style.left = destElem.getBoundingClientRect().x + "px";
    //                 dispatchEvent(new Event('transitionsEnded'));
    //             }, { once: true })
    //         }, { once: true })
    //     }
    // }
    translateTo(Cell(orignElem).getNext(color));

    function translateTo(next){
        let nextElem = document.querySelector(next);

        // move to positon
        pieceElem.style.left = nextElem.getBoundingClientRect().x + "px";
        pieceElem.style.top = nextElem.getBoundingClientRect().y + "px";

        pieceElem.addEventListener(transitionEnd, () => {
            if (destElem != nextElem){
                // after transition move to next
                return translateTo(Cell(nextElem).getNext(color))
            }
            dispatchEvent(new Event('transitionsEnded'));
        }, { once: true })

    }

    function Cell(elem){
        return elem.cell
    }
}

function goBack(obj) {
    const {pos, id, color} = obj;
    let orignElem = document.getElementById(pos), pieceElem = document.getElementById(id);
    
    playCapture();
    translateTo(Cell(orignElem).getPrev(color));


    function translateTo(prev){
        let prevElem = document.querySelector(prev ?? '');

        // move to positon
        pieceElem.style.left = prevElem.getBoundingClientRect().x + "px";
        pieceElem.style.top = prevElem.getBoundingClientRect().y + "px";

        pieceElem.addEventListener(transitionEnd, () => {
            if (prevElem != null){
                // after transition move to previous
                return translateTo(Cell(prevElem).getPrev(color))
            }
            dispatchEvent(new Event('transitionsEnded'));
        }, { once: true })

    }

    // let contPos = document.getElementById(tracker).getBoundingClientRect();
    // elem.style.position = "absolute";
    // elem.style.top = contPos.y + "px";
    // elem.style.left = contPos.x + "px";

    // elem.classList.remove("no-trans");

    // playCapture();

    // let tmp = document.getElementById(`${hue}span`).getBoundingClientRect();
    // elem.style.left = tmp.x + "px";
    // elem.style.top = tmp.y + "px";
    // elem.style.transitionDuration = '';

    // elem.addEventListener(transitionEnd, function () {
    //     document.getElementById(`${hue}house`).appendChild(elem);
    //     arrangePile(tracker);
    //     arrangePile(null, elem);

    //     elem.style.position = elem.style.top = elem.style.left = "";

    //     obj.out = false;
    //     obj.pos = `${hue}house`;
    // }, {once: true});
}


function getDestination(item, prevPos, count) {
    let itemId = item.id;
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


let clearAll = () => {
    turn = -1;
    for (let color of colors) {
        let group = getGroup(color)

        let allCells = document.getElementsByTagName("td");
        for (let cell of allCells)
            cell.classList.remove(`${color}p`, "occupied", `${color}block`, "block");

        for (let i = 0; i < 4; i++) {
            let p = document.getElementById(group[i].id);
            arrangePile(null, p);
            document.getElementById(`${color}house`).append(p);
            group[i].pos = color + "house";

            turnDivs[i].classList.add("hidden");
        }
    }
    document.getElementById("store").innerHTML = document.getElementById("store-roll").innerHTML = "";
}

let toMainMenu = () => {
    clearAll();
    closeOverlays();

    for (let color of colors) {
        document.getElementById(`${color}house`).innerHTML = `<span id="${color}span"></span>`;
    }
    inputs.forEach(inp => {
        inp.classList.remove("valid");
        inp.value = ""

        let wrap = inputWrap(inp);
        wrap.classList.remove("valid");
        wrap.classList.add("hidden");
    });

    for (let iconSpace of iconSpaces)
        iconSpace.classList.remove("valid");

    colors = [];
    can = true;
    document.getElementsByClassName("game-wrapper")[0].classList.add("invisible");
    document.getElementById("preGame-overlay").classList.remove("hidden");
    document.getElementsByClassName("_0")[0].classList.remove("hidden");
}


let pauseAll = () => {
    playClick();
    pause = true;
    pauseBtn.classList.add("invisible");
    document.getElementsByClassName("Overlay")[0].classList.remove("hidden");
    document.getElementById("pause-overlay").classList.remove("hidden");
}

let restartGame = () => {
    turn = -1;
    clearAll();
    closeOverlays();
    pauseBtn.classList.remove("invisible");
    can = true;
    rollDice();
}

let verify = func => {
    playClick();
    pause = true;
    pauseBtn.classList.add("invisible");
    document.getElementById("pause-overlay").classList.add("hidden");
    document.getElementById("store-act").innerHTML = func;
    document.getElementsByClassName("Overlay")[0].classList.remove("hidden");
    document.getElementById("verify-overlay").classList.remove("hidden");
}

let winner = color => {
    // when someone completes his pieces
    let overlay = document.getElementById("winner-overlay");
    pause = true;
    pauseBtn.classList.add("invisible");

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
            pause = false;
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


let vertAction = () => {
    playClick();
    pause = false;
    document.getElementsByClassName("Overlay").classList.add("hidden");
    document.getElementById("verify-overlay").classList.add("hidden");
    let action = document.getElementById("store-act").innerHTML;
    eval(action);
}


let closeVert = () => {
    playClick();
    document.getElementById("store-act").innerHTML = "";
    closeOverlays();

    pause = false;
    pauseBtn.classList.remove("invisible");
    if (bot)
        setTimeout(rollDice, 500);
}


let resume = () => {
    playClick();
    closeOverlays();
    pause = false;
    pauseBtn.classList.remove("invisible");

    if (bot)
        setTimeout(rollDice, 500);
}


function closeOverlays() {
    ["#winner-overlay", "#pause-overlay", "#verify-overlay", ".Overlay"]
        .forEach(str => document.querySelector(str).classList.add("hidden"))
}

