<script setup lang="ts">
import GameView from '@/views/GameView.vue'
import TreasureMap from '@/components/bonus/TreasureMap.vue'
import { egyptianConfig } from '@/games/egyptian'

function particleStyle(i: number) {
  const left = Math.random() * 100
  const delay = Math.random() * 12
  const duration = 5 + Math.random() * 10
  const size = 1 + Math.random() * 4
  const opacity = 0.15 + Math.random() * 0.35
  const drift = -30 + Math.random() * 60
  return {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: opacity,
    '--drift': `${drift}px`,
  }
}
</script>

<template>
  <div class="egyptian-wrapper">
    <!-- Vignette overlay -->
    <div class="vignette" />

    <!-- Top golden sun -->
    <div class="sun-glow" />

    <!-- Torch glow effects -->
    <div class="torch torch-left" />
    <div class="torch torch-right" />

    <!-- Pyramid silhouettes -->
    <div class="pyramids">
      <svg viewBox="0 0 800 200" preserveAspectRatio="none" class="pyramid-svg">
        <defs>
          <linearGradient id="pyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#c8a44e" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#1a0e00" stop-opacity="0.6" />
          </linearGradient>
        </defs>
        <polygon points="100,180 200,40 300,180" fill="url(#pyGrad)" />
        <polygon points="250,180 380,20 510,180" fill="url(#pyGrad)" />
        <polygon points="450,180 560,60 670,180" fill="url(#pyGrad)" />
        <polygon points="600,180 690,80 780,180" fill="url(#pyGrad)" />
        <rect x="0" y="178" width="800" height="22" fill="#1a0e00" opacity="0.5" />
      </svg>
    </div>

    <!-- Hieroglyphic side ornaments -->
    <div class="hieroglyphic-strip hieroglyphic-left">
      <span v-for="n in 12" :key="n" class="hiero-char">
        {{ ['&#x13000;','&#x1303F;','&#x13060;','&#x130A0;','&#x130B0;','&#x13100;','&#x13150;','&#x131A0;','&#x131F0;','&#x13230;','&#x13280;','&#x132B0;'][n - 1] }}
      </span>
    </div>
    <div class="hieroglyphic-strip hieroglyphic-right">
      <span v-for="n in 12" :key="n" class="hiero-char">
        {{ ['&#x132F0;','&#x13300;','&#x13350;','&#x133A0;','&#x133F0;','&#x13000;','&#x1303F;','&#x13060;','&#x130A0;','&#x130B0;','&#x13100;','&#x13150;'][n - 1] }}
      </span>
    </div>

    <GameView :config="egyptianConfig">
      <template #bonus="{ show, bet, onComplete }">
        <TreasureMap :show="show" :bet="bet" :on-complete="onComplete" />
      </template>
    </GameView>

    <!-- Sand particles -->
    <div class="particles">
      <div v-for="i in 40" :key="i" class="particle" :style="particleStyle(i)" />
    </div>

    <!-- Floating golden sparkles -->
    <div class="sparkles">
      <div v-for="i in 15" :key="'s'+i" class="sparkle" :style="{
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 6 + 's',
        animationDuration: 2 + Math.random() * 3 + 's',
      }" />
    </div>
  </div>
</template>

<style scoped>
/* === WRAPPER & ATMOSPHERE === */
.egyptian-wrapper {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

/* Vignette effect */
.vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(10, 5, 0, 0.4) 80%,
    rgba(5, 2, 0, 0.7) 100%
  );
}

/* Sun glow at top */
.sun-glow {
  position: fixed;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 300px;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 200, 50, 0.2) 0%,
    rgba(200, 164, 78, 0.08) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 1;
  animation: sun-pulse 6s ease-in-out infinite;
}

@keyframes sun-pulse {
  0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
  50% { opacity: 1; transform: translateX(-50%) scale(1.08); }
}

/* Torch glow effects */
.torch {
  position: fixed;
  width: 120px;
  height: 400px;
  pointer-events: none;
  z-index: 1;
  top: 15%;
}

.torch-left {
  left: -30px;
  background: radial-gradient(
    ellipse at 20% 30%,
    rgba(255, 140, 20, 0.15) 0%,
    rgba(200, 100, 10, 0.06) 40%,
    transparent 70%
  );
  animation: torch-flicker-left 3s ease-in-out infinite;
}

.torch-right {
  right: -30px;
  background: radial-gradient(
    ellipse at 80% 30%,
    rgba(255, 140, 20, 0.15) 0%,
    rgba(200, 100, 10, 0.06) 40%,
    transparent 70%
  );
  animation: torch-flicker-right 3.5s ease-in-out infinite;
}

@keyframes torch-flicker-left {
  0%, 100% { opacity: 0.7; transform: scaleY(1); }
  25% { opacity: 1; transform: scaleY(1.05); }
  50% { opacity: 0.6; transform: scaleY(0.97); }
  75% { opacity: 0.9; transform: scaleY(1.02); }
}

@keyframes torch-flicker-right {
  0%, 100% { opacity: 0.6; transform: scaleY(1); }
  30% { opacity: 1; transform: scaleY(1.04); }
  60% { opacity: 0.7; transform: scaleY(0.96); }
  80% { opacity: 0.85; transform: scaleY(1.03); }
}

/* Pyramid silhouettes */
.pyramids {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
}

.pyramid-svg {
  width: 100%;
  height: 100%;
}

/* Hieroglyphic side ornaments */
.hieroglyphic-strip {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  pointer-events: none;
  z-index: 2;
  opacity: 0.15;
}

.hieroglyphic-left {
  left: 2px;
}

.hieroglyphic-right {
  right: 2px;
}

.hiero-char {
  font-size: 14px;
  color: #c8a44e;
  text-shadow: 0 0 6px rgba(200, 164, 78, 0.4);
  animation: hiero-glow 8s ease-in-out infinite;
}

.hiero-char:nth-child(odd) {
  animation-delay: -4s;
}

@keyframes hiero-glow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

/* === PARTICLES === */
.particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  overflow: hidden;
}

.particle {
  position: absolute;
  top: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, #dbb85a, #a07830);
  animation: particle-sand linear infinite;
  filter: blur(0.5px);
}

@keyframes particle-sand {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: var(--particle-opacity, 0.3);
  }
  90% {
    opacity: var(--particle-opacity, 0.3);
  }
  100% {
    transform: translateY(100vh) translateX(var(--drift, 20px)) rotate(360deg);
    opacity: 0;
  }
}

/* Golden sparkles */
.sparkles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #ffd700;
  border-radius: 50%;
  animation: sparkle-blink ease-in-out infinite;
  box-shadow: 0 0 4px #ffd700, 0 0 8px rgba(255, 215, 0, 0.5);
}

@keyframes sparkle-blink {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

/* ========================================
   DEEP STYLES — GameView child components
   ======================================== */

/* === GAME VIEW CONTAINER === */
:deep(.game-view) {
  position: relative;
  z-index: 3;
}

/* === HEADER === */
:deep(.game-header) {
  position: relative;
  padding-bottom: 8px;
  margin-bottom: 4px;
}

:deep(.game-header::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    #c8a44e 20%,
    #ffd700 50%,
    #c8a44e 80%,
    transparent
  );
  box-shadow: 0 0 8px rgba(200, 164, 78, 0.4);
}

:deep(.game-title) {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: linear-gradient(
    180deg,
    #fff8dc 0%,
    #ffd700 25%,
    #daa520 50%,
    #b8860b 75%,
    #ffd700 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))
         drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  animation: title-shimmer 4s ease-in-out infinite;
}

@keyframes title-shimmer {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.5)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)); }
  50% { filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.8)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)); }
}

:deep(.back-btn) {
  background: linear-gradient(135deg, rgba(200, 164, 78, 0.15), rgba(139, 90, 43, 0.15));
  border: 1px solid rgba(200, 164, 78, 0.3);
  color: #dbb85a;
  transition: all 0.2s ease;
}

:deep(.back-btn:hover) {
  background: linear-gradient(135deg, rgba(200, 164, 78, 0.3), rgba(139, 90, 43, 0.3));
  border-color: rgba(200, 164, 78, 0.6);
  box-shadow: 0 0 12px rgba(200, 164, 78, 0.3);
}

/* === JACKPOT METER === */
:deep(.jackpot-meter) {
  position: relative;
  border: 2px solid #c8a44e !important;
  border-image: linear-gradient(
    135deg,
    #8b5a2b,
    #ffd700,
    #daa520,
    #ffd700,
    #8b5a2b
  ) 1 !important;
  background: linear-gradient(
    135deg,
    rgba(20, 10, 0, 0.9),
    rgba(40, 25, 5, 0.9),
    rgba(20, 10, 0, 0.9)
  ) !important;
  box-shadow:
    0 0 15px rgba(200, 164, 78, 0.2),
    inset 0 0 20px rgba(200, 164, 78, 0.05),
    0 4px 12px rgba(0, 0, 0, 0.4);
  overflow: visible;
}

:deep(.jackpot-meter::before) {
  content: '';
  position: absolute;
  inset: -1px;
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: inherit;
  pointer-events: none;
}

/* === REEL AREA — THE MAIN FRAME === */
:deep(.reel-area) {
  position: relative;
  padding: 12px;
}

/* Outer ornate border */
:deep(.reel-area::before) {
  content: '';
  position: absolute;
  inset: 0;
  border: 3px solid transparent;
  border-image: linear-gradient(
    135deg,
    #8b5a2b 0%,
    #ffd700 15%,
    #daa520 30%,
    #ffd700 50%,
    #daa520 70%,
    #ffd700 85%,
    #8b5a2b 100%
  ) 1;
  pointer-events: none;
  z-index: 1;
}

/* Inner gold glow */
:deep(.reel-area::after) {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid rgba(200, 164, 78, 0.4);
  box-shadow:
    inset 0 0 30px rgba(200, 164, 78, 0.08),
    inset 0 0 60px rgba(139, 90, 43, 0.05);
  pointer-events: none;
  z-index: 1;
}

/* === REEL GRID === */
:deep(.reel-grid) {
  position: relative;
  background: linear-gradient(
    180deg,
    rgba(15, 8, 0, 0.95) 0%,
    rgba(25, 15, 2, 0.9) 50%,
    rgba(15, 8, 0, 0.95) 100%
  );
  border-radius: 4px;
  box-shadow:
    0 0 20px rgba(200, 164, 78, 0.12),
    inset 0 2px 8px rgba(0, 0, 0, 0.5),
    inset 0 -2px 8px rgba(0, 0, 0, 0.5);
}

/* === REEL COLUMNS — Golden separators === */
:deep(.reel-column) {
  position: relative;
  background: linear-gradient(
    180deg,
    rgba(200, 164, 78, 0.03) 0%,
    rgba(200, 164, 78, 0.06) 50%,
    rgba(200, 164, 78, 0.03) 100%
  );
}

:deep(.reel-column + .reel-column) {
  border-left: 1px solid rgba(200, 164, 78, 0.15);
}

:deep(.reel-column + .reel-column::before) {
  content: '';
  position: absolute;
  left: -1px;
  top: 10%;
  bottom: 10%;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(255, 215, 0, 0.3) 20%,
    rgba(255, 215, 0, 0.5) 50%,
    rgba(255, 215, 0, 0.3) 80%,
    transparent
  );
  pointer-events: none;
}

/* === SYMBOL TILES === */
:deep(.symbol-tile) {
  position: relative;
  background: linear-gradient(
    145deg,
    rgba(30, 18, 2, 0.6) 0%,
    rgba(45, 28, 5, 0.4) 50%,
    rgba(30, 18, 2, 0.6) 100%
  );
  border: 1px solid rgba(200, 164, 78, 0.08);
  transition: all 0.3s ease;
}

:deep(.symbol-tile:hover) {
  background: linear-gradient(
    145deg,
    rgba(50, 30, 5, 0.7) 0%,
    rgba(70, 45, 10, 0.5) 50%,
    rgba(50, 30, 5, 0.7) 100%
  );
  border-color: rgba(200, 164, 78, 0.2);
}

/* === WIN HIGHLIGHT — Dramatic golden pulse === */
:deep(.win-highlight) {
  animation: win-glow-pulse 0.8s ease-in-out infinite alternate !important;
  border: 2px solid #ffd700 !important;
  box-shadow:
    0 0 10px rgba(255, 215, 0, 0.6),
    0 0 20px rgba(255, 215, 0, 0.3),
    0 0 40px rgba(255, 215, 0, 0.15),
    inset 0 0 15px rgba(255, 215, 0, 0.1) !important;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 215, 0, 0.15) 0%,
    rgba(200, 164, 78, 0.05) 60%,
    transparent 100%
  ) !important;
}

@keyframes win-glow-pulse {
  0% {
    box-shadow:
      0 0 10px rgba(255, 215, 0, 0.6),
      0 0 20px rgba(255, 215, 0, 0.3),
      0 0 40px rgba(255, 215, 0, 0.15),
      inset 0 0 15px rgba(255, 215, 0, 0.1);
    border-color: #ffd700;
  }
  100% {
    box-shadow:
      0 0 15px rgba(255, 215, 0, 0.9),
      0 0 30px rgba(255, 215, 0, 0.5),
      0 0 60px rgba(255, 215, 0, 0.25),
      inset 0 0 25px rgba(255, 215, 0, 0.2);
    border-color: #fff8dc;
  }
}

/* === WIN RESULT / WIN BANNER === */
:deep(.win-result),
:deep(.win-banner) {
  border: 2px solid #ffd700 !important;
  background: linear-gradient(
    135deg,
    rgba(20, 10, 0, 0.95),
    rgba(50, 30, 5, 0.95),
    rgba(20, 10, 0, 0.95)
  ) !important;
  box-shadow:
    0 0 20px rgba(255, 215, 0, 0.3),
    0 0 40px rgba(200, 164, 78, 0.15),
    inset 0 0 20px rgba(200, 164, 78, 0.05) !important;
  color: #ffd700 !important;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  animation: win-display-glow 1.5s ease-in-out infinite alternate;
}

@keyframes win-display-glow {
  0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(200, 164, 78, 0.15), inset 0 0 20px rgba(200, 164, 78, 0.05); }
  100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(200, 164, 78, 0.25), inset 0 0 30px rgba(200, 164, 78, 0.1); }
}

/* === FREE SPINS BADGE === */
:deep(.free-spins-badge) {
  background: linear-gradient(
    135deg,
    rgba(200, 164, 78, 0.15),
    rgba(255, 215, 0, 0.1)
  ) !important;
  border: 1px solid rgba(255, 215, 0, 0.4) !important;
  color: #ffd700 !important;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.15);
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.4);
  animation: free-spin-pulse 2s ease-in-out infinite;
}

@keyframes free-spin-pulse {
  0%, 100% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.15); }
  50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.3); }
}

/* === CONTROLS AREA === */
:deep(.controls) {
  position: relative;
}

/* === SPIN BUTTON — Golden artifact === */
:deep(.btn-spin) {
  position: relative;
  background: linear-gradient(
    180deg,
    #daa520 0%,
    #b8860b 20%,
    #8b6914 50%,
    #b8860b 80%,
    #daa520 100%
  ) !important;
  border: 2px solid #ffd700 !important;
  color: #1a0e00 !important;
  font-weight: 900 !important;
  font-size: 16px !important;
  letter-spacing: 3px !important;
  text-transform: uppercase !important;
  text-shadow: 0 1px 0 rgba(255, 215, 0, 0.5) !important;
  box-shadow:
    0 0 15px rgba(255, 215, 0, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.2s ease !important;
  animation: spin-btn-idle 3s ease-in-out infinite;
  overflow: hidden;
}

/* Shimmer sweep on spin button */
:deep(.btn-spin::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shimmer-sweep 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shimmer-sweep {
  0%, 100% { left: -100%; }
  50% { left: 150%; }
}

@keyframes spin-btn-idle {
  0%, 100% {
    box-shadow:
      0 0 15px rgba(255, 215, 0, 0.3),
      0 4px 12px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow:
      0 0 25px rgba(255, 215, 0, 0.5),
      0 4px 20px rgba(200, 164, 78, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  }
}

:deep(.btn-spin:hover:not(:disabled)) {
  background: linear-gradient(
    180deg,
    #ffd700 0%,
    #daa520 20%,
    #b8860b 50%,
    #daa520 80%,
    #ffd700 100%
  ) !important;
  box-shadow:
    0 0 30px rgba(255, 215, 0, 0.6),
    0 4px 20px rgba(200, 164, 78, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2) !important;
  transform: translateY(-1px);
}

:deep(.btn-spin:active:not(:disabled)) {
  transform: translateY(1px);
  box-shadow:
    0 0 10px rgba(255, 215, 0, 0.4),
    0 2px 6px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(0, 0, 0, 0.3) !important;
}

:deep(.btn-spin:disabled) {
  background: linear-gradient(
    180deg,
    #7a6a3a 0%,
    #5a4a2a 50%,
    #7a6a3a 100%
  ) !important;
  border-color: #8a7a4a !important;
  color: rgba(26, 14, 0, 0.5) !important;
  box-shadow: none !important;
  animation: none !important;
}

/* === AUTO BUTTON === */
:deep(.auto-btn) {
  background: linear-gradient(
    135deg,
    rgba(200, 164, 78, 0.1),
    rgba(139, 90, 43, 0.1)
  ) !important;
  border: 1px solid rgba(200, 164, 78, 0.3) !important;
  color: #c8a44e !important;
  transition: all 0.2s ease !important;
}

:deep(.auto-btn:hover:not(:disabled)) {
  background: linear-gradient(
    135deg,
    rgba(200, 164, 78, 0.2),
    rgba(139, 90, 43, 0.2)
  ) !important;
  border-color: #ffd700 !important;
  color: #ffd700 !important;
  box-shadow: 0 0 12px rgba(200, 164, 78, 0.2) !important;
}

:deep(.auto-btn.stop) {
  border-color: #ff4444 !important;
  color: #ff6666 !important;
  box-shadow: 0 0 10px rgba(255, 68, 68, 0.15) !important;
}

/* === BET CONTROLS === */
:deep(.bet-controls) {
  border: 1px solid rgba(200, 164, 78, 0.2) !important;
  background: linear-gradient(
    135deg,
    rgba(20, 10, 0, 0.8),
    rgba(35, 20, 3, 0.8)
  ) !important;
  box-shadow: inset 0 0 15px rgba(200, 164, 78, 0.03);
}

:deep(.bet-controls button) {
  color: #c8a44e !important;
  border-color: rgba(200, 164, 78, 0.2) !important;
  transition: all 0.15s ease !important;
}

:deep(.bet-controls button:hover:not(:disabled)) {
  background: rgba(200, 164, 78, 0.15) !important;
  color: #ffd700 !important;
}

/* === WALLET CHIP === */
:deep(.wallet-chip) {
  border: 1px solid rgba(200, 164, 78, 0.3) !important;
  background: linear-gradient(
    135deg,
    rgba(200, 164, 78, 0.1),
    rgba(139, 90, 43, 0.15)
  ) !important;
  box-shadow: 0 0 10px rgba(200, 164, 78, 0.1);
}

/* === REEL STRIP SCROLL SHADOW (depth effect) === */
:deep(.reel-strip) {
  mask-image: linear-gradient(
    180deg,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    180deg,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
}

/* === SYMBOL ICON GOLDEN TINT === */
:deep(.symbol-icon) {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  transition: filter 0.3s ease;
}

:deep(.win-highlight .symbol-icon) {
  filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))
         drop-shadow(0 0 12px rgba(255, 215, 0, 0.3));
  animation: icon-win-bounce 0.6s ease-in-out infinite alternate;
}

@keyframes icon-win-bounce {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}
</style>
