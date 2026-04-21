/**
 * agent-signal
 * ─────────────────────────────────────────────────────────────────────────────
 * Pub/sub signal bus for AI agents and multi-agent teams.
 *
 * Agents emit signals. Other agents subscribe and receive them.
 * Signals carry a type (BROADCAST, DIRECT, ROLE, URGENT), a priority,
 * a subject, and any payload you want to attach.
 *
 * Use this when:
 *   - Agents on a team need to communicate asynchronously
 *   - You want decoupled inter-agent messaging without tight coupling
 *   - You need an audit trail of all signals on a task or session
 *   - Critical events (URGENT / CRITICAL priority) need immediate delivery
 *
 * MIT License — ItsNotAILABS
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type SignalType =
  | 'BROADCAST'  // Delivered to all subscribers
  | 'DIRECT'     // Delivered to one agent by ID
  | 'ROLE'       // Delivered to all agents with a given role
  | 'URGENT';    // Delivered to all subscribers, fires handlers synchronously

export type SignalPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export interface Signal {
  /** Unique signal ID */
  id: string;
  /** Signal routing type */
  type: SignalType;
  /** Emitting agent ID */
  from: string;
  /** Target agent ID (DIRECT) or role (ROLE). Unused for BROADCAST/URGENT. */
  to?: string;
  /** Short subject line */
  subject: string;
  /** Arbitrary payload */
  payload: unknown;
  /** Delivery priority */
  priority: SignalPriority;
  /** Whether the signal has been read by its recipient(s) */
  read: boolean;
  /** ISO timestamp */
  timestamp: string;
}

export type SignalHandler = (signal: Signal) => void;

export interface EmitOptions {
  type?: SignalType;
  to?: string;
  priority?: SignalPriority;
}

export interface InboxOptions {
  /** Include already-read signals */
  includeRead?: boolean;
  /** Filter by subject prefix */
  subjectPrefix?: string;
  /** Filter by minimum priority */
  minPriority?: SignalPriority;
}

// ─── Priority ordering ────────────────────────────────────────────────────────

const PRIORITY_ORDER: Record<SignalPriority, number> = {
  LOW: 0, NORMAL: 1, HIGH: 2, CRITICAL: 3,
};

// ─── SignalBus ────────────────────────────────────────────────────────────────

/**
 * Pub/sub signal bus for a team of agents.
 *
 * @example
 * ```typescript
 * import { SignalBus } from 'agent-signal';
 *
 * const bus = new SignalBus();
 *
 * // Subscribe
 * bus.subscribe('analyst', signal => {
 *   console.log('analyst got:', signal.subject, signal.payload);
 * });
 *
 * // Broadcast from lead
 * bus.emit('lead', 'task:assigned', { taskId: 'task-001' });
 *
 * // Direct message to analyst
 * bus.emit('lead', 'context:shared', { data: '...' }, { type: 'DIRECT', to: 'analyst' });
 *
 * // Read analyst inbox
 * const inbox = bus.inbox('analyst');
 * bus.markRead('analyst');
 * ```
 */
export class SignalBus {
  private signals: Signal[] = [];
  private handlers: Map<string, SignalHandler[]> = new Map();
  private maxHistory: number;

  constructor(options: { maxHistory?: number } = {}) {
    this.maxHistory = options.maxHistory ?? 1000;
  }

  /**
   * Subscribe an agent to incoming signals.
   * Returns an unsubscribe function.
   */
  subscribe(agentId: string, handler: SignalHandler): () => void {
    if (!this.handlers.has(agentId)) this.handlers.set(agentId, []);
    this.handlers.get(agentId)!.push(handler);

    return () => {
      const list = this.handlers.get(agentId);
      if (list) {
        const idx = list.indexOf(handler);
        if (idx !== -1) list.splice(idx, 1);
      }
    };
  }

  /**
   * Emit a signal from an agent.
   */
  emit(
    from: string,
    subject: string,
    payload: unknown = null,
    options: EmitOptions = {},
  ): Signal {
    const signal: Signal = {
      id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: options.type ?? 'BROADCAST',
      from,
      to: options.to,
      subject,
      payload,
      priority: options.priority ?? 'NORMAL',
      read: false,
      timestamp: new Date().toISOString(),
    };

    this.signals.push(signal);

    // Trim history
    if (this.signals.length > this.maxHistory) {
      this.signals.splice(0, this.signals.length - this.maxHistory);
    }

    // URGENT and CRITICAL fire handlers immediately
    if (signal.priority === 'CRITICAL' || signal.type === 'URGENT') {
      this.fireHandlers(signal);
    }

    return signal;
  }

  /**
   * Get unread (by default) signals for an agent.
   */
  inbox(agentId: string, role?: string, options: InboxOptions = {}): Signal[] {
    const minPri = options.minPriority ? PRIORITY_ORDER[options.minPriority] : -1;

    return this.signals.filter(s => {
      // Read filter
      if (!options.includeRead && s.read) return false;

      // Subject prefix filter
      if (options.subjectPrefix && !s.subject.startsWith(options.subjectPrefix)) return false;

      // Priority filter
      if (PRIORITY_ORDER[s.priority] < minPri) return false;

      // Routing filter
      if (s.type === 'BROADCAST' || s.type === 'URGENT') return true;
      if (s.type === 'DIRECT') return s.to === agentId;
      if (s.type === 'ROLE') return s.to === role;

      return false;
    }).sort((a, b) =>
      PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority] ||
      b.timestamp.localeCompare(a.timestamp)
    );
  }

  /**
   * Mark all signals addressed to an agent as read.
   */
  markRead(agentId: string, role?: string): number {
    let count = 0;
    for (const s of this.signals) {
      if (s.read) continue;
      if (
        s.type === 'BROADCAST' || s.type === 'URGENT' ||
        (s.type === 'DIRECT' && s.to === agentId) ||
        (s.type === 'ROLE' && role && s.to === role)
      ) {
        s.read = true;
        count++;
      }
    }
    return count;
  }

  /**
   * Get all signals matching a subject prefix, newest first.
   */
  bySubject(prefix: string): Signal[] {
    return this.signals
      .filter(s => s.subject.startsWith(prefix))
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  /**
   * Get all signals from a specific agent.
   */
  from(agentId: string): Signal[] {
    return this.signals.filter(s => s.from === agentId);
  }

  /**
   * Total signals in history.
   */
  size(): number { return this.signals.length; }

  /**
   * Clear all signal history.
   */
  clear(): void { this.signals = []; }

  private fireHandlers(signal: Signal): void {
    for (const handlers of this.handlers.values()) {
      for (const h of handlers) {
        try { h(signal); } catch { /* isolate handler errors */ }
      }
    }
  }
}

// ─── Channel ──────────────────────────────────────────────────────────────────

/**
 * A named, scoped channel — wraps a SignalBus for a specific topic or session.
 * Useful when you want separate buses for different team sessions.
 *
 * @example
 * ```typescript
 * const channel = new SignalChannel('session-001', bus);
 * channel.emit('lead', 'ready', null);
 * const inbox = channel.inbox('analyst');
 * ```
 */
export class SignalChannel {
  constructor(
    public readonly name: string,
    private bus: SignalBus,
  ) {}

  emit(from: string, subject: string, payload?: unknown, options: EmitOptions = {}): Signal {
    return this.bus.emit(from, `${this.name}:${subject}`, payload, options);
  }

  inbox(agentId: string, role?: string, options: InboxOptions = {}): Signal[] {
    return this.bus.inbox(agentId, role, {
      ...options,
      subjectPrefix: `${this.name}:`,
    });
  }

  markRead(agentId: string, role?: string): number {
    return this.bus.markRead(agentId, role);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Create a new standalone SignalBus.
 */
export function createBus(options?: { maxHistory?: number }): SignalBus {
  return new SignalBus(options);
}

/**
 * Create a named channel on an existing bus.
 */
export function createChannel(name: string, bus: SignalBus): SignalChannel {
  return new SignalChannel(name, bus);
}
