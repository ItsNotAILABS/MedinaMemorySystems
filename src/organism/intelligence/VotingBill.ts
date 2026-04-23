// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * VOTING BILL — TOKEN-WEIGHTED GOVERNANCE ENGINE
 * ─────────────────────────────────────────────────────────────────────────
 * Full integration of token economy with consensus voting.
 * Every vote is a token. Every proposal is a contract.
 * Token weight determines voting power.
 *
 * 3 VOTING ENGINES:
 *   1. SimpleTokenVoting    — one token one vote
 *   2. WeightedTokenVoting  — token weight determines vote power
 *   3. SovereignTokenVoting — includes veto, quorum, confidence floor
 *
 * Cost Structure:
 *   SimpleTokenVoting:    5 tokens per bill
 *   WeightedTokenVoting:  15 tokens per bill
 *   SovereignTokenVoting: 50 tokens per bill + 10 per veto check
 */

// ─────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────

export type VotePosition = 'FOR' | 'AGAINST' | 'ABSTAIN';

export type BillStatus =
  | 'PROPOSED'
  | 'VOTING'
  | 'PASSED'
  | 'REJECTED'
  | 'VETOED'
  | 'RATIFIED'
  | 'ARCHIVED';

/** A single token-weighted vote. */
export interface TokenVote {
  /** Agent ID of the voter. */
  voterId: string;
  /** Bill this vote is cast on. */
  billId: string;
  /** Token weight backing this vote. */
  weight: number;
  /** Voting position. */
  position: VotePosition;
  /** Token ID used for this vote. */
  tokenId: string;
  /** Confidence level 0–1 applied as a multiplier to weight. */
  confidence: number;
  /** Optional reasoning for the vote. */
  reasoning: string;
}

/** A governance bill backed by an intelligence contract. */
export interface VotingBill {
  /** Unique bill identifier. */
  billId: string;
  /** Human-readable title. */
  title: string;
  /** Agent ID of the proposer. */
  proposer: string;
  /** CPL contract source backing this bill. */
  cplContract: string;
  /** Current bill status. */
  status: BillStatus;
  /** All votes cast. */
  votes: TokenVote[];
  /** Minimum total weight required to pass. */
  quorum: number;
  /** Deadline timestamp (epoch ms). */
  deadline: number;
}

/** Tally result for a bill. */
export interface TallyResult {
  billId: string;
  forWeight: number;
  againstWeight: number;
  abstainWeight: number;
  totalWeight: number;
  quorumMet: boolean;
  passed: boolean;
  vetoActive: boolean;
}

// ─────────────────────────────────────────────────────────────────────────
// Cost Structures
// ─────────────────────────────────────────────────────────────────────────

export const ENGINE_COSTS = {
  SimpleTokenVoting:    { perBill: 5,  perVetoCheck: 0  },
  WeightedTokenVoting:  { perBill: 15, perVetoCheck: 0  },
  SovereignTokenVoting: { perBill: 50, perVetoCheck: 10 },
} as const;

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

let _billCounter = 0;
function generateBillId(): string {
  return `BILL-${Date.now()}-${++_billCounter}`;
}

let _tokenCounter = 0;
function generateTokenId(): string {
  return `TKN-${Date.now()}-${++_tokenCounter}`;
}

// ─────────────────────────────────────────────────────────────────────────
// Base Voting Engine
// ─────────────────────────────────────────────────────────────────────────

/** Interface every voting engine must implement. */
export interface IVotingEngine {
  name: string;
  proposeBill(title: string, proposer: string, cplContract: string, quorum?: number, deadlineMs?: number): VotingBill;
  castVote(billId: string, vote: Omit<TokenVote, 'billId' | 'tokenId'>): boolean;
  tallyVotes(billId: string): TallyResult;
  vetoCheck(billId: string): boolean;
  ratify(billId: string): boolean;
  archive(billId: string): boolean;
  getBill(billId: string): VotingBill | null;
}

// ─────────────────────────────────────────────────────────────────────────
// 1. Simple Token Voting — one token one vote
// ─────────────────────────────────────────────────────────────────────────

/**
 * SimpleTokenVoting — each vote counts equally regardless of token weight.
 * Weight is clamped to 1 for tally purposes.
 */
export class SimpleTokenVoting implements IVotingEngine {
  name = 'SimpleTokenVoting';
  protected bills: Map<string, VotingBill> = new Map();

  proposeBill(
    title: string,
    proposer: string,
    cplContract: string,
    quorum = 3,
    deadlineMs = 24 * 60 * 60 * 1000,
  ): VotingBill {
    const bill: VotingBill = {
      billId: generateBillId(),
      title,
      proposer,
      cplContract,
      status: 'PROPOSED',
      votes: [],
      quorum,
      deadline: Date.now() + deadlineMs,
    };
    this.bills.set(bill.billId, bill);
    bill.status = 'VOTING';
    return bill;
  }

  castVote(billId: string, vote: Omit<TokenVote, 'billId' | 'tokenId'>): boolean {
    const bill = this.bills.get(billId);
    if (!bill) return false;
    if (bill.status !== 'VOTING') return false;
    if (Date.now() > bill.deadline) return false;

    // Prevent double voting
    if (bill.votes.some((v) => v.voterId === vote.voterId)) return false;

    bill.votes.push({
      ...vote,
      billId,
      tokenId: generateTokenId(),
    });
    return true;
  }

  tallyVotes(billId: string): TallyResult {
    const bill = this.bills.get(billId);
    if (!bill) {
      return { billId, forWeight: 0, againstWeight: 0, abstainWeight: 0, totalWeight: 0, quorumMet: false, passed: false, vetoActive: false };
    }

    let forW = 0;
    let againstW = 0;
    let abstainW = 0;

    for (const v of bill.votes) {
      const effectiveWeight = 1; // simple: each vote = 1
      switch (v.position) {
        case 'FOR': forW += effectiveWeight; break;
        case 'AGAINST': againstW += effectiveWeight; break;
        case 'ABSTAIN': abstainW += effectiveWeight; break;
      }
    }

    const totalWeight = forW + againstW + abstainW;
    const quorumMet = totalWeight >= bill.quorum;
    const passed = quorumMet && forW > againstW;
    const vetoActive = this.vetoCheck(billId);

    if (passed && !vetoActive) {
      bill.status = 'PASSED';
    } else if (vetoActive) {
      bill.status = 'VETOED';
    } else if (quorumMet) {
      bill.status = 'REJECTED';
    }

    return { billId, forWeight: forW, againstWeight: againstW, abstainWeight: abstainW, totalWeight, quorumMet, passed: passed && !vetoActive, vetoActive };
  }

  vetoCheck(_billId: string): boolean {
    return false; // simple voting has no veto
  }

  ratify(billId: string): boolean {
    const bill = this.bills.get(billId);
    if (!bill || bill.status !== 'PASSED') return false;
    bill.status = 'RATIFIED';
    return true;
  }

  archive(billId: string): boolean {
    const bill = this.bills.get(billId);
    if (!bill) return false;
    if (bill.status !== 'RATIFIED' && bill.status !== 'REJECTED' && bill.status !== 'VETOED') return false;
    bill.status = 'ARCHIVED';
    return true;
  }

  getBill(billId: string): VotingBill | null {
    return this.bills.get(billId) ?? null;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// 2. Weighted Token Voting — token weight determines vote power
// ─────────────────────────────────────────────────────────────────────────

/**
 * WeightedTokenVoting — vote power equals the token weight multiplied by
 * the voter's confidence level.
 *
 * Effective weight = weight × confidence
 */
export class WeightedTokenVoting extends SimpleTokenVoting {
  override name = 'WeightedTokenVoting';

  override tallyVotes(billId: string): TallyResult {
    const bill = this.bills.get(billId);
    if (!bill) {
      return { billId, forWeight: 0, againstWeight: 0, abstainWeight: 0, totalWeight: 0, quorumMet: false, passed: false, vetoActive: false };
    }

    let forW = 0;
    let againstW = 0;
    let abstainW = 0;

    for (const v of bill.votes) {
      const effectiveWeight = v.weight * v.confidence;
      switch (v.position) {
        case 'FOR': forW += effectiveWeight; break;
        case 'AGAINST': againstW += effectiveWeight; break;
        case 'ABSTAIN': abstainW += effectiveWeight; break;
      }
    }

    const totalWeight = forW + againstW + abstainW;
    const quorumMet = totalWeight >= bill.quorum;
    const passed = quorumMet && forW > againstW;
    const vetoActive = this.vetoCheck(billId);

    if (passed && !vetoActive) {
      bill.status = 'PASSED';
    } else if (vetoActive) {
      bill.status = 'VETOED';
    } else if (quorumMet) {
      bill.status = 'REJECTED';
    }

    return { billId, forWeight: forW, againstWeight: againstW, abstainWeight: abstainW, totalWeight, quorumMet, passed: passed && !vetoActive, vetoActive };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// 3. Sovereign Token Voting — veto, quorum, confidence floor
// ─────────────────────────────────────────────────────────────────────────

/** Authority multiplier table for sovereign voting. */
const AUTHORITY_MULTIPLIERS: Record<string, number> = {
  SOVEREIGN: 3.0,
  GOVERNOR: 2.0,
  DELEGATE: 1.5,
  CITIZEN: 1.0,
};

/**
 * SovereignTokenVoting — the most powerful engine.
 *
 * Features beyond weighted voting:
 *  - Sovereign veto: any voter with `SOVEREIGN` authority can veto a bill.
 *  - Confidence floor: votes with confidence below 0.3 are discarded.
 *  - Authority multipliers: voter authority level multiplies effective weight.
 */
export class SovereignTokenVoting extends WeightedTokenVoting {
  override name = 'SovereignTokenVoting';

  /** Map of agentId → authority level. */
  private authorities: Map<string, string> = new Map();

  /** Track sovereign vetoes per bill. */
  private vetoes: Map<string, string[]> = new Map();

  /** Confidence floor — votes below this are ignored. */
  private confidenceFloor = 0.3;

  /**
   * Register an agent's authority level.
   *
   * @param agentId   Agent identifier.
   * @param authority One of SOVEREIGN, GOVERNOR, DELEGATE, CITIZEN.
   */
  setAuthority(agentId: string, authority: string): void {
    this.authorities.set(agentId, authority);
  }

  /**
   * Cast a sovereign veto on a bill (only SOVEREIGN authority can veto).
   *
   * @returns `true` if the veto was accepted.
   */
  castVeto(billId: string, agentId: string): boolean {
    const bill = this.bills.get(billId);
    if (!bill) return false;
    if (this.authorities.get(agentId) !== 'SOVEREIGN') return false;

    const existing = this.vetoes.get(billId) ?? [];
    if (existing.includes(agentId)) return true;
    existing.push(agentId);
    this.vetoes.set(billId, existing);
    return true;
  }

  override vetoCheck(billId: string): boolean {
    const existing = this.vetoes.get(billId);
    return existing !== undefined && existing.length > 0;
  }

  override tallyVotes(billId: string): TallyResult {
    const bill = this.bills.get(billId);
    if (!bill) {
      return { billId, forWeight: 0, againstWeight: 0, abstainWeight: 0, totalWeight: 0, quorumMet: false, passed: false, vetoActive: false };
    }

    let forW = 0;
    let againstW = 0;
    let abstainW = 0;

    for (const v of bill.votes) {
      // Confidence floor
      if (v.confidence < this.confidenceFloor) continue;

      const authority = this.authorities.get(v.voterId) ?? 'CITIZEN';
      const multiplier = AUTHORITY_MULTIPLIERS[authority] ?? 1.0;
      const effectiveWeight = v.weight * v.confidence * multiplier;

      switch (v.position) {
        case 'FOR': forW += effectiveWeight; break;
        case 'AGAINST': againstW += effectiveWeight; break;
        case 'ABSTAIN': abstainW += effectiveWeight; break;
      }
    }

    const totalWeight = forW + againstW + abstainW;
    const quorumMet = totalWeight >= bill.quorum;
    const passed = quorumMet && forW > againstW;
    const vetoActive = this.vetoCheck(billId);

    if (vetoActive) {
      bill.status = 'VETOED';
    } else if (passed) {
      bill.status = 'PASSED';
    } else if (quorumMet) {
      bill.status = 'REJECTED';
    }

    return { billId, forWeight: forW, againstWeight: againstW, abstainWeight: abstainW, totalWeight, quorumMet, passed: passed && !vetoActive, vetoActive };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// VotingEngine — Unified Facade
// ─────────────────────────────────────────────────────────────────────────

export type EngineType = 'simple' | 'weighted' | 'sovereign';

/**
 * VotingEngine — unified facade that creates the appropriate engine
 * based on the requested type.
 */
export class VotingEngine {
  private engines: Map<EngineType, IVotingEngine> = new Map();

  constructor() {
    this.engines.set('simple', new SimpleTokenVoting());
    this.engines.set('weighted', new WeightedTokenVoting());
    this.engines.set('sovereign', new SovereignTokenVoting());
  }

  /** Get a specific engine instance by type. */
  getEngine(type: EngineType): IVotingEngine {
    const engine = this.engines.get(type);
    if (!engine) throw new Error(`Unknown engine type: ${type}`);
    return engine;
  }

  /** Get the sovereign engine with full authority controls. */
  getSovereignEngine(): SovereignTokenVoting {
    return this.engines.get('sovereign') as SovereignTokenVoting;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────

export { AUTHORITY_MULTIPLIERS, generateBillId, generateTokenId };
