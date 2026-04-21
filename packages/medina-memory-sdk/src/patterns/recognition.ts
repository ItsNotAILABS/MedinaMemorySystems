// PROPRIETARY — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE.
// Unauthorized use, reproduction, or distribution strictly prohibited.
/**
 * Sub-SDK 6: Pattern Recognition
 * Discover hidden patterns in any data sequence.
 */

export interface PatternMatch {
  pattern: string;
  positions: number[];
  frequency: number;
  confidence: number;
}

export interface SequenceAnalysis {
  length: number;
  patterns: PatternMatch[];
  entropy: number;
  dominantPattern?: PatternMatch;
}

export class PatternRecognition {
  /**
   * Find repeating subsequences in an array of values.
   */
  findPatterns<T>(sequence: T[], minLength = 2, minFrequency = 2): PatternMatch[] {
    const patterns = new Map<string, number[]>();
    const serialized = sequence.map(v => JSON.stringify(v));

    for (let len = minLength; len <= Math.floor(serialized.length / 2); len++) {
      for (let i = 0; i <= serialized.length - len; i++) {
        const sub = serialized.slice(i, i + len).join('|');
        if (!patterns.has(sub)) patterns.set(sub, []);
        patterns.get(sub)!.push(i);
      }
    }

    const results: PatternMatch[] = [];
    for (const [pattern, positions] of patterns.entries()) {
      if (positions.length >= minFrequency) {
        results.push({
          pattern,
          positions,
          frequency: positions.length,
          confidence: Math.min(1, positions.length / (sequence.length / 2)),
        });
      }
    }

    return results.sort((a, b) => b.frequency - a.frequency).slice(0, 20);
  }

  /**
   * Analyze a numerical sequence for patterns and entropy.
   */
  analyzeSequence(sequence: number[]): SequenceAnalysis {
    const patterns = this.findPatterns(sequence);
    const n = sequence.length;

    // Shannon entropy
    const freq = new Map<number, number>();
    for (const v of sequence) freq.set(v, (freq.get(v) ?? 0) + 1);
    let entropy = 0;
    for (const count of freq.values()) {
      const p = count / n;
      entropy -= p * Math.log2(p);
    }

    return {
      length: n,
      patterns,
      entropy,
      dominantPattern: patterns[0],
    };
  }

  /**
   * Detect anomalies in a number sequence using Z-score.
   */
  detectAnomalies(sequence: number[], threshold = 2.5): Array<{ index: number; value: number; zScore: number }> {
    const mean = sequence.reduce((s, v) => s + v, 0) / sequence.length;
    const std = Math.sqrt(sequence.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / sequence.length);

    return sequence
      .map((value, index) => ({ index, value, zScore: std > 0 ? Math.abs((value - mean) / std) : 0 }))
      .filter(item => item.zScore > threshold);
  }
}
