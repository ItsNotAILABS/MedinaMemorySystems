/**
 * @medina/harmonic-computation-engine
 * Complete Harmonic Computation & Geometric System Package
 *
 * Combines: icpOrganism + MatalkoICP.mo + FrequencyPhysicsEngine.mo +
 *           FieldPhysicsEngine.mo + SacredGeometryEngine.mo + AncientMathEngine.mo
 *
 * Provides:
 * - φ (golden ratio) full computation suite
 * - Fibonacci sequences & ratios
 * - Sacred geometry (platonic solids, vesica piscis, flower of life)
 * - Frequency physics (432 Hz harmonics, Schumann resonance, octave series)
 * - Field physics (attention, coherence, risk, entropy fields)
 * - Harmonic resonance computation
 * - φ-spiral, φ-encode, φ-spacing, φ-power
 * - Pythagorean mathematics (triples, tetractys, triangular numbers)
 * - Law vector compilation & execution
 *
 * Backend Endpoints (Medina.mo):
 *   codificare_phi         → φ encode
 *   spira_aurea            → Golden spiral
 *   resonantia_harmonica   → Harmonic resonance
 *   signatura_frequentiae  → Frequency signature
 *   sequentia_fibonacci    → Fibonacci sequence
 *   constantes             → Universal constants
 *   scala_harmonica        → Harmonic ladder
 *
 * Terminal: /formula — TERMINALE FORMULAE
 *
 * Callable Functions (8):
 *  24. PHI REVELATIO                — getPhi
 *  25. FIBONACCIUS COMPUTATOR      — fibonacci
 *  26. RATIO PHI COMPILATA         — compilePhiRatio
 *  27. RATIO FIBONACCII COMPILATA  — compileFibonacciRatio
 *  28. HARMONIA SIGILLATA          — compileHarmonicSignature
 *  29. VECTOR LEGIS COMPILATUS     — compileLawVector
 *  30. VECTOR LEGIS EXSECUTUS      — executeLawVector
 *  31. FREQUENTIAE SCHUMANNI       — getSchumannFrequencies
 */

// ═══════════════════════════════════════════════════════════════════════════
// UNIVERSAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const PHI_INVERSE = 0.618033988749895;
export const PHI_SQUARED = 2.618033988749895;
export const PHI_CUBED = 4.2360679774997896964;
export const FREQ_432 = 432.0;
export const PI = Math.PI;
export const TAU = 2 * Math.PI;
export const E = Math.E;
export const SQRT5 = Math.sqrt(5);
export const SCHUMANN_FUNDAMENTAL = 7.83;
export const SOVEREIGN_FREQUENCY = SCHUMANN_FUNDAMENTAL * PHI; // ≈12.67 Hz

// Platonic solid vertex counts
export const TETRAHEDRON_VERTICES = 4;
export const HEXAHEDRON_VERTICES = 8;
export const OCTAHEDRON_VERTICES = 6;
export const DODECAHEDRON_VERTICES = 20;
export const ICOSAHEDRON_VERTICES = 12;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PhiRatio {
  n: number;
  value: number;
  inverse: number;
  fibonacci: number;
}

export interface HarmonicSignature {
  fundamental: number;
  harmonics: number[];
  phiModulation: number;
  entropyHash: number;
}

export interface LawVector {
  components: number[];
  magnitude: number;
  phiNorm: number;
  direction: number[];
}

export interface SchumannResonance {
  fundamental: number;    // 7.83 Hz
  harmonics: number[];    // 14.3, 20.8, 27.3, 33.8 Hz...
  phiHarmonic: number;    // 7.83 × φ
  sovereignFreq: number;  // 12.67 Hz
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

export interface SacredShape {
  name: string;
  vertices: number;
  edges: number;
  faces: number;
  element: string;
  phiRelation: number;
  dualShape: string;
}

export interface SpiralPoint {
  x: number;
  y: number;
  theta: number;
  radius: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHI COMPUTATION SUITE
// ═══════════════════════════════════════════════════════════════════════════

/** Get φ (golden ratio) */
export function getPhi(): number {
  return PHI;
}

/** φ^n — Phi power */
export function phiPower(n: number): number {
  if (n === 0) return 1.0;
  let result = 1.0;
  if (n > 0) {
    for (let i = 0; i < n; i++) result *= PHI;
  } else {
    for (let i = 0; i < Math.abs(n); i++) result *= PHI_INVERSE;
  }
  return result;
}

/** φ-spacing (golden ratio ladder) */
export function phiSpacing(baseUnit: number, level: number): number {
  return baseUnit * phiPower(level);
}

/** Golden angle (≈137.5°) */
export function goldenAngle(): number {
  return TAU * PHI_INVERSE;
}

/** φ-encode a value into [0,1) */
export function phiEncode(value: number): number {
  const normalized = Math.abs(value);
  const phiLog = Math.log(normalized + 1) / Math.log(PHI);
  return phiLog - Math.floor(phiLog);
}

/** Generate φ-spiral coordinates */
export function phiSpiral(index: number, scale: number): SpiralPoint {
  const angle = index * goldenAngle();
  const radius = scale * Math.sqrt(index);
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle), theta: angle, radius };
}

/** Generate a full golden spiral of N points */
export function generateGoldenSpiral(count: number, scale: number): SpiralPoint[] {
  return Array.from({ length: count }, (_, i) => phiSpiral(i, scale));
}

// ═══════════════════════════════════════════════════════════════════════════
// FIBONACCI
// ═══════════════════════════════════════════════════════════════════════════

/** Fibonacci sequence value at n */
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

/** Fibonacci sequence up to N terms */
export function fibonacciSequence(n: number): number[] {
  const seq: number[] = [];
  for (let i = 0; i < n; i++) seq.push(fibonacci(i));
  return seq;
}

/** Compile φ ratio for a given n */
export function compilePhiRatio(n: number): PhiRatio {
  const fib = fibonacci(n);
  const fibPrev = n > 0 ? fibonacci(n - 1) : 1;
  return { n, value: phiPower(n), inverse: phiPower(-n), fibonacci: fib / fibPrev };
}

/** Compile Fibonacci ratio convergence */
export function compileFibonacciRatio(n: number): PhiRatio[] {
  return Array.from({ length: n }, (_, i) => compilePhiRatio(i + 1));
}

// ═══════════════════════════════════════════════════════════════════════════
// HARMONIC & FREQUENCY PHYSICS
// ═══════════════════════════════════════════════════════════════════════════

/** Compile harmonic signature from a seed */
export function compileHarmonicSignature(seed: number, harmonicCount = 8): HarmonicSignature {
  const fundamental = FREQ_432 * phiEncode(seed);
  const harmonics: number[] = [];
  for (let i = 1; i <= harmonicCount; i++) {
    harmonics.push(fundamental * (i + 1) * phiPower(i) / phiPower(i + 1));
  }
  return {
    fundamental,
    harmonics,
    phiModulation: fundamental * PHI_INVERSE,
    entropyHash: Math.floor(seed * 137 + fundamental) % 1000000,
  };
}

/** Harmonic resonance between two frequencies */
export function harmonicResonance(f1: number, f2: number): number {
  if (f1 === 0 || f2 === 0) return 0;
  const ratio = f1 > f2 ? f1 / f2 : f2 / f1;
  const nearestPhi = Math.round(Math.log(ratio) / Math.log(PHI));
  const idealRatio = phiPower(nearestPhi);
  return 1.0 - Math.abs(ratio - idealRatio) / idealRatio;
}

/** Get Schumann resonance frequencies */
export function getSchumannFrequencies(): SchumannResonance {
  const harmonics = [14.3, 20.8, 27.3, 33.8, 39.0, 45.0, 51.0];
  return {
    fundamental: SCHUMANN_FUNDAMENTAL,
    harmonics,
    phiHarmonic: SCHUMANN_FUNDAMENTAL * PHI,
    sovereignFreq: SOVEREIGN_FREQUENCY,
  };
}

/** Generate harmonic ladder at 432 Hz */
export function harmonicLadder(steps: number): { step: number; frequency: number; note: string }[] {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return Array.from({ length: steps }, (_, i) => ({
    step: i,
    frequency: FREQ_432 * Math.pow(2, (i - 9) / 12),
    note: notes[i % 12],
  }));
}

// ═══════════════════════════════════════════════════════════════════════════
// LAW VECTORS
// ═══════════════════════════════════════════════════════════════════════════

/** Compile a law vector from components */
export function compileLawVector(components: number[]): LawVector {
  const magnitude = Math.sqrt(components.reduce((s, c) => s + c * c, 0));
  const direction = magnitude > 0 ? components.map(c => c / magnitude) : components.map(() => 0);
  return { components, magnitude, phiNorm: magnitude * PHI_INVERSE, direction };
}

/** Execute a law vector (apply to a field state) */
export function executeLawVector(vector: LawVector, field: FieldState): FieldState {
  const scale = vector.phiNorm / (vector.magnitude || 1);
  return {
    attention: Math.min(1, field.attention + (vector.direction[0] ?? 0) * scale),
    coherence: Math.min(1, field.coherence + (vector.direction[1] ?? 0) * scale),
    risk: Math.max(0, field.risk - (vector.direction[2] ?? 0) * scale),
    memoryEntropy: Math.max(0, field.memoryEntropy - (vector.direction[3] ?? 0) * scale * 0.1),
    chemistryPotential: field.chemistryPotential + (vector.direction[4] ?? 0) * scale * 0.05,
    phiResonance: Math.min(1, field.phiResonance + vector.phiNorm * 0.01),
    harmonicIndex: field.harmonicIndex + 1,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SACRED GEOMETRY
// ═══════════════════════════════════════════════════════════════════════════

/** Get all 5 platonic solids */
export function getPlatonicSolids(): SacredShape[] {
  return [
    { name: 'Tetrahedron', vertices: 4, edges: 6, faces: 4, element: 'Fire', phiRelation: 1 / PHI, dualShape: 'Tetrahedron' },
    { name: 'Hexahedron (Cube)', vertices: 8, edges: 12, faces: 6, element: 'Earth', phiRelation: 1.0, dualShape: 'Octahedron' },
    { name: 'Octahedron', vertices: 6, edges: 12, faces: 8, element: 'Air', phiRelation: PHI_INVERSE, dualShape: 'Hexahedron' },
    { name: 'Dodecahedron', vertices: 20, edges: 30, faces: 12, element: 'Aether', phiRelation: PHI, dualShape: 'Icosahedron' },
    { name: 'Icosahedron', vertices: 12, edges: 30, faces: 20, element: 'Water', phiRelation: PHI_SQUARED, dualShape: 'Dodecahedron' },
  ];
}

/** Vesica Piscis ratio */
export function vesicaPiscis(radius: number): { width: number; height: number; ratio: number } {
  return { width: radius, height: radius * Math.sqrt(3), ratio: Math.sqrt(3) };
}

// ═══════════════════════════════════════════════════════════════════════════
// PYTHAGOREAN MATHEMATICS
// ═══════════════════════════════════════════════════════════════════════════

/** Pythagorean theorem */
export function pythagorean(a: number, b: number): number {
  return Math.sqrt(a * a + b * b);
}

/** Generate Pythagorean triple */
export function pythagoreanTriple(m: number, n: number): { a: number; b: number; c: number } {
  return { a: m * m - n * n, b: 2 * m * n, c: m * m + n * n };
}

/** Tetractys sum (1+2+3+4 = 10) */
export function tetractysSum(): number {
  return 10;
}

/** Triangular number */
export function triangularNumber(n: number): number {
  return (n * (n + 1)) / 2;
}

/** Check perfect number */
export function isPerfectNumber(n: number): boolean {
  if (n <= 1) return false;
  let sum = 1;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) { sum += i; if (i !== n / i) sum += n / i; }
  }
  return sum === n;
}

// ═══════════════════════════════════════════════════════════════════════════
// PACKAGE MANIFEST
// ═══════════════════════════════════════════════════════════════════════════

export const PACKAGE_MANIFEST = {
  name: '@medina/harmonic-computation-engine',
  version: '1.0.0',
  description: 'Complete φ Mathematics — golden ratio, Fibonacci, sacred geometry, frequency physics, field dynamics',
  modules: [
    'icpOrganism', 'MatalkoICP.mo', 'FrequencyPhysicsEngine.mo',
    'FieldPhysicsEngine.mo', 'SacredGeometryEngine.mo', 'AncientMathEngine.mo',
  ],
  callableFunctions: 8,
  terminal: '/formula',
  latinName: 'TERMINALE FORMULAE',
  motto: 'Hic φ loquitur. Hic mathematica vivit.',
  backendEndpoints: [
    'codificare_phi', 'spira_aurea', 'resonantia_harmonica',
    'signatura_frequentiae', 'sequentia_fibonacci', 'constantes', 'scala_harmonica',
  ],
  exports: [
    'getPhi', 'phiPower', 'phiSpacing', 'goldenAngle', 'phiEncode', 'phiSpiral',
    'generateGoldenSpiral', 'fibonacci', 'fibonacciSequence',
    'compilePhiRatio', 'compileFibonacciRatio',
    'compileHarmonicSignature', 'harmonicResonance', 'getSchumannFrequencies', 'harmonicLadder',
    'compileLawVector', 'executeLawVector',
    'getPlatonicSolids', 'vesicaPiscis',
    'pythagorean', 'pythagoreanTriple', 'tetractysSum', 'triangularNumber', 'isPerfectNumber',
  ],
  phiSignature: PHI * 4.236,
};
