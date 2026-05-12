/**
 * 𓂀 CLOUDFLARE EDGE MODULE INDEX 𓂀
 * Sovereign Intelligence at the Edge
 * "The Edge Awakens"
 *
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 * Build: φ-Harmonic 49
 */

// ═══════════════════════════════════════════════════════════════════════════
// CLOUDFLARE WORKERS BRIDGE (CF-WKR-001)
// Edge Agent Runtime - Deploy agents at 330+ locations
// ═══════════════════════════════════════════════════════════════════════════
export {
  CloudflareWorkersBridge,
  cloudflareWorkersBridge,
  // Types
  type CloudflareEdgeAgent,
  type AgentConsciousness,
  type AgentCapability,
  type Memory,
  type Goal,
  type Task,
  type WorkerConfig,
  // Constants
  PHI,
  PHI_INVERSE,
  SCHUMANN_RESONANCE_MS,
  CLOUDFLARE_EDGE_LOCATIONS,
  // Type aliases
  type EdgeLocation,
  type AgentState,
  type CapabilityType,
  type MemoryType,
  type GoalStatus,
  type TaskStatus,
} from './CloudflareWorkersBridge';

// ═══════════════════════════════════════════════════════════════════════════
// CLOUDFLARE ETHEREUM GATEWAY (CF-ETH-001)
// Direct sovereign access to Ethereum + L2s
// ═══════════════════════════════════════════════════════════════════════════
export {
  CloudflareEthereumGateway,
  cloudflareEthereumGateway,
  // Types
  type EthTransaction,
  type SignedTransaction,
  type TransactionReceipt,
  type Log,
  type LogFilter,
  type Block,
  type BridgeProof,
  type GatewayStatistics,
  // Constants
  CF_ETH_GATEWAY_MAINNET,
  CF_ETH_GATEWAY_GOERLI,
  SUPPORTED_NETWORKS,
  // Type aliases
  type NetworkName,
} from './CloudflareEthereumGateway';

// ═══════════════════════════════════════════════════════════════════════════
// CLOUDFLARE AI GATEWAY (CF-AI-001)
// Sovereign AI routing at the edge
// ═══════════════════════════════════════════════════════════════════════════
export {
  CloudflareAIGateway,
  cloudflareAIGateway,
  // Types
  type Message,
  type ChatCompletionOptions,
  type ChatCompletion,
  type ChatChunk,
  type EmbeddingResult,
  type TextGenerationResult,
  type ImageGenerationResult,
  type TranscriptionResult,
  type GatewayConfig,
  type UsageStatistics,
  // Constants
  AI_GATEWAY_BASE_URL,
  SUPPORTED_PROVIDERS,
  // Type aliases
  type ProviderName,
  type AIModel,
  type TaskType,
} from './CloudflareAIGateway';

// ═══════════════════════════════════════════════════════════════════════════
// CLOUDFLARE DURABLE OBJECTS (CF-DUR-001)
// Stateful agent consciousness
// ═══════════════════════════════════════════════════════════════════════════
export {
  AgentDurableObject,
  CoordinatorDurableObject,
  // Types
  type DurableObjectConfig,
  type AgentState as DOAgentState,
  type Thought,
  type AgentRelationship,
  type AgentSkill,
  type AgentMessage,
  type CoordinationRequest,
  type Proposal,
  type ProposalOption,
  type VoteResult,
  type SwarmObjective,
  type SwarmMetric,
  type SwarmResult,
  type DurableObjectStorage,
  // Type aliases
  type ThoughtType,
  type RelationshipType,
  type MessageType,
  type CoordinationType,
  type CoordinationStatus,
  type ProposalType,
} from './CloudflareDurableObjects';

// ═══════════════════════════════════════════════════════════════════════════
// CLOUDFLARE STORAGE BRIDGE (CF-STR-001)
// Distributed memory persistence via R2/KV/D1/Vectorize
// ═══════════════════════════════════════════════════════════════════════════
export {
  CloudflareStorageBridge,
  cloudflareStorageBridge,
  // Types
  type StorageConfig,
  type KVOptions,
  type R2Object,
  type R2ObjectList,
  type R2ListOptions,
  type D1Result,
  type VectorMatch,
  type VectorizeOptions,
  type MemoryHierarchyStats,
  // Type aliases
  type StorageTier,
} from './CloudflareStorageBridge';

// ═══════════════════════════════════════════════════════════════════════════
// CLOUDFLARE EDGE ORCHESTRATOR (CF-ORCH-001)
// Unified sovereign coordination
// ═══════════════════════════════════════════════════════════════════════════
export {
  CloudflareEdgeOrchestrator,
  cloudflareEdgeOrchestrator,
  // Types
  type OrchestratorConfig,
  type AgentSpec,
  type InferenceRequest,
  type InferenceResult,
  type MemoryResult,
  type SwarmConfig,
  type OrchestratorStatistics,
} from './CloudflareEdgeOrchestrator';

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

import { CloudflareEdgeOrchestrator, cloudflareEdgeOrchestrator } from './CloudflareEdgeOrchestrator';

/**
 * Main entry point - the unified orchestrator
 */
export default cloudflareEdgeOrchestrator;

// ═══════════════════════════════════════════════════════════════════════════
// CHARTER SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CLOUDFLARE EDGE ALPHA CHARTER HIERARCHY
 * ========================================
 * 
 * CF-ALPHA-001 (Alpha Charter)
 * ├── CF-WKR-001 (Workers Charter)
 * │   └── Edge Agent Runtime
 * │   └── 330+ Global Locations
 * │   └── V8 Isolates
 * │
 * ├── CF-ETH-001 (Ethereum Gateway Charter)
 * │   └── Direct RPC Access
 * │   └── No API Keys for Reads
 * │   └── L1 + L2 Support
 * │
 * ├── CF-AI-001 (AI Gateway Charter)
 * │   ├── CF-INF-001 (Workers AI Inference)
 * │   │   └── Local Inference
 * │   │   └── Llama, Mistral, Whisper, SDXL
 * │   └── Provider Routing
 * │   └── Caching & Rate Limiting
 * │
 * ├── CF-DUR-001 (Durable Objects Charter)
 * │   └── Stateful Agent State
 * │   └── Coordinator DO
 * │   └── WebSocket Support
 * │
 * ├── CF-STR-001 (Storage Charter)
 * │   └── L1: Immediate (In-Memory)
 * │   └── L2: KV (Global, Eventually Consistent)
 * │   └── L3: R2 (Object Storage)
 * │   └── L4: D1 (SQLite)
 * │   └── L5: Vectorize (Semantic Search)
 * │
 * └── CF-ORCH-001 (Orchestrator Charter)
 *     └── Unified Coordination
 *     └── φ-Harmonic Mode
 *     └── OMNIS Integration
 * 
 * TOTAL: 6 Main Charters + 1 Sub-Charter
 */
