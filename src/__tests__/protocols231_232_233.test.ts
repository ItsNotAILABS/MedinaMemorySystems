/**
 * Tests for PROTO-231, PROTO-232, PROTO-233
 * quantum-coherence-protocol.js · temporal-reasoning-protocol.js · swarm-intelligence-protocol.js
 */

'use strict';

const {
  PHI: QPHI, PHI_INV: QPHI_INV, Complex,
  QuantumCognitiveState, EntangledPair,
  QuantumDecisionEngine, QuantumMemoryCell, QuantumCoherenceBus,
} = require('../protocols/quantum-coherence-protocol');

const {
  PHI: TPHI, PHI_INV: TPHI_INV, TIME_SCALES,
  TemporalEvent, PhiDecayBuffer, CausalGraph,
  TemporalAbstractor, TemporalReasoningEngine,
} = require('../protocols/temporal-reasoning-protocol');

const {
  PHI: SPHI, PHI_INV: SPHI_INV, PHI_SQ,
  PSO_W, PSO_C1, PSO_C2, EVAPORATION,
  Particle, ParticleSwarmOptimizer,
  PheromoneTrailSystem, SwarmConsensus, SwarmIntelligenceBus,
} = require('../protocols/swarm-intelligence-protocol');

// ═══════════════════════════════════════════════════════════════
// PROTO-231: QUANTUM COHERENCE PROTOCOL
// ═══════════════════════════════════════════════════════════════

describe('PROTO-231 — Quantum Coherence Protocol', () => {

  // ── Constants ──────────────────────────────────────────────
  describe('Constants', () => {
    test('PHI is golden ratio', () => expect(QPHI).toBeCloseTo(1.618033988, 6));
    test('PHI_INV = 1/PHI',    () => expect(QPHI_INV).toBeCloseTo(0.618033988, 6));
    test('PHI × PHI_INV = 1',  () => expect(QPHI * QPHI_INV).toBeCloseTo(1, 10));
  });

  // ── Complex ────────────────────────────────────────────────
  describe('Complex', () => {
    test('add', () => {
      const c = new Complex(1, 2).add(new Complex(3, 4));
      expect(c.re).toBe(4); expect(c.im).toBe(6);
    });
    test('mul', () => {
      const c = new Complex(1, 2).mul(new Complex(3, 4));
      expect(c.re).toBe(-5); expect(c.im).toBe(10);
    });
    test('norm2 = re²+im²', () => {
      expect(new Complex(3, 4).norm2()).toBe(25);
    });
    test('norm = |c|', () => expect(new Complex(3, 4).norm()).toBe(5));
    test('phase e^(iπ) ≈ -1+0i', () => {
      const p = Complex.phase(Math.PI);
      expect(p.re).toBeCloseTo(-1, 10);
      expect(p.im).toBeCloseTo(0, 10);
    });
    test('conj negates im', () => {
      const c = new Complex(1, 2).conj();
      expect(c.im).toBe(-2);
    });
  });

  // ── QuantumCognitiveState ──────────────────────────────────
  describe('QuantumCognitiveState', () => {
    const options = ['A', 'B', 'C', 'D'];

    test('probabilities sum to 1', () => {
      const state = new QuantumCognitiveState(options);
      const sum = state.probabilities().reduce((s, p) => s + p, 0);
      expect(sum).toBeCloseTo(1, 10);
    });

    test('applyPhase keeps probabilities summing to 1', () => {
      const state = new QuantumCognitiveState(options);
      state.applyPhase(1, Math.PI / 4);
      const sum = state.probabilities().reduce((s, p) => s + p, 0);
      expect(sum).toBeCloseTo(1, 10);
    });

    test('measure returns one of the options', () => {
      const state = new QuantumCognitiveState(options);
      const result = state.measure();
      expect(options).toContain(result.option);
    });

    test('measure collapses the state', () => {
      const state = new QuantumCognitiveState(options);
      state.measure();
      expect(state.collapsed).toBe(true);
    });

    test('measure twice returns same result', () => {
      const state = new QuantumCognitiveState(options);
      const r1 = state.measure();
      const r2 = state.measure();
      expect(r1.option).toBe(r2.option);
    });

    test('applyPhase after collapse throws', () => {
      const state = new QuantumCognitiveState(options);
      state.measure();
      expect(() => state.applyPhase(0, 0.1)).toThrow();
    });

    test('expectation uses probabilities', () => {
      const state = new QuantumCognitiveState(options);
      const e = state.expectation(i => i);
      expect(e).toBeGreaterThanOrEqual(0);
      expect(e).toBeLessThan(options.length);
    });
  });

  // ── QuantumDecisionEngine ──────────────────────────────────
  describe('QuantumDecisionEngine', () => {
    const opts = ['X', 'Y', 'Z'];
    const utils = [0.8, 0.4, 1.0];

    test('decide returns an option', () => {
      const eng = new QuantumDecisionEngine(opts, utils);
      const d = eng.decide();
      expect(opts).toContain(d.option);
    });

    test('decide records history', () => {
      const eng = new QuantumDecisionEngine(opts, utils);
      eng.decide(); eng.decide();
      expect(eng.history.length).toBe(2);
    });

    test('classicalOptimum returns highest utility', () => {
      const eng = new QuantumDecisionEngine(opts, utils);
      expect(eng.classicalOptimum().option).toBe('Z');
    });

    test('length mismatch throws', () => {
      expect(() => new QuantumDecisionEngine(['A'], [1, 2])).toThrow();
    });

    test('phiCoherence field is present', () => {
      const eng = new QuantumDecisionEngine(opts, utils);
      const d = eng.decide();
      expect(d.phiCoherence).toBeDefined();
    });
  });

  // ── QuantumMemoryCell ──────────────────────────────────────
  describe('QuantumMemoryCell', () => {
    const interpretations = ['episodic', 'semantic', 'procedural'];

    test('peek returns all interpretations', () => {
      const cell = new QuantumMemoryCell('ctx', interpretations);
      const p = cell.peek();
      expect(p.length).toBe(3);
      p.forEach(e => {
        expect(typeof e.interpretation).toBe('string');
        expect(typeof e.probability).toBe('number');
      });
    });

    test('peek probabilities sum to 1', () => {
      const cell = new QuantumMemoryCell('ctx', interpretations);
      const sum = cell.peek().reduce((s, e) => s + e.probability, 0);
      expect(sum).toBeCloseTo(1, 10);
    });

    test('read collapses state', () => {
      const cell = new QuantumMemoryCell('ctx', interpretations);
      const r = cell.read();
      expect(interpretations).toContain(r.option);
      expect(cell.readCount).toBe(1);
    });

    test('write resets state', () => {
      const cell = new QuantumMemoryCell('ctx', interpretations);
      cell.read();
      cell.write(['new-A', 'new-B']);
      expect(cell.writeCount).toBe(1);
      const p = cell.peek();
      expect(p.length).toBe(2);
    });

    test('coherenceScore in [0,1]', () => {
      const cell = new QuantumMemoryCell('ctx', interpretations);
      const s = cell.coherenceScore();
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(1);
    });
  });

  // ── QuantumCoherenceBus ────────────────────────────────────
  describe('QuantumCoherenceBus', () => {
    test('registerCell stores cell', () => {
      const bus = new QuantumCoherenceBus();
      bus.registerCell('mem', ['A', 'B']);
      expect(bus.getCell('mem')).not.toBeNull();
    });

    test('getCell returns null for unknown', () => {
      expect(new QuantumCoherenceBus().getCell('ghost')).toBeNull();
    });

    test('entangle returns EntangledPair', () => {
      const bus = new QuantumCoherenceBus();
      bus.registerCell('a', ['X', 'Y']);
      bus.registerCell('b', ['X', 'Y']);
      const pair = bus.entangle('a', 'b');
      expect(pair).toBeInstanceOf(EntangledPair);
    });

    test('decide returns decision', () => {
      const bus = new QuantumCoherenceBus();
      bus.registerDecision('d1', ['A', 'B', 'C'], [0.5, 0.8, 0.3]);
      const d = bus.decide('d1');
      expect(['A', 'B', 'C']).toContain(d.option);
    });

    test('coherenceReport increments beat', () => {
      const bus = new QuantumCoherenceBus();
      bus.coherenceReport();
      const r = bus.coherenceReport();
      expect(r.beat).toBe(2);
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// PROTO-232: TEMPORAL REASONING PROTOCOL
// ═══════════════════════════════════════════════════════════════

describe('PROTO-232 — Temporal Reasoning Protocol', () => {

  describe('Constants', () => {
    test('PHI is golden ratio', () => expect(TPHI).toBeCloseTo(1.618033988, 6));
    test('TIME_SCALES has 8 entries', () => expect(TIME_SCALES.length).toBe(8));
    test('first scale ≈ 100ms', () => expect(TIME_SCALES[0].ms).toBeCloseTo(100, 1));
    test('each scale is φ× previous', () => {
      for (let i = 1; i < 8; i++) {
        expect(TIME_SCALES[i].ms / TIME_SCALES[i-1].ms).toBeCloseTo(TPHI, 5);
      }
    });
    test('scale labels are correct', () => {
      const labels = ['flash','micro','pulse','breath','beat','wave','cycle','epoch'];
      TIME_SCALES.forEach((s, i) => expect(s.label).toBe(labels[i]));
    });
  });

  describe('TemporalEvent', () => {
    test('creates with required fields', () => {
      const ev = new TemporalEvent('e1', 'sensor', 'data');
      expect(ev.id).toBe('e1');
      expect(ev.type).toBe('sensor');
      expect(typeof ev.timestamp).toBe('number');
    });

    test('addCause and addEffect work', () => {
      const ev = new TemporalEvent('e1', 'x', null);
      ev.addCause('e0'); ev.addEffect('e2');
      expect(ev.causes).toContain('e0');
      expect(ev.effects).toContain('e2');
    });

    test('addCause does not duplicate', () => {
      const ev = new TemporalEvent('e1', 'x', null);
      ev.addCause('e0'); ev.addCause('e0');
      expect(ev.causes.length).toBe(1);
    });

    test('decayedWeight decreases over time', () => {
      const ev = new TemporalEvent('e1', 'x', null, Date.now() - 10000);
      const w = ev.decayedWeight();
      expect(w).toBeLessThan(1);
      expect(w).toBeGreaterThan(0);
    });
  });

  describe('PhiDecayBuffer', () => {
    test('add and get work', () => {
      const buf = new PhiDecayBuffer(10);
      const ev = new TemporalEvent('e1', 'x', null);
      buf.add(ev);
      expect(buf.get('e1')).toBe(ev);
    });

    test('size tracks events', () => {
      const buf = new PhiDecayBuffer(10);
      buf.add(new TemporalEvent('e1', 'x', null));
      buf.add(new TemporalEvent('e2', 'y', null));
      expect(buf.size()).toBe(2);
    });

    test('capacity evicts lowest-weight event', () => {
      const buf = new PhiDecayBuffer(2);
      buf.add(new TemporalEvent('e1', 'x', null, Date.now() - 100000));
      buf.add(new TemporalEvent('e2', 'y', null));
      buf.add(new TemporalEvent('e3', 'z', null));
      expect(buf.size()).toBe(2);
    });

    test('prune removes low-weight events', () => {
      const buf = new PhiDecayBuffer(10);
      buf.add(new TemporalEvent('old', 'x', null, 0));
      buf.add(new TemporalEvent('new', 'y', null));
      const removed = buf.prune(0.001);
      expect(removed).toBeGreaterThanOrEqual(1);
    });
  });

  describe('CausalGraph', () => {
    test('link and predictEffects', () => {
      const g = new CausalGraph();
      g.link('A', 'B', 0.9);
      g.link('B', 'C', 0.8);
      const effects = g.predictEffects('A');
      expect(effects.some(e => e.id === 'B')).toBe(true);
    });

    test('inferCauses traces backwards', () => {
      const g = new CausalGraph();
      g.link('X', 'Y', 0.9);
      g.link('Y', 'Z', 0.8);
      const causes = g.inferCauses('Z');
      expect(causes.some(c => c.id === 'Y')).toBe(true);
    });

    test('nodeCount and edgeCount', () => {
      const g = new CausalGraph();
      g.link('A', 'B'); g.link('B', 'C');
      expect(g.nodeCount()).toBe(3);
      expect(g.edgeCount()).toBe(2);
    });

    test('strength attenuates at depth', () => {
      const g = new CausalGraph();
      g.link('A', 'B', 1.0); g.link('B', 'C', 1.0);
      const effects = g.predictEffects('A', 3);
      const cEffect = effects.find(e => e.id === 'C');
      const bEffect = effects.find(e => e.id === 'B');
      if (cEffect && bEffect) {
        expect(cEffect.strength).toBeLessThan(bEffect.strength);
      }
    });
  });

  describe('TemporalAbstractor', () => {
    test('returns episodes', () => {
      const abs = new TemporalAbstractor();
      const evs = [
        new TemporalEvent('e1', 'A', null, 1000),
        new TemporalEvent('e2', 'B', null, 1100),
        new TemporalEvent('e3', 'C', null, 5000),
      ];
      const eps = abs.summarise(evs, 4);
      expect(eps.length).toBeGreaterThanOrEqual(1);
    });

    test('empty returns empty', () => {
      expect(new TemporalAbstractor().summarise([], 4)).toEqual([]);
    });
  });

  describe('TemporalReasoningEngine', () => {
    test('ingest creates event', () => {
      const eng = new TemporalReasoningEngine();
      const ev = eng.ingest('type', 'payload');
      expect(ev.id).toBeDefined();
      expect(eng.status().buffered).toBe(1);
    });

    test('ingest with cause creates causal link', () => {
      const eng = new TemporalReasoningEngine();
      const e1 = eng.ingest('a', 'x');
      const e2 = eng.ingest('b', 'y', [e1.id]);
      const effects = eng.predictEffects(e1.id);
      expect(effects.some(e => e.id === e2.id)).toBe(true);
    });

    test('assertCausation adds link', () => {
      const eng = new TemporalReasoningEngine();
      const e1 = eng.ingest('a', 'x');
      const e2 = eng.ingest('b', 'y');
      eng.assertCausation(e1.id, e2.id, 0.9);
      expect(eng.predictEffects(e1.id).some(e => e.id === e2.id)).toBe(true);
    });

    test('summarise returns array', () => {
      const eng = new TemporalReasoningEngine();
      eng.ingest('a', 'x'); eng.ingest('b', 'y');
      const s = eng.summarise(4);
      expect(Array.isArray(s)).toBe(true);
    });

    test('status has expected keys', () => {
      const eng = new TemporalReasoningEngine();
      const s = eng.status();
      expect(s).toHaveProperty('buffered');
      expect(s).toHaveProperty('causalNodes');
      expect(s).toHaveProperty('causalEdges');
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// PROTO-233: SWARM INTELLIGENCE PROTOCOL
// ═══════════════════════════════════════════════════════════════

describe('PROTO-233 — Swarm Intelligence Protocol', () => {

  describe('Constants', () => {
    test('PHI is golden ratio', () => expect(SPHI).toBeCloseTo(1.618033988, 6));
    test('PSO_W = φ⁻²',   () => expect(PSO_W).toBeCloseTo(1 / (SPHI*SPHI), 10));
    test('PSO_C1 = φ⁻¹',  () => expect(PSO_C1).toBeCloseTo(1/SPHI, 10));
    test('PSO_C2 = φ',    () => expect(PSO_C2).toBeCloseTo(SPHI, 10));
    test('PSO coefficients sum to φ²', () => {
      expect(PSO_W + PSO_C1 + PSO_C2).toBeCloseTo(SPHI * SPHI, 5);
    });
    test('EVAPORATION ≈ 0.0618', () => expect(EVAPORATION).toBeCloseTo(SPHI_INV * 0.1, 10));
  });

  describe('ParticleSwarmOptimizer', () => {
    const fn  = pos => -(pos[0]**2 + pos[1]**2);  // max at origin
    const bnd = [[-5,5],[-5,5]];

    test('initialises without error', () => {
      expect(() => new ParticleSwarmOptimizer(fn, 2, bnd, 10)).not.toThrow();
    });

    test('step returns iteration, best, fitness', () => {
      const pso = new ParticleSwarmOptimizer(fn, 2, bnd, 10);
      const r = pso.step();
      expect(r).toHaveProperty('iteration');
      expect(r).toHaveProperty('best');
      expect(r).toHaveProperty('fitness');
    });

    test('run improves or maintains fitness', () => {
      const pso = new ParticleSwarmOptimizer(fn, 2, bnd, 10);
      const r0  = pso.step();
      const rN  = pso.run(20);
      expect(rN.fitness).toBeGreaterThanOrEqual(r0.fitness);
    });

    test('fitness converges toward 0 for sphere fn', () => {
      const pso = new ParticleSwarmOptimizer(fn, 2, bnd, 34);
      const r   = pso.run(100);
      // fitness = -(x²+y²) → max 0 at origin
      expect(r.fitness).toBeGreaterThan(-5);
    });

    test('works without bounds', () => {
      const pso = new ParticleSwarmOptimizer(fn, 2, null, 5);
      expect(() => pso.run(10)).not.toThrow();
    });
  });

  describe('PheromoneTrailSystem', () => {
    test('initial level is PHI_INV', () => {
      const aco = new PheromoneTrailSystem();
      expect(aco.getLevel('A','B')).toBeCloseTo(SPHI_INV, 5);
    });

    test('deposit increases level', () => {
      const aco = new PheromoneTrailSystem();
      const before = aco.getLevel('A','B');
      aco.deposit(['A','B'], 1.0);
      expect(aco.getLevel('A','B')).toBeGreaterThan(before);
    });

    test('evaporate reduces level', () => {
      const aco = new PheromoneTrailSystem();
      aco.deposit(['A','B'], 1.0);
      const before = aco.getLevel('A','B');
      aco.evaporate();
      expect(aco.getLevel('A','B')).toBeLessThan(before);
    });

    test('chooseNext returns a candidate', () => {
      const aco = new PheromoneTrailSystem();
      aco.deposit(['A','B'], 1.0);
      aco.deposit(['A','C'], 0.5);
      const next = aco.chooseNext('A', ['B','C'], () => 1);
      expect(['B','C']).toContain(next);
    });

    test('stats has expected keys', () => {
      const aco = new PheromoneTrailSystem();
      aco.deposit(['X','Y'], 1.0);
      const s = aco.stats();
      expect(s).toHaveProperty('trails');
      expect(s).toHaveProperty('maxLevel');
    });
  });

  describe('SwarmConsensus', () => {
    test('vote and tally return consensus', () => {
      const c = new SwarmConsensus(['A','B','C']);
      c.vote('ag1', 'A', 0.9);
      c.vote('ag2', 'A', 0.8);
      c.vote('ag3', 'B', 0.5);
      const t = c.tally();
      expect(t.consensus).toBe('A');
    });

    test('certainty in [0,1]', () => {
      const c = new SwarmConsensus(['A','B']);
      c.vote('ag1', 'A', 0.7);
      c.vote('ag2', 'B', 0.3);
      const t = c.tally();
      expect(t.certainty).toBeGreaterThanOrEqual(0);
      expect(t.certainty).toBeLessThanOrEqual(1);
    });

    test('unknown option throws', () => {
      const c = new SwarmConsensus(['A','B']);
      expect(() => c.vote('ag1', 'Z', 0.5)).toThrow();
    });

    test('reset clears votes', () => {
      const c = new SwarmConsensus(['A','B']);
      c.vote('ag1', 'A', 0.9);
      c.reset();
      const t = c.tally();
      expect(t.agentCount).toBe(0);
    });

    test('tally round increments', () => {
      const c = new SwarmConsensus(['A']);
      c.vote('ag1','A',1);
      c.tally(); c.tally();
      expect(c.tally().round).toBe(3);
    });
  });

  describe('SwarmIntelligenceBus', () => {
    test('registers and runs optimizer', () => {
      const bus = new SwarmIntelligenceBus();
      bus.registerOptimizer('o1', pos => -(pos[0]**2), 1, [[-5,5]], 5);
      const r = bus.optimize('o1', 10);
      expect(r).toHaveProperty('fitness');
    });

    test('pheromone trail management', () => {
      const bus = new SwarmIntelligenceBus();
      const trail = bus.registerPheromoneTrail('t1');
      trail.deposit(['A','B'], 1.0);
      expect(bus.getPheromone('t1').getLevel('A','B')).toBeGreaterThan(SPHI_INV);
    });

    test('tick evaporates trails and increments beat', () => {
      const bus = new SwarmIntelligenceBus();
      bus.registerPheromoneTrail('t1');
      bus.getPheromone('t1').deposit(['A','B'], 5.0);
      const before = bus.getPheromone('t1').getLevel('A','B');
      const t = bus.tick();
      expect(t.beat).toBe(1);
      expect(bus.getPheromone('t1').getLevel('A','B')).toBeLessThan(before);
    });

    test('consensus vote and tally', () => {
      const bus = new SwarmIntelligenceBus();
      bus.registerConsensus('c1', ['X','Y','Z']);
      bus.vote('c1', 'ag1', 'X', 0.9);
      bus.vote('c1', 'ag2', 'X', 0.7);
      const t = bus.tally('c1');
      expect(t.consensus).toBe('X');
    });

    test('report has expected keys', () => {
      const r = new SwarmIntelligenceBus().report();
      expect(r).toHaveProperty('beat');
      expect(r).toHaveProperty('optimizers');
      expect(r).toHaveProperty('pheromones');
      expect(r).toHaveProperty('consensuses');
    });
  });
});
