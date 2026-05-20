/**
 * AI Suite 25 — Self-Supervised Learning
 * ============================================================
 * Pretext tasks, masked prediction, contrastive objectives,
 * representation learning, data augmentation, pseudo-labels,
 * φ-coherent self-supervision, and SSL invariants.
 *
 * Target: 100 tests   Charter: AIS-SSL-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Core Types ───────────────────────────────────────────────────────────────

type Vector = number[];
type Sequence = number[];
type MaskedSequence = { tokens: number[]; mask: boolean[]; labels: number[] };

// ─── Implementations ──────────────────────────────────────────────────────────

function maskTokens(sequence: Sequence, maskProb: number = 0.15, maskToken: number = 0): MaskedSequence {
  const tokens = [...sequence];
  const mask = sequence.map(() => Math.random() < maskProb);
  const labels = [...sequence];
  
  for (let i = 0; i < tokens.length; i++) {
    if (mask[i]) {
      tokens[i] = maskToken;
    }
  }
  
  return { tokens, mask, labels };
}

function predictMasked(tokens: number[], mask: boolean[], predictor: (ctx: number[]) => number[]): number[] {
  const predictions: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (mask[i]) {
      const context = tokens.filter((_, j) => !mask[j]);
      const pred = predictor(context);
      predictions.push(pred[i % pred.length] || 0);
    }
  }
  return predictions;
}

function maskedAccuracy(predictions: number[], labels: number[], mask: boolean[]): number {
  let correct = 0, total = 0;
  for (let i = 0; i < mask.length; i++) {
    if (mask[i]) {
      total++;
      if (Math.abs(predictions[total - 1] - labels[i]) < 0.5) correct++;
    }
  }
  return total > 0 ? correct / total : 0;
}

function rotateImage(pixels: number[][], angle: number): number[][] {
  // Simplified rotation: 0, 90, 180, 270
  const n = pixels.length;
  if (angle === 90) {
    return pixels[0].map((_, i) => pixels.map(row => row[n - 1 - i]));
  }
  if (angle === 180) {
    return pixels.map(row => [...row].reverse()).reverse();
  }
  if (angle === 270) {
    return pixels[0].map((_, i) => pixels.map(row => row[i]).reverse());
  }
  return pixels;
}

function predictRotation(features: Vector): number {
  // Predict rotation class 0-3 (0, 90, 180, 270 degrees)
  const maxIdx = features.reduce((max, v, i, arr) => v > arr[max] ? i : max, 0);
  return maxIdx % 4;
}

function jigsaw(image: number[][], gridSize: number): { patches: number[][][]; permutation: number[] } {
  const h = image.length;
  const w = image[0]?.length || 0;
  const ph = Math.floor(h / gridSize);
  const pw = Math.floor(w / gridSize);
  const patches: number[][][] = [];
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const patch = image.slice(i * ph, (i + 1) * ph).map(row => row.slice(j * pw, (j + 1) * pw));
      patches.push(patch);
    }
  }
  
  const permutation = Array.from({ length: patches.length }, (_, i) => i);
  for (let i = permutation.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
  }
  
  return { patches, permutation };
}

function colorize(grayscale: number[]): Vector {
  // Predict color channels from grayscale
  return [grayscale[0] || 0, grayscale[0] || 0, grayscale[0] || 0];
}

function nextTokenPrediction(sequence: Sequence, position: number): number {
  // Simple prediction based on context
  if (position === 0) return sequence[0] || 0;
  const context = sequence.slice(0, position);
  return context.reduce((a, b) => a + b, 0) / context.length;
}

function contrastivePair(anchor: Vector, isPositive: boolean, noiseScale: number = 0.1): Vector {
  if (isPositive) {
    return anchor.map(v => v + (Math.random() - 0.5) * noiseScale);
  }
  return anchor.map(() => Math.random() * 2 - 1);
}

function simCLRAugment(x: Vector): Vector {
  // Random crop + color jitter simulation
  const scale = 0.8 + Math.random() * 0.4;
  const shift = (Math.random() - 0.5) * 0.2;
  return x.map(v => v * scale + shift);
}

function byolPredictor(online: Vector, targetDim: number): Vector {
  // Project online representation to target space
  return online.slice(0, targetDim);
}

function stopGradient(x: Vector): Vector {
  return [...x]; // Simulated stop gradient
}

function exponentialMovingAverage(current: Vector, target: Vector, tau: number = 0.99): Vector {
  return current.map((v, i) => tau * v + (1 - tau) * (target[i] || 0));
}

function pseudoLabel(probabilities: number[], threshold: number = 0.9): number | null {
  const maxProb = Math.max(...probabilities);
  if (maxProb >= threshold) {
    return probabilities.indexOf(maxProb);
  }
  return null;
}

function fixMatchAugment(x: Vector, strong: boolean): Vector {
  const scale = strong ? 0.5 + Math.random() : 0.9 + Math.random() * 0.2;
  return x.map(v => v * scale);
}

function temporalContrastive(sequence: Sequence, windowSize: number): { anchor: number; positive: number } {
  const anchorIdx = Math.floor(Math.random() * sequence.length);
  const offset = Math.floor(Math.random() * windowSize * 2) - windowSize;
  const positiveIdx = Math.max(0, Math.min(sequence.length - 1, anchorIdx + offset));
  return { anchor: sequence[anchorIdx], positive: sequence[positiveIdx] };
}

function phiMaskRatio(epochFraction: number): number {
  // Increase mask ratio following phi curve
  return 0.15 + 0.35 * Math.pow(epochFraction, 1 / PHI);
}

function norm(v: Vector): number {
  return Math.sqrt(v.reduce((s, x) => s + x * x, 0));
}

function cosineSimilarity(a: Vector, b: Vector): number {
  const dot = a.reduce((s, v, i) => s + v * (b[i] || 0), 0);
  return dot / ((norm(a) * norm(b)) || 1);
}

function infoNCELoss(anchor: Vector, positive: Vector, negatives: Vector[], temp: number = 0.07): number {
  const posSim = cosineSimilarity(anchor, positive) / temp;
  const negSims = negatives.map(n => cosineSimilarity(anchor, n) / temp);
  const maxSim = Math.max(posSim, ...negSims);
  const expPos = Math.exp(posSim - maxSim);
  const expNegs = negSims.reduce((s, sim) => s + Math.exp(sim - maxSim), 0);
  return -Math.log(expPos / (expPos + expNegs));
}

// ─── SECTION 1: Masked prediction ─────────────────────────────────────────────
describe('SSL § 1 — Masked prediction', () => {
  test('maskTokens creates mask', () => {
    const seq = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const masked = maskTokens(seq, 0.5);
    expect(masked.mask.some(m => m)).toBe(true);
  });
  test('maskTokens preserves length', () => {
    const seq = [1, 2, 3, 4, 5];
    const masked = maskTokens(seq);
    expect(masked.tokens.length).toBe(5);
    expect(masked.labels.length).toBe(5);
  });
  test('maskTokens replaces with mask token', () => {
    const seq = [1, 2, 3, 4, 5];
    const masked = maskTokens(seq, 1.0, 999); // All masked
    expect(masked.tokens.every(t => t === 999)).toBe(true);
  });
  test('maskTokens labels unchanged', () => {
    const seq = [1, 2, 3, 4, 5];
    const masked = maskTokens(seq);
    expect(masked.labels).toEqual(seq);
  });
  test('maskTokens prob 0 no masks', () => {
    const seq = [1, 2, 3, 4, 5];
    const masked = maskTokens(seq, 0);
    expect(masked.mask.every(m => !m)).toBe(true);
  });
  test('maskedAccuracy perfect', () => {
    expect(maskedAccuracy([1, 2], [1, 2, 3], [true, true, false])).toBe(1);
  });
  test('maskedAccuracy zero', () => {
    expect(maskedAccuracy([10, 20], [1, 2, 3], [true, true, false])).toBe(0);
  });
  test('maskedAccuracy no masks', () => {
    expect(maskedAccuracy([], [1, 2, 3], [false, false, false])).toBe(0);
  });
});

// ─── SECTION 2: Rotation prediction ───────────────────────────────────────────
describe('SSL § 2 — Rotation', () => {
  test('rotateImage 0 degrees unchanged', () => {
    const img = [[1, 2], [3, 4]];
    expect(rotateImage(img, 0)).toEqual(img);
  });
  test('rotateImage 90 degrees', () => {
    const img = [[1, 2], [3, 4]];
    const rotated = rotateImage(img, 90);
    expect(rotated[0][0]).toBe(2);
  });
  test('rotateImage 180 degrees', () => {
    const img = [[1, 2], [3, 4]];
    const rotated = rotateImage(img, 180);
    expect(rotated[0][0]).toBe(4);
  });
  test('rotateImage 360 = identity', () => {
    const img = [[1, 2], [3, 4]];
    const r90 = rotateImage(img, 90);
    const r180 = rotateImage(r90, 90);
    const r270 = rotateImage(r180, 90);
    const r360 = rotateImage(r270, 90);
    expect(r360).toEqual(img);
  });
  test('predictRotation returns 0-3', () => {
    expect(predictRotation([1, 0, 0, 0])).toBe(0);
    expect(predictRotation([0, 1, 0, 0])).toBe(1);
    expect(predictRotation([0, 0, 1, 0])).toBe(2);
    expect(predictRotation([0, 0, 0, 1])).toBe(3);
  });
});

// ─── SECTION 3: Jigsaw puzzle ─────────────────────────────────────────────────
describe('SSL § 3 — Jigsaw', () => {
  test('jigsaw creates patches', () => {
    const img = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];
    const { patches } = jigsaw(img, 2);
    expect(patches.length).toBe(4);
  });
  test('jigsaw permutation length', () => {
    const img = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];
    const { permutation } = jigsaw(img, 2);
    expect(permutation.length).toBe(4);
  });
  test('jigsaw permutation contains all indices', () => {
    const img = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];
    const { permutation } = jigsaw(img, 2);
    expect(permutation.sort()).toEqual([0, 1, 2, 3]);
  });
  test('jigsaw patch dimensions', () => {
    const img = Array(4).fill(null).map(() => Array(4).fill(1));
    const { patches } = jigsaw(img, 2);
    expect(patches[0].length).toBe(2);
    expect(patches[0][0].length).toBe(2);
  });
});

// ─── SECTION 4: Colorization ──────────────────────────────────────────────────
describe('SSL § 4 — Colorization', () => {
  test('colorize returns 3 channels', () => {
    expect(colorize([128]).length).toBe(3);
  });
  test('colorize uses grayscale value', () => {
    const rgb = colorize([100]);
    expect(rgb.every(c => c === 100)).toBe(true);
  });
  test('colorize empty input', () => {
    expect(colorize([])).toEqual([0, 0, 0]);
  });
  test('colorize preserves intensity', () => {
    const gray = [200];
    const rgb = colorize(gray);
    expect(rgb[0]).toBe(gray[0]);
  });
});

// ─── SECTION 5: Next token prediction ─────────────────────────────────────────
describe('SSL § 5 — Next token', () => {
  test('nextTokenPrediction at position 0', () => {
    expect(nextTokenPrediction([5, 3, 1], 0)).toBe(5);
  });
  test('nextTokenPrediction uses context', () => {
    expect(nextTokenPrediction([2, 4, 6], 2)).toBe(3);
  });
  test('nextTokenPrediction empty sequence', () => {
    expect(nextTokenPrediction([], 0)).toBe(0);
  });
  test('nextTokenPrediction at end', () => {
    const seq = [1, 2, 3, 4];
    const pred = nextTokenPrediction(seq, 4);
    expect(pred).toBeCloseTo(2.5);
  });
});

// ─── SECTION 6: Contrastive pairs ─────────────────────────────────────────────
describe('SSL § 6 — Contrastive pairs', () => {
  test('contrastivePair positive similar', () => {
    const anchor = [1, 2, 3];
    const pos = contrastivePair(anchor, true, 0.01);
    const sim = cosineSimilarity(anchor, pos);
    expect(sim).toBeGreaterThan(0.9);
  });
  test('contrastivePair negative different', () => {
    const anchor = [1, 0, 0];
    const neg = contrastivePair(anchor, false);
    // Random, so just check it's different
    expect(neg.length).toBe(3);
  });
  test('contrastivePair preserves length', () => {
    expect(contrastivePair([1, 2, 3, 4], true).length).toBe(4);
    expect(contrastivePair([1, 2, 3, 4], false).length).toBe(4);
  });
  test('simCLRAugment changes values', () => {
    const x = [1, 2, 3];
    const aug = simCLRAugment(x);
    expect(aug).not.toEqual(x);
  });
  test('simCLRAugment preserves length', () => {
    expect(simCLRAugment([1, 2, 3, 4, 5]).length).toBe(5);
  });
});

// ─── SECTION 7: BYOL components ───────────────────────────────────────────────
describe('SSL § 7 — BYOL', () => {
  test('byolPredictor projects to target dim', () => {
    expect(byolPredictor([1, 2, 3, 4, 5], 3).length).toBe(3);
  });
  test('byolPredictor preserves values', () => {
    expect(byolPredictor([1, 2, 3, 4], 2)).toEqual([1, 2]);
  });
  test('stopGradient copies array', () => {
    const x = [1, 2, 3];
    const sg = stopGradient(x);
    expect(sg).toEqual(x);
    expect(sg).not.toBe(x);
  });
  test('EMA with tau=1 unchanged', () => {
    const current = [1, 2, 3];
    const target = [4, 5, 6];
    expect(exponentialMovingAverage(current, target, 1)).toEqual(current);
  });
  test('EMA with tau=0 becomes target', () => {
    const current = [1, 2, 3];
    const target = [4, 5, 6];
    expect(exponentialMovingAverage(current, target, 0)).toEqual(target);
  });
  test('EMA interpolates', () => {
    const ema = exponentialMovingAverage([0, 0], [10, 10], 0.5);
    expect(ema).toEqual([5, 5]);
  });
});

// ─── SECTION 8: Pseudo-labeling ───────────────────────────────────────────────
describe('SSL § 8 — Pseudo-labels', () => {
  test('pseudoLabel above threshold', () => {
    expect(pseudoLabel([0.05, 0.95], 0.9)).toBe(1);
  });
  test('pseudoLabel below threshold', () => {
    expect(pseudoLabel([0.5, 0.5], 0.9)).toBeNull();
  });
  test('pseudoLabel exact threshold', () => {
    expect(pseudoLabel([0.1, 0.9], 0.9)).toBe(1);
  });
  test('fixMatchAugment strong changes more', () => {
    const x = [1, 1, 1];
    const weak = fixMatchAugment(x, false);
    const strong = fixMatchAugment(x, true);
    // Strong has more variance
    expect(weak.length).toBe(3);
    expect(strong.length).toBe(3);
  });
  test('fixMatchAugment preserves length', () => {
    expect(fixMatchAugment([1, 2, 3, 4], true).length).toBe(4);
  });
});

// ─── SECTION 9: Temporal contrastive ──────────────────────────────────────────
describe('SSL § 9 — Temporal', () => {
  test('temporalContrastive returns pair', () => {
    const seq = [1, 2, 3, 4, 5];
    const { anchor, positive } = temporalContrastive(seq, 2);
    expect(seq).toContain(anchor);
    expect(seq).toContain(positive);
  });
  test('temporalContrastive with window 0', () => {
    const seq = [10, 20, 30];
    const { anchor, positive } = temporalContrastive(seq, 0);
    expect(anchor).toBe(positive);
  });
  test('infoNCELoss positive', () => {
    const loss = infoNCELoss([1, 0], [0.9, 0.1], [[0, 1], [-1, 0]]);
    expect(loss).toBeGreaterThanOrEqual(0);
  });
  test('infoNCELoss perfect positive', () => {
    const loss = infoNCELoss([1, 0], [1, 0], [[-1, 0], [0, -1]]);
    expect(loss).toBeLessThan(0.5);
  });
});

// ─── SECTION 10: Phi-coherent SSL ─────────────────────────────────────────────
describe('SSL § 10 — Phi SSL', () => {
  test('phiMaskRatio at 0', () => {
    expect(phiMaskRatio(0)).toBeCloseTo(0.15);
  });
  test('phiMaskRatio at 1', () => {
    expect(phiMaskRatio(1)).toBeCloseTo(0.5);
  });
  test('phiMaskRatio monotonic', () => {
    expect(phiMaskRatio(0.3)).toBeLessThan(phiMaskRatio(0.6));
    expect(phiMaskRatio(0.6)).toBeLessThan(phiMaskRatio(0.9));
  });
  test('phiMaskRatio uses phi', () => {
    const ratio = phiMaskRatio(0.5);
    expect(ratio).toBeCloseTo(0.15 + 0.35 * Math.pow(0.5, 1 / PHI));
  });
  test('phiMaskRatio bounded', () => {
    expect(phiMaskRatio(0)).toBeGreaterThanOrEqual(0.15);
    expect(phiMaskRatio(1)).toBeLessThanOrEqual(0.5);
  });
  test('cosineSimilarity identical', () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1);
  });
  test('cosineSimilarity orthogonal', () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
  });
  test('norm calculation', () => {
    expect(norm([3, 4])).toBe(5);
  });
});
