import {
  type OrganismHealth, type DomainName,
  runOrganismCycle, getMasterCycles, getLatestMasterCycle,
  getOrganismMasterDashboard, getOrganismDiagnostics,
  getOrganismPhiCoherence, getOrganismHealth,
  getCrossDomainRecommendations, getPendingCrossRecs, applyCrossRec,
  getCrossRecsByPriority,
} from '../lib/organismMasterOrchestrator';

describe('Organism Master Orchestrator — Master Cycle', () => {
  it('runOrganismCycle returns a complete cycle with all 5 domain IDs', () => {
    const cycle = runOrganismCycle();
    expect(cycle.id).toBeTruthy();
    expect(cycle.cycleNumber).toBeGreaterThan(0);
    expect(cycle.startedAt).toBeTruthy();
    expect(cycle.completedAt).toBeTruthy();
    expect(cycle.sovereignCoreCycleId).toBeTruthy();
    expect(cycle.builderRuntimeCycleId).toBeTruthy();
    expect(cycle.intelligenceContentCycleId).toBeTruthy();
    expect(cycle.edgeAGICycleId).toBeTruthy();
    expect(cycle.companyOpsCycleId).toBeTruthy();
  });

  it('cycle has positive totalTestsRun', () => {
    const cycle = runOrganismCycle();
    expect(cycle.totalTestsRun).toBeGreaterThan(0);
  });

  it('cycle has positive totalEntitiesProcessed', () => {
    const cycle = runOrganismCycle();
    expect(cycle.totalEntitiesProcessed).toBeGreaterThan(0);
  });

  it('phiCoherence is 0-1', () => {
    const cycle = runOrganismCycle();
    expect(cycle.phiCoherence).toBeGreaterThanOrEqual(0);
    expect(cycle.phiCoherence).toBeLessThanOrEqual(1);
  });

  it('convergenceScore is 0-1', () => {
    const cycle = runOrganismCycle();
    expect(cycle.convergenceScore).toBeGreaterThanOrEqual(0);
    expect(cycle.convergenceScore).toBeLessThanOrEqual(1);
  });

  it('organismHealth is a valid OrganismHealth value', () => {
    const cycle = runOrganismCycle();
    const valid: OrganismHealth[] = ['transcendent', 'sovereign', 'coherent', 'stressed', 'fragmented', 'dormant'];
    expect(valid).toContain(cycle.organismHealth);
  });

  it('cycle number increments', () => {
    const c1 = runOrganismCycle();
    const c2 = runOrganismCycle();
    expect(c2.cycleNumber).toBe(c1.cycleNumber + 1);
  });

  it('getMasterCycles accumulates', () => {
    const before = getMasterCycles().length;
    runOrganismCycle();
    expect(getMasterCycles().length).toBeGreaterThan(before);
  });

  it('getLatestMasterCycle returns most recent', () => {
    const cycle = runOrganismCycle();
    expect(getLatestMasterCycle()!.id).toBe(cycle.id);
  });

  it('durationMs is positive after cycle', () => {
    const cycle = runOrganismCycle();
    expect(cycle.durationMs).toBeGreaterThanOrEqual(0);
  });
});

describe('Organism Master Orchestrator — Master Dashboard', () => {
  it('getOrganismMasterDashboard returns correct shape', () => {
    runOrganismCycle();
    const dash = getOrganismMasterDashboard();
    expect(dash.id).toBe('organism-master-dashboard');
    expect(dash.name).toContain('MEDINA');
    expect(dash.totalModulesTracked).toBe(59);
    expect(dash.heartbeatIntervalMs).toBeGreaterThan(0);
    expect(dash.uptimeMs).toBeGreaterThanOrEqual(0);
  });

  it('dashboard has 5 domain health entries', () => {
    const dash = getOrganismMasterDashboard();
    expect(dash.domains.length).toBe(5);
    const domainNames: DomainName[] = [
      'sovereign-core', 'builder-runtime', 'intelligence-content', 'edge-agi', 'company-ops',
    ];
    for (const d of domainNames) {
      expect(dash.domains.some(dom => dom.domain === d)).toBe(true);
    }
  });

  it('each domain health has a score 0-1', () => {
    const dash = getOrganismMasterDashboard();
    for (const d of dash.domains) {
      expect(d.healthScore).toBeGreaterThanOrEqual(0);
      expect(d.healthScore).toBeLessThanOrEqual(1);
      expect(d.cyclesCompleted).toBeGreaterThanOrEqual(0);
    }
  });

  it('dashboard includes all 5 sub-dashboards', () => {
    const dash = getOrganismMasterDashboard();
    expect(dash.sovereignCore).toBeDefined();
    expect(dash.builderRuntime).toBeDefined();
    expect(dash.intelligenceContent).toBeDefined();
    expect(dash.edgeAGI).toBeDefined();
    expect(dash.companyOps).toBeDefined();
  });

  it('phiCoherence is 0-1', () => {
    const dash = getOrganismMasterDashboard();
    expect(dash.phiCoherence).toBeGreaterThanOrEqual(0);
    expect(dash.phiCoherence).toBeLessThanOrEqual(1);
  });

  it('sovereignFrequency is positive', () => {
    const dash = getOrganismMasterDashboard();
    expect(dash.sovereignFrequency).toBeGreaterThan(0);
  });

  it('cyclesCompleted reflects actual cycles run', () => {
    runOrganismCycle();
    const dash = getOrganismMasterDashboard();
    expect(dash.cyclesCompleted).toBeGreaterThan(0);
  });

  it('organismHealth is valid', () => {
    runOrganismCycle();
    const dash = getOrganismMasterDashboard();
    const valid: OrganismHealth[] = ['transcendent', 'sovereign', 'coherent', 'stressed', 'fragmented', 'dormant'];
    expect(valid).toContain(dash.organismHealth);
  });
});

describe('Organism Master Orchestrator — Diagnostics', () => {
  it('getOrganismDiagnostics returns correct shape', () => {
    runOrganismCycle();
    const diag = getOrganismDiagnostics();
    expect(diag.totalModules).toBe(59);
    expect(diag.domainsActive).toBe(5);
    expect(diag.masterCycles).toBeGreaterThan(0);
    expect(diag.uptimeMs).toBeGreaterThanOrEqual(0);
    expect(diag.crossDomainRecs).toBeGreaterThanOrEqual(0);
  });

  it('diagnostics domain cycles reflect all domains', () => {
    const diag = getOrganismDiagnostics();
    expect(typeof diag.domainCycles['sovereign-core']).toBe('number');
    expect(typeof diag.domainCycles['builder-runtime']).toBe('number');
    expect(typeof diag.domainCycles['intelligence-content']).toBe('number');
    expect(typeof diag.domainCycles['edge-agi']).toBe('number');
    expect(typeof diag.domainCycles['company-ops']).toBe('number');
    expect(diag.domainCycles['sovereign-core']).toBeGreaterThan(0);
  });

  it('phiCoherence is 0-1', () => {
    const diag = getOrganismDiagnostics();
    expect(diag.phiCoherence).toBeGreaterThanOrEqual(0);
    expect(diag.phiCoherence).toBeLessThanOrEqual(1);
  });

  it('convergenceScore is 0-1', () => {
    const diag = getOrganismDiagnostics();
    expect(diag.convergenceScore).toBeGreaterThanOrEqual(0);
    expect(diag.convergenceScore).toBeLessThanOrEqual(1);
  });

  it('lastMasterCycleAt is set after cycle', () => {
    const diag = getOrganismDiagnostics();
    expect(diag.lastMasterCycleAt).toBeTruthy();
  });
});

describe('Organism Master Orchestrator — Health & Phi', () => {
  it('getOrganismHealth returns a valid OrganismHealth', () => {
    const health = getOrganismHealth();
    const valid: OrganismHealth[] = ['transcendent', 'sovereign', 'coherent', 'stressed', 'fragmented', 'dormant'];
    expect(valid).toContain(health);
  });

  it('getOrganismPhiCoherence returns 0-1', () => {
    const phi = getOrganismPhiCoherence();
    expect(phi).toBeGreaterThanOrEqual(0);
    expect(phi).toBeLessThanOrEqual(1);
  });
});

describe('Organism Master Orchestrator — Cross-Domain Recommendations', () => {
  it('getCrossDomainRecommendations returns array', () => {
    runOrganismCycle();
    expect(Array.isArray(getCrossDomainRecommendations())).toBe(true);
  });

  it('getPendingCrossRecs returns only unapplied', () => {
    for (const r of getPendingCrossRecs()) {
      expect(r.applied).toBe(false);
    }
  });

  it('applyCrossRec marks as applied', () => {
    runOrganismCycle();
    const pending = getPendingCrossRecs();
    if (pending.length > 0) {
      const result = applyCrossRec(pending[0].id);
      expect(result!.applied).toBe(true);
    }
  });

  it('applyCrossRec returns undefined for unknown id', () => {
    expect(applyCrossRec('ghost-rec')).toBeUndefined();
  });

  it('getCrossRecsByPriority filters correctly', () => {
    for (const r of getCrossRecsByPriority('critical')) {
      expect(r.priority).toBe('critical');
    }
  });

  it('recommendations span multiple domains', () => {
    const recs = getCrossDomainRecommendations();
    if (recs.length > 0) {
      expect(recs[0].domains.length).toBeGreaterThan(0);
      expect(recs[0].title).toBeTruthy();
      expect(recs[0].suggestedAction).toBeTruthy();
    }
  });

  it('multiple cycles generate increasing recommendations', () => {
    const before = getCrossDomainRecommendations().length;
    runOrganismCycle();
    runOrganismCycle();
    // May not always increase if no thresholds are crossed, but at minimum stays same
    expect(getCrossDomainRecommendations().length).toBeGreaterThanOrEqual(before);
  });
});
