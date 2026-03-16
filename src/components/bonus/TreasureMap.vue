<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  show: boolean
  bet: number
  onComplete: (winAmount: number) => void
}>()

interface Chest {
  id: number
  multiplier: number
  revealed: boolean
  picked: boolean
}

const chests = ref<Chest[]>([])
const picksRemaining = ref(3)
const totalMultiplier = ref(0)
const phase = ref<'picking' | 'summary'>('picking')
const revealingIndex = ref(-1)

const totalWin = computed(() => {
  return Math.round(totalMultiplier.value * props.bet * 100) / 100
})

function generateMultipliers(): number[] {
  const pool = [1, 1, 2, 2, 3, 4, 5, 7, 10]
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

function reset() {
  const multipliers = generateMultipliers()
  chests.value = multipliers.map((m, i) => ({
    id: i,
    multiplier: m,
    revealed: false,
    picked: false,
  }))
  picksRemaining.value = 3
  totalMultiplier.value = 0
  phase.value = 'picking'
  revealingIndex.value = -1
}

watch(
  () => props.show,
  (val) => {
    if (val) reset()
  },
)

async function pickChest(chest: Chest) {
  if (phase.value !== 'picking') return
  if (chest.revealed) return
  if (picksRemaining.value <= 0) return

  revealingIndex.value = chest.id
  chest.picked = true

  // Animate reveal
  await new Promise((r) => setTimeout(r, 400))
  chest.revealed = true
  revealingIndex.value = -1

  totalMultiplier.value += chest.multiplier
  picksRemaining.value--

  if (picksRemaining.value <= 0) {
    await new Promise((r) => setTimeout(r, 600))
    // Reveal all remaining
    for (const c of chests.value) {
      if (!c.revealed) {
        c.revealed = true
      }
    }
    phase.value = 'summary'
  }
}

function finish() {
  props.onComplete(totalWin.value)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="bonus-fade">
      <div v-if="show" class="bonus-overlay" @click.self="undefined">
        <div class="bonus-container">
          <div class="bonus-header">
            <div class="header-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c8a44e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 class="bonus-title">Pharaoh's Treasure</h2>
            <p class="bonus-subtitle">
              <template v-if="phase === 'picking'">
                Pick {{ picksRemaining }} chest{{ picksRemaining !== 1 ? 's' : '' }} to reveal your prize!
              </template>
              <template v-else>
                All treasures revealed!
              </template>
            </p>
          </div>

          <div class="chest-grid">
            <button
              v-for="chest in chests"
              :key="chest.id"
              class="chest-cell"
              :class="{
                revealed: chest.revealed,
                picked: chest.picked,
                revealing: revealingIndex === chest.id,
                disabled: phase !== 'picking' || chest.revealed,
              }"
              :disabled="phase !== 'picking' || chest.revealed"
              @click="pickChest(chest)"
            >
              <div class="chest-inner">
                <div class="chest-front">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="8" width="20" height="12" rx="2" />
                    <path d="M2 12h20" />
                    <path d="M12 8v4" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    <path d="M6 8V6a6 6 0 0 1 12 0v2" />
                  </svg>
                  <span class="chest-label">?</span>
                </div>
                <div class="chest-back">
                  <div class="prize-coins">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#c8a44e" stroke="#8b6914" stroke-width="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <text x="12" y="16" text-anchor="middle" fill="#1a1408" font-size="10" font-weight="bold" stroke="none">$</text>
                    </svg>
                  </div>
                  <span class="prize-multiplier">{{ chest.multiplier }}x</span>
                </div>
              </div>
            </button>
          </div>

          <div class="bonus-footer">
            <div class="win-tally">
              <span class="tally-label">Total Win</span>
              <span class="tally-amount" :class="{ highlight: phase === 'summary' }">
                ${{ totalWin.toFixed(2) }}
              </span>
            </div>

            <Transition name="collect-fade">
              <button
                v-if="phase === 'summary'"
                class="btn-collect"
                @click="finish"
              >
                Collect Winnings
              </button>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.bonus-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  padding: 16px;
}

.bonus-container {
  width: 100%;
  max-width: 380px;
  background: linear-gradient(180deg, #1a1408 0%, #0d0d14 100%);
  border: 1px solid rgba(200, 164, 78, 0.3);
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 0 60px rgba(200, 164, 78, 0.15), inset 0 1px 0 rgba(200, 164, 78, 0.1);
}

.bonus-header {
  text-align: center;
  margin-bottom: 20px;
}

.header-icon {
  margin-bottom: 8px;
}

.bonus-title {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #c8a44e 0%, #f0d68a 50%, #c8a44e 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

.bonus-subtitle {
  font-size: 13px;
  color: #8888aa;
  margin-top: 4px;
}

.chest-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.chest-cell {
  aspect-ratio: 1;
  perspective: 600px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.chest-cell.disabled:not(.revealed) {
  cursor: default;
}

.chest-cell:not(.disabled):hover .chest-front {
  border-color: rgba(200, 164, 78, 0.6);
  box-shadow: 0 0 20px rgba(200, 164, 78, 0.2);
}

.chest-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chest-cell.revealed .chest-inner {
  transform: rotateY(180deg);
}

.chest-cell.revealing .chest-inner {
  animation: chest-shake 0.4s ease-in-out;
}

.chest-front,
.chest-back {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  border-radius: 12px;
}

.chest-front {
  background: linear-gradient(145deg, #2a2215 0%, #1a1408 100%);
  border: 1px solid rgba(200, 164, 78, 0.2);
  color: #c8a44e;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.chest-label {
  font-size: 16px;
  font-weight: 700;
  color: rgba(200, 164, 78, 0.5);
  margin-top: 2px;
}

.chest-back {
  background: linear-gradient(145deg, #2a2010 0%, #1a1408 100%);
  border: 1px solid rgba(200, 164, 78, 0.4);
  transform: rotateY(180deg);
  gap: 4px;
}

.chest-cell.picked .chest-back {
  border-color: rgba(200, 164, 78, 0.6);
  box-shadow: 0 0 20px rgba(200, 164, 78, 0.25);
}

.prize-coins {
  animation: coin-bounce 0.6s ease-out;
}

.prize-multiplier {
  font-size: 20px;
  font-weight: 800;
  color: #f0d68a;
  text-shadow: 0 0 10px rgba(200, 164, 78, 0.5);
}

.bonus-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.win-tally {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.tally-label {
  font-size: 12px;
  color: #8888aa;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tally-amount {
  font-size: 28px;
  font-weight: 800;
  color: #c8a44e;
  font-family: 'SF Mono', 'Fira Code', monospace;
  transition: all 0.3s;
}

.tally-amount.highlight {
  color: #f0d68a;
  text-shadow: 0 0 20px rgba(200, 164, 78, 0.6);
  transform: scale(1.1);
}

.btn-collect {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #c8a44e 0%, #a07c2a 100%);
  border: none;
  border-radius: 12px;
  color: #1a1408;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-collect:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(200, 164, 78, 0.4);
}

.btn-collect:active {
  transform: translateY(0);
}

/* Animations */
@keyframes chest-shake {
  0%, 100% { transform: translateX(0) rotate(0); }
  20% { transform: translateX(-4px) rotate(-2deg); }
  40% { transform: translateX(4px) rotate(2deg); }
  60% { transform: translateX(-3px) rotate(-1deg); }
  80% { transform: translateX(3px) rotate(1deg); }
}

@keyframes coin-bounce {
  0% { transform: scale(0) translateY(10px); opacity: 0; }
  50% { transform: scale(1.3) translateY(-5px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

/* Transitions */
.bonus-fade-enter-active {
  transition: opacity 0.3s ease;
}
.bonus-fade-enter-active .bonus-container {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
}
.bonus-fade-leave-active {
  transition: opacity 0.25s ease;
}
.bonus-fade-leave-active .bonus-container {
  transition: transform 0.25s ease, opacity 0.25s;
}
.bonus-fade-enter-from {
  opacity: 0;
}
.bonus-fade-enter-from .bonus-container {
  transform: scale(0.8);
  opacity: 0;
}
.bonus-fade-leave-to {
  opacity: 0;
}
.bonus-fade-leave-to .bonus-container {
  transform: scale(0.9);
  opacity: 0;
}

.collect-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.collect-fade-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}
</style>
