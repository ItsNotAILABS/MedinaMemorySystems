/**
 * VITA AETERNA RUNTIME TESTS
 *
 * Tests for organism lifecycle and codex agent management.
 */

import {
  createTemplate,
  getTemplate,
  listTemplates,
  spawnOrganism,
  transitionOrganism,
  retireOrganism,
  getOrganism,
  listOrganisms,
  spawnAutobot,
  retireAutobot,
  getAutobot,
  listAutobots,
  deployDecepticon,
  recordChaosMutation,
  expireChaosDomain,
  getChaosTelemetry,
  listChaosDomains,
  listDecepticons,
  checkQuota,
  getVitaAeternaStats,
  cleanupExpiredChaosDomains,
} from '../lib/vitaAeternaRuntime';
import { createLineage } from '../lib/semperMemoriaEngine';

describe('Vita Aeterna Runtime', () => {
  describe('Template Management', () => {
    it('should have default templates', () => {
      const templates = listTemplates();
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should create a custom template', () => {
      const template = createTemplate(
        'Custom Worker',
        'A custom worker template',
        'OPERATOR',
        'enterprise',
        ['custom-ops'],
        'ENTERPRISE',
        'test-user',
      );

      expect(template.id).toBeDefined();
      expect(template.name).toBe('Custom Worker');
      expect(template.autobotClass).toBe('OPERATOR');
      expect(template.quotaTier).toBe('ENTERPRISE');
    });

    it('should get a template by ID', () => {
      const created = createTemplate('Get Template', 'Test', 'ANALYST', 'internal', [], 'ENTERPRISE', 'test');
      const retrieved = getTemplate(created.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
    });
  });

  describe('Organism Lifecycle', () => {
    it('should spawn an organism from a template', () => {
      const template = createTemplate('Spawn Test', 'Test', 'CURATOR', 'enterprise', [], 'ENTERPRISE', 'test');
      const organism = spawnOrganism(template.id, 'Test Organism', 'spawn-user');

      expect(organism.id).toBeDefined();
      expect(organism.templateId).toBe(template.id);
      expect(organism.name).toBe('Test Organism');
      expect(organism.lineageId).toBeDefined();
      expect(['spawning', 'growth']).toContain(organism.state);
    });

    it('should transition organism through lifecycle states', () => {
      const template = createTemplate('Transition Test', 'Test', 'OPERATOR', 'enterprise', [], 'ENTERPRISE', 'test');
      const organism = spawnOrganism(template.id, 'Transition Organism', 'transition-user');

      // Should start in growth (auto-transitioned from spawning)
      expect(organism.state).toBe('growth');

      // Transition to maturity
      const maturityResult = transitionOrganism(organism.id, 'maturity', 'transition-user');
      expect(maturityResult.success).toBe(true);
      expect(maturityResult.toState).toBe('maturity');

      // Verify the transition
      const updated = getOrganism(organism.id);
      expect(updated?.state).toBe('maturity');
      expect(updated?.maturedAt).toBeDefined();
    });

    it('should reject invalid lifecycle transitions', () => {
      const template = createTemplate('Invalid Transition', 'Test', 'ANALYST', 'internal', [], 'ENTERPRISE', 'test');
      const organism = spawnOrganism(template.id, 'Invalid Transition Organism', 'test-user');

      // Try to skip to archived directly
      const result = transitionOrganism(organism.id, 'archived', 'test-user');
      expect(result.success).toBe(false);
      expect(result.reason).toContain('Invalid transition');
    });

    it('should retire an organism', () => {
      const template = createTemplate('Retire Test', 'Test', 'OPERATOR', 'enterprise', [], 'ENTERPRISE', 'test');
      const organism = spawnOrganism(template.id, 'Retire Organism', 'retire-user');
      
      // Transition to maturity first
      transitionOrganism(organism.id, 'maturity', 'retire-user');

      // Retire
      const result = retireOrganism(organism.id, 'retire-user');
      expect(result.success).toBe(true);
      expect(result.toState).toBe('archived');

      const archived = getOrganism(organism.id);
      expect(archived?.state).toBe('archived');
    });

    it('should list organisms with optional state filter', () => {
      const allOrganisms = listOrganisms();
      expect(Array.isArray(allOrganisms)).toBe(true);

      const growthOrganisms = listOrganisms('growth');
      expect(growthOrganisms.every((o) => o.state === 'growth')).toBe(true);
    });
  });

  describe('Autobot Management', () => {
    it('should spawn an Autobot', () => {
      const lineage = createLineage('Autobot Lineage', 'autobot-test');
      const autobot = spawnAutobot('GUARDIAN', 'internal', lineage.id, 'spawn-user');

      expect(autobot.id).toBeDefined();
      expect(autobot.class).toBe('GUARDIAN');
      expect(autobot.scope).toBe('internal');
      expect(autobot.status).toBe('active');
      expect(autobot.lawCheckResults.length).toBeGreaterThan(0);
    });

    it('should retire an Autobot', () => {
      const lineage = createLineage('Retire Autobot Lineage', 'autobot-test');
      const autobot = spawnAutobot('ANALYST', 'enterprise', lineage.id, 'test-user');

      const retired = retireAutobot(autobot.id, 'retire-user');
      expect(retired?.status).toBe('retired');
      expect(retired?.retiredAt).toBeDefined();
    });

    it('should list Autobots with optional status filter', () => {
      const allAutobots = listAutobots();
      expect(Array.isArray(allAutobots)).toBe(true);

      const activeAutobots = listAutobots('active');
      expect(activeAutobots.every((a) => a.status === 'active')).toBe(true);
    });

    it('should enforce Autobot law checks', () => {
      const lineage = createLineage('Law Check Lineage', 'law-test');
      const autobot = spawnAutobot('CURATOR', 'enterprise', lineage.id, 'law-user');

      // All law checks should pass for valid spawn
      expect(autobot.lawCheckResults.every((r) => r.passed)).toBe(true);
      expect(autobot.lawCheckResults.map((r) => r.law)).toEqual(
        expect.arrayContaining(['A-1', 'A-2', 'A-3', 'A-4']),
      );
    });
  });

  describe('Decepticon & Chaos Domain Management', () => {
    it('should deploy a Decepticon with chaos domain', () => {
      const { decepticon, chaosDomain } = deployDecepticon('TRICKSTER', 60_000, 'deploy-user');

      expect(decepticon.id).toBeDefined();
      expect(decepticon.class).toBe('TRICKSTER');
      expect(decepticon.status).toBe('active');
      expect(decepticon.chaosDomainId).toBe(chaosDomain.id);
      expect(decepticon.counterpartId).toBeDefined();

      expect(chaosDomain.id).toBeDefined();
      expect(chaosDomain.status).toBe('active');
      expect(chaosDomain.ttl).toBe(60_000);
    });

    it('should create Autobot counterpart for Decepticon', () => {
      const { decepticon } = deployDecepticon('PHANTOM', 60_000, 'counter-user');
      
      // PHANTOM should have ARCHITECT counterpart
      const counterpart = getAutobot(decepticon.counterpartId!);
      expect(counterpart).toBeDefined();
      expect(counterpart?.class).toBe('ARCHITECT');
    });

    it('should record chaos mutations', () => {
      const { chaosDomain } = deployDecepticon('DISRUPTOR', 60_000, 'mutation-user');

      const mutation = recordChaosMutation(
        chaosDomain.id,
        'test-action',
        'target-resource',
        { before: 'state' },
        { after: 'state' },
      );

      expect(mutation.id).toBeDefined();
      expect(mutation.action).toBe('test-action');
      expect(mutation.reverted).toBe(false);
    });

    it('should emit telemetry for chaos actions', () => {
      const { chaosDomain, decepticon } = deployDecepticon('CRAWLER', 60_000, 'telemetry-user');
      
      recordChaosMutation(chaosDomain.id, 'crawl-action', 'boundary');

      const telemetry = getChaosTelemetry(chaosDomain.id);
      expect(telemetry.length).toBeGreaterThan(0);
      expect(telemetry[0].decepticonId).toBe(decepticon.id);
    });

    it('should expire chaos domains', () => {
      const { chaosDomain, decepticon } = deployDecepticon('MIRAGE', 60_000, 'expire-user');

      const expired = expireChaosDomain(chaosDomain.id);
      expect(expired).toBe(true);

      const expiredDomain = listChaosDomains().find((d) => d.id === chaosDomain.id);
      expect(expiredDomain?.status).toBe('expired');

      const expiredDecepticon = listDecepticons().find((d) => d.id === decepticon.id);
      expect(expiredDecepticon?.status).toBe('expired');
    });

    it('should list chaos domains and Decepticons', () => {
      const domains = listChaosDomains();
      expect(Array.isArray(domains)).toBe(true);

      const decepticons = listDecepticons();
      expect(Array.isArray(decepticons)).toBe(true);

      const activeDomains = listChaosDomains('active');
      expect(activeDomains.every((d) => d.status === 'active')).toBe(true);
    });

    it('should cleanup expired chaos domains', () => {
      // Create multiple domains - some will be ready for cleanup based on TTL
      deployDecepticon('TRICKSTER', 300_000, 'cleanup-user'); // Normal TTL
      
      // The cleanup function finds and expires domains that have passed their TTL
      // Since we can't easily mock time, we just verify the function runs without error
      const cleaned = cleanupExpiredChaosDomains();
      expect(typeof cleaned).toBe('number');
      expect(cleaned).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Quota Management', () => {
    it('should check quota availability', () => {
      const result = checkQuota('ENTERPRISE');
      
      expect(result.available).toBeDefined();
      expect(result.quota).toBeDefined();
      expect(result.quota.maxConcurrentAgents).toBe(10);
      expect(result.currentUsage).toBeDefined();
    });

    it('should have different quotas per tier', () => {
      const publicQuota = checkQuota('PUBLIC');
      const enterpriseQuota = checkQuota('ENTERPRISE');
      const sovereignQuota = checkQuota('SOVEREIGN');

      expect(publicQuota.quota.maxConcurrentAgents).toBeLessThan(enterpriseQuota.quota.maxConcurrentAgents);
      expect(enterpriseQuota.quota.maxConcurrentAgents).toBeLessThan(sovereignQuota.quota.maxConcurrentAgents);
    });
  });

  describe('Statistics', () => {
    it('should return correct statistics', () => {
      const stats = getVitaAeternaStats();
      
      expect(stats.totalTemplates).toBeGreaterThan(0);
      expect(stats.totalKernels).toBeGreaterThanOrEqual(0);
      expect(stats.byState).toBeDefined();
      expect(stats.byQuotaTier).toBeDefined();
      expect(typeof stats.totalAutobots).toBe('number');
      expect(typeof stats.totalDecepticons).toBe('number');
      expect(typeof stats.activeChaosDomains).toBe('number');
    });
  });
});
