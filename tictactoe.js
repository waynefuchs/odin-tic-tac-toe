//////////
// Player
const createPlayer = ((playerCharacter, classes) => {
    let score = 0;
    const ui = (() => {
        let _pc = playerCharacter.toLowerCase();
        let _divPlayer = document.querySelector(`#${_pc}`)
        let _divScore = document.querySelector(`#${_pc}-score`);

        const updateScore = () => {
            _divScore.textContent = `${score}`;
        };
        const setSelection = (on) => {
            if(on) {
                _divPlayer.classList.add(`${_pc}-selected`);
            } else {
                _divPlayer.classList.remove(`${_pc}-selected`);
            }
        };
        return {setSelection, updateScore};
    })();

    const increaseScore = () => {
        score++;
        ui.updateScore();
    }

    return {increaseScore, playerCharacter, classes, ui};
});

// Game Flow
const game = (() => {
    let playerX = createPlayer('X', ['playerX']);
    let playerO = createPlayer('O', ['playerO']);
    let currentPlayer = 0;
    let _gameOver = false;

    const ui = (() => {
        let _divMessage = document.querySelector(`#message`);
        const setMessage = (message) => {
            _divMessage.textContent = message;
        };
        const _clearSelection = () => {
            playerX.ui.setSelection(false);
            playerO.ui.setSelection(false);
        }
        const _makeMessageAButton = () => {
            _divMessage.classList.add('message-selected');
            _divMessage.addEventListener('mouseup', reset.bind(this), {once: true});
        }
        const updateSelection = () => {
            if (_isGameOver()) {
                _clearSelection();
                _makeMessageAButton();
                return;
            }
            playerX.ui.setSelection(currentPlayer===0);
            playerO.ui.setSelection(currentPlayer===1);
            _divMessage.classList.remove('message-selected');
        }
    
        return {setMessage, updateSelection};
    })();

    const _isGameOver = () => {
        return _gameOver;
    };
    const _setGameOver = () => {
        getPlayer().increaseScore();
        _gameOver = true;
        ui.setMessage(`${gameOverTest} wins!`);
    };
    const _switchPlayerTurn = () => {
        currentPlayer ^= 1;
        ui.updateSelection();
    };
    const reset = (e) => {
        currentPlayer = 0;
        board.reset();
        _gameOver = board.isGameOver();
        ui.updateSelection();
    };
    const makePlay = (id) => {
        let success = board.makePlay(getPlayer(), id);
        if(success) {
            gameOverTest = board.isGameOver();
            if(gameOverTest) _setGameOver();
            _switchPlayerTurn();
            return getPlayer(1);
        }
    };
    const getPlayer = (current=0) => currentPlayer===current ? playerX : playerO;

    ui.updateSelection();
    return {reset, getPlayer, makePlay};
})();

////////////////
// Board Module
const board = (() => {
    let _xBoard = 0;
    let _oBoard = 0;
    let _winConditions = [7, 56, 448, 73, 146, 292, 273, 84];
    let _drawCondition = 511;

    const isGameOver = () => {
        if(_hasBoardWon(_xBoard)) return "x";
        if(_hasBoardWon(_oBoard)) return "o";
        // Cat must be checked for last in case the last move is a winning move
        if( (_xBoard | _oBoard) === _drawCondition) return "cat";
        return false;
    };
    const _hasBoardWon = (board) => {
        for(let c of _winConditions) if((c & board)  === c) return true;
        return false;
    };
    // This method should only be called from within game
    // TODO: Move board into the game module(?)
    const makePlay = (player, id) => {
        if(isGameOver()) return false;
        if( (id & _xBoard) || (id & _oBoard) ) return false;

        if(player.playerCharacter === "X") _xBoard |= id;
        else if(player.playerCharacter === "O") _oBoard |= id;
        else throw `Player is not an 'X' or 'O' (${player.playerCharacter})`;

        return true;
    };
    const reset = () => {
        _xBoard = 0;
        _oBoard = 0;
        ui.clearBoard();
    };

    /////////////
    // UI Module
    const ui = (() => {
        let squares = [];
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
                let s = square(1<<i);
                squares.push(s);
                boardElement.append(s.div);
            }
        };
        const clearBoard = () => {
            for(s of squares) {
                s.div.className = '';
                s.div.classList.add('square');
                s.div.textContent = '';
            }
        }

        _createBoard();
        return {clearBoard};
    })(); // End UI


    reset();
    return {reset, makePlay, isGameOver};
})(); // End Board
