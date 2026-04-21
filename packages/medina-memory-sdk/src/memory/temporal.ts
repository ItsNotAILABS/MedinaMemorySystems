/**
 * Sub-SDK 7: Temporal Memory
 * Memory that understands time — decay, recency, temporal context.
 */

export interface TemporalMemoryEntry {
  id: string;
  content: string;
  timestamp: number;
  weight: number;   // 0–1, decreases with time
  halfLifeMs: number; // time for weight to halve
  tags: string[];
  pinned: boolean;
}

export class TemporalMemory {
  private entries: Map<string, TemporalMemoryEntry> = new Map();

  store(
    content: string,
    options: { halfLifeMs?: number; tags?: string[]; pinned?: boolean } = {},
  ): TemporalMemoryEntry {
    const id = `tm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const entry: TemporalMemoryEntry = {
      id,
      content,
      timestamp: Date.now(),
      weight: 1.0,
      halfLifeMs: options.halfLifeMs ?? 86400000, // 24h default half-life
      tags: options.tags ?? [],
      pinned: options.pinned ?? false,
    };
    this.entries.set(id, entry);
    return entry;
  }

  /**
   * Get current weight of an entry accounting for temporal decay.
   * W(t) = W₀ × 2^(−t/halfLife)
   */
  getWeight(id: string): number {
    const entry = this.entries.get(id);
    if (!entry) return 0;
    if (entry.pinned) return entry.weight;

    const elapsed = Date.now() - entry.timestamp;
    return entry.weight * Math.pow(2, -(elapsed / entry.halfLifeMs));
  }

  /**
   * Retrieve entries sorted by current temporal weight.
   */
  getByRecency(limit = 10): Array<TemporalMemoryEntry & { currentWeight: number }> {
    return Array.from(this.entries.values())
      .map(e => ({ ...e, currentWeight: this.getWeight(e.id) }))
      .sort((a, b) => b.currentWeight - a.currentWeight)
      .slice(0, limit);
  }

  /**
   * Prune entries below a minimum weight threshold.
   */
  prune(minWeight = 0.01): number {
    let pruned = 0;
    for (const [id, entry] of this.entries.entries()) {
      if (!entry.pinned && this.getWeight(id) < minWeight) {
        this.entries.delete(id);
        pruned++;
      }
    }
    return pruned;
  }
}
