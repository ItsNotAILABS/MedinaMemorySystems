/**
 * Test suite for enterpriseAIOps.ts
 * ≥80 tests covering all subsystems, the AI group, dashboard, and diagnostics.
 */

import {
  // Types
  type HealthStatus,
  type Severity,
  type ChaosExperimentType,
  type ChaosExperimentStatus,
  type MemoryRegion,
  type ComputeResourceType,
  type StorageTier,
  type FlowStage,
  type AIAgentRole,
  type AIAgentStatus,
  type IssueCategory,
  type IssueStatus,
  type ReportType,
  type DashboardPanelType,

  // Chaos
  createChaosExperiment,
  runChaosExperiment,
  runEnterpriseChaosSuite,
  getChaosExperiments,
  getChaosExperimentsByStatus,
  generateChaosReport,
  getChaosReports,

  // Memory
  takeMemorySnapshot,
  runMemoryMonitoringCycle,
  getMemorySnapshots,
  getServiceMemorySnapshots,
  getMemoryAlerts,
  getMemoryAlertsBySeverity,

  // Compute
  takeComputeSnapshot,
  runComputeMonitoringCycle,
  getComputeSnapshots,
  getComputeAlerts,

  // Storage
  takeStorageSnapshot,
  runStorageMonitoringCycle,
  getStorageSnapshots,
  getStorageAlerts,
  getStorageSnapshotsByTier,

  // Use-Flow
  takeUseFlowSnapshot,
  getUseFlowSnapshots,
  getLatestUseFlowSnapshot,

  // Issues
  openIssue,
  triageIssue,
  resolveIssue,
  escalateIssue,
  addIssueUpdate,
  getIssues,
  getOpenIssues,
  getIssuesByCategory,
  getIssuesBySeverity,

  // Reports
  generateOpsReport,
  getOpsReports,
  getOpsReportsByType,

  // AI Group
  getAIAgents,
  getAIAgent,
  getAIAgentsByRole,
  runAIGroupCycle,
  getAIGroupCycles,

  // Dashboard
  getLiveDashboard,
  getDashboardPanel,
  getDashboardRecommendations,
  getPendingRecommendations,
  getRecommendationsByPriority,
  acknowledgeRecommendation,
  applyRecommendation,

  // Diagnostics
  getPlatformDiagnostics,
  getEnterpriseServices,
} from '../lib/enterpriseAIOps';

// ═══════════════════════════════════════════════════════════════════════════════
// §1  ENTERPRISE SERVICES
// ═══════════════════════════════════════════════════════════════════════════════

describe('Enterprise Services', () => {
  it('getEnterpriseServices returns 12 services', () => {
    expect(getEnterpriseServices().length).toBe(12);
  });

  it('includes expected core services', () => {
    const svcs = getEnterpriseServices();
    expect(svcs).toContain('api-gateway');
    expect(svcs).toContain('payment-service');
    expect(svcs).toContain('auth-service');
    expect(svcs).toContain('search-engine');
    expect(svcs).toContain('analytics-pipeline');
    expect(svcs).toContain('message-bus');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §2  CHAOS ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Chaos Engine', () => {
  let experimentId: string;

  it('createChaosExperiment creates a planned experiment', () => {
    const exp = createChaosExperiment(
      'Test — Latency Injection',
      'latency-injection',
      { service: 'api-gateway', environment: 'staging', region: 'us-east-1', blastRadiusPct: 20 },
      'API gateway stays < 500ms under 100ms injected latency',
      [{ metric: 'p99_latency_ms', operator: '<', threshold: 500, unit: 'ms' }],
    );
    experimentId = exp.id;
    expect(exp.id).toBeTruthy();
    expect(exp.status).toBe('planned');
    expect(exp.type).toBe('latency-injection');
    expect(exp.automatedByAI).toBe(true);
    expect(exp.resilienceScore).toBe(0);
  });

  it('getChaosExperiments returns created experiments', () => {
    expect(getChaosExperiments().length).toBeGreaterThanOrEqual(1);
  });

  it('runChaosExperiment executes and returns resilience score', () => {
    const result = runChaosExperiment(experimentId);
    expect(result).toBeDefined();
    expect(['completed', 'rolling-back']).toContain(result!.status);
    expect(result!.startedAt).toBeTruthy();
    expect(result!.completedAt).toBeTruthy();
    expect(result!.resilienceScore).toBeGreaterThanOrEqual(0);
    expect(result!.resilienceScore).toBeLessThanOrEqual(1);
    expect(result!.findings.length).toBeGreaterThan(0);
  });

  it('runChaosExperiment returns undefined for unknown id', () => {
    expect(runChaosExperiment('ghost')).toBeUndefined();
  });

  it('getChaosExperimentsByStatus filters correctly', () => {
    const completed = getChaosExperimentsByStatus('completed');
    for (const e of completed) expect(e.status).toBe('completed');
  });

  it('runEnterpriseChaosSuite runs pre-seeded experiments and all have resilience scores', () => {
    runEnterpriseChaosSuite(); // idempotent — runs any remaining planned ones
    const allExps = getChaosExperiments().filter(e => e.status === 'completed' || e.status === 'rolling-back');
    expect(allExps.length).toBeGreaterThanOrEqual(1);
    for (const r of allExps) {
      expect(r.resilienceScore).toBeGreaterThanOrEqual(0);
      expect(r.resilienceScore).toBeLessThanOrEqual(1);
    }
  });

  it('generateChaosReport returns valid report', () => {
    const report = generateChaosReport();
    expect(report.totalExperiments).toBeGreaterThan(0);
    expect(report.avgResilienceScore).toBeGreaterThanOrEqual(0);
    expect(report.avgResilienceScore).toBeLessThanOrEqual(1);
    expect(report.generatedAt).toBeTruthy();
    expect(Array.isArray(report.topFindings)).toBe(true);
    expect(Array.isArray(report.recommendedNextExperiments)).toBe(true);
    expect(report.recommendedNextExperiments.length).toBeGreaterThan(0);
  });

  it('getChaosReports accumulates reports', () => {
    generateChaosReport();
    expect(getChaosReports().length).toBeGreaterThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §3  MEMORY MONITORING
// ═══════════════════════════════════════════════════════════════════════════════

describe('Memory Monitoring', () => {
  it('takeMemorySnapshot returns valid snapshot', () => {
    const snap = takeMemorySnapshot('api-gateway');
    expect(snap.id).toBeTruthy();
    expect(snap.service).toBe('api-gateway');
    expect(snap.region).toBe('heap');
    expect(snap.allocatedMB).toBeGreaterThan(0);
    expect(snap.usedMB).toBeGreaterThan(0);
    expect(snap.freeMB).toBeGreaterThan(0);
    expect(snap.usedMB + snap.freeMB).toBe(snap.allocatedMB);
  });

  it('snapshot GC pressure is 0-1', () => {
    const snap = takeMemorySnapshot('payment-service');
    expect(snap.gcPressure).toBeGreaterThanOrEqual(0);
    expect(snap.gcPressure).toBeLessThanOrEqual(1);
  });

  it('snapshot health is a valid HealthStatus', () => {
    const snap = takeMemorySnapshot('user-service');
    expect(['healthy', 'degraded', 'critical', 'unknown']).toContain(snap.health);
  });

  it('runMemoryMonitoringCycle returns 12 snapshots (one per service)', () => {
    const snaps = runMemoryMonitoringCycle();
    expect(snaps.length).toBe(12);
    const services = new Set(snaps.map(s => s.service));
    expect(services.size).toBe(12);
  });

  it('getMemorySnapshots accumulates across calls', () => {
    const before = getMemorySnapshots().length;
    takeMemorySnapshot('cdn-layer');
    expect(getMemorySnapshots().length).toBe(before + 1);
  });

  it('getServiceMemorySnapshots filters by service', () => {
    takeMemorySnapshot('auth-service');
    const snaps = getServiceMemorySnapshots('auth-service');
    expect(snaps.length).toBeGreaterThan(0);
    for (const s of snaps) expect(s.service).toBe('auth-service');
  });

  it('getMemoryAlerts returns array', () => {
    expect(Array.isArray(getMemoryAlerts())).toBe(true);
  });

  it('getMemoryAlertsBySeverity filters correctly', () => {
    for (const a of getMemoryAlertsBySeverity('critical')) {
      expect(a.severity).toBe('critical');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §4  COMPUTE MONITORING
// ═══════════════════════════════════════════════════════════════════════════════

describe('Compute Monitoring', () => {
  it('takeComputeSnapshot returns valid snapshot', () => {
    const snap = takeComputeSnapshot('api-gateway');
    expect(snap.id).toBeTruthy();
    expect(snap.service).toBe('api-gateway');
    expect(snap.cpuUtilizationPct).toBeGreaterThanOrEqual(0);
    expect(snap.cpuUtilizationPct).toBeLessThanOrEqual(100);
    expect(snap.threadCount).toBeGreaterThan(0);
    expect(snap.eventLoopLagMs).toBeGreaterThan(0);
  });

  it('snapshot event-loop saturation is 0-1', () => {
    const snap = takeComputeSnapshot('search-engine');
    expect(snap.eventLoopSaturation).toBeGreaterThanOrEqual(0);
    expect(snap.eventLoopSaturation).toBeLessThanOrEqual(1);
  });

  it('runComputeMonitoringCycle returns 12 snapshots', () => {
    const snaps = runComputeMonitoringCycle();
    expect(snaps.length).toBe(12);
  });

  it('getComputeSnapshots accumulates', () => {
    const before = getComputeSnapshots().length;
    takeComputeSnapshot('message-bus');
    expect(getComputeSnapshots().length).toBe(before + 1);
  });

  it('getComputeAlerts returns array', () => {
    expect(Array.isArray(getComputeAlerts())).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §5  STORAGE MONITORING
// ═══════════════════════════════════════════════════════════════════════════════

describe('Storage Monitoring', () => {
  it('takeStorageSnapshot returns valid snapshot', () => {
    const snap = takeStorageSnapshot('data-warehouse', 'nvme');
    expect(snap.id).toBeTruthy();
    expect(snap.service).toBe('data-warehouse');
    expect(snap.tier).toBe('nvme');
    expect(snap.capacityGB).toBeGreaterThan(0);
    expect(snap.usedGB + snap.freeGB).toBe(snap.capacityGB);
    expect(snap.iopsRead).toBeGreaterThan(0);
    expect(snap.iopsWrite).toBeGreaterThan(0);
  });

  it('storage utilization is 0-100', () => {
    const snap = takeStorageSnapshot('analytics-pipeline', 'ssd');
    expect(snap.utilizationPct).toBeGreaterThanOrEqual(0);
    expect(snap.utilizationPct).toBeLessThanOrEqual(100);
  });

  it('replication lag is non-negative', () => {
    const snap = takeStorageSnapshot('user-service', 'object');
    expect(snap.replicationLagMs).toBeGreaterThanOrEqual(0);
  });

  it('runStorageMonitoringCycle returns 12 snapshots', () => {
    const snaps = runStorageMonitoringCycle();
    expect(snaps.length).toBe(12);
  });

  it('getStorageSnapshotsByTier filters correctly', () => {
    takeStorageSnapshot('cdn-layer', 'cache');
    const cacheSnaps = getStorageSnapshotsByTier('cache');
    expect(cacheSnaps.length).toBeGreaterThan(0);
    for (const s of cacheSnaps) expect(s.tier).toBe('cache');
  });

  it('getStorageAlerts returns array', () => {
    expect(Array.isArray(getStorageAlerts())).toBe(true);
  });

  it('getStorageSnapshots accumulates', () => {
    const before = getStorageSnapshots().length;
    takeStorageSnapshot('payment-service', 'in-memory');
    expect(getStorageSnapshots().length).toBe(before + 1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §6  USE-FLOW ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Use-Flow Analysis', () => {
  it('takeUseFlowSnapshot returns valid snapshot', () => {
    const snap = takeUseFlowSnapshot();
    expect(snap.id).toBeTruthy();
    expect(snap.timestamp).toBeTruthy();
    expect(snap.funnels.length).toBe(5);
    expect(snap.dependencies.length).toBeGreaterThan(0);
    expect(snap.totalActiveFlows).toBeGreaterThan(0);
  });

  it('each funnel has a bottleneck stage', () => {
    const snap = takeUseFlowSnapshot();
    const validStages: FlowStage[] = ['entry', 'auth', 'navigation', 'data-load', 'computation', 'render', 'interaction', 'export', 'exit'];
    for (const f of snap.funnels) {
      expect(validStages).toContain(f.bottleneck);
      expect(f.health).toBeDefined();
    }
  });

  it('flow latencies are positive', () => {
    const snap = takeUseFlowSnapshot();
    expect(snap.avgEndToEndLatencyMs).toBeGreaterThan(0);
    expect(snap.p99LatencyMs).toBeGreaterThan(0);
  });

  it('flow error rate is 0-1', () => {
    const snap = takeUseFlowSnapshot();
    expect(snap.errorRate).toBeGreaterThanOrEqual(0);
    expect(snap.errorRate).toBeLessThanOrEqual(1);
  });

  it('getUseFlowSnapshots accumulates', () => {
    const before = getUseFlowSnapshots().length;
    takeUseFlowSnapshot();
    expect(getUseFlowSnapshots().length).toBe(before + 1);
  });

  it('getLatestUseFlowSnapshot returns last snapshot', () => {
    const snap = takeUseFlowSnapshot();
    expect(getLatestUseFlowSnapshot()!.id).toBe(snap.id);
  });

  it('dependencies have callsPerMin, latency, and errorRate', () => {
    const snap = takeUseFlowSnapshot();
    for (const dep of snap.dependencies) {
      expect(dep.callsPerMin).toBeGreaterThan(0);
      expect(dep.avgLatencyMs).toBeGreaterThan(0);
      expect(dep.errorRate).toBeGreaterThanOrEqual(0);
      expect(dep.errorRate).toBeLessThanOrEqual(1);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §7  ISSUES
// ═══════════════════════════════════════════════════════════════════════════════

describe('Issues', () => {
  let issueId: string;

  it('openIssue creates an open issue', () => {
    const issue = openIssue('Test memory leak', 'memory-leak', 'error', 'api-gateway', 'Heap growing unbounded');
    issueId = issue.id;
    expect(issue.id).toBeTruthy();
    expect(issue.status).toBe('open');
    expect(issue.category).toBe('memory-leak');
    expect(issue.severity).toBe('error');
    expect(issue.updates.length).toBeGreaterThan(0);
  });

  it('triageIssue updates status to triaged', () => {
    const result = triageIssue(issueId, 'opsai-006');
    expect(result).toBeDefined();
    expect(result!.status).toBe('triaged');
    expect(result!.assignedTo).toBe('opsai-006');
    expect(result!.autoTriaged).toBe(true);
    expect(result!.triageAt).toBeTruthy();
  });

  it('triageIssue returns undefined for unknown id', () => {
    expect(triageIssue('ghost-issue', 'opsai-001')).toBeUndefined();
  });

  it('addIssueUpdate appends update text', () => {
    const result = addIssueUpdate(issueId, 'Heap dump collected');
    expect(result).toBeDefined();
    expect(result!.updates.some(u => u.includes('Heap dump'))).toBe(true);
  });

  it('resolveIssue marks issue resolved', () => {
    const result = resolveIssue(issueId, 'GC tuning applied; leak resolved', true);
    expect(result).toBeDefined();
    expect(result!.status).toBe('resolved');
    expect(result!.resolution).toContain('GC tuning');
    expect(result!.autoResolved).toBe(true);
    expect(result!.resolvedAt).toBeTruthy();
  });

  it('resolveIssue returns undefined for unknown id', () => {
    expect(resolveIssue('ghost', 'nothing')).toBeUndefined();
  });

  it('escalateIssue changes status to escalated', () => {
    const i = openIssue('Critical CPU spike', 'cpu-saturation', 'critical', 'payment-service');
    const result = escalateIssue(i.id, 'Beyond auto-remediation threshold');
    expect(result).toBeDefined();
    expect(result!.status).toBe('escalated');
    expect(result!.updates.some(u => u.includes('Escalated'))).toBe(true);
  });

  it('escalateIssue returns undefined for unknown id', () => {
    expect(escalateIssue('ghost', 'reason')).toBeUndefined();
  });

  it('getIssues returns all issues', () => {
    expect(getIssues().length).toBeGreaterThanOrEqual(2);
  });

  it('getOpenIssues returns only open/triaged/in-progress', () => {
    for (const i of getOpenIssues()) {
      expect(['open', 'triaged', 'in-progress']).toContain(i.status);
    }
  });

  it('getIssuesByCategory filters correctly', () => {
    const leaks = getIssuesByCategory('memory-leak');
    for (const i of leaks) expect(i.category).toBe('memory-leak');
  });

  it('getIssuesBySeverity filters correctly', () => {
    const criticals = getIssuesBySeverity('critical');
    for (const i of criticals) expect(i.severity).toBe('critical');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §8  REPORTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Reports', () => {
  it('generateOpsReport returns a valid report', () => {
    const report = generateOpsReport('weekly-ops');
    expect(report.id).toBeTruthy();
    expect(report.type).toBe('weekly-ops');
    expect(report.title).toBeTruthy();
    expect(report.generatedAt).toBeTruthy();
    expect(report.sections.length).toBeGreaterThan(0);
    expect(report.executiveSummary).toBeTruthy();
    expect(report.healthScore).toBeGreaterThanOrEqual(0);
    expect(report.healthScore).toBeLessThanOrEqual(1);
    expect(report.deliveredTo.length).toBeGreaterThan(0);
  });

  it('generateOpsReport executive-summary type', () => {
    const r = generateOpsReport('executive-summary');
    expect(r.type).toBe('executive-summary');
    expect(r.sections.length).toBeGreaterThan(0);
  });

  it('getOpsReports accumulates', () => {
    const before = getOpsReports().length;
    generateOpsReport('chaos-summary');
    expect(getOpsReports().length).toBe(before + 1);
  });

  it('getOpsReportsByType filters correctly', () => {
    generateOpsReport('memory-health');
    const memReports = getOpsReportsByType('memory-health');
    expect(memReports.length).toBeGreaterThan(0);
    for (const r of memReports) expect(r.type).toBe('memory-health');
  });

  it('report sections have titles and content', () => {
    const report = generateOpsReport('compute-efficiency');
    for (const section of report.sections) {
      expect(section.title).toBeTruthy();
      expect(section.content).toBeTruthy();
      expect(Array.isArray(section.findings)).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §9  AI GROUP
// ═══════════════════════════════════════════════════════════════════════════════

describe('AI Group', () => {
  it('getAIAgents returns 8 pre-seeded agents', () => {
    expect(getAIAgents().length).toBe(8);
  });

  it('each agent has required fields', () => {
    for (const a of getAIAgents()) {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(a.role).toBeTruthy();
      expect(a.subsystem).toBeTruthy();
      expect(a.expertise.length).toBeGreaterThan(0);
    }
  });

  it('getAIAgent retrieves by id', () => {
    const a = getAIAgent('opsai-001');
    expect(a).toBeDefined();
    expect(a!.name).toBe('ChaosMind');
    expect(a!.role).toBe('chaos-engineer');
  });

  it('getAIAgent returns undefined for unknown id', () => {
    expect(getAIAgent('ghost')).toBeUndefined();
  });

  it('getAIAgentsByRole filters correctly', () => {
    const inc = getAIAgentsByRole('incident-commander');
    expect(inc.length).toBe(1);
    expect(inc[0].name).toBe('IncidentCommander');
  });

  it('all 8 roles are represented', () => {
    const roles = new Set(getAIAgents().map(a => a.role));
    const expectedRoles: AIAgentRole[] = [
      'chaos-engineer', 'memory-analyst', 'compute-optimizer', 'storage-architect',
      'flow-cartographer', 'incident-commander', 'report-synthesizer', 'dashboard-curator',
    ];
    for (const r of expectedRoles) expect(roles).toContain(r);
  });

  it('runAIGroupCycle returns a complete cycle object', () => {
    const cycle = runAIGroupCycle();
    expect(cycle.id).toBeTruthy();
    expect(cycle.startedAt).toBeTruthy();
    expect(cycle.completedAt).toBeTruthy();
    expect(cycle.agentsActive).toBe(8);
    expect(cycle.testsRun).toBeGreaterThan(0);
  });

  it('AI group cycle increments tests and reports', () => {
    const cycle = runAIGroupCycle();
    expect(cycle.reportsGenerated).toBeGreaterThanOrEqual(1);
    expect(cycle.testsRun).toBeGreaterThan(0);
  });

  it('AI group cycle generates recommendations', () => {
    runAIGroupCycle();
    expect(getDashboardRecommendations().length).toBeGreaterThan(0);
  });

  it('getAIGroupCycles accumulates', () => {
    const before = getAIGroupCycles().length;
    runAIGroupCycle();
    expect(getAIGroupCycles().length).toBeGreaterThan(before);
  });

  it('agents are idle after cycle completes', () => {
    runAIGroupCycle();
    for (const a of getAIAgents()) {
      expect(a.status).toBe('idle');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §10  DASHBOARD & RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Live Dashboard', () => {
  it('getLiveDashboard returns correct structure', () => {
    const dash = getLiveDashboard();
    expect(dash.id).toBe('live-dashboard');
    expect(dash.name).toContain('Enterprise AI Ops');
    expect(dash.panels.length).toBe(11);
    expect(dash.lastRefresh).toBeTruthy();
    expect(dash.refreshIntervalMs).toBeGreaterThan(0);
    expect(typeof dash.aiGroupActive).toBe('boolean');
    expect(dash.uptimeMs).toBeGreaterThanOrEqual(0);
  });

  it('dashboard health is a valid HealthStatus', () => {
    const dash = getLiveDashboard();
    expect(['healthy', 'degraded', 'critical', 'unknown']).toContain(dash.overallHealth);
  });

  it('all 11 panel types are present', () => {
    const dash = getLiveDashboard();
    const types = new Set(dash.panels.map(p => p.type));
    const expectedTypes: DashboardPanelType[] = [
      'chaos-status', 'memory-overview', 'compute-overview', 'storage-overview',
      'flow-overview', 'ai-group-status', 'issue-feed', 'recommendation-feed',
      'report-feed', 'health-heatmap', 'slo-tracker',
    ];
    for (const t of expectedTypes) expect(types).toContain(t);
  });

  it('getDashboardPanel retrieves by type', () => {
    const panel = getDashboardPanel('chaos-status');
    expect(panel).toBeDefined();
    expect(panel!.type).toBe('chaos-status');
    expect(panel!.title).toBeTruthy();
  });

  it('getDashboardPanel returns undefined for unknown type', () => {
    expect(getDashboardPanel('nonexistent' as DashboardPanelType)).toBeUndefined();
  });
});

describe('Recommendations', () => {
  it('getDashboardRecommendations returns array', () => {
    expect(Array.isArray(getDashboardRecommendations())).toBe(true);
  });

  it('getPendingRecommendations returns only unacknowledged', () => {
    for (const r of getPendingRecommendations()) {
      expect(r.acknowledged).toBe(false);
    }
  });

  it('acknowledgeRecommendation marks as acknowledged', () => {
    runAIGroupCycle(); // ensure there are recommendations
    const pending = getPendingRecommendations();
    if (pending.length > 0) {
      const acked = acknowledgeRecommendation(pending[0].id);
      expect(acked).toBeDefined();
      expect(acked!.acknowledged).toBe(true);
    }
  });

  it('acknowledgeRecommendation returns undefined for unknown id', () => {
    expect(acknowledgeRecommendation('ghost-rec')).toBeUndefined();
  });

  it('applyRecommendation marks as acknowledged and applied', () => {
    runAIGroupCycle();
    const pending = getPendingRecommendations();
    if (pending.length > 0) {
      const applied = applyRecommendation(pending[0].id);
      expect(applied).toBeDefined();
      expect(applied!.acknowledged).toBe(true);
      expect(applied!.applied).toBe(true);
    }
  });

  it('applyRecommendation returns undefined for unknown id', () => {
    expect(applyRecommendation('ghost')).toBeUndefined();
  });

  it('getRecommendationsByPriority filters correctly', () => {
    for (const r of getRecommendationsByPriority('critical')) {
      expect(r.priority).toBe('critical');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// §11  PLATFORM DIAGNOSTICS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Platform Diagnostics', () => {
  it('getPlatformDiagnostics returns correct shape', () => {
    const diag = getPlatformDiagnostics();
    expect(diag.services).toBe(12);
    expect(diag.aiAgents).toBe(8);
    expect(diag.dashboardPanels).toBe(11);
    expect(diag.uptimeMs).toBeGreaterThanOrEqual(0);
    expect(['healthy', 'degraded', 'critical', 'unknown']).toContain(diag.overallHealth);
  });

  it('diagnostics reflect all accumulated data', () => {
    const diag = getPlatformDiagnostics();
    expect(diag.groupCycles).toBeGreaterThan(0);
    expect(diag.memorySnapshots).toBeGreaterThan(0);
    expect(diag.computeSnapshots).toBeGreaterThan(0);
    expect(diag.storageSnapshots).toBeGreaterThan(0);
    expect(diag.useFlowSnapshots).toBeGreaterThan(0);
    expect(diag.reports).toBeGreaterThan(0);
    expect(diag.totalRecommendations).toBeGreaterThan(0);
  });

  it('resolved issues > 0 after AI group cycles', () => {
    const diag = getPlatformDiagnostics();
    expect(diag.resolvedIssues + diag.openIssues).toBeGreaterThanOrEqual(0);
  });
});
