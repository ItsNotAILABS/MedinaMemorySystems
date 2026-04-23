/**
 * @itsnotailabs/harmonic-compute
 * Harmonic computing substrate: Schumann-locked frequency math, φ-resonance calculations.
 *
 * Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
 * Licensed under ISIL v1.1 — see LICENSE for details.
 * SAEIS enforcement: ACTIVE. SAT token binding: ENABLED.
 */

export const PHI = (1 + Math.sqrt(5)) / 2;
export const SCHUMANN_BASE_HZ = 7.83;

/** Schumann harmonic frequencies (first 8 modes). */
export const SCHUMANN_HARMONICS: readonly number[] = Object.freeze(
  Array.from({ length: 8 }, (_, i) => SCHUMANN_BASE_HZ * (i + 1))
);

export interface ResonanceResult {
  inputFrequency: number;
  nearestHarmonic: number;
  harmonicIndex: number;
  deviationHz: number;
  phiCoherence: number;
}

export class HarmonicCompute {
  private readonly harmonics: number[];

  constructor(customHarmonics?: number[]) {
    this.harmonics = customHarmonics ?? [...SCHUMANN_HARMONICS];
  }

  /** Find the nearest Schumann harmonic for a given frequency and compute φ-coherence. */
  analyzeResonance(frequencyHz: number): ResonanceResult {
    let nearest = this.harmonics[0];
    let bestIdx = 0;
    let minDev = Math.abs(frequencyHz - nearest);

    for (let i = 1; i < this.harmonics.length; i++) {
      const dev = Math.abs(frequencyHz - this.harmonics[i]);
      if (dev < minDev) {
        minDev = dev;
        nearest = this.harmonics[i];
        bestIdx = i;
      }
    }

    const ratio = frequencyHz / nearest;
    const phiCoherence = 1 - Math.abs(ratio - this.nearestPhiPower(ratio));

    return {
      inputFrequency: frequencyHz,
      nearestHarmonic: nearest,
      harmonicIndex: bestIdx,
      deviationHz: minDev,
      phiCoherence: Math.max(0, phiCoherence),
    };
  }

  /** Generate a φ-scaled frequency ladder from a base frequency. */
  phiLadder(baseHz: number, steps: number): number[] {
    const ladder: number[] = [baseHz];
    for (let i = 1; i < steps; i++) {
      ladder.push(baseHz * Math.pow(PHI, i));
    }
    return ladder;
  }

  /** Compute the interference pattern between two frequencies over a time window. */
  interferencePattern(f1: number, f2: number, durationMs: number, sampleCount = 64): number[] {
    const pattern: number[] = [];
    const dt = durationMs / sampleCount;
    for (let i = 0; i < sampleCount; i++) {
      const t = i * dt / 1000;
      const wave1 = Math.sin(2 * Math.PI * f1 * t);
      const wave2 = Math.sin(2 * Math.PI * f2 * t);
      pattern.push(wave1 + wave2);
    }
    return pattern;
  }

  /** Compute harmonic mean of an array of frequencies. */
  harmonicMean(frequencies: number[]): number {
    if (frequencies.length === 0) return 0;
    const reciprocalSum = frequencies.reduce((s, f) => s + (f === 0 ? 0 : 1 / f), 0);
    return reciprocalSum === 0 ? 0 : frequencies.length / reciprocalSum;
  }

  private nearestPhiPower(value: number): number {
    if (value <= 0) return 1;
    const logPhi = Math.log(value) / Math.log(PHI);
    const rounded = Math.round(logPhi);
    return Math.pow(PHI, rounded);
  }
}
