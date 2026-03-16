<script setup lang="ts">
import { onMounted, ref } from 'vue'
import GameView from '@/views/GameView.vue'
import WheelSpin from '@/components/bonus/WheelSpin.vue'
import { wildwestConfig } from '@/games/wildwest'

interface DustParticle {
  id: number
  left: string
  top: string
  delay: string
  duration: string
  size: string
}

const dustParticles = ref<DustParticle[]>([])

onMounted(() => {
  const particles: DustParticle[] = []
  for (let i = 0; i < 20; i++) {
    particles.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${4 + Math.random() * 4}s`,
      size: `${2 + Math.random() * 3}px`,
    })
  }
  dustParticles.value = particles
})
</script>

<template>
  <div class="wildwest-wrapper">
    <div class="dust-layer" aria-hidden="true">
      <div
        v-for="p in dustParticles"
        :key="p.id"
        class="dust-particle"
        :style="{
          left: p.left,
          top: p.top,
          animationDelay: p.delay,
          animationDuration: p.duration,
          width: p.size,
          height: p.size,
        }"
      />
    </div>

    <GameView :config="wildwestConfig">
      <template #bonus="{ show, bet, onComplete }">
        <WheelSpin :show="show" :bet="bet" :on-complete="onComplete" />
      </template>
    </GameView>
  </div>
</template>

<style scoped>
.wildwest-wrapper {
  position: relative;
  min-height: 100vh;
}

.dust-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.dust-particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(234, 88, 12, 0.3);
  animation: particle-dust infinite ease-in-out;
}
</style>
