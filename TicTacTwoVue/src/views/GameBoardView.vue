<script setup lang="ts">
import { useGameStore } from "@/stores/counter.ts";
import {computed, onMounted} from "vue";
import {GameController} from "@/logic/GameController.ts";
import {isAiTurn, performAIMove} from "@/logic/ai/AiGameBrain.ts";
import {resetMoveTimer, startMoveTimer} from "@/logic/Timer.ts";

const store = useGameStore()
onMounted(() => {
  if (!store.brain) {
    store.startNewGame()
  }
  startMoveTimer()
  if (!store.gameOver && isAiTurn()) {
    setTimeout(() => {
      performAIMove()
      if (!store.gameOver) {
        resetMoveTimer()
      }
    }, 3000)
  }
})

const gameBoard = computed(() => store.gameBoard)
const currentPlayer = computed(() => store.currentPlayer)
const gameOver = computed(() => store.gameOver)
const winner = computed(() => store.winner)
const showActionButtons = computed(() => store.moveCount >= 4)
const controller = new GameController(store)
const currentPlayerPieces = computed(() => {
  return store.currentPlayer === 'X' ? store.brain?.piecesLeftForX : store.brain?.piecesLeftForO
})

function handleClick(x: number, y: number) {
  if (gameOver.value) return;
  if (isAiTurn()) return;

  controller.handleCellClick(x, y)

  if (!store.gameOver) {
    resetMoveTimer()
  }

  if (!store.gameOver && isAiTurn()) {
    setTimeout(() => {
      performAIMove()
      if (!store.gameOver) {
        resetMoveTimer()
      }
    }, 3000)
  }
}
</script>

<template>
  <div class="container mt-5">
    <h2>Let the Game Begin!</h2>

    <div class="game-area">
      <div class="board">
        <div v-for="(row, x) in gameBoard" :key="x" class="board-row">
          <div
            v-for="(value, y) in row"
            :key="y"
            class="board-cell"
            :class="{ inner: store.isWithinBoundsGrid(x, y) }"
            @click="handleClick(x, y)">
            {{ value === 'Empty' ? '' : value }}
          </div>
        </div>
      </div>

      <div class="info-panel">
        <p>Player 1 name: {{ store.player1 }}</p>
        <p>Player 2 name: {{ store.player2 }}</p>
        <p>It's now {{ currentPlayer }}'s turn</p>
        <p>You have {{ currentPlayerPieces }} pieces left!</p>

        <div id="timer-container" class="mb-3"></div>

        <div v-if="!store.gameOver && showActionButtons && store.actionActive === null && !isAiTurn()">
          <button v-if="currentPlayerPieces! > 0" @click="store.actionActive = 'makeMove'">Make a Move</button>
          <button @click="store.actionActive = 'grid'">Move the Grid</button>
          <button @click="store.actionActive = 'movePiece'">Move a Piece</button>
        </div>

        <div v-if="store.actionActive === 'grid'">
          <p>Select direction</p>
          <button @click="controller.handleGridMove('Up')">Up</button>
          <button @click="controller.handleGridMove('Down')">Down</button>
          <button @click="controller.handleGridMove('Left')">Left</button>
          <button @click="controller.handleGridMove('Right')">Right</button>
          <button @click="controller.handleGridMove('Up-Left')">Up Left</button>
          <button @click="controller.handleGridMove('Up-Right')">Up Right</button>
          <button @click="controller.handleGridMove('Down-Left')">Down Left</button>
          <button @click="controller.handleGridMove('Down-Right')">Down Right</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Comic Neue', sans-serif;
  color: #333;
}

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: center;
    width: 100%;
  }

  /* New flex container for board + info */
  .game-area {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
    justify-content: center;
  }

  /* Board styles remain mostly same */
  .board {
    display: grid;
    grid-template-columns: repeat(5, 60px);
    grid-template-rows: repeat(5, 60px);
    gap: 6px;
    background-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 4px 12px rgba(135, 206, 235, 0.4);
    border: 1px rgb(157, 157, 255) solid;
    border-radius: 16px;
    padding: 8px;
    backdrop-filter: blur(6px);
  }

  /* Info panel styling */
  .info-panel {
    display: flex;
    flex-direction: column;
    background-color: rgba(253, 144, 255, 0.15);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(135, 206, 235, 0.3);
    min-width: 220px;
    font-size: 1rem;
    color: #333;
  }

  .info-panel p {
    margin: 0.5rem 0;
  }

  

  /* Individual cell styling */
  .board-cell {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    border: 1px rgb(157, 157, 255) solid;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.8); /* outer cells */
    transition: transform 0.1s ease, box-shadow 0.3s ease;
  }

  /* Inner cells with a more vibrant color */
  .board-cell.inner {
    background-color: rgba(253, 144, 255, 0.3); /* pastel pink matching app vibe */
    box-shadow: inset 0 2px 4px rgba(135, 206, 235, 0.2);
  }

  /* Cell hover effect for more tactile feel */
  .board-cell:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(135, 206, 235, 0.3);
  }

  /* Current player info and action buttons */
  p {
    margin: 0.3rem 0;
  }

  /* Buttons for actions, matching landing page style */
  button {
    background-color: #fd90ffb9;
    color: black;
    border: none;
    border-radius: 8px;
    padding: 0.4rem 0.8rem;
    margin: 0.2rem;
    font-family: 'Comic Neue', sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(135, 206, 235, 0.5);
    transition: transform 0.1s ease, background 0.3s ease, box-shadow 0.3s ease;
  }

  button:hover {
    background-color: #ffb3c9;
    box-shadow: 0 6px 12px rgba(135, 206, 235, 0.7);
    transform: translateY(-2px);
  }
</style>