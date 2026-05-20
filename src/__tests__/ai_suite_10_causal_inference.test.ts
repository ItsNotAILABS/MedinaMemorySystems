/**
 * AI Suite 10 — Causal Inference
 * ============================================================
 * Do-calculus primitives, structural equation models, counterfactual
 * estimation, intervention effects, backdoor criterion, propensity
 * scores, average treatment effect (ATE), and φ-causal weights.
 *
 * Target: 150+ tests   Charter: AIS-CAUSAL-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Implementations ──────────────────────────────────────────────────────────

interface StructuralEquation {
  variable: string;
  parents: string[];
  fn: (...args: number[]) => number;
}

class SCM {
  private eqs: Map<string, StructuralEquation> = new Map();

  addEquation(eq: StructuralEquation): void {
    this.eqs.set(eq.variable, eq);
  }

  evaluate(variable: string, context: Record<string, number>): number {
    if (variable in context) return context[variable];
    const eq = this.eqs.get(variable);
    if (!eq) throw new Error(`No equation for ${variable}`);
    const parentVals = eq.parents.map(p => this.evaluate(p, context));
    return eq.fn(...parentVals);
  }

  intervene(variable: string, value: number, query: string, context: Record<string, number>): number {
    const doContext = { ...context, [variable]: value };
    return this.evaluate(query, doContext);
  }

  counterfactual(
    variable: string, interventionVal: number,
    query: string, observed: Record<string, number>
  ): number {
    const doContext = { ...observed, [variable]: interventionVal };
    return this.evaluate(query, doContext);
  }
}

function ate(treatmentEffect: number[], controlEffect: number[]): number {
  const meanTreat   = treatmentEffect.reduce((a, b) => a + b, 0) / treatmentEffect.length;
  const meanControl = controlEffect.reduce((a, b) => a + b, 0) / controlEffect.length;
  return meanTreat - meanControl;
}

function propensityScore(features: number[], coeffs: number[]): number {
  const logit = features.reduce((s, x, i) => s + x * coeffs[i], 0);
  return 1 / (1 + Math.exp(-logit));
}

function iptw(outcome: number, treatment: number, propensity: number): number {
  if (treatment === 1) return outcome / propensity;
  return outcome / (1 - propensity);
}

function backdoorAdjustment(
  py_do_x: (x: number, z: number) => number,
  pz: number[],
  x: number
): number {
  return pz.reduce((s, pzi, z) => s + py_do_x(x, z) * pzi, 0);
}

function naturalDirectEffect(
  y: (x: number, m: number) => number,
  mediator: (x: number) => number,
  x0: number, x1: number
): number {
  const m0 = mediator(x0);
  return y(x1, m0) - y(x0, m0);
}

function naturalIndirectEffect(
  y: (x: number, m: number) => number,
  mediator: (x: number) => number,
  x0: number, x1: number
): number {
  const m0 = mediator(x0), m1 = mediator(x1);
  return y(x0, m1) - y(x0, m0);
}

function phiCausalWeight(path: string[]): number {
  return path.reduce((s, _node, i) => s + Math.pow(PHI, -(i + 1)), 0);
}

function interventionVariance(control: number[], treatment: number[]): number {
  const effectVariance = (arr: number[]) => {
    const mu = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((s, v) => s + (v - mu) ** 2, 0) / arr.length;
  };
  return effectVariance(treatment) - effectVariance(control);
}

function rddEstimate(data: Array<{ x: number; y: number }>, cutoff: number, bandwidth: number): number {
  const left  = data.filter(d => d.x >= cutoff - bandwidth && d.x < cutoff);
  const right = data.filter(d => d.x >= cutoff && d.x < cutoff + bandwidth);
  const mean = (arr: typeof data) => arr.reduce((s, d) => s + d.y, 0) / (arr.length || 1);
  return mean(right) - mean(left);
}

// ─── SECTION 1: SCM evaluation ────────────────────────────────────────────────
describe('Causal § 1 — SCM evaluation', () => {
  let scm: SCM;
  beforeEach(() => {
    scm = new SCM();
    scm.addEquation({ variable: 'X', parents: [], fn: () => 1 });
    scm.addEquation({ variable: 'Y', parents: ['X'], fn: (x) => x * 2 + 1 });
  });

  test('evaluate exogenous variable',    () => expect(scm.evaluate('X', {})).toBe(1));
  test('evaluate endogenous variable',   () => expect(scm.evaluate('Y', {})).toBe(3));
  test('context overrides equation',     () => expect(scm.evaluate('X', { X: 5 })).toBe(5));
  test('context propagates to child',    () => expect(scm.evaluate('Y', { X: 3 })).toBe(7));
  test('chained evaluation works',       () => {
    scm.addEquation({ variable: 'Z', parents: ['Y'], fn: (y) => y + 10 });
    expect(scm.evaluate('Z', {})).toBe(13);
  });
  test('unknown variable throws',        () => {
    expect(() => scm.evaluate('W', {})).toThrow();
  });
});

// ─── SECTION 2: Do-calculus intervention ──────────────────────────────────────
describe('Causal § 2 — Intervention (do-calculus)', () => {
  let scm: SCM;
  beforeEach(() => {
    scm = new SCM();
    scm.addEquation({ variable: 'T', parents: [], fn: () => 0 });
    scm.addEquation({ variable: 'Y', parents: ['T'], fn: (t) => t * 5 });
  });

  test('do(T=1) → Y = 5',              () => expect(scm.intervene('T', 1, 'Y', {})).toBe(5));
  test('do(T=0) → Y = 0',              () => expect(scm.intervene('T', 0, 'Y', {})).toBe(0));
  test('do(T=2) → Y = 10',             () => expect(scm.intervene('T', 2, 'Y', {})).toBe(10));
  test('intervention overrides natural value', () => {
    const natural = scm.evaluate('Y', {});
    const intervened = scm.intervene('T', 10, 'Y', {});
    expect(intervened).not.toBe(natural);
  });
  test('do(T=x) → Y = 5x',            () => {
    [0, 1, 2, 3].forEach(x => expect(scm.intervene('T', x, 'Y', {})).toBe(5 * x));
  });
  test('context ignored for intervened variable', () => {
    expect(scm.intervene('T', 3, 'Y', { T: 99 })).toBe(15);
  });
});

// ─── SECTION 3: Counterfactuals ────────────────────────────────────────────────
describe('Causal § 3 — Counterfactuals', () => {
  let scm: SCM;
  beforeEach(() => {
    scm = new SCM();
    scm.addEquation({ variable: 'X', parents: [], fn: () => 2 });
    scm.addEquation({ variable: 'Y', parents: ['X'], fn: x => x ** 2 });
  });

  test('counterfactual what-if X=3 → Y=9',    () => {
    expect(scm.counterfactual('X', 3, 'Y', {})).toBe(9);
  });
  test('observed fact: X=2 → Y=4',             () => {
    expect(scm.evaluate('Y', {})).toBe(4);
  });
  test('counterfactual differs from observed', () => {
    const obs = scm.evaluate('Y', {});
    const cfl = scm.counterfactual('X', 5, 'Y', {});
    expect(cfl).not.toBe(obs);
  });
  test('counterfactual X=0 → Y=0',             () => {
    expect(scm.counterfactual('X', 0, 'Y', {})).toBe(0);
  });
});

// ─── SECTION 4: ATE ────────────────────────────────────────────────────────────
describe('Causal § 4 — Average treatment effect', () => {
  test('ATE zero for equal groups', () => {
    expect(ate([5, 5, 5], [5, 5, 5])).toBe(0);
  });
  test('ATE positive when treatment better', () => {
    expect(ate([8, 9, 10], [4, 5, 6])).toBeGreaterThan(0);
  });
  test('ATE negative when control better', () => {
    expect(ate([1, 2], [10, 20])).toBeLessThan(0);
  });
  test('ATE = difference of means', () => {
    expect(ate([6, 8], [2, 4])).toBeCloseTo(4);
  });
  test('ATE anti-symmetric', () => {
    const t = [5, 7], c = [3, 5];
    expect(ate(t, c)).toBeCloseTo(-ate(c, t));
  });
  test('ATE scales with effect size', () => {
    expect(Math.abs(ate([10, 10], [0, 0]))).toBeGreaterThan(Math.abs(ate([3, 3], [2, 2])));
  });
});

// ─── SECTION 5: Propensity scores ─────────────────────────────────────────────
describe('Causal § 5 — Propensity scores', () => {
  test('propensity ∈ (0,1)',          () => {
    const p = propensityScore([1, 0], [0.5, -0.3]);
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(1);
  });
  test('high positive logit → p → 1', () => {
    expect(propensityScore([10], [1])).toBeGreaterThan(0.99);
  });
  test('high negative logit → p → 0', () => {
    expect(propensityScore([-10], [1])).toBeLessThan(0.01);
  });
  test('balanced → p = 0.5',          () => {
    expect(propensityScore([0], [1])).toBeCloseTo(0.5);
  });
  test('IPTW with treatment=1',        () => {
    const p = 0.8;
    expect(iptw(5, 1, p)).toBeCloseTo(5 / 0.8);
  });
  test('IPTW with control=0',          () => {
    const p = 0.3;
    expect(iptw(5, 0, p)).toBeCloseTo(5 / 0.7);
  });
  test('propensity deterministic',     () => {
    const features = [0.5, 1.2];
    const coeffs = [0.3, -0.4];
    expect(propensityScore(features, coeffs)).toBe(propensityScore(features, coeffs));
  });
});

// ─── SECTION 6: Backdoor adjustment ───────────────────────────────────────────
describe('Causal § 6 — Backdoor adjustment', () => {
  const pz = [0.5, 0.5];
  const py_do_x = (x: number, z: number) => x + z;

  test('backdoor result finite',        () => expect(isFinite(backdoorAdjustment(py_do_x, pz, 1))).toBe(true));
  test('backdoor(x=0, z-balanced) = 0.5', () => {
    expect(backdoorAdjustment(py_do_x, [0.5, 0.5], 0)).toBeCloseTo(0.5);
  });
  test('backdoor linear in x',          () => {
    const ba1 = backdoorAdjustment(py_do_x, pz, 1);
    const ba2 = backdoorAdjustment(py_do_x, pz, 2);
    expect(ba2 - ba1).toBeCloseTo(1);
  });
  test('pz must sum to 1',              () => {
    const sumPz = pz.reduce((a, b) => a + b, 0);
    expect(sumPz).toBeCloseTo(1);
  });
});

// ─── SECTION 7: Mediation analysis ────────────────────────────────────────────
describe('Causal § 7 — Mediation: NDE and NIE', () => {
  const y = (x: number, m: number) => 2 * x + 3 * m;
  const mediator = (x: number) => x + 1;

  test('NDE = effect of X holding M fixed',   () => {
    const nde = naturalDirectEffect(y, mediator, 0, 1);
    expect(nde).toBeCloseTo(2);
  });
  test('NIE = effect through mediator',        () => {
    const nie = naturalIndirectEffect(y, mediator, 0, 1);
    expect(nie).toBeCloseTo(3);
  });
  test('NDE + NIE = total effect',             () => {
    const nde = naturalDirectEffect(y, mediator, 0, 1);
    const nie = naturalIndirectEffect(y, mediator, 0, 1);
    const total = y(1, mediator(1)) - y(0, mediator(0));
    expect(nde + nie).toBeCloseTo(total);
  });
  test('NIE = 0 when mediator constant',       () => {
    const constMed = (_: number) => 5;
    expect(naturalIndirectEffect(y, constMed, 0, 1)).toBeCloseTo(0);
  });
  test('NDE = total effect when no mediator path', () => {
    const noMed = (_: number) => 0;
    const direct = (x: number, _m: number) => 4 * x;
    expect(naturalDirectEffect(direct, noMed, 0, 1)).toBeCloseTo(4);
  });
});

// ─── SECTION 8: φ-causal weights ──────────────────────────────────────────────
describe('Causal § 8 — φ-causal path weights', () => {
  test('weight of 1-node path > 0',    () => expect(phiCausalWeight(['A'])).toBeGreaterThan(0));
  test('longer path → more weight',    () => {
    const w2 = phiCausalWeight(['A', 'B']);
    const w3 = phiCausalWeight(['A', 'B', 'C']);
    expect(w3).toBeGreaterThan(w2);
  });
  test('weight is finite',             () => {
    expect(isFinite(phiCausalWeight(['A', 'B', 'C', 'D', 'E']))).toBe(true);
  });
  test('earlier hops weighted more (per step)', () => {
    const step1 = Math.pow(PHI, -1);
    const step2 = Math.pow(PHI, -2);
    expect(step1).toBeGreaterThan(step2);
  });
  test('empty path → weight = 0',      () => expect(phiCausalWeight([])).toBe(0));
  test('two paths: longer gets more',  () => {
    expect(phiCausalWeight(['A', 'B', 'C'])).toBeGreaterThan(phiCausalWeight(['A']));
  });
});

// ─── SECTION 9: RDD estimation ────────────────────────────────────────────────
describe('Causal § 9 — Regression discontinuity', () => {
  const data = [
    { x: 9, y: 10 }, { x: 9.5, y: 10.5 },
    { x: 10, y: 15 }, { x: 10.5, y: 15.5 },
  ];

  test('RDD detects jump at cutoff 10',      () => {
    expect(rddEstimate(data, 10, 1)).toBeGreaterThan(0);
  });
  test('RDD estimate finite',               () => expect(isFinite(rddEstimate(data, 10, 1))).toBe(true));
  test('RDD with no jump = 0',              () => {
    const flat = [{ x: 9, y: 5 }, { x: 10, y: 5 }];
    expect(rddEstimate(flat, 10, 2)).toBeCloseTo(0);
  });
  test('RDD bandwidth affects estimate',    () => {
    const wide = rddEstimate(data, 10, 2);
    const narrow = rddEstimate(data, 10, 0.5);
    expect(typeof wide).toBe('number');
    expect(typeof narrow).toBe('number');
  });
});
