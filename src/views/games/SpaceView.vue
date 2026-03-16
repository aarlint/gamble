<script setup lang="ts">
import GameView from '@/views/GameView.vue'
import ShootingStars from '@/components/bonus/ShootingStars.vue'
import { spaceConfig } from '@/games/space'

/* ---------- star layers ---------- */
const tinyStars = Array.from({ length: 50 }, (_, i) => ({
  id: `t${i}`,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 0.5 + Math.random() * 1.2,
  delay: Math.random() * 8,
  duration: 4 + Math.random() * 6,
}))

const mediumStars = Array.from({ length: 20 }, (_, i) => ({
  id: `m${i}`,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 1.5 + Math.random() * 2,
  delay: Math.random() * 5,
  duration: 3 + Math.random() * 4,
}))

const largeStars = Array.from({ length: 6 }, (_, i) => ({
  id: `l${i}`,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 3 + Math.random() * 2,
  delay: Math.random() * 10,
  duration: 5 + Math.random() * 5,
}))

const shootingStarData = Array.from({ length: 3 }, (_, i) => ({
  id: `ss${i}`,
  top: 5 + Math.random() * 40,
  delay: 4 + Math.random() * 12,
  duration: 0.8 + Math.random() * 0.6,
  angle: -15 + Math.random() * -20,
}))
</script>

<template>
  <div class="space-wrapper">
    <!-- Nebula clouds -->
    <div class="nebula-cloud nebula-1" />
    <div class="nebula-cloud nebula-2" />
    <div class="nebula-cloud nebula-3" />
    <div class="nebula-cloud nebula-4" />

    <!-- Planet silhouette -->
    <div class="planet" />
    <div class="planet-ring" />

    <!-- Tiny dim stars -->
    <div
      v-for="s in tinyStars"
      :key="s.id"
      class="star star-tiny"
      :style="{
        left: s.left + '%',
        top: s.top + '%',
        width: s.size + 'px',
        height: s.size + 'px',
        animationDelay: s.delay + 's',
        animationDuration: s.duration + 's',
      }"
    />

    <!-- Medium bright stars -->
    <div
      v-for="s in mediumStars"
      :key="s.id"
      class="star star-medium"
      :style="{
        left: s.left + '%',
        top: s.top + '%',
        width: s.size + 'px',
        height: s.size + 'px',
        animationDelay: s.delay + 's',
        animationDuration: s.duration + 's',
      }"
    />

    <!-- Large twinkling stars -->
    <div
      v-for="s in largeStars"
      :key="s.id"
      class="star star-large"
      :style="{
        left: s.left + '%',
        top: s.top + '%',
        width: s.size + 'px',
        height: s.size + 'px',
        animationDelay: s.delay + 's',
        animationDuration: s.duration + 's',
      }"
    />

    <!-- Shooting stars -->
    <div
      v-for="ss in shootingStarData"
      :key="ss.id"
      class="shooting-star"
      :style="{
        top: ss.top + '%',
        animationDelay: ss.delay + 's',
        animationDuration: ss.duration + 's',
        '--ss-angle': ss.angle + 'deg',
      }"
    />

    <!-- Deep-space vignette -->
    <div class="vignette" />

    <GameView :config="spaceConfig">
      <template #bonus="{ show, bet, onComplete }">
        <ShootingStars :show="show" :bet="bet" :on-complete="onComplete" />
      </template>
    </GameView>
  </div>
</template>

<style scoped>
/* ===== @property for animated gradient angle ===== */
@property --border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@property --shimmer-x {
  syntax: '<percentage>';
  initial-value: -50%;
  inherits: false;
}

/* ===== Wrapper ===== */
.space-wrapper {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 0%, #0d0221 0%, #030108 60%, #000 100%);
}

/* ===== Vignette ===== */
.vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.7) 100%);
}

/* ===== Nebula Clouds ===== */
.nebula-cloud {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: screen;
  filter: blur(80px);
  opacity: 0.25;
}

.nebula-1 {
  width: 600px;
  height: 400px;
  top: 5%;
  left: -5%;
  background: radial-gradient(ellipse, rgba(139, 92, 246, 0.6) 0%, rgba(88, 28, 135, 0.2) 50%, transparent 80%);
  animation: nebula-drift-1 30s ease-in-out infinite alternate;
}

.nebula-2 {
  width: 500px;
  height: 500px;
  top: 30%;
  right: -10%;
  background: radial-gradient(ellipse, rgba(236, 72, 153, 0.5) 0%, rgba(157, 23, 77, 0.2) 50%, transparent 80%);
  animation: nebula-drift-2 25s ease-in-out infinite alternate;
}

.nebula-3 {
  width: 700px;
  height: 350px;
  bottom: 10%;
  left: 20%;
  background: radial-gradient(ellipse, rgba(59, 130, 246, 0.4) 0%, rgba(30, 58, 138, 0.15) 50%, transparent 80%);
  animation: nebula-drift-3 35s ease-in-out infinite alternate;
}

.nebula-4 {
  width: 400px;
  height: 400px;
  top: 60%;
  left: -10%;
  background: radial-gradient(ellipse, rgba(168, 85, 247, 0.35) 0%, rgba(107, 33, 168, 0.1) 50%, transparent 80%);
  animation: nebula-drift-1 28s ease-in-out infinite alternate-reverse;
}

@keyframes nebula-drift-1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(60px, 30px) scale(1.15); }
}

@keyframes nebula-drift-2 {
  0% { transform: translate(0, 0) scale(1.1); }
  100% { transform: translate(-40px, 20px) scale(1); }
}

@keyframes nebula-drift-3 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, -25px) scale(1.08); }
}

/* ===== Planet ===== */
.planet {
  position: fixed;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  bottom: -40px;
  right: 8%;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    circle at 35% 35%,
    rgba(88, 28, 135, 0.6) 0%,
    rgba(30, 10, 60, 0.8) 40%,
    rgba(5, 2, 15, 0.95) 70%,
    #000 100%
  );
  box-shadow:
    0 0 60px rgba(139, 92, 246, 0.15),
    inset 0 0 40px rgba(0, 0, 0, 0.8);
}

.planet-ring {
  position: fixed;
  width: 280px;
  height: 50px;
  bottom: 18px;
  right: calc(8% - 50px);
  z-index: 0;
  pointer-events: none;
  border: 2px solid rgba(168, 85, 247, 0.15);
  border-radius: 50%;
  transform: rotateX(70deg) rotateZ(-15deg);
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.08);
}

/* ===== Star Particles ===== */
.star {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.star-tiny {
  background: rgba(200, 200, 220, 0.4);
  animation: twinkle-tiny var(--duration, 5s) ease-in-out infinite;
}

.star-medium {
  background: rgba(196, 181, 253, 0.7);
  box-shadow: 0 0 3px rgba(168, 85, 247, 0.4);
  animation: twinkle-medium var(--duration, 4s) ease-in-out infinite;
}

.star-large {
  background: rgba(224, 210, 255, 0.9);
  box-shadow:
    0 0 6px rgba(168, 85, 247, 0.6),
    0 0 15px rgba(139, 92, 246, 0.3);
  animation: twinkle-large var(--duration, 6s) ease-in-out infinite;
}

@keyframes twinkle-tiny {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.6; }
}

@keyframes twinkle-medium {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.3); }
}

@keyframes twinkle-large {
  0%, 100% { opacity: 0.3; transform: scale(0.6); filter: brightness(0.6); }
  25% { opacity: 1; transform: scale(1.4); filter: brightness(1.4); }
  50% { opacity: 0.5; transform: scale(1); filter: brightness(0.8); }
  75% { opacity: 1; transform: scale(1.2); filter: brightness(1.2); }
}

/* ===== Shooting Stars ===== */
.shooting-star {
  position: fixed;
  left: -10%;
  width: 80px;
  height: 1.5px;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(90deg, transparent, rgba(224, 210, 255, 0.9), transparent);
  border-radius: 999px;
  transform: rotate(var(--ss-angle, -20deg));
  opacity: 0;
  animation: shoot var(--duration, 1s) ease-out infinite;
}

.shooting-star::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 8px rgba(224, 210, 255, 0.9), 0 0 16px rgba(168, 85, 247, 0.6);
}

@keyframes shoot {
  0% { opacity: 0; left: -10%; }
  5% { opacity: 1; }
  30% { opacity: 1; }
  40% { opacity: 0; left: 110%; }
  100% { opacity: 0; left: 110%; }
}

/* ========================================
   DEEP STYLES — GameView child components
   ======================================== */

/* ----- Reel Grid: Holographic Containment Field ----- */
:deep(.reel-grid) {
  position: relative;
  border: 2px solid transparent;
  border-radius: 12px;
  background-clip: padding-box;
  background-color: rgba(5, 2, 20, 0.6);
  overflow: visible;
}

:deep(.reel-grid)::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 14px;
  padding: 3px;
  background: conic-gradient(
    from var(--border-angle, 0deg),
    rgba(168, 85, 247, 0.9),
    rgba(236, 72, 153, 0.7),
    rgba(59, 130, 246, 0.8),
    rgba(34, 211, 238, 0.7),
    rgba(168, 85, 247, 0.9)
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 2;
  animation: rotate-border 4s linear infinite;
}

:deep(.reel-grid)::after {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 18px;
  pointer-events: none;
  z-index: 1;
  box-shadow:
    0 0 15px rgba(168, 85, 247, 0.25),
    0 0 30px rgba(139, 92, 246, 0.15),
    0 0 60px rgba(88, 28, 135, 0.1),
    inset 0 0 15px rgba(168, 85, 247, 0.08);
  animation: grid-pulse 3s ease-in-out infinite;
}

@keyframes rotate-border {
  to { --border-angle: 360deg; }
}

@keyframes grid-pulse {
  0%, 100% {
    box-shadow:
      0 0 15px rgba(168, 85, 247, 0.25),
      0 0 30px rgba(139, 92, 246, 0.15),
      0 0 60px rgba(88, 28, 135, 0.1),
      inset 0 0 15px rgba(168, 85, 247, 0.08);
  }
  50% {
    box-shadow:
      0 0 20px rgba(168, 85, 247, 0.35),
      0 0 45px rgba(139, 92, 246, 0.2),
      0 0 80px rgba(88, 28, 135, 0.15),
      inset 0 0 20px rgba(168, 85, 247, 0.12);
  }
}

/* ----- Reel Columns: Energy Dividers ----- */
:deep(.reel-column) {
  background: linear-gradient(
    180deg,
    rgba(10, 5, 30, 0.9) 0%,
    rgba(15, 5, 40, 0.85) 50%,
    rgba(10, 5, 30, 0.9) 100%
  );
  border-left: 1px solid rgba(168, 85, 247, 0.15);
  border-right: 1px solid rgba(168, 85, 247, 0.15);
  position: relative;
}

:deep(.reel-column)::after {
  content: '';
  position: absolute;
  top: 5%;
  bottom: 5%;
  right: -1px;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(168, 85, 247, 0.4) 20%,
    rgba(139, 92, 246, 0.6) 50%,
    rgba(168, 85, 247, 0.4) 80%,
    transparent 100%
  );
  box-shadow: 0 0 6px rgba(168, 85, 247, 0.3);
  pointer-events: none;
  z-index: 1;
}

:deep(.reel-column:last-child)::after {
  display: none;
}

/* ----- Symbol Tiles: Space Glass ----- */
:deep(.symbol-tile) {
  background: linear-gradient(
    135deg,
    rgba(15, 5, 35, 0.8) 0%,
    rgba(20, 8, 50, 0.6) 40%,
    rgba(10, 3, 25, 0.8) 100%
  );
  border: 1px solid rgba(168, 85, 247, 0.08);
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

:deep(.symbol-tile)::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(168, 85, 247, 0.06) 45%,
    rgba(236, 72, 153, 0.04) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  background-position: var(--shimmer-x, -50%) 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

:deep(.symbol-tile:hover)::before {
  opacity: 1;
  animation: shimmer-slide 1.5s ease-in-out infinite;
}

:deep(.symbol-tile:hover) {
  border-color: rgba(168, 85, 247, 0.25);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.15);
}

@keyframes shimmer-slide {
  0% { --shimmer-x: -50%; }
  100% { --shimmer-x: 150%; }
}

/* Fallback shimmer without @property */
@supports not (background: paint(something)) {
  @keyframes shimmer-slide {
    0% { background-position: -50% 0; }
    100% { background-position: 150% 0; }
  }
}

/* ----- Win Highlight: Plasma Containment ----- */
:deep(.win-highlight) {
  border: 2px solid rgba(168, 85, 247, 0.8) !important;
  border-radius: 8px;
  box-shadow:
    0 0 10px rgba(168, 85, 247, 0.5),
    0 0 25px rgba(139, 92, 246, 0.3),
    0 0 50px rgba(88, 28, 135, 0.2),
    inset 0 0 15px rgba(168, 85, 247, 0.15);
  animation: plasma-pulse 1.2s ease-in-out infinite;
  background: radial-gradient(
    ellipse at center,
    rgba(168, 85, 247, 0.12) 0%,
    transparent 70%
  );
}

@keyframes plasma-pulse {
  0%, 100% {
    box-shadow:
      0 0 10px rgba(168, 85, 247, 0.5),
      0 0 25px rgba(139, 92, 246, 0.3),
      0 0 50px rgba(88, 28, 135, 0.2),
      inset 0 0 15px rgba(168, 85, 247, 0.15);
    border-color: rgba(168, 85, 247, 0.8);
  }
  50% {
    box-shadow:
      0 0 15px rgba(236, 72, 153, 0.6),
      0 0 35px rgba(168, 85, 247, 0.4),
      0 0 70px rgba(139, 92, 246, 0.25),
      inset 0 0 25px rgba(236, 72, 153, 0.2);
    border-color: rgba(236, 72, 153, 0.9);
  }
}

/* ----- Spin Button: Plasma Energy ----- */
:deep(.btn-spin) {
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.9) 0%,
    rgba(168, 85, 247, 0.8) 30%,
    rgba(236, 72, 153, 0.7) 70%,
    rgba(139, 92, 246, 0.9) 100%
  ) !important;
  border: none !important;
  border-radius: 14px !important;
  box-shadow:
    0 0 15px rgba(168, 85, 247, 0.4),
    0 0 30px rgba(139, 92, 246, 0.2),
    0 0 60px rgba(88, 28, 135, 0.15);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 700;
  overflow: visible;
  transition: all 0.3s ease;
  animation: spin-glow 2.5s ease-in-out infinite;
  z-index: 1;
}

:deep(.btn-spin)::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 16px;
  padding: 3px;
  background: conic-gradient(
    from var(--border-angle, 0deg),
    rgba(168, 85, 247, 1),
    rgba(236, 72, 153, 0.8),
    rgba(34, 211, 238, 0.7),
    rgba(168, 85, 247, 1)
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: -1;
  animation: rotate-border 3s linear infinite;
}

:deep(.btn-spin)::after {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 22px;
  pointer-events: none;
  z-index: -2;
  border: 1px solid rgba(168, 85, 247, 0.15);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.1);
  animation: energy-ring 2s ease-in-out infinite;
}

:deep(.btn-spin:hover) {
  transform: translateY(-1px);
  box-shadow:
    0 0 20px rgba(168, 85, 247, 0.6),
    0 0 45px rgba(139, 92, 246, 0.3),
    0 0 80px rgba(88, 28, 135, 0.2);
}

:deep(.btn-spin:active) {
  transform: translateY(1px) scale(0.98);
}

@keyframes spin-glow {
  0%, 100% {
    box-shadow:
      0 0 15px rgba(168, 85, 247, 0.4),
      0 0 30px rgba(139, 92, 246, 0.2),
      0 0 60px rgba(88, 28, 135, 0.15);
  }
  50% {
    box-shadow:
      0 0 20px rgba(236, 72, 153, 0.5),
      0 0 40px rgba(168, 85, 247, 0.3),
      0 0 70px rgba(139, 92, 246, 0.2);
  }
}

@keyframes energy-ring {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.06);
    opacity: 0.2;
  }
}

/* ----- Auto Button ----- */
:deep(.auto-btn) {
  border: 1px solid rgba(168, 85, 247, 0.3) !important;
  background: rgba(15, 5, 40, 0.6) !important;
  color: rgba(196, 181, 253, 0.8) !important;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

:deep(.auto-btn:hover) {
  border-color: rgba(168, 85, 247, 0.6) !important;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.2);
  color: rgba(224, 210, 255, 1) !important;
}

/* ----- Header & Title: Holographic ----- */
:deep(.game-title) {
  font-weight: 800;
  letter-spacing: 4px;
  text-transform: uppercase;
  background: linear-gradient(
    90deg,
    #c084fc,
    #e879f9,
    #67e8f9,
    #c084fc,
    #e879f9
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: holo-text 4s linear infinite;
  text-shadow: none;
  filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.4));
}

@keyframes holo-text {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

:deep(.game-header) {
  position: relative;
  z-index: 5;
}

:deep(.back-btn) {
  border: 1px solid rgba(168, 85, 247, 0.25) !important;
  background: rgba(10, 5, 30, 0.5) !important;
  transition: all 0.3s ease;
}

:deep(.back-btn:hover) {
  border-color: rgba(168, 85, 247, 0.5) !important;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.2);
}

/* ----- Jackpot Meter: Holographic Display ----- */
:deep(.jackpot-meter) {
  position: relative;
  border: 1px solid rgba(168, 85, 247, 0.35) !important;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(10, 5, 30, 0.8) 0%,
    rgba(20, 8, 50, 0.6) 50%,
    rgba(10, 5, 30, 0.8) 100%
  ) !important;
  box-shadow:
    0 0 15px rgba(168, 85, 247, 0.15),
    0 0 30px rgba(88, 28, 135, 0.08),
    inset 0 1px 0 rgba(168, 85, 247, 0.1);
  overflow: hidden;
}

:deep(.jackpot-meter)::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(168, 85, 247, 0.05) 25%,
    rgba(236, 72, 153, 0.05) 50%,
    rgba(34, 211, 238, 0.03) 75%,
    transparent 100%
  );
  background-size: 300% 100%;
  animation: jackpot-sweep 6s linear infinite;
  pointer-events: none;
}

@keyframes jackpot-sweep {
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}

/* ----- Win Result: Energy Burst ----- */
:deep(.win-result) {
  position: relative;
  text-shadow:
    0 0 10px rgba(168, 85, 247, 0.6),
    0 0 20px rgba(139, 92, 246, 0.4),
    0 0 40px rgba(88, 28, 135, 0.2);
  animation: win-pulse 1.5s ease-in-out infinite;
}

:deep(.win-result)::before {
  content: '';
  position: absolute;
  inset: -10px -20px;
  background: radial-gradient(
    ellipse at center,
    rgba(168, 85, 247, 0.12) 0%,
    rgba(139, 92, 246, 0.06) 40%,
    transparent 70%
  );
  border-radius: 12px;
  pointer-events: none;
  animation: win-burst 1.5s ease-in-out infinite;
}

@keyframes win-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

@keyframes win-burst {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* ----- Free Spins Badge ----- */
:deep(.free-spins-badge) {
  border: 1px solid rgba(168, 85, 247, 0.5) !important;
  background: linear-gradient(
    135deg,
    rgba(88, 28, 135, 0.6),
    rgba(139, 92, 246, 0.4)
  ) !important;
  box-shadow:
    0 0 15px rgba(168, 85, 247, 0.3),
    0 0 30px rgba(88, 28, 135, 0.15);
  animation: badge-glow 2s ease-in-out infinite;
}

@keyframes badge-glow {
  0%, 100% {
    box-shadow:
      0 0 15px rgba(168, 85, 247, 0.3),
      0 0 30px rgba(88, 28, 135, 0.15);
  }
  50% {
    box-shadow:
      0 0 20px rgba(236, 72, 153, 0.4),
      0 0 40px rgba(168, 85, 247, 0.25);
  }
}

/* ----- Controls Area ----- */
:deep(.controls) {
  position: relative;
  z-index: 5;
}

:deep(.bet-controls) {
  border: 1px solid rgba(168, 85, 247, 0.15) !important;
  background: rgba(10, 5, 30, 0.5) !important;
  border-radius: 10px;
}

/* ----- Reel Area ambient glow ----- */
:deep(.reel-area) {
  position: relative;
}

:deep(.reel-area)::before {
  content: '';
  position: absolute;
  inset: -30px;
  background: radial-gradient(
    ellipse at center,
    rgba(139, 92, 246, 0.06) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

/* ----- Game View container overrides ----- */
:deep(.game-view) {
  position: relative;
  z-index: 2;
}
</style>
