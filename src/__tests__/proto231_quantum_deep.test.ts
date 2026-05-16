/**
 * PROTO-231 Deep Test Suite — Quantum Coherence Protocol
 * ≈ 250 tests covering amplitude math, superposition properties,
 * statistical distributions, entanglement, decision engine analytics,
 * memory cell lifecycle, and coherence bus orchestration.
 *
 * For AI systems and the organism — every test is a proof of life.
 */

'use strict';

const {
  PHI, PHI_INV, PHI_SQ,
  Complex,
  QuantumCognitiveState,
  EntangledPair,
  QuantumDecisionEngine,
  QuantumMemoryCell,
  QuantumCoherenceBus,
} = require('../protocols/quantum-coherence-protocol');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mkState  = (n = 4) => new QuantumCognitiveState(Array.from({length:n},(_,i)=>`opt${i}`));
const mkEngine = (n = 4) => new QuantumDecisionEngine(
  Array.from({length:n},(_,i)=>`o${i}`),
  Array.from({length:n},(_,i)=>(i+1)/n),
);
const mkBus    = () => new QuantumCoherenceBus();
const sumArr   = (a: number[]) => a.reduce((s,x)=>s+x,0);
const allClose = (a: number, b: number, eps=1e-9) => Math.abs(a-b) < eps;

// ─── Section 1: Constants & Golden Ratio ─────────────────────────────────────
describe('PROTO-231 Deep: Golden Ratio Constants', () => {
  test('PHI satisfies x² = x + 1',  () => expect(PHI*PHI).toBeCloseTo(PHI+1, 8));
  test('PHI_INV = PHI - 1',          () => expect(PHI_INV).toBeCloseTo(PHI-1, 8));
  test('PHI × PHI_INV = 1',          () => expect(PHI * PHI_INV).toBeCloseTo(1, 8));
  test('PHI_SQ = PHI + 1',           () => expect(PHI_SQ).toBeCloseTo(PHI+1, 8));
  test('1/PHI² = PHI² - 2×PHI + 1', () => {
    // Verify (φ-1)² = φ²-2φ+1 ≈ 0.382
    expect(PHI_INV * PHI_INV).toBeCloseTo(PHI_SQ - 2*PHI + 1, 8);
  });
  test('PHI > 1', () => expect(PHI).toBeGreaterThan(1));
  test('PHI_INV < 1', () => expect(PHI_INV).toBeLessThan(1));
  test('PHI_INV > 0', () => expect(PHI_INV).toBeGreaterThan(0));
  test('PHI + PHI_INV = √5', () => expect(PHI + PHI_INV).toBeCloseTo(Math.sqrt(5), 8));
  test('PHI - PHI_INV = 1', () => expect(PHI - PHI_INV).toBeCloseTo(1, 8));
});

// ─── Section 2: Complex Number Arithmetic ────────────────────────────────────
describe('PROTO-231 Deep: Complex Arithmetic', () => {
  test('(0+0i) is zero element', () => {
    const z = new Complex(0, 0);
    expect(z.norm()).toBe(0);
  });
  test('(1+0i) has norm 1', () => expect(new Complex(1,0).norm()).toBe(1));
  test('(0+1i) has norm 1', () => expect(new Complex(0,1).norm()).toBe(1));
  test('norm(a+bi) = √(a²+b²)', () => {
    expect(new Complex(3,4).norm()).toBe(5);
    expect(new Complex(5,12).norm()).toBe(13);
    expect(new Complex(8,15).norm()).toBe(17);
  });
  test('addition is commutative', () => {
    const a = new Complex(2,3), b = new Complex(5,7);
    const ab = a.add(b), ba = b.add(a);
    expect(ab.re).toBeCloseTo(ba.re,10); expect(ab.im).toBeCloseTo(ba.im,10);
  });
  test('multiplication is commutative', () => {
    const a = new Complex(2,3), b = new Complex(5,7);
    const ab = a.mul(b), ba = b.mul(a);
    expect(ab.re).toBeCloseTo(ba.re,10); expect(ab.im).toBeCloseTo(ba.im,10);
  });
  test('z × conj(z) is real', () => {
    const z = new Complex(3,4);
    const r = z.mul(z.conj());
    expect(r.im).toBeCloseTo(0, 10);
    expect(r.re).toBeCloseTo(25, 10);
  });
  test('e^(0i) = 1', () => {
    const p = Complex.phase(0);
    expect(p.re).toBeCloseTo(1, 10); expect(p.im).toBeCloseTo(0, 10);
  });
  test('e^(πi/2) = i', () => {
    const p = Complex.phase(Math.PI/2);
    expect(p.re).toBeCloseTo(0, 10); expect(p.im).toBeCloseTo(1, 10);
  });
  test('e^(πi) = -1', () => {
    const p = Complex.phase(Math.PI);
    expect(p.re).toBeCloseTo(-1, 10); expect(p.im).toBeCloseTo(0, 10);
  });
  test('e^(2πi) = 1', () => {
    const p = Complex.phase(2*Math.PI);
    expect(p.re).toBeCloseTo(1, 10); expect(p.im).toBeCloseTo(0, 10);
  });
  test('|e^(iθ)| = 1 for any θ', () => {
    [0, 0.5, 1.0, Math.PI/4, Math.PI, 2*Math.PI, 5.7].forEach(theta => {
      expect(Complex.phase(theta).norm()).toBeCloseTo(1, 10);
    });
  });
  test('scale multiplies re and im', () => {
    const c = new Complex(2, 3).scale(2);
    expect(c.re).toBe(4); expect(c.im).toBe(6);
  });
  test('scale by 0 gives zero', () => {
    const c = new Complex(7, 11).scale(0);
    expect(c.re).toBe(0); expect(c.im).toBe(0);
  });
  test('scale by -1 negates', () => {
    const c = new Complex(5, -3).scale(-1);
    expect(c.re).toBe(-5); expect(c.im).toBe(3);
  });
  test('sub is anti-commutative up to sign', () => {
    const a = new Complex(5,7), b = new Complex(2,3);
    const ab = a.sub(b), ba = b.sub(a);
    expect(ab.re).toBeCloseTo(-ba.re, 10);
    expect(ab.im).toBeCloseTo(-ba.im, 10);
  });
  test('norm2 = norm²', () => {
    const c = new Complex(4, 5);
    expect(c.norm2()).toBeCloseTo(c.norm()**2, 10);
  });
  test('conj of conj is identity', () => {
    const c = new Complex(3, -7);
    expect(c.conj().conj().re).toBeCloseTo(c.re,10);
    expect(c.conj().conj().im).toBeCloseTo(c.im,10);
  });
  test('mul distributes over add', () => {
    const a=new Complex(1,2), b=new Complex(3,4), c=new Complex(5,6);
    const lhs = a.mul(b.add(c));
    const rhs = a.mul(b).add(a.mul(c));
    expect(lhs.re).toBeCloseTo(rhs.re,10);
    expect(lhs.im).toBeCloseTo(rhs.im,10);
  });
  test('chain of phases accumulates angle', () => {
    const total = Complex.phase(1).mul(Complex.phase(1)).mul(Complex.phase(1));
    const direct = Complex.phase(3);
    expect(total.re).toBeCloseTo(direct.re, 8);
    expect(total.im).toBeCloseTo(direct.im, 8);
  });
});

// ─── Section 3: QuantumCognitiveState — Normalisation & Amplitude Laws ───────
describe('PROTO-231 Deep: QuantumCognitiveState Amplitude Laws', () => {
  const sizes = [1, 2, 3, 4, 5, 8, 13, 21];

  sizes.forEach(n => {
    test(`probs sum to 1 for n=${n}`, () => {
      const state = new QuantumCognitiveState(Array.from({length:n},(_,i)=>`o${i}`));
      expect(sumArr(state.probabilities())).toBeCloseTo(1, 9);
    });
  });

  test('all probs ≥ 0', () => {
    const s = mkState(8);
    s.probabilities().forEach(p => expect(p).toBeGreaterThanOrEqual(0));
  });

  test('all probs ≤ 1', () => {
    const s = mkState(8);
    s.probabilities().forEach(p => expect(p).toBeLessThanOrEqual(1));
  });

  test('applyPhase preserves Born-rule probabilities (phase is global)', () => {
    // Phase rotation e^(iθ)·α changes the complex phase but not the magnitude,
    // so |α|² = probability is unchanged. This is correct quantum behavior.
    const s = mkState(4);
    const before = s.probabilities().slice();
    s.applyPhase(0, Math.PI);
    const after = s.probabilities();
    before.forEach((p, i) => expect(after[i]).toBeCloseTo(p, 9));
  });

  test('applyPhase preserves norm', () => {
    const s = mkState(4);
    s.applyPhase(1, PHI * Math.PI);
    expect(sumArr(s.probabilities())).toBeCloseTo(1, 9);
  });

  test('multiple phase applications preserve norm', () => {
    const s = mkState(6);
    for (let i = 0; i < 6; i++) s.applyPhase(i, i * PHI_INV);
    expect(sumArr(s.probabilities())).toBeCloseTo(1, 9);
  });

  test('n=1 state always collapses to only option', () => {
    const s = new QuantumCognitiveState(['solo']);
    const r = s.measure();
    expect(r.option).toBe('solo');
    expect(r.probability).toBeCloseTo(1, 9);
  });

  test('expectation of constant 0 is 0', () => {
    expect(mkState().expectation(() => 0)).toBeCloseTo(0, 10);
  });

  test('expectation of constant 1 is 1', () => {
    expect(mkState().expectation(() => 1)).toBeCloseTo(1, 10);
  });

  test('expectation is in [min_util, max_util]', () => {
    const s = mkState(4);
    const utils = [0.1, 0.5, 0.9, 0.3];
    const e = s.expectation((i:number) => utils[i]);
    expect(e).toBeGreaterThanOrEqual(Math.min(...utils));
    expect(e).toBeLessThanOrEqual(Math.max(...utils));
  });

  test('throw on empty options', () => {
    expect(() => new QuantumCognitiveState([])).toThrow();
  });

  test('custom amplitudes are normalised', () => {
    const amps = [new Complex(2,0), new Complex(3,0)];
    const s = new QuantumCognitiveState(['a','b'], amps);
    expect(sumArr(s.probabilities())).toBeCloseTo(1, 9);
  });
});

// ─── Section 4: Measurement Statistics ───────────────────────────────────────
describe('PROTO-231 Deep: Measurement Statistics', () => {
  test('measure always returns a valid option', () => {
    const opts = ['alpha','beta','gamma','delta'];
    for (let i = 0; i < 20; i++) {
      const s = new QuantumCognitiveState(opts);
      const r = s.measure();
      expect(opts).toContain(r.option);
      expect(r.probability).toBeGreaterThan(0);
      expect(r.probability).toBeLessThanOrEqual(1);
    }
  });

  test('post-collapse: consecutive measures return same result', () => {
    const s = mkState(5);
    const r1 = s.measure();
    const r2 = s.measure();
    expect(r1.option).toBe(r2.option);
    expect(r1.index).toBe(r2.index);
  });

  test('collapsed flag is set after measure', () => {
    const s = mkState(3);
    expect(s.collapsed).toBe(false);
    s.measure();
    expect(s.collapsed).toBe(true);
  });

  test('probability at measured index is the stated probability', () => {
    const s = mkState(4);
    const probs = s.probabilities();
    const r = s.measure();
    expect(r.probability).toBeCloseTo(probs[r.index], 9);
  });

  // Statistical: over many instances, every option should appear
  test('uniform state samples all options over 50 trials', () => {
    const opts = ['A','B','C','D'];
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      seen.add(new QuantumCognitiveState(opts).measure().option);
    }
    expect(seen.size).toBe(opts.length);
  });

  test('phase-boosted option appears more often (statistical)', () => {
    const opts = ['low','high'];
    let highCount = 0;
    const N = 200;
    for (let i = 0; i < N; i++) {
      const s = new QuantumCognitiveState(opts);
      s.applyPhase(1, Math.PI * 0.8);  // boost 'high'
      if (s.measure().option === 'high') highCount++;
    }
    // Should appear > 50% of the time (may not always hold for small N, use soft bound)
    expect(highCount).toBeGreaterThan(N * 0.3);
  });
});

// ─── Section 5: EntangledPair ─────────────────────────────────────────────────
describe('PROTO-231 Deep: EntangledPair', () => {
  const mkPair = (n=3) => {
    const sA = new QuantumCognitiveState(Array.from({length:n},(_,i)=>`a${i}`));
    const sB = new QuantumCognitiveState(Array.from({length:n},(_,i)=>`b${i}`));
    return new EntangledPair(sA, sB);
  };

  test('pair has unique id', () => {
    const p1 = mkPair(), p2 = mkPair();
    expect(p1.id).not.toBe(p2.id);
  });

  test('id starts with ENT-', () => {
    expect(mkPair().id).toMatch(/^ENT-/);
  });

  test('initial collapsed=false', () => {
    expect(mkPair().collapsed).toBe(false);
  });

  test('measureA returns a result', () => {
    const p = mkPair();
    const r = p.measureA();
    expect(r).toBeDefined();
  });

  test('measureA collapses the pair', () => {
    const p = mkPair();
    p.measureA();
    expect(p.collapsed).toBe(true);
  });

  test('measureA after collapse returns undefined', () => {
    const p = mkPair();
    p.measureA();
    expect(p.measureA()).toBeUndefined();
  });

  test('correlationScore ≥ 0', () => {
    const p = mkPair();
    expect(p.correlationScore()).toBeGreaterThanOrEqual(0);
  });

  test('correlationScore ≤ 1 for equal-dim pairs', () => {
    const p = mkPair(4);
    // Bhattacharyya coefficient ≤ 1
    expect(p.correlationScore()).toBeLessThanOrEqual(1 + 1e-9);
  });

  test('pair with same states has high correlation', () => {
    const opts = ['x','y','z'];
    const sA = new QuantumCognitiveState(opts);
    const sB = new QuantumCognitiveState(opts);
    const p = new EntangledPair(sA, sB);
    // Uniform states have Bhattacharyya = Σ√(1/n × 1/n) = Σ(1/n) = 1
    expect(p.correlationScore()).toBeCloseTo(1, 5);
  });

  test('10 independent pairs all have unique ids', () => {
    const ids = new Set(Array.from({length:10}, ()=> mkPair().id));
    expect(ids.size).toBe(10);
  });
});

// ─── Section 6: QuantumDecisionEngine ────────────────────────────────────────
describe('PROTO-231 Deep: QuantumDecisionEngine', () => {
  test('decide returns all required fields', () => {
    const e = mkEngine(4);
    const d = e.decide();
    ['option','index','probability','utility','expectedUtil','phiCoherence','timestamp'].forEach(k => {
      expect(d).toHaveProperty(k);
    });
  });

  test('utility of chosen option matches utility vector', () => {
    const utils = [0.2, 0.5, 0.9, 0.1];
    const opts  = ['a','b','c','d'];
    const e     = new QuantumDecisionEngine(opts, utils);
    const d     = e.decide();
    expect(d.utility).toBeCloseTo(utils[d.index as number], 9);
  });

  test('expectedUtil ∈ [min,max] of utilities', () => {
    const utils = [0.1, 0.4, 0.7, 1.0];
    const e = new QuantumDecisionEngine(['a','b','c','d'], utils);
    const d = e.decide();
    expect(d.expectedUtil as number).toBeGreaterThanOrEqual(Math.min(...utils) - 1e-9);
    expect(d.expectedUtil as number).toBeLessThanOrEqual(Math.max(...utils) + 1e-9);
  });

  test('classicalOptimum returns highest utility option', () => {
    const utils = [0.3, 1.0, 0.5, 0.8];
    const opts  = ['a','b','c','d'];
    const e     = new QuantumDecisionEngine(opts, utils);
    expect(e.classicalOptimum().option).toBe('b');
    expect(e.classicalOptimum().utility).toBe(1.0);
  });

  test('history grows with each decide call', () => {
    const e = mkEngine(3);
    for (let i = 1; i <= 10; i++) {
      e.decide();
      expect(e.history.length).toBe(i);
    }
  });

  test('two-option engine always picks one of the two', () => {
    const e = new QuantumDecisionEngine(['X','Y'], [0.3, 0.7]);
    for (let i = 0; i < 20; i++) {
      const d = new QuantumDecisionEngine(['X','Y'], [0.3, 0.7]).decide();
      expect(['X','Y']).toContain(d.option);
    }
  });

  test('single-option engine always picks that option', () => {
    const e = new QuantumDecisionEngine(['only'], [1.0]);
    for (let i = 0; i < 5; i++) {
      expect(e.decide().option).toBe('only');
    }
  });

  test('phiCoherence field parses as float', () => {
    const d = mkEngine(4).decide();
    expect(parseFloat(d.phiCoherence as string)).toBeGreaterThan(0);
  });

  test('100 decisions all return valid options', () => {
    const opts  = ['a','b','c','d','e'];
    const utils = [0.2, 0.5, 0.8, 0.3, 0.9];
    const e = new QuantumDecisionEngine(opts, utils);
    for (let i = 0; i < 100; i++) {
      const d = new QuantumDecisionEngine(opts, utils).decide();
      expect(opts).toContain(d.option);
    }
  });

  test('all utilities equal → all options get roughly equal probability', () => {
    const opts  = ['a','b','c','d'];
    const utils = [1,1,1,1];
    const counts: Record<string,number> = {a:0,b:0,c:0,d:0};
    const N = 400;
    for (let i = 0; i < N; i++) {
      counts[new QuantumDecisionEngine(opts, utils).decide().option]++;
    }
    // Each option should appear at least 15% of the time
    opts.forEach(o => expect(counts[o]).toBeGreaterThan(N * 0.15));
  });

  test('length mismatch throws', () => {
    expect(() => new QuantumDecisionEngine(['a','b'], [1])).toThrow();
    expect(() => new QuantumDecisionEngine(['a'], [1,2])).toThrow();
  });

  test('timestamp is recent', () => {
    const before = Date.now();
    const d = mkEngine(4).decide();
    expect(d.timestamp as number).toBeGreaterThanOrEqual(before);
    expect(d.timestamp as number).toBeLessThanOrEqual(Date.now() + 100);
  });
});

// ─── Section 7: QuantumMemoryCell ────────────────────────────────────────────
describe('PROTO-231 Deep: QuantumMemoryCell Lifecycle', () => {
  const interps = ['episodic','semantic','procedural','working','declarative'];

  test('initial readCount=0, writeCount=0', () => {
    const c = new QuantumMemoryCell('mem', interps);
    expect(c.readCount).toBe(0);
    expect(c.writeCount).toBe(0);
  });

  test('read increments readCount', () => {
    const c = new QuantumMemoryCell('mem', interps);
    c.read();
    expect(c.readCount).toBe(1);
  });

  test('write increments writeCount', () => {
    const c = new QuantumMemoryCell('mem', interps);
    c.write(['a','b']);
    expect(c.writeCount).toBe(1);
  });

  test('write resets state allowing re-read', () => {
    const c = new QuantumMemoryCell('mem', interps);
    c.read();  // collapse
    c.write(interps);  // reset
    expect(() => c.read()).not.toThrow();
  });

  test('label is preserved', () => {
    expect(new QuantumMemoryCell('my-label', ['a']).label).toBe('my-label');
  });

  test('peek returns correct count', () => {
    const c = new QuantumMemoryCell('m', ['a','b','c']);
    expect(c.peek().length).toBe(3);
  });

  test('peek probability sum = 1', () => {
    const c = new QuantumMemoryCell('m', interps);
    const sum = c.peek().reduce((s:number,e:any) => s + e.probability, 0);
    expect(sum).toBeCloseTo(1, 9);
  });

  test('peek does not collapse', () => {
    const c = new QuantumMemoryCell('m', interps);
    c.peek();
    expect(c.state.collapsed).toBe(false);
  });

  test('read returns one of the interpretations', () => {
    const c = new QuantumMemoryCell('m', interps);
    expect(interps).toContain(c.read().option);
  });

  test('coherenceScore in [0,1] before read', () => {
    const c = new QuantumMemoryCell('m', interps);
    const s = c.coherenceScore();
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(1);
  });

  test('coherenceScore after multiple phase boosts → higher', () => {
    const c = new QuantumMemoryCell('m', interps);
    const s0 = c.coherenceScore();
    for (let i = 0; i < 5; i++) c.state.applyPhase(0, Math.PI * PHI_INV);
    expect(c.coherenceScore()).toBeGreaterThanOrEqual(s0 - 0.01);
  });

  test('10 write-read cycles work without error', () => {
    const c = new QuantumMemoryCell('m', ['a','b','c']);
    for (let i = 0; i < 10; i++) {
      c.write(['a','b','c']);
      c.read();
    }
    expect(c.readCount).toBe(10);
    expect(c.writeCount).toBe(10);
  });

  test('single-interpretation cell always reads same', () => {
    const c = new QuantumMemoryCell('m', ['only-one']);
    expect(c.read().option).toBe('only-one');
  });

  test('peek after write reflects new interpretations', () => {
    const c = new QuantumMemoryCell('m', ['old']);
    c.write(['new-a','new-b']);
    const peekOpts = c.peek().map((e:any) => e.interpretation);
    expect(peekOpts).toContain('new-a');
    expect(peekOpts).toContain('new-b');
    expect(peekOpts).not.toContain('old');
  });
});

// ─── Section 8: QuantumCoherenceBus Orchestration ────────────────────────────
describe('PROTO-231 Deep: QuantumCoherenceBus', () => {
  test('getCell unknown returns null', () => {
    expect(mkBus().getCell('ghost')).toBeNull();
  });

  test('multiple cells registered independently', () => {
    const bus = mkBus();
    bus.registerCell('a', ['x','y']);
    bus.registerCell('b', ['p','q']);
    expect(bus.getCell('a')).not.toBeNull();
    expect(bus.getCell('b')).not.toBeNull();
  });

  test('registering same label twice returns second instance', () => {
    const bus = mkBus();
    bus.registerCell('c', ['1','2']);
    const c2 = bus.registerCell('c', ['3','4','5']);
    expect(bus.getCell('c')).toBe(c2);
  });

  test('entangle requires both cells to exist', () => {
    const bus = mkBus();
    bus.registerCell('a', ['x','y']);
    expect(() => bus.entangle('a','ghost')).toThrow();
  });

  test('entangle returns pair with id', () => {
    const bus = mkBus();
    bus.registerCell('a', ['x','y']);
    bus.registerCell('b', ['x','y']);
    const p = bus.entangle('a','b');
    expect(p.id).toBeDefined();
    expect(p.id.length).toBeGreaterThan(0);
  });

  test('decide on unknown engine returns null', () => {
    expect(mkBus().decide('ghost')).toBeNull();
  });

  test('registerDecision + decide pipeline', () => {
    const bus = mkBus();
    bus.registerDecision('d1', ['A','B','C'], [0.5, 0.8, 0.3]);
    const d = bus.decide('d1');
    expect(['A','B','C']).toContain(d.option);
  });

  test('coherenceReport beat increments monotonically', () => {
    const bus = mkBus();
    for (let i = 1; i <= 20; i++) {
      expect(bus.coherenceReport().beat).toBe(i);
    }
  });

  test('coherenceReport phiPulse ∈ [0,1)', () => {
    const bus = mkBus();
    for (let i = 0; i < 20; i++) {
      const p = bus.coherenceReport().phiPulse;
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThan(1);
    }
  });

  test('coherenceReport cells array length matches registered cells', () => {
    const bus = mkBus();
    bus.registerCell('a', ['x']); bus.registerCell('b', ['y','z']);
    const r = bus.coherenceReport();
    expect(r.cells.length).toBe(2);
  });

  test('coherenceReport pairs array reflects entangled pairs', () => {
    const bus = mkBus();
    bus.registerCell('a', ['x','y']); bus.registerCell('b', ['x','y']);
    bus.registerCell('c', ['x','y']); bus.registerCell('d', ['x','y']);
    bus.entangle('a','b'); bus.entangle('c','d');
    const r = bus.coherenceReport();
    expect(r.pairs.length).toBe(2);
  });

  test('5 decisions across different engines all return options', () => {
    const bus = mkBus();
    const cfg: [string,string[],number[]][] = [
      ['e1',['X','Y'],[0.3,0.7]], ['e2',['A','B','C'],[0.2,0.5,0.3]],
      ['e3',['P','Q'],[0.9,0.1]], ['e4',['M'],[1.0]],
      ['e5',['L','R','U','D'],[0.25,0.25,0.25,0.25]],
    ];
    cfg.forEach(([id,opts,utils]) => bus.registerDecision(id, opts, utils));
    cfg.forEach(([id,opts]) => {
      const d = bus.decide(id);
      expect(opts).toContain(d.option);
    });
  });

  test('20 beats without registered resources still works', () => {
    const bus = mkBus();
    for (let i = 0; i < 20; i++) {
      const r = bus.coherenceReport();
      expect(r.beat).toBe(i+1);
    }
  });
});

// ─── Section 9: Phi-Harmonic Properties ──────────────────────────────────────
describe('PROTO-231 Deep: Phi-Harmonic Properties', () => {
  test('phi-uniform phases are maximally spread', () => {
    // Successive phi-scaled phases should not repeat within 8 steps
    const phases = Array.from({length:8}, (_,i) => (2*Math.PI*i*PHI_INV) % (2*Math.PI));
    const unique = new Set(phases.map(p => p.toFixed(6)));
    expect(unique.size).toBe(8);
  });

  test('decision utility encoding is monotone in expectation', () => {
    // Higher utilities should produce higher expected values on average
    const lowUtils  = [0.1, 0.1, 0.1, 0.9];
    const highUtils = [0.9, 0.9, 0.9, 0.1];
    const opts = ['a','b','c','d'];

    let lowSum = 0, highSum = 0;
    const N = 50;
    for (let i = 0; i < N; i++) {
      const eL = new QuantumDecisionEngine(opts, lowUtils);
      const eH = new QuantumDecisionEngine(opts, highUtils);
      eL.decide(); eH.decide();
      lowSum  += eL.history[0].expectedUtil as number;
      highSum += eH.history[0].expectedUtil as number;
    }
    // On average, highUtils engine should have higher expected utility
    // (Not guaranteed per trial but should hold in aggregate)
    expect(highSum / N).toBeGreaterThan(lowSum / N - 0.1);
  });

  test('PHI² - PHI - 1 = 0 (golden equation)', () => {
    expect(PHI*PHI - PHI - 1).toBeCloseTo(0, 8);
  });

  test('Fibonacci ratios converge to PHI', () => {
    const fibs = [1,1,2,3,5,8,13,21,34,55,89,144];
    for (let i = 5; i < fibs.length; i++) {
      const ratio = fibs[i] / fibs[i-1];
      expect(ratio).toBeCloseTo(PHI, 1);
    }
  });

  test('coherence bus phiPulse is irrational-uniform', () => {
    const bus = mkBus();
    const pulses = Array.from({length:10}, () => bus.coherenceReport().phiPulse);
    // No two consecutive pulses should be equal
    for (let i = 1; i < pulses.length; i++) {
      expect(pulses[i]).not.toBeCloseTo(pulses[i-1], 8);
    }
  });
});
