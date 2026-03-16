import { defineStore } from 'pinia'
import { ref } from 'vue'

const JACKPOT_BASE = 5000
const STORAGE_KEY = 'gamble-jackpot'

export const useJackpotStore = defineStore('jackpot', () => {
  const amount = ref<number>(
    Number(localStorage.getItem(STORAGE_KEY)) || JACKPOT_BASE
  )
  let persistTimer: ReturnType<typeof setTimeout> | null = null

  function contribute(bet: number, rate: number) {
    amount.value = Math.round((amount.value + bet * rate) * 100) / 100
    debouncedPersist()
  }

  function checkWin(): boolean {
    // 1 in 50,000 chance per spin
    return Math.random() < 0.00002
  }

  function claimJackpot(): number {
    const won = amount.value
    amount.value = JACKPOT_BASE
    persistNow()
    syncToServer()
    return won
  }

  function debouncedPersist() {
    if (persistTimer) clearTimeout(persistTimer)
    persistTimer = setTimeout(() => {
      persistNow()
      syncToServer()
    }, 3000)
  }

  function persistNow() {
    localStorage.setItem(STORAGE_KEY, String(amount.value))
  }

  async function syncToServer() {
    try {
      await fetch('/api/jackpot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount.value }),
      })
    } catch {}
  }

  async function fetchFromServer() {
    try {
      const res = await fetch('/api/jackpot')
      if (res.ok) {
        const data = await res.json()
        if (data.amount > amount.value) {
          amount.value = data.amount
          persistNow()
        }
      }
    } catch {}
  }

  // Hydrate from server on init
  fetchFromServer()

  return { amount, contribute, checkWin, claimJackpot, fetchFromServer }
})
