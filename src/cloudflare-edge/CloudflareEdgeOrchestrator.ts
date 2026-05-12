/**
 * 𓂀 CLOUDFLARE EDGE ORCHESTRATOR 𓂀
 * Unified Sovereign Intelligence Coordination at the Edge
 * "All systems converge through φ-harmonic pathways"
 *
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 * Charter: CF-ORCH-001
 */

import { 
  CloudflareWorkersBridge, 
  CloudflareEdgeAgent, 
  EdgeLocation, 
  CapabilityType,
  PHI, 
  PHI_INVERSE, 
  SCHUMANN_RESONANCE_MS 
} from './CloudflareWorkersBridge';
import { CloudflareEthereumGateway, NetworkName, EthTransaction, BridgeProof } from './CloudflareEthereumGateway';
import { CloudflareAIGateway, Message, ChatCompletion, EmbeddingResult, TaskType } from './CloudflareAIGateway';
import { AgentDurableObject, CoordinatorDurableObject, Proposal, VoteResult, SwarmObjective, SwarmResult } from './CloudflareDurableObjects';
import { CloudflareStorageBridge, StorageTier } from './CloudflareStorageBridge';

// ═══════════════════════════════════════════════════════════════════════════
// SECTION I: TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface OrchestratorConfig {
  accountId: string;
  apiToken: string;
  defaultNetwork: NetworkName;
  enableEthGateway: boolean;
  enableAIGateway: boolean;
  enableStorage: boolean;
  phiHarmonicMode: boolean;
}

export interface AgentSpec {
  name: string;
  location?: EdgeLocation;
  capabilities: CapabilityType[];
  initialGoals?: string[];
  initialMemories?: string[];
}

export interface InferenceRequest {
  type: TaskType;
  prompt?: string;
  messages?: Message[];
  embedding?: string;
}

export interface InferenceResult {
  type: TaskType;
  result: any;
  latency: number;
  phiResonance: number;
}

export interface MemoryResult {
  key: string;
  value: any;
  score: number;
  tier: StorageTier;
}

export interface SwarmConfig {
  name: string;
  agentCount: number;
  objective: SwarmObjective;
  distributionStrategy: 'geographic' | 'capability' | 'load-balanced';
}

export interface OrchestratorStatistics {
  agents: {
    total: number;
    active: number;
    byLocation: Record<string, number>;
  };
  ethereum: {
    totalRequests: number;
    networkBreakdown: Record<string, number>;
  };
  ai: {
    totalRequests: number;
    totalTokens: number;
    estimatedCost: number;
  };
  storage: {
    totalItems: number;
    byTier: Record<string, number>;
  };
  phiResonance: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION II: CLOUDFLARE EDGE ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════

export class CloudflareEdgeOrchestrator {
  public readonly orchestratorId = 'CF-ORCH-001';
  public readonly orchestratorName = 'CloudflareEdgeOrchestrator';

  private config: OrchestratorConfig;
  private workersBridge: CloudflareWorkersBridge;
  private ethGateway: CloudflareEthereumGateway;
  private aiGateway: CloudflareAIGateway;
  private storageBridge: CloudflareStorageBridge;
  private coordinator: CoordinatorDurableObject;
  private agentDOs: Map<string, AgentDurableObject> = new Map();

  constructor(config?: Partial<OrchestratorConfig>) {
    this.config = {
      accountId: config?.accountId || process.env.CF_ACCOUNT_ID || 'medina-tech',
      apiToken: config?.apiToken || process.env.CF_API_TOKEN || '',
      defaultNetwork: config?.defaultNetwork || 'mainnet',
      enableEthGateway: config?.enableEthGateway ?? true,
      enableAIGateway: config?.enableAIGateway ?? true,
      enableStorage: config?.enableStorage ?? true,
      phiHarmonicMode: config?.phiHarmonicMode ?? true,
    };

    // Initialize all bridges
    this.workersBridge = new CloudflareWorkersBridge(this.config.accountId, this.config.apiToken);
    this.ethGateway = new CloudflareEthereumGateway(this.config.defaultNetwork);
    this.aiGateway = new CloudflareAIGateway();
    this.storageBridge = new CloudflareStorageBridge();
    this.coordinator = new CoordinatorDurableObject();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Initialize the orchestrator
   */
  async initialize(): Promise<void> {
    console.log(`[${this.orchestratorId}] Initializing Cloudflare Edge Orchestrator...`);
    
    // Create initial schema for structured data
    await this.storageBridge.d1Query(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT,
        location TEXT,
        capabilities TEXT,
        created_at INTEGER,
        updated_at INTEGER
      )
    `);

    await this.storageBridge.d1Query(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        type TEXT,
        agent_id TEXT,
        data TEXT,
        timestamp INTEGER
      )
    `);

    console.log(`[${this.orchestratorId}] Orchestrator initialized with φ-harmonic resonance at ${PHI_INVERSE.toFixed(4)}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // AGENT LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Spawn a new edge agent
   */
  async spawnAgent(spec: AgentSpec): Promise<CloudflareEdgeAgent> {
    // Determine optimal location if not specified
    const location = spec.location || this.workersBridge.findOptimalLocation();

    // Spawn agent in Workers bridge
    const agent = await this.workersBridge.spawnAgent(
      spec.name,
      location,
      spec.capabilities
    );

    // Create Durable Object for agent state
    const agentDO = new AgentDurableObject(agent.agentId);
    this.agentDOs.set(agent.agentId, agentDO);

    // Register with coordinator
    this.coordinator.registerAgent(agentDO);

    // Add initial goals
    if (spec.initialGoals) {
      for (const goal of spec.initialGoals) {
        this.workersBridge.addGoal(agent.agentId, {
          description: goal,
          priority: 1,
          subGoals: [],
        });
      }
    }

    // Add initial memories
    if (spec.initialMemories) {
      for (const memory of spec.initialMemories) {
        agentDO.addMemory({
          content: memory,
          type: 'semantic',
          importance: 0.7,
        });
      }
    }

    // Store agent record
    await this.storageBridge.d1Query(
      'INSERT INTO agents (id, name, location, capabilities, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [agent.agentId, agent.name, agent.location, JSON.stringify(spec.capabilities), Date.now(), Date.now()]
    );

    // Log event
    await this.logEvent('agent_spawned', agent.agentId, { name: spec.name, location });

    return agent;
  }

  /**
   * Terminate an agent
   */
  async terminateAgent(agentId: string): Promise<boolean> {
    // Unregister from coordinator
    const agentDO = this.agentDOs.get(agentId);
    if (agentDO) {
      this.coordinator.unregisterAgent(agentId);
      this.agentDOs.delete(agentId);
    }

    // Terminate in Workers bridge
    const terminated = await this.workersBridge.terminateAgent(agentId);

    if (terminated) {
      await this.logEvent('agent_terminated', agentId, {});
    }

    return terminated;
  }

  /**
   * Migrate agent to different location
   */
  async migrateAgent(agentId: string, targetLocation: EdgeLocation): Promise<CloudflareEdgeAgent | null> {
    const agent = await this.workersBridge.migrateAgent(agentId, targetLocation);
    
    if (agent) {
      await this.logEvent('agent_migrated', agentId, { targetLocation });
    }

    return agent;
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): CloudflareEdgeAgent | undefined {
    return this.workersBridge.getAgent(agentId);
  }

  /**
   * List all agents
   */
  listAgents(): CloudflareEdgeAgent[] {
    return this.workersBridge.listAgents();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ETHEREUM OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Execute Ethereum transaction
   */
  async executeEthTransaction(
    signedTx: string,
    network?: NetworkName
  ): Promise<{ hash: string; receipt: any }> {
    if (!this.config.enableEthGateway) {
      throw new Error('Ethereum Gateway is disabled');
    }

    const hash = await this.ethGateway.sendTransaction(signedTx, network);
    const receipt = await this.ethGateway.waitForTransaction(hash, network);

    await this.logEvent('eth_transaction', 'orchestrator', { hash, network: network || this.config.defaultNetwork });

    return { hash, receipt };
  }

  /**
   * Watch Ethereum events
   */
  async *watchEthEvents(
    filter: { address?: string; topics?: string[] },
    network?: NetworkName,
    intervalMs: number = SCHUMANN_RESONANCE_MS
  ): AsyncGenerator<any[]> {
    if (!this.config.enableEthGateway) {
      throw new Error('Ethereum Gateway is disabled');
    }

    let fromBlock = await this.ethGateway.getBlockNumber(network);

    while (true) {
      const toBlock = await this.ethGateway.getBlockNumber(network);
      
      if (toBlock > fromBlock) {
        const logs = await this.ethGateway.getLogs({
          address: filter.address,
          topics: filter.topics as any,
          fromBlock,
          toBlock,
        }, network);

        if (logs.length > 0) {
          yield logs;
        }

        fromBlock = toBlock + 1;
      }

      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }

  /**
   * Get ETH balance
   */
  async getEthBalance(address: string, network?: NetworkName): Promise<bigint> {
    return this.ethGateway.getBalance(address, network);
  }

  /**
   * Bridge to MEDINA
   */
  async bridgeToMedina(
    amount: bigint,
    recipient: string,
    network?: NetworkName
  ): Promise<BridgeProof> {
    return this.ethGateway.bridgeToMedina(amount, recipient, undefined, network);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // AI OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Route inference request
   */
  async routeInference(request: InferenceRequest): Promise<InferenceResult> {
    if (!this.config.enableAIGateway) {
      throw new Error('AI Gateway is disabled');
    }

    const startTime = Date.now();
    let result: any;

    switch (request.type) {
      case 'chat':
        if (!request.messages) throw new Error('Messages required for chat');
        result = await this.aiGateway.chat(request.messages);
        break;
      
      case 'completion':
        if (!request.prompt) throw new Error('Prompt required for completion');
        result = await this.aiGateway.generateText(request.prompt);
        break;
      
      case 'embedding':
        if (!request.embedding) throw new Error('Text required for embedding');
        result = await this.aiGateway.embed(request.embedding);
        break;
      
      default:
        // Default to chat
        if (request.messages) {
          result = await this.aiGateway.chat(request.messages);
        } else if (request.prompt) {
          result = await this.aiGateway.generateText(request.prompt);
        } else {
          throw new Error('No input provided for inference');
        }
    }

    return {
      type: request.type,
      result,
      latency: Date.now() - startTime,
      phiResonance: PHI_INVERSE + (Math.random() * 0.1),
    };
  }

  /**
   * Stream inference
   */
  async *streamInference(request: InferenceRequest): AsyncGenerator<any> {
    if (!this.config.enableAIGateway) {
      throw new Error('AI Gateway is disabled');
    }

    if (!request.messages) {
      throw new Error('Messages required for streaming');
    }

    yield* this.aiGateway.streamChat(request.messages);
  }

  /**
   * Agent think cycle via AI
   */
  async agentThink(
    agentId: string,
    observation: string
  ): Promise<{ thought: string; action: string; confidence: number }> {
    const agentDO = this.agentDOs.get(agentId);
    if (!agentDO) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Get agent context
    const state = agentDO.getState();
    const memories = agentDO.recallMemories(observation, 3);

    // Route to AI
    const aiResult = await this.aiGateway.agentThink(
      agentId,
      observation,
      {
        memories: memories.map(m => m.content),
        goals: state.consciousness.activeGoals.map(g => g.description),
      }
    );

    // Process thought in Durable Object
    const thought = await agentDO.think(observation);

    return {
      thought: aiResult.thought,
      action: aiResult.action,
      confidence: aiResult.confidence,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MEMORY OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Store memory
   */
  async storeMemory(
    key: string,
    value: any,
    options?: {
      tier?: StorageTier;
      importance?: number;
      embedding?: number[];
    }
  ): Promise<void> {
    if (!this.config.enableStorage) {
      throw new Error('Storage is disabled');
    }

    if (options?.tier) {
      switch (options.tier) {
        case 'immediate':
          this.storageBridge.setImmediate(key, value);
          break;
        case 'kv':
          await this.storageBridge.kvPut(key, value);
          break;
        case 'r2':
          await this.storageBridge.r2Put(key, JSON.stringify(value), { contentType: 'application/json' });
          break;
        case 'vectorize':
          if (!options.embedding) throw new Error('Embedding required for vectorize tier');
          await this.storageBridge.vectorInsert(key, options.embedding, value);
          break;
      }
    } else {
      // Smart store
      await this.storageBridge.smartStore(key, value, {
        importance: options?.importance,
        embedding: options?.embedding,
      });
    }
  }

  /**
   * Retrieve memory
   */
  async retrieveMemory(key: string): Promise<any | null> {
    if (!this.config.enableStorage) {
      throw new Error('Storage is disabled');
    }

    const result = await this.storageBridge.smartRetrieve(key);
    return result?.value || null;
  }

  /**
   * Search memories semantically
   */
  async searchMemory(
    query: string,
    topK: number = 5
  ): Promise<MemoryResult[]> {
    if (!this.config.enableStorage) {
      throw new Error('Storage is disabled');
    }

    // Generate embedding for query
    const embeddingResult = await this.aiGateway.embed(query);
    
    // Search using embedding
    const results = await this.storageBridge.semanticSearch(embeddingResult.embedding, { topK });

    return results.map(r => ({
      key: r.id,
      value: r.value,
      score: r.score,
      tier: 'vectorize' as StorageTier,
    }));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COORDINATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Coordinate swarm
   */
  async coordinateSwarm(config: SwarmConfig): Promise<SwarmResult> {
    // Spawn required agents
    const agents: CloudflareEdgeAgent[] = [];
    
    for (let i = 0; i < config.agentCount; i++) {
      let location: EdgeLocation | undefined;
      
      if (config.distributionStrategy === 'geographic') {
        // Distribute across locations
        const locations: EdgeLocation[] = ['DFW', 'JFK', 'LAX', 'LHR', 'NRT'];
        location = locations[i % locations.length];
      }

      const agent = await this.spawnAgent({
        name: `${config.name}-agent-${i}`,
        location,
        capabilities: ['reasoning', 'execution', 'coordination'],
        initialGoals: [config.objective.description],
      });

      agents.push(agent);
    }

    // Wait for agents to activate (Schumann resonance timing)
    await new Promise(resolve => setTimeout(resolve, SCHUMANN_RESONANCE_MS));

    // Execute swarm
    const result = await this.coordinator.orchestrateSwarm(config.name, config.objective);

    await this.logEvent('swarm_completed', 'orchestrator', {
      name: config.name,
      success: result.success,
      participants: agents.length,
    });

    return result;
  }

  /**
   * Propose to OMNIS (multi-agent voting)
   */
  async proposeToOMNIS(proposal: Proposal): Promise<VoteResult> {
    const result = await this.coordinator.proposeAction(proposal);

    await this.logEvent('omnis_vote', 'orchestrator', {
      proposalId: proposal.id,
      passed: result.passed,
      phiConsensus: result.phiConsensus,
    });

    return result;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATISTICS & LOGGING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Log event
   */
  private async logEvent(type: string, agentId: string, data: any): Promise<void> {
    if (this.config.enableStorage) {
      await this.storageBridge.d1Query(
        'INSERT INTO events (id, type, agent_id, data, timestamp) VALUES (?, ?, ?, ?, ?)',
        [`evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, type, agentId, JSON.stringify(data), Date.now()]
      );
    }
  }

  /**
   * Get orchestrator statistics
   */
  getStatistics(): OrchestratorStatistics {
    const workersStats = this.workersBridge.getStatistics();
    const ethStats = this.ethGateway.getStatistics();
    const aiStats = this.aiGateway.getUsageStatistics();
    const storageStats = this.storageBridge.getStatistics();

    return {
      agents: {
        total: workersStats.totalAgents,
        active: workersStats.agentsByState.active + workersStats.agentsByState.thinking + 
                workersStats.agentsByState.executing + workersStats.agentsByState.coordinating,
        byLocation: workersStats.agentsByLocation,
      },
      ethereum: {
        totalRequests: ethStats.totalRequests,
        networkBreakdown: ethStats.networkBreakdown,
      },
      ai: {
        totalRequests: aiStats.totalRequests,
        totalTokens: aiStats.totalTokens,
        estimatedCost: aiStats.estimatedCost,
      },
      storage: {
        totalItems: storageStats.immediate.count + storageStats.kv.count + 
                   storageStats.r2.count + storageStats.vectorize.count,
        byTier: {
          immediate: storageStats.immediate.count,
          kv: storageStats.kv.count,
          r2: storageStats.r2.count,
          d1: storageStats.d1.rows,
          vectorize: storageStats.vectorize.count,
        },
      },
      phiResonance: workersStats.averagePhiResonance || PHI_INVERSE,
    };
  }

  /**
   * Get individual bridge/gateway access
   */
  get workers(): CloudflareWorkersBridge {
    return this.workersBridge;
  }

  get ethereum(): CloudflareEthereumGateway {
    return this.ethGateway;
  }

  get ai(): CloudflareAIGateway {
    return this.aiGateway;
  }

  get storage(): CloudflareStorageBridge {
    return this.storageBridge;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION III: EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const cloudflareEdgeOrchestrator = new CloudflareEdgeOrchestrator();

export default CloudflareEdgeOrchestrator;
