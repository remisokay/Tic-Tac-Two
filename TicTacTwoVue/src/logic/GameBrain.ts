import { GameState } from "./GameState.ts";
import { GameConfig } from "./GameConfig.ts";

export class TicTacTwoBrain {
    private _gameState: GameState;
    private _gameConfig: GameConfig;
    private _gameBoard: string[][];
    private _nextMoveBy: 'X' | 'O';
    private _gridPosition: { x: number; y: number};
    public moveCount: number;
    public gameOver: boolean;
    private _winner: 'X' | 'O' | null;
    public movePieceAfterNMoves: number;

    constructor(gameState: GameState) {
        this._gameState = gameState;
        this._gameConfig = gameState.gameConfig;
        this._gameBoard = gameState.gameBoard;
        this._nextMoveBy = gameState.nextMoveBy;
        this._gridPosition = {
            x: gameState.gridPositionX,
            y: gameState.gridPositionY,
        };
        this.moveCount = gameState.moveCount;
        this.movePieceAfterNMoves = this._gameConfig.movePieceAfterNMoves;
        this.gameOver = false;
        this._winner = null;
    }

    public static TicTacTwoBrainConfig(gameConfig: GameConfig, startingPlayer: 'X' | 'O' = 'X'): TicTacTwoBrain {
        const board: string[][] = [];
        for (let x = 0; x < gameConfig.boardSizeWidth; x++) {
            board[x] = new Array(gameConfig.boardSizeHeight).fill('Empty');
        }

        const gameState = new GameState(board, gameConfig);
        gameState.nextMoveBy = startingPlayer;
        gameState.gridPositionX = Math.floor((gameConfig.boardSizeWidth - gameConfig.gridWidth) / 2);
        gameState.gridPositionY = Math.floor((gameConfig.boardSizeHeight - gameConfig.gridHeight) / 2);

        return new TicTacTwoBrain(gameState);
    }

    public get gameBoard(): string[][] {
        return this._gameBoard.map((row) => [...row]);
    }

    public get currentPlayer(): 'X' | 'O' {
        return this._nextMoveBy;
    }

    public get winner(): 'X' | 'O' | null {
        return this._winner;
    }

    public get piecesLeftForX(): number {
        return this._gameState.piecesLeftForX;
    }

    public get piecesLeftForO(): number {
        return this._gameState.piecesLeftForO;
    }

    public get winCondition(): number {
        return this._gameConfig.winCondition;
    }

    public get boardSizeWidth(): number {
        return this._gameConfig.boardSizeWidth;
    }

    public get boardSizeHeight(): number {
        return this._gameConfig.boardSizeHeight;
    }

    public get gridWidth(): number {
        return this._gameConfig.gridWidth;
    }

    public get gridHeight(): number {
        return this._gameConfig.gridHeight;
    }

    public get gridPosition(): { left: number; top: number; right: number; bottom: number } {
        const left = this._gridPosition.x;
        const top = this._gridPosition.y;
        const right = left + this._gameConfig.gridWidth;
        const bottom = top + this._gameConfig.gridHeight;
        return { left, top, right, bottom }
    }

    public getPiece(x: number, y: number): string {
        return this._gameBoard[x][y];
    }

    public isWithinBoundsGrid(x: number, y: number): boolean {
        const gridLeft = this._gridPosition.x;
        const gridTop = this._gridPosition.y;
        const gridRight = gridLeft + this._gameConfig.gridWidth;
        const gridBottom = gridTop + this._gameConfig.gridHeight;
        return x >= gridLeft && x < gridRight &&
            y >= gridTop && y < gridBottom;
    }

    public makeAMove(x: number, y: number): boolean {
        if (this.gameOver) {
            return false;
        }

        if (this.currentPlayer === 'X' && this._gameState.piecesLeftForX === 0) {
            alert("No pieces left for X. Please choose a piece from the board and move the grid")
            return false;
        }

        if (this.currentPlayer === 'O' && this._gameState.piecesLeftForO === 0) {
            alert("No pieces left for O. Please choose a piece from the board and move the grid")
            return false;
        }

        if (this._gameBoard[x][y] !== 'Empty') {
            return false;
        }

        const currentPlayer = this._nextMoveBy;
        this._gameBoard[x][y] = currentPlayer;

        const winner = this.checkForWin(x, y, currentPlayer);

        if (winner) {
            alert(`${currentPlayer} wins!`);
            this.gameOver = true;
            this._winner = currentPlayer;
        } else {
            if (this.currentPlayer === 'X') {
                this._gameState.piecesLeftForX--;
            } else {
                this._gameState.piecesLeftForO--;
            }
            this._nextMoveBy = currentPlayer === 'X' ? 'O' : 'X';
        }

        this.moveCount++;

        return true;
    }

    public checkForWin(x: number, y: number, piece: 'X' | 'O'): 'X' | 'O' | null {
        if (!this.isWithinBoundsGrid(x, y)) {
            return null;
        }

        if (
            this.checkDirection(x, y, 1, 0, piece) ||
            this.checkDirection(x, y, 0, 1, piece) ||
            this.checkDirection(x, y, 1, 1, piece) ||
            this.checkDirection(x, y, 1, -1, piece)
        ) {
            const timerContainer = document.getElementById("timer-container");
            if (timerContainer) {
                timerContainer.remove();
            }
            return piece;
        }

        return null;
    }

    public checkDirection(x: number, y: number, deltaX: number, deltaY: number, piece: 'X'| 'O'): boolean {
        let count = 1;

        count += this.countInDirection(x, y, deltaX, deltaY, piece);
        count += this.countInDirection(x, y, -deltaX, -deltaY, piece);

        return count >= this._gameConfig.winCondition;
    }

    public countInDirection(x: number, y: number, deltaX: number, deltaY: number, piece: 'X'| 'O'): number {
        let count = 0;

        for (let i = 1; i < this._gameConfig.winCondition; i++) {
            let checkX = x + i * deltaX;
            let checkY = y + i * deltaY;

            if (
                checkX >= 0 && checkX < this._gameConfig.boardSizeWidth &&
                checkY >= 0 && checkY < this._gameConfig.boardSizeHeight &&
                this.isWithinBoundsGrid(checkX, checkY) &&
                this._gameBoard[checkX][checkY] === piece
            ) {
                count++;
            } else {
                break;
            }
        }

        return count;
    }

    public countPiecesInGrid(player: 'X' | 'O' = this.currentPlayer): number {
        const grid = this.gridPosition;
        let count = 0;
        const board = this.gameBoard;
        for (let x = grid.left; x < grid.right; x++) {
            for (let y = grid.top; y < grid.bottom; y++) {
                if (board[x][y] === player) {
                    count++;
                }
            }
        }
        return count;
    }

    public emptyCellsCoordinatesInGrid(): Array<{x: number, y: number}> {
        const grid = this.gridPosition;
        const  board = this.gameBoard;
        const validCells = [];

        for (let x = grid.left; x < grid.right; x++) {
            for (let y = grid.top; y < grid.bottom; y++) {
                if (board[x][y] === 'Empty') {
                    validCells.push({x, y})
                }
            }
        }

        return validCells;
    }

    public canMoveGrid(directionX: number, directionY: number): boolean {
        let targetX = this._gridPosition.x + directionX;
        let targetY = this._gridPosition.y + directionY;

        if (
            targetX >= 0 && targetX <= this._gameConfig.boardSizeWidth - this._gameConfig.gridWidth &&
            targetY >= 0 && targetY <= this._gameConfig.boardSizeHeight - this._gameConfig.gridHeight
        ) {
            this._gridPosition.x = targetX;
            this._gridPosition.y = targetY;
            this._nextMoveBy = this._nextMoveBy === 'X' ? 'O' : 'X';
            return true;
        }

        alert("Cannot move the grid in this direction!");
        return false;
    }

    public moveGrid(direction: string): boolean {
        switch (direction) {
            case "Up":
                return this.canMoveGrid(-1, 0);
            case "Down":
                return this.canMoveGrid(1, 0);
            case "Left":
                return this.canMoveGrid(0, -1);
            case "Right":
                return this.canMoveGrid(0, 1);
            case "Up-Left":
                return this.canMoveGrid(-1, -1);
            case "Up-Right":
                return this.canMoveGrid(-1, 1);
            case "Down-Left":
                return this.canMoveGrid(1, -1);
            case "Down-Right":
                return this.canMoveGrid(1, 1);
            default:
                return false;
        }
    }

    public moveAPiece(startX: number, startY: number, targetX: number, targetY: number): boolean {
        if (this.gameOver) {
            alert("Game is over!");
            return false;
        }

        const currentPlayer = this._nextMoveBy;

        if (this._gameBoard[startX][startY] === currentPlayer) {
            this._gameBoard[startX][startY] = "Empty";
            this._gameBoard[targetX][targetY] = currentPlayer;

            if (this.checkForWin(targetX, targetY, currentPlayer) != null) {
                alert(`${currentPlayer} wins!!`)
                this.gameOver = true;
                this._winner = currentPlayer;
                return true;
            }

            this._nextMoveBy = currentPlayer === "X" ? "O" : "X";

            this.moveCount++;
        } else {
            alert("Invalid move!")
        }

        return true;
    }
}