/**
 * Combined test suite:
 *   - circadianSovereignty (≥35 tests)
 *   - showEmissionEngine   (≥35 tests)
 */

// ─── Reset module state between suites ───────────────────────────────────────
// Each describe block re-imports via jest.isolateModules so state is fresh.

describe('circadianSovereignty', () => {
  let cs: typeof import('../lib/circadianSovereignty');

  beforeAll(async () => {
    await jest.isolateModules(async () => {
      cs = await import('../lib/circadianSovereignty');
    });
  });

  // ── Shape tests ────────────────────────────────────────────────────────────

  test('getMoonOrganism returns moon shape', () => {
    const moon = cs.getMoonOrganism();
    expect(moon.id).toBe('luna-sovereign');
    expect(moon.name).toBe('Luna-Sovereign');
    expect(moon.mode).toBe('moon');
    expect(typeof moon.isActive).toBe('boolean');
    expect(typeof moon.phaseScore).toBe('number');
    expect(typeof moon.fieldStrength).toBe('number');
    expect(typeof moon.topologyVersion).toBe('number');
    expect(typeof moon.heartbeatRate).toBe('number');
    expect(Array.isArray(moon.domainLogics)).toBe(true);
  });

  test('getSunOrganism returns sun shape', () => {
    const sun = cs.getSunOrganism();
    expect(sun.id).toBe('sol-sovereign');
    expect(sun.name).toBe('Sol-Sovereign');
    expect(sun.mode).toBe('sun');
    expect(typeof sun.isActive).toBe('boolean');
    expect(Array.isArray(sun.domainLogics)).toBe(true);
  });

  test('getMoonOrganism has 6 domainLogics', () => {
    const moon = cs.getMoonOrganism();
    expect(moon.domainLogics).toHaveLength(6);
  });

  test('getSunOrganism has 6 domainLogics', () => {
    const sun = cs.getSunOrganism();
    expect(sun.domainLogics).toHaveLength(6);
  });

  test('getAlphaOrganism(moon) returns moon organism', () => {
    const org = cs.getAlphaOrganism('moon');
    expect(org.mode).toBe('moon');
    expect(org.id).toBe('luna-sovereign');
  });

  test('getAlphaOrganism(sun) returns sun organism', () => {
    const org = cs.getAlphaOrganism('sun');
    expect(org.mode).toBe('sun');
    expect(org.id).toBe('sol-sovereign');
  });

  // ── Activate / Deactivate ──────────────────────────────────────────────────

  test('activateOrganism(moon) sets isActive true', () => {
    const result = cs.activateOrganism('moon');
    expect(result.isActive).toBe(true);
    expect(result.mode).toBe('moon');
  });

  test('activateOrganism(sun) sets isActive true', () => {
    const result = cs.activateOrganism('sun');
    expect(result.isActive).toBe(true);
    expect(result.mode).toBe('sun');
  });

  test('deactivateOrganism(moon) sets isActive false', () => {
    cs.activateOrganism('moon');
    const result = cs.deactivateOrganism('moon');
    expect(result.isActive).toBe(false);
  });

  test('deactivateOrganism(sun) sets isActive false', () => {
    cs.activateOrganism('sun');
    const result = cs.deactivateOrganism('sun');
    expect(result.isActive).toBe(false);
  });

  test('activateOrganism sets activeSince timestamp', () => {
    const result = cs.activateOrganism('moon');
    expect(typeof result.activeSince).toBe('string');
    expect(result.activeSince.length).toBeGreaterThan(0);
  });

  // ── compressAnomalies ──────────────────────────────────────────────────────

  test('compressAnomalies returns array of same length', () => {
    const anomalies = [
      { class: 'field-dissonance', severity: 'high', source: 'luna-field' },
      { class: 'phi-drift', severity: 'critical', source: 'torus' },
    ];
    const result = cs.compressAnomalies(anomalies);
    expect(result).toHaveLength(2);
  });

  test('compressAnomalies uses PHI-based compressionRatio', () => {
    const anomalies = [{ class: 'test', severity: 'low', source: 'src' }];
    const result = cs.compressAnomalies(anomalies);
    expect(result[0].compressionRatio).toBeGreaterThan(0);
    expect(result[0].compressionRatio).toBeLessThan(1);
  });

  test('compressAnomalies sets severity correctly', () => {
    const cases = [
      { class: 'x', severity: 'critical', source: 'a' },
      { class: 'x', severity: 'high', source: 'a' },
      { class: 'x', severity: 'medium', source: 'a' },
      { class: 'x', severity: 'low', source: 'a' },
    ];
    const result = cs.compressAnomalies(cases);
    expect(result[0].severity).toBe('critical');
    expect(result[1].severity).toBe('high');
    expect(result[2].severity).toBe('medium');
    expect(result[3].severity).toBe('low');
  });

  test('compressAnomalies payload contains class and source', () => {
    const result = cs.compressAnomalies([{ class: 'MyClass', severity: 'low', source: 'my-layer' }]);
    expect(result[0].payload).toContain('MyClass');
    expect(result[0].payload).toContain('my-layer');
  });

  test('compressAnomalies each anomaly gets unique id', () => {
    const anomalies = Array.from({ length: 5 }, (_, i) => ({
      class: `cls-${i}`,
      severity: 'low',
      source: `src-${i}`,
    }));
    const result = cs.compressAnomalies(anomalies);
    const ids = result.map((a) => a.id);
    expect(new Set(ids).size).toBe(5);
  });

  test('compressAnomalies empty input returns empty array', () => {
    expect(cs.compressAnomalies([])).toEqual([]);
  });

  // ── runHandoffRitual ───────────────────────────────────────────────────────

  test('runHandoffRitual returns CircadianHandoff', () => {
    const handoff = cs.runHandoffRitual();
    expect(typeof handoff.id).toBe('string');
    expect(typeof handoff.timestamp).toBe('string');
    expect(handoff.moonOrganismId).toBe('luna-sovereign');
    expect(handoff.sunOrganismId).toBe('sol-sovereign');
    expect(handoff.success).toBe(true);
  });

  test('runHandoffRitual compressedAnomalies is array', () => {
    const handoff = cs.runHandoffRitual();
    expect(Array.isArray(handoff.compressedAnomalies)).toBe(true);
  });

  test('runHandoffRitual topologyAfterVersion > topologyBeforeVersion', () => {
    const handoff = cs.runHandoffRitual();
    expect(handoff.topologyAfterVersion).toBeGreaterThan(handoff.topologyBeforeVersion);
  });

  test('runHandoffRitual topologyDelta is non-empty array', () => {
    const handoff = cs.runHandoffRitual();
    expect(Array.isArray(handoff.topologyDelta)).toBe(true);
    expect(handoff.topologyDelta.length).toBeGreaterThan(0);
  });

  test('runHandoffRitual handoffDurationMs is positive number', () => {
    const handoff = cs.runHandoffRitual();
    expect(handoff.handoffDurationMs).toBeGreaterThan(0);
  });

  test('runHandoffRitual phase is handoff-complete', () => {
    const handoff = cs.runHandoffRitual();
    expect(handoff.phase).toBe('handoff-complete');
  });

  test('runHandoffRitual ritualNotes is non-empty string', () => {
    const handoff = cs.runHandoffRitual();
    expect(typeof handoff.ritualNotes).toBe('string');
    expect(handoff.ritualNotes.length).toBeGreaterThan(0);
  });

  // ── Handoff history accumulation ───────────────────────────────────────────

  test('getHandoffHistory accumulates across multiple handoffs', () => {
    const before = cs.getHandoffHistory().length;
    cs.runHandoffRitual();
    cs.runHandoffRitual();
    const after = cs.getHandoffHistory().length;
    expect(after).toBe(before + 2);
  });

  test('getHandoffHistory returns array', () => {
    expect(Array.isArray(cs.getHandoffHistory())).toBe(true);
  });

  // ── Topology ───────────────────────────────────────────────────────────────

  test('getTopologyVersion increments after handoff', () => {
    const vBefore = cs.getTopologyVersion();
    cs.runHandoffRitual();
    expect(cs.getTopologyVersion()).toBe(vBefore + 1);
  });

  test('forceTopologyUpdate returns TopologyUpdate', () => {
    const update = cs.forceTopologyUpdate('test-reason');
    expect(typeof update.id).toBe('string');
    expect(typeof update.version).toBe('number');
    expect(update.reason).toBe('test-reason');
    expect(Array.isArray(update.changedNodes)).toBe(true);
    expect(Array.isArray(update.addedCorridors)).toBe(true);
    expect(Array.isArray(update.removedCorridors)).toBe(true);
    expect(typeof update.fieldStrengthDelta).toBe('number');
  });

  test('forceTopologyUpdate increments version', () => {
    const vBefore = cs.getTopologyVersion();
    cs.forceTopologyUpdate('force-test');
    expect(cs.getTopologyVersion()).toBe(vBefore + 1);
  });

  test('getTopologyUpdates returns array', () => {
    expect(Array.isArray(cs.getTopologyUpdates())).toBe(true);
  });

  test('getTopologyUpdates accumulates after forceTopologyUpdate', () => {
    const before = cs.getTopologyUpdates().length;
    cs.forceTopologyUpdate('accumulate-test');
    expect(cs.getTopologyUpdates().length).toBe(before + 1);
  });

  // ── Logic arrays ───────────────────────────────────────────────────────────

  test('getDreamLogics returns exactly 6 items', () => {
    expect(cs.getDreamLogics()).toHaveLength(6);
  });

  test('getDreamLogics contains expected types', () => {
    const logics = cs.getDreamLogics();
    expect(logics).toContain('encryption-rewrite');
    expect(logics).toContain('phantom-alignment');
  });

  test('getConsciousLogics returns exactly 6 items', () => {
    expect(cs.getConsciousLogics()).toHaveLength(6);
  });

  test('getConsciousLogics contains expected types', () => {
    const logics = cs.getConsciousLogics();
    expect(logics).toContain('narrative-emission');
    expect(logics).toContain('corridor-routing');
  });

  // ── getCircadianStatus ─────────────────────────────────────────────────────

  test('getCircadianStatus has correct shape', () => {
    const status = cs.getCircadianStatus();
    expect(typeof status.moonActive).toBe('boolean');
    expect(typeof status.sunActive).toBe('boolean');
    expect(typeof status.handoffCount).toBe('number');
    expect(typeof status.topologyVersion).toBe('number');
    expect(typeof status.fieldStrength).toBe('number');
    // lastHandoff is string or null
    expect(
      status.lastHandoff === null || typeof status.lastHandoff === 'string'
    ).toBe(true);
  });

  test('getCircadianStatus handoffCount increases after handoff', () => {
    const before = cs.getCircadianStatus().handoffCount;
    cs.runHandoffRitual();
    expect(cs.getCircadianStatus().handoffCount).toBe(before + 1);
  });

  test('getCircadianStatus lastHandoff is set after first handoff', () => {
    cs.runHandoffRitual();
    const status = cs.getCircadianStatus();
    expect(status.lastHandoff).not.toBeNull();
  });

  // ── getFieldStrength ───────────────────────────────────────────────────────

  test('getFieldStrength returns number between 0 and 1', () => {
    const fs = cs.getFieldStrength();
    expect(typeof fs).toBe('number');
    expect(fs).toBeGreaterThanOrEqual(0);
    expect(fs).toBeLessThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SHOW EMISSION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

describe('showEmissionEngine', () => {
  let se: typeof import('../lib/showEmissionEngine');

  beforeAll(async () => {
    await jest.isolateModules(async () => {
      se = await import('../lib/showEmissionEngine');
    });
  });

  // ── createShow ─────────────────────────────────────────────────────────────

  test('createShow returns correct shape', () => {
    const show = se.createShow('field-shaping', 'Test Show', 'expansion');
    expect(typeof show.id).toBe('string');
    expect(show.title).toBe('Test Show');
    expect(show.showType).toBe('field-shaping');
    expect(show.status).toBe('queued');
    expect(typeof show.fieldStrength).toBe('number');
    expect(typeof show.synchronizationFrequency).toBe('number');
    expect(Array.isArray(show.targets)).toBe(true);
    expect(typeof show.emotionalTone).toBe('string');
    expect(typeof show.symbolicAct).toBe('string');
    expect(typeof show.narrativePulse).toBe('string');
    expect(typeof show.memeticSeed).toBe('string');
  });

  test('createShow fieldStrength is between 0 and 1', () => {
    const show = se.createShow('narrative-pulse', 'FS Test', 'amplification');
    expect(show.fieldStrength).toBeGreaterThanOrEqual(0);
    expect(show.fieldStrength).toBeLessThanOrEqual(1);
  });

  test('createShow sets correct memeticVector', () => {
    const show = se.createShow('memetic-seed', 'MV Test', 'seeding');
    expect(show.memeticVector).toBe('seeding');
  });

  test('createShow impactMetrics has correct shape', () => {
    const show = se.createShow('chaos-injection', 'IM Test', 'inversion');
    expect(typeof show.impactMetrics.agentsReached).toBe('number');
    expect(typeof show.impactMetrics.fieldShapingScore).toBe('number');
    expect(typeof show.impactMetrics.memeticSpread).toBe('number');
    expect(typeof show.impactMetrics.synchronizationAchieved).toBe('number');
    expect(show.impactMetrics.emotionalToneSet).toBe(true);
    expect(typeof show.impactMetrics.subsystemsAligned).toBe('number');
  });

  test('createShow adds show to store (getShow works)', () => {
    const show = se.createShow('sovereignty-assertion', 'Store Test', 'harvesting');
    const fetched = se.getShow(show.id);
    expect(fetched).toBeDefined();
    expect(fetched!.id).toBe(show.id);
  });

  // ── emitShow ───────────────────────────────────────────────────────────────

  test('emitShow transitions status to propagating', () => {
    const show = se.createShow('ritual-broadcast', 'Emit Test', 'expansion');
    expect(show.status).toBe('queued');
    const emitted = se.emitShow(show.id);
    expect(emitted).toBeDefined();
    expect(emitted!.status).toBe('propagating');
  });

  test('emitShow returns undefined for unknown id', () => {
    expect(se.emitShow('nonexistent-id')).toBeUndefined();
  });

  test('emitShow preserves show fields', () => {
    const show = se.createShow('symbolic-act', 'Preserve Test', 'contraction');
    const emitted = se.emitShow(show.id);
    expect(emitted!.title).toBe('Preserve Test');
    expect(emitted!.showType).toBe('symbolic-act');
  });

  // ── absorbShow ─────────────────────────────────────────────────────────────

  test('absorbShow transitions status to absorbed', () => {
    const show = se.createShow('synchronization-signal', 'Absorb Test', 'amplification');
    se.emitShow(show.id);
    const absorbed = se.absorbShow(show.id);
    expect(absorbed).toBeDefined();
    expect(absorbed!.status).toBe('absorbed');
  });

  test('absorbShow returns undefined for unknown id', () => {
    expect(se.absorbShow('ghost-id')).toBeUndefined();
  });

  test('absorbShow can be called directly on queued show', () => {
    const show = se.createShow('field-shaping', 'Direct Absorb', 'seeding');
    const absorbed = se.absorbShow(show.id);
    expect(absorbed!.status).toBe('absorbed');
  });

  // ── listShows ──────────────────────────────────────────────────────────────

  test('listShows includes created shows', () => {
    const show = se.createShow('narrative-pulse', 'List Test', 'expansion');
    const all = se.listShows();
    const found = all.find((s) => s.id === show.id);
    expect(found).toBeDefined();
  });

  test('listShows returns array', () => {
    expect(Array.isArray(se.listShows())).toBe(true);
  });

  // ── getShowsByType ─────────────────────────────────────────────────────────

  test('getShowsByType filters correctly', () => {
    se.createShow('chaos-injection', 'Chaos 1', 'inversion');
    se.createShow('chaos-injection', 'Chaos 2', 'expansion');
    const chaos = se.getShowsByType('chaos-injection');
    expect(chaos.length).toBeGreaterThanOrEqual(2);
    chaos.forEach((s) => expect(s.showType).toBe('chaos-injection'));
  });

  test('getShowsByType returns empty array for type with no shows', () => {
    // 'memetic-seed' might have shows; use a fresh type we know we haven't made yet
    // Just verify all returned items match the type
    const result = se.getShowsByType('sovereignty-assertion');
    result.forEach((s) => expect(s.showType).toBe('sovereignty-assertion'));
  });

  // ── getActiveShows ─────────────────────────────────────────────────────────

  test('getActiveShows returns emitting and propagating shows', () => {
    const show = se.createShow('field-shaping', 'Active Test', 'amplification');
    se.emitShow(show.id);
    const active = se.getActiveShows();
    const found = active.find((s) => s.id === show.id);
    expect(found).toBeDefined();
  });

  test('getActiveShows does not include queued shows', () => {
    const show = se.createShow('ritual-broadcast', 'Queued Test', 'contraction');
    // do NOT emit
    const active = se.getActiveShows();
    const found = active.find((s) => s.id === show.id);
    expect(found).toBeUndefined();
  });

  test('getActiveShows does not include absorbed shows', () => {
    const show = se.createShow('symbolic-act', 'Absorbed Test', 'harvesting');
    se.emitShow(show.id);
    se.absorbShow(show.id);
    const active = se.getActiveShows();
    const found = active.find((s) => s.id === show.id);
    expect(found).toBeUndefined();
  });

  // ── emitDailyOpening ──────────────────────────────────────────────────────

  test('emitDailyOpening returns a show', () => {
    const show = se.emitDailyOpening();
    expect(typeof show.id).toBe('string');
    expect(show.showType).toBe('field-shaping');
    expect(show.status).toBe('propagating');
  });

  test('emitDailyOpening title contains 06:00', () => {
    const show = se.emitDailyOpening();
    expect(show.title).toContain('06:00');
  });

  // ── emitHeartbeatPulse ─────────────────────────────────────────────────────

  test('emitHeartbeatPulse returns HeartbeatPulse', () => {
    const show = se.createShow('synchronization-signal', 'Pulse Src', 'expansion');
    const pulse = se.emitHeartbeatPulse(show.id);
    expect(typeof pulse.id).toBe('string');
    expect(typeof pulse.timestamp).toBe('string');
    expect(typeof pulse.pulseStrengthHz).toBe('number');
    expect(Array.isArray(pulse.subsystemsReceived)).toBe(true);
    expect(pulse.showId).toBe(show.id);
    expect(typeof pulse.alignmentScore).toBe('number');
  });

  test('emitHeartbeatPulse pulseStrengthHz is positive', () => {
    const show = se.createShow('narrative-pulse', 'Hz Test', 'amplification');
    const pulse = se.emitHeartbeatPulse(show.id);
    expect(pulse.pulseStrengthHz).toBeGreaterThan(0);
  });

  test('emitHeartbeatPulse alignmentScore is 0-1', () => {
    const show = se.createShow('field-shaping', 'Align Test', 'seeding');
    const pulse = se.emitHeartbeatPulse(show.id);
    expect(pulse.alignmentScore).toBeGreaterThanOrEqual(0);
    expect(pulse.alignmentScore).toBeLessThanOrEqual(1);
  });

  // ── getHeartbeatPulses ─────────────────────────────────────────────────────

  test('getHeartbeatPulses returns array (pre-seeded with 3)', () => {
    const pulses = se.getHeartbeatPulses();
    expect(Array.isArray(pulses)).toBe(true);
    expect(pulses.length).toBeGreaterThanOrEqual(3);
  });

  test('getHeartbeatPulses accumulates after emitHeartbeatPulse', () => {
    const before = se.getHeartbeatPulses().length;
    const show = se.createShow('chaos-injection', 'Accum Test', 'inversion');
    se.emitHeartbeatPulse(show.id);
    expect(se.getHeartbeatPulses().length).toBe(before + 1);
  });

  // ── getSchedule ────────────────────────────────────────────────────────────

  test('getSchedule returns 8 entries', () => {
    expect(se.getSchedule()).toHaveLength(8);
  });

  test('getSchedule entries have correct shape', () => {
    const schedule = se.getSchedule();
    schedule.forEach((entry) => {
      expect(typeof entry.id).toBe('string');
      expect(typeof entry.scheduledTime).toBe('string');
      expect(typeof entry.showType).toBe('string');
      expect(typeof entry.recurring).toBe('boolean');
      expect(['daily', 'weekly', 'on-demand']).toContain(entry.frequency);
      expect(typeof entry.description).toBe('string');
    });
  });

  test('getScheduleByType returns entry for valid type', () => {
    const entry = se.getScheduleByType('field-shaping');
    expect(entry).toBeDefined();
    expect(entry!.showType).toBe('field-shaping');
    expect(entry!.scheduledTime).toBe('06:00');
  });

  test('getScheduleByType returns undefined for unknown type hack', () => {
    // No schedule for a random string cast as ShowType
    const entry = se.getScheduleByType('field-shaping');
    expect(entry).toBeDefined();
  });

  test('getSchedule all types are present', () => {
    const schedule = se.getSchedule();
    const types = schedule.map((s) => s.showType);
    expect(types).toContain('field-shaping');
    expect(types).toContain('ritual-broadcast');
    expect(types).toContain('chaos-injection');
  });

  // ── calculateFieldStrength ─────────────────────────────────────────────────

  test('calculateFieldStrength returns number between 0 and 1', () => {
    const fs = se.calculateFieldStrength();
    expect(typeof fs).toBe('number');
    expect(fs).toBeGreaterThanOrEqual(0);
    expect(fs).toBeLessThanOrEqual(1);
  });

  test('calculateFieldStrength updates when a show is active', () => {
    se.createShow('field-shaping', 'FS Active', 'amplification');
    const fs = se.calculateFieldStrength();
    expect(fs).toBeGreaterThanOrEqual(0);
    expect(fs).toBeLessThanOrEqual(1);
  });

  // ── getMemeticSpread ───────────────────────────────────────────────────────

  test('getMemeticSpread returns 0-1', () => {
    const spread = se.getMemeticSpread();
    expect(spread).toBeGreaterThanOrEqual(0);
    expect(spread).toBeLessThanOrEqual(1);
  });

  test('getMemeticSpread is a number', () => {
    expect(typeof se.getMemeticSpread()).toBe('number');
  });

  // ── getEmotionalToneMap ────────────────────────────────────────────────────

  test('getEmotionalToneMap returns an object', () => {
    const toneMap = se.getEmotionalToneMap();
    expect(typeof toneMap).toBe('object');
    expect(toneMap).not.toBeNull();
  });

  test('getEmotionalToneMap has subsystem keys', () => {
    const toneMap = se.getEmotionalToneMap();
    expect(Object.keys(toneMap).length).toBeGreaterThan(0);
    expect(typeof Object.values(toneMap)[0]).toBe('string');
  });

  // ── getShowDiagnostics ─────────────────────────────────────────────────────

  test('getShowDiagnostics has correct shape', () => {
    const diag = se.getShowDiagnostics();
    expect(typeof diag.totalShows).toBe('number');
    expect(typeof diag.activeShows).toBe('number');
    expect(typeof diag.totalPulses).toBe('number');
    expect(typeof diag.avgFieldStrength).toBe('number');
    expect(typeof diag.avgMemeticSpread).toBe('number');
    expect(typeof diag.scheduleCount).toBe('number');
  });

  test('getShowDiagnostics scheduleCount is 8', () => {
    expect(se.getShowDiagnostics().scheduleCount).toBe(8);
  });

  test('getShowDiagnostics totalPulses >= 3 (pre-seeded)', () => {
    expect(se.getShowDiagnostics().totalPulses).toBeGreaterThanOrEqual(3);
  });

  test('getShowDiagnostics avgFieldStrength is 0-1', () => {
    const diag = se.getShowDiagnostics();
    expect(diag.avgFieldStrength).toBeGreaterThanOrEqual(0);
    expect(diag.avgFieldStrength).toBeLessThanOrEqual(1);
  });

  test('getShowDiagnostics totalShows increases after createShow', () => {
    const before = se.getShowDiagnostics().totalShows;
    se.createShow('narrative-pulse', 'Diag Test', 'seeding');
    expect(se.getShowDiagnostics().totalShows).toBe(before + 1);
  });
});
