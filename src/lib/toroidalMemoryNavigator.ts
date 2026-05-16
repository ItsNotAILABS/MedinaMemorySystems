// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 TOROIDAL MEMORY NAVIGATOR 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Full implementation of the toroidal coordinate system for semantic memory
 * navigation, as described in papers/arxiv/TOROIDAL_MEMORY_NAVIGATION.md
 *
 * Each memory lives at a 5-coordinate address on a nested torus:
 *
 *   Memory = (θ, φ, ρ, ring, beat)
 *
 *   θ (theta) — 0°–360°   — position on major semantic cycle
 *   φ (phi)   — 0°–180°   — position on minor semantic dimension
 *   ρ (rho)   — 1–∞       — depth / specificity
 *   ring      — 1–12      — categorical domain (12 rings)
 *   beat      — 0–∞       — temporal version index
 *
 * Navigation operations:
 *   - traverse_theta  — move along the major cycle
 *   - traverse_phi    — move along the minor cycle
 *   - dive            — increase depth (more specific)
 *   - surface         — decrease depth (more general)
 *   - ring_shift      — jump to another categorical ring
 *   - time_travel     — retrieve a specific beat version
 *   - knn             — k-nearest neighbours by toroidal distance
 *
 * Charter: TMN-001
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { sovereignId } from './sovereign-id';
import {
  PHI,
  PHI_INVERSE,
  SCHUMANN_FUNDAMENTAL,
  HEARTBEAT_MS,
} from './kernelCompression';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION I: CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/** Total number of categorical rings on the torus */
export const RING_COUNT = 12;

/** Maximum angular value for theta (major cycle) */
export const THETA_MAX = 360;

/** Maximum angular value for phi (minor cycle) */
export const PHI_COORD_MAX = 180;

/** Minimum radial depth */
export const RHO_MIN = 1;

/** φ-weighted distance coefficients */
export const DISTANCE_WEIGHTS = {
  theta: PHI_INVERSE,           // 0.618 — major cycle weighted by φ⁻¹
  phi: PHI_INVERSE * PHI_INVERSE, // 0.382 — minor cycle weighted by φ⁻²
  rho: 1.0,                     // unit weight for depth
  ring: PHI,                    // φ weight for ring transitions (penalise cross-ring)
  beat: PHI_INVERSE / 10,       // low weight for beat (temporal distance)
} as const;

/** The 12 canonical categorical ring names */
export const RING_NAMES: Record<number, string> = {
  1:  'Memory',
  2:  'Language',
  3:  'Computation',
  4:  'Governance',
  5:  'Security',
  6:  'Intelligence',
  7:  'Organism',
  8:  'Blockchain',
  9:  'Consciousness',
  10: 'Mathematics',
  11: 'Engineering',
  12: 'Sovereign',
};

/** Semantic distance between rings (12×12 matrix — adjacency cost) */
const RING_ADJACENCY: Record<number, Record<number, number>> = (() => {
  const adj: Record<number, Record<number, number>> = {};
  for (let i = 1; i <= RING_COUNT; i++) {
    adj[i] = {};
    for (let j = 1; j <= RING_COUNT; j++) {
      if (i === j) {
        adj[i][j] = 0;
      } else {
        // Circular adjacency — rings 1 and 12 are adjacent
        const diff = Math.abs(i - j);
        adj[i][j] = Math.min(diff, RING_COUNT - diff);
      }
    }
  }
  return adj;
})();

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION II: TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Five-dimensional toroidal coordinate */
export interface ToroidalCoordinate {
  /** Major angular position: 0°–360° */
  theta: number;
  /** Minor angular position: 0°–180° */
  phi: number;
  /** Radial depth / specificity: 1–∞ */
  rho: number;
  /** Categorical ring index: 1–12 */
  ring: number;
  /** Temporal beat index: 0–∞ */
  beat: number;
}

/** A memory stored in the toroidal system */
export interface ToroidalMemory {
  id: string;
  content: string;
  summary: string;
  coordinates: ToroidalCoordinate;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  accessCount: number;
  resonanceScore: number;
}

/** Query parameters for memory retrieval */
export interface ToroidalQuery {
  /** Free-text query (drives angular projection) */
  query: string;
  /** Optional ring filter */
  ring?: number;
  /** Minimum depth */
  minRho?: number;
  /** Maximum depth */
  maxRho?: number;
  /** Beat range [from, to] inclusive */
  beatRange?: [number, number];
  /** k-nearest neighbours to return */
  limit?: number;
  /** Custom coordinate — if provided, nearest to this point */
  anchorCoordinate?: Partial<ToroidalCoordinate>;
}

/** Result of a toroidal retrieval */
export interface ToroidalQueryResult {
  memories: ToroidalMemory[];
  queryCoordinate: ToroidalCoordinate;
  distances: number[];
  executionTimeMs: number;
  totalSearched: number;
}

/** Result of a navigation operation */
export interface NavigationResult {
  from: ToroidalCoordinate;
  to: ToroidalCoordinate;
  operation: string;
  memoriesNearDestination: ToroidalMemory[];
}

/** Statistics for the navigator */
export interface NavigatorStats {
  totalMemories: number;
  memoriesByRing: Record<number, number>;
  averageDepth: number;
  maxBeat: number;
  totalAccesses: number;
  resonanceAverage: number;
  indexSize: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION III: DISTANCE METRICS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Angular distance that wraps around correctly.
 * For theta (0–360) or phi (0–180).
 */
export function angularDistance(a: number, b: number, max: number): number {
  const diff = Math.abs(a - b);
  return Math.min(diff, max - diff);
}

/**
 * Toroidal distance between two coordinates.
 * Incorporates all five dimensions with φ-weighted coefficients.
 */
export function toroidalDistance(
  a: ToroidalCoordinate,
  b: ToroidalCoordinate,
): number {
  const dTheta = angularDistance(a.theta, b.theta, THETA_MAX);
  const dPhi   = angularDistance(a.phi,   b.phi,   PHI_COORD_MAX);
  const dRho   = Math.abs(a.rho - b.rho);
  const dRing  = RING_ADJACENCY[a.ring]?.[b.ring] ?? Math.abs(a.ring - b.ring);
  const dBeat  = Math.abs(a.beat - b.beat);

  return Math.sqrt(
    DISTANCE_WEIGHTS.theta * dTheta * dTheta +
    DISTANCE_WEIGHTS.phi   * dPhi   * dPhi   +
    DISTANCE_WEIGHTS.rho   * dRho   * dRho   +
    DISTANCE_WEIGHTS.ring  * dRing  * dRing  +
    DISTANCE_WEIGHTS.beat  * dBeat  * dBeat,
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION IV: COORDINATE PROJECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Project a text string to an angular position on the torus.
 * Uses character code sums modulated through φ to spread uniformly.
 */
function projectToAngle(text: string, max: number, seed: number): number {
  let hash = seed;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) & 0x7fffffff;
  }
  // Map to [0, max) using golden ratio to distribute evenly
  return ((hash * PHI_INVERSE) % 1) * max;
}

/**
 * Estimate specificity of content (0–1) as a rough depth assignment.
 * More words → higher specificity up to a ceiling.
 */
function estimateSpecificity(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.min(wordCount / 50, 1); // saturates at 50 words
}

/**
 * Classify content into a ring (1–12) using keyword matching.
 */
function classifyRing(content: string): number {
  const lower = content.toLowerCase();
  if (/memory|recall|storage|remember/.test(lower))     return 1;
  if (/language|text|word|nlp|parse/.test(lower))       return 2;
  if (/compute|algorithm|code|program/.test(lower))     return 3;
  if (/govern|policy|rule|law|compli/.test(lower))      return 4;
  if (/secur|encr|key|cipher|protect/.test(lower))      return 5;
  if (/intelligen|cognit|think|reason/.test(lower))     return 6;
  if (/organism|biolog|life|cell|grow/.test(lower))     return 7;
  if (/blockchain|ledger|chain|token|crypto/.test(lower)) return 8;
  if (/conscious|aware|sentien|mind/.test(lower))       return 9;
  if (/math|formula|equation|proof|calcul/.test(lower)) return 10;
  if (/engineer|build|construct|design/.test(lower))    return 11;
  return 12; // Sovereign — default ring
}

/**
 * Assign toroidal coordinates to a piece of content.
 */
export function assignCoordinates(
  content: string,
  beat: number,
  overrides?: Partial<ToroidalCoordinate>,
): ToroidalCoordinate {
  const specificity = estimateSpecificity(content);
  const ring = overrides?.ring ?? classifyRing(content);

  return {
    theta:  overrides?.theta ?? projectToAngle(content, THETA_MAX, ring * 1000),
    phi:    overrides?.phi   ?? projectToAngle(content, PHI_COORD_MAX, ring * 7919),
    rho:    overrides?.rho   ?? RHO_MIN + specificity * PHI * 5,
    ring:   ring,
    beat:   overrides?.beat  ?? beat,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION V: SPATIAL INDEX
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Lightweight spatial hash for fast approximate nearest-neighbour lookup.
 * Divides the (theta, phi) space into cells of size CELL_SIZE degrees.
 */
const CELL_SIZE = 30; // degrees per cell

function cellKey(theta: number, phi: number): string {
  const ct = Math.floor(theta / CELL_SIZE) % Math.ceil(THETA_MAX / CELL_SIZE);
  const cp = Math.floor(phi / CELL_SIZE)   % Math.ceil(PHI_COORD_MAX / CELL_SIZE);
  return `${ct}:${cp}`;
}

class AngularIndex {
  private cells: Map<string, Set<string>> = new Map();
  private idToKey: Map<string, string> = new Map();

  insert(id: string, theta: number, phi: number): void {
    const key = cellKey(theta, phi);
    if (!this.cells.has(key)) this.cells.set(key, new Set());
    this.cells.get(key)!.add(id);
    this.idToKey.set(id, key);
  }

  remove(id: string): void {
    const key = this.idToKey.get(id);
    if (key) {
      this.cells.get(key)?.delete(id);
      this.idToKey.delete(id);
    }
  }

  /** Return candidate IDs in the neighbourhood cells (±1 cell in each dimension) */
  candidates(theta: number, phi: number): Set<string> {
    const result = new Set<string>();
    const ct = Math.floor(theta / CELL_SIZE);
    const cp = Math.floor(phi   / CELL_SIZE);
    const tCells = Math.ceil(THETA_MAX      / CELL_SIZE);
    const pCells = Math.ceil(PHI_COORD_MAX  / CELL_SIZE);

    for (let dt = -1; dt <= 1; dt++) {
      for (let dp = -1; dp <= 1; dp++) {
        const nt = ((ct + dt) % tCells + tCells) % tCells;
        const np = ((cp + dp) % pCells + pCells) % pCells;
        const key = `${nt}:${np}`;
        this.cells.get(key)?.forEach(id => result.add(id));
      }
    }
    return result;
  }

  get size(): number {
    return this.idToKey.size;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VI: TOROIDAL MEMORY NAVIGATOR CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class ToroidalMemoryNavigator {
  private memories: Map<string, ToroidalMemory> = new Map();
  private angularIndex = new AngularIndex();
  private ringIndex: Map<number, Set<string>> = new Map();
  private beatIndex: Map<string, number> = new Map(); // id → beat
  private globalBeat = 0;
  private totalAccesses = 0;

  constructor() {
    // Initialize ring index
    for (let r = 1; r <= RING_COUNT; r++) {
      this.ringIndex.set(r, new Set());
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // WRITE OPERATIONS
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Store a new memory in the torus.
   * Automatically assigns coordinates based on content analysis.
   */
  store(
    content: string,
    options: {
      summary?: string;
      tags?: string[];
      metadata?: Record<string, unknown>;
      coordinateOverrides?: Partial<ToroidalCoordinate>;
    } = {},
  ): ToroidalMemory {
    const beat = this.globalBeat++;
    const coordinates = assignCoordinates(content, beat, options.coordinateOverrides);

    const memory: ToroidalMemory = {
      id: sovereignId(),
      content,
      summary: options.summary ?? content.slice(0, 80).trim(),
      coordinates,
      tags: options.tags ?? [],
      metadata: options.metadata ?? {},
      createdAt: new Date().toISOString(),
      accessCount: 0,
      resonanceScore: PHI_INVERSE, // starts at φ⁻¹
    };

    this._insert(memory);
    return memory;
  }

  /**
   * Update an existing memory, creating a new beat version.
   */
  update(
    id: string,
    contentUpdate: string,
    metadataUpdate?: Record<string, unknown>,
  ): ToroidalMemory | null {
    const existing = this.memories.get(id);
    if (!existing) return null;

    const beat = this.globalBeat++;
    const coordinates = assignCoordinates(contentUpdate, beat, {
      // Preserve angular position — only beat changes for updates
      theta: existing.coordinates.theta,
      phi:   existing.coordinates.phi,
      ring:  existing.coordinates.ring,
    });

    const updated: ToroidalMemory = {
      ...existing,
      content: contentUpdate,
      summary: contentUpdate.slice(0, 80).trim(),
      coordinates,
      metadata: { ...existing.metadata, ...metadataUpdate },
    };

    this._remove(id);
    this._insert(updated);
    return updated;
  }

  /**
   * Delete a memory by id.
   */
  delete(id: string): boolean {
    if (!this.memories.has(id)) return false;
    this._remove(id);
    return true;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // READ OPERATIONS
  // ───────────────────────────────────────────────────────────────────────────

  get(id: string): ToroidalMemory | null {
    const m = this.memories.get(id) ?? null;
    if (m) {
      m.accessCount++;
      this.totalAccesses++;
    }
    return m;
  }

  /** Find k-nearest neighbours to a query using toroidal distance. */
  knn(anchor: ToroidalCoordinate, k: number, ringFilter?: number): ToroidalMemory[] {
    const candidates = this.angularIndex.candidates(anchor.theta, anchor.phi);

    // If few candidates, fall back to all memories in the ring (or all memories)
    let pool: Iterable<string>;
    if (candidates.size >= k * 2) {
      pool = candidates;
    } else if (ringFilter !== undefined) {
      pool = this.ringIndex.get(ringFilter) ?? this.memories.keys();
    } else {
      pool = this.memories.keys();
    }

    const scored: Array<{ memory: ToroidalMemory; dist: number }> = [];
    for (const id of pool) {
      const m = this.memories.get(id);
      if (!m) continue;
      if (ringFilter !== undefined && m.coordinates.ring !== ringFilter) continue;
      scored.push({ memory: m, dist: toroidalDistance(anchor, m.coordinates) });
    }

    scored.sort((a, b) => a.dist - b.dist);
    return scored.slice(0, k).map(s => {
      s.memory.accessCount++;
      this.totalAccesses++;
      return s.memory;
    });
  }

  /**
   * Query with text + optional filters. Returns sorted results.
   */
  query(params: ToroidalQuery): ToroidalQueryResult {
    const start = Date.now();
    const limit = params.limit ?? 10;

    // Derive anchor coordinate from query text
    const anchorBeat = params.beatRange ? params.beatRange[0] : 0;
    const rawCoord = assignCoordinates(params.query, anchorBeat, params.anchorCoordinate);
    const anchor: ToroidalCoordinate = {
      ...rawCoord,
      ring: params.ring ?? rawCoord.ring,
    };

    // Collect candidate pool
    let candidates: Iterable<string>;
    if (params.ring !== undefined) {
      candidates = this.ringIndex.get(params.ring) ?? new Set();
    } else {
      candidates = this.memories.keys();
    }

    const scored: Array<{ memory: ToroidalMemory; dist: number }> = [];
    for (const id of candidates) {
      const m = this.memories.get(id);
      if (!m) continue;

      // Apply depth filter
      if (params.minRho !== undefined && m.coordinates.rho < params.minRho) continue;
      if (params.maxRho !== undefined && m.coordinates.rho > params.maxRho) continue;

      // Apply beat range filter
      if (params.beatRange) {
        const [lo, hi] = params.beatRange;
        if (m.coordinates.beat < lo || m.coordinates.beat > hi) continue;
      }

      scored.push({ memory: m, dist: toroidalDistance(anchor, m.coordinates) });
    }

    const totalSearched = scored.length;
    scored.sort((a, b) => a.dist - b.dist);
    const top = scored.slice(0, limit);

    top.forEach(s => {
      s.memory.accessCount++;
      this.totalAccesses++;
      // Boost resonance on access
      s.memory.resonanceScore = Math.min(s.memory.resonanceScore * PHI, 10);
    });

    return {
      memories:         top.map(s => s.memory),
      queryCoordinate:  anchor,
      distances:        top.map(s => s.dist),
      executionTimeMs:  Date.now() - start,
      totalSearched,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // NAVIGATION OPERATIONS
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Traverse the major semantic cycle by Δθ degrees.
   * Returns memories near the destination.
   */
  traverseTheta(from: ToroidalCoordinate, deltaTheta: number, k = 5): NavigationResult {
    const to: ToroidalCoordinate = {
      ...from,
      theta: (from.theta + deltaTheta + THETA_MAX) % THETA_MAX,
    };
    return {
      from,
      to,
      operation: `traverse_theta(Δθ=${deltaTheta.toFixed(1)}°)`,
      memoriesNearDestination: this.knn(to, k, from.ring),
    };
  }

  /**
   * Traverse the minor semantic dimension by Δφ degrees.
   */
  traversePhi(from: ToroidalCoordinate, deltaPhi: number, k = 5): NavigationResult {
    const to: ToroidalCoordinate = {
      ...from,
      phi: Math.max(0, Math.min(PHI_COORD_MAX, from.phi + deltaPhi)),
    };
    return {
      from,
      to,
      operation: `traverse_phi(Δφ=${deltaPhi.toFixed(1)}°)`,
      memoriesNearDestination: this.knn(to, k, from.ring),
    };
  }

  /**
   * Dive deeper into specificity (increase ρ).
   */
  dive(from: ToroidalCoordinate, deltaRho: number, k = 5): NavigationResult {
    const to: ToroidalCoordinate = {
      ...from,
      rho: Math.max(RHO_MIN, from.rho + Math.abs(deltaRho)),
    };
    return {
      from,
      to,
      operation: `dive(Δρ=+${Math.abs(deltaRho).toFixed(2)})`,
      memoriesNearDestination: this.knn(to, k, from.ring),
    };
  }

  /**
   * Surface toward generality (decrease ρ).
   */
  surface(from: ToroidalCoordinate, deltaRho: number, k = 5): NavigationResult {
    const to: ToroidalCoordinate = {
      ...from,
      rho: Math.max(RHO_MIN, from.rho - Math.abs(deltaRho)),
    };
    return {
      from,
      to,
      operation: `surface(Δρ=-${Math.abs(deltaRho).toFixed(2)})`,
      memoriesNearDestination: this.knn(to, k),
    };
  }

  /**
   * Jump to a different categorical ring.
   */
  ringShift(from: ToroidalCoordinate, targetRing: number, k = 5): NavigationResult {
    const to: ToroidalCoordinate = {
      ...from,
      ring: Math.max(1, Math.min(RING_COUNT, targetRing)),
    };
    return {
      from,
      to,
      operation: `ring_shift(ring=${targetRing} "${RING_NAMES[to.ring]}")`,
      memoriesNearDestination: this.knn(to, k, to.ring),
    };
  }

  /**
   * Retrieve memories at a specific beat (temporal version).
   * Finds the best angular match at or near the target beat.
   */
  timeTravel(
    anchor: ToroidalCoordinate,
    targetBeat: number,
    toleranceBeat = 5,
    k = 5,
  ): NavigationResult {
    const to: ToroidalCoordinate = { ...anchor, beat: targetBeat };
    const beatRange: [number, number] = [
      Math.max(0, targetBeat - toleranceBeat),
      targetBeat + toleranceBeat,
    ];

    const result = this.query({
      query:     '',
      ring:      anchor.ring,
      beatRange,
      limit:     k,
      anchorCoordinate: to,
    });

    return {
      from:  anchor,
      to,
      operation: `time_travel(beat=${targetBeat}, ±${toleranceBeat})`,
      memoriesNearDestination: result.memories,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STATISTICS
  // ───────────────────────────────────────────────────────────────────────────

  stats(): NavigatorStats {
    const memoriesByRing: Record<number, number> = {};
    let sumDepth = 0;
    let maxBeat = 0;
    let sumResonance = 0;

    for (let r = 1; r <= RING_COUNT; r++) {
      memoriesByRing[r] = this.ringIndex.get(r)?.size ?? 0;
    }

    for (const m of this.memories.values()) {
      sumDepth     += m.coordinates.rho;
      maxBeat       = Math.max(maxBeat, m.coordinates.beat);
      sumResonance += m.resonanceScore;
    }

    const total = this.memories.size;
    return {
      totalMemories:    total,
      memoriesByRing,
      averageDepth:     total > 0 ? sumDepth / total : 0,
      maxBeat,
      totalAccesses:    this.totalAccesses,
      resonanceAverage: total > 0 ? sumResonance / total : 0,
      indexSize:        this.angularIndex.size,
    };
  }

  /** Current global beat counter */
  get beat(): number {
    return this.globalBeat;
  }

  /** All ring names */
  get ringNames(): Record<number, string> {
    return { ...RING_NAMES };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ───────────────────────────────────────────────────────────────────────────

  private _insert(memory: ToroidalMemory): void {
    this.memories.set(memory.id, memory);
    this.angularIndex.insert(memory.id, memory.coordinates.theta, memory.coordinates.phi);
    const ring = memory.coordinates.ring;
    if (!this.ringIndex.has(ring)) this.ringIndex.set(ring, new Set());
    this.ringIndex.get(ring)!.add(memory.id);
    this.beatIndex.set(memory.id, memory.coordinates.beat);
  }

  private _remove(id: string): void {
    const m = this.memories.get(id);
    if (!m) return;
    this.memories.delete(id);
    this.angularIndex.remove(id);
    this.ringIndex.get(m.coordinates.ring)?.delete(id);
    this.beatIndex.delete(id);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VII: SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let _instance: ToroidalMemoryNavigator | null = null;

/** Get the shared ToroidalMemoryNavigator instance. */
export function getToroidalMemoryNavigator(): ToroidalMemoryNavigator {
  if (!_instance) _instance = new ToroidalMemoryNavigator();
  return _instance;
}

/** Reset the singleton (for testing). */
export function resetToroidalMemoryNavigator(): void {
  _instance = null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VIII: RE-EXPORTS (convenience)
// ═══════════════════════════════════════════════════════════════════════════════

export {
  PHI,
  PHI_INVERSE,
  SCHUMANN_FUNDAMENTAL,
  HEARTBEAT_MS,
};
