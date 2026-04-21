/**
 * RECITAL PLUS ONE
 * ─────────────────────────────────────────────────────────────────────────────
 * The RECITAL_PLUS_ONE law: every recital of a memory amplifies the next.
 * Resonance compounds across temporal beats.
 *
 * Law: Resonance(n+1) = Resonance(n) × (1 + α)
 *
 * Where α (alpha) is the amplification coefficient — how much each recital
 * strengthens the memory. Defaults to 0.1 (10% compounding per recital).
 *
 * Inspired by:
 *   - Hebbian learning ("neurons that fire together wire together")
 *   - Islamic recitation traditions (tajwid, hifz)
 *   - Vedic sruti (heard, memorized, transmitted)
 *   - Bardic memory culture (oral epic tradition)
 *   - Information-theoretic salience models
 *
 * MIT License — ItsNotAILABS / Medina Memory Systems
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RecitalEntry {
  id: string;
  content: string;
  resonance: number;    // Current resonance score (0–1+)
  recitalCount: number; // How many times recited
  createdAt: number;
  lastRecitedAt: number;
  alpha: number;        // Amplification coefficient for this entry
  tags?: string[];
}

export interface RecitalResult {
  entry: RecitalEntry;
  previousResonance: number;
  newResonance: number;
  amplification: number;
  beat: number;
}

export interface RecitalQuery {
  minResonance?: number;
  tags?: string[];
  limit?: number;
  sortBy?: 'resonance' | 'recitalCount' | 'createdAt' | 'lastRecitedAt';
  order?: 'asc' | 'desc';
}

export interface RecitalConfig {
  defaultAlpha?: number;          // Default amplification (default: 0.1)
  maxResonance?: number;          // Cap on resonance (default: Infinity)
  decayRate?: number;             // Decay per beat without recital (default: 0)
  beatDurationMs?: number;        // Duration of one beat in ms (default: 1000)
}

// ─── Core Law ─────────────────────────────────────────────────────────────────

/**
 * Apply the RECITAL_PLUS_ONE law to a resonance value.
 *
 * Resonance(n+1) = Resonance(n) × (1 + α)
 *
 * @param resonance - Current resonance score
 * @param alpha - Amplification coefficient (default: 0.1)
 * @param maxResonance - Optional cap (default: Infinity)
 */
export function recite(
  resonance: number,
  alpha: number = 0.1,
  maxResonance: number = Infinity,
): number {
  const next = resonance * (1 + alpha);
  return Math.min(next, maxResonance);
}

/**
 * Calculate resonance after N recitals.
 *
 * Resonance(n) = Resonance(0) × (1 + α)^n
 *
 * @param initialResonance - Starting resonance
 * @param n - Number of recitals
 * @param alpha - Amplification coefficient
 */
export function resonanceAfterN(
  initialResonance: number,
  n: number,
  alpha: number = 0.1,
): number {
  return initialResonance * Math.pow(1 + alpha, n);
}

/**
 * Calculate how many recitals are needed to reach a target resonance.
 *
 * n = log(target / initial) / log(1 + α)
 */
export function recitalsToReach(
  initialResonance: number,
  targetResonance: number,
  alpha: number = 0.1,
): number {
  if (targetResonance <= initialResonance) return 0;
  return Math.ceil(Math.log(targetResonance / initialResonance) / Math.log(1 + alpha));
}

/**
 * Apply decay — resonance without recital weakens over time.
 *
 * Resonance(t) = Resonance(0) × (1 - δ)^t
 *
 * @param resonance - Current resonance
 * @param beatsElapsed - Number of beats since last recital
 * @param decayRate - Decay rate per beat (0–1, default: 0 = no decay)
 */
export function decay(
  resonance: number,
  beatsElapsed: number,
  decayRate: number = 0,
): number {
  if (decayRate === 0) return resonance;
  return resonance * Math.pow(1 - decayRate, beatsElapsed);
}

// ─── Registry ─────────────────────────────────────────────────────────────────

/**
 * A registry of recitable memory entries.
 * Manages the resonance of all entries, applies recitals, handles decay.
 */
export class RecitalRegistry {
  private entries: Map<string, RecitalEntry> = new Map();
  private beat: number = 0;
  private config: Required<RecitalConfig>;

  constructor(config: RecitalConfig = {}) {
    this.config = {
      defaultAlpha: config.defaultAlpha ?? 0.1,
      maxResonance: config.maxResonance ?? Infinity,
      decayRate: config.decayRate ?? 0,
      beatDurationMs: config.beatDurationMs ?? 1000,
    };
  }

  /**
   * Register a new entry with an initial resonance.
   */
  register(
    id: string,
    content: string,
    initialResonance: number = 0.5,
    options: { alpha?: number; tags?: string[] } = {},
  ): RecitalEntry {
    const entry: RecitalEntry = {
      id,
      content,
      resonance: initialResonance,
      recitalCount: 0,
      createdAt: Date.now(),
      lastRecitedAt: Date.now(),
      alpha: options.alpha ?? this.config.defaultAlpha,
      tags: options.tags ?? [],
    };
    this.entries.set(id, entry);
    return entry;
  }

  /**
   * Recite an entry — applies RECITAL_PLUS_ONE, returns the result.
   */
  recite(id: string): RecitalResult | null {
    const entry = this.entries.get(id);
    if (!entry) return null;

    const previousResonance = entry.resonance;
    const newResonance = recite(entry.resonance, entry.alpha, this.config.maxResonance);

    entry.resonance = newResonance;
    entry.recitalCount += 1;
    entry.lastRecitedAt = Date.now();

    return {
      entry,
      previousResonance,
      newResonance,
      amplification: newResonance - previousResonance,
      beat: this.beat,
    };
  }

  /**
   * Advance time by one beat — applies decay to all entries.
   */
  advanceBeat(): void {
    this.beat += 1;

    if (this.config.decayRate > 0) {
      for (const entry of this.entries.values()) {
        entry.resonance = decay(entry.resonance, 1, this.config.decayRate);
      }
    }
  }

  /**
   * Query entries by resonance, tags, or other criteria.
   */
  query(q: RecitalQuery = {}): RecitalEntry[] {
    let results = Array.from(this.entries.values());

    if (q.minResonance !== undefined) {
      results = results.filter(e => e.resonance >= q.minResonance!);
    }

    if (q.tags && q.tags.length > 0) {
      results = results.filter(e => q.tags!.some(t => e.tags?.includes(t)));
    }

    const sortBy = q.sortBy ?? 'resonance';
    const order = q.order ?? 'desc';

    results.sort((a, b) => {
      const diff = (a[sortBy] as number) - (b[sortBy] as number);
      return order === 'desc' ? -diff : diff;
    });

    if (q.limit !== undefined) {
      results = results.slice(0, q.limit);
    }

    return results;
  }

  /**
   * Get the current beat.
   */
  getBeat(): number {
    return this.beat;
  }

  /**
   * Get a single entry.
   */
  get(id: string): RecitalEntry | undefined {
    return this.entries.get(id);
  }

  /**
   * Get all entries sorted by resonance descending.
   */
  getAll(): RecitalEntry[] {
    return this.query({ sortBy: 'resonance', order: 'desc' });
  }

  /**
   * Remove an entry.
   */
  remove(id: string): boolean {
    return this.entries.delete(id);
  }

  /**
   * Get registry statistics.
   */
  stats(): {
    totalEntries: number;
    totalRecitals: number;
    averageResonance: number;
    highestResonance: number;
    currentBeat: number;
  } {
    const all = this.getAll();
    const totalRecitals = all.reduce((sum, e) => sum + e.recitalCount, 0);
    const totalResonance = all.reduce((sum, e) => sum + e.resonance, 0);
    const highestResonance = all.length > 0 ? all[0].resonance : 0;

    return {
      totalEntries: all.length,
      totalRecitals,
      averageResonance: all.length > 0 ? totalResonance / all.length : 0,
      highestResonance,
      currentBeat: this.beat,
    };
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const RECITAL_LAW = {
  name: 'RECITAL_PLUS_ONE',
  formula: 'Resonance(n+1) = Resonance(n) × (1 + α)',
  defaultAlpha: 0.1,
  description: 'Every recital amplifies the next. Resonance compounds across temporal beats.',
} as const;

export default {
  recite,
  resonanceAfterN,
  recitalsToReach,
  decay,
  RecitalRegistry,
  RECITAL_LAW,
};
