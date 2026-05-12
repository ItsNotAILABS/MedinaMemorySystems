/**
 * 𓂀 CLOUDFLARE STORAGE BRIDGE 𓂀
 * Distributed Memory Persistence via R2/KV/D1/Vectorize
 * "Memories persist across the global edge"
 *
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 * Charter: CF-STR-001
 */

import { PHI, PHI_INVERSE } from './CloudflareWorkersBridge';

// ═══════════════════════════════════════════════════════════════════════════
// SECTION I: TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export type StorageTier = 'immediate' | 'kv' | 'r2' | 'd1' | 'vectorize';

export interface StorageConfig {
  kvNamespace: string;
  r2Bucket: string;
  d1Database: string;
  vectorizeIndex: string;
  defaultTtl: number;
}

export interface KVOptions {
  expirationTtl?: number;
  expiration?: number;
  metadata?: Record<string, any>;
}

export interface R2Object {
  key: string;
  body: ArrayBuffer | string;
  contentType?: string;
  customMetadata?: Record<string, string>;
  httpMetadata?: {
    contentType?: string;
    contentLanguage?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    cacheControl?: string;
  };
  size: number;
  etag: string;
  uploaded: Date;
}

export interface R2ObjectList {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
  delimitedPrefixes: string[];
}

export interface R2ListOptions {
  prefix?: string;
  limit?: number;
  cursor?: string;
  delimiter?: string;
  include?: ('httpMetadata' | 'customMetadata')[];
}

export interface D1Result<T = any> {
  results: T[];
  success: boolean;
  meta: {
    duration: number;
    changes: number;
    last_row_id: number;
  };
}

export interface VectorMatch {
  id: string;
  score: number;
  values?: number[];
  metadata?: Record<string, any>;
}

export interface VectorizeOptions {
  topK?: number;
  filter?: Record<string, any>;
  returnValues?: boolean;
  returnMetadata?: boolean;
}

export interface MemoryHierarchyStats {
  immediate: { count: number; sizeBytes: number };
  kv: { count: number; sizeBytes: number };
  r2: { count: number; sizeBytes: number };
  d1: { count: number; rows: number };
  vectorize: { count: number; dimensions: number };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION II: CLOUDFLARE STORAGE BRIDGE
// ═══════════════════════════════════════════════════════════════════════════

export class CloudflareStorageBridge {
  public readonly bridgeId = 'CF-STR-001';
  public readonly bridgeName = 'CloudflareStorageBridge';

  private config: StorageConfig;
  
  // In-memory (L1) storage
  private immediateMemory: Map<string, { value: any; expiry?: number }> = new Map();
  
  // Simulated KV storage (L2)
  private kvStorage: Map<string, { value: any; metadata?: any; expiry?: number }> = new Map();
  
  // Simulated R2 storage (L3)
  private r2Storage: Map<string, R2Object> = new Map();
  
  // Simulated D1 database (L4)
  private d1Tables: Map<string, any[]> = new Map();
  
  // Simulated Vectorize index (L5)
  private vectorIndex: Map<string, { vector: number[]; metadata?: any }> = new Map();

  constructor(config?: Partial<StorageConfig>) {
    this.config = {
      kvNamespace: config?.kvNamespace || 'medina-agent-memory',
      r2Bucket: config?.r2Bucket || 'medina-long-term-storage',
      d1Database: config?.d1Database || 'medina-structured-data',
      vectorizeIndex: config?.vectorizeIndex || 'medina-embeddings',
      defaultTtl: config?.defaultTtl || 86400000, // 24 hours
    };

    this.initializeD1Tables();
  }

  private initializeD1Tables(): void {
    // Initialize default tables
    this.d1Tables.set('memories', []);
    this.d1Tables.set('agents', []);
    this.d1Tables.set('relationships', []);
    this.d1Tables.set('tasks', []);
    this.d1Tables.set('events', []);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // L1: IMMEDIATE MEMORY (IN-MEMORY)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get from immediate memory
   */
  getImmediate(key: string): any | undefined {
    const entry = this.immediateMemory.get(key);
    if (!entry) return undefined;
    
    if (entry.expiry && entry.expiry < Date.now()) {
      this.immediateMemory.delete(key);
      return undefined;
    }
    
    return entry.value;
  }

  /**
   * Set in immediate memory
   */
  setImmediate(key: string, value: any, ttl?: number): void {
    this.immediateMemory.set(key, {
      value,
      expiry: ttl ? Date.now() + ttl : undefined,
    });

    // Limit immediate memory size
    const maxSize = Math.floor(PHI * 100); // ~162 items
    if (this.immediateMemory.size > maxSize) {
      this.evictImmediate();
    }
  }

  /**
   * Delete from immediate memory
   */
  deleteImmediate(key: string): boolean {
    return this.immediateMemory.delete(key);
  }

  /**
   * Evict oldest entries from immediate memory
   */
  private evictImmediate(): void {
    const entries = Array.from(this.immediateMemory.entries());
    const toDelete = Math.floor(entries.length * PHI_INVERSE);
    
    for (let i = 0; i < toDelete; i++) {
      this.immediateMemory.delete(entries[i][0]);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // L2: KV STORAGE (GLOBAL, EVENTUALLY CONSISTENT)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get from KV
   */
  async kvGet(key: string): Promise<any | null> {
    const entry = this.kvStorage.get(key);
    if (!entry) return null;
    
    if (entry.expiry && entry.expiry < Date.now()) {
      this.kvStorage.delete(key);
      return null;
    }
    
    return entry.value;
  }

  /**
   * Get with metadata from KV
   */
  async kvGetWithMetadata(key: string): Promise<{ value: any; metadata: any } | null> {
    const entry = this.kvStorage.get(key);
    if (!entry) return null;
    
    if (entry.expiry && entry.expiry < Date.now()) {
      this.kvStorage.delete(key);
      return null;
    }
    
    return { value: entry.value, metadata: entry.metadata };
  }

  /**
   * Put to KV
   */
  async kvPut(key: string, value: any, options?: KVOptions): Promise<void> {
    const expiry = options?.expirationTtl 
      ? Date.now() + (options.expirationTtl * 1000)
      : options?.expiration 
        ? options.expiration * 1000 
        : undefined;

    this.kvStorage.set(key, {
      value,
      metadata: options?.metadata,
      expiry,
    });
  }

  /**
   * Delete from KV
   */
  async kvDelete(key: string): Promise<void> {
    this.kvStorage.delete(key);
  }

  /**
   * List keys from KV
   */
  async kvList(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
    keys: { name: string; expiration?: number; metadata?: any }[];
    cursor?: string;
    list_complete: boolean;
  }> {
    const keys: { name: string; expiration?: number; metadata?: any }[] = [];
    const prefix = options?.prefix || '';
    const limit = options?.limit || 1000;

    for (const [key, entry] of this.kvStorage.entries()) {
      if (key.startsWith(prefix)) {
        keys.push({
          name: key,
          expiration: entry.expiry ? Math.floor(entry.expiry / 1000) : undefined,
          metadata: entry.metadata,
        });
        
        if (keys.length >= limit) break;
      }
    }

    return {
      keys,
      list_complete: keys.length < limit,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // L3: R2 STORAGE (OBJECT STORAGE, STRONGLY CONSISTENT)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get object from R2
   */
  async r2Get(key: string): Promise<R2Object | null> {
    return this.r2Storage.get(key) || null;
  }

  /**
   * Put object to R2
   */
  async r2Put(
    key: string, 
    value: ArrayBuffer | string,
    options?: {
      contentType?: string;
      customMetadata?: Record<string, string>;
    }
  ): Promise<R2Object> {
    const size = typeof value === 'string' ? value.length : value.byteLength;
    
    const obj: R2Object = {
      key,
      body: value,
      contentType: options?.contentType,
      customMetadata: options?.customMetadata,
      size,
      etag: this.generateEtag(),
      uploaded: new Date(),
    };

    this.r2Storage.set(key, obj);
    return obj;
  }

  /**
   * Delete object from R2
   */
  async r2Delete(key: string): Promise<void> {
    this.r2Storage.delete(key);
  }

  /**
   * List objects in R2
   */
  async r2List(options?: R2ListOptions): Promise<R2ObjectList> {
    const objects: R2Object[] = [];
    const prefix = options?.prefix || '';
    const limit = options?.limit || 1000;
    const delimiter = options?.delimiter;
    const delimitedPrefixes = new Set<string>();

    for (const [key, obj] of this.r2Storage.entries()) {
      if (key.startsWith(prefix)) {
        if (delimiter) {
          const suffix = key.slice(prefix.length);
          const delimiterIndex = suffix.indexOf(delimiter);
          
          if (delimiterIndex !== -1) {
            delimitedPrefixes.add(prefix + suffix.slice(0, delimiterIndex + 1));
            continue;
          }
        }
        
        objects.push(obj);
        
        if (objects.length >= limit) break;
      }
    }

    return {
      objects,
      truncated: objects.length >= limit,
      delimitedPrefixes: Array.from(delimitedPrefixes),
    };
  }

  /**
   * Get object as text from R2
   */
  async r2GetText(key: string): Promise<string | null> {
    const obj = await this.r2Get(key);
    if (!obj) return null;
    
    if (typeof obj.body === 'string') return obj.body;
    
    const decoder = new TextDecoder();
    return decoder.decode(obj.body);
  }

  /**
   * Get object as JSON from R2
   */
  async r2GetJson<T>(key: string): Promise<T | null> {
    const text = await this.r2GetText(key);
    if (!text) return null;
    
    return JSON.parse(text);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // L4: D1 DATABASE (SQLITE, RELATIONAL)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Execute SQL query
   */
  async d1Query<T = any>(sql: string, params?: any[]): Promise<D1Result<T>> {
    const startTime = Date.now();
    
    // Parse SQL (very simplified)
    const lowerSql = sql.toLowerCase().trim();
    
    if (lowerSql.startsWith('select')) {
      return this.d1Select<T>(sql, params);
    } else if (lowerSql.startsWith('insert')) {
      return this.d1Insert<T>(sql, params);
    } else if (lowerSql.startsWith('update')) {
      return this.d1Update<T>(sql, params);
    } else if (lowerSql.startsWith('delete')) {
      return this.d1Delete<T>(sql, params);
    } else if (lowerSql.startsWith('create table')) {
      return this.d1CreateTable<T>(sql);
    }

    return {
      results: [],
      success: false,
      meta: { duration: Date.now() - startTime, changes: 0, last_row_id: 0 },
    };
  }

  private d1Select<T>(sql: string, params?: any[]): D1Result<T> {
    const startTime = Date.now();
    
    // Extract table name (simplified)
    const fromMatch = sql.match(/from\s+(\w+)/i);
    const tableName = fromMatch?.[1];
    
    if (!tableName) {
      return { results: [], success: false, meta: { duration: Date.now() - startTime, changes: 0, last_row_id: 0 } };
    }
    
    const table = this.d1Tables.get(tableName) || [];
    
    return {
      results: table as T[],
      success: true,
      meta: { duration: Date.now() - startTime, changes: 0, last_row_id: 0 },
    };
  }

  private d1Insert<T>(sql: string, params?: any[]): D1Result<T> {
    const startTime = Date.now();
    
    // Extract table name
    const intoMatch = sql.match(/into\s+(\w+)/i);
    const tableName = intoMatch?.[1];
    
    if (!tableName || !params) {
      return { results: [], success: false, meta: { duration: Date.now() - startTime, changes: 0, last_row_id: 0 } };
    }
    
    let table = this.d1Tables.get(tableName);
    if (!table) {
      table = [];
      this.d1Tables.set(tableName, table);
    }
    
    // Create row from params
    const row = { id: table.length + 1, ...Object.fromEntries(params.map((p, i) => [`col${i}`, p])) };
    table.push(row);
    
    return {
      results: [row] as T[],
      success: true,
      meta: { duration: Date.now() - startTime, changes: 1, last_row_id: row.id },
    };
  }

  private d1Update<T>(sql: string, params?: any[]): D1Result<T> {
    const startTime = Date.now();
    return { results: [], success: true, meta: { duration: Date.now() - startTime, changes: 1, last_row_id: 0 } };
  }

  private d1Delete<T>(sql: string, params?: any[]): D1Result<T> {
    const startTime = Date.now();
    return { results: [], success: true, meta: { duration: Date.now() - startTime, changes: 1, last_row_id: 0 } };
  }

  private d1CreateTable<T>(sql: string): D1Result<T> {
    const startTime = Date.now();
    
    // Extract table name
    const tableMatch = sql.match(/create\s+table\s+(\w+)/i);
    const tableName = tableMatch?.[1];
    
    if (tableName && !this.d1Tables.has(tableName)) {
      this.d1Tables.set(tableName, []);
    }
    
    return { results: [], success: true, meta: { duration: Date.now() - startTime, changes: 0, last_row_id: 0 } };
  }

  /**
   * Batch SQL execution
   */
  async d1Batch(statements: { sql: string; params?: any[] }[]): Promise<D1Result[]> {
    const results: D1Result[] = [];
    
    for (const stmt of statements) {
      results.push(await this.d1Query(stmt.sql, stmt.params));
    }
    
    return results;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // L5: VECTORIZE (SEMANTIC SEARCH)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Insert vector
   */
  async vectorInsert(id: string, vector: number[], metadata?: any): Promise<void> {
    this.vectorIndex.set(id, { vector, metadata });
  }

  /**
   * Insert multiple vectors
   */
  async vectorInsertBatch(vectors: { id: string; vector: number[]; metadata?: any }[]): Promise<void> {
    for (const v of vectors) {
      this.vectorIndex.set(v.id, { vector: v.vector, metadata: v.metadata });
    }
  }

  /**
   * Query vectors by similarity
   */
  async vectorQuery(
    queryVector: number[],
    options?: VectorizeOptions
  ): Promise<VectorMatch[]> {
    const topK = options?.topK || 10;
    const matches: VectorMatch[] = [];

    for (const [id, { vector, metadata }] of this.vectorIndex.entries()) {
      const similarity = this.cosineSimilarity(queryVector, vector);
      
      matches.push({
        id,
        score: similarity,
        values: options?.returnValues ? vector : undefined,
        metadata: options?.returnMetadata ? metadata : undefined,
      });
    }

    // Sort by similarity (descending)
    matches.sort((a, b) => b.score - a.score);

    return matches.slice(0, topK);
  }

  /**
   * Delete vector
   */
  async vectorDelete(id: string): Promise<void> {
    this.vectorIndex.delete(id);
  }

  /**
   * Calculate cosine similarity
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) return 0;

    return dotProduct / denominator;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CROSS-TIER OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Promote from immediate to KV
   */
  async promoteToKV(key: string): Promise<boolean> {
    const value = this.getImmediate(key);
    if (value === undefined) return false;
    
    await this.kvPut(key, value, { expirationTtl: this.config.defaultTtl / 1000 });
    return true;
  }

  /**
   * Archive from KV to R2
   */
  async archiveToR2(key: string): Promise<boolean> {
    const value = await this.kvGet(key);
    if (value === null) return false;
    
    const serialized = JSON.stringify(value);
    await this.r2Put(key, serialized, { contentType: 'application/json' });
    await this.kvDelete(key);
    
    return true;
  }

  /**
   * Index to Vectorize (requires embedding)
   */
  async indexToVectorize(key: string, embedding: number[]): Promise<boolean> {
    const value = await this.r2Get(key);
    if (!value) return false;
    
    await this.vectorInsert(key, embedding, { r2Key: key });
    return true;
  }

  /**
   * Smart store - automatically choose tier
   */
  async smartStore(
    key: string,
    value: any,
    options?: {
      importance?: number;
      accessFrequency?: 'high' | 'medium' | 'low';
      embedding?: number[];
    }
  ): Promise<StorageTier> {
    const importance = options?.importance || 0.5;
    const frequency = options?.accessFrequency || 'medium';

    // φ-weighted tier selection
    if (frequency === 'high' && importance > 0.7) {
      this.setImmediate(key, value, this.config.defaultTtl);
      await this.kvPut(key, value, { expirationTtl: this.config.defaultTtl / 1000 });
      return 'immediate';
    } else if (frequency === 'high') {
      await this.kvPut(key, value, { expirationTtl: this.config.defaultTtl / 1000 });
      return 'kv';
    } else if (importance > 0.8) {
      await this.r2Put(key, JSON.stringify(value), { contentType: 'application/json' });
      if (options?.embedding) {
        await this.vectorInsert(key, options.embedding, { importance });
      }
      return 'r2';
    } else {
      await this.kvPut(key, value, { expirationTtl: this.config.defaultTtl / 1000 });
      return 'kv';
    }
  }

  /**
   * Smart retrieve - search across tiers
   */
  async smartRetrieve(key: string): Promise<{ value: any; tier: StorageTier } | null> {
    // L1: Immediate
    const immediate = this.getImmediate(key);
    if (immediate !== undefined) {
      return { value: immediate, tier: 'immediate' };
    }

    // L2: KV
    const kv = await this.kvGet(key);
    if (kv !== null) {
      // Promote to immediate for faster future access
      this.setImmediate(key, kv, 60000); // 1 minute cache
      return { value: kv, tier: 'kv' };
    }

    // L3: R2
    const r2 = await this.r2GetJson(key);
    if (r2 !== null) {
      // Promote to KV for faster future access
      await this.kvPut(key, r2, { expirationTtl: 3600 }); // 1 hour
      return { value: r2, tier: 'r2' };
    }

    return null;
  }

  /**
   * Semantic search across storage
   */
  async semanticSearch(
    embedding: number[],
    options?: VectorizeOptions
  ): Promise<{ id: string; value: any; score: number }[]> {
    const vectorMatches = await this.vectorQuery(embedding, options);
    const results: { id: string; value: any; score: number }[] = [];

    for (const match of vectorMatches) {
      const retrieved = await this.smartRetrieve(match.id);
      if (retrieved) {
        results.push({
          id: match.id,
          value: retrieved.value,
          score: match.score,
        });
      }
    }

    return results;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  private generateEtag(): string {
    return `"${Date.now()}-${Math.random().toString(36).substr(2, 9)}"`;
  }

  /**
   * Get storage statistics
   */
  getStatistics(): MemoryHierarchyStats {
    let kvSize = 0;
    for (const entry of this.kvStorage.values()) {
      kvSize += JSON.stringify(entry.value).length;
    }

    let r2Size = 0;
    for (const obj of this.r2Storage.values()) {
      r2Size += obj.size;
    }

    let d1Rows = 0;
    for (const table of this.d1Tables.values()) {
      d1Rows += table.length;
    }

    return {
      immediate: {
        count: this.immediateMemory.size,
        sizeBytes: Array.from(this.immediateMemory.values())
          .reduce((acc, v) => acc + JSON.stringify(v.value).length, 0),
      },
      kv: {
        count: this.kvStorage.size,
        sizeBytes: kvSize,
      },
      r2: {
        count: this.r2Storage.size,
        sizeBytes: r2Size,
      },
      d1: {
        count: this.d1Tables.size,
        rows: d1Rows,
      },
      vectorize: {
        count: this.vectorIndex.size,
        dimensions: this.vectorIndex.size > 0 
          ? Array.from(this.vectorIndex.values())[0].vector.length 
          : 0,
      },
    };
  }

  /**
   * Clear all storage
   */
  clearAll(): void {
    this.immediateMemory.clear();
    this.kvStorage.clear();
    this.r2Storage.clear();
    this.d1Tables.clear();
    this.vectorIndex.clear();
    this.initializeD1Tables();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION III: EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const cloudflareStorageBridge = new CloudflareStorageBridge();

export default CloudflareStorageBridge;
