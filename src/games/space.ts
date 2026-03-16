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
    { id: 'galaxy', name: 'Galaxy', icon: '\u{1F30C}', tier: 'high', multipliers: { 3: 20, 4: 50, 5: 200 } },
    { id: 'planet', name: 'Planet', icon: '\u{1FA90}', tier: 'high', multipliers: { 3: 15, 4: 40, 5: 150 } },
    { id: 'rocket', name: 'Rocket', icon: '\u{1F680}', tier: 'mid', multipliers: { 3: 8, 4: 20, 5: 60 } },
    { id: 'ufo', name: 'UFO', icon: '\u{1F6F8}', tier: 'mid', multipliers: { 3: 6, 4: 15, 5: 45 } },
    { id: 'satellite', name: 'Satellite', icon: '\u{1F6F0}', tier: 'mid', multipliers: { 3: 5, 4: 12, 5: 35 } },
    { id: 'meteor', name: 'Meteor', icon: '\u{2604}', tier: 'low', multipliers: { 3: 3, 4: 8, 5: 20 } },
    { id: 'star', name: 'Star', icon: '\u{2B50}', tier: 'low', multipliers: { 3: 2, 4: 5, 5: 15 } },
    { id: 'wild', name: 'Wild Alien', icon: '\u{1F47E}', tier: 'wild', multipliers: { 3: 25, 4: 60, 5: 250 } },
    { id: 'scatter', name: 'Nebula', icon: '\u{1F4A0}', tier: 'scatter', multipliers: { 3: 5, 4: 20, 5: 100 } },
    { id: 'bonus', name: 'Black Hole', icon: '\u{1F573}', tier: 'bonus', multipliers: {} },
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
  freeSpinsAwarded: 8,
  freeSpinMultiplier: 3,
  jackpotContribution: 0.01,
  bonusSymbolId: 'bonus',
  wildSymbolId: 'wild',
  scatterSymbolId: 'scatter',
  minBet: 0.2,
  maxBet: 20,
  betStep: 0.2,
}
