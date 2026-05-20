// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 WORKFORCE SCALING ORCHESTRATOR 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Dynamic agent allocation for enterprise AI operations, as described in
 * papers/arxiv/WORKFORCE_SCALING_DISTRIBUTED_AI.md
 *
 * Eight specialist agent types with φ-scaled cycle allocations:
 *
 *   Analyst    1.0M cycles × 1.0φ   — data analysis, pattern recognition
 *   Strategist 1.6M cycles × 1.6φ   — planning, coordination
 *   Builder    2.6M cycles × 2.6φ   — artifact construction, code generation
 *   Governance 2.6M cycles × 2.6φ   — policy enforcement, compliance
 *   Memory     4.2M cycles × 4.2φ   — knowledge management
 *   Risk       0.6M cycles × 0.6φ   — danger assessment
 *   Projection 1.6M cycles × 1.6φ   — forecasting
 *   Operations 1.6M cycles × 1.6φ   — task execution
 *
 * Features:
 *   - Per-client agent pools (multi-tenant isolation)
 *   - Demand-based auto-scaling
 *   - φ-weighted resource allocation
 *   - Agent lifecycle management (spawn, suspend, terminate)
 *   - Cross-agent task routing
 *
 * Charter: WSO-001
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { sovereignId } from './sovereign-id';
import {
  PHI,
  PHI_INVERSE,
  PHI_SQUARED,
  SCHUMANN_FUNDAMENTAL,
  HEARTBEAT_MS,
} from './kernelCompression';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION I: CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/** Total base cycles across all agent types (millions) */
export const TOTAL_BASE_CYCLES_M = 15.9;

/** Fibonacci sequence used for cycle scaling */
export const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

/** Maximum agents per type per client */
export const MAX_AGENTS_PER_TYPE = Math.floor(PHI * PHI * PHI * 4); // ≈ 16

/** Minimum agents per type per client (always at least one) */
export const MIN_AGENTS_PER_TYPE = 1;

/** Demand scaling ceiling (beyond this, queue rather than spawn) */
export const DEMAND_CEILING = PHI * PHI * PHI * PHI; // φ⁴ ≈ 6.85

/** Idle timeout before agent suspension (ms) */
export const IDLE_TIMEOUT_MS = HEARTBEAT_MS * FIBONACCI[7]; // 873ms × 21

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION II: TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type AgentType =
  | 'analyst'
  | 'strategist'
  | 'builder'
  | 'governance'
  | 'memory'
  | 'risk'
  | 'projection'
  | 'operations';

export type AgentStatus =
  | 'idle'
  | 'active'
  | 'overloaded'
  | 'suspended'
  | 'terminated';

export type TaskPriority = 'critical' | 'high' | 'normal' | 'low';

export type IsolationLevel = 'strict' | 'shared' | 'federated';

/** Static definition for each agent type */
export interface AgentTypeSpec {
  type: AgentType;
  baseCyclesM: number;   // base million cycles
  scalingFactor: number; // multiplier under high demand
  specializations: string[];
  description: string;
}

/** A running agent instance */
export interface WorkforceAgent {
  id: string;
  type: AgentType;
  clientId: string;
  status: AgentStatus;
  cycleAllocation: number;     // actual cycles for this instance (M)
  tasksCompleted: number;
  tasksQueued: number;
  currentTask?: string;
  spawnedAt: string;
  lastActiveAt: string;
  utilizationPct: number;      // 0–100
  resonanceScore: number;
}

/** A task to be routed and executed */
export interface WorkforceTask {
  id: string;
  clientId: string;
  requiredType: AgentType;
  priority: TaskPriority;
  description: string;
  estimatedCycles: number;
  submittedAt: string;
  startedAt?: string;
  completedAt?: string;
  assignedAgentId?: string;
  result?: unknown;
  status: 'queued' | 'running' | 'complete' | 'failed';
}

/** Per-client agent pool */
export interface ClientPool {
  clientId: string;
  isolationLevel: IsolationLevel;
  agents: Map<AgentType, WorkforceAgent[]>;
  taskQueue: WorkforceTask[];
  totalCyclesAllocated: number;
  createdAt: string;
  lastScaleAt: string;
}

/** Scaling decision produced by the auto-scaler */
export interface ScalingDecision {
  clientId: string;
  agentType: AgentType;
  action: 'spawn' | 'suspend' | 'terminate' | 'none';
  reason: string;
  demandScore: number;
  newCount: number;
  previousCount: number;
}

/** Orchestrator-level statistics */
export interface OrchestratorStats {
  totalClients: number;
  totalAgents: number;
  agentsByType: Record<AgentType, number>;
  agentsByStatus: Record<AgentStatus, number>;
  totalTasksQueued: number;
  totalTasksCompleted: number;
  averageUtilizationPct: number;
  totalCyclesAllocatedM: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION III: AGENT TYPE SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const AGENT_TYPE_SPECS: Record<AgentType, AgentTypeSpec> = {
  analyst: {
    type:           'analyst',
    baseCyclesM:    1.0,
    scalingFactor:  1.0,
    specializations: [
      'data analysis', 'pattern recognition', 'report generation',
      'metric computation', 'trend identification', 'anomaly detection',
    ],
    description: 'Analyze data, detect patterns, generate reports.',
  },
  strategist: {
    type:           'strategist',
    baseCyclesM:    1.6,
    scalingFactor:  PHI,          // scales by φ
    specializations: [
      'long-term planning', 'resource allocation decisions', 'priority setting',
      'goal decomposition', 'cross-agent coordination',
    ],
    description: 'Plan, coordinate and allocate resources across agents.',
  },
  builder: {
    type:           'builder',
    baseCyclesM:    2.6,
    scalingFactor:  PHI_SQUARED,  // scales by φ²
    specializations: [
      'artifact construction', 'code generation', 'document creation',
      'system assembly', 'integration work',
    ],
    description: 'Construct code, documents, and system artifacts.',
  },
  governance: {
    type:           'governance',
    baseCyclesM:    2.6,
    scalingFactor:  PHI_SQUARED,
    specializations: [
      'policy enforcement', 'compliance checking', 'approval workflows',
      'audit logging', 'access control',
    ],
    description: 'Enforce policies, maintain compliance, manage approvals.',
  },
  memory: {
    type:           'memory',
    baseCyclesM:    4.2,
    scalingFactor:  PHI_SQUARED * PHI, // φ³
    specializations: [
      'knowledge storage', 'semantic retrieval', 'context management',
      'memory consolidation', 'knowledge graph updates',
    ],
    description: 'Manage knowledge, store and retrieve semantic memories.',
  },
  risk: {
    type:           'risk',
    baseCyclesM:    0.6,
    scalingFactor:  PHI_INVERSE,  // scales by φ⁻¹
    specializations: [
      'danger assessment', 'probability scoring', 'mitigation planning',
      'threat modelling', 'incident response',
    ],
    description: 'Assess risks, model threats, plan mitigations.',
  },
  projection: {
    type:           'projection',
    baseCyclesM:    1.6,
    scalingFactor:  PHI,
    specializations: [
      'outcome forecasting', 'simulation running', 'scenario modelling',
      'capacity planning', 'revenue projection',
    ],
    description: 'Forecast outcomes and model future scenarios.',
  },
  operations: {
    type:           'operations',
    baseCyclesM:    1.6,
    scalingFactor:  PHI,
    specializations: [
      'task execution', 'workflow orchestration', 'pipeline management',
      'monitoring', 'alerting', 'incident handling',
    ],
    description: 'Execute tasks, manage workflows, operate pipelines.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION IV: WORKFORCE SCALING ORCHESTRATOR CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class WorkforceScalingOrchestrator {
  private pools: Map<string, ClientPool> = new Map();
  private globalTaskCount = 0;
  private globalCompletedCount = 0;

  // ───────────────────────────────────────────────────────────────────────────
  // CLIENT POOL MANAGEMENT
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Register a new client and provision their initial agent pool.
   * Spawns one agent of each type by default.
   */
  registerClient(
    clientId: string,
    isolationLevel: IsolationLevel = 'strict',
  ): ClientPool {
    if (this.pools.has(clientId)) {
      return this.pools.get(clientId)!;
    }

    const agents = new Map<AgentType, WorkforceAgent[]>();
    let totalCycles = 0;

    for (const type of Object.keys(AGENT_TYPE_SPECS) as AgentType[]) {
      const spec = AGENT_TYPE_SPECS[type];
      const agent = this._spawnAgent(clientId, type, spec.baseCyclesM);
      agents.set(type, [agent]);
      totalCycles += spec.baseCyclesM;
    }

    const pool: ClientPool = {
      clientId,
      isolationLevel,
      agents,
      taskQueue: [],
      totalCyclesAllocated: totalCycles,
      createdAt: new Date().toISOString(),
      lastScaleAt: new Date().toISOString(),
    };

    this.pools.set(clientId, pool);
    return pool;
  }

  /**
   * Remove a client and terminate all their agents.
   */
  deregisterClient(clientId: string): boolean {
    const pool = this.pools.get(clientId);
    if (!pool) return false;
    // Mark all agents terminated
    for (const agents of pool.agents.values()) {
      agents.forEach(a => { a.status = 'terminated'; });
    }
    this.pools.delete(clientId);
    return true;
  }

  getClientPool(clientId: string): ClientPool | null {
    return this.pools.get(clientId) ?? null;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TASK SUBMISSION & ROUTING
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Submit a task for a client. Auto-routes to the best available agent.
   * If no agent is free, queues the task.
   */
  submitTask(params: {
    clientId: string;
    requiredType: AgentType;
    description: string;
    priority?: TaskPriority;
    estimatedCycles?: number;
  }): WorkforceTask {
    const pool = this.pools.get(params.clientId);
    if (!pool) throw new Error(`Client "${params.clientId}" is not registered`);

    const task: WorkforceTask = {
      id: sovereignId(),
      clientId:        params.clientId,
      requiredType:    params.requiredType,
      priority:        params.priority ?? 'normal',
      description:     params.description,
      estimatedCycles: params.estimatedCycles ?? AGENT_TYPE_SPECS[params.requiredType].baseCyclesM * 0.1,
      submittedAt:     new Date().toISOString(),
      status:          'queued',
    };

    this.globalTaskCount++;
    pool.taskQueue.push(task);
    this._sortQueue(pool);
    this._tryDispatch(pool, task);
    return task;
  }

  /**
   * Mark a task complete and free the agent.
   */
  completeTask(clientId: string, taskId: string, result?: unknown): boolean {
    const pool = this.pools.get(clientId);
    if (!pool) return false;

    const task = pool.taskQueue.find(t => t.id === taskId);
    if (!task) return false;

    task.status = 'complete';
    task.completedAt = new Date().toISOString();
    task.result = result;
    this.globalCompletedCount++;

    // Free the assigned agent
    if (task.assignedAgentId) {
      for (const agents of pool.agents.values()) {
        const agent = agents.find(a => a.id === task.assignedAgentId);
        if (agent) {
          agent.status = 'idle';
          agent.currentTask = undefined;
          agent.lastActiveAt = new Date().toISOString();
          agent.tasksCompleted++;
          agent.utilizationPct = Math.max(0, agent.utilizationPct - 20);
          break;
        }
      }
    }

    // Try to dispatch next queued task of this type
    const nextQueued = pool.taskQueue.find(
      t => t.status === 'queued' && t.requiredType === task.requiredType,
    );
    if (nextQueued) this._tryDispatch(pool, nextQueued);

    return true;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // AUTO-SCALING
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Evaluate current demand and produce scaling decisions for a client.
   * Call periodically (e.g., every HEARTBEAT_MS).
   */
  evaluateAndScale(clientId: string): ScalingDecision[] {
    const pool = this.pools.get(clientId);
    if (!pool) return [];

    const decisions: ScalingDecision[] = [];

    for (const type of Object.keys(AGENT_TYPE_SPECS) as AgentType[]) {
      const agents = pool.agents.get(type) ?? [];
      const active  = agents.filter(a => a.status === 'active').length;
      const queued  = pool.taskQueue.filter(
        t => t.status === 'queued' && t.requiredType === type,
      ).length;

      // Demand score: ratio of queued tasks to active agents
      const demandScore = active > 0 ? queued / active : (queued > 0 ? DEMAND_CEILING : 0);

      let action: ScalingDecision['action'] = 'none';
      let reason = 'demand balanced';
      let newCount = agents.length;

      if (demandScore > PHI && agents.length < MAX_AGENTS_PER_TYPE) {
        // Scale up
        const spec = AGENT_TYPE_SPECS[type];
        const scaledCycles = spec.baseCyclesM * spec.scalingFactor;
        const agent = this._spawnAgent(clientId, type, scaledCycles);
        pool.agents.get(type)!.push(agent);
        pool.totalCyclesAllocated += scaledCycles;
        action = 'spawn';
        reason = `demand score ${demandScore.toFixed(2)} > φ (${PHI.toFixed(3)})`;
        newCount = agents.length + 1;

        // Dispatch any waiting task to the new agent
        const waiting = pool.taskQueue.find(
          t => t.status === 'queued' && t.requiredType === type,
        );
        if (waiting) this._tryDispatch(pool, waiting);

      } else if (
        demandScore < PHI_INVERSE &&
        agents.length > MIN_AGENTS_PER_TYPE
      ) {
        // Scale down — suspend idle agents
        const idle = agents.find(a => a.status === 'idle');
        if (idle) {
          idle.status = 'suspended';
          action = 'suspend';
          reason = `demand score ${demandScore.toFixed(2)} < φ⁻¹ (${PHI_INVERSE.toFixed(3)})`;
          newCount = agents.length - 1;
        }
      }

      decisions.push({
        clientId,
        agentType: type,
        action,
        reason,
        demandScore,
        newCount,
        previousCount: agents.filter(a => a.status !== 'terminated').length,
      });
    }

    pool.lastScaleAt = new Date().toISOString();
    return decisions;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // AGENT QUERIES
  // ───────────────────────────────────────────────────────────────────────────

  getAgentsByType(clientId: string, type: AgentType): WorkforceAgent[] {
    return this.pools.get(clientId)?.agents.get(type) ?? [];
  }

  getActiveAgents(clientId: string): WorkforceAgent[] {
    const pool = this.pools.get(clientId);
    if (!pool) return [];
    const result: WorkforceAgent[] = [];
    for (const agents of pool.agents.values()) {
      result.push(...agents.filter(a => a.status === 'active'));
    }
    return result;
  }

  getQueuedTasks(clientId: string): WorkforceTask[] {
    return this.pools.get(clientId)?.taskQueue.filter(t => t.status === 'queued') ?? [];
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STATISTICS
  // ───────────────────────────────────────────────────────────────────────────

  stats(): OrchestratorStats {
    const agentsByType = {} as Record<AgentType, number>;
    const agentsByStatus = {} as Record<AgentStatus, number>;
    let totalAgents = 0;
    let totalQueued = 0;
    let totalCompleted = 0;
    let totalUtilization = 0;
    let totalCycles = 0;

    for (const type of Object.keys(AGENT_TYPE_SPECS) as AgentType[]) {
      agentsByType[type] = 0;
    }
    for (const status of ['idle', 'active', 'overloaded', 'suspended', 'terminated'] as AgentStatus[]) {
      agentsByStatus[status] = 0;
    }

    for (const pool of this.pools.values()) {
      for (const agents of pool.agents.values()) {
        for (const agent of agents) {
          totalAgents++;
          agentsByType[agent.type] = (agentsByType[agent.type] ?? 0) + 1;
          agentsByStatus[agent.status] = (agentsByStatus[agent.status] ?? 0) + 1;
          totalUtilization += agent.utilizationPct;
          totalCycles += agent.cycleAllocation;
        }
      }
      totalQueued += pool.taskQueue.filter(t => t.status === 'queued').length;
      totalCompleted += pool.taskQueue.filter(t => t.status === 'complete').length;
    }

    return {
      totalClients:          this.pools.size,
      totalAgents,
      agentsByType,
      agentsByStatus,
      totalTasksQueued:      totalQueued,
      totalTasksCompleted:   totalCompleted + this.globalCompletedCount,
      averageUtilizationPct: totalAgents > 0 ? totalUtilization / totalAgents : 0,
      totalCyclesAllocatedM: totalCycles,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ───────────────────────────────────────────────────────────────────────────

  private _spawnAgent(clientId: string, type: AgentType, cycleAllocation: number): WorkforceAgent {
    const spec = AGENT_TYPE_SPECS[type];
    return {
      id:               sovereignId(),
      type,
      clientId,
      status:           'idle',
      cycleAllocation,
      tasksCompleted:   0,
      tasksQueued:      0,
      spawnedAt:        new Date().toISOString(),
      lastActiveAt:     new Date().toISOString(),
      utilizationPct:   0,
      resonanceScore:   PHI_INVERSE + (spec.scalingFactor * PHI_INVERSE),
    };
  }

  private _tryDispatch(pool: ClientPool, task: WorkforceTask): boolean {
    const agents = pool.agents.get(task.requiredType) ?? [];
    const agent = agents.find(a => a.status === 'idle');
    if (!agent) return false;

    agent.status = 'active';
    agent.currentTask = task.description;
    agent.tasksQueued++;
    agent.utilizationPct = Math.min(100, agent.utilizationPct + 30);

    task.status = 'running';
    task.startedAt = new Date().toISOString();
    task.assignedAgentId = agent.id;
    return true;
  }

  private _sortQueue(pool: ClientPool): void {
    const priority: Record<TaskPriority, number> = {
      critical: 0,
      high:     1,
      normal:   2,
      low:      3,
    };
    pool.taskQueue.sort((a, b) => priority[a.priority] - priority[b.priority]);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION V: SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let _instance: WorkforceScalingOrchestrator | null = null;

export function getWorkforceScalingOrchestrator(): WorkforceScalingOrchestrator {
  if (!_instance) _instance = new WorkforceScalingOrchestrator();
  return _instance;
}

export function resetWorkforceScalingOrchestrator(): void {
  _instance = null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VI: FACTORY HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a pre-configured orchestrator with one client already registered.
 */
export function createSingleClientOrchestrator(
  clientId: string,
  isolationLevel: IsolationLevel = 'strict',
): { orchestrator: WorkforceScalingOrchestrator; pool: ClientPool } {
  const orchestrator = new WorkforceScalingOrchestrator();
  const pool = orchestrator.registerClient(clientId, isolationLevel);
  return { orchestrator, pool };
}

export {
  PHI,
  PHI_INVERSE,
  PHI_SQUARED,
  SCHUMANN_FUNDAMENTAL,
  HEARTBEAT_MS,
};
