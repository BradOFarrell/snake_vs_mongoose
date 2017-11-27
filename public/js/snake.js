// Turn backend data into variables that can be used by snake.js using handlebars
// const opponentName = "{{opponentName}}";
// const mongoosePath = "{{mongoosePath}}";
// const results = [{{results}}];

// Stores main variables for game
const State = {
    playerName: "Brad",
    opponentName: opponentName, // Imported string, enemy username
    mongoosePath: mongoosePath, // Imported string, enemy path
//    results: results, // Imported array, contains results objects
    isRunning: true,
    boardSize: 7, 
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
    },
    safeCreate: (SpriteObj)=>{
        if(State.board[SpriteObj.x][SpriteObj.y].img.substring(0,5) == "grass"){
            State.board[SpriteObj.x][SpriteObj.y] = SpriteObj;     
            State.board[SpriteObj.x][SpriteObj.y].updateSprite();     
        }
    },
    gameOver: (x,y)=>{
        State.isRunning = false;
        View.updateClock("Game Over");
        View.spillBlood(x,y);
        View.turnBodyRed();
        setTimeout(window.location.reload.bind(window.location), 1000);
    },
    timeOver: ()=>{
        State.isRunning = false;
        View.showResults()
        $("#usernameBox").focus();        
        $("#myLog").val(State.snake.log)
        $("#myScore").val(State.snake.score)
        $("#opponentScore").val(State.mongoose.score)
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
    },
    spillBlood: (x,y)=> {
        $("#x"+x+"y"+y).addClass("blood");
        console.log("#x"+x+"y"+y+" bloodied")
    },
    updateClock: (time)=>{
        $("#clock").html(time);
    },
    turnBodyRed: ()=>{
        $(document.body).addClass("blood");
    },
    showResults: ()=>{
        $("#gamePage").remove();
        $("#resultsPage").css("visibility", "visible");
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
        this.img = "apple_spawn";
        this.timer = 10;
    }
    onEachTurn(turn){
        if(turn % 2 == 0){            
            this.timer--;
            if(this.timer < 9){
                this.img = "apple";
                this.updateSprite();    
            }
            if(this.timer < 4 && this.timer > 0){
                this.img = "apple_"+this.timer;
                this.updateSprite();
            } else if(this.timer == 0){
                this.replaceWith(new Grass(this.x, this.y));
            }
        }
    }
}

// Handles player-related data
class Snake extends Sprite {
    constructor(x,y){
        super(x,y);
        this.currentlyFacing = "s";
        this.lastMove = "s";
        this.log = "";
        this.lastTurnMoved = 0;
        this.bodyTimer = 3;
        this.score = 0;
        this.img ="snake_head_s"
    }
    rotate(direction){
        // Prevent head from moving backwards or forwards
        if(!((this.lastMove == "s" && direction == "n")
           ||(this.lastMove == "n" && direction == "s")
           ||(this.lastMove == "e" && direction == "w")
           ||(this.lastMove == "w" && direction == "e"))) {
            // Update movement direction
            this.currentlyFacing = direction;
            this.img = "snake_head_"+direction;
            this.updateSprite();
         }
    }
    onEachTurn(turn){
        if((this.lastTurnMoved < turn) && (turn % 2 == 1)){
            // Store old variables before they get transformed
            let oldX = this.x;
            let oldY = this.y;

            // Change position based on directional input
            if(this.currentlyFacing == "n")
                this.x--;
            if(this.currentlyFacing == "s")
                this.x++;
            if(this.currentlyFacing == "e")
                this.y++;
            if(this.currentlyFacing == "w")
                this.y--;                

            // Prevent turning backwards:
            this.lastMove = this.currentlyFacing;            
            this.log+=this.lastMove;
            console.log(this.log);

            // Check for game over conditions - colliding with walls,
            // or anything other than apple or grass
            if((this.x < 0 || this.x == State.boardSize)
            || (this.y < 0 || this.y == State.boardSize)
            || !((State.board[this.x][this.y].img.substring(0,5) == "apple")
            || (State.board[this.x][this.y].img.substring(0,5) == "grass")
            )){
                State.gameOver(oldX,oldY)
                this.x = oldX;
                this.y = oldY;
                console.log("Game over");
                // Otherwise allow the Snake to proceed
            } else {
                // Check for apples
                if(State.board[this.x][this.y].img.substring(0,5) == "apple"){
                    console.log("OmNomNom!");
                    this.bodyTimer++;
                    this.score++;
                    for(let i = 0; i < State.boardSize; i++){
                        for(let j = 0; j < State.boardSize; j++){
                            if(State.board[i][j].img.substring(0,5) == "snake")
                            State.board[i][j].timer++;
                        }
                    }
                }


                // Update position on the board
                State.board[this.x][this.y] = this
                this.updateSprite();
                this.lastTurnMoved = turn;

                // Replace old tile with snake body
                let newBody = new SnakeBody(oldX,oldY);
                State.board[oldX][oldY] = newBody;
                newBody.updateSprite();            
            }
        }
    }
}

// Snake body placed on tiles when the snake moves, references State.snake
class SnakeBody extends Sprite {
    constructor(x,y){
        super(x,y);
        this.timer = State.snake.bodyTimer;
        this.img = "snake_body";
    }
    onEachTurn(turn){
        if(turn % 2 == 0){
            this.timer--;
            if(this.timer == 1){
            this.img = "snake_tail"
            this.updateSprite();
            } else if(this.timer == 0){
                this.replaceWith(new Grass(this.x, this.y));
            }
        }
    }
}

// HAndles opponent-related data
class Mongoose extends Sprite {
    constructor(x,y){
        super(x,y);
        this.inputLog = State.mongoosePath;
        this.logNext = "n"
        this.logRotate = "n"
        this.delay = 2;
        this.lastTurnMoved = 0;
        this.bodyTimer = 3;
        this.score = 0;
        this.img ="mongoose_head_n"
    }
    onEachTurn(turn){

        // Add slight delay
        turn = turn -this.delay;

        if(turn % 2 == 1){
            this.img = "mongoose_head_"+this.logRotate;
            this.updateSprite();            
        }
        if((this.lastTurnMoved < turn) && (turn % 2 == 0)){             
        // Store old variables before they get transformed
        let oldX = this.x;
        let oldY = this.y;
        
        // Get next move, and next head-tilt, flip it (cuz it's based on Snake log)
        this.logNext = this.flipLetter(this.inputLog.charAt(((turn)/2)-1))
        this.logRotate = this.flipLetter(this.inputLog.charAt(((turn)/2)))

        // Update image based on flipped logNext value
        this.img = "mongoose_head_"+this.logNext

        console.log("MONGOOSE:" +this.logNext)

        // Decide direction based on log
        if(this.logNext == "n")
            this.x--;
        if(this.logNext == "s")
            this.x++;
        if(this.logNext == "e")
            this.y++;                
        if(this.logNext == "w")
            this.y--;
        
        // Check for game over conditions
        if((this.x < 0 || this.x == State.boardSize)
        || (this.y < 0 || this.y == State.boardSize)
        || (State.board[this.x][this.y].img.substring(0,10) == "snake_head")
        ){
            State.gameOver(oldX,oldY)
            this.x = oldX;
            this.y = oldY;
            console.log("Game over");
            // Otherwise allow the Snake to proceed
        } else {
            // Check for apples
            if(State.board[this.x][this.y].img.substring(0,5) == "apple"){
                console.log("OmNomNom!");
                this.bodyTimer++;
                this.score++;                
                for(let i = 0; i < State.boardSize; i++){
                    for(let j = 0; j < State.boardSize; j++){
                        if(State.board[i][j].img.substring(0,8) == "mongoose")
                        State.board[i][j].timer++;
                    }
                }
            }
            // Update position on the board
            State.board[this.x][this.y] = this
            this.updateSprite();
            this.lastTurnMoved = turn;

            // Replace old tile with snake body
            let newBody = new MongooseBody(oldX,oldY);
            State.board[oldX][oldY] = newBody;
            newBody.updateSprite();            
            }
        }
    }
    flipLetter(l){
    if(l == "n")
        return "s";
    else if(l == "s")
        return "n";
    else if(l == "e")
        return "w";
    else if(l == "w")
        return "e";
    else
        return "s"
    }
}

class MongooseBody extends Sprite {
    constructor(x,y){
        super(x,y);
        this.timer = State.mongoose.bodyTimer;
        this.img = "mongoose_body"
    }
    onEachTurn(turn){
        if(turn % 2 == 0){             
            this.timer--;
            if(this.timer == 1){
            this.img = "mongoose_tail"
            this.updateSprite();
            } else if(this.timer == 0){
                this.replaceWith(new Grass(this.x, this.y));
            }
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
    let newClock = 30 - (turn / 2);
    let clockDisplay = newClock;

    // Add apples based on turn number. (Hardcoded and important to ghost data)
    if(newClock == 29){
        State.safeCreate(new Apple(1,5));
        State.safeCreate(new Apple(5,1));
    }
    if(newClock == 26){
        State.safeCreate(new Apple(3,3));
    }
    if(newClock == 20){
        State.safeCreate(new Apple(0,0));
        State.safeCreate(new Apple(6,6));
        State.safeCreate(new Apple(0,6)); 
        State.safeCreate(new Apple(6,0));
        State.safeCreate(new Apple(3,0));
        State.safeCreate(new Apple(3,6));
        State.safeCreate(new Apple(0,3)); 
        State.safeCreate(new Apple(6,3));
    }
    if(newClock == 13){
        State.safeCreate(new Apple(3,3));     
    }
    if(newClock == 12){
        State.safeCreate(new Apple(2,3));     
        State.safeCreate(new Apple(3,2));     
        State.safeCreate(new Apple(4,3));     
        State.safeCreate(new Apple(3,4));     
    }
    if(newClock == 11){
        State.safeCreate(new Apple(1,5));             
        State.safeCreate(new Apple(5,1));     
        State.safeCreate(new Apple(1,1));     
        State.safeCreate(new Apple(5,5));     
    }
    if(newClock == 10){
        State.safeCreate(new Apple(0,1));     
        State.safeCreate(new Apple(1,0));     
        State.safeCreate(new Apple(5,6));     
        State.safeCreate(new Apple(6,5));     

        State.safeCreate(new Apple(1,6));     
        State.safeCreate(new Apple(0,5));     
        State.safeCreate(new Apple(6,1));     
        State.safeCreate(new Apple(5,0));     
    }
    if(newClock == 9){
        State.safeCreate(new Apple(0,0));     
        State.safeCreate(new Apple(6,6));     
        State.safeCreate(new Apple(6,0));     
        State.safeCreate(new Apple(0,6));     
    }

    // Run logic for every object on the board
    for(let i = 0; i < State.boardSize; i++){
        for(let j = 0; j < State.boardSize; j++){
            State.board[i][j].onEachTurn(turn);
        }
    }

    // Update clock display
    if(turn % 2 == 0){
        if (newClock <= 10){
            clockDisplay = "<span style='color:red'>"+newClock+"</span>"            
        } else if(newClock <= 20){
            clockDisplay = "<span style='color:yellow'>"+newClock+"</span>"
        }
        View.updateClock(clockDisplay);
    }

    // End loop at 30 seconds
    if(newClock < 0 && State.isRunning){
        State.timeOver()
    }

    // Check to see if game is still running
    if(State.isRunning){
        setTimeout(()=>{loop(interval, turn)},interval);
    } else {
        View.updateClock("<span style='color:red'>Game Over</span>");
    }
}

// Run initial functionality when page is fully loaded
function main(){
    State.initializeData();
    View.initializeHTML();
    loop(500,0);
}
$(document).attr("onload",main());