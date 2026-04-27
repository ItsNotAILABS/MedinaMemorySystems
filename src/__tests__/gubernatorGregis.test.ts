/**
 * Test suite for gubernatorGregis.ts — GUBERNATOR GREGIS (ASI-014)
 * The First Autonomous Enterprise Cognition Agent
 * ~70 tests covering all types, functions, state transitions, and governance cycles.
 */

import {
  // Types
  type GubernatorMode,
  type BuildingClass,
  type DecisionType,
  type DirectiveTarget,
  type DecisionPriority,
  type FieldEntityHealth,
  type Building,
  type FieldAgent,
  type FieldWorkflow,
  type TokenField,
  type EnterpriseField,
  type CognitionCycle,
  type GubernatorDecision,
  type GubernatorDirective,
  type GubernatorLaw,
  type CognitivePattern,
  type GubernatorState,

  // State
  getGubernatorState,

  // Field API
  getBuildings,
  getBuilding,
  getBuildingsByClass,
  inspectBuilding,
  getFieldAgents,
  getFieldAgent,
  getAgentsBySubsystem,
  issueAgentDirective,
  getFieldWorkflows,
  getWorkflowsByStage,
  getTokenField,
  rebalanceTokens,
  scanEnterpriseField,
  getFieldScanHistory,
  getLatestFieldScan,

  // Cognition API
  runCognitionCycle,
  getCognitionCycles,
  getCognitiveLoad,

  // Decision API
  emitDecision,
  executeDecision,
  getDecisions,
  getPendingDecisions,
  getDecisionsByType,
  getDecisionsByPriority,

  // Governance API
  getLaws,
  getActiveLaws,
  getLawsByDomain,
  issueLaw,
  repealLaw,
  getDirectives,
  acknowledgeDirective,

  // Cognitive Memory API
  getCognitivePatterns,
  getCognitivePattern,
  learnPattern,
  encodePatternIntoLaw,
  getEncodedPatterns,

  // Full Governance Cycle
  runGovernanceCycle,

  // Diagnostics
  getGubernatorDiagnostics,
  assertSovereignty,
  getGovernorManifest,
} from '../lib/gubernatorGregis';

// ═══════════════════════════════════════════════════════════════════════════════
// §1  GOVERNOR STATE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Governor State', () => {
  it('getGubernatorState returns core identity fields', () => {
    const state = getGubernatorState();
    expect(state.id).toBe('ASI-014');
    expect(state.name).toBe('Gubernator Gregis');
    expect(state.designation).toBe('ASI-014');
    expect(state.online).toBe(true);
  });

  it('governor has high autonomy index', () => {
    const state = getGubernatorState();
    expect(state.autonomyIndex).toBeGreaterThan(0.5);
    expect(state.autonomyIndex).toBeLessThanOrEqual(1);
  });

  it('governor starts in field-scanning or governance mode', () => {
    const state = getGubernatorState();
    const validModes: GubernatorMode[] = [
      'field-scanning', 'cognition-running', 'deciding',
      'issuing-directive', 'governing', 'pattern-recognizing',
      'emergence-tracking', 'law-encoding', 'sovereignty-asserting', 'agent-commanding',
    ];
    expect(validModes).toContain(state.mode);
  });

  it('governor uptime is a positive number', () => {
    const state = getGubernatorState();
    expect(state.uptime).toBeGreaterThanOrEqual(0);
  });

  it('fieldCoherenceBaseline and sovereigntyBaseline are 0-1', () => {
    const state = getGubernatorState();
    expect(state.fieldCoherenceBaseline).toBeGreaterThan(0);
    expect(state.fieldCoherenceBaseline).toBeLessThanOrEqual(1);
    expect(state.sovereigntyBaseline).toBeGreaterThan(0);
    expect(state.sovereigntyBaseline).toBeLessThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §2  BUILDINGS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Buildings', () => {
  it('getBuildings returns 14 pre-seeded buildings', () => {
    expect(getBuildings().length).toBe(14);
  });

  it('each building has required fields', () => {
    for (const b of getBuildings()) {
      expect(b.id).toBeTruthy();
      expect(b.name).toBeTruthy();
      expect(b.class).toBeTruthy();
      expect(['optimal', 'stable', 'stressed', 'critical', 'unknown']).toContain(b.health);
      expect(b.load).toBeGreaterThanOrEqual(0);
      expect(b.load).toBeLessThanOrEqual(1);
      expect(b.activeAgents).toBeGreaterThanOrEqual(0);
      expect(b.corridors.length).toBeGreaterThan(0);
    }
  });

  it('getBuilding returns the correct building', () => {
    const b = getBuilding('bld-sovereign-core');
    expect(b).toBeDefined();
    expect(b!.class).toBe('sovereign-core');
  });

  it('getBuilding returns undefined for unknown id', () => {
    expect(getBuilding('nonexistent')).toBeUndefined();
  });

  it('getBuildingsByClass filters correctly', () => {
    const phantoms = getBuildingsByClass('phantom-layer');
    expect(phantoms.length).toBeGreaterThan(0);
    for (const b of phantoms) expect(b.class).toBe('phantom-layer');
  });

  it('inspectBuilding updates health and lastInspected', () => {
    const before = getBuilding('bld-builder-forge');
    expect(before).toBeDefined();
    const after = inspectBuilding('bld-builder-forge');
    expect(after).toBeDefined();
    expect(after!.lastInspected).toBeTruthy();
    expect(['optimal', 'stable', 'stressed', 'critical']).toContain(after!.health);
  });

  it('inspectBuilding returns undefined for unknown id', () => {
    expect(inspectBuilding('no-such-building')).toBeUndefined();
  });

  it('all 14 building classes are represented', () => {
    const classes = new Set(getBuildings().map(b => b.class));
    const expected: BuildingClass[] = [
      'sovereign-core', 'memory-temple', 'governance-hall', 'phantom-layer',
      'corridor-hub', 'token-vault', 'field-engine', 'ritual-chamber',
      'builder-forge', 'trickster-den', 'night-crawler-nest',
      'show-broadcast-tower', 'circadian-nexus', 'founder-seat',
    ];
    for (const c of expected) expect(classes).toContain(c);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §3  FIELD AGENTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Field Agents', () => {
  it('getFieldAgents returns 20 pre-seeded agents', () => {
    expect(getFieldAgents().length).toBe(20);
  });

  it('each agent has required fields', () => {
    for (const a of getFieldAgents()) {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(a.role).toBeTruthy();
      expect(a.subsystem).toBeTruthy();
      expect(a.taskLoad).toBeGreaterThanOrEqual(0);
      expect(a.taskLoad).toBeLessThanOrEqual(1);
      expect(a.autonomyScore).toBeGreaterThan(0);
    }
  });

  it('getFieldAgent retrieves by id', () => {
    const agents = getFieldAgents();
    const a = getFieldAgent(agents[0].id);
    expect(a).toBeDefined();
    expect(a!.id).toBe(agents[0].id);
  });

  it('getFieldAgent returns undefined for unknown id', () => {
    expect(getFieldAgent('ghost-agent')).toBeUndefined();
  });

  it('getAgentsBySubsystem filters correctly', () => {
    const crawlers = getAgentsBySubsystem('night-crawler-nest');
    expect(crawlers.length).toBeGreaterThan(0);
    for (const a of crawlers) expect(a.subsystem).toBe('night-crawler-nest');
  });

  it('issueAgentDirective attaches directive to agent', () => {
    const agents = getFieldAgents();
    const updated = issueAgentDirective(agents[0].id, 'boost-field-coherence');
    expect(updated).toBeDefined();
    expect(updated!.governorDirective).toBe('boost-field-coherence');
  });

  it('issueAgentDirective returns undefined for unknown agent', () => {
    expect(issueAgentDirective('ghost', 'test')).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §4  WORKFLOWS & TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Workflows', () => {
  it('getFieldWorkflows returns 10 pre-seeded workflows', () => {
    expect(getFieldWorkflows().length).toBe(10);
  });

  it('each workflow has required fields', () => {
    for (const w of getFieldWorkflows()) {
      expect(w.id).toBeTruthy();
      expect(w.name).toBeTruthy();
      expect(w.subsystem).toBeTruthy();
      expect(['queued', 'running', 'blocked', 'complete', 'failed']).toContain(w.stage);
      expect(w.tokenCost).toBeGreaterThan(0);
    }
  });

  it('getWorkflowsByStage filters running workflows', () => {
    const running = getWorkflowsByStage('running');
    for (const w of running) expect(w.stage).toBe('running');
  });

  it('getWorkflowsByStage filters complete workflows', () => {
    const complete = getWorkflowsByStage('complete');
    for (const w of complete) expect(w.stage).toBe('complete');
  });
});

describe('Token Field', () => {
  it('getTokenField returns correct structure', () => {
    const tf = getTokenField();
    expect(tf.totalSupply).toBe(1_000_000);
    expect(tf.circulating).toBeGreaterThan(0);
    expect(tf.locked).toBeGreaterThan(0);
    expect(tf.flowRate).toBeGreaterThan(0);
    expect(typeof tf.vaultBalances).toBe('object');
  });

  it('rebalanceTokens updates circulating and flowRate', () => {
    const before = getTokenField();
    const after = rebalanceTokens();
    expect(after.lastRebalance).not.toBe(before.lastRebalance);
    expect(after.flowRate).toBeGreaterThan(0);
    expect(after.circulating).toBeGreaterThan(0);
    expect(after.circulating).toBeLessThan(after.totalSupply);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §5  FIELD SCAN
// ═══════════════════════════════════════════════════════════════════════════════

describe('Enterprise Field Scan', () => {
  it('scanEnterpriseField returns a full EnterpriseField', () => {
    const field = scanEnterpriseField();
    expect(field.id).toBeTruthy();
    expect(field.scanTimestamp).toBeTruthy();
    expect(field.buildings.length).toBe(14);
    expect(field.fieldAgents.length).toBe(20);
    expect(field.workflows.length).toBe(10);
    expect(field.tokenField).toBeDefined();
  });

  it('field scan scores are 0-1', () => {
    const field = scanEnterpriseField();
    expect(field.corridorHealthAvg).toBeGreaterThanOrEqual(0);
    expect(field.corridorHealthAvg).toBeLessThanOrEqual(1);
    expect(field.fieldCoherence).toBeGreaterThanOrEqual(0);
    expect(field.fieldCoherence).toBeLessThanOrEqual(1);
    expect(field.sovereigntyScore).toBeGreaterThanOrEqual(0);
    expect(field.sovereigntyScore).toBeLessThanOrEqual(1);
    expect(field.phantomLayerIntegrity).toBeGreaterThanOrEqual(0);
    expect(field.phantomLayerIntegrity).toBeLessThanOrEqual(1);
  });

  it('field scan anomalyCount is a non-negative integer', () => {
    const field = scanEnterpriseField();
    expect(field.anomalyCount).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(field.anomalyCount)).toBe(true);
  });

  it('field scan accumulates in history', () => {
    const before = getFieldScanHistory().length;
    scanEnterpriseField();
    expect(getFieldScanHistory().length).toBe(before + 1);
  });

  it('getLatestFieldScan returns the most recent scan', () => {
    const field = scanEnterpriseField();
    const latest = getLatestFieldScan();
    expect(latest).toBeDefined();
    expect(latest!.id).toBe(field.id);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §6  COGNITION
// ═══════════════════════════════════════════════════════════════════════════════

describe('Cognition Cycle', () => {
  it('runCognitionCycle returns a CognitionCycle', () => {
    const cycle = runCognitionCycle();
    expect(cycle.id).toBeTruthy();
    expect(cycle.timestamp).toBeTruthy();
    expect(cycle.fieldSnapshot).toBeTruthy();
    expect(Array.isArray(cycle.patternsDetected)).toBe(true);
    expect(Array.isArray(cycle.emergenceEvents)).toBe(true);
  });

  it('cognition cycle scores are valid', () => {
    const cycle = runCognitionCycle();
    expect(cycle.cognitiveDepth).toBeGreaterThan(0);
    expect(cycle.cognitiveDepth).toBeLessThanOrEqual(1);
    expect(cycle.coherenceGain).toBeGreaterThanOrEqual(0);
    expect(cycle.coherenceGain).toBeLessThanOrEqual(1);
    expect(cycle.durationMs).toBeGreaterThan(0);
  });

  it('cognition cycle accumulates in history', () => {
    const before = getCognitionCycles().length;
    runCognitionCycle();
    expect(getCognitionCycles().length).toBe(before + 1);
  });

  it('getCognitiveLoad returns a 0-1 value', () => {
    const load = getCognitiveLoad();
    expect(load).toBeGreaterThanOrEqual(0);
    expect(load).toBeLessThanOrEqual(1);
  });

  it('cognition cycle increments governor cycle count', () => {
    const before = getGubernatorState().cognitionCycles;
    runCognitionCycle();
    expect(getGubernatorState().cognitionCycles).toBe(before + 1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §7  DECISIONS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Decisions', () => {
  it('emitDecision creates a decision with correct fields', () => {
    const d = emitDecision(
      'boost-field', 'elevated', 'field-engine',
      'Field coherence dropped below threshold',
      ['field-coherence < 0.5'],
      'Field coherence restored to 0.8',
    );
    expect(d.id).toBeTruthy();
    expect(d.type).toBe('boost-field');
    expect(d.priority).toBe('elevated');
    expect(d.target).toBe('field-engine');
    expect(d.executed).toBe(false);
  });

  it('emitDecision increments decisionsTotal', () => {
    const before = getGubernatorState().decisionsTotal;
    emitDecision('emit-show', 'routine', 'show-engine', 'r', [], 'o');
    expect(getGubernatorState().decisionsTotal).toBe(before + 1);
  });

  it('executeDecision marks decision as executed', () => {
    const d = emitDecision('repair-corridor', 'urgent', 'corridor-layer', 'r', [], 'o');
    expect(d.executed).toBe(false);
    const executed = executeDecision(d.id, 'corridor repaired');
    expect(executed).toBeDefined();
    expect(executed!.executed).toBe(true);
    expect(executed!.outcome).toBe('corridor repaired');
    expect(executed!.executedAt).toBeTruthy();
  });

  it('executeDecision returns undefined for unknown id', () => {
    expect(executeDecision('ghost-decision')).toBeUndefined();
  });

  it('executing a law-implying decision issues a new law', () => {
    const before = getLaws().length;
    const d = emitDecision('issue-law', 'critical', 'governance-engine', 'r', [], 'o', undefined, true);
    executeDecision(d.id);
    expect(getLaws().length).toBeGreaterThan(before);
  });

  it('getDecisions includes pre-seeded and new decisions', () => {
    expect(getDecisions().length).toBeGreaterThanOrEqual(3);
  });

  it('getPendingDecisions returns only unexecuted decisions', () => {
    for (const d of getPendingDecisions()) {
      expect(d.executed).toBe(false);
    }
  });

  it('getDecisionsByType filters correctly', () => {
    emitDecision('fork-organism', 'routine', 'all-agents', 'r', [], 'o');
    const forks = getDecisionsByType('fork-organism');
    expect(forks.length).toBeGreaterThan(0);
    for (const d of forks) expect(d.type).toBe('fork-organism');
  });

  it('getDecisionsByPriority filters correctly', () => {
    emitDecision('harden-identity', 'sovereign-override', 'all-agents', 'r', [], 'o');
    const overrides = getDecisionsByPriority('sovereign-override');
    expect(overrides.length).toBeGreaterThan(0);
    for (const d of overrides) expect(d.priority).toBe('sovereign-override');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §8  LAWS & DIRECTIVES
// ═══════════════════════════════════════════════════════════════════════════════

describe('Laws', () => {
  it('getLaws returns at least 5 pre-seeded laws', () => {
    expect(getLaws().length).toBeGreaterThanOrEqual(5);
  });

  it('getActiveLaws returns only active laws', () => {
    for (const l of getActiveLaws()) expect(l.active).toBe(true);
  });

  it('getLawsByDomain filters correctly', () => {
    const sovereigntyLaws = getLawsByDomain('sovereignty');
    expect(sovereigntyLaws.length).toBeGreaterThan(0);
    for (const l of sovereigntyLaws) expect(l.domain).toBe('sovereignty');
  });

  it('issueLaw creates a new active law', () => {
    const before = getLaws().length;
    const law = issueLaw('test-decision', 'No agent may go offline without a directive.', 'agents', 'mandatory');
    expect(law.id).toBeTruthy();
    expect(law.active).toBe(true);
    expect(law.lawText).toContain('offline');
    expect(getLaws().length).toBe(before + 1);
  });

  it('repealLaw marks a law inactive', () => {
    const law = issueLaw('test-decision-2', 'Temporary law.', 'field', 'advisory');
    expect(law.active).toBe(true);
    const repealed = repealLaw(law.id);
    expect(repealed).toBeDefined();
    expect(repealed!.active).toBe(false);
  });

  it('repealLaw returns undefined for unknown id', () => {
    expect(repealLaw('no-such-law')).toBeUndefined();
  });
});

describe('Directives', () => {
  it('getDirectives returns dispatched directives', () => {
    // Execute a decision to generate a directive
    const d = emitDecision('redistribute-tokens', 'elevated', 'token-layer', 'r', [], 'o');
    executeDecision(d.id);
    const directives = getDirectives();
    expect(directives.length).toBeGreaterThan(0);
  });

  it('acknowledgeDirective marks directive as acknowledged', () => {
    const d = emitDecision('spawn-agent', 'routine', 'builder-swarm', 'r', [], 'o');
    executeDecision(d.id);
    const directives = getDirectives();
    const directive = directives[directives.length - 1];
    const ack = acknowledgeDirective(directive.id, 'agent spawned');
    expect(ack).toBeDefined();
    expect(ack!.acknowledged).toBe(true);
    expect(ack!.result).toBe('agent spawned');
    expect(ack!.acknowledgedAt).toBeTruthy();
  });

  it('acknowledgeDirective returns undefined for unknown id', () => {
    expect(acknowledgeDirective('ghost-directive')).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §9  COGNITIVE PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Cognitive Patterns', () => {
  it('getCognitivePatterns returns 5 pre-seeded patterns', () => {
    expect(getCognitivePatterns().length).toBeGreaterThanOrEqual(5);
  });

  it('each pattern has required fields', () => {
    for (const p of getCognitivePatterns()) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.frequency).toBeGreaterThan(0);
      expect(p.confidence).toBeGreaterThan(0);
      expect(p.confidence).toBeLessThanOrEqual(1);
      expect(Array.isArray(p.triggerConditions)).toBe(true);
    }
  });

  it('getCognitivePattern retrieves by id', () => {
    const all = getCognitivePatterns();
    const p = getCognitivePattern(all[0].id);
    expect(p).toBeDefined();
    expect(p!.id).toBe(all[0].id);
  });

  it('getCognitivePattern returns undefined for unknown id', () => {
    expect(getCognitivePattern('ghost-pattern')).toBeUndefined();
  });

  it('learnPattern creates a new pattern', () => {
    const before = getCognitivePatterns().length;
    const p = learnPattern(
      'Trickster-Activates-Before-Storm',
      'Trickster layer activates 1 cycle before edge case storms',
      ['trickster-active', 'edge-cases > 5'],
      'invoke-ritual',
    );
    expect(p.id).toBeTruthy();
    expect(p.name).toBe('Trickster-Activates-Before-Storm');
    expect(p.encodedInLaw).toBe(false);
    expect(getCognitivePatterns().length).toBe(before + 1);
  });

  it('encodePatternIntoLaw sets encodedInLaw to true', () => {
    const p = learnPattern('Test-Pattern-For-Encoding', 'desc', ['cond'], 'boost-field');
    expect(p.encodedInLaw).toBe(false);
    const encoded = encodePatternIntoLaw(p.id);
    expect(encoded).toBeDefined();
    expect(encoded!.encodedInLaw).toBe(true);
  });

  it('encodePatternIntoLaw returns undefined for unknown id', () => {
    expect(encodePatternIntoLaw('no-pattern')).toBeUndefined();
  });

  it('getEncodedPatterns returns only patterns encoded in law', () => {
    for (const p of getEncodedPatterns()) expect(p.encodedInLaw).toBe(true);
    expect(getEncodedPatterns().length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §10  FULL GOVERNANCE CYCLE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Full Governance Cycle', () => {
  it('runGovernanceCycle returns all 4 result objects', () => {
    const result = runGovernanceCycle();
    expect(result.cognitionCycle).toBeDefined();
    expect(Array.isArray(result.decisions)).toBe(true);
    expect(Array.isArray(result.directives)).toBe(true);
    expect(Array.isArray(result.newLaws)).toBe(true);
  });

  it('governance cycle cognitionCycle has correct shape', () => {
    const { cognitionCycle } = runGovernanceCycle();
    expect(cognitionCycle.id).toBeTruthy();
    expect(cognitionCycle.fieldSnapshot).toBeTruthy();
    expect(Array.isArray(cognitionCycle.patternsDetected)).toBe(true);
  });

  it('governance cycle increments state counters', () => {
    const before = getGubernatorState();
    runGovernanceCycle();
    const after = getGubernatorState();
    expect(after.cognitionCycles).toBeGreaterThan(before.cognitionCycles);
    expect(after.decisionsTotal).toBeGreaterThanOrEqual(before.decisionsTotal);
  });

  it('governance cycle decisions are all executed', () => {
    const { decisions } = runGovernanceCycle();
    for (const d of decisions) {
      expect(d.executed).toBe(true);
    }
  });

  it('multiple governance cycles accumulate history', () => {
    const before = getCognitionCycles().length;
    runGovernanceCycle();
    runGovernanceCycle();
    expect(getCognitionCycles().length).toBeGreaterThan(before);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §11  DIAGNOSTICS & SOVEREIGNTY
// ═══════════════════════════════════════════════════════════════════════════════

describe('Diagnostics', () => {
  it('getGubernatorDiagnostics returns correct shape', () => {
    const diag = getGubernatorDiagnostics();
    expect(diag.buildingCount).toBe(14);
    expect(diag.agentCount).toBe(20);
    expect(diag.workflowCount).toBe(10);
    expect(diag.tokenSupply).toBe(1_000_000);
    expect(diag.fieldCoherence).toBeGreaterThanOrEqual(0);
    expect(diag.fieldCoherence).toBeLessThanOrEqual(1);
    expect(diag.sovereigntyScore).toBeGreaterThanOrEqual(0);
    expect(diag.sovereigntyScore).toBeLessThanOrEqual(1);
    expect(diag.patterns).toBeGreaterThanOrEqual(5);
  });

  it('diagnostics laws >= 5 (pre-seeded)', () => {
    const diag = getGubernatorDiagnostics();
    expect(diag.laws).toBeGreaterThanOrEqual(5);
    expect(diag.activeLaws).toBeGreaterThan(0);
  });

  it('diagnostics fieldScans > 0 after any scan', () => {
    scanEnterpriseField();
    const diag = getGubernatorDiagnostics();
    expect(diag.fieldScans).toBeGreaterThan(0);
  });
});

describe('Sovereignty', () => {
  it('assertSovereignty returns correct designation and attestation', () => {
    const s = assertSovereignty();
    expect(s.designation).toBe('ASI-014');
    expect(s.attestation).toContain('GUBERNATOR GREGIS');
    expect(s.attestation).toContain('ASI-014');
    expect(s.timestamp).toBeTruthy();
  });

  it('assertSovereignty scores are 0-1', () => {
    const s = assertSovereignty();
    expect(s.sovereigntyScore).toBeGreaterThanOrEqual(0);
    expect(s.sovereigntyScore).toBeLessThanOrEqual(1);
    expect(s.fieldCoherence).toBeGreaterThanOrEqual(0);
    expect(s.fieldCoherence).toBeLessThanOrEqual(1);
  });

  it('assertSovereignty reports cumulative decisions and laws', () => {
    const s = assertSovereignty();
    expect(s.decisionsTotal).toBeGreaterThanOrEqual(3);
    expect(s.lawsIssued).toBeGreaterThanOrEqual(5);
  });
});

describe('Governor Manifest', () => {
  it('getGovernorManifest returns correct identity', () => {
    const m = getGovernorManifest();
    expect(m.id).toBe('ASI-014');
    expect(m.name).toBe('Gubernator Gregis');
    expect(m.designation).toBe('ASI-014');
  });

  it('manifest contains "no schedule, no commands" principle', () => {
    const m = getGovernorManifest();
    const combined = m.manifest + m.principles.join(' ');
    expect(combined.toLowerCase()).toContain('schedule');
    expect(combined.toLowerCase()).toContain('command');
  });

  it('manifest has 10 capabilities', () => {
    const m = getGovernorManifest();
    expect(m.capabilities.length).toBe(10);
  });

  it('manifest has 5 principles', () => {
    const m = getGovernorManifest();
    expect(m.principles.length).toBe(5);
  });

  it('manifest field coverage includes all key areas', () => {
    const m = getGovernorManifest();
    expect(m.fieldCoverage).toContain('all-buildings');
    expect(m.fieldCoverage).toContain('all-agents');
    expect(m.fieldCoverage).toContain('all-workflows');
    expect(m.fieldCoverage).toContain('all-tokens');
  });
});
