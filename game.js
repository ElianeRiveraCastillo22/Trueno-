const canvas = document.querySelector(".gameConsole__screen");
const controls = document.querySelectorAll(".gameConsole__controls span")
/**
 * @type {HTMLCanvasElement}
*/
const game = canvas.getContext("2d");

let canvasSize;
let elementSize;
const playerPosition = {
    x: undefined,
    y: undefined
}

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function startGame() {
    game.font = elementSize + "px  Verdana"
    game.textAlign ="start"
    const map = maps[0]
    const  rowsMaps = map.trim().split("\n")
    const  mapRowsColums = rowsMaps.map((row)=>row.trim().split(''))
    game.clearRect(0,0,canvasSize,canvasSize)
    mapRowsColums.forEach((row,rowIndex)=>{
        row.forEach((column,columnIndex)=>{
            const positionX = elementSize*columnIndex;
            const positionY = elementSize*(rowIndex +1)
            if(column == "O" && !playerPosition.x && !playerPosition.y ){
                playerPosition.x = positionX
                playerPosition.y = positionY
            }
            game.fillText(emojis[column],positionX,positionY)
        })
    })
    // PLAYER
    movePlayer()
};
function movePlayer() {
    game.fillText(emojis["PLAYER"],playerPosition.x+(elementSize/8),playerPosition.y)
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
    elementSize = canvasSize / 10.4
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
function moveUp() {

    if(playerPosition.y > elementSize){
        playerPosition.y -= elementSize
        startGame()
    }
}
function moveLeft() {
    if( playerPosition.x > elementSize){
        playerPosition.x -= elementSize
        startGame()
    }
}
function moveRight() {
    if(playerPosition.x < elementSize*9 ){
        playerPosition.x += elementSize
        startGame()
    }
}
function moveDown() {
    if(playerPosition.y < elementSize*10){
        console.log("bottom");
        playerPosition.y += elementSize
        console.log({playerPosition,elementSize})
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
