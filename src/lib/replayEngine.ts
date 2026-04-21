import { sovereignId } from './sovereign-id';
import type { ReplayEvent, ReplaySession } from '@/types';

// ─── Store ────────────────────────────────────────────────────────────────────

const sessions: Map<string, ReplaySession> = new Map();
let currentSessionId: string | null = null;
let globalSequence = 0;

// Seed a historical session
(function seed() {
  const now = new Date(Date.now() - 3600000).toISOString();
  const events: ReplayEvent[] = [
    {
      id: sovereignId(),
      sequenceId: 1,
      type: 'system',
      action: 'PLATFORM_INIT',
      payload: { version: '1.0.0' },
      outcome: 'success',
      timestamp: now,
      actor: 'System',
      duration: 12,
    },
    {
      id: sovereignId(),
      sequenceId: 2,
      type: 'memory',
      action: 'MEMORY_STORE',
      payload: { content: 'Initial doctrine entry', type: 'doctrinal' },
      outcome: 'success',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      actor: 'Sovereign',
      duration: 45,
    },
    {
      id: sovereignId(),
      sequenceId: 3,
      type: 'governance',
      action: 'PROPOSAL_CREATED',
      payload: { title: 'Adopt RECITAL_PLUS_ONE as Standing Law' },
      outcome: 'success',
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      actor: 'Sovereign',
      duration: 20,
    },
    {
      id: sovereignId(),
      sequenceId: 4,
      type: 'model',
      action: 'MODEL_INVOKED',
      payload: { model: 'strategist', prompt: 'Analyze platform initialization' },
      outcome: 'success',
      timestamp: new Date(Date.now() - 2500000).toISOString(),
      actor: 'User',
      duration: 420,
    },
    {
      id: sovereignId(),
      sequenceId: 5,
      type: 'governance',
      action: 'PROPOSAL_ENACTED',
      payload: { title: 'Adopt RECITAL_PLUS_ONE as Standing Law' },
      outcome: 'success',
      timestamp: new Date(Date.now() - 2000000).toISOString(),
      actor: 'Governance',
      duration: 15,
    },
  ];

  const session: ReplaySession = {
    id: sovereignId(),
    name: 'Session Alpha — Platform Bootstrap',
    startTime: now,
    endTime: new Date(Date.now() - 1800000).toISOString(),
    events,
    status: 'complete',
  };

  sessions.set(session.id, session);
  globalSequence = 5;
})();

// ─── Operations ───────────────────────────────────────────────────────────────

export function startReplaySession(name: string): ReplaySession {
  const session: ReplaySession = {
    id: sovereignId(),
    name,
    startTime: new Date().toISOString(),
    events: [],
    status: 'recording',
  };
  sessions.set(session.id, session);
  currentSessionId = session.id;
  return session;
}

export function stopReplaySession(): ReplaySession | null {
  if (!currentSessionId) return null;
  const session = sessions.get(currentSessionId);
  if (!session) return null;
  const updated = { ...session, status: 'complete' as const, endTime: new Date().toISOString() };
  sessions.set(currentSessionId, updated);
  currentSessionId = null;
  return updated;
}

export function recordEvent(
  type: ReplayEvent['type'],
  action: string,
  payload: unknown,
  actor: string,
  outcome: ReplayEvent['outcome'] = 'success',
  duration = 0,
): void {
  globalSequence++;
  const event: ReplayEvent = {
    id: sovereignId(),
    sequenceId: globalSequence,
    type,
    action,
    payload,
    outcome,
    timestamp: new Date().toISOString(),
    actor,
    duration,
  };

  if (currentSessionId) {
    const session = sessions.get(currentSessionId);
    if (session) {
      sessions.set(currentSessionId, { ...session, events: [...session.events, event] });
    }
  }
}

export function listSessions(): ReplaySession[] {
  return Array.from(sessions.values()).sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
  );
}

export function getSession(id: string): ReplaySession | undefined {
  return sessions.get(id);
}

export function getCurrentSession(): ReplaySession | null {
  if (!currentSessionId) return null;
  return sessions.get(currentSessionId) ?? null;
}

export function getReplayStats(): { totalSessions: number; totalEvents: number; currentlyRecording: boolean } {
  const all = Array.from(sessions.values());
  return {
    totalSessions: all.length,
    totalEvents: all.reduce((sum, s) => sum + s.events.length, 0),
    currentlyRecording: currentSessionId !== null,
  };
}
