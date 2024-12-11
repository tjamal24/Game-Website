// Game settings
const GRAVITY = 0.125;
const FLAP_STRENGTH = -5;
const PIPE_WIDTH = 60;
const PIPE_SPACING = 200;
const PIPE_GAP = 150;
const PIPE_SPEED = 2;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 40;

// DOM elements
const bird = document.getElementById("bird");
const gameContainer = document.getElementById("game-container");
const gameOverText = document.getElementById("game-over");
const pauseMenu = document.getElementById("pause-menu");
const pauseButton = document.getElementById("pause-button");
const resumeButton = document.getElementById("resume-button");
const restartButton = document.getElementById("restart-button");

let birdY = 200;  // Bird's vertical position
let birdVelocity = 0; // Bird's velocity
let isFlapping = false;
let isGameOver = false;
let isPaused = false;  // To track if the game is paused
let pipes = []; // List of pipes
let score = 0;

// Game loop
function gameLoop() {
  if (isGameOver || isPaused) return; // Stop game loop if paused or game over

  birdVelocity += GRAVITY;
  birdY += birdVelocity;

  // Flap the bird upwards
  if (isFlapping) {
    birdVelocity = FLAP_STRENGTH;
    isFlapping = false;
  }

  // Update bird's position
  bird.style.top = birdY + "px";

  // Check for game over conditions
  if (birdY <= 0 || birdY + BIRD_HEIGHT >= gameContainer.clientHeight) {
    gameOver();
  }

  // Generate and move pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x <= gameContainer.clientWidth - PIPE_SPACING) {
    createPipe();
  }

  // Move pipes
  pipes.forEach((pipe, index) => {
    pipe.x -= PIPE_SPEED;

    // Check if the pipe DOM elements exist before trying to update their position
    const topPipe = document.querySelector(`#pipe-${index}-top`);
    const bottomPipe = document.querySelector(`#pipe-${index}-bottom`);

    if (topPipe && bottomPipe) {
      topPipe.style.left = pipe.x + "px";
      bottomPipe.style.left = pipe.x + "px";
    }

    // Check for collisions
    if (
      pipe.x <= 50 + BIRD_WIDTH &&
      pipe.x + PIPE_WIDTH >= 50 &&
      (birdY <= pipe.topHeight && birdY + BIRD_HEIGHT >= pipe.bottomHeight)
    ) {
      gameOver();
    }

    // Remove off-screen pipes
    if (pipe.x + PIPE_WIDTH < 0) {
      // Remove the pipe elements from the DOM
      const topPipe = document.querySelector(`#pipe-${index}-top`);
      const bottomPipe = document.querySelector(`#pipe-${index}-bottom`);
      if (topPipe && bottomPipe) {
        console.log(topPipe);
        console.log(bottomPipe);
        console.log(gameContainer.removeChild(topPipe));
        console.log(gameContainer.removeChild(bottomPipe));
        topPipe.innerHTML = "";
        bottomPipe.innerHTML = "";
        topPipe.remove();
        bottomPipe.remove();
        console.log(topPipe);
      }

      // Remove the pipe from the pipes array
      pipes.splice(index, 1);
      score++;
    }
  });

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game
function startGame() {
  birdY = 200;
  birdVelocity = 0;
  pipes = [];
  score = 0;
  isGameOver = false;
  isPaused = false;
  gameOverText.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  gameLoop();
}

// Create a new pipe pair
function createPipe() {
  const pipeTopHeight = Math.floor(Math.random() * (gameContainer.clientHeight - PIPE_GAP));
  const pipeBottomHeight = gameContainer.clientHeight - pipeTopHeight - PIPE_GAP;

  const pipeTop = document.createElement("div");
  pipeTop.classList.add("pipe", "pipe-top");
  pipeTop.style.height = pipeTopHeight + "px";
  pipeTop.id = "pipe-" + pipes.length + "-top";

  const pipeBottom = document.createElement("div");
  pipeBottom.classList.add("pipe", "pipe-bottom");
  pipeBottom.style.height = pipeBottomHeight + "px";
  pipeBottom.id = "pipe-" + pipes.length + "-bottom";

  gameContainer.appendChild(pipeTop);
  gameContainer.appendChild(pipeBottom);

  pipes.push({
    x: gameContainer.clientWidth,
    topHeight: pipeTopHeight,
    bottomHeight: pipeBottomHeight,
  });
}

// Handle bird flap
document.addEventListener("keydown", function (e) {
  if (e.key === " " && !isGameOver && !isPaused) {
    isFlapping = true;
  }

  if (e.key === "Enter" && isGameOver) {
    startGame();
  }
});

// Pause button click event
pauseButton.addEventListener("click", function () {
  if (!isGameOver) {
    isPaused = true;
    pauseMenu.classList.remove("hidden");
  }
});

// Resume button click event
resumeButton.addEventListener("click", function () {
  isPaused = false;
  pauseMenu.classList.add("hidden");
  gameLoop();
});


// Game over function
function gameOver() {
  isGameOver = true;
  gameOverText.classList.remove("hidden");
}

// Start the game on page load
window.onload = function () {
  startGame();
};