const gameBoard = (() => {
    let _board = new Array(9);

    const getTileValue = (index) => _board[index];

    const setTileValue = (index, symbol) => {
        _board[index] = (_isEmptyTile(_board[index])) ? symbol : getTileValue(index);
    }

    const hasEmptyTile = () => {
        return _board.includes(undefined);
    }

    const _isEmptyTile = (tile) => {
        return tile === undefined;
    }

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
    const _players = [Player("X", true), Player("O", false)];

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
        for (const player of _players) {
            if (player.getPlayerTurn()) {
                return player;
            }
        }
    };

    const _changeCurrentPlayer = () => {
        _players.forEach(player => player.setPlayerTurn());
    };

    const getCurrentPlayerSymbol = () => {
        return _getCurrentPlayer().getPlayerSymbol();
    };

    const _initDOMs = () => {
        const _btnRestart = document.querySelector(".btn-restart");
        _btnRestart.addEventListener('click', () => {
            gameBoard.restartGame();
        });

        const _tiles = document.querySelectorAll(".tile");
        _tiles.forEach(tile => tile.addEventListener('click', () => {
            let index = tile.getAttribute("data-index");
            gameBoard.setTileValue(index, getCurrentPlayerSymbol());
            _changeCurrentPlayer();
            displayController.updateBoard();
            displayController.updateCurrentPlayer();
            checkGameState();
        }));
    };

    const _checkWinCondition = (symbol, sequence) => {
        return sequence === symbol + symbol + symbol;
    };

    const _checkWinner = (sequence) => {
        for (let player of _players) {
            if ( _checkWinCondition(player.getPlayerSymbol(), sequence) ) { return player; }
        }
    }

    const _checkIfDraw = () => {
        return !gameBoard.hasEmptyTile();
    }

    const checkGameState = () => {
        for (const winCondition of _arrayWinCondition) {
            let symbolSequence = winCondition.reduce(
                (sequence, tile) => sequence += gameBoard.getTileValue(tile), ''
            );
            
            let winner = _checkWinner(symbolSequence);
            if (winner) {
                winner.addToVictories();
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
        getCurrentPlayerSymbol,
        checkGameState
    }
})();

const displayController = (() => {
    const _tiles = document.querySelectorAll(".tile");
    const _currentPlayer = document.querySelector(".current-player");

    const updateBoard = () => {
        for (let i = 0; i < _tiles.length; i++) {
            _tiles[i].textContent = gameBoard.getTileValue(i);
        }
    };

    const updateCurrentPlayer = () => {
        _currentPlayer.textContent = gameController.getCurrentPlayerSymbol();
    };

    const notifyWinner = (player) => {
        alert(`Player ${player.getPlayerSymbol()} won!`);
    };

    const notifyDraw = () => {
        alert(`It's a draw!`);
    }

    return {
        updateBoard,
        updateCurrentPlayer,
        notifyWinner,
        notifyDraw
    }

    // TODO
})();

displayController.updateCurrentPlayer();