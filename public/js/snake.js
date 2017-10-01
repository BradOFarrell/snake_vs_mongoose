// Turn backend data into variables that can be used by snake.js using handlebars
// const opponentName = "{{opponentName}}";
// const mongoosePath = "{{mongoosePath}}";
// const results = [{{results}}];

// Stores main variables for game
const State = {
    board: [[],[]],
    boardSize: 5, 
    playerName: "Brad",
    opponentName: opponentName
}

// Updates the HTML based on game state
const View = {
    createStage: ()=> {
        let outputHTML = ""
        for(let i = 0; i < State.boardSize; i++){
            for(let j = 0; j < State.boardSize; j++){
                outputHTML+="<img src='/img/grass.png' id='x"+i+"y"+j+"'>";
            }
            outputHTML+="</br>";            
        }
        $('#gameBoard').html(outputHTML);
//        View.updateImage(2,3,"apple");
//        View.updateImage(0,0,"snake_body");
        console.log(outputHTML);
    },
    updateImage: (x,y,imgName)=> {
        $("#x"+x+"y"+y).attr("src","img/"+imgName+".png");
        console.log("#x"+x+"y"+y+" set to img/"+imgName+".png");
    }
}

class Body {
    constructor(x,y,timer){
        this.x = x;
        this.y = y;
        this.timer = timer;
    }
}

class Apple {
    constructor(x,y,timer){
        this.x = x;
        this.y = y;
        this.timer = timer;
    }
}

// HAndles opponent-related data
const Mongoose = {
    
}

// Handles player-related data
const Snake = {
    direction: "s",
    lastMove: "s",
    x: 0,
    y: 0,
    turn: (d)=>{
        // Prevent head from moving backwards or forwards
        if(!((Snake.lastMove == "s" && d == "n")
           ||(Snake.lastMove == "n" && d == "s")
           ||(Snake.lastMove == "e" && d == "w")
           ||(Snake.lastMove == "w" && d == "e"))
           && (Snake.lastMove != d)) {
            // Update movement direction
            Snake.direction = d;
            Snake.lastMove = d;
            View.updateImage(Snake.x,Snake.y,"snake_head_"+d);
            View.updateImage(2,1,"snake_head_w");    
         }
    }
}

// Capture player input, send it to the Snake object
$(document).keydown((e)=> {
    if (e.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }    
    switch(e.key) {
    case "ArrowUp":
        Snake.turn("n");
        break;
    case "ArrowDown":
        Snake.turn("s");
        break;
    case "ArrowLeft":
        Snake.turn("w");
        break;
    case "ArrowRight":
        Snake.turn("e");
        break;
    default:
        return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

// Run initial functionality when page is fully loaded
function main(){
    View.createStage();    
}
$(document).attr("onload",main());