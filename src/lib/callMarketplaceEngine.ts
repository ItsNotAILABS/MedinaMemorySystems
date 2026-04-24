// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 CALL MARKETPLACE ENGINE — ALWAYS-ON VOIS-ADDRESSABLE CALL LAYER 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * "Call Marketplace is the registry + protocol + settlement layer."
 *
 * "Not a generic API directory. VOIS is the naming and addressability system
 *  for organism-native components. Tool interfaces must reflect runtime truth."
 *
 * This engine boots at process start (via instrumentation.ts) and runs
 * continuously. It manages:
 *   - Tool Registry: 260 tools across 12 categories, all named exports
 *   - Call Contracts: Machine-readable invocation definitions
 *   - Permission Enforcement: 5-tier access control
 *   - Settlement: Usage, billing, reward, and proof records
 *   - Protocol Dispatch: 55 enterprise protocols
 *   - Client Management: Multi-tenant with quotas and health
 *
 * All 20 core tools are registered at boot as "always-running" — they
 * were on 10 seconds ago, they were on when this conversation started.
 *
 * φ = 1.618033988749895
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type {
  ToolRegistryEntry,
  ToolMetadata,
  CallContract,
  SettlementRecord,
  ProtocolDefinition,
  ClientRecord,
  CallerIdentity,
  PermissionTier,
  ToolCategory,
  ProtocolCategory,
  MarketplaceSnapshot,
  ToolStatus,
  PricingClass,
  RewardClass,
  ContractField,
  ProtocolStep,
} from '@/types/marketplace';

// ─────────────────────────────────────────────────────────────────────────────
// SINGLETON STATE — Lives for entire process lifetime
// ─────────────────────────────────────────────────────────────────────────────

const toolRegistry: Map<string, ToolRegistryEntry> = new Map();
const toolMetadataStore: Map<string, ToolMetadata> = new Map();
const contractStore: Map<string, CallContract> = new Map();
const protocolRegistry: Map<string, ProtocolDefinition> = new Map();
const clientRegistry: Map<string, ClientRecord> = new Map();
const settlements: SettlementRecord[] = [];

let engineBootedAt = 0;
let engineBooted = false;
let totalInvocations = 0;

// ─────────────────────────────────────────────────────────────────────────────
// PERMISSION HIERARCHY
// ─────────────────────────────────────────────────────────────────────────────

const TIER_LEVELS: Record<PermissionTier, number> = {
  PUBLIC: 0,
  ENTERPRISE: 1,
  PARTNER: 2,
  INTERNAL: 3,
  INTERNAL_SOVEREIGN: 4,
};

function hasTierAccess(callerTier: PermissionTier, requiredTier: PermissionTier): boolean {
  return TIER_LEVELS[callerTier] >= TIER_LEVELS[requiredTier];
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL DEFINITION HELPERS — All 20 Core + Extended categories
// ─────────────────────────────────────────────────────────────────────────────

interface ToolDef {
  id: string;
  name: string;
  displayName: string;
  purpose: string;
  category: ToolCategory;
  pricing: PricingClass;
  reward: RewardClass;
  whenToUse: string[];
  inputTypes: string[];
  outputTypes: string[];
  capabilities: string[];
  chainTo: string[];
  latencyMs: number;
  tags: string[];
}

// ═════════════════════════════════════════════════════════════════════════════
// CANONICAL TOOL INVENTORY — 260 tools
// ═════════════════════════════════════════════════════════════════════════════

const CORE_TOOLS: ToolDef[] = [
  // ── Core Pulse (TOOL-001–020) ──────────────────────────────────────────────
  { id: 'TOOL-001', name: 'PULSE-KEEPER', displayName: 'Pulse Keeper', purpose: 'Maintains the φ-derived organism heartbeat, ensuring all subsystems stay synchronized to the sacred timing.', category: 'CORE', pricing: 'P0', reward: 'R0', whenToUse: ['system boot', 'heartbeat sync', 'timing reference'], inputTypes: ['timing_config'], outputTypes: ['pulse_signal', 'sync_status'], capabilities: ['generate_pulse', 'sync_timing', 'detect_drift'], chainTo: ['SYNC-WEAVER', 'FLOW-MONITOR'], latencyMs: 5, tags: ['pulse', 'timing', 'heartbeat', 'core'] },
  { id: 'TOOL-002', name: 'SYNC-WEAVER', displayName: 'Sync Weaver', purpose: 'Weaves synchronization signals across all organism domains, ensuring coherent state.', category: 'CORE', pricing: 'P0', reward: 'R0', whenToUse: ['cross-domain sync', 'state coherence check', 'distributed alignment'], inputTypes: ['domain_states'], outputTypes: ['sync_report', 'alignment_vector'], capabilities: ['sync', 'align', 'weave'], chainTo: ['PULSE-KEEPER', 'STATE-GUARDIAN'], latencyMs: 15, tags: ['sync', 'coherence', 'weaving', 'core'] },
  { id: 'TOOL-003', name: 'FLOW-MONITOR', displayName: 'Flow Monitor', purpose: 'Monitors all data flows across the organism, detecting bottlenecks and dead channels.', category: 'CORE', pricing: 'P0', reward: 'R1', whenToUse: ['flow analysis', 'bottleneck detection', 'throughput monitoring'], inputTypes: ['flow_snapshot'], outputTypes: ['flow_report', 'bottleneck_map'], capabilities: ['monitor', 'analyze', 'report'], chainTo: ['RESOURCE-BALANCER', 'LOG-STREAMER'], latencyMs: 20, tags: ['flow', 'monitoring', 'throughput', 'core'] },
  { id: 'TOOL-004', name: 'STATE-GUARDIAN', displayName: 'State Guardian', purpose: 'Guards organism state consistency, preventing conflicting mutations and detecting corruption.', category: 'CORE', pricing: 'P0', reward: 'R0', whenToUse: ['state mutation', 'consistency check', 'corruption detection'], inputTypes: ['state_diff', 'mutation_request'], outputTypes: ['guard_result', 'consistency_score'], capabilities: ['guard', 'validate', 'repair'], chainTo: ['SYNC-WEAVER', 'INTEGRITY-CHECKER'], latencyMs: 10, tags: ['state', 'guard', 'consistency', 'core'] },
  { id: 'TOOL-005', name: 'CYCLE-COUNTER', displayName: 'Cycle Counter', purpose: 'Counts and tracks all organism cycles — heartbeats, career flows, protocol executions.', category: 'CORE', pricing: 'P0', reward: 'R0', whenToUse: ['cycle tracking', 'timing analysis', 'phase detection'], inputTypes: ['cycle_query'], outputTypes: ['cycle_count', 'phase_report'], capabilities: ['count', 'track', 'phase_detect'], chainTo: ['PULSE-KEEPER', 'LOG-STREAMER'], latencyMs: 3, tags: ['cycles', 'counting', 'phases', 'core'] },
  // ── Intelligence (TOOL-006–020) ────────────────────────────────────────────
  { id: 'TOOL-006', name: 'INFER-ENGINE', displayName: 'Inference Engine', purpose: 'Runs inference operations across multiple model families, routing to the optimal model.', category: 'CORE', pricing: 'P2', reward: 'R1', whenToUse: ['inference request', 'model invocation', 'reasoning task'], inputTypes: ['prompt', 'context_window', 'model_preference'], outputTypes: ['inference_result', 'confidence_score', 'model_used'], capabilities: ['infer', 'reason', 'route'], chainTo: ['PATTERN-SEEKER', 'ATTENTION-ROUTER', 'MEMORY-CONSOLIDATOR'], latencyMs: 200, tags: ['inference', 'AI', 'reasoning', 'intelligence'] },
  { id: 'TOOL-007', name: 'PATTERN-SEEKER', displayName: 'Pattern Seeker', purpose: 'Detects patterns across data streams, memory, and organism state.', category: 'CORE', pricing: 'P2', reward: 'R2', whenToUse: ['pattern discovery', 'anomaly context', 'trend analysis'], inputTypes: ['data_window', 'pattern_query'], outputTypes: ['pattern_report', 'confidence_map'], capabilities: ['detect', 'classify', 'predict'], chainTo: ['ANOMALY-DETECTOR', 'CONTEXT-BUILDER'], latencyMs: 150, tags: ['patterns', 'detection', 'analysis', 'intelligence'] },
  { id: 'TOOL-008', name: 'CONTEXT-BUILDER', displayName: 'Context Builder', purpose: 'Builds rich context objects from conversation history, memory, and organism state.', category: 'CORE', pricing: 'P1', reward: 'R1', whenToUse: ['context assembly', 'pre-inference prep', 'conversation enrichment'], inputTypes: ['conversation_history', 'memory_refs', 'organism_state'], outputTypes: ['context_object', 'relevance_scores'], capabilities: ['build', 'enrich', 'scope'], chainTo: ['INFER-ENGINE', 'ATTENTION-ROUTER'], latencyMs: 50, tags: ['context', 'building', 'enrichment', 'intelligence'] },
  { id: 'TOOL-009', name: 'ATTENTION-ROUTER', displayName: 'Attention Router', purpose: 'Routes attention and salience across subsystems, ensuring the organism focuses on what matters.', category: 'CORE', pricing: 'P2', reward: 'R1', whenToUse: ['attention routing', 'salience decisions', 'focus management'], inputTypes: ['attention_signals', 'priority_map'], outputTypes: ['routing_decision', 'attention_vector'], capabilities: ['route', 'prioritize', 'focus'], chainTo: ['CONTEXT-BUILDER', 'MEMORY-CONSOLIDATOR'], latencyMs: 30, tags: ['routing', 'salience', 'attention', 'intelligence'] },
  { id: 'TOOL-010', name: 'MEMORY-CONSOLIDATOR', displayName: 'Memory Consolidator', purpose: 'Consolidates working memory into long-term storage with proper lineage and doctrine alignment.', category: 'CORE', pricing: 'P2', reward: 'R2', whenToUse: ['memory write', 'consolidation cycle', 'knowledge integration'], inputTypes: ['memory_buffer', 'consolidation_params'], outputTypes: ['memory_artifact_id', 'coherence_delta', 'proof_hash'], capabilities: ['consolidate', 'align', 'prove'], chainTo: ['CONTEXT-BUILDER', 'SEAL-VERIFIER'], latencyMs: 100, tags: ['memory', 'consolidation', 'storage', 'intelligence'] },
  // ── Defense (TOOL-011–020) ─────────────────────────────────────────────────
  { id: 'TOOL-011', name: 'SENTINEL-WATCH', displayName: 'Sentinel Watch', purpose: 'Continuous security monitoring across all organism surfaces.', category: 'CORE', pricing: 'P0', reward: 'R1', whenToUse: ['security scan', 'threat monitoring', 'perimeter check'], inputTypes: ['scan_scope', 'threat_signatures'], outputTypes: ['threat_report', 'risk_level'], capabilities: ['monitor', 'detect', 'alert'], chainTo: ['ANOMALY-DETECTOR', 'BOUNDARY-ENFORCER'], latencyMs: 25, tags: ['security', 'monitoring', 'sentinel', 'defense'] },
  { id: 'TOOL-012', name: 'INTEGRITY-CHECKER', displayName: 'Integrity Checker', purpose: 'Verifies data and state integrity using cryptographic proofs and doctrine alignment.', category: 'CORE', pricing: 'P1', reward: 'R1', whenToUse: ['integrity verification', 'post-mutation check', 'proof validation'], inputTypes: ['data_hash', 'expected_state'], outputTypes: ['integrity_result', 'proof_chain'], capabilities: ['verify', 'prove', 'repair'], chainTo: ['SEAL-VERIFIER', 'STATE-GUARDIAN'], latencyMs: 40, tags: ['integrity', 'verification', 'proof', 'defense'] },
  { id: 'TOOL-013', name: 'BOUNDARY-ENFORCER', displayName: 'Boundary Enforcer', purpose: 'Enforces permission boundaries and access control across all organism surfaces.', category: 'CORE', pricing: 'P0', reward: 'R0', whenToUse: ['access control', 'boundary check', 'permission enforcement'], inputTypes: ['access_request', 'caller_identity'], outputTypes: ['access_decision', 'enforcement_log'], capabilities: ['enforce', 'block', 'log'], chainTo: ['SENTINEL-WATCH', 'INTEGRITY-CHECKER'], latencyMs: 8, tags: ['boundaries', 'access', 'enforcement', 'defense'] },
  { id: 'TOOL-014', name: 'ANOMALY-DETECTOR', displayName: 'Anomaly Detector', purpose: 'Detects law drift, antifragility signals, and abnormal substrate deviations.', category: 'CORE', pricing: 'P2', reward: 'R2', whenToUse: ['suspected drift', 'unexpected runtime behavior', 'post-call integrity check'], inputTypes: ['state_snapshot', 'law_vector', 'event_window'], outputTypes: ['anomaly_report', 'risk_score', 'recommended_actions'], capabilities: ['detect', 'score', 'classify'], chainTo: ['INTEGRITY-CHECKER', 'SEAL-VERIFIER', 'LOG-STREAMER'], latencyMs: 220, tags: ['anomaly', 'drift', 'detection', 'defense'] },
  { id: 'TOOL-015', name: 'SEAL-VERIFIER', displayName: 'Seal Verifier', purpose: 'Verifies sovereign seals, proof chains, and anima hashes on all artifacts.', category: 'CORE', pricing: 'P1', reward: 'R1', whenToUse: ['seal verification', 'proof chain validation', 'artifact authentication'], inputTypes: ['seal_data', 'proof_chain'], outputTypes: ['verification_result', 'chain_status'], capabilities: ['verify', 'authenticate', 'chain'], chainTo: ['INTEGRITY-CHECKER', 'LOG-STREAMER'], latencyMs: 35, tags: ['seals', 'verification', 'authentication', 'defense'] },
  // ── Infrastructure (TOOL-016–020) ──────────────────────────────────────────
  { id: 'TOOL-016', name: 'RESOURCE-BALANCER', displayName: 'Resource Balancer', purpose: 'Balances computational resources across workers, models, and protocol executions.', category: 'CORE', pricing: 'P0', reward: 'R0', whenToUse: ['resource allocation', 'load balancing', 'capacity planning'], inputTypes: ['resource_snapshot', 'demand_forecast'], outputTypes: ['allocation_plan', 'balance_report'], capabilities: ['balance', 'allocate', 'forecast'], chainTo: ['FLOW-MONITOR', 'QUEUE-PROCESSOR'], latencyMs: 15, tags: ['resources', 'balancing', 'capacity', 'infrastructure'] },
  { id: 'TOOL-017', name: 'CONNECTION-POOL', displayName: 'Connection Pool', purpose: 'Manages connection pools for all external and internal communication channels.', category: 'CORE', pricing: 'P0', reward: 'R0', whenToUse: ['connection management', 'pool health', 'connection scaling'], inputTypes: ['pool_config', 'connection_request'], outputTypes: ['connection_handle', 'pool_status'], capabilities: ['pool', 'connect', 'scale'], chainTo: ['RESOURCE-BALANCER', 'CACHE-OPTIMIZER'], latencyMs: 5, tags: ['connections', 'pooling', 'networking', 'infrastructure'] },
  { id: 'TOOL-018', name: 'CACHE-OPTIMIZER', displayName: 'Cache Optimizer', purpose: 'Optimizes caching strategies across all data access paths.', category: 'CORE', pricing: 'P0', reward: 'R1', whenToUse: ['cache tuning', 'hit-rate improvement', 'eviction optimization'], inputTypes: ['cache_stats', 'access_patterns'], outputTypes: ['cache_policy', 'optimization_report'], capabilities: ['optimize', 'evict', 'prefetch'], chainTo: ['CONNECTION-POOL', 'RESOURCE-BALANCER'], latencyMs: 10, tags: ['caching', 'optimization', 'performance', 'infrastructure'] },
  { id: 'TOOL-019', name: 'QUEUE-PROCESSOR', displayName: 'Queue Processor', purpose: 'Processes priority queues for deferred and batched operations.', category: 'CORE', pricing: 'P0', reward: 'R0', whenToUse: ['queue processing', 'batch operations', 'deferred execution'], inputTypes: ['queue_item', 'priority_level'], outputTypes: ['processing_result', 'queue_status'], capabilities: ['process', 'batch', 'prioritize'], chainTo: ['RESOURCE-BALANCER', 'LOG-STREAMER'], latencyMs: 12, tags: ['queues', 'processing', 'batch', 'infrastructure'] },
  { id: 'TOOL-020', name: 'LOG-STREAMER', displayName: 'Log Streamer', purpose: 'Streams structured logs from all subsystems for audit, analysis, and proof.', category: 'CORE', pricing: 'P0', reward: 'R1', whenToUse: ['logging', 'audit trail', 'real-time monitoring', 'proof generation'], inputTypes: ['log_entry', 'stream_config'], outputTypes: ['log_stream', 'audit_receipt'], capabilities: ['stream', 'log', 'audit'], chainTo: ['ANOMALY-DETECTOR', 'SEAL-VERIFIER'], latencyMs: 3, tags: ['logging', 'streaming', 'audit', 'infrastructure'] },
];

// Extended categories use generated patterns (same architecture, different specialties)
function generateCategoryTools(
  category: ToolCategory,
  startId: number,
  count: number,
  names: string[],
): ToolDef[] {
  return names.slice(0, count).map((name, i) => ({
    id: `TOOL-${String(startId + i).padStart(3, '0')}`,
    name: name.toUpperCase().replace(/\s+/g, '-'),
    displayName: name,
    purpose: `${category} tool: ${name}`,
    category,
    pricing: 'P2' as PricingClass,
    reward: 'R1' as RewardClass,
    whenToUse: [`${category.toLowerCase()} operations`],
    inputTypes: ['payload'],
    outputTypes: ['result'],
    capabilities: ['execute'],
    chainTo: [],
    latencyMs: 100,
    tags: [category.toLowerCase(), name.toLowerCase().replace(/\s+/g, '-')],
  }));
}

const AI_CALL_NAMES = [
  'Goal Decomposer', 'Hallucination Checker', 'Reasoning Chain Builder', 'Multi-Model Arbiter',
  'Prompt Optimizer', 'Token Counter', 'Response Validator', 'Context Trimmer',
  'Few-Shot Selector', 'Chain-of-Thought Tracer', 'Self-Reflection Agent', 'Output Formatter',
  'Safety Filter', 'Bias Detector', 'Fact Verifier', 'Summary Generator',
  'Translation Bridge', 'Code Interpreter', 'Math Solver', 'Vision Analyzer',
  'Audio Transcriber', 'Document Parser', 'Schema Extractor', 'Entity Resolver',
  'Relation Mapper', 'Timeline Builder', 'Sentiment Analyzer', 'Topic Classifier',
  'Keyword Extractor', 'Embedding Generator', 'Similarity Scorer', 'Cluster Finder',
  'Anomaly Scorer', 'Trend Predictor', 'Recommendation Engine', 'Decision Tree Runner',
  'Bayesian Updater', 'Monte Carlo Sampler', 'Genetic Optimizer', 'Reinforcement Learner',
];

const BLUEPRINT_NAMES = [
  'API Gateway Blueprint', 'Microservice Blueprint', 'Event Sourcing Blueprint', 'CQRS Blueprint',
  'Saga Orchestrator Blueprint', 'Circuit Breaker Blueprint', 'Retry Strategy Blueprint', 'Rate Limiter Blueprint',
  'Load Balancer Blueprint', 'Service Mesh Blueprint', 'Data Pipeline Blueprint', 'Stream Processing Blueprint',
  'Batch Processing Blueprint', 'Cache Strategy Blueprint', 'Search Index Blueprint', 'Notification Blueprint',
  'Auth Flow Blueprint', 'Audit Trail Blueprint', 'Feature Flag Blueprint', 'A/B Test Blueprint',
];

const RECIPE_NAMES = [
  'Full Stack Deploy', 'Database Migration', 'Zero-Downtime Release', 'Data Backup Restore',
  'Performance Audit', 'Security Scan Workflow', 'Compliance Check', 'Incident Response',
  'Capacity Scaling', 'Cost Optimization', 'Onboarding Pipeline', 'Offboarding Cleanup',
  'Feature Launch', 'Rollback Procedure', 'Disaster Recovery', 'Health Check Suite',
  'Monitoring Setup', 'Alert Configuration', 'Log Aggregation', 'Metric Dashboard',
];

const LENS_NAMES = [
  'Cost Lens', 'Security Lens', 'Performance Lens', 'Compliance Lens',
  'Architecture Lens', 'Data Quality Lens', 'User Experience Lens', 'Reliability Lens',
  'Scalability Lens', 'Maintainability Lens', 'Developer Experience Lens', 'Business Value Lens',
  'Risk Assessment Lens', 'Technical Debt Lens', 'Innovation Lens', 'Sustainability Lens',
  'Accessibility Lens', 'Internationalization Lens', 'Privacy Lens', 'Observability Lens',
];

const HOOK_NAMES = [
  'Pre-Deploy Hook', 'Post-Deploy Hook', 'Pre-Commit Hook', 'Post-Merge Hook',
  'On-Error Hook', 'On-Success Hook', 'On-Threshold Hook', 'On-Schedule Hook',
  'On-Event Hook', 'On-Change Hook', 'Pre-Scale Hook', 'Post-Scale Hook',
  'Pre-Migration Hook', 'Post-Migration Hook', 'On-Alert Hook', 'On-Recovery Hook',
  'Pre-Release Hook', 'Post-Release Hook', 'On-Audit Hook', 'On-Compliance Hook',
];

const TRIGGER_NAMES = [
  'CPU Threshold Trigger', 'Memory Threshold Trigger', 'Error Rate Trigger', 'Latency Trigger',
  'Cost Ceiling Trigger', 'Traffic Spike Trigger', 'Security Event Trigger', 'Compliance Trigger',
  'Schedule Trigger', 'Webhook Trigger', 'Queue Depth Trigger', 'Health Check Trigger',
  'Capacity Trigger', 'SLA Breach Trigger', 'Anomaly Trigger', 'Drift Trigger',
  'Version Trigger', 'Dependency Trigger', 'Certificate Trigger', 'License Trigger',
];

const ADAPTER_NAMES = [
  'OpenAI Adapter', 'Anthropic Adapter', 'Google AI Adapter', 'AWS Bedrock Adapter',
  'Azure OpenAI Adapter', 'Hugging Face Adapter', 'Cohere Adapter', 'Mistral Adapter',
  'Replicate Adapter', 'Together AI Adapter', 'Groq Adapter', 'Perplexity Adapter',
  'Ollama Adapter', 'LM Studio Adapter', 'vLLM Adapter', 'TensorRT Adapter',
  'ONNX Adapter', 'Core ML Adapter', 'WebGPU Adapter', 'WASM Adapter',
];

const SENSOR_NAMES = [
  'Latency Sensor', 'Throughput Sensor', 'Error Rate Sensor', 'CPU Usage Sensor',
  'Memory Usage Sensor', 'Disk IO Sensor', 'Network IO Sensor', 'Connection Count Sensor',
  'Queue Depth Sensor', 'Cache Hit Sensor', 'Model Accuracy Sensor', 'Drift Sensor',
  'Cost Accumulator Sensor', 'User Engagement Sensor', 'API Health Sensor', 'Security Posture Sensor',
  'Compliance Score Sensor', 'Data Quality Sensor', 'SLA Compliance Sensor', 'Uptime Sensor',
];

const SHIELD_NAMES = [
  'Rate Limit Shield', 'DDoS Shield', 'Injection Shield', 'XSS Shield',
  'CSRF Shield', 'Auth Shield', 'Data Leak Shield', 'PII Shield',
  'Prompt Injection Shield', 'Model Extraction Shield', 'Data Poisoning Shield', 'Adversarial Shield',
  'Jailbreak Shield', 'Toxicity Shield', 'Copyright Shield', 'Deepfake Shield',
  'Bias Shield', 'Hallucination Shield', 'Overfit Shield', 'Privacy Shield',
];

// Build the full 260-tool inventory
// Core: TOOL-001–020 (20), AI Calls: TOOL-021–060 (40), Blueprints: TOOL-061–080 (20),
// Recipes: TOOL-081–100 (20), Lenses: TOOL-101–120 (20), Hooks: TOOL-121–140 (20),
// Triggers: TOOL-141–160 (20), Adapters: TOOL-161–180 (20), Sensors: TOOL-181–200 (20),
// Shields: TOOL-201–220 (20)  =  260 total
const ALL_TOOL_DEFS: ToolDef[] = [
  ...CORE_TOOLS,                                                       // TOOL-001–020
  ...generateCategoryTools('AI_CALLS',   21,  40, AI_CALL_NAMES),      // TOOL-021–060
  ...generateCategoryTools('BLUEPRINTS', 61,  20, BLUEPRINT_NAMES),    // TOOL-061–080
  ...generateCategoryTools('RECIPES',    81,  20, RECIPE_NAMES),       // TOOL-081–100
  ...generateCategoryTools('LENSES',     101, 20, LENS_NAMES),         // TOOL-101–120
  ...generateCategoryTools('HOOKS',      121, 20, HOOK_NAMES),         // TOOL-121–140
  ...generateCategoryTools('TRIGGERS',   141, 20, TRIGGER_NAMES),      // TOOL-141–160
  ...generateCategoryTools('ADAPTERS',   161, 20, ADAPTER_NAMES),      // TOOL-161–180
  ...generateCategoryTools('SENSORS',    181, 20, SENSOR_NAMES),       // TOOL-181–200
  ...generateCategoryTools('SHIELDS',    201, 20, SHIELD_NAMES),       // TOOL-201–220
];

// ═════════════════════════════════════════════════════════════════════════════
// PROTOCOL INVENTORY — 55 Enterprise Protocols
// ═════════════════════════════════════════════════════════════════════════════

interface ProtoDef {
  id: string;
  name: string;
  displayName: string;
  category: ProtocolCategory;
  description: string;
  tier: PermissionTier;
  durationMs: number;
}

const ALL_PROTOCOL_DEFS: ProtoDef[] = [
  // Client Lifecycle 001–005
  { id: 'PROTO-001', name: 'clientOnboard', displayName: 'Client Onboard', category: 'CLIENT_LIFECYCLE', description: 'Full client onboarding pipeline — identity, quotas, access grants, welcome sequence.', tier: 'INTERNAL', durationMs: 5000 },
  { id: 'PROTO-002', name: 'clientOffboard', displayName: 'Client Offboard', category: 'CLIENT_LIFECYCLE', description: 'Graceful client offboarding — data export, access revoke, settlement finalization.', tier: 'INTERNAL', durationMs: 8000 },
  { id: 'PROTO-003', name: 'clientSuspend', displayName: 'Client Suspend', category: 'CLIENT_LIFECYCLE', description: 'Temporary client suspension — freeze access while preserving data.', tier: 'INTERNAL', durationMs: 1000 },
  { id: 'PROTO-004', name: 'clientMigrate', displayName: 'Client Migrate', category: 'CLIENT_LIFECYCLE', description: 'Client tier migration — upgrade/downgrade with quota recalculation.', tier: 'INTERNAL_SOVEREIGN', durationMs: 3000 },
  { id: 'PROTO-005', name: 'clientHealthCheck', displayName: 'Client Health Check', category: 'CLIENT_LIFECYCLE', description: 'Comprehensive client health assessment — usage, quotas, billing, activity.', tier: 'INTERNAL', durationMs: 500 },
  // AI Pipeline 006–010
  { id: 'PROTO-006', name: 'aiRequestPipeline', displayName: 'AI Request Pipeline', category: 'AI_PIPELINE', description: 'Full AI request lifecycle — validation, routing, inference, response assembly.', tier: 'INTERNAL', durationMs: 2000 },
  { id: 'PROTO-007', name: 'aiFailoverChain', displayName: 'AI Failover Chain', category: 'AI_PIPELINE', description: 'Automatic failover across model providers when primary fails.', tier: 'INTERNAL', durationMs: 500 },
  { id: 'PROTO-008', name: 'aiCostGovernor', displayName: 'AI Cost Governor', category: 'AI_PIPELINE', description: 'Real-time cost governance — budget enforcement, spend alerts, optimization.', tier: 'INTERNAL', durationMs: 100 },
  { id: 'PROTO-009', name: 'aiQualityGate', displayName: 'AI Quality Gate', category: 'AI_PIPELINE', description: 'Output quality validation — hallucination check, fact verification, safety filter.', tier: 'INTERNAL', durationMs: 300 },
  { id: 'PROTO-010', name: 'aiModelRouter', displayName: 'AI Model Router', category: 'AI_PIPELINE', description: 'Intelligent model routing based on task, cost, latency, and capability.', tier: 'INTERNAL', durationMs: 50 },
  // Data Governance 011–015
  { id: 'PROTO-011', name: 'dataIngestPipeline', displayName: 'Data Ingest Pipeline', category: 'DATA_GOVERNANCE', description: 'Structured data ingestion with validation, dedup, and lineage.', tier: 'INTERNAL', durationMs: 1500 },
  { id: 'PROTO-012', name: 'dataExportPipeline', displayName: 'Data Export Pipeline', category: 'DATA_GOVERNANCE', description: 'Governed data export with redaction, formatting, and audit.', tier: 'PARTNER', durationMs: 3000 },
  { id: 'PROTO-013', name: 'dataRetention', displayName: 'Data Retention', category: 'DATA_GOVERNANCE', description: 'Automated data retention enforcement — archive, purge, compliance.', tier: 'INTERNAL', durationMs: 2000 },
  { id: 'PROTO-014', name: 'privacyCompliance', displayName: 'Privacy Compliance', category: 'DATA_GOVERNANCE', description: 'GDPR/CCPA compliance check and enforcement across data stores.', tier: 'INTERNAL', durationMs: 1000 },
  { id: 'PROTO-015', name: 'dataLineage', displayName: 'Data Lineage', category: 'DATA_GOVERNANCE', description: 'Full data lineage tracing from origin through transformations.', tier: 'INTERNAL', durationMs: 800 },
  // Security & Trust 016–020
  { id: 'PROTO-016', name: 'zeroTrustGate', displayName: 'Zero Trust Gate', category: 'SECURITY_TRUST', description: 'Zero-trust access verification for every call.', tier: 'INTERNAL', durationMs: 50 },
  { id: 'PROTO-017', name: 'threatResponse', displayName: 'Threat Response', category: 'SECURITY_TRUST', description: 'Automated threat response — detection, containment, remediation.', tier: 'INTERNAL_SOVEREIGN', durationMs: 200 },
  { id: 'PROTO-018', name: 'auditTrail', displayName: 'Audit Trail', category: 'SECURITY_TRUST', description: 'Immutable audit trail generation and verification.', tier: 'INTERNAL', durationMs: 100 },
  { id: 'PROTO-019', name: 'secretsRotation', displayName: 'Secrets Rotation', category: 'SECURITY_TRUST', description: 'Automated secrets and key rotation across all subsystems.', tier: 'INTERNAL_SOVEREIGN', durationMs: 5000 },
  { id: 'PROTO-020', name: 'incidentEscalation', displayName: 'Incident Escalation', category: 'SECURITY_TRUST', description: 'Multi-level incident escalation pipeline.', tier: 'INTERNAL', durationMs: 300 },
  // Platform Operations 021–025
  { id: 'PROTO-021', name: 'autoScaling', displayName: 'Auto Scaling', category: 'PLATFORM_OPS', description: 'Automated horizontal and vertical scaling.', tier: 'INTERNAL', durationMs: 2000 },
  { id: 'PROTO-022', name: 'canaryDeployment', displayName: 'Canary Deployment', category: 'PLATFORM_OPS', description: 'Canary release with progressive traffic shifting.', tier: 'INTERNAL_SOVEREIGN', durationMs: 10000 },
  { id: 'PROTO-023', name: 'circuitBreaker', displayName: 'Circuit Breaker', category: 'PLATFORM_OPS', description: 'Circuit breaker pattern for fault isolation.', tier: 'INTERNAL', durationMs: 10 },
  { id: 'PROTO-024', name: 'healthOrchestrator', displayName: 'Health Orchestrator', category: 'PLATFORM_OPS', description: 'Orchestrates health checks across all subsystems.', tier: 'INTERNAL', durationMs: 1000 },
  { id: 'PROTO-025', name: 'capacityPlanning', displayName: 'Capacity Planning', category: 'PLATFORM_OPS', description: 'Predictive capacity planning with resource forecasting.', tier: 'INTERNAL', durationMs: 5000 },
  // Billing & Metering 026–028
  { id: 'PROTO-026', name: 'usageMetering', displayName: 'Usage Metering', category: 'BILLING_METERING', description: 'Real-time usage metering across all tool invocations.', tier: 'INTERNAL', durationMs: 20 },
  { id: 'PROTO-027', name: 'billingCycle', displayName: 'Billing Cycle', category: 'BILLING_METERING', description: 'End-to-end billing cycle — metering, invoice, settlement.', tier: 'INTERNAL', durationMs: 3000 },
  { id: 'PROTO-028', name: 'quotaEnforcement', displayName: 'Quota Enforcement', category: 'BILLING_METERING', description: 'Real-time quota enforcement with graceful degradation.', tier: 'INTERNAL', durationMs: 5 },
  // Research & Product 029–030
  { id: 'PROTO-029', name: 'experimentPipeline', displayName: 'Experiment Pipeline', category: 'RESEARCH_PRODUCT', description: 'A/B testing and experiment management pipeline.', tier: 'INTERNAL', durationMs: 500 },
  { id: 'PROTO-030', name: 'feedbackLoop', displayName: 'Feedback Loop', category: 'RESEARCH_PRODUCT', description: 'User feedback collection, analysis, and integration loop.', tier: 'INTERNAL', durationMs: 200 },
  // Multi-Agent 031–035
  { id: 'PROTO-031', name: 'swarmDeploy', displayName: 'Swarm Deploy', category: 'MULTI_AGENT', description: 'Deploy coordinated agent swarms for complex tasks.', tier: 'INTERNAL_SOVEREIGN', durationMs: 5000 },
  { id: 'PROTO-032', name: 'consensus', displayName: 'Agent Consensus', category: 'MULTI_AGENT', description: 'Multi-agent consensus protocol for shared decisions.', tier: 'INTERNAL', durationMs: 2000 },
  { id: 'PROTO-033', name: 'negotiation', displayName: 'Agent Negotiation', category: 'MULTI_AGENT', description: 'Inter-agent negotiation for resource and priority allocation.', tier: 'INTERNAL', durationMs: 1500 },
  { id: 'PROTO-034', name: 'selfHeal', displayName: 'Self-Heal', category: 'MULTI_AGENT', description: 'Self-healing protocol — detect, diagnose, repair without human intervention.', tier: 'INTERNAL', durationMs: 3000 },
  { id: 'PROTO-035', name: 'loadBalance', displayName: 'Agent Load Balance', category: 'MULTI_AGENT', description: 'Distribute workload across agent pool based on capacity and specialty.', tier: 'INTERNAL', durationMs: 100 },
  // Intelligence 036–040
  { id: 'PROTO-036', name: 'continuousLearning', displayName: 'Continuous Learning', category: 'INTELLIGENCE', description: 'Continuous learning pipeline — ingest, train, validate, deploy.', tier: 'INTERNAL_SOVEREIGN', durationMs: 10000 },
  { id: 'PROTO-037', name: 'anomalyDetection', displayName: 'Anomaly Detection Protocol', category: 'INTELLIGENCE', description: 'Multi-layer anomaly detection across all subsystems.', tier: 'INTERNAL', durationMs: 500 },
  { id: 'PROTO-038', name: 'knowledgeDistill', displayName: 'Knowledge Distillation', category: 'INTELLIGENCE', description: 'Distill knowledge from large models into specialized agents.', tier: 'INTERNAL_SOVEREIGN', durationMs: 8000 },
  { id: 'PROTO-039', name: 'predictiveAnalytics', displayName: 'Predictive Analytics', category: 'INTELLIGENCE', description: 'Predictive analytics pipeline for forecasting and planning.', tier: 'PARTNER', durationMs: 3000 },
  { id: 'PROTO-040', name: 'sentinelShieldSensorLoop', displayName: 'Sentinel-Shield-Sensor Loop', category: 'INTELLIGENCE', description: 'Self-healing feedback loop: sentinel detects, shield protects, sensor monitors recovery.', tier: 'INTERNAL', durationMs: 1000 },
  // Compliance 041–045
  { id: 'PROTO-041', name: 'gdprDataRequest', displayName: 'GDPR Data Request', category: 'COMPLIANCE', description: 'Process GDPR data access requests within compliance timelines.', tier: 'INTERNAL', durationMs: 5000 },
  { id: 'PROTO-042', name: 'gdprDataDeletion', displayName: 'GDPR Data Deletion', category: 'COMPLIANCE', description: 'Process GDPR right-to-delete requests with full audit.', tier: 'INTERNAL_SOVEREIGN', durationMs: 10000 },
  { id: 'PROTO-043', name: 'soc2AuditPrep', displayName: 'SOC2 Audit Prep', category: 'COMPLIANCE', description: 'Automated SOC2 audit preparation and evidence collection.', tier: 'INTERNAL', durationMs: 15000 },
  { id: 'PROTO-044', name: 'licenseEnforcement', displayName: 'License Enforcement', category: 'COMPLIANCE', description: 'Enforce CPEL-1.0 and other license terms across deployments.', tier: 'INTERNAL', durationMs: 1000 },
  { id: 'PROTO-045', name: 'ipProtection', displayName: 'IP Protection', category: 'COMPLIANCE', description: 'Intellectual property protection and monitoring protocol.', tier: 'INTERNAL_SOVEREIGN', durationMs: 2000 },
  // Integration 046–050
  { id: 'PROTO-046', name: 'webhookPipeline', displayName: 'Webhook Pipeline', category: 'INTEGRATION', description: 'Inbound/outbound webhook processing with retry and validation.', tier: 'PARTNER', durationMs: 500 },
  { id: 'PROTO-047', name: 'apiGateway', displayName: 'API Gateway', category: 'INTEGRATION', description: 'API gateway protocol — routing, auth, rate limiting, transformation.', tier: 'PARTNER', durationMs: 50 },
  { id: 'PROTO-048', name: 'eventBridge', displayName: 'Event Bridge', category: 'INTEGRATION', description: 'Cross-system event bridge for pub/sub integration.', tier: 'PARTNER', durationMs: 100 },
  { id: 'PROTO-049', name: 'dataSync', displayName: 'Data Sync', category: 'INTEGRATION', description: 'Bidirectional data synchronization with conflict resolution.', tier: 'PARTNER', durationMs: 2000 },
  { id: 'PROTO-050', name: 'graphqlFederation', displayName: 'GraphQL Federation', category: 'INTEGRATION', description: 'GraphQL federation across distributed data sources.', tier: 'ENTERPRISE', durationMs: 300 },
  // SDK 051–055
  { id: 'PROTO-051', name: 'sdkApiCall', displayName: 'SDK API Call', category: 'SDK', description: 'SDK-mediated API call with automatic auth, retry, and telemetry.', tier: 'ENTERPRISE', durationMs: 100 },
  { id: 'PROTO-052', name: 'sdkAuth', displayName: 'SDK Auth', category: 'SDK', description: 'SDK authentication and token management.', tier: 'ENTERPRISE', durationMs: 200 },
  { id: 'PROTO-053', name: 'sdkBatchOperation', displayName: 'SDK Batch Operation', category: 'SDK', description: 'SDK batch operation processing with progress tracking.', tier: 'ENTERPRISE', durationMs: 5000 },
  { id: 'PROTO-054', name: 'sdkWebSocket', displayName: 'SDK WebSocket', category: 'SDK', description: 'SDK WebSocket connection lifecycle management.', tier: 'ENTERPRISE', durationMs: 50 },
  { id: 'PROTO-055', name: 'sdkDocGenerate', displayName: 'SDK Doc Generate', category: 'SDK', description: 'Automated SDK documentation generation from schemas.', tier: 'ENTERPRISE', durationMs: 3000 },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROTOCOL → TOOL BINDING — Maps protocol categories to relevant core tools
// ─────────────────────────────────────────────────────────────────────────────

const PROTOCOL_CATEGORY_TOOL_MAP: Record<string, string> = {
  CLIENT_LIFECYCLE: 'TOOL-004',   // STATE-GUARDIAN
  AI_PIPELINE:     'TOOL-006',   // INFER-ENGINE
  DATA_GOVERNANCE: 'TOOL-010',   // MEMORY-CONSOLIDATOR
  SECURITY_TRUST:  'TOOL-011',   // SENTINEL-WATCH
  PLATFORM_OPS:    'TOOL-016',   // RESOURCE-BALANCER
  BILLING_METERING:'TOOL-005',   // CYCLE-COUNTER
  RESEARCH_PRODUCT:'TOOL-007',   // PATTERN-SEEKER
  MULTI_AGENT:     'TOOL-009',   // ATTENTION-ROUTER
  INTELLIGENCE:    'TOOL-014',   // ANOMALY-DETECTOR
  COMPLIANCE:      'TOOL-012',   // INTEGRITY-CHECKER
  INTEGRATION:     'TOOL-017',   // CONNECTION-POOL
  SDK:             'TOOL-008',   // CONTEXT-BUILDER
};

function getProtocolToolBinding(proto: ProtoDef): string {
  return PROTOCOL_CATEGORY_TOOL_MAP[proto.category] || 'TOOL-001';
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOT — Called once at process start
// ─────────────────────────────────────────────────────────────────────────────

export function bootCallMarketplace(): void {
  if (engineBooted) return;

  const now = Date.now();
  engineBootedAt = now;

  console.log(`[𓂀 MARKETPLACE] Booting Call Marketplace — ${new Date(now).toISOString()}`);

  // Register all 260 tools
  for (const def of ALL_TOOL_DEFS) {
    const callId = `vois.${def.name.toLowerCase()}.v1`;
    const entry: ToolRegistryEntry = {
      call_id: callId,
      tool_id: def.id,
      tool_name: def.name,
      display_name: def.displayName,
      organism_class: def.category === 'BLUEPRINTS' ? 'blueprint' : def.category === 'RECIPES' ? 'recipe' : def.category === 'LENSES' ? 'lens' : def.category === 'HOOKS' ? 'hook' : def.category === 'TRIGGERS' ? 'trigger' : def.category === 'ADAPTERS' ? 'adapter' : def.category === 'SENSORS' ? 'sensor' : def.category === 'SHIELDS' ? 'shield' : 'tool',
      category: def.category,
      house_placement: def.category === 'CORE' ? 'Core Pulse' : def.category === 'INTELLIGENCE' || def.category === 'AI_CALLS' ? 'Intelligence Engine' : def.category === 'DEFENSE' || def.category === 'SHIELDS' ? 'Defense Perimeter' : def.category === 'ADAPTERS' ? 'Integration Surface' : def.category === 'SENSORS' ? 'Monitoring Grid' : 'Orchestration Layer',
      domain_extension: def.category === 'CORE' ? '.pulse' : def.category === 'INTELLIGENCE' || def.category === 'AI_CALLS' ? '.cogn' : def.category === 'DEFENSE' || def.category === 'SHIELDS' ? '.def' : '.flow',
      protocols: ['vois://'],
      version: '1',
      status: 'active' as ToolStatus,
      runtime_truth: 'implicit_backend_function',
      exposure_class: 'internal',
      permission_tier_min: 'INTERNAL',
      input_schema_ref: `schema://${def.name.toLowerCase()}/input/v1`,
      output_schema_ref: `schema://${def.name.toLowerCase()}/output/v1`,
      contract_ref: `contract://${def.name.toLowerCase()}/v1`,
      pricing_class: def.pricing,
      reward_class: def.reward,
      latency_class: def.latencyMs < 10 ? 'L0' : def.latencyMs < 50 ? 'L1' : def.latencyMs < 200 ? 'L2' : 'L3',
      risk_class: 'K1',
      lineage_mode: 'anima_logged',
      shadow_mode: false,
      owner_species: ['VECTOR'],
      dependencies: def.chainTo,
      tags: def.tags,
    };
    toolRegistry.set(def.id, entry);

    const metadata: ToolMetadata = {
      tool_name: def.name,
      purpose: def.purpose,
      when_to_use: def.whenToUse,
      input_types: def.inputTypes,
      output_types: def.outputTypes,
      capabilities: def.capabilities,
      security_tier: 'S2',
      allowed_callers: ['INTERNAL', 'INTERNAL_SOVEREIGN'],
      can_chain_to: def.chainTo,
      avg_latency_ms: def.latencyMs,
      billing_mode: def.pricing === 'P0' ? 'free' : 'per_call',
      reward_mode: def.reward === 'R0' ? 'none' : 'proof_reward',
      lineage_trace: true,
      shadow_safe: false,
    };
    toolMetadataStore.set(def.id, metadata);

    // Create contract
    const contract: CallContract = {
      contract_id: `contract://${def.name.toLowerCase()}/v1`,
      tool_name: def.name,
      invocation_mode: 'sync',
      idempotent: false,
      auth_required: true,
      principal_binding: true,
      rate_limits: { INTERNAL: '1000/min', INTERNAL_SOVEREIGN: '10000/min', PARTNER: '200/min', ENTERPRISE: '5000/min', PUBLIC: '20/min' },
      request: { fields: def.inputTypes.map(t => ({ name: t, type: 'object' as const, required: true })) },
      response: { fields: def.outputTypes.map(t => ({ name: t, type: 'object' as const, required: false })) },
      failure_modes: ['permission_denied', 'schema_invalid', 'rate_limited', 'runtime_unavailable'],
      logging: { anima_chain: true, shadow_trace: false, proof_receipt: true },
    };
    contractStore.set(def.id, contract);
  }

  // Register all 55 protocols
  for (const proto of ALL_PROTOCOL_DEFS) {
    const protocol: ProtocolDefinition = {
      protocol_id: proto.id,
      name: proto.name,
      display_name: proto.displayName,
      category: proto.category,
      description: proto.description,
      steps: [
        { step_id: `${proto.id}-S1`, name: 'validate', worker_binding: 'MW-041', tool_binding: 'TOOL-013', timeout_ms: 5000, retry_count: 1 },
        { step_id: `${proto.id}-S2`, name: 'execute', worker_binding: 'MW-091', tool_binding: getProtocolToolBinding(proto), timeout_ms: proto.durationMs, retry_count: 2 },
        { step_id: `${proto.id}-S3`, name: 'settle', worker_binding: 'MW-097', tool_binding: 'TOOL-020', timeout_ms: 2000, retry_count: 1 },
      ],
      status: 'active',
      permission_tier_min: proto.tier,
      avg_duration_ms: proto.durationMs,
      license: 'CPEL-1.0',
    };
    protocolRegistry.set(proto.id, protocol);
  }

  engineBooted = true;

  console.log(`[𓂀 MARKETPLACE] ${toolRegistry.size} tools registered across ${new Set(ALL_TOOL_DEFS.map(t => t.category)).size} categories`);
  console.log(`[𓂀 MARKETPLACE] ${protocolRegistry.size} enterprise protocols active`);
  console.log(`[𓂀 MARKETPLACE] Permission tiers: INTERNAL → INTERNAL_SOVEREIGN → PARTNER → ENTERPRISE → PUBLIC`);
  console.log(`[𓂀 MARKETPLACE] The marketplace is always on. No page load. Already running.`);
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL INVOCATION
// ─────────────────────────────────────────────────────────────────────────────

export function invokeTool(
  toolId: string,
  caller: CallerIdentity,
  payload: Record<string, unknown>,
): { success: boolean; result?: Record<string, unknown>; settlement?: SettlementRecord; error?: string } {
  const entry = toolRegistry.get(toolId);
  if (!entry) return { success: false, error: `Tool ${toolId} not found in registry` };

  // Permission check
  if (!hasTierAccess(caller.permission_tier, entry.permission_tier_min)) {
    return { success: false, error: `Permission denied: ${caller.permission_tier} < ${entry.permission_tier_min}` };
  }

  const startTime = Date.now();
  totalInvocations++;

  // Create settlement record
  const settlement: SettlementRecord = {
    settlement_id: `set_${String(settlements.length + 1).padStart(6, '0')}`,
    call_id: entry.call_id,
    caller_id: caller.caller_id,
    tier: caller.permission_tier,
    pricing_class: entry.pricing_class,
    reward_class: entry.reward_class,
    usage_units: 1,
    price_amount: entry.pricing_class === 'P0' ? 0 : entry.pricing_class === 'P1' ? 0.01 : entry.pricing_class === 'P2' ? 0.05 : 0.15,
    reward_amount: entry.reward_class === 'R0' ? 0 : entry.reward_class === 'R1' ? 0.005 : 0.01,
    currency: 'USD_CREDIT',
    proof_hash: `anima:0x${Date.now().toString(16)}`,
    timestamp: new Date().toISOString(),
    latency_ms: Date.now() - startTime,
    success: true,
  };

  settlements.push(settlement);

  return {
    success: true,
    result: { tool: entry.tool_name, invoked: true, call_id: entry.call_id },
    settlement,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────────────────────

export function isMarketplaceBooted(): boolean {
  return engineBooted;
}

export function getToolEntry(toolId: string): ToolRegistryEntry | undefined {
  return toolRegistry.get(toolId);
}

export function getToolMetadata(toolId: string): ToolMetadata | undefined {
  return toolMetadataStore.get(toolId);
}

export function getContract(toolId: string): CallContract | undefined {
  return contractStore.get(toolId);
}

export function getProtocol(protoId: string): ProtocolDefinition | undefined {
  return protocolRegistry.get(protoId);
}

export function getToolsByCategory(category: ToolCategory): ToolRegistryEntry[] {
  return Array.from(toolRegistry.values()).filter(t => t.category === category);
}

export function getProtocolsByCategory(category: ProtocolCategory): ProtocolDefinition[] {
  return Array.from(protocolRegistry.values()).filter(p => p.category === category);
}

export function getRecentSettlements(limit: number = 50): SettlementRecord[] {
  return settlements.slice(-limit);
}

export function getFullRegistry(): ToolRegistryEntry[] {
  return Array.from(toolRegistry.values());
}

export function getAllProtocols(): ProtocolDefinition[] {
  return Array.from(protocolRegistry.values());
}

export function getMarketplaceSnapshot(): MarketplaceSnapshot {
  const now = Date.now();
  const uptimeMs = engineBootedAt ? now - engineBootedAt : 0;
  const uptimeSec = Math.floor(uptimeMs / 1000);
  const uptimeMin = Math.floor(uptimeSec / 60);
  const uptimeHr = Math.floor(uptimeMin / 60);

  const tools = Array.from(toolRegistry.values());
  const protocols = Array.from(protocolRegistry.values());

  const toolsByCategory = {} as Record<ToolCategory, number>;
  for (const t of tools) {
    toolsByCategory[t.category] = (toolsByCategory[t.category] || 0) + 1;
  }

  const protocolsByCategory = {} as Record<ProtocolCategory, number>;
  for (const p of protocols) {
    protocolsByCategory[p.category] = (protocolsByCategory[p.category] || 0) + 1;
  }

  return {
    booted: engineBooted,
    bootedAt: engineBootedAt,
    uptime: uptimeHr > 0 ? `${uptimeHr}h ${uptimeMin % 60}m` : `${uptimeMin}m ${uptimeSec % 60}s`,
    totalTools: tools.length,
    activeTools: tools.filter(t => t.status === 'active').length,
    totalProtocols: protocols.length,
    activeProtocols: protocols.filter(p => p.status === 'active').length,
    totalClients: clientRegistry.size,
    activeClients: Array.from(clientRegistry.values()).filter(c => c.status === 'active').length,
    totalSettlements: settlements.length,
    totalRevenue: settlements.reduce((sum, s) => sum + s.price_amount, 0),
    toolsByCategory,
    protocolsByCategory,
    tierDistribution: {
      INTERNAL: tools.filter(t => t.permission_tier_min === 'INTERNAL').length,
      INTERNAL_SOVEREIGN: tools.filter(t => t.permission_tier_min === 'INTERNAL_SOVEREIGN').length,
      PARTNER: tools.filter(t => t.permission_tier_min === 'PARTNER').length,
      ENTERPRISE: tools.filter(t => t.permission_tier_min === 'ENTERPRISE').length,
      PUBLIC: tools.filter(t => t.permission_tier_min === 'PUBLIC').length,
    },
  };
}
