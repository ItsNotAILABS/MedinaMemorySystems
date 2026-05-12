/**
 * MATHEMATICS MODULE INDEX
 * ========================
 * Central export for all mathematical foundations
 * 
 * @author MEDINA Sovereign Intelligence
 * @version 1.0.0
 * @license Proprietary - All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PHI-HARMONIC MATHEMATICS
// Core golden ratio mathematics and wave functions
// ═══════════════════════════════════════════════════════════════════════════════

export * from './PhiHarmonicMathematics';
export { default as PhiHarmonic } from './PhiHarmonicMathematics';

// ═══════════════════════════════════════════════════════════════════════════════
// CHAOS DYNAMICS
// Lorenz, Rössler, strange attractors, Lyapunov exponents
// ═══════════════════════════════════════════════════════════════════════════════

export * from './ChaosDynamics';
export { default as Chaos } from './ChaosDynamics';

// ═══════════════════════════════════════════════════════════════════════════════
// INFORMATION THEORY
// Shannon entropy, mutual information, KL divergence, Fisher information
// ═══════════════════════════════════════════════════════════════════════════════

export * from './InformationTheoryCore';
export { default as Information } from './InformationTheoryCore';

// ═══════════════════════════════════════════════════════════════════════════════
// SACRED GEOMETRY
// Platonic solids, E8 lattice, Leech lattice, icosahedral symmetry
// ═══════════════════════════════════════════════════════════════════════════════

export * from './SacredGeometryEngine';
export { default as SacredGeometry } from './SacredGeometryEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// QUANTUM-INSPIRED MATHEMATICS
// Complex numbers, Hilbert spaces, density matrices, entanglement
// ═══════════════════════════════════════════════════════════════════════════════

export * from './QuantumInspiredMath';
export { default as Quantum } from './QuantumInspiredMath';

// ═══════════════════════════════════════════════════════════════════════════════
// NEURAL DYNAMICS
// Hodgkin-Huxley, Izhikevich, Kuramoto, Wilson-Cowan
// ═══════════════════════════════════════════════════════════════════════════════

export * from './NeuralDynamicsEngine';
export { default as NeuralDynamics } from './NeuralDynamicsEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED MATHEMATICAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

import { PHI, PI, E, TAU, SQRT_5, SCHUMANN_FUNDAMENTAL, HEARTBEAT_INTERVAL_MS } from './PhiHarmonicMathematics';
import { FEIGENBAUM_DELTA, FEIGENBAUM_ALPHA } from './ChaosDynamics';
import { LEECH_DIMENSION, LEECH_MINIMAL_VECTORS } from './SacredGeometryEngine';

export const MEDINA_CONSTANTS = {
  // Golden ratio family
  PHI,
  PHI_SQUARED: PHI * PHI,
  PHI_CUBED: PHI * PHI * PHI,
  PHI_INVERSE: 1 / PHI,
  
  // Transcendentals
  PI,
  E,
  TAU,
  SQRT_5,
  
  // Earth resonance
  SCHUMANN_FUNDAMENTAL,
  SOVEREIGN_FREQUENCY: SCHUMANN_FUNDAMENTAL * PHI,
  HEARTBEAT_MS: HEARTBEAT_INTERVAL_MS,
  
  // Chaos theory
  FEIGENBAUM_DELTA,
  FEIGENBAUM_ALPHA,
  
  // Exceptional geometry
  E8_ROOTS: 240,
  LEECH_DIMENSION,
  LEECH_MINIMAL_VECTORS,
  
  // Sacred numbers
  ICOSAHEDRAL_ROTATIONS: 60,
  BINARY_ICOSAHEDRAL_ORDER: 120,
  GOLDEN_ANGLE_DEGREES: 360 / (PHI * PHI),
  
  // Organism timing
  CARDIAC_CYCLE_MS: 873,
  BEATS_PER_MINUTE: 60000 / 873
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

import { fibonacci, lucas, phiPower, phiHarmonicWave, goldenSectionSearch } from './PhiHarmonicMathematics';
import { shannonEntropy, mutualInformation, klDivergence } from './InformationTheoryCore';
import { integrateLorenz, estimateLargestLyapunov, logisticMap } from './ChaosDynamics';
import { generateE8Roots, icosahedralRotations, tetrahedron, icosahedron, dodecahedron } from './SacredGeometryEngine';
import { vonNeumannEntropy, l1Coherence, concurrence } from './QuantumInspiredMath';
import { kuramotoOrderParameter, izhikevichStep, wilsonCowanDerivatives } from './NeuralDynamicsEngine';

export const MathUtils = {
  // Phi functions
  fibonacci,
  lucas,
  phiPower,
  phiHarmonicWave,
  goldenSectionSearch,
  
  // Information
  shannonEntropy,
  mutualInformation,
  klDivergence,
  
  // Chaos
  integrateLorenz,
  estimateLargestLyapunov,
  logisticMap,
  
  // Geometry
  generateE8Roots,
  icosahedralRotations,
  tetrahedron,
  icosahedron,
  dodecahedron,
  
  // Quantum
  vonNeumannEntropy,
  l1Coherence,
  concurrence,
  
  // Neural
  kuramotoOrderParameter,
  izhikevichStep,
  wilsonCowanDerivatives
};

export default {
  MEDINA_CONSTANTS,
  MathUtils
};
