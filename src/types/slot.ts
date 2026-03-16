export interface SlotSymbol {
  id: string
  name: string
  icon: string // emoji or SVG path
  tier: 'high' | 'mid' | 'low' | 'wild' | 'scatter' | 'bonus'
  multipliers: Record<number, number> // count -> payout multiplier
}

export interface Payline {
  id: number
  positions: [number, number, number, number, number] // row index per reel (0-2)
}

export interface GameTheme {
  primaryColor: string
  secondaryColor: string
  bgGradient: string
  particleType: 'sand' | 'bubbles' | 'stars' | 'dust'
  name: string
  slug: string
}

export interface GameConfig {
  id: string
  theme: GameTheme
  symbols: SlotSymbol[]
  reelWeights: number[][] // per-reel symbol weight arrays (index matches symbols array)
  paylines: Payline[]
  freeSpinsScatterCount: number // how many scatters trigger free spins
  freeSpinsAwarded: number
  freeSpinMultiplier: number
  jackpotContribution: number // fraction of bet added to jackpot (e.g. 0.01)
  bonusSymbolId: string
  wildSymbolId: string
  scatterSymbolId: string
  minBet: number
  maxBet: number
  betStep: number
}

export interface ReelPosition {
  reel: number
  row: number
}

export interface WinLine {
  paylineId: number
  symbol: SlotSymbol
  count: number
  payout: number
  positions: ReelPosition[]
}

export interface SpinResult {
  grid: string[][] // 5 columns x 3 rows of symbol IDs
  winLines: WinLine[]
  totalWin: number
  scatterCount: number
  freeSpinsTriggered: boolean
  bonusTriggered: boolean
  jackpotWon: boolean
  jackpotAmount: number
}

export interface SlotEngineAPI {
  spin: (bet: number) => SpinResult
  getGrid: () => string[][]
  resolveSymbol: (id: string) => SlotSymbol | undefined
}

export type BonusGameType = 'treasure-map' | 'pick-a-prize' | 'shooting-stars' | 'wheel-spin'

export interface BonusResult {
  totalWin: number
  picks: number[]
}

export type PotSize = 20 | 100 | 500 | 1000
