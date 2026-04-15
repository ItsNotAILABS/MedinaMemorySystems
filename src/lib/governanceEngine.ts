import { v4 as uuidv4 } from 'uuid';
import type { Gate, GateId, GateStatus, Proposal, ProposalStatus, AuditEntry } from '@/types';

// ─── State ────────────────────────────────────────────────────────────────────

const gates: Map<GateId, Gate> = new Map([
  ['A', { id: 'A', name: 'Governance Gate', status: 'green', description: 'Primary enactment gate. Controls proposal passage.', lastChecked: new Date().toISOString() }],
  ['B', { id: 'B', name: 'Memory Gate', status: 'green', description: 'Memory write and delete authorization gate.', lastChecked: new Date().toISOString() }],
  ['C', { id: 'C', name: 'Sovereign Gate', status: 'amber', description: 'Organism sovereignty and broadcast gate.', lastChecked: new Date().toISOString() }],
]);

const proposals: Map<string, Proposal> = new Map();
const auditLog: AuditEntry[] = [];

// Seed proposals
(function seedProposals() {
  const now = new Date().toISOString();
  const p1: Proposal = {
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
    action: 'PROPOSAL_ENACTED',
    actor: 'Sovereign',
    timestamp: now,
    details: `Proposal "${p1.title}" enacted.`,
    proposalId: p1.id,
  });
  auditLog.push({
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
