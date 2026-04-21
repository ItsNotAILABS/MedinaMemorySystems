/**
 * consensus-engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Weighted consensus engine for multi-agent AI systems.
 *
 * Every agent role carries a frequency-derived authority weight.
 * Confidence scores decay weak votes. Sovereign roles hold veto power.
 * Truth emerges from the weighted sum.
 *
 * Use this when:
 *   - Multiple AI agents produce outputs on the same task
 *   - You need to resolve disagreement without a single point of authority
 *   - You want role-aware voting instead of naive majority
 *   - You need to detect and surface dissent before it ships
 *
 * MIT License — ItsNotAILABS
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Role Weights ─────────────────────────────────────────────────────────────

/**
 * Built-in role weight table.
 * Based on Solfeggio-frequency authority hierarchy.
 * Override per-role or supply your own via `ConsensusEngine` options.
 */
export const DEFAULT_ROLE_WEIGHTS: Record<string, number> = {
  SOVEREIGN:      1.00,
  LEAD:           0.85,
  SYNTHESIZER:    0.80,
  CRITIC:         0.75,
  ANALYST:        0.70,
  GUARDIAN:       0.70,
  DOMAIN_EXPERT:  0.65,
  BUILDER:        0.60,
  MEMORY_CURATOR: 0.55,
  RESEARCHER:     0.50,
};

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single agent's submission for consensus. */
export interface AgentVote {
  /** Unique ID of the agent */
  agentId: string;
  /** The agent's role (maps to a weight in the weight table) */
  role: string;
  /** The agent's output / position */
  content: unknown;
  /** How confident the agent is in its output: 0–1 */
  confidence: number;
  /** Optional reasoning text */
  reasoning?: string;
}

/** A resolved vote with computed weights. */
export interface ResolvedVote extends AgentVote {
  /** Role weight from the weight table */
  roleWeight: number;
  /** Final weighted score = roleWeight × confidence */
  weightedScore: number;
  /** Whether this vote counted as APPROVE */
  counted: boolean;
}

/** Full result of a consensus round. */
export interface ConsensusResult {
  /** Identifier for the task or decision being voted on */
  taskId: string;
  /** All resolved votes */
  votes: ResolvedVote[];
  /** Whether the consensus passed the approval threshold */
  approved: boolean;
  /** Whether a SOVEREIGN role vetoed */
  vetoed: boolean;
  /** Sum of all role weights */
  totalWeight: number;
  /** Sum of weighted scores from approving votes */
  approveWeight: number;
  /** Sum of weighted scores from rejecting votes */
  rejectWeight: number;
  /** The threshold used */
  threshold: number;
  /** approveWeight / totalWeight */
  approvalRatio: number;
  /** Output chosen as the canonical result (highest-weighted approving vote) */
  winner: AgentVote | undefined;
  /** Votes that came in below the confidence floor */
  dissent: ResolvedVote[];
  /** ISO timestamp */
  timestamp: string;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export interface ConsensusEngineOptions {
  /**
   * Fraction of total weighted score that must approve for the result to pass.
   * Default: 0.6 (60%)
   */
  threshold?: number;

  /**
   * Votes with confidence below this value are treated as REJECT regardless of content.
   * Default: 0.4
   */
  confidenceFloor?: number;

  /**
   * Roles listed here hold veto power.
   * A single REJECT vote from a veto role fails the consensus regardless of others.
   * Default: ['SOVEREIGN']
   */
  vetoRoles?: string[];

  /**
   * Override or extend the built-in role weight table.
   * Any role not listed here falls back to DEFAULT_ROLE_WEIGHTS, then to 0.5.
   */
  roleWeights?: Record<string, number>;
}

/**
 * Weighted consensus engine for multi-agent AI systems.
 *
 * @example
 * ```typescript
 * import { ConsensusEngine } from 'consensus-engine';
 *
 * const engine = new ConsensusEngine({ threshold: 0.65 });
 *
 * const result = engine.resolve('task-001', [
 *   { agentId: 'lead',       role: 'LEAD',       content: 'Ship it.', confidence: 0.9 },
 *   { agentId: 'analyst',    role: 'ANALYST',    content: 'Ship it.', confidence: 0.82 },
 *   { agentId: 'critic',     role: 'CRITIC',     content: 'Not yet.', confidence: 0.71 },
 *   { agentId: 'synthesizer',role: 'SYNTHESIZER',content: 'Ship it.', confidence: 0.88 },
 * ]);
 *
 * console.log(result.approved);      // true or false
 * console.log(result.approvalRatio); // e.g. 0.78
 * console.log(result.winner);        // highest-weighted approving vote
 * console.log(result.dissent);       // votes that came in under confidence floor
 * ```
 */
export class ConsensusEngine {
  private threshold: number;
  private confidenceFloor: number;
  private vetoRoles: Set<string>;
  private roleWeights: Record<string, number>;

  constructor(options: ConsensusEngineOptions = {}) {
    this.threshold = options.threshold ?? 0.6;
    this.confidenceFloor = options.confidenceFloor ?? 0.4;
    this.vetoRoles = new Set(options.vetoRoles ?? ['SOVEREIGN']);
    this.roleWeights = { ...DEFAULT_ROLE_WEIGHTS, ...(options.roleWeights ?? {}) };
  }

  /**
   * Resolve a set of agent votes into a consensus result.
   */
  resolve(taskId: string, votes: AgentVote[]): ConsensusResult {
    if (votes.length === 0) {
      return this.empty(taskId);
    }

    let totalWeight = 0;
    let approveWeight = 0;
    let rejectWeight = 0;
    const resolved: ResolvedVote[] = [];
    const dissent: ResolvedVote[] = [];
    let vetoed = false;
    let winner: ResolvedVote | undefined;

    for (const vote of votes) {
      const roleWeight = this.roleWeights[vote.role] ?? 0.5;
      const weightedScore = roleWeight * vote.confidence;
      const counted = vote.confidence >= this.confidenceFloor;

      const rv: ResolvedVote = { ...vote, roleWeight, weightedScore, counted };
      resolved.push(rv);
      totalWeight += roleWeight;

      if (!counted) {
        dissent.push(rv);
        rejectWeight += weightedScore;
        continue;
      }

      // Veto check
      if (this.vetoRoles.has(vote.role) && vote.confidence < this.confidenceFloor) {
        vetoed = true;
      }

      approveWeight += weightedScore;

      if (!winner || rv.weightedScore > winner.weightedScore) {
        winner = rv;
      }
    }

    // Explicit veto: any veto-role vote that came in below floor
    const vetoVote = resolved.find(
      v => this.vetoRoles.has(v.role) && !v.counted
    );
    if (vetoVote) vetoed = true;

    const approvalRatio = totalWeight > 0 ? approveWeight / totalWeight : 0;
    const approved = !vetoed && approvalRatio >= this.threshold;

    return {
      taskId,
      votes: resolved,
      approved,
      vetoed,
      totalWeight,
      approveWeight,
      rejectWeight,
      threshold: this.threshold,
      approvalRatio: Math.round(approvalRatio * 10000) / 10000,
      winner,
      dissent,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Quick check: does a simple unweighted majority approve?
   * Useful as a fast pre-filter before a full weighted resolve.
   */
  majority(votes: AgentVote[]): boolean {
    const approve = votes.filter(v => v.confidence >= this.confidenceFloor).length;
    return approve > votes.length / 2;
  }

  /**
   * Update a role's weight at runtime.
   */
  setRoleWeight(role: string, weight: number): void {
    this.roleWeights[role] = Math.min(1, Math.max(0, weight));
  }

  /**
   * Get the current weight for a role.
   */
  getRoleWeight(role: string): number {
    return this.roleWeights[role] ?? 0.5;
  }

  /**
   * List all roles and their current weights, sorted by weight descending.
   */
  listWeights(): Array<{ role: string; weight: number }> {
    return Object.entries(this.roleWeights)
      .sort(([, a], [, b]) => b - a)
      .map(([role, weight]) => ({ role, weight }));
  }

  private empty(taskId: string): ConsensusResult {
    return {
      taskId, votes: [], approved: false, vetoed: false,
      totalWeight: 0, approveWeight: 0, rejectWeight: 0,
      threshold: this.threshold, approvalRatio: 0,
      winner: undefined, dissent: [],
      timestamp: new Date().toISOString(),
    };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a quick vote from an agent output.
 */
export function vote(
  agentId: string,
  role: string,
  content: unknown,
  confidence: number,
  reasoning?: string,
): AgentVote {
  return { agentId, role, content, confidence, reasoning };
}

/**
 * Summarise a consensus result in one line for logging.
 */
export function summarise(result: ConsensusResult): string {
  const status = result.approved ? 'APPROVED' : result.vetoed ? 'VETOED' : 'REJECTED';
  return `[${status}] task=${result.taskId} ratio=${result.approvalRatio} votes=${result.votes.length} dissent=${result.dissent.length}`;
}
