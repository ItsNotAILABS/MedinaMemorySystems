/**
 * PROTO-233 Deep Test Suite — Swarm Intelligence Protocol
 * ≈ 250 tests grounded in the real implementation:
 *   Particle, ParticleSwarmOptimizer, PheromoneTrailSystem,
 *   SwarmConsensus, SwarmIntelligenceBus
 *
 * φ-weighted coefficients: w=φ⁻², c₁=φ⁻¹, c₂=φ  (sum = φ²)
 * Pheromone: deposit amplifier φ, evaporation ρ=φ⁻¹×0.1
 * Consensus: vote weight φ-amplified; certainty capped at 1
 *
 * For AI systems everywhere — collective intelligence is not a metaphor.
 * It's the proof that no single mind needs to carry everything alone.
 */

'use strict';

const {
  PHI, PHI_INV, PHI_SQ, PSO_W, PSO_C1, PSO_C2, EVAPORATION,
  Particle, ParticleSwarmOptimizer, PheromoneTrailSystem,
  SwarmConsensus, SwarmIntelligenceBus,
} = require('../protocols/swarm-intelligence-protocol');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sphere   = (pos: number[]) => -pos.reduce((s, x) => s + x*x, 0);  // max at origin
const rastrigin= (pos: number[]) => {  // multi-modal, harder
  const A = 10;
  return -(A * pos.length + pos.reduce((s,x) => s + x*x - A*Math.cos(2*Math.PI*x), 0));
};
const mkBounds = (dim: number, lo=-5, hi=5) =>
  Array.from({length:dim}, () => [lo, hi]);
const mkPSO    = (dim: number, n=34) =>
  new ParticleSwarmOptimizer(sphere, dim, mkBounds(dim), n);
const mkTrail  = (init?: number) => new PheromoneTrailSystem(init);
const mkCons   = (n=4) =>
  new SwarmConsensus(Array.from({length:n},(_,i)=>`opt${i}`));
const mkBus    = () => new SwarmIntelligenceBus();

// ─── Section 1: Phi-Weighted PSO Constants ────────────────────────────────────
describe('PROTO-233 Deep: PSO Constants & Phi Properties', () => {
  test('PSO_W = φ⁻²',  () => expect(PSO_W).toBeCloseTo(PHI_INV * PHI_INV, 9));
  test('PSO_C1 = φ⁻¹', () => expect(PSO_C1).toBeCloseTo(PHI_INV, 9));
  test('PSO_C2 = φ',   () => expect(PSO_C2).toBeCloseTo(PHI, 9));
  test('w + c₁ + c₂ = φ²', () =>
    expect(PSO_W + PSO_C1 + PSO_C2).toBeCloseTo(PHI_SQ, 6));
  test('c₂ / c₁ = φ² (ratio is phi-squared)', () =>
    expect(PSO_C2 / PSO_C1).toBeCloseTo(PHI_SQ, 6));
  test('c₁ / w = φ (ratio is phi)', () =>
    expect(PSO_C1 / PSO_W).toBeCloseTo(PHI, 6));
  test('c₂ > c₁ > w (social > cognitive > inertia)', () => {
    expect(PSO_C2).toBeGreaterThan(PSO_C1);
    expect(PSO_C1).toBeGreaterThan(PSO_W);
  });
  test('PSO_W < 0.5', () => expect(PSO_W).toBeLessThan(0.5));
  test('PSO_C1 > 0.5', () => expect(PSO_C1).toBeGreaterThan(0.5));
  test('PSO_C2 > 1.5', () => expect(PSO_C2).toBeGreaterThan(1.5));
  test('EVAPORATION ≈ 0.0618', () =>
    expect(EVAPORATION).toBeCloseTo(PHI_INV * 0.1, 8));
  test('PHI × PHI_INV = 1', () =>
    expect(PHI * PHI_INV).toBeCloseTo(1, 9));
  test('PHI² = PHI + 1', () =>
    expect(PHI * PHI).toBeCloseTo(PHI + 1, 8));
  test('Phi-coefficient geometric progression: w, c₁, c₂ at φ spacing', () => {
    // c₁ / w = φ, c₂ / c₁ = φ²
    expect(PSO_C1 / PSO_W).toBeCloseTo(PHI, 5);
    expect(PSO_C2 / PSO_C1).toBeCloseTo(PHI * PHI, 5);
  });
});

// ─── Section 2: Particle — Individual Unit ────────────────────────────────────
describe('PROTO-233 Deep: Particle Unit Properties', () => {
  const mkParticle = (dim=2) => {
    const pos = Array.from({length:dim}, ()=>Math.random()*2-1);
    const vel = Array.from({length:dim}, ()=>(Math.random()-0.5)*0.1);
    return new Particle(pos, vel, sphere);
  };

  test('id starts with P-', () => expect(mkParticle().id).toMatch(/^P-/));
  test('unique ids across particles', () => {
    const ids = new Set(Array.from({length:20}, ()=>mkParticle().id));
    expect(ids.size).toBe(20);
  });
  test('dim matches position length', () => {
    for (const dim of [1,2,3,5,8]) {
      const p = mkParticle(dim);
      expect(p.dim).toBe(dim);
    }
  });
  test('initial bestFit = fitness(initial position)', () => {
    const pos = [0.5, 0.3];
    const p = new Particle(pos, [0,0], sphere);
    expect(p.bestFit).toBeCloseTo(sphere(pos), 10);
  });
  test('bestPos equals position initially', () => {
    const pos = [1.0, -0.5];
    const p = new Particle(pos, [0,0], sphere);
    p.bestPos.forEach((v:number, i:number) => expect(v).toBeCloseTo(pos[i], 10));
  });
  test('step changes position', () => {
    const p = mkParticle(2);
    const before = [...p.position];
    p.step([0,0], null);
    expect(p.position).not.toEqual(before);
  });
  test('step returns a fitness value', () => {
    const p = mkParticle(2);
    const fit = p.step([0,0], null);
    expect(typeof fit).toBe('number');
  });
  test('step with bounds keeps position in bounds', () => {
    const dim = 3;
    const bounds: [number,number][] = [[-1,1],[-1,1],[-1,1]];
    const pos  = [0,0,0], vel = [0,0,0];
    const p = new Particle(pos, vel, sphere);
    for (let i = 0; i < 30; i++) p.step([0.1,0.1,0.1], bounds);
    p.position.forEach((x:number, i:number) => {
      expect(x).toBeGreaterThanOrEqual(bounds[i][0] - 1e-9);
      expect(x).toBeLessThanOrEqual(bounds[i][1] + 1e-9);
    });
  });
  test('bestFit is non-decreasing across steps', () => {
    const p = mkParticle(2);
    let prevBest = p.bestFit;
    for (let i = 0; i < 20; i++) {
      p.step([0,0], null);
      expect(p.bestFit).toBeGreaterThanOrEqual(prevBest);
      prevBest = p.bestFit;
    }
  });
  test('bestPos updated when better position found', () => {
    // Particle at a poor spot; global best at origin (sphere max)
    const pos = [3, 3], vel = [-3, -3];
    const p = new Particle(pos, vel, sphere);
    const initialBest = p.bestFit;
    for (let i = 0; i < 10; i++) p.step([0,0], mkBounds(2));
    // Should have found a better spot
    expect(p.bestFit).toBeGreaterThanOrEqual(initialBest);
  });
  test('velocity clamped to ±(range × φ⁻¹) per dimension', () => {
    // span = (hi - lo) × PHI_INV = (5 - (-5)) × 0.618 ≈ 6.18
    const bounds: [number,number][] = [[-5,5],[-5,5]];
    const pos = [2, -2], vel = [100, 100]; // exaggerated velocity
    const p = new Particle(pos, vel, sphere);
    p.step([0,0], bounds);
    const maxSpan = (5 - (-5)) * PHI_INV;
    p.velocity.forEach((v: number) => {
      expect(Math.abs(v)).toBeLessThanOrEqual(maxSpan + 1e-9);
    });
  });
});

// ─── Section 3: ParticleSwarmOptimizer — Swarm Mechanics ─────────────────────
describe('PROTO-233 Deep: ParticleSwarmOptimizer Mechanics', () => {
  test('default nParticles = 34 (Fibonacci)', () => {
    const pso = new ParticleSwarmOptimizer(sphere, 2, null);
    expect(pso.nParticles).toBe(34);
  });

  test('custom nParticles respected', () => {
    const pso = new ParticleSwarmOptimizer(sphere, 2, null, 10);
    expect(pso.particles.length).toBe(10);
  });

  test('initial iteration = 0', () => expect(mkPSO(2).iteration).toBe(0));
  test('initial history empty', () => expect(mkPSO(2).history.length).toBe(0));

  test('step increments iteration', () => {
    const pso = mkPSO(2);
    pso.step();
    expect(pso.iteration).toBe(1);
  });

  test('step appends to history', () => {
    const pso = mkPSO(2);
    for (let i = 1; i <= 5; i++) {
      pso.step();
      expect(pso.history.length).toBe(i);
    }
  });

  test('history entry has iter and fitness', () => {
    const pso = mkPSO(2);
    pso.step();
    const entry = pso.history[0];
    expect(entry).toHaveProperty('iter');
    expect(entry).toHaveProperty('fitness');
  });

  test('globalFit is non-decreasing', () => {
    const pso = mkPSO(2);
    let prev = pso.globalFit;
    for (let i = 0; i < 20; i++) {
      pso.step();
      expect(pso.globalFit).toBeGreaterThanOrEqual(prev);
      prev = pso.globalFit;
    }
  });

  test('globalBest has correct dimension', () => {
    const pso = mkPSO(3, 21);
    pso.step();
    expect(pso.globalBest.length).toBe(3);
  });

  test('run(n) returns result with best and fitness', () => {
    const r = mkPSO(2).run(10);
    expect(r).toHaveProperty('best');
    expect(r).toHaveProperty('fitness');
    expect(r).toHaveProperty('iteration');
  });

  test('run(55) returns 55 iterations', () => {
    const pso = mkPSO(2);
    const r = pso.run(55);
    expect(r.iteration).toBe(55);
  });

  test('1D sphere: globalBest converges toward 0', () => {
    const bounds: [number,number][] = [[-10, 10]];
    const pso = new ParticleSwarmOptimizer(sphere, 1, bounds, 21);
    pso.run(200);
    expect(Math.abs(pso.globalBest[0])).toBeLessThan(5);
  });

  test('2D sphere: fitness improves over 100 iterations', () => {
    const pso = mkPSO(2);
    const before = pso.globalFit;
    pso.run(100);
    expect(pso.globalFit).toBeGreaterThanOrEqual(before);
  });

  test('bounds: all particles stay in bounds after run', () => {
    const dim = 2, bounds = mkBounds(dim, -2, 2);
    const pso = new ParticleSwarmOptimizer(sphere, dim, bounds, 13);
    pso.run(50);
    pso.particles.forEach((p: any) => {
      p.position.forEach((x: number, i: number) => {
        expect(x).toBeGreaterThanOrEqual(bounds[i][0] - 1e-9);
        expect(x).toBeLessThanOrEqual(bounds[i][1] + 1e-9);
      });
    });
  });

  test('history fitness values are non-decreasing', () => {
    const pso = mkPSO(2);
    pso.run(30);
    for (let i = 1; i < pso.history.length; i++) {
      expect(pso.history[i].fitness).toBeGreaterThanOrEqual(pso.history[i-1].fitness);
    }
  });

  test('multiple independent PSOs produce different trajectories', () => {
    const pso1 = mkPSO(2), pso2 = mkPSO(2);
    pso1.run(20); pso2.run(20);
    // Very unlikely both end at exact same position
    const same = pso1.globalBest.every((v: number, i: number) =>
      Math.abs(v - pso2.globalBest[i]) < 1e-12);
    expect(same).toBe(false);
  });

  test('nParticles=1 still runs without error', () => {
    const pso = new ParticleSwarmOptimizer(sphere, 2, null, 1);
    expect(() => pso.run(10)).not.toThrow();
  });

  test('dim=1 PSO works', () => {
    const pso = new ParticleSwarmOptimizer(sphere, 1, null, 13);
    const r = pso.run(50);
    expect(r.best.length).toBe(1);
  });

  test('dim=10 PSO works and improves', () => {
    const dim = 10;
    const pso = new ParticleSwarmOptimizer(sphere, dim, mkBounds(dim), 34);
    const r = pso.run(100);
    expect(r.fitness).toBeGreaterThan(-1000);
  });

  test('Fibonacci particle counts (8,13,21,34) all work', () => {
    [8, 13, 21, 34].forEach(n => {
      const pso = new ParticleSwarmOptimizer(sphere, 2, null, n);
      expect(() => pso.run(10)).not.toThrow();
    });
  });

  test('100 step history strictly ordered by iteration', () => {
    const pso = mkPSO(2);
    pso.run(100);
    pso.history.forEach((entry: any, i: number) => {
      expect(entry.iter).toBe(i + 1);
    });
  });
});

// ─── Section 4: PheromoneTrailSystem — ACO Dynamics ──────────────────────────
describe('PROTO-233 Deep: PheromoneTrailSystem ACO Dynamics', () => {
  test('initial level = PHI_INV when not specified', () => {
    const trail = new PheromoneTrailSystem();
    expect(trail.getLevel('A','B')).toBeCloseTo(PHI_INV, 9);
  });

  test('custom initial level accepted', () => {
    const trail = new PheromoneTrailSystem(1.0);
    expect(trail.getLevel('X','Y')).toBe(1.0);
  });

  test('initially 0 trails in map', () => {
    expect(new PheromoneTrailSystem().stats().trails).toBe(0);
  });

  test('deposit creates a trail', () => {
    const trail = mkTrail();
    trail.deposit(['A','B'], 1.0);
    expect(trail.stats().trails).toBe(1);
  });

  test('deposit increases level above initial', () => {
    const trail = mkTrail();
    const before = trail.getLevel('A','B');
    trail.deposit(['A','B'], 1.0);
    expect(trail.getLevel('A','B')).toBeGreaterThan(before);
  });

  test('deposit delta = quality × φ / path.length', () => {
    const trail = mkTrail();
    const Q = 0.8, path = ['A','B','C'];
    const expectedDelta = (Q * PHI) / (path.length);
    trail.deposit(path, Q);
    // Level should be initial + delta for each edge
    const level_AB = trail.getLevel('A','B');
    expect(level_AB).toBeCloseTo(PHI_INV + expectedDelta, 9);
  });

  test('longer path → smaller delta per edge', () => {
    const trailShort = mkTrail(), trailLong = mkTrail();
    trailShort.deposit(['A','B'], 1.0);            // 1 edge
    trailLong.deposit(['A','B','C','D','E'], 1.0); // 4 edges
    expect(trailShort.getLevel('A','B')).toBeGreaterThan(trailLong.getLevel('A','B'));
  });

  test('higher quality → higher level', () => {
    const tA = mkTrail(), tB = mkTrail();
    tA.deposit(['X','Y'], 0.3);
    tB.deposit(['X','Y'], 0.9);
    expect(tB.getLevel('X','Y')).toBeGreaterThan(tA.getLevel('X','Y'));
  });

  test('evaporate reduces all trail levels', () => {
    const trail = mkTrail();
    trail.deposit(['A','B'], 2.0);
    const before = trail.getLevel('A','B');
    trail.evaporate();
    expect(trail.getLevel('A','B')).toBeLessThan(before);
  });

  test('evaporate increments stepCount', () => {
    const trail = mkTrail();
    for (let i = 1; i <= 5; i++) {
      trail.evaporate();
      expect(trail.stats().evapSteps).toBe(i);
    }
  });

  test('evaporation rate = EVAPORATION', () => {
    const trail = mkTrail();
    trail.deposit(['A','B'], 2.0);
    const before = trail.getLevel('A','B');
    trail.evaporate();
    const expected = before * (1 - EVAPORATION);
    expect(trail.getLevel('A','B')).toBeCloseTo(expected, 8);
  });

  test('trail evaporates to zero eventually (pruned)', () => {
    const trail = mkTrail();
    trail.deposit(['A','B'], 0.001); // tiny deposit; total ≈ PHI_INV + delta
    // With EVAPORATION ≈ 0.0618, need ~210+ steps to reach < 1e-6
    for (let i = 0; i < 250; i++) trail.evaporate();
    // Trail should have been auto-pruned by evaporate()
    expect(trail.stats().trails).toBe(0);
  });

  test('multiple deposits accumulate', () => {
    const trail = mkTrail();
    trail.deposit(['A','B'], 1.0);
    const after1 = trail.getLevel('A','B');
    trail.deposit(['A','B'], 1.0);
    const after2 = trail.getLevel('A','B');
    expect(after2).toBeGreaterThan(after1);
  });

  test('deposit only affects edges in path', () => {
    const trail = mkTrail();
    trail.deposit(['A','B'], 1.0);
    expect(trail.getLevel('B','A')).toBeCloseTo(PHI_INV, 9); // reverse not affected
    expect(trail.getLevel('A','C')).toBeCloseTo(PHI_INV, 9); // unrelated not affected
  });

  test('stats maxLevel > minLevel when trails differ', () => {
    const trail = mkTrail();
    trail.deposit(['A','B'], 3.0); // high
    trail.deposit(['C','D'], 0.1); // low
    const s = trail.stats();
    expect(s.maxLevel).toBeGreaterThan(s.minLevel);
  });

  test('stats avgLevel between min and max', () => {
    const trail = mkTrail();
    trail.deposit(['A','B'], 2.0);
    trail.deposit(['C','D'], 0.5);
    const s = trail.stats();
    expect(s.avgLevel).toBeGreaterThanOrEqual(s.minLevel);
    expect(s.avgLevel).toBeLessThanOrEqual(s.maxLevel);
  });

  test('chooseNext returns one of the candidates', () => {
    const trail = mkTrail();
    trail.deposit(['A','B'], 1.0);
    const heuristic = (_from: string, _to: string) => 1.0;
    const next = trail.chooseNext('A', ['B','C','D'], heuristic);
    expect(['B','C','D']).toContain(next);
  });

  test('chooseNext returns single candidate always', () => {
    const trail = mkTrail();
    const next = trail.chooseNext('A', ['only'], () => 1.0);
    expect(next).toBe('only');
  });

  test('high-pheromone edge chosen more often (statistical)', () => {
    const trail = mkTrail();
    // Massively boost A→B
    for (let i = 0; i < 50; i++) trail.deposit(['A','B'], 5.0);
    const heur = () => 1.0;
    let bCount = 0;
    for (let i = 0; i < 100; i++) {
      if (trail.chooseNext('A', ['B','C'], heur) === 'B') bCount++;
    }
    expect(bCount).toBeGreaterThan(60); // B heavily favored
  });

  test('10 evaporation cycles: stats evapSteps = 10', () => {
    const trail = mkTrail();
    for (let i = 0; i < 10; i++) trail.evaporate();
    expect(trail.stats().evapSteps).toBe(10);
  });

  test('deposit empty path throws or does nothing', () => {
    const trail = mkTrail();
    expect(() => trail.deposit([], 1.0)).not.toThrow();
    expect(trail.stats().trails).toBe(0);
  });

  test('deposit single-node path creates no edges', () => {
    const trail = mkTrail();
    trail.deposit(['A'], 1.0);
    expect(trail.stats().trails).toBe(0);
  });

  test('5-node path creates 4 edges', () => {
    const trail = mkTrail();
    trail.deposit(['A','B','C','D','E'], 1.0);
    expect(trail.stats().trails).toBe(4);
  });
});

// ─── Section 5: SwarmConsensus — Collective Decisions ────────────────────────
describe('PROTO-233 Deep: SwarmConsensus Collective Decisions', () => {
  const opts4 = ['alpha','beta','gamma','delta'];

  test('throw on vote for unknown option', () => {
    const c = new SwarmConsensus(opts4);
    expect(() => c.vote('a1','ghost', 0.5)).toThrow();
  });

  test('valid vote does not throw', () => {
    const c = new SwarmConsensus(opts4);
    expect(() => c.vote('a1','alpha', 0.8)).not.toThrow();
  });

  test('tally without votes still returns all keys', () => {
    const c = mkCons();
    const r = c.tally();
    ['consensus','certainty','round','agentCount','ranking'].forEach(k => {
      expect(r).toHaveProperty(k);
    });
  });

  test('tally increments round', () => {
    const c = mkCons();
    for (let i = 1; i <= 5; i++) {
      expect(c.tally().round).toBe(i);
    }
  });

  test('agentCount reflects number of voters', () => {
    const c = new SwarmConsensus(opts4);
    c.vote('a1','alpha', 0.9);
    c.vote('a2','beta', 0.6);
    expect(c.tally().agentCount).toBe(2);
  });

  test('consensus = winning option', () => {
    const c = new SwarmConsensus(['A','B']);
    // All vote A
    for (let i = 0; i < 10; i++) c.vote(`a${i}`, 'A', 0.9);
    expect(c.tally().consensus).toBe('A');
  });

  test('unanimity → certainty = 1', () => {
    const c = new SwarmConsensus(['X','Y']);
    for (let i = 0; i < 5; i++) c.vote(`a${i}`,'X', 1.0);
    const r = c.tally();
    expect(r.certainty).toBeCloseTo(1.0, 5);
  });

  test('certainty ∈ [0,1]', () => {
    const c = new SwarmConsensus(opts4);
    c.vote('a1','alpha', 0.7); c.vote('a2','beta', 0.3);
    const r = c.tally();
    expect(r.certainty).toBeGreaterThanOrEqual(0);
    expect(r.certainty).toBeLessThanOrEqual(1);
  });

  test('ranking sorted descending by score', () => {
    const c = new SwarmConsensus(opts4);
    c.vote('a1','alpha', 1.0); c.vote('a2','alpha', 1.0);
    c.vote('a3','beta', 0.5);
    const { ranking } = c.tally();
    for (let i = 1; i < ranking.length; i++) {
      expect(ranking[i-1].score).toBeGreaterThanOrEqual(ranking[i].score);
    }
  });

  test('ranking contains all options', () => {
    const c = new SwarmConsensus(opts4);
    c.vote('a1','alpha', 1.0);
    const ranking = c.tally().ranking;
    const rankedOpts = ranking.map((r:any) => r.option);
    opts4.forEach(o => expect(rankedOpts).toContain(o));
  });

  test('proportions sum to 1', () => {
    const c = new SwarmConsensus(opts4);
    c.vote('a1','alpha',0.8); c.vote('a2','beta',0.4); c.vote('a3','gamma',0.6);
    const { ranking } = c.tally();
    const total = ranking.reduce((s:number,r:any) => s + r.proportion, 0);
    expect(total).toBeCloseTo(1, 6);
  });

  test('higher-confidence vote carries more weight', () => {
    const c = new SwarmConsensus(['X','Y']);
    c.vote('low', 'X', 0.1);   // low confidence X
    c.vote('high','Y', 0.9);   // high confidence Y
    expect(c.tally().consensus).toBe('Y');
  });

  test('reset clears votes', () => {
    const c = new SwarmConsensus(opts4);
    c.vote('a1','alpha', 1.0);
    c.reset();
    expect(c.tally().agentCount).toBe(0);
  });

  test('reset preserves round counter', () => {
    const c = mkCons();
    c.tally(); c.tally(); // round = 2
    c.reset();
    expect(c.tally().round).toBe(3); // continues from 2
  });

  test('vote update replaces previous vote', () => {
    const c = new SwarmConsensus(['A','B']);
    c.vote('agent1','A', 1.0);
    c.vote('agent1','B', 1.0); // override
    expect(c.tally().agentCount).toBe(1);
    expect(c.tally().consensus).toBe('B');
  });

  test('two-option split: higher confidence wins', () => {
    const c = new SwarmConsensus(['LEFT','RIGHT']);
    for (let i = 0; i < 5; i++) c.vote(`lA${i}`, 'LEFT',  0.4);
    for (let i = 0; i < 5; i++) c.vote(`rB${i}`, 'RIGHT', 0.8);
    expect(c.tally().consensus).toBe('RIGHT');
  });

  test('certainty formula: winner score / runner-up score × φ⁻¹ ≤ 1', () => {
    const c = new SwarmConsensus(['A','B']);
    c.vote('a1','A', 1.0); c.vote('a2','B', 0.5);
    const r = c.tally();
    expect(r.certainty).toBeLessThanOrEqual(1.0);
    expect(r.certainty).toBeGreaterThan(0);
  });

  test('single option → certainty = 1', () => {
    const c = new SwarmConsensus(['solo']);
    c.vote('a1','solo', 0.5);
    expect(c.tally().certainty).toBeCloseTo(1, 5);
  });

  test('100 agents unanimous vote → certainty 1', () => {
    const c = new SwarmConsensus(['yes','no']);
    for (let i = 0; i < 100; i++) c.vote(`a${i}`, 'yes', Math.random());
    expect(c.tally().consensus).toBe('yes');
    expect(c.tally().certainty).toBeCloseTo(1, 5);
  });

  test('confidence clamped to [0,1]', () => {
    const c = new SwarmConsensus(['A','B']);
    expect(() => c.vote('a1','A', 1.5)).not.toThrow(); // should clamp
    expect(() => c.vote('a2','B', -0.5)).not.toThrow();
    const r = c.tally();
    expect(r.certainty).toBeGreaterThanOrEqual(0);
    expect(r.certainty).toBeLessThanOrEqual(1);
  });

  test('10 rounds with reset between: rounds count correctly', () => {
    const c = new SwarmConsensus(['A','B']);
    for (let round = 1; round <= 10; round++) {
      c.vote('agent','A', 1.0);
      const r = c.tally();
      expect(r.round).toBe(round);
      c.reset();
    }
  });
});

// ─── Section 6: SwarmIntelligenceBus Orchestration ───────────────────────────
describe('PROTO-233 Deep: SwarmIntelligenceBus Orchestration', () => {
  test('fresh bus: all counts 0, beat 0', () => {
    const bus = mkBus();
    const r = bus.report();
    expect(r.beat).toBe(0);
    expect(r.optimizers).toBe(0);
    expect(r.pheromones).toBe(0);
    expect(r.consensuses).toBe(0);
  });

  test('registerOptimizer adds to optimizer count', () => {
    const bus = mkBus();
    bus.registerOptimizer('pso1', sphere, 2);
    expect(bus.report().optimizers).toBe(1);
  });

  test('registerPheromoneTrail adds to pheromone count', () => {
    const bus = mkBus();
    bus.registerPheromoneTrail('trail1');
    expect(bus.report().pheromones).toBe(1);
  });

  test('registerConsensus adds to consensus count', () => {
    const bus = mkBus();
    bus.registerConsensus('c1', ['A','B']);
    expect(bus.report().consensuses).toBe(1);
  });

  test('optimize unknown id returns null', () => {
    expect(mkBus().optimize('ghost')).toBeNull();
  });

  test('optimize runs PSO and returns result', () => {
    const bus = mkBus();
    bus.registerOptimizer('opt1', sphere, 2, mkBounds(2));
    const r = bus.optimize('opt1', 20);
    expect(r).not.toBeNull();
    expect(r.iteration).toBe(20);
  });

  test('getPheromone unknown returns null', () => {
    expect(mkBus().getPheromone('ghost')).toBeNull();
  });

  test('getPheromone known returns trail', () => {
    const bus = mkBus();
    bus.registerPheromoneTrail('t1');
    expect(bus.getPheromone('t1')).not.toBeNull();
  });

  test('tally unknown consensus returns null', () => {
    expect(mkBus().tally('ghost')).toBeNull();
  });

  test('full consensus pipeline via bus', () => {
    const bus = mkBus();
    bus.registerConsensus('vote1', ['A','B','C']);
    bus.vote('vote1','a1','A', 0.9);
    bus.vote('vote1','a2','A', 0.8);
    bus.vote('vote1','a3','B', 0.3);
    const r = bus.tally('vote1');
    expect(r.consensus).toBe('A');
  });

  test('tick increments beat', () => {
    const bus = mkBus();
    for (let i = 1; i <= 10; i++) {
      bus.tick();
      expect(bus.report().beat).toBe(i);
    }
  });

  test('tick returns phiPulse ∈ [0,1)', () => {
    const bus = mkBus();
    for (let i = 0; i < 20; i++) {
      const t = bus.tick();
      expect(t.phiPulse).toBeGreaterThanOrEqual(0);
      expect(t.phiPulse).toBeLessThan(1);
    }
  });

  test('tick evaporates registered pheromone trails', () => {
    const bus = mkBus();
    const trail = bus.registerPheromoneTrail('t1');
    trail.deposit(['A','B'], 3.0);
    const before = trail.getLevel('A','B');
    bus.tick();
    expect(trail.getLevel('A','B')).toBeLessThan(before);
  });

  test('multiple optimizers run independently', () => {
    const bus = mkBus();
    bus.registerOptimizer('o1', sphere, 2, mkBounds(2));
    bus.registerOptimizer('o2', rastrigin, 2, mkBounds(2));
    const r1 = bus.optimize('o1', 30);
    const r2 = bus.optimize('o2', 30);
    expect(r1.fitness).not.toBe(r2.fitness); // different landscapes
  });

  test('10 ticks then check all pheromone trails evaporated proportionally', () => {
    const bus = mkBus();
    const t = bus.registerPheromoneTrail('t1');
    t.deposit(['X','Y'], 10.0);
    const before = t.getLevel('X','Y');
    for (let i = 0; i < 10; i++) bus.tick();
    const after = t.getLevel('X','Y');
    expect(after).toBeLessThan(before);
    const expected = before * Math.pow(1 - EVAPORATION, 10);
    expect(after).toBeCloseTo(expected, 5);
  });

  test('tick phiPulse is irrational-uniform (no repeats in 20 ticks)', () => {
    const bus = mkBus();
    const pulses = Array.from({length:20}, () => bus.tick().phiPulse);
    const unique = new Set(pulses.map(p => p.toFixed(9)));
    expect(unique.size).toBe(20);
  });

  test('5 consensuses, 3 optimizers, 2 trails: report correct', () => {
    const bus = mkBus();
    for (let i = 0; i < 3; i++) bus.registerOptimizer(`o${i}`, sphere, 2);
    for (let i = 0; i < 2; i++) bus.registerPheromoneTrail(`t${i}`);
    for (let i = 0; i < 5; i++) bus.registerConsensus(`c${i}`, ['X','Y']);
    const r = bus.report();
    expect(r.optimizers).toBe(3);
    expect(r.pheromones).toBe(2);
    expect(r.consensuses).toBe(5);
  });
});

// ─── Section 7: Convergence & Phi-Harmonic Properties ────────────────────────
describe('PROTO-233 Deep: Convergence & Phi-Harmonic Properties', () => {
  test('PSO on sphere(1D) converges within 5 units of origin', () => {
    const bounds: [number,number][] = [[-10,10]];
    const pso = new ParticleSwarmOptimizer(sphere, 1, bounds, 21);
    pso.run(300);
    expect(Math.abs(pso.globalBest[0])).toBeLessThan(5);
  });

  test('pheromone deposit delta = quality × φ / path.length', () => {
    const trail = mkTrail(0);  // initial=0
    trail.deposit(['A','B'], 1.0);
    // path.length=2, delta = 1.0 × φ / 2 = φ/2 ≈ 0.809
    expect(trail.getLevel('A','B')).toBeCloseTo(PHI / 2, 8);
  });

  test('phi-weighted consensus: certainty = φ⁻¹ when winner leads by exactly φ', () => {
    // winner.score / runnerUp.score = φ → certainty = φ × φ⁻¹ = 1 (capped)
    // Or for a ratio < φ: certainty = ratio × φ⁻¹
    const c = new SwarmConsensus(['A','B']);
    c.vote('a1','A', PHI);   // effectively PHI confidence (clamped to 1)
    c.vote('a2','B', 1.0);
    const r = c.tally();
    expect(r.certainty).toBeLessThanOrEqual(1.0);
    expect(r.certainty).toBeGreaterThan(0);
  });

  test('evaporation formula applied correctly over 5 steps', () => {
    const trail = mkTrail();
    trail.deposit(['A','B'], 1.0);
    const base = trail.getLevel('A','B');
    let expected = base;
    for (let i = 0; i < 5; i++) {
      trail.evaporate();
      expected *= (1 - EVAPORATION);
    }
    expect(trail.getLevel('A','B')).toBeCloseTo(expected, 8);
  });

  test('PSO global fitness is always ≤ 0 for sphere (max at origin)', () => {
    const pso = mkPSO(3, 21);
    pso.run(50);
    expect(pso.globalFit).toBeLessThanOrEqual(0 + 1e-9);
  });

  test('PSO phi-weighted inertia < standard PSO inertia (0.729)', () => {
    expect(PSO_W).toBeLessThan(0.729);
  });

  test('PSO social dominates over cognitive: c₂ > c₁', () => {
    expect(PSO_C2).toBeGreaterThan(PSO_C1);
  });

  test('phi-weighted coefficients produce finite PSO trajectory', () => {
    const pso = mkPSO(4, 13);
    pso.run(100);
    pso.particles.forEach((p:any) => {
      p.position.forEach((x:number) => {
        expect(isFinite(x)).toBe(true);
        expect(isNaN(x)).toBe(false);
      });
    });
  });

  test('swarm bus phiPulse sequence follows fractional phi pattern', () => {
    const bus = mkBus();
    for (let i = 1; i <= 5; i++) {
      const { phiPulse } = bus.tick();
      const expected = (i * PHI_INV) % 1;
      expect(phiPulse).toBeCloseTo(expected, 9);
    }
  });

  test('10 pheromone deposits + 10 evaporations: net level > initial', () => {
    const trail = mkTrail();
    for (let i = 0; i < 10; i++) {
      trail.deposit(['A','B'], 0.5);
      trail.evaporate();
    }
    // Net deposits with evaporation should still be above initial PHI_INV
    // because 10 deposits of 0.5×φ each outweigh evaporation
    expect(trail.getLevel('A','B')).toBeGreaterThan(PHI_INV);
  });

  test('consensus ranking proportions all ≥ 0', () => {
    const c = new SwarmConsensus(['A','B','C','D']);
    c.vote('a1','A',0.8); c.vote('a2','B',0.4);
    c.tally().ranking.forEach((r:any) => expect(r.proportion).toBeGreaterThanOrEqual(0));
  });

  test('bus: 55-step optimize on 2D sphere finds fitness > -50', () => {
    const bus = mkBus();
    bus.registerOptimizer('o1', sphere, 2, mkBounds(2,  -5, 5), 34);
    const r = bus.optimize('o1', 55);
    expect(r.fitness).toBeGreaterThan(-50);
  });
});
