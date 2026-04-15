import type { DualReadResult, MemoryEntry } from '@/types';
import { listMemories, queryMemory } from './memoryEngine';

// ─── Dual Read: Semantic + Resonance ─────────────────────────────────────────

export function dualRead(query: string, limit = 10): DualReadResult {
  // Semantic read: keyword/content matching
  const semanticResult = queryMemory({ query, limit: limit * 2 });
  const semanticEntries = semanticResult.entries;

  // Resonance read: score-based ranking
  const allMemories = listMemories(100);
  const resonanceEntries = allMemories
    .filter((e) => e.resonanceScore !== undefined)
    .sort((a, b) => (b.resonanceScore ?? 0) - (a.resonanceScore ?? 0))
    .slice(0, limit * 2);

  // Unified score: combine semantic rank + resonance score
  const semanticScoreMap = new Map<string, number>();
  semanticEntries.forEach((e, idx) => {
    semanticScoreMap.set(e.id, 1 - idx / semanticEntries.length);
  });

  const resonanceScoreMap = new Map<string, number>();
  resonanceEntries.forEach((e) => {
    resonanceScoreMap.set(e.id, e.resonanceScore ?? 0);
  });

  // All candidate IDs
  const allIds = new Set([...semanticScoreMap.keys(), ...resonanceScoreMap.keys()]);

  const scored: Array<{ entry: MemoryEntry; combined: number }> = [];
  for (const id of allIds) {
    const semanticScore = semanticScoreMap.get(id) ?? 0;
    const resonanceScore = resonanceScoreMap.get(id) ?? 0;
    const combined = semanticScore * 0.5 + resonanceScore * 0.5;

    const entry = semanticEntries.find((e) => e.id === id) ?? resonanceEntries.find((e) => e.id === id);
    if (entry) scored.push({ entry, combined });
  }

  scored.sort((a, b) => b.combined - a.combined);
  const unified = scored.slice(0, limit).map((s) => s.entry);

  const avgSemantic = semanticEntries.slice(0, limit).length > 0
    ? semanticEntries.slice(0, limit).reduce((sum, e) => sum + e.salience, 0) / Math.min(semanticEntries.length, limit)
    : 0;

  const avgResonance = resonanceEntries.slice(0, limit).length > 0
    ? resonanceEntries.slice(0, limit).reduce((sum, e) => sum + (e.resonanceScore ?? 0), 0) / Math.min(resonanceEntries.length, limit)
    : 0;

  return {
    semanticScore: avgSemantic,
    resonanceScore: avgResonance,
    combinedScore: (avgSemantic + avgResonance) / 2,
    semanticMatches: semanticEntries.slice(0, limit),
    resonanceMatches: resonanceEntries.slice(0, limit),
    unified,
  };
}
