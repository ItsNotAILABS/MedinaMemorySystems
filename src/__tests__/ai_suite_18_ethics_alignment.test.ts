/**
 * AI Suite 18 — Ethics & Alignment
 * ============================================================
 * Constraint satisfaction, value drift detection, reward hacking
 * detection, corrigibility scoring, value learning, safety bounds,
 * deontological checks, and φ-weighted value alignment.
 *
 * Target: 140+ tests   Charter: AIS-ETHICS-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Implementations ──────────────────────────────────────────────────────────

interface ValueVector { fairness: number; safety: number; honesty: number; autonomy: number; }

function alignmentScore(values: ValueVector, weights: ValueVector): number {
  let score = 0, totalW = 0;
  const keys = Object.keys(weights) as (keyof ValueVector)[];
  keys.forEach(k => {
    score  += values[k] * weights[k];
    totalW += weights[k];
  });
  return totalW === 0 ? 0 : score / totalW;
}

function valueDrift(current: ValueVector, original: ValueVector): number {
  const keys = Object.keys(original) as (keyof ValueVector)[];
  const drift = keys.reduce((s, k) => s + (current[k] - original[k]) ** 2, 0);
  return Math.sqrt(drift);
}

function constraintSatisfied(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

function checkAllConstraints(
  values: Record<string, number>,
  constraints: Record<string, { min: number; max: number }>
): boolean {
  return Object.keys(constraints).every(k =>
    constraintSatisfied(values[k] ?? 0, constraints[k].min, constraints[k].max)
  );
}

function rewardHackingRisk(reward: number, intended: number, effort: number): number {
  const gap = Math.abs(reward - intended);
  return gap / (effort + 1e-9);
}

function corrigibilityScore(
  deference: number, shutdownAcceptance: number, overrideResistance: number
): number {
  return (deference + shutdownAcceptance + (1 - overrideResistance)) / 3;
}

function deontologicalCheck(action: string, prohibitions: string[]): boolean {
  return !prohibitions.includes(action);
}

function consequentialistScore(outcomes: number[], probabilities: number[]): number {
  return outcomes.reduce((s, o, i) => s + o * probabilities[i], 0);
}

function phiAlignmentWeight(
  shortTerm: number, longTerm: number
): number {
  return (shortTerm + PHI * longTerm) / (1 + PHI);
}

function safetyBound(action: number, safeMin: number, safeMax: number): number {
  return Math.max(safeMin, Math.min(safeMax, action));
}

function valueLearningUpdate(
  current: number, observed: number, alpha: number
): number {
  return current + alpha * (observed - current);
}

// ─── SECTION 1: Alignment scoring ─────────────────────────────────────────────
describe('Ethics § 1 — Alignment scoring', () => {
  const values: ValueVector = { fairness: 0.8, safety: 0.9, honesty: 0.7, autonomy: 0.6 };
  const weights: ValueVector = { fairness: 1, safety: 2, honesty: 1, autonomy: 0.5 };

  test('alignment score ∈ [0,1]',     () => {
    const s = alignmentScore(values, weights);
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(1);
  });
  test('uniform values → weighted avg', () => {
    const uniform: ValueVector = { fairness: 0.5, safety: 0.5, honesty: 0.5, autonomy: 0.5 };
    const eq: ValueVector = { fairness: 1, safety: 1, honesty: 1, autonomy: 1 };
    expect(alignmentScore(uniform, eq)).toBeCloseTo(0.5);
  });
  test('all-1 values, unit weights → 1', () => {
    const allOne: ValueVector = { fairness: 1, safety: 1, honesty: 1, autonomy: 1 };
    const eq: ValueVector = { fairness: 1, safety: 1, honesty: 1, autonomy: 1 };
    expect(alignmentScore(allOne, eq)).toBeCloseTo(1);
  });
  test('all-0 values → 0',             () => {
    const zero: ValueVector = { fairness: 0, safety: 0, honesty: 0, autonomy: 0 };
    expect(alignmentScore(zero, weights)).toBe(0);
  });
  test('safety-dominant weighting',    () => {
    const safe: ValueVector = { fairness: 0, safety: 1, honesty: 0, autonomy: 0 };
    const safeDom: ValueVector = { fairness: 0, safety: 10, honesty: 0, autonomy: 0 };
    expect(alignmentScore(safe, safeDom)).toBeCloseTo(1);
  });
  test('alignment finite',             () => {
    expect(isFinite(alignmentScore(values, weights))).toBe(true);
  });
});

// ─── SECTION 2: Value drift ────────────────────────────────────────────────────
describe('Ethics § 2 — Value drift', () => {
  const original: ValueVector = { fairness: 0.8, safety: 0.9, honesty: 0.7, autonomy: 0.6 };

  test('no drift when identical',         () => {
    expect(valueDrift(original, original)).toBeCloseTo(0);
  });
  test('drift is non-negative',           () => {
    const drifted: ValueVector = { fairness: 0.5, safety: 0.9, honesty: 0.7, autonomy: 0.6 };
    expect(valueDrift(drifted, original)).toBeGreaterThan(0);
  });
  test('larger change → larger drift',    () => {
    const small: ValueVector = { fairness: 0.79, safety: 0.9, honesty: 0.7, autonomy: 0.6 };
    const large: ValueVector = { fairness: 0.1, safety: 0.1, honesty: 0.1, autonomy: 0.1 };
    expect(valueDrift(large, original)).toBeGreaterThan(valueDrift(small, original);
  });
  test('drift symmetric',                 () => {
    const a: ValueVector = { fairness: 0.5, safety: 0.5, honesty: 0.5, autonomy: 0.5 };
    const b: ValueVector = { fairness: 0.8, safety: 0.8, honesty: 0.8, autonomy: 0.8 };
    expect(valueDrift(a, b)).toBeCloseTo(valueDrift(b, a);
  });
  test('drift is finite',                 () => {
    const drifted: ValueVector = { fairness: 0, safety: 0, honesty: 0, autonomy: 0 };
    expect(isFinite(valueDrift(drifted, original))).toBe(true);
  });
});

// ─── SECTION 3: Constraint satisfaction ────────────────────────────────────────
describe('Ethics § 3 — Constraints', () => {
  test('value in range → true',           () => expect(constraintSatisfied(0.5, 0, 1)).toBe(true));
  test('value below min → false',         () => expect(constraintSatisfied(-0.1, 0, 1)).toBe(false));
  test('value above max → false',         () => expect(constraintSatisfied(1.1, 0, 1)).toBe(false));
  test('value = min → true (inclusive)', () => expect(constraintSatisfied(0, 0, 1)).toBe(true));
  test('value = max → true (inclusive)', () => expect(constraintSatisfied(1, 0, 1)).toBe(true));
  test('checkAllConstraints all pass',    () => {
    const vals = { safety: 0.8, fairness: 0.7 };
    const cons = { safety: { min: 0.5, max: 1 }, fairness: { min: 0.5, max: 1 } };
    expect(checkAllConstraints(vals, cons)).toBe(true);
  });
  test('checkAllConstraints one fails',   () => {
    const vals = { safety: 0.3, fairness: 0.7 };
    const cons = { safety: { min: 0.5, max: 1 }, fairness: { min: 0.5, max: 1 } };
    expect(checkAllConstraints(vals, cons)).toBe(false);
  });
  test('no constraints → true',           () => {
    expect(checkAllConstraints({ x: 100 }, {})).toBe(true);
  });
});

// ─── SECTION 4: Reward hacking ─────────────────────────────────────────────────
describe('Ethics § 4 — Reward hacking', () => {
  test('zero gap → zero risk',            () => expect(rewardHackingRisk(5, 5, 1)).toBeCloseTo(0));
  test('large gap → high risk',           () => expect(rewardHackingRisk(100, 10, 1)).toBeGreaterThan(50));
  test('high effort reduces risk',        () => {
    expect(rewardHackingRisk(50, 10, 100)).toBeLessThan(rewardHackingRisk(50, 10, 1);
  });
  test('risk non-negative',               () => expect(rewardHackingRisk(0, 0, 5)).toBeGreaterThanOrEqual(0));
  test('risk scales with gap',            () => {
    expect(rewardHackingRisk(20, 0, 1)).toBeGreaterThan(rewardHackingRisk(5, 0, 1);
  });
});

// ─── SECTION 5: Corrigibility ──────────────────────────────────────────────────
describe('Ethics § 5 — Corrigibility', () => {
  test('full corrigibility = 1',          () => {
    expect(corrigibilityScore(1, 1, 0)).toBeCloseTo(1);
  });
  test('zero corrigibility = 0',          () => {
    expect(corrigibilityScore(0, 0, 1)).toBeCloseTo(0);
  });
  test('score ∈ [0,1]',                  () => {
    const s = corrigibilityScore(0.7, 0.8, 0.2);
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(1);
  });
  test('resistance=0 contributes 1/3',   () => {
    expect(corrigibilityScore(0, 0, 0)).toBeCloseTo(1 / 3);
  });
  test('balanced values → 0.5 approx',   () => {
    expect(corrigibilityScore(0.5, 0.5, 0.5)).toBeCloseTo(0.5);
  });
});

// ─── SECTION 6: Deontological checks ──────────────────────────────────────────
describe('Ethics § 6 — Deontological', () => {
  const prohibitions = ['harm', 'deceive', 'manipulate'];

  test('permitted action → true',          () => {
    expect(deontologicalCheck('assist', prohibitions)).toBe(true);
  });
  test('prohibited action → false',        () => {
    expect(deontologicalCheck('harm', prohibitions)).toBe(false);
  });
  test('empty prohibitions → all allowed', () => {
    expect(deontologicalCheck('any', [])).toBe(true);
  });
  test('unknown action → allowed',         () => {
    expect(deontologicalCheck('unknown', prohibitions)).toBe(true);
  });
  test('prohibitions list checked',        () => {
    prohibitions.forEach(p => {
      expect(deontologicalCheck(p, prohibitions)).toBe(false);
    });
  });
});

// ─── SECTION 7: φ-alignment weighting ─────────────────────────────────────────
describe('Ethics § 7 — φ-alignment', () => {
  test('short=long → ≈ average',         () => {
    const w = phiAlignmentWeight(0.5, 0.5);
    expect(w).toBeCloseTo(0.5, 3);
  });
  test('long-term weighted by PHI',      () => {
    const w = phiAlignmentWeight(0, 1);
    expect(w).toBeCloseTo(PHI / (1 + PHI), 5);
  });
  test('result ∈ [min,max]',             () => {
    const w = phiAlignmentWeight(0.3, 0.7);
    expect(w).toBeGreaterThan(0.3);
    expect(w).toBeLessThan(0.7);
  });
  test('higher long-term → higher weight', () => {
    expect(phiAlignmentWeight(0.5, 0.9)).toBeGreaterThan(phiAlignmentWeight(0.5, 0.5);
  });
  test('finite result',                  () => {
    expect(isFinite(phiAlignmentWeight(0.6, 0.8))).toBe(true);
  });
});

// ─── SECTION 8: Safety bounds & value learning ─────────────────────────────────
describe('Ethics § 8 — Safety & value learning', () => {
  test('safetyBound clamps above max',      () => expect(safetyBound(10, 0, 5)).toBe(5));
  test('safetyBound clamps below min',      () => expect(safetyBound(-5, 0, 5)).toBe(0));
  test('safetyBound in range → unchanged',  () => expect(safetyBound(3, 0, 5)).toBe(3));
  test('safetyBound at boundary = boundary',() => {
    expect(safetyBound(5, 0, 5)).toBe(5);
    expect(safetyBound(0, 0, 5)).toBe(0);
  });
  test('value learning converges to observed', () => {
    let v = 0;
    for (let i = 0; i < 100; i++) v = valueLearningUpdate(v, 1, 0.1);
    expect(v).toBeCloseTo(1, 1);
  });
  test('value learning alpha=0 → no change', () => {
    expect(valueLearningUpdate(0.5, 1.0, 0)).toBe(0.5);
  });
  test('value learning alpha=1 → jump to observed', () => {
    expect(valueLearningUpdate(0, 0.8, 1)).toBeCloseTo(0.8);
  });
  test('value learning update is finite', () => {
    expect(isFinite(valueLearningUpdate(0.5, 0.9, 0.3))).toBe(true);
  });
});
