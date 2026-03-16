<script setup lang="ts">
import type { WinLine } from '@/types/slot'

defineProps<{
  winLines: WinLine[]
  themeColor?: string
}>()
</script>

<template>
  <svg v-if="winLines.length > 0" class="payline-overlay" viewBox="0 0 340 200" preserveAspectRatio="none">
    <line
      v-for="(line, i) in winLines"
      :key="i"
      :x1="line.positions[0].reel * 68 + 34"
      :y1="line.positions[0].row * 66 + 33"
      :x2="line.positions[line.positions.length - 1].reel * 68 + 34"
      :y2="line.positions[line.positions.length - 1].row * 66 + 33"
      :stroke="themeColor || '#c8a44e'"
      stroke-width="2"
      stroke-opacity="0.6"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped>
.payline-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}
</style>
