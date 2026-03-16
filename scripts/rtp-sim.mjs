// Monte Carlo RTP Simulation — PROPOSED NEW VALUES
// Run: node scripts/rtp-sim.mjs

const SIMS = 5_000_000;
const BET = 1.00;
const NUM_PAYLINES = 20;
const LINE_BET = BET / NUM_PAYLINES;

const WILD = 7, SCATTER = 8, BONUS = 9;

// NEW reel weights: reduced scatter/bonus, redistributed to lows
const weights = [
  [3, 3, 8, 8, 8, 13, 13, 2, 1, 1],  // reel 1: total=60
  [3, 3, 8, 8, 8, 13, 13, 2, 1, 1],  // reel 2: total=60
  [2, 2, 8, 8, 8, 14, 14, 2, 1, 1],  // reel 3: total=60
  [2, 2, 7, 7, 8, 15, 15, 1, 1, 2],  // reel 4: total=60
  [1, 1, 6, 6, 8, 16, 16, 1, 2, 3],  // reel 5: total=60
];

const mults = [
  {3:68, 4:190, 5:750},  // high1
  {3:50, 4:135, 5:450},  // high2
  {3:28, 4:72, 5:275},   // mid1
  {3:18, 4:52, 5:180},   // mid2
  {3:14, 4:36, 5:110},   // mid3
  {3:9, 4:22, 5:55},     // low1
  {3:6, 4:14, 5:35},     // low2
  {3:75, 4:225, 5:750},  // wild
  {3:5, 4:18, 5:70},     // scatter (on total bet)
];

const paylines = [
  [1,1,1,1,1],[0,0,0,0,0],[2,2,2,2,2],
  [0,1,2,1,0],[2,1,0,1,2],[0,0,1,2,2],
  [2,2,1,0,0],[1,0,0,0,1],[1,2,2,2,1],
  [0,1,1,1,0],[2,1,1,1,2],[1,0,1,0,1],
  [1,2,1,2,1],[0,0,1,0,0],[2,2,1,2,2],
  [0,1,0,1,0],[2,1,2,1,2],[1,0,2,0,1],
  [0,2,0,2,0],[2,0,2,0,2],
];

function pickSymbol(reelIndex) {
  const w = weights[reelIndex];
  let r = Math.random() * 60;
  for (let i = 0; i < w.length; i++) {
    r -= w[i];
    if (r <= 0) return i;
  }
  return w.length - 1;
}

function generateGrid() {
  const grid = [];
  for (let reel = 0; reel < 5; reel++) {
    grid.push([pickSymbol(reel), pickSymbol(reel), pickSymbol(reel)]);
  }
  return grid;
}

function evaluatePayline(grid, positions) {
  const lineSymbols = positions.map((row, reel) => grid[reel][row]);
  let base = null;
  for (const s of lineSymbols) {
    if (s !== WILD) { base = s; break; }
  }
  if (base === null) base = WILD;
  if (base === SCATTER || base === BONUS) return 0;

  let count = 0;
  for (let reel = 0; reel < 5; reel++) {
    if (lineSymbols[reel] === base || lineSymbols[reel] === WILD) count++;
    else break;
  }
  if (count < 3) return 0;
  const mult = mults[base]?.[count];
  return mult ? LINE_BET * mult : 0;
}

function countOnGrid(grid, sym) {
  let c = 0;
  for (const reel of grid) for (const s of reel) if (s === sym) c++;
  return c;
}

// Main simulation
let totalWagered = 0, totalBaseWin = 0, totalScatterWin = 0;
let freeSpinsTriggers = 0, bonusTriggers = 0;
let scatterCounts = {3:0,4:0,5:0};
let bonusCounts = {3:0,4:0,5:0};
let paylineHits = 0, totalPaylineWin = 0;

console.log(`Running ${(SIMS/1e6).toFixed(0)}M spin simulation with NEW values...`);
const start = Date.now();

for (let i = 0; i < SIMS; i++) {
  const grid = generateGrid();
  totalWagered += BET;

  for (const pl of paylines) {
    const win = evaluatePayline(grid, pl);
    if (win > 0) { totalBaseWin += win; totalPaylineWin += win; paylineHits++; }
  }

  const scCount = countOnGrid(grid, SCATTER);
  if (scCount >= 3) {
    const scMult = mults[SCATTER][scCount] || 0;
    totalScatterWin += BET * scMult;
    totalBaseWin += BET * scMult;
    freeSpinsTriggers++;
    scatterCounts[scCount] = (scatterCounts[scCount] || 0) + 1;
  }

  const bnCount = countOnGrid(grid, BONUS);
  if (bnCount >= 3) {
    bonusTriggers++;
    bonusCounts[bnCount] = (bonusCounts[bnCount] || 0) + 1;
  }
}

const elapsed = Date.now() - start;
console.log(`Completed in ${(elapsed/1000).toFixed(1)}s\n`);

console.log(`=== BASE GAME ===`);
console.log(`Payline RTP: ${(totalPaylineWin/totalWagered*100).toFixed(2)}%`);
console.log(`Scatter RTP: ${(totalScatterWin/totalWagered*100).toFixed(2)}%`);
console.log(`Base game RTP: ${(totalBaseWin/totalWagered*100).toFixed(2)}%`);
console.log(`Payline hit rate: ${(paylineHits/SIMS*100).toFixed(2)}%`);

console.log(`\n=== FREE SPINS ===`);
const fsRate = freeSpinsTriggers/SIMS;
console.log(`Trigger rate: 1 in ${Math.round(1/fsRate)} (${scatterCounts[3]}/${scatterCounts[4]}/${scatterCounts[5]})`);

console.log(`\n=== BONUS ===`);
const bnRate = bonusTriggers/SIMS;
console.log(`Trigger rate: 1 in ${Math.round(1/bnRate)} (${bonusCounts[3]}/${bonusCounts[4]}/${bonusCounts[5]})`);

// NEW bonus EVs
// Egyptian: pool=[1,1,1,2,2,3,3,4,5], pick 3. sum=22, mean=2.44, E[3 picks]=7.33
const egyBonusEV = 3 * (22/9);
// Ocean: 10 shells, 3 END, 7 prizes [1,1,2,2,3,3,5]. E[picks before END]≈1.75, avg=17/7=2.43 → 4.25x
const oceanBonusEV = (7/4) * (17/7);
// Space: pick 3 of 12, pool=[1,1,1,2,2,2,3,3,4,5,6,8], sum=38, mean=3.17. E[3]=9.5
const spaceBonusEV = 3 * (38/12);
// WildWest: segs=[2,3,2,5,2,3,5,10], weights=[30,18,28,8,28,18,8,2], total=140
const wwSegs = [2,3,2,5,2,3,5,10];
const wwWts = [30,18,28,8,28,18,8,2];
const wwTotal = wwWts.reduce((a,b)=>a+b,0);
const wwBonusEV = wwSegs.reduce((s,m,i)=>s+m*wwWts[i],0)/wwTotal;

console.log(`\nBonus EVs: Egy=${egyBonusEV.toFixed(2)}x, Ocean=${oceanBonusEV.toFixed(2)}x, Space=${spaceBonusEV.toFixed(2)}x, WW=${wwBonusEV.toFixed(2)}x`);

// NEW jackpot: base $500, 1 in 200000, 0.5% contribution
// Avg jackpot at win = 500 + 0.005 * 200000/2 * 1 = 500 + 500 = 1000
// RTP = 1/200000 * 1000 = 0.5%
const jackpotRTP = (1/200000) * 1000;

console.log(`\n=== JACKPOT ===`);
console.log(`Base: $500, rate: 1/200000, contribution: 0.5%, RTP: ${(jackpotRTP*100).toFixed(2)}%`);

console.log(`\n========================================`);
console.log(`=== TOTAL RTP BY GAME ===`);
console.log(`========================================`);

const baseRTP = totalBaseWin / totalWagered;
const paylineRTP = totalPaylineWin / totalWagered;

function gameRTP(name, fsSpins, fsMult, bonusEV) {
  const fsRTP = fsRate * fsSpins * fsMult * paylineRTP;
  const bRTP = bnRate * bonusEV;
  const total = baseRTP + fsRTP + bRTP + jackpotRTP;
  console.log(`\n${name}:`);
  console.log(`  Base: ${(baseRTP*100).toFixed(2)}% | FS: ${(fsRTP*100).toFixed(2)}% | Bonus: ${(bRTP*100).toFixed(2)}% | JP: ${(jackpotRTP*100).toFixed(2)}%`);
  console.log(`  TOTAL RTP: ${(total*100).toFixed(2)}% | House edge: ${((1-total)*100).toFixed(2)}%`);
  return total;
}

// NEW free spin values: reduced spins and multipliers
gameRTP('Egyptian Pharaoh', 8, 2, egyBonusEV);
gameRTP('Deep Ocean', 8, 2, oceanBonusEV);
gameRTP('Space Nebula', 6, 2, spaceBonusEV);
gameRTP('Wild West', 8, 2, wwBonusEV);

console.log(`\nDone.`);
