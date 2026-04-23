// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * SENSOR INTELLIGENCE — Device/Browser Sensor Intelligence
 * ─────────────────────────────────────────────────────────────────────────
 * 10 Models (71-80) — Device and browser sensor intelligence
 *
 * From geolocation to DOM mutation observation, these models govern
 * every sensory input the browser can perceive from the physical world.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { FrontendModel, FrontendModelCategory, ModelStatus } from './FrontendIntelligenceRegistry';

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────

const SENSOR_CATEGORY: FrontendModelCategory = 'SENSOR';
const PHI = 1.6180339887498948482;

// ─────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────

export interface SensorModel extends FrontendModel {
  category: 'SENSOR';
  sensorType: string;
}

// ─────────────────────────────────────────────────────────────────────────
// MODEL 71 — LOCATOR GEOGRAPHICUS
// ─────────────────────────────────────────────────────────────────────────

export const LOCATOR_GEOGRAPHICUS: SensorModel = {
  id: 'SENSOR-071',
  modelNumber: 71,
  latinName: 'Locator Geographicus',
  commonName: 'The Geographic Locator',
  category: SENSOR_CATEGORY,
  technology: 'Geolocation',
  description: 'Geolocation API intelligence. Acquires device coordinates via GPS/network triangulation with accuracy negotiation and continuous watch positioning.',
  costPerOp: { locate: 0.003, watch: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.82,
  connections: ['SENSOR-072', 'SENSOR-078'],
  phiAlignment: PHI * 0.91,
  sensorType: 'GEOLOCATION',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 72 — SENSOR MOTUUM
// ─────────────────────────────────────────────────────────────────────────

export const SENSOR_MOTUUM: SensorModel = {
  id: 'SENSOR-072',
  modelNumber: 72,
  latinName: 'Sensor Motuum',
  commonName: 'The Motion Sensor',
  category: SENSOR_CATEGORY,
  technology: 'DeviceMotion',
  description: 'DeviceMotion and DeviceOrientation intelligence. Reads accelerometer, gyroscope, and compass data for tilt, shake, and rotation detection.',
  costPerOp: { sense: 0.001, calibrate: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.78,
  connections: ['SENSOR-071', 'SENSOR-073'],
  phiAlignment: PHI * 0.88,
  sensorType: 'DEVICE_MOTION',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 73 — CONTROLLER LUDICORUM
// ─────────────────────────────────────────────────────────────────────────

export const CONTROLLER_LUDICORUM: SensorModel = {
  id: 'SENSOR-073',
  modelNumber: 73,
  latinName: 'Controller Ludicorum',
  commonName: 'The Game Controller',
  category: SENSOR_CATEGORY,
  technology: 'Gamepad',
  description: 'Gamepad API intelligence. Polls connected game controllers, maps axes and buttons, and normalizes input across vendor-specific HID layouts.',
  costPerOp: { poll: 0.001, map: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.75,
  connections: ['SENSOR-072', 'SENSOR-074'],
  phiAlignment: PHI * 0.86,
  sensorType: 'GAMEPAD',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 74 — CONNECTOR BLUETOOTHII
// ─────────────────────────────────────────────────────────────────────────

export const CONNECTOR_BLUETOOTHII: SensorModel = {
  id: 'SENSOR-074',
  modelNumber: 74,
  latinName: 'Connector Bluetoothii',
  commonName: 'The Bluetooth Connector',
  category: SENSOR_CATEGORY,
  technology: 'WebBluetooth',
  description: 'Web Bluetooth scanning and connection intelligence. Discovers BLE peripherals, negotiates GATT services, and reads/writes characteristic values.',
  costPerOp: { scan: 0.004, pair: 0.005 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.80,
  connections: ['SENSOR-073', 'SENSOR-075'],
  phiAlignment: PHI * 0.89,
  sensorType: 'BLUETOOTH',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 75 — CONNECTOR UNIVERSALIS
// ─────────────────────────────────────────────────────────────────────────

export const CONNECTOR_UNIVERSALIS: SensorModel = {
  id: 'SENSOR-075',
  modelNumber: 75,
  latinName: 'Connector Universalis',
  commonName: 'The Universal Connector',
  category: SENSOR_CATEGORY,
  technology: 'WebUSB',
  description: 'WebUSB device intelligence. Claims USB interfaces, performs control/bulk/interrupt transfers, and manages device lifecycle across connection events.',
  costPerOp: { claim: 0.003, transfer: 0.004 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.79,
  connections: ['SENSOR-074', 'SENSOR-076'],
  phiAlignment: PHI * 0.87,
  sensorType: 'USB',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 76 — AUDITOR SONORUM
// ─────────────────────────────────────────────────────────────────────────

export const AUDITOR_SONORUM: SensorModel = {
  id: 'SENSOR-076',
  modelNumber: 76,
  latinName: 'Auditor Sonorum',
  commonName: 'The Sound Listener',
  category: SENSOR_CATEGORY,
  technology: 'WebAudio',
  description: 'Web Audio API intelligence. Captures microphone input, builds audio processing graphs, and performs real-time frequency/time-domain analysis.',
  costPerOp: { capture: 0.003, analyze: 0.005 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.84,
  connections: ['SENSOR-075', 'SENSOR-077'],
  phiAlignment: PHI * 0.90,
  sensorType: 'AUDIO',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 77 — INTERPRES VOCIS
// ─────────────────────────────────────────────────────────────────────────

export const INTERPRES_VOCIS: SensorModel = {
  id: 'SENSOR-077',
  modelNumber: 77,
  latinName: 'Interpres Vocis',
  commonName: 'The Voice Interpreter',
  category: SENSOR_CATEGORY,
  technology: 'SpeechAPI',
  description: 'Speech Recognition and Synthesis intelligence. Transcribes spoken words to text and generates natural-sounding speech from textual input.',
  costPerOp: { recognize: 0.005, synthesize: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.86,
  connections: ['SENSOR-076', 'SENSOR-078'],
  phiAlignment: PHI * 0.92,
  sensorType: 'SPEECH',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 78 — OBSERVATOR INTERSECTIONIS
// ─────────────────────────────────────────────────────────────────────────

export const OBSERVATOR_INTERSECTIONIS: SensorModel = {
  id: 'SENSOR-078',
  modelNumber: 78,
  latinName: 'Observator Intersectionis',
  commonName: 'The Intersection Watcher',
  category: SENSOR_CATEGORY,
  technology: 'IntersectionObserver',
  description: 'IntersectionObserver intelligence. Watches element visibility against viewport or ancestor boundaries and fires callbacks at configurable thresholds.',
  costPerOp: { observe: 0.001, threshold: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.88,
  connections: ['SENSOR-071', 'SENSOR-079'],
  phiAlignment: PHI * 0.93,
  sensorType: 'INTERSECTION',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 79 — OBSERVATOR DIMENSIONUM
// ─────────────────────────────────────────────────────────────────────────

export const OBSERVATOR_DIMENSIONUM: SensorModel = {
  id: 'SENSOR-079',
  modelNumber: 79,
  latinName: 'Observator Dimensionum',
  commonName: 'The Dimension Watcher',
  category: SENSOR_CATEGORY,
  technology: 'ResizeObserver',
  description: 'ResizeObserver intelligence. Tracks element dimension changes with border-box and content-box reporting for responsive layout adaptation.',
  costPerOp: { observe: 0.001, measure: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.87,
  connections: ['SENSOR-078', 'SENSOR-080'],
  phiAlignment: PHI * 0.92,
  sensorType: 'RESIZE',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 80 — OBSERVATOR MUTATIONUM
// ─────────────────────────────────────────────────────────────────────────

export const OBSERVATOR_MUTATIONUM: SensorModel = {
  id: 'SENSOR-080',
  modelNumber: 80,
  latinName: 'Observator Mutationum',
  commonName: 'The DOM Mutation Watcher',
  category: SENSOR_CATEGORY,
  technology: 'MutationObserver',
  description: 'MutationObserver intelligence. Observes DOM subtree modifications including attribute changes, child list mutations, and character data updates.',
  costPerOp: { observe: 0.001, filter: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.86,
  connections: ['SENSOR-078', 'SENSOR-079'],
  phiAlignment: PHI * 0.91,
  sensorType: 'MUTATION',
};

// ─────────────────────────────────────────────────────────────────────────
// COLLECTION & FACTORY
// ─────────────────────────────────────────────────────────────────────────

export const SENSOR_MODELS: SensorModel[] = [
  LOCATOR_GEOGRAPHICUS,
  SENSOR_MOTUUM,
  CONTROLLER_LUDICORUM,
  CONNECTOR_BLUETOOTHII,
  CONNECTOR_UNIVERSALIS,
  AUDITOR_SONORUM,
  INTERPRES_VOCIS,
  OBSERVATOR_INTERSECTIONIS,
  OBSERVATOR_DIMENSIONUM,
  OBSERVATOR_MUTATIONUM,
];

export function createSensorModel(overrides: Partial<SensorModel> & Pick<SensorModel, 'id' | 'modelNumber' | 'latinName' | 'commonName' | 'technology'>): SensorModel {
  return {
    category: SENSOR_CATEGORY as 'SENSOR',
    description: '',
    costPerOp: {},
    frequency: 12.67,
    status: 'DORMANT' as ModelStatus,
    autonomyLevel: 0.5,
    connections: [],
    phiAlignment: PHI * 0.85,
    sensorType: 'CUSTOM',
    ...overrides,
  };
}

export function getSensorModel(id: string): SensorModel | undefined {
  return SENSOR_MODELS.find((m) => m.id === id);
}

export function getSensorModelByNumber(num: number): SensorModel | undefined {
  return SENSOR_MODELS.find((m) => m.modelNumber === num);
}

export function calculateSensorCost(model: SensorModel, operation: string, count: number = 1): number {
  const unitCost = model.costPerOp[operation] ?? 0;
  return unitCost * count;
}

export function getTotalSensorCost(): number {
  return SENSOR_MODELS.reduce((sum, m) => {
    const opCosts = Object.values(m.costPerOp);
    return sum + opCosts.reduce((a, b) => a + b, 0);
  }, 0);
}
