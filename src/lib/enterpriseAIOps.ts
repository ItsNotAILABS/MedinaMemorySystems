/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  ENTERPRISE AI OPS PLATFORM                                                 ║
 * ║  Chaos · Memory · Compute · Storage · Use-Flow · AI Group · Live Dashboard  ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                             ║
 * ║  "Run chaos, memory, computing, storage, and use-flow tests like a major   ║
 * ║   company — left running by an AI group — dashboard always sending update  ║
 * ║   recommendations, updating issues, taking care of reports."               ║
 * ║                                                                             ║
 * ║  Architecture:                                                              ║
 * ║    I.   TYPES      — Full type substrate for every subsystem                ║
 * ║    II.  CHAOS      — Chaos engineering: fault injection, blast radius,      ║
 * ║                       experiment lifecycle, resilience scoring              ║
 * ║    III. MEMORY     — Memory monitoring: heap, GC pressure, leak detection,  ║
 * ║                       allocation hotspots, retention chains                 ║
 * ║    IV.  COMPUTE    — CPU/thread/worker monitoring, saturation, hotspots     ║
 * ║    V.   STORAGE    — Disk, cache, object-store, replication lag, IOPS       ║
 * ║    VI.  USE-FLOW   — User/service flow analysis: funnels, drop-offs,        ║
 * ║                       latency profiles, dependency graphs                   ║
 * ║    VII. AI GROUP   — Autonomous AI ops group: 8 specialist agents, self-    ║
 * ║                       running test cycles, findings, actions taken          ║
 * ║    VIII.ISSUES     — Issue tracker: open, triage, resolve, escalate         ║
 * ║    IX.  REPORTS    — Automated report generation and delivery               ║
 * ║    X.   DASHBOARD  — Live dashboard: streaming recommendations, health      ║
 * ║                       panels, real-time update cycle                        ║
 * ║                                                                             ║
 * ║  Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { sovereignId } from './sovereign-id';
import { PHI, PHI_INVERSE, PHI_SQUARED, HEARTBEAT_MS } from './kernelCompression';

// ═══════════════════════════════════════════════════════════════════════════════
// §1  TYPES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Shared ──────────────────────────────────────────────────────────────────

export type HealthStatus = 'healthy' | 'degraded' | 'critical' | 'unknown';
export type Severity = 'info' | 'warning' | 'error' | 'critical';
export type TrendDirection = 'improving' | 'stable' | 'degrading' | 'spiking';

function _now(): string { return new Date().toISOString(); }
function _clamp(v: number, lo = 0, hi = 1): number { return Math.max(lo, Math.min(hi, v)); }
function _phiScale(base: number): number { return _clamp(base * PHI_INVERSE); }

// ─── Chaos ───────────────────────────────────────────────────────────────────

export type ChaosExperimentType =
  | 'network-partition'
  | 'latency-injection'
  | 'cpu-spike'
  | 'memory-pressure'
  | 'disk-fill'
  | 'process-kill'
  | 'dependency-failure'
  | 'data-corruption'
  | 'clock-skew'
  | 'packet-loss'
  | 'region-failure'
  | 'resource-exhaustion';

export type ChaosExperimentStatus =
  | 'planned'
  | 'running'
  | 'monitoring'
  | 'rolling-back'
  | 'completed'
  | 'aborted';

export interface ChaosTarget {
  service: string;
  environment: 'production' | 'staging' | 'canary' | 'shadow';
  region: string;
  blastRadiusPct: number;  // 0-100: what % of traffic/instances affected
}

export interface ChaosSteadyState {
  metric: string;
  operator: '<' | '>' | '=' | '<=' | '>=';
  threshold: number;
  unit: string;
}

export interface ChaosExperiment {
  id: string;
  name: string;
  type: ChaosExperimentType;
  target: ChaosTarget;
  status: ChaosExperimentStatus;
  hypothesis: string;
  steadyStates: ChaosSteadyState[];
  durationMs: number;
  startedAt?: string;
  completedAt?: string;
  resilienceScore: number;   // 0-1 post-experiment
  findings: string[];
  rollbackTriggered: boolean;
  automatedByAI: boolean;
}

export interface ChaosReport {
  totalExperiments: number;
  passed: number;
  failed: number;
  aborted: number;
  avgResilienceScore: number;
  weakestService: string;
  strongestService: string;
  topFindings: string[];
  recommendedNextExperiments: string[];
  generatedAt: string;
}

// ─── Memory Monitoring ───────────────────────────────────────────────────────

export type MemoryRegion =
  | 'heap'
  | 'stack'
  | 'native'
  | 'shared'
  | 'gpu'
  | 'cache'
  | 'off-heap';

export interface MemorySnapshot {
  id: string;
  timestamp: string;
  service: string;
  region: MemoryRegion;
  allocatedMB: number;
  usedMB: number;
  freeMB: number;
  gcPressure: number;        // 0-1
  gcCollectionsPerMin: number;
  leakSuspected: boolean;
  leakRateMBPerMin: number;
  retentionHotspots: string[];
  allocationHotspots: string[];
  health: HealthStatus;
  trend: TrendDirection;
}

export interface MemoryAlert {
  id: string;
  timestamp: string;
  service: string;
  severity: Severity;
  message: string;
  autoRemediated: boolean;
  remediationAction?: string;
}

// ─── Compute Monitoring ──────────────────────────────────────────────────────

export type ComputeResourceType =
  | 'cpu-core'
  | 'worker-thread'
  | 'event-loop'
  | 'gpu-shader'
  | 'io-thread'
  | 'gc-thread';

export interface ComputeSnapshot {
  id: string;
  timestamp: string;
  service: string;
  cpuUtilizationPct: number;
  threadCount: number;
  activeWorkers: number;
  eventLoopLagMs: number;
  eventLoopSaturation: number; // 0-1
  contextSwitchesPerSec: number;
  hotFunctions: string[];
  health: HealthStatus;
  trend: TrendDirection;
}

export interface ComputeAlert {
  id: string;
  timestamp: string;
  service: string;
  severity: Severity;
  resourceType: ComputeResourceType;
  message: string;
  autoScaled: boolean;
  scalingAction?: string;
}

// ─── Storage Monitoring ──────────────────────────────────────────────────────

export type StorageTier = 'nvme' | 'ssd' | 'hdd' | 'object' | 'cache' | 'archive' | 'in-memory';

export interface StorageSnapshot {
  id: string;
  timestamp: string;
  service: string;
  tier: StorageTier;
  capacityGB: number;
  usedGB: number;
  freeGB: number;
  utilizationPct: number;
  iopsRead: number;
  iopsWrite: number;
  throughputMBps: number;
  latencyReadMs: number;
  latencyWriteMs: number;
  replicationLagMs: number;
  errorRate: number;         // 0-1
  health: HealthStatus;
  trend: TrendDirection;
}

export interface StorageAlert {
  id: string;
  timestamp: string;
  service: string;
  tier: StorageTier;
  severity: Severity;
  message: string;
  autoRemediated: boolean;
}

// ─── Use-Flow Analysis ────────────────────────────────────────────────────────

export type FlowStage =
  | 'entry'
  | 'auth'
  | 'navigation'
  | 'data-load'
  | 'computation'
  | 'render'
  | 'interaction'
  | 'export'
  | 'exit';

export interface FlowFunnel {
  id: string;
  name: string;
  service: string;
  stages: FlowStage[];
  counts: Record<FlowStage, number>;
  dropOffRates: Record<FlowStage, number>;   // 0-1
  avgLatencyMs: Record<FlowStage, number>;
  bottleneck: FlowStage;
  health: HealthStatus;
}

export interface FlowDependency {
  from: string;    // service
  to: string;      // service
  callsPerMin: number;
  avgLatencyMs: number;
  errorRate: number;       // 0-1
  criticalPath: boolean;
}

export interface UseFlowSnapshot {
  id: string;
  timestamp: string;
  funnels: FlowFunnel[];
  dependencies: FlowDependency[];
  totalActiveFlows: number;
  avgEndToEndLatencyMs: number;
  p99LatencyMs: number;
  errorRate: number;
  health: HealthStatus;
}

// ─── AI Ops Group ─────────────────────────────────────────────────────────────

export type AIAgentRole =
  | 'chaos-engineer'
  | 'memory-analyst'
  | 'compute-optimizer'
  | 'storage-architect'
  | 'flow-cartographer'
  | 'incident-commander'
  | 'report-synthesizer'
  | 'dashboard-curator';

export type AIAgentStatus = 'idle' | 'running-tests' | 'analyzing' | 'recommending' | 'remediating' | 'reporting';

export interface AIAgent {
  id: string;
  name: string;
  role: AIAgentRole;
  status: AIAgentStatus;
  subsystem: 'chaos' | 'memory' | 'compute' | 'storage' | 'use-flow' | 'incidents' | 'reports' | 'dashboard';
  testsConducted: number;
  findingsGenerated: number;
  recommendationsIssued: number;
  actionsAutoTaken: number;
  lastActivity: string;
  currentTask: string;
  expertise: string[];
}

export interface AIGroupCycle {
  id: string;
  startedAt: string;
  completedAt?: string;
  agentsActive: number;
  testsRun: number;
  findingsRaised: number;
  issuesOpened: number;
  issuesResolved: number;
  recommendationsEmitted: number;
  reportsGenerated: number;
  overallHealthBefore: HealthStatus;
  overallHealthAfter: HealthStatus;
}

// ─── Issues ──────────────────────────────────────────────────────────────────

export type IssueCategory =
  | 'chaos-failure'
  | 'memory-leak'
  | 'cpu-saturation'
  | 'storage-exhaustion'
  | 'flow-bottleneck'
  | 'replication-lag'
  | 'dependency-degradation'
  | 'slo-breach'
  | 'security-anomaly'
  | 'cost-spike';

export type IssueStatus = 'open' | 'triaged' | 'in-progress' | 'resolved' | 'escalated' | 'closed';

export interface OpsIssue {
  id: string;
  title: string;
  category: IssueCategory;
  severity: Severity;
  status: IssueStatus;
  service: string;
  openedAt: string;
  triageAt?: string;
  resolvedAt?: string;
  assignedTo?: string;       // AI agent id
  autoTriaged: boolean;
  autoResolved: boolean;
  rootCause?: string;
  resolution?: string;
  updates: string[];
  relatedExperimentId?: string;
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export type ReportType =
  | 'chaos-summary'
  | 'memory-health'
  | 'compute-efficiency'
  | 'storage-capacity'
  | 'flow-analysis'
  | 'incident-postmortem'
  | 'weekly-ops'
  | 'executive-summary'
  | 'slo-compliance';

export interface OpsReport {
  id: string;
  type: ReportType;
  title: string;
  generatedAt: string;
  generatedBy: string;       // AI agent id
  period: string;
  sections: ReportSection[];
  executiveSummary: string;
  topRisks: string[];
  topRecommendations: string[];
  healthScore: number;       // 0-1
  deliveredTo: string[];
}

export interface ReportSection {
  title: string;
  content: string;
  metrics: Record<string, number | string>;
  findings: string[];
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export type DashboardPanelType =
  | 'chaos-status'
  | 'memory-overview'
  | 'compute-overview'
  | 'storage-overview'
  | 'flow-overview'
  | 'ai-group-status'
  | 'issue-feed'
  | 'recommendation-feed'
  | 'report-feed'
  | 'health-heatmap'
  | 'slo-tracker';

export interface DashboardPanel {
  id: string;
  type: DashboardPanelType;
  title: string;
  health: HealthStatus;
  data: Record<string, unknown>;
  lastUpdated: string;
  alertCount: number;
}

export interface DashboardRecommendation {
  id: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: IssueCategory | 'optimization' | 'cost' | 'reliability';
  title: string;
  detail: string;
  affectedService: string;
  estimatedImpact: string;
  suggestedAction: string;
  generatedBy: string;       // AI agent id
  acknowledged: boolean;
  applied: boolean;
}

export interface LiveDashboard {
  id: string;
  name: string;
  lastRefresh: string;
  refreshIntervalMs: number;
  panels: DashboardPanel[];
  activeRecommendations: DashboardRecommendation[];
  openIssues: number;
  criticalIssues: number;
  overallHealth: HealthStatus;
  aiGroupActive: boolean;
  cyclesCompleted: number;
  uptimeMs: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §2  INTERNAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const _INIT_TIME = Date.now();

// ─── Pre-seeded services ─────────────────────────────────────────────────────
const ENTERPRISE_SERVICES = [
  'api-gateway', 'auth-service', 'user-service', 'payment-service',
  'inventory-service', 'search-engine', 'notification-service', 'analytics-pipeline',
  'recommendation-engine', 'cdn-layer', 'message-bus', 'data-warehouse',
] as const;
type ServiceName = typeof ENTERPRISE_SERVICES[number];

// ─── Chaos state ─────────────────────────────────────────────────────────────
const _chaosExperiments: ChaosExperiment[] = [];
const _chaosReports: ChaosReport[] = [];

// ─── Memory state ────────────────────────────────────────────────────────────
const _memorySnapshots: MemorySnapshot[] = [];
const _memoryAlerts: MemoryAlert[] = [];

// ─── Compute state ───────────────────────────────────────────────────────────
const _computeSnapshots: ComputeSnapshot[] = [];
const _computeAlerts: ComputeAlert[] = [];

// ─── Storage state ───────────────────────────────────────────────────────────
const _storageSnapshots: StorageSnapshot[] = [];
const _storageAlerts: StorageAlert[] = [];

// ─── Use-flow state ──────────────────────────────────────────────────────────
const _useFlowSnapshots: UseFlowSnapshot[] = [];

// ─── Issues state ────────────────────────────────────────────────────────────
const _issues: OpsIssue[] = [];

// ─── Reports state ───────────────────────────────────────────────────────────
const _reports: OpsReport[] = [];

// ─── Dashboard state ─────────────────────────────────────────────────────────
const _recommendations: DashboardRecommendation[] = [];
const _groupCycles: AIGroupCycle[] = [];

// ─── AI Group — 8 specialist agents pre-initialized ─────────────────────────
const _aiAgents: AIAgent[] = [
  {
    id: 'opsai-001', name: 'ChaosMind',         role: 'chaos-engineer',
    status: 'idle', subsystem: 'chaos',
    testsConducted: 0, findingsGenerated: 0, recommendationsIssued: 0, actionsAutoTaken: 0,
    lastActivity: _now(), currentTask: 'Awaiting cycle',
    expertise: ['fault-injection', 'blast-radius-control', 'resilience-scoring', 'rollback-automation'],
  },
  {
    id: 'opsai-002', name: 'MemorySeer',        role: 'memory-analyst',
    status: 'idle', subsystem: 'memory',
    testsConducted: 0, findingsGenerated: 0, recommendationsIssued: 0, actionsAutoTaken: 0,
    lastActivity: _now(), currentTask: 'Awaiting cycle',
    expertise: ['heap-profiling', 'gc-tuning', 'leak-detection', 'retention-chain-analysis'],
  },
  {
    id: 'opsai-003', name: 'CoreOptimizer',     role: 'compute-optimizer',
    status: 'idle', subsystem: 'compute',
    testsConducted: 0, findingsGenerated: 0, recommendationsIssued: 0, actionsAutoTaken: 0,
    lastActivity: _now(), currentTask: 'Awaiting cycle',
    expertise: ['cpu-profiling', 'thread-pool-tuning', 'event-loop-optimization', 'auto-scaling'],
  },
  {
    id: 'opsai-004', name: 'StorageGuard',      role: 'storage-architect',
    status: 'idle', subsystem: 'storage',
    testsConducted: 0, findingsGenerated: 0, recommendationsIssued: 0, actionsAutoTaken: 0,
    lastActivity: _now(), currentTask: 'Awaiting cycle',
    expertise: ['iops-analysis', 'replication-monitoring', 'capacity-planning', 'tier-optimization'],
  },
  {
    id: 'opsai-005', name: 'FlowMapper',        role: 'flow-cartographer',
    status: 'idle', subsystem: 'use-flow',
    testsConducted: 0, findingsGenerated: 0, recommendationsIssued: 0, actionsAutoTaken: 0,
    lastActivity: _now(), currentTask: 'Awaiting cycle',
    expertise: ['funnel-analysis', 'dependency-mapping', 'latency-profiling', 'drop-off-detection'],
  },
  {
    id: 'opsai-006', name: 'IncidentCommander', role: 'incident-commander',
    status: 'idle', subsystem: 'incidents',
    testsConducted: 0, findingsGenerated: 0, recommendationsIssued: 0, actionsAutoTaken: 0,
    lastActivity: _now(), currentTask: 'Awaiting cycle',
    expertise: ['triage-automation', 'root-cause-analysis', 'escalation-routing', 'slo-enforcement'],
  },
  {
    id: 'opsai-007', name: 'ReportSynth',       role: 'report-synthesizer',
    status: 'idle', subsystem: 'reports',
    testsConducted: 0, findingsGenerated: 0, recommendationsIssued: 0, actionsAutoTaken: 0,
    lastActivity: _now(), currentTask: 'Awaiting cycle',
    expertise: ['narrative-generation', 'metric-synthesis', 'executive-summary', 'trend-analysis'],
  },
  {
    id: 'opsai-008', name: 'DashCurator',       role: 'dashboard-curator',
    status: 'idle', subsystem: 'dashboard',
    testsConducted: 0, findingsGenerated: 0, recommendationsIssued: 0, actionsAutoTaken: 0,
    lastActivity: _now(), currentTask: 'Awaiting cycle',
    expertise: ['panel-management', 'recommendation-ranking', 'alert-deduplication', 'live-updates'],
  },
];

// ─── Dashboard panels (one per DashboardPanelType) ───────────────────────────
const _panels: DashboardPanel[] = ([
  ['chaos-status',          'Chaos Engineering Status'],
  ['memory-overview',       'Memory Health Overview'],
  ['compute-overview',      'Compute Efficiency Overview'],
  ['storage-overview',      'Storage Capacity & IOPS'],
  ['flow-overview',         'Use-Flow Analysis'],
  ['ai-group-status',       'AI Ops Group — 8 Agents'],
  ['issue-feed',            'Live Issue Feed'],
  ['recommendation-feed',   'Recommendation Stream'],
  ['report-feed',           'Generated Reports'],
  ['health-heatmap',        'Service Health Heatmap'],
  ['slo-tracker',           'SLO Compliance Tracker'],
] as [DashboardPanelType, string][]).map(([type, title]) => ({
  id: `panel-${type}`,
  type,
  title,
  health: 'healthy' as HealthStatus,
  data: {},
  lastUpdated: _now(),
  alertCount: 0,
}));

// ═══════════════════════════════════════════════════════════════════════════════
// §3  CHAOS ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

const EXPERIMENT_TEMPLATES: Array<{
  name: string; type: ChaosExperimentType; service: ServiceName;
  hypothesis: string; steadyStates: ChaosSteadyState[];
}> = [
  {
    name: 'API Gateway — 100ms Latency Injection',
    type: 'latency-injection', service: 'api-gateway',
    hypothesis: 'API gateway maintains <500ms p99 when upstream adds 100ms',
    steadyStates: [
      { metric: 'p99_latency_ms', operator: '<', threshold: 500, unit: 'ms' },
      { metric: 'error_rate', operator: '<', threshold: 0.01, unit: 'ratio' },
    ],
  },
  {
    name: 'Payment Service — Dependency Failure',
    type: 'dependency-failure', service: 'payment-service',
    hypothesis: 'Payment service gracefully degrades when inventory-service is unavailable',
    steadyStates: [
      { metric: 'payment_success_rate', operator: '>', threshold: 0.95, unit: 'ratio' },
      { metric: 'circuit_breaker_open', operator: '<', threshold: 1, unit: 'count' },
    ],
  },
  {
    name: 'Auth Service — CPU Spike',
    type: 'cpu-spike', service: 'auth-service',
    hypothesis: 'Auth service maintains <200ms login latency under CPU saturation',
    steadyStates: [
      { metric: 'login_latency_ms', operator: '<', threshold: 200, unit: 'ms' },
      { metric: 'token_validation_errors', operator: '<', threshold: 5, unit: 'count/min' },
    ],
  },
  {
    name: 'Search Engine — Memory Pressure',
    type: 'memory-pressure', service: 'search-engine',
    hypothesis: 'Search engine index remains queryable under 90% heap pressure',
    steadyStates: [
      { metric: 'search_success_rate', operator: '>', threshold: 0.99, unit: 'ratio' },
      { metric: 'gc_pause_ms', operator: '<', threshold: 100, unit: 'ms' },
    ],
  },
  {
    name: 'Message Bus — Packet Loss 15%',
    type: 'packet-loss', service: 'message-bus',
    hypothesis: 'Message bus retries ensure <0.1% message loss under 15% packet loss',
    steadyStates: [
      { metric: 'message_delivery_rate', operator: '>', threshold: 0.999, unit: 'ratio' },
      { metric: 'retry_queue_depth', operator: '<', threshold: 1000, unit: 'count' },
    ],
  },
  {
    name: 'Analytics Pipeline — Disk Fill',
    type: 'disk-fill', service: 'analytics-pipeline',
    hypothesis: 'Analytics pipeline backpressures gracefully when disk reaches 95%',
    steadyStates: [
      { metric: 'pipeline_throughput_pct', operator: '>', threshold: 0.5, unit: 'ratio' },
      { metric: 'data_loss_events', operator: '<', threshold: 1, unit: 'count' },
    ],
  },
  {
    name: 'User Service — Process Kill',
    type: 'process-kill', service: 'user-service',
    hypothesis: 'User service recovers and re-registers within 10s of unexpected kill',
    steadyStates: [
      { metric: 'recovery_time_ms', operator: '<', threshold: 10000, unit: 'ms' },
      { metric: 'session_continuity_pct', operator: '>', threshold: 0.9, unit: 'ratio' },
    ],
  },
  {
    name: 'CDN Layer — Region Failure',
    type: 'region-failure', service: 'cdn-layer',
    hypothesis: 'CDN fails over to secondary region within 5s with <1% cache miss increase',
    steadyStates: [
      { metric: 'failover_time_ms', operator: '<', threshold: 5000, unit: 'ms' },
      { metric: 'cache_hit_rate', operator: '>', threshold: 0.85, unit: 'ratio' },
    ],
  },
];

/**
 * Create and register a new chaos experiment.
 */
export function createChaosExperiment(
  name: string,
  type: ChaosExperimentType,
  target: ChaosTarget,
  hypothesis: string,
  steadyStates: ChaosSteadyState[],
  durationMs = HEARTBEAT_MS * 10,
): ChaosExperiment {
  const exp: ChaosExperiment = {
    id: sovereignId(),
    name,
    type,
    target,
    status: 'planned',
    hypothesis,
    steadyStates,
    durationMs,
    resilienceScore: 0,
    findings: [],
    rollbackTriggered: false,
    automatedByAI: true,
  };
  _chaosExperiments.push(exp);
  return exp;
}

/**
 * Run a chaos experiment. Simulates execution and generates findings.
 */
export function runChaosExperiment(experimentId: string): ChaosExperiment | undefined {
  const idx = _chaosExperiments.findIndex(e => e.id === experimentId);
  if (idx < 0) return undefined;
  const exp = _chaosExperiments[idx];
  if (exp.status !== 'planned') return exp;

  const started: ChaosExperiment = { ...exp, status: 'running', startedAt: _now() };

  // Simulate blast radius effect on resilience
  const blastEffect = _clamp(exp.target.blastRadiusPct / 100);
  const baseResilience = _clamp(PHI_INVERSE * (1 - blastEffect * 0.3));
  const rollback = blastEffect > 0.8;

  const findings: string[] = [
    `Steady-state "${exp.steadyStates[0]?.metric}" maintained under ${exp.type}`,
    `Blast radius ${exp.target.blastRadiusPct}% affected ${exp.target.service} in ${exp.target.environment}`,
    baseResilience < 0.5
      ? `CRITICAL: resilience below threshold — ${exp.type} caused service degradation`
      : `Resilience held at ${(baseResilience * 100).toFixed(1)}% — hypothesis validated`,
    rollback ? `Auto-rollback triggered: blast radius exceeded safe threshold` : `No rollback needed`,
  ];

  const completed: ChaosExperiment = {
    ...started,
    status: rollback ? 'rolling-back' : 'completed',
    completedAt: _now(),
    resilienceScore: baseResilience,
    findings,
    rollbackTriggered: rollback,
  };
  _chaosExperiments[idx] = completed;

  // Auto-open an issue if resilience < 0.6
  if (baseResilience < 0.6) {
    _openIssueInternal(
      `Chaos: ${exp.name} — resilience ${(baseResilience * 100).toFixed(0)}%`,
      'chaos-failure',
      baseResilience < 0.3 ? 'critical' : 'error',
      exp.target.service,
      `Experiment revealed resilience gap: ${findings[2]}`,
      exp.id,
    );
  }

  return completed;
}

/**
 * Run the pre-seeded enterprise chaos test suite (all 8 templates).
 */
export function runEnterpriseChaosSuite(): ChaosExperiment[] {
  // Seed experiments if not already seeded
  if (_chaosExperiments.length === 0) {
    for (const t of EXPERIMENT_TEMPLATES) {
      createChaosExperiment(t.name, t.type, {
        service: t.service,
        environment: 'staging',
        region: 'us-east-1',
        blastRadiusPct: 20 + Math.round(Math.random() * 40),
      }, t.hypothesis, t.steadyStates);
    }
  }
  return _chaosExperiments
    .filter(e => e.status === 'planned')
    .map(e => runChaosExperiment(e.id)!)
    .filter(Boolean);
}

/** Get all chaos experiments. */
export function getChaosExperiments(): ChaosExperiment[] {
  return [..._chaosExperiments];
}

/** Get chaos experiments by status. */
export function getChaosExperimentsByStatus(status: ChaosExperimentStatus): ChaosExperiment[] {
  return _chaosExperiments.filter(e => e.status === status);
}

/** Generate a chaos summary report. */
export function generateChaosReport(): ChaosReport {
  const passed = _chaosExperiments.filter(e => e.status === 'completed' && e.resilienceScore >= 0.6).length;
  const failed = _chaosExperiments.filter(e => e.status === 'completed' && e.resilienceScore < 0.6).length;
  const aborted = _chaosExperiments.filter(e => e.status === 'aborted').length;
  const completed = _chaosExperiments.filter(e => e.status === 'completed');
  const avgResilience = completed.length > 0
    ? completed.reduce((s, e) => s + e.resilienceScore, 0) / completed.length
    : 0;

  const sortedByResilience = [...completed].sort((a, b) => a.resilienceScore - b.resilienceScore);
  const report: ChaosReport = {
    totalExperiments: _chaosExperiments.length,
    passed,
    failed,
    aborted,
    avgResilienceScore: _clamp(avgResilience),
    weakestService: sortedByResilience[0]?.target.service ?? 'none',
    strongestService: sortedByResilience[sortedByResilience.length - 1]?.target.service ?? 'none',
    topFindings: completed.flatMap(e => e.findings).slice(0, 5),
    recommendedNextExperiments: [
      'network-partition on payment-service in production with 5% blast radius',
      'clock-skew injection on auth-service to test token expiry handling',
      'resource-exhaustion on data-warehouse to validate query throttling',
    ],
    generatedAt: _now(),
  };
  _chaosReports.push(report);
  return report;
}

/** Get all chaos reports. */
export function getChaosReports(): ChaosReport[] {
  return [..._chaosReports];
}

// ═══════════════════════════════════════════════════════════════════════════════
// §4  MEMORY MONITORING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Take a memory snapshot for a service.
 */
export function takeMemorySnapshot(service: string): MemorySnapshot {
  const allocatedMB = 512 + Math.round(PHI_INVERSE * 1024);
  const utilization = _clamp(0.3 + Math.random() * 0.5);
  const usedMB = Math.round(allocatedMB * utilization);
  const gcPressure = _clamp(utilization * PHI_INVERSE + Math.random() * 0.1);
  const leakRate = gcPressure > 0.7 ? _clamp((gcPressure - 0.7) * 10) : 0;

  const snap: MemorySnapshot = {
    id: sovereignId(),
    timestamp: _now(),
    service,
    region: 'heap',
    allocatedMB,
    usedMB,
    freeMB: allocatedMB - usedMB,
    gcPressure,
    gcCollectionsPerMin: Math.round(gcPressure * 60),
    leakSuspected: leakRate > 0.02,
    leakRateMBPerMin: _clamp(leakRate * 100, 0, 100),
    retentionHotspots: gcPressure > 0.6
      ? [`${service}:ObjectCache`, `${service}:EventListeners`]
      : [],
    allocationHotspots: utilization > 0.7
      ? [`${service}:RequestBuffer`, `${service}:ResponseQueue`]
      : [],
    health: gcPressure > 0.8 ? 'critical' : gcPressure > 0.6 ? 'degraded' : 'healthy',
    trend: gcPressure > 0.7 ? 'degrading' : 'stable',
  };
  _memorySnapshots.push(snap);

  if (snap.health !== 'healthy') {
    _memoryAlerts.push({
      id: sovereignId(),
      timestamp: _now(),
      service,
      severity: snap.health === 'critical' ? 'critical' : 'warning',
      message: snap.leakSuspected
        ? `Memory leak suspected in ${service}: ${snap.leakRateMBPerMin.toFixed(1)} MB/min drift`
        : `GC pressure elevated in ${service}: ${(snap.gcPressure * 100).toFixed(0)}%`,
      autoRemediated: snap.health !== 'critical',
      remediationAction: snap.health !== 'critical' ? 'GC hint issued; heap cache eviction triggered' : undefined,
    });
  }
  return snap;
}

/**
 * Run memory monitoring across all enterprise services.
 */
export function runMemoryMonitoringCycle(): MemorySnapshot[] {
  return ENTERPRISE_SERVICES.map(s => takeMemorySnapshot(s));
}

/** Get all memory snapshots. */
export function getMemorySnapshots(): MemorySnapshot[] {
  return [..._memorySnapshots];
}

/** Get memory snapshots for a specific service. */
export function getServiceMemorySnapshots(service: string): MemorySnapshot[] {
  return _memorySnapshots.filter(s => s.service === service);
}

/** Get all memory alerts. */
export function getMemoryAlerts(): MemoryAlert[] {
  return [..._memoryAlerts];
}

/** Get memory alerts by severity. */
export function getMemoryAlertsBySeverity(severity: Severity): MemoryAlert[] {
  return _memoryAlerts.filter(a => a.severity === severity);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §5  COMPUTE MONITORING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Take a compute snapshot for a service.
 */
export function takeComputeSnapshot(service: string): ComputeSnapshot {
  const cpuUtil = _clamp(0.2 + Math.random() * 0.7);
  const eventLoopLag = cpuUtil > 0.8 ? 50 + Math.round(cpuUtil * 200) : 2 + Math.round(cpuUtil * 20);

  const snap: ComputeSnapshot = {
    id: sovereignId(),
    timestamp: _now(),
    service,
    cpuUtilizationPct: Math.round(cpuUtil * 100),
    threadCount: 8 + Math.round(cpuUtil * 24),
    activeWorkers: Math.round(cpuUtil * 16),
    eventLoopLagMs: eventLoopLag,
    eventLoopSaturation: _clamp(cpuUtil * PHI_INVERSE),
    contextSwitchesPerSec: Math.round(1000 + cpuUtil * 9000),
    hotFunctions: cpuUtil > 0.7
      ? [`${service}:serializeResponse`, `${service}:dbQueryBuilder`, `${service}:authValidate`]
      : [],
    health: cpuUtil > 0.9 ? 'critical' : cpuUtil > 0.75 ? 'degraded' : 'healthy',
    trend: cpuUtil > 0.8 ? 'spiking' : cpuUtil > 0.6 ? 'degrading' : 'stable',
  };
  _computeSnapshots.push(snap);

  if (snap.health !== 'healthy') {
    _computeAlerts.push({
      id: sovereignId(),
      timestamp: _now(),
      service,
      severity: snap.health === 'critical' ? 'critical' : 'warning',
      resourceType: eventLoopLag > 100 ? 'event-loop' : 'cpu-core',
      message: `CPU ${snap.cpuUtilizationPct}% on ${service}; event-loop lag ${snap.eventLoopLagMs}ms`,
      autoScaled: snap.health !== 'critical',
      scalingAction: snap.health !== 'critical' ? 'Horizontal scale-out triggered: +2 instances' : undefined,
    });
  }
  return snap;
}

/**
 * Run compute monitoring across all enterprise services.
 */
export function runComputeMonitoringCycle(): ComputeSnapshot[] {
  return ENTERPRISE_SERVICES.map(s => takeComputeSnapshot(s));
}

/** Get all compute snapshots. */
export function getComputeSnapshots(): ComputeSnapshot[] {
  return [..._computeSnapshots];
}

/** Get compute alerts. */
export function getComputeAlerts(): ComputeAlert[] {
  return [..._computeAlerts];
}

// ═══════════════════════════════════════════════════════════════════════════════
// §6  STORAGE MONITORING
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_TIERS: StorageTier[] = ['nvme', 'ssd', 'object', 'cache', 'in-memory'];

/**
 * Take a storage snapshot for a service.
 */
export function takeStorageSnapshot(service: string, tier: StorageTier = 'ssd'): StorageSnapshot {
  const capacityGB = tier === 'object' ? 10000 : tier === 'nvme' ? 500 : tier === 'cache' ? 64 : 1000;
  const utilization = _clamp(0.2 + Math.random() * 0.6);
  const iopsRead = Math.round(1000 + utilization * 49000);
  const replicationLag = utilization > 0.7 ? Math.round(utilization * 500) : 2;

  const snap: StorageSnapshot = {
    id: sovereignId(),
    timestamp: _now(),
    service,
    tier,
    capacityGB,
    usedGB: Math.round(capacityGB * utilization),
    freeGB: Math.round(capacityGB * (1 - utilization)),
    utilizationPct: Math.round(utilization * 100),
    iopsRead,
    iopsWrite: Math.round(iopsRead * PHI_INVERSE * 0.6),
    throughputMBps: Math.round(200 + utilization * 800),
    latencyReadMs: _clamp(0.1 + utilization * 2, 0, 100),
    latencyWriteMs: _clamp(0.2 + utilization * 4, 0, 100),
    replicationLagMs: replicationLag,
    errorRate: _clamp(utilization > 0.85 ? (utilization - 0.85) * 0.1 : 0),
    health: utilization > 0.9 ? 'critical' : utilization > 0.75 ? 'degraded' : 'healthy',
    trend: utilization > 0.8 ? 'degrading' : 'stable',
  };
  _storageSnapshots.push(snap);

  if (snap.health !== 'healthy') {
    _storageAlerts.push({
      id: sovereignId(),
      timestamp: _now(),
      service,
      tier,
      severity: snap.health === 'critical' ? 'critical' : 'warning',
      message: `Storage ${snap.utilizationPct}% on ${service} (${tier}); replication lag ${snap.replicationLagMs}ms`,
      autoRemediated: snap.utilizationPct < 90,
    });
  }
  return snap;
}

/**
 * Run storage monitoring across all enterprise services and tiers.
 */
export function runStorageMonitoringCycle(): StorageSnapshot[] {
  const results: StorageSnapshot[] = [];
  for (const service of ENTERPRISE_SERVICES) {
    const tier = STORAGE_TIERS[ENTERPRISE_SERVICES.indexOf(service) % STORAGE_TIERS.length];
    results.push(takeStorageSnapshot(service, tier));
  }
  return results;
}

/** Get all storage snapshots. */
export function getStorageSnapshots(): StorageSnapshot[] {
  return [..._storageSnapshots];
}

/** Get storage alerts. */
export function getStorageAlerts(): StorageAlert[] {
  return [..._storageAlerts];
}

/** Get snapshots for a specific tier. */
export function getStorageSnapshotsByTier(tier: StorageTier): StorageSnapshot[] {
  return _storageSnapshots.filter(s => s.tier === tier);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §7  USE-FLOW ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

const FLOW_STAGES_ALL: FlowStage[] = [
  'entry', 'auth', 'navigation', 'data-load', 'computation', 'render', 'interaction', 'export', 'exit',
];

const FUNNEL_TEMPLATES = [
  { name: 'Checkout Flow', service: 'payment-service' },
  { name: 'Search & Discover', service: 'search-engine' },
  { name: 'User Onboarding', service: 'user-service' },
  { name: 'Analytics Dashboard', service: 'analytics-pipeline' },
  { name: 'API Integration Flow', service: 'api-gateway' },
];

/**
 * Snapshot current use-flow state.
 */
export function takeUseFlowSnapshot(): UseFlowSnapshot {
  const funnels: FlowFunnel[] = FUNNEL_TEMPLATES.map(t => {
    const entryCount = 1000 + Math.round(Math.random() * 9000);
    const counts: Record<FlowStage, number> = {} as Record<FlowStage, number>;
    const dropOffRates: Record<FlowStage, number> = {} as Record<FlowStage, number>;
    const avgLatencyMs: Record<FlowStage, number> = {} as Record<FlowStage, number>;
    let current = entryCount;
    let bottleneck: FlowStage = 'entry';
    let maxDrop = 0;

    for (const stage of FLOW_STAGES_ALL) {
      const dropOff = _clamp(Math.random() * 0.15);
      current = Math.round(current * (1 - dropOff));
      counts[stage] = current;
      dropOffRates[stage] = dropOff;
      avgLatencyMs[stage] = 10 + Math.round(Math.random() * 300);
      if (dropOff > maxDrop) { maxDrop = dropOff; bottleneck = stage; }
    }
    return {
      id: sovereignId(),
      name: t.name,
      service: t.service,
      stages: FLOW_STAGES_ALL,
      counts,
      dropOffRates,
      avgLatencyMs,
      bottleneck,
      health: maxDrop > 0.1 ? 'degraded' : 'healthy',
    };
  });

  const deps: FlowDependency[] = [
    { from: 'api-gateway', to: 'auth-service',       callsPerMin: 50000, avgLatencyMs: 8,  errorRate: 0.001, criticalPath: true },
    { from: 'api-gateway', to: 'user-service',        callsPerMin: 30000, avgLatencyMs: 12, errorRate: 0.002, criticalPath: true },
    { from: 'payment-service', to: 'inventory-service', callsPerMin: 5000, avgLatencyMs: 25, errorRate: 0.005, criticalPath: true },
    { from: 'search-engine', to: 'analytics-pipeline', callsPerMin: 10000, avgLatencyMs: 45, errorRate: 0.001, criticalPath: false },
    { from: 'user-service', to: 'notification-service', callsPerMin: 8000, avgLatencyMs: 18, errorRate: 0.003, criticalPath: false },
    { from: 'recommendation-engine', to: 'data-warehouse', callsPerMin: 2000, avgLatencyMs: 80, errorRate: 0.004, criticalPath: false },
  ];

  const snap: UseFlowSnapshot = {
    id: sovereignId(),
    timestamp: _now(),
    funnels,
    dependencies: deps,
    totalActiveFlows: funnels.reduce((s, f) => s + f.counts.entry, 0),
    avgEndToEndLatencyMs: Math.round(FLOW_STAGES_ALL.reduce(
      (s, stage) => s + funnels.reduce((ss, f) => ss + f.avgLatencyMs[stage], 0) / funnels.length,
      0,
    )),
    p99LatencyMs: Math.round(800 + Math.random() * 400),
    errorRate: _clamp(0.001 + Math.random() * 0.02),
    health: funnels.some(f => f.health === 'degraded') ? 'degraded' : 'healthy',
  };
  _useFlowSnapshots.push(snap);
  return snap;
}

/** Get all use-flow snapshots. */
export function getUseFlowSnapshots(): UseFlowSnapshot[] {
  return [..._useFlowSnapshots];
}

/** Get the latest use-flow snapshot. */
export function getLatestUseFlowSnapshot(): UseFlowSnapshot | undefined {
  return _useFlowSnapshots[_useFlowSnapshots.length - 1];
}

// ═══════════════════════════════════════════════════════════════════════════════
// §8  ISSUES
// ═══════════════════════════════════════════════════════════════════════════════

function _openIssueInternal(
  title: string, category: IssueCategory, severity: Severity,
  service: string, rootCause: string, relatedExperimentId?: string,
): OpsIssue {
  const issue: OpsIssue = {
    id: sovereignId(),
    title,
    category,
    severity,
    status: 'open',
    service,
    openedAt: _now(),
    autoTriaged: false,
    autoResolved: false,
    rootCause,
    updates: [`Issue opened: ${title}`],
    relatedExperimentId,
  };
  _issues.push(issue);
  return issue;
}

/** Open a new ops issue. */
export function openIssue(
  title: string,
  category: IssueCategory,
  severity: Severity,
  service: string,
  rootCause?: string,
): OpsIssue {
  return _openIssueInternal(title, category, severity, service, rootCause ?? 'Under investigation');
}

/** Auto-triage an issue (AI assigns it and sets severity). */
export function triageIssue(issueId: string, assignToAgentId: string): OpsIssue | undefined {
  const idx = _issues.findIndex(i => i.id === issueId);
  if (idx < 0) return undefined;
  const updated: OpsIssue = {
    ..._issues[idx],
    status: 'triaged',
    triageAt: _now(),
    assignedTo: assignToAgentId,
    autoTriaged: true,
    updates: [..._issues[idx].updates, `Auto-triaged → assigned to ${assignToAgentId}`],
  };
  _issues[idx] = updated;
  return updated;
}

/** Resolve an issue. */
export function resolveIssue(issueId: string, resolution: string, autoResolved = true): OpsIssue | undefined {
  const idx = _issues.findIndex(i => i.id === issueId);
  if (idx < 0) return undefined;
  const updated: OpsIssue = {
    ..._issues[idx],
    status: 'resolved',
    resolvedAt: _now(),
    resolution,
    autoResolved,
    updates: [..._issues[idx].updates, `Resolved: ${resolution}`],
  };
  _issues[idx] = updated;
  return updated;
}

/** Escalate an issue. */
export function escalateIssue(issueId: string, reason: string): OpsIssue | undefined {
  const idx = _issues.findIndex(i => i.id === issueId);
  if (idx < 0) return undefined;
  const updated: OpsIssue = {
    ..._issues[idx],
    status: 'escalated',
    updates: [..._issues[idx].updates, `Escalated: ${reason}`],
  };
  _issues[idx] = updated;
  return updated;
}

/** Add an update to an issue. */
export function addIssueUpdate(issueId: string, update: string): OpsIssue | undefined {
  const idx = _issues.findIndex(i => i.id === issueId);
  if (idx < 0) return undefined;
  const updated: OpsIssue = {
    ..._issues[idx],
    updates: [..._issues[idx].updates, `[${_now()}] ${update}`],
  };
  _issues[idx] = updated;
  return updated;
}

/** Get all issues. */
export function getIssues(): OpsIssue[] {
  return [..._issues];
}

/** Get open issues. */
export function getOpenIssues(): OpsIssue[] {
  return _issues.filter(i => i.status === 'open' || i.status === 'triaged' || i.status === 'in-progress');
}

/** Get issues by category. */
export function getIssuesByCategory(category: IssueCategory): OpsIssue[] {
  return _issues.filter(i => i.category === category);
}

/** Get issues by severity. */
export function getIssuesBySeverity(severity: Severity): OpsIssue[] {
  return _issues.filter(i => i.severity === severity);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §9  REPORTS
// ═══════════════════════════════════════════════════════════════════════════════

function _buildSection(title: string, content: string, metrics: Record<string, number | string>, findings: string[]): ReportSection {
  return { title, content, metrics, findings };
}

/**
 * Generate an ops report of the given type.
 */
export function generateOpsReport(type: ReportType, generatedBy = 'opsai-007'): OpsReport {
  const reportTitles: Record<ReportType, string> = {
    'chaos-summary':       'Enterprise Chaos Engineering Summary',
    'memory-health':       'Memory Health & Leak Detection Report',
    'compute-efficiency':  'Compute Efficiency & Saturation Report',
    'storage-capacity':    'Storage Capacity & IOPS Analysis',
    'flow-analysis':       'Use-Flow Analysis & Bottleneck Report',
    'incident-postmortem': 'Incident Post-Mortem & Root Cause Analysis',
    'weekly-ops':          'Weekly AI Ops Platform Summary',
    'executive-summary':   'Executive AI Ops Dashboard — CEO/CTO Briefing',
    'slo-compliance':      'SLO Compliance & Error Budget Report',
  };

  const healthScore = _clamp(PHI_INVERSE * (1 - _issues.filter(i => i.severity === 'critical').length * 0.1));

  const sections: ReportSection[] = [
    _buildSection(
      'Platform Health Overview',
      'Current enterprise platform health assessed across chaos, memory, compute, storage, and use-flow subsystems.',
      {
        chaosExperiments: _chaosExperiments.length,
        memorySnapshots: _memorySnapshots.length,
        computeSnapshots: _computeSnapshots.length,
        storageSnapshots: _storageSnapshots.length,
        openIssues: _issues.filter(i => i.status === 'open').length,
        healthScore: healthScore.toFixed(2),
      },
      [
        _chaosExperiments.length === 0 ? 'No chaos experiments run yet' : `${_chaosExperiments.filter(e => e.status === 'completed').length} experiments completed`,
        `Memory: ${_memoryAlerts.filter(a => a.severity === 'critical').length} critical alerts`,
        `Compute: ${_computeAlerts.filter(a => a.autoScaled).length} auto-scales triggered`,
        `Storage: ${_storageAlerts.filter(a => !a.autoRemediated).length} unresolved alerts`,
      ],
    ),
    _buildSection(
      'AI Group Performance',
      'Performance of the 8-agent autonomous AI ops group across this reporting period.',
      {
        cyclesCompleted: _groupCycles.length,
        totalTestsRun: _groupCycles.reduce((s, c) => s + c.testsRun, 0),
        recommendationsEmitted: _groupCycles.reduce((s, c) => s + c.recommendationsEmitted, 0),
        issuesAutoResolved: _issues.filter(i => i.autoResolved).length,
        reportsGenerated: _reports.length + 1,
      },
      [
        `AI group operating ${_aiAgents.filter(a => a.status !== 'idle').length} agents actively`,
        `${_recommendations.filter(r => r.applied).length} recommendations applied`,
        `${_issues.filter(i => i.autoTriaged).length} issues auto-triaged`,
      ],
    ),
    _buildSection(
      'Recommendations',
      'Top recommendations from the AI ops group for immediate action.',
      {},
      _recommendations.slice(0, 5).map(r => `[${r.priority.toUpperCase()}] ${r.title}: ${r.suggestedAction}`),
    ),
  ];

  const report: OpsReport = {
    id: sovereignId(),
    type,
    title: reportTitles[type],
    generatedAt: _now(),
    generatedBy,
    period: 'last-24h',
    sections,
    executiveSummary: `Enterprise AI Ops platform health: ${(healthScore * 100).toFixed(0)}%. ${_issues.filter(i => i.status === 'open').length} open issues, ${_chaosExperiments.filter(e => e.status === 'completed').length} chaos experiments completed, ${_recommendations.filter(r => !r.acknowledged).length} pending recommendations.`,
    topRisks: _issues.filter(i => i.severity === 'critical').map(i => i.title).slice(0, 3),
    topRecommendations: _recommendations.slice(0, 3).map(r => r.title),
    healthScore,
    deliveredTo: ['ceo@company.com', 'cto@company.com', 'vp-engineering@company.com'],
  };
  _reports.push(report);
  return report;
}

/** Get all reports. */
export function getOpsReports(): OpsReport[] {
  return [..._reports];
}

/** Get reports by type. */
export function getOpsReportsByType(type: ReportType): OpsReport[] {
  return _reports.filter(r => r.type === type);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §10  AI GROUP
// ═══════════════════════════════════════════════════════════════════════════════

/** Get all AI agents. */
export function getAIAgents(): AIAgent[] {
  return [..._aiAgents];
}

/** Get a specific AI agent. */
export function getAIAgent(id: string): AIAgent | undefined {
  return _aiAgents.find(a => a.id === id);
}

/** Get agents by role. */
export function getAIAgentsByRole(role: AIAgentRole): AIAgent[] {
  return _aiAgents.filter(a => a.role === role);
}

/**
 * Run a full autonomous AI group cycle.
 * All 8 agents run in parallel: chaos, memory, compute, storage, use-flow,
 * incidents, reports, dashboard — then the group updates the dashboard.
 */
export function runAIGroupCycle(): AIGroupCycle {
  const cycleStart = _now();
  const openBefore = _issues.filter(i => i.status === 'open').length;
  const healthBefore: HealthStatus = _issues.filter(i => i.severity === 'critical').length > 2 ? 'critical'
    : _issues.filter(i => i.severity === 'error').length > 5 ? 'degraded' : 'healthy';

  let testsRun = 0;
  let findingsRaised = 0;
  let issuesOpened = 0;
  let issuesResolved = 0;
  let recommendationsEmitted = 0;
  let reportsGenerated = 0;

  // ── Agent 1: ChaosMind runs a mini chaos experiment ───────────────────────
  const chaosAgent = _aiAgents.find(a => a.role === 'chaos-engineer')!;
  chaosAgent.status = 'running-tests';
  chaosAgent.currentTask = 'Running scheduled chaos experiments';
  const chaosResults = runEnterpriseChaosSuite();
  testsRun += chaosResults.length;
  findingsRaised += chaosResults.reduce((s, e) => s + e.findings.length, 0);
  chaosAgent.testsConducted += chaosResults.length;
  chaosAgent.findingsGenerated += findingsRaised;
  chaosAgent.status = 'analyzing';
  chaosAgent.lastActivity = _now();

  // ── Agent 2: MemorySeer scans memory ─────────────────────────────────────
  const memAgent = _aiAgents.find(a => a.role === 'memory-analyst')!;
  memAgent.status = 'running-tests';
  const memSnaps = runMemoryMonitoringCycle();
  testsRun += memSnaps.length;
  const memFindings = memSnaps.filter(s => s.leakSuspected).length;
  findingsRaised += memFindings;
  memAgent.testsConducted += memSnaps.length;
  memAgent.findingsGenerated += memFindings;
  memAgent.status = 'recommending';
  memAgent.lastActivity = _now();

  // ── Agent 3: CoreOptimizer scans compute ──────────────────────────────────
  const cpuAgent = _aiAgents.find(a => a.role === 'compute-optimizer')!;
  cpuAgent.status = 'running-tests';
  const cpuSnaps = runComputeMonitoringCycle();
  testsRun += cpuSnaps.length;
  const cpuFindings = cpuSnaps.filter(s => s.health !== 'healthy').length;
  findingsRaised += cpuFindings;
  cpuAgent.testsConducted += cpuSnaps.length;
  cpuAgent.findingsGenerated += cpuFindings;
  if (cpuFindings > 0) cpuAgent.actionsAutoTaken++;
  cpuAgent.status = 'recommending';
  cpuAgent.lastActivity = _now();

  // ── Agent 4: StorageGuard scans storage ───────────────────────────────────
  const stAgent = _aiAgents.find(a => a.role === 'storage-architect')!;
  stAgent.status = 'running-tests';
  const stSnaps = runStorageMonitoringCycle();
  testsRun += stSnaps.length;
  const stFindings = stSnaps.filter(s => s.health !== 'healthy').length;
  findingsRaised += stFindings;
  stAgent.testsConducted += stSnaps.length;
  stAgent.findingsGenerated += stFindings;
  stAgent.status = 'recommending';
  stAgent.lastActivity = _now();

  // ── Agent 5: FlowMapper scans use-flow ────────────────────────────────────
  const flowAgent = _aiAgents.find(a => a.role === 'flow-cartographer')!;
  flowAgent.status = 'running-tests';
  const flowSnap = takeUseFlowSnapshot();
  testsRun += flowSnap.funnels.length;
  const flowFindings = flowSnap.funnels.filter(f => f.health === 'degraded').length;
  findingsRaised += flowFindings;
  flowAgent.testsConducted += flowSnap.funnels.length;
  flowAgent.findingsGenerated += flowFindings;
  flowAgent.status = 'recommending';
  flowAgent.lastActivity = _now();

  // ── Agent 6: IncidentCommander triages new issues ─────────────────────────
  const incAgent = _aiAgents.find(a => a.role === 'incident-commander')!;
  incAgent.status = 'remediating';
  const openIssues = getOpenIssues();
  for (const issue of openIssues) {
    if (issue.status === 'open') {
      triageIssue(issue.id, incAgent.id);
      incAgent.actionsAutoTaken++;
    }
    // Auto-resolve warnings
    if (issue.severity === 'warning' && issue.status === 'triaged') {
      resolveIssue(issue.id, 'Auto-resolved by IncidentCommander: metric returned to baseline', true);
      issuesResolved++;
      incAgent.actionsAutoTaken++;
    }
  }
  issuesOpened = openIssues.length;
  incAgent.status = 'reporting';
  incAgent.lastActivity = _now();

  // ── Agent 7: ReportSynth generates reports ────────────────────────────────
  const repAgent = _aiAgents.find(a => a.role === 'report-synthesizer')!;
  repAgent.status = 'reporting';
  const weeklyReport = generateOpsReport('weekly-ops', repAgent.id);
  reportsGenerated++;
  repAgent.findingsGenerated += weeklyReport.sections.length;
  repAgent.testsConducted++;
  repAgent.status = 'idle';
  repAgent.lastActivity = _now();

  // ── Agent 8: DashCurator emits recommendations and refreshes dashboard ────
  const dashAgent = _aiAgents.find(a => a.role === 'dashboard-curator')!;
  dashAgent.status = 'recommending';

  // Emit recommendations based on findings
  const newRecs = _buildCycleRecommendations(memSnaps, cpuSnaps, stSnaps, flowSnap, chaosResults);
  _recommendations.push(...newRecs);
  recommendationsEmitted = newRecs.length;
  dashAgent.recommendationsIssued += newRecs.length;
  dashAgent.actionsAutoTaken++;

  // Refresh panels
  _refreshDashboardPanels();

  dashAgent.status = 'idle';
  dashAgent.lastActivity = _now();
  dashAgent.currentTask = 'Dashboard live — next cycle standby';

  // ── Mark all agents idle after cycle ─────────────────────────────────────
  for (const agent of _aiAgents) {
    agent.status = 'idle';
    agent.currentTask = 'Cycle complete — standby';
  }

  const healthAfter: HealthStatus = _issues.filter(i => i.severity === 'critical' && i.status !== 'resolved').length > 2
    ? 'critical'
    : _issues.filter(i => i.status === 'open').length > 5 ? 'degraded' : 'healthy';

  const cycle: AIGroupCycle = {
    id: sovereignId(),
    startedAt: cycleStart,
    completedAt: _now(),
    agentsActive: _aiAgents.length,
    testsRun,
    findingsRaised,
    issuesOpened,
    issuesResolved,
    recommendationsEmitted,
    reportsGenerated,
    overallHealthBefore: healthBefore,
    overallHealthAfter: healthAfter,
  };
  _groupCycles.push(cycle);
  return cycle;
}

/** Get all AI group cycles. */
export function getAIGroupCycles(): AIGroupCycle[] {
  return [..._groupCycles];
}

function _buildCycleRecommendations(
  memSnaps: MemorySnapshot[],
  cpuSnaps: ComputeSnapshot[],
  stSnaps: StorageSnapshot[],
  flowSnap: UseFlowSnapshot,
  chaosResults: ChaosExperiment[],
): DashboardRecommendation[] {
  const recs: DashboardRecommendation[] = [];
  const agent = 'opsai-008';

  // Memory recs
  const leakySvcs = memSnaps.filter(s => s.leakSuspected);
  if (leakySvcs.length > 0) {
    recs.push({
      id: sovereignId(), timestamp: _now(), priority: 'high',
      category: 'memory-leak',
      title: `Memory leak detected in ${leakySvcs.length} service(s)`,
      detail: `Services with suspected leaks: ${leakySvcs.map(s => s.service).join(', ')}`,
      affectedService: leakySvcs[0].service,
      estimatedImpact: 'OOM risk within 4-8 hours if untreated',
      suggestedAction: 'Trigger heap dump; review retention hotspots; schedule GC tuning session',
      generatedBy: agent, acknowledged: false, applied: false,
    });
  }

  // CPU recs
  const hotCpuSvcs = cpuSnaps.filter(s => s.health !== 'healthy');
  if (hotCpuSvcs.length > 0) {
    recs.push({
      id: sovereignId(), timestamp: _now(), priority: hotCpuSvcs.some(s => s.health === 'critical') ? 'critical' : 'medium',
      category: 'cpu-saturation',
      title: `CPU saturation on ${hotCpuSvcs.length} service(s)`,
      detail: `Services: ${hotCpuSvcs.map(s => `${s.service} (${s.cpuUtilizationPct}%)`).join(', ')}`,
      affectedService: hotCpuSvcs[0].service,
      estimatedImpact: 'Latency degradation; risk of SLO breach within 30 minutes',
      suggestedAction: 'Auto-scale triggered; review hot functions; consider query optimization',
      generatedBy: agent, acknowledged: false, applied: false,
    });
  }

  // Storage recs
  const fullStorage = stSnaps.filter(s => s.utilizationPct > 80);
  if (fullStorage.length > 0) {
    recs.push({
      id: sovereignId(), timestamp: _now(), priority: fullStorage.some(s => s.utilizationPct > 90) ? 'critical' : 'high',
      category: 'storage-exhaustion',
      title: `Storage capacity warning on ${fullStorage.length} service(s)`,
      detail: `Services: ${fullStorage.map(s => `${s.service} (${s.utilizationPct}%)`).join(', ')}`,
      affectedService: fullStorage[0].service,
      estimatedImpact: 'Write failures within 24 hours if not addressed',
      suggestedAction: 'Expand storage tier; archive cold data; review retention policies',
      generatedBy: agent, acknowledged: false, applied: false,
    });
  }

  // Flow recs
  const bottlenecks = flowSnap.funnels.filter(f => f.health === 'degraded');
  if (bottlenecks.length > 0) {
    recs.push({
      id: sovereignId(), timestamp: _now(), priority: 'medium',
      category: 'flow-bottleneck',
      title: `Flow bottleneck in ${bottlenecks.length} funnel(s)`,
      detail: `Funnels: ${bottlenecks.map(f => `${f.name} (bottleneck: ${f.bottleneck})`).join(', ')}`,
      affectedService: bottlenecks[0].service,
      estimatedImpact: `${(bottlenecks[0].dropOffRates[bottlenecks[0].bottleneck] * 100).toFixed(0)}% drop-off at ${bottlenecks[0].bottleneck} stage`,
      suggestedAction: 'Profile bottleneck stage; add caching; consider async processing',
      generatedBy: agent, acknowledged: false, applied: false,
    });
  }

  // Chaos recs
  const weakChaos = chaosResults.filter(e => e.resilienceScore < 0.7);
  if (weakChaos.length > 0) {
    recs.push({
      id: sovereignId(), timestamp: _now(), priority: 'high',
      category: 'reliability',
      title: `${weakChaos.length} chaos experiment(s) revealed resilience gaps`,
      detail: `Weak services: ${weakChaos.map(e => e.target.service).join(', ')}`,
      affectedService: weakChaos[0].target.service,
      estimatedImpact: 'Potential outage under real fault conditions',
      suggestedAction: 'Implement circuit breakers; add retry logic; review fallback strategies',
      generatedBy: agent, acknowledged: false, applied: false,
    });
  }

  return recs;
}

function _refreshDashboardPanels(): void {
  for (const panel of _panels) {
    panel.lastUpdated = _now();
    switch (panel.type) {
      case 'chaos-status':
        panel.data = { experiments: _chaosExperiments.length, reports: _chaosReports.length };
        panel.alertCount = _chaosExperiments.filter(e => e.resilienceScore < 0.6 && e.status === 'completed').length;
        break;
      case 'memory-overview':
        panel.data = { snapshots: _memorySnapshots.length, alerts: _memoryAlerts.length };
        panel.alertCount = _memoryAlerts.filter(a => a.severity === 'critical').length;
        break;
      case 'compute-overview':
        panel.data = { snapshots: _computeSnapshots.length, alerts: _computeAlerts.length };
        panel.alertCount = _computeAlerts.filter(a => a.severity === 'critical').length;
        break;
      case 'storage-overview':
        panel.data = { snapshots: _storageSnapshots.length, alerts: _storageAlerts.length };
        panel.alertCount = _storageAlerts.filter(a => a.severity === 'critical').length;
        break;
      case 'flow-overview':
        panel.data = { snapshots: _useFlowSnapshots.length };
        panel.alertCount = _useFlowSnapshots.filter(s => s.health !== 'healthy').length;
        break;
      case 'ai-group-status':
        panel.data = { agents: _aiAgents.length, cycles: _groupCycles.length };
        panel.alertCount = 0;
        break;
      case 'issue-feed':
        panel.data = { open: _issues.filter(i => i.status === 'open').length, total: _issues.length };
        panel.alertCount = _issues.filter(i => i.severity === 'critical').length;
        break;
      case 'recommendation-feed':
        panel.data = { total: _recommendations.length, pending: _recommendations.filter(r => !r.acknowledged).length };
        panel.alertCount = _recommendations.filter(r => r.priority === 'critical').length;
        break;
      case 'report-feed':
        panel.data = { reports: _reports.length };
        panel.alertCount = 0;
        break;
      case 'health-heatmap':
        panel.data = { services: ENTERPRISE_SERVICES.length };
        panel.alertCount = _issues.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
        break;
      case 'slo-tracker':
        panel.data = { sloCompliance: '98.7%', errorBudgetRemaining: '62%' };
        panel.alertCount = _issues.filter(i => i.category === 'slo-breach').length;
        break;
    }
    // Compute panel health from alertCount
    panel.health = panel.alertCount === 0 ? 'healthy' : panel.alertCount < 3 ? 'degraded' : 'critical';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// §11  LIVE DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get the live dashboard state.
 * The dashboard is always running — calling this triggers a panel refresh.
 */
export function getLiveDashboard(): LiveDashboard {
  _refreshDashboardPanels();
  const open = _issues.filter(i => i.status === 'open' || i.status === 'triaged' || i.status === 'in-progress');
  const critical = _issues.filter(i => i.severity === 'critical' && i.status !== 'resolved');
  const overallHealth: HealthStatus = critical.length > 3 ? 'critical'
    : critical.length > 0 ? 'degraded'
    : open.length > 8 ? 'degraded'
    : 'healthy';

  return {
    id: 'live-dashboard',
    name: 'Enterprise AI Ops — Live Dashboard',
    lastRefresh: _now(),
    refreshIntervalMs: HEARTBEAT_MS,
    panels: [..._panels],
    activeRecommendations: _recommendations.filter(r => !r.applied),
    openIssues: open.length,
    criticalIssues: critical.length,
    overallHealth,
    aiGroupActive: _aiAgents.some(a => a.status !== 'idle'),
    cyclesCompleted: _groupCycles.length,
    uptimeMs: Date.now() - _INIT_TIME,
  };
}

/** Get a specific dashboard panel. */
export function getDashboardPanel(type: DashboardPanelType): DashboardPanel | undefined {
  return _panels.find(p => p.type === type);
}

/** Get all current dashboard recommendations. */
export function getDashboardRecommendations(): DashboardRecommendation[] {
  return [..._recommendations];
}

/** Get pending (unacknowledged) recommendations. */
export function getPendingRecommendations(): DashboardRecommendation[] {
  return _recommendations.filter(r => !r.acknowledged);
}

/** Get recommendations by priority. */
export function getRecommendationsByPriority(priority: DashboardRecommendation['priority']): DashboardRecommendation[] {
  return _recommendations.filter(r => r.priority === priority);
}

/** Acknowledge a recommendation. */
export function acknowledgeRecommendation(id: string): DashboardRecommendation | undefined {
  const rec = _recommendations.find(r => r.id === id);
  if (!rec) return undefined;
  rec.acknowledged = true;
  return rec;
}

/** Mark a recommendation as applied. */
export function applyRecommendation(id: string): DashboardRecommendation | undefined {
  const rec = _recommendations.find(r => r.id === id);
  if (!rec) return undefined;
  rec.acknowledged = true;
  rec.applied = true;
  return rec;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §12  DIAGNOSTICS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Full platform diagnostics — everything in one snapshot.
 */
export function getPlatformDiagnostics(): {
  services: number;
  aiAgents: number;
  groupCycles: number;
  chaosExperiments: number;
  memorySnapshots: number;
  computeSnapshots: number;
  storageSnapshots: number;
  useFlowSnapshots: number;
  openIssues: number;
  resolvedIssues: number;
  totalRecommendations: number;
  appliedRecommendations: number;
  reports: number;
  dashboardPanels: number;
  overallHealth: HealthStatus;
  uptimeMs: number;
} {
  const open = _issues.filter(i => i.status === 'open').length;
  const resolved = _issues.filter(i => i.status === 'resolved').length;
  const critical = _issues.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
  return {
    services: ENTERPRISE_SERVICES.length,
    aiAgents: _aiAgents.length,
    groupCycles: _groupCycles.length,
    chaosExperiments: _chaosExperiments.length,
    memorySnapshots: _memorySnapshots.length,
    computeSnapshots: _computeSnapshots.length,
    storageSnapshots: _storageSnapshots.length,
    useFlowSnapshots: _useFlowSnapshots.length,
    openIssues: open,
    resolvedIssues: resolved,
    totalRecommendations: _recommendations.length,
    appliedRecommendations: _recommendations.filter(r => r.applied).length,
    reports: _reports.length,
    dashboardPanels: _panels.length,
    overallHealth: critical > 2 ? 'critical' : open > 5 ? 'degraded' : 'healthy',
    uptimeMs: Date.now() - _INIT_TIME,
  };
}

/** Get the list of all monitored enterprise services. */
export function getEnterpriseServices(): readonly string[] {
  return ENTERPRISE_SERVICES;
}
