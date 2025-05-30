import type {GridMove} from "@/logic/ai/AiMoveTypes.ts";
import {useGameStore} from "@/stores/counter.ts";

/**
 * Gets the direction values for a grid move.
 *
 * @param direction The grid move direction.
 * @returns {{dx: number, dy: number}} THe delta value for the move.
 */
export function getGridDirectionData(direction: string): { dx: number, dy: number } {
    switch (direction) {
        case "Up": return {dx: -1, dy: 0};
        case "Down": return {dx: 1, dy: 0};
        case "Left": return {dx: 0, dy: -1};
        case "Right": return {dx: 0, dy: 1};
        case "Up-Left": return {dx: -1, dy: -1};
        case "Up-Right": return {dx: -1, dy: 1};
        case "Down-Left": return {dx: 1, dy: -1};
        case "Down-Right": return {dx: 1, dy: 1};
        default: return {dx: 0, dy: 0}
    }
}

/**
 * Evaluates grid moves by shifting the grid in the given direction.
 * The higher the positive difference the better the move.
 *
 * @param direction The direction to move the grid
 * @returns {number} The score for the grid move.
 */
export function evaluateGridMove(direction: string): number {
    const store = useGameStore();
    if (!store.brain) return 0;

    let currentGridPosition = store.brain.gridPosition;
    const delta = getGridDirectionData(direction);
    const newX = currentGridPosition.left + delta.dx;
    const newY = currentGridPosition.top + delta.dy;
    const gridWidth = store.brain.gridWidth;
    const gridHeight = store.brain.gridHeight;
    const boardWidth = store.brain.boardSizeWidth;
    const boardHeight = store.brain.boardSizeHeight;

    if (newX < 0 || newX > boardWidth - gridWidth ||
        newY < 0 || newY > boardHeight - gridHeight) {
        return -Infinity;
    }

    const newGridPosition = {
        left: newX,
        top: newY,
        right: newX + gridWidth,
        bottom: newY + gridHeight
    };

    let aiPieceCount = 0, opponentPieceCount = 0;
    const board = store.brain.gameBoard;
    const currentPlayer = store.brain.currentPlayer;
    const opponent = currentPlayer === 'X' ? 'O' : 'X';
    for (let x = newGridPosition.left; x < newGridPosition.right; x++) {
        for (let y = newGridPosition.top; y < newGridPosition.bottom; y++) {
            if (board[x][y] === currentPlayer) {
                aiPieceCount++;
            } else if (board[x][y] === opponent) {
                opponentPieceCount++;
            }
        }
    }

    return aiPieceCount - opponentPieceCount;
}

/**
 * Goes through all possible grid move directions and returns the best grid move.
 *
 * @returns A grid move object containing type of the move, direction, and score
 */
export function findBestGridMoveForAI(): GridMove | null {
    const directions = ["Up", "Down", "Left", "Right", "Up-Left", "Up-Right", "Down-Left", "Down-Right"];
    let bestMove: GridMove | null = null;
    let highestScore = -Infinity;
    for (let dir of directions) {
        const score = evaluateGridMove(dir);
        if (score > highestScore) {
            highestScore = score;
            bestMove = {type: "grid", direction: dir, score: score}
        }
    }
    return bestMove;
}