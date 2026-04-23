// MIT License — Copyright (c) 2026 ItsNotAILABS

/**
 * sovereign-bus
 * ─────────────────────────────────────────────────────────────────────────────
 * Sovereign event transport layer for ItsNotAILABS organism systems.
 *
 * Typed event channels with priority queues, dead-letter routing,
 * cross-organism bus federation, and audit trails.
 *
 * MIT License — ItsNotAILABS
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type EventPriority = 'AMBIENT' | 'NORMAL' | 'ELEVATED' | 'CRITICAL' | 'SOVEREIGN';
export type ChannelScope = 'LOCAL' | 'ORGANISM' | 'FEDERATED' | 'SOVEREIGN_WIDE';

export interface SovereignEvent {
  id: string;
  channel: string;
  scope: ChannelScope;
  priority: EventPriority;
  emittedAt: number;
  emittedBy: string;
  subject: string;
  payload?: unknown;
  /** If true, event persists in channel history even after delivery */
  persistent?: boolean;
}

export interface ChannelSubscription {
  subscriptionId: string;
  channel: string;
  subscriberId: string;
  handler: (event: SovereignEvent) => void | Promise<void>;
  filter?: (event: SovereignEvent) => boolean;
}

export interface DeadLetterEntry {
  event: SovereignEvent;
  reason: string;
  failedAt: number;
  attempts: number;
}

export class SovereignBus {
  private channels = new Map<string, ChannelSubscription[]>();
  private history = new Map<string, SovereignEvent[]>();
  private deadLetters: DeadLetterEntry[] = [];
  private federatedBuses: SovereignBus[] = [];

  /** Register a new named channel with declared scope */
  declareChannel(channelName: string, _scope: ChannelScope = 'LOCAL'): void {
    if (!this.channels.has(channelName)) {
      this.channels.set(channelName, []);
      this.history.set(channelName, []);
    }
  }

  /** Subscribe to a channel */
  subscribe(sub: ChannelSubscription): () => void {
    this.declareChannel(sub.channel);
    const subs = this.channels.get(sub.channel)!;
    subs.push(sub);
    return () => {
      const idx = subs.findIndex(s => s.subscriptionId === sub.subscriptionId);
      if (idx !== -1) subs.splice(idx, 1);
    };
  }

  /** Emit an event on a channel */
  async emit(event: SovereignEvent): Promise<void> {
    this.declareChannel(event.channel);
    if (event.persistent) {
      this.history.get(event.channel)!.push(event);
    }
    const subs = this.channels.get(event.channel) ?? [];
    const eligible = subs.filter(s => !s.filter || s.filter(event));
    // SOVEREIGN and CRITICAL events fire synchronously
    if (event.priority === 'SOVEREIGN' || event.priority === 'CRITICAL') {
      for (const sub of eligible) {
        try { await sub.handler(event); }
        catch (err) { this._deadLetter(event, sub.subscriberId, err); }
      }
    } else {
      eligible.forEach(sub => {
        Promise.resolve().then(() => sub.handler(event)).catch(err =>
          this._deadLetter(event, sub.subscriberId, err)
        );
      });
    }
    // Federate upward
    for (const bus of this.federatedBuses) {
      if (event.scope !== 'LOCAL') await bus.emit(event);
    }
  }

  /** Federate this bus to a parent sovereign bus */
  federate(bus: SovereignBus): void {
    this.federatedBuses.push(bus);
  }

  /** Retrieve persistent history for a channel */
  getHistory(channel: string): SovereignEvent[] {
    return [...(this.history.get(channel) ?? [])];
  }

  /** Retrieve dead-letter entries */
  getDeadLetters(): DeadLetterEntry[] { return [...this.deadLetters]; }

  private _deadLetter(event: SovereignEvent, subscriberId: string, err: unknown): void {
    const existing = this.deadLetters.find(
      d => d.event.id === event.id && d.reason.includes(subscriberId)
    );
    if (existing) { existing.attempts++; return; }
    this.deadLetters.push({
      event, reason: `Handler failed for ${subscriberId}: ${String(err)}`,
      failedAt: Date.now(), attempts: 1
    });
  }
}
