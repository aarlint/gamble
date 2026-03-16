import type { GameConfig } from '@/types/slot'
import { standardPaylines } from './shared-paylines'

export const egyptianConfig: GameConfig = {
  id: 'egyptian',
  theme: {
    primaryColor: '#c8a44e',
    secondaryColor: '#8b6914',
    bgGradient: 'linear-gradient(180deg, #1a1408 0%, #0a0a0f 50%, #1a1408 100%)',
    particleType: 'sand',
    name: 'Egyptian Pharaoh',
    slug: 'egyptian',
  },
  symbols: [
    { id: 'pharaoh', name: 'Pharaoh', icon: '\u{1F451}', tier: 'high', multipliers: { 3: 20, 4: 50, 5: 200 } },
    { id: 'scarab', name: 'Scarab', icon: '\u{1FAB2}', tier: 'high', multipliers: { 3: 15, 4: 40, 5: 150 } },
    { id: 'ankh', name: 'Ankh', icon: '\u{2625}', tier: 'mid', multipliers: { 3: 8, 4: 20, 5: 60 } },
    { id: 'eye', name: 'Eye of Ra', icon: '\u{1F441}', tier: 'mid', multipliers: { 3: 6, 4: 15, 5: 45 } },
    { id: 'cobra', name: 'Cobra', icon: '\u{1F40D}', tier: 'mid', multipliers: { 3: 5, 4: 12, 5: 35 } },
    { id: 'jar', name: 'Canopic Jar', icon: '\u{1F3FA}', tier: 'low', multipliers: { 3: 3, 4: 8, 5: 20 } },
    { id: 'lotus', name: 'Lotus', icon: '\u{1F33A}', tier: 'low', multipliers: { 3: 2, 4: 5, 5: 15 } },
    { id: 'wild', name: 'Wild Sphinx', icon: '\u{1F981}', tier: 'wild', multipliers: { 3: 25, 4: 60, 5: 250 } },
    { id: 'scatter', name: 'Pyramid', icon: '\u{1F4A0}', tier: 'scatter', multipliers: { 3: 5, 4: 20, 5: 100 } },
    { id: 'bonus', name: 'Treasure', icon: '\u{1F4B0}', tier: 'bonus', multipliers: {} },
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
  freeSpinsAwarded: 10,
  freeSpinMultiplier: 2,
  jackpotContribution: 0.01,
  bonusSymbolId: 'bonus',
  wildSymbolId: 'wild',
  scatterSymbolId: 'scatter',
  minBet: 0.2,
  maxBet: 20,
  betStep: 0.2,
}
