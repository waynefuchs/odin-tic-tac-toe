//PLAYER
const createPlayer = ((playerCharacter, classes) => {
    return {playerCharacter, classes};
});

// Game Flow
const game = (() => {
    let playerX = createPlayer('X', ['playerX']);
    let playerO = createPlayer('O', ['playerO']);
    let currentPlayer = 0;
    const _switchPlayerTurn = () => currentPlayer ^= 1;
    const reset = () => {
        board.reset();
    };
    const makePlay = (id) => {
        let success = board.makePlay(getPlayer(), id);
        if(success) {
            gameOverTest = board.isGameOver();
            if(gameOverTest) console.log(`${gameOverTest} wins`);

            _switchPlayerTurn();
            return getPlayer(1);
        }
    };
    const getPlayer = (current=0) => currentPlayer===current ? playerX : playerO;
    return {reset, getPlayer, makePlay};
})();

////////////////
// Board Module
const board = (() => {
    let _xBoard = 0;
    let _oBoard = 0;
    let _winConditions = [7, 56, 448, 73, 146, 292, 273, 84];
    let _drawCondition = 511;
    let _gameOver = false;

    const _isGameOver = () => {
        if( (_xBoard | _oBoard) === _drawCondition) return "cat";
        if(_hasBoardWon(_xBoard)) return "x";
        if(_hasBoardWon(_oBoard)) return "o";
        return false;
    };
    const _hasBoardWon = (board) => {
        for(let c of _winConditions) if((c & board)  === c) return true;
        return false;
    };
    // This method should only be called from within game
    // TODO: Move board into the game module(?)
    const makePlay = (player, id) => {
        if(_gameOver) return false;
        if( (id & _xBoard) || (id & _oBoard) ) return false;

        if(player.playerCharacter === "X") _xBoard |= id;
        else if(player.playerCharacter === "O") _oBoard |= id;
        else throw `Player is not an 'X' or 'O' (${player.playerCharacter})`;
        _gameOver = _isGameOver();

        return true;
    };
    const reset = () => {
        _xBoard = 0;
        _oBoard = 0;
    };
    const isGameOver = () => _gameOver;


    /////////////
    // UI Module
    const ui = (() => {
        const square = ((id) => {
            // vars
            let div = document.createElement('div');

            //methods
            const _displayPlay = (player) => {
                if(!player) return;
                div.textContent = player.playerCharacter;
                for(let c of player.classes) div.classList.add(c);
            }
            const _addClickEvent = () => {
                div.addEventListener('mouseup', _processClickEvent.bind(this), false);
            };
            const _processClickEvent = (e) => {
                _displayPlay(game.makePlay(id));
            };

            // Init
            div.id = `${id}`;
            div.classList.add('square');
            _addClickEvent();
            return {div, id};
        });

        const boardElement = document.querySelector('#board');
        const _createBoard = () => {
            if(!boardElement) throw "Board Element is not selected.";
            for(let i=0; i<9; i++) {
                boardElement.append(square(1<<i).div);
            }
        };

        _createBoard();
        return {};
    })(); // End UI


    reset();
    return {reset, makePlay, isGameOver};
})(); // End Board
