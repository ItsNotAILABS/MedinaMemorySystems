/**
 * team-vault — Multi-tier Memory Vault for AI Agent Teams
 *
 * MIT License — Copyright (c) 2026 ItsNotAILABS
 *
 * PUBLIC, SHARED, PRIVATE, and SOVEREIGN access tiers with TTL,
 * memory decay, and cross-agent memory sharing.
 */

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────

/** Access tier controlling visibility and sharing rules. */
export type AccessTier = 'PUBLIC' | 'SHARED' | 'PRIVATE' | 'SOVEREIGN';

/** Options when storing a new vault entry. */
export interface StoreOptions {
  /** Time-to-live in milliseconds. Overrides tier default when provided. */
  ttlMs?: number;
  /** Decay rate (λ) for the exponential decay function. Default 0.01. */
  decayRate?: number;
  /** Arbitrary metadata attached to the entry. */
  metadata?: Record<string, unknown>;
  /** Initial list of agent IDs this entry is shared with (PRIVATE tier only). */
  sharedWith?: string[];
}

/** A single entry stored inside the vault. */
export interface VaultEntry<T = unknown> {
  /** Unique key identifying this entry. */
  key: string;
  /** The stored value / memory payload. */
  value: T;
  /** Access tier governing visibility. */
  tier: AccessTier;
  /** Agent ID of the entry owner. */
  ownerId: string;
  /** Agent IDs with explicit read access (PRIVATE tier). */
  sharedWith: string[];
  /** Time-to-live in milliseconds from creation. */
  ttlMs: number;
  /** Timestamp (epoch ms) when the entry was created. */
  createdAt: number;
  /** Timestamp (epoch ms) when the entry expires. */
  expiresAt: number;
  /** Exponential decay rate λ — strength = e^(-λ * ageHours). */
  decayRate: number;
  /** Arbitrary metadata. */
  metadata: Record<string, unknown>;
}

/** Snapshot of vault size broken down by tier. */
export interface VaultSizeSnapshot {
  PUBLIC: number;
  SHARED: number;
  PRIVATE: number;
  SOVEREIGN: number;
  total: number;
}

// ─────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────

/** Default TTL per tier (ms). */
const DEFAULT_TTL: Record<AccessTier, number> = {
  PUBLIC: 24 * 60 * 60 * 1000,        // 24 hours
  SHARED: 7 * 24 * 60 * 60 * 1000,    // 7 days
  PRIVATE: 30 * 24 * 60 * 60 * 1000,  // 30 days
  SOVEREIGN: Infinity,                 // never expires by default
};

/** Default decay rate per tier. */
const DEFAULT_DECAY: Record<AccessTier, number> = {
  PUBLIC: 0.05,
  SHARED: 0.02,
  PRIVATE: 0.01,
  SOVEREIGN: 0.0,
};

/** Tier hierarchy from lowest to highest privilege. */
const TIER_ORDER: AccessTier[] = ['PUBLIC', 'SHARED', 'PRIVATE', 'SOVEREIGN'];

/** Minimum strength threshold — entries below this are removed during decay sweep. */
const DECAY_THRESHOLD = 0.05;

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

function tierIndex(tier: AccessTier): number {
  return TIER_ORDER.indexOf(tier);
}

/**
 * Compute the current strength of a memory entry using exponential decay.
 *
 * strength = e^(-decayRate * ageHours)
 */
function computeStrength(entry: VaultEntry): number {
  if (entry.decayRate === 0) return 1;
  const ageMs = Date.now() - entry.createdAt;
  const ageHours = ageMs / (1000 * 60 * 60);
  return Math.exp(-entry.decayRate * ageHours);
}

// ─────────────────────────────────────────────────────────────────────────
// TeamVault
// ─────────────────────────────────────────────────────────────────────────

/**
 * Multi-tier memory vault for AI agent teams.
 *
 * Provides fine-grained access control across four tiers, automatic TTL
 * expiration, and exponential memory decay.
 *
 * @example
 * ```ts
 * const vault = new TeamVault();
 * vault.store('plan', { steps: ['a', 'b'] }, 'SHARED', 'agent-1');
 * const entry = vault.retrieve('plan', 'agent-2'); // allowed — SHARED tier
 * ```
 */
export class TeamVault {
  private entries: Map<string, VaultEntry> = new Map();

  // ── Store ──────────────────────────────────────────────────────────────

  /**
   * Store a memory entry in the vault.
   *
   * @param key      Unique key for this entry.
   * @param value    The memory payload.
   * @param tier     Access tier.
   * @param ownerId  Owner agent ID.
   * @param options  Optional TTL, decay, metadata overrides.
   * @returns The created {@link VaultEntry}.
   */
  store<T>(
    key: string,
    value: T,
    tier: AccessTier,
    ownerId: string,
    options: StoreOptions = {},
  ): VaultEntry<T> {
    const now = Date.now();
    const ttlMs = options.ttlMs ?? DEFAULT_TTL[tier];
    const decayRate = options.decayRate ?? DEFAULT_DECAY[tier];

    // SOVEREIGN entries must never be shared at creation
    const sharedWith =
      tier === 'SOVEREIGN' ? [] : (options.sharedWith ?? []);

    const entry: VaultEntry<T> = {
      key,
      value,
      tier,
      ownerId,
      sharedWith,
      ttlMs,
      createdAt: now,
      expiresAt: ttlMs === Infinity ? Infinity : now + ttlMs,
      decayRate,
      metadata: options.metadata ?? {},
    };

    this.entries.set(key, entry as VaultEntry);
    return entry;
  }

  // ── Retrieve ───────────────────────────────────────────────────────────

  /**
   * Retrieve a memory entry if the requester has access.
   *
   * Access rules:
   *  - PUBLIC    → anyone can read
   *  - SHARED    → any team member (all known agent IDs) can read
   *  - PRIVATE   → owner + explicitly shared agents
   *  - SOVEREIGN → owner only, no exceptions
   *
   * @returns The entry, or `null` if not found or access denied.
   */
  retrieve<T = unknown>(key: string, requesterId: string): VaultEntry<T> | null {
    const entry = this.entries.get(key) as VaultEntry<T> | undefined;
    if (!entry) return null;

    // TTL check
    if (Date.now() > entry.expiresAt) {
      this.entries.delete(key);
      return null;
    }

    if (!this.hasAccess(entry, requesterId)) return null;
    return entry;
  }

  // ── Share ──────────────────────────────────────────────────────────────

  /**
   * Share a PRIVATE entry with another agent.
   *
   * Only the owner can share. SOVEREIGN entries cannot be shared.
   *
   * @returns `true` if the share succeeded.
   */
  share(key: string, ownerId: string, targetAgentId: string): boolean {
    const entry = this.entries.get(key);
    if (!entry) return false;
    if (entry.ownerId !== ownerId) return false;
    if (entry.tier === 'SOVEREIGN') return false;
    if (entry.tier !== 'PRIVATE') return false;
    if (entry.sharedWith.includes(targetAgentId)) return true;

    entry.sharedWith.push(targetAgentId);
    return true;
  }

  // ── Promote / Demote ───────────────────────────────────────────────────

  /**
   * Promote a memory entry to a higher access tier.
   *
   * Only the owner can promote. The new tier must be strictly higher.
   *
   * @returns `true` if the promotion succeeded.
   */
  promote(key: string, ownerId: string, newTier: AccessTier): boolean {
    const entry = this.entries.get(key);
    if (!entry) return false;
    if (entry.ownerId !== ownerId) return false;
    if (tierIndex(newTier) <= tierIndex(entry.tier)) return false;

    entry.tier = newTier;
    // Clear shares when promoting to SOVEREIGN
    if (newTier === 'SOVEREIGN') {
      entry.sharedWith = [];
    }
    return true;
  }

  /**
   * Demote a memory entry to a lower access tier.
   *
   * Only the owner can demote. The new tier must be strictly lower.
   *
   * @returns `true` if the demotion succeeded.
   */
  demote(key: string, ownerId: string, newTier: AccessTier): boolean {
    const entry = this.entries.get(key);
    if (!entry) return false;
    if (entry.ownerId !== ownerId) return false;
    if (tierIndex(newTier) >= tierIndex(entry.tier)) return false;

    entry.tier = newTier;
    return true;
  }

  // ── Expiration & Decay ─────────────────────────────────────────────────

  /**
   * Sweep all entries whose TTL has expired.
   *
   * @returns The number of entries removed.
   */
  expire(): number {
    const now = Date.now();
    let removed = 0;
    for (const [key, entry] of this.entries) {
      if (now > entry.expiresAt) {
        this.entries.delete(key);
        removed++;
      }
    }
    return removed;
  }

  /**
   * Apply exponential decay to all entries.
   *
   * Entries whose strength falls below {@link DECAY_THRESHOLD} are removed.
   *
   * Strength formula: `strength = e^(-decayRate * ageHours)`
   *
   * @returns The number of entries removed due to decay.
   */
  decay(): number {
    let removed = 0;
    for (const [key, entry] of this.entries) {
      const strength = computeStrength(entry);
      if (strength < DECAY_THRESHOLD) {
        this.entries.delete(key);
        removed++;
      }
    }
    return removed;
  }

  // ── Queries ────────────────────────────────────────────────────────────

  /**
   * List all entries at a given tier that the requester can access.
   *
   * @returns Array of matching entries (expired entries are skipped).
   */
  listTier(tier: AccessTier, requesterId: string): VaultEntry[] {
    const now = Date.now();
    const results: VaultEntry[] = [];

    for (const entry of this.entries.values()) {
      if (entry.tier !== tier) continue;
      if (now > entry.expiresAt) continue;
      if (!this.hasAccess(entry, requesterId)) continue;
      results.push(entry);
    }
    return results;
  }

  /**
   * Return a full snapshot of the vault for audit purposes.
   *
   * @returns Array of all current entries (including expired — caller must filter).
   */
  snapshot(): VaultEntry[] {
    return Array.from(this.entries.values());
  }

  /**
   * Return the number of entries per tier and overall total.
   */
  size(): VaultSizeSnapshot {
    const counts: VaultSizeSnapshot = {
      PUBLIC: 0,
      SHARED: 0,
      PRIVATE: 0,
      SOVEREIGN: 0,
      total: 0,
    };
    for (const entry of this.entries.values()) {
      counts[entry.tier]++;
      counts.total++;
    }
    return counts;
  }

  // ── Internal ───────────────────────────────────────────────────────────

  /**
   * Check whether `requesterId` has read access to `entry` based on tier rules.
   */
  private hasAccess(entry: VaultEntry, requesterId: string): boolean {
    switch (entry.tier) {
      case 'PUBLIC':
        return true;
      case 'SHARED':
        return true; // all team members
      case 'PRIVATE':
        return (
          entry.ownerId === requesterId ||
          entry.sharedWith.includes(requesterId)
        );
      case 'SOVEREIGN':
        return entry.ownerId === requesterId;
      default:
        return false;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Re-exports for convenience
// ─────────────────────────────────────────────────────────────────────────

export { computeStrength, DECAY_THRESHOLD, DEFAULT_TTL, DEFAULT_DECAY, TIER_ORDER };
