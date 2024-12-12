// Initialize canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var startBtn = document.getElementById("start-btn");
var pauseBtn = document.getElementById("pause-btn");
var restartBtn = document.getElementById("restart-btn");
var animationId;
var gameRunning = false;


const upButtonLeft = document.getElementById('up-left');
const downButtonLeft = document.getElementById('down-left');
const upButtonRight = document.getElementById('up-right');
const downButtonRight = document.getElementById('down-right');

let isHolding = false;
// Event listeners for the buttons
upButtonLeft.addEventListener('mousedown', function() {
  moveLeftPaddleUp();  // Call the moveUp function when the up button is pressed
});

downButtonLeft.addEventListener('mousedown', function() {
  moveLeftPaddleDown();  // Call the moveDown function when the down button is pressed
});
upButtonRight.addEventListener('mousedown', function() {
  moveRightPaddleUp();  // Call the moveDown function when the down button is pressed
});
downButtonRight.addEventListener('mousedown', function() {
  moveRightPaddleDown();
});

startBtn.addEventListener("click", function() {
  if (!gameRunning) { // Only start the game if gameRunning is false
    gameRunning = true; // Set gameRunning to true when the game starts
    loop();
  }
});

pauseBtn.addEventListener("click", function() {
  gameRunning = false;
  cancelAnimationFrame(animationId);
});

restartBtn.addEventListener("click", function() {
  document.location.reload();
});

addEventListener("load", (event) => {
  draw();
});

// Define ball properties
var ballRadius = 10;
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballSpeedX = 2;
var ballSpeedY = 2;

// Define paddle properties
var paddleHeight = 80;
var paddleWidth = 10;
var leftPaddleY = canvas.height / 2 - paddleHeight / 2;
var rightPaddleY = canvas.height / 2 - paddleHeight / 2;
var paddleSpeed = 5;

// Define score properties
var leftPlayerScore = 0;
var rightPlayerScore = 0;
var maxScore = 10;

// Listen for keyboard events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Handle key press
var upPressed = false;
var downPressed = false;
let wPressed = false;
let sPressed = false;

function keyDownHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "ArrowDown") {
    downPressed = true;
  } else if (e.key === "w") {
    wPressed = true;
  } else if (e.key === "s") {
    sPressed = true;
  }
}

// Handle key release
function keyUpHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = false;
  } else if (e.key === "ArrowDown") {
    downPressed = false;
  } else if (e.key === "w") {
    wPressed = false;
  } else if (e.key === "s") {
    sPressed = false;
  }
}
function moveRightPaddleUp(){
  if(rightPaddleY > 0){
    rightPaddleY -= paddleSpeed;
  }
}function moveRightPaddleDown(){
  if(rightPaddleY + paddleHeight < canvas.height){
    rightPaddleY += paddleSpeed;
  }
}function moveLeftPaddleUp(){
  if(leftPaddleY > 0){
    leftPaddleY -= paddleSpeed;
  }
}function moveLeftPaddleDown(){
  if(leftPaddleY + paddleHeight < canvas.height){
    leftPaddleY += paddleSpeed;
  }
}
// Update game state
function update() {
  if (!gameRunning) return; // Stop updating if the game is over
  
  // Move paddles
  if (upPressed && rightPaddleY > 0) {
    moveRightPaddleUp();
  } else if (downPressed && rightPaddleY + paddleHeight < canvas.height) {
    moveRightPaddleDown();
  }

  if (wPressed && leftPaddleY > 0) {
    moveLeftPaddleUp();
  } else if (sPressed && leftPaddleY + paddleHeight < canvas.height) {
    moveLeftPaddleDown();
  }

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with top or bottom
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Ball collision with paddles
  if (
    ballX - ballRadius < paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (
    ballX + ballRadius > canvas.width - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Check for scoring
  if (ballX < 0) {
    rightPlayerScore++;
    reset();
  } else if (ballX > canvas.width) {
    leftPlayerScore++;
    reset();
  }

  // Check if a player has won
  if (leftPlayerScore === maxScore) {
    playerWin("Left player");
  } else if (rightPlayerScore === maxScore) {
    playerWin("Right player");
  }
}

function playerWin(player) {
  var message = "Congratulations! " + player + " wins!";
  $('#message').text(message); // Set the message text
  $('#message-modal').modal('show'); // Display the message modal
  
  gameRunning = false; // Stop the game loop
  cancelAnimationFrame(animationId); // Stop the animation frame
}

// Reset ball to center of screen
function reset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = Math.random() * 10 - 5;
}

// Draw objects on canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FFF";
  ctx.font = "15px Arial";

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "#FFF";
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

  ctx.fillText("Score: " + leftPlayerScore, 10, 20);
  ctx.fillText("Score: " + rightPlayerScore, canvas.width - 70, 20);
}

// Game loop
function loop() {
  update();
  draw();
  if (gameRunning) {
    animationId = requestAnimationFrame(loop);
  }
}

$('#message-modal-close').on('click', function() {
  document.location.reload();
});
