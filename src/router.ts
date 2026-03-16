import { createRouter, createWebHistory } from 'vue-router'
import LobbyView from '@/views/LobbyView.vue'
import FloorView from '@/views/FloorView.vue'
import StatsView from '@/views/StatsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LobbyView },
    { path: '/floor', component: FloorView },
    {
      path: '/game/:id',
      component: () => import('@/views/GameShell.vue'),
      props: true,
    },
    { path: '/stats', component: StatsView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
