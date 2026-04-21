/**
 * agent-incentive-service
 * ─────────────────────────────────────────────────────────────────────────────
 * ItsNotAILABS Sovereign Coordination Engine.
 *
 * Implements mechanism-design incentive structures for multi-agent AI teams.
 * Foundation: papers/AGENT_INCENTIVE_STRUCTURES.md (ItsNotAILABS, 2026)
 *
 * Five structural solutions to the five coordination problems:
 *
 *   I.   Scope Boundary       → each sovereign role operates within declared
 *                               output domains; cross-domain claims are voided
 *   II.  Weighted Signal      → confidence-proportional vote weight prevents
 *                               low-effort claims from carrying equal standing
 *   III. Stage Covenant       → pipeline stage contracts enforce downstream
 *                               utility over upstream self-optimization
 *   IV.  Transparent Witness  → every claim requires a reasoning chain; absent
 *                               reasoning halves the claim's standing weight
 *   V.   Authority Resolution → domain-specific authority roles break deadlock
 *                               by standing as designated focal arbiters
 *
 * ISIL-1.0 — ItsNotAILABS Sovereign Intelligence License
 * Production use requires a commercial license.
 * Contact ItsNotAILABS via authenticated channels.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Sovereign Role Definition ────────────────────────────────────────────────

/**
 * A sovereign role within a coordination council.
 * Each role carries declared authority over specific resolution domains
 * and a base standing weight that governs cross-domain participation.
 */
export interface SovereignRole {
  /** Unique role token — stable identifier across sessions */
  roleToken: string;
  /** Human-readable designation */
  designation: string;
  /** Resolution domains where this role holds primary authority */
  authorityDomains: string[];
  /** Base standing weight in cross-domain resolutions [0, 1] */
  standingWeight: number;
  /** Declared output domains — empty array means unrestricted */
  declaredScope: string[];
}

/**
 * A structured claim submitted by a council member for resolution.
 * All fields are required fields of record. Missing fields reduce standing.
 */
export interface ClaimRecord {
  /** Role token of the issuing council member */
  roleToken: string;
  /** Instance identifier of the issuing agent */
  instanceId: string;
  /** Resolution session identifier */
  sessionId: string;
  /** The domain being addressed */
  domain: string;
  /** The substantive claim */
  claim: string;
  /** Stated conviction level [0, 1] */
  conviction: number;
  /** Witness chain — the chain of reasoning that supports the claim */
  witnessChain: string;
  /** ISO 8601 timestamp */
  issuedAt: string;
  /** Optional structured annotations */
  annotations?: Record<string, unknown>;
}

/**
 * The outcome of a sovereign resolution process.
 */
export interface ResolutionRecord {
  /** Session identifier */
  sessionId: string;
  /** Whether the council reached threshold standing */
  ratified: boolean;
  /** The prevailing claim (highest standing weight) */
  prevailingClaim: ClaimRecord | null;
  /** The prevailing claim's computed standing weight */
  prevailingStanding: number;
  /** All claims with their computed standing weights */
  standings: Array<{ claim: ClaimRecord; standingWeight: number }>;
  /** Minority claims — archived in the dissent ledger */
  dissentLedger: ClaimRecord[];
  /** Claims voided for scope violation */
  voidedClaims: Array<{ claim: ClaimRecord; voidReason: string }>;
  /** True if no claim reached the standing threshold — escalated to sovereign */
  escalatedToSovereign: boolean;
}

/**
 * Reputation record maintained across resolutions.
 */
export interface StandingRecord {
  roleToken: string;
  instanceId: string;
  /** Total resolutions participated in */
  participationCount: number;
  /** Resolutions where this instance's claim matched the final ratified outcome */
  validatedOutcomes: number;
  /** Calibration index — validated / participated */
  calibrationIndex: number;
  /** Standing multiplier applied to future weights [0.25, 2.0] */
  standingMultiplier: number;
  /** ISO 8601 timestamp of last update */
  updatedAt: string;
}

/**
 * Covenant specification for a pipeline stage.
 * Enforces the Stage Covenant solution (Problem III: Holdup).
 */
export interface StageCovenant {
  /** Stage name in the pipeline */
  stageName: string;
  /** Required fields of record */
  requiredFields: string[];
  /** Maximum claim length in characters (enforces downstream utility) */
  maxClaimLength?: number;
  /** Minimum conviction required to pass the covenant gate */
  minimumConviction: number;
}

// ─── SovereignCoordinator ─────────────────────────────────────────────────────

export interface CoordinatorOptions {
  /** The council of sovereign roles */
  council: SovereignRole[];
  /** Minimum standing weight required for ratification */
  ratificationThreshold?: number;
  /** Authority standing multiplier when a role holds domain authority */
  authorityAmplifier?: number;
  /** Stage covenants for pipeline enforcement */
  stageCovenants?: StageCovenant[];
  /** Enable standing ledger (reputation tracking) */
  enableStandingLedger?: boolean;
}

/**
 * SovereignCoordinator — the ItsNotAILABS coordination engine.
 *
 * Resolves competing claims from council members using the formal
 * standing-weight mechanism:
 *
 *   S_i(d) = w_i × A(d, r_i) × k_i × τ_i × rep_i
 *
 * Where:
 *   w_i    = base standing weight of role r_i
 *   A(d,r) = authority amplifier if role r has domain authority over d
 *   k_i    = conviction level of claim i [0, 1]
 *   τ_i    = transparency factor (1.0 with witness chain; 0.5 without)
 *   rep_i  = standing multiplier from ledger [0.25, 2.0]
 *
 * Prevailing claim: argmax S_i(d), subject to S_i ≥ ratificationThreshold
 * Below threshold: escalated to sovereign authority.
 *
 * @example
 * ```typescript
 * const coordinator = createCouncilCoordinator();
 * const resolution = coordinator.resolve('session-001', 'empirical-claim', claims);
 * console.log(resolution.ratified);
 * console.log(resolution.prevailingClaim?.claim);
 * ```
 */
export class SovereignCoordinator {
  private council: Map<string, SovereignRole>;
  private ratificationThreshold: number;
  private authorityAmplifier: number;
  private covenants: Map<string, StageCovenant>;
  private standingLedger: Map<string, StandingRecord>;
  private enableStandingLedger: boolean;
  private sovereignLog: Array<{ timestamp: string; event: string; record: unknown }>;

  constructor(options: CoordinatorOptions) {
    this.council = new Map(options.council.map(r => [r.roleToken, r]));
    this.ratificationThreshold = options.ratificationThreshold ?? 0.70;
    this.authorityAmplifier = options.authorityAmplifier ?? 2.0;
    this.covenants = new Map((options.stageCovenants ?? []).map(c => [c.stageName, c]));
    this.standingLedger = new Map();
    this.enableStandingLedger = options.enableStandingLedger ?? true;
    this.sovereignLog = [];
  }

  /**
   * Resolve a set of claims to a ratified outcome.
   *
   * Implements the formal standing-weight resolution mechanism.
   */
  resolve(sessionId: string, domain: string, claims: ClaimRecord[]): ResolutionRecord {
    const voidedClaims: Array<{ claim: ClaimRecord; voidReason: string }> = [];
    const validClaims: ClaimRecord[] = [];

    // I. Scope Boundary Enforcement (Principal-Agent solution)
    for (const claim of claims) {
      const role = this.council.get(claim.roleToken);
      if (!role) {
        voidedClaims.push({ claim, voidReason: `Unrecognized role token: ${claim.roleToken}` });
        this.record('VOID_UNKNOWN_ROLE', { roleToken: claim.roleToken, sessionId });
        continue;
      }
      if (role.declaredScope.length > 0 && !role.declaredScope.includes(domain)) {
        voidedClaims.push({ claim, voidReason: `Role ${claim.roleToken} scope excludes domain: ${domain}` });
        this.record('VOID_SCOPE_BREACH', { roleToken: claim.roleToken, domain });
        continue;
      }
      validClaims.push(claim);
    }

    if (validClaims.length === 0) {
      return {
        sessionId, ratified: false, prevailingClaim: null,
        prevailingStanding: 0, standings: [], dissentLedger: [],
        voidedClaims, escalatedToSovereign: true,
      };
    }

    // II–V: Compute standing weights
    const standings = validClaims.map(claim => {
      const role = this.council.get(claim.roleToken)!;

      // Base standing
      const base = role.standingWeight;

      // Authority amplifier — A(d, r_i)
      const hasAuthority = role.authorityDomains.includes(domain);
      const authorityFactor = hasAuthority ? this.authorityAmplifier : 1.0;

      // Conviction weight (II: Weighted Signal)
      const conviction = Math.max(0, Math.min(1, claim.conviction));

      // Transparent witness factor (IV: Transparent Witness)
      const witnessPresent = claim.witnessChain && claim.witnessChain.trim().length > 10;
      const transparencyFactor = witnessPresent ? 1.0 : 0.5;

      // Standing multiplier from ledger
      const ledgerMultiplier = this.enableStandingLedger
        ? (this.lookupStanding(claim.roleToken, claim.instanceId)?.standingMultiplier ?? 1.0)
        : 1.0;

      const standingWeight = base * authorityFactor * conviction * transparencyFactor * ledgerMultiplier;
      return { claim, standingWeight };
    });

    // Sort descending by standing weight
    standings.sort((a, b) => b.standingWeight - a.standingWeight);

    const prevailing = standings[0];
    const dissentLedger = standings.slice(1).map(s => s.claim);
    const ratified = prevailing.standingWeight >= this.ratificationThreshold;

    this.record('RESOLUTION', {
      sessionId, domain, ratified,
      prevailingRole: prevailing.claim.roleToken,
      prevailingStanding: prevailing.standingWeight,
      escalated: !ratified,
    });

    return {
      sessionId, ratified,
      prevailingClaim: prevailing.claim,
      prevailingStanding: prevailing.standingWeight,
      standings,
      dissentLedger,
      voidedClaims,
      escalatedToSovereign: !ratified,
    };
  }

  /**
   * Enforce a stage covenant for a pipeline step.
   * Returns pass/fail with specific covenant violations.
   */
  enforceCovenant(stageName: string, claim: ClaimRecord): { passed: boolean; violations: string[] } {
    const covenant = this.covenants.get(stageName);
    if (!covenant) return { passed: true, violations: [] };

    const violations: string[] = [];
    const claimMap = claim as unknown as Record<string, unknown>;

    for (const field of covenant.requiredFields) {
      const v = claimMap[field];
      if (!v || (typeof v === 'string' && v.trim().length === 0)) {
        violations.push(`Covenant violation: missing required field '${field}'`);
      }
    }

    if (claim.conviction < covenant.minimumConviction) {
      violations.push(
        `Conviction ${claim.conviction.toFixed(3)} below covenant minimum ${covenant.minimumConviction}`
      );
    }

    if (covenant.maxClaimLength && claim.claim.length > covenant.maxClaimLength) {
      violations.push(
        `Claim length ${claim.claim.length} exceeds covenant maximum ${covenant.maxClaimLength}`
      );
    }

    const passed = violations.length === 0;
    this.record('COVENANT_CHECK', { stageName, passed, violations, instanceId: claim.instanceId });
    return { passed, violations };
  }

  /**
   * Update the standing ledger after a resolution outcome is confirmed.
   * Pass `validated: true` if this instance's claim matched the ratified outcome.
   */
  updateStanding(roleToken: string, instanceId: string, validated: boolean): StandingRecord {
    const key = `${roleToken}::${instanceId}`;
    const current = this.standingLedger.get(key) ?? {
      roleToken, instanceId,
      participationCount: 0,
      validatedOutcomes: 0,
      calibrationIndex: 0.5,
      standingMultiplier: 1.0,
      updatedAt: new Date().toISOString(),
    };

    const updated: StandingRecord = {
      ...current,
      participationCount: current.participationCount + 1,
      validatedOutcomes: current.validatedOutcomes + (validated ? 1 : 0),
      updatedAt: new Date().toISOString(),
    };

    updated.calibrationIndex = updated.validatedOutcomes / updated.participationCount;
    // Standing multiplier: calibrated instances gain authority, uncalibrated lose it
    updated.standingMultiplier = Math.max(0.25, Math.min(2.0,
      0.5 + updated.calibrationIndex * 1.5
    ));

    this.standingLedger.set(key, updated);
    this.record('STANDING_UPDATE', {
      roleToken, instanceId,
      calibrationIndex: updated.calibrationIndex,
      standingMultiplier: updated.standingMultiplier,
    });
    return updated;
  }

  /** Look up the standing record for a specific instance */
  lookupStanding(roleToken: string, instanceId: string): StandingRecord | undefined {
    return this.standingLedger.get(`${roleToken}::${instanceId}`);
  }

  /** Return all standing records, sorted by calibration index descending */
  allStandings(): StandingRecord[] {
    return Array.from(this.standingLedger.values())
      .sort((a, b) => b.calibrationIndex - a.calibrationIndex);
  }

  /** Return the full sovereign log for audit */
  sovereignAuditLog(): Array<{ timestamp: string; event: string; record: unknown }> {
    return [...this.sovereignLog];
  }

  /** Return all registered council roles */
  councilRoles(): SovereignRole[] {
    return Array.from(this.council.values());
  }

  private record(event: string, record: unknown): void {
    this.sovereignLog.push({ timestamp: new Date().toISOString(), event, record });
  }
}

// ─── Standard Council Configuration ──────────────────────────────────────────

/**
 * Default five-role sovereign council.
 * Covers empirical analysis, strategic direction, adversarial review,
 * construction authority, and integrative synthesis.
 */
export const SOVEREIGN_COUNCIL_FIVE: SovereignRole[] = [
  {
    roleToken: 'ISS-ANALYST',
    designation: 'Sovereign Analyst',
    authorityDomains: ['empirical-claim', 'data-interpretation', 'verification'],
    standingWeight: 0.75,
    declaredScope: [],
  },
  {
    roleToken: 'ISS-STRATEGIST',
    designation: 'Sovereign Strategist',
    authorityDomains: ['strategic-direction', 'objective-setting', 'priority-order'],
    standingWeight: 0.80,
    declaredScope: [],
  },
  {
    roleToken: 'ISS-CRITIC',
    designation: 'Sovereign Critic',
    authorityDomains: ['risk-evaluation', 'flaw-detection', 'adversarial-challenge'],
    standingWeight: 0.75,
    declaredScope: ['risk-evaluation', 'flaw-detection', 'adversarial-challenge', 'quality-verdict'],
  },
  {
    roleToken: 'ISS-BUILDER',
    designation: 'Sovereign Builder',
    authorityDomains: ['construction-spec', 'technical-design', 'implementation-plan'],
    standingWeight: 0.75,
    declaredScope: [],
  },
  {
    roleToken: 'ISS-SYNTHESIZER',
    designation: 'Sovereign Synthesizer',
    authorityDomains: ['final-synthesis', 'cross-domain-integration', 'council-formation'],
    standingWeight: 0.90,
    declaredScope: [],
  },
];

/**
 * Create a SovereignCoordinator with the standard five-role council.
 */
export function createCouncilCoordinator(overrides?: Partial<CoordinatorOptions>): SovereignCoordinator {
  return new SovereignCoordinator({
    council: SOVEREIGN_COUNCIL_FIVE,
    ratificationThreshold: 0.72,
    authorityAmplifier: 2.0,
    enableStandingLedger: true,
    ...overrides,
  });
}

// ─── Legacy Compatibility Aliases ─────────────────────────────────────────────
// These aliases allow callers using the previous API names to continue working.

/** @deprecated Use SovereignRole */
export type AgentRole = SovereignRole;
/** @deprecated Use ClaimRecord */
export type AgentOutput = ClaimRecord;
/** @deprecated Use ResolutionRecord */
export type ConsensusResult = ResolutionRecord;
/** @deprecated Use StandingRecord */
export type ReputationRecord = StandingRecord;
/** @deprecated Use StageCovenant */
export type StageGate = StageCovenant;
/** @deprecated Use SovereignCoordinator */
export const IncentiveService = SovereignCoordinator;
/** @deprecated Use SOVEREIGN_COUNCIL_FIVE */
export const STANDARD_FIVE_ROLES = SOVEREIGN_COUNCIL_FIVE;
/** @deprecated Use createCouncilCoordinator */
export const createStandardService = createCouncilCoordinator;
