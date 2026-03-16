<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  show: boolean
  bet: number
  onComplete: (winAmount: number) => void
}>()

interface Star {
  id: number
  x: number
  y: number
  size: number
  delay: number
  revealed: boolean
  multiplier: number
  bursting: boolean
}

const stars = ref<Star[]>([])
const picks = ref(0)
const totalMultiplier = ref(0)
const phase = ref<'picking' | 'summary'>('picking')

const MAX_PICKS = 3
const TOTAL_STARS = 12

const possibleMultipliers = [1, 1, 1, 2, 2, 2, 3, 3, 4, 5, 6, 8]

const totalWin = computed(() => {
  return Math.round(totalMultiplier.value * props.bet * 100) / 100
})

const picksRemaining = computed(() => MAX_PICKS - picks.value)

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function initStars() {
  const multipliers = shuffle(possibleMultipliers)
  const positions: { x: number; y: number }[] = []

  stars.value = Array.from({ length: TOTAL_STARS }, (_, i) => {
    let x: number, y: number
    let attempts = 0
    do {
      x = 8 + Math.random() * 84
      y = 8 + Math.random() * 78
      attempts++
    } while (
      attempts < 50 &&
      positions.some((p) => Math.hypot(p.x - x, p.y - y) < 12)
    )
    positions.push({ x, y })

    return {
      id: i,
      x,
      y,
      size: 20 + Math.random() * 16,
      delay: Math.random() * 3,
      revealed: false,
      multiplier: multipliers[i],
      bursting: false,
    }
  })

  picks.value = 0
  totalMultiplier.value = 0
  phase.value = 'picking'
}

function pickStar(star: Star) {
  if (star.revealed || phase.value !== 'picking') return
  if (picks.value >= MAX_PICKS) return

  star.bursting = true
  star.revealed = true
  picks.value++
  totalMultiplier.value += star.multiplier

  if (picks.value >= MAX_PICKS) {
    setTimeout(() => {
      phase.value = 'summary'
    }, 800)
  }
}

function closeSummary() {
  props.onComplete(totalWin.value)
}

watch(
  () => props.show,
  (val) => {
    if (val) initStars()
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="bonus-fade">
      <div v-if="show" class="shooting-stars-overlay" @click.self="undefined">
        <div class="bonus-container">
          <div class="bonus-header">
            <h2 class="bonus-title">Shooting Stars</h2>
            <p class="bonus-subtitle">
              <template v-if="phase === 'picking'">
                Pick {{ picksRemaining }} more star{{ picksRemaining !== 1 ? 's' : '' }}!
              </template>
              <template v-else>
                Bonus Complete!
              </template>
            </p>
          </div>

          <div class="star-field">
            <!-- Nebula background glow -->
            <div class="nebula-glow nebula-1" />
            <div class="nebula-glow nebula-2" />

            <div
              v-for="star in stars"
              :key="star.id"
              class="star-item"
              :class="{
                revealed: star.revealed,
                bursting: star.bursting,
                pickable: !star.revealed && phase === 'picking',
              }"
              :style="{
                left: star.x + '%',
                top: star.y + '%',
                '--size': star.size + 'px',
                '--twinkle-delay': star.delay + 's',
              }"
              @click="pickStar(star)"
            >
              <div class="star-shape">
                <svg
                  :width="star.size"
                  :height="star.size"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8L8 14l-6-4.8h7.6z" />
                </svg>
              </div>

              <!-- Burst particles -->
              <template v-if="star.bursting">
                <div
                  v-for="p in 8"
                  :key="'p' + p"
                  class="burst-particle"
                  :style="{
                    '--angle': (p * 45) + 'deg',
                    '--dist': (20 + Math.random() * 30) + 'px',
                    '--particle-delay': (Math.random() * 0.1) + 's',
                  }"
                />
              </template>

              <!-- Multiplier reveal -->
              <Transition name="reveal-pop">
                <div v-if="star.revealed" class="multiplier-badge">
                  {{ star.multiplier }}x
                </div>
              </Transition>
            </div>
          </div>

          <div class="bonus-footer">
            <div class="running-total">
              <span class="total-label">Total</span>
              <span class="total-value">${{ totalWin.toFixed(2) }}</span>
            </div>

            <Transition name="summary-slide">
              <div v-if="phase === 'summary'" class="summary-panel">
                <div class="summary-multiplier">
                  {{ totalMultiplier }}x multiplier
                </div>
                <div class="summary-win">
                  ${{ totalWin.toFixed(2) }}
                </div>
                <button class="btn-collect" @click="closeSummary">
                  COLLECT
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.shooting-stars-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 5, 20, 0.92);
  backdrop-filter: blur(8px);
}

.bonus-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.bonus-header {
  text-align: center;
}

.bonus-title {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #a855f7, #ec4899, #a855f7);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: title-shimmer 3s linear infinite;
}

@keyframes title-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.bonus-subtitle {
  font-size: 14px;
  color: #c4b5fd;
  margin-top: 4px;
  font-weight: 600;
}

.star-field {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  background: radial-gradient(ellipse at 40% 30%, rgba(88, 28, 135, 0.3) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 60%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
    linear-gradient(180deg, #0c0618 0%, #150a28 50%, #0c0618 100%);
  border: 1px solid rgba(168, 85, 247, 0.2);
  overflow: hidden;
}

.nebula-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;
  animation: nebula-drift 8s ease-in-out infinite alternate;
}

.nebula-1 {
  width: 50%;
  height: 50%;
  top: 10%;
  left: 15%;
  background: rgba(168, 85, 247, 0.12);
}

.nebula-2 {
  width: 40%;
  height: 40%;
  bottom: 15%;
  right: 10%;
  background: rgba(236, 72, 153, 0.1);
  animation-delay: -4s;
}

@keyframes nebula-drift {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(10px, -10px) scale(1.1); }
}

.star-item {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: default;
  transition: filter 0.3s;
}

.star-item.pickable {
  cursor: pointer;
}

.star-item.pickable:hover .star-shape {
  transform: scale(1.3);
  filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.8));
}

.star-shape {
  color: #e9d5ff;
  animation: twinkle 2.5s ease-in-out infinite;
  animation-delay: var(--twinkle-delay);
  transition: transform 0.2s, filter 0.2s;
  filter: drop-shadow(0 0 6px rgba(168, 85, 247, 0.5));
}

.star-item.revealed .star-shape {
  animation: none;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease-out;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.5;
    transform: scale(0.8);
    filter: drop-shadow(0 0 4px rgba(168, 85, 247, 0.3));
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
    filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.7));
  }
}

/* Burst particles */
.burst-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c084fc;
  box-shadow: 0 0 6px #a855f7;
  animation: burst 0.6s ease-out forwards;
  animation-delay: var(--particle-delay);
}

@keyframes burst {
  0% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(-1 * var(--dist)));
    opacity: 0;
  }
}

/* Multiplier badge */
.multiplier-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: 800;
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.6), 0 1px 2px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  pointer-events: none;
}

.reveal-pop-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.reveal-pop-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.2);
}

/* Footer */
.bonus-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.running-total {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(168, 85, 247, 0.12);
  border: 1px solid rgba(168, 85, 247, 0.25);
  border-radius: 10px;
}

.total-label {
  font-size: 13px;
  color: #a78bfa;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.total-value {
  font-size: 20px;
  font-weight: 800;
  color: #fbbf24;
  font-family: var(--font-mono);
}

/* Summary panel */
.summary-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 16px;
  width: 100%;
}

.summary-multiplier {
  font-size: 16px;
  color: #c4b5fd;
  font-weight: 600;
}

.summary-win {
  font-size: 32px;
  font-weight: 900;
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
  font-family: var(--font-mono);
}

.btn-collect {
  margin-top: 4px;
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 10px;
  background: linear-gradient(135deg, #a855f7, #7c3aed);
  color: #fff;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
  transition: all 0.2s;
}

.btn-collect:hover {
  filter: brightness(1.15);
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
  transform: translateY(-1px);
}

.btn-collect:active {
  transform: translateY(0);
}

/* Transitions */
.bonus-fade-enter-active {
  transition: opacity 0.3s ease;
}

.bonus-fade-leave-active {
  transition: opacity 0.2s ease;
}

.bonus-fade-enter-from,
.bonus-fade-leave-to {
  opacity: 0;
}

.summary-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.summary-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>
