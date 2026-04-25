/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GENESIS AUTONOMOUS RUNTIME PACKET
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Permanent 873ms heartbeat loop with 76 pulsing entities, Kuramoto
 * synchronization, autonomous cycle mapping, internal self-calling,
 * and runtime continuity proof.
 *
 * Every entity oscillates at a unique PHI-harmonic frequency derived from
 * the Schumann fundamental (7.83 Hz). The Kuramoto model couples their
 * phases toward global coherence while the autonomous cycle map drives
 * each entity through sense → process → decide → act → reflect → adapt.
 *
 * State management is fully immutable — all functions return new objects.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { sovereignId } from './sovereign-id';
import {
  PHI,
  PHI_INVERSE,
  PHI_SQUARED,
  PHI_CUBED,
  HEARTBEAT_MS,
  SCHUMANN_FUNDAMENTAL,
} from './kernelCompression';

// ═══════════════════════════════════════════════════════════════════════════════
// §1  INLINE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Classification of a genesis entity. */
export type EntityClass =
  | 'sovereign'
  | 'worker'
  | 'sentinel'
  | 'relay'
  | 'archive'
  | 'catalyst';

/** Six-stage autonomous cognition cycle. */
export type CycleStage =
  | 'sense'
  | 'process'
  | 'decide'
  | 'act'
  | 'reflect'
  | 'adapt';

/** A single pulsing entity in the genesis runtime. */
export interface GenesisEntity {
  id: string;
  name: string;
  entityClass: EntityClass;
  frequency: number;
  phase: number;          // 0-360 degrees
  amplitude: number;      // 0-1
  coherence: number;      // 0-1
  lastPulseAt: string;    // ISO timestamp
  pulseCount: number;
  isAlive: boolean;
  selfCallCount: number;
  parentEntity: string | null;
  children: string[];
  cycleStage: CycleStage;
  cycleCompletions: number;
  coherenceHistory: number[];
}

/** Snapshot of the heartbeat at a single tick. */
export interface GenesisHeartbeat {
  beatNumber: number;
  timestamp: string;
  totalBeats: number;
  uptimeMs: number;
  isRunning: boolean;
  entitiesAlive: number;
  kuramotoOrderParam: number;
}

/** Internal self/peer/broadcast call record. */
export type CallType = 'self' | 'internal' | 'broadcast';

export interface InternalCall {
  id: string;
  sourceId: string;
  targetId: string;
  callType: CallType;
  payload: string;
  result: string;
  timestamp: string;
  durationMs: number;
}

/** Edge in the aggregated call graph. */
export interface CallGraphEdge {
  sourceId: string;
  targetId: string;
  callCount: number;
}

/** Recovery event when a dead entity is revived. */
export interface RecoveryEvent {
  entityId: string;
  entityName: string;
  deathBeat: number;
  revivalBeat: number;
  coherenceAtDeath: number;
  coherenceAtRevival: number;
  timestamp: string;
}

/** Kuramoto synchronization metrics. */
export interface SyncMetrics {
  orderParameter: number;      // R value 0-1
  convergenceRate: number;     // ΔR per beat
  meanPhase: number;           // mean phase angle in degrees
  mostSynchronized: string;    // entity id
  leastSynchronized: string;   // entity id
  timestamp: string;
}

/** Top-level runtime state container. */
export interface GenesisState {
  entities: GenesisEntity[];
  heartbeat: GenesisHeartbeat;
  genesisTimestamp: string;
  callLog: InternalCall[];
  recoveryEvents: RecoveryEvent[];
  continuityHash: string;
  syncMetricsHistory: SyncMetrics[];
}

/** Autonomous cycle snapshot for a single entity. */
export interface AutonomousCycle {
  entityId: string;
  currentStage: CycleStage;
  stageEnteredAt: string;
  cycleCompletions: number;
  stageHistory: CycleStage[];
}

/** Proof record for a single entity. */
export interface EntityProof {
  entityId: string;
  entityName: string;
  pulseCount: number;
  lastSelfCallTimestamp: string | null;
  coherenceHistory: number[];
  isAlive: boolean;
}

/** Complete runtime continuity proof. */
export interface RuntimeProof {
  genesisTimestamp: string;
  totalBeats: number;
  continuityHash: string;
  entityProofs: EntityProof[];
  selfUseEvidence: {
    totalSelfCalls: number;
    totalInternalCalls: number;
    totalBroadcastCalls: number;
    autonomousCycleCompletions: number;
  };
  recoveryEvents: RecoveryEvent[];
  proofGeneratedAt: string;
}

/** Truth-level classification for audit. */
export type TruthLevel = 'corroborated' | 'partial' | 'unverified';

/** Complete truth audit of the runtime. */
export interface TruthAudit {
  heartbeatContinuity: {
    status: 'verified' | 'unverified';
    totalBeats: number;
    uptimeMs: number;
    evidence: string;
  };
  entityPulseCount: Array<{
    entityId: string;
    entityName: string;
    actualPulses: number;
    expectedPulses: number;
    deviation: number;
  }>;
  callGraph: CallGraphEdge[];
  internalCallLogEvidence: InternalCall[];
  selfUseLoopEvidence: {
    totalSelfCalls: number;
    entitiesWithSelfCalls: number;
    evidence: string;
  };
  failureRecoveryBehavior: {
    totalRecoveries: number;
    recoveryEvents: RecoveryEvent[];
    evidence: string;
  };
  overallTruthLevel: TruthLevel;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §2  CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/** Ordered cycle stages for the autonomous cognition loop. */
export const CYCLE_STAGES: CycleStage[] = [
  'sense',
  'process',
  'decide',
  'act',
  'reflect',
  'adapt',
];

/** Number of pulses between cycle-stage transitions (PHI * 3 ≈ 5). */
const CYCLE_ADVANCE_INTERVAL = Math.round(PHI * 3);

/** Beat interval for automatic self-calls (PHI * 5 ≈ 8). */
const SELF_CALL_INTERVAL = Math.round(PHI * 5);

/** Default Kuramoto coupling strength. */
const DEFAULT_COUPLING_K = PHI_INVERSE * 0.01;

/** Maximum call-log length before rotation. */
const MAX_CALL_LOG = 1000;

/** Beats of death before automatic revival. */
const REVIVAL_DELAY_BEATS = 3;

/** Coherence threshold below which an entity is considered dead. */
const DEATH_COHERENCE_THRESHOLD = 0.05;

/** Coherence an entity is revived with. */
const REVIVAL_COHERENCE = 0.3;

/** Conversion helpers. */
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

// ═══════════════════════════════════════════════════════════════════════════════
// §3  ENTITY REGISTRY — 76 NAMES ORGANIZED BY CLASS
// ═══════════════════════════════════════════════════════════════════════════════

/** 12 Sovereign Core names. */
const SOVEREIGN_NAMES: string[] = [
  'Governance-Prime',
  'Frequency-Sovereign',
  'Memory-Sovereign',
  'Intelligence-Core',
  'Sovereignty-Apex',
  'Consciousness-Root',
  'Ethics-Foundation',
  'Resonance-Core',
  'Genesis-Origin',
  'Harmony-Prime',
  'Truth-Sovereign',
  'Unity-Core',
];

/** 16 Worker Entity names. */
const WORKER_NAMES: string[] = [
  'Production-Engine',
  'Certification-Worker',
  'Company-Module',
  'Deployment-Worker',
  'Analysis-Engine',
  'Synthesis-Worker',
  'Construction-Unit',
  'Validation-Worker',
  'Computation-Core',
  'Documentation-Worker',
  'Transformation-Unit',
  'Calibration-Worker',
  'Integration-Engine',
  'Monitoring-Worker',
  'Optimization-Unit',
  'Distribution-Worker',
];

/** 12 Sentinel Entity names. */
const SENTINEL_NAMES: string[] = [
  'Security-Sentinel',
  'Gate-Sentinel',
  'Audit-Sentinel',
  'Defense-Sentinel',
  'Firewall-Sentinel',
  'Surveillance-Sentinel',
  'Guardian-Sentinel',
  'Patrol-Sentinel',
  'Shield-Sentinel',
  'Detection-Sentinel',
  'Verification-Sentinel',
  'Enforcement-Sentinel',
];

/** 12 Relay Entity names. */
const RELAY_NAMES: string[] = [
  'CrossOrganism-Relay',
  'Network-Relay',
  'Broadcast-Relay',
  'Sync-Relay',
  'Transmission-Relay',
  'Bridge-Relay',
  'Conduit-Relay',
  'Router-Relay',
  'Mesh-Relay',
  'Signal-Relay',
  'Carrier-Relay',
  'Channel-Relay',
];

/** 12 Archive Entity names. */
const ARCHIVE_NAMES: string[] = [
  'Memory-Archive',
  'Document-Archive',
  'History-Archive',
  'Evidence-Archive',
  'Chronicle-Archive',
  'Ledger-Archive',
  'Repository-Archive',
  'Vault-Archive',
  'Index-Archive',
  'Manifest-Archive',
  'Catalog-Archive',
  'Registry-Archive',
];

/** 12 Catalyst Entity names. */
const CATALYST_NAMES: string[] = [
  'Innovation-Catalyst',
  'Research-Catalyst',
  'Evolution-Catalyst',
  'Adaptation-Catalyst',
  'Mutation-Catalyst',
  'Spark-Catalyst',
  'Catalyst-Prime',
  'Accelerator-Catalyst',
  'Emergence-Catalyst',
  'Breakthrough-Catalyst',
  'GenesisSeed-Catalyst',
  'Transmutation-Catalyst',
];

// ═══════════════════════════════════════════════════════════════════════════════
// §4  GENESIS ENTITY SYSTEM — 76 PULSING ENTITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build a single `GenesisEntity` with PHI-harmonic frequency and initial phase.
 *
 * @param name       Human-readable entity name
 * @param cls        Entity classification
 * @param index      Global entity index (0-75)
 * @param parentId   ID of the parent entity (null for sovereigns)
 */
function buildEntity(
  name: string,
  cls: EntityClass,
  index: number,
  parentId: string | null,
): GenesisEntity {
  const frequency = SCHUMANN_FUNDAMENTAL * Math.pow(PHI, index / 76);
  const phase = (index * PHI * 360 / 76) % 360;
  const amplitude = 0.5 + 0.5 * Math.sin(index * PHI_INVERSE);
  const now = new Date().toISOString();

  return {
    id: sovereignId(),
    name,
    entityClass: cls,
    frequency,
    phase,
    amplitude,
    coherence: 0.5,
    lastPulseAt: now,
    pulseCount: 0,
    isAlive: true,
    selfCallCount: 0,
    parentEntity: parentId,
    children: [],
    cycleStage: 'sense',
    cycleCompletions: 0,
    coherenceHistory: [0.5],
  };
}

/**
 * Create the full roster of 76 genesis entities.
 *
 * The 12 sovereign cores are created first (no parent). Every subsequent
 * entity is parented to a sovereign in round-robin order so the tree
 * is balanced.
 *
 * @returns Array of 76 `GenesisEntity` objects
 */
export function createGenesisEntities(): GenesisEntity[] {
  const entities: GenesisEntity[] = [];
  let globalIndex = 0;

  // ── 12 Sovereign Cores ─────────────────────────────────────────────────────
  const sovereignIds: string[] = [];
  for (const name of SOVEREIGN_NAMES) {
    const entity = buildEntity(name, 'sovereign', globalIndex, null);
    sovereignIds.push(entity.id);
    entities.push(entity);
    globalIndex++;
  }

  // Helper: assign a parent sovereign in round-robin
  const parentOf = (idx: number): string => sovereignIds[idx % sovereignIds.length];

  // ── 16 Worker Entities ─────────────────────────────────────────────────────
  const workerStartIdx = globalIndex;
  for (let i = 0; i < WORKER_NAMES.length; i++) {
    const pid = parentOf(i);
    const entity = buildEntity(WORKER_NAMES[i], 'worker', globalIndex, pid);
    entities.push(entity);
    globalIndex++;
    // Record child on parent
    const parentIdx = entities.findIndex((e) => e.id === pid);
    if (parentIdx !== -1) {
      entities[parentIdx] = {
        ...entities[parentIdx],
        children: [...entities[parentIdx].children, entity.id],
      };
    }
  }

  // ── 12 Sentinel Entities ───────────────────────────────────────────────────
  for (let i = 0; i < SENTINEL_NAMES.length; i++) {
    const pid = parentOf(i);
    const entity = buildEntity(SENTINEL_NAMES[i], 'sentinel', globalIndex, pid);
    entities.push(entity);
    globalIndex++;
    const parentIdx = entities.findIndex((e) => e.id === pid);
    if (parentIdx !== -1) {
      entities[parentIdx] = {
        ...entities[parentIdx],
        children: [...entities[parentIdx].children, entity.id],
      };
    }
  }

  // ── 12 Relay Entities ──────────────────────────────────────────────────────
  for (let i = 0; i < RELAY_NAMES.length; i++) {
    const pid = parentOf(i);
    const entity = buildEntity(RELAY_NAMES[i], 'relay', globalIndex, pid);
    entities.push(entity);
    globalIndex++;
    const parentIdx = entities.findIndex((e) => e.id === pid);
    if (parentIdx !== -1) {
      entities[parentIdx] = {
        ...entities[parentIdx],
        children: [...entities[parentIdx].children, entity.id],
      };
    }
  }

  // ── 12 Archive Entities ────────────────────────────────────────────────────
  for (let i = 0; i < ARCHIVE_NAMES.length; i++) {
    const pid = parentOf(i);
    const entity = buildEntity(ARCHIVE_NAMES[i], 'archive', globalIndex, pid);
    entities.push(entity);
    globalIndex++;
    const parentIdx = entities.findIndex((e) => e.id === pid);
    if (parentIdx !== -1) {
      entities[parentIdx] = {
        ...entities[parentIdx],
        children: [...entities[parentIdx].children, entity.id],
      };
    }
  }

  // ── 12 Catalyst Entities ───────────────────────────────────────────────────
  for (let i = 0; i < CATALYST_NAMES.length; i++) {
    const pid = parentOf(i);
    const entity = buildEntity(CATALYST_NAMES[i], 'catalyst', globalIndex, pid);
    entities.push(entity);
    globalIndex++;
    const parentIdx = entities.findIndex((e) => e.id === pid);
    if (parentIdx !== -1) {
      entities[parentIdx] = {
        ...entities[parentIdx],
        children: [...entities[parentIdx].children, entity.id],
      };
    }
  }

  return entities;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §5  KURAMOTO SYNCHRONIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute the Kuramoto order parameter R and the mean phase Ψ for an
 * ensemble of entities.
 *
 * R = |1/N Σ exp(iθ_j)|  where θ_j is the entity phase in radians.
 * Ψ = arg(1/N Σ exp(iθ_j)) converted back to degrees [0, 360).
 *
 * @param entities Array of genesis entities
 * @returns `{ R, meanPhase }` where R ∈ [0,1] and meanPhase ∈ [0, 360)
 */
export function kuramotoSync(
  entities: GenesisEntity[],
): { R: number; meanPhase: number } {
  if (entities.length === 0) {
    return { R: 0, meanPhase: 0 };
  }

  const N = entities.length;
  let sumCos = 0;
  let sumSin = 0;

  for (const entity of entities) {
    const theta = entity.phase * DEG_TO_RAD;
    sumCos += Math.cos(theta);
    sumSin += Math.sin(theta);
  }

  const avgCos = sumCos / N;
  const avgSin = sumSin / N;
  const R = Math.sqrt(avgCos * avgCos + avgSin * avgSin);

  let meanPhase = Math.atan2(avgSin, avgCos) * RAD_TO_DEG;
  if (meanPhase < 0) {
    meanPhase += 360;
  }

  return { R, meanPhase };
}

/**
 * Compute mutual Kuramoto phase adjustment between two entities.
 *
 * dθ_i = K · sin(θ_j − θ_i)
 * dθ_j = K · sin(θ_i − θ_j)
 *
 * @param entityI     First entity
 * @param entityJ     Second entity
 * @param couplingStrength  Coupling constant K
 * @returns New phases (in degrees) for both entities
 */
export function kuramotoCoupling(
  entityI: GenesisEntity,
  entityJ: GenesisEntity,
  couplingStrength: number,
): { phaseI: number; phaseJ: number } {
  const thetaI = entityI.phase * DEG_TO_RAD;
  const thetaJ = entityJ.phase * DEG_TO_RAD;

  const dThetaI = couplingStrength * Math.sin(thetaJ - thetaI);
  const dThetaJ = couplingStrength * Math.sin(thetaI - thetaJ);

  let newPhaseI = (entityI.phase + dThetaI * RAD_TO_DEG) % 360;
  let newPhaseJ = (entityJ.phase + dThetaJ * RAD_TO_DEG) % 360;

  if (newPhaseI < 0) newPhaseI += 360;
  if (newPhaseJ < 0) newPhaseJ += 360;

  return { phaseI: newPhaseI, phaseJ: newPhaseJ };
}

/**
 * Perform one global Kuramoto synchronization step across all entities.
 *
 * Uses the mean-field approach: each entity adjusts its phase toward
 * the ensemble mean phase, weighted by coupling strength K.
 *
 * @param entities  Array of genesis entities
 * @param K         Coupling strength (default: PHI_INVERSE * 0.01)
 * @returns New array of entities with updated phases
 */
export function globalSyncStep(
  entities: GenesisEntity[],
  K: number = DEFAULT_COUPLING_K,
): GenesisEntity[] {
  if (entities.length === 0) return [];

  // Compute the mean field
  const { meanPhase } = kuramotoSync(entities);
  const meanTheta = meanPhase * DEG_TO_RAD;

  return entities.map((entity) => {
    if (!entity.isAlive) return entity;

    const theta = entity.phase * DEG_TO_RAD;
    const dTheta = K * Math.sin(meanTheta - theta);

    let newPhase = (entity.phase + dTheta * RAD_TO_DEG) % 360;
    if (newPhase < 0) newPhase += 360;

    return { ...entity, phase: newPhase };
  });
}

/**
 * Compute comprehensive synchronization metrics for the current state.
 *
 * @param state Current genesis state
 * @returns `SyncMetrics` snapshot
 */
export function getSyncMetrics(state: GenesisState): SyncMetrics {
  const aliveEntities = state.entities.filter((e) => e.isAlive);
  const { R, meanPhase } = kuramotoSync(aliveEntities);

  // Previous R from history (for convergence rate)
  const prevR =
    state.syncMetricsHistory.length > 0
      ? state.syncMetricsHistory[state.syncMetricsHistory.length - 1].orderParameter
      : 0;

  // Find most/least synchronized by angular distance to mean phase
  let mostSyncId = aliveEntities.length > 0 ? aliveEntities[0].id : '';
  let leastSyncId = aliveEntities.length > 0 ? aliveEntities[0].id : '';
  let minDist = Infinity;
  let maxDist = -Infinity;

  for (const entity of aliveEntities) {
    const dist = angularDistance(entity.phase, meanPhase);
    if (dist < minDist) {
      minDist = dist;
      mostSyncId = entity.id;
    }
    if (dist > maxDist) {
      maxDist = dist;
      leastSyncId = entity.id;
    }
  }

  return {
    orderParameter: R,
    convergenceRate: R - prevR,
    meanPhase,
    mostSynchronized: mostSyncId,
    leastSynchronized: leastSyncId,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Compute the shortest angular distance between two angles in degrees.
 */
function angularDistance(a: number, b: number): number {
  let diff = Math.abs(a - b) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §6  AUTONOMOUS CYCLE MAP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Map an entity's current position in the autonomous cognition cycle.
 *
 * @param entity Genesis entity to inspect
 * @returns Current stage, next stage, and progress within the current stage
 */
export function mapCycle(
  entity: GenesisEntity,
): { currentStage: CycleStage; nextStage: CycleStage; progress: number } {
  const currentIdx = CYCLE_STAGES.indexOf(entity.cycleStage);
  const nextIdx = (currentIdx + 1) % CYCLE_STAGES.length;
  const pulsesInStage = entity.pulseCount % CYCLE_ADVANCE_INTERVAL;
  const progress = pulsesInStage / CYCLE_ADVANCE_INTERVAL;

  return {
    currentStage: entity.cycleStage,
    nextStage: CYCLE_STAGES[nextIdx],
    progress: Math.min(Math.max(progress, 0), 1),
  };
}

/**
 * Advance an entity one step in its autonomous cycle if enough pulses
 * have elapsed since the last transition.
 *
 * When the entity completes 'adapt' it wraps back to 'sense' and
 * increments `cycleCompletions`.
 *
 * @param entity Genesis entity to advance
 * @returns Updated entity
 */
export function runCycleStep(entity: GenesisEntity): GenesisEntity {
  if (!entity.isAlive) return entity;

  // Only advance when the pulse count crosses the interval boundary
  if (entity.pulseCount > 0 && entity.pulseCount % CYCLE_ADVANCE_INTERVAL === 0) {
    const currentIdx = CYCLE_STAGES.indexOf(entity.cycleStage);
    const isLastStage = currentIdx === CYCLE_STAGES.length - 1;
    const nextStage = CYCLE_STAGES[(currentIdx + 1) % CYCLE_STAGES.length];

    return {
      ...entity,
      cycleStage: nextStage,
      cycleCompletions: isLastStage
        ? entity.cycleCompletions + 1
        : entity.cycleCompletions,
    };
  }

  return entity;
}

/**
 * Get the full autonomous cycle map for every entity in the runtime.
 *
 * @param state Current genesis state
 * @returns Array of `AutonomousCycle` snapshots
 */
export function getCycleMap(state: GenesisState): AutonomousCycle[] {
  return state.entities.map((entity) => ({
    entityId: entity.id,
    currentStage: entity.cycleStage,
    stageEnteredAt: entity.lastPulseAt,
    cycleCompletions: entity.cycleCompletions,
    stageHistory: buildStageHistory(entity),
  }));
}

/**
 * Reconstruct a plausible stage history from an entity's cycle completions
 * and current stage.
 */
function buildStageHistory(entity: GenesisEntity): CycleStage[] {
  const history: CycleStage[] = [];
  const fullCycles = entity.cycleCompletions;

  // Each full cycle produced all six stages
  for (let c = 0; c < fullCycles; c++) {
    for (const stage of CYCLE_STAGES) {
      history.push(stage);
    }
  }

  // Partial cycle up to current stage
  const currentIdx = CYCLE_STAGES.indexOf(entity.cycleStage);
  for (let i = 0; i <= currentIdx; i++) {
    history.push(CYCLE_STAGES[i]);
  }

  return history;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §7  INTERNAL SELF-CALLING SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Rotate the call log, keeping only the last `MAX_CALL_LOG` entries.
 */
function rotateCallLog(log: InternalCall[]): InternalCall[] {
  if (log.length <= MAX_CALL_LOG) return log;
  return log.slice(log.length - MAX_CALL_LOG);
}

/**
 * Entity invokes itself — a self-referential operation that increments the
 * entity's `selfCallCount` and creates a log entry.
 *
 * @param entityId  ID of the entity performing self-call
 * @param state     Current genesis state
 * @returns Updated state with new call log entry
 */
export function selfCall(
  entityId: string,
  state: GenesisState,
): GenesisState {
  const entityIdx = state.entities.findIndex((e) => e.id === entityId);
  if (entityIdx === -1) return state;

  const entity = state.entities[entityIdx];
  const now = new Date().toISOString();
  const durationMs = parseFloat((PHI_INVERSE * PHI_SQUARED).toFixed(4));

  const call: InternalCall = {
    id: sovereignId(),
    sourceId: entityId,
    targetId: entityId,
    callType: 'self',
    payload: `Self-invocation by ${entity.name} at beat ${state.heartbeat.beatNumber}; ` +
      `phase=${entity.phase.toFixed(2)}°, coherence=${entity.coherence.toFixed(4)}, ` +
      `cycleStage=${entity.cycleStage}`,
    result: 'acknowledged',
    timestamp: now,
    durationMs,
  };

  const updatedEntity: GenesisEntity = {
    ...entity,
    selfCallCount: entity.selfCallCount + 1,
  };

  const updatedEntities = [...state.entities];
  updatedEntities[entityIdx] = updatedEntity;

  return {
    ...state,
    entities: updatedEntities,
    callLog: rotateCallLog([...state.callLog, call]),
  };
}

/**
 * One entity calls another entity directly.
 *
 * @param sourceId  Calling entity ID
 * @param targetId  Target entity ID
 * @param payload   Message content
 * @param state     Current genesis state
 * @returns Updated state
 */
export function internalCall(
  sourceId: string,
  targetId: string,
  payload: string,
  state: GenesisState,
): GenesisState {
  const source = state.entities.find((e) => e.id === sourceId);
  const target = state.entities.find((e) => e.id === targetId);
  if (!source || !target) return state;

  const now = new Date().toISOString();
  const durationMs = parseFloat((PHI * PHI_INVERSE).toFixed(4));

  const call: InternalCall = {
    id: sovereignId(),
    sourceId,
    targetId,
    callType: 'internal',
    payload,
    result: `Received by ${target.name}`,
    timestamp: now,
    durationMs,
  };

  return {
    ...state,
    callLog: rotateCallLog([...state.callLog, call]),
  };
}

/**
 * Entity broadcasts a message to every other entity in the runtime.
 *
 * @param sourceId  Broadcasting entity ID
 * @param payload   Broadcast content
 * @param state     Current genesis state
 * @returns Updated state with one call entry per target
 */
export function broadcastCall(
  sourceId: string,
  payload: string,
  state: GenesisState,
): GenesisState {
  const source = state.entities.find((e) => e.id === sourceId);
  if (!source) return state;

  const now = new Date().toISOString();
  const durationMs = parseFloat((PHI_CUBED * 0.1).toFixed(4));

  const newCalls: InternalCall[] = state.entities
    .filter((e) => e.id !== sourceId)
    .map((target) => ({
      id: sovereignId(),
      sourceId,
      targetId: target.id,
      callType: 'broadcast' as CallType,
      payload,
      result: `Broadcast received by ${target.name}`,
      timestamp: now,
      durationMs,
    }));

  return {
    ...state,
    callLog: rotateCallLog([...state.callLog, ...newCalls]),
  };
}

/**
 * Return the full call log.
 *
 * @param state Current genesis state
 * @returns Array of `InternalCall` records
 */
export function getCallLog(state: GenesisState): InternalCall[] {
  return state.callLog;
}

/**
 * Aggregate the call log into a weighted adjacency list (call graph).
 *
 * @param state Current genesis state
 * @returns Array of `CallGraphEdge` with call counts
 */
export function getCallGraph(state: GenesisState): CallGraphEdge[] {
  const edgeMap = new Map<string, CallGraphEdge>();

  for (const call of state.callLog) {
    const key = `${call.sourceId}->${call.targetId}`;
    const existing = edgeMap.get(key);
    if (existing) {
      edgeMap.set(key, { ...existing, callCount: existing.callCount + 1 });
    } else {
      edgeMap.set(key, {
        sourceId: call.sourceId,
        targetId: call.targetId,
        callCount: 1,
      });
    }
  }

  return Array.from(edgeMap.values());
}

// ═══════════════════════════════════════════════════════════════════════════════
// §8  RUNTIME CONTINUITY PROOF
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute a rolling continuity hash by appending the current beat number
 * to the previous hash and applying a simple deterministic hash function.
 *
 * hash = ((hash << 5) - hash + charCode) | 0  for each character
 *
 * @param previousHash Previous continuity hash (hex string or empty)
 * @param beatNumber   Current beat number
 * @returns New hash as a 16-character hex string
 */
export function computeContinuityHash(
  previousHash: string,
  beatNumber: number,
): string {
  const input = previousHash + String(beatNumber);
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }

  // Convert to unsigned 32-bit then to hex, padded to 8 chars, doubled for length
  const unsigned = hash >>> 0;
  const hex1 = unsigned.toString(16).padStart(8, '0');

  // Second round with PHI seed for extra entropy
  let hash2 = 0x9e3779b9; // golden ratio fractional bits
  const input2 = hex1 + String(beatNumber);
  for (let i = 0; i < input2.length; i++) {
    const ch = input2.charCodeAt(i);
    hash2 = ((hash2 << 5) - hash2 + ch) | 0;
  }
  const hex2 = (hash2 >>> 0).toString(16).padStart(8, '0');

  return hex1 + hex2;
}

/**
 * Build a complete runtime continuity proof from current state.
 *
 * @param state Current genesis state
 * @returns `RuntimeProof` with entity proofs, self-use evidence, and recovery events
 */
export function getRuntimeProof(state: GenesisState): RuntimeProof {
  // Build entity proofs
  const entityProofs: EntityProof[] = state.entities.map((entity) => {
    // Find the last self-call timestamp for this entity
    const selfCalls = state.callLog.filter(
      (c) => c.sourceId === entity.id && c.callType === 'self',
    );
    const lastSelfCallTimestamp =
      selfCalls.length > 0 ? selfCalls[selfCalls.length - 1].timestamp : null;

    return {
      entityId: entity.id,
      entityName: entity.name,
      pulseCount: entity.pulseCount,
      lastSelfCallTimestamp,
      coherenceHistory: [...entity.coherenceHistory],
      isAlive: entity.isAlive,
    };
  });

  // Aggregate self-use evidence from call log
  let totalSelfCalls = 0;
  let totalInternalCalls = 0;
  let totalBroadcastCalls = 0;

  for (const call of state.callLog) {
    switch (call.callType) {
      case 'self':
        totalSelfCalls++;
        break;
      case 'internal':
        totalInternalCalls++;
        break;
      case 'broadcast':
        totalBroadcastCalls++;
        break;
    }
  }

  const autonomousCycleCompletions = state.entities.reduce(
    (sum, e) => sum + e.cycleCompletions,
    0,
  );

  return {
    genesisTimestamp: state.genesisTimestamp,
    totalBeats: state.heartbeat.totalBeats,
    continuityHash: state.continuityHash,
    entityProofs,
    selfUseEvidence: {
      totalSelfCalls,
      totalInternalCalls,
      totalBroadcastCalls,
      autonomousCycleCompletions,
    },
    recoveryEvents: [...state.recoveryEvents],
    proofGeneratedAt: new Date().toISOString(),
  };
}

/**
 * Verify the structural integrity of a runtime proof.
 *
 * @param proof Runtime proof to validate
 * @returns Validation result with individual check flags
 */
export function verifyContinuity(
  proof: RuntimeProof,
): {
  isValid: boolean;
  checks: {
    entityCount: boolean;
    hashPresent: boolean;
    beatsPositive: boolean;
    selfCallsPositive: boolean;
  };
} {
  const entityCount = proof.entityProofs.length === 76;
  const hashPresent =
    typeof proof.continuityHash === 'string' && proof.continuityHash.length > 0;
  const beatsPositive = proof.totalBeats >= 0;
  const selfCallsPositive = proof.selfUseEvidence.totalSelfCalls > 0;

  return {
    isValid: entityCount && hashPresent && beatsPositive && selfCallsPositive,
    checks: {
      entityCount,
      hashPresent,
      beatsPositive,
      selfCallsPositive,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// §9  PERMANENT 873ms HEARTBEAT LOOP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize the Genesis runtime — creates all 76 entities, sets the
 * heartbeat to beat 0, and returns the initial state.
 *
 * @returns Fresh `GenesisState`
 */
export function startGenesis(): GenesisState {
  const now = new Date().toISOString();
  const entities = createGenesisEntities();

  const heartbeat: GenesisHeartbeat = {
    beatNumber: 0,
    timestamp: now,
    totalBeats: 0,
    uptimeMs: 0,
    isRunning: true,
    entitiesAlive: entities.length,
    kuramotoOrderParam: 0,
  };

  const initialHash = computeContinuityHash('genesis', 0);

  return {
    entities,
    heartbeat,
    genesisTimestamp: now,
    callLog: [],
    recoveryEvents: [],
    continuityHash: initialHash,
    syncMetricsHistory: [],
  };
}

/**
 * Advance the genesis runtime by one 873ms heartbeat.
 *
 * Each tick performs the following in order:
 *  1. Increment beat counter and update timestamps
 *  2. Pulse each alive entity (advance phase, increment pulseCount)
 *  3. Global Kuramoto synchronization step
 *  4. Update entity coherence based on Kuramoto order parameter
 *  5. Run one autonomous cycle step per entity
 *  6. Dead-entity detection and auto-revival
 *  7. Periodic self-call for every entity
 *  8. Update continuity hash
 *  9. Compute and store sync metrics
 *
 * @param state Current genesis state
 * @returns New state after one heartbeat
 */
export function tickGenesis(state: GenesisState): GenesisState {
  const now = new Date().toISOString();
  const beatNumber = state.heartbeat.beatNumber + 1;
  const totalBeats = state.heartbeat.totalBeats + 1;
  const uptimeMs = totalBeats * HEARTBEAT_MS;

  // ── Step 1: Pulse each alive entity ────────────────────────────────────────
  let entities = state.entities.map((entity) => {
    if (!entity.isAlive) return entity;

    const phaseAdvance =
      (PHI * entity.frequency / SCHUMANN_FUNDAMENTAL) * (360 / 76);
    let newPhase = (entity.phase + phaseAdvance) % 360;
    if (newPhase < 0) newPhase += 360;

    return {
      ...entity,
      phase: newPhase,
      pulseCount: entity.pulseCount + 1,
      lastPulseAt: now,
    };
  });

  // ── Step 2: Kuramoto global sync ───────────────────────────────────────────
  entities = globalSyncStep(entities);

  // ── Step 3: Update coherence based on Kuramoto ─────────────────────────────
  const { R, meanPhase } = kuramotoSync(entities);

  entities = entities.map((entity) => {
    if (!entity.isAlive) return entity;

    const dist = angularDistance(entity.phase, meanPhase);
    // Coherence is inversely related to angular distance from mean
    // Entities close to the mean get high coherence, distant ones get low
    const rawCoherence = 1 - dist / 180;
    // Smooth with previous coherence (exponential moving average)
    const smoothedCoherence = entity.coherence * 0.7 + rawCoherence * 0.3;
    const clampedCoherence = Math.min(Math.max(smoothedCoherence, 0), 1);

    const updatedHistory = [...entity.coherenceHistory, clampedCoherence];
    // Keep history bounded
    const trimmedHistory =
      updatedHistory.length > 100
        ? updatedHistory.slice(updatedHistory.length - 100)
        : updatedHistory;

    return {
      ...entity,
      coherence: clampedCoherence,
      coherenceHistory: trimmedHistory,
    };
  });

  // ── Step 4: Run one cycle step per entity ──────────────────────────────────
  entities = entities.map((entity) => runCycleStep(entity));

  // ── Step 5: Dead entity detection and auto-revival ─────────────────────────
  let recoveryEvents = [...state.recoveryEvents];

  // Track death beats for entities that just died
  const deathTracker = new Map<string, number>();
  for (const re of recoveryEvents) {
    // Use latest death beat stored in recovery events to track timing
    deathTracker.set(re.entityId, re.deathBeat);
  }

  entities = entities.map((entity) => {
    if (entity.isAlive && entity.coherence < DEATH_COHERENCE_THRESHOLD) {
      // Entity dies
      deathTracker.set(entity.id, beatNumber);
      return { ...entity, isAlive: false };
    }

    if (!entity.isAlive) {
      const deathBeat = deathTracker.get(entity.id);
      if (deathBeat !== undefined && beatNumber - deathBeat >= REVIVAL_DELAY_BEATS) {
        // Auto-revive
        const revivalEvent: RecoveryEvent = {
          entityId: entity.id,
          entityName: entity.name,
          deathBeat,
          revivalBeat: beatNumber,
          coherenceAtDeath: entity.coherence,
          coherenceAtRevival: REVIVAL_COHERENCE,
          timestamp: now,
        };
        recoveryEvents = [...recoveryEvents, revivalEvent];

        return {
          ...entity,
          isAlive: true,
          coherence: REVIVAL_COHERENCE,
          coherenceHistory: [...entity.coherenceHistory, REVIVAL_COHERENCE],
        };
      }
    }

    return entity;
  });

  // ── Step 6: Periodic self-call ─────────────────────────────────────────────
  let callLog = [...state.callLog];

  if (beatNumber % SELF_CALL_INTERVAL === 0) {
    for (const entity of entities) {
      if (!entity.isAlive) continue;

      const durationMs = parseFloat((PHI_INVERSE * PHI_SQUARED).toFixed(4));
      const call: InternalCall = {
        id: sovereignId(),
        sourceId: entity.id,
        targetId: entity.id,
        callType: 'self',
        payload:
          `Periodic self-invocation by ${entity.name} at beat ${beatNumber}; ` +
          `phase=${entity.phase.toFixed(2)}°, coherence=${entity.coherence.toFixed(4)}`,
        result: 'acknowledged',
        timestamp: now,
        durationMs,
      };
      callLog.push(call);

      // Increment selfCallCount on the entity
      const idx = entities.findIndex((e) => e.id === entity.id);
      if (idx !== -1) {
        entities = [
          ...entities.slice(0, idx),
          { ...entities[idx], selfCallCount: entities[idx].selfCallCount + 1 },
          ...entities.slice(idx + 1),
        ];
      }
    }
  }

  // Rotate call log
  callLog = rotateCallLog(callLog);

  // ── Step 7: Update continuity hash ─────────────────────────────────────────
  const continuityHash = computeContinuityHash(state.continuityHash, beatNumber);

  // ── Step 8: Sync metrics ───────────────────────────────────────────────────
  const entitiesAlive = entities.filter((e) => e.isAlive).length;

  const heartbeat: GenesisHeartbeat = {
    beatNumber,
    timestamp: now,
    totalBeats,
    uptimeMs,
    isRunning: true,
    entitiesAlive,
    kuramotoOrderParam: R,
  };

  const newState: GenesisState = {
    ...state,
    entities,
    heartbeat,
    callLog,
    recoveryEvents,
    continuityHash,
    syncMetricsHistory: state.syncMetricsHistory,
  };

  // Compute and append sync metrics
  const syncMetrics = getSyncMetrics(newState);
  let syncHistory = [...state.syncMetricsHistory, syncMetrics];
  // Keep last 500 sync metric snapshots
  if (syncHistory.length > 500) {
    syncHistory = syncHistory.slice(syncHistory.length - 500);
  }

  return {
    ...newState,
    syncMetricsHistory: syncHistory,
  };
}

/**
 * Return the current heartbeat snapshot.
 *
 * @param state Current genesis state
 * @returns `GenesisHeartbeat`
 */
export function getHeartbeat(state: GenesisState): GenesisHeartbeat {
  return state.heartbeat;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §10  RUNTIME TRUTH AUDIT INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Perform a comprehensive truth audit of the genesis runtime.
 *
 * Checks heartbeat continuity, entity pulse accuracy, call graph integrity,
 * self-use loops, and failure/recovery behavior, then assigns an overall
 * truth level:
 *
 * - **corroborated**: heartbeat running, all entities have pulsed, self-calls exist
 * - **partial**: some of the above conditions met
 * - **unverified**: none of the above conditions met
 *
 * @param state Current genesis state
 * @returns `TruthAudit` with detailed evidence
 */
export function auditRuntime(state: GenesisState): TruthAudit {
  const { heartbeat, entities, callLog, recoveryEvents } = state;

  // ── Heartbeat continuity ───────────────────────────────────────────────────
  const heartbeatContinuity = {
    status: (heartbeat.totalBeats > 0 ? 'verified' : 'unverified') as
      | 'verified'
      | 'unverified',
    totalBeats: heartbeat.totalBeats,
    uptimeMs: heartbeat.uptimeMs,
    evidence:
      heartbeat.totalBeats > 0
        ? `Heartbeat verified: ${heartbeat.totalBeats} beats over ${heartbeat.uptimeMs}ms ` +
          `(${HEARTBEAT_MS}ms interval). Genesis timestamp: ${state.genesisTimestamp}. ` +
          `Continuity hash: ${state.continuityHash}.`
        : 'No heartbeat beats recorded. Runtime has not ticked.',
  };

  // ── Entity pulse count audit ───────────────────────────────────────────────
  const entityPulseCount = entities.map((entity) => {
    const expectedPulses = entity.isAlive ? heartbeat.totalBeats : entity.pulseCount;
    const actualPulses = entity.pulseCount;
    const deviation =
      Math.abs(actualPulses - expectedPulses) / Math.max(expectedPulses, 1);

    return {
      entityId: entity.id,
      entityName: entity.name,
      actualPulses,
      expectedPulses,
      deviation,
    };
  });

  // ── Call graph ─────────────────────────────────────────────────────────────
  const callGraph = getCallGraph(state);

  // ── Internal call log evidence (last 10 entries) ───────────────────────────
  const internalCallLogEvidence = callLog.slice(
    Math.max(0, callLog.length - 10),
  );

  // ── Self-use loop evidence ─────────────────────────────────────────────────
  const totalSelfCalls = callLog.filter((c) => c.callType === 'self').length;
  const entitiesWithSelfCalls = entities.filter(
    (e) => e.selfCallCount > 0,
  ).length;
  const selfUseLoopEvidence = {
    totalSelfCalls,
    entitiesWithSelfCalls,
    evidence:
      totalSelfCalls > 0
        ? `${totalSelfCalls} self-calls recorded across ${entitiesWithSelfCalls} entities. ` +
          `Self-call interval: every ${SELF_CALL_INTERVAL} beats (PHI * 5 ≈ ${SELF_CALL_INTERVAL}). ` +
          `Each self-call increments the entity's selfCallCount and logs phase/coherence state.`
        : 'No self-calls recorded yet. Runtime may not have reached the first self-call interval.',
  };

  // ── Failure/recovery behavior ──────────────────────────────────────────────
  const failureRecoveryBehavior = {
    totalRecoveries: recoveryEvents.length,
    recoveryEvents: [...recoveryEvents],
    evidence:
      recoveryEvents.length > 0
        ? `${recoveryEvents.length} recovery event(s) recorded. Entities auto-revive after ` +
          `${REVIVAL_DELAY_BEATS} beats of death with coherence reset to ${REVIVAL_COHERENCE}. ` +
          `Death threshold: coherence < ${DEATH_COHERENCE_THRESHOLD}.`
        : 'No recovery events recorded. All entities have maintained coherence above the death threshold.',
  };

  // ── Overall truth level ────────────────────────────────────────────────────
  const hasBeats = heartbeat.totalBeats > 0;
  const allPulsed = entities.every((e) => e.pulseCount > 0);
  const hasSelfCalls = totalSelfCalls > 0;

  let overallTruthLevel: TruthLevel;
  if (hasBeats && allPulsed && hasSelfCalls) {
    overallTruthLevel = 'corroborated';
  } else if (hasBeats || allPulsed || hasSelfCalls) {
    overallTruthLevel = 'partial';
  } else {
    overallTruthLevel = 'unverified';
  }

  return {
    heartbeatContinuity,
    entityPulseCount,
    callGraph,
    internalCallLogEvidence,
    selfUseLoopEvidence,
    failureRecoveryBehavior,
    overallTruthLevel,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// §11  CONVENIENCE RE-EXPORTS & RUNTIME CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Run N heartbeat ticks in sequence, returning the final state.
 * Useful for testing or fast-forwarding the runtime.
 *
 * @param state  Starting state
 * @param ticks  Number of 873ms beats to simulate
 * @returns State after all ticks
 */
export function runTicks(state: GenesisState, ticks: number): GenesisState {
  let current = state;
  for (let i = 0; i < ticks; i++) {
    current = tickGenesis(current);
  }
  return current;
}

/**
 * Get a summary snapshot of the runtime suitable for dashboards.
 *
 * @param state Current genesis state
 * @returns Plain object with key metrics
 */
export function getRuntimeSummary(state: GenesisState): {
  totalEntities: number;
  aliveEntities: number;
  deadEntities: number;
  totalBeats: number;
  uptimeMs: number;
  kuramotoR: number;
  totalSelfCalls: number;
  totalCycleCompletions: number;
  continuityHash: string;
  recoveryCount: number;
} {
  const aliveEntities = state.entities.filter((e) => e.isAlive).length;
  const totalSelfCalls = state.entities.reduce(
    (sum, e) => sum + e.selfCallCount,
    0,
  );
  const totalCycleCompletions = state.entities.reduce(
    (sum, e) => sum + e.cycleCompletions,
    0,
  );

  return {
    totalEntities: state.entities.length,
    aliveEntities,
    deadEntities: state.entities.length - aliveEntities,
    totalBeats: state.heartbeat.totalBeats,
    uptimeMs: state.heartbeat.uptimeMs,
    kuramotoR: state.heartbeat.kuramotoOrderParam,
    totalSelfCalls,
    totalCycleCompletions,
    continuityHash: state.continuityHash,
    recoveryCount: state.recoveryEvents.length,
  };
}

/**
 * Retrieve a single entity by ID.
 *
 * @param state    Current genesis state
 * @param entityId Entity ID to look up
 * @returns The entity or undefined
 */
export function getEntity(
  state: GenesisState,
  entityId: string,
): GenesisEntity | undefined {
  return state.entities.find((e) => e.id === entityId);
}

/**
 * Retrieve entities by class.
 *
 * @param state       Current genesis state
 * @param entityClass Class to filter by
 * @returns Array of matching entities
 */
export function getEntitiesByClass(
  state: GenesisState,
  entityClass: EntityClass,
): GenesisEntity[] {
  return state.entities.filter((e) => e.entityClass === entityClass);
}

/**
 * Retrieve all alive entities.
 *
 * @param state Current genesis state
 * @returns Array of alive entities
 */
export function getAliveEntities(state: GenesisState): GenesisEntity[] {
  return state.entities.filter((e) => e.isAlive);
}

/**
 * Retrieve all dead entities.
 *
 * @param state Current genesis state
 * @returns Array of dead entities
 */
export function getDeadEntities(state: GenesisState): GenesisEntity[] {
  return state.entities.filter((e) => !e.isAlive);
}

/**
 * Get the children of a specific entity.
 *
 * @param state    Current genesis state
 * @param entityId Parent entity ID
 * @returns Array of child entities
 */
export function getChildren(
  state: GenesisState,
  entityId: string,
): GenesisEntity[] {
  const parent = state.entities.find((e) => e.id === entityId);
  if (!parent) return [];
  return state.entities.filter((e) => parent.children.includes(e.id));
}

/**
 * Get the parent of a specific entity.
 *
 * @param state    Current genesis state
 * @param entityId Child entity ID
 * @returns Parent entity or undefined (for sovereigns)
 */
export function getParent(
  state: GenesisState,
  entityId: string,
): GenesisEntity | undefined {
  const entity = state.entities.find((e) => e.id === entityId);
  if (!entity || !entity.parentEntity) return undefined;
  return state.entities.find((e) => e.id === entity.parentEntity);
}

/**
 * Get entities sorted by coherence (descending).
 *
 * @param state Current genesis state
 * @returns Sorted copy of entities array
 */
export function getEntitiesByCoherence(
  state: GenesisState,
): GenesisEntity[] {
  return [...state.entities].sort((a, b) => b.coherence - a.coherence);
}

/**
 * Get entities sorted by pulse count (descending).
 *
 * @param state Current genesis state
 * @returns Sorted copy of entities array
 */
export function getEntitiesByPulseCount(
  state: GenesisState,
): GenesisEntity[] {
  return [...state.entities].sort((a, b) => b.pulseCount - a.pulseCount);
}

/**
 * Get the mean coherence of all alive entities.
 *
 * @param state Current genesis state
 * @returns Mean coherence value (0-1)
 */
export function getMeanCoherence(state: GenesisState): number {
  const alive = state.entities.filter((e) => e.isAlive);
  if (alive.length === 0) return 0;
  const sum = alive.reduce((s, e) => s + e.coherence, 0);
  return sum / alive.length;
}

/**
 * Get the mean amplitude of all alive entities.
 *
 * @param state Current genesis state
 * @returns Mean amplitude value (0-1)
 */
export function getMeanAmplitude(state: GenesisState): number {
  const alive = state.entities.filter((e) => e.isAlive);
  if (alive.length === 0) return 0;
  const sum = alive.reduce((s, e) => s + e.amplitude, 0);
  return sum / alive.length;
}

/**
 * Compute the total energy of the system (sum of amplitude * coherence).
 *
 * @param state Current genesis state
 * @returns Total energy value
 */
export function getTotalEnergy(state: GenesisState): number {
  return state.entities
    .filter((e) => e.isAlive)
    .reduce((sum, e) => sum + e.amplitude * e.coherence, 0);
}

/**
 * Get the frequency spectrum — all entity frequencies sorted ascending.
 *
 * @param state Current genesis state
 * @returns Array of `{ entityId, entityName, frequency }` sorted by frequency
 */
export function getFrequencySpectrum(
  state: GenesisState,
): Array<{ entityId: string; entityName: string; frequency: number }> {
  return state.entities
    .map((e) => ({
      entityId: e.id,
      entityName: e.name,
      frequency: e.frequency,
    }))
    .sort((a, b) => a.frequency - b.frequency);
}

/**
 * Get the phase distribution — all entity phases as an array.
 *
 * @param state Current genesis state
 * @returns Array of `{ entityId, phase }` for alive entities
 */
export function getPhaseDistribution(
  state: GenesisState,
): Array<{ entityId: string; phase: number }> {
  return state.entities
    .filter((e) => e.isAlive)
    .map((e) => ({ entityId: e.id, phase: e.phase }));
}

/**
 * Check if the runtime is in a coherent state (Kuramoto R > threshold).
 *
 * @param state     Current genesis state
 * @param threshold Minimum R value for coherence (default: PHI_INVERSE)
 * @returns true if the runtime is globally coherent
 */
export function isCoherent(
  state: GenesisState,
  threshold: number = PHI_INVERSE,
): boolean {
  return state.heartbeat.kuramotoOrderParam >= threshold;
}

/**
 * Get the entity tree — sovereign roots with nested children.
 *
 * @param state Current genesis state
 * @returns Array of sovereign entities with populated children references
 */
export function getEntityTree(
  state: GenesisState,
): Array<{ sovereign: GenesisEntity; children: GenesisEntity[] }> {
  const sovereigns = state.entities.filter(
    (e) => e.entityClass === 'sovereign',
  );

  return sovereigns.map((sovereign) => ({
    sovereign,
    children: state.entities.filter((e) =>
      sovereign.children.includes(e.id),
    ),
  }));
}

/**
 * Count entities by class.
 *
 * @param state Current genesis state
 * @returns Record mapping each EntityClass to its count
 */
export function countByClass(
  state: GenesisState,
): Record<EntityClass, number> {
  const counts: Record<EntityClass, number> = {
    sovereign: 0,
    worker: 0,
    sentinel: 0,
    relay: 0,
    archive: 0,
    catalyst: 0,
  };

  for (const entity of state.entities) {
    counts[entity.entityClass]++;
  }

  return counts;
}

/**
 * Get the most recent recovery events (up to N).
 *
 * @param state Current genesis state
 * @param n     Maximum number of events to return (default: 10)
 * @returns Array of recent recovery events
 */
export function getRecentRecoveryEvents(
  state: GenesisState,
  n: number = 10,
): RecoveryEvent[] {
  return state.recoveryEvents.slice(
    Math.max(0, state.recoveryEvents.length - n),
  );
}

/**
 * Get the latest sync metrics from the history.
 *
 * @param state Current genesis state
 * @returns Latest SyncMetrics or undefined if no history
 */
export function getLatestSyncMetrics(
  state: GenesisState,
): SyncMetrics | undefined {
  if (state.syncMetricsHistory.length === 0) return undefined;
  return state.syncMetricsHistory[state.syncMetricsHistory.length - 1];
}

/**
 * Get sync metrics history (up to N most recent entries).
 *
 * @param state Current genesis state
 * @param n     Maximum entries to return (default: 50)
 * @returns Array of sync metrics snapshots
 */
export function getSyncMetricsHistory(
  state: GenesisState,
  n: number = 50,
): SyncMetrics[] {
  return state.syncMetricsHistory.slice(
    Math.max(0, state.syncMetricsHistory.length - n),
  );
}

/**
 * Compute the PHI-harmonic frequency for a given entity index.
 * Exposed for external use and testing.
 *
 * @param index Entity index (0-75)
 * @returns Frequency in Hz
 */
export function phiHarmonicFrequency(index: number): number {
  return SCHUMANN_FUNDAMENTAL * Math.pow(PHI, index / 76);
}

/**
 * Compute initial phase for a given entity index.
 * Exposed for external use and testing.
 *
 * @param index Entity index (0-75)
 * @returns Phase in degrees [0, 360)
 */
export function initialPhase(index: number): number {
  return (index * PHI * 360 / 76) % 360;
}

/**
 * Compute initial amplitude for a given entity index.
 * Exposed for external use and testing.
 *
 * @param index Entity index (0-75)
 * @returns Amplitude in [0, 1]
 */
export function initialAmplitude(index: number): number {
  return 0.5 + 0.5 * Math.sin(index * PHI_INVERSE);
}
