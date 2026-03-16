<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { Dices } from 'lucide-vue-next'
import type { PotSize } from '@/types/slot'

const router = useRouter()
const wallet = useWalletStore()

const pots: { amount: PotSize; label: string; desc: string }[] = [
  { amount: 20, label: '$20', desc: 'Casual' },
  { amount: 100, label: '$100', desc: 'Standard' },
  { amount: 500, label: '$500', desc: 'High Roller' },
  { amount: 1000, label: '$1,000', desc: 'Whale' },
]

function selectPot(amount: PotSize) {
  wallet.startSession(amount)
  router.push('/floor')
}

// If already in session, redirect to floor
if (wallet.isActive) {
  router.replace('/floor')
}
</script>

<template>
  <div class="lobby">
    <div class="lobby-header">
      <Dices :size="48" class="lobby-icon" />
      <h1 class="lobby-title">NotDone Casino</h1>
      <p class="lobby-subtitle">Play money slots — pick your starting pot</p>
    </div>

    <div class="pot-grid">
      <button
        v-for="pot in pots"
        :key="pot.amount"
        class="pot-card"
        @click="selectPot(pot.amount)"
      >
        <span class="pot-amount">{{ pot.label }}</span>
        <span class="pot-desc">{{ pot.desc }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.lobby {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  gap: 40px;
}

.lobby-header {
  text-align: center;
}

.lobby-icon {
  color: var(--accent-gold);
  margin-bottom: 16px;
}

.lobby-title {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-gold), #e0b95e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lobby-subtitle {
  color: var(--text-secondary);
  margin-top: 8px;
  font-size: 14px;
}

.pot-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  max-width: 360px;
}

.pot-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 28px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.pot-card:hover {
  border-color: var(--accent-gold);
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}

.pot-amount {
  font-size: 28px;
  font-weight: 800;
  color: var(--accent-gold);
  font-family: var(--font-mono);
}

.pot-desc {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
