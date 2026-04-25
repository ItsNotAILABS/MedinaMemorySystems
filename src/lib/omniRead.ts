/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  OMNI READ — Omnidirectional Read-Only Information Query                    ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                             ║
 * ║  One query. One call. Every dimension. No mutations. No side effects.       ║
 * ║                                                                             ║
 * ║  A query is not an execute. A query is information — the complete           ║
 * ║  truth of what the system knows about a subject, processed through          ║
 * ║  every lens simultaneously and returned as a single unified picture.        ║
 * ║                                                                             ║
 * ║  Dimensions processed per call:                                             ║
 * ║    1. Semantic    — keyword + content matching ranked by salience            ║
 * ║    2. Resonance   — entries ranked by resonance score                       ║
 * ║    3. Doctrinal   — entries filtered by doctrine alignment ≥ 0.8            ║
 * ║    4. Spatial     — entries mapped to their ring coordinates                ║
 * ║    5. Lineage     — ancestry chains traced from top semantic matches        ║
 * ║    6. Pinned      — sovereign anchors always relevant                       ║
 * ║    7. Stats       — aggregate store snapshot                                ║
 * ║    8. Gates       — live gate status (A, B, C) via PORTA SOVEREIGNA        ║
 * ║    9. Symbols     — sovereign lexicon terms relevant to the query           ║
 * ║   10. Unified     — cross-dimensional ranked synthesis                      ║
 * ║                                                                             ║
 * ║  Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import type { MemoryEntry, OmniReadResult } from '@/types';
import {
  queryMemory,
  listMemories,
  getPinnedMemories,
  getMemoryStats,
  getMemoryLineage,
} from './memoryEngine';
import { checkAllGates } from './gateEnforcement';
import { compress, expandAll } from './sovereignLanguage';

// ─── Constants ───────────────────────────────────────────────────────────────

const DIMENSION_COUNT = 10;
const DOCTRINAL_THRESHOLD = 0.8;

// ─── omniRead ────────────────────────────────────────────────────────────────

/**
 * omniRead — the single omnidirectional, read-only information query.
 *
 * Processes `query` through all ten sovereign dimensions simultaneously
 * and returns a complete, unified picture of what the system knows.
 *
 * This function is pure: it reads from the store but never writes to it.
 * No IDs are generated. No entries are created or modified.
 *
 * @param query  The information query. May be any natural language string,
 *               a sovereign symbol, a tag, or an empty string (returns
 *               a full-store snapshot across every dimension).
 * @param limit  Maximum entries per dimension slice (default: 10).
 */
export function omniRead(query: string, limit = 10): OmniReadResult {
  const start = Date.now();
  const qLower = query.toLowerCase();

  // ── Dimension 1: Semantic ─────────────────────────────────────────────────
  const semanticResult = queryMemory({ query, limit: limit * 2 });
  const semanticMatches = semanticResult.entries.slice(0, limit);
  const semanticAvgSalience =
    semanticMatches.length > 0
      ? semanticMatches.reduce((s, e) => s + e.salience, 0) / semanticMatches.length
      : 0;

  // ── Dimension 2: Resonance ────────────────────────────────────────────────
  const allMemories = listMemories(10000);
  const resonanceSorted = allMemories
    .filter((e) => e.resonanceScore !== undefined)
    .sort((a, b) => (b.resonanceScore ?? 0) - (a.resonanceScore ?? 0));
  const resonanceMatches = resonanceSorted.slice(0, limit);
  const resonanceAvgScore =
    resonanceMatches.length > 0
      ? resonanceMatches.reduce((s, e) => s + (e.resonanceScore ?? 0), 0) / resonanceMatches.length
      : 0;

  // ── Dimension 3: Doctrinal ────────────────────────────────────────────────
  const doctrinalMatches = allMemories
    .filter((e) => e.doctrineAlignment >= DOCTRINAL_THRESHOLD)
    .sort((a, b) => b.doctrineAlignment - a.doctrineAlignment)
    .slice(0, limit);
  const doctrinalAvgAlignment =
    doctrinalMatches.length > 0
      ? doctrinalMatches.reduce((s, e) => s + e.doctrineAlignment, 0) / doctrinalMatches.length
      : 0;

  // ── Dimension 4: Spatial ──────────────────────────────────────────────────
  const byRing: Record<number, MemoryEntry[]> = {};
  for (const entry of allMemories) {
    const r = entry.coordinates.ring;
    if (!byRing[r]) byRing[r] = [];
    byRing[r].push(entry);
  }
  const nearestRing = semanticMatches[0]?.coordinates.ring ?? null;

  // ── Dimension 5: Lineage ──────────────────────────────────────────────────
  const seenLineages = new Set<string>();
  const chains: OmniReadResult['lineage']['chains'] = [];
  for (const entry of semanticMatches.slice(0, 5)) {
    if (entry.lineageId && !seenLineages.has(entry.lineageId)) {
      seenLineages.add(entry.lineageId);
      const lineageEntries = getMemoryLineage(entry.lineageId);
      chains.push({
        lineageId: entry.lineageId,
        entries: lineageEntries,
        depth: lineageEntries.length,
      });
    }
  }

  // ── Dimension 6: Pinned ───────────────────────────────────────────────────
  const pinned = getPinnedMemories();

  // ── Dimension 7: Stats ────────────────────────────────────────────────────
  const stats = getMemoryStats();

  // ── Dimension 8: Gates ────────────────────────────────────────────────────
  const gates = checkAllGates();

  // ── Dimension 9: Sovereign Symbols ───────────────────────────────────────
  const allSymbols = expandAll();
  const sovereignSymbols = allSymbols
    .filter((sym) => {
      if (!qLower) return true; // empty query → return all symbols
      return (
        sym.english.toLowerCase().includes(qLower) ||
        sym.latin.toLowerCase().includes(qLower) ||
        sym.symbol.toLowerCase().includes(qLower) ||
        sym.doctrine.toLowerCase().includes(qLower) ||
        sym.compresses.some((c) => c.toLowerCase().includes(qLower))
      );
    })
    .map((sym) => ({
      symbol: sym.symbol,
      english: sym.english,
      latin: sym.latin,
      doctrine: sym.doctrine,
      weight: sym.weight,
    }));

  // ── Compressed query representation ──────────────────────────────────────
  const compressed = query ? compress(query) : '';

  // ── Dimension 10: Unified cross-dimensional synthesis ────────────────────
  // Score each memory entry across the dimensions it appears in.
  // Weights: semantic 40%, resonance 30%, doctrinal 20%, pinned bonus 10%.
  const scoreMap = new Map<string, number>();

  semanticMatches.forEach((e, i) => {
    const weight = (1 - i / (semanticMatches.length || 1)) * 0.4;
    scoreMap.set(e.id, (scoreMap.get(e.id) ?? 0) + weight);
  });

  resonanceMatches.forEach((e) => {
    const weight = (e.resonanceScore ?? 0) * 0.3;
    scoreMap.set(e.id, (scoreMap.get(e.id) ?? 0) + weight);
  });

  doctrinalMatches.forEach((e) => {
    const weight = e.doctrineAlignment * 0.2;
    scoreMap.set(e.id, (scoreMap.get(e.id) ?? 0) + weight);
  });

  pinned.forEach((e) => {
    scoreMap.set(e.id, (scoreMap.get(e.id) ?? 0) + 0.1);
  });

  // Build a fast lookup from all candidate entries
  const entryById = new Map<string, MemoryEntry>(allMemories.map((e) => [e.id, e]));

  const unified = Array.from(scoreMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => entryById.get(id))
    .filter((e): e is MemoryEntry => e !== undefined);

  // ── Assemble and return ───────────────────────────────────────────────────
  return {
    query,
    compressed,
    timestamp: new Date().toISOString(),
    processingMs: Date.now() - start,
    dimensionCount: DIMENSION_COUNT,

    semantic: {
      matches: semanticMatches,
      avgSalience: semanticAvgSalience,
    },

    resonance: {
      matches: resonanceMatches,
      avgScore: resonanceAvgScore,
    },

    doctrinal: {
      matches: doctrinalMatches,
      avgAlignment: doctrinalAvgAlignment,
    },

    spatial: {
      byRing,
      nearestRing,
    },

    lineage: {
      chains,
    },

    pinned,
    stats,
    gates,
    sovereignSymbols,
    unified,
  };
}
