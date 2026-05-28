/**
 * XCREW XDurable - Durable Objects for Stateful Edge
 * Protocol: XCREW-DURABLE-001
 * 
 * Durable Objects provide strongly consistent, coordinated state at the edge.
 * Features automatic persistence, alarms, and hibernation.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const PROTOCOL_ID = 'XCREW-DURABLE-001';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface DurableObjectId {
  toString(): string;
  equals(other: DurableObjectId): boolean;
  readonly name?: string;
}

export interface DurableObjectNamespace {
  idFromName(name: string): DurableObjectId;
  idFromString(id: string): DurableObjectId;
  newUniqueId(options?: { jurisdiction?: 'eu' }): DurableObjectId;
  get(id: DurableObjectId): DurableObjectStub;
}

export interface DurableObjectStub {
  readonly id: DurableObjectId;
  readonly name?: string;
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

export interface DurableObjectState {
  readonly id: DurableObjectId;
  readonly storage: DurableObjectStorage;
  waitUntil(promise: Promise<any>): void;
  blockConcurrencyWhile<T>(callback: () => Promise<T>): Promise<T>;
  acceptWebSocket(ws: WebSocket, tags?: string[]): void;
  getWebSockets(tag?: string): WebSocket[];
  setWebSocketAutoResponse(maybeReqResp?: WebSocketRequestResponsePair): void;
  getWebSocketAutoResponse(): WebSocketRequestResponsePair | null;
  getWebSocketAutoResponseTimestamp(ws: WebSocket): Date | null;
  setHibernatableWebSocketEventTimeout(timeout: number): void;
  getTags(ws: WebSocket): string[];
}

export interface WebSocketRequestResponsePair {
  request: string;
  response: string;
}

export interface DurableObjectStorage {
  get<T = unknown>(key: string, options?: DurableObjectGetOptions): Promise<T | undefined>;
  get<T = unknown>(keys: string[], options?: DurableObjectGetOptions): Promise<Map<string, T>>;
  put<T>(key: string, value: T, options?: DurableObjectPutOptions): Promise<void>;
  put<T>(entries: Record<string, T>, options?: DurableObjectPutOptions): Promise<void>;
  delete(key: string, options?: DurableObjectPutOptions): Promise<boolean>;
  delete(keys: string[], options?: DurableObjectPutOptions): Promise<number>;
  deleteAll(options?: DurableObjectPutOptions): Promise<void>;
  list<T = unknown>(options?: DurableObjectListOptions): Promise<Map<string, T>>;
  getAlarm(options?: DurableObjectGetAlarmOptions): Promise<number | null>;
  setAlarm(scheduledTime: number | Date, options?: DurableObjectSetAlarmOptions): Promise<void>;
  deleteAlarm(options?: DurableObjectSetAlarmOptions): Promise<void>;
  sync(): Promise<void>;
  transaction<T>(closure: (txn: DurableObjectTransaction) => Promise<T>): Promise<T>;
  transactionSync<T>(closure: () => T): T;
  getCurrentBookmark(): Promise<string>;
  getBookmarkForTime(timestamp: number | Date): Promise<string>;
  onNextSessionRestoreBookmark(bookmark: string): void;
}

export interface DurableObjectGetOptions {
  allowConcurrency?: boolean;
  noCache?: boolean;
}

export interface DurableObjectPutOptions {
  allowConcurrency?: boolean;
  allowUnconfirmed?: boolean;
  noCache?: boolean;
}

export interface DurableObjectListOptions {
  start?: string;
  startAfter?: string;
  end?: string;
  prefix?: string;
  reverse?: boolean;
  limit?: number;
  allowConcurrency?: boolean;
  noCache?: boolean;
}

export interface DurableObjectGetAlarmOptions {
  allowConcurrency?: boolean;
}

export interface DurableObjectSetAlarmOptions {
  allowConcurrency?: boolean;
  allowUnconfirmed?: boolean;
}

export interface DurableObjectTransaction {
  get<T = unknown>(key: string, options?: DurableObjectGetOptions): Promise<T | undefined>;
  get<T = unknown>(keys: string[], options?: DurableObjectGetOptions): Promise<Map<string, T>>;
  put<T>(key: string, value: T, options?: DurableObjectPutOptions): Promise<void>;
  put<T>(entries: Record<string, T>, options?: DurableObjectPutOptions): Promise<void>;
  delete(key: string, options?: DurableObjectPutOptions): Promise<boolean>;
  delete(keys: string[], options?: DurableObjectPutOptions): Promise<number>;
  deleteAll(options?: DurableObjectPutOptions): Promise<void>;
  list<T = unknown>(options?: DurableObjectListOptions): Promise<Map<string, T>>;
  getAlarm(options?: DurableObjectGetAlarmOptions): Promise<number | null>;
  setAlarm(scheduledTime: number | Date, options?: DurableObjectSetAlarmOptions): Promise<void>;
  deleteAlarm(options?: DurableObjectSetAlarmOptions): Promise<void>;
  rollback(): void;
}

// ═══════════════════════════════════════════════════════════════════════════
// DURABLE OBJECT ID IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

class DurableObjectIdImpl implements DurableObjectId {
  private readonly _id: string;
  readonly name?: string;
  
  constructor(id: string, name?: string) {
    this._id = id;
    this.name = name;
  }
  
  toString(): string {
    return this._id;
  }
  
  equals(other: DurableObjectId): boolean {
    return this._id === other.toString();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DURABLE OBJECT STORAGE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

class DurableObjectStorageImpl implements DurableObjectStorage {
  private data: Map<string, any> = new Map();
  private alarm: number | null = null;
  private transactionData: Map<string, any> | null = null;
  private inTransaction = false;
  private readonly objectId: string;
  
  constructor(objectId: string) {
    this.objectId = objectId;
  }
  
  async get<T = unknown>(keyOrKeys: string | string[], options?: DurableObjectGetOptions): Promise<T | undefined | Map<string, T>> {
    const source = this.inTransaction ? this.transactionData! : this.data;
    
    if (Array.isArray(keyOrKeys)) {
      const result = new Map<string, T>();
      for (const key of keyOrKeys) {
        const value = source.get(key);
        if (value !== undefined) {
          result.set(key, value);
        }
      }
      return result;
    }
    
    return source.get(keyOrKeys);
  }
  
  async put<T>(keyOrEntries: string | Record<string, T>, valueOrOptions?: T | DurableObjectPutOptions, options?: DurableObjectPutOptions): Promise<void> {
    const target = this.inTransaction ? this.transactionData! : this.data;
    
    if (typeof keyOrEntries === 'string') {
      target.set(keyOrEntries, valueOrOptions);
    } else {
      for (const [key, value] of Object.entries(keyOrEntries)) {
        target.set(key, value);
      }
    }
  }
  
  async delete(keyOrKeys: string | string[], options?: DurableObjectPutOptions): Promise<boolean | number> {
    const target = this.inTransaction ? this.transactionData! : this.data;
    
    if (Array.isArray(keyOrKeys)) {
      let count = 0;
      for (const key of keyOrKeys) {
        if (target.delete(key)) count++;
      }
      return count;
    }
    
    return target.delete(keyOrKeys);
  }
  
  async deleteAll(options?: DurableObjectPutOptions): Promise<void> {
    const target = this.inTransaction ? this.transactionData! : this.data;
    target.clear();
  }
  
  async list<T = unknown>(options?: DurableObjectListOptions): Promise<Map<string, T>> {
    const source = this.inTransaction ? this.transactionData! : this.data;
    const result = new Map<string, T>();
    
    let keys = Array.from(source.keys()).sort();
    
    // Apply filters
    if (options?.prefix) {
      keys = keys.filter(k => k.startsWith(options.prefix!));
    }
    if (options?.start) {
      keys = keys.filter(k => k >= options.start!);
    }
    if (options?.startAfter) {
      keys = keys.filter(k => k > options.startAfter!);
    }
    if (options?.end) {
      keys = keys.filter(k => k < options.end!);
    }
    if (options?.reverse) {
      keys = keys.reverse();
    }
    if (options?.limit) {
      keys = keys.slice(0, options.limit);
    }
    
    for (const key of keys) {
      result.set(key, source.get(key));
    }
    
    return result;
  }
  
  async getAlarm(options?: DurableObjectGetAlarmOptions): Promise<number | null> {
    return this.alarm;
  }
  
  async setAlarm(scheduledTime: number | Date, options?: DurableObjectSetAlarmOptions): Promise<void> {
    this.alarm = scheduledTime instanceof Date ? scheduledTime.getTime() : scheduledTime;
  }
  
  async deleteAlarm(options?: DurableObjectSetAlarmOptions): Promise<void> {
    this.alarm = null;
  }
  
  async sync(): Promise<void> {
    // In-memory implementation - sync is a no-op
  }
  
  async transaction<T>(closure: (txn: DurableObjectTransaction) => Promise<T>): Promise<T> {
    this.inTransaction = true;
    this.transactionData = new Map(this.data);
    
    const txn: DurableObjectTransaction = {
      get: this.get.bind(this),
      put: this.put.bind(this),
      delete: this.delete.bind(this),
      deleteAll: this.deleteAll.bind(this),
      list: this.list.bind(this),
      getAlarm: this.getAlarm.bind(this),
      setAlarm: this.setAlarm.bind(this),
      deleteAlarm: this.deleteAlarm.bind(this),
      rollback: () => {
        this.transactionData = new Map(this.data);
      }
    };
    
    try {
      const result = await closure(txn);
      this.data = this.transactionData;
      return result;
    } finally {
      this.inTransaction = false;
      this.transactionData = null;
    }
  }
  
  transactionSync<T>(closure: () => T): T {
    this.inTransaction = true;
    this.transactionData = new Map(this.data);
    
    try {
      const result = closure();
      this.data = this.transactionData;
      return result;
    } finally {
      this.inTransaction = false;
      this.transactionData = null;
    }
  }
  
  async getCurrentBookmark(): Promise<string> {
    return `bookmark-${this.objectId}-${Date.now()}`;
  }
  
  async getBookmarkForTime(timestamp: number | Date): Promise<string> {
    const ts = timestamp instanceof Date ? timestamp.getTime() : timestamp;
    return `bookmark-${this.objectId}-${ts}`;
  }
  
  onNextSessionRestoreBookmark(bookmark: string): void {
    // Implementation for session restore
    console.log(`[${PROTOCOL_ID}] Bookmark set for restore: ${bookmark}`);
  }
  
  // Internal method for getting size
  _getSize(): number {
    return this.data.size;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DURABLE OBJECT STATE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

class DurableObjectStateImpl implements DurableObjectState {
  readonly id: DurableObjectId;
  readonly storage: DurableObjectStorage;
  private webSockets: Map<WebSocket, string[]> = new Map();
  private autoResponse: WebSocketRequestResponsePair | null = null;
  private autoResponseTimestamps: Map<WebSocket, Date> = new Map();
  private waitUntilPromises: Promise<any>[] = [];
  
  constructor(id: DurableObjectId) {
    this.id = id;
    this.storage = new DurableObjectStorageImpl(id.toString());
  }
  
  waitUntil(promise: Promise<any>): void {
    this.waitUntilPromises.push(promise);
  }
  
  async blockConcurrencyWhile<T>(callback: () => Promise<T>): Promise<T> {
    // In a real implementation, this would acquire a lock
    return await callback();
  }
  
  acceptWebSocket(ws: WebSocket, tags?: string[]): void {
    this.webSockets.set(ws, tags || []);
  }
  
  getWebSockets(tag?: string): WebSocket[] {
    if (!tag) {
      return Array.from(this.webSockets.keys());
    }
    
    const result: WebSocket[] = [];
    for (const [ws, tags] of this.webSockets) {
      if (tags.includes(tag)) {
        result.push(ws);
      }
    }
    return result;
  }
  
  setWebSocketAutoResponse(maybeReqResp?: WebSocketRequestResponsePair): void {
    this.autoResponse = maybeReqResp || null;
  }
  
  getWebSocketAutoResponse(): WebSocketRequestResponsePair | null {
    return this.autoResponse;
  }
  
  getWebSocketAutoResponseTimestamp(ws: WebSocket): Date | null {
    return this.autoResponseTimestamps.get(ws) || null;
  }
  
  setHibernatableWebSocketEventTimeout(timeout: number): void {
    // Implementation for hibernatable websocket timeout
  }
  
  getTags(ws: WebSocket): string[] {
    return this.webSockets.get(ws) || [];
  }
  
  // Internal method to finalize
  async _finalize(): Promise<void> {
    await Promise.allSettled(this.waitUntilPromises);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ABSTRACT DURABLE OBJECT CLASS
// ═══════════════════════════════════════════════════════════════════════════

export abstract class XDurableObject {
  protected state: DurableObjectState;
  protected env: any;
  
  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.env = env;
  }
  
  /**
   * Handle incoming fetch requests
   */
  abstract fetch(request: Request): Promise<Response>;
  
  /**
   * Handle alarm events
   */
  async alarm(): Promise<void> {
    // Default implementation - override in subclass
  }
  
  /**
   * Handle WebSocket messages (for hibernatable WebSockets)
   */
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    // Default implementation - override in subclass
  }
  
  /**
   * Handle WebSocket close events
   */
  async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean): Promise<void> {
    // Default implementation - override in subclass
  }
  
  /**
   * Handle WebSocket error events
   */
  async webSocketError(ws: WebSocket, error: unknown): Promise<void> {
    // Default implementation - override in subclass
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DURABLE OBJECT STUB IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

class DurableObjectStubImpl implements DurableObjectStub {
  readonly id: DurableObjectId;
  readonly name?: string;
  private instance: XDurableObject | null = null;
  private instanceFactory: () => XDurableObject;
  
  constructor(id: DurableObjectId, factory: () => XDurableObject) {
    this.id = id;
    this.name = id.name;
    this.instanceFactory = factory;
  }
  
  async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    // Lazy instantiation
    if (!this.instance) {
      this.instance = this.instanceFactory();
    }
    
    const request = input instanceof Request 
      ? input 
      : new Request(input.toString(), init);
    
    return this.instance.fetch(request);
  }
  
  // Internal method to get instance
  _getInstance(): XDurableObject | null {
    return this.instance;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DURABLE OBJECT NAMESPACE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

class DurableObjectNamespaceImpl implements DurableObjectNamespace {
  private readonly className: string;
  private readonly objectClass: new (state: DurableObjectState, env: any) => XDurableObject;
  private readonly env: any;
  private instances: Map<string, DurableObjectStubImpl> = new Map();
  
  constructor(
    className: string, 
    objectClass: new (state: DurableObjectState, env: any) => XDurableObject,
    env: any
  ) {
    this.className = className;
    this.objectClass = objectClass;
    this.env = env;
  }
  
  idFromName(name: string): DurableObjectId {
    // Create deterministic ID from name
    const id = `${this.className}-${this.hashName(name)}`;
    return new DurableObjectIdImpl(id, name);
  }
  
  idFromString(id: string): DurableObjectId {
    return new DurableObjectIdImpl(id);
  }
  
  newUniqueId(options?: { jurisdiction?: 'eu' }): DurableObjectId {
    const id = `${this.className}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return new DurableObjectIdImpl(id);
  }
  
  get(id: DurableObjectId): DurableObjectStub {
    const idString = id.toString();
    
    let stub = this.instances.get(idString);
    if (!stub) {
      const state = new DurableObjectStateImpl(id);
      stub = new DurableObjectStubImpl(id, () => new this.objectClass(state, this.env));
      this.instances.set(idString, stub);
    }
    
    return stub;
  }
  
  private hashName(name: string): string {
    // Simple hash for demo - in production would use proper hashing
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36).padStart(12, '0');
  }
  
  // Internal method to get instance count
  _getInstanceCount(): number {
    return this.instances.size;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// XDURABLE MANAGER
// ═══════════════════════════════════════════════════════════════════════════

export class XDurableManager {
  private static instance: XDurableManager | null = null;
  
  private namespaces: Map<string, DurableObjectNamespaceImpl> = new Map();
  private registeredClasses: Map<string, new (state: DurableObjectState, env: any) => XDurableObject> = new Map();
  private alarmCheckInterval: NodeJS.Timeout | null = null;
  
  private constructor() {
    // Start alarm checker
    this.alarmCheckInterval = setInterval(() => {
      this.checkAlarms();
    }, 1000);
    
    console.log(`[${PROTOCOL_ID}] XDurable Manager initialized`);
  }
  
  static getInstance(): XDurableManager {
    if (!XDurableManager.instance) {
      XDurableManager.instance = new XDurableManager();
    }
    return XDurableManager.instance;
  }
  
  /**
   * Register a Durable Object class
   */
  registerClass(
    className: string, 
    objectClass: new (state: DurableObjectState, env: any) => XDurableObject
  ): void {
    this.registeredClasses.set(className, objectClass);
    console.log(`[${PROTOCOL_ID}] Registered Durable Object class: ${className}`);
  }
  
  /**
   * Get a namespace for a registered class
   */
  getNamespace(className: string, env?: any): DurableObjectNamespace {
    let namespace = this.namespaces.get(className);
    if (!namespace) {
      const objectClass = this.registeredClasses.get(className);
      if (!objectClass) {
        throw new Error(`Durable Object class not registered: ${className}`);
      }
      namespace = new DurableObjectNamespaceImpl(className, objectClass, env || {});
      this.namespaces.set(className, namespace);
    }
    return namespace;
  }
  
  /**
   * List all registered classes
   */
  listClasses(): string[] {
    return Array.from(this.registeredClasses.keys());
  }
  
  /**
   * Get statistics
   */
  getStatistics(): {
    registeredClasses: number;
    activeNamespaces: number;
    totalInstances: number;
  } {
    let totalInstances = 0;
    for (const ns of this.namespaces.values()) {
      totalInstances += (ns as DurableObjectNamespaceImpl)._getInstanceCount();
    }
    
    return {
      registeredClasses: this.registeredClasses.size,
      activeNamespaces: this.namespaces.size,
      totalInstances
    };
  }
  
  /**
   * Check and trigger alarms
   */
  private async checkAlarms(): Promise<void> {
    const now = Date.now();
    
    for (const namespace of this.namespaces.values()) {
      // In a real implementation, would iterate through instances
      // and check their alarm states
    }
  }
  
  /**
   * Shutdown manager
   */
  shutdown(): void {
    if (this.alarmCheckInterval) {
      clearInterval(this.alarmCheckInterval);
      this.alarmCheckInterval = null;
    }
    this.namespaces.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export function getXDurableManager(): XDurableManager {
  return XDurableManager.getInstance();
}

export function registerDurableObject(
  className: string, 
  objectClass: new (state: DurableObjectState, env: any) => XDurableObject
): void {
  getXDurableManager().registerClass(className, objectClass);
}

export function getDurableObjectNamespace(className: string, env?: any): DurableObjectNamespace {
  return getXDurableManager().getNamespace(className, env);
}

export default {
  XDurableManager,
  getXDurableManager,
  registerDurableObject,
  getDurableObjectNamespace,
  XDurableObject,
  PROTOCOL_ID
};
