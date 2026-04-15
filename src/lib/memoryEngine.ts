import { v4 as uuidv4 } from 'uuid';
import type {
  MemoryEntry,
  MemoryQuery,
  MemoryResult,
  MemoryType,
  SpatialCoordinate,
} from '@/types';

// ─── In-Memory Store ─────────────────────────────────────────────────────────

const store: Map<string, MemoryEntry> = new Map();

function seedStore(): void {
  const seeds: Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      content: 'NOVA OVO platform initialized. Sovereign memory layer active.',
      type: 'doctrinal',
      coordinates: { theta: 0, phi: 90, depth: 1, ring: 1, beat: 1 },
      salience: 1.0,
      doctrineAlignment: 1.0,
      tags: ['system', 'init', 'doctrinal'],
      pinned: true,
      resonanceScore: 1.0,
    },
    {
      content: 'Gate A: Primary governance gate. Controls proposal enactment.',
      type: 'doctrinal',
      coordinates: { theta: 30, phi: 60, depth: 2, ring: 2, beat: 2 },
      salience: 0.95,
      doctrineAlignment: 0.98,
      tags: ['governance', 'gate', 'doctrinal'],
      pinned: true,
      resonanceScore: 0.97,
    },
    {
      content: 'Model routing protocol: Strategist handles macro decisions; Builder handles construction tasks.',
      type: 'semantic',
      coordinates: { theta: 90, phi: 45, depth: 3, ring: 3, beat: 5 },
      salience: 0.88,
      doctrineAlignment: 0.91,
      tags: ['model', 'routing', 'protocol'],
      pinned: false,
      resonanceScore: 0.85,
    },
    {
      content: 'RECITAL_PLUS_ONE law: Every recital amplifies the next. Resonance compounds across beats.',
      type: 'doctrinal',
      coordinates: { theta: 180, phi: 90, depth: 5, ring: 1, beat: 1 },
      salience: 0.99,
      doctrineAlignment: 1.0,
      tags: ['recital', 'law', 'resonance', 'doctrinal'],
      pinned: true,
      resonanceScore: 0.99,
    },
    {
      content: 'Company onboarding: Three modes available — CONNECT (API bridge), INTERNALIZE (full ingestion), HYBRID (selective).',
      type: 'procedural',
      coordinates: { theta: 270, phi: 30, depth: 4, ring: 5, beat: 10 },
      salience: 0.82,
      doctrineAlignment: 0.87,
      tags: ['company', 'onboarding', 'procedure'],
      pinned: false,
      resonanceScore: 0.80,
    },
  ];

  const now = new Date().toISOString();
  for (const seed of seeds) {
    const id = uuidv4();
    store.set(id, { ...seed, id, createdAt: now, updatedAt: now });
  }
}

seedStore();

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export function storeMemory(
  content: string,
  type: MemoryType = 'semantic',
  tags: string[] = [],
  coordinates?: Partial<SpatialCoordinate>,
  parentId?: string,
): MemoryEntry {
  const now = new Date().toISOString();
  const id = uuidv4();

  const coords: SpatialCoordinate = {
    theta: coordinates?.theta ?? Math.random() * 360,
    phi: coordinates?.phi ?? Math.random() * 180,
    depth: coordinates?.depth ?? Math.floor(Math.random() * 10) + 1,
    ring: coordinates?.ring ?? Math.ceil(Math.random() * 12),
    beat: coordinates?.beat ?? store.size + 1,
  };

  const entry: MemoryEntry = {
    id,
    content,
    type,
    coordinates: coords,
    salience: 0.5 + Math.random() * 0.5,
    doctrineAlignment: 0.6 + Math.random() * 0.4,
    tags,
    pinned: false,
    lineageId: parentId ? getLineageId(parentId) : id,
    parentId,
    createdAt: now,
    updatedAt: now,
    resonanceScore: 0.5 + Math.random() * 0.5,
  };

  store.set(id, entry);
  return entry;
}

function getLineageId(parentId: string): string {
  const parent = store.get(parentId);
  return parent?.lineageId ?? parentId;
}

export function getMemory(id: string): MemoryEntry | undefined {
  return store.get(id);
}

export function updateMemory(id: string, updates: Partial<MemoryEntry>): MemoryEntry | null {
  const entry = store.get(id);
  if (!entry) return null;
  const updated = { ...entry, ...updates, id, updatedAt: new Date().toISOString() };
  store.set(id, updated);
  return updated;
}

export function deleteMemory(id: string): boolean {
  return store.delete(id);
}

export function pinMemory(id: string): MemoryEntry | null {
  return updateMemory(id, { pinned: true });
}

export function unpinMemory(id: string): MemoryEntry | null {
  return updateMemory(id, { pinned: false });
}

// ─── Query ────────────────────────────────────────────────────────────────────

export function queryMemory(query: MemoryQuery): MemoryResult {
  const start = Date.now();
  const q = query.query.toLowerCase();
  const limit = query.limit ?? 20;

  let results = Array.from(store.values()).filter((entry) => {
    if (query.type && entry.type !== query.type) return false;
    if (query.minSalience !== undefined && entry.salience < query.minSalience) return false;
    if (query.minDoctrineAlignment !== undefined && entry.doctrineAlignment < query.minDoctrineAlignment) return false;
    if (query.ring !== undefined && entry.coordinates.ring !== query.ring) return false;
    if (query.lineageId && entry.lineageId !== query.lineageId) return false;

    if (q) {
      const contentMatch = entry.content.toLowerCase().includes(q);
      const tagMatch = entry.tags.some((t) => t.toLowerCase().includes(q));
      return contentMatch || tagMatch;
    }
    return true;
  });

  // Sort by salience desc
  results.sort((a, b) => b.salience - a.salience);
  results = results.slice(0, limit);

  return {
    entries: results,
    totalCount: results.length,
    queryTime: Date.now() - start,
  };
}

export function listMemories(limit = 20): MemoryEntry[] {
  return Array.from(store.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getPinnedMemories(): MemoryEntry[] {
  return Array.from(store.values()).filter((e) => e.pinned);
}

export function getMemoryLineage(lineageId: string): MemoryEntry[] {
  return Array.from(store.values())
    .filter((e) => e.lineageId === lineageId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function getRootMemory(): MemoryEntry | undefined {
  return Array.from(store.values()).find((e) => !e.parentId && e.coordinates.ring === 1);
}

export function getMemoryStats(): {
  total: number;
  pinned: number;
  byType: Record<string, number>;
  avgSalience: number;
} {
  const all = Array.from(store.values());
  const byType: Record<string, number> = {};
  let totalSalience = 0;

  for (const e of all) {
    byType[e.type] = (byType[e.type] ?? 0) + 1;
    totalSalience += e.salience;
  }

  return {
    total: all.length,
    pinned: all.filter((e) => e.pinned).length,
    byType,
    avgSalience: all.length > 0 ? totalSalience / all.length : 0,
  };
}
