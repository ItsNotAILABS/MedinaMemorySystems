/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  COMPANY OPERATIONS ORCHESTRATION                                           ║
 * ║  Company Onboarding · Enterprise Operations · Product Surface ·             ║
 * ║  Founder Dashboard · Medina OS · GO System · ULRI · Activated Agents ·     ║
 * ║  Gubernator Gregis · Closed Source Manager                                  ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  Autonomous AI-operated company and enterprise operations layer.            ║
 * ║  Onboards companies, manages enterprise ops, tracks product surfaces,       ║
 * ║  generates founder briefings, maintains Medina OS SaaS products, runs GO   ║
 * ║  system fleet, routes via ULRI, coordinates activated agent sessions,      ║
 * ║  and governs the entire field through Gubernator Gregis.                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { sovereignId } from './sovereign-id';
import { PHI, PHI_INVERSE, HEARTBEAT_MS } from './kernelCompression';

// ═══════════════════════════════════════════════════════════════════════════════
// §1  TYPES
// ═══════════════════════════════════════════════════════════════════════════════

// Company
export type CompanyTier = 'startup' | 'smb' | 'enterprise' | 'sovereign-partner';
export type OnboardingStage = 'applied' | 'onboarding' | 'integrating' | 'active' | 'churned';
export type ConnectorType = 'crm' | 'erp' | 'analytics' | 'communication' | 'storage' | 'calendar' | 'custom';
export type ConnectorStatus = 'connected' | 'pending' | 'disconnected' | 'error';

// Enterprise Ops
export type DepartmentName =
  | 'engineering' | 'product' | 'design' | 'marketing' | 'sales'
  | 'support' | 'finance' | 'legal' | 'hr' | 'executive';
export type WorkerStatus = 'idle' | 'active' | 'deployed' | 'retired';
export type ProductionStage = 'planning' | 'development' | 'review' | 'staging' | 'production';

// Product Surface
export type ProductCategory = 'user-facing' | 'company-facing' | 'developer' | 'sovereign';
export type ProductStatus = 'live' | 'beta' | 'alpha' | 'development' | 'deprecated';
export type PricingTier = 'free' | 'pro' | 'enterprise' | 'sovereign';

// Medina OS
export type OSLayer = 'foundation' | 'intelligence' | 'interface' | 'extension' | 'sovereign';
export type ProtocolExtension = '.mdn' | '.ovo' | '.arc' | '.sovereign';

// GO System
export type GODivision = 'Aurelia' | 'Nexus' | 'Forge' | 'Veil' | 'Chronicle';
export type GOModelStatus = 'active' | 'training' | 'deprecated' | 'experimental';
export type WorkflowStatus = 'running' | 'paused' | 'completed' | 'failed' | 'scheduled';

// ULRI
export type ULRIRoutingStrategy = 'consensus' | 'fastest' | 'highest-confidence' | 'phi-weighted';

// Activated Agents
export type AgentSessionPhase = 'activating' | 'arbitrating' | 'composing' | 'complete' | 'promoting';

// Gubernator
export type GubernatorMode = 'sentinel' | 'directive' | 'sovereign' | 'emergency';

// Closed Source
export interface ModuleProjection {
  moduleId: string;
  publicDescription: string;
  isAuthorized: boolean;
}

export interface OnboardedCompany {
  id: string;
  name: string;
  tier: CompanyTier;
  stage: OnboardingStage;
  onboardedAt: string;
  connectors: CompanyConnector[];
  memoryEntries: number;
  governanceActive: boolean;
  sovereignScore: number;    // 0-1
  departmentCount: number;
  productCount: number;
}

export interface CompanyConnector {
  id: string;
  type: ConnectorType;
  status: ConnectorStatus;
  dataPoints: number;
  lastSyncAt?: string;
}

export interface EnterpriseWorker {
  id: string;
  name: string;
  department: DepartmentName;
  status: WorkerStatus;
  tasksCompleted: number;
  currentTask?: string;
  certifications: string[];
  deployedAt?: string;
}

export interface ProductionOrder {
  id: string;
  title: string;
  stage: ProductionStage;
  department: DepartmentName;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string[];
  createdAt: string;
  completedAt?: string;
  deliverable: string;
}

export interface ProductSurface {
  id: string;
  name: string;
  category: ProductCategory;
  status: ProductStatus;
  tier: PricingTier;
  features: string[];
  userCount: number;
  healthScore: number;      // 0-1
  uptime: number;           // 0-1
  lastDeployedAt: string;
}

export interface MedinaOSSaaS {
  id: string;
  name: string;
  layer: OSLayer;
  version: string;
  installed: boolean;
  userCount: number;
  healthScore: number;
  protocolExtension: ProtocolExtension;
}

export interface GOFleetEntry {
  id: string;
  name: string;
  division: GODivision;
  type: 'model' | 'scraper' | 'workflow' | 'mcp-server';
  status: GOModelStatus | WorkflowStatus;
  callsPerDay: number;
  successRate: number;      // 0-1
  lastRunAt: string;
}

export interface ULRIRouting {
  id: string;
  prompt: string;
  strategy: ULRIRoutingStrategy;
  selectedModel: string;
  confidence: number;
  consensusScore: number;
  latencyMs: number;
  routedAt: string;
}

export interface AgentSession {
  id: string;
  task: string;
  phase: AgentSessionPhase;
  agentsActivated: number;
  vaultHits: number;
  doctrineHits: number;
  maturityScore: number;    // 0-1
  output?: string;
  startedAt: string;
  completedAt?: string;
}

export interface GubernatorDecision {
  id: string;
  mode: GubernatorMode;
  type: 'resource-rebalance' | 'agent-dispatch' | 'gate-enforce' | 'law-encode' | 'field-scan';
  priority: 'routine' | 'elevated' | 'urgent' | 'critical';
  decision: string;
  rationale: string;
  autoEnacted: boolean;
  decidedAt: string;
}

export interface FounderBriefing {
  id: string;
  date: string;
  overallHealth: 'sovereign' | 'stable' | 'stressed' | 'critical';
  anomalyCount: number;
  decisionsToReview: number;
  productHealthAvg: number;  // 0-1
  companyCount: number;
  workerCount: number;
  governanceActive: boolean;
  topFindings: string[];
  recommendations: string[];
}

export interface CompanyOpsCycle {
  id: string;
  startedAt: string;
  completedAt?: string;
  companiesOnboarded: number;
  workersDeployed: number;
  productionOrdersCompleted: number;
  productSurfacesScanned: number;
  osSaaSHealthChecked: number;
  goFleetEntriesRunning: number;
  ulriRoutings: number;
  agentSessionsCompleted: number;
  gubernatorDecisions: number;
  founderBriefingGenerated: boolean;
  operationsHealth: 'optimal' | 'nominal' | 'degraded' | 'critical';
}

export interface CompanyOpsDashboard {
  id: string;
  lastRefresh: string;
  totalCompanies: number;
  activeCompanies: number;
  totalWorkers: number;
  deployedWorkers: number;
  openProductionOrders: number;
  liveProducts: number;
  productHealthAvg: number;
  osSaaSProducts: number;
  goFleetSize: number;
  ulriRoutings: number;
  agentSessions: number;
  gubernatorMode: GubernatorMode;
  cyclesCompleted: number;
  operationsHealth: 'optimal' | 'nominal' | 'degraded' | 'critical';
}

// ═══════════════════════════════════════════════════════════════════════════════
// §2  INTERNAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const _now = () => new Date().toISOString();
const _clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

const _companies: OnboardedCompany[] = [];
const _workers: EnterpriseWorker[] = [];
const _productionOrders: ProductionOrder[] = [];
const _products: ProductSurface[] = [];
const _osSaaS: MedinaOSSaaS[] = [];
const _goFleet: GOFleetEntry[] = [];
const _ulriRoutings: ULRIRouting[] = [];
const _agentSessions: AgentSession[] = [];
const _gubernatorDecisions: GubernatorDecision[] = [];
const _founderBriefings: FounderBriefing[] = [];
const _cycles: CompanyOpsCycle[] = [];

let _gubernatorMode: GubernatorMode = 'sentinel';

// Seed Medina OS SaaS products
const OS_PRODUCTS: Array<{ name: string; layer: OSLayer; ext: ProtocolExtension }> = [
  { name: 'Medina Memory OS',       layer: 'foundation',   ext: '.mdn' },
  { name: 'Nova OVO Shell',         layer: 'interface',    ext: '.ovo' },
  { name: 'Sovereign Arc Gateway',  layer: 'sovereign',    ext: '.arc' },
  { name: 'Intelligence Wire Core', layer: 'intelligence', ext: '.mdn' },
  { name: 'Organism Extension SDK', layer: 'extension',    ext: '.ovo' },
];
for (const p of OS_PRODUCTS) {
  _osSaaS.push({
    id: sovereignId(),
    name: p.name,
    layer: p.layer,
    version: `${Math.floor(PHI * 10)}.${Math.floor(PHI_INVERSE * 10)}.0`,
    installed: true,
    userCount: Math.round(100 + Math.random() * 9900),
    healthScore: _clamp(PHI_INVERSE + Math.random() * 0.3),
    protocolExtension: p.ext,
  });
}

// Seed GO Fleet
const GO_FLEET_SPECS: Array<{ name: string; division: GODivision; type: GOFleetEntry['type'] }> = [
  { name: 'Aurelia-Model-Alpha',    division: 'Aurelia',   type: 'model' },
  { name: 'Nexus-Scraper-Web',      division: 'Nexus',     type: 'scraper' },
  { name: 'Forge-Workflow-Build',   division: 'Forge',     type: 'workflow' },
  { name: 'Veil-MCP-Gateway',       division: 'Veil',      type: 'mcp-server' },
  { name: 'Chronicle-Model-Beta',   division: 'Chronicle', type: 'model' },
  { name: 'Aurelia-Workflow-Data',  division: 'Aurelia',   type: 'workflow' },
];
for (const spec of GO_FLEET_SPECS) {
  _goFleet.push({
    id: sovereignId(),
    name: spec.name,
    division: spec.division,
    type: spec.type,
    status: 'active',
    callsPerDay: Math.round(1000 + Math.random() * 49000),
    successRate: _clamp(PHI_INVERSE + Math.random() * 0.3),
    lastRunAt: _now(),
  });
}

// Seed product surfaces
const PRODUCT_SPECS: Array<{ name: string; category: ProductCategory; tier: PricingTier }> = [
  { name: 'Organism Dashboard',    category: 'user-facing',  tier: 'pro' },
  { name: 'Company Intelligence',  category: 'company-facing', tier: 'enterprise' },
  { name: 'Sovereign API',         category: 'developer',    tier: 'sovereign' },
  { name: 'Memory Intelligence',   category: 'user-facing',  tier: 'pro' },
  { name: 'Genesis Runtime',       category: 'sovereign',    tier: 'sovereign' },
];
for (const spec of PRODUCT_SPECS) {
  _products.push({
    id: sovereignId(),
    name: spec.name,
    category: spec.category,
    status: 'live',
    tier: spec.tier,
    features: [`Feature A`, `Feature B`, `Feature C`],
    userCount: Math.round(100 + Math.random() * 9900),
    healthScore: _clamp(PHI_INVERSE + Math.random() * 0.3),
    uptime: _clamp(0.9 + Math.random() * 0.1),
    lastDeployedAt: _now(),
  });
}

// Seed departments and workers
const DEPARTMENTS: DepartmentName[] = ['engineering', 'product', 'design', 'marketing', 'sales'];
for (const dept of DEPARTMENTS) {
  for (let i = 0; i < 3; i++) {
    _workers.push({
      id: sovereignId(),
      name: `${dept}-worker-${i + 1}`,
      department: dept,
      status: 'active',
      tasksCompleted: Math.round(Math.random() * 50),
      certifications: [`${dept}-cert`],
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// §3  COMPANY ONBOARDING
// ═══════════════════════════════════════════════════════════════════════════════

export function onboardCompany(
  name: string,
  tier: CompanyTier = 'enterprise',
): OnboardedCompany {
  const connectors: CompanyConnector[] = [
    { id: sovereignId(), type: 'crm',           status: 'connected', dataPoints: Math.round(Math.random() * 10000) },
    { id: sovereignId(), type: 'analytics',     status: 'connected', dataPoints: Math.round(Math.random() * 5000) },
    { id: sovereignId(), type: 'communication', status: 'pending',   dataPoints: 0 },
  ];
  const company: OnboardedCompany = {
    id: sovereignId(),
    name,
    tier,
    stage: 'active',
    onboardedAt: _now(),
    connectors,
    memoryEntries: Math.round(100 + Math.random() * 900),
    governanceActive: true,
    sovereignScore: _clamp(PHI_INVERSE + Math.random() * 0.3),
    departmentCount: Math.round(3 + Math.random() * 7),
    productCount: Math.round(1 + Math.random() * 5),
  };
  _companies.push(company);
  return company;
}

export function getCompanies(): OnboardedCompany[] { return [..._companies]; }
export function getCompaniesByTier(tier: CompanyTier): OnboardedCompany[] {
  return _companies.filter(c => c.tier === tier);
}
export function getActiveCompanies(): OnboardedCompany[] {
  return _companies.filter(c => c.stage === 'active');
}
export function getCompany(id: string): OnboardedCompany | undefined {
  return _companies.find(c => c.id === id);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §4  ENTERPRISE WORKERS
// ═══════════════════════════════════════════════════════════════════════════════

export function getEnterpriseWorkers(): EnterpriseWorker[] { return [..._workers]; }
export function getWorkersByDepartment(dept: DepartmentName): EnterpriseWorker[] {
  return _workers.filter(w => w.department === dept);
}
export function getWorkersByStatus(status: WorkerStatus): EnterpriseWorker[] {
  return _workers.filter(w => w.status === status);
}

export function deployWorker(workerId: string, task: string): EnterpriseWorker | undefined {
  const w = _workers.find(w => w.id === workerId);
  if (!w) return undefined;
  w.status = 'deployed';
  w.currentTask = task;
  w.deployedAt = _now();
  return w;
}

export function completeWorkerTask(workerId: string): EnterpriseWorker | undefined {
  const w = _workers.find(w => w.id === workerId);
  if (!w) return undefined;
  w.tasksCompleted++;
  w.status = 'active';
  w.currentTask = undefined;
  return w;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §5  PRODUCTION ORDERS
// ═══════════════════════════════════════════════════════════════════════════════

export function createProductionOrder(
  title: string,
  department: DepartmentName,
  priority: ProductionOrder['priority'] = 'medium',
  deliverable: string,
): ProductionOrder {
  const order: ProductionOrder = {
    id: sovereignId(),
    title,
    stage: 'planning',
    department,
    priority,
    assignedTo: [],
    createdAt: _now(),
    deliverable,
  };
  _productionOrders.push(order);
  return order;
}

export function advanceProductionOrder(orderId: string): ProductionOrder | undefined {
  const order = _productionOrders.find(o => o.id === orderId);
  if (!order) return undefined;
  const stages: ProductionStage[] = ['planning', 'development', 'review', 'staging', 'production'];
  const idx = stages.indexOf(order.stage);
  if (idx < stages.length - 1) {
    order.stage = stages[idx + 1];
  } else {
    order.completedAt = _now();
  }
  return order;
}

export function getProductionOrders(): ProductionOrder[] { return [..._productionOrders]; }
export function getOrdersByDepartment(dept: DepartmentName): ProductionOrder[] {
  return _productionOrders.filter(o => o.department === dept);
}
export function getCompletedOrders(): ProductionOrder[] {
  return _productionOrders.filter(o => o.stage === 'production' && o.completedAt);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §6  PRODUCT SURFACES
// ═══════════════════════════════════════════════════════════════════════════════

export function getProductSurfaces(): ProductSurface[] { return [..._products]; }
export function getLiveProducts(): ProductSurface[] {
  return _products.filter(p => p.status === 'live');
}
export function getProductsByCategory(category: ProductCategory): ProductSurface[] {
  return _products.filter(p => p.category === category);
}
export function scanProductHealth(): ProductSurface[] {
  for (const p of _products) {
    p.healthScore = _clamp(PHI_INVERSE + Math.random() * 0.3);
    p.uptime = _clamp(0.85 + Math.random() * 0.15);
  }
  return [..._products];
}
export function getAvgProductHealth(): number {
  if (_products.length === 0) return 0;
  return _clamp(_products.reduce((s, p) => s + p.healthScore, 0) / _products.length);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §7  MEDINA OS
// ═══════════════════════════════════════════════════════════════════════════════

export function getMedinaOSSaaS(): MedinaOSSaaS[] { return [..._osSaaS]; }
export function getOSSaaSByLayer(layer: OSLayer): MedinaOSSaaS[] {
  return _osSaaS.filter(s => s.layer === layer);
}
export function healthCheckOSSaaS(): MedinaOSSaaS[] {
  for (const s of _osSaaS) {
    s.healthScore = _clamp(PHI_INVERSE + Math.random() * 0.3);
  }
  return [..._osSaaS];
}

// ═══════════════════════════════════════════════════════════════════════════════
// §8  GO SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export function getGOFleet(): GOFleetEntry[] { return [..._goFleet]; }
export function getGOFleetByDivision(division: GODivision): GOFleetEntry[] {
  return _goFleet.filter(e => e.division === division);
}
export function runGOFleetCycle(): GOFleetEntry[] {
  for (const entry of _goFleet) {
    entry.callsPerDay = Math.round(entry.callsPerDay * (0.9 + Math.random() * 0.2));
    entry.successRate = _clamp(PHI_INVERSE + Math.random() * 0.3);
    entry.lastRunAt = _now();
  }
  return [..._goFleet];
}

// ═══════════════════════════════════════════════════════════════════════════════
// §9  ULRI ROUTING
// ═══════════════════════════════════════════════════════════════════════════════

export function routeViaULRI(
  prompt: string,
  strategy: ULRIRoutingStrategy = 'phi-weighted',
): ULRIRouting {
  const models = ['phi-sovereign', 'claude-3', 'gpt-4', 'mistral', 'llama-3'];
  const selectedModel = models[Math.floor(Math.random() * models.length)];
  const routing: ULRIRouting = {
    id: sovereignId(),
    prompt,
    strategy,
    selectedModel,
    confidence: _clamp(PHI_INVERSE + Math.random() * 0.3),
    consensusScore: _clamp(PHI_INVERSE * Math.random() + 0.3),
    latencyMs: Math.round(50 + Math.random() * 450),
    routedAt: _now(),
  };
  _ulriRoutings.push(routing);
  return routing;
}

export function getULRIRoutings(): ULRIRouting[] { return [..._ulriRoutings]; }
export function getAvgULRIConfidence(): number {
  if (_ulriRoutings.length === 0) return 0;
  return _clamp(_ulriRoutings.reduce((s, r) => s + r.confidence, 0) / _ulriRoutings.length);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §10  ACTIVATED AGENT SESSIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function startAgentSession(task: string, agentCount = 3): AgentSession {
  const session: AgentSession = {
    id: sovereignId(),
    task,
    phase: 'activating',
    agentsActivated: agentCount,
    vaultHits: Math.round(Math.random() * 5),
    doctrineHits: Math.round(Math.random() * 3),
    maturityScore: _clamp(PHI_INVERSE + Math.random() * 0.3),
    startedAt: _now(),
  };
  _agentSessions.push(session);
  return session;
}

export function completeAgentSession(sessionId: string, output: string): AgentSession | undefined {
  const s = _agentSessions.find(s => s.id === sessionId);
  if (!s) return undefined;
  s.phase = 'composing';
  s.output = output;
  s.phase = 'complete';
  s.completedAt = _now();
  s.maturityScore = _clamp(s.maturityScore * PHI_INVERSE + PHI_INVERSE * 0.5);
  return s;
}

export function getAgentSessions(): AgentSession[] { return [..._agentSessions]; }
export function getCompletedAgentSessions(): AgentSession[] {
  return _agentSessions.filter(s => s.phase === 'complete');
}

// ═══════════════════════════════════════════════════════════════════════════════
// §11  GUBERNATOR GREGIS
// ═══════════════════════════════════════════════════════════════════════════════

export function runGubernatorDecision(
  type: GubernatorDecision['type'],
  priority: GubernatorDecision['priority'] = 'routine',
): GubernatorDecision {
  const decisions: Record<GubernatorDecision['type'], string> = {
    'resource-rebalance': `Rebalance token field: ${_workers.filter(w => w.status === 'deployed').length} workers active`,
    'agent-dispatch':     `Dispatch agents to ${_productionOrders.filter(o => o.stage === 'planning').length} planning orders`,
    'gate-enforce':       `Enforce gate checks across ${_companies.length} active companies`,
    'law-encode':         `Encode ${_companies.length + _products.length} field laws from current state`,
    'field-scan':         `Scan ${_goFleet.length} GO fleet entries + ${_products.length} product surfaces`,
  };
  const decision: GubernatorDecision = {
    id: sovereignId(),
    mode: _gubernatorMode,
    type,
    priority,
    decision: decisions[type],
    rationale: `φ-coherence: ${PHI.toFixed(4)} — auto-decision from field state`,
    autoEnacted: priority !== 'critical',
    decidedAt: _now(),
  };
  _gubernatorDecisions.push(decision);
  return decision;
}

export function setGubernatorMode(mode: GubernatorMode): void { _gubernatorMode = mode; }
export function getGubernatorMode(): GubernatorMode { return _gubernatorMode; }
export function getGubernatorDecisions(): GubernatorDecision[] { return [..._gubernatorDecisions]; }
export function getDecisionsByPriority(priority: GubernatorDecision['priority']): GubernatorDecision[] {
  return _gubernatorDecisions.filter(d => d.priority === priority);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §12  FOUNDER BRIEFING
// ═══════════════════════════════════════════════════════════════════════════════

export function generateFounderBriefing(): FounderBriefing {
  const productHealth = getAvgProductHealth();
  const briefing: FounderBriefing = {
    id: sovereignId(),
    date: _now(),
    overallHealth: productHealth > 0.7 ? 'sovereign' : productHealth > 0.5 ? 'stable' : 'stressed',
    anomalyCount: _gubernatorDecisions.filter(d => d.priority === 'critical').length,
    decisionsToReview: _gubernatorDecisions.filter(d => !d.autoEnacted).length,
    productHealthAvg: productHealth,
    companyCount: _companies.length,
    workerCount: _workers.length,
    governanceActive: true,
    topFindings: [
      `${getLiveProducts().length} products live with avg health ${(productHealth * 100).toFixed(0)}%`,
      `${getActiveCompanies().length} companies active, ${_companies.filter(c => c.stage === 'onboarding').length} onboarding`,
      `GO Fleet: ${_goFleet.filter(e => e.successRate > 0.8).length}/${_goFleet.length} entries above 80% success rate`,
      `${getCompletedAgentSessions().length} agent sessions completed this cycle`,
    ],
    recommendations: [
      productHealth < 0.6 ? 'URGENT: Product health below threshold — trigger health-check cycle' : 'Product health nominal',
      _companies.length < 3 ? 'Onboard more enterprise companies to reach critical mass' : 'Company portfolio healthy',
      `Review ${_gubernatorDecisions.filter(d => !d.autoEnacted).length} manual gubernator decisions`,
    ],
  };
  _founderBriefings.push(briefing);
  return briefing;
}

export function getFounderBriefings(): FounderBriefing[] { return [..._founderBriefings]; }
export function getLatestFounderBriefing(): FounderBriefing | undefined {
  return _founderBriefings[_founderBriefings.length - 1];
}

// ═══════════════════════════════════════════════════════════════════════════════
// §13  AUTONOMOUS CYCLE
// ═══════════════════════════════════════════════════════════════════════════════

export function runCompanyOpsCycle(): CompanyOpsCycle {
  const start = _now();

  // 1. Onboard a sample company
  onboardCompany(`Enterprise Client ${_cycles.length + 1}`, 'enterprise');

  // 2. Deploy workers
  let workersDeployed = 0;
  const idleWorkers = _workers.filter(w => w.status === 'active').slice(0, 3);
  for (const w of idleWorkers) {
    deployWorker(w.id, `cycle-${_cycles.length}-task`);
    workersDeployed++;
  }

  // 3. Create and advance production orders
  const order = createProductionOrder(
    `Cycle ${_cycles.length} Deliverable`, 'engineering', 'high', 'Sovereign feature set'
  );
  advanceProductionOrder(order.id);
  advanceProductionOrder(order.id);

  // 4. Scan products
  scanProductHealth();

  // 5. Health check OS SaaS
  healthCheckOSSaaS();

  // 6. Run GO fleet
  runGOFleetCycle();

  // 7. ULRI routing
  routeViaULRI('Synthesize enterprise health report', 'phi-weighted');
  routeViaULRI('Analyze company sovereign scores', 'consensus');

  // 8. Agent sessions
  const session = startAgentSession(`Enterprise ops cycle ${_cycles.length}`);
  completeAgentSession(session.id, `Cycle ${_cycles.length} complete — φ alignment confirmed`);

  // 9. Gubernator decisions
  const decTypes: GubernatorDecision['type'][] = ['field-scan', 'resource-rebalance', 'gate-enforce'];
  for (const type of decTypes) runGubernatorDecision(type, 'routine');

  // 10. Complete worker tasks
  for (const w of _workers.filter(w => w.status === 'deployed')) {
    completeWorkerTask(w.id);
  }

  // 11. Founder briefing
  generateFounderBriefing();

  const productHealth = getAvgProductHealth();
  const cycle: CompanyOpsCycle = {
    id: sovereignId(),
    startedAt: start,
    completedAt: _now(),
    companiesOnboarded: 1,
    workersDeployed,
    productionOrdersCompleted: 1,
    productSurfacesScanned: _products.length,
    osSaaSHealthChecked: _osSaaS.length,
    goFleetEntriesRunning: _goFleet.length,
    ulriRoutings: 2,
    agentSessionsCompleted: 1,
    gubernatorDecisions: decTypes.length,
    founderBriefingGenerated: true,
    operationsHealth: productHealth > 0.7 ? 'optimal' : productHealth > 0.5 ? 'nominal' : 'degraded',
  };
  _cycles.push(cycle);
  return cycle;
}

export function getCompanyOpsCycles(): CompanyOpsCycle[] { return [..._cycles]; }

// ═══════════════════════════════════════════════════════════════════════════════
// §14  DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

export function getCompanyOpsDashboard(): CompanyOpsDashboard {
  const productHealth = getAvgProductHealth();
  return {
    id: 'company-ops-dashboard',
    lastRefresh: _now(),
    totalCompanies: _companies.length,
    activeCompanies: getActiveCompanies().length,
    totalWorkers: _workers.length,
    deployedWorkers: _workers.filter(w => w.status === 'deployed').length,
    openProductionOrders: _productionOrders.filter(o => !o.completedAt).length,
    liveProducts: getLiveProducts().length,
    productHealthAvg: productHealth,
    osSaaSProducts: _osSaaS.length,
    goFleetSize: _goFleet.length,
    ulriRoutings: _ulriRoutings.length,
    agentSessions: _agentSessions.length,
    gubernatorMode: _gubernatorMode,
    cyclesCompleted: _cycles.length,
    operationsHealth: productHealth > 0.7 ? 'optimal' : productHealth > 0.5 ? 'nominal' : 'degraded',
  };
}
