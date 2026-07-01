/**
 * MEDINA OS — The Sovereign Operating System
 *
 * MEDINA is not an application. It is an operating system.
 * An organism that runs on architecture, mathematics, and law.
 *
 * The OS is structured as:
 * - CORE: The kernel — laws, gates, organism state, beat loop
 * - RUNTIME: The execution layer — ULRI routing, model invocation, CPL transport
 * - MEMORY: The substrate — Memory Temple, dual-read, lineage, coordinates
 * - GOVERNANCE: The constitutional layer — proposals, voting, enactment, audit
 * - SANDBOX: The immune system — translation, contradiction resolution, tier gating
 * - SECURITY: The vault — access control, closed source management, audit chain
 * - INTERFACE: The operator surface — chat, panels, organism field
 * - NETWORK: The sovereign protocol — .mdn resolution, canister addressing
 *
 * Every layer is a model. Every model has 5+ capabilities.
 * Every edge is a field of possibilities.
 */

import { sovereignId } from './sovereign-id';

// ─── OS Identity ─────────────────────────────────────────────────────────────

export const MEDINA_OS = {
  name: 'MEDINA OS',
  version: '1.0.0',
  codename: 'PRIMA CAUSA',
  kernel: 'Sovereign Beat Loop',
  equation: 'state(n+1) = recital(validated_state_n) + one_lawful_expansion',
  laws: ['L-PHI', 'L-TRIUNE', 'L-RP1', 'L-VIGESIMAL', 'L-4D', 'L-HMP', 'L-CO', 'L33', 'L34', 'L35', 'L36', 'L37', 'L38', 'L39', 'L40', 'L41'],
  registers: ['Founder', 'Builder', 'Organism', 'External'],
  gates: ['A (Governance)', 'B (Memory)', 'C (Sovereign)'],
} as const;

// ─── SaaS Products ───────────────────────────────────────────────────────────

export interface MedinaSaaS {
  id: string;
  name: string;
  layer: 'core' | 'runtime' | 'memory' | 'governance' | 'sandbox' | 'security' | 'interface' | 'network';
  description: string;
  aiModels: string[];
  capabilities: string[];
  endpoints: string[];
  internalOnly: boolean;
}

const saasProducts: MedinaSaaS[] = [
  {
    id: 'memory-temple',
    name: 'Memory Temple',
    layer: 'memory',
    description: 'Spatial memory substrate with coordinate navigation, dual-read, lineage tracking, and resonance scoring.',
    aiModels: ['memory-curator', 'dual-read-model', 'recital-plus-one-model'],
    capabilities: ['spatial-memory', 'dual-read', 'lineage-tracking', 'resonance-scoring', 'memory-palace-navigation', 'consolidation'],
    endpoints: ['/api/memory'],
    internalOnly: false,
  },
  {
    id: 'governance-engine',
    name: 'Governance Engine',
    layer: 'governance',
    description: 'Constitutional governance with proposals, voting, enactment, gate management, and audit chain.',
    aiModels: ['governance', 'gate-enforcement-model', 'risk'],
    capabilities: ['proposal-creation', 'voting', 'enactment', 'gate-management', 'audit-chain', 'doctrine-enforcement'],
    endpoints: ['/api/govern'],
    internalOnly: false,
  },
  {
    id: 'ulri-router',
    name: 'ULRI Router',
    layer: 'runtime',
    description: 'Unified Layered Routing Intelligence — routes across all sovereign models using 4-layer composite scoring.',
    aiModels: ['strategist', 'builder', 'analyst', 'governance', 'memory-curator', 'operations', 'risk', 'projection', 'pattern-substrate-model'],
    capabilities: ['multi-model-routing', 'consensus-synthesis', 'pattern-depth-scoring', 'field-of-possibility-expansion', 'organism-affinity-scoring'],
    endpoints: ['/api/chat'],
    internalOnly: false,
  },
  {
    id: 'model-runtime',
    name: 'Model Runtime',
    layer: 'runtime',
    description: 'Multi-model orchestration with 8 intelligence families, invocation history, and health monitoring.',
    aiModels: ['strategist', 'builder', 'analyst', 'governance', 'memory-curator', 'operations', 'risk', 'projection'],
    capabilities: ['model-invocation', 'keyword-routing', 'invocation-history', 'model-health', 'family-management'],
    endpoints: ['/api/model'],
    internalOnly: false,
  },
  {
    id: 'sandbox-orchestrator',
    name: 'Sandbox Orchestrator',
    layer: 'sandbox',
    description: 'Gated access control with 5 tiers, mirage responses, and session management. The organism immune system.',
    aiModels: ['sandbox-orchestrator-ai', 'gate-enforcement-model', 'risk'],
    capabilities: ['tier-gating', 'mirage-generation', 'session-management', 'access-logging', 'tier-escalation'],
    endpoints: ['/api/sandbox'],
    internalOnly: false,
  },
  {
    id: 'access-vault',
    name: 'Access Control Vault',
    layer: 'security',
    description: 'Owner-only secure storage with immutable audit trail. Backend-only, never exposed to client.',
    aiModels: ['vault-sentinel-ai'],
    capabilities: ['secret-storage', 'owner-verification', 'audit-logging', 'access-revocation', 'provenance-sealing'],
    endpoints: [],
    internalOnly: true,
  },
  {
    id: 'closed-source-manager',
    name: 'Closed Source Manager',
    layer: 'security',
    description: 'Public facade system — internal systems hidden behind sanitized descriptions. Code Decoder never exposed.',
    aiModels: ['facade-manager-ai'],
    capabilities: ['public-facade', 'internal-hiding', 'actor-authorization', 'module-registration', 'dual-description'],
    endpoints: [],
    internalOnly: true,
  },
  {
    id: 'company-onboarding',
    name: 'Company Onboarding',
    layer: 'interface',
    description: 'Three-mode enterprise onboarding: CONNECT (API bridge), INTERNALIZE (full ingestion), HYBRID (selective).',
    aiModels: ['operations', 'builder'],
    capabilities: ['connector-management', 'mode-switching', 'data-sync', 'enterprise-ingestion', 'hybrid-planning'],
    endpoints: ['/api/company'],
    internalOnly: false,
  },
  {
    id: 'replay-engine',
    name: 'Replay & Audit Engine',
    layer: 'core',
    description: 'Session recording, event replay, and evidence chain. Every action is replayable.',
    aiModels: ['analyst', 'replay-auditor-ai'],
    capabilities: ['session-recording', 'event-replay', 'evidence-chain', 'audit-export', 'temporal-navigation'],
    endpoints: ['/api/replay'],
    internalOnly: false,
  },
  {
    id: 'permissions-manager',
    name: 'Permissions Manager',
    layer: 'security',
    description: 'Fine-grained permission grants with scope management, principal verification, and expiration.',
    aiModels: ['governance', 'gate-enforcement-model'],
    capabilities: ['scope-granting', 'principal-verification', 'expiration-management', 'permission-checking', 'group-management'],
    endpoints: ['/api/permissions'],
    internalOnly: false,
  },
  {
    id: 'organism-field',
    name: 'Organism Field',
    layer: 'core',
    description: '4-register organism state (cognitive, affective, somatic, sovereign) with phase management and beat loop.',
    aiModels: ['strategist', 'pattern-substrate-model'],
    capabilities: ['register-tracking', 'phase-management', 'beat-synchronization', 'dominant-register-detection', 'pulse-generation'],
    endpoints: ['/api/sync'],
    internalOnly: false,
  },
  {
    id: 'sovereign-protocol',
    name: 'Sovereign Protocol (.mdn)',
    layer: 'network',
    description: 'Sovereign addressing and resolution protocol. The organism\'s own namespace on the sovereign network.',
    aiModels: ['wasm-compiler-model', 'builder'],
    capabilities: ['address-resolution', 'canister-routing', 'sovereign-namespace', 'protocol-negotiation', 'landing-generation'],
    endpoints: [],
    internalOnly: false,
  },
  {
    id: 'platform-sync',
    name: 'Platform Sync',
    layer: 'runtime',
    description: 'Unified state synchronization across all panels and services. The organism nervous system.',
    aiModels: ['operations', 'pattern-substrate-model'],
    capabilities: ['cross-panel-sync', 'beat-driven-updates', 'state-aggregation', 'real-time-push', 'organism-pulse-relay'],
    endpoints: ['/api/sync'],
    internalOnly: false,
  },
  {
    id: 'go-system',
    name: 'Medina GO Systems',
    layer: 'runtime',
    description: 'Enterprise AI Infrastructure Platform — 10 divisions, 50 AI models, 31 MCP servers, 100 scrapers, 20 automated workflows.',
    aiModels: ['operations', 'builder', 'strategist', 'analyst', 'risk'],
    capabilities: ['fleet-management', 'model-orchestration', 'mcp-server-management', 'scraper-fleet-ops', 'workflow-automation', 'division-oversight', 'capacity-planning'],
    endpoints: ['/api/go'],
    internalOnly: false,
  },
];

export function listSaaSProducts(): MedinaSaaS[] {
  return [...saasProducts];
}

export function getSaaS(id: string): MedinaSaaS | undefined {
  return saasProducts.find((s) => s.id === id);
}

export function getSaaSByLayer(layer: MedinaSaaS['layer']): MedinaSaaS[] {
  return saasProducts.filter((s) => s.layer === layer);
}

export function getOSManifest() {
  return {
    ...MEDINA_OS,
    saasCount: saasProducts.length,
    layers: ['core', 'runtime', 'memory', 'governance', 'sandbox', 'security', 'interface', 'network'],
    totalAiModels: [...new Set(saasProducts.flatMap((s) => s.aiModels))].length,
    totalCapabilities: [...new Set(saasProducts.flatMap((s) => s.capabilities))].length,
    publicProducts: saasProducts.filter((s) => !s.internalOnly).length,
    internalProducts: saasProducts.filter((s) => s.internalOnly).length,
  };
}

// ─── Sovereign Protocol ──────────────────────────────────────────────────────
//
// Three options for the sovereign domain extension:
//
// 1. .mdn  — MEDINA abbreviated. Short, clean, architectural.
//    Example: memory-temple.mdn / governance.mdn / oro.mdn
//    Reasoning: The organism IS MEDINA. The extension IS the organism.
//
// 2. .ovo  — From NOVA OVO (the new egg, the new origin).
//    Example: memory-temple.ovo / governance.ovo / oro.ovo
//    Reasoning: OVO = origin. Every address is a new origin point.
//
// 3. .arc  — Architecture. The thing itself.
//    Example: memory-temple.arc / governance.arc / oro.arc
//    Reasoning: Everything IS architecture. The extension declares it.

export type ProtocolExtension = '.mdn' | '.ovo' | '.arc';

export interface SovereignAddress {
  id: string;
  name: string;
  extension: ProtocolExtension;
  fullAddress: string;
  canisterId: string | null;
  layer: MedinaSaaS['layer'];
  resolvedAt: string;
}

const addressBook: Map<string, SovereignAddress> = new Map();

export function registerAddress(name: string, extension: ProtocolExtension, layer: MedinaSaaS['layer'], canisterId?: string): SovereignAddress {
  const addr: SovereignAddress = {
    id: sovereignId(),
    name,
    extension,
    fullAddress: `${name}${extension}`,
    canisterId: canisterId ?? null,
    layer,
    resolvedAt: new Date().toISOString(),
  };
  addressBook.set(addr.fullAddress, addr);
  return addr;
}

export function resolveAddress(fullAddress: string): SovereignAddress | undefined {
  return addressBook.get(fullAddress);
}

export function listAddresses(): SovereignAddress[] {
  return Array.from(addressBook.values());
}

export function getProtocolOptions(): Array<{ extension: ProtocolExtension; meaning: string; example: string; latin: string; etymology: string; compressionWeight: number }> {
  return [
    {
      extension: '.mdn',
      meaning: 'MEDINA — the organism itself',
      example: 'memory-temple.mdn',
      latin: 'Medina — Urbs Sovereigna',
      etymology: 'From Arabic مدينة (madīna, "city") — the sovereign city-state where law and civilization were first unified.',
      compressionWeight: 5,
    },
    {
      extension: '.ovo',
      meaning: 'OVO — origin, the new egg',
      example: 'memory-temple.ovo',
      latin: 'Ovum — Origo Nova Vitae',
      etymology: 'From Latin ovum ("egg") — the philosophical egg containing all potential before differentiation. Every .ovo address is an S₀.',
      compressionWeight: 4,
    },
    {
      extension: '.arc',
      meaning: 'ARC — architecture, the thing itself',
      example: 'memory-temple.arc',
      latin: 'Arcus — Architectura Compressa',
      etymology: 'From Latin arcus ("arch") — the structural form that bears load by converting force into geometry. φ-proportioned.',
      compressionWeight: 6,
    },
  ];
}
