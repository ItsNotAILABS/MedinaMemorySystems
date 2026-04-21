/**
 * @medina/memory-sdk
 * ─────────────────────────────────────────────────────────────────────────────
 * PROPRIETARY — ALL RIGHTS RESERVED
 * Copyright (c) 2026 ItsNotAILABS. See LICENSE for full terms.
 *
 * This software and its architecture are the exclusive trade secrets of
 * ItsNotAILABS. Unauthorized use, reproduction, distribution, or disclosure
 * of any portion of this codebase is strictly prohibited and will be
 * prosecuted to the maximum extent permitted by law.
 *
 * INTERNAL USE ONLY. Not licensed for public distribution.
 * Intelligentia Architecturae — Deep Lineage. Sovereign Systems.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Re-export sub-SDKs ───────────────────────────────────────────────────────

// Sub-SDK 1: Spatial Memory
export * from './memory/spatial';
// Sub-SDK 2: Document Intelligence
export * from './memory/documents';
// Sub-SDK 3: Knowledge Graph
export * from './knowledge/graph';
// Sub-SDK 4: Semantic Search
export * from './knowledge/search';
// Sub-SDK 5: Context Engine
export * from './context/engine';
// Sub-SDK 6: Pattern Recognition
export * from './patterns/recognition';
// Sub-SDK 7: Temporal Memory
export * from './memory/temporal';
// Sub-SDK 8: Harmonic Computing
export * from './harmonic/computing';
// Sub-SDK 9: Frequency Alignment
export * from './harmonic/frequency';
// Sub-SDK 10: Multi-AI Teams
export * from './teams/multiAI';

// ─── Core Types ───────────────────────────────────────────────────────────────

export type MedinaProduct =
  | 'memory-vault'
  | 'document-intelligence'
  | 'knowledge-graph'
  | 'semantic-search'
  | 'context-engine'
  | 'pattern-recognition'
  | 'temporal-memory'
  | 'harmonic-computing'
  | 'frequency-alignment'
  | 'organism-sync';

export interface MedinaConfig {
  apiKey: string;
  product?: MedinaProduct;
  endpoint?: string;
  options?: Record<string, unknown>;
}

export interface Memory {
  id: string;
  content: unknown;
  context: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created: number;
  similarity?: number;
}

export interface StoreOptions {
  content: string | object;
  context?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface RetrieveOptions {
  query: string;
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

export interface RetrieveResult {
  memories: Memory[];
  total: number;
  hasMore: boolean;
}

// ─── Main Client ──────────────────────────────────────────────────────────────

/**
 * The main Medina SDK client.
 *
 * @example
 * ```typescript
 * import { Medina } from '@medina/memory-sdk';
 *
 * const medina = new Medina({ apiKey: 'your-api-key' });
 * await medina.store({ content: 'Important context', context: { topic: 'meeting' } });
 * const results = await medina.retrieve({ query: 'meeting' });
 * ```
 */
export class Medina {
  private config: MedinaConfig;
  private store_: Map<string, Memory> = new Map();

  constructor(config: MedinaConfig) {
    this.config = config;
  }

  /**
   * Store a memory.
   */
  async store(options: StoreOptions): Promise<Memory> {
    const id = `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const memory: Memory = {
      id,
      content: options.content,
      context: options.context ?? {},
      metadata: options.metadata ?? {},
      created: Date.now(),
    };
    this.store_.set(id, memory);
    return memory;
  }

  /**
   * Retrieve memories by query.
   */
  async retrieve(options: RetrieveOptions): Promise<RetrieveResult> {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    const query = options.query.toLowerCase();

    const all = Array.from(this.store_.values()).filter(m => {
      const content = typeof m.content === 'string'
        ? m.content.toLowerCase()
        : JSON.stringify(m.content).toLowerCase();
      return content.includes(query);
    });

    return {
      memories: all.slice(offset, offset + limit),
      total: all.length,
      hasMore: offset + limit < all.length,
    };
  }

  /**
   * Delete a memory.
   */
  async delete(id: string): Promise<boolean> {
    return this.store_.delete(id);
  }

  /**
   * Update a memory.
   */
  async update(id: string, options: Partial<StoreOptions>): Promise<Memory | null> {
    const existing = this.store_.get(id);
    if (!existing) return null;

    const updated: Memory = {
      ...existing,
      content: options.content ?? existing.content,
      context: { ...existing.context, ...(options.context ?? {}) },
      metadata: { ...existing.metadata, ...(options.metadata ?? {}) },
    };

    this.store_.set(id, updated);
    return updated;
  }
}

export default Medina;
