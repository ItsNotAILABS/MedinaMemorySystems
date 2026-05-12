/**
 * 𓂀 UNIFIED MEMORY SYSTEM 𓂀
 * Complete Sovereign Memory Infrastructure
 * "Every thought persists. Every memory entangles."
 *
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 * System ID: MEM-001
 */

import { PHI, PHI_INVERSE, SCHUMANN_RESONANCE_MS } from './CloudflareWorkersBridge';
import { CloudflareStorageBridge, StorageTier, MemoryHierarchyStats } from './CloudflareStorageBridge';
import { CloudflareBlockchainBridge, CrossChainMemory, ChainId } from './CloudflareBlockchainBridge';
import { EdgeEntanglementEngine, EntanglementState } from './EdgeEntanglementEngine';

// ═══════════════════════════════════════════════════════════════════════════
// SECTION I: CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const SYSTEM_ID = 'MEM-001';
export const SYSTEM_VERSION = '1.0.0';

// Memory tier thresholds (φ-based)
export const MEMORY_TIERS = {
  IMMEDIATE: { threshold: 0, ttl: SCHUMANN_RESONANCE_MS * 10 },       // ~8.7 seconds
  SHORT_TERM: { threshold: 0.382, ttl: SCHUMANN_RESONANCE_MS * 100 }, // ~87 seconds
  LONG_TERM: { threshold: 0.618, ttl: SCHUMANN_RESONANCE_MS * 1000 }, // ~14.5 minutes
  PERMANENT: { threshold: 0.786, ttl: Infinity },                      // Forever (blockchain)
} as const;

export type MemoryTier = keyof typeof MEMORY_TIERS;

// ═══════════════════════════════════════════════════════════════════════════
// SECTION II: TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface UnifiedMemoryConfig {
  enableImmediateTier: boolean;
  enableShortTermTier: boolean;
  enableLongTermTier: boolean;
  enablePermanentTier: boolean;
  autoPromote: boolean;
  autoDemote: boolean;
  syncInterval: number;
  maxMemoriesPerTier: number;
}

export interface UnifiedMemory {
  memoryId: string;
  key: string;
  value: unknown;
  tier: MemoryTier;
  importance: number;
  accessCount: number;
  accessHistory: number[];
  phiResonance: number;
  entanglementState?: EntanglementState;
  chainAnchor?: {
    chainId: ChainId;
    txHash: string;
    blockNumber: number;
  };
  createdAt: number;
  lastAccessed: number;
  lastPromoted?: number;
  lastDemoted?: number;
  metadata: Record<string, unknown>;
}

export interface MemoryQuery {
  key?: string;
  tier?: MemoryTier;
  minImportance?: number;
  maxImportance?: number;
  tags?: string[];
  createdAfter?: number;
  createdBefore?: number;
  limit?: number;
  offset?: number;
}

export interface MemorySearchResult {
  memory: UnifiedMemory;
  score: number;
  matchType: 'exact' | 'partial' | 'semantic';
}

export interface PromotionResult {
  memoryId: string;
  fromTier: MemoryTier;
  toTier: MemoryTier;
  success: boolean;
  reason?: string;
}

export interface DemotionResult {
  memoryId: string;
  fromTier: MemoryTier;
  toTier: MemoryTier;
  success: boolean;
  archived: boolean;
}

export interface MemorySystemStatistics {
  totalMemories: number;
  byTier: Record<MemoryTier, number>;
  averageImportance: number;
  averageAccessCount: number;
  promotionCount: number;
  demotionCount: number;
  anchoredCount: number;
  phiCoherence: number;
  entanglementCount: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION III: UNIFIED MEMORY SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

export class UnifiedMemorySystem {
  public readonly systemId = SYSTEM_ID;
  public readonly systemName = 'UnifiedMemorySystem';

  private config: UnifiedMemoryConfig;
  private storageBridge: CloudflareStorageBridge;
  private blockchainBridge: CloudflareBlockchainBridge;
  private entanglementEngine: EdgeEntanglementEngine;

  private memories: Map<string, UnifiedMemory> = new Map();
  private tierIndices: Map<MemoryTier, Set<string>> = new Map();

  private promotionCount = 0;
  private demotionCount = 0;

  constructor(config?: Partial<UnifiedMemoryConfig>) {
    this.config = {
      enableImmediateTier: config?.enableImmediateTier ?? true,
      enableShortTermTier: config?.enableShortTermTier ?? true,
      enableLongTermTier: config?.enableLongTermTier ?? true,
      enablePermanentTier: config?.enablePermanentTier ?? true,
      autoPromote: config?.autoPromote ?? true,
      autoDemote: config?.autoDemote ?? true,
      syncInterval: config?.syncInterval || SCHUMANN_RESONANCE_MS,
      maxMemoriesPerTier: config?.maxMemoriesPerTier || 10000,
    };

    this.storageBridge = new CloudflareStorageBridge();
    this.blockchainBridge = new CloudflareBlockchainBridge();
    this.entanglementEngine = new EdgeEntanglementEngine();

    // Initialize tier indices
    for (const tier of Object.keys(MEMORY_TIERS) as MemoryTier[]) {
      this.tierIndices.set(tier, new Set());
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE MEMORY OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Store a memory with automatic tier placement
   */
  async store(
    key: string,
    value: unknown,
    options?: {
      importance?: number;
      tier?: MemoryTier;
      metadata?: Record<string, unknown>;
      anchorToChain?: ChainId;
      createEntanglement?: boolean;
    }
  ): Promise<UnifiedMemory> {
    const importance = options?.importance || this.calculateImportance(value);
    const tier = options?.tier || this.selectTier(importance);

    const memoryId = this.generateMemoryId(key);
    
    // Calculate φ-resonance
    const phiResonance = this.calculatePhiResonance(importance, tier);

    const memory: UnifiedMemory = {
      memoryId,
      key,
      value,
      tier,
      importance,
      accessCount: 0,
      accessHistory: [],
      phiResonance,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      metadata: options?.metadata || {},
    };

    // Store based on tier
    await this.storeInTier(memory);

    // Create entanglement if requested
    if (options?.createEntanglement) {
      memory.entanglementState = await this.createMemoryEntanglement(memory);
    }

    // Anchor to blockchain if requested or if permanent tier
    if (options?.anchorToChain || tier === 'PERMANENT') {
      const chainId = options?.anchorToChain || 'MEDINA-001';
      await this.anchorMemory(memory, chainId);
    }

    // Add to indices
    this.memories.set(memoryId, memory);
    this.tierIndices.get(tier)?.add(memoryId);

    return memory;
  }

  /**
   * Retrieve a memory by key
   */
  async get(key: string): Promise<UnifiedMemory | null> {
    const memoryId = this.generateMemoryId(key);
    let memory = this.memories.get(memoryId);

    // If not in local cache, search through tiers
    if (!memory) {
      memory = await this.searchTiers(key);
    }

    if (!memory) {
      return null;
    }

    // Update access metrics
    memory.accessCount++;
    memory.accessHistory.push(Date.now());
    memory.lastAccessed = Date.now();

    // Keep only last 100 access timestamps
    if (memory.accessHistory.length > 100) {
      memory.accessHistory = memory.accessHistory.slice(-100);
    }

    // Check for auto-promotion
    if (this.config.autoPromote) {
      await this.checkPromotion(memory);
    }

    return memory;
  }

  /**
   * Update an existing memory
   */
  async update(
    key: string,
    value: unknown,
    options?: {
      mergeMetadata?: boolean;
      recalculateImportance?: boolean;
    }
  ): Promise<UnifiedMemory | null> {
    const memory = await this.get(key);
    if (!memory) {
      return null;
    }

    // Update value
    memory.value = value;

    // Recalculate importance if requested
    if (options?.recalculateImportance) {
      memory.importance = this.calculateImportance(value);
      memory.phiResonance = this.calculatePhiResonance(memory.importance, memory.tier);
    }

    // Update in storage
    await this.storeInTier(memory);

    return memory;
  }

  /**
   * Delete a memory
   */
  async delete(key: string): Promise<boolean> {
    const memoryId = this.generateMemoryId(key);
    const memory = this.memories.get(memoryId);

    if (!memory) {
      return false;
    }

    // Remove from tier index
    this.tierIndices.get(memory.tier)?.delete(memoryId);

    // Remove from storage
    await this.deleteFromTier(memory);

    // Remove from local cache
    this.memories.delete(memoryId);

    return true;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SEARCH & QUERY
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Search memories
   */
  async search(query: string): Promise<MemorySearchResult[]> {
    const results: MemorySearchResult[] = [];
    const queryLower = query.toLowerCase();

    for (const memory of this.memories.values()) {
      let score = 0;
      let matchType: 'exact' | 'partial' | 'semantic' = 'partial';

      // Exact key match
      if (memory.key === query) {
        score = 1.0;
        matchType = 'exact';
      }
      // Partial key match
      else if (memory.key.toLowerCase().includes(queryLower)) {
        score = 0.8;
        matchType = 'partial';
      }
      // Value search
      else if (JSON.stringify(memory.value).toLowerCase().includes(queryLower)) {
        score = 0.6;
        matchType = 'partial';
      }
      // Semantic (simplified - based on φ-resonance similarity)
      else {
        const queryHash = this.simpleHash(query);
        const memoryHash = this.simpleHash(memory.key);
        const similarity = 1 - Math.abs(queryHash - memoryHash) / Math.max(queryHash, memoryHash);
        if (similarity > 0.5) {
          score = similarity * 0.4;
          matchType = 'semantic';
        }
      }

      if (score > 0) {
        // Weight by importance and φ-resonance
        score *= (memory.importance * PHI + memory.phiResonance * PHI_INVERSE);
        results.push({ memory, score, matchType });
      }
    }

    // Sort by score
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Query memories with filters
   */
  async query(query: MemoryQuery): Promise<UnifiedMemory[]> {
    let results: UnifiedMemory[] = [];

    // Filter by tier
    if (query.tier) {
      const tierMemories = this.tierIndices.get(query.tier);
      if (tierMemories) {
        for (const memoryId of tierMemories) {
          const memory = this.memories.get(memoryId);
          if (memory) results.push(memory);
        }
      }
    } else {
      results = Array.from(this.memories.values());
    }

    // Apply filters
    results = results.filter(memory => {
      if (query.key && !memory.key.includes(query.key)) return false;
      if (query.minImportance !== undefined && memory.importance < query.minImportance) return false;
      if (query.maxImportance !== undefined && memory.importance > query.maxImportance) return false;
      if (query.createdAfter && memory.createdAt < query.createdAfter) return false;
      if (query.createdBefore && memory.createdAt > query.createdBefore) return false;
      if (query.tags && query.tags.length > 0) {
        const memoryTags = (memory.metadata.tags as string[]) || [];
        if (!query.tags.some(tag => memoryTags.includes(tag))) return false;
      }
      return true;
    });

    // Sort by φ-resonance
    results.sort((a, b) => b.phiResonance - a.phiResonance);

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    return results.slice(offset, offset + limit);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Promote memory to higher tier
   */
  async promote(key: string): Promise<PromotionResult> {
    const memory = await this.get(key);
    if (!memory) {
      return {
        memoryId: this.generateMemoryId(key),
        fromTier: 'IMMEDIATE',
        toTier: 'IMMEDIATE',
        success: false,
        reason: 'Memory not found',
      };
    }

    const tiers: MemoryTier[] = ['IMMEDIATE', 'SHORT_TERM', 'LONG_TERM', 'PERMANENT'];
    const currentIndex = tiers.indexOf(memory.tier);

    if (currentIndex >= tiers.length - 1) {
      return {
        memoryId: memory.memoryId,
        fromTier: memory.tier,
        toTier: memory.tier,
        success: false,
        reason: 'Already at highest tier',
      };
    }

    const newTier = tiers[currentIndex + 1];
    const fromTier = memory.tier;

    // Update tier
    this.tierIndices.get(fromTier)?.delete(memory.memoryId);
    memory.tier = newTier;
    memory.lastPromoted = Date.now();
    this.tierIndices.get(newTier)?.add(memory.memoryId);

    // Store in new tier
    await this.storeInTier(memory);

    // Anchor to blockchain if promoted to PERMANENT
    if (newTier === 'PERMANENT' && !memory.chainAnchor) {
      await this.anchorMemory(memory, 'MEDINA-001');
    }

    this.promotionCount++;

    return {
      memoryId: memory.memoryId,
      fromTier,
      toTier: newTier,
      success: true,
    };
  }

  /**
   * Demote memory to lower tier
   */
  async demote(key: string): Promise<DemotionResult> {
    const memory = await this.get(key);
    if (!memory) {
      return {
        memoryId: this.generateMemoryId(key),
        fromTier: 'IMMEDIATE',
        toTier: 'IMMEDIATE',
        success: false,
        archived: false,
      };
    }

    const tiers: MemoryTier[] = ['IMMEDIATE', 'SHORT_TERM', 'LONG_TERM', 'PERMANENT'];
    const currentIndex = tiers.indexOf(memory.tier);

    if (currentIndex <= 0) {
      // Archive instead of demoting below IMMEDIATE
      await this.archive(memory);
      return {
        memoryId: memory.memoryId,
        fromTier: memory.tier,
        toTier: memory.tier,
        success: true,
        archived: true,
      };
    }

    const newTier = tiers[currentIndex - 1];
    const fromTier = memory.tier;

    // Update tier
    this.tierIndices.get(fromTier)?.delete(memory.memoryId);
    memory.tier = newTier;
    memory.lastDemoted = Date.now();
    this.tierIndices.get(newTier)?.add(memory.memoryId);

    // Store in new tier
    await this.storeInTier(memory);

    this.demotionCount++;

    return {
      memoryId: memory.memoryId,
      fromTier,
      toTier: newTier,
      success: true,
      archived: false,
    };
  }

  /**
   * Check if memory should be promoted
   */
  private async checkPromotion(memory: UnifiedMemory): Promise<void> {
    const now = Date.now();
    const recentAccesses = memory.accessHistory.filter(t => now - t < 60000).length;

    // Promotion criteria based on φ
    const accessThreshold = Math.floor(5 * PHI);
    const importanceGrowth = memory.accessCount > 10 ? 
      Math.log(memory.accessCount) / Math.log(10) * PHI_INVERSE : 0;

    if (recentAccesses >= accessThreshold) {
      memory.importance = Math.min(1, memory.importance + importanceGrowth);
      memory.phiResonance = this.calculatePhiResonance(memory.importance, memory.tier);

      const newTier = this.selectTier(memory.importance);
      if (this.getTierPriority(newTier) > this.getTierPriority(memory.tier)) {
        await this.promote(memory.key);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STORAGE OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  private async storeInTier(memory: UnifiedMemory): Promise<void> {
    const data = JSON.stringify(memory);

    switch (memory.tier) {
      case 'IMMEDIATE':
        await this.storageBridge.durableStore(memory.memoryId, memory);
        break;
      case 'SHORT_TERM':
        await this.storageBridge.kvPut(`memory:${memory.memoryId}`, data, {
          expirationTtl: MEMORY_TIERS.SHORT_TERM.ttl / 1000,
        });
        break;
      case 'LONG_TERM':
        await this.storageBridge.r2Put(`memories/${memory.memoryId}`, data);
        break;
      case 'PERMANENT':
        await this.storageBridge.r2Put(`permanent/${memory.memoryId}`, data);
        // Also index in D1
        await this.storageBridge.d1Query(
          'INSERT OR REPLACE INTO memories (id, key, importance, tier, created_at) VALUES (?, ?, ?, ?, ?)',
          [memory.memoryId, memory.key, memory.importance, memory.tier, memory.createdAt]
        );
        break;
    }
  }

  private async deleteFromTier(memory: UnifiedMemory): Promise<void> {
    switch (memory.tier) {
      case 'IMMEDIATE':
        await this.storageBridge.durableDelete(memory.memoryId);
        break;
      case 'SHORT_TERM':
        await this.storageBridge.kvDelete(`memory:${memory.memoryId}`);
        break;
      case 'LONG_TERM':
        await this.storageBridge.r2Delete(`memories/${memory.memoryId}`);
        break;
      case 'PERMANENT':
        // Don't actually delete permanent memories, just mark as archived
        await this.storageBridge.d1Query(
          'UPDATE memories SET archived = 1 WHERE id = ?',
          [memory.memoryId]
        );
        break;
    }
  }

  private async searchTiers(key: string): Promise<UnifiedMemory | null> {
    const memoryId = this.generateMemoryId(key);

    // Search from fastest to slowest
    
    // 1. Durable (IMMEDIATE)
    const durable = await this.storageBridge.durableGet(memoryId);
    if (durable) return durable as UnifiedMemory;

    // 2. KV (SHORT_TERM)
    const kv = await this.storageBridge.kvGet(`memory:${memoryId}`);
    if (kv) return JSON.parse(kv) as UnifiedMemory;

    // 3. R2 (LONG_TERM)
    const r2 = await this.storageBridge.r2Get(`memories/${memoryId}`);
    if (r2) return JSON.parse(r2.body as string) as UnifiedMemory;

    // 4. R2 Permanent
    const permanent = await this.storageBridge.r2Get(`permanent/${memoryId}`);
    if (permanent) return JSON.parse(permanent.body as string) as UnifiedMemory;

    return null;
  }

  private async archive(memory: UnifiedMemory): Promise<void> {
    const archiveData = {
      ...memory,
      archivedAt: Date.now(),
    };
    await this.storageBridge.r2Put(`archive/${memory.memoryId}`, JSON.stringify(archiveData));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOCKCHAIN ANCHORING
  // ═══════════════════════════════════════════════════════════════════════════

  private async anchorMemory(memory: UnifiedMemory, chainId: ChainId): Promise<void> {
    const crossChainMemory = await this.blockchainBridge.storeMemory(
      memory.key,
      memory.value,
      {
        importance: memory.importance,
        anchorChains: [chainId],
        tags: (memory.metadata.tags as string[]) || [],
      }
    );

    const proof = crossChainMemory.proofs.get(chainId);
    if (proof) {
      memory.chainAnchor = {
        chainId,
        txHash: proof.txHash,
        blockNumber: proof.blockNumber,
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ENTANGLEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  private async createMemoryEntanglement(memory: UnifiedMemory): Promise<EntanglementState> {
    // Register memory as a node
    this.entanglementEngine.registerNode(
      `memory-${memory.memoryId}`,
      'agent',
      { memoryId: memory.memoryId, importance: memory.importance }
    );

    // Create entanglement with other high-importance memories
    const relatedMemories = Array.from(this.memories.values())
      .filter(m => m.importance >= 0.618 && m.memoryId !== memory.memoryId)
      .slice(0, 5);

    if (relatedMemories.length > 0) {
      return this.entanglementEngine.createMultipartiteEntanglement(
        [`memory-${memory.memoryId}`, ...relatedMemories.map(m => `memory-${m.memoryId}`)],
        `memory-cluster-${Date.now()}`
      );
    }

    // Create bilateral entanglement with the system
    const channel = this.entanglementEngine.createChannel(
      `memory-${memory.memoryId}`,
      'system-core',
      'bilateral'
    );

    return channel.state;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  private generateMemoryId(key: string): string {
    return `mem-${this.simpleHash(key).toString(16).padStart(16, '0')}`;
  }

  private simpleHash(data: string): number {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  }

  private calculateImportance(value: unknown): number {
    // Calculate importance based on value complexity
    const size = JSON.stringify(value).length;
    const sizeScore = Math.min(1, Math.log(size + 1) / 10);
    
    // φ-weighted importance
    return sizeScore * PHI_INVERSE + (1 - sizeScore) * (PHI_INVERSE * PHI_INVERSE);
  }

  private calculatePhiResonance(importance: number, tier: MemoryTier): number {
    const tierMultiplier = {
      IMMEDIATE: PHI_INVERSE * PHI_INVERSE,
      SHORT_TERM: PHI_INVERSE,
      LONG_TERM: PHI_INVERSE + 0.1,
      PERMANENT: PHI_INVERSE + 0.2,
    };

    return Math.min(1, importance * tierMultiplier[tier]);
  }

  private selectTier(importance: number): MemoryTier {
    if (importance >= MEMORY_TIERS.PERMANENT.threshold) return 'PERMANENT';
    if (importance >= MEMORY_TIERS.LONG_TERM.threshold) return 'LONG_TERM';
    if (importance >= MEMORY_TIERS.SHORT_TERM.threshold) return 'SHORT_TERM';
    return 'IMMEDIATE';
  }

  private getTierPriority(tier: MemoryTier): number {
    const priorities: Record<MemoryTier, number> = {
      IMMEDIATE: 0,
      SHORT_TERM: 1,
      LONG_TERM: 2,
      PERMANENT: 3,
    };
    return priorities[tier];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════════════════

  getStatistics(): MemorySystemStatistics {
    const byTier: Record<MemoryTier, number> = {
      IMMEDIATE: 0,
      SHORT_TERM: 0,
      LONG_TERM: 0,
      PERMANENT: 0,
    };

    let totalImportance = 0;
    let totalAccessCount = 0;
    let anchoredCount = 0;
    let entanglementCount = 0;
    let totalPhiResonance = 0;

    for (const memory of this.memories.values()) {
      byTier[memory.tier]++;
      totalImportance += memory.importance;
      totalAccessCount += memory.accessCount;
      totalPhiResonance += memory.phiResonance;
      if (memory.chainAnchor) anchoredCount++;
      if (memory.entanglementState) entanglementCount++;
    }

    const count = this.memories.size || 1;

    return {
      totalMemories: this.memories.size,
      byTier,
      averageImportance: totalImportance / count,
      averageAccessCount: totalAccessCount / count,
      promotionCount: this.promotionCount,
      demotionCount: this.demotionCount,
      anchoredCount,
      phiCoherence: totalPhiResonance / count,
      entanglementCount,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION IV: EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const unifiedMemorySystem = new UnifiedMemorySystem();

export default UnifiedMemorySystem;
