<script setup lang="ts">
import { useJackpotStore } from '@/stores/jackpot'
import { Trophy } from 'lucide-vue-next'

const jackpot = useJackpotStore()
</script>

<template>
  <div class="jackpot-meter">
    <Trophy :size="18" class="trophy-icon" />
    <span class="jackpot-label">JACKPOT</span>
    <span class="jackpot-amount">${{ jackpot.amount.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
  </div>
</template>

<style scoped>
.jackpot-meter {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(200, 164, 78, 0.15), rgba(200, 164, 78, 0.05));
  border: 1px solid rgba(200, 164, 78, 0.3);
  border-radius: var(--radius-md);
  padding: 10px 16px;
}

.trophy-icon {
  color: var(--accent-gold);
}

.jackpot-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--accent-gold);
}

.jackpot-amount {
  font-size: 18px;
  font-weight: 800;
  color: var(--accent-gold);
  font-family: var(--font-mono);
  animation: jackpot-glow 2s ease-in-out infinite;
}
</style>
