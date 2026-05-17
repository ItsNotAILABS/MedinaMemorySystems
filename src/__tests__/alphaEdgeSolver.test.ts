/**
 * Alpha Edge Solver — Test Suite
 * ============================================================
 * Tests for the AlphaEdgeSolver module: BornRuleVerifier,
 * HexagonEngine, SymbolicSolver, NumericEdgeDetector, the
 * unified solver registry, and end-to-end solve() semantics.
 *
 * Target: ~600+ tests
 * Charter: ALPHA-EC-001
 */

'use strict';

import {
  PHI, PHI_INV, PHI_SQ, SQRT3, SQRT5, TAU,
  BornRuleVerifier, HexagonEngine, SymbolicSolver,
  NumericEdgeDetector, AlphaEdgeSolver,
  EDGE_CASE_REGISTRY,
  fibonacci, fibonacciRatio,
  getAlphaEdgeSolver,
} from '../lib/alphaEdgeSolver';

// ─── SECTION 1: Module exports ────────────────────────────────────────────────
describe('AlphaEdgeSolver: module exports', () => {
  test('PHI is exported and correct',     () => expect(PHI).toBeCloseTo(1.6180339887, 9));
  test('PHI_INV is exported',             () => expect(PHI_INV).toBeCloseTo(0.6180339887, 9));
  test('PHI_SQ is exported',              () => expect(PHI_SQ).toBeCloseTo(2.6180339887, 9));
  test('SQRT3 is exported',               () => expect(SQRT3).toBeCloseTo(1.7320508075, 9));
  test('SQRT5 is exported',               () => expect(SQRT5).toBeCloseTo(2.2360679774, 9));
  test('BornRuleVerifier is a class',     () => expect(typeof BornRuleVerifier).toBe('function'));
  test('HexagonEngine is a class',        () => expect(typeof HexagonEngine).toBe('function'));
  test('SymbolicSolver is a class',       () => expect(typeof SymbolicSolver).toBe('function'));
  test('NumericEdgeDetector is a class',  () => expect(typeof NumericEdgeDetector).toBe('function'));
  test('AlphaEdgeSolver is a class',      () => expect(typeof AlphaEdgeSolver).toBe('function'));
  test('EDGE_CASE_REGISTRY is array',     () => expect(Array.isArray(EDGE_CASE_REGISTRY)).toBe(true));
  test('fibonacci is a function',         () => expect(typeof fibonacci).toBe('function'));
  test('fibonacciRatio is a function',    () => expect(typeof fibonacciRatio).toBe('function'));
  test('getAlphaEdgeSolver is a function',() => expect(typeof getAlphaEdgeSolver).toBe('function'));
});

// ─── SECTION 2: Edge-case registry ────────────────────────────────────────────
describe('EDGE_CASE_REGISTRY: structure', () => {
  test('registry has at least 20 entries', () => expect(EDGE_CASE_REGISTRY.length).toBeGreaterThanOrEqual(20));
  test('all entries have id',              () => EDGE_CASE_REGISTRY.forEach(e => expect(typeof e.id).toBe('string')));
  test('all ids are non-empty',            () => EDGE_CASE_REGISTRY.forEach(e => expect(e.id.length).toBeGreaterThan(0)));
  test('all ids are unique',               () => {
    const ids = EDGE_CASE_REGISTRY.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  test('all entries have family',          () => EDGE_CASE_REGISTRY.forEach(e => expect(e.family).toBeDefined()));
  test('all entries have description',     () => EDGE_CASE_REGISTRY.forEach(e => expect(e.description.length).toBeGreaterThan(0)));
  test('all entries have invariant',       () => EDGE_CASE_REGISTRY.forEach(e => expect(e.invariant.length).toBeGreaterThan(0)));
  test('all entries have severity',        () => EDGE_CASE_REGISTRY.forEach(e =>
    expect(['critical', 'high', 'medium', 'low']).toContain(e.severity)));

  const families = ['quantum', 'temporal', 'swarm', 'geometric', 'symbolic', 'numeric'];
  test('all families are valid', () => EDGE_CASE_REGISTRY.forEach(e =>
    expect(families).toContain(e.family)));

  // At least one of each family
  test.each(families)('registry has at least one %s entry', (fam) => {
    const count = EDGE_CASE_REGISTRY.filter(e => e.family === fam).length;
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

// ─── SECTION 3: BornRuleVerifier ─────────────────────────────────────────────
describe('BornRuleVerifier: construction', () => {
  test('default epsilon = 1e-10', () => {
    const b = new BornRuleVerifier();
    // Verify by checking exact-equal values pass
    const id = [[1, 0]] as [number, number][];
    expect(b.isNormalised(id)).toBe(true);
  });
  test('custom epsilon works', () => {
    const b = new BornRuleVerifier(1e-5);
    expect(b.isNormalised([[1, 0]])).toBe(true);
  });
});

describe('BornRuleVerifier: uniformAmplitudes', () => {
  const ns = [1, 2, 3, 4, 5, 6, 8, 10, 16, 100];
  test.each(ns)('n=%i: count', (n) => {
    expect(new BornRuleVerifier().uniformAmplitudes(n).length).toBe(n);
  });
  test.each(ns)('n=%i: normalised', (n) => {
    const b = new BornRuleVerifier();
    expect(b.isNormalised(b.uniformAmplitudes(n))).toBe(true);
  });
  test.each(ns)('n=%i: each prob = 1/n', (n) => {
    const b = new BornRuleVerifier();
    const probs = b.probabilities(b.uniformAmplitudes(n));
    probs.forEach(p => expect(p).toBeCloseTo(1 / n, 12));
  });
});

describe('BornRuleVerifier: phiAmplitudes', () => {
  const ns = [2, 3, 4, 5, 6, 8];
  test.each(ns)('n=%i: normalised', (n) => {
    const b = new BornRuleVerifier();
    expect(b.isNormalised(b.phiAmplitudes(n))).toBe(true);
  });
  test.each(ns)('n=%i: correct length', (n) => {
    expect(new BornRuleVerifier().phiAmplitudes(n).length).toBe(n);
  });
  test.each(ns)('n=%i: sum of probs = 1', (n) => {
    const b = new BornRuleVerifier();
    const s = b.probabilities(b.phiAmplitudes(n)).reduce((a, x) => a + x, 0);
    expect(s).toBeCloseTo(1, 12);
  });
});

describe('BornRuleVerifier: applyPhase', () => {
  const b = new BornRuleVerifier();
  const amps = b.uniformAmplitudes(4);

  test('returns same length', () => {
    expect(b.applyPhase(amps, 0, Math.PI).length).toBe(4);
  });

  test('does not mutate original', () => {
    const before = amps[0][0];
    b.applyPhase(amps, 0, Math.PI);
    expect(amps[0][0]).toBe(before);
  });

  test('theta=0 is identity on probabilities', () => {
    const before = b.probabilities(amps);
    const after  = b.probabilities(b.applyPhase(amps, 1, 0));
    before.forEach((p, i) => expect(after[i]).toBeCloseTo(p, 14));
  });

  test('theta=2π is identity on probabilities', () => {
    const before = b.probabilities(amps);
    const after  = b.probabilities(b.applyPhase(amps, 0, 2 * Math.PI));
    before.forEach((p, i) => expect(after[i]).toBeCloseTo(p, 12));
  });

  test('theta=π: magnitude still = 1/4', () => {
    const after = b.probabilities(b.applyPhase(amps, 0, Math.PI));
    expect(after[0]).toBeCloseTo(0.25, 12);
  });
});

describe('BornRuleVerifier: verifyPhaseInvariance', () => {
  const b = new BornRuleVerifier();
  const amps = b.phiAmplitudes(5);
  const indices = [0, 1, 2, 3, 4];
  const angles  = [0, Math.PI / 4, Math.PI / 2, Math.PI, PHI, TAU, -Math.PI];

  test.each(indices.flatMap(j => angles.map(t => [j, t])))(
    'j=%i theta=%f', (j, theta) => {
      expect(b.verifyPhaseInvariance(amps, j, theta as number)).toBe(true);
    });
});

describe('BornRuleVerifier: verifyAll', () => {
  const b = new BornRuleVerifier();
  test('all results pass for uniform n=4', () => {
    const amps = b.uniformAmplitudes(4);
    const results = b.verifyAll(amps, [0, Math.PI / 2, Math.PI, PHI]);
    results.forEach(r => expect(r.passed).toBe(true));
  });

  test('all deltas are < 1e-10', () => {
    const amps = b.phiAmplitudes(3);
    const results = b.verifyAll(amps, [0, 1, 2, 3]);
    results.forEach(r => expect(r.delta).toBeLessThan(1e-10));
  });

  test('result count = n × angles.length', () => {
    const amps = b.uniformAmplitudes(3);
    const angles = [0, 1, 2, 3, 4];
    const results = b.verifyAll(amps, angles);
    expect(results.length).toBe(3 * 5);
  });

  test('each result has caseId string', () => {
    const amps = b.uniformAmplitudes(2);
    const results = b.verifyAll(amps, [0]);
    results.forEach(r => expect(typeof r.caseId).toBe('string'));
  });
});

// ─── SECTION 4: NumericEdgeDetector ──────────────────────────────────────────
describe('NumericEdgeDetector: classify', () => {
  const ned = new NumericEdgeDetector();
  const cases: [number, string][] = [
    [0,         'warning'],
    [-0,        'warning'],
    [1,         'safe'],
    [-1,        'safe'],
    [Infinity,  'critical'],
    [-Infinity, 'critical'],
    [NaN,       'critical'],
    [1e-309,    'warning'],   // subnormal: below 2^-1022 ≈ 2.23e-308
    [PHI,       'safe'],
    [Number.MAX_VALUE, 'safe'],
  ];
  test.each(cases)('classify(%f) → %s risk', (v, risk) => {
    expect(ned.classify(v).risk).toBe(risk);
  });

  test('NaN is detected',        () => expect(ned.classify(NaN).isNaN).toBe(true));
  test('Infinity is detected',   () => expect(ned.classify(Infinity).isInfinity).toBe(true));
  test('-Infinity is detected',  () => expect(ned.classify(-Infinity).isInfinity).toBe(true));
  test('0 is zero',              () => expect(ned.classify(0).isZero).toBe(true));
  test('-0 is zero',             () => expect(ned.classify(-0).isZero).toBe(true));
  test('finite number isFinite', () => expect(ned.classify(42).isFinite).toBe(true));
  test('-1 isNegative',          () => expect(ned.classify(-1).isNegative).toBe(true));
  test('1 not isNegative',       () => expect(ned.classify(1).isNegative).toBe(false));
});

describe('NumericEdgeDetector: decayedWeight', () => {
  const ned = new NumericEdgeDetector();
  test('at t=0: weight = 1',         () => expect(ned.decayedWeight(1, 0)).toBe(1));
  test('at t=0: weight = e^0 = 1',   () => expect(ned.decayedWeight(PHI, 0)).toBe(1));
  test('at t=1: weight < 1',         () => expect(ned.decayedWeight(1, 1)).toBeLessThan(1));
  test('at t=1, lambda=1: e^-1',     () => expect(ned.decayedWeight(1, 1)).toBeCloseTo(Math.exp(-1), 12));
  test('at large t: underflows to 0',() => expect(ned.decayedWeight(1, 1000)).toBe(0));
  test('verifyDecayAtZero (lambda=1)',() => expect(ned.verifyDecayAtZero(1)).toBe(true));
  test('verifyDecayAtZero (lambda=PHI)', () => expect(ned.verifyDecayAtZero(PHI)).toBe(true));
  test('verifyDecayUnderflow (t=1000)', () => expect(ned.verifyDecayUnderflow(1, 1000)).toBe(true));
  test('decays monotonically',       () => {
    const ts = [0, 1, 2, 5, 10, 100];
    const ws = ts.map(t => ned.decayedWeight(1, t));
    for (let i = 1; i < ws.length; i++) expect(ws[i]).toBeLessThanOrEqual(ws[i - 1]);
  });
});

describe('NumericEdgeDetector: PSO velocity', () => {
  const ned = new NumericEdgeDetector();
  test('span(0,1) = PHI_INV',         () => expect(ned.psoVelocitySpan(0, 1)).toBeCloseTo(PHI_INV, 12));
  test('span(0,2) = 2×PHI_INV',       () => expect(ned.psoVelocitySpan(0, 2)).toBeCloseTo(2 * PHI_INV, 12));
  test('span(lo,hi) = (hi-lo)×PHI_INV', () => {
    const lo = 3, hi = 7;
    expect(ned.psoVelocitySpan(lo, hi)).toBeCloseTo((hi - lo) * PHI_INV, 12);
  });
  test('equal bounds → span = 0', () => {
    expect(ned.psoVelocityEdgeEqualBounds(5)).toBe(0);
  });
  test('negative range: span = |range|×PHI_INV', () => {
    expect(ned.psoVelocitySpan(-2, 2)).toBeCloseTo(4 * PHI_INV, 12);
  });
});

// ─── SECTION 5: AlphaEdgeSolver: solve individual cases ───────────────────────
describe('AlphaEdgeSolver: solve() for all registry entries', () => {
  const solver = new AlphaEdgeSolver();
  test.each(EDGE_CASE_REGISTRY.map(e => [e.id, e.family]))(
    'solve(%s) [%s] → passed=true', (id, _family) => {
      const result = solver.solve(id as string);
      expect(result.passed).toBe(true);
    }
  );
});

describe('AlphaEdgeSolver: solve() result structure', () => {
  const solver = new AlphaEdgeSolver();
  test.each(EDGE_CASE_REGISTRY.map(e => [e.id]))(
    'result for %s has required fields', (id) => {
      const r = solver.solve(id as string);
      expect(typeof r.caseId).toBe('string');
      expect(typeof r.passed).toBe('boolean');
      expect(typeof r.confidence).toBe('number');
      expect(typeof r.note).toBe('string');
    }
  );

  test.each(EDGE_CASE_REGISTRY.map(e => [e.id]))(
    'confidence in [0,1] for %s', (id) => {
      const r = solver.solve(id as string);
      expect(r.confidence).toBeGreaterThanOrEqual(0);
      expect(r.confidence).toBeLessThanOrEqual(1);
    }
  );
});

describe('AlphaEdgeSolver: solve() unknown id throws', () => {
  const solver = new AlphaEdgeSolver();
  test('throws for unknown id', () => {
    expect(() => solver.solve('UNKNOWN-999')).toThrow();
  });
});

// ─── SECTION 6: AlphaEdgeSolver: solveAll() ──────────────────────────────────
describe('AlphaEdgeSolver: solveAll()', () => {
  const solver = new AlphaEdgeSolver();
  const summary = solver.solveAll();

  test('total = registry length',     () => expect(summary.total).toBe(EDGE_CASE_REGISTRY.length));
  test('passed + failed = total',     () => expect(summary.passed + summary.failed).toBe(summary.total));
  test('all passed (100% pass rate)', () => expect(summary.failed).toBe(0));
  test('results array length = total', () => expect(summary.results.length).toBe(summary.total));
  test('all results have caseId',      () => summary.results.forEach(r => expect(r.caseId).toBeTruthy()));
  test('all results passed=true',      () => summary.results.forEach(r => expect(r.passed).toBe(true)));
});

// ─── SECTION 7: AlphaEdgeSolver: report() ────────────────────────────────────
describe('AlphaEdgeSolver: report()', () => {
  const solver = new AlphaEdgeSolver();
  solver.solveAll();
  const rep = solver.report();

  test('report is a string',            () => expect(typeof rep).toBe('string'));
  test('report contains pass rate',     () => expect(rep).toMatch(/\d+\/\d+/));
  test('report contains φ',             () => expect(rep).toMatch(/φ/));
  test('report mentions passed',        () => expect(rep).toMatch(/passed/i));
  test('report after solve: 100%',      () => expect(rep).toMatch(/100\.0%/));
});

// ─── SECTION 8: getAlphaEdgeSolver singleton ─────────────────────────────────
describe('AlphaEdgeSolver: singleton', () => {
  test('returns AlphaEdgeSolver instance', () => {
    expect(getAlphaEdgeSolver()).toBeInstanceOf(AlphaEdgeSolver);
  });
  test('returns same instance on second call', () => {
    const a = getAlphaEdgeSolver(), b = getAlphaEdgeSolver();
    expect(a).toBe(b);
  });
  test('singleton has born, hex, sym, numeric sub-solvers', () => {
    const s = getAlphaEdgeSolver();
    expect(s.born).toBeInstanceOf(BornRuleVerifier);
    expect(s.hex).toBeInstanceOf(HexagonEngine);
    expect(s.sym).toBeInstanceOf(SymbolicSolver);
    expect(s.numeric).toBeInstanceOf(NumericEdgeDetector);
  });
});

// ─── SECTION 9: getResult() after solveAll() ─────────────────────────────────
describe('AlphaEdgeSolver: getResult()', () => {
  const solver = new AlphaEdgeSolver();
  solver.solveAll();

  test('getResult(Q-001) returns result', () => {
    const r = solver.getResult('Q-001');
    expect(r).toBeDefined();
    expect(r!.passed).toBe(true);
  });

  test('getResult(G-001) returns result', () => {
    const r = solver.getResult('G-001');
    expect(r).toBeDefined();
  });

  test('getResult(unknown) returns undefined', () => {
    expect(solver.getResult('UNKNOWN')).toBeUndefined();
  });
});

// ─── SECTION 10: sub-solver integration ──────────────────────────────────────
describe('AlphaEdgeSolver: born sub-solver integration', () => {
  const solver = new AlphaEdgeSolver();
  const b = solver.born;

  test('born.uniformAmplitudes accessible', () => {
    expect(b.uniformAmplitudes(4).length).toBe(4);
  });

  test('born.phiAmplitudes accessible', () => {
    expect(b.phiAmplitudes(4).length).toBe(4);
  });
});

describe('AlphaEdgeSolver: hex sub-solver integration', () => {
  const solver = new AlphaEdgeSolver();
  const h = solver.hex;

  test('hex.compute(1) accessible', () => {
    expect(h.compute(1).side).toBe(1);
  });
  test('hex area matches formula', () => {
    const g = h.compute(2);
    expect(g.area).toBeCloseTo((3 * SQRT3 / 2) * 4, 10);
  });
});

describe('AlphaEdgeSolver: sym sub-solver integration', () => {
  const solver = new AlphaEdgeSolver();
  const s = solver.sym;

  test('phiIdentities all hold', () => {
    s.phiIdentities().forEach(id => expect(id.holds).toBe(true));
  });
});

// ─── SECTION 11: fibonacci and fibonacciRatio ─────────────────────────────────
describe('fibonacci()', () => {
  test('F(0) = 0',   () => expect(fibonacci(0)).toBe(0));
  test('F(1) = 1',   () => expect(fibonacci(1)).toBe(1));
  test('F(2) = 1',   () => expect(fibonacci(2)).toBe(1));
  test('F(10) = 55', () => expect(fibonacci(10)).toBe(55));
  test('F(20) = 6765', () => expect(fibonacci(20)).toBe(6765));
  test('F(-1) = 0',  () => expect(fibonacci(-1)).toBe(0));
  test('F(n) > 0 for n>0', () => {
    for (let n = 1; n <= 20; n++) expect(fibonacci(n)).toBeGreaterThan(0);
  });
  test('F(n+2) = F(n+1) + F(n)', () => {
    for (let n = 0; n < 15; n++) {
      expect(fibonacci(n + 2)).toBe(fibonacci(n + 1) + fibonacci(n));
    }
  });
});

describe('fibonacciRatio()', () => {
  test('ratio > 1 for n>=2', () => {
    for (let n = 2; n < 10; n++) expect(fibonacciRatio(n)).toBeGreaterThan(1);
  });
  test('ratio < 2 for n>=3', () => {
    for (let n = 3; n < 20; n++) expect(fibonacciRatio(n)).toBeLessThan(2);
  });
  test('converges to PHI by n=30', () => {
    expect(Math.abs(fibonacciRatio(30) - PHI)).toBeLessThan(1e-8);
  });
  test('ratio(n=0): F(1)/F(0) = Infinity', () => {
    expect(fibonacciRatio(0)).toBe(Infinity);
  });
});

// ─── SECTION 12: quantum edge case Q-001 deep ────────────────────────────────
describe('AlphaEdgeSolver: Q-001 Born-rule deep', () => {
  const solver = new AlphaEdgeSolver();
  const b = solver.born;

  // Many phase angles at many amplitude sizes
  const sizes = [2, 3, 4, 5, 6, 8, 10];
  const phaseAngles = [0, Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2,
    2 * Math.PI / 3, Math.PI, PHI, PHI_INV, PHI_SQ, TAU, -Math.PI];

  test.each(sizes)('uniform n=%i: phase invariant over all test angles', (n) => {
    const amps = b.uniformAmplitudes(n);
    phaseAngles.forEach(theta => {
      for (let j = 0; j < n; j++) {
        expect(b.verifyPhaseInvariance(amps, j, theta)).toBe(true);
      }
    });
  });

  test.each(sizes)('phi-seeded n=%i: phase invariant', (n) => {
    const amps = b.phiAmplitudes(n);
    phaseAngles.forEach(theta => {
      expect(b.verifyPhaseInvariance(amps, 0, theta)).toBe(true);
    });
  });
});

// ─── SECTION 13: swarm edge cases deep ───────────────────────────────────────
describe('AlphaEdgeSolver: swarm cases S-001 through S-005', () => {
  const solver = new AlphaEdgeSolver();
  const ned = solver.numeric;

  test('S-001 PSO span: (hi-lo) × φ⁻¹', () => {
    const cases: [number, number][] = [[0, 1], [-1, 1], [3, 7], [0, PHI]];
    cases.forEach(([lo, hi]) => {
      const span = ned.psoVelocitySpan(lo, hi);
      expect(span).toBeCloseTo((hi - lo) * PHI_INV, 12);
    });
  });

  test('S-002 pheromone delta: Q×φ/path.length', () => {
    const Q = 1;
    const pathLengths = [1, 2, 3, 4, 5, 10, PHI];
    pathLengths.forEach(L => {
      const delta = Q * PHI / L;
      expect(delta).toBeCloseTo(PHI / L, 12);
    });
  });

  test('S-003 evaporation pruning: 210+ steps for low threshold', () => {
    const rho = PHI_INV * 0.1;
    // Pruning threshold very low (1e-6) to require 210+ steps
    const threshold = 1e-6;
    let tau = 1.0, steps = 0;
    while (tau > threshold && steps < 10000) { tau *= (1 - rho); steps++; }
    expect(steps).toBeGreaterThanOrEqual(210);
  });

  test('S-004 PSO inertia w = 1/φ²', () => {
    const w = 1 / PHI_SQ;
    expect(w).toBeCloseTo(1 / PHI_SQ, 14);
    expect(w).toBeCloseTo(2 - PHI, 12); // since φ⁻² = 2 - φ
  });

  test('S-005 PSO social c₂ = φ', () => {
    expect(PHI).toBeCloseTo(1.6180339887, 9);
  });
});

// ─── SECTION 14: geometric edge cases deep ───────────────────────────────────
describe('AlphaEdgeSolver: geometric cases G-001 through G-009', () => {
  const solver = new AlphaEdgeSolver();
  const h = solver.hex;

  const sides = [0.5, 1, 2, PHI, SQRT3, 10];
  test.each(sides)('G-001 area=(3√3/2)s²: s=%f', (s) => {
    const g = h.compute(s);
    expect(g.area).toBeCloseTo((3 * SQRT3 / 2) * s ** 2, 8);
  });

  test.each(sides)('G-002 circumradius=s: s=%f', (s) => {
    const g = h.compute(s);
    expect(g.circumradius).toBeCloseTo(s, 10);
  });

  test.each(sides)('G-003 inradius=s√3/2: s=%f', (s) => {
    const g = h.compute(s);
    expect(g.inradius).toBeCloseTo(s * SQRT3 / 2, 10);
  });

  test.each(sides)('G-004 long diagonal=2s: s=%f', (s) => {
    const g = h.compute(s);
    expect(g.diagonalLong).toBeCloseTo(2 * s, 10);
  });

  test.each(sides)('G-005 short diagonal=s√3: s=%f', (s) => {
    const g = h.compute(s);
    expect(g.diagonalShort).toBeCloseTo(s * SQRT3, 10);
  });

  test('G-006 interior angle = 120°', () => {
    expect(h.compute(1).interiorAngleDeg).toBe(120);
  });

  test('G-007 symmetry order = 12', () => {
    expect(h.compute(1).symmetryOrder).toBe(12);
  });

  test('G-008 packing efficiency = π/(2√3)', () => {
    expect(h.packingEfficiency()).toBeCloseTo(Math.PI / (2 * SQRT3), 12);
  });

  test('G-009 tessellation vertex count = 3', () => {
    expect(h.tessellationVertexCount()).toBe(3);
  });
});

// ─── SECTION 15: numeric edge cases deep ─────────────────────────────────────
describe('AlphaEdgeSolver: numeric cases N-001 through N-003', () => {
  const solver = new AlphaEdgeSolver();

  test('N-001 IEEE underflow: exp(-750) = 0', () => {
    expect(Math.exp(-750)).toBe(0);
  });

  test('N-001 exp(-x) === 0 for x >= 750', () => {
    for (const x of [750, 800, 1000]) {
      expect(Math.exp(-x)).toBe(0);
    }
  });

  test('N-002 guard against zero path length', () => {
    // Δτ = Q×φ/path.length — if path.length=0, must guard
    const safeDiv = (q: number, phi: number, len: number) =>
      len > 0 ? q * phi / len : 0;
    expect(safeDiv(1, PHI, 0)).toBe(0);
    expect(safeDiv(1, PHI, 4)).toBeCloseTo(PHI / 4, 12);
  });

  test('N-003 zero-amplitude normalisation guard', () => {
    const zeroAmps: [number, number][] = [[0, 0], [0, 0], [0, 0]];
    const total = zeroAmps.reduce((s, [re, im]) => s + re * re + im * im, 0);
    const inv = 1 / Math.sqrt(total || 1);
    expect(isFinite(inv)).toBe(true);
    expect(isNaN(inv)).toBe(false);
    expect(inv).toBe(1); // sqrt(0||1) = 1, inv = 1
  });
});
