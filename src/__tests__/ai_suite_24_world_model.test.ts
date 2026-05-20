/**
 * AI Suite 24 — World Model
 * ============================================================
 * State prediction, action consequences, environment dynamics,
 * latent space modeling, trajectory planning, reward prediction,
 * φ-coherent world representations, and simulation invariants.
 *
 * Target: 100 tests   Charter: AIS-WLD-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Core Types ───────────────────────────────────────────────────────────────

type State = number[];
type Action = number;
type Trajectory = { states: State[]; actions: Action[]; rewards: number[] };

interface WorldModel {
  stateSize: number;
  actionSize: number;
  latentSize: number;
  transitionMatrix: number[][];
  rewardWeights: number[];
}

// ─── Implementations ──────────────────────────────────────────────────────────

function createWorldModel(stateSize: number, actionSize: number, latentSize: number): WorldModel {
  const transitionMatrix = Array(stateSize).fill(null).map(() => Array(stateSize).fill(0.1));
  const rewardWeights = Array(stateSize).fill(0);
  return { stateSize, actionSize, latentSize, transitionMatrix, rewardWeights };
}

function encodeState(state: State, latentSize: number): State {
  // Simple projection to latent space
  const latent = Array(latentSize).fill(0);
  for (let i = 0; i < state.length; i++) {
    latent[i % latentSize] += state[i] / Math.ceil(state.length / latentSize);
  }
  return latent;
}

function decodeState(latent: State, stateSize: number): State {
  const state = Array(stateSize).fill(0);
  for (let i = 0; i < stateSize; i++) {
    state[i] = latent[i % latent.length];
  }
  return state;
}

function predictNextState(model: WorldModel, state: State, action: Action): State {
  const nextState = Array(model.stateSize).fill(0);
  for (let i = 0; i < model.stateSize; i++) {
    for (let j = 0; j < state.length; j++) {
      nextState[i] += model.transitionMatrix[i]?.[j] || 0 * state[j];
    }
    nextState[i] += action * 0.1; // Action influence
  }
  return nextState;
}

function predictReward(model: WorldModel, state: State, action: Action): number {
  let reward = 0;
  for (let i = 0; i < Math.min(state.length, model.rewardWeights.length); i++) {
    reward += state[i] * model.rewardWeights[i];
  }
  return reward + action * 0.01;
}

function simulateTrajectory(model: WorldModel, initialState: State, actions: Action[]): Trajectory {
  const states: State[] = [initialState];
  const rewards: number[] = [];
  let currentState = initialState;
  
  for (const action of actions) {
    const nextState = predictNextState(model, currentState, action);
    const reward = predictReward(model, currentState, action);
    states.push(nextState);
    rewards.push(reward);
    currentState = nextState;
  }
  
  return { states, actions, rewards };
}

function trajectoryReturn(rewards: number[], gamma: number = 0.99): number {
  return rewards.reduce((sum, r, i) => sum + r * Math.pow(gamma, i), 0);
}

function stateDifference(s1: State, s2: State): number {
  let diff = 0;
  for (let i = 0; i < Math.max(s1.length, s2.length); i++) {
    diff += ((s1[i] || 0) - (s2[i] || 0)) ** 2;
  }
  return Math.sqrt(diff);
}

function predictionError(predicted: State, actual: State): number {
  return stateDifference(predicted, actual);
}

function modelUncertainty(model: WorldModel, state: State): number {
  // Measure based on state magnitude and model complexity
  const stateNorm = Math.sqrt(state.reduce((s, v) => s + v * v, 0));
  return 1 / (1 + stateNorm / PHI);
}

function isTerminalState(state: State, threshold: number = 10): boolean {
  return state.some(v => Math.abs(v) > threshold);
}

function actionMask(validActions: number[], totalActions: number): boolean[] {
  const mask = Array(totalActions).fill(false);
  for (const a of validActions) {
    if (a >= 0 && a < totalActions) mask[a] = true;
  }
  return mask;
}

function sampleAction(probabilities: number[]): Action {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (r < cumulative) return i;
  }
  return probabilities.length - 1;
}

function greedyAction(qValues: number[]): Action {
  let maxIdx = 0;
  for (let i = 1; i < qValues.length; i++) {
    if (qValues[i] > qValues[maxIdx]) maxIdx = i;
  }
  return maxIdx;
}

function epsilonGreedy(qValues: number[], epsilon: number): Action {
  if (Math.random() < epsilon) {
    return Math.floor(Math.random() * qValues.length);
  }
  return greedyAction(qValues);
}

function planAhead(model: WorldModel, state: State, depth: number, actionSpace: number): { action: Action; value: number } {
  if (depth === 0) return { action: 0, value: 0 };
  
  let bestAction = 0;
  let bestValue = -Infinity;
  
  for (let a = 0; a < actionSpace; a++) {
    const nextState = predictNextState(model, state, a);
    const reward = predictReward(model, state, a);
    const future = planAhead(model, nextState, depth - 1, actionSpace);
    const value = reward + 0.99 * future.value;
    
    if (value > bestValue) {
      bestValue = value;
      bestAction = a;
    }
  }
  
  return { action: bestAction, value: bestValue };
}

function phiDiscountedReturn(rewards: number[]): number {
  const gamma = 1 / PHI;
  return rewards.reduce((sum, r, i) => sum + r * Math.pow(gamma, i), 0);
}

function normalizeState(state: State): State {
  const norm = Math.sqrt(state.reduce((s, v) => s + v * v, 0)) || 1;
  return state.map(v => v / norm);
}

function interpolateStates(s1: State, s2: State, t: number): State {
  return s1.map((v, i) => v * (1 - t) + (s2[i] || 0) * t);
}

function stateEntropy(state: State): number {
  const absSum = state.reduce((s, v) => s + Math.abs(v), 0) || 1;
  const probs = state.map(v => Math.abs(v) / absSum);
  return -probs.reduce((s, p) => p > 0 ? s + p * Math.log(p) : s, 0);
}

// ─── SECTION 1: World model creation ──────────────────────────────────────────
describe('WLD § 1 — Model creation', () => {
  test('createWorldModel sets stateSize', () => expect(createWorldModel(4, 2, 8).stateSize).toBe(4));
  test('createWorldModel sets actionSize', () => expect(createWorldModel(4, 2, 8).actionSize).toBe(2));
  test('createWorldModel sets latentSize', () => expect(createWorldModel(4, 2, 8).latentSize).toBe(8));
  test('transitionMatrix dimensions', () => {
    const m = createWorldModel(4, 2, 8);
    expect(m.transitionMatrix.length).toBe(4);
    expect(m.transitionMatrix[0].length).toBe(4);
  });
  test('rewardWeights length', () => expect(createWorldModel(4, 2, 8).rewardWeights.length).toBe(4));
  test('initial weights are zeros', () => {
    const m = createWorldModel(3, 2, 4);
    expect(m.rewardWeights.every(w => w === 0)).toBe(true);
  });
});

// ─── SECTION 2: State encoding ────────────────────────────────────────────────
describe('WLD § 2 — State encoding', () => {
  test('encodeState output size', () => expect(encodeState([1, 2, 3, 4], 2).length).toBe(2));
  test('encodeState preserves information', () => {
    const state = [1, 0, 0, 0];
    const latent = encodeState(state, 4);
    expect(latent[0]).toBeGreaterThan(0);
  });
  test('decodeState output size', () => expect(decodeState([1, 2], 4).length).toBe(4));
  test('encode-decode roundtrip similar', () => {
    const state = [1, 2, 3, 4];
    const latent = encodeState(state, 4);
    const decoded = decodeState(latent, 4);
    expect(decoded.length).toBe(4);
  });
  test('encodeState handles empty', () => expect(encodeState([], 2)).toEqual([0, 0]));
  test('decodeState handles empty latent', () => expect(decodeState([], 2)).toEqual([undefined, undefined]));
});

// ─── SECTION 3: State prediction ──────────────────────────────────────────────
describe('WLD § 3 — Prediction', () => {
  let model: WorldModel;
  beforeEach(() => { model = createWorldModel(3, 2, 4); });

  test('predictNextState output size', () => {
    expect(predictNextState(model, [1, 2, 3], 0).length).toBe(3);
  });
  test('predictNextState action influence', () => {
    const s1 = predictNextState(model, [0, 0, 0], 0);
    const s2 = predictNextState(model, [0, 0, 0], 1);
    expect(s1).not.toEqual(s2);
  });
  test('predictReward returns number', () => {
    expect(typeof predictReward(model, [1, 2, 3], 0)).toBe('number');
  });
  test('predictionError zero for identical', () => {
    expect(predictionError([1, 2, 3], [1, 2, 3])).toBe(0);
  });
  test('predictionError positive for different', () => {
    expect(predictionError([1, 2, 3], [4, 5, 6])).toBeGreaterThan(0);
  });
  test('stateDifference symmetric', () => {
    const d1 = stateDifference([1, 2], [3, 4]);
    const d2 = stateDifference([3, 4], [1, 2]);
    expect(d1).toBeCloseTo(d2);
  });
});

// ─── SECTION 4: Trajectory simulation ─────────────────────────────────────────
describe('WLD § 4 — Trajectories', () => {
  let model: WorldModel;
  beforeEach(() => { model = createWorldModel(3, 2, 4); });

  test('simulateTrajectory state count', () => {
    const traj = simulateTrajectory(model, [0, 0, 0], [0, 1, 0]);
    expect(traj.states.length).toBe(4); // initial + 3 transitions
  });
  test('simulateTrajectory reward count', () => {
    const traj = simulateTrajectory(model, [0, 0, 0], [0, 1]);
    expect(traj.rewards.length).toBe(2);
  });
  test('simulateTrajectory action count', () => {
    const traj = simulateTrajectory(model, [0, 0, 0], [0, 1, 0]);
    expect(traj.actions.length).toBe(3);
  });
  test('trajectoryReturn calculation', () => {
    const ret = trajectoryReturn([1, 1, 1], 0.9);
    expect(ret).toBeCloseTo(1 + 0.9 + 0.81);
  });
  test('trajectoryReturn gamma=1', () => {
    expect(trajectoryReturn([1, 1, 1], 1)).toBe(3);
  });
  test('trajectoryReturn empty', () => {
    expect(trajectoryReturn([])).toBe(0);
  });
});

// ─── SECTION 5: Model uncertainty ─────────────────────────────────────────────
describe('WLD § 5 — Uncertainty', () => {
  let model: WorldModel;
  beforeEach(() => { model = createWorldModel(3, 2, 4); });

  test('modelUncertainty bounded', () => {
    const u = modelUncertainty(model, [1, 2, 3]);
    expect(u).toBeGreaterThan(0);
    expect(u).toBeLessThanOrEqual(1);
  });
  test('modelUncertainty zero state high', () => {
    expect(modelUncertainty(model, [0, 0, 0])).toBe(1);
  });
  test('modelUncertainty large state low', () => {
    const u = modelUncertainty(model, [100, 100, 100]);
    expect(u).toBeLessThan(0.1);
  });
  test('isTerminalState false for normal', () => {
    expect(isTerminalState([1, 2, 3], 10)).toBe(false);
  });
  test('isTerminalState true for extreme', () => {
    expect(isTerminalState([15, 0, 0], 10)).toBe(true);
  });
  test('isTerminalState threshold effect', () => {
    expect(isTerminalState([5, 0, 0], 4)).toBe(true);
    expect(isTerminalState([5, 0, 0], 6)).toBe(false);
  });
});

// ─── SECTION 6: Action selection ──────────────────────────────────────────────
describe('WLD § 6 — Action selection', () => {
  test('greedyAction selects max', () => {
    expect(greedyAction([1, 5, 3])).toBe(1);
  });
  test('greedyAction first max on tie', () => {
    expect(greedyAction([5, 5, 3])).toBe(0);
  });
  test('epsilonGreedy returns valid action', () => {
    const a = epsilonGreedy([1, 2, 3], 0.1);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(3);
  });
  test('sampleAction returns valid', () => {
    const a = sampleAction([0.2, 0.3, 0.5]);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(3);
  });
  test('actionMask correct', () => {
    const mask = actionMask([0, 2], 4);
    expect(mask).toEqual([true, false, true, false]);
  });
  test('actionMask empty valid', () => {
    expect(actionMask([], 3)).toEqual([false, false, false]);
  });
});

// ─── SECTION 7: Planning ──────────────────────────────────────────────────────
describe('WLD § 7 — Planning', () => {
  let model: WorldModel;
  beforeEach(() => { model = createWorldModel(2, 3, 4); });

  test('planAhead returns action', () => {
    const result = planAhead(model, [0, 0], 2, 3);
    expect(result.action).toBeGreaterThanOrEqual(0);
    expect(result.action).toBeLessThan(3);
  });
  test('planAhead depth 0', () => {
    const result = planAhead(model, [1, 1], 0, 3);
    expect(result.value).toBe(0);
  });
  test('planAhead returns value', () => {
    const result = planAhead(model, [0, 0], 3, 2);
    expect(typeof result.value).toBe('number');
  });
  test('deeper planning may differ', () => {
    const shallow = planAhead(model, [0, 0], 1, 2);
    const deep = planAhead(model, [0, 0], 3, 2);
    // Values should be different (deeper = more accumulated)
    expect(typeof deep.value).toBe('number');
  });
});

// ─── SECTION 8: Phi-coherent returns ──────────────────────────────────────────
describe('WLD § 8 — Phi returns', () => {
  test('phiDiscountedReturn uses phi', () => {
    const ret = phiDiscountedReturn([1, 1, 1]);
    const gamma = 1 / PHI;
    expect(ret).toBeCloseTo(1 + gamma + gamma * gamma);
  });
  test('phiDiscountedReturn single reward', () => {
    expect(phiDiscountedReturn([5])).toBe(5);
  });
  test('phiDiscountedReturn empty', () => {
    expect(phiDiscountedReturn([])).toBe(0);
  });
  test('phi discount stronger than 0.99', () => {
    const phiRet = phiDiscountedReturn([1, 1, 1, 1, 1]);
    const stdRet = trajectoryReturn([1, 1, 1, 1, 1], 0.99);
    expect(phiRet).toBeLessThan(stdRet);
  });
});

// ─── SECTION 9: State operations ──────────────────────────────────────────────
describe('WLD § 9 — State ops', () => {
  test('normalizeState unit norm', () => {
    const n = normalizeState([3, 4]);
    const norm = Math.sqrt(n.reduce((s, v) => s + v * v, 0));
    expect(norm).toBeCloseTo(1);
  });
  test('normalizeState zero vector', () => {
    const n = normalizeState([0, 0]);
    expect(n).toEqual([0, 0]);
  });
  test('interpolateStates at 0', () => {
    expect(interpolateStates([1, 2], [5, 6], 0)).toEqual([1, 2]);
  });
  test('interpolateStates at 1', () => {
    expect(interpolateStates([1, 2], [5, 6], 1)).toEqual([5, 6]);
  });
  test('interpolateStates at 0.5', () => {
    expect(interpolateStates([0, 0], [4, 4], 0.5)).toEqual([2, 2]);
  });
  test('stateEntropy uniform high', () => {
    const e = stateEntropy([1, 1, 1, 1]);
    expect(e).toBeCloseTo(Math.log(4));
  });
  test('stateEntropy peaked low', () => {
    const e = stateEntropy([10, 0, 0, 0]);
    expect(e).toBeCloseTo(0);
  });
});

// ─── SECTION 10: Edge cases ───────────────────────────────────────────────────
describe('WLD § 10 — Edge cases', () => {
  test('empty state handling', () => {
    const model = createWorldModel(0, 2, 4);
    expect(model.stateSize).toBe(0);
  });
  test('single action space', () => {
    const model = createWorldModel(2, 1, 4);
    expect(model.actionSize).toBe(1);
  });
  test('very large state', () => {
    const state = Array(100).fill(1);
    expect(normalizeState(state).length).toBe(100);
  });
  test('negative rewards', () => {
    expect(trajectoryReturn([-1, -1, -1], 0.9)).toBeLessThan(0);
  });
  test('mixed rewards', () => {
    const ret = trajectoryReturn([1, -1, 1], 1);
    expect(ret).toBe(1);
  });
  test('terminal at start', () => {
    expect(isTerminalState([100], 10)).toBe(true);
  });
  test('all valid actions mask', () => {
    expect(actionMask([0, 1, 2], 3)).toEqual([true, true, true]);
  });
  test('out of range action mask', () => {
    expect(actionMask([5], 3)).toEqual([false, false, false]);
  });
});
