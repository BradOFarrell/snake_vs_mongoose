// Turn backend data into variables that can be used by snake.js using handlebars
// const opponentName = "{{opponentName}}";
// const mongoosePath = "{{mongoosePath}}";
// const results = [{{results}}];

// Stores main variables for game
const State = {
    playerName: "Brad",
    opponentName: opponentName,
    mongoosePath: mongoosePath,
    results: results,
    boardSize: 6, 
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

        State.snake = new Snake(0,1)        
        State.board[0][1] = State.snake;
        console.log("Assigned snake to 0, 1!");
        
        State.mongoose = new Mongoose(State.boardSize-1,State.boardSize-2)
        State.board[State.boardSize-1][State.boardSize-2] = State.mongoose;
        console.log("Assigned mongoose to "+(State.boardSize-1)+","+(State.boardSize-2)+"!");
        
        State.board[2][2] = new Apple(2,2);
    }
}

// Updates the HTML based on game state
const View = {
    initializeHTML: ()=> {
        let outputHTML = "";
        let styling = "light";
        for(let i = 0; i < State.boardSize; i++){
            for(let j = 0; j < State.boardSize; j++){
                if(j%2 == i%2){
                    styling = "dark";
                } else {
                    styling = "light";
                }
                outputHTML+="<img src='/img/"+State.board[i][j].img+".png' id='x"+i+"y"+j+"' class='"+styling+"'>";
            }
            outputHTML+="</br>";            
        }
        $('#gameBoard').html(outputHTML);
        console.log("Created HTML Block: "+outputHTML);
    },
    changeSrc: (x,y,img)=> {
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
    }
    updateSprite(){
        View.changeSrc(this.x,this.y,this.img);
    }
    replaceWith(Obj){
        State.board[this.x][this.y] = Obj;
        State.board[this.x][this.y].updateSprite();
    }
}

class Grass extends Sprite {
    constructor(x,y){
        super(x,y);
        this.img = "grass";
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
        if(this.timer < 4 && this.timer > 0){
            this.img = "apple_"+this.timer;
            this.updateSprite();
        } else if(this.timer == 0){
            this.replaceWith(new Grass(this.x, this.y));
        }
    }
}

// Handles player-related data
class Snake extends Sprite {
    constructor(x,y){
        super(x,y);
        this.currentlyFacing = "s";
        this.lastMove = "s";
        this.lastTurnMoved = 0;
        this.img ="snake_head_s"
    }
    rotate(direction){
        // Prevent head from moving backwards or forwards
        if(!((this.lastMove == "s" && direction == "n")
           ||(this.lastMove == "n" && direction == "s")
           ||(this.lastMove == "e" && direction == "w")
           ||(this.lastMove == "w" && direction == "e"))
           && (this.lastMove != direction)) {
            // Update movement direction
            this.currentlyFacing = direction;
            this.lastMove = direction;
            this.img = "snake_head_"+direction;
            this.updateSprite();
         }
    }
    onEachTurn(turn){
        console.log(this.lastTurnMoved+" "+turn);
        if(this.lastTurnMoved < turn){
            // Turn old panel into body panel
            let oldX = this.x;
            let oldY = this.y;
            let newBody = new SnakeBody(oldX,oldY);
            State.board[oldX][oldY] = newBody;
            newBody.updateSprite();

            // Change position based on directional input
            if(this.currentlyFacing == "n")
                this.x--;
            if(this.currentlyFacing == "s")
                this.x++;
            if(this.currentlyFacing == "e")
                this.y++;
            if(this.currentlyFacing == "w")
                this.y--;

            // Update position on the board
            State.board[this.x+1][this.y] = this
            this.updateSprite();
            this.lastTurnMoved = turn;
        }
    }
}

// Snake body placed on tiles when the snake moves, references State.snake
class SnakeBody extends Sprite {
    constructor(x,y){
        super(x,y);
        this.timer = 2;
        this.img = "snake_body"
    }
    onEachTurn(turn){
        this.timer--;
        if(this.timer == 1){
        this.img = "snake_tail"
        this.updateSprite();
        } else if(this.timer == 0){
            this.replaceWith(new Grass(this.x, this.y));
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

class MongooseBody extends Sprite {
    constructor(x,y){
        super(x,y);
        this.timer = timer;
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
            State.board[i][j].onEachTurn(turn);
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