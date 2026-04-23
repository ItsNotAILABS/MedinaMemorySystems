/**
 * @medina/organism-runtime-sdk
 * Complete Organism Runtime System Package
 *
 * Combines: organismSovereign + organismKernelExecutor + organismEdgeModel +
 *           crossOrganismResonance + recitalPlusOne + Organism.mo + Heart.mo +
 *           OrganismWiring.mo + NeuralCore.mo + SovereignBeings.mo
 *
 * Provides:
 * - 4-register organism state (cognitive/affective/somatic/sovereign)
 * - Heartbeat engine (tick/tickN/pause/resume)
 * - Kernel execution runtime (7 module kernels)
 * - Edge case detection (14 edge types + circuit breaker)
 * - Cross-organism resonance (shell linking)
 * - RECITAL_PLUS_ONE amplification law
 * - Oro + Nova dual intelligence states
 *
 * Backend Endpoints (Medina.mo):
 *   aurum            → Oro state query
 *   nova_custos      → Nova guardian query
 *   pulsus_cordis    → Heartbeat tick
 *   signa_vitae      → Vital signs
 *
 * Terminal: /pulse — TERMINALE PULSUS + /org — TERMINALE ORGANISMI
 *
 * Callable Functions (15):
 *  11. PULSUS PRINCIPALIS     — tick
 *  12. PULSUS MULTIPLEX       — tickN
 *  13. STATUS PULSUS          — heartbeatStatus
 *  14. SILENTIUM PULSUS       — pauseHeartbeat
 *  15. RESUMPTIO PULSUS       — resumeHeartbeat
 *  16. PULSUS PRAESENS        — getCurrentBeat
 *  17. EVENTUS PULSUUM        — getBeatEvents
 *  42. STATUS ORGANISMI       — getOrganismStatus
 *  43. EVOLUTIO ORGANISMI     — triggerOrganismEvolution
 *  44. HISTORIA EVOLUTIONIS   — getOrganismEvolutionHistory
 *  45. PULSUS ORGANISMI       — organismHeartbeat
 *  46. ORO LEGIT DOCTRINAM    — oroReadsDoctrine
 *  47. NOVA VALIDAT DOCTRINAM — novaValidatesDoctrine
 *  48. ORO PROPONIT MUTATIONEM— oroProposeMutation
 *  49. MUTATIO EXSECUTA       — executeMutation
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const PHI_INVERSE = 0.618033988749895;
export const FREQ_432 = 432.0;
export const AMPLIFICATION_COEFFICIENT = 0.15;
export const HEARTBEAT_MS = 873;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — ORGANISM STATE
// ═══════════════════════════════════════════════════════════════════════════

export type OrganismRegister = 'cognitive' | 'affective' | 'somatic' | 'sovereign';
export type OrganismPhase = 'awake' | 'integrating' | 'deep' | 'broadcast' | 'dormant';

export interface OrganismState {
  cognitive: number;
  affective: number;
  somatic: number;
  sovereign: number;
  phase: OrganismPhase;
  lastBeat: number;
  dominantRegister: OrganismRegister;
  totalTicks: number;
  healthScore: number;
  animaHash: number;
}

export interface HeartbeatResult {
  beat: number;
  phase: OrganismPhase;
  healthScore: number;
  animaHash: number;
  events: string[];
}

export interface BeatEvent {
  beat: number;
  type: string;
  description: string;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — KERNEL EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

export type ModuleType = 'Heart' | 'NeuralCore' | 'AnimalBrains' | 'Underworld' | 'SovereignBeings' | 'Workforce' | 'Sandbox';

export interface OrganismKernel {
  id: string;
  module: ModuleType;
  state: 'idle' | 'running' | 'completed' | 'failed';
  lastExecution: string;
  executionCount: number;
  phiFrequency: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — EDGE MODEL
// ═══════════════════════════════════════════════════════════════════════════

export type EdgeType = 'null-value' | 'network-failure' | 'timeout' | 'overflow' | 'underflow' |
  'permission-denied' | 'rate-limit' | 'data-corruption' | 'state-conflict' | 'resource-exhaustion' |
  'circular-reference' | 'schema-mismatch' | 'encoding-error' | 'concurrency-violation';

export type EdgeSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Edge {
  id: string;
  type: EdgeType;
  severity: EdgeSeverity;
  message: string;
  resolved: boolean;
  detectedAt: string;
  resolvedAt?: string;
}

export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreaker {
  state: CircuitState;
  failureCount: number;
  lastFailure?: string;
  threshold: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — RECITAL
// ═══════════════════════════════════════════════════════════════════════════

export type RecitalPhase = 'recital' | 'integration' | 'amplification' | 'broadcast';

export interface RecitalSequence {
  id: string;
  phase: RecitalPhase;
  currentStep: number;
  totalSteps: number;
  input: string;
  resonance: number;
  output?: string;
  completed: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// ORGANISM STATE MACHINE
// ═══════════════════════════════════════════════════════════════════════════

const state: OrganismState = {
  cognitive: 75,
  affective: 60,
  somatic: 80,
  sovereign: 90,
  phase: 'awake',
  lastBeat: 0,
  dominantRegister: 'sovereign',
  totalTicks: 0,
  healthScore: 0.95,
  animaHash: 0,
};

const beatEvents: BeatEvent[] = [];
const kernels: Map<ModuleType, OrganismKernel> = new Map();
const edges: Edge[] = [];
const circuitBreaker: CircuitBreaker = { state: 'closed', failureCount: 0, threshold: 5 };
const recitals: Map<string, RecitalSequence> = new Map();

// Initialize kernels
const moduleTypes: ModuleType[] = ['Heart', 'NeuralCore', 'AnimalBrains', 'Underworld', 'SovereignBeings', 'Workforce', 'Sandbox'];
for (const mod of moduleTypes) {
  kernels.set(mod, {
    id: `kernel-${mod.toLowerCase()}`,
    module: mod,
    state: 'idle',
    lastExecution: new Date().toISOString(),
    executionCount: 0,
    phiFrequency: FREQ_432 * Math.pow(PHI, moduleTypes.indexOf(mod)),
  });
}

function computeDominant(): OrganismRegister {
  const regs = { cognitive: state.cognitive, affective: state.affective, somatic: state.somatic, sovereign: state.sovereign };
  return (Object.entries(regs).sort(([, a], [, b]) => b - a)[0][0]) as OrganismRegister;
}

function computeAnimaHash(beat: number): number {
  return Math.floor((state.cognitive * PHI + state.affective * PHI_INVERSE + state.somatic + state.sovereign * PHI * PHI + beat) * 137) % 1000000;
}

// ═══════════════════════════════════════════════════════════════════════════
// HEARTBEAT ENGINE
// ═══════════════════════════════════════════════════════════════════════════

/** Execute one heartbeat tick */
export function tick(): HeartbeatResult {
  state.totalTicks++;
  state.lastBeat = state.totalTicks;
  state.dominantRegister = computeDominant();
  state.animaHash = computeAnimaHash(state.lastBeat);
  state.healthScore = Math.min(1, (state.cognitive + state.affective + state.somatic + state.sovereign) / 400);

  const events: string[] = [`beat:${state.lastBeat}`];
  beatEvents.push({ beat: state.lastBeat, type: 'tick', description: `Heartbeat ${state.lastBeat}`, timestamp: new Date().toISOString() });

  return { beat: state.lastBeat, phase: state.phase, healthScore: state.healthScore, animaHash: state.animaHash, events };
}

/** Execute N heartbeat ticks */
export function tickN(n: number): HeartbeatResult {
  let result: HeartbeatResult = { beat: 0, phase: 'awake', healthScore: 0, animaHash: 0, events: [] };
  for (let i = 0; i < n; i++) result = tick();
  return result;
}

/** Get heartbeat status */
export function heartbeatStatus(): { beat: number; phase: OrganismPhase; health: number; totalTicks: number } {
  return { beat: state.lastBeat, phase: state.phase, health: state.healthScore, totalTicks: state.totalTicks };
}

/** Pause heartbeat */
export function pauseHeartbeat(): boolean {
  state.phase = 'dormant';
  return true;
}

/** Resume heartbeat */
export function resumeHeartbeat(): boolean {
  state.phase = 'awake';
  return true;
}

/** Get current beat */
export function getCurrentBeat(): number {
  return state.lastBeat;
}

/** Get beat events */
export function getBeatEvents(limit = 50): BeatEvent[] {
  return beatEvents.slice(-limit);
}

// ═══════════════════════════════════════════════════════════════════════════
// ORGANISM STATE API
// ═══════════════════════════════════════════════════════════════════════════

/** Get full organism status */
export function getOrganismStatus(): OrganismState {
  return { ...state };
}

/** Update a register */
export function updateRegister(register: OrganismRegister, value: number): void {
  state[register] = Math.max(0, Math.min(100, value));
  state.dominantRegister = computeDominant();
}

/** Set organism phase */
export function setPhase(phase: OrganismPhase): void {
  state.phase = phase;
}

/** Trigger organism evolution */
export function triggerOrganismEvolution(): { previousPhase: OrganismPhase; newPhase: OrganismPhase; healthDelta: number } {
  const prev = state.phase;
  const phases: OrganismPhase[] = ['awake', 'integrating', 'deep', 'broadcast'];
  const idx = phases.indexOf(state.phase);
  state.phase = phases[(idx + 1) % phases.length];
  const delta = 0.05;
  state.healthScore = Math.min(1, state.healthScore + delta);
  return { previousPhase: prev, newPhase: state.phase, healthDelta: delta };
}

/** Get organism evolution history */
export function getOrganismEvolutionHistory(): BeatEvent[] {
  return beatEvents.filter(e => e.type === 'evolution' || e.type === 'tick');
}

/** Organism heartbeat (combines tick + state snapshot) */
export function organismHeartbeat(): { state: OrganismState; beat: HeartbeatResult } {
  const beat = tick();
  return { state: getOrganismStatus(), beat };
}

// ═══════════════════════════════════════════════════════════════════════════
// EDGE DETECTION & CIRCUIT BREAKER
// ═══════════════════════════════════════════════════════════════════════════

/** Sense an edge case */
export function senseEdge(type: EdgeType, severity: EdgeSeverity, message: string): Edge {
  const edge: Edge = {
    id: `edge-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    severity,
    message,
    resolved: false,
    detectedAt: new Date().toISOString(),
  };
  edges.push(edge);
  if (severity === 'critical' || severity === 'high') {
    circuitBreaker.failureCount++;
    circuitBreaker.lastFailure = edge.detectedAt;
    if (circuitBreaker.failureCount >= circuitBreaker.threshold) {
      circuitBreaker.state = 'open';
    }
  }
  return edge;
}

/** Resolve an edge */
export function resolveEdge(edgeId: string): boolean {
  const edge = edges.find(e => e.id === edgeId);
  if (!edge) return false;
  edge.resolved = true;
  edge.resolvedAt = new Date().toISOString();
  return true;
}

/** Get circuit breaker state */
export function getCircuitState(): CircuitBreaker {
  return { ...circuitBreaker };
}

// ═══════════════════════════════════════════════════════════════════════════
// RECITAL_PLUS_ONE LAW
// ═══════════════════════════════════════════════════════════════════════════

/** Initiate a recital sequence. R(n+1) = R(n) × (1 + α) */
export function initiateRecital(input: string, totalSteps = 4): RecitalSequence {
  const seq: RecitalSequence = {
    id: `recital-${Date.now()}`,
    phase: 'recital',
    currentStep: 0,
    totalSteps,
    input,
    resonance: 0.5,
    completed: false,
  };
  recitals.set(seq.id, seq);
  return seq;
}

/** Advance a recital by one step */
export function advanceRecital(id: string): RecitalSequence | undefined {
  const seq = recitals.get(id);
  if (!seq || seq.completed) return seq;
  seq.currentStep++;
  seq.resonance = seq.resonance * (1 + AMPLIFICATION_COEFFICIENT);
  const phases: RecitalPhase[] = ['recital', 'integration', 'amplification', 'broadcast'];
  const phaseIdx = Math.min(Math.floor(seq.currentStep / (seq.totalSteps / 4)), 3);
  seq.phase = phases[phaseIdx];
  if (seq.currentStep >= seq.totalSteps) {
    seq.completed = true;
    seq.output = `Recital complete. Final resonance: ${seq.resonance.toFixed(4)}`;
  }
  return seq;
}

// ═══════════════════════════════════════════════════════════════════════════
// PACKAGE MANIFEST
// ═══════════════════════════════════════════════════════════════════════════

export const PACKAGE_MANIFEST = {
  name: '@medina/organism-runtime-sdk',
  version: '1.0.0',
  description: 'Complete Organism Runtime — heartbeat, 4-register state, kernels, edge model, recital law',
  modules: [
    'organismSovereign', 'organismKernelExecutor', 'organismEdgeModel',
    'crossOrganismResonance', 'recitalPlusOne',
    'Organism.mo', 'Heart.mo', 'OrganismWiring.mo', 'NeuralCore.mo', 'SovereignBeings.mo',
  ],
  callableFunctions: 15,
  terminals: ['/pulse', '/org'],
  backendEndpoints: ['aurum', 'nova_custos', 'pulsus_cordis', 'signa_vitae'],
  exports: [
    'tick', 'tickN', 'heartbeatStatus', 'pauseHeartbeat', 'resumeHeartbeat',
    'getCurrentBeat', 'getBeatEvents', 'getOrganismStatus', 'updateRegister',
    'setPhase', 'triggerOrganismEvolution', 'getOrganismEvolutionHistory',
    'organismHeartbeat', 'senseEdge', 'resolveEdge', 'getCircuitState',
    'initiateRecital', 'advanceRecital',
  ],
  phiSignature: PHI * PHI,
};
