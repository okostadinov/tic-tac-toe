const gameBoard = (() => {
    let _board = new Array(9);

    const getTileValue = (index) => _board[index];

    const setTileValue = (index, symbol) => {
        _board[index] = (_isEmptyTile(_board[index])) ? symbol : getTileValue(index);

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
    };

    return {
        getTileValue,
        setTileValue,
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

    const addToVictories = () => victories++;

    return { 
        setPlayerTurn,
        getPlayerTurn,
        getPlayerSymbol,
        getPlayerVictories,
        addToVictories,
    };
}

const displayController = (() => {
    const _tiles = document.querySelectorAll('.tile');

    const updateBoard = () => {
        for (let i = 0; i < _tiles.length; i++) {
            _tiles[i].textContent = gameBoard.getTileValue(i);
        }
    };

    return {
        updateBoard
    }

    // TODO
})();

const gameController = (() => {
    // playerX begins first
    const _players = [Player("X", true), Player("O", false)];

    const getCurrentPlayerSymbol = () => {
        for (let player of _players) {
            if (player.getPlayerTurn()) {
                return player.getPlayerSymbol();
            }
        }
    }

    const changeCurrentPlayer = () => {
        _players.forEach(player => player.setPlayerTurn());
    }

    const _btnRestart = document.querySelector(".btn-restart");
    _btnRestart.addEventListener('click', () => {
        gameBoard.restartGame();
        displayController.updateBoard();
    });

    const _tiles = document.querySelectorAll(".tile");
    _tiles.forEach(tile => tile.addEventListener('click', () => {
        let index = tile.getAttribute("data-index");
        gameBoard.setTileValue(index, getCurrentPlayerSymbol());
        changeCurrentPlayer();
        displayController.updateBoard();
    }));
})();
