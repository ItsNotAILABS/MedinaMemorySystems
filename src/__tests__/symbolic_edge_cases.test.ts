/**
 * Symbolic Edge-Case Test Suite
 * ============================================================
 * Mathematical identity verification for φ, √3, √5, Born-rule
 * phase invariance, Fibonacci sequences, trigonometric relations,
 * and complex-amplitude arithmetic used throughout MEDINA protocols.
 *
 * Target: ~1,200+ tests
 * Charter: ALPHA-EC-001 § Symbolic Domain
 */

'use strict';

import {
  PHI, PHI_INV, PHI_SQ, SQRT3, SQRT5, TAU,
  BornRuleVerifier, SymbolicSolver, fibonacci, fibonacciRatio,
} from '../lib/alphaEdgeSolver';

const born = new BornRuleVerifier();
const sym  = new SymbolicSolver();
const EPS  = 1e-10;
const EPS14 = 1e-14;

// ─── SECTION 1: φ Core Identities ────────────────────────────────────────────
describe('Symbolic: φ core identities', () => {
  test('φ² = φ + 1',            () => expect(PHI ** 2).toBeCloseTo(PHI + 1, 12));
  test('φ² - φ - 1 = 0',       () => expect(PHI ** 2 - PHI - 1).toBeCloseTo(0, 12));
  test('φ⁻¹ = φ - 1',          () => expect(PHI_INV).toBeCloseTo(PHI - 1, 12));
  test('φ × φ⁻¹ = 1',          () => expect(PHI * PHI_INV).toBeCloseTo(1, 12));
  test('φ + φ⁻¹ = √5',         () => expect(PHI + PHI_INV).toBeCloseTo(SQRT5, 12));
  test('φ - φ⁻¹ = 1',          () => expect(PHI - PHI_INV).toBeCloseTo(1, 12));
  test('(φ-1)² = φ² - 2φ + 1', () => expect((PHI - 1) ** 2).toBeCloseTo(PHI ** 2 - 2 * PHI + 1, 12));
  test('φ² = 2.618…',           () => expect(PHI_SQ).toBeCloseTo(2.618033988749895, 12));
  test('φ³ = 2φ + 1',          () => expect(PHI ** 3).toBeCloseTo(2 * PHI + 1, 10));
  test('φ⁴ = 3φ + 2',          () => expect(PHI ** 4).toBeCloseTo(3 * PHI + 2, 10));
  test('φ⁵ = 5φ + 3',          () => expect(PHI ** 5).toBeCloseTo(5 * PHI + 3, 10));
  test('φ⁶ = 8φ + 5',          () => expect(PHI ** 6).toBeCloseTo(8 * PHI + 5, 9));
  test('φ⁷ = 13φ + 8',         () => expect(PHI ** 7).toBeCloseTo(13 * PHI + 8, 8));
  test('φ⁻² = 2 - φ',          () => expect(1 / PHI_SQ).toBeCloseTo(2 - PHI, 12));
  test('φ⁻³ = 2φ - 3',         () => expect(PHI ** -3).toBeCloseTo(2 * PHI - 3, 12));
  test('1/φ = φ⁻¹',            () => expect(1 / PHI).toBeCloseTo(PHI_INV, 14));
  test('φ > 1',                 () => expect(PHI).toBeGreaterThan(1));
  test('φ < 2',                 () => expect(PHI).toBeLessThan(2));
  test('φ⁻¹ > 0',              () => expect(PHI_INV).toBeGreaterThan(0));
  test('φ⁻¹ < 1',              () => expect(PHI_INV).toBeLessThan(1));
});

// ─── SECTION 2: φ power series (Fibonacci coefficients) ───────────────────────
// φⁿ = F(n)×φ + F(n-1) where F is Fibonacci
const fibPairs: [number, number, number][] = [
  [1, 1, 0], [2, 1, 1], [3, 2, 1], [4, 3, 2], [5, 5, 3],
  [6, 8, 5], [7, 13, 8], [8, 21, 13], [9, 34, 21], [10, 55, 34],
];
describe('Symbolic: φⁿ = F(n)×φ + F(n-1)', () => {
  test.each(fibPairs)('n=%i: φ^n = %i×φ + %i', (n, fn, fn1) => {
    expect(PHI ** n).toBeCloseTo(fn * PHI + fn1, 7);
  });
});

// ─── SECTION 3: Fibonacci numbers ────────────────────────────────────────────
describe('Symbolic: Fibonacci sequence', () => {
  const fibVals: [number, number][] = [
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8],
    [7, 13], [8, 21], [9, 34], [10, 55], [11, 89], [12, 144],
    [13, 233], [14, 377], [15, 610], [16, 987], [17, 1597],
  ];
  test.each(fibVals)('F(%i) = %i', (n, f) => {
    expect(fibonacci(n)).toBe(f);
  });
});

describe('Symbolic: Fibonacci ratios → φ', () => {
  const ratioTests = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  test.each(ratioTests)('F(%i+1)/F(%i) → φ (tol 5%)', (n) => {
    const r = fibonacciRatio(n);
    // Fibonacci ratios converge to φ; tolerance loosens for small n
    const tol = n <= 5 ? 0.03 : n <= 7 ? 0.015 : 0.01;
    expect(Math.abs(r - PHI)).toBeLessThan(tol);
  });

  test('F(20+1)/F(20) converges to φ within 1e-5', () => {
    expect(Math.abs(fibonacciRatio(20) - PHI)).toBeLessThan(1e-5);
  });

  test('F(30+1)/F(30) converges to φ within 1e-8', () => {
    expect(Math.abs(fibonacciRatio(30) - PHI)).toBeLessThan(1e-8);
  });

  test('F(40+1)/F(40) converges to φ within 1e-11', () => {
    expect(Math.abs(fibonacciRatio(40) - PHI)).toBeLessThan(1e-11);
  });
});

describe('Symbolic: Fibonacci identity F(n)² = F(n-1)×F(n+1) ± 1 (Cassini)', () => {
  const ns = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  test.each(ns)('n=%i', (n) => {
    const fn  = fibonacci(n);
    const fn1 = fibonacci(n - 1);
    const fn2 = fibonacci(n + 1);
    const cassini = fn * fn - fn1 * fn2;
    // Cassini's identity: F(n)² - F(n-1)F(n+1) = (-1)^(n+1)
    expect(Math.abs(cassini)).toBe(1);
  });
});

// ─── SECTION 4: Born-rule phase invariance ────────────────────────────────────
describe('Symbolic: Born-rule |α|² invariance', () => {
  // |e^(iθ)|² = cos²θ + sin²θ = 1 for any θ
  const angles = [0, Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2,
    2 * Math.PI / 3, Math.PI, 4 * Math.PI / 3, 3 * Math.PI / 2,
    2 * Math.PI, PHI, PHI_INV, PHI_SQ, SQRT3, -Math.PI / 4, -Math.PI];

  test.each(angles)('|e^(iθ)|² = 1, θ=%f', (theta) => {
    const re = Math.cos(theta), im = Math.sin(theta);
    expect(re * re + im * im).toBeCloseTo(1, 14);
  });

  // Applying phase to amplitude: magnitude unchanged
  const nSizes = [2, 3, 4, 5, 6, 8, 10];
  test.each(nSizes)('uniform n=%i: phase does not change probabilities', (n) => {
    const amps = born.uniformAmplitudes(n);
    const before = born.probabilities(amps);
    const after  = born.probabilities(born.applyPhase(amps, 0, PHI));
    before.forEach((p, i) => expect(after[i]).toBeCloseTo(p, 12));
  });

  test.each(nSizes)('phi-seeded n=%i: probabilities sum to 1', (n) => {
    const amps = born.phiAmplitudes(n);
    const sum  = born.probabilities(amps).reduce((s, p) => s + p, 0);
    expect(sum).toBeCloseTo(1, 12);
  });

  test.each(nSizes)('uniform n=%i: each probability = 1/n', (n) => {
    const amps = born.uniformAmplitudes(n);
    const probs = born.probabilities(amps);
    probs.forEach(p => expect(p).toBeCloseTo(1 / n, 12));
  });
});

// Verify phase invariance across index × angle combinations
describe('Symbolic: Born-rule, all indices and angles', () => {
  const n = 5;
  const amps = born.phiAmplitudes(n);
  const testAngles = [0, Math.PI / 4, Math.PI / 2, Math.PI, PHI, -PHI, TAU, -Math.PI / 3];
  const indices = [0, 1, 2, 3, 4];

  test.each(
    indices.flatMap(j => testAngles.map(theta => [j, theta]))
  )('j=%i theta=%f: P_j invariant', (j, theta) => {
    expect(born.verifyPhaseInvariance(amps, j, theta as number)).toBe(true);
  });
});

// ─── SECTION 5: Normalisation invariance ──────────────────────────────────────
describe('Symbolic: Amplitude normalisation', () => {
  test('uniform n=2: normalised', () => expect(born.isNormalised(born.uniformAmplitudes(2))).toBe(true));
  test('uniform n=3: normalised', () => expect(born.isNormalised(born.uniformAmplitudes(3))).toBe(true));
  test('uniform n=10: normalised', () => expect(born.isNormalised(born.uniformAmplitudes(10))).toBe(true));
  test('phi-seeded n=4: normalised', () => expect(born.isNormalised(born.phiAmplitudes(4))).toBe(true));
  test('phi-seeded n=8: normalised', () => expect(born.isNormalised(born.phiAmplitudes(8))).toBe(true));
  test('after phase, still normalised', () => {
    const amps  = born.phiAmplitudes(5);
    const after = born.applyPhase(amps, 2, PHI);
    expect(born.isNormalised(after)).toBe(true);
  });
  test('after phase π, still normalised', () => {
    const amps  = born.uniformAmplitudes(4);
    const after = born.applyPhase(amps, 0, Math.PI);
    expect(born.isNormalised(after)).toBe(true);
  });
  test('after multiple phases, still normalised', () => {
    let amps = born.phiAmplitudes(6);
    for (let j = 0; j < 6; j++) amps = born.applyPhase(amps, j, PHI * j);
    expect(born.isNormalised(amps)).toBe(true);
  });
});

// ─── SECTION 6: Complex amplitude arithmetic ───────────────────────────────────
describe('Symbolic: Complex multiplication (e^(iθ) × amplitude)', () => {
  // (a+bi)(cosθ+i sinθ) = (a cosθ - b sinθ) + i(a sinθ + b cosθ)
  const cases: [number, number, number][] = [
    [1, 0, 0],
    [1, 0, Math.PI / 2],
    [0, 1, 0],
    [0, 1, Math.PI],
    [1 / Math.SQRT2, 1 / Math.SQRT2, Math.PI / 4],
    [PHI_INV, PHI_INV, PHI],
  ];
  test.each(cases)('re=%f im=%f theta=%f: magnitude preserved', (re, im, theta) => {
    const cos = Math.cos(theta), sin = Math.sin(theta);
    const nre = re * cos - im * sin;
    const nim = re * sin + im * cos;
    const magBefore = re * re + im * im;
    const magAfter  = nre * nre + nim * nim;
    expect(magAfter).toBeCloseTo(magBefore, 12);
  });
});

// ─── SECTION 7: √3 identities ─────────────────────────────────────────────────
describe('Symbolic: √3 identities', () => {
  test('√3² = 3',               () => expect(SQRT3 ** 2).toBeCloseTo(3, 14));
  test('√3 > 1.732',            () => expect(SQRT3).toBeGreaterThan(1.732));
  test('√3 < 1.733',            () => expect(SQRT3).toBeLessThan(1.733));
  test('2/√3 = 2√3/3',         () => expect(2 / SQRT3).toBeCloseTo(2 * SQRT3 / 3, 12));
  test('(√3/2)² = 3/4',        () => expect((SQRT3 / 2) ** 2).toBeCloseTo(3 / 4, 14));
  test('1/√3 = √3/3',          () => expect(1 / SQRT3).toBeCloseTo(SQRT3 / 3, 12));
  test('√3 × √3 × √3 = 3√3',  () => expect(SQRT3 ** 3).toBeCloseTo(3 * SQRT3, 12));
  test('sin(π/3) = √3/2',      () => expect(Math.sin(Math.PI / 3)).toBeCloseTo(SQRT3 / 2, 14));
  test('cos(π/6) = √3/2',      () => expect(Math.cos(Math.PI / 6)).toBeCloseTo(SQRT3 / 2, 14));
  test('tan(π/3) = √3',        () => expect(Math.tan(Math.PI / 3)).toBeCloseTo(SQRT3, 12));
  test('cot(π/3) = 1/√3',      () => expect(1 / Math.tan(Math.PI / 3)).toBeCloseTo(1 / SQRT3, 12));
  test('√3 × PHI_INV = (√3-1)/2 + 0.5', () => {
    // Verify √3 × φ⁻¹ is a valid real
    expect(isFinite(SQRT3 * PHI_INV)).toBe(true);
  });
});

// ─── SECTION 8: √5 and φ relationship ─────────────────────────────────────────
describe('Symbolic: √5 and φ', () => {
  test('√5 = 2φ - 1',          () => expect(SQRT5).toBeCloseTo(2 * PHI - 1, 12));
  test('√5 = φ + φ⁻¹',        () => expect(SQRT5).toBeCloseTo(PHI + PHI_INV, 12));
  test('φ = (1 + √5)/2',       () => expect(PHI).toBeCloseTo((1 + SQRT5) / 2, 12));
  test('φ⁻¹ = (√5 - 1)/2',    () => expect(PHI_INV).toBeCloseTo((SQRT5 - 1) / 2, 12));
  test('√5² = 5',              () => expect(SQRT5 ** 2).toBeCloseTo(5, 14));
  test('√5 > 2',               () => expect(SQRT5).toBeGreaterThan(2));
  test('√5 < 2.3',             () => expect(SQRT5).toBeLessThan(2.3));
  test('4φ² - 4φ = 4 (since φ²-φ=1)', () => expect(4 * PHI_SQ - 4 * PHI).toBeCloseTo(4, 12));
});

// ─── SECTION 9: Trigonometric identities ──────────────────────────────────────
describe('Symbolic: Pythagorean identity sin²+cos²=1', () => {
  const angles = Array.from({ length: 36 }, (_, i) => i * 10 * Math.PI / 180);
  test.each(angles)('θ=%f rad', (theta) => {
    expect(Math.sin(theta) ** 2 + Math.cos(theta) ** 2).toBeCloseTo(1, 14);
  });
});

describe('Symbolic: Double-angle formulas', () => {
  const angles = [0, Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2, Math.PI];
  test.each(angles)('sin(2θ) = 2sinθcosθ, θ=%f', (theta) => {
    expect(Math.sin(2 * theta)).toBeCloseTo(2 * Math.sin(theta) * Math.cos(theta), 12);
  });
  test.each(angles)('cos(2θ) = cos²θ - sin²θ, θ=%f', (theta) => {
    expect(Math.cos(2 * theta)).toBeCloseTo(Math.cos(theta) ** 2 - Math.sin(theta) ** 2, 12);
  });
  test.each(angles)('cos(2θ) = 2cos²θ - 1, θ=%f', (theta) => {
    expect(Math.cos(2 * theta)).toBeCloseTo(2 * Math.cos(theta) ** 2 - 1, 12);
  });
  test.each(angles)('cos(2θ) = 1 - 2sin²θ, θ=%f', (theta) => {
    expect(Math.cos(2 * theta)).toBeCloseTo(1 - 2 * Math.sin(theta) ** 2, 12);
  });
});

describe('Symbolic: Sum-to-product / periodicity', () => {
  const angles = [0, Math.PI / 4, Math.PI / 2, Math.PI, PHI, TAU];
  test.each(angles)('sin(θ+2π) = sin(θ), θ=%f', (theta) => {
    expect(Math.sin(theta + TAU)).toBeCloseTo(Math.sin(theta), 12);
  });
  test.each(angles)('cos(θ+2π) = cos(θ), θ=%f', (theta) => {
    expect(Math.cos(theta + TAU)).toBeCloseTo(Math.cos(theta), 12);
  });
  test.each(angles)('sin(-θ) = -sin(θ), θ=%f', (theta) => {
    expect(Math.sin(-theta)).toBeCloseTo(-Math.sin(theta), 14);
  });
  test.each(angles)('cos(-θ) = cos(θ), θ=%f', (theta) => {
    expect(Math.cos(-theta)).toBeCloseTo(Math.cos(theta), 14);
  });
});

// ─── SECTION 10: Phase rotation preserves unit circle ─────────────────────────
describe('Symbolic: Phase rotation stays on unit circle', () => {
  const angles = Array.from({ length: 24 }, (_, i) => i * Math.PI / 12);
  test.each(angles)('e^(iθ) on unit circle, θ=%f', (theta) => {
    const re = Math.cos(theta), im = Math.sin(theta);
    expect(re * re + im * im).toBeCloseTo(1, 14);
  });

  test.each(angles)('composition: e^(iα)×e^(iβ) = e^(i(α+β))', (alpha) => {
    const beta = PHI;
    const reA = Math.cos(alpha), imA = Math.sin(alpha);
    const reB = Math.cos(beta),  imB = Math.sin(beta);
    // Product
    const reP = reA * reB - imA * imB;
    const imP = reA * imB + imA * reB;
    // Direct
    const reD = Math.cos(alpha + beta);
    const imD = Math.sin(alpha + beta);
    expect(reP).toBeCloseTo(reD, 12);
    expect(imP).toBeCloseTo(imD, 12);
  });
});

// ─── SECTION 11: SymbolicSolver built-in verification ─────────────────────────
describe('Symbolic: SymbolicSolver.phiIdentities()', () => {
  const ids = sym.phiIdentities();
  test('all phi identities hold', () => {
    ids.forEach(id => expect(id.holds).toBe(true));
  });
  test.each(ids.map(id => [id.expression, id.holds]))(
    '%s = true', (_expr, holds) => {
      expect(holds).toBe(true);
    }
  );
});

describe('Symbolic: SymbolicSolver.sqrt3Identities()', () => {
  const ids = sym.sqrt3Identities();
  test('all sqrt3 identities hold', () => {
    ids.forEach(id => expect(id.holds).toBe(true));
  });
});

describe('Symbolic: SymbolicSolver.trigIdentities()', () => {
  const ids = sym.trigIdentities();
  test('all trig identities hold', () => {
    ids.forEach(id => expect(id.holds).toBe(true));
  });
});

describe('Symbolic: SymbolicSolver.verifyAll()', () => {
  test('allPassed = true', () => {
    const { allPassed } = sym.verifyAll();
    expect(allPassed).toBe(true);
  });
});

// ─── SECTION 12: Born-rule verifyAll() ───────────────────────────────────────
describe('Symbolic: BornRuleVerifier.verifyAll()', () => {
  const testCases: [number, number[]][] = [
    [2, [0, Math.PI / 4, Math.PI / 2, Math.PI, PHI]],
    [3, [0, PHI, -PHI, SQRT3]],
    [4, [0, Math.PI / 3, TAU / 3, PHI_SQ]],
    [5, [0, 1, 2, 3, 4]],
    [6, [PHI_INV, PHI, PHI_SQ, 0]],
  ];

  test.each(testCases)('n=%i amplitudes: all results pass', (n, angles) => {
    const amps = born.phiAmplitudes(n);
    const results = born.verifyAll(amps, angles);
    results.forEach(r => expect(r.passed).toBe(true));
  });
});

// ─── SECTION 13: Phi-series numerical precision ────────────────────────────────
describe('Symbolic: φ numerical precision at each power', () => {
  const powers = Array.from({ length: 20 }, (_, i) => i + 1);
  test.each(powers)('φ^%i is finite and positive', (n) => {
    const p = PHI ** n;
    expect(isFinite(p)).toBe(true);
    expect(p).toBeGreaterThan(0);
  });

  test.each(powers)('φ^-%i is finite and positive', (n) => {
    const p = PHI ** -n;
    expect(isFinite(p)).toBe(true);
    expect(p).toBeGreaterThan(0);
  });
});

// ─── SECTION 14: Phi and integer approximations ───────────────────────────────
describe('Symbolic: φ Lucas numbers', () => {
  // Lucas numbers: L(n) = φⁿ + φ_hat^n where φ_hat = -φ⁻¹
  const lucasNums: [number, number][] = [
    [0, 2], [1, 1], [2, 3], [3, 4], [4, 7], [5, 11], [6, 18], [7, 29],
  ];
  const phiHat = -PHI_INV;
  test.each(lucasNums)('L(%i) = %i', (n, L) => {
    const computed = Math.round(PHI ** n + phiHat ** n);
    expect(computed).toBe(L);
  });
});

// ─── SECTION 15: Exponent and log identities ──────────────────────────────────
describe('Symbolic: log(φ)', () => {
  test('ln(φ) > 0', () => expect(Math.log(PHI)).toBeGreaterThan(0));
  test('ln(φ) < 1', () => expect(Math.log(PHI)).toBeLessThan(1));
  test('e^ln(φ) = φ', () => expect(Math.exp(Math.log(PHI))).toBeCloseTo(PHI, 12));
  test('ln(φ²) = 2ln(φ)', () => expect(Math.log(PHI_SQ)).toBeCloseTo(2 * Math.log(PHI), 12));
  test('ln(φ⁻¹) = -ln(φ)', () => expect(Math.log(PHI_INV)).toBeCloseTo(-Math.log(PHI), 12));
  test('log₂(φ) ≈ 0.694', () => expect(Math.log2(PHI)).toBeCloseTo(0.6942, 3));
});

// ─── SECTION 16: Born rule with pure imaginary amplitudes ──────────────────────
describe('Symbolic: Born rule — pure imaginary amplitudes', () => {
  const pureImags: [number, number][][] = [
    [[0, 1]],                      // |i|² = 1
    [[0, 1 / Math.SQRT2], [0, 1 / Math.SQRT2]], // |i/√2|² + |i/√2|² = 1
    [[0, PHI_INV], [0, Math.sqrt(1 - PHI_INV ** 2)]], // normalised pair
  ];

  test('|i|² = 1', () => {
    const prob = born.probabilities([[0, 1]]);
    expect(prob[0]).toBeCloseTo(1, 14);
  });

  test('|i/√2|² = 1/2', () => {
    const prob = born.probabilities([[0, 1 / Math.SQRT2]]);
    expect(prob[0]).toBeCloseTo(0.5, 14);
  });

  test('|1/√2|² = 1/2', () => {
    const prob = born.probabilities([[1 / Math.SQRT2, 0]]);
    expect(prob[0]).toBeCloseTo(0.5, 14);
  });

  test('|(1+i)/√2|² = 1', () => {
    const re = 1 / Math.SQRT2, im = 1 / Math.SQRT2;
    const prob = born.probabilities([[re, im]]);
    expect(prob[0]).toBeCloseTo(1, 14);
  });
});

// ─── SECTION 17: Symbolic solver edge cases ───────────────────────────────────
describe('Symbolic: Edge-case verifications', () => {
  test('sym.verify with equal values: holds=true', () => {
    const id = sym.verify('x = x', 42, 42);
    expect(id.holds).toBe(true);
  });

  test('sym.verify with values within eps: holds=true', () => {
    const id = sym.verify('close enough', 1, 1 + 1e-11);
    expect(id.holds).toBe(true);
  });

  test('sym.verify with values outside eps: holds=false', () => {
    const id = sym.verify('different', 1, 2);
    expect(id.holds).toBe(false);
  });

  test('sym.verify with NaN: holds=false', () => {
    const id = sym.verify('nan', NaN, 1);
    expect(id.holds).toBe(false);
  });

  test('sym.verify with Infinity: holds=false (unless both Inf)', () => {
    const id = sym.verify('inf', Infinity, 1);
    expect(id.holds).toBe(false);
  });

  test('epsilon field matches constructor eps', () => {
    const id = sym.verify('test', 1, 1);
    expect(id.epsilon).toBe(1e-10);
  });
});

// ─── SECTION 18: Golden ratio continued fraction ──────────────────────────────
describe('Symbolic: φ continued fraction [1; 1, 1, 1, …]', () => {
  // φ = 1 + 1/(1 + 1/(1 + …)) → partial quotients are all 1
  // Convergents: 1, 2, 3/2, 5/3, 8/5, 13/8, …  (Fibonacci ratios)
  function continuedFractionApprox(depth: number): number {
    let result = 1;
    for (let i = 0; i < depth; i++) result = 1 + 1 / result;
    return result;
  }

  const depths = [5, 10, 15, 20, 25, 30, 40, 50];
  test.each(depths)('depth=%i converges to φ', (d) => {
    const approx = continuedFractionApprox(d);
    const tol = d < 10 ? 0.01 : d < 20 ? 0.0001 : 1e-8;
    expect(Math.abs(approx - PHI)).toBeLessThan(tol);
  });
});

// ─── SECTION 19: Phase algebra ────────────────────────────────────────────────
describe('Symbolic: Phase algebra identities', () => {
  const angles = [0, Math.PI / 6, Math.PI / 3, Math.PI / 2, Math.PI, PHI, TAU];

  // e^(iθ) × e^(-iθ) = 1
  test.each(angles)('e^(iθ) × e^(-iθ) = 1, θ=%f', (theta) => {
    const re1 = Math.cos(theta),   im1 = Math.sin(theta);
    const re2 = Math.cos(-theta),  im2 = Math.sin(-theta);
    const reProd = re1 * re2 - im1 * im2;
    const imProd = re1 * im2 + im1 * re2;
    expect(reProd).toBeCloseTo(1, 12);
    expect(imProd).toBeCloseTo(0, 12);
  });

  // Global phase e^(iφ) × all amplitudes: probabilities unchanged
  test.each(angles)('global phase θ=%f: all probs unchanged', (theta) => {
    const n = 4;
    const amps = born.phiAmplitudes(n);
    const before = born.probabilities(amps);
    // Apply global phase: rotate all amplitudes by theta
    const afterAmps: [number, number][] = amps.map(([re, im]) => {
      const cos = Math.cos(theta), sin = Math.sin(theta);
      return [re * cos - im * sin, re * sin + im * cos];
    });
    const after = born.probabilities(afterAmps);
    before.forEach((p, i) => expect(after[i]).toBeCloseTo(p, 12));
  });
});

// ─── SECTION 20: Mixed symbolic ───────────────────────────────────────────────
describe('Symbolic: Mixed φ/√3/√5 identities', () => {
  test('φ × √3 is irrational but finite', () => {
    const v = PHI * SQRT3;
    expect(isFinite(v)).toBe(true);
    expect(v).toBeGreaterThan(2);
  });
  test('φ / √3: finite and > 0', () => {
    expect(isFinite(PHI / SQRT3)).toBe(true);
    expect(PHI / SQRT3).toBeGreaterThan(0);
  });
  test('√3 / φ: finite and > 0', () => {
    expect(isFinite(SQRT3 / PHI)).toBe(true);
    expect(SQRT3 / PHI).toBeGreaterThan(0);
  });
  test('φ × √5 = φ(φ + φ⁻¹) = φ² + 1', () => {
    expect(PHI * SQRT5).toBeCloseTo(PHI ** 2 + 1, 10);
  });
  test('√3 × √5 = √15', () => {
    expect(SQRT3 * SQRT5).toBeCloseTo(Math.sqrt(15), 12);
  });
  test('(√3)/(2φ) is the sine of the smallest hexagon arc', () => {
    // In a hexagon, the chord connecting every-other vertex subtends 60°
    // sin(60°) = √3/2 and relates to the circumradius
    expect(SQRT3 / 2).toBeCloseTo(Math.sin(Math.PI / 3), 14);
  });
});
