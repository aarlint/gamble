<script setup lang="ts">
import { ref } from 'vue'
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

const activeStep = ref(props.step)

const steps = [
  { label: 'MIN', value: 'min' },
  { label: `${props.step}`, value: props.step },
  { label: '1', value: 1 },
  { label: '10', value: 10 },
  { label: 'MAX', value: 'max' },
]

function decrease() {
  if (activeStep.value === 'min' || activeStep.value === 'max') return
  const next = Math.max(props.minBet, props.bet - (activeStep.value as number))
  emit('update:bet', Math.round(next * 100) / 100)
}

function increase() {
  if (activeStep.value === 'min' || activeStep.value === 'max') return
  const next = Math.min(props.maxBet, props.bet + (activeStep.value as number))
  emit('update:bet', Math.round(next * 100) / 100)
}

function setStep(value: number | string) {
  if (value === 'min') {
    emit('update:bet', props.minBet)
    return
  }
  if (value === 'max') {
    emit('update:bet', props.maxBet)
    return
  }
  activeStep.value = value as number
}
</script>

<template>
  <div class="bet-controls">
    <div class="step-row">
      <button
        v-for="s in steps"
        :key="s.label"
        class="step-btn"
        :class="{ active: activeStep === s.value && s.value !== 'min' && s.value !== 'max' }"
        :disabled="disabled"
        @click="setStep(s.value)"
      >
        {{ s.label }}
      </button>
    </div>
    <div class="bet-row">
      <button class="bet-btn" @click="decrease" :disabled="disabled || bet <= minBet || activeStep === 'min' || activeStep === 'max'">
        <Minus :size="18" />
      </button>
      <div class="bet-display">
        <span class="bet-label">BET</span>
        <span class="bet-amount">${{ bet.toFixed(2) }}</span>
      </div>
      <button class="bet-btn" @click="increase" :disabled="disabled || bet >= maxBet || activeStep === 'min' || activeStep === 'max'">
        <Plus :size="18" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.bet-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.step-row {
  display: flex;
  gap: 4px;
}

.step-btn {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  border-radius: var(--radius-full);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  transition: all 0.15s;
  letter-spacing: 0.5px;
}

.step-btn.active {
  background: rgba(200, 164, 78, 0.15);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.step-btn:hover:not(:disabled):not(.active) {
  border-color: var(--text-muted);
  color: var(--text-secondary);
}

.step-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.bet-row {
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
