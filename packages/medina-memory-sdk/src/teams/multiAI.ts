/**
 * Sub-SDK 10: Multi-AI Teams
 * Multi-AI expansions — form teams of AI agents with shared memory,
 * callable assistants, and coordinated workflows.
 */

export type AIModel =
  | 'gpt-4o'
  | 'claude-3-5-sonnet'
  | 'claude-3-opus'
  | 'gemini-pro'
  | 'llama-3'
  | 'mistral-large'
  | 'custom';

export type TeamRole =
  | 'LEAD'          // Coordinates the team, makes final decisions
  | 'ANALYST'       // Analyzes data, provides insights
  | 'BUILDER'       // Constructs outputs, writes code
  | 'CRITIC'        // Reviews, finds flaws, improves
  | 'RESEARCHER'    // Gathers information, context
  | 'SYNTHESIZER';  // Combines outputs into final form

export interface AITeamMember {
  id: string;
  name: string;
  model: AIModel;
  role: TeamRole;
  systemPrompt?: string;
  tools: string[];      // tool IDs this member can call
  memory: Map<string, unknown>;
  active: boolean;
  taskCount: number;
}

export interface TeamTask {
  id: string;
  title: string;
  description: string;
  input: unknown;
  assignedTo?: string; // memberId or 'all'
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  deadline?: number;
}

export interface TeamOutput {
  taskId: string;
  memberId: string;
  role: TeamRole;
  content: unknown;
  reasoning?: string;
  confidence: number;
  timestamp: number;
}

export interface TeamConsensus {
  taskId: string;
  participantCount: number;
  outputs: TeamOutput[];
  synthesis: unknown;
  confidence: number;
  dissent: TeamOutput[];
  timestamp: number;
}

export class MultiAITeam {
  private members: Map<string, AITeamMember> = new Map();
  private sharedMemory: Map<string, unknown> = new Map();
  private outputs: TeamOutput[] = [];

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
  ) {}

  /**
   * Add a member to the team.
   */
  addMember(
    id: string,
    name: string,
    model: AIModel,
    role: TeamRole,
    options: { systemPrompt?: string; tools?: string[] } = {},
  ): AITeamMember {
    const member: AITeamMember = {
      id,
      name,
      model,
      role,
      systemPrompt: options.systemPrompt,
      tools: options.tools ?? [],
      memory: new Map(),
      active: true,
      taskCount: 0,
    };
    this.members.set(id, member);
    return member;
  }

  /**
   * Share a piece of knowledge with the entire team.
   */
  share(key: string, value: unknown): void {
    this.sharedMemory.set(key, value);
    for (const member of this.members.values()) {
      member.memory.set(`team:${key}`, value);
    }
  }

  /**
   * Recall shared team knowledge.
   */
  recall(key: string): unknown | undefined {
    return this.sharedMemory.get(key);
  }

  /**
   * Submit an output from a member (used when integrating with actual AI calls).
   */
  submitOutput(memberId: string, taskId: string, content: unknown, reasoning?: string, confidence = 0.8): TeamOutput {
    const member = this.members.get(memberId);
    if (!member) throw new Error(`Member "${memberId}" not found.`);

    const output: TeamOutput = {
      taskId,
      memberId,
      role: member.role,
      content,
      reasoning,
      confidence,
      timestamp: Date.now(),
    };

    member.taskCount += 1;
    this.outputs.push(output);
    return output;
  }

  /**
   * Build a consensus from all outputs for a task.
   * The SYNTHESIZER role's output becomes the synthesis if present.
   * Outputs below 0.5 confidence become dissent.
   */
  buildConsensus(taskId: string): TeamConsensus {
    const taskOutputs = this.outputs.filter(o => o.taskId === taskId);
    const highConfidence = taskOutputs.filter(o => o.confidence >= 0.5);
    const dissent = taskOutputs.filter(o => o.confidence < 0.5);

    const synthesizerOutput = taskOutputs.find(o => o.role === 'SYNTHESIZER');
    const leadOutput = taskOutputs.find(o => o.role === 'LEAD');
    const synthesis = synthesizerOutput?.content ?? leadOutput?.content ?? taskOutputs[0]?.content ?? null;

    const avgConfidence = taskOutputs.length > 0
      ? taskOutputs.reduce((sum, o) => sum + o.confidence, 0) / taskOutputs.length
      : 0;

    return {
      taskId,
      participantCount: highConfidence.length,
      outputs: highConfidence,
      synthesis,
      confidence: avgConfidence,
      dissent,
      timestamp: Date.now(),
    };
  }

  /**
   * Get callable assistant descriptions for LLM function calling.
   * Describes each team member as a callable function.
   */
  describeAssistants(): Array<{
    name: string;
    description: string;
    model: AIModel;
    role: TeamRole;
    tools: string[];
  }> {
    return Array.from(this.members.values())
      .filter(m => m.active)
      .map(m => ({
        name: m.id,
        description: `${m.name} (${m.role}) — powered by ${m.model}. Available tools: ${m.tools.join(', ') || 'none'}.`,
        model: m.model,
        role: m.role,
        tools: m.tools,
      }));
  }

  /**
   * Get a member by ID.
   */
  getMember(id: string): AITeamMember | undefined {
    return this.members.get(id);
  }

  /**
   * Get the team lead.
   */
  getLead(): AITeamMember | undefined {
    return Array.from(this.members.values()).find(m => m.role === 'LEAD');
  }

  /**
   * List all members.
   */
  listMembers(): AITeamMember[] {
    return Array.from(this.members.values());
  }

  /**
   * Get team statistics.
   */
  stats(): {
    memberCount: number;
    activeMembers: number;
    totalTasks: number;
    sharedMemorySize: number;
  } {
    return {
      memberCount: this.members.size,
      activeMembers: Array.from(this.members.values()).filter(m => m.active).length,
      totalTasks: Array.from(this.members.values()).reduce((sum, m) => sum + m.taskCount, 0),
      sharedMemorySize: this.sharedMemory.size,
    };
  }
}

/**
 * Factory: create a standard research team.
 */
export function createResearchTeam(id: string, name: string): MultiAITeam {
  const team = new MultiAITeam(id, name, 'Research team with lead, analyst, researcher, critic, and synthesizer.');
  team.addMember('lead', 'Lead Coordinator', 'claude-3-opus', 'LEAD', {
    systemPrompt: 'You coordinate the research team and make final decisions.',
  });
  team.addMember('analyst', 'Data Analyst', 'gpt-4o', 'ANALYST', {
    systemPrompt: 'You analyze data and provide quantitative insights.',
  });
  team.addMember('researcher', 'Context Researcher', 'gemini-pro', 'RESEARCHER', {
    systemPrompt: 'You gather background information and relevant context.',
  });
  team.addMember('critic', 'Critical Reviewer', 'claude-3-5-sonnet', 'CRITIC', {
    systemPrompt: 'You identify flaws, gaps, and improvements in outputs.',
  });
  team.addMember('synthesizer', 'Synthesis Agent', 'claude-3-opus', 'SYNTHESIZER', {
    systemPrompt: 'You combine all outputs into a final, coherent result.',
  });
  return team;
}

/**
 * Factory: create a standard builder team.
 */
export function createBuilderTeam(id: string, name: string): MultiAITeam {
  const team = new MultiAITeam(id, name, 'Builder team: lead, two builders, critic, synthesizer.');
  team.addMember('lead', 'Build Lead', 'claude-3-opus', 'LEAD');
  team.addMember('builder-1', 'Primary Builder', 'gpt-4o', 'BUILDER');
  team.addMember('builder-2', 'Secondary Builder', 'claude-3-5-sonnet', 'BUILDER');
  team.addMember('critic', 'Code Reviewer', 'claude-3-opus', 'CRITIC');
  team.addMember('synthesizer', 'Integration Agent', 'claude-3-5-sonnet', 'SYNTHESIZER');
  return team;
}
