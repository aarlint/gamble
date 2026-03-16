import type { GameConfig } from '@/types/slot'
import { standardPaylines } from './shared-paylines'

export const wildwestConfig: GameConfig = {
  id: 'wildwest',
  theme: {
    primaryColor: '#ea580c',
    secondaryColor: '#c2410c',
    bgGradient: 'linear-gradient(180deg, #1a0f08 0%, #0a0a0f 50%, #1a0f08 100%)',
    particleType: 'dust',
    name: 'Wild West',
    slug: 'wildwest',
  },
  symbols: [
    { id: 'sheriff', name: 'Sheriff Badge', icon: '\u{2B50}', tier: 'high', multipliers: { 3: 20, 4: 50, 5: 200 } },
    { id: 'gold', name: 'Gold Nugget', icon: '\u{1F947}', tier: 'high', multipliers: { 3: 15, 4: 40, 5: 150 } },
    { id: 'revolver', name: 'Revolver', icon: '\u{1F52B}', tier: 'mid', multipliers: { 3: 8, 4: 20, 5: 60 } },
    { id: 'dynamite', name: 'Dynamite', icon: '\u{1F9E8}', tier: 'mid', multipliers: { 3: 6, 4: 15, 5: 45 } },
    { id: 'horseshoe', name: 'Horseshoe', icon: '\u{1F3C7}', tier: 'mid', multipliers: { 3: 5, 4: 12, 5: 35 } },
    { id: 'boot', name: 'Cowboy Boot', icon: '\u{1F97E}', tier: 'low', multipliers: { 3: 3, 4: 8, 5: 20 } },
    { id: 'cactus', name: 'Cactus', icon: '\u{1F335}', tier: 'low', multipliers: { 3: 2, 4: 5, 5: 15 } },
    { id: 'wild', name: 'Wild Cowboy', icon: '\u{1F920}', tier: 'wild', multipliers: { 3: 25, 4: 60, 5: 250 } },
    { id: 'scatter', name: 'Wanted Poster', icon: '\u{1F4A0}', tier: 'scatter', multipliers: { 3: 5, 4: 20, 5: 100 } },
    { id: 'bonus', name: 'Wagon Wheel', icon: '\u{2699}', tier: 'bonus', multipliers: {} },
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
