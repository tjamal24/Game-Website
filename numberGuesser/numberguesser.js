document.addEventListener('DOMContentLoaded', () => {
    const maxGuesses = 10;
    let randomNumber = Math.floor(Math.random() * 1001);
    let attemptsLeft = maxGuesses;

    const guessInput = document.getElementById('guessInput');
    const guessButton = document.getElementById('guessButton');
    const message = document.getElementById('message');
    const attemptsDisplay = document.getElementById('attempts');
    const resetButton = document.getElementById('resetButton');

    guessButton.addEventListener('click', makeGuess);
    resetButton.addEventListener('click', resetGame);

    function makeGuess() {
        const userGuess = parseInt(guessInput.value);

        if (isNaN(userGuess) || userGuess < 0 || userGuess > 1000) {
            message.textContent = 'Please enter a valid number between 0 and 1000.';
            return;
        }

        attemptsLeft--;
        attemptsDisplay.textContent = attemptsLeft;

        if (userGuess === randomNumber) {
            message.textContent = '🎉 Congratulations! You guessed the correct number!';
            endGame();
        } else if (attemptsLeft === 0) {
            message.textContent = `😞 Game over! The correct number was ${randomNumber}.`;
            endGame();
        } else {
            message.textContent = userGuess > randomNumber ? '🔻 Lower!' : '🔺 Higher!';
        }
    }

    function endGame() {
        guessInput.disabled = true;
        guessButton.disabled = true;
    }

    function resetGame() {
        randomNumber = Math.floor(Math.random() * 1001);
        attemptsLeft = maxGuesses;
        attemptsDisplay.textContent = attemptsLeft;
        message.textContent = '';
        guessInput.value = '';
        guessInput.disabled = false;
        guessButton.disabled = false;
    }
});
