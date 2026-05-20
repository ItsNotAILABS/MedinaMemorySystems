/**
 * PROTO-231: Quantum Coherence Protocol
 * ============================================================
 * Quantum-inspired cognitive processing for Modular Memory
 * Intelligence Multi-Systems (MMIMS-X).
 *
 * Implements:
 *  - Complex amplitudes & superposition over cognitive options
 *  - Entanglement between cognitive state pairs
 *  - Measurement / wavefunction collapse
 *  - Phi-weighted quantum decision-making
 *
 * Charter: PROTO-231
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
 */

'use strict';

// ─── Constants ────────────────────────────────────────────────────────────────
const PHI        = (1 + Math.sqrt(5)) / 2;   // 1.618033…
const PHI_INV    = 1 / PHI;                   // 0.618033…
const PHI_SQ     = PHI * PHI;                 // 2.618033…
const PLANCK_H   = 6.62607015e-34;            // symbolic — sets scale
const HBAR       = PLANCK_H / (2 * Math.PI);

// ─── Complex Number ───────────────────────────────────────────────────────────
class Complex {
  constructor(re, im = 0) {
    this.re = re;
    this.im = im;
  }

  add(other)  { return new Complex(this.re + other.re, this.im + other.im); }
  sub(other)  { return new Complex(this.re - other.re, this.im - other.im); }
  mul(other)  {
    return new Complex(
      this.re * other.re - this.im * other.im,
      this.re * other.im + this.im * other.re,
    );
  }
  scale(s)    { return new Complex(this.re * s, this.im * s); }
  conj()      { return new Complex(this.re, -this.im); }
  norm2()     { return this.re * this.re + this.im * this.im; }
  norm()      { return Math.sqrt(this.norm2()); }
  /** e^(iθ) */
  static phase(theta) { return new Complex(Math.cos(theta), Math.sin(theta)); }
  toString()  { return `(${this.re.toFixed(4)}+${this.im.toFixed(4)}i)`; }
}

// ─── Quantum State (superposition over N cognitive options) ───────────────────
class QuantumCognitiveState {
  /**
   * @param {string[]} options  — labelled basis states (cognitive options)
   * @param {Complex[]} [amplitudes] — optional initial amplitudes; normalised automatically
   */
  constructor(options, amplitudes = null) {
    if (options.length < 1) throw new Error('Need at least one cognitive option');
    this.options    = options;
    this.n          = options.length;
    this.amplitudes = amplitudes ? this._normalise(amplitudes) : this._uniform();
    this.collapsed  = false;
    this.result     = null;
    this.createdAt  = Date.now();
  }

  // Equal superposition seeded with phi-phase offsets
  _uniform() {
    const amps = this.options.map((_, i) =>
      Complex.phase((2 * Math.PI * i * PHI_INV) % (2 * Math.PI)).scale(1 / Math.sqrt(this.n)),
    );
    return this._normalise(amps);
  }

  _normalise(amps) {
    const total = amps.reduce((s, a) => s + a.norm2(), 0);
    const inv   = 1 / Math.sqrt(total || 1);
    return amps.map(a => a.scale(inv));
  }

  /** Probability of each basis state */
  probabilities() {
    return this.amplitudes.map(a => a.norm2());
  }

  /**
   * Apply a phase rotation to option[i]: α_i → e^(iθ) α_i
   * Used for phi-weighted utility encoding.
   */
  applyPhase(index, theta) {
    if (this.collapsed) throw new Error('State already collapsed');
    const amps = [...this.amplitudes];
    amps[index] = amps[index].mul(Complex.phase(theta));
    this.amplitudes = this._normalise(amps);
    return this;
  }

  /**
   * Measure the state — collapses to one outcome with Born-rule probability.
   * Returns { option, index, probability }.
   */
  measure() {
    if (this.collapsed) return this.result;
    const probs   = this.probabilities();
    const r       = Math.random();
    let cumul     = 0;
    let chosen    = this.n - 1;
    for (let i = 0; i < this.n; i++) {
      cumul += probs[i];
      if (r <= cumul) { chosen = i; break; }
    }
    this.collapsed = true;
    this.result    = { option: this.options[chosen], index: chosen, probability: probs[chosen] };
    return this.result;
  }

  /** Expectation value of a real-valued utility function u(index) */
  expectation(u) {
    return this.probabilities().reduce((s, p, i) => s + p * u(i), 0);
  }
}

// ─── Entanglement ─────────────────────────────────────────────────────────────
class EntangledPair {
  /**
   * Two-qubit Bell-like state over cognitive option pairs (a, b).
   * |Ψ⟩ = cos(α)|0⟩|0⟩ + sin(α)|1⟩|1⟩   (generalised with phi angle)
   */
  constructor(stateA, stateB) {
    this.stateA    = stateA;   // QuantumCognitiveState
    this.stateB    = stateB;
    this.angle     = Math.PI / 4 * PHI_INV;  // phi-weighted entanglement angle
    this.collapsed = false;
    this.id        = `ENT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  /** Measuring A forces an update on B's amplitude profile */
  measureA() {
    if (this.collapsed) return;
    const resultA = this.stateA.measure();
    // Update B: bias its amplitude toward same-index basis state (entanglement correlation)
    const i = resultA.index % this.stateB.n;
    const theta = this.angle * PHI;
    this.stateB.applyPhase(i, theta);
    this.collapsed = true;
    return resultA;
  }

  correlationScore() {
    const probsA = this.stateA.probabilities();
    const probsB = this.stateB.probabilities();
    const minLen = Math.min(probsA.length, probsB.length);
    let score = 0;
    for (let i = 0; i < minLen; i++) score += Math.sqrt(probsA[i] * probsB[i]);
    return score;
  }
}

// ─── Quantum Decision Engine ──────────────────────────────────────────────────
class QuantumDecisionEngine {
  /**
   * @param {string[]} options   — the decision space (cognitive options)
   * @param {number[]} utilities — real utility per option (will be phi-weighted)
   */
  constructor(options, utilities) {
    if (options.length !== utilities.length) throw new Error('options/utilities length mismatch');
    this.options   = options;
    this.utilities = utilities;
    this.history   = [];
  }

  /**
   * Encode utilities as phase rotations: θ_i = u_i × π × φ⁻¹
   * Then measure to get a quantum decision.
   */
  decide() {
    const state = new QuantumCognitiveState(this.options);

    // Phi-weighted phase encoding of utilities
    const maxU = Math.max(...this.utilities, 1e-9);
    this.utilities.forEach((u, i) => {
      const theta = (u / maxU) * Math.PI * PHI_INV;
      state.applyPhase(i, theta);
    });

    const expectedUtil = state.expectation(i => this.utilities[i]);
    const result       = state.measure();

    const decision = {
      ...result,
      utility:      this.utilities[result.index],
      expectedUtil,
      phiCoherence: (result.probability * PHI).toFixed(4),
      timestamp:    Date.now(),
    };
    this.history.push(decision);
    return decision;
  }

  /** Returns the classically optimal option for comparison */
  classicalOptimum() {
    const best = this.utilities.reduce((b, u, i) => u > b.u ? { u, i } : b, { u: -Infinity, i: 0 });
    return { option: this.options[best.i], utility: best.u };
  }
}

// ─── Quantum Memory Cell ──────────────────────────────────────────────────────
/**
 * A single MMIMS-X memory cell that holds a quantum superposition of
 * interpretations. Reading collapses the cell; writing re-initialises it.
 */
class QuantumMemoryCell {
  constructor(label, interpretations) {
    this.label          = label;
    this.state          = new QuantumCognitiveState(interpretations);
    this.writeCount     = 0;
    this.readCount      = 0;
    this.collapseHistory= [];
  }

  write(interpretations, amplitudes = null) {
    this.state      = new QuantumCognitiveState(interpretations, amplitudes);
    this.writeCount++;
  }

  /** Non-destructive peek: returns probability distribution without collapsing */
  peek() {
    return this.state.options.map((opt, i) => ({
      interpretation: opt,
      probability:    this.state.probabilities()[i],
    }));
  }

  /** Destructive read: collapses superposition */
  read() {
    const result = this.state.measure();
    this.readCount++;
    this.collapseHistory.push({ ...result, at: Date.now() });
    return result;
  }

  coherenceScore() {
    const probs = this.state.probabilities();
    // Entropy: lower = more coherent
    const H = probs.reduce((s, p) => s - (p > 0 ? p * Math.log2(p) : 0), 0);
    return Math.max(0, 1 - H / Math.log2(this.state.n));
  }
}

// ─── MMIMS-X Quantum Coherence Bus ────────────────────────────────────────────
/**
 * The Quantum Coherence Bus wires multiple QuantumMemoryCells and
 * EntangledPairs into a unified cognitive substrate for MMIMS-X.
 */
class QuantumCoherenceBus {
  constructor() {
    this.cells    = new Map();   // label → QuantumMemoryCell
    this.pairs    = new Map();   // id    → EntangledPair
    this.engines  = new Map();   // id    → QuantumDecisionEngine
    this.beatCount = 0;
  }

  // Cell management
  registerCell(label, interpretations) {
    const cell = new QuantumMemoryCell(label, interpretations);
    this.cells.set(label, cell);
    return cell;
  }

  getCell(label)    { return this.cells.get(label) ?? null; }

  // Entanglement management
  entangle(labelA, labelB) {
    const cellA = this.cells.get(labelA);
    const cellB = this.cells.get(labelB);
    if (!cellA || !cellB) throw new Error(`Unknown cells: ${labelA}, ${labelB}`);
    const pair = new EntangledPair(cellA.state, cellB.state);
    this.pairs.set(pair.id, pair);
    return pair;
  }

  // Decision engine
  registerDecision(id, options, utilities) {
    const engine = new QuantumDecisionEngine(options, utilities);
    this.engines.set(id, engine);
    return engine;
  }

  decide(id)  { return this.engines.get(id)?.decide() ?? null; }

  // Global coherence report
  coherenceReport() {
    this.beatCount++;
    const cellScores = [...this.cells.entries()].map(([label, cell]) => ({
      label,
      coherence:  cell.coherenceScore(),
      reads:      cell.readCount,
      writes:     cell.writeCount,
    }));
    const pairScores = [...this.pairs.values()].map(p => ({
      id:          p.id,
      correlation: p.correlationScore(),
      collapsed:   p.collapsed,
    }));
    return {
      beat:      this.beatCount,
      cells:     cellScores,
      pairs:     pairScores,
      phiPulse:  (this.beatCount * PHI_INV) % 1,
      timestamp: Date.now(),
    };
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────
module.exports = {
  PHI,
  PHI_INV,
  PHI_SQ,
  Complex,
  QuantumCognitiveState,
  EntangledPair,
  QuantumDecisionEngine,
  QuantumMemoryCell,
  QuantumCoherenceBus,
};
