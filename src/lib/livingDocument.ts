import { v4 as uuidv4 } from 'uuid';
import type { LivingDocumentPacket, GateId } from '@/types';

// ─── Living Document Registry ─────────────────────────────────────────────────

const documents: Map<string, LivingDocumentPacket> = new Map();

(function seed() {
  const now = new Date().toISOString();
  const docs: Omit<LivingDocumentPacket, 'id'>[] = [
    {
      title: 'NOVA OVO Founding Doctrine',
      version: '1.0.0',
      doctrineLevel: 1,
      content: `# NOVA OVO Founding Doctrine\n\nNOVA OVO is a unified memory, governance, and intelligence platform operating under sovereign principles. All operations align with RECITAL_PLUS_ONE law. Memory is spatial. Governance is auditable. Models are callable. Identity is sovereign.`,
      metadata: { author: 'Sovereign', createdAt: now, updatedAt: now, ring: 1, beat: 1, gateRequired: null },
      lineage: [],
      active: true,
    },
    {
      title: 'RECITAL_PLUS_ONE Law',
      version: '1.0.0',
      doctrineLevel: 1,
      content: `# RECITAL_PLUS_ONE\n\nEvery recital amplifies the subsequent state. Resonance compounds across temporal beats. A memory that is recited gains salience. A governance proposal that is recited gains legitimacy. The organism that recites gains coherence.\n\n**Formula:** Resonance(n+1) = Resonance(n) × (1 + α) where α is the amplification coefficient.`,
      metadata: { author: 'Sovereign', createdAt: now, updatedAt: now, ring: 1, beat: 1, gateRequired: 'A' as GateId },
      lineage: ['NOVA OVO Founding Doctrine'],
      active: true,
    },
    {
      title: 'Gate Enforcement Protocol',
      version: '1.0.0',
      doctrineLevel: 2,
      content: `# Gate Enforcement Protocol\n\n## Gate A — Governance Gate\nGreen: Proposals may be enacted. Amber: Enactment requires dual approval. Red: No enactment permitted.\n\n## Gate B — Memory Gate\nGreen: Full read/write access. Amber: Write requires justification. Red: Read-only mode.\n\n## Gate C — Sovereign Gate\nGreen: Full sovereign operation. Amber: Broadcast limited. Red: Organism hibernation.`,
      metadata: { author: 'Governance', createdAt: now, updatedAt: now, ring: 2, beat: 2, gateRequired: 'A' as GateId },
      lineage: ['NOVA OVO Founding Doctrine'],
      active: true,
    },
  ];

  for (const doc of docs) {
    const id = uuidv4();
    documents.set(id, { ...doc, id });
  }
})();

// ─── Operations ───────────────────────────────────────────────────────────────

export function listDocuments(): LivingDocumentPacket[] {
  return Array.from(documents.values()).sort((a, b) => a.doctrineLevel - b.doctrineLevel);
}

export function getDocument(id: string): LivingDocumentPacket | undefined {
  return documents.get(id);
}

export function createDocument(
  title: string,
  content: string,
  doctrineLevel: number,
  author: string,
  ring: number,
  gateRequired: GateId | null = null,
): LivingDocumentPacket {
  const now = new Date().toISOString();
  const doc: LivingDocumentPacket = {
    id: uuidv4(),
    title,
    version: '1.0.0',
    doctrineLevel,
    content,
    metadata: { author, createdAt: now, updatedAt: now, ring, beat: documents.size + 1, gateRequired },
    lineage: [],
    active: true,
  };
  documents.set(doc.id, doc);
  return doc;
}

export function updateDocument(id: string, content: string, version?: string): LivingDocumentPacket | null {
  const doc = documents.get(id);
  if (!doc) return null;

  const parts = (version ?? doc.version).split('.').map(Number);
  parts[2] = (parts[2] ?? 0) + 1;

  const updated: LivingDocumentPacket = {
    ...doc,
    content,
    version: parts.join('.'),
    metadata: { ...doc.metadata, updatedAt: new Date().toISOString() },
    lineage: [...doc.lineage, `${doc.title} v${doc.version}`],
  };
  documents.set(id, updated);
  return updated;
}
