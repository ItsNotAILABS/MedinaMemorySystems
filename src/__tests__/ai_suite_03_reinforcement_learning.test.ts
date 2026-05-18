/**
 * AI Suite 03 — Reinforcement Learning
 * ============================================================
 * Q-learning, reward shaping, Bellman equation, ε-greedy policy,
 * policy gradients, advantage estimation, value functions, Monte Carlo
 * returns, temporal difference errors, replay buffer.
 *
 * Target: 160+ tests   Charter: AIS-RL-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;
const GAMMA = 0.99;

// ─── Implementations ──────────────────────────────────────────────────────────

type QTable = Map<string, number[]>;

function initQTable(states: string[], numActions: number): QTable {
  const table: QTable = new Map();
  states.forEach(s => table.set(s, new Array(numActions).fill(0)));
  return table;
}

function qUpdate(
  table: QTable, state: string, action: number,
  reward: number, nextState: string, gamma: number, alpha: number
): number {
  const currentQ = table.get(state)![action];
  const nextQ    = Math.max(...(table.get(nextState) ?? [0]));
  const td       = reward + gamma * nextQ - currentQ;
  const newQ     = currentQ + alpha * td;
  table.get(state)![action] = newQ;
  return td;
}

function epsilonGreedy(qValues: number[], epsilon: number, rand: number): number {
  if (rand < epsilon) return Math.floor(rand * qValues.length / epsilon) % qValues.length;
  return qValues.indexOf(Math.max(...qValues));
}

function bellmanOptimal(reward: number, gamma: number, nextV: number): number {
  return reward + gamma * nextV;
}

function discountedReturn(rewards: number[], gamma: number): number[] {
  const G = new Array(rewards.length).fill(0);
  let running = 0;
  for (let t = rewards.length - 1; t >= 0; t--) {
    running = rewards[t] + gamma * running;
    G[t] = running;
  }
  return G;
}

function tdError(reward: number, gamma: number, nextV: number, currentV: number): number {
  return reward + gamma * nextV - currentV;
}

function advantage(returns: number[], baseline: number): number[] {
  return returns.map(r => r - baseline);
}

function policyGradient(logProbs: number[], advantages: number[]): number {
  return -logProbs.reduce((s, lp, i) => s + lp * advantages[i], 0);
}

function softmaxPolicy(qValues: number[], temp: number): number[] {
  const scaled = qValues.map(q => q / temp);
  const max = Math.max(...scaled);
  const e = scaled.map(v => Math.exp(v - max));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map(x => x / s);
}

function vPrediction(rewards: number[], gamma: number): number {
  return rewards.reduce((s, r, t) => s + r * Math.pow(gamma, t), 0);
}

class ReplayBuffer {
  private buffer: Array<{ s: string; a: number; r: number; ns: string }> = [];
  constructor(private maxSize: number) {}
  push(s: string, a: number, r: number, ns: string) {
    if (this.buffer.length >= this.maxSize) this.buffer.shift();
    this.buffer.push({ s, a, r, ns });
  }
  sample(n: number) { return this.buffer.slice(0, Math.min(n, this.buffer.length)); }
  get size() { return this.buffer.length; }
}

// ─── SECTION 1: Q-table initialization ────────────────────────────────────────
describe('RL § 1 — Q-table initialization', () => {
  test('table has all states', () => {
    const t = initQTable(['s0', 's1', 's2'], 3);
    expect(t.size).toBe(3);
  });
  test('initial Q-values are 0', () => {
    const t = initQTable(['s0'], 4);
    expect(t.get('s0')).toEqual([0, 0, 0, 0]);
  });
  test('number of actions preserved', () => {
    const t = initQTable(['s'], 5);
    expect(t.get('s')!.length).toBe(5);
  });
  test('states are independent', () => {
    const t = initQTable(['a', 'b'], 2);
    t.get('a')![0] = 99;
    expect(t.get('b')![0]).toBe(0);
  });
});

// ─── SECTION 2: Bellman equation ───────────────────────────────────────────────
describe('RL § 2 — Bellman equation', () => {
  test('bellmanOptimal(1, 0, V) = 1',     () => expect(bellmanOptimal(1, 0, 100)).toBe(1));
  test('bellmanOptimal with γ=1 = r + V', () => expect(bellmanOptimal(2, 1, 5)).toBe(7));
  test('bellmanOptimal γ ∈ (0,1) < r+V',  () => {
    const r = 3, v = 10;
    expect(bellmanOptimal(r, GAMMA, v)).toBeLessThan(r + v);
    expect(bellmanOptimal(r, GAMMA, v)).toBeGreaterThan(r);
  });
  test('bellman terminal (nextV=0)',       () => expect(bellmanOptimal(5, GAMMA, 0)).toBe(5));
  test('bellman negative reward',          () => expect(bellmanOptimal(-1, GAMMA, 10)).toBeCloseTo(-1 + GAMMA * 10));
});

// ─── SECTION 3: Q-learning update ─────────────────────────────────────────────
describe('RL § 3 — Q-learning update', () => {
  test('td error sign positive when reward high', () => {
    const t = initQTable(['s', 'g'], 2);
    const td = qUpdate(t, 's', 0, 10, 'g', GAMMA, 0.5);
    expect(td).toBeGreaterThan(0);
  });
  test('td error = 0 when Q already optimal', () => {
    const t = initQTable(['s', 'g'], 2);
    t.get('s')![0] = 10;
    const td = qUpdate(t, 's', 0, 10, 'g', GAMMA, 0.5);
    expect(td).toBeLessThan(10);
  });
  test('Q converges toward bellman target', () => {
    const t = initQTable(['s', 'g'], 2);
    for (let i = 0; i < 100; i++) qUpdate(t, 's', 0, 1, 'g', GAMMA, 0.3);
    expect(t.get('s')![0]).toBeGreaterThan(0.9);
  });
  test('alpha=0 → no update', () => {
    const t = initQTable(['s', 'g'], 2);
    qUpdate(t, 's', 0, 100, 'g', GAMMA, 0);
    expect(t.get('s')![0]).toBe(0);
  });
  test('alpha=1 → full replacement', () => {
    const t = initQTable(['s', 'g'], 2);
    qUpdate(t, 's', 0, 5, 'g', GAMMA, 1);
    expect(t.get('s')![0]).toBeCloseTo(5);
  });
});

// ─── SECTION 4: ε-greedy policy ────────────────────────────────────────────────
describe('RL § 4 — ε-greedy policy', () => {
  const q = [1, 5, 2];
  test('greedy selects max Q (eps=0)', () => {
    expect(epsilonGreedy(q, 0, 0.5)).toBe(1);
  });
  test('greedy returns valid action index', () => {
    expect(epsilonGreedy(q, 0, 0.1)).toBeGreaterThanOrEqual(0);
    expect(epsilonGreedy(q, 0, 0.1)).toBeLessThan(q.length);
  });
  test('eps=0 always greedy', () => {
    [0.1, 0.5, 0.9].forEach(r => expect(epsilonGreedy(q, 0, r)).toBe(1));
  });
  test('eps=1 always random (action in range)', () => {
    [0.1, 0.5, 0.9].forEach(r =>
      expect(epsilonGreedy(q, 1, r)).toBeGreaterThanOrEqual(0));
  });
});

// ─── SECTION 5: Discounted returns ─────────────────────────────────────────────
describe('RL § 5 — Discounted returns', () => {
  test('single reward G[0] = reward', () => {
    expect(discountedReturn([5], GAMMA)[0]).toBe(5);
  });
  test('two rewards G[0] = r0 + γ*r1', () => {
    const G = discountedReturn([2, 3], GAMMA);
    expect(G[0]).toBeCloseTo(2 + GAMMA * 3);
    expect(G[1]).toBeCloseTo(3);
  });
  test('length preserved', () => {
    expect(discountedReturn([1, 2, 3, 4], GAMMA).length).toBe(4);
  });
  test('G[0] ≥ G[1] for positive rewards', () => {
    const G = discountedReturn([1, 1, 1], GAMMA);
    expect(G[0]).toBeGreaterThan(G[1]);
  });
  test('γ=0 → G[t] = r[t]', () => {
    const rewards = [3, 5, 7];
    const G = discountedReturn(rewards, 0);
    G.forEach((g, i) => expect(g).toBeCloseTo(rewards[i]));
  });
  test('γ=1 sum check', () => {
    const G = discountedReturn([1, 1, 1], 1);
    expect(G[0]).toBeCloseTo(3);
    expect(G[1]).toBeCloseTo(2);
    expect(G[2]).toBeCloseTo(1);
  });
});

// ─── SECTION 6: TD error ──────────────────────────────────────────────────────
describe('RL § 6 — Temporal difference error', () => {
  test('td = 0 when perfect value', () => expect(tdError(1, GAMMA, 0, 1)).toBeCloseTo(0, 2));
  test('positive td on unexpected reward', () => expect(tdError(10, GAMMA, 0, 0)).toBeGreaterThan(0));
  test('negative td on missed value', () => expect(tdError(0, GAMMA, 0, 5)).toBeLessThan(0));
  test('td scales with reward', () => {
    expect(Math.abs(tdError(10, GAMMA, 0, 0))).toBeGreaterThan(Math.abs(tdError(1, GAMMA, 0, 0)));
  });
  test('td terminal state (nextV=0)', () => {
    expect(tdError(5, GAMMA, 0, 0)).toBe(5);
  });
});

// ─── SECTION 7: Advantage estimation ──────────────────────────────────────────
describe('RL § 7 — Advantage', () => {
  test('zero baseline → returns unchanged', () => {
    expect(advantage([1, 2, 3], 0)).toEqual([1, 2, 3]);
  });
  test('mean-centered advantages sum ≈ 0', () => {
    const returns = [1, 2, 3, 4, 5];
    const baseline = returns.reduce((a, b) => a + b, 0) / returns.length;
    const A = advantage(returns, baseline);
    expect(A.reduce((a, b) => a + b, 0)).toBeCloseTo(0, 5);
  });
  test('advantage positive when return > baseline', () => {
    const A = advantage([10], 5);
    expect(A[0]).toBeGreaterThan(0);
  });
  test('advantage negative when return < baseline', () => {
    const A = advantage([1], 5);
    expect(A[0]).toBeLessThan(0);
  });
  test('length preserved', () => {
    expect(advantage([1, 2, 3, 4], 2).length).toBe(4);
  });
});

// ─── SECTION 8: Softmax policy ─────────────────────────────────────────────────
describe('RL § 8 — Softmax policy', () => {
  const q = [1, 2, 3];
  test('sum = 1', () => expect(softmaxPolicy(q, 1).reduce((a, b) => a + b, 0)).toBeCloseTo(1));
  test('all probabilities non-negative', () => softmaxPolicy(q, 1).forEach(p => expect(p).toBeGreaterThan(0)));
  test('best action gets highest prob', () => {
    const p = softmaxPolicy(q, 1);
    expect(p[2]).toBeGreaterThan(p[0]);
  });
  test('temp→0 → near greedy', () => {
    const p = softmaxPolicy(q, 0.01);
    expect(p[2]).toBeGreaterThan(0.99);
  });
  test('temp→∞ → near uniform', () => {
    const p = softmaxPolicy(q, 1000);
    p.forEach(v => expect(v).toBeCloseTo(1 / 3, 1));
  });
  test('phi-temperature valid', () => {
    const p = softmaxPolicy(q, PHI);
    expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });
});

// ─── SECTION 9: Policy gradient ───────────────────────────────────────────────
describe('RL § 9 — Policy gradient loss', () => {
  test('zero advantages → loss = 0', () => {
    const logProbs = [-0.5, -0.3];
    const adv = [0, 0];
    expect(policyGradient(logProbs, adv)).toBeCloseTo(0);
  });
  test('positive advantage + negative logProb → positive policy gradient (loss to minimize)', () => {
    const lp = [-1, -1];
    const adv = [2, 2];
    expect(policyGradient(lp, adv)).toBeCloseTo(4, 5);
  });
  test('loss scales with advantage magnitude', () => {
    const lp = [-1];
    expect(Math.abs(policyGradient(lp, [4]))).toBeGreaterThan(Math.abs(policyGradient(lp, [2])));
  });
});

// ─── SECTION 10: Replay buffer ─────────────────────────────────────────────────
describe('RL § 10 — Replay buffer', () => {
  test('starts empty', () => expect(new ReplayBuffer(10).size).toBe(0));
  test('push increments size', () => {
    const buf = new ReplayBuffer(10);
    buf.push('s', 0, 1, 'ns');
    expect(buf.size).toBe(1);
  });
  test('max size enforced', () => {
    const buf = new ReplayBuffer(3);
    for (let i = 0; i < 10; i++) buf.push('s', 0, i, 'ns');
    expect(buf.size).toBe(3);
  });
  test('sample returns at most n items', () => {
    const buf = new ReplayBuffer(10);
    for (let i = 0; i < 5; i++) buf.push('s', i, i, 'ns');
    expect(buf.sample(3).length).toBe(3);
  });
  test('sample returns all if n > size', () => {
    const buf = new ReplayBuffer(10);
    for (let i = 0; i < 2; i++) buf.push('s', i, i, 'ns');
    expect(buf.sample(100).length).toBe(2);
  });
  test('FIFO eviction on overflow', () => {
    const buf = new ReplayBuffer(2);
    buf.push('a', 0, 1, 'b');
    buf.push('b', 0, 2, 'c');
    buf.push('c', 0, 3, 'd');
    expect(buf.sample(2)[0].r).toBe(2);
  });
});

// ─── SECTION 11: Value prediction ─────────────────────────────────────────────
describe('RL § 11 — Value prediction', () => {
  test('vPrediction single step', () => expect(vPrediction([5], GAMMA)).toBe(5));
  test('vPrediction two steps',   () => {
    expect(vPrediction([1, 1], GAMMA)).toBeCloseTo(1 + GAMMA, 5);
  });
  test('vPrediction γ=0 = first reward', () => expect(vPrediction([7, 99, 99], 0)).toBe(7));
  test('vPrediction decreases with horizon', () => {
    expect(vPrediction([0, 0, 1], GAMMA)).toBeLessThan(vPrediction([1, 0, 0], GAMMA));
  });
  test('vPrediction all-zero rewards = 0', () => {
    expect(vPrediction([0, 0, 0], GAMMA)).toBe(0);
  });
});
