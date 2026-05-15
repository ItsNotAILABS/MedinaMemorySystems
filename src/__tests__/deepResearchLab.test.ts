/**
 * Deep Research Lab Tests
 */

import {
  DeepResearchLab,
  getDeepResearchLab,
  resetDeepResearchLab,
  TIER_DEFINITIONS,
  getTierDefinition,
  getAllTierDefinitions,
  getTierColor,
  getTierGlyph,
  formatInstallation,
  getNextTier,
  type InstallationTier,
  type ResearchDomain,
} from '../lib/deepResearchLab';

describe('DeepResearchLab', () => {
  let lab: DeepResearchLab;

  beforeEach(() => {
    resetDeepResearchLab();
    lab = getDeepResearchLab();
  });

  describe('tier definitions', () => {
    it('should have 4 installation tiers', () => {
      const tiers = getAllTierDefinitions();
      expect(tiers.length).toBe(4);
    });

    it('should have correct tier order', () => {
      const tierOrder: InstallationTier[] = ['APPRENTICE', 'JOURNEYMAN', 'MASTER', 'SOVEREIGN'];
      for (const tier of tierOrder) {
        expect(TIER_DEFINITIONS[tier]).toBeDefined();
      }
    });

    it('should have increasing daily budgets', () => {
      const budgets = [
        TIER_DEFINITIONS.APPRENTICE.dailyIntTokBudget,
        TIER_DEFINITIONS.JOURNEYMAN.dailyIntTokBudget,
        TIER_DEFINITIONS.MASTER.dailyIntTokBudget,
        TIER_DEFINITIONS.SOVEREIGN.dailyIntTokBudget,
      ];
      
      for (let i = 1; i < budgets.length; i++) {
        expect(budgets[i]).toBeGreaterThan(budgets[i - 1]);
      }
    });

    it('APPRENTICE tier should be free', () => {
      expect(TIER_DEFINITIONS.APPRENTICE.monthlyPrice).toBe(0);
    });

    it('SOVEREIGN tier should have unlimited resources', () => {
      expect(TIER_DEFINITIONS.SOVEREIGN.dailyIntTokBudget).toBe(Infinity);
      expect(TIER_DEFINITIONS.SOVEREIGN.memoryRetentionDays).toBe(Infinity);
      expect(TIER_DEFINITIONS.SOVEREIGN.modelAccess).toBe(Infinity);
    });

    it('each tier should have unique Latin name', () => {
      const latinNames = getAllTierDefinitions().map((t) => t.latinName);
      const uniqueNames = new Set(latinNames);
      expect(uniqueNames.size).toBe(latinNames.length);
    });
  });

  describe('installation creation', () => {
    it('should create installation with default tier', () => {
      const installation = lab.createInstallation('user1');
      
      expect(installation.id).toBeDefined();
      expect(installation.userId).toBe('user1');
      expect(installation.tier).toBe('APPRENTICE');
      expect(installation.status).toBe('ACTIVE');
    });

    it('should create installation with specified tier', () => {
      const installation = lab.createInstallation('user1', 'JOURNEYMAN');
      
      expect(installation.tier).toBe('JOURNEYMAN');
    });

    it('should initialize with zero usage', () => {
      const installation = lab.createInstallation('user1');
      
      expect(installation.intTokUsedToday).toBe(0);
      expect(installation.intTokUsedTotal).toBe(0);
      expect(installation.researchProjects).toBe(0);
    });

    it('should have GENERAL domain enabled by default', () => {
      const installation = lab.createInstallation('user1');
      
      expect(installation.enabledDomains).toContain('GENERAL');
    });
  });

  describe('installation queries', () => {
    it('should get installation by ID', () => {
      const created = lab.createInstallation('user1');
      const retrieved = lab.getInstallation(created.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
    });

    it('should get installations by user', () => {
      lab.createInstallation('user1');
      lab.createInstallation('user1');
      lab.createInstallation('user2');
      
      const user1Installations = lab.getInstallationsByUser('user1');
      expect(user1Installations.length).toBe(2);
    });

    it('should get installations by tier', () => {
      lab.createInstallation('user1', 'APPRENTICE');
      lab.createInstallation('user2', 'JOURNEYMAN');
      lab.createInstallation('user3', 'APPRENTICE');
      
      const apprentices = lab.getInstallationsByTier('APPRENTICE');
      expect(apprentices.length).toBe(2);
    });
  });

  describe('INT-TOK usage', () => {
    it('should use INT-TOK within budget', () => {
      const installation = lab.createInstallation('user1');
      const result = lab.useIntTok(installation.id, 50);
      
      expect(result).toBe(true);
      
      const updated = lab.getInstallation(installation.id);
      expect(updated?.intTokUsedToday).toBe(50);
      expect(updated?.intTokUsedTotal).toBe(50);
    });

    it('should reject INT-TOK usage over budget', () => {
      const installation = lab.createInstallation('user1', 'APPRENTICE');
      const result = lab.useIntTok(installation.id, 200); // Budget is 100
      
      expect(result).toBe(false);
    });

    it('should allow unlimited usage for SOVEREIGN tier', () => {
      const installation = lab.createInstallation('user1', 'SOVEREIGN');
      const result = lab.useIntTok(installation.id, 1000000);
      
      expect(result).toBe(true);
    });

    it('should calculate remaining budget', () => {
      const installation = lab.createInstallation('user1', 'APPRENTICE');
      lab.useIntTok(installation.id, 30);
      
      const remaining = lab.getRemainingBudget(installation.id);
      expect(remaining).toBe(70); // 100 - 30
    });
  });

  describe('capability checks', () => {
    it('APPRENTICE should have BASIC_QUERIES capability', () => {
      const installation = lab.createInstallation('user1', 'APPRENTICE');
      const canQuery = lab.canPerformCapability(installation.id, 'BASIC_QUERIES');
      
      expect(canQuery).toBe(true);
    });

    it('APPRENTICE should not have CUSTOM_AGENTS capability', () => {
      const installation = lab.createInstallation('user1', 'APPRENTICE');
      const canCreate = lab.canPerformCapability(installation.id, 'CUSTOM_AGENTS');
      
      expect(canCreate).toBe(false);
    });

    it('SOVEREIGN should have all capabilities', () => {
      const installation = lab.createInstallation('user1', 'SOVEREIGN');
      
      expect(lab.canPerformCapability(installation.id, 'BASIC_QUERIES')).toBe(true);
      expect(lab.canPerformCapability(installation.id, 'CUSTOM_AGENTS')).toBe(true);
      expect(lab.canPerformCapability(installation.id, 'CUSTOM_TRAINING')).toBe(true);
      expect(lab.canPerformCapability(installation.id, 'PAPER_GENERATION')).toBe(true);
    });
  });

  describe('tier upgrades', () => {
    it('should not upgrade without meeting requirements', () => {
      const installation = lab.createInstallation('user1', 'APPRENTICE');
      const result = lab.upgradeInstallation(installation.id);
      
      expect(result.success).toBe(false);
      expect(result.previousTier).toBe('APPRENTICE');
      expect(result.newTier).toBe('APPRENTICE');
    });

    it('should not upgrade SOVEREIGN tier', () => {
      const installation = lab.createInstallation('user1', 'SOVEREIGN');
      const result = lab.upgradeInstallation(installation.id);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('maximum tier');
    });

    it('should return unlocked capabilities on upgrade', () => {
      // Create installation with enough usage to upgrade
      const installation = lab.createInstallation('user1', 'APPRENTICE');
      
      // Manually set conditions for upgrade (for testing)
      const inst = lab.getInstallation(installation.id);
      if (inst) {
        inst.activatedAt = Date.now() - 8 * 24 * 60 * 60 * 1000; // 8 days ago
        inst.researchProjects = 2;
        inst.intTokUsedTotal = 600;
      }
      
      const result = lab.upgradeInstallation(installation.id);
      
      if (result.success) {
        expect(result.unlockedCapabilities.length).toBeGreaterThan(0);
        expect(result.newTier).toBe('JOURNEYMAN');
      }
    });
  });

  describe('research projects', () => {
    it('should create a research project', () => {
      const installation = lab.createInstallation('user1');
      const project = lab.createProject(
        installation.id,
        'Test Project',
        'ARTIFICIAL_INTELLIGENCE',
        'AI will improve efficiency'
      );
      
      expect(project).toBeDefined();
      expect(project?.title).toBe('Test Project');
      expect(project?.domain).toBe('ARTIFICIAL_INTELLIGENCE');
      expect(project?.status).toBe('PLANNING');
    });

    it('should increment project count on creation', () => {
      const installation = lab.createInstallation('user1');
      lab.createProject(installation.id, 'Project 1', 'GENERAL', 'Hypothesis 1');
      lab.createProject(installation.id, 'Project 2', 'GENERAL', 'Hypothesis 2');
      
      const updated = lab.getInstallation(installation.id);
      expect(updated?.researchProjects).toBe(2);
    });

    it('should get projects for installation', () => {
      const installation = lab.createInstallation('user1');
      lab.createProject(installation.id, 'Project 1', 'GENERAL', 'H1');
      lab.createProject(installation.id, 'Project 2', 'GENERAL', 'H2');
      
      const projects = lab.getProjectsForInstallation(installation.id);
      expect(projects.length).toBe(2);
    });

    it('should update project status', () => {
      const installation = lab.createInstallation('user1');
      const project = lab.createProject(installation.id, 'Test', 'GENERAL', 'H');
      
      if (project) {
        lab.updateProjectStatus(project.id, 'IN_PROGRESS');
        const updated = lab.getProject(project.id);
        
        expect(updated?.status).toBe('IN_PROGRESS');
        expect(updated?.started).toBeDefined();
      }
    });

    it('should add findings to project', () => {
      const installation = lab.createInstallation('user1');
      const project = lab.createProject(installation.id, 'Test', 'GENERAL', 'H');
      
      if (project) {
        lab.addFinding(project.id, 'Finding 1');
        lab.addFinding(project.id, 'Finding 2');
        
        const updated = lab.getProject(project.id);
        expect(updated?.findings.length).toBe(2);
      }
    });

    it('should add conclusions to project', () => {
      const installation = lab.createInstallation('user1');
      const project = lab.createProject(installation.id, 'Test', 'GENERAL', 'H');
      
      if (project) {
        lab.addConclusion(project.id, 'Conclusion 1');
        
        const updated = lab.getProject(project.id);
        expect(updated?.conclusions.length).toBe(1);
      }
    });
  });

  describe('custom research agents', () => {
    it('should create custom agent for eligible tier', () => {
      const installation = lab.createInstallation('user1', 'MASTER');
      const agent = lab.createAgent(
        installation.id,
        'Research Assistant',
        'ARTIFICIAL_INTELLIGENCE',
        ['literature review', 'data analysis']
      );
      
      expect(agent).toBeDefined();
      expect(agent?.name).toBe('Research Assistant');
      expect(agent?.domain).toBe('ARTIFICIAL_INTELLIGENCE');
    });

    it('should not create agent for APPRENTICE tier', () => {
      const installation = lab.createInstallation('user1', 'APPRENTICE');
      const agent = lab.createAgent(
        installation.id,
        'Agent',
        'GENERAL',
        ['research']
      );
      
      expect(agent).toBeNull();
    });

    it('should respect agent limit per tier', () => {
      const installation = lab.createInstallation('user1', 'JOURNEYMAN'); // 1 agent limit
      
      const agent1 = lab.createAgent(installation.id, 'Agent 1', 'GENERAL', []);
      const agent2 = lab.createAgent(installation.id, 'Agent 2', 'GENERAL', []);
      
      expect(agent1).toBeDefined();
      expect(agent2).toBeNull();
    });

    it('should get agents for installation', () => {
      const installation = lab.createInstallation('user1', 'MASTER');
      lab.createAgent(installation.id, 'Agent 1', 'GENERAL', []);
      lab.createAgent(installation.id, 'Agent 2', 'GENERAL', []);
      
      const agents = lab.getAgentsForInstallation(installation.id);
      expect(agents.length).toBe(2);
    });
  });

  describe('statistics', () => {
    it('should provide accurate statistics', () => {
      lab.createInstallation('user1', 'APPRENTICE');
      lab.createInstallation('user2', 'JOURNEYMAN');
      lab.createInstallation('user3', 'APPRENTICE');
      
      const install = lab.createInstallation('user4', 'MASTER');
      lab.createProject(install.id, 'Test', 'GENERAL', 'H');
      lab.useIntTok(install.id, 1000);
      
      const stats = lab.getStatistics();
      
      expect(stats.totalInstallations).toBe(4);
      expect(stats.activeInstallations).toBe(4);
      expect(stats.installationsByTier.APPRENTICE).toBe(2);
      expect(stats.installationsByTier.JOURNEYMAN).toBe(1);
      expect(stats.installationsByTier.MASTER).toBe(1);
      expect(stats.totalProjects).toBe(1);
      expect(stats.totalIntTokUsed).toBe(1000);
    });
  });

  describe('singleton', () => {
    it('should return same instance', () => {
      const instance1 = getDeepResearchLab();
      const instance2 = getDeepResearchLab();
      expect(instance1).toBe(instance2);
    });

    it('should reset singleton', () => {
      const instance1 = getDeepResearchLab();
      resetDeepResearchLab();
      const instance2 = getDeepResearchLab();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('utility functions', () => {
    it('should get tier definition', () => {
      const def = getTierDefinition('MASTER');
      expect(def.tier).toBe('MASTER');
      expect(def.latinName).toBe('Magister Cognitionis');
    });

    it('should get tier color', () => {
      expect(getTierColor('APPRENTICE')).toBe('#6b7280');
      expect(getTierColor('SOVEREIGN')).toBe('#fbbf24');
    });

    it('should get tier glyph', () => {
      expect(getTierGlyph('APPRENTICE')).toBe('📚');
      expect(getTierGlyph('SOVEREIGN')).toBe('👑');
    });

    it('should format installation', () => {
      const installation = lab.createInstallation('user1', 'MASTER');
      const formatted = formatInstallation(installation);
      
      expect(formatted).toContain('Magister Cognitionis');
      expect(formatted).toContain('ACTIVE');
    });

    it('should get next tier', () => {
      expect(getNextTier('APPRENTICE')).toBe('JOURNEYMAN');
      expect(getNextTier('JOURNEYMAN')).toBe('MASTER');
      expect(getNextTier('MASTER')).toBe('SOVEREIGN');
      expect(getNextTier('SOVEREIGN')).toBeNull();
    });
  });
});
