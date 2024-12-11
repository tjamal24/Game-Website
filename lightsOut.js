const gridSize = 5; // 5x5 grid
let canClick = true;

// Create the grid
const gameBoard = document.getElementById('game-board');

function setGrid(){
    let numToggles = Math.floor(Math.random() * (gridSize ** 2));
    for(let i = 0; i < numToggles; i++){
      row = Math.floor(Math.random() * gridSize);
       col= Math.floor(Math.random() * gridSize);
       toggle(row, col);
       console.log('clicked: ' + row + col);
       
      // Toggle the adjacent lights
      if (row > 0) toggle(row - 1, col); // Above
      if (row < gridSize - 1) toggle(row + 1, col); // Below
      if (col > 0) toggle(row, col - 1); // Left
      if (col < gridSize - 1) toggle(row, col + 1); // Right
    }
}

function createGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const light = document.createElement('div');
      light.classList.add('light');
      light.dataset.row = i;
      light.dataset.col = j;
      gameBoard.appendChild(light);

      // Add click event to each light
      light.addEventListener('click', toggleLight);
    }
  }
  setGrid();
}

// Toggle the clicked light and its neighbors
function toggleLight(e) {
    if(canClick){
        const clickedLight = e.target;
        const row = parseInt(clickedLight.dataset.row);
        const col = parseInt(clickedLight.dataset.col);

        // Toggle the clicked light
        toggle(row, col);

        // Toggle the adjacent lights
        if (row > 0) toggle(row - 1, col); // Above
        if (row < gridSize - 1) toggle(row + 1, col); // Below
        if (col > 0) toggle(row, col - 1); // Left
        if (col < gridSize - 1) toggle(row, col + 1); // Right
        if(playerShouldWin()){
            congratsMessage.textContent = `You Win!`;
            congratsMessage.classList.add('active');
            resetButton.classList.add('active');
            console.log("yay");
            canClick = false;
        }
}
}

// Reset the game board
resetButton.addEventListener('click', () => {
    setGrid();
    congratsMessage.classList.remove('active');
    canClick = true;
});

function playerShouldWin(){
  const allLights = document.querySelectorAll('.light');
  for (let light of allLights) {
    if (!light.classList.contains('off')) {
      return false; // If any light is still on, the player hasn't won
    }
  }
  return true; // All lights are off, player wins

}
// Toggle light on/off
function toggle(row, col) {
  const light = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  light.classList.toggle('off');
}

// Initialize the grid
createGrid();
