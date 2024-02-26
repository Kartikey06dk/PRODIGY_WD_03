document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const playerOption = document.getElementById('player');
    const computerOption = document.getElementById('computer');
    const playerOptionsContainer = document.getElementById('player-options');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = false;
    let againstAI = false;


    function checkWin(board, player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] === player && board[b] === player && board[c] === player) {
                return true;
            }
        }

        return false;
    }

    function checkTie(board) {
        return board.every(cell => cell !== '');
    }

    function minimax(board, depth, isMaximizing) {
        const scores = {
            X: 10,
            O: -10,
            tie: 0
        };

        if (checkWin(board, 'X')) {
            return scores.X - depth;
        } else if (checkWin(board, 'O')) {
            return scores.O + depth;
        } else if (checkTie(board)) {
            return scores.tie;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function bestMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === '') {
                gameBoard[i] = 'X';
                let score = minimax(gameBoard, 0, false);
                gameBoard[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    function handleCellClick(index) {
        if (!gameActive || gameBoard[index] !== '') return;

        gameBoard[index] = currentPlayer;
        renderBoard();

        if (checkWin(gameBoard, currentPlayer)) {
            status.textContent = `PLAYER ${currentPlayer} WINS !!`;
            gameActive = false;
            resetButton.style.display = 'block';
            return;
        }

        if (checkTie(gameBoard)) {
            status.textContent = "IT'S A TIE!!";
            gameActive = false;
            resetButton.style.display = 'block';
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;

        if (againstAI && currentPlayer === 'O') {
            setTimeout(() => {
                let move = bestMove();
                gameBoard[move] = currentPlayer;
                renderBoard();
                if (checkWin(gameBoard, currentPlayer)) {
                    status.textContent = `PLAYER ${currentPlayer} WINS !!`;
                    gameActive = false;
                    resetButton.style.display = 'block';
                    return
                }
                if (checkTie(gameBoard)) {
                    status.textContent = "IT'S A TIE!!";
                    gameActive = false;
                    resetButton.style.display = 'block';
                }
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                status.textContent = `Player ${currentPlayer}'s turn`;
            }, 500);
        }
    }

    function renderBoard() {
        board.innerHTML = '';
        gameBoard.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.textContent = cell;
            cellElement.addEventListener('click', () => handleCellClick(index));
            board.appendChild(cellElement);
        });
    }

    function resetGame() {
        currentPlayer = 'X';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = "Player X's turn";
        renderBoard();
        resetButton.style.display = 'none';
        playerOptionsContainer.style.display = 'none';
    }

    function playAgain() {
        resetGame();
        playerOptionsContainer.style.display = 'flex';
    }

    playerOption.addEventListener('click', () => {
        againstAI = false;
        resetGame();
    });

    computerOption.addEventListener('click', () => {
        againstAI = true;
        resetGame();
    });

    resetButton.addEventListener('click', playAgain);
});