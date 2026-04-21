// PROPRIETARY — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE.
// Internal use only. Authorized personnel and family accounts only.

/**
 * @itsnotailabs/tools — Internal SDK Registry & Marketplace
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all ItsNotAILABS tools.
 * Install anything. Find anything. Spin up any agent from any terminal.
 *
 * Quick start on a new machine:
 *   npx @itsnotailabs/tools list          — see everything
 *   npx @itsnotailabs/tools install:sdk   — install the memory SDK
 *   npx @itsnotailabs/tools install:all   — install all public packages
 *
 * PROPRIETARY — ItsNotAILABS internal use only.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Registry Entry ───────────────────────────────────────────────────────────

export interface ToolEntry {
  /** Package name as it appears on npm or your private registry */
  name: string;
  /** Short identifier for quick CLI reference */
  id: string;
  /** One-line description */
  description: string;
  /** Semver version */
  version: string;
  /** License type */
  license: 'MIT' | 'PROPRIETARY' | 'BUSL-1.1' | 'CC-BY-NC-ND-4.0';
  /** Access level */
  access: 'internal' | 'public' | 'commercial';
  /** npm install command */
  install: string;
  /** Quick-start import */
  quickImport: string;
  /** What this tool is for */
  category: ToolCategory;
  /** Status */
  status: 'stable' | 'beta' | 'internal-only';
}

export type ToolCategory =
  | 'memory'
  | 'coordination'
  | 'communication'
  | 'economics'
  | 'utility'
  | 'organism'
  | 'sdk';

// ─── The Registry ─────────────────────────────────────────────────────────────

/**
 * Complete ItsNotAILABS tool registry.
 * Add entries here as new tools are released or approved for internal use.
 */
export const REGISTRY: ToolEntry[] = [

  // ── Public MIT Packages ────────────────────────────────────────────────────
  {
    id: 'consensus-engine',
    name: 'consensus-engine',
    description: 'Role-weighted voting for multi-agent AI systems. Typed authority, confidence decay, dissent logging.',
    version: '1.0.0',
    license: 'MIT',
    access: 'public',
    install: 'npm install consensus-engine',
    quickImport: "import { ConsensusEngine } from 'consensus-engine';",
    category: 'coordination',
    status: 'stable',
  },
  {
    id: 'agent-signal',
    name: 'agent-signal',
    description: 'Pub/sub signal bus for AI agents. BROADCAST, DIRECT, ROLE, URGENT signal types.',
    version: '1.0.0',
    license: 'MIT',
    access: 'public',
    install: 'npm install agent-signal',
    quickImport: "import { SignalBus } from 'agent-signal';",
    category: 'communication',
    status: 'stable',
  },

  // ── Commercial / Per-Call ──────────────────────────────────────────────────
  {
    id: 'agent-incentive-service',
    name: 'agent-incentive-service',
    description: 'Mechanism-design incentive structures for agent teams. Role authority, reputation staking, per-call consensus resolution.',
    version: '1.0.0',
    license: 'BUSL-1.1',
    access: 'commercial',
    install: 'npm install agent-incentive-service  # commercial license required',
    quickImport: "import { IncentiveService } from 'agent-incentive-service';",
    category: 'economics',
    status: 'stable',
  },

  // ── Proprietary SDK (ItsNotAILABS internal + licensed enterprise) ──────────
  {
    id: 'medina-memory-sdk',
    name: '@medina/memory-sdk',
    description: 'Sovereign memory infrastructure SDK. Spatial memory, knowledge graphs, temporal memory, harmonic computing, context engine, multi-AI teams.',
    version: '1.0.0',
    license: 'PROPRIETARY',
    access: 'internal',
    install: 'npm install @medina/memory-sdk  # internal / licensed use only',
    quickImport: "import { SpatialMemory, TemporalMemory, MultiAITeam } from '@medina/memory-sdk';",
    category: 'sdk',
    status: 'stable',
  },

  // ── Internal Utilities (src/lib — not published, internal organism use) ────
  {
    id: 'campaign-engine',
    name: 'campaignEngine',
    description: 'Campaign lifecycle engine. Build, run, and score outreach campaigns across agent-driven workflows.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { campaignEngine } from '@/lib/campaignEngine'",
    quickImport: "import { campaignEngine } from '@/lib/campaignEngine';",
    category: 'utility',
    status: 'internal-only',
  },
  {
    id: 'command-parser',
    name: 'commandParser',
    description: 'CPL command parsing. Translate compressed primordial language commands into executable organism instructions.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { parseCommand } from '@/lib/commandParser'",
    quickImport: "import { parseCommand } from '@/lib/commandParser';",
    category: 'utility',
    status: 'internal-only',
  },
  {
    id: 'company-onboarding',
    name: 'companyOnboarding',
    description: 'Company instance onboarding. Provision a new client organism instance with identity, memory, and access configuration.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { onboardCompany } from '@/lib/companyOnboarding'",
    quickImport: "import { onboardCompany } from '@/lib/companyOnboarding';",
    category: 'organism',
    status: 'internal-only',
  },
  {
    id: 'cross-organism-resonance',
    name: 'crossOrganismResonance',
    description: 'Cross-organism signal coherence. Maintain harmonic alignment between multiple running organism instances.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { crossOrganismResonance } from '@/lib/crossOrganismResonance'",
    quickImport: "import { crossOrganismResonance } from '@/lib/crossOrganismResonance';",
    category: 'organism',
    status: 'internal-only',
  },
  {
    id: 'device-sovereignty',
    name: 'deviceSovereignty',
    description: 'Device ownership and access control. Bind organism access to authorized hardware. Sovereign device registry.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { deviceSovereignty } from '@/lib/deviceSovereignty'",
    quickImport: "import { deviceSovereignty } from '@/lib/deviceSovereignty';",
    category: 'utility',
    status: 'internal-only',
  },
  {
    id: 'dual-read',
    name: 'dualRead',
    description: 'Dual-read memory layer. Simultaneous read from two memory tiers with coherence reconciliation.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { dualRead } from '@/lib/dualRead'",
    quickImport: "import { dualRead } from '@/lib/dualRead';",
    category: 'memory',
    status: 'internal-only',
  },
  {
    id: 'export-engine',
    name: 'exportEngine',
    description: 'Export formatted organism outputs. Generate structured documents, reports, and data extracts from organism state.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { exportEngine } from '@/lib/exportEngine'",
    quickImport: "import { exportEngine } from '@/lib/exportEngine';",
    category: 'utility',
    status: 'internal-only',
  },
  {
    id: 'full-stack-kernel-registry',
    name: 'fullStackKernelRegistry',
    description: 'Full-stack kernel registration. Register, discover, and version organism kernels across the full ItsNotAILABS stack.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { fullStackKernelRegistry } from '@/lib/fullStackKernelRegistry'",
    quickImport: "import { fullStackKernelRegistry } from '@/lib/fullStackKernelRegistry';",
    category: 'organism',
    status: 'internal-only',
  },
  {
    id: 'gate-enforcement',
    name: 'gateEnforcement',
    description: 'Output gate enforcement. Block low-confidence or out-of-scope agent outputs before they propagate.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { enforceGate } from '@/lib/gateEnforcement'",
    quickImport: "import { enforceGate } from '@/lib/gateEnforcement';",
    category: 'coordination',
    status: 'internal-only',
  },
  {
    id: 'governance-engine',
    name: 'governanceEngine',
    description: 'Governance proposal and approval workflows. Multi-step ratification with role-scoped voting and veto rights.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { governanceEngine } from '@/lib/governanceEngine'",
    quickImport: "import { governanceEngine } from '@/lib/governanceEngine';",
    category: 'organism',
    status: 'internal-only',
  },
  {
    id: 'icp-organism',
    name: 'icpOrganism',
    description: 'ICP canister organism interface. Deploy and communicate with organism canisters on the Internet Computer Protocol.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { icpOrganism } from '@/lib/icpOrganism'",
    quickImport: "import { icpOrganism } from '@/lib/icpOrganism';",
    category: 'organism',
    status: 'internal-only',
  },
  {
    id: 'kernel-compression',
    name: 'kernelCompression',
    description: 'Kernel compression engine. Compress organism knowledge to φ-ratio target density for efficient storage and transmission.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { kernelCompression } from '@/lib/kernelCompression'",
    quickImport: "import { kernelCompression } from '@/lib/kernelCompression';",
    category: 'memory',
    status: 'internal-only',
  },
  {
    id: 'living-document',
    name: 'livingDocument',
    description: 'Living document lifecycle. Documents that evolve, update, and re-synthesize as new information arrives.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { livingDocument } from '@/lib/livingDocument'",
    quickImport: "import { livingDocument } from '@/lib/livingDocument';",
    category: 'memory',
    status: 'internal-only',
  },
  {
    id: 'memory-engine',
    name: 'memoryEngine',
    description: 'Core memory storage and retrieval engine. Tiered read/write with TTL, tagging, and relevance scoring.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { memoryEngine } from '@/lib/memoryEngine'",
    quickImport: "import { memoryEngine } from '@/lib/memoryEngine';",
    category: 'memory',
    status: 'internal-only',
  },
  {
    id: 'message-engine',
    name: 'messageEngine',
    description: 'Message routing and delivery. Route messages between agents, canisters, and external services with guaranteed ordering.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { messageEngine } from '@/lib/messageEngine'",
    quickImport: "import { messageEngine } from '@/lib/messageEngine';",
    category: 'communication',
    status: 'internal-only',
  },
  {
    id: 'model-router',
    name: 'modelRouter',
    description: 'AI model routing. Select the correct model for each task type based on role, cost, latency, and capability.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { modelRouter } from '@/lib/modelRouter'",
    quickImport: "import { modelRouter } from '@/lib/modelRouter';",
    category: 'coordination',
    status: 'internal-only',
  },
  {
    id: 'nova-sovereign-encryption',
    name: 'novaSovereignEncryption',
    description: 'Sovereign encryption layer. Encrypt and sign organism payloads under sovereign key hierarchy.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { encrypt, decrypt } from '@/lib/novaSovereignEncryption'",
    quickImport: "import { encrypt, decrypt } from '@/lib/novaSovereignEncryption';",
    category: 'utility',
    status: 'internal-only',
  },
  {
    id: 'organism-kernel-executor',
    name: 'organismKernelExecutor',
    description: 'Kernel execution engine. Execute compressed organism kernels in sandboxed runtime environments.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { executeKernel } from '@/lib/organismKernelExecutor'",
    quickImport: "import { executeKernel } from '@/lib/organismKernelExecutor';",
    category: 'organism',
    status: 'internal-only',
  },
  {
    id: 'permissions-manager',
    name: 'permissionsManager',
    description: 'Permission scoping. Role-scoped access control for organism resources, memory tiers, and external APIs.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { permissionsManager } from '@/lib/permissionsManager'",
    quickImport: "import { permissionsManager } from '@/lib/permissionsManager';",
    category: 'utility',
    status: 'internal-only',
  },
  {
    id: 'recital-plus-one',
    name: 'recitalPlusOne',
    description: 'Constitutional enforcement engine. Enforces RECITAL_PLUS_ONE law — every action requires one witness beyond the actor.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { recitalPlusOne } from '@/lib/recitalPlusOne'",
    quickImport: "import { recitalPlusOne } from '@/lib/recitalPlusOne';",
    category: 'organism',
    status: 'internal-only',
  },
  {
    id: 'replay-engine',
    name: 'replayEngine',
    description: 'Session replay. Reconstruct any past organism state from its event log. Full deterministic replay.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { replayEngine } from '@/lib/replayEngine'",
    quickImport: "import { replayEngine } from '@/lib/replayEngine';",
    category: 'memory',
    status: 'internal-only',
  },
  {
    id: 'sovereign-contracts-ledgers',
    name: 'sovereignContractsLedgers',
    description: 'Sovereign contracts and ledger management. Record and verify agreements, transactions, and obligations in tamper-evident logs.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { sovereignContractsLedgers } from '@/lib/sovereignContractsLedgers'",
    quickImport: "import { sovereignContractsLedgers } from '@/lib/sovereignContractsLedgers';",
    category: 'utility',
    status: 'internal-only',
  },
  {
    id: 'voice-engine',
    name: 'voiceEngine',
    description: 'Voice input/output. Convert spoken commands to CPL and organism responses to speech. Sovereign voice interface.',
    version: 'internal',
    license: 'PROPRIETARY',
    access: 'internal',
    install: "import { voiceEngine } from '@/lib/voiceEngine'",
    quickImport: "import { voiceEngine } from '@/lib/voiceEngine';",
    category: 'utility',
    status: 'internal-only',
  },
];

// ─── Registry Lookup Helpers ──────────────────────────────────────────────────

/** Get all public tools (MIT) */
export function getPublicTools(): ToolEntry[] {
  return REGISTRY.filter(t => t.access === 'public');
}

/** Get all commercial tools */
export function getCommercialTools(): ToolEntry[] {
  return REGISTRY.filter(t => t.access === 'commercial');
}

/** Get all internal tools */
export function getInternalTools(): ToolEntry[] {
  return REGISTRY.filter(t => t.access === 'internal');
}

/** Get tools by category */
export function getByCategory(category: ToolCategory): ToolEntry[] {
  return REGISTRY.filter(t => t.category === category);
}

/** Find a tool by id */
export function findTool(id: string): ToolEntry | undefined {
  return REGISTRY.find(t => t.id === id);
}

/** Print a formatted registry listing to console */
export function listAll(): void {
  const separator = '─'.repeat(80);
  console.log('\n' + separator);
  console.log('  ItsNotAILABS Tool Registry');
  console.log('  ' + REGISTRY.length + ' tools registered');
  console.log(separator);

  const sections: Array<{ label: string; tools: ToolEntry[] }> = [
    { label: '  PUBLIC — MIT License', tools: getPublicTools() },
    { label: '  COMMERCIAL — BUSL-1.1 / Per-Call', tools: getCommercialTools() },
    { label: '  INTERNAL — Proprietary', tools: getInternalTools() },
  ];

  for (const section of sections) {
    console.log('\n' + section.label);
    console.log('  ' + '─'.repeat(40));
    for (const tool of section.tools) {
      console.log(`  ${tool.id.padEnd(36)} ${tool.description.substring(0, 50)}`);
      console.log(`  ${' '.repeat(36)} ${tool.install}`);
    }
  }

  console.log('\n' + separator + '\n');
}

/** Get the install command for a specific tool */
export function getInstallCommand(id: string): string | undefined {
  return findTool(id)?.install;
}
