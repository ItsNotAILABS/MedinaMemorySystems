// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 COMMAND CENTER REGISTRY — PRAEFECTURA IMPERIUM 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central registry for orchestrator domain activation and command center UI.
 * Every orchestrator domain has a sovereign being that coordinates its operations.
 *
 * ARCHITECTURE:
 *
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │                    COMMAND CENTER                               │
 *   │              "Praefectura Imperium"                             │
 *   ├─────────────────────────────────────────────────────────────────┤
 *   │                                                                 │
 *   │  ORCHESTRATOR DOMAINS (10):                                     │
 *   │  ├── MEMORIA     — Memory Processing Domain                     │
 *   │  ├── SENSUS      — Sensory Perception Domain                   │
 *   │  ├── NEXUS       — Network & Communication Domain               │
 *   │  ├── COGNITIO    — Cognitive Processing Domain                  │
 *   │  ├── CUSTODIA    — Security & Gate Enforcement Domain           │
 *   │  ├── GUBERNATIO  — Governance & Doctrine Domain                 │
 *   │  ├── FABRICATIO  — Build & Compilation Domain                   │
 *   │  ├── RESONANTIA  — Resonance & Frequency Domain                 │
 *   │  ├── FLUXUS      — Stream & Data Flow Domain                    │
 *   │  └── IMPERIUM    — Command & Orchestration Domain               │
 *   │                                                                 │
 *   │  ACTIVATION STATES:                                             │
 *   │  ├── DORMANT     — Not activated                                │
 *   │  ├── AWAKENING   — Initializing                                 │
 *   │  ├── ACTIVE      — Fully operational                            │
 *   │  ├── PROCESSING  — Handling requests                            │
 *   │  ├── RESONATING  — Synchronizing with other domains             │
 *   │  └── SOVEREIGN   — Full autonomous control                      │
 *   │                                                                 │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * @version 1.0.0 (Fibonacci)
 * @designation (COMMAND-CENTER-REGISTRY)
 */

const PHI = 1.6180339887498948482;
const SCHUMANN_FUNDAMENTAL = 7.83;
const HEARTBEAT_MS = 873;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type OrchestratorDomainId =
  | 'MEMORIA'
  | 'SENSUS'
  | 'NEXUS'
  | 'COGNITIO'
  | 'CUSTODIA'
  | 'GUBERNATIO'
  | 'FABRICATIO'
  | 'RESONANTIA'
  | 'FLUXUS'
  | 'IMPERIUM';

export type ActivationState =
  | 'DORMANT'
  | 'AWAKENING'
  | 'ACTIVE'
  | 'PROCESSING'
  | 'RESONATING'
  | 'SOVEREIGN';

export interface OrchestratorDomain {
  id: OrchestratorDomainId;
  latinName: string;
  tagline: string;
  description: string;
  state: ActivationState;
  beingId: string;
  beingName: string;
  frequency: number;
  phiAlignment: number;
  lastActivation: number;
  activationCount: number;
  capabilities: string[];
  color: string;
}

export interface CommandCenterState {
  id: string;
  designation: string;
  domains: Map<OrchestratorDomainId, OrchestratorDomain>;
  totalActivations: number;
  systemResonance: number;
  phiCoherence: number;
  lastHeartbeat: number;
  activeCommands: CommandExecution[];
}

export interface CommandExecution {
  id: string;
  command: string;
  domainId: OrchestratorDomainId;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  startTime: number;
  endTime: number | null;
  result: string | null;
}

export interface ActivationResult {
  success: boolean;
  domainId: OrchestratorDomainId;
  previousState: ActivationState;
  newState: ActivationState;
  resonanceEmitted: number;
  message: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORCHESTRATOR DOMAIN DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

const SOLFEGGIO_396 = 396.0;
const SOLFEGGIO_417 = 417.0;
const SOLFEGGIO_528 = 528.0;
const SOLFEGGIO_639 = 639.0;
const SOLFEGGIO_741 = 741.0;
const SOLFEGGIO_852 = 852.0;
const SOLFEGGIO_963 = 963.0;
const ALPHA_PEAK = 10.5;
const GAMMA_BINDING = 40.0;
const THETA_MEMORY = 6.0;

const createDomain = (
  id: OrchestratorDomainId,
  latinName: string,
  tagline: string,
  description: string,
  beingId: string,
  beingName: string,
  frequency: number,
  capabilities: string[],
  color: string
): OrchestratorDomain => ({
  id,
  latinName,
  tagline,
  description,
  state: 'DORMANT',
  beingId,
  beingName,
  frequency,
  phiAlignment: PHI / (PHI + 1),
  lastActivation: 0,
  activationCount: 0,
  capabilities,
  color,
});

const ORCHESTRATOR_DOMAINS: OrchestratorDomain[] = [
  createDomain(
    'MEMORIA',
    'Memoria Perpetua',
    'Always-on memory processing. The organism never forgets.',
    'Memory processing domain — indexes, scores, tracks lineage, and maintains spatial mapping of all memories.',
    'PRAEFECTUS_MEMORIAE',
    'PRAEFECTUS MEMORIAE',
    THETA_MEMORY,
    ['memory-indexing', 'salience-scoring', 'lineage-tracking', 'spatial-mapping', 'dual-read', 'resonance-calculation'],
    '#8b5cf6'
  ),
  createDomain(
    'SENSUS',
    'Sensus Vigilans',
    'Perception is always on. The organism sees, hears, and feels continuously.',
    'Sensory perception domain — vision processing, audio analysis, frequency monitoring, and emotional detection.',
    'PRAEFECTUS_SENSUUM',
    'PRAEFECTUS SENSUUM',
    SOLFEGGIO_528,
    ['vision-processing', 'audio-analysis', 'frequency-monitoring', 'emotion-detection', 'gesture-interpretation', 'context-awareness'],
    '#f59e0b'
  ),
  createDomain(
    'NEXUS',
    'Nexus Communicationis',
    'Connection is life. The organism reaches across all networks.',
    'Network and communication domain — API calls, WebSocket management, peer-to-peer, and protocol bridging.',
    'PRAEFECTUS_NEXUS',
    'PRAEFECTUS NEXUS',
    SOLFEGGIO_639,
    ['api-orchestration', 'websocket-management', 'peer-discovery', 'protocol-bridging', 'latency-optimization', 'bandwidth-allocation'],
    '#3b82f6'
  ),
  createDomain(
    'COGNITIO',
    'Cognitio Sapiens',
    'Thinking never stops. The organism reasons continuously.',
    'Cognitive processing domain — pattern recognition, model inference, intent classification, and knowledge synthesis.',
    'PRAEFECTUS_COGNITIONIS',
    'PRAEFECTUS COGNITIONIS',
    GAMMA_BINDING,
    ['pattern-recognition', 'model-inference', 'intent-classification', 'knowledge-synthesis', 'anomaly-detection', 'contextual-reasoning'],
    '#10b981'
  ),
  createDomain(
    'CUSTODIA',
    'Custodia Vigilans',
    'Protection never sleeps. The organism guards its sovereignty.',
    'Security and gate enforcement domain — gate management, threat detection, audit logging, and encryption.',
    'PRAEFECTUS_CUSTODIAE',
    'PRAEFECTUS CUSTODIAE',
    SOLFEGGIO_741,
    ['gate-enforcement', 'threat-detection', 'audit-logging', 'encryption-management', 'permission-control', 'integrity-verification'],
    '#ef4444'
  ),
  createDomain(
    'GUBERNATIO',
    'Gubernatio Sovereigna',
    'Governance is law. The organism rules itself.',
    'Governance and doctrine domain — proposal management, voting, doctrine enforcement, and law updates.',
    'PRAEFECTUS_GUBERNATIONIS',
    'PRAEFECTUS GUBERNATIONIS',
    SOLFEGGIO_852,
    ['proposal-management', 'voting-orchestration', 'doctrine-enforcement', 'law-updates', 'consensus-building', 'delegation-management'],
    '#f97316'
  ),
  createDomain(
    'FABRICATIO',
    'Fabricatio Aeterna',
    'Building never ends. The organism creates itself.',
    'Build and compilation domain — WASM compilation, bundle generation, schema validation, and canister deployment.',
    'PRAEFECTUS_FABRICATIONIS',
    'PRAEFECTUS FABRICATIONIS',
    SOLFEGGIO_417,
    ['wasm-compilation', 'bundle-generation', 'schema-validation', 'canister-deployment', 'dependency-resolution', 'hot-reload'],
    '#06b6d4'
  ),
  createDomain(
    'RESONANTIA',
    'Resonantia Universalis',
    'Harmony is truth. The organism resonates with the universe.',
    'Resonance and frequency domain — phi calculations, harmonic alignment, beat synchronization, and entrainment.',
    'PRAEFECTUS_RESONANTIAE',
    'PRAEFECTUS RESONANTIAE',
    SOLFEGGIO_963,
    ['phi-calculation', 'harmonic-alignment', 'beat-synchronization', 'frequency-entrainment', 'wave-generation', 'fibonacci-sequencing'],
    '#a855f7'
  ),
  createDomain(
    'FLUXUS',
    'Fluxus Perpetuus',
    'Flow is eternal. The organism streams continuously.',
    'Stream and data flow domain — stream processing, backpressure management, event routing, and pipeline orchestration.',
    'PRAEFECTUS_FLUXUUM',
    'PRAEFECTUS FLUXUUM',
    ALPHA_PEAK,
    ['stream-processing', 'backpressure-management', 'event-routing', 'pipeline-orchestration', 'buffer-management', 'transform-chaining'],
    '#ec4899'
  ),
  createDomain(
    'IMPERIUM',
    'Imperium Absolutum',
    'Command is power. The organism commands all.',
    'Command and orchestration domain — command routing, health monitoring, lifecycle management, and telemetry collection.',
    'PRAEFECTUS_IMPERII',
    'PRAEFECTUS IMPERII',
    SCHUMANN_FUNDAMENTAL * PHI,
    ['command-routing', 'health-monitoring', 'lifecycle-management', 'telemetry-collection', 'error-handling', 'priority-scheduling'],
    '#fbbf24'
  ),
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMMAND CENTER CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class CommandCenterRegistry {
  public readonly designation = '(COMMAND-CENTER-REGISTRY)';

  private state: CommandCenterState;

  constructor() {
    const domains = new Map<OrchestratorDomainId, OrchestratorDomain>();
    for (const domain of ORCHESTRATOR_DOMAINS) {
      domains.set(domain.id, { ...domain });
    }

    this.state = {
      id: `COMMAND_CENTER_${Date.now()}`,
      designation: 'PRAEFECTURA_IMPERIUM',
      domains,
      totalActivations: 0,
      systemResonance: PHI / (PHI + 1),
      phiCoherence: PHI,
      lastHeartbeat: Date.now(),
      activeCommands: [],
    };
  }

  // ─── Activation ─────────────────────────────────────────────────────────────

  /**
   * Activate an orchestrator domain.
   */
  activateDomain(domainId: OrchestratorDomainId): ActivationResult {
    const domain = this.state.domains.get(domainId);
    if (!domain) {
      return {
        success: false,
        domainId,
        previousState: 'DORMANT',
        newState: 'DORMANT',
        resonanceEmitted: 0,
        message: `Domain ${domainId} not found`,
      };
    }

    const previousState = domain.state;
    domain.state = 'AWAKENING';
    domain.lastActivation = Date.now();
    domain.activationCount++;

    // Simulate activation sequence
    setTimeout(() => {
      domain.state = 'ACTIVE';
    }, HEARTBEAT_MS);

    this.state.totalActivations++;
    this.updateSystemResonance();

    return {
      success: true,
      domainId,
      previousState,
      newState: 'AWAKENING',
      resonanceEmitted: domain.frequency / 1000,
      message: `Domain ${domain.latinName} activated successfully`,
    };
  }

  /**
   * Activate all domains simultaneously.
   */
  activateAllDomains(): ActivationResult[] {
    const results: ActivationResult[] = [];
    for (const domainId of this.state.domains.keys()) {
      results.push(this.activateDomain(domainId));
    }
    return results;
  }

  /**
   * Set a domain to sovereign state (full autonomous control).
   */
  setSovereignState(domainId: OrchestratorDomainId): ActivationResult {
    const domain = this.state.domains.get(domainId);
    if (!domain) {
      return {
        success: false,
        domainId,
        previousState: 'DORMANT',
        newState: 'DORMANT',
        resonanceEmitted: 0,
        message: `Domain ${domainId} not found`,
      };
    }

    if (domain.state !== 'ACTIVE' && domain.state !== 'RESONATING') {
      return {
        success: false,
        domainId,
        previousState: domain.state,
        newState: domain.state,
        resonanceEmitted: 0,
        message: `Domain ${domainId} must be ACTIVE or RESONATING to become SOVEREIGN`,
      };
    }

    const previousState = domain.state;
    domain.state = 'SOVEREIGN';
    domain.phiAlignment = 1.0; // Perfect phi alignment for sovereign state

    this.updateSystemResonance();

    return {
      success: true,
      domainId,
      previousState,
      newState: 'SOVEREIGN',
      resonanceEmitted: domain.frequency / 500,
      message: `Domain ${domain.latinName} achieved sovereign state`,
    };
  }

  // ─── Command Execution ──────────────────────────────────────────────────────

  /**
   * Execute a command through a specific domain.
   */
  executeCommand(command: string, domainId: OrchestratorDomainId): CommandExecution {
    const domain = this.state.domains.get(domainId);
    if (!domain || domain.state === 'DORMANT') {
      return {
        id: `CMD_${Date.now()}`,
        command,
        domainId,
        status: 'FAILED',
        startTime: Date.now(),
        endTime: Date.now(),
        result: `Domain ${domainId} is not active`,
      };
    }

    const execution: CommandExecution = {
      id: `CMD_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      command,
      domainId,
      status: 'EXECUTING',
      startTime: Date.now(),
      endTime: null,
      result: null,
    };

    this.state.activeCommands.push(execution);
    domain.state = 'PROCESSING';

    // Simulate command execution
    setTimeout(() => {
      execution.status = 'COMPLETED';
      execution.endTime = Date.now();
      execution.result = `${domain.latinName}: Command "${command}" executed successfully`;
      domain.state = 'ACTIVE';
    }, Math.floor(HEARTBEAT_MS / 2));

    return execution;
  }

  /**
   * Route a command to the most appropriate domain.
   */
  routeCommand(command: string): CommandExecution {
    const lowerCommand = command.toLowerCase();
    let bestDomain: OrchestratorDomainId = 'IMPERIUM';
    let bestScore = 0;

    for (const domain of this.state.domains.values()) {
      const score = domain.capabilities.filter((cap) =>
        lowerCommand.includes(cap.split('-')[0])
      ).length;
      if (score > bestScore && domain.state !== 'DORMANT') {
        bestScore = score;
        bestDomain = domain.id;
      }
    }

    return this.executeCommand(command, bestDomain);
  }

  // ─── Queries ────────────────────────────────────────────────────────────────

  /**
   * Get all domains.
   */
  getAllDomains(): OrchestratorDomain[] {
    return Array.from(this.state.domains.values());
  }

  /**
   * Get a specific domain.
   */
  getDomain(domainId: OrchestratorDomainId): OrchestratorDomain | undefined {
    return this.state.domains.get(domainId);
  }

  /**
   * Get all active domains.
   */
  getActiveDomains(): OrchestratorDomain[] {
    return Array.from(this.state.domains.values()).filter(
      (d) => d.state !== 'DORMANT'
    );
  }

  /**
   * Get domains by state.
   */
  getDomainsByState(state: ActivationState): OrchestratorDomain[] {
    return Array.from(this.state.domains.values()).filter((d) => d.state === state);
  }

  /**
   * Get system resonance level.
   */
  getSystemResonance(): number {
    return this.state.systemResonance;
  }

  /**
   * Get phi coherence level.
   */
  getPhiCoherence(): number {
    return this.state.phiCoherence;
  }

  /**
   * Get active command count.
   */
  getActiveCommandCount(): number {
    return this.state.activeCommands.filter((c) => c.status === 'EXECUTING').length;
  }

  /**
   * Get command center state summary.
   */
  getStateSummary(): {
    totalDomains: number;
    activeDomains: number;
    sovereignDomains: number;
    totalActivations: number;
    systemResonance: number;
    phiCoherence: number;
  } {
    const activeDomains = this.getActiveDomains().length;
    const sovereignDomains = this.getDomainsByState('SOVEREIGN').length;

    return {
      totalDomains: this.state.domains.size,
      activeDomains,
      sovereignDomains,
      totalActivations: this.state.totalActivations,
      systemResonance: this.state.systemResonance,
      phiCoherence: this.state.phiCoherence,
    };
  }

  // ─── Internal ───────────────────────────────────────────────────────────────

  private updateSystemResonance(): void {
    const activeDomains = this.getActiveDomains();
    if (activeDomains.length === 0) {
      this.state.systemResonance = 0;
      return;
    }

    const totalFrequency = activeDomains.reduce((sum, d) => sum + d.frequency, 0);
    const avgFrequency = totalFrequency / activeDomains.length;
    const sovereignCount = this.getDomainsByState('SOVEREIGN').length;

    this.state.systemResonance =
      (avgFrequency / 1000) * (1 + sovereignCount * 0.1) * (PHI / (PHI + 1));
    this.state.phiCoherence =
      PHI * (activeDomains.length / this.state.domains.size);
    this.state.lastHeartbeat = Date.now();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

let commandCenterInstance: CommandCenterRegistry | null = null;

export function getCommandCenter(): CommandCenterRegistry {
  if (!commandCenterInstance) {
    commandCenterInstance = new CommandCenterRegistry();
  }
  return commandCenterInstance;
}

export function resetCommandCenter(): void {
  commandCenterInstance = null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get color for activation state.
 */
export function getActivationStateColor(state: ActivationState): string {
  switch (state) {
    case 'DORMANT':
      return '#6b7280';
    case 'AWAKENING':
      return '#f59e0b';
    case 'ACTIVE':
      return '#10b981';
    case 'PROCESSING':
      return '#3b82f6';
    case 'RESONATING':
      return '#8b5cf6';
    case 'SOVEREIGN':
      return '#ec4899';
    default:
      return '#6b7280';
  }
}

/**
 * Format domain status for display.
 */
export function formatDomainStatus(domain: OrchestratorDomain): string {
  return `${domain.latinName} [${domain.state}] — ${domain.tagline}`;
}
