/**
 * Tests for the Genesis Autonomous Runtime module.
 * Covers entity creation, heartbeat, Kuramoto synchronization, autonomous cycles,
 * self-calling, runtime proof, truth audit, and utility helpers.
 */

import {
  createGenesisEntities,
  startGenesis,
  tickGenesis,
  getHeartbeat,
  kuramotoSync,
  kuramotoCoupling,
  globalSyncStep,
  getSyncMetrics,
  mapCycle,
  runCycleStep,
  getCycleMap,
  selfCall,
  internalCall,
  broadcastCall,
  getCallLog,
  getCallGraph,
  computeContinuityHash,
  getRuntimeProof,
  verifyContinuity,
  auditRuntime,
  runTicks,
  getRuntimeSummary,
  getEntity,
  getEntitiesByClass,
  getAliveEntities,
  getDeadEntities,
  getChildren,
  getParent,
  getEntitiesByCoherence,
  getEntitiesByPulseCount,
  getMeanCoherence,
  getMeanAmplitude,
  getTotalEnergy,
  getFrequencySpectrum,
  getPhaseDistribution,
  isCoherent,
  getEntityTree,
  countByClass,
  getRecentRecoveryEvents,
  getLatestSyncMetrics,
  getSyncMetricsHistory,
  phiHarmonicFrequency,
  initialPhase,
  initialAmplitude,
  CYCLE_STAGES,
  GenesisEntity,
  GenesisState,
} from '../lib/genesisAutonomousRuntime';

import { PHI, PHI_INVERSE, HEARTBEAT_MS, SCHUMANN_FUNDAMENTAL } from '../lib/kernelCompression';

// ═══════════════════════════════════════════════════════════════════════════════
// §1  ENTITY CREATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('§1 Entity Creation', () => {
  let entities: GenesisEntity[];

  beforeAll(() => {
    entities = createGenesisEntities();
  });

  it('creates exactly 76 entities', () => {
    expect(entities).toHaveLength(76);
  });

  it('all entity names are unique', () => {
    const names = entities.map((e) => e.name);
    expect(new Set(names).size).toBe(76);
  });

  it('all entity IDs are unique', () => {
    const ids = entities.map((e) => e.id);
    expect(new Set(ids).size).toBe(76);
  });

  it('all entity frequencies are unique', () => {
    const freqs = entities.map((e) => e.frequency);
    expect(new Set(freqs).size).toBe(76);
  });

  it('has 12 sovereign entities', () => {
    expect(entities.filter((e) => e.entityClass === 'sovereign')).toHaveLength(12);
  });

  it('has 16 worker entities', () => {
    expect(entities.filter((e) => e.entityClass === 'worker')).toHaveLength(16);
  });

  it('has 12 sentinel entities', () => {
    expect(entities.filter((e) => e.entityClass === 'sentinel')).toHaveLength(12);
  });

  it('has 12 relay entities', () => {
    expect(entities.filter((e) => e.entityClass === 'relay')).toHaveLength(12);
  });

  it('has 12 archive entities', () => {
    expect(entities.filter((e) => e.entityClass === 'archive')).toHaveLength(12);
  });

  it('has 12 catalyst entities', () => {
    expect(entities.filter((e) => e.entityClass === 'catalyst')).toHaveLength(12);
  });

  it('sovereign entities have parentEntity === null', () => {
    const sovereigns = entities.filter((e) => e.entityClass === 'sovereign');
    for (const s of sovereigns) {
      expect(s.parentEntity).toBeNull();
    }
  });

  it('non-sovereign entities have a parentEntity referencing a sovereign', () => {
    const sovereignIds = new Set(
      entities.filter((e) => e.entityClass === 'sovereign').map((e) => e.id),
    );
    const nonSovereigns = entities.filter((e) => e.entityClass !== 'sovereign');
    for (const ns of nonSovereigns) {
      expect(ns.parentEntity).not.toBeNull();
      expect(sovereignIds.has(ns.parentEntity!)).toBe(true);
    }
  });

  it('each entity has a children array', () => {
    for (const e of entities) {
      expect(Array.isArray(e.children)).toBe(true);
    }
  });

  it('all entities start alive', () => {
    for (const e of entities) {
      expect(e.isAlive).toBe(true);
    }
  });

  it('frequencies are derived from PHI harmonics', () => {
    for (let i = 0; i < 5; i++) {
      const expected = phiHarmonicFrequency(i);
      expect(entities[i].frequency).toBeCloseTo(expected, 8);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §2  HEARTBEAT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('§2 Heartbeat', () => {
  let state: GenesisState;

  beforeEach(() => {
    state = startGenesis();
  });

  it('startGenesis returns state with 76 entities', () => {
    expect(state.entities).toHaveLength(76);
  });

  it('initial beatNumber is 0', () => {
    expect(state.heartbeat.beatNumber).toBe(0);
  });

  it('initial totalBeats is 0', () => {
    expect(state.heartbeat.totalBeats).toBe(0);
  });

  it('isRunning is true initially', () => {
    expect(state.heartbeat.isRunning).toBe(true);
  });

  it('after 1 tick, beatNumber is 1', () => {
    const ticked = tickGenesis(state);
    expect(ticked.heartbeat.beatNumber).toBe(1);
  });

  it('after 10 ticks, totalBeats is 10', () => {
    const ticked = runTicks(state, 10);
    expect(ticked.heartbeat.totalBeats).toBe(10);
  });

  it('uptimeMs equals totalBeats * 873', () => {
    const ticked = runTicks(state, 5);
    expect(ticked.heartbeat.uptimeMs).toBe(5 * HEARTBEAT_MS);
  });

  it('entitiesAlive starts at 76', () => {
    expect(state.heartbeat.entitiesAlive).toBe(76);
  });

  it('getHeartbeat returns heartbeat from state', () => {
    const hb = getHeartbeat(state);
    expect(hb).toEqual(state.heartbeat);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §3  KURAMOTO SYNCHRONIZATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('§3 Kuramoto Synchronization', () => {
  let state: GenesisState;

  beforeEach(() => {
    state = startGenesis();
  });

  it('kuramotoSync returns R between 0 and 1', () => {
    const { R } = kuramotoSync(state.entities);
    expect(R).toBeGreaterThanOrEqual(0);
    expect(R).toBeLessThanOrEqual(1);
  });

  it('kuramotoSync on empty array returns R=0', () => {
    const { R, meanPhase } = kuramotoSync([]);
    expect(R).toBe(0);
    expect(meanPhase).toBe(0);
  });

  it('entities all at same phase yields R close to 1', () => {
    const aligned = state.entities.map((e) => ({ ...e, phase: 90 }));
    const { R } = kuramotoSync(aligned);
    expect(R).toBeCloseTo(1, 5);
  });

  it('kuramotoCoupling changes phases', () => {
    const eI = state.entities[0];
    const eJ = state.entities[1];
    const { phaseI, phaseJ } = kuramotoCoupling(eI, eJ, 1.0);
    expect(phaseI).not.toBe(eI.phase);
    expect(phaseJ).not.toBe(eJ.phase);
  });

  it('kuramotoCoupling adjustments are antisymmetric', () => {
    const e = state.entities[0];
    const same = { ...e, phase: 45 };
    const other = { ...e, phase: 100 };
    const { phaseI, phaseJ } = kuramotoCoupling(same, other, 1.0);
    const dI = phaseI - same.phase;
    const dJ = phaseJ - other.phase;
    expect(dI).toBeCloseTo(-dJ, 8);
  });

  it('globalSyncStep returns same number of entities', () => {
    const synced = globalSyncStep(state.entities);
    expect(synced).toHaveLength(state.entities.length);
  });

  it('globalSyncStep with K=0 does not change phases', () => {
    const synced = globalSyncStep(state.entities, 0);
    for (let i = 0; i < state.entities.length; i++) {
      expect(synced[i].phase).toBe(state.entities[i].phase);
    }
  });

  it('after many ticks, heartbeat records kuramotoOrderParam as a number', () => {
    const ticked = runTicks(state, 50);
    const R = ticked.heartbeat.kuramotoOrderParam;
    expect(typeof R).toBe('number');
    expect(R).toBeGreaterThanOrEqual(0);
    expect(R).toBeLessThanOrEqual(1);
  });

  it('getSyncMetrics returns valid SyncMetrics', () => {
    const ticked = tickGenesis(state);
    const metrics = getSyncMetrics(ticked);
    expect(metrics).toHaveProperty('orderParameter');
    expect(metrics).toHaveProperty('convergenceRate');
    expect(metrics).toHaveProperty('meanPhase');
    expect(metrics).toHaveProperty('mostSynchronized');
    expect(metrics).toHaveProperty('leastSynchronized');
    expect(metrics).toHaveProperty('timestamp');
    expect(metrics.orderParameter).toBeGreaterThanOrEqual(0);
    expect(metrics.orderParameter).toBeLessThanOrEqual(1);
  });

  it('syncMetricsHistory grows with each tick', () => {
    expect(state.syncMetricsHistory).toHaveLength(0);
    const t1 = tickGenesis(state);
    expect(t1.syncMetricsHistory).toHaveLength(1);
    const t2 = tickGenesis(t1);
    expect(t2.syncMetricsHistory).toHaveLength(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §4  AUTONOMOUS CYCLE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('§4 Autonomous Cycle', () => {
  let state: GenesisState;

  beforeEach(() => {
    state = startGenesis();
  });

  it('initial cycle stage is sense', () => {
    for (const e of state.entities) {
      expect(e.cycleStage).toBe('sense');
    }
  });

  it('mapCycle returns currentStage and nextStage', () => {
    const entity = state.entities[0];
    const cycle = mapCycle(entity);
    expect(cycle.currentStage).toBe('sense');
    expect(cycle.nextStage).toBe('process');
  });

  it('mapCycle progress is between 0 and 1', () => {
    const entity = state.entities[0];
    const cycle = mapCycle(entity);
    expect(cycle.progress).toBeGreaterThanOrEqual(0);
    expect(cycle.progress).toBeLessThanOrEqual(1);
  });

  it('entity advances to next stage after CYCLE_ADVANCE_INTERVAL (5) pulses', () => {
    const CYCLE_ADVANCE_INTERVAL = Math.round(PHI * 3); // 5
    let entity = state.entities[0];
    // Simulate exactly CYCLE_ADVANCE_INTERVAL pulses
    for (let i = 0; i < CYCLE_ADVANCE_INTERVAL; i++) {
      entity = { ...entity, pulseCount: entity.pulseCount + 1 };
      entity = runCycleStep(entity);
    }
    expect(entity.cycleStage).toBe('process');
  });

  it('entity completes full cycle after 30 pulses (6 stages * 5)', () => {
    const CYCLE_ADVANCE_INTERVAL = Math.round(PHI * 3); // 5
    const fullCyclePulses = CYCLE_STAGES.length * CYCLE_ADVANCE_INTERVAL; // 30
    let entity = state.entities[0];
    for (let i = 0; i < fullCyclePulses; i++) {
      entity = { ...entity, pulseCount: entity.pulseCount + 1 };
      entity = runCycleStep(entity);
    }
    expect(entity.cycleCompletions).toBe(1);
    expect(entity.cycleStage).toBe('sense');
  });

  it('cycleCompletions increments when wrapping from adapt to sense', () => {
    const CYCLE_ADVANCE_INTERVAL = Math.round(PHI * 3);
    let entity: GenesisEntity = {
      ...state.entities[0],
      cycleStage: 'adapt',
      pulseCount: CYCLE_ADVANCE_INTERVAL - 1,
      cycleCompletions: 0,
    };
    entity = { ...entity, pulseCount: entity.pulseCount + 1 };
    entity = runCycleStep(entity);
    expect(entity.cycleCompletions).toBe(1);
    expect(entity.cycleStage).toBe('sense');
  });

  it('getCycleMap returns 76 entries', () => {
    const cycleMap = getCycleMap(state);
    expect(cycleMap).toHaveLength(76);
    expect(cycleMap[0]).toHaveProperty('entityId');
    expect(cycleMap[0]).toHaveProperty('currentStage');
    expect(cycleMap[0]).toHaveProperty('stageEnteredAt');
    expect(cycleMap[0]).toHaveProperty('cycleCompletions');
    expect(cycleMap[0]).toHaveProperty('stageHistory');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §5  SELF-CALLING TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('§5 Self-Calling System', () => {
  let state: GenesisState;

  beforeEach(() => {
    state = startGenesis();
  });

  it('selfCall creates a call log entry', () => {
    const entityId = state.entities[0].id;
    const updated = selfCall(entityId, state);
    expect(updated.callLog).toHaveLength(1);
  });

  it('selfCall increments entity.selfCallCount', () => {
    const entityId = state.entities[0].id;
    const updated = selfCall(entityId, state);
    const entity = updated.entities.find((e) => e.id === entityId)!;
    expect(entity.selfCallCount).toBe(1);
  });

  it('selfCall log entry has callType self', () => {
    const entityId = state.entities[0].id;
    const updated = selfCall(entityId, state);
    expect(updated.callLog[0].callType).toBe('self');
    expect(updated.callLog[0].sourceId).toBe(entityId);
    expect(updated.callLog[0].targetId).toBe(entityId);
  });

  it('internalCall creates log entry with callType internal', () => {
    const sourceId = state.entities[0].id;
    const targetId = state.entities[1].id;
    const updated = internalCall(sourceId, targetId, 'test-payload', state);
    expect(updated.callLog).toHaveLength(1);
    expect(updated.callLog[0].callType).toBe('internal');
  });

  it('broadcastCall creates 75 log entries (76-1)', () => {
    const sourceId = state.entities[0].id;
    const updated = broadcastCall(sourceId, 'broadcast-test', state);
    expect(updated.callLog).toHaveLength(75);
    for (const call of updated.callLog) {
      expect(call.callType).toBe('broadcast');
      expect(call.sourceId).toBe(sourceId);
      expect(call.targetId).not.toBe(sourceId);
    }
  });

  it('getCallLog returns all calls', () => {
    const entityId = state.entities[0].id;
    let s = selfCall(entityId, state);
    s = selfCall(entityId, s);
    const log = getCallLog(s);
    expect(log).toHaveLength(2);
  });

  it('getCallGraph aggregates edges', () => {
    const e0 = state.entities[0].id;
    const e1 = state.entities[1].id;
    let s = selfCall(e0, state);
    s = selfCall(e0, s);
    s = internalCall(e0, e1, 'test', s);
    const graph = getCallGraph(s);
    const selfEdge = graph.find((g) => g.sourceId === e0 && g.targetId === e0);
    expect(selfEdge).toBeDefined();
    expect(selfEdge!.callCount).toBe(2);
    const internalEdge = graph.find((g) => g.sourceId === e0 && g.targetId === e1);
    expect(internalEdge).toBeDefined();
    expect(internalEdge!.callCount).toBe(1);
  });

  it('call log rotation keeps max 1000 entries', () => {
    let s = state;
    // Broadcast creates 75 entries each time; 14 broadcasts = 1050 entries
    const sourceId = s.entities[0].id;
    for (let i = 0; i < 14; i++) {
      s = broadcastCall(sourceId, `broadcast-${i}`, s);
    }
    expect(s.callLog.length).toBeLessThanOrEqual(1000);
  });

  it('tickGenesis triggers self-calls at SELF_CALL_INTERVAL beats', () => {
    const SELF_CALL_INTERVAL = Math.round(PHI * 5); // 8
    const ticked = runTicks(state, SELF_CALL_INTERVAL);
    const totalSelfCalls = ticked.entities.reduce((sum, e) => sum + e.selfCallCount, 0);
    expect(totalSelfCalls).toBeGreaterThan(0);
    const selfCalls = ticked.callLog.filter((c) => c.callType === 'self');
    expect(selfCalls.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §6  RUNTIME PROOF TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('§6 Runtime Proof', () => {
  let state: GenesisState;

  beforeEach(() => {
    state = startGenesis();
  });

  it('computeContinuityHash is deterministic', () => {
    const h1 = computeContinuityHash('abc', 42);
    const h2 = computeContinuityHash('abc', 42);
    expect(h1).toBe(h2);
  });

  it('computeContinuityHash changes with different inputs', () => {
    const h1 = computeContinuityHash('abc', 1);
    const h2 = computeContinuityHash('abc', 2);
    expect(h1).not.toBe(h2);
  });

  it('hash chain is non-trivial: hash(hash(a,0),1) !== hash(a,1)', () => {
    const chained = computeContinuityHash(computeContinuityHash('a', 0), 1);
    const direct = computeContinuityHash('a', 1);
    expect(chained).not.toBe(direct);
  });

  it('getRuntimeProof has 76 entityProofs', () => {
    const proof = getRuntimeProof(state);
    expect(proof.entityProofs).toHaveLength(76);
  });

  it('getRuntimeProof has genesisTimestamp', () => {
    const proof = getRuntimeProof(state);
    expect(proof.genesisTimestamp).toBe(state.genesisTimestamp);
    expect(proof.proofGeneratedAt).toBeDefined();
  });

  it('verifyContinuity checks entityCount === 76', () => {
    const proof = getRuntimeProof(state);
    const result = verifyContinuity(proof);
    expect(result.checks.entityCount).toBe(true);
  });

  it('verifyContinuity on fresh state without self-calls returns isValid false', () => {
    const proof = getRuntimeProof(state);
    const result = verifyContinuity(proof);
    expect(result.isValid).toBe(false);
    expect(result.checks.selfCallsPositive).toBe(false);
  });

  it('proof after ticking with self-calls is valid', () => {
    const SELF_CALL_INTERVAL = Math.round(PHI * 5); // 8
    const ticked = runTicks(state, SELF_CALL_INTERVAL);
    const proof = getRuntimeProof(ticked);
    const result = verifyContinuity(proof);
    expect(result.checks.entityCount).toBe(true);
    expect(result.checks.hashPresent).toBe(true);
    expect(result.checks.beatsPositive).toBe(true);
    expect(result.checks.selfCallsPositive).toBe(true);
    expect(result.isValid).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §7  TRUTH AUDIT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('§7 Truth Audit', () => {
  let state: GenesisState;

  beforeEach(() => {
    state = startGenesis();
  });

  it('auditRuntime on fresh state returns unverified', () => {
    const audit = auditRuntime(state);
    expect(audit.overallTruthLevel).toBe('unverified');
  });

  it('after ticking once (no self-calls yet), status is partial', () => {
    const ticked = tickGenesis(state);
    const audit = auditRuntime(ticked);
    // hasBeats=true, allPulsed=true, but hasSelfCalls=false → partial
    expect(audit.overallTruthLevel).toBe('partial');
  });

  it('after enough ticks with self-calls, overallTruthLevel is corroborated', () => {
    const SELF_CALL_INTERVAL = Math.round(PHI * 5); // 8
    const ticked = runTicks(state, SELF_CALL_INTERVAL);
    const audit = auditRuntime(ticked);
    expect(audit.overallTruthLevel).toBe('corroborated');
  });

  it('entityPulseCount has 76 entries', () => {
    const audit = auditRuntime(state);
    expect(audit.entityPulseCount).toHaveLength(76);
  });

  it('heartbeatContinuity has evidence string', () => {
    const ticked = tickGenesis(state);
    const audit = auditRuntime(ticked);
    expect(audit.heartbeatContinuity.evidence).toBeTruthy();
    expect(typeof audit.heartbeatContinuity.evidence).toBe('string');
    expect(audit.heartbeatContinuity.status).toBe('verified');
  });

  it('selfUseLoopEvidence tracks self-calls', () => {
    const SELF_CALL_INTERVAL = Math.round(PHI * 5);
    const ticked = runTicks(state, SELF_CALL_INTERVAL);
    const audit = auditRuntime(ticked);
    expect(audit.selfUseLoopEvidence.totalSelfCalls).toBeGreaterThan(0);
    expect(audit.selfUseLoopEvidence.entitiesWithSelfCalls).toBeGreaterThan(0);
    expect(audit.selfUseLoopEvidence.evidence).toContain('self-call');
  });

  it('failureRecoveryBehavior reports recovery events (empty initially)', () => {
    const audit = auditRuntime(state);
    expect(audit.failureRecoveryBehavior.totalRecoveries).toBe(0);
    expect(audit.failureRecoveryBehavior.recoveryEvents).toHaveLength(0);
    expect(typeof audit.failureRecoveryBehavior.evidence).toBe('string');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §8  UTILITY / HELPER TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('§8 Utility / Helper Functions', () => {
  let state: GenesisState;

  beforeEach(() => {
    state = startGenesis();
  });

  it('runTicks runs correct number of ticks', () => {
    const ticked = runTicks(state, 7);
    expect(ticked.heartbeat.totalBeats).toBe(7);
  });

  it('countByClass returns correct counts', () => {
    const counts = countByClass(state);
    expect(counts.sovereign).toBe(12);
    expect(counts.worker).toBe(16);
    expect(counts.sentinel).toBe(12);
    expect(counts.relay).toBe(12);
    expect(counts.archive).toBe(12);
    expect(counts.catalyst).toBe(12);
  });

  it('getEntitiesByClass filters correctly', () => {
    const workers = getEntitiesByClass(state, 'worker');
    expect(workers).toHaveLength(16);
    for (const w of workers) {
      expect(w.entityClass).toBe('worker');
    }
  });

  it('getAliveEntities returns all 76 initially', () => {
    const alive = getAliveEntities(state);
    expect(alive).toHaveLength(76);
  });

  it('getDeadEntities returns empty array initially', () => {
    const dead = getDeadEntities(state);
    expect(dead).toHaveLength(0);
  });

  it('phiHarmonicFrequency returns correct value', () => {
    const f0 = phiHarmonicFrequency(0);
    expect(f0).toBeCloseTo(SCHUMANN_FUNDAMENTAL, 8);
    const f76 = phiHarmonicFrequency(76);
    expect(f76).toBeCloseTo(SCHUMANN_FUNDAMENTAL * PHI, 8);
  });

  it('initialPhase returns value in [0, 360)', () => {
    for (let i = 0; i < 76; i++) {
      const p = initialPhase(i);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThan(360);
    }
  });

  it('initialAmplitude is in [0, 1]', () => {
    for (let i = 0; i < 76; i++) {
      const a = initialAmplitude(i);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThanOrEqual(1);
    }
  });

  it('getRuntimeSummary returns correct fields', () => {
    const summary = getRuntimeSummary(state);
    expect(summary.totalEntities).toBe(76);
    expect(summary.aliveEntities).toBe(76);
    expect(summary.deadEntities).toBe(0);
    expect(summary.totalBeats).toBe(0);
    expect(summary.uptimeMs).toBe(0);
    expect(typeof summary.continuityHash).toBe('string');
    expect(summary.recoveryCount).toBe(0);
  });

  it('getFrequencySpectrum is sorted ascending', () => {
    const spectrum = getFrequencySpectrum(state);
    expect(spectrum).toHaveLength(76);
    for (let i = 1; i < spectrum.length; i++) {
      expect(spectrum[i].frequency).toBeGreaterThanOrEqual(spectrum[i - 1].frequency);
    }
  });

  it('getEntity retrieves entity by ID', () => {
    const first = state.entities[0];
    const found = getEntity(state, first.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(first.id);
    expect(found!.name).toBe(first.name);
  });

  it('getEntity returns undefined for unknown ID', () => {
    expect(getEntity(state, 'nonexistent-id')).toBeUndefined();
  });

  it('getChildren returns children of a sovereign', () => {
    const sovereign = state.entities.find((e) => e.entityClass === 'sovereign')!;
    const children = getChildren(state, sovereign.id);
    expect(children.length).toBeGreaterThan(0);
    for (const child of children) {
      expect(child.parentEntity).toBe(sovereign.id);
    }
  });

  it('getParent returns sovereign for non-sovereign entities', () => {
    const worker = state.entities.find((e) => e.entityClass === 'worker')!;
    const parent = getParent(state, worker.id);
    expect(parent).toBeDefined();
    expect(parent!.entityClass).toBe('sovereign');
  });

  it('getParent returns undefined for sovereign', () => {
    const sovereign = state.entities.find((e) => e.entityClass === 'sovereign')!;
    expect(getParent(state, sovereign.id)).toBeUndefined();
  });

  it('getEntitiesByCoherence returns entities sorted descending', () => {
    const sorted = getEntitiesByCoherence(state);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].coherence).toBeGreaterThanOrEqual(sorted[i].coherence);
    }
  });

  it('getEntitiesByPulseCount returns entities sorted descending', () => {
    const ticked = runTicks(state, 3);
    const sorted = getEntitiesByPulseCount(ticked);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].pulseCount).toBeGreaterThanOrEqual(sorted[i].pulseCount);
    }
  });

  it('getMeanCoherence returns a value between 0 and 1', () => {
    const mean = getMeanCoherence(state);
    expect(mean).toBeGreaterThanOrEqual(0);
    expect(mean).toBeLessThanOrEqual(1);
  });

  it('getMeanAmplitude returns a value between 0 and 1', () => {
    const mean = getMeanAmplitude(state);
    expect(mean).toBeGreaterThan(0);
    expect(mean).toBeLessThanOrEqual(1);
  });

  it('getTotalEnergy returns a positive number', () => {
    const energy = getTotalEnergy(state);
    expect(energy).toBeGreaterThan(0);
  });

  it('getPhaseDistribution returns 76 entries initially', () => {
    const dist = getPhaseDistribution(state);
    expect(dist).toHaveLength(76);
    for (const d of dist) {
      expect(d.phase).toBeGreaterThanOrEqual(0);
      expect(d.phase).toBeLessThan(360);
    }
  });

  it('isCoherent returns boolean', () => {
    expect(typeof isCoherent(state)).toBe('boolean');
  });

  it('getEntityTree returns 12 sovereign trees', () => {
    const tree = getEntityTree(state);
    expect(tree).toHaveLength(12);
    for (const node of tree) {
      expect(node.sovereign.entityClass).toBe('sovereign');
      expect(node.children.length).toBeGreaterThan(0);
    }
  });

  it('getRecentRecoveryEvents returns empty initially', () => {
    const events = getRecentRecoveryEvents(state);
    expect(events).toHaveLength(0);
  });

  it('getLatestSyncMetrics returns undefined on fresh state', () => {
    expect(getLatestSyncMetrics(state)).toBeUndefined();
  });

  it('getLatestSyncMetrics returns metrics after tick', () => {
    const ticked = tickGenesis(state);
    const metrics = getLatestSyncMetrics(ticked);
    expect(metrics).toBeDefined();
    expect(metrics!.orderParameter).toBeGreaterThanOrEqual(0);
  });

  it('getSyncMetricsHistory returns up to N entries', () => {
    const ticked = runTicks(state, 10);
    const history = getSyncMetricsHistory(ticked, 5);
    expect(history).toHaveLength(5);
  });

  it('CYCLE_STAGES has 6 stages in correct order', () => {
    expect(CYCLE_STAGES).toEqual(['sense', 'process', 'decide', 'act', 'reflect', 'adapt']);
  });

  it('continuityHash is set on initial state', () => {
    expect(state.continuityHash).toBeDefined();
    expect(state.continuityHash.length).toBe(16);
  });

  it('continuityHash changes with each tick', () => {
    const hash0 = state.continuityHash;
    const t1 = tickGenesis(state);
    expect(t1.continuityHash).not.toBe(hash0);
    const t2 = tickGenesis(t1);
    expect(t2.continuityHash).not.toBe(t1.continuityHash);
  });
});
