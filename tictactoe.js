document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('resetButton');
    const winnerModal = document.getElementById('winnerModal');
    const winnerMessage = document.getElementById('winnerMessage');
    const closeModal = document.getElementById('closeModal');
    
    let currentPlayer = 'X';
    let boardState = Array(9).fill(null); // Board state array to keep track of moves
    let gameActive = true; // Flag to check if the game is ongoing

    // Winning combinations for Tic-Tac-Toe
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Function to handle cell clicks
    function handleCellClick(event) {
        const index = event.target.dataset.index;

        if (boardState[index] || !gameActive) return; // Ignore if already filled or game over

        boardState[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add('taken'); // Mark the cell as taken

        checkWinner();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
    }

    // Function to check for a winner or draw
    function checkWinner() {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                endGame(`Player ${boardState[a]} wins!`);
                return;
            }
        }

        if (!boardState.includes(null)) {
            endGame("It's a draw!");
        }
    }

    // Function to display the end-game message
    function endGame(message) {
        winnerMessage.textContent = message; // Set the winner message
        winnerModal.style.display = 'block';  // Show the popup modal
        gameActive = false; // Stop the game
    }

    // Function to reset the game
    function resetGame() {
        boardState.fill(null); // Clear the board state
        cells.forEach(cell => {
            cell.textContent = ''; // Clear the displayed marks
            cell.classList.remove('taken'); // Remove taken class
        });
        currentPlayer = 'X'; // Start with Player X
        gameActive = true; // Restart the game
    }

    // Event listeners
    cells.forEach((cell, index) => {
        cell.dataset.index = index; // Set data-index for each cell
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', resetGame);

    // Close modal when the close button is clicked
    closeModal.addEventListener('click', () => {
        winnerModal.style.display = 'none'; // Hide the popup modal
    });

    // Close modal if clicked outside of the modal content
    window.addEventListener('click', (e) => {
        if (e.target === winnerModal) {
            winnerModal.style.display = 'none';
        }
    });
});
