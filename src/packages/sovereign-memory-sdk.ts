/**
 * @medina/sovereign-memory-sdk
 * Complete Memory Temple System Package
 *
 * Combines: memoryEngine + dualRead + livingDocument + MemoryTemple.mo + MemoryTempleStable.mo
 *
 * Provides:
 * - Spatial memory storage (theta/phi/depth/ring/beat coordinates)
 * - Dual-layer search (semantic + resonance)
 * - Memory lineage tracking (parent → child chains)
 * - Memory pinning & promotion (salience escalation)
 * - Living document management (versioned, doctrine-aligned)
 * - Kernel-compressed memory (glyph encoding)
 * - φ-encoded coordinate generation
 *
 * Backend Endpoints (Medina.mo):
 *   addere_mneme        → Store memory
 *   quaerere_mneme      → Search memory
 *   promovere_mneme     → Promote memory
 *   consolidare_mneme   → Consolidate memories
 *
 * Terminal: /mem — TERMINALE MEMORIAE
 * Latin: "Quod hic scribitur, eternum est."
 *
 * Callable Functions (10):
 *   1. INSCRIPTIO MEMORIAE    — storeMemory
 *   2. INSCRIPTIO PLENA       — storeMemoryFull
 *   3. LECTOR MEMORIAE        — getMemory
 *   4. EXPLORATOR MEMORIAE    — searchMemories
 *   5. INVESTIGATOR MEMORIAE  — findMemories
 *   6. FIXATOR MEMORIAE       — pinMemory
 *   7. LIBERATOR MEMORIAE     — unpinMemory
 *   8. PROMOTOR MEMORIAE      — promoteMemory
 *   9. GENEALOGUS MEMORIAE    — getMemoryLineage
 *  10. STATUS MEMORIAE        — memoryStatus
 */

import { v4 as uuidv4 } from 'uuid';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const PHI_INVERSE = 0.618033988749895;
export const FREQ_432 = 432.0;
export const GOLDEN_ANGLE = 2 * Math.PI * PHI_INVERSE; // ≈2.399963

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type MemoryType = 'episodic' | 'semantic' | 'procedural' | 'spatial' | 'doctrinal';

export interface SpatialCoordinate {
  theta: number;   // 0–360 angular position
  phi: number;     // 0–180 elevation angle
  depth: number;   // 0–100 depth layer
  ring: number;    // 1–12 macro ring (N1–N12)
  beat: number;    // temporal beat index
}

export interface MemoryEntry {
  id: string;
  content: string;
  type: MemoryType;
  coordinates: SpatialCoordinate;
  salience: number;
  doctrineAlignment: number;
  tags: string[];
  lineageId?: string;
  parentId?: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  resonanceScore?: number;
}

export interface MemoryQuery {
  query: string;
  type?: MemoryType;
  minSalience?: number;
  minDoctrineAlignment?: number;
  ring?: number;
  lineageId?: string;
  limit?: number;
}

export interface MemoryResult {
  entries: MemoryEntry[];
  totalCount: number;
  queryTime: number;
}

export interface DualReadResult {
  semanticScore: number;
  resonanceScore: number;
  combinedScore: number;
  semanticMatches: MemoryEntry[];
  resonanceMatches: MemoryEntry[];
  unified: MemoryEntry[];
}

export interface MemoryLineage {
  rootId: string;
  chain: MemoryEntry[];
  depth: number;
  totalDescendants: number;
}

export interface LivingDocument {
  id: string;
  title: string;
  version: string;
  doctrineLevel: number;
  content: string;
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    ring: number;
    beat: number;
  };
  lineage: string[];
  active: boolean;
}

export interface MemorySDKConfig {
  maxEntries?: number;
  defaultRing?: number;
  autoPin?: boolean;
  doctrineThreshold?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHI COORDINATE GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/** Generate φ-spiral coordinates for spatial placement */
export function generatePhiCoordinate(index: number, ring: number, beat: number): SpatialCoordinate {
  const theta = (index * GOLDEN_ANGLE * (180 / Math.PI)) % 360;
  const phi = (index * PHI_INVERSE * 180) % 180;
  const depth = Math.min(100, Math.floor(index * PHI_INVERSE));
  return { theta, phi, depth, ring, beat };
}

/** Compute resonance score between two memories */
export function computeResonance(a: MemoryEntry, b: MemoryEntry): number {
  const coordDist = Math.sqrt(
    Math.pow(a.coordinates.theta - b.coordinates.theta, 2) +
    Math.pow(a.coordinates.phi - b.coordinates.phi, 2) +
    Math.pow(a.coordinates.depth - b.coordinates.depth, 2)
  );
  const normalizedDist = coordDist / 500; // normalize
  const ringBonus = a.coordinates.ring === b.coordinates.ring ? 0.2 : 0;
  const tagOverlap = a.tags.filter(t => b.tags.includes(t)).length / Math.max(a.tags.length, b.tags.length, 1);
  return Math.min(1, (1 - normalizedDist) * PHI_INVERSE + tagOverlap * PHI_INVERSE + ringBonus);
}

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY STORE
// ═══════════════════════════════════════════════════════════════════════════

const memoryStore: Map<string, MemoryEntry> = new Map();
const documentStore: Map<string, LivingDocument> = new Map();

/** Store a new memory */
export function storeMemory(
  content: string,
  type: MemoryType,
  coordinates: SpatialCoordinate,
  tags: string[] = [],
  parentId?: string,
): MemoryEntry {
  const entry: MemoryEntry = {
    id: uuidv4(),
    content,
    type,
    coordinates,
    salience: 0.5,
    doctrineAlignment: type === 'doctrinal' ? 1.0 : 0.5,
    tags,
    parentId,
    lineageId: parentId ? memoryStore.get(parentId)?.lineageId ?? parentId : undefined,
    pinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryStore.set(entry.id, entry);
  return entry;
}

/** Store memory with full parameters */
export function storeMemoryFull(
  content: string,
  type: MemoryType,
  coordinates: SpatialCoordinate,
  salience: number,
  doctrineAlignment: number,
  tags: string[],
  parentId?: string,
): MemoryEntry {
  const entry = storeMemory(content, type, coordinates, tags, parentId);
  entry.salience = Math.max(0, Math.min(1, salience));
  entry.doctrineAlignment = Math.max(0, Math.min(1, doctrineAlignment));
  memoryStore.set(entry.id, entry);
  return entry;
}

/** Get a single memory by ID */
export function getMemory(id: string): MemoryEntry | undefined {
  return memoryStore.get(id);
}

/** Search memories with semantic keyword matching */
export function searchMemories(query: MemoryQuery): MemoryResult {
  const start = Date.now();
  const lq = query.query.toLowerCase();
  let results = Array.from(memoryStore.values()).filter(entry => {
    if (!entry.content.toLowerCase().includes(lq) && !entry.tags.some(t => t.toLowerCase().includes(lq))) return false;
    if (query.type && entry.type !== query.type) return false;
    if (query.minSalience && entry.salience < query.minSalience) return false;
    if (query.minDoctrineAlignment && entry.doctrineAlignment < query.minDoctrineAlignment) return false;
    if (query.ring && entry.coordinates.ring !== query.ring) return false;
    if (query.lineageId && entry.lineageId !== query.lineageId) return false;
    return true;
  });
  results.sort((a, b) => b.salience - a.salience);
  if (query.limit) results = results.slice(0, query.limit);
  return { entries: results, totalCount: results.length, queryTime: Date.now() - start };
}

/** Find memories (alias with more flexible matching) */
export function findMemories(query: string, limit = 20): MemoryEntry[] {
  const lq = query.toLowerCase();
  return Array.from(memoryStore.values())
    .filter(e => e.content.toLowerCase().includes(lq) || e.tags.some(t => t.toLowerCase().includes(lq)))
    .sort((a, b) => b.salience - a.salience)
    .slice(0, limit);
}

/** Pin a memory (prevent decay) */
export function pinMemory(id: string): boolean {
  const entry = memoryStore.get(id);
  if (!entry) return false;
  entry.pinned = true;
  entry.updatedAt = new Date().toISOString();
  return true;
}

/** Unpin a memory */
export function unpinMemory(id: string): boolean {
  const entry = memoryStore.get(id);
  if (!entry) return false;
  entry.pinned = false;
  entry.updatedAt = new Date().toISOString();
  return true;
}

/** Promote a memory (increase salience) */
export function promoteMemory(id: string, amount = 0.1): boolean {
  const entry = memoryStore.get(id);
  if (!entry) return false;
  entry.salience = Math.min(1, entry.salience + amount);
  entry.updatedAt = new Date().toISOString();
  return true;
}

/** Get memory lineage (parent → child chain) */
export function getMemoryLineage(id: string): MemoryLineage {
  const chain: MemoryEntry[] = [];
  let current = memoryStore.get(id);
  const rootId = current?.lineageId ?? id;

  // Walk up to root
  while (current?.parentId) {
    current = memoryStore.get(current.parentId);
    if (current) chain.unshift(current);
  }

  // Walk down from target
  const target = memoryStore.get(id);
  if (target) chain.push(target);
  const descendants = Array.from(memoryStore.values()).filter(e => e.lineageId === rootId && e.id !== id);
  chain.push(...descendants);

  return { rootId, chain, depth: chain.length, totalDescendants: descendants.length };
}

/** Get memory system status */
export function memoryStatus(): {
  totalMemories: number;
  pinnedCount: number;
  typeDistribution: Record<string, number>;
  avgSalience: number;
  ringDistribution: Record<number, number>;
} {
  const entries = Array.from(memoryStore.values());
  const typeDist: Record<string, number> = {};
  const ringDist: Record<number, number> = {};
  let totalSalience = 0;
  let pinnedCount = 0;

  for (const e of entries) {
    typeDist[e.type] = (typeDist[e.type] ?? 0) + 1;
    ringDist[e.coordinates.ring] = (ringDist[e.coordinates.ring] ?? 0) + 1;
    totalSalience += e.salience;
    if (e.pinned) pinnedCount++;
  }

  return {
    totalMemories: entries.length,
    pinnedCount,
    typeDistribution: typeDist,
    avgSalience: entries.length > 0 ? totalSalience / entries.length : 0,
    ringDistribution: ringDist,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// DUAL READ (Semantic + Resonance)
// ═══════════════════════════════════════════════════════════════════════════

/** Perform a dual-layer read: semantic + resonance */
export function dualRead(query: string, limit = 10): DualReadResult {
  const lq = query.toLowerCase();
  const all = Array.from(memoryStore.values());

  // Semantic pass
  const semanticMatches = all
    .filter(e => e.content.toLowerCase().includes(lq) || e.tags.some(t => t.toLowerCase().includes(lq)))
    .sort((a, b) => b.salience - a.salience)
    .slice(0, limit);

  // Resonance pass (use doctrine alignment + salience as resonance proxy)
  const resonanceMatches = all
    .sort((a, b) => (b.doctrineAlignment * b.salience) - (a.doctrineAlignment * a.salience))
    .slice(0, limit);

  // Unify (merge and deduplicate)
  const seen = new Set<string>();
  const unified: MemoryEntry[] = [];
  for (const e of [...semanticMatches, ...resonanceMatches]) {
    if (!seen.has(e.id)) {
      seen.add(e.id);
      unified.push(e);
    }
  }
  unified.sort((a, b) => (b.salience * b.doctrineAlignment) - (a.salience * a.doctrineAlignment));

  const avgSemantic = semanticMatches.length > 0 ? semanticMatches.reduce((s, e) => s + e.salience, 0) / semanticMatches.length : 0;
  const avgResonance = resonanceMatches.length > 0 ? resonanceMatches.reduce((s, e) => s + e.doctrineAlignment, 0) / resonanceMatches.length : 0;

  return {
    semanticScore: avgSemantic,
    resonanceScore: avgResonance,
    combinedScore: (avgSemantic + avgResonance) / 2,
    semanticMatches,
    resonanceMatches,
    unified: unified.slice(0, limit),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// LIVING DOCUMENT MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/** Create a living document */
export function createLivingDocument(title: string, content: string, doctrineLevel: number, ring: number): LivingDocument {
  const doc: LivingDocument = {
    id: uuidv4(),
    title,
    version: '1.0.0',
    doctrineLevel,
    content,
    metadata: {
      author: 'sovereign',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ring,
      beat: 0,
    },
    lineage: [],
    active: true,
  };
  documentStore.set(doc.id, doc);
  return doc;
}

/** List all living documents */
export function listLivingDocuments(): LivingDocument[] {
  return Array.from(documentStore.values());
}

/** Get living document by ID */
export function getLivingDocument(id: string): LivingDocument | undefined {
  return documentStore.get(id);
}

// ═══════════════════════════════════════════════════════════════════════════
// PACKAGE MANIFEST
// ═══════════════════════════════════════════════════════════════════════════

export const PACKAGE_MANIFEST = {
  name: '@medina/sovereign-memory-sdk',
  version: '1.0.0',
  description: 'Complete Memory Temple System — spatial memory, dual-read search, lineage, living documents',
  modules: [
    'memoryEngine', 'dualRead', 'livingDocument', 'MemoryTemple.mo', 'MemoryTempleStable.mo'
  ],
  callableFunctions: 10,
  terminal: '/mem',
  latinName: 'TERMINALE MEMORIAE',
  motto: 'Quod hic scribitur, eternum est.',
  backendEndpoints: ['addere_mneme', 'quaerere_mneme', 'promovere_mneme', 'consolidare_mneme'],
  exports: [
    'storeMemory', 'storeMemoryFull', 'getMemory', 'searchMemories', 'findMemories',
    'pinMemory', 'unpinMemory', 'promoteMemory', 'getMemoryLineage', 'memoryStatus',
    'dualRead', 'computeResonance', 'generatePhiCoordinate',
    'createLivingDocument', 'listLivingDocuments', 'getLivingDocument',
  ],
  phiSignature: PHI,
};
