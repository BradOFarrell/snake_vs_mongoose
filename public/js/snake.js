// Turn backend data into variables that can be used by snake.js using handlebars
// const opponentName = "{{opponentName}}";
// const mongoosePath = "{{mongoosePath}}";
// const results = [{{results}}];

// Stores main variables for game
const State = {
    playerName: "Brad",
    opponentName: opponentName,
    boardSize: 5, 
    snake: {},
    mongoose: {},
    board: new Array(this.boardSize),
    initializeData: ()=> {
        for(let i = 0; i < State.boardSize; i++){
            State.board[i] = new Array(State.boardSize);
            for(let j = 0; j < State.boardSize; j++){
                State.board[i][j] = new Grass(i,j);
                console.log("Created: "+i+","+j+" which contains "+State.board[i][j].img+"!");
            }
        }

        State.snake = new Snake(1,1)        
        State.board[1][1] = State.snake;
        console.log("Assigned snake to 1, 1!");
        
        State.mongoose = new Mongoose(State.boardSize-1,State.boardSize-2)
        State.board[State.boardSize-1][State.boardSize-2] = State.mongoose;
        console.log("Assigned mongoose to "+(State.boardSize-1)+","+(State.boardSize-2)+"!");
        
        State.board[2][2] = new Apple(2,2);
    }
}

// Updates the HTML based on game state
const View = {
    initializeHTML: ()=> {
        let outputHTML = ""
        for(let i = 0; i < State.boardSize; i++){
            for(let j = 0; j < State.boardSize; j++){
                outputHTML+="<img src='/img/"+State.board[i][j].img+".png' id='x"+i+"y"+j+"'>";
            }
            outputHTML+="</br>";            
        }
        $('#gameBoard').html(outputHTML);
//        View.updateImage(2,3,"apple");
//        View.updateImage(0,0,"snake_body");
        console.log("Created HTML Block: "+outputHTML);
    },
    updateImage: (x,y,img)=> {
        $("#x"+x+"y"+y).attr("src","img/"+img+".png");
        console.log("#x"+x+"y"+y+" set to img/"+img+".png");
    }
}

class Sprite {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.img = "apple";
    }
    onEachTurn(turn){
        console.log("["+this.x+","+this.y+"] Sprite: "+this.img)
    }
    updateSprite(imgName){
        this.img = imgName;
        View.updateImage(this.x,this.y,imgName);
    }
}

class Grass extends Sprite {
    constructor(x,y){
        super(x,y);
        this.img = "grass";
    }
    onEachTurn(turn){   
        console.log("Grasssssss tastes bad!");
    }
}

class Body extends Sprite {
    constructor(x,y,timer,img){
        super(x,y);
        this.timer = timer;
        this.img = img;
    }
}

class Apple extends Sprite {
    constructor(x,y){
        super(x,y);
        this.img = "apple";
        this.timer = 5;
    }
    onEachTurn(turn){
        this.timer--;
        if(this.timer < 3){
            this.img = "apple_"+this.timer;
        } else if(this.timer == 0){
            State.board[this.x][this.y] = new Grass(this.x,this.y);
        }
    }
}

// HAndles opponent-related data
class Mongoose extends Sprite {
    constructor(x,y){
        super(x,y);
        this.direction = "n";
        this.lastMove = "n";
        this.img ="mongoose_head_n"
    }
}

// Handles player-related data
class Snake extends Sprite {
    constructor(x,y){
        super(x,y);
        this.direction = "s";
        this.lastMove = "s";
        this.img ="snake_head_s"
    }
    rotate(d){
        // Prevent head from moving backwards or forwards
        if(!((this.lastMove == "s" && d == "n")
           ||(this.lastMove == "n" && d == "s")
           ||(this.lastMove == "e" && d == "w")
           ||(this.lastMove == "w" && d == "e"))
           && (this.lastMove != d)) {
            // Update movement direction
            this.direction = d;
            this.lastMove = d;
            View.updateImage(this.x,this.y,"snake_head_"+d);
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
        State.snake.rotate("n");
        break;
    case "ArrowDown":
        State.snake.rotate("s");
        break;
    case "ArrowLeft":
        State.snake.rotate("w");
        break;
    case "ArrowRight":
        State.snake.rotate("e");
        break;
    default:
        return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

// Real time gameplay loop
function loop(interval, turn){
    turn++;
    for(let i = 0; i < State.boardSize; i++){
        for(let j = 0; j < State.boardSize; j++){
            State.board[i][j].onEachTurn(0);
        }
    }
    console.log(turn);
    setTimeout(()=>{loop(interval, turn)},interval);
}

// Run initial functionality when page is fully loaded
function main(){
    State.initializeData();
    View.initializeHTML();
    loop(1000,0);
}
$(document).attr("onload",main());