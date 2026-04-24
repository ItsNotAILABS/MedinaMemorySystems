// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 CALL MARKETPLACE TYPE SYSTEM 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * "The marketplace has five primary objects: Tool, Call Contract,
 *  Agent/Caller, Settlement Record, and Exposure Layer."
 *
 * Complete type definitions for the VOIS-addressable Call Marketplace.
 * 260 tools across 12 categories, 110 enterprise protocols, 5 permission
 * tiers, 6 pricing classes, 5 reward classes, and full settlement/proof.
 *
 * This is NOT a generic API directory. It is the naming, schema, permission,
 * and routing surface for organism-native operations. Internal tools become
 * market tools only after registry + schema + permission + proof are defined.
 *
 * TOOL CATEGORIES (260 tools):
 *   Core Tools        TOOL-001–020   20   Always-running core pulse tools
 *   Intelligence      TOOL-021–040   20   AI/cognitive tools
 *   Defense           TOOL-041–060   20   Security & integrity tools
 *   AI Calls          TOOL-061–100   40   Direct AI invocations
 *   Blueprints        TOOL-101–120   20   Reusable architecture templates
 *   Recipes           TOOL-121–140   20   Multi-step workflow automations
 *   Lenses            TOOL-141–160   20   Data perspective/view tools
 *   Hooks             TOOL-161–180   20   Event-driven automation triggers
 *   Triggers          TOOL-181–200   20   Condition-based auto-execution
 *   Adapters          TOOL-201–220   20   Cross-system connectors
 *   Sensors           TOOL-221–240   20   Continuous monitoring probes
 *   Shields           TOOL-241–260   20   Protection & safety mechanisms
 *
 * PROTOCOL CATEGORIES (110 protocols):
 *   Client Lifecycle  001–005         5
 *   AI Pipeline       006–010         5
 *   Data Governance   011–015         5
 *   Security & Trust  016–020         5
 *   Platform Ops      021–025         5
 *   Billing & Meter   026–028         3
 *   Research & Prod   029–030         2
 *   Multi-Agent       031–035         5
 *   Intelligence      036–040         5
 *   Compliance        041–045         5
 *   Integration       046–050         5
 *   SDK               051–055         5
 *   Memory Ops        056–060         5
 *   Governance        061–065         5
 *   Observability     066–070         5
 *   Developer Exp     071–075         5
 *   Edge Computing    076–080         5
 *   Marketplace Ops   081–085         5
 *   Shadow Ops        086–090         5
 *   Organism Lifecycle 091–095        5
 *   Quantum Ops       096–100         5
 *   Cross-Domain      101–105         5
 *   Sovereign Ops     106–110         5
 *
 * φ = 1.618033988749895
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// A. TOOL — A callable operation
// ─────────────────────────────────────────────────────────────────────────────

export type ToolCategory =
  | 'CORE'
  | 'INTELLIGENCE'
  | 'DEFENSE'
  | 'AI_CALLS'
  | 'BLUEPRINTS'
  | 'RECIPES'
  | 'LENSES'
  | 'HOOKS'
  | 'TRIGGERS'
  | 'ADAPTERS'
  | 'SENSORS'
  | 'SHIELDS';

export type ToolStatus = 'registered' | 'active' | 'deprecated' | 'suspended' | 'shadow_only';

export type ExposureClass =
  | 'internal'
  | 'internal_sovereign'
  | 'partner'
  | 'enterprise'
  | 'public'
  | 'shadow';

export type PermissionTier =
  | 'INTERNAL'
  | 'INTERNAL_SOVEREIGN'
  | 'PARTNER'
  | 'ENTERPRISE'
  | 'PUBLIC';

export type PricingClass = 'P0' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
export type RewardClass = 'R0' | 'R1' | 'R2' | 'R3' | 'R4';
export type LatencyClass = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
export type RiskClass = 'K0' | 'K1' | 'K2' | 'K3' | 'K4';
export type SecurityTier = 'S0' | 'S1' | 'S2' | 'S3' | 'S4';
export type LineageMode = 'none' | 'anima_logged' | 'full_trace' | 'proof_sealed';

export type DomainExtension =
  | '.pulse'
  | '.cogn'
  | '.def'
  | '.ai'
  | '.arch'
  | '.flow'
  | '.lens'
  | '.hook'
  | '.trig'
  | '.adapt'
  | '.sense'
  | '.shield';

export type ProtocolScheme =
  | 'vois://'
  | 'cogn://'
  | 'nex://'
  | 'flux://'
  | 'def://'
  | 'pulse://'
  | 'anima://';

export type OrganismClass = 'tool' | 'blueprint' | 'recipe' | 'lens' | 'hook' | 'trigger' | 'adapter' | 'sensor' | 'shield';

export type HousePlacement =
  | 'Core Pulse'
  | 'Bridge and Translation'
  | 'Intelligence Engine'
  | 'Defense Perimeter'
  | 'Orchestration Layer'
  | 'Data Pipeline'
  | 'Integration Surface'
  | 'Monitoring Grid'
  | 'Protection Shell';

/** Full registry entry for a marketplace tool */
export interface ToolRegistryEntry {
  call_id: string;                    // e.g. "vois.attention-router.v1"
  tool_id: string;                    // e.g. "TOOL-009"
  tool_name: string;                  // e.g. "ATTENTION-ROUTER"
  display_name: string;               // e.g. "Attention Router"
  organism_class: OrganismClass;
  category: ToolCategory;
  house_placement: HousePlacement;
  domain_extension: DomainExtension;
  protocols: ProtocolScheme[];
  version: string;
  status: ToolStatus;
  runtime_truth: string;              // e.g. "implicit_backend_function"
  exposure_class: ExposureClass;
  permission_tier_min: PermissionTier;
  input_schema_ref: string;           // e.g. "schema://attention-router/input/v1"
  output_schema_ref: string;
  contract_ref: string;               // e.g. "contract://attention-router/v1"
  pricing_class: PricingClass;
  reward_class: RewardClass;
  latency_class: LatencyClass;
  risk_class: RiskClass;
  lineage_mode: LineageMode;
  shadow_mode: boolean;
  owner_species: string[];            // e.g. ["VECTOR", "LUMEN"]
  dependencies: string[];             // other tool names
  tags: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL METADATA — Machine-readable metadata block
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolMetadata {
  tool_name: string;
  purpose: string;
  when_to_use: string[];
  input_types: string[];
  output_types: string[];
  capabilities: string[];
  security_tier: SecurityTier;
  allowed_callers: PermissionTier[];
  can_chain_to: string[];              // other tool names
  avg_latency_ms: number;
  billing_mode: 'free' | 'per_call' | 'per_unit' | 'subscription' | 'contract';
  reward_mode: 'none' | 'proof_reward' | 'contribution_reward' | 'discovery_reward' | 'ecosystem_reward';
  lineage_trace: boolean;
  shadow_safe: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// B. CALL CONTRACT — Machine-readable invocation definition
// ─────────────────────────────────────────────────────────────────────────────

export type InvocationMode = 'sync' | 'async' | 'stream';

export interface ContractField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description?: string;
}

export type FailureMode =
  | 'permission_denied'
  | 'schema_invalid'
  | 'rate_limited'
  | 'runtime_unavailable'
  | 'shadow_redaction_applied'
  | 'dependency_failed'
  | 'timeout'
  | 'circuit_broken';

export interface CallContract {
  contract_id: string;                 // e.g. "contract://memory-consolidator/v1"
  tool_name: string;
  invocation_mode: InvocationMode;
  idempotent: boolean;
  auth_required: boolean;
  principal_binding: boolean;
  rate_limits: Record<PermissionTier, string>;
  request: { fields: ContractField[] };
  response: { fields: ContractField[] };
  failure_modes: FailureMode[];
  logging: {
    anima_chain: boolean;
    shadow_trace: boolean;
    proof_receipt: boolean;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// C. AGENT / CALLER — The invoking entity
// ─────────────────────────────────────────────────────────────────────────────

export type AgentType =
  | 'internal'
  | 'internal_sovereign'
  | 'partner'
  | 'enterprise'
  | 'public';

export interface CallerIdentity {
  caller_id: string;
  agent_type: AgentType;
  permission_tier: PermissionTier;
  organism_origin?: string;
  session_id?: string;
  trust_score: number;               // 0–1
}

// ─────────────────────────────────────────────────────────────────────────────
// D. SETTLEMENT RECORD — Usage, billing, reward, proof
// ─────────────────────────────────────────────────────────────────────────────

export type SettlementCurrency = 'USD_CREDIT' | 'ANIMA_TOKEN' | 'PHI_CREDIT' | 'FREE';

export interface SettlementRecord {
  settlement_id: string;
  call_id: string;
  caller_id: string;
  tier: PermissionTier;
  pricing_class: PricingClass;
  reward_class: RewardClass;
  usage_units: number;
  price_amount: number;
  reward_amount: number;
  currency: SettlementCurrency;
  proof_hash: string;                 // e.g. "anima:0xabc123"
  timestamp: string;
  latency_ms: number;
  success: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// E. EXPOSURE LAYER — Route through which the call is reached
// ─────────────────────────────────────────────────────────────────────────────

export type ExposureRoute =
  | 'direct_internal'
  | 'sdk'
  | 'protocol_endpoint'
  | 'shadow_clone'
  | 'public_face';

export interface ExposureConfig {
  route: ExposureRoute;
  rate_limit: string;
  redaction_level: 'none' | 'partial' | 'full';
  shadow_safe: boolean;
  auth_method: 'none' | 'token' | 'principal' | 'sovereign_key';
}

// ─────────────────────────────────────────────────────────────────────────────
// PROTOCOL DEFINITIONS — 55 Enterprise Protocols
// ─────────────────────────────────────────────────────────────────────────────

export type ProtocolCategory =
  | 'CLIENT_LIFECYCLE'
  | 'AI_PIPELINE'
  | 'DATA_GOVERNANCE'
  | 'SECURITY_TRUST'
  | 'PLATFORM_OPS'
  | 'BILLING_METERING'
  | 'RESEARCH_PRODUCT'
  | 'MULTI_AGENT'
  | 'INTELLIGENCE'
  | 'COMPLIANCE'
  | 'INTEGRATION'
  | 'SDK'
  | 'MEMORY_OPS'
  | 'GOVERNANCE'
  | 'OBSERVABILITY'
  | 'DEVELOPER_EXP'
  | 'EDGE_COMPUTING'
  | 'MARKETPLACE_OPS'
  | 'SHADOW_OPS'
  | 'ORGANISM_LIFECYCLE'
  | 'QUANTUM_OPS'
  | 'CROSS_DOMAIN'
  | 'SOVEREIGN_OPS';

export type ProtocolStatus = 'active' | 'testing' | 'deprecated' | 'planned';

export interface ProtocolStep {
  step_id: string;
  name: string;
  worker_binding: string;            // Worker ID (e.g. "MW-041")
  tool_binding: string;              // Tool ID (e.g. "TOOL-016")
  timeout_ms: number;
  retry_count: number;
  fallback_step?: string;
}

export interface ProtocolDefinition {
  protocol_id: string;               // e.g. "PROTO-001"
  name: string;                      // e.g. "clientOnboard"
  display_name: string;
  category: ProtocolCategory;
  description: string;
  steps: ProtocolStep[];
  status: ProtocolStatus;
  permission_tier_min: PermissionTier;
  avg_duration_ms: number;
  license: string;                   // e.g. "CPEL-1.0"
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT MANAGEMENT — Multi-tenant (1,597 clients = F17)
// ─────────────────────────────────────────────────────────────────────────────

export type ClientTier = 'starter' | 'standard' | 'professional' | 'enterprise' | 'sovereign';

export interface ClientRecord {
  client_id: string;
  name: string;
  tier: ClientTier;
  status: 'active' | 'suspended' | 'migrating' | 'offboarded';
  quota: {
    calls_per_minute: number;
    calls_per_day: number;
    concurrent_protocols: number;
    storage_mb: number;
  };
  health_score: number;              // 0–100
  usage: {
    total_calls: number;
    total_settlements: number;
    total_spent: number;
    currency: SettlementCurrency;
  };
  created_at: string;
  last_active: string;
}

export const CLIENT_TIER_PRICING: Record<ClientTier, { monthly_usd: number; calls_per_min: number }> = {
  starter:      { monthly_usd: 99,    calls_per_min: 20 },
  standard:     { monthly_usd: 299,   calls_per_min: 100 },
  professional: { monthly_usd: 999,   calls_per_min: 500 },
  enterprise:   { monthly_usd: 4999,  calls_per_min: 5000 },
  sovereign:    { monthly_usd: 0,     calls_per_min: 100000 }, // custom pricing
};

// ─────────────────────────────────────────────────────────────────────────────
// MARKETPLACE QUERY/CALL API TYPES
// ─────────────────────────────────────────────────────────────────────────────

/** Read-only queries */
export type MarketplaceQuery =
  | { action: 'queryTool'; tool_id: string }
  | { action: 'queryToolsByCategory'; category: ToolCategory }
  | { action: 'queryProtocol'; protocol_id: string }
  | { action: 'queryProtocolsByCategory'; category: ProtocolCategory }
  | { action: 'queryClient'; client_id: string }
  | { action: 'queryClientUsage'; client_id: string }
  | { action: 'queryCapacity' }
  | { action: 'queryHealth' }
  | { action: 'querySettlements'; limit?: number }
  | { action: 'queryFullRegistry' };

/** Mutating calls */
export type MarketplaceCall =
  | { action: 'invokeTool'; tool_id: string; caller: CallerIdentity; payload: Record<string, unknown> }
  | { action: 'executeProtocol'; protocol_id: string; caller: CallerIdentity; params: Record<string, unknown> }
  | { action: 'suspendClient'; client_id: string }
  | { action: 'reactivateClient'; client_id: string }
  | { action: 'registerTool'; entry: ToolRegistryEntry; metadata: ToolMetadata; contract: CallContract };

// ─────────────────────────────────────────────────────────────────────────────
// MARKETPLACE STATE SNAPSHOT
// ─────────────────────────────────────────────────────────────────────────────

export interface MarketplaceSnapshot {
  booted: boolean;
  bootedAt: number;
  uptime: string;
  totalTools: number;
  activeTools: number;
  totalProtocols: number;
  activeProtocols: number;
  totalClients: number;
  activeClients: number;
  totalSettlements: number;
  totalRevenue: number;
  toolsByCategory: Record<ToolCategory, number>;
  protocolsByCategory: Record<ProtocolCategory, number>;
  tierDistribution: Record<PermissionTier, number>;
}
