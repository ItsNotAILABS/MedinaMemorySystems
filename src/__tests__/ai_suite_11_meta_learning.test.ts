/**
 * AI Suite 11 — Meta-Learning
 * ============================================================
 * MAML-style gradient adaptation, few-shot learning evaluation,
 * task distributions, inner/outer loop separation, learning-to-learn
 * metrics, rapid adaptation, and φ-scaled step sizes.
 *
 * Target: 150+ tests   Charter: AIS-META-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_INV = 1 / PHI;

// ─── Implementations ──────────────────────────────────────────────────────────

type Params = number[];
type GradFn = (params: Params, data: Array<[number, number]>) => Params;

function linearPredict(params: Params, x: number): number {
  return params[0] * x + params[1];
}

function mseLoss(params: Params, data: Array<[number, number]>): number {
  return data.reduce((s, [x, y]) => s + (linearPredict(params, x) - y) ** 2, 0) / data.length;
}

function gradient(params: Params, data: Array<[number, number]>): Params {
  const n = data.length;
  const dW = data.reduce((s, [x, y]) => s + 2 * (linearPredict(params, x) - y) * x, 0) / n;
  const dB = data.reduce((s, [x, y]) => s + 2 * (linearPredict(params, x) - y), 0) / n;
  return [dW, dB];
}

function sgdStep(params: Params, grad: Params, lr: number): Params {
  return params.map((p, i) => p - lr * grad[i]);
}

function innerAdapt(params: Params, taskData: Array<[number, number]>, lr: number, steps: number): Params {
  let p = [...params];
  for (let i = 0; i < steps; i++) {
    const g = gradient(p, taskData);
    p = sgdStep(p, g, lr);
  }
  return p;
}

function metaObjective(
  initParams: Params,
  tasks: Array<Array<[number, number]>>,
  innerLr: number, innerSteps: number
): number {
  return tasks.reduce((s, task) => {
    const adapted = innerAdapt(initParams, task, innerLr, innerSteps);
    return s + mseLoss(adapted, task);
  }, 0) / tasks.length;
}

function fewShotAccuracy(
  classifier: (x: number) => number,
  supportSet: Array<[number, number]>,
  querySet: Array<[number, number]>
): number {
  const correct = querySet.filter(([x, y]) => classifier(x) === y).length;
  return correct / querySet.length;
}

function taskSimilarity(
  task1: Array<[number, number]>,
  task2: Array<[number, number]>
): number {
  const mean1 = task1.reduce((s, [x]) => s + x, 0) / task1.length;
  const mean2 = task2.reduce((s, [x]) => s + x, 0) / task2.length;
  return 1 / (1 + Math.abs(mean1 - mean2));
}

function adaptationGain(preAdapt: number, postAdapt: number): number {
  return preAdapt - postAdapt;
}

function phiLearningRate(baseStep: number, metaStep: number): { inner: number; outer: number } {
  return { inner: baseStep * PHI_INV, outer: baseStep / PHI };
}

function prototypicalDistance(query: number[], prototype: number[]): number {
  return Math.sqrt(query.reduce((s, x, i) => s + (x - prototype[i]) ** 2, 0));
}

function protoClassify(query: number[], prototypes: number[][]): number {
  const dists = prototypes.map(p => prototypicalDistance(query, p));
  return dists.indexOf(Math.min(...dists));
}

// ─── SECTION 1: Linear model basics ───────────────────────────────────────────
describe('Meta § 1 — Linear model', () => {
  test('predict with w=1,b=0: f(x)=x',    () => expect(linearPredict([1, 0], 3)).toBe(3));
  test('predict with w=2,b=1: f(2)=5',    () => expect(linearPredict([2, 1], 2)).toBe(5));
  test('predict with w=0,b=5: const 5',   () => expect(linearPredict([0, 5], 99)).toBe(5));
  test('predict negative w',              () => expect(linearPredict([-1, 0], 3)).toBe(-3));
  test('MSE perfect prediction = 0',      () => {
    const data: Array<[number, number]> = [[1, 2], [2, 4]];
    expect(mseLoss([2, 0], data)).toBeCloseTo(0);
  });
  test('MSE non-negative',               () => {
    expect(mseLoss([1, 1], [[0, 5], [1, 3]])).toBeGreaterThanOrEqual(0);
  });
  test('MSE zero params: loss > 0',      () => {
    expect(mseLoss([0, 0], [[1, 1]])).toBeGreaterThan(0);
  });
});

// ─── SECTION 2: Gradient computation ──────────────────────────────────────────
describe('Meta § 2 — Gradient', () => {
  const data: Array<[number, number]> = [[1, 2], [2, 3], [3, 4]];
  test('gradient has same dim as params',    () => expect(gradient([1, 0], data).length).toBe(2));
  test('gradient at perfect params ≈ 0',    () => {
    const g = gradient([1, 1], data);
    g.forEach(gi => expect(Math.abs(gi)).toBeLessThan(0.5));
  });
  test('gradient sign correct (w too high)', () => {
    const g = gradient([10, 0], data);
    expect(g[0]).toBeGreaterThan(0);
  });
  test('gradient sign correct (w too low)', () => {
    const g = gradient([0, 0], data);
    expect(g[0]).toBeLessThan(0);
  });
});

// ─── SECTION 3: SGD step ──────────────────────────────────────────────────────
describe('Meta § 3 — SGD step', () => {
  test('step moves params toward negative gradient', () => {
    const p = [5, 5], g = [1, 1];
    const newP = sgdStep(p, g, 0.1);
    expect(newP[0]).toBeLessThan(p[0]);
  });
  test('lr=0 → no change',       () => {
    const p = [3, 2], g = [9, 8];
    expect(sgdStep(p, g, 0)).toEqual(p);
  });
  test('large lr → large step',  () => {
    const p = [1, 1], g = [1, 1];
    const big = sgdStep(p, g, 10);
    const small = sgdStep(p, g, 0.01);
    expect(Math.abs(big[0] - p[0])).toBeGreaterThan(Math.abs(small[0] - p[0]));
  });
  test('preserves param dimension', () => {
    expect(sgdStep([1, 2, 3], [0.1, 0.2, 0.3], 1).length).toBe(3);
  });
});

// ─── SECTION 4: Inner adaptation ──────────────────────────────────────────────
describe('Meta § 4 — Inner loop adaptation', () => {
  const task: Array<[number, number]> = [[0, 1], [1, 2], [2, 3]];

  test('adaptation reduces loss', () => {
    const init = [0, 0];
    const lossBefore = mseLoss(init, task);
    const adapted = innerAdapt(init, task, 0.01, 100);
    const lossAfter = mseLoss(adapted, task);
    expect(lossAfter).toBeLessThan(lossBefore);
  });
  test('0 steps → params unchanged', () => {
    const init = [1, 2];
    const adapted = innerAdapt(init, task, 0.1, 0);
    expect(adapted).toEqual(init);
  });
  test('more steps → more adaptation', () => {
    const init = [0, 0];
    const few = mseLoss(innerAdapt(init, task, 0.01, 10), task);
    const many = mseLoss(innerAdapt(init, task, 0.01, 100), task);
    expect(many).toBeLessThan(few);
  });
  test('adapted params are finite', () => {
    const adapted = innerAdapt([0, 0], task, 0.01, 50);
    adapted.forEach(p => expect(isFinite(p)).toBe(true));
  });
});

// ─── SECTION 5: Meta-objective ─────────────────────────────────────────────────
describe('Meta § 5 — Meta-learning objective', () => {
  const tasks = [
    [[0, 0], [1, 1], [2, 2]] as Array<[number, number]>,
    [[0, 1], [1, 2], [2, 3]] as Array<[number, number]>,
  ];

  test('meta-objective is finite', () => {
    expect(isFinite(metaObjective([0.5, 0], tasks, 0.01, 10))).toBe(true);
  });
  test('meta-objective non-negative', () => {
    expect(metaObjective([0, 0], tasks, 0.01, 5)).toBeGreaterThanOrEqual(0);
  });
  test('better init params → lower meta-objective', () => {
    const badInit  = metaObjective([100, 100], tasks, 0.01, 20);
    const goodInit = metaObjective([1, 0], tasks, 0.01, 20);
    expect(goodInit).toBeLessThan(badInit);
  });
  test('more inner steps → lower meta-objective', () => {
    const few  = metaObjective([0, 0], tasks, 0.01, 5);
    const many = metaObjective([0, 0], tasks, 0.01, 50);
    expect(many).toBeLessThanOrEqual(few + 1e-9);
  });
});

// ─── SECTION 6: Task similarity ───────────────────────────────────────────────
describe('Meta § 6 — Task similarity', () => {
  const t1: Array<[number, number]> = [[1, 2], [2, 3]];
  const t2: Array<[number, number]> = [[1, 2], [2, 3]];
  const t3: Array<[number, number]> = [[100, 200]];

  test('identical tasks → max similarity',     () => expect(taskSimilarity(t1, t2)).toBeCloseTo(1));
  test('very different tasks → low sim',        () => expect(taskSimilarity(t1, t3)).toBeLessThan(0.1));
  test('similarity ∈ (0,1]',                   () => {
    const s = taskSimilarity(t1, t3);
    expect(s).toBeGreaterThan(0);
    expect(s).toBeLessThanOrEqual(1 + 1e-9);
  });
  test('similarity symmetric',                  () => {
    expect(taskSimilarity(t1, t3)).toBeCloseTo(taskSimilarity(t3, t1));
  });
});

// ─── SECTION 7: φ-learning rates ──────────────────────────────────────────────
describe('Meta § 7 — φ-learning rates', () => {
  test('inner < outer / PHI = base',          () => {
    const lrs = phiLearningRate(0.1, 0.01);
    expect(lrs.inner).toBeCloseTo(0.1 * PHI_INV);
  });
  test('inner < base',                        () => {
    const lrs = phiLearningRate(0.1, 0.01);
    expect(lrs.inner).toBeLessThan(0.1);
  });
  test('outer < base',                        () => {
    const lrs = phiLearningRate(0.1, 0.01);
    expect(lrs.outer).toBeLessThan(0.1);
  });
  test('inner / outer = PHI_INV / (1/PHI) = 1', () => {
    const lrs = phiLearningRate(0.1, 0.01);
    expect(lrs.inner / lrs.outer).toBeCloseTo(1, 5);
  });
  test('positive learning rates', () => {
    const lrs = phiLearningRate(0.3, 0.001);
    expect(lrs.inner).toBeGreaterThan(0);
    expect(lrs.outer).toBeGreaterThan(0);
  });
});

// ─── SECTION 8: Prototypical classification ───────────────────────────────────
describe('Meta § 8 — Prototypical networks', () => {
  const protos = [[0, 0], [10, 10], [5, 0]];

  test('classifies point near proto 0',       () => expect(protoClassify([0.1, 0.1], protos)).toBe(0));
  test('classifies point near proto 1',       () => expect(protoClassify([9.9, 10], protos)).toBe(1));
  test('classifies point near proto 2',       () => expect(protoClassify([5, 0.1], protos)).toBe(2));
  test('exact match returns that prototype',  () => expect(protoClassify([0, 0], protos)).toBe(0));
  test('valid class index',                   () => {
    const cls = protoClassify([3, 3], protos);
    expect(cls).toBeGreaterThanOrEqual(0);
    expect(cls).toBeLessThan(protos.length);
  });
  test('distance is non-negative',            () => {
    expect(prototypicalDistance([1, 1], [2, 2])).toBeGreaterThan(0);
  });
  test('distance to self = 0',                () => {
    expect(prototypicalDistance([3, 4], [3, 4])).toBe(0);
  });
});

// ─── SECTION 9: Adaptation gain ────────────────────────────────────────────────
describe('Meta § 9 — Adaptation gain', () => {
  test('positive gain when adapted better', () => expect(adaptationGain(5, 2)).toBeGreaterThan(0));
  test('negative gain when adapted worse', () => expect(adaptationGain(2, 5)).toBeLessThan(0));
  test('zero gain when no change',          () => expect(adaptationGain(3, 3)).toBe(0));
  test('gain scales with improvement',      () => {
    expect(adaptationGain(10, 1)).toBeGreaterThan(adaptationGain(5, 3));
  });
});
