// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 DEEP RESEARCH LAB — LABORATORIUM INVESTIGATIONIS PROFUNDAE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Deep Research Lab installation tier system. Defines the progression path
 * from basic research capabilities to full sovereign research power.
 *
 * INSTALLATION TIER HIERARCHY:
 *
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │                DEEP RESEARCH LAB                                │
 *   │      "Laboratorium Investigationis Profundae"                   │
 *   ├─────────────────────────────────────────────────────────────────┤
 *   │                                                                 │
 *   │  TIER 1: APPRENTICE (Discipulus)                               │
 *   │  ├── Basic research queries                                     │
 *   │  ├── Single model access                                        │
 *   │  ├── 100 INT-TOK daily budget                                  │
 *   │  └── Community support                                          │
 *   │                                                                 │
 *   │  TIER 2: JOURNEYMAN (Viator)                                   │
 *   │  ├── Multi-model orchestration                                  │
 *   │  ├── Memory persistence (30 days)                               │
 *   │  ├── 1,000 INT-TOK daily budget                                │
 *   │  └── Priority support                                           │
 *   │                                                                 │
 *   │  TIER 3: MASTER (Magister)                                     │
 *   │  ├── Full model ensemble                                        │
 *   │  ├── Memory persistence (1 year)                                │
 *   │  ├── Custom research agents                                     │
 *   │  ├── 10,000 INT-TOK daily budget                               │
 *   │  └── Dedicated support                                          │
 *   │                                                                 │
 *   │  TIER 4: SOVEREIGN (Dominus)                                   │
 *   │  ├── Unlimited model access                                     │
 *   │  ├── Permanent memory                                           │
 *   │  ├── Custom model training                                      │
 *   │  ├── Research paper generation                                  │
 *   │  ├── Unlimited INT-TOK                                         │
 *   │  └── White-glove support                                        │
 *   │                                                                 │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * @version 1.0.0 (Fibonacci)
 * @designation (DEEP-RESEARCH-LAB)
 */

const PHI = 1.6180339887498948482;
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type InstallationTier =
  | 'APPRENTICE'
  | 'JOURNEYMAN'
  | 'MASTER'
  | 'SOVEREIGN';

export type ResearchCapability =
  | 'BASIC_QUERIES'
  | 'MULTI_MODEL'
  | 'MODEL_ENSEMBLE'
  | 'CUSTOM_AGENTS'
  | 'CUSTOM_TRAINING'
  | 'PAPER_GENERATION'
  | 'MEMORY_PERSISTENCE'
  | 'PERMANENT_MEMORY'
  | 'PRIORITY_SUPPORT'
  | 'DEDICATED_SUPPORT'
  | 'WHITE_GLOVE_SUPPORT';

export type ResearchDomain =
  | 'ARTIFICIAL_INTELLIGENCE'
  | 'MACHINE_LEARNING'
  | 'NATURAL_LANGUAGE'
  | 'COMPUTER_VISION'
  | 'ROBOTICS'
  | 'QUANTUM_COMPUTING'
  | 'NEUROSCIENCE'
  | 'BIOINFORMATICS'
  | 'MATERIALS_SCIENCE'
  | 'MATHEMATICS'
  | 'PHYSICS'
  | 'CHEMISTRY'
  | 'GENERAL';

export interface TierDefinition {
  tier: InstallationTier;
  latinName: string;
  description: string;
  glyph: string;
  color: string;
  capabilities: ResearchCapability[];
  dailyIntTokBudget: number;
  memoryRetentionDays: number;
  modelAccess: number; // Number of models accessible
  customAgents: number;
  supportLevel: 'COMMUNITY' | 'PRIORITY' | 'DEDICATED' | 'WHITE_GLOVE';
  monthlyPrice: number;
  requirements: TierRequirements;
}

export interface TierRequirements {
  minimumUsageDays: number;
  minimumResearchProjects: number;
  minimumIntTokSpent: number;
  requiredCapabilities: ResearchCapability[];
}

export interface ResearchInstallation {
  id: string;
  userId: string;
  tier: InstallationTier;
  
  // Status
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  activatedAt: number;
  expiresAt: number | null;
  
  // Usage
  intTokUsedToday: number;
  intTokUsedTotal: number;
  lastResetTime: number;
  researchProjects: number;
  papersGenerated: number;
  
  // Configuration
  enabledDomains: ResearchDomain[];
  customAgents: ResearchAgent[];
  memoryRetentionOverride: number | null;
  
  // Metrics
  phiAlignment: number;
  qualityScore: number;
  upgradeProgress: number; // 0-1 progress to next tier
}

export interface ResearchAgent {
  id: string;
  name: string;
  latinName: string;
  domain: ResearchDomain;
  capabilities: string[];
  modelPreferences: string[];
  created: number;
  lastUsed: number;
  tasksCompleted: number;
}

export interface ResearchProject {
  id: string;
  installationId: string;
  title: string;
  domain: ResearchDomain;
  status: 'PLANNING' | 'IN_PROGRESS' | 'ANALYSIS' | 'COMPLETED' | 'ARCHIVED';
  
  // Content
  hypothesis: string;
  methodology: string;
  findings: string[];
  conclusions: string[];
  
  // Metrics
  intTokUsed: number;
  modelsUsed: string[];
  agentsUsed: string[];
  
  // Timing
  created: number;
  started: number | null;
  completed: number | null;
}

export interface UpgradeResult {
  success: boolean;
  previousTier: InstallationTier;
  newTier: InstallationTier;
  message: string;
  unlockedCapabilities: ResearchCapability[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIER DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const TIER_DEFINITIONS: Record<InstallationTier, TierDefinition> = {
  APPRENTICE: {
    tier: 'APPRENTICE',
    latinName: 'Discipulus Investigationis',
    description: 'Entry-level research tier with basic capabilities. Perfect for learning and exploration.',
    glyph: '📚',
    color: '#6b7280',
    capabilities: ['BASIC_QUERIES'],
    dailyIntTokBudget: 100,
    memoryRetentionDays: 7,
    modelAccess: 1,
    customAgents: 0,
    supportLevel: 'COMMUNITY',
    monthlyPrice: 0,
    requirements: {
      minimumUsageDays: 0,
      minimumResearchProjects: 0,
      minimumIntTokSpent: 0,
      requiredCapabilities: [],
    },
  },
  JOURNEYMAN: {
    tier: 'JOURNEYMAN',
    latinName: 'Viator Scientiae',
    description: 'Intermediate research tier with multi-model access and extended memory.',
    glyph: '🔬',
    color: '#3b82f6',
    capabilities: ['BASIC_QUERIES', 'MULTI_MODEL', 'MEMORY_PERSISTENCE', 'PRIORITY_SUPPORT'],
    dailyIntTokBudget: 1000,
    memoryRetentionDays: 30,
    modelAccess: 5,
    customAgents: 1,
    supportLevel: 'PRIORITY',
    monthlyPrice: 29,
    requirements: {
      minimumUsageDays: 7,
      minimumResearchProjects: 1,
      minimumIntTokSpent: 500,
      requiredCapabilities: ['BASIC_QUERIES'],
    },
  },
  MASTER: {
    tier: 'MASTER',
    latinName: 'Magister Cognitionis',
    description: 'Advanced research tier with model ensemble and custom research agents.',
    glyph: '🧪',
    color: '#8b5cf6',
    capabilities: [
      'BASIC_QUERIES',
      'MULTI_MODEL',
      'MODEL_ENSEMBLE',
      'CUSTOM_AGENTS',
      'MEMORY_PERSISTENCE',
      'DEDICATED_SUPPORT',
    ],
    dailyIntTokBudget: 10000,
    memoryRetentionDays: 365,
    modelAccess: 20,
    customAgents: 5,
    supportLevel: 'DEDICATED',
    monthlyPrice: 199,
    requirements: {
      minimumUsageDays: 30,
      minimumResearchProjects: 10,
      minimumIntTokSpent: 10000,
      requiredCapabilities: ['BASIC_QUERIES', 'MULTI_MODEL', 'MEMORY_PERSISTENCE'],
    },
  },
  SOVEREIGN: {
    tier: 'SOVEREIGN',
    latinName: 'Dominus Veritatis',
    description: 'Ultimate research tier with unlimited access, custom training, and paper generation.',
    glyph: '👑',
    color: '#fbbf24',
    capabilities: [
      'BASIC_QUERIES',
      'MULTI_MODEL',
      'MODEL_ENSEMBLE',
      'CUSTOM_AGENTS',
      'CUSTOM_TRAINING',
      'PAPER_GENERATION',
      'PERMANENT_MEMORY',
      'WHITE_GLOVE_SUPPORT',
    ],
    dailyIntTokBudget: Infinity,
    memoryRetentionDays: Infinity,
    modelAccess: Infinity,
    customAgents: Infinity,
    supportLevel: 'WHITE_GLOVE',
    monthlyPrice: 999,
    requirements: {
      minimumUsageDays: 90,
      minimumResearchProjects: 50,
      minimumIntTokSpent: 100000,
      requiredCapabilities: ['BASIC_QUERIES', 'MULTI_MODEL', 'MODEL_ENSEMBLE', 'CUSTOM_AGENTS'],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEEP RESEARCH LAB CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class DeepResearchLab {
  public readonly designation = '(DEEP-RESEARCH-LAB)';

  private installations: Map<string, ResearchInstallation> = new Map();
  private projects: Map<string, ResearchProject> = new Map();
  private totalInstallations: number = 0;
  private totalProjects: number = 0;

  constructor() {}

  // ─── Installation Management ────────────────────────────────────────────────

  /**
   * Create a new research installation.
   */
  createInstallation(userId: string, tier: InstallationTier = 'APPRENTICE'): ResearchInstallation {
    const tierDef = TIER_DEFINITIONS[tier];
    
    const installation: ResearchInstallation = {
      id: `INSTALL_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      tier,
      status: 'ACTIVE',
      activatedAt: Date.now(),
      expiresAt: tier === 'APPRENTICE' ? null : Date.now() + 30 * 24 * 60 * 60 * 1000,
      intTokUsedToday: 0,
      intTokUsedTotal: 0,
      lastResetTime: Date.now(),
      researchProjects: 0,
      papersGenerated: 0,
      enabledDomains: ['GENERAL'],
      customAgents: [],
      memoryRetentionOverride: null,
      phiAlignment: PHI / (PHI + 1),
      qualityScore: 0.85,
      upgradeProgress: 0,
    };

    this.installations.set(installation.id, installation);
    this.totalInstallations++;

    return installation;
  }

  /**
   * Get installation by ID.
   */
  getInstallation(installationId: string): ResearchInstallation | undefined {
    return this.installations.get(installationId);
  }

  /**
   * Get installations by user.
   */
  getInstallationsByUser(userId: string): ResearchInstallation[] {
    return Array.from(this.installations.values()).filter(
      (i) => i.userId === userId
    );
  }

  /**
   * Get installations by tier.
   */
  getInstallationsByTier(tier: InstallationTier): ResearchInstallation[] {
    return Array.from(this.installations.values()).filter(
      (i) => i.tier === tier
    );
  }

  /**
   * Upgrade installation to next tier.
   */
  upgradeInstallation(installationId: string): UpgradeResult {
    const installation = this.installations.get(installationId);
    if (!installation) {
      return {
        success: false,
        previousTier: 'APPRENTICE',
        newTier: 'APPRENTICE',
        message: 'Installation not found',
        unlockedCapabilities: [],
      };
    }

    const tierOrder: InstallationTier[] = ['APPRENTICE', 'JOURNEYMAN', 'MASTER', 'SOVEREIGN'];
    const currentIndex = tierOrder.indexOf(installation.tier);
    
    if (currentIndex >= tierOrder.length - 1) {
      return {
        success: false,
        previousTier: installation.tier,
        newTier: installation.tier,
        message: 'Already at maximum tier (SOVEREIGN)',
        unlockedCapabilities: [],
      };
    }

    const nextTier = tierOrder[currentIndex + 1];
    const nextTierDef = TIER_DEFINITIONS[nextTier];
    const currentTierDef = TIER_DEFINITIONS[installation.tier];

    // Check requirements
    const req = nextTierDef.requirements;
    const usageDays = Math.floor((Date.now() - installation.activatedAt) / (24 * 60 * 60 * 1000));
    
    if (usageDays < req.minimumUsageDays) {
      return {
        success: false,
        previousTier: installation.tier,
        newTier: installation.tier,
        message: `Requires ${req.minimumUsageDays} days of usage (current: ${usageDays})`,
        unlockedCapabilities: [],
      };
    }

    if (installation.researchProjects < req.minimumResearchProjects) {
      return {
        success: false,
        previousTier: installation.tier,
        newTier: installation.tier,
        message: `Requires ${req.minimumResearchProjects} research projects (current: ${installation.researchProjects})`,
        unlockedCapabilities: [],
      };
    }

    if (installation.intTokUsedTotal < req.minimumIntTokSpent) {
      return {
        success: false,
        previousTier: installation.tier,
        newTier: installation.tier,
        message: `Requires ${req.minimumIntTokSpent} INT-TOK spent (current: ${installation.intTokUsedTotal})`,
        unlockedCapabilities: [],
      };
    }

    // Perform upgrade
    const previousTier = installation.tier;
    installation.tier = nextTier;
    installation.upgradeProgress = 0;

    // Calculate unlocked capabilities
    const unlockedCapabilities = nextTierDef.capabilities.filter(
      (cap) => !currentTierDef.capabilities.includes(cap)
    );

    return {
      success: true,
      previousTier,
      newTier: nextTier,
      message: `Upgraded to ${nextTierDef.latinName}`,
      unlockedCapabilities,
    };
  }

  /**
   * Check if installation can perform a capability.
   */
  canPerformCapability(installationId: string, capability: ResearchCapability): boolean {
    const installation = this.installations.get(installationId);
    if (!installation || installation.status !== 'ACTIVE') {
      return false;
    }

    const tierDef = TIER_DEFINITIONS[installation.tier];
    return tierDef.capabilities.includes(capability);
  }

  /**
   * Use INT-TOK tokens from installation budget.
   */
  useIntTok(installationId: string, amount: number): boolean {
    const installation = this.installations.get(installationId);
    if (!installation || installation.status !== 'ACTIVE') {
      return false;
    }

    const tierDef = TIER_DEFINITIONS[installation.tier];
    
    // Reset daily budget if needed
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    if (now - installation.lastResetTime > dayMs) {
      installation.intTokUsedToday = 0;
      installation.lastResetTime = now;
    }

    // Check budget
    if (installation.intTokUsedToday + amount > tierDef.dailyIntTokBudget) {
      return false;
    }

    installation.intTokUsedToday += amount;
    installation.intTokUsedTotal += amount;
    
    // Update upgrade progress
    this.updateUpgradeProgress(installationId);

    return true;
  }

  /**
   * Get remaining daily INT-TOK budget.
   */
  getRemainingBudget(installationId: string): number {
    const installation = this.installations.get(installationId);
    if (!installation) {
      return 0;
    }

    const tierDef = TIER_DEFINITIONS[installation.tier];
    if (!Number.isFinite(tierDef.dailyIntTokBudget)) {
      return Infinity;
    }

    return Math.max(0, tierDef.dailyIntTokBudget - installation.intTokUsedToday);
  }

  // ─── Research Projects ──────────────────────────────────────────────────────

  /**
   * Create a new research project.
   */
  createProject(
    installationId: string,
    title: string,
    domain: ResearchDomain,
    hypothesis: string
  ): ResearchProject | null {
    const installation = this.installations.get(installationId);
    if (!installation || installation.status !== 'ACTIVE') {
      return null;
    }

    const project: ResearchProject = {
      id: `PROJECT_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      installationId,
      title,
      domain,
      status: 'PLANNING',
      hypothesis,
      methodology: '',
      findings: [],
      conclusions: [],
      intTokUsed: 0,
      modelsUsed: [],
      agentsUsed: [],
      created: Date.now(),
      started: null,
      completed: null,
    };

    this.projects.set(project.id, project);
    this.totalProjects++;
    installation.researchProjects++;

    // Add domain to enabled domains if not already
    if (!installation.enabledDomains.includes(domain)) {
      installation.enabledDomains.push(domain);
    }

    return project;
  }

  /**
   * Get project by ID.
   */
  getProject(projectId: string): ResearchProject | undefined {
    return this.projects.get(projectId);
  }

  /**
   * Get projects for an installation.
   */
  getProjectsForInstallation(installationId: string): ResearchProject[] {
    return Array.from(this.projects.values()).filter(
      (p) => p.installationId === installationId
    );
  }

  /**
   * Update project status.
   */
  updateProjectStatus(projectId: string, status: ResearchProject['status']): boolean {
    const project = this.projects.get(projectId);
    if (!project) {
      return false;
    }

    project.status = status;
    if (status === 'IN_PROGRESS' && !project.started) {
      project.started = Date.now();
    }
    if (status === 'COMPLETED' && !project.completed) {
      project.completed = Date.now();
    }

    return true;
  }

  /**
   * Add finding to project.
   */
  addFinding(projectId: string, finding: string): boolean {
    const project = this.projects.get(projectId);
    if (!project) {
      return false;
    }

    project.findings.push(finding);
    return true;
  }

  /**
   * Add conclusion to project.
   */
  addConclusion(projectId: string, conclusion: string): boolean {
    const project = this.projects.get(projectId);
    if (!project) {
      return false;
    }

    project.conclusions.push(conclusion);
    return true;
  }

  // ─── Custom Research Agents ─────────────────────────────────────────────────

  /**
   * Create a custom research agent.
   */
  createAgent(
    installationId: string,
    name: string,
    domain: ResearchDomain,
    capabilities: string[]
  ): ResearchAgent | null {
    const installation = this.installations.get(installationId);
    if (!installation || installation.status !== 'ACTIVE') {
      return null;
    }

    const tierDef = TIER_DEFINITIONS[installation.tier];
    if (installation.customAgents.length >= tierDef.customAgents) {
      return null;
    }

    const agent: ResearchAgent = {
      id: `AGENT_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      latinName: `Agentum ${name.replace(/\s+/g, '')}`,
      domain,
      capabilities,
      modelPreferences: [],
      created: Date.now(),
      lastUsed: Date.now(),
      tasksCompleted: 0,
    };

    installation.customAgents.push(agent);
    return agent;
  }

  /**
   * Get agents for an installation.
   */
  getAgentsForInstallation(installationId: string): ResearchAgent[] {
    const installation = this.installations.get(installationId);
    return installation ? installation.customAgents : [];
  }

  // ─── Internal ───────────────────────────────────────────────────────────────

  private updateUpgradeProgress(installationId: string): void {
    const installation = this.installations.get(installationId);
    if (!installation) {
      return;
    }

    const tierOrder: InstallationTier[] = ['APPRENTICE', 'JOURNEYMAN', 'MASTER', 'SOVEREIGN'];
    const currentIndex = tierOrder.indexOf(installation.tier);
    
    if (currentIndex >= tierOrder.length - 1) {
      installation.upgradeProgress = 1.0;
      return;
    }

    const nextTier = tierOrder[currentIndex + 1];
    const nextTierDef = TIER_DEFINITIONS[nextTier];
    const req = nextTierDef.requirements;

    const usageDays = Math.floor((Date.now() - installation.activatedAt) / (24 * 60 * 60 * 1000));
    
    const daysProgress = req.minimumUsageDays > 0 ? Math.min(1, usageDays / req.minimumUsageDays) : 1;
    const projectsProgress = req.minimumResearchProjects > 0 
      ? Math.min(1, installation.researchProjects / req.minimumResearchProjects) 
      : 1;
    const tokensProgress = req.minimumIntTokSpent > 0 
      ? Math.min(1, installation.intTokUsedTotal / req.minimumIntTokSpent) 
      : 1;

    installation.upgradeProgress = (daysProgress + projectsProgress + tokensProgress) / 3;
  }

  // ─── Statistics ─────────────────────────────────────────────────────────────

  /**
   * Get lab statistics.
   */
  getStatistics(): {
    totalInstallations: number;
    activeInstallations: number;
    totalProjects: number;
    completedProjects: number;
    installationsByTier: Record<InstallationTier, number>;
    totalIntTokUsed: number;
  } {
    const installations = Array.from(this.installations.values());
    const projects = Array.from(this.projects.values());

    const installationsByTier: Record<InstallationTier, number> = {
      APPRENTICE: 0,
      JOURNEYMAN: 0,
      MASTER: 0,
      SOVEREIGN: 0,
    };

    for (const inst of installations) {
      installationsByTier[inst.tier]++;
    }

    return {
      totalInstallations: this.totalInstallations,
      activeInstallations: installations.filter((i) => i.status === 'ACTIVE').length,
      totalProjects: this.totalProjects,
      completedProjects: projects.filter((p) => p.status === 'COMPLETED').length,
      installationsByTier,
      totalIntTokUsed: installations.reduce((sum, i) => sum + i.intTokUsedTotal, 0),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

let deepResearchLabInstance: DeepResearchLab | null = null;

export function getDeepResearchLab(): DeepResearchLab {
  if (!deepResearchLabInstance) {
    deepResearchLabInstance = new DeepResearchLab();
  }
  return deepResearchLabInstance;
}

export function resetDeepResearchLab(): void {
  deepResearchLabInstance = null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get tier definition.
 */
export function getTierDefinition(tier: InstallationTier): TierDefinition {
  return TIER_DEFINITIONS[tier];
}

/**
 * Get all tier definitions.
 */
export function getAllTierDefinitions(): TierDefinition[] {
  return Object.values(TIER_DEFINITIONS);
}

/**
 * Get color for tier.
 */
export function getTierColor(tier: InstallationTier): string {
  return TIER_DEFINITIONS[tier].color;
}

/**
 * Get glyph for tier.
 */
export function getTierGlyph(tier: InstallationTier): string {
  return TIER_DEFINITIONS[tier].glyph;
}

/**
 * Format installation for display.
 */
export function formatInstallation(installation: ResearchInstallation): string {
  const tierDef = TIER_DEFINITIONS[installation.tier];
  return `${tierDef.glyph} ${tierDef.latinName} [${installation.status}] — ${installation.researchProjects} projects`;
}

/**
 * Get next tier for upgrade.
 */
export function getNextTier(currentTier: InstallationTier): InstallationTier | null {
  const tierOrder: InstallationTier[] = ['APPRENTICE', 'JOURNEYMAN', 'MASTER', 'SOVEREIGN'];
  const currentIndex = tierOrder.indexOf(currentTier);
  
  if (currentIndex >= tierOrder.length - 1) {
    return null;
  }
  
  return tierOrder[currentIndex + 1];
}
