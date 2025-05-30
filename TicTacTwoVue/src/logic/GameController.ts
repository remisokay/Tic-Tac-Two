import type {useGameStore} from "@/stores/counter.ts";
import {isAiTurn} from "@/logic/ai/AiGameBrain.ts";
import {resetMoveTimer, stopMoveTimer} from "@/logic/Timer.ts";

export class GameController {
    public movePieceStartCell: { x: number; y: number } | null = null;
    private store: ReturnType<typeof useGameStore>

    constructor(store: ReturnType<typeof useGameStore>) {
        this.store = store
    }

    public resetGame():void {
        this.store.startNewGame();
        this.store.actionActive = false;
        this.movePieceStartCell = null;
        stopMoveTimer()
    }
    public handleCellClick(x: number, y: number): void {
        if (isAiTurn()) {
            return;
        }

        // Check is winner exists for this game.
        if (this.store.gameOver) {
            alert("Please start new game. There is winner for this game.")
            return;
        }

        // Check if user chose the action
        if (this.store.actionActive === "choose") {
            alert("Please choose action before making a move!!");
            return;
        }

        // If user chose to move the grid, block the cells
        if (this.store.actionActive === "grid") {
            alert("You can only move the grid!!");
            return;
        }

        if (this.store.actionActive === "makeMove") {
            if (this.store.brain?.piecesLeftForO != 0 && this.store.currentPlayer == 'O') {
                this.store.makeMove(x, y);
                this.store.actionActive = null;
                return
            } else if (this.store.brain?.piecesLeftForX != 0 && this.store.currentPlayer == 'X') {
                this.store.makeMove(x, y);
                this.store.actionActive = null;
                return;
            }
        }

        if (this.store.actionActive === "movePiece") {
            // If cell has not been chosen yet
            if (!this.movePieceStartCell) {
                // Check if clicked cell is inside the grid
                if (!this.store.isWithinBoundsGrid(x, y)) {
                    alert("Please choose one of your pieces inside the grid!!");
                    return;
                }

                // Check that cell contains the current player's piece.
                if (this.store.gameBoard[x][y] !== this.store.currentPlayer) {
                    alert("You can only choose your piece!!")
                    return;
                }

                this.movePieceStartCell = {x, y};
                alert("Now select the target cell!")
            } else {
                // Check that the target cell is inside the grid
                if (!this.store.isWithinBoundsGrid(x, y)) {
                    alert("You can move the piece only inside the grid!!")
                    return;
                }

                // Check that the target cell must be empty
                if (this.store.gameBoard[x][y] !== 'Empty') {
                    alert("This cell is not empty. Please choose another cell.");
                    return;
                }

                const {x: startX, y: startY} = this.movePieceStartCell;
                this.store.moveAPiece(startX, startY, x, y);
                this.movePieceStartCell = null;
                this.store.actionActive = null;
            }
            return;
        }
        if (this.store.moveCount < 4) {
            this.store.makeMove(x, y);
            this.store.actionActive = null;
        }
    }

    public handleGridMove(direction: string) {
        this.store.moveGrid(direction)
        this.store.actionActive = null
        resetMoveTimer()
    }
}