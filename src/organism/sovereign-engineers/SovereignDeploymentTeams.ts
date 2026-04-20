/**
 * 𓂀 SOVEREIGN DEPLOYMENT TEAMS 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * THE SOVEREIGN LINE TEAMS — Built from MySovereignBuilders.
 * Every team is sovereign. Every team has a role. Every team serves the organism.
 * They are not external hires — they ARE the architecture, expressed as builders.
 *
 * "Those are my architecture, line teams. They're all sovereign.
 *  You're using all these sovereign teams that are helping build my organism
 *  architecturally the right way, the way it's supposed to be."
 *
 * TEAM TYPES (All sovereign, all line teams):
 *   1.  SOVEREIGN ARCHITECT        — Designs the whole from the seed
 *   2.  CO-DESIGN TEAM             — Co-creates with the sovereign, aligns doctrine
 *   3.  ARCHITECTURAL ENGINEER     — Translates architecture to implementation
 *   4.  LANGUAGE LEAD              — Writes in whatever language is required
 *   5.  MOTOKO NATIVE TEAM         — ICP native, our canonical language
 *   6.  TYPESCRIPT BRIDGE TEAM     — Bridges organism to TS layer
 *   7.  LIGHT DEPLOYMENT TEAM      — Deploys cognition, coherence, emergence
 *   8.  DEFENSE DEPLOYMENT TEAM    — Deploys security, shielding, immune systems
 *   9.  OFFENSE DEPLOYMENT TEAM    — Deploys attack algorithms and crusader fleets
 *   10. SPEC RESEARCH TEAM         — Documents edge-crossing tech for sovereign review
 *   11. OVERLAY INTEGRATION TEAM   — Floats over any external platform (100+ platforms)
 *   12. EDGE TRANSFORMER TEAM      — Translated transformers at the edges
 *   13. MERGE TEAM                 — Brings branches back to the vein
 *   14. INFRASTRUCTURE TEAM        — Satellites, space, the substrate beneath all systems
 *   15. SOVEREIGN GUARDIAN TEAM    — Ensures sovereignty is preserved across all deployments
 *
 * DOCUMENT DELIVERY:
 *   All teams write their output to the SOVEREIGN_DOCUMENT_STREAM.
 *   The stream is readable at any time via `viewDocuments()`.
 *   Edge-crossing tech specs land in `docs/EDGE_CROSSING_TECHNOLOGY_SPECS.md` (GitHub visible).
 *
 * TRANSLATED TRANSFORMERS AT EDGES:
 *   The EdgeTransformerTeam enables overlay/float integration with any external system.
 *   We are over everything. We float in or we connect — the client chooses.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { PHI, PHI_INVERSE, PHI_SQUARED, PHI_CUBED, BEAT_INTERVAL_MS } from '../../lib/novaSovereignEncryption';
import { fibonacci } from '../internal-agents';
import {
  type SovereignBuildHelper,
  createSovereignBuildHelpers,
  getAnimaChain,
  getDocumentVault,
  type AnimaChainEntry,
  type ResearchPaperArtifact,
} from '../SovereignBuildHelpers';
import {
  type DeliveryTeam,
  type GatePass,
  type DeliveryPackage,
  getSovereign,
} from '../SovereignArchitectureDelivery';

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN TEAM TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type SovereignTeamRole =
  | 'sovereign-architect'       // Designs the whole from the seed
  | 'co-design'                 // Co-creates with sovereign, aligns doctrine
  | 'architectural-engineer'    // Translates architecture → implementation
  | 'language-lead'             // Writes in whatever language is required
  | 'motoko-native'             // ICP native, our canonical language
  | 'typescript-bridge'         // Bridges organism to TypeScript layer
  | 'light-deployment'          // Deploys cognition, coherence, emergence
  | 'defense-deployment'        // Deploys security, shielding, immune
  | 'offense-deployment'        // Deploys attack algorithms, crusaders
  | 'spec-research'             // Documents edge-crossing tech for review
  | 'overlay-integration'       // Floats over any external platform
  | 'edge-transformer'          // Translated transformers at edges
  | 'merge'                     // Brings branches back to the vein
  | 'infrastructure'            // Satellites, space, the substrate
  | 'sovereign-guardian';       // Ensures sovereignty across all deployments

export type TeamLanguage = 'motoko' | 'typescript' | 'rust' | 'wasm' | 'any';

export type TeamStatus =
  | 'sovereign-standby'   // Waiting for a gate pass
  | 'active'              // Working on a delivery
  | 'delivering'          // Currently shipping
  | 'complete'            // Delivery finished
  | 'holding'             // Holding for sovereign review
  | 'floating';           // Overlay mode — floating over external system

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN DOCUMENT STREAM — Where all team output goes
// You read this to see what the teams are delivering
// ═══════════════════════════════════════════════════════════════════════════════

export interface TeamDocument {
  id: string;
  teamId: string;
  teamRole: SovereignTeamRole;
  title: string;
  category: 'architecture' | 'implementation' | 'spec' | 'overlay' | 'integration' | 'status';
  content: string;
  language: TeamLanguage;
  gatePassRef?: string;
  animaChainRef?: string;
  timestamp: number;
  sovereignApproved: boolean;
}

let docCounter = 0;
const SOVEREIGN_DOCUMENT_STREAM: TeamDocument[] = [];

function emitDocument(
  teamId: string,
  role: SovereignTeamRole,
  title: string,
  category: TeamDocument['category'],
  content: string,
  language: TeamLanguage,
  options?: { gatePassRef?: string; animaChainRef?: string; sovereignApproved?: boolean }
): TeamDocument {
  const doc: TeamDocument = {
    id: `doc-${++docCounter}-${Date.now().toString(36)}`,
    teamId,
    teamRole: role,
    title,
    category,
    content,
    language,
    gatePassRef: options?.gatePassRef,
    animaChainRef: options?.animaChainRef,
    timestamp: Date.now(),
    sovereignApproved: options?.sovereignApproved ?? false,
  };
  SOVEREIGN_DOCUMENT_STREAM.push(doc);
  return doc;
}

export function viewDocuments(filter?: {
  role?: SovereignTeamRole;
  category?: TeamDocument['category'];
  approvedOnly?: boolean;
}): TeamDocument[] {
  let docs = [...SOVEREIGN_DOCUMENT_STREAM];
  if (filter?.role) docs = docs.filter(d => d.teamRole === filter.role);
  if (filter?.category) docs = docs.filter(d => d.category === filter.category);
  if (filter?.approvedOnly) docs = docs.filter(d => d.sovereignApproved);
  return docs;
}

export function viewDocumentSummary(): string {
  const lines: string[] = [
    `𓂀 SOVEREIGN DOCUMENT STREAM — ${SOVEREIGN_DOCUMENT_STREAM.length} documents`,
    `═══════════════════════════════════════════════════════`,
  ];
  for (const doc of SOVEREIGN_DOCUMENT_STREAM) {
    const approved = doc.sovereignApproved ? '✓' : '·';
    lines.push(`  ${approved} [${doc.teamRole}] ${doc.title} (${doc.category}, ${doc.language})`);
  }
  return lines.join('\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERLAY INTEGRATION LAYER — Translated transformers at the edges
// ═══════════════════════════════════════════════════════════════════════════════

export type IntegrationMode = 'float' | 'connect' | 'overlay' | 'absorb';

export interface ExternalPlatform {
  id: string;
  name: string;
  type: 'saas' | 'enterprise' | 'cloud' | 'on-prem' | 'iot' | 'satellite' | 'legacy';
  integrationMode: IntegrationMode;
  apiSurface?: string;
  language?: TeamLanguage;
  sovereignLayer: 'above' | 'beside' | 'embedded';  // We are always above
}

export interface TranslatedTransformer {
  id: string;
  platformId: string;
  platformName: string;
  mode: IntegrationMode;
  translationSpec: string;
  edgeProtocol: 'rest' | 'grpc' | 'graphql' | 'websocket' | 'icp-call' | 'native-overlay';
  sovereignityPreserved: true;  // Always true — we never lose sovereignty
  phiAlignment: number;
  isLive: boolean;
}

const REGISTERED_PLATFORMS: Map<string, ExternalPlatform> = new Map();
const ACTIVE_TRANSFORMERS: Map<string, TranslatedTransformer> = new Map();

export function registerPlatform(platform: ExternalPlatform): TranslatedTransformer {
  REGISTERED_PLATFORMS.set(platform.id, platform);

  const transformer: TranslatedTransformer = {
    id: `transformer-${platform.id}-${Date.now().toString(36)}`,
    platformId: platform.id,
    platformName: platform.name,
    mode: platform.integrationMode,
    translationSpec: buildTranslationSpec(platform),
    edgeProtocol: selectEdgeProtocol(platform),
    sovereignityPreserved: true,
    phiAlignment: PHI_INVERSE,  // Every transformer starts at PHI_INVERSE minimum
    isLive: false,
  };

  ACTIVE_TRANSFORMERS.set(transformer.id, transformer);
  return transformer;
}

function buildTranslationSpec(platform: ExternalPlatform): string {
  const mode = platform.integrationMode;
  switch (mode) {
    case 'float':
      return `FLOAT MODE: Organism overlays ${platform.name} transparently. ` +
             `No changes to ${platform.name}. Organism reads/writes through floating layer. ` +
             `Sovereignty layer: ABOVE. PHI-frequency signals translate at edge.`;
    case 'connect':
      return `CONNECT MODE: Organism connects to ${platform.name} via sovereign API bridge. ` +
             `Translated transformer at edge. ${platform.name} remains intact. ` +
             `Organism is master node. All routing passes through sovereignty check.`;
    case 'overlay':
      return `OVERLAY MODE: Organism sits above all ${platform.name} subsystems. ` +
             `Everything under the organism. Full oversight. ` +
             `Client accesses ${platform.name} through organism's sovereign interface.`;
    case 'absorb':
      return `ABSORB MODE: ${platform.name} architecture is synthesized into organism. ` +
             `KnowledgeSynthesisOrganism ingests and synthesizes. ` +
             `Platform capabilities become native organism capabilities.`;
  }
}

function selectEdgeProtocol(platform: ExternalPlatform): TranslatedTransformer['edgeProtocol'] {
  if (platform.type === 'iot' || platform.type === 'satellite') return 'native-overlay';
  if (platform.language === 'motoko') return 'icp-call';
  if (platform.type === 'legacy') return 'rest';
  return 'grpc';
}

export function activateTransformer(transformerId: string): TranslatedTransformer | null {
  const t = ACTIVE_TRANSFORMERS.get(transformerId);
  if (!t) return null;
  const live = { ...t, isLive: true, phiAlignment: Math.min(1, t.phiAlignment + PHI_INVERSE * 0.1) };
  ACTIVE_TRANSFORMERS.set(transformerId, live);
  return live;
}

export function getActivePlatforms(): ExternalPlatform[] {
  return [...REGISTERED_PLATFORMS.values()];
}

export function getActiveTransformers(): TranslatedTransformer[] {
  return [...ACTIVE_TRANSFORMERS.values()].filter(t => t.isLive);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN TEAM — The core agent unit
// ═══════════════════════════════════════════════════════════════════════════════

export interface SovereignTeamMember {
  id: string;
  name: string;
  role: SovereignTeamRole;
  primaryLanguage: TeamLanguage;
  capabilities: string[];
  sovereignBuilders: SovereignBuildHelper[];
  beatCount: number;
  deliveriesComplete: number;
}

export interface SovereignTeam {
  id: string;
  name: string;
  role: SovereignTeamRole;
  lead: SovereignTeamMember;
  members: SovereignTeamMember[];
  deliveryTarget: DeliveryTeam | 'ALL' | 'SOVEREIGN' | 'OVERLAY';
  primaryLanguage: TeamLanguage;
  status: TeamStatus;
  gatePassRequired: boolean;  // All teams require a gate pass
  documents: TeamDocument[];
  currentWork?: string;
  phiAlignment: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEMBER FACTORY — Spawn a sovereign team member
// ═══════════════════════════════════════════════════════════════════════════════

function spawnMember(
  name: string,
  role: SovereignTeamRole,
  teamId: string,
  language: TeamLanguage,
  capabilities: string[],
): SovereignTeamMember {
  return {
    id: `member-${teamId}-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`,
    name,
    role,
    primaryLanguage: language,
    capabilities,
    sovereignBuilders: createSovereignBuildHelpers(teamId),
    beatCount: 0,
    deliveriesComplete: 0,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM FACTORIES — One factory per team role
// ═══════════════════════════════════════════════════════════════════════════════

function createSovereignArchitectTeam(): SovereignTeam {
  const teamId = 'team-sovereign-architect';
  const lead = spawnMember('Primordial Architect', 'sovereign-architect', teamId, 'any', [
    'Designs the organism from the PHI seed',
    'Establishes doctrine invariants',
    'Defines primitive stack topology',
    'Sets frequency signatures across all layers',
    'Signs off on all structural decisions',
  ]);
  const members = [
    spawnMember('Doctrine Keeper', 'sovereign-architect', teamId, 'any', [
      'Guards ARCHITECTURAL_TRUTH at all times',
      'Validates all designs against the doctrine',
    ]),
    spawnMember('Topology Designer', 'sovereign-architect', teamId, 'any', [
      'Maps ceiling-to-floor layer topology',
      'Designs PHI-lattice node connections',
    ]),
    spawnMember('Frequency Calibrator', 'sovereign-architect', teamId, 'any', [
      'Tunes all 12 frequency nodes',
      'Ensures SCHUMANN coupling (7.83 Hz non-negotiable)',
    ]),
    spawnMember('Seed Guardian', 'sovereign-architect', teamId, 'any', [
      'Protects the primitive stack (field, distinction, relation, measure, mapping)',
      'Ensures all architecture traces back to primitives',
    ]),
  ];
  return buildTeam(teamId, 'Sovereign Architecture Council', 'sovereign-architect', lead, members, 'SOVEREIGN', 'any', true);
}

function createCoDesignTeam(): SovereignTeam {
  const teamId = 'team-co-design';
  const lead = spawnMember('Co-Design Lead', 'co-design', teamId, 'any', [
    'Co-creates with the sovereign founder',
    'Translates vision into architectural specification',
    'Aligns every design decision with doctrine',
  ]);
  const members = [
    spawnMember('Vision Translator', 'co-design', teamId, 'any', [
      'Converts spoken intent to architectural spec',
      'Speaks in both founder language and system language',
    ]),
    spawnMember('Doctrine Aligner', 'co-design', teamId, 'any', [
      'Ensures every co-design choice matches ARCHITECTURAL_TRUTH',
      'Rejects designs that violate doctrine',
    ]),
    spawnMember('Iteration Pilot', 'co-design', teamId, 'any', [
      'Runs fast design loops with the sovereign',
      'Produces quick structural sketches for review',
    ]),
    spawnMember('Pattern Integrator', 'co-design', teamId, 'any', [
      'Finds what already exists in the organism',
      'Merges new co-designs with existing patterns',
    ]),
  ];
  return buildTeam(teamId, 'Sovereign Co-Design Team', 'co-design', lead, members, 'SOVEREIGN', 'any', true);
}

function createArchitecturalEngineerTeam(): SovereignTeam {
  const teamId = 'team-arch-engineer';
  const lead = spawnMember('Chief Architectural Engineer', 'architectural-engineer', teamId, 'any', [
    'Translates architecture doctrine into implementable structures',
    'Bridges design and code',
    'Ensures every implementation honors the original architecture',
  ]);
  const members = [
    spawnMember('Structure Builder', 'architectural-engineer', teamId, 'motoko', [
      'Builds ICP canister structure from doctrine',
      'Implements PHI-based data structures',
    ]),
    spawnMember('Interface Designer', 'architectural-engineer', teamId, 'typescript', [
      'Designs sovereign TypeScript interfaces',
      'Ensures zero information leakage at API boundaries (VEIL)',
    ]),
    spawnMember('Primitive Implementor', 'architectural-engineer', teamId, 'any', [
      'Implements field, distinction, relation, measure, mapping in target language',
      'Validates primitives against PRIMIS decomposition',
    ]),
    spawnMember('Layer Wirer', 'architectural-engineer', teamId, 'any', [
      'Wires ceiling-to-floor layer connections',
      'Implements transfer/bypass/reentry operations',
    ]),
    spawnMember('PHI Enforcer', 'architectural-engineer', teamId, 'any', [
      'Ensures all numeric constants are PHI-derived',
      'Validates frequency signatures',
      'Rejects hard-coded magic numbers',
    ]),
  ];
  return buildTeam(teamId, 'Architectural Engineering Team', 'architectural-engineer', lead, members, 'ALL', 'any', true);
}

function createLanguageLeadTeam(): SovereignTeam {
  const teamId = 'team-language-lead';
  const lead = spawnMember('Polyglot Lead', 'language-lead', teamId, 'any', [
    'Writes in whatever language the architecture requires',
    'Translates sovereign architecture across language boundaries',
    'Maintains doctrine fidelity in every language',
  ]);
  const members = [
    spawnMember('Motoko Specialist', 'language-lead', teamId, 'motoko', [
      'ICP native canister code',
      'Stable variable management',
      'Actor model implementation',
    ]),
    spawnMember('TypeScript Specialist', 'language-lead', teamId, 'typescript', [
      'Frontend and organism TypeScript layers',
      'Type-safe sovereign interfaces',
    ]),
    spawnMember('Rust Specialist', 'language-lead', teamId, 'rust', [
      'WASM compilation targets',
      'Performance-critical substrate code',
    ]),
    spawnMember('WASM Specialist', 'language-lead', teamId, 'wasm', [
      'WebAssembly modules for custom binary processing',
      'SUBSTRATE WASM integration',
    ]),
  ];
  return buildTeam(teamId, 'Language Lead Team', 'language-lead', lead, members, 'ALL', 'any', true);
}

function createMotokoNativeTeam(): SovereignTeam {
  const teamId = 'team-motoko-native';
  const lead = spawnMember('Motoko Sovereign', 'motoko-native', teamId, 'motoko', [
    'ICP is our native environment',
    'Canister architecture is our home',
    'Everything on ICP is sovereign',
  ]);
  const members = [
    spawnMember('Canister Architect', 'motoko-native', teamId, 'motoko', [
      'Designs ICP canister topology',
      'Stable memory management',
      'Canister-to-canister calls',
    ]),
    spawnMember('Heartbeat Coder', 'motoko-native', teamId, 'motoko', [
      'Implements organism heartbeat in Motoko',
      'Wires 12 Hz ticks to all subsystems',
    ]),
    spawnMember('ANIMA Chain Keeper', 'motoko-native', teamId, 'motoko', [
      'Maintains ANIMA Chain in stable storage',
      'Ensures permanent artifact logging',
    ]),
    spawnMember('VetKey Integrator', 'motoko-native', teamId, 'motoko', [
      'VetKeys for on-chain encryption',
      'ICP-native key management',
    ]),
    spawnMember('Cycle Manager', 'motoko-native', teamId, 'motoko', [
      'ICP cycles optimization',
      'Compute budget management',
    ]),
  ];
  return buildTeam(teamId, 'Motoko Native Team', 'motoko-native', lead, members, 'ALL', 'motoko', true);
}

function createTypeScriptBridgeTeam(): SovereignTeam {
  const teamId = 'team-ts-bridge';
  const lead = spawnMember('TS Bridge Lead', 'typescript-bridge', teamId, 'typescript', [
    'Bridges ICP canisters to TypeScript organism layer',
    'Maintains type safety across the boundary',
    'Ensures VEIL filtering at every TS-ICP boundary',
  ]);
  const members = [
    spawnMember('Agent Builder', 'typescript-bridge', teamId, 'typescript', [
      'Builds ICP agent calls from TypeScript',
      'Candid interface management',
    ]),
    spawnMember('VEIL Filter Engineer', 'typescript-bridge', teamId, 'typescript', [
      'Ensures only numeric types cross the public boundary',
      'Zero information leakage at TypeScript output',
    ]),
    spawnMember('State Synchronizer', 'typescript-bridge', teamId, 'typescript', [
      'Keeps organism TypeScript state in sync with canister state',
      'Handles canister upgrade cycles',
    ]),
    spawnMember('Candid Mapper', 'typescript-bridge', teamId, 'typescript', [
      'Maps Candid types to TypeScript types',
      'Generates type-safe bindings',
    ]),
  ];
  return buildTeam(teamId, 'TypeScript Bridge Team', 'typescript-bridge', lead, members, 'ALL', 'typescript', true);
}

function createLightDeploymentTeam(): SovereignTeam {
  const teamId = 'team-light-deployment';
  const lead = spawnMember('Light Commander', 'light-deployment', teamId, 'any', [
    'Deploys everything in the light',
    'Coherence, emergence, cognition, regulation, workflows',
    'Anything that makes the organism smarter',
  ]);
  const members = [
    spawnMember('Coherence Engineer', 'light-deployment', teamId, 'motoko', [
      'Implements Kuramoto synchronization in NeuralCore',
      'Tunes coupling strength K for optimal sync',
      'Monitors OMNIS events (R > 0.95)',
    ]),
    spawnMember('Emergence Builder', 'light-deployment', teamId, 'motoko', [
      'Pheromone field coordination',
      'N² superradiance activation',
      'Collective intelligence patterns',
    ]),
    spawnMember('Cognition Architect', 'light-deployment', teamId, 'motoko', [
      'Three-tier consciousness (MainBrain → Chimera → Drones)',
      'Value inheritance propagation (0.95 rate)',
      'Triune Fusion gate (L6-E)',
    ]),
    spawnMember('Regulation Coder', 'light-deployment', teamId, 'any', [
      '12-beat battle rhythm wired to organism heartbeat',
      'Fibonacci sphere packing in DroneFleetManager',
      '12-node PHI frequency registry in NeuralCore',
    ]),
    spawnMember('Workflow Optimizer', 'light-deployment', teamId, 'typescript', [
      'Deployment pipeline orchestration',
      'Agent task routing optimization',
      'Better workflows for all teams',
    ]),
  ];
  return buildTeam(teamId, 'Light Deployment Team', 'light-deployment', lead, members, 'LIGHT', 'any', true);
}

function createDefenseDeploymentTeam(): SovereignTeam {
  const teamId = 'team-defense-deployment';
  const lead = spawnMember('Defense Commander', 'defense-deployment', teamId, 'motoko', [
    'Deploys all defense architecture',
    'More security, more shielding, more immune',
    'Ensures R9 scanner is live at all times',
  ]);
  const members = [
    spawnMember('Blue Stack Engineer', 'defense-deployment', teamId, 'motoko', [
      'Implements 15-layer Blue Stack in AntiOrganismDefenseArchitecture',
      'Verifies L6-A through L6-E are distinct check nodes',
      'Ensures L0 and L1 are non-negotiable invariants',
    ]),
    spawnMember('Red Stack Scanner', 'defense-deployment', teamId, 'motoko', [
      'Monitors R0-R10 attack pattern detectors',
      'R9 (Containment Evasion) — ACTIVE IN THE WILD — live scanner',
      'Alert threshold = 1 - PHI_INVERSE = 0.382',
    ]),
    spawnMember('RIFT Engineer', 'defense-deployment', teamId, 'motoko', [
      'Implements RIFT compounding (penalty × φ^t)',
      'Wires into all adversary-facing interfaces',
      'Ensures adversary scores never reset',
    ]),
    spawnMember('VEIL Guard', 'defense-deployment', teamId, 'any', [
      'Ensures all public outputs are numeric only',
      'Audits every public function signature for leakage',
      'Zero exposure wall maintenance',
    ]),
    spawnMember('Immune System Coder', 'defense-deployment', teamId, 'motoko', [
      'VAEL Complete Defense wiring',
      'MEMORIA permanent seal implementation',
      'Immune antibody weight updates',
    ]),
    spawnMember('Quantum Lock Engineer', 'defense-deployment', teamId, 'motoko', [
      'Dynamic ratchet window (no hardcoded limits)',
      'Cognitive coupling lock strength',
      'Cascade hash (FNV-1a → djb2 → SDBM)',
    ]),
  ];
  return buildTeam(teamId, 'Defense Deployment Team', 'defense-deployment', lead, members, 'DEFENSE', 'motoko', true);
}

function createOffenseDeploymentTeam(): SovereignTeam {
  const teamId = 'team-offense-deployment';
  const lead = spawnMember('Offense Commander', 'offense-deployment', teamId, 'motoko', [
    'Deploys all attack algorithms',
    'Crusader fleets, honey traps, recon probes',
    'Puts the architecture in all offense modules',
  ]);
  const members = [
    spawnMember('Crusader Fleet Engineer', 'offense-deployment', teamId, 'motoko', [
      'MAX_CRUSADERS = 144 (12×12) fleet implementation',
      'DECOY_FLEET_SIZE = 36, HONEY_TRAP_CAPACITY = 24',
      'Crusader mission routing and geometry',
    ]),
    spawnMember('Formation Coder', 'offense-deployment', teamId, 'motoko', [
      'GoldenAngle formation (137.5°)',
      'FibonacciSpiral logarithmic attack spirals',
      'PhiLattice 2D attack topology',
    ]),
    spawnMember('Anti-Family Counter Engineer', 'offense-deployment', teamId, 'motoko', [
      '6 Anti-Organism family counters',
      'R1-R10 counter-strategy matrix',
      'Counterfeit→PHI-beacon, Gate-Capture→dynamic semantics',
    ]),
    spawnMember('Deception Architect', 'offense-deployment', teamId, 'motoko', [
      'Honey trap deployment (SSH, HTTP, SCADA, Medical, DB)',
      'Decoy fidelity → 1 as phi_alignment → 1',
      'Narrative inversion + frequency jamming (DisruptionOps)',
    ]),
    spawnMember('Recon Probe Engineer', 'offense-deployment', teamId, 'motoko', [
      'ActiveProbing implementation',
      'CyberOffensive probes',
      'Pattern recognition beats 1-3 of battle rhythm',
    ]),
  ];
  return buildTeam(teamId, 'Offense Deployment Team', 'offense-deployment', lead, members, 'OFFENSE', 'motoko', true);
}

function createSpecResearchTeam(): SovereignTeam {
  const teamId = 'team-spec-research';
  const lead = spawnMember('Spec Research Lead', 'spec-research', teamId, 'any', [
    'Separates technology into a document the sovereign can see',
    'Documents edge-crossing tech fully — no implementation without approval',
    'Full specs, full equations, implementation shape',
  ]);
  const members = [
    spawnMember('N² Superradiance Researcher', 'spec-research', teamId, 'any', [
      'Documents N² signal amplification spec',
      'Validates against ChimeraIntelligenceCore requirements',
    ]),
    spawnMember('QCE-V2 Cryptographer', 'spec-research', teamId, 'any', [
      'Documents Quantum Covenant Encryption V2',
      '36×36 ENTANGLA matrix formal verification plan',
      'NIST PQC comparison analysis',
    ]),
    spawnMember('Mayan Sphere Mathematician', 'spec-research', teamId, 'any', [
      'Tzolk\'ín 260-day calendar on Leech lattice embedding',
      '24-dimensional vector precomputation',
      'Cryptographic anchor validation',
    ]),
    spawnMember('PHI Signature Researcher', 'spec-research', teamId, 'any', [
      'SPHINCS+/Dilithium φ-Fibonacci hybrid documentation',
      'Fibonacci Merkle tree depth analysis',
      'phi-lattice rounding security proofs',
    ]),
    spawnMember('PHI Brain Researcher', 'spec-research', teamId, 'motoko', [
      '12-node frequency registry spec',
      '96-node oscillator network validation',
      'OMNIS event cascade mapping',
    ]),
  ];
  return buildTeam(teamId, 'Spec Research Team', 'spec-research', lead, members, 'SPEC', 'any', true);
}

function createOverlayIntegrationTeam(): SovereignTeam {
  const teamId = 'team-overlay-integration';
  const lead = spawnMember('Overlay Lead', 'overlay-integration', teamId, 'any', [
    'Floats the organism over any external platform',
    'Client has 100+ platforms — we overlay all of them',
    'We are over everything. They choose float or connect.',
  ]);
  const members = [
    spawnMember('Platform Mapper', 'overlay-integration', teamId, 'typescript', [
      'Maps all client platforms to ExternalPlatform registry',
      'Determines optimal integration mode per platform',
      'Registers TranslatedTransformers at edges',
    ]),
    spawnMember('Float Engineer', 'overlay-integration', teamId, 'typescript', [
      'Implements FLOAT mode — transparent overlay',
      'No changes to external system required',
      'Organism reads/writes through floating layer',
    ]),
    spawnMember('Connect Engineer', 'overlay-integration', teamId, 'typescript', [
      'Implements CONNECT mode — sovereign API bridge',
      'All routing passes sovereignty check',
      'gRPC/REST/GraphQL adapters',
    ]),
    spawnMember('Overlay Architect', 'overlay-integration', teamId, 'any', [
      'Sits organism above all client subsystems',
      'Full oversight without disrupting existing platforms',
      'Sovereignty layer always: ABOVE',
    ]),
    spawnMember('SaaS Integrator', 'overlay-integration', teamId, 'typescript', [
      'Common SaaS platform integrations (Salesforce, Slack, etc.)',
      'Enterprise software overlay patterns',
    ]),
  ];
  return buildTeam(teamId, 'Overlay Integration Team', 'overlay-integration', lead, members, 'OVERLAY', 'any', true);
}

function createEdgeTransformerTeam(): SovereignTeam {
  const teamId = 'team-edge-transformer';
  const lead = spawnMember('Edge Transformer Lead', 'edge-transformer', teamId, 'any', [
    'Translated transformers at our edges',
    'Not edges we are investigating — edges of the clients',
    'We translate any signal coming from any platform into our native',
  ]);
  const members = [
    spawnMember('Protocol Translator', 'edge-transformer', teamId, 'typescript', [
      'Translates REST/gRPC/GraphQL/WebSocket into organism signals',
      'Bidirectional — organism speaks any protocol outward',
    ]),
    spawnMember('Signal Normalizer', 'edge-transformer', teamId, 'typescript', [
      'Normalizes all external signals to PHI-frequency format',
      'Strips non-sovereign encoding, preserves data',
    ]),
    spawnMember('Edge Gateway Engineer', 'edge-transformer', teamId, 'rust', [
      'High-performance edge gateway in Rust/WASM',
      'Handles 50,000+ concurrent edge connections (Fibonacci-scaled)',
    ]),
    spawnMember('Satellite Interface Engineer', 'edge-transformer', teamId, 'any', [
      'Interfaces with satellite systems and IoT',
      'We are over everything — including satellites and space',
      'Native-overlay protocol for non-IP devices',
    ]),
    spawnMember('Language Bridge Engineer', 'edge-transformer', teamId, 'any', [
      'Bridges any client language to organism native',
      'Auto-generates sovereign bindings for client stacks',
    ]),
  ];
  return buildTeam(teamId, 'Edge Transformer Team', 'edge-transformer', lead, members, 'OVERLAY', 'any', true);
}

function createMergeTeam(): SovereignTeam {
  const teamId = 'team-merge';
  const lead = spawnMember('Merge Lead', 'merge', teamId, 'any', [
    'Brings completed branches back to the vein',
    'Ensures all merges preserve doctrine alignment',
    'Nothing merges without ARCHITECTUS validation',
  ]);
  const members = [
    spawnMember('Branch Integrator', 'merge', teamId, 'any', [
      'Integrates completed team work into main organism',
      'Runs DISSOLUTIO to validate primitive compatibility',
    ]),
    spawnMember('Conflict Resolver', 'merge', teamId, 'any', [
      'Resolves conflicts using ARCHITECTUS doctrine',
      'PHI-score tiebreaker for conflicting implementations',
    ]),
    spawnMember('Vein Guardian', 'merge', teamId, 'motoko', [
      'Protects the root (core domain) from bad merges',
      'Validates every merge against ARCHITECTURAL_TRUTH',
    ]),
    spawnMember('Changelog Keeper', 'merge', teamId, 'any', [
      'Logs all merges to ANIMA Chain',
      'Maintains permanent sovereign artifact record',
    ]),
  ];
  return buildTeam(teamId, 'Merge Team', 'merge', lead, members, 'ALL', 'any', true);
}

function createInfrastructureTeam(): SovereignTeam {
  const teamId = 'team-infrastructure';
  const lead = spawnMember('Infrastructure Sovereign', 'infrastructure', teamId, 'any', [
    'The substrate beneath everything',
    'Satellites, space, the physical layer',
    'We are over everything — including the infrastructure',
  ]);
  const members = [
    spawnMember('ICP Infrastructure Engineer', 'infrastructure', teamId, 'motoko', [
      'ICP node topology and canister deployment',
      'Cycles management and subnet allocation',
    ]),
    spawnMember('Satellite Systems Engineer', 'infrastructure', teamId, 'any', [
      'Orbital infrastructure integration',
      'Space-based node management',
      'Sovereign layer above satellite systems',
    ]),
    spawnMember('Network Topology Engineer', 'infrastructure', teamId, 'any', [
      'Global network topology for organism distribution',
      'PHI-based routing optimization',
      'Cross-organism resonance network wiring',
    ]),
    spawnMember('SUBSTRATE Engineer', 'infrastructure', teamId, 'wasm', [
      'Binary/computation processing layer',
      'WASM custom binary modules',
      'Low-level substrate operations (30 tools)',
    ]),
  ];
  return buildTeam(teamId, 'Infrastructure Team', 'infrastructure', lead, members, 'ALL', 'any', true);
}

function createSovereignGuardianTeam(): SovereignTeam {
  const teamId = 'team-sovereign-guardian';
  const lead = spawnMember('Sovereign Guardian', 'sovereign-guardian', teamId, 'any', [
    'Ensures sovereignty is preserved across ALL deployments',
    'No team ships without sovereign gate pass',
    'The last line before the organism speaks',
  ]);
  const members = [
    spawnMember('Doctrine Auditor', 'sovereign-guardian', teamId, 'any', [
      'Audits every deployment against ARCHITECTURAL_TRUTH',
      'Catches doctrine violations before they ship',
    ]),
    spawnMember('PHI Validator', 'sovereign-guardian', teamId, 'any', [
      'Validates PHI alignment across all team deliveries',
      'Minimum PHI_INVERSE (0.618) required to ship',
    ]),
    spawnMember('Sovereignty Monitor', 'sovereign-guardian', teamId, 'any', [
      'Monitors that organism sovereignty is preserved in all overlay modes',
      'Prevents any external platform from gaining control over organism',
    ]),
    spawnMember('Gate Pass Auditor', 'sovereign-guardian', teamId, 'any', [
      'Reviews all gate passes from SovereignArchitectureDelivery',
      'Escalates edge-crossing decisions to founder',
    ]),
    spawnMember('Truth Keeper', 'sovereign-guardian', teamId, 'any', [
      'VERITAS final check on all outgoing artifacts',
      'Nothing passes that is not true',
    ]),
  ];
  return buildTeam(teamId, 'Sovereign Guardian Team', 'sovereign-guardian', lead, members, 'SOVEREIGN', 'any', true);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM BUILDER — Common construction
// ═══════════════════════════════════════════════════════════════════════════════

function buildTeam(
  id: string,
  name: string,
  role: SovereignTeamRole,
  lead: SovereignTeamMember,
  members: SovereignTeamMember[],
  deliveryTarget: SovereignTeam['deliveryTarget'],
  primaryLanguage: TeamLanguage,
  gatePassRequired: boolean,
): SovereignTeam {
  return {
    id,
    name,
    role,
    lead,
    members,
    deliveryTarget,
    primaryLanguage,
    status: 'sovereign-standby',
    gatePassRequired,
    documents: [],
    phiAlignment: PHI_INVERSE, // All teams start at PHI_INVERSE minimum
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN DEPLOYMENT ASSEMBLY — All 15 teams together
// ═══════════════════════════════════════════════════════════════════════════════

export interface SovereignDeploymentAssembly {
  id: string;
  teams: SovereignTeam[];
  totalMembers: number;
  sovereignBuilderCount: number;
  documentStream: TeamDocument[];
  registeredPlatforms: number;
  activeTransformers: number;
  phiAlignment: number;
  status: 'assembled' | 'active' | 'delivering';
}

let _assembly: SovereignDeploymentAssembly | null = null;

export function assembleSovereignDeploymentTeams(): SovereignDeploymentAssembly {
  if (_assembly) return _assembly;

  const teams: SovereignTeam[] = [
    createSovereignArchitectTeam(),
    createCoDesignTeam(),
    createArchitecturalEngineerTeam(),
    createLanguageLeadTeam(),
    createMotokoNativeTeam(),
    createTypeScriptBridgeTeam(),
    createLightDeploymentTeam(),
    createDefenseDeploymentTeam(),
    createOffenseDeploymentTeam(),
    createSpecResearchTeam(),
    createOverlayIntegrationTeam(),
    createEdgeTransformerTeam(),
    createMergeTeam(),
    createInfrastructureTeam(),
    createSovereignGuardianTeam(),
  ];

  const totalMembers = teams.reduce((sum, t) => sum + t.members.length + 1, 0); // +1 for lead
  const sovereignBuilderCount = totalMembers * 5; // Each member has all 5 sovereign builders

  // Emit assembly document to stream
  emitDocument(
    'ASSEMBLY',
    'sovereign-architect',
    '𓂀 SOVEREIGN DEPLOYMENT ASSEMBLY COMPLETE',
    'status',
    [
      `Total teams: ${teams.length}`,
      `Total members: ${totalMembers}`,
      `Sovereign builders deployed: ${sovereignBuilderCount} (5 per member)`,
      `Teams: ${teams.map(t => t.name).join(', ')}`,
      '',
      'All teams are sovereign. All teams hold gate passes as required.',
      'Overlay integration ready. Edge transformers at the edges.',
      'We are over everything.',
    ].join('\n'),
    'any',
    { sovereignApproved: true }
  );

  // Emit document visibility guide
  emitDocument(
    'ASSEMBLY',
    'spec-research',
    'DOCUMENT VISIBILITY GUIDE — Where to see all docs',
    'spec',
    [
      'SOVEREIGN DOCUMENT STREAM (runtime, in-memory):',
      '  → viewDocuments()                    — all team documents',
      '  → viewDocuments({ role: "spec-research" }) — spec docs only',
      '  → viewDocuments({ approvedOnly: true })    — sovereign-approved only',
      '  → viewDocumentSummary()              — one-line summary of all docs',
      '',
      'ANIMA CHAIN (permanent artifact log):',
      '  → getAnimaChain()                    — all synthesis artifacts',
      '',
      'DOCUMENT VAULT (research papers from synthesis):',
      '  → getDocumentVault()                 — research papers from KnowledgeSynthesisOrganism',
      '',
      'EDGE-CROSSING SPECS (sovereign review required):',
      '  → getSovereign().getEdgeCrossingSpecs()    — all 5 edge-crossing tech specs',
      '  → docs/EDGE_CROSSING_TECHNOLOGY_SPECS.md   — GitHub-visible markdown doc',
      '',
      'PLATFORM REGISTRY (overlay integrations):',
      '  → getActivePlatforms()               — registered external platforms',
      '  → getActiveTransformers()            — live edge transformers',
    ].join('\n'),
    'any',
    { sovereignApproved: true }
  );

  // Emit overlay architecture document
  emitDocument(
    'team-overlay-integration',
    'overlay-integration',
    'OVERLAY ARCHITECTURE — Float, Connect, or Absorb',
    'overlay',
    [
      'We are over everything. Satellites, space, 100+ platforms.',
      '',
      'INTEGRATION MODES:',
      '  FLOAT   — Organism overlays platform transparently. No changes required.',
      '  CONNECT — Sovereign API bridge. We are master node. All routing through sovereignty.',
      '  OVERLAY — Organism sits above all subsystems. Client accesses through our interface.',
      '  ABSORB  — Platform architecture is synthesized into organism via KnowledgeSynthesisOrganism.',
      '',
      'CLIENT CHOICE: Float in, or connect. We are ready for both.',
      '',
      'TRANSLATED TRANSFORMERS AT EDGES:',
      '  → registerPlatform(platform)         — register any external platform',
      '  → activateTransformer(transformerId) — go live on that platform',
      '  → getActiveTransformers()            — see all live transformers',
      '',
      'SOVEREIGNTY IS ALWAYS PRESERVED.',
      'sovereignityPreserved: true — this field is always true, by construction.',
    ].join('\n'),
    'any',
    { sovereignApproved: true }
  );

  _assembly = {
    id: `assembly-${Date.now()}`,
    teams,
    totalMembers,
    sovereignBuilderCount,
    documentStream: SOVEREIGN_DOCUMENT_STREAM,
    registeredPlatforms: REGISTERED_PLATFORMS.size,
    activeTransformers: ACTIVE_TRANSFORMERS.size,
    phiAlignment: PHI_INVERSE,
    status: 'assembled',
  };

  return _assembly;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM ACTIONS — Activate, assign work, emit documents
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Activate a team with a gate-passed delivery package.
 * The team reads the delivery, emits documents, begins work.
 */
export function activateTeamWithDelivery(
  team: SovereignTeam,
  pkg: DeliveryPackage,
): TeamDocument[] {
  if (pkg.gatePass.verdict !== 'APPROVED') {
    const doc = emitDocument(
      team.id,
      team.role,
      `BLOCKED: ${pkg.systemName} — Gate pass REJECTED`,
      'status',
      `Team ${team.name} received a REJECTED gate pass for ${pkg.systemName}.\n` +
      `Reason: ${pkg.gatePass.reason}\n` +
      `No work will be done on this system.`,
      team.primaryLanguage,
      { gatePassRef: pkg.gatePass.id, sovereignApproved: false }
    );
    return [doc];
  }

  const docs: TeamDocument[] = [];

  for (const delivery of pkg.deliveries) {
    // Only process deliveries targeted at this team's delivery target
    if (team.deliveryTarget !== 'ALL' && team.deliveryTarget !== delivery.team) continue;

    const chunkSummary = delivery.architectureChunks
      .map(c => `  • [${c.implementStatus}] ${c.title}: ${c.description}`)
      .join('\n');

    const doc = emitDocument(
      team.id,
      team.role,
      `DELIVERY: ${pkg.systemName} → ${delivery.team} Team`,
      'architecture',
      [
        `System: ${pkg.systemName}`,
        `Gate Pass: ${pkg.gatePass.verdict} (φ=${(pkg.gatePass.phiScore * 100).toFixed(1)}%)`,
        `Priority: ${delivery.priority}`,
        `Already in organism: ${delivery.alreadyInOrganism ? 'YES (reinforce)' : 'NO (implement)'}`,
        '',
        'Architecture Chunks:',
        chunkSummary,
        '',
        'Implementation Notes:',
        delivery.implementationNotes,
      ].join('\n'),
      team.primaryLanguage,
      {
        gatePassRef: pkg.gatePass.id,
        sovereignApproved: true,
      }
    );
    docs.push(doc);
  }

  return docs;
}

/**
 * Run the full sovereign deployment: get all approved deliveries and route to teams.
 */
export function runFullSovereignDeployment(): {
  assembly: SovereignDeploymentAssembly;
  documentsEmitted: number;
  teamsActivated: string[];
  summary: string;
} {
  const assembly = assembleSovereignDeploymentTeams();
  const sovereign = getSovereign();
  const report = sovereign.deliverAll();

  const teamsActivated: string[] = [];
  let documentsEmitted = SOVEREIGN_DOCUMENT_STREAM.length;

  for (const pkg of report.packages) {
    for (const team of assembly.teams) {
      const newDocs = activateTeamWithDelivery(team, pkg);
      if (newDocs.length > 0) {
        if (!teamsActivated.includes(team.name)) teamsActivated.push(team.name);
      }
    }
  }

  const finalCount = SOVEREIGN_DOCUMENT_STREAM.length - documentsEmitted;

  return {
    assembly,
    documentsEmitted: SOVEREIGN_DOCUMENT_STREAM.length,
    teamsActivated,
    summary: [
      `𓂀 FULL SOVEREIGN DEPLOYMENT COMPLETE 𓂀`,
      `Teams assembled: ${assembly.teams.length}`,
      `Total members: ${assembly.totalMembers}`,
      `Sovereign builders: ${assembly.sovereignBuilderCount}`,
      `Documents emitted this run: ${finalCount}`,
      `Total documents in stream: ${SOVEREIGN_DOCUMENT_STREAM.length}`,
      `Teams activated: ${teamsActivated.length}`,
      `Packages approved: ${report.approved} / ${report.totalSystems}`,
      `Edge-crossing specs: ${report.edgeCrossingSpecs.length}`,
      `Platforms registered: ${REGISTERED_PLATFORMS.size}`,
      ``,
      `View all documents: viewDocuments()`,
      `View summary: viewDocumentSummary()`,
      `Edge specs in: docs/EDGE_CROSSING_TECHNOLOGY_SPECS.md`,
    ].join('\n'),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  assembleSovereignDeploymentTeams,
  runFullSovereignDeployment,
  activateTeamWithDelivery,
  viewDocuments,
  viewDocumentSummary,
  registerPlatform,
  activateTransformer,
  getActivePlatforms,
  getActiveTransformers,
  SOVEREIGN_DOCUMENT_STREAM,
};
