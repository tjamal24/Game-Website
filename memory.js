// memory.js

// Card values (paired emojis for matching)
const cardValues = [
    '🍎', '🍌', '🍍', '🍓', '🍉', '🍒', '🍊', '🍋',
    '🍎', '🍌', '🍍', '🍓', '🍉', '🍒', '🍊', '🍋'
];

// Game state variables
let flippedCards = [];
let matchedCards = [];
let moveCount = 0;
let gameTimer;
let timeElapsed = 0;

// Shuffle the card values randomly
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Create the memory game board
function createBoard() {
    const board = document.getElementById('memoryBoard');
    const shuffledCards = shuffle(cardValues);
    board.innerHTML = ''; // Clear the board

    shuffledCards.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value; // Store the card's value in a dataset
        card.addEventListener('click', flipCard); // Add click event listener
        board.appendChild(card); // Add card to the board
    });
}

// Handle card flip logic
function flipCard() {
    if (
        flippedCards.length === 2 || // Prevent flipping more than 2 cards at a time
        this.classList.contains('flipped') || // Ignore already flipped cards
        matchedCards.includes(this) // Ignore already matched cards
    ) return;

    // Flip the card
    this.classList.add('flipped');
    this.textContent = this.dataset.value;
    flippedCards.push(this);

    // Check for a match if two cards are flipped
    if (flippedCards.length === 2) {
        moveCount++;
        document.getElementById('moveCount').textContent = moveCount;

        if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
            // Match found
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
            matchedCards.push(flippedCards[0], flippedCards[1]);
            flippedCards = [];

            // Check if all cards are matched
            if (matchedCards.length === cardValues.length) {
                clearInterval(gameTimer); // Stop the timer
                showWinModal(); // Show win modal with time and moves
            }
        } else {
            // No match - flip cards back after a delay
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.remove('flipped');
                    card.textContent = ''; // Hide the value again
                });
                flippedCards = [];
            }, 1000);
        }
    }
}

// Start the game timer
function startTimer() {
    gameTimer = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = formatTime(timeElapsed);
    }, 1000);
}

// Format time in MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Show win modal with time and moves
function showWinModal() {
    const winTime = document.getElementById('winTime');
    const winMoves = document.getElementById('winMoves');
    winTime.textContent = `You won in ${formatTime(timeElapsed)}`;
    winMoves.textContent = `Moves: ${moveCount}`;
    
    // Show the modal
    const modal = document.getElementById('winModal');
    modal.style.display = "block";
}

// Close the modal when the user clicks the close button
document.getElementById('closeModal').addEventListener('click', function() {
    const modal = document.getElementById('winModal');
    modal.style.display = "none";
    resetGame(); // Optionally reset the game when closed
});

// Reset the game to its initial state
function resetGame() {
    // Reset game state variables
    matchedCards = [];
    flippedCards = [];
    moveCount = 0;
    timeElapsed = 0;

    // Reset UI elements
    document.getElementById('moveCount').textContent = moveCount;
    document.getElementById('timer').textContent = '00:00';

    // Shuffle and recreate the board
    cardValues.sort(() => Math.random() - 0.5); // Shuffle cardValues array
    createBoard(); // Create a new shuffled board
    startTimer(); // Restart the timer
}

// Initialize the game
createBoard();
startTimer();

// Add event listener for the reset button
document.getElementById('resetButton').addEventListener('click', resetGame);
