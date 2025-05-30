<script setup lang="ts">
  import { defineProps } from 'vue';
  import { useRouter } from "vue-router";
  import {useGameStore} from "@/stores/counter.ts";
  import {GameController} from "@/logic/GameController.ts";

  const props = defineProps<{
    mode: string,
    label: string,
  }>();

  const router = useRouter();
  const store = useGameStore();
  const controller = new GameController(store)

  function handleClick() {
    store.setMode(props.mode)

    // Update the state
    controller.resetGame()

    if (props.mode === 'AI_VS_AI') {
      router.push({ name: 'GameBoardView' })
    } else {
      router.push({ name: 'PlayerInfoView',})
    }
  }
</script>

<template>
  <div class="button-container">
    <button class="btn btn-primary btn-sm" @click="handleClick">
    {{ props.label }}
    </button>
  </div>
  
</template>

<style scoped>
  .button-container {
    display: flex;
    justify-content: center; 
    align-items: center;    
    height: 10vh;         
  }

  button {
    background-color: #febeffb9;
    color: black;
    border: none;
    width: 400px;
    height: 50px;
    border-radius: 8px;
    padding: 0.5rem 1rem;
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