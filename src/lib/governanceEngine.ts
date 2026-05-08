import { sovereignId } from './sovereign-id';
import type {
  Gate,
  GateId,
  GateStatus,
  Proposal,
  ProposalStatus,
  AuditEntry,
  AutobotLaw,
  DecepticonLaw,
  AutobotClass,
  DecepticonClass,
  CodexLawCheckResult,
  CodexAuditAction,
} from '@/types';

// ─── State ────────────────────────────────────────────────────────────────────

const gates: Map<GateId, Gate> = new Map([
  ['A', { id: 'A', name: 'Governance Gate', status: 'green', description: 'Primary enactment gate. Controls proposal passage and Autobot spawn/promotion.', lastChecked: new Date().toISOString() }],
  ['B', { id: 'B', name: 'Memory Gate', status: 'green', description: 'Memory write and delete authorization gate.', lastChecked: new Date().toISOString() }],
  ['C', { id: 'C', name: 'Sovereign Gate', status: 'amber', description: 'Organism sovereignty, broadcast, and Decepticon deployment gate.', lastChecked: new Date().toISOString() }],
]);

const proposals: Map<string, Proposal> = new Map();
const auditLog: AuditEntry[] = [];
const codexAuditLog: Array<{ id: string; action: CodexAuditAction; agentId: string; agentClass: string; details: string; timestamp: string }> = [];

// Seed proposals
(function seedProposals() {
  const now = new Date().toISOString();
  const p1: Proposal = {
    id: sovereignId(),
    title: 'Adopt RECITAL_PLUS_ONE as Standing Law',
    description: 'Formally enshrine the RECITAL_PLUS_ONE resonance law as a permanent doctrine of the NOVA OVO platform.',
    author: 'Sovereign',
    status: 'enacted',
    votes: { for: 7, against: 0, abstain: 1 },
    createdAt: now,
    updatedAt: now,
    enactedAt: now,
    doctrineRef: 'DOC-001',
    affectedGates: ['A', 'B'],
    auditLog: [],
  };
  const p2: Proposal = {
    id: sovereignId(),
    title: 'Expand Model Families to Include Risk & Projection',
    description: 'Add two new model families (Risk and Projection) to the multi-model runtime directory.',
    author: 'Builder',
    status: 'approved',
    votes: { for: 5, against: 1, abstain: 2 },
    createdAt: now,
    updatedAt: now,
    doctrineRef: 'DOC-002',
    affectedGates: ['A'],
    auditLog: [],
  };
  const p3: Proposal = {
    id: sovereignId(),
    title: 'Gate C Amber Resolution Protocol',
    description: 'Define standard operating procedure when Gate C enters amber status.',
    author: 'Governance',
    status: 'open',
    votes: { for: 2, against: 0, abstain: 0 },
    createdAt: now,
    updatedAt: now,
    affectedGates: ['C'],
    auditLog: [],
  };
  proposals.set(p1.id, p1);
  proposals.set(p2.id, p2);
  proposals.set(p3.id, p3);

  auditLog.push({
    id: sovereignId(),
    action: 'PROPOSAL_ENACTED',
    actor: 'Sovereign',
    timestamp: now,
    details: `Proposal "${p1.title}" enacted.`,
    proposalId: p1.id,
  });
  auditLog.push({
    id: sovereignId(),
    action: 'PROPOSAL_APPROVED',
    actor: 'Governance',
    timestamp: now,
    details: `Proposal "${p2.title}" approved.`,
    proposalId: p2.id,
  });
})();

// ─── Gates ────────────────────────────────────────────────────────────────────

export function getGates(): Gate[] {
  return Array.from(gates.values());
}

export function getGate(id: GateId): Gate | undefined {
  return gates.get(id);
}

export function setGateStatus(id: GateId, status: GateStatus): Gate | null {
  const gate = gates.get(id);
  if (!gate) return null;
  const updated = { ...gate, status, lastChecked: new Date().toISOString() };
  gates.set(id, updated);
  addAudit('GATE_STATUS_CHANGE', 'System', `Gate ${id} changed to ${status}.`);
  return updated;
}

// ─── Proposals ────────────────────────────────────────────────────────────────

export function listProposals(status?: ProposalStatus): Proposal[] {
  const all = Array.from(proposals.values());
  if (status) return all.filter((p) => p.status === status);
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getProposal(id: string): Proposal | undefined {
  return proposals.get(id);
}

export function createProposal(
  title: string,
  description: string,
  author: string,
  affectedGates: GateId[] = [],
  doctrineRef?: string,
): Proposal {
  const now = new Date().toISOString();
  const proposal: Proposal = {
    id: sovereignId(),
    title,
    description,
    author,
    status: 'draft',
    votes: { for: 0, against: 0, abstain: 0 },
    createdAt: now,
    updatedAt: now,
    doctrineRef,
    affectedGates,
    auditLog: [],
  };
  proposals.set(proposal.id, proposal);
  addAudit('PROPOSAL_CREATED', author, `Proposal "${title}" created.`, proposal.id);
  return proposal;
}

export function voteOnProposal(
  id: string,
  vote: 'for' | 'against' | 'abstain',
  voter: string,
): Proposal | null {
  const proposal = proposals.get(id);
  if (!proposal || proposal.status !== 'open') return null;

  const updated: Proposal = {
    ...proposal,
    votes: { ...proposal.votes, [vote]: proposal.votes[vote] + 1 },
    updatedAt: new Date().toISOString(),
  };

  // Auto-approve if 5+ for votes
  if (updated.votes.for >= 5) {
    updated.status = 'approved';
    addAudit('PROPOSAL_APPROVED', 'System', `Proposal "${proposal.title}" auto-approved.`, id);
  }

  proposals.set(id, updated);
  addAudit('VOTE_CAST', voter, `Voted "${vote}" on proposal "${proposal.title}".`, id);
  return updated;
}

export function openProposal(id: string): Proposal | null {
  const proposal = proposals.get(id);
  if (!proposal || proposal.status !== 'draft') return null;
  const updated = { ...proposal, status: 'open' as ProposalStatus, updatedAt: new Date().toISOString() };
  proposals.set(id, updated);
  addAudit('PROPOSAL_OPENED', 'Governance', `Proposal "${proposal.title}" opened for voting.`, id);
  return updated;
}

export function enactProposal(id: string): Proposal | null {
  const proposal = proposals.get(id);
  if (!proposal || proposal.status !== 'approved') return null;

  // Check gate A
  const gateA = gates.get('A');
  if (gateA?.status === 'red') return null;

  const now = new Date().toISOString();
  const updated = { ...proposal, status: 'enacted' as ProposalStatus, enactedAt: now, updatedAt: now };
  proposals.set(id, updated);
  addAudit('PROPOSAL_ENACTED', 'Governance', `Proposal "${proposal.title}" enacted.`, id);
  return updated;
}

// ─── Audit ────────────────────────────────────────────────────────────────────

function addAudit(action: string, actor: string, details: string, proposalId?: string): void {
  auditLog.push({
    id: sovereignId(),
    action,
    actor,
    timestamp: new Date().toISOString(),
    details,
    proposalId,
  });
}

export function getAuditLog(limit = 50): AuditEntry[] {
  return auditLog.slice(-limit).reverse();
}

export function getGovernanceStats(): {
  totalProposals: number;
  open: number;
  enacted: number;
  approved: number;
  gateStatuses: Record<GateId, GateStatus>;
} {
  const all = Array.from(proposals.values());
  const gateStatuses = {} as Record<GateId, GateStatus>;
  for (const [id, gate] of gates) {
    gateStatuses[id] = gate.status;
  }

  return {
    totalProposals: all.length,
    open: all.filter((p) => p.status === 'open').length,
    enacted: all.filter((p) => p.status === 'enacted').length,
    approved: all.filter((p) => p.status === 'approved').length,
    gateStatuses,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CODEX LAW GOVERNANCE — Autobot & Decepticon Law Enforcement
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Log a codex audit event.
 */
function addCodexAudit(
  action: CodexAuditAction,
  agentId: string,
  agentClass: string,
  details: string,
): string {
  const entry = {
    id: sovereignId(),
    action,
    agentId,
    agentClass,
    details,
    timestamp: new Date().toISOString(),
  };
  codexAuditLog.push(entry);
  return entry.id;
}

/**
 * Get the codex audit log.
 */
export function getCodexAuditLog(limit = 100): Array<{ id: string; action: CodexAuditAction; agentId: string; agentClass: string; details: string; timestamp: string }> {
  return codexAuditLog.slice(-limit).reverse();
}

// ─── Autobot Law Validation ─────────────────────────────────────────────────

/**
 * Check if Gate A allows Autobot spawn/promotion.
 */
export function checkGateAForAutobot(): { allowed: boolean; reason: string } {
  const gateA = gates.get('A');
  if (!gateA) return { allowed: false, reason: 'Gate A not found' };
  
  if (gateA.status === 'red') {
    return { allowed: false, reason: 'Gate A is red — Autobot operations blocked' };
  }
  if (gateA.status === 'amber') {
    return { allowed: true, reason: 'Gate A is amber — Autobot operations allowed with caution' };
  }
  return { allowed: true, reason: 'Gate A is green — Autobot operations fully allowed' };
}

/**
 * Validate Autobot law A-1: Coherence.
 */
export function validateAutobotCoherence(
  agentId: string,
  agentClass: AutobotClass,
  action: string,
  content?: string,
): CodexLawCheckResult {
  const law: AutobotLaw = 'A-1';
  let passed = true;
  let reason = 'Coherence maintained';

  if (content !== undefined) {
    if (content.length === 0) {
      passed = false;
      reason = 'Empty content violates coherence';
    } else if (content.length > 1_000_000) {
      passed = false;
      reason = 'Content exceeds coherence bounds';
    }
  }

  const auditId = addCodexAudit('AUTOBOT_LAW_CHECK', agentId, agentClass, `A-1 Coherence: ${reason}`);

  return { passed, law, agent: agentId, agentClass, action, reason, timestamp: new Date().toISOString(), auditId };
}

/**
 * Validate Autobot law A-2: Reversibility.
 */
export function validateAutobotReversibility(
  agentId: string,
  agentClass: AutobotClass,
  action: string,
  hasLineage: boolean,
): CodexLawCheckResult {
  const law: AutobotLaw = 'A-2';
  const passed = hasLineage;
  const reason = hasLineage ? 'Operation has lineage chain' : 'Operation lacks lineage';

  const auditId = addCodexAudit('AUTOBOT_LAW_CHECK', agentId, agentClass, `A-2 Reversibility: ${reason}`);

  return { passed, law, agent: agentId, agentClass, action, reason, timestamp: new Date().toISOString(), auditId };
}

/**
 * Validate Autobot law A-3: Explainability.
 */
export function validateAutobotExplainability(
  agentId: string,
  agentClass: AutobotClass,
  action: string,
): CodexLawCheckResult {
  const law: AutobotLaw = 'A-3';
  const passed = true;
  const reason = 'Audit logging active';

  const auditId = addCodexAudit('AUTOBOT_LAW_CHECK', agentId, agentClass, `A-3 Explainability: ${reason}`);

  return { passed, law, agent: agentId, agentClass, action, reason, timestamp: new Date().toISOString(), auditId };
}

/**
 * Validate Autobot law A-4: Containment.
 */
export function validateAutobotContainment(
  agentId: string,
  agentClass: AutobotClass,
  action: string,
  requiredScope: string,
  actualScope: string,
): CodexLawCheckResult {
  const law: AutobotLaw = 'A-4';
  const scopeHierarchy = ['public', 'enterprise', 'internal', 'sovereign'];
  const requiredIndex = scopeHierarchy.indexOf(requiredScope);
  const actualIndex = scopeHierarchy.indexOf(actualScope);

  const passed = actualIndex >= requiredIndex;
  const reason = passed ? `Scope ${actualScope} authorized` : `Scope ${actualScope} insufficient for ${requiredScope}`;

  const auditId = addCodexAudit('AUTOBOT_LAW_CHECK', agentId, agentClass, `A-4 Containment: ${reason}`);

  return { passed, law, agent: agentId, agentClass, action, reason, timestamp: new Date().toISOString(), auditId };
}

/**
 * Validate all Autobot laws for an action.
 */
export function validateAllAutobotLaws(
  agentId: string,
  agentClass: AutobotClass,
  action: string,
  context: { content?: string; hasLineage?: boolean; requiredScope?: string; actualScope?: string } = {},
): { passed: boolean; results: CodexLawCheckResult[] } {
  const results: CodexLawCheckResult[] = [];

  const gateCheck = checkGateAForAutobot();
  if (!gateCheck.allowed) {
    const gateResult: CodexLawCheckResult = {
      passed: false, law: 'A-1', agent: agentId, agentClass, action, reason: gateCheck.reason,
      timestamp: new Date().toISOString(), auditId: addCodexAudit('AUTOBOT_LAW_CHECK', agentId, agentClass, gateCheck.reason),
    };
    return { passed: false, results: [gateResult] };
  }

  results.push(validateAutobotCoherence(agentId, agentClass, action, context.content));
  results.push(validateAutobotReversibility(agentId, agentClass, action, context.hasLineage ?? true));
  results.push(validateAutobotExplainability(agentId, agentClass, action));

  if (context.requiredScope && context.actualScope) {
    results.push(validateAutobotContainment(agentId, agentClass, action, context.requiredScope, context.actualScope));
  } else {
    results.push({
      passed: true, law: 'A-4', agent: agentId, agentClass, action, reason: 'No scope constraint',
      timestamp: new Date().toISOString(), auditId: addCodexAudit('AUTOBOT_LAW_CHECK', agentId, agentClass, 'A-4: No constraint'),
    });
  }

  return { passed: results.every((r) => r.passed), results };
}

// ─── Decepticon Law Validation ──────────────────────────────────────────────

/**
 * Check if Gate C allows Decepticon deployment.
 */
export function checkGateCForDecepticon(): { allowed: boolean; reason: string } {
  const gateC = gates.get('C');
  if (!gateC) return { allowed: false, reason: 'Gate C not found' };

  if (gateC.status === 'red') {
    return { allowed: false, reason: 'Gate C is red — Decepticon deployment blocked' };
  }
  return { allowed: true, reason: `Gate C is ${gateC.status} — Decepticon deployment allowed` };
}

/**
 * Validate Decepticon law D-1: Sandboxing.
 */
export function validateDecepticonSandboxing(
  agentId: string,
  agentClass: DecepticonClass,
  action: string,
  chaosDomainId?: string,
): CodexLawCheckResult {
  const law: DecepticonLaw = 'D-1';
  const passed = !!chaosDomainId;
  const reason = passed ? `In chaos domain ${chaosDomainId?.slice(0, 8)}…` : 'No chaos domain';

  const auditId = addCodexAudit('DECEPTICON_TELEMETRY', agentId, agentClass, `D-1 Sandboxing: ${reason}`);

  return { passed, law, agent: agentId, agentClass, action, reason, timestamp: new Date().toISOString(), auditId };
}

/**
 * Validate Decepticon law D-2: Telemetry.
 */
export function validateDecepticonTelemetry(
  agentId: string,
  agentClass: DecepticonClass,
  action: string,
): CodexLawCheckResult {
  const law: DecepticonLaw = 'D-2';
  const passed = true;
  const reason = 'Telemetry active';

  const auditId = addCodexAudit('DECEPTICON_TELEMETRY', agentId, agentClass, `D-2 Telemetry: ${reason}`);

  return { passed, law, agent: agentId, agentClass, action, reason, timestamp: new Date().toISOString(), auditId };
}

/**
 * Validate Decepticon law D-3: Non-Persistence.
 */
export function validateDecepticonNonPersistence(
  agentId: string,
  agentClass: DecepticonClass,
  action: string,
  domainExpiresAt?: string,
): CodexLawCheckResult {
  const law: DecepticonLaw = 'D-3';
  let passed = false;
  let reason = 'No expiration set';

  if (domainExpiresAt) {
    passed = true;
    const ttl = new Date(domainExpiresAt).getTime() - Date.now();
    reason = ttl > 0 ? `Domain expires in ${Math.round(ttl / 1000)}s` : 'Domain expired';
  }

  const auditId = addCodexAudit('DECEPTICON_TELEMETRY', agentId, agentClass, `D-3 Non-Persistence: ${reason}`);

  return { passed, law, agent: agentId, agentClass, action, reason, timestamp: new Date().toISOString(), auditId };
}

/**
 * Validate Decepticon law D-4: Counterpart.
 */
export function validateDecepticonCounterpart(
  agentId: string,
  agentClass: DecepticonClass,
  action: string,
  counterpartId?: string,
): CodexLawCheckResult {
  const law: DecepticonLaw = 'D-4';
  const passed = !!counterpartId;
  const reason = passed ? `Counterpart ${counterpartId?.slice(0, 8)}… assigned` : 'No counterpart';

  const auditId = addCodexAudit('DECEPTICON_TELEMETRY', agentId, agentClass, `D-4 Counterpart: ${reason}`);

  return { passed, law, agent: agentId, agentClass, action, reason, timestamp: new Date().toISOString(), auditId };
}

/**
 * Validate all Decepticon laws for an action.
 */
export function validateAllDecepticonLaws(
  agentId: string,
  agentClass: DecepticonClass,
  action: string,
  context: { chaosDomainId?: string; domainExpiresAt?: string; counterpartId?: string } = {},
): { passed: boolean; results: CodexLawCheckResult[] } {
  const results: CodexLawCheckResult[] = [];

  const gateCheck = checkGateCForDecepticon();
  if (!gateCheck.allowed) {
    const gateResult: CodexLawCheckResult = {
      passed: false, law: 'D-1', agent: agentId, agentClass, action, reason: gateCheck.reason,
      timestamp: new Date().toISOString(), auditId: addCodexAudit('DECEPTICON_TELEMETRY', agentId, agentClass, gateCheck.reason),
    };
    return { passed: false, results: [gateResult] };
  }

  results.push(validateDecepticonSandboxing(agentId, agentClass, action, context.chaosDomainId));
  results.push(validateDecepticonTelemetry(agentId, agentClass, action));
  results.push(validateDecepticonNonPersistence(agentId, agentClass, action, context.domainExpiresAt));
  results.push(validateDecepticonCounterpart(agentId, agentClass, action, context.counterpartId));

  return { passed: results.every((r) => r.passed), results };
}

// ─── Gate-Codex Mapping ─────────────────────────────────────────────────────

/**
 * Get the gate responsible for a given codex action.
 */
export function getGateForCodexAction(action: CodexAuditAction): GateId {
  switch (action) {
    case 'AUTOBOT_SPAWN':
    case 'AUTOBOT_RETIRE':
    case 'AUTOBOT_LAW_CHECK':
      return 'A';
    case 'LINEAGE_CREATE':
    case 'LINEAGE_FORK':
    case 'LINEAGE_MERGE':
    case 'SHARD_APPEND':
    case 'ACCESS_GRANT':
    case 'ACCESS_REVOKE':
      return 'B';
    case 'DECEPTICON_DEPLOY':
    case 'DECEPTICON_TELEMETRY':
    case 'CHAOS_DOMAIN_CREATE':
    case 'CHAOS_DOMAIN_EXPIRE':
      return 'C';
    default:
      return 'A';
  }
}

/**
 * Check if a codex action is allowed based on gate status.
 */
export function isCodexActionAllowed(action: CodexAuditAction): { allowed: boolean; gate: GateId; status: GateStatus; reason: string } {
  const gateId = getGateForCodexAction(action);
  const gate = gates.get(gateId);

  if (!gate) {
    return { allowed: false, gate: gateId, status: 'red', reason: `Gate ${gateId} not found` };
  }

  if (gate.status === 'red') {
    return { allowed: false, gate: gateId, status: gate.status, reason: `Gate ${gateId} is red — action blocked` };
  }

  return { allowed: true, gate: gateId, status: gate.status, reason: `Gate ${gateId} is ${gate.status} — action allowed` };
}
