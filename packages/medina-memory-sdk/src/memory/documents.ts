// ISIL-1.0 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE in packages/medina-memory-sdk/LICENSE.
// Unauthorized use, reproduction, or distribution strictly prohibited.
/**
 * Sub-SDK 2: Document Intelligence
 * Transform documents into structured, queryable knowledge.
 */

export interface DocumentIntelligenceConfig {
  maxDocuments?: number;
}

export interface IntelligentDocument {
  id: string;
  title: string;
  content: string;
  doctrineLevel: number;  // 1–5, importance
  keywords: string[];
  summary: string;
  createdAt: number;
  version: string;
  active: boolean;
}

export class DocumentIntelligence {
  private documents: Map<string, IntelligentDocument> = new Map();

  ingest(title: string, content: string, doctrineLevel: number = 1): IntelligentDocument {
    const id = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const words = content.toLowerCase().split(/\W+/).filter(w => w.length > 4);
    const freq = new Map<string, number>();
    for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
    const keywords = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    const doc: IntelligentDocument = {
      id,
      title,
      content,
      doctrineLevel,
      keywords,
      summary: content.slice(0, 200) + (content.length > 200 ? '…' : ''),
      createdAt: Date.now(),
      version: '1.0.0',
      active: true,
    };
    this.documents.set(id, doc);
    return doc;
  }

  search(query: string): IntelligentDocument[] {
    const lower = query.toLowerCase();
    return Array.from(this.documents.values())
      .filter(d => d.active && (
        d.title.toLowerCase().includes(lower) ||
        d.content.toLowerCase().includes(lower) ||
        d.keywords.some(k => k.includes(lower))
      ))
      .sort((a, b) => b.doctrineLevel - a.doctrineLevel);
  }

  get(id: string): IntelligentDocument | undefined {
    return this.documents.get(id);
  }

  list(): IntelligentDocument[] {
    return Array.from(this.documents.values())
      .filter(d => d.active)
      .sort((a, b) => b.doctrineLevel - a.doctrineLevel);
  }
}
