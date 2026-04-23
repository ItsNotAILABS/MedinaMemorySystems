/**
 * @itsnotailabs/frequency-engine
 * Frequency alignment engine: Schumann harmonics, brainwave entrainment, φ-timing.
 *
 * Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
 * Licensed under ISIL v1.1 — see LICENSE for details.
 * SAEIS enforcement: ACTIVE. SAT token binding: ENABLED.
 */

export const PHI = (1 + Math.sqrt(5)) / 2;
export const SCHUMANN_FUNDAMENTAL = 7.83;

export enum BrainwaveBand {
  Delta = 'delta',
  Theta = 'theta',
  Alpha = 'alpha',
  Beta = 'beta',
  Gamma = 'gamma',
}

const BAND_RANGES: Record<BrainwaveBand, [number, number]> = {
  [BrainwaveBand.Delta]: [0.5, 4],
  [BrainwaveBand.Theta]: [4, 8],
  [BrainwaveBand.Alpha]: [8, 13],
  [BrainwaveBand.Beta]: [13, 30],
  [BrainwaveBand.Gamma]: [30, 100],
};

export interface EntrainmentProfile {
  targetBand: BrainwaveBand;
  carrierHz: number;
  beatHz: number;
  phiAlignedBeatHz: number;
  schumannRatio: number;
}

export class FrequencyEngine {
  /** Classify a raw frequency into its brainwave band. */
  classifyBand(frequencyHz: number): BrainwaveBand | null {
    for (const [band, [lo, hi]] of Object.entries(BAND_RANGES)) {
      if (frequencyHz >= lo && frequencyHz < hi) return band as BrainwaveBand;
    }
    return null;
  }

  /** Generate a binaural entrainment profile for a target brainwave band. */
  generateEntrainment(targetBand: BrainwaveBand, carrierHz = 200): EntrainmentProfile {
    const [lo, hi] = BAND_RANGES[targetBand];
    const midpoint = (lo + hi) / 2;
    const phiAlignedBeat = midpoint * (1 / PHI);

    return {
      targetBand,
      carrierHz,
      beatHz: midpoint,
      phiAlignedBeatHz: phiAlignedBeat,
      schumannRatio: midpoint / SCHUMANN_FUNDAMENTAL,
    };
  }

  /** Compute φ-timed pulse intervals in milliseconds for a given base frequency. */
  phiTimingPulses(baseHz: number, pulseCount: number): number[] {
    const basePeriodMs = 1000 / baseHz;
    const pulses: number[] = [];
    for (let i = 0; i < pulseCount; i++) {
      pulses.push(basePeriodMs * Math.pow(PHI, i));
    }
    return pulses;
  }

  /** Compute Schumann harmonic alignment score for an array of frequencies. */
  schumannAlignment(frequencies: number[]): { frequency: number; alignmentScore: number }[] {
    return frequencies.map((f) => {
      const ratio = f / SCHUMANN_FUNDAMENTAL;
      const nearestInt = Math.round(ratio);
      const deviation = Math.abs(ratio - nearestInt);
      const alignmentScore = Math.max(0, 1 - deviation * 2);
      return { frequency: f, alignmentScore };
    });
  }

  /** Generate an isochronic tone amplitude envelope over time. */
  isochronicEnvelope(frequencyHz: number, durationMs: number, samplesPerCycle = 16): number[] {
    const totalSamples = Math.ceil((durationMs / 1000) * frequencyHz * samplesPerCycle);
    const envelope: number[] = [];
    for (let i = 0; i < totalSamples; i++) {
      const phase = (i / samplesPerCycle) * 2 * Math.PI;
      envelope.push(Math.max(0, Math.sin(phase)));
    }
    return envelope;
  }
}
