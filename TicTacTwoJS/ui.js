import { updateBoard }  from "./app.js";
import * as cst from "./const.js";


export function getStatusBar(state) {
    let status_bar = document.createElement("div");
    status_bar.classList.add("status-bar");
    status_bar.innerHTML = `X: ${state.placedSymbols.X}/4 &nbsp;&nbsp;|&nbsp;&nbsp; ${state.currentPlayer}'s turn &nbsp;&nbsp;|&nbsp;&nbsp; O: ${state.placedSymbols.O}/4`;
    return status_bar;
}


export function getArrows(game) {
    let arrows = document.createElement("div");
    arrows.classList.add("arrows-container");
    // UP
    let upArrow = document.createElement("div");
    upArrow.classList.add("arrow", "up-arrow");
    upArrow.innerHTML = "&#11161;";
    upArrow.addEventListener("click", () => {
        game.moveGrid("up");
        updateBoard();
        // AI
    });
    // DOWN
    let downArrow = document.createElement("div");
    downArrow.classList.add("arrow", "down-arrow");
    downArrow.innerHTML = "&#11163;";
    downArrow.addEventListener("click", () => {
        game.moveGrid("down");
        updateBoard();
        // AI
    });
    // LEFT
    let leftArrow = document.createElement("div");
    leftArrow.classList.add("arrow", "left-arrow");
    leftArrow.innerHTML = "&#11160;";
    leftArrow.addEventListener("click", () => {
        game.moveGrid("left");
        updateBoard();
        // AI
    });
    // RIGHT
    let rightArrow = document.createElement("div");
    rightArrow.classList.add("arrow", "right-arrow");
    rightArrow.innerHTML = "&#11162;";
    rightArrow.addEventListener("click", () => {
        game.moveGrid("right");
        updateBoard();
        // AI
    });

    let arrowWrapper = document.createElement("div");
    arrowWrapper.classList.add("arrows-grid");
    arrowWrapper.appendChild(upArrow);
    arrowWrapper.appendChild(leftArrow);
    arrowWrapper.appendChild(rightArrow);
    arrowWrapper.appendChild(downArrow);
    

    arrows.appendChild(arrowWrapper);
    return arrows;
}

export function getControlButtons(game) {
    let controlsWrapper = document.createElement("div");
    controlsWrapper.classList.add("controls-wrapper");

    // RESET
    let reset = document.createElement("div");
    reset.classList.add("btn");
    reset.innerHTML = "Reset";
    reset.addEventListener("click", () => {
        game.resetGame();
        updateBoard();
    });

    // MODE
    let mode = document.createElement("div");
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

function getModeText(mode) {
    return mode === "multi" ? "Player vs Player" : "Player vs AI";
}


export function createBoard(state, gameBoardData, handleCellClick) {
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board-container");
    
    let newBoard = document.createElement("div");
    newBoard.id = "gameBoard";
    newBoard.classList.add("gameBoard");

    for (let i = 0; i < cst.Const.BOARD_SIZE; i++) {
        let row = document.createElement("div");
        row.classList.add("row");

        for (let j = 0; j < cst.Const.BOARD_SIZE; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");

            cell.addEventListener("click", () => handleCellClick(i, j, cell));

            if (isInGrid(state, i, j)) {
                cell.classList.add("playable");
            }

            if (gameBoardData[i][j] !== null) {
                const marker = document.createElement("div");
                marker.classList.add("symbol");
                marker.textContent = gameBoardData[i][j];
                cell.appendChild(marker);
            }

            if (state.selectedPiece && state.selectedPiece.row === i && state.selectedPiece.col === j) {
                cell.classList.add("selected");
            }

            row.appendChild(cell);
        }

        newBoard.appendChild(row);
    }
    boardContainer.appendChild(newBoard);
    return boardContainer;
}

export function isInGrid(state, row, col) {
    return row >= state.gridRow && row < state.gridRow + 3 &&
           col >= state.gridCol && col < state.gridCol + 3;
}

//TIMER

let timer = null;
let timeLeft = 10;
let currentGame = null;

export function getTimer(game) {
    currentGame = game;
    let timerDisplay = document.createElement("div");
    timerDisplay.id = "timer";
    return timerDisplay;
}

export function startTimer() {
    clearInterval(timer);
    timeLeft = 10;
    updateTimerDisplay();

    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert(`Time's up! Switching to ${currentGame.state.currentPlayer === "X" ? "O" : "X"}`);
            currentGame.clearSelectedPiece();
            currentGame.switchPlayer();
            updateBoard();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById("timer");
    if (timerElement) {
        timerElement.textContent = `Time left: ${timeLeft}s`;
    }
}

export function stopTimer() {
    clearInterval(timer);
}
