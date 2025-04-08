import * as UI from "./ui.js";
import * as cst from "./const.js";
import { GameBrain } from "./brain.js";

let game = new GameBrain();

let status_bar = UI.getStatusBar(game.state);
document.body.appendChild(status_bar);

// BUTTONS
let arrows = UI.getArrows(game);
document.body.appendChild(arrows);
let controlButtons = UI.getControlButtons(game);
document.body.appendChild(controlButtons);

let gameBoard = UI.createBoard(game.state, game.board, handleCellClick);
document.body.appendChild(gameBoard);

let timer = UI.getTimer(game);
document.body.appendChild(timer);
UI.startTimer();



function handleCellClick(row, col) {
    const cellValue = game.board[row][col];
    const currentPlayer = game.state.currentPlayer;
    const selected = game.state.selectedPiece;

    // Move piece
    if (selected && cellValue === null && game.isInGrid(row, col)) {
        game.movePiece(selected.row, selected.col, row, col);
        game.clearSelectedPiece();
        updateBoard();
        UI.startTimer();
        return;
    }

    // Deselect
    if (selected && selected.row === row && selected.col === col) {
        game.clearSelectedPiece();
        updateBoard();
        return;
    }

    // Select
    if (cellValue === currentPlayer && !selected) {
        game.selectPiece(row, col);
        updateBoard();
        return;
    }

    // Place new piece
    if (cellValue === null && game.isInGrid(row, col) && game.state.placedSymbols[currentPlayer] < cst.Const.MAX_SBL) {
        game.placePiece(row, col);
        game.clearSelectedPiece();
        updateBoard();
        UI.startTimer();
        return;
    }
}

export function updateBoard() {
    let oldBar = document.querySelector(".status-bar");
    if (oldBar) {
        oldBar.remove();
    }
    let newStatusBar = UI.getStatusBar(game.state);
    document.body.appendChild(newStatusBar);
    
    let old = document.querySelector(".board-container");
    if (old) {
        old.remove();
    }
    let newGameBoard = UI.createBoard(game.state, game.board, handleCellClick);
    document.body.appendChild(newGameBoard);

    let oldTimer = document.getElementById("timer");
    if (oldTimer) {
        oldTimer.remove();
    }
    let timer = UI.getTimer(game);
    document.body.appendChild(timer);

    if (game.state.gameMode === "single" && game.state.currentPlayer === "O") {
        UI.stopTimer();
        setTimeout(() => {
            game.botMove();
            updateBoard();
        }, 500);
    } else {
        UI.startTimer();
    }

}

// TODO: Fix the timer
