<script setup lang="ts">
import GameView from '@/views/GameView.vue'
import PickAPrize from '@/components/bonus/PickAPrize.vue'
import { oceanConfig } from '@/games/ocean'

const bubbles = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 12,
  duration: 4 + Math.random() * 10,
  size: 2 + Math.random() * 12,
  opacity: 0.1 + Math.random() * 0.4,
}))

const lightRays = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: 10 + i * 15,
  width: 40 + Math.random() * 80,
  delay: Math.random() * 6,
  duration: 8 + Math.random() * 6,
  opacity: 0.03 + Math.random() * 0.05,
}))
</script>

<template>
  <div class="ocean-wrapper">
    <!-- Water caustic overlay -->
    <div class="caustic-overlay" aria-hidden="true" />

    <!-- Light rays from above -->
    <div class="light-rays" aria-hidden="true">
      <div
        v-for="ray in lightRays"
        :key="ray.id"
        class="light-ray"
        :style="{
          left: ray.left + '%',
          width: ray.width + 'px',
          animationDelay: ray.delay + 's',
          animationDuration: ray.duration + 's',
          opacity: ray.opacity,
        }"
      />
    </div>

    <!-- Seaweed silhouettes -->
    <div class="seaweed-left" aria-hidden="true" />
    <div class="seaweed-right" aria-hidden="true" />

    <!-- Bubbles -->
    <div class="ocean-particles" aria-hidden="true">
      <div
        v-for="b in bubbles"
        :key="b.id"
        class="ocean-bubble"
        :style="{
          left: b.left + '%',
          animationDelay: b.delay + 's',
          animationDuration: b.duration + 's',
          width: b.size + 'px',
          height: b.size + 'px',
          opacity: b.opacity,
        }"
      />
    </div>

    <!-- Vignette overlay -->
    <div class="vignette" aria-hidden="true" />

    <GameView :config="oceanConfig">
      <template #bonus="{ show, bet, onComplete }">
        <PickAPrize :show="show" :bet="bet" :on-complete="onComplete" />
      </template>
    </GameView>
  </div>
</template>

<style scoped>
/* ========================================
   DEEP OCEAN — Premium Casino Slot Theme
   ======================================== */

.ocean-wrapper {
  position: relative;
  isolation: isolate;
}

/* --- Water Caustic Overlay --- */
.caustic-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 200px 100px at 20% 30%, rgba(0, 210, 255, 0.06), transparent),
    radial-gradient(ellipse 300px 150px at 70% 20%, rgba(0, 180, 220, 0.05), transparent),
    radial-gradient(ellipse 250px 120px at 50% 60%, rgba(0, 255, 200, 0.04), transparent),
    radial-gradient(ellipse 180px 90px at 80% 70%, rgba(0, 200, 255, 0.05), transparent);
  animation: caustic-shift 12s ease-in-out infinite alternate;
}

@keyframes caustic-shift {
  0% {
    background-position: 0% 0%, 100% 0%, 50% 50%, 80% 80%;
    opacity: 0.6;
  }
  33% {
    background-position: 20% 10%, 80% 20%, 30% 40%, 60% 60%;
    opacity: 1;
  }
  66% {
    background-position: 40% 20%, 60% 10%, 70% 30%, 40% 50%;
    opacity: 0.7;
  }
  100% {
    background-position: 10% 5%, 90% 15%, 40% 60%, 70% 40%;
    opacity: 0.9;
  }
}

/* --- Light Rays from Above --- */
.light-rays {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.light-ray {
  position: absolute;
  top: -20%;
  height: 140%;
  background: linear-gradient(
    180deg,
    rgba(0, 210, 255, 0.12) 0%,
    rgba(0, 180, 240, 0.06) 30%,
    rgba(0, 150, 200, 0.02) 60%,
    transparent 100%
  );
  transform: skewX(-8deg);
  animation: ray-sway ease-in-out infinite alternate;
  filter: blur(20px);
}

@keyframes ray-sway {
  0% { transform: skewX(-8deg) translateX(-20px); opacity: 0.03; }
  50% { transform: skewX(-4deg) translateX(10px); opacity: 0.07; }
  100% { transform: skewX(-12deg) translateX(-15px); opacity: 0.04; }
}

/* --- Seaweed Silhouettes --- */
.seaweed-left,
.seaweed-right {
  position: fixed;
  bottom: 0;
  width: 120px;
  height: 60%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.15;
}

.seaweed-left {
  left: 0;
  background:
    radial-gradient(ellipse 20px 200px at 30% 80%, rgba(0, 80, 60, 0.8), transparent),
    radial-gradient(ellipse 15px 250px at 60% 70%, rgba(0, 60, 50, 0.6), transparent),
    radial-gradient(ellipse 25px 180px at 20% 90%, rgba(0, 70, 55, 0.7), transparent),
    radial-gradient(ellipse 12px 220px at 80% 75%, rgba(0, 90, 70, 0.5), transparent);
  animation: seaweed-wave 8s ease-in-out infinite alternate;
}

.seaweed-right {
  right: 0;
  background:
    radial-gradient(ellipse 20px 220px at 70% 80%, rgba(0, 80, 60, 0.8), transparent),
    radial-gradient(ellipse 18px 260px at 40% 70%, rgba(0, 60, 50, 0.6), transparent),
    radial-gradient(ellipse 22px 190px at 80% 90%, rgba(0, 70, 55, 0.7), transparent);
  animation: seaweed-wave 10s ease-in-out infinite alternate-reverse;
}

@keyframes seaweed-wave {
  0% { transform: skewX(0deg) translateX(0); }
  50% { transform: skewX(2deg) translateX(5px); }
  100% { transform: skewX(-1deg) translateX(-3px); }
}

/* --- Bubbles --- */
.ocean-particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.ocean-bubble {
  position: absolute;
  bottom: -15px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(120, 230, 255, 0.5),
    rgba(60, 180, 255, 0.2) 40%,
    rgba(30, 140, 220, 0.08) 70%,
    transparent
  );
  border: 1px solid rgba(120, 220, 255, 0.15);
  box-shadow:
    inset 0 -2px 4px rgba(0, 180, 255, 0.1),
    0 0 6px rgba(0, 200, 255, 0.15);
  animation: particle-bubble linear infinite;
}

/* --- Vignette --- */
.vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    ellipse 70% 60% at 50% 40%,
    transparent 0%,
    rgba(0, 10, 20, 0.3) 60%,
    rgba(0, 5, 15, 0.7) 100%
  );
}

/* ========================================
   :deep() Overrides — GameView Components
   ======================================== */

/* --- Game Container --- */
:deep(.game-view) {
  position: relative;
  z-index: 2;
}

/* --- Header & Title --- */
:deep(.game-header) {
  position: relative;
}

:deep(.game-title) {
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: linear-gradient(
    180deg,
    #b0f0ff 0%,
    #00d4ff 30%,
    #0090cc 70%,
    #40e0ff 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  filter: drop-shadow(0 0 8px rgba(0, 200, 255, 0.5))
          drop-shadow(0 0 20px rgba(0, 160, 220, 0.3));
  animation: title-shimmer 4s ease-in-out infinite;
}

@keyframes title-shimmer {
  0%, 100% {
    filter: drop-shadow(0 0 8px rgba(0, 200, 255, 0.5))
            drop-shadow(0 0 20px rgba(0, 160, 220, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(0, 230, 255, 0.7))
            drop-shadow(0 0 30px rgba(0, 180, 240, 0.5));
  }
}

:deep(.back-btn) {
  text-shadow: 0 0 8px rgba(0, 200, 255, 0.4);
}

/* --- Jackpot Meter --- */
:deep(.jackpot-meter) {
  position: relative;
  border: 1px solid rgba(0, 220, 255, 0.3) !important;
  background: linear-gradient(
    135deg,
    rgba(0, 20, 40, 0.9),
    rgba(0, 40, 60, 0.8),
    rgba(0, 20, 40, 0.9)
  ) !important;
  box-shadow:
    0 0 10px rgba(0, 200, 255, 0.2),
    0 0 25px rgba(0, 160, 220, 0.1),
    inset 0 1px 0 rgba(0, 220, 255, 0.15),
    inset 0 -1px 0 rgba(0, 100, 150, 0.2) !important;
  backdrop-filter: blur(8px);
  overflow: hidden;
}

:deep(.jackpot-meter)::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 220, 255, 0.06),
    transparent
  );
  animation: jackpot-gleam 3s ease-in-out infinite;
}

@keyframes jackpot-gleam {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

/* --- Reel Grid (Main Frame) --- */
:deep(.reel-grid) {
  position: relative;
  border: 2px solid rgba(0, 220, 255, 0.35) !important;
  border-radius: 12px !important;
  background: linear-gradient(
    180deg,
    rgba(0, 15, 30, 0.95),
    rgba(0, 25, 50, 0.9),
    rgba(0, 10, 25, 0.95)
  ) !important;
  box-shadow:
    /* Inner glow */
    inset 0 0 30px rgba(0, 100, 180, 0.15),
    inset 0 0 60px rgba(0, 60, 120, 0.08),
    /* Bioluminescent outer glow - layered */
    0 0 8px rgba(0, 200, 255, 0.3),
    0 0 16px rgba(0, 180, 240, 0.2),
    0 0 32px rgba(0, 140, 200, 0.15),
    0 0 64px rgba(0, 100, 180, 0.1),
    0 0 100px rgba(0, 80, 160, 0.05) !important;
  overflow: hidden;
}

/* Animated shimmer across the frame border */
:deep(.reel-grid)::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 14px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 255, 255, 0.15) 25%,
    rgba(0, 200, 255, 0.25) 50%,
    rgba(0, 255, 255, 0.15) 75%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: frame-shimmer 6s linear infinite;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  padding: 2px;
  pointer-events: none;
  z-index: 10;
}

/* Coral corner decorations */
:deep(.reel-grid)::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  pointer-events: none;
  z-index: 10;
  background:
    /* Top-left coral glow */
    radial-gradient(ellipse 50px 50px at 0% 0%, rgba(0, 200, 180, 0.25), transparent),
    /* Top-right coral glow */
    radial-gradient(ellipse 50px 50px at 100% 0%, rgba(0, 180, 220, 0.25), transparent),
    /* Bottom-left coral glow */
    radial-gradient(ellipse 50px 50px at 0% 100%, rgba(0, 220, 200, 0.2), transparent),
    /* Bottom-right coral glow */
    radial-gradient(ellipse 50px 50px at 100% 100%, rgba(0, 200, 240, 0.2), transparent);
}

@keyframes frame-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* --- Reel Columns --- */
:deep(.reel-column) {
  position: relative;
  background: linear-gradient(
    180deg,
    rgba(0, 20, 45, 0.4),
    rgba(0, 30, 55, 0.2) 50%,
    rgba(0, 20, 45, 0.4)
  ) !important;
}

:deep(.reel-column)::after {
  content: '';
  position: absolute;
  top: 5%;
  bottom: 5%;
  right: 0;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(0, 180, 255, 0.15) 20%,
    rgba(0, 200, 255, 0.25) 50%,
    rgba(0, 180, 255, 0.15) 80%,
    transparent
  );
  pointer-events: none;
}

:deep(.reel-column:last-child)::after {
  display: none;
}

/* --- Symbol Tiles --- */
:deep(.symbol-tile) {
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(0, 20, 50, 0.6),
    rgba(0, 35, 70, 0.4) 50%,
    rgba(0, 20, 50, 0.6)
  ) !important;
  border: 1px solid rgba(0, 150, 220, 0.08) !important;
  border-radius: 6px !important;
  backdrop-filter: blur(2px);
  transition: all 0.3s ease;
}

:deep(.symbol-tile:hover) {
  border-color: rgba(0, 200, 255, 0.2) !important;
  background: linear-gradient(
    135deg,
    rgba(0, 30, 60, 0.7),
    rgba(0, 50, 90, 0.5) 50%,
    rgba(0, 30, 60, 0.7)
  ) !important;
}

:deep(.symbol-icon) {
  filter: drop-shadow(0 0 4px rgba(0, 180, 255, 0.3));
}

/* --- Win Highlight --- */
:deep(.win-highlight) {
  border-color: rgba(0, 255, 255, 0.6) !important;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 255, 255, 0.15),
    rgba(0, 200, 255, 0.05)
  ) !important;
  box-shadow:
    0 0 8px rgba(0, 255, 255, 0.5),
    0 0 16px rgba(0, 220, 255, 0.35),
    0 0 32px rgba(0, 180, 240, 0.2),
    0 0 48px rgba(0, 140, 200, 0.1),
    inset 0 0 15px rgba(0, 255, 255, 0.15) !important;
  animation: bio-pulse 1.5s ease-in-out infinite !important;
}

@keyframes bio-pulse {
  0%, 100% {
    box-shadow:
      0 0 8px rgba(0, 255, 255, 0.5),
      0 0 16px rgba(0, 220, 255, 0.35),
      0 0 32px rgba(0, 180, 240, 0.2),
      0 0 48px rgba(0, 140, 200, 0.1),
      inset 0 0 15px rgba(0, 255, 255, 0.15);
  }
  50% {
    box-shadow:
      0 0 12px rgba(0, 255, 255, 0.7),
      0 0 24px rgba(0, 220, 255, 0.5),
      0 0 48px rgba(0, 180, 240, 0.3),
      0 0 72px rgba(0, 140, 200, 0.15),
      inset 0 0 25px rgba(0, 255, 255, 0.25);
  }
}

/* --- Win Result Display --- */
:deep(.win-result) {
  position: relative;
  text-shadow:
    0 0 10px rgba(0, 255, 255, 0.6),
    0 0 20px rgba(0, 200, 255, 0.4),
    0 0 40px rgba(0, 160, 220, 0.2) !important;
  animation: win-glow 2s ease-in-out infinite;
}

@keyframes win-glow {
  0%, 100% {
    text-shadow:
      0 0 10px rgba(0, 255, 255, 0.6),
      0 0 20px rgba(0, 200, 255, 0.4),
      0 0 40px rgba(0, 160, 220, 0.2);
    filter: brightness(1);
  }
  50% {
    text-shadow:
      0 0 15px rgba(0, 255, 255, 0.8),
      0 0 30px rgba(0, 200, 255, 0.6),
      0 0 60px rgba(0, 160, 220, 0.3);
    filter: brightness(1.15);
  }
}

/* --- Free Spins Badge --- */
:deep(.free-spins-badge) {
  border: 1px solid rgba(0, 255, 220, 0.4) !important;
  background: linear-gradient(
    135deg,
    rgba(0, 40, 60, 0.95),
    rgba(0, 60, 80, 0.9)
  ) !important;
  box-shadow:
    0 0 12px rgba(0, 255, 220, 0.3),
    0 0 24px rgba(0, 200, 255, 0.15),
    inset 0 1px 0 rgba(0, 255, 220, 0.2) !important;
  text-shadow: 0 0 8px rgba(0, 255, 220, 0.5);
}

/* --- Controls Area --- */
:deep(.controls) {
  position: relative;
}

:deep(.bet-controls) {
  text-shadow: 0 0 6px rgba(0, 200, 255, 0.3);
}

/* --- Spin Button --- */
:deep(.btn-spin) {
  position: relative;
  background: linear-gradient(
    180deg,
    #00d4ff 0%,
    #0098cc 30%,
    #006699 60%,
    #004d73 100%
  ) !important;
  border: 2px solid rgba(0, 220, 255, 0.5) !important;
  color: #fff !important;
  font-weight: 800 !important;
  letter-spacing: 1px;
  text-shadow:
    0 0 8px rgba(0, 220, 255, 0.6),
    0 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow:
    0 0 10px rgba(0, 200, 255, 0.35),
    0 0 25px rgba(0, 160, 220, 0.2),
    0 0 50px rgba(0, 120, 180, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2) !important;
  overflow: hidden;
  transition: all 0.3s ease !important;
  animation: spin-pulse 3s ease-in-out infinite;
}

:deep(.btn-spin)::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255, 255, 255, 0.12) 45%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.12) 55%,
    transparent 70%
  );
  animation: btn-sheen 4s ease-in-out infinite;
  pointer-events: none;
}

:deep(.btn-spin:hover) {
  box-shadow:
    0 0 15px rgba(0, 220, 255, 0.5),
    0 0 35px rgba(0, 180, 240, 0.3),
    0 0 70px rgba(0, 140, 200, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2) !important;
  border-color: rgba(0, 240, 255, 0.7) !important;
  transform: translateY(-1px);
}

:deep(.btn-spin:active) {
  transform: translateY(1px) !important;
  box-shadow:
    0 0 8px rgba(0, 200, 255, 0.4),
    0 0 16px rgba(0, 160, 220, 0.2),
    inset 0 2px 4px rgba(0, 0, 0, 0.3) !important;
}

@keyframes spin-pulse {
  0%, 100% {
    box-shadow:
      0 0 10px rgba(0, 200, 255, 0.35),
      0 0 25px rgba(0, 160, 220, 0.2),
      0 0 50px rgba(0, 120, 180, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow:
      0 0 14px rgba(0, 220, 255, 0.45),
      0 0 35px rgba(0, 180, 240, 0.25),
      0 0 60px rgba(0, 140, 200, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  }
}

@keyframes btn-sheen {
  0%, 100% { transform: translateX(-150%); }
  50% { transform: translateX(150%); }
}

/* --- Auto Spin Button --- */
:deep(.auto-btn) {
  border: 1px solid rgba(0, 180, 220, 0.25) !important;
  background: linear-gradient(
    180deg,
    rgba(0, 40, 60, 0.9),
    rgba(0, 25, 45, 0.95)
  ) !important;
  color: rgba(0, 220, 255, 0.8) !important;
  text-shadow: 0 0 6px rgba(0, 200, 255, 0.3);
  box-shadow:
    0 0 6px rgba(0, 160, 220, 0.15),
    inset 0 1px 0 rgba(0, 200, 255, 0.08) !important;
  transition: all 0.3s ease !important;
}

:deep(.auto-btn:hover) {
  border-color: rgba(0, 200, 255, 0.4) !important;
  box-shadow:
    0 0 10px rgba(0, 180, 240, 0.25),
    inset 0 1px 0 rgba(0, 220, 255, 0.12) !important;
}

/* --- Reel Area Wrapper --- */
:deep(.reel-area) {
  position: relative;
}

/* Underwater depth fog at top and bottom of reels */
:deep(.reel-area)::before,
:deep(.reel-area)::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 20px;
  pointer-events: none;
  z-index: 5;
}

:deep(.reel-area)::before {
  top: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 15, 30, 0.6),
    transparent
  );
}

:deep(.reel-area)::after {
  bottom: 0;
  background: linear-gradient(
    0deg,
    rgba(0, 15, 30, 0.6),
    transparent
  );
}

/* --- Reel Strip --- */
:deep(.reel-strip) {
  position: relative;
}
</style>
