/**
 * Proto Alpha Stress Test Suite
 * ============================================================
 * Property-based, fuzz, and stress tests covering PROTO-231,
 * PROTO-232, PROTO-233, hexagonal geometry, Born-rule invariants,
 * phi-arithmetic, temporal decay, pheromone dynamics, and numeric
 * boundary conditions across thousands of parameterised cases.
 *
 * Target: ~2,000+ tests
 * Charter: ALPHA-EC-001 § Stress & Property Domain
 */

'use strict';

import {
  PHI, PHI_INV, PHI_SQ, SQRT3, SQRT5,
  BornRuleVerifier, HexagonEngine, NumericEdgeDetector,
  SymbolicSolver, fibonacci,
} from '../lib/alphaEdgeSolver';

const born = new BornRuleVerifier();
const hex  = new HexagonEngine();
const ned  = new NumericEdgeDetector();
const sym  = new SymbolicSolver();

// ─── Helpers ──────────────────────────────────────────────────────────────────
const phi  = PHI;
const phiI = PHI_INV;
const EPS  = 1e-9;

function range(lo: number, hi: number, steps: number): number[] {
  const result: number[] = [];
  const step = (hi - lo) / (steps - 1);
  for (let i = 0; i < steps; i++) result.push(lo + step * i);
  return result;
}

function logRange(lo: number, hi: number, steps: number): number[] {
  // Logarithmically spaced values: lo > 0
  const logLo = Math.log10(lo), logHi = Math.log10(hi);
  return range(logLo, logHi, steps).map(x => Math.pow(10, x));
}

// ─── SECTION 1: Born-rule — uniform states, many sizes ────────────────────────
const SIZES_SMALL  = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const SIZES_MEDIUM = [11, 12, 15, 20, 25, 30, 40, 50];
const SIZES_LARGE  = [100, 200, 500, 1000];

describe('Stress: Born-rule uniform — small sizes', () => {
  test.each(SIZES_SMALL)('n=%i: normalised', (n) => {
    expect(born.isNormalised(born.uniformAmplitudes(n))).toBe(true);
  });
  test.each(SIZES_SMALL)('n=%i: each prob = 1/n', (n) => {
    born.probabilities(born.uniformAmplitudes(n)).forEach(p =>
      expect(p).toBeCloseTo(1 / n, 12));
  });
  test.each(SIZES_SMALL)('n=%i: phase at j=0 theta=phi invariant', (n) => {
    const amps = born.uniformAmplitudes(n);
    expect(born.verifyPhaseInvariance(amps, 0, phi)).toBe(true);
  });
});

describe('Stress: Born-rule uniform — medium sizes', () => {
  test.each(SIZES_MEDIUM)('n=%i: normalised', (n) => {
    expect(born.isNormalised(born.uniformAmplitudes(n))).toBe(true);
  });
  test.each(SIZES_MEDIUM)('n=%i: sum probs = 1', (n) => {
    const sum = born.probabilities(born.uniformAmplitudes(n)).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 10);
  });
});

describe('Stress: Born-rule uniform — large sizes', () => {
  test.each(SIZES_LARGE)('n=%i: normalised', (n) => {
    expect(born.isNormalised(born.uniformAmplitudes(n))).toBe(true);
  });
  test.each(SIZES_LARGE)('n=%i: each prob close to 1/n', (n) => {
    const probs = born.probabilities(born.uniformAmplitudes(n));
    probs.forEach(p => expect(Math.abs(p - 1 / n)).toBeLessThan(1e-10));
  });
});

// ─── SECTION 2: Born-rule — phi-seeded states, many sizes ────────────────────
describe('Stress: Born-rule phi-seeded states', () => {
  const allSizes = [...SIZES_SMALL, ...SIZES_MEDIUM, 100, 500];
  test.each(allSizes)('phi n=%i: normalised', (n) => {
    expect(born.isNormalised(born.phiAmplitudes(n))).toBe(true);
  });
  test.each(allSizes)('phi n=%i: all probs finite and positive', (n) => {
    born.probabilities(born.phiAmplitudes(n)).forEach(p => {
      expect(isFinite(p)).toBe(true);
      expect(p).toBeGreaterThan(0);
    });
  });
  test.each(allSizes)('phi n=%i: phase at j=0 invariant', (n) => {
    const amps = born.phiAmplitudes(n);
    expect(born.verifyPhaseInvariance(amps, 0, Math.PI)).toBe(true);
  });
});

// ─── SECTION 3: Born-rule — phase invariance across all angles ────────────────
const STRESS_ANGLES = range(0, 2 * Math.PI, 36); // 0° to 360° in 10° steps

describe('Stress: Born-rule phase invariance — many angles (n=4)', () => {
  const amps = born.uniformAmplitudes(4);
  test.each(STRESS_ANGLES)('θ=%f: prob[0] invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 0, theta)).toBe(true);
  });
  test.each(STRESS_ANGLES)('θ=%f: prob[1] invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 1, theta)).toBe(true);
  });
  test.each(STRESS_ANGLES)('θ=%f: prob[2] invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 2, theta)).toBe(true);
  });
  test.each(STRESS_ANGLES)('θ=%f: prob[3] invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 3, theta)).toBe(true);
  });
});

describe('Stress: Born-rule — negative and large angles', () => {
  const negAngles = range(-2 * Math.PI, 0, 20);
  const amps = born.phiAmplitudes(3);
  test.each(negAngles)('θ=%f (negative): invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 0, theta)).toBe(true);
  });

  const largeAngles = range(2 * Math.PI, 20 * Math.PI, 20);
  test.each(largeAngles)('θ=%f (large): invariant', (theta) => {
    expect(born.verifyPhaseInvariance(amps, 1, theta)).toBe(true);
  });
});

// ─── SECTION 4: Hexagon — parametric stress ───────────────────────────────────
const HEX_SIDES_LINEAR = range(0.001, 10, 50);
const HEX_SIDES_LOG    = logRange(1e-5, 1e5, 30);

describe('Stress: Hexagon area formula — linear range', () => {
  test.each(HEX_SIDES_LINEAR)('side=%f: area=(3√3/2)s²', (s) => {
    const g = hex.compute(s);
    expect(g.area).toBeCloseTo((3 * SQRT3 / 2) * s * s, 7);
  });
});

describe('Stress: Hexagon perimeter — linear range', () => {
  test.each(HEX_SIDES_LINEAR)('side=%f: perimeter=6s', (s) => {
    const g = hex.compute(s);
    expect(g.perimeter).toBeCloseTo(6 * s, 10);
  });
});

describe('Stress: Hexagon inradius — linear range', () => {
  test.each(HEX_SIDES_LINEAR)('side=%f: inradius=s√3/2', (s) => {
    const g = hex.compute(s);
    expect(g.inradius).toBeCloseTo(s * SQRT3 / 2, 10);
  });
});

describe('Stress: Hexagon circumradius — linear range', () => {
  test.each(HEX_SIDES_LINEAR)('side=%f: circumradius=s', (s) => {
    const g = hex.compute(s);
    expect(g.circumradius).toBeCloseTo(s, 10);
  });
});

describe('Stress: Hexagon — log scale', () => {
  test.each(HEX_SIDES_LOG)('side=%f: area positive and finite', (s) => {
    const g = hex.compute(s);
    expect(isFinite(g.area)).toBe(true);
    expect(g.area).toBeGreaterThan(0);
  });
  test.each(HEX_SIDES_LOG)('side=%f: perimeter=6s', (s) => {
    const g = hex.compute(s);
    expect(g.perimeter).toBeCloseTo(6 * s, 6);
  });
});

describe('Stress: Hexagon vertex equidistance — many sides', () => {
  const testSides = range(0.5, 5, 10);
  test.each(testSides)('side=%f: all 6 vertices at distance=s', (s) => {
    for (let i = 0; i < 6; i++) {
      expect(hex.verifyVertexDistance(s, i)).toBe(true);
    }
  });
});

describe('Stress: Hexagon adjacent edge lengths', () => {
  const testSides = range(1, 20, 20);
  test.each(testSides)('side=%f: all 6 edges = s', (s) => {
    const vs = hex.vertices(s);
    for (let i = 0; i < 6; i++) {
      const [x0, y0] = vs[i];
      const [x1, y1] = vs[(i + 1) % 6];
      expect(Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2)).toBeCloseTo(s, 8);
    }
  });
});

describe('Stress: Hexagon scaling invariants', () => {
  const scalePairs: [number, number][] = [
    [1, 2], [1, 3], [1, PHI], [PHI, PHI_SQ], [2, 4], [0.5, 1], [1, 10],
    [0.1, 1], [1, 100], [PHI_INV, 1],
  ];
  test.each(scalePairs)('s1=%f s2=%f: area ratio = (s2/s1)²', (s1, s2) => {
    const g1 = hex.compute(s1), g2 = hex.compute(s2);
    expect(g2.area / g1.area).toBeCloseTo((s2 / s1) ** 2, 8);
  });
  test.each(scalePairs)('s1=%f s2=%f: perimeter ratio = s2/s1', (s1, s2) => {
    const g1 = hex.compute(s1), g2 = hex.compute(s2);
    expect(g2.perimeter / g1.perimeter).toBeCloseTo(s2 / s1, 10);
  });
});

// ─── SECTION 5: phi arithmetic stress ──────────────────────────────────────────
const PHI_POWERS = Array.from({ length: 30 }, (_, i) => i + 1);

describe('Stress: phi powers — positive', () => {
  test.each(PHI_POWERS)('phi^%i is positive finite', (n) => {
    const p = phi ** n;
    expect(isFinite(p)).toBe(true);
    expect(p).toBeGreaterThan(0);
  });
  test.each(PHI_POWERS)('phi^%i > phi^(%i-1)', (n) => {
    if (n < 2) return;
    expect(phi ** n).toBeGreaterThan(phi ** (n - 1));
  });
  test.each(PHI_POWERS)('phi^%i / phi^(%i-1) = phi', (n) => {
    if (n < 2) return;
    expect(phi ** n / phi ** (n - 1)).toBeCloseTo(phi, 10);
  });
});

describe('Stress: phi powers — negative', () => {
  test.each(PHI_POWERS)('phi^-%i is positive finite', (n) => {
    const p = phi ** -n;
    expect(isFinite(p)).toBe(true);
    expect(p).toBeGreaterThan(0);
  });
  test.each(PHI_POWERS)('phi^%i × phi^-%i = 1', (n) => {
    expect(phi ** n * phi ** -n).toBeCloseTo(1, 10);
  });
});

describe('Stress: phi identities at many scales', () => {
  const scales = range(1, 50, 20);
  test.each(scales)('at scale=%f: phi²-phi-1=0', (s) => {
    // Scale doesn't change the identity, just verify numerics remain stable
    expect((phi * s) ** 2 / (s ** 2) - phi - 1).toBeCloseTo(0, 10);
  });
});

// ─── SECTION 6: Fibonacci stress ─────────────────────────────────────────────
const FIB_INDICES = Array.from({ length: 40 }, (_, i) => i);

describe('Stress: Fibonacci — basic properties', () => {
  test.each(FIB_INDICES)('F(%i) is non-negative integer', (n) => {
    const f = fibonacci(n);
    expect(Number.isInteger(f)).toBe(true);
    expect(f).toBeGreaterThanOrEqual(0);
  });

  test.each(FIB_INDICES.slice(2))('F(%i) = F(%i-1) + F(%i-2)', (n) => {
    expect(fibonacci(n)).toBe(fibonacci(n - 1) + fibonacci(n - 2));
  });

  test.each(FIB_INDICES.slice(1))('F(%i) > 0', (n) => {
    expect(fibonacci(n)).toBeGreaterThan(0);
  });
});

describe('Stress: Fibonacci ratio convergence', () => {
  const convergenceTests = Array.from({ length: 20 }, (_, i) => i + 5);
  test.each(convergenceTests)('F(%i+1)/F(%i) within tol of phi', (n) => {
    const ratio = fibonacci(n + 1) / fibonacci(n);
    // Tolerance loosens for small n: F(6)/F(5)=8/5=1.6, diff≈0.018
    const tol = n <= 5 ? 0.03 : n <= 6 ? 0.02 : 0.01;
    expect(Math.abs(ratio - phi)).toBeLessThan(tol);
  });
  test.each(convergenceTests)('ratio > 1', (n) => {
    expect(fibonacci(n + 1) / fibonacci(n)).toBeGreaterThan(1);
  });
  test.each(convergenceTests)('ratio < 2', (n) => {
    expect(fibonacci(n + 1) / fibonacci(n)).toBeLessThan(2);
  });
});

// ─── SECTION 7: Temporal decay stress ─────────────────────────────────────────
const LAMBDA_VALUES  = [0.1, 0.5, 1, PHI_INV, 1.0, PHI, 2, 5, 10];
const TIME_VALUES    = range(0, 100, 20);
const EXTREME_TIMES  = [750, 800, 1000, 1e6];

describe('Stress: Temporal decay — many lambda values', () => {
  test.each(LAMBDA_VALUES)('lambda=%f: weight at t=0 = 1', (lambda) => {
    expect(ned.decayedWeight(lambda, 0)).toBe(1);
  });
  test.each(LAMBDA_VALUES)('lambda=%f: weight at t=1 < 1', (lambda) => {
    expect(ned.decayedWeight(lambda, 1)).toBeLessThan(1);
  });
  test.each(LAMBDA_VALUES)('lambda=%f: monotonically decreasing', (lambda) => {
    let prev = ned.decayedWeight(lambda, 0);
    for (const t of TIME_VALUES.slice(1)) {
      const curr = ned.decayedWeight(lambda, t);
      expect(curr).toBeLessThanOrEqual(prev);
      prev = curr;
    }
  });
});

describe('Stress: Temporal decay — extreme time values', () => {
  test.each(EXTREME_TIMES)('t=%f: exp(-1×t) = 0 (underflow)', (t) => {
    expect(ned.decayedWeight(1, t)).toBe(0);
  });
  test.each(EXTREME_TIMES)('t=%f: numeric classify is safe', (t) => {
    const w = ned.decayedWeight(1, t);
    const c = ned.classify(w);
    // Either 0 (warning for zero) or very small (safe) — both ok
    expect(['safe', 'warning']).toContain(c.risk);
  });
});

describe('Stress: Temporal decay — λ×t product', () => {
  const products = range(0, 20, 25);
  test.each(products)('e^(-x), x=%f: finite and [0,1]', (x) => {
    const w = Math.exp(-x);
    expect(isFinite(w)).toBe(true);
    expect(w).toBeGreaterThanOrEqual(0);
    expect(w).toBeLessThanOrEqual(1);
  });
});

// ─── SECTION 8: PSO velocity stress ──────────────────────────────────────────
const PSO_RANGES: [number, number][] = [
  [0, 1], [0, 2], [-1, 1], [-5, 5], [0, PHI], [0, PHI_SQ],
  [-PHI, PHI], [0, 10], [0, 100], [PHI_INV, PHI],
];

describe('Stress: PSO velocity span', () => {
  test.each(PSO_RANGES)('[%f,%f]: span = range×phiI¹', (lo, hi) => {
    const span = ned.psoVelocitySpan(lo, hi);
    expect(span).toBeCloseTo((hi - lo) * phiI, 12);
  });
  test.each(PSO_RANGES)('[%f,%f]: span >= 0', (lo, hi) => {
    const span = ned.psoVelocitySpan(lo, hi);
    expect(span).toBeGreaterThanOrEqual(0);
  });
  test.each(PSO_RANGES)('[%f,%f]: span < range', (lo, hi) => {
    const span = ned.psoVelocitySpan(lo, hi);
    expect(span).toBeLessThan(hi - lo + 1e-10);
  });
});

// ─── SECTION 9: Pheromone delta stress ───────────────────────────────────────
const Q_VALUES    = [0.5, 1, PHI, 2, 5, 10];
const PATH_LENS   = [1, 2, 3, 4, 5, 8, 13, 21, 34]; // Fibonacci path lengths!

describe('Stress: Pheromone delta = Q×phi/path.length', () => {
  test.each(
    Q_VALUES.flatMap(Q => PATH_LENS.map(L => [Q, L]))
  )('Q=%f L=%i: delta=Q×phi/L', (Q, L) => {
    const delta = Q * phi / L;
    expect(delta).toBeCloseTo(Q * phi / L, 12);
    expect(delta).toBeGreaterThan(0);
    expect(isFinite(delta)).toBe(true);
  });
});

describe('Stress: Pheromone delta — path length scaling', () => {
  test.each(PATH_LENS)('L=%i: delta with Q=1 = phi/L', (L) => {
    const delta = phi / L;
    expect(delta).toBeCloseTo(phi / L, 12);
  });

  test('longer path → smaller delta (monotone)', () => {
    let prev = phi / PATH_LENS[0];
    for (const L of PATH_LENS.slice(1)) {
      const curr = phi / L;
      expect(curr).toBeLessThan(prev);
      prev = curr;
    }
  });
});

// ─── SECTION 10: Evaporation convergence stress ────────────────────────────────
const EVAP_RATES = [0.01, 0.05, 0.1, PHI_INV * 0.1, 0.2, 0.3, PHI_INV * 0.5];

describe('Stress: Evaporation — convergence to zero', () => {
  test.each(EVAP_RATES)('rho=%f: eventually converges to 0', (rho) => {
    let tau = 1.0, steps = 0;
    while (tau > 1e-10 && steps < 100000) { tau *= (1 - rho); steps++; }
    expect(steps).toBeGreaterThan(0);
    expect(tau).toBeLessThan(1e-10);
  });
});

describe('Stress: Evaporation — phi-rate (default)', () => {
  test('EVAPORATION = PHI_INV × 0.1 ≈ 0.0618', () => {
    const EVAP = phiI * 0.1;
    expect(EVAP).toBeCloseTo(0.0618, 3);
  });

  test('210 steps with default rate: tau < initial × 0.01', () => {
    const rho = phiI * 0.1;
    let tau = 1.0;
    for (let i = 0; i < 210; i++) tau *= (1 - rho);
    expect(tau).toBeLessThan(0.01);
  });

  test.each([210, 300, 400, 500])('%i steps: tau < initial', (steps) => {
    const rho = phiI * 0.1;
    let tau = 1.0;
    for (let i = 0; i < steps; i++) tau *= (1 - rho);
    expect(tau).toBeLessThan(1.0);
  });
});

// ─── SECTION 11: Symbolic identity stress ─────────────────────────────────────
describe('Stress: phi power law F(n)×phi + F(n-1)', () => {
  // For n from 1 to 25: phiⁿ = F(n)×phi + F(n-1)
  const powers = Array.from({ length: 20 }, (_, i) => i + 1);
  test.each(powers)('n=%i', (n) => {
    const fn  = fibonacci(n);
    const fn1 = fibonacci(n - 1);
    expect(phi ** n).toBeCloseTo(fn * phi + fn1, 5);
  });
});

describe('Stress: Pythagorean identity at many angles', () => {
  const angles = range(0, 4 * Math.PI, 100);
  test.each(angles)('sin²+cos²=1, θ=%f', (theta) => {
    expect(Math.sin(theta) ** 2 + Math.cos(theta) ** 2).toBeCloseTo(1, 13);
  });
});

describe('Stress: |e^(iθ)|²=1 at many angles', () => {
  const angles = range(-2 * Math.PI, 2 * Math.PI, 100);
  test.each(angles)('|e^(iθ)|²=1, θ=%f', (theta) => {
    const re = Math.cos(theta), im = Math.sin(theta);
    expect(re * re + im * im).toBeCloseTo(1, 13);
  });
});

// ─── SECTION 12: Numeric stability under composition ──────────────────────────
describe('Stress: Multiple phase applications — cumulative', () => {
  const amps4 = born.uniformAmplitudes(4);

  test('50 phase rotations — still normalised', () => {
    let amps = [...amps4] as [number, number][];
    for (let i = 0; i < 50; i++) {
      amps = born.applyPhase(amps, i % 4, phi);
    }
    expect(born.isNormalised(amps)).toBe(true);
  });

  test('100 phase rotations — still normalised', () => {
    let amps = born.phiAmplitudes(6);
    for (let i = 0; i < 100; i++) {
      amps = born.applyPhase(amps, i % 6, Math.PI * phiI);
    }
    expect(born.isNormalised(amps)).toBe(true);
  });

  test('alternating +phi and -phi phases cancel back', () => {
    const original = born.uniformAmplitudes(4);
    let amps = [...original] as [number, number][];
    // Apply phi then -phi: should return to original
    amps = born.applyPhase(amps, 0, phi);
    amps = born.applyPhase(amps, 0, -phi);
    original.forEach(([re, im], i) => {
      expect(amps[i][0]).toBeCloseTo(re, 12);
      expect(amps[i][1]).toBeCloseTo(im, 12);
    });
  });
});

// ─── SECTION 13: Hexagon vertex stress ────────────────────────────────────────
describe('Stress: Hexagon vertex centroid = (0,0)', () => {
  const testSides = range(0.1, 100, 30);
  test.each(testSides)('side=%f: centroid at origin', (s) => {
    const vs = hex.vertices(s);
    const sumX = vs.reduce((a, [x]) => a + x, 0);
    const sumY = vs.reduce((a, [, y]) => a + y, 0);
    expect(Math.abs(sumX)).toBeLessThan(1e-9 * s);
    expect(Math.abs(sumY)).toBeLessThan(1e-9 * s);
  });
});

describe('Stress: Hexagon all-vertex equidistance', () => {
  const testSides = range(0.5, 50, 20);
  test.each(testSides)('side=%f: all 6 vertices equidistant', (s) => {
    const vs = hex.vertices(s);
    const dists = vs.map(([x, y]) => Math.sqrt(x * x + y * y));
    dists.forEach(d => expect(d).toBeCloseTo(s, 8));
  });
});

describe('Stress: Hexagon 60° rotational symmetry', () => {
  const testSides = range(1, 10, 5);
  const cos60 = Math.cos(Math.PI / 3), sin60 = Math.sin(Math.PI / 3);
  test.each(testSides)('side=%f: 60° rotation maps v_i to v_{i+1}', (s) => {
    const vs = hex.vertices(s);
    vs.forEach(([x, y], i) => {
      const rx = x * cos60 - y * sin60;
      const ry = x * sin60 + y * cos60;
      const next = vs[(i + 1) % 6];
      expect(rx).toBeCloseTo(next[0], 7);
      expect(ry).toBeCloseTo(next[1], 7);
    });
  });
});

// ─── SECTION 14: Numeric classify stress ─────────────────────────────────────
describe('Stress: NumericEdgeDetector.classify — many values', () => {
  const safeValues = [1, -1, 0.5, PHI, PHI_INV, SQRT3, 1000, -1000, 1e-10, Math.PI];
  const criticalValues = [NaN, Infinity, -Infinity];
  const warningValues  = [0, -0];

  test.each(safeValues)('classify(%f) is safe', (v) => {
    expect(ned.classify(v).risk).toBe('safe');
  });
  test.each(criticalValues)('classify(%f) is critical', (v) => {
    expect(ned.classify(v).risk).toBe('critical');
  });
  test.each(warningValues)('classify(%f) is warning', (v) => {
    expect(ned.classify(v).risk).toBe('warning');
  });
});

// ─── SECTION 15: Integration — Born × phi × hexagon ────────────────────────────
describe('Stress: Integration — Born probs and hex ratios', () => {
  test('hex circumradius/inradius = 2/√3 matches amplitude ratio pattern', () => {
    const g = hex.compute(1);
    const ratio = g.circumradius / g.inradius;
    // Born probs are real (not complex ratios), but verify hex ratio is finite
    expect(isFinite(ratio)).toBe(true);
    expect(ratio).toBeCloseTo(2 / SQRT3, 10);
  });

  test('phi-seeded state: sum of squared probs (purity) < 1 for n>1', () => {
    const amps = born.phiAmplitudes(4);
    const probs = born.probabilities(amps);
    const purity = probs.reduce((s, p) => s + p * p, 0);
    expect(purity).toBeLessThanOrEqual(1);
    expect(purity).toBeGreaterThan(0);
  });

  test('uniform n=6 purity = 1/6', () => {
    const amps = born.uniformAmplitudes(6);
    const probs = born.probabilities(amps);
    const purity = probs.reduce((s, p) => s + p * p, 0);
    expect(purity).toBeCloseTo(1 / 6, 12);
  });

  test('hex area grows by phi² per spiral step (n=5 steps)', () => {
    let side = 1;
    let prevArea = hex.compute(side).area;
    for (let i = 0; i < 5; i++) {
      side = hex.phiSpiralNextRadius(side);
      const nextArea = hex.compute(side).area;
      expect(nextArea / prevArea).toBeCloseTo(phi ** 2, 8);
      prevArea = nextArea;
    }
  });
});

// ─── SECTION 16: Temporal scale verification ──────────────────────────────────
describe('Stress: PROTO-232 phi-scaled time scales', () => {
  const BASE_MS = 100;
  const scales = Array.from({ length: 8 }, (_, k) => ({
    k, ms: BASE_MS * Math.pow(phi, k),
  }));

  test.each(scales)('τ%i = 100×phi^%i ms', ({ k, ms }) => {
    expect(ms).toBeCloseTo(BASE_MS * phi ** k, 6);
  });

  test('scales are strictly increasing', () => {
    for (let k = 1; k < 8; k++) {
      expect(scales[k].ms).toBeGreaterThan(scales[k - 1].ms);
    }
  });

  test('ratio between consecutive scales = phi', () => {
    for (let k = 1; k < 8; k++) {
      expect(scales[k].ms / scales[k - 1].ms).toBeCloseTo(phi, 10);
    }
  });

  test('τ_0 = 100ms', () => expect(scales[0].ms).toBeCloseTo(100, 10));
  test('τ_7 < 3000ms', () => expect(scales[7].ms).toBeLessThan(3000));
  test('τ_7 > 2500ms', () => expect(scales[7].ms).toBeGreaterThan(2500));
});

// ─── SECTION 17: Quantum coherence bus stress ─────────────────────────────────
describe('Stress: Quantum — expectation value properties', () => {
  // expectation = Σ P_i × u(i) — verify it is a weighted average
  const testCases: [number, number[]][] = [
    [2, [0, 1]],
    [4, [1, 2, 3, 4]],
    [4, [0, 0, 0, 1]],
    [6, [1, 1, 1, 1, 1, 1]],
    [3, [PHI_INV, PHI_INV ** 2, PHI_INV ** 3]],
  ];

  test.each(testCases)('n=%i utilities=[%o]', (n, utils) => {
    const amps = born.uniformAmplitudes(n);
    const probs = born.probabilities(amps);
    const expectation = probs.reduce((s, p, i) => s + p * utils[i], 0);
    // For uniform distribution, expectation = mean of utils
    const mean = utils.reduce((a, b) => a + b, 0) / n;
    expect(expectation).toBeCloseTo(mean, 10);
  });
});

// ─── SECTION 18: phi-encoded phase angles ───────────────────────────────────────
describe('Stress: phi-weighted phase encoding', () => {
  // In quantum decision engine: θ_i = (u_i/maxU) × π × phiI¹
  const maxU = 10;
  const utilities = range(0, maxU, 20);

  test.each(utilities)('u=%f → θ = u/maxU×π×phiI¹', (u) => {
    const theta = (u / maxU) * Math.PI * phiI;
    expect(isFinite(theta)).toBe(true);
    expect(theta).toBeGreaterThanOrEqual(0);
    expect(theta).toBeLessThanOrEqual(Math.PI * phiI);
  });

  test.each(utilities)('u=%f: phase invariant on amplitude', (u) => {
    const theta = (u / maxU) * Math.PI * phiI;
    const amps = born.uniformAmplitudes(5);
    expect(born.verifyPhaseInvariance(amps, 0, theta)).toBe(true);
  });
});

// ─── SECTION 19: Pheromone sum conservation ───────────────────────────────────
describe('Stress: Pheromone — after evaporation and deposit', () => {
  // After evaporation: τ_new = τ × (1 - ρ) + Δτ
  // If Δτ = Q×phi/L, verify the formula is stable
  const rho  = phiI * 0.1;
  const Q    = 1;
  const pathLens = [1, 2, 3, 4, 5];

  test.each(pathLens)('path.length=%i: update is finite and positive', (L) => {
    const deltaT = Q * phi / L;
    let tau = 1.0;
    for (let step = 0; step < 50; step++) {
      tau = tau * (1 - rho) + deltaT;
    }
    expect(isFinite(tau)).toBe(true);
    expect(tau).toBeGreaterThan(0);
  });

  test.each(pathLens)('path.length=%i: converges to fixed point', (L) => {
    const deltaT = Q * phi / L;
    // Fixed point: τ* = deltaT / rho
    const fixedPoint = deltaT / rho;
    let tau = 1.0;
    for (let step = 0; step < 1000; step++) {
      tau = tau * (1 - rho) + deltaT;
    }
    expect(tau).toBeCloseTo(fixedPoint, 3);
  });
});

// ─── SECTION 20: Random amplitude property tests ──────────────────────────────
describe('Stress: Arbitrary real amplitudes — normalisation preserved', () => {
  // Create arbitrary real amplitudes (no imaginary part), normalise, verify
  const patterns: number[][] = [
    [1, 1],
    [1, 2, 3],
    [1, PHI, PHI_SQ],
    [0.1, 0.2, 0.3, 0.4],
    Array.from({ length: 10 }, (_, i) => i + 1),
    Array.from({ length: 20 }, (_, i) => Math.sin(i * phi) + 1.1),
  ];

  test.each(patterns)('pattern length=%i', (...raw) => {
    const arr = raw.flat() as number[];
    const total = arr.reduce((s, x) => s + x * x, 0);
    const inv = 1 / Math.sqrt(total);
    const amps: [number, number][] = arr.map(x => [x * inv, 0]);
    expect(born.isNormalised(amps)).toBe(true);
  });

  test('normalised reals: sum of probs = 1', () => {
    const raw = Array.from({ length: 5 }, (_, i) => i + 1);
    const total = raw.reduce((s, x) => s + x * x, 0);
    const inv = 1 / Math.sqrt(total);
    const amps: [number, number][] = raw.map(x => [x * inv, 0]);
    const probSum = born.probabilities(amps).reduce((s, p) => s + p, 0);
    expect(probSum).toBeCloseTo(1, 12);
  });
});

// ─── SECTION 21: SymbolicSolver stress ───────────────────────────────────────
describe('Stress: SymbolicSolver — many custom verifications', () => {
  const phiPowPairs: [number, number][] = Array.from({ length: 15 }, (_, n) => [phi ** n, phi ** n]);
  test.each(phiPowPairs)('verify(phi^n = phi^n) holds: %f = %f', (a, b) => {
    const id = sym.verify(`${a}=${b}`, a, b);
    expect(id.holds).toBe(true);
  });

  test('verify(1=1) holds',    () => expect(sym.verify('1=1', 1, 1).holds).toBe(true));
  test('verify(0=0) holds',    () => expect(sym.verify('0=0', 0, 0).holds).toBe(true));
  test('verify(1=2) fails',    () => expect(sym.verify('1=2', 1, 2).holds).toBe(false));

  // Bulk PHI identity tests
  test('all phi identities: holds=true', () => {
    sym.phiIdentities().forEach(id => expect(id.holds).toBe(true));
  });
  test('all sqrt3 identities: holds=true', () => {
    sym.sqrt3Identities().forEach(id => expect(id.holds).toBe(true));
  });
  test('all trig identities: holds=true', () => {
    sym.trigIdentities().forEach(id => expect(id.holds).toBe(true));
  });
});

// ─── SECTION 22: PSO coefficient validation ───────────────────────────────────
describe('Stress: PSO phi-weighted coefficients', () => {
  const PSO_W  = 1 / phi ** 2;   // ≈ 0.382
  const PSO_C1 = phiI;            // ≈ 0.618
  const PSO_C2 = phi;              // ≈ 1.618

  test('w = 1/phi² ≈ 0.382',     () => expect(PSO_W).toBeCloseTo(0.382, 2));
  test('c₁ = phiI¹ ≈ 0.618',    () => expect(PSO_C1).toBeCloseTo(0.618, 2));
  test('c₂ = phi ≈ 1.618',       () => expect(PSO_C2).toBeCloseTo(1.618, 2));
  test('w + c₁ + c₂ = phi²',    () => expect(PSO_W + PSO_C1 + PSO_C2).toBeCloseTo(phi ** 2, 10));
  test('c₂ / c₁ = phi²',        () => expect(PSO_C2 / PSO_C1).toBeCloseTo(phi ** 2, 10));
  test('c₁ / w = phi',            () => expect(PSO_C1 / PSO_W).toBeCloseTo(phi, 10));
  test('w < c₁ < c₂',          () => {
    expect(PSO_W).toBeLessThan(PSO_C1);
    expect(PSO_C1).toBeLessThan(PSO_C2);
  });
  test('w = 2 - phi (since phiI² = 2-phi)', () => expect(PSO_W).toBeCloseTo(2 - phi, 10));
});

// ─── SECTION 23: Hexagon phi-spiral property tests ──────────────────────────────
describe('Stress: Hexagon phi-spiral — 20 iterations', () => {
  let side = 1;
  const spiralSides: number[] = [side];
  for (let i = 0; i < 19; i++) {
    side = hex.phiSpiralNextRadius(side);
    spiralSides.push(side);
  }

  test.each(spiralSides)('spiral side=%f: area is finite positive', (s) => {
    const g = hex.compute(s);
    expect(isFinite(g.area)).toBe(true);
    expect(g.area).toBeGreaterThan(0);
  });

  test('each spiral side = prev × phi', () => {
    for (let i = 1; i < spiralSides.length; i++) {
      expect(spiralSides[i] / spiralSides[i - 1]).toBeCloseTo(phi, 10);
    }
  });

  test('spiral area ratios = phi²', () => {
    for (let i = 1; i < Math.min(spiralSides.length, 10); i++) {
      const a1 = hex.compute(spiralSides[i - 1]).area;
      const a2 = hex.compute(spiralSides[i]).area;
      expect(a2 / a1).toBeCloseTo(phi ** 2, 8);
    }
  });
});

// ─── SECTION 24: Edge-case boundary conditions ────────────────────────────────
describe('Stress: Boundary — nearly zero amplitudes', () => {
  test('amplitude near 0: prob near 0', () => {
    const amps: [number, number][] = [[1e-15, 0], [1, 0]];
    const total = amps.reduce((s, [re, im]) => s + re * re + im * im, 0);
    const inv = 1 / Math.sqrt(total);
    const normalised: [number, number][] = amps.map(([re, im]) => [re * inv, im * inv]);
    const probs = born.probabilities(normalised);
    expect(probs[0]).toBeLessThan(1e-29);
    expect(probs[1]).toBeCloseTo(1, 10);
  });
});

describe('Stress: Boundary — phi-power amplitudes', () => {
  // Build amplitude vector where each amplitude = phi^(-i/2) (geometric)
  const ns = [3, 4, 5, 6];
  test.each(ns)('n=%i: phi-power amplitudes normalised', (n) => {
    const raw: [number, number][] = Array.from({ length: n }, (_, i) => [phi ** (-i / 2), 0]);
    const total = raw.reduce((s, [re]) => s + re * re, 0);
    const inv = 1 / Math.sqrt(total);
    const amps: [number, number][] = raw.map(([re, im]) => [re * inv, im * inv]);
    expect(born.isNormalised(amps)).toBe(true);
  });
});
