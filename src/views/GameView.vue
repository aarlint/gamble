<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { useJackpotStore } from '@/stores/jackpot'
import { useSlotEngine } from '@/composables/useSlotEngine'
import { useAutoSpin } from '@/composables/useAutoSpin'
import ReelGrid from '@/components/ReelGrid.vue'
import BetControls from '@/components/BetControls.vue'
import WalletChip from '@/components/WalletChip.vue'
import WinBanner from '@/components/WinBanner.vue'
import JackpotMeter from '@/components/JackpotMeter.vue'
import type { GameConfig, SpinResult, ReelPosition } from '@/types/slot'
import { ArrowLeft, Zap, RotateCcw } from 'lucide-vue-next'

const props = defineProps<{
  config: GameConfig
}>()

const route = useRoute()
const router = useRouter()
const wallet = useWalletStore()
const jackpot = useJackpotStore()
const engine = useSlotEngine(props.config)

const bet = ref(props.config.minBet)
const grid = ref<string[][]>(engine.generateGrid())
const spinning = ref(false)
const lastResult = ref<SpinResult | null>(null)
const showWin = ref(false)
const lastWin = ref(0)
const freeSpins = ref(0)
const showBonus = ref(false)
const bonusWin = ref(0)

const winPositions = computed<ReelPosition[]>(() => {
  if (!lastResult.value || spinning.value) return []
  return lastResult.value.winLines.flatMap((wl) => wl.positions)
})

const { isAutoSpinning, autoSpinRemaining, startAutoSpin, stopAutoSpin } =
  useAutoSpin(doSpin)

async function doSpin() {
  if (spinning.value) return
  if (!wallet.canAfford(bet.value) && freeSpins.value <= 0) return

  spinning.value = true
  showWin.value = false

  const isFree = freeSpins.value > 0
  if (isFree) {
    freeSpins.value--
  } else {
    wallet.placeBet(bet.value)
  }

  // Contribute to jackpot
  jackpot.contribute(bet.value, props.config.jackpotContribution)

  // Wait for spin animation
  await new Promise((r) => setTimeout(r, 600))

  const result = engine.spin(bet.value)

  // Apply free spin multiplier
  if (isFree && result.totalWin > 0) {
    result.totalWin = Math.round(result.totalWin * props.config.freeSpinMultiplier * 100) / 100
  }

  // Check jackpot
  if (jackpot.checkWin()) {
    result.jackpotWon = true
    result.jackpotAmount = jackpot.claimJackpot()
    result.totalWin += result.jackpotAmount
  }

  grid.value = result.grid
  lastResult.value = result
  spinning.value = false

  // Award free spins
  if (result.freeSpinsTriggered && !isFree) {
    freeSpins.value += props.config.freeSpinsAwarded
  }

  // Handle bonus
  if (result.bonusTriggered) {
    showBonus.value = true
  }

  // Record in wallet
  if (result.totalWin > 0) {
    wallet.addWinnings(result.totalWin, props.config.id, isFree ? 0 : bet.value)
    lastWin.value = result.totalWin
    showWin.value = true
  } else if (!isFree) {
    wallet.recordLoss(props.config.id, bet.value)
  }
}

function onBonusComplete(winAmount: number) {
  showBonus.value = false
  if (winAmount > 0) {
    bonusWin.value = winAmount
    wallet.addWinnings(winAmount, props.config.id, 0)
    lastWin.value = winAmount
    showWin.value = true
  }
}

function goBack() {
  if (isAutoSpinning.value) stopAutoSpin()
  router.push('/floor')
}
</script>

<template>
  <div
    class="game-view"
    :style="{
      '--theme-color': config.theme.primaryColor,
      '--theme-secondary': config.theme.secondaryColor,
      background: config.theme.bgGradient,
    }"
  >
    <div class="game-header">
      <button class="back-btn" @click="goBack">
        <ArrowLeft :size="20" />
      </button>
      <h2 class="game-title">{{ config.theme.name }}</h2>
      <WalletChip />
    </div>

    <JackpotMeter />

    <div class="reel-area" style="position: relative;">
      <ReelGrid
        :grid="grid"
        :spinning="spinning"
        :resolve-symbol="engine.resolveSymbol"
        :win-positions="winPositions"
        :theme-color="config.theme.primaryColor"
      />
      <WinBanner
        :amount="lastWin"
        :visible="showWin"
        :theme-color="config.theme.primaryColor"
        @dismiss="showWin = false"
      />
    </div>

    <div v-if="freeSpins > 0" class="free-spins-badge">
      <Zap :size="14" />
      {{ freeSpins }} Free Spin{{ freeSpins !== 1 ? 's' : '' }}
    </div>

    <div class="controls">
      <BetControls
        v-model:bet="bet"
        :min-bet="config.minBet"
        :max-bet="config.maxBet"
        :step="config.betStep"
        :disabled="spinning || isAutoSpinning"
      />

      <div class="spin-buttons">
        <button
          class="btn-spin"
          :disabled="spinning || (!wallet.canAfford(bet) && freeSpins <= 0)"
          @click="doSpin"
        >
          {{ freeSpins > 0 ? 'FREE SPIN' : 'SPIN' }}
        </button>

        <button
          v-if="!isAutoSpinning"
          class="btn auto-btn"
          :disabled="spinning || !wallet.canAfford(bet)"
          @click="startAutoSpin(10)"
        >
          <RotateCcw :size="16" />
          Auto x10
        </button>
        <button v-else class="btn auto-btn stop" @click="stopAutoSpin">
          Stop ({{ autoSpinRemaining }})
        </button>
      </div>
    </div>

    <!-- Bonus slot: each game view provides its bonus component -->
    <slot
      name="bonus"
      :show="showBonus"
      :bet="bet"
      :on-complete="onBonusComplete"
    />
  </div>
</template>

<style scoped>
.game-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  padding-bottom: 80px;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  transition: background 0.15s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.game-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--theme-color);
}

.reel-area {
  flex-shrink: 0;
}

.free-spins-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  color: #a855f7;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  margin-top: auto;
}

.spin-buttons {
  display: flex;
  gap: 8px;
  width: 100%;
}

.btn-spin {
  flex: 1;
}

.auto-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 13px;
  transition: all 0.15s;
}

.auto-btn:hover:not(:disabled) {
  border-color: var(--theme-color);
  color: var(--text-primary);
}

.auto-btn.stop {
  border-color: var(--accent-red);
  color: var(--accent-red);
}

.auto-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
