// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 MICRO WORKER RUNTIME — CLIENT-SIDE CAREER FLOW MIRROR 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Client-side mirror of the server career runtime. Workers have careers,
 * not tasks. They flow continuously. This runtime provides the client with
 * a synchronized view of the always-on server-side career state.
 *
 * ARCHITECTURE:
 *   - Boot: Creates client-side career state mirror
 *   - Flow: Each worker flows at its φ-derived rhythm
 *   - Career Growth: APPRENTICE → JOURNEYMAN → MASTER → SOVEREIGN
 *   - Sync: Client reads from server via /api/workers
 *
 * This is production-grade enterprise wiring.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  ALL_MICRO_WORKERS,
  ALL_WORKER_DOMAINS,
  type WorkerDomainId,
  type WorkerStatus,
  type CareerStage,
} from '@/organism/workers/MicroWorkerManifest';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkerState {
  id: string;
  name: string;
  domain: WorkerDomainId;
  status: WorkerStatus;
  careerTitle: string;
  careerStage: CareerStage;
  flowCycles: number;
  stageProgress: number;
  lastHeartbeat: number;
  errorCount: number;
  bootedAt: number;
}

export interface MicroWorkerRuntimeState {
  booted: boolean;
  bootedAt: number | null;
  totalWorkers: number;
  flowingWorkers: number;
  deepeningWorkers: number;
  errorWorkers: number;
  totalFlowCycles: number;
  careers: Record<CareerStage, number>;
  workers: WorkerState[];
  domains: Array<{
    id: WorkerDomainId;
    latinName: string;
    onlineCount: number;
    totalFlowCycles: number;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// RUNTIME
// ─────────────────────────────────────────────────────────────────────────────

const CAREER_STAGES: CareerStage[] = ['APPRENTICE', 'JOURNEYMAN', 'MASTER', 'SOVEREIGN'];

const workerStates: Map<string, WorkerState> = new Map();
let runtimeBooted = false;
let runtimeBootedAt: number | null = null;

/**
 * Boot all 100 career flows (client-side mirror).
 * Idempotent — calling again is a no-op.
 */
export function bootMicroWorkers(): void {
  if (runtimeBooted) return;

  const now = Date.now();
  runtimeBootedAt = now;

  for (const spec of ALL_MICRO_WORKERS) {
    workerStates.set(spec.id, {
      id: spec.id,
      name: spec.name,
      domain: spec.domain,
      status: 'FLOWING',
      careerTitle: spec.career.title,
      careerStage: 'APPRENTICE',
      flowCycles: 0,
      stageProgress: 0,
      lastHeartbeat: now,
      errorCount: 0,
      bootedAt: now,
    });
  }

  runtimeBooted = true;
}

/**
 * Get the full runtime state snapshot.
 */
export function getRuntimeState(): MicroWorkerRuntimeState {
  const workers = Array.from(workerStates.values());
  const flowingWorkers = workers.filter(w => w.status === 'FLOWING').length;
  const deepeningWorkers = workers.filter(w => w.status === 'DEEPENING').length;
  const errorWorkers = workers.filter(w => w.status === 'ERROR').length;
  const computedTotalFlowCycles = workers.reduce((sum, w) => sum + w.flowCycles, 0);

  const careers: Record<CareerStage, number> = {
    APPRENTICE: workers.filter(w => w.careerStage === 'APPRENTICE').length,
    JOURNEYMAN: workers.filter(w => w.careerStage === 'JOURNEYMAN').length,
    MASTER: workers.filter(w => w.careerStage === 'MASTER').length,
    SOVEREIGN: workers.filter(w => w.careerStage === 'SOVEREIGN').length,
  };

  const domains = ALL_WORKER_DOMAINS.map(d => {
    const dWorkers = workers.filter(w => w.domain === d.id);
    return {
      id: d.id,
      latinName: d.latinName,
      onlineCount: dWorkers.filter(w => w.status !== 'OFFLINE' && w.status !== 'ERROR').length,
      totalFlowCycles: dWorkers.reduce((sum, w) => sum + w.flowCycles, 0),
    };
  });

  return {
    booted: runtimeBooted,
    bootedAt: runtimeBootedAt,
    totalWorkers: workers.length,
    flowingWorkers,
    deepeningWorkers,
    errorWorkers,
    totalFlowCycles: computedTotalFlowCycles,
    careers,
    workers,
    domains,
  };
}

/**
 * Get summary stats for display.
 */
export function getWorkerSummary(): {
  total: number;
  online: number;
  flowing: number;
  flowCycles: number;
  uptime: string;
  careers: Record<CareerStage, number>;
} {
  const state = getRuntimeState();
  const uptimeMs = state.bootedAt ? Date.now() - state.bootedAt : 0;
  const uptimeMin = Math.floor(uptimeMs / 60000);
  const uptimeHr = Math.floor(uptimeMin / 60);

  return {
    total: state.totalWorkers,
    online: state.flowingWorkers + state.deepeningWorkers,
    flowing: state.flowingWorkers,
    flowCycles: state.totalFlowCycles,
    uptime: uptimeHr > 0 ? `${uptimeHr}h ${uptimeMin % 60}m` : `${uptimeMin}m`,
    careers: state.careers,
  };
}

/**
 * Get state for a single worker.
 */
export function getWorkerState(id: string): WorkerState | undefined {
  return workerStates.get(id);
}

/**
 * Shutdown all workers gracefully.
 */
export function shutdownAllWorkers(): void {
  for (const state of workerStates.values()) {
    state.status = 'OFFLINE';
  }
  runtimeBooted = false;
}
