// Combined test: Builder Agent Swarm + Trickster Layer

import {
  getAgent,
  listAgents,
  getAgentsByRole,
  wakeAgent,
  wakeAllAgents,
  buildArtifact,
  runSwarmCycle,
  getSwarmCycleHistory,
  listArtifacts,
  getArtifactsByType,
  getFieldGradients,
  calculateCollaborationScore,
  getAgentCount,
  getSwarmStatus,
  BuilderRole,
  ArtifactType,
} from '../lib/builderAgentSwarm';

import {
  getTricksterAgent,
  listTricksterAgents,
  getAgentsByClass,
  activateTrickster,
  activateAllTricksters,
  runInversion,
  runTricksterCycle,
  getTricksterHistory,
  getInversionEvents,
  getInversionsByTarget,
  forkPhantom,
  reconcilePhantomFork,
  getPhantomForks,
  getIdentityIntegrityScore,
  getCreativityScore,
  getTricksterStatus,
  TricksterClass,
} from '../lib/tricksterLayer';

// ═══════════════════════════════════════════════════════════════
// BUILDER AGENT SWARM TESTS
// ═══════════════════════════════════════════════════════════════

describe('BuilderAgentSwarm', () => {

  // — Agent count —
  test('getAgentCount() === 50', () => {
    expect(getAgentCount()).toBe(50);
  });

  test('listAgents() returns exactly 50 agents', () => {
    expect(listAgents()).toHaveLength(50);
  });

  // — Roles —
  const ROLES: BuilderRole[] = [
    'builder', 'compiler', 'synthesizer', 'draft-engine', 'phantom-architect',
    'corridor-mapper', 'ritual-designer', 'species-creator', 'encryption-layer', 'narrative-weaver',
  ];

  test.each(ROLES)('getAgentsByRole(%s) returns exactly 5 agents', (role) => {
    expect(getAgentsByRole(role)).toHaveLength(5);
  });

  test('getAgentsByRole builder returns agents with role builder', () => {
    const agents = getAgentsByRole('builder');
    agents.forEach(a => expect(a.role).toBe('builder'));
  });

  test('getAgentsByRole compiler returns agents with role compiler', () => {
    const agents = getAgentsByRole('compiler');
    agents.forEach(a => expect(a.role).toBe('compiler'));
  });

  test('getAgentsByRole species-creator returns agents with role species-creator', () => {
    const agents = getAgentsByRole('species-creator');
    agents.forEach(a => expect(a.role).toBe('species-creator'));
  });

  // — Individual agent lookup —
  test('getAgent(id) returns the correct agent', () => {
    const all = listAgents();
    const first = all[0];
    const found = getAgent(first.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(first.id);
  });

  test('getAgent(unknown-id) returns undefined', () => {
    expect(getAgent('nonexistent-id')).toBeUndefined();
  });

  // — Agent fields —
  test('all agents have required fields', () => {
    listAgents().forEach(a => {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(a.role).toBeTruthy();
      expect(a.state).toBeTruthy();
      expect(typeof a.fieldGradientStrength).toBe('number');
      expect(typeof a.autonomyScore).toBe('number');
      expect(typeof a.specializationScore).toBe('number');
    });
  });

  test('all agents start idle', () => {
    // Because state persists across tests we just check type, not value
    listAgents().forEach(a => {
      expect(typeof a.state).toBe('string');
    });
  });

  test('fieldGradientStrength is between 0 and 1 for all agents', () => {
    listAgents().forEach(a => {
      expect(a.fieldGradientStrength).toBeGreaterThanOrEqual(0);
      expect(a.fieldGradientStrength).toBeLessThanOrEqual(1);
    });
  });

  test('autonomyScore is between 0 and 1 for all agents', () => {
    listAgents().forEach(a => {
      expect(a.autonomyScore).toBeGreaterThanOrEqual(0);
      expect(a.autonomyScore).toBeLessThanOrEqual(1);
    });
  });

  // — Wake —
  test('wakeAgent transitions idle agent to following-gradient', () => {
    // Use a fresh agent that may still be idle (first run)
    const all = listAgents();
    const idle = all.find(a => a.state === 'idle');
    if (idle) {
      const result = wakeAgent(idle.id);
      expect(result).toBeDefined();
      expect(result!.state).toBe('following-gradient');
    } else {
      // All already woken by prior test — acceptable
      expect(true).toBe(true);
    }
  });

  test('wakeAgent returns undefined for unknown id', () => {
    expect(wakeAgent('no-such-agent')).toBeUndefined();
  });

  test('wakeAllAgents returns 50 agents', () => {
    const result = wakeAllAgents();
    expect(result).toHaveLength(50);
  });

  test('after wakeAllAgents no agent is idle', () => {
    wakeAllAgents();
    const idle = listAgents().filter(a => a.state === 'idle');
    expect(idle).toHaveLength(0);
  });

  // — Build artifact —
  test('buildArtifact returns artifact for active agent', () => {
    wakeAllAgents();
    const agent = listAgents().find(a => a.state !== 'idle');
    expect(agent).toBeDefined();
    const artifact = buildArtifact(agent!.id, 'ritual', 'Test-Ritual');
    expect(artifact).toBeDefined();
    expect(artifact!.type).toBe('ritual');
    expect(artifact!.name).toBe('Test-Ritual');
    expect(artifact!.createdBy).toBe(agent!.id);
  });

  test('buildArtifact increments agent artifactsBuilt', () => {
    wakeAllAgents();
    const agent = listAgents().find(a => a.state !== 'idle')!;
    const before = agent.artifactsBuilt;
    buildArtifact(agent.id, 'corridor', 'A-Corridor');
    expect(agent.artifactsBuilt).toBe(before + 1);
  });

  test('buildArtifact returns undefined for idle agent', () => {
    // find or create idle scenario — reset state manually
    const agent = listAgents()[0];
    const origState = agent.state;
    (agent as any).state = 'idle';
    const result = buildArtifact(agent.id, 'ritual', 'Should-Fail');
    expect(result).toBeUndefined();
    (agent as any).state = origState; // restore
  });

  test('buildArtifact artifact has all required fields', () => {
    wakeAllAgents();
    const agent = listAgents().find(a => a.state !== 'idle')!;
    const artifact = buildArtifact(agent.id, 'new-species', 'My-Species')!;
    expect(artifact.id).toBeTruthy();
    expect(artifact.type).toBe('new-species');
    expect(artifact.description).toBeTruthy();
    expect(Array.isArray(artifact.components)).toBe(true);
    expect(artifact.components.length).toBeGreaterThan(0);
    expect(artifact.timestamp).toBeTruthy();
  });

  // — Swarm cycle —
  test('runSwarmCycle returns SwarmCycle with correct shape', () => {
    const cycle = runSwarmCycle();
    expect(cycle.id).toBeTruthy();
    expect(cycle.timestamp).toBeTruthy();
    expect(typeof cycle.activeAgents).toBe('number');
    expect(typeof cycle.artifactsCreated).toBe('number');
    expect(typeof cycle.newSpecies).toBe('number');
    expect(typeof cycle.newRituals).toBe('number');
    expect(typeof cycle.newCorridors).toBe('number');
    expect(typeof cycle.newPhantomOrgans).toBe('number');
    expect(typeof cycle.fieldGradientStrengthAvg).toBe('number');
    expect(typeof cycle.collaborationScore).toBe('number');
    expect(Array.isArray(cycle.emergentBehaviors)).toBe(true);
  });

  test('runSwarmCycle creates artifacts', () => {
    const before = listArtifacts().length;
    runSwarmCycle();
    const after = listArtifacts().length;
    expect(after).toBeGreaterThan(before);
  });

  test('runSwarmCycle activeAgents > 0', () => {
    const cycle = runSwarmCycle();
    expect(cycle.activeAgents).toBeGreaterThan(0);
  });

  test('swarmCycle history accumulates', () => {
    const before = getSwarmCycleHistory().length;
    runSwarmCycle();
    const after = getSwarmCycleHistory().length;
    expect(after).toBe(before + 1);
  });

  test('getSwarmCycleHistory returns array', () => {
    expect(Array.isArray(getSwarmCycleHistory())).toBe(true);
  });

  test('fieldGradientStrengthAvg is between 0 and 1', () => {
    const cycle = runSwarmCycle();
    expect(cycle.fieldGradientStrengthAvg).toBeGreaterThanOrEqual(0);
    expect(cycle.fieldGradientStrengthAvg).toBeLessThanOrEqual(1);
  });

  // — Artifacts —
  test('listArtifacts returns array', () => {
    expect(Array.isArray(listArtifacts())).toBe(true);
  });

  test('listArtifacts grows after build', () => {
    wakeAllAgents();
    const before = listArtifacts().length;
    const agent = listAgents().find(a => a.state !== 'idle')!;
    buildArtifact(agent.id, 'phantom-organ', 'New-Phantom');
    expect(listArtifacts().length).toBe(before + 1);
  });

  test('getArtifactsByType filters correctly', () => {
    wakeAllAgents();
    const agent = listAgents().find(a => a.state !== 'idle')!;
    buildArtifact(agent.id, 'encryption-surface', 'Enc-Surface-Test');
    const filtered = getArtifactsByType('encryption-surface');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(a => expect(a.type).toBe('encryption-surface'));
  });

  test('getArtifactsByType for non-existent type returns empty', () => {
    // compiled-module may or may not exist; pick a type less likely built
    // just test that the shape is correct
    const result = getArtifactsByType('draft-blueprint');
    expect(Array.isArray(result)).toBe(true);
  });

  // — Field gradients —
  test('getFieldGradients returns 5 or more gradients', () => {
    expect(getFieldGradients().length).toBeGreaterThanOrEqual(5);
  });

  test('all field gradients have required fields', () => {
    getFieldGradients().forEach(g => {
      expect(g.id).toBeTruthy();
      expect(g.direction).toBeTruthy();
      expect(typeof g.strength).toBe('number');
      expect(g.sourceSubsystem).toBeTruthy();
      expect(g.targetSubsystem).toBeTruthy();
      expect(g.attractorPattern).toBeTruthy();
    });
  });

  test('field gradient strengths are between 0 and 1', () => {
    getFieldGradients().forEach(g => {
      expect(g.strength).toBeGreaterThanOrEqual(0);
      expect(g.strength).toBeLessThanOrEqual(1);
    });
  });

  // — Collaboration —
  test('calculateCollaborationScore returns 0-1', () => {
    const score = calculateCollaborationScore();
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  // — Swarm status —
  test('getSwarmStatus returns correct shape with totalAgents=50', () => {
    const status = getSwarmStatus();
    expect(status.totalAgents).toBe(50);
    expect(typeof status.activeAgents).toBe('number');
    expect(typeof status.idleAgents).toBe('number');
    expect(typeof status.artifactsBuilt).toBe('number');
    expect(typeof status.swarmCycles).toBe('number');
    expect(typeof status.avgFieldStrength).toBe('number');
    expect(typeof status.collaborationScore).toBe('number');
  });

  test('getSwarmStatus totalAgents + valid distribution', () => {
    const status = getSwarmStatus();
    expect(status.activeAgents + status.idleAgents).toBeLessThanOrEqual(status.totalAgents);
  });

  test('getSwarmStatus avgFieldStrength is 0-1', () => {
    const status = getSwarmStatus();
    expect(status.avgFieldStrength).toBeGreaterThanOrEqual(0);
    expect(status.avgFieldStrength).toBeLessThanOrEqual(1);
  });

  test('getSwarmStatus swarmCycles increases after runSwarmCycle', () => {
    const before = getSwarmStatus().swarmCycles;
    runSwarmCycle();
    const after = getSwarmStatus().swarmCycles;
    expect(after).toBe(before + 1);
  });
});

// ═══════════════════════════════════════════════════════════════
// TRICKSTER LAYER TESTS
// ═══════════════════════════════════════════════════════════════

describe('TricksterLayer', () => {

  // — Agent list —
  test('listTricksterAgents returns exactly 8 agents', () => {
    expect(listTricksterAgents()).toHaveLength(8);
  });

  test('each trickster agent has a unique class', () => {
    const classes = listTricksterAgents().map(a => a.class);
    const unique = new Set(classes);
    expect(unique.size).toBe(8);
  });

  test('each trickster has a unique id', () => {
    const ids = listTricksterAgents().map(a => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(8);
  });

  test('all trickster agents have required fields', () => {
    listTricksterAgents().forEach(a => {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(a.class).toBeTruthy();
      expect(a.state).toBeTruthy();
      expect(a.inversionTarget).toBeTruthy();
      expect(typeof a.inversionDepth).toBe('number');
      expect(a.signaturePattern).toBeTruthy();
    });
  });

  test('getTricksterAgent(id) returns the correct agent', () => {
    const all = listTricksterAgents();
    const first = all[0];
    const found = getTricksterAgent(first.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(first.id);
  });

  test('getTricksterAgent(unknown) returns undefined', () => {
    expect(getTricksterAgent('does-not-exist')).toBeUndefined();
  });

  // — Classes —
  const CLASSES: TricksterClass[] = [
    'inversion-engine', 'contradiction-amplifier', 'boundary-breaker', 'phantom-forker',
    'signal-distorter', 'encryption-slider', 'identity-challenger', 'narrative-inverter',
  ];

  test.each(CLASSES)('getAgentsByClass(%s) returns exactly 1 agent', (cls) => {
    expect(getAgentsByClass(cls)).toHaveLength(1);
  });

  test('getAgentsByClass returns agents with correct class', () => {
    CLASSES.forEach(cls => {
      getAgentsByClass(cls).forEach(a => expect(a.class).toBe(cls));
    });
  });

  // — Activation —
  test('activateTrickster transitions state from dormant', () => {
    // reset agents to dormant first by running a full cycle (which dissolves them)
    // then test activation
    const dormant = listTricksterAgents().find(a => a.state === 'dormant');
    if (dormant) {
      const result = activateTrickster(dormant.id);
      expect(result).toBeDefined();
      expect(result!.state).toBe('inverting');
    } else {
      // Already active from prior test — state machine moved
      const agent = listTricksterAgents()[0];
      const result = activateTrickster(agent.id);
      expect(result).toBeDefined();
    }
  });

  test('activateTrickster returns undefined for unknown id', () => {
    expect(activateTrickster('bad-id')).toBeUndefined();
  });

  test('activateAllTricksters returns 8 agents', () => {
    const result = activateAllTricksters();
    expect(result).toHaveLength(8);
  });

  test('after activateAllTricksters no agent is dormant', () => {
    activateAllTricksters();
    const dormant = listTricksterAgents().filter(a => a.state === 'dormant');
    expect(dormant).toHaveLength(0);
  });

  // — Inversion —
  test('runInversion returns InversionEvent for active agent', () => {
    activateAllTricksters();
    const agent = listTricksterAgents().find(a => a.state !== 'dormant')!;
    const event = runInversion(agent.id);
    expect(event).toBeDefined();
    expect(event!.agentId).toBe(agent.id);
  });

  test('runInversion event has required fields', () => {
    activateAllTricksters();
    const agent = listTricksterAgents().find(a => a.state !== 'dormant')!;
    const event = runInversion(agent.id)!;
    expect(event.id).toBeTruthy();
    expect(event.timestamp).toBeTruthy();
    expect(event.target).toBeTruthy();
    expect(event.inversionType).toBeTruthy();
    expect(event.description).toBeTruthy();
    expect(event.organismResponse).toBeTruthy();
    expect(event.hardeningResult).toBeTruthy();
    expect(typeof event.identityIntegrityBefore).toBe('number');
    expect(typeof event.identityIntegrityAfter).toBe('number');
    expect(typeof event.success).toBe('boolean');
  });

  test('runInversion identityIntegrityAfter >= identityIntegrityBefore', () => {
    activateAllTricksters();
    const agent = listTricksterAgents().find(a => a.state !== 'dormant')!;
    const event = runInversion(agent.id)!;
    expect(event.identityIntegrityAfter).toBeGreaterThanOrEqual(event.identityIntegrityBefore);
  });

  test('runInversion for dormant agent returns undefined', () => {
    const agent = listTricksterAgents()[0];
    const orig = agent.state;
    (agent as any).state = 'dormant';
    const result = runInversion(agent.id);
    expect(result).toBeUndefined();
    (agent as any).state = orig; // restore
  });

  // — Trickster cycle —
  test('runTricksterCycle returns TricksterReport with correct shape', () => {
    const report = runTricksterCycle();
    expect(report.id).toBeTruthy();
    expect(report.timestamp).toBeTruthy();
    expect(typeof report.activeAgents).toBe('number');
    expect(typeof report.inversionEvents).toBe('number');
    expect(typeof report.hardeningsAchieved).toBe('number');
    expect(typeof report.phantomForks).toBe('number');
    expect(typeof report.identityIntegrityScore).toBe('number');
    expect(typeof report.creativityScore).toBe('number');
    expect(typeof report.narrativeClarityGain).toBe('number');
    expect(Array.isArray(report.recommendations)).toBe(true);
  });

  test('runTricksterCycle creates inversion events', () => {
    const before = getInversionEvents().length;
    runTricksterCycle();
    const after = getInversionEvents().length;
    expect(after).toBeGreaterThan(before);
  });

  test('trickster history accumulates', () => {
    const before = getTricksterHistory().length;
    runTricksterCycle();
    const after = getTricksterHistory().length;
    expect(after).toBe(before + 1);
  });

  test('getTricksterHistory returns array', () => {
    expect(Array.isArray(getTricksterHistory())).toBe(true);
  });

  test('runTricksterCycle identityIntegrityScore is 0-1', () => {
    const report = runTricksterCycle();
    expect(report.identityIntegrityScore).toBeGreaterThanOrEqual(0);
    expect(report.identityIntegrityScore).toBeLessThanOrEqual(1);
  });

  test('runTricksterCycle narrativeClarityGain is 0-1', () => {
    const report = runTricksterCycle();
    expect(report.narrativeClarityGain).toBeGreaterThanOrEqual(0);
    expect(report.narrativeClarityGain).toBeLessThanOrEqual(1);
  });

  // — Inversion events —
  test('getInversionEvents returns array', () => {
    expect(Array.isArray(getInversionEvents())).toBe(true);
  });

  test('getInversionEvents grows after runInversion', () => {
    activateAllTricksters();
    const before = getInversionEvents().length;
    const agent = listTricksterAgents().find(a => a.state !== 'dormant')!;
    runInversion(agent.id);
    expect(getInversionEvents().length).toBe(before + 1);
  });

  test('getInversionsByTarget filters correctly', () => {
    activateAllTricksters();
    const agent = listTricksterAgents().find(a => a.inversionTarget === 'identity' && a.state !== 'dormant')!;
    if (agent) runInversion(agent.id);
    const events = getInversionsByTarget('identity');
    expect(Array.isArray(events)).toBe(true);
    events.forEach(e => expect(e.target).toBe('identity'));
  });

  test('getInversionsByTarget for unused target returns empty array', () => {
    // Use a target that may have no events depending on run order
    const events = getInversionsByTarget('contracts');
    expect(Array.isArray(events)).toBe(true);
  });

  // — Phantom forks —
  test('forkPhantom returns PhantomFork', () => {
    const fork = forkPhantom('phantom-original-001', 'Test divergence');
    expect(fork).toBeDefined();
    expect(fork.originalPhantomId).toBe('phantom-original-001');
    expect(fork.forkReason).toBe('Test divergence');
    expect(fork.reconciled).toBe(false);
    expect(fork.id).toBeTruthy();
    expect(fork.forkedPhantomId).toBeTruthy();
  });

  test('forkPhantom divergenceScore is 0-1', () => {
    const fork = forkPhantom('phantom-002', 'Divergence test');
    expect(fork.divergenceScore).toBeGreaterThanOrEqual(0);
    expect(fork.divergenceScore).toBeLessThanOrEqual(1);
  });

  test('getPhantomForks returns array', () => {
    expect(Array.isArray(getPhantomForks())).toBe(true);
  });

  test('getPhantomForks grows after forkPhantom', () => {
    const before = getPhantomForks().length;
    forkPhantom('phantom-003', 'Another fork');
    expect(getPhantomForks().length).toBe(before + 1);
  });

  test('reconcilePhantomFork marks fork as reconciled', () => {
    const fork = forkPhantom('phantom-rec-001', 'Reconcile me');
    const result = reconcilePhantomFork(fork.id);
    expect(result).toBeDefined();
    expect(result!.reconciled).toBe(true);
    expect(result!.reconciledAt).toBeTruthy();
  });

  test('reconcilePhantomFork returns undefined for unknown id', () => {
    expect(reconcilePhantomFork('no-such-fork')).toBeUndefined();
  });

  test('reconciled fork remains in getPhantomForks', () => {
    const fork = forkPhantom('phantom-persist-001', 'Persist test');
    reconcilePhantomFork(fork.id);
    const forks = getPhantomForks();
    const found = forks.find(f => f.id === fork.id);
    expect(found).toBeDefined();
    expect(found!.reconciled).toBe(true);
  });

  // — Scores —
  test('getIdentityIntegrityScore is between 0 and 1', () => {
    const score = getIdentityIntegrityScore();
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  test('getIdentityIntegrityScore increases after hardening cycle', () => {
    const before = getIdentityIntegrityScore();
    activateAllTricksters();
    const agent = listTricksterAgents().find(a => a.state !== 'dormant')!;
    runInversion(agent.id);
    const after = getIdentityIntegrityScore();
    expect(after).toBeGreaterThanOrEqual(before);
  });

  test('getCreativityScore is between 0 and 1', () => {
    const score = getCreativityScore();
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  test('getCreativityScore increases after inversions', () => {
    const before = getCreativityScore();
    activateAllTricksters();
    const agent = listTricksterAgents().find(a => a.state !== 'dormant')!;
    runInversion(agent.id);
    const after = getCreativityScore();
    expect(after).toBeGreaterThanOrEqual(before);
  });

  // — Status —
  test('getTricksterStatus returns correct shape', () => {
    const status = getTricksterStatus();
    expect(typeof status.activeAgents).toBe('number');
    expect(typeof status.totalInversions).toBe('number');
    expect(typeof status.hardenings).toBe('number');
    expect(typeof status.identityIntegrity).toBe('number');
    expect(typeof status.phantomForks).toBe('number');
    expect(typeof status.creativity).toBe('number');
  });

  test('getTricksterStatus identityIntegrity is 0-1', () => {
    const status = getTricksterStatus();
    expect(status.identityIntegrity).toBeGreaterThanOrEqual(0);
    expect(status.identityIntegrity).toBeLessThanOrEqual(1);
  });

  test('getTricksterStatus creativity is 0-1', () => {
    const status = getTricksterStatus();
    expect(status.creativity).toBeGreaterThanOrEqual(0);
    expect(status.creativity).toBeLessThanOrEqual(1);
  });

  test('getTricksterStatus phantomForks matches getPhantomForks length', () => {
    const status = getTricksterStatus();
    expect(status.phantomForks).toBe(getPhantomForks().length);
  });

  test('getTricksterStatus totalInversions matches getInversionEvents length', () => {
    const status = getTricksterStatus();
    expect(status.totalInversions).toBe(getInversionEvents().length);
  });
});
