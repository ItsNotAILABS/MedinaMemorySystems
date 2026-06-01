// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 MULTI-ENGINE ORCHESTRATOR 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Sovereign Multi-Engine Intelligence — Coordinates multiple AI engines into
 * a unified cognitive substrate. Each engine specializes in a domain; the
 * orchestrator fuses their outputs using φ-weighted consensus for supreme
 * decision quality.
 *
 * Engine Domains:
 *   - UX Intelligence (UX-AI-001)
 *   - Reasoning Engine (REA-001)
 *   - Memory Engine (MEM-001)
 *   - Prediction Engine (PRD-001)
 *   - Creative Engine (CRE-001)
 *   - Security Engine (SEC-001)
 *   - Optimization Engine (OPT-001)
 *   - Communication Engine (COM-001)
 *
 * Features:
 *   - φ-weighted consensus across engines
 *   - Priority-based task routing
 *   - Engine health monitoring & failover
 *   - Parallel execution with golden-ratio load balancing
 *   - Cross-engine knowledge fusion
 *   - Adaptive engine scaling
 *
 * Charter: MULTI-ENG-001
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | June 2026
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { sovereignId } from './sovereign-id';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION I: CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_INVERSE = 1 / PHI;

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION II: TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export type EngineDomain = 'ux' | 'reasoning' | 'memory' | 'prediction' | 'creative' | 'security' | 'optimization' | 'communication';
export type EngineStatus = 'idle' | 'processing' | 'ready' | 'error' | 'scaling';
export type TaskPriority = 'critical' | 'high' | 'normal' | 'low' | 'background';
export type ConsensusStrategy = 'phi_weighted' | 'majority' | 'unanimous' | 'first_responder' | 'highest_confidence';

export interface EngineInstance {
  id: string;
  domain: EngineDomain;
  name: string;
  charter: string;
  status: EngineStatus;
  phiWeight: number;
  capacity: number;
  currentLoad: number;
  tasksCompleted: number;
  successRate: number;
  lastActivity: number;
}

export interface EngineTask {
  id: string;
  domain: EngineDomain;
  priority: TaskPriority;
  input: unknown;
  createdAt: number;
  assignedEngine?: string;
  status: 'pending' | 'assigned' | 'executing' | 'completed' | 'failed';
  result?: EngineResult;
}

export interface EngineResult {
  engineId: string;
  domain: EngineDomain;
  output: unknown;
  confidence: number;
  executionTimeMs: number;
  phiCoherence: number;
  timestamp: number;
}

export interface ConsensusResult {
  id: string;
  strategy: ConsensusStrategy;
  results: EngineResult[];
  fusedOutput: unknown;
  overallConfidence: number;
  phiAlignment: number;
  participatingEngines: string[];
  timestamp: number;
}

export interface OrchestratorMetrics {
  totalEngines: number;
  activeEngines: number;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageConfidence: number;
  phiCoherence: number;
  consensusCount: number;
  uptime: number;
}

export interface MultiEngineConfig {
  maxEnginesPerDomain: number;
  consensusStrategy: ConsensusStrategy;
  failoverThreshold: number;
  loadBalanceRatio: number;
  maxConcurrentTasks: number;
  healthCheckIntervalMs: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION III: MULTI-ENGINE ORCHESTRATOR CORE
// ═══════════════════════════════════════════════════════════════════════════════

export class MultiEngineOrchestrator {
  readonly charter = 'MULTI-ENG-001';
  readonly name = 'Multi-Engine Orchestrator';
  readonly version = '1.0.0';

  private active = false;
  private readonly startTime: number;
  private readonly engines: Map<string, EngineInstance> = new Map();
  private readonly tasks: Map<string, EngineTask> = new Map();
  private readonly consensusHistory: ConsensusResult[] = [];

  private readonly config: MultiEngineConfig = {
    maxEnginesPerDomain: 3,
    consensusStrategy: 'phi_weighted',
    failoverThreshold: 0.3,
    loadBalanceRatio: PHI_INVERSE,
    maxConcurrentTasks: 89, // Fibonacci
    healthCheckIntervalMs: 1000 / 7.83, // Schumann
  };

  constructor() {
    this.startTime = Date.now();
    this.initializeDefaultEngines();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INITIALIZATION
  // ─────────────────────────────────────────────────────────────────────────

  private initializeDefaultEngines(): void {
    const defaults: Array<{ domain: EngineDomain; name: string; charter: string }> = [
      { domain: 'ux', name: 'UX Intelligence Engine', charter: 'UX-AI-001' },
      { domain: 'reasoning', name: 'Reasoning Engine', charter: 'REA-001' },
      { domain: 'memory', name: 'Memory Engine', charter: 'MEM-001' },
      { domain: 'prediction', name: 'Prediction Engine', charter: 'PRD-001' },
      { domain: 'creative', name: 'Creative Engine', charter: 'CRE-001' },
      { domain: 'security', name: 'Security Engine', charter: 'SEC-001' },
      { domain: 'optimization', name: 'Optimization Engine', charter: 'OPT-001' },
      { domain: 'communication', name: 'Communication Engine', charter: 'COM-001' },
    ];

    for (let i = 0; i < defaults.length; i++) {
      const def = defaults[i];
      const id = `engine-${def.domain}-${sovereignId().slice(0, 8)}`;
      this.engines.set(id, {
        id,
        domain: def.domain,
        name: def.name,
        charter: def.charter,
        status: 'idle',
        phiWeight: Math.pow(PHI_INVERSE, i % 3),
        capacity: 100,
        currentLoad: 0,
        tasksCompleted: 0,
        successRate: 1.0,
        lastActivity: Date.now(),
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────────────────────────────────

  activate(): void {
    this.active = true;
    for (const engine of this.engines.values()) {
      engine.status = 'ready';
    }
  }

  deactivate(): void {
    this.active = false;
    for (const engine of this.engines.values()) {
      engine.status = 'idle';
    }
  }

  isActive(): boolean {
    return this.active;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ENGINE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────

  registerEngine(domain: EngineDomain, name: string, charter: string): EngineInstance {
    const domainEngines = this.getEnginesByDomain(domain);
    if (domainEngines.length >= this.config.maxEnginesPerDomain) {
      // Remove least active engine to make room
      const leastActive = domainEngines.sort((a, b) => a.lastActivity - b.lastActivity)[0];
      this.engines.delete(leastActive.id);
    }

    const engine: EngineInstance = {
      id: `engine-${domain}-${sovereignId().slice(0, 8)}`,
      domain,
      name,
      charter,
      status: this.active ? 'ready' : 'idle',
      phiWeight: PHI_INVERSE,
      capacity: 100,
      currentLoad: 0,
      tasksCompleted: 0,
      successRate: 1.0,
      lastActivity: Date.now(),
    };

    this.engines.set(engine.id, engine);
    return engine;
  }

  getEngine(id: string): EngineInstance | undefined {
    return this.engines.get(id);
  }

  getEnginesByDomain(domain: EngineDomain): EngineInstance[] {
    return Array.from(this.engines.values()).filter(e => e.domain === domain);
  }

  getAllEngines(): EngineInstance[] {
    return Array.from(this.engines.values());
  }

  getEngineCount(): number {
    return this.engines.size;
  }

  removeEngine(id: string): boolean {
    return this.engines.delete(id);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TASK MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────

  submitTask(domain: EngineDomain, input: unknown, priority: TaskPriority = 'normal'): EngineTask {
    const task: EngineTask = {
      id: sovereignId(),
      domain,
      priority,
      input,
      createdAt: Date.now(),
      status: 'pending',
    };

    this.tasks.set(task.id, task);

    if (this.active) {
      this.routeTask(task);
    }

    return task;
  }

  private routeTask(task: EngineTask): void {
    const candidates = this.getEnginesByDomain(task.domain)
      .filter(e => e.status === 'ready' || e.status === 'idle')
      .sort((a, b) => {
        // φ-weighted load balancing: prefer engines with lower load × higher phi weight
        const scoreA = (1 - a.currentLoad / a.capacity) * a.phiWeight * a.successRate;
        const scoreB = (1 - b.currentLoad / b.capacity) * b.phiWeight * b.successRate;
        return scoreB - scoreA;
      });

    if (candidates.length > 0) {
      const engine = candidates[0];
      task.assignedEngine = engine.id;
      task.status = 'assigned';
      engine.currentLoad += 1;
      engine.status = 'processing';
      engine.lastActivity = Date.now();
    }
  }

  executeTask(taskId: string, output: unknown, confidence: number): EngineResult | null {
    const task = this.tasks.get(taskId);
    if (!task || !task.assignedEngine) return null;

    const engine = this.engines.get(task.assignedEngine);
    if (!engine) return null;

    const executionTime = Date.now() - task.createdAt;
    const result: EngineResult = {
      engineId: engine.id,
      domain: task.domain,
      output,
      confidence,
      executionTimeMs: executionTime,
      phiCoherence: confidence * engine.phiWeight,
      timestamp: Date.now(),
    };

    task.result = result;
    task.status = 'completed';
    engine.currentLoad = Math.max(0, engine.currentLoad - 1);
    engine.tasksCompleted += 1;
    engine.status = engine.currentLoad > 0 ? 'processing' : 'ready';

    // Update success rate with φ-weighted moving average
    engine.successRate = engine.successRate * PHI_INVERSE + confidence * (1 - PHI_INVERSE);

    return result;
  }

  failTask(taskId: string, reason?: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = 'failed';

    if (task.assignedEngine) {
      const engine = this.engines.get(task.assignedEngine);
      if (engine) {
        engine.currentLoad = Math.max(0, engine.currentLoad - 1);
        engine.successRate = engine.successRate * PHI_INVERSE;
        engine.status = engine.currentLoad > 0 ? 'processing' : 'ready';

        // Failover check
        if (engine.successRate < this.config.failoverThreshold) {
          engine.status = 'error';
        }
      }
    }
  }

  getTask(id: string): EngineTask | undefined {
    return this.tasks.get(id);
  }

  getPendingTasks(): EngineTask[] {
    return Array.from(this.tasks.values()).filter(t => t.status === 'pending' || t.status === 'assigned');
  }

  getCompletedTasks(): EngineTask[] {
    return Array.from(this.tasks.values()).filter(t => t.status === 'completed');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CONSENSUS ENGINE — φ-WEIGHTED MULTI-ENGINE FUSION
  // ─────────────────────────────────────────────────────────────────────────

  computeConsensus(results: EngineResult[], strategy?: ConsensusStrategy): ConsensusResult {
    const activeStrategy = strategy || this.config.consensusStrategy;
    let fusedOutput: unknown;
    let overallConfidence: number;

    switch (activeStrategy) {
      case 'phi_weighted':
        ({ fusedOutput, overallConfidence } = this.phiWeightedConsensus(results));
        break;
      case 'highest_confidence':
        ({ fusedOutput, overallConfidence } = this.highestConfidenceConsensus(results));
        break;
      case 'first_responder':
        ({ fusedOutput, overallConfidence } = this.firstResponderConsensus(results));
        break;
      default:
        ({ fusedOutput, overallConfidence } = this.phiWeightedConsensus(results));
    }

    const phiAlignment = results.reduce((sum, r) => sum + r.phiCoherence, 0) / (results.length || 1);

    const consensus: ConsensusResult = {
      id: sovereignId(),
      strategy: activeStrategy,
      results,
      fusedOutput,
      overallConfidence,
      phiAlignment,
      participatingEngines: results.map(r => r.engineId),
      timestamp: Date.now(),
    };

    this.consensusHistory.push(consensus);
    return consensus;
  }

  private phiWeightedConsensus(results: EngineResult[]): { fusedOutput: unknown; overallConfidence: number } {
    if (results.length === 0) return { fusedOutput: null, overallConfidence: 0 };

    let totalWeight = 0;
    let weightedConfidence = 0;
    let bestResult = results[0];
    let bestScore = 0;

    for (const result of results) {
      const weight = result.confidence * result.phiCoherence * PHI_INVERSE;
      totalWeight += weight;
      weightedConfidence += result.confidence * weight;

      const score = result.confidence * result.phiCoherence;
      if (score > bestScore) {
        bestScore = score;
        bestResult = result;
      }
    }

    return {
      fusedOutput: bestResult.output,
      overallConfidence: totalWeight > 0 ? weightedConfidence / totalWeight : 0,
    };
  }

  private highestConfidenceConsensus(results: EngineResult[]): { fusedOutput: unknown; overallConfidence: number } {
    if (results.length === 0) return { fusedOutput: null, overallConfidence: 0 };
    const best = results.reduce((a, b) => a.confidence > b.confidence ? a : b);
    return { fusedOutput: best.output, overallConfidence: best.confidence };
  }

  private firstResponderConsensus(results: EngineResult[]): { fusedOutput: unknown; overallConfidence: number } {
    if (results.length === 0) return { fusedOutput: null, overallConfidence: 0 };
    const first = results.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
    return { fusedOutput: first.output, overallConfidence: first.confidence };
  }

  getConsensusHistory(): ConsensusResult[] {
    return [...this.consensusHistory];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // METRICS & HEALTH
  // ─────────────────────────────────────────────────────────────────────────

  getMetrics(): OrchestratorMetrics {
    const allTasks = Array.from(this.tasks.values());
    const completed = allTasks.filter(t => t.status === 'completed');
    const failed = allTasks.filter(t => t.status === 'failed');
    const activeEngines = Array.from(this.engines.values()).filter(e => e.status !== 'idle' && e.status !== 'error');

    const avgConfidence = completed.length > 0
      ? completed.reduce((sum, t) => sum + (t.result?.confidence || 0), 0) / completed.length
      : 0;

    const phiCoherence = completed.length > 0
      ? completed.reduce((sum, t) => sum + (t.result?.phiCoherence || 0), 0) / completed.length
      : PHI_INVERSE;

    return {
      totalEngines: this.engines.size,
      activeEngines: activeEngines.length,
      totalTasks: allTasks.length,
      completedTasks: completed.length,
      failedTasks: failed.length,
      averageConfidence: avgConfidence,
      phiCoherence,
      consensusCount: this.consensusHistory.length,
      uptime: Date.now() - this.startTime,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────

  getConfig(): MultiEngineConfig {
    return { ...this.config };
  }

  updateConfig(partial: Partial<MultiEngineConfig>): void {
    Object.assign(this.config, partial);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INTELLIGENCE REPORT
  // ─────────────────────────────────────────────────────────────────────────

  getIntelligenceReport(): {
    charter: string;
    name: string;
    version: string;
    active: boolean;
    engines: number;
    domains: EngineDomain[];
    tasks: number;
    consensus: number;
    metrics: OrchestratorMetrics;
  } {
    return {
      charter: this.charter,
      name: this.name,
      version: this.version,
      active: this.active,
      engines: this.engines.size,
      domains: [...new Set(Array.from(this.engines.values()).map(e => e.domain))],
      tasks: this.tasks.size,
      consensus: this.consensusHistory.length,
      metrics: this.getMetrics(),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let _instance: MultiEngineOrchestrator | null = null;

export function getMultiEngineOrchestrator(): MultiEngineOrchestrator {
  if (!_instance) {
    _instance = new MultiEngineOrchestrator();
  }
  return _instance;
}
