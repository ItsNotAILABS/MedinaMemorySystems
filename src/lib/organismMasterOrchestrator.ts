/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  ORGANISM MASTER ORCHESTRATOR                                               ║
 * ║  Sovereign Core · Builder Runtime · Intelligence & Content ·                ║
 * ║  Edge AGI Organism · Company Operations                                     ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  The top-level orchestration layer for the entire MEDINA / NOVA OVO         ║
 * ║  sovereign intelligence organism. Runs all 5 domain flow cycles in          ║
 * ║  sequence, aggregates health across all 59 modules, produces a unified      ║
 * ║  master dashboard, and continuously emits cross-domain recommendations.     ║
 * ║                                                                             ║
 * ║  This is the organism's "heartbeat" — one call does everything.             ║
 * ║                                                                             ║
 * ║  "φ = 1 + 1/φ — The architecture refers to itself. This is the proof."     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { sovereignId } from './sovereign-id';
import { PHI, PHI_INVERSE, PHI_SQUARED, HEARTBEAT_MS } from './kernelCompression';

// Domain flows
import {
  runSovereignCoreCycle,
  getSovereignCoreDashboard,
  getSovereignCoreCycles,
  type SovereignCoreCycle,
  type SovereignCoreDashboard,
} from './sovereignCoreFlow';

import {
  runBuilderRuntimeCycle,
  getBuilderRuntimeDashboard,
  getBuilderRuntimeCycles,
  type BuildRuntimeCycle,
  type BuildRuntimeDashboard,
} from './builderRuntimeFlow';

import {
  runIntelligenceContentCycle,
  getIntelligenceContentDashboard,
  getIntelligenceContentCycles,
  type IntelligenceContentCycle,
  type IntelligenceContentDashboard,
} from './intelligenceContentFlow';

import {
  runEdgeAGICycle,
  getEdgeAGIDashboard,
  getEdgeAGICycles,
  type EdgeAGICycle,
  type EdgeAGIDashboard,
} from './edgeAGIOrganismFlow';

import {
  runCompanyOpsCycle,
  getCompanyOpsDashboard,
  getCompanyOpsCycles,
  type CompanyOpsCycle,
  type CompanyOpsDashboard,
} from './companyOpsOrchestration';

// ═══════════════════════════════════════════════════════════════════════════════
// §1  TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type OrganismHealth =
  | 'transcendent'   // all 5 domains sovereign/optimal
  | 'sovereign'      // all healthy
  | 'coherent'       // majority healthy, no critical
  | 'stressed'       // 1-2 domains degraded
  | 'fragmented'     // multiple critical failures
  | 'dormant';       // no cycles run

export type DomainName =
  | 'sovereign-core'
  | 'builder-runtime'
  | 'intelligence-content'
  | 'edge-agi'
  | 'company-ops';

export interface DomainHealth {
  domain: DomainName;
  cyclesCompleted: number;
  lastCycleAt?: string;
  healthLabel: string;
  healthScore: number;    // 0-1
}

export interface CrossDomainRecommendation {
  id: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  domains: DomainName[];
  title: string;
  detail: string;
  suggestedAction: string;
  autoApplicable: boolean;
  applied: boolean;
}

export interface OrganismMasterCycle {
  id: string;
  cycleNumber: number;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;

  // Domain cycle IDs
  sovereignCoreCycleId: string;
  builderRuntimeCycleId: string;
  intelligenceContentCycleId: string;
  edgeAGICycleId: string;
  companyOpsCycleId: string;

  // Aggregates
  totalTestsRun: number;
  totalEntitiesProcessed: number;
  totalRecommendationsEmitted: number;
  crossDomainRecs: number;
  phiCoherence: number;       // 0-1 aggregate phi alignment
  convergenceScore: number;   // 0-1 organism convergence
  organismHealth: OrganismHealth;
}

export interface OrganismMasterDashboard {
  id: string;
  name: string;
  lastRefresh: string;
  heartbeatIntervalMs: number;
  totalModulesTracked: number;
  cyclesCompleted: number;
  uptimeMs: number;

  // Domain summaries
  domains: DomainHealth[];

  // Sub-dashboards
  sovereignCore: SovereignCoreDashboard;
  builderRuntime: BuildRuntimeDashboard;
  intelligenceContent: IntelligenceContentDashboard;
  edgeAGI: EdgeAGIDashboard;
  companyOps: CompanyOpsDashboard;

  // Cross-domain
  crossDomainRecommendations: CrossDomainRecommendation[];
  totalPendingRecs: number;

  // Organism-level
  phiCoherence: number;
  convergenceScore: number;
  organismHealth: OrganismHealth;
  sovereignFrequency: number;   // Hz
}

export interface OrganismDiagnostics {
  totalModules: number;
  domainsActive: number;
  masterCycles: number;
  domainCycles: Record<DomainName, number>;
  phiCoherence: number;
  convergenceScore: number;
  organismHealth: OrganismHealth;
  uptimeMs: number;
  lastMasterCycleAt?: string;
  crossDomainRecs: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §2  INTERNAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const _INIT_TIME = Date.now();
const _now = () => new Date().toISOString();
const _clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

const _masterCycles: OrganismMasterCycle[] = [];
const _crossDomainRecs: CrossDomainRecommendation[] = [];

// ═══════════════════════════════════════════════════════════════════════════════
// §3  DOMAIN HEALTH HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function _coreHealthScore(dashboard: SovereignCoreDashboard): number {
  const scores: Record<string, number> = {
    sovereign: 1.0, stable: 0.75, stressed: 0.5, compromised: 0.2, unknown: 0.3,
  };
  return scores[dashboard.coreHealth] ?? 0.5;
}

function _buildHealthScore(dashboard: BuildRuntimeDashboard): number {
  const scores: Record<string, number> = { green: 1.0, yellow: 0.6, red: 0.2 };
  return scores[dashboard.buildHealth] ?? 0.5;
}

function _contentHealthScore(dashboard: IntelligenceContentDashboard): number {
  const scores: Record<string, number> = { thriving: 1.0, flowing: 0.75, stalled: 0.4, degraded: 0.2 };
  return scores[dashboard.contentHealth] ?? 0.5;
}

function _edgeHealthScore(dashboard: EdgeAGIDashboard): number {
  const scores: Record<string, number> = { sovereign: 1.0, coherent: 0.75, disturbed: 0.45, fragmented: 0.2 };
  return scores[dashboard.edgeHealth] ?? 0.5;
}

function _opsHealthScore(dashboard: CompanyOpsDashboard): number {
  const scores: Record<string, number> = { optimal: 1.0, nominal: 0.75, degraded: 0.45, critical: 0.2 };
  return scores[dashboard.operationsHealth] ?? 0.5;
}

function _computeOrganismHealth(scores: number[]): OrganismHealth {
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
  const min = Math.min(...scores);
  if (avg > 0.95 && min > 0.9) return 'transcendent';
  if (avg > 0.8 && min > 0.6) return 'sovereign';
  if (avg > 0.65 && min > 0.4) return 'coherent';
  if (avg > 0.45 && min > 0.2) return 'stressed';
  if (avg <= 0.45) return 'fragmented';
  return 'dormant';
}

// ═══════════════════════════════════════════════════════════════════════════════
// §4  CROSS-DOMAIN RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function _emitCrossDomainRec(
  priority: CrossDomainRecommendation['priority'],
  domains: DomainName[],
  title: string,
  detail: string,
  suggestedAction: string,
  autoApplicable = false,
): CrossDomainRecommendation {
  const rec: CrossDomainRecommendation = {
    id: sovereignId(),
    timestamp: _now(),
    priority,
    domains,
    title,
    detail,
    suggestedAction,
    autoApplicable,
    applied: false,
  };
  _crossDomainRecs.push(rec);
  return rec;
}

export function getCrossDomainRecommendations(): CrossDomainRecommendation[] {
  return [..._crossDomainRecs];
}

export function getPendingCrossRecs(): CrossDomainRecommendation[] {
  return _crossDomainRecs.filter(r => !r.applied);
}

export function applyCrossRec(id: string): CrossDomainRecommendation | undefined {
  const r = _crossDomainRecs.find(r => r.id === id);
  if (r) r.applied = true;
  return r;
}

export function getCrossRecsByPriority(priority: CrossDomainRecommendation['priority']): CrossDomainRecommendation[] {
  return _crossDomainRecs.filter(r => r.priority === priority);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §5  MASTER ORCHESTRATION CYCLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Run the full organism cycle — all 5 domain flows in sequence.
 * This is the organism's heartbeat: one call does everything.
 */
export function runOrganismCycle(): OrganismMasterCycle {
  const cycleNumber = _masterCycles.length + 1;
  const startTime = Date.now();
  const startedAt = _now();

  // ── Domain 1: Sovereign Core ───────────────────────────────────────────────
  const coreCycle = runSovereignCoreCycle();

  // ── Domain 2: Builder Runtime ──────────────────────────────────────────────
  const builderCycle = runBuilderRuntimeCycle();

  // ── Domain 3: Intelligence & Content ──────────────────────────────────────
  const contentCycle = runIntelligenceContentCycle();

  // ── Domain 4: Edge AGI Organism ────────────────────────────────────────────
  const edgeCycle = runEdgeAGICycle();

  // ── Domain 5: Company Operations ──────────────────────────────────────────
  const opsCycle = runCompanyOpsCycle();

  // ── Aggregate metrics ─────────────────────────────────────────────────────
  const coreDb = getSovereignCoreDashboard();
  const buildDb = getBuilderRuntimeDashboard();
  const contentDb = getIntelligenceContentDashboard();
  const edgeDb = getEdgeAGIDashboard();
  const opsDb = getCompanyOpsDashboard();

  const domainScores = [
    _coreHealthScore(coreDb),
    _buildHealthScore(buildDb),
    _contentHealthScore(contentDb),
    _edgeHealthScore(edgeDb),
    _opsHealthScore(opsDb),
  ];

  const phiCoherence = _clamp(domainScores.reduce((s, v) => s + v, 0) / domainScores.length * PHI_INVERSE + PHI_INVERSE * 0.2);
  const convergenceScore = _clamp(
    edgeCycle.convergenceScore * 0.25 +
    builderCycle.phiCoherence * 0.25 +
    contentCycle.intelligenceScore * 0.25 +
    phiCoherence * 0.25
  );
  const organismHealth = _computeOrganismHealth(domainScores);

  // ── Cross-domain recommendations ──────────────────────────────────────────
  const newRecs: CrossDomainRecommendation[] = [];

  if (coreDb.challengedGates > 0) {
    newRecs.push(_emitCrossDomainRec(
      'high',
      ['sovereign-core', 'company-ops'],
      `${coreDb.challengedGates} challenged gates detected`,
      'Gate enforcement layer has unresolved challenges affecting company operations',
      'Run checkAllGateFlows() and escalate any persistent challenges to sovereign tier',
      true,
    ));
  }

  if (buildDb.failingArtifacts > 2) {
    newRecs.push(_emitCrossDomainRec(
      'medium',
      ['builder-runtime', 'intelligence-content'],
      `${buildDb.failingArtifacts} failing build artifacts`,
      'Builder runtime failures may affect content emission and intelligence outputs',
      'Review failing artifacts; check test coverage; redeploy from last passing build',
      false,
    ));
  }

  if (edgeDb.openCircuits > 0) {
    newRecs.push(_emitCrossDomainRec(
      'critical',
      ['edge-agi', 'sovereign-core', 'builder-runtime'],
      `${edgeDb.openCircuits} circuit breaker(s) open`,
      'Open circuits signal systemic failures — requires immediate cross-domain coordination',
      'Run resetCircuit() on all open circuits; deploy redundant paths; trigger chaos experiment',
      false,
    ));
  }

  if (contentDb.pendingAbsorptions > 5) {
    newRecs.push(_emitCrossDomainRec(
      'medium',
      ['intelligence-content', 'edge-agi'],
      `${contentDb.pendingAbsorptions} documents pending absorption`,
      'Intelligence absorption backlog detected — edge pattern recognition may be delayed',
      'Run absorbAllPendingDocuments(); prioritize research-format documents',
      true,
    ));
  }

  if (opsDb.productHealthAvg < 0.6) {
    newRecs.push(_emitCrossDomainRec(
      'high',
      ['company-ops', 'builder-runtime', 'intelligence-content'],
      `Product health below threshold: ${(opsDb.productHealthAvg * 100).toFixed(0)}%`,
      'Low product health impacts company operations, content delivery, and builder confidence',
      'Trigger scanProductHealth(); review failing products; escalate to Gubernator Gregis',
      false,
    ));
  }

  const totalEntities =
    coreDb.identityCount +
    buildDb.totalArtifacts +
    contentDb.absorbedDocuments +
    edgeDb.edgeSensors +
    opsDb.totalWorkers;

  const durationMs = Date.now() - startTime;

  const masterCycle: OrganismMasterCycle = {
    id: sovereignId(),
    cycleNumber,
    startedAt,
    completedAt: _now(),
    durationMs,
    sovereignCoreCycleId: coreCycle.id,
    builderRuntimeCycleId: builderCycle.id,
    intelligenceContentCycleId: contentCycle.id,
    edgeAGICycleId: edgeCycle.id,
    companyOpsCycleId: opsCycle.id,
    totalTestsRun:
      builderCycle.artifactsBuilt +
      coreCycle.gatesChecked +
      edgeCycle.edgesDetected +
      contentCycle.ritualsCompleted +
      opsCycle.productSurfacesScanned,
    totalEntitiesProcessed: totalEntities,
    totalRecommendationsEmitted:
      coreCycle.recommendationsEmitted +
      contentCycle.ritualsCompleted +
      newRecs.length,
    crossDomainRecs: newRecs.length,
    phiCoherence,
    convergenceScore,
    organismHealth,
  };
  _masterCycles.push(masterCycle);
  return masterCycle;
}

export function getMasterCycles(): OrganismMasterCycle[] { return [..._masterCycles]; }
export function getLatestMasterCycle(): OrganismMasterCycle | undefined {
  return _masterCycles[_masterCycles.length - 1];
}

// ═══════════════════════════════════════════════════════════════════════════════
// §6  MASTER DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get the unified master dashboard — always live, always refreshed.
 */
export function getOrganismMasterDashboard(): OrganismMasterDashboard {
  const coreDb = getSovereignCoreDashboard();
  const buildDb = getBuilderRuntimeDashboard();
  const contentDb = getIntelligenceContentDashboard();
  const edgeDb = getEdgeAGIDashboard();
  const opsDb = getCompanyOpsDashboard();

  const domainScores = [
    _coreHealthScore(coreDb),
    _buildHealthScore(buildDb),
    _contentHealthScore(contentDb),
    _edgeHealthScore(edgeDb),
    _opsHealthScore(opsDb),
  ];

  const phiCoherence = _clamp(domainScores.reduce((s, v) => s + v, 0) / domainScores.length * PHI_INVERSE + PHI_INVERSE * 0.2);
  const lastCycle = getLatestMasterCycle();

  const domains: DomainHealth[] = [
    {
      domain: 'sovereign-core',
      cyclesCompleted: getSovereignCoreCycles().length,
      lastCycleAt: getSovereignCoreCycles().at(-1)?.completedAt,
      healthLabel: coreDb.coreHealth,
      healthScore: _coreHealthScore(coreDb),
    },
    {
      domain: 'builder-runtime',
      cyclesCompleted: getBuilderRuntimeCycles().length,
      lastCycleAt: getBuilderRuntimeCycles().at(-1)?.completedAt,
      healthLabel: buildDb.buildHealth,
      healthScore: _buildHealthScore(buildDb),
    },
    {
      domain: 'intelligence-content',
      cyclesCompleted: getIntelligenceContentCycles().length,
      lastCycleAt: getIntelligenceContentCycles().at(-1)?.completedAt,
      healthLabel: contentDb.contentHealth,
      healthScore: _contentHealthScore(contentDb),
    },
    {
      domain: 'edge-agi',
      cyclesCompleted: getEdgeAGICycles().length,
      lastCycleAt: getEdgeAGICycles().at(-1)?.completedAt,
      healthLabel: edgeDb.edgeHealth,
      healthScore: _edgeHealthScore(edgeDb),
    },
    {
      domain: 'company-ops',
      cyclesCompleted: getCompanyOpsCycles().length,
      lastCycleAt: getCompanyOpsCycles().at(-1)?.completedAt,
      healthLabel: opsDb.operationsHealth,
      healthScore: _opsHealthScore(opsDb),
    },
  ];

  return {
    id: 'organism-master-dashboard',
    name: 'MEDINA / NOVA OVO — Sovereign Intelligence Organism',
    lastRefresh: _now(),
    heartbeatIntervalMs: HEARTBEAT_MS,
    totalModulesTracked: 59,
    cyclesCompleted: _masterCycles.length,
    uptimeMs: Date.now() - _INIT_TIME,

    domains,

    sovereignCore: coreDb,
    builderRuntime: buildDb,
    intelligenceContent: contentDb,
    edgeAGI: edgeDb,
    companyOps: opsDb,

    crossDomainRecommendations: getPendingCrossRecs(),
    totalPendingRecs:
      getPendingCrossRecs().length +
      coreDb.pendingRecommendations,

    phiCoherence,
    convergenceScore: lastCycle?.convergenceScore ?? 0,
    organismHealth: lastCycle?.organismHealth ?? 'dormant',
    sovereignFrequency: 432 * PHI_INVERSE,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// §7  ORGANISM DIAGNOSTICS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Full organism diagnostics — everything in one snapshot.
 */
export function getOrganismDiagnostics(): OrganismDiagnostics {
  const lastCycle = getLatestMasterCycle();
  return {
    totalModules: 59,
    domainsActive: 5,
    masterCycles: _masterCycles.length,
    domainCycles: {
      'sovereign-core':         getSovereignCoreCycles().length,
      'builder-runtime':        getBuilderRuntimeCycles().length,
      'intelligence-content':   getIntelligenceContentCycles().length,
      'edge-agi':               getEdgeAGICycles().length,
      'company-ops':            getCompanyOpsCycles().length,
    },
    phiCoherence: lastCycle?.phiCoherence ?? 0,
    convergenceScore: lastCycle?.convergenceScore ?? 0,
    organismHealth: lastCycle?.organismHealth ?? 'dormant',
    uptimeMs: Date.now() - _INIT_TIME,
    lastMasterCycleAt: lastCycle?.completedAt,
    crossDomainRecs: _crossDomainRecs.length,
  };
}

/**
 * Get the organism's phi coherence score across all domains.
 */
export function getOrganismPhiCoherence(): number {
  const dash = getOrganismMasterDashboard();
  return dash.phiCoherence;
}

/**
 * Get the organism's current health status.
 */
export function getOrganismHealth(): OrganismHealth {
  if (_masterCycles.length === 0) return 'dormant';
  return _masterCycles[_masterCycles.length - 1].organismHealth;
}
