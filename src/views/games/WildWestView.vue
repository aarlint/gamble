<script setup lang="ts">
import { onMounted, ref } from 'vue'
import GameView from '@/views/GameView.vue'
import WheelSpin from '@/components/bonus/WheelSpin.vue'
import { wildwestConfig } from '@/games/wildwest'

interface DustParticle {
  id: number
  left: string
  top: string
  delay: string
  duration: string
  size: string
  opacity: number
  color: string
}

const dustParticles = ref<DustParticle[]>([])

const dustColors = [
  'rgba(234, 88, 12, 0.35)',
  'rgba(217, 119, 6, 0.3)',
  'rgba(251, 191, 36, 0.25)',
  'rgba(180, 83, 9, 0.3)',
  'rgba(146, 64, 14, 0.25)',
  'rgba(255, 150, 50, 0.2)',
]

onMounted(() => {
  const particles: DustParticle[] = []
  for (let i = 0; i < 40; i++) {
    particles.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${3 + Math.random() * 6}s`,
      size: `${1.5 + Math.random() * 4}px`,
      opacity: 0.2 + Math.random() * 0.5,
      color: dustColors[Math.floor(Math.random() * dustColors.length)],
    })
  }
  dustParticles.value = particles
})
</script>

<template>
  <div class="wildwest-wrapper">
    <!-- Oil lamp glow overlays -->
    <div class="lamp-glow lamp-glow-left" aria-hidden="true" />
    <div class="lamp-glow lamp-glow-right" aria-hidden="true" />

    <!-- Vignette overlay -->
    <div class="vignette" aria-hidden="true" />

    <!-- Wood grain texture overlay -->
    <div class="wood-grain-overlay" aria-hidden="true" />

    <!-- Desert landscape silhouette -->
    <div class="desert-landscape" aria-hidden="true">
      <div class="mesa mesa-1" />
      <div class="mesa mesa-2" />
      <div class="mesa mesa-3" />
      <div class="cactus-silhouette cactus-1" />
      <div class="cactus-silhouette cactus-2" />
    </div>

    <!-- Dust particles -->
    <div class="dust-layer" aria-hidden="true">
      <div
        v-for="p in dustParticles"
        :key="p.id"
        class="dust-particle"
        :style="{
          left: p.left,
          top: p.top,
          animationDelay: p.delay,
          animationDuration: p.duration,
          width: p.size,
          height: p.size,
          background: p.color,
          opacity: p.opacity,
        }"
      />
    </div>

    <GameView :config="wildwestConfig">
      <template #bonus="{ show, bet, onComplete }">
        <WheelSpin :show="show" :bet="bet" :on-complete="onComplete" />
      </template>
    </GameView>
  </div>
</template>

<style scoped>
/* =============================================
   WILD WEST SALOON SLOT MACHINE
   Premium Western Saloon Theme
   ============================================= */

.wildwest-wrapper {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

/* ---- Wood Grain Texture Overlay ---- */
.wood-grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.06;
  background:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 11px,
      rgba(139, 90, 43, 0.4) 11px,
      rgba(139, 90, 43, 0.4) 12px
    ),
    repeating-linear-gradient(
      87deg,
      transparent,
      transparent 23px,
      rgba(101, 67, 33, 0.3) 23px,
      rgba(101, 67, 33, 0.3) 24px
    ),
    repeating-linear-gradient(
      92deg,
      transparent,
      transparent 37px,
      rgba(120, 53, 15, 0.2) 37px,
      rgba(120, 53, 15, 0.2) 38px
    );
}

/* ---- Oil Lamp Glow Effects ---- */
.lamp-glow {
  position: fixed;
  width: 300px;
  height: 500px;
  pointer-events: none;
  z-index: 0;
  border-radius: 50%;
  filter: blur(80px);
}

.lamp-glow-left {
  top: 10%;
  left: -100px;
  background: radial-gradient(ellipse, rgba(234, 88, 12, 0.2) 0%, rgba(217, 119, 6, 0.08) 50%, transparent 70%);
  animation: lampFlickerLeft 3s ease-in-out infinite;
}

.lamp-glow-right {
  top: 15%;
  right: -100px;
  background: radial-gradient(ellipse, rgba(251, 191, 36, 0.15) 0%, rgba(234, 88, 12, 0.06) 50%, transparent 70%);
  animation: lampFlickerRight 4s ease-in-out infinite;
}

/* ---- Vignette ---- */
.vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    ellipse at 50% 40%,
    transparent 40%,
    rgba(10, 5, 0, 0.3) 70%,
    rgba(10, 5, 0, 0.7) 100%
  );
}

/* ---- Desert Landscape Silhouette ---- */
.desert-landscape {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.15;
}

.mesa {
  position: absolute;
  bottom: 0;
  background: #1a0f08;
}

.mesa-1 {
  left: 0;
  width: 25%;
  height: 80px;
  clip-path: polygon(0 100%, 5% 40%, 12% 30%, 20% 30%, 28% 45%, 35% 100%);
}

.mesa-2 {
  left: 40%;
  width: 30%;
  height: 100px;
  clip-path: polygon(0 100%, 8% 50%, 15% 25%, 25% 20%, 35% 20%, 50% 25%, 60% 35%, 70% 50%, 80% 55%, 90% 60%, 100% 100%);
}

.mesa-3 {
  right: 0;
  width: 20%;
  height: 70px;
  clip-path: polygon(0 100%, 15% 55%, 30% 35%, 50% 30%, 70% 35%, 85% 50%, 100% 100%);
}

.cactus-silhouette {
  position: absolute;
  bottom: 0;
  background: #1a0f08;
}

.cactus-1 {
  left: 32%;
  width: 12px;
  height: 50px;
  clip-path: polygon(
    40% 100%, 40% 55%, 20% 55%, 20% 45%, 40% 45%, 40% 30%,
    30% 30%, 30% 20%, 40% 20%, 40% 0%, 60% 0%, 60% 20%,
    70% 20%, 70% 30%, 60% 30%, 60% 45%, 80% 45%, 80% 55%,
    60% 55%, 60% 100%
  );
}

.cactus-2 {
  right: 22%;
  width: 10px;
  height: 40px;
  clip-path: polygon(
    35% 100%, 35% 50%, 15% 50%, 15% 40%, 35% 40%, 35% 0%,
    65% 0%, 65% 35%, 85% 35%, 85% 45%, 65% 45%, 65% 100%
  );
}

/* ---- Dust Particles ---- */
.dust-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.dust-particle {
  position: absolute;
  border-radius: 50%;
  animation: particle-dust infinite ease-in-out;
  filter: blur(0.5px);
}

/* =============================================
   DEEP SELECTORS — Restyle GameView children
   ============================================= */

/* ---- Overall Game View ---- */
:deep(.game-view) {
  position: relative;
  z-index: 1;
}

/* ---- Header ---- */
:deep(.game-header) {
  position: relative;
}

:deep(.back-btn) {
  background: linear-gradient(145deg, rgba(120, 53, 15, 0.5), rgba(80, 35, 10, 0.6)) !important;
  border: 1px solid rgba(180, 120, 60, 0.3) !important;
  border-radius: 6px !important;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 200, 100, 0.1);
  transition: all 0.2s ease !important;
}

:deep(.back-btn:hover) {
  background: linear-gradient(145deg, rgba(140, 63, 18, 0.6), rgba(100, 45, 15, 0.7)) !important;
  box-shadow:
    0 2px 8px rgba(234, 88, 12, 0.3),
    inset 0 1px 0 rgba(255, 200, 100, 0.15);
}

:deep(.game-title) {
  font-size: 22px !important;
  font-weight: 900 !important;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #fbbf24 !important;
  text-shadow:
    0 0 10px rgba(234, 88, 12, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 0 30px rgba(217, 119, 6, 0.2);
  position: relative;
}

/* ---- Jackpot Meter — Brass Plate ---- */
:deep(.jackpot-meter) {
  background:
    linear-gradient(135deg,
      rgba(180, 140, 60, 0.2) 0%,
      rgba(120, 80, 20, 0.15) 30%,
      rgba(200, 160, 80, 0.2) 50%,
      rgba(120, 80, 20, 0.15) 70%,
      rgba(180, 140, 60, 0.2) 100%
    ) !important;
  border: 2px solid rgba(200, 164, 78, 0.4) !important;
  border-radius: 8px !important;
  position: relative;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 220, 120, 0.15),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

/* Brass rivet pseudo-elements on jackpot */
:deep(.jackpot-meter)::before,
:deep(.jackpot-meter)::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #e8c860, #8b6914);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.6),
    inset 0 1px 1px rgba(255, 255, 200, 0.4);
  top: 50%;
  transform: translateY(-50%);
}

:deep(.jackpot-meter)::before {
  left: 8px;
}

:deep(.jackpot-meter)::after {
  right: 8px;
}

/* ---- Reel Grid — Weathered Wood Frame ---- */
:deep(.reel-grid) {
  background:
    linear-gradient(180deg,
      rgba(60, 30, 10, 0.95) 0%,
      rgba(40, 20, 8, 0.98) 50%,
      rgba(55, 28, 10, 0.95) 100%
    ) !important;
  border: 3px solid rgba(120, 80, 30, 0.6) !important;
  border-radius: 12px !important;
  padding: 12px !important;
  position: relative;
  box-shadow:
    /* Outer dark shadow — depth */
    0 8px 32px rgba(0, 0, 0, 0.7),
    0 4px 12px rgba(0, 0, 0, 0.5),
    /* Warm glow from inside */
    0 0 40px rgba(234, 88, 12, 0.08),
    /* Inner shadow — cabinet depth */
    inset 0 3px 10px rgba(0, 0, 0, 0.6),
    inset 0 -2px 8px rgba(0, 0, 0, 0.4),
    inset 3px 0 10px rgba(0, 0, 0, 0.3),
    inset -3px 0 10px rgba(0, 0, 0, 0.3),
    /* Inner warm highlight on top edge */
    inset 0 1px 0 rgba(180, 120, 60, 0.2);
  /* Rope-like border effect via outline */
  outline: 2px dashed rgba(160, 110, 50, 0.35);
  outline-offset: 4px;
}

/* Corner brass rivets on reel frame */
:deep(.reel-grid)::before,
:deep(.reel-grid)::after {
  content: '';
  position: absolute;
  z-index: 5;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #f0d060, #9b7918, #6b4f0c);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.7),
    inset 0 1px 2px rgba(255, 255, 200, 0.5),
    0 0 6px rgba(200, 164, 78, 0.3);
}

:deep(.reel-grid)::before {
  top: 4px;
  left: 4px;
  /* Double stud: second one via box-shadow */
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.7),
    inset 0 1px 2px rgba(255, 255, 200, 0.5),
    0 0 6px rgba(200, 164, 78, 0.3),
    /* Bottom-left rivet */
    0 calc(100cqb - 22px) 4px rgba(0, 0, 0, 0.7);
}

:deep(.reel-grid)::after {
  top: 4px;
  right: 4px;
}

/* ---- Reel Columns — Dark Wood Dividers ---- */
:deep(.reel-column) {
  background:
    linear-gradient(180deg,
      rgba(45, 22, 8, 0.95) 0%,
      rgba(35, 18, 6, 1) 40%,
      rgba(50, 25, 10, 0.95) 100%
    ) !important;
  border: 1px solid rgba(100, 65, 25, 0.5) !important;
  border-radius: 6px !important;
  box-shadow:
    inset 0 2px 6px rgba(0, 0, 0, 0.5),
    inset 0 -1px 4px rgba(0, 0, 0, 0.3),
    0 0 1px rgba(120, 80, 30, 0.3);
  /* Subtle wood grain on columns */
  background-image:
    repeating-linear-gradient(
      180deg,
      transparent,
      transparent 8px,
      rgba(80, 50, 20, 0.15) 8px,
      rgba(80, 50, 20, 0.15) 9px
    ) !important;
}

/* ---- Symbol Tiles — Aged Parchment/Leather ---- */
:deep(.symbol-tile) {
  background:
    /* Subtle noise-like grain */
    radial-gradient(ellipse at 20% 30%, rgba(180, 140, 80, 0.08), transparent 60%),
    radial-gradient(ellipse at 80% 70%, rgba(160, 120, 60, 0.06), transparent 50%),
    /* Parchment base */
    linear-gradient(145deg,
      rgba(80, 50, 20, 0.6) 0%,
      rgba(60, 35, 12, 0.7) 40%,
      rgba(70, 42, 15, 0.65) 100%
    ) !important;
  border: 1px solid rgba(120, 80, 30, 0.4) !important;
  border-radius: 6px !important;
  box-shadow:
    inset 0 1px 0 rgba(200, 160, 80, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2),
    0 1px 3px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

/* ---- Win Highlight — Fire Glow ---- */
:deep(.win-highlight) {
  border: 2px solid #fbbf24 !important;
  border-radius: 8px !important;
  box-shadow:
    0 0 12px rgba(251, 191, 36, 0.6),
    0 0 24px rgba(234, 88, 12, 0.4),
    0 0 48px rgba(234, 88, 12, 0.2),
    inset 0 0 12px rgba(251, 191, 36, 0.15) !important;
  animation: fireGlow 0.8s ease-in-out infinite alternate !important;
}

:deep(.symbol-win) {
  transform: scale(1.05);
  z-index: 3;
}

/* ---- Spin Button — Brass/Copper Metallic ---- */
:deep(.btn-spin) {
  background:
    linear-gradient(180deg,
      #d4a040 0%,
      #b8860b 15%,
      #9b7018 40%,
      #7a5610 60%,
      #6b4a0c 80%,
      #8b6914 100%
    ) !important;
  color: #fff8e7 !important;
  border: 2px solid #c8a44e !important;
  border-radius: 10px !important;
  font-weight: 900 !important;
  font-size: 18px !important;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 0 10px rgba(234, 88, 12, 0.3);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 240, 180, 0.4),
    inset 0 -2px 0 rgba(0, 0, 0, 0.2),
    0 0 20px rgba(200, 164, 78, 0.15);
  transition: all 0.2s ease !important;
  position: relative;
  overflow: hidden;
}

/* Metallic sheen sweep on spin button */
:deep(.btn-spin)::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  animation: metallicSweep 3s ease-in-out infinite;
}

:deep(.btn-spin:hover:not(:disabled)) {
  background:
    linear-gradient(180deg,
      #e8b848 0%,
      #cc9a18 15%,
      #b08420 40%,
      #8b6914 60%,
      #7a5c0e 80%,
      #9b7918 100%
    ) !important;
  box-shadow:
    0 4px 16px rgba(234, 88, 12, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 240, 180, 0.5),
    inset 0 -2px 0 rgba(0, 0, 0, 0.2),
    0 0 30px rgba(234, 88, 12, 0.25) !important;
  transform: translateY(-1px);
}

:deep(.btn-spin:active:not(:disabled)) {
  transform: translateY(1px);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(200, 164, 78, 0.2) !important;
}

:deep(.btn-spin:disabled) {
  opacity: 0.5 !important;
  filter: saturate(0.5);
}

/* ---- Auto Button — Leather style ---- */
:deep(.auto-btn) {
  background:
    linear-gradient(145deg,
      rgba(80, 45, 15, 0.8),
      rgba(60, 30, 10, 0.9)
    ) !important;
  border: 1px solid rgba(140, 90, 40, 0.4) !important;
  color: #d4a040 !important;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(180, 120, 60, 0.15);
  transition: all 0.2s ease !important;
}

:deep(.auto-btn:hover:not(:disabled)) {
  border-color: rgba(200, 164, 78, 0.5) !important;
  color: #fbbf24 !important;
  box-shadow:
    0 2px 10px rgba(234, 88, 12, 0.2),
    inset 0 1px 0 rgba(180, 120, 60, 0.2);
}

:deep(.auto-btn.stop) {
  border-color: #dc2626 !important;
  color: #ef4444 !important;
  box-shadow:
    0 2px 8px rgba(220, 38, 38, 0.2),
    inset 0 1px 0 rgba(255, 100, 100, 0.1);
}

/* ---- Bet Controls ---- */
:deep(.bet-controls) {
  background:
    linear-gradient(145deg,
      rgba(60, 30, 10, 0.6),
      rgba(40, 20, 8, 0.7)
    );
  border: 1px solid rgba(120, 80, 30, 0.35);
  border-radius: 10px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(180, 120, 60, 0.08);
}

/* ---- Free Spins Badge ---- */
:deep(.free-spins-badge) {
  background: linear-gradient(135deg, rgba(234, 88, 12, 0.2), rgba(217, 119, 6, 0.1)) !important;
  border: 1px solid rgba(234, 88, 12, 0.4) !important;
  color: #fbbf24 !important;
  box-shadow:
    0 0 15px rgba(234, 88, 12, 0.15),
    inset 0 0 10px rgba(234, 88, 12, 0.05);
  animation: warmPulse 2s ease-in-out infinite;
}

/* ---- Win Result — Gold Nugget Theme ---- */
:deep(.win-result),
:deep(.win-banner) {
  background:
    linear-gradient(135deg,
      rgba(120, 80, 20, 0.9),
      rgba(80, 50, 12, 0.95),
      rgba(120, 80, 20, 0.9)
    ) !important;
  border: 2px solid #d4a040 !important;
  box-shadow:
    0 0 30px rgba(251, 191, 36, 0.3),
    0 0 60px rgba(234, 88, 12, 0.15),
    inset 0 1px 0 rgba(255, 220, 120, 0.3);
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}

/* ---- Controls Area ---- */
:deep(.controls) {
  position: relative;
}

/* =============================================
   KEYFRAME ANIMATIONS
   ============================================= */

@keyframes particle-dust {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
  15% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.4;
  }
  85% {
    opacity: 0.6;
  }
  100% {
    transform: translate(calc(-30px + 60px * var(--random, 0.5)), -80px) scale(0.3);
    opacity: 0;
  }
}

@keyframes fireGlow {
  0% {
    box-shadow:
      0 0 10px rgba(251, 191, 36, 0.5),
      0 0 20px rgba(234, 88, 12, 0.35),
      0 0 40px rgba(234, 88, 12, 0.15),
      inset 0 0 8px rgba(251, 191, 36, 0.1);
  }
  100% {
    box-shadow:
      0 0 16px rgba(251, 191, 36, 0.7),
      0 0 32px rgba(234, 88, 12, 0.5),
      0 0 56px rgba(234, 88, 12, 0.25),
      inset 0 0 16px rgba(251, 191, 36, 0.2);
  }
}

@keyframes lampFlickerLeft {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  20% {
    opacity: 0.6;
    transform: scale(0.95);
  }
  40% {
    opacity: 0.9;
    transform: scale(1.02);
  }
  60% {
    opacity: 0.5;
    transform: scale(0.93);
  }
  80% {
    opacity: 0.85;
    transform: scale(1.01);
  }
}

@keyframes lampFlickerRight {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  25% {
    opacity: 0.9;
    transform: scale(1.03);
  }
  50% {
    opacity: 0.55;
    transform: scale(0.94);
  }
  75% {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

@keyframes warmPulse {
  0%, 100% {
    box-shadow:
      0 0 10px rgba(234, 88, 12, 0.15),
      inset 0 0 8px rgba(234, 88, 12, 0.05);
  }
  50% {
    box-shadow:
      0 0 20px rgba(234, 88, 12, 0.25),
      inset 0 0 12px rgba(234, 88, 12, 0.1);
  }
}

@keyframes metallicSweep {
  0%, 70%, 100% {
    left: -100%;
  }
  85% {
    left: 150%;
  }
}
</style>
