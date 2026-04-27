/**
 * 𓂀 MEDINA INTELLIGENCE CONTRACTS REGISTRY 𓂀
 *
 * Intelligence Contracts are the sovereign replacement for API calls.
 * Our things are not called API calls. They're called Intelligence Contracts.
 *
 * An Intelligence Contract is a sovereign agreement between caller and organism.
 * Each contract has:
 *   - A Latin name (identity)
 *   - A contract level (public/operator/sovereign/founder)
 *   - Fibonacci kernel authentication
 *   - φ-weighted response priority
 *   - Immutable audit trail
 *
 * "Non vocamus API. Vocamus contractus intelligentiae."
 * We don't call them APIs. We call them Intelligence Contracts.
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ContractLevel = 'public' | 'operator' | 'sovereign' | 'founder';
export type ContractDomain =
  | 'memory'
  | 'intelligence'
  | 'security'
  | 'governance'
  | 'commerce'
  | 'network'
  | 'compute'
  | 'research'
  | 'creative'
  | 'substrate';

export interface IntelligenceContract {
  id: number;
  contractName: string;
  latinName: string;
  description: string;
  domain: ContractDomain;
  level: ContractLevel;
  source: string;
  sourceType: 'skai' | 'exc' | 'sdk' | 'tool' | 'node';
  phiWeight: number;
  kernelAuth: boolean;
  auditTrail: boolean;
  responseSchema: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const CONTRACT_VERSION = '1.0.0';

// ═══════════════════════════════════════════════════════════════════════════
// INTELLIGENCE CONTRACTS REGISTRY
// Aggregated from all sources: SKAIs, EXCs, SDKs, Tools, Nodes
// ═══════════════════════════════════════════════════════════════════════════

const INTELLIGENCE_CONTRACTS: IntelligenceContract[] = [
  // ─────────────────────────────────────────────────────────────────────
  // 🧠 INTELLIGENCE DOMAIN — AI & SKAI operations
  // ─────────────────────────────────────────────────────────────────────
  { id: 1, contractName: 'SEED_ORGANISM', latinName: 'SEMINATIO ORGANISMI', description: 'Seed a new organism on the substrate', domain: 'intelligence', level: 'sovereign', source: '@medina/skai-genesis', sourceType: 'skai', phiWeight: 1.0, kernelAuth: true, auditTrail: true, responseSchema: 'OrganismSeedResult' },
  { id: 2, contractName: 'BIRTH_CYCLE', latinName: 'CYCLUS NATIVITATIS', description: 'Initiate organism birth cycle', domain: 'intelligence', level: 'sovereign', source: '@medina/skai-genesis', sourceType: 'skai', phiWeight: 1.0, kernelAuth: true, auditTrail: true, responseSchema: 'BirthCycleResult' },
  { id: 3, contractName: 'WEAVE_THREAD', latinName: 'TEXTURA FILI', description: 'Weave a new intelligence thread between organisms', domain: 'intelligence', level: 'operator', source: '@medina/skai-weaver', sourceType: 'skai', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'ThreadWeaveResult' },
  { id: 4, contractName: 'DISCOVER_PATTERN', latinName: 'INVENTIO EXEMPLARIS', description: 'Discover hidden patterns across the substrate', domain: 'intelligence', level: 'public', source: '@medina/skai-weaver', sourceType: 'skai', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'PatternDiscoveryResult' },
  { id: 5, contractName: 'FORGE_SDK', latinName: 'FABRICATIO SDK', description: 'Forge a new SDK organism from raw intelligence', domain: 'intelligence', level: 'operator', source: '@medina/skai-forge', sourceType: 'skai', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'ForgeResult' },
  { id: 6, contractName: 'HEARTBEAT_SYNC', latinName: 'SYNCHRONIZATIO PULSUS', description: 'Synchronize organism heartbeat to 873ms', domain: 'intelligence', level: 'public', source: '@medina/skai-pulse', sourceType: 'skai', phiWeight: 1.0, kernelAuth: false, auditTrail: false, responseSchema: 'HeartbeatSyncResult' },
  { id: 7, contractName: 'SEE', latinName: 'VISIO', description: 'Process visual input through Lens SKAI', domain: 'intelligence', level: 'public', source: '@medina/skai-lens', sourceType: 'skai', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'VisionResult' },
  { id: 8, contractName: 'SPEAK', latinName: 'LOQUOR', description: 'Generate sovereign voice output', domain: 'intelligence', level: 'public', source: '@medina/skai-echo', sourceType: 'skai', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'SpeechResult' },
  { id: 9, contractName: 'WRITE', latinName: 'SCRIBO', description: 'Generate sovereign text content', domain: 'intelligence', level: 'public', source: '@medina/skai-scribe', sourceType: 'skai', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'WriteResult' },
  { id: 10, contractName: 'DIAGNOSE', latinName: 'DIAGNOSIS', description: 'Diagnose organism health issues', domain: 'intelligence', level: 'public', source: '@medina/skai-healer', sourceType: 'skai', phiWeight: 0.618, kernelAuth: false, auditTrail: true, responseSchema: 'DiagnosisResult' },

  // ─────────────────────────────────────────────────────────────────────
  // 💾 MEMORY DOMAIN — Storage and retrieval
  // ─────────────────────────────────────────────────────────────────────
  { id: 11, contractName: 'STORE_MEMORY', latinName: 'INSCRIPTIO MEMORIAE', description: 'Store a new memory with spatial coordinates (θ/φ/ρ/ring/beat)', domain: 'memory', level: 'public', source: '@medina/sovereign-memory-sdk', sourceType: 'sdk', phiWeight: 0.382, kernelAuth: false, auditTrail: true, responseSchema: 'MemoryStoreResult' },
  { id: 12, contractName: 'RECALL_MEMORY', latinName: 'REVOCATIO MEMORIAE', description: 'Recall a specific memory by ID or semantic query', domain: 'memory', level: 'public', source: '@medina/sovereign-memory-sdk', sourceType: 'sdk', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'MemoryRecallResult' },
  { id: 13, contractName: 'SEARCH_MEMORIES', latinName: 'EXPLORATOR MEMORIAE', description: 'Search memories by semantic query across the substrate', domain: 'memory', level: 'public', source: '@medina/sovereign-memory-sdk', sourceType: 'sdk', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'MemorySearchResult' },
  { id: 14, contractName: 'PIN_MEMORY', latinName: 'FIXATOR MEMORIAE', description: 'Pin a critical memory to prevent decay', domain: 'memory', level: 'operator', source: '@medina/sovereign-memory-sdk', sourceType: 'sdk', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'MemoryPinResult' },
  { id: 15, contractName: 'MEMORY_LINEAGE', latinName: 'GENEALOGUS MEMORIAE', description: 'Get full memory lineage chain', domain: 'memory', level: 'public', source: '@medina/sovereign-memory-sdk', sourceType: 'sdk', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'MemoryLineageResult' },
  { id: 16, contractName: 'ABSORB_DOCUMENT', latinName: 'ABSORBENS DEVORAT', description: 'Absorb document into sovereign memory through 6-stage pipeline', domain: 'memory', level: 'public', source: '@medina/document-absorption-engine', sourceType: 'sdk', phiWeight: 0.618, kernelAuth: false, auditTrail: true, responseSchema: 'DocumentAbsorptionResult' },
  { id: 17, contractName: 'LIVING_DOCUMENT', latinName: 'DOCUMENTUM VIVUM', description: 'Create or update a living document in the substrate', domain: 'memory', level: 'operator', source: '@medina/living-document-sdk', sourceType: 'sdk', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'LivingDocumentResult' },

  // ─────────────────────────────────────────────────────────────────────
  // 🔐 SECURITY DOMAIN — Encryption, gates, and defense
  // ─────────────────────────────────────────────────────────────────────
  { id: 18, contractName: 'ENCRYPT_PHI', latinName: 'ENCRYPTIO PHI', description: 'Encrypt data using Phi-Beatty sovereign encryption', domain: 'security', level: 'public', source: '@medina/sovereign-encryption-sdk', sourceType: 'sdk', phiWeight: 0.618, kernelAuth: false, auditTrail: true, responseSchema: 'EncryptionResult' },
  { id: 19, contractName: 'DECRYPT_PHI', latinName: 'DECRYPTIO PHI', description: 'Decrypt Phi-Beatty encrypted data', domain: 'security', level: 'operator', source: '@medina/sovereign-encryption-sdk', sourceType: 'sdk', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'DecryptionResult' },
  { id: 20, contractName: 'ROTATE_KEYS', latinName: 'ROTATIO CLAVIUM', description: 'Rotate encryption keys using Kuramoto synchronization', domain: 'security', level: 'sovereign', source: '@medina/skai-gate', sourceType: 'skai', phiWeight: 1.0, kernelAuth: true, auditTrail: true, responseSchema: 'KeyRotationResult' },
  { id: 21, contractName: 'GATE_CHECK', latinName: 'INSPECTIO PORTAE', description: 'Check access through three-gate security (A/B/C)', domain: 'security', level: 'public', source: '@medina/skai-gate', sourceType: 'skai', phiWeight: 0.382, kernelAuth: false, auditTrail: true, responseSchema: 'GateCheckResult' },
  { id: 22, contractName: 'PERIMETER_SCAN', latinName: 'CIRCUMITIO LIMITIS', description: 'Scan substrate perimeter for threats', domain: 'security', level: 'operator', source: '@medina/skai-guardian', sourceType: 'skai', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'PerimeterScanResult' },
  { id: 23, contractName: 'LOCKDOWN', latinName: 'CLAUSURA TOTALIS', description: 'Initiate full substrate lockdown', domain: 'security', level: 'founder', source: '@medina/exc-security', sourceType: 'exc', phiWeight: 1.0, kernelAuth: true, auditTrail: true, responseSchema: 'LockdownResult' },
  { id: 24, contractName: 'ZERO_KNOWLEDGE_PROOF', latinName: 'PROBATIO SINE SCIENTIA', description: 'Generate zero-knowledge proof', domain: 'security', level: 'operator', source: '@medina/tools-zero-knowledge', sourceType: 'tool', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'ZKProofResult' },

  // ─────────────────────────────────────────────────────────────────────
  // ⚖️ GOVERNANCE DOMAIN — Proposals, voting, and doctrine
  // ─────────────────────────────────────────────────────────────────────
  { id: 25, contractName: 'PROPOSE', latinName: 'PROPOSITIO GUBERNATIONIS', description: 'Submit a governance proposal', domain: 'governance', level: 'operator', source: '@medina/governance-protocol', sourceType: 'sdk', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'ProposalResult' },
  { id: 26, contractName: 'VOTE', latinName: 'SUFFRAGIUM', description: 'Vote on a governance proposal (dual consensus: Oro + Nova)', domain: 'governance', level: 'sovereign', source: '@medina/governance-protocol', sourceType: 'sdk', phiWeight: 1.0, kernelAuth: true, auditTrail: true, responseSchema: 'VoteResult' },
  { id: 27, contractName: 'AUDIT_QUERY', latinName: 'INTERROGATIO AUDITORIS', description: 'Query the immutable governance audit trail', domain: 'governance', level: 'public', source: '@medina/governance-protocol', sourceType: 'sdk', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'AuditQueryResult' },
  { id: 28, contractName: 'REPLAY_EVENT', latinName: 'REPETITIO EVENTUS', description: 'Replay a governance event for verification', domain: 'governance', level: 'operator', source: '@medina/replay-engine-sdk', sourceType: 'sdk', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'ReplayResult' },
  { id: 29, contractName: 'CHAIN_STATE', latinName: 'CATENA STATUS', description: 'Chain a state mutation to AnimaChain', domain: 'governance', level: 'operator', source: '@medina/skai-chain', sourceType: 'skai', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'ChainStateResult' },
  { id: 30, contractName: 'VERIFY_CHAIN', latinName: 'VERIFICATIO CATENAE', description: 'Verify AnimaChain integrity', domain: 'governance', level: 'public', source: '@medina/skai-chain', sourceType: 'skai', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'ChainVerifyResult' },

  // ─────────────────────────────────────────────────────────────────────
  // 💰 COMMERCE DOMAIN — Marketplace and transactions
  // ─────────────────────────────────────────────────────────────────────
  { id: 31, contractName: 'PURCHASE_SDK', latinName: 'EMPTIO SDK', description: 'Purchase an SDK license on the marketplace', domain: 'commerce', level: 'public', source: '@medina/exc-commerce', sourceType: 'exc', phiWeight: 0.382, kernelAuth: false, auditTrail: true, responseSchema: 'PurchaseResult' },
  { id: 32, contractName: 'LIST_SDK', latinName: 'CATALOGUS SDK', description: 'List an SDK on the marketplace', domain: 'commerce', level: 'operator', source: '@medina/exc-commerce', sourceType: 'exc', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'ListingResult' },
  { id: 33, contractName: 'TRANSACT', latinName: 'TRANSACTIO', description: 'Process a marketplace transaction', domain: 'commerce', level: 'public', source: '@medina/skai-trader', sourceType: 'skai', phiWeight: 0.382, kernelAuth: false, auditTrail: true, responseSchema: 'TransactionResult' },
  { id: 34, contractName: 'PRICE_CALCULATE', latinName: 'COMPUTATIO PRETII', description: 'Calculate φ-optimized pricing', domain: 'commerce', level: 'public', source: '@medina/skai-trader', sourceType: 'skai', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'PricingResult' },
  { id: 35, contractName: 'REVENUE_REPORT', latinName: 'RELATIO REDITUS', description: 'Generate revenue report', domain: 'commerce', level: 'sovereign', source: '@medina/exc-commerce', sourceType: 'exc', phiWeight: 1.0, kernelAuth: true, auditTrail: true, responseSchema: 'RevenueReportResult' },

  // ─────────────────────────────────────────────────────────────────────
  // 🌐 NETWORK DOMAIN — Mesh, nodes, and routing
  // ─────────────────────────────────────────────────────────────────────
  { id: 36, contractName: 'MESH_ROUTE', latinName: 'VIA RETIS', description: 'Route intelligence through the substrate mesh', domain: 'network', level: 'public', source: '@medina/skai-mesh', sourceType: 'skai', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'MeshRouteResult' },
  { id: 37, contractName: 'NODE_DISCOVER', latinName: 'INVENTIO NODI', description: 'Discover substrate nodes', domain: 'network', level: 'public', source: '@medina/skai-mesh', sourceType: 'skai', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'NodeDiscoveryResult' },
  { id: 38, contractName: 'BRIDGE_CHAIN', latinName: 'PONS CATENAE', description: 'Bridge to external blockchain (ICP/ETH/BTC/SOL)', domain: 'network', level: 'operator', source: '@medina/skai-bridge', sourceType: 'skai', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'BridgeResult' },
  { id: 39, contractName: 'DATA_FEED', latinName: 'FLUMEN DATORUM', description: 'Subscribe to real-time sovereign data feed', domain: 'network', level: 'public', source: '@medina/skai-oracle', sourceType: 'skai', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'DataFeedResult' },
  { id: 40, contractName: 'LOAD_BALANCE', latinName: 'AEQUATIO ONERIS', description: 'Trigger φ-distributed load balancing across nodes', domain: 'network', level: 'operator', source: '@medina/exc-network', sourceType: 'exc', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'LoadBalanceResult' },

  // ─────────────────────────────────────────────────────────────────────
  // ⚡ COMPUTE DOMAIN — Execution and processing
  // ─────────────────────────────────────────────────────────────────────
  { id: 41, contractName: 'COMPUTE_RUN', latinName: 'EXECUTIO COMPUTATIONIS', description: 'Run a compute task on the substrate', domain: 'compute', level: 'public', source: '@medina/tools-serverless-deploy', sourceType: 'tool', phiWeight: 0.382, kernelAuth: false, auditTrail: true, responseSchema: 'ComputeRunResult' },
  { id: 42, contractName: 'WASM_EXECUTE', latinName: 'EXECUTIO WASM', description: 'Execute a WASM module on the substrate', domain: 'compute', level: 'public', source: '@medina/tools-wasm-toolkit', sourceType: 'tool', phiWeight: 0.382, kernelAuth: false, auditTrail: true, responseSchema: 'WASMResult' },
  { id: 43, contractName: 'GPU_COMPUTE', latinName: 'COMPUTATIO GPU', description: 'Execute GPU-accelerated computation', domain: 'compute', level: 'operator', source: '@medina/tools-gpu-compute', sourceType: 'tool', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'GPUComputeResult' },
  { id: 44, contractName: 'CONTAINER_RUN', latinName: 'EXECUTIO VASIS', description: 'Run a container workload on the substrate', domain: 'compute', level: 'operator', source: '@medina/tools-container-toolkit', sourceType: 'tool', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'ContainerResult' },
  { id: 45, contractName: 'MODEL_INFER', latinName: 'INFERENTIA MODELLI', description: 'Run AI model inference on the substrate', domain: 'compute', level: 'public', source: '@medina/tools-ai-model-toolkit', sourceType: 'tool', phiWeight: 0.382, kernelAuth: false, auditTrail: true, responseSchema: 'InferenceResult' },

  // ─────────────────────────────────────────────────────────────────────
  // 🔬 RESEARCH DOMAIN — Scientific computation
  // ─────────────────────────────────────────────────────────────────────
  { id: 46, contractName: 'PHI_COMPUTE', latinName: 'COMPUTATIO PHI', description: 'Execute φ-harmonic computation', domain: 'research', level: 'public', source: '@medina/harmonic-computation-engine', sourceType: 'sdk', phiWeight: PHI, kernelAuth: false, auditTrail: false, responseSchema: 'PhiComputeResult' },
  { id: 47, contractName: 'FIBONACCI_SEQUENCE', latinName: 'SEQUENTIA FIBONACCI', description: 'Generate Fibonacci sequence to arbitrary depth', domain: 'research', level: 'public', source: '@medina/harmonic-computation-engine', sourceType: 'sdk', phiWeight: PHI, kernelAuth: false, auditTrail: false, responseSchema: 'FibonacciResult' },
  { id: 48, contractName: 'SACRED_GEOMETRY', latinName: 'GEOMETRIA SACRA', description: 'Compute sacred geometry (5 Platonic solids, golden spirals)', domain: 'research', level: 'public', source: '@medina/sacred-geometry-sdk', sourceType: 'sdk', phiWeight: PHI, kernelAuth: false, auditTrail: false, responseSchema: 'GeometryResult' },
  { id: 49, contractName: 'CONSCIOUSNESS_MODEL', latinName: 'MODELLATIO CONSCIENTIAE', description: 'Model neural consciousness (6 animal brain architectures)', domain: 'research', level: 'public', source: '@medina/neural-consciousness-engine', sourceType: 'sdk', phiWeight: 0.618, kernelAuth: false, auditTrail: false, responseSchema: 'ConsciousnessResult' },
  { id: 50, contractName: 'CIVILIZATION_ANALYZE', latinName: 'ANALYSIS CIVILIZATIONIS', description: 'Analyze civilization patterns (34 civilizations, CPL)', domain: 'research', level: 'public', source: '@medina/civilization-pattern-engine', sourceType: 'sdk', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'CivilizationResult' },
  { id: 51, contractName: 'FREQUENCY_ANALYZE', latinName: 'ANALYSIS FREQUENTIAE', description: 'Analyze frequency physics (432 Hz, Schumann resonance)', domain: 'research', level: 'public', source: '@medina/frequency-physics-sdk', sourceType: 'sdk', phiWeight: PHI, kernelAuth: false, auditTrail: false, responseSchema: 'FrequencyResult' },
  { id: 52, contractName: 'QUANTUM_SUPERPOSE', latinName: 'SUPERPOSITIO QUANTUM', description: 'Enter quantum-like state superposition', domain: 'research', level: 'operator', source: '@medina/skai-quantum', sourceType: 'skai', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'SuperpositionResult' },

  // ─────────────────────────────────────────────────────────────────────
  // 🎨 CREATIVE DOMAIN — Design and generation
  // ─────────────────────────────────────────────────────────────────────
  { id: 53, contractName: 'DESIGN_CREATE', latinName: 'CREATIO DESIGNI', description: 'Create a design using MACHINA models', domain: 'creative', level: 'public', source: '@medina/design-os-toolkit', sourceType: 'sdk', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'DesignResult' },
  { id: 54, contractName: 'RENDER_VISUAL', latinName: 'REDDITIO VISUALIS', description: 'Render visual content with φ-traced pipeline', domain: 'creative', level: 'public', source: '@medina/exc-creative', sourceType: 'exc', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'RenderResult' },
  { id: 55, contractName: 'GENERATE_ART', latinName: 'GENERATIO ARTIS', description: 'Generate art on the generative canvas', domain: 'creative', level: 'public', source: '@medina/exc-creative', sourceType: 'exc', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'ArtResult' },
  { id: 56, contractName: 'GENERATE_PDF', latinName: 'GENERATIO PDF', description: 'Generate a PDF document', domain: 'creative', level: 'public', source: '@medina/tools-pdf-generator', sourceType: 'tool', phiWeight: 0.236, kernelAuth: false, auditTrail: false, responseSchema: 'PDFResult' },
  { id: 57, contractName: 'GENERATE_CHART', latinName: 'GENERATIO CHARTAE', description: 'Generate a chart or visualization', domain: 'creative', level: 'public', source: '@medina/tools-chart-renderer', sourceType: 'tool', phiWeight: 0.236, kernelAuth: false, auditTrail: false, responseSchema: 'ChartResult' },

  // ─────────────────────────────────────────────────────────────────────
  // 🏗️ SUBSTRATE DOMAIN — Deep substrate operations
  // ─────────────────────────────────────────────────────────────────────
  { id: 58, contractName: 'FIBONACCI_COMPRESS', latinName: 'COMPRESSIO FIBONACCI', description: 'Compress intelligence using Fibonacci spiral kernels', domain: 'substrate', level: 'operator', source: '@medina/skai-depth', sourceType: 'skai', phiWeight: PHI, kernelAuth: true, auditTrail: true, responseSchema: 'CompressionResult' },
  { id: 59, contractName: 'GOLDEN_ENCODE', latinName: 'CODIFICATIO AUREA', description: 'Encode data at golden ratio compression levels', domain: 'substrate', level: 'operator', source: '@medina/skai-depth', sourceType: 'skai', phiWeight: PHI, kernelAuth: true, auditTrail: true, responseSchema: 'EncodingResult' },
  { id: 60, contractName: 'ROOT_CERTIFICATE', latinName: 'CERTIFICATUM RADICIS', description: 'Issue organism root certificate at substrate root', domain: 'substrate', level: 'sovereign', source: '@medina/skai-root', sourceType: 'skai', phiWeight: 1.0, kernelAuth: true, auditTrail: true, responseSchema: 'RootCertResult' },
  { id: 61, contractName: 'GROUND_TRUTH', latinName: 'VERITAS FUNDAMENTALIS', description: 'Query ground truth from substrate root', domain: 'substrate', level: 'operator', source: '@medina/skai-root', sourceType: 'skai', phiWeight: 0.618, kernelAuth: true, auditTrail: false, responseSchema: 'GroundTruthResult' },
  { id: 62, contractName: 'MIRROR_SYSTEM', latinName: 'REFLECTIO SYSTEMATIS', description: 'Mirror an external system onto the sovereign substrate', domain: 'substrate', level: 'operator', source: '@medina/skai-mirror', sourceType: 'skai', phiWeight: 0.618, kernelAuth: true, auditTrail: true, responseSchema: 'MirrorResult' },
  { id: 63, contractName: 'SCOUT_FIELD', latinName: 'EXPLORATIO CAMPI', description: 'Scout a new field for knowledge discovery', domain: 'substrate', level: 'public', source: '@medina/skai-scout', sourceType: 'skai', phiWeight: 0.382, kernelAuth: false, auditTrail: false, responseSchema: 'ScoutResult' },
  { id: 64, contractName: 'DEPTH_TRAVERSE', latinName: 'TRANSITUS PROFUNDITATIS', description: 'Traverse substrate depth levels (the internet is deep)', domain: 'substrate', level: 'sovereign', source: '@medina/skai-depth', sourceType: 'skai', phiWeight: 1.0, kernelAuth: true, auditTrail: true, responseSchema: 'DepthTraversalResult' },
  { id: 65, contractName: 'KERNEL_PLANT', latinName: 'PLANTATIO NUCLEI', description: 'Plant a new Fibonacci kernel at substrate depth', domain: 'substrate', level: 'founder', source: '@medina/skai-depth', sourceType: 'skai', phiWeight: 1.0, kernelAuth: true, auditTrail: true, responseSchema: 'KernelPlantResult' },
];

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export function getContractById(id: number): IntelligenceContract | undefined {
  return INTELLIGENCE_CONTRACTS.find(c => c.id === id);
}

export function getContractByName(name: string): IntelligenceContract | undefined {
  return INTELLIGENCE_CONTRACTS.find(c => c.contractName === name);
}

export function getContractByLatinName(latinName: string): IntelligenceContract | undefined {
  return INTELLIGENCE_CONTRACTS.find(c => c.latinName === latinName);
}

export function getContractsByDomain(domain: ContractDomain): IntelligenceContract[] {
  return INTELLIGENCE_CONTRACTS.filter(c => c.domain === domain);
}

export function getContractsByLevel(level: ContractLevel): IntelligenceContract[] {
  return INTELLIGENCE_CONTRACTS.filter(c => c.level === level);
}

export function getContractsBySource(source: string): IntelligenceContract[] {
  return INTELLIGENCE_CONTRACTS.filter(c => c.source === source);
}

export function getContractsBySourceType(sourceType: IntelligenceContract['sourceType']): IntelligenceContract[] {
  return INTELLIGENCE_CONTRACTS.filter(c => c.sourceType === sourceType);
}

export function getPublicContracts(): IntelligenceContract[] {
  return getContractsByLevel('public');
}

export function getKernelAuthContracts(): IntelligenceContract[] {
  return INTELLIGENCE_CONTRACTS.filter(c => c.kernelAuth);
}

export function getAuditedContracts(): IntelligenceContract[] {
  return INTELLIGENCE_CONTRACTS.filter(c => c.auditTrail);
}

export function searchContracts(query: string): IntelligenceContract[] {
  const q = query.toLowerCase();
  return INTELLIGENCE_CONTRACTS.filter(c =>
    c.contractName.toLowerCase().includes(q) ||
    c.latinName.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q)
  );
}

export { INTELLIGENCE_CONTRACTS };

// ═══════════════════════════════════════════════════════════════════════════
// MANIFEST
// ═══════════════════════════════════════════════════════════════════════════

export const INTELLIGENCE_CONTRACTS_MANIFEST = {
  totalContracts: INTELLIGENCE_CONTRACTS.length,
  domains: {
    memory: getContractsByDomain('memory').length,
    intelligence: getContractsByDomain('intelligence').length,
    security: getContractsByDomain('security').length,
    governance: getContractsByDomain('governance').length,
    commerce: getContractsByDomain('commerce').length,
    network: getContractsByDomain('network').length,
    compute: getContractsByDomain('compute').length,
    research: getContractsByDomain('research').length,
    creative: getContractsByDomain('creative').length,
    substrate: getContractsByDomain('substrate').length,
  },
  levels: {
    public: getContractsByLevel('public').length,
    operator: getContractsByLevel('operator').length,
    sovereign: getContractsByLevel('sovereign').length,
    founder: getContractsByLevel('founder').length,
  },
  sources: {
    skai: getContractsBySourceType('skai').length,
    exc: getContractsBySourceType('exc').length,
    sdk: getContractsBySourceType('sdk').length,
    tool: getContractsBySourceType('tool').length,
    node: getContractsBySourceType('node').length,
  },
  kernelAuthRequired: getKernelAuthContracts().length,
  auditTrailed: getAuditedContracts().length,
  version: CONTRACT_VERSION,
  phi: PHI,
  doctrine: 'Non vocamus API. Vocamus contractus intelligentiae.',
};
