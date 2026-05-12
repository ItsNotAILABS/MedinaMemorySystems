/**
 * NEURAL DYNAMICS ENGINE
 * ======================
 * Biologically-inspired neural dynamics with φ-harmonic integration
 * 
 * Key Models:
 * - Hodgkin-Huxley: Ion channel dynamics
 * - FitzHugh-Nagumo: Simplified excitable membrane
 * - Izhikevich: Computationally efficient spiking
 * - Kuramoto: Coupled oscillator synchronization
 * - Wilson-Cowan: Population dynamics
 * 
 * @author MEDINA Sovereign Intelligence
 * @version 1.0.0
 * @license Proprietary - All Rights Reserved
 */

import { PHI, PI, TAU, SCHUMANN_FUNDAMENTAL } from './PhiHarmonicMathematics';

// ═══════════════════════════════════════════════════════════════════════════════
// NEURAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const RESTING_POTENTIAL = -70; // mV
export const THRESHOLD_POTENTIAL = -55; // mV
export const PEAK_POTENTIAL = 40; // mV
export const MEMBRANE_CAPACITANCE = 1; // µF/cm²
export const MEMBRANE_TIME_CONSTANT = 20; // ms

export const G_NA = 120; // Sodium conductance
export const G_K = 36; // Potassium conductance
export const G_L = 0.3; // Leak conductance
export const E_NA = 50; // Sodium reversal
export const E_K = -77; // Potassium reversal
export const E_L = -54.4; // Leak reversal

export const BRAIN_RHYTHMS = {
  delta: { min: 0.5, max: 4 },
  theta: { min: 4, max: 8 },
  alpha: { min: 8, max: 13 },
  beta: { min: 13, max: 30 },
  gamma: { min: 30, max: 100 },
  phiResonance: SCHUMANN_FUNDAMENTAL * PHI
};

// ═══════════════════════════════════════════════════════════════════════════════
// HODGKIN-HUXLEY MODEL
// ═══════════════════════════════════════════════════════════════════════════════

export interface HodgkinHuxleyState {
  V: number; m: number; h: number; n: number;
}

export function hhAlphaM(V: number): number {
  const dV = V + 40;
  return Math.abs(dV) < 1e-6 ? 1 : 0.1 * dV / (1 - Math.exp(-dV / 10));
}

export function hhBetaM(V: number): number {
  return 4 * Math.exp(-(V + 65) / 18);
}

export function hhAlphaH(V: number): number {
  return 0.07 * Math.exp(-(V + 65) / 20);
}

export function hhBetaH(V: number): number {
  return 1 / (1 + Math.exp(-(V + 35) / 10));
}

export function hhAlphaN(V: number): number {
  const dV = V + 55;
  return Math.abs(dV) < 1e-6 ? 0.1 : 0.01 * dV / (1 - Math.exp(-dV / 10));
}

export function hhBetaN(V: number): number {
  return 0.125 * Math.exp(-(V + 65) / 80);
}

export function hodgkinHuxleyDerivatives(state: HodgkinHuxleyState, I_ext: number): HodgkinHuxleyState {
  const { V, m, h, n } = state;
  const I_Na = G_NA * Math.pow(m, 3) * h * (V - E_NA);
  const I_K = G_K * Math.pow(n, 4) * (V - E_K);
  const I_L = G_L * (V - E_L);
  
  return {
    V: (I_ext - I_Na - I_K - I_L) / MEMBRANE_CAPACITANCE,
    m: hhAlphaM(V) * (1 - m) - hhBetaM(V) * m,
    h: hhAlphaH(V) * (1 - h) - hhBetaH(V) * h,
    n: hhAlphaN(V) * (1 - n) - hhBetaN(V) * n
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// IZHIKEVICH MODEL
// ═══════════════════════════════════════════════════════════════════════════════

export interface IzhikevichState { v: number; u: number; }
export interface IzhikevichParams { a: number; b: number; c: number; d: number; }

export const IZH_REGULAR_SPIKING: IzhikevichParams = { a: 0.02, b: 0.2, c: -65, d: 8 };
export const IZH_FAST_SPIKING: IzhikevichParams = { a: 0.1, b: 0.2, c: -65, d: 2 };
export const IZH_BURSTING: IzhikevichParams = { a: 0.02, b: 0.2, c: -50, d: 2 };
export const IZH_PHI: IzhikevichParams = { a: 0.02 * PHI, b: 0.2 / PHI, c: -65 / PHI, d: 8 * PHI };

export function izhikevichStep(state: IzhikevichState, params: IzhikevichParams, I: number, dt: number): { state: IzhikevichState; spiked: boolean } {
  let { v, u } = state;
  const { a, b, c, d } = params;
  
  v += (0.04 * v * v + 5 * v + 140 - u + I) * dt;
  u += a * (b * v - u) * dt;
  
  let spiked = false;
  if (v >= 30) { v = c; u += d; spiked = true; }
  
  return { state: { v, u }, spiked };
}

// ═══════════════════════════════════════════════════════════════════════════════
// KURAMOTO MODEL
// ═══════════════════════════════════════════════════════════════════════════════

export interface KuramotoState { phases: number[]; }
export interface KuramotoParams { naturalFrequencies: number[]; couplingStrength: number; }

export function kuramotoOrderParameter(phases: number[]): { r: number; psi: number } {
  const N = phases.length;
  let sumCos = 0, sumSin = 0;
  for (const theta of phases) { sumCos += Math.cos(theta); sumSin += Math.sin(theta); }
  sumCos /= N; sumSin /= N;
  return { r: Math.sqrt(sumCos * sumCos + sumSin * sumSin), psi: Math.atan2(sumSin, sumCos) };
}

export function kuramotoDerivatives(state: KuramotoState, params: KuramotoParams): number[] {
  const { phases } = state;
  const { naturalFrequencies, couplingStrength } = params;
  const N = phases.length;
  
  return phases.map((theta, i) => {
    let coupling = 0;
    for (let j = 0; j < N; j++) coupling += Math.sin(phases[j] - theta);
    return naturalFrequencies[i] + (couplingStrength / N) * coupling;
  });
}

export function createPhiKuramotoParams(N: number, K: number): KuramotoParams {
  const frequencies = Array(N).fill(0).map((_, i) => {
    const baseFreq = SCHUMANN_FUNDAMENTAL * Math.pow(PHI, (i % 7) - 3);
    return TAU * (baseFreq + (Math.random() - 0.5) * 0.1 * baseFreq);
  });
  return { naturalFrequencies: frequencies, couplingStrength: K };
}

// ═══════════════════════════════════════════════════════════════════════════════
// WILSON-COWAN MODEL
// ═══════════════════════════════════════════════════════════════════════════════

export interface WilsonCowanState { E: number; I: number; }
export interface WilsonCowanParams {
  tauE: number; tauI: number; wEE: number; wEI: number; wIE: number; wII: number;
  kE: number; kI: number; threshE: number; threshI: number; P: number; Q: number;
}

export const WC_DEFAULT: WilsonCowanParams = {
  tauE: 10, tauI: 20, wEE: 10, wEI: -10, wIE: 12, wII: -2,
  kE: 1.2, kI: 1.0, threshE: 2.0, threshI: 2.5, P: 0.5, Q: 0
};

export const WC_PHI: WilsonCowanParams = {
  tauE: 10 / PHI, tauI: 10 * PHI, wEE: 10, wEI: -10 * PHI, wIE: 10 * PHI, wII: -10 / (PHI * PHI),
  kE: PHI, kI: 1 / PHI, threshE: PHI, threshI: PHI * PHI, P: 0.5, Q: 0
};

export function sigmoid(x: number, k: number, theta: number): number {
  return 1 / (1 + Math.exp(-k * (x - theta)));
}

export function wilsonCowanDerivatives(state: WilsonCowanState, params: WilsonCowanParams): WilsonCowanState {
  const { E, I } = state;
  const { tauE, tauI, wEE, wEI, wIE, wII, kE, kI, threshE, threshI, P, Q } = params;
  return {
    E: (-E + sigmoid(wEE * E + wEI * I + P, kE, threshE)) / tauE,
    I: (-I + sigmoid(wIE * E + wII * I + Q, kI, threshI)) / tauI
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPIKE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

export function calculateISI(spikeTimes: number[]): number[] {
  return spikeTimes.slice(1).map((t, i) => t - spikeTimes[i]);
}

export function calculateCV(isi: number[]): number {
  if (isi.length === 0) return 0;
  const mean = isi.reduce((a, b) => a + b, 0) / isi.length;
  const std = Math.sqrt(isi.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / isi.length);
  return std / mean;
}

export function firingRate(spikeTimes: number[], windowStart: number, windowEnd: number): number {
  const spikes = spikeTimes.filter(t => t >= windowStart && t < windowEnd).length;
  return spikes / ((windowEnd - windowStart) / 1000);
}

export default {
  RESTING_POTENTIAL, THRESHOLD_POTENTIAL, BRAIN_RHYTHMS,
  hhAlphaM, hhBetaM, hhAlphaH, hhBetaH, hhAlphaN, hhBetaN, hodgkinHuxleyDerivatives,
  IZH_REGULAR_SPIKING, IZH_FAST_SPIKING, IZH_BURSTING, IZH_PHI, izhikevichStep,
  kuramotoOrderParameter, kuramotoDerivatives, createPhiKuramotoParams,
  WC_DEFAULT, WC_PHI, sigmoid, wilsonCowanDerivatives,
  calculateISI, calculateCV, firingRate
};
