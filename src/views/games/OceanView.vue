<script setup lang="ts">
import GameView from '@/views/GameView.vue'
import PickAPrize from '@/components/bonus/PickAPrize.vue'
import { oceanConfig } from '@/games/ocean'

const bubbles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 5 + Math.random() * 6,
  size: 3 + Math.random() * 8,
}))
</script>

<template>
  <div class="ocean-wrapper">
    <div class="ocean-particles" aria-hidden="true">
      <div
        v-for="b in bubbles"
        :key="b.id"
        class="ocean-bubble"
        :style="{
          left: b.left + '%',
          animationDelay: b.delay + 's',
          animationDuration: b.duration + 's',
          width: b.size + 'px',
          height: b.size + 'px',
        }"
      />
    </div>

    <GameView :config="oceanConfig">
      <template #bonus="{ show, bet, onComplete }">
        <PickAPrize :show="show" :bet="bet" :on-complete="onComplete" />
      </template>
    </GameView>
  </div>
</template>

<style scoped>
.ocean-wrapper {
  position: relative;
}

.ocean-particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.ocean-bubble {
  position: absolute;
  bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(59, 180, 246, 0.35), rgba(59, 130, 246, 0.08));
  animation: particle-bubble linear infinite;
}
</style>
