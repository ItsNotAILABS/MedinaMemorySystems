/**
 * AI Suite 29 — Physics-Informed Machine Learning
 * ============================================================
 * Physical constraints, conservation laws, PDE solutions,
 * Hamiltonian networks, energy conservation, symmetry,
 * φ-coherent physics, and PIML invariants.
 *
 * Target: 100 tests   Charter: AIS-PIML-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Core Types ───────────────────────────────────────────────────────────────

type Vector = number[];
type State = { position: Vector; velocity: Vector; mass: number };
type Field = (x: number, y: number) => number;

// ─── Implementations ──────────────────────────────────────────────────────────

function kineticEnergy(state: State): number {
  const v2 = state.velocity.reduce((s, v) => s + v * v, 0);
  return 0.5 * state.mass * v2;
}

function potentialEnergy(state: State, g: number = 9.81): number {
  // Gravitational PE, assuming position[1] is height
  return state.mass * g * (state.position[1] || 0);
}

function totalEnergy(state: State, g: number = 9.81): number {
  return kineticEnergy(state) + potentialEnergy(state, g);
}

function momentum(state: State): Vector {
  return state.velocity.map(v => v * state.mass);
}

function totalMomentum(states: State[]): Vector {
  const dims = Math.max(...states.map(s => s.velocity.length), 1);
  const total = Array(dims).fill(0);
  for (const state of states) {
    const p = momentum(state);
    for (let i = 0; i < p.length; i++) {
      total[i] += p[i];
    }
  }
  return total;
}

function eulerStep(state: State, force: Vector, dt: number): State {
  const acceleration = force.map(f => f / state.mass);
  const newVelocity = state.velocity.map((v, i) => v + acceleration[i] * dt);
  const newPosition = state.position.map((p, i) => p + state.velocity[i] * dt);
  return { ...state, position: newPosition, velocity: newVelocity };
}

function verletStep(state: State, prevPosition: Vector, force: Vector, dt: number): State {
  const acceleration = force.map(f => f / state.mass);
  const newPosition = state.position.map((p, i) => 
    2 * p - prevPosition[i] + acceleration[i] * dt * dt
  );
  const newVelocity = newPosition.map((p, i) => (p - prevPosition[i]) / (2 * dt));
  return { ...state, position: newPosition, velocity: newVelocity };
}

function harmonicOscillatorForce(position: number, k: number = 1): number {
  return -k * position;
}

function gravitationalForce(m1: number, m2: number, r: number, G: number = 6.674e-11): number {
  if (r === 0) return 0;
  return G * m1 * m2 / (r * r);
}

function springPotential(displacement: number, k: number = 1): number {
  return 0.5 * k * displacement * displacement;
}

function hamiltonianFromEnergy(state: State, potentialFn: (pos: Vector) => number): number {
  const kinetic = kineticEnergy(state);
  const potential = potentialFn(state.position);
  return kinetic + potential;
}

function lagrangianFromEnergy(state: State, potentialFn: (pos: Vector) => number): number {
  const kinetic = kineticEnergy(state);
  const potential = potentialFn(state.position);
  return kinetic - potential;
}

function gradient(f: (x: Vector) => number, x: Vector, h: number = 1e-5): Vector {
  return x.map((_, i) => {
    const xPlus = [...x];
    const xMinus = [...x];
    xPlus[i] += h;
    xMinus[i] -= h;
    return (f(xPlus) - f(xMinus)) / (2 * h);
  });
}

function divergence(field: (x: Vector) => Vector, x: Vector, h: number = 1e-5): number {
  let div = 0;
  for (let i = 0; i < x.length; i++) {
    const xPlus = [...x];
    const xMinus = [...x];
    xPlus[i] += h;
    xMinus[i] -= h;
    div += (field(xPlus)[i] - field(xMinus)[i]) / (2 * h);
  }
  return div;
}

function laplacian(f: (x: Vector) => number, x: Vector, h: number = 1e-5): number {
  let lap = 0;
  for (let i = 0; i < x.length; i++) {
    const xPlus = [...x];
    const xMinus = [...x];
    xPlus[i] += h;
    xMinus[i] -= h;
    lap += (f(xPlus) - 2 * f(x) + f(xMinus)) / (h * h);
  }
  return lap;
}

function heatEquationStep(u: number[], dt: number, dx: number, alpha: number = 1): number[] {
  const newU = [...u];
  const coeff = alpha * dt / (dx * dx);
  for (let i = 1; i < u.length - 1; i++) {
    newU[i] = u[i] + coeff * (u[i + 1] - 2 * u[i] + u[i - 1]);
  }
  return newU;
}

function waveEquationStep(u: number[], uPrev: number[], dt: number, dx: number, c: number = 1): number[] {
  const newU = [...u];
  const coeff = (c * dt / dx) ** 2;
  for (let i = 1; i < u.length - 1; i++) {
    newU[i] = 2 * u[i] - uPrev[i] + coeff * (u[i + 1] - 2 * u[i] + u[i - 1]);
  }
  return newU;
}

function isEnergyConserved(energies: number[], tolerance: number = 0.01): boolean {
  if (energies.length < 2) return true;
  const initial = energies[0];
  return energies.every(e => Math.abs(e - initial) / Math.abs(initial) < tolerance);
}

function isMomentumConserved(momenta: Vector[], tolerance: number = 0.01): boolean {
  if (momenta.length < 2) return true;
  const initial = momenta[0];
  return momenta.every(p => 
    p.every((v, i) => Math.abs(v - initial[i]) < tolerance)
  );
}

function symmetryCheck(f: (x: Vector) => number, x: Vector, axis: number): boolean {
  const xFlipped = [...x];
  xFlipped[axis] = -xFlipped[axis];
  return Math.abs(f(x) - f(xFlipped)) < 1e-10;
}

function phiHarmonicFrequency(baseFreq: number): number {
  return baseFreq * PHI;
}

function phiDampingRatio(): number {
  return 1 / (2 * PHI);
}

function noetherConservation(symmetryPresent: boolean): string {
  return symmetryPresent ? 'conserved' : 'not conserved';
}

function boundaryCondition(value: number, type: 'dirichlet' | 'neumann'): number {
  return type === 'dirichlet' ? value : 0; // Dirichlet: fixed value, Neumann: zero gradient
}

// ─── SECTION 1: Energy calculations ───────────────────────────────────────────
describe('PIML § 1 — Energy', () => {
  test('kineticEnergy at rest', () => {
    expect(kineticEnergy({ position: [0], velocity: [0], mass: 1 })).toBe(0);
  });
  test('kineticEnergy moving', () => {
    expect(kineticEnergy({ position: [0], velocity: [2], mass: 3 })).toBe(6);
  });
  test('kineticEnergy 2D', () => {
    expect(kineticEnergy({ position: [0, 0], velocity: [3, 4], mass: 2 })).toBe(25);
  });
  test('potentialEnergy at ground', () => {
    expect(potentialEnergy({ position: [0, 0], velocity: [0], mass: 1 })).toBe(0);
  });
  test('potentialEnergy at height', () => {
    expect(potentialEnergy({ position: [0, 10], velocity: [0], mass: 1 }, 10)).toBe(100);
  });
  test('totalEnergy sum', () => {
    const state: State = { position: [0, 5], velocity: [10, 0], mass: 2 };
    const ke = kineticEnergy(state);
    const pe = potentialEnergy(state, 10);
    expect(totalEnergy(state, 10)).toBe(ke + pe);
  });
});

// ─── SECTION 2: Momentum ──────────────────────────────────────────────────────
describe('PIML § 2 — Momentum', () => {
  test('momentum at rest', () => {
    expect(momentum({ position: [0], velocity: [0], mass: 5 })).toEqual([0]);
  });
  test('momentum moving', () => {
    expect(momentum({ position: [0], velocity: [3], mass: 2 })).toEqual([6]);
  });
  test('momentum 2D', () => {
    expect(momentum({ position: [0, 0], velocity: [1, 2], mass: 3 })).toEqual([3, 6]);
  });
  test('totalMomentum single body', () => {
    const states: State[] = [{ position: [0], velocity: [5], mass: 2 }];
    expect(totalMomentum(states)).toEqual([10]);
  });
  test('totalMomentum multiple bodies', () => {
    const states: State[] = [
      { position: [0], velocity: [3], mass: 2 },
      { position: [1], velocity: [-1], mass: 4 }
    ];
    expect(totalMomentum(states)[0]).toBe(2);
  });
  test('totalMomentum cancellation', () => {
    const states: State[] = [
      { position: [0], velocity: [5], mass: 2 },
      { position: [1], velocity: [-5], mass: 2 }
    ];
    expect(totalMomentum(states)[0]).toBe(0);
  });
});

// ─── SECTION 3: Integration ───────────────────────────────────────────────────
describe('PIML § 3 — Integration', () => {
  test('eulerStep position update', () => {
    const state: State = { position: [0], velocity: [1], mass: 1 };
    const newState = eulerStep(state, [0], 0.1);
    expect(newState.position[0]).toBeCloseTo(0.1);
  });
  test('eulerStep velocity update', () => {
    const state: State = { position: [0], velocity: [0], mass: 1 };
    const newState = eulerStep(state, [10], 0.1);
    expect(newState.velocity[0]).toBeCloseTo(1);
  });
  test('eulerStep preserves mass', () => {
    const state: State = { position: [0], velocity: [1], mass: 5 };
    const newState = eulerStep(state, [0], 0.1);
    expect(newState.mass).toBe(5);
  });
  test('verletStep position', () => {
    const state: State = { position: [1], velocity: [0], mass: 1 };
    const prev = [0];
    const newState = verletStep(state, prev, [0], 0.1);
    expect(newState.position[0]).toBeCloseTo(2);
  });
  test('verletStep with force', () => {
    const state: State = { position: [0], velocity: [0], mass: 1 };
    const prev = [0];
    const newState = verletStep(state, prev, [10], 0.1);
    expect(newState.position[0]).toBeCloseTo(0.1);
  });
});

// ─── SECTION 4: Forces ────────────────────────────────────────────────────────
describe('PIML § 4 — Forces', () => {
  test('harmonicOscillator at origin', () => {
    expect(harmonicOscillatorForce(0)).toBeCloseTo(0);
  });
  test('harmonicOscillator restoring', () => {
    expect(harmonicOscillatorForce(2, 3)).toBe(-6);
  });
  test('harmonicOscillator negative displacement', () => {
    expect(harmonicOscillatorForce(-2, 1)).toBe(2);
  });
  test('gravitationalForce inverse square', () => {
    const f1 = gravitationalForce(1, 1, 1);
    const f2 = gravitationalForce(1, 1, 2);
    expect(f1).toBeCloseTo(4 * f2);
  });
  test('gravitationalForce zero distance', () => {
    expect(gravitationalForce(1, 1, 0)).toBe(0);
  });
  test('springPotential at equilibrium', () => {
    expect(springPotential(0)).toBe(0);
  });
  test('springPotential displaced', () => {
    expect(springPotential(2, 3)).toBe(6);
  });
});

// ─── SECTION 5: Hamiltonian & Lagrangian ──────────────────────────────────────
describe('PIML § 5 — H & L', () => {
  test('hamiltonianFromEnergy computation', () => {
    const state: State = { position: [1], velocity: [2], mass: 1 };
    const potential = (pos: Vector) => pos[0] ** 2;
    const H = hamiltonianFromEnergy(state, potential);
    expect(H).toBe(2 + 1); // KE=2, PE=1
  });
  test('lagrangianFromEnergy computation', () => {
    const state: State = { position: [1], velocity: [2], mass: 1 };
    const potential = (pos: Vector) => pos[0] ** 2;
    const L = lagrangianFromEnergy(state, potential);
    expect(L).toBe(2 - 1); // KE=2, PE=1
  });
  test('H + L = 2*KE', () => {
    const state: State = { position: [1], velocity: [3], mass: 2 };
    const potential = (pos: Vector) => 5 * pos[0];
    const H = hamiltonianFromEnergy(state, potential);
    const L = lagrangianFromEnergy(state, potential);
    expect(H + L).toBeCloseTo(2 * kineticEnergy(state));
  });
});

// ─── SECTION 6: Differential operators ────────────────────────────────────────
describe('PIML § 6 — Operators', () => {
  test('gradient of linear', () => {
    const f = (x: Vector) => 2 * x[0] + 3 * x[1];
    const grad = gradient(f, [1, 1]);
    expect(grad[0]).toBeCloseTo(2);
    expect(grad[1]).toBeCloseTo(3);
  });
  test('gradient of quadratic', () => {
    const f = (x: Vector) => x[0] ** 2;
    const grad = gradient(f, [3]);
    expect(grad[0]).toBeCloseTo(6);
  });
  test('divergence of constant', () => {
    const field = (x: Vector) => [1, 1];
    expect(divergence(field, [0, 0])).toBeCloseTo(0);
  });
  test('laplacian of quadratic', () => {
    const f = (x: Vector) => x[0] ** 2 + x[1] ** 2;
    expect(laplacian(f, [0, 0])).toBeCloseTo(4);
  });
  test('laplacian of linear = 0', () => {
    const f = (x: Vector) => 3 * x[0] + 2 * x[1];
    expect(laplacian(f, [1, 1])).toBeCloseTo(0);
  });
});

// ─── SECTION 7: PDEs ──────────────────────────────────────────────────────────
describe('PIML § 7 — PDEs', () => {
  test('heatEquation smooths profile', () => {
    const u = [0, 0, 1, 0, 0];
    const u1 = heatEquationStep(u, 0.01, 0.1, 1);
    expect(u1[2]).toBeLessThan(u[2]);
  });
  test('heatEquation preserves boundaries', () => {
    const u = [1, 0.5, 0, 0.5, 1];
    const u1 = heatEquationStep(u, 0.01, 0.1, 1);
    expect(u1[0]).toBe(1);
    expect(u1[4]).toBe(1);
  });
  test('waveEquation propagates', () => {
    const u = [0, 0, 1, 0, 0];
    const uPrev = [0, 0, 1, 0, 0];
    const u1 = waveEquationStep(u, uPrev, 0.01, 0.1, 1);
    expect(u1[1]).not.toBe(0);
    expect(u1[3]).not.toBe(0);
  });
  test('waveEquation boundaries', () => {
    const u = [0, 1, 0];
    const uPrev = [0, 1, 0];
    const u1 = waveEquationStep(u, uPrev, 0.01, 0.1, 1);
    expect(u1[0]).toBe(0);
    expect(u1[2]).toBe(0);
  });
});

// ─── SECTION 8: Conservation ──────────────────────────────────────────────────
describe('PIML § 8 — Conservation', () => {
  test('isEnergyConserved true', () => {
    expect(isEnergyConserved([100, 100.5, 99.8], 0.01)).toBe(true);
  });
  test('isEnergyConserved false', () => {
    expect(isEnergyConserved([100, 110, 90], 0.01)).toBe(false);
  });
  test('isEnergyConserved single value', () => {
    expect(isEnergyConserved([100])).toBe(true);
  });
  test('isMomentumConserved true', () => {
    expect(isMomentumConserved([[10, 5], [10.001, 4.999]], 0.01)).toBe(true);
  });
  test('isMomentumConserved false', () => {
    expect(isMomentumConserved([[10, 5], [11, 4]], 0.01)).toBe(false);
  });
  test('noetherConservation symmetric', () => {
    expect(noetherConservation(true)).toBe('conserved');
  });
  test('noetherConservation asymmetric', () => {
    expect(noetherConservation(false)).toBe('not conserved');
  });
});

// ─── SECTION 9: Symmetry ──────────────────────────────────────────────────────
describe('PIML § 9 — Symmetry', () => {
  test('symmetryCheck even function', () => {
    const f = (x: Vector) => x[0] ** 2;
    expect(symmetryCheck(f, [3], 0)).toBe(true);
  });
  test('symmetryCheck odd function fails', () => {
    const f = (x: Vector) => x[0] ** 3;
    expect(symmetryCheck(f, [3], 0)).toBe(false);
  });
  test('symmetryCheck 2D even', () => {
    const f = (x: Vector) => x[0] ** 2 + x[1] ** 2;
    expect(symmetryCheck(f, [1, 2], 0)).toBe(true);
    expect(symmetryCheck(f, [1, 2], 1)).toBe(true);
  });
  test('boundaryCondition dirichlet', () => {
    expect(boundaryCondition(5, 'dirichlet')).toBe(5);
  });
  test('boundaryCondition neumann', () => {
    expect(boundaryCondition(5, 'neumann')).toBe(0);
  });
});

// ─── SECTION 10: Phi physics ──────────────────────────────────────────────────
describe('PIML § 10 — Phi physics', () => {
  test('phiHarmonicFrequency multiplies by phi', () => {
    expect(phiHarmonicFrequency(1)).toBeCloseTo(PHI);
  });
  test('phiHarmonicFrequency chain', () => {
    const f1 = phiHarmonicFrequency(1);
    const f2 = phiHarmonicFrequency(f1);
    expect(f2).toBeCloseTo(PHI * PHI);
  });
  test('phiDampingRatio value', () => {
    expect(phiDampingRatio()).toBeCloseTo(1 / (2 * PHI));
  });
  test('phiDampingRatio underdamped', () => {
    expect(phiDampingRatio()).toBeLessThan(1);
  });
  test('phi golden ratio', () => {
    expect(PHI).toBeCloseTo((1 + Math.sqrt(5)) / 2);
  });
  test('phi property', () => {
    expect(PHI * PHI).toBeCloseTo(PHI + 1);
  });
  test('phi inverse', () => {
    expect(1 / PHI).toBeCloseTo(PHI - 1);
  });
});
