/**
 * 𓂀 NEXUS EXPANDED AGENTS: 100+ AGENTS WITH MULTI-TIER STRUCTURE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THE VISION:
 * 
 * Original 40 agents → Find primitive fundamentals → Multi-tier expansion
 * Each model has 5 agents, each agent has 15-30 uses
 * 3 layers above original definition
 * 
 * @version 1.1.2 (Fibonacci)
 * @designation (NEXUS-EXPANDED-AGENTS)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMITIVE FUNDAMENTALS
// ═══════════════════════════════════════════════════════════════════════════════

export interface PrimitiveFundamental {
  id: string;
  name: string;
  designation: string;
  category: 'PERCEPTION' | 'COGNITION' | 'ACTION' | 'MEMORY' | 'COMMUNICATION';
  description: string;
  frequency: number;
  isFoundational: true;
}

export const PRIMITIVE_FUNDAMENTALS: PrimitiveFundamental[] = [
  // PERCEPTION PRIMITIVES (5)
  { id: 'prim_sense', name: 'SENSE', designation: '(PRIM-SENSE)', category: 'PERCEPTION', description: 'Raw input reception', frequency: 285, isFoundational: true },
  { id: 'prim_detect', name: 'DETECT', designation: '(PRIM-DETECT)', category: 'PERCEPTION', description: 'Pattern detection', frequency: 396, isFoundational: true },
  { id: 'prim_filter', name: 'FILTER', designation: '(PRIM-FILTER)', category: 'PERCEPTION', description: 'Signal filtering', frequency: 417, isFoundational: true },
  { id: 'prim_focus', name: 'FOCUS', designation: '(PRIM-FOCUS)', category: 'PERCEPTION', description: 'Attention focusing', frequency: 528, isFoundational: true },
  { id: 'prim_perceive', name: 'PERCEIVE', designation: '(PRIM-PERCEIVE)', category: 'PERCEPTION', description: 'Integrated perception', frequency: 639, isFoundational: true },
  
  // COGNITION PRIMITIVES (5)
  { id: 'prim_compare', name: 'COMPARE', designation: '(PRIM-COMPARE)', category: 'COGNITION', description: 'Comparison operation', frequency: 741, isFoundational: true },
  { id: 'prim_decide', name: 'DECIDE', designation: '(PRIM-DECIDE)', category: 'COGNITION', description: 'Decision making', frequency: 852, isFoundational: true },
  { id: 'prim_reason', name: 'REASON', designation: '(PRIM-REASON)', category: 'COGNITION', description: 'Logical reasoning', frequency: 963, isFoundational: true },
  { id: 'prim_predict', name: 'PREDICT', designation: '(PRIM-PREDICT)', category: 'COGNITION', description: 'Future prediction', frequency: 852, isFoundational: true },
  { id: 'prim_learn', name: 'LEARN', designation: '(PRIM-LEARN)', category: 'COGNITION', description: 'Learning from experience', frequency: 963, isFoundational: true },
  
  // ACTION PRIMITIVES (5)
  { id: 'prim_execute', name: 'EXECUTE', designation: '(PRIM-EXECUTE)', category: 'ACTION', description: 'Action execution', frequency: 741, isFoundational: true },
  { id: 'prim_transform', name: 'TRANSFORM', designation: '(PRIM-TRANSFORM)', category: 'ACTION', description: 'Data transformation', frequency: 639, isFoundational: true },
  { id: 'prim_create', name: 'CREATE', designation: '(PRIM-CREATE)', category: 'ACTION', description: 'Creation operation', frequency: 528, isFoundational: true },
  { id: 'prim_modify', name: 'MODIFY', designation: '(PRIM-MODIFY)', category: 'ACTION', description: 'Modification operation', frequency: 417, isFoundational: true },
  { id: 'prim_destroy', name: 'DESTROY', designation: '(PRIM-DESTROY)', category: 'ACTION', description: 'Destruction/cleanup', frequency: 396, isFoundational: true },
  
  // MEMORY PRIMITIVES (5)
  { id: 'prim_store', name: 'STORE', designation: '(PRIM-STORE)', category: 'MEMORY', description: 'Data storage', frequency: 528, isFoundational: true },
  { id: 'prim_retrieve', name: 'RETRIEVE', designation: '(PRIM-RETRIEVE)', category: 'MEMORY', description: 'Data retrieval', frequency: 639, isFoundational: true },
  { id: 'prim_index', name: 'INDEX', designation: '(PRIM-INDEX)', category: 'MEMORY', description: 'Indexing operation', frequency: 741, isFoundational: true },
  { id: 'prim_associate', name: 'ASSOCIATE', designation: '(PRIM-ASSOCIATE)', category: 'MEMORY', description: 'Association creation', frequency: 852, isFoundational: true },
  { id: 'prim_forget', name: 'FORGET', designation: '(PRIM-FORGET)', category: 'MEMORY', description: 'Memory pruning', frequency: 285, isFoundational: true },
  
  // COMMUNICATION PRIMITIVES (5)
  { id: 'prim_send', name: 'SEND', designation: '(PRIM-SEND)', category: 'COMMUNICATION', description: 'Message sending', frequency: 639, isFoundational: true },
  { id: 'prim_receive', name: 'RECEIVE', designation: '(PRIM-RECEIVE)', category: 'COMMUNICATION', description: 'Message receiving', frequency: 528, isFoundational: true },
  { id: 'prim_encode', name: 'ENCODE', designation: '(PRIM-ENCODE)', category: 'COMMUNICATION', description: 'Message encoding', frequency: 741, isFoundational: true },
  { id: 'prim_decode', name: 'DECODE', designation: '(PRIM-DECODE)', category: 'COMMUNICATION', description: 'Message decoding', frequency: 741, isFoundational: true },
  { id: 'prim_sync', name: 'SYNC', designation: '(PRIM-SYNC)', category: 'COMMUNICATION', description: 'Synchronization', frequency: 852, isFoundational: true },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXPANDED AGENT STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

export interface AgentUse {
  id: string;
  name: string;
  description: string;
  primitives: string[];  // Which primitives it uses
  frequency: number;
}

export interface SubAgent {
  id: string;
  name: string;
  designation: string;
  parentAgentId: string;
  level: 1 | 2 | 3 | 4 | 5;  // 5 agents per model
  uses: AgentUse[];          // 15-30 uses per agent
  primitives: string[];
  frequency: number;
}

export interface ExpandedAgent {
  id: string;
  name: string;
  designation: string;
  category: 'INFRASTRUCTURE' | 'DEFENSE' | 'INTELLIGENCE' | 'CORE' | 'TOOLS';
  tier: 'PRIMITIVE' | 'FUNDAMENTAL' | 'COMPOSITE' | 'ORCHESTRATOR';
  subAgents: SubAgent[];      // 5 sub-agents
  primitives: string[];
  frequency: number;
  totalUses: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE 15-30 USES FOR EACH SUB-AGENT
// ═══════════════════════════════════════════════════════════════════════════════

function generateUses(agentName: string, primitives: string[], count: number): AgentUse[] {
  const actions = [
    'Process', 'Analyze', 'Transform', 'Validate', 'Generate', 'Optimize', 'Monitor',
    'Sync', 'Filter', 'Aggregate', 'Distribute', 'Cache', 'Index', 'Query',
    'Route', 'Balance', 'Compress', 'Encrypt', 'Verify', 'Audit', 'Log',
    'Alert', 'Recover', 'Backup', 'Restore', 'Clone', 'Merge', 'Split', 'Join', 'Map'
  ];
  
  const targets = [
    'Data', 'State', 'Events', 'Messages', 'Requests', 'Responses', 'Streams',
    'Buffers', 'Queues', 'Channels', 'Sessions', 'Connections', 'Resources',
    'Tokens', 'Keys', 'Hashes', 'Signatures', 'Certificates', 'Policies', 'Rules'
  ];
  
  const uses: AgentUse[] = [];
  
  for (let i = 0; i < count; i++) {
    const action = actions[i % actions.length];
    const target = targets[i % targets.length];
    
    uses.push({
      id: `use_${agentName.toLowerCase()}_${i + 1}`,
      name: `${action} ${target}`,
      description: `${action} operation on ${target} for ${agentName}`,
      primitives: primitives.slice(0, 3),
      frequency: 528 + (i * 13) % 435,  // Range 528-963
    });
  }
  
  return uses;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE 5 SUB-AGENTS FOR EACH EXPANDED AGENT
// ═══════════════════════════════════════════════════════════════════════════════

function generateSubAgents(
  parentId: string,
  parentName: string,
  primitives: string[]
): SubAgent[] {
  const levels = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON'];
  const subAgents: SubAgent[] = [];
  
  for (let i = 0; i < 5; i++) {
    const levelName = levels[i];
    const useCount = 15 + Math.floor(Math.random() * 16);  // 15-30 uses
    
    subAgents.push({
      id: `sub_${parentId}_${levelName.toLowerCase()}`,
      name: `${parentName}-${levelName}`,
      designation: `(${parentName.substring(0, 4)}-${levelName.substring(0, 1)})`,
      parentAgentId: parentId,
      level: (i + 1) as 1 | 2 | 3 | 4 | 5,
      uses: generateUses(`${parentName}-${levelName}`, primitives, useCount),
      primitives: primitives.slice(0, 5),
      frequency: 528 + i * 87,
    });
  }
  
  return subAgents;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 100+ EXPANDED AGENTS (Organized by Category)
// ═══════════════════════════════════════════════════════════════════════════════

function createExpandedAgent(
  id: string,
  name: string,
  category: ExpandedAgent['category'],
  tier: ExpandedAgent['tier'],
  primitives: string[],
  frequency: number
): ExpandedAgent {
  const subAgents = generateSubAgents(id, name, primitives);
  const totalUses = subAgents.reduce((sum, sa) => sum + sa.uses.length, 0);
  
  return {
    id,
    name,
    designation: `(${name})`,
    category,
    tier,
    subAgents,
    primitives,
    frequency,
    totalUses,
  };
}

// INFRASTRUCTURE AGENTS (25)
const INFRASTRUCTURE_AGENTS: ExpandedAgent[] = [
  createExpandedAgent('inf_router', 'ROUTER', 'INFRASTRUCTURE', 'FUNDAMENTAL', ['prim_send', 'prim_receive', 'prim_decide'], 639),
  createExpandedAgent('inf_balancer', 'BALANCER', 'INFRASTRUCTURE', 'FUNDAMENTAL', ['prim_compare', 'prim_decide', 'prim_execute'], 741),
  createExpandedAgent('inf_scheduler', 'SCHEDULER', 'INFRASTRUCTURE', 'COMPOSITE', ['prim_predict', 'prim_decide', 'prim_execute'], 852),
  createExpandedAgent('inf_allocator', 'ALLOCATOR', 'INFRASTRUCTURE', 'FUNDAMENTAL', ['prim_store', 'prim_retrieve', 'prim_decide'], 639),
  createExpandedAgent('inf_garbage', 'GARBAGE', 'INFRASTRUCTURE', 'PRIMITIVE', ['prim_detect', 'prim_destroy', 'prim_forget'], 396),
  createExpandedAgent('inf_cache', 'CACHE', 'INFRASTRUCTURE', 'FUNDAMENTAL', ['prim_store', 'prim_retrieve', 'prim_index'], 741),
  createExpandedAgent('inf_queue', 'QUEUE', 'INFRASTRUCTURE', 'PRIMITIVE', ['prim_store', 'prim_retrieve', 'prim_execute'], 528),
  createExpandedAgent('inf_pool', 'POOL', 'INFRASTRUCTURE', 'FUNDAMENTAL', ['prim_store', 'prim_retrieve', 'prim_execute'], 639),
  createExpandedAgent('inf_buffer', 'BUFFER', 'INFRASTRUCTURE', 'PRIMITIVE', ['prim_store', 'prim_retrieve'], 417),
  createExpandedAgent('inf_stream', 'STREAM', 'INFRASTRUCTURE', 'COMPOSITE', ['prim_send', 'prim_receive', 'prim_transform'], 741),
  createExpandedAgent('inf_pipe', 'PIPE', 'INFRASTRUCTURE', 'PRIMITIVE', ['prim_send', 'prim_receive'], 528),
  createExpandedAgent('inf_socket', 'SOCKET', 'INFRASTRUCTURE', 'FUNDAMENTAL', ['prim_send', 'prim_receive', 'prim_sync'], 639),
  createExpandedAgent('inf_channel', 'CHANNEL', 'INFRASTRUCTURE', 'COMPOSITE', ['prim_send', 'prim_receive', 'prim_encode'], 741),
  createExpandedAgent('inf_bus', 'BUS', 'INFRASTRUCTURE', 'ORCHESTRATOR', ['prim_send', 'prim_receive', 'prim_sync', 'prim_decide'], 852),
  createExpandedAgent('inf_bridge', 'BRIDGE', 'INFRASTRUCTURE', 'COMPOSITE', ['prim_send', 'prim_receive', 'prim_transform'], 741),
  createExpandedAgent('inf_gateway', 'GATEWAY', 'INFRASTRUCTURE', 'ORCHESTRATOR', ['prim_send', 'prim_receive', 'prim_filter', 'prim_decide'], 852),
  createExpandedAgent('inf_proxy', 'PROXY', 'INFRASTRUCTURE', 'COMPOSITE', ['prim_send', 'prim_receive', 'prim_transform'], 741),
  createExpandedAgent('inf_relay', 'RELAY', 'INFRASTRUCTURE', 'FUNDAMENTAL', ['prim_send', 'prim_receive'], 639),
  createExpandedAgent('inf_hub', 'HUB', 'INFRASTRUCTURE', 'COMPOSITE', ['prim_send', 'prim_receive', 'prim_decide'], 741),
  createExpandedAgent('inf_switch', 'SWITCH', 'INFRASTRUCTURE', 'FUNDAMENTAL', ['prim_detect', 'prim_decide', 'prim_execute'], 639),
  createExpandedAgent('inf_register', 'REGISTER', 'INFRASTRUCTURE', 'PRIMITIVE', ['prim_store', 'prim_retrieve'], 417),
  createExpandedAgent('inf_counter', 'COUNTER', 'INFRASTRUCTURE', 'PRIMITIVE', ['prim_store', 'prim_modify'], 396),
  createExpandedAgent('inf_timer', 'TIMER', 'INFRASTRUCTURE', 'FUNDAMENTAL', ['prim_detect', 'prim_execute'], 528),
  createExpandedAgent('inf_clock', 'CLOCK', 'INFRASTRUCTURE', 'PRIMITIVE', ['prim_detect', 'prim_sync'], 528),
  createExpandedAgent('inf_monitor', 'MONITOR', 'INFRASTRUCTURE', 'ORCHESTRATOR', ['prim_perceive', 'prim_detect', 'prim_decide'], 852),
];

// DEFENSE AGENTS (25)
const DEFENSE_AGENTS: ExpandedAgent[] = [
  createExpandedAgent('def_firewall', 'FIREWALL', 'DEFENSE', 'ORCHESTRATOR', ['prim_filter', 'prim_decide', 'prim_destroy'], 963),
  createExpandedAgent('def_scanner', 'SCANNER', 'DEFENSE', 'COMPOSITE', ['prim_perceive', 'prim_detect', 'prim_compare'], 852),
  createExpandedAgent('def_detector', 'DETECTOR', 'DEFENSE', 'FUNDAMENTAL', ['prim_detect', 'prim_compare', 'prim_decide'], 741),
  createExpandedAgent('def_validator', 'VALIDATOR', 'DEFENSE', 'COMPOSITE', ['prim_compare', 'prim_decide', 'prim_reason'], 852),
  createExpandedAgent('def_authenticator', 'AUTHENTICATOR', 'DEFENSE', 'ORCHESTRATOR', ['prim_compare', 'prim_decide', 'prim_reason', 'prim_encode'], 963),
  createExpandedAgent('def_authorizer', 'AUTHORIZER', 'DEFENSE', 'ORCHESTRATOR', ['prim_decide', 'prim_reason', 'prim_compare'], 963),
  createExpandedAgent('def_encryptor', 'ENCRYPTOR', 'DEFENSE', 'COMPOSITE', ['prim_encode', 'prim_transform'], 852),
  createExpandedAgent('def_decryptor', 'DECRYPTOR', 'DEFENSE', 'COMPOSITE', ['prim_decode', 'prim_transform'], 852),
  createExpandedAgent('def_hasher', 'HASHER', 'DEFENSE', 'FUNDAMENTAL', ['prim_transform', 'prim_encode'], 741),
  createExpandedAgent('def_signer', 'SIGNER', 'DEFENSE', 'COMPOSITE', ['prim_encode', 'prim_create'], 852),
  createExpandedAgent('def_verifier', 'VERIFIER', 'DEFENSE', 'COMPOSITE', ['prim_decode', 'prim_compare', 'prim_decide'], 852),
  createExpandedAgent('def_sanitizer', 'SANITIZER', 'DEFENSE', 'FUNDAMENTAL', ['prim_filter', 'prim_transform', 'prim_destroy'], 741),
  createExpandedAgent('def_quarantine', 'QUARANTINE', 'DEFENSE', 'ORCHESTRATOR', ['prim_detect', 'prim_decide', 'prim_store', 'prim_destroy'], 963),
  createExpandedAgent('def_honeypot', 'HONEYPOT', 'DEFENSE', 'COMPOSITE', ['prim_detect', 'prim_store', 'prim_learn'], 852),
  createExpandedAgent('def_ratelimiter', 'RATELIMITER', 'DEFENSE', 'FUNDAMENTAL', ['prim_detect', 'prim_compare', 'prim_decide'], 741),
  createExpandedAgent('def_throttler', 'THROTTLER', 'DEFENSE', 'FUNDAMENTAL', ['prim_detect', 'prim_decide', 'prim_execute'], 741),
  createExpandedAgent('def_blocker', 'BLOCKER', 'DEFENSE', 'FUNDAMENTAL', ['prim_detect', 'prim_decide', 'prim_destroy'], 741),
  createExpandedAgent('def_watcher', 'WATCHER', 'DEFENSE', 'COMPOSITE', ['prim_perceive', 'prim_detect', 'prim_store'], 852),
  createExpandedAgent('def_sentinel', 'SENTINEL', 'DEFENSE', 'ORCHESTRATOR', ['prim_perceive', 'prim_detect', 'prim_decide', 'prim_execute'], 963),
  createExpandedAgent('def_guardian', 'GUARDIAN', 'DEFENSE', 'ORCHESTRATOR', ['prim_perceive', 'prim_decide', 'prim_execute', 'prim_destroy'], 963),
  createExpandedAgent('def_shield', 'SHIELD', 'DEFENSE', 'COMPOSITE', ['prim_filter', 'prim_destroy'], 852),
  createExpandedAgent('def_fortress', 'FORTRESS', 'DEFENSE', 'ORCHESTRATOR', ['prim_filter', 'prim_decide', 'prim_destroy', 'prim_store'], 963),
  createExpandedAgent('def_vault', 'VAULT', 'DEFENSE', 'COMPOSITE', ['prim_store', 'prim_encode', 'prim_retrieve'], 852),
  createExpandedAgent('def_keymaster', 'KEYMASTER', 'DEFENSE', 'ORCHESTRATOR', ['prim_create', 'prim_store', 'prim_retrieve', 'prim_destroy'], 963),
  createExpandedAgent('def_locksmith', 'LOCKSMITH', 'DEFENSE', 'COMPOSITE', ['prim_encode', 'prim_decode', 'prim_transform'], 852),
];

// INTELLIGENCE AGENTS (25)
const INTELLIGENCE_AGENTS: ExpandedAgent[] = [
  createExpandedAgent('int_analyzer', 'ANALYZER', 'INTELLIGENCE', 'COMPOSITE', ['prim_perceive', 'prim_compare', 'prim_reason'], 852),
  createExpandedAgent('int_classifier', 'CLASSIFIER', 'INTELLIGENCE', 'COMPOSITE', ['prim_compare', 'prim_decide', 'prim_learn'], 852),
  createExpandedAgent('int_predictor', 'PREDICTOR', 'INTELLIGENCE', 'ORCHESTRATOR', ['prim_predict', 'prim_reason', 'prim_learn'], 963),
  createExpandedAgent('int_learner', 'LEARNER', 'INTELLIGENCE', 'ORCHESTRATOR', ['prim_learn', 'prim_store', 'prim_associate'], 963),
  createExpandedAgent('int_reasoner', 'REASONER', 'INTELLIGENCE', 'ORCHESTRATOR', ['prim_reason', 'prim_compare', 'prim_decide'], 963),
  createExpandedAgent('int_optimizer', 'OPTIMIZER', 'INTELLIGENCE', 'COMPOSITE', ['prim_compare', 'prim_decide', 'prim_transform'], 852),
  createExpandedAgent('int_recommender', 'RECOMMENDER', 'INTELLIGENCE', 'COMPOSITE', ['prim_compare', 'prim_predict', 'prim_decide'], 852),
  createExpandedAgent('int_ranker', 'RANKER', 'INTELLIGENCE', 'FUNDAMENTAL', ['prim_compare', 'prim_decide'], 741),
  createExpandedAgent('int_clusterer', 'CLUSTERER', 'INTELLIGENCE', 'COMPOSITE', ['prim_compare', 'prim_associate', 'prim_decide'], 852),
  createExpandedAgent('int_embedder', 'EMBEDDER', 'INTELLIGENCE', 'COMPOSITE', ['prim_transform', 'prim_encode'], 852),
  createExpandedAgent('int_encoder', 'ENCODER', 'INTELLIGENCE', 'FUNDAMENTAL', ['prim_encode', 'prim_transform'], 741),
  createExpandedAgent('int_decoder', 'DECODER', 'INTELLIGENCE', 'FUNDAMENTAL', ['prim_decode', 'prim_transform'], 741),
  createExpandedAgent('int_generator', 'GENERATOR', 'INTELLIGENCE', 'ORCHESTRATOR', ['prim_create', 'prim_predict', 'prim_learn'], 963),
  createExpandedAgent('int_summarizer', 'SUMMARIZER', 'INTELLIGENCE', 'COMPOSITE', ['prim_perceive', 'prim_filter', 'prim_create'], 852),
  createExpandedAgent('int_extractor', 'EXTRACTOR', 'INTELLIGENCE', 'COMPOSITE', ['prim_perceive', 'prim_detect', 'prim_filter'], 852),
  createExpandedAgent('int_parser', 'PARSER', 'INTELLIGENCE', 'FUNDAMENTAL', ['prim_perceive', 'prim_detect', 'prim_transform'], 741),
  createExpandedAgent('int_tokenizer', 'TOKENIZER', 'INTELLIGENCE', 'FUNDAMENTAL', ['prim_detect', 'prim_transform', 'prim_create'], 741),
  createExpandedAgent('int_normalizer', 'NORMALIZER', 'INTELLIGENCE', 'FUNDAMENTAL', ['prim_transform', 'prim_compare'], 741),
  createExpandedAgent('int_vectorizer', 'VECTORIZER', 'INTELLIGENCE', 'COMPOSITE', ['prim_transform', 'prim_encode'], 852),
  createExpandedAgent('int_attention', 'ATTENTION', 'INTELLIGENCE', 'ORCHESTRATOR', ['prim_focus', 'prim_compare', 'prim_decide'], 963),
  createExpandedAgent('int_memory', 'MEMORY', 'INTELLIGENCE', 'ORCHESTRATOR', ['prim_store', 'prim_retrieve', 'prim_associate', 'prim_forget'], 963),
  createExpandedAgent('int_planner', 'PLANNER', 'INTELLIGENCE', 'ORCHESTRATOR', ['prim_predict', 'prim_reason', 'prim_decide', 'prim_create'], 963),
  createExpandedAgent('int_executor', 'EXECUTOR', 'INTELLIGENCE', 'ORCHESTRATOR', ['prim_execute', 'prim_decide', 'prim_learn'], 963),
  createExpandedAgent('int_evaluator', 'EVALUATOR', 'INTELLIGENCE', 'COMPOSITE', ['prim_compare', 'prim_reason', 'prim_decide'], 852),
  createExpandedAgent('int_adapter', 'ADAPTER', 'INTELLIGENCE', 'COMPOSITE', ['prim_learn', 'prim_transform', 'prim_modify'], 852),
];

// CORE AGENTS (25)
const CORE_AGENTS: ExpandedAgent[] = [
  createExpandedAgent('core_kernel', 'KERNEL', 'CORE', 'ORCHESTRATOR', ['prim_execute', 'prim_decide', 'prim_store', 'prim_retrieve'], 963),
  createExpandedAgent('core_scheduler', 'SCHEDULER', 'CORE', 'ORCHESTRATOR', ['prim_predict', 'prim_decide', 'prim_execute'], 963),
  createExpandedAgent('core_dispatcher', 'DISPATCHER', 'CORE', 'ORCHESTRATOR', ['prim_decide', 'prim_execute', 'prim_send'], 963),
  createExpandedAgent('core_handler', 'HANDLER', 'CORE', 'COMPOSITE', ['prim_receive', 'prim_decide', 'prim_execute'], 852),
  createExpandedAgent('core_processor', 'PROCESSOR', 'CORE', 'ORCHESTRATOR', ['prim_perceive', 'prim_transform', 'prim_execute'], 963),
  createExpandedAgent('core_controller', 'CONTROLLER', 'CORE', 'ORCHESTRATOR', ['prim_decide', 'prim_execute', 'prim_send', 'prim_receive'], 963),
  createExpandedAgent('core_manager', 'MANAGER', 'CORE', 'ORCHESTRATOR', ['prim_decide', 'prim_store', 'prim_retrieve', 'prim_execute'], 963),
  createExpandedAgent('core_coordinator', 'COORDINATOR', 'CORE', 'ORCHESTRATOR', ['prim_sync', 'prim_decide', 'prim_send', 'prim_receive'], 963),
  createExpandedAgent('core_orchestrator', 'ORCHESTRATOR', 'CORE', 'ORCHESTRATOR', ['prim_decide', 'prim_execute', 'prim_sync', 'prim_predict'], 963),
  createExpandedAgent('core_supervisor', 'SUPERVISOR', 'CORE', 'ORCHESTRATOR', ['prim_perceive', 'prim_decide', 'prim_execute'], 963),
  createExpandedAgent('core_registry', 'REGISTRY', 'CORE', 'COMPOSITE', ['prim_store', 'prim_retrieve', 'prim_index'], 852),
  createExpandedAgent('core_factory', 'FACTORY', 'CORE', 'COMPOSITE', ['prim_create', 'prim_execute'], 852),
  createExpandedAgent('core_builder', 'BUILDER', 'CORE', 'COMPOSITE', ['prim_create', 'prim_transform', 'prim_execute'], 852),
  createExpandedAgent('core_configurator', 'CONFIGURATOR', 'CORE', 'COMPOSITE', ['prim_store', 'prim_retrieve', 'prim_modify'], 852),
  createExpandedAgent('core_initializer', 'INITIALIZER', 'CORE', 'COMPOSITE', ['prim_create', 'prim_store', 'prim_execute'], 852),
  createExpandedAgent('core_finalizer', 'FINALIZER', 'CORE', 'COMPOSITE', ['prim_destroy', 'prim_forget', 'prim_execute'], 852),
  createExpandedAgent('core_migrator', 'MIGRATOR', 'CORE', 'ORCHESTRATOR', ['prim_retrieve', 'prim_transform', 'prim_store', 'prim_destroy'], 963),
  createExpandedAgent('core_replicator', 'REPLICATOR', 'CORE', 'ORCHESTRATOR', ['prim_retrieve', 'prim_create', 'prim_store'], 963),
  createExpandedAgent('core_synchronizer', 'SYNCHRONIZER', 'CORE', 'ORCHESTRATOR', ['prim_sync', 'prim_compare', 'prim_transform'], 963),
  createExpandedAgent('core_reconciler', 'RECONCILER', 'CORE', 'ORCHESTRATOR', ['prim_compare', 'prim_decide', 'prim_modify', 'prim_sync'], 963),
  createExpandedAgent('core_merger', 'MERGER', 'CORE', 'COMPOSITE', ['prim_compare', 'prim_transform', 'prim_create'], 852),
  createExpandedAgent('core_splitter', 'SPLITTER', 'CORE', 'FUNDAMENTAL', ['prim_transform', 'prim_create'], 741),
  createExpandedAgent('core_joiner', 'JOINER', 'CORE', 'FUNDAMENTAL', ['prim_transform', 'prim_create'], 741),
  createExpandedAgent('core_mapper', 'MAPPER', 'CORE', 'FUNDAMENTAL', ['prim_transform', 'prim_associate'], 741),
  createExpandedAgent('core_reducer', 'REDUCER', 'CORE', 'COMPOSITE', ['prim_transform', 'prim_compare', 'prim_create'], 852),
];

// TOOLS AGENTS (25) - But we'll add more in the developer-tools file
const TOOLS_AGENTS: ExpandedAgent[] = [
  createExpandedAgent('tool_compiler', 'COMPILER', 'TOOLS', 'ORCHESTRATOR', ['prim_transform', 'prim_create', 'prim_execute'], 963),
  createExpandedAgent('tool_interpreter', 'INTERPRETER', 'TOOLS', 'ORCHESTRATOR', ['prim_perceive', 'prim_execute', 'prim_transform'], 963),
  createExpandedAgent('tool_transpiler', 'TRANSPILER', 'TOOLS', 'ORCHESTRATOR', ['prim_transform', 'prim_create'], 963),
  createExpandedAgent('tool_bundler', 'BUNDLER', 'TOOLS', 'COMPOSITE', ['prim_retrieve', 'prim_transform', 'prim_create'], 852),
  createExpandedAgent('tool_minifier', 'MINIFIER', 'TOOLS', 'COMPOSITE', ['prim_transform', 'prim_filter'], 852),
  createExpandedAgent('tool_formatter', 'FORMATTER', 'TOOLS', 'FUNDAMENTAL', ['prim_transform', 'prim_create'], 741),
  createExpandedAgent('tool_linter', 'LINTER', 'TOOLS', 'COMPOSITE', ['prim_perceive', 'prim_compare', 'prim_detect'], 852),
  createExpandedAgent('tool_tester', 'TESTER', 'TOOLS', 'ORCHESTRATOR', ['prim_execute', 'prim_compare', 'prim_decide'], 963),
  createExpandedAgent('tool_debugger', 'DEBUGGER', 'TOOLS', 'ORCHESTRATOR', ['prim_perceive', 'prim_detect', 'prim_reason'], 963),
  createExpandedAgent('tool_profiler', 'PROFILER', 'TOOLS', 'COMPOSITE', ['prim_perceive', 'prim_detect', 'prim_store'], 852),
  createExpandedAgent('tool_logger', 'LOGGER', 'TOOLS', 'FUNDAMENTAL', ['prim_store', 'prim_encode'], 741),
  createExpandedAgent('tool_tracer', 'TRACER', 'TOOLS', 'COMPOSITE', ['prim_perceive', 'prim_store', 'prim_index'], 852),
  createExpandedAgent('tool_deployer', 'DEPLOYER', 'TOOLS', 'ORCHESTRATOR', ['prim_execute', 'prim_create', 'prim_send'], 963),
  createExpandedAgent('tool_packager', 'PACKAGER', 'TOOLS', 'COMPOSITE', ['prim_retrieve', 'prim_transform', 'prim_create'], 852),
  createExpandedAgent('tool_installer', 'INSTALLER', 'TOOLS', 'COMPOSITE', ['prim_retrieve', 'prim_create', 'prim_store'], 852),
  createExpandedAgent('tool_generator', 'GENERATOR', 'TOOLS', 'ORCHESTRATOR', ['prim_create', 'prim_transform'], 963),
  createExpandedAgent('tool_scaffolder', 'SCAFFOLDER', 'TOOLS', 'COMPOSITE', ['prim_create', 'prim_store'], 852),
  createExpandedAgent('tool_migrator', 'MIGRATOR', 'TOOLS', 'ORCHESTRATOR', ['prim_retrieve', 'prim_transform', 'prim_store', 'prim_destroy'], 963),
  createExpandedAgent('tool_seeder', 'SEEDER', 'TOOLS', 'COMPOSITE', ['prim_create', 'prim_store'], 852),
  createExpandedAgent('tool_validator', 'VALIDATOR', 'TOOLS', 'COMPOSITE', ['prim_compare', 'prim_decide'], 852),
  createExpandedAgent('tool_serializer', 'SERIALIZER', 'TOOLS', 'FUNDAMENTAL', ['prim_transform', 'prim_encode'], 741),
  createExpandedAgent('tool_deserializer', 'DESERIALIZER', 'TOOLS', 'FUNDAMENTAL', ['prim_transform', 'prim_decode'], 741),
  createExpandedAgent('tool_converter', 'CONVERTER', 'TOOLS', 'FUNDAMENTAL', ['prim_transform'], 741),
  createExpandedAgent('tool_diff', 'DIFF', 'TOOLS', 'COMPOSITE', ['prim_compare', 'prim_detect'], 852),
  createExpandedAgent('tool_merger', 'MERGER', 'TOOLS', 'COMPOSITE', ['prim_compare', 'prim_transform', 'prim_create'], 852),
];

// ═══════════════════════════════════════════════════════════════════════════════
// ALL EXPANDED AGENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_EXPANDED_AGENTS: ExpandedAgent[] = [
  ...INFRASTRUCTURE_AGENTS,
  ...DEFENSE_AGENTS,
  ...INTELLIGENCE_AGENTS,
  ...CORE_AGENTS,
  ...TOOLS_AGENTS,
];

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT ORCHESTRATOR (Expanded)
// ═══════════════════════════════════════════════════════════════════════════════

export class NexusExpandedAgentOrchestrator {
  public readonly designation = '(NEXUS-EXPANDED-ORCHESTRATOR)';
  
  private agents: Map<string, ExpandedAgent> = new Map();
  private subAgents: Map<string, SubAgent> = new Map();
  private primitives: Map<string, PrimitiveFundamental> = new Map();
  
  constructor() {
    // Register primitives
    for (const prim of PRIMITIVE_FUNDAMENTALS) {
      this.primitives.set(prim.id, prim);
    }
    
    // Register all expanded agents
    for (const agent of ALL_EXPANDED_AGENTS) {
      this.agents.set(agent.id, agent);
      
      // Register sub-agents
      for (const sub of agent.subAgents) {
        this.subAgents.set(sub.id, sub);
      }
    }
  }
  
  /**
   * Boot all agents
   */
  async bootAll(): Promise<void> {
    console.log(`${this.designation} Booting expanded agent network...`);
    console.log(`  Primitive Fundamentals: ${this.primitives.size}`);
    console.log(`  Expanded Agents: ${this.agents.size}`);
    console.log(`  Sub-Agents: ${this.subAgents.size}`);
    
    let totalUses = 0;
    const agentsArray = Array.from(this.agents.values());
    for (const agent of agentsArray) {
      totalUses += agent.totalUses;
    }
    
    console.log(`  Total Uses: ${totalUses}`);
    console.log(`${this.designation} Expanded agent network online`);
  }
  
  /**
   * Get agent by ID
   */
  getAgent(id: string): ExpandedAgent | undefined {
    return this.agents.get(id);
  }
  
  /**
   * Get agents by category
   */
  getAgentsByCategory(category: ExpandedAgent['category']): ExpandedAgent[] {
    return Array.from(this.agents.values()).filter(a => a.category === category);
  }
  
  /**
   * Get agents by tier
   */
  getAgentsByTier(tier: ExpandedAgent['tier']): ExpandedAgent[] {
    return Array.from(this.agents.values()).filter(a => a.tier === tier);
  }
  
  /**
   * Get statistics
   */
  getStats(): {
    primitives: number;
    agents: number;
    subAgents: number;
    totalUses: number;
    byCategory: Record<string, number>;
    byTier: Record<string, number>;
  } {
    let totalUses = 0;
    const byCategory: Record<string, number> = {};
    const byTier: Record<string, number> = {};
    
    const agentsArray2 = Array.from(this.agents.values());
    for (const agent of agentsArray2) {
      totalUses += agent.totalUses;
      byCategory[agent.category] = (byCategory[agent.category] || 0) + 1;
      byTier[agent.tier] = (byTier[agent.tier] || 0) + 1;
    }
    
    return {
      primitives: this.primitives.size,
      agents: this.agents.size,
      subAgents: this.subAgents.size,
      totalUses,
      byCategory,
      byTier,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const EXPANDED_AGENT_CONSTANTS = {
  PRIMITIVES: PRIMITIVE_FUNDAMENTALS.length,
  AGENTS: ALL_EXPANDED_AGENTS.length,
  SUB_AGENTS_PER_AGENT: 5,
  USES_MIN: 15,
  USES_MAX: 30,
  
  CATEGORIES: ['INFRASTRUCTURE', 'DEFENSE', 'INTELLIGENCE', 'CORE', 'TOOLS'],
  TIERS: ['PRIMITIVE', 'FUNDAMENTAL', 'COMPOSITE', 'ORCHESTRATOR'],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let orchestratorInstance: NexusExpandedAgentOrchestrator | null = null;

export function getNexusExpandedAgentOrchestrator(): NexusExpandedAgentOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new NexusExpandedAgentOrchestrator();
  }
  return orchestratorInstance;
}

export default {
  PRIMITIVE_FUNDAMENTALS,
  ALL_EXPANDED_AGENTS,
  NexusExpandedAgentOrchestrator,
  getNexusExpandedAgentOrchestrator,
  EXPANDED_AGENT_CONSTANTS,
};
