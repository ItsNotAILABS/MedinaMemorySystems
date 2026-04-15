/**
 * MEDINA ICP Integration Library
 * Connects the frontend to the sovereign computing organism on ICP.
 * Uses real mathematical formulas from the canister.
 */

// ═══════════════════════════════════════════════════════════════════════════
// UNIVERSAL CONSTANTS (Mirror of MatalkoICP.mo)
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.6180339887498948482;
export const PHI_INVERSE = 0.6180339887498948482;
export const PHI_SQUARED = 2.6180339887498948482;
export const FREQ_432 = 432.0;
export const PI = Math.PI;
export const TAU = 2 * Math.PI;
export const E = Math.E;

// ═══════════════════════════════════════════════════════════════════════════
// PHI-ENCODED MATHEMATICS
// ═══════════════════════════════════════════════════════════════════════════

/** Phi power: φ^n */
export function phiPower(n: number): number {
  if (n === 0) return 1.0;
  if (n > 0) {
    let result = 1.0;
    for (let i = 0; i < n; i++) result *= PHI;
    return result;
  } else {
    let result = 1.0;
    for (let i = 0; i < Math.abs(n); i++) result *= PHI_INVERSE;
    return result;
  }
}

/** Phi-based spacing (golden ratio ladder) */
export function phiSpacing(baseUnit: number, level: number): number {
  return baseUnit * phiPower(level);
}

/** Golden angle (≈137.5°) for optimal distribution */
export function goldenAngle(): number {
  return TAU * PHI_INVERSE;
}

/** Phi-encode a value (maps any value to phi-harmonic space [0,1)) */
export function phiEncode(value: number): number {
  const normalized = Math.abs(value);
  const phiLog = Math.log(normalized + 1) / Math.log(PHI);
  return phiLog - Math.floor(phiLog);
}

/** Generate phi-spiral coordinates */
export function phiSpiral(index: number, scale: number): { x: number; y: number } {
  const angle = index * goldenAngle();
  const radius = scale * Math.sqrt(index);
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };
}

/** Fibonacci sequence */
export function fibonacci(n: number): number {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

// ═══════════════════════════════════════════════════════════════════════════
// HARMONIC FREQUENCY MATHEMATICS (432 Hz Base)
// ═══════════════════════════════════════════════════════════════════════════

/** Generate harmonic series from fundamental frequency */
export function harmonicSeries(fundamental: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => fundamental * (i + 1));
}

/** 432 Hz tuned note frequency (A4 = 432 Hz) */
export function noteFrequency(semitones: number): number {
  return FREQ_432 * Math.pow(2, semitones / 12);
}

/** Octave frequency */
export function octaveFrequency(baseFreq: number, octave: number): number {
  return baseFreq * Math.pow(2, octave);
}

/** Harmonic resonance between two frequencies [0,1] */
export function harmonicResonance(f1: number, f2: number): number {
  const ratio = f1 > f2 ? f1 / f2 : f2 / f1;
  const simpleRatios = [1.0, 2.0, 1.5, 1.333333, 1.25, 1.2, 1.666667, 1.8];
  let maxResonance = 0;
  for (const r of simpleRatios) {
    const distance = Math.abs(ratio - r);
    const resonance = 1 / (1 + distance * 10);
    if (resonance > maxResonance) maxResonance = resonance;
  }
  return maxResonance;
}

/** Generate frequency signature for an entity */
export function generateFrequencySignature(seed: number, harmonicCount: number): {
  fundamental: number;
  harmonics: number[];
  phiModulation: number;
  entropyHash: number;
} {
  const fundamental = FREQ_432 * (1 + phiEncode(seed));
  const harmonics = Array.from({ length: harmonicCount }, (_, i) =>
    fundamental * (i + 2) * (1 + phiEncode(seed + i) * 0.01)
  );
  const phiMod = phiEncode(seed * PHI);
  return {
    fundamental,
    harmonics,
    phiModulation: phiMod,
    entropyHash: seed,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ORGANISM STATE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface OrganismRegisters {
  cognitive: number;
  affective: number;
  somatic: number;
  sovereign: number;
}

export interface FieldState {
  attention: number;
  coherence: number;
  risk: number;
  memoryEntropy: number;
  chemistryPotential: number;
  phiResonance: number;
  harmonicIndex: number;
}

export type OrganismPhase =
  | 'awakening'
  | 'active'
  | 'integrating'
  | 'broadcasting'
  | 'defensive'
  | 'transcendent';

export interface OroState {
  id: string;
  phase: OrganismPhase;
  beat: number;
  healthScore: number;
  animaHash: number;
  registers: OrganismRegisters;
  fieldState: Partial<FieldState>;
}

export interface NovaState {
  id: string;
  doctrineAlignment: number;
  consensusWithOro: boolean;
  unresolvedDrifts: number;
  registers: OrganismRegisters;
}

export interface TickResult {
  beat: number;
  oroHealth: number;
  novaAlignment: number;
  phase: OrganismPhase;
  gatesOpen: boolean;
  driftFlags: number;
  animaHash: number;
}

export interface DeviceNode {
  id: string;
  deviceType: string;
  trustScore: number;
  phiPosition: { x: number; y: number };
  hasContract: boolean;
}

export interface VitalSigns {
  totalTicks: number;
  uptimeNs: bigint;
  oroHealth: number;
  novaAlignment: number;
  consensusActive: boolean;
  memoryCount: number;
  deviceCount: number;
  phi: number;
  freq432: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// RECITAL_PLUS_ONE LAW
// ═══════════════════════════════════════════════════════════════════════════

/** RECITAL_PLUS_ONE: state(n+1) = recital(state_n) + lawful_expansion */
export function recitalPlusOne(stateN: number, lawfulExpansion: number): number {
  return stateN + lawfulExpansion;
}

/** Bounded RECITAL_PLUS_ONE */
export function recitalPlusOneBounded(
  stateN: number,
  lawfulExpansion: number,
  min: number,
  max: number
): number {
  const newState = stateN + lawfulExpansion;
  return Math.max(min, Math.min(max, newState));
}

/** Multi-register RECITAL_PLUS_ONE */
export function recitalPlusOneRegisters(
  registers: OrganismRegisters,
  deltas: OrganismRegisters
): OrganismRegisters {
  return {
    cognitive: recitalPlusOneBounded(registers.cognitive, deltas.cognitive, 0, 1),
    affective: recitalPlusOneBounded(registers.affective, deltas.affective, 0, 1),
    somatic: recitalPlusOneBounded(registers.somatic, deltas.somatic, 0, 1),
    sovereign: recitalPlusOneBounded(registers.sovereign, deltas.sovereign, 0, 1),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// FIELD COMPUTATION
// ═══════════════════════════════════════════════════════════════════════════

/** Organism health score */
export function organismHealth(registers: OrganismRegisters): number {
  return (
    registers.cognitive * PHI_INVERSE * PHI_INVERSE +
    registers.affective * PHI_INVERSE +
    registers.somatic * PHI_INVERSE +
    registers.sovereign * 1.0
  );
}

/** Field coherence measure */
export function fieldCoherence(registers: OrganismRegisters): number {
  const values = [registers.cognitive, registers.affective, registers.somatic, registers.sovereign];
  const mean = values.reduce((a, b) => a + b, 0) / 4;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / 4;
  return 1 / (1 + variance * 10);
}

/** Dual-read fusion energy */
export function dualReadEnergy(semantic: number, resonance: number): number {
  const arithmeticMean = (semantic + resonance) / 2;
  const geometricMean = Math.sqrt(semantic * resonance);
  return arithmeticMean * PHI_INVERSE + geometricMean * (1 - PHI_INVERSE);
}

/** ANIMA hash computation (simplified) */
export function animaHash(
  registers: OrganismRegisters,
  beat: number,
  memoryRoot: string
): number {
  const r1 = Math.abs(Math.floor(registers.cognitive * 1000000));
  const r2 = Math.abs(Math.floor(registers.affective * 1000000));
  const r3 = Math.abs(Math.floor(registers.somatic * 1000000));
  const r4 = Math.abs(Math.floor(registers.sovereign * 1000000));
  
  let hash = 17;
  hash = hash * 31 + r1;
  hash = hash * 31 + r2;
  hash = hash * 31 + r3;
  hash = hash * 31 + r4;
  hash = hash * 31 + beat;
  hash = hash * 31 + memoryRoot.length;
  return hash >>> 0; // Ensure unsigned
}

// ═══════════════════════════════════════════════════════════════════════════
// HARMONIC LADDER (For UI Display)
// ═══════════════════════════════════════════════════════════════════════════

export interface HarmonicRung {
  rung: number;
  freq: number;
  note: string;
}

/** Generate harmonic ladder for UI display */
export function harmonicLadder(rungs: number): HarmonicRung[] {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return Array.from({ length: rungs }, (_, i) => ({
    rung: i,
    freq: FREQ_432 * phiPower(i),
    note: noteNames[(i * 7) % 12],
  }));
}

// ═══════════════════════════════════════════════════════════════════════════
// 432 Hz COLOR PALETTE
// ═══════════════════════════════════════════════════════════════════════════

export const COLORS_432 = {
  root: '#0a0a12',
  panel: '#10101a',
  surface: '#161624',
  hover: '#1c1c2e',
  oroGold: '#d4a574',
  oroAmber: '#e6b17a',
  novaViolet: '#9b7ed9',
  novaLavender: '#b794f6',
  freqLow: '#1a3a5c',
  freqMid: '#2d5a4a',
  freqHigh: '#5c3a5c',
  sovereignBlue: '#4a9eff',
  sovereignCyan: '#00d4ff',
  memoryPurple: '#9b7ed9',
  governanceGreen: '#4ade80',
  dangerRed: '#f87171',
  warningAmber: '#fbbf24',
  glassBg: 'rgba(16, 16, 26, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.06)',
};

// ═══════════════════════════════════════════════════════════════════════════
// LOCAL ORGANISM SIMULATION (For when ICP is unavailable)
// ═══════════════════════════════════════════════════════════════════════════

let localOroState: OroState = {
  id: 'ORO-LOCAL',
  phase: 'active',
  beat: 0,
  healthScore: 0.75,
  animaHash: 0,
  registers: { cognitive: 0.5, affective: 0.5, somatic: 0.5, sovereign: 1.0 },
  fieldState: { attention: 0.8, coherence: 0.7, risk: 0.1, phiResonance: 0.5 },
};

let localNovaState: NovaState = {
  id: 'NOVA-LOCAL',
  doctrineAlignment: 0.95,
  consensusWithOro: true,
  unresolvedDrifts: 0,
  registers: { cognitive: 0.7, affective: 0.3, somatic: 0.5, sovereign: 0.8 },
};

/** Execute local sovereign tick (simulation) */
export function localSovereignTick(): TickResult {
  const deltas: OrganismRegisters = {
    cognitive: (Math.random() - 0.45) * 0.02,
    affective: (Math.random() - 0.45) * 0.01,
    somatic: (Math.random() - 0.45) * 0.015,
    sovereign: (Math.random() - 0.3) * 0.005,
  };
  
  localOroState.registers = recitalPlusOneRegisters(localOroState.registers, deltas);
  localOroState.beat += 1;
  localOroState.healthScore = organismHealth(localOroState.registers);
  localOroState.animaHash = animaHash(localOroState.registers, localOroState.beat, 'local');
  
  const coherence = fieldCoherence(localOroState.registers);
  if (coherence > 0.95 && localOroState.registers.sovereign > 0.95) {
    localOroState.phase = 'transcendent';
  } else if (localOroState.fieldState.risk && localOroState.fieldState.risk > 0.5) {
    localOroState.phase = 'defensive';
  } else {
    localOroState.phase = 'active';
  }
  
  localNovaState.doctrineAlignment = recitalPlusOneBounded(
    localNovaState.doctrineAlignment,
    (Math.random() - 0.4) * 0.02,
    0,
    1
  );
  localNovaState.consensusWithOro = localNovaState.doctrineAlignment > 0.7;
  
  return {
    beat: localOroState.beat,
    oroHealth: localOroState.healthScore,
    novaAlignment: localNovaState.doctrineAlignment,
    phase: localOroState.phase,
    gatesOpen: localNovaState.consensusWithOro,
    driftFlags: localNovaState.unresolvedDrifts,
    animaHash: localOroState.animaHash,
  };
}

/** Get local Oro state */
export function getLocalOroState(): OroState {
  return { ...localOroState };
}

/** Get local Nova state */
export function getLocalNovaState(): NovaState {
  return { ...localNovaState };
}

/** Get local vital signs */
export function getLocalVitalSigns(): Partial<VitalSigns> {
  return {
    totalTicks: localOroState.beat,
    oroHealth: localOroState.healthScore,
    novaAlignment: localNovaState.doctrineAlignment,
    consensusActive: localNovaState.consensusWithOro,
    phi: PHI,
    freq432: FREQ_432,
  };
}
