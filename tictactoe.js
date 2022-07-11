// Game Flow
const game = (() => {
    const reset = () => {
        board.reset();
    };
    return {reset};
})();

// BOARD
const board = (() => {
    _xBoard = 0;
    _oBoard = 0;
    _position = {TopLeft: 1, TopCenter: 2, TopRight: 4, CenterLeft: 8, CenterCenter: 16, CenterRight: 32, BottomLeft: 64, BottomCenter: 128, BottomRight:256, };
    // top-row, middle-row, bottom-row, left-col, mid-col, right-col, diag-topleft-to-bottomright, diag-bottomleft-to-topright
    // as in: 0b000000111 = 7 in base 10
    // therefore, if a logical and (&) against _xBoard and 7 results in 7, the win condition has been met for the x player.
    _winConditions = [7, 56, 448, 73, 146, 292, 273, 84];
    _drawCondition = 511;

    const _isGameOver = () => {
        if( (_xBoard | _oBoard) === _drawCondition) return true;
        if(_hasBoardWon(_xBoard)) return true;
        if(_hasBoardWon(_oBoard)) return true;
        return false;
    };
    const _hasBoardWon = (board) => {
        for(let c of _winConditions) if(c&board===c) return true;
        return false;
    };
    const reset = () => _gameBoard = 0;

    const ui = (() => {
        const boardElement = document.querySelector('#board');
        const squares = [];
        const createBoard = () => {
            if(!boardElement) throw "Board Element is not selected.";
            for(let i=0; i<9; i++) {
                let div = document.createElement('div');
                div.id = `${i}`;
                div.classList.add('square');
                boardElement.append(div);
            }
        };

        createBoard();
        return {};
    })();


    reset();
    return {reset, toString};
})();


//PLAYER
const createPlayer = ((name) => {
    
    return {};
});


console.dir(board.toString());