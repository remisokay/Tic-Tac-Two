<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from 'vue'
import { useGameStore } from "@/stores/counter.ts";

const router = useRouter();
const store = useGameStore();

const mode = store.mode;
const player1 = ref('');
const player2 = ref('');

function startGame() {
  store.setPlayers(player1.value, player2.value)
  router.push({ name: 'GameBoardView' })
}
</script>

<template>
  <div class="player-page-container">
    <h2 class="title">Player Info</h2>

    <div class="player-input-container" v-if="mode === 'HUMAN_VS_HUMAN'">
      <div class="input-group">
        <label>Player 1 Name</label>
        <input type="text" v-model="player1"/>
      </div>
      <div class="input-group">
        <label>Player 2 Name</label>
        <input type="text" v-model="player2"/>
      </div>
    </div>

    <div class="player-input-container" v-else-if="mode === 'HUMAN_VS_AI' || mode === 'AI_VS_HUMAN'">
      <div class="input-group">
        <label>Your name</label>
        <input type="text" v-model="player1"/>
      </div>
    </div>

    <button class="start-button" @click="startGame">Start Game</button>
  </div>
</template>

<style scoped>
  .player-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: transparent;
}

/* Title styling */
.title {
  font-family: 'Comic Neue', sans-serif;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

/* Container for inputs & labels */
.player-input-container {
  background-color: rgba(255, 255, 255, 0.4); /* Glassy transparent background */
  box-shadow: 0 4px 12px rgba(135, 206, 235, 0.4); /* Soft blue shadow */
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(6px); /* Frosted glass */
  width: 300px;
  margin-bottom: 1rem;
}

/* Group styling for each input */
.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

/* Label styling */
label {
  display: block;
  font-family: 'Comic Neue', sans-serif;
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.3rem;
}

/* Input styling */
input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  font-family: 'Comic Neue', sans-serif;
}

/* Button styling to match landing page style */
.start-button {
  background-color: #fd90ffb9;
  color: black;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-family: 'Comic Neue', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(135, 206, 235, 0.5);
  transition: transform 0.1s ease, background 0.3s ease, box-shadow 0.3s ease;
}

.start-button:hover {
  background-color: #ffb3c9;
  box-shadow: 0 6px 12px rgba(135, 206, 235, 0.7);
  transform: translateY(-2px);
}
</style>