// ISIL-1.0 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE.
// Internal use only. Authorized personnel and family accounts only.

/**
 * @itsnotailabs/tools — Sovereign Tool Catalog & Organism Registry
 * ─────────────────────────────────────────────────────────────────────────────
 * The ItsNotAILABS sovereign catalog. Every tool, SDK, and utility
 * built under this lineage — registered, described, and installable
 * from a single source of truth.
 *
 * Use from any terminal, any new machine, any authorized device:
 *   npx @itsnotailabs/tools catalog          — see everything
 *   npx @itsnotailabs/tools locate <id>      — get install command
 *
 * ISIL-1.0 — ItsNotAILABS internal use only.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Catalog Entry Types ──────────────────────────────────────────────────────

export type CatalogTier = 'sovereign-public' | 'sovereign-commercial' | 'organism-internal';
export type InstrumentClass = 'memory' | 'coordination' | 'communication' | 'economics' | 'governance' | 'organism' | 'sdk' | 'infrastructure';
export type ReleaseStatus = 'stable' | 'beta' | 'internal-only';

export interface CatalogEntry {
  /** Stable catalog identifier */
  catalogId: string;
  /** Package name on registry */
  packageName: string;
  /** One-line sovereign description */
  description: string;
  /** Current version */
  version: string;
  /** Governing license instrument */
  licenseInstrument: string;
  /** Access tier */
  tier: CatalogTier;
  /** Install invocation */
  installInvocation: string;
  /** Quick import statement */
  quickImport: string;
  /** Instrument class */
  instrumentClass: InstrumentClass;
  /** Release status */
  status: ReleaseStatus;
}

// ─── The Sovereign Catalog ────────────────────────────────────────────────────

/**
 * ITSNOTAILABS SOVEREIGN TOOL CATALOG
 *
 * Complete registry of all tools operating under the ItsNotAILABS lineage.
 * Add entries as new instruments are commissioned and approved.
 *
 * Catalog Reference: ISIL-1.0::CATALOG::2026
 */
export const SOVEREIGN_CATALOG: CatalogEntry[] = [

  // ── Sovereign Public — MIT ─────────────────────────────────────────────────

  {
    catalogId: 'consensus-engine',
    packageName: 'consensus-engine',
    description: 'Role-weighted resolution engine for multi-agent councils. Typed domain authority, conviction decay, dissent ledger.',
    version: '1.0.0',
    licenseInstrument: 'MIT',
    tier: 'sovereign-public',
    installInvocation: 'npm install consensus-engine',
    quickImport: "import { ConsensusEngine } from 'consensus-engine';",
    instrumentClass: 'coordination',
    status: 'stable',
  },
  {
    catalogId: 'agent-signal',
    packageName: 'agent-signal',
    description: 'Sovereign signal bus for agent councils. BROADCAST, DIRECT, ROLE, URGENT transmission types. Fully decoupled.',
    version: '1.0.0',
    licenseInstrument: 'MIT',
    tier: 'sovereign-public',
    installInvocation: 'npm install agent-signal',
    quickImport: "import { SignalBus } from 'agent-signal';",
    instrumentClass: 'communication',
    status: 'stable',
  },

  // ── Sovereign Commercial — ISIL-1.0 per-call ──────────────────────────────

  {
    catalogId: 'agent-incentive-service',
    packageName: 'agent-incentive-service',
    description: 'Sovereign coordination engine. Mechanism-design incentive structures: scope enforcement, conviction weighting, stage covenants, standing ledger.',
    version: '1.0.0',
    licenseInstrument: 'ISIL-1.0 (commercial)',
    tier: 'sovereign-commercial',
    installInvocation: 'npm install agent-incentive-service  # commercial license required',
    quickImport: "import { SovereignCoordinator } from 'agent-incentive-service';",
    instrumentClass: 'economics',
    status: 'stable',
  },

  // ── Organism Internal — ISIL-1.0 proprietary ──────────────────────────────

  {
    catalogId: 'medina-memory-sdk',
    packageName: '@medina/memory-sdk',
    description: 'Core sovereign memory infrastructure. Spatial, temporal, harmonic, document, knowledge graph, pattern recognition, context, multi-AI team.',
    version: '1.0.0',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: 'npm install @medina/memory-sdk  # internal / licensed use only',
    quickImport: "import { SpatialMemory, TemporalMemory, MultiAITeam } from '@medina/memory-sdk';",
    instrumentClass: 'sdk',
    status: 'stable',
  },

  // ── Internal Organism Utilities — src/lib ──────────────────────────────────

  {
    catalogId: 'campaign-engine',
    packageName: 'campaignEngine (internal)',
    description: 'Campaign lifecycle engine. Commission, execute, and score outreach campaigns across sovereign agent workflows.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { campaignEngine } from '@/lib/campaignEngine'",
    quickImport: "import { campaignEngine } from '@/lib/campaignEngine';",
    instrumentClass: 'infrastructure',
    status: 'internal-only',
  },
  {
    catalogId: 'command-parser',
    packageName: 'commandParser (internal)',
    description: 'CPL command parsing. Translate Compressed Primordial Language commands into sovereign organism instructions.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { parseCommand } from '@/lib/commandParser'",
    quickImport: "import { parseCommand } from '@/lib/commandParser';",
    instrumentClass: 'infrastructure',
    status: 'internal-only',
  },
  {
    catalogId: 'company-onboarding',
    packageName: 'companyOnboarding (internal)',
    description: 'Company instance commissioning. Provision a new client organism with sovereign identity, memory architecture, and access covenants.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { onboardCompany } from '@/lib/companyOnboarding'",
    quickImport: "import { onboardCompany } from '@/lib/companyOnboarding';",
    instrumentClass: 'organism',
    status: 'internal-only',
  },
  {
    catalogId: 'cross-organism-resonance',
    packageName: 'crossOrganismResonance (internal)',
    description: 'Cross-organism harmonic coherence. Maintain frequency alignment between multiple running sovereign organism instances.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { crossOrganismResonance } from '@/lib/crossOrganismResonance'",
    quickImport: "import { crossOrganismResonance } from '@/lib/crossOrganismResonance';",
    instrumentClass: 'organism',
    status: 'internal-only',
  },
  {
    catalogId: 'device-sovereignty',
    packageName: 'deviceSovereignty (internal)',
    description: 'Device sovereignty binding. Register authorized hardware, bind organism access to sovereign devices, enforce device identity.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { deviceSovereignty } from '@/lib/deviceSovereignty'",
    quickImport: "import { deviceSovereignty } from '@/lib/deviceSovereignty';",
    instrumentClass: 'governance',
    status: 'internal-only',
  },
  {
    catalogId: 'dual-read',
    packageName: 'dualRead (internal)',
    description: 'Dual-tier memory read. Simultaneous read across two memory tiers with coherence reconciliation at the seam.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { dualRead } from '@/lib/dualRead'",
    quickImport: "import { dualRead } from '@/lib/dualRead';",
    instrumentClass: 'memory',
    status: 'internal-only',
  },
  {
    catalogId: 'export-engine',
    packageName: 'exportEngine (internal)',
    description: 'Sovereign export engine. Generate structured documents, sovereign reports, and data extracts from organism state on demand.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { exportEngine } from '@/lib/exportEngine'",
    quickImport: "import { exportEngine } from '@/lib/exportEngine';",
    instrumentClass: 'infrastructure',
    status: 'internal-only',
  },
  {
    catalogId: 'full-stack-kernel-registry',
    packageName: 'fullStackKernelRegistry (internal)',
    description: 'Full-stack kernel commissioning. Register, discover, and version organism kernels across the complete ItsNotAILABS architectural stack.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { fullStackKernelRegistry } from '@/lib/fullStackKernelRegistry'",
    quickImport: "import { fullStackKernelRegistry } from '@/lib/fullStackKernelRegistry';",
    instrumentClass: 'organism',
    status: 'internal-only',
  },
  {
    catalogId: 'gate-enforcement',
    packageName: 'gateEnforcement (internal)',
    description: 'Sovereign output gate. Block underthreshold or out-of-scope organism outputs before they propagate downstream.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { enforceGate } from '@/lib/gateEnforcement'",
    quickImport: "import { enforceGate } from '@/lib/gateEnforcement';",
    instrumentClass: 'governance',
    status: 'internal-only',
  },
  {
    catalogId: 'governance-engine',
    packageName: 'governanceEngine (internal)',
    description: 'Sovereign governance engine. Multi-step ratification workflows with role-scoped voting, veto authority, and constitutional enforcement.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { governanceEngine } from '@/lib/governanceEngine'",
    quickImport: "import { governanceEngine } from '@/lib/governanceEngine';",
    instrumentClass: 'governance',
    status: 'internal-only',
  },
  {
    catalogId: 'icp-organism',
    packageName: 'icpOrganism (internal)',
    description: 'ICP canister organism interface. Commission, deploy, and communicate with sovereign organism canisters on the Internet Computer.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { icpOrganism } from '@/lib/icpOrganism'",
    quickImport: "import { icpOrganism } from '@/lib/icpOrganism';",
    instrumentClass: 'organism',
    status: 'internal-only',
  },
  {
    catalogId: 'kernel-compression',
    packageName: 'kernelCompression (internal)',
    description: 'Sovereign kernel compression. Compress organism knowledge to target density for efficient sovereign storage and transmission.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { kernelCompression } from '@/lib/kernelCompression'",
    quickImport: "import { kernelCompression } from '@/lib/kernelCompression';",
    instrumentClass: 'memory',
    status: 'internal-only',
  },
  {
    catalogId: 'living-document',
    packageName: 'livingDocument (internal)',
    description: 'Living document engine. Documents that evolve, re-synthesize, and update as new sovereign intelligence arrives.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { livingDocument } from '@/lib/livingDocument'",
    quickImport: "import { livingDocument } from '@/lib/livingDocument';",
    instrumentClass: 'memory',
    status: 'internal-only',
  },
  {
    catalogId: 'memory-engine',
    packageName: 'memoryEngine (internal)',
    description: 'Sovereign memory core. Tiered read/write with TTL, tagging, relevance scoring, and organism-state anchoring.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { memoryEngine } from '@/lib/memoryEngine'",
    quickImport: "import { memoryEngine } from '@/lib/memoryEngine';",
    instrumentClass: 'memory',
    status: 'internal-only',
  },
  {
    catalogId: 'message-engine',
    packageName: 'messageEngine (internal)',
    description: 'Sovereign message routing. Deliver messages between organism agents, canisters, and external services with guaranteed ordering.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { messageEngine } from '@/lib/messageEngine'",
    quickImport: "import { messageEngine } from '@/lib/messageEngine';",
    instrumentClass: 'communication',
    status: 'internal-only',
  },
  {
    catalogId: 'model-router',
    packageName: 'modelRouter (internal)',
    description: 'Sovereign model router. Select the appropriate AI model for each task type based on role authority, cost envelope, and capability profile.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { modelRouter } from '@/lib/modelRouter'",
    quickImport: "import { modelRouter } from '@/lib/modelRouter';",
    instrumentClass: 'coordination',
    status: 'internal-only',
  },
  {
    catalogId: 'nova-sovereign-encryption',
    packageName: 'novaSovereignEncryption (internal)',
    description: 'Nova sovereign encryption layer. Encrypt and sign organism payloads under the ItsNotAILABS sovereign key hierarchy.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { encrypt, decrypt } from '@/lib/novaSovereignEncryption'",
    quickImport: "import { encrypt, decrypt } from '@/lib/novaSovereignEncryption';",
    instrumentClass: 'governance',
    status: 'internal-only',
  },
  {
    catalogId: 'organism-kernel-executor',
    packageName: 'organismKernelExecutor (internal)',
    description: 'Sovereign kernel executor. Run compressed organism kernels in sovereign sandboxed runtime environments.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { executeKernel } from '@/lib/organismKernelExecutor'",
    quickImport: "import { executeKernel } from '@/lib/organismKernelExecutor';",
    instrumentClass: 'organism',
    status: 'internal-only',
  },
  {
    catalogId: 'permissions-manager',
    packageName: 'permissionsManager (internal)',
    description: 'Sovereign permissions covenant. Role-scoped access control for organism memory tiers, sovereign resources, and external API surfaces.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { permissionsManager } from '@/lib/permissionsManager'",
    quickImport: "import { permissionsManager } from '@/lib/permissionsManager';",
    instrumentClass: 'governance',
    status: 'internal-only',
  },
  {
    catalogId: 'recital-plus-one',
    packageName: 'recitalPlusOne (internal)',
    description: 'Constitutional RECITAL_PLUS_ONE enforcement. Every sovereign act requires one witness beyond the actor. Non-negotiable.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { recitalPlusOne } from '@/lib/recitalPlusOne'",
    quickImport: "import { recitalPlusOne } from '@/lib/recitalPlusOne';",
    instrumentClass: 'governance',
    status: 'internal-only',
  },
  {
    catalogId: 'replay-engine',
    packageName: 'replayEngine (internal)',
    description: 'Sovereign replay engine. Reconstruct any past organism state from its sovereign event log. Full deterministic replay.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { replayEngine } from '@/lib/replayEngine'",
    quickImport: "import { replayEngine } from '@/lib/replayEngine';",
    instrumentClass: 'memory',
    status: 'internal-only',
  },
  {
    catalogId: 'sovereign-contracts-ledgers',
    packageName: 'sovereignContractsLedgers (internal)',
    description: 'Sovereign contracts and ledger system. Record and verify agreements, obligations, and transactions in tamper-evident sovereign ledgers.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { sovereignContractsLedgers } from '@/lib/sovereignContractsLedgers'",
    quickImport: "import { sovereignContractsLedgers } from '@/lib/sovereignContractsLedgers';",
    instrumentClass: 'governance',
    status: 'internal-only',
  },
  {
    catalogId: 'voice-engine',
    packageName: 'voiceEngine (internal)',
    description: 'Sovereign voice interface. Convert spoken commands to CPL and organism responses to speech. Voice access to the sovereign organism.',
    version: 'organism',
    licenseInstrument: 'ISIL-1.0 (proprietary)',
    tier: 'organism-internal',
    installInvocation: "import { voiceEngine } from '@/lib/voiceEngine'",
    quickImport: "import { voiceEngine } from '@/lib/voiceEngine';",
    instrumentClass: 'infrastructure',
    status: 'internal-only',
  },
];

// ─── Catalog Query Interface ──────────────────────────────────────────────────

/** All sovereign public (MIT) entries */
export function sovereignPublic(): CatalogEntry[] {
  return SOVEREIGN_CATALOG.filter(e => e.tier === 'sovereign-public');
}

/** All commercial entries */
export function sovereignCommercial(): CatalogEntry[] {
  return SOVEREIGN_CATALOG.filter(e => e.tier === 'sovereign-commercial');
}

/** All organism-internal entries */
export function organismInternal(): CatalogEntry[] {
  return SOVEREIGN_CATALOG.filter(e => e.tier === 'organism-internal');
}

/** All entries in a given instrument class */
export function byInstrumentClass(cls: InstrumentClass): CatalogEntry[] {
  return SOVEREIGN_CATALOG.filter(e => e.instrumentClass === cls);
}

/** Locate a catalog entry by its catalogId */
export function locate(catalogId: string): CatalogEntry | undefined {
  return SOVEREIGN_CATALOG.find(e => e.catalogId === catalogId);
}

/** Get the install invocation for a given catalogId */
export function installInvocation(catalogId: string): string | undefined {
  return locate(catalogId)?.installInvocation;
}

/** Print the full sovereign catalog to console */
export function printCatalog(): void {
  const bar = '━'.repeat(80);
  console.log(`\n${bar}`);
  console.log('  ItsNotAILABS Sovereign Tool Catalog');
  console.log(`  ${SOVEREIGN_CATALOG.length} instruments registered`);
  console.log(`  ISIL-1.0::CATALOG::2026`);
  console.log(bar);

  const tiers: Array<{ label: string; entries: CatalogEntry[] }> = [
    { label: '  SOVEREIGN PUBLIC — MIT', entries: sovereignPublic() },
    { label: '  SOVEREIGN COMMERCIAL — ISIL-1.0 per-call', entries: sovereignCommercial() },
    { label: '  ORGANISM INTERNAL — ISIL-1.0 proprietary', entries: organismInternal() },
  ];

  for (const tier of tiers) {
    console.log(`\n${tier.label}`);
    console.log(`  ${'─'.repeat(40)}`);
    for (const entry of tier.entries) {
      const id = entry.catalogId.padEnd(38);
      const desc = entry.description.substring(0, 48);
      console.log(`  ${id} ${desc}`);
      console.log(`  ${' '.repeat(38)} ${entry.installInvocation}`);
    }
  }

  console.log(`\n${bar}\n`);
}

// ─── Legacy Compatibility Aliases ────────────────────────────────────────────

/** @deprecated Use SOVEREIGN_CATALOG */
export const REGISTRY = SOVEREIGN_CATALOG;
/** @deprecated Use locate() */
export const findTool = locate;
/** @deprecated Use sovereignPublic() */
export const getPublicTools = sovereignPublic;
/** @deprecated Use sovereignCommercial() */
export const getCommercialTools = sovereignCommercial;
/** @deprecated Use organismInternal() */
export const getInternalTools = organismInternal;
/** @deprecated Use byInstrumentClass() */
export const getByCategory = byInstrumentClass;
/** @deprecated Use installInvocation() */
export const getInstallCommand = installInvocation;
/** @deprecated Use printCatalog() */
export const listAll = printCatalog;
