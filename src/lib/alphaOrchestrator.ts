// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 ALPHA ORCHESTRATOR — SOVEREIGN INTELLIGENCE COORDINATION 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * ALPHA-ORCH-001: The Alpha Orchestrator is the supreme coordination layer
 * that governs all Alpha-class systems. It manages task routing, resource
 * allocation, priority arbitration, and cross-system coherence for the
 * entire Alpha intelligence hierarchy.
 *
 * Architecture:
 *
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │              ALPHA ORCHESTRATOR (ALPHA-ORCH-001)                │
 *   ├─────────────────────────────────────────────────────────────────┤
 *   │                                                                 │
 *   │  DOMAINS:                                                       │
 *   │  ├── COGNITION   — reasoning, inference, planning              │
 *   │  ├── MEMORY      — storage, retrieval, consolidation           │
 *   │  ├── PERCEPTION  — input processing, pattern recognition       │
 *   │  ├── ACTION      — output generation, execution                │
 *   │  ├── LEARNING    — model updates, adaptation                   │
 *   │  └── GOVERNANCE  — policy enforcement, sovereignty             │
 *   │                                                                 │
 *   │  PRIORITIES (φ-weighted):                                       │
 *   │  ├── CRITICAL   — φ⁴ weight (≈6.85)                           │
 *   │  ├── HIGH       — φ³ weight (≈4.24)                           │
 *   │  ├── ELEVATED   — φ² weight (≈2.62)                           │
 *   │  ├── STANDARD   — φ¹ weight (≈1.62)                           │
 *   │  ├── LOW        — φ⁰ weight (1.00)                            │
 *   │  └── DEFERRED   — φ⁻¹ weight (≈0.62)                         │
 *   │                                                                 │
 *   │  COORDINATION MODES:                                            │
 *   │  ├── SEQUENTIAL   — tasks executed in order                    │
 *   │  ├── PARALLEL     — concurrent execution                       │
 *   │  ├── PIPELINE     — chained processing stages                  │
 *   │  ├── BROADCAST    — fan-out to all domains                     │
 *   │  ├── CONVERGENT   — gather and synthesize                      │
 *   │  └── RESONANT     — φ-harmonic synchronized                   │
 *   │                                                                 │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * Charter: ALPHA-ORCH-001
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { sovereignId } from './sovereign-id';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION I: CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/** The golden ratio */
export const PHI = (1 + Math.sqrt(5)) / 2;

/** Inverse golden ratio */
export const PHI_INVERSE = 1 / PHI;

/** Squared golden ratio */
export const PHI_SQUARED = PHI * PHI;

/** Cubed golden ratio */
export const PHI_CUBED = PHI * PHI * PHI;

/** Fourth power golden ratio */
export const PHI_FOURTH = PHI_CUBED * PHI;

/** Schumann fundamental frequency (Hz) */
export const SCHUMANN_HZ = 7.83;

/** Base heartbeat interval (ms) — 873ms sovereign period */
export const HEARTBEAT_MS = 873;

/** Maximum concurrent tasks per domain */
export const MAX_CONCURRENT_PER_DOMAIN = Math.floor(PHI_CUBED * 3); // ≈ 12

/** Task timeout (ms) — φ⁵ × heartbeat */
export const TASK_TIMEOUT_MS = HEARTBEAT_MS * Math.pow(PHI, 5); // ≈ 9,620ms

/** Coherence threshold for resonant mode */
export const COHERENCE_THRESHOLD = PHI_INVERSE; // ≈ 0.618

/** Maximum orchestration depth (nested sub-orchestrations) */
export const MAX_DEPTH = 8; // Fibonacci(6)

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION II: TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type AlphaDomain =
  | 'cognition'
  | 'memory'
  | 'perception'
  | 'action'
  | 'learning'
  | 'governance';

export type TaskPriority =
  | 'critical'
  | 'high'
  | 'elevated'
  | 'standard'
  | 'low'
  | 'deferred';

export type CoordinationMode =
  | 'sequential'
  | 'parallel'
  | 'pipeline'
  | 'broadcast'
  | 'convergent'
  | 'resonant';

export type TaskStatus =
  | 'queued'
  | 'dispatched'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'timeout'
  | 'cancelled';

export type OrchestratorState =
  | 'dormant'
  | 'initializing'
  | 'active'
  | 'overloaded'
  | 'degraded'
  | 'sovereign';

export interface AlphaTask {
  id: string;
  domain: AlphaDomain;
  priority: TaskPriority;
  status: TaskStatus;
  payload: unknown;
  result: unknown | null;
  createdAt: number;
  startedAt: number | null;
  completedAt: number | null;
  timeout: number;
  retries: number;
  maxRetries: number;
  parentTaskId: string | null;
  childTaskIds: string[];
  metadata: Record<string, unknown>;
}

export interface DomainState {
  domain: AlphaDomain;
  activeTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageLatency: number;
  coherence: number;
  load: number; // 0-1
  isHealthy: boolean;
}

export interface OrchestrationPlan {
  id: string;
  mode: CoordinationMode;
  tasks: AlphaTask[];
  domains: AlphaDomain[];
  priority: TaskPriority;
  createdAt: number;
  estimatedDuration: number;
  phiWeight: number;
}

export interface OrchestratorMetrics {
  state: OrchestratorState;
  totalTasksProcessed: number;
  totalTasksFailed: number;
  totalTasksCancelled: number;
  uptime: number;
  domainsHealthy: number;
  domainsTotal: number;
  averageCoherence: number;
  throughput: number; // tasks/second
  queueDepth: number;
  activeOrchestrations: number;
}

export interface OrchestratorEvent {
  type: 'task_queued' | 'task_dispatched' | 'task_completed' | 'task_failed'
    | 'domain_overload' | 'coherence_shift' | 'state_change' | 'plan_created';
  timestamp: number;
  data: unknown;
}

export type OrchestratorListener = (event: OrchestratorEvent) => void;

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION III: PRIORITY WEIGHTS
// ═══════════════════════════════════════════════════════════════════════════════

const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  critical: PHI_FOURTH,
  high: PHI_CUBED,
  elevated: PHI_SQUARED,
  standard: PHI,
  low: 1,
  deferred: PHI_INVERSE,
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION IV: ALPHA ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════════

export class AlphaOrchestrator {
  readonly id: string;
  readonly charter = 'ALPHA-ORCH-001';

  private state: OrchestratorState = 'dormant';
  private startTime: number = 0;
  private taskQueue: AlphaTask[] = [];
  private activeTasks: Map<string, AlphaTask> = new Map();
  private completedTasks: AlphaTask[] = [];
  private domainStates: Map<AlphaDomain, DomainState> = new Map();
  private orchestrationPlans: Map<string, OrchestrationPlan> = new Map();
  private listeners: OrchestratorListener[] = [];
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  private totalProcessed: number = 0;
  private totalFailed: number = 0;
  private totalCancelled: number = 0;

  constructor() {
    this.id = sovereignId();
    this.initializeDomains();
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═════════════════════════════════════════════════════════════════════════════

  /** Initialize the orchestrator — transition from dormant to active */
  initialize(): void {
    if (this.state !== 'dormant') return;
    this.state = 'initializing';
    this.startTime = Date.now();
    this.emit({ type: 'state_change', timestamp: Date.now(), data: { from: 'dormant', to: 'initializing' } });

    // Start heartbeat processing
    this.heartbeatTimer = setInterval(() => this.heartbeat(), HEARTBEAT_MS);
    this.state = 'active';
    this.emit({ type: 'state_change', timestamp: Date.now(), data: { from: 'initializing', to: 'active' } });
  }

  /** Shutdown the orchestrator gracefully */
  shutdown(): void {
    if (this.state === 'dormant') return;
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    // Cancel all queued tasks
    for (const task of this.taskQueue) {
      task.status = 'cancelled';
      this.totalCancelled++;
    }
    this.taskQueue = [];

    this.state = 'dormant';
    this.emit({ type: 'state_change', timestamp: Date.now(), data: { to: 'dormant' } });
  }

  /** Elevate to sovereign state when all domains are coherent */
  elevateSovereign(): boolean {
    const avgCoherence = this.getAverageCoherence();
    if (avgCoherence >= COHERENCE_THRESHOLD && this.allDomainsHealthy()) {
      this.state = 'sovereign';
      this.emit({ type: 'state_change', timestamp: Date.now(), data: { to: 'sovereign' } });
      return true;
    }
    return false;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // TASK MANAGEMENT
  // ═════════════════════════════════════════════════════════════════════════════

  /** Submit a task to the orchestrator */
  submitTask(domain: AlphaDomain, priority: TaskPriority, payload: unknown, metadata: Record<string, unknown> = {}): AlphaTask {
    const task: AlphaTask = {
      id: sovereignId(),
      domain,
      priority,
      status: 'queued',
      payload,
      result: null,
      createdAt: Date.now(),
      startedAt: null,
      completedAt: null,
      timeout: TASK_TIMEOUT_MS,
      retries: 0,
      maxRetries: 3,
      parentTaskId: null,
      childTaskIds: [],
      metadata,
    };

    this.taskQueue.push(task);
    this.sortQueue();
    this.emit({ type: 'task_queued', timestamp: Date.now(), data: { taskId: task.id, domain, priority } });
    return task;
  }

  /** Create an orchestration plan for coordinated multi-domain tasks */
  createPlan(mode: CoordinationMode, domains: AlphaDomain[], priority: TaskPriority, payloads: unknown[]): OrchestrationPlan {
    const tasks = domains.map((domain, i) => this.submitTask(domain, priority, payloads[i] || null));
    const plan: OrchestrationPlan = {
      id: sovereignId(),
      mode,
      tasks,
      domains,
      priority,
      createdAt: Date.now(),
      estimatedDuration: this.estimateDuration(mode, tasks.length),
      phiWeight: PRIORITY_WEIGHTS[priority],
    };

    this.orchestrationPlans.set(plan.id, plan);
    this.emit({ type: 'plan_created', timestamp: Date.now(), data: { planId: plan.id, mode, domains } });
    return plan;
  }

  /** Dispatch next task from queue to execution */
  dispatchNext(): AlphaTask | null {
    if (this.taskQueue.length === 0) return null;

    const task = this.taskQueue[0];
    const domainState = this.domainStates.get(task.domain);
    if (!domainState || domainState.activeTasks >= MAX_CONCURRENT_PER_DOMAIN) return null;

    this.taskQueue.shift();
    task.status = 'dispatched';
    task.startedAt = Date.now();
    this.activeTasks.set(task.id, task);
    domainState.activeTasks++;

    this.emit({ type: 'task_dispatched', timestamp: Date.now(), data: { taskId: task.id, domain: task.domain } });
    return task;
  }

  /** Mark a task as completed */
  completeTask(taskId: string, result: unknown): boolean {
    const task = this.activeTasks.get(taskId);
    if (!task) return false;

    task.status = 'completed';
    task.result = result;
    task.completedAt = Date.now();

    this.activeTasks.delete(taskId);
    this.completedTasks.push(task);
    this.totalProcessed++;

    const domainState = this.domainStates.get(task.domain);
    if (domainState) {
      domainState.activeTasks--;
      domainState.completedTasks++;
      const latency = task.completedAt - (task.startedAt || task.createdAt);
      domainState.averageLatency = (domainState.averageLatency * 0.8) + (latency * 0.2);
    }

    this.emit({ type: 'task_completed', timestamp: Date.now(), data: { taskId, domain: task.domain, latency: task.completedAt - (task.startedAt || task.createdAt) } });
    return true;
  }

  /** Mark a task as failed */
  failTask(taskId: string, error: unknown): boolean {
    const task = this.activeTasks.get(taskId);
    if (!task) return false;

    if (task.retries < task.maxRetries) {
      task.retries++;
      task.status = 'queued';
      task.startedAt = null;
      this.activeTasks.delete(taskId);
      this.taskQueue.push(task);
      this.sortQueue();

      const domainState = this.domainStates.get(task.domain);
      if (domainState) domainState.activeTasks--;
      return true;
    }

    task.status = 'failed';
    task.result = error;
    task.completedAt = Date.now();

    this.activeTasks.delete(taskId);
    this.totalFailed++;

    const domainState = this.domainStates.get(task.domain);
    if (domainState) {
      domainState.activeTasks--;
      domainState.failedTasks++;
      domainState.coherence = Math.max(0, domainState.coherence - 0.05);
    }

    this.emit({ type: 'task_failed', timestamp: Date.now(), data: { taskId, domain: task.domain, error } });
    return true;
  }

  /** Cancel a queued task */
  cancelTask(taskId: string): boolean {
    const idx = this.taskQueue.findIndex(t => t.id === taskId);
    if (idx >= 0) {
      this.taskQueue[idx].status = 'cancelled';
      this.taskQueue.splice(idx, 1);
      this.totalCancelled++;
      return true;
    }
    return false;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // QUERIES & METRICS
  // ═════════════════════════════════════════════════════════════════════════════

  getState(): OrchestratorState {
    return this.state;
  }

  getMetrics(): OrchestratorMetrics {
    const domainsHealthy = [...this.domainStates.values()].filter(d => d.isHealthy).length;
    const uptime = this.startTime > 0 ? Date.now() - this.startTime : 0;
    const throughput = uptime > 0 ? (this.totalProcessed / (uptime / 1000)) : 0;

    return {
      state: this.state,
      totalTasksProcessed: this.totalProcessed,
      totalTasksFailed: this.totalFailed,
      totalTasksCancelled: this.totalCancelled,
      uptime,
      domainsHealthy,
      domainsTotal: this.domainStates.size,
      averageCoherence: this.getAverageCoherence(),
      throughput,
      queueDepth: this.taskQueue.length,
      activeOrchestrations: this.orchestrationPlans.size,
    };
  }

  getDomainState(domain: AlphaDomain): DomainState | undefined {
    return this.domainStates.get(domain);
  }

  getAllDomainStates(): DomainState[] {
    return [...this.domainStates.values()];
  }

  getQueueDepth(): number {
    return this.taskQueue.length;
  }

  getActiveTaskCount(): number {
    return this.activeTasks.size;
  }

  getTask(taskId: string): AlphaTask | undefined {
    return this.activeTasks.get(taskId) || this.taskQueue.find(t => t.id === taskId) || this.completedTasks.find(t => t.id === taskId);
  }

  getPlan(planId: string): OrchestrationPlan | undefined {
    return this.orchestrationPlans.get(planId);
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // EVENT SYSTEM
  // ═════════════════════════════════════════════════════════════════════════════

  on(listener: OrchestratorListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // INTERNAL
  // ═════════════════════════════════════════════════════════════════════════════

  private initializeDomains(): void {
    const domains: AlphaDomain[] = ['cognition', 'memory', 'perception', 'action', 'learning', 'governance'];
    for (const domain of domains) {
      this.domainStates.set(domain, {
        domain,
        activeTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        averageLatency: 0,
        coherence: 1.0,
        load: 0,
        isHealthy: true,
      });
    }
  }

  private heartbeat(): void {
    // Process queue — dispatch up to one task per domain per heartbeat
    const domains: AlphaDomain[] = ['cognition', 'memory', 'perception', 'action', 'learning', 'governance'];
    for (const domain of domains) {
      const domainTasks = this.taskQueue.filter(t => t.domain === domain);
      if (domainTasks.length > 0) {
        this.dispatchNext();
      }
    }

    // Check for timed-out tasks
    const now = Date.now();
    for (const [taskId, task] of this.activeTasks) {
      if (task.startedAt && (now - task.startedAt) > task.timeout) {
        task.status = 'timeout';
        this.failTask(taskId, { error: 'timeout', elapsed: now - task.startedAt });
      }
    }

    // Update domain health
    for (const [, domainState] of this.domainStates) {
      domainState.load = domainState.activeTasks / MAX_CONCURRENT_PER_DOMAIN;
      domainState.isHealthy = domainState.load < PHI_INVERSE && domainState.coherence > 0.5;
    }

    // Check for state transitions
    if (this.state === 'active') {
      const overloaded = [...this.domainStates.values()].filter(d => d.load > PHI_INVERSE).length;
      if (overloaded > 3) {
        this.state = 'overloaded';
        this.emit({ type: 'state_change', timestamp: now, data: { to: 'overloaded' } });
      }
    } else if (this.state === 'overloaded') {
      const overloaded = [...this.domainStates.values()].filter(d => d.load > PHI_INVERSE).length;
      if (overloaded <= 1) {
        this.state = 'active';
        this.emit({ type: 'state_change', timestamp: now, data: { to: 'active' } });
      }
    }
  }

  private sortQueue(): void {
    this.taskQueue.sort((a, b) => {
      const wa = PRIORITY_WEIGHTS[a.priority];
      const wb = PRIORITY_WEIGHTS[b.priority];
      if (wb !== wa) return wb - wa; // Higher weight first
      return a.createdAt - b.createdAt; // FIFO within same priority
    });
  }

  private estimateDuration(mode: CoordinationMode, taskCount: number): number {
    const basePerTask = HEARTBEAT_MS * PHI;
    switch (mode) {
      case 'sequential': return basePerTask * taskCount;
      case 'parallel': return basePerTask;
      case 'pipeline': return basePerTask * (1 + (taskCount - 1) * PHI_INVERSE);
      case 'broadcast': return basePerTask * PHI;
      case 'convergent': return basePerTask * PHI_SQUARED;
      case 'resonant': return basePerTask * PHI_CUBED;
      default: return basePerTask * taskCount;
    }
  }

  private getAverageCoherence(): number {
    const states = [...this.domainStates.values()];
    if (states.length === 0) return 0;
    return states.reduce((sum, s) => sum + s.coherence, 0) / states.length;
  }

  private allDomainsHealthy(): boolean {
    return [...this.domainStates.values()].every(d => d.isHealthy);
  }

  private emit(event: OrchestratorEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION V: SINGLETON ACCESS
// ═══════════════════════════════════════════════════════════════════════════════

let _instance: AlphaOrchestrator | null = null;

/** Get the singleton Alpha Orchestrator instance */
export function getAlphaOrchestrator(): AlphaOrchestrator {
  if (!_instance) {
    _instance = new AlphaOrchestrator();
  }
  return _instance;
}

/** Reset the singleton (for testing) */
export function resetAlphaOrchestrator(): void {
  if (_instance) {
    _instance.shutdown();
    _instance = null;
  }
}
