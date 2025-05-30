import { createRouter, createWebHistory } from 'vue-router'
import LandingPageView from '@/views/LandingPageView.vue';
import PlayerInfoView from "@/views/PlayerInfoView.vue";
import GameBoarView from "@/views/GameBoardView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {
        path: '/',
        name: 'Landing',
        component: LandingPageView,
      },

      {
          path: '/player-info/',
          name: 'PlayerInfoView',
          component: PlayerInfoView,
      },

      {
          path: '/gameboard',
          name: 'GameBoardView',
          component: GameBoarView,
      },
  ],
})

export default router