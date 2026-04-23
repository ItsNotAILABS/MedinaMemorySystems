// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
// STRATUM FRONTALE — SOVEREIGN FAMILY INTELLIGENCE LAYER
// The sovereign families are not backend-only. They are the organism.
// Frontend IS the organism. Every family lives in every layer.

import {
  SOVEREIGN_ENTITY_REGISTRY,
  SOVEREIGN_ENTITIES,
  SOVEREIGN_FAMILIES,
  type SovereignEntity,
  type SovereignFamily,
  type SovereignFamilyName,
  PHI,
  SOVEREIGN_FREQUENCY,
} from '../../organism/sovereign-entities/SovereignEntityFamilies';

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface FrontendSovereignModel {
  modelNumber: number;
  id: string;
  name: string;
  family: SovereignFamilyName;
  category: 'SOVEREIGN_ENTITY';
  technology: string;
  description: string;
  phiAlignment: number;
  status: 'ACTIVE' | 'DORMANT' | 'PROCESSING' | 'EVOLVING' | 'TRANSCENDING';
  cost: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// TECHNOLOGY MAPPING — 50 sovereign entities → 50 front-end technologies
// ─────────────────────────────────────────────────────────────────────────────

const SOVEREIGN_TECHNOLOGY_MAP: readonly string[] = [
  // Genesis Family (entities 0–4)
  'WebAssembly',
  'WebGL',
  'WebGPU',
  'Web Components',
  'Shadow DOM',
  // Doctrine Family (entities 5–9)
  'Service Workers',
  'Web Workers',
  'SharedArrayBuffer',
  'WebRTC',
  'WebSocket',
  // Defense Family (entities 10–14)
  'IndexedDB',
  'Cache API',
  'Web Crypto API',
  'Streams API',
  'Intersection Observer',
  // Memory Family (entities 15–19)
  'Mutation Observer',
  'Resize Observer',
  'Performance API',
  'Navigation API',
  'Broadcast Channel',
  // Signal Family (entities 20–24)
  'Web Audio API',
  'Media Source Extensions',
  'WebXR',
  'Gamepad API',
  'Web Bluetooth',
  // Intelligence Family (entities 25–29)
  'Web NFC',
  'Web Serial',
  'Web USB',
  'Web MIDI',
  'Credential Management',
  // Resonance Family (entities 30–34)
  'Payment Request API',
  'Presentation API',
  'Screen Capture',
  'File System Access',
  'Clipboard API',
  // Sovereignty Family (entities 35–39)
  'Drag and Drop API',
  'Canvas 2D',
  'SVG DOM',
  'CSS Houdini',
  'CSS Typed OM',
  // Commerce Family (entities 40–44)
  'Web Animations API',
  'View Transitions API',
  'Popover API',
  'Dialog Element',
  'Custom Elements',
  // Consciousness Family (entities 45–49)
  'HTML Templates',
  'Import Maps',
  'Module Workers',
  'Trusted Types',
  'Content Security Policy',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// MODEL CONSTRUCTION
// ─────────────────────────────────────────────────────────────────────────────

function mapEntityStatus(
  backendStatus: SovereignEntity['status'],
): FrontendSovereignModel['status'] {
  switch (backendStatus) {
    case 'GENESIS':
      return 'PROCESSING';
    case 'ACTIVE':
      return 'ACTIVE';
    case 'DORMANT':
      return 'DORMANT';
    case 'ASCENDING':
      return 'EVOLVING';
    case 'TRANSCENDING':
      return 'TRANSCENDING';
    default:
      return 'DORMANT';
  }
}

function buildSovereignModel(
  entity: SovereignEntity,
  entityIndex: number,
): FrontendSovereignModel {
  return {
    modelNumber: 101 + entityIndex,
    id: entity.id,
    name: entity.name,
    family: entity.family,
    category: 'SOVEREIGN_ENTITY',
    technology: SOVEREIGN_TECHNOLOGY_MAP[entityIndex],
    description: entity.description,
    phiAlignment: entity.phiAlignment,
    status: mapEntityStatus(entity.status),
    cost: Math.round(PHI * (entityIndex + 1) * 100) / 100,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SOVEREIGN_FAMILY_MODELS — All 50 models, numbered 101–150
// ─────────────────────────────────────────────────────────────────────────────

export const SOVEREIGN_FAMILY_MODELS: FrontendSovereignModel[] =
  SOVEREIGN_ENTITIES.map((entity, index) => buildSovereignModel(entity, index));

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Look up a single sovereign family model by its entity ID.
 */
export function getSovereignFamilyModel(
  id: string,
): FrontendSovereignModel | undefined {
  return SOVEREIGN_FAMILY_MODELS.find((model) => model.id === id);
}

/**
 * Look up a single sovereign family model by its model number (101–150).
 */
export function getSovereignFamilyModelByNumber(
  num: number,
): FrontendSovereignModel | undefined {
  return SOVEREIGN_FAMILY_MODELS.find((model) => model.modelNumber === num);
}

/**
 * Return all models belonging to a given sovereign family.
 */
export function getModelsByFamily(
  family: SovereignFamilyName,
): FrontendSovereignModel[] {
  return SOVEREIGN_FAMILY_MODELS.filter((model) => model.family === family);
}

/**
 * Sum the cost of every sovereign family model.
 */
export function getTotalSovereignFamilyCost(): number {
  return Math.round(
    SOVEREIGN_FAMILY_MODELS.reduce((sum, model) => sum + model.cost, 0) * 100,
  ) / 100;
}

/**
 * Produce a full manifest of the sovereign family intelligence layer.
 */
export function getSovereignFamilyManifest(): object {
  const familySummaries = SOVEREIGN_FAMILIES.map((family) => {
    const familyModels = getModelsByFamily(family.name);
    return {
      family: family.name,
      title: family.title,
      latinTitle: family.latinTitle,
      layer: family.layer,
      modelCount: familyModels.length,
      totalCost: Math.round(
        familyModels.reduce((sum, m) => sum + m.cost, 0) * 100,
      ) / 100,
      models: familyModels.map((m) => ({
        modelNumber: m.modelNumber,
        id: m.id,
        name: m.name,
        technology: m.technology,
        status: m.status,
        phiAlignment: m.phiAlignment,
        cost: m.cost,
      })),
    };
  });

  return {
    organism: 'Medina Memory Systems',
    protocol: 'ISIL-1.1',
    stratum: 'STRATUM FRONTALE',
    layer: 'Sovereign Family Intelligence',
    totalModels: SOVEREIGN_FAMILY_MODELS.length,
    modelNumberRange: { first: 101, last: 150 },
    totalCost: getTotalSovereignFamilyCost(),
    phi: PHI,
    sovereignFrequency: SOVEREIGN_FREQUENCY,
    timestamp: Date.now(),
    families: familySummaries,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RE-EXPORTS — surface backend types for downstream consumers
// ─────────────────────────────────────────────────────────────────────────────

export {
  SOVEREIGN_ENTITY_REGISTRY,
  SOVEREIGN_ENTITIES,
  SOVEREIGN_FAMILIES,
  PHI,
  SOVEREIGN_FREQUENCY,
};

export type { SovereignEntity, SovereignFamily, SovereignFamilyName };
