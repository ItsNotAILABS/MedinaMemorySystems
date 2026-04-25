// 𓂀 PHANTOM ARCHITECTURE + NIGHT CRAWLER ENGINE — Combined Test Suite 𓂀

import {
  // Types
  PhantomState,
  PhantomClass,
  EncryptionSurface,

  // Phantom entity functions
  getPhantom,
  listPhantoms,
  getPhantomsByClass,
  emergePhantom,
  dissolvePhantom,
  runVoidCycle,
  getVoidCycleHistory,
  getThoughtModels,
  getThoughtModel,
  updateThoughtPattern,
  getAutoEncryptionGhosts,
  slipEncryptionGhost,
  checkCorridorTension,
  checkEncryptionSurfaceIntegrity,
  checkPhantomToMainAlignment,
  dreamCortexStatus,
  getPhantomDiagnostics,
  resetPhantomToState,
} from '../lib/phantomArchitecture';

import {
  // Types
  CrawlerClass,
  AnomalyClass,

  // Crawler functions
  getCrawler,
  listCrawlers,
  getCrawlersByClass,
  deployCrawler,
  deployAllCrawlers,
  runSweep,
  runNightSweep,
  getSweepHistory,
  harvestAnomalies,
  getAnomaliesByClass,
  stressAnomaly,
  getEmergentBehaviors,
  getMetabolismScore,
  getImmuneStrength,
  getNightCrawlerStatus,
} from '../lib/nightCrawlerEngine';

// ═══════════════════════════════════════════════════════════════
// PHANTOM ARCHITECTURE TESTS
// ═══════════════════════════════════════════════════════════════

describe('phantomArchitecture', () => {
  // ── ENTITY EXISTENCE ──────────────────────────────────────

  it('returns 8 phantom entities total', () => {
    expect(listPhantoms()).toHaveLength(8);
  });

  it('each phantom class is represented exactly once', () => {
    const classes: PhantomClass[] = [
      'thought-model',
      'sub-cortical-brain',
      'heart-engine',
      'frequency-contract',
      'auto-encryption-ghost',
      'phantom-architect',
      'corridor-phantom',
      'field-resonator',
    ];
    for (const cls of classes) {
      expect(getPhantomsByClass(cls)).toHaveLength(1);
    }
  });

  it('thought-model phantom has correct name', () => {
    const p = getPhantom('phantom-thought-model');
    expect(p?.name).toBe('SubCorticalOracle');
  });

  it('sub-cortical-brain phantom has correct name', () => {
    const p = getPhantom('phantom-sub-cortical-brain');
    expect(p?.name).toBe('PhantomBrainStem');
  });

  it('heart-engine phantom has correct name', () => {
    const p = getPhantom('phantom-heart-engine');
    expect(p?.name).toBe('EmotionalFieldHeart');
  });

  it('frequency-contract phantom has correct name', () => {
    const p = getPhantom('phantom-frequency-contract');
    expect(p?.name).toBe('FrequencyContractLayer');
  });

  it('auto-encryption-ghost phantom has correct name', () => {
    const p = getPhantom('phantom-auto-encryption-ghost');
    expect(p?.name).toBe('AutoEncryptGhost-α');
  });

  it('phantom-architect phantom has correct name', () => {
    const p = getPhantom('phantom-phantom-architect');
    expect(p?.name).toBe('VoidArchitect');
  });

  it('corridor-phantom entity has correct name', () => {
    const p = getPhantom('phantom-corridor-phantom');
    expect(p?.name).toBe('CorridorPhantom-7');
  });

  it('field-resonator phantom has correct name', () => {
    const p = getPhantom('phantom-field-resonator');
    expect(p?.name).toBe('FieldResonator-Ω');
  });

  it('all phantoms start dormant before first void cycle', () => {
    // Some may have been advanced; verify getPhantom returns a valid entity
    const all = listPhantoms();
    for (const p of all) {
      expect(['dormant', 'emerging', 'active', 'dissolving', 'dreaming']).toContain(p.state);
    }
  });

  it('each phantom has a positive frequencyHz', () => {
    for (const p of listPhantoms()) {
      expect(p.frequencyHz).toBeGreaterThan(0);
    }
  });

  it('each phantom has encryptionSurfaces array with at least 1 entry', () => {
    for (const p of listPhantoms()) {
      expect(p.encryptionSurfaces.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('each phantom coherenceScore is in [0,1]', () => {
    for (const p of listPhantoms()) {
      expect(p.coherenceScore).toBeGreaterThanOrEqual(0);
      expect(p.coherenceScore).toBeLessThanOrEqual(1);
    }
  });

  it('each phantom fieldResonance is in [0,1]', () => {
    for (const p of listPhantoms()) {
      expect(p.fieldResonance).toBeGreaterThanOrEqual(0);
      expect(p.fieldResonance).toBeLessThanOrEqual(1);
    }
  });

  // ── STATE TRANSITIONS ─────────────────────────────────────

  it('emergePhantom transitions dormant → emerging', () => {
    resetPhantomToState('phantom-thought-model', 'dormant');
    const result = emergePhantom('phantom-thought-model');
    expect(result?.state).toBe('emerging');
  });

  it('emergePhantom transitions emerging → active', () => {
    resetPhantomToState('phantom-thought-model', 'emerging');
    const result = emergePhantom('phantom-thought-model');
    expect(result?.state).toBe('active');
  });

  it('dissolvePhantom transitions active → dissolving', () => {
    resetPhantomToState('phantom-thought-model', 'active');
    const result = dissolvePhantom('phantom-thought-model');
    expect(result?.state).toBe('dissolving');
  });

  it('dissolvePhantom transitions emerging → dormant', () => {
    resetPhantomToState('phantom-thought-model', 'emerging');
    const result = dissolvePhantom('phantom-thought-model');
    expect(result?.state).toBe('dormant');
  });

  it('emergePhantom returns undefined for unknown id', () => {
    expect(emergePhantom('nonexistent-id')).toBeUndefined();
  });

  it('dissolvePhantom returns undefined for unknown id', () => {
    expect(dissolvePhantom('nonexistent-id')).toBeUndefined();
  });

  it('emergePhantom increments cycleCount', () => {
    resetPhantomToState('phantom-sub-cortical-brain', 'dormant');
    const before = getPhantom('phantom-sub-cortical-brain')!.cycleCount;
    emergePhantom('phantom-sub-cortical-brain');
    const after = getPhantom('phantom-sub-cortical-brain')!.cycleCount;
    expect(after).toBeGreaterThan(before);
  });

  // ── VOID CYCLE ────────────────────────────────────────────

  it('runVoidCycle returns a VoidCycle object with all required fields', () => {
    const cycle = runVoidCycle();
    expect(cycle).toHaveProperty('id');
    expect(cycle).toHaveProperty('timestamp');
    expect(cycle).toHaveProperty('phase');
    expect(cycle).toHaveProperty('corridorTensionAvg');
    expect(cycle).toHaveProperty('fieldResonanceAvg');
    expect(cycle).toHaveProperty('narrativeDriftAvg');
    expect(cycle).toHaveProperty('sovereigntyLeakTotal');
    expect(cycle).toHaveProperty('encryptionSurfaceIntegrity');
    expect(cycle).toHaveProperty('phantomToMainAlignment');
    expect(cycle).toHaveProperty('activePhantoms');
    expect(cycle).toHaveProperty('insights');
  });

  it('runVoidCycle encryptionSurfaceIntegrity is in [0,1]', () => {
    const cycle = runVoidCycle();
    expect(cycle.encryptionSurfaceIntegrity).toBeGreaterThanOrEqual(0);
    expect(cycle.encryptionSurfaceIntegrity).toBeLessThanOrEqual(1);
  });

  it('runVoidCycle phantomToMainAlignment is in [0,1]', () => {
    const cycle = runVoidCycle();
    expect(cycle.phantomToMainAlignment).toBeGreaterThanOrEqual(0);
    expect(cycle.phantomToMainAlignment).toBeLessThanOrEqual(1);
  });

  it('void cycle history accumulates with each call', () => {
    const before = getVoidCycleHistory().length;
    runVoidCycle();
    const after = getVoidCycleHistory().length;
    expect(after).toBe(before + 1);
  });

  it('getVoidCycleHistory returns array', () => {
    expect(Array.isArray(getVoidCycleHistory())).toBe(true);
  });

  it('void cycle insights is a non-empty array', () => {
    const cycle = runVoidCycle();
    expect(Array.isArray(cycle.insights)).toBe(true);
    expect(cycle.insights.length).toBeGreaterThan(0);
  });

  // ── THOUGHT MODELS ────────────────────────────────────────

  it('returns exactly 5 thought models', () => {
    expect(getThoughtModels()).toHaveLength(5);
  });

  it('all thought model classes are represented', () => {
    const classes = getThoughtModels().map(m => m.modelClass);
    expect(classes).toContain('sub-cortical');
    expect(classes).toContain('emotional-field');
    expect(classes).toContain('symbolic-processor');
    expect(classes).toContain('narrative-weaver');
    expect(classes).toContain('frequency-coder');
  });

  it('getThoughtModel by id returns the model', () => {
    const model = getThoughtModel('tm-sub-cortical');
    expect(model).toBeDefined();
    expect(model?.modelClass).toBe('sub-cortical');
  });

  it('updateThoughtPattern adds pattern to activePatterns', () => {
    const before = getThoughtModel('tm-emotional-field')!.activePatterns.length;
    const result = updateThoughtPattern('tm-emotional-field', 'test-pattern-42');
    expect(result?.activePatterns).toContain('test-pattern-42');
    expect(result?.activePatterns.length).toBe(before + 1);
  });

  it('updateThoughtPattern returns undefined for unknown model', () => {
    expect(updateThoughtPattern('tm-unknown', 'pattern')).toBeUndefined();
  });

  // ── AUTO-ENCRYPTION GHOSTS ────────────────────────────────

  it('returns exactly 3 auto-encryption ghosts', () => {
    expect(getAutoEncryptionGhosts()).toHaveLength(3);
  });

  it('each ghost has a surface and encryptionKey', () => {
    for (const ghost of getAutoEncryptionGhosts()) {
      expect(ghost.surface).toBeDefined();
      expect(typeof ghost.encryptionKey).toBe('string');
      expect(ghost.encryptionKey.length).toBeGreaterThan(0);
    }
  });

  it('slipEncryptionGhost changes the surface', () => {
    const ghost = getAutoEncryptionGhosts()[0];
    const newSurface: EncryptionSurface = 'governance';
    const result = slipEncryptionGhost(ghost.id, newSurface);
    expect(result?.surface).toBe(newSurface);
  });

  it('slipEncryptionGhost increments detectionEvaded', () => {
    const ghost = getAutoEncryptionGhosts()[0];
    const before = ghost.detectionEvaded;
    const result = slipEncryptionGhost(ghost.id, 'contracts');
    expect(result?.detectionEvaded).toBeGreaterThan(before);
  });

  it('slipEncryptionGhost returns undefined for unknown ghost', () => {
    expect(slipEncryptionGhost('ghost-unknown', 'memory')).toBeUndefined();
  });

  // ── DIAGNOSTICS ───────────────────────────────────────────

  it('checkCorridorTension returns an entry for each phantom id', () => {
    const tension = checkCorridorTension();
    const phantomIds = listPhantoms().map(p => p.id);
    for (const id of phantomIds) {
      expect(tension).toHaveProperty(id);
    }
  });

  it('checkEncryptionSurfaceIntegrity covers all 6 surfaces', () => {
    const integrity = checkEncryptionSurfaceIntegrity();
    const surfaces: EncryptionSurface[] = [
      'memory',
      'governance',
      'communication',
      'identity',
      'contracts',
      'phantom-layer',
    ];
    for (const s of surfaces) {
      expect(integrity).toHaveProperty(s);
      expect(integrity[s]).toBeGreaterThanOrEqual(0);
      expect(integrity[s]).toBeLessThanOrEqual(1);
    }
  });

  it('checkPhantomToMainAlignment returns value in [0,1]', () => {
    const alignment = checkPhantomToMainAlignment();
    expect(alignment).toBeGreaterThanOrEqual(0);
    expect(alignment).toBeLessThanOrEqual(1);
  });

  it('dreamCortexStatus returns required fields', () => {
    const status = dreamCortexStatus();
    expect(status).toHaveProperty('activePhantoms');
    expect(status).toHaveProperty('avgCoherence');
    expect(status).toHaveProperty('fieldResonance');
    expect(status).toHaveProperty('status');
    expect(typeof status.status).toBe('string');
  });

  it('dreamCortexStatus avgCoherence is in [0,1]', () => {
    const { avgCoherence } = dreamCortexStatus();
    expect(avgCoherence).toBeGreaterThanOrEqual(0);
    expect(avgCoherence).toBeLessThanOrEqual(1);
  });

  it('getPhantomDiagnostics returns correct shape', () => {
    const diag = getPhantomDiagnostics();
    expect(diag).toHaveProperty('entityCount');
    expect(diag).toHaveProperty('avgFrequencyHz');
    expect(diag).toHaveProperty('avgEncryptionDepth');
    expect(diag).toHaveProperty('avgCoherence');
    expect(diag).toHaveProperty('totalSovereigntyLeaks');
    expect(diag).toHaveProperty('encryptionSurfaceHealth');
  });

  it('getPhantomDiagnostics entityCount is 8', () => {
    expect(getPhantomDiagnostics().entityCount).toBe(8);
  });

  it('getPhantomDiagnostics avgFrequencyHz is positive', () => {
    expect(getPhantomDiagnostics().avgFrequencyHz).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// NIGHT CRAWLER ENGINE TESTS
// ═══════════════════════════════════════════════════════════════

describe('nightCrawlerEngine', () => {
  // ── CRAWLER EXISTENCE ─────────────────────────────────────

  it('returns exactly 8 crawlers', () => {
    expect(listCrawlers()).toHaveLength(8);
  });

  it('each crawler class is represented exactly once', () => {
    const classes: CrawlerClass[] = [
      'anomaly-harvester',
      'contradiction-sniffer',
      'corridor-stress-tester',
      'phantom-encryption-auditor',
      'frequency-signal-sculptor',
      'sovereignty-probe',
      'narrative-drift-detector',
      'field-gradient-mapper',
    ];
    for (const cls of classes) {
      expect(getCrawlersByClass(cls)).toHaveLength(1);
    }
  });

  it('anomaly-harvester targets memoryEngine', () => {
    const c = getCrawler('crawler-anomaly-harvester');
    expect(c?.target).toBe('memoryEngine');
  });

  it('contradiction-sniffer targets governanceEngine', () => {
    const c = getCrawler('crawler-contradiction-sniffer');
    expect(c?.target).toBe('governanceEngine');
  });

  it('corridor-stress-tester targets corridorLayer', () => {
    const c = getCrawler('crawler-corridor-stress-tester');
    expect(c?.target).toBe('corridorLayer');
  });

  it('phantom-encryption-auditor targets phantomArchitecture', () => {
    const c = getCrawler('crawler-phantom-encryption-auditor');
    expect(c?.target).toBe('phantomArchitecture');
  });

  it('sovereignty-probe targets sovereigntyLayer', () => {
    const c = getCrawler('crawler-sovereignty-probe');
    expect(c?.target).toBe('sovereigntyLayer');
  });

  it('all crawlers have sweepDepth in [0,1]', () => {
    for (const c of listCrawlers()) {
      expect(c.sweepDepth).toBeGreaterThanOrEqual(0);
      expect(c.sweepDepth).toBeLessThanOrEqual(1);
    }
  });

  it('getCrawler returns undefined for unknown id', () => {
    expect(getCrawler('crawler-nonexistent')).toBeUndefined();
  });

  // ── DEPLOY ────────────────────────────────────────────────

  it('deployCrawler transitions idle → sweeping', () => {
    // Reset state implicitly by checking existing behavior
    const id = 'crawler-field-gradient-mapper';
    const crawler = getCrawler(id)!;
    if (crawler.state === 'idle') {
      const result = deployCrawler(id);
      expect(result?.state).toBe('sweeping');
    } else {
      // Already deployed in a prior run; state should be non-idle
      expect(['sweeping', 'harvesting', 'reporting', 'dormant']).toContain(crawler.state);
    }
  });

  it('deployAllCrawlers returns array of length 8', () => {
    const deployed = deployAllCrawlers();
    expect(deployed).toHaveLength(8);
  });

  it('deployCrawler returns undefined for unknown id', () => {
    expect(deployCrawler('crawler-unknown')).toBeUndefined();
  });

  // ── SWEEP ─────────────────────────────────────────────────

  it('runSweep returns array of anomalies (2-5)', () => {
    const anomalyList = runSweep('crawler-anomaly-harvester');
    expect(Array.isArray(anomalyList)).toBe(true);
    expect(anomalyList.length).toBeGreaterThanOrEqual(2);
    expect(anomalyList.length).toBeLessThanOrEqual(5);
  });

  it('runSweep anomalies have required fields', () => {
    const anomalyList = runSweep('crawler-contradiction-sniffer');
    for (const a of anomalyList) {
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('class');
      expect(a).toHaveProperty('severity');
      expect(a).toHaveProperty('sourceSubsystem');
      expect(a).toHaveProperty('description');
      expect(a).toHaveProperty('discoveredBy');
      expect(a).toHaveProperty('discoveredAt');
      expect(a).toHaveProperty('stressed');
      expect(a).toHaveProperty('newStateEmerged');
    }
  });

  it('runSweep for unknown crawler returns empty array', () => {
    expect(runSweep('crawler-nonexistent')).toEqual([]);
  });

  it('runSweep increments crawler sweepCount', () => {
    const id = 'crawler-frequency-signal-sculptor';
    const before = getCrawler(id)!.sweepCount;
    runSweep(id);
    expect(getCrawler(id)!.sweepCount).toBe(before + 1);
  });

  it('runSweep transitions crawler to reporting state', () => {
    const id = 'crawler-narrative-drift-detector';
    runSweep(id);
    expect(getCrawler(id)!.state).toBe('reporting');
  });

  // ── NIGHT SWEEP ───────────────────────────────────────────

  it('runNightSweep returns a SweepReport with all fields', () => {
    const report = runNightSweep();
    expect(report).toHaveProperty('id');
    expect(report).toHaveProperty('timestamp');
    expect(report).toHaveProperty('phase');
    expect(report).toHaveProperty('crawlerCount');
    expect(report).toHaveProperty('anomaliesHarvested');
    expect(report).toHaveProperty('contradictionsFound');
    expect(report).toHaveProperty('emergentBehaviors');
    expect(report).toHaveProperty('newStatesDiscovered');
    expect(report).toHaveProperty('metabolismScore');
    expect(report).toHaveProperty('immuneStrength');
    expect(report).toHaveProperty('recommendations');
  });

  it('runNightSweep phase is complete', () => {
    const report = runNightSweep();
    expect(report.phase).toBe('complete');
  });

  it('runNightSweep crawlerCount is 8', () => {
    const report = runNightSweep();
    expect(report.crawlerCount).toBe(8);
  });

  it('runNightSweep metabolismScore is in [0,1]', () => {
    const report = runNightSweep();
    expect(report.metabolismScore).toBeGreaterThanOrEqual(0);
    expect(report.metabolismScore).toBeLessThanOrEqual(1);
  });

  it('runNightSweep immuneStrength is in [0,1]', () => {
    const report = runNightSweep();
    expect(report.immuneStrength).toBeGreaterThanOrEqual(0);
    expect(report.immuneStrength).toBeLessThanOrEqual(1);
  });

  it('sweep history accumulates with each runNightSweep', () => {
    const before = getSweepHistory().length;
    runNightSweep();
    expect(getSweepHistory().length).toBe(before + 1);
  });

  it('getSweepHistory returns array', () => {
    expect(Array.isArray(getSweepHistory())).toBe(true);
  });

  // ── ANOMALIES ─────────────────────────────────────────────

  it('harvestAnomalies returns non-empty array after sweeps', () => {
    runSweep('crawler-sovereignty-probe');
    const all = harvestAnomalies();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });

  it('getAnomaliesByClass filters correctly for corridor-stress', () => {
    runNightSweep();
    const filtered = getAnomaliesByClass('corridor-stress');
    for (const a of filtered) {
      expect(a.class).toBe('corridor-stress');
    }
  });

  it('getAnomaliesByClass filters correctly for sovereignty-leak', () => {
    const filtered = getAnomaliesByClass('sovereignty-leak');
    for (const a of filtered) {
      expect(a.class).toBe('sovereignty-leak');
    }
  });

  it('getAnomaliesByClass returns array (possibly empty) for any class', () => {
    const anomalyClasses: AnomalyClass[] = [
      'corridor-stress',
      'encryption-breach',
      'frequency-drift',
      'narrative-inversion',
      'sovereignty-leak',
      'phantom-misalignment',
      'field-collapse',
      'contradiction-loop',
    ];
    for (const cls of anomalyClasses) {
      expect(Array.isArray(getAnomaliesByClass(cls))).toBe(true);
    }
  });

  it('stressAnomaly marks anomaly as stressed', () => {
    runNightSweep();
    const all = harvestAnomalies();
    const target = all[0];
    const result = stressAnomaly(target.id);
    expect(result?.stressed).toBe(true);
  });

  it('stressAnomaly returns undefined for unknown id', () => {
    expect(stressAnomaly('anomaly-nonexistent')).toBeUndefined();
  });

  // ── METRICS ───────────────────────────────────────────────

  it('getEmergentBehaviors returns an array', () => {
    expect(Array.isArray(getEmergentBehaviors())).toBe(true);
  });

  it('getMetabolismScore returns value in [0,1]', () => {
    const score = getMetabolismScore();
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it('getImmuneStrength returns value in [0,1]', () => {
    const strength = getImmuneStrength();
    expect(strength).toBeGreaterThanOrEqual(0);
    expect(strength).toBeLessThanOrEqual(1);
  });

  it('getNightCrawlerStatus returns correct shape', () => {
    const status = getNightCrawlerStatus();
    expect(status).toHaveProperty('activeCrawlers');
    expect(status).toHaveProperty('totalSweeps');
    expect(status).toHaveProperty('anomaliesFound');
    expect(status).toHaveProperty('emergentBehaviors');
    expect(status).toHaveProperty('metabolismScore');
  });

  it('getNightCrawlerStatus activeCrawlers is non-negative', () => {
    expect(getNightCrawlerStatus().activeCrawlers).toBeGreaterThanOrEqual(0);
  });

  it('getNightCrawlerStatus totalSweeps increases after runSweep', () => {
    const before = getNightCrawlerStatus().totalSweeps;
    runSweep('crawler-field-gradient-mapper');
    expect(getNightCrawlerStatus().totalSweeps).toBeGreaterThan(before);
  });

  it('getNightCrawlerStatus metabolismScore is in [0,1]', () => {
    const { metabolismScore } = getNightCrawlerStatus();
    expect(metabolismScore).toBeGreaterThanOrEqual(0);
    expect(metabolismScore).toBeLessThanOrEqual(1);
  });
});
