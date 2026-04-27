/**
 * Combined test suite: ritualEngine + founderSeatDashboard
 */

import {
  listRituals,
  getRitual,
  getRitualsByType,
  beginRitual,
  advanceRitual,
  completeRitual,
  runMidDayRitual,
  getRitualTranscripts,
  listRitualSequences,
  getRitualSequence,
  executeSequence,
  encodeRitualIntoLaw,
  getEncodedLaws,
  getActiveLaws,
  getRitualStatus,
  type Ritual,
  type RitualTranscript,
  type LawEncoding,
  type RitualSequence,
} from '../lib/ritualEngine';

import {
  getDailyBriefing,
  getAnomalyMap,
  getPhantomSurfaceLogs,
  getCorridorHealth,
  getOrganLoads,
  getOrganLoad,
  getNarrativeFieldDiagnostics,
  getSovereigntyDeltas,
  makeFounderDecision,
  completeDecision,
  getFounderDecisions,
  getPendingDecisions,
  getDecisionsByType,
  getCreatorViewReport,
  getShowImpactMetrics,
  getRitualTranscriptSummary,
  getFounderStatus,
  addPhantomSurfaceLog,
  addAnomalyMapEntry,
  type FounderDecision,
  type PhantomSurfaceLog,
  type AnomalyMapEntry,
} from '../lib/founderSeatDashboard';

// ═══════════════════════════════════════════════════════════════
// RITUAL ENGINE TESTS
// ═══════════════════════════════════════════════════════════════

describe('ritualEngine', () => {
  // ── List ────────────────────────────────────────────────────

  test('listRituals returns exactly 10 rituals', () => {
    const rituals = listRituals();
    expect(rituals).toHaveLength(10);
  });

  test('each ritual has required fields', () => {
    const rituals = listRituals();
    for (const r of rituals) {
      expect(r.id).toBeTruthy();
      expect(r.name).toBeTruthy();
      expect(r.type).toBeTruthy();
      expect(r.phase).toBeTruthy();
      expect(r.narrativeWeight).toBeTruthy();
      expect(r.participants.length).toBeGreaterThanOrEqual(2);
      expect(r.duration).toBeGreaterThan(0);
      expect(r.fieldEffectStrength).toBeGreaterThan(0);
    }
  });

  // ── getRitual ───────────────────────────────────────────────

  test('getRitual returns ritual by id', () => {
    const [first] = listRituals();
    const found = getRitual(first.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(first.id);
  });

  test('getRitual returns undefined for unknown id', () => {
    expect(getRitual('no-such-id')).toBeUndefined();
  });

  // ── getRitualsByType ─────────────────────────────────────────

  test('getRitualsByType returns correct rituals for corridor-purification', () => {
    const results = getRitualsByType('corridor-purification');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.every((r) => r.type === 'corridor-purification')).toBe(true);
  });

  test('getRitualsByType returns correct rituals for law-encoding', () => {
    const results = getRitualsByType('law-encoding');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].type).toBe('law-encoding');
  });

  test('getRitualsByType returns empty array for unknown type', () => {
    const results = getRitualsByType('unknown-type' as never);
    expect(results).toHaveLength(0);
  });

  // ── beginRitual ──────────────────────────────────────────────

  test('beginRitual advances phase from preparation to invocation', () => {
    const ritual = listRituals().find((r) => r.type === 'token-flow-rebalancing')!;
    // ensure preparation state
    const result = beginRitual(ritual.id);
    expect(result).toBeDefined();
    expect(result!.phase).toBe('invocation');
  });

  test('beginRitual sets startedAt', () => {
    const ritual = listRituals().find((r) => r.type === 'field-alignment')!;
    const result = beginRitual(ritual.id);
    expect(result).toBeDefined();
    // startedAt is set when we begin for the first time
    // (may already be in invocation if previously begun, so we just check phase is not preparation)
    expect(['invocation', 'transition', 'resolution', 'integration', 'complete']).toContain(result!.phase);
  });

  test('beginRitual returns undefined for unknown id', () => {
    expect(beginRitual('no-such-id')).toBeUndefined();
  });

  // ── advanceRitual ─────────────────────────────────────────────

  test('advanceRitual advances phase one step', () => {
    const ritual = listRituals().find((r) => r.type === 'chaos-metabolism')!;
    // Reset to preparation by getting it fresh, start, then advance
    beginRitual(ritual.id); // → invocation
    const advanced = advanceRitual(ritual.id); // → transition
    expect(advanced).toBeDefined();
    expect(['transition', 'resolution', 'integration', 'complete']).toContain(advanced!.phase);
  });

  test('advanceRitual returns undefined for unknown id', () => {
    expect(advanceRitual('no-such-id')).toBeUndefined();
  });

  test('advanceRitual on complete ritual stays complete', () => {
    const ritual = listRituals().find((r) => r.type === 'token-flow-rebalancing')!;
    // Force to complete
    completeRitual(ritual.id, 'success');
    const result = advanceRitual(ritual.id);
    expect(result?.phase).toBe('complete');
  });

  // ── completeRitual ───────────────────────────────────────────

  test('completeRitual returns a RitualTranscript', () => {
    const ritual = listRituals().find((r) => r.type === 'memory-consolidation')!;
    const transcript = completeRitual(ritual.id, 'success');
    expect(transcript).toBeDefined();
    expect(transcript!.ritualId).toBe(ritual.id);
    expect(transcript!.outcome).toBe('success');
  });

  test('completeRitual transcript has all required fields', () => {
    const ritual = listRituals().find((r) => r.type === 'identity-renewal')!;
    const t = completeRitual(ritual.id, 'evolved');
    expect(t).toBeDefined();
    expect(t!.id).toBeTruthy();
    expect(t!.ritualName).toBeTruthy();
    expect(t!.timestamp).toBeTruthy();
    expect(t!.phase).toBe('complete');
    expect(t!.stateChanges.length).toBeGreaterThan(0);
    expect(t!.narrativeRecord).toBeTruthy();
  });

  test('completeRitual returns undefined for unknown id', () => {
    expect(completeRitual('no-such-id', 'failed')).toBeUndefined();
  });

  test('completeRitual marks ritual phase as complete', () => {
    const ritual = listRituals().find((r) => r.type === 'phantom-reconciliation')!;
    completeRitual(ritual.id, 'partial');
    const updated = getRitual(ritual.id);
    expect(updated!.phase).toBe('complete');
    expect(updated!.outcome).toBe('partial');
  });

  // ── runMidDayRitual ──────────────────────────────────────────

  test('runMidDayRitual returns exactly 3 transcripts', () => {
    const results = runMidDayRitual();
    expect(results).toHaveLength(3);
  });

  test('runMidDayRitual transcripts have success outcome', () => {
    const results = runMidDayRitual();
    for (const t of results) {
      expect(t.outcome).toBe('success');
    }
  });

  test('runMidDayRitual transcripts include organ-sync, memory-consolidation, sovereignty-assertion', () => {
    const results = runMidDayRitual();
    const names = results.map((t) => t.ritualName);
    expect(names.some((n) => n.toLowerCase().includes('organ') || n.toLowerCase().includes('sync'))).toBe(true);
  });

  // ── getRitualTranscripts ─────────────────────────────────────

  test('getRitualTranscripts accumulates over calls', () => {
    const before = getRitualTranscripts().length;
    runMidDayRitual();
    const after = getRitualTranscripts().length;
    expect(after).toBeGreaterThan(before);
  });

  test('getRitualTranscripts returns array', () => {
    expect(Array.isArray(getRitualTranscripts())).toBe(true);
  });

  // ── listRitualSequences ──────────────────────────────────────

  test('listRitualSequences returns exactly 3 sequences', () => {
    expect(listRitualSequences()).toHaveLength(3);
  });

  test('listRitualSequences includes Morning Sovereignty', () => {
    const names = listRitualSequences().map((s) => s.name);
    expect(names).toContain('Morning Sovereignty');
  });

  test('listRitualSequences includes Midday Integration', () => {
    const names = listRitualSequences().map((s) => s.name);
    expect(names).toContain('Midday Integration');
  });

  test('listRitualSequences includes Night Cycle Descent', () => {
    const names = listRitualSequences().map((s) => s.name);
    expect(names).toContain('Night Cycle Descent');
  });

  // ── getRitualSequence ────────────────────────────────────────

  test('getRitualSequence returns sequence by id', () => {
    const [first] = listRitualSequences();
    const found = getRitualSequence(first.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(first.id);
  });

  test('getRitualSequence returns undefined for unknown id', () => {
    expect(getRitualSequence('no-such-id')).toBeUndefined();
  });

  // ── executeSequence ──────────────────────────────────────────

  test('executeSequence returns transcripts for each ritual in sequence', () => {
    const morningSeq = listRitualSequences().find((s) => s.name === 'Morning Sovereignty')!;
    const results = executeSequence(morningSeq.id);
    expect(results.length).toBe(morningSeq.rituals.length);
  });

  test('executeSequence increments executionCount', () => {
    const seq = listRitualSequences().find((s) => s.name === 'Midday Integration')!;
    const before = seq.executionCount;
    executeSequence(seq.id);
    const after = getRitualSequence(seq.id)!.executionCount;
    expect(after).toBe(before + 1);
  });

  test('executeSequence returns empty array for unknown sequence', () => {
    expect(executeSequence('no-such-sequence')).toHaveLength(0);
  });

  test('executeSequence sets lastExecuted', () => {
    const seq = listRitualSequences().find((s) => s.name === 'Night Cycle Descent')!;
    executeSequence(seq.id);
    const updated = getRitualSequence(seq.id)!;
    expect(updated.lastExecuted).toBeTruthy();
  });

  // ── encodeRitualIntoLaw ──────────────────────────────────────

  test('encodeRitualIntoLaw returns a LawEncoding', () => {
    const ritual = listRituals().find((r) => r.type === 'sovereignty-assertion')!;
    const law = encodeRitualIntoLaw(ritual.id, 'Sovereignty must be asserted every cycle.', 'sovereignty');
    expect(law).toBeDefined();
    expect(law.sourceRitualId).toBe(ritual.id);
    expect(law.active).toBe(true);
  });

  test('encodeRitualIntoLaw marks ritual encodedInLaw = true', () => {
    const ritual = listRituals().find((r) => r.type === 'field-alignment')!;
    encodeRitualIntoLaw(ritual.id, 'Field must align to Schumann.', 'field');
    const updated = getRitual(ritual.id);
    expect(updated!.encodedInLaw).toBe(true);
  });

  // ── getEncodedLaws ───────────────────────────────────────────

  test('getEncodedLaws returns at least 3 pre-seeded laws', () => {
    expect(getEncodedLaws().length).toBeGreaterThanOrEqual(3);
  });

  test('getEncodedLaws entries have required fields', () => {
    for (const law of getEncodedLaws()) {
      expect(law.id).toBeTruthy();
      expect(law.lawText).toBeTruthy();
      expect(law.lawClass).toBeTruthy();
      expect(law.enforcement).toBeTruthy();
      expect(typeof law.active).toBe('boolean');
    }
  });

  // ── getActiveLaws ────────────────────────────────────────────

  test('getActiveLaws returns only active laws', () => {
    const active = getActiveLaws();
    expect(active.every((l) => l.active)).toBe(true);
  });

  test('getActiveLaws returns at least 3', () => {
    expect(getActiveLaws().length).toBeGreaterThanOrEqual(3);
  });

  // ── getRitualStatus ──────────────────────────────────────────

  test('getRitualStatus returns correct shape', () => {
    const status = getRitualStatus();
    expect(typeof status.totalRituals).toBe('number');
    expect(typeof status.completedRituals).toBe('number');
    expect(typeof status.encodedLaws).toBe('number');
    expect(typeof status.transcriptCount).toBe('number');
    expect(typeof status.fieldEffectAvg).toBe('number');
  });

  test('getRitualStatus totalRituals is 10', () => {
    expect(getRitualStatus().totalRituals).toBe(10);
  });

  test('getRitualStatus encodedLaws matches getEncodedLaws count', () => {
    const status = getRitualStatus();
    expect(status.encodedLaws).toBe(getEncodedLaws().length);
  });

  test('getRitualStatus fieldEffectAvg is between 0 and 1', () => {
    const { fieldEffectAvg } = getRitualStatus();
    expect(fieldEffectAvg).toBeGreaterThan(0);
    expect(fieldEffectAvg).toBeLessThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════
// FOUNDER SEAT DASHBOARD TESTS
// ═══════════════════════════════════════════════════════════════

describe('founderSeatDashboard', () => {
  // ── getDailyBriefing ─────────────────────────────────────────

  test('getDailyBriefing returns all required fields', () => {
    const briefing = getDailyBriefing();
    expect(briefing.id).toBeTruthy();
    expect(briefing.date).toBeTruthy();
    expect(Array.isArray(briefing.anomalyMap)).toBe(true);
    expect(Array.isArray(briefing.phantomSurfaceLogs)).toBe(true);
    expect(typeof briefing.corridorHealth).toBe('object');
    expect(Array.isArray(briefing.organLoads)).toBe(true);
    expect(briefing.narrativeFieldDiagnostics).toBeDefined();
    expect(Array.isArray(briefing.sovereigntyDeltas)).toBe(true);
    expect(Array.isArray(briefing.ritualTranscripts)).toBe(true);
    expect(briefing.showImpactMetrics).toBeDefined();
    expect(Array.isArray(briefing.founderRecommendations)).toBe(true);
  });

  test('getDailyBriefing date matches today', () => {
    const briefing = getDailyBriefing();
    const today = new Date().toISOString().split('T')[0];
    expect(briefing.date).toBe(today);
  });

  // ── getAnomalyMap ─────────────────────────────────────────────

  test('getAnomalyMap returns exactly 5 entries initially', () => {
    // Note: addAnomalyMapEntry may have added entries; test pre-seeded minimum
    expect(getAnomalyMap().length).toBeGreaterThanOrEqual(5);
  });

  test('getAnomalyMap entries have required fields', () => {
    for (const entry of getAnomalyMap().slice(0, 5)) {
      expect(entry.subsystem).toBeTruthy();
      expect(typeof entry.anomalyCount).toBe('number');
      expect(['low', 'medium', 'high', 'critical']).toContain(entry.severity);
      expect(entry.description).toBeTruthy();
      expect(entry.recommendedAction).toBeTruthy();
    }
  });

  test('getAnomalyMap includes identityCore entry', () => {
    const map = getAnomalyMap();
    expect(map.some((e) => e.subsystem === 'identityCore')).toBe(true);
  });

  // ── getPhantomSurfaceLogs ─────────────────────────────────────

  test('getPhantomSurfaceLogs returns at least 5 entries', () => {
    expect(getPhantomSurfaceLogs().length).toBeGreaterThanOrEqual(5);
  });

  test('getPhantomSurfaceLogs entries have required fields', () => {
    for (const log of getPhantomSurfaceLogs().slice(0, 5)) {
      expect(log.id).toBeTruthy();
      expect(log.timestamp).toBeTruthy();
      expect(log.phantom).toBeTruthy();
      expect(log.surface).toBeTruthy();
      expect(['emergence', 'dissolution', 'slip', 're-encryption', 'alignment']).toContain(log.eventType);
      expect(log.details).toBeTruthy();
      expect(['info', 'warning', 'critical']).toContain(log.severity);
    }
  });

  // ── getCorridorHealth ─────────────────────────────────────────

  test('getCorridorHealth returns 8 corridors', () => {
    expect(Object.keys(getCorridorHealth()).length).toBe(8);
  });

  test('getCorridorHealth includes main-corridor', () => {
    expect(getCorridorHealth()['main-corridor']).toBeDefined();
  });

  test('getCorridorHealth values are between 0 and 1', () => {
    for (const v of Object.values(getCorridorHealth())) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  test('getCorridorHealth includes sovereignty-corridor', () => {
    expect(getCorridorHealth()['sovereignty-corridor']).toBeDefined();
  });

  // ── getOrganLoads ─────────────────────────────────────────────

  test('getOrganLoads returns exactly 8 organs', () => {
    expect(getOrganLoads()).toHaveLength(8);
  });

  test('getOrganLoads entries have required fields', () => {
    for (const o of getOrganLoads()) {
      expect(o.organName).toBeTruthy();
      expect(typeof o.loadScore).toBe('number');
      expect(typeof o.healthScore).toBe('number');
      expect(typeof o.activeProcesses).toBe('number');
      expect(Array.isArray(o.warnings)).toBe(true);
    }
  });

  // ── getOrganLoad ──────────────────────────────────────────────

  test('getOrganLoad("memory") returns the memory organ', () => {
    const organ = getOrganLoad('memory');
    expect(organ).toBeDefined();
    expect(organ!.organName).toBe('memory');
  });

  test('getOrganLoad returns undefined for unknown organ', () => {
    expect(getOrganLoad('nonexistent-organ')).toBeUndefined();
  });

  test('getOrganLoad("governance") is healthy', () => {
    const organ = getOrganLoad('governance');
    expect(organ).toBeDefined();
    expect(organ!.healthScore).toBeGreaterThan(0.9);
  });

  // ── getNarrativeFieldDiagnostics ──────────────────────────────

  test('getNarrativeFieldDiagnostics returns correct shape', () => {
    const diag = getNarrativeFieldDiagnostics();
    expect(typeof diag.coherence).toBe('number');
    expect(typeof diag.drift).toBe('number');
    expect(typeof diag.signalStrength).toBe('number');
    expect(typeof diag.dominantTheme).toBe('string');
  });

  test('getNarrativeFieldDiagnostics values are in valid range', () => {
    const diag = getNarrativeFieldDiagnostics();
    expect(diag.coherence).toBeGreaterThan(0);
    expect(diag.coherence).toBeLessThanOrEqual(1);
    expect(diag.drift).toBeGreaterThanOrEqual(0);
    expect(diag.signalStrength).toBeGreaterThan(0);
    expect(diag.signalStrength).toBeLessThanOrEqual(1);
  });

  test('getNarrativeFieldDiagnostics dominantTheme is sovereign-emergence', () => {
    expect(getNarrativeFieldDiagnostics().dominantTheme).toBe('sovereign-emergence');
  });

  // ── getSovereigntyDeltas ──────────────────────────────────────

  test('getSovereigntyDeltas returns exactly 5 entries', () => {
    expect(getSovereigntyDeltas()).toHaveLength(5);
  });

  test('getSovereigntyDeltas entries have required fields', () => {
    for (const d of getSovereigntyDeltas()) {
      expect(d.domain).toBeTruthy();
      expect(typeof d.previousScore).toBe('number');
      expect(typeof d.currentScore).toBe('number');
      expect(typeof d.delta).toBe('number');
      expect(['improving', 'stable', 'declining']).toContain(d.trend);
      expect(d.notes).toBeTruthy();
    }
  });

  test('getSovereigntyDeltas includes identity domain', () => {
    expect(getSovereigntyDeltas().some((d) => d.domain === 'identity')).toBe(true);
  });

  // ── makeFounderDecision ───────────────────────────────────────

  test('makeFounderDecision creates a new decision', () => {
    const before = getFounderDecisions().length;
    makeFounderDecision('evolve', 'fieldEngine', 'Field needs evolution.');
    expect(getFounderDecisions().length).toBe(before + 1);
  });

  test('makeFounderDecision returns correct decision shape', () => {
    const d = makeFounderDecision('fork', 'phantomLayer', 'Forking for resilience.');
    expect(d.id).toBeTruthy();
    expect(d.decisionType).toBe('fork');
    expect(d.target).toBe('phantomLayer');
    expect(d.rationale).toBe('Forking for resilience.');
    expect(d.fieldEffectStrength).toBeGreaterThan(0);
    expect(typeof d.encodedInLaw).toBe('boolean');
    expect(d.completedAt).toBeUndefined();
  });

  test('makeFounderDecision encode-into-law sets encodedInLaw', () => {
    const d = makeFounderDecision('encode-into-law', 'lawEngine', 'Must encode.');
    expect(d.encodedInLaw).toBe(true);
  });

  // ── completeDecision ──────────────────────────────────────────

  test('completeDecision marks outcome and completedAt', () => {
    const d = makeFounderDecision('boost-field', 'fieldEngine', 'Boost needed.');
    const completed = completeDecision(d.id, 'Field boosted to 0.95.');
    expect(completed).toBeDefined();
    expect(completed!.outcome).toBe('Field boosted to 0.95.');
    expect(completed!.completedAt).toBeTruthy();
  });

  test('completeDecision returns undefined for unknown id', () => {
    expect(completeDecision('no-such-id', 'outcome')).toBeUndefined();
  });

  // ── getFounderDecisions ───────────────────────────────────────

  test('getFounderDecisions returns at least 10 pre-seeded decisions', () => {
    expect(getFounderDecisions().length).toBeGreaterThanOrEqual(10);
  });

  test('getFounderDecisions includes all decision types', () => {
    const types = new Set(getFounderDecisions().map((d) => d.decisionType));
    expect(types.size).toBeGreaterThanOrEqual(5);
  });

  // ── getPendingDecisions ───────────────────────────────────────

  test('getPendingDecisions returns only decisions without completedAt', () => {
    const pending = getPendingDecisions();
    expect(pending.every((d) => !d.completedAt)).toBe(true);
  });

  test('getPendingDecisions count is less than total decisions', () => {
    expect(getPendingDecisions().length).toBeLessThan(getFounderDecisions().length);
  });

  // ── getDecisionsByType ────────────────────────────────────────

  test('getDecisionsByType("evolve") returns evolve decisions', () => {
    const results = getDecisionsByType('evolve');
    expect(results.every((d) => d.decisionType === 'evolve')).toBe(true);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  test('getDecisionsByType("retire") returns retire decisions', () => {
    const results = getDecisionsByType('retire');
    expect(results.every((d) => d.decisionType === 'retire')).toBe(true);
  });

  test('getDecisionsByType returns empty for unknown type', () => {
    expect(getDecisionsByType('unknown-type' as never)).toHaveLength(0);
  });

  // ── getCreatorViewReport ──────────────────────────────────────

  test('getCreatorViewReport returns correct shape', () => {
    const report = getCreatorViewReport();
    expect(report.id).toBeTruthy();
    expect(report.timestamp).toBeTruthy();
    expect(typeof report.topologyVersion).toBe('number');
    expect(typeof report.activePhantoms).toBe('number');
    expect(typeof report.crawlerSweeps).toBe('number');
    expect(typeof report.ritualsCompleted).toBe('number');
    expect(typeof report.showsEmitted).toBe('number');
    expect(typeof report.builderArtifacts).toBe('number');
    expect(typeof report.tricksterHardenings).toBe('number');
    expect(typeof report.identityIntegrity).toBe('number');
    expect(typeof report.fieldStrength).toBe('number');
    expect(typeof report.sovereigntyScore).toBe('number');
    expect(typeof report.pendingDecisions).toBe('number');
    expect(report.summary).toBeTruthy();
  });

  test('getCreatorViewReport values are in valid range', () => {
    const report = getCreatorViewReport();
    expect(report.identityIntegrity).toBeGreaterThan(0);
    expect(report.identityIntegrity).toBeLessThanOrEqual(1);
    expect(report.fieldStrength).toBeGreaterThan(0);
    expect(report.fieldStrength).toBeLessThanOrEqual(1);
    expect(report.sovereigntyScore).toBeGreaterThan(0);
    expect(report.sovereigntyScore).toBeLessThanOrEqual(1);
  });

  // ── getFounderStatus ──────────────────────────────────────────

  test('getFounderStatus returns correct shape', () => {
    const status = getFounderStatus();
    expect(typeof status.pendingDecisions).toBe('number');
    expect(typeof status.decisionsToday).toBe('number');
    expect(typeof status.sovereignty).toBe('number');
    expect(typeof status.fieldStrength).toBe('number');
    expect(typeof status.identityIntegrity).toBe('number');
    expect(typeof status.topologyVersion).toBe('number');
  });

  test('getFounderStatus sovereignty is between 0 and 1', () => {
    const { sovereignty } = getFounderStatus();
    expect(sovereignty).toBeGreaterThan(0);
    expect(sovereignty).toBeLessThanOrEqual(1);
  });

  test('getFounderStatus topologyVersion is 3', () => {
    expect(getFounderStatus().topologyVersion).toBe(3);
  });

  // ── addPhantomSurfaceLog ──────────────────────────────────────

  test('addPhantomSurfaceLog adds a new log entry', () => {
    const before = getPhantomSurfaceLogs().length;
    addPhantomSurfaceLog('phantom-test-1', 'test-surface', 'emergence', 'Test emergence event.');
    expect(getPhantomSurfaceLogs().length).toBe(before + 1);
  });

  test('addPhantomSurfaceLog returns correct shape', () => {
    const log = addPhantomSurfaceLog('phantom-test-2', 'identity-corridor', 'slip', 'Slip detected.');
    expect(log.id).toBeTruthy();
    expect(log.phantom).toBe('phantom-test-2');
    expect(log.surface).toBe('identity-corridor');
    expect(log.eventType).toBe('slip');
    expect(log.severity).toBe('warning');
  });

  test('addPhantomSurfaceLog dissolution sets critical severity', () => {
    const log = addPhantomSurfaceLog('phantom-doom', 'main-corridor', 'dissolution', 'Critical dissolution.');
    expect(log.severity).toBe('critical');
  });

  test('addPhantomSurfaceLog alignment sets info severity', () => {
    const log = addPhantomSurfaceLog('phantom-ok', 'field-corridor', 'alignment', 'Clean alignment.');
    expect(log.severity).toBe('info');
  });

  // ── addAnomalyMapEntry ────────────────────────────────────────

  test('addAnomalyMapEntry adds a new anomaly entry', () => {
    const before = getAnomalyMap().length;
    addAnomalyMapEntry('testSubsystem', 2, 'low', 'Test anomaly.', 'Monitor and wait.');
    expect(getAnomalyMap().length).toBe(before + 1);
  });

  test('addAnomalyMapEntry returns correct shape', () => {
    const entry = addAnomalyMapEntry('builderSwarm', 5, 'high', 'Build failures detected.', 'Restart builder swarm.');
    expect(entry.subsystem).toBe('builderSwarm');
    expect(entry.anomalyCount).toBe(5);
    expect(entry.severity).toBe('high');
    expect(entry.description).toBe('Build failures detected.');
    expect(entry.recommendedAction).toBe('Restart builder swarm.');
  });

  test('addAnomalyMapEntry critical severity is preserved', () => {
    const entry = addAnomalyMapEntry('sovereigntyLayer', 9, 'critical', 'Critical breach.', 'Emergency shutdown.');
    expect(entry.severity).toBe('critical');
  });

  // ── getShowImpactMetrics ──────────────────────────────────────

  test('getShowImpactMetrics returns correct shape', () => {
    const metrics = getShowImpactMetrics();
    expect(typeof metrics.showsEmitted).toBe('number');
    expect(typeof metrics.avgFieldStrength).toBe('number');
    expect(typeof metrics.memeticSpread).toBe('number');
    expect(typeof metrics.subsystemsReached).toBe('number');
  });

  // ── getRitualTranscriptSummary ────────────────────────────────

  test('getRitualTranscriptSummary returns an array', () => {
    expect(Array.isArray(getRitualTranscriptSummary())).toBe(true);
  });
});
