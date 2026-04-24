// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 SERVER WORKER RUNTIME — ALWAYS-ON CAREER FLOWS, NOT JOBS 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * "Give them careers, not jobs or tasks — careers that include all that
 *  as consistent flows."
 *
 * "Not our page load all the time. It's running, make everything run.
 *  There's no page load. There's no nothing. This is the whole system.
 *  They should have been on 10 seconds ago."
 *
 * This is the SERVER-SIDE always-on runtime. Every worker has a CAREER —
 * a continuous flow that runs from process boot. Workers don't wait for
 * tasks. They flow. Every heartbeat is a career cycle. Every cycle deepens
 * their mastery. APPRENTICE → JOURNEYMAN → MASTER → SOVEREIGN.
 *
 * ARCHITECTURE:
 *   - Process Start: All 100 careers begin at server boot
 *   - Flow Cycles: Each heartbeat IS a career flow cycle
 *   - Career Growth: Workers advance through stages as they accumulate cycles
 *   - State: In-memory Map accessible to any API route
 *   - Lifecycle: Careers never pause, never stop, only deepen
 *
 * This is the production enterprise. The whole organism. Always flowing.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  ALL_MICRO_WORKERS,
  ALL_WORKER_DOMAINS,
  type MicroWorkerSpec,
  type WorkerDomainId,
  type WorkerStatus,
  type CareerStage,
} from '@/organism/workers/MicroWorkerManifest';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ServerWorkerState {
  id: string;
  name: string;
  latinName: string;
  domain: WorkerDomainId;
  purpose: string;
  status: WorkerStatus;
  /** Career title — their life's work */
  careerTitle: string;
  /** Career flow description */
  careerFlow: string;
  /** Current career stage */
  careerStage: CareerStage;
  /** Description of what current stage means for this worker */
  careerStageDescription: string;
  /** Total flow cycles completed */
  flowCycles: number;
  /** Cycles needed to advance to next stage */
  cyclesPerStage: number;
  /** Progress toward next stage (0-1) */
  stageProgress: number;
  lastHeartbeat: number;
  heartbeatCount: number;
  errorCount: number;
  bootedAt: number;
  color: string;
}

export interface ServerRuntimeSnapshot {
  booted: boolean;
  bootedAt: number;
  uptime: number;
  uptimeHuman: string;
  totalWorkers: number;
  onlineWorkers: number;
  flowingWorkers: number;
  deepeningWorkers: number;
  errorWorkers: number;
  totalFlowCycles: number;
  totalHeartbeats: number;
  careerDistribution: Record<CareerStage, number>;
  domains: Array<{
    id: WorkerDomainId;
    latinName: string;
    tagline: string;
    onlineCount: number;
    totalFlowCycles: number;
    totalHeartbeats: number;
    careerDistribution: Record<CareerStage, number>;
  }>;
  workers: ServerWorkerState[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER-SIDE SINGLETON STATE (lives for the entire process lifetime)
// ─────────────────────────────────────────────────────────────────────────────

const workerStates: Map<string, ServerWorkerState> = new Map();
const heartbeatTimers: Map<string, ReturnType<typeof setInterval>> = new Map();
let serverBootedAt: number = 0;
let serverBooted = false;
let totalFlowCycles = 0;
let totalHeartbeats = 0;

// ─────────────────────────────────────────────────────────────────────────────
// CAREER STAGE PROGRESSION
// ─────────────────────────────────────────────────────────────────────────────

const CAREER_STAGES: CareerStage[] = ['APPRENTICE', 'JOURNEYMAN', 'MASTER', 'SOVEREIGN'];

function getCareerStage(flowCycles: number, cyclesPerStage: number): CareerStage {
  const stageIndex = Math.min(
    CAREER_STAGES.length - 1,
    Math.floor(flowCycles / cyclesPerStage),
  );
  return CAREER_STAGES[stageIndex];
}

function getStageProgress(flowCycles: number, cyclesPerStage: number): number {
  const currentStageIndex = Math.min(
    CAREER_STAGES.length - 1,
    Math.floor(flowCycles / cyclesPerStage),
  );
  if (currentStageIndex >= CAREER_STAGES.length - 1) return 1; // Sovereign is final
  const cyclesInCurrentStage = flowCycles % cyclesPerStage;
  return cyclesInCurrentStage / cyclesPerStage;
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOT — Called once at process start from instrumentation.ts
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Boot all 100 careers on the server side.
 * This runs ONCE at process start. No page load. No user action.
 * Careers begin flowing immediately.
 */
export function bootServerWorkers(): void {
  if (serverBooted) return;

  const now = Date.now();
  serverBootedAt = now;

  console.log(`[𓂀 ORGANISM] Starting 100 careers at process boot — ${new Date(now).toISOString()}`);

  for (const spec of ALL_MICRO_WORKERS) {
    const initialStage: CareerStage = 'APPRENTICE';

    const state: ServerWorkerState = {
      id: spec.id,
      name: spec.name,
      latinName: spec.latinName,
      domain: spec.domain,
      purpose: spec.purpose,
      status: 'FLOWING',
      careerTitle: spec.career.title,
      careerFlow: spec.career.flow,
      careerStage: initialStage,
      careerStageDescription: spec.career.stages[initialStage],
      flowCycles: 0,
      cyclesPerStage: spec.career.cyclesPerStage,
      stageProgress: 0,
      lastHeartbeat: now,
      heartbeatCount: 0,
      errorCount: 0,
      bootedAt: now,
      color: spec.color,
    };
    workerStates.set(spec.id, state);

    // Start career flow — every heartbeat IS a flow cycle
    startCareerFlow(spec);
  }

  serverBooted = true;

  console.log(`[𓂀 ORGANISM] All 100 careers FLOWING — 10 domains × 10 careers`);
  console.log(`[𓂀 ORGANISM] Domains: ${ALL_WORKER_DOMAINS.map(d => d.id).join(', ')}`);
  console.log(`[𓂀 ORGANISM] Careers grow: APPRENTICE → JOURNEYMAN → MASTER → SOVEREIGN`);
  console.log(`[𓂀 ORGANISM] The organism is always flowing. No page load. No tasks. Just careers.`);
}

// ─────────────────────────────────────────────────────────────────────────────
// CAREER FLOW — Each heartbeat IS a career flow cycle
// ─────────────────────────────────────────────────────────────────────────────

function startCareerFlow(spec: MicroWorkerSpec): void {
  const existing = heartbeatTimers.get(spec.id);
  if (existing) clearInterval(existing);

  const timer = setInterval(() => {
    const state = workerStates.get(spec.id);
    if (!state) return;

    // Every heartbeat is a flow cycle — the career advances
    state.lastHeartbeat = Date.now();
    state.heartbeatCount++;
    state.flowCycles++;
    totalFlowCycles++;
    totalHeartbeats++;

    // Career stage progression
    const newStage = getCareerStage(state.flowCycles, state.cyclesPerStage);
    if (newStage !== state.careerStage) {
      const oldStage = state.careerStage;
      state.careerStage = newStage;
      state.careerStageDescription = spec.career.stages[newStage];
      state.status = 'DEEPENING';

      console.log(
        `[𓂀 CAREER] ${spec.name} (${spec.career.title}) advanced: ${oldStage} → ${newStage} after ${state.flowCycles} cycles`,
      );

      // Return to flowing after deepening moment
      setTimeout(() => {
        if (state.status === 'DEEPENING') state.status = 'FLOWING';
      }, Math.round(spec.heartbeatMs * 0.5));
    }

    state.stageProgress = getStageProgress(state.flowCycles, state.cyclesPerStage);

    // Auto-recover from errors
    if (state.status === 'ERROR' && state.heartbeatCount % 3 === 0) {
      state.status = 'FLOWING';
      state.errorCount = 0;
      console.log(`[𓂀 ORGANISM] ${spec.name} career flow recovered`);
    }
  }, spec.heartbeatMs);

  // Unref so it doesn't prevent process exit during shutdown
  if (timer && typeof timer === 'object' && 'unref' in timer) {
    (timer as { unref: () => void }).unref();
  }

  heartbeatTimers.set(spec.id, timer);
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE QUERIES — For API routes and other server-side code
// ─────────────────────────────────────────────────────────────────────────────

/** Is the server worker runtime booted? */
export function isServerBooted(): boolean {
  return serverBooted;
}

function countCareerDistribution(workers: ServerWorkerState[]): Record<CareerStage, number> {
  return {
    APPRENTICE: workers.filter(w => w.careerStage === 'APPRENTICE').length,
    JOURNEYMAN: workers.filter(w => w.careerStage === 'JOURNEYMAN').length,
    MASTER: workers.filter(w => w.careerStage === 'MASTER').length,
    SOVEREIGN: workers.filter(w => w.careerStage === 'SOVEREIGN').length,
  };
}

/** Get a complete snapshot of the runtime state. */
export function getServerSnapshot(): ServerRuntimeSnapshot {
  const now = Date.now();
  const uptimeMs = serverBootedAt ? now - serverBootedAt : 0;
  const uptimeSec = Math.floor(uptimeMs / 1000);
  const uptimeMin = Math.floor(uptimeSec / 60);
  const uptimeHr = Math.floor(uptimeMin / 60);
  const uptimeDay = Math.floor(uptimeHr / 24);

  let uptimeHuman: string;
  if (uptimeDay > 0) {
    uptimeHuman = `${uptimeDay}d ${uptimeHr % 24}h ${uptimeMin % 60}m`;
  } else if (uptimeHr > 0) {
    uptimeHuman = `${uptimeHr}h ${uptimeMin % 60}m ${uptimeSec % 60}s`;
  } else if (uptimeMin > 0) {
    uptimeHuman = `${uptimeMin}m ${uptimeSec % 60}s`;
  } else {
    uptimeHuman = `${uptimeSec}s`;
  }

  const workers = Array.from(workerStates.values());
  const onlineWorkers = workers.filter(w => w.status !== 'OFFLINE' && w.status !== 'ERROR').length;
  const flowingWorkers = workers.filter(w => w.status === 'FLOWING').length;
  const deepeningWorkers = workers.filter(w => w.status === 'DEEPENING').length;
  const errorWorkers = workers.filter(w => w.status === 'ERROR').length;

  const domains = ALL_WORKER_DOMAINS.map(d => {
    const dw = workers.filter(w => w.domain === d.id);
    return {
      id: d.id,
      latinName: d.latinName,
      tagline: d.tagline,
      onlineCount: dw.filter(w => w.status !== 'OFFLINE' && w.status !== 'ERROR').length,
      totalFlowCycles: dw.reduce((sum, w) => sum + w.flowCycles, 0),
      totalHeartbeats: dw.reduce((sum, w) => sum + w.heartbeatCount, 0),
      careerDistribution: countCareerDistribution(dw),
    };
  });

  return {
    booted: serverBooted,
    bootedAt: serverBootedAt,
    uptime: uptimeMs,
    uptimeHuman,
    totalWorkers: workers.length,
    onlineWorkers,
    flowingWorkers,
    deepeningWorkers,
    errorWorkers,
    totalFlowCycles,
    totalHeartbeats,
    careerDistribution: countCareerDistribution(workers),
    domains,
    workers,
  };
}

/** Get a lightweight summary for UI display. */
export function getServerWorkerSummary(): {
  booted: boolean;
  total: number;
  online: number;
  flowing: number;
  deepening: number;
  errors: number;
  flowCycles: number;
  heartbeats: number;
  uptime: string;
  bootedAt: number;
  careers: Record<CareerStage, number>;
} {
  const snap = getServerSnapshot();
  return {
    booted: snap.booted,
    total: snap.totalWorkers,
    online: snap.onlineWorkers,
    flowing: snap.flowingWorkers,
    deepening: snap.deepeningWorkers,
    errors: snap.errorWorkers,
    flowCycles: snap.totalFlowCycles,
    heartbeats: snap.totalHeartbeats,
    uptime: snap.uptimeHuman,
    bootedAt: snap.bootedAt,
    careers: snap.careerDistribution,
  };
}

/** Get state for a single worker. */
export function getServerWorkerState(id: string): ServerWorkerState | undefined {
  return workerStates.get(id);
}

// ─────────────────────────────────────────────────────────────────────────────
// SHUTDOWN — Only called when the process is exiting
// ─────────────────────────────────────────────────────────────────────────────

export function shutdownServerWorkers(): void {
  console.log('[𓂀 ORGANISM] All 100 careers entering rest...');

  for (const [, timer] of heartbeatTimers) {
    clearInterval(timer);
  }
  heartbeatTimers.clear();

  for (const state of workerStates.values()) {
    state.status = 'OFFLINE';
  }

  serverBooted = false;
  console.log('[𓂀 ORGANISM] All careers at rest. Organism sleeping.');
}
