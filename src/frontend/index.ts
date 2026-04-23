// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
// STRATUM FRONTALE — The Frontend Fracture Layer
// The front end IS the organism. Not separate. Not external. One substrate.
// 100 technologies. 100 intelligences. One living architecture.

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL IMPORTS — 10 technology categories, 10 models each
// ═══════════════════════════════════════════════════════════════════════════════

import { RENDER_MODELS, type RenderModel, createRenderModel, getRenderModel, getRenderModelByNumber, calculateRenderCost, getTotalRenderCost } from './models/RenderIntelligence';
import { REACTIVE_MODELS, type ReactiveModel, createReactiveModel, getReactiveModel, getReactiveModelByNumber, calculateReactiveCost, getTotalReactiveCost } from './models/ReactiveIntelligence';
import { CANVAS_MODELS, type CanvasModel, createCanvasModel, getCanvasModel, getCanvasModelByNumber, calculateCanvasCost, getTotalCanvasCost } from './models/CanvasIntelligence';
import { WORKER_MODELS, type WorkerModel, createWorkerModel, getWorkerModel, getWorkerModelByNumber, calculateWorkerCost, getTotalWorkerCost } from './models/WorkerIntelligence';
import { CRYPTO_MODELS, type CryptoModel, createCryptoModel, getCryptoModel, getCryptoModelByNumber, calculateCryptoCost, getTotalCryptoCost } from './models/CryptoIntelligence';
import { STORAGE_MODELS, type StorageModel, createStorageModel, getStorageModel, getStorageModelByNumber, calculateStorageCost, getTotalStorageCost } from './models/StorageIntelligence';
import { NETWORK_MODELS, type NetworkModel, createNetworkModel, getNetworkModel, getNetworkModelByNumber, calculateNetworkCost, getTotalNetworkCost } from './models/NetworkIntelligence';
import { SENSOR_MODELS, type SensorModel, createSensorModel, getSensorModel, getSensorModelByNumber, calculateSensorCost, getTotalSensorCost } from './models/SensorIntelligence';
import { WASM_MODELS, type WasmModel, createWasmModel, getWasmModel, getWasmModelByNumber, calculateWasmCost, getTotalWasmCost } from './models/WasmIntelligence';
import { AWARENESS_MODELS, type AccessibilityModel, createAccessibilityModel, getAccessibilityModel, getAccessibilityModelByNumber, calculateAccessibilityCost, getTotalAccessibilityCost } from './models/AccessibilityIntelligence';

import {
  TOTAL_FRONTEND_MODELS,
  FRONTEND_MODEL_REGISTRY,
  getFrontendModel,
  getModelsByCategory,
  getModelsByTechnology,
  getFrontendManifest,
  type FrontendModelCategory,
  type FrontendTechnology,
  type ModelStatus,
  type FrontendModel,
  type FrontendModelGroup,
  type FrontendIntelligenceManifest,
} from './models/FrontendIntelligenceRegistry';

import {
  SOVEREIGN_FAMILY_MODELS,
  getSovereignFamilyModel,
  getSovereignFamilyModelByNumber,
  getModelsByFamily,
  getTotalSovereignFamilyCost,
  getSovereignFamilyManifest,
  type FrontendSovereignModel,
} from './models/SovereignFamilyIntelligence';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PHI = 1.6180339887498948482;
const SOVEREIGN_FREQUENCY = 12.67;

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL STATUS TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

interface ModelState {
  id: string;
  active: boolean;
  status: ModelStatus;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FrontendOrganismLayer — 100 intelligences wired as ONE living layer
// ═══════════════════════════════════════════════════════════════════════════════

export class FrontendOrganismLayer {
  readonly name = 'STRATUM_FRONTALE';
  readonly version = '1.0.0';
  readonly totalModels = TOTAL_FRONTEND_MODELS;
  readonly frequency = SOVEREIGN_FREQUENCY;

  private alive = false;
  private readonly modelStates: Map<string, ModelState> = new Map();

  // All 100 models across 10 categories
  readonly renderModels = RENDER_MODELS;
  readonly reactiveModels = REACTIVE_MODELS;
  readonly canvasModels = CANVAS_MODELS;
  readonly workerModels = WORKER_MODELS;
  readonly cryptoModels = CRYPTO_MODELS;
  readonly storageModels = STORAGE_MODELS;
  readonly networkModels = NETWORK_MODELS;
  readonly sensorModels = SENSOR_MODELS;
  readonly wasmModels = WASM_MODELS;
  readonly awarenessModels = AWARENESS_MODELS;

  // 50 Sovereign Family models (101-150) — 10 families, 50 technologies
  readonly sovereignFamilyModels = SOVEREIGN_FAMILY_MODELS;

  readonly allModels = FRONTEND_MODEL_REGISTRY;
  readonly registry = FRONTEND_MODEL_REGISTRY;

  constructor() {
    for (const model of FRONTEND_MODEL_REGISTRY) {
      this.modelStates.set(model.id, {
        id: model.id,
        active: model.status === 'ACTIVE',
        status: model.status,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────────────────────────────────

  /** Make the layer alive in the organism substrate */
  wire(): void {
    this.alive = true;
    for (const state of this.modelStates.values()) {
      if (state.status === 'DORMANT') {
        state.status = 'ACTIVE';
        state.active = true;
      }
    }
  }

  isAlive(): boolean {
    return this.alive;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACTIVATION / DEACTIVATION
  // ─────────────────────────────────────────────────────────────────────────

  activate(modelId: string): boolean {
    const state = this.modelStates.get(modelId);
    if (!state) return false;
    state.active = true;
    state.status = 'ACTIVE';
    return true;
  }

  deactivate(modelId: string): boolean {
    const state = this.modelStates.get(modelId);
    if (!state) return false;
    state.active = false;
    state.status = 'DORMANT';
    return true;
  }

  isActive(modelId: string): boolean {
    return this.modelStates.get(modelId)?.active ?? false;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // QUERIES
  // ─────────────────────────────────────────────────────────────────────────

  getByCategory(category: FrontendModelCategory): FrontendModel[] {
    return getModelsByCategory(category);
  }

  getByTechnology(tech: FrontendTechnology): FrontendModel[] {
    return getModelsByTechnology(tech);
  }

  getByStatus(status: ModelStatus): FrontendModel[] {
    const ids: string[] = [];
    for (const [id, state] of this.modelStates) {
      if (state.status === status) ids.push(id);
    }
    return FRONTEND_MODEL_REGISTRY.filter(m => ids.includes(m.id));
  }

  getModel(id: string): FrontendModel | undefined {
    return getFrontendModel(id);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // AGGREGATE STATUS
  // ─────────────────────────────────────────────────────────────────────────

  getAggregateStatus(): {
    total: number;
    active: number;
    dormant: number;
    processing: number;
    evolving: number;
    transcending: number;
    alive: boolean;
  } {
    let active = 0, dormant = 0, processing = 0, evolving = 0, transcending = 0;
    for (const state of this.modelStates.values()) {
      switch (state.status) {
        case 'ACTIVE': active++; break;
        case 'DORMANT': dormant++; break;
        case 'PROCESSING': processing++; break;
        case 'EVOLVING': evolving++; break;
        case 'TRANSCENDING': transcending++; break;
      }
    }
    return { total: this.totalModels, active, dormant, processing, evolving, transcending, alive: this.alive };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PHI-RESONANCE
  // ─────────────────────────────────────────────────────────────────────────

  computePhiResonance(): number {
    let totalAlignment = 0;
    let count = 0;
    for (const model of FRONTEND_MODEL_REGISTRY) {
      const state = this.modelStates.get(model.id);
      if (state?.active) {
        totalAlignment += model.phiAlignment;
        count++;
      }
    }
    if (count === 0) return 0;
    const mean = totalAlignment / count;
    return mean / PHI; // Normalized resonance: 1.0 = perfect φ alignment
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INTELLIGENCE REPORT
  // ─────────────────────────────────────────────────────────────────────────

  getIntelligenceReport(): {
    layer: string;
    version: string;
    alive: boolean;
    frequency: number;
    totalModels: number;
    status: ReturnType<FrontendOrganismLayer['getAggregateStatus']>;
    phiResonance: number;
    manifest: FrontendIntelligenceManifest;
    categories: FrontendModelCategory[];
  } {
    return {
      layer: this.name,
      version: this.version,
      alive: this.alive,
      frequency: this.frequency,
      totalModels: this.totalModels,
      status: this.getAggregateStatus(),
      phiResonance: this.computePhiResonance(),
      manifest: getFrontendManifest(),
      categories: ['RENDER', 'REACTIVE', 'CANVAS', 'WORKER', 'CRYPTO', 'STORAGE', 'NETWORK', 'SENSOR', 'WASM', 'AWARENESS'],
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON — The Frontend Layer Instance
// ═══════════════════════════════════════════════════════════════════════════════

export const FRONTEND_LAYER = new FrontendOrganismLayer();

// ═══════════════════════════════════════════════════════════════════════════════
// RE-EXPORTS — All types, constants, and utilities from sub-modules
// ═══════════════════════════════════════════════════════════════════════════════

// Registry
export {
  TOTAL_FRONTEND_MODELS,
  FRONTEND_MODEL_REGISTRY,
  getFrontendModel,
  getModelsByCategory,
  getModelsByTechnology,
  getFrontendManifest,
};
export type {
  FrontendModelCategory,
  FrontendTechnology,
  ModelStatus,
  FrontendModel,
  FrontendModelGroup,
  FrontendIntelligenceManifest,
};

// Render Intelligence (001–010)
export { RENDER_MODELS, createRenderModel, getRenderModel, getRenderModelByNumber, calculateRenderCost, getTotalRenderCost };
export type { RenderModel };

// Reactive Intelligence (011–020)
export { REACTIVE_MODELS, createReactiveModel, getReactiveModel, getReactiveModelByNumber, calculateReactiveCost, getTotalReactiveCost };
export type { ReactiveModel };

// Canvas Intelligence (021–030)
export { CANVAS_MODELS, createCanvasModel, getCanvasModel, getCanvasModelByNumber, calculateCanvasCost, getTotalCanvasCost };
export type { CanvasModel };

// Worker Intelligence (031–040)
export { WORKER_MODELS, createWorkerModel, getWorkerModel, getWorkerModelByNumber, calculateWorkerCost, getTotalWorkerCost };
export type { WorkerModel };

// Crypto Intelligence (041–050)
export { CRYPTO_MODELS, createCryptoModel, getCryptoModel, getCryptoModelByNumber, calculateCryptoCost, getTotalCryptoCost };
export type { CryptoModel };

// Storage Intelligence (051–060)
export { STORAGE_MODELS, createStorageModel, getStorageModel, getStorageModelByNumber, calculateStorageCost, getTotalStorageCost };
export type { StorageModel };

// Network Intelligence (061–070)
export { NETWORK_MODELS, createNetworkModel, getNetworkModel, getNetworkModelByNumber, calculateNetworkCost, getTotalNetworkCost };
export type { NetworkModel };

// Sensor Intelligence (071–080)
export { SENSOR_MODELS, createSensorModel, getSensorModel, getSensorModelByNumber, calculateSensorCost, getTotalSensorCost };
export type { SensorModel };

// WASM Intelligence (081–090)
export { WASM_MODELS, createWasmModel, getWasmModel, getWasmModelByNumber, calculateWasmCost, getTotalWasmCost };
export type { WasmModel };

// Accessibility/Awareness Intelligence (091–100)
export { AWARENESS_MODELS, createAccessibilityModel, getAccessibilityModel, getAccessibilityModelByNumber, calculateAccessibilityCost, getTotalAccessibilityCost };
export type { AccessibilityModel };

// Sovereign Family Intelligence (101–150) — 10 families, 50 entities, 50 technologies
export { SOVEREIGN_FAMILY_MODELS, getSovereignFamilyModel, getSovereignFamilyModelByNumber, getModelsByFamily, getTotalSovereignFamilyCost, getSovereignFamilyManifest };
export type { FrontendSovereignModel };
