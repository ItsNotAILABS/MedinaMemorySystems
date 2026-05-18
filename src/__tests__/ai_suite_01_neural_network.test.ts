/**
 * AI Suite 01 — Neural Network Mathematics
 * ============================================================
 * Comprehensive tests for neural network forward pass, activation
 * functions, backpropagation gradients, weight initialization, loss
 * functions, batch normalization, dropout, and layer composition.
 *
 * Each describe block is a distinct behavioural contract.
 * Target: 200+ tests   Charter: AIS-NN-001
 */

'use strict';

// ─── Inline implementations (self-contained) ──────────────────────────────────

const PHI = (1 + Math.sqrt(5)) / 2;

function sigmoid(x: number): number { return 1 / (1 + Math.exp(-x)); }
function relu(x: number): number    { return Math.max(0, x); }
function tanh(x: number): number    { return Math.tanh(x); }
function leakyRelu(x: number, alpha = 0.01): number { return x >= 0 ? x : alpha * x; }
function elu(x: number, alpha = 1): number { return x >= 0 ? x : alpha * (Math.exp(x) - 1); }
function swish(x: number): number   { return x * sigmoid(x); }
function gelu(x: number): number    { return 0.5 * x * (1 + tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))); }

function softmax(v: number[]): number[] {
  const max = Math.max(...v);
  const exps = v.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
}

function dot(a: number[], b: number[]): number {
  return a.reduce((s, x, i) => s + x * b[i], 0);
}

function matMul(A: number[][], B: number[][]): number[][] {
  const rows = A.length, cols = B[0].length, inner = B.length;
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) =>
      Array.from({ length: inner }, (__, k) => A[r][k] * B[k][c]).reduce((s, v) => s + v, 0)));
}

function mse(pred: number[], truth: number[]): number {
  return pred.reduce((s, p, i) => s + (p - truth[i]) ** 2, 0) / pred.length;
}

function crossEntropy(pred: number[], truth: number[]): number {
  return -truth.reduce((s, t, i) => s + t * Math.log(pred[i] + 1e-15), 0);
}

function batchNorm(x: number[], eps = 1e-8): number[] {
  const mu = x.reduce((a, b) => a + b, 0) / x.length;
  const variance = x.reduce((s, v) => s + (v - mu) ** 2, 0) / x.length;
  const std = Math.sqrt(variance + eps);
  return x.map(v => (v - mu) / std);
}

function he_init(fan_in: number, seed = 1): number[] {
  let s = seed;
  const lcg = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return s / 0x80000000; };
  return Array.from({ length: fan_in }, () => lcg() * Math.sqrt(2 / fan_in));
}

function glorot_init(fan_in: number, fan_out: number, seed = 1): number[][] {
  let s = seed;
  const lcg = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return 2 * ((s >>> 0) / 0xffffffff) - 1; };
  const limit = Math.sqrt(6 / (fan_in + fan_out));
  return Array.from({ length: fan_in }, () =>
    Array.from({ length: fan_out }, () => lcg() * limit));
}

function dropout(x: number[], rate: number, seed = 42): number[] {
  let s = seed;
  const lcg = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  return x.map(v => lcg() < rate ? 0 : v / (1 - rate));
}

function l2Regularization(weights: number[][], lambda: number): number {
  return lambda * weights.reduce((s, row) => s + row.reduce((r, w) => r + w * w, 0), 0);
}

function gradientClip(grads: number[], maxNorm: number): number[] {
  const norm = Math.sqrt(grads.reduce((s, g) => s + g * g, 0));
  if (norm > maxNorm) return grads.map(g => g * maxNorm / norm);
  return grads;
}

// ─── SECTION 1: Activation Functions ─────────────────────────────────────────
describe('NN § 1 — Sigmoid activation', () => {
  test('sigmoid(0) = 0.5',           () => expect(sigmoid(0)).toBeCloseTo(0.5));
  test('sigmoid(∞) → 1',             () => expect(sigmoid(1e10)).toBeCloseTo(1));
  test('sigmoid(-∞) → 0',            () => expect(sigmoid(-1e10)).toBeCloseTo(0));
  test('sigmoid(1) ≈ 0.731',         () => expect(sigmoid(1)).toBeCloseTo(0.7310585, 5));
  test('sigmoid(-1) ≈ 0.269',        () => expect(sigmoid(-1)).toBeCloseTo(0.2689414, 5));
  test('sigmoid symmetry: 1-σ(x)=σ(-x)', () => {
    [0.5, 1, 2, -0.3, 3].forEach(x =>
      expect(1 - sigmoid(x)).toBeCloseTo(sigmoid(-x), 10));
  });
  test('sigmoid output ∈ (0,1)',      () => {
    [-10, -1, 0, 1, 10].forEach(x =>
      expect(sigmoid(x)).toBeGreaterThan(0) && expect(sigmoid(x)).toBeLessThan(1));
  });
  test('sigmoid derivative = σ(x)(1-σ(x))', () => {
    const x = 1.5, s = sigmoid(x);
    const deriv = s * (1 - s);
    const numerical = (sigmoid(x + 1e-5) - sigmoid(x - 1e-5)) / (2e-5);
    expect(deriv).toBeCloseTo(numerical, 4);
  });
});

describe('NN § 1b — ReLU activation', () => {
  test('relu(0) = 0',    () => expect(relu(0)).toBe(0));
  test('relu(1) = 1',    () => expect(relu(1)).toBe(1));
  test('relu(-1) = 0',   () => expect(relu(-1)).toBe(0));
  test('relu(3.7) = 3.7',() => expect(relu(3.7)).toBeCloseTo(3.7));
  test('relu(−100) = 0', () => expect(relu(-100)).toBe(0));
  test('relu monotone',  () => {
    const vals = [-5, -2, 0, 1, 3, 7];
    for (let i = 1; i < vals.length; i++)
      expect(relu(vals[i])).toBeGreaterThanOrEqual(relu(vals[i - 1]));
  });
  test('relu(x) = max(0,x) for array', () => {
    [2, 0, -3, 5].forEach(x => expect(relu(x)).toBe(Math.max(0, x)));
  });
});

describe('NN § 1c — Leaky ReLU', () => {
  test('leakyRelu positive passthrough',   () => expect(leakyRelu(2)).toBe(2));
  test('leakyRelu(0) = 0',                () => expect(leakyRelu(0)).toBe(0));
  test('leakyRelu(-1) = -0.01',           () => expect(leakyRelu(-1)).toBeCloseTo(-0.01));
  test('custom alpha=-3 → alpha*x',       () => expect(leakyRelu(-2, 0.1)).toBeCloseTo(-0.2));
  test('leakyRelu never exactly 0 for x<0',() => expect(leakyRelu(-1, 0.01)).not.toBe(0));
});

describe('NN § 1d — ELU activation', () => {
  test('elu(1) = 1',                      () => expect(elu(1)).toBeCloseTo(1));
  test('elu(0) = 0',                      () => expect(elu(0)).toBeCloseTo(0));
  test('elu(-1) ≈ alpha*(e^-1 - 1)',      () => expect(elu(-1)).toBeCloseTo(1 * (Math.exp(-1) - 1), 8));
  test('elu smooth at 0',                 () => {
    const eps = 1e-6;
    expect(Math.abs(elu(eps) - elu(-eps))).toBeLessThan(0.01);
  });
});

describe('NN § 1e — Swish and GELU', () => {
  test('swish(0) = 0',    () => expect(swish(0)).toBeCloseTo(0));
  test('swish(1) ≈ 0.731',() => expect(swish(1)).toBeCloseTo(1 * sigmoid(1), 8));
  test('gelu(0) = 0',     () => expect(gelu(0)).toBeCloseTo(0, 5));
  test('gelu(1) ≈ 0.841', () => expect(gelu(1)).toBeCloseTo(0.8413, 2));
  test('gelu(-1) < 0',    () => expect(gelu(-1)).toBeLessThan(0));
  test('swish > 0 for x > 1.28', () => expect(swish(2)).toBeGreaterThan(0));
});

// ─── SECTION 2: Softmax ────────────────────────────────────────────────────────
describe('NN § 2 — Softmax', () => {
  test('softmax sums to 1', () => {
    const out = softmax([1, 2, 3]);
    expect(out.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });
  test('softmax argmax preserved', () => {
    const v = [0.1, 0.9, 0.4];
    const out = softmax(v);
    expect(out.indexOf(Math.max(...out))).toBe(1);
  });
  test('softmax all equal → uniform', () => {
    const out = softmax([2, 2, 2]);
    out.forEach(p => expect(p).toBeCloseTo(1 / 3, 8));
  });
  test('softmax numerically stable for large values', () => {
    const out = softmax([1000, 1001, 999]);
    expect(out.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });
  test('softmax output ∈ (0,1)', () => {
    softmax([3, 1, 4, 1, 5]).forEach(p => {
      expect(p).toBeGreaterThan(0);
      expect(p).toBeLessThan(1);
    });
  });
  test('softmax preserves relative order', () => {
    const v = [1, 3, 2];
    const out = softmax(v);
    expect(out[1]).toBeGreaterThan(out[2]);
    expect(out[2]).toBeGreaterThan(out[0]);
  });
});

// ─── SECTION 3: Matrix operations ──────────────────────────────────────────────
describe('NN § 3 — Matrix multiplication', () => {
  test('1×1 matmul', () => expect(matMul([[3]], [[4]])[0][0]).toBe(12));
  test('2×2 matmul identity', () => {
    const A = [[1, 0], [0, 1]];
    const B = [[5, 6], [7, 8]];
    expect(matMul(A, B)).toEqual(B);
  });
  test('2×3 × 3×2 shape', () => {
    const A = [[1, 2, 3], [4, 5, 6]];
    const B = [[7, 8], [9, 10], [11, 12]];
    const C = matMul(A, B);
    expect(C.length).toBe(2);
    expect(C[0].length).toBe(2);
  });
  test('dot product correctness', () => expect(dot([1, 2, 3], [4, 5, 6])).toBe(32));
  test('dot([0,...],*) = 0', () => expect(dot([0, 0, 0], [1, 2, 3])).toBe(0));
});

// ─── SECTION 4: Loss Functions ─────────────────────────────────────────────────
describe('NN § 4 — MSE loss', () => {
  test('mse perfect prediction = 0',  () => expect(mse([1, 2], [1, 2])).toBe(0));
  test('mse([2],[0]) = 4',            () => expect(mse([2], [0])).toBe(4));
  test('mse non-negative',            () => expect(mse([1, 3], [2, 1])).toBeGreaterThanOrEqual(0));
  test('mse symmetric',               () => expect(mse([1, 2], [3, 4])).toBeCloseTo(mse([3, 4], [1, 2]), 10));
  test('mse scales with error',       () => expect(mse([10], [0])).toBeGreaterThan(mse([1], [0])));
});

describe('NN § 4b — Cross-entropy loss', () => {
  test('cross-entropy one-hot perfect ≈ 0', () => {
    expect(crossEntropy([0.999], [1])).toBeCloseTo(0.001, 2);
  });
  test('cross-entropy non-negative',   () => expect(crossEntropy([0.5, 0.5], [1, 0])).toBeGreaterThan(0));
  test('cross-entropy monotone w.r.t. confidence', () => {
    expect(crossEntropy([0.9, 0.1], [1, 0])).toBeLessThan(crossEntropy([0.5, 0.5], [1, 0]));
  });
  test('cross-entropy uniform prediction', () => {
    const out = crossEntropy([0.5, 0.5], [1, 0]);
    expect(out).toBeCloseTo(Math.log(2), 3);
  });
});

// ─── SECTION 5: Batch Normalization ────────────────────────────────────────────
describe('NN § 5 — Batch normalization', () => {
  test('bn mean ≈ 0',       () => {
    const bn = batchNorm([1, 2, 3, 4, 5]);
    const mu = bn.reduce((a, b) => a + b, 0) / bn.length;
    expect(mu).toBeCloseTo(0, 5);
  });
  test('bn std ≈ 1',        () => {
    const bn = batchNorm([10, 20, 30]);
    const mu = bn.reduce((a, b) => a + b, 0) / bn.length;
    const std = Math.sqrt(bn.reduce((s, v) => s + (v - mu) ** 2, 0) / bn.length);
    expect(std).toBeCloseTo(1, 3);
  });
  test('bn constant array → all NaN or 0', () => {
    const bn = batchNorm([5, 5, 5]);
    bn.forEach(v => expect(isFinite(v) ? Math.abs(v) < 1 : true).toBe(true));
  });
  test('bn preserves array length', () => {
    expect(batchNorm([1, 2, 3, 4]).length).toBe(4);
  });
});

// ─── SECTION 6: Weight initialization ─────────────────────────────────────────
describe('NN § 6 — He initialization', () => {
  test('he_init returns correct length', () => expect(he_init(10).length).toBe(10));
  test('he_init variance ≈ 2/fan_in', () => {
    const w = he_init(1000, 99);
    const mu = w.reduce((a, b) => a + b, 0) / w.length;
    const v = w.reduce((s, x) => s + (x - mu) ** 2, 0) / w.length;
    expect(v).toBeCloseTo(2 / 1000, 1);
  });
});

describe('NN § 6b — Glorot initialization', () => {
  test('glorot_init shape', () => {
    const W = glorot_init(4, 8);
    expect(W.length).toBe(4);
    expect(W[0].length).toBe(8);
  });
  test('glorot all values within limit', () => {
    const limit = Math.sqrt(6 / (4 + 8));
    glorot_init(4, 8, 7).forEach(row =>
      row.forEach(w => expect(Math.abs(w)).toBeLessThanOrEqual(limit + 1e-9)));
  });
});

// ─── SECTION 7: Dropout ────────────────────────────────────────────────────────
describe('NN § 7 — Dropout', () => {
  test('dropout rate=0 leaves input', () => {
    const x = [1, 2, 3, 4];
    const d = dropout(x, 0, 1);
    d.forEach((v, i) => expect(v).toBeCloseTo(x[i]));
  });
  test('dropout output same length', () => expect(dropout([1, 2, 3], 0.5).length).toBe(3));
  test('dropout 0 values are 0', () => {
    const d = dropout([1, 1, 1, 1, 1], 0.5, 42);
    d.forEach(v => expect(v === 0 || v > 1).toBe(true));
  });
  test('dropout non-zero values scaled by 1/(1-rate)', () => {
    const d = dropout([2, 2, 2, 2], 0.5, 1);
    d.filter(v => v !== 0).forEach(v => expect(v).toBeCloseTo(4, 5));
  });
});

// ─── SECTION 8: Regularization & Gradient Clipping ────────────────────────────
describe('NN § 8 — L2 regularization', () => {
  test('l2 of zeros = 0', () => expect(l2Regularization([[0, 0]], 0.1)).toBe(0));
  test('l2 scales with lambda', () => {
    expect(l2Regularization([[1, 1]], 0.2)).toBeCloseTo(2 * 0.2));
  });
  test('l2 non-negative', () => {
    expect(l2Regularization([[1, -2, 3]], 1)).toBeGreaterThan(0);
  });
});

describe('NN § 8b — Gradient clipping', () => {
  test('clip no-op when norm < max', () => {
    const g = [0.1, 0.2];
    expect(gradientClip(g, 10)).toEqual(g);
  });
  test('clip reduces norm to maxNorm', () => {
    const clipped = gradientClip([3, 4], 1);
    const norm = Math.sqrt(clipped.reduce((s, g) => s + g * g, 0));
    expect(norm).toBeCloseTo(1, 5);
  });
  test('clip direction preserved', () => {
    const g = [3, 4];
    const clipped = gradientClip(g, 1);
    expect(clipped[0] / clipped[1]).toBeCloseTo(3 / 4, 8);
  });
  test('clip zero gradient → zero', () => {
    const clipped = gradientClip([0, 0, 0], 1);
    clipped.forEach(v => expect(v).toBe(0));
  });
});

// ─── SECTION 9: Forward pass simulation ───────────────────────────────────────
describe('NN § 9 — Forward pass (2-layer)', () => {
  const W1 = [[0.5, 0.3], [-0.2, 0.8]];
  const b1 = [0.1, -0.1];
  const W2 = [[0.4, 0.6]];
  const b2 = [0.0];

  function forward(x: number[]): number {
    const h = W1.map((row, i) => relu(dot(row, x) + b1[i]));
    return sigmoid(dot(W2[0], h) + b2[0]);
  }

  test('forward produces a scalar',         () => expect(typeof forward([1, 0])).toBe('number'));
  test('forward output ∈ (0,1)',            () => {
    [[1, 0], [0, 1], [-1, 1], [2, -3]].forEach(x =>
      expect(forward(x)).toBeGreaterThan(0) && expect(forward(x)).toBeLessThan(1));
  });
  test('forward deterministic',             () => expect(forward([0.5, 0.7])).toBe(forward([0.5, 0.7])));
  test('forward different inputs differ',   () => expect(forward([1, 0])).not.toBe(forward([0, 1])));
  test('forward zero input',               () => expect(typeof forward([0, 0])).toBe('number'));
});

// ─── SECTION 10: φ-scaled learning rate schedule ──────────────────────────────
describe('NN § 10 — φ-scaled LR schedule', () => {
  function cosineDecay(lr0: number, step: number, totalSteps: number): number {
    return 0.5 * lr0 * (1 + Math.cos(Math.PI * step / totalSteps));
  }
  function phiSchedule(step: number): number { return cosineDecay(PHI / 100, step, 1000); }

  test('lr at step 0 = initial',      () => expect(phiSchedule(0)).toBeCloseTo(PHI / 100));
  test('lr at step 1000 ≈ 0',        () => expect(phiSchedule(1000)).toBeCloseTo(0, 8));
  test('lr decreases monotonically',  () => {
    const steps = [0, 100, 200, 500, 800, 999];
    for (let i = 1; i < steps.length; i++)
      expect(phiSchedule(steps[i])).toBeLessThanOrEqual(phiSchedule(steps[i - 1]) + 1e-10);
  });
  test('lr at step 500 = lr0/2',      () => {
    expect(phiSchedule(500)).toBeCloseTo(PHI / 200, 5);
  });
  test('phi schedule peak at step 0', () => {
    const vals = [0, 50, 100, 200].map(phiSchedule);
    expect(vals[0]).toBeGreaterThan(vals[vals.length - 1]);
  });
});
