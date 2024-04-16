const canvas = document.querySelector(".gameConsole__screen");
const controls = document.querySelectorAll(".gameConsole__controls span");
const game = canvas.getContext("2d");
const meessajelife = document.querySelectorAll(".gameMessaje__life p");
const messajeTime = document.querySelectorAll(".gameMessaje__time p");
const messajeRecord = document.querySelectorAll(".gameMessaje__record p");
const gameMessajeMsj = document.querySelector(".gameMessaje__msj");
const gameMessaje = document.querySelector(".gameMessaje");
const finalMessageContainer = document.querySelector(".finalMessageContainer");
const finalMessage = document.querySelector(".finalMessageContainer__msj");
const finalMessageBtn = document.querySelector(".finalMessageContainer__btn");


let canvasSize;
let elementSize;
let lives = 3
let gameLevel = 0;
let routesNotPermitted = [];
let timePlayer;
let timeInterval;
let timeStart;

const playerPosition = {
    x: undefined,
    y: undefined
};

const endOfTheRoad = {
    x: undefined,
    y: undefined
};

const movements ={
    ArrowUp: moveUp,
    ArrowLeft: moveLeft,
    ArrowRight: moveRight,
    ArrowDown: moveDown,
    w: moveUp,
    a:moveLeft,
    s:moveDown,
    d:moveRight
}

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function startGame() {
    game.font = elementSize + "px  Verdana";
    game.textAlign ="start";
    const map = maps[gameLevel];

    if (!map) {
        gameWin();
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 1000);
        showRecord();
    }else{

    }

    const  rowsMaps = map.trim().split("\n");
    const  mapRowsColums = rowsMaps.map((row)=>row.trim().split(''));

    showlives();
    routesNotPermitted = [];
    game.clearRect(0,0,canvasSize,canvasSize);

    mapRowsColums.forEach((row,rowIndex)=>{
        row.forEach((column,columnIndex)=>{

            const positionX = Number((elementSize*columnIndex).toFixed());
            const positionY = Number((elementSize*(rowIndex +1)).toFixed());

            if( column == "O" && !playerPosition.x && !playerPosition.y ){
                playerPosition.x = positionX;
                playerPosition.y = positionY;
            };
            if( column == "I" ){
                endOfTheRoad.x = positionX;
                endOfTheRoad.y = positionY;
            };
            if (column == "X"){
                routesNotPermitted.push({
                    x:positionX,
                    y:positionY
                })
            };
            game.fillText(emojis[column],positionX,positionY);
        });
    });

    movePlayer();

};
function movePlayer() {

    const endOfTheRoadX = playerPosition.x.toFixed(0) == endOfTheRoad.x.toFixed(0);
    const endOfTheRoadY = playerPosition.y.toFixed(0) == endOfTheRoad.y.toFixed(0);
    const encollitionFound = endOfTheRoadX && endOfTheRoadY;
    if (encollitionFound) {
        levelWin();
    };

    if (routeValidation()) {
        const enemyCoordinates = routeValidation();
        game.fillText(emojis["BOMB_COLLISION"],enemyCoordinates.x,enemyCoordinates.y);
        levelFail();

    };
    game.fillText(emojis["PLAYER"],playerPosition.x,playerPosition.y);
}
function setCanvasSize() {
    function calculateCanvasSize(porcentaje) {
        canvasSize = window.innerWidth*porcentaje;
        canvas.setAttribute("width", canvasSize);
        canvas.setAttribute("height", canvasSize);
        gameMessaje.setAttribute("width", canvasSize);
    }

     if( window.innerWidth <= 425){
        calculateCanvasSize(0.7);
    }else if(window.innerWidth > 425 &&  window.innerWidth <= 768){
        calculateCanvasSize(0.5);
    }else if(window.innerWidth > 768 && (window.innerWidth <= 1024 && window.innerHeight <= 600 )){
        calculateCanvasSize(0.3);
    }else if(window.innerWidth > 768 && (window.innerWidth <= 1024 && window.innerHeight > 600 ) ){
        calculateCanvasSize(0.4);
    }else if(window.innerWidth >= 1024 && window.innerWidth <= 1440){
        calculateCanvasSize(0.18);
    }else if(window.innerWidth >= 1440 && window.innerWidth <= 2000){
        calculateCanvasSize(0.18);
    }else{
        calculateCanvasSize(0.3);
    }
    elementSize = Number((canvasSize / 10.4).toFixed(0));
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
};
function routeValidation() {
    return routesNotPermitted.find(coordinates=>coordinates.x.toFixed(0)  == playerPosition.x.toFixed(0)  && coordinates.y.toFixed(0) == playerPosition.y.toFixed(0));
}
function levelWin() {
    gameLevel++;
    startGame();
};
function levelFail() {
    lives--;
    if (lives <= 0) {
        gameLevel = 0;
        lives = 3;
        clearInterval(timeInterval);
        timeStart = undefined;
    };
    setTimeout(() => {
        playerPosition.x = undefined;
        playerPosition.y = undefined;
        startGame();
    }, 100);
};
function gameWin() {
    showMessajeWin();
    clearInterval(timeInterval);

    const previousRecord = Number(localStorage.getItem("record_time"));
    const currentRecord = Number(Date.now() - timeStart);

    const currentRecordInFormat = formatTime(currentRecord);
    const previousRecordFormat = formatTime(Number(localStorage.getItem("record_time")));

    if(previousRecord){
        if(previousRecord < currentRecord){
            showRecordByWinning("no superaste el record ",previousRecordFormat);
        }else{
            localStorage.setItem("record_time", currentRecord);
            showRecordByWinning("Superaste el record!!", currentRecordInFormat);
        };
    }else{
        localStorage.setItem("record_time", currentRecord);
        showRecordByWinning("primera vez jugando? \n superar tu tiempo!!",currentRecordInFormat);
    };

    finalMessageBtn.addEventListener("click", resetLevel);

};
function showRecordByWinning(msj,recordInInFormat) {
    finalMessage.innerHTML= `${msj}   ` + recordInInFormat;
}
function resetLevel() {
    finalMessageContainer.classList.remove("finalMessageContainer--open");
    window.location.reload();
};
function showMessajeWin() {
    finalMessageContainer.classList.add("finalMessageContainer--open");
};
function showlives() {
    const livesArray = Array(lives).fill(emojis["HEART"]);
    meessajelife[1].innerHTML ="";
    livesArray.forEach((emoji)=>{
        meessajelife[1].append(emoji);
    });
};
function showTime() {
    formatTime(timeStart);
    messajeTime[1].innerHTML = formatTime(Date.now() - timeStart);
}
function showRecord() {
    messajeRecord[1].innerHTML = formatTime(Number(localStorage.getItem("record_time")));
}
function formatTime(ms) {
    const seg = parseInt(ms/1000) % 60;
    const min = parseInt(ms/60000) % 60;
    const hr = parseInt(ms/3600000) % 24;
    const segStr = `${seg}`.padStart(2,"0");
    const minStr = `${min}`.padStart(2,"0");
    const hrStr = `${hr}`.padStart(2,"0");
    return`${hrStr}:${minStr}:${segStr}`;
};
function moveUp() {
    if(playerPosition.y > elementSize){
        playerPosition.y -= elementSize;
        startGame();
    };
};
function moveLeft() {
    if( playerPosition.x > 0){
        playerPosition.x -= elementSize;
        startGame();
    };
};
function moveRight() {
    if(playerPosition.x < canvasSize-(2*elementSize) ){
        playerPosition.x += elementSize;
        startGame();

    }
};
function moveDown() {
    if(playerPosition.y < canvasSize-elementSize){
        playerPosition.y += elementSize;
        startGame();
    };
};
window.addEventListener("keydown",(event)=>{
    movements[event.key]?.();
});
controls.forEach((control)=>{
    control.addEventListener("click",()=>{
        movements[control.dataset.id]();
    });
});
