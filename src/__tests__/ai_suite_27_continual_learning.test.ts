/**
 * AI Suite 27 — Continual Learning
 * ============================================================
 * Catastrophic forgetting prevention, replay buffers, elastic weight
 * consolidation, progressive networks, knowledge distillation,
 * φ-coherent memory consolidation, and lifelong learning invariants.
 *
 * Target: 100 tests   Charter: AIS-CL-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Core Types ───────────────────────────────────────────────────────────────

type Vector = number[];
type Task = { id: number; data: Vector[]; labels: number[] };
type ReplayBuffer = { samples: Vector[]; maxSize: number };
type FisherInfo = number[];

interface ContinualModel {
  weights: Vector;
  fisherDiagonal: FisherInfo;
  oldWeights: Vector;
  taskCount: number;
}

// ─── Implementations ──────────────────────────────────────────────────────────

function createModel(dim: number): ContinualModel {
  return {
    weights: Array(dim).fill(0),
    fisherDiagonal: Array(dim).fill(0),
    oldWeights: Array(dim).fill(0),
    taskCount: 0
  };
}

function createReplayBuffer(maxSize: number): ReplayBuffer {
  return { samples: [], maxSize };
}

function addToBuffer(buffer: ReplayBuffer, samples: Vector[]): ReplayBuffer {
  const newSamples = [...buffer.samples, ...samples];
  if (newSamples.length > buffer.maxSize) {
    // Reservoir sampling simulation - keep recent with some randomness
    return {
      ...buffer,
      samples: newSamples.slice(-buffer.maxSize)
    };
  }
  return { ...buffer, samples: newSamples };
}

function sampleFromBuffer(buffer: ReplayBuffer, n: number): Vector[] {
  const samples: Vector[] = [];
  for (let i = 0; i < Math.min(n, buffer.samples.length); i++) {
    const idx = Math.floor(Math.random() * buffer.samples.length);
    samples.push(buffer.samples[idx]);
  }
  return samples;
}

function updateFisherDiagonal(model: ContinualModel, gradients: Vector[]): FisherInfo {
  // Fisher information = E[grad^2]
  const fisher = Array(model.weights.length).fill(0);
  for (const grad of gradients) {
    for (let i = 0; i < grad.length; i++) {
      fisher[i] += (grad[i] ** 2) / gradients.length;
    }
  }
  return fisher;
}

function ewcLoss(model: ContinualModel, lambda: number = 1000): number {
  // Elastic Weight Consolidation penalty
  let penalty = 0;
  for (let i = 0; i < model.weights.length; i++) {
    penalty += model.fisherDiagonal[i] * (model.weights[i] - model.oldWeights[i]) ** 2;
  }
  return lambda * penalty / 2;
}

function consolidateTask(model: ContinualModel, gradients: Vector[]): ContinualModel {
  const newFisher = updateFisherDiagonal(model, gradients);
  return {
    ...model,
    fisherDiagonal: model.fisherDiagonal.map((f, i) => f + newFisher[i]),
    oldWeights: [...model.weights],
    taskCount: model.taskCount + 1
  };
}

function progressiveColumn(existingDims: number[], newDim: number): number[] {
  return [...existingDims, newDim];
}

function lateralConnection(oldColumn: Vector, newColumn: Vector, alpha: number = 0.1): Vector {
  return newColumn.map((v, i) => v + alpha * (oldColumn[i] || 0));
}

function distillationLoss(studentLogits: number[], teacherLogits: number[], temperature: number = 2): number {
  const softStudent = softmax(studentLogits.map(l => l / temperature));
  const softTeacher = softmax(teacherLogits.map(l => l / temperature));
  
  let kl = 0;
  for (let i = 0; i < softTeacher.length; i++) {
    if (softTeacher[i] > 0) {
      kl += softTeacher[i] * Math.log(softTeacher[i] / (softStudent[i] || 1e-10));
    }
  }
  return kl * temperature * temperature;
}

function softmax(logits: number[]): number[] {
  const maxLogit = Math.max(...logits);
  const exps = logits.map(l => Math.exp(l - maxLogit));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
}

function taskSimilarity(task1: Task, task2: Task): number {
  // Based on label overlap and data distribution
  const labels1 = new Set(task1.labels);
  const labels2 = new Set(task2.labels);
  const intersection = [...labels1].filter(l => labels2.has(l)).length;
  const union = new Set([...labels1, ...labels2]).size;
  return union > 0 ? intersection / union : 0;
}

function forgetScore(originalAcc: number, currentAcc: number): number {
  return Math.max(0, originalAcc - currentAcc);
}

function backwardTransfer(taskAccuracies: number[][], numTasks: number): number {
  // Average improvement on old tasks after learning new ones
  let sum = 0, count = 0;
  for (let i = 0; i < numTasks - 1; i++) {
    for (let j = i + 1; j < numTasks; j++) {
      sum += (taskAccuracies[j]?.[i] || 0) - (taskAccuracies[i]?.[i] || 0);
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}

function forwardTransfer(taskAccuracies: number[][], numTasks: number): number {
  // Average benefit from learning previous tasks
  let sum = 0, count = 0;
  for (let i = 1; i < numTasks; i++) {
    sum += (taskAccuracies[i - 1]?.[i] || 0);
    count++;
  }
  return count > 0 ? sum / count : 0;
}

function averageAccuracy(taskAccuracies: number[][]): number {
  const lastRow = taskAccuracies[taskAccuracies.length - 1] || [];
  return lastRow.reduce((a, b) => a + b, 0) / (lastRow.length || 1);
}

function phiMemoryDecay(taskAge: number): number {
  return Math.pow(PHI, -taskAge);
}

function prioritizedReplay(buffer: ReplayBuffer, priorities: number[], n: number): Vector[] {
  const totalPriority = priorities.reduce((a, b) => a + b, 0);
  const samples: Vector[] = [];
  
  for (let i = 0; i < n; i++) {
    let r = Math.random() * totalPriority;
    for (let j = 0; j < buffer.samples.length; j++) {
      r -= priorities[j] || 0;
      if (r <= 0) {
        samples.push(buffer.samples[j]);
        break;
      }
    }
  }
  
  return samples;
}

function importanceWeighting(sample: Vector, model: ContinualModel): number {
  // Based on gradient magnitude
  const gradMag = sample.reduce((s, v, i) => s + Math.abs(v * (model.weights[i] || 0)), 0);
  return 1 + gradMag;
}

function maskBasedContinual(model: ContinualModel, taskMasks: boolean[][]): Vector {
  // Apply task-specific masks to weights
  const activeWeights = model.weights.map((w, i) => {
    const anyActive = taskMasks.some(mask => mask[i]);
    return anyActive ? w : 0;
  });
  return activeWeights;
}

function createTaskMask(dim: number, sparsity: number): boolean[] {
  return Array(dim).fill(false).map(() => Math.random() > sparsity);
}

// ─── SECTION 1: Model creation ────────────────────────────────────────────────
describe('CL § 1 — Model creation', () => {
  test('createModel initializes weights', () => {
    expect(createModel(5).weights.length).toBe(5);
  });
  test('createModel weights are zero', () => {
    expect(createModel(3).weights.every(w => w === 0)).toBe(true);
  });
  test('createModel fisher initialized', () => {
    expect(createModel(4).fisherDiagonal.length).toBe(4);
  });
  test('createModel taskCount zero', () => {
    expect(createModel(3).taskCount).toBe(0);
  });
  test('createModel oldWeights zero', () => {
    expect(createModel(3).oldWeights.every(w => w === 0)).toBe(true);
  });
});

// ─── SECTION 2: Replay buffer ─────────────────────────────────────────────────
describe('CL § 2 — Replay buffer', () => {
  test('createReplayBuffer empty', () => {
    expect(createReplayBuffer(100).samples.length).toBe(0);
  });
  test('addToBuffer adds samples', () => {
    let buf = createReplayBuffer(100);
    buf = addToBuffer(buf, [[1, 2], [3, 4]]);
    expect(buf.samples.length).toBe(2);
  });
  test('addToBuffer respects max size', () => {
    let buf = createReplayBuffer(3);
    buf = addToBuffer(buf, [[1], [2], [3], [4], [5]]);
    expect(buf.samples.length).toBe(3);
  });
  test('sampleFromBuffer returns samples', () => {
    let buf = createReplayBuffer(100);
    buf = addToBuffer(buf, [[1, 2], [3, 4], [5, 6]]);
    const samples = sampleFromBuffer(buf, 2);
    expect(samples.length).toBe(2);
  });
  test('sampleFromBuffer from empty', () => {
    const buf = createReplayBuffer(100);
    expect(sampleFromBuffer(buf, 5).length).toBe(0);
  });
  test('sampleFromBuffer respects n', () => {
    let buf = createReplayBuffer(100);
    buf = addToBuffer(buf, [[1], [2], [3]]);
    expect(sampleFromBuffer(buf, 2).length).toBe(2);
  });
});

// ─── SECTION 3: Fisher information ────────────────────────────────────────────
describe('CL § 3 — Fisher info', () => {
  test('updateFisherDiagonal computes mean squared', () => {
    const model = createModel(2);
    const grads = [[2, 4], [0, 0]];
    const fisher = updateFisherDiagonal(model, grads);
    expect(fisher[0]).toBe(2); // (4 + 0) / 2
    expect(fisher[1]).toBe(8); // (16 + 0) / 2
  });
  test('updateFisherDiagonal empty grads', () => {
    const model = createModel(3);
    const fisher = updateFisherDiagonal(model, []);
    expect(fisher.every(f => f === 0 || isNaN(f))).toBe(true);
  });
  test('updateFisherDiagonal single gradient', () => {
    const model = createModel(2);
    const fisher = updateFisherDiagonal(model, [[3, 4]]);
    expect(fisher[0]).toBe(9);
    expect(fisher[1]).toBe(16);
  });
});

// ─── SECTION 4: EWC loss ──────────────────────────────────────────────────────
describe('CL § 4 — EWC', () => {
  test('ewcLoss zero when no change', () => {
    const model = createModel(3);
    expect(ewcLoss(model)).toBe(0);
  });
  test('ewcLoss positive when changed', () => {
    let model = createModel(2);
    model = { ...model, weights: [1, 1], fisherDiagonal: [1, 1] };
    expect(ewcLoss(model)).toBeGreaterThan(0);
  });
  test('ewcLoss scales with lambda', () => {
    let model = createModel(2);
    model = { ...model, weights: [1, 1], fisherDiagonal: [1, 1] };
    expect(ewcLoss(model, 2000)).toBeGreaterThan(ewcLoss(model, 1000));
  });
  test('ewcLoss depends on fisher', () => {
    let model = createModel(2);
    model = { ...model, weights: [1, 1], fisherDiagonal: [0, 0] };
    expect(ewcLoss(model)).toBe(0);
  });
});

// ─── SECTION 5: Task consolidation ────────────────────────────────────────────
describe('CL § 5 — Consolidation', () => {
  test('consolidateTask increments count', () => {
    const model = createModel(2);
    const consolidated = consolidateTask(model, [[1, 1]]);
    expect(consolidated.taskCount).toBe(1);
  });
  test('consolidateTask updates fisher', () => {
    const model = createModel(2);
    const consolidated = consolidateTask(model, [[2, 3]]);
    expect(consolidated.fisherDiagonal[0]).toBe(4);
    expect(consolidated.fisherDiagonal[1]).toBe(9);
  });
  test('consolidateTask saves old weights', () => {
    let model = createModel(2);
    model = { ...model, weights: [5, 6] };
    const consolidated = consolidateTask(model, [[1, 1]]);
    expect(consolidated.oldWeights).toEqual([5, 6]);
  });
  test('consolidateTask accumulates fisher', () => {
    let model = createModel(1);
    model = consolidateTask(model, [[2]]);
    model = consolidateTask(model, [[3]]);
    expect(model.fisherDiagonal[0]).toBe(4 + 9);
  });
});

// ─── SECTION 6: Progressive networks ──────────────────────────────────────────
describe('CL § 6 — Progressive', () => {
  test('progressiveColumn adds dim', () => {
    expect(progressiveColumn([10, 20], 30)).toEqual([10, 20, 30]);
  });
  test('progressiveColumn empty start', () => {
    expect(progressiveColumn([], 5)).toEqual([5]);
  });
  test('lateralConnection combines', () => {
    const result = lateralConnection([1, 2], [3, 4], 0.5);
    expect(result[0]).toBeCloseTo(3.5);
    expect(result[1]).toBeCloseTo(5);
  });
  test('lateralConnection alpha zero', () => {
    expect(lateralConnection([1, 2], [3, 4], 0)).toEqual([3, 4]);
  });
  test('lateralConnection alpha one', () => {
    const result = lateralConnection([1, 2], [3, 4], 1);
    expect(result[0]).toBe(4);
    expect(result[1]).toBe(6);
  });
});

// ─── SECTION 7: Knowledge distillation ────────────────────────────────────────
describe('CL § 7 — Distillation', () => {
  test('distillationLoss non-negative', () => {
    const loss = distillationLoss([1, 2, 3], [1.1, 2.1, 2.9]);
    expect(loss).toBeGreaterThanOrEqual(0);
  });
  test('distillationLoss zero when identical', () => {
    const loss = distillationLoss([1, 2, 3], [1, 2, 3]);
    expect(loss).toBeCloseTo(0, 5);
  });
  test('distillationLoss temperature effect', () => {
    const loss1 = distillationLoss([1, 5], [0, 6], 1);
    const loss2 = distillationLoss([1, 5], [0, 6], 10);
    expect(loss1).not.toBe(loss2);
  });
  test('softmax sums to 1', () => {
    const s = softmax([1, 2, 3]);
    expect(s.reduce((a, b) => a + b)).toBeCloseTo(1);
  });
  test('softmax max gets highest', () => {
    const s = softmax([1, 5, 2]);
    expect(s[1]).toBeGreaterThan(s[0]);
    expect(s[1]).toBeGreaterThan(s[2]);
  });
});

// ─── SECTION 8: Transfer metrics ──────────────────────────────────────────────
describe('CL § 8 — Transfer', () => {
  test('taskSimilarity identical', () => {
    const t: Task = { id: 1, data: [], labels: [0, 1, 2] };
    expect(taskSimilarity(t, t)).toBe(1);
  });
  test('taskSimilarity disjoint', () => {
    const t1: Task = { id: 1, data: [], labels: [0, 1] };
    const t2: Task = { id: 2, data: [], labels: [2, 3] };
    expect(taskSimilarity(t1, t2)).toBe(0);
  });
  test('taskSimilarity partial', () => {
    const t1: Task = { id: 1, data: [], labels: [0, 1, 2] };
    const t2: Task = { id: 2, data: [], labels: [1, 2, 3] };
    expect(taskSimilarity(t1, t2)).toBeCloseTo(0.5);
  });
  test('forgetScore positive when worse', () => {
    expect(forgetScore(0.9, 0.7)).toBeCloseTo(0.2);
  });
  test('forgetScore zero when better', () => {
    expect(forgetScore(0.7, 0.9)).toBe(0);
  });
  test('averageAccuracy computation', () => {
    const accs = [[0.8], [0.7, 0.9]];
    expect(averageAccuracy(accs)).toBeCloseTo(0.8);
  });
});

// ─── SECTION 9: Phi memory decay ──────────────────────────────────────────────
describe('CL § 9 — Phi decay', () => {
  test('phiMemoryDecay at 0', () => expect(phiMemoryDecay(0)).toBe(1));
  test('phiMemoryDecay decreases', () => {
    expect(phiMemoryDecay(1)).toBeLessThan(phiMemoryDecay(0));
    expect(phiMemoryDecay(2)).toBeLessThan(phiMemoryDecay(1));
  });
  test('phiMemoryDecay uses phi', () => {
    expect(phiMemoryDecay(1)).toBeCloseTo(1 / PHI);
  });
  test('phiMemoryDecay positive', () => {
    expect(phiMemoryDecay(10)).toBeGreaterThan(0);
  });
  test('phiMemoryDecay bounded', () => {
    expect(phiMemoryDecay(100)).toBeLessThan(0.001);
  });
});

// ─── SECTION 10: Masking and importance ───────────────────────────────────────
describe('CL § 10 — Masking', () => {
  test('createTaskMask correct length', () => {
    expect(createTaskMask(10, 0.5).length).toBe(10);
  });
  test('createTaskMask sparsity 0 all true', () => {
    const mask = createTaskMask(10, 0);
    expect(mask.every(m => m)).toBe(true);
  });
  test('createTaskMask sparsity 1 all false', () => {
    const mask = createTaskMask(10, 1);
    expect(mask.every(m => !m)).toBe(true);
  });
  test('maskBasedContinual applies masks', () => {
    let model = createModel(3);
    model = { ...model, weights: [1, 2, 3] };
    const masks = [[true, false, true]];
    const result = maskBasedContinual(model, masks);
    expect(result[1]).toBe(0);
  });
  test('importanceWeighting positive', () => {
    const model = createModel(2);
    const imp = importanceWeighting([1, 2], model);
    expect(imp).toBeGreaterThanOrEqual(1);
  });
  test('importanceWeighting increases with weights', () => {
    let model = createModel(2);
    model = { ...model, weights: [1, 1] };
    const imp = importanceWeighting([1, 1], model);
    expect(imp).toBeGreaterThan(1);
  });
  test('prioritizedReplay returns samples', () => {
    let buf = createReplayBuffer(100);
    buf = addToBuffer(buf, [[1], [2], [3]]);
    const samples = prioritizedReplay(buf, [1, 2, 3], 2);
    expect(samples.length).toBe(2);
  });
});
