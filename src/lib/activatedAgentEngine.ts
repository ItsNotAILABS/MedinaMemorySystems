/**
 * ACTIVATED AGENT ENGINE
 *
 * Callable cognitive infrastructure layer.
 *
 * Core surface:
 *   activate_agents      — recruit specialized reasoning modes for a task
 *   select_agent_set     — choose agents by task class / domain
 *   retrieve_vault_objects  — pull prior operating objects from vault
 *   retrieve_doctrine_rules — pull governing laws from doctrine layer
 *   arbitrate            — resolve across competing agent perspectives
 *   compose_answer       — compress arbitrated state into decision-grade form
 *   promote_if_reusable  — push strong outputs back into the vault
 *   log_drift_and_update_policy — audit drift events
 *
 * Every session is written to an in-memory journal stream.
 */

import { sovereignId } from './sovereign-id';
import { queryMemory, storeMemory } from './memoryEngine';
import { invokeModel } from './modelRouter';
import type {
  ModelFamily,
  AgentJournalEntry,
  AgentJournalPhase,
  AgentOutput,
  ActivatedAgentSession,
  AgentActivationRequest,
  MemoryEntry,
} from '@/types';

// ─── Session Store ───────────────────────────────────────────────────────────

const sessions: Map<string, ActivatedAgentSession> = new Map();

// ─── Agent Registry ───────────────────────────────────────────────────────────

export const AGENT_REGISTRY: ModelFamily[] = [
  'strategist',
  'builder',
  'analyst',
  'governance',
  'memory-curator',
  'operations',
  'risk',
  'projection',
];

// Task class → preferred agent sets
const TASK_CLASS_MAP: Record<string, ModelFamily[]> = {
  strategy:    ['strategist', 'analyst', 'projection'],
  build:       ['builder', 'operations', 'analyst'],
  governance:  ['governance', 'strategist', 'risk'],
  memory:      ['memory-curator', 'analyst', 'strategist'],
  risk:        ['risk', 'governance', 'analyst'],
  operations:  ['operations', 'builder', 'risk'],
  research:    ['analyst', 'strategist', 'projection'],
  default:     ['strategist', 'analyst', 'governance'],
};

const TASK_KEYWORDS: Record<string, string[]> = {
  strategy:   ['strategy', 'plan', 'vision', 'direction', 'macro', 'decide', 'roadmap'],
  build:      ['build', 'create', 'implement', 'code', 'design', 'construct', 'develop'],
  governance: ['govern', 'policy', 'doctrine', 'proposal', 'vote', 'audit', 'compliance'],
  memory:     ['memory', 'remember', 'recall', 'store', 'retrieve', 'vault', 'lineage'],
  risk:       ['risk', 'threat', 'danger', 'vulnerability', 'secure', 'gate', 'anomaly'],
  operations: ['operate', 'workflow', 'execute', 'task', 'run', 'process', 'manage'],
  research:   ['analyze', 'research', 'study', 'pattern', 'insight', 'data', 'trend'],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function detectTaskClass(task: string): string {
  const lower = task.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [cls, keywords] of Object.entries(TASK_KEYWORDS)) {
    scores[cls] = keywords.filter((kw) => lower.includes(kw)).length;
  }

  const best = Object.entries(scores).reduce(
    (a, b) => (b[1] > a[1] ? b : a),
    ['default', 0],
  );

  return best[1] > 0 ? best[0] : 'default';
}

function journalEntry(
  sessionId: string,
  agentId: ModelFamily | 'arbitrator' | 'system',
  phase: AgentJournalPhase,
  action: string,
  detail?: string,
  maturityScore?: number,
): AgentJournalEntry {
  return {
    id: sovereignId(),
    sessionId,
    agentId,
    phase,
    action,
    detail,
    maturityScore,
    timestamp: new Date().toISOString(),
  };
}

function appendJournal(session: ActivatedAgentSession, entry: AgentJournalEntry): void {
  session.journal.push(entry);
  sessions.set(session.id, { ...session });
}

// ─── Core Callable Surface ────────────────────────────────────────────────────

/**
 * Select the optimal agent set for a given task class and domain.
 */
export function selectAgentSet(taskClass: string, agentOverrides?: ModelFamily[]): ModelFamily[] {
  if (agentOverrides && agentOverrides.length > 0) return agentOverrides;
  return TASK_CLASS_MAP[taskClass] ?? TASK_CLASS_MAP['default'];
}

/**
 * Retrieve relevant prior objects from the vault (memory engine).
 */
export function retrieveVaultObjects(query: string, limit = 5): MemoryEntry[] {
  const result = queryMemory({ query, limit });
  return result.entries;
}

/**
 * Retrieve doctrine rules — vault entries tagged as doctrinal.
 */
export function retrieveDoctrineRules(query: string, limit = 3): MemoryEntry[] {
  const result = queryMemory({ query, type: 'doctrinal', limit });
  return result.entries;
}

/**
 * Run all activated agents against the task and collect their outputs.
 */
function runAgents(
  session: ActivatedAgentSession,
  agents: ModelFamily[],
  task: string,
  vaultContext: string,
  doctrineContext: string,
): AgentOutput[] {
  const outputs: AgentOutput[] = [];

  for (const agentId of agents) {
    const enrichedPrompt = [
      task,
      vaultContext ? `[VAULT CONTEXT] ${vaultContext}` : '',
      doctrineContext ? `[DOCTRINE] ${doctrineContext}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    appendJournal(
      session,
      journalEntry(session.id, agentId, 'reasoning', `Agent ${agentId} reasoning`, `Prompt length: ${enrichedPrompt.length} chars`),
    );

    const start = Date.now();
    const invocation = invokeModel(agentId, enrichedPrompt);
    const latency = Date.now() - start;

    // Confidence heuristic: longer, richer responses = higher confidence
    const confidence = Math.min(0.5 + (invocation.response.length / 500) * 0.4, 0.95);

    outputs.push({ agentId, response: invocation.response, confidence, latency });

    appendJournal(
      session,
      journalEntry(
        session.id,
        agentId,
        'reasoning',
        `${agentId} output ready`,
        invocation.response.slice(0, 120),
        confidence,
      ),
    );
  }

  return outputs;
}

/**
 * Arbitrate across agent outputs — weight by confidence, detect agreement,
 * and produce a synthesized perspective.
 */
export function arbitrate(agentOutputs: AgentOutput[]): { synthesized: string; agreementScore: number } {
  if (agentOutputs.length === 0) return { synthesized: 'No agent outputs to arbitrate.', agreementScore: 0 };
  if (agentOutputs.length === 1) return { synthesized: agentOutputs[0].response, agreementScore: 1 };

  // Sort by confidence descending
  const sorted = [...agentOutputs].sort((a, b) => b.confidence - a.confidence);
  const top = sorted[0];

  // Agreement: average similarity proxy (word overlap between top and rest)
  const topWords = new Set(top.response.toLowerCase().split(/\s+/));
  const overlapScores = sorted.slice(1).map((o) => {
    const words = o.response.toLowerCase().split(/\s+/);
    const overlap = words.filter((w) => topWords.has(w)).length;
    return overlap / Math.max(words.length, 1);
  });
  const agreementScore =
    overlapScores.length > 0
      ? overlapScores.reduce((a, b) => a + b, 0) / overlapScores.length
      : 1;

  // Synthesize: lead with top agent, append divergent insights
  const divergent = sorted
    .slice(1)
    .filter((o) => o.confidence > 0.6)
    .map((o) => `[${o.agentId}] ${o.response}`)
    .join(' | ');

  const synthesized = divergent
    ? `${top.response}\n\n──\n${divergent}`
    : top.response;

  return { synthesized, agreementScore: Math.min(agreementScore + 0.2, 1) };
}

/**
 * Compose final decision-grade answer from arbitrated state.
 */
export function composeAnswer(arbitratedOutput: string, taskClass: string): string {
  const header = `[${taskClass.toUpperCase()} · ACTIVATED AGENTS]`;
  return `${header}\n\n${arbitratedOutput}`;
}

/**
 * Compute a maturity score for the session output (0–1).
 */
function scoreMaturity(
  agentOutputs: AgentOutput[],
  agreementScore: number,
  vaultHits: number,
  doctrineHits: number,
): number {
  const avgConfidence =
    agentOutputs.length > 0
      ? agentOutputs.reduce((s, o) => s + o.confidence, 0) / agentOutputs.length
      : 0;
  const vaultBonus = Math.min(vaultHits * 0.04, 0.12);
  const doctrineBonus = Math.min(doctrineHits * 0.05, 0.10);
  const agentCountBonus = Math.min((agentOutputs.length - 1) * 0.03, 0.09);

  return Math.min(
    avgConfidence * 0.5 + agreementScore * 0.3 + vaultBonus + doctrineBonus + agentCountBonus,
    1,
  );
}

/**
 * Promote the composed answer into the vault if maturity exceeds threshold.
 */
export function promoteIfReusable(
  session: ActivatedAgentSession,
  threshold = 0.80,
): MemoryEntry | null {
  const maturity = session.maturityScore ?? 0;
  if (maturity < threshold) return null;
  if (!session.composedAnswer) return null;

  const tags = ['agent-promoted', session.taskClass, ...session.activatedAgents];
  const entry = storeMemory(session.composedAnswer, 'semantic', tags);

  appendJournal(
    session,
    journalEntry(
      session.id,
      'system',
      'promotion',
      `Output promoted to vault`,
      `Memory ID: ${entry.id.slice(0, 8)}… | Maturity: ${(maturity * 100).toFixed(0)}%`,
      maturity,
    ),
  );

  return entry;
}

/**
 * Log a drift event and update policy awareness in the journal.
 */
export function logDriftAndUpdatePolicy(
  session: ActivatedAgentSession,
  event: string,
  detail?: string,
): void {
  appendJournal(
    session,
    journalEntry(session.id, 'system', 'drift-log', `DRIFT: ${event}`, detail),
  );
}

// ─── Main Activation Entry Point ──────────────────────────────────────────────

/**
 * Activate agents for a task. Returns the completed session synchronously.
 *
 * Flow:
 *   1. Select agent set
 *   2. Retrieve vault objects (context enrichment)
 *   3. Retrieve doctrine rules (constraint enrichment)
 *   4. Run all agents in parallel (simulated sequentially — in-memory)
 *   5. Arbitrate outputs
 *   6. Compose final answer
 *   7. Score maturity
 *   8. Promote if reusable (when autoPromote = true)
 *   9. Mark session complete
 */
export function activateAgents(request: AgentActivationRequest): ActivatedAgentSession {
  const { task, context, agentOverrides, autoPromote = false, promoteThreshold = 0.80 } = request;
  const sessionId = sovereignId();
  const taskClass = detectTaskClass(task);
  const activatedAgents = selectAgentSet(taskClass, agentOverrides);

  const session: ActivatedAgentSession = {
    id: sessionId,
    task,
    context,
    taskClass,
    activatedAgents,
    status: 'activating',
    journal: [],
    vaultRetrievals: [],
    doctrineRetrievals: [],
    agentOutputs: [],
    promoted: false,
    startedAt: new Date().toISOString(),
  };

  sessions.set(sessionId, session);

  // 1. Log activation
  appendJournal(
    session,
    journalEntry(
      sessionId,
      'system',
      'activation',
      `Activating ${activatedAgents.length} agents for task class: ${taskClass}`,
      `Agents: ${activatedAgents.join(', ')}`,
    ),
  );

  for (const agentId of activatedAgents) {
    appendJournal(
      session,
      journalEntry(sessionId, agentId, 'activation', `Agent ${agentId} activated`),
    );
  }

  // 2. Vault retrieval
  session.status = 'retrieving';
  sessions.set(sessionId, { ...session });

  const vaultQuery = context ? `${task} ${context}` : task;
  const vaultRetrievals = retrieveVaultObjects(vaultQuery, 5);
  session.vaultRetrievals = vaultRetrievals;

  appendJournal(
    session,
    journalEntry(
      sessionId,
      'system',
      'vault-retrieval',
      `Vault retrieved ${vaultRetrievals.length} objects`,
      vaultRetrievals.map((e) => e.content.slice(0, 60)).join(' | '),
    ),
  );

  // 3. Doctrine retrieval
  const doctrineRetrievals = retrieveDoctrineRules(vaultQuery, 3);
  session.doctrineRetrievals = doctrineRetrievals;

  appendJournal(
    session,
    journalEntry(
      sessionId,
      'system',
      'doctrine-retrieval',
      `Doctrine retrieved ${doctrineRetrievals.length} rules`,
      doctrineRetrievals.map((e) => e.content.slice(0, 60)).join(' | '),
    ),
  );

  // 4. Run agents
  session.status = 'reasoning';
  sessions.set(sessionId, { ...session });

  const vaultContext = vaultRetrievals.map((e) => e.content).join('. ');
  const doctrineContext = doctrineRetrievals.map((e) => e.content).join('. ');
  const agentOutputs = runAgents(session, activatedAgents, task, vaultContext, doctrineContext);
  session.agentOutputs = agentOutputs;

  // 5. Arbitration
  session.status = 'arbitrating';
  sessions.set(sessionId, { ...session });

  appendJournal(
    session,
    journalEntry(sessionId, 'arbitrator', 'arbitration', `Arbitrating ${agentOutputs.length} outputs`),
  );

  const { synthesized, agreementScore } = arbitrate(agentOutputs);
  session.arbitratedOutput = synthesized;

  appendJournal(
    session,
    journalEntry(
      sessionId,
      'arbitrator',
      'arbitration',
      `Arbitration complete`,
      `Agreement score: ${(agreementScore * 100).toFixed(0)}%`,
      agreementScore,
    ),
  );

  // 6. Compose
  const composedAnswer = composeAnswer(synthesized, taskClass);
  session.composedAnswer = composedAnswer;

  appendJournal(
    session,
    journalEntry(sessionId, 'system', 'composition', 'Answer composed', composedAnswer.slice(0, 120)),
  );

  // 7. Maturity scoring
  const maturityScore = scoreMaturity(agentOutputs, agreementScore, vaultRetrievals.length, doctrineRetrievals.length);
  session.maturityScore = maturityScore;

  appendJournal(
    session,
    journalEntry(
      sessionId,
      'system',
      'completion',
      `Maturity score: ${(maturityScore * 100).toFixed(0)}%`,
      maturityScore >= 0.80 ? 'Eligible for promotion' : 'Below promotion threshold',
      maturityScore,
    ),
  );

  // 8. Promote if requested
  if (autoPromote) {
    session.status = 'promoting';
    sessions.set(sessionId, { ...session });

    const promoted = promoteIfReusable(session, promoteThreshold);
    if (promoted) {
      session.promoted = true;
      session.promotedMemoryId = promoted.id;
    } else {
      appendJournal(
        session,
        journalEntry(
          sessionId,
          'system',
          'promotion',
          'Promotion skipped',
          `Maturity ${(maturityScore * 100).toFixed(0)}% < threshold ${(promoteThreshold * 100).toFixed(0)}%`,
        ),
      );
    }
  }

  // 9. Complete
  session.status = 'complete';
  session.completedAt = new Date().toISOString();

  appendJournal(
    session,
    journalEntry(sessionId, 'system', 'completion', 'Session complete', `Journal: ${session.journal.length} entries`),
  );

  sessions.set(sessionId, { ...session });
  return session;
}

// ─── Read Surface ─────────────────────────────────────────────────────────────

export function getSession(id: string): ActivatedAgentSession | undefined {
  return sessions.get(id);
}

export function listSessions(limit = 20): ActivatedAgentSession[] {
  return Array.from(sessions.values())
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, limit);
}

export function getSessionJournal(id: string): AgentJournalEntry[] {
  return sessions.get(id)?.journal ?? [];
}

export function getAgentStats(): {
  totalSessions: number;
  completedSessions: number;
  totalAgentActivations: number;
  totalPromotions: number;
  avgMaturityScore: number;
} {
  const all = Array.from(sessions.values());
  const completed = all.filter((s) => s.status === 'complete');
  const promoted = all.filter((s) => s.promoted);
  const totalActivations = all.reduce((sum, s) => sum + s.activatedAgents.length, 0);
  const avgMaturity =
    completed.length > 0
      ? completed.reduce((sum, s) => sum + (s.maturityScore ?? 0), 0) / completed.length
      : 0;

  return {
    totalSessions: all.length,
    completedSessions: completed.length,
    totalAgentActivations: totalActivations,
    totalPromotions: promoted.length,
    avgMaturityScore: Math.round(avgMaturity * 100) / 100,
  };
}
