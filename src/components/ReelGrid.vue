<script setup lang="ts">
import { ref, watch } from 'vue'
import ReelColumn from './ReelColumn.vue'
import type { SlotSymbol, ReelPosition } from '@/types/slot'

const props = defineProps<{
  grid: string[][]
  spinning: boolean
  resolveSymbol: (id: string) => SlotSymbol | undefined
  winPositions: ReelPosition[]
  themeColor?: string
}>()

const reelStates = ref<boolean[]>([true, true, true, true, true])

watch(
  () => props.spinning,
  (isSpinning) => {
    if (isSpinning) {
      reelStates.value = [true, true, true, true, true]
    } else {
      // Stagger stop: 200ms apart
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          reelStates.value[i] = false
        }, i * 200)
      }
    }
  }
)
</script>

<template>
  <div class="reel-grid">
    <ReelColumn
      v-for="(col, i) in grid"
      :key="i"
      :symbols="col"
      :reel-index="i"
      :spinning="reelStates[i]"
      :resolve-symbol="resolveSymbol"
      :win-positions="winPositions"
      :theme-color="themeColor"
    />
  </div>
</template>

<style scoped>
.reel-grid {
  display: flex;
  gap: var(--reel-gap);
  justify-content: center;
  padding: 8px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}
</style>
