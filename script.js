const gameBoard = (() => {
    let _board = new Array(9);

    const getTileValue = (index) => _board[index];

    const setTileValue = (index, symbol) => {
        if (_isEmptyTile(_board[index])) {
            _board[index] = symbol;
            return true;
        } else {
            return false;
        }
    };

    const hasEmptyTile = () => {
        return _board.includes(undefined);

    };

    const _isEmptyTile = (tile) => {
        return tile === undefined;
    };

    const _clearBoard = () => {
        _board.fill(undefined);
    };

    const populateBoard = () => {
        _board.fill("X");
    };

    const restartGame = () => {
        _clearBoard();
        displayController.updateBoard();
    };

    return {
        getTileValue,
        setTileValue,
        hasEmptyTile,
        restartGame,
        populateBoard
    };

})();

const Player = (symbol, playerTurn) => {
    let _symbol = symbol;
    
    let _victories = 0;

    let _playerTurn = playerTurn;

    const setPlayerTurn = () => _playerTurn = !_playerTurn;

    const getPlayerTurn = () => _playerTurn;

    const getPlayerSymbol = () => _symbol;

    const getPlayerVictories = () => _victories;

    const addToVictories = () => _victories++;

    return { 
        setPlayerTurn,
        getPlayerTurn,
        getPlayerSymbol,
        getPlayerVictories,
        addToVictories,
    };
};

const gameController = (() => {
    // playerX begins first
    const players = [Player("X", true), Player("O", false)];

    const _arrayWinCondition = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const _getCurrentPlayer = () => {
        for (const player of players) {
            if ( player.getPlayerTurn() ) { return player; }
        }
    };

    const _changeCurrentPlayer = () => {
        players.forEach(player => player.setPlayerTurn());
    };

    const getCurrentPlayerSymbol = () => {
        return _getCurrentPlayer().getPlayerSymbol();
    };

    const getPlayers = () => players;

    const _initDOMs = () => {
        const _btnRestart = document.querySelector(".btn-restart");
        _btnRestart.addEventListener('click', () => {
            gameBoard.restartGame();
        });

        const _tiles = document.querySelectorAll(".tile");
        _tiles.forEach(tile => tile.addEventListener('click', () => {
            let index = tile.getAttribute("data-index");

            // Change player turn only if prev player made a legal move
            if (gameBoard.setTileValue(index, getCurrentPlayerSymbol())) {
                _changeCurrentPlayer();
            }

            displayController.updateBoard();
            displayController.updateCurrentPlayer();

            _checkGameState();
            
        }));
    };

    const _checkWinCondition = (symbol, sequence) => {
        return sequence === symbol + symbol + symbol;
    };

    const _checkWinner = (sequence) => {
        for (let player of players) {
            if ( _checkWinCondition(player.getPlayerSymbol(), sequence) ) { return player; }
        }
    };

    const _checkIfDraw = () => {
        return !gameBoard.hasEmptyTile();
    };

    const _checkGameState = () => {
        for (const winCondition of _arrayWinCondition) {
            let symbolSequence = winCondition.reduce(
                (sequence, tile) => sequence += gameBoard.getTileValue(tile), ''
            );
            
            let winner = _checkWinner(symbolSequence);
            if (winner) {
                winner.addToVictories();
                displayController.updateScore();
                displayController.notifyWinner(winner);
                gameBoard.restartGame();

            }

            if (_checkIfDraw()) {
                displayController.notifyDraw();
                gameBoard.restartGame();
            }
        }
    };

    _initDOMs();

    return {
        getPlayers,
        getCurrentPlayerSymbol
    };
})();

const displayController = (() => {
    const _tiles = document.querySelectorAll(".tile");
    const _currentPlayer = document.querySelector(".current-player");
    const _scores = document.querySelectorAll(".player-score");

    const updateBoard = () => {
        for (let i = 0; i < _tiles.length; i++) {
            _tiles[i].textContent = gameBoard.getTileValue(i);
        }
    };

    const updateScore = () => {
        _scores.forEach(score => {
            let playerId = score.getAttribute("data-index");

            gameController.getPlayers().forEach(player => {
                if (player.getPlayerSymbol() === playerId) {
                    let playerScore = document.createElement('p');
                    playerScore.textContent = player.getPlayerVictories();
                    playerScore.classList.add("bold");
                    score.textContent = 
                        `Player ${playerId}'s score: `;
                    score.appendChild(playerScore);
                }
            })
        })
    };

    const updateCurrentPlayer = () => {
        _currentPlayer.textContent = gameController.getCurrentPlayerSymbol();
    };

    const notifyDraw = () => {
        alert(`It's a draw!`);
    };

    const notifyWinner = (player) => {
        _toggleTiles();
        _popupWinner(player);
        _setPopupClosing();
    };

    const _popupWinner = (player) => {
        let pWinner = document.querySelector("#winner");
        pWinner.textContent = `Player ${player.getPlayerSymbol()} has won!`;

        let popup = document.querySelector("#popup");
        popup.classList.add("display");
    };

    const _setPopupClosing = () => {
        let span = document.querySelector(".close");

        span.addEventListener("click", () => {
            popup.classList.remove("display");
            _toggleTiles();
        });

        window.addEventListener("click", (e) => {
            if (e.target == popup) {
                popup.classList.remove("display");
                _toggleTiles();
            }
        });
    };

    const _toggleTiles = () => {
        _tiles.forEach(tile => tile.classList.toggle("disabled"));
    };

    updateCurrentPlayer();
    updateScore();

    return {
        updateBoard,
        updateScore,
        updateCurrentPlayer,
        notifyWinner,
        notifyDraw
    };

})();