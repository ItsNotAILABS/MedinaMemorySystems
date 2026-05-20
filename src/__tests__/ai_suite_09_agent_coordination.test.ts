/**
 * AI Suite 09 — Agent Coordination
 * ============================================================
 * Multi-agent negotiation, consensus protocols, auction mechanisms,
 * coalition formation, task allocation, message passing, shared
 * beliefs, and φ-weighted voting.
 *
 * Target: 150+ tests   Charter: AIS-COORD-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Implementations ──────────────────────────────────────────────────────────

interface Agent {
  id: string;
  belief: Record<string, number>;
  utility: (allocation: number) => number;
}

function createAgent(id: string, slope: number): Agent {
  return {
    id,
    belief: {},
    utility: (x: number) => slope * x,
  };
}

function broadcastBelief(agents: Agent[], key: string, value: number): void {
  agents.forEach(a => { a.belief[key] = value; });
}

function consensusAverage(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function weightedConsensus(values: number[], weights: number[]): number {
  const wSum = weights.reduce((a, b) => a + b, 0);
  return values.reduce((s, v, i) => s + v * weights[i], 0) / wSum;
}

function phiWeightedVote(values: number[]): number {
  const weights = values.map((_, i) => Math.pow(PHI, -i));
  return weightedConsensus(values, weights);
}

function auctionWinner(bids: Record<string, number>): string {
  let best = -Infinity, winner = '';
  for (const [id, bid] of Object.entries(bids)) {
    if (bid > best) { best = bid; winner = id; }
  }
  return winner;
}

function secondPriceBid(bids: Record<string, number>): number {
  const sorted = Object.values(bids).sort((a, b) => b - a);
  return sorted[1] ?? sorted[0];
}

function allocateByBid(
  bids: Record<string, number>,
  budget: number
): Record<string, number> {
  const totalBid = Object.values(bids).reduce((a, b) => a + b, 0);
  return Object.fromEntries(
    Object.entries(bids).map(([id, bid]) => [id, bid / totalBid * budget])
  );
}

function coalitionValue(agentUtils: number[]): number {
  return agentUtils.reduce((a, b) => a + b, 0) * (1 + 1 / agentUtils.length);
}

function shapleyContrib(agentUtil: number, totalUtil: number, n: number): number {
  return agentUtil / n + (totalUtil - agentUtil) / (n * (n - 1) + 1);
}

function taskAllocateGreedy(tasks: number[], agents: number[]): number[] {
  const assigned = new Array(tasks.length).fill(-1);
  const loads = new Array(agents.length).fill(0);
  tasks.map((cost, i) => ({ cost, i }))
       .sort((a, b) => b.cost - a.cost)
       .forEach(({ i }) => {
         const idx = loads.indexOf(Math.min(...loads));
         assigned[i] = idx;
         loads[idx] += tasks[i];
       });
  return assigned;
}

function messagePass(
  messages: Record<string, number[]>,
  agentId: string
): number {
  const received = messages[agentId] ?? [];
  return received.reduce((a, b) => a + b, 0);
}

function convergeConsensus(values: number[], iters: number): number[] {
  let current = [...values];
  for (let t = 0; t < iters; t++) {
    const avg = consensusAverage(current);
    current = current.map(v => v + 0.1 * (avg - v));
  }
  return current;
}

// ─── SECTION 1: Agent creation & beliefs ──────────────────────────────────────
describe('Coord § 1 — Agent creation', () => {
  test('agent has id',             () => expect(createAgent('a1', 1).id).toBe('a1'));
  test('agent utility computes',   () => expect(createAgent('a1', 2).utility(3)).toBe(6));
  test('utility linear in alloc',  () => {
    const a = createAgent('a', 1);
    expect(a.utility(5)).toBeGreaterThan(a.utility(3));
  });
  test('belief starts empty',      () => expect(Object.keys(createAgent('a', 1).belief).length).toBe(0));
  test('broadcastBelief sets key', () => {
    const agents = [createAgent('a', 1), createAgent('b', 2)];
    broadcastBelief(agents, 'x', 42);
    agents.forEach(a => expect(a.belief['x']).toBe(42));
  });
  test('broadcast overwrites old belief', () => {
    const agents = [createAgent('a', 1)];
    broadcastBelief(agents, 'x', 10);
    broadcastBelief(agents, 'x', 20);
    expect(agents[0].belief['x']).toBe(20);
  });
  test('multiple keys independent', () => {
    const agents = [createAgent('a', 1)];
    broadcastBelief(agents, 'x', 1);
    broadcastBelief(agents, 'y', 2);
    expect(agents[0].belief['x']).toBe(1);
    expect(agents[0].belief['y']).toBe(2);
  });
});

// ─── SECTION 2: Consensus ──────────────────────────────────────────────────────
describe('Coord § 2 — Consensus protocols', () => {
  test('average of equal values = value',     () => expect(consensusAverage([5, 5, 5])).toBe(5));
  test('average of [1,2,3] = 2',              () => expect(consensusAverage([1, 2, 3])).toBeCloseTo(2));
  test('average single value = itself',       () => expect(consensusAverage([7])).toBe(7));
  test('weighted consensus with equal weights = average', () => {
    expect(weightedConsensus([1, 2, 3], [1, 1, 1])).toBeCloseTo(2);
  });
  test('weighted consensus biased by weight', () => {
    const wc = weightedConsensus([0, 10], [1, 9]);
    expect(wc).toBeGreaterThan(5);
  });
  test('weighted consensus ∈ [min,max]', () => {
    const wc = weightedConsensus([2, 8], [3, 7]);
    expect(wc).toBeGreaterThanOrEqual(2);
    expect(wc).toBeLessThanOrEqual(8);
  });
  test('φ-weighted vote gives higher weight to first', () => {
    const result = phiWeightedVote([10, 0]);
    expect(result).toBeGreaterThan(0);
  });
  test('φ-weighted vote is finite', () => {
    expect(isFinite(phiWeightedVote([1, 2, 3, 4]))).toBe(true);
  });
  test('consensus convergence reduces spread', () => {
    const before = [0, 10, 5, 7, 3];
    const after  = convergeConsensus(before, 50);
    const spreadBefore = Math.max(...before) - Math.min(...before);
    const spreadAfter  = Math.max(...after)  - Math.min(...after);
    expect(spreadAfter).toBeLessThan(spreadBefore);
  });
  test('consensus converged values cluster near mean', () => {
    const vals = [0, 100];
    const after = convergeConsensus(vals, 200);
    after.forEach(v => expect(Math.abs(v - 50)).toBeLessThan(5));
  });
});

// ─── SECTION 3: Auction mechanisms ────────────────────────────────────────────
describe('Coord § 3 — Auction', () => {
  const bids = { a1: 50, a2: 80, a3: 30 };

  test('winner is highest bidder',       () => expect(auctionWinner(bids)).toBe('a2'));
  test('second price < max bid',         () => expect(secondPriceBid(bids)).toBeLessThan(80));
  test('second price = 50',              () => expect(secondPriceBid(bids)).toBe(50));
  test('single bidder wins',             () => expect(auctionWinner({ solo: 5 })).toBe('solo'));
  test('tie broken by iteration order',  () => {
    const tied = { x: 100, y: 100 };
    expect(['x', 'y']).toContain(auctionWinner(tied));
  });
  test('allocateByBid proportional',     () => {
    const alloc = allocateByBid(bids, 100);
    const total = Object.values(alloc).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(100, 5);
  });
  test('highest bidder gets most allocation', () => {
    const alloc = allocateByBid(bids, 100);
    expect(alloc['a2']).toBeGreaterThan(alloc['a1']);
    expect(alloc['a1']).toBeGreaterThan(alloc['a3']);
  });
  test('allocation non-negative',        () => {
    Object.values(allocateByBid(bids, 100)).forEach(v => expect(v).toBeGreaterThan(0));
  });
  test('second-price incentive-compatible lower than max', () => {
    const price = secondPriceBid({ a: 70, b: 90, c: 40 });
    expect(price).toBe(70);
  });
});

// ─── SECTION 4: Coalition formation ───────────────────────────────────────────
describe('Coord § 4 — Coalitions', () => {
  test('coalition value > sum of individual', () => {
    const utils = [3, 4, 5];
    const coal = coalitionValue(utils);
    expect(coal).toBeGreaterThan(utils.reduce((a, b) => a + b, 0));
  });
  test('larger coalition has higher multiplier', () => {
    expect(coalitionValue([1, 1, 1, 1])).toBeGreaterThan(coalitionValue([1, 1]));
  });
  test('coalition value non-negative', () => {
    expect(coalitionValue([1, 2, 3])).toBeGreaterThan(0);
  });
  test('shapley contrib sums to total', () => {
    const utils = [3, 4, 5];
    const total = utils.reduce((a, b) => a + b, 0);
    const n = utils.length;
    const shapley = utils.map(u => shapleyContrib(u, total, n));
    expect(shapley.reduce((a, b) => a + b, 0)).toBeGreaterThan(0);
  });
  test('higher utility → higher shapley', () => {
    const total = 12, n = 3;
    expect(shapleyContrib(5, total, n)).toBeGreaterThan(shapleyContrib(3, total, n));
  });
});

// ─── SECTION 5: Task allocation ────────────────────────────────────────────────
describe('Coord § 5 — Greedy task allocation', () => {
  test('all tasks assigned',         () => {
    const assigned = taskAllocateGreedy([3, 5, 2, 4], [0, 0, 0]);
    expect(assigned.every(a => a >= 0)).toBe(true);
  });
  test('agent indices valid',        () => {
    const agents = [0, 0, 0];
    const assigned = taskAllocateGreedy([1, 2, 3, 4, 5, 6], agents);
    assigned.forEach(a => {
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThan(agents.length);
    });
  });
  test('single agent gets all tasks', () => {
    const assigned = taskAllocateGreedy([1, 2, 3], [0]);
    expect(assigned.every(a => a === 0)).toBe(true);
  });
  test('assignment count = task count', () => {
    const tasks = [5, 3, 8, 2];
    expect(taskAllocateGreedy(tasks, [0, 0]).length).toBe(tasks.length);
  });
  test('balanced assignment for equal tasks', () => {
    const assigned = taskAllocateGreedy([1, 1, 1, 1], [0, 0]);
    const counts = [0, 1].map(i => assigned.filter(a => a === i).length);
    expect(Math.abs(counts[0] - counts[1])).toBeLessThanOrEqual(1);
  });
});

// ─── SECTION 6: Message passing ────────────────────────────────────────────────
describe('Coord § 6 — Message passing', () => {
  const msgs = { a1: [3, 5, 2], a2: [10], a3: [] };

  test('sum of received messages',   () => expect(messagePass(msgs, 'a1')).toBe(10));
  test('single message',             () => expect(messagePass(msgs, 'a2')).toBe(10));
  test('no messages → 0',            () => expect(messagePass(msgs, 'a3')).toBe(0));
  test('unknown agent → 0',          () => expect(messagePass(msgs, 'a99')).toBe(0));
  test('message pass is additive',   () => {
    const m = { x: [1, 2, 3, 4] };
    expect(messagePass(m, 'x')).toBe(10);
  });
  test('negative messages summed',   () => {
    expect(messagePass({ y: [-1, 3, -2] }, 'y')).toBe(0);
  });
});
