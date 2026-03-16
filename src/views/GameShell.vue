<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Lazy import game views
import EgyptianView from '@/views/games/EgyptianView.vue'
import OceanView from '@/views/games/OceanView.vue'
import SpaceView from '@/views/games/SpaceView.vue'
import WildWestView from '@/views/games/WildWestView.vue'

const route = useRoute()
const router = useRouter()

const gameComponents: Record<string, any> = {
  egyptian: EgyptianView,
  ocean: OceanView,
  space: SpaceView,
  wildwest: WildWestView,
}

const currentGame = computed(() => {
  const id = route.params.id as string
  return gameComponents[id]
})

if (!currentGame.value) {
  router.replace('/floor')
}
</script>

<template>
  <component :is="currentGame" v-if="currentGame" />
  <div v-else class="loading">Loading...</div>
</template>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: var(--text-muted);
}
</style>
