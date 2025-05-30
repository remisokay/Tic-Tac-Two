<script setup lang="ts">
  import { RouterLink, useRoute } from "vue-router";
  import {stopMoveTimer} from "@/logic/Timer.ts";
  const route = useRoute();

  function isActiveLink(path: string) {
    stopMoveTimer()
    return route.path === path;
  }
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item me-3">
          <RouterLink
              to="/"
              class="nav-link"
              :class="{ active: isActiveLink('/') }"
          >
            Home
          </RouterLink>
        </li>

        <li class="nav-item me-3">
          <RouterLink
              to="/rules"
              class="nav-link"
              :class="{ active: isActiveLink('/rules') }"
          >
            Rules
          </RouterLink>
        </li>

        <li class="nav-item me-5">
          <RouterLink
              to="/something"
              class="nav-link"
              :class="{ active: isActiveLink('/something') }"
          >
            Something
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.nav-link.active {
  background-color: rgb(245, 253, 12);
  border-radius: 4px;
  color: black;
}
</style>