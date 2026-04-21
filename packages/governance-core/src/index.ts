// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE.

/**
 * governance-core
 * ─────────────────────────────────────────────────────────────────────────────
 * Multi-agent governance framework for ItsNotAILABS sovereign systems.
 *
 * Proposals → voting periods → quorum → resolution → sovereign override chain.
 *
 * ISIL-1.1 — Production use requires commercial license + AUT.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ProposalStatus =
  | 'DRAFT' | 'OPEN' | 'VOTING' | 'PASSED' | 'REJECTED' | 'VETOED' | 'EXPIRED';

export type VoteChoice = 'FOR' | 'AGAINST' | 'ABSTAIN';

export interface Proposal {
  proposalId: string;
  title: string;
  description: string;
  proposedBy: string;
  proposedAt: number;
  votingOpensAt: number;
  votingClosesAt: number;
  quorumRequired: number; // 0-1.0, fraction of eligible voters
  approvalThreshold: number; // 0-1.0, fraction of votes that must be FOR
  status: ProposalStatus;
  domain: string; // governance domain this proposal applies to
}

export interface Vote {
  voteId: string;
  proposalId: string;
  voterId: string;
  choice: VoteChoice;
  weight: number; // 0-1.0 standing weight
  reasoning?: string;
  castAt: number;
}

export interface GovernanceResult {
  proposalId: string;
  status: ProposalStatus;
  totalWeight: number;
  forWeight: number;
  againstWeight: number;
  abstainWeight: number;
  quorumMet: boolean;
  thresholdMet: boolean;
  vetoApplied: boolean;
  vetoBy?: string;
  resolvedAt: number;
}

export class GovernanceCore {
  private proposals = new Map<string, Proposal>();
  private votes = new Map<string, Vote[]>(); // proposalId → votes
  private eligibleVoters = new Map<string, number>(); // voterId → weight
  private vetoHolders = new Set<string>(); // voterIds with veto power

  /** Register an eligible voter with their standing weight */
  registerVoter(voterId: string, weight: number, hasVeto = false): void {
    this.eligibleVoters.set(voterId, Math.min(1.0, Math.max(0, weight)));
    if (hasVeto) this.vetoHolders.add(voterId);
  }

  /** Submit a proposal */
  propose(proposal: Proposal): void {
    this.proposals.set(proposal.proposalId, { ...proposal, status: 'DRAFT' });
    this.votes.set(proposal.proposalId, []);
  }

  /** Open voting on a proposal */
  openVoting(proposalId: string): void {
    const p = this._getProposal(proposalId);
    p.status = 'VOTING';
  }

  /** Cast a vote */
  vote(vote: Vote): void {
    const p = this._getProposal(vote.proposalId);
    if (p.status !== 'VOTING') throw new Error(`Proposal ${vote.proposalId} is not open for voting`);
    if (!this.eligibleVoters.has(vote.voterId)) throw new Error(`${vote.voterId} is not an eligible voter`);
    const votes = this.votes.get(vote.proposalId)!;
    const existing = votes.findIndex(v => v.voterId === vote.voterId);
    if (existing !== -1) votes[existing] = vote; // allow vote change
    else votes.push(vote);
  }

  /** Resolve a proposal after voting closes */
  resolve(proposalId: string, vetoBy?: string): GovernanceResult {
    const p = this._getProposal(proposalId);
    const votes = this.votes.get(proposalId) ?? [];
    const totalEligibleWeight = Array.from(this.eligibleVoters.values()).reduce((a,b)=>a+b,0);
    let forWeight = 0, againstWeight = 0, abstainWeight = 0;
    for (const v of votes) {
      if (v.choice === 'FOR') forWeight += v.weight;
      else if (v.choice === 'AGAINST') againstWeight += v.weight;
      else abstainWeight += v.weight;
    }
    const totalVotedWeight = forWeight + againstWeight + abstainWeight;
    const quorumMet = totalEligibleWeight > 0 && (totalVotedWeight / totalEligibleWeight) >= p.quorumRequired;
    const thresholdMet = totalVotedWeight > 0 && (forWeight / totalVotedWeight) >= p.approvalThreshold;
    const vetoApplied = !!(vetoBy && this.vetoHolders.has(vetoBy));
    const status: ProposalStatus = vetoApplied ? 'VETOED'
      : !quorumMet ? 'REJECTED'
      : thresholdMet ? 'PASSED' : 'REJECTED';
    p.status = status;
    return { proposalId, status, totalWeight: totalVotedWeight,
             forWeight, againstWeight, abstainWeight,
             quorumMet, thresholdMet, vetoApplied, vetoBy, resolvedAt: Date.now() };
  }

  private _getProposal(id: string): Proposal {
    const p = this.proposals.get(id);
    if (!p) throw new Error(`Proposal ${id} not found`);
    return p;
  }
}
