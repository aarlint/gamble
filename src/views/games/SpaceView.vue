<script setup lang="ts">
import GameView from '@/views/GameView.vue'
import ShootingStars from '@/components/bonus/ShootingStars.vue'
import { spaceConfig } from '@/games/space'

const starParticles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 1 + Math.random() * 3,
  delay: Math.random() * 6,
  duration: 3 + Math.random() * 4,
}))
</script>

<template>
  <div class="space-wrapper">
    <!-- Star field particles -->
    <div
      v-for="s in starParticles"
      :key="s.id"
      class="particle-dot"
      :style="{
        left: s.left + '%',
        top: s.top + '%',
        width: s.size + 'px',
        height: s.size + 'px',
        animationDelay: s.delay + 's',
        animationDuration: s.duration + 's',
      }"
    />

    <GameView :config="spaceConfig">
      <template #bonus="{ show, bet, onComplete }">
        <ShootingStars :show="show" :bet="bet" :on-complete="onComplete" />
      </template>
    </GameView>
  </div>
</template>

<style scoped>
.space-wrapper {
  position: relative;
  min-height: 100vh;
}

.particle-dot {
  position: fixed;
  border-radius: 50%;
  background: rgba(196, 181, 253, 0.7);
  box-shadow: 0 0 4px rgba(168, 85, 247, 0.5);
  pointer-events: none;
  z-index: 0;
  animation: particle-star var(--duration, 4s) ease-in-out infinite;
  animation-delay: var(--delay, 0s);
}

@keyframes particle-star {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
