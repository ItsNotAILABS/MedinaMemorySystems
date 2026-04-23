/**
 * @itsnotailabs/organism-contracts
 * Smart contracts and sovereign ledger primitives: SAT tokens, enforcement records.
 *
 * Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
 * Licensed under ISIL v1.1 — see LICENSE for details.
 * SAEIS enforcement: ACTIVE. SAT token binding: ENABLED.
 */

export const PHI = (1 + Math.sqrt(5)) / 2;

export interface SATToken {
  id: string;
  owner: string;
  amount: number;
  issuedAt: number;
  expiresAt: number;
  boundContractId: string | null;
}

export interface EnforcementRecord {
  id: string;
  contractId: string;
  action: string;
  enforcedAt: number;
  status: 'pending' | 'enforced' | 'appealed' | 'revoked';
  evidence: string[];
}

export interface SovereignContract {
  id: string;
  parties: string[];
  terms: string;
  stakeAmount: number;
  createdAt: number;
  status: 'draft' | 'active' | 'fulfilled' | 'breached' | 'expired';
}

export class OrganismContracts {
  private contracts: Map<string, SovereignContract> = new Map();
  private tokens: Map<string, SATToken> = new Map();
  private enforcements: EnforcementRecord[] = [];
  private nextTokenId = 1;

  /** Mint SAT tokens and bind them to an owner. */
  mintTokens(owner: string, amount: number, ttlHours = 720): SATToken {
    const now = Date.now();
    const token: SATToken = {
      id: `SAT-${this.nextTokenId++}`,
      owner,
      amount: Math.round(amount * PHI) / PHI,
      issuedAt: now,
      expiresAt: now + ttlHours * 3_600_000,
      boundContractId: null,
    };
    this.tokens.set(token.id, token);
    return token;
  }

  /** Create a sovereign contract between parties with a SAT token stake. */
  createContract(id: string, parties: string[], terms: string, stakeAmount: number): SovereignContract {
    const contract: SovereignContract = {
      id,
      parties,
      terms,
      stakeAmount,
      createdAt: Date.now(),
      status: 'draft',
    };
    this.contracts.set(id, contract);
    return contract;
  }

  /** Activate a contract by binding staked SAT tokens to it. */
  activateContract(contractId: string, tokenIds: string[]): SovereignContract {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error(`Contract ${contractId} not found`);
    if (contract.status !== 'draft') throw new Error(`Contract must be in draft status to activate`);

    let totalStake = 0;
    for (const tid of tokenIds) {
      const token = this.tokens.get(tid);
      if (!token) throw new Error(`Token ${tid} not found`);
      if (token.boundContractId) throw new Error(`Token ${tid} already bound`);
      token.boundContractId = contractId;
      totalStake += token.amount;
    }

    if (totalStake < contract.stakeAmount) {
      throw new Error(`Insufficient stake: ${totalStake} < ${contract.stakeAmount}`);
    }

    contract.status = 'active';
    return contract;
  }

  /** Record an enforcement action against a breached contract. */
  recordEnforcement(contractId: string, action: string, evidence: string[]): EnforcementRecord {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error(`Contract ${contractId} not found`);

    contract.status = 'breached';
    const record: EnforcementRecord = {
      id: `ENF-${this.enforcements.length + 1}`,
      contractId,
      action,
      enforcedAt: Date.now(),
      status: 'pending',
      evidence,
    };
    this.enforcements.push(record);
    return record;
  }

  /** Get all enforcement records for a specific contract. */
  getEnforcements(contractId: string): EnforcementRecord[] {
    return this.enforcements.filter((e) => e.contractId === contractId);
  }
}
