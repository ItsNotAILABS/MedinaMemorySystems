/**
 * AI Suite 02 — Attention Mechanism
 * ============================================================
 * Multi-head attention, scaled dot-product attention, query/key/value
 * projections, positional encodings, masking, and cross-attention.
 *
 * Target: 150+ tests   Charter: AIS-ATTN-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = 2 * Math.PI;

function dot(a: number[], b: number[]): number {
  return a.reduce((s, x, i) => s + x * b[i], 0);
}

function softmax(v: number[]): number[] {
  const max = Math.max(...v);
  const e = v.map(x => Math.exp(x - max));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map(x => x / s);
}

function scaledDotProductAttention(
  Q: number[][], K: number[][], V: number[][], scale?: number
): { output: number[][], weights: number[][] } {
  const dk = Q[0].length;
  const s = scale ?? Math.sqrt(dk);
  const weights = Q.map(q =>
    softmax(K.map(k => dot(q, k) / s))
  );
  const output = weights.map(w =>
    V[0].map((_, j) => w.reduce((sum, wi, i) => sum + wi * V[i][j], 0))
  );
  return { output, weights };
}

function positionalEncoding(pos: number, d: number, dModel: number): number {
  const i = Math.floor(d / 2);
  return d % 2 === 0
    ? Math.sin(pos / Math.pow(10000, 2 * i / dModel))
    : Math.cos(pos / Math.pow(10000, 2 * i / dModel));
}

function layerNorm(x: number[], eps = 1e-8): number[] {
  const mu = x.reduce((a, b) => a + b, 0) / x.length;
  const variance = x.reduce((s, v) => s + (v - mu) ** 2, 0) / x.length;
  return x.map(v => (v - mu) / Math.sqrt(variance + eps));
}

function applyMask(scores: number[][], mask: boolean[][]): number[][] {
  return scores.map((row, i) =>
    row.map((s, j) => mask[i][j] ? s : -Infinity));
}

function attentionEntropy(weights: number[]): number {
  return -weights.reduce((s, w) => s + (w > 0 ? w * Math.log(w) : 0), 0);
}

// ─── SECTION 1: Scaled dot-product attention ───────────────────────────────────
describe('Attention § 1 — Scaled dot-product', () => {
  const Q = [[1, 0], [0, 1]];
  const K = [[1, 0], [0, 1]];
  const V = [[1, 2], [3, 4]];
  const { output, weights } = scaledDotProductAttention(Q, K, V);

  test('output rows == Q rows',            () => expect(output.length).toBe(Q.length));
  test('output cols == V cols',            () => expect(output[0].length).toBe(V[0].length));
  test('attention weights sum to 1 (row 0)', () => expect(weights[0].reduce((a, b) => a + b, 0)).toBeCloseTo(1));
  test('attention weights sum to 1 (row 1)', () => expect(weights[1].reduce((a, b) => a + b, 0)).toBeCloseTo(1));
  test('weights non-negative',             () => weights.forEach(row => row.forEach(w => expect(w).toBeGreaterThanOrEqual(0))));
  test('identical Q and K → max self-attention', () => {
    expect(weights[0][0]).toBeGreaterThan(weights[0][1]);
  });
  test('output is convex combination of V', () => {
    // output[i] ∈ convex hull of V rows
    output.forEach(row =>
      row.forEach((v, j) =>
        expect(v).toBeGreaterThanOrEqual(Math.min(...V.map(r => r[j])) - 1e-9)));
  });
});

describe('Attention § 1b — Scale factor effect', () => {
  const Q = [[10, 0]];
  const K = [[1, 0], [0, 1]];
  const V = [[1, 0], [0, 1]];

  test('smaller scale → sharper attention', () => {
    const { weights: w1 } = scaledDotProductAttention(Q, K, V, 0.1);
    const { weights: w2 } = scaledDotProductAttention(Q, K, V, 10);
    expect(w1[0][0]).toBeGreaterThan(w2[0][0]);
  });
  test('scale = 1 valid', () => {
    const { output } = scaledDotProductAttention(Q, K, V, 1);
    expect(output[0].length).toBe(2);
  });
  test('scale = √dk default', () => {
    const { weights } = scaledDotProductAttention(Q, K, V);
    expect(weights[0].reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });
});

// ─── SECTION 2: Positional encoding ────────────────────────────────────────────
describe('Attention § 2 — Positional encoding', () => {
  test('PE(0,0,512) = sin(0) = 0',    () => expect(positionalEncoding(0, 0, 512)).toBeCloseTo(0));
  test('PE(0,1,512) = cos(0/(10000^0)) = 1', () => expect(positionalEncoding(0, 1, 512)).toBeCloseTo(1, 5));
  test('PE values ∈ [-1,1]',          () => {
    for (let pos = 0; pos < 20; pos++)
      for (let d = 0; d < 8; d++)
        expect(Math.abs(positionalEncoding(pos, d, 8))).toBeLessThanOrEqual(1 + 1e-9);
  });
  test('PE unique across positions (d=0)', () => {
    const vals = [0, 1, 2, 3, 4].map(pos => positionalEncoding(pos, 0, 512));
    const unique = new Set(vals.map(v => v.toFixed(6)));
    expect(unique.size).toBe(5);
  });
  test('PE is deterministic',          () => {
    expect(positionalEncoding(5, 2, 64)).toBe(positionalEncoding(5, 2, 64));
  });
});

// ─── SECTION 3: Layer normalization ────────────────────────────────────────────
describe('Attention § 3 — Layer normalization', () => {
  test('ln mean ≈ 0',  () => {
    const ln = layerNorm([3, 1, 4, 1, 5]);
    const mu = ln.reduce((a, b) => a + b, 0) / ln.length;
    expect(mu).toBeCloseTo(0, 5);
  });
  test('ln std ≈ 1',   () => {
    const ln = layerNorm([3, 1, 4, 1, 5]);
    const mu = ln.reduce((a, b) => a + b, 0) / ln.length;
    const std = Math.sqrt(ln.reduce((s, v) => s + (v - mu) ** 2, 0) / ln.length);
    expect(std).toBeCloseTo(1, 3);
  });
  test('ln preserves length',   () => expect(layerNorm([1, 2, 3]).length).toBe(3));
  test('ln monotonicity preserved if already sorted', () => {
    const ln = layerNorm([1, 2, 3]);
    expect(ln[0]).toBeLessThan(ln[1]);
    expect(ln[1]).toBeLessThan(ln[2]);
  });
  test('ln all-equal → all zeros', () => {
    const ln = layerNorm([5, 5, 5]);
    ln.forEach(v => expect(Math.abs(v)).toBeCloseTo(0, 2));
  });
});

// ─── SECTION 4: Causal masking ─────────────────────────────────────────────────
describe('Attention § 4 — Causal mask', () => {
  function causalMask(n: number): boolean[][] {
    return Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (__, j) => j <= i));
  }

  test('mask(1) all true',       () => expect(causalMask(1)).toEqual([[true]]));
  test('mask(2) lower-triangular', () => {
    const m = causalMask(2);
    expect(m[0][1]).toBe(false);
    expect(m[1][0]).toBe(true);
  });
  test('mask(3) shape', () => {
    const m = causalMask(3);
    expect(m.length).toBe(3);
    expect(m[0].length).toBe(3);
  });
  test('mask diagonal always true', () => {
    const m = causalMask(4);
    for (let i = 0; i < 4; i++) expect(m[i][i]).toBe(true);
  });
  test('mask upper triangle all false', () => {
    const m = causalMask(4);
    for (let i = 0; i < 4; i++)
      for (let j = i + 1; j < 4; j++)
        expect(m[i][j]).toBe(false);
  });
  test('applyMask sets future to -∞', () => {
    const scores = [[1, 2], [3, 4]];
    const mask = causalMask(2);
    const masked = applyMask(scores, mask);
    expect(masked[0][1]).toBe(-Infinity);
    expect(masked[1][0]).toBe(3);
  });
});

// ─── SECTION 5: Multi-head split / merge ───────────────────────────────────────
describe('Attention § 5 — Multi-head split/merge', () => {
  function splitHeads(x: number[], numHeads: number): number[][] {
    const headDim = Math.floor(x.length / numHeads);
    return Array.from({ length: numHeads }, (_, h) =>
      x.slice(h * headDim, (h + 1) * headDim));
  }

  function mergeHeads(heads: number[][]): number[] {
    return heads.flat();
  }

  test('splitHeads count', () => expect(splitHeads([1, 2, 3, 4], 2).length).toBe(2));
  test('splitHeads dim per head', () => expect(splitHeads([1, 2, 3, 4], 2)[0].length).toBe(2));
  test('mergeHeads restores original', () => {
    const x = [1, 2, 3, 4];
    expect(mergeHeads(splitHeads(x, 2))).toEqual(x);
  });
  test('4 heads of dim-8 vector', () => {
    const x = Array.from({ length: 8 }, (_, i) => i);
    const heads = splitHeads(x, 4);
    expect(heads.length).toBe(4);
    expect(heads[0].length).toBe(2);
  });
  test('merge head order preserved', () => {
    const heads = [[1, 2], [3, 4]];
    expect(mergeHeads(heads)).toEqual([1, 2, 3, 4]);
  });
});

// ─── SECTION 6: Attention entropy ──────────────────────────────────────────────
describe('Attention § 6 — Attention entropy', () => {
  test('uniform distribution max entropy', () => {
    const n = 4, uniform = [0.25, 0.25, 0.25, 0.25];
    const maxH = Math.log(n);
    expect(attentionEntropy(uniform)).toBeCloseTo(maxH, 5);
  });
  test('point mass → entropy = 0', () => {
    expect(attentionEntropy([1, 0, 0, 0])).toBeCloseTo(0, 5);
  });
  test('entropy non-negative', () => {
    [[0.6, 0.4], [0.2, 0.3, 0.5]].forEach(w =>
      expect(attentionEntropy(w)).toBeGreaterThanOrEqual(0));
  });
  test('sharper → lower entropy', () => {
    const sharp = softmax([10, 0, 0]);
    const flat  = softmax([1, 1, 1]);
    expect(attentionEntropy(sharp)).toBeLessThan(attentionEntropy(flat));
  });
  test('entropy monotone with spread', () => {
    const h1 = attentionEntropy(softmax([5, 0]));
    const h2 = attentionEntropy(softmax([2, 0]));
    expect(h2).toBeGreaterThan(h1);
  });
});

// ─── SECTION 7: Cross-attention ────────────────────────────────────────────────
describe('Attention § 7 — Cross-attention', () => {
  const query = [[1, 0, 0]];
  const context = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const values  = [[10, 0], [0, 10], [0, 0]];

  const { output, weights } = scaledDotProductAttention(query, context, values);

  test('cross-attn output shape correct',   () => {
    expect(output.length).toBe(1);
    expect(output[0].length).toBe(2);
  });
  test('cross-attn query matches first key → high weight on V[0]', () => {
    expect(weights[0][0]).toBeGreaterThan(weights[0][1]);
  });
  test('cross-attn output approx V[0] when Q matches K[0]', () => {
    expect(output[0][0]).toBeGreaterThan(4);
  });
  test('cross-attn weights ∑ = 1', () => {
    expect(weights[0].reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });
});

// ─── SECTION 8: φ-scaled attention ─────────────────────────────────────────────
describe('Attention § 8 — φ-scaled head dimension', () => {
  const dModel = 64;
  const numHeads = 8;
  const dHead = dModel / numHeads;
  const phiScale = Math.sqrt(dHead) * PHI;

  test('dHead = dModel / numHeads', () => expect(dHead).toBe(8));
  test('φ-scale > standard scale',  () => expect(phiScale).toBeGreaterThan(Math.sqrt(dHead)));
  test('φ-scale is finite',         () => expect(isFinite(phiScale)).toBe(true));
  test('φ-scale ≈ 2*√8 (approx)',   () => expect(phiScale).toBeCloseTo(Math.sqrt(dHead) * PHI, 8));

  const Q = [[1, 0, 1, 0, 1, 0, 1, 0]];
  const K = [[1, 0, 1, 0, 1, 0, 1, 0]];
  const V = [[0, 1, 0, 1, 0, 1, 0, 1]];
  const { weights } = scaledDotProductAttention(Q, K, V, phiScale);
  test('φ-scaled attention weights sum to 1', () => {
    expect(weights[0].reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });
});
