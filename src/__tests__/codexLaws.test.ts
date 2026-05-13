/**
 * CODEX LAWS TESTS
 *
 * Tests for Autobot and Decepticon law enforcement in governance.
 */

import {
  validateAllAutobotLaws,
  validateAllDecepticonLaws,
  validateAutobotCoherence,
  validateAutobotReversibility,
  validateAutobotExplainability,
  validateAutobotContainment,
  validateDecepticonSandboxing,
  validateDecepticonTelemetry,
  validateDecepticonNonPersistence,
  validateDecepticonCounterpart,
  checkGateAForAutobot,
  checkGateCForDecepticon,
  getGateForCodexAction,
  isCodexActionAllowed,
  getCodexAuditLog,
  setGateStatus,
} from '../lib/governanceEngine';

describe('Codex Laws Governance', () => {
  describe('Autobot Law A-1: Coherence', () => {
    it('should pass for valid content', () => {
      const result = validateAutobotCoherence('autobot-1', 'GUARDIAN', 'test-action', 'Valid content');
      
      expect(result.passed).toBe(true);
      expect(result.law).toBe('A-1');
      expect(result.reason).toContain('Coherence');
    });

    it('should fail for empty content', () => {
      const result = validateAutobotCoherence('autobot-2', 'CURATOR', 'test-action', '');
      
      expect(result.passed).toBe(false);
      expect(result.reason).toContain('Empty content');
    });

    it('should pass when no content is provided', () => {
      const result = validateAutobotCoherence('autobot-3', 'ANALYST', 'test-action');
      
      expect(result.passed).toBe(true);
    });
  });

  describe('Autobot Law A-2: Reversibility', () => {
    it('should pass when lineage exists', () => {
      const result = validateAutobotReversibility('autobot-4', 'ARCHITECT', 'create-action', true);
      
      expect(result.passed).toBe(true);
      expect(result.law).toBe('A-2');
      expect(result.reason).toContain('lineage');
    });

    it('should fail when no lineage', () => {
      const result = validateAutobotReversibility('autobot-5', 'OPERATOR', 'orphan-action', false);
      
      expect(result.passed).toBe(false);
      expect(result.reason).toContain('lacks lineage');
    });
  });

  describe('Autobot Law A-3: Explainability', () => {
    it('should always pass (audit logging is always on)', () => {
      const result = validateAutobotExplainability('autobot-6', 'PRIME', 'any-action');
      
      expect(result.passed).toBe(true);
      expect(result.law).toBe('A-3');
      expect(result.reason).toContain('Audit');
    });
  });

  describe('Autobot Law A-4: Containment', () => {
    it('should pass when scope is sufficient', () => {
      const result = validateAutobotContainment('autobot-7', 'GUARDIAN', 'read-action', 'enterprise', 'internal');
      
      expect(result.passed).toBe(true);
      expect(result.law).toBe('A-4');
    });

    it('should fail when scope is insufficient', () => {
      const result = validateAutobotContainment('autobot-8', 'SCOUT', 'write-action', 'sovereign', 'enterprise');
      
      expect(result.passed).toBe(false);
      expect(result.reason).toContain('insufficient');
    });

    it('should respect scope hierarchy', () => {
      // public < enterprise < internal < sovereign
      expect(validateAutobotContainment('a', 'ANALYST', 'x', 'public', 'public').passed).toBe(true);
      expect(validateAutobotContainment('a', 'ANALYST', 'x', 'public', 'enterprise').passed).toBe(true);
      expect(validateAutobotContainment('a', 'ANALYST', 'x', 'enterprise', 'public').passed).toBe(false);
      expect(validateAutobotContainment('a', 'ANALYST', 'x', 'internal', 'enterprise').passed).toBe(false);
      expect(validateAutobotContainment('a', 'ANALYST', 'x', 'sovereign', 'sovereign').passed).toBe(true);
    });
  });

  describe('Decepticon Law D-1: Sandboxing', () => {
    it('should pass when chaos domain is assigned', () => {
      const result = validateDecepticonSandboxing('decepticon-1', 'TRICKSTER', 'chaos-action', 'domain-123');
      
      expect(result.passed).toBe(true);
      expect(result.law).toBe('D-1');
      expect(result.reason).toContain('chaos domain');
    });

    it('should fail when no chaos domain', () => {
      const result = validateDecepticonSandboxing('decepticon-2', 'PHANTOM', 'rogue-action');
      
      expect(result.passed).toBe(false);
      expect(result.reason).toContain('No chaos domain');
    });
  });

  describe('Decepticon Law D-2: Telemetry', () => {
    it('should always pass (telemetry is always on)', () => {
      const result = validateDecepticonTelemetry('decepticon-3', 'CRAWLER', 'any-action');
      
      expect(result.passed).toBe(true);
      expect(result.law).toBe('D-2');
      expect(result.reason).toContain('Telemetry');
    });
  });

  describe('Decepticon Law D-3: Non-Persistence', () => {
    it('should pass when domain has future expiration', () => {
      const futureExpiry = new Date(Date.now() + 60_000).toISOString();
      const result = validateDecepticonNonPersistence('decepticon-4', 'DISRUPTOR', 'temp-action', futureExpiry);
      
      expect(result.passed).toBe(true);
      expect(result.law).toBe('D-3');
      expect(result.reason).toContain('expires');
    });

    it('should pass when domain already expired', () => {
      const pastExpiry = new Date(Date.now() - 60_000).toISOString();
      const result = validateDecepticonNonPersistence('decepticon-5', 'MIRAGE', 'expired-action', pastExpiry);
      
      expect(result.passed).toBe(true);
      expect(result.reason).toContain('expired');
    });

    it('should fail when no expiration set', () => {
      const result = validateDecepticonNonPersistence('decepticon-6', 'TRICKSTER', 'permanent-action');
      
      expect(result.passed).toBe(false);
      expect(result.reason).toContain('No expiration');
    });
  });

  describe('Decepticon Law D-4: Counterpart', () => {
    it('should pass when counterpart is assigned', () => {
      const result = validateDecepticonCounterpart('decepticon-7', 'PHANTOM', 'paired-action', 'autobot-99');
      
      expect(result.passed).toBe(true);
      expect(result.law).toBe('D-4');
      expect(result.reason).toContain('Counterpart');
    });

    it('should fail when no counterpart', () => {
      const result = validateDecepticonCounterpart('decepticon-8', 'CRAWLER', 'unpaired-action');
      
      expect(result.passed).toBe(false);
      expect(result.reason).toContain('No counterpart');
    });
  });

  describe('Full Law Validation', () => {
    it('should validate all Autobot laws at once', () => {
      const { passed, results } = validateAllAutobotLaws('autobot-all', 'GUARDIAN', 'full-check', {
        content: 'Valid content',
        hasLineage: true,
        requiredScope: 'enterprise',
        actualScope: 'internal',
      });

      expect(passed).toBe(true);
      expect(results.length).toBe(4);
      expect(results.every((r) => r.passed)).toBe(true);
    });

    it('should fail validation if any Autobot law fails', () => {
      const { passed, results } = validateAllAutobotLaws('autobot-fail', 'OPERATOR', 'fail-check', {
        content: '',  // Empty content violates A-1
        hasLineage: true,
      });

      expect(passed).toBe(false);
      expect(results.some((r) => !r.passed)).toBe(true);
    });

    it('should validate all Decepticon laws at once', () => {
      const futureExpiry = new Date(Date.now() + 60_000).toISOString();
      const { passed, results } = validateAllDecepticonLaws('decepticon-all', 'MIRAGE', 'full-check', {
        chaosDomainId: 'domain-xyz',
        domainExpiresAt: futureExpiry,
        counterpartId: 'autobot-partner',
      });

      expect(passed).toBe(true);
      expect(results.length).toBe(4);
      expect(results.every((r) => r.passed)).toBe(true);
    });

    it('should fail validation if any Decepticon law fails', () => {
      const { passed, results } = validateAllDecepticonLaws('decepticon-fail', 'TRICKSTER', 'fail-check', {
        chaosDomainId: 'domain-xyz',
        domainExpiresAt: new Date(Date.now() + 60_000).toISOString(),
        // Missing counterpartId violates D-4
      });

      expect(passed).toBe(false);
      expect(results.some((r) => !r.passed)).toBe(true);
    });
  });

  describe('Gate Checks', () => {
    it('should check Gate A for Autobot operations', () => {
      const result = checkGateAForAutobot();
      
      expect(result.allowed).toBeDefined();
      expect(typeof result.reason).toBe('string');
    });

    it('should check Gate C for Decepticon operations', () => {
      const result = checkGateCForDecepticon();
      
      expect(result.allowed).toBeDefined();
      expect(typeof result.reason).toBe('string');
    });

    it('should block Autobot operations when Gate A is red', () => {
      // Set gate to red
      setGateStatus('A', 'red');
      
      const result = checkGateAForAutobot();
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('red');

      // Restore gate
      setGateStatus('A', 'green');
    });

    it('should block Decepticon operations when Gate C is red', () => {
      // Set gate to red
      setGateStatus('C', 'red');
      
      const result = checkGateCForDecepticon();
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('red');

      // Restore gate
      setGateStatus('C', 'amber');
    });
  });

  describe('Gate-Codex Mapping', () => {
    it('should map Autobot actions to Gate A', () => {
      expect(getGateForCodexAction('AUTOBOT_SPAWN')).toBe('A');
      expect(getGateForCodexAction('AUTOBOT_RETIRE')).toBe('A');
      expect(getGateForCodexAction('AUTOBOT_LAW_CHECK')).toBe('A');
    });

    it('should map Memory actions to Gate B', () => {
      expect(getGateForCodexAction('LINEAGE_CREATE')).toBe('B');
      expect(getGateForCodexAction('LINEAGE_FORK')).toBe('B');
      expect(getGateForCodexAction('LINEAGE_MERGE')).toBe('B');
      expect(getGateForCodexAction('SHARD_APPEND')).toBe('B');
      expect(getGateForCodexAction('ACCESS_GRANT')).toBe('B');
      expect(getGateForCodexAction('ACCESS_REVOKE')).toBe('B');
    });

    it('should map Decepticon actions to Gate C', () => {
      expect(getGateForCodexAction('DECEPTICON_DEPLOY')).toBe('C');
      expect(getGateForCodexAction('DECEPTICON_TELEMETRY')).toBe('C');
      expect(getGateForCodexAction('CHAOS_DOMAIN_CREATE')).toBe('C');
      expect(getGateForCodexAction('CHAOS_DOMAIN_EXPIRE')).toBe('C');
    });

    it('should check if action is allowed based on gate status', () => {
      const result = isCodexActionAllowed('AUTOBOT_SPAWN');
      
      expect(result.allowed).toBeDefined();
      expect(result.gate).toBe('A');
      expect(result.status).toBeDefined();
      expect(typeof result.reason).toBe('string');
    });
  });

  describe('Audit Logging', () => {
    it('should log codex audit events', () => {
      // Trigger some law checks to generate audit entries
      validateAutobotCoherence('audit-test', 'GUARDIAN', 'audit-action', 'content');
      validateDecepticonTelemetry('audit-test', 'TRICKSTER', 'audit-action');

      const log = getCodexAuditLog(10);
      
      expect(Array.isArray(log)).toBe(true);
      expect(log.length).toBeGreaterThan(0);
      expect(log[0].id).toBeDefined();
      expect(log[0].action).toBeDefined();
      expect(log[0].timestamp).toBeDefined();
    });

    it('should include agent details in audit entries', () => {
      validateAutobotReversibility('specific-agent', 'ARCHITECT', 'specific-action', true);

      const log = getCodexAuditLog(5);
      const entry = log.find((e) => e.agentId === 'specific-agent');
      
      expect(entry).toBeDefined();
      expect(entry?.agentClass).toBe('ARCHITECT');
    });
  });
});
