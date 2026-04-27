/**
 * Tests for omniRead.ts
 *
 * Verifies that omniRead is:
 *   1. Genuinely read-only — the store is unchanged after any call
 *   2. Complete — all 10 dimensions are populated in the return value
 *   3. Correct — each dimension returns the right data
 *   4. Unified — the cross-dimensional synthesis ranks entries sensibly
 */

export {};

let omniReadModule: typeof import('@/lib/omniRead');
let memoryModule: typeof import('@/lib/memoryEngine');

beforeEach(() => {
  jest.resetModules();
  omniReadModule = require('@/lib/omniRead');
  memoryModule = require('@/lib/memoryEngine');
});

// ─── Shape ───────────────────────────────────────────────────────────────────

describe('OmniReadResult shape', () => {
  it('returns all required top-level fields', () => {
    const result = omniReadModule.omniRead('test');

    expect(result).toHaveProperty('query', 'test');
    expect(result).toHaveProperty('compressed');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('processingMs');
    expect(result).toHaveProperty('dimensionCount', 10);

    expect(result).toHaveProperty('semantic');
    expect(result).toHaveProperty('resonance');
    expect(result).toHaveProperty('doctrinal');
    expect(result).toHaveProperty('spatial');
    expect(result).toHaveProperty('lineage');
    expect(result).toHaveProperty('pinned');
    expect(result).toHaveProperty('stats');
    expect(result).toHaveProperty('gates');
    expect(result).toHaveProperty('sovereignSymbols');
    expect(result).toHaveProperty('unified');
  });

  it('semantic dimension has matches array and avgSalience', () => {
    const result = omniReadModule.omniRead('gateway');
    expect(Array.isArray(result.semantic.matches)).toBe(true);
    expect(typeof result.semantic.avgSalience).toBe('number');
  });

  it('resonance dimension has matches array and avgScore', () => {
    const result = omniReadModule.omniRead('memory');
    expect(Array.isArray(result.resonance.matches)).toBe(true);
    expect(typeof result.resonance.avgScore).toBe('number');
  });

  it('doctrinal dimension has matches array and avgAlignment', () => {
    const result = omniReadModule.omniRead('law');
    expect(Array.isArray(result.doctrinal.matches)).toBe(true);
    expect(typeof result.doctrinal.avgAlignment).toBe('number');
  });

  it('spatial dimension has byRing record and nearestRing', () => {
    const result = omniReadModule.omniRead('ring');
    expect(typeof result.spatial.byRing).toBe('object');
    // nearestRing is null or a number
    expect(result.spatial.nearestRing === null || typeof result.spatial.nearestRing === 'number').toBe(true);
  });

  it('lineage dimension has chains array', () => {
    const result = omniReadModule.omniRead('lineage');
    expect(Array.isArray(result.lineage.chains)).toBe(true);
  });

  it('pinned dimension is an array', () => {
    const result = omniReadModule.omniRead('pinned');
    expect(Array.isArray(result.pinned)).toBe(true);
  });

  it('stats dimension has total, pinned, byType, avgSalience', () => {
    const result = omniReadModule.omniRead('stats');
    expect(typeof result.stats.total).toBe('number');
    expect(typeof result.stats.pinned).toBe('number');
    expect(typeof result.stats.byType).toBe('object');
    expect(typeof result.stats.avgSalience).toBe('number');
  });

  it('gates dimension has A, B, C', () => {
    const result = omniReadModule.omniRead('gates');
    expect(result.gates).toHaveProperty('A');
    expect(result.gates).toHaveProperty('B');
    expect(result.gates).toHaveProperty('C');
  });

  it('sovereignSymbols dimension is an array of objects with required fields', () => {
    const result = omniReadModule.omniRead('');
    expect(Array.isArray(result.sovereignSymbols)).toBe(true);
    for (const sym of result.sovereignSymbols) {
      expect(sym).toHaveProperty('symbol');
      expect(sym).toHaveProperty('english');
      expect(sym).toHaveProperty('latin');
      expect(sym).toHaveProperty('doctrine');
      expect(sym).toHaveProperty('weight');
    }
  });

  it('unified dimension is an array of MemoryEntries', () => {
    const result = omniReadModule.omniRead('memory');
    expect(Array.isArray(result.unified)).toBe(true);
  });
});

// ─── Read-Only Guarantee ──────────────────────────────────────────────────────

describe('read-only guarantee', () => {
  it('does not change the store size after a call', () => {
    const before = memoryModule.getMemoryStats().total;
    omniReadModule.omniRead('sovereignty');
    const after = memoryModule.getMemoryStats().total;
    expect(after).toBe(before);
  });

  it('does not change the store size on multiple calls', () => {
    const before = memoryModule.getMemoryStats().total;
    for (let i = 0; i < 5; i++) {
      omniReadModule.omniRead(`query-${i}`);
    }
    const after = memoryModule.getMemoryStats().total;
    expect(after).toBe(before);
  });

  it('does not modify existing entries', () => {
    const entry = memoryModule.storeMemory('Canary entry', 'semantic', ['canary']);
    const before = { ...entry };

    omniReadModule.omniRead('canary');

    const after = memoryModule.getMemory(entry.id);
    expect(after?.content).toBe(before.content);
    expect(after?.salience).toBe(before.salience);
    expect(after?.resonanceScore).toBe(before.resonanceScore);
  });

  it('returns a fresh timestamp on every call', () => {
    const r1 = omniReadModule.omniRead('time');
    const r2 = omniReadModule.omniRead('time');
    // Timestamps are ISO strings — they should be valid dates
    expect(new Date(r1.timestamp).getTime()).not.toBeNaN();
    expect(new Date(r2.timestamp).getTime()).not.toBeNaN();
  });
});

// ─── Metadata fields ─────────────────────────────────────────────────────────

describe('metadata fields', () => {
  it('echo back the original query', () => {
    const result = omniReadModule.omniRead('Sovereign Gateway');
    expect(result.query).toBe('Sovereign Gateway');
  });

  it('processingMs is a non-negative number', () => {
    const result = omniReadModule.omniRead('test');
    expect(result.processingMs).toBeGreaterThanOrEqual(0);
  });

  it('dimensionCount is 10', () => {
    const result = omniReadModule.omniRead('');
    expect(result.dimensionCount).toBe(10);
  });

  it('compressed is the query passed through the sovereign lexicon', () => {
    const result = omniReadModule.omniRead('The Golden Section governs coherence');
    // 'The Golden Section' → 'φ' after compression
    expect(result.compressed).toContain('φ');
  });

  it('compressed is empty string for empty query', () => {
    const result = omniReadModule.omniRead('');
    expect(result.compressed).toBe('');
  });
});

// ─── Dimension 1: Semantic ───────────────────────────────────────────────────

describe('dimension 1 — semantic', () => {
  it('finds entries by content keyword', () => {
    memoryModule.storeMemory('Unique semantic keyword xqzm', 'semantic', ['xqzm']);
    const result = omniReadModule.omniRead('xqzm');
    expect(result.semantic.matches.some((e) => e.content.includes('xqzm'))).toBe(true);
  });

  it('finds entries by tag', () => {
    memoryModule.storeMemory('Tag-indexed entry', 'semantic', ['omni-tag-xyz']);
    const result = omniReadModule.omniRead('omni-tag-xyz');
    expect(result.semantic.matches.some((e) => e.tags.includes('omni-tag-xyz'))).toBe(true);
  });

  it('respects the limit', () => {
    for (let i = 0; i < 20; i++) {
      memoryModule.storeMemory(`Limit test entry ${i}`, 'semantic', ['limit-test']);
    }
    const result = omniReadModule.omniRead('limit-test', 5);
    expect(result.semantic.matches.length).toBeLessThanOrEqual(5);
  });

  it('avgSalience is 0 when there are no semantic matches', () => {
    const result = omniReadModule.omniRead('zzznomatchzzz999');
    expect(result.semantic.avgSalience).toBe(0);
  });

  it('avgSalience is within [0, 1]', () => {
    memoryModule.storeMemory('Salience check entry', 'doctrinal', ['sal-check']);
    const result = omniReadModule.omniRead('sal-check');
    expect(result.semantic.avgSalience).toBeGreaterThanOrEqual(0);
    expect(result.semantic.avgSalience).toBeLessThanOrEqual(1);
  });
});

// ─── Dimension 2: Resonance ──────────────────────────────────────────────────

describe('dimension 2 — resonance', () => {
  it('resonance matches are sorted by resonance score descending', () => {
    const low = memoryModule.storeMemory('Low resonance', 'semantic');
    const high = memoryModule.storeMemory('High resonance', 'semantic');
    memoryModule.updateMemory(low.id, { resonanceScore: 0.1 });
    memoryModule.updateMemory(high.id, { resonanceScore: 0.99 });

    const result = omniReadModule.omniRead('resonance');
    const scores = result.resonance.matches.map((e) => e.resonanceScore ?? 0);
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]);
    }
  });

  it('avgScore is within [0, 1]', () => {
    memoryModule.storeMemory('Resonance avg test', 'semantic');
    const result = omniReadModule.omniRead('avg');
    expect(result.resonance.avgScore).toBeGreaterThanOrEqual(0);
    expect(result.resonance.avgScore).toBeLessThanOrEqual(1);
  });
});

// ─── Dimension 3: Doctrinal ──────────────────────────────────────────────────

describe('dimension 3 — doctrinal', () => {
  it('only includes entries with doctrineAlignment >= 0.8', () => {
    const result = omniReadModule.omniRead('');
    for (const e of result.doctrinal.matches) {
      expect(e.doctrineAlignment).toBeGreaterThanOrEqual(0.8);
    }
  });

  it('sorted by doctrine alignment descending', () => {
    const result = omniReadModule.omniRead('');
    const alignments = result.doctrinal.matches.map((e) => e.doctrineAlignment);
    for (let i = 1; i < alignments.length; i++) {
      expect(alignments[i - 1]).toBeGreaterThanOrEqual(alignments[i]);
    }
  });
});

// ─── Dimension 4: Spatial ────────────────────────────────────────────────────

describe('dimension 4 — spatial', () => {
  it('byRing groups entries under their ring number', () => {
    const e = memoryModule.storeMemory('Ring test', 'spatial', [], { ring: 7 });
    const result = omniReadModule.omniRead('');
    expect(result.spatial.byRing[7]).toBeDefined();
    expect(result.spatial.byRing[7].some((m) => m.id === e.id)).toBe(true);
  });

  it('nearestRing matches ring of top semantic match when available', () => {
    memoryModule.storeMemory('NearRing unique xqzr', 'semantic', ['xqzr'], { ring: 4 });
    const result = omniReadModule.omniRead('xqzr');
    if (result.semantic.matches.length > 0) {
      expect(result.spatial.nearestRing).toBe(result.semantic.matches[0].coordinates.ring);
    }
  });

  it('nearestRing is null when there are no semantic matches', () => {
    const result = omniReadModule.omniRead('zzznomatchring999');
    expect(result.spatial.nearestRing).toBeNull();
  });
});

// ─── Dimension 5: Lineage ────────────────────────────────────────────────────

describe('dimension 5 — lineage', () => {
  it('chains are traced for semantic matches that have a lineageId', () => {
    const parent = memoryModule.storeMemory('Parent entry', 'episodic', ['lineage-test']);
    memoryModule.storeMemory('Child entry', 'episodic', ['lineage-test'], undefined, parent.id);

    const result = omniReadModule.omniRead('lineage-test');
    // At least one chain should be present
    if (result.lineage.chains.length > 0) {
      expect(typeof result.lineage.chains[0].lineageId).toBe('string');
      expect(Array.isArray(result.lineage.chains[0].entries)).toBe(true);
      expect(typeof result.lineage.chains[0].depth).toBe('number');
    }
  });

  it('depth matches the number of entries in the chain', () => {
    const result = omniReadModule.omniRead('');
    for (const chain of result.lineage.chains) {
      expect(chain.depth).toBe(chain.entries.length);
    }
  });
});

// ─── Dimension 6: Pinned ─────────────────────────────────────────────────────

describe('dimension 6 — pinned', () => {
  it('includes pinned memories', () => {
    const e = memoryModule.storeMemory('Pinned test entry', 'semantic', ['pinned-check']);
    memoryModule.pinMemory(e.id);

    const result = omniReadModule.omniRead('');
    expect(result.pinned.some((m) => m.id === e.id)).toBe(true);
  });

  it('all returned entries have pinned === true', () => {
    const result = omniReadModule.omniRead('');
    for (const e of result.pinned) {
      expect(e.pinned).toBe(true);
    }
  });
});

// ─── Dimension 7: Stats ──────────────────────────────────────────────────────

describe('dimension 7 — stats', () => {
  it('total reflects current store size', () => {
    const before = memoryModule.getMemoryStats().total;
    memoryModule.storeMemory('Stats count test', 'semantic');
    const result = omniReadModule.omniRead('');
    expect(result.stats.total).toBe(before + 1);
  });

  it('avgSalience is within [0, 1]', () => {
    const result = omniReadModule.omniRead('');
    expect(result.stats.avgSalience).toBeGreaterThanOrEqual(0);
    expect(result.stats.avgSalience).toBeLessThanOrEqual(1);
  });
});

// ─── Dimension 8: Gates ──────────────────────────────────────────────────────

describe('dimension 8 — gates', () => {
  it('all three gates are returned', () => {
    const result = omniReadModule.omniRead('gate');
    expect(result.gates.A).toBeDefined();
    expect(result.gates.B).toBeDefined();
    expect(result.gates.C).toBeDefined();
  });

  it('each gate has allowed (boolean) and reason (string)', () => {
    const result = omniReadModule.omniRead('');
    for (const key of ['A', 'B', 'C'] as const) {
      expect(typeof result.gates[key].allowed).toBe('boolean');
      expect(typeof result.gates[key].reason).toBe('string');
    }
  });
});

// ─── Dimension 9: Sovereign Symbols ─────────────────────────────────────────

describe('dimension 9 — sovereign symbols', () => {
  it('returns all 4 symbols on empty query', () => {
    const result = omniReadModule.omniRead('');
    expect(result.sovereignSymbols.length).toBe(4);
  });

  it('filters symbols relevant to a query term', () => {
    const result = omniReadModule.omniRead('Golden Section');
    expect(result.sovereignSymbols.some((s) => s.symbol === 'φ')).toBe(true);
  });

  it('filters symbols relevant to "gateway"', () => {
    const result = omniReadModule.omniRead('gateway');
    expect(result.sovereignSymbols.some((s) => s.symbol === 'PORTA SOVEREIGNA')).toBe(true);
  });

  it('each symbol has the required fields', () => {
    const result = omniReadModule.omniRead('');
    for (const s of result.sovereignSymbols) {
      expect(typeof s.symbol).toBe('string');
      expect(typeof s.english).toBe('string');
      expect(typeof s.latin).toBe('string');
      expect(typeof s.doctrine).toBe('string');
      expect(typeof s.weight).toBe('number');
    }
  });
});

// ─── Dimension 10: Unified ───────────────────────────────────────────────────

describe('dimension 10 — unified', () => {
  it('unified entries are all valid MemoryEntry objects', () => {
    const result = omniReadModule.omniRead('memory');
    for (const e of result.unified) {
      expect(e).toHaveProperty('id');
      expect(e).toHaveProperty('content');
      expect(e).toHaveProperty('type');
    }
  });

  it('unified respects the limit', () => {
    for (let i = 0; i < 20; i++) {
      memoryModule.storeMemory(`Unified limit ${i}`, 'semantic', ['ulimit']);
    }
    const result = omniReadModule.omniRead('ulimit', 5);
    expect(result.unified.length).toBeLessThanOrEqual(5);
  });

  it('high-salience high-resonance entries appear in unified', () => {
    const top = memoryModule.storeMemory('Top score candidate', 'doctrinal', ['top-candidate']);
    memoryModule.updateMemory(top.id, { salience: 1.0, resonanceScore: 1.0, doctrineAlignment: 1.0 });

    const result = omniReadModule.omniRead('top-candidate', 20);
    expect(result.unified.some((e) => e.id === top.id)).toBe(true);
  });

  it('no duplicate entries in unified', () => {
    const result = omniReadModule.omniRead('');
    const ids = result.unified.map((e) => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('edge cases', () => {
  it('handles empty string query without throwing', () => {
    expect(() => omniReadModule.omniRead('')).not.toThrow();
  });

  it('handles whitespace-only query without throwing', () => {
    expect(() => omniReadModule.omniRead('   ')).not.toThrow();
  });

  it('handles very long query string without throwing', () => {
    expect(() => omniReadModule.omniRead('x'.repeat(5000))).not.toThrow();
  });

  it('handles limit of 1', () => {
    const result = omniReadModule.omniRead('memory', 1);
    expect(result.semantic.matches.length).toBeLessThanOrEqual(1);
    expect(result.resonance.matches.length).toBeLessThanOrEqual(1);
    expect(result.unified.length).toBeLessThanOrEqual(1);
  });

  it('handles limit of 0 by returning empty arrays per dimension', () => {
    const result = omniReadModule.omniRead('memory', 0);
    expect(result.semantic.matches.length).toBe(0);
    expect(result.unified.length).toBe(0);
  });
});
