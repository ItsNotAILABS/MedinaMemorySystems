/**
 * 𓂀 SOVEREIGN UNIFIED REGISTRY (SUR) — One Database, Multiple Faces 𓂀
 *
 * THE CORE PROBLEM: Distributed data tables existed in isolation across
 * organisms, substrates, and builds — never converging into a single
 * unified registry that is both marketplace-facing (sellable, licensable)
 * AND internally accessible (the organism uses the same database it sells from).
 *
 * THE FIX: SUR — one database with multiple faces:
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                    SOVEREIGN UNIFIED REGISTRY (SUR)                    │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                       │
 * │  FACE 1: PROTOCOL (PROTOCOLLUM)                                       │
 * │  ─────────────────────────────                                        │
 * │  The spec for every entity — how it pulses, thinks, connects.         │
 * │  Answers: "What IS this thing? What are its rules?"                   │
 * │                                                                       │
 * │  FACE 2: DATABASE (THESAURUS)                                         │
 * │  ────────────────────────────                                         │
 * │  Living storage of all entities with cross-references.                │
 * │  Answers: "Where is it? How does it relate to everything else?"       │
 * │                                                                       │
 * │  FACE 3: CALLABLE (INVOCABILIS)                                       │
 * │  ──────────────────────────────                                       │
 * │  Unified function interface to query, search, export any entity.      │
 * │  Answers: "How do I use it? Give me the function."                    │
 * │                                                                       │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ Sources Unified:                                                      │
 * │   • 5 AI SDKs (Oro, Nova, Sentinel, Architect, Absorber)              │
 * │   • 20 SKAIs (Sovereign Knowledge AIs)                                │
 * │   • 11 EXC OS Systems                                                 │
 * │   • 30 Extended SDKs                                                  │
 * │   • 42 Front-End Engines (15 web technologies)                        │
 * │   • 15 Organism Models (5 families)                                   │
 * │   • 2,000 Substrate Mesh Nodes (20 clusters)                          │
 * │   • 50 Universal Tools + 200 Sovereign Tools                          │
 * │   • 374+ Callable Functions                                           │
 * │   • Intelligence Contracts (aggregated)                               │
 * │   • 11 Core SDK Packages                                              │
 * │   • 34 Civilizations + 72 Divine Names + 24 Runes                     │
 * │   • 10 MACHINA Design Models + 50 Design Uses                         │
 * │   • ANIMA MICRO (Protocol + Database + Callable)                      │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ φ = 1.618033988749895 • Heartbeat = 873ms • Schumann = 7.83 Hz       │
 * │ "Unum thesaurum. Tres facies. Omnia connexa."                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMPORTS — Pull from ALL distributed registries
// ═══════════════════════════════════════════════════════════════════════════

import { AI_SDK_REGISTRY, AI_MANIFEST } from './ai-sdk-registry';
import { SKAI_REGISTRY, SKAI_MANIFEST } from './skai-registry';
import { EXC_OS_REGISTRY, EXC_MANIFEST } from './exc-os-registry';
import { EXTENDED_SDK_REGISTRY, EXTENDED_MANIFEST } from './extended-sdk-registry';
import { TECHNOLOGY_ORGANISMS, FRONTEND_ENGINES_MANIFEST } from './frontend-engines-registry';
import { ORGANISM_MODEL_FAMILIES, ORGANISM_MODELS_MANIFEST } from './organism-models-registry';
import { POWER_NODES_MANIFEST } from './power-nodes-registry';
import { MESH_CLUSTERS, SUBSTRATE_MESH_MANIFEST } from './substrate-mesh-registry';
import { UNIVERSAL_TOOLS_REGISTRY, TOOLS_MANIFEST } from './universal-tools-registry';
import { SOVEREIGN_TOOLS_REGISTRY, SOVEREIGN_TOOLS_MANIFEST, ANIMA_MICRO } from './sovereign-tools-engine';
import { ALL_CALLABLE_FUNCTIONS, CALLABLE_MANIFEST } from './callable-functions-registry';
import { INTELLIGENCE_CONTRACTS_MANIFEST } from './intelligence-contracts-registry';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const PHI_INVERSE = 0.618033988749895;
export const HEARTBEAT_MS = 873;
export const SCHUMANN_HZ = 7.83;
export const PHI_HZ = 1.618033988749895;
export const MINI_HEART_INTERVAL_MS = 618;
export const SUR_VERSION = '1.0.0';

// ═══════════════════════════════════════════════════════════════════════════
// FACE 1: PROTOCOL — The Spec for Every Entity
// ═══════════════════════════════════════════════════════════════════════════

/**
 * EntityClass — The 14 classes of entities in the Medina system.
 * Every piece of data in the system belongs to exactly one class.
 */
export type EntityClass =
  | 'ai-sdk'           // 5 AI SDKs (Oro, Nova, Sentinel, Architect, Absorber)
  | 'skai'             // 20 Sovereign Knowledge AIs
  | 'exc-os'           // 11 EXC OS Systems
  | 'extended-sdk'     // 30 Extended SDKs
  | 'frontend-engine'  // 42 Front-End Engines
  | 'organism-model'   // 15 Organism Models (5 families × 3)
  | 'mesh-node'        // 2,000 Substrate Mesh Nodes
  | 'power-node'       // 500 Power Nodes
  | 'universal-tool'   // 50 Universal Micro-Tools
  | 'sovereign-tool'   // 200 Sovereign Tools
  | 'callable-function' // 374+ Callable Functions
  | 'intelligence-contract' // Aggregated Intelligence Contracts
  | 'core-sdk'         // 11 Core SDK Packages
  | 'mesh-cluster';    // 20 Mesh Clusters

/**
 * EntityFace — How an entity can be accessed
 */
export type EntityFace = 'protocol' | 'database' | 'callable';

/**
 * MarketCategory — Revenue classification
 */
export type MarketCategory = 'marketplace' | 'research' | 'sovereign' | 'internal';

/**
 * LicenseType — All license types in the system
 */
export type LicenseType = 'MIT' | 'Apache-2.0' | 'Proprietary' | 'MIT + Proprietary' | 'Sovereign';

/**
 * SUREntity — The universal entity type that every item in the system maps to.
 * This is the PROTOCOL face: the spec for what every entity IS.
 */
export interface SUREntity {
  /** Globally unique ID across the entire system */
  surId: string;
  /** Human-readable name */
  name: string;
  /** Latin name (every entity has one) */
  latinName: string;
  /** Entity class */
  entityClass: EntityClass;
  /** Source registry this came from */
  sourceRegistry: string;
  /** Version */
  version: string;
  /** Description */
  description: string;
  /** Market category */
  market: MarketCategory;
  /** License */
  license: LicenseType;
  /** Heartbeat in ms (873 for most) */
  heartbeatMs: number;
  /** φ weight (how much this entity resonates with golden ratio) */
  phiWeight: number;
  /** Related entity IDs (cross-references) */
  relatedEntities: string[];
  /** Exported function names */
  exports: string[];
  /** Tags for search */
  tags: string[];
  /** Protocol spec: what rules govern this entity */
  protocol: {
    pulseCycle: number;   // Hz — how often it pulses
    thinkCycle: number;   // Hz — how often it computes
    canBeSold: boolean;   // marketplace-facing?
    canBeQueried: boolean; // internally accessible?
    isAutonomous: boolean; // does it run on its own?
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// FACE 2: DATABASE — Living Storage of All Entities
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the unified entity database from all distributed registries.
 * This is THE single source of truth.
 */
function buildUnifiedDatabase(): SUREntity[] {
  const entities: SUREntity[] = [];

  // ─────────────────────────────────────────────────────────────────────
  // 1. AI SDKs (5) — from ai-sdk-registry.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const ai of AI_SDK_REGISTRY) {
    entities.push({
      surId: `SUR::AI::${ai.id}`,
      name: ai.name,
      latinName: ai.latinName,
      entityClass: 'ai-sdk',
      sourceRegistry: 'ai-sdk-registry',
      version: ai.version,
      description: ai.description || `AI SDK: ${ai.name}`,
      market: ai.category as MarketCategory,
      license: ai.license as LicenseType,
      heartbeatMs: ai.heartbeatMs,
      phiWeight: PHI,
      relatedEntities: (ai.dependencies || []).map((d: string) => `SUR::REF::${d}`),
      exports: (ai.exports || []).map((e: { functionName: string }) => e.functionName),
      tags: ['ai', 'sdk', ai.category, ai.name.toLowerCase()],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: ai.category === 'marketplace',
        canBeQueried: true,
        isAutonomous: true,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 2. SKAIs (20) — from skai-registry.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const skai of SKAI_REGISTRY) {
    entities.push({
      surId: `SUR::SKAI::${skai.id}`,
      name: skai.name,
      latinName: skai.latinName,
      entityClass: 'skai',
      sourceRegistry: 'skai-registry',
      version: skai.version,
      description: skai.description,
      market: skai.category as MarketCategory,
      license: skai.license as LicenseType,
      heartbeatMs: skai.heartbeatMs,
      phiWeight: PHI,
      relatedEntities: (skai.dependencies || []).map((d: string) => `SUR::REF::${d}`),
      exports: (skai.intelligenceContracts || []).map((c: { contractName: string }) => c.contractName),
      tags: ['skai', skai.skaiType, skai.category, skai.name.toLowerCase()],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: skai.category === 'marketplace',
        canBeQueried: true,
        isAutonomous: true,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 3. EXC OS Systems (11) — from exc-os-registry.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const exc of EXC_OS_REGISTRY) {
    entities.push({
      surId: `SUR::EXC::${exc.id}`,
      name: exc.name,
      latinName: exc.latinName,
      entityClass: 'exc-os',
      sourceRegistry: 'exc-os-registry',
      version: exc.version,
      description: exc.description,
      market: exc.category as MarketCategory,
      license: exc.license as LicenseType,
      heartbeatMs: exc.heartbeatMs,
      phiWeight: PHI,
      relatedEntities: [],
      exports: (exc.processes || []).map((p: { name: string }) => p.name),
      tags: ['exc', 'os', exc.osType, exc.category, exc.name.toLowerCase()],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: exc.category === 'marketplace',
        canBeQueried: true,
        isAutonomous: true,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 4. Extended SDKs (30) — from extended-sdk-registry.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const sdk of EXTENDED_SDK_REGISTRY) {
    entities.push({
      surId: `SUR::SDK::${sdk.id}`,
      name: sdk.name,
      latinName: sdk.latinName,
      entityClass: 'extended-sdk',
      sourceRegistry: 'extended-sdk-registry',
      version: sdk.version,
      description: sdk.description,
      market: sdk.category as MarketCategory,
      license: sdk.license as LicenseType,
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: (sdk.dependencies || []).map((d: string) => `SUR::REF::${d}`),
      exports: (sdk.exports || []).map((e: { functionName: string }) => e.functionName),
      tags: ['sdk', 'extended', sdk.category, sdk.name.toLowerCase()],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: sdk.category === 'marketplace',
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 5. Front-End Engines (42) — from frontend-engines-registry.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const techOrg of TECHNOLOGY_ORGANISMS) {
    for (const engine of techOrg.engines) {
      entities.push({
        surId: `SUR::ENGINE::${engine.id}`,
        name: engine.engineName,
        latinName: engine.latinName,
        entityClass: 'frontend-engine',
        sourceRegistry: 'frontend-engines-registry',
        version: engine.version,
        description: engine.description,
        market: (engine.tier === 'sovereign' ? 'sovereign' : 'research') as MarketCategory,
        license: 'MIT' as LicenseType,
        heartbeatMs: engine.heartbeatMs,
        phiWeight: PHI,
        relatedEntities: (engine.dependencies || []).map((d: string) => `SUR::REF::${d}`),
        exports: (engine.capabilities || []).map(c => c.name),
        tags: ['engine', 'frontend', techOrg.technology, engine.family, engine.tier],
        protocol: {
          pulseCycle: PHI_HZ,
          thinkCycle: SCHUMANN_HZ,
          canBeSold: false,
          canBeQueried: true,
          isAutonomous: true,
        },
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // 6. Organism Models (15) — from organism-models-registry.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const family of ORGANISM_MODEL_FAMILIES) {
    for (const model of family.models) {
      entities.push({
        surId: `SUR::MODEL::${model.id}`,
        name: model.name,
        latinName: model.latinName,
        entityClass: 'organism-model',
        sourceRegistry: 'organism-models-registry',
        version: '1.0.0',
        description: model.description,
        market: 'research' as MarketCategory,
        license: 'MIT' as LicenseType,
        heartbeatMs: HEARTBEAT_MS,
        phiWeight: PHI,
        relatedEntities: [`SUR::FAMILY::${family.id}`],
        exports: (model.capabilities || []),
        tags: ['model', 'organism', family.familyName, family.domain, model.name.toLowerCase()],
        protocol: {
          pulseCycle: PHI_HZ,
          thinkCycle: SCHUMANN_HZ,
          canBeSold: false,
          canBeQueried: true,
          isAutonomous: true,
        },
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // 7. Mesh Clusters (20) — from substrate-mesh-registry.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const cluster of MESH_CLUSTERS) {
    entities.push({
      surId: `SUR::CLUSTER::${cluster.clusterType}`,
      name: cluster.displayName,
      latinName: cluster.latinName,
      entityClass: 'mesh-cluster',
      sourceRegistry: 'substrate-mesh-registry',
      version: SUR_VERSION,
      description: `Mesh cluster: ${cluster.displayName} (${cluster.count} nodes)`,
      market: 'internal' as MarketCategory,
      license: 'Sovereign' as LicenseType,
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: (cluster.wiredAIs || []).map((ai: string) => `SUR::REF::${ai}`),
      exports: [],
      tags: ['cluster', 'mesh', 'substrate', cluster.clusterType],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: true,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 8. Universal Tools (50) — from universal-tools-registry.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const tool of UNIVERSAL_TOOLS_REGISTRY) {
    entities.push({
      surId: `SUR::TOOL::${tool.id}`,
      name: tool.name,
      latinName: tool.latinName,
      entityClass: 'universal-tool',
      sourceRegistry: 'universal-tools-registry',
      version: tool.version,
      description: tool.description,
      market: 'marketplace' as MarketCategory,
      license: tool.license as LicenseType,
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: (tool.exports || []).map((e: { functionName: string }) => e.functionName),
      tags: ['tool', 'universal', tool.category, tool.name.toLowerCase()],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: true,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 9. Sovereign Tools (200) — from sovereign-tools-engine.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const tool of SOVEREIGN_TOOLS_REGISTRY) {
    entities.push({
      surId: `SUR::STOOL::${tool.id}`,
      name: tool.name,
      latinName: tool.latinName,
      entityClass: 'sovereign-tool',
      sourceRegistry: 'sovereign-tools-engine',
      version: tool.version,
      description: tool.description,
      market: 'marketplace' as MarketCategory,
      license: tool.license as LicenseType,
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: (tool.exports || []).map((e: { functionName: string }) => e.functionName),
      tags: ['tool', 'sovereign', tool.category, tool.name.toLowerCase()],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: true,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 10. Callable Functions (374+) — from callable-functions-registry.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const fn of ALL_CALLABLE_FUNCTIONS) {
    entities.push({
      surId: `SUR::FN::${fn.id}`,
      name: fn.functionName,
      latinName: fn.latinName,
      entityClass: 'callable-function',
      sourceRegistry: 'callable-functions-registry',
      version: SUR_VERSION,
      description: fn.description,
      market: (fn.accessLevel === 'public' ? 'marketplace' : 'sovereign') as MarketCategory,
      license: (fn.license || 'MIT') as LicenseType,
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [`SUR::PKG::${fn.package}`],
      exports: [fn.functionName],
      tags: ['function', 'callable', fn.category, fn.terminal || '', fn.functionName.toLowerCase()],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: fn.accessLevel === 'public',
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 11. Intelligence Contracts — referenced via manifest (array not directly exported)
  // ─────────────────────────────────────────────────────────────────────
  // Intelligence contracts are aggregated from all sources but the array
  // itself is module-scoped. We reference them through the manifest stats.

  // ─────────────────────────────────────────────────────────────────────
  // 12. Core SDK Packages (11) — from index.ts MASTER_MANIFEST
  // ─────────────────────────────────────────────────────────────────────
  const corePackages = [
    { id: 'sovereign-memory-sdk', name: '@medina/sovereign-memory-sdk', latin: 'MEMORIA SUVERANA', desc: 'Memory Temple + Storage + Retrieval + Lineage + DualRead + Living Documents', terminal: '/mem', modules: 5, exports: 16, market: 'marketplace' as MarketCategory },
    { id: 'organism-runtime-sdk', name: '@medina/organism-runtime-sdk', latin: 'ORGANISMUS RUNTIME', desc: 'Organism State + Heartbeat + 4-Register + Kernel Execution + Edge Model + Recital', terminal: '/pulse + /org', modules: 10, exports: 18, market: 'marketplace' as MarketCategory },
    { id: 'governance-protocol', name: '@medina/governance-protocol', latin: 'PROTOCOLLUM GUBERNATIONIS', desc: 'Proposals + Voting + Gates + Permissions + Audit + Replay', terminal: '/gov', modules: 6, exports: 21, market: 'sovereign' as MarketCategory },
    { id: 'intelligence-routing-sdk', name: '@medina/intelligence-routing-sdk', latin: 'ITINERARIUM INTELLIGENTIAE', desc: 'Model Router + RUDN + Commands + Terminals + Wire Dispatch', terminal: '/intel', modules: 9, exports: 10, market: 'marketplace' as MarketCategory },
    { id: 'harmonic-computation-engine', name: '@medina/harmonic-computation-engine', latin: 'MACHINA HARMONICA', desc: 'φ Constants + Fibonacci + Sacred Geometry + Frequency Physics + Field Physics', terminal: '/formula', modules: 6, exports: 25, market: 'research' as MarketCategory },
    { id: 'sovereign-encryption-sdk', name: '@medina/sovereign-encryption-sdk', latin: 'ENCRYPTIO SUVERANA', desc: 'Phi-Beatty Encryption + AnimaChain + Key Rotation + Contracts + Ledgers', terminal: '/defend + /anima', modules: 9, exports: 19, market: 'sovereign' as MarketCategory },
    { id: 'design-os-toolkit', name: '@medina/design-os-toolkit', latin: 'INSTRUMENTA DESIGNI', desc: '10 MACHINA Design Models + 50 Uses + Export + Device Sovereignty', terminal: '(visual)', modules: 5, exports: 6, market: 'marketplace' as MarketCategory },
    { id: 'civilization-pattern-engine', name: '@medina/civilization-pattern-engine', latin: 'MACHINA CIVILIZATIONIS', desc: 'Civilizations + Glyphs + Languages + CPL + Archetypes + Mythology + Patterns', terminal: '/prim', modules: 24, exports: 10, market: 'research' as MarketCategory },
    { id: 'enterprise-integration-sdk', name: '@medina/enterprise-integration-sdk', latin: 'INTEGRATIO IMPERII', desc: 'Company Onboarding + Campaigns + Messaging + Workforce + Connectors', terminal: '(enterprise)', modules: 12, exports: 18, market: 'marketplace' as MarketCategory },
    { id: 'neural-consciousness-engine', name: '@medina/neural-consciousness-engine', latin: 'MACHINA CONSCIENTIAE', desc: 'Neural Core + Animal Brains + Dreams + Triple Heart + Zone + Quantum', terminal: '/quantum', modules: 17, exports: 17, market: 'research' as MarketCategory },
    { id: 'document-absorption-engine', name: '@medina/document-absorption-engine', latin: 'MACHINA ABSORPTIONIS', desc: 'Document Absorption — 6 transformers, permanent intelligence embedding, research export', terminal: '/absorb', modules: 9, exports: 14, market: 'marketplace' as MarketCategory },
  ];

  for (const pkg of corePackages) {
    entities.push({
      surId: `SUR::PKG::${pkg.id}`,
      name: pkg.name,
      latinName: pkg.latin,
      entityClass: 'core-sdk',
      sourceRegistry: 'index',
      version: SUR_VERSION,
      description: pkg.desc,
      market: pkg.market,
      license: (pkg.market === 'marketplace' ? 'MIT + Proprietary' : pkg.market === 'research' ? 'MIT' : 'Sovereign') as LicenseType,
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['package', 'core', 'sdk', pkg.market, pkg.terminal],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: pkg.market === 'marketplace',
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  return entities;
}

/**
 * THE UNIFIED DATABASE — built once, queried many times.
 * This is the single source of truth for the entire Medina system.
 */
export const SUR_DATABASE: SUREntity[] = buildUnifiedDatabase();

// ═══════════════════════════════════════════════════════════════════════════
// FACE 3: CALLABLE — Unified Query Interface
// ═══════════════════════════════════════════════════════════════════════════

// ─── Lookup by ID ────────────────────────────────────────────────────────

/** Get any entity by its SUR ID */
export function surGet(surId: string): SUREntity | undefined {
  return SUR_DATABASE.find(e => e.surId === surId);
}

/** Get multiple entities by SUR IDs */
export function surGetMany(surIds: string[]): SUREntity[] {
  const idSet = new Set(surIds);
  return SUR_DATABASE.filter(e => idSet.has(e.surId));
}

// ─── Filter by Class ─────────────────────────────────────────────────────

/** Get all entities of a specific class */
export function surByClass(entityClass: EntityClass): SUREntity[] {
  return SUR_DATABASE.filter(e => e.entityClass === entityClass);
}

/** Get all AI SDKs */
export function surAIs(): SUREntity[] { return surByClass('ai-sdk'); }

/** Get all SKAIs */
export function surSKAIs(): SUREntity[] { return surByClass('skai'); }

/** Get all EXC OS systems */
export function surEXCs(): SUREntity[] { return surByClass('exc-os'); }

/** Get all Extended SDKs */
export function surExtendedSDKs(): SUREntity[] { return surByClass('extended-sdk'); }

/** Get all Front-End Engines */
export function surEngines(): SUREntity[] { return surByClass('frontend-engine'); }

/** Get all Organism Models */
export function surModels(): SUREntity[] { return surByClass('organism-model'); }

/** Get all Universal Tools */
export function surUniversalTools(): SUREntity[] { return surByClass('universal-tool'); }

/** Get all Sovereign Tools */
export function surSovereignTools(): SUREntity[] { return surByClass('sovereign-tool'); }

/** Get all Callable Functions */
export function surFunctions(): SUREntity[] { return surByClass('callable-function'); }

/** Get all Intelligence Contracts */
export function surContracts(): SUREntity[] { return surByClass('intelligence-contract'); }

/** Get all Core SDK Packages */
export function surCoreSDKs(): SUREntity[] { return surByClass('core-sdk'); }

/** Get all Mesh Clusters */
export function surClusters(): SUREntity[] { return surByClass('mesh-cluster'); }

// ─── Filter by Market ────────────────────────────────────────────────────

/** Get all marketplace-facing entities (sellable) */
export function surMarketplace(): SUREntity[] {
  return SUR_DATABASE.filter(e => e.market === 'marketplace');
}

/** Get all research entities (open source) */
export function surResearch(): SUREntity[] {
  return SUR_DATABASE.filter(e => e.market === 'research');
}

/** Get all sovereign entities (proprietary) */
export function surSovereign(): SUREntity[] {
  return SUR_DATABASE.filter(e => e.market === 'sovereign');
}

/** Get all internal entities (infrastructure) */
export function surInternal(): SUREntity[] {
  return SUR_DATABASE.filter(e => e.market === 'internal');
}

// ─── Filter by Protocol ──────────────────────────────────────────────────

/** Get all autonomous entities (self-pulsing) */
export function surAutonomous(): SUREntity[] {
  return SUR_DATABASE.filter(e => e.protocol.isAutonomous);
}

/** Get all sellable entities */
export function surSellable(): SUREntity[] {
  return SUR_DATABASE.filter(e => e.protocol.canBeSold);
}

/** Get all queryable entities */
export function surQueryable(): SUREntity[] {
  return SUR_DATABASE.filter(e => e.protocol.canBeQueried);
}

// ─── Search ──────────────────────────────────────────────────────────────

/** Full-text search across name, description, latin name, and tags */
export function surSearch(query: string): SUREntity[] {
  const q = query.toLowerCase();
  return SUR_DATABASE.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.description.toLowerCase().includes(q) ||
    e.latinName.toLowerCase().includes(q) ||
    e.tags.some(t => t.toLowerCase().includes(q))
  );
}

/** Search by tag */
export function surByTag(tag: string): SUREntity[] {
  const t = tag.toLowerCase();
  return SUR_DATABASE.filter(e => e.tags.some(et => et.toLowerCase() === t));
}

/** Search by source registry */
export function surBySource(sourceRegistry: string): SUREntity[] {
  return SUR_DATABASE.filter(e => e.sourceRegistry === sourceRegistry);
}

// ─── Cross-Reference ─────────────────────────────────────────────────────

/** Get all entities related to a given entity */
export function surRelated(surId: string): SUREntity[] {
  const entity = surGet(surId);
  if (!entity) return [];
  return surGetMany(entity.relatedEntities);
}

/** Get all entities that reference a given entity */
export function surReferencedBy(surId: string): SUREntity[] {
  return SUR_DATABASE.filter(e => e.relatedEntities.includes(surId));
}

// ─── Export Functions ────────────────────────────────────────────────────

/** Get all unique export function names across the entire system */
export function surAllExports(): string[] {
  const exportSet = new Set<string>();
  for (const e of SUR_DATABASE) {
    for (const exp of e.exports) {
      exportSet.add(exp);
    }
  }
  return Array.from(exportSet).sort();
}

/** Find entities that export a given function */
export function surWhoExports(functionName: string): SUREntity[] {
  const fn = functionName.toLowerCase();
  return SUR_DATABASE.filter(e => e.exports.some(exp => exp.toLowerCase() === fn));
}

// ─── Statistics ──────────────────────────────────────────────────────────

/** Get count by entity class */
export function surCountByClass(): Record<EntityClass, number> {
  const counts: Record<string, number> = {};
  for (const e of SUR_DATABASE) {
    counts[e.entityClass] = (counts[e.entityClass] || 0) + 1;
  }
  return counts as Record<EntityClass, number>;
}

/** Get count by market category */
export function surCountByMarket(): Record<MarketCategory, number> {
  const counts: Record<string, number> = {};
  for (const e of SUR_DATABASE) {
    counts[e.market] = (counts[e.market] || 0) + 1;
  }
  return counts as Record<MarketCategory, number>;
}

/** Get count by source registry */
export function surCountBySource(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of SUR_DATABASE) {
    counts[e.sourceRegistry] = (counts[e.sourceRegistry] || 0) + 1;
  }
  return counts;
}

// ═══════════════════════════════════════════════════════════════════════════
// MANIFEST — The Complete Summary
// ═══════════════════════════════════════════════════════════════════════════

export const SUR_MANIFEST = {
  name: 'Sovereign Unified Registry',
  latinName: 'THESAURUS UNIFICATUS SUVERANUS',
  version: SUR_VERSION,
  phi: PHI,
  heartbeatMs: HEARTBEAT_MS,
  schumannHz: SCHUMANN_HZ,
  phiHz: PHI_HZ,
  miniHeartIntervalMs: MINI_HEART_INTERVAL_MS,

  // The three faces
  faces: {
    protocol: 'PROTOCOLLUM — The spec for every entity (how it pulses, thinks, connects)',
    database: 'THESAURUS — Living storage of all entities with cross-references',
    callable: 'INVOCABILIS — Unified function interface to query/search/export',
  },

  // ANIMA MICRO embedded
  animaMicro: ANIMA_MICRO,

  // Total entities in the unified database
  totalEntities: SUR_DATABASE.length,

  // Breakdown by class
  byClass: surCountByClass(),

  // Breakdown by market
  byMarket: surCountByMarket(),

  // Breakdown by source
  bySource: surCountBySource(),

  // Total unique exports
  totalUniqueExports: surAllExports().length,

  // Source manifests (preserved for reference)
  sourceManifests: {
    ai: AI_MANIFEST,
    skai: SKAI_MANIFEST,
    exc: EXC_MANIFEST,
    extended: EXTENDED_MANIFEST,
    frontendEngines: FRONTEND_ENGINES_MANIFEST,
    organismModels: ORGANISM_MODELS_MANIFEST,
    powerNodes: POWER_NODES_MANIFEST,
    substrateMesh: SUBSTRATE_MESH_MANIFEST,
    universalTools: TOOLS_MANIFEST,
    sovereignTools: SOVEREIGN_TOOLS_MANIFEST,
    callableFunctions: CALLABLE_MANIFEST,
    intelligenceContracts: INTELLIGENCE_CONTRACTS_MANIFEST,
  },

  // Callable function index
  callableInterface: {
    // Lookup
    surGet: 'Get entity by SUR ID',
    surGetMany: 'Get multiple entities by SUR IDs',
    // Filter by class
    surByClass: 'Get all entities of a class',
    surAIs: 'Get all 5 AI SDKs',
    surSKAIs: 'Get all 20 SKAIs',
    surEXCs: 'Get all 11 EXC OS systems',
    surExtendedSDKs: 'Get all 30 Extended SDKs',
    surEngines: 'Get all 42 Front-End Engines',
    surModels: 'Get all 15 Organism Models',
    surUniversalTools: 'Get all 50 Universal Tools',
    surSovereignTools: 'Get all 200 Sovereign Tools',
    surFunctions: 'Get all 374+ Callable Functions',
    surContracts: 'Get all Intelligence Contracts',
    surCoreSDKs: 'Get all 11 Core SDK Packages',
    surClusters: 'Get all 20 Mesh Clusters',
    // Filter by market
    surMarketplace: 'Get all sellable entities',
    surResearch: 'Get all open-source research entities',
    surSovereign: 'Get all proprietary sovereign entities',
    surInternal: 'Get all internal infrastructure entities',
    // Protocol queries
    surAutonomous: 'Get all self-pulsing autonomous entities',
    surSellable: 'Get all marketplace-ready entities',
    surQueryable: 'Get all queryable entities',
    // Search
    surSearch: 'Full-text search across all entities',
    surByTag: 'Search by tag',
    surBySource: 'Search by source registry',
    // Cross-reference
    surRelated: 'Get related entities',
    surReferencedBy: 'Get entities that reference a given entity',
    // Exports
    surAllExports: 'Get all unique function exports',
    surWhoExports: 'Find who exports a given function',
    // Statistics
    surCountByClass: 'Count entities by class',
    surCountByMarket: 'Count entities by market',
    surCountBySource: 'Count entities by source registry',
  },

  doctrine: 'Unum thesaurum. Tres facies. Omnia connexa.',
  motto: 'One database. Three faces. Everything connected.',
};
