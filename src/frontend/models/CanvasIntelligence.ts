// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * CANVAS INTELLIGENCE — Visual/Graphics Intelligence
 * ─────────────────────────────────────────────────────────────────────────
 * 10 Models (21-30) — Canvas, WebGL, WebGPU, and immersive rendering
 *
 * From pixel-level 2D painting to full 3D world construction,
 * these models command every visual dimension the browser can render.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { FrontendModel, FrontendModelCategory, ModelStatus } from './FrontendIntelligenceRegistry';

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────

const CANVAS_CATEGORY: FrontendModelCategory = 'CANVAS';
const PHI = 1.6180339887498948482;

// ─────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────

export interface CanvasModel extends FrontendModel {
  category: 'CANVAS';
  renderingContext: string;
}

// ─────────────────────────────────────────────────────────────────────────
// MODEL 21 — PICTOR PIXELORUM
// ─────────────────────────────────────────────────────────────────────────

export const PICTOR_PIXELORUM: CanvasModel = {
  id: 'CANVAS-021',
  modelNumber: 21,
  latinName: 'Pictor Pixelorum',
  commonName: 'The Pixel Painter',
  category: CANVAS_CATEGORY,
  technology: 'Canvas2D',
  description: 'Canvas 2D rendering intelligence. Masters pixel manipulation, path drawing, gradient fills, image compositing, and offscreen canvas operations.',
  costPerOp: { draw: 0.002, clear: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.85,
  connections: ['CANVAS-022', 'RENDER-007'],
  phiAlignment: PHI * 0.90,
  renderingContext: '2D',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 22 — SCULPTOR TRIANGULORUM
// ─────────────────────────────────────────────────────────────────────────

export const SCULPTOR_TRIANGULORUM: CanvasModel = {
  id: 'CANVAS-022',
  modelNumber: 22,
  latinName: 'Sculptor Triangulorum',
  commonName: 'The Triangle Sculptor',
  category: CANVAS_CATEGORY,
  technology: 'WebGL',
  description: 'WebGL mesh rendering intelligence. Manages vertex buffer construction, shader program linking, texture binding, and draw call optimization.',
  costPerOp: { render: 0.005, shade: 0.008 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.82,
  connections: ['CANVAS-021', 'CANVAS-029'],
  phiAlignment: PHI * 0.88,
  renderingContext: 'WEBGL',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 23 — COMPUTATOR PARALLELI
// ─────────────────────────────────────────────────────────────────────────

export const COMPUTATOR_PARALLELI: CanvasModel = {
  id: 'CANVAS-023',
  modelNumber: 23,
  latinName: 'Computator Paralleli',
  commonName: 'The Parallel Computator',
  category: CANVAS_CATEGORY,
  technology: 'WebGPU',
  description: 'WebGPU compute shader intelligence. Orchestrates GPU compute pipelines, buffer mapping, workgroup dispatches, and parallel data processing.',
  costPerOp: { compute: 0.010, dispatch: 0.005 },
  frequency: 12.67,
  status: 'EVOLVING' as ModelStatus,
  autonomyLevel: 0.75,
  connections: ['CANVAS-022', 'CANVAS-029'],
  phiAlignment: PHI * 0.85,
  renderingContext: 'WEBGPU',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 24 — SCAENOGRAPHUS TRIDIMENSIONALIS
// ─────────────────────────────────────────────────────────────────────────

export const SCAENOGRAPHUS_TRIDIMENSIONALIS: CanvasModel = {
  id: 'CANVAS-024',
  modelNumber: 24,
  latinName: 'Scaenographus Tridimensionalis',
  commonName: 'The 3D Stage Director',
  category: CANVAS_CATEGORY,
  technology: 'ThreeJS',
  description: 'Three.js scene management intelligence. Manages scene graphs, camera rigs, lighting setups, material systems, and post-processing effect chains.',
  costPerOp: { scene: 0.004, camera: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.88,
  connections: ['CANVAS-022', 'CANVAS-027'],
  phiAlignment: PHI * 0.93,
  renderingContext: 'THREEJS',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 25 — CARTOGRAPHUS DATORUM
// ─────────────────────────────────────────────────────────────────────────

export const CARTOGRAPHUS_DATORUM: CanvasModel = {
  id: 'CANVAS-025',
  modelNumber: 25,
  latinName: 'Cartographus Datorum',
  commonName: 'The Data Cartographer',
  category: CANVAS_CATEGORY,
  technology: 'D3',
  description: 'D3.js data visualization intelligence. Binds data to visual elements, manages enter/update/exit selections, and orchestrates animated transitions.',
  costPerOp: { bindData: 0.003, transition: 0.004 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.86,
  connections: ['CANVAS-021', 'RENDER-007'],
  phiAlignment: PHI * 0.91,
  renderingContext: 'SVG_CANVAS',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 26 — TEXTOR SPRITEORUM
// ─────────────────────────────────────────────────────────────────────────

export const TEXTOR_SPRITEORUM: CanvasModel = {
  id: 'CANVAS-026',
  modelNumber: 26,
  latinName: 'Textor Spriteorum',
  commonName: 'The Sprite Weaver',
  category: CANVAS_CATEGORY,
  technology: 'Pixi',
  description: 'PixiJS sprite rendering intelligence. Masters sprite batching, texture atlases, blend modes, particle systems, and display list optimization.',
  costPerOp: { sprite: 0.002, batch: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.84,
  connections: ['CANVAS-021', 'CANVAS-022'],
  phiAlignment: PHI * 0.89,
  renderingContext: 'WEBGL_2D',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 27 — CONSTRUCTOR MUNDORUM
// ─────────────────────────────────────────────────────────────────────────

export const CONSTRUCTOR_MUNDORUM: CanvasModel = {
  id: 'CANVAS-027',
  modelNumber: 27,
  latinName: 'Constructor Mundorum',
  commonName: 'The World Builder',
  category: CANVAS_CATEGORY,
  technology: 'Babylon',
  description: 'BabylonJS world construction intelligence. Builds 3D worlds with physics engines, terrain generation, LOD management, and multiplayer scene sync.',
  costPerOp: { world: 0.006, physics: 0.008 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.80,
  connections: ['CANVAS-024', 'CANVAS-030'],
  phiAlignment: PHI * 0.87,
  renderingContext: 'BABYLON',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 28 — GEOGRAPHUS DIGITALIS
// ─────────────────────────────────────────────────────────────────────────

export const GEOGRAPHUS_DIGITALIS: CanvasModel = {
  id: 'CANVAS-028',
  modelNumber: 28,
  latinName: 'Geographus Digitalis',
  commonName: 'The Digital Geographer',
  category: CANVAS_CATEGORY,
  technology: 'Leaflet',
  description: 'Leaflet/Mapbox mapping intelligence. Manages tile layers, GeoJSON rendering, marker clustering, and spatial data projection transformations.',
  costPerOp: { tile: 0.002, layer: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.83,
  connections: ['CANVAS-025', 'CANVAS-021'],
  phiAlignment: PHI * 0.86,
  renderingContext: 'MAP_TILES',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 29 — SHADER LUMINARIS
// ─────────────────────────────────────────────────────────────────────────

export const SHADER_LUMINARIS: CanvasModel = {
  id: 'CANVAS-029',
  modelNumber: 29,
  latinName: 'Shader Luminaris',
  commonName: 'The Light Shader',
  category: CANVAS_CATEGORY,
  technology: 'GLSL',
  description: 'GLSL shader programming intelligence. Authors vertex and fragment shaders, manages uniform binding, and implements lighting models and visual effects.',
  costPerOp: { vertex: 0.004, fragment: 0.006 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.79,
  connections: ['CANVAS-022', 'CANVAS-023'],
  phiAlignment: PHI * 0.84,
  renderingContext: 'SHADER',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 30 — IMMERSUS DIMENSIONALIS
// ─────────────────────────────────────────────────────────────────────────

export const IMMERSUS_DIMENSIONALIS: CanvasModel = {
  id: 'CANVAS-030',
  modelNumber: 30,
  latinName: 'Immersus Dimensionalis',
  commonName: 'The Dimensional Immerser',
  category: CANVAS_CATEGORY,
  technology: 'WebXR',
  description: 'WebXR immersive rendering intelligence. Manages XR sessions, reference spaces, hand tracking, hit testing, and stereoscopic frame rendering.',
  costPerOp: { present: 0.008, track: 0.005 },
  frequency: 12.67,
  status: 'EVOLVING' as ModelStatus,
  autonomyLevel: 0.72,
  connections: ['CANVAS-027', 'CANVAS-024'],
  phiAlignment: PHI * 0.80,
  renderingContext: 'IMMERSIVE_XR',
};

// ─────────────────────────────────────────────────────────────────────────
// COLLECTION & FACTORY
// ─────────────────────────────────────────────────────────────────────────

export const CANVAS_MODELS: CanvasModel[] = [
  PICTOR_PIXELORUM,
  SCULPTOR_TRIANGULORUM,
  COMPUTATOR_PARALLELI,
  SCAENOGRAPHUS_TRIDIMENSIONALIS,
  CARTOGRAPHUS_DATORUM,
  TEXTOR_SPRITEORUM,
  CONSTRUCTOR_MUNDORUM,
  GEOGRAPHUS_DIGITALIS,
  SHADER_LUMINARIS,
  IMMERSUS_DIMENSIONALIS,
];

export function createCanvasModel(overrides: Partial<CanvasModel> & Pick<CanvasModel, 'id' | 'modelNumber' | 'latinName' | 'commonName' | 'technology'>): CanvasModel {
  return {
    category: CANVAS_CATEGORY as 'CANVAS',
    description: '',
    costPerOp: {},
    frequency: 12.67,
    status: 'DORMANT' as ModelStatus,
    autonomyLevel: 0.5,
    connections: [],
    phiAlignment: PHI * 0.85,
    renderingContext: 'CUSTOM',
    ...overrides,
  };
}

export function getCanvasModel(id: string): CanvasModel | undefined {
  return CANVAS_MODELS.find((m) => m.id === id);
}

export function getCanvasModelByNumber(num: number): CanvasModel | undefined {
  return CANVAS_MODELS.find((m) => m.modelNumber === num);
}

export function calculateCanvasCost(model: CanvasModel, operation: string, count: number = 1): number {
  const unitCost = model.costPerOp[operation] ?? 0;
  return unitCost * count;
}

export function getTotalCanvasCost(): number {
  return CANVAS_MODELS.reduce((sum, m) => {
    const opCosts = Object.values(m.costPerOp);
    return sum + opCosts.reduce((a, b) => a + b, 0);
  }, 0);
}
