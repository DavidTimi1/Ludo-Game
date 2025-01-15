// add sounds and images
// settings panel
// 

// object creator for ludo pieces
function Pieces(color) {
    this.id = null;
    this.color = color;
    this.pos = color + "house";
}

let leaderboard = [];
let colorboard = [];

// available colours
let colors = [];
let redPieces = [];
let bluePieces = [];
let greenPieces = [];
let yellowPieces = [];

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

let pauseBut = document.getElementById("pause-all");

// the width and height of all the playable cells
let width = document.querySelector("#cell1").getBoundingClientRect().width - 5;

// list of all the pieces
let allPieces = [greenPieces, redPieces, bluePieces, yellowPieces];

let makePieces = _ => {
    // for each color
    for (let i = 0; i < colors.length; i++) {
        // for all pieces in the colour group
        for (let j = 0; j < 4; j++) {
            // unstring to get each colour group
            eval(`${colors[i]}Pieces`)[j] = new Pieces(colors[i]);
            eval(`${colors[i]}Pieces`)[j].id = colors[i] + "p" + j;
            // the visual representation of each piece
            eval(`${colors[i]}Pieces`)[j].img = `<svg id="${eval(`${colors[i]}Pieces`)[j].id}" class="all-pieces ${colors[i]}pieces" height="${width - 3}" width="${width - 3}" ">
                <circle style= 'cx: ${(width - 5) / 2}px; cy: ${(width - 5) / 2}px; r: ${width / 2 - 4}px; stroke: grey; stroke-width: 3px; fill: ${eval(`${colors[i]}Pieces`)[j].color};'/>
            </svg>`;

            // each colour group's home cell html element
            eval(`${colors[i]}Pieces`)[j].homeCell = document.querySelector(`.${colors[i]}.home-cell`);
            let homeCellNo = eval(document.querySelector(`.${colors[i]}.home-cell`).id.split("cell")[1]);

            // each colour group's cell number
            eval(`${colors[i]}Pieces`)[j].homeCellNo = homeCellNo;
            // if the colour group is green
            if (homeCellNo < 2) {
                eval(`${colors[i]}Pieces`)[j].homeCome = homeCellNo + 50;
            } else {
                // otherwise
                eval(`${colors[i]}Pieces`)[j].homeCome = homeCellNo - 2;
            }
            // put all pieces in their houses
            document.getElementById(`${colors[i]}house`).innerHTML += eval(`${colors[i]}Pieces`)[j].img;
        }
    }
}

let safeCells = document.querySelectorAll(".safe");
safeCells.forEach(cell => {
    if (cell.classList.contains("home-cell")) {
        // cell.style.backgroundImage = "url()"
    } else {
        let src = cell.classList[0];
        cell.style.backgroundImage = `url(${src}.png)`;
    }
});
let arrows = document.querySelectorAll(".home-come");
arrows.forEach(cell => {
    let src = cell.classList[0];
    cell.style.backgroundImage = `url(${src}.png)`;
});
let redOut = [false];
let greenOut = [false];
let blueOut = [false];
let yellowOut = [false];
let redDone = [];
let blueDone = [];
let yellowDone = [];
let greenDone = [];

// initailize the turn to a non-zero value
let turn = -1;
let activeColor;
let activePlayer;


let N_O_P;
let AUTO = true;
let players
let overlay = (count) => {
    // when switching between overlays
    // if this is the lst overlay
    if (count != 3) {
        clickAud.play();
    }
    if (count == 3) {
        let validInputs = document.querySelectorAll("input.valid");
        let usedNames = [];
        let allBots = true;
        // ensure al player names are validly filled
        for (let j = 0; j < validInputs.length; j++) {
            validInputs[j].value = validInputs[j].value.toUpperCase();
            // if there are player name errors don't show gameboard
            if (validInputs[j].value != "BOT") {
                if (!usedNames.includes(validInputs[j].value)) {
                    allBots = false;
                    usedNames.push(validInputs[j].value)
                } else {
                    document.getElementById("reg-error").innerText = "Two players cannot have same name";
                    errorAud.play();
                    return;
                }
            } else {
                if (j == validInputs.length - 1 && allBots) {
                    document.getElementById("reg-error").innerText = "There must be at least 1 User Player";
                    errorAud.play();
                    return;
                }
            }
            clickAud.play();
        }
        makePieces();
        // show the gameboard
        document.querySelector(`._${count - 1}`).classList.add("hide");
        document.querySelector(`._${count}`).classList.remove("invisible");
        document.getElementById("preGame-overlay").classList.add("hide");
        let validTD = document.querySelectorAll(".player-turn.valid");

        let index = 0;
        let visibleIcons = document.querySelectorAll(".user-icon.valid");
        document.querySelectorAll("input.valid").forEach(input => {
            players[index] = [input.value, visibleIcons[index].innerHTML];

            validTD[index].childNodes[1].childNodes[1].innerHTML = visibleIcons[index].innerHTML;
            validTD[index].childNodes[1].childNodes[3].innerHTML = input.value;

            index++;
        });
        pauseBut.style.display = "block";
        rollDice();
    } else {
        document.querySelector(`._${count - 1}`).classList.add("hide");
        document.querySelector(`._${count}`).classList.remove("hide");
    }

}


let inputs = document.querySelectorAll(".register input");
let inputWrap = document.querySelectorAll(".nameInput");
let robotIcon = `<i class="fa-solid fa-robot"></i>`;
let playerIcon = `<i class="fa-solid fa-user"></i>`
let iconSpaces = document.querySelectorAll(".user-icon");
let turnDivs = document.querySelectorAll(".player-turn");

let playersNo = (n) => {
    clickAud.play();
    // set the number if players chosen
    N_O_P = n;
    players = Array(N_O_P);
    // open the registration centre
    overlay(2);
    if (n == 4) {
        document.getElementsByClassName("register")[0].style.height = "50%";
    }

    for (let i = 0; i < n; i++) {
        let color = inputs[i].classList[0];
        // open name fields for the number of chosen players
        inputWrap[i].classList.remove("hide");
        turnDivs[i].classList.add("valid");
        colors.push(color);

        // if only two players
        if (n == 2 && i == 1) {
            // make the blue side the second player
            inputWrap[i].classList.add("hide");
            inputs[i + 1].placeholder = "Player 2 Name";
            inputWrap[i + 1].classList.remove("hide");
            iconSpaces[i + 1].classList.add("valid");

            turnDivs[i].classList.remove("valid");
            turnDivs[i + 1].classList.add("valid");

            colors.pop();
            colors.push("blue");
        } else {
            iconSpaces[i].classList.add("valid");
        }
    }
    let intervalId = setInterval(function () {
        // when registration is ongoing
        if (!document.querySelector(".register").classList.contains("hide")) {
            for (let i = 0; i < inputs.length; i++) {
                // change colour of the registration field
                let color = inputs[i].classList[0];
                // for number of selected players
                if (!inputWrap[i].classList.contains("hide")) {
                    inputs[i].classList.add("valid");
                    // if no name is entered in that field change the player to a robot
                    if (document.activeElement !== inputs[i] && inputs[i].value == 0) {
                        inputs[i].value = "BOT";
                        iconSpaces[i].innerHTML = robotIcon;
                        iconSpaces[i].childNodes[0].style.color = color;
                    } else if (document.activeElement == inputs[i] && inputs[i].value == "BOT") {
                        inputs[i].value = "";
                        iconSpaces[i].innerHTML = playerIcon;
                        iconSpaces[i].childNodes[0].style.color = color;
                    } else if (document.activeElement == inputs[i] && inputs[i].value.length > 12) {
                        let text = inputs[i].value;
                        inputs[i].value = text.slice(0, 12);
                    }
                }
            }
        } else {
            // once the registration portal is closed stop auto edits
            clearInterval(intervalId);
        }
    });
}



let bot = false;

let turnDiv;

// to update the turn count
function updateTurn() {
    if (turn != 0) {
        // close the ast player's turn
        let oldColor = activeColor;
        document.querySelector(`#p-${oldColor}-turn`).classList.add("hide");
    }
    turn = turn % N_O_P;
    while (eval(`${colors[turn]}Done`).length == 4) {
        turn++;
        turn = turn % N_O_P;
    }

    activePlayer = players[turn][0];
    activeColor = colors[turn];

    turnDiv = document.querySelector(`#p-${activeColor}-turn`);

    // open the next players turn
    document.querySelector(`.dice-wrapper.${activeColor}`).appendChild(document.querySelector("#die-1"));
    turnDiv.classList.remove("hide");

    setTimeout(function () {
        if (turnDiv.innerText == "BOT") {
            bot = true;
            can = true;
            rollDice();
        } else {
            can = true;
            bot = false;
        }
    }, 1250);
}


// let playHover = `<svg id="playHov" height="${height - 10}" width="${(height - 10)}" style="z-index: 20; position: absolute; top: 100px; left: 200px;">
// <circle cx="${(height - 10)/2}" cy="${(height - 10)/2}" r="${(height - 10)/2 - 2}" fill="black" />
// </svg>`;
// let captureHover = `<svg id="capHov" height="${width - 5}" width="${(width - 5)}" style="z-index: 20;">
// <circle cx="${(width - 6)/2}" cy="${(width - 6)/2}" r="${(width - 7)/2}" stroke="black" stroke-width="2" fill="none" />
// </svg>`;


let halt = false;

// check whether the selected piece can be played
let playables = (roll, color) => {
    let colP = eval(color + "Pieces");
    let canPlay = [];
    if (halt == true) {
        halt = false;
    }
    bot = false;
    let done = false;

    // iterate through all the pieces in the colour group
    for (let g = 0; g < 4; g++) {
        let seedId = colP[g].id;
        let seedLoc = colP[g].pos;
        let seedElem = document.getElementById(`${seedId}`).childNodes[1];
        let glow = false;

        if (seedLoc == color + "house") {
            if (roll == 6) {
                // if the piece is in the colour house and  six was rolled
                glow = true;
                canPlay.push(seedId);
            }
        } else if (seedLoc.slice(-1) != "h") {
            if (seedLoc[4] != "S") {
                glow = true;
                canPlay.push(seedId);
            } else {
                let x = eval(seedLoc.split(color)[1]);
                let y = x + roll;
                if (y <= 6) {
                    glow = true;
                    canPlay.push(seedId);
                }
            }
        }

        if (glow) {
            seedElem.classList.add("glow");
            // document.getElementById("store").innerHTML = this;
            document.getElementById(`${seedId}`).addEventListener('click', function e() {
                // if it is side's turn
                if (seedId.split("p")[0] == activeColor && halt == false) {
                    selectAud.play();
                    move(eval(document.getElementById("store-roll").innerHTML), eval(this.id.split("p")[0] + "Pieces[" + this.id.split("p")[1] + "]"));
                }
            });
        }
    }

    if (canPlay[0]) {
        // if compter is to play
        if (turnDiv.innerText == "BOT") {
            bot = true;
        }
        // if a user is to play and auto play is off
        if (!bot && !AUTO) {
            glowAud.play();
        }

        if (canPlay[0].split("p")[0] == activeColor && halt == false && (AUTO || bot)) {
            if (canPlay.length == 1) {
                let temp = canPlay[0].split("p");
                move(eval(document.getElementById("store-roll").innerHTML), eval(temp[0] + "Pieces[" + temp[1] + "]"));
                done = true;
            } else {
                let standard = eval(canPlay[0].split("p")[0] + "Pieces[" + canPlay[0].split("p")[1] + "]");
                Loop1:
                for (let p = 1; p < canPlay.length; p++) {
                    let temp = canPlay[p].split("p");
                    let any = eval(temp[0] + "Pieces[" + temp[1] + "]");
                    if (any.pos == standard.pos) {
                        if (p != canPlay.length - 1) {
                            continue Loop1;
                        }
                        move(eval(document.getElementById("store-roll").innerHTML), standard);
                        done = true;
                    }

                }
            }
            if (bot && !done) {
                let playZone = [];
                let rolled = eval(document.getElementById("store-roll").innerHTML);
                for (let q = 0; q < canPlay.length; q++) {
                    let section = canPlay[q].split("p");
                    let seed = eval(section[0] + "Pieces[" + section[1] + "]");

                    // house
                    // capture
                    // finish
                    // unsafe pieces
                    // safe

                    if (seed.pos == color + "house") {
                        playZone.push("house");
                    } else {
                        if (seed.pos[4] == "S") {
                            let foreTell = eval(seed.pos.split(color)[1]) + rolled;
                            if (foreTell < 6) {
                                playZone.push("safe");
                            } else {
                                playZone.push("finish");
                            }
                        } else {
                            let sum = eval(seed.pos.split("cell")[1]) + rolled;
                            let sth = sum;
                            if (sum > 52) {
                                sum -= 52;
                            }
                            if (document.querySelector(`#cell${sum}`).classList.contains("occupied")
                                && !document.querySelector(`#cell${sum}`).classList.contains(`${color}p`)) {
                                playZone.push("capture");
                            } else if ((sum > seed.homeCome && sum < seed.homeCellNo + rolled) || (color == "green" && sth > 51)) {
                                if (color == "green") {
                                    sum = sth - seed.homeCome;
                                } else {
                                    sum = sum - seed.homeCome;
                                }
                                if (sum < 6) {
                                    playZone.push("safe");
                                } else {
                                    playZone.push("finish");
                                }
                            } else if (document.querySelector(`#${seed.pos}`).classList.contains("safe")) {
                                playZone.push("safe");
                            } else {
                                playZone.push("unsafe");
                            }
                        }
                    }
                }

                let index;
                if (playZone.includes("house")) {
                    index = playZone.indexOf("house");
                } else if (playZone.includes("capture")) {
                    index = playZone.indexOf("capture");
                } else if (playZone.includes("finish")) {
                    index = playZone.indexOf("finish");
                } else if (playZone.includes("unsafe")) {
                    index = playZone.indexOf("unsafe");
                } else {
                    index = playZone.indexOf("safe");
                }
                move(rolled, eval(canPlay[index].split("p")[0] + "Pieces[" + canPlay[index].split("p")[1] + "]"));
            }

        }
    } else {
        setTimeout(function () {
            turn++;
            updateTurn();
        }, 1000);
    }
}


let selected = null;

let repeat = false;
let move = (roll, piece) => {
    let ID = piece.id;
    let gps = piece.pos;
    let side = piece.color;
    let lastMove;

    // iterate through all the pieces in the colour group
    if (roll < 6 && !eval(`${side}Out`).includes(`${ID}`)) {
        return;
    }

    if (gps == `${side}house`) {
        if (!eval(`${side}Out`)[0]) {
            eval(`${side}Out`)[0] = ID;
        } else if (!eval(`${side}Out`).includes(`${ID}`)) {
            eval(`${side}Out`).push(`${ID}`);
        }
        document.getElementById(`${ID}`).style.position = "absolute";
        document.getElementById(`${ID}`).style.top = document.getElementById(`${side}span`).getBoundingClientRect().y + "px";
        document.getElementById(`${ID}`).style.left = document.getElementById(`${side}span`).getBoundingClientRect().x + "px";
        document.getElementById(`${ID}`).style.left = piece.homeCell.getBoundingClientRect().left;
        document.getElementById(`${ID}`).style.top = piece.homeCell.getBoundingClientRect().top;

        safeAud.play();

        setTimeout(function () {
            document.getElementById(`${ID}`).style.position = "";
            document.getElementById(`${ID}`).style.top = "";
            document.getElementById(`${ID}`).style.left = "";

            piece.homeCell.appendChild(document.querySelector(`#${ID}`));
            lastMove = piece.homeCell.id;
            arrangePile(lastMove);
            piece.pos = piece.homeCell.id;
        }, 300);

    } else {
        if (document.querySelectorAll(`#${gps} svg.${side}pieces`).length < 2) {
            document.querySelector(`#${gps}`).classList.remove(`${side}p`);
            document.querySelector(`#${gps}`).classList.remove("occupied");
        } else {
            if (document.querySelectorAll(`#${gps} svg.${side}pieces`).length == 2) {
                document.querySelector(`#${gps}`).classList.remove(`${side}block`);
                document.querySelector(`#${gps}`).classList.remove('block');
            }
        }


        let contPos = document.querySelector(`#${gps}`).getBoundingClientRect();
        let cellNo;
        if (gps[4] == "S") {
            cellNo = eval(gps.split(side)[1]);
        } else {
            cellNo = eval(gps.split("cell")[1]);
        }
        document.getElementById(`${ID}`).style.position = "absolute";
        document.getElementById(`${ID}`).style.top = contPos.y + "px";
        document.getElementById(`${ID}`).style.left = contPos.x + "px";

        slideAud.play();
        lastMove = slide(piece, cellNo, roll);

        setTimeout(function () {
            document.querySelector(`#${lastMove}`).appendChild(document.querySelector(`#${ID}`));

            document.getElementById(`${ID}`).style.position = "";
            document.getElementById(`${ID}`).style.top = "";
            document.getElementById(`${ID}`).style.left = "";


            // arrange the last pile
            arrangePile(gps);

            piece.pos = lastMove;


            slideAud.pause();
            slideAud.currentTime = 0;

            if (document.querySelector(`#${lastMove}`).classList.contains("safe")) {
                // arrange the new pile
                safeAud.play();
                arrangePile(lastMove);
            } else {
                if (document.querySelector(`#${lastMove}`).classList.contains("occupied")) {
                    if (document.querySelector(`#${lastMove}`).classList.contains(`${side}p`)) {
                        document.querySelector(`#${lastMove}`).classList.add(`${side}block`);
                        document.querySelector(`#${lastMove}`).classList.add(`block`);
                        // arrange the new pile
                        safeAud.play();
                        arrangePile(lastMove);
                    } else if (document.querySelector(`#${lastMove}`).classList.contains(`block`)
                        && !document.querySelector(`#${lastMove}`).classList.contains(`${side}p`)) {
                        goBack(piece);
                    } else if (!document.querySelector(`#${lastMove}`).classList.contains(`block`)
                        && !document.querySelector(`#${lastMove}`).classList.contains(`${side}p`)) {
                        repeat = true;
                        let temp = document.querySelector(`#${lastMove} svg`).id.split("p");
                        document.querySelector(`#${lastMove}`).classList.remove(`${temp[0]}p`);
                        document.querySelector(`#${lastMove}`).classList.add(`${side}p`);
                        goBack(eval(temp[0] + "Pieces[" + temp[1] + "]"));
                    }
                } else {
                    document.querySelector(`#${lastMove}`).classList.add("occupied");
                    document.querySelector(`#${lastMove}`).classList.add(`${side}p`);
                    outAud.play();
                }
            }

            arrangePile(lastMove);
            if (lastMove.slice(-6) == "finish") {
                safeAud.play();
                if (eval(side + "Done").length == 4) {
                    winner(side);
                }
            }
        }, 500);
    }
    for (let p = 0; p < 4; p++) {
        document.getElementById(`${side}p${p}`).childNodes[1].classList.remove("glow");
    }
    // pulse.pause();
    // pulse.currentTime = 0;

    if (!halt) {
        halt = true;
    }
    setTimeout(function () {
        if (roll != 6 && !repeat) {
            setTimeout(function () {
                turn++;
                updateTurn();
            }, 1000);
        } else {
            if (document.getElementById("store").innerHTML == "1") {
                document.getElementById("store").innerHTML = "2"
            } else {
                document.getElementById("store").innerHTML = "1";
            }
            repeat = false;

            setTimeout(function () {
                can = true;
                if (turnDiv.innerText == "BOT") {
                    rollDice();
                }
            }, 500);
        }

    }, 550);


}

function arrangePile(address, item) {
    colors.forEach(function (color, index) {
        document.getElementById(`${color}p${index}`).classList.remove("all-pieces");
    });
    let cell;
    let len;
    let arr = [];
    if (arguments.length > 1) {
        cell = document.getElementById(`cell1`);
        len = 1;
        arr = [item];
    } else {
        cell = document.getElementById(`${address}`);
        arr = document.querySelectorAll(`#${address} svg`);
        len = arr.length;
    }


    let cellWidth = cell.getBoundingClientRect().width - 5;
    if (len == 1) {
        arr[0].style.height = `${cellWidth - 5}px`;
        arr[0].style.width = `${cellWidth - 50}px`;
        arr[0].childNodes[1].style.strokeWidth = "3px";
        arr[0].childNodes[1].style.r = `${(cellWidth / 2) - 5}px`;
        arr[0].childNodes[1].style.cx = `${(cellWidth - 5) / 2}px`;
        arr[0].childNodes[1].style.cy = `${(cellWidth - 5) / 2}px`;
    } else {
        // cell.innerHTML += `<table style="height: 100%; width: 100%;"></table>`;

        // if (len == 2){
        //     document.querySelector(`#${address} table`).innerHTML = `<tr style="height: 100%; width: 100%;"><td style="height: 100% width: 50%"></td><td style="height: 100% width: 50%"></td></tr>`
        // } else if (len == 3){
        //     document.querySelector(`#${address} table`).innerHTML = `<tr style="height: 50%; width: 100%;"> <td style="height: 100% width: 50%"></td> <td style="height: 100% width: 50%"></td> </tr> <tr style="height: 100%; width: 100%;"> <td style="height: 50% width: 100%"></td> </tr>`
        // } else {
        //     document.querySelector(`#${address} table`).innerHTML = `<tr style="height: 50%; width: 100%;"><td style="height: 100% width: 50%"></td><td style="height: 100% width: 50%"></td></tr><tr style="height: 50%; width: 100%;"><td style="height: 100% width: 50%"></td><td style="height: 100% width: 50%"></td></tr>`
        // }

        // for (let i = 0; i < len; i++){
        //     document.querySelector(`#${address} td`)[i].appendChild(arr[i]);
        // }
        for (let i = 0; i < len; i++) {
            arr[i].childNodes[1].style.strokeWidth = "2px";
            arr[i].style.height = `${(cellWidth - 4) / 2}px`;
            arr[i].childNodes[1].style.r = `${(cellWidth / 4) - 5}px`;

            if (len == 3 && i == 2) {
                arr[i].style.width = `${cellWidth - 4}px`;
                arr[i].childNodes[1].style.cx = `${(cellWidth - 5) / 2}px`;
            } else {
                arr[i].style.width = `${(cellWidth - 4) / 2}px`;
                if (i % 2) {
                    arr[i].childNodes[1].style.cx = `${(cellWidth - 5) * 0.25}px`;
                } else {
                    arr[i].childNodes[1].style.cx = `${(cellWidth - 5) * 0.25}px`;
                }
            }
            if (i < 2) {
                arr[i].childNodes[1].style.cy = `${(cellWidth - 5) * 0.25}px`;
            } else {
                arr[i].childNodes[1].style.cy = `${(cellWidth - 5) * 0.25}px`;
            }
        }


    }
    colors.forEach(function (color, index) {
        document.getElementById(`${color}p${index}`).classList.add("all-pieces");
    });
}

function goBack(obj) {
    let tracker = obj.pos;
    let ID = obj.id;
    let hue = obj.color;
    let contPos = document.querySelector(`#${tracker}`).getBoundingClientRect();
    document.getElementById(`${ID}`).style.position = "absolute";
    document.getElementById(`${ID}`).style.top = contPos.y + "px";
    document.getElementById(`${ID}`).style.left = contPos.x + "px";


    document.querySelector(`#${ID}`).style.left = document.querySelector(`#${hue}span`).getBoundingClientRect().left;
    document.querySelector(`#${ID}`).style.top = document.querySelector(`#${hue}span`).getBoundingClientRect().top;

    captureAud.play();

    setTimeout(function () {
        document.querySelector(`#${hue}house`).appendChild(document.querySelector(`#${ID}`));
        arrangePile(tracker);
        arrangePile(null, document.querySelector(`#${ID}`));

        document.getElementById(`${ID}`).style.position = "";
        document.getElementById(`${ID}`).style.top = "";
        document.getElementById(`${ID}`).style.left = "";

        let index = eval(hue + "Out").indexOf(ID);
        eval(hue + "Out").splice(index, 1);
        obj.pos = `${hue}house`;
    }, 300);
}

function slide(item, prevPos, count) {
    let itemId = item.id;
    let itemLoc = item.pos;
    let itemCol = item.color;

    if (itemLoc[4] == "S") {
        let newPos = prevPos + count;
        if (newPos < 6) {
            document.querySelector(`#${itemId}`).style.left = document.querySelector(`#cellSpec${itemCol}${newPos}`).getBoundingClientRect().left;
            document.querySelector(`#${itemId}`).style.top = document.querySelector(`#cellSpec${itemCol}${newPos}`).getBoundingClientRect().top;
            return `cellSpec${itemCol}${newPos}`;
        } else {
            // add to finish
            document.querySelector(`#${itemId}`).style.left = document.querySelector(`#${itemCol}-finish`).getBoundingClientRect().left;
            document.querySelector(`#${itemId}`).style.top = document.querySelector(`#${itemCol}-finish`).getBoundingClientRect().top;
            let index = eval(itemCol + "Out").indexOf(itemId);
            eval(itemCol + "Out").splice(index, 1);
            eval(itemCol + "Done").push(itemId);
            return `${itemCol}-finish`;

        }
    } else {
        let newGps = prevPos + count;
        let c = prevPos + count;
        if (newGps > 52) {
            newGps = newGps - 52;
        }
        if ((newGps > item.homeCome && prevPos < item.homeCellNo) || (itemCol == "green" && c > 51)) {
            if (itemCol == "green") {
                newGps = c - item.homeCome;
            } else {
                newGps = newGps - item.homeCome;
            }
            if (newGps < 6) {
                document.querySelector(`#${itemId}`).style.left = document.querySelector(`#cellSpec${itemCol}${newGps}`).getBoundingClientRect().left;
                document.querySelector(`#${itemId}`).style.top = document.querySelector(`#cellSpec${itemCol}${newGps}`).getBoundingClientRect().top;
                return `cellSpec${itemCol}${newGps}`;
            } else if (newGps == 6) {
                // add to finish
                document.querySelector(`#${itemId}`).style.left = document.querySelector(`#${itemCol}-finish`).getBoundingClientRect().left;
                document.querySelector(`#${itemId}`).style.top = document.querySelector(`#${itemCol}-finish`).getBoundingClientRect().top;
                let index = eval(itemCol + "Out").indexOf(itemId);
                eval(itemCol + "Out").splice(index, 1);
                eval(itemCol + "Done").push(itemId);
                return `${itemCol}-finish`;
            }
        } else {
            document.querySelector(`#${itemId}`).style.left = document.querySelector(`#cell${newGps}`).getBoundingClientRect().left;
            document.querySelector(`#${itemId}`).style.top = document.querySelector(`#cell${newGps}`).getBoundingClientRect().top;
            return `cell${newGps}`;
        }
    }
}

let clearAll = _ => {
    turn = -1;
    for (let i = 0; i < colors.length; i++) {
        let color = colors[i];
        let group = eval(color + "Pieces");

        let len = eval(color + "Out").length
        for (let p = 0; p < len; p++) {
            eval(color + "Out").pop();
        }
        let n = eval(color + "Done").length
        for (let q = 0; q < n; q++) {
            eval(color + "Done").pop();
        }

        let allCells = document.querySelectorAll("td");
        allCells.forEach(cell => {
            if (cell.classList.contains(`${color}p`)) {
                cell.classList.remove(`${color}p`);
                cell.classList.remove("occupied");
                if (cell.classList.contains(`${color}block`)) {
                    cell.classList.remove(`${color}block`)
                    cell.classList.remove("block");
                }
            }
        });
        for (let j = 0; j < 4; j++) {
            arrangePile(null, document.querySelector(`#${group[j].id}`));
            document.getElementById(`${color}house`).append(document.querySelector(`#${group[j].id}`));
            group[j].pos = color + "house";

            turnDivs[j].classList.add("hide");
        }
    }
    document.getElementById("store").innerHTML = "";
    document.getElementById("store-roll").innerHTML = "";
}

let toMainMenu = _ => {
    clearAll();

    for (let j = 0; j < colors.length; j++) {
        document.getElementById(`${colors[j]}house`).innerHTML = "";
        document.getElementById(`${colors[j]}house`).innerHTML = `<span id="${colors[j]}span"></span>`;
    }
    inputWrap.forEach(wrap => {
        wrap.classList.remove("valid");
        wrap.classList.add("hide");
    });
    iconSpaces.forEach(iconSpace => {
        iconSpace.classList.remove("valid");
    });
    inputs.forEach(input => {
        input.classList.remove("valid");
    })
    colors = [];
    can = true;
    document.querySelector(".game-wrapper").classList.add("invisible");
    document.querySelector("#preGame-overlay").classList.remove("hide");
    document.querySelector("._0").classList.remove("hide");

    inputs.forEach(input => {
        input.value = "";
    });
}
let pauseAll = _ => {
    clickAud.play();
    pause = true;
    pauseBut.style.display = "none";
    document.querySelector(".Overlay").classList.remove("hide");
    document.querySelector("#pause-overlay").classList.remove("hide");
    document.querySelector(".game-wrapper").classList.add("blur");
}

let restartGame = _ => {
    turn = -1;
    clearAll();
    pauseBut.style.display = "block";
    can = true;
    rollDice();
}

let verify = (func) => {
    clickAud.play();
    pause = true;
    pauseBut.style.display = "none";
    document.querySelector("#pause-overlay").classList.add("hide");
    document.getElementById("store-act").innerHTML = func;
    document.querySelector(".Overlay").classList.remove("hide");
    document.querySelector("#verify-overlay").classList.remove("hide");
    document.querySelector(".game-wrapper").classList.add("blur");
}

let winner = (color) => {
    // when someone completes his pieces
    pause = true;
    pauseBut.style.display = "none";
    // add to the leaderboard
    colorboard.push(color);
    let playerName = document.querySelector(`#p-${color}-turn .player-name`).innerText;
    leaderboard.push(playerName);
    let ranks = document.querySelectorAll(".rank");
    let unranked = document.querySelector(".fa-ul");
    unranked.innerHTML = "";

    let options = document.querySelectorAll("#winner-overlay button");
    options.forEach(option => {
        option.classList.add("hide");
    });
    let overOptions = document.querySelectorAll("#winner-overlay button.over");
    let pausedOptions = document.querySelectorAll("#winner-overlay button.paused");
    let head = document.getElementById("situation");

    // if there is only one other person not on the leaderboard, he is last
    if (colors.length - leaderboard.length == 1) {
        overOptions.forEach(option => {
            option.classList.remove("hide");
        });
        head.innerText = "Game Over"
        // check for the remaining player
        for (let count = 0; count < colors.length; count++) {
            if (!colorboard.includes(colors[count])) {
                // add the last player to the end of the ranking
                colorboard.push(colors[count]);
                let pName = document.querySelector(`#p-${colors[count]}-turn .player-name`).innerText;
                leaderboard.push(pName);
            }
        }
    } else {
        pausedOptions.forEach(option => {
            option.classList.remove("hide");
        });
        head.innerText = "Paused";
        for (let i = 0; i < colors.length; i++) {
            pause = false;
            if (colorboard.includes(colors[i])) {
                continue;
            } else {
                playerName = document.querySelector(`#p-${colors[i]}-turn`).innerText;
                unranked.innerHTML += `<li style="color: ${colors[i]};"><span class="fa-li"><i style="color: ${colors[i]};" class="fa-solid fa-spinner fa-pulse"></i></span>${playerName}</li>`;
            }
        }
    }

    for (let i = 0; i < leaderboard.length; i++) {
        ranks[i].innerText = leaderboard[i];
        ranks[i].style.color = colorboard[i];
        ranks[i].classList.remove("hide");
    }
    document.querySelector(".Overlay").classList.remove("hide");
    document.querySelector("#winner-overlay").classList.remove("hide");
    document.querySelector(".game-wrapper").classList.add("blur");

}
let vertAction = _ => {
    clickAud.play();
    pause = false;
    document.querySelector(".Overlay").classList.add("hide");
    document.querySelector("#verify-overlay").classList.add("hide");
    document.querySelector(".game-wrapper").classList.remove("blur");
    let action = document.getElementById("store-act").innerHTML;
    eval(action);
}
let closeVert = _ => {
    clickAud.play();
    document.getElementById("store-act").innerHTML = "";
    closeOverlays();
    pause = false;
    pauseBut.style.display = "block";
    if (bot) {
        rollDice();
    }
}
let resume = _ => {
    clickAud.play();
    closeOverlays();
    pause = false;
    pauseBut.style.display = "block";
    if (bot) {
        rollDice();
    }
}
function closeOverlays() {
    document.querySelector("#winner-overlay").classList.add("hide");
    document.querySelector("#pause-overlay").classList.add("hide");
    document.querySelector("#verify-overlay").classList.add("hide");
    document.querySelector(".Overlay").classList.add("hide");
    document.querySelector(".game-wrapper").classList.remove("blur");
}

