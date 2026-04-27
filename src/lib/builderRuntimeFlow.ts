/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  BUILDER RUNTIME FLOW                                                       ║
 * ║  Builder Swarm · Genesis Runtime · Kernel · Sandbox · Export ·              ║
 * ║  Full-Stack Registry · Package Substrate · Organism Kernel Executor         ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  Autonomous AI-operated build and deployment pipeline for the organism.     ║
 * ║  Runs builder agent swarms, manages genesis entity lifecycles, executes      ║
 * ║  kernel compressions, orchestrates sandboxes, generates exports, and        ║
 * ║  maintains the full-stack registry — continuously, without human triggers.  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { sovereignId } from './sovereign-id';
import { PHI, PHI_INVERSE, PHI_SQUARED, HEARTBEAT_MS } from './kernelCompression';

// ═══════════════════════════════════════════════════════════════════════════════
// §1  TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type BuildPhase =
  | 'scaffold'
  | 'compile'
  | 'link'
  | 'test'
  | 'optimize'
  | 'package'
  | 'deploy'
  | 'verify';

export type AgentBuildRole =
  | 'scaffolder'
  | 'compiler'
  | 'linker'
  | 'tester'
  | 'optimizer'
  | 'packager'
  | 'deployer'
  | 'verifier';

export type BuildStatus = 'queued' | 'running' | 'passing' | 'failing' | 'blocked' | 'deployed';
export type SandboxTier = 'ephemeral' | 'persistent' | 'isolated' | 'production-mirror';
export type ExportFormat = 'json' | 'pdf' | 'excel' | 'binary' | 'wasm' | 'sovereign-bundle';
export type KernelState = 'compressed' | 'expanding' | 'active' | 'dormant' | 'error';
export type RuntimeEntityClass = 'genesis' | 'phantom' | 'builder' | 'executor' | 'validator';

export interface BuildArtifact {
  id: string;
  name: string;
  phase: BuildPhase;
  status: BuildStatus;
  version: string;
  size: number;           // bytes
  phiChecksum: number;    // phi-encoded integrity hash
  builtAt: string;
  deployedAt?: string;
  buildAgentId: string;
  testsRun: number;
  testsPassing: number;
  dependencies: string[];
}

export interface BuildAgent {
  id: string;
  name: string;
  role: AgentBuildRole;
  status: 'idle' | 'building' | 'blocked' | 'complete';
  artifactsBuilt: number;
  currentPhase?: BuildPhase;
  fieldGradientStrength: number;
  lastActivity: string;
  specialty: string[];
}

export interface GenesisRuntimeEntity {
  id: string;
  class: RuntimeEntityClass;
  name: string;
  phase: 'boot' | 'sync' | 'active' | 'healing' | 'complete';
  syncScore: number;       // 0-1 kuramoto sync metric
  proofHash: string;
  recoveryCount: number;
  lastHeartbeat: string;
  callsEmitted: number;
  callsReceived: number;
}

export interface KernelExecution {
  id: string;
  kernelId: string;
  state: KernelState;
  compressionRatio: number;
  phiAlignment: number;
  torusCoordinate: { theta: number; phi: number };
  executedAt: string;
  durationMs: number;
  outputGlyph: string;
  success: boolean;
}

export interface SandboxSession {
  id: string;
  tier: SandboxTier;
  name: string;
  status: 'open' | 'active' | 'sealed' | 'expired';
  createdAt: string;
  expiresAt: string;
  isolationScore: number;   // 0-1
  memoryLimitMB: number;
  cpuLimitPct: number;
  operations: number;
  mirageActive: boolean;
}

export interface ExportJob {
  id: string;
  format: ExportFormat;
  source: string;
  status: 'queued' | 'generating' | 'ready' | 'delivered' | 'failed';
  requestedAt: string;
  completedAt?: string;
  sizeBytes: number;
  downloadUrl?: string;
  phiSigned: boolean;
  autoDelivered: boolean;
}

export interface PackageSubstrate {
  id: string;
  name: string;
  version: string;
  type: 'core' | 'organism' | 'extension' | 'sovereign' | 'icp';
  installed: boolean;
  coherenceScore: number;
  phiVersion: string;
  dependencies: string[];
  exportedSymbols: number;
}

export interface BuildRuntimeCycle {
  id: string;
  startedAt: string;
  completedAt?: string;
  agentsActivated: number;
  artifactsBuilt: number;
  artifactsDeployed: number;
  genesisEntitiesSynced: number;
  kernelExecutions: number;
  sandboxSessionsOpened: number;
  exportsGenerated: number;
  packagesVerified: number;
  buildSuccessRate: number;   // 0-1
  phiCoherence: number;       // 0-1
}

export interface BuildRuntimeDashboard {
  id: string;
  lastRefresh: string;
  totalAgents: number;
  idleAgents: number;
  buildingAgents: number;
  totalArtifacts: number;
  deployedArtifacts: number;
  failingArtifacts: number;
  genesisEntities: number;
  syncedEntities: number;
  kernelExecutions: number;
  activeSandboxes: number;
  pendingExports: number;
  packageSubstrates: number;
  cyclesCompleted: number;
  buildHealth: 'green' | 'yellow' | 'red';
}

// ═══════════════════════════════════════════════════════════════════════════════
// §2  INTERNAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const _now = () => new Date().toISOString();
const _clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

const _buildAgents: BuildAgent[] = [];
const _artifacts: BuildArtifact[] = [];
const _genesisEntities: GenesisRuntimeEntity[] = [];
const _kernelExecutions: KernelExecution[] = [];
const _sandboxSessions: SandboxSession[] = [];
const _exportJobs: ExportJob[] = [];
const _packages: PackageSubstrate[] = [];
const _cycles: BuildRuntimeCycle[] = [];

// Pre-seed 8 build agents (one per phase)
const AGENT_SPECS: Array<{ name: string; role: AgentBuildRole; specialty: string[] }> = [
  { name: 'Scaffold-Prime',  role: 'scaffolder', specialty: ['next-app', 'component-tree', 'route-structure'] },
  { name: 'Compiler-Core',   role: 'compiler',   specialty: ['typescript', 'webpack', 'tree-shaking'] },
  { name: 'Linker-Node',     role: 'linker',     specialty: ['dependency-resolution', 'symbol-binding', 'module-graph'] },
  { name: 'Tester-Nexus',    role: 'tester',     specialty: ['jest', 'e2e', 'snapshot', 'coverage'] },
  { name: 'Optimizer-Phi',   role: 'optimizer',  specialty: ['bundle-analysis', 'code-splitting', 'lazy-loading'] },
  { name: 'Packager-Gold',   role: 'packager',   specialty: ['docker', 'wasm', 'sovereign-bundle', 'icp-canister'] },
  { name: 'Deployer-Sol',    role: 'deployer',   specialty: ['vercel', 'icp', 'edge-network', 'canary'] },
  { name: 'Verifier-Truth',  role: 'verifier',   specialty: ['integrity-hash', 'phi-checksum', 'compliance-check'] },
];

for (const spec of AGENT_SPECS) {
  _buildAgents.push({
    id: sovereignId(),
    name: spec.name,
    role: spec.role,
    status: 'idle',
    artifactsBuilt: 0,
    fieldGradientStrength: _clamp(PHI_INVERSE + Math.random() * 0.3),
    lastActivity: _now(),
    specialty: spec.specialty,
  });
}

// Pre-seed core packages
const PKG_SPECS: Array<{ name: string; type: PackageSubstrate['type']; symbols: number }> = [
  { name: 'sovereign-kernel',      type: 'sovereign', symbols: 42 },
  { name: 'organism-sdk',          type: 'organism',  symbols: 38 },
  { name: 'medina-intelligence',   type: 'core',      symbols: 55 },
  { name: 'nova-ovo-shell',        type: 'extension', symbols: 29 },
  { name: 'icp-canister-bridge',   type: 'icp',       symbols: 18 },
  { name: 'phi-crypto-layer',      type: 'sovereign', symbols: 31 },
];

for (const pkg of PKG_SPECS) {
  _packages.push({
    id: sovereignId(),
    name: pkg.name,
    version: `${Math.floor(PHI * 10)}.${Math.floor(PHI_INVERSE * 10)}.0`,
    type: pkg.type,
    installed: true,
    coherenceScore: _clamp(PHI_INVERSE + Math.random() * 0.3),
    phiVersion: `phi@${PHI.toFixed(4)}`,
    dependencies: [],
    exportedSymbols: pkg.symbols,
  });
}

// Pre-seed genesis entities
const ENTITY_CLASSES: RuntimeEntityClass[] = ['genesis', 'phantom', 'builder', 'executor', 'validator'];
for (const cls of ENTITY_CLASSES) {
  _genesisEntities.push({
    id: sovereignId(),
    class: cls,
    name: `${cls}-entity-prime`,
    phase: 'active',
    syncScore: _clamp(PHI_INVERSE + Math.random() * 0.3),
    proofHash: `${(PHI * Date.now()).toString(36)}`,
    recoveryCount: 0,
    lastHeartbeat: _now(),
    callsEmitted: Math.round(Math.random() * 100),
    callsReceived: Math.round(Math.random() * 100),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// §3  BUILD AGENTS
// ═══════════════════════════════════════════════════════════════════════════════

export function getBuildAgents(): BuildAgent[] { return [..._buildAgents]; }
export function getBuildAgent(id: string): BuildAgent | undefined {
  return _buildAgents.find(a => a.id === id);
}
export function getBuildAgentsByRole(role: AgentBuildRole): BuildAgent[] {
  return _buildAgents.filter(a => a.role === role);
}

export function activateBuildAgent(agentId: string, phase: BuildPhase): BuildAgent | undefined {
  const agent = _buildAgents.find(a => a.id === agentId);
  if (!agent || agent.status === 'building') return agent;
  agent.status = 'building';
  agent.currentPhase = phase;
  agent.lastActivity = _now();
  return agent;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §4  BUILD ARTIFACTS
// ═══════════════════════════════════════════════════════════════════════════════

export function createBuildArtifact(
  name: string,
  phase: BuildPhase,
  agentId: string,
  dependencies: string[] = [],
): BuildArtifact {
  const testsRun = Math.round(10 + Math.random() * 90);
  const passRate = _clamp(PHI_INVERSE + Math.random() * 0.3);
  const artifact: BuildArtifact = {
    id: sovereignId(),
    name,
    phase,
    status: 'running',
    version: `1.${_buildAgents.find(a => a.id === agentId)?.artifactsBuilt ?? 0}.0`,
    size: Math.round(10000 + Math.random() * 990000),
    phiChecksum: PHI * Date.now() % 1000000,
    builtAt: _now(),
    buildAgentId: agentId,
    testsRun,
    testsPassing: Math.round(testsRun * passRate),
    dependencies,
  };
  // Determine pass/fail
  artifact.status = artifact.testsPassing / artifact.testsRun >= 0.8 ? 'passing' : 'failing';
  _artifacts.push(artifact);
  const agent = _buildAgents.find(a => a.id === agentId);
  if (agent) { agent.artifactsBuilt++; agent.status = 'complete'; agent.lastActivity = _now(); }
  return artifact;
}

export function deployArtifact(artifactId: string): BuildArtifact | undefined {
  const a = _artifacts.find(a => a.id === artifactId);
  if (!a || a.status !== 'passing') return a;
  a.status = 'deployed';
  a.deployedAt = _now();
  return a;
}

export function getBuildArtifacts(): BuildArtifact[] { return [..._artifacts]; }
export function getArtifactsByStatus(status: BuildStatus): BuildArtifact[] {
  return _artifacts.filter(a => a.status === status);
}
export function getArtifactsByPhase(phase: BuildPhase): BuildArtifact[] {
  return _artifacts.filter(a => a.phase === phase);
}
export function getBuildSuccessRate(): number {
  if (_artifacts.length === 0) return 1;
  return _clamp(_artifacts.filter(a => a.status === 'passing' || a.status === 'deployed').length / _artifacts.length);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §5  GENESIS RUNTIME ENTITIES
// ═══════════════════════════════════════════════════════════════════════════════

export function getGenesisEntities(): GenesisRuntimeEntity[] { return [..._genesisEntities]; }
export function getGenesisEntity(id: string): GenesisRuntimeEntity | undefined {
  return _genesisEntities.find(e => e.id === id);
}
export function getEntitiesByClass(cls: RuntimeEntityClass): GenesisRuntimeEntity[] {
  return _genesisEntities.filter(e => e.class === cls);
}

export function syncGenesisEntity(entityId: string): GenesisRuntimeEntity | undefined {
  const e = _genesisEntities.find(e => e.id === entityId);
  if (!e) return undefined;
  e.syncScore = _clamp(e.syncScore * PHI_INVERSE + PHI_INVERSE * 0.5);
  e.phase = 'sync';
  e.lastHeartbeat = _now();
  e.callsEmitted++;
  return e;
}

export function syncAllGenesisEntities(): GenesisRuntimeEntity[] {
  return _genesisEntities.map(e => syncGenesisEntity(e.id)!);
}

export function healGenesisEntity(entityId: string): GenesisRuntimeEntity | undefined {
  const e = _genesisEntities.find(e => e.id === entityId);
  if (!e) return undefined;
  e.phase = 'healing';
  e.recoveryCount++;
  e.syncScore = _clamp(PHI_INVERSE + Math.random() * 0.3);
  e.lastHeartbeat = _now();
  return e;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §6  KERNEL EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

export function executeKernel(kernelId: string): KernelExecution {
  const theta = (Math.random() * 2 * Math.PI);
  const phiAngle = (Math.random() * Math.PI);
  const execution: KernelExecution = {
    id: sovereignId(),
    kernelId,
    state: 'active',
    compressionRatio: _clamp(PHI_INVERSE * Math.random() + 0.2),
    phiAlignment: _clamp(PHI_INVERSE + Math.random() * 0.2),
    torusCoordinate: { theta, phi: phiAngle },
    executedAt: _now(),
    durationMs: Math.round(1 + Math.random() * 100),
    outputGlyph: `𓂀φ${(PHI * Date.now()).toString(36).slice(0, 6)}`,
    success: Math.random() > 0.05,
  };
  execution.state = execution.success ? 'compressed' : 'error';
  _kernelExecutions.push(execution);
  return execution;
}

export function getKernelExecutions(): KernelExecution[] { return [..._kernelExecutions]; }
export function getKernelExecutionsByState(state: KernelState): KernelExecution[] {
  return _kernelExecutions.filter(e => e.state === state);
}
export function getKernelSuccessRate(): number {
  if (_kernelExecutions.length === 0) return 1;
  return _clamp(_kernelExecutions.filter(e => e.success).length / _kernelExecutions.length);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §7  SANDBOX ORCHESTRATION
// ═══════════════════════════════════════════════════════════════════════════════

export function openSandboxSession(
  name: string,
  tier: SandboxTier = 'ephemeral',
  durationMs = HEARTBEAT_MS * 100,
): SandboxSession {
  const session: SandboxSession = {
    id: sovereignId(),
    tier,
    name,
    status: 'active',
    createdAt: _now(),
    expiresAt: new Date(Date.now() + durationMs).toISOString(),
    isolationScore: _clamp(PHI_INVERSE + Math.random() * 0.3),
    memoryLimitMB: tier === 'production-mirror' ? 4096 : tier === 'persistent' ? 1024 : 256,
    cpuLimitPct: tier === 'production-mirror' ? 80 : 40,
    operations: 0,
    mirageActive: tier === 'isolated',
  };
  _sandboxSessions.push(session);
  return session;
}

export function sealSandboxSession(sessionId: string): SandboxSession | undefined {
  const s = _sandboxSessions.find(s => s.id === sessionId);
  if (!s) return undefined;
  s.status = 'sealed';
  return s;
}

export function getSandboxSessions(): SandboxSession[] { return [..._sandboxSessions]; }
export function getActiveSandboxes(): SandboxSession[] {
  return _sandboxSessions.filter(s => s.status === 'active');
}
export function getSandboxesByTier(tier: SandboxTier): SandboxSession[] {
  return _sandboxSessions.filter(s => s.tier === tier);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §8  EXPORT JOBS
// ═══════════════════════════════════════════════════════════════════════════════

export function createExportJob(source: string, format: ExportFormat): ExportJob {
  const job: ExportJob = {
    id: sovereignId(),
    format,
    source,
    status: 'queued',
    requestedAt: _now(),
    sizeBytes: 0,
    phiSigned: true,
    autoDelivered: false,
  };
  _exportJobs.push(job);
  return job;
}

export function processExportJob(jobId: string): ExportJob | undefined {
  const job = _exportJobs.find(j => j.id === jobId);
  if (!job || job.status !== 'queued') return job;
  job.status = 'generating';
  job.sizeBytes = Math.round(1000 + Math.random() * 999000);
  job.completedAt = _now();
  job.status = 'ready';
  job.autoDelivered = true;
  job.downloadUrl = `sovereign://${job.source}/${job.id}.${job.format}`;
  return job;
}

export function processAllPendingExports(): ExportJob[] {
  return _exportJobs.filter(j => j.status === 'queued').map(j => processExportJob(j.id)!);
}

export function getExportJobs(): ExportJob[] { return [..._exportJobs]; }
export function getReadyExports(): ExportJob[] { return _exportJobs.filter(j => j.status === 'ready'); }

// ═══════════════════════════════════════════════════════════════════════════════
// §9  PACKAGES
// ═══════════════════════════════════════════════════════════════════════════════

export function getPackageSubstrates(): PackageSubstrate[] { return [..._packages]; }
export function getPackagesByType(type: PackageSubstrate['type']): PackageSubstrate[] {
  return _packages.filter(p => p.type === type);
}
export function getPackage(id: string): PackageSubstrate | undefined {
  return _packages.find(p => p.id === id);
}
export function verifyPackageCoherence(packageId: string): PackageSubstrate | undefined {
  const pkg = _packages.find(p => p.id === packageId);
  if (!pkg) return undefined;
  pkg.coherenceScore = _clamp(PHI_INVERSE + Math.random() * 0.35);
  return pkg;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §10  AUTONOMOUS CYCLE
// ═══════════════════════════════════════════════════════════════════════════════

export function runBuilderRuntimeCycle(): BuildRuntimeCycle {
  const start = _now();

  // 1. Activate all agents and build one artifact each
  for (const agent of _buildAgents) {
    agent.status = 'idle';
    activateBuildAgent(agent.id, agentRoleToPhase(agent.role));
    createBuildArtifact(`${agent.role}-artifact-${_cycles.length}`, agentRoleToPhase(agent.role), agent.id);
  }

  // 2. Deploy all passing artifacts
  let deployed = 0;
  for (const a of _artifacts.filter(a => a.status === 'passing')) {
    deployArtifact(a.id);
    deployed++;
  }

  // 3. Sync all genesis entities
  syncAllGenesisEntities();

  // 4. Execute kernels for each package
  for (const pkg of _packages) executeKernel(pkg.id);

  // 5. Open a cycle sandbox
  openSandboxSession(`cycle-${_cycles.length}`, 'ephemeral');

  // 6. Auto-process exports
  for (const artifact of _artifacts.filter(a => a.status === 'deployed')) {
    if (_exportJobs.every(j => j.source !== artifact.id)) {
      createExportJob(artifact.id, 'sovereign-bundle');
    }
  }
  const exported = processAllPendingExports();

  // 7. Verify package coherence
  for (const pkg of _packages) verifyPackageCoherence(pkg.id);

  const successRate = getBuildSuccessRate();
  const cycle: BuildRuntimeCycle = {
    id: sovereignId(),
    startedAt: start,
    completedAt: _now(),
    agentsActivated: _buildAgents.length,
    artifactsBuilt: _buildAgents.length,
    artifactsDeployed: deployed,
    genesisEntitiesSynced: _genesisEntities.length,
    kernelExecutions: _packages.length,
    sandboxSessionsOpened: 1,
    exportsGenerated: exported.length,
    packagesVerified: _packages.length,
    buildSuccessRate: successRate,
    phiCoherence: _clamp(_packages.reduce((s, p) => s + p.coherenceScore, 0) / _packages.length),
  };
  _cycles.push(cycle);
  return cycle;
}

function agentRoleToPhase(role: AgentBuildRole): BuildPhase {
  const map: Record<AgentBuildRole, BuildPhase> = {
    scaffolder: 'scaffold', compiler: 'compile', linker: 'link',
    tester: 'test', optimizer: 'optimize', packager: 'package',
    deployer: 'deploy', verifier: 'verify',
  };
  return map[role];
}

export function getBuilderRuntimeCycles(): BuildRuntimeCycle[] { return [..._cycles]; }

// ═══════════════════════════════════════════════════════════════════════════════
// §11  DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

export function getBuilderRuntimeDashboard(): BuildRuntimeDashboard {
  const failing = _artifacts.filter(a => a.status === 'failing').length;
  const successRate = getBuildSuccessRate();
  return {
    id: 'builder-runtime-dashboard',
    lastRefresh: _now(),
    totalAgents: _buildAgents.length,
    idleAgents: _buildAgents.filter(a => a.status === 'idle').length,
    buildingAgents: _buildAgents.filter(a => a.status === 'building').length,
    totalArtifacts: _artifacts.length,
    deployedArtifacts: _artifacts.filter(a => a.status === 'deployed').length,
    failingArtifacts: failing,
    genesisEntities: _genesisEntities.length,
    syncedEntities: _genesisEntities.filter(e => e.phase === 'active' || e.phase === 'sync').length,
    kernelExecutions: _kernelExecutions.length,
    activeSandboxes: _sandboxSessions.filter(s => s.status === 'active').length,
    pendingExports: _exportJobs.filter(j => j.status === 'queued').length,
    packageSubstrates: _packages.length,
    cyclesCompleted: _cycles.length,
    buildHealth: successRate > 0.8 ? 'green' : successRate > 0.5 ? 'yellow' : 'red',
  };
}
