const canvas = document.querySelector(".gameConsole__screen");
const controls = document.querySelectorAll(".gameConsole__controls span")
const game = canvas.getContext("2d");

let canvasSize;
let elementSize;

let gameLevel = 0;
let routesNotPermitted = [];

const playerPosition = {
    x: undefined,
    y: undefined
};

const startingPlayerPosition = {
    x: undefined,
    y: undefined
};

const endOfTheRoad = {
    x: undefined,
    y: undefined
};


window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function startGame() {
    game.font = elementSize + "px  Verdana";
    game.textAlign ="start";
    const map = maps[gameLevel];
    if (!map) {
        console.log("hola");
        gameWin()
    }
    const  rowsMaps = map.trim().split("\n");
    const  mapRowsColums = rowsMaps.map((row)=>row.trim().split(''));

    console.log({playerPosition,endOfTheRoad});
    routesNotPermitted = [];
    game.clearRect(0,0,canvasSize,canvasSize)
    mapRowsColums.forEach((row,rowIndex)=>{
        row.forEach((column,columnIndex)=>{
            const positionX = Number((elementSize*columnIndex).toFixed());
            const positionY = Number((elementSize*(rowIndex +1)).toFixed())
            if(column == "O" && !playerPosition.x && !playerPosition.y ){
                playerPosition.x = positionX
                playerPosition.y = positionY
                startingPlayerPosition.x = positionX
                startingPlayerPosition.y = positionY
            }if(column == "I"){
                endOfTheRoad.x = positionX
                endOfTheRoad.y = positionY
            }if (column == "X"){
                routesNotPermitted.push({x:positionX,y:positionY})
            }
            game.fillText(emojis[column],positionX,positionY)
        })
    })

    movePlayer()
};
function movePlayer() {
    console.log(playerPosition.y);
    const endOfTheRoadX = playerPosition.x.toFixed() == endOfTheRoad.x.toFixed()
    const endOfTheRoadY = playerPosition.y.toFixed() == endOfTheRoad.y.toFixed()
    const encollitionFound = endOfTheRoadX && endOfTheRoadY
    if (encollitionFound) {
        console.log("subiste de nivel");
        levelWin()
    }
    validatedRouteposition()
    game.fillText(emojis["PLAYER"],playerPosition.x,playerPosition.y)

}
function setCanvasSize() {
    function calculateCanvasSize(porcentaje) {
        canvasSize = window.innerWidth*porcentaje;
        canvas.setAttribute("width",canvasSize);
        canvas.setAttribute("height",canvasSize);
    }

     if( window.innerWidth <= 768){
        calculateCanvasSize(0.5)
    }else if(window.innerWidth > 768 && (window.innerWidth <= 1024 && window.innerHeight <= 600 )){
        calculateCanvasSize(0.3)
    }else if(window.innerWidth > 768 && (window.innerWidth <= 1024 && window.innerHeight > 600 ) ){
        calculateCanvasSize(0.4)
    }else if(window.innerWidth >= 1024 && window.innerWidth <= 1440){
        calculateCanvasSize(0.18)
    }else if(window.innerWidth >= 1440 && window.innerWidth <= 2000){
        calculateCanvasSize(0.18)
    }else{
        calculateCanvasSize(0.3)
    }
    elementSize = Number((canvasSize / 10.4).toFixed(1))
    startGame()
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
function routeValidation() {
    return routesNotPermitted.some(coordinates=>coordinates.x.toFixed()  == playerPosition.x.toFixed()  && coordinates.y.toFixed() == playerPosition.y.toFixed() )
}
function validatedRouteposition() {
    console.log(routeValidation());
    if (routeValidation()) {
        game.fillText(emojis["BOMB_COLLISION"],playerPosition.x,playerPosition.y)
        console.log(startingPlayerPosition);
    }
}
function levelWin() {
    gameLevel++
    startGame()
}
function gameWin() {
    console.log("terminaste el juego");
}
function moveUp() {
    if(playerPosition.y > elementSize){
        playerPosition.y -= elementSize
        startGame()
    }
}
function moveLeft() {
    if( playerPosition.x > 0){
        playerPosition.x -= elementSize
        startGame()
    }
}
function moveRight() {
    if(playerPosition.x < canvasSize-(2*elementSize) ){
        playerPosition.x += elementSize
        startGame()

    }
}
function moveDown() {
    if(playerPosition.y < canvasSize-elementSize){
        playerPosition.y += elementSize
        startGame()
    }
}
window.addEventListener("keydown",(event)=>{
    movements[event.key]?.()
})
controls.forEach((control)=>{
    control.addEventListener("click",()=>{
        movements[control.dataset.id]()
    })
})
