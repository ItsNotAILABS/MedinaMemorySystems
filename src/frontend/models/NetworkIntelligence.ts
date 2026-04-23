// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * NETWORK INTELLIGENCE — Communication/Networking Intelligence
 * ─────────────────────────────────────────────────────────────────────────
 * 10 Models (61-70) — Client-side communication and networking intelligence
 *
 * From HTTP fetches to peer-to-peer channels, these models govern
 * every packet that flows between the browser and the outside world.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { FrontendModel, FrontendModelCategory, ModelStatus } from './FrontendIntelligenceRegistry';

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────

const NETWORK_CATEGORY: FrontendModelCategory = 'NETWORK';
const PHI = 1.6180339887498948482;

// ─────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────

export interface NetworkModel extends FrontendModel {
  category: 'NETWORK';
  transportLayer: string;
}

// ─────────────────────────────────────────────────────────────────────────
// MODEL 61 — PETITOR RETIUM
// ─────────────────────────────────────────────────────────────────────────

export const PETITOR_RETIUM: NetworkModel = {
  id: 'NETWORK-061',
  modelNumber: 61,
  latinName: 'Petitor Retium',
  commonName: 'The Network Petitioner',
  category: NETWORK_CATEGORY,
  technology: 'Fetch',
  description: 'Fetch API request intelligence. Constructs, dispatches, and manages HTTP requests with headers, CORS handling, and AbortController lifecycle.',
  costPerOp: { fetch: 0.002, abort: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.90,
  connections: ['NETWORK-066', 'NETWORK-068'],
  phiAlignment: PHI * 0.94,
  transportLayer: 'HTTP',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 62 — CONNECTOR SOCKETARUM
// ─────────────────────────────────────────────────────────────────────────

export const CONNECTOR_SOCKETARUM: NetworkModel = {
  id: 'NETWORK-062',
  modelNumber: 62,
  latinName: 'Connector Socketarum',
  commonName: 'The Socket Connector',
  category: NETWORK_CATEGORY,
  technology: 'WebSocket',
  description: 'WebSocket bidirectional intelligence. Opens persistent full-duplex channels, manages heartbeats, and handles graceful close handshakes.',
  costPerOp: { connect: 0.003, message: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.88,
  connections: ['NETWORK-061', 'NETWORK-069'],
  phiAlignment: PHI * 0.93,
  transportLayer: 'WEBSOCKET',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 63 — MEDIATOR PARIUM
// ─────────────────────────────────────────────────────────────────────────

export const MEDIATOR_PARIUM: NetworkModel = {
  id: 'NETWORK-063',
  modelNumber: 63,
  latinName: 'Mediator Parium',
  commonName: 'The Peer Mediator',
  category: NETWORK_CATEGORY,
  technology: 'WebRTC',
  description: 'WebRTC peer-to-peer intelligence. Negotiates SDP offers/answers, manages ICE candidate gathering, and establishes direct data channels between peers.',
  costPerOp: { offer: 0.005, ice: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.85,
  connections: ['NETWORK-062', 'NETWORK-065'],
  phiAlignment: PHI * 0.91,
  transportLayer: 'WEBRTC',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 64 — AUDITOR EVENTUUM
// ─────────────────────────────────────────────────────────────────────────

export const AUDITOR_EVENTUUM: NetworkModel = {
  id: 'NETWORK-064',
  modelNumber: 64,
  latinName: 'Auditor Eventuum',
  commonName: 'The Event Listener',
  category: NETWORK_CATEGORY,
  technology: 'SSE',
  description: 'Server-Sent Events intelligence. Maintains unidirectional event streams from server to client with automatic reconnection and last-event-id tracking.',
  costPerOp: { listen: 0.001, reconnect: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.80,
  connections: ['NETWORK-061', 'NETWORK-069'],
  phiAlignment: PHI * 0.88,
  transportLayer: 'SSE',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 65 — TRANSPORTOR RAPIDAE
// ─────────────────────────────────────────────────────────────────────────

export const TRANSPORTOR_RAPIDAE: NetworkModel = {
  id: 'NETWORK-065',
  modelNumber: 65,
  latinName: 'Transportor Rapidae',
  commonName: 'The Rapid Transporter',
  category: NETWORK_CATEGORY,
  technology: 'WebTransport',
  description: 'WebTransport (HTTP/3 QUIC) intelligence. Multiplexes bidirectional streams and unreliable datagrams over QUIC for low-latency communication.',
  costPerOp: { stream: 0.003, datagram: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.83,
  connections: ['NETWORK-062', 'NETWORK-063'],
  phiAlignment: PHI * 0.90,
  transportLayer: 'QUIC',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 66 — INTERCEPTOR RETICULARIS
// ─────────────────────────────────────────────────────────────────────────

export const INTERCEPTOR_RETICULARIS: NetworkModel = {
  id: 'NETWORK-066',
  modelNumber: 66,
  latinName: 'Interceptor Reticularis',
  commonName: 'The Network Interceptor',
  category: NETWORK_CATEGORY,
  technology: 'ServiceWorker',
  description: 'Service Worker fetch interception intelligence. Intercepts outbound requests, applies cache strategies, and rewrites responses at the network edge.',
  costPerOp: { intercept: 0.002, rewrite: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.87,
  connections: ['NETWORK-061', 'NETWORK-068'],
  phiAlignment: PHI * 0.92,
  transportLayer: 'SERVICE_WORKER',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 67 — PAGINATOR INFINITUS
// ─────────────────────────────────────────────────────────────────────────

export const PAGINATOR_INFINITUS: NetworkModel = {
  id: 'NETWORK-067',
  modelNumber: 67,
  latinName: 'Paginator Infinitus',
  commonName: 'The Infinite Paginator',
  category: NETWORK_CATEGORY,
  technology: 'JavaScript',
  description: 'Infinite scroll and cursor pagination intelligence. Manages progressive data loading with cursor tracking, prefetch heuristics, and scroll anchoring.',
  costPerOp: { page: 0.001, cursor: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.78,
  connections: ['NETWORK-061', 'NETWORK-068'],
  phiAlignment: PHI * 0.87,
  transportLayer: 'PAGINATION',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 68 — DEDUPLICATOR PETITIONUM
// ─────────────────────────────────────────────────────────────────────────

export const DEDUPLICATOR_PETITIONUM: NetworkModel = {
  id: 'NETWORK-068',
  modelNumber: 68,
  latinName: 'Deduplicator Petitionum',
  commonName: 'The Request Deduplicator',
  category: NETWORK_CATEGORY,
  technology: 'JavaScript',
  description: 'Request deduplication and batching intelligence. Coalesces identical in-flight requests and batches multiple operations into single network round-trips.',
  costPerOp: { batch: 0.002, dedup: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.82,
  connections: ['NETWORK-061', 'NETWORK-067'],
  phiAlignment: PHI * 0.89,
  transportLayer: 'BATCH',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 69 — RESILITOR RETICULARIS
// ─────────────────────────────────────────────────────────────────────────

export const RESILITOR_RETICULARIS: NetworkModel = {
  id: 'NETWORK-069',
  modelNumber: 69,
  latinName: 'Resilitor Reticularis',
  commonName: 'The Network Resilient',
  category: NETWORK_CATEGORY,
  technology: 'JavaScript',
  description: 'Retry, timeout, and circuit-breaker intelligence. Applies exponential backoff, deadline propagation, and circuit-breaker state machines to failing requests.',
  costPerOp: { retry: 0.002, breaker: 0.003 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.86,
  connections: ['NETWORK-062', 'NETWORK-064'],
  phiAlignment: PHI * 0.91,
  transportLayer: 'RESILIENCE',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 70 — NOTIFICATOR GENERALIS
// ─────────────────────────────────────────────────────────────────────────

export const NOTIFICATOR_GENERALIS: NetworkModel = {
  id: 'NETWORK-070',
  modelNumber: 70,
  latinName: 'Notificator Generalis',
  commonName: 'The General Notifier',
  category: NETWORK_CATEGORY,
  technology: 'NotificationAPI',
  description: 'Push and Notification API intelligence. Manages push subscription lifecycle, notification permissions, and user-visible alert rendering.',
  costPerOp: { push: 0.002, show: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.76,
  connections: ['NETWORK-064', 'NETWORK-066'],
  phiAlignment: PHI * 0.86,
  transportLayer: 'PUSH',
};

// ─────────────────────────────────────────────────────────────────────────
// COLLECTION & FACTORY
// ─────────────────────────────────────────────────────────────────────────

export const NETWORK_MODELS: NetworkModel[] = [
  PETITOR_RETIUM,
  CONNECTOR_SOCKETARUM,
  MEDIATOR_PARIUM,
  AUDITOR_EVENTUUM,
  TRANSPORTOR_RAPIDAE,
  INTERCEPTOR_RETICULARIS,
  PAGINATOR_INFINITUS,
  DEDUPLICATOR_PETITIONUM,
  RESILITOR_RETICULARIS,
  NOTIFICATOR_GENERALIS,
];

export function createNetworkModel(overrides: Partial<NetworkModel> & Pick<NetworkModel, 'id' | 'modelNumber' | 'latinName' | 'commonName' | 'technology'>): NetworkModel {
  return {
    category: NETWORK_CATEGORY as 'NETWORK',
    description: '',
    costPerOp: {},
    frequency: 12.67,
    status: 'DORMANT' as ModelStatus,
    autonomyLevel: 0.5,
    connections: [],
    phiAlignment: PHI * 0.85,
    transportLayer: 'CUSTOM',
    ...overrides,
  };
}

export function getNetworkModel(id: string): NetworkModel | undefined {
  return NETWORK_MODELS.find((m) => m.id === id);
}

export function getNetworkModelByNumber(num: number): NetworkModel | undefined {
  return NETWORK_MODELS.find((m) => m.modelNumber === num);
}

export function calculateNetworkCost(model: NetworkModel, operation: string, count: number = 1): number {
  const unitCost = model.costPerOp[operation] ?? 0;
  return unitCost * count;
}

export function getTotalNetworkCost(): number {
  return NETWORK_MODELS.reduce((sum, m) => {
    const opCosts = Object.values(m.costPerOp);
    return sum + opCosts.reduce((a, b) => a + b, 0);
  }, 0);
}
