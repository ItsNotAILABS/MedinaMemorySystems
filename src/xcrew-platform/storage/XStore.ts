/**
 * XCREW XStore - KV + Object Storage System
 * Protocol: XCREW-STORE-001
 * 
 * Global key-value storage with R2-compatible object storage.
 * Features φ-harmonic TTL decay and edge-optimized caching.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const PHI_INV = 0.618033988749895;
const PROTOCOL_ID = 'XCREW-STORE-001';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

// KV Types
export interface XKVNamespace {
  get(key: string, options?: XKVGetOptions): Promise<string | null>;
  getWithMetadata<T = unknown>(key: string, options?: XKVGetOptions): Promise<XKVValueWithMetadata<T>>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: XKVPutOptions): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: XKVListOptions): Promise<XKVListResult>;
}

export type XKVValueType = 'text' | 'json' | 'arrayBuffer' | 'stream';

export interface XKVGetOptions {
  type?: XKVValueType;
  cacheTtl?: number;
}

export interface XKVPutOptions {
  expiration?: number;         // Unix timestamp
  expirationTtl?: number;      // Seconds from now
  metadata?: Record<string, string>;
  phiDecay?: boolean;          // Enable φ-harmonic TTL decay
}

export interface XKVValueWithMetadata<T = unknown> {
  value: string | null;
  metadata: T | null;
  expiration?: number;
  phiDecayRemaining?: number;
}

export interface XKVListOptions {
  prefix?: string;
  limit?: number;
  cursor?: string;
}

export interface XKVListResult {
  keys: XKVKey[];
  list_complete: boolean;
  cursor?: string;
}

export interface XKVKey {
  name: string;
  expiration?: number;
  metadata?: Record<string, string>;
}

// R2 Object Storage Types
export interface XR2Bucket {
  put(key: string, value: ReadableStream | ArrayBuffer | string | Blob, options?: XR2PutOptions): Promise<XR2Object>;
  get(key: string, options?: XR2GetOptions): Promise<XR2ObjectBody | null>;
  head(key: string): Promise<XR2Object | null>;
  delete(keys: string | string[]): Promise<void>;
  list(options?: XR2ListOptions): Promise<XR2Objects>;
  createMultipartUpload(key: string, options?: XR2MultipartOptions): Promise<XR2MultipartUpload>;
}

export interface XR2PutOptions {
  httpMetadata?: XR2HTTPMetadata;
  customMetadata?: Record<string, string>;
  md5?: ArrayBuffer | string;
  sha1?: ArrayBuffer | string;
  sha256?: ArrayBuffer | string;
  sha384?: ArrayBuffer | string;
  sha512?: ArrayBuffer | string;
  storageClass?: 'Standard' | 'InfrequentAccess';
}

export interface XR2GetOptions {
  range?: XR2Range;
  onlyIf?: XR2Conditional;
}

export interface XR2Range {
  offset?: number;
  length?: number;
  suffix?: number;
}

export interface XR2Conditional {
  etagMatches?: string;
  etagDoesNotMatch?: string;
  uploadedBefore?: Date;
  uploadedAfter?: Date;
}

export interface XR2HTTPMetadata {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

export interface XR2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  httpMetadata?: XR2HTTPMetadata;
  customMetadata?: Record<string, string>;
  checksums: XR2Checksums;
  storageClass: string;
}

export interface XR2ObjectBody extends XR2Object {
  body: ReadableStream;
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T = unknown>(): Promise<T>;
  blob(): Promise<Blob>;
}

export interface XR2Checksums {
  md5?: ArrayBuffer;
  sha1?: ArrayBuffer;
  sha256?: ArrayBuffer;
  sha384?: ArrayBuffer;
  sha512?: ArrayBuffer;
}

export interface XR2ListOptions {
  prefix?: string;
  delimiter?: string;
  cursor?: string;
  limit?: number;
  include?: ('httpMetadata' | 'customMetadata')[];
  startAfter?: string;
}

export interface XR2Objects {
  objects: XR2Object[];
  truncated: boolean;
  cursor?: string;
  delimitedPrefixes: string[];
}

export interface XR2MultipartOptions {
  httpMetadata?: XR2HTTPMetadata;
  customMetadata?: Record<string, string>;
}

export interface XR2MultipartUpload {
  key: string;
  uploadId: string;
  uploadPart(partNumber: number, value: ReadableStream | ArrayBuffer | string | Blob): Promise<XR2UploadedPart>;
  complete(uploadedParts: XR2UploadedPart[]): Promise<XR2Object>;
  abort(): Promise<void>;
}

export interface XR2UploadedPart {
  partNumber: number;
  etag: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// KV IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

interface KVEntry {
  value: string | ArrayBuffer;
  metadata?: Record<string, string>;
  expiration?: number;
  phiDecayStart?: number;
  phiDecayTtl?: number;
}

export class XKVNamespaceImpl implements XKVNamespace {
  private store: Map<string, KVEntry> = new Map();
  private readonly namespaceId: string;
  
  constructor(namespaceId: string) {
    this.namespaceId = namespaceId;
    console.log(`[${PROTOCOL_ID}] KV namespace ${namespaceId} initialized`);
  }
  
  async get(key: string, options?: XKVGetOptions): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    
    // Check expiration
    if (this.isExpired(entry)) {
      this.store.delete(key);
      return null;
    }
    
    // Apply φ-decay weight to freshness
    if (entry.phiDecayStart && entry.phiDecayTtl) {
      const elapsed = Date.now() - entry.phiDecayStart;
      const remaining = entry.phiDecayTtl - elapsed;
      if (remaining <= 0) {
        this.store.delete(key);
        return null;
      }
    }
    
    if (typeof entry.value === 'string') {
      return entry.value;
    }
    
    // Convert ArrayBuffer to string if needed
    const decoder = new TextDecoder();
    return decoder.decode(entry.value);
  }
  
  async getWithMetadata<T = unknown>(key: string, options?: XKVGetOptions): Promise<XKVValueWithMetadata<T>> {
    const entry = this.store.get(key);
    
    if (!entry || this.isExpired(entry)) {
      if (entry) this.store.delete(key);
      return { value: null, metadata: null };
    }
    
    let phiDecayRemaining: number | undefined;
    if (entry.phiDecayStart && entry.phiDecayTtl) {
      const elapsed = Date.now() - entry.phiDecayStart;
      phiDecayRemaining = Math.max(0, entry.phiDecayTtl - elapsed);
    }
    
    const value = typeof entry.value === 'string' 
      ? entry.value 
      : new TextDecoder().decode(entry.value);
    
    return {
      value,
      metadata: entry.metadata as T | null,
      expiration: entry.expiration,
      phiDecayRemaining
    };
  }
  
  async put(key: string, value: string | ArrayBuffer | ReadableStream, options?: XKVPutOptions): Promise<void> {
    let storedValue: string | ArrayBuffer;
    
    if (value instanceof ReadableStream) {
      const reader = value.getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        chunks.push(chunk);
      }
      const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
      storedValue = result.buffer;
    } else {
      storedValue = value;
    }
    
    const entry: KVEntry = {
      value: storedValue,
      metadata: options?.metadata
    };
    
    if (options?.expiration) {
      entry.expiration = options.expiration * 1000; // Convert to ms
    } else if (options?.expirationTtl) {
      entry.expiration = Date.now() + options.expirationTtl * 1000;
    }
    
    // φ-harmonic decay
    if (options?.phiDecay && entry.expiration) {
      const ttl = entry.expiration - Date.now();
      entry.phiDecayStart = Date.now();
      entry.phiDecayTtl = ttl * PHI; // Extended TTL with φ decay
    }
    
    this.store.set(key, entry);
  }
  
  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
  
  async list(options?: XKVListOptions): Promise<XKVListResult> {
    const limit = options?.limit || 1000;
    const prefix = options?.prefix || '';
    
    const keys: XKVKey[] = [];
    let count = 0;
    let cursorReached = !options?.cursor;
    
    for (const [name, entry] of this.store.entries()) {
      if (!name.startsWith(prefix)) continue;
      
      if (!cursorReached) {
        if (name === options?.cursor) {
          cursorReached = true;
        }
        continue;
      }
      
      if (count >= limit) {
        return {
          keys,
          list_complete: false,
          cursor: name
        };
      }
      
      if (!this.isExpired(entry)) {
        keys.push({
          name,
          expiration: entry.expiration ? Math.floor(entry.expiration / 1000) : undefined,
          metadata: entry.metadata
        });
        count++;
      }
    }
    
    return {
      keys,
      list_complete: true
    };
  }
  
  private isExpired(entry: KVEntry): boolean {
    if (!entry.expiration) return false;
    return Date.now() > entry.expiration;
  }
  
  // Internal methods for testing
  _getSize(): number {
    return this.store.size;
  }
  
  _clear(): void {
    this.store.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// R2 OBJECT STORAGE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

interface R2StoredObject {
  key: string;
  value: ArrayBuffer;
  version: string;
  etag: string;
  uploaded: Date;
  size: number;
  httpMetadata?: XR2HTTPMetadata;
  customMetadata?: Record<string, string>;
  storageClass: string;
}

export class XR2BucketImpl implements XR2Bucket {
  private objects: Map<string, R2StoredObject> = new Map();
  private multipartUploads: Map<string, Map<number, ArrayBuffer>> = new Map();
  private readonly bucketName: string;
  
  constructor(bucketName: string) {
    this.bucketName = bucketName;
    console.log(`[${PROTOCOL_ID}] R2 bucket ${bucketName} initialized`);
  }
  
  async put(
    key: string, 
    value: ReadableStream | ArrayBuffer | string | Blob, 
    options?: XR2PutOptions
  ): Promise<XR2Object> {
    let buffer: ArrayBuffer;
    
    if (value instanceof ArrayBuffer) {
      buffer = value;
    } else if (typeof value === 'string') {
      buffer = new TextEncoder().encode(value).buffer;
    } else if (value instanceof Blob) {
      buffer = await value.arrayBuffer();
    } else {
      // ReadableStream
      const reader = value.getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        chunks.push(chunk);
      }
      const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
      buffer = result.buffer;
    }
    
    const version = `v${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const etag = await this.computeETag(buffer);
    
    const storedObject: R2StoredObject = {
      key,
      value: buffer,
      version,
      etag,
      uploaded: new Date(),
      size: buffer.byteLength,
      httpMetadata: options?.httpMetadata,
      customMetadata: options?.customMetadata,
      storageClass: options?.storageClass || 'Standard'
    };
    
    this.objects.set(key, storedObject);
    
    return this.toR2Object(storedObject);
  }
  
  async get(key: string, options?: XR2GetOptions): Promise<XR2ObjectBody | null> {
    const stored = this.objects.get(key);
    if (!stored) return null;
    
    // Check conditionals
    if (options?.onlyIf) {
      if (options.onlyIf.etagMatches && options.onlyIf.etagMatches !== stored.etag) {
        return null;
      }
      if (options.onlyIf.etagDoesNotMatch && options.onlyIf.etagDoesNotMatch === stored.etag) {
        return null;
      }
    }
    
    let bodyBuffer = stored.value;
    
    // Handle range requests
    if (options?.range) {
      const { offset = 0, length, suffix } = options.range;
      if (suffix) {
        bodyBuffer = stored.value.slice(-suffix);
      } else if (length) {
        bodyBuffer = stored.value.slice(offset, offset + length);
      } else {
        bodyBuffer = stored.value.slice(offset);
      }
    }
    
    return this.toR2ObjectBody(stored, bodyBuffer);
  }
  
  async head(key: string): Promise<XR2Object | null> {
    const stored = this.objects.get(key);
    if (!stored) return null;
    return this.toR2Object(stored);
  }
  
  async delete(keys: string | string[]): Promise<void> {
    const keysArray = Array.isArray(keys) ? keys : [keys];
    for (const key of keysArray) {
      this.objects.delete(key);
    }
  }
  
  async list(options?: XR2ListOptions): Promise<XR2Objects> {
    const limit = options?.limit || 1000;
    const prefix = options?.prefix || '';
    const delimiter = options?.delimiter;
    
    const objects: XR2Object[] = [];
    const prefixes = new Set<string>();
    let count = 0;
    let cursorReached = !options?.cursor;
    
    const sortedKeys = Array.from(this.objects.keys()).sort();
    
    for (const key of sortedKeys) {
      if (options?.startAfter && key <= options.startAfter) continue;
      if (!key.startsWith(prefix)) continue;
      
      if (!cursorReached) {
        if (key === options?.cursor) {
          cursorReached = true;
        }
        continue;
      }
      
      // Handle delimiter for folder-like listing
      if (delimiter) {
        const remainder = key.slice(prefix.length);
        const delimiterIndex = remainder.indexOf(delimiter);
        if (delimiterIndex >= 0) {
          prefixes.add(prefix + remainder.slice(0, delimiterIndex + 1));
          continue;
        }
      }
      
      if (count >= limit) {
        return {
          objects,
          truncated: true,
          cursor: key,
          delimitedPrefixes: Array.from(prefixes)
        };
      }
      
      const stored = this.objects.get(key)!;
      objects.push(this.toR2Object(stored));
      count++;
    }
    
    return {
      objects,
      truncated: false,
      delimitedPrefixes: Array.from(prefixes)
    };
  }
  
  async createMultipartUpload(key: string, options?: XR2MultipartOptions): Promise<XR2MultipartUpload> {
    const uploadId = `mpu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.multipartUploads.set(uploadId, new Map());
    
    const bucket = this;
    
    return {
      key,
      uploadId,
      async uploadPart(partNumber: number, value: ReadableStream | ArrayBuffer | string | Blob): Promise<XR2UploadedPart> {
        let buffer: ArrayBuffer;
        
        if (value instanceof ArrayBuffer) {
          buffer = value;
        } else if (typeof value === 'string') {
          buffer = new TextEncoder().encode(value).buffer;
        } else if (value instanceof Blob) {
          buffer = await value.arrayBuffer();
        } else {
          const reader = value.getReader();
          const chunks: Uint8Array[] = [];
          while (true) {
            const { done, value: chunk } = await reader.read();
            if (done) break;
            chunks.push(chunk);
          }
          const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
          const result = new Uint8Array(totalLength);
          let offset = 0;
          for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
          }
          buffer = result.buffer;
        }
        
        const parts = bucket.multipartUploads.get(uploadId);
        if (!parts) throw new Error('Upload not found');
        parts.set(partNumber, buffer);
        
        const etag = await bucket.computeETag(buffer);
        return { partNumber, etag };
      },
      async complete(uploadedParts: XR2UploadedPart[]): Promise<XR2Object> {
        const parts = bucket.multipartUploads.get(uploadId);
        if (!parts) throw new Error('Upload not found');
        
        // Sort parts and combine
        const sortedPartNumbers = Array.from(parts.keys()).sort((a, b) => a - b);
        const totalSize = sortedPartNumbers.reduce((acc, pn) => acc + parts.get(pn)!.byteLength, 0);
        const combined = new Uint8Array(totalSize);
        let offset = 0;
        
        for (const partNumber of sortedPartNumbers) {
          const part = parts.get(partNumber)!;
          combined.set(new Uint8Array(part), offset);
          offset += part.byteLength;
        }
        
        bucket.multipartUploads.delete(uploadId);
        
        return bucket.put(key, combined.buffer, options);
      },
      async abort(): Promise<void> {
        bucket.multipartUploads.delete(uploadId);
      }
    };
  }
  
  private async computeETag(buffer: ArrayBuffer): Promise<string> {
    // Simple hash for demo - in production would use proper MD5
    const view = new Uint8Array(buffer);
    let hash = 0;
    for (let i = 0; i < view.length; i++) {
      hash = ((hash << 5) - hash + view[i]) | 0;
    }
    return `"${Math.abs(hash).toString(16).padStart(32, '0')}"`;
  }
  
  private toR2Object(stored: R2StoredObject): XR2Object {
    return {
      key: stored.key,
      version: stored.version,
      size: stored.size,
      etag: stored.etag,
      httpEtag: stored.etag,
      uploaded: stored.uploaded,
      httpMetadata: stored.httpMetadata,
      customMetadata: stored.customMetadata,
      checksums: {},
      storageClass: stored.storageClass
    };
  }
  
  private toR2ObjectBody(stored: R2StoredObject, buffer: ArrayBuffer): XR2ObjectBody {
    let bodyUsed = false;
    
    return {
      ...this.toR2Object(stored),
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(buffer));
          controller.close();
        }
      }),
      bodyUsed,
      async arrayBuffer() {
        bodyUsed = true;
        return buffer;
      },
      async text() {
        bodyUsed = true;
        return new TextDecoder().decode(buffer);
      },
      async json<T = unknown>() {
        bodyUsed = true;
        return JSON.parse(new TextDecoder().decode(buffer)) as T;
      },
      async blob() {
        bodyUsed = true;
        return new Blob([buffer]);
      }
    };
  }
  
  // Internal methods for testing
  _getSize(): number {
    return this.objects.size;
  }
  
  _clear(): void {
    this.objects.clear();
    this.multipartUploads.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// XSTORE MANAGER
// ═══════════════════════════════════════════════════════════════════════════

export class XStoreManager {
  private static instance: XStoreManager | null = null;
  
  private kvNamespaces: Map<string, XKVNamespaceImpl> = new Map();
  private r2Buckets: Map<string, XR2BucketImpl> = new Map();
  
  private constructor() {
    console.log(`[${PROTOCOL_ID}] XStore Manager initialized`);
  }
  
  static getInstance(): XStoreManager {
    if (!XStoreManager.instance) {
      XStoreManager.instance = new XStoreManager();
    }
    return XStoreManager.instance;
  }
  
  /**
   * Get or create a KV namespace
   */
  getKVNamespace(namespaceId: string): XKVNamespace {
    let namespace = this.kvNamespaces.get(namespaceId);
    if (!namespace) {
      namespace = new XKVNamespaceImpl(namespaceId);
      this.kvNamespaces.set(namespaceId, namespace);
    }
    return namespace;
  }
  
  /**
   * Get or create an R2 bucket
   */
  getR2Bucket(bucketName: string): XR2Bucket {
    let bucket = this.r2Buckets.get(bucketName);
    if (!bucket) {
      bucket = new XR2BucketImpl(bucketName);
      this.r2Buckets.set(bucketName, bucket);
    }
    return bucket;
  }
  
  /**
   * Delete a KV namespace
   */
  deleteKVNamespace(namespaceId: string): boolean {
    return this.kvNamespaces.delete(namespaceId);
  }
  
  /**
   * Delete an R2 bucket
   */
  deleteR2Bucket(bucketName: string): boolean {
    return this.r2Buckets.delete(bucketName);
  }
  
  /**
   * List all KV namespaces
   */
  listKVNamespaces(): string[] {
    return Array.from(this.kvNamespaces.keys());
  }
  
  /**
   * List all R2 buckets
   */
  listR2Buckets(): string[] {
    return Array.from(this.r2Buckets.keys());
  }
  
  /**
   * Get storage statistics
   */
  getStatistics(): {
    kvNamespaceCount: number;
    r2BucketCount: number;
    totalKVKeys: number;
    totalR2Objects: number;
  } {
    let totalKVKeys = 0;
    let totalR2Objects = 0;
    
    for (const ns of this.kvNamespaces.values()) {
      totalKVKeys += (ns as XKVNamespaceImpl)._getSize();
    }
    
    for (const bucket of this.r2Buckets.values()) {
      totalR2Objects += (bucket as XR2BucketImpl)._getSize();
    }
    
    return {
      kvNamespaceCount: this.kvNamespaces.size,
      r2BucketCount: this.r2Buckets.size,
      totalKVKeys,
      totalR2Objects
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export function getXStoreManager(): XStoreManager {
  return XStoreManager.getInstance();
}

export function createKVNamespace(namespaceId: string): XKVNamespace {
  return getXStoreManager().getKVNamespace(namespaceId);
}

export function createR2Bucket(bucketName: string): XR2Bucket {
  return getXStoreManager().getR2Bucket(bucketName);
}

export default {
  XStoreManager,
  getXStoreManager,
  createKVNamespace,
  createR2Bucket,
  XKVNamespaceImpl,
  XR2BucketImpl,
  PROTOCOL_ID
};
