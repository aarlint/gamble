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
    { id: 'pharaoh', name: 'Pharaoh', icon: '\u{1F451}', tier: 'high', multipliers: { 3: 68, 4: 190, 5: 750 } },
    { id: 'scarab', name: 'Scarab', icon: '\u{1FAB2}', tier: 'high', multipliers: { 3: 50, 4: 135, 5: 450 } },
    { id: 'ankh', name: 'Ankh', icon: '\u{2625}', tier: 'mid', multipliers: { 3: 28, 4: 72, 5: 275 } },
    { id: 'eye', name: 'Eye of Ra', icon: '\u{1F441}', tier: 'mid', multipliers: { 3: 18, 4: 52, 5: 180 } },
    { id: 'cobra', name: 'Cobra', icon: '\u{1F40D}', tier: 'mid', multipliers: { 3: 14, 4: 36, 5: 110 } },
    { id: 'jar', name: 'Canopic Jar', icon: '\u{1F3FA}', tier: 'low', multipliers: { 3: 9, 4: 22, 5: 55 } },
    { id: 'lotus', name: 'Lotus', icon: '\u{1F33A}', tier: 'low', multipliers: { 3: 6, 4: 14, 5: 35 } },
    { id: 'wild', name: 'Wild Sphinx', icon: '\u{1F981}', tier: 'wild', multipliers: { 3: 75, 4: 225, 5: 750 } },
    { id: 'scatter', name: 'Pyramid', icon: '\u{1F4A0}', tier: 'scatter', multipliers: { 3: 5, 4: 18, 5: 70 } },
    { id: 'bonus', name: 'Treasure', icon: '\u{1F4B0}', tier: 'bonus', multipliers: {} },
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
