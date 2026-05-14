/**
 * 𓂀 PHANTOM AGENT MONTE CARLO SIMULATOR 𓂀
 * Sub-agents running continuous pre-computation simulations
 * Charter: ZCE-PHANTOM-001
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 *
 * This system implements phantom agents that continuously run Monte Carlo
 * simulations in the background, pre-computing thousands of decision scenarios
 * per second. By the time the main system needs to make a decision, the
 * statistical analysis is already complete.
 *
 * Architecture:
 * - PhantomAgent: Background sub-agent running simulations
 * - SimulationPool: Manages pools of phantom agents
 * - DecisionPrecomputer: Feeds pre-computed results to main agents
 * - ScenarioTree: Stores branching decision paths
 */

import { PHI, PHI_INVERSE, SCHUMANN_RESONANCE_MS } from '../cloudflare-edge/CloudflareWorkersBridge';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION I: CONSTANTS & CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/** φ-harmonic base frequency for simulation cycles */
const PHI_SIMULATION_FREQUENCY = 1000 * PHI; // ~1618 simulations/second base rate

/** Schumann-resonant batch timing */
const BATCH_INTERVAL_MS = SCHUMANN_RESONANCE_MS / PHI; // ~78.7ms per batch

/** Maximum phantom agents per pool */
const MAX_PHANTOM_AGENTS = Math.floor(PHI * PHI * PHI * 10); // ~42 agents (φ³ × 10)

/** Simulation depth for Monte Carlo trees */
const DEFAULT_SIMULATION_DEPTH = Math.floor(PHI * 8); // ~13 levels deep

/** Confidence threshold for decision readiness */
const CONFIDENCE_THRESHOLD = 1 - PHI_INVERSE; // ~0.382 (φ⁻¹ complement)

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION II: CORE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Represents a single simulation scenario
 */
export interface SimulationScenario {
  id: string;
  timestamp: number;
  parameters: Record<string, number>;
  outcome: SimulationOutcome;
  probability: number;
  pathFromRoot: string[];
  depth: number;
}

/**
 * Outcome of a single simulation run
 */
export interface SimulationOutcome {
  success: boolean;
  value: number;
  cost: number;
  risk: number;
  confidence: number;
  metadata: Record<string, unknown>;
}

/**
 * Statistical summary of multiple simulations
 */
export interface SimulationStatistics {
  totalRuns: number;
  successRate: number;
  meanValue: number;
  standardDeviation: number;
  percentile95: number;
  percentile5: number;
  expectedValue: number;
  riskAdjustedReturn: number;
  phiCoherence: number;
  confidenceInterval: [number, number];
}

/**
 * Pre-computed decision with full statistical backing
 */
export interface PrecomputedDecision {
  decisionId: string;
  timestamp: number;
  recommendation: 'proceed' | 'wait' | 'abort' | 'escalate';
  confidence: number;
  statistics: SimulationStatistics;
  scenarios: SimulationScenario[];
  computationTimeMs: number;
  phantomAgentCount: number;
  simulationsPerSecond: number;
}

/**
 * State of a phantom agent
 */
export interface PhantomAgentState {
  id: string;
  status: 'idle' | 'simulating' | 'aggregating' | 'feeding';
  currentScenario: string | null;
  simulationsCompleted: number;
  simulationsPerSecond: number;
  lastHeartbeat: number;
  assignedDecisionId: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION III: PHANTOM AGENT CLASS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PhantomAgent - A background sub-agent that runs Monte Carlo simulations
 * 
 * These agents operate continuously, running thousands of simulations per second
 * and feeding results to the decision precomputer. They are "phantom" because
 * they operate invisibly in the background, preparing decisions before they're needed.
 */
export class PhantomAgent {
  readonly id: string;
  private state: PhantomAgentState;
  private simulationBuffer: SimulationScenario[] = [];
  private isRunning = false;
  private simulationFunction: SimulationFunction;

  constructor(
    id: string,
    simulationFunction: SimulationFunction
  ) {
    this.id = id;
    this.simulationFunction = simulationFunction;
    this.state = {
      id,
      status: 'idle',
      currentScenario: null,
      simulationsCompleted: 0,
      simulationsPerSecond: 0,
      lastHeartbeat: Date.now(),
      assignedDecisionId: null
    };
  }

  /**
   * Start the phantom agent's simulation loop
   */
  async start(decisionId: string, parameters: SimulationParameters): Promise<void> {
    this.isRunning = true;
    this.state.status = 'simulating';
    this.state.assignedDecisionId = decisionId;
    
    const startTime = Date.now();
    let batchStart = startTime;
    let batchCount = 0;

    while (this.isRunning) {
      // Run a batch of simulations
      const batchSize = Math.floor(PHI_SIMULATION_FREQUENCY / (1000 / BATCH_INTERVAL_MS));
      
      for (let i = 0; i < batchSize && this.isRunning; i++) {
        const scenario = await this.runSingleSimulation(parameters);
        this.simulationBuffer.push(scenario);
        this.state.simulationsCompleted++;
        batchCount++;
      }

      // Update heartbeat and calculate rate
      const now = Date.now();
      const elapsed = now - batchStart;
      if (elapsed > 0) {
        this.state.simulationsPerSecond = (batchCount / elapsed) * 1000;
      }
      
      this.state.lastHeartbeat = now;
      
      // φ-harmonic pause between batches
      await this.phiHarmonicSleep(BATCH_INTERVAL_MS);
      
      batchStart = now;
      batchCount = 0;
    }
  }

  /**
   * Stop the phantom agent
   */
  stop(): void {
    this.isRunning = false;
    this.state.status = 'idle';
    this.state.assignedDecisionId = null;
  }

  /**
   * Run a single Monte Carlo simulation
   */
  private async runSingleSimulation(parameters: SimulationParameters): Promise<SimulationScenario> {
    const scenarioId = `sim-${this.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.state.currentScenario = scenarioId;

    // Generate random parameters within bounds using φ-weighted distribution
    const randomizedParams = this.generatePhiRandomParameters(parameters);
    
    // Run the simulation function
    const outcome = await this.simulationFunction(randomizedParams);
    
    // Calculate probability based on parameter variance from mean
    const probability = this.calculateScenarioProbability(randomizedParams, parameters);

    return {
      id: scenarioId,
      timestamp: Date.now(),
      parameters: randomizedParams,
      outcome,
      probability,
      pathFromRoot: this.generatePathFromRoot(randomizedParams),
      depth: parameters.depth || 0
    };
  }

  /**
   * Generate parameters with φ-weighted random distribution
   * This creates a distribution that favors values near the golden ratio points
   */
  private generatePhiRandomParameters(params: SimulationParameters): Record<string, number> {
    const result: Record<string, number> = {};
    
    for (const [key, config] of Object.entries(params.parameterRanges)) {
      const { min, max, phiWeight = 1 } = config;
      const range = max - min;
      
      // φ-weighted random: combines uniform with φ-biased distribution
      const uniform = Math.random();
      const phiBiased = this.phiDistribution(Math.random());
      const combined = uniform * (1 - phiWeight) + phiBiased * phiWeight;
      
      result[key] = min + range * combined;
    }
    
    return result;
  }

  /**
   * φ-distribution: Maps uniform random to φ-weighted distribution
   */
  private phiDistribution(x: number): number {
    // Creates peaks at φ⁻¹ (~0.618) and φ⁻² (~0.382)
    const phi1 = PHI_INVERSE;
    const phi2 = PHI_INVERSE * PHI_INVERSE;
    
    // Blend between the two φ points
    if (x < 0.5) {
      return phi2 + (x * 2) * (phi1 - phi2);
    } else {
      return phi1 + ((x - 0.5) * 2) * (1 - phi1);
    }
  }

  /**
   * Calculate probability of a scenario based on parameter deviation
   */
  private calculateScenarioProbability(
    actual: Record<string, number>,
    params: SimulationParameters
  ): number {
    let totalDeviation = 0;
    let count = 0;
    
    for (const [key, config] of Object.entries(params.parameterRanges)) {
      const { min, max, mean } = config;
      const range = max - min;
      const actualMean = mean ?? (min + max) / 2;
      const deviation = Math.abs(actual[key] - actualMean) / range;
      totalDeviation += deviation;
      count++;
    }
    
    const avgDeviation = count > 0 ? totalDeviation / count : 0;
    // Convert deviation to probability using Gaussian-like decay
    return Math.exp(-avgDeviation * avgDeviation * PHI);
  }

  /**
   * Generate decision path from root based on parameter choices
   */
  private generatePathFromRoot(params: Record<string, number>): string[] {
    const path: string[] = [];
    for (const [key, value] of Object.entries(params)) {
      path.push(`${key}:${value.toFixed(4)}`);
    }
    return path;
  }

  /**
   * φ-harmonic sleep function
   */
  private phiHarmonicSleep(baseMs: number): Promise<void> {
    // Add small φ-based jitter to prevent synchronization issues
    const jitter = (Math.random() - 0.5) * baseMs * PHI_INVERSE * 0.1;
    return new Promise(resolve => setTimeout(resolve, baseMs + jitter));
  }

  /**
   * Harvest completed simulations from buffer
   */
  harvestSimulations(): SimulationScenario[] {
    const harvested = [...this.simulationBuffer];
    this.simulationBuffer = [];
    return harvested;
  }

  /**
   * Get current agent state
   */
  getState(): PhantomAgentState {
    return { ...this.state };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION IV: SIMULATION POOL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * SimulationPool - Manages a pool of phantom agents
 */
export class SimulationPool {
  private agents: Map<string, PhantomAgent> = new Map();
  private readonly maxAgents: number;
  private simulationFunction: SimulationFunction;

  constructor(
    simulationFunction: SimulationFunction,
    maxAgents: number = MAX_PHANTOM_AGENTS
  ) {
    this.simulationFunction = simulationFunction;
    this.maxAgents = maxAgents;
  }

  /**
   * Spawn new phantom agents for a decision
   */
  spawnAgents(count: number, decisionId: string, parameters: SimulationParameters): string[] {
    const spawnCount = Math.min(count, this.maxAgents - this.agents.size);
    const spawnedIds: string[] = [];

    for (let i = 0; i < spawnCount; i++) {
      const agentId = `phantom-${decisionId}-${i}-${Date.now()}`;
      const agent = new PhantomAgent(agentId, this.simulationFunction);
      this.agents.set(agentId, agent);
      spawnedIds.push(agentId);
      
      // Start the agent (fire and forget - they run independently)
      agent.start(decisionId, parameters);
    }

    return spawnedIds;
  }

  /**
   * Terminate agents for a decision
   */
  terminateAgents(decisionId: string): void {
    for (const [id, agent] of this.agents) {
      if (agent.getState().assignedDecisionId === decisionId) {
        agent.stop();
        this.agents.delete(id);
      }
    }
  }

  /**
   * Harvest all simulations from all agents
   */
  harvestAll(): SimulationScenario[] {
    const allScenarios: SimulationScenario[] = [];
    
    for (const agent of this.agents.values()) {
      allScenarios.push(...agent.harvestSimulations());
    }
    
    return allScenarios;
  }

  /**
   * Get aggregate statistics from all agents
   */
  getPoolStatistics(): PoolStatistics {
    let totalSimulations = 0;
    let totalRate = 0;
    let activeCount = 0;

    for (const agent of this.agents.values()) {
      const state = agent.getState();
      totalSimulations += state.simulationsCompleted;
      totalRate += state.simulationsPerSecond;
      if (state.status === 'simulating') activeCount++;
    }

    return {
      totalAgents: this.agents.size,
      activeAgents: activeCount,
      totalSimulations,
      aggregateSimulationsPerSecond: totalRate,
      utilizationRate: this.agents.size > 0 ? activeCount / this.agents.size : 0
    };
  }

  /**
   * Shutdown all agents
   */
  shutdown(): void {
    for (const agent of this.agents.values()) {
      agent.stop();
    }
    this.agents.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION V: DECISION PRECOMPUTER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * MonteCarloDecisionPrecomputer - Pre-computes decisions using phantom agents
 * 
 * This is the core system that manages phantom agents to continuously
 * pre-compute decision scenarios. By the time a decision is needed,
 * thousands of simulations have already been run.
 */
export class MonteCarloDecisionPrecomputer {
  private pool: SimulationPool;
  private precomputedDecisions: Map<string, PrecomputedDecision> = new Map();
  private activePrecomputations: Map<string, PrecomputationState> = new Map();
  private harvestInterval: ReturnType<typeof setInterval> | null = null;

  constructor(simulationFunction: SimulationFunction) {
    this.pool = new SimulationPool(simulationFunction);
  }

  /**
   * Start pre-computing a decision
   * 
   * This spawns phantom agents that will continuously run simulations,
   * feeding results to the decision buffer until stopped.
   */
  startPrecomputation(
    decisionId: string,
    parameters: SimulationParameters,
    agentCount: number = Math.floor(PHI * 8) // Default ~13 agents
  ): void {
    if (this.activePrecomputations.has(decisionId)) {
      throw new Error(`Precomputation already active for decision: ${decisionId}`);
    }

    // Spawn phantom agents
    const agentIds = this.pool.spawnAgents(agentCount, decisionId, parameters);
    
    // Initialize precomputation state
    this.activePrecomputations.set(decisionId, {
      decisionId,
      startTime: Date.now(),
      parameters,
      agentIds,
      scenarios: [],
      status: 'running'
    });

    // Start harvest interval if not running
    if (!this.harvestInterval) {
      this.harvestInterval = setInterval(() => this.harvestAndAggregate(), BATCH_INTERVAL_MS);
    }
  }

  /**
   * Stop pre-computation and get final decision
   */
  stopPrecomputation(decisionId: string): PrecomputedDecision | null {
    const state = this.activePrecomputations.get(decisionId);
    if (!state) return null;

    // Final harvest
    this.harvestAndAggregate();

    // Terminate agents
    this.pool.terminateAgents(decisionId);
    
    // Generate final decision
    const decision = this.generateDecision(decisionId, state);
    
    // Cleanup
    this.activePrecomputations.delete(decisionId);
    
    // Stop harvest interval if no more active precomputations
    if (this.activePrecomputations.size === 0 && this.harvestInterval) {
      clearInterval(this.harvestInterval);
      this.harvestInterval = null;
    }

    return decision;
  }

  /**
   * Get current pre-computed decision (without stopping)
   */
  getPrecomputedDecision(decisionId: string): PrecomputedDecision | null {
    const state = this.activePrecomputations.get(decisionId);
    if (!state) return this.precomputedDecisions.get(decisionId) || null;
    
    return this.generateDecision(decisionId, state);
  }

  /**
   * Check if precomputation has reached confidence threshold
   */
  isDecisionReady(decisionId: string): boolean {
    const decision = this.getPrecomputedDecision(decisionId);
    return decision !== null && decision.confidence >= CONFIDENCE_THRESHOLD;
  }

  /**
   * Harvest simulations from all agents and aggregate
   */
  private harvestAndAggregate(): void {
    const harvested = this.pool.harvestAll();
    
    // Distribute harvested scenarios to their respective precomputations
    for (const scenario of harvested) {
      // Extract decision ID from scenario path or agent assignment
      for (const [decisionId, state] of this.activePrecomputations) {
        if (state.status === 'running') {
          state.scenarios.push(scenario);
        }
      }
    }
  }

  /**
   * Generate a decision from precomputation state
   */
  private generateDecision(decisionId: string, state: PrecomputationState): PrecomputedDecision {
    const statistics = this.calculateStatistics(state.scenarios);
    const computationTimeMs = Date.now() - state.startTime;
    const poolStats = this.pool.getPoolStatistics();

    // Determine recommendation based on statistics
    const recommendation = this.determineRecommendation(statistics);

    const decision: PrecomputedDecision = {
      decisionId,
      timestamp: Date.now(),
      recommendation,
      confidence: statistics.totalRuns > 100 ? 
        Math.min(0.99, statistics.totalRuns / 10000 + statistics.phiCoherence * 0.5) : 
        statistics.totalRuns / 100,
      statistics,
      scenarios: state.scenarios.slice(-1000), // Keep last 1000 scenarios
      computationTimeMs,
      phantomAgentCount: state.agentIds.length,
      simulationsPerSecond: poolStats.aggregateSimulationsPerSecond
    };

    this.precomputedDecisions.set(decisionId, decision);
    return decision;
  }

  /**
   * Calculate statistics from scenarios
   */
  private calculateStatistics(scenarios: SimulationScenario[]): SimulationStatistics {
    if (scenarios.length === 0) {
      return {
        totalRuns: 0,
        successRate: 0,
        meanValue: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile5: 0,
        expectedValue: 0,
        riskAdjustedReturn: 0,
        phiCoherence: 0,
        confidenceInterval: [0, 0]
      };
    }

    const values = scenarios.map(s => s.outcome.value);
    const successes = scenarios.filter(s => s.outcome.success).length;
    
    // Basic statistics
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Sorted for percentiles
    const sorted = [...values].sort((a, b) => a - b);
    const p5Index = Math.floor(sorted.length * 0.05);
    const p95Index = Math.floor(sorted.length * 0.95);
    
    // Expected value (probability-weighted)
    const expectedValue = scenarios.reduce((sum, s) => 
      sum + s.outcome.value * s.probability, 0) / 
      scenarios.reduce((sum, s) => sum + s.probability, 0);

    // Risk-adjusted return (Sharpe-like ratio)
    const riskFreeRate = 0.02; // 2% baseline
    const riskAdjustedReturn = stdDev > 0 ? (mean - riskFreeRate) / stdDev : 0;

    // φ-coherence: How well results align with φ-harmonic expectations
    const phiCoherence = this.calculatePhiCoherence(values);

    // Confidence interval (95%)
    const marginOfError = 1.96 * stdDev / Math.sqrt(scenarios.length);

    return {
      totalRuns: scenarios.length,
      successRate: successes / scenarios.length,
      meanValue: mean,
      standardDeviation: stdDev,
      percentile95: sorted[p95Index] || mean,
      percentile5: sorted[p5Index] || mean,
      expectedValue,
      riskAdjustedReturn,
      phiCoherence,
      confidenceInterval: [mean - marginOfError, mean + marginOfError]
    };
  }

  /**
   * Calculate φ-coherence of results
   */
  private calculatePhiCoherence(values: number[]): number {
    if (values.length < 2) return 0;
    
    // Check how many values fall near φ-harmonic ratios
    let coherentCount = 0;
    
    for (let i = 1; i < values.length; i++) {
      const ratio = values[i] / values[i - 1];
      const distanceFromPhi = Math.min(
        Math.abs(ratio - PHI),
        Math.abs(ratio - PHI_INVERSE),
        Math.abs(ratio - 1)
      );
      
      if (distanceFromPhi < 0.1) coherentCount++;
    }
    
    return coherentCount / (values.length - 1);
  }

  /**
   * Determine recommendation based on statistics
   */
  private determineRecommendation(
    stats: SimulationStatistics
  ): PrecomputedDecision['recommendation'] {
    // High confidence, positive expected value → proceed
    if (stats.successRate > 0.7 && stats.expectedValue > 0 && stats.riskAdjustedReturn > 0.5) {
      return 'proceed';
    }
    
    // Moderate confidence, need more data → wait
    if (stats.totalRuns < 1000 || stats.standardDeviation > stats.meanValue) {
      return 'wait';
    }
    
    // High risk, negative expectation → abort
    if (stats.successRate < 0.3 || stats.expectedValue < 0) {
      return 'abort';
    }
    
    // Complex situation → escalate to human/higher authority
    return 'escalate';
  }

  /**
   * Get pool statistics
   */
  getPoolStatistics(): PoolStatistics {
    return this.pool.getPoolStatistics();
  }

  /**
   * Shutdown everything
   */
  shutdown(): void {
    if (this.harvestInterval) {
      clearInterval(this.harvestInterval);
      this.harvestInterval = null;
    }
    this.pool.shutdown();
    this.activePrecomputations.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VI: TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Function signature for simulation logic
 */
export type SimulationFunction = (params: Record<string, number>) => Promise<SimulationOutcome>;

/**
 * Parameters for running simulations
 */
export interface SimulationParameters {
  parameterRanges: Record<string, ParameterRange>;
  depth?: number;
  maxIterations?: number;
}

/**
 * Range specification for a parameter
 */
export interface ParameterRange {
  min: number;
  max: number;
  mean?: number;
  phiWeight?: number; // 0-1, how much to bias toward φ distribution
}

/**
 * Internal precomputation state
 */
interface PrecomputationState {
  decisionId: string;
  startTime: number;
  parameters: SimulationParameters;
  agentIds: string[];
  scenarios: SimulationScenario[];
  status: 'running' | 'stopped';
}

/**
 * Pool statistics
 */
export interface PoolStatistics {
  totalAgents: number;
  activeAgents: number;
  totalSimulations: number;
  aggregateSimulationsPerSecond: number;
  utilizationRate: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VII: FACTORY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a standard decision precomputer for cost optimization
 */
export function createCostOptimizationPrecomputer(): MonteCarloDecisionPrecomputer {
  const simulationFunction: SimulationFunction = async (params) => {
    // Simulate cost optimization scenario
    const baselineCost = params.baselineCost || 100;
    const optimizationFactor = params.optimizationFactor || 0.9;
    const variance = params.variance || 0.1;
    
    const randomVariance = 1 + (Math.random() - 0.5) * 2 * variance;
    const finalCost = baselineCost * optimizationFactor * randomVariance;
    const savings = baselineCost - finalCost;
    
    return {
      success: savings > 0,
      value: savings,
      cost: finalCost,
      risk: variance * Math.random(),
      confidence: 1 - variance,
      metadata: {
        baselineCost,
        optimizationFactor,
        randomVariance
      }
    };
  };

  return new MonteCarloDecisionPrecomputer(simulationFunction);
}

/**
 * Create a precomputer for route/path optimization
 */
export function createPathOptimizationPrecomputer(): MonteCarloDecisionPrecomputer {
  const simulationFunction: SimulationFunction = async (params) => {
    const pathLength = params.pathLength || 10;
    const complexity = params.complexity || 0.5;
    const congestion = params.congestion || 0.3;
    
    // Simulate path finding with random obstacles
    const baseTime = pathLength * 10;
    const congestionDelay = baseTime * congestion * Math.random();
    const complexityPenalty = baseTime * complexity * Math.random();
    const totalTime = baseTime + congestionDelay + complexityPenalty;
    
    // φ-harmonic optimal path would be at baseTime * PHI_INVERSE
    const optimalTime = baseTime * PHI_INVERSE;
    const efficiency = optimalTime / totalTime;
    
    return {
      success: efficiency > 0.5,
      value: efficiency,
      cost: totalTime,
      risk: complexity * congestion,
      confidence: 1 - (complexity + congestion) / 2,
      metadata: {
        pathLength,
        congestionDelay,
        complexityPenalty,
        efficiency
      }
    };
  };

  return new MonteCarloDecisionPrecomputer(simulationFunction);
}

/**
 * Create a precomputer for resource allocation
 */
export function createResourceAllocationPrecomputer(): MonteCarloDecisionPrecomputer {
  const simulationFunction: SimulationFunction = async (params) => {
    const totalResources = params.totalResources || 100;
    const demand = params.demand || 80;
    const volatility = params.volatility || 0.2;
    
    // Simulate resource allocation with demand fluctuation
    const actualDemand = demand * (1 + (Math.random() - 0.5) * 2 * volatility);
    const allocation = Math.min(totalResources, actualDemand);
    const utilization = allocation / totalResources;
    const waste = totalResources - allocation;
    const shortfall = Math.max(0, actualDemand - totalResources);
    
    return {
      success: shortfall === 0 && waste < totalResources * 0.2,
      value: utilization,
      cost: waste + shortfall * 2, // Shortfall costs more than waste
      risk: volatility * (shortfall / demand),
      confidence: 1 - volatility,
      metadata: {
        actualDemand,
        allocation,
        utilization,
        waste,
        shortfall
      }
    };
  };

  return new MonteCarloDecisionPrecomputer(simulationFunction);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VIII: EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  PHI_SIMULATION_FREQUENCY,
  BATCH_INTERVAL_MS,
  MAX_PHANTOM_AGENTS,
  DEFAULT_SIMULATION_DEPTH,
  CONFIDENCE_THRESHOLD
};
