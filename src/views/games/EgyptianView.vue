<script setup lang="ts">
import GameView from '@/views/GameView.vue'
import TreasureMap from '@/components/bonus/TreasureMap.vue'
import { egyptianConfig } from '@/games/egyptian'

function particleStyle(i: number) {
  const left = Math.random() * 100
  const delay = Math.random() * 8
  const duration = 6 + Math.random() * 6
  const size = 2 + Math.random() * 3
  const opacity = 0.2 + Math.random() * 0.3
  return {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: opacity,
  }
}
</script>

<template>
  <GameView :config="egyptianConfig">
    <template #bonus="{ show, bet, onComplete }">
      <TreasureMap :show="show" :bet="bet" :on-complete="onComplete" />
    </template>
  </GameView>
  <!-- Sand particles -->
  <div class="particles">
    <div v-for="i in 20" :key="i" class="particle" :style="particleStyle(i)" />
  </div>
</template>

<style scoped>
.particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  top: -10px;
  border-radius: 50%;
  background: #c8a44e;
  animation: particle-sand linear infinite;
}
</style>
