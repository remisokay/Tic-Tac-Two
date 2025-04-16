import * as UI from './ui/ui';
import * as cst from './logic/const.ts';
import { GameBrain } from './logic/brain.ts';

let game = new GameBrain();

export default function App() {
    const statusBar = UI.getStatusBar(game.state);
    document.body.appendChild(statusBar);

    const arrows = UI.getArrows(game);
    document.body.appendChild(arrows);

    const controlButtons = UI.getControlButtons(game);
    document.body.appendChild(controlButtons);

    const board = UI.createBoard(game.state, game.board, handleCellClick);
    document.body.appendChild(board);

    const timer = UI.getTimer(game);
    document.body.appendChild(timer);

}

function handleCellClick(row: number, col: number) {
    const cellValue = game.board[row][col];
    const currentPlayer = game.state.currentPlayer;
    const selected = game.state.selectedPiece;
    
    if (game.state.gameOver) return;

    if (selected && cellValue === null && game.isInGrid(row, col)) {
        game.movePiece(selected.row, selected.col, row, col);
        game.clearSelectedPiece();
        updateBoard();
        UI.startTimer();
        return;
    }

    if (selected && selected.row === row && selected.col === col) {
        game.clearSelectedPiece();
        updateBoard();
        return;
    }

    if (cellValue === currentPlayer && !selected) {
        game.selectPiece(row, col);
        updateBoard();
        return;
    }

    if (cellValue === null && game.isInGrid(row, col) && game.state.placedSymbols[currentPlayer] < cst.Const.MAX_SBL) {
        game.placePiece(row, col);
        game.clearSelectedPiece();
        updateBoard();
        UI.startTimer();
        return;
    }
}

export function updateBoard() {
    const oldBar = document.querySelector('.status-bar');
    if (oldBar) oldBar.remove();
    document.body.appendChild(UI.getStatusBar(game.state));

    const oldBoard = document.querySelector('.board-container');
    if (oldBoard) oldBoard.remove();
    document.body.appendChild(UI.createBoard(game.state, game.board, handleCellClick));

    const oldTimer = document.getElementById('timer');
    if (oldTimer) oldTimer.remove();
    document.body.appendChild(UI.getTimer(game));

    if (game.state.gameMode === 'single' && game.state.currentPlayer === 'O') {
        UI.stopTimer();
        setTimeout(() => {
            game.botMove();
            updateBoard();
        }, 500);
    } else if (!game.state.gameOver && game.state.gameStarted) {
        UI.startTimer();
    }
}

