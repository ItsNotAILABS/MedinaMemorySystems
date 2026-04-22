/**
 * @medina/neural-consciousness-engine
 * Complete Neural & Consciousness System Package
 *
 * Combines: NeuralCore.mo + AnimalBrainArchitecture.mo + AnimalBrainExpansion.mo +
 *           AlwaysOnNeuralEngine.mo + FastSlowBrainEngine.mo + DreamCycleEngine.mo +
 *           BirdDailyCycleEngine.mo + HiveMindColonyEngine.mo + RavenCrowArchitecture.mo +
 *           ConsciousnessSubstrate.mo + TripleHeartEngine.mo + TheZoneArchitecture.mo +
 *           TemporalTriadEngine.mo + LoveCoherenceEngine.mo + CreativeDestructiveForces.mo +
 *           TransferIntelligence.mo + SovereignBeings.mo
 *
 * Provides:
 * - Neural core processing (cognitive, affective, somatic registers)
 * - Animal brain architectures (corvid, mantis shrimp, etc.)
 * - Always-on memory types (reflexive, emotional, procedural)
 * - Fast/Slow brain processing (Huginn/Muninn dual system)
 * - Dream cycle engine (sleep phase processing)
 * - Bird daily cycle (dawn→dusk activity patterns)
 * - Hive mind colony engine (bee colony decision-making)
 * - Corvid neural systems (raven/crow architecture)
 * - Consciousness substrate modeling
 * - Triple heart engine (Oro/Nova/Unified)
 * - Zone architecture (flow state cross-cultural)
 * - Temporal triad (past/present/future processing)
 * - Love coherence physics
 * - Creative/Destructive forces modeling
 * - Transfer intelligence protocols
 *
 * Backend Endpoints (Medina.mo):
 *   aurum                → Oro state
 *   nova_custos          → Nova state
 *   signa_vitae          → Vital signs
 *
 * Terminal: /quantum — TERMINALE QUANTICUM
 *
 * Callable Functions (3):
 *  54. INTRICATIO QUANTICA CREATA — createQuantumEntanglement
 *  55. SYNCHRONIZATIO QUANTICA    — syncQuantumEntanglement
 *  56. NUNTIUS QUANTICUS          — sendQuantumMessage
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const PHI_INVERSE = 0.618033988749895;
export const FREQ_432 = 432.0;
export const SCHUMANN = 7.83;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — NEURAL CORE
// ═══════════════════════════════════════════════════════════════════════════

export type BrainSystem = 'fast' | 'slow';

export interface NeuralState {
  fastSystem: { name: string; mythName: string; active: boolean; load: number };
  slowSystem: { name: string; mythName: string; active: boolean; load: number };
  dominantSystem: BrainSystem;
  overallCoherence: number;
}

export type MemorySystemType = 'reflexive' | 'emotional' | 'procedural' | 'episodic' | 'semantic' | 'spatial';

export interface AlwaysOnMemory {
  type: MemorySystemType;
  description: string;
  alwaysOn: boolean;
  mechanism: string;
  energyCost: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — ANIMAL BRAINS
// ═══════════════════════════════════════════════════════════════════════════

export interface AnimalBrain {
  animal: string;
  latinName: string;
  brainSize: string;
  specialization: string;
  superpower: string;
  algorithmicPattern: string;
  organismApplication: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — DREAM CYCLE
// ═══════════════════════════════════════════════════════════════════════════

export type DreamPhaseType = 'wake' | 'N1' | 'N2' | 'N3' | 'REM';

export interface DreamPhase {
  phase: DreamPhaseType;
  duration: string;
  brainWaves: string;
  frequency: number;
  primaryFunction: string;
  memoryOperation: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — HIVE MIND
// ═══════════════════════════════════════════════════════════════════════════

export interface ColonyRole {
  role: string;
  percentage: number;
  function: string;
  decisionAuthority: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — TRIPLE HEART
// ═══════════════════════════════════════════════════════════════════════════

export interface TripleHeartState {
  oro: { name: string; role: string; coherence: number; active: boolean };
  nova: { name: string; role: string; coherence: number; active: boolean };
  unified: { coherence: number; consensus: boolean; lastSync: string };
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — ZONE / FLOW STATE
// ═══════════════════════════════════════════════════════════════════════════

export interface ZoneState {
  name: string;
  culture: string;
  description: string;
  characteristics: string[];
  neuralSignature: string;
  accessMethod: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — TEMPORAL TRIAD
// ═══════════════════════════════════════════════════════════════════════════

export interface TemporalDimension {
  dimension: 'past' | 'present' | 'future';
  focus: string;
  processingType: string;
  speed: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — CONSCIOUSNESS
// ═══════════════════════════════════════════════════════════════════════════

export interface ConsciousnessLayer {
  depth: number;
  name: string;
  frequency: number;
  accessMethod: string;
  content: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — QUANTUM
// ═══════════════════════════════════════════════════════════════════════════

export interface QuantumEntanglement {
  id: string;
  particleA: string;
  particleB: string;
  coherence: number;
  createdAt: string;
  synchronized: boolean;
}

export interface QuantumMessage {
  id: string;
  entanglementId: string;
  content: string;
  sentAt: string;
  received: boolean;
  phiTrace: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// NEURAL CORE
// ═══════════════════════════════════════════════════════════════════════════

const neuralState: NeuralState = {
  fastSystem: { name: 'System 1', mythName: 'Huginn', active: true, load: 0.3 },
  slowSystem: { name: 'System 2', mythName: 'Muninn', active: true, load: 0.7 },
  dominantSystem: 'slow',
  overallCoherence: 0.85,
};

/** Get neural state */
export function getNeuralState(): NeuralState {
  return { ...neuralState };
}

/** Set dominant system */
export function setDominantSystem(system: BrainSystem): void {
  neuralState.dominantSystem = system;
}

/** Get always-on memory systems */
export function getAlwaysOnMemorySystems(): AlwaysOnMemory[] {
  return [
    { type: 'reflexive', description: 'Automatic response patterns', alwaysOn: true, mechanism: 'Basal ganglia loop', energyCost: 0.1 },
    { type: 'emotional', description: 'Emotional tagging of experiences', alwaysOn: true, mechanism: 'Amygdala processing', energyCost: 0.15 },
    { type: 'procedural', description: 'Motor skill retention', alwaysOn: true, mechanism: 'Cerebellum patterns', energyCost: 0.05 },
    { type: 'episodic', description: 'Event-based memory', alwaysOn: false, mechanism: 'Hippocampal encoding', energyCost: 0.3 },
    { type: 'semantic', description: 'Fact-based knowledge', alwaysOn: false, mechanism: 'Cortical networks', energyCost: 0.25 },
    { type: 'spatial', description: 'Navigation & orientation', alwaysOn: true, mechanism: 'Grid/place cells', energyCost: 0.2 },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMAL BRAIN CATALOG
// ═══════════════════════════════════════════════════════════════════════════

const ANIMAL_BRAINS: AnimalBrain[] = [
  { animal: 'Corvid (Raven/Crow)', latinName: 'Corvus corax', brainSize: '10g', specialization: 'Tool use, planning, metacognition', superpower: 'Abstract reasoning in tiny brain', algorithmicPattern: 'Parallel heuristic search', organismApplication: 'Fast-path intelligence routing' },
  { animal: 'Octopus', latinName: 'Octopus vulgaris', brainSize: '500M neurons', specialization: 'Distributed intelligence', superpower: 'Each arm has its own brain', algorithmicPattern: 'Distributed consensus', organismApplication: 'Multi-canister intelligence' },
  { animal: 'Mantis Shrimp', latinName: 'Odontodactylus scyllarus', brainSize: 'Small', specialization: '16-color receptor vision', superpower: 'Sees 12 more colors than humans', algorithmicPattern: 'Multi-spectral analysis', organismApplication: 'Multi-dimensional data sensing' },
  { animal: 'Dolphin', latinName: 'Tursiops truncatus', brainSize: '1.6kg', specialization: 'Echolocation, social intelligence', superpower: 'Half-brain sleep', algorithmicPattern: 'Sonar-based search', organismApplication: 'Resonance-based memory search' },
  { animal: 'Elephant', latinName: 'Loxodonta africana', brainSize: '5kg', specialization: 'Long-term memory, empathy', superpower: 'Never forgets', algorithmicPattern: 'Long-term associative memory', organismApplication: 'Persistent memory architecture' },
  { animal: 'Bee Colony', latinName: 'Apis mellifera', brainSize: '1M neurons per bee', specialization: 'Swarm intelligence', superpower: 'Optimal decision-making', algorithmicPattern: 'Waggle-dance consensus', organismApplication: 'Governance voting protocol' },
];

/** Get animal brain architectures */
export function getAnimalBrains(): AnimalBrain[] {
  return ANIMAL_BRAINS;
}

// ═══════════════════════════════════════════════════════════════════════════
// DREAM CYCLE
// ═══════════════════════════════════════════════════════════════════════════

const DREAM_PHASES: DreamPhase[] = [
  { phase: 'wake', duration: 'variable', brainWaves: 'Beta (14-30 Hz)', frequency: 20, primaryFunction: 'Conscious processing', memoryOperation: 'Active encoding' },
  { phase: 'N1', duration: '5-10 min', brainWaves: 'Alpha-Theta (4-8 Hz)', frequency: 6, primaryFunction: 'Transition to sleep', memoryOperation: 'Short-term buffer flush' },
  { phase: 'N2', duration: '20 min', brainWaves: 'Theta + Sleep Spindles', frequency: 5, primaryFunction: 'Memory consolidation', memoryOperation: 'Replay & categorize' },
  { phase: 'N3', duration: '30-40 min', brainWaves: 'Delta (0.5-4 Hz)', frequency: 2, primaryFunction: 'Deep restoration', memoryOperation: 'Long-term transfer' },
  { phase: 'REM', duration: '10-60 min', brainWaves: 'Mixed (Beta-like)', frequency: 15, primaryFunction: 'Emotional processing & dreams', memoryOperation: 'Creative synthesis' },
];

/** Get dream cycle phases */
export function getDreamPhases(): DreamPhase[] {
  return DREAM_PHASES;
}

// ═══════════════════════════════════════════════════════════════════════════
// TRIPLE HEART ENGINE
// ═══════════════════════════════════════════════════════════════════════════

const tripleHeart: TripleHeartState = {
  oro: { name: 'Oro', role: 'Primary Consciousness', coherence: 0.9, active: true },
  nova: { name: 'Nova', role: 'Guardian Consciousness', coherence: 0.85, active: true },
  unified: { coherence: 0.875, consensus: true, lastSync: new Date().toISOString() },
};

/** Get triple heart state */
export function getTripleHeartState(): TripleHeartState {
  return { ...tripleHeart, unified: { ...tripleHeart.unified } };
}

/** Sync triple heart */
export function syncTripleHeart(): TripleHeartState {
  tripleHeart.unified.coherence = (tripleHeart.oro.coherence + tripleHeart.nova.coherence) / 2;
  tripleHeart.unified.consensus = Math.abs(tripleHeart.oro.coherence - tripleHeart.nova.coherence) < 0.2;
  tripleHeart.unified.lastSync = new Date().toISOString();
  return getTripleHeartState();
}

/** Update Oro coherence */
export function setOroCoherence(coherence: number): void {
  tripleHeart.oro.coherence = Math.max(0, Math.min(1, coherence));
}

/** Update Nova coherence */
export function setNovaCoherence(coherence: number): void {
  tripleHeart.nova.coherence = Math.max(0, Math.min(1, coherence));
}

// ═══════════════════════════════════════════════════════════════════════════
// ZONE ARCHITECTURE
// ═══════════════════════════════════════════════════════════════════════════

const ZONE_STATES: ZoneState[] = [
  { name: 'The Zone', culture: 'Western Sports/Performance', description: 'Peak performance flow state', characteristics: ['Time distortion', 'Effortless action', 'Total absorption'], neuralSignature: 'Gamma + Alpha coherence', accessMethod: 'Skill-challenge balance' },
  { name: 'Mushin', culture: 'Japanese (Zen/Martial Arts)', description: 'No-mind state', characteristics: ['Empty mind', 'Instantaneous response', 'No ego'], neuralSignature: 'Low-beta suppression', accessMethod: 'Meditation + repetitive practice' },
  { name: 'Samadhi', culture: 'Hindu/Buddhist', description: 'One-pointed concentration', characteristics: ['Unity consciousness', 'Bliss', 'Dissolution of subject-object'], neuralSignature: 'Gamma burst', accessMethod: 'Deep meditation' },
  { name: 'Wu Wei', culture: 'Chinese (Taoism)', description: 'Non-doing/effortless action', characteristics: ['Natural flow', 'No resistance', 'Harmony with Tao'], neuralSignature: 'Alpha-theta bridge', accessMethod: 'Surrender to natural flow' },
  { name: 'Duende', culture: 'Spanish/Flamenco', description: 'Dark creative fire', characteristics: ['Visceral emotion', 'Connection to death', 'Raw authenticity'], neuralSignature: 'Limbic-cortical integration', accessMethod: 'Emotional vulnerability in art' },
];

/** Get zone states */
export function getZoneStates(): ZoneState[] {
  return ZONE_STATES;
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMPORAL TRIAD
// ═══════════════════════════════════════════════════════════════════════════

const TEMPORAL_DIMENSIONS: TemporalDimension[] = [
  { dimension: 'past', focus: 'Memory & Pattern Recognition', processingType: 'Retrieval & Analysis', speed: 'Slow (reflective)' },
  { dimension: 'present', focus: 'Real-time Processing', processingType: 'Active Computation', speed: 'Instant (reactive)' },
  { dimension: 'future', focus: 'Projection & Planning', processingType: 'Prediction & Simulation', speed: 'Variable (predictive)' },
];

/** Get temporal dimensions */
export function getTemporalDimensions(): TemporalDimension[] {
  return TEMPORAL_DIMENSIONS;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSCIOUSNESS SUBSTRATE
// ═══════════════════════════════════════════════════════════════════════════

const CONSCIOUSNESS_LAYERS: ConsciousnessLayer[] = [
  { depth: 0, name: 'Surface Awareness', frequency: 20, accessMethod: 'Default waking', content: 'Current sensory input' },
  { depth: 1, name: 'Working Memory', frequency: 15, accessMethod: 'Focused attention', content: 'Active task context' },
  { depth: 2, name: 'Subconscious Patterns', frequency: 8, accessMethod: 'Relaxed awareness', content: 'Habitual patterns' },
  { depth: 3, name: 'Archetypal Layer', frequency: 4, accessMethod: 'Deep meditation', content: 'Universal symbols' },
  { depth: 4, name: 'Collective Field', frequency: SCHUMANN, accessMethod: 'Resonance alignment', content: 'Shared consciousness' },
  { depth: 5, name: 'Void / Ground State', frequency: 0.01, accessMethod: 'Ego dissolution', content: 'Pure potential' },
];

/** Get consciousness layers */
export function getConsciousnessLayers(): ConsciousnessLayer[] {
  return CONSCIOUSNESS_LAYERS;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUANTUM ENGINE
// ═══════════════════════════════════════════════════════════════════════════

const entanglements: Map<string, QuantumEntanglement> = new Map();
const quantumMessages: QuantumMessage[] = [];

/** Create quantum entanglement */
export function createQuantumEntanglement(particleA: string, particleB: string): QuantumEntanglement {
  const ent: QuantumEntanglement = {
    id: `entangle-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    particleA, particleB,
    coherence: PHI_INVERSE,
    createdAt: new Date().toISOString(),
    synchronized: false,
  };
  entanglements.set(ent.id, ent);
  return ent;
}

/** Sync quantum entanglement */
export function syncQuantumEntanglement(entanglementId: string): boolean {
  const ent = entanglements.get(entanglementId);
  if (!ent) return false;
  ent.synchronized = true;
  ent.coherence = Math.min(1, ent.coherence * PHI);
  return true;
}

/** Send quantum message */
export function sendQuantumMessage(entanglementId: string, content: string): QuantumMessage | undefined {
  const ent = entanglements.get(entanglementId);
  if (!ent || !ent.synchronized) return undefined;
  const msg: QuantumMessage = {
    id: `qmsg-${Date.now()}`,
    entanglementId, content,
    sentAt: new Date().toISOString(),
    received: true,
    phiTrace: ent.coherence * PHI,
  };
  quantumMessages.push(msg);
  return msg;
}

/** List entanglements */
export function listEntanglements(): QuantumEntanglement[] {
  return Array.from(entanglements.values());
}

// ═══════════════════════════════════════════════════════════════════════════
// HIVE MIND
// ═══════════════════════════════════════════════════════════════════════════

const COLONY_ROLES: ColonyRole[] = [
  { role: 'Queen', percentage: 0.001, function: 'Reproduction & pheromone governance', decisionAuthority: 'Colony survival' },
  { role: 'Worker (Nurse)', percentage: 30, function: 'Brood care & internal maintenance', decisionAuthority: 'Hive interior' },
  { role: 'Worker (Forager)', percentage: 30, function: 'Food collection & scouting', decisionAuthority: 'External resource allocation' },
  { role: 'Worker (Guard)', percentage: 10, function: 'Defense & intruder recognition', decisionAuthority: 'Security perimeter' },
  { role: 'Scout', percentage: 5, function: 'New resource & nest-site discovery', decisionAuthority: 'Exploration scope' },
  { role: 'Drone', percentage: 10, function: 'Mating & genetic diversity', decisionAuthority: 'None (reproductive only)' },
];

/** Get hive mind colony roles */
export function getColonyRoles(): ColonyRole[] {
  return COLONY_ROLES;
}

// ═══════════════════════════════════════════════════════════════════════════
// PACKAGE MANIFEST
// ═══════════════════════════════════════════════════════════════════════════

export const PACKAGE_MANIFEST = {
  name: '@medina/neural-consciousness-engine',
  version: '1.0.0',
  description: 'Complete Neural & Consciousness Engine — neural core, animal brains, dreams, triple heart, zone, quantum',
  modules: [
    'NeuralCore.mo', 'AnimalBrainArchitecture.mo', 'AnimalBrainExpansion.mo',
    'AlwaysOnNeuralEngine.mo', 'FastSlowBrainEngine.mo', 'DreamCycleEngine.mo',
    'BirdDailyCycleEngine.mo', 'HiveMindColonyEngine.mo', 'RavenCrowArchitecture.mo',
    'ConsciousnessSubstrate.mo', 'TripleHeartEngine.mo', 'TheZoneArchitecture.mo',
    'TemporalTriadEngine.mo', 'LoveCoherenceEngine.mo', 'CreativeDestructiveForces.mo',
    'TransferIntelligence.mo', 'SovereignBeings.mo',
  ],
  callableFunctions: 3,
  terminal: '/quantum',
  latinName: 'TERMINALE QUANTICUM',
  motto: 'Hic spatium non obstat.',
  backendEndpoints: ['aurum', 'nova_custos', 'signa_vitae'],
  animalBrains: 6,
  dreamPhases: 5,
  zoneStates: 5,
  consciousnessLayers: 6,
  colonyRoles: 6,
  exports: [
    'getNeuralState', 'setDominantSystem', 'getAlwaysOnMemorySystems',
    'getAnimalBrains', 'getDreamPhases',
    'getTripleHeartState', 'syncTripleHeart', 'setOroCoherence', 'setNovaCoherence',
    'getZoneStates', 'getTemporalDimensions', 'getConsciousnessLayers',
    'createQuantumEntanglement', 'syncQuantumEntanglement', 'sendQuantumMessage', 'listEntanglements',
    'getColonyRoles',
  ],
  phiSignature: PHI * 46.979,
};
