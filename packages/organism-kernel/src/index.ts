// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE.

/**
 * organism-kernel
 * ─────────────────────────────────────────────────────────────────────────────
 * Organism execution kernel for the ItsNotAILABS sovereign stack.
 *
 * Manages organism lifecycle, state transitions, canister deployment,
 * genome expression, and organism-to-organism communication protocols.
 *
 * ISIL-1.1 — Production use requires commercial license + AUT.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type OrganismState =
  | 'DORMANT'    // Instantiated, not yet activated
  | 'AWAKENING'  // Genome loading, systems initializing
  | 'ALIVE'      // Fully operational
  | 'DREAMING'   // Low-power background processing
  | 'MERGING'    // Cross-organism synchronization in progress
  | 'TERMINATED';// Final state — no revival

export interface OrganismGenome {
  /** Unique organism identifier */
  organismId: string;
  /** Organism class (determines available canisters) */
  organismClass: string;
  /** Genome version — bumped on self-modification */
  genomeVersion: string;
  /** Declared canister IDs this organism expresses */
  canisters: string[];
  /** Frequency signature (Hz) */
  frequencySignature: number;
  /** Sovereign authority level */
  authorityLevel: 'SEED' | 'JUVENILE' | 'MATURE' | 'SOVEREIGN';
  /** Immutable lineage provenance hash */
  lineageHash: string;
}

export interface OrganismCanister {
  canisterId: string;
  canisterClass: string;
  state: 'LOADING' | 'ACTIVE' | 'SUSPENDED' | 'ERROR';
  deployedAt: number;
  lastHeartbeat: number;
  memoryFootprint?: number;
}

export interface OrganismMessage {
  messageId: string;
  fromOrganism: string;
  toOrganism: string;
  channel: string;
  payload: unknown;
  sentAt: number;
  requiresAck: boolean;
}

export type LifecycleHook = (organism: OrganismInstance) => void | Promise<void>;

export class OrganismInstance {
  readonly genome: OrganismGenome;
  private _state: OrganismState = 'DORMANT';
  private canisters = new Map<string, OrganismCanister>();
  private hooks = new Map<OrganismState, LifecycleHook[]>();
  private inbox: OrganismMessage[] = [];

  constructor(genome: OrganismGenome) { this.genome = genome; }

  get state(): OrganismState { return this._state; }

  /** Register a lifecycle hook that fires when organism enters a state */
  onState(state: OrganismState, hook: LifecycleHook): void {
    const existing = this.hooks.get(state) ?? [];
    existing.push(hook);
    this.hooks.set(state, existing);
  }

  /** Awaken the organism — load genome, initialize canisters */
  async awaken(): Promise<void> {
    if (this._state !== 'DORMANT') throw new Error('Organism is not dormant');
    await this._transition('AWAKENING');
    for (const canisterId of this.genome.canisters) {
      this.canisters.set(canisterId, {
        canisterId, canisterClass: canisterId, state: 'ACTIVE',
        deployedAt: Date.now(), lastHeartbeat: Date.now(),
      });
    }
    await this._transition('ALIVE');
  }

  /** Enter dream state — reduce activity, maintain memory */
  async dream(): Promise<void> {
    if (this._state !== 'ALIVE') throw new Error('Organism must be alive to dream');
    await this._transition('DREAMING');
  }

  /** Terminate — irreversible */
  async terminate(): Promise<void> {
    await this._transition('TERMINATED');
    this.canisters.forEach(c => { c.state = 'SUSPENDED'; });
  }

  /** Get canister state */
  getCanister(canisterId: string): OrganismCanister | undefined {
    return this.canisters.get(canisterId);
  }

  /** Deliver a message to this organism's inbox */
  receive(message: OrganismMessage): void { this.inbox.push(message); }

  /** Drain the inbox */
  drainInbox(): OrganismMessage[] {
    const msgs = [...this.inbox];
    this.inbox = [];
    return msgs;
  }

  private async _transition(next: OrganismState): Promise<void> {
    this._state = next;
    const hooks = this.hooks.get(next) ?? [];
    for (const hook of hooks) await hook(this);
  }
}

export class OrganismKernel {
  private organisms = new Map<string, OrganismInstance>();

  /** Spawn a new organism from a genome */
  spawn(genome: OrganismGenome): OrganismInstance {
    if (this.organisms.has(genome.organismId)) {
      throw new Error(`Organism ${genome.organismId} already exists in kernel`);
    }
    const instance = new OrganismInstance(genome);
    this.organisms.set(genome.organismId, instance);
    return instance;
  }

  /** Route a message between organisms */
  async route(message: OrganismMessage): Promise<void> {
    const target = this.organisms.get(message.toOrganism);
    if (!target) throw new Error(`Organism ${message.toOrganism} not found in kernel`);
    target.receive(message);
  }

  /** Get all organisms in a given state */
  getByState(state: OrganismState): OrganismInstance[] {
    return Array.from(this.organisms.values()).filter(o => o.state === state);
  }

  /** Terminate and remove all organisms */
  async shutdown(): Promise<void> {
    for (const organism of this.organisms.values()) {
      if (organism.state !== 'TERMINATED') await organism.terminate();
    }
    this.organisms.clear();
  }
}
