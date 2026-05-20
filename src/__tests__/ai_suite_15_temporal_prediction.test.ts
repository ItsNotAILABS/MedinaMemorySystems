/**
 * AI Suite 15 — Temporal Prediction
 * ============================================================
 * Exponential smoothing, ARIMA-style differencing, trend detection,
 * seasonal decomposition, autocorrelation, moving average, and
 * φ-weighted forecasting.
 *
 * Target: 140+ tests   Charter: AIS-TEMP-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Implementations ──────────────────────────────────────────────────────────

function expSmooth(data: number[], alpha: number): number[] {
  const out: number[] = [data[0]];
  for (let i = 1; i < data.length; i++) {
    out.push(alpha * data[i] + (1 - alpha) * out[i - 1]);
  }
  return out;
}

function difference(data: number[], lag = 1): number[] {
  return data.slice(lag).map((v, i) => v - data[i]);
}

function autoCorrelation(data: number[], lag: number): number {
  const mu = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((s, v) => s + (v - mu) ** 2, 0);
  const cov = data.slice(0, data.length - lag)
    .reduce((s, v, i) => s + (v - mu) * (data[i + lag] - mu), 0);
  return variance === 0 ? 0 : cov / variance;
}

function movingAverage(data: number[], window: number): number[] {
  return data.slice(window - 1).map((_, i) => {
    const slice = data.slice(i, i + window);
    return slice.reduce((a, b) => a + b, 0) / window;
  });
}

function trend(data: number[]): number {
  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const xMean = (n - 1) / 2;
  const yMean = data.reduce((a, b) => a + b, 0) / n;
  const num = x.reduce((s, xi, i) => s + (xi - xMean) * (data[i] - yMean), 0);
  const den = x.reduce((s, xi) => s + (xi - xMean) ** 2, 0);
  return den === 0 ? 0 : num / den;
}

function seasonal(data: number[], period: number): number[] {
  const nPeriods = Math.floor(data.length / period);
  return Array.from({ length: period }, (_, s) => {
    const vals = Array.from({ length: nPeriods }, (__, p) => data[p * period + s]);
    return vals.reduce((a, b) => a + b, 0) / nPeriods;
  });
}

function forecastNext(data: number[], alpha: number, beta: number): number {
  if (data.length < 2) return data[0];
  const smoothed = expSmooth(data, alpha);
  const trendSlope = trend(smoothed);
  return smoothed[smoothed.length - 1] + beta * trendSlope;
}

function phiForecast(data: number[]): number {
  const n = data.length;
  const weights = Array.from({ length: n }, (_, i) => Math.pow(PHI, -(n - i)));
  const wSum = weights.reduce((a, b) => a + b, 0);
  return data.reduce((s, v, i) => s + v * weights[i], 0) / wSum;
}

function mae(predicted: number[], actual: number[]): number {
  return predicted.reduce((s, p, i) => s + Math.abs(p - actual[i]), 0) / predicted.length;
}

function rmse(predicted: number[], actual: number[]): number {
  return Math.sqrt(predicted.reduce((s, p, i) => s + (p - actual[i]) ** 2, 0) / predicted.length);
}

// ─── SECTION 1: Exponential smoothing ─────────────────────────────────────────
describe('Temp § 1 — Exponential smoothing', () => {
  test('ES preserves length',         () => expect(expSmooth([1, 2, 3], 0.5).length).toBe(3));
  test('ES first value = data[0]',    () => expect(expSmooth([5, 1, 1], 0.5)[0]).toBe(5));
  test('alpha=1 → identity',          () => {
    const data = [1, 2, 3, 4];
    expSmooth(data, 1).forEach((v, i) => expect(v).toBe(data[i]));
  });
  test('alpha=0 → constant first',    () => {
    const data = [5, 1, 1, 1];
    expSmooth(data, 0).forEach(v => expect(v).toBe(5));
  });
  test('alpha=0.5 midpoint',          () => {
    const out = expSmooth([0, 10], 0.5);
    expect(out[1]).toBe(5);
  });
  test('ES reduces noise (monotone trend)', () => {
    const data = [1, 2, 3, 4, 5];
    const sm = expSmooth(data, 0.3);
    expect(sm[sm.length - 1]).toBeLessThan(data[data.length - 1]);
  });
  test('ES output is finite',          () => {
    expSmooth([1, 2, 3, 4, 5], 0.4).forEach(v => expect(isFinite(v)).toBe(true));
  });
});

// ─── SECTION 2: Differencing ───────────────────────────────────────────────────
describe('Temp § 2 — Differencing', () => {
  test('lag-1 of constant = zeros',   () => {
    expect(difference([3, 3, 3])).toEqual([0, 0]);
  });
  test('lag-1 of arithmetic = constant', () => {
    expect(difference([1, 2, 3, 4])).toEqual([1, 1, 1]);
  });
  test('output length = n - lag',     () => expect(difference([1, 2, 3, 4, 5], 2).length).toBe(3));
  test('lag=1 default',               () => expect(difference([0, 5, 10]).length).toBe(2));
  test('difference sign matches slope', () => {
    const d = difference([10, 5, 1]);
    expect(d[0]).toBeLessThan(0);
  });
  test('double differencing removes quadratic', () => {
    const quad = [0, 1, 4, 9, 16];
    const d1 = difference(quad);
    const d2 = difference(d1);
    d2.forEach(v => expect(v).toBeCloseTo(2));
  });
});

// ─── SECTION 3: Autocorrelation ────────────────────────────────────────────────
describe('Temp § 3 — Autocorrelation', () => {
  test('lag-0 = 1',             () => expect(autoCorrelation([1, 2, 3, 4, 5], 0)).toBeCloseTo(1));
  test('lag-1 positive trend', () => {
    expect(autoCorrelation([1, 2, 3, 4, 5], 1)).toBeGreaterThan(0);
  });
  test('constant series → 0 (by variance convention)', () => {
    expect(autoCorrelation([5, 5, 5, 5], 1)).toBe(0);
  });
  test('periodic series high AC at period', () => {
    const data = [1, -1, 1, -1, 1, -1, 1, -1];
    expect(autoCorrelation(data, 2)).toBeGreaterThan(0.5);
  });
  test('AC ∈ [-1,1]', () => {
    const ac = autoCorrelation([1, 3, 2, 5, 4, 6], 1);
    expect(ac).toBeGreaterThanOrEqual(-1 - 1e-9);
    expect(ac).toBeLessThanOrEqual(1 + 1e-9);
  });
});

// ─── SECTION 4: Moving average ─────────────────────────────────────────────────
describe('Temp § 4 — Moving average', () => {
  test('MA of constant = constant',   () => {
    movingAverage([5, 5, 5, 5], 2).forEach(v => expect(v).toBe(5));
  });
  test('MA window=1 = original',      () => {
    const data = [1, 2, 3];
    movingAverage(data, 1).forEach((v, i) => expect(v).toBe(data[i]));
  });
  test('MA output length = n - w + 1', () => {
    expect(movingAverage([1, 2, 3, 4, 5], 3).length).toBe(3);
  });
  test('MA first value correct',      () => {
    expect(movingAverage([2, 4, 6, 8], 2)[0]).toBe(3);
  });
  test('MA smooths spike',            () => {
    const data = [1, 1, 100, 1, 1, 1];
    const ma = movingAverage(data, 3);
    expect(Math.max(...ma)).toBeLessThan(100);
  });
  test('MA non-negative for positive data', () => {
    movingAverage([1, 2, 3, 4], 2).forEach(v => expect(v).toBeGreaterThan(0));
  });
});

// ─── SECTION 5: Trend detection ────────────────────────────────────────────────
describe('Temp § 5 — Trend', () => {
  test('positive slope for increasing data', () => {
    expect(trend([1, 2, 3, 4, 5])).toBeGreaterThan(0);
  });
  test('negative slope for decreasing data', () => {
    expect(trend([5, 4, 3, 2, 1])).toBeLessThan(0);
  });
  test('zero slope for constant data',       () => {
    expect(trend([3, 3, 3, 3])).toBeCloseTo(0);
  });
  test('slope = 1 for unit steps',           () => {
    expect(trend([0, 1, 2, 3, 4])).toBeCloseTo(1);
  });
  test('slope = 2 for step 2',               () => {
    expect(trend([0, 2, 4, 6])).toBeCloseTo(2);
  });
  test('slope finite',                       () => expect(isFinite(trend([1, 2, 3]))).toBe(true));
});

// ─── SECTION 6: Seasonal decomposition ────────────────────────────────────────
describe('Temp § 6 — Seasonal', () => {
  const data = [1, 10, 2, 11, 3, 12, 4, 13];

  test('seasonal length = period',          () => expect(seasonal(data, 2).length).toBe(2));
  test('seasonal captures odd/even pattern', () => {
    const s = seasonal(data, 2);
    expect(s[1]).toBeGreaterThan(s[0]);
  });
  test('seasonal period=1 = global mean',   () => {
    const s = seasonal([2, 4, 6], 1);
    expect(s[0]).toBeCloseTo(4);
  });
  test('seasonal values finite',            () => {
    seasonal(data, 2).forEach(v => expect(isFinite(v)).toBe(true));
  });
});

// ─── SECTION 7: φ-weighted forecast ───────────────────────────────────────────
describe('Temp § 7 — φ-forecast', () => {
  test('forecast is finite',               () => expect(isFinite(phiForecast([1, 2, 3]))).toBe(true));
  test('forecast closer to recent values', () => {
    const data = [1, 1, 1, 100];
    expect(phiForecast(data)).toBeGreaterThan(40);
  });
  test('constant series → that value',     () => {
    expect(phiForecast([5, 5, 5])).toBeCloseTo(5, 5);
  });
  test('single value → itself',            () => expect(phiForecast([7])).toBeCloseTo(7));
  test('increasing data: forecast > mean', () => {
    const data = [1, 2, 3, 4, 5];
    const mu = data.reduce((a, b) => a + b, 0) / data.length;
    expect(phiForecast(data)).toBeGreaterThan(mu);
  });
});

// ─── SECTION 8: Error metrics ──────────────────────────────────────────────────
describe('Temp § 8 — Error metrics', () => {
  test('MAE of perfect prediction = 0', () => expect(mae([1, 2, 3], [1, 2, 3])).toBe(0));
  test('MAE non-negative',              () => expect(mae([1, 3], [2, 1])).toBeGreaterThan(0));
  test('MAE symmetric',                 () => {
    expect(mae([1, 2], [3, 4])).toBeCloseTo(mae([3, 4], [1, 2]));
  });
  test('RMSE of perfect prediction = 0',() => expect(rmse([1, 2], [1, 2])).toBe(0));
  test('RMSE ≥ MAE',                    () => {
    expect(rmse([0, 10], [5, 5])).toBeGreaterThanOrEqual(mae([0, 10], [5, 5]));
  });
  test('RMSE penalizes large errors',   () => {
    expect(rmse([0], [10])).toBeGreaterThan(rmse([0], [1]));
  });
  test('RMSE is finite',                () => {
    expect(isFinite(rmse([1, 2, 3], [4, 5, 6]))).toBe(true);
  });
});
