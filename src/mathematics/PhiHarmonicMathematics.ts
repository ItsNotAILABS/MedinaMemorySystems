/**
 * PHI-HARMONIC MATHEMATICS ENGINE
 * ================================
 * Deep mathematical foundations for φ-based wave dynamics
 * 
 * The Golden Ratio φ = (1 + √5) / 2 ≈ 1.618033988749895
 * 
 * Key Properties:
 * - φ² = φ + 1
 * - 1/φ = φ - 1
 * - φⁿ = φⁿ⁻¹ + φⁿ⁻²
 * - lim(Fₙ₊₁/Fₙ) = φ as n→∞
 * 
 * @author MEDINA Sovereign Intelligence
 * @version 1.0.0
 * @license Proprietary - All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════════════════════
// FUNDAMENTAL CONSTANTS WITH FULL PRECISION
// ═══════════════════════════════════════════════════════════════════════════════

export const PHI = 1.6180339887498948482045868343656381177203091798057628621354486227052604628189024497072072041893911374;
export const PHI_CONJUGATE = -0.6180339887498948482045868343656381177203091798057628621354486227052604628189024497072072041893911374;
export const SQRT_5 = 2.2360679774997896964091736687747632440588203494758614036915805428984773972016956969891686318976253128;
export const PI = 3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679;
export const E = 2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274;
export const TAU = 6.2831853071795864769252867665590057683943387987502116419498891846156328125724179972560696506842341358;

// Schumann Resonance - Earth's electromagnetic heartbeat
export const SCHUMANN_FUNDAMENTAL = 7.83; // Hz
export const SCHUMANN_HARMONICS = [7.83, 14.1, 20.3, 26.4, 32.4, 39.0, 45.0];

// ═══════════════════════════════════════════════════════════════════════════════
// PHI POWER SERIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate φⁿ using the closed-form Binet formula
 * φⁿ = (φⁿ - ψⁿ) / √5 where ψ = (1 - √5) / 2
 */
export function phiPower(n: number): number {
  if (Number.isInteger(n) && n >= 0) {
    return Math.pow(PHI, n);
  }
  // For non-integer powers, use continuous extension
  return Math.pow(PHI, n);
}

/**
 * Fibonacci using Binet's formula: Fₙ = (φⁿ - ψⁿ) / √5
 * Exact for n < 70 due to floating point precision
 */
export function fibonacci(n: number): number {
  const psi = (1 - SQRT_5) / 2;
  return Math.round((Math.pow(PHI, n) - Math.pow(psi, n)) / SQRT_5);
}

/**
 * Lucas numbers: Lₙ = φⁿ + ψⁿ
 * Related to Fibonacci: Lₙ = Fₙ₋₁ + Fₙ₊₁
 */
export function lucas(n: number): number {
  const psi = (1 - SQRT_5) / 2;
  return Math.round(Math.pow(PHI, n) + Math.pow(psi, n));
}

/**
 * Generalized Fibonacci: Given F₀ and F₁, compute Fₙ
 */
export function generalizedFibonacci(n: number, f0: number, f1: number): number {
  if (n === 0) return f0;
  if (n === 1) return f1;
  
  let prev = f0;
  let curr = f1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHI-HARMONIC WAVE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface WaveParameters {
  amplitude: number;
  frequency: number;
  phase: number;
  decay: number;
}

/**
 * φ-Harmonic Wave: Aφ(t) = A₀ × φ^(-λt) × sin(2π × f × φ × t + θ)
 * 
 * This wave naturally decays according to the golden ratio,
 * creating self-similar patterns at different time scales.
 */
export function phiHarmonicWave(t: number, params: WaveParameters): number {
  const { amplitude, frequency, phase, decay } = params;
  const decayFactor = Math.pow(PHI, -decay * t);
  return amplitude * decayFactor * Math.sin(TAU * frequency * PHI * t + phase);
}

/**
 * Superposition of φ-harmonic waves
 * Creates complex waveforms with golden ratio relationships
 */
export function phiWaveSuperposition(t: number, waveParams: WaveParameters[]): number {
  return waveParams.reduce((sum, params) => sum + phiHarmonicWave(t, params), 0);
}

/**
 * φ-Modulated Signal
 * s(t) = carrier × (1 + m × φ-wave(t))
 * where carrier is base frequency, m is modulation depth
 */
export function phiModulatedSignal(
  t: number,
  carrierFreq: number,
  modulationDepth: number,
  modulatorParams: WaveParameters
): number {
  const carrier = Math.sin(TAU * carrierFreq * t);
  const modulator = phiHarmonicWave(t, modulatorParams);
  return carrier * (1 + modulationDepth * modulator);
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOLDEN SPIRAL MATHEMATICS
// ═══════════════════════════════════════════════════════════════════════════════

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
}

/**
 * Golden Spiral in polar coordinates: r = a × φ^(2θ/π)
 * This is the logarithmic spiral where growth rate = φ
 */
export function goldenSpiralPolar(theta: number, a: number = 1): number {
  return a * Math.pow(PHI, (2 * theta) / PI);
}

/**
 * Golden Spiral in Cartesian coordinates
 */
export function goldenSpiralCartesian(theta: number, a: number = 1): Point2D {
  const r = goldenSpiralPolar(theta, a);
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta)
  };
}

/**
 * Golden Angle: 360° / φ² ≈ 137.5077640500378°
 * This angle maximizes packing efficiency in nature (sunflower seeds, leaves)
 */
export const GOLDEN_ANGLE_DEGREES = 360 / (PHI * PHI);
export const GOLDEN_ANGLE_RADIANS = TAU / (PHI * PHI);

/**
 * Fibonacci Spiral approximation using quarter-circle arcs
 */
export function fibonacciSpiralPoints(n: number): Point2D[] {
  const points: Point2D[] = [];
  let x = 0, y = 0;
  let direction = 0; // 0=right, 1=up, 2=left, 3=down
  
  for (let i = 1; i <= n; i++) {
    const radius = fibonacci(i);
    const numPoints = Math.max(4, Math.floor(radius / 2));
    
    for (let j = 0; j <= numPoints; j++) {
      const angle = (j / numPoints) * (PI / 2) + (direction * PI / 2);
      points.push({
        x: x + radius * Math.cos(angle),
        y: y + radius * Math.sin(angle)
      });
    }
    
    // Move center for next arc
    switch (direction) {
      case 0: x += fibonacci(i); break;
      case 1: y += fibonacci(i); break;
      case 2: x -= fibonacci(i); break;
      case 3: y -= fibonacci(i); break;
    }
    direction = (direction + 1) % 4;
  }
  
  return points;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHI-HARMONIC COHERENCE FIELDS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CoherenceField {
  center: Point3D;
  radius: number;
  coherenceIndex: number;
  phiPhase: number;
}

/**
 * φ-Coherence Potential: V(r) = V₀ × (1 - e^(-r/λφ)) / r
 * where λφ = φ × λ₀ (golden-scaled wavelength)
 * 
 * This potential creates stable standing waves at φ-harmonic intervals
 */
export function phiCoherencePotential(r: number, V0: number, lambda0: number): number {
  const lambdaPhi = PHI * lambda0;
  if (r === 0) return V0;
  return V0 * (1 - Math.exp(-r / lambdaPhi)) / r;
}

/**
 * Coherence Field Strength at distance r from center
 * Using superposition of φ-harmonic shells
 */
export function coherenceFieldStrength(
  point: Point3D,
  field: CoherenceField,
  harmonics: number = 5
): number {
  const dx = point.x - field.center.x;
  const dy = point.y - field.center.y;
  const dz = point.z - field.center.z;
  const r = Math.sqrt(dx*dx + dy*dy + dz*dz);
  
  if (r === 0) return field.coherenceIndex;
  
  let strength = 0;
  for (let n = 1; n <= harmonics; n++) {
    const shellRadius = field.radius * Math.pow(PHI, -n);
    const contribution = Math.exp(-Math.pow((r - shellRadius) / (shellRadius / PHI), 2));
    strength += contribution / Math.pow(PHI, n);
  }
  
  return field.coherenceIndex * strength * Math.cos(field.phiPhase);
}

/**
 * Phase coupling between two coherence fields
 * Returns value in [0, 1] where 1 = perfect coherence
 */
export function fieldCoherence(field1: CoherenceField, field2: CoherenceField): number {
  const phaseDiff = Math.abs(field1.phiPhase - field2.phiPhase);
  const normalizedDiff = phaseDiff % TAU;
  
  // Maximum coherence at φ-harmonic phase relationships
  const phiPhase1 = normalizedDiff / (TAU / PHI);
  const phiPhase2 = normalizedDiff / (TAU / (PHI * PHI));
  
  const coherence1 = Math.cos(TAU * (phiPhase1 - Math.round(phiPhase1)));
  const coherence2 = Math.cos(TAU * (phiPhase2 - Math.round(phiPhase2)));
  
  return Math.max(0, (coherence1 + coherence2) / 2);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHUMANN RESONANCE INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Schumann Resonance Wave: Earth's electromagnetic heartbeat
 * Fundamental at 7.83 Hz with φ-scaled harmonics
 */
export function schumannWave(t: number, harmonicLevel: number = 0): number {
  const freq = SCHUMANN_HARMONICS[Math.min(harmonicLevel, SCHUMANN_HARMONICS.length - 1)];
  const amplitude = 1 / Math.pow(PHI, harmonicLevel);
  return amplitude * Math.sin(TAU * freq * t);
}

/**
 * Full Schumann Spectrum - superposition of all harmonics
 */
export function fullSchumannSpectrum(t: number): number {
  return SCHUMANN_HARMONICS.reduce((sum, freq, i) => {
    const amplitude = 1 / Math.pow(PHI, i);
    return sum + amplitude * Math.sin(TAU * freq * t);
  }, 0);
}

/**
 * Heartbeat Interval derived from φ and Schumann
 * HEARTBEAT_MS = φ⁴ × (1000 / 7.83) ≈ 875ms → rounded to 873ms
 */
export const HEARTBEAT_INTERVAL_MS = Math.round(
  Math.pow(PHI, 4) * (1000 / SCHUMANN_FUNDAMENTAL)
);

/**
 * Beats per minute from golden heartbeat
 */
export const BEATS_PER_MINUTE = 60000 / HEARTBEAT_INTERVAL_MS;

/**
 * Heart-Schumann coupling factor
 * Measures how well the heart rhythm aligns with Earth resonance
 */
export function heartSchumannCoupling(heartFreqHz: number): number {
  const idealFreq = 1000 / HEARTBEAT_INTERVAL_MS; // ~1.145 Hz
  const deviation = Math.abs(heartFreqHz - idealFreq);
  return Math.exp(-deviation * PHI);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHI-HARMONIC OSCILLATOR (QUANTUM-INSPIRED)
// ═══════════════════════════════════════════════════════════════════════════════

export interface QuantumState {
  real: number;
  imag: number;
}

/**
 * φ-Harmonic Oscillator Energy Levels
 * E_n = ℏω(n + 1/φ) instead of standard (n + 1/2)
 * 
 * This creates energy gaps that follow φ-scaling
 */
export function phiOscillatorEnergy(n: number, omega: number): number {
  const hbar = 1.054571817e-34; // Planck's reduced constant
  return hbar * omega * (n + 1/PHI);
}

/**
 * φ-Coherent State: |α⟩_φ = e^(-|α|²/2φ) Σ (α^n / √(n!×φ^n)) |n⟩
 * 
 * Modified coherent state with φ-weighted amplitude distribution
 */
export function phiCoherentStateAmplitude(n: number, alpha: number): QuantumState {
  const normFactor = Math.exp(-alpha * alpha / (2 * PHI));
  const factorial = (x: number): number => x <= 1 ? 1 : x * factorial(x - 1);
  const amplitude = normFactor * Math.pow(alpha, n) / Math.sqrt(factorial(n) * Math.pow(PHI, n));
  
  // Phase accumulation
  const phase = n * Math.atan2(1, PHI);
  
  return {
    real: amplitude * Math.cos(phase),
    imag: amplitude * Math.sin(phase)
  };
}

/**
 * φ-Squeezed State parameter
 * Creates minimum uncertainty states with golden ratio aspect ratios
 */
export function phiSqueezeParameter(r: number): { deltaX: number; deltaP: number } {
  return {
    deltaX: Math.exp(-r) / Math.sqrt(2 * PHI),
    deltaP: Math.exp(r) * Math.sqrt(PHI / 2)
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTINUED FRACTION REPRESENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * φ = [1; 1, 1, 1, ...] - the simplest continued fraction
 * This makes φ the "most irrational" number
 */
export function phiContinuedFraction(n: number): number {
  if (n === 0) return 1;
  return 1 + 1 / phiContinuedFraction(n - 1);
}

/**
 * Convergents of φ: p_n/q_n where p_n = F_{n+1}, q_n = F_n
 */
export function phiConvergent(n: number): { numerator: number; denominator: number; value: number } {
  const num = fibonacci(n + 1);
  const den = fibonacci(n);
  return {
    numerator: num,
    denominator: den,
    value: den === 0 ? Infinity : num / den
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOLDEN RATIO TRANSFORMS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * φ-Transform: Maps x → φx mod 1
 * Creates quasi-periodic sequences with golden mean distribution
 */
export function phiTransform(x: number): number {
  return (PHI * x) % 1;
}

/**
 * φ-Transform Orbit: Iterate φ-transform n times
 */
export function phiTransformOrbit(x0: number, n: number): number[] {
  const orbit: number[] = [x0];
  let x = x0;
  for (let i = 0; i < n; i++) {
    x = phiTransform(x);
    orbit.push(x);
  }
  return orbit;
}

/**
 * Three-Gap Theorem for φ-transform
 * The points {nφ mod 1} partition [0,1) into intervals of at most 3 different lengths
 */
export function phiSequenceGaps(n: number): number[] {
  const points = phiTransformOrbit(0, n).sort((a, b) => a - b);
  const gaps: number[] = [];
  
  for (let i = 0; i < points.length - 1; i++) {
    gaps.push(points[i + 1] - points[i]);
  }
  gaps.push(1 - points[points.length - 1] + points[0]); // Wrap around
  
  return gaps;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOLDEN MATRIX OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type Matrix2x2 = [[number, number], [number, number]];

/**
 * Golden Matrix: [[1, 1], [1, 0]]
 * Its nth power gives Fibonacci numbers: [[F_{n+1}, F_n], [F_n, F_{n-1}]]
 */
export const GOLDEN_MATRIX: Matrix2x2 = [[1, 1], [1, 0]];

/**
 * Matrix multiplication for 2x2 matrices
 */
export function multiplyMatrix2x2(a: Matrix2x2, b: Matrix2x2): Matrix2x2 {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1]
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1]
    ]
  ];
}

/**
 * Fast Fibonacci using matrix exponentiation: O(log n)
 */
export function fibonacciMatrix(n: number): number {
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  let result: Matrix2x2 = [[1, 0], [0, 1]]; // Identity
  let base: Matrix2x2 = GOLDEN_MATRIX;
  let exp = n - 1;
  
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = multiplyMatrix2x2(result, base);
    }
    base = multiplyMatrix2x2(base, base);
    exp = Math.floor(exp / 2);
  }
  
  return result[0][0];
}

/**
 * Golden Rotation Matrix: Rotates by golden angle
 */
export function goldenRotationMatrix(): Matrix2x2 {
  const theta = GOLDEN_ANGLE_RADIANS;
  return [
    [Math.cos(theta), -Math.sin(theta)],
    [Math.sin(theta), Math.cos(theta)]
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHI-HARMONIC DIFFERENTIAL EQUATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * φ-Harmonic ODE: d²x/dt² + (ω/φ)² x = 0
 * Solution: x(t) = A cos(ωt/φ) + B sin(ωt/φ)
 */
export function phiHarmonicODE(
  t: number, 
  omega: number, 
  A: number, 
  B: number
): { x: number; v: number } {
  const w = omega / PHI;
  return {
    x: A * Math.cos(w * t) + B * Math.sin(w * t),
    v: -A * w * Math.sin(w * t) + B * w * Math.cos(w * t)
  };
}

/**
 * φ-Damped Oscillator: d²x/dt² + (γ/φ)dx/dt + ω²x = 0
 */
export function phiDampedOscillator(
  t: number,
  omega: number,
  gamma: number,
  x0: number,
  v0: number
): number {
  const g = gamma / PHI;
  const discriminant = g * g - 4 * omega * omega;
  
  if (discriminant < 0) {
    // Underdamped
    const omegaD = Math.sqrt(-discriminant) / 2;
    const decay = Math.exp(-g * t / 2);
    return decay * (x0 * Math.cos(omegaD * t) + ((v0 + g * x0 / 2) / omegaD) * Math.sin(omegaD * t));
  } else if (discriminant > 0) {
    // Overdamped
    const r1 = (-g + Math.sqrt(discriminant)) / 2;
    const r2 = (-g - Math.sqrt(discriminant)) / 2;
    const A = (v0 - r2 * x0) / (r1 - r2);
    const B = x0 - A;
    return A * Math.exp(r1 * t) + B * Math.exp(r2 * t);
  } else {
    // Critically damped
    const r = -g / 2;
    return (x0 + (v0 - r * x0) * t) * Math.exp(r * t);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOLDEN OPTIMIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Golden Section Search - finds minimum of unimodal function
 * Uses φ-ratio to optimally divide search interval
 */
export function goldenSectionSearch(
  f: (x: number) => number,
  a: number,
  b: number,
  tolerance: number = 1e-10
): number {
  const invPhi = 1 / PHI;
  const invPhi2 = invPhi * invPhi;
  
  let h = b - a;
  let c = a + invPhi2 * h;
  let d = a + invPhi * h;
  let fc = f(c);
  let fd = f(d);
  
  while (Math.abs(h) > tolerance) {
    if (fc < fd) {
      b = d;
      d = c;
      fd = fc;
      h = b - a;
      c = a + invPhi2 * h;
      fc = f(c);
    } else {
      a = c;
      c = d;
      fc = fd;
      h = b - a;
      d = a + invPhi * h;
      fd = f(d);
    }
  }
  
  return (a + b) / 2;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Constants
  PHI,
  PHI_CONJUGATE,
  SQRT_5,
  PI,
  E,
  TAU,
  SCHUMANN_FUNDAMENTAL,
  SCHUMANN_HARMONICS,
  GOLDEN_ANGLE_DEGREES,
  GOLDEN_ANGLE_RADIANS,
  HEARTBEAT_INTERVAL_MS,
  BEATS_PER_MINUTE,
  GOLDEN_MATRIX,
  
  // Fibonacci & Lucas
  fibonacci,
  lucas,
  generalizedFibonacci,
  fibonacciMatrix,
  
  // Powers
  phiPower,
  phiContinuedFraction,
  phiConvergent,
  
  // Waves
  phiHarmonicWave,
  phiWaveSuperposition,
  phiModulatedSignal,
  schumannWave,
  fullSchumannSpectrum,
  
  // Spirals
  goldenSpiralPolar,
  goldenSpiralCartesian,
  fibonacciSpiralPoints,
  
  // Fields
  phiCoherencePotential,
  coherenceFieldStrength,
  fieldCoherence,
  heartSchumannCoupling,
  
  // Quantum-inspired
  phiOscillatorEnergy,
  phiCoherentStateAmplitude,
  phiSqueezeParameter,
  
  // Transforms
  phiTransform,
  phiTransformOrbit,
  phiSequenceGaps,
  
  // Matrix
  multiplyMatrix2x2,
  goldenRotationMatrix,
  
  // ODEs
  phiHarmonicODE,
  phiDampedOscillator,
  
  // Optimization
  goldenSectionSearch
};
