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
    { id: 'trident', name: 'Trident', icon: '\u{1F531}', tier: 'high', multipliers: { 3: 68, 4: 190, 5: 750 } },
    { id: 'pearl', name: 'Pearl', icon: '\u{1FADB}', tier: 'high', multipliers: { 3: 50, 4: 135, 5: 450 } },
    { id: 'seahorse', name: 'Seahorse', icon: '\u{1F40E}', tier: 'mid', multipliers: { 3: 28, 4: 72, 5: 275 } },
    { id: 'shell', name: 'Shell', icon: '\u{1F41A}', tier: 'mid', multipliers: { 3: 18, 4: 52, 5: 180 } },
    { id: 'coral', name: 'Coral', icon: '\u{1FAB8}', tier: 'mid', multipliers: { 3: 14, 4: 36, 5: 110 } },
    { id: 'fish', name: 'Fish', icon: '\u{1F420}', tier: 'low', multipliers: { 3: 9, 4: 22, 5: 55 } },
    { id: 'wave', name: 'Wave', icon: '\u{1F30A}', tier: 'low', multipliers: { 3: 6, 4: 14, 5: 35 } },
    { id: 'wild', name: 'Wild Octopus', icon: '\u{1F419}', tier: 'wild', multipliers: { 3: 75, 4: 225, 5: 750 } },
    { id: 'scatter', name: 'Treasure Chest', icon: '\u{1F4A0}', tier: 'scatter', multipliers: { 3: 5, 4: 18, 5: 70 } },
    { id: 'bonus', name: 'Clam', icon: '\u{1F9AA}', tier: 'bonus', multipliers: {} },
  ],
  reelWeights: [
    [3, 3, 8, 8, 8, 13, 13, 2, 1, 1],
    [3, 3, 8, 8, 8, 13, 13, 2, 1, 1],
    [2, 2, 8, 8, 8, 14, 14, 2, 1, 1],
    [2, 2, 7, 7, 8, 15, 15, 1, 1, 2],
    [1, 1, 6, 6, 8, 16, 16, 1, 2, 3],
  ],
  paylines: standardPaylines,
  freeSpinsScatterCount: 3,
  freeSpinsAwarded: 8,
  freeSpinMultiplier: 2,
  jackpotContribution: 0.005,
  bonusSymbolId: 'bonus',
  wildSymbolId: 'wild',
  scatterSymbolId: 'scatter',
  minBet: 0.2,
  maxBet: 20,
  betStep: 0.2,
}
