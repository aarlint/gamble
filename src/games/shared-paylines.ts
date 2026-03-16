import type { Payline } from '@/types/slot'

// Standard 20-payline layout for 5x3 grid
export const standardPaylines: Payline[] = [
  { id: 1, positions: [1, 1, 1, 1, 1] },   // middle row
  { id: 2, positions: [0, 0, 0, 0, 0] },   // top row
  { id: 3, positions: [2, 2, 2, 2, 2] },   // bottom row
  { id: 4, positions: [0, 1, 2, 1, 0] },   // V shape
  { id: 5, positions: [2, 1, 0, 1, 2] },   // inverted V
  { id: 6, positions: [0, 0, 1, 2, 2] },   // descending diagonal
  { id: 7, positions: [2, 2, 1, 0, 0] },   // ascending diagonal
  { id: 8, positions: [1, 0, 0, 0, 1] },   // top bump
  { id: 9, positions: [1, 2, 2, 2, 1] },   // bottom bump
  { id: 10, positions: [0, 1, 1, 1, 0] },  // slight V
  { id: 11, positions: [2, 1, 1, 1, 2] },  // slight inverted V
  { id: 12, positions: [1, 0, 1, 0, 1] },  // zigzag up
  { id: 13, positions: [1, 2, 1, 2, 1] },  // zigzag down
  { id: 14, positions: [0, 0, 1, 0, 0] },  // top dip
  { id: 15, positions: [2, 2, 1, 2, 2] },  // bottom dip
  { id: 16, positions: [0, 1, 0, 1, 0] },  // wave top
  { id: 17, positions: [2, 1, 2, 1, 2] },  // wave bottom
  { id: 18, positions: [1, 0, 2, 0, 1] },  // diamond
  { id: 19, positions: [0, 2, 0, 2, 0] },  // big zigzag up
  { id: 20, positions: [2, 0, 2, 0, 2] },  // big zigzag down
]
