import {GameController} from "@/logic/GameController.ts";
import {cloneBoard} from "./AiGameBrain.ts";
import type {PlaceMove} from "@/logic/ai/AiMoveTypes.ts";
import {useGameStore} from "@/stores/counter.ts";

/**
 * Searches for a winning move for AI.
 * Iterates over all empty cells to find the best move that will get AI closer to winning.
 */
export function findWinningMoveForAI(): PlaceMove | null {
    const store = useGameStore();
    if (!store.brain) return null;

    const currentPlayer = store.brain.currentPlayer;
    const validCells = store.brain.emptyCellsCoordinatesInGrid();
    for (let cell of validCells) {
        if (simulatePlaceMove(cell.x, cell.y, currentPlayer)) {
            return {type: "place", x: cell.x, y: cell.y };
        }
    }
    return null;
}

/**
 * Searches for move to prevent opponent from winning.
 * For each empty cell calculates a threat score that is used to determine the best blocking move.
 *
 * @return A move object that will prevent other person from winning.
 */
export function findBlockingMoveForAI(): PlaceMove | null {
    const store = useGameStore();
    if (!store.brain) return null;

    const opponent = store.brain.currentPlayer === 'X' ? 'O' : 'X';
    const validCells = store.brain.emptyCellsCoordinatesInGrid();
    let bestMove: PlaceMove | null = null;
    let highestScore = 0;
    for (let cell of validCells) {
        const boardCopy = cloneBoard();
        const score = calculateThreatScore(cell.x, cell.y, opponent, boardCopy);

        if (score > highestScore) {
            highestScore = score;
            bestMove = {type: "place", x: cell.x, y: cell.y}
        }
    }

    // If opponent one move away from the win
    if (highestScore >= store.brain.winCondition - 1) {
        return bestMove;
    }

    return null;
}

/**
 * Chooses the best move for AI that will lead it closer to winning.
 *
 * @returns a move object that represents the best move for the AI.
 */
export function chooseBestMoveForAI(): PlaceMove | null {
    const store = useGameStore();
    if (!store.brain) return null;

    const currentPlayer = store.brain.currentPlayer;
    const validCells = store.brain.emptyCellsCoordinatesInGrid();
    let bestMove: PlaceMove | null = null;
    let highestScore = -100;
    for (let cell of validCells) {
        const boardCopy = cloneBoard();
        const score = evaluateMove(cell.x, cell.y, currentPlayer, boardCopy);

        if (score > highestScore) {
            highestScore = score;
            bestMove = { type: "place", x: cell.x, y: cell.y };
        }
    }
    return bestMove
}

/**
 * Simulates placing a piece for a given player and returns
 * true if the given move would lead to immediate win.
 *
 * @param x The row index.
 * @param y The column index.
 * @param player The player (X or O).
 * @returns True if the move lead to a win, otherwise false.
 */
export function simulatePlaceMove(x: number, y: number, player: 'X' | 'O'): boolean {
    const store = useGameStore();
    if (!store.brain) return false;

    const boardCopy = store.brain.gameBoard.map(row => [...row]);
    boardCopy[x][y] = player;
    return simulateWinCondition(x, y, player, boardCopy);
}

/**
 * Checks whether a win condition is met on the simulated board.
 *
 * @param x The row index of the move.
 * @param y The column index of the move.
 * @param player The player (X or O).
 * @param board True if the win condition is met, otherwise false.
 */
export function simulateWinCondition(x: number, y:number, player: 'X' | 'O', board: string[][]): boolean {
    const store = useGameStore();
    if (!store.brain) return false;

    const winCondition = store.brain.winCondition;
    const boardWidth = store.brain.boardSizeWidth;
    const boardHeight = store.brain.boardSizeHeight;

    const countInDirection = (dx: number, dy: number): number => {
        let count = 0;
        for (let i = 1; i < winCondition; i++) {
            const checkX = x + i * dx;
            const checkY = y + i * dy;

            if (checkX >= 0 && checkX < boardWidth &&
                checkY >= 0 && checkY < boardHeight &&
                store.brain?.isWithinBoundsGrid(checkX, checkY) && // ??
                board[checkX][checkY] === player) {
                count++
            } else {
                break;
            }
        }
        return count;
    }

    const directions = [
        {dx: 1, dy: 0},
        {dx: 0, dy: 1},
        {dx: 1, dy: 1},
        {dx: 1, dy: -1}
    ];

    for (let { dx, dy } of directions) {
        let count = 1 + countInDirection(dx, dy) + countInDirection(-dx, -dy);
        if (count >= winCondition) {
            return true;
        }
    }
    return false;
}

/**
 * Calculates the threat score by simulating the potential moves of the opponent.
 * The threat score is calculated by the maximum consecutive pieces.
 *
 * @param x The row index of the cell.
 * @param y The column index of the cell.
 * @param opponent The opponents symbol (X or O).
 * @param board A copy of the board.
 * @returns The threat score for the cell.
 */
export function calculateThreatScore(x: number, y: number, opponent: 'X' | 'O', board: string[][]): number {
    const store = useGameStore();
    if (!store.brain) return 0;

    board[x][y] = opponent;
    const winCondition = store.brain.winCondition;
    const boardWidth = store.brain.boardSizeWidth;
    const boardHeight = store.brain.boardSizeHeight;

    function countConsecutive(dx: number, dy: number): number {
        let count = 1;
        for (let step = 1; step < winCondition; step++) {
            const nx = x + step * dx;
            const ny = y + step * dy;

            if (nx >= 0 && nx < boardWidth &&
                ny >= 0 && ny < boardHeight &&
                store.brain?.isWithinBoundsGrid(nx, ny) && // ??
                board[nx][ny] === opponent) {
                count++
            } else {
                break;
            }
        }
        for (let step = 1; step < winCondition; step++) {
            const nx = x - step * dx;
            const ny = y - step * dy;
            if (
                nx >= 0 && nx < boardWidth &&
                ny >= 0 && ny < boardHeight &&
                store.brain?.isWithinBoundsGrid(nx, ny) && // ??
                board[nx][ny] === opponent
            ) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }

    let maxScore = 0;
    const directions = [
        {dx: 1, dy: 0},
        {dx: 0, dy: 1},
        {dx: 1, dy: 1},
        {dx: 1, dy: -1}
    ];

    for (let { dx, dy } of directions) {
        const score = countConsecutive(dx, dy);
        if (score > maxScore) {
            maxScore = score;
        }
    }

    board[x][y] = 'Empty';
    return maxScore;
}

/**
 * Evaluates a move for the given player by placing a piece at (x, y)
 * and returning the maximum count in direction.
 *
 * @param x The row index of the move.
 * @param y The column index of the move.
 * @param player The player (X or O)
 * @param board a copy of the board.
 * @returns the highest consecutive count.
 */
export function evaluateMove(x: number, y:number, player: 'X' | 'O', board: string[][]): number {
    const store = useGameStore();
    if (!store.brain) return 0;

    board[x][y] = player;
    const winCondition = store.brain.winCondition;
    const boardWidth = store.brain.boardSizeWidth;
    const boardHeight = store.brain.boardSizeHeight;

    /**
     * Counts the number of consecutive pieces in a given direction.
     *
     * @param dx
     * @param dy
     * @returns The total count od consecutive pieces.
     */
    function countLine(dx: number, dy: number): number {
        let count = 1;
        for (let step = 1; step < winCondition; step++) {
            const nx = x + step * dx;
            const ny = y + step * dy;
            if (nx >= 0 && nx < boardWidth && ny >= 0 && ny < boardHeight && board[nx][ny] === player) {
                count++;
            } else {
                break;
            }
        }
        for (let step = 1; step < winCondition; step++) {
            const nx = x - step * dx;
            const ny = y - step * dy;
            if (nx >= 0 && nx < boardWidth && ny >= 0 && ny < boardHeight && board[nx][ny] === player) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }

    let bestLine = 0;
    const directions = [
        {dx: 1, dy: 0},
        {dx: 0, dy: 1},
        {dx: 1, dy: 1},
        {dx: 1, dy: -1}
    ];
    for (let {dx, dy} of directions) {
        bestLine = Math.max(bestLine, countLine(dx, dy));
    }
    board[x][y] = 'Empty';
    return bestLine;
}