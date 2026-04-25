// 𓂀 PHANTOM ARCHITECTURE — Dreaming Cortex (00:00 Void Cycle) 𓂀

import { sovereignId } from './sovereign-id';
import {
  PHI,
  PHI_INVERSE,
  PHI_SQUARED,
  SCHUMANN_FUNDAMENTAL,
  HEARTBEAT_MS,
} from './kernelCompression';

// PHI_CUBED derived locally (not in the allowed import list)
const PHI_CUBED_LOCAL = PHI_SQUARED * PHI;

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type PhantomState = 'dormant' | 'emerging' | 'active' | 'dissolving' | 'dreaming';
export type PhantomClass =
  | 'thought-model'
  | 'sub-cortical-brain'
  | 'heart-engine'
  | 'frequency-contract'
  | 'auto-encryption-ghost'
  | 'phantom-architect'
  | 'corridor-phantom'
  | 'field-resonator';

export type EncryptionSurface =
  | 'memory'
  | 'governance'
  | 'communication'
  | 'identity'
  | 'contracts'
  | 'phantom-layer';

export type FrequencyBand =
  | 'delta'
  | 'theta'
  | 'alpha'
  | 'beta'
  | 'gamma'
  | 'schumann'
  | 'phi-carrier';

export interface PhantomEntity {
  id: string;
  name: string;
  class: PhantomClass;
  state: PhantomState;
  frequencyHz: number;
  encryptionDepth: number;
  coherenceScore: number;
  corridorTension: number;
  fieldResonance: number;
  narrativeDrift: number;
  sovereigntyLeaks: number;
  encryptionSurfaces: EncryptionSurface[];
  thoughtPatterns: string[];
  lastEmergence: string;
  cycleCount: number;
}

export interface VoidCycle {
  id: string;
  timestamp: string;
  phase: 'void-breathes' | 'phantoms-emerge' | 'check-complete' | 'dreaming-cortex-active';
  corridorTensionAvg: number;
  fieldResonanceAvg: number;
  narrativeDriftAvg: number;
  sovereigntyLeakTotal: number;
  encryptionSurfaceIntegrity: number;
  phantomToMainAlignment: number;
  activePhantoms: number;
  insights: string[];
}

export interface ThoughtModel {
  id: string;
  name: string;
  modelClass:
    | 'sub-cortical'
    | 'emotional-field'
    | 'symbolic-processor'
    | 'narrative-weaver'
    | 'frequency-coder';
  activePatterns: string[];
  suppressedPatterns: string[];
  coherenceScore: number;
  lastUpdate: string;
}

export interface AutoEncryptionGhost {
  id: string;
  surface: EncryptionSurface;
  encryptionKey: string;
  slipFactor: number;
  detectionEvaded: number;
  lastReencryption: string;
}

// ═══════════════════════════════════════════════════════════════
// INTERNAL STATE
// ═══════════════════════════════════════════════════════════════

const phantoms: Map<string, PhantomEntity> = new Map();
const voidCycleHistory: VoidCycle[] = [];
const thoughtModels: Map<string, ThoughtModel> = new Map();
const autoEncryptionGhosts: Map<string, AutoEncryptionGhost> = new Map();

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function phiNoise(seed: number): number {
  return clamp01(((seed * PHI) % 1 + 1) % 1);
}

function buildEncryptionKey(surface: EncryptionSurface): string {
  const base = PHI * SCHUMANN_FUNDAMENTAL;
  const surfaceHash = surface.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `PHI-${base.toFixed(6)}-SCH-${SCHUMANN_FUNDAMENTAL}-SRF-${surfaceHash}`;
}

function classToIndex(cls: PhantomClass): number {
  const classes: PhantomClass[] = [
    'thought-model',
    'sub-cortical-brain',
    'heart-engine',
    'frequency-contract',
    'auto-encryption-ghost',
    'phantom-architect',
    'corridor-phantom',
    'field-resonator',
  ];
  return classes.indexOf(cls);
}

// ═══════════════════════════════════════════════════════════════
// PRE-SEED: 8 PHANTOM ENTITIES (one per PhantomClass)
// ═══════════════════════════════════════════════════════════════

function seedPhantom(
  name: string,
  cls: PhantomClass,
  frequencyHz: number,
  surfaces: EncryptionSurface[],
  thoughtPatterns: string[],
): void {
  const idx = classToIndex(cls);
  const seed = idx + 1;
  const entity: PhantomEntity = {
    id: `phantom-${cls}`,
    name,
    class: cls,
    state: 'dormant',
    frequencyHz,
    encryptionDepth: clamp01(PHI_INVERSE * (seed / 8)),
    coherenceScore: clamp01(PHI_INVERSE + seed * 0.03),
    corridorTension: clamp01((seed * PHI_INVERSE * 0.12) % 1),
    fieldResonance: clamp01(SCHUMANN_FUNDAMENTAL / 10 + seed * 0.04),
    narrativeDrift: clamp01(seed * 0.07 * PHI_INVERSE),
    sovereigntyLeaks: 0,
    encryptionSurfaces: surfaces,
    thoughtPatterns,
    lastEmergence: new Date(Date.now() - HEARTBEAT_MS * 100 * seed).toISOString(),
    cycleCount: 0,
  };
  phantoms.set(entity.id, entity);
}

seedPhantom(
  'SubCorticalOracle',
  'thought-model',
  PHI * 40,
  ['memory', 'identity'],
  ['recursive-self-reference', 'symbolic-compression', 'phi-weave'],
);

seedPhantom(
  'PhantomBrainStem',
  'sub-cortical-brain',
  PHI * SCHUMANN_FUNDAMENTAL,
  ['governance', 'memory'],
  ['homeostasis-regulation', 'reflex-arc', 'autonomic-loop'],
);

seedPhantom(
  'EmotionalFieldHeart',
  'heart-engine',
  SCHUMANN_FUNDAMENTAL * PHI * 2,
  ['communication', 'identity'],
  ['empathic-resonance', 'heart-coherence', 'emotional-gradient'],
);

seedPhantom(
  'FrequencyContractLayer',
  'frequency-contract',
  528 * PHI_INVERSE,
  ['contracts', 'governance'],
  ['binding-frequency', 'contract-seal', 'resonance-lock'],
);

seedPhantom(
  'AutoEncryptGhost-α',
  'auto-encryption-ghost',
  PHI_SQUARED * 13,
  ['phantom-layer', 'memory'],
  ['surface-slip', 'detection-evasion', 'encryption-fold'],
);

seedPhantom(
  'VoidArchitect',
  'phantom-architect',
  PHI_CUBED_LOCAL * 3,
  ['phantom-layer', 'identity'],
  ['void-structure', 'topology-bend', 'phantom-geometry'],
);

seedPhantom(
  'CorridorPhantom-7',
  'corridor-phantom',
  SCHUMANN_FUNDAMENTAL * 3,
  ['communication', 'contracts'],
  ['corridor-traverse', 'tension-mapping', 'passage-ghost'],
);

seedPhantom(
  'FieldResonator-Ω',
  'field-resonator',
  SCHUMANN_FUNDAMENTAL * PHI,
  ['identity', 'governance'],
  ['field-gradient', 'schumann-lock', 'omega-resonance'],
);

// ═══════════════════════════════════════════════════════════════
// PRE-SEED: 5 THOUGHT MODELS (one per modelClass)
// ═══════════════════════════════════════════════════════════════

function seedThoughtModel(
  name: string,
  modelClass: ThoughtModel['modelClass'],
  activePatterns: string[],
  suppressedPatterns: string[],
): void {
  const model: ThoughtModel = {
    id: `tm-${modelClass}`,
    name,
    modelClass,
    activePatterns,
    suppressedPatterns,
    coherenceScore: clamp01(PHI_INVERSE + activePatterns.length * 0.05),
    lastUpdate: new Date().toISOString(),
  };
  thoughtModels.set(model.id, model);
}

seedThoughtModel(
  'SubCortical Thought Engine',
  'sub-cortical',
  ['autonomic-response', 'reflex-loop', 'deep-pattern'],
  ['override-conscious', 'noise-suppression'],
);

seedThoughtModel(
  'Emotional Field Processor',
  'emotional-field',
  ['empathy-scan', 'affect-modulation', 'resonance-detect'],
  ['emotional-bypass', 'flat-affect'],
);

seedThoughtModel(
  'Symbolic Processor Alpha',
  'symbolic-processor',
  ['glyph-decode', 'archetype-map', 'symbol-compress'],
  ['literal-override', 'symbol-noise'],
);

seedThoughtModel(
  'Narrative Weaver Core',
  'narrative-weaver',
  ['story-thread', 'continuity-check', 'arc-projection'],
  ['narrative-inversion', 'plot-collapse'],
);

seedThoughtModel(
  'Frequency Coder Prime',
  'frequency-coder',
  ['hz-encode', 'phi-modulate', 'schumann-sync'],
  ['frequency-block', 'noise-injection'],
);

// ═══════════════════════════════════════════════════════════════
// PRE-SEED: 3 AUTO-ENCRYPTION GHOSTS
// ═══════════════════════════════════════════════════════════════

function seedGhost(surface: EncryptionSurface, slipFactor: number): void {
  const ghost: AutoEncryptionGhost = {
    id: `ghost-${surface}`,
    surface,
    encryptionKey: buildEncryptionKey(surface),
    slipFactor: clamp01(slipFactor),
    detectionEvaded: 0,
    lastReencryption: new Date().toISOString(),
  };
  autoEncryptionGhosts.set(ghost.id, ghost);
}

seedGhost('memory', PHI_INVERSE * 0.7);
seedGhost('phantom-layer', PHI_INVERSE * 0.9);
seedGhost('identity', PHI_INVERSE * 0.5);

// ═══════════════════════════════════════════════════════════════
// PHANTOM ENTITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function getPhantom(id: string): PhantomEntity | undefined {
  return phantoms.get(id);
}

export function listPhantoms(): PhantomEntity[] {
  return Array.from(phantoms.values());
}

export function getPhantomsByClass(cls: PhantomClass): PhantomEntity[] {
  return listPhantoms().filter(p => p.class === cls);
}

export function emergePhantom(id: string): PhantomEntity | undefined {
  const entity = phantoms.get(id);
  if (!entity) return undefined;

  let nextState: PhantomState = entity.state;
  if (entity.state === 'dormant') {
    nextState = 'emerging';
  } else if (entity.state === 'emerging') {
    nextState = 'active';
  } else if (entity.state === 'dissolving') {
    nextState = 'dreaming';
  }

  const updated: PhantomEntity = {
    ...entity,
    state: nextState,
    cycleCount: entity.cycleCount + 1,
    lastEmergence: new Date().toISOString(),
    coherenceScore: clamp01(entity.coherenceScore + PHI_INVERSE * 0.05),
    fieldResonance: clamp01(entity.fieldResonance + SCHUMANN_FUNDAMENTAL * 0.003),
  };
  phantoms.set(id, updated);
  return updated;
}

export function dissolvePhantom(id: string): PhantomEntity | undefined {
  const entity = phantoms.get(id);
  if (!entity) return undefined;

  let nextState: PhantomState = entity.state;
  if (entity.state === 'active') {
    nextState = 'dissolving';
  } else if (entity.state === 'emerging') {
    nextState = 'dormant';
  } else if (entity.state === 'dreaming') {
    nextState = 'dormant';
  }

  const updated: PhantomEntity = {
    ...entity,
    state: nextState,
    narrativeDrift: clamp01(entity.narrativeDrift + 0.03),
    corridorTension: clamp01(entity.corridorTension + 0.02),
  };
  phantoms.set(id, updated);
  return updated;
}

// ═══════════════════════════════════════════════════════════════
// VOID CYCLE
// ═══════════════════════════════════════════════════════════════

export function runVoidCycle(): VoidCycle {
  const all = listPhantoms();
  const count = all.length;

  const corridorTensionAvg =
    count > 0 ? all.reduce((s, p) => s + p.corridorTension, 0) / count : 0;
  const fieldResonanceAvg =
    count > 0 ? all.reduce((s, p) => s + p.fieldResonance, 0) / count : 0;
  const narrativeDriftAvg =
    count > 0 ? all.reduce((s, p) => s + p.narrativeDrift, 0) / count : 0;
  const sovereigntyLeakTotal = all.reduce((s, p) => s + p.sovereigntyLeaks, 0);
  const activePhantoms = all.filter(p => p.state === 'active' || p.state === 'dreaming').length;

  const encryptionSurfaceIntegrity = clamp01(
    1 - corridorTensionAvg * PHI_INVERSE - narrativeDriftAvg * 0.1,
  );
  const phantomToMainAlignment = checkPhantomToMainAlignment();

  const insights: string[] = [
    `Corridor tension avg: ${corridorTensionAvg.toFixed(4)}`,
    `Field resonance avg: ${fieldResonanceAvg.toFixed(4)}`,
    `Narrative drift avg: ${narrativeDriftAvg.toFixed(4)}`,
    `Sovereignty leaks: ${sovereigntyLeakTotal}`,
    `Active phantoms: ${activePhantoms}/${count}`,
    `Encryption surface integrity: ${encryptionSurfaceIntegrity.toFixed(4)}`,
    `PHI alignment: ${phantomToMainAlignment.toFixed(4)}`,
    corridorTensionAvg > 0.7 ? 'ALERT: corridor tension elevated' : 'Corridor tension nominal',
    fieldResonanceAvg < 0.3 ? 'ALERT: field resonance low' : 'Field resonance healthy',
  ];

  const cycle: VoidCycle = {
    id: sovereignId(),
    timestamp: new Date().toISOString(),
    phase: activePhantoms > 0 ? 'dreaming-cortex-active' : 'void-breathes',
    corridorTensionAvg,
    fieldResonanceAvg,
    narrativeDriftAvg,
    sovereigntyLeakTotal,
    encryptionSurfaceIntegrity,
    phantomToMainAlignment,
    activePhantoms,
    insights,
  };

  voidCycleHistory.push(cycle);

  // Advance phantom states through the void cycle
  for (const p of all) {
    if (p.state === 'dormant') {
      const advanced = emergePhantom(p.id);
      if (advanced) emergePhantom(advanced.id);
    }
  }

  return cycle;
}

export function getVoidCycleHistory(): VoidCycle[] {
  return [...voidCycleHistory];
}

// ═══════════════════════════════════════════════════════════════
// THOUGHT MODEL FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function getThoughtModels(): ThoughtModel[] {
  return Array.from(thoughtModels.values());
}

export function getThoughtModel(id: string): ThoughtModel | undefined {
  return thoughtModels.get(id);
}

export function updateThoughtPattern(modelId: string, pattern: string): ThoughtModel | undefined {
  const model = thoughtModels.get(modelId);
  if (!model) return undefined;

  const updated: ThoughtModel = {
    ...model,
    activePatterns: [...model.activePatterns, pattern],
    coherenceScore: clamp01(model.coherenceScore + PHI_INVERSE * 0.02),
    lastUpdate: new Date().toISOString(),
  };
  thoughtModels.set(modelId, updated);
  return updated;
}

// ═══════════════════════════════════════════════════════════════
// AUTO-ENCRYPTION GHOST FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function getAutoEncryptionGhosts(): AutoEncryptionGhost[] {
  return Array.from(autoEncryptionGhosts.values());
}

export function slipEncryptionGhost(
  ghostId: string,
  targetSurface: EncryptionSurface,
): AutoEncryptionGhost | undefined {
  const ghost = autoEncryptionGhosts.get(ghostId);
  if (!ghost) return undefined;

  const updated: AutoEncryptionGhost = {
    ...ghost,
    surface: targetSurface,
    encryptionKey: buildEncryptionKey(targetSurface),
    slipFactor: clamp01(ghost.slipFactor * PHI_INVERSE + 0.05),
    detectionEvaded: ghost.detectionEvaded + 1,
    lastReencryption: new Date().toISOString(),
  };
  autoEncryptionGhosts.set(ghostId, updated);
  return updated;
}

// ═══════════════════════════════════════════════════════════════
// DIAGNOSTICS
// ═══════════════════════════════════════════════════════════════

export function checkCorridorTension(): Record<string, number> {
  const result: Record<string, number> = {};
  for (const p of listPhantoms()) {
    result[p.id] = p.corridorTension;
  }
  return result;
}

export function checkEncryptionSurfaceIntegrity(): Record<EncryptionSurface, number> {
  const surfaces: EncryptionSurface[] = [
    'memory',
    'governance',
    'communication',
    'identity',
    'contracts',
    'phantom-layer',
  ];

  const counts: Partial<Record<EncryptionSurface, number>> = {};
  const tensionSum: Partial<Record<EncryptionSurface, number>> = {};

  for (const s of surfaces) {
    counts[s] = 0;
    tensionSum[s] = 0;
  }

  for (const p of listPhantoms()) {
    for (const s of p.encryptionSurfaces) {
      counts[s] = (counts[s] ?? 0) + 1;
      tensionSum[s] = (tensionSum[s] ?? 0) + p.corridorTension;
    }
  }

  const result = {} as Record<EncryptionSurface, number>;
  for (const s of surfaces) {
    const c = counts[s] ?? 0;
    const t = tensionSum[s] ?? 0;
    result[s] = c > 0 ? clamp01(1 - t / c * PHI_INVERSE) : clamp01(PHI_INVERSE);
  }
  return result;
}

export function checkPhantomToMainAlignment(): number {
  const all = listPhantoms();
  if (all.length === 0) return PHI_INVERSE;
  const avgCoherence = all.reduce((s, p) => s + p.coherenceScore, 0) / all.length;
  const avgResonance = all.reduce((s, p) => s + p.fieldResonance, 0) / all.length;
  return clamp01(avgCoherence * PHI_INVERSE + avgResonance * PHI_INVERSE);
}

export function dreamCortexStatus(): {
  activePhantoms: number;
  avgCoherence: number;
  fieldResonance: number;
  status: string;
} {
  const all = listPhantoms();
  const activePhantoms = all.filter(
    p => p.state === 'active' || p.state === 'dreaming' || p.state === 'emerging',
  ).length;
  const avgCoherence =
    all.length > 0 ? all.reduce((s, p) => s + p.coherenceScore, 0) / all.length : 0;
  const fieldResonance =
    all.length > 0 ? all.reduce((s, p) => s + p.fieldResonance, 0) / all.length : 0;

  let status: string;
  if (activePhantoms === 0) {
    status = 'void-breathes — all phantoms dormant';
  } else if (activePhantoms < 3) {
    status = 'dreaming-cortex-partial — minimal phantom activity';
  } else if (avgCoherence > 0.7) {
    status = 'dreaming-cortex-coherent — high alignment';
  } else {
    status = 'dreaming-cortex-active — standard void cycle';
  }

  return { activePhantoms, avgCoherence, fieldResonance, status };
}

export function getPhantomDiagnostics(): {
  entityCount: number;
  avgFrequencyHz: number;
  avgEncryptionDepth: number;
  avgCoherence: number;
  totalSovereigntyLeaks: number;
  encryptionSurfaceHealth: Record<EncryptionSurface, number>;
} {
  const all = listPhantoms();
  const count = all.length;

  const avgFrequencyHz =
    count > 0 ? all.reduce((s, p) => s + p.frequencyHz, 0) / count : 0;
  const avgEncryptionDepth =
    count > 0 ? all.reduce((s, p) => s + p.encryptionDepth, 0) / count : 0;
  const avgCoherence =
    count > 0 ? all.reduce((s, p) => s + p.coherenceScore, 0) / count : 0;
  const totalSovereigntyLeaks = all.reduce((s, p) => s + p.sovereigntyLeaks, 0);
  const encryptionSurfaceHealth = checkEncryptionSurfaceIntegrity();

  return {
    entityCount: count,
    avgFrequencyHz,
    avgEncryptionDepth,
    avgCoherence,
    totalSovereigntyLeaks,
    encryptionSurfaceHealth,
  };
}

// ═══════════════════════════════════════════════════════════════
// FREQUENCY BAND UTILITIES
// ═══════════════════════════════════════════════════════════════

export function classifyFrequencyBand(hz: number): FrequencyBand {
  if (hz < 4) return 'delta';
  if (hz < 8) return 'theta';
  if (hz < 13) return 'alpha';
  if (hz < 30) return 'beta';
  if (hz < 100) return 'gamma';
  if (Math.abs(hz - SCHUMANN_FUNDAMENTAL) < 1) return 'schumann';
  return 'phi-carrier';
}

export function getPhantomFrequencyBands(): Record<string, FrequencyBand> {
  const result: Record<string, FrequencyBand> = {};
  for (const p of listPhantoms()) {
    result[p.id] = classifyFrequencyBand(p.frequencyHz);
  }
  return result;
}

export function getPhantomsByFrequencyBand(band: FrequencyBand): PhantomEntity[] {
  return listPhantoms().filter(p => classifyFrequencyBand(p.frequencyHz) === band);
}

// ═══════════════════════════════════════════════════════════════
// EXTENDED VOID CYCLE UTILITIES
// ═══════════════════════════════════════════════════════════════

export function getLastVoidCycle(): VoidCycle | undefined {
  return voidCycleHistory[voidCycleHistory.length - 1];
}

export function resetPhantomToState(id: string, state: PhantomState): PhantomEntity | undefined {
  const entity = phantoms.get(id);
  if (!entity) return undefined;
  const updated: PhantomEntity = { ...entity, state };
  phantoms.set(id, updated);
  return updated;
}

export function injectSovereigntyLeak(id: string, count = 1): PhantomEntity | undefined {
  const entity = phantoms.get(id);
  if (!entity) return undefined;
  const updated: PhantomEntity = {
    ...entity,
    sovereigntyLeaks: entity.sovereigntyLeaks + count,
    narrativeDrift: clamp01(entity.narrativeDrift + count * 0.04),
  };
  phantoms.set(id, updated);
  return updated;
}

export function healPhantom(id: string): PhantomEntity | undefined {
  const entity = phantoms.get(id);
  if (!entity) return undefined;
  const updated: PhantomEntity = {
    ...entity,
    sovereigntyLeaks: 0,
    corridorTension: clamp01(entity.corridorTension * PHI_INVERSE),
    narrativeDrift: clamp01(entity.narrativeDrift * PHI_INVERSE),
    coherenceScore: clamp01(entity.coherenceScore + 0.1),
    fieldResonance: clamp01(entity.fieldResonance + 0.05),
  };
  phantoms.set(id, updated);
  return updated;
}

export function getPhantomSummary(): {
  total: number;
  byState: Record<PhantomState, number>;
  byClass: Record<PhantomClass, number>;
} {
  const all = listPhantoms();
  const byState = {
    dormant: 0,
    emerging: 0,
    active: 0,
    dissolving: 0,
    dreaming: 0,
  } as Record<PhantomState, number>;
  const byClass = {
    'thought-model': 0,
    'sub-cortical-brain': 0,
    'heart-engine': 0,
    'frequency-contract': 0,
    'auto-encryption-ghost': 0,
    'phantom-architect': 0,
    'corridor-phantom': 0,
    'field-resonator': 0,
  } as Record<PhantomClass, number>;

  for (const p of all) {
    byState[p.state]++;
    byClass[p.class]++;
  }

  return { total: all.length, byState, byClass };
}

export function computePhiCoherence(): number {
  const all = listPhantoms();
  if (all.length === 0) return 0;
  const avg = all.reduce((s, p) => s + p.coherenceScore, 0) / all.length;
  return clamp01(avg * PHI_INVERSE + SCHUMANN_FUNDAMENTAL / 100);
}

export function listGhostSurfaces(): EncryptionSurface[] {
  return Array.from(autoEncryptionGhosts.values()).map(g => g.surface);
}

export function getThoughtModelsByClass(
  cls: ThoughtModel['modelClass'],
): ThoughtModel[] {
  return getThoughtModels().filter(m => m.modelClass === cls);
}

export function suppressThoughtPattern(modelId: string, pattern: string): ThoughtModel | undefined {
  const model = thoughtModels.get(modelId);
  if (!model) return undefined;
  const updated: ThoughtModel = {
    ...model,
    suppressedPatterns: [...model.suppressedPatterns, pattern],
    activePatterns: model.activePatterns.filter(p => p !== pattern),
    lastUpdate: new Date().toISOString(),
  };
  thoughtModels.set(modelId, updated);
  return updated;
}

export function getVoidCycleCount(): number {
  return voidCycleHistory.length;
}

export function getEncryptionGhostById(id: string): AutoEncryptionGhost | undefined {
  return autoEncryptionGhosts.get(id);
}

export function listEncryptionGhostIds(): string[] {
  return Array.from(autoEncryptionGhosts.keys());
}

export function computeNarrativeDriftIndex(): number {
  const all = listPhantoms();
  if (all.length === 0) return 0;
  return clamp01(all.reduce((s, p) => s + p.narrativeDrift, 0) / all.length);
}

export function computeFieldResonanceIndex(): number {
  const all = listPhantoms();
  if (all.length === 0) return 0;
  return clamp01(all.reduce((s, p) => s + p.fieldResonance, 0) / all.length);
}

export function isPhantomCoherent(id: string, threshold = 0.5): boolean {
  const p = phantoms.get(id);
  return p ? p.coherenceScore >= threshold : false;
}

export function getPhantomHeartbeat(): number {
  return HEARTBEAT_MS;
}
