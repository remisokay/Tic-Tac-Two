import * as cst from "./const";
import { getStatusBar, stopTimer } from "../ui/ui";
import { GameState } from "../types/state";

type Player = typeof cst.Const.PLAYERS[number];

export class GameBrain {
    #board: (Player | null)[][] = Array(cst.Const.BOARD_SIZE)
        .fill(null)
        .map(() => Array(cst.Const.BOARD_SIZE).fill(null));

    state: GameState;

    constructor() {
        this.state = {
            currentPlayer: "X",
            gridRow: 1,
            gridCol: 1,
            placedSymbols: { X: 0, O: 0 },
            gameMode: "multi",
            selectedPiece: null,
            gameOver: false,
            gameStarted: false
        };
    }

    get board() {
        return this.#board;
    }

    selectPiece(row: number, col: number) {
        this.state.selectedPiece = { row, col };
    }

    clearSelectedPiece() {
        this.state.selectedPiece = null;
    }

    changeGameMode() {
        this.state.gameMode = this.state.gameMode === "single" ? "multi" : "single";
    }

    placePiece(row: number, col: number) {
        if (!this.isInGrid(row, col)) {
            alert("Choose a cell within the grid, mate !");
            return;
        }

        const current = this.state.currentPlayer;

        if (this.#board[row][col] === null && this.state.placedSymbols[current] < cst.Const.MAX_SBL) {
            this.#board[row][col] = current;
            this.state.placedSymbols[current]++;
            this.state.gameStarted = true;

            if (this.checkWin()) {
                this.state.gameOver = true;
                stopTimer();
                alert(`${current} wins the game!`);
                setTimeout(() => {
                    this.resetGame();
                }, 2000);
                return;
            }

            this.switchPlayer();
            getStatusBar(this.state);
        } else {
            alert("Choose another place pls !");
        }
    }

    movePiece(row: number, col: number, newRow: number, newCol: number) {
        const current = this.state.currentPlayer;

        if (this.state.placedSymbols.X < 2 || this.state.placedSymbols.O < 2) {
            alert("Place at least 2 pieces each before moving!");
            return;
        }

        if (!this.isInGrid(newRow, newCol)) {
            alert("Choose a cell within the grid, mate !");
            return;
        }

        if (this.#board[row][col] !== current) {
            alert("Hey, stop right there ! Move your own piece !");
            return;
        }

        if (this.#board[newRow][newCol] !== null) {
            alert("Don't you see the cell is already occupied ?");
            return;
        }

        this.#board[newRow][newCol] = current;
        this.#board[row][col] = null;

        if (this.checkWin()) {
            this.state.gameOver = true;
            stopTimer();
            alert(`${current} wins the game!`);
            setTimeout(() => {
                this.resetGame();
            }, 2000);
            return;
        }

        this.switchPlayer();
        getStatusBar(this.state);
    }

    moveGrid(direction: "left" | "right" | "up" | "down") {
        let moved = false;

        if (this.state.placedSymbols.X < 2 || this.state.placedSymbols.O < 2) {
            alert("Place at least 2 pieces each before moving the grid!");
            return;
        }

        const { gridRow, gridCol } = this.state;

        switch (direction) {
            case "left":
                if (gridRow > 0) {
                    this.state.gridRow--;
                    moved = true;
                }
                break;
            case "right":
                if (gridRow < cst.Const.BOARD_SIZE - 3) {
                    this.state.gridRow++;
                    moved = true;
                }
                break;
            case "up":
                if (gridCol > 0) {
                    this.state.gridCol--;
                    moved = true;
                }
                break;
            case "down":
                if (gridCol < cst.Const.BOARD_SIZE - 3) {
                    this.state.gridCol++;
                    moved = true;
                }
                break;
        }

        if (!moved) {
            alert("You can not move-it move-it there!");
        } else {
            this.switchPlayer();
        }

        getStatusBar(this.state);
    }

    checkWin(): boolean {
        const grid: (Player | null)[][] = [];

        for (let i = 0; i < 3; i++) {
            grid[i] = [];
            for (let j = 0; j < 3; j++) {
                grid[i][j] = this.#board[this.state.gridRow + i][this.state.gridCol + j];
            }
        }

        for (let i = 0; i < 3; i++) {
            if (grid[i][0] && grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2]) return true;
            if (grid[0][i] && grid[0][i] === grid[1][i] && grid[1][i] === grid[2][i]) return true;
        }

        return (
            Boolean(grid[0][0] && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) ||
            Boolean(grid[0][2] && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0])
        );
    }

    isInGrid(row: number, col: number): boolean {
        return (
            row >= this.state.gridRow &&
            row < this.state.gridRow + 3 &&
            col >= this.state.gridCol &&
            col < this.state.gridCol + 3
        );
    }

    switchPlayer() {
        this.state.currentPlayer = this.state.currentPlayer === "X" ? "O" : "X";
    }

    resetGame() {
        this.#board = Array(cst.Const.BOARD_SIZE)
            .fill(null)
            .map(() => Array(cst.Const.BOARD_SIZE).fill(null));

        this.state.gridRow = 1;
        this.state.gridCol = 1;
        this.state.currentPlayer = "X";
        this.state.placedSymbols = { X: 0, O: 0 };
        this.state.selectedPiece = null;
        this.state.gameOver = false;
        this.state.gameStarted = false;
    }

    // === BOT MODE ===

    botMove() {
        if (this.state.gameMode !== "single" || this.state.currentPlayer !== "O") return;

        const botSymbols = this.findPlayerSymbols("O");
        const emptyCells = this.findEmptyCells();

        const canMove = this.state.placedSymbols.X >= 2 && this.state.placedSymbols.O >= 2;

        if (this.state.placedSymbols.O >= cst.Const.MAX_SBL && canMove) {
            if (Math.random() < 0.5) {
                this.botMoveSymbol(botSymbols, emptyCells);
            } else {
                this.botMoveGrid();
            }
            return;
        }

        if (!canMove || this.state.placedSymbols.O < cst.Const.MAX_SBL) {
            this.botPlaceSymbol(emptyCells);
            return;
        }
    }

    findPlayerSymbols(player: Player): { row: number; col: number }[] {
        const symbols: { row: number; col: number }[] = [];
        for (let row = this.state.gridRow; row < this.state.gridRow + 3; row++) {
            for (let col = this.state.gridCol; col < this.state.gridCol + 3; col++) {
                if (this.#board[row][col] === player) {
                    symbols.push({ row, col });
                }
            }
        }
        return symbols;
    }

    findEmptyCells(): { row: number; col: number }[] {
        const emptyCells: { row: number; col: number }[] = [];
        for (let row = this.state.gridRow; row < this.state.gridRow + 3; row++) {
            for (let col = this.state.gridCol; col < this.state.gridCol + 3; col++) {
                if (this.#board[row][col] === null) {
                    emptyCells.push({ row, col });
                }
            }
        }
        return emptyCells;
    }

    botPlaceSymbol(emptyCells: { row: number; col: number }[]) {
        if (emptyCells.length === 0) return;

        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

        this.#board[row][col] = "O";
        this.state.placedSymbols.O++;

        if (this.checkWin()) {
            stopTimer();
            alert("O wins the game!");
            setTimeout(() => this.resetGame(), 2000);
            return;
        }

        this.switchPlayer();
    }

    botMoveSymbol(
        botSymbols: { row: number; col: number }[],
        emptyCells: { row: number; col: number }[]
    ) {
        if (botSymbols.length === 0 || emptyCells.length === 0) return;

        const { row: oldRow, col: oldCol } = botSymbols[Math.floor(Math.random() * botSymbols.length)];
        const { row: newRow, col: newCol } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

        this.#board[newRow][newCol] = "O";
        this.#board[oldRow][oldCol] = null;

        if (this.checkWin()) {
            alert("O wins the game!");
            setTimeout(() => this.resetGame(), 2000);
            return;
        }

        this.switchPlayer();
    }

    botMoveGrid() {
        const directions: ("left" | "right" | "up" | "down")[] = [];

        if (this.state.gridRow > 0) directions.push("left");
        if (this.state.gridRow < cst.Const.BOARD_SIZE - 3) directions.push("right");
        if (this.state.gridCol > 0) directions.push("up");
        if (this.state.gridCol < cst.Const.BOARD_SIZE - 3) directions.push("down");

        if (directions.length === 0) return;

        const dir = directions[Math.floor(Math.random() * directions.length)];
        this.moveGrid(dir);
    }
}
