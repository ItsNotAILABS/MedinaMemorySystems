// ISIL-1.0 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE in packages/medina-memory-sdk/LICENSE.
// Unauthorized use, reproduction, or distribution strictly prohibited.
/**
 * Sub-SDK 9: Frequency Alignment
 * Optimize state and communication through harmonic frequency principles.
 */

import { SOLFEGGIO, harmonicResonance } from './computing';

export type FrequencyLayer =
  | 'FOUNDATION'    // 136.1 Hz — Om / Earth
  | 'LIBERATION'    // 396 Hz — Release / Fear removal
  | 'CHANGE'        // 417 Hz — Transformation
  | 'LOVE'          // 528 Hz — DNA repair / Unification
  | 'CONNECTION'    // 639 Hz — Relationships
  | 'EXPRESSION'    // 741 Hz — Intuition / Solutions
  | 'ORDER'         // 852 Hz — Return to order
  | 'COSMIC'        // 963 Hz — Pineal / Awakening

export const FREQUENCY_MAP: Record<FrequencyLayer, number> = {
  FOUNDATION: 136.1,
  LIBERATION: SOLFEGGIO.UT,
  CHANGE: SOLFEGGIO.RE,
  LOVE: SOLFEGGIO.MI,
  CONNECTION: SOLFEGGIO.FA,
  EXPRESSION: SOLFEGGIO.SOL,
  ORDER: SOLFEGGIO.LA,
  COSMIC: SOLFEGGIO.TI,
};

export interface FrequencyState {
  layer: FrequencyLayer;
  hz: number;
  coherence: number;   // 0–1
  resonance: number;   // 0–1, resonance with neighboring layer
  lastAligned: number;
}

/**
 * Create a frequency state for a given layer.
 */
export function createFrequencyState(layer: FrequencyLayer): FrequencyState {
  return {
    layer,
    hz: FREQUENCY_MAP[layer],
    coherence: 1.0,
    resonance: 0.5,
    lastAligned: Date.now(),
  };
}

/**
 * Align two frequency states toward each other.
 */
export function alignFrequencies(a: FrequencyState, b: FrequencyState): { a: FrequencyState; b: FrequencyState; resonance: number } {
  const resonance = harmonicResonance(a.hz, b.hz);

  return {
    a: { ...a, resonance, coherence: Math.min(1, a.coherence + resonance * 0.1), lastAligned: Date.now() },
    b: { ...b, resonance, coherence: Math.min(1, b.coherence + resonance * 0.1), lastAligned: Date.now() },
    resonance,
  };
}

/**
 * Get the frequency layer that best matches an intent description.
 */
export function intentToFrequency(intent: string): FrequencyLayer {
  const lower = intent.toLowerCase();
  if (lower.includes('fear') || lower.includes('release') || lower.includes('ground')) return 'LIBERATION';
  if (lower.includes('change') || lower.includes('transform') || lower.includes('backend')) return 'CHANGE';
  if (lower.includes('love') || lower.includes('unif') || lower.includes('document')) return 'LOVE';
  if (lower.includes('connect') || lower.includes('relation') || lower.includes('wasm')) return 'CONNECTION';
  if (lower.includes('express') || lower.includes('intuition') || lower.includes('icp')) return 'EXPRESSION';
  if (lower.includes('order') || lower.includes('organ') || lower.includes('running')) return 'ORDER';
  if (lower.includes('awak') || lower.includes('cosmic') || lower.includes('www')) return 'COSMIC';
  return 'FOUNDATION';
}
