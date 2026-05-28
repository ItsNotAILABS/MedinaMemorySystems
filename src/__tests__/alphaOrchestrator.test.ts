/**
 * 𓂀 ALPHA ORCHESTRATOR — TEST SUITE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Tests for ALPHA-ORCH-001: Alpha Orchestrator
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  AlphaOrchestrator,
  getAlphaOrchestrator,
  resetAlphaOrchestrator,
  PHI,
  PHI_INVERSE,
  PHI_SQUARED,
  PHI_CUBED,
  PHI_FOURTH,
  HEARTBEAT_MS,
  MAX_CONCURRENT_PER_DOMAIN,
  TASK_TIMEOUT_MS,
  COHERENCE_THRESHOLD,
  MAX_DEPTH,
} from '../lib/alphaOrchestrator';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Orchestrator - Constants', () => {
  test('PHI is the golden ratio', () => {
    expect(PHI).toBeCloseTo(1.618033988749895, 10);
  });

  test('PHI satisfies φ = 1 + 1/φ', () => {
    expect(PHI).toBeCloseTo(1 + 1 / PHI, 10);
  });

  test('PHI_INVERSE is 1/φ', () => {
    expect(PHI_INVERSE).toBeCloseTo(0.618033988749895, 10);
  });

  test('PHI_SQUARED is φ²', () => {
    expect(PHI_SQUARED).toBeCloseTo(2.618033988749895, 10);
  });

  test('PHI_CUBED is φ³', () => {
    expect(PHI_CUBED).toBeCloseTo(4.23606797749979, 5);
  });

  test('PHI_FOURTH is φ⁴', () => {
    expect(PHI_FOURTH).toBeCloseTo(6.854101966249685, 5);
  });

  test('HEARTBEAT_MS is 873', () => {
    expect(HEARTBEAT_MS).toBe(873);
  });

  test('MAX_CONCURRENT_PER_DOMAIN is positive integer', () => {
    expect(MAX_CONCURRENT_PER_DOMAIN).toBeGreaterThan(0);
    expect(Number.isInteger(MAX_CONCURRENT_PER_DOMAIN)).toBe(true);
  });

  test('TASK_TIMEOUT_MS is derived from heartbeat and φ⁵', () => {
    expect(TASK_TIMEOUT_MS).toBeCloseTo(HEARTBEAT_MS * Math.pow(PHI, 5), 0);
  });

  test('COHERENCE_THRESHOLD equals φ⁻¹', () => {
    expect(COHERENCE_THRESHOLD).toBeCloseTo(PHI_INVERSE, 10);
  });

  test('MAX_DEPTH is 8 (Fibonacci-derived)', () => {
    expect(MAX_DEPTH).toBe(8);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Orchestrator - Lifecycle', () => {
  let orchestrator: AlphaOrchestrator;

  beforeEach(() => {
    resetAlphaOrchestrator();
    orchestrator = new AlphaOrchestrator();
  });

  afterEach(() => {
    orchestrator.shutdown();
  });

  test('starts in dormant state', () => {
    expect(orchestrator.getState()).toBe('dormant');
  });

  test('initializes to active state', () => {
    orchestrator.initialize();
    expect(orchestrator.getState()).toBe('active');
  });

  test('shutdown returns to dormant', () => {
    orchestrator.initialize();
    orchestrator.shutdown();
    expect(orchestrator.getState()).toBe('dormant');
  });

  test('initialize is idempotent when already active', () => {
    orchestrator.initialize();
    orchestrator.initialize(); // second call does nothing
    expect(orchestrator.getState()).toBe('active');
  });

  test('shutdown is idempotent when already dormant', () => {
    orchestrator.shutdown();
    expect(orchestrator.getState()).toBe('dormant');
  });

  test('has unique id', () => {
    const other = new AlphaOrchestrator();
    expect(orchestrator.id).not.toBe(other.id);
    other.shutdown();
  });

  test('charter is ALPHA-ORCH-001', () => {
    expect(orchestrator.charter).toBe('ALPHA-ORCH-001');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DOMAIN MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Orchestrator - Domains', () => {
  let orchestrator: AlphaOrchestrator;

  beforeEach(() => {
    orchestrator = new AlphaOrchestrator();
    orchestrator.initialize();
  });

  afterEach(() => {
    orchestrator.shutdown();
  });

  test('has 6 domains initialized', () => {
    const domains = orchestrator.getAllDomainStates();
    expect(domains).toHaveLength(6);
  });

  test('all domains start healthy', () => {
    const domains = orchestrator.getAllDomainStates();
    expect(domains.every(d => d.isHealthy)).toBe(true);
  });

  test('all domains start with coherence 1.0', () => {
    const domains = orchestrator.getAllDomainStates();
    expect(domains.every(d => d.coherence === 1.0)).toBe(true);
  });

  test('can get individual domain state', () => {
    const cognition = orchestrator.getDomainState('cognition');
    expect(cognition).toBeDefined();
    expect(cognition!.domain).toBe('cognition');
  });

  test('all domain names are correct', () => {
    const domains = orchestrator.getAllDomainStates().map(d => d.domain).sort();
    expect(domains).toEqual(['action', 'cognition', 'governance', 'learning', 'memory', 'perception']);
  });

  test('domains start with zero active tasks', () => {
    const domains = orchestrator.getAllDomainStates();
    expect(domains.every(d => d.activeTasks === 0)).toBe(true);
  });

  test('domains start with zero load', () => {
    const domains = orchestrator.getAllDomainStates();
    expect(domains.every(d => d.load === 0)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TASK MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Orchestrator - Task Management', () => {
  let orchestrator: AlphaOrchestrator;

  beforeEach(() => {
    orchestrator = new AlphaOrchestrator();
    orchestrator.initialize();
  });

  afterEach(() => {
    orchestrator.shutdown();
  });

  test('submit task returns task with correct properties', () => {
    const task = orchestrator.submitTask('cognition', 'standard', { action: 'think' });
    expect(task.id).toBeDefined();
    expect(task.domain).toBe('cognition');
    expect(task.priority).toBe('standard');
    expect(task.status).toBe('queued');
    expect(task.payload).toEqual({ action: 'think' });
    expect(task.result).toBeNull();
  });

  test('submitted task appears in queue', () => {
    orchestrator.submitTask('memory', 'high', { action: 'store' });
    expect(orchestrator.getQueueDepth()).toBe(1);
  });

  test('dispatch moves task from queue to active', () => {
    orchestrator.submitTask('cognition', 'standard', { action: 'think' });
    const dispatched = orchestrator.dispatchNext();
    expect(dispatched).not.toBeNull();
    expect(dispatched!.status).toBe('dispatched');
    expect(orchestrator.getQueueDepth()).toBe(0);
    expect(orchestrator.getActiveTaskCount()).toBe(1);
  });

  test('complete task removes from active', () => {
    const task = orchestrator.submitTask('cognition', 'standard', {});
    orchestrator.dispatchNext();
    orchestrator.completeTask(task.id, { result: 'done' });
    expect(orchestrator.getActiveTaskCount()).toBe(0);
  });

  test('complete task stores result', () => {
    const task = orchestrator.submitTask('cognition', 'standard', {});
    orchestrator.dispatchNext();
    orchestrator.completeTask(task.id, { result: 'done' });
    const completed = orchestrator.getTask(task.id);
    expect(completed!.result).toEqual({ result: 'done' });
    expect(completed!.status).toBe('completed');
  });

  test('failed task retries', () => {
    const task = orchestrator.submitTask('cognition', 'standard', {});
    orchestrator.dispatchNext();
    orchestrator.failTask(task.id, { error: 'oops' });
    // Task should be re-queued
    expect(orchestrator.getQueueDepth()).toBe(1);
    const requeued = orchestrator.getTask(task.id);
    expect(requeued!.retries).toBe(1);
  });

  test('cancel task removes from queue', () => {
    const task = orchestrator.submitTask('cognition', 'standard', {});
    const cancelled = orchestrator.cancelTask(task.id);
    expect(cancelled).toBe(true);
    expect(orchestrator.getQueueDepth()).toBe(0);
  });

  test('queue is priority-sorted (higher priority first)', () => {
    orchestrator.submitTask('cognition', 'low', { order: 1 });
    orchestrator.submitTask('cognition', 'critical', { order: 2 });
    orchestrator.submitTask('cognition', 'standard', { order: 3 });

    const dispatched = orchestrator.dispatchNext();
    expect(dispatched!.priority).toBe('critical');
  });

  test('tasks with same priority are FIFO', () => {
    const t1 = orchestrator.submitTask('cognition', 'standard', { order: 'first' });
    const t2 = orchestrator.submitTask('cognition', 'standard', { order: 'second' });

    const dispatched = orchestrator.dispatchNext();
    expect(dispatched!.id).toBe(t1.id);
  });

  test('dispatch returns null on empty queue', () => {
    const result = orchestrator.dispatchNext();
    expect(result).toBeNull();
  });

  test('metadata is preserved', () => {
    const task = orchestrator.submitTask('cognition', 'standard', {}, { source: 'test', priority_override: true });
    expect(task.metadata.source).toBe('test');
    expect(task.metadata.priority_override).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ORCHESTRATION PLANS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Orchestrator - Orchestration Plans', () => {
  let orchestrator: AlphaOrchestrator;

  beforeEach(() => {
    orchestrator = new AlphaOrchestrator();
    orchestrator.initialize();
  });

  afterEach(() => {
    orchestrator.shutdown();
  });

  test('create plan with sequential mode', () => {
    const plan = orchestrator.createPlan('sequential', ['cognition', 'memory'], 'high', [{}, {}]);
    expect(plan.mode).toBe('sequential');
    expect(plan.domains).toEqual(['cognition', 'memory']);
    expect(plan.tasks).toHaveLength(2);
  });

  test('create plan with parallel mode', () => {
    const plan = orchestrator.createPlan('parallel', ['cognition', 'memory', 'action'], 'standard', [{}, {}, {}]);
    expect(plan.mode).toBe('parallel');
    expect(plan.tasks).toHaveLength(3);
  });

  test('plan has φ-weight based on priority', () => {
    const plan = orchestrator.createPlan('sequential', ['cognition'], 'critical', [{}]);
    expect(plan.phiWeight).toBeCloseTo(PHI_FOURTH, 5);
  });

  test('plan estimated duration varies by mode', () => {
    const seqPlan = orchestrator.createPlan('sequential', ['cognition', 'memory', 'action'], 'standard', [{}, {}, {}]);
    const parPlan = orchestrator.createPlan('parallel', ['cognition', 'memory', 'action'], 'standard', [{}, {}, {}]);
    expect(seqPlan.estimatedDuration).toBeGreaterThan(parPlan.estimatedDuration);
  });

  test('plan is retrievable by id', () => {
    const plan = orchestrator.createPlan('broadcast', ['cognition'], 'standard', [{}]);
    const retrieved = orchestrator.getPlan(plan.id);
    expect(retrieved).toBeDefined();
    expect(retrieved!.id).toBe(plan.id);
  });

  test('all coordination modes produce valid plans', () => {
    const modes = ['sequential', 'parallel', 'pipeline', 'broadcast', 'convergent', 'resonant'] as const;
    for (const mode of modes) {
      const plan = orchestrator.createPlan(mode, ['cognition'], 'standard', [{}]);
      expect(plan.mode).toBe(mode);
      expect(plan.estimatedDuration).toBeGreaterThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// METRICS & STATE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Orchestrator - Metrics', () => {
  let orchestrator: AlphaOrchestrator;

  beforeEach(() => {
    orchestrator = new AlphaOrchestrator();
    orchestrator.initialize();
  });

  afterEach(() => {
    orchestrator.shutdown();
  });

  test('metrics reflect initial state', () => {
    const metrics = orchestrator.getMetrics();
    expect(metrics.state).toBe('active');
    expect(metrics.totalTasksProcessed).toBe(0);
    expect(metrics.totalTasksFailed).toBe(0);
    expect(metrics.totalTasksCancelled).toBe(0);
    expect(metrics.domainsTotal).toBe(6);
    expect(metrics.domainsHealthy).toBe(6);
    expect(metrics.queueDepth).toBe(0);
  });

  test('metrics update after task completion', () => {
    const task = orchestrator.submitTask('cognition', 'standard', {});
    orchestrator.dispatchNext();
    orchestrator.completeTask(task.id, 'result');
    const metrics = orchestrator.getMetrics();
    expect(metrics.totalTasksProcessed).toBe(1);
  });

  test('metrics update after task cancellation', () => {
    const task = orchestrator.submitTask('cognition', 'standard', {});
    orchestrator.cancelTask(task.id);
    const metrics = orchestrator.getMetrics();
    expect(metrics.totalTasksCancelled).toBe(1);
  });

  test('average coherence starts at 1.0', () => {
    const metrics = orchestrator.getMetrics();
    expect(metrics.averageCoherence).toBe(1.0);
  });

  test('uptime increases after initialization', () => {
    const metrics = orchestrator.getMetrics();
    expect(metrics.uptime).toBeGreaterThanOrEqual(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Orchestrator - Events', () => {
  let orchestrator: AlphaOrchestrator;

  beforeEach(() => {
    orchestrator = new AlphaOrchestrator();
  });

  afterEach(() => {
    orchestrator.shutdown();
  });

  test('emits state_change on initialize', () => {
    const events: any[] = [];
    orchestrator.on(e => events.push(e));
    orchestrator.initialize();
    expect(events.some(e => e.type === 'state_change')).toBe(true);
  });

  test('emits task_queued on submit', () => {
    orchestrator.initialize();
    const events: any[] = [];
    orchestrator.on(e => events.push(e));
    orchestrator.submitTask('cognition', 'standard', {});
    expect(events.some(e => e.type === 'task_queued')).toBe(true);
  });

  test('emits task_dispatched on dispatch', () => {
    orchestrator.initialize();
    orchestrator.submitTask('cognition', 'standard', {});
    const events: any[] = [];
    orchestrator.on(e => events.push(e));
    orchestrator.dispatchNext();
    expect(events.some(e => e.type === 'task_dispatched')).toBe(true);
  });

  test('emits task_completed on complete', () => {
    orchestrator.initialize();
    const task = orchestrator.submitTask('cognition', 'standard', {});
    orchestrator.dispatchNext();
    const events: any[] = [];
    orchestrator.on(e => events.push(e));
    orchestrator.completeTask(task.id, 'done');
    expect(events.some(e => e.type === 'task_completed')).toBe(true);
  });

  test('listener can unsubscribe', () => {
    orchestrator.initialize();
    const events: any[] = [];
    const unsub = orchestrator.on(e => events.push(e));
    unsub();
    orchestrator.submitTask('cognition', 'standard', {});
    expect(events).toHaveLength(0);
  });

  test('emits plan_created on createPlan', () => {
    orchestrator.initialize();
    const events: any[] = [];
    orchestrator.on(e => events.push(e));
    orchestrator.createPlan('parallel', ['cognition'], 'standard', [{}]);
    expect(events.some(e => e.type === 'plan_created')).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN ELEVATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Orchestrator - Sovereign Elevation', () => {
  let orchestrator: AlphaOrchestrator;

  beforeEach(() => {
    orchestrator = new AlphaOrchestrator();
    orchestrator.initialize();
  });

  afterEach(() => {
    orchestrator.shutdown();
  });

  test('elevates to sovereign when all domains are healthy and coherent', () => {
    const result = orchestrator.elevateSovereign();
    expect(result).toBe(true);
    expect(orchestrator.getState()).toBe('sovereign');
  });

  test('elevation emits state_change event', () => {
    const events: any[] = [];
    orchestrator.on(e => events.push(e));
    orchestrator.elevateSovereign();
    expect(events.some(e => e.type === 'state_change' && (e.data as any).to === 'sovereign')).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Orchestrator - Singleton', () => {
  afterEach(() => {
    resetAlphaOrchestrator();
  });

  test('getAlphaOrchestrator returns same instance', () => {
    const a = getAlphaOrchestrator();
    const b = getAlphaOrchestrator();
    expect(a).toBe(b);
  });

  test('resetAlphaOrchestrator creates new instance', () => {
    const a = getAlphaOrchestrator();
    resetAlphaOrchestrator();
    const b = getAlphaOrchestrator();
    expect(a).not.toBe(b);
  });
});
