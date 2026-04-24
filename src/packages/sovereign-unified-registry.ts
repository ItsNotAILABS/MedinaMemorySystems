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
 * │   • 32 Glyph Mappings (Egyptian, Chinese, I Ching, Sacred Geometry)   │
 * │   • 23 MEDINA OS Components (16 Laws + 4 Registers + 3 Gates)         │
 * │   • 11 SaaS Products                                                  │
 * │   • 14 Sovereign Contract Types + 14 Sovereign Ledger Types           │
 * │   • 300 Universal Models (MMS-001 to MMS-300)                         │
 * │   • 8 Formula Kernels + 5 Execution Flows                             │
 * │   • 35+ Document Paths (Genesis, Models, Living Docs, Organisms)      │
 * │   • 7 Organism Kernel Modules (Heart→Sandbox)                         │
 * │   • 20 Frequencies (Solfeggio + Schumann + Kernel)                    │
 * │   • 8 AGI Convergence Research Domains                                │
 * │   • 3 Platform Installer Configs                                      │
 * │   • 11 F-Model Categories + 4 ICP Intelligence Models                 │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ φ = 1.618033988749895 • Heartbeat = 873ms • Schumann = 7.83 Hz       │
 * │ "Unum thesaurum. Tres facies. Omnia connexa."                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMPORTS — Pull from ALL distributed registries
// ═══════════════════════════════════════════════════════════════════════════

// Existing: From src/packages/
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

// NEW: From src/lib/
import { GLYPH_TABLE } from '@/lib/kernelCompression';
import { DOCUMENT_PATHS, FORMULA_KERNELS, EXECUTION_FLOWS } from '@/lib/fullStackKernelRegistry';
import { MEDINA_OS, listSaaSProducts } from '@/lib/medinaOS';
import { CONTRACT_TYPE_INFO, LEDGER_TYPE_INFO } from '@/lib/sovereignContractsLedgers';
import { SOVEREIGN_AGI_MANIFEST, PACKAGE_REGISTRY as AGI_PACKAGE_REGISTRY } from '@/lib/sovereignAGIConvergence';
import { RESEARCH_DOMAINS } from '@/lib/agiConvergenceResearch';
import {
  HEART_GLYPH, NEURAL_GLYPH, ANIMAL_GLYPH, UNDERWORLD_GLYPH, SOVEREIGN_GLYPH, WORKFORCE_GLYPH, SANDBOX_GLYPH,
  HEART_FREQ, NEURAL_FREQ, ANIMAL_FREQ, UNDERWORLD_FREQ, SOVEREIGN_FREQ, WORKFORCE_FREQ, SANDBOX_FREQ,
  HEART_INTELLIGENCE, NEURAL_INTELLIGENCE, ANIMAL_INTELLIGENCE, UNDERWORLD_INTELLIGENCE, SOVEREIGN_INTELLIGENCE, WORKFORCE_INTELLIGENCE, SANDBOX_INTELLIGENCE,
} from '@/lib/organismKernelExecutor';

// NEW: From src/types/
import { MODEL_REGISTRY, SOLFEGGIO_FREQUENCIES, SCHUMANN_HARMONICS } from '@/types/organisms';
import { F_MODEL_CATEGORIES, ICP_INTELLIGENCE_MODELS } from '@/types';

// NEW: From src/packages/
import { INSTALLER_MANIFEST } from './terminal-installer-sdk';

// NEW WAVE 2: SDK Package Manifests + Data Functions
import { PACKAGE_MANIFEST as CIVILIZATION_MANIFEST, getCivilizations, getHeroJourney, getElements, getRhetoricalModes } from './civilization-pattern-engine';
import { PACKAGE_MANIFEST as DESIGN_MANIFEST, getDesignModels, getAllDesignUses } from './design-os-toolkit';
import { PACKAGE_MANIFEST as ENTERPRISE_MANIFEST, getConnectorTemplates } from './enterprise-integration-sdk';
import { PACKAGE_MANIFEST as GOVERNANCE_MANIFEST, getGates as getGovernanceGates } from './governance-protocol';
import { PACKAGE_MANIFEST as HARMONIC_MANIFEST, getPlatonicSolids, getSchumannFrequencies } from './harmonic-computation-engine';
import { PACKAGE_MANIFEST as ROUTING_MANIFEST, getModels as getModelFamilies, getTerminals } from './intelligence-routing-sdk';
import { PACKAGE_MANIFEST as NEURAL_MANIFEST, getAnimalBrains, getDreamPhases, getZoneStates, getConsciousnessLayers, getAlwaysOnMemorySystems, getTemporalDimensions } from './neural-consciousness-engine';
import { PACKAGE_MANIFEST as RUNTIME_MANIFEST } from './organism-runtime-sdk';
import { PACKAGE_MANIFEST as ENCRYPTION_MANIFEST } from './sovereign-encryption-sdk';
import { PACKAGE_MANIFEST as MEMORY_MANIFEST } from './sovereign-memory-sdk';
import { PACKAGE_MANIFEST as ABSORPTION_MANIFEST } from './document-absorption-engine';

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
 * EntityClass — The 27 classes of entities in the Medina system.
 * Every piece of data in the system belongs to exactly one class.
 */
export type EntityClass =
  | 'ai-sdk'             // 5 AI SDKs (Oro, Nova, Sentinel, Architect, Absorber)
  | 'skai'               // 20 Sovereign Knowledge AIs
  | 'exc-os'             // 11 EXC OS Systems
  | 'extended-sdk'       // 30 Extended SDKs
  | 'frontend-engine'    // 42 Front-End Engines
  | 'organism-model'     // 15 Organism Models (5 families × 3)
  | 'mesh-node'          // 2,000 Substrate Mesh Nodes
  | 'power-node'         // 500 Power Nodes
  | 'universal-tool'     // 50 Universal Micro-Tools
  | 'sovereign-tool'     // 200 Sovereign Tools
  | 'callable-function'  // 374+ Callable Functions
  | 'intelligence-contract' // Aggregated Intelligence Contracts
  | 'core-sdk'           // 11 Core SDK Packages
  | 'mesh-cluster'       // 20 Mesh Clusters
  | 'glyph'              // 32 Glyph Mappings (Egyptian, Chinese, I Ching, Sacred Geometry)
  | 'os-component'       // OS Laws (16), Registers (4), Gates (3) from MEDINA_OS
  | 'saas-product'       // 11 SaaS Products from medinaOS
  | 'contract-type'      // 14 Sovereign Contract Types
  | 'ledger-type'        // 14 Sovereign Ledger Types
  | 'universal-model'    // 300 Universal Models (MMS-001 to MMS-300)
  | 'formula-kernel'     // 8 Formula Kernels + 5 Execution Flows
  | 'document-path'      // 35+ Document Paths (Genesis, Models, Living Docs, Organisms)
  | 'organism-kernel'    // 7 Organism Kernel Modules (Heart, Neural, Animal, Underworld, Sovereign, Workforce, Sandbox)
  | 'frequency'          // Solfeggio (7) + Schumann Harmonics (6) + Kernel Frequencies (7)
  | 'research-domain'    // 8 AGI Convergence Research Domains
  | 'installer-config'   // 3 Platform Installer Configs
  | 'frontend-model-category' // 11 F-Model Categories + 4 ICP Intelligence Models
  | 'civilization'          // 34 Civilizations from civilization-pattern-engine
  | 'hero-stage'            // 12 Hero Journey Stages  
  | 'element'               // 5 Classical Elements (Fire, Earth, Air, Water, Aether)
  | 'rhetorical-mode'       // 7 Rhetorical Modes (Logos, Ethos, Pathos, Kairos, Telos, Mythos, Topos)
  | 'design-model'          // 10 MACHINA Design Models (GPU, 3D, PHOTO, etc.)
  | 'design-use'            // 50 Sovereign Design Uses
  | 'connector-template'    // 8 Enterprise Connectors (Salesforce, SAP, etc.)
  | 'governance-gate'       // 3 Governance Gates (A, B, C)
  | 'platonic-solid'        // 5 Platonic Solids
  | 'model-family'          // 8 Model Families (strategist, builder, analyst, etc.)
  | 'terminal-station'      // 10 Terminal Stations
  | 'animal-brain'          // Animal Brain architectures
  | 'dream-phase'           // 5 Dream Phases (wake, N1, N2, N3, REM)
  | 'consciousness-layer'   // Consciousness depth layers
  | 'zone-state'            // Cross-cultural flow states
  | 'memory-system'         // 6 Always-On Memory Systems
  | 'temporal-dimension'    // 3 Temporal Dimensions (past, present, future)
  | 'edge-type'             // 14 Edge Types from organismEdgeModel
  | 'chaos-category'        // 8 Chaos Lab Categories
  | 'shell-type';           // 5 Shell Types from crossOrganismResonance

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

  // ─────────────────────────────────────────────────────────────────────
  // 13. Glyphs (32) — from kernelCompression.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const glyph of GLYPH_TABLE) {
    entities.push({
      surId: `SUR::GLYPH::${glyph.dataType}`,
      name: `Glyph: ${glyph.glyph} (${glyph.dataType})`,
      latinName: `GLYPHUS_${glyph.dataType.toUpperCase()}`,
      entityClass: 'glyph',
      sourceRegistry: 'kernelCompression',
      version: SUR_VERSION,
      description: `${glyph.dataType} glyph ${glyph.glyph} — frequency ${glyph.frequency} Hz, geometry ${glyph.geometry}`,
      market: 'internal',
      license: 'Sovereign',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [glyph.glyph],
      tags: ['glyph', 'symbol', 'compression', glyph.dataType],
      protocol: {
        pulseCycle: glyph.frequency,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 14. MEDINA OS Components (23) — from medinaOS.ts
  //     16 Laws + 4 Registers + 3 Gates
  // ─────────────────────────────────────────────────────────────────────
  for (const law of [...MEDINA_OS.laws]) {
    entities.push({
      surId: `SUR::LAW::${law}`,
      name: law,
      latinName: `LEX_${law.replace('-', '_')}`,
      entityClass: 'os-component',
      sourceRegistry: 'medinaOS',
      version: SUR_VERSION,
      description: `MEDINA OS Law: ${law}`,
      market: 'sovereign',
      license: 'Sovereign',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['os', 'law', 'medina-os'],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: true,
      },
    });
  }

  for (const register of [...MEDINA_OS.registers]) {
    entities.push({
      surId: `SUR::REG::${register}`,
      name: register,
      latinName: `REGISTRUM_${register.toUpperCase()}`,
      entityClass: 'os-component',
      sourceRegistry: 'medinaOS',
      version: SUR_VERSION,
      description: `MEDINA OS Register: ${register}`,
      market: 'sovereign',
      license: 'Sovereign',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['os', 'register', 'medina-os'],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  for (const gate of [...MEDINA_OS.gates]) {
    entities.push({
      surId: `SUR::GATE::${gate}`,
      name: gate,
      latinName: `PORTA_${gate.replace(/[^A-Za-z]/g, '_').toUpperCase()}`,
      entityClass: 'os-component',
      sourceRegistry: 'medinaOS',
      version: SUR_VERSION,
      description: `MEDINA OS Gate: ${gate}`,
      market: 'sovereign',
      license: 'Sovereign',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['os', 'gate', 'medina-os'],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 15. SaaS Products (11) — from medinaOS.ts
  // ─────────────────────────────────────────────────────────────────────
  const saasProducts = listSaaSProducts();
  for (const product of saasProducts) {
    entities.push({
      surId: `SUR::SAAS::${product.id}`,
      name: product.name,
      latinName: `SERVITIUM_${product.id.toUpperCase().replace(/-/g, '_')}`,
      entityClass: 'saas-product',
      sourceRegistry: 'medinaOS',
      version: SUR_VERSION,
      description: product.description,
      market: product.internalOnly ? 'internal' : 'marketplace',
      license: product.internalOnly ? 'Sovereign' : 'MIT + Proprietary',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: product.capabilities,
      tags: ['saas', 'product', product.layer, ...product.aiModels],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: !product.internalOnly,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 16. Contract Types (14) — from sovereignContractsLedgers.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const [key, value] of Object.entries(CONTRACT_TYPE_INFO)) {
    entities.push({
      surId: `SUR::CTYPE::${key}`,
      name: value.name,
      latinName: `CONTRACTUS_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`,
      entityClass: 'contract-type',
      sourceRegistry: 'sovereignContractsLedgers',
      version: SUR_VERSION,
      description: value.description,
      market: 'sovereign',
      license: 'Sovereign',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['contract', 'type', 'sovereign', 'encryption'],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 17. Ledger Types (14) — from sovereignContractsLedgers.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const [key, value] of Object.entries(LEDGER_TYPE_INFO)) {
    entities.push({
      surId: `SUR::LTYPE::${key}`,
      name: value.name,
      latinName: `LIBER_${key.toUpperCase()}`,
      entityClass: 'ledger-type',
      sourceRegistry: 'sovereignContractsLedgers',
      version: SUR_VERSION,
      description: value.description,
      market: 'sovereign',
      license: 'Sovereign',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['ledger', 'type', 'sovereign', 'distributed'],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 18. Universal Models (300) — from types/organisms.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const [key, value] of Object.entries(MODEL_REGISTRY) as [string, string][]) {
    const idParts = value.split('-');
    const domainFromId = idParts.length >= 3 ? idParts.slice(2).join('-').toLowerCase() : 'general';
    entities.push({
      surId: `SUR::UMODEL::${value}`,
      name: key,
      latinName: key,
      entityClass: 'universal-model',
      sourceRegistry: 'organisms',
      version: SUR_VERSION,
      description: `Universal Model ${value}: ${key}`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['model', 'universal', 'mms', domainFromId],
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
  // 19. Formula Kernels (8) — from fullStackKernelRegistry.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const kernel of FORMULA_KERNELS) {
    entities.push({
      surId: `SUR::FORMULA::${kernel.id}`,
      name: kernel.formulaName,
      latinName: `FORMULA_${kernel.id}`,
      entityClass: 'formula-kernel',
      sourceRegistry: 'fullStackKernelRegistry',
      version: SUR_VERSION,
      description: `Formula: ${kernel.formulaName} (${kernel.glyphSignature})`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['formula', 'kernel', 'computation', String(kernel.formula)],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 20. Execution Flows (5) — from fullStackKernelRegistry.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const flow of EXECUTION_FLOWS) {
    entities.push({
      surId: `SUR::FLOW::${flow.id}`,
      name: flow.flowName,
      latinName: `FLUXUS_${flow.id}`,
      entityClass: 'formula-kernel',
      sourceRegistry: 'fullStackKernelRegistry',
      version: SUR_VERSION,
      description: `Execution Flow: ${flow.flowName} (${flow.glyphSignature})`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['flow', 'execution', 'kernel'],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 21. Document Paths (35+) — from fullStackKernelRegistry.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const [key, value] of Object.entries(DOCUMENT_PATHS) as [string, string][]) {
    const pathParts = value.split('/');
    const category = pathParts.length >= 2 ? pathParts[1] : 'root';
    entities.push({
      surId: `SUR::DOC::${key}`,
      name: key,
      latinName: `DOCUMENTUM_${key}`,
      entityClass: 'document-path',
      sourceRegistry: 'fullStackKernelRegistry',
      version: SUR_VERSION,
      description: `Document path: ${value}`,
      market: 'internal',
      license: 'Sovereign',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['document', 'path', 'organism', category],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 22. Organism Kernels (7) — from organismKernelExecutor.ts
  // ─────────────────────────────────────────────────────────────────────
  const kernelModules = [
    { id: 'HEART', glyph: HEART_GLYPH, freq: HEART_FREQ, intel: HEART_INTELLIGENCE },
    { id: 'NEURAL', glyph: NEURAL_GLYPH, freq: NEURAL_FREQ, intel: NEURAL_INTELLIGENCE },
    { id: 'ANIMAL', glyph: ANIMAL_GLYPH, freq: ANIMAL_FREQ, intel: ANIMAL_INTELLIGENCE },
    { id: 'UNDERWORLD', glyph: UNDERWORLD_GLYPH, freq: UNDERWORLD_FREQ, intel: UNDERWORLD_INTELLIGENCE },
    { id: 'SOVEREIGN', glyph: SOVEREIGN_GLYPH, freq: SOVEREIGN_FREQ, intel: SOVEREIGN_INTELLIGENCE },
    { id: 'WORKFORCE', glyph: WORKFORCE_GLYPH, freq: WORKFORCE_FREQ, intel: WORKFORCE_INTELLIGENCE },
    { id: 'SANDBOX', glyph: SANDBOX_GLYPH, freq: SANDBOX_FREQ, intel: SANDBOX_INTELLIGENCE },
  ];

  for (const mod of kernelModules) {
    entities.push({
      surId: `SUR::KERNEL::${mod.id}`,
      name: `${mod.id} Kernel`,
      latinName: `NUCLEUS_${mod.id}`,
      entityClass: 'organism-kernel',
      sourceRegistry: 'organismKernelExecutor',
      version: SUR_VERSION,
      description: `Organism kernel: ${mod.id} — ${mod.intel} — glyph: ${mod.glyph}`,
      market: 'research',
      license: 'Sovereign',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [mod.glyph, mod.intel],
      tags: ['kernel', 'organism', 'execution', mod.id.toLowerCase()],
      protocol: {
        pulseCycle: mod.freq,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: true,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 23. Frequencies (20) — Solfeggio (7) + Schumann (6) + Kernel (7)
  // ─────────────────────────────────────────────────────────────────────

  // 7 Solfeggio Frequencies
  for (const [key, value] of Object.entries(SOLFEGGIO_FREQUENCIES)) {
    entities.push({
      surId: `SUR::FREQ::SOLFEGGIO_${key}`,
      name: `Solfeggio ${key}`,
      latinName: `FREQUENTIA_SOLFEGGIO_${key}`,
      entityClass: 'frequency',
      sourceRegistry: 'organisms',
      version: SUR_VERSION,
      description: `Solfeggio frequency ${key}: ${value} Hz`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['frequency', 'solfeggio', key.toLowerCase(), `${value}hz`],
      protocol: {
        pulseCycle: value as number,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // 6 Schumann Harmonics (harmonics 2-7)
  for (let i = 0; i < SCHUMANN_HARMONICS.length; i++) {
    const harmonic = SCHUMANN_HARMONICS[i];
    const harmonicNumber = i + 2;
    entities.push({
      surId: `SUR::FREQ::SCHUMANN_${harmonicNumber}`,
      name: `Schumann Harmonic ${harmonicNumber}`,
      latinName: `FREQUENTIA_SCHUMANN_${harmonicNumber}`,
      entityClass: 'frequency',
      sourceRegistry: 'organisms',
      version: SUR_VERSION,
      description: `Schumann harmonic ${harmonicNumber}: ${harmonic} Hz`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['frequency', 'schumann', 'harmonic', `${harmonic}hz`],
      protocol: {
        pulseCycle: harmonic,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // 7 Kernel Frequencies (standalone frequency entries from organism kernels)
  for (const mod of kernelModules) {
    entities.push({
      surId: `SUR::FREQ::KERNEL_${mod.id}`,
      name: `Kernel Frequency: ${mod.id}`,
      latinName: `FREQUENTIA_NUCLEUS_${mod.id}`,
      entityClass: 'frequency',
      sourceRegistry: 'organismKernelExecutor',
      version: SUR_VERSION,
      description: `Kernel frequency for ${mod.id}: ${mod.freq} Hz`,
      market: 'research',
      license: 'Sovereign',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [`SUR::KERNEL::${mod.id}`],
      exports: [],
      tags: ['frequency', 'kernel', mod.id.toLowerCase(), `${mod.freq}hz`],
      protocol: {
        pulseCycle: mod.freq,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 24. Research Domains (8) — from agiConvergenceResearch.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const domain of [...RESEARCH_DOMAINS]) {
    const formatted = domain.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    entities.push({
      surId: `SUR::RESEARCH::${domain}`,
      name: formatted,
      latinName: `INVESTIGATIO_${domain.toUpperCase().replace(/-/g, '_')}`,
      entityClass: 'research-domain',
      sourceRegistry: 'agiConvergenceResearch',
      version: SUR_VERSION,
      description: `AGI Convergence Research Domain: ${formatted}`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['research', 'agi', 'convergence', domain],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 25. F-Model Categories (11) + ICP Intelligence Models (4)
  //     — from types/index.ts
  // ─────────────────────────────────────────────────────────────────────
  for (const [key, value] of Object.entries(F_MODEL_CATEGORIES)) {
    const catValue = value as { count: number; range: string };
    entities.push({
      surId: `SUR::FCAT::${key}`,
      name: `F-Model: ${key}`,
      latinName: `CATEGORIA_F_${key.toUpperCase().replace(/-/g, '_')}`,
      entityClass: 'frontend-model-category',
      sourceRegistry: 'types',
      version: SUR_VERSION,
      description: `${catValue.count} models (${catValue.range})`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['f-model', 'category', 'frontend', key],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  for (const model of [...ICP_INTELLIGENCE_MODELS]) {
    entities.push({
      surId: `SUR::FICPM::${model}`,
      name: `ICP Intelligence: ${model}`,
      latinName: `INTELLIGENTIA_ICP_${model.replace(/-/g, '_')}`,
      entityClass: 'frontend-model-category',
      sourceRegistry: 'types',
      version: SUR_VERSION,
      description: `ICP Intelligence Model: ${model}`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['icp', 'intelligence', 'model', model],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 26. Installer Configs (1) — from terminal-installer-sdk.ts
  // ─────────────────────────────────────────────────────────────────────
  entities.push({
    surId: `SUR::INSTALLER::manifest`,
    name: 'Terminal Installer SDK',
    latinName: 'INSTALLATIO_TERMINALIS',
    entityClass: 'installer-config',
    sourceRegistry: 'terminal-installer-sdk',
    version: SUR_VERSION,
    description: `Terminal Installer SDK — ${INSTALLER_MANIFEST.totalInstallers} installers across ${Object.keys(INSTALLER_MANIFEST.platforms).length} platforms`,
    market: 'marketplace',
    license: 'MIT + Proprietary',
    heartbeatMs: HEARTBEAT_MS,
    phiWeight: PHI,
    relatedEntities: [],
    exports: [],
    tags: ['installer', 'terminal', 'electron', 'sdk'],
    protocol: {
      pulseCycle: PHI_HZ,
      thinkCycle: SCHUMANN_HZ,
      canBeSold: true,
      canBeQueried: true,
      isAutonomous: false,
    },
  });

  // ─────────────────────────────────────────────────────────────────────
  // 27. Civilizations (34) — from civilization-pattern-engine.ts
  // ─────────────────────────────────────────────────────────────────────
  const civilizations = getCivilizations();
  for (const civ of civilizations) {
    entities.push({
      surId: `SUR::CIV::${civ.name.toUpperCase().replace(/\s+/g, '_')}`,
      name: civ.name,
      latinName: `CIVILIZATIO_${civ.name.toUpperCase().replace(/\s+/g, '_')}`,
      entityClass: 'civilization',
      sourceRegistry: 'civilization-pattern-engine',
      version: SUR_VERSION,
      description: `${civ.name} civilization — ${civ.era} era, ${civ.region}`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: civ.contributions || [],
      tags: ['civilization', 'pattern', 'culture', civ.name.toLowerCase(), civ.era || '', civ.region || ''],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 28. Hero Journey Stages (12) — from civilization-pattern-engine.ts
  // ─────────────────────────────────────────────────────────────────────
  const heroStages = getHeroJourney();
  for (const stage of heroStages) {
    entities.push({
      surId: `SUR::HERO::${stage.name.toUpperCase().replace(/\s+/g, '_')}`,
      name: `Hero: ${stage.name}`,
      latinName: `HEROS_${stage.name.toUpperCase().replace(/\s+/g, '_')}`,
      entityClass: 'hero-stage',
      sourceRegistry: 'civilization-pattern-engine',
      version: SUR_VERSION,
      description: stage.description,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['hero', 'journey', 'archetype', stage.phase.toLowerCase()],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 29. Classical Elements (5) — from civilization-pattern-engine.ts
  // ─────────────────────────────────────────────────────────────────────
  const elements = getElements();
  for (const el of elements) {
    entities.push({
      surId: `SUR::ELEMENT::${el.element.toUpperCase()}`,
      name: `Element: ${el.element}`,
      latinName: `ELEMENTUM_${el.element.toUpperCase()}`,
      entityClass: 'element',
      sourceRegistry: 'civilization-pattern-engine',
      version: SUR_VERSION,
      description: `Classical element: ${el.element} — ${el.physicalCorrelate}, ${el.direction}`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['element', 'classical', el.element.toLowerCase(), el.physicalCorrelate || '', el.direction || ''],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 30. Rhetorical Modes (7) — from civilization-pattern-engine.ts
  // ─────────────────────────────────────────────────────────────────────
  const modes = getRhetoricalModes();
  for (const mode of modes) {
    entities.push({
      surId: `SUR::RHETORIC::${mode.greekName.toUpperCase()}`,
      name: `Rhetoric: ${mode.greekName}`,
      latinName: `RHETORICA_${mode.greekName.toUpperCase()}`,
      entityClass: 'rhetorical-mode',
      sourceRegistry: 'civilization-pattern-engine',
      version: SUR_VERSION,
      description: mode.meaning,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['rhetoric', 'mode', 'persuasion', mode.greekName.toLowerCase()],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 31. MACHINA Design Models (10) — from design-os-toolkit.ts
  // ─────────────────────────────────────────────────────────────────────
  const designModels = getDesignModels();
  for (const model of designModels) {
    entities.push({
      surId: `SUR::DESIGN::${model.category}`,
      name: `MACHINA ${model.category}: ${model.machinaName}`,
      latinName: `MACHINA_${model.category}`,
      entityClass: 'design-model',
      sourceRegistry: 'design-os-toolkit',
      version: SUR_VERSION,
      description: `${model.machinaName} — ${model.motto}`,
      market: 'marketplace',
      license: 'MIT + Proprietary',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['design', 'machina', 'visual', model.category.toLowerCase(), model.replacesIndustry || ''],
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
  // 32. Sovereign Design Uses (50) — from design-os-toolkit.ts
  // ─────────────────────────────────────────────────────────────────────
  const designUses = getAllDesignUses();
  for (const use of designUses) {
    entities.push({
      surId: `SUR::DUSE::${use.id}`,
      name: use.name,
      latinName: `USUS_${use.id.toUpperCase().replace(/-/g, '_')}`,
      entityClass: 'design-use',
      sourceRegistry: 'design-os-toolkit',
      version: SUR_VERSION,
      description: use.description,
      market: 'marketplace',
      license: 'MIT + Proprietary',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['design', 'use', 'sovereign'],
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
  // 33. Enterprise Connectors (8) — from enterprise-integration-sdk.ts
  // ─────────────────────────────────────────────────────────────────────
  const connectors = getConnectorTemplates();
  for (const conn of connectors) {
    entities.push({
      surId: `SUR::CONN::${conn.id}`,
      name: conn.name,
      latinName: `CONNEXIO_${conn.id.toUpperCase().replace(/-/g, '_')}`,
      entityClass: 'connector-template',
      sourceRegistry: 'enterprise-integration-sdk',
      version: SUR_VERSION,
      description: `Enterprise connector: ${conn.name} (${conn.status || 'standard'})`,
      market: 'marketplace',
      license: 'MIT + Proprietary',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: conn.capabilities || [],
      tags: ['connector', 'enterprise', 'integration', conn.name.toLowerCase()],
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
  // 34. Governance Gates (3) — from governance-protocol.ts
  // ─────────────────────────────────────────────────────────────────────
  const govGates = getGovernanceGates();
  for (const gate of govGates) {
    entities.push({
      surId: `SUR::GGATE::${gate.id}`,
      name: `Governance Gate ${gate.id}: ${gate.name}`,
      latinName: `PORTA_GUBERNATIONIS_${gate.id}`,
      entityClass: 'governance-gate',
      sourceRegistry: 'governance-protocol',
      version: SUR_VERSION,
      description: gate.description,
      market: 'sovereign',
      license: 'Sovereign',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['gate', 'governance', 'protocol', gate.id.toLowerCase(), gate.name.toLowerCase()],
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
  // 35. Platonic Solids (5) — from harmonic-computation-engine.ts
  // ─────────────────────────────────────────────────────────────────────
  const platonics = getPlatonicSolids();
  for (const solid of platonics) {
    entities.push({
      surId: `SUR::PLATONIC::${solid.name.toUpperCase().replace(/\s+/g, '_')}`,
      name: solid.name,
      latinName: `SOLIDUM_${solid.name.toUpperCase().replace(/\s+/g, '_')}`,
      entityClass: 'platonic-solid',
      sourceRegistry: 'harmonic-computation-engine',
      version: SUR_VERSION,
      description: `Platonic solid: ${solid.name} — ${solid.faces} faces, ${solid.vertices} vertices, ${solid.edges} edges`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['platonic', 'solid', 'geometry', 'sacred', solid.name.toLowerCase(), solid.element || ''],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 36. Model Families (8) — from intelligence-routing-sdk.ts
  // ─────────────────────────────────────────────────────────────────────
  const modelFamilies = getModelFamilies();
  for (const fam of modelFamilies) {
    entities.push({
      surId: `SUR::MFAM::${fam.name.toUpperCase().replace(/\s+/g, '_')}`,
      name: `Model Family: ${fam.name}`,
      latinName: `FAMILIA_${fam.name.toUpperCase().replace(/[\s-]+/g, '_')}`,
      entityClass: 'model-family',
      sourceRegistry: 'intelligence-routing-sdk',
      version: SUR_VERSION,
      description: fam.description || `Intelligence model family: ${fam.name}`,
      market: 'marketplace',
      license: 'MIT + Proprietary',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: fam.capabilities || [],
      tags: ['model', 'family', 'intelligence', 'routing', fam.name.toLowerCase()],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: true,
        canBeQueried: true,
        isAutonomous: true,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 37. Terminal Stations (10) — from intelligence-routing-sdk.ts
  // ─────────────────────────────────────────────────────────────────────
  const terminals = getTerminals();
  for (const term of terminals) {
    entities.push({
      surId: `SUR::TERM::${term.command.replace(/\//g, '').toUpperCase()}`,
      name: `Terminal: ${term.command}`,
      latinName: `TERMINUS_${term.command.replace(/\//g, '').toUpperCase()}`,
      entityClass: 'terminal-station',
      sourceRegistry: 'intelligence-routing-sdk',
      version: SUR_VERSION,
      description: term.motto,
      market: 'marketplace',
      license: 'MIT + Proprietary',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: (term.functionIds || []).map(String),
      tags: ['terminal', 'station', 'command', term.command.replace(/\//g, '')],
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
  // 38. Animal Brains — from neural-consciousness-engine.ts
  // ─────────────────────────────────────────────────────────────────────
  const animalBrains = getAnimalBrains();
  for (const brain of animalBrains) {
    entities.push({
      surId: `SUR::BRAIN::${brain.animal.toUpperCase().replace(/\s+/g, '_')}`,
      name: `Animal Brain: ${brain.animal}`,
      latinName: `CEREBRUM_${brain.animal.toUpperCase().replace(/\s+/g, '_')}`,
      entityClass: 'animal-brain',
      sourceRegistry: 'neural-consciousness-engine',
      version: SUR_VERSION,
      description: `${brain.animal} brain architecture — ${brain.specialization}`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['brain', 'animal', 'neural', 'consciousness', brain.animal.toLowerCase()],
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
  // 39. Dream Phases (5) — from neural-consciousness-engine.ts
  // ─────────────────────────────────────────────────────────────────────
  const dreamPhases = getDreamPhases();
  for (const phase of dreamPhases) {
    entities.push({
      surId: `SUR::DREAM::${phase.phase.toUpperCase()}`,
      name: `Dream Phase: ${phase.phase}`,
      latinName: `SOMNIUM_${phase.phase.toUpperCase()}`,
      entityClass: 'dream-phase',
      sourceRegistry: 'neural-consciousness-engine',
      version: SUR_VERSION,
      description: `${phase.phase} — ${phase.brainWaves}, ${phase.primaryFunction}`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['dream', 'phase', 'consciousness', 'sleep', phase.phase.toLowerCase()],
      protocol: {
        pulseCycle: phase.frequency || PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: true,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 40. Consciousness Layers — from neural-consciousness-engine.ts
  // ─────────────────────────────────────────────────────────────────────
  const consciousnessLayers = getConsciousnessLayers();
  for (const layer of consciousnessLayers) {
    entities.push({
      surId: `SUR::CONSC::${layer.name.toUpperCase().replace(/\s+/g, '_')}`,
      name: `Consciousness: ${layer.name}`,
      latinName: `CONSCIENTIA_${layer.name.toUpperCase().replace(/\s+/g, '_')}`,
      entityClass: 'consciousness-layer',
      sourceRegistry: 'neural-consciousness-engine',
      version: SUR_VERSION,
      description: `${layer.name} — ${layer.content}`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['consciousness', 'layer', 'depth', 'neural', layer.name.toLowerCase()],
      protocol: {
        pulseCycle: layer.frequency ?? PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: true,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 41. Zone States — from neural-consciousness-engine.ts
  // ─────────────────────────────────────────────────────────────────────
  const zoneStates = getZoneStates();
  for (const zone of zoneStates) {
    entities.push({
      surId: `SUR::ZONE::${zone.name.toUpperCase().replace(/\s+/g, '_')}`,
      name: `Zone: ${zone.name}`,
      latinName: `ZONA_${zone.name.toUpperCase().replace(/\s+/g, '_')}`,
      entityClass: 'zone-state',
      sourceRegistry: 'neural-consciousness-engine',
      version: SUR_VERSION,
      description: zone.description,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['zone', 'flow', 'consciousness', 'state', zone.name.toLowerCase()],
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
  // 42. Always-On Memory Systems (6) — from neural-consciousness-engine.ts
  // ─────────────────────────────────────────────────────────────────────
  const memorySystems = getAlwaysOnMemorySystems();
  for (const mem of memorySystems) {
    entities.push({
      surId: `SUR::MEMSYS::${mem.type.toUpperCase()}`,
      name: `Memory System: ${mem.type}`,
      latinName: `MEMORIA_${mem.type.toUpperCase()}`,
      entityClass: 'memory-system',
      sourceRegistry: 'neural-consciousness-engine',
      version: SUR_VERSION,
      description: mem.description,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['memory', 'system', 'always-on', 'neural', mem.type.toLowerCase()],
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
  // 43. Temporal Dimensions (3) — from neural-consciousness-engine.ts
  // ─────────────────────────────────────────────────────────────────────
  const temporals = getTemporalDimensions();
  for (const dim of temporals) {
    entities.push({
      surId: `SUR::TEMPORAL::${dim.dimension.toUpperCase()}`,
      name: `Temporal: ${dim.dimension}`,
      latinName: `TEMPUS_${dim.dimension.toUpperCase()}`,
      entityClass: 'temporal-dimension',
      sourceRegistry: 'neural-consciousness-engine',
      version: SUR_VERSION,
      description: `${dim.dimension} — ${dim.focus}, ${dim.processingType}`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['temporal', 'dimension', 'time', 'consciousness', dim.dimension.toLowerCase()],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 44. Edge Types (14) — enumerated from organism edge model
  // ─────────────────────────────────────────────────────────────────────
  const edgeTypes = [
    'null-value', 'undefined-value', 'empty-array', 'empty-string',
    'network-failure', 'permission-denied', 'timeout', 'invalid-input',
    'state-corruption', 'api-error', 'browser-incompatibility',
    'rate-limit', 'quota-exceeded', 'concurrency-conflict',
  ];
  for (const et of edgeTypes) {
    entities.push({
      surId: `SUR::EDGE::${et.toUpperCase().replace(/-/g, '_')}`,
      name: `Edge: ${et}`,
      latinName: `ACIES_${et.toUpperCase().replace(/-/g, '_')}`,
      entityClass: 'edge-type',
      sourceRegistry: 'organismEdgeModel',
      version: SUR_VERSION,
      description: `Edge type: ${et} — organism boundary condition`,
      market: 'internal',
      license: 'Sovereign',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['edge', 'type', 'boundary', 'organism', et],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 45. Chaos Categories (8) — enumerated from chaosLabEngine
  // ─────────────────────────────────────────────────────────────────────
  const chaosCategories = [
    'entropy-flood', 'edge-probe', 'resonance-disruption', 'frequency-shift',
    'state-corruption', 'load-surge', 'coherence-inversion', 'timing-skew',
  ];
  for (const cat of chaosCategories) {
    entities.push({
      surId: `SUR::CHAOS::${cat.toUpperCase().replace(/-/g, '_')}`,
      name: `Chaos: ${cat}`,
      latinName: `CHAOS_${cat.toUpperCase().replace(/-/g, '_')}`,
      entityClass: 'chaos-category',
      sourceRegistry: 'chaosLabEngine',
      version: SUR_VERSION,
      description: `Chaos category: ${cat} — controlled perturbation for edge discovery`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['chaos', 'category', 'lab', 'experiment', cat],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: false,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 46. Shell Types (5) — enumerated from crossOrganismResonance
  // ─────────────────────────────────────────────────────────────────────
  const shellTypes = ['Sovereign', 'Workforce', 'Document', 'Kernel', 'Hybrid'];
  for (const shell of shellTypes) {
    entities.push({
      surId: `SUR::SHELL::${shell.toUpperCase()}`,
      name: `Shell: ${shell}`,
      latinName: `TESTA_${shell.toUpperCase()}`,
      entityClass: 'shell-type',
      sourceRegistry: 'crossOrganismResonance',
      version: SUR_VERSION,
      description: `Organism shell type: ${shell} — resonance container for cross-organism communication`,
      market: 'research',
      license: 'MIT',
      heartbeatMs: HEARTBEAT_MS,
      phiWeight: PHI,
      relatedEntities: [],
      exports: [],
      tags: ['shell', 'type', 'resonance', 'organism', shell.toLowerCase()],
      protocol: {
        pulseCycle: PHI_HZ,
        thinkCycle: SCHUMANN_HZ,
        canBeSold: false,
        canBeQueried: true,
        isAutonomous: true,
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

/** Get all glyphs */
export function surGlyphs(): SUREntity[] { return surByClass('glyph'); }

/** Get all OS components (laws, registers, gates) */
export function surOSComponents(): SUREntity[] { return surByClass('os-component'); }

/** Get all SaaS products */
export function surSaaSProducts(): SUREntity[] { return surByClass('saas-product'); }

/** Get all contract types */
export function surContractTypes(): SUREntity[] { return surByClass('contract-type'); }

/** Get all ledger types */
export function surLedgerTypes(): SUREntity[] { return surByClass('ledger-type'); }

/** Get all 300 universal models */
export function surUniversalModels(): SUREntity[] { return surByClass('universal-model'); }

/** Get all formula kernels and execution flows */
export function surFormulaKernels(): SUREntity[] { return surByClass('formula-kernel'); }

/** Get all document paths */
export function surDocumentPaths(): SUREntity[] { return surByClass('document-path'); }

/** Get all organism kernels */
export function surOrganismKernels(): SUREntity[] { return surByClass('organism-kernel'); }

/** Get all frequencies (solfeggio, schumann, kernel) */
export function surFrequencies(): SUREntity[] { return surByClass('frequency'); }

/** Get all research domains */
export function surResearchDomains(): SUREntity[] { return surByClass('research-domain'); }

/** Get all installer configs */
export function surInstallerConfigs(): SUREntity[] { return surByClass('installer-config'); }

/** Get all frontend model categories */
export function surFModelCategories(): SUREntity[] { return surByClass('frontend-model-category'); }

/** Get all civilizations */
export function surCivilizations(): SUREntity[] { return surByClass('civilization'); }

/** Get all hero journey stages */
export function surHeroStages(): SUREntity[] { return surByClass('hero-stage'); }

/** Get all classical elements */
export function surElements(): SUREntity[] { return surByClass('element'); }

/** Get all rhetorical modes */
export function surRhetoricalModes(): SUREntity[] { return surByClass('rhetorical-mode'); }

/** Get all MACHINA design models */
export function surDesignModels(): SUREntity[] { return surByClass('design-model'); }

/** Get all sovereign design uses */
export function surDesignUses(): SUREntity[] { return surByClass('design-use'); }

/** Get all enterprise connector templates */
export function surConnectors(): SUREntity[] { return surByClass('connector-template'); }

/** Get all governance gates from protocol */
export function surGovernanceGates(): SUREntity[] { return surByClass('governance-gate'); }

/** Get all Platonic solids */
export function surPlatonicSolids(): SUREntity[] { return surByClass('platonic-solid'); }

/** Get all model families */
export function surModelFamilies(): SUREntity[] { return surByClass('model-family'); }

/** Get all terminal stations */
export function surTerminals(): SUREntity[] { return surByClass('terminal-station'); }

/** Get all animal brain architectures */
export function surAnimalBrains(): SUREntity[] { return surByClass('animal-brain'); }

/** Get all dream phases */
export function surDreamPhases(): SUREntity[] { return surByClass('dream-phase'); }

/** Get all consciousness layers */
export function surConsciousnessLayers(): SUREntity[] { return surByClass('consciousness-layer'); }

/** Get all zone states */
export function surZoneStates(): SUREntity[] { return surByClass('zone-state'); }

/** Get all always-on memory systems */
export function surMemorySystems(): SUREntity[] { return surByClass('memory-system'); }

/** Get all temporal dimensions */
export function surTemporalDimensions(): SUREntity[] { return surByClass('temporal-dimension'); }

/** Get all edge types */
export function surEdgeTypes(): SUREntity[] { return surByClass('edge-type'); }

/** Get all chaos categories */
export function surChaosCategories(): SUREntity[] { return surByClass('chaos-category'); }

/** Get all shell types */
export function surShellTypes(): SUREntity[] { return surByClass('shell-type'); }

// ─── Advanced Queries ─────────────────────────────────────────────────

/** Get entities by license type */
export function surByLicense(license: LicenseType): SUREntity[] {
  return SUR_DATABASE.filter(e => e.license === license);
}

/** Get entities within a frequency range */
export function surByFrequencyRange(minHz: number, maxHz: number): SUREntity[] {
  return SUR_DATABASE.filter(e => e.protocol.pulseCycle >= minHz && e.protocol.pulseCycle <= maxHz);
}

/** Get total entity count */
export function surTotalCount(): number {
  return SUR_DATABASE.length;
}

/** Get all unique tags across the entire system */
export function surAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const e of SUR_DATABASE) {
    for (const t of e.tags) {
      if (t) tagSet.add(t);
    }
  }
  return Array.from(tagSet).sort();
}

/** Get count of unique tags */
export function surTagCount(): number {
  return surAllTags().length;
}

/** Get all unique source registries */
export function surAllSources(): string[] {
  return [...new Set(SUR_DATABASE.map(e => e.sourceRegistry))].sort();
}

/** Get top N entity classes by count */
export function surTopClasses(n = 10): { entityClass: EntityClass; count: number }[] {
  const counts = surCountByClass();
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([cls, count]) => ({ entityClass: cls as EntityClass, count }));
}

/** Get complete system statistics */
export function surStats(): {
  totalEntities: number;
  totalClasses: number;
  totalSources: number;
  totalExports: number;
  totalTags: number;
  byMarket: Record<string, number>;
  byClass: Record<string, number>;
  autonomous: number;
  sellable: number;
} {
  return {
    totalEntities: SUR_DATABASE.length,
    totalClasses: Object.keys(surCountByClass()).length,
    totalSources: surAllSources().length,
    totalExports: surAllExports().length,
    totalTags: surTagCount(),
    byMarket: surCountByMarket(),
    byClass: surCountByClass(),
    autonomous: surAutonomous().length,
    sellable: surSellable().length,
  };
}

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
    agiConvergence: SOVEREIGN_AGI_MANIFEST,
    installer: INSTALLER_MANIFEST,
    civilization: CIVILIZATION_MANIFEST,
    design: DESIGN_MANIFEST,
    enterprise: ENTERPRISE_MANIFEST,
    governance: GOVERNANCE_MANIFEST,
    harmonic: HARMONIC_MANIFEST,
    routing: ROUTING_MANIFEST,
    neural: NEURAL_MANIFEST,
    runtime: RUNTIME_MANIFEST,
    encryption: ENCRYPTION_MANIFEST,
    memory: MEMORY_MANIFEST,
    absorption: ABSORPTION_MANIFEST,
  },

  // AGI convergence reference
  agiPackageRegistry: AGI_PACKAGE_REGISTRY,

  // Callable function index
  callableInterface: {
    // Lookup
    surGet: 'Get entity by SUR ID',
    surGetMany: 'Get multiple entities by SUR IDs',
    // Filter by class (original 12)
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
    // Filter by class (new 13)
    surGlyphs: 'Get all 32 Glyph Mappings',
    surOSComponents: 'Get all 23 MEDINA OS Components (Laws + Registers + Gates)',
    surSaaSProducts: 'Get all 11 SaaS Products',
    surContractTypes: 'Get all 14 Sovereign Contract Types',
    surLedgerTypes: 'Get all 14 Sovereign Ledger Types',
    surUniversalModels: 'Get all 300 Universal Models (MMS-001 to MMS-300)',
    surFormulaKernels: 'Get all Formula Kernels + Execution Flows',
    surDocumentPaths: 'Get all 35+ Document Paths',
    surOrganismKernels: 'Get all 7 Organism Kernel Modules',
    surFrequencies: 'Get all 20 Frequencies (Solfeggio + Schumann + Kernel)',
    surResearchDomains: 'Get all 8 AGI Convergence Research Domains',
    surInstallerConfigs: 'Get Installer Configs',
    surFModelCategories: 'Get all 11 F-Model Categories + 4 ICP Intelligence Models',
    // Filter by class (wave 2 — 20 more)
    surCivilizations: 'Get all 34 Civilizations',
    surHeroStages: 'Get all 12 Hero Journey Stages',
    surElements: 'Get all 5 Classical Elements',
    surRhetoricalModes: 'Get all 7 Rhetorical Modes',
    surDesignModels: 'Get all 10 MACHINA Design Models',
    surDesignUses: 'Get all 50 Sovereign Design Uses',
    surConnectors: 'Get all 8 Enterprise Connectors',
    surGovernanceGates: 'Get all 3 Governance Gates',
    surPlatonicSolids: 'Get all 5 Platonic Solids',
    surModelFamilies: 'Get all 8 Model Families',
    surTerminals: 'Get all 10 Terminal Stations',
    surAnimalBrains: 'Get all Animal Brain Architectures',
    surDreamPhases: 'Get all 5 Dream Phases',
    surConsciousnessLayers: 'Get all Consciousness Layers',
    surZoneStates: 'Get all Zone/Flow States',
    surMemorySystems: 'Get all 6 Always-On Memory Systems',
    surTemporalDimensions: 'Get all 3 Temporal Dimensions',
    surEdgeTypes: 'Get all 14 Edge Types',
    surChaosCategories: 'Get all 8 Chaos Categories',
    surShellTypes: 'Get all 5 Shell Types',
    // Advanced queries
    surByLicense: 'Filter by license type',
    surByFrequencyRange: 'Filter by frequency range (min/max Hz)',
    surTotalCount: 'Get total entity count',
    surAllTags: 'Get all unique tags',
    surTagCount: 'Get count of unique tags',
    surAllSources: 'Get all unique source registries',
    surTopClasses: 'Get top N entity classes by count',
    surStats: 'Get complete system statistics',
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
