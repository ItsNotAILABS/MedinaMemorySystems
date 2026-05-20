/**
 * AI Suite 19 — Multimodal Fusion
 * ============================================================
 * Feature fusion (concatenation/attention/gating), modality
 * weighting, missing modality handling, cross-modal projection,
 * late/early fusion, unimodal vs multimodal accuracy, and
 * φ-harmonic modality weighting.
 *
 * Target: 140+ tests   Charter: AIS-MULTI-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Implementations ──────────────────────────────────────────────────────────

type Feature = number[];

function concatenate(...features: Feature[]): Feature {
  return features.flat();
}

function modalityWeighted(features: Feature[], weights: number[]): Feature {
  const wSum = weights.reduce((a, b) => a + b, 0);
  const dim = features[0].length;
  return Array.from({ length: dim }, (_, d) =>
    features.reduce((s, f, i) => s + f[d] * weights[i], 0) / wSum
  );
}

function gatedFusion(f1: Feature, f2: Feature, gate: Feature): Feature {
  return f1.map((v, i) => gate[i] * v + (1 - gate[i]) * f2[i]);
}

function attentionFuse(query: Feature, keys: Feature[], values: Feature[]): Feature {
  const scores = keys.map(k => query.reduce((s, q, i) => s + q * k[i], 0) / Math.sqrt(query.length));
  const max = Math.max(...scores);
  const exps = scores.map(s => Math.exp(s - max));
  const sum  = exps.reduce((a, b) => a + b, 0);
  const weights = exps.map(e => e / sum);
  const dim = values[0].length;
  return Array.from({ length: dim }, (_, d) =>
    values.reduce((s, v, i) => s + v[d] * weights[i], 0)
  );
}

function imputeMissing(feature: Feature, missingIdx: number[], strategy: 'zero' | 'mean'): Feature {
  const valid = feature.filter((_, i) => !missingIdx.includes(i));
  const impValue = strategy === 'mean' && valid.length > 0
    ? valid.reduce((a, b) => a + b, 0) / valid.length
    : 0;
  return feature.map((v, i) => missingIdx.includes(i) ? impValue : v);
}

function crossModalProject(
  feature: Feature, projection: number[][]
): Feature {
  return projection.map(row => row.reduce((s, w, i) => s + w * feature[i], 0));
}

function earlyFusion(modalities: Feature[]): Feature {
  return concatenate(...modalities);
}

function lateFusion(predictions: number[], weights: number[]): number {
  const wSum = weights.reduce((a, b) => a + b, 0);
  return predictions.reduce((s, p, i) => s + p * weights[i], 0) / wSum;
}

function phiModalWeight(nModalities: number): number[] {
  const raw = Array.from({ length: nModalities }, (_, i) => Math.pow(PHI, -i));
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map(w => w / sum);
}

function modalityDropout(features: Feature[], dropIdx: number): Feature[] {
  return features.map((f, i) => i === dropIdx ? new Array(f.length).fill(0) : f);
}

function fusionDimension(features: Feature[]): number {
  return features.reduce((s, f) => s + f.length, 0);
}

// ─── SECTION 1: Feature concatenation ─────────────────────────────────────────
describe('Multi § 1 — Concatenation', () => {
  test('concatenate preserves all values',  () => {
    const result = concatenate([1, 2], [3, 4]);
    expect(result).toEqual([1, 2, 3, 4]);
  });
  test('dimension is sum of all',           () => {
    expect(concatenate([1, 2], [3, 4], [5]).length).toBe(5);
  });
  test('single modality passthrough',       () => {
    expect(concatenate([1, 2, 3])).toEqual([1, 2, 3]);
  });
  test('empty modality contributes 0 dim',  () => {
    expect(concatenate([1, 2], []).length).toBe(2);
  });
  test('order preserved',                   () => {
    const r = concatenate([1], [2], [3]);
    expect(r).toEqual([1, 2, 3]);
  });
  test('earlyFusion = concatenation',       () => {
    const m = [[1, 2], [3, 4]];
    expect(earlyFusion(m)).toEqual(concatenate(...m);
  });
  test('fusionDimension = total length',    () => {
    expect(fusionDimension([[1, 2], [3, 4, 5]])).toBe(5);
  });
});

// ─── SECTION 2: Weighted fusion ────────────────────────────────────────────────
describe('Multi § 2 — Weighted fusion', () => {
  const f1 = [1, 0], f2 = [0, 1];

  test('equal weights → average',     () => {
    const result = modalityWeighted([f1, f2], [1, 1]);
    expect(result).toEqual([0.5, 0.5]);
  });
  test('all weight on f1 → f1',       () => {
    const result = modalityWeighted([f1, f2], [1, 0]);
    result.forEach((v, i) => expect(v).toBeCloseTo(f1[i]));
  });
  test('dimension preserved',         () => {
    expect(modalityWeighted([[1, 2], [3, 4]], [0.5, 0.5]).length).toBe(2);
  });
  test('result finite',               () => {
    modalityWeighted([[1, 2], [3, 4]], [0.3, 0.7]).forEach(v => expect(isFinite(v)).toBe(true));
  });
  test('weight ratio preserved',      () => {
    const result = modalityWeighted([[0], [10]], [3, 1]);
    expect(result[0]).toBeCloseTo(0 * 3 / 4 + 10 * 1 / 4, 5);
  });
});

// ─── SECTION 3: Gated fusion ──────────────────────────────────────────────────
describe('Multi § 3 — Gated fusion', () => {
  test('gate=1 → f1 only',            () => {
    const result = gatedFusion([5, 5], [2, 2], [1, 1]);
    expect(result).toEqual([5, 5]);
  });
  test('gate=0 → f2 only',            () => {
    const result = gatedFusion([5, 5], [2, 2], [0, 0]);
    expect(result).toEqual([2, 2]);
  });
  test('gate=0.5 → average',          () => {
    const result = gatedFusion([10, 10], [0, 0], [0.5, 0.5]);
    result.forEach(v => expect(v).toBeCloseTo(5));
  });
  test('dimension preserved',         () => {
    expect(gatedFusion([1, 2, 3], [4, 5, 6], [0.5, 0.5, 0.5]).length).toBe(3);
  });
  test('per-element gating',          () => {
    const result = gatedFusion([1, 0], [0, 1], [1, 0]);
    expect(result[0]).toBeCloseTo(1);
    expect(result[1]).toBeCloseTo(1);
  });
});

// ─── SECTION 4: Attention fusion ──────────────────────────────────────────────
describe('Multi § 4 — Attention fusion', () => {
  const query = [1, 0];
  const keys  = [[1, 0], [0, 1]];
  const vals  = [[10, 0], [0, 10]];

  test('output shape correct',             () => {
    expect(attentionFuse(query, keys, vals).length).toBe(2);
  });
  test('query matches key[0] → val[0] dominated', () => {
    const out = attentionFuse(query, keys, vals);
    expect(out[0]).toBeGreaterThan(out[1]);
  });
  test('result is finite',                 () => {
    attentionFuse(query, keys, vals).forEach(v => expect(isFinite(v)).toBe(true));
  });
  test('uniform query → weighted average', () => {
    const q = [1, 1];
    const ks = [[1, 1], [1, 1]];
    const vs = [[0], [10]];
    const out = attentionFuse(q, ks, vs);
    expect(out[0]).toBeCloseTo(5, 1);
  });
});

// ─── SECTION 5: Missing modality ──────────────────────────────────────────────
describe('Multi § 5 — Missing modality imputation', () => {
  test('zero imputation fills missing with 0', () => {
    const result = imputeMissing([1, 2, 3], [1], 'zero');
    expect(result[1]).toBe(0);
  });
  test('mean imputation fills with mean of valid', () => {
    const result = imputeMissing([2, -999, 4], [1], 'mean');
    expect(result[1]).toBeCloseTo(3);
  });
  test('no missing → unchanged', () => {
    const f = [1, 2, 3];
    expect(imputeMissing(f, [], 'zero')).toEqual(f);
  });
  test('length preserved', () => {
    expect(imputeMissing([1, 2, 3, 4], [2], 'zero').length).toBe(4);
  });
  test('modality dropout zeroes target', () => {
    const features = [[1, 2], [3, 4]];
    const dropped = modalityDropout(features, 0);
    expect(dropped[0]).toEqual([0, 0]);
    expect(dropped[1]).toEqual([3, 4]);
  });
  test('dropout non-target unchanged', () => {
    const features = [[1, 2], [3, 4]];
    const dropped = modalityDropout(features, 1);
    expect(dropped[0]).toEqual([1, 2]);
  });
});

// ─── SECTION 6: Late fusion ────────────────────────────────────────────────────
describe('Multi § 6 — Late fusion', () => {
  test('equal weights → average',           () => {
    expect(lateFusion([0.6, 0.4], [1, 1])).toBeCloseTo(0.5);
  });
  test('single modality → itself',          () => {
    expect(lateFusion([0.7], [1])).toBeCloseTo(0.7);
  });
  test('bias toward high-weight modality',  () => {
    expect(lateFusion([0.9, 0.1], [9, 1])).toBeGreaterThan(0.5);
  });
  test('result ∈ [min,max] of predictions', () => {
    const lf = lateFusion([0.2, 0.8], [0.5, 0.5]);
    expect(lf).toBeGreaterThanOrEqual(0.2);
    expect(lf).toBeLessThanOrEqual(0.8);
  });
  test('late fusion finite',                () => {
    expect(isFinite(lateFusion([0.3, 0.7], [2, 1]))).toBe(true);
  });
});

// ─── SECTION 7: φ-modality weights ────────────────────────────────────────────
describe('Multi § 7 — φ-modality weights', () => {
  test('weights sum to 1',        () => {
    const w = phiModalWeight(4);
    expect(w.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });
  test('all weights positive',    () => {
    phiModalWeight(5).forEach(w => expect(w).toBeGreaterThan(0));
  });
  test('first modality highest',  () => {
    const w = phiModalWeight(4);
    expect(w[0]).toBeGreaterThan(w[1]);
  });
  test('geometric decrease',      () => {
    const w = phiModalWeight(3);
    expect(w[0] / w[1]).toBeCloseTo(PHI, 5);
  });
  test('single modality → [1]',   () => {
    expect(phiModalWeight(1)).toEqual([1]);
  });
  test('correct length',          () => {
    expect(phiModalWeight(6).length).toBe(6);
  });
});

// ─── SECTION 8: Cross-modal projection ─────────────────────────────────────────
describe('Multi § 8 — Cross-modal projection', () => {
  const projection = [[1, 0], [0, 1]];   // identity projection
  const feature = [3, 5];

  test('identity projection preserves feature', () => {
    expect(crossModalProject(feature, projection)).toEqual([3, 5]);
  });
  test('zero projection → zero',           () => {
    const zeroPj = [[0, 0], [0, 0]];
    expect(crossModalProject([1, 2], zeroPj)).toEqual([0, 0]);
  });
  test('output dimension = projection rows', () => {
    const pj = [[1, 0], [0, 1], [1, 1]];
    expect(crossModalProject([1, 2], pj).length).toBe(3);
  });
  test('scale projection → scaled output', () => {
    const pj = [[2, 0], [0, 2]];
    const result = crossModalProject([3, 4], pj);
    expect(result).toEqual([6, 8]);
  });
  test('projection result is finite',       () => {
    crossModalProject([1, 2], projection).forEach(v => expect(isFinite(v)).toBe(true));
  });
});
