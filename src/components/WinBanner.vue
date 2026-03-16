<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

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
      timer = setTimeout(() => emit('dismiss'), 3000)
    }
  }
)

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Transition name="win-result">
    <div v-if="visible && amount > 0" class="win-result" @click="emit('dismiss')">
      <span class="win-label">WIN</span>
      <span class="win-amount" :style="{ color: themeColor || 'var(--accent-gold)' }">
        ${{ amount.toFixed(2) }}
      </span>
    </div>
  </Transition>
</template>

<style scoped>
.win-result {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 20px;
  background: rgba(200, 164, 78, 0.08);
  border: 1px solid rgba(200, 164, 78, 0.25);
  border-radius: var(--radius-md);
  cursor: pointer;
  animation: win-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.win-label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 4px;
  color: var(--text-secondary);
}

.win-amount {
  font-size: 28px;
  font-weight: 900;
  font-family: var(--font-mono);
  text-shadow: 0 0 20px currentColor;
}

@keyframes win-pop {
  0% { transform: scale(0.8); opacity: 0; }
  60% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.win-result-enter-active { animation: win-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.win-result-leave-active { transition: opacity 0.25s, transform 0.25s; }
.win-result-leave-to { opacity: 0; transform: scale(0.95); }
</style>
