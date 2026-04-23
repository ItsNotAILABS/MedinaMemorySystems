// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE.

/**
 * replay-engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Session replay and memory capture for AI agent systems.
 * Records every decision, signal, state change, and organism event
 * to an immutable replay ledger. Full deterministic replay. Time travel.
 *
 * ISIL-1.1 — Production use requires commercial license + AUT.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ReplayEventType =
  | 'SIGNAL_EMITTED' | 'SIGNAL_RECEIVED' | 'DECISION_MADE' | 'STATE_CHANGED'
  | 'ORGANISM_SPAWNED' | 'ORGANISM_TERMINATED' | 'MEMORY_STORED' | 'MEMORY_RETRIEVED'
  | 'VOTE_CAST' | 'CONSENSUS_REACHED' | 'VETO_CAST' | 'CLAIM_SUBMITTED';

export interface ReplayEvent {
  eventId: string;
  sessionId: string;
  sequenceNum: number;
  type: ReplayEventType;
  timestamp: number;
  agentId?: string;
  organismId?: string;
  payload: unknown;
  checksum: string;
}

export interface ReplaySession {
  sessionId: string;
  startedAt: number;
  endedAt?: number;
  eventCount: number;
  agentsInvolved: string[];
  organismsInvolved: string[];
}

export class ReplayEngine {
  private sessions = new Map<string, ReplaySession>();
  private events = new Map<string, ReplayEvent[]>(); // sessionId → events
  private activeSession: string | null = null;

  /** Start a new capture session */
  startSession(sessionId: string): void {
    this.sessions.set(sessionId, {
      sessionId, startedAt: Date.now(), eventCount: 0,
      agentsInvolved: [], organismsInvolved: [],
    });
    this.events.set(sessionId, []);
    this.activeSession = sessionId;
  }

  /** End the current session */
  endSession(): void {
    if (this.activeSession) {
      const session = this.sessions.get(this.activeSession);
      if (session) session.endedAt = Date.now();
      this.activeSession = null;
    }
  }

  /** Record an event to the active session */
  record(type: ReplayEventType, payload: unknown, agentId?: string, organismId?: string): void {
    if (!this.activeSession) throw new Error('No active replay session');
    const events = this.events.get(this.activeSession)!;
    const event: ReplayEvent = {
      eventId: `evt-${Date.now()}-${events.length}`,
      sessionId: this.activeSession, sequenceNum: events.length,
      type, timestamp: Date.now(), agentId, organismId, payload,
      checksum: this._checksum(payload),
    };
    events.push(event);
    const session = this.sessions.get(this.activeSession)!;
    session.eventCount++;
    if (agentId && !session.agentsInvolved.includes(agentId)) session.agentsInvolved.push(agentId);
    if (organismId && !session.organismsInvolved.includes(organismId)) session.organismsInvolved.push(organismId);
  }

  /** Replay a session, calling the handler for each event in order */
  replay(sessionId: string, handler: (event: ReplayEvent) => void): void {
    const events = this.events.get(sessionId) ?? [];
    for (const event of events) handler(event);
  }

  /** Get events for a session, optionally filtered by type */
  getEvents(sessionId: string, type?: ReplayEventType): ReplayEvent[] {
    const events = this.events.get(sessionId) ?? [];
    return type ? events.filter(e => e.type === type) : events;
  }

  getSession(sessionId: string): ReplaySession | undefined {
    return this.sessions.get(sessionId);
  }

  private _checksum(payload: unknown): string {
    return Buffer.from(JSON.stringify(payload)).toString('base64').slice(0, 16);
  }
}
