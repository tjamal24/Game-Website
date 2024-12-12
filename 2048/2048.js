document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const resultDisplay = document.getElementById('result');
    const upButton = document.getElementById('up');
    const downButton = document.getElementById('down');
    const leftButton = document.getElementById('left');
    const rightButton = document.getElementById('right');
    let squares = [];
    const width = 4;
    let score = 0;

    // Event listeners for the buttons
    upButton.addEventListener('click', () => keyUp());
    downButton.addEventListener('click', () => keyDown());
    leftButton.addEventListener('click', () => keyLeft());
    rightButton.addEventListener('click', () => keyRight());

    // Create the playing board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.innerHTML = 0;
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        generate();
        generate();
    }
    createBoard();

    // Generate a new number
    function generate() {
        const randomNumber = Math.floor(Math.random() * squares.length);
        if (squares[randomNumber].innerHTML == 0) {
            squares[randomNumber].innerHTML = 2;
            checkForGameOver();
        } else {
            generate();
        }
    }

    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let row = [
                    parseInt(squares[i].innerHTML),
                    parseInt(squares[i + 1].innerHTML),
                    parseInt(squares[i + 2].innerHTML),
                    parseInt(squares[i + 3].innerHTML)
                ];

                let filteredRow = row.filter(num => num);
                let zeros = Array(4 - filteredRow.length).fill(0);
                let newRow = zeros.concat(filteredRow);

                squares[i].innerHTML = newRow[0];
                squares[i + 1].innerHTML = newRow[1];
                squares[i + 2].innerHTML = newRow[2];
                squares[i + 3].innerHTML = newRow[3];
            }
        }
    }

    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let row = [
                    parseInt(squares[i].innerHTML),
                    parseInt(squares[i + 1].innerHTML),
                    parseInt(squares[i + 2].innerHTML),
                    parseInt(squares[i + 3].innerHTML)
                ];

                let filteredRow = row.filter(num => num);
                let zeros = Array(4 - filteredRow.length).fill(0);
                let newRow = filteredRow.concat(zeros);

                squares[i].innerHTML = newRow[0];
                squares[i + 1].innerHTML = newRow[1];
                squares[i + 2].innerHTML = newRow[2];
                squares[i + 3].innerHTML = newRow[3];
            }
        }
    }

    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let column = [
                parseInt(squares[i].innerHTML),
                parseInt(squares[i + width].innerHTML),
                parseInt(squares[i + (width * 2)].innerHTML),
                parseInt(squares[i + (width * 3)].innerHTML)
            ];

            let filteredColumn = column.filter(num => num);
            let zeros = Array(4 - filteredColumn.length).fill(0);
            let newColumn = filteredColumn.concat(zeros);

            squares[i].innerHTML = newColumn[0];
            squares[i + width].innerHTML = newColumn[1];
            squares[i + (width * 2)].innerHTML = newColumn[2];
            squares[i + (width * 3)].innerHTML = newColumn[3];
        }
    }

    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let column = [
                parseInt(squares[i].innerHTML),
                parseInt(squares[i + width].innerHTML),
                parseInt(squares[i + (width * 2)].innerHTML),
                parseInt(squares[i + (width * 3)].innerHTML)
            ];

            let filteredColumn = column.filter(num => num);
            let zeros = Array(4 - filteredColumn.length).fill(0);
            let newColumn = zeros.concat(filteredColumn);

            squares[i].innerHTML = newColumn[0];
            squares[i + width].innerHTML = newColumn[1];
            squares[i + (width * 2)].innerHTML = newColumn[2];
            squares[i + (width * 3)].innerHTML = newColumn[3];
        }
    }

    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i + 1].innerHTML = 0;
                score += combinedTotal;
                scoreDisplay.innerHTML = score;
            }
        }
        checkForWin();
    }

    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if (squares[i].innerHTML === squares[i + width].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i + width].innerHTML = 0;
                score += combinedTotal;
                scoreDisplay.innerHTML = score;
            }
        }
        checkForWin();
    }

    function control(e) {
        if (e.keyCode === 37) keyLeft();
        else if (e.keyCode === 38) keyUp();
        else if (e.keyCode === 39) keyRight();
        else if (e.keyCode === 40) keyDown();
    }
    document.addEventListener('keyup', control);

    function keyRight() {
        moveRight();
        combineRow();
        moveRight();
        generate();
    }

    function keyLeft() {
        moveLeft();
        combineRow();
        moveLeft();
        generate();
    }

    function keyUp() {
        moveUp();
        combineColumn();
        moveUp();
        generate();
    }

    function keyDown() {
        moveDown();
        combineColumn();
        moveDown();
        generate();
    }

    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                alert('You WIN');
                document.removeEventListener('keyup', control);
                setTimeout(() => resetGame(), 3000);
            }
        }
    }

    function checkForGameOver() {
        let zeros = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) zeros++;
        }
        if (zeros === 0) {
            alert('You LOSE'); // Display the pop-up message
            document.removeEventListener('keyup', control);
            setTimeout(resetGame, 3000);
        }
    }

    function resetGame() {
        squares.forEach(square => (square.innerHTML = 0));
        score = 0;
        scoreDisplay.innerHTML = score;
        resultDisplay.innerHTML = '';
        generate();
        generate();
        document.addEventListener('keyup', control);
    }

    function addColours() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) squares[i].style.backgroundColor = '#afa192';
            else if (squares[i].innerHTML == 2) squares[i].style.backgroundColor = '#FFFFFF';
            else if (squares[i].innerHTML == 4) squares[i].style.backgroundColor = '#f0e6ff';
            else if (squares[i].innerHTML == 8) squares[i].style.backgroundColor = '#e6d4ff';
            else if (squares[i].innerHTML == 16) squares[i].style.backgroundColor = '#dcbfff';
            else if (squares[i].innerHTML == 32) squares[i].style.backgroundColor = '#d1aaff';
            else if (squares[i].innerHTML == 64) squares[i].style.backgroundColor = '#c694ff';
            else if (squares[i].innerHTML == 128) squares[i].style.backgroundColor = '#ba7eff';
            else if (squares[i].innerHTML == 256) squares[i].style.backgroundColor = '#ae68ff';
            else if (squares[i].innerHTML == 512) squares[i].style.backgroundColor = '#a151ff';
            else if (squares[i].innerHTML == 1024) squares[i].style.backgroundColor = '#9439ff';
            else if (squares[i].innerHTML == 2048) squares[i].style.backgroundColor = '#8621ff';
        }
    }
    addColours();
    setInterval(addColours, 50);
});
