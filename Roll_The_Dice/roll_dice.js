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


die.onclick = callRoll;

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
