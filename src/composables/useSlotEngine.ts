import type { GameConfig, SlotSymbol, SpinResult, WinLine, ReelPosition } from '@/types/slot'

export function useSlotEngine(config: GameConfig) {
  const { symbols, reelWeights, paylines } = config

  const symbolMap = new Map<string, SlotSymbol>()
  for (const s of symbols) {
    symbolMap.set(s.id, s)
  }

  function resolveSymbol(id: string): SlotSymbol | undefined {
    return symbolMap.get(id)
  }

  function pickSymbol(reelIndex: number): string {
    const weights = reelWeights[reelIndex]
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    let rand = Math.random() * totalWeight
    for (let i = 0; i < weights.length; i++) {
      rand -= weights[i]
      if (rand <= 0) return symbols[i].id
    }
    return symbols[symbols.length - 1].id
  }

  function generateGrid(): string[][] {
    const grid: string[][] = []
    for (let reel = 0; reel < 5; reel++) {
      const column: string[] = []
      for (let row = 0; row < 3; row++) {
        column.push(pickSymbol(reel))
      }
      grid.push(column)
    }
    return grid
  }

  function evaluatePayline(
    grid: string[][],
    paylinePositions: number[],
    bet: number
  ): WinLine | null {
    const wild = config.wildSymbolId
    const lineSymbols: string[] = paylinePositions.map(
      (row, reel) => grid[reel][row]
    )

    // Find the leftmost non-wild symbol
    let baseSymbol: string | null = null
    for (const sid of lineSymbols) {
      if (sid !== wild) {
        baseSymbol = sid
        break
      }
    }

    // All wilds = treat as wild win
    if (!baseSymbol) baseSymbol = wild

    // Don't count scatter or bonus on paylines
    const sym = resolveSymbol(baseSymbol)
    if (!sym || sym.tier === 'scatter' || sym.tier === 'bonus') return null

    // Count consecutive matches from left
    let count = 0
    const positions: ReelPosition[] = []
    for (let reel = 0; reel < 5; reel++) {
      const sid = lineSymbols[reel]
      if (sid === baseSymbol || sid === wild) {
        count++
        positions.push({ reel, row: paylinePositions[reel] })
      } else {
        break
      }
    }

    if (count < 3) return null

    const multiplier = sym.multipliers[count]
    if (!multiplier) return null

    const lineBet = bet / paylines.length
    const payout = Math.round(lineBet * multiplier * 100) / 100

    return {
      paylineId: 0, // set by caller
      symbol: sym,
      count,
      payout,
      positions,
    }
  }

  function countSymbolOnGrid(grid: string[][], symbolId: string): number {
    let count = 0
    for (const reel of grid) {
      for (const sid of reel) {
        if (sid === symbolId) count++
      }
    }
    return count
  }

  function evaluateScatterWin(grid: string[][], bet: number): { count: number; payout: number } {
    const scatterId = config.scatterSymbolId
    const scatter = resolveSymbol(scatterId)
    const count = countSymbolOnGrid(grid, scatterId)
    let payout = 0
    if (scatter && count >= 3 && scatter.multipliers[count]) {
      payout = Math.round(bet * scatter.multipliers[count] * 100) / 100
    }
    return { count, payout }
  }

  function spin(bet: number): SpinResult {
    const grid = generateGrid()
    const winLines: WinLine[] = []
    let totalWin = 0

    // Evaluate all paylines
    for (const pl of paylines) {
      const win = evaluatePayline(grid, pl.positions as unknown as number[], bet)
      if (win) {
        win.paylineId = pl.id
        winLines.push(win)
        totalWin += win.payout
      }
    }

    // Evaluate scatter
    const scatterResult = evaluateScatterWin(grid, bet)
    totalWin += scatterResult.payout

    // Check bonus
    const bonusCount = countSymbolOnGrid(grid, config.bonusSymbolId)
    const bonusTriggered = bonusCount >= 3

    // Free spins
    const freeSpinsTriggered =
      scatterResult.count >= config.freeSpinsScatterCount

    totalWin = Math.round(totalWin * 100) / 100

    return {
      grid,
      winLines,
      totalWin,
      scatterCount: scatterResult.count,
      freeSpinsTriggered,
      bonusTriggered,
      jackpotWon: false, // handled by jackpot store
      jackpotAmount: 0,
    }
  }

  return { spin, resolveSymbol, generateGrid }
}
