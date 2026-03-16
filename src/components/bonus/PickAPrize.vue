<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  show: boolean
  bet: number
  onComplete: (winAmount: number) => void
}>()

interface ClamShell {
  id: number
  opened: boolean
  value: number // multiplier, 0 = END
  x: number
  y: number
  rotation: number
  delay: number
}

const shells = ref<ClamShell[]>([])
const totalWin = ref(0)
const gameOver = ref(false)
const revealingEnd = ref(false)

const formattedTotal = computed(() => totalWin.value.toFixed(2))

function initGame() {
  totalWin.value = 0
  gameOver.value = false
  revealingEnd.value = false

  const multipliers = [1, 1, 2, 2, 3, 3, 5]
  // Shuffle multipliers
  for (let i = multipliers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[multipliers[i], multipliers[j]] = [multipliers[j], multipliers[i]]
  }

  // Place 3 END shells at random positions among 10 total
  const endIndices = new Set<number>()
  while (endIndices.size < 3) {
    endIndices.add(Math.floor(Math.random() * 10))
  }

  const positions = generateScatteredPositions(10)

  let mIdx = 0
  shells.value = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    opened: false,
    value: endIndices.has(i) ? 0 : multipliers[mIdx++],
    x: positions[i].x,
    y: positions[i].y,
    rotation: Math.random() * 20 - 10,
    delay: i * 0.05,
  }))
}

function generateScatteredPositions(count: number) {
  const positions: { x: number; y: number }[] = []
  const cols = 4
  const rows = 3
  for (let i = 0; i < count; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const baseX = (col / cols) * 100 + 100 / cols / 2
    const baseY = (row / rows) * 100 + 100 / rows / 2
    positions.push({
      x: baseX + (Math.random() * 8 - 4),
      y: baseY + (Math.random() * 6 - 3),
    })
  }
  return positions
}

function pickShell(shell: ClamShell) {
  if (shell.opened || gameOver.value) return

  shell.opened = true

  if (shell.value === 0) {
    // END shell
    revealingEnd.value = true
    gameOver.value = true
    setTimeout(() => {
      props.onComplete(totalWin.value)
    }, 2000)
  } else {
    const winAmount = Math.round(shell.value * props.bet * 100) / 100
    totalWin.value = Math.round((totalWin.value + winAmount) * 100) / 100
  }
}

function closeGame() {
  props.onComplete(totalWin.value)
}

watch(
  () => props.show,
  (val) => {
    if (val) initGame()
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="bonus-fade">
      <div v-if="show" class="bonus-overlay" @click.self="undefined">
        <div class="bonus-container">
          <!-- Bubble particles -->
          <div
            v-for="n in 20"
            :key="'bubble-' + n"
            class="bonus-bubble"
            :style="{
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 6 + 's',
              animationDuration: 4 + Math.random() * 4 + 's',
              width: 4 + Math.random() * 10 + 'px',
              height: 4 + Math.random() * 10 + 'px',
            }"
          />

          <div class="bonus-header">
            <h2 class="bonus-title">Deep Ocean Bonus</h2>
            <p class="bonus-subtitle">Pick clam shells to reveal prizes!</p>
          </div>

          <div class="win-counter">
            <span class="win-label">Total Won</span>
            <span class="win-amount">${{ formattedTotal }}</span>
          </div>

          <div class="shell-grid">
            <button
              v-for="shell in shells"
              :key="shell.id"
              class="clam-shell"
              :class="{
                opened: shell.opened,
                'is-end': shell.opened && shell.value === 0,
                'is-prize': shell.opened && shell.value > 0,
              }"
              :style="{
                left: shell.x + '%',
                top: shell.y + '%',
                '--rot': shell.rotation + 'deg',
                animationDelay: shell.delay + 's',
              }"
              :disabled="shell.opened || gameOver"
              @click="pickShell(shell)"
            >
              <div class="clam-closed">
                <svg viewBox="0 0 60 40" class="clam-svg">
                  <ellipse cx="30" cy="28" rx="28" ry="12" fill="#1e6a8a" stroke="#3b9ec4" stroke-width="1.5" />
                  <ellipse cx="30" cy="26" rx="26" ry="11" fill="#2588a8" />
                  <ellipse cx="30" cy="18" rx="26" ry="14" fill="#1e7a9a" stroke="#3bb0d4" stroke-width="1.5" />
                  <ellipse cx="30" cy="20" rx="24" ry="12" fill="#2898b8" />
                  <path d="M 6 20 Q 18 8 30 20 Q 42 8 54 20" fill="none" stroke="#3bc0e0" stroke-width="0.8" opacity="0.5" />
                  <ellipse cx="30" cy="22" rx="4" ry="2" fill="#5cd0f0" opacity="0.3" />
                </svg>
                <span class="clam-hint">?</span>
              </div>
              <div class="clam-open-content">
                <template v-if="shell.value > 0">
                  <span class="prize-pearl">&#x1FADB;</span>
                  <span class="prize-multi">{{ shell.value }}x</span>
                  <span class="prize-amount">${{ (shell.value * bet).toFixed(2) }}</span>
                </template>
                <template v-else>
                  <span class="end-x">&#x2716;</span>
                  <span class="end-text">END</span>
                </template>
              </div>
            </button>
          </div>

          <div v-if="gameOver" class="bonus-footer">
            <p class="final-text">
              {{ totalWin > 0 ? 'Great finds!' : 'Better luck next time!' }}
            </p>
            <button class="btn-collect" @click="closeGame">
              {{ totalWin > 0 ? `Collect $${formattedTotal}` : 'Continue' }}
            </button>
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
  background: rgba(0, 8, 20, 0.92);
  backdrop-filter: blur(8px);
}

.bonus-container {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.bonus-bubble {
  position: absolute;
  bottom: -20px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(59, 200, 246, 0.4), rgba(59, 130, 246, 0.1));
  animation: particle-bubble linear infinite;
  pointer-events: none;
}

.bonus-header {
  text-align: center;
}

.bonus-title {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #06b6d4, #22d3ee);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
}

.bonus-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.win-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 20px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: var(--radius-md);
}

.win-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.win-amount {
  font-size: 22px;
  font-weight: 800;
  color: var(--accent-green);
  font-family: var(--font-mono);
}

.shell-grid {
  position: relative;
  width: 100%;
  height: 280px;
}

.clam-shell {
  position: absolute;
  width: 22%;
  aspect-ratio: 1.2;
  transform: translate(-50%, -50%) rotate(var(--rot));
  cursor: pointer;
  transition: transform 0.2s ease;
  perspective: 600px;
}

.clam-shell:hover:not(:disabled) {
  transform: translate(-50%, -50%) rotate(var(--rot)) scale(1.12);
}

.clam-shell:disabled {
  cursor: default;
}

.clam-closed {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s ease, opacity 0.4s ease;
}

.clam-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 6px rgba(59, 130, 246, 0.3));
}

.clam-hint {
  position: absolute;
  font-size: 16px;
  font-weight: 700;
  color: rgba(59, 200, 246, 0.6);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.opened .clam-closed {
  transform: rotateX(90deg) scale(0.5);
  opacity: 0;
}

.clam-open-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.3);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: 0.2s;
}

.opened .clam-open-content {
  opacity: 1;
  transform: scale(1);
}

.prize-pearl {
  font-size: 22px;
  line-height: 1;
}

.prize-multi {
  font-size: 16px;
  font-weight: 800;
  color: #22d3ee;
  text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
}

.prize-amount {
  font-size: 11px;
  font-weight: 700;
  color: var(--accent-green);
  font-family: var(--font-mono);
}

.end-x {
  font-size: 26px;
  color: var(--accent-red);
}

.end-text {
  font-size: 13px;
  font-weight: 800;
  color: var(--accent-red);
  letter-spacing: 2px;
}

.is-end .clam-open-content {
  animation: end-shake 0.5s ease-in-out;
}

.is-prize .clam-open-content {
  animation: prize-pop 0.5s ease;
}

@keyframes end-shake {
  0%, 100% { transform: scale(1) rotate(0deg); }
  20% { transform: scale(1.1) rotate(-5deg); }
  40% { transform: scale(1.1) rotate(5deg); }
  60% { transform: scale(1.1) rotate(-3deg); }
  80% { transform: scale(1.05) rotate(2deg); }
}

@keyframes prize-pop {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

.bonus-footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: prize-pop 0.4s ease;
}

.final-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.btn-collect {
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: #fff;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  transition: all 0.2s ease;
}

.btn-collect:hover {
  filter: brightness(1.15);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
}

.bonus-fade-enter-active {
  transition: opacity 0.3s ease;
}

.bonus-fade-leave-active {
  transition: opacity 0.5s ease;
}

.bonus-fade-enter-from,
.bonus-fade-leave-to {
  opacity: 0;
}
</style>
