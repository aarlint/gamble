<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  show: boolean
  bet: number
  onComplete: (winAmount: number) => void
}>()

const segments = [
  { multiplier: 2, label: '2x', color: '#b45309' },
  { multiplier: 3, label: '3x', color: '#ea580c' },
  { multiplier: 2, label: '2x', color: '#92400e' },
  { multiplier: 5, label: '5x', color: '#dc2626' },
  { multiplier: 2, label: '2x', color: '#b45309' },
  { multiplier: 3, label: '3x', color: '#c2410c' },
  { multiplier: 5, label: '5x', color: '#9a3412' },
  { multiplier: 10, label: '10x', color: '#fbbf24' },
]

const segmentAngle = 360 / segments.length
const isSpinning = ref(false)
const wheelRotation = ref(0)
const resultReady = ref(false)
const winAmount = ref(0)
const winMultiplier = ref(0)

// Weighted random: higher multipliers are rarer
function pickWinnerIndex(): number {
  const weights = [30, 18, 28, 8, 28, 18, 8, 2]
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

// Rivet positions around the outer rim (one per segment boundary + midpoints)
const rivetPositions = computed(() => {
  const rivets: { x: number; y: number }[] = []
  const count = 16
  const radius = 136 // just inside the wheel edge
  for (let i = 0; i < count; i++) {
    const angle = (i * 360 / count - 90) * (Math.PI / 180)
    rivets.push({
      x: 140 + radius * Math.cos(angle),
      y: 140 + radius * Math.sin(angle),
    })
  }
  return rivets
})
</script>

<template>
  <Teleport to="body">
    <Transition name="bonus-fade">
      <div v-if="show" class="wheel-overlay" @click.self>
        <!-- Ambient western decorations -->
        <div class="ambient-decor decor-star decor-top-left">&#9733;</div>
        <div class="ambient-decor decor-horseshoe decor-top-right">&#x1F3B0;</div>
        <div class="ambient-decor decor-star decor-bottom-left">&#9733;</div>
        <div class="ambient-decor decor-horseshoe decor-bottom-right">&#x1F3B0;</div>

        <div class="wheel-container">
          <h2 class="wheel-title">
            <span class="title-star">&#9733;</span>
            Wagon Wheel Bonus!
            <span class="title-star">&#9733;</span>
          </h2>

          <!-- Dust particles (visible during spin) -->
          <div class="dust-container" :class="{ active: isSpinning }">
            <div v-for="n in 12" :key="n" class="dust-particle" :style="{ '--dust-i': n }"></div>
          </div>

          <div class="wheel-wrapper">
            <!-- Outer wooden frame -->
            <div class="wheel-frame-outer">
              <!-- Rope border -->
              <div class="rope-border"></div>
              <div class="wheel-frame-inner">
                <!-- The pointer -->
                <div class="wheel-pointer">
                  <div class="pointer-body">
                    <div class="pointer-rivet"></div>
                  </div>
                </div>

                <!-- The wheel -->
                <div class="wheel" :style="wheelStyle" :class="{ 'result-glow': resultReady }">
                  <!-- Segment divider lines -->
                  <div
                    v-for="(_, i) in segments"
                    :key="'div-' + i"
                    class="segment-divider"
                    :style="{ transform: `rotate(${i * segmentAngle}deg)` }"
                  ></div>

                  <!-- Segment labels -->
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
                    <span class="segment-label">
                      <span class="label-bg">{{ seg.label }}</span>
                    </span>
                  </div>

                  <!-- Decorative rivets around the rim -->
                  <div
                    v-for="(pos, i) in rivetPositions"
                    :key="'rivet-' + i"
                    class="wheel-rivet"
                    :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
                  ></div>

                  <!-- Center hub -->
                  <div class="center-hub">
                    <div class="hub-inner">
                      <div class="hub-bolt"></div>
                    </div>
                  </div>
                </div>
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
            <span class="btn-text">SPIN THE WHEEL</span>
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
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(6px);
  overflow: hidden;
}

.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 24px;
  position: relative;
}

/* ─── Title ─── */
.wheel-title {
  font-size: 26px;
  font-weight: 800;
  color: #fbbf24;
  text-shadow:
    0 0 20px rgba(251, 191, 36, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.8);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-family: 'Georgia', serif;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-star {
  color: #c8a44e;
  font-size: 20px;
  text-shadow: 0 0 10px rgba(200, 164, 78, 0.6);
  animation: twinkle 2s ease-in-out infinite;
}

.title-star:last-child {
  animation-delay: 1s;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.6; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* ─── Ambient Decorations ─── */
.ambient-decor {
  position: fixed;
  font-size: 40px;
  opacity: 0.12;
  pointer-events: none;
  animation: float-decor 6s ease-in-out infinite;
}

.decor-star {
  color: #c8a44e;
}

.decor-horseshoe {
  font-size: 36px;
  color: #78350f;
}

.decor-top-left { top: 10%; left: 8%; animation-delay: 0s; }
.decor-top-right { top: 8%; right: 8%; animation-delay: 1.5s; }
.decor-bottom-left { bottom: 10%; left: 10%; animation-delay: 3s; }
.decor-bottom-right { bottom: 8%; right: 10%; animation-delay: 4.5s; }

@keyframes float-decor {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(5deg); }
}

/* ─── Dust Particles ─── */
.dust-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 320px;
  height: 320px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 20;
}

.dust-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(200, 164, 78, 0.6);
  opacity: 0;
  top: 50%;
  left: 50%;
}

.dust-container.active .dust-particle {
  animation: dust-fly 1.8s ease-out infinite;
  animation-delay: calc(var(--dust-i) * 0.15s);
}

@keyframes dust-fly {
  0% {
    opacity: 0.8;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform:
      translate(
        calc(cos(calc(var(--dust-i) * 30deg)) * 180px),
        calc(sin(calc(var(--dust-i) * 30deg)) * 180px)
      )
      scale(0.3);
  }
}

/* Fallback dust with explicit positioning per particle */
.dust-container.active .dust-particle:nth-child(1) { animation-name: dust-1; }
.dust-container.active .dust-particle:nth-child(2) { animation-name: dust-2; }
.dust-container.active .dust-particle:nth-child(3) { animation-name: dust-3; }
.dust-container.active .dust-particle:nth-child(4) { animation-name: dust-4; }
.dust-container.active .dust-particle:nth-child(5) { animation-name: dust-5; }
.dust-container.active .dust-particle:nth-child(6) { animation-name: dust-6; }
.dust-container.active .dust-particle:nth-child(7) { animation-name: dust-7; }
.dust-container.active .dust-particle:nth-child(8) { animation-name: dust-8; }
.dust-container.active .dust-particle:nth-child(9) { animation-name: dust-9; }
.dust-container.active .dust-particle:nth-child(10) { animation-name: dust-10; }
.dust-container.active .dust-particle:nth-child(11) { animation-name: dust-11; }
.dust-container.active .dust-particle:nth-child(12) { animation-name: dust-12; }

@keyframes dust-1 { 0% { opacity: 0.7; transform: translate(0,0); } 100% { opacity: 0; transform: translate(160px, -40px); } }
@keyframes dust-2 { 0% { opacity: 0.6; transform: translate(0,0); } 100% { opacity: 0; transform: translate(120px, -120px); } }
@keyframes dust-3 { 0% { opacity: 0.8; transform: translate(0,0); } 100% { opacity: 0; transform: translate(30px, -160px); } }
@keyframes dust-4 { 0% { opacity: 0.5; transform: translate(0,0); } 100% { opacity: 0; transform: translate(-100px, -130px); } }
@keyframes dust-5 { 0% { opacity: 0.7; transform: translate(0,0); } 100% { opacity: 0; transform: translate(-155px, -20px); } }
@keyframes dust-6 { 0% { opacity: 0.6; transform: translate(0,0); } 100% { opacity: 0; transform: translate(-130px, 100px); } }
@keyframes dust-7 { 0% { opacity: 0.8; transform: translate(0,0); } 100% { opacity: 0; transform: translate(-40px, 155px); } }
@keyframes dust-8 { 0% { opacity: 0.5; transform: translate(0,0); } 100% { opacity: 0; transform: translate(90px, 130px); } }
@keyframes dust-9 { 0% { opacity: 0.7; transform: translate(0,0); } 100% { opacity: 0; transform: translate(150px, 60px); } }
@keyframes dust-10 { 0% { opacity: 0.6; transform: translate(0,0); } 100% { opacity: 0; transform: translate(-70px, -150px); } }
@keyframes dust-11 { 0% { opacity: 0.5; transform: translate(0,0); } 100% { opacity: 0; transform: translate(140px, -90px); } }
@keyframes dust-12 { 0% { opacity: 0.8; transform: translate(0,0); } 100% { opacity: 0; transform: translate(-150px, 70px); } }

/* ─── Wheel Wrapper & Frame ─── */
.wheel-wrapper {
  position: relative;
  width: 320px;
  height: 320px;
}

/* Outer wooden frame */
.wheel-frame-outer {
  position: absolute;
  inset: -24px;
  border-radius: 50%;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(160, 120, 60, 0.4), transparent 60%),
    linear-gradient(
      160deg,
      #5c3a1e 0%,
      #7a4f2a 15%,
      #4a2e14 30%,
      #6b421f 45%,
      #5c3a1e 55%,
      #7a4f2a 70%,
      #4a2e14 85%,
      #5c3a1e 100%
    );
  box-shadow:
    inset 0 2px 8px rgba(255, 200, 100, 0.15),
    inset 0 -4px 12px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(92, 58, 30, 0.3);
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Rope border around the frame */
.rope-border {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  border: 3px solid transparent;
  background:
    repeating-conic-gradient(
      from 0deg,
      #a0783c 0deg 4deg,
      #c8a44e 4deg 8deg,
      #8b6530 8deg 12deg,
      #c8a44e 12deg 16deg
    );
  mask: radial-gradient(circle, transparent calc(100% - 6px), black calc(100% - 6px), black calc(100% - 2px), transparent calc(100% - 2px));
  -webkit-mask: radial-gradient(circle, transparent calc(100% - 6px), black calc(100% - 6px), black calc(100% - 2px), transparent calc(100% - 2px));
  opacity: 0.7;
  pointer-events: none;
}

.wheel-frame-inner {
  position: relative;
  width: 280px;
  height: 280px;
}

/* ─── Pointer ─── */
.wheel-pointer {
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7));
}

.pointer-body {
  width: 36px;
  height: 40px;
  background:
    linear-gradient(
      170deg,
      #a0783c 0%,
      #c8a44e 25%,
      #7a5422 50%,
      #a0783c 75%,
      #6b421f 100%
    );
  clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
  position: relative;
  border: none;
}

.pointer-body::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 30px;
  background: linear-gradient(
    170deg,
    #c8a44e 0%,
    #8b6530 40%,
    #a0783c 100%
  );
  clip-path: polygon(50% 100%, 5% 0%, 95% 0%);
  opacity: 0.6;
}

.pointer-rivet {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #e8d5a0, #8b6530 60%, #5c3a1e);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* ─── The Wheel ─── */
.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
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
  box-shadow:
    inset 0 0 30px rgba(0, 0, 0, 0.5),
    inset 0 0 60px rgba(0, 0, 0, 0.2),
    0 0 0 3px #5c3a1e,
    0 0 0 5px rgba(200, 164, 78, 0.3);
}

/* Inner shadow overlay on wheel for depth */
.wheel::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    transparent 30%,
    rgba(0, 0, 0, 0.15) 60%,
    rgba(0, 0, 0, 0.4) 100%
  );
  z-index: 4;
  pointer-events: none;
}

/* Result landing glow */
.wheel.result-glow {
  animation: landing-glow 1.5s ease-in-out infinite alternate;
}

@keyframes landing-glow {
  0% {
    box-shadow:
      inset 0 0 30px rgba(0, 0, 0, 0.5),
      inset 0 0 60px rgba(0, 0, 0, 0.2),
      0 0 0 3px #5c3a1e,
      0 0 0 5px rgba(200, 164, 78, 0.3),
      0 0 30px rgba(251, 191, 36, 0.3);
  }
  100% {
    box-shadow:
      inset 0 0 30px rgba(0, 0, 0, 0.5),
      inset 0 0 60px rgba(0, 0, 0, 0.2),
      0 0 0 3px #5c3a1e,
      0 0 0 5px rgba(251, 191, 36, 0.6),
      0 0 60px rgba(251, 191, 36, 0.5),
      0 0 100px rgba(251, 191, 36, 0.2);
  }
}

/* ─── Segment Dividers ─── */
.segment-divider {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 50%;
  transform-origin: 50% 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 40%,
    rgba(0, 0, 0, 0.1) 100%
  );
  z-index: 2;
  pointer-events: none;
}

.segment-divider::after {
  content: '';
  position: absolute;
  top: 0;
  left: 2px;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 200, 100, 0.2) 0%,
    rgba(255, 200, 100, 0.05) 60%,
    transparent 100%
  );
}

/* ─── Decorative Rivets ─── */
.wheel-rivet {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle at 35% 35%,
    #e8d5a0,
    #b8923a 40%,
    #8b6530 70%,
    #5c3a1e
  );
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.6),
    inset 0 -1px 1px rgba(0, 0, 0, 0.3),
    inset 0 1px 1px rgba(255, 200, 100, 0.3);
  z-index: 3;
  pointer-events: none;
}

/* ─── Segment Labels ─── */
.wheel-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background: transparent;
  transform: rotate(calc(var(--seg-rotation) + var(--seg-angle) / 2));
  transform-origin: 50% 50%;
}

.segment-label {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.label-bg {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  text-shadow:
    0 1px 3px rgba(0, 0, 0, 0.9),
    0 0 10px rgba(255, 255, 255, 0.15);
  letter-spacing: 1px;
  backdrop-filter: blur(2px);
}

/* ─── Center Hub (Brass/Bronze) ─── */
.center-hub {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background:
    radial-gradient(
      circle at 40% 35%,
      #e8d5a0 0%,
      #c8a44e 20%,
      #a0783c 45%,
      #7a5422 70%,
      #5c3a1e 100%
    );
  box-shadow:
    0 0 12px rgba(0, 0, 0, 0.6),
    0 2px 6px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 220, 140, 0.4),
    inset 0 -2px 4px rgba(0, 0, 0, 0.4);
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hub-inner {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background:
    radial-gradient(
      circle at 38% 32%,
      #d4b978 0%,
      #b8923a 30%,
      #8b6530 65%,
      #6b421f 100%
    );
  box-shadow:
    inset 0 1px 3px rgba(255, 220, 140, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(200, 164, 78, 0.3);
}

.hub-bolt {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background:
    radial-gradient(
      circle at 35% 30%,
      #f0e0b8 0%,
      #c8a44e 30%,
      #8b6530 70%,
      #5c3a1e 100%
    );
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(255, 240, 200, 0.4);
  position: relative;
}

/* Cross/slot on the bolt */
.hub-bolt::before,
.hub-bolt::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 1px;
}

.hub-bolt::before {
  width: 8px;
  height: 2px;
  transform: translate(-50%, -50%);
}

.hub-bolt::after {
  width: 2px;
  height: 8px;
  transform: translate(-50%, -50%);
}

/* ─── Result Display ─── */
.wheel-result {
  text-align: center;
}

.result-multiplier {
  font-size: 40px;
  font-weight: 900;
  color: #fbbf24;
  text-shadow:
    0 0 30px rgba(251, 191, 36, 0.6),
    0 0 60px rgba(251, 191, 36, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.8);
  animation: result-pulse 1.2s ease-in-out infinite alternate;
}

@keyframes result-pulse {
  0% { transform: scale(1); text-shadow: 0 0 30px rgba(251, 191, 36, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8); }
  100% { transform: scale(1.08); text-shadow: 0 0 50px rgba(251, 191, 36, 0.8), 0 0 80px rgba(251, 191, 36, 0.4), 0 2px 4px rgba(0, 0, 0, 0.8); }
}

.result-amount {
  font-size: 30px;
  font-weight: 700;
  color: #22c55e;
  text-shadow:
    0 0 20px rgba(34, 197, 94, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.6);
}

/* ─── Buttons ─── */
.btn-spin-wheel {
  padding: 16px 44px;
  background:
    linear-gradient(135deg, #ea580c 0%, #dc2626 60%, #b91c1c 100%);
  border: 2px solid #c8a44e;
  border-radius: 12px;
  color: #fff;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow:
    0 4px 20px rgba(234, 88, 12, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -2px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.btn-spin-wheel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
  pointer-events: none;
}

.btn-spin-wheel:hover {
  transform: scale(1.05);
  box-shadow:
    0 6px 30px rgba(234, 88, 12, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-spin-wheel:active {
  transform: scale(0.97);
}

.btn-collect {
  padding: 16px 44px;
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
  box-shadow:
    0 4px 20px rgba(34, 197, 94, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  animation: collect-pulse 1.5s ease-in-out infinite;
}

@keyframes collect-pulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 4px 30px rgba(34, 197, 94, 0.7), 0 0 40px rgba(34, 197, 94, 0.3); }
}

.btn-collect:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 30px rgba(34, 197, 94, 0.6);
}

/* ─── Spinning Text ─── */
.spinning-text {
  font-size: 16px;
  font-weight: 600;
  color: #d6d3d1;
  letter-spacing: 2px;
  animation: pulse-text 1s ease-in-out infinite;
}

@keyframes pulse-text {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* ─── Transitions ─── */
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
