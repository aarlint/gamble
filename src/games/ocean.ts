import type { GameConfig } from '@/types/slot'
import { standardPaylines } from './shared-paylines'

export const oceanConfig: GameConfig = {
  id: 'ocean',
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#1d4ed8',
    bgGradient: 'linear-gradient(180deg, #0a1628 0%, #0a0a0f 50%, #0a1628 100%)',
    particleType: 'bubbles',
    name: 'Deep Ocean',
    slug: 'ocean',
  },
  symbols: [
    { id: 'trident', name: 'Trident', icon: '\u{1F531}', tier: 'high', multipliers: { 3: 20, 4: 50, 5: 200 } },
    { id: 'pearl', name: 'Pearl', icon: '\u{1FADB}', tier: 'high', multipliers: { 3: 15, 4: 40, 5: 150 } },
    { id: 'seahorse', name: 'Seahorse', icon: '\u{1F40E}', tier: 'mid', multipliers: { 3: 8, 4: 20, 5: 60 } },
    { id: 'shell', name: 'Shell', icon: '\u{1F41A}', tier: 'mid', multipliers: { 3: 6, 4: 15, 5: 45 } },
    { id: 'coral', name: 'Coral', icon: '\u{1FAB8}', tier: 'mid', multipliers: { 3: 5, 4: 12, 5: 35 } },
    { id: 'fish', name: 'Fish', icon: '\u{1F420}', tier: 'low', multipliers: { 3: 3, 4: 8, 5: 20 } },
    { id: 'wave', name: 'Wave', icon: '\u{1F30A}', tier: 'low', multipliers: { 3: 2, 4: 5, 5: 15 } },
    { id: 'wild', name: 'Wild Octopus', icon: '\u{1F419}', tier: 'wild', multipliers: { 3: 25, 4: 60, 5: 250 } },
    { id: 'scatter', name: 'Treasure Chest', icon: '\u{1F4A0}', tier: 'scatter', multipliers: { 3: 5, 4: 20, 5: 100 } },
    { id: 'bonus', name: 'Clam', icon: '\u{1F9AA}', tier: 'bonus', multipliers: {} },
  ],
  reelWeights: [
    [3, 3, 8, 8, 8, 12, 12, 2, 2, 2],
    [3, 3, 8, 8, 8, 12, 12, 2, 2, 2],
    [2, 2, 7, 7, 8, 13, 13, 2, 3, 3],
    [2, 2, 7, 7, 8, 13, 13, 1, 3, 4],
    [1, 1, 6, 6, 8, 14, 14, 1, 4, 5],
  ],
  paylines: standardPaylines,
  freeSpinsScatterCount: 3,
  freeSpinsAwarded: 12,
  freeSpinMultiplier: 3,
  jackpotContribution: 0.01,
  bonusSymbolId: 'bonus',
  wildSymbolId: 'wild',
  scatterSymbolId: 'scatter',
  minBet: 0.2,
  maxBet: 20,
  betStep: 0.2,
}
