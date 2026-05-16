/**
 * PROTO-233: Swarm Intelligence Protocol
 * ============================================================
 * Particle Swarm Optimization, Ant Colony pheromone trails, and
 * Swarm Consensus for Modular Memory Intelligence Multi-Systems (MMIMS-X).
 *
 * Implements:
 *  - PSO with phi-weighted inertia / cognitive / social coefficients
 *  - Pheromone trail system for ACO-style routing
 *  - Swarm consensus over discrete options
 *  - Integration of cognitive, social, and inertia vectors
 *
 * Charter: PROTO-233
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
 */

'use strict';

// ─── Constants ────────────────────────────────────────────────────────────────
const PHI       = (1 + Math.sqrt(5)) / 2;   // 1.618033…
const PHI_INV   = 1 / PHI;                  // 0.618033…
const PHI_SQ    = PHI * PHI;                // 2.618033…

/**
 * Phi-weighted PSO coefficients.
 *   w  (inertia)  = φ⁻²  ≈ 0.382
 *   c₁ (cognitive)= φ⁻¹  ≈ 0.618
 *   c₂ (social)   = φ     ≈ 1.618
 *
 * Sum w + c₁ + c₂ ≈ 2.618 = φ² — a meaningful phi relationship.
 */
const PSO_W  = 1 / PHI_SQ;   // inertia weight ≈ 0.382
const PSO_C1 = PHI_INV;      // cognitive coefficient ≈ 0.618
const PSO_C2 = PHI;           // social coefficient ≈ 1.618

// Pheromone evaporation rate (phi-inverse per step)
const EVAPORATION = PHI_INV * 0.1;   // ≈ 0.0618 per step

// ─── Utilities ────────────────────────────────────────────────────────────────
function randUniform()           { return Math.random(); }
function clamp(v, lo, hi)        { return Math.max(lo, Math.min(hi, v)); }
function vecAdd(a, b)            { return a.map((x, i) => x + b[i]); }
function vecSub(a, b)            { return a.map((x, i) => x - b[i]); }
function vecScale(a, s)          { return a.map(x => x * s); }
function vecDot(a, b)            { return a.reduce((s, x, i) => s + x * b[i], 0); }
function randVec(n)              { return Array.from({ length: n }, randUniform); }
function vecClamp(v, lo, hi)     { return v.map(x => clamp(x, lo, hi)); }

// ─── Particle (PSO) ───────────────────────────────────────────────────────────
class Particle {
  /**
   * @param {number[]} position — initial position in search space
   * @param {number[]} velocity — initial velocity
   * @param {Function} fitnessFn — (position) => number (higher = better)
   */
  constructor(position, velocity, fitnessFn) {
    this.position   = [...position];
    this.velocity   = [...velocity];
    this.fitnessFn  = fitnessFn;
    this.bestPos    = [...position];
    this.bestFit    = fitnessFn(position);
    this.id         = `P-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    this.dim        = position.length;
  }

  /**
   * Update velocity and position with phi-weighted PSO equations.
   *   v_i(t+1) = w·v_i(t) + c₁·r₁·(pBest - x) + c₂·r₂·(gBest - x)
   *   x_i(t+1) = x_i(t) + v_i(t+1)
   */
  step(globalBest, bounds) {
    const r1  = randUniform();
    const r2  = randUniform();
    const cog = vecScale(vecSub(this.bestPos,   this.position), PSO_C1 * r1);
    const soc = vecScale(vecSub(globalBest,      this.position), PSO_C2 * r2);
    const ine = vecScale(this.velocity, PSO_W);

    this.velocity = vecAdd(vecAdd(ine, cog), soc);

    // Bound velocity to [±range×φ] per dimension
    if (bounds) {
      this.velocity = this.velocity.map((v, i) => {
        const span = (bounds[i][1] - bounds[i][0]) * PHI_INV;
        return clamp(v, -span, span);
      });
    }

    this.position = vecAdd(this.position, this.velocity);
    if (bounds) {
      this.position = this.position.map((x, i) => clamp(x, bounds[i][0], bounds[i][1]));
    }

    const fit = this.fitnessFn(this.position);
    if (fit > this.bestFit) {
      this.bestFit = fit;
      this.bestPos = [...this.position];
    }
    return fit;
  }
}

// ─── Particle Swarm Optimizer ─────────────────────────────────────────────────
class ParticleSwarmOptimizer {
  /**
   * @param {Function}   fitnessFn  — (pos: number[]) => number
   * @param {number}     dim        — dimensionality
   * @param {number[][]} [bounds]   — [[lo,hi], ...] per dimension
   * @param {number}     [nParticles] — default 34 (Fibonacci)
   */
  constructor(fitnessFn, dim, bounds = null, nParticles = 34) {
    this.fitnessFn  = fitnessFn;
    this.dim        = dim;
    this.bounds     = bounds;
    this.nParticles = nParticles;
    this.particles  = [];
    this.globalBest = null;
    this.globalFit  = -Infinity;
    this.iteration  = 0;
    this.history    = [];

    this._init();
  }

  _init() {
    for (let i = 0; i < this.nParticles; i++) {
      const pos = this.bounds
        ? this.bounds.map(([lo, hi]) => lo + randUniform() * (hi - lo))
        : randVec(this.dim);
      const vel = this.bounds
        ? this.bounds.map(([lo, hi]) => (randUniform() - 0.5) * (hi - lo) * PHI_INV)
        : Array.from({ length: this.dim }, () => (randUniform() - 0.5) * PHI_INV);
      const p = new Particle(pos, vel, this.fitnessFn);
      this.particles.push(p);
      if (p.bestFit > this.globalFit) {
        this.globalFit  = p.bestFit;
        this.globalBest = [...p.bestPos];
      }
    }
  }

  /** Run one iteration */
  step() {
    this.iteration++;
    for (const p of this.particles) {
      const fit = p.step(this.globalBest, this.bounds);
      if (fit > this.globalFit) {
        this.globalFit  = fit;
        this.globalBest = [...p.position];
      }
    }
    this.history.push({ iter: this.iteration, fitness: this.globalFit });
    return { iteration: this.iteration, best: this.globalBest, fitness: this.globalFit };
  }

  /** Run n iterations */
  run(n) {
    let last;
    for (let i = 0; i < n; i++) last = this.step();
    return last;
  }
}

// ─── Pheromone Trail System (ACO) ─────────────────────────────────────────────
class PheromoneTrailSystem {
  /**
   * Directed graph of pheromone intensities between nodes.
   * @param {number} [initialLevel] — initial pheromone on all trails
   */
  constructor(initialLevel = PHI_INV) {
    this.trails     = new Map();  // `${from}:${to}` → level
    this.initial    = initialLevel;
    this.stepCount  = 0;
  }

  _key(from, to) { return `${from}:${to}`; }

  getLevel(from, to) {
    return this.trails.get(this._key(from, to)) ?? this.initial;
  }

  /** Deposit pheromone proportional to solution quality Q */
  deposit(path, quality = 1.0) {
    const delta = (quality * PHI) / (path.length || 1);
    for (let i = 0; i < path.length - 1; i++) {
      const key = this._key(path[i], path[i + 1]);
      this.trails.set(key, (this.trails.get(key) ?? this.initial) + delta);
    }
  }

  /** Evaporate all trails by phi-inverse factor */
  evaporate() {
    this.stepCount++;
    for (const [key, level] of this.trails) {
      const next = level * (1 - EVAPORATION);
      if (next < 1e-6) this.trails.delete(key);
      else             this.trails.set(key, next);
    }
  }

  /**
   * Probabilistically choose next node from current, given candidate list.
   * P(j) ∝ pheromone(i→j)^α × heuristic(j)^β   (α=φ, β=φ⁻¹)
   */
  chooseNext(from, candidates, heuristicFn) {
    const alpha = PHI;
    const beta  = PHI_INV;
    const weights = candidates.map(c => {
      const ph = Math.pow(this.getLevel(from, c), alpha);
      const he = Math.pow(heuristicFn(from, c), beta);
      return ph * he;
    });
    const total = weights.reduce((s, w) => s + w, 0);
    let r = randUniform() * total;
    for (let i = 0; i < candidates.length; i++) {
      r -= weights[i];
      if (r <= 0) return candidates[i];
    }
    return candidates[candidates.length - 1];
  }

  stats() {
    const levels = [...this.trails.values()];
    return {
      trails:    this.trails.size,
      evapSteps: this.stepCount,
      maxLevel:  levels.length ? Math.max(...levels) : 0,
      minLevel:  levels.length ? Math.min(...levels) : 0,
      avgLevel:  levels.length ? levels.reduce((s,v) => s+v, 0) / levels.length : 0,
    };
  }
}

// ─── Swarm Consensus ──────────────────────────────────────────────────────────
/**
 * Collective decision-making over a discrete option set.
 * Each agent votes; votes are phi-weighted by agent confidence.
 */
class SwarmConsensus {
  /**
   * @param {string[]} options — discrete options to vote on
   */
  constructor(options) {
    this.options = options;
    this.votes   = new Map();  // agentId → { option, confidence }
    this.round   = 0;
  }

  /**
   * Cast / update vote.
   * @param {string} agentId
   * @param {string} option     — must be in this.options
   * @param {number} confidence — [0, 1]; phi-weighted internally
   */
  vote(agentId, option, confidence = PHI_INV) {
    if (!this.options.includes(option)) throw new Error(`Unknown option: ${option}`);
    this.votes.set(agentId, { option, confidence: clamp(confidence, 0, 1) });
  }

  /**
   * Tally votes with phi-weighting.
   * Returns consensus option + certainty score in [0,1].
   */
  tally() {
    this.round++;
    const tally = {};
    this.options.forEach(o => (tally[o] = 0));

    for (const { option, confidence } of this.votes.values()) {
      tally[option] += confidence * PHI;  // phi-amplified confidence
    }

    const total = Object.values(tally).reduce((s, v) => s + v, 0) || 1;
    const ranked = Object.entries(tally)
      .map(([opt, score]) => ({ option: opt, score, proportion: score / total }))
      .sort((a, b) => b.score - a.score);

    const winner = ranked[0];
    // Certainty: how much the winner dominates (proportional to phi ratio with runner-up)
    const runnerUp = ranked[1]?.score ?? 0;
    const certainty = runnerUp > 0 ? Math.min((winner.score / runnerUp) * PHI_INV, 1) : 1;

    return {
      consensus:  winner.option,
      certainty,
      round:      this.round,
      agentCount: this.votes.size,
      ranking:    ranked,
    };
  }

  /** Reset all votes (start new round) */
  reset() {
    this.votes.clear();
  }
}

// ─── MMIMS-X Swarm Intelligence Bus ───────────────────────────────────────────
/**
 * Unified swarm intelligence layer for MMIMS-X.
 * Integrates PSO optimizers, pheromone trails, and consensus modules.
 */
class SwarmIntelligenceBus {
  constructor() {
    this.optimizers  = new Map();   // id → ParticleSwarmOptimizer
    this.pheromones  = new Map();   // id → PheromoneTrailSystem
    this.consensuses = new Map();   // id → SwarmConsensus
    this.beat        = 0;
  }

  // PSO
  registerOptimizer(id, fitnessFn, dim, bounds = null, nParticles = 34) {
    const pso = new ParticleSwarmOptimizer(fitnessFn, dim, bounds, nParticles);
    this.optimizers.set(id, pso);
    return pso;
  }
  optimize(id, iterations = 55) {
    const pso = this.optimizers.get(id);
    return pso ? pso.run(iterations) : null;
  }

  // ACO
  registerPheromoneTrail(id, initialLevel = PHI_INV) {
    const trail = new PheromoneTrailSystem(initialLevel);
    this.pheromones.set(id, trail);
    return trail;
  }
  getPheromone(id) { return this.pheromones.get(id) ?? null; }

  // Consensus
  registerConsensus(id, options) {
    const c = new SwarmConsensus(options);
    this.consensuses.set(id, c);
    return c;
  }
  vote(id, agentId, option, confidence)  {
    this.consensuses.get(id)?.vote(agentId, option, confidence);
  }
  tally(id) { return this.consensuses.get(id)?.tally() ?? null; }

  /** Global heartbeat: evaporate all pheromone trails */
  tick() {
    this.beat++;
    for (const trail of this.pheromones.values()) trail.evaporate();
    return { beat: this.beat, phiPulse: (this.beat * PHI_INV) % 1 };
  }

  report() {
    return {
      beat:      this.beat,
      optimizers: this.optimizers.size,
      pheromones: this.pheromones.size,
      consensuses: this.consensuses.size,
    };
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────
module.exports = {
  PHI,
  PHI_INV,
  PHI_SQ,
  PSO_W,
  PSO_C1,
  PSO_C2,
  EVAPORATION,
  Particle,
  ParticleSwarmOptimizer,
  PheromoneTrailSystem,
  SwarmConsensus,
  SwarmIntelligenceBus,
};
