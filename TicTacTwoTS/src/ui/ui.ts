import { updateBoard } from "../app";
import * as cst from "../logic/const.ts";
import { GameBrain } from "../logic/brain.ts";
import { GameState } from "../types/state";


export function getStatusBar(state: GameState): HTMLDivElement {
    const statusBar = document.createElement("div");
    statusBar.classList.add("status-bar");
    statusBar.innerHTML = `X: ${state.placedSymbols.X}/4 &nbsp;&nbsp;|&nbsp;&nbsp; ${state.currentPlayer}'s turn &nbsp;&nbsp;|&nbsp;&nbsp; O: ${state.placedSymbols.O}/4`;
    return statusBar;
}


export function getArrows(game: GameBrain): HTMLDivElement {
    const arrows = document.createElement("div");
    arrows.classList.add("arrows-container");

    const directions = [
        { dir: "up", symbol: "&#11161;" },
        { dir: "down", symbol: "&#11163;" },
        { dir: "left", symbol: "&#11160;" },
        { dir: "right", symbol: "&#11162;" },
    ];

    const arrowWrapper = document.createElement("div");
    arrowWrapper.classList.add("arrows-grid");

    directions.forEach(({ dir, symbol }) => {
        const arrow = document.createElement("div");
        arrow.classList.add("arrow", `${dir}-arrow`);
        arrow.innerHTML = symbol;
        arrow.addEventListener("click", () => {
            game.moveGrid(dir as "up" | "down" | "left" | "right");
            updateBoard();
        });
        arrowWrapper.appendChild(arrow);
    });

    arrows.appendChild(arrowWrapper);
    return arrows;
}


export function getControlButtons(game: GameBrain): HTMLDivElement {
    const controlsWrapper = document.createElement("div");
    controlsWrapper.classList.add("controls-wrapper");

    // RESET
    const reset = document.createElement("div");
    reset.classList.add("btn");
    reset.innerHTML = "Reset";
    reset.addEventListener("click", () => {
        game.resetGame();
        stopTimer();
        updateBoard();
    });

    // MODE
    const mode = document.createElement("div");
    mode.classList.add("btn");
    mode.innerHTML = getModeText(game.state.gameMode);
    mode.addEventListener("click", () => {
        game.changeGameMode();
        mode.innerHTML = getModeText(game.state.gameMode);
        updateBoard();
    });

    controlsWrapper.appendChild(reset);
    controlsWrapper.appendChild(mode);

    return controlsWrapper;
}

function getModeText(mode: string): string {
    return mode === "multi" ? "Player vs Player" : "Player vs AI";
}


export function createBoard(
    state: GameState,
    gameBoardData: (string | null)[][],
    handleCellClick: (row: number, col: number, cell: HTMLDivElement) => void
): HTMLDivElement {
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board-container");

    const newBoard = document.createElement("div");
    newBoard.id = "gameBoard";
    newBoard.classList.add("gameBoard");

    for (let i = 0; i < cst.Const.BOARD_SIZE; i++) {
        const row = document.createElement("div");
        row.classList.add("row");

        for (let j = 0; j < cst.Const.BOARD_SIZE; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            cell.addEventListener("click", () => handleCellClick(i, j, cell));

            if (isInGrid(state, i, j)) {
                cell.classList.add("playable");
            }

            if (gameBoardData[i][j] !== null) {
                const marker = document.createElement("div");
                marker.classList.add("symbol");
                marker.textContent = gameBoardData[i][j]!;
                cell.appendChild(marker);
            }

            if (
                state.selectedPiece &&
                state.selectedPiece.row === i &&
                state.selectedPiece.col === j
            ) {
                cell.classList.add("selected");
            }

            row.appendChild(cell);
        }

        newBoard.appendChild(row);
    }

    boardContainer.appendChild(newBoard);
    return boardContainer;
}

export function isInGrid(state: GameState, row: number, col: number): boolean {
    return (
        row >= state.gridRow &&
        row < state.gridRow + 3 &&
        col >= state.gridCol &&
        col < state.gridCol + 3
    );
}

// TIMER
let timer: number | null = null;
let timeLeft: number = 10;
let currentGame: GameBrain;

export function getTimer(game: GameBrain): HTMLDivElement {
    currentGame = game;
    const timerDisplay = document.createElement("div");
    timerDisplay.id = "timer";
    timerDisplay.innerHTML = `Time left: ${timeLeft}s`;
    return timerDisplay;
}

export function startTimer(): void {
    if (currentGame.state.gameOver) return;
    
    clearInterval(timer!);
    timeLeft = 10;
    updateTimerDisplay();

    timer = window.setInterval(() => {
        if (currentGame.state.gameOver) {
            clearInterval(timer!);
            return;
        }
        
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer!);
            alert(
                `Time's up! Switching to ${
                    currentGame.state.currentPlayer === "X" ? "O" : "X"
                }`
            );
            currentGame.clearSelectedPiece();
            currentGame.switchPlayer();
            updateBoard();
        }
    }, 1000);
}

export function stopTimer(): void {
    clearInterval(timer!);
    timeLeft = 10;
    updateTimerDisplay();
}

function updateTimerDisplay(): void {
    const timerElement = document.getElementById("timer");
    if (timerElement) {
        timerElement.textContent = `Time left: ${timeLeft}s`;
    }
}
