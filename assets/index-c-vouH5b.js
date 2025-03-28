(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function l(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=l(o);fetch(o.href,n)}})();let clickAud=document.getElementById("click-sound"),errorAud=document.getElementById("error-sound"),outAud=document.getElementById("out-sound"),selectAud=document.getElementById("select-sound"),captureAud=document.getElementById("capture-sound"),rollAud=document.getElementById("roll-sound"),safeAud=document.getElementById("safe-sound"),glowAud=document.getElementById("glow-sound");document.getElementById("slide-sound");function playError(){errorAud.play()}function playClick(){clickAud.play()}function playSelect(){selectAud.play()}function playCapture(){captureAud.play()}function playGlow(){glowAud.play()}function playSafe(){safeAud.play()}function playRoll(){rollAud.play()}function playStop(){outAud.play()}const initCell={green:1,blue:27,red:14,yellow:40},almostHome={},allColors=["green","red","blue","yellow"];for(let e of allColors){let t=initCell[e]-2;almostHome[e]=t>1?t:50}function linkCells(){let e=1,t=s=>`#cell${s}`,l=(s,o)=>`#cellSpec${o}${s}`;for(let s=e;s<53;s++){let o=s==52?1:s+1,n=s==1?52:s-1;constructCell(t(s),t(n),t(o))}for(let s of allColors){for(let o=e;o<=6;o++)o==e?constructCell(l(o,s),t(almostHome[s]),l(o+1,s)):o===6?constructCell(l(o,s),l(o-1,s),null):constructCell(l(o,s),l(o-1,s),l(o+1,s));constructCell(t(almostHome[s]),t(almostHome[s]-1),{default:t(almostHome[s]+1),[s]:l(1,s)}),document.querySelector(t(initCell[s])).cell.next[s]=null}}function constructCell(e,t,l){let s=document.querySelector(e);l=typeof l=="object"?l:{default:l},t=typeof t=="object"?t:{default:t};let o=r=>`Game cell at ${e}`,n=r=>l[r]??l.default,c=r=>t[r]??t.default;s.cell={prev:t,next:l,toString:o,getNext:n,getPrev:c}}let arrows=document.getElementsByClassName("home-come");for(let e of arrows){let t=e.classList[0];e.style.backgroundImage=`url(assets/${t}.png)`}let safeCells=document.getElementsByClassName("safe");for(let e of safeCells)if(!e.classList.contains("home-cell")){let t=e.classList[0];e.style.backgroundImage=`url(assets/${t}.png)`}linkCells();let pausedGame=!1,AUTO=!0;function changeAUTO(){document.getElementById("switch-cont").classList.contains("on")?(document.getElementById("switch-cont").classList.remove("on"),AUTO=!1,document.getElementById("switch-cont").style.backgroundColor="#999",document.getElementById("auto-off").style.backgroundColor="white",document.getElementById("auto-on").style.backgroundColor="transparent"):(document.getElementById("switch-cont").classList.add("on"),AUTO=!0,document.getElementById("switch-cont").style.backgroundColor="blue",document.getElementById("auto-on").style.backgroundColor="white",document.getElementById("auto-off").style.backgroundColor="transparent"),playClick()}document.getElementById("auto-play").addEventListener("click",changeAUTO);const pauseBtn$1=document.getElementById("pause-all");for(let e of document.getElementsByClassName("resume-btn"))e.addEventListener("click",resumeGame);for(let e of document.getElementsByClassName("vert-restart"))e.addEventListener("click",()=>verify(restartGame));for(let e of document.getElementsByClassName("vert-mainmenu"))e.addEventListener("click",()=>verify(toMainMenu));const pauseAll=()=>{playClick(),pausedGame=!0,pauseBtn$1.classList.add("invisible"),document.getElementsByClassName("Overlay")[0].classList.remove("hidden"),document.getElementById("pause-overlay").classList.remove("hidden")};function resumeGame(){playClick(),closeOverlays(),pausedGame=!1,pauseBtn$1.classList.remove("invisible"),getActivePlayer().isBot&&setTimeout(rollDice,500)}function pauseGame(){playClick(),pausedGame=!0,pauseBtn$1.classList.add("invisible")}const performApprovedAction=e=>{playClick(),pausedGame=!1,document.getElementsByClassName("Overlay").classList.add("hidden"),document.getElementById("verify-overlay").classList.add("hidden"),e==null||e()};function restartGame(){turn=-1,clearAll(),closeOverlays(),pauseBtn$1.classList.remove("invisible"),setRoll(!0),rollDice()}function verify(e){playClick(),pausedGame=!0,pauseBtn$1.classList.add("invisible"),document.getElementById("pause-overlay").classList.add("hidden"),document.getElementsByClassName("Overlay")[0].classList.remove("hidden"),document.getElementById("verify-overlay").classList.remove("hidden"),document.getElementById("verify-yes").onclick=()=>performApprovedAction(e),document.getElementById("verify-no").onclick=resumeGame,document.getElementById("verify-yes").onclick=document.getElementById("verify-no").onclick=null}const clearAll=()=>{turn=-1;for(let e of colors){let t=getGroup(e),l=document.getElementsByTagName("td");for(let s of l)s.classList.remove(`${e}p`,"occupied",`${e}block`,"block");for(let s=0;s<4;s++){let o=document.getElementById(t[s].id);document.getElementById(`${e}house`).append(o),t[s].pos=e+"house",turnDivs[s].classList.add("hidden")}}timesPlayedSix=0},inputs=document.querySelectorAll(".register input"),inputWrap=e=>e.closest("label"),toMainMenu=()=>{clearAll(),closeOverlays(),inputs.forEach(e=>{e.classList.remove("valid"),e.value="";let t=inputWrap(e);t.classList.remove("valid"),t.classList.add("hidden")}),setRoll(!0),document.getElementsByClassName("game-wrapper")[0].classList.add("invisible"),document.getElementById("preGame-overlay").classList.remove("hidden"),document.getElementsByClassName("_0")[0].classList.remove("hidden")},dieImages=["dice-01.svg","dice-02.svg","dice-03.svg","dice-04.svg","dice-05.svg","dice-06.svg"],die=document.getElementById("die-1");let dieRoll=null,timesPlayedSix$1=0,canRoll=!0;function getTransitionEndEventName(){let e={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"},t=document.body.style;for(let l in e)if(t[l]!=null)return e[l]}const transitionEnd=getTransitionEndEventName();function rollDice(){if(canRoll&&!pausedGame&&turn$1>=0){canRoll=!1,die.classList.add("spin"),playRoll();let e;setTimeout(e=function(t=0){let l=Math.floor(Math.random()*6);die.setAttribute("src",`./Roll_The_Dice/${dieImages[l]}`),t<4?setTimeout(e,100,t+1):(die.classList.remove("spin"),die.setAttribute("src",`./Roll_The_Dice/${dieImages[l]}`),dieRoll=l+1,useRolled(dieRoll))},300)}}function useRolled(e){canRoll=!1;const t=getActivePlayer().color;e<6&&!outPieces(t).length||e==6&&timesPlayedSix$1==2?(timesPlayedSix$1=0,setTimeout(updateTurn,500)):(timesPlayedSix$1=e==6?timesPlayedSix$1+1:0,playables(e,t))}function initDice(){die.onclick=callRoll;const e=Math.floor(Math.random()*6);die.setAttribute("src",`./Roll_The_Dice/${dieImages[e]}`)}function callRoll(){getActivePlayer().isBot||rollDice()}function setRoll(e){canRoll=e}let PLAYERS=[],MODE=null;function getPlayers(){return PLAYERS}const MODES=["friends","online","pass","computer"];document.querySelectorAll("button[data-mode]").forEach(e=>{e.onclick=()=>{MODE===null&&setMode(e)}});function setMode(e){const{dataset:{mode:t}}=e;MODES.includes(t)&&(MODE=t,overlay(2))}const addPlayerBtn=document.getElementById("add-player");addPlayerBtn.onclick=addPlayer;function addPlayer(e){const t=document.getElementById("registration-form").querySelectorAll("input:not(:disabled)").length;if(t>3)return;const l=document.createElement("div");l.className="w-full",l.insertAdjacentHTML("beforeend",`
            <label class="nameInput flex align-center justify-center gap-2 focus-within:border-yellow-600 border rounded-xl bg-slate-800">
                <div class="usr-icon w-7 aspect-square rounded-full"></div>
                <input type="text" class="xinput bg-inherit outline-none border-none" placeholder="Player ${t+1} Name" value="BOT" autocapitalize="characters" maxlength="15">
            </label>
            <button type="button" class="icon-btn bg-red-600 absolute top-1/2 -translate-y-1/2 left-full">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `),l.getElementsByTagName("button")[0].onclick=removePlayer,addPlayerBtn.insertAdjacentElement("beforebegin",l),t===3&&(addPlayerBtn.hidden=addPlayerBtn.disabled=!0)}function removePlayer(e){e.stopPropagation();const t=document.querySelectorAll("#registration-form .nameInput:not( :disabled)"),l=t.length;addPlayerBtn.hidden=addPlayerBtn.disabled=!1,!(l<3)&&t[l-1].closest(".w-full").remove()}document.getElementById("registration-form").onsubmit=registerPlayers;function registerPlayers(e){e.preventDefault();let t=e.target,l=!1;const s=document.getElementById("reg-error");let o=[],n=!0;const c=t.querySelectorAll("input:not(:disabled)"),r=c.length;if(c.forEach((u,m)=>{const a=u.value||"BOT";if(a=="BOT"){if(m==r-1&&n){s.hidden=!1,s.innerText="There must be at least 1 User Player",playError();return}}else{if(o.includes(a)){s.hidden=!1,s.innerText="Two players cannot have same name",playError();return}n=!1,o.push(a)}l=m===r-1,PLAYERS.push({name:u.value,icon:robotIcon,color:allColors[m],isBot:a==="BOT"})}),l){overlay(3);return}PLAYERS=[]}const robotIcon='<i class="fa-solid fa-robot"></i>';document.getElementsByClassName("user-icon");document.getElementById("init-btn").onclick=()=>{overlay(1)};const overlay=e=>{if(e!=3)playClick(),document.getElementsByClassName(`_${e-1}`)[0].classList.add("hidden"),document.getElementsByClassName(`_${e}`)[0].classList.remove("hidden"),e!=2&&dispatchEvent(new Event("close reg"));else{const t=getPlayers();for(let s of t){const{name:o,color:n,icon:c}=s,r=document.querySelector(`.player-card[data-colgroup="${n}"]`);r.getElementsByClassName("p-name")[0].innerHTML=o,r.getElementsByClassName("p-icon")[0].innerHTML=c}document.getElementById("pause-all").classList.remove("invisible"),makePieces(),document.getElementsByClassName(`_${e-1}`)[0].classList.add("hidden"),document.getElementsByClassName(`_${e}`)[0].classList.remove("invisible"),document.getElementById("preGame-overlay").classList.add("hidden"),initDice(),updateTurn()}};function Pieces(e){this.id=null,this.color=e,this.pos=e+"house",this.out=this.done=!1}let leaderboard=[],colorboard=[];const pauseBtn=document.getElementById("pause-all");pauseBtn.onclick=pauseAll;let allPieces=[],coloredPieces=e=>allPieces.filter(t=>t.color==e),redPieces=[],bluePieces=[],greenPieces=[],yellowPieces=[],outPieces=e=>getGroup$1(e).filter(t=>t.out),donePieces=e=>getGroup$1(e).filter(t=>t.done);const getGroup$1=e=>{switch(e){case"red":return redPieces;case"blue":return bluePieces;case"green":return greenPieces;case"yellow":return yellowPieces}},makePieces=()=>{const e=getPlayers().map(t=>t.color);for(let t of e)for(let l=0;l<4;l++){let s=new Pieces(t);allPieces.push(s),s.id=t+"p"+l;let o=`<div id=${s.id} class="all-pieces ${t}pieces z-10 aspect-square rounded-full">
                <div class="aspect-square rounded-full w-full h-full" style="background-color:${s.color};">
                </div>
            </div>`,n=document.createElement("div");n.innerHTML=o,document.getElementById(`${t}house${l}`).appendChild(n.firstElementChild)}redPieces=coloredPieces("red"),bluePieces=coloredPieces("blue"),greenPieces=coloredPieces("green"),yellowPieces=coloredPieces("yellow")};let turn$1=-1,activePlayer,getActivePlayer=e=>activePlayer;function updateTurn(){const e=getPlayers();do turn$1=(turn$1+1)%e.length;while(donePieces(e[turn$1].color).length==4);activePlayer=e[turn$1];const t=activePlayer.color,l=document.getElementById("turn-div");l.innerHTML=`${activePlayer.name}'s turn`,l.style.color=t,document.querySelector(`.player-card[data-colgroup="${t}"] .dice-wrapper`).appendChild(die),setRoll(!0),activePlayer.isBot&&setTimeout(rollDice,500)}let canPlay=!1;const playables=(roll,color)=>{let colP=getGroup$1(color),canBePlayed=[];canPlay=!0;const isBot=activePlayer.isBot,activeColor=activePlayer.color;let done=!1;for(let seed of colP){let playable=!1;if(seed.pos==color+"house"&&!seed.out)roll==6&&(playable=!0,canBePlayed.push(seed));else if(!seed.pos.includes("finish")||!seed.done)if(!seed.pos.includes("Spec"))playable=!0,canBePlayed.push(seed);else{let x=eval(seed.pos.split(color)[1]),y=x+roll;y<=6&&(playable=!0,canBePlayed.push(seed))}playable&&document.getElementById(seed.id).classList.add("glow")}if(canBePlayed.length)if(!isBot&&!AUTO)playGlow(),canBePlayed.forEach(e=>{document.getElementById(e.id).addEventListener("click",()=>{e.id.includes(activeColor)&&canPlay&&(playSelect(),play(roll,e),canBePlayed.map(l=>document.getElementById(`${l.id}`)).forEach(l=>removeEventListener("click",l)))},{once:!0})});else{if(canBePlayed.length===1)play(roll,canBePlayed[0]),done=!0;else for(let e=1;e<canBePlayed.length;e++){let t=canBePlayed[e],l=canBePlayed[0];if(t.pos==l.pos){if(e!=canBePlayed.length-1)continue;play(roll,l),done=!0}else break}if(isBot&&!done){let playZone=[],rolled=roll;for(let q=0;q<canBePlayed.length;q++){let seed=canBePlayed[q];if(seed.pos==color+"house")playZone.push("house");else if(seed.pos.includes("Spec")){let foreTell=eval(seed.pos.split(color)[1])+rolled;playZone.push(foreTell<6?"safe":"finish")}else{let sum=eval(seed.pos.split("cell")[1])+rolled,oth=sum>52?sum-52:sum;if(document.getElementById(`cell${oth}`).classList.contains("occupied")&&!document.getElementById(`cell${oth}`).classList.contains(`${color}p`))playZone.push("capture");else if(sum>almostHome[color]&&sum<initCell[color]+rolled||color=="green"&&sum>51){const e=sum-almostHome[color];playZone.push(e<6?"safe":"finish")}else document.getElementById(`${seed.pos}`).classList.contains("safe")?playZone.push("safe"):playZone.push("unsafe")}}let index;playZone.includes("house")?index=playZone.lastIndexOf("house"):playZone.includes("capture")?index=playZone.lastIndexOf("capture"):playZone.includes("finish")?index=playZone.lastIndexOf("finish"):playZone.includes("unsafe")?index=playZone.lastIndexOf("unsafe"):index=playZone.lastIndexOf("safe"),play(roll,canBePlayed[index])}}else setTimeout(updateTurn,500)},play=(roll,piece)=>{let ID=piece.id,gps=piece.pos,side=piece.color,repeat=roll===6,groupHome=document.querySelector(`#cell${initCell[side]}`),pieceElem=document.getElementById(`${ID}`),dest,destElem;if(!(roll<6&&!piece.out)){if(gps==`${side}house`&&repeat){piece.out=!0;const e=pieceElem.getBoundingClientRect(),t=groupHome.getBoundingClientRect();let l=!1;const s=()=>{l||(l=!0,groupHome.appendChild(pieceElem),pieceElem.style.position=pieceElem.style.top=pieceElem.style.left="",groupHome.id,piece.pos=groupHome.id,(timesPlayedSix$1||repeat)&&(repeat=!1,setRoll(!0),activePlayer.isBot&&setTimeout(rollDice,1e3)))};setTimeout(()=>{pieceElem.style.left=t.x-e.x+"px",pieceElem.style.top=t.y-e.y+"px",setTimeout(s,500)}),playSafe()}else{let stackLength=document.querySelectorAll(`#${gps} .${side}pieces`).length;stackLength==1?document.getElementById(gps).classList.remove(`${side}p`,"occupied"):stackLength==2&&document.getElementById(gps).classList.remove(`${side}block`,"block");let cont=document.getElementById(gps),cellNo=eval(gps.split(gps.includes("Spec")?side:"cell")[1]);dest=getDestination(piece,cellNo,roll),destElem=document.getElementById(dest);let moved=!1;move(pieceElem,side,cont,destElem);const pluto=()=>{if(!moved){if(moved=!0,setTimeout(()=>{destElem.appendChild(pieceElem),pieceElem.style.position=pieceElem.style.top=pieceElem.style.left=""}),piece.pos=dest,destElem.classList.contains("safe"))playSafe();else{let e=side+"p";if(destElem.classList.contains("occupied"))if(destElem.classList.contains(e))destElem.classList.add(`${side}block`,"block"),playSafe();else if(destElem.classList.contains("block"))goBack(piece);else{repeat=!0;let t=destElem.getElementsByClassName("all-pieces")[0].id.split("p");destElem.classList.remove(t[0]+"p"),destElem.classList.add(e),goBack(getGroup$1(t[0])[t[1]])}else destElem.classList.add("occupied",e),playStop()}destElem.classList.contains("finish")&&(piece.pos="finish",donePieces(side).length===4&&winner(side)),timesPlayedSix$1||repeat?(setRoll(!0),activePlayer.isBot&&setTimeout(rollDice,500)):updateTurn()}};addEventListener("transitionsEnded",pluto,{once:!0})}document.querySelectorAll(".all-pieces.glow").forEach(e=>{e.classList.remove("glow")}),canPlay=!1}};function move(e,t,l,s){const o=l.getBoundingClientRect();n(c(l).getNext(t));function n(r){let u=document.querySelector(r);const m=u.getBoundingClientRect();let a=!1;const d=()=>{if(!a){if(a=!0,s!=u)return n(c(u).getNext(t));dispatchEvent(new Event("transitionsEnded"))}};setTimeout(d,400),e.addEventListener(transitionEnd,d,{once:!0}),e.style.left=m.x-o.x+"px",e.style.top=m.y-o.y+"px"}function c(r){return r.cell}}function goBack(e){const{pos:t,id:l,color:s}=e;let o=document.getElementById(t),n=document.getElementById(l);const c=o.getBoundingClientRect();playCapture(),r(`#${s}house${l.slice(-1)}`);function r(u){const a=document.querySelector(u).getBoundingClientRect();let d=!1;const p=()=>{d||(d=!0,dispatchEvent(new Event("transitionsEnded")))};setTimeout(p,400),n.addEventListener(transitionEnd,p,{once:!0}),n.style.left=a.x-c.x+"px",n.style.top=a.y-c.y+"px"}}function getDestination(e,t,l){let s=e.pos,o=e.color;if(s.includes("Spec")){let c=t+l;return c==6&&(e.out=!1,e.done=!0),`cellSpec${o}${c}`}let n=t+l;if(n>almostHome[o]&&t<initCell[o]||o=="green"&&n>51){let c=n-almostHome[o];return c==6&&(e.out=!1,e.done=!0),`cellSpec${o}${c}`}return n=n>52?n-52:n,`cell${n}`}const winner=e=>{let t=document.getElementById("winner-overlay");pauseGame();const l=getPlayers().map(a=>a.color);colorboard.push(e);let s=document.querySelector(`#p-${e}-turn .player-name`).innerText;leaderboard.push(s);let o=t.getElementsByClassName("rank"),n=t.getElementsByClassName("fa-ul")[0];n.innerHTML="";let c=t.getElementsByTagName("button");for(let a of c)a.classList.add("hidden");let r=t.querySelectorAll("button.over"),u=t.querySelectorAll("button.paused"),m=document.getElementById("situation");if(l.length-leaderboard.length==1){r.forEach(a=>{a.classList.remove("hidden")}),m.innerText="Game Over";for(let a of l)if(!colorboard.includes(a)){colorboard.push(a);let d=document.querySelector(`#p-${a}-turn .player-name`).innerText;leaderboard.push(d)}}else{u.forEach(d=>{d.classList.remove("hidden")}),m.innerText="Paused";let a=l.filter(d=>!colorboard.includes(d));for(let d of a){let p=document.querySelector(`#p-${d}-turn .player-name`).innerText;n.insertAdjacentHTML("beforeend",`<li style="color: ${d};">
                    <span class="fa-li">
                    <i style="color: ${l[i]};" class="fa-solid fa-spinner fa-pulse"></i>
                    </span>${p}
                </li>`)}}for(let a=0;a<leaderboard.length;a++)o[a].innerText=leaderboard[a],o[a].style.color=colorboard[a],o[a].classList.remove("hidden");document.getElementsByClassName("Overlay").classList.remove("hidden"),document.getElementById("winner-overlay").classList.remove("hidden")};function closeOverlays(){["#winner-overlay","#pause-overlay","#verify-overlay",".Overlay"].forEach(e=>document.querySelector(e).classList.add("hidden"))}
