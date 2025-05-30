import { GameConfig } from "./GameConfig.ts";

export class GameState {
    gameBoard: string[][];
    gameConfig: GameConfig;
    nextMoveBy: 'X' | 'O';
    moveCount: number;
    gridPositionX: number;
    gridPositionY: number;
    piecesLeftForX: number;
    piecesLeftForO: number;

    constructor(gameBoard: string[][], gameConfig: GameConfig) {
        this.gameBoard = gameBoard;
        this.gameConfig = gameConfig;
        this.nextMoveBy = 'X';
        this.moveCount = 0;
        this.gridPositionX = 0;
        this.gridPositionY = 0;
        this.piecesLeftForX = gameConfig.numberOfPieces;
        this.piecesLeftForO = gameConfig.numberOfPieces;
    }
}