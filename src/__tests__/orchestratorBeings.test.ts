/**
 * Orchestrator Beings Tests
 */

import {
  OrchestratorBeingManager,
  getOrchestratorBeingManager,
  resetOrchestratorBeingManager,
  ALL_ORCHESTRATOR_BEINGS,
  PRAEFECTUS_MEMORIAE,
  PRAEFECTUS_IMPERII,
  getPhaseGlyph,
  formatBeingStatus,
  type OrchestratorDomainId,
  type BeingPhase,
} from '../lib/orchestratorBeings';

describe('OrchestratorBeings', () => {
  let manager: OrchestratorBeingManager;

  beforeEach(() => {
    resetOrchestratorBeingManager();
    manager = getOrchestratorBeingManager();
  });

  describe('being definitions', () => {
    it('should have 10 orchestrator beings', () => {
      expect(ALL_ORCHESTRATOR_BEINGS.length).toBe(10);
    });

    it('should have unique IDs for all beings', () => {
      const ids = ALL_ORCHESTRATOR_BEINGS.map((b) => b.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have unique domains for all beings', () => {
      const domains = ALL_ORCHESTRATOR_BEINGS.map((b) => b.domain);
      const uniqueDomains = new Set(domains);
      expect(uniqueDomains.size).toBe(domains.length);
    });

    it('should have all required properties', () => {
      for (const being of ALL_ORCHESTRATOR_BEINGS) {
        expect(being.id).toBeDefined();
        expect(being.name).toBeDefined();
        expect(being.latinName).toBeDefined();
        expect(being.domain).toBeDefined();
        expect(being.capabilities.length).toBeGreaterThan(0);
        expect(being.lawsEnforced.length).toBeGreaterThan(0);
        expect(being.frequency).toBeGreaterThan(0);
        expect(being.phiAlignment).toBeGreaterThan(0);
      }
    });
  });

  describe('PRAEFECTUS definitions', () => {
    it('PRAEFECTUS_MEMORIAE should command MEMORIA domain', () => {
      expect(PRAEFECTUS_MEMORIAE.domain).toBe('MEMORIA');
      expect(PRAEFECTUS_MEMORIAE.id).toBe('PRAEFECTUS_MEMORIAE');
    });

    it('PRAEFECTUS_IMPERII should command IMPERIUM domain', () => {
      expect(PRAEFECTUS_IMPERII.domain).toBe('IMPERIUM');
      expect(PRAEFECTUS_IMPERII.id).toBe('PRAEFECTUS_IMPERII');
    });

    it('all PRAEFECTI should have DOMAIN_CONTROL authority', () => {
      for (const being of ALL_ORCHESTRATOR_BEINGS) {
        expect(being.authority).toContain('DOMAIN_CONTROL');
      }
    });

    it('all PRAEFECTI should have ORO as parent', () => {
      for (const being of ALL_ORCHESTRATOR_BEINGS) {
        expect(being.parentId).toBe('ORO_PRIMARY_SOVEREIGN');
      }
    });
  });

  describe('manager initialization', () => {
    it('should initialize with all 10 beings', () => {
      const beings = manager.getAllBeings();
      expect(beings.length).toBe(10);
    });

    it('should initialize all beings as DORMANT', () => {
      const beings = manager.getAllBeings();
      for (const being of beings) {
        expect(being.phase).toBe('DORMANT');
      }
    });
  });

  describe('being queries', () => {
    it('should get being by ID', () => {
      const being = manager.getBeing('PRAEFECTUS_MEMORIAE');
      expect(being).toBeDefined();
      expect(being?.name).toBe('PRAEFECTUS MEMORIAE');
    });

    it('should get being by domain', () => {
      const being = manager.getBeingByDomain('COGNITIO');
      expect(being).toBeDefined();
      expect(being?.id).toBe('PRAEFECTUS_COGNITIONIS');
    });

    it('should return undefined for non-existent being', () => {
      const being = manager.getBeing('INVALID_ID');
      expect(being).toBeUndefined();
    });

    it('should get beings by phase', () => {
      const dormant = manager.getBeingsByPhase('DORMANT');
      expect(dormant.length).toBe(10);
    });
  });

  describe('being activation', () => {
    it('should activate a dormant being', () => {
      const result = manager.activateBeing('PRAEFECTUS_MEMORIAE');
      expect(result).toBe(true);
      
      const being = manager.getBeing('PRAEFECTUS_MEMORIAE');
      expect(being?.phase).toBe('AWAKENING');
    });

    it('should increment activation count', () => {
      manager.activateBeing('PRAEFECTUS_MEMORIAE');
      const being = manager.getBeing('PRAEFECTUS_MEMORIAE');
      expect(being?.activationCount).toBe(1);
    });

    it('should not activate already active being', async () => {
      manager.activateBeing('PRAEFECTUS_MEMORIAE');
      
      // Wait for being to become ACTIVE
      await new Promise((resolve) => setTimeout(resolve, 900));
      
      const result = manager.activateBeing('PRAEFECTUS_MEMORIAE');
      expect(result).toBe(false);
    });

    it('should return false for non-existent being', () => {
      const result = manager.activateBeing('INVALID_ID');
      expect(result).toBe(false);
    });
  });

  describe('being deactivation', () => {
    it('should deactivate an active being', () => {
      manager.activateBeing('PRAEFECTUS_MEMORIAE');
      const result = manager.deactivateBeing('PRAEFECTUS_MEMORIAE');
      
      expect(result).toBe(true);
      
      const being = manager.getBeing('PRAEFECTUS_MEMORIAE');
      expect(being?.phase).toBe('DORMANT');
    });

    it('should return false when deactivating dormant being', () => {
      const result = manager.deactivateBeing('PRAEFECTUS_MEMORIAE');
      expect(result).toBe(false);
    });
  });

  describe('resonance links', () => {
    it('should establish resonance link between beings', () => {
      const result = manager.establishResonanceLink(
        'PRAEFECTUS_MEMORIAE',
        'PRAEFECTUS_COGNITIONIS'
      );
      
      expect(result).toBe(true);
      
      const being1 = manager.getBeing('PRAEFECTUS_MEMORIAE');
      const being2 = manager.getBeing('PRAEFECTUS_COGNITIONIS');
      
      expect(being1?.resonanceLinks).toContain('PRAEFECTUS_COGNITIONIS');
      expect(being2?.resonanceLinks).toContain('PRAEFECTUS_MEMORIAE');
    });

    it('should return false for invalid being IDs', () => {
      const result = manager.establishResonanceLink(
        'PRAEFECTUS_MEMORIAE',
        'INVALID_ID'
      );
      expect(result).toBe(false);
    });

    it('should not duplicate resonance links', () => {
      manager.establishResonanceLink('PRAEFECTUS_MEMORIAE', 'PRAEFECTUS_COGNITIONIS');
      manager.establishResonanceLink('PRAEFECTUS_MEMORIAE', 'PRAEFECTUS_COGNITIONIS');
      
      const being = manager.getBeing('PRAEFECTUS_MEMORIAE');
      const linkCount = being?.resonanceLinks.filter(
        (l) => l === 'PRAEFECTUS_COGNITIONIS'
      ).length;
      
      expect(linkCount).toBe(1);
    });
  });

  describe('capability execution', () => {
    it('should not execute capability on dormant being', () => {
      const result = manager.executeCapability('PRAEFECTUS_MEMORIAE', 'Memory Indexing');
      
      expect(result.success).toBe(false);
    });

    it('should execute capability on active being', () => {
      manager.activateBeing('PRAEFECTUS_MEMORIAE');
      const result = manager.executeCapability('PRAEFECTUS_MEMORIAE', 'Memory Indexing');
      
      expect(result.success).toBe(true);
      expect(result.energyCost).toBeGreaterThan(0);
    });

    it('should return failure for non-existent capability', () => {
      manager.activateBeing('PRAEFECTUS_MEMORIAE');
      const result = manager.executeCapability('PRAEFECTUS_MEMORIAE', 'Invalid Capability');
      
      expect(result.success).toBe(false);
    });
  });

  describe('doctrine alignment', () => {
    it('should calculate total doctrine alignment', () => {
      const alignment = manager.getTotalDoctrineAlignment();
      expect(alignment).toBeGreaterThan(0);
      expect(alignment).toBeLessThanOrEqual(1);
    });
  });

  describe('singleton', () => {
    it('should return same instance', () => {
      const instance1 = getOrchestratorBeingManager();
      const instance2 = getOrchestratorBeingManager();
      expect(instance1).toBe(instance2);
    });

    it('should reset singleton', () => {
      const instance1 = getOrchestratorBeingManager();
      resetOrchestratorBeingManager();
      const instance2 = getOrchestratorBeingManager();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('utility functions', () => {
    it('should get glyph for phase', () => {
      expect(getPhaseGlyph('DORMANT')).toBe('💤');
      expect(getPhaseGlyph('ACTIVE')).toBe('✨');
      expect(getPhaseGlyph('TRANSCENDING')).toBe('🌟');
    });

    it('should format being status', () => {
      const being = manager.getBeing('PRAEFECTUS_MEMORIAE');
      if (being) {
        const status = formatBeingStatus(being);
        expect(status).toContain(being.latinName);
        expect(status).toContain('DORMANT');
      }
    });
  });
});
