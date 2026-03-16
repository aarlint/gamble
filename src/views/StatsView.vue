<script setup lang="ts">
import { computed } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import WalletChip from '@/components/WalletChip.vue'
import { TrendingUp, TrendingDown, Dices, Trophy, Target } from 'lucide-vue-next'

const wallet = useWalletStore()

const stats = computed(() => [
  { label: 'Spins', value: wallet.spinCount, icon: Dices },
  { label: 'Wagered', value: `$${wallet.totalWagered.toFixed(2)}`, icon: Target },
  { label: 'Won', value: `$${wallet.totalWon.toFixed(2)}`, icon: TrendingUp, color: 'var(--accent-green)' },
  { label: 'Biggest Win', value: `$${wallet.biggestWin.toFixed(2)}`, icon: Trophy, color: 'var(--accent-gold)' },
])

const recentHistory = computed(() =>
  [...wallet.history].reverse().slice(0, 50)
)
</script>

<template>
  <div class="stats-view">
    <div class="page-header">
      <h1 class="page-title">Stats</h1>
      <WalletChip />
    </div>

    <div class="net-profit" :class="{ negative: wallet.netProfit < 0 }">
      <component :is="wallet.netProfit >= 0 ? TrendingUp : TrendingDown" :size="20" />
      <span>Net: <span class="money" :class="{ negative: wallet.netProfit < 0 }">
        {{ wallet.netProfit >= 0 ? '+' : '' }}${{ wallet.netProfit.toFixed(2) }}
      </span></span>
    </div>

    <div class="stats-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card card">
        <component :is="s.icon" :size="18" :style="{ color: s.color || 'var(--text-muted)' }" />
        <span class="stat-value">{{ s.value }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </div>

    <div class="history-section">
      <h3 class="section-title">Recent Spins</h3>
      <div v-if="recentHistory.length === 0" class="empty-state">
        No spins yet — hit the floor!
      </div>
      <div v-else class="history-list">
        <div
          v-for="record in recentHistory"
          :key="record.id"
          class="history-item"
        >
          <span class="history-game">{{ record.gameId }}</span>
          <span class="history-bet">${{ record.bet.toFixed(2) }}</span>
          <span
            class="money"
            :class="{ negative: record.net < 0 }"
          >
            {{ record.net >= 0 ? '+' : '' }}${{ record.net.toFixed(2) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-view {
  padding: 16px;
  padding-bottom: 80px;
}

.net-profit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--accent-green);
}

.net-profit.negative {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.2);
  color: var(--accent-red);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  font-family: var(--font-mono);
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 32px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--bg-card);
  border-radius: var(--radius-sm);
  font-size: 13px;
}

.history-game {
  font-weight: 600;
  text-transform: capitalize;
  flex: 1;
}

.history-bet {
  color: var(--text-muted);
  margin-right: 12px;
}
</style>
