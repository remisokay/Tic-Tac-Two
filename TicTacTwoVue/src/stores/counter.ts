import { defineStore } from 'pinia'
import { TicTacTwoBrain } from "@/logic/GameBrain.ts";
import { GameConfig } from "@/logic/GameConfig.ts";

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    mode: '' as string,
    player1: '' as string,
    player2: '' as string,
    actionActive: null as "choose" | "grid" | "movePiece" | "makeMove" |false | null,
    brain: null as TicTacTwoBrain | null
  }),

  getters: {
    gameMode: (state) => state.mode,
    gameBoard: (state) => state.brain ? state.brain.gameBoard : [],
    currentPlayer: (state) => state.brain ? state.brain.currentPlayer : '',
    winner: (state) => state.brain ? state.brain.winner : null,
    gameOver: (state) => state.brain ? state.brain.gameOver : false,
    moveCount: (state) => state.brain ? state.brain.moveCount : 0,
    gridPosition: (state) => state.brain ? state.brain.gridPosition : null,
    isWithinBoundsGrid: (state) => (x: number, y: number) => {
      if (!state.brain) return false
      return state.brain.isWithinBoundsGrid(x, y)
    }
  },

  actions: {
    setMode(selectedMode: string) {
      this.mode = selectedMode
    },

    setPlayers(player1: string, player2:string) {
      this.player1 = player1
      this.player2 = player2
    },

    startNewGame() {
      const config = new GameConfig("TIC TAC TWO");
      this.brain = null
      this.brain = TicTacTwoBrain.TicTacTwoBrainConfig(config, 'X')
    },

    makeMove(x: number, y: number) {
      if (!this.brain) return
      this.brain.makeAMove(x, y)
    },

    moveAPiece(startX: number, startY: number, targetX: number, targetY: number) {
      if (!this.brain) return
      this.brain.moveAPiece(startX, startY, targetX, targetY)
    },

    moveGrid(direction: string) {
      if (!this.brain) return
      this.brain.moveGrid(direction)
    },
  }
})