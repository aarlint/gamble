import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { PotSize } from '@/types/slot'

interface SpinRecord {
  id: string
  gameId: string
  bet: number
  win: number
  net: number
  timestamp: number
}

const STORAGE_KEY = 'gamble-wallet'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export const useWalletStore = defineStore('wallet', () => {
  const saved = loadState()

  const sessionId = ref<string>(saved?.sessionId || '')
  const balance = ref<number>(saved?.balance ?? 0)
  const startingPot = ref<PotSize | null>(saved?.startingPot ?? null)
  const history = ref<SpinRecord[]>(saved?.history ?? [])
  const isActive = ref<boolean>(saved?.isActive ?? false)

  const totalWagered = computed(() =>
    history.value.reduce((sum, r) => sum + r.bet, 0)
  )
  const totalWon = computed(() =>
    history.value.reduce((sum, r) => sum + r.win, 0)
  )
  const netProfit = computed(() => totalWon.value - totalWagered.value)
  const biggestWin = computed(() =>
    history.value.reduce((max, r) => Math.max(max, r.win), 0)
  )
  const spinCount = computed(() => history.value.length)

  function persist() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sessionId: sessionId.value,
        balance: balance.value,
        startingPot: startingPot.value,
        history: history.value.slice(-500), // keep last 500
        isActive: isActive.value,
      })
    )
  }

  function startSession(pot: PotSize) {
    sessionId.value = uuidv4()
    balance.value = pot
    startingPot.value = pot
    history.value = []
    isActive.value = true
    persist()
  }

  function placeBet(amount: number): boolean {
    if (amount > balance.value || amount <= 0) return false
    balance.value = Math.round((balance.value - amount) * 100) / 100
    persist()
    return true
  }

  function addWinnings(amount: number, gameId: string, bet: number) {
    balance.value = Math.round((balance.value + amount) * 100) / 100
    history.value.push({
      id: uuidv4(),
      gameId,
      bet,
      win: amount,
      net: amount - bet,
      timestamp: Date.now(),
    })
    persist()
  }

  function recordLoss(gameId: string, bet: number) {
    history.value.push({
      id: uuidv4(),
      gameId,
      bet,
      win: 0,
      net: -bet,
      timestamp: Date.now(),
    })
    persist()
  }

  function resetSession() {
    sessionId.value = ''
    balance.value = 0
    startingPot.value = null
    history.value = []
    isActive.value = false
    persist()
  }

  function canAfford(amount: number): boolean {
    return balance.value >= amount
  }

  return {
    sessionId,
    balance,
    startingPot,
    history,
    isActive,
    totalWagered,
    totalWon,
    netProfit,
    biggestWin,
    spinCount,
    startSession,
    placeBet,
    addWinnings,
    recordLoss,
    resetSession,
    canAfford,
  }
})
