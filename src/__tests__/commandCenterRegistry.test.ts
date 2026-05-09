/**
 * Command Center Registry Tests
 */

import {
  CommandCenterRegistry,
  getCommandCenter,
  resetCommandCenter,
  getActivationStateColor,
  formatDomainStatus,
  type OrchestratorDomainId,
  type ActivationState,
} from '../lib/commandCenterRegistry';

describe('CommandCenterRegistry', () => {
  let commandCenter: CommandCenterRegistry;

  beforeEach(() => {
    resetCommandCenter();
    commandCenter = getCommandCenter();
  });

  describe('initialization', () => {
    it('should initialize with 10 orchestrator domains', () => {
      const domains = commandCenter.getAllDomains();
      expect(domains.length).toBe(10);
    });

    it('should have all expected domain IDs', () => {
      const domains = commandCenter.getAllDomains();
      const domainIds = domains.map((d) => d.id);
      
      expect(domainIds).toContain('MEMORIA');
      expect(domainIds).toContain('SENSUS');
      expect(domainIds).toContain('NEXUS');
      expect(domainIds).toContain('COGNITIO');
      expect(domainIds).toContain('CUSTODIA');
      expect(domainIds).toContain('GUBERNATIO');
      expect(domainIds).toContain('FABRICATIO');
      expect(domainIds).toContain('RESONANTIA');
      expect(domainIds).toContain('FLUXUS');
      expect(domainIds).toContain('IMPERIUM');
    });

    it('should initialize all domains as DORMANT', () => {
      const domains = commandCenter.getAllDomains();
      for (const domain of domains) {
        expect(domain.state).toBe('DORMANT');
      }
    });
  });

  describe('domain activation', () => {
    it('should activate a domain successfully', () => {
      const result = commandCenter.activateDomain('MEMORIA');
      
      expect(result.success).toBe(true);
      expect(result.previousState).toBe('DORMANT');
      expect(result.newState).toBe('AWAKENING');
      expect(result.domainId).toBe('MEMORIA');
    });

    it('should track activation count', () => {
      commandCenter.activateDomain('MEMORIA');
      const domain = commandCenter.getDomain('MEMORIA');
      
      expect(domain?.activationCount).toBe(1);
    });

    it('should increment total activations', () => {
      commandCenter.activateDomain('MEMORIA');
      commandCenter.activateDomain('NEXUS');
      
      const summary = commandCenter.getStateSummary();
      expect(summary.totalActivations).toBe(2);
    });

    it('should activate all domains simultaneously', () => {
      const results = commandCenter.activateAllDomains();
      
      expect(results.length).toBe(10);
      expect(results.every((r) => r.success)).toBe(true);
    });
  });

  describe('domain queries', () => {
    it('should get a specific domain', () => {
      const domain = commandCenter.getDomain('COGNITIO');
      
      expect(domain).toBeDefined();
      expect(domain?.latinName).toBe('Cognitio Sapiens');
    });

    it('should return undefined for non-existent domain', () => {
      const domain = commandCenter.getDomain('INVALID' as OrchestratorDomainId);
      expect(domain).toBeUndefined();
    });

    it('should get active domains', () => {
      commandCenter.activateDomain('MEMORIA');
      commandCenter.activateDomain('NEXUS');
      
      const active = commandCenter.getActiveDomains();
      expect(active.length).toBe(2);
    });

    it('should get domains by state', () => {
      commandCenter.activateDomain('MEMORIA');
      
      const awakening = commandCenter.getDomainsByState('AWAKENING');
      expect(awakening.length).toBe(1);
      expect(awakening[0].id).toBe('MEMORIA');
    });
  });

  describe('sovereign state', () => {
    it('should not allow sovereign state for DORMANT domain', () => {
      const result = commandCenter.setSovereignState('MEMORIA');
      
      expect(result.success).toBe(false);
    });

    it('should set sovereign state for ACTIVE domain', async () => {
      commandCenter.activateDomain('MEMORIA');
      
      // Wait for domain to become ACTIVE
      await new Promise((resolve) => setTimeout(resolve, 900));
      
      const result = commandCenter.setSovereignState('MEMORIA');
      expect(result.success).toBe(true);
      expect(result.newState).toBe('SOVEREIGN');
    });
  });

  describe('command execution', () => {
    it('should not execute command on DORMANT domain', () => {
      const execution = commandCenter.executeCommand('test command', 'MEMORIA');
      
      expect(execution.status).toBe('FAILED');
    });

    it('should execute command on active domain', () => {
      commandCenter.activateDomain('MEMORIA');
      const execution = commandCenter.executeCommand('index memories', 'MEMORIA');
      
      expect(execution.status).toBe('EXECUTING');
      expect(execution.domainId).toBe('MEMORIA');
    });

    it('should route command to appropriate domain', () => {
      commandCenter.activateDomain('MEMORIA');
      commandCenter.activateDomain('CUSTODIA');
      
      const execution = commandCenter.routeCommand('memory indexing');
      expect(execution.status).toBe('EXECUTING');
    });
  });

  describe('state summary', () => {
    it('should provide accurate state summary', () => {
      commandCenter.activateDomain('MEMORIA');
      commandCenter.activateDomain('NEXUS');
      
      const summary = commandCenter.getStateSummary();
      
      expect(summary.totalDomains).toBe(10);
      expect(summary.activeDomains).toBe(2);
      expect(summary.sovereignDomains).toBe(0);
      expect(summary.totalActivations).toBe(2);
    });
  });

  describe('singleton', () => {
    it('should return same instance', () => {
      const instance1 = getCommandCenter();
      const instance2 = getCommandCenter();
      
      expect(instance1).toBe(instance2);
    });

    it('should reset singleton', () => {
      const instance1 = getCommandCenter();
      resetCommandCenter();
      const instance2 = getCommandCenter();
      
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('utility functions', () => {
    it('should get color for activation state', () => {
      expect(getActivationStateColor('DORMANT')).toBe('#6b7280');
      expect(getActivationStateColor('ACTIVE')).toBe('#10b981');
      expect(getActivationStateColor('SOVEREIGN')).toBe('#ec4899');
    });

    it('should format domain status', () => {
      const domain = commandCenter.getDomain('MEMORIA');
      if (domain) {
        const status = formatDomainStatus(domain);
        expect(status).toContain('Memoria Perpetua');
        expect(status).toContain('DORMANT');
      }
    });
  });
});
