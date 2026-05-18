/**
 * AI Suite 17 — Cognitive Architecture
 * ============================================================
 * Working memory (capacity/decay), episodic retrieval (recency/cue),
 * semantic association, inhibition of return, cognitive load,
 * top-down attention, chunking, and φ-attention spotlight.
 *
 * Target: 140+ tests   Charter: AIS-COG-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Implementations ──────────────────────────────────────────────────────────

interface CogChunk { id: string; content: string; activation: number; timestamp: number; }

class WorkingMemory {
  private slots: CogChunk[] = [];
  constructor(private capacity = 7) {}

  encode(chunk: CogChunk): void {
    if (this.slots.length >= this.capacity) {
      this.slots.sort((a, b) => a.activation - b.activation);
      this.slots.shift();
    }
    this.slots.push({ ...chunk });
  }

  retrieve(id: string): CogChunk | undefined { return this.slots.find(c => c.id === id); }
  get size(): number { return this.slots.length; }

  decay(rate: number, now: number): void {
    this.slots.forEach(c => { c.activation *= Math.exp(-rate * (now - c.timestamp)); });
    this.slots = this.slots.filter(c => c.activation > 0.01);
  }

  topK(k: number): CogChunk[] {
    return [...this.slots].sort((a, b) => b.activation - a.activation).slice(0, k);
  }

  inhibit(id: string, amount: number): void {
    const c = this.slots.find(c => c.id === id);
    if (c) c.activation = Math.max(0, c.activation - amount);
  }

  cogLoad(): number { return this.slots.length / this.capacity; }
}

function episodicCue(episodes: CogChunk[], cue: string): CogChunk[] {
  return episodes.filter(e => e.content.toLowerCase().includes(cue.toLowerCase()))
                 .sort((a, b) => b.timestamp - a.timestamp);
}

function semanticAssociation(a: string, b: string, lexicon: Record<string, string[]>): number {
  const A = new Set(lexicon[a] ?? []);
  const B = new Set(lexicon[b] ?? []);
  const intersection = [...A].filter(x => B.has(x)).length;
  const union = new Set([...A, ...B]).size;
  return union === 0 ? 0 : intersection / union;
}

function chunk(sequence: number[], chunkSize: number): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < sequence.length; i += chunkSize) {
    result.push(sequence.slice(i, i + chunkSize));
  }
  return result;
}

function phiSpotlight(activations: number[]): number {
  const weights = activations.map((_, i) => Math.pow(PHI, -i));
  const wSum = weights.reduce((a, b) => a + b, 0);
  const focus = activations.reduce((s, a, i) => s + a * weights[i], 0) / wSum;
  return focus;
}

function cognitiveLoad(nItems: number, complexity: number): number {
  return Math.min(1, (nItems * complexity) / 7);
}

// ─── SECTION 1: Working memory ─────────────────────────────────────────────────
describe('Cog § 1 — Working memory', () => {
  const newChunk = (id: string, act = 1.0, ts = 0): CogChunk =>
    ({ id, content: `content-${id}`, activation: act, timestamp: ts });

  test('empty WM size = 0',           () => expect(new WorkingMemory().size).toBe(0));
  test('encode increases size',       () => {
    const wm = new WorkingMemory();
    wm.encode(newChunk('a'));
    expect(wm.size).toBe(1);
  });
  test('capacity enforced',           () => {
    const wm = new WorkingMemory(3);
    for (let i = 0; i < 5; i++) wm.encode(newChunk(`${i}`, 1.0 + i));
    expect(wm.size).toBeLessThanOrEqual(3);
  });
  test('retrieve existing chunk',     () => {
    const wm = new WorkingMemory();
    wm.encode(newChunk('x', 0.9));
    expect(wm.retrieve('x')).toBeDefined();
  });
  test('retrieve unknown → undefined',() => {
    const wm = new WorkingMemory();
    expect(wm.retrieve('z')).toBeUndefined();
  });
  test('activation stored correctly', () => {
    const wm = new WorkingMemory();
    wm.encode(newChunk('a', 0.75));
    expect(wm.retrieve('a')!.activation).toBeCloseTo(0.75);
  });
  test('low-activation evicted first',() => {
    const wm = new WorkingMemory(3);
    wm.encode(newChunk('weak', 0.1));
    wm.encode(newChunk('mid', 0.5));
    wm.encode(newChunk('strong', 0.9));
    wm.encode(newChunk('new', 0.6));
    expect(wm.retrieve('weak')).toBeUndefined();
  });
  test('cogLoad ∈ [0,1]',             () => {
    const wm = new WorkingMemory(7);
    wm.encode(newChunk('a')); wm.encode(newChunk('b'));
    const load = wm.cogLoad();
    expect(load).toBeGreaterThanOrEqual(0);
    expect(load).toBeLessThanOrEqual(1);
  });
  test('cogLoad = size/capacity',     () => {
    const wm = new WorkingMemory(5);
    wm.encode(newChunk('a')); wm.encode(newChunk('b'));
    expect(wm.cogLoad()).toBeCloseTo(2 / 5);
  });
});

// ─── SECTION 2: WM decay ───────────────────────────────────────────────────────
describe('Cog § 2 — Working memory decay', () => {
  test('decay reduces activation',    () => {
    const wm = new WorkingMemory();
    wm.encode({ id: 'a', content: 'x', activation: 1, timestamp: 0 });
    wm.decay(0.5, 5);
    const chunk = wm.retrieve('a');
    expect(chunk ? chunk.activation : 0).toBeLessThan(1);
  });
  test('no decay when rate=0',        () => {
    const wm = new WorkingMemory();
    wm.encode({ id: 'a', content: 'x', activation: 1, timestamp: 0 });
    wm.decay(0, 100);
    expect(wm.retrieve('a')?.activation).toBeCloseTo(1);
  });
  test('high decay removes chunk',    () => {
    const wm = new WorkingMemory();
    wm.encode({ id: 'a', content: 'x', activation: 1, timestamp: 0 });
    wm.decay(10, 100);
    expect(wm.retrieve('a')).toBeUndefined();
  });
  test('decay follows exponential',   () => {
    const wm = new WorkingMemory();
    wm.encode({ id: 'a', content: 'x', activation: 1, timestamp: 0 });
    wm.decay(0.5, 2);
    const expected = Math.exp(-1);
    expect(wm.retrieve('a')?.activation ?? 0).toBeCloseTo(expected, 3);
  });
});

// ─── SECTION 3: Top-k retrieval ────────────────────────────────────────────────
describe('Cog § 3 — Top-k retrieval', () => {
  test('topK returns k items',          () => {
    const wm = new WorkingMemory();
    ['a', 'b', 'c', 'd'].forEach((id, i) =>
      wm.encode({ id, content: id, activation: i + 1, timestamp: 0 }));
    expect(wm.topK(2).length).toBe(2);
  });
  test('topK sorted by activation',     () => {
    const wm = new WorkingMemory();
    wm.encode({ id: 'lo', content: 'x', activation: 0.2, timestamp: 0 });
    wm.encode({ id: 'hi', content: 'x', activation: 0.9, timestamp: 0 });
    expect(wm.topK(1)[0].id).toBe('hi');
  });
  test('topK ≤ size when k > size',     () => {
    const wm = new WorkingMemory();
    wm.encode({ id: 'a', content: 'x', activation: 1, timestamp: 0 });
    expect(wm.topK(10).length).toBe(1);
  });
  test('topK empty WM → []',            () => {
    expect(new WorkingMemory().topK(3)).toEqual([]);
  });
});

// ─── SECTION 4: Inhibition of return ──────────────────────────────────────────
describe('Cog § 4 — Inhibition', () => {
  test('inhibit reduces activation',    () => {
    const wm = new WorkingMemory();
    wm.encode({ id: 'a', content: 'x', activation: 1, timestamp: 0 });
    wm.inhibit('a', 0.3);
    expect(wm.retrieve('a')!.activation).toBeCloseTo(0.7);
  });
  test('inhibit floors at 0',           () => {
    const wm = new WorkingMemory();
    wm.encode({ id: 'a', content: 'x', activation: 0.1, timestamp: 0 });
    wm.inhibit('a', 10);
    expect(wm.retrieve('a')!.activation).toBe(0);
  });
  test('inhibit unknown id → no crash', () => {
    const wm = new WorkingMemory();
    expect(() => wm.inhibit('z', 0.5)).not.toThrow();
  });
  test('inhibit other unchanged',       () => {
    const wm = new WorkingMemory();
    wm.encode({ id: 'a', content: 'x', activation: 0.8, timestamp: 0 });
    wm.encode({ id: 'b', content: 'y', activation: 0.6, timestamp: 0 });
    wm.inhibit('a', 0.5);
    expect(wm.retrieve('b')!.activation).toBeCloseTo(0.6);
  });
});

// ─── SECTION 5: Episodic retrieval ────────────────────────────────────────────
describe('Cog § 5 — Episodic retrieval', () => {
  const episodes: CogChunk[] = [
    { id: '1', content: 'saw a cat', activation: 0.8, timestamp: 100 },
    { id: '2', content: 'fed the cat', activation: 0.7, timestamp: 200 },
    { id: '3', content: 'chased a dog', activation: 0.9, timestamp: 150 },
  ];

  test('cue matches content',                () => {
    expect(episodicCue(episodes, 'cat').length).toBe(2);
  });
  test('non-matching cue → empty',           () => {
    expect(episodicCue(episodes, 'fish').length).toBe(0);
  });
  test('results sorted by recency',          () => {
    const results = episodicCue(episodes, 'cat');
    expect(results[0].timestamp).toBeGreaterThan(results[1].timestamp);
  });
  test('case-insensitive cue',               () => {
    expect(episodicCue(episodes, 'CAT').length).toBe(2);
  });
});

// ─── SECTION 6: Semantic association ──────────────────────────────────────────
describe('Cog § 6 — Semantic association', () => {
  const lex: Record<string, string[]> = {
    cat:  ['animal', 'pet', 'fur', 'feline'],
    dog:  ['animal', 'pet', 'fur', 'loyal'],
    fish: ['animal', 'water', 'scales'],
  };

  test('self-association = 1',              () => expect(semanticAssociation('cat', 'cat', lex)).toBeCloseTo(1));
  test('cat-dog share more than cat-fish',  () => {
    expect(semanticAssociation('cat', 'dog', lex)).toBeGreaterThan(semanticAssociation('cat', 'fish', lex);
  });
  test('association ∈ [0,1]',              () => {
    const sa = semanticAssociation('cat', 'dog', lex);
    expect(sa).toBeGreaterThanOrEqual(0);
    expect(sa).toBeLessThanOrEqual(1);
  });
  test('unknown term → 0',                  () => expect(semanticAssociation('cat', 'alien', lex)).toBe(0));
  test('symmetric',                         () => {
    const cd = semanticAssociation('cat', 'dog', lex);
    const dc = semanticAssociation('dog', 'cat', lex);
    expect(cd).toBeCloseTo(dc, 8);
  });
});

// ─── SECTION 7: Chunking ───────────────────────────────────────────────────────
describe('Cog § 7 — Chunking', () => {
  test('chunk size-3 of 9 → 3 chunks',    () => expect(chunk([1,2,3,4,5,6,7,8,9], 3).length).toBe(3));
  test('chunk size-7 (Miller)',            () => {
    const c = chunk(Array.from({ length: 21 }, (_, i) => i), 7);
    expect(c.length).toBe(3);
    expect(c[0].length).toBe(7);
  });
  test('chunk preserves all elements',    () => {
    const seq = [1, 2, 3, 4, 5];
    expect(chunk(seq, 2).flat().length).toBe(5);
  });
  test('chunk size=1 returns singles',    () => {
    const c = chunk([10, 20, 30], 1);
    expect(c.every(ch => ch.length === 1)).toBe(true);
  });
  test('last chunk may be smaller',       () => {
    const c = chunk([1, 2, 3, 4, 5], 3);
    expect(c[c.length - 1].length).toBe(2);
  });
  test('chunk of empty → empty',          () => expect(chunk([], 3)).toEqual([]));
});

// ─── SECTION 8: φ-attention spotlight ─────────────────────────────────────────
describe('Cog § 8 — φ-attention spotlight', () => {
  test('spotlight is finite',             () => expect(isFinite(phiSpotlight([0.5, 0.3, 0.2]))).toBe(true));
  test('spotlight biased toward first',   () => {
    const s1 = phiSpotlight([1, 0, 0]);
    const s2 = phiSpotlight([0, 0, 1]);
    expect(s1).toBeGreaterThan(s2);
  });
  test('spotlight single value = that value', () => {
    expect(phiSpotlight([5])).toBeCloseTo(5, 5);
  });
  test('spotlight ≥ 0 for non-neg activations', () => {
    expect(phiSpotlight([0.4, 0.3, 0.3])).toBeGreaterThanOrEqual(0);
  });
  test('cognitive load ∈ [0,1]',          () => {
    [0, 2, 4, 7, 10].forEach(n => {
      const cl = cognitiveLoad(n, 0.5);
      expect(cl).toBeGreaterThanOrEqual(0);
      expect(cl).toBeLessThanOrEqual(1);
    });
  });
  test('full capacity = load 1',          () => {
    expect(cognitiveLoad(7, 1)).toBeCloseTo(1);
  });
  test('no items = load 0',               () => expect(cognitiveLoad(0, 1)).toBe(0));
});
