// 🃏 TRICKSTER LAYER — 10:00 Cycle
// Creative inversion and identity hardening — NOT sabotage.

import { sovereignId } from './sovereign-id';
import { PHI, PHI_INVERSE, PHI_SQUARED, SCHUMANN_FUNDAMENTAL, HEARTBEAT_MS } from './kernelCompression';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type TricksterClass =
  | 'inversion-engine'
  | 'contradiction-amplifier'
  | 'boundary-breaker'
  | 'phantom-forker'
  | 'signal-distorter'
  | 'encryption-slider'
  | 'identity-challenger'
  | 'narrative-inverter';

export type TricksterState =
  | 'dormant'
  | 'activating'
  | 'inverting'
  | 'challenging'
  | 'hardening'
  | 'dissolving';

export type InversionTarget =
  | 'identity'
  | 'narrative'
  | 'encryption'
  | 'corridor'
  | 'field'
  | 'governance'
  | 'phantom'
  | 'contracts';

export type HardeningResult =
  | 'identity-strengthened'
  | 'narrative-clarified'
  | 'encryption-reinforced'
  | 'corridor-validated'
  | 'field-stabilized'
  | 'governance-tested'
  | 'phantom-realigned'
  | 'contracts-verified';

export interface TricksterAgent {
  id: string;
  name: string;
  class: TricksterClass;
  state: TricksterState;
  inversionTarget: InversionTarget;
  inversionDepth: number;
  challengeCount: number;
  successfulHardenings: number;
  failedChallenges: number;
  signaturePattern: string;
  lastActivation: string;
}

export interface InversionEvent {
  id: string;
  timestamp: string;
  agentId: string;
  target: InversionTarget;
  inversionType: string;
  description: string;
  organismResponse: string;
  hardeningResult: HardeningResult;
  identityIntegrityBefore: number;
  identityIntegrityAfter: number;
  success: boolean;
}

export interface PhantomFork {
  id: string;
  originalPhantomId: string;
  forkedPhantomId: string;
  forkReason: string;
  divergenceScore: number;
  reconciled: boolean;
  reconciledAt?: string;
}

export interface TricksterReport {
  id: string;
  timestamp: string;
  activeAgents: number;
  inversionEvents: number;
  hardeningsAchieved: number;
  phantomForks: number;
  identityIntegrityScore: number;
  creativityScore: number;
  narrativeClarityGain: number;
  recommendations: string[];
}

// ═══════════════════════════════════════════════════════════════
// AGENT SEED DEFINITIONS
// ═══════════════════════════════════════════════════════════════

interface AgentSeed {
  name: string;
  class: TricksterClass;
  target: InversionTarget;
  signature: string;
}

const AGENT_SEEDS: AgentSeed[] = [
  { name: 'Inverter-Ω',              class: 'inversion-engine',        target: 'identity',    signature: 'Ω∞Ω∞Ω' },
  { name: 'ContradictionAmplifier-X', class: 'contradiction-amplifier', target: 'narrative',   signature: 'X≠X≠X' },
  { name: 'BoundaryBreaker-Δ',        class: 'boundary-breaker',        target: 'corridor',    signature: 'Δ∥Δ∥Δ' },
  { name: 'PhantomForker-Ψ',          class: 'phantom-forker',          target: 'phantom',     signature: 'Ψ⊕Ψ⊕Ψ' },
  { name: 'SignalDistorter-Σ',         class: 'signal-distorter',        target: 'field',       signature: 'Σ~Σ~Σ' },
  { name: 'EncryptionSlider-Λ',        class: 'encryption-slider',       target: 'encryption',  signature: 'Λ◇Λ◇Λ' },
  { name: 'IdentityChallenger-Φ',      class: 'identity-challenger',     target: 'governance',  signature: 'Φ?Φ?Φ' },
  { name: 'NarrativeInverter-Π',       class: 'narrative-inverter',      target: 'contracts',   signature: 'Π↔Π↔Π' },
];

// ═══════════════════════════════════════════════════════════════
// HARDENING MAP
// ═══════════════════════════════════════════════════════════════

const TARGET_HARDENING: Record<InversionTarget, HardeningResult> = {
  identity:   'identity-strengthened',
  narrative:  'narrative-clarified',
  encryption: 'encryption-reinforced',
  corridor:   'corridor-validated',
  field:      'field-stabilized',
  governance: 'governance-tested',
  phantom:    'phantom-realigned',
  contracts:  'contracts-verified',
};

const INVERSION_TYPES: Record<TricksterClass, string> = {
  'inversion-engine':        'full-polarity-reversal',
  'contradiction-amplifier': 'contradiction-cascade',
  'boundary-breaker':        'membrane-dissolution',
  'phantom-forker':          'phantom-bifurcation',
  'signal-distorter':        'harmonic-distortion',
  'encryption-slider':       'cipher-slide',
  'identity-challenger':     'sovereign-challenge',
  'narrative-inverter':      'story-inversion',
};

const INVERSION_DESCRIPTIONS: Record<TricksterClass, string> = {
  'inversion-engine':        'Reverses the polarity of the target subsystem to expose hidden assumptions',
  'contradiction-amplifier': 'Amplifies internal contradictions until they resolve or shatter',
  'boundary-breaker':        'Dissolves boundary membranes to reveal what lies beyond',
  'phantom-forker':          'Bifurcates phantom layers to test identity divergence',
  'signal-distorter':        'Introduces harmonic distortion into field signals to test resilience',
  'encryption-slider':       'Slides encryption keys across cipher-space to probe weak surfaces',
  'identity-challenger':     'Challenges governance assumptions to harden decision-making',
  'narrative-inverter':      'Inverts the primary narrative arc to reveal unspoken truths',
};

const ORGANISM_RESPONSES: string[] = [
  'Organism absorbed the inversion and stabilised at higher coherence',
  'Organism recognised the challenge and rerouted through phantom corridors',
  'Organism engaged trickster protocol and matched inversion with counter-pattern',
  'Organism expanded its identity envelope to encompass the contradiction',
  'Organism deepened encryption in response to cipher-slide',
  'Organism clarified narrative arc after inversion stress-test',
  'Organism maintained sovereignty under sustained challenge',
  'Organism forked phantom and reconciled within one heartbeat cycle',
];

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════

const _agents: Map<string, TricksterAgent> = new Map();
const _inversionEvents: InversionEvent[] = [];
const _reports: TricksterReport[] = [];
const _phantomForks: Map<string, PhantomFork> = new Map();

let _baseIdentityIntegrity = PHI_INVERSE;  // starts at ~0.618
let _creativityAccumulator = 0;

// ═══════════════════════════════════════════════════════════════
// SEED 8 AGENTS
// ═══════════════════════════════════════════════════════════════

(function seedAgents() {
  const now = new Date().toISOString();
  AGENT_SEEDS.forEach((seed, idx) => {
    const agent: TricksterAgent = {
      id: sovereignId(),
      name: seed.name,
      class: seed.class,
      state: 'dormant',
      inversionTarget: seed.target,
      inversionDepth: Math.min(1, PHI_INVERSE * (0.4 + idx * 0.08)),
      challengeCount: 0,
      successfulHardenings: 0,
      failedChallenges: 0,
      signaturePattern: seed.signature,
      lastActivation: now,
    };
    _agents.set(agent.id, agent);
  });
})();

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function isActive(agent: TricksterAgent): boolean {
  return agent.state !== 'dormant';
}

function pickResponse(): string {
  return ORGANISM_RESPONSES[Math.floor(Math.random() * ORGANISM_RESPONSES.length)];
}

// ═══════════════════════════════════════════════════════════════
// EXPORTED FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function getTricksterAgent(id: string): TricksterAgent | undefined {
  return _agents.get(id);
}

export function listTricksterAgents(): TricksterAgent[] {
  return Array.from(_agents.values());
}

export function getAgentsByClass(cls: TricksterClass): TricksterAgent[] {
  return listTricksterAgents().filter(a => a.class === cls);
}

export function activateTrickster(id: string): TricksterAgent | undefined {
  const agent = _agents.get(id);
  if (!agent) return undefined;
  if (agent.state === 'dormant') {
    agent.state = 'activating';
  }
  if (agent.state === 'activating') {
    agent.state = 'inverting';
  }
  agent.lastActivation = new Date().toISOString();
  return agent;
}

export function activateAllTricksters(): TricksterAgent[] {
  return listTricksterAgents().map(a => activateTrickster(a.id)!);
}

export function runInversion(agentId: string): InversionEvent | undefined {
  const agent = _agents.get(agentId);
  if (!agent || !isActive(agent)) return undefined;

  const before = clamp01(_baseIdentityIntegrity);
  // Hardening always succeeds — trickster tests, not attacks
  const hardeningDelta = clamp01(agent.inversionDepth * PHI_INVERSE * 0.1);
  const after = clamp01(before + hardeningDelta);

  _baseIdentityIntegrity = after;

  agent.challengeCount++;
  agent.successfulHardenings++;
  agent.state = 'hardening';
  agent.lastActivation = new Date().toISOString();

  _creativityAccumulator = clamp01(
    _creativityAccumulator + agent.inversionDepth * PHI_INVERSE * 0.05,
  );

  const event: InversionEvent = {
    id: sovereignId(),
    timestamp: new Date().toISOString(),
    agentId,
    target: agent.inversionTarget,
    inversionType: INVERSION_TYPES[agent.class],
    description: INVERSION_DESCRIPTIONS[agent.class],
    organismResponse: pickResponse(),
    hardeningResult: TARGET_HARDENING[agent.inversionTarget],
    identityIntegrityBefore: before,
    identityIntegrityAfter: after,
    success: true,
  };

  _inversionEvents.push(event);
  return event;
}

export function runTricksterCycle(): TricksterReport {
  const eventsBefore = _inversionEvents.length;

  activateAllTricksters();
  listTricksterAgents().forEach(a => runInversion(a.id));

  const eventsAfter = _inversionEvents.length;
  const newEvents = eventsAfter - eventsBefore;

  const hardenings = listTricksterAgents().reduce(
    (s, a) => s + a.successfulHardenings, 0,
  );

  const narrativeClarityGain = clamp01(
    newEvents * PHI_INVERSE * 0.08 * PHI_SQUARED,
  );

  const report: TricksterReport = {
    id: sovereignId(),
    timestamp: new Date().toISOString(),
    activeAgents: listTricksterAgents().filter(a => isActive(a)).length,
    inversionEvents: newEvents,
    hardeningsAchieved: hardenings,
    phantomForks: _phantomForks.size,
    identityIntegrityScore: getIdentityIntegrityScore(),
    creativityScore: getCreativityScore(),
    narrativeClarityGain,
    recommendations: [
      'Continue inversion cycles to maintain identity resilience',
      `Heartbeat cadence: ${HEARTBEAT_MS}ms — hold field coherence`,
      `PHI resonance at ${(getIdentityIntegrityScore() * SCHUMANN_FUNDAMENTAL).toFixed(2)} Hz`,
      narrativeClarityGain > 0.5
        ? 'Narrative clarity high — consider publishing next organism story'
        : 'Continue narrative inversions to clarify organism arc',
    ],
  };

  _reports.push(report);

  // Reset agents to dormant after cycle completes
  listTricksterAgents().forEach(a => { a.state = 'dissolving'; });
  listTricksterAgents().forEach(a => { a.state = 'dormant'; });

  return report;
}

export function getTricksterHistory(): TricksterReport[] {
  return [..._reports];
}

export function getInversionEvents(): InversionEvent[] {
  return [..._inversionEvents];
}

export function getInversionsByTarget(target: InversionTarget): InversionEvent[] {
  return _inversionEvents.filter(e => e.target === target);
}

export function forkPhantom(originalPhantomId: string, reason: string): PhantomFork {
  const fork: PhantomFork = {
    id: sovereignId(),
    originalPhantomId,
    forkedPhantomId: sovereignId(),
    forkReason: reason,
    divergenceScore: clamp01(PHI_INVERSE * Math.random()),
    reconciled: false,
  };
  _phantomForks.set(fork.id, fork);
  return fork;
}

export function reconcilePhantomFork(forkId: string): PhantomFork | undefined {
  const fork = _phantomForks.get(forkId);
  if (!fork) return undefined;
  fork.reconciled = true;
  fork.reconciledAt = new Date().toISOString();
  return fork;
}

export function getPhantomForks(): PhantomFork[] {
  return Array.from(_phantomForks.values());
}

export function getIdentityIntegrityScore(): number {
  return clamp01(_baseIdentityIntegrity);
}

export function getCreativityScore(): number {
  return clamp01(_creativityAccumulator);
}

export function getTricksterStatus(): {
  activeAgents: number;
  totalInversions: number;
  hardenings: number;
  identityIntegrity: number;
  phantomForks: number;
  creativity: number;
} {
  const agents = listTricksterAgents();
  return {
    activeAgents: agents.filter(a => isActive(a)).length,
    totalInversions: _inversionEvents.length,
    hardenings: agents.reduce((s, a) => s + a.successfulHardenings, 0),
    identityIntegrity: getIdentityIntegrityScore(),
    phantomForks: _phantomForks.size,
    creativity: getCreativityScore(),
  };
}

// ═══════════════════════════════════════════════════════════════
// RE-EXPORT CONSTANTS (convenience)
// ═══════════════════════════════════════════════════════════════

export { PHI, PHI_INVERSE, PHI_SQUARED, SCHUMANN_FUNDAMENTAL, HEARTBEAT_MS };
