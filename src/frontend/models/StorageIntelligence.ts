// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * STORAGE INTELLIGENCE — Browser Persistence/Memory Intelligence
 * ─────────────────────────────────────────────────────────────────────────
 * 10 Models (51-60) — Client-side data persistence and memory intelligence
 *
 * From indexed archives to ephemeral sessions, these models govern
 * every byte persisted inside the user's browser.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { FrontendModel, FrontendModelCategory, ModelStatus } from './FrontendIntelligenceRegistry';

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────

const STORAGE_CATEGORY: FrontendModelCategory = 'STORAGE';
const PHI = 1.6180339887498948482;

// ─────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────

export interface StorageModel extends FrontendModel {
  category: 'STORAGE';
  storageMechanism: string;
}

// ─────────────────────────────────────────────────────────────────────────
// MODEL 51 — ARCHIVISTA INDEXATUM
// ─────────────────────────────────────────────────────────────────────────

export const ARCHIVISTA_INDEXATUM: StorageModel = {
  id: 'STORAGE-051',
  modelNumber: 51,
  latinName: 'Archivista Indexatum',
  commonName: 'The Indexed Archivist',
  category: STORAGE_CATEGORY,
  technology: 'IndexedDB',
  description: 'IndexedDB object store management. Creates, queries, and maintains indexed object stores with transactional integrity across browser sessions.',
  costPerOp: { store: 0.002, query: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.88,
  connections: ['STORAGE-058', 'STORAGE-060'],
  phiAlignment: PHI * 0.93,
  storageMechanism: 'INDEXED_DB',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 52 — CUSTOS LOCALIUM
// ─────────────────────────────────────────────────────────────────────────

export const CUSTOS_LOCALIUM: StorageModel = {
  id: 'STORAGE-052',
  modelNumber: 52,
  latinName: 'Custos Localium',
  commonName: 'The Local Guardian',
  category: STORAGE_CATEGORY,
  technology: 'LocalStorage',
  description: 'LocalStorage key-value persistence. Guards simple string-based key-value pairs with synchronous read/write access across browser sessions.',
  costPerOp: { set: 0.001, get: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.75,
  connections: ['STORAGE-053', 'STORAGE-056'],
  phiAlignment: PHI * 0.88,
  storageMechanism: 'LOCAL_STORAGE',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 53 — TEMPORARIUS SESSIONIS
// ─────────────────────────────────────────────────────────────────────────

export const TEMPORARIUS_SESSIONIS: StorageModel = {
  id: 'STORAGE-053',
  modelNumber: 53,
  latinName: 'Temporarius Sessionis',
  commonName: 'The Session Keeper',
  category: STORAGE_CATEGORY,
  technology: 'SessionStorage',
  description: 'SessionStorage ephemeral state management. Maintains tab-scoped key-value data that expires when the browsing context ends.',
  costPerOp: { store: 0.001, expire: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.72,
  connections: ['STORAGE-052', 'STORAGE-056'],
  phiAlignment: PHI * 0.86,
  storageMechanism: 'SESSION_STORAGE',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 54 — PRAEFECTUS OPACORUM
// ─────────────────────────────────────────────────────────────────────────

export const PRAEFECTUS_OPACORUM: StorageModel = {
  id: 'STORAGE-054',
  modelNumber: 54,
  latinName: 'Praefectus Opacorum',
  commonName: 'The Opaque File Commander',
  category: STORAGE_CATEGORY,
  technology: 'OPFS',
  description: 'Origin Private File System intelligence. Manages a sandboxed, high-performance private file system for structured binary data persistence.',
  costPerOp: { write: 0.003, read: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.82,
  connections: ['STORAGE-051', 'STORAGE-057'],
  phiAlignment: PHI * 0.90,
  storageMechanism: 'OPFS',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 55 — CURATOR COOKIEORUM
// ─────────────────────────────────────────────────────────────────────────

export const CURATOR_COOKIEORUM: StorageModel = {
  id: 'STORAGE-055',
  modelNumber: 55,
  latinName: 'Curator Cookieorum',
  commonName: 'The Cookie Curator',
  category: STORAGE_CATEGORY,
  technology: 'JavaScript',
  description: 'Cookie management intelligence. Sets, parses, and rotates HTTP cookies with domain scoping, expiry control, and SameSite attribute governance.',
  costPerOp: { set: 0.001, parse: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.70,
  connections: ['STORAGE-052', 'STORAGE-053'],
  phiAlignment: PHI * 0.84,
  storageMechanism: 'COOKIE',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 56 — SYNCHRONATOR REPLICARUM
// ─────────────────────────────────────────────────────────────────────────

export const SYNCHRONATOR_REPLICARUM: StorageModel = {
  id: 'STORAGE-056',
  modelNumber: 56,
  latinName: 'Synchronator Replicarum',
  commonName: 'The Replica Synchronizer',
  category: STORAGE_CATEGORY,
  technology: 'JavaScript',
  description: 'Cross-tab state synchronization intelligence. Uses BroadcastChannel and storage events to replicate state mutations across concurrent browser tabs.',
  costPerOp: { sync: 0.002, lock: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.84,
  connections: ['STORAGE-052', 'STORAGE-053'],
  phiAlignment: PHI * 0.91,
  storageMechanism: 'BROADCAST_SYNC',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 57 — COMPRESSOR DATORUM
// ─────────────────────────────────────────────────────────────────────────

export const COMPRESSOR_DATORUM: StorageModel = {
  id: 'STORAGE-057',
  modelNumber: 57,
  latinName: 'Compressor Datorum',
  commonName: 'The Data Compressor',
  category: STORAGE_CATEGORY,
  technology: 'JavaScript',
  description: 'Client-side compression intelligence via CompressionStream API. Deflates and inflates data blobs to minimize storage footprint and transfer size.',
  costPerOp: { compress: 0.003, decompress: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.80,
  connections: ['STORAGE-054', 'STORAGE-060'],
  phiAlignment: PHI * 0.89,
  storageMechanism: 'COMPRESSION_STREAM',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 58 — MIGRATOR SCHEMATUM
// ─────────────────────────────────────────────────────────────────────────

export const MIGRATOR_SCHEMATUM: StorageModel = {
  id: 'STORAGE-058',
  modelNumber: 58,
  latinName: 'Migrator Schematum',
  commonName: 'The Schema Migrator',
  category: STORAGE_CATEGORY,
  technology: 'IndexedDB',
  description: 'IndexedDB version migration intelligence. Orchestrates onupgradeneeded transitions, creates/deletes object stores, and rolls back failed migrations.',
  costPerOp: { migrate: 0.005, rollback: 0.004 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.86,
  connections: ['STORAGE-051', 'STORAGE-059'],
  phiAlignment: PHI * 0.92,
  storageMechanism: 'IDB_MIGRATION',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 59 — DEDUPLICATOR MEMORIAE
// ─────────────────────────────────────────────────────────────────────────

export const DEDUPLICATOR_MEMORIAE: StorageModel = {
  id: 'STORAGE-059',
  modelNumber: 59,
  latinName: 'Deduplicator Memoriae',
  commonName: 'The Memory Deduplicator',
  category: STORAGE_CATEGORY,
  technology: 'JavaScript',
  description: 'Deduplication and garbage collection intelligence. Detects duplicate entries across storage layers and reclaims stale memory via eviction policies.',
  costPerOp: { dedup: 0.002, gc: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.83,
  connections: ['STORAGE-051', 'STORAGE-058'],
  phiAlignment: PHI * 0.90,
  storageMechanism: 'DEDUP_GC',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 60 — SERIALIZER STRUCTURARUM
// ─────────────────────────────────────────────────────────────────────────

export const SERIALIZER_STRUCTURARUM: StorageModel = {
  id: 'STORAGE-060',
  modelNumber: 60,
  latinName: 'Serializer Structurarum',
  commonName: 'The Structure Serializer',
  category: STORAGE_CATEGORY,
  technology: 'JavaScript',
  description: 'Structured clone and serialization intelligence. Converts complex object graphs into transferable formats using the structured clone algorithm.',
  costPerOp: { serialize: 0.001, deserialize: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.78,
  connections: ['STORAGE-051', 'STORAGE-057'],
  phiAlignment: PHI * 0.87,
  storageMechanism: 'STRUCTURED_CLONE',
};

// ─────────────────────────────────────────────────────────────────────────
// COLLECTION & FACTORY
// ─────────────────────────────────────────────────────────────────────────

export const STORAGE_MODELS: StorageModel[] = [
  ARCHIVISTA_INDEXATUM,
  CUSTOS_LOCALIUM,
  TEMPORARIUS_SESSIONIS,
  PRAEFECTUS_OPACORUM,
  CURATOR_COOKIEORUM,
  SYNCHRONATOR_REPLICARUM,
  COMPRESSOR_DATORUM,
  MIGRATOR_SCHEMATUM,
  DEDUPLICATOR_MEMORIAE,
  SERIALIZER_STRUCTURARUM,
];

export function createStorageModel(overrides: Partial<StorageModel> & Pick<StorageModel, 'id' | 'modelNumber' | 'latinName' | 'commonName' | 'technology'>): StorageModel {
  return {
    category: STORAGE_CATEGORY as 'STORAGE',
    description: '',
    costPerOp: {},
    frequency: 12.67,
    status: 'DORMANT' as ModelStatus,
    autonomyLevel: 0.5,
    connections: [],
    phiAlignment: PHI * 0.85,
    storageMechanism: 'CUSTOM',
    ...overrides,
  };
}

export function getStorageModel(id: string): StorageModel | undefined {
  return STORAGE_MODELS.find((m) => m.id === id);
}

export function getStorageModelByNumber(num: number): StorageModel | undefined {
  return STORAGE_MODELS.find((m) => m.modelNumber === num);
}

export function calculateStorageCost(model: StorageModel, operation: string, count: number = 1): number {
  const unitCost = model.costPerOp[operation] ?? 0;
  return unitCost * count;
}

export function getTotalStorageCost(): number {
  return STORAGE_MODELS.reduce((sum, m) => {
    const opCosts = Object.values(m.costPerOp);
    return sum + opCosts.reduce((a, b) => a + b, 0);
  }, 0);
}
