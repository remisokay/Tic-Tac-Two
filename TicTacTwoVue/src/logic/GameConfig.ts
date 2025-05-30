export class GameConfig {
    name: string;
    boardSizeWidth: number;
    boardSizeHeight: number;
    gridWidth: number;
    gridHeight: number;
    winCondition: number;
    movePieceAfterNMoves: number;
    numberOfPieces: number;

    constructor(
        name: string = "TIC TAC TWO",
        boardSizeWidth: number = 5,
        boardSizeHeight: number = 5,
        gridWidth: number = 3,
        gridHeight: number = 3,
        winCondition: number = 3,
        movePieceAfterNMoves: number = 4,
        numberOfPieces: number = 6
    ) {
        this.name = name;
        this.boardSizeWidth = boardSizeWidth;
        this.boardSizeHeight = boardSizeHeight;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.winCondition = winCondition;
        this.movePieceAfterNMoves = movePieceAfterNMoves;
        this.numberOfPieces = numberOfPieces;
    }
}