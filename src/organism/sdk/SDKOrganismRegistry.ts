// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * SDK ORGANISM REGISTRY — 20 SOVEREIGN SDK ORGANISMS
 * ─────────────────────────────────────────────────────────────────────────
 * Every SDK is a living organism. Every organism owns sub-packages.
 * Half have sub-packages (1-10), half are standalone (11-20).
 *
 * Plus 7 SYSTEM CATEGORIES — each with 5 TECHNOLOGIES + 5 MODELS:
 *   1. Multimodal SDKs
 *   2. Runtime Package
 *   3. Registry Package
 *   4. Terminal Package
 *   5. Kernel Package
 *   6. SDK Organisms
 *   7. Package Ecosystem Organisms
 *
 * "We already have it, but we have it every which is how we started.
 *  And then you do this and then you always have it again.
 *  It's infinite."
 * ─────────────────────────────────────────────────────────────────────────
 */

const PHI = 1.6180339887498948482;

// ═══════════════════════════════════════════════════════════════════════════════
// SDK ORGANISM TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SubPackage {
  name: string;
  latinName: string;
  description: string;
  version: string;
  standalone: boolean;
}

export interface SDKOrganism {
  id: number;
  name: string;
  latinName: string;
  description: string;
  version: string;
  hasSubPackages: boolean;
  subPackages: SubPackage[];
  technologies: string[];
  capabilities: string[];
  costPerCall: string;
  registeredAt: number;
}

export interface SystemCategory {
  name: string;
  latinName: string;
  description: string;
  technologies: Technology[];
  models: Model[];
}

export interface Technology {
  name: string;
  latinName: string;
  description: string;
  uses: string[];
  costPerUse: string;
}

export interface Model {
  name: string;
  latinName: string;
  description: string;
  capabilities: string[];
  costPerInference: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 20 SDK ORGANISMS
// SDKs 1-10: WITH sub-packages
// SDKs 11-20: STANDALONE (no sub-packages)
// ═══════════════════════════════════════════════════════════════════════════════

export const SDK_ORGANISMS: SDKOrganism[] = [
  // ── SDKs 1-10: WITH SUB-PACKAGES ──
  {
    id: 1,
    name: 'medina-memory-sdk',
    latinName: 'Memoria Completa',
    description: 'Full sovereign memory SDK — team-vault, memory-palace, temporal-memory, knowledge-graph all in one.',
    version: '2.0.0',
    hasSubPackages: true,
    subPackages: [
      { name: 'team-vault', latinName: 'Arca Coetus', description: 'Multi-tier AI team memory vault', version: '1.0.0', standalone: true },
      { name: 'memory-palace', latinName: 'Palatium Memoriae', description: 'Spatial φ-room memory architecture', version: '1.0.0', standalone: true },
      { name: 'temporal-memory', latinName: 'Memoria Temporalis', description: 'Time-anchored Fibonacci recall', version: '1.0.0', standalone: true },
      { name: 'knowledge-graph', latinName: 'Graphum Scientiae', description: 'Sovereign entity/relation store', version: '1.0.0', standalone: true },
    ],
    technologies: ['PHI_MEMORY', 'TTL_DECAY', 'SPATIAL_INDEX', 'TEMPORAL_ANCHOR'],
    capabilities: ['Store', 'Recall', 'Decay', 'Spatial query', 'Temporal query', 'Cross-agent sharing'],
    costPerCall: '$0.001',
    registeredAt: Date.now(),
  },
  {
    id: 2,
    name: 'medina-intelligence-engine',
    latinName: 'Machina Intelligentiae',
    description: 'Token Economy + Voting + CPL — 5 transformers, 5 models, 30 uses.',
    version: '1.0.0',
    hasSubPackages: true,
    subPackages: [
      { name: 'token-economy', latinName: 'Oeconomia Tokenorum', description: 'Intelligence contract token system', version: '1.0.0', standalone: true },
      { name: 'voting-bill', latinName: 'Lex Suffragii', description: 'Token-weighted governance engine', version: '1.0.0', standalone: true },
      { name: 'cpl-compiler', latinName: 'Compilator CPL', description: 'Cognitive Procurement Language compiler', version: '1.0.0', standalone: true },
    ],
    technologies: ['CPL', 'TOKEN_WEIGHTED_VOTING', 'CONTRACT_LIFECYCLE', 'AUDIT_CHAIN'],
    capabilities: ['Propose contracts', 'Execute lifecycle', 'Vote on bills', 'Audit trail', 'Dispute resolution'],
    costPerCall: '$0.005',
    registeredAt: Date.now(),
  },
  {
    id: 3,
    name: 'medina-substrate-os',
    latinName: 'Systema Substrati',
    description: '20 Multi-Identity Technologies + Organism Generator + 5 Substrates.',
    version: '1.0.0',
    hasSubPackages: true,
    subPackages: [
      { name: 'persona-engine', latinName: 'Machina Personae', description: 'Identity creation and lifecycle', version: '1.0.0', standalone: true },
      { name: 'canister-forge', latinName: 'Fabrica Canistri', description: 'Compact SDKs into canisters', version: '1.0.0', standalone: true },
      { name: 'seed-compiler', latinName: 'Compilator Seminis', description: 'Compile organisms into minimal seeds', version: '1.0.0', standalone: true },
      { name: 'spinal-cord-bus', latinName: 'Via Spinalis', description: 'Shared memory backbone across identities', version: '1.0.0', standalone: true },
      { name: 'substrate-bridge', latinName: 'Pons Substrati', description: 'Bridge between ICP/web/quantum substrates', version: '1.0.0', standalone: true },
    ],
    technologies: ['MULTI_IDENTITY', 'CANISTER_DEPLOYMENT', 'SUBSTRATE_ROUTING', 'SPINAL_CORD'],
    capabilities: ['Create identities', 'Forge canisters', 'Compile seeds', 'Route to substrates', 'Cross-identity memory'],
    costPerCall: '$0.01',
    registeredAt: Date.now(),
  },
  {
    id: 4,
    name: 'medina-alpha-council',
    latinName: 'Consilium Alphae',
    description: '2 Alpha Models + 3 Solvers + 3 Engines + City-State Architecture.',
    version: '1.0.0',
    hasSubPackages: true,
    subPackages: [
      { name: 'praefectus-model', latinName: 'Praefectus Signalis', description: 'Signal Commander alpha model', version: '1.0.0', standalone: true },
      { name: 'oraculum-model', latinName: 'Oraculum Consilii', description: 'Machine Oracle alpha model', version: '1.0.0', standalone: true },
      { name: 'solver-council', latinName: 'Consilium Solutorum', description: 'ARCHITECTUS + COGNITOR + VERIFICATOR', version: '1.0.0', standalone: true },
    ],
    technologies: ['ALPHA_SIGNAL', 'ORACLE_PREDICTION', 'MULTI_SOLVER', 'CITY_STATE'],
    capabilities: ['Signal routing', 'Prediction', 'Architecture solving', 'Context cognition', 'Integrity verification'],
    costPerCall: '$0.003',
    registeredAt: Date.now(),
  },
  {
    id: 5,
    name: 'medina-consensus-suite',
    latinName: 'Consensus Completa',
    description: 'Complete consensus toolkit — weighted voting, veto, confidence floor, role-based.',
    version: '1.0.0',
    hasSubPackages: true,
    subPackages: [
      { name: 'consensus-engine', latinName: 'Machina Consensus', description: 'Role-weighted multi-agent voting', version: '1.0.0', standalone: true },
      { name: 'agent-signal', latinName: 'Signalum Agentis', description: 'Decoupled agent pub/sub bus', version: '1.0.0', standalone: true },
      { name: 'governance-core', latinName: 'Nucleus Gubernationis', description: 'Governance proposals & voting', version: '1.0.0', standalone: true },
    ],
    technologies: ['WEIGHTED_VOTING', 'VETO_PROTOCOL', 'CONFIDENCE_FLOOR', 'PUB_SUB'],
    capabilities: ['Multi-agent voting', 'Veto check', 'Confidence threshold', 'Signal broadcast', 'Role governance'],
    costPerCall: '$0.002',
    registeredAt: Date.now(),
  },
  {
    id: 6,
    name: 'medina-security-suite',
    latinName: 'Securitas Completa',
    description: 'Post-quantum encryption, SAEIS enforcement, sandbox isolation, VetKeys.',
    version: '1.0.0',
    hasSubPackages: true,
    subPackages: [
      { name: 'nova-encryption', latinName: 'Nova Encryptio', description: 'Post-quantum φ-cryptography', version: '1.0.0', standalone: true },
      { name: 'sandbox-layer', latinName: 'Stratum Harenae', description: 'Process isolation walls', version: '1.0.0', standalone: true },
      { name: 'saeis-enforcer', latinName: 'Custos SAEIS', description: 'Sovereign Active Enforcement Intelligence', version: '1.0.0', standalone: true },
    ],
    technologies: ['POST_QUANTUM', 'PHI_ENCRYPTION', 'SANDBOX_ISOLATION', 'VETKEYS'],
    capabilities: ['Encrypt', 'Decrypt', 'Sandbox processes', 'Enforce access', 'Key rotation'],
    costPerCall: '$0.008',
    registeredAt: Date.now(),
  },
  {
    id: 7,
    name: 'medina-document-engine',
    latinName: 'Machina Documentorum',
    description: 'Living document engine — organisms that self-update, encrypt, and protect.',
    version: '1.0.0',
    hasSubPackages: true,
    subPackages: [
      { name: 'living-document', latinName: 'Documentum Vivum', description: 'Living organism document engine', version: '1.0.0', standalone: true },
      { name: 'organism-contracts', latinName: 'Contractus Organismi', description: 'SAT tokens & enforcement records', version: '1.0.0', standalone: true },
    ],
    technologies: ['LIVING_DOCS', 'SELF_UPDATE', 'ENCRYPTED_DOCS', 'ORGANISM_BINDING'],
    capabilities: ['Self-update', 'Encrypt documents', 'Bind to organisms', 'Track changes', 'Enforce licensing'],
    costPerCall: '$0.003',
    registeredAt: Date.now(),
  },
  {
    id: 8,
    name: 'medina-frequency-suite',
    latinName: 'Frequentia Completa',
    description: 'Harmonic compute + frequency engine + Schumann resonance — φ-timed everything.',
    version: '1.0.0',
    hasSubPackages: true,
    subPackages: [
      { name: 'harmonic-compute', latinName: 'Computatio Harmonica', description: 'Schumann-locked frequency math', version: '1.0.0', standalone: true },
      { name: 'frequency-engine', latinName: 'Machina Frequentiae', description: 'Brainwave φ-timing', version: '1.0.0', standalone: true },
    ],
    technologies: ['PHI_TIMING', 'SCHUMANN_LOCK', 'BRAINWAVE_SYNC', 'GOLDEN_GC'],
    capabilities: ['φ-timed execution', 'Schumann resonance', 'Brainwave alignment', 'Harmonic scheduling'],
    costPerCall: '$0.001',
    registeredAt: Date.now(),
  },
  {
    id: 9,
    name: 'medina-translation-suite',
    latinName: 'Translatio Completa',
    description: 'Cross-ecosystem translation + replay — speak any language, replay any event.',
    version: '1.0.0',
    hasSubPackages: true,
    subPackages: [
      { name: 'medina-translate', latinName: 'Translatio Medina', description: 'Cross-language translation', version: '1.0.0', standalone: true },
      { name: 'replay-engine', latinName: 'Machina Repetitionis', description: 'Event replay system', version: '1.0.0', standalone: true },
      { name: 'sovereign-bus', latinName: 'Via Regia', description: 'Sovereign event routing', version: '1.0.0', standalone: true },
    ],
    technologies: ['CROSS_LANG', 'EVENT_REPLAY', 'SOVEREIGN_ROUTING', 'PROTOCOL_BRIDGE'],
    capabilities: ['Translate NPM↔Maven↔NuGet', 'Replay events', 'Route messages', 'Protocol bridging'],
    costPerCall: '$0.002',
    registeredAt: Date.now(),
  },
  {
    id: 10,
    name: 'medina-tools-marketplace',
    latinName: 'Forum Instrumentorum',
    description: 'AI tools marketplace — 28 tools, sovereign catalog, install from any terminal.',
    version: '1.0.0',
    hasSubPackages: true,
    subPackages: [
      { name: 'ai-tools-marketplace', latinName: 'Mercatus Instrumentorum', description: '28-tool sovereign catalog', version: '1.0.0', standalone: true },
      { name: 'agent-incentive-service', latinName: 'Servitium Incentivi', description: 'Mechanism-design coordination', version: '1.0.0', standalone: true },
      { name: 'role-engine', latinName: 'Machina Muneris', description: 'Role authority enforcement', version: '1.0.0', standalone: true },
    ],
    technologies: ['TOOL_CATALOG', 'INCENTIVE_DESIGN', 'ROLE_AUTHORITY', 'MARKETPLACE_API'],
    capabilities: ['Browse tools', 'Install tools', 'Incentive coordination', 'Role enforcement', 'Catalog management'],
    costPerCall: '$0.001',
    registeredAt: Date.now(),
  },

  // ── SDKs 11-20: STANDALONE (no sub-packages) ──
  {
    id: 11,
    name: 'medina-pipeline-sdk',
    latinName: 'Canalis Intelligentiae',
    description: 'AI pipeline construction — chain agents, gate outputs, route failures.',
    version: '1.0.0',
    hasSubPackages: false,
    subPackages: [],
    technologies: ['PIPELINE_CHAIN', 'GATE_OUTPUT', 'FAILURE_ROUTING', 'CONFIDENCE_CHECK'],
    capabilities: ['Chain agents', 'Gate outputs', 'Route failures', 'Confidence thresholds', 'Parallel execution', 'DAG pipelines'],
    costPerCall: '$0.004',
    registeredAt: Date.now(),
  },
  {
    id: 12,
    name: 'medina-debate-sdk',
    latinName: 'Disputatio Mechanica',
    description: 'Multi-agent debate engine — structured argumentation with scoring and resolution.',
    version: '1.0.0',
    hasSubPackages: false,
    subPackages: [],
    technologies: ['STRUCTURED_DEBATE', 'ARGUMENT_SCORING', 'RESOLUTION_ENGINE', 'POSITION_TRACKING'],
    capabilities: ['Open debates', 'Score arguments', 'Track positions', 'Resolve disputes', 'Generate summaries'],
    costPerCall: '$0.006',
    registeredAt: Date.now(),
  },
  {
    id: 13,
    name: 'medina-orchestrator-sdk',
    latinName: 'Orchestrator Agentium',
    description: 'Multi-agent orchestration — team assembly, task routing, load balancing.',
    version: '1.0.0',
    hasSubPackages: false,
    subPackages: [],
    technologies: ['TEAM_ASSEMBLY', 'TASK_ROUTING', 'LOAD_BALANCE', 'AGENT_LIFECYCLE'],
    capabilities: ['Assemble teams', 'Route tasks', 'Balance load', 'Manage agent lifecycle', 'Monitor health'],
    costPerCall: '$0.005',
    registeredAt: Date.now(),
  },
  {
    id: 14,
    name: 'medina-audit-sdk',
    latinName: 'Auditorium Fidei',
    description: 'Immutable audit trail — every action recorded, every contract traced.',
    version: '1.0.0',
    hasSubPackages: false,
    subPackages: [],
    technologies: ['IMMUTABLE_LOG', 'BLOCKCHAIN_ANCHOR', 'TRACE_GRAPH', 'COMPLIANCE_CHECK'],
    capabilities: ['Record actions', 'Trace contracts', 'Compliance verification', 'Forensic analysis', 'Export reports'],
    costPerCall: '$0.002',
    registeredAt: Date.now(),
  },
  {
    id: 15,
    name: 'medina-vision-sdk',
    latinName: 'Oro Visio',
    description: 'Screen reading and visual perception — see what the user sees.',
    version: '1.0.0',
    hasSubPackages: false,
    subPackages: [],
    technologies: ['SCREEN_CAPTURE', 'OCR_ENGINE', 'VISUAL_PARSE', 'ELEMENT_DETECT'],
    capabilities: ['Screen reading', 'OCR', 'Visual parsing', 'Element detection', 'Layout analysis'],
    costPerCall: '$0.008',
    registeredAt: Date.now(),
  },
  {
    id: 16,
    name: 'medina-hearing-sdk',
    latinName: 'Nova Auditus',
    description: 'Voice recognition and audio processing — hear what the user says.',
    version: '1.0.0',
    hasSubPackages: false,
    subPackages: [],
    technologies: ['VOICE_RECOGNITION', 'AUDIO_PARSE', 'SPEECH_SYNTHESIS', 'FREQUENCY_ANALYSIS'],
    capabilities: ['Voice recognition', 'Audio parsing', 'Speech synthesis', 'Frequency analysis', 'Emotion detection'],
    costPerCall: '$0.007',
    registeredAt: Date.now(),
  },
  {
    id: 17,
    name: 'medina-quantum-sdk',
    latinName: 'Quantum Profundum',
    description: 'Quantum-resistant operations — post-quantum encryption, lattice-based proofs.',
    version: '1.0.0',
    hasSubPackages: false,
    subPackages: [],
    technologies: ['LATTICE_CRYPTO', 'QUANTUM_PROOF', 'RESISTANT_HASH', 'ENTANGLE_SIM'],
    capabilities: ['Quantum-resistant encrypt', 'Lattice proofs', 'Post-quantum hash', 'Entanglement simulation'],
    costPerCall: '$0.01',
    registeredAt: Date.now(),
  },
  {
    id: 18,
    name: 'medina-canister-sdk',
    latinName: 'Canistrum Vivum',
    description: 'ICP canister development — deploy, manage, and monitor canisters.',
    version: '1.0.0',
    hasSubPackages: false,
    subPackages: [],
    technologies: ['CANISTER_DEPLOY', 'CYCLE_MANAGEMENT', 'INTER_CANISTER', 'STATE_SNAPSHOT'],
    capabilities: ['Deploy canisters', 'Manage cycles', 'Inter-canister calls', 'State snapshots', 'Hot upgrade'],
    costPerCall: '$0.005',
    registeredAt: Date.now(),
  },
  {
    id: 19,
    name: 'medina-saas-sdk',
    latinName: 'Servitium Nubium',
    description: 'SaaS product generation — 20 SaaS products from organism architecture.',
    version: '1.0.0',
    hasSubPackages: false,
    subPackages: [],
    technologies: ['SAAS_GENERATE', 'TENANT_ISOLATE', 'BILLING_ENGINE', 'API_GATEWAY'],
    capabilities: ['Generate SaaS products', 'Tenant isolation', 'Billing', 'API gateway', 'Usage metering'],
    costPerCall: '$0.003',
    registeredAt: Date.now(),
  },
  {
    id: 20,
    name: 'medina-civilization-sdk',
    latinName: 'Civitas SDK',
    description: 'City-state civilization builder — districts, citizens, government, infrastructure.',
    version: '1.0.0',
    hasSubPackages: false,
    subPackages: [],
    technologies: ['CITY_STATE', 'DISTRICT_MANAGEMENT', 'CITIZEN_REGISTRY', 'INFRASTRUCTURE'],
    capabilities: ['Found city-states', 'Manage districts', 'Register citizens', 'Build infrastructure', 'Route via spinal cord'],
    costPerCall: '$0.004',
    registeredAt: Date.now(),
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 7 SYSTEM CATEGORIES — 5 TECHNOLOGIES + 5 MODELS EACH
// ═══════════════════════════════════════════════════════════════════════════════

export const SYSTEM_CATEGORIES: SystemCategory[] = [
  // ── 1. MULTIMODAL SDKs ──
  {
    name: 'MULTIMODAL_SDKS',
    latinName: 'SDK Multimodalia',
    description: 'Multi-modal SDK technologies that span vision, hearing, text, code, and reasoning.',
    technologies: [
      {
        name: 'VISIO_MULTIMODAL',
        latinName: 'Visio Multiplex',
        description: 'Multi-modal vision processing — screen, camera, document, diagram parsing.',
        uses: ['Screen capture analysis', 'Document OCR', 'Diagram understanding', 'UI element detection', 'Visual reasoning'],
        costPerUse: '$0.008',
      },
      {
        name: 'AUDITUS_MULTIMODAL',
        latinName: 'Auditus Multiplex',
        description: 'Multi-modal audio processing — speech, music, frequency, emotion analysis.',
        uses: ['Speech-to-text', 'Emotion from voice', 'Frequency spectrum analysis', 'Music understanding', 'Command detection'],
        costPerUse: '$0.007',
      },
      {
        name: 'TEXTUS_MULTIMODAL',
        latinName: 'Textus Multiplex',
        description: 'Multi-modal text processing — NLP, CPL, code, documentation, knowledge extraction.',
        uses: ['Natural language understanding', 'CPL compilation', 'Code generation', 'Knowledge extraction', 'Semantic search'],
        costPerUse: '$0.003',
      },
      {
        name: 'CODEX_MULTIMODAL',
        latinName: 'Codex Multiplex',
        description: 'Multi-modal code intelligence — generation, review, refactor, test, deploy.',
        uses: ['Code generation', 'Code review', 'Refactoring', 'Test generation', 'Deployment automation'],
        costPerUse: '$0.005',
      },
      {
        name: 'RATIO_MULTIMODAL',
        latinName: 'Ratio Multiplex',
        description: 'Multi-modal reasoning — chain-of-thought, debate, consensus, verification.',
        uses: ['Chain-of-thought reasoning', 'Multi-agent debate', 'Consensus synthesis', 'Fact verification', 'Logical inference'],
        costPerUse: '$0.006',
      },
    ],
    models: [
      {
        name: 'UNITAS',
        latinName: 'Unitas Multimodalis',
        description: 'Unified multimodal model — processes all modalities through a single intelligence.',
        capabilities: ['Cross-modal fusion', 'Modality translation', 'Joint reasoning', 'Context preservation', 'Modal arbitration'],
        costPerInference: '$0.01',
      },
      {
        name: 'SENSORIA',
        latinName: 'Sensoria Profunda',
        description: 'Deep sensory model — raw perception across all input types.',
        capabilities: ['Raw perception', 'Feature extraction', 'Pattern recognition', 'Anomaly detection', 'Signal filtering'],
        costPerInference: '$0.008',
      },
      {
        name: 'SYNTHESIUS',
        latinName: 'Synthesius Generativus',
        description: 'Generative synthesis model — creates outputs across all modalities.',
        capabilities: ['Text generation', 'Code generation', 'Audio synthesis', 'Visual generation', 'Document composition'],
        costPerInference: '$0.012',
      },
      {
        name: 'CRITICUS',
        latinName: 'Criticus Evaluator',
        description: 'Critical evaluation model — scores, ranks, and filters multimodal outputs.',
        capabilities: ['Quality scoring', 'Relevance ranking', 'Hallucination detection', 'Confidence calibration', 'Output filtering'],
        costPerInference: '$0.005',
      },
      {
        name: 'MEMORIUS',
        latinName: 'Memorius Contextus',
        description: 'Contextual memory model — maintains state across multimodal interactions.',
        capabilities: ['Context window management', 'Long-term memory', 'Session state', 'Cross-modal recall', 'Memory compression'],
        costPerInference: '$0.004',
      },
    ],
  },

  // ── 2. RUNTIME PACKAGE ──
  {
    name: 'RUNTIME_PACKAGE',
    latinName: 'Fasciculus Executionis',
    description: 'Runtime technologies and models for sovereign process execution.',
    technologies: [
      {
        name: 'PHI_GC',
        latinName: 'Collectio Aurea',
        description: 'Golden ratio garbage collection — memory freed on φ-timed intervals.',
        uses: ['φ-timed GC cycles', 'Memory pressure relief', 'Process isolation', 'Heap compaction', 'Reference counting'],
        costPerUse: '$0.0001',
      },
      {
        name: 'MODULE_LOADER',
        latinName: 'Onerator Modulorum',
        description: 'Sovereign module loader — resolves .medina, .cpl, .sovereign, .organism extensions.',
        uses: ['Extension resolution', 'SAT token binding', 'Cross-ecosystem import', 'Cache management', 'Hot reload'],
        costPerUse: '$0.0002',
      },
      {
        name: 'PROCESS_SPAWNER',
        latinName: 'Generator Processuum',
        description: 'Sovereign process spawner — every process gets SAT binding and subsystem access.',
        uses: ['Process creation', 'SAT binding', 'Subsystem wiring', 'Resource allocation', 'Lifecycle management'],
        costPerUse: '$0.001',
      },
      {
        name: 'CPL_INTERPRETER',
        latinName: 'Interpres CPL',
        description: 'Native CPL interpreter — execute Cognitive Procurement Language at runtime.',
        uses: ['CPL parsing', 'Contract execution', 'Term evaluation', 'Obligation tracking', 'Runtime validation'],
        costPerUse: '$0.003',
      },
      {
        name: 'CROSS_BRIDGE',
        latinName: 'Pons Ecosystematis',
        description: 'Cross-ecosystem bridge — auto-translate imports from Maven/NuGet/Ruby/NPM.',
        uses: ['Import translation', 'Package mapping', 'Version resolution', 'Dependency bridging', 'Container wrapping'],
        costPerUse: '$0.002',
      },
    ],
    models: [
      {
        name: 'EXECUTOR',
        latinName: 'Executor Processuum',
        description: 'Process execution model — optimizes scheduling and resource allocation.',
        capabilities: ['Schedule optimization', 'Resource prediction', 'Deadlock prevention', 'Priority queuing', 'Load prediction'],
        costPerInference: '$0.003',
      },
      {
        name: 'GUARDIAN',
        latinName: 'Custos Memoriae',
        description: 'Memory guardian model — prevents leaks, enforces boundaries, optimizes allocation.',
        capabilities: ['Leak detection', 'Boundary enforcement', 'Allocation optimization', 'Fragmentation repair', 'Pressure prediction'],
        costPerInference: '$0.002',
      },
      {
        name: 'RESOLVER',
        latinName: 'Resolver Dependentiarum',
        description: 'Dependency resolver model — finds optimal module resolution paths.',
        capabilities: ['Dependency resolution', 'Version conflict resolution', 'Circular detection', 'Optimal path finding', 'Cache strategy'],
        costPerInference: '$0.002',
      },
      {
        name: 'DIAGNOSTICUS',
        latinName: 'Diagnosticus Systematis',
        description: 'Runtime diagnostics model — identifies performance issues and suggests fixes.',
        capabilities: ['Performance profiling', 'Bottleneck identification', 'Fix suggestion', 'Regression detection', 'Health scoring'],
        costPerInference: '$0.004',
      },
      {
        name: 'ADAPTATOR',
        latinName: 'Adaptator Ambienti',
        description: 'Environment adaptation model — adapts runtime behavior to deployment context.',
        capabilities: ['Environment detection', 'Config adaptation', 'Resource scaling', 'Feature toggling', 'Graceful degradation'],
        costPerInference: '$0.003',
      },
    ],
  },

  // ── 3. REGISTRY PACKAGE ──
  {
    name: 'REGISTRY_PACKAGE',
    latinName: 'Fasciculus Registri',
    description: 'Registry technologies and models for sovereign package management.',
    technologies: [
      {
        name: 'PKG_PUBLISH',
        latinName: 'Publicator Fasciculorum',
        description: 'Package publish pipeline — validate, sign, encrypt, and publish to registries.',
        uses: ['Package validation', 'Cryptographic signing', 'Manifest generation', 'Version management', 'Registry upload'],
        costPerUse: '$0.005',
      },
      {
        name: 'PKG_RESOLVE',
        latinName: 'Resolver Fasciculorum',
        description: 'Package resolver — find, download, verify, and install packages across registries.',
        uses: ['Registry search', 'Version resolution', 'Integrity verification', 'Dependency tree', 'Lockfile generation'],
        costPerUse: '$0.002',
      },
      {
        name: 'PKG_MIRROR',
        latinName: 'Speculum Registri',
        description: 'Registry mirror — sync packages between MEDINA PKG and SOVEREIGN REGISTRY.',
        uses: ['Cross-registry sync', 'Selective mirroring', 'Bandwidth optimization', 'Availability failover', 'Geo-distribution'],
        costPerUse: '$0.003',
      },
      {
        name: 'PKG_AUDIT',
        latinName: 'Auditor Fasciculorum',
        description: 'Package audit — vulnerability scanning, license compliance, dependency health.',
        uses: ['Vulnerability scan', 'License compliance', 'Dependency health', 'Supply chain verification', 'Risk scoring'],
        costPerUse: '$0.004',
      },
      {
        name: 'PKG_TRANSLATE',
        latinName: 'Translator Fasciculorum',
        description: 'Package translation — convert packages between NPM/Maven/NuGet/Gems/Docker.',
        uses: ['NPM→Maven conversion', 'NuGet→Gems bridging', 'Docker containerization', 'JVM packaging', 'Universal manifest'],
        costPerUse: '$0.006',
      },
    ],
    models: [
      {
        name: 'CURATOR',
        latinName: 'Curator Registri',
        description: 'Registry curator model — ranks packages, detects quality, suggests alternatives.',
        capabilities: ['Quality ranking', 'Alternative suggestion', 'Deprecation detection', 'Trend analysis', 'Community health'],
        costPerInference: '$0.003',
      },
      {
        name: 'VERIFICATOR_PKG',
        latinName: 'Verificator Fasciculorum',
        description: 'Package verification model — validates integrity, authenticity, and provenance.',
        capabilities: ['Integrity validation', 'Signature verification', 'Provenance tracking', 'Tamper detection', 'Chain of custody'],
        costPerInference: '$0.004',
      },
      {
        name: 'COMPATIBILIS',
        latinName: 'Compatibilis Universalis',
        description: 'Compatibility model — predicts cross-ecosystem compatibility.',
        capabilities: ['Compatibility prediction', 'Breaking change detection', 'Migration path planning', 'API diff analysis', 'Interop scoring'],
        costPerInference: '$0.005',
      },
      {
        name: 'OPTIMIZATOR',
        latinName: 'Optimizator Arborum',
        description: 'Dependency tree optimizer — minimizes size, maximizes reuse, eliminates duplicates.',
        capabilities: ['Tree shaking', 'Duplicate elimination', 'Reuse maximization', 'Size optimization', 'Load order planning'],
        costPerInference: '$0.003',
      },
      {
        name: 'NAVIGATOR',
        latinName: 'Navigator Registri',
        description: 'Registry navigator model — semantic search across all registered packages.',
        capabilities: ['Semantic search', 'Concept matching', 'Use-case recommendation', 'API discovery', 'Documentation indexing'],
        costPerInference: '$0.002',
      },
    ],
  },

  // ── 4. TERMINAL PACKAGE ──
  {
    name: 'TERMINAL_PACKAGE',
    latinName: 'Fasciculus Terminalis',
    description: 'Terminal technologies and models for sovereign command-line intelligence.',
    technologies: [
      {
        name: 'TERMINAL_CORE',
        latinName: 'Nucleus Terminalis',
        description: 'Core terminal — sovereign command-line interface with organism awareness.',
        uses: ['Command parsing', 'Organism state display', 'Process management', 'System monitoring', 'Interactive REPL'],
        costPerUse: '$0.001',
      },
      {
        name: 'TERMINAL_AI',
        latinName: 'Intelligentia Terminalis',
        description: 'AI-powered terminal — natural language commands, auto-complete, suggestions.',
        uses: ['Natural language commands', 'Auto-complete', 'Command suggestions', 'Error explanation', 'Context-aware help'],
        costPerUse: '$0.003',
      },
      {
        name: 'TERMINAL_VIS',
        latinName: 'Visualis Terminalis',
        description: 'Visual terminal — real-time graphs, organism diagrams, status dashboards.',
        uses: ['Real-time graphs', 'Organism diagrams', 'Status dashboards', 'Memory visualization', 'Network topology'],
        costPerUse: '$0.002',
      },
      {
        name: 'TERMINAL_SEC',
        latinName: 'Securitas Terminalis',
        description: 'Security terminal — encrypted sessions, access logging, threat monitoring.',
        uses: ['Encrypted sessions', 'Access logging', 'Threat monitoring', 'Audit trail', 'Permission enforcement'],
        costPerUse: '$0.004',
      },
      {
        name: 'TERMINAL_MULTI',
        latinName: 'Multi Terminalis',
        description: 'Multi-terminal — split views, cross-terminal sync, shared sessions.',
        uses: ['Split views', 'Cross-terminal sync', 'Shared sessions', 'Team collaboration', 'Remote access'],
        costPerUse: '$0.002',
      },
    ],
    models: [
      {
        name: 'INTERPRES_CMD',
        latinName: 'Interpres Mandatorum',
        description: 'Command interpreter model — translates natural language to terminal commands.',
        capabilities: ['NL to command', 'Intent detection', 'Parameter inference', 'Command chaining', 'Error recovery'],
        costPerInference: '$0.003',
      },
      {
        name: 'MONITOR',
        latinName: 'Monitor Systematis',
        description: 'System monitor model — real-time health, alerts, predictive maintenance.',
        capabilities: ['Health monitoring', 'Alert generation', 'Predictive maintenance', 'Anomaly detection', 'Trend analysis'],
        costPerInference: '$0.002',
      },
      {
        name: 'ASSISTANT',
        latinName: 'Assistens Terminalis',
        description: 'Terminal assistant model — helps users navigate, explains errors, suggests fixes.',
        capabilities: ['Error explanation', 'Fix suggestion', 'Navigation help', 'Documentation lookup', 'Tutorial generation'],
        costPerInference: '$0.002',
      },
      {
        name: 'AUTOMATOR',
        latinName: 'Automator Scriptorum',
        description: 'Script automation model — generates, optimizes, and maintains terminal scripts.',
        capabilities: ['Script generation', 'Optimization', 'Maintenance', 'Cross-platform adaptation', 'Idempotency verification'],
        costPerInference: '$0.004',
      },
      {
        name: 'HISTORIAN',
        latinName: 'Historicus Terminalis',
        description: 'Terminal historian model — analyzes command history, learns patterns, predicts needs.',
        capabilities: ['History analysis', 'Pattern learning', 'Need prediction', 'Workflow reconstruction', 'Usage analytics'],
        costPerInference: '$0.002',
      },
    ],
  },

  // ── 5. KERNEL PACKAGE ──
  {
    name: 'KERNEL_PACKAGE',
    latinName: 'Fasciculus Nuclei',
    description: 'Kernel technologies and models for sovereign core operations.',
    technologies: [
      {
        name: 'HEARTBEAT',
        latinName: 'Pulsus Cordis',
        description: 'Organism heartbeat — φ-timed pulse that synchronizes all subsystems.',
        uses: ['System sync', 'Health check', 'Clock distribution', 'State propagation', 'Coherence maintenance'],
        costPerUse: '$0.0001',
      },
      {
        name: 'CORE_OPS',
        latinName: 'Operationes Fundamentales',
        description: 'Core operations — transfer, invert, bypass, disguise, re-entry.',
        uses: ['Data transfer', 'Signal inversion', 'Layer bypass', 'Identity disguise', 'Re-entry processing'],
        costPerUse: '$0.001',
      },
      {
        name: 'LAYER_MANAGER',
        latinName: 'Gubernator Stratorum',
        description: 'Layer manager — ceiling to floor flow management across all 8 layers.',
        uses: ['Flow routing', 'Layer sync', 'Priority scheduling', 'Bottleneck relief', 'Cross-layer messaging'],
        costPerUse: '$0.001',
      },
      {
        name: 'ORGANISM_LIFECYCLE',
        latinName: 'Cyclus Vitae Organismi',
        description: 'Organism lifecycle — boot, awaken, dream, evolve, hibernate, terminate.',
        uses: ['Boot sequence', 'Awakening', 'Dream processing', 'Evolution triggers', 'Graceful shutdown'],
        costPerUse: '$0.002',
      },
      {
        name: 'WIRING_ENGINE',
        latinName: 'Machina Connexionis',
        description: 'Architecture wiring engine — connects root to all branches dynamically.',
        uses: ['Dynamic wiring', 'Branch discovery', 'Connection health', 'Rewiring on failure', 'Topology optimization'],
        costPerUse: '$0.001',
      },
    ],
    models: [
      {
        name: 'ARCHITECTUS_KERNEL',
        latinName: 'Architectus Nuclei',
        description: 'Kernel architect model — designs optimal kernel configurations for workloads.',
        capabilities: ['Config optimization', 'Workload analysis', 'Resource planning', 'Topology design', 'Performance modeling'],
        costPerInference: '$0.005',
      },
      {
        name: 'IMMUNIS',
        latinName: 'Immunis Systematis',
        description: 'System immune model — detects and responds to threats, corruption, instability.',
        capabilities: ['Threat detection', 'Corruption repair', 'Instability response', 'Self-healing', 'Quarantine management'],
        costPerInference: '$0.006',
      },
      {
        name: 'EVOLUATOR',
        latinName: 'Evoluator Organismi',
        description: 'Evolution model — guides organism evolution through mutation and selection.',
        capabilities: ['Mutation proposal', 'Fitness evaluation', 'Selection pressure', 'Backward compatibility', 'Evolution history'],
        costPerInference: '$0.004',
      },
      {
        name: 'SYNCHRONUS',
        latinName: 'Synchronus Universalis',
        description: 'Universal sync model — keeps all subsystems coherent across time and space.',
        capabilities: ['Clock sync', 'State reconciliation', 'Conflict resolution', 'Eventual consistency', 'Partition tolerance'],
        costPerInference: '$0.003',
      },
      {
        name: 'THERMODYNAMUS',
        latinName: 'Thermodynamus Nuclei',
        description: 'Thermodynamic model — manages entropy, energy flow, and system temperature.',
        capabilities: ['Entropy measurement', 'Energy optimization', 'Heat dissipation', 'Cooling strategies', 'Equilibrium maintenance'],
        costPerInference: '$0.003',
      },
    ],
  },

  // ── 6. SDK ORGANISMS ──
  {
    name: 'SDK_ORGANISMS',
    latinName: 'Organismi SDK',
    description: 'SDK organism technologies and models — the SDKs that generate SDKs.',
    technologies: [
      {
        name: 'SDK_GENERATOR',
        latinName: 'Generator SDK',
        description: 'SDK generator — creates new SDKs from templates and organism specifications.',
        uses: ['Template-based SDK creation', 'API generation', 'Documentation generation', 'Test scaffold', 'CI/CD pipeline'],
        costPerUse: '$0.01',
      },
      {
        name: 'SDK_COMPOSITOR',
        latinName: 'Compositor SDK',
        description: 'SDK compositor — combines multiple SDKs into a single unified package.',
        uses: ['Package merging', 'API unification', 'Conflict resolution', 'Namespace management', 'Bundle optimization'],
        costPerUse: '$0.008',
      },
      {
        name: 'SDK_VERSIONER',
        latinName: 'Versionator SDK',
        description: 'SDK versioner — semantic versioning, changelog generation, migration paths.',
        uses: ['Semantic versioning', 'Changelog generation', 'Migration scripts', 'Breaking change detection', 'Compatibility matrix'],
        costPerUse: '$0.003',
      },
      {
        name: 'SDK_TESTER',
        latinName: 'Probator SDK',
        description: 'SDK test engine — generates and runs comprehensive test suites for SDKs.',
        uses: ['Test generation', 'Coverage analysis', 'Integration testing', 'Performance benchmarks', 'Fuzz testing'],
        costPerUse: '$0.005',
      },
      {
        name: 'SDK_DOCUMENTER',
        latinName: 'Documentator SDK',
        description: 'SDK documenter — auto-generates living documentation from code and types.',
        uses: ['API documentation', 'Usage examples', 'Architecture diagrams', 'Tutorial generation', 'Changelog compilation'],
        costPerUse: '$0.003',
      },
    ],
    models: [
      {
        name: 'FABRICATOR',
        latinName: 'Fabricator Organismi',
        description: 'Organism fabrication model — designs SDK architectures from requirements.',
        capabilities: ['Architecture design', 'API surface design', 'Dependency planning', 'Package structure', 'Extension points'],
        costPerInference: '$0.008',
      },
      {
        name: 'QUALITAS',
        latinName: 'Qualitas Assessor',
        description: 'Quality assessment model — evaluates SDK quality across multiple dimensions.',
        capabilities: ['Code quality scoring', 'API ergonomics', 'Documentation completeness', 'Test coverage', 'Security posture'],
        costPerInference: '$0.005',
      },
      {
        name: 'EXEMPLAR',
        latinName: 'Exemplar Generator',
        description: 'Example generation model — creates realistic usage examples and tutorials.',
        capabilities: ['Example generation', 'Tutorial creation', 'Use-case discovery', 'Best practice encoding', 'Anti-pattern detection'],
        costPerInference: '$0.004',
      },
      {
        name: 'MIGRATOR',
        latinName: 'Migrator Versionum',
        description: 'Version migration model — generates migration guides and automated codemods.',
        capabilities: ['Migration guide generation', 'Codemod creation', 'Backward compatibility check', 'Breaking change analysis', 'Rollback planning'],
        costPerInference: '$0.006',
      },
      {
        name: 'INTEGRATOR',
        latinName: 'Integrator Ecosystematis',
        description: 'Ecosystem integration model — connects SDKs to external ecosystems.',
        capabilities: ['Ecosystem mapping', 'Integration patterns', 'Adapter generation', 'Protocol bridging', 'Interop testing'],
        costPerInference: '$0.005',
      },
    ],
  },

  // ── 7. PACKAGE ECOSYSTEM ORGANISMS ──
  {
    name: 'PACKAGE_ECOSYSTEM_ORGANISMS',
    latinName: 'Organismi Ecosystematis',
    description: 'Package ecosystem technologies and models — the organisms that manage the ecosystem.',
    technologies: [
      {
        name: 'ECO_TOPOLOGY',
        latinName: 'Topologia Ecosystematis',
        description: 'Ecosystem topology — maps relationships between all packages and dependencies.',
        uses: ['Dependency mapping', 'Relationship visualization', 'Impact analysis', 'Orphan detection', 'Cluster identification'],
        costPerUse: '$0.003',
      },
      {
        name: 'ECO_HEALTH',
        latinName: 'Salus Ecosystematis',
        description: 'Ecosystem health — monitors vitality of all packages and their interactions.',
        uses: ['Health scoring', 'Vitality monitoring', 'Stale detection', 'Usage analytics', 'Engagement metrics'],
        costPerUse: '$0.002',
      },
      {
        name: 'ECO_GOVERNANCE',
        latinName: 'Gubernatio Ecosystematis',
        description: 'Ecosystem governance — policies, standards, and compliance across all packages.',
        uses: ['Policy enforcement', 'Standard compliance', 'License management', 'Naming conventions', 'Quality gates'],
        costPerUse: '$0.004',
      },
      {
        name: 'ECO_EVOLUTION',
        latinName: 'Evolutio Ecosystematis',
        description: 'Ecosystem evolution — tracks how the ecosystem grows, branches, and adapts.',
        uses: ['Growth tracking', 'Branch analysis', 'Adaptation patterns', 'Speciation detection', 'Ecosystem fitness'],
        costPerUse: '$0.003',
      },
      {
        name: 'ECO_ECONOMY',
        latinName: 'Oeconomia Ecosystematis',
        description: 'Ecosystem economy — token flows, value exchange, and economic health across packages.',
        uses: ['Token flow analysis', 'Value exchange tracking', 'Economic health scoring', 'Price discovery', 'Market making'],
        costPerUse: '$0.005',
      },
    ],
    models: [
      {
        name: 'ECOLOGUS',
        latinName: 'Ecologus Digitalis',
        description: 'Digital ecologist model — understands ecosystem dynamics and predicts evolution.',
        capabilities: ['Ecosystem modeling', 'Evolution prediction', 'Niche identification', 'Symbiosis detection', 'Extinction prevention'],
        costPerInference: '$0.006',
      },
      {
        name: 'GARDIANUS',
        latinName: 'Gardianus Ecosystematis',
        description: 'Ecosystem guardian model — protects ecosystem health and prevents degradation.',
        capabilities: ['Health protection', 'Degradation prevention', 'Pollution detection', 'Restoration planning', 'Diversity maintenance'],
        costPerInference: '$0.005',
      },
      {
        name: 'PROPAGATOR',
        latinName: 'Propagator Seminum',
        description: 'Seed propagation model — spreads packages to new environments and substrates.',
        capabilities: ['Cross-substrate deployment', 'Environment adaptation', 'Seed optimization', 'Germination prediction', 'Root establishment'],
        costPerInference: '$0.004',
      },
      {
        name: 'TAXONOMUS',
        latinName: 'Taxonomus Fasciculorum',
        description: 'Package taxonomy model — classifies, categorizes, and organizes the ecosystem.',
        capabilities: ['Classification', 'Categorization', 'Hierarchy building', 'Nomenclature standardization', 'Cross-reference mapping'],
        costPerInference: '$0.003',
      },
      {
        name: 'SYMBIONT',
        latinName: 'Symbiont Connectus',
        description: 'Symbiosis model — identifies and optimizes beneficial package interactions.',
        capabilities: ['Symbiosis detection', 'Interaction optimization', 'Co-evolution tracking', 'Mutualism scoring', 'Parasitism detection'],
        costPerInference: '$0.005',
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTRY CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class SDKOrganismRegistry {
  private organisms: Map<string, SDKOrganism> = new Map();
  private categories: Map<string, SystemCategory> = new Map();

  constructor() {
    // Register all 20 SDK organisms
    for (const org of SDK_ORGANISMS) {
      this.organisms.set(org.name, org);
    }
    // Register all 7 system categories
    for (const cat of SYSTEM_CATEGORIES) {
      this.categories.set(cat.name, cat);
    }
  }

  /** Get an SDK organism by name */
  getOrganism(name: string): SDKOrganism | undefined {
    return this.organisms.get(name);
  }

  /** Get all SDK organisms */
  getAllOrganisms(): SDKOrganism[] {
    return Array.from(this.organisms.values());
  }

  /** Get organisms with sub-packages */
  getWithSubPackages(): SDKOrganism[] {
    return this.getAllOrganisms().filter(o => o.hasSubPackages);
  }

  /** Get standalone organisms (no sub-packages) */
  getStandalone(): SDKOrganism[] {
    return this.getAllOrganisms().filter(o => !o.hasSubPackages);
  }

  /** Get a system category */
  getCategory(name: string): SystemCategory | undefined {
    return this.categories.get(name);
  }

  /** Get all system categories */
  getAllCategories(): SystemCategory[] {
    return Array.from(this.categories.values());
  }

  /** Get all technologies across all categories */
  getAllTechnologies(): Technology[] {
    return this.getAllCategories().flatMap(c => c.technologies);
  }

  /** Get all models across all categories */
  getAllModels(): Model[] {
    return this.getAllCategories().flatMap(c => c.models);
  }

  /** Count total sub-packages across all organisms */
  totalSubPackages(): number {
    return this.getAllOrganisms().reduce((sum, o) => sum + o.subPackages.length, 0);
  }

  /** Full registry status */
  status(): Record<string, unknown> {
    return {
      registry: 'SDK_ORGANISM_REGISTRY',
      latinName: 'Registrum Organismorum SDK',
      totalOrganisms: this.organisms.size,
      withSubPackages: this.getWithSubPackages().length,
      standalone: this.getStandalone().length,
      totalSubPackages: this.totalSubPackages(),
      systemCategories: this.categories.size,
      totalTechnologies: this.getAllTechnologies().length,
      totalModels: this.getAllModels().length,
      categories: this.getAllCategories().map(c => ({
        name: c.name,
        latinName: c.latinName,
        technologies: c.technologies.length,
        models: c.models.length,
      })),
    };
  }
}

/** Create the SDK Organism Registry */
export function createSDKRegistry(): SDKOrganismRegistry {
  return new SDKOrganismRegistry();
}
