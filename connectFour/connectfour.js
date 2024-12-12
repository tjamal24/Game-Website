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
    const col = parseInt(event.target.dataset.col);  // Ensure column index is a number
    if (checkGameOver()) return;  // Prevent more moves if the game is over

    for (let row = rows - 1; row >= 0; row--) {
        if (!board[row][col]) {  // Find the lowest empty row in the column
            board[row][col] = currentPlayer;
            const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
            cell.classList.add(currentPlayer);
            if (checkWinner(row, col)) {
                showWinner(currentPlayer);
                return;
            }
            currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';  // Switch players
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
        { dr: 0, dc: 1 },  // Horizontal
        { dr: 1, dc: 0 },  // Vertical
        { dr: 1, dc: 1 },  // Diagonal down-right
        { dr: 1, dc: -1 }  // Diagonal down-left
    ];

    for (const { dr, dc } of directions) {
        let count = 1;  // Current disc counts as 1
        count += countInDirection(row, col, dr, dc);
        count += countInDirection(row, col, -dr, -dc);

        if (count >= 4) return true;
    }
    return false;
}

// Count consecutive discs in a direction
function countInDirection(row, col, dr, dc) {
    let count = 0;
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < rows && c >= 0 && c < columns && board[r][c] === currentPlayer) {
        count++;
        r += dr;
        c += dc;
    }
    return count;
}

// Check if the game is over
function checkGameOver() {
    return congratsMessage.classList.contains('active');
}

// Reset the game board
resetButton.addEventListener('click', () => {
    board.forEach(row => row.fill(null));
    currentPlayer = 'red';
    createBoard();
    congratsMessage.classList.remove('active');
});

gameBoard.addEventListener('click', dropDisc);
createBoard();
