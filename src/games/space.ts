import type { GameConfig } from '@/types/slot'
import { standardPaylines } from './shared-paylines'

export const spaceConfig: GameConfig = {
  id: 'space',
  theme: {
    primaryColor: '#a855f7',
    secondaryColor: '#7c3aed',
    bgGradient: 'linear-gradient(180deg, #150a28 0%, #0a0a0f 50%, #150a28 100%)',
    particleType: 'stars',
    name: 'Space Nebula',
    slug: 'space',
  },
  symbols: [
    { id: 'galaxy', name: 'Galaxy', icon: '\u{1F30C}', tier: 'high', multipliers: { 3: 68, 4: 190, 5: 750 } },
    { id: 'planet', name: 'Planet', icon: '\u{1FA90}', tier: 'high', multipliers: { 3: 50, 4: 135, 5: 450 } },
    { id: 'rocket', name: 'Rocket', icon: '\u{1F680}', tier: 'mid', multipliers: { 3: 28, 4: 72, 5: 275 } },
    { id: 'ufo', name: 'UFO', icon: '\u{1F6F8}', tier: 'mid', multipliers: { 3: 18, 4: 52, 5: 180 } },
    { id: 'satellite', name: 'Satellite', icon: '\u{1F6F0}', tier: 'mid', multipliers: { 3: 14, 4: 36, 5: 110 } },
    { id: 'meteor', name: 'Meteor', icon: '\u{2604}', tier: 'low', multipliers: { 3: 9, 4: 22, 5: 55 } },
    { id: 'star', name: 'Star', icon: '\u{2B50}', tier: 'low', multipliers: { 3: 6, 4: 14, 5: 35 } },
    { id: 'wild', name: 'Wild Alien', icon: '\u{1F47E}', tier: 'wild', multipliers: { 3: 75, 4: 225, 5: 750 } },
    { id: 'scatter', name: 'Nebula', icon: '\u{1F4A0}', tier: 'scatter', multipliers: { 3: 5, 4: 18, 5: 70 } },
    { id: 'bonus', name: 'Black Hole', icon: '\u{1F573}', tier: 'bonus', multipliers: {} },
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
  freeSpinsAwarded: 6,
  freeSpinMultiplier: 2,
  jackpotContribution: 0.005,
  bonusSymbolId: 'bonus',
  wildSymbolId: 'wild',
  scatterSymbolId: 'scatter',
  minBet: 0.2,
  maxBet: 20,
  betStep: 0.2,
}
