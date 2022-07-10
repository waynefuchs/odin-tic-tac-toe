// BOARD
const board = (() => {
    const _emptyBoard = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    const reset = () => _gameBoard = _emptyBoard;
    const toString = () => {
        let boardString = "";
        let horizontalLine = "";
        for(let row of _gameBoard) {
            let rowString = "";
            boardString += horizontalLine;
            let squarePrefix = "";
            for(let square of row) {
                rowString += squarePrefix + (square === null ? " " : square);
                squarePrefix = " | ";
            }
            boardString += rowString + '\n';
            horizontalLine = '---------\n';
        }
        return boardString;
    };

    reset();
    return {reset, toString};
})();


//PLAYER
const createPlayer = ((name) => {
    
    return {};
});


console.dir(board.toString());