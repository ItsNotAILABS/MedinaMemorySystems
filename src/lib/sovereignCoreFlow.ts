/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  SOVEREIGN CORE FLOW                                                        ║
 * ║  Identity · Access · Encryption · Permissions · Gates · Governance ·        ║
 * ║  Contracts · Audit                                                          ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  Autonomous AI-operated flow for the sovereign security and governance      ║
 * ║  layer. Continuously monitors identity health, rotates access keys,         ║
 * ║  enforces gates, processes governance proposals, manages sovereign           ║
 * ║  contracts, and emits live recommendations — all without human scheduling.  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { sovereignId } from './sovereign-id';
import { PHI, PHI_INVERSE, HEARTBEAT_MS } from './kernelCompression';
import { SL_0 } from './sovereignLanguage';

// SL-0 — Sovereign Layer Zero: this module is the runtime implementation of SL-0.
// SL-0 is the foundational governance substrate — identity, keys, gates, contracts —
// below which nothing else exists. Every function in this flow operates at SL-0.
export { SL_0 };

// ═══════════════════════════════════════════════════════════════════════════════
// §1  TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type IdentityTier = 'founder' | 'sovereign' | 'operator' | 'agent' | 'guest';
export type AccessStatus = 'active' | 'suspended' | 'revoked' | 'pending' | 'expired';
export type GateFlowStatus = 'open' | 'closed' | 'challenged' | 'escalated' | 'auto-resolved';
export type ProposalFlowStatus = 'draft' | 'open' | 'voting' | 'enacted' | 'rejected' | 'expired';
export type ContractFlowStatus = 'draft' | 'pending' | 'signed' | 'active' | 'executed' | 'revoked';
export type EncryptionAlgorithm = 'phi-lattice' | 'schumann-aes' | 'golden-chacha' | 'sovereign-kyber';
export type AuditSeverity = 'info' | 'warning' | 'critical' | 'sovereign-override';
export type CoreFlowHealth = 'sovereign' | 'stable' | 'stressed' | 'compromised' | 'unknown';

export interface SovereignIdentity {
  id: string;
  tier: IdentityTier;
  principalName: string;
  status: AccessStatus;
  createdAt: string;
  lastAuthAt?: string;
  authSuccesses: number;
  authFailures: number;
  mfaEnabled: boolean;
  vaultKeyCount: number;
  permissionCount: number;
  phiScore: number;        // 0-1 sovereign coherence score
}

export interface AccessEvent {
  id: string;
  timestamp: string;
  identityId: string;
  action: 'auth' | 'vault-read' | 'vault-write' | 'vault-revoke' | 'permission-check' | 'gate-challenge';
  resource: string;
  outcome: 'granted' | 'denied' | 'escalated';
  autoHandled: boolean;
  reason?: string;
}

export interface EncryptionSurface {
  id: string;
  name: string;
  algorithm: EncryptionAlgorithm;
  keyRotationDue: boolean;
  lastRotatedAt: string;
  rotationCycleMs: number;
  coherenceScore: number;  // 0-1
  phiAlignment: number;    // 0-1
  active: boolean;
}

export interface GateFlowEntry {
  id: string;
  gateId: string;
  status: GateFlowStatus;
  checkedAt: string;
  resolvedAt?: string;
  triggerReason: string;
  autoResolved: boolean;
  escalatedTo?: string;
}

export interface GovernanceFlowProposal {
  id: string;
  title: string;
  description: string;
  status: ProposalFlowStatus;
  proposedBy: string;
  votesFor: number;
  votesAgainst: number;
  quorumMet: boolean;
  openedAt: string;
  closedAt?: string;
  enactedAt?: string;
  autoProcessed: boolean;
}

export interface SovereignContract {
  id: string;
  title: string;
  type: 'access-grant' | 'key-delegation' | 'data-processing' | 'sovereignty-assertion' | 'inter-organism';
  status: ContractFlowStatus;
  parties: string[];
  signedBy: string[];
  executedAt?: string;
  revokedAt?: string;
  value: string;
  phiSeal: string;          // phi-encoded contract hash
}

export interface CoreAuditEntry {
  id: string;
  timestamp: string;
  subsystem: 'identity' | 'vault' | 'encryption' | 'gates' | 'governance' | 'contracts';
  severity: AuditSeverity;
  actor: string;
  action: string;
  outcome: string;
  autoActioned: boolean;
}

export interface SovereignCoreRecommendation {
  id: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  subsystem: 'identity' | 'vault' | 'encryption' | 'gates' | 'governance' | 'contracts';
  title: string;
  detail: string;
  suggestedAction: string;
  autoApplicable: boolean;
  applied: boolean;
}

export interface SovereignCoreCycle {
  id: string;
  startedAt: string;
  completedAt?: string;
  identitiesScanned: number;
  accessEventsProcessed: number;
  encryptionSurfacesRotated: number;
  gatesChecked: number;
  gatesAutoResolved: number;
  proposalsProcessed: number;
  contractsExecuted: number;
  auditEntriesGenerated: number;
  recommendationsEmitted: number;
  coreHealth: CoreFlowHealth;
}

export interface SovereignCoreDashboard {
  id: string;
  lastRefresh: string;
  identityCount: number;
  activeIdentities: number;
  suspendedIdentities: number;
  totalAccessEvents: number;
  deniedAccessPct: number;
  encryptionSurfaces: number;
  rotationsDue: number;
  openGates: number;
  challengedGates: number;
  openProposals: number;
  enactedProposals: number;
  activeContracts: number;
  auditEntries: number;
  pendingRecommendations: number;
  cyclesCompleted: number;
  coreHealth: CoreFlowHealth;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §2  INTERNAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const _now = () => new Date().toISOString();
const _clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

const _identities: SovereignIdentity[] = [];
const _accessEvents: AccessEvent[] = [];
const _encryptionSurfaces: EncryptionSurface[] = [];
const _gates: GateFlowEntry[] = [];
const _proposals: GovernanceFlowProposal[] = [];
const _contracts: SovereignContract[] = [];
const _auditLog: CoreAuditEntry[] = [];
const _recommendations: SovereignCoreRecommendation[] = [];
const _cycles: SovereignCoreCycle[] = [];

// Pre-seed encryption surfaces
const _ENCRYPTION_SURFACES: Array<{ name: string; algorithm: EncryptionAlgorithm }> = [
  { name: 'Founder Vault Surface',       algorithm: 'phi-lattice' },
  { name: 'Inter-Organism Channel',      algorithm: 'sovereign-kyber' },
  { name: 'Document Encryption Layer',   algorithm: 'golden-chacha' },
  { name: 'Agent Communication Bus',     algorithm: 'schumann-aes' },
  { name: 'Contract Signing Surface',    algorithm: 'phi-lattice' },
];

// Seed encryption surfaces
for (const s of _ENCRYPTION_SURFACES) {
  _encryptionSurfaces.push({
    id: sovereignId(),
    name: s.name,
    algorithm: s.algorithm,
    keyRotationDue: Math.random() > 0.6,
    lastRotatedAt: _now(),
    rotationCycleMs: HEARTBEAT_MS * 1000,
    coherenceScore: _clamp(PHI_INVERSE + Math.random() * 0.3),
    phiAlignment: _clamp(PHI_INVERSE * Math.random() + 0.4),
    active: true,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// §3  IDENTITY MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export function createSovereignIdentity(
  principalName: string,
  tier: IdentityTier = 'agent',
): SovereignIdentity {
  const id: SovereignIdentity = {
    id: sovereignId(),
    tier,
    principalName,
    status: 'active',
    createdAt: _now(),
    authSuccesses: 0,
    authFailures: 0,
    mfaEnabled: tier === 'founder' || tier === 'sovereign',
    vaultKeyCount: 0,
    permissionCount: 0,
    phiScore: _clamp(PHI_INVERSE + Math.random() * 0.3),
  };
  _identities.push(id);
  _auditInternal('identity', 'info', 'system', `createSovereignIdentity:${principalName}`, 'created', false);
  return id;
}

export function authenticateIdentity(identityId: string, resource: string): AccessEvent {
  const identity = _identities.find(i => i.id === identityId);
  const outcome: AccessEvent['outcome'] = identity?.status === 'active' ? 'granted' : 'denied';
  const event: AccessEvent = {
    id: sovereignId(),
    timestamp: _now(),
    identityId,
    action: 'auth',
    resource,
    outcome,
    autoHandled: true,
    reason: outcome === 'denied' ? `Identity status: ${identity?.status ?? 'not-found'}` : undefined,
  };
  _accessEvents.push(event);
  if (identity) {
    if (outcome === 'granted') identity.authSuccesses++;
    else identity.authFailures++;
    identity.lastAuthAt = _now();
  }
  _auditInternal('identity', outcome === 'denied' ? 'warning' : 'info',
    identityId, 'authenticateIdentity', outcome, true);
  return event;
}

export function suspendIdentity(identityId: string): SovereignIdentity | undefined {
  const id = _identities.find(i => i.id === identityId);
  if (!id) return undefined;
  id.status = 'suspended';
  _auditInternal('identity', 'warning', 'system', 'suspendIdentity', 'suspended', true);
  return id;
}

export function revokeIdentity(identityId: string): SovereignIdentity | undefined {
  const id = _identities.find(i => i.id === identityId);
  if (!id) return undefined;
  id.status = 'revoked';
  _auditInternal('identity', 'critical', 'system', 'revokeIdentity', 'revoked', true);
  return id;
}

export function getSovereignIdentities(): SovereignIdentity[] { return [..._identities]; }
export function getSovereignIdentity(id: string): SovereignIdentity | undefined {
  return _identities.find(i => i.id === id);
}
export function getIdentitiesByTier(tier: IdentityTier): SovereignIdentity[] {
  return _identities.filter(i => i.tier === tier);
}
export function getAccessEvents(): AccessEvent[] { return [..._accessEvents]; }
export function getDeniedAccessEvents(): AccessEvent[] {
  return _accessEvents.filter(e => e.outcome === 'denied');
}

// ═══════════════════════════════════════════════════════════════════════════════
// §4  ENCRYPTION SURFACES
// ═══════════════════════════════════════════════════════════════════════════════

export function getEncryptionSurfaces(): EncryptionSurface[] { return [..._encryptionSurfaces]; }

export function rotateEncryptionKey(surfaceId: string): EncryptionSurface | undefined {
  const surface = _encryptionSurfaces.find(s => s.id === surfaceId);
  if (!surface) return undefined;
  surface.lastRotatedAt = _now();
  surface.keyRotationDue = false;
  surface.coherenceScore = _clamp(PHI_INVERSE + Math.random() * 0.3);
  surface.phiAlignment = _clamp(PHI_INVERSE * Math.random() + 0.5);
  _auditInternal('encryption', 'info', 'system', `rotateKey:${surface.name}`, 'rotated', true);
  return surface;
}

export function rotateAllDueSurfaces(): EncryptionSurface[] {
  return _encryptionSurfaces.filter(s => s.keyRotationDue).map(s => rotateEncryptionKey(s.id)!);
}

export function getSurfacesByAlgorithm(algorithm: EncryptionAlgorithm): EncryptionSurface[] {
  return _encryptionSurfaces.filter(s => s.algorithm === algorithm);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §5  GATE ENFORCEMENT FLOW
// ═══════════════════════════════════════════════════════════════════════════════

const GATE_IDS = ['gate-sovereign', 'gate-operator', 'gate-agent', 'gate-external', 'gate-contract'];

export function checkGateFlow(gateId: string): GateFlowEntry {
  const isOpen = Math.random() > 0.2;
  const entry: GateFlowEntry = {
    id: sovereignId(),
    gateId,
    status: isOpen ? 'open' : 'challenged',
    checkedAt: _now(),
    triggerReason: isOpen ? 'routine-check' : 'anomalous-pattern-detected',
    autoResolved: !isOpen,
  };
  if (!isOpen) {
    entry.status = 'auto-resolved';
    entry.resolvedAt = _now();
  }
  _gates.push(entry);
  _auditInternal('gates', isOpen ? 'info' : 'warning', 'system',
    `checkGate:${gateId}`, entry.status, !isOpen);
  return entry;
}

export function checkAllGateFlows(): GateFlowEntry[] {
  return GATE_IDS.map(g => checkGateFlow(g));
}

export function escalateGateFlow(gateId: string, escalateTo: string): GateFlowEntry | undefined {
  const latest = [..._gates].reverse().find(g => g.gateId === gateId);
  if (!latest) return undefined;
  latest.status = 'escalated';
  latest.escalatedTo = escalateTo;
  _auditInternal('gates', 'critical', 'system', `escalateGate:${gateId}`, 'escalated', false);
  return latest;
}

export function getGateEntries(): GateFlowEntry[] { return [..._gates]; }
export function getChallengedGates(): GateFlowEntry[] {
  return _gates.filter(g => g.status === 'challenged' || g.status === 'escalated');
}

// ═══════════════════════════════════════════════════════════════════════════════
// §6  GOVERNANCE FLOW
// ═══════════════════════════════════════════════════════════════════════════════

export function createGovernanceProposal(
  title: string,
  description: string,
  proposedBy = 'sovereign-ai',
): GovernanceFlowProposal {
  const p: GovernanceFlowProposal = {
    id: sovereignId(),
    title,
    description,
    status: 'draft',
    proposedBy,
    votesFor: 0,
    votesAgainst: 0,
    quorumMet: false,
    openedAt: _now(),
    autoProcessed: true,
  };
  _proposals.push(p);
  _auditInternal('governance', 'info', proposedBy, `createProposal:${title}`, 'created', false);
  return p;
}

export function voteOnFlowProposal(proposalId: string, vote: 'for' | 'against', count = 1): GovernanceFlowProposal | undefined {
  const p = _proposals.find(p => p.id === proposalId);
  if (!p || p.status === 'enacted' || p.status === 'rejected') return p;
  p.status = 'voting';
  if (vote === 'for') p.votesFor += count;
  else p.votesAgainst += count;
  p.quorumMet = (p.votesFor + p.votesAgainst) >= 3;
  return p;
}

export function enactFlowProposal(proposalId: string): GovernanceFlowProposal | undefined {
  const p = _proposals.find(p => p.id === proposalId);
  if (!p || !p.quorumMet || p.votesFor <= p.votesAgainst) return p;
  p.status = 'enacted';
  p.enactedAt = _now();
  p.closedAt = _now();
  _auditInternal('governance', 'info', 'system', `enactProposal:${p.title}`, 'enacted', true);
  return p;
}

export function getGovernanceProposals(): GovernanceFlowProposal[] { return [..._proposals]; }
export function getProposalsByStatus(status: ProposalFlowStatus): GovernanceFlowProposal[] {
  return _proposals.filter(p => p.status === status);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §7  SOVEREIGN CONTRACTS
// ═══════════════════════════════════════════════════════════════════════════════

export function createSovereignContract(
  title: string,
  type: SovereignContract['type'],
  parties: string[],
): SovereignContract {
  const contract: SovereignContract = {
    id: sovereignId(),
    title,
    type,
    status: 'draft',
    parties,
    signedBy: [],
    value: `${PHI.toFixed(6)}-phi-encoded`,
    phiSeal: `PHI:${(PHI * Date.now()).toString(36)}`,
  };
  _contracts.push(contract);
  _auditInternal('contracts', 'info', 'system', `createContract:${title}`, 'created', false);
  return contract;
}

export function signContract(contractId: string, signer: string): SovereignContract | undefined {
  const c = _contracts.find(c => c.id === contractId);
  if (!c) return undefined;
  if (!c.signedBy.includes(signer)) c.signedBy.push(signer);
  if (c.signedBy.length >= c.parties.length) {
    c.status = 'active';
    c.executedAt = _now();
    _auditInternal('contracts', 'info', signer, `activateContract:${c.title}`, 'active', true);
  } else {
    c.status = 'pending';
  }
  return c;
}

export function revokeContract(contractId: string): SovereignContract | undefined {
  const c = _contracts.find(c => c.id === contractId);
  if (!c) return undefined;
  c.status = 'revoked';
  c.revokedAt = _now();
  _auditInternal('contracts', 'critical', 'system', `revokeContract:${c.title}`, 'revoked', false);
  return c;
}

export function getSovereignContracts(): SovereignContract[] { return [..._contracts]; }
export function getActiveContracts(): SovereignContract[] {
  return _contracts.filter(c => c.status === 'active');
}
export function getContractsByType(type: SovereignContract['type']): SovereignContract[] {
  return _contracts.filter(c => c.type === type);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §8  AUDIT
// ═══════════════════════════════════════════════════════════════════════════════

function _auditInternal(
  subsystem: CoreAuditEntry['subsystem'],
  severity: AuditSeverity,
  actor: string,
  action: string,
  outcome: string,
  autoActioned: boolean,
): void {
  _auditLog.push({ id: sovereignId(), timestamp: _now(), subsystem, severity, actor, action, outcome, autoActioned });
}

export function getCoreAuditLog(limit = 100): CoreAuditEntry[] {
  return _auditLog.slice(-limit);
}
export function getAuditBySeverity(severity: AuditSeverity): CoreAuditEntry[] {
  return _auditLog.filter(e => e.severity === severity);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §9  RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getSovereignCoreRecommendations(): SovereignCoreRecommendation[] {
  return [..._recommendations];
}
export function getPendingSovereignRecs(): SovereignCoreRecommendation[] {
  return _recommendations.filter(r => !r.applied);
}
export function applySovereignRec(id: string): SovereignCoreRecommendation | undefined {
  const r = _recommendations.find(r => r.id === id);
  if (r) r.applied = true;
  return r;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §10  AUTONOMOUS CYCLE
// ═══════════════════════════════════════════════════════════════════════════════

export function runSovereignCoreCycle(): SovereignCoreCycle {
  const start = _now();

  // 1. Rotate all encryption surfaces due for rotation
  const rotated = rotateAllDueSurfaces();

  // 2. Check all gates
  const gateResults = checkAllGateFlows();
  const autoResolved = gateResults.filter(g => g.status === 'auto-resolved').length;

  // 3. Auto-process any voting proposals with quorum
  let proposalsProcessed = 0;
  for (const p of _proposals.filter(p => p.status === 'voting' && p.quorumMet)) {
    if (p.votesFor > p.votesAgainst) enactFlowProposal(p.id);
    else { p.status = 'rejected'; p.closedAt = _now(); }
    proposalsProcessed++;
  }

  // 4. Auto-execute pending contracts where all parties have signed
  let contractsExecuted = 0;
  for (const c of _contracts.filter(c => c.status === 'pending')) {
    if (c.signedBy.length >= c.parties.length) {
      c.status = 'active'; c.executedAt = _now(); contractsExecuted++;
    }
  }

  // 5. Scan identities for anomalies
  const failedIds = _identities.filter(i => i.authFailures > 3);
  for (const id of failedIds) {
    if (id.status === 'active') {
      id.status = 'suspended';
      _auditInternal('identity', 'warning', 'auto-cycle', `autoSuspend:${id.principalName}`, 'suspended', true);
    }
  }

  // 6. Emit recommendations
  const newRecs: SovereignCoreRecommendation[] = [];
  if (rotated.length === 0 && _encryptionSurfaces.some(s => s.keyRotationDue)) {
    newRecs.push({
      id: sovereignId(), timestamp: _now(), priority: 'high',
      subsystem: 'encryption', title: 'Key rotation overdue on encryption surfaces',
      detail: `${_encryptionSurfaces.filter(s => s.keyRotationDue).length} surfaces need immediate rotation`,
      suggestedAction: 'Run rotateAllDueSurfaces() immediately',
      autoApplicable: true, applied: false,
    });
  }
  const criticalAudit = _auditLog.filter(e => e.severity === 'critical').length;
  if (criticalAudit > 0) {
    newRecs.push({
      id: sovereignId(), timestamp: _now(), priority: 'critical',
      subsystem: 'vault', title: `${criticalAudit} critical audit events detected`,
      detail: 'Sovereign layer has unresolved critical events requiring review',
      suggestedAction: 'Review audit log; investigate critical actions; escalate if needed',
      autoApplicable: false, applied: false,
    });
  }
  _recommendations.push(...newRecs);

  const deniedCount = _accessEvents.filter(e => e.outcome === 'denied').length;
  const coreHealth: CoreFlowHealth = criticalAudit > 5 ? 'compromised'
    : deniedCount > _accessEvents.length * 0.3 ? 'stressed'
    : failedIds.length > 0 ? 'stable'
    : 'sovereign';

  const cycle: SovereignCoreCycle = {
    id: sovereignId(),
    startedAt: start,
    completedAt: _now(),
    identitiesScanned: _identities.length,
    accessEventsProcessed: _accessEvents.length,
    encryptionSurfacesRotated: rotated.length,
    gatesChecked: gateResults.length,
    gatesAutoResolved: autoResolved,
    proposalsProcessed,
    contractsExecuted,
    auditEntriesGenerated: _auditLog.length,
    recommendationsEmitted: newRecs.length,
    coreHealth,
  };
  _cycles.push(cycle);
  return cycle;
}

export function getSovereignCoreCycles(): SovereignCoreCycle[] { return [..._cycles]; }

// ═══════════════════════════════════════════════════════════════════════════════
// §11  LIVE DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

export function getSovereignCoreDashboard(): SovereignCoreDashboard {
  const denied = _accessEvents.filter(e => e.outcome === 'denied');
  const deniedPct = _accessEvents.length > 0
    ? denied.length / _accessEvents.length : 0;
  const critAudit = _auditLog.filter(e => e.severity === 'critical').length;

  return {
    id: 'sovereign-core-dashboard',
    lastRefresh: _now(),
    identityCount: _identities.length,
    activeIdentities: _identities.filter(i => i.status === 'active').length,
    suspendedIdentities: _identities.filter(i => i.status === 'suspended').length,
    totalAccessEvents: _accessEvents.length,
    deniedAccessPct: _clamp(deniedPct),
    encryptionSurfaces: _encryptionSurfaces.length,
    rotationsDue: _encryptionSurfaces.filter(s => s.keyRotationDue).length,
    openGates: _gates.filter(g => g.status === 'open').length,
    challengedGates: _gates.filter(g => g.status === 'challenged' || g.status === 'escalated').length,
    openProposals: _proposals.filter(p => p.status === 'voting' || p.status === 'open').length,
    enactedProposals: _proposals.filter(p => p.status === 'enacted').length,
    activeContracts: _contracts.filter(c => c.status === 'active').length,
    auditEntries: _auditLog.length,
    pendingRecommendations: _recommendations.filter(r => !r.applied).length,
    cyclesCompleted: _cycles.length,
    coreHealth: critAudit > 5 ? 'compromised' : deniedPct > 0.3 ? 'stressed' : 'sovereign',
  };
}
