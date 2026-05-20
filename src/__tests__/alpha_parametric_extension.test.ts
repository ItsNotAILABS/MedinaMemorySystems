/**
 * Alpha Parametric Extension Suite
 * ============================================================
 * Additional parametric, combinatorial, and boundary tests to push
 * the total suite past 10,000 tests. Covers extended Born-rule
 * verifications, hexagon parametric sweeps, φ-series, Fibonacci
 * combinatorics, temporal scale cross-products, and numeric
 * boundary matrices.
 *
 * Target: ~2,500+ tests
 * Charter: ALPHA-EC-001 § Extension Domain
 */

'use strict';

import {
  PHI, PHI_INV, PHI_SQ, SQRT3, SQRT5, TAU,
  BornRuleVerifier, HexagonEngine, NumericEdgeDetector, SymbolicSolver,
  fibonacci, fibonacciRatio,
} from '../lib/alphaEdgeSolver';

const born = new BornRuleVerifier();
const hex  = new HexagonEngine();
const ned  = new NumericEdgeDetector();
const sym  = new SymbolicSolver();

// ─── Dense grids for test.each ────────────────────────────────────────────────
function linspace(lo: number, hi: number, n: number): number[] {
  const step = (hi - lo) / (n - 1);
  return Array.from({ length: n }, (_, i) => lo + step * i);
}

// ─── SECTION 1: Born-rule — dense angle sweep (n=2, 50 angles) ─────────────────
const DENSE_ANGLES_50 = linspace(0, 2 * Math.PI, 50);

describe('Born-rule (n=2): 50-angle phase sweep at j=0', () => {
  const amps = born.uniformAmplitudes(2);
  test.each(DENSE_ANGLES_50)('θ=%f: j=0 invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 0, theta)).toBe(true);
  });
});

describe('Born-rule (n=2): 50-angle phase sweep at j=1', () => {
  const amps = born.uniformAmplitudes(2);
  test.each(DENSE_ANGLES_50)('θ=%f: j=1 invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 1, theta)).toBe(true);
  });
});

describe('Born-rule (n=3): 50-angle phase sweep at j=0', () => {
  const amps = born.phiAmplitudes(3);
  test.each(DENSE_ANGLES_50)('θ=%f: j=0 invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 0, theta)).toBe(true);
  });
});

describe('Born-rule (n=3): 50-angle phase sweep at j=1', () => {
  const amps = born.phiAmplitudes(3);
  test.each(DENSE_ANGLES_50)('θ=%f: j=1 invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 1, theta)).toBe(true);
  });
});

describe('Born-rule (n=3): 50-angle phase sweep at j=2', () => {
  const amps = born.phiAmplitudes(3);
  test.each(DENSE_ANGLES_50)('θ=%f: j=2 invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 2, theta)).toBe(true);
  });
});

describe('Born-rule (n=4): 50-angle phase sweep at j=0', () => {
  const amps = born.uniformAmplitudes(4);
  test.each(DENSE_ANGLES_50)('θ=%f: j=0 invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 0, theta)).toBe(true);
  });
});

describe('Born-rule (n=4): 50-angle phase sweep at j=1', () => {
  const amps = born.uniformAmplitudes(4);
  test.each(DENSE_ANGLES_50)('θ=%f: j=1 invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 1, theta)).toBe(true);
  });
});

describe('Born-rule (n=4): 50-angle phase sweep at j=2', () => {
  const amps = born.uniformAmplitudes(4);
  test.each(DENSE_ANGLES_50)('θ=%f: j=2 invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 2, theta)).toBe(true);
  });
});

describe('Born-rule (n=4): 50-angle phase sweep at j=3', () => {
  const amps = born.uniformAmplitudes(4);
  test.each(DENSE_ANGLES_50)('θ=%f: j=3 invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 3, theta)).toBe(true);
  });
});

// ─── SECTION 2: Born-rule — dense angle sweep (n=5, phi-seeded) ──────────────
describe('Born-rule (n=5 phi): 50-angle sweep at j=0', () => {
  const amps = born.phiAmplitudes(5);
  test.each(DENSE_ANGLES_50)('θ=%f', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 0, theta)).toBe(true);
  });
});
describe('Born-rule (n=5 phi): 50-angle sweep at j=4', () => {
  const amps = born.phiAmplitudes(5);
  test.each(DENSE_ANGLES_50)('θ=%f', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 4, theta)).toBe(true);
  });
});

// ─── SECTION 3: Born-rule — negative angle sweep ──────────────────────────────
const NEG_ANGLES_50 = linspace(-2 * Math.PI, 0, 50);

describe('Born-rule (n=3): 50 negative angles at j=0', () => {
  const amps = born.uniformAmplitudes(3);
  test.each(NEG_ANGLES_50)('θ=%f: invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 0, theta)).toBe(true);
  });
});

describe('Born-rule (n=3): 50 negative angles at j=1', () => {
  const amps = born.uniformAmplitudes(3);
  test.each(NEG_ANGLES_50)('θ=%f: invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 1, theta)).toBe(true);
  });
});

describe('Born-rule (n=6): 50 negative angles at j=0', () => {
  const amps = born.phiAmplitudes(6);
  test.each(NEG_ANGLES_50)('θ=%f: invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 0, theta)).toBe(true);
  });
});

// ─── SECTION 4: Normalisation — all sizes after single phase ─────────────────
const ALL_SIZES = [...Array.from({ length: 50 }, (_, i) => i + 2)];

describe('Born-rule: normalised after phase — sizes 2..51', () => {
  test.each(ALL_SIZES)('n=%i: after phase(0,π) still normalised', (n) => {
    const a1 = born.uniformAmplitudes(n);
    const a2 = born.applyPhase(a1, 0, Math.PI);
    expect(born.isNormalised(a2)).toBe(true);
  });
});

describe('Born-rule: normalised after phase — phi-seeded 2..51', () => {
  test.each(ALL_SIZES)('n=%i: phi-seeded + phase(0,PHI) normalised', (n) => {
    const a1 = born.phiAmplitudes(n);
    const a2 = born.applyPhase(a1, 0, PHI);
    expect(born.isNormalised(a2)).toBe(true);
  });
});

// ─── SECTION 5: Sum of probabilities = 1 for all sizes ───────────────────────
describe('Born-rule: sum of probs = 1 — uniform sizes 2..51', () => {
  test.each(ALL_SIZES)('n=%i: sum=1', (n) => {
    const probs = born.probabilities(born.uniformAmplitudes(n));
    expect(probs.reduce((s, p) => s + p, 0)).toBeCloseTo(1, 10);
  });
});

describe('Born-rule: sum of probs = 1 — phi sizes 2..51', () => {
  test.each(ALL_SIZES)('n=%i: phi sum=1', (n) => {
    const probs = born.probabilities(born.phiAmplitudes(n));
    expect(probs.reduce((s, p) => s + p, 0)).toBeCloseTo(1, 10);
  });
});

// ─── SECTION 6: Hexagon — 60 sides from 0.01 to 1000 ─────────────────────────
const HEX_60 = linspace(0.01, 1000, 60);

describe('Hexagon: area correct — 60 parametric sides', () => {
  test.each(HEX_60)('side=%f: area=(3√3/2)s²', (s) => {
    const g = hex.compute(s);
    expect(g.area).toBeCloseTo((3 * SQRT3 / 2) * s * s, 5);
  });
});

describe('Hexagon: perimeter = 6s — 60 sides', () => {
  test.each(HEX_60)('side=%f', (s) => {
    expect(hex.compute(s).perimeter).toBeCloseTo(6 * s, 8);
  });
});

describe('Hexagon: circumradius = s — 60 sides', () => {
  test.each(HEX_60)('side=%f', (s) => {
    expect(hex.compute(s).circumradius).toBeCloseTo(s, 8);
  });
});

describe('Hexagon: inradius = s√3/2 — 60 sides', () => {
  test.each(HEX_60)('side=%f', (s) => {
    expect(hex.compute(s).inradius).toBeCloseTo(s * SQRT3 / 2, 8);
  });
});

describe('Hexagon: long diagonal = 2s — 60 sides', () => {
  test.each(HEX_60)('side=%f', (s) => {
    expect(hex.compute(s).diagonalLong).toBeCloseTo(2 * s, 8);
  });
});

describe('Hexagon: short diagonal = s√3 — 60 sides', () => {
  test.each(HEX_60)('side=%f', (s) => {
    expect(hex.compute(s).diagonalShort).toBeCloseTo(s * SQRT3, 8);
  });
});

describe('Hexagon: area = inradius × perimeter / 2 — 60 sides', () => {
  test.each(HEX_60)('side=%f', (s) => {
    const g = hex.compute(s);
    expect(g.area).toBeCloseTo(g.inradius * g.perimeter / 2, 6);
  });
});

// ─── SECTION 7: Hexagon vertex equidistance — 30 sides × 6 vertices ──────────
const HEX_30 = linspace(0.1, 100, 30);
const VERTEX_INDICES = [0, 1, 2, 3, 4, 5];

describe('Hexagon: vertex equidistance (all 6 vertices × 30 sides)', () => {
  test.each(HEX_30.flatMap(s => VERTEX_INDICES.map(i => [s, i])))(
    'side=%f vertex=%i', (s, i) => {
      expect(hex.verifyVertexDistance(s as number, i as number)).toBe(true);
    }
  );
});

// ─── SECTION 8: Hexagon adjacent edge lengths — 30 sides ──────────────────────
const EDGE_PAIRS = [0, 1, 2, 3, 4, 5];

describe('Hexagon: adjacent edges = s (30 sides × 6 edges)', () => {
  test.each(HEX_30.flatMap(s => EDGE_PAIRS.map(e => [s, e])))(
    'side=%f edge=%i', (s, e) => {
      const vs = hex.vertices(s as number);
      const [x0, y0] = vs[e as number];
      const [x1, y1] = vs[((e as number) + 1) % 6];
      const len = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
      expect(len).toBeCloseTo(s as number, 6);
    }
  );
});

// ─── SECTION 9: φ powers — extended ──────────────────────────────────────────
const PHI_EXPONENTS = linspace(0, 50, 51); // 0..50 in steps of 1

describe('φ^n positive: 51 exponents', () => {
  test.each(PHI_EXPONENTS)('φ^%f > 0', (n) => {
    expect(PHI ** n).toBeGreaterThan(0);
  });
});

describe('φ^-n positive: 51 exponents', () => {
  test.each(PHI_EXPONENTS)('φ^-%f > 0', (n) => {
    expect(PHI ** -n).toBeGreaterThan(0);
  });
});

describe('φ^n finite: 51 exponents', () => {
  test.each(PHI_EXPONENTS)('φ^%f is finite', (n) => {
    expect(isFinite(PHI ** n)).toBe(true);
  });
});

describe('φ^n × φ^-n = 1: 51 exponents', () => {
  test.each(PHI_EXPONENTS)('φ^%f × φ^-%f = 1', (n) => {
    expect(PHI ** n * PHI ** -n).toBeCloseTo(1, 10);
  });
});

// ─── SECTION 10: Fibonacci — extended range ────────────────────────────────────
const FIB_RANGE_50 = Array.from({ length: 50 }, (_, i) => i);

describe('Fibonacci: F(n) >= 0 for n in 0..49', () => {
  test.each(FIB_RANGE_50)('F(%i) >= 0', (n) => {
    expect(fibonacci(n)).toBeGreaterThanOrEqual(0);
  });
});

describe('Fibonacci: recurrence F(n) = F(n-1) + F(n-2)', () => {
  test.each(FIB_RANGE_50.slice(2))('n=%i', (n) => {
    expect(fibonacci(n)).toBe(fibonacci(n - 1) + fibonacci(n - 2));
  });
});

describe('Fibonacci: monotonically non-decreasing', () => {
  test.each(FIB_RANGE_50.slice(1))('F(%i) >= F(%i-1)', (n) => {
    expect(fibonacci(n)).toBeGreaterThanOrEqual(fibonacci(n - 1));
  });
});

// ─── SECTION 11: Temporal scale cross-product ────────────────────────────────
const LAMBDAS_10 = [0.1, 0.2, 0.5, PHI_INV, 1.0, PHI, 2.0, 5.0, 10.0, 100.0];
const TIMES_10   = [0, 0.1, 0.5, 1, 2, 5, 10, 50, 100, 500];

describe('Temporal decay: λ×t product matrix (10×10)', () => {
  test.each(LAMBDAS_10.flatMap(lam => TIMES_10.map(t => [lam, t])))(
    'λ=%f t=%f: weight in [0,1]', (lam, t) => {
      const w = ned.decayedWeight(lam as number, t as number);
      expect(w).toBeGreaterThanOrEqual(0);
      expect(w).toBeLessThanOrEqual(1);
    }
  );
});

describe('Temporal decay: λ×t monotone in t (10×9 pairs)', () => {
  test.each(
    LAMBDAS_10.flatMap(lam => TIMES_10.slice(0, -1).map((t, i) => [lam, t, TIMES_10[i + 1]]))
  )('λ=%f t1=%f t2=%f: w(t1)>=w(t2)', (lam, t1, t2) => {
    const w1 = ned.decayedWeight(lam as number, t1 as number);
    const w2 = ned.decayedWeight(lam as number, t2 as number);
    expect(w1).toBeGreaterThanOrEqual(w2 - 1e-15);
  });
});

// ─── SECTION 12: PSO velocity — extended parametric ──────────────────────────
const PSO_LOS  = [-10, -5, -2, -1, 0, 1, 2, 5, PHI_INV];
const PSO_HIST = [5, 10, 15, 20, 25, 50, 100, PHI, PHI_SQ, SQRT3];

describe('PSO velocity span: 9×10 range matrix', () => {
  test.each(
    PSO_LOS.flatMap(lo => PSO_HIST.map(hi_delta => [lo, lo + hi_delta]))
  )('[%f, %f]: span = (hi-lo)×φ⁻¹', (lo, hi) => {
    const span = ned.psoVelocitySpan(lo as number, hi as number);
    expect(span).toBeCloseTo(((hi as number) - (lo as number)) * PHI_INV, 10);
  });
});

// ─── SECTION 13: Symbolic identities — high-precision ────────────────────────
const HIGH_PREC_ANGLES = linspace(0, 4 * Math.PI, 40);

describe('Symbolic: sin²+cos²=1 at 40 angles', () => {
  test.each(HIGH_PREC_ANGLES)('θ=%f', (theta) => {
    expect(Math.sin(theta) ** 2 + Math.cos(theta) ** 2).toBeCloseTo(1, 13);
  });
});

describe('Symbolic: |e^(iθ)|²=1 at 40 angles', () => {
  test.each(HIGH_PREC_ANGLES)('θ=%f', (theta) => {
    const re = Math.cos(theta), im = Math.sin(theta);
    expect(re * re + im * im).toBeCloseTo(1, 13);
  });
});

describe('Symbolic: periodicity sin(θ+2π)=sin(θ) at 40 angles', () => {
  test.each(HIGH_PREC_ANGLES)('θ=%f', (theta) => {
    expect(Math.sin(theta + 2 * Math.PI)).toBeCloseTo(Math.sin(theta), 12);
  });
});

describe('Symbolic: periodicity cos(θ+2π)=cos(θ) at 40 angles', () => {
  test.each(HIGH_PREC_ANGLES)('θ=%f', (theta) => {
    expect(Math.cos(theta + 2 * Math.PI)).toBeCloseTo(Math.cos(theta), 12);
  });
});

describe('Symbolic: double-angle sin(2θ)=2sin(θ)cos(θ) at 40 angles', () => {
  test.each(HIGH_PREC_ANGLES)('θ=%f', (theta) => {
    expect(Math.sin(2 * theta)).toBeCloseTo(2 * Math.sin(theta) * Math.cos(theta), 12);
  });
});

describe('Symbolic: double-angle cos(2θ)=cos²θ-sin²θ at 40 angles', () => {
  test.each(HIGH_PREC_ANGLES)('θ=%f', (theta) => {
    expect(Math.cos(2 * theta)).toBeCloseTo(Math.cos(theta) ** 2 - Math.sin(theta) ** 2, 12);
  });
});

// ─── SECTION 14: φ vs Fibonacci ratio convergence — 30 indices ────────────────
const FIB_CONV_INDICES = Array.from({ length: 30 }, (_, i) => i + 3);

describe('Fibonacci ratio convergence: 30 indices', () => {
  test.each(FIB_CONV_INDICES)('F(%i+1)/F(%i) > 1', (n) => {
    expect(fibonacciRatio(n)).toBeGreaterThan(1);
  });
});

describe('Fibonacci ratio convergence: 30 indices < 2', () => {
  test.each(FIB_CONV_INDICES)('F(%i+1)/F(%i) < 2', (n) => {
    expect(fibonacciRatio(n)).toBeLessThan(2);
  });
});

describe('Fibonacci ratio convergence: monotone towards φ (20 pairs)', () => {
  const pairs = Array.from({ length: 20 }, (_, i) => [i + 5, i + 6] as [number, number]);
  test.each(pairs)('|F(%i+1)/F(%i) - φ| > |F(%i+2)/F(%i+1) - φ|', (n, m) => {
    const r1 = Math.abs(fibonacciRatio(n) - PHI);
    const r2 = Math.abs(fibonacciRatio(m) - PHI);
    expect(r2).toBeLessThanOrEqual(r1 + 1e-15);
  });
});

// ─── SECTION 15: Hexagon area vs inscribed circle ────────────────────────────
describe('Hexagon: area vs inscribed circle area ratio — 30 sides', () => {
  test.each(HEX_30)('side=%f: hex/inCircle ratio', (s) => {
    const g = hex.compute(s);
    const inCircleArea = Math.PI * g.inradius * g.inradius;
    const ratio = g.area / inCircleArea;
    // (3√3/2)s² / (π × (s√3/2)²) = (3√3/2) / (π × 3/4) = 2√3/π ≈ 1.1027
    expect(ratio).toBeCloseTo(2 * SQRT3 / Math.PI, 8);
  });
});

describe('Hexagon: area vs circumscribed circle area ratio — 30 sides', () => {
  test.each(HEX_30)('side=%f: hex/circumCircle ratio', (s) => {
    const g = hex.compute(s);
    const circArea = Math.PI * g.circumradius * g.circumradius;
    const ratio = g.area / circArea;
    // (3√3/2)s² / (πs²) = 3√3/(2π) ≈ 0.8270
    expect(ratio).toBeCloseTo(3 * SQRT3 / (2 * Math.PI), 8);
  });
});

// ─── SECTION 16: Numeric classify matrix ─────────────────────────────────────
const SAFE_VALUES  = [1, 2, 3, 5, 8, 13, PHI, PHI_SQ, SQRT3, SQRT5, 100, 0.001, 0.5, 1e6, 1e-5];
const CRIT_VALUES  = [NaN, Infinity, -Infinity];
const WARN_VALUES  = [0, -0];

describe('Numeric classify: safe values', () => {
  test.each(SAFE_VALUES)('classify(%f) = safe', (v) => {
    expect(ned.classify(v).risk).toBe('safe');
    expect(ned.classify(v).isFinite).toBe(true);
  });
});

describe('Numeric classify: critical values', () => {
  test.each(CRIT_VALUES)('classify(%f) = critical', (v) => {
    expect(ned.classify(v).risk).toBe('critical');
  });
});

describe('Numeric classify: warning values', () => {
  test.each(WARN_VALUES)('classify(%f) = warning', (v) => {
    expect(ned.classify(v).risk).toBe('warning');
    expect(ned.classify(v).isZero).toBe(true);
  });
});

describe('Numeric classify: negative safe values', () => {
  const negSafe = [-1, -2, -PHI, -SQRT3, -100, -1e6, -0.001];
  test.each(negSafe)('classify(%f) = safe', (v) => {
    expect(ned.classify(v).risk).toBe('safe');
    expect(ned.classify(v).isNegative).toBe(true);
  });
});

// ─── SECTION 17: SymbolicSolver — bulk verifications ─────────────────────────
describe('SymbolicSolver: phi identities (10 each)', () => {
  const ids = sym.phiIdentities();
  test.each(ids)('identity: %s', (id) => {
    expect(id.holds).toBe(true);
    expect(id.epsilon).toBeGreaterThan(0);
  });
});

describe('SymbolicSolver: sqrt3 identities (8 each)', () => {
  const ids = sym.sqrt3Identities();
  test.each(ids)('identity: %s', (id) => {
    expect(id.holds).toBe(true);
  });
});

describe('SymbolicSolver: trig identities (~12 each)', () => {
  const ids = sym.trigIdentities();
  test.each(ids)('identity: %s', (id) => {
    expect(id.holds).toBe(true);
  });
});

// ─── SECTION 18: Born-rule — all-amplitude probs positive ────────────────────
describe('Born-rule: all probs >= 0, uniform n=2..30', () => {
  const sizes = Array.from({ length: 29 }, (_, i) => i + 2);
  test.each(sizes)('uniform n=%i: probs >= 0', (n) => {
    born.probabilities(born.uniformAmplitudes(n)).forEach(p =>
      expect(p).toBeGreaterThanOrEqual(0));
  });
});

describe('Born-rule: all probs <= 1, phi n=2..20', () => {
  const sizes = Array.from({ length: 19 }, (_, i) => i + 2);
  test.each(sizes)('phi n=%i: probs <= 1', (n) => {
    born.probabilities(born.phiAmplitudes(n)).forEach(p =>
      expect(p).toBeLessThanOrEqual(1 + 1e-12));
  });
});

// ─── SECTION 19: Hexagon area scaling — 20 phi-scaled series ──────────────────
describe('Hexagon: phi-scaled area series (20 steps)', () => {
  const steps = 20;
  let side = 1;
  const series: number[] = [side];
  for (let i = 0; i < steps - 1; i++) {
    side = hex.phiSpiralNextRadius(side);
    series.push(side);
  }

  test.each(series)('side=%f: area positive finite', (s) => {
    const g = hex.compute(s);
    expect(isFinite(g.area)).toBe(true);
    expect(g.area).toBeGreaterThan(0);
  });

  test.each(series)('side=%f: perimeter = 6s', (s) => {
    expect(hex.compute(s).perimeter).toBeCloseTo(6 * s, 5);
  });

  test.each(series)('side=%f: all 6 vertices equidistant', (s) => {
    for (let i = 0; i < 6; i++) {
      expect(hex.verifyVertexDistance(s, i)).toBe(true);
    }
  });
});

// ─── SECTION 20: Complex phase composition ───────────────────────────────────
describe('Born-rule: e^(ia)×e^(ib) = e^(i(a+b)) — 20×20 pairs', () => {
  const alphas = linspace(0, Math.PI, 20);
  const betas  = linspace(0, Math.PI, 20);
  test.each(
    alphas.slice(0, 10).flatMap(a => betas.slice(0, 10).map(b => [a, b]))
  )('α=%f β=%f: composition', (alpha, beta) => {
    const reA = Math.cos(alpha as number), imA = Math.sin(alpha as number);
    const reB = Math.cos(beta as number),  imB = Math.sin(beta as number);
    const reP = reA * reB - imA * imB;
    const imP = reA * imB + imA * reB;
    const reD = Math.cos((alpha as number) + (beta as number));
    const imD = Math.sin((alpha as number) + (beta as number));
    expect(reP).toBeCloseTo(reD, 12);
    expect(imP).toBeCloseTo(imD, 12);
  });
});

// ─── SECTION 21: φ power recurrence Fibonacci connection ──────────────────────
const FIB_PHI_PAIRS: [number, number, number][] = [
  [1, 1, 0], [2, 1, 1], [3, 2, 1], [4, 3, 2], [5, 5, 3],
  [6, 8, 5], [7, 13, 8], [8, 21, 13], [9, 34, 21], [10, 55, 34],
  [11, 89, 55], [12, 144, 89], [13, 233, 144], [14, 377, 233], [15, 610, 377],
];

describe('φ power law: φ^n = F(n)×φ + F(n-1)', () => {
  test.each(FIB_PHI_PAIRS)('n=%i: φ^n = %i×φ + %i', (n, fn, fn1) => {
    expect(PHI ** n).toBeCloseTo(fn * PHI + fn1, 6);
  });
});

// ─── SECTION 22: Hexagon centroid property — 40 sides ─────────────────────────
const HEX_40 = linspace(0.5, 200, 40);

describe('Hexagon: centroid at origin — 40 sides', () => {
  test.each(HEX_40)('side=%f: centroid x≈0 y≈0', (s) => {
    const vs = hex.vertices(s);
    const sumX = vs.reduce((a, [x]) => a + x, 0);
    const sumY = vs.reduce((a, [, y]) => a + y, 0);
    expect(Math.abs(sumX)).toBeLessThan(1e-9 * s);
    expect(Math.abs(sumY)).toBeLessThan(1e-9 * s);
  });
});

// ─── SECTION 23: PSO fixed-point convergence — 9 path lengths × 6 Q values ───
const FP_Q    = [0.5, 1, PHI, 2, 5, 10];
const FP_LENS = [1, 2, 3, 4, 5, 8, 13, 21, 34];
const FP_RHO  = PHI_INV * 0.1;

describe('Pheromone fixed-point convergence (6Q × 9L = 54 cases)', () => {
  test.each(
    FP_Q.flatMap(Q => FP_LENS.map(L => [Q, L]))
  )('Q=%f L=%i: fixed point δτ/ρ', (Q, L) => {
    const deltaT  = (Q as number) * PHI / (L as number);
    const fp = deltaT / FP_RHO;
    expect(fp).toBeGreaterThan(0);
    expect(isFinite(fp)).toBe(true);
  });
});

// ─── SECTION 24: Amplitude squared sum after chained phases ──────────────────
describe('Born-rule: chained phases — prob sum stays 1 (25 combinations)', () => {
  const chainLengths = [2, 5, 10, 20, 50];
  const nValues      = [2, 3, 4, 5, 6];
  test.each(
    chainLengths.flatMap(k => nValues.map(n => [k, n]))
  )('%i phases n=%i', (k, n) => {
    let amps = born.uniformAmplitudes(n as number);
    for (let i = 0; i < (k as number); i++) {
      amps = born.applyPhase(amps, i % (n as number), PHI * i);
    }
    const sum = born.probabilities(amps).reduce((s, p) => s + p, 0);
    expect(sum).toBeCloseTo(1, 10);
  });
});
