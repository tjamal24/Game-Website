const columns = 7;
const rows = 6;
let currentPlayer = 'red';
const board = Array.from({ length: rows }, () => Array(columns).fill(null));

const gameBoard = document.getElementById('gameBoard');
const resetButton = document.getElementById('resetButton');
const congratsMessage = document.createElement('div');
congratsMessage.classList.add('congrats-message');
document.body.appendChild(congratsMessage);

// Initialize the game board grid
function createBoard() {
    gameBoard.innerHTML = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            gameBoard.appendChild(cell);
        }
    }
}

// Handle dropping discs
function dropDisc(event) {
    const col = event.target.dataset.col;
    if (checkGameOver()) return; // If game over, prevent any more moves.

    for (let row = rows - 1; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
            cell.classList.add(currentPlayer);
            if (checkWinner(row, col)) {
                showWinner(currentPlayer); // Display the win message
                return;  // Stop the game
            }
            currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
            return;
        }
    }
}

// Show the winner message
function showWinner(player) {
    congratsMessage.textContent = `${player.charAt(0).toUpperCase() + player.slice(1)} Wins!`;
    congratsMessage.classList.add('active');
    setTimeout(() => congratsMessage.classList.remove('active'), 3000);
}

// Check for a winner
function checkWinner(row, col) {
    const directions = [
        { dr: 0, dc: 1 },  // horizontal
        { dr: 1, dc: 0 },  // vertical
        { dr: 1, dc: 1 },  // diagonal down-right
        { dr: 1, dc: -1 }  // diagonal down-left
    ];

    // Check each direction for a possible winner
    for (const { dr, dc } of directions) {
        let count = 1; // Start counting from the current disc
        let i = 1;

        // Check in the positive direction (e.g., right for horizontal, down-right for diagonal)
        while (board[row + dr * i]?.[col + dc * i] === currentPlayer) {
            count++;
            i++;
        }

        // Check in the negative direction (e.g., left for horizontal, up-left for diagonal)
        i = 1;
        while (board[row - dr * i]?.[col - dc * i] === currentPlayer) {
            count++;
            i++;
        }

        // If we have 4 or more discs in a row, return true
        if (count >= 4) {
            return true;
        }
    }
    return false;
}

// Check if the game is over
function checkGameOver() {
    // If there's a winner, the game is over
    if (congratsMessage.classList.contains('active')) {
        return true;
    }
    return false;
}

resetButton.addEventListener('click', () => {
    board.forEach(row => row.fill(null));
    currentPlayer = 'red';
    createBoard();
    congratsMessage.classList.remove('active');
});

gameBoard.addEventListener('click', dropDisc);
createBoard();
