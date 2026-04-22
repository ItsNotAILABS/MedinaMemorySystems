// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * WORKER INTELLIGENCE — Parallel/Background Compute Intelligence
 * ─────────────────────────────────────────────────────────────────────────
 * 10 Models (31-40) — Web Workers, Service Workers, and background processing
 *
 * From thread spawning to offline-first caching, these models govern
 * every background computation and service layer in the browser.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { FrontendModel, FrontendModelCategory, ModelStatus } from './FrontendIntelligenceRegistry';

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────

const WORKER_CATEGORY: FrontendModelCategory = 'WORKER';
const PHI = 1.6180339887498948482;

// ─────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────

export interface WorkerModel extends FrontendModel {
  category: 'WORKER';
  executionContext: string;
}

// ─────────────────────────────────────────────────────────────────────────
// MODEL 31 — LABORATOR PARALLELI
// ─────────────────────────────────────────────────────────────────────────

export const LABORATOR_PARALLELI: WorkerModel = {
  id: 'WORKER-031',
  modelNumber: 31,
  latinName: 'Laborator Paralleli',
  commonName: 'The Parallel Worker',
  category: WORKER_CATEGORY,
  technology: 'WebWorker',
  description: 'Web Worker thread management intelligence. Spawns dedicated workers, manages structured clone transfers, coordinates thread pools, and handles Transferable objects.',
  costPerOp: { spawn: 0.003, message: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.88,
  connections: ['WORKER-033', 'WORKER-036'],
  phiAlignment: PHI * 0.92,
  executionContext: 'DEDICATED_WORKER',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 32 — CUSTOS SERVITII
// ─────────────────────────────────────────────────────────────────────────

export const CUSTOS_SERVITII: WorkerModel = {
  id: 'WORKER-032',
  modelNumber: 32,
  latinName: 'Custos Servitii',
  commonName: 'The Service Guardian',
  category: WORKER_CATEGORY,
  technology: 'ServiceWorker',
  description: 'Service Worker lifecycle intelligence. Manages install/activate phases, fetch interception, background sync, and push notification handling.',
  costPerOp: { install: 0.005, intercept: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.90,
  connections: ['WORKER-034', 'WORKER-035'],
  phiAlignment: PHI * 0.94,
  executionContext: 'SERVICE_WORKER',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 33 — COMMUNICATOR COMMUNES
// ─────────────────────────────────────────────────────────────────────────

export const COMMUNICATOR_COMMUNES: WorkerModel = {
  id: 'WORKER-033',
  modelNumber: 33,
  latinName: 'Communicator Communes',
  commonName: 'The Shared Communicator',
  category: WORKER_CATEGORY,
  technology: 'SharedWorker',
  description: 'SharedWorker cross-tab intelligence. Manages shared ports, cross-tab state synchronization, connection lifecycle, and multi-context message routing.',
  costPerOp: { port: 0.002, broadcast: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.82,
  connections: ['WORKER-031', 'WORKER-036'],
  phiAlignment: PHI * 0.88,
  executionContext: 'SHARED_WORKER',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 34 — PRAEFECTUS CACHARUM
// ─────────────────────────────────────────────────────────────────────────

export const PRAEFECTUS_CACHARUM: WorkerModel = {
  id: 'WORKER-034',
  modelNumber: 34,
  latinName: 'Praefectus Cacharum',
  commonName: 'The Cache Commander',
  category: WORKER_CATEGORY,
  technology: 'CacheAPI',
  description: 'Cache API strategy intelligence. Implements cache-first, network-first, stale-while-revalidate, and cache-only strategies with versioned cache management.',
  costPerOp: { cache: 0.001, match: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.86,
  connections: ['WORKER-032', 'WORKER-035'],
  phiAlignment: PHI * 0.90,
  executionContext: 'CACHE_STORAGE',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 35 — SELECTOR OFFLINIALIS
// ─────────────────────────────────────────────────────────────────────────

export const SELECTOR_OFFLINIALIS: WorkerModel = {
  id: 'WORKER-035',
  modelNumber: 35,
  latinName: 'Selector Offlinialis',
  commonName: 'The Offline Selector',
  category: WORKER_CATEGORY,
  technology: 'PWA',
  description: 'PWA offline-first intelligence. Manages app manifest, installability criteria, background sync queues, and offline fallback page serving.',
  costPerOp: { offline: 0.003, sync: 0.004 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.84,
  connections: ['WORKER-032', 'WORKER-034'],
  phiAlignment: PHI * 0.87,
  executionContext: 'PWA_SHELL',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 36 — DISPENSATOR CANALIUM
// ─────────────────────────────────────────────────────────────────────────

export const DISPENSATOR_CANALIUM: WorkerModel = {
  id: 'WORKER-036',
  modelNumber: 36,
  latinName: 'Dispensator Canalium',
  commonName: 'The Channel Dispatcher',
  category: WORKER_CATEGORY,
  technology: 'JavaScript',
  description: 'BroadcastChannel and MessageChannel routing intelligence. Manages cross-context messaging, port transfer chains, and channel multiplexing strategies.',
  costPerOp: { channel: 0.001, dispatch: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.80,
  connections: ['WORKER-031', 'WORKER-033'],
  phiAlignment: PHI * 0.85,
  executionContext: 'MESSAGE_CHANNEL',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 37 — PLANIFICATOR OTIORUM
// ─────────────────────────────────────────────────────────────────────────

export const PLANIFICATOR_OTIORUM: WorkerModel = {
  id: 'WORKER-037',
  modelNumber: 37,
  latinName: 'Planificator Otiorum',
  commonName: 'The Idle Planner',
  category: WORKER_CATEGORY,
  technology: 'JavaScript',
  description: 'requestIdleCallback scheduling intelligence. Plans low-priority work during browser idle periods, respects deadline budgets, and yields to user interaction.',
  costPerOp: { schedule: 0.001, deadline: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.78,
  connections: ['WORKER-039', 'WORKER-036'],
  phiAlignment: PHI * 0.83,
  executionContext: 'IDLE_CALLBACK',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 38 — NAVIGATOR HISTORIAE
// ─────────────────────────────────────────────────────────────────────────

export const NAVIGATOR_HISTORIAE: WorkerModel = {
  id: 'WORKER-038',
  modelNumber: 38,
  latinName: 'Navigator Historiae',
  commonName: 'The History Navigator',
  category: WORKER_CATEGORY,
  technology: 'NavigationAPI',
  description: 'Navigation API intelligence. Intercepts navigation events, manages history entries, coordinates view transitions, and handles back/forward traversals.',
  costPerOp: { navigate: 0.002, intercept: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.85,
  connections: ['WORKER-035', 'RENDER-001'],
  phiAlignment: PHI * 0.89,
  executionContext: 'NAVIGATION',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 39 — MONITOR PERFORMANTIAE
// ─────────────────────────────────────────────────────────────────────────

export const MONITOR_PERFORMANTIAE: WorkerModel = {
  id: 'WORKER-039',
  modelNumber: 39,
  latinName: 'Monitor Performantiae',
  commonName: 'The Performance Monitor',
  category: WORKER_CATEGORY,
  technology: 'PerformanceAPI',
  description: 'Performance Observer intelligence. Tracks LCP, FID, CLS, INP metrics, manages performance marks and measures, and identifies long animation frames.',
  costPerOp: { measure: 0.001, mark: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.92,
  connections: ['WORKER-037', 'RENDER-006'],
  phiAlignment: PHI * 0.95,
  executionContext: 'PERFORMANCE_TIMELINE',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 40 — EXTENSOR NAVIGATORIS
// ─────────────────────────────────────────────────────────────────────────

export const EXTENSOR_NAVIGATORIS: WorkerModel = {
  id: 'WORKER-040',
  modelNumber: 40,
  latinName: 'Extensor Navigatoris',
  commonName: 'The Browser Extender',
  category: WORKER_CATEGORY,
  technology: 'WebExtensions',
  description: 'WebExtensions API intelligence. Manages content scripts, background service workers, cross-origin messaging, and browser action popup coordination.',
  costPerOp: { extend: 0.003, inject: 0.004 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.76,
  connections: ['WORKER-032', 'WORKER-031'],
  phiAlignment: PHI * 0.82,
  executionContext: 'EXTENSION',
};

// ─────────────────────────────────────────────────────────────────────────
// COLLECTION & FACTORY
// ─────────────────────────────────────────────────────────────────────────

export const WORKER_MODELS: WorkerModel[] = [
  LABORATOR_PARALLELI,
  CUSTOS_SERVITII,
  COMMUNICATOR_COMMUNES,
  PRAEFECTUS_CACHARUM,
  SELECTOR_OFFLINIALIS,
  DISPENSATOR_CANALIUM,
  PLANIFICATOR_OTIORUM,
  NAVIGATOR_HISTORIAE,
  MONITOR_PERFORMANTIAE,
  EXTENSOR_NAVIGATORIS,
];

export function createWorkerModel(overrides: Partial<WorkerModel> & Pick<WorkerModel, 'id' | 'modelNumber' | 'latinName' | 'commonName' | 'technology'>): WorkerModel {
  return {
    category: WORKER_CATEGORY as 'WORKER',
    description: '',
    costPerOp: {},
    frequency: 12.67,
    status: 'DORMANT' as ModelStatus,
    autonomyLevel: 0.5,
    connections: [],
    phiAlignment: PHI * 0.85,
    executionContext: 'CUSTOM',
    ...overrides,
  };
}

export function getWorkerModel(id: string): WorkerModel | undefined {
  return WORKER_MODELS.find((m) => m.id === id);
}

export function getWorkerModelByNumber(num: number): WorkerModel | undefined {
  return WORKER_MODELS.find((m) => m.modelNumber === num);
}

export function calculateWorkerCost(model: WorkerModel, operation: string, count: number = 1): number {
  const unitCost = model.costPerOp[operation] ?? 0;
  return unitCost * count;
}

export function getTotalWorkerCost(): number {
  return WORKER_MODELS.reduce((sum, m) => {
    const opCosts = Object.values(m.costPerOp);
    return sum + opCosts.reduce((a, b) => a + b, 0);
  }, 0);
}
