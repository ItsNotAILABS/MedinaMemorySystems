/**
 * Sub-SDK 10: Multi-AI Teams
 * ─────────────────────────────────────────────────────────────────────────────
 * Sovereign multi-AI team engine.
 *
 * Form teams of AI agents with distinct roles, Hz-tuned frequencies,
 * shared vaulted memory, callable assistants, structured debate, sequential
 * pipelines, pub/sub signals, weighted consensus, and full orchestration.
 *
 * Each role carries a Solfeggio-aligned frequency. When the right roles
 * are on the right tasks, the team resonates. When they're misaligned,
 * the ConsensusEngine catches it before it ships.
 *
 * Architecture:
 *   MultiAITeam         — the team itself (members, vault, signals, sessions)
 *   TeamSession         — a live, turn-by-turn run
 *   TeamDebate          — structured adversarial exchange between members
 *   TeamPipeline        — sequential stages with gated handoffs
 *   TeamVault           — tiered memory (PUBLIC / SHARED / PRIVATE / SOVEREIGN)
 *   TeamSignal          — pub/sub channel between members
 *   ConsensusEngine     — weighted voting by role with confidence decay
 *   TeamOrchestrator    — manages many teams, routes tasks, merges results
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── AI Models ────────────────────────────────────────────────────────────────

export type AIModel =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'claude-3-5-sonnet'
  | 'claude-3-opus'
  | 'claude-3-haiku'
  | 'gemini-pro'
  | 'gemini-flash'
  | 'llama-3'
  | 'mistral-large'
  | 'mistral-small'
  | 'custom';

// ─── Roles & Frequencies ─────────────────────────────────────────────────────

/**
 * Every role is tuned to a Solfeggio-aligned frequency.
 * The frequency governs the role's weight in consensus and its signal priority.
 *
 * SOVEREIGN  963 Hz — cosmic alignment, final authority
 * LEAD       852 Hz — order, coordination
 * SYNTHESIZER 741 Hz — expression, integration
 * CRITIC      639 Hz — connection, challenge
 * ANALYST     528 Hz — transformation, deep analysis
 * BUILDER     417 Hz — change, construction
 * RESEARCHER  396 Hz — liberation, discovery
 * MEMORY_CURATOR 432 Hz — grounding, persistence
 * DOMAIN_EXPERT  444 Hz — precision, depth
 * GUARDIAN    396 Hz — protection, validation
 */
export type TeamRole =
  | 'SOVEREIGN'       // Final authority — overrides all, sees all signals
  | 'LEAD'            // Coordinates the team, routes tasks, makes calls
  | 'ANALYST'         // Deep analysis, quantitative insight, pattern detection
  | 'BUILDER'         // Constructs outputs — code, documents, artifacts
  | 'CRITIC'          // Adversarial review — finds flaws before they ship
  | 'RESEARCHER'      // Context gathering, background intelligence
  | 'SYNTHESIZER'     // Combines all outputs into a coherent final result
  | 'MEMORY_CURATOR'  // Manages what the team remembers and forgets
  | 'DOMAIN_EXPERT'   // Deep specialist in a specific domain
  | 'GUARDIAN';       // Validates outputs, enforces standards, gates release

export const ROLE_FREQUENCIES: Record<TeamRole, number> = {
  SOVEREIGN:      963,
  LEAD:           852,
  SYNTHESIZER:    741,
  CRITIC:         639,
  ANALYST:        528,
  BUILDER:        417,
  RESEARCHER:     396,
  GUARDIAN:       444,
  MEMORY_CURATOR: 432,
  DOMAIN_EXPERT:  528,
};

/** Consensus weight per role — higher Hz = more authority in vote */
export const ROLE_CONSENSUS_WEIGHT: Record<TeamRole, number> = {
  SOVEREIGN:      1.0,
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

// ─── Core Types ───────────────────────────────────────────────────────────────

export type VaultTier = 'PUBLIC' | 'SHARED' | 'PRIVATE' | 'SOVEREIGN';
export type SignalType = 'BROADCAST' | 'DIRECT' | 'ROLE' | 'URGENT';
export type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
export type SessionStatus = 'OPEN' | 'RUNNING' | 'PAUSED' | 'COMPLETE' | 'FAILED';
export type PipelineStageStatus = 'WAITING' | 'RUNNING' | 'PASSED' | 'FAILED' | 'SKIPPED';

export interface MemberCapability {
  toolId: string;
  proficiency: number;  // 0–1
  callCount: number;
}

export interface AITeamMember {
  id: string;
  name: string;
  model: AIModel;
  role: TeamRole;
  frequency: number;     // Hz, from ROLE_FREQUENCIES
  systemPrompt?: string;
  tools: string[];
  capabilities: MemberCapability[];
  active: boolean;
  taskCount: number;
  successCount: number;
  lastActiveAt: number;
  tags: string[];
  handler?: (task: TeamTask) => Promise<TeamOutput>;
}

export interface TeamTask {
  id: string;
  title: string;
  description: string;
  input: unknown;
  assignedTo?: string;   // memberId, role type, or 'all'
  priority: TaskPriority;
  deadline?: number;
  context?: Record<string, unknown>;
  sessionId?: string;
}

export interface TeamOutput {
  taskId: string;
  memberId: string;
  role: TeamRole;
  model: AIModel;
  content: unknown;
  reasoning?: string;
  confidence: number;    // 0–1
  toolsUsed: string[];
  latencyMs: number;
  timestamp: number;
  frequency: number;
  sessionId?: string;
}

// ─── Team Vault ───────────────────────────────────────────────────────────────

export interface VaultEntry {
  key: string;
  value: unknown;
  tier: VaultTier;
  ownerId?: string;       // memberId for PRIVATE entries
  expiresAt?: number;     // undefined = permanent
  createdAt: number;
  accessCount: number;
  lastAccessedAt: number;
}

/**
 * Tiered memory store for a team.
 *
 * PUBLIC    — any member and any external caller can read
 * SHARED    — team members only
 * PRIVATE   — only the owning member can read
 * SOVEREIGN — only SOVEREIGN and LEAD roles can read
 */
export class TeamVault {
  private entries: Map<string, VaultEntry> = new Map();

  write(
    key: string,
    value: unknown,
    tier: VaultTier = 'SHARED',
    options: { ownerId?: string; ttlMs?: number } = {},
  ): VaultEntry {
    const entry: VaultEntry = {
      key,
      value,
      tier,
      ownerId: options.ownerId,
      expiresAt: options.ttlMs ? Date.now() + options.ttlMs : undefined,
      createdAt: Date.now(),
      accessCount: 0,
      lastAccessedAt: Date.now(),
    };
    this.entries.set(key, entry);
    return entry;
  }

  read(key: string, requesterId?: string, requesterRole?: TeamRole): unknown | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;

    // Expiry check
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.entries.delete(key);
      return undefined;
    }

    // Tier access control
    if (entry.tier === 'PRIVATE' && entry.ownerId && entry.ownerId !== requesterId) {
      return undefined;
    }
    if (entry.tier === 'SOVEREIGN') {
      if (requesterRole !== 'SOVEREIGN' && requesterRole !== 'LEAD') return undefined;
    }

    entry.accessCount += 1;
    entry.lastAccessedAt = Date.now();
    return entry.value;
  }

  /** List keys visible to a requester */
  list(requesterId?: string, requesterRole?: TeamRole): VaultEntry[] {
    const now = Date.now();
    return Array.from(this.entries.values()).filter(e => {
      if (e.expiresAt && now > e.expiresAt) return false;
      if (e.tier === 'PRIVATE' && e.ownerId && e.ownerId !== requesterId) return false;
      if (e.tier === 'SOVEREIGN' && requesterRole !== 'SOVEREIGN' && requesterRole !== 'LEAD') return false;
      return true;
    });
  }

  /** Evict all expired entries */
  evictExpired(): number {
    let count = 0;
    const now = Date.now();
    for (const [key, entry] of this.entries.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.entries.delete(key);
        count++;
      }
    }
    return count;
  }

  size(): number { return this.entries.size; }
}

// ─── Team Signal (pub/sub) ────────────────────────────────────────────────────

export interface TeamSignalMessage {
  id: string;
  type: SignalType;
  from: string;            // memberId
  to?: string;             // memberId for DIRECT, role for ROLE, undefined for BROADCAST
  subject: string;
  payload: unknown;
  timestamp: number;
  priority: TaskPriority;
  read: boolean;
}

type SignalHandler = (message: TeamSignalMessage) => void;

/**
 * Pub/sub signal bus for a team.
 * Members broadcast, send direct, or target a role.
 * URGENT signals fire handlers immediately.
 */
export class TeamSignalBus {
  private messages: TeamSignalMessage[] = [];
  private handlers: Map<string, SignalHandler[]> = new Map();  // memberId -> handlers

  /** Send a signal */
  emit(
    from: string,
    subject: string,
    payload: unknown,
    options: { type?: SignalType; to?: string; priority?: TaskPriority } = {},
  ): TeamSignalMessage {
    const msg: TeamSignalMessage = {
      id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: options.type ?? 'BROADCAST',
      from,
      to: options.to,
      subject,
      payload,
      timestamp: Date.now(),
      priority: options.priority ?? 'NORMAL',
      read: false,
    };
    this.messages.push(msg);

    // Fire handlers for URGENT immediately
    if (msg.priority === 'CRITICAL' || msg.type === 'URGENT') {
      this.deliverToHandlers(msg);
    }

    return msg;
  }

  /** Subscribe a member to incoming signals */
  subscribe(memberId: string, handler: SignalHandler): void {
    if (!this.handlers.has(memberId)) this.handlers.set(memberId, []);
    this.handlers.get(memberId)!.push(handler);
  }

  /** Get unread messages for a member */
  inbox(memberId: string, memberRole?: TeamRole): TeamSignalMessage[] {
    return this.messages.filter(m => {
      if (m.read) return false;
      if (m.type === 'BROADCAST') return true;
      if (m.type === 'DIRECT') return m.to === memberId;
      if (m.type === 'ROLE') return m.to === memberRole;
      if (m.type === 'URGENT') return true;
      return false;
    });
  }

  /** Mark messages as read for a member */
  markRead(memberId: string): void {
    for (const msg of this.messages) {
      if (msg.to === memberId || msg.type === 'BROADCAST') msg.read = true;
    }
  }

  private deliverToHandlers(msg: TeamSignalMessage): void {
    for (const [, handlers] of this.handlers.entries()) {
      for (const handler of handlers) {
        try { handler(msg); } catch { /* handler errors are isolated */ }
      }
    }
  }

  /** Get all messages, newest first */
  all(): TeamSignalMessage[] {
    return [...this.messages].sort((a, b) => b.timestamp - a.timestamp);
  }
}

// ─── Team Session ─────────────────────────────────────────────────────────────

export interface SessionTurn {
  turn: number;
  memberId: string;
  role: TeamRole;
  input: unknown;
  output: TeamOutput;
  timestamp: number;
}

export interface TeamSession {
  id: string;
  teamId: string;
  title: string;
  status: SessionStatus;
  turns: SessionTurn[];
  outputs: TeamOutput[];
  startedAt: number;
  completedAt?: number;
  goal: string;
  context: Record<string, unknown>;
}

// ─── Team Debate ──────────────────────────────────────────────────────────────

export interface DebatePosition {
  memberId: string;
  role: TeamRole;
  position: string;
  arguments: string[];
  confidence: number;
  round: number;
}

export interface DebateRound {
  round: number;
  positions: DebatePosition[];
  timestamp: number;
}

export interface TeamDebate {
  id: string;
  sessionId: string;
  topic: string;
  rounds: DebateRound[];
  resolution?: string;
  resolvedBy?: string;
  complete: boolean;
  startedAt: number;
  completedAt?: number;
}

// ─── Team Pipeline ────────────────────────────────────────────────────────────

export interface PipelineStage {
  id: string;
  name: string;
  assignedRole: TeamRole;
  assignedMemberId?: string;
  input?: unknown;
  output?: TeamOutput;
  status: PipelineStageStatus;
  requiredConfidence: number;  // output must meet this to pass gate
  startedAt?: number;
  completedAt?: number;
  gateCheck?: (output: TeamOutput) => boolean;
}

export interface TeamPipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  currentStageIndex: number;
  status: SessionStatus;
  startedAt: number;
  completedAt?: number;
}

// ─── Consensus Engine ─────────────────────────────────────────────────────────

export interface ConsensusVote {
  memberId: string;
  role: TeamRole;
  vote: 'APPROVE' | 'REJECT' | 'ABSTAIN';
  confidence: number;
  reasoning?: string;
  weight: number;       // from ROLE_CONSENSUS_WEIGHT
  weightedScore: number;
}

export interface ConsensusResult {
  taskId: string;
  votes: ConsensusVote[];
  approved: boolean;
  totalWeight: number;
  approveWeight: number;
  rejectWeight: number;
  threshold: number;
  confidence: number;
  dominantOutput?: TeamOutput;
  synthesis?: unknown;
  dissent: ConsensusVote[];
  timestamp: number;
}

/**
 * Weighted consensus engine.
 * Votes are weighted by role frequency and adjusted by confidence.
 * Sovereign role can veto (approve=false overrides all others).
 */
export class ConsensusEngine {
  private threshold: number;

  constructor(options: { threshold?: number } = {}) {
    this.threshold = options.threshold ?? 0.6;  // 60% weighted approval to pass
  }

  /**
   * Run consensus over a set of team outputs.
   * Each output represents a member's vote on the task.
   */
  resolve(
    taskId: string,
    outputs: TeamOutput[],
    options: { threshold?: number } = {},
  ): ConsensusResult {
    const threshold = options.threshold ?? this.threshold;
    const votes: ConsensusVote[] = [];
    let totalWeight = 0;
    let approveWeight = 0;
    let rejectWeight = 0;

    for (const output of outputs) {
      const weight = ROLE_CONSENSUS_WEIGHT[output.role] ?? 0.5;
      // Confidence below 0.4 = implicit rejection
      const vote: ConsensusVote['vote'] =
        output.confidence >= 0.7 ? 'APPROVE'
        : output.confidence >= 0.4 ? 'APPROVE'
        : 'REJECT';

      const weightedScore = weight * output.confidence;

      votes.push({
        memberId: output.memberId,
        role: output.role,
        vote,
        confidence: output.confidence,
        reasoning: output.reasoning,
        weight,
        weightedScore,
      });

      totalWeight += weight;
      if (vote === 'APPROVE') approveWeight += weightedScore;
      else if (vote === 'REJECT') rejectWeight += weightedScore;
    }

    // Sovereign veto: if SOVEREIGN voted REJECT, it overrides everything
    const sovereignVote = votes.find(v => v.role === 'SOVEREIGN');
    const vetoed = sovereignVote?.vote === 'REJECT';

    const approvalRatio = totalWeight > 0 ? approveWeight / totalWeight : 0;
    const approved = !vetoed && approvalRatio >= threshold;

    // Best output: highest weighted score from SYNTHESIZER, else LEAD, else highest confidence
    const sortedOutputs = [...outputs].sort((a, b) => {
      if (a.role === 'SYNTHESIZER') return -1;
      if (b.role === 'SYNTHESIZER') return 1;
      if (a.role === 'LEAD') return -1;
      if (b.role === 'LEAD') return 1;
      return b.confidence - a.confidence;
    });

    const synthesizerOutput = outputs.find(o => o.role === 'SYNTHESIZER');
    const synthesis = synthesizerOutput?.content ?? sortedOutputs[0]?.content ?? null;

    return {
      taskId,
      votes,
      approved,
      totalWeight,
      approveWeight,
      rejectWeight,
      threshold,
      confidence: approvalRatio,
      dominantOutput: sortedOutputs[0],
      synthesis,
      dissent: votes.filter(v => v.vote === 'REJECT'),
      timestamp: Date.now(),
    };
  }

  /**
   * Quick majority vote — ignores weights, pure count.
   */
  majority(outputs: TeamOutput[]): boolean {
    const approve = outputs.filter(o => o.confidence >= 0.5).length;
    return approve > outputs.length / 2;
  }
}

// ─── MultiAITeam ──────────────────────────────────────────────────────────────

/**
 * A sovereign multi-AI team.
 *
 * @example
 * ```typescript
 * const team = new MultiAITeam('team-001', 'Strategy Alpha', 'Strategic planning team');
 *
 * team.addMember('sovereign', 'Sovereign', 'claude-3-opus', 'SOVEREIGN');
 * team.addMember('lead', 'Lead', 'claude-3-5-sonnet', 'LEAD');
 * team.addMember('analyst', 'Analyst', 'gpt-4o', 'ANALYST');
 * team.addMember('critic', 'Critic', 'claude-3-opus', 'CRITIC');
 * team.addMember('synthesizer', 'Synthesizer', 'claude-3-5-sonnet', 'SYNTHESIZER');
 *
 * const session = team.openSession('Evaluate Q2 strategy', { quarter: 'Q2' });
 *
 * // Submit outputs as your AI calls return
 * team.submitOutput('analyst', session.id, 'task-001', { analysis: '...' }, 'reason', 0.88);
 * team.submitOutput('critic', session.id, 'task-001', { critique: '...' }, 'reason', 0.76);
 * team.submitOutput('synthesizer', session.id, 'task-001', { final: '...' }, 'reason', 0.91);
 *
 * const consensus = team.consensus.resolve('task-001', team.getOutputs(session.id));
 * ```
 */
export class MultiAITeam {
  private members: Map<string, AITeamMember> = new Map();
  private sessions: Map<string, TeamSession> = new Map();
  private debates: Map<string, TeamDebate> = new Map();
  private pipelines: Map<string, TeamPipeline> = new Map();
  private outputs: TeamOutput[] = [];

  public readonly vault: TeamVault;
  public readonly signals: TeamSignalBus;
  public readonly consensus: ConsensusEngine;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    options: { consensusThreshold?: number } = {},
  ) {
    this.vault = new TeamVault();
    this.signals = new TeamSignalBus();
    this.consensus = new ConsensusEngine({ threshold: options.consensusThreshold ?? 0.6 });
  }

  // ─── Members ──────────────────────────────────────────────────────────────

  addMember(
    id: string,
    name: string,
    model: AIModel,
    role: TeamRole,
    options: {
      systemPrompt?: string;
      tools?: string[];
      tags?: string[];
      handler?: AITeamMember['handler'];
    } = {},
  ): AITeamMember {
    const member: AITeamMember = {
      id,
      name,
      model,
      role,
      frequency: ROLE_FREQUENCIES[role],
      systemPrompt: options.systemPrompt,
      tools: options.tools ?? [],
      capabilities: [],
      active: true,
      taskCount: 0,
      successCount: 0,
      lastActiveAt: Date.now(),
      tags: options.tags ?? [],
      handler: options.handler,
    };
    this.members.set(id, member);
    return member;
  }

  removeMember(id: string): boolean {
    return this.members.delete(id);
  }

  setMemberActive(id: string, active: boolean): void {
    const m = this.members.get(id);
    if (m) m.active = active;
  }

  getMember(id: string): AITeamMember | undefined { return this.members.get(id); }
  getLead(): AITeamMember | undefined { return this.getMemberByRole('LEAD'); }
  getSovereign(): AITeamMember | undefined { return this.getMemberByRole('SOVEREIGN'); }

  getMemberByRole(role: TeamRole): AITeamMember | undefined {
    return Array.from(this.members.values()).find(m => m.role === role && m.active);
  }

  listMembers(activeOnly = false): AITeamMember[] {
    const all = Array.from(this.members.values());
    return activeOnly ? all.filter(m => m.active) : all;
  }

  // ─── Vault (shared memory) ────────────────────────────────────────────────

  remember(
    key: string,
    value: unknown,
    tier: VaultTier = 'SHARED',
    options: { ownerId?: string; ttlMs?: number } = {},
  ): VaultEntry {
    return this.vault.write(key, value, tier, options);
  }

  recall(key: string, requesterId?: string): unknown | undefined {
    const member = requesterId ? this.members.get(requesterId) : undefined;
    return this.vault.read(key, requesterId, member?.role);
  }

  // ─── Sessions ─────────────────────────────────────────────────────────────

  openSession(goal: string, context: Record<string, unknown> = {}): TeamSession {
    const session: TeamSession = {
      id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      teamId: this.id,
      title: goal,
      status: 'OPEN',
      turns: [],
      outputs: [],
      startedAt: Date.now(),
      goal,
      context,
    };
    this.sessions.set(session.id, session);
    return session;
  }

  closeSession(sessionId: string, status: 'COMPLETE' | 'FAILED' = 'COMPLETE'): TeamSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    session.status = status;
    session.completedAt = Date.now();
    return session;
  }

  getSession(sessionId: string): TeamSession | undefined {
    return this.sessions.get(sessionId);
  }

  // ─── Outputs ──────────────────────────────────────────────────────────────

  submitOutput(
    memberId: string,
    sessionId: string,
    taskId: string,
    content: unknown,
    reasoning?: string,
    confidence = 0.8,
    toolsUsed: string[] = [],
  ): TeamOutput {
    const member = this.members.get(memberId);
    if (!member) throw new Error(`Member "${memberId}" not found.`);

    const output: TeamOutput = {
      taskId,
      memberId,
      role: member.role,
      model: member.model,
      content,
      reasoning,
      confidence,
      toolsUsed,
      latencyMs: 0,
      timestamp: Date.now(),
      frequency: member.frequency,
      sessionId,
    };

    member.taskCount += 1;
    if (confidence >= 0.6) member.successCount += 1;
    member.lastActiveAt = Date.now();
    this.outputs.push(output);

    const session = this.sessions.get(sessionId);
    if (session) {
      session.outputs.push(output);
      session.turns.push({
        turn: session.turns.length + 1,
        memberId,
        role: member.role,
        input: { taskId },
        output,
        timestamp: Date.now(),
      });
    }

    // Broadcast output signal to team
    this.signals.emit(memberId, `output:${taskId}`, { confidence, role: member.role }, {
      type: 'BROADCAST',
      priority: confidence < 0.5 ? 'HIGH' : 'NORMAL',
    });

    return output;
  }

  getOutputs(sessionId?: string, taskId?: string): TeamOutput[] {
    return this.outputs.filter(o =>
      (!sessionId || o.sessionId === sessionId) &&
      (!taskId || o.taskId === taskId),
    );
  }

  // ─── Debate ───────────────────────────────────────────────────────────────

  /**
   * Open a structured debate between team members on a topic.
   * Each member submits a position; rounds continue until resolved.
   */
  openDebate(topic: string, sessionId: string): TeamDebate {
    const debate: TeamDebate = {
      id: `debate_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      sessionId,
      topic,
      rounds: [],
      complete: false,
      startedAt: Date.now(),
    };
    this.debates.set(debate.id, debate);

    this.signals.emit('system', `debate:open:${debate.id}`, { topic }, {
      type: 'BROADCAST',
      priority: 'HIGH',
    });

    return debate;
  }

  submitDebatePosition(
    debateId: string,
    memberId: string,
    position: string,
    args: string[],
    confidence: number,
  ): void {
    const debate = this.debates.get(debateId);
    const member = this.members.get(memberId);
    if (!debate || !member) return;

    let currentRound = debate.rounds[debate.rounds.length - 1];
    if (!currentRound || currentRound.positions.length >= this.members.size) {
      currentRound = { round: debate.rounds.length + 1, positions: [], timestamp: Date.now() };
      debate.rounds.push(currentRound);
    }

    currentRound.positions.push({
      memberId,
      role: member.role,
      position,
      arguments: args,
      confidence,
      round: currentRound.round,
    });
  }

  resolveDebate(debateId: string, resolution: string, resolvedById: string): TeamDebate | null {
    const debate = this.debates.get(debateId);
    if (!debate) return null;
    debate.resolution = resolution;
    debate.resolvedBy = resolvedById;
    debate.complete = true;
    debate.completedAt = Date.now();

    this.vault.write(`debate:${debateId}:resolution`, resolution, 'SHARED');

    this.signals.emit(resolvedById, `debate:resolved:${debateId}`, { resolution }, {
      type: 'BROADCAST',
      priority: 'NORMAL',
    });

    return debate;
  }

  getDebate(debateId: string): TeamDebate | undefined {
    return this.debates.get(debateId);
  }

  // ─── Pipeline ─────────────────────────────────────────────────────────────

  /**
   * Create a sequential pipeline — each stage must pass its gate before the next runs.
   */
  createPipeline(
    name: string,
    stages: Array<{
      id: string;
      name: string;
      assignedRole: TeamRole;
      assignedMemberId?: string;
      requiredConfidence?: number;
      gateCheck?: PipelineStage['gateCheck'];
    }>,
  ): TeamPipeline {
    const pipeline: TeamPipeline = {
      id: `pipe_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name,
      currentStageIndex: 0,
      status: 'OPEN',
      startedAt: Date.now(),
      stages: stages.map(s => ({
        ...s,
        requiredConfidence: s.requiredConfidence ?? 0.6,
        status: 'WAITING',
      })),
    };
    this.pipelines.set(pipeline.id, pipeline);
    return pipeline;
  }

  /**
   * Advance a pipeline by submitting the output for the current stage.
   * Returns the next stage or null if complete.
   */
  advancePipeline(pipelineId: string, output: TeamOutput): {
    passed: boolean;
    nextStage: PipelineStage | null;
    gateFailReason?: string;
  } {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline || pipeline.status === 'COMPLETE' || pipeline.status === 'FAILED') {
      return { passed: false, nextStage: null, gateFailReason: 'Pipeline not active.' };
    }

    const stage = pipeline.stages[pipeline.currentStageIndex];
    if (!stage) return { passed: false, nextStage: null };

    stage.output = output;
    stage.completedAt = Date.now();

    // Gate check: confidence threshold
    const meetsConfidence = output.confidence >= stage.requiredConfidence;
    const passesCustomGate = stage.gateCheck ? stage.gateCheck(output) : true;
    const passed = meetsConfidence && passesCustomGate;

    if (passed) {
      stage.status = 'PASSED';
      pipeline.currentStageIndex += 1;

      if (pipeline.currentStageIndex >= pipeline.stages.length) {
        pipeline.status = 'COMPLETE';
        pipeline.completedAt = Date.now();
        return { passed: true, nextStage: null };
      }

      const nextStage = pipeline.stages[pipeline.currentStageIndex];
      nextStage.status = 'RUNNING';
      nextStage.startedAt = Date.now();
      nextStage.input = output.content;

      return { passed: true, nextStage };
    } else {
      stage.status = 'FAILED';
      pipeline.status = 'FAILED';
      pipeline.completedAt = Date.now();

      const reason = !meetsConfidence
        ? `Confidence ${output.confidence.toFixed(2)} below required ${stage.requiredConfidence}`
        : 'Custom gate check failed.';

      this.signals.emit('system', `pipeline:failed:${pipelineId}`, { stage: stage.name, reason }, {
        type: 'URGENT',
        priority: 'CRITICAL',
      });

      return { passed: false, nextStage: null, gateFailReason: reason };
    }
  }

  getPipeline(id: string): TeamPipeline | undefined { return this.pipelines.get(id); }

  // ─── Callable Assistants (LLM function-call format) ───────────────────────

  /**
   * Describe the team's active members as callable functions.
   * Feed this directly into your LLM's `functions` / `tools` parameter.
   */
  describeAssistants(options: { includeSystemPrompt?: boolean } = {}): Array<{
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, { type: string; description: string }>;
      required: string[];
    };
    _meta: { memberId: string; role: TeamRole; model: AIModel; frequency: number };
  }> {
    return Array.from(this.members.values())
      .filter(m => m.active)
      .map(m => ({
        name: `call_${m.id}`,
        description: [
          `${m.name} — ${m.role} (${m.model}, ${m.frequency} Hz).`,
          options.includeSystemPrompt && m.systemPrompt ? m.systemPrompt : '',
          m.tools.length > 0 ? `Has access to tools: ${m.tools.join(', ')}.` : '',
        ].filter(Boolean).join(' '),
        parameters: {
          type: 'object' as const,
          properties: {
            task: { type: 'string', description: 'The task or question for this assistant.' },
            context: { type: 'string', description: 'Optional context or background.' },
            priority: { type: 'string', description: 'Task priority: LOW, NORMAL, HIGH, CRITICAL.' },
          },
          required: ['task'],
        },
        _meta: { memberId: m.id, role: m.role, model: m.model, frequency: m.frequency },
      }));
  }

  /**
   * Invoke a member's handler directly (if registered).
   */
  async invoke(memberId: string, task: TeamTask): Promise<TeamOutput> {
    const member = this.members.get(memberId);
    if (!member) throw new Error(`Member "${memberId}" not found.`);
    if (!member.active) throw new Error(`Member "${memberId}" is inactive.`);

    const start = Date.now();

    if (member.handler) {
      const output = await member.handler(task);
      output.latencyMs = Date.now() - start;
      output.memberId = memberId;
      output.role = member.role;
      output.model = member.model;
      output.frequency = member.frequency;
      this.outputs.push(output);
      member.taskCount += 1;
      member.lastActiveAt = Date.now();
      return output;
    }

    // No handler — return a stub output
    const output: TeamOutput = {
      taskId: task.id,
      memberId,
      role: member.role,
      model: member.model,
      content: {
        message: `${member.name} (${member.role}) received: "${task.description}"`,
        input: task.input,
      },
      toolsUsed: [],
      confidence: 0.5,
      latencyMs: Date.now() - start,
      timestamp: Date.now(),
      frequency: member.frequency,
      sessionId: task.sessionId,
    };

    this.outputs.push(output);
    member.taskCount += 1;
    member.lastActiveAt = Date.now();
    return output;
  }

  // ─── Stats ────────────────────────────────────────────────────────────────

  stats(): {
    teamId: string;
    name: string;
    members: number;
    activeMembers: number;
    totalOutputs: number;
    sessions: number;
    debates: number;
    pipelines: number;
    vaultSize: number;
    averageConfidence: number;
    roleDistribution: Record<string, number>;
  } {
    const all = Array.from(this.members.values());
    const avgConf = this.outputs.length > 0
      ? this.outputs.reduce((s, o) => s + o.confidence, 0) / this.outputs.length
      : 0;

    const roleDistribution: Record<string, number> = {};
    for (const m of all) {
      roleDistribution[m.role] = (roleDistribution[m.role] ?? 0) + 1;
    }

    return {
      teamId: this.id,
      name: this.name,
      members: all.length,
      activeMembers: all.filter(m => m.active).length,
      totalOutputs: this.outputs.length,
      sessions: this.sessions.size,
      debates: this.debates.size,
      pipelines: this.pipelines.size,
      vaultSize: this.vault.size(),
      averageConfidence: Math.round(avgConf * 1000) / 1000,
      roleDistribution,
    };
  }
}

// ─── Team Orchestrator ────────────────────────────────────────────────────────

export interface OrchestratorRoute {
  teamId: string;
  taskId: string;
  reason: string;
  timestamp: number;
}

export interface MergedResult {
  sourceTeams: string[];
  outputs: TeamOutput[];
  consensus: ConsensusResult;
  synthesis: unknown;
  timestamp: number;
}

/**
 * Manages multiple teams.
 * Routes tasks to the right team, merges outputs across teams,
 * and coordinates cross-team signals.
 */
export class TeamOrchestrator {
  private teams: Map<string, MultiAITeam> = new Map();
  private routes: OrchestratorRoute[] = [];
  private engine: ConsensusEngine;

  constructor(options: { consensusThreshold?: number } = {}) {
    this.engine = new ConsensusEngine({ threshold: options.consensusThreshold ?? 0.6 });
  }

  register(team: MultiAITeam): void {
    this.teams.set(team.id, team);
  }

  unregister(teamId: string): boolean {
    return this.teams.delete(teamId);
  }

  getTeam(teamId: string): MultiAITeam | undefined {
    return this.teams.get(teamId);
  }

  listTeams(): MultiAITeam[] {
    return Array.from(this.teams.values());
  }

  /**
   * Route a task to a specific team.
   */
  route(teamId: string, task: TeamTask, reason = ''): OrchestratorRoute {
    const record: OrchestratorRoute = { teamId, taskId: task.id, reason, timestamp: Date.now() };
    this.routes.push(record);
    return record;
  }

  /**
   * Route a task to the best team for a given role requirement.
   * Picks the team that has an active member with that role.
   */
  routeByRole(role: TeamRole, task: TeamTask): { team: MultiAITeam; route: OrchestratorRoute } | null {
    for (const team of this.teams.values()) {
      const hasMember = team.listMembers(true).some(m => m.role === role);
      if (hasMember) {
        const route = this.route(team.id, task, `Routed by role: ${role}`);
        return { team, route };
      }
    }
    return null;
  }

  /**
   * Broadcast a task across all teams and collect all outputs.
   */
  async broadcastAll(task: TeamTask): Promise<{ teamId: string; outputs: TeamOutput[] }[]> {
    const results: { teamId: string; outputs: TeamOutput[] }[] = [];

    for (const team of this.teams.values()) {
      const activeMembers = team.listMembers(true);
      const teamOutputs: TeamOutput[] = [];

      for (const member of activeMembers) {
        try {
          const output = await team.invoke(member.id, { ...task, assignedTo: member.id });
          teamOutputs.push(output);
        } catch { /* member invocation failures are isolated */ }
      }

      results.push({ teamId: team.id, outputs: teamOutputs });
    }

    return results;
  }

  /**
   * Merge outputs from multiple teams into a single consensus result.
   */
  merge(teamOutputSets: { teamId: string; outputs: TeamOutput[] }[], taskId: string): MergedResult {
    const allOutputs = teamOutputSets.flatMap(t => t.outputs);
    const consensus = this.engine.resolve(taskId, allOutputs);

    return {
      sourceTeams: teamOutputSets.map(t => t.teamId),
      outputs: allOutputs,
      consensus,
      synthesis: consensus.synthesis,
      timestamp: Date.now(),
    };
  }

  /**
   * Orchestrator-level stats.
   */
  stats(): {
    teamCount: number;
    totalMembers: number;
    totalOutputs: number;
    routes: number;
  } {
    let totalMembers = 0;
    let totalOutputs = 0;
    for (const team of this.teams.values()) {
      const s = team.stats();
      totalMembers += s.members;
      totalOutputs += s.totalOutputs;
    }
    return { teamCount: this.teams.size, totalMembers, totalOutputs, routes: this.routes.length };
  }
}

// ─── Factory Presets ──────────────────────────────────────────────────────────

/**
 * Research team: sovereign + lead + analyst + researcher + critic + synthesizer
 */
export function createResearchTeam(id: string, name: string): MultiAITeam {
  const team = new MultiAITeam(id, name, 'Deep research team — analyst-first, always validated.');
  team.addMember('sovereign', 'Sovereign', 'claude-3-opus', 'SOVEREIGN', {
    systemPrompt: 'You hold final authority. You read every output before it ships.',
  });
  team.addMember('lead', 'Research Lead', 'claude-3-5-sonnet', 'LEAD', {
    systemPrompt: 'You coordinate the research, assign tasks, and synthesize the final brief.',
  });
  team.addMember('analyst', 'Data Analyst', 'gpt-4o', 'ANALYST', {
    systemPrompt: 'You analyze data, find patterns, produce quantitative insights.',
  });
  team.addMember('researcher', 'Context Researcher', 'gemini-pro', 'RESEARCHER', {
    systemPrompt: 'You gather background context and relevant external information.',
  });
  team.addMember('critic', 'Critical Reviewer', 'claude-3-5-sonnet', 'CRITIC', {
    systemPrompt: 'You challenge every output. Find the flaw before it ships.',
  });
  team.addMember('synthesizer', 'Research Synthesizer', 'claude-3-opus', 'SYNTHESIZER', {
    systemPrompt: 'You combine all research outputs into a clean, complete final result.',
  });
  return team;
}

/**
 * Builder team: sovereign + lead + 2 builders + critic + guardian + synthesizer
 */
export function createBuilderTeam(id: string, name: string): MultiAITeam {
  const team = new MultiAITeam(id, name, 'Build team — two builders, one critic, one guardian.');
  team.addMember('sovereign', 'Sovereign', 'claude-3-opus', 'SOVEREIGN');
  team.addMember('lead', 'Build Lead', 'claude-3-opus', 'LEAD', {
    systemPrompt: 'You architect the solution, break it into pieces, and coordinate the builders.',
  });
  team.addMember('builder-1', 'Primary Builder', 'gpt-4o', 'BUILDER', {
    systemPrompt: 'You build the primary implementation.',
  });
  team.addMember('builder-2', 'Secondary Builder', 'claude-3-5-sonnet', 'BUILDER', {
    systemPrompt: 'You build secondary systems and handle integration.',
  });
  team.addMember('critic', 'Code Reviewer', 'claude-3-opus', 'CRITIC', {
    systemPrompt: 'You review all code for correctness, security, and quality.',
  });
  team.addMember('guardian', 'Release Guardian', 'claude-3-5-sonnet', 'GUARDIAN', {
    systemPrompt: 'You gate the release. Nothing ships without your approval.',
  });
  team.addMember('synthesizer', 'Integration Agent', 'claude-3-5-sonnet', 'SYNTHESIZER', {
    systemPrompt: 'You combine all builder outputs into the final integrated result.',
  });
  return team;
}

/**
 * Strategy team: sovereign + lead + analyst + domain expert + critic + synthesizer
 */
export function createStrategyTeam(id: string, name: string, domain?: string): MultiAITeam {
  const team = new MultiAITeam(id, name, `Strategy team for ${domain ?? 'general'} decisions.`);
  team.addMember('sovereign', 'Sovereign', 'claude-3-opus', 'SOVEREIGN');
  team.addMember('lead', 'Strategy Lead', 'claude-3-5-sonnet', 'LEAD');
  team.addMember('analyst', 'Strategic Analyst', 'gpt-4o', 'ANALYST', {
    systemPrompt: 'You produce quantitative and qualitative strategic analysis.',
  });
  team.addMember('domain', `${domain ?? 'Domain'} Expert`, 'claude-3-opus', 'DOMAIN_EXPERT', {
    systemPrompt: `You are the domain expert in ${domain ?? 'this field'}. Your input is the ground truth.`,
    tags: domain ? [domain] : [],
  });
  team.addMember('critic', 'Devil\'s Advocate', 'claude-3-5-sonnet', 'CRITIC', {
    systemPrompt: 'You argue the opposite position. Make the team prove themselves.',
  });
  team.addMember('synthesizer', 'Decision Synthesizer', 'claude-3-opus', 'SYNTHESIZER', {
    systemPrompt: 'You synthesize all inputs into a clear, actionable decision with rationale.',
  });
  return team;
}

/**
 * Defense team: sovereign + guardian + 2 analysts + critic + memory curator
 * Used for auditing, security review, compliance, threat analysis.
 */
export function createDefenseTeam(id: string, name: string): MultiAITeam {
  const team = new MultiAITeam(id, name, 'Defense team — audit, security, compliance.');
  team.addMember('sovereign', 'Sovereign', 'claude-3-opus', 'SOVEREIGN', {
    systemPrompt: 'You hold veto power on all security and compliance decisions.',
  });
  team.addMember('guardian-1', 'Primary Guardian', 'claude-3-opus', 'GUARDIAN', {
    systemPrompt: 'You gate every output. Nothing passes without meeting the standard.',
  });
  team.addMember('guardian-2', 'Secondary Guardian', 'claude-3-5-sonnet', 'GUARDIAN', {
    systemPrompt: 'You are the second gate. Independence from guardian-1 is your value.',
  });
  team.addMember('threat-analyst', 'Threat Analyst', 'gpt-4o', 'ANALYST', {
    systemPrompt: 'You identify threats, vulnerabilities, and attack vectors.',
  });
  team.addMember('compliance-analyst', 'Compliance Analyst', 'claude-3-5-sonnet', 'ANALYST', {
    systemPrompt: 'You verify compliance with standards, policies, and legal requirements.',
  });
  team.addMember('critic', 'Adversarial Critic', 'claude-3-opus', 'CRITIC', {
    systemPrompt: 'You are the attacker. Find every weakness before the real one does.',
  });
  team.addMember('memory', 'Incident Memory Curator', 'gemini-pro', 'MEMORY_CURATOR', {
    systemPrompt: 'You record all findings and build institutional memory of incidents.',
  });
  return team;
}

/**
 * Full-stack team: all 10 roles, one per.
 */
export function createFullStackTeam(id: string, name: string): MultiAITeam {
  const team = new MultiAITeam(id, name, 'Full-stack team — every role active.');
  team.addMember('sovereign',  'Sovereign',       'claude-3-opus',     'SOVEREIGN');
  team.addMember('lead',       'Lead',             'claude-3-5-sonnet', 'LEAD');
  team.addMember('analyst',    'Analyst',          'gpt-4o',            'ANALYST');
  team.addMember('builder',    'Builder',          'gpt-4o',            'BUILDER');
  team.addMember('critic',     'Critic',           'claude-3-opus',     'CRITIC');
  team.addMember('researcher', 'Researcher',       'gemini-pro',        'RESEARCHER');
  team.addMember('synthesizer','Synthesizer',      'claude-3-opus',     'SYNTHESIZER');
  team.addMember('curator',    'Memory Curator',   'gemini-pro',        'MEMORY_CURATOR');
  team.addMember('expert',     'Domain Expert',    'claude-3-5-sonnet', 'DOMAIN_EXPERT');
  team.addMember('guardian',   'Guardian',         'claude-3-opus',     'GUARDIAN');
  return team;
}
