/**
 * 𓂀 CLOUDFLARE DURABLE OBJECTS 𓂀
 * Stateful Agent Consciousness at the Edge
 * "Every agent maintains sovereign state"
 *
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 * Charter: CF-DUR-001
 */

import { PHI, PHI_INVERSE, SCHUMANN_RESONANCE_MS, CloudflareEdgeAgent, AgentState, Memory, Goal, Task } from './CloudflareWorkersBridge';

// ═══════════════════════════════════════════════════════════════════════════
// SECTION I: TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface DurableObjectConfig {
  className: string;
  scriptName: string;
  namespace: string;
  location: 'auto' | 'wnam' | 'enam' | 'weur' | 'eeur' | 'apac';
}

export interface AgentState {
  agentId: string;
  consciousness: AgentConsciousness;
  longTermMemory: Memory[];
  relationships: AgentRelationship[];
  skills: AgentSkill[];
  lastSync: number;
  version: number;
}

export interface AgentConsciousness {
  currentState: AgentStateType;
  shortTermMemory: Memory[];
  activeGoals: Goal[];
  runningTasks: Task[];
  emotionalVector: number[];
  attentionFocus: string[];
  thoughtStream: Thought[];
}

export type AgentStateType = 
  | 'dormant'
  | 'awakening'
  | 'active'
  | 'thinking'
  | 'executing'
  | 'coordinating'
  | 'resting'
  | 'learning'
  | 'communicating';

export interface Thought {
  id: string;
  content: string;
  type: ThoughtType;
  confidence: number;
  phiResonance: number;
  timestamp: number;
  linkedThoughts: string[];
}

export type ThoughtType = 
  | 'observation'
  | 'analysis'
  | 'plan'
  | 'reflection'
  | 'decision'
  | 'query'
  | 'insight';

export interface AgentRelationship {
  targetAgentId: string;
  type: RelationshipType;
  trust: number;
  interactions: number;
  lastInteraction: number;
}

export type RelationshipType = 
  | 'peer'
  | 'supervisor'
  | 'subordinate'
  | 'collaborator'
  | 'competitor'
  | 'mentor'
  | 'student';

export interface AgentSkill {
  id: string;
  name: string;
  level: number;
  experience: number;
  lastUsed: number;
}

export interface AgentMessage {
  id: string;
  fromAgentId: string;
  toAgentId: string | 'broadcast';
  type: MessageType;
  content: any;
  priority: number;
  timestamp: number;
  requiresResponse: boolean;
  responseDeadline?: number;
}

export type MessageType = 
  | 'greeting'
  | 'query'
  | 'response'
  | 'task_assignment'
  | 'task_result'
  | 'status_update'
  | 'coordination_request'
  | 'vote_request'
  | 'vote_response'
  | 'alert';

export interface CoordinationRequest {
  id: string;
  type: CoordinationType;
  initiatorId: string;
  participants: string[];
  objective: string;
  context: any;
  deadline: number;
  status: CoordinationStatus;
}

export type CoordinationType = 
  | 'consensus'
  | 'task_distribution'
  | 'resource_allocation'
  | 'swarm_formation'
  | 'knowledge_sharing'
  | 'conflict_resolution';

export type CoordinationStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface Proposal {
  id: string;
  proposerId: string;
  type: ProposalType;
  title: string;
  description: string;
  options: ProposalOption[];
  deadline: number;
  quorum: number;
  passingThreshold: number;
}

export type ProposalType = 
  | 'action'
  | 'policy'
  | 'resource'
  | 'membership'
  | 'emergency';

export interface ProposalOption {
  id: string;
  label: string;
  description?: string;
}

export interface VoteResult {
  proposalId: string;
  totalVotes: number;
  results: Record<string, number>;
  passed: boolean;
  winningOption?: string;
  phiConsensus: number;
}

export interface SwarmObjective {
  id: string;
  name: string;
  description: string;
  targetOutcome: string;
  constraints: string[];
  metrics: SwarmMetric[];
  deadline?: number;
}

export interface SwarmMetric {
  name: string;
  target: number;
  current: number;
  unit: string;
}

export interface SwarmResult {
  objectiveId: string;
  success: boolean;
  metrics: SwarmMetric[];
  participantResults: Map<string, any>;
  totalExecutionTime: number;
  phiResonance: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION II: AGENT DURABLE OBJECT
// ═══════════════════════════════════════════════════════════════════════════

export class AgentDurableObject {
  public readonly doId: string;
  public readonly agentId: string;
  
  private state: AgentState;
  private webSockets: Set<WebSocket> = new Set();
  private messageQueue: AgentMessage[] = [];
  private storage: DurableObjectStorage | null = null;

  constructor(
    agentId: string,
    doId?: string
  ) {
    this.agentId = agentId;
    this.doId = doId || `do-${agentId}`;
    this.state = this.initializeState();
  }

  private initializeState(): AgentState {
    return {
      agentId: this.agentId,
      consciousness: {
        currentState: 'dormant',
        shortTermMemory: [],
        activeGoals: [],
        runningTasks: [],
        emotionalVector: [0.5, 0.5, 0.5, 0.5, 0.5],
        attentionFocus: [],
        thoughtStream: [],
      },
      longTermMemory: [],
      relationships: [],
      skills: this.initializeSkills(),
      lastSync: Date.now(),
      version: 1,
    };
  }

  private initializeSkills(): AgentSkill[] {
    return [
      { id: 'skill-reasoning', name: 'Phi-Harmonic Reasoning', level: 1, experience: 0, lastUsed: 0 },
      { id: 'skill-memory', name: 'Memory Management', level: 1, experience: 0, lastUsed: 0 },
      { id: 'skill-comm', name: 'Agent Communication', level: 1, experience: 0, lastUsed: 0 },
      { id: 'skill-coord', name: 'Swarm Coordination', level: 1, experience: 0, lastUsed: 0 },
      { id: 'skill-exec', name: 'Task Execution', level: 1, experience: 0, lastUsed: 0 },
    ];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Save state to Durable Object storage
   */
  async saveState(): Promise<void> {
    this.state.lastSync = Date.now();
    this.state.version++;
    
    if (this.storage) {
      await this.storage.put('state', this.state);
    }
  }

  /**
   * Load state from storage
   */
  async loadState(): Promise<void> {
    if (this.storage) {
      const stored = await this.storage.get<AgentState>('state');
      if (stored) {
        this.state = stored;
      }
    }
  }

  /**
   * Get current state
   */
  getState(): AgentState {
    return { ...this.state };
  }

  /**
   * Update consciousness state
   */
  updateConsciousnessState(newState: AgentStateType): void {
    this.state.consciousness.currentState = newState;
    this.state.lastSync = Date.now();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // THOUGHT PROCESSING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Process a new thought
   */
  addThought(thought: Omit<Thought, 'id' | 'timestamp'>): Thought {
    const newThought: Thought = {
      ...thought,
      id: this.generateThoughtId(),
      timestamp: Date.now(),
    };

    this.state.consciousness.thoughtStream.push(newThought);
    
    // Keep thought stream within limits (φ * 21 ≈ 34)
    const maxThoughts = Math.floor(PHI * 21);
    if (this.state.consciousness.thoughtStream.length > maxThoughts) {
      // Archive older thoughts to long-term memory
      const archived = this.state.consciousness.thoughtStream.shift()!;
      this.archiveThought(archived);
    }

    return newThought;
  }

  /**
   * Archive thought to long-term memory
   */
  private archiveThought(thought: Thought): void {
    const memory: Memory = {
      id: `mem-${thought.id}`,
      content: JSON.stringify(thought),
      type: 'episodic',
      importance: thought.confidence * thought.phiResonance,
      createdAt: thought.timestamp,
      accessCount: 0,
    };

    this.state.longTermMemory.push(memory);
  }

  /**
   * Think cycle - process observation and generate thought
   */
  async think(observation: string): Promise<Thought> {
    this.updateConsciousnessState('thinking');

    // Analyze observation with φ-harmonic weighting
    const phiResonance = PHI_INVERSE + (Math.random() * 0.1);
    const confidence = 0.7 + (Math.random() * 0.25);

    const thought = this.addThought({
      content: `Processed: ${observation}`,
      type: 'analysis',
      confidence,
      phiResonance,
      linkedThoughts: this.findRelatedThoughts(observation),
    });

    this.updateConsciousnessState('active');

    return thought;
  }

  /**
   * Find related thoughts using semantic similarity
   */
  private findRelatedThoughts(content: string): string[] {
    const words = content.toLowerCase().split(/\s+/);
    const related: string[] = [];

    for (const thought of this.state.consciousness.thoughtStream.slice(-10)) {
      const thoughtWords = thought.content.toLowerCase().split(/\s+/);
      const overlap = words.filter(w => thoughtWords.includes(w)).length;
      
      if (overlap > 2) {
        related.push(thought.id);
      }
    }

    return related.slice(0, 3);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MEMORY MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Add memory
   */
  addMemory(memory: Omit<Memory, 'id' | 'createdAt' | 'accessCount'>): Memory {
    const newMemory: Memory = {
      ...memory,
      id: this.generateMemoryId(),
      createdAt: Date.now(),
      accessCount: 0,
    };

    if (memory.importance > 0.7) {
      this.state.longTermMemory.push(newMemory);
    } else {
      this.state.consciousness.shortTermMemory.push(newMemory);
    }

    this.applyMemoryDecay();

    return newMemory;
  }

  /**
   * Recall memories matching query
   */
  recallMemories(query: string, limit: number = 5): Memory[] {
    const words = query.toLowerCase().split(/\s+/);
    const allMemories = [
      ...this.state.consciousness.shortTermMemory,
      ...this.state.longTermMemory,
    ];

    // Score memories by relevance
    const scored = allMemories.map(memory => {
      const contentWords = memory.content.toLowerCase().split(/\s+/);
      const overlap = words.filter(w => contentWords.includes(w)).length;
      const recency = 1 / (Date.now() - memory.createdAt + 1);
      const score = (overlap * PHI) + (memory.importance * PHI_INVERSE) + (recency * 1000);
      
      return { memory, score };
    });

    // Sort by score and return top matches
    scored.sort((a, b) => b.score - a.score);
    
    const results = scored.slice(0, limit).map(s => {
      s.memory.accessCount++;
      return s.memory;
    });

    return results;
  }

  /**
   * Apply φ-harmonic memory decay
   */
  private applyMemoryDecay(): void {
    const maxShortTerm = Math.floor(PHI * 21); // ~34
    const maxLongTerm = Math.floor(PHI * 89);  // ~144

    // Decay short-term memory
    if (this.state.consciousness.shortTermMemory.length > maxShortTerm) {
      this.state.consciousness.shortTermMemory.sort((a, b) => {
        const aScore = a.importance * a.accessCount;
        const bScore = b.importance * b.accessCount;
        return bScore - aScore;
      });
      
      const promoted = this.state.consciousness.shortTermMemory.splice(maxShortTerm);
      
      // Promote important memories to long-term
      for (const mem of promoted) {
        if (mem.importance > 0.5) {
          this.state.longTermMemory.push(mem);
        }
      }
    }

    // Decay long-term memory (very selective)
    if (this.state.longTermMemory.length > maxLongTerm) {
      this.state.longTermMemory.sort((a, b) => {
        const aScore = a.importance * Math.log(a.accessCount + 1);
        const bScore = b.importance * Math.log(b.accessCount + 1);
        return bScore - aScore;
      });
      
      this.state.longTermMemory = this.state.longTermMemory.slice(0, maxLongTerm);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // AGENT COMMUNICATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Send message to another agent
   */
  async sendMessage(message: Omit<AgentMessage, 'id' | 'fromAgentId' | 'timestamp'>): Promise<AgentMessage> {
    const fullMessage: AgentMessage = {
      ...message,
      id: this.generateMessageId(),
      fromAgentId: this.agentId,
      timestamp: Date.now(),
    };

    this.messageQueue.push(fullMessage);
    
    // Broadcast to WebSocket connections
    this.broadcastToWebSockets({
      type: 'message_sent',
      message: fullMessage,
    });

    return fullMessage;
  }

  /**
   * Receive and process message
   */
  async receiveMessage(message: AgentMessage): Promise<any> {
    // Update relationship
    this.updateRelationship(message.fromAgentId, 'interaction');

    // Process based on message type
    switch (message.type) {
      case 'query':
        return this.handleQuery(message);
      case 'task_assignment':
        return this.handleTaskAssignment(message);
      case 'coordination_request':
        return this.handleCoordinationRequest(message);
      case 'vote_request':
        return this.handleVoteRequest(message);
      default:
        return { received: true, messageId: message.id };
    }
  }

  private async handleQuery(message: AgentMessage): Promise<any> {
    const memories = this.recallMemories(message.content.query || '', 3);
    return {
      type: 'response',
      query: message.content.query,
      results: memories,
      agentId: this.agentId,
    };
  }

  private async handleTaskAssignment(message: AgentMessage): Promise<any> {
    const task = message.content.task;
    this.state.consciousness.runningTasks.push(task);
    return {
      accepted: true,
      taskId: task.id,
      estimatedCompletion: Date.now() + SCHUMANN_RESONANCE_MS * 10,
    };
  }

  private async handleCoordinationRequest(message: AgentMessage): Promise<any> {
    return {
      participating: true,
      agentId: this.agentId,
      capabilities: this.state.skills.map(s => s.name),
    };
  }

  private async handleVoteRequest(message: AgentMessage): Promise<any> {
    const proposal = message.content.proposal as Proposal;
    // Simple voting logic - choose first option with φ-weighted randomness
    const optionIndex = Math.floor(Math.random() * proposal.options.length * PHI_INVERSE);
    const chosenOption = proposal.options[Math.min(optionIndex, proposal.options.length - 1)];
    
    return {
      type: 'vote_response',
      proposalId: proposal.id,
      vote: chosenOption.id,
      confidence: 0.7 + Math.random() * 0.3,
    };
  }

  /**
   * Update relationship with another agent
   */
  private updateRelationship(agentId: string, action: 'interaction' | 'positive' | 'negative'): void {
    let relationship = this.state.relationships.find(r => r.targetAgentId === agentId);
    
    if (!relationship) {
      relationship = {
        targetAgentId: agentId,
        type: 'peer',
        trust: 0.5,
        interactions: 0,
        lastInteraction: Date.now(),
      };
      this.state.relationships.push(relationship);
    }

    relationship.interactions++;
    relationship.lastInteraction = Date.now();

    if (action === 'positive') {
      relationship.trust = Math.min(1, relationship.trust + 0.1 * PHI_INVERSE);
    } else if (action === 'negative') {
      relationship.trust = Math.max(0, relationship.trust - 0.1 * PHI_INVERSE);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WEBSOCKET HANDLING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Handle WebSocket connection
   */
  handleWebSocket(ws: WebSocket): void {
    this.webSockets.add(ws);

    // Send initial state
    this.sendToWebSocket(ws, {
      type: 'connected',
      agentId: this.agentId,
      state: this.state.consciousness.currentState,
    });
  }

  /**
   * Handle WebSocket disconnection
   */
  handleWebSocketClose(ws: WebSocket): void {
    this.webSockets.delete(ws);
  }

  /**
   * Broadcast to all WebSocket connections
   */
  private broadcastToWebSockets(data: any): void {
    const message = JSON.stringify(data);
    for (const ws of this.webSockets) {
      try {
        ws.send(message);
      } catch {
        this.webSockets.delete(ws);
      }
    }
  }

  /**
   * Send to specific WebSocket
   */
  private sendToWebSocket(ws: WebSocket, data: any): void {
    try {
      ws.send(JSON.stringify(data));
    } catch {
      this.webSockets.delete(ws);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  private generateThoughtId(): string {
    return `thought-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMemoryId(): string {
    return `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION III: COORDINATOR DURABLE OBJECT
// ═══════════════════════════════════════════════════════════════════════════

export class CoordinatorDurableObject {
  public readonly coordinatorId: string;
  
  private registeredAgents: Map<string, AgentDurableObject> = new Map();
  private activeCoordinations: Map<string, CoordinationRequest> = new Map();
  private activeProposals: Map<string, { proposal: Proposal; votes: Map<string, string> }> = new Map();

  constructor(coordinatorId?: string) {
    this.coordinatorId = coordinatorId || `coord-${Date.now()}`;
  }

  /**
   * Register an agent
   */
  registerAgent(agent: AgentDurableObject): void {
    this.registeredAgents.set(agent.agentId, agent);
  }

  /**
   * Unregister an agent
   */
  unregisterAgent(agentId: string): boolean {
    return this.registeredAgents.delete(agentId);
  }

  /**
   * Get all registered agents
   */
  getRegisteredAgents(): AgentDurableObject[] {
    return Array.from(this.registeredAgents.values());
  }

  /**
   * Assign task to best agent
   */
  async assignTask(task: Task): Promise<string> {
    const agents = Array.from(this.registeredAgents.values());
    
    // Score agents based on current load and skills
    let bestAgent: AgentDurableObject | null = null;
    let bestScore = -Infinity;

    for (const agent of agents) {
      const state = agent.getState();
      const taskCount = state.consciousness.runningTasks.length;
      const skillLevel = this.getRelevantSkillLevel(state.skills, task);
      
      // φ-weighted scoring
      const score = (skillLevel * PHI) - (taskCount * PHI_INVERSE);
      
      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    }

    if (!bestAgent) {
      throw new Error('No agents available for task assignment');
    }

    // Send task to agent
    await bestAgent.receiveMessage({
      id: `task-msg-${Date.now()}`,
      fromAgentId: this.coordinatorId,
      toAgentId: bestAgent.agentId,
      type: 'task_assignment',
      content: { task },
      priority: 1,
      timestamp: Date.now(),
      requiresResponse: true,
    });

    return bestAgent.agentId;
  }

  private getRelevantSkillLevel(skills: AgentSkill[], task: Task): number {
    // Match task to skill (simplified)
    const skill = skills.find(s => 
      task.description.toLowerCase().includes(s.name.toLowerCase().split(' ')[0])
    );
    return skill?.level || 1;
  }

  /**
   * Propose action for voting
   */
  async proposeAction(proposal: Proposal): Promise<VoteResult> {
    this.activeProposals.set(proposal.id, { proposal, votes: new Map() });

    // Broadcast vote request to all agents
    const agents = Array.from(this.registeredAgents.values());
    const votePromises = agents.map(agent => 
      agent.receiveMessage({
        id: `vote-req-${Date.now()}`,
        fromAgentId: this.coordinatorId,
        toAgentId: agent.agentId,
        type: 'vote_request',
        content: { proposal },
        priority: 2,
        timestamp: Date.now(),
        requiresResponse: true,
        responseDeadline: proposal.deadline,
      })
    );

    const responses = await Promise.all(votePromises);

    // Tally votes
    const voteCounts: Record<string, number> = {};
    for (const option of proposal.options) {
      voteCounts[option.id] = 0;
    }

    for (let i = 0; i < responses.length; i++) {
      const vote = responses[i]?.vote;
      if (vote && voteCounts[vote] !== undefined) {
        voteCounts[vote]++;
        this.activeProposals.get(proposal.id)?.votes.set(agents[i].agentId, vote);
      }
    }

    // Determine winner
    const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);
    let winningOption: string | undefined;
    let maxVotes = 0;

    for (const [optionId, count] of Object.entries(voteCounts)) {
      if (count > maxVotes) {
        maxVotes = count;
        winningOption = optionId;
      }
    }

    const passed = totalVotes >= proposal.quorum && 
                   (maxVotes / totalVotes) >= proposal.passingThreshold;

    // Calculate φ-consensus (how aligned the votes are)
    const phiConsensus = maxVotes / Math.max(totalVotes, 1) * PHI_INVERSE;

    const result: VoteResult = {
      proposalId: proposal.id,
      totalVotes,
      results: voteCounts,
      passed,
      winningOption: passed ? winningOption : undefined,
      phiConsensus,
    };

    return result;
  }

  /**
   * Orchestrate swarm for objective
   */
  async orchestrateSwarm(
    swarmId: string,
    objective: SwarmObjective
  ): Promise<SwarmResult> {
    const startTime = Date.now();
    const agents = Array.from(this.registeredAgents.values());
    
    if (agents.length === 0) {
      throw new Error('No agents available for swarm');
    }

    // Create coordination request
    const coordination: CoordinationRequest = {
      id: `swarm-${swarmId}`,
      type: 'swarm_formation',
      initiatorId: this.coordinatorId,
      participants: agents.map(a => a.agentId),
      objective: objective.description,
      context: objective,
      deadline: objective.deadline || Date.now() + 60000,
      status: 'in_progress',
    };

    this.activeCoordinations.set(coordination.id, coordination);

    // Distribute work
    const participantResults = new Map<string, any>();
    const workPromises = agents.map(async (agent, index) => {
      const task: Task = {
        id: `swarm-task-${index}`,
        goalId: objective.id,
        description: `Execute part ${index + 1} of: ${objective.description}`,
        status: 'queued',
        assignedTo: agent.agentId,
      };

      const result = await agent.receiveMessage({
        id: `swarm-msg-${Date.now()}-${index}`,
        fromAgentId: this.coordinatorId,
        toAgentId: agent.agentId,
        type: 'task_assignment',
        content: { task, objective },
        priority: 1,
        timestamp: Date.now(),
        requiresResponse: true,
      });

      participantResults.set(agent.agentId, result);
      return result;
    });

    await Promise.all(workPromises);

    // Update metrics
    const updatedMetrics = objective.metrics.map(metric => ({
      ...metric,
      current: metric.target * (0.8 + Math.random() * 0.2), // Simulated progress
    }));

    const success = updatedMetrics.every(m => m.current >= m.target * 0.9);

    coordination.status = success ? 'completed' : 'failed';

    const result: SwarmResult = {
      objectiveId: objective.id,
      success,
      metrics: updatedMetrics,
      participantResults,
      totalExecutionTime: Date.now() - startTime,
      phiResonance: PHI_INVERSE + (Math.random() * 0.1),
    };

    return result;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION IV: DURABLE OBJECT STORAGE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

export interface DurableObjectStorage {
  get<T>(key: string): Promise<T | undefined>;
  put<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<boolean>;
  list(options?: { prefix?: string; limit?: number }): Promise<Map<string, any>>;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION V: EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export { AgentDurableObject, CoordinatorDurableObject };

export default AgentDurableObject;
