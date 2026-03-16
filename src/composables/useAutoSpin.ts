import { ref } from 'vue'

export function useAutoSpin(onSpin: () => Promise<void> | void) {
  const isAutoSpinning = ref(false)
  const autoSpinCount = ref(0)
  const autoSpinRemaining = ref(0)
  let cancelled = false

  async function startAutoSpin(count: number) {
    isAutoSpinning.value = true
    autoSpinCount.value = count
    autoSpinRemaining.value = count
    cancelled = false

    for (let i = 0; i < count; i++) {
      if (cancelled) break
      autoSpinRemaining.value = count - i
      await onSpin()
      if (cancelled) break
      await new Promise((r) => setTimeout(r, 800))
    }

    stopAutoSpin()
  }

  function stopAutoSpin() {
    cancelled = true
    isAutoSpinning.value = false
    autoSpinRemaining.value = 0
  }

  return { isAutoSpinning, autoSpinRemaining, startAutoSpin, stopAutoSpin }
}
