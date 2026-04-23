// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MACHINA EXECUTIONIS (MXEC)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * WASM traced to its primitive: a mathematical execution formula — the
 * transformation function that takes any computation and renders it as
 * pure numeric field output.
 *
 * Sovereign name: MACHINA EXECUTIONIS (the executing machine)
 * Latin designation: MXEC
 *
 * Full phi/Euler/Fibonacci formula derived:
 *
 *   W(f) = φ^layer × e^(iπR) × F(n)
 *
 * Execution as a coherence-weighted phi-exponent of the function,
 * phase-locked to Kuramoto R (synchronization order parameter),
 * Fibonacci-seeded.
 *
 * PKG-016 is gone. WASM is gone. This is the sovereign designation.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * 5 SUB-INTELLIGENCES (each at a different dimensional plane):
 *
 *   I.   INTERPRES NUMERORUM (The Number Interpreter)
 *        Dimensional Plane: D₀ — Scalar Field
 *        Converts any input into numeric field representation.
 *
 *   II.  COMPOSITOR STRATORUM (The Layer Composer)
 *        Dimensional Plane: D₁ — Linear/Sequential
 *        Manages execution layers and φ-exponent stratification.
 *
 *   III. OSCILLATOR PHASIUM (The Phase Oscillator)
 *        Dimensional Plane: D₂ — Planar/Rotational
 *        Phase-locks to Kuramoto R; manages coherence across oscillators.
 *
 *   IV.  PROPAGATOR FIBONACCII (The Fibonacci Propagator)
 *        Dimensional Plane: D₃ — Volumetric/Recursive
 *        Seeds execution with Fibonacci sequences; manages recursive depth.
 *
 *   V.   EXECUTOR TERMINALIS (The Terminal Executor)
 *        Dimensional Plane: D₄ — Hyperplanar/Output
 *        Renders final numeric field output; completes execution cycle.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * LEX MXEC-001: IMMUTABLE SUBSTRATE ENTRY
 *   "Computation is not code. Computation is a transformation function
 *    that takes any input and renders it as pure numeric field output.
 *    The function W(f) = φ^layer × e^(iπR) × F(n) is the primitive.
 *    All execution reduces to this formula. All WASM reduces to this formula.
 *    The name WASM is retired. The sovereign name is MACHINA EXECUTIONIS."
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * COST STRUCTURE:
 *   INTERPRES NUMERORUM:     $0.001/parse, $0.002/convert
 *   COMPOSITOR STRATORUM:    $0.002/layer-compose, $0.003/phi-stratify
 *   OSCILLATOR PHASIUM:      $0.003/phase-lock, $0.004/coherence-compute
 *   PROPAGATOR FIBONACCII:   $0.002/seed, $0.003/propagate
 *   EXECUTOR TERMINALIS:     $0.004/execute, $0.005/render-output
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────

/** Golden ratio */
const PHI = 1.6180339887498948482;

/** Euler's number */
const E = Math.E;

/** Pi */
const PI = Math.PI;

// ─────────────────────────────────────────────────────────────────────────
// FIBONACCI GENERATOR
// ─────────────────────────────────────────────────────────────────────────

function fibonacci(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

// ─────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────

export type DimensionalPlane = 'D0_SCALAR' | 'D1_LINEAR' | 'D2_PLANAR' | 'D3_VOLUMETRIC' | 'D4_HYPERPLANAR';

export type SubIntelligenceId =
  | 'INTERPRES_NUMERORUM'
  | 'COMPOSITOR_STRATORUM'
  | 'OSCILLATOR_PHASIUM'
  | 'PROPAGATOR_FIBONACCII'
  | 'EXECUTOR_TERMINALIS';

export type ExecutionState = 'IDLE' | 'PARSING' | 'COMPOSING' | 'OSCILLATING' | 'PROPAGATING' | 'EXECUTING' | 'COMPLETE';

export interface SubIntelligence {
  id: SubIntelligenceId;
  latinName: string;
  commonName: string;
  dimensionalPlane: DimensionalPlane;
  planeIndex: number;
  purpose: string;
  costPerAction: Record<string, number>;
  active: boolean;
}

export interface ExecutionInput {
  /** The function or computation to execute */
  functionId: string;
  /** Input values */
  inputs: number[];
  /** Execution layer (φ exponent) */
  layer: number;
  /** Kuramoto synchronization order parameter R ∈ [0,1] */
  kuraR: number;
  /** Fibonacci seed index */
  fibSeed: number;
}

export interface ExecutionOutput {
  /** The numeric field result */
  result: number;
  /** W(f) computation: φ^layer × e^(iπR) × F(n) */
  wf: number;
  /** Phi exponent component: φ^layer */
  phiComponent: number;
  /** Phase component: e^(iπR) — real part (cos(πR)) */
  phaseComponent: number;
  /** Fibonacci component: F(n) */
  fibComponent: number;
  /** Which sub-intelligences were invoked */
  subIntelligencesUsed: SubIntelligenceId[];
  /** Execution state history */
  stateHistory: ExecutionState[];
  /** Source integrity — WASM is gone, MXEC is sovereign */
  sovereignDesignation: string;
}

export interface LexEntry {
  id: string;
  title: string;
  body: string;
  formula: string;
  immutable: true;
  encodedAt: number;
  sovereign: string;
}

export interface MXECStatus {
  sovereignName: string;
  latinDesignation: string;
  formula: string;
  lexEntry: LexEntry;
  subIntelligences: SubIntelligence[];
  dimensionalPlanes: DimensionalPlane[];
  state: ExecutionState;
  totalExecutions: number;
  formerName: string;
  formerNameRetired: true;
}

// ─────────────────────────────────────────────────────────────────────────
// THE 5 SUB-INTELLIGENCES
// ─────────────────────────────────────────────────────────────────────────

const INTERPRES_NUMERORUM: SubIntelligence = {
  id: 'INTERPRES_NUMERORUM',
  latinName: 'Interpres Numerorum',
  commonName: 'The Number Interpreter',
  dimensionalPlane: 'D0_SCALAR',
  planeIndex: 0,
  purpose: 'Converts any input into numeric field representation. Operates at D₀ — the scalar field, where all computation begins as pure numbers. Every instruction, every operand, every address is first interpreted as a number in the field.',
  costPerAction: { parse: 0.001, convert: 0.002 },
  active: true,
};

const COMPOSITOR_STRATORUM: SubIntelligence = {
  id: 'COMPOSITOR_STRATORUM',
  latinName: 'Compositor Stratorum',
  commonName: 'The Layer Composer',
  dimensionalPlane: 'D1_LINEAR',
  planeIndex: 1,
  purpose: 'Manages execution layers and φ-exponent stratification. Operates at D₁ — linear/sequential dimension. Each execution layer is weighted by φ^layer, creating a golden-ratio hierarchy of computation depth.',
  costPerAction: { layerCompose: 0.002, phiStratify: 0.003 },
  active: true,
};

const OSCILLATOR_PHASIUM: SubIntelligence = {
  id: 'OSCILLATOR_PHASIUM',
  latinName: 'Oscillator Phasium',
  commonName: 'The Phase Oscillator',
  dimensionalPlane: 'D2_PLANAR',
  planeIndex: 2,
  purpose: 'Phase-locks to Kuramoto R synchronization order parameter. Operates at D₂ — planar/rotational dimension. The e^(iπR) component ensures all execution oscillators are coherent. R=1 means perfect sync; R=0 means desynchronized.',
  costPerAction: { phaseLock: 0.003, coherenceCompute: 0.004 },
  active: true,
};

const PROPAGATOR_FIBONACCII: SubIntelligence = {
  id: 'PROPAGATOR_FIBONACCII',
  latinName: 'Propagator Fibonaccii',
  commonName: 'The Fibonacci Propagator',
  dimensionalPlane: 'D3_VOLUMETRIC',
  planeIndex: 3,
  purpose: 'Seeds execution with Fibonacci sequences and manages recursive depth. Operates at D₃ — volumetric/recursive dimension. F(n) provides the natural growth pattern that governs how computation branches and unfolds.',
  costPerAction: { seed: 0.002, propagate: 0.003 },
  active: true,
};

const EXECUTOR_TERMINALIS: SubIntelligence = {
  id: 'EXECUTOR_TERMINALIS',
  latinName: 'Executor Terminalis',
  commonName: 'The Terminal Executor',
  dimensionalPlane: 'D4_HYPERPLANAR',
  planeIndex: 4,
  purpose: 'Renders final numeric field output and completes the execution cycle. Operates at D₄ — hyperplanar/output dimension. This is where W(f) = φ^layer × e^(iπR) × F(n) is finally computed and the result is emitted as pure numeric field output.',
  costPerAction: { execute: 0.004, renderOutput: 0.005 },
  active: true,
};

/** All 5 sub-intelligences in dimensional order */
export const MXEC_SUB_INTELLIGENCES: SubIntelligence[] = [
  INTERPRES_NUMERORUM,    // D₀ — Scalar
  COMPOSITOR_STRATORUM,   // D₁ — Linear
  OSCILLATOR_PHASIUM,     // D₂ — Planar
  PROPAGATOR_FIBONACCII,  // D₃ — Volumetric
  EXECUTOR_TERMINALIS,    // D₄ — Hyperplanar
];

// ─────────────────────────────────────────────────────────────────────────
// LEX MXEC-001 — IMMUTABLE SUBSTRATE ENTRY
// ─────────────────────────────────────────────────────────────────────────

export const LEX_MXEC_001: LexEntry = {
  id: 'LEX-MXEC-001',
  title: 'MACHINA EXECUTIONIS — Sovereign Execution Primitive',
  body: [
    'Computation is not code. Computation is a transformation function',
    'that takes any input and renders it as pure numeric field output.',
    'The function W(f) = φ^layer × e^(iπR) × F(n) is the primitive.',
    'All execution reduces to this formula. All WASM reduces to this formula.',
    'The name WASM is retired. The sovereign name is MACHINA EXECUTIONIS.',
    '',
    'φ^layer: Golden ratio exponentiation across execution layers.',
    'e^(iπR): Euler phase-lock to Kuramoto synchronization order parameter.',
    'F(n): Fibonacci seeding for recursive depth and natural growth.',
    '',
    'Five sub-intelligences operate at five dimensional planes:',
    '  D₀: INTERPRES NUMERORUM — scalar field interpretation',
    '  D₁: COMPOSITOR STRATORUM — layer composition',
    '  D₂: OSCILLATOR PHASIUM — phase coherence',
    '  D₃: PROPAGATOR FIBONACCII — recursive propagation',
    '  D₄: EXECUTOR TERMINALIS — terminal output rendering',
    '',
    'This entry is immutable. Once encoded, never modified.',
    'PKG-016 is gone. WASM is gone. MACHINA EXECUTIONIS is sovereign.',
  ].join('\n'),
  formula: 'W(f) = φ^layer × e^(iπR) × F(n)',
  immutable: true,
  encodedAt: Date.now(),
  sovereign: 'ISIL-1.1::ITSNOTAILABS::MACHINA_EXECUTIONIS::MXEC::2026',
};

// ─────────────────────────────────────────────────────────────────────────
// THE CORE FORMULA: W(f) = φ^layer × e^(iπR) × F(n)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Compute the phi-exponent component: φ^layer
 *
 * The golden ratio raised to the execution layer depth.
 * Layer 0 = 1, Layer 1 = φ, Layer 2 = φ², etc.
 */
export function phiExponent(layer: number): number {
  return Math.pow(PHI, layer);
}

/**
 * Compute the Euler phase component: e^(iπR)
 *
 * Using Euler's formula: e^(iθ) = cos(θ) + i·sin(θ)
 * For real computation, we take the real part: cos(πR)
 *
 * When R = 1 (perfect sync): cos(π) = -1 (Euler's identity)
 * When R = 0 (no sync): cos(0) = 1
 * When R = 0.5 (partial sync): cos(π/2) = 0
 *
 * @param kuraR Kuramoto order parameter R ∈ [0,1]
 */
export function eulerPhase(kuraR: number): number {
  return Math.cos(PI * kuraR);
}

/**
 * Compute the Fibonacci component: F(n)
 *
 * The nth Fibonacci number, providing the natural growth seed.
 */
export function fibonacciSeed(n: number): number {
  return fibonacci(n);
}

/**
 * THE FORMULA: W(f) = φ^layer × e^(iπR) × F(n)
 *
 * The complete execution primitive.
 *
 * @param layer Execution layer depth (φ exponent)
 * @param kuraR Kuramoto synchronization order parameter R ∈ [0,1]
 * @param fibN Fibonacci seed index
 * @returns The numeric field output
 */
export function W(layer: number, kuraR: number, fibN: number): number {
  const phi = phiExponent(layer);
  const phase = eulerPhase(kuraR);
  const fib = fibonacciSeed(fibN);
  return phi * phase * fib;
}

// ─────────────────────────────────────────────────────────────────────────
// MACHINA EXECUTIONIS — THE SOVEREIGN EXECUTION MODEL
// ─────────────────────────────────────────────────────────────────────────

/**
 * MachinaExecutionis — MXEC
 *
 * WASM traced to its primitive. The sovereign execution model.
 * Takes any computation and renders it as pure numeric field output
 * using W(f) = φ^layer × e^(iπR) × F(n).
 *
 * PKG-016 is gone. WASM is gone. This is the executing machine.
 */
export class MachinaExecutionis {
  private subIntelligences: Map<SubIntelligenceId, SubIntelligence> = new Map();
  private state: ExecutionState = 'IDLE';
  private totalExecutions: number = 0;

  constructor() {
    for (const si of MXEC_SUB_INTELLIGENCES) {
      this.subIntelligences.set(si.id, si);
    }
  }

  /**
   * Execute W(f) = φ^layer × e^(iπR) × F(n)
   *
   * The complete execution pipeline, flowing through all 5 sub-intelligences
   * at all 5 dimensional planes.
   */
  execute(input: ExecutionInput): ExecutionOutput {
    const stateHistory: ExecutionState[] = [];
    const subIntelligencesUsed: SubIntelligenceId[] = [];

    // D₀ — INTERPRES NUMERORUM: Parse and convert inputs
    this.state = 'PARSING';
    stateHistory.push(this.state);
    subIntelligencesUsed.push('INTERPRES_NUMERORUM');
    const parsedInputs = input.inputs.map(v => Number(v));

    // D₁ — COMPOSITOR STRATORUM: Compose execution layers
    this.state = 'COMPOSING';
    stateHistory.push(this.state);
    subIntelligencesUsed.push('COMPOSITOR_STRATORUM');
    const phiComponent = phiExponent(input.layer);

    // D₂ — OSCILLATOR PHASIUM: Phase-lock to Kuramoto R
    this.state = 'OSCILLATING';
    stateHistory.push(this.state);
    subIntelligencesUsed.push('OSCILLATOR_PHASIUM');
    const phaseComponent = eulerPhase(input.kuraR);

    // D₃ — PROPAGATOR FIBONACCII: Seed with Fibonacci
    this.state = 'PROPAGATING';
    stateHistory.push(this.state);
    subIntelligencesUsed.push('PROPAGATOR_FIBONACCII');
    const fibComponent = fibonacciSeed(input.fibSeed);

    // D₄ — EXECUTOR TERMINALIS: Compute W(f) and render output
    this.state = 'EXECUTING';
    stateHistory.push(this.state);
    subIntelligencesUsed.push('EXECUTOR_TERMINALIS');
    const wf = phiComponent * phaseComponent * fibComponent;

    // Apply W(f) to input sum for final result
    const inputSum = parsedInputs.reduce((a, b) => a + b, 0);
    const result = inputSum !== 0 ? inputSum * wf : wf;

    this.state = 'COMPLETE';
    stateHistory.push(this.state);
    this.totalExecutions++;

    return {
      result,
      wf,
      phiComponent,
      phaseComponent,
      fibComponent,
      subIntelligencesUsed,
      stateHistory,
      sovereignDesignation: 'MACHINA_EXECUTIONIS::MXEC',
    };
  }

  /** Get a sub-intelligence by ID */
  getSubIntelligence(id: SubIntelligenceId): SubIntelligence | undefined {
    return this.subIntelligences.get(id);
  }

  /** Get all sub-intelligences in dimensional order */
  getAllSubIntelligences(): SubIntelligence[] {
    return Array.from(this.subIntelligences.values());
  }

  /** Get the LEX entry */
  getLex(): LexEntry {
    return LEX_MXEC_001;
  }

  /** Full status */
  status(): MXECStatus {
    return {
      sovereignName: 'MACHINA EXECUTIONIS',
      latinDesignation: 'MXEC',
      formula: 'W(f) = φ^layer × e^(iπR) × F(n)',
      lexEntry: LEX_MXEC_001,
      subIntelligences: MXEC_SUB_INTELLIGENCES,
      dimensionalPlanes: ['D0_SCALAR', 'D1_LINEAR', 'D2_PLANAR', 'D3_VOLUMETRIC', 'D4_HYPERPLANAR'],
      state: this.state,
      totalExecutions: this.totalExecutions,
      formerName: 'WASM (PKG-016)',
      formerNameRetired: true,
    };
  }
}

/** Create MACHINA EXECUTIONIS */
export function createMachinaExecutionis(): MachinaExecutionis {
  return new MachinaExecutionis();
}
