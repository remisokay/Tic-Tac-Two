import type {AIMove} from "@/logic/ai/AiMoveTypes.ts";
import {findBestGridMoveForAI} from "./AiMoveGrid.ts";
import {findBestMovePieceForAI} from "./AiMovePiece.ts";
import {chooseBestMoveForAI, findBlockingMoveForAI, findWinningMoveForAI} from "./AiPutPiece.ts";
import {useGameStore} from "@/stores/counter.ts";


/**
 * Called when it is AI's turn to make a move.
 * It waits 3 seconds waits 3 seconds to simulate thinking.
 * The function will try to win, prevent the opponent from winning and choose the best move.
 */
export function performAIMove(): void {
    const store = useGameStore();
    if (!store.brain)return;
    if (store.brain.gameOver) return;

    const brain = store.brain;
    const currentPlayer = brain.currentPlayer

    if ((currentPlayer === 'X' && brain.piecesLeftForX === 0) ||
        (currentPlayer === 'O' && brain.piecesLeftForO === 0) ||
        (brain.emptyCellsCoordinatesInGrid().length === 0)){

        const bestGridMove = findBestGridMoveForAI();
        const bestMovePiece = findBestMovePieceForAI();

        if (bestGridMove && bestGridMove.score > (bestMovePiece?.score ?? -Infinity)) {
            executeMove(bestGridMove);
            return;
        } else if (bestMovePiece) {
            executeMove(bestMovePiece);
            return;
        }
    }

    // Check if AI can win immediately.
    const winningMove = findWinningMoveForAI();
    if (winningMove) {
        executeMove(winningMove);
        return;
    }

    // Check if opponent can win nex move, and if yes then prevent that.
    const blockingMove = findBlockingMoveForAI();
    if (blockingMove) {
        executeMove(blockingMove);
        return;
    }

    // Choose the best move for AI
    const bestPlaceMove = chooseBestMoveForAI();
    // Choose the best grid move for the AI
    const bestGridMove = findBestGridMoveForAI();

    if (bestGridMove && bestGridMove.score > 0 && bestGridMove.score > (bestPlaceMove?.score ?? -Infinity)) {
        executeMove(bestGridMove);
        return;
    }

    if (bestPlaceMove) {
        executeMove(bestPlaceMove);
        return;
    }

    // Otherwise make a random move.
    performRandomMove();
}

/**
 * Executes a move base on the provided move object.
 * Currently, support only make a move action.
 *
 * @param move the move type (place, grid, movePiece)
 */
export function executeMove(move: AIMove): void {
    const store = useGameStore();
    if (!store.brain)return;

    if (move.type === "place") {
        store.brain.makeAMove(move.x, move.y);
    } else if (move.type === "grid") {
        store.brain.moveGrid(move.direction);
    } else if (move.type === "movePiece") {
        store.brain.moveAPiece(move.from.x, move.from.y, move.to.x, move.to.y);
    }
}


/**
 * Performs a random valid move for the AI.
 */
export function performRandomMove(): void {
    const store = useGameStore();
    if (!store.brain)return;


    const validCells = store.brain.emptyCellsCoordinatesInGrid();
    if (validCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * validCells.length);
        const {x, y} = validCells[randomIndex];
        store.brain.makeAMove(x, y);
    }
}

/**
 * Makes a copy of the board.
 *
 * @returns Array representing the board.
 */
export function cloneBoard(): string[][] {
    const store = useGameStore();
    if (!store.brain) return [];

    return store.brain.gameBoard.map(row => [...row]);
}

export function isAiTurn(): boolean {
    const store = useGameStore();

    return (store.gameMode === 'HUMAN_VS_AI' && store.brain?.currentPlayer === 'O') ||
        (store.gameMode === 'AI_VS_HUMAN' && store.brain?.currentPlayer === 'X') ||
        (store.gameMode === 'AI_VS_AI');
}