// ISIL-1.0 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE in packages/medina-memory-sdk/LICENSE.
// Unauthorized use, reproduction, or distribution strictly prohibited.
/**
 * Sub-SDK 4: Semantic Search
 * Search by meaning, not just keywords.
 * Uses TF-IDF scoring as a lightweight semantic approximation.
 */

export interface SearchableDocument {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface SearchResult {
  document: SearchableDocument;
  score: number;
  matchedTerms: string[];
}

export class SemanticSearch {
  private documents: Map<string, SearchableDocument> = new Map();
  private tfidf: Map<string, Map<string, number>> = new Map(); // docId -> term -> tfidf

  /**
   * Add a document to the search index.
   */
  index(doc: SearchableDocument): void {
    this.documents.set(doc.id, doc);
    this.buildTfIdf();
  }

  /**
   * Index multiple documents at once.
   */
  indexMany(docs: SearchableDocument[]): void {
    for (const doc of docs) this.documents.set(doc.id, doc);
    this.buildTfIdf();
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  }

  private buildTfIdf(): void {
    const docCount = this.documents.size;
    const allDocs = Array.from(this.documents.values());
    const df = new Map<string, number>(); // document frequency per term

    // Compute term frequencies per document
    const tfMap = new Map<string, Map<string, number>>();
    for (const doc of allDocs) {
      const tokens = this.tokenize(doc.content);
      const tf = new Map<string, number>();
      for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
      // Normalize TF
      const maxTf = Math.max(...Array.from(tf.values()), 1);
      for (const [term, count] of tf.entries()) {
        tf.set(term, count / maxTf);
        df.set(term, (df.get(term) ?? 0) + 1);
      }
      tfMap.set(doc.id, tf);
    }

    // Compute TF-IDF
    this.tfidf.clear();
    for (const doc of allDocs) {
      const tf = tfMap.get(doc.id) ?? new Map();
      const scores = new Map<string, number>();
      for (const [term, tfScore] of tf.entries()) {
        const idf = Math.log((docCount + 1) / ((df.get(term) ?? 0) + 1)) + 1;
        scores.set(term, tfScore * idf);
      }
      this.tfidf.set(doc.id, scores);
    }
  }

  /**
   * Search documents by query string.
   */
  search(query: string, limit = 10): SearchResult[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const results: SearchResult[] = [];

    for (const [docId, scores] of this.tfidf.entries()) {
      const doc = this.documents.get(docId)!;
      let totalScore = 0;
      const matchedTerms: string[] = [];

      for (const term of queryTokens) {
        const score = scores.get(term) ?? 0;
        if (score > 0) {
          totalScore += score;
          matchedTerms.push(term);
        }
      }

      if (totalScore > 0) {
        results.push({ document: doc, score: totalScore, matchedTerms });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Remove a document from the index.
   */
  remove(id: string): void {
    this.documents.delete(id);
    this.tfidf.delete(id);
  }

  size(): number {
    return this.documents.size;
  }
}
