/**
 * team-vault
 * ─────────────────────────────────────────────────────────────────────────────
 * Tiered memory store for AI agent teams.
 *
 * Four access tiers:
 *   PUBLIC    — any caller can read
 *   SHARED    — team members only
 *   PRIVATE   — only the writing agent can read
 *   SOVEREIGN — only SOVEREIGN and LEAD roles can read
 *
 * All entries support optional TTL expiry.
 * Expired entries are evicted on read and on manual sweep.
 *
 * Use this when:
 *   - Agents on a team need to share context without exposing everything
 *   - Some information should only be visible to senior roles
 *   - You need working memory that ages out automatically
 *   - You want an audit trail of what was remembered and when
 *
 * MIT License — ItsNotAILABS
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type VaultTier = 'PUBLIC' | 'SHARED' | 'PRIVATE' | 'SOVEREIGN';

/** Roles that can read SOVEREIGN-tier entries (in addition to the owner). */
export const SOVEREIGN_ROLES = new Set(['SOVEREIGN', 'LEAD']);

export interface VaultEntry<T = unknown> {
  /** Entry key */
  key: string;
  /** Stored value */
  value: T;
  /** Access tier */
  tier: VaultTier;
  /** Agent ID that wrote this entry */
  writerId: string;
  /** ISO timestamp of creation */
  createdAt: string;
  /** ISO timestamp of last access */
  lastAccessedAt: string;
  /** ISO timestamp of expiry, if set */
  expiresAt?: string;
  /** Total read count */
  accessCount: number;
  /** Optional free-form tags */
  tags: string[];
}

export interface WriteOptions {
  /**
   * Time-to-live in milliseconds.
   * After this duration the entry is treated as expired and evicted.
   */
  ttlMs?: number;
  /** Free-form tags for filtering */
  tags?: string[];
}

export interface ReadOptions {
  /** Agent ID of the reader (for PRIVATE tier checks) */
  readerId?: string;
  /** Role of the reader (for SOVEREIGN tier checks) */
  readerRole?: string;
}

export interface ListOptions extends ReadOptions {
  /** Filter to a specific tier */
  tier?: VaultTier;
  /** Filter by tag */
  tag?: string;
  /** Include expired entries in the result */
  includeExpired?: boolean;
}

// ─── Vault ────────────────────────────────────────────────────────────────────

/**
 * Tiered memory store for an AI agent team.
 *
 * @example
 * ```typescript
 * import { Vault } from 'team-vault';
 *
 * const vault = new Vault();
 *
 * // Lead writes shared context
 * vault.write('lead', 'goal', 'Launch by Q3', 'SHARED');
 *
 * // Analyst writes private working notes with 5-minute TTL
 * vault.write('analyst', 'scratch', { raw: [...] }, 'PRIVATE', { ttlMs: 5 * 60_000 });
 *
 * // Sovereign writes top-level directive
 * vault.write('sovereign', 'directive', 'Do not ship unvalidated.', 'SOVEREIGN');
 *
 * // Read — any agent can read SHARED
 * const goal = vault.read('goal', { readerId: 'builder' });
 *
 * // Read — only SOVEREIGN/LEAD can read SOVEREIGN tier
 * const directive = vault.read('directive', { readerId: 'lead', readerRole: 'LEAD' });
 *
 * // Read — private entries only readable by writer
 * const scratch = vault.read('scratch', { readerId: 'analyst' }); // returns value
 * const blocked = vault.read('scratch', { readerId: 'builder' }); // returns undefined
 *
 * // Sweep expired entries
 * const swept = vault.evict();
 * ```
 */
export class Vault {
  private store: Map<string, VaultEntry> = new Map();

  /**
   * Write a value into the vault.
   */
  write<T = unknown>(
    writerId: string,
    key: string,
    value: T,
    tier: VaultTier = 'SHARED',
    options: WriteOptions = {},
  ): VaultEntry<T> {
    const now = new Date().toISOString();
    const expiresAt = options.ttlMs
      ? new Date(Date.now() + options.ttlMs).toISOString()
      : undefined;

    const entry: VaultEntry<T> = {
      key,
      value,
      tier,
      writerId,
      createdAt: now,
      lastAccessedAt: now,
      expiresAt,
      accessCount: 0,
      tags: options.tags ?? [],
    };

    this.store.set(key, entry as VaultEntry);
    return entry;
  }

  /**
   * Read a value from the vault.
   * Returns `undefined` if the key doesn't exist, has expired, or access is denied.
   */
  read<T = unknown>(key: string, options: ReadOptions = {}): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    // Expiry
    if (entry.expiresAt && new Date(entry.expiresAt) <= new Date()) {
      this.store.delete(key);
      return undefined;
    }

    // Tier access control
    if (!this.canRead(entry, options)) return undefined;

    entry.accessCount += 1;
    entry.lastAccessedAt = new Date().toISOString();
    return entry.value as T;
  }

  /**
   * Check whether a key exists and is readable (without recording an access).
   */
  has(key: string, options: ReadOptions = {}): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (entry.expiresAt && new Date(entry.expiresAt) <= new Date()) return false;
    return this.canRead(entry, options);
  }

  /**
   * Delete an entry from the vault.
   * Only the writer or a SOVEREIGN/LEAD role can delete.
   */
  delete(key: string, requesterId: string, requesterRole?: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    const canDelete =
      entry.writerId === requesterId ||
      (requesterRole && SOVEREIGN_ROLES.has(requesterRole));
    if (!canDelete) return false;
    this.store.delete(key);
    return true;
  }

  /**
   * Update the value of an existing entry (writer only, or SOVEREIGN/LEAD).
   */
  update<T = unknown>(
    key: string,
    value: T,
    requesterId: string,
    requesterRole?: string,
  ): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    const canWrite =
      entry.writerId === requesterId ||
      (requesterRole && SOVEREIGN_ROLES.has(requesterRole));
    if (!canWrite) return false;
    entry.value = value;
    entry.lastAccessedAt = new Date().toISOString();
    return true;
  }

  /**
   * List all entries visible to the caller, newest first.
   */
  list(options: ListOptions = {}): VaultEntry[] {
    const now = new Date();
    return Array.from(this.store.values())
      .filter(entry => {
        // Expired filter
        if (!options.includeExpired && entry.expiresAt && new Date(entry.expiresAt) <= now) {
          return false;
        }
        // Tier filter
        if (options.tier && entry.tier !== options.tier) return false;
        // Tag filter
        if (options.tag && !entry.tags.includes(options.tag)) return false;
        // Access control
        return this.canRead(entry, options);
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  /**
   * Evict all expired entries. Returns the number evicted.
   */
  evict(): number {
    const now = new Date();
    let count = 0;
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt && new Date(entry.expiresAt) <= now) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Total entries currently in the vault (including expired, before next evict).
   */
  size(): number { return this.store.size; }

  /**
   * Summary stats for the vault.
   */
  stats(): {
    total: number;
    byTier: Record<VaultTier, number>;
    totalAccesses: number;
    expiredPending: number;
  } {
    const now = new Date();
    const byTier: Record<VaultTier, number> = {
      PUBLIC: 0, SHARED: 0, PRIVATE: 0, SOVEREIGN: 0,
    };
    let totalAccesses = 0;
    let expiredPending = 0;

    for (const entry of this.store.values()) {
      byTier[entry.tier] += 1;
      totalAccesses += entry.accessCount;
      if (entry.expiresAt && new Date(entry.expiresAt) <= now) expiredPending++;
    }

    return { total: this.store.size, byTier, totalAccesses, expiredPending };
  }

  private canRead(entry: VaultEntry, options: ReadOptions): boolean {
    switch (entry.tier) {
      case 'PUBLIC':
        return true;
      case 'SHARED':
        return true; // any registered caller
      case 'PRIVATE':
        return entry.writerId === options.readerId;
      case 'SOVEREIGN':
        return (
          entry.writerId === options.readerId ||
          (!!options.readerRole && SOVEREIGN_ROLES.has(options.readerRole))
        );
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Create a new standalone Vault.
 */
export function createVault(): Vault { return new Vault(); }

/**
 * Create a scoped vault accessor for a specific agent.
 * All writes are attributed to that agent. All reads pass the agent's ID and role.
 */
export function createAgentVault(
  agentId: string,
  role: string,
  vault: Vault,
) {
  return {
    write: <T>(key: string, value: T, tier: VaultTier = 'SHARED', options: WriteOptions = {}) =>
      vault.write(agentId, key, value, tier, options),

    read: <T>(key: string) =>
      vault.read<T>(key, { readerId: agentId, readerRole: role }),

    has: (key: string) =>
      vault.has(key, { readerId: agentId, readerRole: role }),

    list: (options: Omit<ListOptions, 'readerId' | 'readerRole'> = {}) =>
      vault.list({ ...options, readerId: agentId, readerRole: role }),

    delete: (key: string) =>
      vault.delete(key, agentId, role),
  };
}
