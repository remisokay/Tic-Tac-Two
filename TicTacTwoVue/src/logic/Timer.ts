import {isAiTurn} from "@/logic/ai/AiGameBrain";
import {performAIMove} from "@/logic/ai/AiGameBrain";
import {useGameStore} from "@/stores/counter.ts";

const MOVE_TIME_SECONDS = 15;
let moveTimerInterval: number | undefined;
let remainingTime: number = MOVE_TIME_SECONDS;

export function startMoveTimer(): void {
    remainingTime = MOVE_TIME_SECONDS;
    updateTimerDisplay();

    if (moveTimerInterval) {
        clearInterval(moveTimerInterval);
    }

    moveTimerInterval = window.setInterval(() => {
        remainingTime--;
        updateTimerDisplay();

        if (remainingTime <= 0) {
            clearInterval(moveTimerInterval);
            if (isAiTurn()) {
                performAIMove();
            } else {
                makeRandomMove();
            }
        }
    }, 1000);
}

export function resetMoveTimer(): void {
    startMoveTimer();
}

export function updateTimerDisplay(): void {
    const timerContainer = document.getElementById("timer-container");
    if (timerContainer) {
        timerContainer.textContent = `Time remaining: ${remainingTime} seconds`;
    }
}

export function stopMoveTimer(): void {
    if (moveTimerInterval) {
        clearInterval(moveTimerInterval);
    }
}

export function makeRandomMove(): void {
    const store = useGameStore();
    if (!store.brain) return;

    if (store.brain.gameOver) return;

    const validCells = store.brain.emptyCellsCoordinatesInGrid();
    if (validCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * validCells.length);
        const {x, y} = validCells[randomIndex];
        store.brain.makeAMove(x, y);

        if (!store.brain.gameOver) {
            resetMoveTimer()
        }
    } else {
        alert("No valid moves available")
    }
}