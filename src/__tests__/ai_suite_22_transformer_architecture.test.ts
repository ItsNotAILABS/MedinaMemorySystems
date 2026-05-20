/**
 * AI Suite 22 — Transformer Architecture
 * ============================================================
 * Self-attention, multi-head attention, positional encoding,
 * feed-forward networks, layer normalization, residual connections,
 * φ-coherent attention patterns, and transformer invariants.
 *
 * Target: 100 tests   Charter: AIS-TFM-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Core Types ───────────────────────────────────────────────────────────────

type Matrix = number[][];
type Vector = number[];

// ─── Implementations ──────────────────────────────────────────────────────────

function createMatrix(rows: number, cols: number, init: number = 0): Matrix {
  return Array(rows).fill(null).map(() => Array(cols).fill(init));
}

function matMul(a: Matrix, b: Matrix): Matrix {
  const rows = a.length;
  const cols = b[0]?.length || 0;
  const inner = b.length;
  const result = createMatrix(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let sum = 0;
      for (let k = 0; k < inner; k++) {
        sum += (a[i]?.[k] || 0) * (b[k]?.[j] || 0);
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function transpose(m: Matrix): Matrix {
  if (m.length === 0) return [];
  const rows = m.length;
  const cols = m[0].length;
  const result = createMatrix(cols, rows);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = m[i][j];
    }
  }
  return result;
}

function softmax(values: Vector): Vector {
  const maxVal = Math.max(...values);
  const exps = values.map(v => Math.exp(v - maxVal));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / (sum || 1));
}

function softmaxMatrix(m: Matrix): Matrix {
  return m.map(row => softmax(row));
}

function scaledDotProductAttention(Q: Matrix, K: Matrix, V: Matrix): Matrix {
  const dk = K[0]?.length || 1;
  const scale = Math.sqrt(dk);
  const KT = transpose(K);
  const scores = matMul(Q, KT).map(row => row.map(v => v / scale));
  const attnWeights = softmaxMatrix(scores);
  return matMul(attnWeights, V);
}

function positionalEncoding(seqLen: number, dModel: number): Matrix {
  const pe = createMatrix(seqLen, dModel);
  for (let pos = 0; pos < seqLen; pos++) {
    for (let i = 0; i < dModel; i++) {
      const angle = pos / Math.pow(10000, (2 * Math.floor(i / 2)) / dModel);
      pe[pos][i] = i % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
    }
  }
  return pe;
}

function addPositionalEncoding(embeddings: Matrix, pe: Matrix): Matrix {
  return embeddings.map((row, i) => row.map((v, j) => v + (pe[i]?.[j] || 0)));
}

function layerNorm(x: Vector, eps: number = 1e-6): Vector {
  const mean = x.reduce((a, b) => a + b, 0) / x.length;
  const variance = x.reduce((a, v) => a + (v - mean) ** 2, 0) / x.length;
  const std = Math.sqrt(variance + eps);
  return x.map(v => (v - mean) / std);
}

function layerNormMatrix(m: Matrix, eps: number = 1e-6): Matrix {
  return m.map(row => layerNorm(row, eps));
}

function relu(x: number): number {
  return Math.max(0, x);
}

function gelu(x: number): number {
  return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)));
}

function feedForward(x: Vector, w1: Matrix, w2: Matrix, activation: (x: number) => number = relu): Vector {
  // x -> w1 -> activation -> w2
  const hidden = w1.map(row => activation(row.reduce((s, w, i) => s + w * (x[i] || 0), 0)));
  return w2[0]?.map((_, j) => w2.reduce((s, row, i) => s + (row[j] || 0) * (hidden[i] || 0), 0)) || [];
}

function residualConnection(x: Vector, sublayer: Vector): Vector {
  return x.map((v, i) => v + (sublayer[i] || 0));
}

function multiHeadAttention(Q: Matrix, K: Matrix, V: Matrix, numHeads: number): Matrix {
  const dModel = Q[0]?.length || 0;
  const dHead = Math.floor(dModel / numHeads);
  const outputs: Matrix[] = [];
  
  for (let h = 0; h < numHeads; h++) {
    const start = h * dHead;
    const end = start + dHead;
    const Qh = Q.map(row => row.slice(start, end));
    const Kh = K.map(row => row.slice(start, end));
    const Vh = V.map(row => row.slice(start, end));
    outputs.push(scaledDotProductAttention(Qh, Kh, Vh));
  }
  
  // Concatenate heads
  return Q.map((_, i) => outputs.flatMap(o => o[i] || []));
}

function attentionMask(seqLen: number, causal: boolean = false): Matrix {
  const mask = createMatrix(seqLen, seqLen, 0);
  if (causal) {
    for (let i = 0; i < seqLen; i++) {
      for (let j = i + 1; j < seqLen; j++) {
        mask[i][j] = -Infinity;
      }
    }
  }
  return mask;
}

function applyMask(scores: Matrix, mask: Matrix): Matrix {
  return scores.map((row, i) => row.map((v, j) => v + (mask[i]?.[j] || 0)));
}

function dropout(x: Vector, rate: number, training: boolean = true): Vector {
  if (!training || rate === 0) return x;
  const scale = 1 / (1 - rate);
  return x.map(v => Math.random() > rate ? v * scale : 0);
}

function cosineSimilarity(a: Vector, b: Vector): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

function phiAttentionScore(position: number, totalLen: number): number {
  return Math.exp(-position / (totalLen * PHI));
}

function entropyOfDistribution(dist: Vector): number {
  return -dist.reduce((s, p) => p > 0 ? s + p * Math.log(p) : s, 0);
}

function crossEntropy(pred: Vector, target: Vector): number {
  return -target.reduce((s, t, i) => s + t * Math.log(pred[i] + 1e-10), 0);
}

// ─── SECTION 1: Matrix operations ─────────────────────────────────────────────
describe('TFM § 1 — Matrix operations', () => {
  test('createMatrix dimensions', () => {
    const m = createMatrix(3, 4);
    expect(m.length).toBe(3);
    expect(m[0].length).toBe(4);
  });
  test('createMatrix init value', () => {
    const m = createMatrix(2, 2, 5);
    expect(m[0][0]).toBe(5);
  });
  test('matMul identity', () => {
    const I = [[1, 0], [0, 1]];
    const A = [[1, 2], [3, 4]];
    expect(matMul(A, I)).toEqual(A);
  });
  test('matMul result dimensions', () => {
    const A = createMatrix(2, 3);
    const B = createMatrix(3, 4);
    const C = matMul(A, B);
    expect(C.length).toBe(2);
    expect(C[0].length).toBe(4);
  });
  test('transpose swaps dimensions', () => {
    const m = createMatrix(2, 3);
    const t = transpose(m);
    expect(t.length).toBe(3);
    expect(t[0].length).toBe(2);
  });
  test('transpose involutory', () => {
    const m = [[1, 2, 3], [4, 5, 6]];
    expect(transpose(transpose(m))).toEqual(m);
  });
  test('transpose empty matrix', () => {
    expect(transpose([])).toEqual([]);
  });
  test('matMul computation', () => {
    const A = [[1, 2], [3, 4]];
    const B = [[5, 6], [7, 8]];
    expect(matMul(A, B)).toEqual([[19, 22], [43, 50]]);
  });
});

// ─── SECTION 2: Softmax ───────────────────────────────────────────────────────
describe('TFM § 2 — Softmax', () => {
  test('softmax sums to 1', () => {
    const s = softmax([1, 2, 3]);
    expect(s.reduce((a, b) => a + b)).toBeCloseTo(1);
  });
  test('softmax all positive', () => {
    const s = softmax([-10, 0, 10]);
    expect(s.every(v => v >= 0)).toBe(true);
  });
  test('softmax max gets highest', () => {
    const s = softmax([1, 5, 2]);
    expect(s[1]).toBeGreaterThan(s[0]);
    expect(s[1]).toBeGreaterThan(s[2]);
  });
  test('softmax equal inputs → uniform', () => {
    const s = softmax([2, 2, 2]);
    expect(s[0]).toBeCloseTo(s[1]);
    expect(s[1]).toBeCloseTo(s[2]);
  });
  test('softmax numerical stability', () => {
    const s = softmax([1000, 1001, 1002]);
    expect(s.every(v => isFinite(v))).toBe(true);
  });
  test('softmaxMatrix row-wise', () => {
    const m = [[1, 2], [3, 4]];
    const s = softmaxMatrix(m);
    expect(s[0].reduce((a, b) => a + b)).toBeCloseTo(1);
    expect(s[1].reduce((a, b) => a + b)).toBeCloseTo(1);
  });
  test('softmax single element', () => {
    expect(softmax([5])).toEqual([1]);
  });
  test('softmax negative values', () => {
    const s = softmax([-1, -2, -3]);
    expect(s.reduce((a, b) => a + b)).toBeCloseTo(1);
  });
});

// ─── SECTION 3: Attention mechanism ───────────────────────────────────────────
describe('TFM § 3 — Attention', () => {
  test('scaledDotProductAttention output shape', () => {
    const Q = createMatrix(2, 4);
    const K = createMatrix(3, 4);
    const V = createMatrix(3, 4);
    const out = scaledDotProductAttention(Q, K, V);
    expect(out.length).toBe(2);
    expect(out[0].length).toBe(4);
  });
  test('attention with identity', () => {
    const Q = [[1, 0], [0, 1]];
    const K = [[1, 0], [0, 1]];
    const V = [[1, 2], [3, 4]];
    const out = scaledDotProductAttention(Q, K, V);
    expect(out.length).toBe(2);
  });
  test('attention preserves sequence length', () => {
    const seqLen = 5;
    const dModel = 8;
    const Q = createMatrix(seqLen, dModel);
    const K = createMatrix(seqLen, dModel);
    const V = createMatrix(seqLen, dModel);
    const out = scaledDotProductAttention(Q, K, V);
    expect(out.length).toBe(seqLen);
  });
  test('phiAttentionScore decays', () => {
    expect(phiAttentionScore(0, 10)).toBeGreaterThan(phiAttentionScore(5, 10));
  });
  test('phiAttentionScore at 0', () => {
    expect(phiAttentionScore(0, 10)).toBe(1);
  });
  test('phiAttentionScore uses phi', () => {
    const score = phiAttentionScore(10, 10);
    expect(score).toBeCloseTo(Math.exp(-1 / PHI));
  });
});

// ─── SECTION 4: Positional encoding ───────────────────────────────────────────
describe('TFM § 4 — Positional encoding', () => {
  test('PE shape matches input', () => {
    const pe = positionalEncoding(10, 64);
    expect(pe.length).toBe(10);
    expect(pe[0].length).toBe(64);
  });
  test('PE values bounded', () => {
    const pe = positionalEncoding(10, 8);
    const allBounded = pe.flat().every(v => v >= -1 && v <= 1);
    expect(allBounded).toBe(true);
  });
  test('PE first position', () => {
    const pe = positionalEncoding(5, 4);
    expect(pe[0][0]).toBeCloseTo(0); // sin(0) = 0
    expect(pe[0][1]).toBeCloseTo(1); // cos(0) = 1
  });
  test('addPositionalEncoding combines', () => {
    const emb = [[1, 2], [3, 4]];
    const pe = [[0.1, 0.2], [0.3, 0.4]];
    const result = addPositionalEncoding(emb, pe);
    expect(result[0][0]).toBeCloseTo(1.1);
    expect(result[1][1]).toBeCloseTo(4.4);
  });
  test('PE different positions differ', () => {
    const pe = positionalEncoding(3, 8);
    expect(pe[0]).not.toEqual(pe[1]);
    expect(pe[1]).not.toEqual(pe[2]);
  });
  test('PE deterministic', () => {
    const pe1 = positionalEncoding(5, 8);
    const pe2 = positionalEncoding(5, 8);
    expect(pe1).toEqual(pe2);
  });
});

// ─── SECTION 5: Layer normalization ───────────────────────────────────────────
describe('TFM § 5 — Layer normalization', () => {
  test('layerNorm zero mean', () => {
    const x = [1, 2, 3, 4, 5];
    const norm = layerNorm(x);
    const mean = norm.reduce((a, b) => a + b, 0) / norm.length;
    expect(mean).toBeCloseTo(0);
  });
  test('layerNorm unit variance', () => {
    const x = [1, 2, 3, 4, 5];
    const norm = layerNorm(x);
    const variance = norm.reduce((a, v) => a + v * v, 0) / norm.length;
    expect(variance).toBeCloseTo(1);
  });
  test('layerNorm constant input', () => {
    const x = [5, 5, 5, 5];
    const norm = layerNorm(x);
    expect(norm.every(v => Math.abs(v) < 1e-5)).toBe(true);
  });
  test('layerNormMatrix row-wise', () => {
    const m = [[1, 2, 3], [4, 5, 6]];
    const norm = layerNormMatrix(m);
    expect(norm.length).toBe(2);
    expect(norm[0].length).toBe(3);
  });
  test('layerNorm preserves length', () => {
    const x = [1, 2, 3, 4, 5, 6];
    expect(layerNorm(x).length).toBe(6);
  });
  test('layerNorm with epsilon', () => {
    const x = [0, 0, 0];
    expect(() => layerNorm(x, 1e-6)).not.toThrow();
  });
});

// ─── SECTION 6: Activation functions ──────────────────────────────────────────
describe('TFM § 6 — Activations', () => {
  test('relu positive', () => expect(relu(5)).toBe(5));
  test('relu negative', () => expect(relu(-5)).toBe(0));
  test('relu zero', () => expect(relu(0)).toBe(0));
  test('gelu(0) ≈ 0', () => expect(gelu(0)).toBeCloseTo(0));
  test('gelu positive', () => expect(gelu(2)).toBeGreaterThan(0));
  test('gelu negative small', () => expect(gelu(-2)).toBeLessThan(0));
  test('gelu approximates relu for large positive', () => {
    expect(gelu(10)).toBeCloseTo(10, 0);
  });
  test('gelu smoother than relu at 0', () => {
    const geluSlope = (gelu(0.01) - gelu(-0.01)) / 0.02;
    expect(geluSlope).toBeGreaterThan(0);
    expect(geluSlope).toBeLessThan(1);
  });
});

// ─── SECTION 7: Feed-forward network ──────────────────────────────────────────
describe('TFM § 7 — Feed-forward', () => {
  test('feedForward output dimension', () => {
    const x = [1, 2];
    const w1 = [[0.5, 0.5], [0.5, 0.5], [0.5, 0.5]]; // 2->3
    const w2 = [[1, 1, 1], [1, 1, 1]]; // 3->3 (w2[0].length = 3)
    const out = feedForward(x, w1, w2);
    expect(out.length).toBe(3); // Output dim = w2[0].length
  });
  test('feedForward with relu', () => {
    const x = [1, -1];
    const w1 = [[1, 0], [0, 1]];
    const w2 = [[1], [1]]; // 2 hidden -> 1 output
    const out = feedForward(x, w1, w2, relu);
    expect(out[0]).toBeGreaterThanOrEqual(0);
  });
  test('feedForward zero input', () => {
    const x = [0, 0];
    const w1 = [[1, 1], [1, 1]];
    const w2 = [[1], [1]]; // 2 hidden -> 1 output
    const out = feedForward(x, w1, w2);
    expect(out).toEqual([0]);
  });
  test('feedForward with gelu', () => {
    const x = [1, 2];
    const w1 = [[1, 0], [0, 1]];
    const w2 = [[1], [1]]; // 2 hidden -> 1 output
    const out = feedForward(x, w1, w2, gelu);
    expect(out.length).toBe(1);
  });
});

// ─── SECTION 8: Residual connections ──────────────────────────────────────────
describe('TFM § 8 — Residual connections', () => {
  test('residual adds vectors', () => {
    const x = [1, 2, 3];
    const sub = [0.1, 0.2, 0.3];
    const res = residualConnection(x, sub);
    expect(res).toEqual([1.1, 2.2, 3.3]);
  });
  test('residual preserves length', () => {
    const x = [1, 2, 3, 4];
    const sub = [0, 0, 0, 0];
    expect(residualConnection(x, sub).length).toBe(4);
  });
  test('residual zero sublayer = identity', () => {
    const x = [1, 2, 3];
    const sub = [0, 0, 0];
    expect(residualConnection(x, sub)).toEqual(x);
  });
  test('residual negative values', () => {
    const x = [1, 2, 3];
    const sub = [-0.5, -1, -1.5];
    expect(residualConnection(x, sub)).toEqual([0.5, 1, 1.5]);
  });
  test('residual handles length mismatch', () => {
    const x = [1, 2, 3];
    const sub = [0.1, 0.2];
    const res = residualConnection(x, sub);
    expect(res[2]).toBe(3);
  });
});

// ─── SECTION 9: Multi-head attention ──────────────────────────────────────────
describe('TFM § 9 — Multi-head attention', () => {
  test('multiHead output shape', () => {
    const Q = createMatrix(4, 8);
    const K = createMatrix(4, 8);
    const V = createMatrix(4, 8);
    const out = multiHeadAttention(Q, K, V, 2);
    expect(out.length).toBe(4);
  });
  test('multiHead single head = scaled attention', () => {
    const Q = createMatrix(2, 4);
    const K = createMatrix(2, 4);
    const V = createMatrix(2, 4);
    const single = multiHeadAttention(Q, K, V, 1);
    expect(single.length).toBe(2);
    expect(single[0].length).toBe(4);
  });
  test('multiHead preserves sequence length', () => {
    const seqLen = 6;
    const Q = createMatrix(seqLen, 12);
    const K = createMatrix(seqLen, 12);
    const V = createMatrix(seqLen, 12);
    const out = multiHeadAttention(Q, K, V, 3);
    expect(out.length).toBe(seqLen);
  });
  test('multiHead 4 heads', () => {
    const Q = createMatrix(3, 16);
    const K = createMatrix(3, 16);
    const V = createMatrix(3, 16);
    const out = multiHeadAttention(Q, K, V, 4);
    expect(out[0].length).toBe(16);
  });
});

// ─── SECTION 10: Masking and similarity ───────────────────────────────────────
describe('TFM § 10 — Masking & similarity', () => {
  test('causal mask lower triangular', () => {
    const mask = attentionMask(4, true);
    expect(mask[0][1]).toBe(-Infinity);
    expect(mask[0][0]).toBe(0);
    expect(mask[3][0]).toBe(0);
  });
  test('no mask all zeros', () => {
    const mask = attentionMask(4, false);
    expect(mask.flat().every(v => v === 0)).toBe(true);
  });
  test('applyMask adds values', () => {
    const scores = [[1, 2], [3, 4]];
    const mask = [[0, -Infinity], [0, 0]];
    const masked = applyMask(scores, mask);
    expect(masked[0][1]).toBe(-Infinity);
    expect(masked[1][1]).toBe(4);
  });
  test('cosineSimilarity identical = 1', () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1);
  });
  test('cosineSimilarity orthogonal = 0', () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
  });
  test('cosineSimilarity opposite = -1', () => {
    expect(cosineSimilarity([1, 2], [-1, -2])).toBeCloseTo(-1);
  });
  test('entropy uniform distribution', () => {
    const uniform = [0.25, 0.25, 0.25, 0.25];
    expect(entropyOfDistribution(uniform)).toBeCloseTo(Math.log(4));
  });
  test('entropy peaked distribution', () => {
    const peaked = [0.9, 0.05, 0.05];
    expect(entropyOfDistribution(peaked)).toBeLessThan(Math.log(3));
  });
  test('crossEntropy one-hot', () => {
    const pred = [0.7, 0.2, 0.1];
    const target = [1, 0, 0];
    expect(crossEntropy(pred, target)).toBeCloseTo(-Math.log(0.7));
  });
  test('dropout training scales', () => {
    const x = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const d = dropout(x, 0, true);
    expect(d).toEqual(x);
  });
});
