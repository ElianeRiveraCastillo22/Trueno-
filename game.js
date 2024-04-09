const canvas = document.querySelector(".gameConsole__screen");

/**
 * @type {HTMLCanvasElement}
*/
const game = canvas.getContext("2d");

let canvasSize;
let elementSize;

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function startGame() {
    game.font = elementSize + "px  Verdana"
    game.textAlign ="start"
    const map = maps[0]
    const  rowsMaps = map.trim().split("\n")
    const  mapRowsColums = rowsMaps.map((row)=>row.trim().split(''))

    mapRowsColums.forEach((row,rowIndex)=>{
        row.forEach((column,columnIndex)=>{
            const positionX = elementSize*columnIndex;
            const positionY = elementSize*(rowIndex +1)
            game.fillText(emojis[column],positionX,positionY)
        })
    })

};

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
        calculateCanvasSize(0.1)
    }else{
        calculateCanvasSize(0.1)
    }
    elementSize = canvasSize / 10.4
    startGame()
};
