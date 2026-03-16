<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import WalletChip from '@/components/WalletChip.vue'
import JackpotMeter from '@/components/JackpotMeter.vue'
import { LogOut, Play } from 'lucide-vue-next'

const router = useRouter()
const wallet = useWalletStore()

const games = [
  {
    id: 'egyptian',
    name: 'Egyptian Pharaoh',
    desc: 'Ancient treasures await',
    color: '#c8a44e',
    colorAlt: '#8b6914',
    colorGlow: 'rgba(200, 164, 78, 0.4)',
    reelSymbols: ['\u{1F451}', '\u{1FAB2}', '\u{2625}', '\u{1F441}', '\u{1F40D}', '\u{1F3FA}', '\u{1F33A}', '\u{1F981}'],
    bgGradient: 'linear-gradient(145deg, #1a1408, #0d0a04, #1a1408)',
    borderGradient: 'linear-gradient(135deg, #c8a44e, #8b6914, #c8a44e, #e0c068, #c8a44e)',
    accentBg: 'radial-gradient(ellipse at 50% 0%, rgba(200,164,78,0.12) 0%, transparent 70%)',
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    desc: 'Dive for riches',
    color: '#3b82f6',
    colorAlt: '#1d4ed8',
    colorGlow: 'rgba(59, 130, 246, 0.4)',
    reelSymbols: ['\u{1F531}', '\u{1FADB}', '\u{1F41A}', '\u{1FAB8}', '\u{1F420}', '\u{1F30A}', '\u{1F419}', '\u{1F9AA}'],
    bgGradient: 'linear-gradient(145deg, #0a1628, #050d1a, #0a1628)',
    borderGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8, #06b6d4, #3b82f6)',
    accentBg: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)',
  },
  {
    id: 'space',
    name: 'Space Nebula',
    desc: 'Cosmic fortunes',
    color: '#a855f7',
    colorAlt: '#7c3aed',
    colorGlow: 'rgba(168, 85, 247, 0.4)',
    reelSymbols: ['\u{1F30C}', '\u{1FA90}', '\u{1F680}', '\u{1F6F8}', '\u{1F6F0}', '\u{2604}', '\u{2B50}', '\u{1F47E}'],
    bgGradient: 'linear-gradient(145deg, #150a28, #0a0518, #150a28)',
    borderGradient: 'linear-gradient(135deg, #a855f7, #7c3aed, #ec4899, #a855f7)',
    accentBg: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.12) 0%, transparent 70%)',
  },
  {
    id: 'wildwest',
    name: 'Wild West',
    desc: 'Gold rush fever',
    color: '#ea580c',
    colorAlt: '#c2410c',
    colorGlow: 'rgba(234, 88, 12, 0.4)',
    reelSymbols: ['\u{2B50}', '\u{1F947}', '\u{1F52B}', '\u{1F9E8}', '\u{1F3C7}', '\u{1F97E}', '\u{1F335}', '\u{1F920}'],
    bgGradient: 'linear-gradient(145deg, #1a0f08, #0d0804, #1a0f08)',
    borderGradient: 'linear-gradient(135deg, #ea580c, #c2410c, #d97706, #ea580c)',
    accentBg: 'radial-gradient(ellipse at 50% 0%, rgba(234,88,12,0.12) 0%, transparent 70%)',
  },
]

// Animate mini reels
const reelOffsets = ref<number[][]>(games.map(() => [0, 1, 2]))
let animInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  animInterval = setInterval(() => {
    reelOffsets.value = games.map((g) =>
      [0, 1, 2].map(() => Math.floor(Math.random() * g.reelSymbols.length))
    )
  }, 2000)
})

onUnmounted(() => {
  if (animInterval) clearInterval(animInterval)
})

function playGame(id: string) {
  router.push(`/game/${id}`)
}

function exitCasino() {
  wallet.resetSession()
  router.push('/')
}
</script>

<template>
  <div class="floor">
    <div class="floor-header">
      <div class="floor-top">
        <h1 class="floor-title">Casino Floor</h1>
        <div class="floor-actions">
          <WalletChip />
          <button class="exit-btn" @click="exitCasino">
            <LogOut :size="18" />
          </button>
        </div>
      </div>
      <JackpotMeter />
    </div>

    <div class="machine-grid">
      <button
        v-for="(game, gi) in games"
        :key="game.id"
        class="slot-machine"
        :style="{
          '--mc': game.color,
          '--mc-alt': game.colorAlt,
          '--mc-glow': game.colorGlow,
          '--mc-bg': game.bgGradient,
          '--mc-border': game.borderGradient,
          '--mc-accent': game.accentBg,
        }"
        @click="playGame(game.id)"
      >
        <!-- Top marquee -->
        <div class="machine-marquee">
          <div class="marquee-lights">
            <span v-for="n in 9" :key="n" class="light-dot" :style="{ animationDelay: n * 0.15 + 's' }" />
          </div>
          <span class="marquee-text">{{ game.name }}</span>
          <div class="marquee-lights bottom">
            <span v-for="n in 9" :key="n" class="light-dot" :style="{ animationDelay: (n * 0.15 + 0.08) + 's' }" />
          </div>
        </div>

        <!-- Mini reel preview -->
        <div class="machine-reels">
          <div class="mini-reel" v-for="r in 3" :key="r">
            <span class="mini-symbol" :key="reelOffsets[gi][r - 1]">
              {{ game.reelSymbols[reelOffsets[gi][r - 1]] }}
            </span>
          </div>
        </div>

        <!-- Machine body -->
        <div class="machine-body">
          <span class="machine-desc">{{ game.desc }}</span>
          <div class="play-badge">
            <Play :size="14" fill="currentColor" />
            <span>PLAY</span>
          </div>
        </div>

        <!-- Decorative elements -->
        <div class="machine-bezel" />
        <div class="machine-glow" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.floor {
  padding: 16px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: radial-gradient(ellipse at 50% 20%, rgba(200, 164, 78, 0.04) 0%, transparent 60%),
              var(--bg-primary);
}

.floor-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.floor-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.floor-title {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #f0f0f5, var(--accent-gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.floor-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.exit-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: all 0.15s;
}

.exit-btn:hover {
  color: var(--accent-red);
  border-color: var(--accent-red);
}

/* ── Machine Grid ── */
.machine-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* ── Slot Machine Cabinet ── */
.slot-machine {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  background: var(--mc-bg);
  border: 2px solid var(--mc);
  text-align: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 0 15px color-mix(in srgb, var(--mc) 20%, transparent),
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 color-mix(in srgb, var(--mc) 15%, transparent);
}

.slot-machine:hover {
  transform: translateY(-4px) scale(1.02);
  border-color: var(--mc);
  box-shadow:
    0 0 30px var(--mc-glow),
    0 0 60px color-mix(in srgb, var(--mc) 15%, transparent),
    0 12px 40px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 color-mix(in srgb, var(--mc) 25%, transparent);
}

.slot-machine:active {
  transform: translateY(-1px) scale(0.99);
}

/* ── Marquee (top banner with lights) ── */
.machine-marquee {
  position: relative;
  padding: 10px 8px 8px;
  background: var(--mc-accent);
}

.marquee-text {
  display: block;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--mc);
  text-shadow: 0 0 12px var(--mc-glow);
  padding: 4px 0;
}

.marquee-lights {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
}

.marquee-lights.bottom {
  margin-top: 2px;
}

.light-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--mc);
  box-shadow: 0 0 4px var(--mc-glow);
  animation: light-chase 1.4s ease-in-out infinite;
}

@keyframes light-chase {
  0%, 60%, 100% { opacity: 0.2; }
  30% { opacity: 1; }
}

/* ── Mini Reels ── */
.machine-reels {
  display: flex;
  gap: 3px;
  justify-content: center;
  padding: 8px 10px;
  margin: 0 10px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--mc) 20%, transparent);
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.6),
    0 1px 0 color-mix(in srgb, var(--mc) 10%, transparent);
}

.mini-reel {
  width: 36px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg,
    rgba(0, 0, 0, 0.3),
    rgba(255, 255, 255, 0.03),
    rgba(0, 0, 0, 0.3)
  );
  border-radius: 4px;
  border: 1px solid color-mix(in srgb, var(--mc) 15%, transparent);
}

.mini-symbol {
  font-size: 22px;
  line-height: 1;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 0 4px var(--mc-glow));
}

/* ── Machine Body ── */
.machine-body {
  padding: 8px 10px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.machine-desc {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}

.play-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 14px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--mc), var(--mc-alt));
  color: #0a0a0f;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  box-shadow:
    0 0 12px var(--mc-glow),
    0 2px 8px rgba(0, 0, 0, 0.4);
  transition: all 0.2s;
}

.slot-machine:hover .play-badge {
  box-shadow:
    0 0 20px var(--mc-glow),
    0 0 40px color-mix(in srgb, var(--mc) 30%, transparent),
    0 2px 8px rgba(0, 0, 0, 0.4);
}

/* ── Bezel (inner frame edge) ── */
.machine-bezel {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  border: 1px solid transparent;
  border-image: var(--mc-border) 1;
  pointer-events: none;
  opacity: 0.3;
}

/* ── Ambient Glow ── */
.machine-glow {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 60px;
  background: var(--mc);
  opacity: 0.06;
  filter: blur(25px);
  border-radius: 50%;
  pointer-events: none;
  transition: opacity 0.3s;
}

.slot-machine:hover .machine-glow {
  opacity: 0.12;
}

/* ── Responsive: single column on very narrow screens ── */
@media (max-width: 340px) {
  .machine-grid {
    grid-template-columns: 1fr;
  }
}
</style>
