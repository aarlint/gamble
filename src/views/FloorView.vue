<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import WalletChip from '@/components/WalletChip.vue'
import JackpotMeter from '@/components/JackpotMeter.vue'
import { LogOut } from 'lucide-vue-next'

const router = useRouter()
const wallet = useWalletStore()

const games = [
  {
    id: 'egyptian',
    name: 'Egyptian Pharaoh',
    desc: 'Ancient treasures await',
    color: '#c8a44e',
    emoji: '\u{1F3FA}',
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    desc: 'Dive for riches',
    color: '#3b82f6',
    emoji: '\u{1F419}',
  },
  {
    id: 'space',
    name: 'Space Nebula',
    desc: 'Cosmic fortunes',
    color: '#a855f7',
    emoji: '\u{1F680}',
  },
  {
    id: 'wildwest',
    name: 'Wild West',
    desc: 'Gold rush fever',
    color: '#ea580c',
    emoji: '\u{1F920}',
  },
]

function playGame(id: string) {
  router.push(`/game/${id}`)
}

function exitCasino() {
  wallet.resetSession()
  router.push('/')
}
</script>

<template>
  <div class="floor">
    <div class="floor-header">
      <div class="floor-top">
        <h1 class="page-title">Casino Floor</h1>
        <div class="floor-actions">
          <WalletChip />
          <button class="exit-btn" @click="exitCasino">
            <LogOut :size="18" />
          </button>
        </div>
      </div>
      <JackpotMeter />
    </div>

    <div class="game-grid">
      <button
        v-for="game in games"
        :key="game.id"
        class="game-card"
        :style="{ '--game-color': game.color }"
        @click="playGame(game.id)"
      >
        <div class="game-icon">{{ game.emoji }}</div>
        <div class="game-info">
          <span class="game-name">{{ game.name }}</span>
          <span class="game-desc">{{ game.desc }}</span>
        </div>
        <div class="game-glow" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.floor {
  padding: 16px;
  padding-bottom: 80px;
}

.floor-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.floor-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.floor-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.exit-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: all 0.15s;
}

.exit-btn:hover {
  color: var(--accent-red);
  border-color: var(--accent-red);
}

.game-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.game-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  text-align: left;
  position: relative;
  overflow: hidden;
  transition: all 0.2s;
}

.game-card:hover {
  border-color: var(--game-color);
  transform: translateY(-2px);
  box-shadow: 0 0 20px color-mix(in srgb, var(--game-color) 30%, transparent);
}

.game-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.game-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.game-desc {
  font-size: 12px;
  color: var(--text-secondary);
}

.game-glow {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--game-color);
  opacity: 0.06;
  filter: blur(20px);
}
</style>
