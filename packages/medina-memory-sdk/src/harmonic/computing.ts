// ISIL-1.0 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE in packages/medina-memory-sdk/LICENSE.
// Unauthorized use, reproduction, or distribution strictly prohibited.
/**
 * Sub-SDK 8: Harmonic Computing
 * Mathematical harmony for modern computing.
 * φ (golden ratio), Fibonacci, sacred geometry constants.
 */

// ─── Constants ─────────────────────────────────────────────────────────────

export const PHI = (1 + Math.sqrt(5)) / 2;        // Golden ratio ≈ 1.618
export const PHI_INVERSE = 1 / PHI;                // ≈ 0.618
export const PHI_SQUARED = PHI * PHI;              // ≈ 2.618
export const SQRT2 = Math.SQRT2;                   // ≈ 1.414
export const SQRT3 = Math.sqrt(3);                 // ≈ 1.732
export const SQRT5 = Math.sqrt(5);                 // ≈ 2.236
export const PI = Math.PI;

/** Solfeggio frequencies (Hz) */
export const SOLFEGGIO = {
  UT: 396,   // Liberation from fear
  RE: 417,   // Change and transformation
  MI: 528,   // Miracles, transformation, DNA repair
  FA: 639,   // Connecting, relationships
  SOL: 741,  // Intuition, expression
  LA: 852,   // Return to order
  TI: 963,   // Awakening, cosmic connection
} as const;

// ─── Fibonacci ──────────────────────────────────────────────────────────────

/**
 * Generate n Fibonacci numbers.
 */
export function fibonacci(n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [0];
  const seq = [0, 1];
  for (let i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2]);
  return seq;
}

/**
 * Check if a number is in the Fibonacci sequence.
 */
export function isFibonacci(n: number): boolean {
  const isPerfectSquare = (x: number) => Math.sqrt(x) === Math.floor(Math.sqrt(x));
  return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
}

// ─── Golden Ratio ────────────────────────────────────────────────────────────

/**
 * Scale a value by the golden ratio.
 */
export function goldenScale(value: number, direction: 'up' | 'down' = 'up'): number {
  return direction === 'up' ? value * PHI : value * PHI_INVERSE;
}

/**
 * Divide a range at the golden ratio point.
 */
export function goldenSection(start: number, end: number): { major: number; minor: number; goldenPoint: number } {
  const range = end - start;
  const goldenPoint = start + range * PHI_INVERSE;
  return {
    major: goldenPoint - start,
    minor: end - goldenPoint,
    goldenPoint,
  };
}

// ─── Harmonic Alignment ──────────────────────────────────────────────────────

/**
 * Calculate harmonic resonance between two frequencies.
 * Returns 1.0 if they are in exact harmonic ratio, decreasing with deviation.
 */
export function harmonicResonance(f1: number, f2: number): number {
  if (f1 === 0 || f2 === 0) return 0;
  const ratio = Math.max(f1, f2) / Math.min(f1, f2);
  const harmonics = [1, 2, 3, 4, 5, 6, 7, 8, PHI, SQRT2, SQRT3];

  let maxResonance = 0;
  for (const h of harmonics) {
    const deviation = Math.abs(ratio - h);
    if (deviation < 0.1) {
      maxResonance = Math.max(maxResonance, 1 - deviation * 10);
    }
  }
  return maxResonance;
}

/**
 * Find the nearest Solfeggio frequency to a given Hz value.
 */
export function nearestSolfeggio(hz: number): { name: string; frequency: number; deviation: number } {
  let nearest = { name: 'UT', frequency: SOLFEGGIO.UT, deviation: Infinity };
  for (const [name, freq] of Object.entries(SOLFEGGIO)) {
    const deviation = Math.abs(hz - freq);
    if (deviation < nearest.deviation) {
      nearest = { name, frequency: freq, deviation };
    }
  }
  return nearest;
}

// ─── Icosahedral Geometry ─────────────────────────────────────────────────────

/** Number of faces, vertices, and edges of an icosahedron. */
export const ICOSAHEDRON = { faces: 20, vertices: 12, edges: 30, goldenRatio: PHI } as const;

/**
 * Generate vertices of an icosahedron centered at the origin.
 */
export function icosahedronVertices(scale = 1): Array<[number, number, number]> {
  const t = PHI * scale;
  return [
    [-scale, t, 0], [scale, t, 0], [-scale, -t, 0], [scale, -t, 0],
    [0, -scale, t], [0, scale, t], [0, -scale, -t], [0, scale, -t],
    [t, 0, -scale], [t, 0, scale], [-t, 0, -scale], [-t, 0, scale],
  ];
}
