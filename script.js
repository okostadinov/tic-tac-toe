const gameBoard = (() => {
    let _board = new Array(9);

    const getTileValue = (index) => _board[index];

    /**
     * @param {*} index of the tile
     * @param {*} symbol to be filled with
     * @returns bool to indicate that
     * player turn should be changed
     */
    const setTileValue = (index, symbol) => {
        if (_isEmptyTile(_board[index])) {
            _board[index] = symbol;
            return true;
        }
        return false;
    };

    const hasEmptyTile = () => {
        return _board.includes(undefined);

    };

    const _isEmptyTile = (tile) => {
        return tile === undefined;
    };

    const clearBoard = () => {
        _board.fill(undefined);
    };

    return {
        getTileValue,
        setTileValue,
        hasEmptyTile,
        clearBoard
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

    // if any of these are filled with the same symbol,
    // the game has been won
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

    const getPlayers = () => players;

    const _getCurrentPlayer = () => {
        for (const player of players) {
            if ( player.getPlayerTurn() ) { return player; }
        }
    };

    const changeCurrentPlayer = () => {
        players.forEach(player => player.setPlayerTurn());
    };

    const getCurrentPlayerSymbol = () => {
        return _getCurrentPlayer().getPlayerSymbol();
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

    const checkGameState = () => {
        for (const winCondition of _arrayWinCondition) {
            let symbolSequence = winCondition.reduce(
                (sequence, tile) => sequence += gameBoard.getTileValue(tile), ''
            );
            
            let winner = _checkWinner(symbolSequence);
            if (winner) {
                winner.addToVictories();
                displayController.updateScore();
                displayController.notifyWinner(winner);
                displayController.restartGame();
            }
        }

        if (_checkIfDraw()) {
            displayController.notifyDraw();
            displayController.restartGame();
        }
    };

    return {
        changeCurrentPlayer,
        checkGameState,
        getPlayers,
        getCurrentPlayerSymbol
    };
})();

const displayController = (() => {
    const _tiles = document.querySelectorAll(".tile");
    const _currentPlayer = document.querySelector(".current-player");
    const _scores = document.querySelectorAll(".player-score");
    const _popup = document.querySelector("#popup");
    const _result = document.querySelector("#result");
    const _span = document.querySelector(".close");

    (function () {
        const _btnRestart = document.querySelector(".btn-restart");
        _btnRestart.addEventListener('click', () => {
            restartGame();
        });
    })();

    (function () {
        _tiles.forEach(tile => tile.addEventListener('click', () => {
            let index = tile.getAttribute("data-index");

            // Change player turn only if prev player made a legal move
            if (gameBoard.setTileValue(index, gameController.getCurrentPlayerSymbol())) {
                gameController.changeCurrentPlayer();
            }

            updateBoard();
            updateCurrentPlayer();

            gameController.checkGameState();
            
        }));
    })();

    const restartGame = () => {
        gameBoard.clearBoard();
        updateBoard();
    };

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
            });
        });
    };

    const updateCurrentPlayer = () => {
        _currentPlayer.textContent = gameController.getCurrentPlayerSymbol();
    };

    const notifyDraw = () => {
        _popupResult(null);
        _disableTiles();
        _setPopupClosing();
    };

    const notifyWinner = (player) => {
        _popupResult(player);
        _disableTiles();
        _setPopupClosing();
    };

    const _popupResult = (player) => {
        _result.textContent = (player === null) ? 
            `It's a draw!` : `Player ${player.getPlayerSymbol()} has won!`;
        
        _popup.classList.add("display");
    };

    const _setPopupClosing = () => {
        _span.addEventListener("click", () => {
            _popup.classList.remove("display");
            _enableTiles();
        });

        window.addEventListener("click", (e) => {
            if (e.target == _popup) {
                _popup.classList.remove("display");
                _enableTiles();
            }
        });
    };

    const _disableTiles = () => {
        _tiles.forEach(tile => tile.classList.add("disabled"));
    };

    const _enableTiles = () => {
        _tiles.forEach(tile => tile.classList.remove("disabled"));
    };

    updateCurrentPlayer();
    updateScore();

    return {
        restartGame,
        updateBoard,
        updateScore,
        updateCurrentPlayer,
        notifyWinner,
        notifyDraw
    };
})();