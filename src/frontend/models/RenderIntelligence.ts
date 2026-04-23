// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * RENDER INTELLIGENCE — DOM/HTML/CSS Rendering Intelligence
 * ─────────────────────────────────────────────────────────────────────────
 * 10 Models (1-10) — Frontend rendering pipeline intelligence
 *
 * From document construction to GPU compositing, these models govern
 * every visual atom that reaches the user's viewport.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { FrontendModel, FrontendModelCategory, ModelStatus } from './FrontendIntelligenceRegistry';

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────

const RENDER_CATEGORY: FrontendModelCategory = 'RENDER';
const PHI = 1.6180339887498948482;

// ─────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────

export interface RenderModel extends FrontendModel {
  category: 'RENDER';
  renderPipeline: string;
}

// ─────────────────────────────────────────────────────────────────────────
// MODEL 1 — PICTOR DOCUMENTORUM
// ─────────────────────────────────────────────────────────────────────────

export const PICTOR_DOCUMENTORUM: RenderModel = {
  id: 'RENDER-001',
  modelNumber: 1,
  latinName: 'Pictor Documentorum',
  commonName: 'The Document Painter',
  category: RENDER_CATEGORY,
  technology: 'HTML5',
  description: 'HTML5 DOM tree construction intelligence. Parses markup into living document trees, manages node creation, attribute binding, and tree reconciliation.',
  costPerOp: { render: 0.001, compose: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.85,
  connections: ['RENDER-002', 'RENDER-003'],
  phiAlignment: PHI * 0.92,
  renderPipeline: 'DOM_CONSTRUCTION',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 2 — SCULPTOR STILORUM
// ─────────────────────────────────────────────────────────────────────────

export const SCULPTOR_STILORUM: RenderModel = {
  id: 'RENDER-002',
  modelNumber: 2,
  latinName: 'Sculptor Stilorum',
  commonName: 'The Style Sculptor',
  category: RENDER_CATEGORY,
  technology: 'CSS3',
  description: 'CSS cascade intelligence and computed style resolution. Resolves specificity wars, manages inheritance chains, and computes final style values.',
  costPerOp: { style: 0.001, cascade: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.88,
  connections: ['RENDER-001', 'RENDER-005'],
  phiAlignment: PHI * 0.95,
  renderPipeline: 'STYLE_RESOLUTION',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 3 — ARCHITECTUS COMPONENTIUM
// ─────────────────────────────────────────────────────────────────────────

export const ARCHITECTUS_COMPONENTIUM: RenderModel = {
  id: 'RENDER-003',
  modelNumber: 3,
  latinName: 'Architectus Componentium',
  commonName: 'The Component Architect',
  category: RENDER_CATEGORY,
  technology: 'WebComponents',
  description: 'Web Components shadow DOM builder. Constructs encapsulated component trees with shadow boundaries, slot distribution, and custom element registration.',
  costPerOp: { define: 0.002, attach: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.82,
  connections: ['RENDER-001', 'RENDER-004'],
  phiAlignment: PHI * 0.90,
  renderPipeline: 'SHADOW_DOM',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 4 — ANIMATOR MOTUUM
// ─────────────────────────────────────────────────────────────────────────

export const ANIMATOR_MOTUUM: RenderModel = {
  id: 'RENDER-004',
  modelNumber: 4,
  latinName: 'Animator Motuum',
  commonName: 'The Motion Animator',
  category: RENDER_CATEGORY,
  technology: 'Web_Animations',
  description: 'CSS/Web Animations API motion intelligence. Orchestrates keyframe sequences, manages animation timelines, and synchronizes multi-element choreography.',
  costPerOp: { animate: 0.002, keyframe: 0.004 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.80,
  connections: ['RENDER-006', 'RENDER-010'],
  phiAlignment: PHI * 0.88,
  renderPipeline: 'ANIMATION',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 5 — TYPOGRAPHUS SIGNORUM
// ─────────────────────────────────────────────────────────────────────────

export const TYPOGRAPHUS_SIGNORUM: RenderModel = {
  id: 'RENDER-005',
  modelNumber: 5,
  latinName: 'Typographus Signorum',
  commonName: 'The Typography Master',
  category: RENDER_CATEGORY,
  technology: 'CSS3',
  description: 'Font rendering, text layout, and glyph intelligence. Masters font loading strategies, kerning pairs, ligature substitution, and variable font axis interpolation.',
  costPerOp: { layout: 0.001, kern: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.86,
  connections: ['RENDER-002', 'RENDER-006'],
  phiAlignment: PHI * 0.93,
  renderPipeline: 'TEXT_LAYOUT',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 6 — COMPOSITOR STRATORUM
// ─────────────────────────────────────────────────────────────────────────

export const COMPOSITOR_STRATORUM: RenderModel = {
  id: 'RENDER-006',
  modelNumber: 6,
  latinName: 'Compositor Stratorum',
  commonName: 'The Layer Compositor',
  category: RENDER_CATEGORY,
  technology: 'CSS_Houdini',
  description: 'GPU compositing and z-index stacking intelligence. Manages layer promotion, paint worklets, compositor threads, and stacking context resolution.',
  costPerOp: { composite: 0.003, promote: 0.005 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.78,
  connections: ['RENDER-004', 'RENDER-005'],
  phiAlignment: PHI * 0.87,
  renderPipeline: 'GPU_COMPOSITING',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 7 — VECTOR LINEAMENTORUM
// ─────────────────────────────────────────────────────────────────────────

export const VECTOR_LINEAMENTORUM: RenderModel = {
  id: 'RENDER-007',
  modelNumber: 7,
  latinName: 'Vector Lineamentorum',
  commonName: 'The Vector Artist',
  category: RENDER_CATEGORY,
  technology: 'SVG',
  description: 'SVG path rendering and clip-path intelligence. Computes Bézier curves, manages viewBox transformations, and orchestrates SVG filter pipelines.',
  costPerOp: { draw: 0.002, clip: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.84,
  connections: ['RENDER-001', 'RENDER-006'],
  phiAlignment: PHI * 0.91,
  renderPipeline: 'VECTOR_RENDERING',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 8 — NAVIGATOR FOCORUM
// ─────────────────────────────────────────────────────────────────────────

export const NAVIGATOR_FOCORUM: RenderModel = {
  id: 'RENDER-008',
  modelNumber: 8,
  latinName: 'Navigator Focorum',
  commonName: 'The Focus Navigator',
  category: RENDER_CATEGORY,
  technology: 'FocusManagement',
  description: 'Focus management and tab order intelligence. Governs focus trapping, roving tabindex patterns, focus-visible heuristics, and spatial navigation.',
  costPerOp: { focus: 0.001, trap: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.90,
  connections: ['RENDER-009', 'RENDER-001'],
  phiAlignment: PHI * 0.94,
  renderPipeline: 'FOCUS_MANAGEMENT',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 9 — TABULARIUS FORMULARUM
// ─────────────────────────────────────────────────────────────────────────

export const TABULARIUS_FORMULARUM: RenderModel = {
  id: 'RENDER-009',
  modelNumber: 9,
  latinName: 'Tabularius Formularum',
  commonName: 'The Form Master',
  category: RENDER_CATEGORY,
  technology: 'HTML5',
  description: 'Form validation and input masking intelligence. Manages constraint validation API, custom validity states, input formatting, and multi-step form orchestration.',
  costPerOp: { validate: 0.001, mask: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.87,
  connections: ['RENDER-008', 'RENDER-001'],
  phiAlignment: PHI * 0.89,
  renderPipeline: 'FORM_VALIDATION',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 10 — SCRIPTOR TRANSITIONUM
// ─────────────────────────────────────────────────────────────────────────

export const SCRIPTOR_TRANSITIONUM: RenderModel = {
  id: 'RENDER-010',
  modelNumber: 10,
  latinName: 'Scriptor Transitionum',
  commonName: 'The Transition Scriptor',
  category: RENDER_CATEGORY,
  technology: 'CSS3',
  description: 'CSS transition and animation orchestration. Scripts complex transition sequences, manages view transition API choreography, and coordinates cross-element timing.',
  costPerOp: { transition: 0.002, orchestrate: 0.004 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.83,
  connections: ['RENDER-004', 'RENDER-006'],
  phiAlignment: PHI * 0.86,
  renderPipeline: 'TRANSITION_ORCHESTRATION',
};

// ─────────────────────────────────────────────────────────────────────────
// COLLECTION & FACTORY
// ─────────────────────────────────────────────────────────────────────────

export const RENDER_MODELS: RenderModel[] = [
  PICTOR_DOCUMENTORUM,
  SCULPTOR_STILORUM,
  ARCHITECTUS_COMPONENTIUM,
  ANIMATOR_MOTUUM,
  TYPOGRAPHUS_SIGNORUM,
  COMPOSITOR_STRATORUM,
  VECTOR_LINEAMENTORUM,
  NAVIGATOR_FOCORUM,
  TABULARIUS_FORMULARUM,
  SCRIPTOR_TRANSITIONUM,
];

export function createRenderModel(overrides: Partial<RenderModel> & Pick<RenderModel, 'id' | 'modelNumber' | 'latinName' | 'commonName' | 'technology'>): RenderModel {
  return {
    category: RENDER_CATEGORY as 'RENDER',
    description: '',
    costPerOp: {},
    frequency: 12.67,
    status: 'DORMANT' as ModelStatus,
    autonomyLevel: 0.5,
    connections: [],
    phiAlignment: PHI * 0.85,
    renderPipeline: 'CUSTOM',
    ...overrides,
  };
}

export function getRenderModel(id: string): RenderModel | undefined {
  return RENDER_MODELS.find((m) => m.id === id);
}

export function getRenderModelByNumber(num: number): RenderModel | undefined {
  return RENDER_MODELS.find((m) => m.modelNumber === num);
}

export function calculateRenderCost(model: RenderModel, operation: string, count: number = 1): number {
  const unitCost = model.costPerOp[operation] ?? 0;
  return unitCost * count;
}

export function getTotalRenderCost(): number {
  return RENDER_MODELS.reduce((sum, m) => {
    const opCosts = Object.values(m.costPerOp);
    return sum + opCosts.reduce((a, b) => a + b, 0);
  }, 0);
}
