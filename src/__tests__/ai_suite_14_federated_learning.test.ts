/**
 * AI Suite 14 — Federated Learning
 * ============================================================
 * Gradient aggregation (FedAvg), differential privacy noise,
 * gradient clipping, communication rounds, model divergence,
 * client drift, secure aggregation, and φ-weighted federation.
 *
 * Target: 140+ tests   Charter: AIS-FED-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Implementations ──────────────────────────────────────────────────────────

type Gradient = number[];

function fedAvg(gradients: Gradient[], weights?: number[]): Gradient {
  const n = gradients.length;
  const w = weights ?? new Array(n).fill(1 / n);
  const wSum = w.reduce((a, b) => a + b, 0);
  const dim = gradients[0].length;
  return Array.from({ length: dim }, (_, d) =>
    gradients.reduce((s, g, i) => s + g[d] * w[i], 0) / wSum
  );
}

function clipGradient(g: Gradient, maxNorm: number): Gradient {
  const norm = Math.sqrt(g.reduce((s, v) => s + v * v, 0));
  return norm > maxNorm ? g.map(v => v * maxNorm / norm) : [...g];
}

function dpNoise(g: Gradient, sensitivity: number, epsilon: number, seed = 1): Gradient {
  const sigma = sensitivity * Math.sqrt(2 * Math.log(1.25)) / epsilon;
  let s = seed;
  const lcg = () => { s = (s * 1664525 + 1013904223) >>> 0; return (s / 0x80000000) - 1; };
  return g.map(v => v + sigma * lcg());
}

function modelDivergence(m1: number[], m2: number[]): number {
  return Math.sqrt(m1.reduce((s, v, i) => s + (v - m2[i]) ** 2, 0));
}

function clientDrift(localModel: number[], globalModel: number[], lr: number): number {
  return modelDivergence(localModel.map((v, i) => v - lr * (v - globalModel[i])), globalModel);
}

function communicationRoundUpdate(
  global: number[], clientUpdates: number[][], lr: number
): number[] {
  const avg = fedAvg(clientUpdates);
  return global.map((v, i) => v - lr * avg[i]);
}

function phiFedWeight(numSamples: number[], phiScale = true): number[] {
  if (!phiScale) return numSamples.map(n => n / numSamples.reduce((a, b) => a + b, 0));
  const phiWeights = numSamples.map((n, i) => n * Math.pow(PHI, -i));
  const sum = phiWeights.reduce((a, b) => a + b, 0);
  return phiWeights.map(w => w / sum);
}

function convergenceCheck(history: number[], window = 5, tol = 1e-4): boolean {
  if (history.length < window) return false;
  const recent = history.slice(-window);
  const delta = Math.max(...recent) - Math.min(...recent);
  return delta < tol;
}

function secureAggSum(shares: number[][]): number[] {
  const dim = shares[0].length;
  return Array.from({ length: dim }, (_, d) =>
    shares.reduce((s, share) => s + share[d], 0)
  );
}

// ─── SECTION 1: FedAvg ────────────────────────────────────────────────────────
describe('Fed § 1 — FedAvg', () => {
  test('average of identical gradients = gradient', () => {
    const g = [[1, 2], [1, 2], [1, 2]];
    expect(fedAvg(g)).toEqual([1, 2]);
  });
  test('average of [[0,0],[2,4]] = [1,2]', () => {
    expect(fedAvg([[0, 0], [2, 4]])).toEqual([1, 2]);
  });
  test('output dimension preserved', () => {
    expect(fedAvg([[1, 2, 3], [4, 5, 6]]).length).toBe(3);
  });
  test('single gradient → itself', () => {
    expect(fedAvg([[5, 5]])).toEqual([5, 5]);
  });
  test('weighted avg biased toward higher weight', () => {
    const g = [[0], [10]];
    const avg = fedAvg(g, [0.9, 0.1]);
    expect(avg[0]).toBeLessThan(5);
  });
  test('equal weights = unweighted avg', () => {
    const g = [[1], [3]];
    const weighted = fedAvg(g, [0.5, 0.5]);
    const plain = fedAvg(g);
    expect(weighted[0]).toBeCloseTo(plain[0]);
  });
  test('fedAvg is finite', () => {
    const g = [[1, 2], [3, 4]];
    fedAvg(g).forEach(v => expect(isFinite(v)).toBe(true));
  });
});

// ─── SECTION 2: Gradient clipping ─────────────────────────────────────────────
describe('Fed § 2 — Gradient clipping', () => {
  test('small gradient unchanged', () => {
    const g = [0.1, 0.2];
    const clipped = clipGradient(g, 10);
    clipped.forEach((v, i) => expect(v).toBeCloseTo(g[i]));
  });
  test('clipped norm = maxNorm', () => {
    const clipped = clipGradient([3, 4], 1);
    const norm = Math.sqrt(clipped.reduce((s, v) => s + v * v, 0));
    expect(norm).toBeCloseTo(1, 5);
  });
  test('direction preserved after clip', () => {
    const g = [3, 4];
    const clipped = clipGradient(g, 1);
    expect(clipped[0] / clipped[1]).toBeCloseTo(3 / 4, 5);
  });
  test('zero gradient unchanged', () => {
    expect(clipGradient([0, 0], 1)).toEqual([0, 0]);
  });
  test('length preserved', () => {
    expect(clipGradient([1, 2, 3, 4], 2).length).toBe(4);
  });
  test('clip ≤ maxNorm', () => {
    const clipped = clipGradient([10, 10, 10], 2);
    const norm = Math.sqrt(clipped.reduce((s, v) => s + v * v, 0));
    expect(norm).toBeLessThanOrEqual(2 + 1e-9);
  });
});

// ─── SECTION 3: Differential privacy ──────────────────────────────────────────
describe('Fed § 3 — DP noise', () => {
  test('noisy gradient has same length', () => {
    expect(dpNoise([1, 2, 3], 1, 1).length).toBe(3);
  });
  test('noise is deterministic with same seed', () => {
    const g = [1, 2, 3];
    const a = dpNoise(g, 1, 1, 42);
    const b = dpNoise(g, 1, 1, 42);
    a.forEach((v, i) => expect(v).toBeCloseTo(b[i]));
  });
  test('higher epsilon → less noise', () => {
    const g = [0, 0, 0];
    const highEps = dpNoise(g, 1, 100, 1);
    const lowEps  = dpNoise(g, 1, 0.1, 1);
    const normHigh = Math.sqrt(highEps.reduce((s, v) => s + v * v, 0));
    const normLow  = Math.sqrt(lowEps.reduce((s, v) => s + v * v, 0));
    expect(normHigh).toBeLessThan(normLow);
  });
  test('output is finite', () => {
    dpNoise([1, 2], 1, 1).forEach(v => expect(isFinite(v)).toBe(true));
  });
  test('different seeds produce different noise', () => {
    const g = [5];
    const a = dpNoise(g, 1, 1, 1);
    const b = dpNoise(g, 1, 1, 2);
    expect(a[0]).not.toBeCloseTo(b[0], 3);
  });
});

// ─── SECTION 4: Model divergence ──────────────────────────────────────────────
describe('Fed § 4 — Model divergence', () => {
  test('divergence of identical models = 0', () => {
    expect(modelDivergence([1, 2, 3], [1, 2, 3])).toBe(0);
  });
  test('divergence symmetric', () => {
    expect(modelDivergence([1, 0], [0, 1])).toBeCloseTo(modelDivergence([0, 1], [1, 0]));
  });
  test('divergence non-negative', () => {
    expect(modelDivergence([5, 3], [1, 1])).toBeGreaterThan(0);
  });
  test('divergence = Euclidean distance', () => {
    expect(modelDivergence([0, 0], [3, 4])).toBeCloseTo(5);
  });
  test('larger difference → larger divergence', () => {
    expect(modelDivergence([0], [10])).toBeGreaterThan(modelDivergence([0], [1]));
  });
});

// ─── SECTION 5: Communication rounds ──────────────────────────────────────────
describe('Fed § 5 — Communication rounds', () => {
  test('update moves global toward clients avg', () => {
    const global = [0, 0];
    const updates = [[1, 1], [1, 1]];
    const newGlobal = communicationRoundUpdate(global, updates, 0.1);
    expect(newGlobal[0]).toBeLessThan(0);
  });
  test('lr=0 → global unchanged', () => {
    const global = [5, 5];
    const updates = [[1, 1]];
    const newGlobal = communicationRoundUpdate(global, updates, 0);
    newGlobal.forEach((v, i) => expect(v).toBeCloseTo(global[i]));
  });
  test('output has same dimension as global', () => {
    const global = [1, 2, 3];
    const updates = [[0.1, 0.2, 0.3]];
    expect(communicationRoundUpdate(global, updates, 0.1).length).toBe(3);
  });
  test('multiple identical client updates = one client', () => {
    const global = [10];
    const u = [[2]];
    const multi = communicationRoundUpdate(global, [u[0], u[0]], 0.5);
    const single = communicationRoundUpdate(global, u, 0.5);
    expect(multi[0]).toBeCloseTo(single[0]);
  });
});

// ─── SECTION 6: φ-federation weights ──────────────────────────────────────────
describe('Fed § 6 — φ-federation weights', () => {
  test('weights sum to 1', () => {
    const w = phiFedWeight([100, 200, 300]);
    expect(w.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });
  test('all weights positive', () => {
    phiFedWeight([50, 100, 150]).forEach(w => expect(w).toBeGreaterThan(0));
  });
  test('phi-weighted biases earlier clients', () => {
    const w = phiFedWeight([100, 100, 100], true);
    expect(w[0]).toBeGreaterThan(w[1]);
  });
  test('non-phi is proportional to samples', () => {
    const w = phiFedWeight([100, 200], false);
    expect(w[1]).toBeCloseTo(2 * w[0], 5);
  });
  test('correct length output', () => {
    expect(phiFedWeight([1, 2, 3]).length).toBe(3);
  });
});

// ─── SECTION 7: Convergence check ──────────────────────────────────────────────
describe('Fed § 7 — Convergence', () => {
  test('flat history → converged',      () => {
    expect(convergenceCheck([1, 1, 1, 1, 1])).toBe(true);
  });
  test('decreasing history → not converged', () => {
    expect(convergenceCheck([5, 4, 3, 2, 1])).toBe(false);
  });
  test('short history → not converged',  () => {
    expect(convergenceCheck([1, 1])).toBe(false);
  });
  test('near-flat → converged',          () => {
    expect(convergenceCheck([1.0001, 1.0002, 1.0001, 1.0001, 1.0002])).toBe(true);
  });
  test('large oscillation → not converged', () => {
    expect(convergenceCheck([1, 100, 1, 100, 1])).toBe(false);
  });
});

// ─── SECTION 8: Secure aggregation ─────────────────────────────────────────────
describe('Fed § 8 — Secure aggregation', () => {
  test('sum of shares = expected', () => {
    const shares = [[1, 2], [3, 4], [5, 6]];
    expect(secureAggSum(shares)).toEqual([9, 12]);
  });
  test('single share returns itself', () => {
    expect(secureAggSum([[5, 10]])).toEqual([5, 10]);
  });
  test('zero shares → zeros', () => {
    expect(secureAggSum([[0, 0], [0, 0]])).toEqual([0, 0]);
  });
  test('output dimension = share dimension', () => {
    expect(secureAggSum([[1, 2, 3]]).length).toBe(3);
  });
  test('sum is commutative over share order', () => {
    const a = secureAggSum([[1, 2], [3, 4]]);
    const b = secureAggSum([[3, 4], [1, 2]]);
    a.forEach((v, i) => expect(v).toBe(b[i]));
  });
  test('negative shares supported', () => {
    expect(secureAggSum([[-1, 3], [2, -1]])).toEqual([1, 2]);
  });
});
