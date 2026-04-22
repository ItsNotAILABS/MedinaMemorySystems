/**
 * @medina/governance-protocol
 * Complete Governance & Access Control System Package
 *
 * Combines: governanceEngine + gateEnforcement + permissionsManager +
 *           replayEngine + Governance.mo + LawEngine.mo
 *
 * Provides:
 * - Proposal lifecycle (draft → open → approved → enacted → archived)
 * - Three-gate system (A=Governance, B=Memory, C=Sovereign)
 * - Role-based permissions (Public/Operator/Sovereign)
 * - Voting with doctrine-weighted φ
 * - Full audit trail & replay
 * - Session recording & export
 *
 * Backend Endpoints (Medina.mo):
 *   kybernesis_proponere  → Submit proposal
 *   kybernesis_approbare  → Approve proposal
 *   kybernesis_status     → Query status
 *
 * Terminal: /gov — TERMINALE GUBERNATIONIS
 *
 * Callable Functions (6):
 *  18. PROPOSITIO SUBMITTENDA    — submitProposal
 *  19. SUFFRAGIUM FERENDUM       — voteOnProposal
 *  20. PROPOSITIO APPROBATA      — approveProposal
 *  21. PROPOSITIO REIECTA        — rejectProposal
 *  22. EXSECUTIO PROPOSITIONIS   — executeProposal
 *  23. STATUS GUBERNATIONIS      — governanceStatus
 */

import { v4 as uuidv4 } from 'uuid';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — GOVERNANCE
// ═══════════════════════════════════════════════════════════════════════════

export type ProposalStatus = 'draft' | 'open' | 'approved' | 'rejected' | 'enacted' | 'archived';
export type GateStatus = 'green' | 'amber' | 'red';
export type GateId = 'A' | 'B' | 'C';

export interface Gate {
  id: GateId;
  name: string;
  status: GateStatus;
  description: string;
  lastChecked: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  status: ProposalStatus;
  votes: { for: number; against: number; abstain: number };
  createdAt: string;
  updatedAt: string;
  enactedAt?: string;
  doctrineRef?: string;
  affectedGates: GateId[];
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
  proposalId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — PERMISSIONS
// ═══════════════════════════════════════════════════════════════════════════

export type PermissionScope =
  | 'memory:read' | 'memory:write' | 'memory:delete'
  | 'governance:read' | 'governance:propose' | 'governance:vote' | 'governance:enact'
  | 'model:invoke' | 'model:configure'
  | 'company:read' | 'company:write'
  | 'replay:read' | 'permissions:manage'
  | 'organism:read' | 'organism:write'
  | 'device:register' | 'device:contract';

export type PermissionRole = 'public' | 'operator' | 'sovereign';

export interface Permission {
  id: string;
  scope: PermissionScope;
  grantedTo: string;
  grantedBy: string;
  role: PermissionRole;
  grantedAt: string;
  expiresAt?: string;
  active: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — REPLAY
// ═══════════════════════════════════════════════════════════════════════════

export interface ReplayEvent {
  id: string;
  sequenceId: number;
  type: string;
  action: string;
  payload: unknown;
  outcome: 'success' | 'failure' | 'partial';
  timestamp: string;
  actor: string;
  duration: number;
}

export interface ReplaySession {
  id: string;
  name: string;
  startTime: string;
  endTime?: string;
  events: ReplayEvent[];
  status: 'recording' | 'paused' | 'complete';
}

// ═══════════════════════════════════════════════════════════════════════════
// GATE ENFORCEMENT
// ═══════════════════════════════════════════════════════════════════════════

const gates: Map<GateId, Gate> = new Map([
  ['A', { id: 'A', name: 'Governance Gate', status: 'green', description: 'Primary enactment gate', lastChecked: new Date().toISOString() }],
  ['B', { id: 'B', name: 'Memory Gate', status: 'green', description: 'Memory write/delete authorization', lastChecked: new Date().toISOString() }],
  ['C', { id: 'C', name: 'Sovereign Gate', status: 'amber', description: 'Organism sovereignty & broadcast', lastChecked: new Date().toISOString() }],
]);

/** Get all gates */
export function getGates(): Gate[] {
  return Array.from(gates.values());
}

/** Check a specific gate */
export function checkGate(gateId: GateId): Gate | undefined {
  return gates.get(gateId);
}

/** Set gate status */
export function setGateStatus(gateId: GateId, status: GateStatus): boolean {
  const gate = gates.get(gateId);
  if (!gate) return false;
  gate.status = status;
  gate.lastChecked = new Date().toISOString();
  return true;
}

/** Check all gates pass */
export function checkAllGates(): { allPass: boolean; gates: Gate[] } {
  const all = Array.from(gates.values());
  return { allPass: all.every(g => g.status === 'green'), gates: all };
}

/** Enforce gate (block if red) */
export function enforceGate(gateId: GateId): { allowed: boolean; gate: Gate | undefined } {
  const gate = gates.get(gateId);
  if (!gate) return { allowed: false, gate: undefined };
  return { allowed: gate.status !== 'red', gate };
}

// ═══════════════════════════════════════════════════════════════════════════
// PROPOSAL ENGINE
// ═══════════════════════════════════════════════════════════════════════════

const proposals: Map<string, Proposal> = new Map();
const auditLog: AuditEntry[] = [];

function audit(action: string, actor: string, details: string, proposalId?: string): AuditEntry {
  const entry: AuditEntry = { id: uuidv4(), action, actor, timestamp: new Date().toISOString(), details, proposalId };
  auditLog.push(entry);
  return entry;
}

/** Submit a new proposal */
export function submitProposal(title: string, description: string, author: string, affectedGates: GateId[] = []): Proposal {
  const proposal: Proposal = {
    id: uuidv4(), title, description, author, status: 'open',
    votes: { for: 0, against: 0, abstain: 0 },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    affectedGates, auditLog: [],
  };
  proposals.set(proposal.id, proposal);
  const entry = audit('submitProposal', author, `Submitted: ${title}`, proposal.id);
  proposal.auditLog.push(entry);
  return proposal;
}

/** Vote on a proposal (φ-weighted) */
export function voteOnProposal(proposalId: string, vote: 'for' | 'against' | 'abstain', weight = 1): boolean {
  const p = proposals.get(proposalId);
  if (!p || p.status !== 'open') return false;
  const phiWeight = weight * PHI;
  p.votes[vote] += phiWeight;
  p.updatedAt = new Date().toISOString();
  audit('vote', 'voter', `Vote: ${vote} (weight: ${phiWeight.toFixed(3)})`, proposalId);
  return true;
}

/** Approve a proposal */
export function approveProposal(proposalId: string): boolean {
  const p = proposals.get(proposalId);
  if (!p || p.status !== 'open') return false;
  p.status = 'approved';
  p.updatedAt = new Date().toISOString();
  audit('approve', 'governance', 'Proposal approved', proposalId);
  return true;
}

/** Reject a proposal */
export function rejectProposal(proposalId: string): boolean {
  const p = proposals.get(proposalId);
  if (!p || p.status !== 'open') return false;
  p.status = 'rejected';
  p.updatedAt = new Date().toISOString();
  audit('reject', 'governance', 'Proposal rejected', proposalId);
  return true;
}

/** Execute/enact a proposal */
export function executeProposal(proposalId: string): boolean {
  const p = proposals.get(proposalId);
  if (!p || p.status !== 'approved') return false;
  p.status = 'enacted';
  p.enactedAt = new Date().toISOString();
  p.updatedAt = p.enactedAt;
  audit('execute', 'governance', 'Proposal enacted', proposalId);
  return true;
}

/** Get governance status */
export function governanceStatus(): {
  totalProposals: number;
  statusCounts: Record<string, number>;
  gates: Gate[];
  auditCount: number;
} {
  const counts: Record<string, number> = {};
  for (const p of proposals.values()) {
    counts[p.status] = (counts[p.status] ?? 0) + 1;
  }
  return { totalProposals: proposals.size, statusCounts: counts, gates: getGates(), auditCount: auditLog.length };
}

/** List all proposals */
export function listProposals(status?: ProposalStatus): Proposal[] {
  const all = Array.from(proposals.values());
  return status ? all.filter(p => p.status === status) : all;
}

// ═══════════════════════════════════════════════════════════════════════════
// PERMISSIONS
// ═══════════════════════════════════════════════════════════════════════════

const permissions: Map<string, Permission> = new Map();

/** Grant a permission */
export function grantPermission(scope: PermissionScope, grantedTo: string, role: PermissionRole, grantedBy = 'sovereign'): Permission {
  const perm: Permission = {
    id: uuidv4(), scope, grantedTo, grantedBy, role,
    grantedAt: new Date().toISOString(), active: true,
  };
  permissions.set(perm.id, perm);
  return perm;
}

/** Check permission */
export function checkPermission(grantedTo: string, scope: PermissionScope): boolean {
  return Array.from(permissions.values()).some(p => p.grantedTo === grantedTo && p.scope === scope && p.active);
}

/** Revoke permission */
export function revokePermission(permissionId: string): boolean {
  const perm = permissions.get(permissionId);
  if (!perm) return false;
  perm.active = false;
  return true;
}

/** List permissions */
export function listPermissions(grantedTo?: string): Permission[] {
  const all = Array.from(permissions.values());
  return grantedTo ? all.filter(p => p.grantedTo === grantedTo) : all;
}

// ═══════════════════════════════════════════════════════════════════════════
// REPLAY ENGINE
// ═══════════════════════════════════════════════════════════════════════════

const sessions: Map<string, ReplaySession> = new Map();

/** Start a replay session */
export function startReplaySession(name: string): ReplaySession {
  const session: ReplaySession = {
    id: uuidv4(), name, startTime: new Date().toISOString(),
    events: [], status: 'recording',
  };
  sessions.set(session.id, session);
  return session;
}

/** Record an event */
export function recordEvent(sessionId: string, type: string, action: string, payload: unknown, actor: string): ReplayEvent | undefined {
  const session = sessions.get(sessionId);
  if (!session || session.status !== 'recording') return undefined;
  const event: ReplayEvent = {
    id: uuidv4(), sequenceId: session.events.length + 1,
    type, action, payload, outcome: 'success',
    timestamp: new Date().toISOString(), actor, duration: 0,
  };
  session.events.push(event);
  return event;
}

/** Complete a session */
export function completeReplaySession(sessionId: string): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;
  session.status = 'complete';
  session.endTime = new Date().toISOString();
  return true;
}

/** List sessions */
export function listReplaySessions(): ReplaySession[] {
  return Array.from(sessions.values());
}

/** Get audit log */
export function getAuditLog(limit = 100): AuditEntry[] {
  return auditLog.slice(-limit);
}

// ═══════════════════════════════════════════════════════════════════════════
// PACKAGE MANIFEST
// ═══════════════════════════════════════════════════════════════════════════

export const PACKAGE_MANIFEST = {
  name: '@medina/governance-protocol',
  version: '1.0.0',
  description: 'Complete Governance Protocol — proposals, gates, permissions, audit, replay',
  modules: ['governanceEngine', 'gateEnforcement', 'permissionsManager', 'replayEngine', 'Governance.mo', 'LawEngine.mo'],
  callableFunctions: 6,
  terminal: '/gov',
  latinName: 'TERMINALE GUBERNATIONIS',
  motto: 'Hic leges nascuntur. Hic populus loquitur.',
  backendEndpoints: ['kybernesis_proponere', 'kybernesis_approbare', 'kybernesis_status'],
  exports: [
    'submitProposal', 'voteOnProposal', 'approveProposal', 'rejectProposal',
    'executeProposal', 'governanceStatus', 'listProposals',
    'getGates', 'checkGate', 'setGateStatus', 'checkAllGates', 'enforceGate',
    'grantPermission', 'checkPermission', 'revokePermission', 'listPermissions',
    'startReplaySession', 'recordEvent', 'completeReplaySession', 'listReplaySessions',
    'getAuditLog',
  ],
  phiSignature: PHI * 2.618033988749895,
};
