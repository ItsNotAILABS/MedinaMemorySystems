/**
 * PROTO-232: Temporal Reasoning Protocol
 * ============================================================
 * Phi-scaled time perception, causal inference, and temporal
 * abstraction for Modular Memory Intelligence Multi-Systems (MMIMS-X).
 *
 * Implements:
 *  - 8 phi-scaled time scales (100ms → ~3s)
 *  - Temporal event representation with causal links
 *  - Memory buffer with phi-decay
 *  - Causal inference engine
 *  - Temporal abstraction / summarisation
 *
 * Charter: PROTO-232
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
 */

'use strict';

// ─── Constants ────────────────────────────────────────────────────────────────
const PHI      = (1 + Math.sqrt(5)) / 2;
const PHI_INV  = 1 / PHI;

/**
 * 8 phi-scaled time scales rooted at 100ms.
 * Each scale = previous × φ.
 *  τ₀ ≈  100ms
 *  τ₁ ≈  162ms
 *  τ₂ ≈  262ms
 *  τ₃ ≈  424ms
 *  τ₄ ≈  687ms
 *  τ₅ ≈ 1112ms
 *  τ₆ ≈ 1800ms
 *  τ₇ ≈ 2912ms
 */
const BASE_MS = 100;
const TIME_SCALES = Array.from({ length: 8 }, (_, k) => ({
  index:   k,
  name:    `τ${k}`,
  ms:      BASE_MS * Math.pow(PHI, k),
  label:   ['flash', 'micro', 'pulse', 'breath', 'beat', 'wave', 'cycle', 'epoch'][k],
}));

// ─── Temporal Event ───────────────────────────────────────────────────────────
class TemporalEvent {
  /**
   * @param {string} id
   * @param {string} type    — semantic category
   * @param {*}      payload — arbitrary content
   * @param {number} [timestamp] — epoch ms (default: now)
   */
  constructor(id, type, payload, timestamp = Date.now()) {
    this.id        = id;
    this.type      = type;
    this.payload   = payload;
    this.timestamp = timestamp;
    this.causes    = [];   // ids of events that caused this
    this.effects   = [];   // ids of events caused by this
    this.scaleIdx  = this._inferScale();
    this.weight    = 1.0;  // phi-decay reduces this over time
  }

  _inferScale() {
    // Assign scale based on how recent (stub — callers may override)
    return 0;
  }

  addCause(eventId)  { if (!this.causes.includes(eventId))  this.causes.push(eventId); }
  addEffect(eventId) { if (!this.effects.includes(eventId)) this.effects.push(eventId); }

  /** Current phi-decayed weight given current time */
  decayedWeight(nowMs = Date.now(), halfLifeMs = TIME_SCALES[4].ms) {
    const age     = nowMs - this.timestamp;
    const lambda  = Math.log(2) / halfLifeMs * PHI_INV;  // phi-slows decay
    return this.weight * Math.exp(-lambda * age);
  }

  toSummary() {
    return {
      id:        this.id,
      type:      this.type,
      scale:     TIME_SCALES[this.scaleIdx]?.label ?? 'unknown',
      causes:    this.causes.length,
      effects:   this.effects.length,
      timestamp: this.timestamp,
    };
  }
}

// ─── Phi-Decay Memory Buffer ──────────────────────────────────────────────────
class PhiDecayBuffer {
  /**
   * @param {number} capacity — maximum events before eviction
   * @param {number} [halfLifeMs] — phi-scaled half-life for weight decay
   */
  constructor(capacity = 144, halfLifeMs = TIME_SCALES[4].ms) {
    this.capacity   = capacity;  // 144 = Fibonacci F₁₂
    this.halfLifeMs = halfLifeMs;
    this.events     = new Map(); // id → TemporalEvent
    this.insertOrder= [];        // ordered ids
  }

  add(event) {
    if (this.events.has(event.id)) { this._refresh(event.id); return; }
    if (this.events.size >= this.capacity) this._evict();
    this.events.set(event.id, event);
    this.insertOrder.push(event.id);
  }

  _refresh(id) {
    const idx = this.insertOrder.indexOf(id);
    if (idx !== -1) {
      this.insertOrder.splice(idx, 1);
      this.insertOrder.push(id);
    }
  }

  _evict() {
    // Evict the event with the lowest phi-decayed weight
    const nowMs = Date.now();
    let minId   = null, minW = Infinity;
    for (const [id, ev] of this.events) {
      const w = ev.decayedWeight(nowMs, this.halfLifeMs);
      if (w < minW) { minW = w; minId = id; }
    }
    if (minId) {
      this.events.delete(minId);
      this.insertOrder = this.insertOrder.filter(i => i !== minId);
    }
  }

  get(id)    { return this.events.get(id) ?? null; }
  size()     { return this.events.size; }

  /** Return all events sorted by decayed weight descending */
  ranked(nowMs = Date.now()) {
    return [...this.events.values()]
      .map(ev => ({ event: ev, weight: ev.decayedWeight(nowMs, this.halfLifeMs) }))
      .sort((a, b) => b.weight - a.weight);
  }

  /** Evict all events whose decayed weight < threshold */
  prune(threshold = 0.01, nowMs = Date.now()) {
    let pruned = 0;
    for (const [id, ev] of this.events) {
      if (ev.decayedWeight(nowMs, this.halfLifeMs) < threshold) {
        this.events.delete(id);
        pruned++;
      }
    }
    this.insertOrder = this.insertOrder.filter(id => this.events.has(id));
    return pruned;
  }
}

// ─── Causal Graph ─────────────────────────────────────────────────────────────
class CausalGraph {
  constructor() {
    this.nodes = new Map();  // id → { type, strength, inEdges, outEdges }
  }

  /**
   * Register a causal link: cause → effect with a strength value in [0,1].
   */
  link(causeId, effectId, strength = PHI_INV) {
    this._ensureNode(causeId);
    this._ensureNode(effectId);
    this.nodes.get(causeId).outEdges.set(effectId, strength);
    this.nodes.get(effectId).inEdges.set(causeId, strength);
  }

  _ensureNode(id) {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, { id, inEdges: new Map(), outEdges: new Map() });
    }
  }

  /**
   * Predict likely effects of an event using BFS over the causal graph,
   * attenuating strength by φ⁻¹ at each hop.
   */
  predictEffects(causeId, maxDepth = 3) {
    const visited = new Map();  // effectId → accumulated strength
    const queue   = [{ id: causeId, strength: 1.0, depth: 0 }];
    while (queue.length) {
      const { id, strength, depth } = queue.shift();
      if (depth > maxDepth) continue;
      const node = this.nodes.get(id);
      if (!node) continue;
      for (const [effId, edgeStr] of node.outEdges) {
        const cumStr = strength * edgeStr * PHI_INV;
        if (!visited.has(effId) || visited.get(effId) < cumStr) {
          visited.set(effId, cumStr);
          queue.push({ id: effId, strength: cumStr, depth: depth + 1 });
        }
      }
    }
    visited.delete(causeId);
    return [...visited.entries()]
      .map(([id, str]) => ({ id, strength: str }))
      .sort((a, b) => b.strength - a.strength);
  }

  /**
   * Infer root causes of an observed effect (reverse traversal).
   */
  inferCauses(effectId, maxDepth = 3) {
    const visited = new Map();
    const queue   = [{ id: effectId, strength: 1.0, depth: 0 }];
    while (queue.length) {
      const { id, strength, depth } = queue.shift();
      if (depth > maxDepth) continue;
      const node = this.nodes.get(id);
      if (!node) continue;
      for (const [causeId, edgeStr] of node.inEdges) {
        const cumStr = strength * edgeStr * PHI_INV;
        if (!visited.has(causeId) || visited.get(causeId) < cumStr) {
          visited.set(causeId, cumStr);
          queue.push({ id: causeId, strength: cumStr, depth: depth + 1 });
        }
      }
    }
    visited.delete(effectId);
    return [...visited.entries()]
      .map(([id, str]) => ({ id, strength: str }))
      .sort((a, b) => b.strength - a.strength);
  }

  nodeCount()  { return this.nodes.size; }
  edgeCount()  { return [...this.nodes.values()].reduce((s, n) => s + n.outEdges.size, 0); }
}

// ─── Temporal Abstractor ──────────────────────────────────────────────────────
class TemporalAbstractor {
  /**
   * Summarises a sequence of temporal events at a given phi-time-scale.
   * Events within the same time window are merged into an abstract episode.
   */
  summarise(events, scaleIndex = 4) {
    const windowMs = TIME_SCALES[scaleIndex]?.ms ?? TIME_SCALES[4].ms;
    if (!events.length) return [];

    const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
    const episodes = [];
    let bucket = [];
    let bucketStart = sorted[0].timestamp;

    for (const ev of sorted) {
      if (ev.timestamp - bucketStart <= windowMs) {
        bucket.push(ev);
      } else {
        episodes.push(this._mergeEpisode(bucket, scaleIndex));
        bucket = [ev];
        bucketStart = ev.timestamp;
      }
    }
    if (bucket.length) episodes.push(this._mergeEpisode(bucket, scaleIndex));
    return episodes;
  }

  _mergeEpisode(events, scaleIndex) {
    const types = [...new Set(events.map(e => e.type))];
    return {
      scaleLabel:   TIME_SCALES[scaleIndex]?.label ?? 'unknown',
      eventCount:   events.length,
      types,
      startMs:      events[0].timestamp,
      endMs:        events[events.length - 1].timestamp,
      durationMs:   events[events.length - 1].timestamp - events[0].timestamp,
      causes:       [...new Set(events.flatMap(e => e.causes))],
      effects:      [...new Set(events.flatMap(e => e.effects))],
      phiWeight:    events.length / (TIME_SCALES[scaleIndex]?.ms ?? 1) * PHI,
    };
  }
}

// ─── MMIMS-X Temporal Reasoning Engine ───────────────────────────────────────
class TemporalReasoningEngine {
  constructor(bufferCapacity = 144) {
    this.buffer     = new PhiDecayBuffer(bufferCapacity);
    this.causal     = new CausalGraph();
    this.abstractor = new TemporalAbstractor();
    this.eventCounter = 0;
    this.timeScales = TIME_SCALES;
  }

  /** Ingest a new event into the engine */
  ingest(type, payload, causeIds = []) {
    const id  = `EVT-${++this.eventCounter}-${Date.now()}`;
    const ev  = new TemporalEvent(id, type, payload);

    causeIds.forEach(cid => {
      ev.addCause(cid);
      this.causal.link(cid, id, PHI_INV);
      const cause = this.buffer.get(cid);
      if (cause) cause.addEffect(id);
    });

    this.buffer.add(ev);
    this.causal._ensureNode(id);
    return ev;
  }

  /** Link two event IDs causally post-hoc */
  assertCausation(causeId, effectId, strength = PHI_INV) {
    this.causal.link(causeId, effectId, strength);
    const cause  = this.buffer.get(causeId);
    const effect = this.buffer.get(effectId);
    if (cause)  cause.addEffect(effectId);
    if (effect) effect.addCause(causeId);
  }

  predictEffects(eventId, maxDepth = 3)  { return this.causal.predictEffects(eventId, maxDepth); }
  inferCauses(eventId, maxDepth = 3)     { return this.causal.inferCauses(eventId, maxDepth); }

  /** Summarise buffered events at a phi-time-scale */
  summarise(scaleIndex = 4) {
    const events = [...this.buffer.events.values()];
    return this.abstractor.summarise(events, scaleIndex);
  }

  prune(threshold = 0.01) { return this.buffer.prune(threshold); }

  status() {
    return {
      buffered:   this.buffer.size(),
      causalNodes: this.causal.nodeCount(),
      causalEdges: this.causal.edgeCount(),
      timeScales:  this.timeScales.map(s => ({ ...s, ms: +s.ms.toFixed(1) })),
    };
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────
module.exports = {
  PHI,
  PHI_INV,
  TIME_SCALES,
  TemporalEvent,
  PhiDecayBuffer,
  CausalGraph,
  TemporalAbstractor,
  TemporalReasoningEngine,
};
