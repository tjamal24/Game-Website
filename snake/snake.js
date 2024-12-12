const snakeboard = document.getElementById("gameCanvas");
const snakeboard_ctx = gameCanvas.getContext("2d");
const centerX = snakeboard.offsetWidth/2;
const centerY = snakeboard.offsetHeight/2;
const upButton = document.getElementById('up');
const downButton = document.getElementById('down');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const pixelSize = 10;
let snake = [  {x: centerX, y: centerY},  {x: centerX - pixelSize, y: centerY}, 
            {x: centerX - 2 * pixelSize, y: centerY}, {x: centerX - 3 * pixelSize, y: centerY},
            {x: centerX - 4 * pixelSize, y: centerY}];
const board_border = 'black';
const board_background = "white";
const snake_col = 'lightblue';
const snake_border = 'darkblue';
let victory = false;
let score = 0;
// True if changing direction
let changing_direction = false;
let food_x;
let food_y;
// Horizontal velocity, will move 1 pixel per frame
let dx = pixelSize;
// Vertical velocity
let dy = 0;  
genFood();
main();


// Event listeners for the buttons
upButton.addEventListener('click', function() {
  moveUp();  // Call the moveUp function when the up button is pressed
});

downButton.addEventListener('click', function() {
  moveDown();  // Call the moveDown function when the down button is pressed
});

leftButton.addEventListener('click', function() {
  moveLeft();  // Call the moveLeft function when the left button is pressed
});

rightButton.addEventListener('click', function() {
  moveRight();  // Call the moveRight function when the right button is pressed
});

function randomFood(min, max){  
    return Math.round((Math.random() * (max-min) + min) / pixelSize) * pixelSize;
 }
  
 function genFood(){  
      // Generate a random number the food x-coordinate
      food_x = randomFood(0, snakeboard.width - pixelSize);
      // Generate a random number for the food y-coordinate
      food_y = randomFood(0, snakeboard.height - pixelSize);
      // if the new food location is where the snake currently is, generate a new food location
      snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) genFood();
      });
 }
 function foodSpawnedInsideSnake(){
    snake.forEach(part =>{
        if(part.x == food_x && part.y == food_y){
            return true;
        }
    });
    return false;
 }
 function drawFood(){
       snakeboard_ctx.fillStyle = 'lightgreen';
       snakeboard_ctx.strokestyle = 'darkgreen';
       snakeboard_ctx.fillRect(food_x, food_y, pixelSize, pixelSize);
       snakeboard_ctx.strokeRect(food_x, food_y, pixelSize, pixelSize);
 }
 

function drawSnakePart(snakePart){  
  snakeboard_ctx.fillStyle = 'lightblue';  
  snakeboard_ctx.strokestyle = 'darkblue';
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, pixelSize, pixelSize);  
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, pixelSize, pixelSize);
}

function drawSnake(){  
  snake.forEach(drawSnakePart);
}

function clearCanvas(){
    snakeboard_ctx.fillStyle = board_background;
    snakeboard_ctx.strokestyle = board_border;
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}
function moveSnake(){  
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  //console.log(snake[0].x + "   " +  snake[0].y)
  snake.unshift(head);

  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    score += 10;
    document.getElementById('score').textContent = score;
    if(score > 9990){
        victory = true;
    }

    // Generate new food location
    genFood();
  } else {
    // Remove the last part of snake body
    snake.pop();
  }
}

function moveUp(){
  const goingDown = dy === pixelSize;
  if(!goingDown){
    dx = 0;
    dy = -pixelSize;
  }
}
function moveDown(){
  const goingUp = dy === -pixelSize;
  if(!goingUp){
    
    dx = 0;
    dy = pixelSize;

  }
}

function moveLeft(){
  const goingRight = dx === pixelSize;  
  if(!goingRight){

    dx = -pixelSize;
    dy = 0;
  }
}
function moveRight(){ 
  const goingLeft = dx === -pixelSize;
  if(!goingLeft){
    dx = pixelSize;
    dy = 0;

  }
}

function change_direction(event){  
   const LEFT_KEY = 37;
   const RIGHT_KEY = 39;
   const UP_KEY = 38;
   const DOWN_KEY = 40;
 
   const keyPressed = event.keyCode;
 
     if (keyPressed === LEFT_KEY){ 
      moveLeft();    
     }
 
     if (keyPressed === UP_KEY){    
      moveUp();
     }
 
     if (keyPressed === RIGHT_KEY ){    
      moveRight();
     }
 
     if (keyPressed === DOWN_KEY ){    
      moveDown();
     }
}

function gameIsOver(){ 
  for (let i = 4; i < snake.length; i++){    
    const has_collided = snake[i].x === snake[0].x && snake[i].y === snake[0].y
    if (has_collided) 
      return true
   }
   const hitLeftWall = snake[0].x < 0;
   const hitRightWall = snake[0].x > snakeboard.width - pixelSize;
   const hitToptWall = snake[0].y < 0;
   const hitBottomWall = snake[0].y > snakeboard.height - pixelSize;
   return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

function main(){
    if(!gameIsOver() && !victory){
        setTimeout(function onTick() {
            clearCanvas();
            document.addEventListener("keydown", change_direction);
            moveSnake();
            drawSnake();
            drawFood();
            // Call main again
            main();
        }, 100)
    }else{
        if(victory){
            congratsMessage.textContent = `You Win :)`;
            congratsMessage.classList.add('active');
        }else{
            congratsMessage.textContent = `You Lose :(`;
            congratsMessage.classList.add('active');
        }
    }
}