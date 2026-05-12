/**
 * QUANTUM-INSPIRED MATHEMATICS
 * ============================
 * Hilbert spaces, density matrices, coherence, and entanglement measures
 * 
 * Key Concepts:
 * - Complex Hilbert Spaces
 * - Density Matrices (ρ = Σ pᵢ|ψᵢ⟩⟨ψᵢ|)
 * - Von Neumann Entropy: S(ρ) = -Tr(ρ log ρ)
 * - Entanglement Measures
 * - Quantum Coherence
 * 
 * Note: Classical simulation of quantum concepts
 * 
 * @author MEDINA Sovereign Intelligence
 * @version 1.0.0
 * @license Proprietary - All Rights Reserved
 */

import { PHI, PI, E, TAU } from './PhiHarmonicMathematics';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLEX NUMBER TYPE
// ═══════════════════════════════════════════════════════════════════════════════

export interface Complex {
  re: number;  // Real part
  im: number;  // Imaginary part
}

/**
 * Create complex number
 */
export function complex(re: number, im: number = 0): Complex {
  return { re, im };
}

/**
 * Complex from polar form: r × e^(iθ)
 */
export function complexPolar(r: number, theta: number): Complex {
  return {
    re: r * Math.cos(theta),
    im: r * Math.sin(theta)
  };
}

/**
 * Complex conjugate: z* = a - bi
 */
export function conjugate(z: Complex): Complex {
  return { re: z.re, im: -z.im };
}

/**
 * Complex magnitude: |z| = √(a² + b²)
 */
export function magnitude(z: Complex): number {
  return Math.sqrt(z.re * z.re + z.im * z.im);
}

/**
 * Complex phase: arg(z) = atan2(b, a)
 */
export function phase(z: Complex): number {
  return Math.atan2(z.im, z.re);
}

/**
 * Complex addition
 */
export function cAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

/**
 * Complex subtraction
 */
export function cSub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}

/**
 * Complex multiplication
 */
export function cMul(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re
  };
}

/**
 * Complex division
 */
export function cDiv(a: Complex, b: Complex): Complex {
  const denom = b.re * b.re + b.im * b.im;
  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom
  };
}

/**
 * Complex exponential: e^z
 */
export function cExp(z: Complex): Complex {
  const expReal = Math.exp(z.re);
  return {
    re: expReal * Math.cos(z.im),
    im: expReal * Math.sin(z.im)
  };
}

/**
 * Complex natural logarithm
 */
export function cLog(z: Complex): Complex {
  return {
    re: Math.log(magnitude(z)),
    im: phase(z)
  };
}

/**
 * Scalar multiplication
 */
export function cScale(z: Complex, s: number): Complex {
  return { re: z.re * s, im: z.im * s };
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUANTUM STATE VECTORS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Quantum state as complex amplitude vector
 */
export type StateVector = Complex[];

/**
 * Create computational basis state |n⟩
 * For dimension d, |n⟩ has 1 at position n, 0 elsewhere
 */
export function basisState(n: number, dimension: number): StateVector {
  const state: StateVector = [];
  for (let i = 0; i < dimension; i++) {
    state.push(complex(i === n ? 1 : 0));
  }
  return state;
}

/**
 * |0⟩ state (qubit)
 */
export const ZERO_STATE: StateVector = [complex(1), complex(0)];

/**
 * |1⟩ state (qubit)
 */
export const ONE_STATE: StateVector = [complex(0), complex(1)];

/**
 * |+⟩ = (|0⟩ + |1⟩)/√2
 */
export const PLUS_STATE: StateVector = [
  complex(1 / Math.sqrt(2)),
  complex(1 / Math.sqrt(2))
];

/**
 * |-⟩ = (|0⟩ - |1⟩)/√2
 */
export const MINUS_STATE: StateVector = [
  complex(1 / Math.sqrt(2)),
  complex(-1 / Math.sqrt(2))
];

/**
 * φ-State: |φ⟩ = (|0⟩ + φ|1⟩)/√(1+φ²)
 * Golden ratio superposition
 */
export const PHI_STATE: StateVector = [
  complex(1 / Math.sqrt(1 + PHI * PHI)),
  complex(PHI / Math.sqrt(1 + PHI * PHI))
];

/**
 * Normalize state vector
 */
export function normalizeState(state: StateVector): StateVector {
  let norm = 0;
  for (const amp of state) {
    norm += magnitude(amp) ** 2;
  }
  norm = Math.sqrt(norm);
  
  return state.map(amp => cScale(amp, 1 / norm));
}

/**
 * Inner product ⟨ψ|φ⟩
 */
export function innerProduct(psi: StateVector, phi: StateVector): Complex {
  if (psi.length !== phi.length) {
    throw new Error('State vectors must have same dimension');
  }
  
  let result = complex(0);
  for (let i = 0; i < psi.length; i++) {
    result = cAdd(result, cMul(conjugate(psi[i]), phi[i]));
  }
  return result;
}

/**
 * Probability of measuring state |n⟩: |⟨n|ψ⟩|²
 */
export function measurementProbability(state: StateVector, n: number): number {
  if (n >= state.length) return 0;
  return magnitude(state[n]) ** 2;
}

/**
 * Tensor product |ψ⟩ ⊗ |φ⟩
 */
export function tensorProduct(psi: StateVector, phi: StateVector): StateVector {
  const result: StateVector = [];
  for (const a of psi) {
    for (const b of phi) {
      result.push(cMul(a, b));
    }
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DENSITY MATRICES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Density matrix: ρ = Σᵢ pᵢ |ψᵢ⟩⟨ψᵢ|
 */
export type DensityMatrix = Complex[][];

/**
 * Create pure state density matrix: ρ = |ψ⟩⟨ψ|
 */
export function pureStateDensity(state: StateVector): DensityMatrix {
  const n = state.length;
  const rho: DensityMatrix = [];
  
  for (let i = 0; i < n; i++) {
    rho[i] = [];
    for (let j = 0; j < n; j++) {
      rho[i][j] = cMul(state[i], conjugate(state[j]));
    }
  }
  
  return rho;
}

/**
 * Create mixed state density matrix from ensemble
 * {(p₁, |ψ₁⟩), (p₂, |ψ₂⟩), ...}
 */
export function mixedStateDensity(
  probabilities: number[],
  states: StateVector[]
): DensityMatrix {
  if (probabilities.length !== states.length) {
    throw new Error('Probabilities and states must have same count');
  }
  
  const n = states[0].length;
  const rho: DensityMatrix = Array(n).fill(null).map(() => 
    Array(n).fill(null).map(() => complex(0))
  );
  
  for (let k = 0; k < states.length; k++) {
    const pureRho = pureStateDensity(states[k]);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        rho[i][j] = cAdd(rho[i][j], cScale(pureRho[i][j], probabilities[k]));
      }
    }
  }
  
  return rho;
}

/**
 * Maximally mixed state: ρ = I/d
 */
export function maximallyMixedState(dimension: number): DensityMatrix {
  const rho: DensityMatrix = [];
  const p = 1 / dimension;
  
  for (let i = 0; i < dimension; i++) {
    rho[i] = [];
    for (let j = 0; j < dimension; j++) {
      rho[i][j] = complex(i === j ? p : 0);
    }
  }
  
  return rho;
}

/**
 * Trace of density matrix
 */
export function trace(rho: DensityMatrix): Complex {
  let tr = complex(0);
  for (let i = 0; i < rho.length; i++) {
    tr = cAdd(tr, rho[i][i]);
  }
  return tr;
}

/**
 * Check if density matrix is valid (Tr(ρ) = 1, ρ = ρ†, ρ ≥ 0)
 */
export function isValidDensityMatrix(rho: DensityMatrix): boolean {
  // Check trace = 1
  const tr = trace(rho);
  if (Math.abs(tr.re - 1) > 1e-10 || Math.abs(tr.im) > 1e-10) {
    return false;
  }
  
  // Check Hermitian (ρ = ρ†)
  const n = rho.length;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const diff = cSub(rho[i][j], conjugate(rho[j][i]));
      if (magnitude(diff) > 1e-10) {
        return false;
      }
    }
  }
  
  // Positive semi-definiteness would require eigenvalue check
  // Simplified: check diagonal elements are non-negative
  for (let i = 0; i < n; i++) {
    if (rho[i][i].re < -1e-10) {
      return false;
    }
  }
  
  return true;
}

/**
 * Purity: Tr(ρ²)
 * 1 for pure states, 1/d for maximally mixed
 */
export function purity(rho: DensityMatrix): number {
  const rho2 = matrixMultiply(rho, rho);
  return trace(rho2).re;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VON NEUMANN ENTROPY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Von Neumann Entropy: S(ρ) = -Tr(ρ log ρ) = -Σ λᵢ log λᵢ
 * where λᵢ are eigenvalues of ρ
 * 
 * Uses numerical eigenvalue estimation
 */
export function vonNeumannEntropy(rho: DensityMatrix): number {
  // Compute eigenvalues using power iteration
  const eigenvalues = estimateEigenvalues(rho);
  
  let entropy = 0;
  for (const lambda of eigenvalues) {
    if (lambda > 1e-15) {
      entropy -= lambda * Math.log2(lambda);
    }
  }
  
  return entropy;
}

/**
 * Linear Entropy: S_L(ρ) = 1 - Tr(ρ²)
 * Approximation to von Neumann entropy
 */
export function linearEntropy(rho: DensityMatrix): number {
  return 1 - purity(rho);
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUANTUM COHERENCE MEASURES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * l₁-norm of coherence: C_{l1}(ρ) = Σᵢ≠ⱼ |ρᵢⱼ|
 * Sum of absolute values of off-diagonal elements
 */
export function l1Coherence(rho: DensityMatrix): number {
  const n = rho.length;
  let coherence = 0;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        coherence += magnitude(rho[i][j]);
      }
    }
  }
  
  return coherence;
}

/**
 * Relative entropy of coherence: C_r(ρ) = S(ρ_diag) - S(ρ)
 * where ρ_diag is ρ with off-diagonals set to zero
 */
export function relativeEntropyCoherence(rho: DensityMatrix): number {
  // Diagonal version
  const rhoDiag = rho.map((row, i) => 
    row.map((val, j) => i === j ? val : complex(0))
  );
  
  const Sdiag = vonNeumannEntropy(rhoDiag);
  const S = vonNeumannEntropy(rho);
  
  return Sdiag - S;
}

/**
 * φ-Coherence: Golden ratio weighted coherence
 * C_φ(ρ) = Σᵢ≠ⱼ |ρᵢⱼ| × φ^(-|i-j|)
 * Weights closer coherences more heavily
 */
export function phiCoherence(rho: DensityMatrix): number {
  const n = rho.length;
  let coherence = 0;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const weight = Math.pow(PHI, -Math.abs(i - j));
        coherence += magnitude(rho[i][j]) * weight;
      }
    }
  }
  
  return coherence;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTANGLEMENT MEASURES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Concurrence for 2-qubit system
 * C(ρ) = max(0, λ₁ - λ₂ - λ₃ - λ₄)
 * where λᵢ are eigenvalues of √(√ρ ρ̃ √ρ) in decreasing order
 * and ρ̃ = (σy ⊗ σy) ρ* (σy ⊗ σy)
 */
export function concurrence(rho: DensityMatrix): number {
  if (rho.length !== 4) {
    throw new Error('Concurrence requires 4x4 density matrix (2 qubits)');
  }
  
  // σy ⊗ σy
  const sigmaYY: DensityMatrix = [
    [complex(0), complex(0), complex(0), complex(-1)],
    [complex(0), complex(0), complex(1), complex(0)],
    [complex(0), complex(1), complex(0), complex(0)],
    [complex(-1), complex(0), complex(0), complex(0)]
  ];
  
  // ρ* (complex conjugate)
  const rhoStar = rho.map(row => row.map(conjugate));
  
  // ρ̃ = (σy⊗σy) ρ* (σy⊗σy)
  const rhoTilde = matrixMultiply(matrixMultiply(sigmaYY, rhoStar), sigmaYY);
  
  // R = ρ × ρ̃
  const R = matrixMultiply(rho, rhoTilde);
  
  // Get eigenvalues of R
  const eigenvalues = estimateEigenvalues(R).sort((a, b) => b - a);
  
  // Concurrence
  const sqrtEig = eigenvalues.map(e => Math.sqrt(Math.max(0, e)));
  return Math.max(0, sqrtEig[0] - sqrtEig[1] - sqrtEig[2] - sqrtEig[3]);
}

/**
 * Entanglement of Formation from concurrence
 * E(ρ) = h((1 + √(1-C²))/2)
 * where h is binary entropy
 */
export function entanglementOfFormation(rho: DensityMatrix): number {
  const C = concurrence(rho);
  const x = (1 + Math.sqrt(1 - C * C)) / 2;
  
  // Binary entropy
  if (x <= 0 || x >= 1) return 0;
  return -x * Math.log2(x) - (1 - x) * Math.log2(1 - x);
}

/**
 * Partial transpose for bipartite system
 * Used to check PPT criterion
 */
export function partialTranspose(
  rho: DensityMatrix,
  dimA: number,
  dimB: number,
  transposeB: boolean = true
): DensityMatrix {
  const dim = dimA * dimB;
  const result: DensityMatrix = Array(dim).fill(null).map(() =>
    Array(dim).fill(null).map(() => complex(0))
  );
  
  for (let i = 0; i < dimA; i++) {
    for (let j = 0; j < dimB; j++) {
      for (let k = 0; k < dimA; k++) {
        for (let l = 0; l < dimB; l++) {
          const row1 = i * dimB + j;
          const col1 = k * dimB + l;
          
          let row2: number, col2: number;
          if (transposeB) {
            // Transpose B subsystem
            row2 = i * dimB + l;
            col2 = k * dimB + j;
          } else {
            // Transpose A subsystem
            row2 = k * dimB + j;
            col2 = i * dimB + l;
          }
          
          result[row2][col2] = rho[row1][col1];
        }
      }
    }
  }
  
  return result;
}

/**
 * Negativity: N(ρ) = (||ρ^{Γ_B}||₁ - 1) / 2
 * where ρ^{Γ_B} is partial transpose and ||·||₁ is trace norm
 */
export function negativity(rho: DensityMatrix, dimA: number, dimB: number): number {
  const rhoPT = partialTranspose(rho, dimA, dimB);
  
  // Eigenvalues of partial transpose
  const eigenvalues = estimateEigenvalues(rhoPT);
  
  // Trace norm = sum of absolute eigenvalues
  let traceNorm = 0;
  for (const ev of eigenvalues) {
    traceNorm += Math.abs(ev);
  }
  
  return (traceNorm - 1) / 2;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUANTUM GATES (Unitary Operations)
// ═══════════════════════════════════════════════════════════════════════════════

export type UnitaryMatrix = Complex[][];

/**
 * Pauli-X gate (NOT): |0⟩↔|1⟩
 */
export const PAULI_X: UnitaryMatrix = [
  [complex(0), complex(1)],
  [complex(1), complex(0)]
];

/**
 * Pauli-Y gate: |0⟩→i|1⟩, |1⟩→-i|0⟩
 */
export const PAULI_Y: UnitaryMatrix = [
  [complex(0), complex(0, -1)],
  [complex(0, 1), complex(0)]
];

/**
 * Pauli-Z gate: |1⟩→-|1⟩
 */
export const PAULI_Z: UnitaryMatrix = [
  [complex(1), complex(0)],
  [complex(0), complex(-1)]
];

/**
 * Hadamard gate: Creates superposition
 */
export const HADAMARD: UnitaryMatrix = [
  [complex(1/Math.sqrt(2)), complex(1/Math.sqrt(2))],
  [complex(1/Math.sqrt(2)), complex(-1/Math.sqrt(2))]
];

/**
 * Phase gate: S = diag(1, i)
 */
export const PHASE_S: UnitaryMatrix = [
  [complex(1), complex(0)],
  [complex(0), complex(0, 1)]
];

/**
 * T gate: T = diag(1, e^{iπ/4})
 */
export const T_GATE: UnitaryMatrix = [
  [complex(1), complex(0)],
  [complex(0), cExp(complex(0, PI / 4))]
];

/**
 * φ-Phase gate: diag(1, e^{i2π/φ})
 * Golden ratio phase rotation
 */
export const PHI_PHASE_GATE: UnitaryMatrix = [
  [complex(1), complex(0)],
  [complex(0), cExp(complex(0, TAU / PHI))]
];

/**
 * Apply unitary to state vector: |ψ'⟩ = U|ψ⟩
 */
export function applyUnitary(U: UnitaryMatrix, state: StateVector): StateVector {
  const n = state.length;
  const result: StateVector = [];
  
  for (let i = 0; i < n; i++) {
    let sum = complex(0);
    for (let j = 0; j < n; j++) {
      sum = cAdd(sum, cMul(U[i][j], state[j]));
    }
    result.push(sum);
  }
  
  return result;
}

/**
 * Apply unitary to density matrix: ρ' = UρU†
 */
export function applyUnitaryDensity(
  U: UnitaryMatrix,
  rho: DensityMatrix
): DensityMatrix {
  const Udagger = adjoint(U);
  const temp = matrixMultiply(U, rho);
  return matrixMultiply(temp, Udagger);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function matrixMultiply(A: Complex[][], B: Complex[][]): Complex[][] {
  const n = A.length;
  const m = B[0].length;
  const p = B.length;
  
  const C: Complex[][] = Array(n).fill(null).map(() =>
    Array(m).fill(null).map(() => complex(0))
  );
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      for (let k = 0; k < p; k++) {
        C[i][j] = cAdd(C[i][j], cMul(A[i][k], B[k][j]));
      }
    }
  }
  
  return C;
}

function adjoint(U: UnitaryMatrix): UnitaryMatrix {
  const n = U.length;
  const Udag: UnitaryMatrix = Array(n).fill(null).map(() =>
    Array(n).fill(null).map(() => complex(0))
  );
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      Udag[i][j] = conjugate(U[j][i]);
    }
  }
  
  return Udag;
}

function estimateEigenvalues(M: Complex[][], iterations: number = 100): number[] {
  const n = M.length;
  const eigenvalues: number[] = [];
  
  // Power iteration to find dominant eigenvalue
  // Then deflation to find others
  let A = M.map(row => [...row]);
  
  for (let ev = 0; ev < n; ev++) {
    let v: Complex[] = Array(n).fill(null).map(() => 
      complex(Math.random(), Math.random())
    );
    
    // Normalize
    let norm = Math.sqrt(v.reduce((s, c) => s + magnitude(c)**2, 0));
    v = v.map(c => cScale(c, 1/norm));
    
    // Power iteration
    for (let iter = 0; iter < iterations; iter++) {
      // Av
      const Av: Complex[] = [];
      for (let i = 0; i < n; i++) {
        let sum = complex(0);
        for (let j = 0; j < n; j++) {
          sum = cAdd(sum, cMul(A[i][j], v[j]));
        }
        Av.push(sum);
      }
      
      // Normalize
      norm = Math.sqrt(Av.reduce((s, c) => s + magnitude(c)**2, 0));
      if (norm < 1e-15) break;
      v = Av.map(c => cScale(c, 1/norm));
    }
    
    // Rayleigh quotient
    let eigenvalue = 0;
    for (let i = 0; i < n; i++) {
      let sum = complex(0);
      for (let j = 0; j < n; j++) {
        sum = cAdd(sum, cMul(A[i][j], v[j]));
      }
      eigenvalue += cMul(conjugate(v[i]), sum).re;
    }
    
    eigenvalues.push(eigenvalue);
    
    // Deflation: A = A - λvv†
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        A[i][j] = cSub(A[i][j], cScale(cMul(v[i], conjugate(v[j])), eigenvalue));
      }
    }
  }
  
  return eigenvalues;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Complex operations
  complex,
  complexPolar,
  conjugate,
  magnitude,
  phase,
  cAdd,
  cSub,
  cMul,
  cDiv,
  cExp,
  cLog,
  cScale,
  
  // State vectors
  basisState,
  ZERO_STATE,
  ONE_STATE,
  PLUS_STATE,
  MINUS_STATE,
  PHI_STATE,
  normalizeState,
  innerProduct,
  measurementProbability,
  tensorProduct,
  
  // Density matrices
  pureStateDensity,
  mixedStateDensity,
  maximallyMixedState,
  trace,
  isValidDensityMatrix,
  purity,
  
  // Entropy
  vonNeumannEntropy,
  linearEntropy,
  
  // Coherence
  l1Coherence,
  relativeEntropyCoherence,
  phiCoherence,
  
  // Entanglement
  concurrence,
  entanglementOfFormation,
  partialTranspose,
  negativity,
  
  // Gates
  PAULI_X,
  PAULI_Y,
  PAULI_Z,
  HADAMARD,
  PHASE_S,
  T_GATE,
  PHI_PHASE_GATE,
  applyUnitary,
  applyUnitaryDensity
};
