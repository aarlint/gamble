<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  amount: number
  visible: boolean
  themeColor?: string
}>()

const emit = defineEmits<{ dismiss: [] }>()

let timer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.visible,
  (v) => {
    if (v) {
      timer = setTimeout(() => emit('dismiss'), 2500)
    }
  }
)

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Transition name="win-banner">
    <div v-if="visible && amount > 0" class="win-banner" @click="emit('dismiss')">
      <div class="win-label">WIN</div>
      <div class="win-amount" :style="{ color: themeColor || 'var(--accent-gold)' }">
        ${{ amount.toFixed(2) }}
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.win-banner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(10, 10, 15, 0.85);
  z-index: 50;
  animation: win-banner-in 0.5s ease-out;
  cursor: pointer;
}

.win-label {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 6px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.win-amount {
  font-size: 48px;
  font-weight: 900;
  font-family: var(--font-mono);
  text-shadow: 0 0 30px currentColor;
}

.win-banner-enter-active { animation: win-banner-in 0.5s ease-out; }
.win-banner-leave-active { transition: opacity 0.3s; }
.win-banner-leave-to { opacity: 0; }
</style>
