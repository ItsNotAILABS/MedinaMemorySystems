/**
 * 𓂀 PHANTOM AGENT MONTE CARLO TESTS 𓂀
 * Test suite for the Phantom Agent simulation system
 * Charter: ZCE-PHANTOM-001
 */

import {
  PhantomAgent,
  SimulationPool,
  MonteCarloDecisionPrecomputer,
  createCostOptimizationPrecomputer,
  createPathOptimizationPrecomputer,
  createResourceAllocationPrecomputer,
  PHI_SIMULATION_FREQUENCY,
  BATCH_INTERVAL_MS,
  MAX_PHANTOM_AGENTS,
  DEFAULT_SIMULATION_DEPTH,
  CONFIDENCE_THRESHOLD,
  SimulationOutcome,
  SimulationParameters
} from '../zero-cost-engines/PhantomAgentSimulator';

const PHI = 1.618033988749895;
const PHI_INVERSE = 0.6180339887498949;

// Mock simulation function for testing
const mockSimulationFunction = async (params: Record<string, number>): Promise<SimulationOutcome> => {
  const value = (params.input || 50) * (1 + (Math.random() - 0.5) * 0.2);
  return {
    success: value > 40,
    value,
    cost: 100 - value,
    risk: Math.random() * 0.3,
    confidence: 0.8 + Math.random() * 0.2,
    metadata: { simulated: true }
  };
};

describe('Phantom Agent Monte Carlo Simulator', () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION I: CONSTANTS TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Constants', () => {
    it('should have φ-based simulation frequency', () => {
      expect(PHI_SIMULATION_FREQUENCY).toBeCloseTo(1000 * PHI, 0);
      expect(PHI_SIMULATION_FREQUENCY).toBeGreaterThan(1600);
      expect(PHI_SIMULATION_FREQUENCY).toBeLessThan(1620);
    });

    it('should have Schumann/φ batch interval', () => {
      // Schumann resonance (~873ms) / φ ≈ 539ms
      expect(BATCH_INTERVAL_MS).toBeGreaterThan(500);
      expect(BATCH_INTERVAL_MS).toBeLessThan(600);
    });

    it('should have φ³×10 max agents', () => {
      const expectedMax = Math.floor(PHI * PHI * PHI * 10);
      expect(MAX_PHANTOM_AGENTS).toBe(expectedMax);
      expect(MAX_PHANTOM_AGENTS).toBeGreaterThanOrEqual(40);
      expect(MAX_PHANTOM_AGENTS).toBeLessThanOrEqual(45);
    });

    it('should have φ×8 simulation depth', () => {
      const expectedDepth = Math.floor(PHI * 8);
      expect(DEFAULT_SIMULATION_DEPTH).toBe(expectedDepth);
      expect(DEFAULT_SIMULATION_DEPTH).toBe(12); // floor(12.944) = 12
    });

    it('should have φ⁻¹ complement confidence threshold', () => {
      expect(CONFIDENCE_THRESHOLD).toBeCloseTo(1 - PHI_INVERSE, 10);
      expect(CONFIDENCE_THRESHOLD).toBeCloseTo(0.382, 3);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION II: PHANTOM AGENT TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('PhantomAgent', () => {
    it('should initialize with correct state', () => {
      const agent = new PhantomAgent('test-agent-1', mockSimulationFunction);
      const state = agent.getState();

      expect(state.id).toBe('test-agent-1');
      expect(state.status).toBe('idle');
      expect(state.simulationsCompleted).toBe(0);
      expect(state.assignedDecisionId).toBeNull();
    });

    it('should harvest empty buffer initially', () => {
      const agent = new PhantomAgent('test-agent-2', mockSimulationFunction);
      const harvested = agent.harvestSimulations();
      
      expect(harvested).toHaveLength(0);
    });

    it('should have unique id', () => {
      const agent1 = new PhantomAgent('agent-a', mockSimulationFunction);
      const agent2 = new PhantomAgent('agent-b', mockSimulationFunction);
      
      expect(agent1.id).not.toBe(agent2.id);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION III: SIMULATION POOL TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('SimulationPool', () => {
    let pool: SimulationPool;

    beforeEach(() => {
      pool = new SimulationPool(mockSimulationFunction, 10);
    });

    afterEach(() => {
      pool.shutdown();
    });

    it('should spawn agents up to max limit', () => {
      const params: SimulationParameters = {
        parameterRanges: {
          input: { min: 0, max: 100 }
        }
      };

      const spawned = pool.spawnAgents(5, 'decision-1', params);
      expect(spawned).toHaveLength(5);

      const stats = pool.getPoolStatistics();
      expect(stats.totalAgents).toBe(5);
    });

    it('should not exceed max agents', () => {
      const params: SimulationParameters = {
        parameterRanges: {
          input: { min: 0, max: 100 }
        }
      };

      // Pool has max of 10
      const spawned1 = pool.spawnAgents(8, 'decision-1', params);
      const spawned2 = pool.spawnAgents(5, 'decision-2', params);

      expect(spawned1).toHaveLength(8);
      expect(spawned2).toHaveLength(2); // Only 2 slots left

      const stats = pool.getPoolStatistics();
      expect(stats.totalAgents).toBe(10);
    });

    it('should terminate agents by decision ID', () => {
      const params: SimulationParameters = {
        parameterRanges: {
          input: { min: 0, max: 100 }
        }
      };

      pool.spawnAgents(3, 'decision-A', params);
      pool.spawnAgents(3, 'decision-B', params);

      let stats = pool.getPoolStatistics();
      expect(stats.totalAgents).toBe(6);

      pool.terminateAgents('decision-A');
      
      stats = pool.getPoolStatistics();
      expect(stats.totalAgents).toBe(3);
    });

    it('should harvest all simulations', () => {
      const harvested = pool.harvestAll();
      expect(Array.isArray(harvested)).toBe(true);
    });

    it('should track utilization rate', () => {
      const stats = pool.getPoolStatistics();
      expect(typeof stats.utilizationRate).toBe('number');
      expect(stats.utilizationRate).toBeGreaterThanOrEqual(0);
      expect(stats.utilizationRate).toBeLessThanOrEqual(1);
    });

    it('should shutdown cleanly', () => {
      const params: SimulationParameters = {
        parameterRanges: {
          input: { min: 0, max: 100 }
        }
      };

      pool.spawnAgents(5, 'decision-1', params);
      pool.shutdown();

      const stats = pool.getPoolStatistics();
      expect(stats.totalAgents).toBe(0);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION IV: DECISION PRECOMPUTER TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('MonteCarloDecisionPrecomputer', () => {
    let precomputer: MonteCarloDecisionPrecomputer;

    beforeEach(() => {
      precomputer = new MonteCarloDecisionPrecomputer(mockSimulationFunction);
    });

    afterEach(() => {
      precomputer.shutdown();
    });

    it('should start precomputation', () => {
      const params: SimulationParameters = {
        parameterRanges: {
          input: { min: 0, max: 100, mean: 50 }
        }
      };

      // Should not throw
      expect(() => {
        precomputer.startPrecomputation('decision-1', params, 3);
      }).not.toThrow();
    });

    it('should not allow duplicate precomputation starts', () => {
      const params: SimulationParameters = {
        parameterRanges: {
          input: { min: 0, max: 100 }
        }
      };

      precomputer.startPrecomputation('decision-1', params, 3);
      
      expect(() => {
        precomputer.startPrecomputation('decision-1', params, 3);
      }).toThrow();
    });

    it('should stop precomputation and return decision', () => {
      const params: SimulationParameters = {
        parameterRanges: {
          input: { min: 0, max: 100 }
        }
      };

      precomputer.startPrecomputation('decision-1', params, 3);
      
      const decision = precomputer.stopPrecomputation('decision-1');
      
      expect(decision).not.toBeNull();
      expect(decision?.decisionId).toBe('decision-1');
      expect(decision?.recommendation).toBeDefined();
      expect(['proceed', 'wait', 'abort', 'escalate']).toContain(decision?.recommendation);
    });

    it('should return null for unknown decision', () => {
      const decision = precomputer.stopPrecomputation('unknown-decision');
      expect(decision).toBeNull();
    });

    it('should get precomputed decision without stopping', () => {
      const params: SimulationParameters = {
        parameterRanges: {
          input: { min: 0, max: 100 }
        }
      };

      precomputer.startPrecomputation('decision-1', params, 3);
      
      const decision = precomputer.getPrecomputedDecision('decision-1');
      
      expect(decision).not.toBeNull();
      // Can still stop after getting
      const finalDecision = precomputer.stopPrecomputation('decision-1');
      expect(finalDecision).not.toBeNull();
    });

    it('should track pool statistics', () => {
      const stats = precomputer.getPoolStatistics();
      
      expect(stats).toBeDefined();
      expect(typeof stats.totalAgents).toBe('number');
      expect(typeof stats.activeAgents).toBe('number');
      expect(typeof stats.totalSimulations).toBe('number');
      expect(typeof stats.aggregateSimulationsPerSecond).toBe('number');
    });

    it('should have valid statistics structure', () => {
      const params: SimulationParameters = {
        parameterRanges: {
          input: { min: 0, max: 100 }
        }
      };

      precomputer.startPrecomputation('decision-1', params, 3);
      const decision = precomputer.stopPrecomputation('decision-1');
      
      expect(decision?.statistics).toBeDefined();
      expect(typeof decision?.statistics.totalRuns).toBe('number');
      expect(typeof decision?.statistics.successRate).toBe('number');
      expect(typeof decision?.statistics.meanValue).toBe('number');
      expect(typeof decision?.statistics.standardDeviation).toBe('number');
      expect(typeof decision?.statistics.expectedValue).toBe('number');
      expect(typeof decision?.statistics.phiCoherence).toBe('number');
      expect(Array.isArray(decision?.statistics.confidenceInterval)).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION V: FACTORY FUNCTION TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Factory Functions', () => {
    describe('createCostOptimizationPrecomputer', () => {
      it('should create a working precomputer', () => {
        const precomputer = createCostOptimizationPrecomputer();
        
        expect(precomputer).toBeDefined();
        expect(precomputer).toBeInstanceOf(MonteCarloDecisionPrecomputer);
        
        precomputer.shutdown();
      });

      it('should run cost optimization simulations', () => {
        const precomputer = createCostOptimizationPrecomputer();
        
        const params: SimulationParameters = {
          parameterRanges: {
            baselineCost: { min: 50, max: 150, mean: 100 },
            optimizationFactor: { min: 0.8, max: 1.0, mean: 0.9 },
            variance: { min: 0.05, max: 0.2, mean: 0.1 }
          }
        };

        precomputer.startPrecomputation('cost-decision', params, 2);
        const decision = precomputer.stopPrecomputation('cost-decision');
        
        expect(decision).not.toBeNull();
        expect(decision?.statistics).toBeDefined();
        
        precomputer.shutdown();
      });
    });

    describe('createPathOptimizationPrecomputer', () => {
      it('should create a working precomputer', () => {
        const precomputer = createPathOptimizationPrecomputer();
        
        expect(precomputer).toBeDefined();
        expect(precomputer).toBeInstanceOf(MonteCarloDecisionPrecomputer);
        
        precomputer.shutdown();
      });

      it('should run path optimization simulations', () => {
        const precomputer = createPathOptimizationPrecomputer();
        
        const params: SimulationParameters = {
          parameterRanges: {
            pathLength: { min: 5, max: 20, mean: 10 },
            complexity: { min: 0.1, max: 0.8, mean: 0.5 },
            congestion: { min: 0.1, max: 0.6, mean: 0.3 }
          }
        };

        precomputer.startPrecomputation('path-decision', params, 2);
        const decision = precomputer.stopPrecomputation('path-decision');
        
        expect(decision).not.toBeNull();
        
        precomputer.shutdown();
      });
    });

    describe('createResourceAllocationPrecomputer', () => {
      it('should create a working precomputer', () => {
        const precomputer = createResourceAllocationPrecomputer();
        
        expect(precomputer).toBeDefined();
        expect(precomputer).toBeInstanceOf(MonteCarloDecisionPrecomputer);
        
        precomputer.shutdown();
      });

      it('should run resource allocation simulations', () => {
        const precomputer = createResourceAllocationPrecomputer();
        
        const params: SimulationParameters = {
          parameterRanges: {
            totalResources: { min: 50, max: 150, mean: 100 },
            demand: { min: 60, max: 120, mean: 80 },
            volatility: { min: 0.1, max: 0.4, mean: 0.2 }
          }
        };

        precomputer.startPrecomputation('resource-decision', params, 2);
        const decision = precomputer.stopPrecomputation('resource-decision');
        
        expect(decision).not.toBeNull();
        
        precomputer.shutdown();
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION VI: STATISTICAL VALIDATION TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Statistical Validation', () => {
    it('should have success rate between 0 and 1', () => {
      const precomputer = createCostOptimizationPrecomputer();
      
      const params: SimulationParameters = {
        parameterRanges: {
          baselineCost: { min: 50, max: 150 },
          optimizationFactor: { min: 0.7, max: 1.0 },
          variance: { min: 0.05, max: 0.3 }
        }
      };

      precomputer.startPrecomputation('stat-test', params, 3);
      const decision = precomputer.stopPrecomputation('stat-test');
      
      expect(decision?.statistics.successRate).toBeGreaterThanOrEqual(0);
      expect(decision?.statistics.successRate).toBeLessThanOrEqual(1);
      
      precomputer.shutdown();
    });

    it('should have non-negative standard deviation', () => {
      const precomputer = createCostOptimizationPrecomputer();
      
      const params: SimulationParameters = {
        parameterRanges: {
          baselineCost: { min: 50, max: 150 }
        }
      };

      precomputer.startPrecomputation('stddev-test', params, 2);
      const decision = precomputer.stopPrecomputation('stddev-test');
      
      expect(decision?.statistics.standardDeviation).toBeGreaterThanOrEqual(0);
      
      precomputer.shutdown();
    });

    it('should have φ-coherence between 0 and 1', () => {
      const precomputer = createCostOptimizationPrecomputer();
      
      const params: SimulationParameters = {
        parameterRanges: {
          baselineCost: { min: 50, max: 150 }
        }
      };

      precomputer.startPrecomputation('phi-test', params, 2);
      const decision = precomputer.stopPrecomputation('phi-test');
      
      expect(decision?.statistics.phiCoherence).toBeGreaterThanOrEqual(0);
      expect(decision?.statistics.phiCoherence).toBeLessThanOrEqual(1);
      
      precomputer.shutdown();
    });

    it('should have valid confidence interval', () => {
      const precomputer = createCostOptimizationPrecomputer();
      
      const params: SimulationParameters = {
        parameterRanges: {
          baselineCost: { min: 50, max: 150 }
        }
      };

      precomputer.startPrecomputation('ci-test', params, 2);
      const decision = precomputer.stopPrecomputation('ci-test');
      
      const [lower, upper] = decision?.statistics.confidenceInterval || [0, 0];
      expect(lower).toBeLessThanOrEqual(upper);
      
      precomputer.shutdown();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION VII: DECISION RECOMMENDATION TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Decision Recommendations', () => {
    it('should return valid recommendation types', () => {
      const precomputer = new MonteCarloDecisionPrecomputer(mockSimulationFunction);
      
      const params: SimulationParameters = {
        parameterRanges: {
          input: { min: 0, max: 100 }
        }
      };

      precomputer.startPrecomputation('rec-test', params, 2);
      const decision = precomputer.stopPrecomputation('rec-test');
      
      expect(['proceed', 'wait', 'abort', 'escalate']).toContain(decision?.recommendation);
      
      precomputer.shutdown();
    });

    it('should include computation metadata', () => {
      const precomputer = new MonteCarloDecisionPrecomputer(mockSimulationFunction);
      
      const params: SimulationParameters = {
        parameterRanges: {
          input: { min: 0, max: 100 }
        }
      };

      precomputer.startPrecomputation('meta-test', params, 3);
      const decision = precomputer.stopPrecomputation('meta-test');
      
      expect(decision?.computationTimeMs).toBeGreaterThanOrEqual(0);
      expect(decision?.phantomAgentCount).toBe(3);
      expect(typeof decision?.simulationsPerSecond).toBe('number');
      
      precomputer.shutdown();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION VIII: INTEGRATION TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Integration', () => {
    it('should handle multiple concurrent decisions', () => {
      const precomputer = new MonteCarloDecisionPrecomputer(mockSimulationFunction);
      
      const params: SimulationParameters = {
        parameterRanges: {
          input: { min: 0, max: 100 }
        }
      };

      precomputer.startPrecomputation('decision-A', params, 2);
      precomputer.startPrecomputation('decision-B', params, 2);
      precomputer.startPrecomputation('decision-C', params, 2);
      
      const decisionA = precomputer.stopPrecomputation('decision-A');
      const decisionB = precomputer.stopPrecomputation('decision-B');
      const decisionC = precomputer.stopPrecomputation('decision-C');
      
      expect(decisionA).not.toBeNull();
      expect(decisionB).not.toBeNull();
      expect(decisionC).not.toBeNull();
      
      expect(decisionA?.decisionId).toBe('decision-A');
      expect(decisionB?.decisionId).toBe('decision-B');
      expect(decisionC?.decisionId).toBe('decision-C');
      
      precomputer.shutdown();
    });

    it('should maintain separate statistics per decision', () => {
      const precomputer = createCostOptimizationPrecomputer();
      
      const params1: SimulationParameters = {
        parameterRanges: {
          baselineCost: { min: 100, max: 200 },
          optimizationFactor: { min: 0.9, max: 1.0 }
        }
      };

      const params2: SimulationParameters = {
        parameterRanges: {
          baselineCost: { min: 10, max: 20 },
          optimizationFactor: { min: 0.5, max: 0.6 }
        }
      };

      precomputer.startPrecomputation('high-cost', params1, 2);
      precomputer.startPrecomputation('low-cost', params2, 2);
      
      const highCost = precomputer.stopPrecomputation('high-cost');
      const lowCost = precomputer.stopPrecomputation('low-cost');
      
      // Different parameters should produce different results
      expect(highCost?.statistics).toBeDefined();
      expect(lowCost?.statistics).toBeDefined();
      
      precomputer.shutdown();
    });
  });
});
