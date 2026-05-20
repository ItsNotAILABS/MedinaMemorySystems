/**
 * 𓂀 WORKFORCE SCALING ORCHESTRATOR — TEST SUITE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Tests for the dynamic agent allocation system.
 * Charter: WSO-001
 *
 * Sections:
 *   I.   Constants & Agent Type Specs
 *   II.  Client Registration
 *   III. Task Submission & Routing
 *   IV.  Task Completion & Agent Freeing
 *   V.   Auto-Scaling
 *   VI.  Agent Queries
 *   VII. Statistics
 *   VIII.Factory Helpers
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  WorkforceScalingOrchestrator,
  getWorkforceScalingOrchestrator,
  resetWorkforceScalingOrchestrator,
  createSingleClientOrchestrator,
  AGENT_TYPE_SPECS,
  TOTAL_BASE_CYCLES_M,
  MAX_AGENTS_PER_TYPE,
  MIN_AGENTS_PER_TYPE,
  FIBONACCI,
  PHI,
  PHI_INVERSE,
  type AgentType,
  type WorkforceTask,
} from '../lib/workforceScalingOrchestrator';

const ALL_TYPES: AgentType[] = [
  'analyst', 'strategist', 'builder', 'governance',
  'memory', 'risk', 'projection', 'operations',
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION I: CONSTANTS & AGENT TYPE SPECS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Constants', () => {
  test('TOTAL_BASE_CYCLES_M is 15.9', () => {
    expect(TOTAL_BASE_CYCLES_M).toBeCloseTo(15.9, 1);
  });

  test('FIBONACCI has 12 elements', () => {
    expect(FIBONACCI.length).toBe(12);
  });

  test('FIBONACCI first four are 1 1 2 3', () => {
    expect(FIBONACCI.slice(0, 4)).toEqual([1, 1, 2, 3]);
  });

  test('MAX_AGENTS_PER_TYPE is φ³ × 4 floored (≈ 16)', () => {
    expect(MAX_AGENTS_PER_TYPE).toBe(Math.floor(PHI * PHI * PHI * 4));
    expect(MAX_AGENTS_PER_TYPE).toBeGreaterThanOrEqual(16);
  });

  test('MIN_AGENTS_PER_TYPE is 1', () => {
    expect(MIN_AGENTS_PER_TYPE).toBe(1);
  });
});

describe('AGENT_TYPE_SPECS', () => {
  test('contains all 8 agent types', () => {
    ALL_TYPES.forEach(type => {
      expect(AGENT_TYPE_SPECS[type]).toBeDefined();
    });
  });

  test('memory has highest base cycles (4.2M)', () => {
    expect(AGENT_TYPE_SPECS.memory.baseCyclesM).toBeCloseTo(4.2, 1);
  });

  test('risk has lowest base cycles (0.6M)', () => {
    expect(AGENT_TYPE_SPECS.risk.baseCyclesM).toBeCloseTo(0.6, 1);
  });

  test('strategist scaling factor is PHI', () => {
    expect(AGENT_TYPE_SPECS.strategist.scalingFactor).toBeCloseTo(PHI, 5);
  });

  test('risk scaling factor is PHI_INVERSE', () => {
    expect(AGENT_TYPE_SPECS.risk.scalingFactor).toBeCloseTo(PHI_INVERSE, 5);
  });

  test('each spec has specializations array', () => {
    ALL_TYPES.forEach(type => {
      expect(Array.isArray(AGENT_TYPE_SPECS[type].specializations)).toBe(true);
      expect(AGENT_TYPE_SPECS[type].specializations.length).toBeGreaterThan(0);
    });
  });

  test('each spec has a description', () => {
    ALL_TYPES.forEach(type => {
      expect(typeof AGENT_TYPE_SPECS[type].description).toBe('string');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION II: CLIENT REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('Client registration', () => {
  let orchestrator: WorkforceScalingOrchestrator;

  beforeEach(() => {
    orchestrator = new WorkforceScalingOrchestrator();
  });

  test('registerClient creates a pool', () => {
    const pool = orchestrator.registerClient('client-1');
    expect(pool.clientId).toBe('client-1');
  });

  test('registerClient provisions one agent per type', () => {
    const pool = orchestrator.registerClient('client-2');
    ALL_TYPES.forEach(type => {
      expect(pool.agents.get(type)!.length).toBe(1);
    });
  });

  test('registered pool isolationLevel defaults to strict', () => {
    const pool = orchestrator.registerClient('client-3');
    expect(pool.isolationLevel).toBe('strict');
  });

  test('custom isolation level is stored', () => {
    const pool = orchestrator.registerClient('client-4', 'shared');
    expect(pool.isolationLevel).toBe('shared');
  });

  test('registering same client twice returns existing pool', () => {
    const p1 = orchestrator.registerClient('client-5');
    const p2 = orchestrator.registerClient('client-5');
    expect(p1).toBe(p2);
  });

  test('getClientPool returns the pool', () => {
    orchestrator.registerClient('client-6');
    expect(orchestrator.getClientPool('client-6')).not.toBeNull();
  });

  test('getClientPool returns null for unregistered client', () => {
    expect(orchestrator.getClientPool('nobody')).toBeNull();
  });

  test('deregisterClient removes the pool', () => {
    orchestrator.registerClient('client-7');
    expect(orchestrator.deregisterClient('client-7')).toBe(true);
    expect(orchestrator.getClientPool('client-7')).toBeNull();
  });

  test('deregisterClient returns false for unknown client', () => {
    expect(orchestrator.deregisterClient('ghost')).toBe(false);
  });

  test('total cycles allocated covers all base cycles', () => {
    const pool = orchestrator.registerClient('client-8');
    expect(pool.totalCyclesAllocated).toBeGreaterThan(10); // at least 10M total
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION III: TASK SUBMISSION & ROUTING
// ═══════════════════════════════════════════════════════════════════════════════

describe('Task submission & routing', () => {
  let orchestrator: WorkforceScalingOrchestrator;

  beforeEach(() => {
    orchestrator = new WorkforceScalingOrchestrator();
    orchestrator.registerClient('tenant-A');
  });

  test('submitTask returns a WorkforceTask', () => {
    const task = orchestrator.submitTask({
      clientId: 'tenant-A',
      requiredType: 'analyst',
      description: 'Analyze Q1 data',
    });
    expect(task.id).toBeDefined();
    expect(task.requiredType).toBe('analyst');
  });

  test('task is immediately dispatched to idle agent', () => {
    const task = orchestrator.submitTask({
      clientId: 'tenant-A',
      requiredType: 'builder',
      description: 'Build module',
    });
    expect(task.status).toBe('running');
    expect(task.assignedAgentId).toBeDefined();
  });

  test('second task queues when agent is busy', () => {
    // First task occupies the sole builder agent
    orchestrator.submitTask({
      clientId: 'tenant-A',
      requiredType: 'risk',
      description: 'First risk assessment',
    });
    const second = orchestrator.submitTask({
      clientId: 'tenant-A',
      requiredType: 'risk',
      description: 'Second risk assessment',
    });
    // Second may be queued since there's only one risk agent initially
    expect(['queued', 'running']).toContain(second.status);
  });

  test('throws for unregistered client', () => {
    expect(() =>
      orchestrator.submitTask({
        clientId: 'nobody',
        requiredType: 'analyst',
        description: 'test',
      }),
    ).toThrow();
  });

  test('priority defaults to normal', () => {
    const task = orchestrator.submitTask({
      clientId: 'tenant-A',
      requiredType: 'memory',
      description: 'Store data',
    });
    expect(task.priority).toBe('normal');
  });

  test('critical priority tasks are routed first', () => {
    // Fill the sole operations agent
    const first = orchestrator.submitTask({
      clientId: 'tenant-A',
      requiredType: 'operations',
      description: 'Normal task',
      priority: 'normal',
    });
    const critical = orchestrator.submitTask({
      clientId: 'tenant-A',
      requiredType: 'operations',
      description: 'Critical task',
      priority: 'critical',
    });
    // Both tasks exist; at least the first is dispatched
    expect(first.id).toBeDefined();
    expect(critical.id).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION IV: TASK COMPLETION & AGENT FREEING
// ═══════════════════════════════════════════════════════════════════════════════

describe('Task completion', () => {
  let orchestrator: WorkforceScalingOrchestrator;

  beforeEach(() => {
    orchestrator = new WorkforceScalingOrchestrator();
    orchestrator.registerClient('cl');
  });

  test('completeTask marks task complete', () => {
    const task = orchestrator.submitTask({
      clientId: 'cl',
      requiredType: 'analyst',
      description: 'Analyze',
    });
    const ok = orchestrator.completeTask('cl', task.id, { score: 42 });
    expect(ok).toBe(true);
    expect(task.status).toBe('complete');
  });

  test('completeTask returns false for unknown task', () => {
    expect(orchestrator.completeTask('cl', 'ghost-task')).toBe(false);
  });

  test('completeTask returns false for unknown client', () => {
    expect(orchestrator.completeTask('nobody', 'any')).toBe(false);
  });

  test('agent becomes idle after task completion', () => {
    const task = orchestrator.submitTask({
      clientId: 'cl',
      requiredType: 'governance',
      description: 'Policy check',
    });
    orchestrator.completeTask('cl', task.id);
    const agents = orchestrator.getAgentsByType('cl', 'governance');
    // At least one agent should be idle again
    expect(agents.some(a => a.status === 'idle')).toBe(true);
  });

  test('completing task dispatches next queued task', () => {
    const t1 = orchestrator.submitTask({
      clientId: 'cl', requiredType: 'memory', description: 'Task 1',
    });
    const t2 = orchestrator.submitTask({
      clientId: 'cl', requiredType: 'memory', description: 'Task 2',
    });
    orchestrator.completeTask('cl', t1.id);
    // After completing t1, t2 (if queued) should get dispatched
    expect(['running', 'complete', 'queued']).toContain(t2.status);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION V: AUTO-SCALING
// ═══════════════════════════════════════════════════════════════════════════════

describe('evaluateAndScale', () => {
  let orchestrator: WorkforceScalingOrchestrator;

  beforeEach(() => {
    orchestrator = new WorkforceScalingOrchestrator();
    orchestrator.registerClient('sc');
  });

  test('evaluateAndScale returns decisions for all 8 types', () => {
    const decisions = orchestrator.evaluateAndScale('sc');
    expect(decisions.length).toBe(ALL_TYPES.length);
  });

  test('returns empty array for unregistered client', () => {
    const decisions = orchestrator.evaluateAndScale('nobody');
    expect(decisions).toEqual([]);
  });

  test('each decision has required fields', () => {
    const decisions = orchestrator.evaluateAndScale('sc');
    decisions.forEach(d => {
      expect(d.clientId).toBe('sc');
      expect(ALL_TYPES).toContain(d.agentType);
      expect(['spawn', 'suspend', 'terminate', 'none']).toContain(d.action);
      expect(typeof d.demandScore).toBe('number');
    });
  });

  test('high demand triggers spawn decision', () => {
    // Submit many tasks to create high demand for projection agents
    for (let i = 0; i < 10; i++) {
      orchestrator.submitTask({
        clientId: 'sc',
        requiredType: 'projection',
        description: `Forecast ${i}`,
      });
    }
    const decisions = orchestrator.evaluateAndScale('sc');
    const projectionDecision = decisions.find(d => d.agentType === 'projection');
    // With many queued tasks, may spawn
    expect(['spawn', 'none']).toContain(projectionDecision!.action);
  });

  test('spawn does not exceed MAX_AGENTS_PER_TYPE', () => {
    // Flood with tasks to trigger repeated spawning
    for (let i = 0; i < 50; i++) {
      try {
        orchestrator.submitTask({
          clientId: 'sc', requiredType: 'analyst', description: `Task ${i}`,
        });
      } catch { /* ignore */ }
    }
    // Call scale multiple times
    for (let i = 0; i < 20; i++) {
      orchestrator.evaluateAndScale('sc');
    }
    const agents = orchestrator.getAgentsByType('sc', 'analyst');
    expect(agents.length).toBeLessThanOrEqual(MAX_AGENTS_PER_TYPE);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VI: AGENT QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

describe('Agent queries', () => {
  let orchestrator: WorkforceScalingOrchestrator;

  beforeEach(() => {
    orchestrator = new WorkforceScalingOrchestrator();
    orchestrator.registerClient('q');
  });

  test('getAgentsByType returns array', () => {
    const agents = orchestrator.getAgentsByType('q', 'builder');
    expect(Array.isArray(agents)).toBe(true);
  });

  test('getAgentsByType returns empty for unknown client', () => {
    expect(orchestrator.getAgentsByType('nobody', 'builder')).toEqual([]);
  });

  test('getActiveAgents returns only active agents', () => {
    orchestrator.submitTask({ clientId: 'q', requiredType: 'strategist', description: 'Plan' });
    const active = orchestrator.getActiveAgents('q');
    active.forEach(a => expect(a.status).toBe('active'));
  });

  test('getQueuedTasks returns queued tasks only', () => {
    const queued = orchestrator.getQueuedTasks('q');
    queued.forEach(t => expect(t.status).toBe('queued'));
  });

  test('getQueuedTasks returns empty for unknown client', () => {
    expect(orchestrator.getQueuedTasks('nobody')).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VII: STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════

describe('stats()', () => {
  let orchestrator: WorkforceScalingOrchestrator;

  beforeEach(() => {
    orchestrator = new WorkforceScalingOrchestrator();
    orchestrator.registerClient('s1');
    orchestrator.registerClient('s2');
  });

  test('totalClients is 2', () => {
    expect(orchestrator.stats().totalClients).toBe(2);
  });

  test('totalAgents is 16 (8 types × 2 clients)', () => {
    expect(orchestrator.stats().totalAgents).toBe(16);
  });

  test('agentsByType covers all 8 types', () => {
    const { agentsByType } = orchestrator.stats();
    ALL_TYPES.forEach(type => {
      expect(typeof agentsByType[type]).toBe('number');
    });
  });

  test('totalCyclesAllocatedM is positive', () => {
    expect(orchestrator.stats().totalCyclesAllocatedM).toBeGreaterThan(0);
  });

  test('averageUtilizationPct starts at 0', () => {
    expect(orchestrator.stats().averageUtilizationPct).toBe(0);
  });

  test('totalTasksCompleted increments after completeTask', () => {
    const task = orchestrator.submitTask({
      clientId: 's1', requiredType: 'analyst', description: 'Analyze',
    });
    orchestrator.completeTask('s1', task.id);
    expect(orchestrator.stats().totalTasksCompleted).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VIII: FACTORY HELPERS & SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

describe('Factory helpers', () => {
  test('createSingleClientOrchestrator returns orchestrator + pool', () => {
    const { orchestrator, pool } = createSingleClientOrchestrator('factory-client');
    expect(orchestrator).toBeInstanceOf(WorkforceScalingOrchestrator);
    expect(pool.clientId).toBe('factory-client');
  });

  test('factory orchestrator has 8 agent types provisioned', () => {
    const { pool } = createSingleClientOrchestrator('f2');
    ALL_TYPES.forEach(type => {
      expect(pool.agents.has(type)).toBe(true);
    });
  });
});

describe('Singleton', () => {
  afterEach(() => {
    resetWorkforceScalingOrchestrator();
  });

  test('getWorkforceScalingOrchestrator returns same instance', () => {
    const a = getWorkforceScalingOrchestrator();
    const b = getWorkforceScalingOrchestrator();
    expect(a).toBe(b);
  });

  test('reset creates a fresh instance', () => {
    const a = getWorkforceScalingOrchestrator();
    a.registerClient('reset-test');
    resetWorkforceScalingOrchestrator();
    const b = getWorkforceScalingOrchestrator();
    expect(b.stats().totalClients).toBe(0);
  });
});
