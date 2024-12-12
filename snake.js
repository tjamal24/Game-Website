const snakeboard = document.getElementById("gameCanvas");
const snakeboard_ctx = gameCanvas.getContext("2d");
const centerX = snakeboard.offsetWidth/2;
const centerY = snakeboard.offsetHeight/2;
let snake = [  {x: centerX, y: centerY},  {x: centerX - 10, y: centerY},  {x: centerX - 20, y: centerY}, {x: centerX - 30, y: centerY}];
const board_border = 'black';
const board_background = "white";
const snake_col = 'lightblue';
const snake_border = 'darkblue';
let canPlay = true;
// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;    
main();

function drawSnakePart(snakePart){  
  snakeboard_ctx.fillStyle = 'lightblue';  
  snakeboard_ctx.strokestyle = 'darkblue';
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);  
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
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
  const head = {x: snake[0].x + dx, y: snake[0].y};
  snake.unshift(head);
  snake.pop();
}
function change_direction(event){  
   const LEFT_KEY = 37;
   const RIGHT_KEY = 39;
   const UP_KEY = 38;
   const DOWN_KEY = 40;
 
   const keyPressed = event.keyCode;
   const goingUp = dy === -10;
   const goingDown = dy === 10;
   const goingRight = dx === 10;  
   const goingLeft = dx === -10;
 
     if (keyPressed === LEFT_KEY && !goingRight)
     {    
          dx = -10;
          dy = 0;  
     }
 
     if (keyPressed === UP_KEY && !goingDown)
     {    
          dx = 0;
          dy = -10;
     }
 
     if (keyPressed === RIGHT_KEY && !goingLeft)
     {    
          dx = 10;
          dy = 0;
     }
 
     if (keyPressed === DOWN_KEY && !goingUp)
     {    
          dx = 0;
          dy = 10;
     }
}
function gameIsOver(){ 
  for (let i = 4; i < snake.length; i++){    
    const has_collided = snake[i].x === snake[0].x && snake[i].y === snake[0].y
    if (has_collided) 
      return true
   }
   return false;
}

function main(){
    if(!gameIsOver()){
        setTimeout(function onTick() {
            clearCanvas();
            document.addEventListener("keydown", change_direction);
            moveSnake();
            drawSnake();
            // Call main again
            main();
        }, 100)
    }else{
        Document.getElementById("lossMessage").classList.add("acti")
    }
}