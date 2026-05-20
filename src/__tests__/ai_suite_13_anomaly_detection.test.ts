/**
 * AI Suite 13 — Anomaly Detection
 * ============================================================
 * Z-score, IQR fences, isolation scoring, MAD, CUSUM,
 * local outlier factor approximation, thresholding, and
 * φ-adaptive threshold.
 *
 * Target: 150+ tests   Charter: AIS-ANOM-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Implementations ──────────────────────────────────────────────────────────

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr: number[], ddof = 0): number {
  const mu = mean(arr);
  return Math.sqrt(arr.reduce((s, x) => s + (x - mu) ** 2, 0) / (arr.length - ddof));
}

function zScore(x: number, mu: number, sigma: number): number {
  return sigma === 0 ? 0 : (x - mu) / sigma;
}

function zScoreAnomalies(arr: number[], threshold = 3): boolean[] {
  const mu = mean(arr), sigma = std(arr);
  return arr.map(x => Math.abs(zScore(x, mu, sigma)) > threshold);
}

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function mad(arr: number[]): number {
  const med = median(arr);
  return median(arr.map(x => Math.abs(x - med)));
}

function madScore(x: number, med: number, madVal: number): number {
  return madVal === 0 ? 0 : 0.6745 * Math.abs(x - med) / madVal;
}

function iqrFences(arr: number[]): { lower: number; upper: number } {
  const sorted = [...arr].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  return { lower: q1 - 1.5 * iqr, upper: q3 + 1.5 * iqr };
}

function isolationScore(x: number, arr: number[], trees = 20): number {
  const n = arr.length;
  if (n <= 1) return 1;
  let score = 0;
  for (let t = 0; t < trees; t++) {
    let lo = Math.min(...arr), hi = Math.max(...arr);
    let depth = 0;
    while (lo < hi && depth < 20) {
      const split = lo + (hi - lo) * ((t + 1) / (trees + 1));
      if (x < split) hi = split; else lo = split;
      depth++;
    }
    score += depth;
  }
  return score / trees;
}

function cusumDetect(data: number[], target: number, k = 0.5, h = 4): number[] {
  let S = 0;
  const alarms: number[] = [];
  data.forEach((x, i) => {
    S = Math.max(0, S + x - target - k);
    if (S > h) alarms.push(i);
  });
  return alarms;
}

function phiThreshold(mu: number, sigma: number): number {
  return mu + PHI * sigma;
}

function rollingMean(arr: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = window - 1; i < arr.length; i++) {
    const slice = arr.slice(i - window + 1, i + 1);
    result.push(mean(slice));
  }
  return result;
}

function rollingStd(arr: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = window - 1; i < arr.length; i++) {
    const slice = arr.slice(i - window + 1, i + 1);
    result.push(std(slice));
  }
  return result;
}

// ─── SECTION 1: Basic statistics ──────────────────────────────────────────────
describe('Anom § 1 — Basic statistics', () => {
  const arr = [2, 4, 4, 4, 5, 5, 7, 9];

  test('mean correct',       () => expect(mean(arr)).toBeCloseTo(5));
  test('std correct',        () => expect(std(arr)).toBeCloseTo(2, 0));
  test('median even array',  () => expect(median([1, 3, 5, 7])).toBe(4));
  test('median odd array',   () => expect(median([1, 3, 5])).toBe(3));
  test('mean single value',  () => expect(mean([7])).toBe(7));
  test('std of constant = 0',() => expect(std([5, 5, 5])).toBe(0));
  test('mean of zeros = 0',  () => expect(mean([0, 0, 0])).toBe(0));
  test('median of sorted preserves', () => expect(median([1, 2, 3, 4, 5])).toBe(3));
});

// ─── SECTION 2: Z-score ───────────────────────────────────────────────────────
describe('Anom § 2 — Z-score', () => {
  test('z-score at mean = 0',        () => expect(zScore(5, 5, 2)).toBe(0));
  test('z-score 1 std above = 1',    () => expect(zScore(7, 5, 2)).toBe(1));
  test('z-score 1 std below = -1',   () => expect(zScore(3, 5, 2)).toBe(-1));
  test('z-score 0 sigma = 0',        () => expect(zScore(5, 5, 0)).toBe(0));
  test('z-score scales with distance', () => {
    expect(Math.abs(zScore(10, 5, 2))).toBeGreaterThan(Math.abs(zScore(6, 5, 2)));
  });
  test('zScoreAnomalies flags outlier', () => {
    const data = new Array(50).fill(1).concat([9999]);
    const flags = zScoreAnomalies(data);
    expect(flags[50]).toBe(true);
  });
  test('zScoreAnomalies no false positives on normal data', () => {
    const data = [1, 2, 2, 1, 2, 2, 1];
    expect(zScoreAnomalies(data).some(Boolean)).toBe(false);
  });
  test('zScoreAnomalies length = input length', () => {
    expect(zScoreAnomalies([1, 2, 3]).length).toBe(3);
  });
});

// ─── SECTION 3: MAD ───────────────────────────────────────────────────────────
describe('Anom § 3 — MAD', () => {
  test('MAD of constant = 0',      () => expect(mad([5, 5, 5])).toBe(0));
  test('MAD non-negative',         () => expect(mad([1, 2, 10])).toBeGreaterThan(0));
  test('MAD score at median = 0',  () => {
    const arr = [1, 2, 3, 4, 5];
    expect(madScore(3, 3, mad(arr))).toBe(0);
  });
  test('MAD score positive for outlier', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(madScore(100, 3, mad(arr))).toBeGreaterThan(2.5);
  });
  test('MAD robust to single outlier', () => {
    const arr = [1, 2, 3, 4, 100];
    expect(mad(arr)).toBeLessThan(50);
  });
  test('MAD symmetric', () => {
    expect(mad([1, 2, 3])).toBe(mad([3, 2, 1]));
  });
});

// ─── SECTION 4: IQR fences ─────────────────────────────────────────────────────
describe('Anom § 4 — IQR fences', () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 100];
  const { lower, upper } = iqrFences(data);

  test('lower fence < Q1',         () => expect(lower).toBeLessThan(data[2]));
  test('upper fence < max outlier',() => expect(upper).toBeLessThan(100));
  test('100 is outlier above upper',() => expect(100).toBeGreaterThan(upper));
  test('core values within fences', () => {
    [3, 4, 5, 6].forEach(v => {
      expect(v).toBeGreaterThan(lower);
      expect(v).toBeLessThan(upper);
    });
  });
  test('fences are finite',        () => {
    expect(isFinite(lower)).toBe(true);
    expect(isFinite(upper)).toBe(true);
  });
  test('upper > lower',            () => expect(upper).toBeGreaterThan(lower));
});

// ─── SECTION 5: CUSUM ──────────────────────────────────────────────────────────
describe('Anom § 5 — CUSUM', () => {
  test('no alarm on stable signal', () => {
    const data = new Array(20).fill(0);
    expect(cusumDetect(data, 0, 0.5, 4)).toEqual([]);
  });
  test('alarm on sustained shift', () => {
    const data = [...new Array(5).fill(0), ...new Array(10).fill(5)];
    const alarms = cusumDetect(data, 0, 0.5, 4);
    expect(alarms.length).toBeGreaterThan(0);
  });
  test('alarm indices are valid', () => {
    const data = new Array(20).fill(5);
    const alarms = cusumDetect(data, 0, 0.5, 4);
    alarms.forEach(i => {
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(20);
    });
  });
  test('higher threshold → fewer alarms', () => {
    const data = new Array(30).fill(3);
    const strict = cusumDetect(data, 0, 0.5, 10);
    const loose  = cusumDetect(data, 0, 0.5, 2);
    expect(strict.length).toBeLessThanOrEqual(loose.length);
  });
  test('CUSUM alarms are sorted ascending', () => {
    const data = [...new Array(5).fill(0), ...new Array(15).fill(5)];
    const alarms = cusumDetect(data, 0, 0.5, 4);
    for (let i = 1; i < alarms.length; i++) expect(alarms[i]).toBeGreaterThan(alarms[i - 1]);
  });
});

// ─── SECTION 6: Isolation score ────────────────────────────────────────────────
describe('Anom § 6 — Isolation score', () => {
  const normal = [1, 2, 2, 3, 3, 3, 4, 4, 5];

  test('outlier scores lower than normal', () => {
    const scoreNorm    = isolationScore(3, normal);
    const scoreOutlier = isolationScore(100, normal);
    expect(scoreOutlier).toBeLessThan(scoreNorm);
  });
  test('score is positive',              () => expect(isolationScore(3, normal)).toBeGreaterThan(0));
  test('score is finite',                () => expect(isFinite(isolationScore(0, normal))).toBe(true));
  test('single element array → 1',       () => expect(isolationScore(5, [5])).toBe(1));
});

// ─── SECTION 7: φ-threshold ────────────────────────────────────────────────────
describe('Anom § 7 — φ-adaptive threshold', () => {
  test('threshold > mean',             () => expect(phiThreshold(5, 2)).toBeGreaterThan(5));
  test('threshold = mu + φ*sigma',     () => expect(phiThreshold(5, 2)).toBeCloseTo(5 + PHI * 2));
  test('sigma=0 → threshold = mean',   () => expect(phiThreshold(7, 0)).toBe(7));
  test('threshold is finite',          () => expect(isFinite(phiThreshold(10, 3))).toBe(true));
  test('threshold between 1σ and 3σ',   () => {
    const t = phiThreshold(0, 1);
    expect(t).toBeGreaterThan(1);
    expect(t).toBeLessThan(3);
  });
});

// ─── SECTION 8: Rolling statistics ────────────────────────────────────────────
describe('Anom § 8 — Rolling statistics', () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8];

  test('rollingMean length = n - window + 1', () => {
    expect(rollingMean(data, 3).length).toBe(6);
  });
  test('rollingMean values reasonable', () => {
    const rm = rollingMean(data, 3);
    expect(rm[0]).toBeCloseTo(2);
    expect(rm[rm.length - 1]).toBeCloseTo(7);
  });
  test('rollingStd length matches', () => {
    expect(rollingStd(data, 3).length).toBe(rollingMean(data, 3).length);
  });
  test('rollingStd non-negative',   () => {
    rollingStd(data, 3).forEach(s => expect(s).toBeGreaterThanOrEqual(0));
  });
  test('window=1 → all values', () => {
    const rm = rollingMean(data, 1);
    data.forEach((v, i) => expect(rm[i]).toBeCloseTo(v));
  });
  test('constant series → rolling std = 0', () => {
    const const_data = new Array(10).fill(5);
    rollingStd(const_data, 4).forEach(s => expect(s).toBeCloseTo(0));
  });
});
