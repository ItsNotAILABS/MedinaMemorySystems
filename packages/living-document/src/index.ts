// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE.

/**
 * living-document
 * ─────────────────────────────────────────────────────────────────────────────
 * Living document framework for ItsNotAILABS sovereign systems.
 *
 * Documents with versioned sections, organism-authored amendments,
 * SAT access token binding, enforcement metadata, and continuous update cycles.
 *
 * ISIL-1.1 — Production use requires commercial license + AUT.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type DocumentClass =
  | 'LICENSE.ENFORCEMENT.ACTIVE'
  | 'README.LIVING'
  | 'CONTRACT.SOVEREIGN'
  | 'SPECIFICATION.ORGANISM'
  | 'LEDGER.IMMUTABLE'
  | 'PROTOCOL.EXTENSION';

export type SectionStatus = 'ACTIVE' | 'AMENDED' | 'SUPERSEDED' | 'LOCKED';

export interface DocumentSection {
  sectionId: string;
  title: string;
  content: string;
  version: number;
  status: SectionStatus;
  authoredBy: string;
  authoredAt: number;
  amendedBy?: string;
  amendedAt?: number;
  lockReason?: string;
}

export interface AccessRecord {
  accessId: string;
  accessorId?: string;
  accessedAt: number;
  accessType: 'READ' | 'WRITE' | 'EXECUTE';
  /** Sovereign Access Token issued for this access */
  sovereignAccessToken: string;
  ipSignal?: string;
}

export interface LivingDocument {
  documentId: string;
  documentClass: DocumentClass;
  title: string;
  version: string;
  organism: string; // owning organism ID
  createdAt: number;
  lastAmendedAt: number;
  sections: DocumentSection[];
  accessLog: AccessRecord[];
  enforcementActive: boolean;
}

export class LivingDocumentEngine {
  private documents = new Map<string, LivingDocument>();

  /** Create a new living document */
  create(opts: Omit<LivingDocument, 'accessLog' | 'sections'>): LivingDocument {
    const doc: LivingDocument = { ...opts, sections: [], accessLog: [] };
    this.documents.set(doc.documentId, doc);
    return doc;
  }

  /** Add a section to a document */
  addSection(documentId: string, section: Omit<DocumentSection, 'version'>): DocumentSection {
    const doc = this._get(documentId);
    const full: DocumentSection = { ...section, version: 1 };
    doc.sections.push(full);
    doc.lastAmendedAt = Date.now();
    return full;
  }

  /** Amend a section — creates a new version, marks old as AMENDED */
  amend(documentId: string, sectionId: string, newContent: string, amendedBy: string): DocumentSection {
    const doc = this._get(documentId);
    const section = doc.sections.find(s => s.sectionId === sectionId);
    if (!section) throw new Error(`Section ${sectionId} not found in ${documentId}`);
    if (section.status === 'LOCKED') throw new Error(`Section ${sectionId} is locked`);
    section.status = 'AMENDED';
    const amended: DocumentSection = {
      ...section, content: newContent, version: section.version + 1,
      status: 'ACTIVE', amendedBy, amendedAt: Date.now(),
    };
    doc.sections.push(amended);
    doc.lastAmendedAt = Date.now();
    return amended;
  }

  /** Record an access event and issue a SAT */
  recordAccess(documentId: string, accessorId: string | undefined,
               accessType: 'READ' | 'WRITE' | 'EXECUTE' = 'READ'): AccessRecord {
    const doc = this._get(documentId);
    const sat = this._issueSAT(documentId, accessorId, accessType);
    const record: AccessRecord = {
      accessId: `acc-${Date.now()}`, accessorId, accessedAt: Date.now(),
      accessType, sovereignAccessToken: sat,
    };
    doc.accessLog.push(record);
    return record;
  }

  /** Get active sections of a document */
  getActiveSections(documentId: string): DocumentSection[] {
    return this._get(documentId).sections.filter(s => s.status === 'ACTIVE');
  }

  /** Get the full access audit trail */
  getAccessLog(documentId: string): AccessRecord[] {
    return [...this._get(documentId).accessLog];
  }

  private _get(id: string): LivingDocument {
    const doc = this.documents.get(id);
    if (!doc) throw new Error(`Document ${id} not found`);
    return doc;
  }

  private _issueSAT(documentId: string, accessorId: string | undefined, type: string): string {
    const payload = `${documentId}:${accessorId ?? 'anonymous'}:${type}:${Date.now()}`;
    return `SAT-${Buffer.from(payload).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 32)}`;
  }
}
