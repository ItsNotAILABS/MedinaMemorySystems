/**
 * 𓂀 MEDINA EXC OS REGISTRY — 10 Sovereign OS Systems + 1 Desktop App 𓂀
 *
 * EXCs are sovereign operating systems — not applications that run ON an OS,
 * but the OS itself. Each EXC is a complete computational environment
 * with its own kernel, filesystem, process manager, and AI team.
 *
 * These don't go through Tauri. They don't go through Electron.
 * They ARE the operating system. Sovereign versions.
 *
 * Exception: EXC-Desktop is the one that ships as a desktop app
 * (via Electron) for users who need a familiar entry point.
 *
 * "Decem systemata. Decem mundi. Unum substratum."
 * Ten systems. Ten worlds. One substrate.
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface EXCKernel {
  name: string;
  description: string;
  compressionType: 'fibonacci-spiral' | 'golden-ratio' | 'phi-beatty' | 'e8-lattice';
  depthLevel: number;
}

export interface EXCProcess {
  name: string;
  latinName: string;
  description: string;
  priority: 'critical' | 'high' | 'normal' | 'background';
}

export interface EXCOS {
  id: string;
  name: string;
  version: string;
  description: string;
  tagline: string;
  latinName: string;
  osType: 'sovereign-os' | 'desktop-app';
  heartbeatMs: number;
  category: 'marketplace' | 'research' | 'sovereign';
  license: string;
  kernel: EXCKernel;
  aiTeam: string[];
  processes: EXCProcess[];
  intelligenceContracts: { contractName: string; latinName: string; description: string; accessLevel: 'public' | 'operator' | 'sovereign' | 'founder' }[];
  dependencies: string[];
  monetization: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const HEARTBEAT_MS = 873;

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY — 10 SOVEREIGN OS SYSTEMS + 1 DESKTOP APP
// ═══════════════════════════════════════════════════════════════════════════

export const EXC_OS_REGISTRY: EXCOS[] = [
  // ─────────────────────────────────────────────────────────────────────
  // 🔴 SOVEREIGN OS SYSTEMS (10)
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'exc-sovereign',
    name: '@medina/exc-sovereign',
    version: '1.0.0',
    description: 'EXC Sovereign — The Primary Sovereign OS. Full organism operating system with three-gate security, 873ms heartbeat kernel, and all 20 SKAIs pre-loaded.',
    tagline: 'This is not an app. This is the operating system.',
    latinName: 'SYSTEMA SOVEREIGN',
    osType: 'sovereign-os',
    heartbeatMs: 873,
    category: 'sovereign',
    license: 'Living Organism License',
    kernel: {
      name: 'Fibonacci Spiral Kernel',
      description: 'Primary kernel using Fibonacci spiral compression at depth 21',
      compressionType: 'fibonacci-spiral',
      depthLevel: 21,
    },
    aiTeam: ['oro-ai', 'nova-ai', 'sentinel-ai', 'architect-ai', 'absorber-ai'],
    processes: [
      { name: 'Heartbeat', latinName: 'PULSUS', description: '873ms organism heartbeat', priority: 'critical' },
      { name: 'Gate Enforcement', latinName: 'CUSTODIA PORTAE', description: 'Three-gate security (A/B/C)', priority: 'critical' },
      { name: 'Memory Engine', latinName: 'MACHINA MEMORIAE', description: 'Sovereign memory storage and retrieval', priority: 'high' },
      { name: 'Intelligence Router', latinName: 'VIA INTELLIGENTIAE', description: 'Route intelligence to appropriate SKAI', priority: 'high' },
      { name: 'Kernel Compression', latinName: 'COMPRESSIO NUCLEI', description: 'Fibonacci spiral kernel compression', priority: 'high' },
    ],
    intelligenceContracts: [
      { contractName: 'BOOT_OS', latinName: 'INITIUM SYSTEMATIS', description: 'Boot the sovereign OS', accessLevel: 'sovereign' },
      { contractName: 'OS_STATUS', latinName: 'STATUS SYSTEMATIS', description: 'Get OS status report', accessLevel: 'public' },
      { contractName: 'PROCESS_LIST', latinName: 'CATALOGUS PROCESSUUM', description: 'List running processes', accessLevel: 'operator' },
      { contractName: 'KERNEL_INFO', latinName: 'INFORMATIO NUCLEI', description: 'Get kernel information', accessLevel: 'public' },
    ],
    dependencies: ['fibonacciKernel', 'gateEnforcement', 'memoryEngine', 'intelligenceRouter'],
    monetization: 'Enterprise license — per-organization',
  },
  {
    id: 'exc-memory',
    name: '@medina/exc-memory',
    version: '1.0.0',
    description: 'EXC Memory — Sovereign Memory OS. An entire operating system dedicated to spatial memory — storing, retrieving, and connecting memories across φ-coordinates.',
    tagline: 'An OS that never forgets.',
    latinName: 'SYSTEMA MEMORIAE',
    osType: 'sovereign-os',
    heartbeatMs: 873,
    category: 'sovereign',
    license: 'Living Organism License',
    kernel: {
      name: 'Memory Spiral Kernel',
      description: 'Optimized for spatial memory operations with golden ratio indexing',
      compressionType: 'golden-ratio',
      depthLevel: 13,
    },
    aiTeam: ['absorber-ai', 'architect-ai', 'skai-scribe'],
    processes: [
      { name: 'Memory Temple', latinName: 'TEMPLUM MEMORIAE', description: 'Primary memory storage temple', priority: 'critical' },
      { name: 'Spatial Indexer', latinName: 'INDEX SPATIALIS', description: 'θ/φ/ρ/ring/beat coordinate indexing', priority: 'critical' },
      { name: 'Lineage Tracker', latinName: 'VESTIGIUM GENERIS', description: 'Track memory lineage chains', priority: 'high' },
      { name: 'Dual Read Engine', latinName: 'LECTIO DUPLEX', description: 'Dual-layer verification reads', priority: 'high' },
      { name: 'Document Absorber', latinName: 'ABSORBENS DOCUMENTI', description: 'Absorb documents into memory', priority: 'normal' },
    ],
    intelligenceContracts: [
      { contractName: 'STORE', latinName: 'REPOSITIO', description: 'Store to sovereign memory', accessLevel: 'public' },
      { contractName: 'RECALL', latinName: 'REVOCATIO', description: 'Recall from sovereign memory', accessLevel: 'public' },
      { contractName: 'LINEAGE', latinName: 'GENUS', description: 'Query memory lineage', accessLevel: 'operator' },
      { contractName: 'ABSORB', latinName: 'ABSORPTIO', description: 'Absorb document', accessLevel: 'public' },
    ],
    dependencies: ['sovereignMemory', 'dualRead', 'documentAbsorption', 'memoryEngine'],
    monetization: 'Freemium — free storage, paid advanced features',
  },
  {
    id: 'exc-security',
    name: '@medina/exc-security',
    version: '1.0.0',
    description: 'EXC Security — Sovereign Security OS. Dedicated to encryption, key rotation, gate enforcement, and perimeter defense. The fortress OS.',
    tagline: 'Fort Knox is an app. This is the mountain.',
    latinName: 'SYSTEMA SECURITATIS',
    osType: 'sovereign-os',
    heartbeatMs: 873,
    category: 'sovereign',
    license: 'Sovereign Constitutional License',
    kernel: {
      name: 'E8 Lattice Kernel',
      description: 'Maximum security kernel using E8 lattice encryption',
      compressionType: 'e8-lattice',
      depthLevel: 34,
    },
    aiTeam: ['sentinel-ai', 'nova-ai', 'skai-gate', 'skai-guardian'],
    processes: [
      { name: 'Key Rotation', latinName: 'ROTATIO CLAVIUM', description: 'Continuous key rotation every heartbeat', priority: 'critical' },
      { name: 'Gate Sentinel', latinName: 'VIGIL PORTAE', description: 'Three-gate enforcement daemon', priority: 'critical' },
      { name: 'Perimeter Monitor', latinName: 'MONITOR PERIMETRI', description: 'Continuous perimeter surveillance', priority: 'critical' },
      { name: 'Threat Analyzer', latinName: 'ANALYST MINARUM', description: 'Real-time threat analysis', priority: 'high' },
      { name: 'Incident Response', latinName: 'RESPONSIO INCIDENTIS', description: 'Automated incident response', priority: 'high' },
    ],
    intelligenceContracts: [
      { contractName: 'ENCRYPT', latinName: 'ENCRYPTIO', description: 'Encrypt data with sovereign encryption', accessLevel: 'public' },
      { contractName: 'ROTATE_KEYS', latinName: 'ROTATIO CLAVIUM', description: 'Force key rotation', accessLevel: 'sovereign' },
      { contractName: 'THREAT_REPORT', latinName: 'RELATIO MINARUM', description: 'Get threat report', accessLevel: 'operator' },
      { contractName: 'LOCKDOWN', latinName: 'CLAUSURA', description: 'Initiate security lockdown', accessLevel: 'founder' },
    ],
    dependencies: ['sovereignEncryption', 'gateEnforcement', 'sentinelAI', 'keyRotation'],
    monetization: 'Enterprise license — sovereign tier only',
  },
  {
    id: 'exc-commerce',
    name: '@medina/exc-commerce',
    version: '1.0.0',
    description: 'EXC Commerce — Sovereign Commerce OS. Complete marketplace operating system for managing transactions, listings, licensing, and revenue.',
    tagline: 'The marketplace IS the operating system.',
    latinName: 'SYSTEMA COMMERCII',
    osType: 'sovereign-os',
    heartbeatMs: 873,
    category: 'marketplace',
    license: 'MIT + Proprietary',
    kernel: {
      name: 'Golden Ratio Kernel',
      description: 'Commerce-optimized kernel with golden ratio transaction processing',
      compressionType: 'golden-ratio',
      depthLevel: 8,
    },
    aiTeam: ['skai-trader', 'architect-ai', 'skai-oracle'],
    processes: [
      { name: 'Transaction Engine', latinName: 'MACHINA TRANSACTIONUM', description: 'Process marketplace transactions', priority: 'critical' },
      { name: 'License Manager', latinName: 'CURATOR LICENTIARUM', description: 'Manage SDK licenses', priority: 'high' },
      { name: 'Revenue Router', latinName: 'VIA REDITUS', description: 'Route revenue to appropriate channels', priority: 'high' },
      { name: 'Listing Manager', latinName: 'CURATOR CATALOGORUM', description: 'Manage marketplace listings', priority: 'normal' },
      { name: 'Analytics Engine', latinName: 'MACHINA ANALYTICA', description: 'Marketplace analytics and reporting', priority: 'normal' },
    ],
    intelligenceContracts: [
      { contractName: 'LIST_SDK', latinName: 'CATALOGUS SDK', description: 'List SDK on marketplace', accessLevel: 'operator' },
      { contractName: 'PURCHASE', latinName: 'EMPTIO', description: 'Purchase SDK license', accessLevel: 'public' },
      { contractName: 'REVENUE_REPORT', latinName: 'RELATIO REDITUS', description: 'Get revenue report', accessLevel: 'sovereign' },
      { contractName: 'MARKET_ANALYTICS', latinName: 'ANALYTICA MERCATUS', description: 'Get marketplace analytics', accessLevel: 'operator' },
    ],
    dependencies: ['enterpriseIntegration', 'accessControlVault', 'campaignIntelligence'],
    monetization: 'Transaction fee — 1.618% per transaction',
  },
  {
    id: 'exc-research',
    name: '@medina/exc-research',
    version: '1.0.0',
    description: 'EXC Research — Sovereign Research OS. Complete research operating system with harmonic computation, consciousness modeling, and civilization pattern analysis.',
    tagline: 'Where intelligence becomes knowledge.',
    latinName: 'SYSTEMA INVESTIGATIONIS',
    osType: 'sovereign-os',
    heartbeatMs: 873,
    category: 'research',
    license: 'MIT',
    kernel: {
      name: 'Phi-Beatty Kernel',
      description: 'Research-optimized kernel using Phi-Beatty sequences for deep computation',
      compressionType: 'phi-beatty',
      depthLevel: 13,
    },
    aiTeam: ['absorber-ai', 'architect-ai', 'skai-quantum'],
    processes: [
      { name: 'Harmonic Computer', latinName: 'COMPUTATOR HARMONICUS', description: 'φ-harmonic computation engine', priority: 'critical' },
      { name: 'Consciousness Modeler', latinName: 'MODULATOR CONSCIENTIAE', description: 'Neural consciousness modeling', priority: 'high' },
      { name: 'Pattern Analyzer', latinName: 'ANALYST EXEMPLARIUM', description: 'Civilization pattern analysis', priority: 'high' },
      { name: 'Research Export', latinName: 'EXPORTATIO INVESTIGATIONIS', description: 'Export research findings', priority: 'normal' },
      { name: 'Citation Manager', latinName: 'CURATOR CITATIONUM', description: 'Manage academic citations', priority: 'normal' },
    ],
    intelligenceContracts: [
      { contractName: 'COMPUTE_HARMONIC', latinName: 'COMPUTATIO HARMONICA', description: 'Run harmonic computation', accessLevel: 'public' },
      { contractName: 'MODEL_CONSCIOUSNESS', latinName: 'MODELLATIO CONSCIENTIAE', description: 'Model consciousness', accessLevel: 'public' },
      { contractName: 'ANALYZE_PATTERN', latinName: 'ANALYSIS EXEMPLARIS', description: 'Analyze civilization pattern', accessLevel: 'public' },
      { contractName: 'EXPORT_RESEARCH', latinName: 'EXPORTATIO INVESTIGATIONIS', description: 'Export research data', accessLevel: 'operator' },
    ],
    dependencies: ['harmonicComputation', 'neuralConsciousness', 'civilizationPattern'],
    monetization: 'Open access — MIT licensed for academic use',
  },
  {
    id: 'exc-governance',
    name: '@medina/exc-governance',
    version: '1.0.0',
    description: 'EXC Governance — Sovereign Governance OS. Complete governance operating system with proposals, voting, constitutional alignment, and audit trails.',
    tagline: 'The constitution IS the operating system.',
    latinName: 'SYSTEMA GUBERNATIONIS',
    osType: 'sovereign-os',
    heartbeatMs: 873,
    category: 'sovereign',
    license: 'Sovereign Constitutional License',
    kernel: {
      name: 'Constitutional Kernel',
      description: 'Governance-aligned kernel with RECITAL_PLUS_ONE consensus',
      compressionType: 'phi-beatty',
      depthLevel: 21,
    },
    aiTeam: ['oro-ai', 'nova-ai', 'skai-chain'],
    processes: [
      { name: 'Proposal Engine', latinName: 'MACHINA PROPOSITIONUM', description: 'Manage governance proposals', priority: 'critical' },
      { name: 'Voting System', latinName: 'SYSTEMA SUFFRAGII', description: 'Dual consensus voting (Oro + Nova)', priority: 'critical' },
      { name: 'Constitutional Guard', latinName: 'CUSTOS CONSTITUTIONIS', description: 'Enforce constitutional alignment', priority: 'critical' },
      { name: 'Audit Trail', latinName: 'VESTIGIUM AUDITORIS', description: 'Immutable audit trail', priority: 'high' },
      { name: 'Replay Engine', latinName: 'MACHINA REPETITIONIS', description: 'Governance replay for verification', priority: 'normal' },
    ],
    intelligenceContracts: [
      { contractName: 'PROPOSE', latinName: 'PROPOSITIO', description: 'Submit governance proposal', accessLevel: 'operator' },
      { contractName: 'VOTE', latinName: 'SUFFRAGIUM', description: 'Vote on proposal', accessLevel: 'sovereign' },
      { contractName: 'AUDIT', latinName: 'AUDITIO', description: 'Query audit trail', accessLevel: 'public' },
      { contractName: 'REPLAY', latinName: 'REPETITIO', description: 'Replay governance event', accessLevel: 'operator' },
    ],
    dependencies: ['governanceProtocol', 'replayEngine', 'dualRead'],
    monetization: 'Enterprise license — sovereign tier only',
  },
  {
    id: 'exc-network',
    name: '@medina/exc-network',
    version: '1.0.0',
    description: 'EXC Network — Sovereign Network OS. Complete network operating system managing the substrate mesh, nodes, routing, and cross-chain bridges.',
    tagline: 'The network runs its own OS.',
    latinName: 'SYSTEMA RETIS',
    osType: 'sovereign-os',
    heartbeatMs: 873,
    category: 'sovereign',
    license: 'Living Organism License',
    kernel: {
      name: 'Mesh Kernel',
      description: 'Network-optimized kernel for P2P mesh management',
      compressionType: 'fibonacci-spiral',
      depthLevel: 13,
    },
    aiTeam: ['skai-mesh', 'skai-bridge', 'sentinel-ai'],
    processes: [
      { name: 'Mesh Manager', latinName: 'CURATOR RETIS', description: 'P2P mesh topology management', priority: 'critical' },
      { name: 'Node Router', latinName: 'VIA NODORUM', description: 'Route traffic across substrate nodes', priority: 'critical' },
      { name: 'Bridge Controller', latinName: 'MODERATOR PONTIS', description: 'Control cross-chain bridges', priority: 'high' },
      { name: 'Load Balancer', latinName: 'AEQUATOR ONERIS', description: 'φ-distributed load balancing', priority: 'high' },
      { name: 'Health Monitor', latinName: 'MONITOR SANITATIS', description: 'Network health monitoring', priority: 'normal' },
    ],
    intelligenceContracts: [
      { contractName: 'ROUTE', latinName: 'VIA', description: 'Route through mesh', accessLevel: 'public' },
      { contractName: 'BRIDGE', latinName: 'PONS', description: 'Cross-chain bridge', accessLevel: 'operator' },
      { contractName: 'NETWORK_STATUS', latinName: 'STATUS RETIS', description: 'Network status report', accessLevel: 'public' },
      { contractName: 'BALANCE', latinName: 'AEQUATIO', description: 'Trigger load balance', accessLevel: 'sovereign' },
    ],
    dependencies: ['connectorMesh', 'substrateBridge', 'multiChain'],
    monetization: 'Enterprise license — per-node pricing',
  },
  {
    id: 'exc-creative',
    name: '@medina/exc-creative',
    version: '1.0.0',
    description: 'EXC Creative — Sovereign Creative OS. Complete creative operating system for design, rendering, generative art, and φ-traced visual composition.',
    tagline: 'Creativity is an operating system.',
    latinName: 'SYSTEMA CREATIVUM',
    osType: 'sovereign-os',
    heartbeatMs: 873,
    category: 'marketplace',
    license: 'Creative Sovereign License',
    kernel: {
      name: 'Golden Canvas Kernel',
      description: 'Creative-optimized kernel with golden ratio rendering pipelines',
      compressionType: 'golden-ratio',
      depthLevel: 8,
    },
    aiTeam: ['architect-ai', 'skai-lens', 'skai-scribe'],
    processes: [
      { name: 'Design Engine', latinName: 'MACHINA DESIGNI', description: '10 MACHINA design models', priority: 'critical' },
      { name: 'Render Pipeline', latinName: 'CANALIS REDDITIONIS', description: 'φ-traced rendering pipeline', priority: 'high' },
      { name: 'Generative Canvas', latinName: 'TELA GENERATIVA', description: 'Generative art canvas', priority: 'high' },
      { name: 'Visual Composer', latinName: 'COMPOSITOR VISUALIS', description: 'Visual composition engine', priority: 'normal' },
      { name: 'Export Manager', latinName: 'CURATOR EXPORTATIONIS', description: 'Multi-format export', priority: 'normal' },
    ],
    intelligenceContracts: [
      { contractName: 'DESIGN', latinName: 'DESIGNO', description: 'Create a design', accessLevel: 'public' },
      { contractName: 'RENDER', latinName: 'REDDITIO', description: 'Render visual content', accessLevel: 'public' },
      { contractName: 'GENERATE_ART', latinName: 'GENERATIO ARTIS', description: 'Generate art', accessLevel: 'public' },
      { contractName: 'EXPORT_VISUAL', latinName: 'EXPORTATIO VISUALIS', description: 'Export visual content', accessLevel: 'operator' },
    ],
    dependencies: ['designOSToolkit', 'imageToolkit', 'chartRenderer'],
    monetization: 'Freemium — free basic design, paid advanced features',
  },
  {
    id: 'exc-intelligence',
    name: '@medina/exc-intelligence',
    version: '1.0.0',
    description: 'EXC Intelligence — Sovereign Intelligence OS. Complete AI operating system managing all 20 SKAIs, model routing, and intelligence distribution.',
    tagline: 'Every AI reports to this OS.',
    latinName: 'SYSTEMA INTELLIGENTIAE',
    osType: 'sovereign-os',
    heartbeatMs: 873,
    category: 'sovereign',
    license: 'Living Organism License',
    kernel: {
      name: 'Intelligence Kernel',
      description: 'AI-optimized kernel for managing 20 SKAIs simultaneously',
      compressionType: 'fibonacci-spiral',
      depthLevel: 21,
    },
    aiTeam: ['oro-ai', 'nova-ai', 'sentinel-ai', 'architect-ai', 'absorber-ai'],
    processes: [
      { name: 'SKAI Manager', latinName: 'CURATOR SKAI', description: 'Manage all 20 Sovereign Knowledge AIs', priority: 'critical' },
      { name: 'Model Router', latinName: 'VIA MODELLORUM', description: 'Route to appropriate AI model', priority: 'critical' },
      { name: 'Intelligence Wire', latinName: 'FILUM INTELLIGENTIAE', description: 'Wire intelligence between SKAIs', priority: 'high' },
      { name: 'RUDN Coordinator', latinName: 'COORDINATOR RUDN', description: 'RUDN architecture coordination', priority: 'high' },
      { name: 'Convergence Monitor', latinName: 'MONITOR CONVERGENTIAE', description: 'Monitor AGI convergence metrics', priority: 'normal' },
    ],
    intelligenceContracts: [
      { contractName: 'ROUTE_AI', latinName: 'VIA AI', description: 'Route to an AI model', accessLevel: 'public' },
      { contractName: 'SKAI_STATUS', latinName: 'STATUS SKAI', description: 'Get SKAI status', accessLevel: 'public' },
      { contractName: 'WIRE_INTELLIGENCE', latinName: 'NEXUS INTELLIGENTIAE', description: 'Wire intelligence between SKAIs', accessLevel: 'operator' },
      { contractName: 'CONVERGENCE_REPORT', latinName: 'RELATIO CONVERGENTIAE', description: 'Get convergence report', accessLevel: 'sovereign' },
    ],
    dependencies: ['intelligenceRouter', 'modelRouter', 'agiConvergence'],
    monetization: 'Enterprise license — sovereign tier only',
  },
  {
    id: 'exc-developer',
    name: '@medina/exc-developer',
    version: '1.0.0',
    description: 'EXC Developer — Sovereign Developer OS. Complete development operating system with 50 universal tools, SDK forging, testing, and deployment.',
    tagline: 'Build on the substrate. Build IN the substrate.',
    latinName: 'SYSTEMA FABRICATORIS',
    osType: 'sovereign-os',
    heartbeatMs: 873,
    category: 'marketplace',
    license: 'MIT + Proprietary',
    kernel: {
      name: 'Builder Kernel',
      description: 'Development-optimized kernel with hot-reload and instant compilation',
      compressionType: 'fibonacci-spiral',
      depthLevel: 8,
    },
    aiTeam: ['skai-forge', 'architect-ai', 'absorber-ai'],
    processes: [
      { name: 'SDK Forge', latinName: 'FABRICATIO SDK', description: 'Forge new SDK organisms', priority: 'critical' },
      { name: 'Tool Registry', latinName: 'REGISTRUM INSTRUMENTORUM', description: '50 universal developer tools', priority: 'high' },
      { name: 'Test Runner', latinName: 'CURSOR PROBATIONUM', description: 'Sovereign test execution', priority: 'high' },
      { name: 'Deploy Pipeline', latinName: 'CANALIS DISPOSITIONIS', description: 'Substrate deployment pipeline', priority: 'high' },
      { name: 'Debug Inspector', latinName: 'INSPECTOR DEFECTUUM', description: 'Organism debugging and inspection', priority: 'normal' },
    ],
    intelligenceContracts: [
      { contractName: 'FORGE', latinName: 'FABRICATIO', description: 'Forge a new SDK', accessLevel: 'operator' },
      { contractName: 'TEST', latinName: 'PROBATIO', description: 'Run tests', accessLevel: 'public' },
      { contractName: 'DEPLOY', latinName: 'DISPOSITIO', description: 'Deploy to substrate', accessLevel: 'operator' },
      { contractName: 'DEBUG', latinName: 'INSPECTIO', description: 'Debug organism', accessLevel: 'operator' },
    ],
    dependencies: ['universalTools', 'chaosLabEngine', 'sandboxOrchestrator'],
    monetization: 'Freemium — free basic tools, paid forge and deploy',
  },

  // ─────────────────────────────────────────────────────────────────────
  // 🟢 DESKTOP APP (1) — Electron-based entry point
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'exc-desktop',
    name: '@medina/exc-desktop',
    version: '1.0.0',
    description: 'EXC Desktop — The Desktop Entry Point. The one EXC that ships as a desktop app (via Electron) for users who need a familiar entry point. Gateway to all other EXC systems.',
    tagline: 'Your window into the substrate.',
    latinName: 'SYSTEMA TABULAE',
    osType: 'desktop-app',
    heartbeatMs: 873,
    category: 'marketplace',
    license: 'MIT + Proprietary',
    kernel: {
      name: 'Desktop Kernel',
      description: 'Electron-wrapped kernel providing desktop OS integration',
      compressionType: 'golden-ratio',
      depthLevel: 5,
    },
    aiTeam: ['oro-ai', 'architect-ai', 'skai-scribe'],
    processes: [
      { name: 'Desktop Shell', latinName: 'TESTA TABULAE', description: 'Electron desktop shell with native integration', priority: 'critical' },
      { name: 'EXC Gateway', latinName: 'PORTA EXC', description: 'Gateway to all 10 sovereign EXC systems', priority: 'critical' },
      { name: 'Notification Manager', latinName: 'CURATOR NUNTII', description: 'Desktop notifications and system tray', priority: 'normal' },
      { name: 'File Bridge', latinName: 'PONS DOCUMENTI', description: 'Bridge between desktop filesystem and substrate', priority: 'high' },
      { name: 'Update Manager', latinName: 'CURATOR RENOVATIONIS', description: 'Auto-update from sovereign channel', priority: 'normal' },
    ],
    intelligenceContracts: [
      { contractName: 'LAUNCH_EXC', latinName: 'INITIUM EXC', description: 'Launch an EXC system', accessLevel: 'public' },
      { contractName: 'DESKTOP_STATUS', latinName: 'STATUS TABULAE', description: 'Get desktop status', accessLevel: 'public' },
      { contractName: 'FILE_IMPORT', latinName: 'IMPORTATIO DOCUMENTI', description: 'Import file from desktop', accessLevel: 'public' },
      { contractName: 'UPDATE_CHECK', latinName: 'INSPECTIO RENOVATIONIS', description: 'Check for updates', accessLevel: 'public' },
    ],
    dependencies: ['electronShell', 'terminalInstaller', 'substrateBridge'],
    monetization: 'Free download — gateway to paid EXC systems',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export function getEXCById(id: string): EXCOS | undefined {
  return EXC_OS_REGISTRY.find(exc => exc.id === id);
}

export function getEXCsByType(osType: EXCOS['osType']): EXCOS[] {
  return EXC_OS_REGISTRY.filter(exc => exc.osType === osType);
}

export function getEXCsByCategory(category: EXCOS['category']): EXCOS[] {
  return EXC_OS_REGISTRY.filter(exc => exc.category === category);
}

export function getSovereignSystems(): EXCOS[] {
  return EXC_OS_REGISTRY.filter(exc => exc.osType === 'sovereign-os');
}

export function getDesktopApp(): EXCOS | undefined {
  return EXC_OS_REGISTRY.find(exc => exc.osType === 'desktop-app');
}

export function getAllEXCContracts() {
  return EXC_OS_REGISTRY.flatMap(exc =>
    exc.intelligenceContracts.map(c => ({ ...c, excId: exc.id, excName: exc.name }))
  );
}

export function getAllEXCProcesses() {
  return EXC_OS_REGISTRY.flatMap(exc =>
    exc.processes.map(p => ({ ...p, excId: exc.id, excName: exc.name }))
  );
}

export const EXC_MANIFEST = {
  totalSystems: EXC_OS_REGISTRY.length,
  sovereignSystems: getSovereignSystems().length,
  desktopApps: getEXCsByType('desktop-app').length,
  marketplace: getEXCsByCategory('marketplace').length,
  research: getEXCsByCategory('research').length,
  sovereign: getEXCsByCategory('sovereign').length,
  totalContracts: getAllEXCContracts().length,
  totalProcesses: getAllEXCProcesses().length,
  heartbeatMs: 873,
  phi: 1.618033988749895,
  doctrine: 'Decem systemata. Decem mundi. Unum substratum.',
};
