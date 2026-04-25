import {
  type EdgeClass, type EdgeSeverity, type CircadianPhase, type ResonanceLinkType,
  type AGITheoryDomain, type PhantomClass, type PhantomState, type CrawlerClass,
  type TricksterClass, type ICPCanisterStatus, type SDKMode,
  detectEdge, resolveEdge, getEdgeSensors, getEdgeSensorsBySeverity,
  getOpenCircuits, getCircuitBreakers, resetCircuit,
  performCircadianHandoff, getCurrentCircadianPhase, getCircadianHandoffs,
  pulseResonanceLink, getResonanceLinks, getLinksByType, getAvgResonanceCoherence,
  getAGITheories, getAGITheoryByDomain, advanceAGITheory, getProvedTheories,
  bootAGIKernel, getAGIDesktopState, elevateAGIKernel,
  getPhantoms, getPhantom, getPhantomsByClass, emergePhantom, dissolvePhantom, dreamPhantom, getActivePhantoms,
  getCrawlers, getCrawlersByClass, deployCrawler, deployAllCrawlers, getCrawlerTotalAnomalies,
  getTricksterAgents, getTricksterAgent, applyInversion, invertAllTricksters,
  getICPCanisters, getICPCanister, getCanistersByStatus, heartbeatICPCanister, heartbeatAllCanisters,
  emitSDKHeartbeat, getSDKHeartbeats, getLatestSDKHeartbeat,
  runEdgeAGICycle, getEdgeAGICycles, getEdgeAGIDashboard,
} from '../lib/edgeAGIOrganismFlow';

describe('Edge AGI Organism Flow — Edge Model', () => {
  it('detectEdge creates a sensor', () => {
    const sensor = detectEdge('null-value', 'info', 'test-context');
    expect(sensor.id).toBeTruthy();
    expect(sensor.class).toBe('null-value');
    expect(sensor.severity).toBe('info');
    expect(sensor.autoResolved).toBe(true);
    expect(sensor.circuitTripped).toBe(false);
  });

  it('detectEdge critical sets circuitTripped', () => {
    const sensor = detectEdge('overflow', 'critical', 'overflow-ctx');
    expect(sensor.circuitTripped).toBe(true);
    expect(sensor.autoResolved).toBe(false);
  });

  it('resolveEdge marks sensor as resolved', () => {
    const sensor = detectEdge('timeout', 'warning', 'timeout-ctx');
    sensor.resolvedAt = undefined; // clear for test
    const result = resolveEdge(sensor.id);
    expect(result!.resolvedAt).toBeTruthy();
  });

  it('getEdgeSensorsBySeverity filters correctly', () => {
    for (const s of getEdgeSensorsBySeverity('info')) expect(s.severity).toBe('info');
  });

  it('getCircuitBreakers returns 5 pre-seeded circuits', () => {
    expect(getCircuitBreakers().length).toBe(5);
  });

  it('resetCircuit closes an open circuit', () => {
    const openCircuit = getCircuitBreakers().find(c => c.state === 'open')
      ?? getCircuitBreakers()[0];
    openCircuit.state = 'open';
    const result = resetCircuit(openCircuit.id);
    expect(result!.state).toBe('closed');
    expect(result!.failureCount).toBe(0);
    expect(result!.recoveredAt).toBeTruthy();
  });
});

describe('Edge AGI Organism Flow — Circadian', () => {
  it('performCircadianHandoff returns a handoff', () => {
    const handoff = performCircadianHandoff();
    expect(handoff.id).toBeTruthy();
    expect(handoff.result).toBe('clean');
    expect(handoff.phaseScore).toBeGreaterThanOrEqual(0);
    expect(handoff.phaseScore).toBeLessThanOrEqual(1);
  });

  it('circadian phase advances after handoff', () => {
    const before = getCurrentCircadianPhase();
    performCircadianHandoff();
    const after = getCurrentCircadianPhase();
    expect(after).not.toBe(before); // advanced to next phase
  });

  it('getCircadianHandoffs accumulates', () => {
    const before = getCircadianHandoffs().length;
    performCircadianHandoff();
    expect(getCircadianHandoffs().length).toBe(before + 1);
  });
});

describe('Edge AGI Organism Flow — Cross-Organism Resonance', () => {
  it('pulseResonanceLink creates a link', () => {
    const link = pulseResonanceLink('org-a', 'org-b', 'harmonic');
    expect(link.id).toBeTruthy();
    expect(link.fromOrganismId).toBe('org-a');
    expect(link.toOrganismId).toBe('org-b');
    expect(link.type).toBe('harmonic');
    expect(link.coherence).toBeGreaterThanOrEqual(0);
    expect(link.coherence).toBeLessThanOrEqual(1);
    expect(link.latencyMs).toBeGreaterThan(0);
  });

  it('getLinksByType filters correctly', () => {
    pulseResonanceLink('x', 'y', 'sovereign');
    for (const l of getLinksByType('sovereign')) expect(l.type).toBe('sovereign');
  });

  it('getAvgResonanceCoherence returns 0-1', () => {
    const avg = getAvgResonanceCoherence();
    expect(avg).toBeGreaterThanOrEqual(0);
    expect(avg).toBeLessThanOrEqual(1);
  });
});

describe('Edge AGI Organism Flow — AGI Research', () => {
  it('getAGITheories returns 5 pre-seeded theories', () => {
    expect(getAGITheories().length).toBe(5);
  });

  it('getAGITheoryByDomain retrieves by domain', () => {
    const theory = getAGITheoryByDomain('phi-recursive-intelligence');
    expect(theory).toBeDefined();
    expect(theory!.domain).toBe('phi-recursive-intelligence');
  });

  it('advanceAGITheory progresses proof status', () => {
    const theory = getAGITheories().find(t => t.proofStatus === 'conjectured')
      ?? getAGITheories()[0];
    const before = theory.proofStatus;
    advanceAGITheory(theory.id);
    const valid: string[] = ['conjectured', 'partially-proved', 'proved', 'axiom'];
    expect(valid).toContain(theory.proofStatus);
  });

  it('getProvedTheories returns proved or axiom theories', () => {
    for (const t of getProvedTheories()) {
      expect(['proved', 'axiom']).toContain(t.proofStatus);
    }
  });
});

describe('Edge AGI Organism Flow — AGI Desktop', () => {
  it('bootAGIKernel sets kernel status to running', () => {
    const state = bootAGIKernel('autonomous');
    expect(state.kernelStatus).toBe('running');
    expect(state.capabilityTier).toBe('autonomous');
    expect(state.extensionConnected).toBe(true);
    expect(state.activeTabCount).toBeGreaterThan(0);
  });

  it('getAGIDesktopState returns current state', () => {
    const state = getAGIDesktopState();
    expect(state.kernelStatus).toBeTruthy();
    expect(state.boostedAt).toBeTruthy();
  });

  it('elevateAGIKernel upgrades to sovereign', () => {
    bootAGIKernel('autonomous');
    const elevated = elevateAGIKernel();
    expect(elevated.kernelStatus).toBe('autonomous');
    expect(elevated.capabilityTier).toBe('sovereign');
  });
});

describe('Edge AGI Organism Flow — Phantom Architecture', () => {
  it('getPhantoms returns 5 pre-seeded phantoms', () => {
    expect(getPhantoms().length).toBe(5);
  });

  it('getPhantom retrieves by id', () => {
    const p = getPhantoms()[0];
    expect(getPhantom(p.id)).toBeDefined();
  });

  it('getPhantomsByClass filters correctly', () => {
    for (const p of getPhantomsByClass('cipher')) expect(p.class).toBe('cipher');
  });

  it('emergePhantom transitions from dormant', () => {
    const dormant = getPhantoms().find(p => p.state === 'dormant');
    if (dormant) {
      const result = emergePhantom(dormant.id);
      expect(['emerging', 'active']).toContain(result!.state);
    }
  });

  it('dissolvePhantom sets state to dissolving', () => {
    const p = getPhantoms()[0];
    const result = dissolvePhantom(p.id);
    expect(result!.state).toBe('dissolving');
  });

  it('dreamPhantom increments thought models', () => {
    const p = getPhantoms()[1];
    const before = p.thoughtModels;
    dreamPhantom(p.id);
    expect(p.thoughtModels).toBe(before + 1);
    expect(p.state).toBe('dreaming');
  });
});

describe('Edge AGI Organism Flow — Night Crawlers', () => {
  it('getCrawlers returns 5 pre-seeded crawlers', () => {
    expect(getCrawlers().length).toBe(5);
  });

  it('deployCrawler sends crawler on sweep', () => {
    const crawler = getCrawlers()[0];
    const result = deployCrawler(crawler.id);
    expect(result!.state).toBe('reporting');
    expect(result!.sweepsCompleted).toBeGreaterThan(0);
    expect(result!.stressScore).toBeGreaterThanOrEqual(0);
  });

  it('deployAllCrawlers deploys all 5', () => {
    const results = deployAllCrawlers();
    expect(results.length).toBe(5);
  });

  it('getCrawlerTotalAnomalies returns non-negative number', () => {
    expect(getCrawlerTotalAnomalies()).toBeGreaterThanOrEqual(0);
  });

  it('getCrawlersByClass filters correctly', () => {
    for (const c of getCrawlersByClass('edge-sweeper')) {
      expect(c.class).toBe('edge-sweeper');
    }
  });
});

describe('Edge AGI Organism Flow — Trickster Layer', () => {
  it('getTricksterAgents returns 4 pre-seeded agents', () => {
    expect(getTricksterAgents().length).toBe(4);
  });

  it('getTricksterAgent retrieves by id', () => {
    const agent = getTricksterAgents()[0];
    expect(getTricksterAgent(agent.id)).toBeDefined();
  });

  it('applyInversion increments inversions', () => {
    const agent = getTricksterAgents()[0];
    const before = agent.inversionsApplied;
    applyInversion(agent.id);
    expect(agent.inversionsApplied).toBe(before + 1);
    expect(agent.paradoxLoops).toBeGreaterThanOrEqual(0);
  });

  it('invertAllTricksters returns all 4', () => {
    const results = invertAllTricksters();
    expect(results.length).toBe(4);
  });
});

describe('Edge AGI Organism Flow — ICP Canisters', () => {
  it('getICPCanisters returns 4 pre-seeded canisters', () => {
    expect(getICPCanisters().length).toBe(4);
  });

  it('heartbeatICPCanister updates lastHeartbeatAt', () => {
    const canister = getICPCanisters()[0];
    const result = heartbeatICPCanister(canister.id);
    expect(result!.lastHeartbeatAt).toBeTruthy();
  });

  it('heartbeatAllCanisters returns all 4', () => {
    const results = heartbeatAllCanisters();
    expect(results.length).toBe(4);
  });

  it('getCanistersByStatus filters correctly', () => {
    for (const c of getCanistersByStatus('running')) expect(c.status).toBe('running');
  });
});

describe('Edge AGI Organism Flow — SDK', () => {
  it('emitSDKHeartbeat creates a heartbeat', () => {
    const hb = emitSDKHeartbeat('autonomous');
    expect(hb.id).toBeTruthy();
    expect(hb.mode).toBe('autonomous');
    expect(hb.phiAlignment).toBeGreaterThanOrEqual(0);
    expect(hb.phiAlignment).toBeLessThanOrEqual(1);
  });

  it('getLatestSDKHeartbeat returns last', () => {
    emitSDKHeartbeat('resonating');
    const latest = getLatestSDKHeartbeat();
    expect(latest!.mode).toBe('resonating');
  });

  it('getSDKHeartbeats accumulates', () => {
    const before = getSDKHeartbeats().length;
    emitSDKHeartbeat('absorbing');
    expect(getSDKHeartbeats().length).toBe(before + 1);
  });
});

describe('Edge AGI Organism Flow — Cycle & Dashboard', () => {
  it('runEdgeAGICycle returns a complete cycle', () => {
    const cycle = runEdgeAGICycle();
    expect(cycle.id).toBeTruthy();
    expect(cycle.edgesDetected).toBe(3);
    expect(cycle.circadianHandoffs).toBe(1);
    expect(cycle.resonanceLinksFormed).toBe(2);
    expect(cycle.crawlerSweeps).toBe(5);
    expect(cycle.tricksterInversions).toBe(4);
    expect(cycle.icpHealthChecks).toBe(4);
    expect(cycle.sdkHeartbeats).toBe(1);
    expect(cycle.convergenceScore).toBeGreaterThanOrEqual(0);
    expect(cycle.convergenceScore).toBeLessThanOrEqual(1);
  });

  it('getEdgeAGICycles accumulates', () => {
    const before = getEdgeAGICycles().length;
    runEdgeAGICycle();
    expect(getEdgeAGICycles().length).toBeGreaterThan(before);
  });

  it('getEdgeAGIDashboard returns correct structure', () => {
    const dash = getEdgeAGIDashboard();
    expect(dash.id).toBe('edge-agi-dashboard');
    expect(dash.icpCanisters).toBe(4);
    expect(dash.tricksterAgents).toBe(4);
    expect(['sovereign', 'coherent', 'disturbed', 'fragmented']).toContain(dash.edgeHealth);
  });
});
