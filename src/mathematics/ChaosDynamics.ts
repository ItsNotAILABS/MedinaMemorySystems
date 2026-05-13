/**
 * CHAOS DYNAMICS ENGINE
 * =====================
 * Nonlinear dynamics, strange attractors, and deterministic chaos
 * 
 * Key Concepts:
 * - Lorenz System: The butterfly effect
 * - Rössler Attractor: Simplified chaos
 * - Lyapunov Exponents: Measure of chaos
 * - Fractal Dimensions: Self-similarity
 * - Bifurcation Analysis: Route to chaos
 * 
 * @author MEDINA Sovereign Intelligence
 * @version 1.0.0
 * @license Proprietary - All Rights Reserved
 */

import { PHI, PI, E, TAU, Point3D } from './PhiHarmonicMathematics';

// ═══════════════════════════════════════════════════════════════════════════════
// LORENZ SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Lorenz System Parameters
 * σ (sigma) = 10 (Prandtl number)
 * ρ (rho) = 28 (Rayleigh number) - creates chaos
 * β (beta) = 8/3 (geometric factor)
 */
export interface LorenzParameters {
  sigma: number;
  rho: number;
  beta: number;
}

export const LORENZ_CLASSIC: LorenzParameters = {
  sigma: 10,
  rho: 28,
  beta: 8/3
};

// φ-scaled Lorenz parameters
export const LORENZ_PHI: LorenzParameters = {
  sigma: 10 * PHI,       // 16.18
  rho: 28 / PHI,          // 17.3
  beta: 8 / (3 * PHI)     // 1.65
};

/**
 * Lorenz System Derivatives
 * dx/dt = σ(y - x)
 * dy/dt = x(ρ - z) - y
 * dz/dt = xy - βz
 */
export function lorenzDerivatives(
  state: Point3D,
  params: LorenzParameters = LORENZ_CLASSIC
): Point3D {
  const { sigma, rho, beta } = params;
  return {
    x: sigma * (state.y - state.x),
    y: state.x * (rho - state.z) - state.y,
    z: state.x * state.y - beta * state.z
  };
}

/**
 * Integrate Lorenz system using 4th-order Runge-Kutta
 */
export function integrateLorenz(
  initialState: Point3D,
  params: LorenzParameters,
  dt: number,
  steps: number
): Point3D[] {
  const trajectory: Point3D[] = [initialState];
  let state = { ...initialState };
  
  for (let i = 0; i < steps; i++) {
    state = rungeKutta4Step(state, params, dt, lorenzDerivatives);
    trajectory.push({ ...state });
  }
  
  return trajectory;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RÖSSLER ATTRACTOR
// ═══════════════════════════════════════════════════════════════════════════════

export interface RosslerParameters {
  a: number;
  b: number;
  c: number;
}

export const ROSSLER_CLASSIC: RosslerParameters = {
  a: 0.2,
  b: 0.2,
  c: 5.7
};

// φ-scaled Rössler
export const ROSSLER_PHI: RosslerParameters = {
  a: 1 / (PHI * PHI * PHI),  // 0.236
  b: 1 / (PHI * PHI * PHI),  // 0.236
  c: PHI * PHI * PHI         // 4.236
};

/**
 * Rössler System Derivatives
 * dx/dt = -y - z
 * dy/dt = x + ay
 * dz/dt = b + z(x - c)
 */
export function rosslerDerivatives(
  state: Point3D,
  params: RosslerParameters = ROSSLER_CLASSIC
): Point3D {
  const { a, b, c } = params;
  return {
    x: -state.y - state.z,
    y: state.x + a * state.y,
    z: b + state.z * (state.x - c)
  };
}

/**
 * Integrate Rössler system
 */
export function integrateRossler(
  initialState: Point3D,
  params: RosslerParameters,
  dt: number,
  steps: number
): Point3D[] {
  const trajectory: Point3D[] = [initialState];
  let state = { ...initialState };
  
  for (let i = 0; i < steps; i++) {
    state = rungeKutta4StepRossler(state, params, dt);
    trajectory.push({ ...state });
  }
  
  return trajectory;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHEN ATTRACTOR - Double Scroll
// ═══════════════════════════════════════════════════════════════════════════════

export interface ChenParameters {
  a: number;
  b: number;
  c: number;
}

export const CHEN_CLASSIC: ChenParameters = {
  a: 35,
  b: 3,
  c: 28
};

/**
 * Chen System Derivatives
 * dx/dt = a(y - x)
 * dy/dt = (c - a)x - xz + cy
 * dz/dt = xy - bz
 */
export function chenDerivatives(
  state: Point3D,
  params: ChenParameters = CHEN_CLASSIC
): Point3D {
  const { a, b, c } = params;
  return {
    x: a * (state.y - state.x),
    y: (c - a) * state.x - state.x * state.z + c * state.y,
    z: state.x * state.y - b * state.z
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// φ-HARMONIC ATTRACTOR (Original)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * φ-Harmonic Attractor: A novel chaotic system based on golden ratio
 * 
 * dx/dt = φ(y - x) + sin(φz)
 * dy/dt = x(φ² - z) - φy
 * dz/dt = φxy - z/φ
 * 
 * This creates a strange attractor with φ-scaling properties
 */
export function phiAttractorDerivatives(state: Point3D): Point3D {
  return {
    x: PHI * (state.y - state.x) + Math.sin(PHI * state.z),
    y: state.x * (PHI * PHI - state.z) - PHI * state.y,
    z: PHI * state.x * state.y - state.z / PHI
  };
}

/**
 * Integrate φ-Harmonic Attractor
 */
export function integratePhiAttractor(
  initialState: Point3D,
  dt: number,
  steps: number
): Point3D[] {
  const trajectory: Point3D[] = [initialState];
  let state = { ...initialState };
  
  for (let i = 0; i < steps; i++) {
    const k1 = phiAttractorDerivatives(state);
    const k2 = phiAttractorDerivatives({
      x: state.x + dt/2 * k1.x,
      y: state.y + dt/2 * k1.y,
      z: state.z + dt/2 * k1.z
    });
    const k3 = phiAttractorDerivatives({
      x: state.x + dt/2 * k2.x,
      y: state.y + dt/2 * k2.y,
      z: state.z + dt/2 * k2.z
    });
    const k4 = phiAttractorDerivatives({
      x: state.x + dt * k3.x,
      y: state.y + dt * k3.y,
      z: state.z + dt * k3.z
    });
    
    state = {
      x: state.x + dt/6 * (k1.x + 2*k2.x + 2*k3.x + k4.x),
      y: state.y + dt/6 * (k1.y + 2*k2.y + 2*k3.y + k4.y),
      z: state.z + dt/6 * (k1.z + 2*k2.z + 2*k3.z + k4.z)
    };
    trajectory.push({ ...state });
  }
  
  return trajectory;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LYAPUNOV EXPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Estimate largest Lyapunov exponent using separation of nearby trajectories
 * λ > 0 indicates chaos
 */
export function estimateLargestLyapunov(
  systemDerivatives: (state: Point3D) => Point3D,
  initialState: Point3D,
  dt: number,
  steps: number,
  perturbation: number = 1e-8
): number {
  let state1 = { ...initialState };
  let state2 = {
    x: initialState.x + perturbation,
    y: initialState.y,
    z: initialState.z
  };
  
  let lyapunovSum = 0;
  
  for (let i = 0; i < steps; i++) {
    // Integrate both trajectories
    state1 = rungeKutta4Generic(state1, dt, systemDerivatives);
    state2 = rungeKutta4Generic(state2, dt, systemDerivatives);
    
    // Calculate separation
    const dx = state2.x - state1.x;
    const dy = state2.y - state1.y;
    const dz = state2.z - state1.z;
    const separation = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    // Add to Lyapunov sum
    if (separation > 0) {
      lyapunovSum += Math.log(separation / perturbation);
    }
    
    // Renormalize separation
    state2 = {
      x: state1.x + (dx / separation) * perturbation,
      y: state1.y + (dy / separation) * perturbation,
      z: state1.z + (dz / separation) * perturbation
    };
  }
  
  return lyapunovSum / (steps * dt);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGISTIC MAP - DISCRETE CHAOS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Logistic Map: x_{n+1} = r × x_n × (1 - x_n)
 * 
 * Key values:
 * r < 1: extinction
 * 1 < r < 3: stable fixed point
 * 3 < r < 3.57: period doubling cascade
 * r ≈ 3.57: onset of chaos
 * r = 4: fully chaotic
 */
export function logisticMap(x: number, r: number): number {
  return r * x * (1 - x);
}

/**
 * Iterate logistic map
 */
export function iterateLogisticMap(x0: number, r: number, iterations: number): number[] {
  const orbit: number[] = [x0];
  let x = x0;
  
  for (let i = 0; i < iterations; i++) {
    x = logisticMap(x, r);
    orbit.push(x);
  }
  
  return orbit;
}

/**
 * Feigenbaum constant: δ = 4.669201609...
 * Ratio of successive period-doubling intervals
 */
export const FEIGENBAUM_DELTA = 4.669201609102990671853203820466;

/**
 * Feigenbaum constant: α = 2.502907875...
 * Scaling factor for amplitude of oscillations
 */
export const FEIGENBAUM_ALPHA = 2.502907875095892822283902873218;

/**
 * Find period doubling bifurcation points
 */
export function findBifurcationPoints(
  x0: number,
  rStart: number,
  rEnd: number,
  rSteps: number,
  transient: number = 500,
  plotPoints: number = 100
): { r: number; x: number }[] {
  const points: { r: number; x: number }[] = [];
  const dr = (rEnd - rStart) / rSteps;
  
  for (let i = 0; i <= rSteps; i++) {
    const r = rStart + i * dr;
    let x = x0;
    
    // Skip transient
    for (let j = 0; j < transient; j++) {
      x = logisticMap(x, r);
    }
    
    // Collect attractor points
    const seen = new Set<number>();
    for (let j = 0; j < plotPoints; j++) {
      x = logisticMap(x, r);
      const rounded = Math.round(x * 10000) / 10000;
      if (!seen.has(rounded)) {
        seen.add(rounded);
        points.push({ r, x });
      }
    }
  }
  
  return points;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FRACTAL DIMENSION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Estimate correlation dimension using Grassberger-Procaccia algorithm
 * D₂ = lim(r→0) log(C(r)) / log(r)
 * where C(r) is the correlation integral
 */
export function estimateCorrelationDimension(
  points: Point3D[],
  rMin: number,
  rMax: number,
  numRadii: number = 20
): { radius: number; correlation: number }[] {
  const n = points.length;
  const results: { radius: number; correlation: number }[] = [];
  
  // Generate radii on log scale
  const logRMin = Math.log(rMin);
  const logRMax = Math.log(rMax);
  const logStep = (logRMax - logRMin) / (numRadii - 1);
  
  for (let i = 0; i < numRadii; i++) {
    const r = Math.exp(logRMin + i * logStep);
    let count = 0;
    
    // Count pairs within distance r
    for (let j = 0; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const dx = points[j].x - points[k].x;
        const dy = points[j].y - points[k].y;
        const dz = points[j].z - points[k].z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        if (dist < r) {
          count++;
        }
      }
    }
    
    const correlation = (2 * count) / (n * (n - 1));
    results.push({ radius: r, correlation });
  }
  
  return results;
}

/**
 * Estimate Hausdorff dimension using box-counting
 */
export function boxCountingDimension(
  points: Point3D[],
  boxSizes: number[]
): { boxSize: number; count: number }[] {
  const results: { boxSize: number; count: number }[] = [];
  
  for (const boxSize of boxSizes) {
    const boxes = new Set<string>();
    
    for (const point of points) {
      const bx = Math.floor(point.x / boxSize);
      const by = Math.floor(point.y / boxSize);
      const bz = Math.floor(point.z / boxSize);
      boxes.add(`${bx},${by},${bz}`);
    }
    
    results.push({ boxSize, count: boxes.size });
  }
  
  return results;
}

// ═══════════════════════════════════════════════════════════════════════════════
// POINCARÉ SECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extract Poincaré section from trajectory
 * Returns points where trajectory crosses a plane
 */
export function poincareSection(
  trajectory: Point3D[],
  normal: Point3D,
  pointOnPlane: Point3D,
  direction: 'positive' | 'negative' | 'both' = 'positive'
): Point3D[] {
  const sectionPoints: Point3D[] = [];
  
  for (let i = 1; i < trajectory.length; i++) {
    const prev = trajectory[i - 1];
    const curr = trajectory[i];
    
    // Calculate signed distances to plane
    const d1 = dotProduct(
      { x: prev.x - pointOnPlane.x, y: prev.y - pointOnPlane.y, z: prev.z - pointOnPlane.z },
      normal
    );
    const d2 = dotProduct(
      { x: curr.x - pointOnPlane.x, y: curr.y - pointOnPlane.y, z: curr.z - pointOnPlane.z },
      normal
    );
    
    // Check for crossing
    const crosses = (direction === 'both' && d1 * d2 < 0) ||
                   (direction === 'positive' && d1 < 0 && d2 >= 0) ||
                   (direction === 'negative' && d1 > 0 && d2 <= 0);
    
    if (crosses) {
      // Linear interpolation to find crossing point
      const t = d1 / (d1 - d2);
      sectionPoints.push({
        x: prev.x + t * (curr.x - prev.x),
        y: prev.y + t * (curr.y - prev.y),
        z: prev.z + t * (curr.z - prev.z)
      });
    }
  }
  
  return sectionPoints;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECURRENCE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create recurrence plot matrix
 * R_ij = 1 if ||x_i - x_j|| < ε, else 0
 */
export function recurrencePlot(
  trajectory: Point3D[],
  epsilon: number
): boolean[][] {
  const n = trajectory.length;
  const R: boolean[][] = Array(n).fill(null).map(() => Array(n).fill(false));
  
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const dx = trajectory[i].x - trajectory[j].x;
      const dy = trajectory[i].y - trajectory[j].y;
      const dz = trajectory[i].z - trajectory[j].z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      
      if (dist < epsilon) {
        R[i][j] = true;
        R[j][i] = true;
      }
    }
  }
  
  return R;
}

/**
 * Calculate Recurrence Rate
 * RR = (1/N²) × Σᵢⱼ R_ij
 */
export function recurrenceRate(R: boolean[][]): number {
  const n = R.length;
  let count = 0;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (R[i][j]) count++;
    }
  }
  
  return count / (n * n);
}

/**
 * Calculate Determinism
 * DET = Σₗ l × P(l) / Σᵢⱼ R_ij
 * where P(l) is number of diagonal lines of length l
 */
export function determinism(R: boolean[][], minLineLength: number = 2): number {
  const n = R.length;
  let diagonalSum = 0;
  let totalRecurrences = 0;
  
  // Count diagonal lines
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (R[i][j]) {
        totalRecurrences++;
        
        // Check if this starts a diagonal
        if ((i === 0 || j === 0 || !R[i-1][j-1])) {
          // Count diagonal length
          let length = 0;
          let ii = i, jj = j;
          while (ii < n && jj < n && R[ii][jj]) {
            length++;
            ii++;
            jj++;
          }
          
          if (length >= minLineLength) {
            diagonalSum += length;
          }
        }
      }
    }
  }
  
  return totalRecurrences > 0 ? diagonalSum / totalRecurrences : 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function rungeKutta4Step(
  state: Point3D,
  params: LorenzParameters,
  dt: number,
  derivatives: (s: Point3D, p: LorenzParameters) => Point3D
): Point3D {
  const k1 = derivatives(state, params);
  const k2 = derivatives({
    x: state.x + dt/2 * k1.x,
    y: state.y + dt/2 * k1.y,
    z: state.z + dt/2 * k1.z
  }, params);
  const k3 = derivatives({
    x: state.x + dt/2 * k2.x,
    y: state.y + dt/2 * k2.y,
    z: state.z + dt/2 * k2.z
  }, params);
  const k4 = derivatives({
    x: state.x + dt * k3.x,
    y: state.y + dt * k3.y,
    z: state.z + dt * k3.z
  }, params);
  
  return {
    x: state.x + dt/6 * (k1.x + 2*k2.x + 2*k3.x + k4.x),
    y: state.y + dt/6 * (k1.y + 2*k2.y + 2*k3.y + k4.y),
    z: state.z + dt/6 * (k1.z + 2*k2.z + 2*k3.z + k4.z)
  };
}

function rungeKutta4StepRossler(
  state: Point3D,
  params: RosslerParameters,
  dt: number
): Point3D {
  const k1 = rosslerDerivatives(state, params);
  const k2 = rosslerDerivatives({
    x: state.x + dt/2 * k1.x,
    y: state.y + dt/2 * k1.y,
    z: state.z + dt/2 * k1.z
  }, params);
  const k3 = rosslerDerivatives({
    x: state.x + dt/2 * k2.x,
    y: state.y + dt/2 * k2.y,
    z: state.z + dt/2 * k2.z
  }, params);
  const k4 = rosslerDerivatives({
    x: state.x + dt * k3.x,
    y: state.y + dt * k3.y,
    z: state.z + dt * k3.z
  }, params);
  
  return {
    x: state.x + dt/6 * (k1.x + 2*k2.x + 2*k3.x + k4.x),
    y: state.y + dt/6 * (k1.y + 2*k2.y + 2*k3.y + k4.y),
    z: state.z + dt/6 * (k1.z + 2*k2.z + 2*k3.z + k4.z)
  };
}

function rungeKutta4Generic(
  state: Point3D,
  dt: number,
  derivatives: (s: Point3D) => Point3D
): Point3D {
  const k1 = derivatives(state);
  const k2 = derivatives({
    x: state.x + dt/2 * k1.x,
    y: state.y + dt/2 * k1.y,
    z: state.z + dt/2 * k1.z
  });
  const k3 = derivatives({
    x: state.x + dt/2 * k2.x,
    y: state.y + dt/2 * k2.y,
    z: state.z + dt/2 * k2.z
  });
  const k4 = derivatives({
    x: state.x + dt * k3.x,
    y: state.y + dt * k3.y,
    z: state.z + dt * k3.z
  });
  
  return {
    x: state.x + dt/6 * (k1.x + 2*k2.x + 2*k3.x + k4.x),
    y: state.y + dt/6 * (k1.y + 2*k2.y + 2*k3.y + k4.y),
    z: state.z + dt/6 * (k1.z + 2*k2.z + 2*k3.z + k4.z)
  };
}

function dotProduct(a: Point3D, b: Point3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Constants
  LORENZ_CLASSIC,
  LORENZ_PHI,
  ROSSLER_CLASSIC,
  ROSSLER_PHI,
  CHEN_CLASSIC,
  FEIGENBAUM_DELTA,
  FEIGENBAUM_ALPHA,
  
  // Systems
  lorenzDerivatives,
  rosslerDerivatives,
  chenDerivatives,
  phiAttractorDerivatives,
  
  // Integration
  integrateLorenz,
  integrateRossler,
  integratePhiAttractor,
  
  // Lyapunov
  estimateLargestLyapunov,
  
  // Logistic map
  logisticMap,
  iterateLogisticMap,
  findBifurcationPoints,
  
  // Dimension
  estimateCorrelationDimension,
  boxCountingDimension,
  
  // Analysis
  poincareSection,
  recurrencePlot,
  recurrenceRate,
  determinism
};
