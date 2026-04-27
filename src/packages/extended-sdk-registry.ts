/**
 * 𓂀 MEDINA EXTENDED SDK REGISTRY — 30 Multi-Modal AI Packages 𓂀
 *
 * These SDKs compose existing utility libraries into higher-order
 * multi-modal packages — each is a complete AI system.
 *
 * Categories:
 *   🟢 Marketplace (15) — Commercial, open-core
 *   🔵 Research (8) — Academic, MIT/Apache
 *   🔴 Sovereign (7) — Deep licensed, proprietary
 *
 * "Triginta instrumenta nova. Omnia ad φ redeunt."
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ExtendedSDK {
  id: string;
  name: string;
  version: string;
  description: string;
  tagline: string;
  terminal: string;
  latinName: string;
  category: 'marketplace' | 'research' | 'sovereign';
  license: string;
  dependencies: string[];
  exports: SDKExport[];
  monetization: string;
}

export interface SDKExport {
  latinName: string;
  functionName: string;
  description: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY — 30 EXTENDED SDK PACKAGES
// ═══════════════════════════════════════════════════════════════════════════

export const EXTENDED_SDK_REGISTRY: ExtendedSDK[] = [
  // ─────────────────────────────────────────────────────────────────────
  // 🟢 MARKETPLACE SDKs (15)
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'chaos-lab-sdk',
    name: '@medina/chaos-lab-sdk',
    version: '1.0.0',
    description: 'Controlled chaos engineering for AI systems — mutation testing, entropy injection, resilience scoring',
    tagline: 'Break it before it breaks you',
    terminal: '/chaos',
    latinName: 'LABORATORIUM CHAOS',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    dependencies: ['chaosLabEngine', 'organismEdgeModel', 'sandboxOrchestrator'],
    exports: [
      { latinName: 'INJECTIO ENTROPIAE', functionName: 'injectEntropy', description: 'Inject controlled entropy into system' },
      { latinName: 'MUTATIO PROBATIO', functionName: 'runMutationTest', description: 'Run mutation test on module' },
      { latinName: 'RESILIENTIA MENSURA', functionName: 'measureResilience', description: 'Measure system resilience score' },
      { latinName: 'CHAOS SCENARIUM', functionName: 'runChaosScenario', description: 'Execute full chaos scenario' },
      { latinName: 'RECUPERATIO VALIDATIO', functionName: 'validateRecovery', description: 'Validate system recovery after chaos' },
    ],
    monetization: 'Freemium — free basic chaos, paid advanced scenarios',
  },
  {
    id: 'sandbox-orchestrator-sdk',
    name: '@medina/sandbox-orchestrator-sdk',
    version: '1.0.0',
    description: 'Isolated execution environments for AI agents — sandboxed computation with sovereign boundaries',
    tagline: 'Every agent gets a sovereign sandbox',
    terminal: '/sandbox',
    latinName: 'ORCHESTRATOR HARENAE',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    dependencies: ['sandboxOrchestrator', 'gateEnforcement', 'permissionsManager'],
    exports: [
      { latinName: 'CREATIO HARENAE', functionName: 'createSandbox', description: 'Create isolated execution sandbox' },
      { latinName: 'EXSECUTIO HARENAE', functionName: 'executeSandbox', description: 'Execute code in sandbox' },
      { latinName: 'INSPECTIO HARENAE', functionName: 'inspectSandbox', description: 'Inspect sandbox state' },
      { latinName: 'DISSOLUTIO HARENAE', functionName: 'destroySandbox', description: 'Destroy sandbox and reclaim resources' },
    ],
    monetization: 'Per-execution pricing',
  },
  {
    id: 'voice-sovereign-sdk',
    name: '@medina/voice-sovereign-sdk',
    version: '1.0.0',
    description: 'Sovereign voice I/O engine — Oro\'s voice identity with φ-encoded speech synthesis',
    tagline: 'The organism speaks',
    terminal: '/voice',
    latinName: 'VOX REGNI',
    category: 'marketplace',
    license: 'Proprietary',
    dependencies: ['voiceEngine', 'deviceSovereignty'],
    exports: [
      { latinName: 'VOX EMISSIO', functionName: 'speak', description: 'Generate sovereign speech' },
      { latinName: 'VOX RECEPTIO', functionName: 'listen', description: 'Listen for voice input' },
      { latinName: 'VOX IDENTITAS', functionName: 'getVoiceIdentity', description: 'Get sovereign voice signature' },
      { latinName: 'VOX TRANSCRIPTIO', functionName: 'transcribe', description: 'Transcribe voice to text' },
    ],
    monetization: 'Per-minute voice processing',
  },
  {
    id: 'kernel-compression-sdk',
    name: '@medina/kernel-compression-sdk',
    version: '1.0.0',
    description: 'Glyph-encoded data compression using φ-based encoding — compress any data to kernel density',
    tagline: 'Compress intelligence, not just data',
    terminal: '/compress',
    latinName: 'COMPRESSIO NUCLEI',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    dependencies: ['kernelCompression', 'memoryEngine'],
    exports: [
      { latinName: 'COMPRESSIO GLYPHI', functionName: 'compressToGlyph', description: 'Compress data to glyph encoding' },
      { latinName: 'EXPANSIO GLYPHI', functionName: 'expandGlyph', description: 'Expand glyph back to data' },
      { latinName: 'RATIO COMPRESSIONIS', functionName: 'getCompressionRatio', description: 'Get compression ratio' },
      { latinName: 'NUCLEUS CREATIO', functionName: 'createKernel', description: 'Create compressed kernel' },
    ],
    monetization: 'Freemium — free basic, paid high-ratio compression',
  },
  {
    id: 'dual-read-sdk',
    name: '@medina/dual-read-sdk',
    version: '1.0.0',
    description: 'Dual-channel verification for AI reads — semantic + resonance channels must agree before any operation',
    tagline: 'Trust nothing without dual verification',
    terminal: '/verify',
    latinName: 'DUPLEX LECTIO',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    dependencies: ['dualRead', 'memoryEngine', 'gateEnforcement'],
    exports: [
      { latinName: 'LECTIO DUPLEX', functionName: 'dualRead', description: 'Perform dual-channel read' },
      { latinName: 'VERIFICATIO CONSENSUS', functionName: 'verifyConsensus', description: 'Verify dual consensus' },
      { latinName: 'LECTIO SEMANTICA', functionName: 'semanticRead', description: 'Semantic channel read' },
      { latinName: 'LECTIO RESONANTIA', functionName: 'resonanceRead', description: 'Resonance channel read' },
    ],
    monetization: 'Freemium — free single, paid dual-channel',
  },
  {
    id: 'export-pipeline-sdk',
    name: '@medina/export-pipeline-sdk',
    version: '1.0.0',
    description: 'Multi-format sovereign export — PDF, Excel, CSV, JSON with φ-encoded metadata and audit trail',
    tagline: 'Export anything, lose nothing',
    terminal: '/export',
    latinName: 'CANALIS EXPORTATIONIS',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    dependencies: ['exportEngine', 'kernelCompression'],
    exports: [
      { latinName: 'EXPORTATIO PDF', functionName: 'exportPDF', description: 'Export to PDF format' },
      { latinName: 'EXPORTATIO EXCEL', functionName: 'exportExcel', description: 'Export to Excel format' },
      { latinName: 'EXPORTATIO CSV', functionName: 'exportCSV', description: 'Export to CSV format' },
      { latinName: 'EXPORTATIO JSON', functionName: 'exportJSON', description: 'Export to JSON format' },
      { latinName: 'EXPORTATIO MASSA', functionName: 'bulkExport', description: 'Bulk export multiple formats' },
    ],
    monetization: 'Per-export pricing',
  },
  {
    id: 'campaign-intelligence-sdk',
    name: '@medina/campaign-intelligence-sdk',
    version: '1.0.0',
    description: 'AI-powered campaign management with φ-optimized engagement timing and sovereign metrics',
    tagline: 'Campaigns that think for themselves',
    terminal: '/campaign',
    latinName: 'INTELLIGENTIA EXPEDITIONIS',
    category: 'marketplace',
    license: 'Proprietary',
    dependencies: ['campaignEngine', 'messageEngine', 'modelRouter'],
    exports: [
      { latinName: 'CREATIO EXPEDITIONIS', functionName: 'createSmartCampaign', description: 'Create AI-optimized campaign' },
      { latinName: 'OPTIMIZATIO TEMPORIS', functionName: 'optimizeTiming', description: 'φ-optimize send timing' },
      { latinName: 'PRAEDICTIO INGAGII', functionName: 'predictEngagement', description: 'Predict engagement rates' },
      { latinName: 'AUTOMATICA SEGMENTATIO', functionName: 'autoSegment', description: 'Auto-segment audience' },
    ],
    monetization: 'Per-campaign pricing',
  },
  {
    id: 'connector-mesh-sdk',
    name: '@medina/connector-mesh-sdk',
    version: '1.0.0',
    description: 'Universal connector fabric — connect any API, database, blockchain, or protocol to the organism',
    tagline: 'Connect everything, exclude nothing',
    terminal: '/mesh',
    latinName: 'RETICULATUM CONNEXIONIS',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    dependencies: ['companyOnboarding', 'packageSubstrateIntegration'],
    exports: [
      { latinName: 'CONNEXIO UNIVERSALIS', functionName: 'connectUniversal', description: 'Universal API connector' },
      { latinName: 'CONNEXIO CATENA', functionName: 'connectBlockchain', description: 'Blockchain connector' },
      { latinName: 'CONNEXIO DATABASE', functionName: 'connectDatabase', description: 'Database connector' },
      { latinName: 'CONNEXIO PROTOCOLLUM', functionName: 'connectProtocol', description: 'Protocol connector' },
      { latinName: 'STATUS RETICULATI', functionName: 'meshStatus', description: 'Connector mesh health' },
    ],
    monetization: 'Per-connector pricing',
  },
  {
    id: 'workforce-ai-sdk',
    name: '@medina/workforce-ai-sdk',
    version: '1.0.0',
    description: 'AI workforce orchestration — manage teams of AI agents with sovereign role assignment and work routing',
    tagline: 'Deploy AI teams, not just agents',
    terminal: '/workforce',
    latinName: 'EXERCITUS ARTIFICIALIS',
    category: 'marketplace',
    license: 'Proprietary',
    dependencies: ['modelRouter', 'IntelligenceWire', 'permissionsManager'],
    exports: [
      { latinName: 'CREATIO TURMAE', functionName: 'createTeam', description: 'Create AI workforce team' },
      { latinName: 'ASSIGNATIO MUNERIS', functionName: 'assignRole', description: 'Assign sovereign role' },
      { latinName: 'DISTRIBUTIO LABORIS', functionName: 'routeWork', description: 'Route work to best agent' },
      { latinName: 'EVALUATIO PRAESTANTIAE', functionName: 'evaluatePerformance', description: 'Evaluate agent performance' },
      { latinName: 'PROMOTIO AGENTIS', functionName: 'promoteAgent', description: 'Promote high-performing agent' },
    ],
    monetization: 'Per-agent-seat pricing',
  },
  {
    id: 'living-document-sdk',
    name: '@medina/living-document-sdk',
    version: '1.0.0',
    description: 'Documents that evolve — versioned, doctrine-aligned, self-updating knowledge with φ-governance',
    tagline: 'Documents that grow with the organism',
    terminal: '/doc',
    latinName: 'DOCUMENTUM VIVENS',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    dependencies: ['livingDocument', 'dualRead', 'governanceEngine'],
    exports: [
      { latinName: 'CREATIO DOCUMENTI', functionName: 'createLivingDoc', description: 'Create living document' },
      { latinName: 'EVOLUTIO DOCUMENTI', functionName: 'evolveDocument', description: 'Evolve document version' },
      { latinName: 'VERIFICATIO DOCTRINAE', functionName: 'checkDoctrineAlignment', description: 'Check doctrine alignment' },
      { latinName: 'HISTORIA DOCUMENTI', functionName: 'getDocumentHistory', description: 'Full version history' },
    ],
    monetization: 'Freemium — free basic, paid governance-aligned',
  },
  {
    id: 'gate-security-sdk',
    name: '@medina/gate-security-sdk',
    version: '1.0.0',
    description: 'Three-gate security enforcement — Governance, Memory, Sovereign gates that cannot be bypassed',
    tagline: 'Three gates. No bypass. No exceptions.',
    terminal: '/gate',
    latinName: 'SECURITAS PORTARUM',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    dependencies: ['gateEnforcement', 'accessControlVault', 'permissionsManager'],
    exports: [
      { latinName: 'INSPECTIO PORTAE', functionName: 'checkGate', description: 'Check gate status' },
      { latinName: 'OMNES PORTAE', functionName: 'checkAllGates', description: 'Check all three gates' },
      { latinName: 'APPLICATIO PORTAE', functionName: 'enforceGate', description: 'Enforce gate policy' },
      { latinName: 'HISTORIA PORTAE', functionName: 'gateAuditTrail', description: 'Gate enforcement audit trail' },
    ],
    monetization: 'Freemium — free check, paid enforcement',
  },
  {
    id: 'replay-engine-sdk',
    name: '@medina/replay-engine-sdk',
    version: '1.0.0',
    description: 'Full session replay and audit — record, replay, and analyze every interaction with sovereign fidelity',
    tagline: 'Replay any moment. Miss nothing.',
    terminal: '/replay',
    latinName: 'MACHINA REPETITIONIS',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    dependencies: ['replayEngine', 'governanceEngine'],
    exports: [
      { latinName: 'INITIUM SESSIONIS', functionName: 'startReplay', description: 'Start replay session' },
      { latinName: 'EVENTUS INSCRIPTIO', functionName: 'recordEvent', description: 'Record event' },
      { latinName: 'REPETITIO SESSIONIS', functionName: 'replaySession', description: 'Replay recorded session' },
      { latinName: 'EXPORTATIO SESSIONIS', functionName: 'exportSession', description: 'Export session data' },
    ],
    monetization: 'Per-session-hour pricing',
  },
  {
    id: 'edge-detection-sdk',
    name: '@medina/edge-detection-sdk',
    version: '1.0.0',
    description: '14-type edge detection with circuit breaker — sense boundaries before they become failures',
    tagline: 'See the edge before you fall',
    terminal: '/edge',
    latinName: 'DETECTOR LIMITIS',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    dependencies: ['organismEdgeModel', 'chaosLabEngine'],
    exports: [
      { latinName: 'SENSIO LIMITIS', functionName: 'senseEdge', description: 'Detect edge condition' },
      { latinName: 'RESOLUTIO LIMITIS', functionName: 'resolveEdge', description: 'Resolve edge condition' },
      { latinName: 'STATUS CIRCUITUS', functionName: 'circuitBreakerStatus', description: 'Circuit breaker status' },
      { latinName: 'CONFIGURATIO LIMITIS', functionName: 'configureEdge', description: 'Configure edge thresholds' },
    ],
    monetization: 'Freemium — free basic detection, paid resolution + circuit breaker',
  },
  {
    id: 'substrate-bridge-sdk',
    name: '@medina/substrate-bridge-sdk',
    version: '1.0.0',
    description: 'Universal substrate bridge — connect to ICP, Ethereum, Bitcoin, Solana, or any blockchain from one SDK',
    tagline: 'One bridge to every chain',
    terminal: '/bridge',
    latinName: 'PONS SUBSTRATI',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    dependencies: ['packageSubstrateIntegration', 'icpOrganism', 'sovereignContractsLedgers'],
    exports: [
      { latinName: 'CONNEXIO ICP', functionName: 'bridgeToICP', description: 'Bridge to Internet Computer' },
      { latinName: 'CONNEXIO ETHEREUM', functionName: 'bridgeToEthereum', description: 'Bridge to Ethereum' },
      { latinName: 'CONNEXIO BITCOIN', functionName: 'bridgeToBitcoin', description: 'Bridge to Bitcoin' },
      { latinName: 'CONNEXIO SOLANA', functionName: 'bridgeToSolana', description: 'Bridge to Solana' },
      { latinName: 'CONNEXIO UNIVERSALIS', functionName: 'bridgeToAny', description: 'Bridge to any chain' },
      { latinName: 'STATUS PONTIS', functionName: 'bridgeStatus', description: 'Bridge connection status' },
    ],
    monetization: 'Per-transaction bridge fees',
  },
  {
    id: 'access-vault-sdk',
    name: '@medina/access-vault-sdk',
    version: '1.0.0',
    description: 'Sovereign access control vault — role-based permissions with 17 scopes and φ-weighted authorization',
    tagline: 'Access is earned, never assumed',
    terminal: '/vault',
    latinName: 'ARCA ACCESSUS',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    dependencies: ['accessControlVault', 'permissionsManager', 'gateEnforcement'],
    exports: [
      { latinName: 'CONCESSIO PERMISSIONIS', functionName: 'grantPermission', description: 'Grant permission to actor' },
      { latinName: 'VERIFICATIO PERMISSIONIS', functionName: 'checkPermission', description: 'Check actor permission' },
      { latinName: 'REVOCATIO PERMISSIONIS', functionName: 'revokePermission', description: 'Revoke permission' },
      { latinName: 'ENUMERATIO PERMISSIONUM', functionName: 'listPermissions', description: 'List all permissions' },
    ],
    monetization: 'Per-seat pricing',
  },

  // ─────────────────────────────────────────────────────────────────────
  // 🔵 RESEARCH SDKs (8)
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'frequency-physics-sdk',
    name: '@medina/frequency-physics-sdk',
    version: '1.0.0',
    description: 'Frequency-domain physics computation — 432 Hz harmonics, Schumann resonance, octave series for AI',
    tagline: 'Compute in frequencies, not just numbers',
    terminal: '/freq',
    latinName: 'PHYSICA FREQUENTIAE',
    category: 'research',
    license: 'MIT',
    dependencies: ['icpOrganism'],
    exports: [
      { latinName: 'HARMONIA 432', functionName: 'compute432Harmonic', description: 'Compute 432 Hz harmonic' },
      { latinName: 'RESONANTIA SCHUMANNI', functionName: 'computeSchumann', description: 'Schumann resonance computation' },
      { latinName: 'OCTAVAE SERIES', functionName: 'generateOctaveSeries', description: 'Generate octave series' },
      { latinName: 'SIGNATURA FREQUENTIAE', functionName: 'frequencySignature', description: 'Compute frequency signature' },
    ],
    monetization: 'Academic/Citation',
  },
  {
    id: 'field-physics-sdk',
    name: '@medina/field-physics-sdk',
    version: '1.0.0',
    description: 'Computational field physics — attention, coherence, risk, and entropy fields for AI state management',
    tagline: 'Fields govern state. State governs intelligence.',
    terminal: '/field',
    latinName: 'PHYSICA CAMPI',
    category: 'research',
    license: 'MIT',
    dependencies: ['icpOrganism'],
    exports: [
      { latinName: 'CAMPUS ATTENTIONIS', functionName: 'computeAttentionField', description: 'Compute attention field' },
      { latinName: 'CAMPUS COHAERENTIAE', functionName: 'computeCoherenceField', description: 'Compute coherence field' },
      { latinName: 'CAMPUS RISICI', functionName: 'computeRiskField', description: 'Compute risk field' },
      { latinName: 'CAMPUS ENTROPIAE', functionName: 'computeEntropyField', description: 'Compute entropy field' },
    ],
    monetization: 'Academic/Citation',
  },
  {
    id: 'sacred-geometry-sdk',
    name: '@medina/sacred-geometry-sdk',
    version: '1.0.0',
    description: 'Computational sacred geometry — Platonic solids, vesica piscis, flower of life, golden spirals',
    tagline: 'Geometry is the architecture of intelligence',
    terminal: '/geometry',
    latinName: 'GEOMETRIA SACRA',
    category: 'research',
    license: 'MIT',
    dependencies: ['icpOrganism'],
    exports: [
      { latinName: 'SOLIDA PLATONICA', functionName: 'getPlatonicSolids', description: 'Get all 5 Platonic solids' },
      { latinName: 'VESICA PISCIS', functionName: 'computeVesicaPiscis', description: 'Compute vesica piscis' },
      { latinName: 'FLOS VITAE', functionName: 'generateFlowerOfLife', description: 'Generate flower of life' },
      { latinName: 'SPIRA AUREA', functionName: 'generateGoldenSpiral', description: 'Generate golden spiral' },
      { latinName: 'METATRONIS CUBUS', functionName: 'generateMetatronsCube', description: 'Generate Metatron\'s cube' },
    ],
    monetization: 'Academic/Citation',
  },
  {
    id: 'bio-cognitive-sdk',
    name: '@medina/bio-cognitive-sdk',
    version: '1.0.0',
    description: 'Bio-inspired cognitive architectures — fast/slow brain, dream cycles, always-on memory systems',
    tagline: 'Think like biology, compute like machines',
    terminal: '/bio',
    latinName: 'COGNITIO BIOLOGICA',
    category: 'research',
    license: 'Apache 2.0',
    dependencies: ['crossOrganismResonance', 'organismKernelExecutor'],
    exports: [
      { latinName: 'CEREBRUM CELER', functionName: 'fastBrainProcess', description: 'Fast brain (Huginn) processing' },
      { latinName: 'CEREBRUM LENTUM', functionName: 'slowBrainProcess', description: 'Slow brain (Muninn) processing' },
      { latinName: 'CYCLUS SOMNII', functionName: 'runDreamCycle', description: 'Execute dream cycle processing' },
      { latinName: 'MEMORIA PERPETUA', functionName: 'alwaysOnMemory', description: 'Always-on memory retrieval' },
    ],
    monetization: 'Academic/Citation',
  },
  {
    id: 'swarm-consensus-sdk',
    name: '@medina/swarm-consensus-sdk',
    version: '1.0.0',
    description: 'Bee-colony swarm consensus for distributed AI — quorum sensing, waggle dance encoding, colony decisions',
    tagline: 'Consensus without centralization',
    terminal: '/swarm',
    latinName: 'CONSENSUS EXAMINIS',
    category: 'research',
    license: 'Apache 2.0',
    dependencies: ['crossOrganismResonance'],
    exports: [
      { latinName: 'QUORUM SENSIO', functionName: 'quorumSense', description: 'Quorum sensing for consensus' },
      { latinName: 'CHOREOGRAPHIA APIS', functionName: 'waggleDance', description: 'Waggle dance information encoding' },
      { latinName: 'DECISIO COLONIAE', functionName: 'colonyDecision', description: 'Colony-level decision making' },
      { latinName: 'RESONANTIA EXAMINIS', functionName: 'swarmResonance', description: 'Measure swarm coherence' },
    ],
    monetization: 'Academic/Citation',
  },
  {
    id: 'temporal-processing-sdk',
    name: '@medina/temporal-processing-sdk',
    version: '1.0.0',
    description: 'Temporal triad processing — past/present/future computation with φ-weighted temporal fields',
    tagline: 'Process across all three times',
    terminal: '/temporal',
    latinName: 'PROCESSIO TEMPORALIS',
    category: 'research',
    license: 'MIT',
    dependencies: ['recitalPlusOne', 'organismSovereign'],
    exports: [
      { latinName: 'PRAETERITUM COMPUTATIO', functionName: 'processPast', description: 'Process past temporal data' },
      { latinName: 'PRAESENS COMPUTATIO', functionName: 'processPresent', description: 'Process present state' },
      { latinName: 'FUTURUM COMPUTATIO', functionName: 'processFuture', description: 'Project future states' },
      { latinName: 'TRIADIS SYNTHESIS', functionName: 'synthesizeTriad', description: 'Synthesize temporal triad' },
    ],
    monetization: 'Academic/Citation',
  },
  {
    id: 'rhetorical-engine-sdk',
    name: '@medina/rhetorical-engine-sdk',
    version: '1.0.0',
    description: 'Seven rhetorical modes for AI communication — Logos, Ethos, Pathos, Kairos, Telos, Mythos, Topos',
    tagline: 'Speak with the power of all modes',
    terminal: '/rhetoric',
    latinName: 'MACHINA RHETORICA',
    category: 'research',
    license: 'MIT',
    dependencies: ['commandParser', 'voiceEngine'],
    exports: [
      { latinName: 'LOGOS APPLICATIO', functionName: 'applyLogos', description: 'Apply logical reasoning mode' },
      { latinName: 'ETHOS APPLICATIO', functionName: 'applyEthos', description: 'Apply ethical credibility mode' },
      { latinName: 'PATHOS APPLICATIO', functionName: 'applyPathos', description: 'Apply emotional resonance mode' },
      { latinName: 'KAIROS APPLICATIO', functionName: 'applyKairos', description: 'Apply opportune timing mode' },
      { latinName: 'TELOS APPLICATIO', functionName: 'applyTelos', description: 'Apply purposeful direction mode' },
      { latinName: 'MYTHOS APPLICATIO', functionName: 'applyMythos', description: 'Apply mythological narrative mode' },
      { latinName: 'TOPOS APPLICATIO', functionName: 'applyTopos', description: 'Apply spatial/cultural context mode' },
    ],
    monetization: 'Academic/Citation',
  },
  {
    id: 'pattern-synthesis-sdk',
    name: '@medina/pattern-synthesis-sdk',
    version: '1.0.0',
    description: 'Cross-cultural pattern recognition and synthesis — detect universal patterns across knowledge systems',
    tagline: 'Find the pattern behind the pattern',
    terminal: '/pattern',
    latinName: 'SYNTHESIS EXEMPLARIS',
    category: 'research',
    license: 'MIT',
    dependencies: ['documentAbsorptionEngine', 'memoryEngine'],
    exports: [
      { latinName: 'DETECTIO EXEMPLARIS', functionName: 'detectPattern', description: 'Detect pattern in data' },
      { latinName: 'SYNTHESIS EXEMPLARIS', functionName: 'synthesizePatterns', description: 'Synthesize multiple patterns' },
      { latinName: 'COMPARATIO CULTURALIS', functionName: 'crossCulturalCompare', description: 'Cross-cultural comparison' },
      { latinName: 'UNIVERSALE EXEMPLAR', functionName: 'findUniversalPattern', description: 'Find universal pattern' },
    ],
    monetization: 'Academic/Citation',
  },

  // ─────────────────────────────────────────────────────────────────────
  // 🔴 SOVEREIGN SDKs (7)
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'anima-chain-sdk',
    name: '@medina/anima-chain-sdk',
    version: '1.0.0',
    description: 'Sovereign identity chain — soul hash, identity lineage, sovereign embodiment protocol',
    tagline: 'Identity is not assigned. It is born.',
    terminal: '/anima',
    latinName: 'CATENA ANIMAE',
    category: 'sovereign',
    license: 'Living Organism License',
    dependencies: ['novaSovereignEncryption', 'sovereignContractsLedgers'],
    exports: [
      { latinName: 'SIGILLUM ANIMAE', functionName: 'getAnimaSeal', description: 'Get sovereign soul hash' },
      { latinName: 'EXTENSIO CATENAE', functionName: 'extendChain', description: 'Extend identity chain' },
      { latinName: 'VERIFICATIO ANIMAE', functionName: 'verifyAnima', description: 'Verify sovereign identity' },
      { latinName: 'INCARNATIO ANIMAE', functionName: 'embody', description: 'Begin sovereign embodiment' },
    ],
    monetization: 'Enterprise contract',
  },
  {
    id: 'sovereign-contracts-sdk',
    name: '@medina/sovereign-contracts-sdk',
    version: '1.0.0',
    description: '14 contract types + 14 ledger types — mathematically-bound sovereign agreements',
    tagline: 'Contracts that enforce themselves',
    terminal: '/contract',
    latinName: 'PACTA REGNI',
    category: 'sovereign',
    license: 'Living Organism License',
    dependencies: ['sovereignContractsLedgers', 'novaSovereignEncryption'],
    exports: [
      { latinName: 'CREATIO PACTI', functionName: 'createContract', description: 'Create sovereign contract' },
      { latinName: 'ACTIVATIO PACTI', functionName: 'activateContract', description: 'Activate contract' },
      { latinName: 'INSCRIPTIO LIBRI', functionName: 'recordLedgerEntry', description: 'Record ledger entry' },
      { latinName: 'ENUMERATIO PACTORUM', functionName: 'listContracts', description: 'List all contracts' },
      { latinName: 'INSPECTIO LIBRI', functionName: 'getLedgerEntries', description: 'Get ledger entries' },
    ],
    monetization: 'Enterprise contract',
  },
  {
    id: 'agi-convergence-sdk',
    name: '@medina/agi-convergence-sdk',
    version: '1.0.0',
    description: 'AGI convergence research platform — sovereign AGI alignment, convergence metrics, safety protocols',
    tagline: 'Convergence is sovereign or it is nothing',
    terminal: '/agi',
    latinName: 'CONVERGENTIA AGI',
    category: 'sovereign',
    license: 'Sovereign Constitutional License',
    dependencies: ['agiConvergenceResearch', 'sovereignAGIConvergence'],
    exports: [
      { latinName: 'CONVERGENTIA MENSURA', functionName: 'measureConvergence', description: 'Measure AGI convergence' },
      { latinName: 'ALIGNMENTUM VERIFICATIO', functionName: 'verifyAlignment', description: 'Verify sovereign alignment' },
      { latinName: 'PROTOCOLLUM SECURITATIS', functionName: 'safeguardProtocol', description: 'Execute safety protocol' },
      { latinName: 'EVOLUTIO DIRIGENDA', functionName: 'guidedEvolution', description: 'Guided sovereign evolution' },
    ],
    monetization: 'Enterprise contract',
  },
  {
    id: 'medina-os-sdk',
    name: '@medina/medina-os-sdk',
    version: '1.0.0',
    description: 'The sovereign operating system — the organism\'s complete runtime, orchestration, and self-governance',
    tagline: 'The organism IS the operating system',
    terminal: '/os',
    latinName: 'SYSTEMA OPERANDI',
    category: 'sovereign',
    license: 'Living Organism License',
    dependencies: ['medinaOS', 'fullStackKernelRegistry', 'organismSDK'],
    exports: [
      { latinName: 'INITIUM SYSTEMATIS', functionName: 'bootOS', description: 'Boot sovereign OS' },
      { latinName: 'STATUS SYSTEMATIS', functionName: 'osStatus', description: 'OS status report' },
      { latinName: 'REGISTRUM NUCLEI', functionName: 'kernelRegistry', description: 'Access kernel registry' },
      { latinName: 'EXSECUTIO NUCLEI', functionName: 'executeKernel', description: 'Execute kernel module' },
    ],
    monetization: 'Enterprise contract',
  },
  {
    id: 'sovereign-identity-sdk',
    name: '@medina/sovereign-identity-sdk',
    version: '1.0.0',
    description: 'Sovereign identity management — CLS classification, model composition, registry governance',
    tagline: 'Identity is sovereign or it is borrowed',
    terminal: '/identity',
    latinName: 'IDENTITAS REGNI',
    category: 'sovereign',
    license: 'Living Organism License',
    dependencies: ['sovereign-id', 'sovereign-cls', 'sovereign-model', 'sovereign-registry'],
    exports: [
      { latinName: 'CREATIO IDENTITATIS', functionName: 'createIdentity', description: 'Create sovereign identity' },
      { latinName: 'CLASSIFICATIO CLS', functionName: 'classifyCLS', description: 'CLS classification' },
      { latinName: 'COMPOSITIO EXEMPLARIS', functionName: 'composeModel', description: 'Compose sovereign model' },
      { latinName: 'REGISTRATIO REGNI', functionName: 'registerSovereign', description: 'Register in sovereign registry' },
    ],
    monetization: 'Enterprise contract',
  },
  {
    id: 'recital-evolution-sdk',
    name: '@medina/recital-evolution-sdk',
    version: '1.0.0',
    description: 'RECITAL_PLUS_ONE state evolution — the sovereign law of amplification that governs organism growth',
    tagline: 'Every recital amplifies. That is the law.',
    terminal: '/recital',
    latinName: 'EVOLUTIO RECITATIONIS',
    category: 'sovereign',
    license: 'Sovereign Constitutional License',
    dependencies: ['recitalPlusOne', 'governanceEngine', 'organismSovereign'],
    exports: [
      { latinName: 'INITIUM RECITATIONIS', functionName: 'initiateRecital', description: 'Initiate recital sequence' },
      { latinName: 'PROGRESSIO RECITATIONIS', functionName: 'advanceRecital', description: 'Advance recital step' },
      { latinName: 'STATUS RECITATIONIS', functionName: 'recitalStatus', description: 'Recital sequence status' },
      { latinName: 'AMPLIFICATIO MENSURA', functionName: 'measureAmplification', description: 'Measure amplification effect' },
    ],
    monetization: 'Enterprise contract',
  },
  {
    id: 'ulri-engine-sdk',
    name: '@medina/ulri-engine-sdk',
    version: '1.0.0',
    description: 'ULRI — Universal Language Rendering Interface for sovereign intelligence surfacing',
    tagline: 'Render intelligence in any language, any mode',
    terminal: '/ulri',
    latinName: 'MACHINA ULRI',
    category: 'sovereign',
    license: 'Creative Sovereign License',
    dependencies: ['ulriEngine', 'voiceEngine', 'exportEngine'],
    exports: [
      { latinName: 'REDDITIO LINGUAE', functionName: 'renderLanguage', description: 'Render in target language' },
      { latinName: 'REDDITIO VOCIS', functionName: 'renderVoice', description: 'Render as voice output' },
      { latinName: 'REDDITIO VISUALIS', functionName: 'renderVisual', description: 'Render visual representation' },
      { latinName: 'REDDITIO UNIVERSALIS', functionName: 'renderUniversal', description: 'Universal multi-modal render' },
    ],
    monetization: 'Enterprise contract',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export function getSDKById(id: string): ExtendedSDK | undefined {
  return EXTENDED_SDK_REGISTRY.find(sdk => sdk.id === id);
}

export function getSDKsByCategory(category: 'marketplace' | 'research' | 'sovereign'): ExtendedSDK[] {
  return EXTENDED_SDK_REGISTRY.filter(sdk => sdk.category === category);
}

export function getAllExports(): SDKExport[] {
  return EXTENDED_SDK_REGISTRY.flatMap(sdk => sdk.exports);
}

export function findExportByLatinName(name: string): { sdk: ExtendedSDK; export: SDKExport } | undefined {
  for (const sdk of EXTENDED_SDK_REGISTRY) {
    const exp = sdk.exports.find(e => e.latinName === name);
    if (exp) return { sdk, export: exp };
  }
  return undefined;
}

export function findExportByFunction(name: string): { sdk: ExtendedSDK; export: SDKExport } | undefined {
  for (const sdk of EXTENDED_SDK_REGISTRY) {
    const exp = sdk.exports.find(e => e.functionName === name);
    if (exp) return { sdk, export: exp };
  }
  return undefined;
}

export const EXTENDED_MANIFEST = {
  totalExtendedSDKs: EXTENDED_SDK_REGISTRY.length,
  marketplace: getSDKsByCategory('marketplace').length,
  research: getSDKsByCategory('research').length,
  sovereign: getSDKsByCategory('sovereign').length,
  totalExports: getAllExports().length,
  version: '1.0.0',
  phi: 1.618033988749895,
};
