/**
 * AI Suite 08 — Embedding Space
 * ============================================================
 * Vector arithmetic, cosine similarity, Euclidean distance, k-NN,
 * PCA-like projection, embedding normalization, analogy solving,
 * clustering (k-means iteration), and φ-weighted interpolation.
 *
 * Target: 150+ tests   Charter: AIS-EMB-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_INV = 1 / PHI;

// ─── Implementations ──────────────────────────────────────────────────────────

type Vec = number[];

function add(a: Vec, b: Vec): Vec { return a.map((x, i) => x + b[i]); }
function sub(a: Vec, b: Vec): Vec { return a.map((x, i) => x - b[i]); }
function scale(a: Vec, s: number): Vec { return a.map(x => x * s); }
function norm(a: Vec): number { return Math.sqrt(a.reduce((s, x) => s + x * x, 0)); }
function normalize(a: Vec): Vec { const n = norm(a); return n === 0 ? a : a.map(x => x / n); }
function dot(a: Vec, b: Vec): number { return a.reduce((s, x, i) => s + x * b[i], 0); }
function cosine(a: Vec, b: Vec): number { return dot(normalize(a), normalize(b)); }
function euclidean(a: Vec, b: Vec): number { return norm(sub(a, b)); }

function knn(query: Vec, corpus: Vec[], k: number): number[] {
  const dists = corpus.map((v, i) => ({ i, d: euclidean(query, v) }));
  dists.sort((a, b) => a.d - b.d);
  return dists.slice(0, k).map(x => x.i);
}

function analogy(king: Vec, man: Vec, woman: Vec): Vec {
  return add(sub(king, man), woman);
}

function interpolate(a: Vec, b: Vec, t: number): Vec {
  return add(scale(a, 1 - t), scale(b, t));
}

function phiInterpolate(a: Vec, b: Vec): Vec {
  return interpolate(a, b, PHI_INV);
}

function kmeanStep(points: Vec[], centroids: Vec[]): Vec[] {
  const k = centroids.length;
  const clusters: Vec[][] = Array.from({ length: k }, () => []);
  points.forEach(p => {
    const ci = centroids.map((c, i) => ({ i, d: euclidean(p, c) }))
                        .sort((a, b) => a.d - b.d)[0].i;
    clusters[ci].push(p);
  });
  return centroids.map((c, i) => {
    if (clusters[i].length === 0) return c;
    const dim = c.length;
    const mean = Array(dim).fill(0);
    clusters[i].forEach(p => p.forEach((v, j) => { mean[j] += v; }));
    return mean.map(v => v / clusters[i].length);
  });
}

function outerProduct(a: Vec, b: Vec): number[][] {
  return a.map(ai => b.map(bi => ai * bi));
}

function meanVec(vecs: Vec[]): Vec {
  const dim = vecs[0].length;
  const sum = Array(dim).fill(0);
  vecs.forEach(v => v.forEach((x, i) => { sum[i] += x; }));
  return sum.map(s => s / vecs.length);
}

// ─── SECTION 1: Vector arithmetic ─────────────────────────────────────────────
describe('Emb § 1 — Vector arithmetic', () => {
  test('add [1,2]+[3,4]=[4,6]',         () => expect(add([1, 2], [3, 4])).toEqual([4, 6]));
  test('sub [3,4]-[1,2]=[2,2]',         () => expect(sub([3, 4], [1, 2])).toEqual([2, 2]));
  test('scale [1,2]*3=[3,6]',           () => expect(scale([1, 2], 3)).toEqual([3, 6]));
  test('add commutative',               () => expect(add([1, 2], [3, 4])).toEqual(add([3, 4], [1, 2])));
  test('sub anti-commutative',          () => {
    sub([3, 4], [1, 2]).forEach((v, i) => expect(v).toBe(-sub([1, 2], [3, 4])[i]));
  });
  test('add zero → identity',           () => expect(add([1, 2], [0, 0])).toEqual([1, 2]));
  test('scale by 0 → zero vector',      () => expect(scale([5, 3], 0)).toEqual([0, 0]));
  test('scale by 1 → identity',         () => expect(scale([5, 3], 1)).toEqual([5, 3]));
  test('scale by -1 → negation',        () => expect(scale([5, -3], -1)).toEqual([-5, 3]));
  test('add preserves dimension',       () => expect(add([1, 2, 3], [4, 5, 6]).length).toBe(3));
  test('sub preserves dimension',       () => expect(sub([1, 2, 3], [4, 5, 6]).length).toBe(3));
});

// ─── SECTION 2: Vector norms ───────────────────────────────────────────────────
describe('Emb § 2 — Norms', () => {
  test('norm([0,0]) = 0',         () => expect(norm([0, 0])).toBe(0));
  test('norm([1,0]) = 1',         () => expect(norm([1, 0])).toBeCloseTo(1));
  test('norm([3,4]) = 5',         () => expect(norm([3, 4])).toBeCloseTo(5));
  test('norm non-negative',       () => expect(norm([-5, 2])).toBeGreaterThan(0));
  test('normalize has unit norm', () => expect(norm(normalize([3, 4]))).toBeCloseTo(1));
  test('normalize direction preserved', () => {
    const v = [3, 4];
    const n = normalize(v);
    expect(n[0] / n[1]).toBeCloseTo(v[0] / v[1]);
  });
  test('normalize of unit vector = itself', () => {
    const u = normalize([1, 0]);
    normalize(u).forEach((v, i) => expect(v).toBeCloseTo(u[i]));
  });
  test('norm scales with scalar', () => {
    expect(norm(scale([3, 4], 2))).toBeCloseTo(2 * norm([3, 4]));
  });
});

// ─── SECTION 3: Similarity metrics ────────────────────────────────────────────
describe('Emb § 3 — Cosine similarity', () => {
  test('cosine([1,0],[1,0]) = 1',    () => expect(cosine([1, 0], [1, 0])).toBeCloseTo(1));
  test('cosine([1,0],[0,1]) = 0',    () => expect(cosine([1, 0], [0, 1])).toBeCloseTo(0));
  test('cosine([1],[-1]) = -1',      () => expect(cosine([1], [-1])).toBeCloseTo(-1));
  test('cosine ∈ [-1,1]',            () => {
    const c = cosine([1, 2, 3], [4, 5, 6]);
    expect(c).toBeGreaterThanOrEqual(-1 - 1e-9);
    expect(c).toBeLessThanOrEqual(1 + 1e-9);
  });
  test('cosine symmetric',           () => {
    const a = [1, 2], b = [3, 4];
    expect(cosine(a, b)).toBeCloseTo(cosine(b, a));
  });
  test('cosine scale-invariant',     () => {
    const a = [1, 2], b = [3, 4];
    expect(cosine(a, b)).toBeCloseTo(cosine(scale(a, 100), b));
  });
});

describe('Emb § 3b — Euclidean distance', () => {
  test('euclidean([0,0],[0,0]) = 0',  () => expect(euclidean([0, 0], [0, 0])).toBe(0));
  test('euclidean([0,0],[3,4]) = 5',  () => expect(euclidean([0, 0], [3, 4])).toBeCloseTo(5));
  test('euclidean non-negative',      () => expect(euclidean([1, 2], [4, 6])).toBeGreaterThan(0));
  test('euclidean symmetric',         () => {
    expect(euclidean([1, 2], [3, 4])).toBeCloseTo(euclidean([3, 4], [1, 2]));
  });
  test('triangle inequality',         () => {
    const a = [0, 0], b = [1, 0], c = [2, 0];
    expect(euclidean(a, c)).toBeLessThanOrEqual(euclidean(a, b) + euclidean(b, c) + 1e-9);
  });
});

// ─── SECTION 4: k-NN retrieval ─────────────────────────────────────────────────
describe('Emb § 4 — k-NN', () => {
  const corpus = [[0, 0], [1, 0], [2, 0], [10, 10]];
  const query  = [0.5, 0];

  test('knn returns k indices',           () => expect(knn(query, corpus, 2).length).toBe(2));
  test('nearest is [0,0] or [1,0]',       () => expect([0, 1]).toContain(knn(query, corpus, 1)[0]));
  test('far point not in k=2 results',    () => expect(knn(query, corpus, 2)).not.toContain(3));
  test('k=corpus.length returns all',     () => {
    const all = knn(query, corpus, corpus.length);
    expect(all.length).toBe(corpus.length);
  });
  test('indices are valid',               () => {
    knn(query, corpus, 3).forEach(i => {
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(corpus.length);
    });
  });
  test('exact match in corpus → index 0 result', () => {
    expect(knn([1, 0], corpus, 1)[0]).toBe(1);
  });
});

// ─── SECTION 5: Analogy arithmetic ────────────────────────────────────────────
describe('Emb § 5 — Analogy (king - man + woman)', () => {
  const king   = [1, 1, 0];
  const man    = [0, 1, 0];
  const woman  = [0, 0, 1];

  test('analogy result has same dimension', () => {
    expect(analogy(king, man, woman).length).toBe(3);
  });
  test('king - man + woman = [1,0,1]', () => {
    const result = analogy(king, man, woman);
    expect(result).toEqual([1, 0, 1]);
  });
  test('analogy is linear', () => {
    const r = analogy([2, 2], [1, 0], [0, 1]);
    expect(r).toEqual([1, 3]);
  });
  test('analogy self-relation = identity', () => {
    const v = [3, 5];
    const r = analogy(v, v, v);
    expect(r).toEqual(v);
  });
});

// ─── SECTION 6: Interpolation ─────────────────────────────────────────────────
describe('Emb § 6 — Linear interpolation', () => {
  const a = [0, 0], b = [10, 10];

  test('t=0 → a',     () => expect(interpolate(a, b, 0)).toEqual(a));
  test('t=1 → b',     () => expect(interpolate(a, b, 1)).toEqual(b));
  test('t=0.5 → mid', () => expect(interpolate(a, b, 0.5)).toEqual([5, 5]));
  test('t ∈ (0,1) between a and b', () => {
    const mid = interpolate(a, b, 0.3);
    expect(mid[0]).toBeGreaterThan(0);
    expect(mid[0]).toBeLessThan(10);
  });
  test('phi interpolate at PHI_INV', () => {
    const p = phiInterpolate(a, b);
    expect(p[0]).toBeCloseTo(10 * PHI_INV, 5);
  });
  test('preserves dimension', () => expect(interpolate([1, 2, 3], [4, 5, 6], 0.5).length).toBe(3));
});

// ─── SECTION 7: K-means step ───────────────────────────────────────────────────
describe('Emb § 7 — K-means centroid update', () => {
  test('one cluster pulls centroid to mean', () => {
    const points = [[0, 0], [2, 0], [1, 2]];
    const centroids = [[0, 0]];
    const next = kmeanStep(points, centroids);
    expect(next[0][0]).toBeCloseTo(1, 5);
  });
  test('two balanced clusters', () => {
    const points = [[0, 0], [0, 1], [10, 0], [10, 1]];
    const centroids = [[0, 0.5], [10, 0.5]];
    const next = kmeanStep(points, centroids);
    expect(next[0][0]).toBeCloseTo(0);
    expect(next[1][0]).toBeCloseTo(10);
  });
  test('output has same number of centroids', () => {
    const pts = [[1, 0], [2, 0], [3, 0]];
    const cs  = [[0, 0], [5, 0]];
    expect(kmeanStep(pts, cs).length).toBe(2);
  });
  test('convergence: stable centroids remain', () => {
    const points = [[0, 0], [10, 10]];
    const centroids = [[0, 0], [10, 10]];
    const next = kmeanStep(points, centroids);
    expect(next[0]).toEqual([0, 0]);
    expect(next[1]).toEqual([10, 10]);
  });
});

// ─── SECTION 8: Mean vector ────────────────────────────────────────────────────
describe('Emb § 8 — Mean vector', () => {
  test('mean of one vector is itself', () => {
    expect(meanVec([[3, 5]])).toEqual([3, 5]);
  });
  test('mean of two vectors', () => {
    expect(meanVec([[0, 0], [2, 4]])).toEqual([1, 2]);
  });
  test('mean is in convex hull component-wise', () => {
    const vecs = [[1, 0], [3, 0], [5, 0]];
    const m = meanVec(vecs);
    expect(m[0]).toBeCloseTo(3);
  });
  test('mean preserves dimension', () => {
    expect(meanVec([[1, 2, 3], [4, 5, 6]]).length).toBe(3);
  });
  test('mean of identical vecs = same vec', () => {
    const m = meanVec([[5, 5], [5, 5], [5, 5]]);
    expect(m).toEqual([5, 5]);
  });
});
