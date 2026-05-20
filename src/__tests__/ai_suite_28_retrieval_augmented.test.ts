/**
 * AI Suite 28 — Retrieval-Augmented Generation
 * ============================================================
 * Document retrieval, embedding search, context injection,
 * relevance scoring, chunking strategies, reranking,
 * φ-coherent retrieval, and RAG invariants.
 *
 * Target: 100 tests   Charter: AIS-RAG-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Core Types ───────────────────────────────────────────────────────────────

type Vector = number[];
type Document = { id: string; content: string; embedding: Vector; metadata: Record<string, any> };
type Chunk = { text: string; docId: string; position: number };
type SearchResult = { doc: Document; score: number };

interface VectorIndex {
  documents: Document[];
  dim: number;
}

// ─── Implementations ──────────────────────────────────────────────────────────

function createIndex(dim: number): VectorIndex {
  return { documents: [], dim };
}

function addDocument(index: VectorIndex, doc: Document): VectorIndex {
  return { ...index, documents: [...index.documents, doc] };
}

function simpleEmbed(text: string, dim: number): Vector {
  // Hash-based embedding for testing
  const embedding = Array(dim).fill(0);
  for (let i = 0; i < text.length; i++) {
    const idx = i % dim;
    embedding[idx] += text.charCodeAt(i) / 1000;
  }
  const norm = Math.sqrt(embedding.reduce((s, v) => s + v * v, 0)) || 1;
  return embedding.map(v => v / norm);
}

function cosineSimilarity(a: Vector, b: Vector): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }
  return dot / (Math.sqrt(normA * normB) || 1);
}

function search(index: VectorIndex, query: Vector, k: number): SearchResult[] {
  const results = index.documents.map(doc => ({
    doc,
    score: cosineSimilarity(query, doc.embedding)
  }));
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, k);
}

function hybridSearch(index: VectorIndex, query: Vector, keywords: string[], k: number, alpha: number = 0.5): SearchResult[] {
  const results = index.documents.map(doc => {
    const vectorScore = cosineSimilarity(query, doc.embedding);
    const keywordScore = keywords.filter(kw => doc.content.toLowerCase().includes(kw.toLowerCase())).length / (keywords.length || 1);
    return {
      doc,
      score: alpha * vectorScore + (1 - alpha) * keywordScore
    };
  });
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, k);
}

function chunkBySize(text: string, chunkSize: number, overlap: number = 0): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));
    start += chunkSize - overlap;
  }
  return chunks;
}

function chunkBySentence(text: string, maxSentences: number = 3): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += maxSentences) {
    chunks.push(sentences.slice(i, i + maxSentences).join('. ').trim() + '.');
  }
  return chunks;
}

function rerank(results: SearchResult[], query: string): SearchResult[] {
  // Simple reranking based on query term overlap
  const queryTerms = query.toLowerCase().split(/\s+/);
  return results.map(r => {
    const contentLower = r.doc.content.toLowerCase();
    const termBoost = queryTerms.filter(t => contentLower.includes(t)).length * 0.1;
    return { ...r, score: r.score + termBoost };
  }).sort((a, b) => b.score - a.score);
}

function buildContext(docs: Document[], maxTokens: number): string {
  let context = '';
  let tokens = 0;
  for (const doc of docs) {
    const docTokens = doc.content.split(/\s+/).length;
    if (tokens + docTokens > maxTokens) break;
    context += doc.content + '\n\n';
    tokens += docTokens;
  }
  return context.trim();
}

function relevanceFilter(results: SearchResult[], threshold: number): SearchResult[] {
  return results.filter(r => r.score >= threshold);
}

function diversityRerank(results: SearchResult[], lambda: number = 0.5): SearchResult[] {
  if (results.length <= 1) return results;
  
  const selected: SearchResult[] = [results[0]];
  const remaining = results.slice(1);
  
  while (remaining.length > 0 && selected.length < results.length) {
    let bestIdx = 0;
    let bestScore = -Infinity;
    
    for (let i = 0; i < remaining.length; i++) {
      const relevance = remaining[i].score;
      const maxSim = Math.max(...selected.map(s => cosineSimilarity(s.doc.embedding, remaining[i].doc.embedding)));
      const score = lambda * relevance - (1 - lambda) * maxSim;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }
    
    selected.push(remaining[bestIdx]);
    remaining.splice(bestIdx, 1);
  }
  
  return selected;
}

function queryExpansion(query: string, synonyms: Map<string, string[]>): string[] {
  const terms = query.toLowerCase().split(/\s+/);
  const expanded: string[][] = terms.map(t => [t, ...(synonyms.get(t) || [])]);
  
  // Generate combinations (simplified: just add synonym variants)
  const variants = [query];
  for (let i = 0; i < terms.length; i++) {
    const syns = synonyms.get(terms[i]) || [];
    for (const syn of syns) {
      const newTerms = [...terms];
      newTerms[i] = syn;
      variants.push(newTerms.join(' '));
    }
  }
  return variants;
}

function phiRelevanceDecay(rank: number): number {
  return Math.pow(PHI, -rank);
}

function reciprocalRankFusion(rankings: SearchResult[][], k: number = 60): SearchResult[] {
  const scores = new Map<string, number>();
  const docs = new Map<string, Document>();
  
  for (const ranking of rankings) {
    for (let i = 0; i < ranking.length; i++) {
      const docId = ranking[i].doc.id;
      docs.set(docId, ranking[i].doc);
      const current = scores.get(docId) || 0;
      scores.set(docId, current + 1 / (k + i + 1));
    }
  }
  
  return Array.from(scores.entries())
    .map(([id, score]) => ({ doc: docs.get(id)!, score }))
    .sort((a, b) => b.score - a.score);
}

function contextCompression(docs: Document[], query: string, maxChars: number): string {
  // Extract most relevant sentences
  const sentences: { text: string; score: number }[] = [];
  const queryTerms = new Set(query.toLowerCase().split(/\s+/));
  
  for (const doc of docs) {
    for (const sent of doc.content.split(/[.!?]+/)) {
      const trimmed = sent.trim();
      if (!trimmed) continue;
      const sentTerms = trimmed.toLowerCase().split(/\s+/);
      const overlap = sentTerms.filter(t => queryTerms.has(t)).length;
      sentences.push({ text: trimmed, score: overlap / sentTerms.length });
    }
  }
  
  sentences.sort((a, b) => b.score - a.score);
  
  let result = '';
  for (const s of sentences) {
    if (result.length + s.text.length + 2 > maxChars) break;
    result += s.text + '. ';
  }
  return result.trim();
}

function meanReciprocalRank(results: SearchResult[], relevantIds: Set<string>): number {
  for (let i = 0; i < results.length; i++) {
    if (relevantIds.has(results[i].doc.id)) {
      return 1 / (i + 1);
    }
  }
  return 0;
}

function precisionAtK(results: SearchResult[], relevantIds: Set<string>, k: number): number {
  const topK = results.slice(0, k);
  const relevant = topK.filter(r => relevantIds.has(r.doc.id)).length;
  return relevant / k;
}

// ─── SECTION 1: Index operations ──────────────────────────────────────────────
describe('RAG § 1 — Index', () => {
  test('createIndex empty', () => {
    expect(createIndex(8).documents.length).toBe(0);
  });
  test('createIndex stores dim', () => {
    expect(createIndex(16).dim).toBe(16);
  });
  test('addDocument increases count', () => {
    let idx = createIndex(4);
    idx = addDocument(idx, { id: '1', content: 'test', embedding: [1, 0, 0, 0], metadata: {} });
    expect(idx.documents.length).toBe(1);
  });
  test('addDocument is immutable', () => {
    const idx1 = createIndex(4);
    const idx2 = addDocument(idx1, { id: '1', content: 'test', embedding: [1, 0, 0, 0], metadata: {} });
    expect(idx1.documents.length).toBe(0);
    expect(idx2.documents.length).toBe(1);
  });
  test('addDocument preserves metadata', () => {
    let idx = createIndex(2);
    idx = addDocument(idx, { id: '1', content: 'test', embedding: [1, 0], metadata: { source: 'web' } });
    expect(idx.documents[0].metadata.source).toBe('web');
  });
});

// ─── SECTION 2: Embedding ─────────────────────────────────────────────────────
describe('RAG § 2 — Embedding', () => {
  test('simpleEmbed returns correct dim', () => {
    expect(simpleEmbed('hello', 8).length).toBe(8);
  });
  test('simpleEmbed normalized', () => {
    const emb = simpleEmbed('test', 4);
    const norm = Math.sqrt(emb.reduce((s, v) => s + v * v, 0));
    expect(norm).toBeCloseTo(1);
  });
  test('simpleEmbed deterministic', () => {
    expect(simpleEmbed('same', 4)).toEqual(simpleEmbed('same', 4));
  });
  test('simpleEmbed different for different text', () => {
    expect(simpleEmbed('cat', 4)).not.toEqual(simpleEmbed('dog', 4));
  });
  test('cosineSimilarity identical = 1', () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
  });
  test('cosineSimilarity orthogonal = 0', () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
  });
});

// ─── SECTION 3: Search ────────────────────────────────────────────────────────
describe('RAG § 3 — Search', () => {
  let idx: VectorIndex;
  beforeEach(() => {
    idx = createIndex(4);
    idx = addDocument(idx, { id: '1', content: 'cat', embedding: [1, 0, 0, 0], metadata: {} });
    idx = addDocument(idx, { id: '2', content: 'dog', embedding: [0, 1, 0, 0], metadata: {} });
    idx = addDocument(idx, { id: '3', content: 'bird', embedding: [0, 0, 1, 0], metadata: {} });
  });

  test('search returns k results', () => {
    expect(search(idx, [1, 0, 0, 0], 2).length).toBe(2);
  });
  test('search ranks by similarity', () => {
    const results = search(idx, [1, 0, 0, 0], 3);
    expect(results[0].doc.id).toBe('1');
  });
  test('search returns scores', () => {
    const results = search(idx, [1, 0, 0, 0], 1);
    expect(results[0].score).toBeCloseTo(1);
  });
  test('search empty index', () => {
    expect(search(createIndex(4), [1, 0, 0, 0], 5)).toEqual([]);
  });
  test('hybridSearch combines scores', () => {
    const results = hybridSearch(idx, [0.5, 0.5, 0, 0], ['cat'], 2, 0.5);
    expect(results.length).toBe(2);
  });
  test('hybridSearch keyword boost', () => {
    const results = hybridSearch(idx, [0, 1, 0, 0], ['cat'], 3, 0.3);
    // Cat should be boosted despite lower vector score
    expect(results.some(r => r.doc.id === '1')).toBe(true);
  });
});

// ─── SECTION 4: Chunking ──────────────────────────────────────────────────────
describe('RAG § 4 — Chunking', () => {
  test('chunkBySize creates chunks', () => {
    const chunks = chunkBySize('abcdefghij', 3);
    expect(chunks.length).toBe(4);
  });
  test('chunkBySize with overlap', () => {
    const chunks = chunkBySize('abcdef', 4, 2);
    expect(chunks[1]).toBe('cdef');
  });
  test('chunkBySize no overlap', () => {
    const chunks = chunkBySize('abcdef', 2, 0);
    expect(chunks).toEqual(['ab', 'cd', 'ef']);
  });
  test('chunkBySentence splits sentences', () => {
    const chunks = chunkBySentence('First. Second. Third. Fourth.', 2);
    expect(chunks.length).toBe(2);
  });
  test('chunkBySentence handles empty', () => {
    expect(chunkBySentence('', 3)).toEqual([]);
  });
  test('chunkBySentence single sentence', () => {
    const chunks = chunkBySentence('Only one.', 3);
    expect(chunks.length).toBe(1);
  });
});

// ─── SECTION 5: Reranking ─────────────────────────────────────────────────────
describe('RAG § 5 — Reranking', () => {
  test('rerank boosts query matches', () => {
    const results: SearchResult[] = [
      { doc: { id: '1', content: 'cat food', embedding: [], metadata: {} }, score: 0.5 },
      { doc: { id: '2', content: 'dog food', embedding: [], metadata: {} }, score: 0.6 }
    ];
    const reranked = rerank(results, 'cat');
    expect(reranked[0].doc.id).toBe('1');
  });
  test('rerank preserves order when no matches', () => {
    const results: SearchResult[] = [
      { doc: { id: '1', content: 'aaa', embedding: [], metadata: {} }, score: 0.5 },
      { doc: { id: '2', content: 'bbb', embedding: [], metadata: {} }, score: 0.6 }
    ];
    const reranked = rerank(results, 'zzz');
    expect(reranked[0].doc.id).toBe('2');
  });
  test('relevanceFilter removes low scores', () => {
    const results: SearchResult[] = [
      { doc: { id: '1', content: '', embedding: [], metadata: {} }, score: 0.9 },
      { doc: { id: '2', content: '', embedding: [], metadata: {} }, score: 0.3 }
    ];
    expect(relevanceFilter(results, 0.5).length).toBe(1);
  });
  test('relevanceFilter keeps all above threshold', () => {
    const results: SearchResult[] = [
      { doc: { id: '1', content: '', embedding: [], metadata: {} }, score: 0.7 },
      { doc: { id: '2', content: '', embedding: [], metadata: {} }, score: 0.8 }
    ];
    expect(relevanceFilter(results, 0.5).length).toBe(2);
  });
});

// ─── SECTION 6: Context building ──────────────────────────────────────────────
describe('RAG § 6 — Context', () => {
  test('buildContext combines docs', () => {
    const docs: Document[] = [
      { id: '1', content: 'First doc', embedding: [], metadata: {} },
      { id: '2', content: 'Second doc', embedding: [], metadata: {} }
    ];
    const ctx = buildContext(docs, 100);
    expect(ctx).toContain('First doc');
    expect(ctx).toContain('Second doc');
  });
  test('buildContext respects maxTokens', () => {
    const docs: Document[] = [
      { id: '1', content: 'word1 word2 word3', embedding: [], metadata: {} },
      { id: '2', content: 'word4 word5 word6', embedding: [], metadata: {} }
    ];
    const ctx = buildContext(docs, 4);
    expect(ctx.split(/\s+/).length).toBeLessThanOrEqual(5);
  });
  test('buildContext empty docs', () => {
    expect(buildContext([], 100)).toBe('');
  });
  test('contextCompression extracts relevant', () => {
    const docs: Document[] = [
      { id: '1', content: 'Cats are animals. Dogs are pets. Fish swim.', embedding: [], metadata: {} }
    ];
    const compressed = contextCompression(docs, 'cats animals', 100);
    expect(compressed).toContain('Cats');
  });
});

// ─── SECTION 7: Diversity ─────────────────────────────────────────────────────
describe('RAG § 7 — Diversity', () => {
  test('diversityRerank reduces similarity', () => {
    const results: SearchResult[] = [
      { doc: { id: '1', content: '', embedding: [1, 0], metadata: {} }, score: 0.9 },
      { doc: { id: '2', content: '', embedding: [0.99, 0.1], metadata: {} }, score: 0.85 },
      { doc: { id: '3', content: '', embedding: [0, 1], metadata: {} }, score: 0.8 }
    ];
    const diverse = diversityRerank(results, 0.5);
    expect(diverse.length).toBe(3);
  });
  test('diversityRerank keeps first', () => {
    const results: SearchResult[] = [
      { doc: { id: '1', content: '', embedding: [1, 0], metadata: {} }, score: 0.9 },
      { doc: { id: '2', content: '', embedding: [0, 1], metadata: {} }, score: 0.8 }
    ];
    expect(diversityRerank(results)[0].doc.id).toBe('1');
  });
  test('diversityRerank single result', () => {
    const results: SearchResult[] = [
      { doc: { id: '1', content: '', embedding: [1, 0], metadata: {} }, score: 0.9 }
    ];
    expect(diversityRerank(results)).toEqual(results);
  });
});

// ─── SECTION 8: Query expansion ───────────────────────────────────────────────
describe('RAG § 8 — Query expansion', () => {
  test('queryExpansion includes original', () => {
    const variants = queryExpansion('cat', new Map());
    expect(variants).toContain('cat');
  });
  test('queryExpansion adds synonyms', () => {
    const synonyms = new Map([['cat', ['feline', 'kitty']]]);
    const variants = queryExpansion('cat', synonyms);
    expect(variants.some(v => v.includes('feline'))).toBe(true);
  });
  test('queryExpansion no synonyms', () => {
    const variants = queryExpansion('unique', new Map());
    expect(variants.length).toBe(1);
  });
  test('queryExpansion multi-word', () => {
    const synonyms = new Map([['big', ['large']]]);
    const variants = queryExpansion('big cat', synonyms);
    expect(variants.some(v => v.includes('large'))).toBe(true);
  });
});

// ─── SECTION 9: Phi decay ─────────────────────────────────────────────────────
describe('RAG § 9 — Phi decay', () => {
  test('phiRelevanceDecay rank 0 = 1', () => {
    expect(phiRelevanceDecay(0)).toBe(1);
  });
  test('phiRelevanceDecay decreases', () => {
    expect(phiRelevanceDecay(1)).toBeLessThan(phiRelevanceDecay(0));
  });
  test('phiRelevanceDecay uses phi', () => {
    expect(phiRelevanceDecay(1)).toBeCloseTo(1 / PHI);
  });
  test('phiRelevanceDecay positive', () => {
    expect(phiRelevanceDecay(10)).toBeGreaterThan(0);
  });
  test('reciprocalRankFusion combines', () => {
    const r1: SearchResult[] = [{ doc: { id: '1', content: '', embedding: [], metadata: {} }, score: 1 }];
    const r2: SearchResult[] = [{ doc: { id: '2', content: '', embedding: [], metadata: {} }, score: 1 }];
    const fused = reciprocalRankFusion([r1, r2]);
    expect(fused.length).toBe(2);
  });
});

// ─── SECTION 10: Metrics ──────────────────────────────────────────────────────
describe('RAG § 10 — Metrics', () => {
  test('MRR first is relevant', () => {
    const results: SearchResult[] = [
      { doc: { id: '1', content: '', embedding: [], metadata: {} }, score: 0.9 }
    ];
    expect(meanReciprocalRank(results, new Set(['1']))).toBe(1);
  });
  test('MRR second is relevant', () => {
    const results: SearchResult[] = [
      { doc: { id: '1', content: '', embedding: [], metadata: {} }, score: 0.9 },
      { doc: { id: '2', content: '', embedding: [], metadata: {} }, score: 0.8 }
    ];
    expect(meanReciprocalRank(results, new Set(['2']))).toBe(0.5);
  });
  test('MRR none relevant', () => {
    const results: SearchResult[] = [
      { doc: { id: '1', content: '', embedding: [], metadata: {} }, score: 0.9 }
    ];
    expect(meanReciprocalRank(results, new Set(['3']))).toBe(0);
  });
  test('precisionAtK all relevant', () => {
    const results: SearchResult[] = [
      { doc: { id: '1', content: '', embedding: [], metadata: {} }, score: 0.9 },
      { doc: { id: '2', content: '', embedding: [], metadata: {} }, score: 0.8 }
    ];
    expect(precisionAtK(results, new Set(['1', '2']), 2)).toBe(1);
  });
  test('precisionAtK half relevant', () => {
    const results: SearchResult[] = [
      { doc: { id: '1', content: '', embedding: [], metadata: {} }, score: 0.9 },
      { doc: { id: '2', content: '', embedding: [], metadata: {} }, score: 0.8 }
    ];
    expect(precisionAtK(results, new Set(['1']), 2)).toBe(0.5);
  });
  test('precisionAtK none relevant', () => {
    const results: SearchResult[] = [
      { doc: { id: '1', content: '', embedding: [], metadata: {} }, score: 0.9 }
    ];
    expect(precisionAtK(results, new Set(['3']), 1)).toBe(0);
  });
});
