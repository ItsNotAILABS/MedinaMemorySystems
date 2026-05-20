/**
 * AI Suite 07 — Language Model
 * ============================================================
 * Tokenization, vocabulary, n-gram language models, perplexity,
 * text generation (greedy/temperature sampling), beam search,
 * BLEU score approximation, and φ-weighted token scoring.
 *
 * Target: 160+ tests   Charter: AIS-LM-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Implementations ──────────────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

function buildVocab(tokens: string[]): Map<string, number> {
  const vocab = new Map<string, number>();
  tokens.forEach(t => { if (!vocab.has(t)) vocab.set(t, vocab.size); });
  return vocab;
}

function buildBigrams(tokens: string[]): Map<string, Map<string, number>> {
  const bigrams = new Map<string, Map<string, number>>();
  for (let i = 0; i < tokens.length - 1; i++) {
    const prev = tokens[i], next = tokens[i + 1];
    if (!bigrams.has(prev)) bigrams.set(prev, new Map());
    const counts = bigrams.get(prev)!;
    counts.set(next, (counts.get(next) ?? 0) + 1);
  }
  return bigrams;
}

function bigramProb(bigrams: Map<string, Map<string, number>>, prev: string, next: string): number {
  const counts = bigrams.get(prev);
  if (!counts) return 0;
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return (counts.get(next) ?? 0) / total;
}

function perplexity(logProbs: number[]): number {
  const avgLogP = logProbs.reduce((a, b) => a + b, 0) / logProbs.length;
  return Math.pow(2, -avgLogP / Math.log(2));
}

function greedyDecode(logits: number[][]): number[] {
  return logits.map(row => row.indexOf(Math.max(...row)));
}

function temperatureSample(logits: number[], temp: number, seed = 42): number {
  const scaled = logits.map(l => l / temp);
  const max = Math.max(...scaled);
  const exps = scaled.map(l => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  const probs = exps.map(e => e / sum);
  let s = seed;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
  const r = rand();
  let cumulative = 0;
  for (let i = 0; i < probs.length; i++) {
    cumulative += probs[i];
    if (r < cumulative) return i;
  }
  return probs.length - 1;
}

function bleuPrecision(hypothesis: string[], reference: string[], n: number): number {
  let match = 0, total = 0;
  for (let i = 0; i <= hypothesis.length - n; i++) {
    const ngram = hypothesis.slice(i, i + n).join(' ');
    total++;
    for (let j = 0; j <= reference.length - n; j++) {
      if (reference.slice(j, j + n).join(' ') === ngram) { match++; break; }
    }
  }
  return total === 0 ? 0 : match / total;
}

function brevityPenalty(hypLen: number, refLen: number): number {
  return hypLen >= refLen ? 1 : Math.exp(1 - refLen / hypLen);
}

function phiTokenScore(token: string, position: number): number {
  const charScore = [...token].reduce((s, c, i) => s + c.charCodeAt(0) * Math.pow(PHI, -i), 0);
  return charScore / Math.pow(PHI, position);
}

function addSmoothing(count: number, total: number, vocab: number, k = 1): number {
  return (count + k) / (total + k * vocab);
}

// ─── SECTION 1: Tokenization ───────────────────────────────────────────────────
describe('LM § 1 — Tokenization', () => {
  test('single word', () => expect(tokenize('hello')).toEqual(['hello']));
  test('multi-word',  () => expect(tokenize('hello world')).toEqual(['hello', 'world']));
  test('lowercase',   () => expect(tokenize('Hello World')).toEqual(['hello', 'world']));
  test('trim whitespace', () => expect(tokenize('  hi  ')).toEqual(['hi']));
  test('empty string → []', () => expect(tokenize('')).toEqual([]));
  test('multiple spaces treated as one', () => expect(tokenize('a  b   c')).toEqual(['a', 'b', 'c']));
  test('sentence length', () => expect(tokenize('the quick brown fox').length).toBe(4));
  test('tokens are strings', () => tokenize('foo bar').forEach(t => expect(typeof t).toBe('string')));
  test('punctuation kept', () => expect(tokenize('hello, world!')).toContain('hello,'));
  test('newline treated as space', () => expect(tokenize('a\nb')).toEqual(['a', 'b']));
});

// ─── SECTION 2: Vocabulary ─────────────────────────────────────────────────────
describe('LM § 2 — Vocabulary', () => {
  test('vocab size = unique tokens', () => {
    const v = buildVocab(['a', 'b', 'a', 'c']);
    expect(v.size).toBe(3);
  });
  test('vocab assigns indices', () => {
    const v = buildVocab(['x', 'y']);
    expect(typeof v.get('x')).toBe('number');
  });
  test('indices are unique', () => {
    const v = buildVocab(['a', 'b', 'c']);
    const ids = [...v.values()];
    expect(new Set(ids).size).toBe(ids.length);
  });
  test('indices start at 0', () => {
    const v = buildVocab(['first', 'second']);
    expect([...v.values()]).toContain(0);
  });
  test('unknown token not in vocab', () => {
    const v = buildVocab(['a', 'b']);
    expect(v.has('z')).toBe(false);
  });
  test('repeated token counted once', () => {
    const v = buildVocab(['the', 'the', 'the']);
    expect(v.size).toBe(1);
  });
  test('empty token list → empty vocab', () => {
    expect(buildVocab([]).size).toBe(0);
  });
});

// ─── SECTION 3: Bigram language model ──────────────────────────────────────────
describe('LM § 3 — Bigram model', () => {
  const tokens = tokenize('the cat sat on the mat the cat');
  const bigrams = buildBigrams(tokens);

  test('bigram has entries', () => expect(bigrams.size).toBeGreaterThan(0));
  test('the → cat has positive prob', () => expect(bigramProb(bigrams, 'the', 'cat')).toBeGreaterThan(0));
  test('prob ≤ 1',                    () => expect(bigramProb(bigrams, 'the', 'cat')).toBeLessThanOrEqual(1));
  test('unknown word → prob = 0',     () => expect(bigramProb(bigrams, 'dog', 'cat')).toBe(0));
  test('prob sums to 1 over successors', () => {
    const counts = bigrams.get('the')!;
    const total = [...counts.values()].reduce((a, b) => a + b, 0);
    const probs = [...counts.keys()].map(k => bigramProb(bigrams, 'the', k));
    expect(probs.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });
  test('repeated pair has higher prob', () => {
    const pCat = bigramProb(bigrams, 'the', 'cat');
    const pMat = bigramProb(bigrams, 'the', 'mat');
    expect(pCat).toBeGreaterThanOrEqual(pMat);
  });
  test('single token → no bigrams', () => {
    expect(buildBigrams(['alone']).size).toBe(0);
  });
});

// ─── SECTION 4: Perplexity ─────────────────────────────────────────────────────
describe('LM § 4 — Perplexity', () => {
  test('perplexity with all-1 probs = 1', () => {
    expect(perplexity([Math.log(1), Math.log(1)])).toBeCloseTo(1);
  });
  test('lower logprob → higher perplexity', () => {
    const pp_good = perplexity([Math.log(0.9), Math.log(0.9)]);
    const pp_bad  = perplexity([Math.log(0.1), Math.log(0.1)]);
    expect(pp_bad).toBeGreaterThan(pp_good);
  });
  test('perplexity >= 1',          () => {
    expect(perplexity([Math.log(0.5)])).toBeGreaterThanOrEqual(1);
  });
  test('perplexity is finite',     () => {
    expect(isFinite(perplexity([Math.log(0.2), Math.log(0.3)]))).toBe(true);
  });
  test('uniform 4-class → PP = 4', () => {
    const lp = [Math.log(0.25), Math.log(0.25), Math.log(0.25), Math.log(0.25)];
    expect(perplexity(lp)).toBeCloseTo(4, 1);
  });
});

// ─── SECTION 5: Greedy decoding ────────────────────────────────────────────────
describe('LM § 5 — Greedy decoding', () => {
  test('selects argmax at each step', () => {
    const logits = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    expect(greedyDecode(logits)).toEqual([0, 1, 2]);
  });
  test('output length = input length', () => {
    const logits = [[1, 2], [3, 4]];
    expect(greedyDecode(logits).length).toBe(2);
  });
  test('all same → always 0', () => {
    const logits = [[5, 5, 5]];
    expect(greedyDecode(logits)).toEqual([0]);
  });
  test('negative logits handled', () => {
    const logits = [[-1, -2, -3]];
    expect(greedyDecode(logits)).toEqual([0]);
  });
  test('single-token vocab', () => {
    expect(greedyDecode([[99]])).toEqual([0]);
  });
});

// ─── SECTION 6: Temperature sampling ──────────────────────────────────────────
describe('LM § 6 — Temperature sampling', () => {
  test('returns valid index', () => {
    const logits = [1, 2, 3];
    const idx = temperatureSample(logits, 1);
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(logits.length);
  });
  test('deterministic with same seed', () => {
    const logits = [1, 2, 3, 4];
    expect(temperatureSample(logits, 1, 99)).toBe(temperatureSample(logits, 1, 99));
  });
  test('high temp allows low-prob tokens', () => {
    const results = new Set<number>();
    for (let seed = 0; seed < 50; seed++)
      results.add(temperatureSample([10, 0, 0], 100, seed * 7 + 1));
    expect(results.size).toBeGreaterThan(1);
  });
  test('temp=0.001 nearly greedy', () => {
    const counts = new Map<number, number>();
    for (let s = 0; s < 10; s++) {
      const idx = temperatureSample([10, 0, 0], 0.001, s);
      counts.set(idx, (counts.get(idx) ?? 0) + 1);
    }
    expect((counts.get(0) ?? 0)).toBeGreaterThanOrEqual(9);
  });
});

// ─── SECTION 7: BLEU score ─────────────────────────────────────────────────────
describe('LM § 7 — BLEU precision', () => {
  const hyp = tokenize('the cat sat on the mat');
  const ref = tokenize('the cat sat on the mat');

  test('identical hyp/ref → 1-gram = 1', () => expect(bleuPrecision(hyp, ref, 1)).toBeCloseTo(1));
  test('identical hyp/ref → 2-gram = 1', () => expect(bleuPrecision(hyp, ref, 2)).toBeCloseTo(1));
  test('no overlap → 0', () => {
    expect(bleuPrecision(['x', 'y'], ['a', 'b'], 1)).toBe(0);
  });
  test('partial overlap ∈ (0,1)', () => {
    const h = tokenize('the dog sat');
    const r = tokenize('the cat sat');
    const bp = bleuPrecision(h, r, 1);
    expect(bp).toBeGreaterThan(0);
    expect(bp).toBeLessThan(1);
  });
  test('brevity penalty = 1 when hyp >= ref', () => {
    expect(brevityPenalty(10, 5)).toBe(1);
  });
  test('brevity penalty < 1 when hyp < ref', () => {
    expect(brevityPenalty(3, 10)).toBeLessThan(1);
  });
  test('brevity penalty non-negative', () => {
    expect(brevityPenalty(1, 100)).toBeGreaterThan(0);
  });
});

// ─── SECTION 8: Add-k smoothing ────────────────────────────────────────────────
describe('LM § 8 — Add-k smoothing', () => {
  test('k=0 → MLE', () => expect(addSmoothing(3, 10, 5, 0)).toBeCloseTo(0.3));
  test('k=1 Laplace on zero count > 0', () => expect(addSmoothing(0, 10, 5, 1)).toBeGreaterThan(0));
  test('smoothed prob ≤ 1', () => expect(addSmoothing(5, 10, 5, 1)).toBeLessThanOrEqual(1));
  test('smoothed prob > 0 for count=0', () => expect(addSmoothing(0, 100, 50, 1)).toBeGreaterThan(0));
  test('larger k → more uniform', () => {
    const s1 = addSmoothing(10, 20, 4, 1);
    const s5 = addSmoothing(10, 20, 4, 5);
    expect(Math.abs(s5 - 0.25)).toBeLessThan(Math.abs(s1 - 0.25));
  });
});

// ─── SECTION 9: φ-token scoring ────────────────────────────────────────────────
describe('LM § 9 — φ-token scoring', () => {
  test('score is finite', () => {
    expect(isFinite(phiTokenScore('hello', 0))).toBe(true);
  });
  test('score is positive', () => {
    expect(phiTokenScore('abc', 0)).toBeGreaterThan(0);
  });
  test('later positions → lower score', () => {
    const s0 = phiTokenScore('word', 0);
    const s1 = phiTokenScore('word', 1);
    expect(s0).toBeGreaterThan(s1);
  });
  test('different tokens have different scores', () => {
    expect(phiTokenScore('abc', 0)).not.toBe(phiTokenScore('xyz', 0));
  });
  test('deterministic', () => {
    expect(phiTokenScore('test', 3)).toBe(phiTokenScore('test', 3));
  });
});
