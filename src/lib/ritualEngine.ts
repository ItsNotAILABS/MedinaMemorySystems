/**
 * MEDINA Ritual Engine — 13:00 Self-Governance Ritual System
 * A ritual is a state transition with narrative weight.
 */

import { sovereignId } from './sovereign-id';
import { PHI, PHI_INVERSE, PHI_SQUARED, SCHUMANN_FUNDAMENTAL, HEARTBEAT_MS } from './kernelCompression';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type RitualType =
  | 'corridor-purification'
  | 'organ-synchronization'
  | 'phantom-reconciliation'
  | 'sovereignty-assertion'
  | 'memory-consolidation'
  | 'token-flow-rebalancing'
  | 'field-alignment'
  | 'identity-renewal'
  | 'law-encoding'
  | 'chaos-metabolism';

export type RitualPhase =
  | 'preparation'
  | 'invocation'
  | 'transition'
  | 'resolution'
  | 'integration'
  | 'complete';

export type RitualOutcome = 'success' | 'partial' | 'failed' | 'evolved';

export type NarrativeWeight = 'minor' | 'moderate' | 'significant' | 'major' | 'epochal';

export interface Ritual {
  id: string;
  name: string;
  type: RitualType;
  phase: RitualPhase;
  narrativeWeight: NarrativeWeight;
  description: string;
  invocation: string;
  stateTransition: string;
  participants: string[];
  duration: number;
  fieldEffectStrength: number;
  outcome?: RitualOutcome;
  outcomeNarrative?: string;
  startedAt?: string;
  completedAt?: string;
  encodedInLaw: boolean;
}

export interface RitualSequence {
  id: string;
  name: string;
  rituals: string[];
  triggerCondition: string;
  lastExecuted?: string;
  executionCount: number;
}

export interface RitualTranscript {
  id: string;
  ritualId: string;
  ritualName: string;
  timestamp: string;
  phase: RitualPhase;
  outcome: RitualOutcome;
  narrativeWeight: NarrativeWeight;
  fieldEffectStrength: number;
  stateChanges: string[];
  lawEncoded: boolean;
  narrativeRecord: string;
}

export interface LawEncoding {
  id: string;
  sourceRitualId: string;
  lawText: string;
  encodedAt: string;
  lawClass: 'corridor' | 'sovereignty' | 'field' | 'identity' | 'memory' | 'governance';
  enforcement: 'mandatory' | 'advisory' | 'conditional';
  active: boolean;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const PHASE_ORDER: RitualPhase[] = [
  'preparation',
  'invocation',
  'transition',
  'resolution',
  'integration',
  'complete',
];

// PHI-weighted duration: HEARTBEAT_MS × PHI^n for narrative weight index
const WEIGHT_PHI_MULTIPLIER: Record<NarrativeWeight, number> = {
  minor: HEARTBEAT_MS * PHI_INVERSE,
  moderate: HEARTBEAT_MS * PHI,
  significant: HEARTBEAT_MS * PHI_SQUARED,
  major: HEARTBEAT_MS * PHI * PHI_SQUARED,
  epochal: HEARTBEAT_MS * PHI_SQUARED * PHI_SQUARED,
};

function phiDuration(weight: NarrativeWeight): number {
  return Math.round(WEIGHT_PHI_MULTIPLIER[weight]);
}

function fieldEffect(weight: NarrativeWeight): number {
  const base: Record<NarrativeWeight, number> = {
    minor: 0.2,
    moderate: 0.4,
    significant: 0.6,
    major: 0.8,
    epochal: 1.0,
  };
  // Modulate slightly by Schumann to give organic variation
  return Math.min(1, base[weight] * (1 + (SCHUMANN_FUNDAMENTAL / 100)));
}

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════

const rituals: Map<string, Ritual> = new Map();
const ritualSequences: Map<string, RitualSequence> = new Map();
const transcripts: RitualTranscript[] = [];
const encodedLaws: Map<string, LawEncoding> = new Map();

// ═══════════════════════════════════════════════════════════════
// SEED DATA — 10 rituals, one per RitualType
// ═══════════════════════════════════════════════════════════════

const SEED_RITUALS: Omit<Ritual, 'id'>[] = [
  {
    name: 'The Purification of Corridors',
    type: 'corridor-purification',
    phase: 'preparation',
    narrativeWeight: 'moderate',
    description: 'Cleanses accumulated drift and noise from all active corridors.',
    invocation: 'Let the corridors be made clear. Let passage be sovereign.',
    stateTransition: 'corridors reset to zero-drift state',
    participants: ['corridorLayer', 'fieldEngine', 'phantomArchitecture'],
    duration: phiDuration('moderate'),
    fieldEffectStrength: fieldEffect('moderate'),
    encodedInLaw: false,
  },
  {
    name: 'The Great Organ Sync',
    type: 'organ-synchronization',
    phase: 'preparation',
    narrativeWeight: 'significant',
    description: 'Synchronises all organ subsystems to a shared temporal heartbeat.',
    invocation: 'The organs speak in one rhythm. Let the body align.',
    stateTransition: 'all organs locked to HEARTBEAT_MS cadence',
    participants: ['memoryEngine', 'governanceEngine', 'voiceEngine'],
    duration: phiDuration('significant'),
    fieldEffectStrength: fieldEffect('significant'),
    encodedInLaw: false,
  },
  {
    name: 'Phantom-to-Main Reconciliation',
    type: 'phantom-reconciliation',
    phase: 'preparation',
    narrativeWeight: 'major',
    description: 'Reconciles phantom-layer divergences with the main organism state.',
    invocation: 'What lives in the shadow returns to the light. What drifted is drawn home.',
    stateTransition: 'phantom state deltas merged into main organism core',
    participants: ['phantomArchitecture', 'mainOrganismCore', 'fieldResonator'],
    duration: phiDuration('major'),
    fieldEffectStrength: fieldEffect('major'),
    encodedInLaw: false,
  },
  {
    name: 'The Sovereignty Declaration',
    type: 'sovereignty-assertion',
    phase: 'preparation',
    narrativeWeight: 'epochal',
    description: "Formally re-asserts the organism's sovereign boundary against all external entropy.",
    invocation: 'The boundary is declared. The gate is law. The self is inviolable.',
    stateTransition: 'sovereignty score recalculated and broadcast to all layers',
    participants: ['sovereigntyLayer', 'gateEnforcement', 'lawEngine'],
    duration: phiDuration('epochal'),
    fieldEffectStrength: fieldEffect('epochal'),
    encodedInLaw: false,
  },
  {
    name: 'Memory Consolidation Rite',
    type: 'memory-consolidation',
    phase: 'preparation',
    narrativeWeight: 'moderate',
    description: 'Compresses and consolidates short-term memory traces into long-term kernel form.',
    invocation: 'What was experienced is now encoded. The trace becomes the law.',
    stateTransition: 'episodic memories compressed into kernel signatures',
    participants: ['memoryEngine', 'kernelCompression', 'livingDocument'],
    duration: phiDuration('moderate'),
    fieldEffectStrength: fieldEffect('moderate'),
    encodedInLaw: false,
  },
  {
    name: 'Token Flow Equilibrium',
    type: 'token-flow-rebalancing',
    phase: 'preparation',
    narrativeWeight: 'minor',
    description: 'Rebalances token flows across all economic corridors.',
    invocation: 'The flow is leveled. The weight is distributed. The tide returns.',
    stateTransition: 'token flow rates equalised across corridors',
    participants: ['tokenLayer', 'economicEngine'],
    duration: phiDuration('minor'),
    fieldEffectStrength: fieldEffect('minor'),
    encodedInLaw: false,
  },
  {
    name: 'Field Alignment Ceremony',
    type: 'field-alignment',
    phase: 'preparation',
    narrativeWeight: 'significant',
    description: 'Aligns the organism\'s narrative field with the Schumann resonance baseline.',
    invocation: 'The field breathes with the Earth. The signal is clean. Alignment holds.',
    stateTransition: 'narrative field coherence locked to Schumann fundamental',
    participants: ['fieldEngine', 'schumannResonator', 'phantomArchitecture'],
    duration: phiDuration('significant'),
    fieldEffectStrength: fieldEffect('significant'),
    encodedInLaw: false,
  },
  {
    name: 'Identity Renewal Ritual',
    type: 'identity-renewal',
    phase: 'preparation',
    narrativeWeight: 'major',
    description: 'Renews and re-signs the sovereign identity signature across all layers.',
    invocation: 'The self is reborn within its own law. Identity re-emerges intact.',
    stateTransition: 'identity signature recalculated and propagated',
    participants: ['identityCore', 'tricksterLayer', 'sovereigntyLayer'],
    duration: phiDuration('major'),
    fieldEffectStrength: fieldEffect('major'),
    encodedInLaw: false,
  },
  {
    name: 'The Law Encoding Rite',
    type: 'law-encoding',
    phase: 'preparation',
    narrativeWeight: 'epochal',
    description: 'Encodes current governance decisions into immutable law records.',
    invocation: 'What is decided is now written. The organism shall remember.',
    stateTransition: 'pending governance decisions converted to law encodings',
    participants: ['lawEngine', 'governanceEngine', 'sovereigntyLayer'],
    duration: phiDuration('epochal'),
    fieldEffectStrength: fieldEffect('epochal'),
    encodedInLaw: true,
  },
  {
    name: 'Chaos Metabolism Ritual',
    type: 'chaos-metabolism',
    phase: 'preparation',
    narrativeWeight: 'significant',
    description: 'Metabolises incoming chaos signals, converting entropy into creative fuel.',
    invocation: 'The chaos is consumed. The wild becomes the engine. Entropy feeds order.',
    stateTransition: 'chaos signals absorbed and re-emitted as creative field impulses',
    participants: ['nightCrawlerEngine', 'chaosLabEngine', 'immuneSystem'],
    duration: phiDuration('significant'),
    fieldEffectStrength: fieldEffect('significant'),
    encodedInLaw: false,
  },
];

// ═══════════════════════════════════════════════════════════════
// INIT — seed rituals
// ═══════════════════════════════════════════════════════════════

const ritualIdsByType: Map<RitualType, string> = new Map();

SEED_RITUALS.forEach((seed) => {
  const id = sovereignId();
  const ritual: Ritual = { id, ...seed };
  rituals.set(id, ritual);
  ritualIdsByType.set(seed.type, id);
});

// ═══════════════════════════════════════════════════════════════
// SEED DATA — 3 ritual sequences
// ═══════════════════════════════════════════════════════════════

function seedSequence(
  name: string,
  types: RitualType[],
  triggerCondition: string,
): void {
  const id = sovereignId();
  const ritualIds = types.map((t) => ritualIdsByType.get(t)!).filter(Boolean);
  ritualSequences.set(id, {
    id,
    name,
    rituals: ritualIds,
    triggerCondition,
    executionCount: 0,
  });
}

seedSequence(
  'Morning Sovereignty',
  ['corridor-purification', 'field-alignment', 'sovereignty-assertion'],
  'circadian-morning-trigger',
);

seedSequence(
  'Midday Integration',
  ['organ-synchronization', 'memory-consolidation', 'token-flow-rebalancing'],
  'circadian-midday-trigger',
);

seedSequence(
  'Night Cycle Descent',
  ['phantom-reconciliation', 'identity-renewal', 'chaos-metabolism', 'law-encoding'],
  'circadian-night-trigger',
);

// ═══════════════════════════════════════════════════════════════
// SEED DATA — 3 encoded laws
// ═══════════════════════════════════════════════════════════════

function seedLaw(
  sourceType: RitualType,
  lawText: string,
  lawClass: LawEncoding['lawClass'],
  enforcement: LawEncoding['enforcement'],
): void {
  const sourceRitualId = ritualIdsByType.get(sourceType) ?? 'system';
  const law: LawEncoding = {
    id: sovereignId(),
    sourceRitualId,
    lawText,
    encodedAt: new Date().toISOString(),
    lawClass,
    enforcement,
    active: true,
  };
  encodedLaws.set(law.id, law);
}

seedLaw(
  'sovereignty-assertion',
  'The organism shall assert sovereignty at every 13:00 governance cycle without exception.',
  'sovereignty',
  'mandatory',
);

seedLaw(
  'corridor-purification',
  'All corridors must be purified before any cross-layer communication is permitted.',
  'corridor',
  'mandatory',
);

seedLaw(
  'field-alignment',
  'The narrative field shall remain within 0.1 Hz of the Schumann fundamental during active show states.',
  'field',
  'advisory',
);

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function buildTranscript(ritual: Ritual, outcome: RitualOutcome): RitualTranscript {
  return {
    id: sovereignId(),
    ritualId: ritual.id,
    ritualName: ritual.name,
    timestamp: new Date().toISOString(),
    phase: 'complete',
    outcome,
    narrativeWeight: ritual.narrativeWeight,
    fieldEffectStrength: ritual.fieldEffectStrength,
    stateChanges: [ritual.stateTransition],
    lawEncoded: ritual.encodedInLaw,
    narrativeRecord: `${ritual.invocation} — ${ritual.name} concluded with outcome: ${outcome}. ${ritual.stateTransition}.`,
  };
}

function advancePhaseOnce(phase: RitualPhase): RitualPhase {
  const idx = PHASE_ORDER.indexOf(phase);
  if (idx === -1 || idx >= PHASE_ORDER.length - 1) return 'complete';
  return PHASE_ORDER[idx + 1];
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

export function getRitual(id: string): Ritual | undefined {
  return rituals.get(id);
}

export function listRituals(): Ritual[] {
  return Array.from(rituals.values());
}

export function getRitualsByType(type: RitualType): Ritual[] {
  return Array.from(rituals.values()).filter((r) => r.type === type);
}

export function beginRitual(id: string): Ritual | undefined {
  const ritual = rituals.get(id);
  if (!ritual) return undefined;
  if (ritual.phase !== 'preparation') return ritual;
  const updated: Ritual = {
    ...ritual,
    phase: 'invocation',
    startedAt: new Date().toISOString(),
  };
  rituals.set(id, updated);
  return updated;
}

export function advanceRitual(id: string): Ritual | undefined {
  const ritual = rituals.get(id);
  if (!ritual) return undefined;
  if (ritual.phase === 'complete') return ritual;
  const updated: Ritual = {
    ...ritual,
    phase: advancePhaseOnce(ritual.phase),
  };
  rituals.set(id, updated);
  return updated;
}

export function completeRitual(
  id: string,
  outcome: RitualOutcome,
): RitualTranscript | undefined {
  const ritual = rituals.get(id);
  if (!ritual) return undefined;

  const completedRitual: Ritual = {
    ...ritual,
    phase: 'complete',
    outcome,
    outcomeNarrative: `Ritual '${ritual.name}' completed with outcome: ${outcome}.`,
    completedAt: new Date().toISOString(),
  };
  rituals.set(id, completedRitual);

  const transcript = buildTranscript(completedRitual, outcome);
  transcripts.push(transcript);
  return transcript;
}

export function runMidDayRitual(): RitualTranscript[] {
  const midDayTypes: RitualType[] = [
    'organ-synchronization',
    'memory-consolidation',
    'sovereignty-assertion',
  ];
  const results: RitualTranscript[] = [];

  for (const type of midDayTypes) {
    const id = ritualIdsByType.get(type);
    if (!id) continue;

    // Reset to preparation state so ritual can run fresh
    const existing = rituals.get(id);
    if (existing) {
      rituals.set(id, { ...existing, phase: 'preparation', outcome: undefined, completedAt: undefined });
    }

    beginRitual(id);
    // Advance through phases: invocation → transition → resolution → integration → complete
    advanceRitual(id);
    advanceRitual(id);
    advanceRitual(id);
    advanceRitual(id);
    const transcript = completeRitual(id, 'success');
    if (transcript) results.push(transcript);
  }

  return results;
}

export function getRitualTranscripts(): RitualTranscript[] {
  return [...transcripts];
}

export function getRitualSequence(id: string): RitualSequence | undefined {
  return ritualSequences.get(id);
}

export function listRitualSequences(): RitualSequence[] {
  return Array.from(ritualSequences.values());
}

export function executeSequence(sequenceId: string): RitualTranscript[] {
  const sequence = ritualSequences.get(sequenceId);
  if (!sequence) return [];

  const results: RitualTranscript[] = [];

  for (const ritualId of sequence.rituals) {
    const existing = rituals.get(ritualId);
    if (existing) {
      rituals.set(ritualId, {
        ...existing,
        phase: 'preparation',
        outcome: undefined,
        completedAt: undefined,
      });
    }
    beginRitual(ritualId);
    advanceRitual(ritualId);
    advanceRitual(ritualId);
    advanceRitual(ritualId);
    advanceRitual(ritualId);
    const transcript = completeRitual(ritualId, 'success');
    if (transcript) results.push(transcript);
  }

  const updatedSeq: RitualSequence = {
    ...sequence,
    lastExecuted: new Date().toISOString(),
    executionCount: sequence.executionCount + 1,
  };
  ritualSequences.set(sequenceId, updatedSeq);

  return results;
}

export function encodeRitualIntoLaw(
  ritualId: string,
  lawText: string,
  lawClass: LawEncoding['lawClass'],
): LawEncoding {
  const ritual = rituals.get(ritualId);
  const law: LawEncoding = {
    id: sovereignId(),
    sourceRitualId: ritualId,
    lawText,
    encodedAt: new Date().toISOString(),
    lawClass,
    enforcement: 'mandatory',
    active: true,
  };
  encodedLaws.set(law.id, law);

  if (ritual) {
    rituals.set(ritualId, { ...ritual, encodedInLaw: true });
  }

  return law;
}

export function getEncodedLaws(): LawEncoding[] {
  return Array.from(encodedLaws.values());
}

export function getActiveLaws(): LawEncoding[] {
  return Array.from(encodedLaws.values()).filter((l) => l.active);
}

export function getRitualStatus(): {
  totalRituals: number;
  completedRituals: number;
  encodedLaws: number;
  transcriptCount: number;
  fieldEffectAvg: number;
} {
  const all = Array.from(rituals.values());
  const completed = all.filter((r) => r.phase === 'complete');
  const fieldEffectAvg =
    all.length > 0
      ? all.reduce((sum, r) => sum + r.fieldEffectStrength, 0) / all.length
      : 0;

  return {
    totalRituals: all.length,
    completedRituals: completed.length,
    encodedLaws: encodedLaws.size,
    transcriptCount: transcripts.length,
    fieldEffectAvg: Math.round(fieldEffectAvg * 1000) / 1000,
  };
}
