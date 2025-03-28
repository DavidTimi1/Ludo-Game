export const initCell = {
    green: 1,
    blue: 27,
    red: 14,
    yellow: 40 
}

export const almostHome = {};


export const allColors = ["green", "red", "blue", "yellow"];

for (let col of allColors) {
    let val = initCell[col] - 2;
    almostHome[col] = val > 1? val : 50;
}


function linkCells(){
    let init = 1;

    let func = int => `#cell${int}`, func1 = (int, col) => `#cellSpec${col}${int}`

    for (let i = init; i < 53; i++){
        let next = i == 52? 1 : i + 1;
        let prev = i == 1? 52 : i - 1;
        constructCell(func(i), func(prev), func(next));
    }

    for (let color of allColors){
        // construct the home cells
        for (let i = init; i <= 6; i++){
            if (i == init){
                constructCell(func1(i, color), func(almostHome[color]), func1(i + 1, color));

            } else if (i === 6){
                constructCell(func1(i, color), func1(i - 1, color), null);

            } else {
                constructCell(func1(i, color), func1(i - 1, color), func1(i + 1, color));
            }
        }

        // link the almost home to home
        constructCell(func(almostHome[color]), func(almostHome[color] - 1), {
            default: func(almostHome[color] + 1),
            [color]: func1(1, color)
        })


        // link initial cell for that color group to null
        document.querySelector(func(initCell[color])).cell.next[color] = null;
    }

}


function constructCell (selector, prev, next){
    let elem = document.querySelector(selector);

    next = typeof next === 'object'? next : {default: next};
    prev = typeof prev === 'object'? prev : {default: prev};

    let toString = _ => `Game cell at ${selector}`,
    getNext = col => next[col] ?? next["default"],
    getPrev = col => prev[col] ?? prev["default"];

    elem.cell = {prev, next, toString, getNext, getPrev};
}


let arrows = document.getElementsByClassName("home-come");
for (let cell of arrows) {
    let src = cell.classList[0];
    cell.style.backgroundImage = `url(assets/${src}.png)`;
}

let safeCells = document.getElementsByClassName("safe");
for (let cell of safeCells) {
    if (cell.classList.contains("home-cell")) {
        // cell.style.backgroundImage = "url()"
    } else {
        let src = cell.classList[0];
        cell.style.backgroundImage = `url(assets/${src}.png)`;
    }
}

linkCells();