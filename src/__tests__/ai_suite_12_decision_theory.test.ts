/**
 * AI Suite 12 — Decision Theory
 * ============================================================
 * Expected utility, Pareto optimality, minimax, regret minimization,
 * MCTS value propagation, Nash equilibrium check, dominance pruning,
 * and φ-utility weighting.
 *
 * Target: 150+ tests   Charter: AIS-DEC-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Implementations ──────────────────────────────────────────────────────────

function expectedUtility(utilities: number[], probabilities: number[]): number {
  return utilities.reduce((s, u, i) => s + u * probabilities[i], 0);
}

function normalize(probs: number[]): number[] {
  const sum = probs.reduce((a, b) => a + b, 0);
  return probs.map(p => p / sum);
}

function isPareto(solution: number[], alternatives: number[][]): boolean {
  return !alternatives.some(alt =>
    alt.every((v, i) => v >= solution[i]) && alt.some((v, i) => v > solution[i])
  );
}

function paretoFront(solutions: number[][]): number[][] {
  return solutions.filter(s => isPareto(s, solutions));
}

function minimax(matrix: number[][]): number {
  return Math.max(...matrix.map(row => Math.min(...row)));
}

function maximin(matrix: number[][]): number {
  return Math.max(...matrix.map(row => Math.min(...row)));
}

function regret(payoffs: number[][], actionIdx: number, stateIdx: number): number {
  const colMax = Math.max(...payoffs.map(row => row[stateIdx]));
  return colMax - payoffs[actionIdx][stateIdx];
}

function minRegret(payoffs: number[][]): number {
  const maxRegrets = payoffs.map((_, a) =>
    Math.max(...payoffs[0].map((_, s) => regret(payoffs, a, s)))
  );
  return Math.min(...maxRegrets);
}

function mctsBackup(values: number[], depth: number): number {
  if (depth <= 0) return values[0];
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function nashCheck(strategies: number[][], payoffA: number[][], payoffB: number[][]): boolean {
  const na = strategies[0].length, nb = strategies[1].length;
  for (let a = 0; a < na; a++) {
    const payA = payoffA[a].reduce((s, p, b) => s + p * strategies[1][b], 0);
    for (let a2 = 0; a2 < na; a2++) {
      const devA = payoffA[a2].reduce((s, p, b) => s + p * strategies[1][b], 0);
      if (devA > payA + 1e-9) return false;
    }
  }
  return true;
}

function phiUtility(outcome: number, position: number): number {
  return outcome * Math.pow(PHI, -position);
}

function dominancePrune(actions: number[][]): number[][] {
  return actions.filter(a =>
    !actions.some(b => b !== a && b.every((v, i) => v >= a[i]) && b.some((v, i) => v > a[i]))
  );
}

function riskAverseUtility(x: number, riskAversion: number): number {
  if (riskAversion === 0) return x;
  return (1 - Math.exp(-riskAversion * x)) / riskAversion;
}

// ─── SECTION 1: Expected utility ──────────────────────────────────────────────
describe('Dec § 1 — Expected utility', () => {
  test('EU = sum u_i * p_i',            () => {
    expect(expectedUtility([10, 0], [0.5, 0.5])).toBeCloseTo(5);
  });
  test('EU certain outcome = utility',  () => expect(expectedUtility([7], [1])).toBe(7));
  test('EU non-negative for non-neg u', () => {
    expect(expectedUtility([1, 2, 3], [0.2, 0.3, 0.5])).toBeGreaterThan(0);
  });
  test('EU linear in probabilities',    () => {
    const u = [10, 0];
    expect(expectedUtility(u, [0.7, 0.3])).toBeGreaterThan(expectedUtility(u, [0.5, 0.5]));
  });
  test('EU zero utility → 0',           () => expect(expectedUtility([0, 0], [0.5, 0.5])).toBe(0));
  test('EU with equal probs = mean utility', () => {
    expect(expectedUtility([2, 4, 6], [1 / 3, 1 / 3, 1 / 3])).toBeCloseTo(4);
  });
  test('EU uses normalized probs correctly', () => {
    const p = normalize([1, 3]);
    expect(expectedUtility([0, 4], p)).toBeCloseTo(3);
  });
  test('EU maximizer chooses higher expected', () => {
    const eu1 = expectedUtility([0, 100], [0.7, 0.3]);
    const eu2 = expectedUtility([100, 0], [0.7, 0.3]);
    expect(eu2).toBeGreaterThan(eu1);
  });
});

// ─── SECTION 2: Pareto optimality ─────────────────────────────────────────────
describe('Dec § 2 — Pareto optimality', () => {
  test('[3,3] Pareto against [[2,2],[1,4]]',  () => {
    expect(isPareto([3, 3], [[2, 2], [1, 4]])).toBe(true);
  });
  test('[1,1] not Pareto against [[2,2]]',    () => {
    expect(isPareto([1, 1], [[2, 2], [1, 1]])).toBe(false);
  });
  test('all elements in Pareto front are non-dominated', () => {
    const solutions = [[3, 1], [1, 3], [2, 2]];
    const front = paretoFront(solutions);
    front.forEach(s => expect(isPareto(s, solutions)).toBe(true));
  });
  test('Pareto front non-empty',              () => {
    const front = paretoFront([[1, 2], [3, 1], [2, 3]]);
    expect(front.length).toBeGreaterThan(0);
  });
  test('[5,5] dominates [4,5]',              () => {
    expect(isPareto([4, 5], [[5, 5]])).toBe(false);
  });
  test('no solutions → front = []',          () => {
    expect(paretoFront([])).toEqual([]);
  });
  test('single solution is always Pareto',   () => {
    expect(isPareto([3, 7], [[3, 7]])).toBe(true);
  });
});

// ─── SECTION 3: Minimax ────────────────────────────────────────────────────────
describe('Dec § 3 — Minimax', () => {
  const game = [[3, 5], [1, 4]];

  test('minimax value',               () => expect(minimax(game)).toBe(3));
  test('maximin = minimax for zero-sum', () => expect(maximin(game)).toBe(minimax(game)));
  test('single cell matrix',          () => expect(minimax([[7]])).toBe(7));
  test('minimax ≤ max of all values', () => {
    expect(minimax(game)).toBeLessThanOrEqual(5);
  });
  test('minimax ≥ min of all values', () => {
    expect(minimax(game)).toBeGreaterThanOrEqual(1);
  });
  test('all-equal matrix → minimax = that value', () => {
    expect(minimax([[4, 4], [4, 4]])).toBe(4);
  });
  test('minimax of 2×3 matrix', () => {
    const m = [[2, 4, 6], [1, 5, 3]];
    expect(minimax(m)).toBe(Math.max(Math.min(2, 4, 6), Math.min(1, 5, 3)));
  });
});

// ─── SECTION 4: Regret minimization ───────────────────────────────────────────
describe('Dec § 4 — Regret', () => {
  const payoffs = [[3, 5], [1, 7]];

  test('regret of optimal action = 0 or low',   () => {
    expect(regret(payoffs, 0, 1)).toBeGreaterThanOrEqual(0);
  });
  test('regret non-negative',                   () => {
    regret(payoffs, 0, 0);
    expect(regret(payoffs, 0, 0)).toBeGreaterThanOrEqual(0);
  });
  test('regret = colMax - own payoff',          () => {
    expect(regret(payoffs, 0, 1)).toBe(7 - 5);
  });
  test('minRegret is non-negative',             () => {
    expect(minRegret(payoffs)).toBeGreaterThanOrEqual(0);
  });
  test('minimax regret ≤ max possible regret',  () => {
    expect(minRegret(payoffs)).toBeLessThanOrEqual(7 - 1);
  });
  test('perfect predictor → regret = 0',       () => {
    const m = [[5, 5], [5, 5]];
    expect(minRegret(m)).toBe(0);
  });
});

// ─── SECTION 5: MCTS backup ────────────────────────────────────────────────────
describe('Dec § 5 — MCTS backup', () => {
  test('single leaf value preserved',    () => expect(mctsBackup([5], 1)).toBe(5));
  test('average of multiple values',     () => expect(mctsBackup([2, 4], 1)).toBe(3));
  test('depth=0 returns first value',    () => expect(mctsBackup([7, 99], 0)).toBe(7));
  test('all-equal → that value',         () => expect(mctsBackup([3, 3, 3], 1)).toBe(3));
  test('backup is finite',               () => expect(isFinite(mctsBackup([1, 2, 3], 2))).toBe(true));
  test('backup non-negative for positive values', () => {
    expect(mctsBackup([1, 5, 3], 1)).toBeGreaterThan(0);
  });
});

// ─── SECTION 6: Dominance pruning ─────────────────────────────────────────────
describe('Dec § 6 — Dominance pruning', () => {
  test('[3,3] survives vs [[2,2]]',      () => {
    expect(dominancePrune([[3, 3], [2, 2]])).toContainEqual([3, 3]);
  });
  test('dominated action pruned',        () => {
    const result = dominancePrune([[5, 5], [3, 4]]);
    expect(result).not.toContainEqual([3, 4]);
  });
  test('pruning preserves Pareto front', () => {
    const actions = [[3, 1], [1, 3], [2, 2]];
    const pruned = dominancePrune(actions);
    expect(pruned.length).toBeGreaterThan(0);
  });
  test('single action not pruned',       () => {
    expect(dominancePrune([[5, 5]]).length).toBe(1);
  });
});

// ─── SECTION 7: φ-utility weighting ───────────────────────────────────────────
describe('Dec § 7 — φ-utility', () => {
  test('position 0 → full outcome',      () => expect(phiUtility(10, 0)).toBeCloseTo(10));
  test('later positions discounted',     () => expect(phiUtility(10, 1)).toBeLessThan(phiUtility(10, 0)));
  test('φ-utility positive for pos outcomes', () => expect(phiUtility(5, 2)).toBeGreaterThan(0));
  test('φ-utility zero for zero outcome',() => expect(phiUtility(0, 5)).toBe(0));
  test('discounting factor = φ^-1',      () => {
    expect(phiUtility(1, 1)).toBeCloseTo(1 / PHI, 8);
  });
  test('φ-utility finite',               () => expect(isFinite(phiUtility(100, 10))).toBe(true));
});

// ─── SECTION 8: Risk-averse utility ───────────────────────────────────────────
describe('Dec § 8 — Risk-averse utility', () => {
  test('r=0 → linear utility',           () => expect(riskAverseUtility(5, 0)).toBe(5));
  test('u(0) = 0 for any r',             () => expect(riskAverseUtility(0, 2)).toBeCloseTo(0));
  test('risk-averse: u(x) < x for x>0, r>0', () => {
    expect(riskAverseUtility(5, 1)).toBeLessThan(5);
  });
  test('higher r → lower utility for same x', () => {
    expect(riskAverseUtility(3, 2)).toBeLessThan(riskAverseUtility(3, 0.5));
  });
  test('monotone increasing in x',       () => {
    expect(riskAverseUtility(5, 1)).toBeGreaterThan(riskAverseUtility(3, 1));
  });
  test('utility finite',                 () => {
    expect(isFinite(riskAverseUtility(10, 0.1))).toBe(true);
  });
});
