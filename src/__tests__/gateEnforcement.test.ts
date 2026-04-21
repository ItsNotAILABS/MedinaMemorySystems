/**
 * Tests for gateEnforcement.ts
 * Gate Enforcement Protocol
 */

import {
  checkGate,
  enforceGate,
  checkAllGates,
  escalateGate,
  resolveGate,
  type GateCheckResult,
} from '../lib/gateEnforcement';
import { setGateStatus, getGates } from '../lib/governanceEngine';

describe('Gate Enforcement', () => {
  // Reset gates before each test
  beforeEach(() => {
    setGateStatus('A', 'green');
    setGateStatus('B', 'green');
    setGateStatus('C', 'green');
  });

  describe('checkGate', () => {
    describe('Gate A (Governance)', () => {
      it('should allow when green', () => {
        setGateStatus('A', 'green');
        const result = checkGate('A');
        
        expect(result.allowed).toBe(true);
        expect(result.reason).toContain('green');
        expect(result.reason).toContain('Governance operations permitted');
      });

      it('should allow with warning when amber', () => {
        setGateStatus('A', 'amber');
        const result = checkGate('A');
        
        expect(result.allowed).toBe(true);
        expect(result.reason).toContain('amber');
        expect(result.reason).toContain('Dual approval required');
      });

      it('should block when red', () => {
        setGateStatus('A', 'red');
        const result = checkGate('A');
        
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain('red');
        expect(result.reason).toContain('blocked');
      });
    });

    describe('Gate B (Memory)', () => {
      it('should allow full access when green', () => {
        setGateStatus('B', 'green');
        const result = checkGate('B');
        
        expect(result.allowed).toBe(true);
        expect(result.reason).toContain('Full memory access');
      });

      it('should allow with justification required when amber', () => {
        setGateStatus('B', 'amber');
        const result = checkGate('B');
        
        expect(result.allowed).toBe(true);
        expect(result.reason).toContain('Write operations require justification');
      });

      it('should be read-only when red', () => {
        setGateStatus('B', 'red');
        const result = checkGate('B');
        
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain('read-only');
      });
    });

    describe('Gate C (Sovereign)', () => {
      it('should allow full sovereign operations when green', () => {
        setGateStatus('C', 'green');
        const result = checkGate('C');
        
        expect(result.allowed).toBe(true);
        expect(result.reason).toContain('Sovereign operations active');
      });

      it('should limit broadcast when amber', () => {
        setGateStatus('C', 'amber');
        const result = checkGate('C');
        
        expect(result.allowed).toBe(true);
        expect(result.reason).toContain('Broadcast operations limited');
      });

      it('should enter hibernation when red', () => {
        setGateStatus('C', 'red');
        const result = checkGate('C');
        
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain('hibernation');
      });
    });

    it('should return gate object', () => {
      const result = checkGate('A');
      expect(result.gate).toBeDefined();
      expect(result.gate.id).toBe('A');
    });
  });

  describe('enforceGate', () => {
    it('should not throw when gate is green', () => {
      setGateStatus('A', 'green');
      expect(() => enforceGate('A', 'test-operation')).not.toThrow();
    });

    it('should not throw when gate is amber', () => {
      setGateStatus('B', 'amber');
      expect(() => enforceGate('B', 'test-operation')).not.toThrow();
    });

    it('should throw when gate is red', () => {
      setGateStatus('C', 'red');
      expect(() => enforceGate('C', 'test-operation')).toThrow();
    });

    it('should include gate ID and operation in error message', () => {
      setGateStatus('A', 'red');
      expect(() => enforceGate('A', 'write-memory')).toThrow(/Gate A.*write-memory/);
    });
  });

  describe('checkAllGates', () => {
    it('should return results for all three gates', () => {
      const results = checkAllGates();
      
      expect(results).toHaveProperty('A');
      expect(results).toHaveProperty('B');
      expect(results).toHaveProperty('C');
    });

    it('should reflect current gate statuses', () => {
      setGateStatus('A', 'green');
      setGateStatus('B', 'amber');
      setGateStatus('C', 'red');
      
      const results = checkAllGates();
      
      expect(results.A.allowed).toBe(true);
      expect(results.B.allowed).toBe(true);
      expect(results.C.allowed).toBe(false);
    });
  });

  describe('escalateGate', () => {
    it('should escalate green to amber', () => {
      setGateStatus('A', 'green');
      const gate = escalateGate('A');
      
      expect(gate).not.toBeNull();
      expect(gate!.status).toBe('amber');
    });

    it('should escalate amber to red', () => {
      setGateStatus('B', 'amber');
      const gate = escalateGate('B');
      
      expect(gate).not.toBeNull();
      expect(gate!.status).toBe('red');
    });

    it('should not escalate beyond red', () => {
      setGateStatus('C', 'red');
      const before = getGates().find(g => g.id === 'C')!.status;
      const gate = escalateGate('C');
      
      expect(gate).not.toBeNull();
      expect(gate!.status).toBe('red');
      expect(gate!.status).toBe(before);
    });

    it('should return null for non-existent gate', () => {
      const result = escalateGate('X' as any);
      expect(result).toBeNull();
    });
  });

  describe('resolveGate', () => {
    it('should resolve red to amber', () => {
      setGateStatus('A', 'red');
      const gate = resolveGate('A');
      
      expect(gate).not.toBeNull();
      expect(gate!.status).toBe('amber');
    });

    it('should resolve amber to green', () => {
      setGateStatus('B', 'amber');
      const gate = resolveGate('B');
      
      expect(gate).not.toBeNull();
      expect(gate!.status).toBe('green');
    });

    it('should not resolve beyond green', () => {
      setGateStatus('C', 'green');
      const before = getGates().find(g => g.id === 'C')!.status;
      const gate = resolveGate('C');
      
      expect(gate).not.toBeNull();
      expect(gate!.status).toBe('green');
      expect(gate!.status).toBe(before);
    });

    it('should return null for non-existent gate', () => {
      const result = resolveGate('Y' as any);
      expect(result).toBeNull();
    });
  });

  describe('Gate State Transitions', () => {
    it('should support full escalation cycle', () => {
      setGateStatus('A', 'green');
      
      escalateGate('A');
      expect(getGates().find(g => g.id === 'A')!.status).toBe('amber');
      
      escalateGate('A');
      expect(getGates().find(g => g.id === 'A')!.status).toBe('red');
    });

    it('should support full resolution cycle', () => {
      setGateStatus('B', 'red');
      
      resolveGate('B');
      expect(getGates().find(g => g.id === 'B')!.status).toBe('amber');
      
      resolveGate('B');
      expect(getGates().find(g => g.id === 'B')!.status).toBe('green');
    });

    it('should support escalation then resolution', () => {
      setGateStatus('C', 'green');
      
      escalateGate('C');
      expect(getGates().find(g => g.id === 'C')!.status).toBe('amber');
      
      resolveGate('C');
      expect(getGates().find(g => g.id === 'C')!.status).toBe('green');
    });
  });
});
