/**
 * agent-incentive-service
 * ─────────────────────────────────────────────────────────────────────────────
 * Mechanism-design incentive structures for multi-agent AI coordination.
 *
 * Implements the formal framework from:
 *   "Incentive Structures for Multi-Agent AI Systems"
 *   ItsNotAILABS, 2026 — papers/AGENT_INCENTIVE_STRUCTURES.md
 *
 * Five classical incentive problems solved structurally:
 *   1. Principal-Agent → Role-scope enforcement
 *   2. Free-Rider      → Confidence-weighted voting
 *   3. Holdup          → Stage gates with output specs
 *   4. Asymmetric Info → Mandatory reasoning transparency
 *   5. Coordination    → Role-authority focal point selection
 *
 * Commercial license — BUSL-1.1 — ItsNotAILABS
 * Production use requires a commercial license. Contact ItsNotAILABS.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Core Types ───────────────────────────────────────────────────────────────

/**
 * A registered agent role with authority domains and weight.
 */
export interface AgentRole {
  /** Unique role identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Decision domains where this role has elevated authority */
  authorityDomains: string[];
  /** Base weight [0, 1] for cross-domain decisions */
  baseWeight: number;
  /** Output types this role is permitted to produce */
  scope: string[];
}

/**
 * A structured output from an agent.
 * All fields are required — missing fields reduce effective weight.
 */
export interface AgentOutput {
  /** The producing agent's role ID */
  roleId: string;
  /** Unique agent instance ID */
  agentId: string;
  /** The decision being addressed */
  decisionId: string;
  /** The type of decision (maps to authority domains) */
  decisionType: string;
  /** The substantive output */
  content: string;
  /** Stated confidence [0, 1] */
  confidence: number;
  /** Chain of reasoning (required for full weight) */
  reasoning: string;
  /** ISO timestamp */
  timestamp: string;
  /** Optional structured metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Result of resolving a set of agent outputs.
 */
export interface ConsensusResult {
  /** Decision ID */
  decisionId: string;
  /** Whether consensus was reached above the threshold */
  approved: boolean;
  /** The winning output (highest effective weight) */
  winner: AgentOutput | null;
  /** The winning agent's effective weight */
  winnerWeight: number;
  /** All outputs with their computed weights */
  weighted: Array<{ output: AgentOutput; effectiveWeight: number }>;
  /** Outputs that did not win — archived for audit */
  dissent: AgentOutput[];
  /** Outputs rejected because they were outside the agent's declared scope */
  rejected: Array<{ output: AgentOutput; reason: string }>;
  /** Whether the result was escalated (below threshold) */
  escalated: boolean;
}

/**
 * Reputation record for an agent role over time.
 */
export interface ReputationRecord {
  roleId: string;
  agentId: string;
  /** Number of decisions participated in */
  participations: number;
  /** Number of decisions where this agent's output matched the final consensus */
  accurateOutcomes: number;
  /** Current calibration score — accuracy / participations */
  calibrationScore: number;
  /** Current effective weight multiplier (derived from calibration) */
  weightMultiplier: number;
  /** ISO timestamp of last update */
  lastUpdated: string;
}

/**
 * Stage gate specification for a pipeline step.
 */
export interface StageGate {
  /** Stage name */
  stage: string;
  /** Required output fields */
  requiredFields: string[];
  /** Maximum word count for stage output (enforces downstream utility) */
  maxLength?: number;
  /** Minimum confidence required to pass the gate */
  minConfidence: number;
}

// ─── IncentiveService ─────────────────────────────────────────────────────────

export interface IncentiveServiceOptions {
  /** Registered roles */
  roles: AgentRole[];
  /** Minimum weighted confidence required for consensus approval */
  confidenceFloor?: number;
  /** Authority weight multiplier (applied when role has domain authority) */
  authorityMultiplier?: number;
  /** Stage gates for pipeline enforcement */
  stageGates?: StageGate[];
  /** Enable reputation tracking */
  enableReputation?: boolean;
}

/**
 * IncentiveService — the core coordination engine.
 *
 * Implements role-weighted consensus with typed authority,
 * reputation staking, stage gate enforcement, and full audit logging.
 *
 * Usage:
 * ```typescript
 * const service = new IncentiveService({ roles, confidenceFloor: 0.72 });
 * const result = service.resolve('decision-001', 'empirical-claim', outputs);
 * ```
 */
export class IncentiveService {
  private roles: Map<string, AgentRole>;
  private confidenceFloor: number;
  private authorityMultiplier: number;
  private stageGates: Map<string, StageGate>;
  private reputationStore: Map<string, ReputationRecord>;
  private enableReputation: boolean;
  private auditLog: Array<{ timestamp: string; event: string; data: unknown }>;

  constructor(options: IncentiveServiceOptions) {
    this.roles = new Map(options.roles.map(r => [r.id, r]));
    this.confidenceFloor = options.confidenceFloor ?? 0.70;
    this.authorityMultiplier = options.authorityMultiplier ?? 2.0;
    this.stageGates = new Map((options.stageGates ?? []).map(g => [g.stage, g]));
    this.reputationStore = new Map();
    this.enableReputation = options.enableReputation ?? true;
    this.auditLog = [];
  }

  /**
   * Resolve a set of agent outputs into a consensus decision.
   *
   * Implements the formal specification:
   *   W_i(d) = w_i × (1 + α(d, a_i)) × c_i × reputation_i
   *   winner = argmax W_i(d)  subject to W_winner ≥ τ
   */
  resolve(decisionId: string, decisionType: string, outputs: AgentOutput[]): ConsensusResult {
    const rejected: Array<{ output: AgentOutput; reason: string }> = [];
    const validOutputs: AgentOutput[] = [];

    // Step 1: Scope enforcement (Principal-Agent problem solution)
    for (const output of outputs) {
      const role = this.roles.get(output.roleId);
      if (!role) {
        rejected.push({ output, reason: `Unknown role: ${output.roleId}` });
        this.log('SCOPE_REJECT', { reason: 'unknown_role', output });
        continue;
      }
      if (role.scope.length > 0 && !role.scope.includes(decisionType)) {
        rejected.push({ output, reason: `Role ${output.roleId} not scoped for ${decisionType}` });
        this.log('SCOPE_REJECT', { reason: 'out_of_scope', roleId: output.roleId, decisionType });
        continue;
      }
      validOutputs.push(output);
    }

    if (validOutputs.length === 0) {
      return {
        decisionId, approved: false, winner: null, winnerWeight: 0,
        weighted: [], dissent: [], rejected, escalated: true,
      };
    }

    // Step 2: Compute effective weights
    const weighted = validOutputs.map(output => {
      const role = this.roles.get(output.roleId)!;
      const baseWeight = role.baseWeight;

      // Authority multiplier — α(d, a_i)
      const hasAuthority = role.authorityDomains.includes(decisionType) ? 1 : 0;
      const authorityFactor = 1 + hasAuthority * (this.authorityMultiplier - 1);

      // Confidence weight
      const confidence = Math.max(0, Math.min(1, output.confidence));

      // Reasoning transparency factor — partial weight penalty for missing reasoning
      const reasoningFactor = output.reasoning && output.reasoning.trim().length > 10 ? 1.0 : 0.5;

      // Reputation multiplier
      const reputationMultiplier = this.enableReputation
        ? (this.getReputation(output.roleId, output.agentId)?.weightMultiplier ?? 1.0)
        : 1.0;

      const effectiveWeight = baseWeight * authorityFactor * confidence * reasoningFactor * reputationMultiplier;
      return { output, effectiveWeight };
    });

    // Step 3: Sort by effective weight
    weighted.sort((a, b) => b.effectiveWeight - a.effectiveWeight);

    const winner = weighted[0];
    const dissent = weighted.slice(1).map(w => w.output);

    // Step 4: Threshold check — escalate if below floor
    const approved = winner.effectiveWeight >= this.confidenceFloor;
    const escalated = !approved;

    this.log('RESOLVE', {
      decisionId,
      decisionType,
      approved,
      winnerRole: winner.output.roleId,
      winnerWeight: winner.effectiveWeight,
      escalated,
    });

    return {
      decisionId,
      approved,
      winner: winner.output,
      winnerWeight: winner.effectiveWeight,
      weighted,
      dissent,
      rejected,
      escalated,
    };
  }

  /**
   * Enforce a stage gate for a pipeline step.
   * Returns pass/fail with specific violation details.
   */
  enforceStageGate(stage: string, output: AgentOutput): { passed: boolean; violations: string[] } {
    const gate = this.stageGates.get(stage);
    if (!gate) {
      return { passed: true, violations: [] }; // No gate defined — pass through
    }

    const violations: string[] = [];

    // Check required fields
    for (const field of gate.requiredFields) {
      const value = (output as unknown as Record<string, unknown>)[field];
      if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        violations.push(`Missing required field: ${field}`);
      }
    }

    // Check confidence
    if (output.confidence < gate.minConfidence) {
      violations.push(`Confidence ${output.confidence.toFixed(2)} below gate minimum ${gate.minConfidence}`);
    }

    // Check length
    if (gate.maxLength && output.content.length > gate.maxLength) {
      violations.push(`Output length ${output.content.length} exceeds stage maximum ${gate.maxLength}`);
    }

    const passed = violations.length === 0;
    this.log('STAGE_GATE', { stage, passed, violations, agentId: output.agentId });

    return { passed, violations };
  }

  /**
   * Update reputation after a decision is confirmed.
   * Pass `accurate: true` if this agent's output matched the final accepted decision.
   */
  updateReputation(roleId: string, agentId: string, accurate: boolean): ReputationRecord {
    const key = `${roleId}:${agentId}`;
    const existing = this.reputationStore.get(key) ?? {
      roleId, agentId,
      participations: 0,
      accurateOutcomes: 0,
      calibrationScore: 0.5,
      weightMultiplier: 1.0,
      lastUpdated: new Date().toISOString(),
    };

    const updated: ReputationRecord = {
      ...existing,
      participations: existing.participations + 1,
      accurateOutcomes: existing.accurateOutcomes + (accurate ? 1 : 0),
      lastUpdated: new Date().toISOString(),
    };

    // Calibration score = smoothed accuracy
    updated.calibrationScore = updated.accurateOutcomes / updated.participations;

    // Weight multiplier: accurate agents gain weight, inaccurate agents lose it
    // Clamped to [0.25, 2.0] to prevent complete exclusion or dominance
    updated.weightMultiplier = Math.max(0.25, Math.min(2.0,
      0.5 + updated.calibrationScore * 1.5
    ));

    this.reputationStore.set(key, updated);
    this.log('REPUTATION_UPDATE', { roleId, agentId, calibrationScore: updated.calibrationScore, weightMultiplier: updated.weightMultiplier });

    return updated;
  }

  /**
   * Get reputation record for an agent.
   */
  getReputation(roleId: string, agentId: string): ReputationRecord | undefined {
    return this.reputationStore.get(`${roleId}:${agentId}`);
  }

  /**
   * Get all reputation records (sorted by calibration score).
   */
  getAllReputations(): ReputationRecord[] {
    return Array.from(this.reputationStore.values())
      .sort((a, b) => b.calibrationScore - a.calibrationScore);
  }

  /**
   * Get the full audit log.
   * All decisions, resolutions, gate enforcements, and reputation updates.
   */
  getAuditLog(): Array<{ timestamp: string; event: string; data: unknown }> {
    return [...this.auditLog];
  }

  /**
   * Get all registered roles.
   */
  getRoles(): AgentRole[] {
    return Array.from(this.roles.values());
  }

  private log(event: string, data: unknown): void {
    this.auditLog.push({
      timestamp: new Date().toISOString(),
      event,
      data,
    });
  }
}

// ─── Convenience Factories ────────────────────────────────────────────────────

/**
 * Default role set for a 5-role analytical team.
 * Covers analysis, strategy, critique, execution, and synthesis.
 */
export const STANDARD_FIVE_ROLES: AgentRole[] = [
  {
    id: 'analyst',
    name: 'Analyst',
    authorityDomains: ['empirical-claim', 'data-interpretation', 'fact-check'],
    baseWeight: 0.75,
    scope: [], // No scope restriction — can address any decision type
  },
  {
    id: 'strategist',
    name: 'Strategist',
    authorityDomains: ['strategic-recommendation', 'goal-setting', 'priority'],
    baseWeight: 0.80,
    scope: [],
  },
  {
    id: 'critic',
    name: 'Critic',
    authorityDomains: ['risk-assessment', 'flaw-detection', 'adversarial-review'],
    baseWeight: 0.75,
    scope: ['risk-assessment', 'flaw-detection', 'adversarial-review', 'quality-check'],
  },
  {
    id: 'builder',
    name: 'Builder',
    authorityDomains: ['implementation-spec', 'technical-design', 'code-structure'],
    baseWeight: 0.75,
    scope: [],
  },
  {
    id: 'synthesizer',
    name: 'Synthesizer',
    authorityDomains: ['final-summary', 'cross-domain-integration', 'consensus-formation'],
    baseWeight: 0.90,
    scope: [],
  },
];

/**
 * Create a standard 5-role IncentiveService with sensible defaults.
 */
export function createStandardService(options?: Partial<IncentiveServiceOptions>): IncentiveService {
  return new IncentiveService({
    roles: STANDARD_FIVE_ROLES,
    confidenceFloor: 0.72,
    authorityMultiplier: 2.0,
    enableReputation: true,
    ...options,
  });
}
