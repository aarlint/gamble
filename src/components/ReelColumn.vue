<script setup lang="ts">
import { ref, watch } from 'vue'
import SymbolTile from './SymbolTile.vue'
import type { SlotSymbol, ReelPosition } from '@/types/slot'

const props = defineProps<{
  symbols: string[]
  reelIndex: number
  spinning: boolean
  resolveSymbol: (id: string) => SlotSymbol | undefined
  winPositions: ReelPosition[]
  themeColor?: string
}>()

function isWinning(row: number): boolean {
  return props.winPositions.some(
    (p) => p.reel === props.reelIndex && p.row === row
  )
}

function getIcon(symbolId: string): string {
  return props.resolveSymbol(symbolId)?.icon || '?'
}
</script>

<template>
  <div :class="['reel-column', { spinning, 'reel-stopped': !spinning }]">
    <div class="reel-strip">
      <SymbolTile
        v-for="(sid, row) in symbols"
        :key="row"
        :icon="getIcon(sid)"
        :is-winning="isWinning(row)"
        :theme-color="themeColor"
      />
    </div>
  </div>
</template>

<style scoped>
.reel-column {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
}

.reel-strip {
  display: flex;
  flex-direction: column;
  gap: var(--reel-gap);
  padding: var(--reel-gap);
}
</style>
