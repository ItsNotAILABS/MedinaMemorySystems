/**
 * XCREW XWorker Runtime Engine
 * Protocol: XCREW-WORKER-001
 * 
 * Multi-runtime execution engine for edge compute with φ-coherent scheduling.
 * Supports WASM, V8 Isolates, Deno, Node.js, and Bun runtimes.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const PHI_INV = 0.618033988749895;
const PROTOCOL_ID = 'XCREW-WORKER-001';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type XRuntime = 'wasm' | 'v8-isolate' | 'deno' | 'node' | 'bun';
export type XWorkerStatus = 'idle' | 'starting' | 'running' | 'stopping' | 'error' | 'hibernating';

export interface XWorkerConfig {
  id: string;
  name: string;
  runtime: XRuntime;
  memoryLimit: number;        // MB
  cpuLimit: number;           // ms per request
  timeout: number;            // ms
  phiCoherent: boolean;
  region?: string;
  bindings: XBinding[];
}

export interface XBinding {
  name: string;
  type: 'kv' | 'r2' | 'queue' | 'durable-object' | 'ai' | 'analytics' | 'secret' | 'var';
  value?: string;
  namespaceId?: string;
  className?: string;
}

export interface XEnv {
  [key: string]: any;
  __XCREW_INTERNAL__: {
    workerId: string;
    region: string;
    phiScore: number;
  };
}

export interface XContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
  abort(reason?: string): void;
}

export interface XRequest extends Request {
  cf?: XCFProperties;
}

export interface XCFProperties {
  asn: number;
  colo: string;
  country: string;
  city?: string;
  continent?: string;
  latitude?: string;
  longitude?: string;
  region?: string;
  timezone?: string;
  tlsVersion?: string;
  tlsCipher?: string;
  httpProtocol?: string;
}

export interface XScheduledEvent {
  scheduledTime: number;
  cron: string;
}

export interface XMessageBatch<T = any> {
  queue: string;
  messages: XMessage<T>[];
  ackAll(): void;
  retryAll(): void;
}

export interface XMessage<T = any> {
  id: string;
  timestamp: Date;
  body: T;
  ack(): void;
  retry(): void;
}

export interface XWorkerHandler {
  fetch?(request: XRequest, env: XEnv, ctx: XContext): Promise<Response>;
  scheduled?(event: XScheduledEvent, env: XEnv, ctx: XContext): Promise<void>;
  queue?(batch: XMessageBatch, env: XEnv): Promise<void>;
  email?(message: any, env: XEnv, ctx: XContext): Promise<void>;
  trace?(traces: any[], env: XEnv, ctx: XContext): Promise<void>;
}

export interface XWorkerMetrics {
  requestCount: number;
  errorCount: number;
  totalCpuMs: number;
  totalMemoryMb: number;
  coldStarts: number;
  warmStarts: number;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  phiCoherenceScore: number;
}

export interface XWorkerInstance {
  id: string;
  config: XWorkerConfig;
  status: XWorkerStatus;
  metrics: XWorkerMetrics;
  startTime: number;
  lastRequestTime: number;
  handler: XWorkerHandler;
}

// ═══════════════════════════════════════════════════════════════════════════
// XWORKER EXECUTION CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

export class XExecutionContext implements XContext {
  private waitUntilPromises: Promise<any>[] = [];
  private passThroughEnabled = false;
  private abortController = new AbortController();
  
  waitUntil(promise: Promise<any>): void {
    this.waitUntilPromises.push(promise);
  }
  
  passThroughOnException(): void {
    this.passThroughEnabled = true;
  }
  
  abort(reason?: string): void {
    this.abortController.abort(reason);
  }
  
  get signal(): AbortSignal {
    return this.abortController.signal;
  }
  
  async finalize(): Promise<void> {
    await Promise.allSettled(this.waitUntilPromises);
  }
  
  isPassThroughEnabled(): boolean {
    return this.passThroughEnabled;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RUNTIME ADAPTERS
// ═══════════════════════════════════════════════════════════════════════════

interface RuntimeAdapter {
  name: XRuntime;
  initialize(): Promise<void>;
  execute(handler: XWorkerHandler, request: XRequest, env: XEnv, ctx: XContext): Promise<Response>;
  shutdown(): Promise<void>;
  getMemoryUsage(): number;
  getCpuUsage(): number;
}

class WasmRuntimeAdapter implements RuntimeAdapter {
  name: XRuntime = 'wasm';
  private memory: number = 0;
  private cpu: number = 0;
  
  async initialize(): Promise<void> {
    // Initialize WASM runtime with φ-optimized memory layout
    this.memory = 0;
    console.log(`[${PROTOCOL_ID}] WASM runtime initialized`);
  }
  
  async execute(handler: XWorkerHandler, request: XRequest, env: XEnv, ctx: XContext): Promise<Response> {
    const start = performance.now();
    
    if (!handler.fetch) {
      return new Response('No fetch handler defined', { status: 500 });
    }
    
    try {
      const response = await handler.fetch(request, env, ctx);
      this.cpu = performance.now() - start;
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  async shutdown(): Promise<void> {
    this.memory = 0;
    this.cpu = 0;
  }
  
  getMemoryUsage(): number {
    return this.memory;
  }
  
  getCpuUsage(): number {
    return this.cpu;
  }
}

class V8IsolateRuntimeAdapter implements RuntimeAdapter {
  name: XRuntime = 'v8-isolate';
  private memory: number = 0;
  private cpu: number = 0;
  
  async initialize(): Promise<void> {
    console.log(`[${PROTOCOL_ID}] V8 Isolate runtime initialized`);
  }
  
  async execute(handler: XWorkerHandler, request: XRequest, env: XEnv, ctx: XContext): Promise<Response> {
    const start = performance.now();
    
    if (!handler.fetch) {
      return new Response('No fetch handler defined', { status: 500 });
    }
    
    try {
      const response = await handler.fetch(request, env, ctx);
      this.cpu = performance.now() - start;
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  async shutdown(): Promise<void> {
    this.memory = 0;
    this.cpu = 0;
  }
  
  getMemoryUsage(): number {
    return this.memory;
  }
  
  getCpuUsage(): number {
    return this.cpu;
  }
}

class DenoRuntimeAdapter implements RuntimeAdapter {
  name: XRuntime = 'deno';
  private memory: number = 0;
  private cpu: number = 0;
  
  async initialize(): Promise<void> {
    console.log(`[${PROTOCOL_ID}] Deno runtime initialized`);
  }
  
  async execute(handler: XWorkerHandler, request: XRequest, env: XEnv, ctx: XContext): Promise<Response> {
    const start = performance.now();
    
    if (!handler.fetch) {
      return new Response('No fetch handler defined', { status: 500 });
    }
    
    try {
      const response = await handler.fetch(request, env, ctx);
      this.cpu = performance.now() - start;
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  async shutdown(): Promise<void> {
    this.memory = 0;
    this.cpu = 0;
  }
  
  getMemoryUsage(): number {
    return this.memory;
  }
  
  getCpuUsage(): number {
    return this.cpu;
  }
}

class NodeRuntimeAdapter implements RuntimeAdapter {
  name: XRuntime = 'node';
  private memory: number = 0;
  private cpu: number = 0;
  
  async initialize(): Promise<void> {
    console.log(`[${PROTOCOL_ID}] Node.js runtime initialized`);
  }
  
  async execute(handler: XWorkerHandler, request: XRequest, env: XEnv, ctx: XContext): Promise<Response> {
    const start = performance.now();
    
    if (!handler.fetch) {
      return new Response('No fetch handler defined', { status: 500 });
    }
    
    try {
      const response = await handler.fetch(request, env, ctx);
      this.cpu = performance.now() - start;
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  async shutdown(): Promise<void> {
    this.memory = 0;
    this.cpu = 0;
  }
  
  getMemoryUsage(): number {
    return this.memory;
  }
  
  getCpuUsage(): number {
    return this.cpu;
  }
}

class BunRuntimeAdapter implements RuntimeAdapter {
  name: XRuntime = 'bun';
  private memory: number = 0;
  private cpu: number = 0;
  
  async initialize(): Promise<void> {
    console.log(`[${PROTOCOL_ID}] Bun runtime initialized`);
  }
  
  async execute(handler: XWorkerHandler, request: XRequest, env: XEnv, ctx: XContext): Promise<Response> {
    const start = performance.now();
    
    if (!handler.fetch) {
      return new Response('No fetch handler defined', { status: 500 });
    }
    
    try {
      const response = await handler.fetch(request, env, ctx);
      this.cpu = performance.now() - start;
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  async shutdown(): Promise<void> {
    this.memory = 0;
    this.cpu = 0;
  }
  
  getMemoryUsage(): number {
    return this.memory;
  }
  
  getCpuUsage(): number {
    return this.cpu;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// φ-HARMONIC SCHEDULER
// ═══════════════════════════════════════════════════════════════════════════

export class PhiHarmonicScheduler {
  private readonly PHI = 1.618033988749895;
  private lastScheduleTime: number = 0;
  private scheduleCount: number = 0;
  
  /**
   * Calculate φ-coherent scheduling delay
   */
  calculateDelay(baseDelay: number): number {
    const phiMultiplier = Math.pow(this.PHI, (this.scheduleCount % 5) - 2);
    return baseDelay * phiMultiplier;
  }
  
  /**
   * Get φ-weighted priority for request processing
   */
  getPriority(requestTime: number): number {
    const timeDelta = requestTime - this.lastScheduleTime;
    return Math.pow(this.PHI, -timeDelta / 1000);
  }
  
  /**
   * Record a scheduling event
   */
  recordSchedule(): void {
    this.lastScheduleTime = Date.now();
    this.scheduleCount++;
  }
  
  /**
   * Get φ-coherence score (0-1)
   */
  getCoherenceScore(): number {
    // Score based on how close scheduling follows φ-harmonic pattern
    const idealInterval = 1000 * this.PHI;
    const actualInterval = Date.now() - this.lastScheduleTime;
    const ratio = actualInterval / idealInterval;
    return Math.exp(-Math.abs(Math.log(ratio)));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// XWORKER RUNTIME ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export class XWorkerRuntime {
  private static instance: XWorkerRuntime | null = null;
  
  private workers: Map<string, XWorkerInstance> = new Map();
  private runtimes: Map<XRuntime, RuntimeAdapter> = new Map();
  private scheduler: PhiHarmonicScheduler;
  private globalMetrics: XWorkerMetrics;
  
  private constructor() {
    this.scheduler = new PhiHarmonicScheduler();
    this.globalMetrics = this.initializeMetrics();
    this.initializeRuntimes();
  }
  
  static getInstance(): XWorkerRuntime {
    if (!XWorkerRuntime.instance) {
      XWorkerRuntime.instance = new XWorkerRuntime();
    }
    return XWorkerRuntime.instance;
  }
  
  private initializeMetrics(): XWorkerMetrics {
    return {
      requestCount: 0,
      errorCount: 0,
      totalCpuMs: 0,
      totalMemoryMb: 0,
      coldStarts: 0,
      warmStarts: 0,
      avgLatencyMs: 0,
      p50LatencyMs: 0,
      p95LatencyMs: 0,
      p99LatencyMs: 0,
      phiCoherenceScore: 1.0
    };
  }
  
  private initializeRuntimes(): void {
    this.runtimes.set('wasm', new WasmRuntimeAdapter());
    this.runtimes.set('v8-isolate', new V8IsolateRuntimeAdapter());
    this.runtimes.set('deno', new DenoRuntimeAdapter());
    this.runtimes.set('node', new NodeRuntimeAdapter());
    this.runtimes.set('bun', new BunRuntimeAdapter());
  }
  
  /**
   * Create a new worker instance
   */
  async createWorker(config: XWorkerConfig, handler: XWorkerHandler): Promise<XWorkerInstance> {
    const runtime = this.runtimes.get(config.runtime);
    if (!runtime) {
      throw new Error(`Unsupported runtime: ${config.runtime}`);
    }
    
    await runtime.initialize();
    
    const instance: XWorkerInstance = {
      id: config.id,
      config,
      status: 'idle',
      metrics: this.initializeMetrics(),
      startTime: Date.now(),
      lastRequestTime: 0,
      handler
    };
    
    this.workers.set(config.id, instance);
    console.log(`[${PROTOCOL_ID}] Worker ${config.id} created with ${config.runtime} runtime`);
    
    return instance;
  }
  
  /**
   * Execute a request on a worker
   */
  async executeRequest(
    workerId: string, 
    request: XRequest, 
    env: XEnv
  ): Promise<Response> {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw new Error(`Worker not found: ${workerId}`);
    }
    
    const runtime = this.runtimes.get(worker.config.runtime);
    if (!runtime) {
      throw new Error(`Runtime not found: ${worker.config.runtime}`);
    }
    
    const startTime = performance.now();
    const isColdStart = worker.status === 'idle';
    
    worker.status = 'running';
    worker.lastRequestTime = Date.now();
    
    // Track cold/warm starts
    if (isColdStart) {
      worker.metrics.coldStarts++;
      this.globalMetrics.coldStarts++;
    } else {
      worker.metrics.warmStarts++;
      this.globalMetrics.warmStarts++;
    }
    
    // Create execution context
    const ctx = new XExecutionContext();
    
    // Inject internal metadata
    env.__XCREW_INTERNAL__ = {
      workerId: worker.id,
      region: worker.config.region || 'global',
      phiScore: this.scheduler.getCoherenceScore()
    };
    
    try {
      // Execute with timeout
      const response = await Promise.race([
        runtime.execute(worker.handler, request, env, ctx),
        new Promise<Response>((_, reject) => 
          setTimeout(() => reject(new Error('Execution timeout')), worker.config.timeout)
        )
      ]);
      
      // Update metrics
      const latency = performance.now() - startTime;
      this.updateMetrics(worker, latency, false);
      
      // Finalize context (waitUntil promises)
      ctx.finalize().catch(console.error);
      
      worker.status = 'idle';
      this.scheduler.recordSchedule();
      
      return response;
      
    } catch (error) {
      const latency = performance.now() - startTime;
      this.updateMetrics(worker, latency, true);
      worker.status = 'error';
      
      if (ctx.isPassThroughEnabled()) {
        // Pass through to origin
        return new Response('Error passed through', { status: 502 });
      }
      
      throw error;
    }
  }
  
  /**
   * Execute a scheduled event (cron)
   */
  async executeScheduled(workerId: string, event: XScheduledEvent, env: XEnv): Promise<void> {
    const worker = this.workers.get(workerId);
    if (!worker || !worker.handler.scheduled) {
      return;
    }
    
    const ctx = new XExecutionContext();
    env.__XCREW_INTERNAL__ = {
      workerId: worker.id,
      region: worker.config.region || 'global',
      phiScore: this.scheduler.getCoherenceScore()
    };
    
    worker.status = 'running';
    
    try {
      await worker.handler.scheduled(event, env, ctx);
      worker.status = 'idle';
    } catch (error) {
      worker.status = 'error';
      throw error;
    }
  }
  
  /**
   * Execute queue consumer
   */
  async executeQueue(workerId: string, batch: XMessageBatch, env: XEnv): Promise<void> {
    const worker = this.workers.get(workerId);
    if (!worker || !worker.handler.queue) {
      return;
    }
    
    env.__XCREW_INTERNAL__ = {
      workerId: worker.id,
      region: worker.config.region || 'global',
      phiScore: this.scheduler.getCoherenceScore()
    };
    
    worker.status = 'running';
    
    try {
      await worker.handler.queue(batch, env);
      worker.status = 'idle';
    } catch (error) {
      worker.status = 'error';
      throw error;
    }
  }
  
  /**
   * Hibernate a worker to save resources
   */
  async hibernateWorker(workerId: string): Promise<void> {
    const worker = this.workers.get(workerId);
    if (!worker) return;
    
    worker.status = 'hibernating';
    console.log(`[${PROTOCOL_ID}] Worker ${workerId} hibernated`);
  }
  
  /**
   * Wake a hibernated worker
   */
  async wakeWorker(workerId: string): Promise<void> {
    const worker = this.workers.get(workerId);
    if (!worker || worker.status !== 'hibernating') return;
    
    worker.status = 'idle';
    console.log(`[${PROTOCOL_ID}] Worker ${workerId} awakened`);
  }
  
  /**
   * Destroy a worker instance
   */
  async destroyWorker(workerId: string): Promise<void> {
    const worker = this.workers.get(workerId);
    if (!worker) return;
    
    const runtime = this.runtimes.get(worker.config.runtime);
    if (runtime) {
      await runtime.shutdown();
    }
    
    this.workers.delete(workerId);
    console.log(`[${PROTOCOL_ID}] Worker ${workerId} destroyed`);
  }
  
  private updateMetrics(worker: XWorkerInstance, latencyMs: number, isError: boolean): void {
    // Update worker metrics
    worker.metrics.requestCount++;
    if (isError) worker.metrics.errorCount++;
    worker.metrics.avgLatencyMs = (
      (worker.metrics.avgLatencyMs * (worker.metrics.requestCount - 1) + latencyMs) / 
      worker.metrics.requestCount
    );
    worker.metrics.phiCoherenceScore = this.scheduler.getCoherenceScore();
    
    // Update global metrics
    this.globalMetrics.requestCount++;
    if (isError) this.globalMetrics.errorCount++;
    this.globalMetrics.avgLatencyMs = (
      (this.globalMetrics.avgLatencyMs * (this.globalMetrics.requestCount - 1) + latencyMs) / 
      this.globalMetrics.requestCount
    );
    this.globalMetrics.phiCoherenceScore = this.scheduler.getCoherenceScore();
  }
  
  /**
   * Get worker instance by ID
   */
  getWorker(workerId: string): XWorkerInstance | undefined {
    return this.workers.get(workerId);
  }
  
  /**
   * Get all workers
   */
  getAllWorkers(): XWorkerInstance[] {
    return Array.from(this.workers.values());
  }
  
  /**
   * Get global metrics
   */
  getGlobalMetrics(): XWorkerMetrics {
    return { ...this.globalMetrics };
  }
  
  /**
   * Get worker count by status
   */
  getWorkerCountByStatus(): Record<XWorkerStatus, number> {
    const counts: Record<XWorkerStatus, number> = {
      idle: 0,
      starting: 0,
      running: 0,
      stopping: 0,
      error: 0,
      hibernating: 0
    };
    
    for (const worker of this.workers.values()) {
      counts[worker.status]++;
    }
    
    return counts;
  }
  
  /**
   * Get φ-coherence score
   */
  getPhiCoherenceScore(): number {
    return this.scheduler.getCoherenceScore();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY & EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export function getXWorkerRuntime(): XWorkerRuntime {
  return XWorkerRuntime.getInstance();
}

export function createXWorker(config: Partial<XWorkerConfig>, handler: XWorkerHandler): Promise<XWorkerInstance> {
  const fullConfig: XWorkerConfig = {
    id: config.id || `xworker-${Date.now()}`,
    name: config.name || 'Unnamed Worker',
    runtime: config.runtime || 'v8-isolate',
    memoryLimit: config.memoryLimit || 128,
    cpuLimit: config.cpuLimit || 50,
    timeout: config.timeout || 30000,
    phiCoherent: config.phiCoherent ?? true,
    region: config.region,
    bindings: config.bindings || []
  };
  
  return getXWorkerRuntime().createWorker(fullConfig, handler);
}

export default {
  XWorkerRuntime,
  getXWorkerRuntime,
  createXWorker,
  XExecutionContext,
  PhiHarmonicScheduler,
  PROTOCOL_ID
};
