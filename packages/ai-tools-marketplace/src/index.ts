/**
 * AI TOOLS MARKETPLACE
 * ─────────────────────────────────────────────────────────────────────────────
 * A callable tools and agents marketplace for AI systems.
 *
 * Register tools, discover capabilities, form AI teams, invoke agents,
 * and compose multi-AI workflows. Designed so any AI model (GPT, Claude,
 * Gemini, Llama, custom) can call tools and delegate to specialist agents.
 *
 * Core concepts:
 *   - Tool: A callable function with typed input/output
 *   - Agent: An AI-backed operator with a role, tools, and memory
 *   - Team: A composition of agents with a coordinator
 *   - Marketplace: A registry of published tools and agents
 *
 * MIT License — ItsNotAILABS / Medina Memory Systems
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToolStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE' | 'DEPRECATED';
export type AgentRole =
  | 'ANALYST'
  | 'BUILDER'
  | 'RESEARCHER'
  | 'ORCHESTRATOR'
  | 'MEMORY_CURATOR'
  | 'VALIDATOR'
  | 'TRANSLATOR'
  | 'CRITIC'
  | 'DOMAIN_EXPERT'
  | 'CUSTOM';

export type InvocationStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT';

export interface ToolSchema {
  type: 'object';
  properties: Record<string, { type: string; description: string; required?: boolean }>;
  required?: string[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  inputSchema: ToolSchema;
  outputSchema: ToolSchema;
  status: ToolStatus;
  author: string;
  tags: string[];
  invocationCount: number;
  successRate: number;  // 0–1
  averageLatencyMs: number;
  handler?: (input: unknown) => Promise<unknown>;
}

export interface AgentCapability {
  toolId: string;
  proficiency: number; // 0–1
}

export interface AgentMemory {
  key: string;
  value: unknown;
  timestamp: number;
  ttl?: number; // milliseconds, undefined = permanent
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  capabilities: AgentCapability[];
  memory: Map<string, AgentMemory>;
  status: 'IDLE' | 'WORKING' | 'WAITING' | 'OFFLINE';
  teamId?: string;
  invocationCount: number;
  tags: string[];
  modelHint?: string; // e.g., 'gpt-4', 'claude-3', 'custom'
  handler?: (task: AgentTask) => Promise<AgentResult>;
}

export interface AgentTask {
  id: string;
  agentId: string;
  description: string;
  input: unknown;
  context?: Record<string, unknown>;
  deadline?: number;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
}

export interface AgentResult {
  taskId: string;
  agentId: string;
  status: InvocationStatus;
  output: unknown;
  reasoning?: string;
  toolsUsed: string[];
  latencyMs: number;
  timestamp: number;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  agentIds: string[];
  coordinatorId: string;
  sharedMemory: Map<string, AgentMemory>;
  status: 'IDLE' | 'ACTIVE' | 'DISSOLVING';
  createdAt: number;
  lastActiveAt: number;
}

export interface ToolInvocation {
  id: string;
  toolId: string;
  callerId: string; // agentId or external caller
  input: unknown;
  status: InvocationStatus;
  output?: unknown;
  error?: string;
  startedAt: number;
  completedAt?: number;
  latencyMs?: number;
}

export interface MarketplaceSearch {
  query?: string;
  category?: string;
  tags?: string[];
  minSuccessRate?: number;
  status?: ToolStatus;
  limit?: number;
}

// ─── Tool Registry ────────────────────────────────────────────────────────────

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();
  private invocations: ToolInvocation[] = [];

  /**
   * Register a new tool.
   */
  register(tool: Omit<Tool, 'invocationCount' | 'successRate' | 'averageLatencyMs'>): Tool {
    const registered: Tool = {
      ...tool,
      invocationCount: 0,
      successRate: 1.0,
      averageLatencyMs: 0,
    };
    this.tools.set(tool.id, registered);
    return registered;
  }

  /**
   * Invoke a tool by ID.
   */
  async invoke(toolId: string, input: unknown, callerId: string = 'anonymous'): Promise<ToolInvocation> {
    const tool = this.tools.get(toolId);
    if (!tool) {
      throw new Error(`Tool "${toolId}" not found in registry.`);
    }
    if (tool.status === 'OFFLINE' || tool.status === 'DEPRECATED') {
      throw new Error(`Tool "${toolId}" is ${tool.status}.`);
    }

    const invocation: ToolInvocation = {
      id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      toolId,
      callerId,
      input,
      status: 'RUNNING',
      startedAt: Date.now(),
    };

    this.invocations.push(invocation);
    tool.invocationCount += 1;

    try {
      if (tool.handler) {
        invocation.output = await tool.handler(input);
      } else {
        invocation.output = { message: `Tool "${tool.name}" invoked. No handler registered.`, input };
      }
      invocation.status = 'SUCCESS';
    } catch (err) {
      invocation.status = 'FAILED';
      invocation.error = err instanceof Error ? err.message : String(err);
    }

    invocation.completedAt = Date.now();
    invocation.latencyMs = invocation.completedAt - invocation.startedAt;

    // Update tool stats
    const successfulInvocations = this.invocations.filter(
      i => i.toolId === toolId && i.status === 'SUCCESS',
    ).length;
    tool.successRate = successfulInvocations / tool.invocationCount;

    const completedInvocations = this.invocations.filter(
      i => i.toolId === toolId && i.latencyMs !== undefined,
    );
    tool.averageLatencyMs = completedInvocations.reduce((sum, i) => sum + (i.latencyMs ?? 0), 0)
      / Math.max(completedInvocations.length, 1);

    return invocation;
  }

  /**
   * Search the tool registry.
   */
  search(query: MarketplaceSearch = {}): Tool[] {
    let results = Array.from(this.tools.values());

    if (query.status) {
      results = results.filter(t => t.status === query.status);
    }
    if (query.category) {
      results = results.filter(t => t.category.toLowerCase().includes(query.category!.toLowerCase()));
    }
    if (query.tags && query.tags.length > 0) {
      results = results.filter(t => query.tags!.some(tag => t.tags.includes(tag)));
    }
    if (query.minSuccessRate !== undefined) {
      results = results.filter(t => t.successRate >= query.minSuccessRate!);
    }
    if (query.query) {
      const lower = query.query.toLowerCase();
      results = results.filter(
        t =>
          t.name.toLowerCase().includes(lower) ||
          t.description.toLowerCase().includes(lower) ||
          t.tags.some(tag => tag.includes(lower)),
      );
    }
    if (query.limit !== undefined) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  /**
   * Get a tool by ID.
   */
  get(id: string): Tool | undefined {
    return this.tools.get(id);
  }

  /**
   * List all tools.
   */
  list(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get invocation history.
   */
  getInvocations(toolId?: string): ToolInvocation[] {
    if (toolId) return this.invocations.filter(i => i.toolId === toolId);
    return [...this.invocations];
  }
}

// ─── Agent Registry ───────────────────────────────────────────────────────────

export class AgentRegistry {
  private agents: Map<string, Agent> = new Map();
  private results: AgentResult[] = [];

  /**
   * Register an agent.
   */
  register(agent: Omit<Agent, 'memory' | 'invocationCount'>): Agent {
    const registered: Agent = {
      ...agent,
      memory: new Map(),
      invocationCount: 0,
    };
    this.agents.set(agent.id, registered);
    return registered;
  }

  /**
   * Assign a task to an agent.
   */
  async assign(task: AgentTask): Promise<AgentResult> {
    const agent = this.agents.get(task.agentId);
    if (!agent) throw new Error(`Agent "${task.agentId}" not found.`);
    if (agent.status === 'OFFLINE') throw new Error(`Agent "${task.agentId}" is offline.`);

    agent.status = 'WORKING';
    agent.invocationCount += 1;
    const startedAt = Date.now();

    let result: AgentResult;

    try {
      if (agent.handler) {
        result = await agent.handler(task);
      } else {
        result = {
          taskId: task.id,
          agentId: agent.id,
          status: 'SUCCESS',
          output: {
            message: `Agent "${agent.name}" (${agent.role}) received task: "${task.description}"`,
            input: task.input,
          },
          toolsUsed: [],
          latencyMs: Date.now() - startedAt,
          timestamp: Date.now(),
        };
      }
    } catch (err) {
      result = {
        taskId: task.id,
        agentId: agent.id,
        status: 'FAILED',
        output: null,
        reasoning: err instanceof Error ? err.message : String(err),
        toolsUsed: [],
        latencyMs: Date.now() - startedAt,
        timestamp: Date.now(),
      };
    }

    agent.status = 'IDLE';
    this.results.push(result);
    return result;
  }

  /**
   * Store a memory for an agent.
   */
  remember(agentId: string, key: string, value: unknown, ttl?: number): void {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    agent.memory.set(key, {
      key,
      value,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Recall a memory for an agent.
   */
  recall(agentId: string, key: string): unknown | undefined {
    const agent = this.agents.get(agentId);
    if (!agent) return undefined;

    const mem = agent.memory.get(key);
    if (!mem) return undefined;

    // Check TTL
    if (mem.ttl && Date.now() - mem.timestamp > mem.ttl) {
      agent.memory.delete(key);
      return undefined;
    }

    return mem.value;
  }

  /**
   * Get an agent.
   */
  get(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  /**
   * List agents, optionally by role.
   */
  list(role?: AgentRole): Agent[] {
    const all = Array.from(this.agents.values());
    if (role) return all.filter(a => a.role === role);
    return all;
  }

  /**
   * Get all results for an agent.
   */
  getResults(agentId?: string): AgentResult[] {
    if (agentId) return this.results.filter(r => r.agentId === agentId);
    return [...this.results];
  }
}

// ─── Team Manager ─────────────────────────────────────────────────────────────

export class TeamManager {
  private teams: Map<string, Team> = new Map();

  constructor(
    private agentRegistry: AgentRegistry,
    private toolRegistry: ToolRegistry,
  ) {}

  /**
   * Form a team from agents.
   */
  form(
    id: string,
    name: string,
    description: string,
    agentIds: string[],
    coordinatorId: string,
  ): Team {
    const team: Team = {
      id,
      name,
      description,
      agentIds,
      coordinatorId,
      sharedMemory: new Map(),
      status: 'IDLE',
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    };

    // Assign team to each agent
    for (const agentId of agentIds) {
      const agent = this.agentRegistry.get(agentId);
      if (agent) agent.teamId = id;
    }

    this.teams.set(id, team);
    return team;
  }

  /**
   * Broadcast a task to all team agents and collect results.
   */
  async broadcast(
    teamId: string,
    taskDescription: string,
    input: unknown,
    priority: AgentTask['priority'] = 'NORMAL',
  ): Promise<AgentResult[]> {
    const team = this.teams.get(teamId);
    if (!team) throw new Error(`Team "${teamId}" not found.`);

    team.status = 'ACTIVE';
    team.lastActiveAt = Date.now();

    const results = await Promise.all(
      team.agentIds.map(agentId =>
        this.agentRegistry.assign({
          id: `task_${Date.now()}_${agentId}`,
          agentId,
          description: taskDescription,
          input,
          priority,
        }),
      ),
    );

    team.status = 'IDLE';
    return results;
  }

  /**
   * Share a memory across the entire team.
   */
  shareMemory(teamId: string, key: string, value: unknown): void {
    const team = this.teams.get(teamId);
    if (!team) return;

    team.sharedMemory.set(key, {
      key,
      value,
      timestamp: Date.now(),
    });

    // Also push to each agent's memory
    for (const agentId of team.agentIds) {
      this.agentRegistry.remember(agentId, `team:${key}`, value);
    }
  }

  /**
   * Get a team.
   */
  get(id: string): Team | undefined {
    return this.teams.get(id);
  }

  /**
   * List all teams.
   */
  list(): Team[] {
    return Array.from(this.teams.values());
  }
}

// ─── Marketplace (unified facade) ────────────────────────────────────────────

/**
 * The unified AI Tools Marketplace.
 * One entry point for tools, agents, and teams.
 */
export class AIToolsMarketplace {
  public readonly tools: ToolRegistry;
  public readonly agents: AgentRegistry;
  public readonly teams: TeamManager;

  constructor() {
    this.tools = new ToolRegistry();
    this.agents = new AgentRegistry();
    this.teams = new TeamManager(this.agents, this.tools);

    this.registerBuiltinTools();
  }

  private registerBuiltinTools(): void {
    this.tools.register({
      id: 'echo',
      name: 'Echo',
      description: 'Returns the input unchanged. Useful for testing.',
      category: 'utilities',
      version: '1.0.0',
      inputSchema: {
        type: 'object',
        properties: { value: { type: 'any', description: 'Any value to echo back' } },
      },
      outputSchema: {
        type: 'object',
        properties: { value: { type: 'any', description: 'The echoed value' } },
      },
      status: 'AVAILABLE',
      author: 'ItsNotAILABS',
      tags: ['utility', 'debug', 'test'],
      handler: async (input) => ({ value: input }),
    });

    this.tools.register({
      id: 'timestamp',
      name: 'Timestamp',
      description: 'Returns the current Unix timestamp and ISO string.',
      category: 'utilities',
      version: '1.0.0',
      inputSchema: { type: 'object', properties: {} },
      outputSchema: {
        type: 'object',
        properties: {
          unix: { type: 'number', description: 'Unix timestamp in ms' },
          iso: { type: 'string', description: 'ISO 8601 string' },
        },
      },
      status: 'AVAILABLE',
      author: 'ItsNotAILABS',
      tags: ['utility', 'time'],
      handler: async () => ({ unix: Date.now(), iso: new Date().toISOString() }),
    });

    this.tools.register({
      id: 'json_validate',
      name: 'JSON Validate',
      description: 'Validates whether a string is valid JSON.',
      category: 'utilities',
      version: '1.0.0',
      inputSchema: {
        type: 'object',
        properties: { input: { type: 'string', description: 'String to validate as JSON' } },
        required: ['input'],
      },
      outputSchema: {
        type: 'object',
        properties: {
          valid: { type: 'boolean', description: 'Whether the input is valid JSON' },
          error: { type: 'string', description: 'Error message if invalid' },
        },
      },
      status: 'AVAILABLE',
      author: 'ItsNotAILABS',
      tags: ['utility', 'validation'],
      handler: async (input: unknown) => {
        const { input: str } = input as { input: string };
        try {
          JSON.parse(str);
          return { valid: true };
        } catch (e) {
          return { valid: false, error: (e as Error).message };
        }
      },
    });
  }

  /**
   * Quick-invoke: call a tool by id from anywhere.
   */
  async call(toolId: string, input: unknown, callerId?: string): Promise<unknown> {
    const invocation = await this.tools.invoke(toolId, input, callerId);
    if (invocation.status === 'FAILED') {
      throw new Error(`Tool "${toolId}" failed: ${invocation.error}`);
    }
    return invocation.output;
  }

  /**
   * Describe all available tools in a format suitable for LLM function calling.
   */
  describeTools(tags?: string[]): Array<{ name: string; description: string; parameters: ToolSchema }> {
    const tools = tags
      ? this.tools.search({ tags, status: 'AVAILABLE' })
      : this.tools.search({ status: 'AVAILABLE' });

    return tools.map(t => ({
      name: t.id,
      description: t.description,
      parameters: t.inputSchema,
    }));
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export default {
  ToolRegistry,
  AgentRegistry,
  TeamManager,
  AIToolsMarketplace,
};
