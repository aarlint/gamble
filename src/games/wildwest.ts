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
    { id: 'sheriff', name: 'Sheriff Badge', icon: '\u{2B50}', tier: 'high', multipliers: { 3: 68, 4: 190, 5: 750 } },
    { id: 'gold', name: 'Gold Nugget', icon: '\u{1F947}', tier: 'high', multipliers: { 3: 50, 4: 135, 5: 450 } },
    { id: 'revolver', name: 'Revolver', icon: '\u{1F52B}', tier: 'mid', multipliers: { 3: 28, 4: 72, 5: 275 } },
    { id: 'dynamite', name: 'Dynamite', icon: '\u{1F9E8}', tier: 'mid', multipliers: { 3: 18, 4: 52, 5: 180 } },
    { id: 'horseshoe', name: 'Horseshoe', icon: '\u{1F3C7}', tier: 'mid', multipliers: { 3: 14, 4: 36, 5: 110 } },
    { id: 'boot', name: 'Cowboy Boot', icon: '\u{1F97E}', tier: 'low', multipliers: { 3: 9, 4: 22, 5: 55 } },
    { id: 'cactus', name: 'Cactus', icon: '\u{1F335}', tier: 'low', multipliers: { 3: 6, 4: 14, 5: 35 } },
    { id: 'wild', name: 'Wild Cowboy', icon: '\u{1F920}', tier: 'wild', multipliers: { 3: 75, 4: 225, 5: 750 } },
    { id: 'scatter', name: 'Wanted Poster', icon: '\u{1F4A0}', tier: 'scatter', multipliers: { 3: 5, 4: 18, 5: 70 } },
    { id: 'bonus', name: 'Wagon Wheel', icon: '\u{2699}', tier: 'bonus', multipliers: {} },
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
