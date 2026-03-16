<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  show: boolean
  bet: number
  onComplete: (winAmount: number) => void
}>()

const segments = [
  { multiplier: 2, label: '2x', color: '#b45309' },
  { multiplier: 5, label: '5x', color: '#ea580c' },
  { multiplier: 3, label: '3x', color: '#92400e' },
  { multiplier: 10, label: '10x', color: '#dc2626' },
  { multiplier: 2, label: '2x', color: '#b45309' },
  { multiplier: 15, label: '15x', color: '#c2410c' },
  { multiplier: 8, label: '8x', color: '#9a3412' },
  { multiplier: 50, label: '50x', color: '#fbbf24' },
]

const segmentAngle = 360 / segments.length
const isSpinning = ref(false)
const wheelRotation = ref(0)
const resultReady = ref(false)
const winAmount = ref(0)
const winMultiplier = ref(0)

// Weighted random: higher multipliers are rarer
function pickWinnerIndex(): number {
  const weights = [25, 12, 20, 5, 25, 3, 8, 2]
  const total = weights.reduce((a, b) => a + b, 0)
  let roll = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return i
  }
  return 0
}

function spin() {
  if (isSpinning.value) return

  isSpinning.value = true
  resultReady.value = false

  const winnerIndex = pickWinnerIndex()
  const seg = segments[winnerIndex]

  // Calculate rotation: we need the winning segment to land under the top pointer.
  // Segment i spans from (i * segmentAngle) to ((i+1) * segmentAngle).
  // The center of segment i is at (i + 0.5) * segmentAngle.
  // The pointer is at the top (0 deg / 360 deg).
  // We rotate the wheel so that the center of the winning segment aligns with 0 deg (top).
  // That means we rotate by -(center angle) + full rotations.
  const segmentCenter = (winnerIndex + 0.5) * segmentAngle
  const fullRotations = 360 * (5 + Math.floor(Math.random() * 3))
  // Add slight randomness within the segment
  const jitter = (Math.random() - 0.5) * segmentAngle * 0.6
  const finalRotation = fullRotations + (360 - segmentCenter) + jitter

  wheelRotation.value = finalRotation

  winMultiplier.value = seg.multiplier
  winAmount.value = Math.round(props.bet * seg.multiplier * 100) / 100

  setTimeout(() => {
    isSpinning.value = false
    resultReady.value = true
  }, 3500)
}

function collect() {
  resultReady.value = false
  wheelRotation.value = 0
  props.onComplete(winAmount.value)
}

// Reset state when shown
watch(() => props.show, (val) => {
  if (val) {
    wheelRotation.value = 0
    isSpinning.value = false
    resultReady.value = false
    winAmount.value = 0
    winMultiplier.value = 0
  }
})

const wheelStyle = computed(() => ({
  transform: `rotate(${wheelRotation.value}deg)`,
  transition: wheelRotation.value === 0
    ? 'none'
    : 'transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
}))
</script>

<template>
  <Teleport to="body">
    <Transition name="bonus-fade">
      <div v-if="show" class="wheel-overlay" @click.self>
        <div class="wheel-container">
          <h2 class="wheel-title">Wagon Wheel Bonus!</h2>

          <div class="wheel-wrapper">
            <div class="wheel-pointer"></div>
            <div class="wheel" :style="wheelStyle">
              <div
                v-for="(seg, i) in segments"
                :key="i"
                class="wheel-segment"
                :style="{
                  '--seg-rotation': `${i * segmentAngle}deg`,
                  '--seg-angle': `${segmentAngle}deg`,
                  '--seg-color': seg.color,
                }"
              >
                <span class="segment-label">{{ seg.label }}</span>
              </div>
            </div>
          </div>

          <Transition name="result-pop">
            <div v-if="resultReady" class="wheel-result">
              <div class="result-multiplier">{{ winMultiplier }}x</div>
              <div class="result-amount">${{ winAmount.toFixed(2) }}</div>
            </div>
          </Transition>

          <button
            v-if="!isSpinning && !resultReady"
            class="btn-spin-wheel"
            @click="spin"
          >
            SPIN THE WHEEL
          </button>

          <button
            v-if="resultReady"
            class="btn-collect"
            @click="collect"
          >
            COLLECT ${{ winAmount.toFixed(2) }}
          </button>

          <div v-if="isSpinning" class="spinning-text">Spinning...</div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.wheel-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
}

.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 24px;
}

.wheel-title {
  font-size: 24px;
  font-weight: 800;
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.wheel-wrapper {
  position: relative;
  width: 280px;
  height: 280px;
}

.wheel-pointer {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-top: 24px solid #fbbf24;
  z-index: 10;
  filter: drop-shadow(0 2px 6px rgba(251, 191, 36, 0.6));
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 0 0 6px #78350f,
    0 0 0 10px #451a03,
    0 0 30px rgba(234, 88, 12, 0.4);
}

.wheel-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 50%, 50% 0%, 100% 0%);
  transform: rotate(var(--seg-rotation));
  transform-origin: 50% 50%;
  background: var(--seg-color);
  border-right: 1px solid rgba(0, 0, 0, 0.3);
}

/*
 * Each segment covers segmentAngle (45deg).
 * clip-path polygon(50% 50%, 50% 0%, 100% 0%) gives a 90deg wedge
 * from 0deg (up) to 90deg (right). We use a skew to narrow it to 45deg.
 */
.wheel-segment {
  clip-path: none;
  overflow: hidden;
}

.wheel-segment::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--seg-color);
  transform-origin: 50% 100%;
}

/* Use conic approach instead for cleaner segments */
.wheel {
  background: conic-gradient(
    #b45309 0deg 45deg,
    #ea580c 45deg 90deg,
    #92400e 90deg 135deg,
    #dc2626 135deg 180deg,
    #b45309 180deg 225deg,
    #c2410c 225deg 270deg,
    #9a3412 270deg 315deg,
    #fbbf24 315deg 360deg
  );
}

/* Hide the segment divs' backgrounds, use them only for labels */
.wheel-segment {
  background: transparent;
  clip-path: none;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  pointer-events: none;
}

.segment-label {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: rotate(calc(var(--seg-rotation) * -1 + var(--seg-rotation) + 22.5deg)) translateX(-50%);
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
  white-space: nowrap;
}

/* Better label positioning: place each label at center of its segment, pointing outward */
.wheel-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.segment-label {
  position: absolute;
  top: 14%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  text-shadow:
    0 1px 3px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(0, 0, 0, 0.4);
}

/* Rotate each segment label container to point toward its segment center */
.wheel-segment {
  transform: rotate(calc(var(--seg-rotation) + var(--seg-angle) / 2));
  transform-origin: 50% 50%;
}

/* Center hub */
.wheel::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #fbbf24, #b45309);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 5;
}

.wheel-result {
  text-align: center;
}

.result-multiplier {
  font-size: 36px;
  font-weight: 900;
  color: #fbbf24;
  text-shadow: 0 0 30px rgba(251, 191, 36, 0.6);
}

.result-amount {
  font-size: 28px;
  font-weight: 700;
  color: #22c55e;
  text-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
}

.btn-spin-wheel {
  padding: 14px 40px;
  background: linear-gradient(135deg, #ea580c, #dc2626);
  border: 2px solid #fbbf24;
  border-radius: 12px;
  color: #fff;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 20px rgba(234, 88, 12, 0.4);
}

.btn-spin-wheel:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 30px rgba(234, 88, 12, 0.6);
}

.btn-spin-wheel:active {
  transform: scale(0.97);
}

.btn-collect {
  padding: 14px 40px;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  border: 2px solid #86efac;
  border-radius: 12px;
  color: #fff;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
}

.btn-collect:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 30px rgba(34, 197, 94, 0.6);
}

.spinning-text {
  font-size: 16px;
  font-weight: 600;
  color: #d6d3d1;
  animation: pulse-text 1s ease-in-out infinite;
}

@keyframes pulse-text {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
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

.result-pop-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-pop-leave-active {
  transition: all 0.2s ease;
}

.result-pop-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.result-pop-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
