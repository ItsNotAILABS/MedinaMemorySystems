// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * REACTIVE INTELLIGENCE — Reactive UI Framework Intelligence
 * ─────────────────────────────────────────────────────────────────────────
 * 10 Models (11-20) — Reactive state and component lifecycle intelligence
 *
 * From virtual DOM diffing to fine-grained signals, these models govern
 * the reactive substrate that makes interfaces feel alive.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { FrontendModel, FrontendModelCategory, ModelStatus } from './FrontendIntelligenceRegistry';

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────

const REACTIVE_CATEGORY: FrontendModelCategory = 'REACTIVE';
const PHI = 1.6180339887498948482;

// ─────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────

export interface ReactiveModel extends FrontendModel {
  category: 'REACTIVE';
  reactivityPattern: string;
}

// ─────────────────────────────────────────────────────────────────────────
// MODEL 11 — REACTOR COMPONENTIUM
// ─────────────────────────────────────────────────────────────────────────

export const REACTOR_COMPONENTIUM: ReactiveModel = {
  id: 'REACTIVE-011',
  modelNumber: 11,
  latinName: 'Reactor Componentium',
  commonName: 'The Component Reactor',
  category: REACTIVE_CATEGORY,
  technology: 'React',
  description: 'React component lifecycle intelligence. Manages hooks orchestration, fiber reconciliation, Suspense boundaries, and concurrent rendering lanes.',
  costPerOp: { render: 0.002, reconcile: 0.004 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.90,
  connections: ['REACTIVE-017', 'RENDER-001'],
  phiAlignment: PHI * 0.94,
  reactivityPattern: 'VIRTUAL_DOM',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 12 — OBSERVATOR MUTATIONUM
// ─────────────────────────────────────────────────────────────────────────

export const OBSERVATOR_MUTATIONUM: ReactiveModel = {
  id: 'REACTIVE-012',
  modelNumber: 12,
  latinName: 'Observator Mutationum',
  commonName: 'The Mutation Observer',
  category: REACTIVE_CATEGORY,
  technology: 'Vue',
  description: 'Vue reactivity system intelligence. Governs Proxy-based dependency tracking, computed property caching, and watcher effect scheduling.',
  costPerOp: { observe: 0.002, mutate: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.88,
  connections: ['REACTIVE-011', 'REACTIVE-013'],
  phiAlignment: PHI * 0.92,
  reactivityPattern: 'PROXY_OBSERVATION',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 13 — COMPILATOR SIGNALORUM
// ─────────────────────────────────────────────────────────────────────────

export const COMPILATOR_SIGNALORUM: ReactiveModel = {
  id: 'REACTIVE-013',
  modelNumber: 13,
  latinName: 'Compilator Signalorum',
  commonName: 'The Signal Compiler',
  category: REACTIVE_CATEGORY,
  technology: 'Svelte',
  description: 'Svelte compile-time reactivity intelligence. Transforms declarative templates into surgical DOM updates at build time with zero runtime overhead.',
  costPerOp: { compile: 0.003, signal: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.92,
  connections: ['REACTIVE-012', 'REACTIVE-016'],
  phiAlignment: PHI * 0.96,
  reactivityPattern: 'COMPILE_TIME',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 14 — INJECTOR DEPENDENTIARUM
// ─────────────────────────────────────────────────────────────────────────

export const INJECTOR_DEPENDENTIARUM: ReactiveModel = {
  id: 'REACTIVE-014',
  modelNumber: 14,
  latinName: 'Injector Dependentiarum',
  commonName: 'The Dependency Injector',
  category: REACTIVE_CATEGORY,
  technology: 'Angular',
  description: 'Angular dependency injection and change detection intelligence. Manages hierarchical injectors, zone.js integration, and OnPush optimization strategies.',
  costPerOp: { inject: 0.002, detect: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.85,
  connections: ['REACTIVE-011', 'REACTIVE-015'],
  phiAlignment: PHI * 0.89,
  reactivityPattern: 'DEPENDENCY_INJECTION',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 15 — HYDRATOR SERVERIALIS
// ─────────────────────────────────────────────────────────────────────────

export const HYDRATOR_SERVERIALIS: ReactiveModel = {
  id: 'REACTIVE-015',
  modelNumber: 15,
  latinName: 'Hydrator Serverialis',
  commonName: 'The Server Hydrator',
  category: REACTIVE_CATEGORY,
  technology: 'Qwik',
  description: 'SSR hydration intelligence. Masters resumability over hydration, lazy-loads event handlers on interaction, and serializes component state to HTML.',
  costPerOp: { hydrate: 0.004, resume: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.87,
  connections: ['REACTIVE-014', 'REACTIVE-020'],
  phiAlignment: PHI * 0.91,
  reactivityPattern: 'RESUMABILITY',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 16 — SIGNALISTA GRANULOSUM
// ─────────────────────────────────────────────────────────────────────────

export const SIGNALISTA_GRANULOSUM: ReactiveModel = {
  id: 'REACTIVE-016',
  modelNumber: 16,
  latinName: 'Signalista Granulosum',
  commonName: 'The Granular Signaler',
  category: REACTIVE_CATEGORY,
  technology: 'Solid',
  description: 'SolidJS fine-grained reactivity intelligence. Manages signal-based dependency graphs, automatic batching, and synchronous glitch-free propagation.',
  costPerOp: { signal: 0.001, effect: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.93,
  connections: ['REACTIVE-013', 'REACTIVE-017'],
  phiAlignment: PHI * 0.97,
  reactivityPattern: 'FINE_GRAINED_SIGNALS',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 17 — FRAGMENTOR VIRTUALIS
// ─────────────────────────────────────────────────────────────────────────

export const FRAGMENTOR_VIRTUALIS: ReactiveModel = {
  id: 'REACTIVE-017',
  modelNumber: 17,
  latinName: 'Fragmentor Virtualis',
  commonName: 'The Virtual Fragmenter',
  category: REACTIVE_CATEGORY,
  technology: 'Preact',
  description: 'Preact/React virtual DOM diffing intelligence. Performs minimal tree diffs, manages fragment boundaries, and applies surgical DOM patches.',
  costPerOp: { diff: 0.002, patch: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.86,
  connections: ['REACTIVE-011', 'REACTIVE-016'],
  phiAlignment: PHI * 0.90,
  reactivityPattern: 'VIRTUAL_DOM_DIFF',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 18 — DECLARATOR ALPINUS
// ─────────────────────────────────────────────────────────────────────────

export const DECLARATOR_ALPINUS: ReactiveModel = {
  id: 'REACTIVE-018',
  modelNumber: 18,
  latinName: 'Declarator Alpinus',
  commonName: 'The Alpine Declarator',
  category: REACTIVE_CATEGORY,
  technology: 'Alpine',
  description: 'Alpine.js declarative binding intelligence. Manages x-data scopes, magic properties, lightweight reactivity, and progressive enhancement patterns.',
  costPerOp: { bind: 0.001, magic: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.80,
  connections: ['REACTIVE-019', 'RENDER-001'],
  phiAlignment: PHI * 0.84,
  reactivityPattern: 'DECLARATIVE_BINDING',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 19 — HYPERMEDIATOR TEXTUALIS
// ─────────────────────────────────────────────────────────────────────────

export const HYPERMEDIATOR_TEXTUALIS: ReactiveModel = {
  id: 'REACTIVE-019',
  modelNumber: 19,
  latinName: 'Hypermediator Textualis',
  commonName: 'The Hypermedia Mediator',
  category: REACTIVE_CATEGORY,
  technology: 'HTMX',
  description: 'HTMX server-driven UI intelligence. Manages HTML-over-the-wire patterns, swap strategies, trigger specifications, and out-of-band updates.',
  costPerOp: { swap: 0.001, trigger: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.78,
  connections: ['REACTIVE-018', 'RENDER-001'],
  phiAlignment: PHI * 0.82,
  reactivityPattern: 'HYPERMEDIA_DRIVEN',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 20 — ILLUMINATOR INSULARIS
// ─────────────────────────────────────────────────────────────────────────

export const ILLUMINATOR_INSULARIS: ReactiveModel = {
  id: 'REACTIVE-020',
  modelNumber: 20,
  latinName: 'Illuminator Insularis',
  commonName: 'The Island Illuminator',
  category: REACTIVE_CATEGORY,
  technology: 'Astro',
  description: 'Astro islands architecture intelligence. Orchestrates partial hydration, island isolation, client directive evaluation, and zero-JS-by-default rendering.',
  costPerOp: { island: 0.002, partial: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.89,
  connections: ['REACTIVE-015', 'RENDER-001'],
  phiAlignment: PHI * 0.93,
  reactivityPattern: 'ISLAND_ARCHITECTURE',
};

// ─────────────────────────────────────────────────────────────────────────
// COLLECTION & FACTORY
// ─────────────────────────────────────────────────────────────────────────

export const REACTIVE_MODELS: ReactiveModel[] = [
  REACTOR_COMPONENTIUM,
  OBSERVATOR_MUTATIONUM,
  COMPILATOR_SIGNALORUM,
  INJECTOR_DEPENDENTIARUM,
  HYDRATOR_SERVERIALIS,
  SIGNALISTA_GRANULOSUM,
  FRAGMENTOR_VIRTUALIS,
  DECLARATOR_ALPINUS,
  HYPERMEDIATOR_TEXTUALIS,
  ILLUMINATOR_INSULARIS,
];

export function createReactiveModel(overrides: Partial<ReactiveModel> & Pick<ReactiveModel, 'id' | 'modelNumber' | 'latinName' | 'commonName' | 'technology'>): ReactiveModel {
  return {
    category: REACTIVE_CATEGORY as 'REACTIVE',
    description: '',
    costPerOp: {},
    frequency: 12.67,
    status: 'DORMANT' as ModelStatus,
    autonomyLevel: 0.5,
    connections: [],
    phiAlignment: PHI * 0.85,
    reactivityPattern: 'CUSTOM',
    ...overrides,
  };
}

export function getReactiveModel(id: string): ReactiveModel | undefined {
  return REACTIVE_MODELS.find((m) => m.id === id);
}

export function getReactiveModelByNumber(num: number): ReactiveModel | undefined {
  return REACTIVE_MODELS.find((m) => m.modelNumber === num);
}

export function calculateReactiveCost(model: ReactiveModel, operation: string, count: number = 1): number {
  const unitCost = model.costPerOp[operation] ?? 0;
  return unitCost * count;
}

export function getTotalReactiveCost(): number {
  return REACTIVE_MODELS.reduce((sum, m) => {
    const opCosts = Object.values(m.costPerOp);
    return sum + opCosts.reduce((a, b) => a + b, 0);
  }, 0);
}
