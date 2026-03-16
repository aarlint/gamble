<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  icon: string
  isWinning?: boolean
  themeColor?: string
}>()

const tileClass = computed(() => ({
  'symbol-tile': true,
  'symbol-win': props.isWinning,
}))
</script>

<template>
  <div :class="tileClass">
    <span class="symbol-icon">{{ icon }}</span>
    <div v-if="isWinning" class="win-highlight" :style="{ borderColor: themeColor || 'var(--accent-gold)' }" />
  </div>
</template>

<style scoped>
.symbol-tile {
  width: var(--symbol-size);
  height: var(--symbol-size);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
}

.symbol-icon {
  font-size: 32px;
  line-height: 1;
}

.win-highlight {
  position: absolute;
  inset: -2px;
  border: 2px solid var(--accent-gold);
  border-radius: 10px;
  pointer-events: none;
  box-shadow: 0 0 10px rgba(200, 164, 78, 0.4);
}
</style>
