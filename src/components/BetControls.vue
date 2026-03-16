<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next'

const props = defineProps<{
  bet: number
  minBet: number
  maxBet: number
  step: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:bet': [value: number]
}>()

function decrease() {
  const next = Math.max(props.minBet, props.bet - props.step)
  emit('update:bet', Math.round(next * 100) / 100)
}

function increase() {
  const next = Math.min(props.maxBet, props.bet + props.step)
  emit('update:bet', Math.round(next * 100) / 100)
}
</script>

<template>
  <div class="bet-controls">
    <button class="bet-btn" @click="decrease" :disabled="disabled || bet <= minBet">
      <Minus :size="18" />
    </button>
    <div class="bet-display">
      <span class="bet-label">BET</span>
      <span class="bet-amount">${{ bet.toFixed(2) }}</span>
    </div>
    <button class="bet-btn" @click="increase" :disabled="disabled || bet >= maxBet">
      <Plus :size="18" />
    </button>
  </div>
</template>

<style scoped>
.bet-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bet-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  transition: all 0.15s;
}

.bet-btn:hover:not(:disabled) {
  background: var(--bg-card);
  border-color: var(--accent-gold);
}

.bet-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.bet-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.bet-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--text-muted);
}

.bet-amount {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
}
</style>
