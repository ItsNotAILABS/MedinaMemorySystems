/**
 * AI Suite 04 — Memory Consolidation
 * ============================================================
 * Short-term memory (STM) buffers, long-term memory (LTM) encoding,
 * memory decay, rehearsal, interference, recall accuracy, and
 * φ-weighted memory priority.
 *
 * Target: 150+ tests   Charter: AIS-MEM-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_INV = 1 / PHI;

// ─── Implementations ──────────────────────────────────────────────────────────

interface MemoryTrace {
  id: string;
  content: string;
  strength: number;
  timestamp: number;
  rehearsals: number;
}

class ShortTermMemory {
  private traces: MemoryTrace[] = [];
  constructor(private capacity: number) {}

  encode(id: string, content: string, strength = 1.0, ts = 0): void {
    if (this.traces.length >= this.capacity) this.traces.shift();
    this.traces.push({ id, content, strength, timestamp: ts, rehearsals: 0 });
  }

  recall(id: string): MemoryTrace | undefined {
    return this.traces.find(t => t.id === id);
  }

  get size(): number { return this.traces.length; }

  decay(rate: number, now: number): void {
    this.traces.forEach(t => {
      t.strength *= Math.exp(-rate * (now - t.timestamp));
    });
    this.traces = this.traces.filter(t => t.strength > 0.01);
  }

  rehearse(id: string, boost = 0.1): void {
    const t = this.traces.find(t => t.id === id);
    if (t) { t.strength = Math.min(1, t.strength + boost); t.rehearsals++; }
  }

  all(): MemoryTrace[] { return [...this.traces]; }
}

class LongTermMemory {
  private store: Map<string, MemoryTrace> = new Map();

  consolidate(trace: MemoryTrace): void {
    const existing = this.store.get(trace.id);
    if (existing) {
      existing.strength = Math.min(1, existing.strength + trace.strength * PHI_INV);
      existing.rehearsals++;
    } else {
      this.store.set(trace.id, { ...trace });
    }
  }

  recall(id: string): MemoryTrace | undefined { return this.store.get(id); }
  get size(): number { return this.store.size; }

  prioritized(): MemoryTrace[] {
    return [...this.store.values()].sort((a, b) => b.strength - a.strength);
  }
}

function forgettingCurve(strength: number, decayRate: number, elapsed: number): number {
  return strength * Math.exp(-decayRate * elapsed);
}

function spacedRepetitionInterval(repetition: number, ease = 2.5): number {
  if (repetition === 0) return 1;
  if (repetition === 1) return 6;
  return Math.round(spacedRepetitionInterval(repetition - 1, ease) * ease);
}

function interferenceEffect(target: number, interference: number, strength: number): number {
  return target * (1 - strength * interference);
}

function phiWeightedRecall(traces: MemoryTrace[]): string[] {
  return traces
    .filter(t => t.strength > PHI_INV * 0.5)
    .sort((a, b) => b.strength * PHI - a.strength)
    .map(t => t.id);
}

// ─── SECTION 1: STM encoding ───────────────────────────────────────────────────
describe('Memory § 1 — Short-term memory encoding', () => {
  let stm: ShortTermMemory;
  beforeEach(() => { stm = new ShortTermMemory(5); });

  test('empty STM size = 0',               () => expect(stm.size).toBe(0));
  test('encode increments size',           () => { stm.encode('a', 'hello'); expect(stm.size).toBe(1); });
  test('capacity enforced',                () => {
    for (let i = 0; i < 10; i++) stm.encode(`${i}`, `content-${i}`);
    expect(stm.size).toBe(5);
  });
  test('recall returns encoded content',   () => {
    stm.encode('x', 'data');
    expect(stm.recall('x')?.content).toBe('data');
  });
  test('recall unknown → undefined',       () => expect(stm.recall('z')).toBeUndefined());
  test('FIFO eviction on overflow',        () => {
    for (let i = 0; i < 6; i++) stm.encode(`m${i}`, `c${i}`);
    expect(stm.recall('m0')).toBeUndefined();
    expect(stm.recall('m5')).toBeDefined();
  });
  test('initial strength = 1',             () => {
    stm.encode('s', 'test');
    expect(stm.recall('s')?.strength).toBe(1);
  });
  test('custom strength stored',           () => {
    stm.encode('s', 'test', 0.7);
    expect(stm.recall('s')?.strength).toBeCloseTo(0.7);
  });
  test('all() returns all traces',         () => {
    stm.encode('a', '1'); stm.encode('b', '2');
    expect(stm.all().length).toBe(2);
  });
});

// ─── SECTION 2: STM decay ──────────────────────────────────────────────────────
describe('Memory § 2 — STM decay', () => {
  test('decay reduces strength', () => {
    const stm = new ShortTermMemory(10);
    stm.encode('m', 'content', 1, 0);
    stm.decay(0.1, 10);
    expect(stm.recall('m')?.strength).toBeLessThan(1);
  });
  test('no decay when rate=0', () => {
    const stm = new ShortTermMemory(10);
    stm.encode('m', 'content', 1, 0);
    stm.decay(0, 100);
    expect(stm.recall('m')?.strength).toBeCloseTo(1);
  });
  test('high decay rate removes trace', () => {
    const stm = new ShortTermMemory(10);
    stm.encode('m', 'content', 1, 0);
    stm.decay(10, 100);
    expect(stm.recall('m')).toBeUndefined();
  });
  test('decay follows exponential', () => {
    const stm = new ShortTermMemory(10);
    stm.encode('m', 'content', 1, 0);
    stm.decay(0.1, 5);
    const s = stm.recall('m')?.strength ?? 0;
    expect(s).toBeCloseTo(Math.exp(-0.5), 3);
  });
  test('zero elapsed → no decay', () => {
    const stm = new ShortTermMemory(10);
    stm.encode('m', 'content', 1, 5);
    stm.decay(0.5, 5);
    expect(stm.recall('m')?.strength).toBeCloseTo(1);
  });
});

// ─── SECTION 3: STM rehearsal ──────────────────────────────────────────────────
describe('Memory § 3 — STM rehearsal', () => {
  test('rehearsal increases strength',  () => {
    const stm = new ShortTermMemory(10);
    stm.encode('m', 'x', 0.5);
    stm.rehearse('m', 0.2);
    expect(stm.recall('m')?.strength).toBeCloseTo(0.7);
  });
  test('rehearsal capped at 1',         () => {
    const stm = new ShortTermMemory(10);
    stm.encode('m', 'x', 0.9);
    stm.rehearse('m', 0.5);
    expect(stm.recall('m')?.strength).toBeCloseTo(1);
  });
  test('rehearsal increments counter',  () => {
    const stm = new ShortTermMemory(10);
    stm.encode('m', 'x');
    stm.rehearse('m'); stm.rehearse('m');
    expect(stm.recall('m')?.rehearsals).toBe(2);
  });
  test('rehearse unknown id → no crash', () => {
    const stm = new ShortTermMemory(10);
    expect(() => stm.rehearse('unknown')).not.toThrow();
  });
});

// ─── SECTION 4: LTM consolidation ─────────────────────────────────────────────
describe('Memory § 4 — Long-term memory consolidation', () => {
  let ltm: LongTermMemory;
  beforeEach(() => { ltm = new LongTermMemory(); });

  test('empty LTM size = 0',            () => expect(ltm.size).toBe(0));
  test('consolidate adds new trace',    () => {
    ltm.consolidate({ id: 'a', content: 'x', strength: 0.8, timestamp: 0, rehearsals: 0 });
    expect(ltm.size).toBe(1);
  });
  test('recall returns trace',          () => {
    ltm.consolidate({ id: 'a', content: 'x', strength: 0.8, timestamp: 0, rehearsals: 0 });
    expect(ltm.recall('a')?.content).toBe('x');
  });
  test('repeat consolidation boosts strength', () => {
    const t = { id: 'a', content: 'x', strength: 0.5, timestamp: 0, rehearsals: 0 };
    ltm.consolidate(t);
    const s1 = ltm.recall('a')!.strength;
    ltm.consolidate(t);
    expect(ltm.recall('a')!.strength).toBeGreaterThan(s1);
  });
  test('strength capped at 1', () => {
    const t = { id: 'a', content: 'x', strength: 1.0, timestamp: 0, rehearsals: 0 };
    for (let i = 0; i < 20; i++) ltm.consolidate(t);
    expect(ltm.recall('a')!.strength).toBeLessThanOrEqual(1);
  });
  test('prioritized returns sorted by strength', () => {
    ltm.consolidate({ id: 'low', content: 'x', strength: 0.2, timestamp: 0, rehearsals: 0 });
    ltm.consolidate({ id: 'high', content: 'x', strength: 0.9, timestamp: 0, rehearsals: 0 });
    const sorted = ltm.prioritized();
    expect(sorted[0].id).toBe('high');
  });
  test('duplicate ids → single LTM entry', () => {
    ltm.consolidate({ id: 'a', content: 'x', strength: 0.3, timestamp: 0, rehearsals: 0 });
    ltm.consolidate({ id: 'a', content: 'y', strength: 0.3, timestamp: 0, rehearsals: 0 });
    expect(ltm.size).toBe(1);
  });
});

// ─── SECTION 5: Forgetting curve ───────────────────────────────────────────────
describe('Memory § 5 — Forgetting curve', () => {
  test('t=0 → strength unchanged',     () => expect(forgettingCurve(1, 0.1, 0)).toBe(1));
  test('monotone decreasing',           () => {
    const s0 = forgettingCurve(1, 0.5, 0);
    const s1 = forgettingCurve(1, 0.5, 5);
    const s2 = forgettingCurve(1, 0.5, 10);
    expect(s0).toBeGreaterThan(s1);
    expect(s1).toBeGreaterThan(s2);
  });
  test('higher rate → faster decay',   () => {
    expect(forgettingCurve(1, 0.5, 5)).toBeLessThan(forgettingCurve(1, 0.1, 5));
  });
  test('rate=0 → no forgetting',       () => expect(forgettingCurve(0.8, 0, 100)).toBeCloseTo(0.8));
  test('ebbinghaus at t=1 (rate=0.5)', () => {
    expect(forgettingCurve(1, 0.5, 1)).toBeCloseTo(Math.exp(-0.5), 8);
  });
  test('initial strength scales output',() => {
    expect(forgettingCurve(0.5, 0.1, 5)).toBeCloseTo(0.5 * forgettingCurve(1, 0.1, 5), 8);
  });
});

// ─── SECTION 6: Spaced repetition ─────────────────────────────────────────────
describe('Memory § 6 — Spaced repetition intervals', () => {
  test('rep 0 = 1 day',      () => expect(spacedRepetitionInterval(0)).toBe(1));
  test('rep 1 = 6 days',     () => expect(spacedRepetitionInterval(1)).toBe(6));
  test('rep 2 > rep 1',      () => expect(spacedRepetitionInterval(2)).toBeGreaterThan(6));
  test('intervals grow',     () => {
    const intervals = [2, 3, 4, 5].map(spacedRepetitionInterval);
    for (let i = 1; i < intervals.length; i++)
      expect(intervals[i]).toBeGreaterThan(intervals[i - 1]);
  });
  test('interval is positive', () => {
    [0, 1, 2, 3, 4].forEach(r => expect(spacedRepetitionInterval(r)).toBeGreaterThan(0));
  });
});

// ─── SECTION 7: Interference effect ───────────────────────────────────────────
describe('Memory § 7 — Interference', () => {
  test('zero interference → target unchanged', () => {
    expect(interferenceEffect(0.9, 0, 1)).toBeCloseTo(0.9);
  });
  test('full interference (strength=1)', () => {
    expect(interferenceEffect(0.8, 1, 1)).toBeCloseTo(0);
  });
  test('partial interference reduces target', () => {
    expect(interferenceEffect(1, 0.5, 0.5)).toBeCloseTo(0.75);
  });
  test('interference is proportional to strength', () => {
    const t = 0.8;
    expect(interferenceEffect(t, 0.5, 1)).toBeLessThan(interferenceEffect(t, 0.5, 0));
  });
  test('result non-negative for valid inputs', () => {
    expect(interferenceEffect(0.7, 0.3, 0.5)).toBeGreaterThan(0);
  });
});

// ─── SECTION 8: φ-weighted recall priority ─────────────────────────────────────
describe('Memory § 8 — φ-weighted recall', () => {
  test('filters weak traces', () => {
    const traces: MemoryTrace[] = [
      { id: 'strong', content: 'x', strength: 0.9, timestamp: 0, rehearsals: 2 },
      { id: 'weak',   content: 'y', strength: 0.01, timestamp: 0, rehearsals: 0 },
    ];
    const recalled = phiWeightedRecall(traces);
    expect(recalled).toContain('strong');
    expect(recalled).not.toContain('weak');
  });
  test('returns array of ids', () => {
    const traces: MemoryTrace[] = [
      { id: 'a', content: 'x', strength: 0.8, timestamp: 0, rehearsals: 0 },
    ];
    expect(Array.isArray(phiWeightedRecall(traces))).toBe(true);
  });
  test('empty traces → empty recall', () => {
    expect(phiWeightedRecall([])).toEqual([]);
  });
  test('sorted by strength descending', () => {
    const traces: MemoryTrace[] = [
      { id: 'low',  content: 'x', strength: 0.4, timestamp: 0, rehearsals: 0 },
      { id: 'high', content: 'x', strength: 0.8, timestamp: 0, rehearsals: 0 },
    ];
    const result = phiWeightedRecall(traces);
    expect(result[0]).toBe('high');
  });
});
