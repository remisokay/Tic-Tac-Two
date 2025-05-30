<script setup lang="ts">
  import GameModeButton from '@/components/ModeButton.vue';
</script>

<template>
  <div class="container mt-5 text-center">
    <h1 class="mb-4">Welcome to Tic-Tac-Two!</h1>
    <div class="d-grid gap-3 col-6 mx-auto">
      <GameModeButton mode="HUMAN_VS_HUMAN" label="Human VS Human"/>
      <GameModeButton mode="HUMAN_VS_AI" label="Human VS AI"/>
      <GameModeButton mode="AI_VS_AI" label="AI VS AI"/>
    </div>
  </div>
</template>

<style>

</style>