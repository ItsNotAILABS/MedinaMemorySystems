/**
 * AI Suite 23 — Contrastive Learning
 * ============================================================
 * Positive/negative pairs, similarity metrics, contrastive loss,
 * representation learning, embedding spaces, augmentation strategies,
 * φ-coherent contrastive objectives, and self-supervised invariants.
 *
 * Target: 100 tests   Charter: AIS-CTL-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Core Types ───────────────────────────────────────────────────────────────

type Vector = number[];
type Pair = { anchor: Vector; positive: Vector; negative?: Vector };
type Batch = Pair[];

// ─── Implementations ──────────────────────────────────────────────────────────

function dotProduct(a: Vector, b: Vector): number {
  let sum = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) sum += a[i] * b[i];
  return sum;
}

function norm(v: Vector): number {
  return Math.sqrt(v.reduce((s, x) => s + x * x, 0));
}

function normalize(v: Vector): Vector {
  const n = norm(v);
  return n > 0 ? v.map(x => x / n) : v;
}

function cosineSimilarity(a: Vector, b: Vector): number {
  const normA = norm(a);
  const normB = norm(b);
  if (normA === 0 || normB === 0) return 0;
  return dotProduct(a, b) / (normA * normB);
}

function euclideanDistance(a: Vector, b: Vector): number {
  let sum = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

function manhattanDistance(a: Vector, b: Vector): number {
  let sum = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    sum += Math.abs(a[i] - b[i]);
  }
  return sum;
}

function contrastiveLoss(anchor: Vector, positive: Vector, negative: Vector, margin: number = 1.0): number {
  const posDist = euclideanDistance(anchor, positive);
  const negDist = euclideanDistance(anchor, negative);
  return Math.max(0, posDist - negDist + margin);
}

function tripletLoss(anchor: Vector, positive: Vector, negative: Vector, margin: number = 1.0): number {
  const posDist = euclideanDistance(anchor, positive);
  const negDist = euclideanDistance(anchor, negative);
  return Math.max(0, posDist ** 2 - negDist ** 2 + margin);
}

function infoNCELoss(anchor: Vector, positive: Vector, negatives: Vector[], temperature: number = 0.07): number {
  const posSim = cosineSimilarity(anchor, positive) / temperature;
  const negSims = negatives.map(neg => cosineSimilarity(anchor, neg) / temperature);
  const maxSim = Math.max(posSim, ...negSims);
  const expPos = Math.exp(posSim - maxSim);
  const expNegs = negSims.reduce((s, sim) => s + Math.exp(sim - maxSim), 0);
  return -Math.log(expPos / (expPos + expNegs));
}

function ntXentLoss(z1: Vector, z2: Vector, batch: Vector[], temperature: number = 0.5): number {
  const sim12 = Math.exp(cosineSimilarity(z1, z2) / temperature);
  let denominator = 0;
  for (const z of batch) {
    if (z !== z1) {
      denominator += Math.exp(cosineSimilarity(z1, z) / temperature);
    }
  }
  return -Math.log(sim12 / (denominator || 1));
}

function hardNegativeMining(anchor: Vector, negatives: Vector[], k: number): Vector[] {
  const scored = negatives.map(neg => ({
    neg,
    sim: cosineSimilarity(anchor, neg)
  }));
  scored.sort((a, b) => b.sim - a.sim); // Most similar (hardest) first
  return scored.slice(0, k).map(s => s.neg);
}

function semiHardNegativeMining(anchor: Vector, positive: Vector, negatives: Vector[], margin: number = 0.1): Vector[] {
  const posDist = euclideanDistance(anchor, positive);
  return negatives.filter(neg => {
    const negDist = euclideanDistance(anchor, neg);
    return negDist > posDist && negDist < posDist + margin;
  });
}

function augmentVector(v: Vector, noiseScale: number = 0.1): Vector {
  return v.map(x => x + (Math.random() - 0.5) * 2 * noiseScale);
}

function dropoutAugment(v: Vector, dropRate: number = 0.1): Vector {
  return v.map(x => Math.random() > dropRate ? x / (1 - dropRate) : 0);
}

function mixup(v1: Vector, v2: Vector, alpha: number = 0.5): Vector {
  return v1.map((x, i) => alpha * x + (1 - alpha) * (v2[i] || 0));
}

function phiContrastiveWeight(similarity: number): number {
  return 1 / (1 + Math.exp(-PHI * similarity));
}

function alignmentScore(embeddings: Vector[], labels: number[]): number {
  let sameCount = 0, sameSum = 0;
  for (let i = 0; i < embeddings.length; i++) {
    for (let j = i + 1; j < embeddings.length; j++) {
      if (labels[i] === labels[j]) {
        sameCount++;
        sameSum += cosineSimilarity(embeddings[i], embeddings[j]);
      }
    }
  }
  return sameCount > 0 ? sameSum / sameCount : 0;
}

function uniformityScore(embeddings: Vector[], t: number = 2): number {
  let sum = 0, count = 0;
  for (let i = 0; i < embeddings.length; i++) {
    for (let j = i + 1; j < embeddings.length; j++) {
      const dist = euclideanDistance(normalize(embeddings[i]), normalize(embeddings[j]));
      sum += Math.exp(-t * dist ** 2);
      count++;
    }
  }
  return count > 0 ? Math.log(sum / count) : 0;
}

function representationCollapse(embeddings: Vector[]): boolean {
  if (embeddings.length < 2) return false;
  const first = normalize(embeddings[0]);
  return embeddings.slice(1).every(emb => cosineSimilarity(first, normalize(emb)) > 0.99);
}

function batchContrastiveLoss(batch: Batch, margin: number = 1.0): number {
  let totalLoss = 0;
  for (const pair of batch) {
    if (pair.negative) {
      totalLoss += contrastiveLoss(pair.anchor, pair.positive, pair.negative, margin);
    }
  }
  return batch.length > 0 ? totalLoss / batch.length : 0;
}

function temperatureScaledSimilarity(a: Vector, b: Vector, temp: number): number {
  return cosineSimilarity(a, b) / temp;
}

function softNearestNeighbors(query: Vector, keys: Vector[], temperature: number = 1.0): Vector {
  const sims = keys.map(k => Math.exp(cosineSimilarity(query, k) / temperature));
  const sumSims = sims.reduce((a, b) => a + b, 0);
  return sims.map(s => s / (sumSims || 1));
}

// ─── SECTION 1: Basic similarity metrics ──────────────────────────────────────
describe('CTL § 1 — Similarity metrics', () => {
  test('dotProduct calculation', () => expect(dotProduct([1, 2], [3, 4])).toBe(11));
  test('dotProduct empty', () => expect(dotProduct([], [])).toBe(0));
  test('norm unit vector', () => expect(norm([1, 0, 0])).toBe(1));
  test('norm calculation', () => expect(norm([3, 4])).toBe(5));
  test('normalize creates unit', () => expect(norm(normalize([3, 4]))).toBeCloseTo(1));
  test('normalize zero vector', () => expect(normalize([0, 0])).toEqual([0, 0]));
  test('cosineSimilarity identical', () => expect(cosineSimilarity([1, 2], [1, 2])).toBeCloseTo(1));
  test('cosineSimilarity orthogonal', () => expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0));
  test('cosineSimilarity opposite', () => expect(cosineSimilarity([1, 2], [-1, -2])).toBeCloseTo(-1));
  test('cosineSimilarity zero vector', () => expect(cosineSimilarity([0, 0], [1, 2])).toBe(0));
});

// ─── SECTION 2: Distance metrics ──────────────────────────────────────────────
describe('CTL § 2 — Distance metrics', () => {
  test('euclidean same point', () => expect(euclideanDistance([1, 2], [1, 2])).toBe(0));
  test('euclidean calculation', () => expect(euclideanDistance([0, 0], [3, 4])).toBe(5));
  test('euclidean symmetric', () => {
    const d1 = euclideanDistance([1, 2], [3, 4]);
    const d2 = euclideanDistance([3, 4], [1, 2]);
    expect(d1).toBeCloseTo(d2);
  });
  test('manhattan same point', () => expect(manhattanDistance([1, 2], [1, 2])).toBe(0));
  test('manhattan calculation', () => expect(manhattanDistance([0, 0], [3, 4])).toBe(7));
  test('manhattan symmetric', () => {
    const d1 = manhattanDistance([1, 2], [3, 4]);
    const d2 = manhattanDistance([3, 4], [1, 2]);
    expect(d1).toBe(d2);
  });
  test('euclidean >= 0', () => expect(euclideanDistance([1, 2, 3], [4, 5, 6])).toBeGreaterThanOrEqual(0));
  test('manhattan >= 0', () => expect(manhattanDistance([1, 2, 3], [4, 5, 6])).toBeGreaterThanOrEqual(0));
});

// ─── SECTION 3: Contrastive loss ──────────────────────────────────────────────
describe('CTL § 3 — Contrastive loss', () => {
  test('contrastiveLoss good separation', () => {
    const loss = contrastiveLoss([0, 0], [0.1, 0], [5, 0], 1);
    expect(loss).toBe(0);
  });
  test('contrastiveLoss bad separation', () => {
    const loss = contrastiveLoss([0, 0], [3, 0], [1, 0], 1);
    expect(loss).toBeGreaterThan(0);
  });
  test('contrastiveLoss margin effect', () => {
    const loss1 = contrastiveLoss([0, 0], [1, 0], [2, 0], 0.5);
    const loss2 = contrastiveLoss([0, 0], [1, 0], [2, 0], 2);
    expect(loss2).toBeGreaterThan(loss1);
  });
  test('tripletLoss good separation', () => {
    const loss = tripletLoss([0, 0], [0.1, 0], [5, 0], 0.5);
    expect(loss).toBe(0);
  });
  test('tripletLoss bad separation', () => {
    const loss = tripletLoss([0, 0], [3, 0], [1, 0], 1);
    expect(loss).toBeGreaterThan(0);
  });
  test('loss non-negative', () => {
    const loss = contrastiveLoss([1, 2], [3, 4], [5, 6]);
    expect(loss).toBeGreaterThanOrEqual(0);
  });
});

// ─── SECTION 4: InfoNCE loss ──────────────────────────────────────────────────
describe('CTL § 4 — InfoNCE', () => {
  test('infoNCE with clear positive', () => {
    const anchor = [1, 0];
    const positive = [0.9, 0.1];
    const negatives = [[0, 1], [-1, 0], [0, -1]];
    const loss = infoNCELoss(anchor, positive, negatives);
    expect(loss).toBeGreaterThanOrEqual(0);
  });
  test('infoNCE temperature effect', () => {
    const anchor = [1, 0];
    const positive = [0.8, 0.2];
    const negatives = [[0, 1]];
    const loss1 = infoNCELoss(anchor, positive, negatives, 0.1);
    const loss2 = infoNCELoss(anchor, positive, negatives, 1.0);
    expect(loss1).not.toBe(loss2);
  });
  test('infoNCE more negatives harder', () => {
    const anchor = [1, 0];
    const positive = [0.9, 0.1];
    const loss1 = infoNCELoss(anchor, positive, [[0, 1]]);
    const loss2 = infoNCELoss(anchor, positive, [[0, 1], [-1, 0], [0, -1], [-0.5, 0.5]]);
    expect(loss2).toBeGreaterThanOrEqual(loss1);
  });
  test('ntXent symmetric', () => {
    const z1 = [1, 0];
    const z2 = [0.9, 0.1];
    const batch = [z1, z2, [0, 1], [-1, 0]];
    const loss = ntXentLoss(z1, z2, batch);
    expect(loss).toBeGreaterThanOrEqual(0);
  });
});

// ─── SECTION 5: Hard negative mining ──────────────────────────────────────────
describe('CTL § 5 — Hard negatives', () => {
  test('hardNegativeMining returns k', () => {
    const negatives = [[0, 1], [1, 0], [0.5, 0.5], [-1, 0]];
    const hard = hardNegativeMining([1, 0], negatives, 2);
    expect(hard.length).toBe(2);
  });
  test('hardNegativeMining most similar first', () => {
    const anchor = [1, 0];
    const negatives = [[0, 1], [0.9, 0.1], [-1, 0]];
    const hard = hardNegativeMining(anchor, negatives, 1);
    expect(hard[0]).toEqual([0.9, 0.1]);
  });
  test('semiHardNegativeMining filters correctly', () => {
    const anchor = [0, 0];
    const positive = [1, 0]; // dist = 1
    const negatives = [[0.5, 0], [1.05, 0], [2, 0], [3, 0]];
    const semiHard = semiHardNegativeMining(anchor, positive, negatives, 0.1);
    expect(semiHard.length).toBe(1);
    expect(semiHard[0]).toEqual([1.05, 0]);
  });
  test('semiHard excludes too easy', () => {
    const anchor = [0, 0];
    const positive = [1, 0];
    const negatives = [[5, 0], [10, 0]];
    const semiHard = semiHardNegativeMining(anchor, positive, negatives, 0.5);
    expect(semiHard.length).toBe(0);
  });
});

// ─── SECTION 6: Augmentation ──────────────────────────────────────────────────
describe('CTL § 6 — Augmentation', () => {
  test('augmentVector changes values', () => {
    const v = [1, 2, 3];
    const aug = augmentVector(v, 0.5);
    expect(aug).not.toEqual(v);
  });
  test('augmentVector preserves length', () => {
    const v = [1, 2, 3, 4];
    expect(augmentVector(v).length).toBe(4);
  });
  test('augmentVector zero noise = identity', () => {
    const v = [1, 2, 3];
    const aug = augmentVector(v, 0);
    expect(aug).toEqual(v);
  });
  test('dropoutAugment preserves length', () => {
    const v = [1, 2, 3, 4, 5];
    expect(dropoutAugment(v).length).toBe(5);
  });
  test('dropoutAugment rate 0 = identity scaled', () => {
    const v = [1, 2, 3];
    const aug = dropoutAugment(v, 0);
    expect(aug).toEqual(v);
  });
  test('mixup interpolates', () => {
    const v1 = [0, 0];
    const v2 = [2, 2];
    const m = mixup(v1, v2, 0.5);
    expect(m).toEqual([1, 1]);
  });
  test('mixup alpha=0 returns v2', () => {
    const m = mixup([1, 1], [2, 2], 0);
    expect(m).toEqual([2, 2]);
  });
  test('mixup alpha=1 returns v1', () => {
    const m = mixup([1, 1], [2, 2], 1);
    expect(m).toEqual([1, 1]);
  });
});

// ─── SECTION 7: Phi-coherent weights ──────────────────────────────────────────
describe('CTL § 7 — Phi weights', () => {
  test('phiWeight at 0', () => expect(phiContrastiveWeight(0)).toBeCloseTo(0.5));
  test('phiWeight positive high', () => expect(phiContrastiveWeight(5)).toBeGreaterThan(0.5));
  test('phiWeight negative low', () => expect(phiContrastiveWeight(-5)).toBeLessThan(0.5));
  test('phiWeight bounded [0,1]', () => {
    expect(phiContrastiveWeight(100)).toBeLessThanOrEqual(1);
    expect(phiContrastiveWeight(-100)).toBeGreaterThanOrEqual(0);
  });
  test('phiWeight uses phi', () => {
    const w = phiContrastiveWeight(1);
    expect(w).toBeCloseTo(1 / (1 + Math.exp(-PHI)));
  });
  test('phiWeight monotonic', () => {
    expect(phiContrastiveWeight(1)).toBeGreaterThan(phiContrastiveWeight(0));
    expect(phiContrastiveWeight(0)).toBeGreaterThan(phiContrastiveWeight(-1));
  });
});

// ─── SECTION 8: Alignment and uniformity ──────────────────────────────────────
describe('CTL § 8 — Alignment & uniformity', () => {
  test('alignmentScore same class high', () => {
    const embeddings = [[1, 0], [0.9, 0.1], [0, 1], [0.1, 0.9]];
    const labels = [0, 0, 1, 1];
    const score = alignmentScore(embeddings, labels);
    expect(score).toBeGreaterThan(0.8);
  });
  test('alignmentScore no same class', () => {
    const embeddings = [[1, 0], [0, 1], [-1, 0]];
    const labels = [0, 1, 2];
    expect(alignmentScore(embeddings, labels)).toBe(0);
  });
  test('uniformityScore spread embeddings', () => {
    const embeddings = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    const score = uniformityScore(embeddings);
    expect(score).toBeLessThan(0);
  });
  test('uniformityScore collapsed embeddings', () => {
    const embeddings = [[1, 0], [1, 0], [1, 0]];
    const score = uniformityScore(embeddings);
    expect(score).toBeCloseTo(0);
  });
});

// ─── SECTION 9: Representation collapse ───────────────────────────────────────
describe('CTL § 9 — Collapse detection', () => {
  test('representationCollapse detects collapse', () => {
    const collapsed = [[1, 0], [1, 0], [1, 0]];
    expect(representationCollapse(collapsed)).toBe(true);
  });
  test('representationCollapse diverse is false', () => {
    const diverse = [[1, 0], [0, 1], [-1, 0]];
    expect(representationCollapse(diverse)).toBe(false);
  });
  test('representationCollapse single embedding', () => {
    expect(representationCollapse([[1, 2]])).toBe(false);
  });
  test('representationCollapse empty', () => {
    expect(representationCollapse([])).toBe(false);
  });
  test('near collapse still detected', () => {
    const nearCollapse = [[1, 0], [0.999, 0.001], [0.998, 0.002]];
    expect(representationCollapse(nearCollapse)).toBe(true);
  });
});

// ─── SECTION 10: Batch operations ─────────────────────────────────────────────
describe('CTL § 10 — Batch operations', () => {
  test('batchContrastiveLoss averages', () => {
    const batch: Batch = [
      { anchor: [0, 0], positive: [0.1, 0], negative: [5, 0] },
      { anchor: [0, 0], positive: [0.2, 0], negative: [4, 0] }
    ];
    const loss = batchContrastiveLoss(batch);
    expect(loss).toBeGreaterThanOrEqual(0);
  });
  test('batchContrastiveLoss empty', () => {
    expect(batchContrastiveLoss([])).toBe(0);
  });
  test('temperatureScaledSimilarity', () => {
    const sim = temperatureScaledSimilarity([1, 0], [0.9, 0.1], 0.5);
    const rawSim = cosineSimilarity([1, 0], [0.9, 0.1]);
    expect(sim).toBeCloseTo(rawSim / 0.5);
  });
  test('softNearestNeighbors sums to 1', () => {
    const weights = softNearestNeighbors([1, 0], [[0.9, 0.1], [0, 1], [-1, 0]]);
    expect(weights.reduce((a, b) => a + b)).toBeCloseTo(1);
  });
  test('softNearestNeighbors favors similar', () => {
    const weights = softNearestNeighbors([1, 0], [[0.9, 0.1], [0, 1], [-1, 0]]);
    expect(weights[0]).toBeGreaterThan(weights[1]);
    expect(weights[0]).toBeGreaterThan(weights[2]);
  });
  test('softNearestNeighbors temperature effect', () => {
    const w1 = softNearestNeighbors([1, 0], [[0.8, 0.2], [0, 1]], 0.1);
    const w2 = softNearestNeighbors([1, 0], [[0.8, 0.2], [0, 1]], 2.0);
    expect(w1[0]).toBeGreaterThan(w2[0]); // Lower temp = more peaked
  });
});
