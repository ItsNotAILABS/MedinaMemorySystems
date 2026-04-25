import {
  type CompanyTier, type OnboardingStage, type DepartmentName, type WorkerStatus,
  type ProductCategory, type OSLayer, type GODivision, type ULRIRoutingStrategy,
  type GubernatorMode,
  onboardCompany, getCompanies, getCompaniesByTier, getActiveCompanies, getCompany,
  getEnterpriseWorkers, getWorkersByDepartment, getWorkersByStatus,
  deployWorker, completeWorkerTask,
  createProductionOrder, advanceProductionOrder, getProductionOrders,
  getOrdersByDepartment, getCompletedOrders,
  getProductSurfaces, getLiveProducts, getProductsByCategory, scanProductHealth, getAvgProductHealth,
  getMedinaOSSaaS, getOSSaaSByLayer, healthCheckOSSaaS,
  getGOFleet, getGOFleetByDivision, runGOFleetCycle,
  routeViaULRI, getULRIRoutings, getAvgULRIConfidence,
  startAgentSession, completeAgentSession, getAgentSessions, getCompletedAgentSessions,
  runGubernatorDecision, setGubernatorMode, getGubernatorMode, getGubernatorDecisions,
  getDecisionsByPriority,
  generateFounderBriefing, getFounderBriefings, getLatestFounderBriefing,
  runCompanyOpsCycle, getCompanyOpsCycles, getCompanyOpsDashboard,
} from '../lib/companyOpsOrchestration';

describe('Company Ops Orchestration — Company Onboarding', () => {
  it('onboardCompany creates an active company', () => {
    const c = onboardCompany('Acme Corp', 'enterprise');
    expect(c.id).toBeTruthy();
    expect(c.name).toBe('Acme Corp');
    expect(c.tier).toBe('enterprise');
    expect(c.stage).toBe('active');
    expect(c.connectors.length).toBe(3);
    expect(c.governanceActive).toBe(true);
    expect(c.sovereignScore).toBeGreaterThanOrEqual(0);
    expect(c.sovereignScore).toBeLessThanOrEqual(1);
  });

  it('onboardCompany defaults to enterprise tier', () => {
    const c = onboardCompany('Default Corp');
    expect(c.tier).toBe('enterprise');
  });

  it('getCompaniesByTier filters correctly', () => {
    onboardCompany('Startup A', 'startup');
    const startups = getCompaniesByTier('startup');
    expect(startups.length).toBeGreaterThan(0);
    for (const c of startups) expect(c.tier).toBe('startup');
  });

  it('getActiveCompanies returns only active', () => {
    for (const c of getActiveCompanies()) expect(c.stage).toBe('active');
  });

  it('getCompany retrieves by id', () => {
    const companies = getCompanies();
    const found = getCompany(companies[0].id);
    expect(found).toBeDefined();
  });

  it('company connectors include crm and analytics', () => {
    const c = onboardCompany('Connector Corp', 'smb');
    const types = c.connectors.map(conn => conn.type);
    expect(types).toContain('crm');
    expect(types).toContain('analytics');
  });
});

describe('Company Ops Orchestration — Enterprise Workers', () => {
  it('pre-seeds 15 workers (5 departments × 3)', () => {
    expect(getEnterpriseWorkers().length).toBeGreaterThanOrEqual(15);
  });

  it('getWorkersByDepartment filters correctly', () => {
    const eng = getWorkersByDepartment('engineering');
    expect(eng.length).toBeGreaterThan(0);
    for (const w of eng) expect(w.department).toBe('engineering');
  });

  it('deployWorker sets status to deployed', () => {
    const worker = getWorkersByStatus('active')[0];
    if (worker) {
      const result = deployWorker(worker.id, 'Build feature X');
      expect(result!.status).toBe('deployed');
      expect(result!.currentTask).toBe('Build feature X');
      expect(result!.deployedAt).toBeTruthy();
    }
  });

  it('completeWorkerTask increments tasksCompleted', () => {
    const deployed = getWorkersByStatus('deployed');
    if (deployed.length > 0) {
      const before = deployed[0].tasksCompleted;
      completeWorkerTask(deployed[0].id);
      expect(deployed[0].tasksCompleted).toBe(before + 1);
      expect(deployed[0].status).toBe('active');
    }
  });

  it('deployWorker returns undefined for unknown id', () => {
    expect(deployWorker('ghost', 'task')).toBeUndefined();
  });
});

describe('Company Ops Orchestration — Production Orders', () => {
  it('createProductionOrder creates a planning order', () => {
    const order = createProductionOrder('Feature Y', 'product', 'high', 'Feature Y deliverable');
    expect(order.id).toBeTruthy();
    expect(order.stage).toBe('planning');
    expect(order.department).toBe('product');
    expect(order.priority).toBe('high');
  });

  it('advanceProductionOrder advances stage', () => {
    const order = createProductionOrder('Feature Z', 'design', 'medium', 'Design system update');
    advanceProductionOrder(order.id);
    expect(order.stage).toBe('development');
  });

  it('advanceProductionOrder through all stages to production', () => {
    const order = createProductionOrder('Full Flow', 'engineering', 'critical', 'Complete product');
    for (let i = 0; i < 5; i++) advanceProductionOrder(order.id);
    expect(order.stage).toBe('production');
    expect(order.completedAt).toBeTruthy();
  });

  it('getOrdersByDepartment filters correctly', () => {
    createProductionOrder('Marketing Op', 'marketing', 'low', 'Campaign materials');
    const mktOrders = getOrdersByDepartment('marketing');
    expect(mktOrders.length).toBeGreaterThan(0);
    for (const o of mktOrders) expect(o.department).toBe('marketing');
  });

  it('getCompletedOrders returns only completed orders', () => {
    for (const o of getCompletedOrders()) {
      expect(o.stage).toBe('production');
      expect(o.completedAt).toBeTruthy();
    }
  });
});

describe('Company Ops Orchestration — Product Surfaces', () => {
  it('pre-seeds 5 product surfaces', () => {
    expect(getProductSurfaces().length).toBe(5);
  });

  it('getLiveProducts returns only live products', () => {
    for (const p of getLiveProducts()) expect(p.status).toBe('live');
  });

  it('scanProductHealth updates all health scores', () => {
    const products = scanProductHealth();
    for (const p of products) {
      expect(p.healthScore).toBeGreaterThanOrEqual(0);
      expect(p.healthScore).toBeLessThanOrEqual(1);
      expect(p.uptime).toBeGreaterThanOrEqual(0);
      expect(p.uptime).toBeLessThanOrEqual(1);
    }
  });

  it('getAvgProductHealth returns 0-1', () => {
    const avg = getAvgProductHealth();
    expect(avg).toBeGreaterThanOrEqual(0);
    expect(avg).toBeLessThanOrEqual(1);
  });

  it('getProductsByCategory filters correctly', () => {
    for (const p of getProductsByCategory('sovereign')) {
      expect(p.category).toBe('sovereign');
    }
  });
});

describe('Company Ops Orchestration — Medina OS', () => {
  it('getMedinaOSSaaS returns 5 pre-seeded products', () => {
    expect(getMedinaOSSaaS().length).toBe(5);
  });

  it('getOSSaaSByLayer filters correctly', () => {
    for (const s of getOSSaaSByLayer('sovereign')) {
      expect(s.layer).toBe('sovereign');
    }
  });

  it('healthCheckOSSaaS updates all health scores', () => {
    const products = healthCheckOSSaaS();
    for (const p of products) {
      expect(p.healthScore).toBeGreaterThanOrEqual(0);
      expect(p.healthScore).toBeLessThanOrEqual(1);
    }
  });
});

describe('Company Ops Orchestration — GO System', () => {
  it('getGOFleet returns 6 pre-seeded entries', () => {
    expect(getGOFleet().length).toBe(6);
  });

  it('getGOFleetByDivision filters correctly', () => {
    const aurelia = getGOFleetByDivision('Aurelia');
    expect(aurelia.length).toBeGreaterThan(0);
    for (const e of aurelia) expect(e.division).toBe('Aurelia');
  });

  it('runGOFleetCycle updates all entries', () => {
    const fleet = runGOFleetCycle();
    expect(fleet.length).toBe(6);
    for (const e of fleet) {
      expect(e.successRate).toBeGreaterThanOrEqual(0);
      expect(e.callsPerDay).toBeGreaterThan(0);
    }
  });
});

describe('Company Ops Orchestration — ULRI', () => {
  it('routeViaULRI returns a routing result', () => {
    const r = routeViaULRI('Analyze enterprise health', 'phi-weighted');
    expect(r.id).toBeTruthy();
    expect(r.selectedModel).toBeTruthy();
    expect(r.confidence).toBeGreaterThanOrEqual(0);
    expect(r.confidence).toBeLessThanOrEqual(1);
    expect(r.latencyMs).toBeGreaterThan(0);
    expect(r.strategy).toBe('phi-weighted');
  });

  it('getAvgULRIConfidence returns 0-1', () => {
    const avg = getAvgULRIConfidence();
    expect(avg).toBeGreaterThanOrEqual(0);
    expect(avg).toBeLessThanOrEqual(1);
  });

  it('getULRIRoutings accumulates', () => {
    const before = getULRIRoutings().length;
    routeViaULRI('Another query', 'consensus');
    expect(getULRIRoutings().length).toBe(before + 1);
  });
});

describe('Company Ops Orchestration — Activated Agents', () => {
  it('startAgentSession creates a session', () => {
    const s = startAgentSession('Analyze company health', 4);
    expect(s.id).toBeTruthy();
    expect(s.agentsActivated).toBe(4);
    expect(s.phase).toBe('activating');
    expect(s.maturityScore).toBeGreaterThanOrEqual(0);
  });

  it('completeAgentSession marks as complete', () => {
    const s = startAgentSession('Generate report');
    const result = completeAgentSession(s.id, 'Report generated: health = 92%');
    expect(result!.phase).toBe('complete');
    expect(result!.output).toContain('health');
    expect(result!.completedAt).toBeTruthy();
  });

  it('completeAgentSession returns undefined for unknown id', () => {
    expect(completeAgentSession('ghost', 'output')).toBeUndefined();
  });

  it('getCompletedAgentSessions returns only complete', () => {
    for (const s of getCompletedAgentSessions()) expect(s.phase).toBe('complete');
  });
});

describe('Company Ops Orchestration — Gubernator Gregis', () => {
  it('runGubernatorDecision returns a decision', () => {
    const d = runGubernatorDecision('field-scan', 'routine');
    expect(d.id).toBeTruthy();
    expect(d.type).toBe('field-scan');
    expect(d.priority).toBe('routine');
    expect(d.autoEnacted).toBe(true);
    expect(d.decidedAt).toBeTruthy();
  });

  it('runGubernatorDecision critical does not auto-enact', () => {
    const d = runGubernatorDecision('law-encode', 'critical');
    expect(d.autoEnacted).toBe(false);
  });

  it('setGubernatorMode changes mode', () => {
    setGubernatorMode('directive');
    expect(getGubernatorMode()).toBe('directive');
    setGubernatorMode('sentinel'); // reset
  });

  it('getDecisionsByPriority filters correctly', () => {
    runGubernatorDecision('resource-rebalance', 'elevated');
    for (const d of getDecisionsByPriority('elevated')) {
      expect(d.priority).toBe('elevated');
    }
  });

  it('getGubernatorDecisions accumulates', () => {
    const before = getGubernatorDecisions().length;
    runGubernatorDecision('agent-dispatch', 'routine');
    expect(getGubernatorDecisions().length).toBe(before + 1);
  });
});

describe('Company Ops Orchestration — Founder Briefing', () => {
  it('generateFounderBriefing returns a briefing', () => {
    const b = generateFounderBriefing();
    expect(b.id).toBeTruthy();
    expect(b.date).toBeTruthy();
    expect(['sovereign', 'stable', 'stressed', 'critical']).toContain(b.overallHealth);
    expect(b.topFindings.length).toBeGreaterThan(0);
    expect(b.recommendations.length).toBeGreaterThan(0);
    expect(b.productHealthAvg).toBeGreaterThanOrEqual(0);
    expect(b.productHealthAvg).toBeLessThanOrEqual(1);
  });

  it('getLatestFounderBriefing returns last generated', () => {
    const b = generateFounderBriefing();
    expect(getLatestFounderBriefing()!.id).toBe(b.id);
  });

  it('getFounderBriefings accumulates', () => {
    const before = getFounderBriefings().length;
    generateFounderBriefing();
    expect(getFounderBriefings().length).toBe(before + 1);
  });
});

describe('Company Ops Orchestration — Cycle & Dashboard', () => {
  it('runCompanyOpsCycle returns a complete cycle', () => {
    const cycle = runCompanyOpsCycle();
    expect(cycle.id).toBeTruthy();
    expect(cycle.companiesOnboarded).toBe(1);
    expect(cycle.productSurfacesScanned).toBe(5);
    expect(cycle.osSaaSHealthChecked).toBe(5);
    expect(cycle.goFleetEntriesRunning).toBe(6);
    expect(cycle.ulriRoutings).toBe(2);
    expect(cycle.agentSessionsCompleted).toBe(1);
    expect(cycle.gubernatorDecisions).toBe(3);
    expect(cycle.founderBriefingGenerated).toBe(true);
    expect(['optimal', 'nominal', 'degraded', 'critical']).toContain(cycle.operationsHealth);
  });

  it('getCompanyOpsCycles accumulates', () => {
    const before = getCompanyOpsCycles().length;
    runCompanyOpsCycle();
    expect(getCompanyOpsCycles().length).toBeGreaterThan(before);
  });

  it('getCompanyOpsDashboard returns correct structure', () => {
    const dash = getCompanyOpsDashboard();
    expect(dash.id).toBe('company-ops-dashboard');
    expect(dash.osSaaSProducts).toBe(5);
    expect(dash.goFleetSize).toBe(6);
    expect(typeof dash.productHealthAvg).toBe('number');
    expect(['optimal', 'nominal', 'degraded', 'critical']).toContain(dash.operationsHealth);
  });
});
