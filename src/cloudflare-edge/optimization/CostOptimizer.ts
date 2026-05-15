/**
 * 𓂀 COST OPTIMIZATION ENGINE 𓂀
 * Phase 3: Optimization - Cost Analysis & Optimization
 * "Efficiency through φ-harmonic resource allocation"
 *
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 * Charter: OPT-COST-001
 */

import { PHI, PHI_INVERSE, SCHUMANN_RESONANCE_MS } from '../CloudflareWorkersBridge';

// ═══════════════════════════════════════════════════════════════════════════
// SECTION I: CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const COST_OPTIMIZER_ID = 'OPT-COST-001';
export const COST_OPTIMIZER_VERSION = '1.0.0';

// Cloudflare pricing tiers (USD)
export const CLOUDFLARE_PRICING = {
  // Workers
  WORKERS_FREE_REQUESTS: 100000,
  WORKERS_PAID_REQUESTS_PER_MILLION: 0.50,
  WORKERS_CPU_MS_FREE: 10,
  WORKERS_CPU_MS_PAID: 0.00001, // per ms over limit

  // KV Storage
  KV_FREE_READS: 100000,
  KV_PAID_READS_PER_MILLION: 0.50,
  KV_FREE_WRITES: 1000,
  KV_PAID_WRITES_PER_MILLION: 5.00,
  KV_STORAGE_PER_GB: 0.50,

  // R2 Storage
  R2_STORAGE_PER_GB: 0.015,
  R2_CLASS_A_OPS_PER_MILLION: 4.50,
  R2_CLASS_B_OPS_PER_MILLION: 0.36,

  // D1 Database
  D1_FREE_READS: 5000000,
  D1_PAID_READS_PER_MILLION: 0.25,
  D1_FREE_WRITES: 100000,
  D1_PAID_WRITES_PER_MILLION: 1.00,
  D1_STORAGE_PER_GB: 0.75,

  // Durable Objects
  DO_FREE_REQUESTS: 1000000,
  DO_PAID_REQUESTS_PER_MILLION: 0.15,
  DO_DURATION_PER_GB_HOUR: 0.00025,

  // Vectorize
  VECTORIZE_QUERIES_PER_MILLION: 0.01,
  VECTORIZE_STORED_VECTORS_PER_MILLION: 0.05,

  // AI Gateway
  AI_GATEWAY_FREE_REQUESTS: 10000,
  AI_GATEWAY_PAID_PER_REQUEST: 0.0001,
} as const;

// Cost optimization thresholds
export const COST_THRESHOLDS = {
  // Monthly budget thresholds (USD)
  BUDGET_EXCELLENT: 100,
  BUDGET_GOOD: 500,
  BUDGET_ACCEPTABLE: 2000,
  BUDGET_HIGH: 5000,

  // Efficiency ratios
  EFFICIENCY_EXCELLENT: 0.95,
  EFFICIENCY_GOOD: 0.85,
  EFFICIENCY_ACCEPTABLE: 0.70,
  EFFICIENCY_POOR: 0.50,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SECTION II: TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface ResourceUsage {
  workers: WorkersUsage;
  kv: KVUsage;
  r2: R2Usage;
  d1: D1Usage;
  durableObjects: DurableObjectsUsage;
  vectorize: VectorizeUsage;
  aiGateway: AIGatewayUsage;
}

export interface WorkersUsage {
  requests: number;
  cpuTimeMs: number;
  errors: number;
}

export interface KVUsage {
  reads: number;
  writes: number;
  storageGB: number;
}

export interface R2Usage {
  storageGB: number;
  classAOps: number;
  classBOps: number;
  egressGB: number;
}

export interface D1Usage {
  reads: number;
  writes: number;
  storageGB: number;
}

export interface DurableObjectsUsage {
  requests: number;
  durationGBHours: number;
  websocketMessages: number;
}

export interface VectorizeUsage {
  queries: number;
  storedVectors: number;
}

export interface AIGatewayUsage {
  requests: number;
  tokensProcessed: number;
}

export interface CostBreakdown {
  workers: number;
  kv: number;
  r2: number;
  d1: number;
  durableObjects: number;
  vectorize: number;
  aiGateway: number;
  total: number;
}

export interface CostAnalysis {
  currentCosts: CostBreakdown;
  projectedMonthlyCosts: CostBreakdown;
  costEfficiency: number;
  savingsOpportunities: SavingsOpportunity[];
  recommendations: CostRecommendation[];
  phiOptimalAllocation: PhiOptimalAllocation;
}

export interface SavingsOpportunity {
  service: string;
  description: string;
  currentCost: number;
  potentialSavings: number;
  implementationEffort: 'low' | 'medium' | 'high';
  priority: number;
}

export interface CostRecommendation {
  category: 'caching' | 'batching' | 'tiering' | 'architecture' | 'scaling';
  description: string;
  expectedSavings: number;
  effort: 'low' | 'medium' | 'high';
  timeToImplement: string;
}

export interface PhiOptimalAllocation {
  workersRatio: number;
  storageRatio: number;
  computeRatio: number;
  networkRatio: number;
  totalPhiCoherence: number;
}

export interface BudgetAlert {
  level: 'info' | 'warning' | 'critical';
  service: string;
  message: string;
  currentSpend: number;
  budgetLimit: number;
  percentUsed: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION III: COST OPTIMIZATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export class CostOptimizer {
  private readonly id = COST_OPTIMIZER_ID;
  private readonly version = COST_OPTIMIZER_VERSION;
  private usageHistory: ResourceUsage[] = [];
  private budgetLimits: Partial<CostBreakdown> = {};

  constructor(budgetLimits?: Partial<CostBreakdown>) {
    if (budgetLimits) {
      this.budgetLimits = budgetLimits;
    }
  }

  /**
   * Calculate costs from resource usage
   */
  calculateCosts(usage: ResourceUsage): CostBreakdown {
    const workers = this.calculateWorkersCost(usage.workers);
    const kv = this.calculateKVCost(usage.kv);
    const r2 = this.calculateR2Cost(usage.r2);
    const d1 = this.calculateD1Cost(usage.d1);
    const durableObjects = this.calculateDOCost(usage.durableObjects);
    const vectorize = this.calculateVectorizeCost(usage.vectorize);
    const aiGateway = this.calculateAIGatewayCost(usage.aiGateway);

    return {
      workers,
      kv,
      r2,
      d1,
      durableObjects,
      vectorize,
      aiGateway,
      total: workers + kv + r2 + d1 + durableObjects + vectorize + aiGateway,
    };
  }

  /**
   * Calculate Workers cost
   */
  private calculateWorkersCost(usage: WorkersUsage): number {
    const paidRequests = Math.max(0, usage.requests - CLOUDFLARE_PRICING.WORKERS_FREE_REQUESTS);
    const requestCost = (paidRequests / 1000000) * CLOUDFLARE_PRICING.WORKERS_PAID_REQUESTS_PER_MILLION;

    const paidCpuMs = Math.max(0, usage.cpuTimeMs - CLOUDFLARE_PRICING.WORKERS_CPU_MS_FREE * usage.requests);
    const cpuCost = paidCpuMs * CLOUDFLARE_PRICING.WORKERS_CPU_MS_PAID;

    return requestCost + cpuCost;
  }

  /**
   * Calculate KV cost
   */
  private calculateKVCost(usage: KVUsage): number {
    const paidReads = Math.max(0, usage.reads - CLOUDFLARE_PRICING.KV_FREE_READS);
    const readCost = (paidReads / 1000000) * CLOUDFLARE_PRICING.KV_PAID_READS_PER_MILLION;

    const paidWrites = Math.max(0, usage.writes - CLOUDFLARE_PRICING.KV_FREE_WRITES);
    const writeCost = (paidWrites / 1000000) * CLOUDFLARE_PRICING.KV_PAID_WRITES_PER_MILLION;

    const storageCost = usage.storageGB * CLOUDFLARE_PRICING.KV_STORAGE_PER_GB;

    return readCost + writeCost + storageCost;
  }

  /**
   * Calculate R2 cost
   */
  private calculateR2Cost(usage: R2Usage): number {
    const storageCost = usage.storageGB * CLOUDFLARE_PRICING.R2_STORAGE_PER_GB;
    const classACost = (usage.classAOps / 1000000) * CLOUDFLARE_PRICING.R2_CLASS_A_OPS_PER_MILLION;
    const classBCost = (usage.classBOps / 1000000) * CLOUDFLARE_PRICING.R2_CLASS_B_OPS_PER_MILLION;

    return storageCost + classACost + classBCost;
  }

  /**
   * Calculate D1 cost
   */
  private calculateD1Cost(usage: D1Usage): number {
    const paidReads = Math.max(0, usage.reads - CLOUDFLARE_PRICING.D1_FREE_READS);
    const readCost = (paidReads / 1000000) * CLOUDFLARE_PRICING.D1_PAID_READS_PER_MILLION;

    const paidWrites = Math.max(0, usage.writes - CLOUDFLARE_PRICING.D1_FREE_WRITES);
    const writeCost = (paidWrites / 1000000) * CLOUDFLARE_PRICING.D1_PAID_WRITES_PER_MILLION;

    const storageCost = usage.storageGB * CLOUDFLARE_PRICING.D1_STORAGE_PER_GB;

    return readCost + writeCost + storageCost;
  }

  /**
   * Calculate Durable Objects cost
   */
  private calculateDOCost(usage: DurableObjectsUsage): number {
    const paidRequests = Math.max(0, usage.requests - CLOUDFLARE_PRICING.DO_FREE_REQUESTS);
    const requestCost = (paidRequests / 1000000) * CLOUDFLARE_PRICING.DO_PAID_REQUESTS_PER_MILLION;

    const durationCost = usage.durationGBHours * CLOUDFLARE_PRICING.DO_DURATION_PER_GB_HOUR;

    return requestCost + durationCost;
  }

  /**
   * Calculate Vectorize cost
   */
  private calculateVectorizeCost(usage: VectorizeUsage): number {
    const queryCost = (usage.queries / 1000000) * CLOUDFLARE_PRICING.VECTORIZE_QUERIES_PER_MILLION;
    const storageCost = (usage.storedVectors / 1000000) * CLOUDFLARE_PRICING.VECTORIZE_STORED_VECTORS_PER_MILLION;

    return queryCost + storageCost;
  }

  /**
   * Calculate AI Gateway cost
   */
  private calculateAIGatewayCost(usage: AIGatewayUsage): number {
    const paidRequests = Math.max(0, usage.requests - CLOUDFLARE_PRICING.AI_GATEWAY_FREE_REQUESTS);
    return paidRequests * CLOUDFLARE_PRICING.AI_GATEWAY_PAID_PER_REQUEST;
  }

  /**
   * Analyze costs and generate optimization recommendations
   */
  analyze(usage: ResourceUsage): CostAnalysis {
    const currentCosts = this.calculateCosts(usage);
    const projectedMonthlyCosts = this.projectMonthlyCosts(currentCosts);
    const costEfficiency = this.calculateCostEfficiency(usage, currentCosts);
    const savingsOpportunities = this.identifySavingsOpportunities(usage, currentCosts);
    const recommendations = this.generateRecommendations(usage, currentCosts);
    const phiOptimalAllocation = this.calculatePhiOptimalAllocation(currentCosts);

    // Store for historical analysis
    this.usageHistory.push(usage);

    return {
      currentCosts,
      projectedMonthlyCosts,
      costEfficiency,
      savingsOpportunities,
      recommendations,
      phiOptimalAllocation,
    };
  }

  /**
   * Project monthly costs from current usage
   */
  private projectMonthlyCosts(currentCosts: CostBreakdown): CostBreakdown {
    // Assume current costs represent a day's worth
    const multiplier = 30; // days in month

    return {
      workers: currentCosts.workers * multiplier,
      kv: currentCosts.kv * multiplier,
      r2: currentCosts.r2 * multiplier,
      d1: currentCosts.d1 * multiplier,
      durableObjects: currentCosts.durableObjects * multiplier,
      vectorize: currentCosts.vectorize * multiplier,
      aiGateway: currentCosts.aiGateway * multiplier,
      total: currentCosts.total * multiplier,
    };
  }

  /**
   * Calculate cost efficiency ratio
   */
  private calculateCostEfficiency(usage: ResourceUsage, costs: CostBreakdown): number {
    // Calculate value delivered per dollar spent
    const totalOperations = 
      usage.workers.requests +
      usage.kv.reads + usage.kv.writes +
      usage.d1.reads + usage.d1.writes +
      usage.durableObjects.requests +
      usage.vectorize.queries +
      usage.aiGateway.requests;

    if (costs.total === 0) return 1.0;

    const operationsPerDollar = totalOperations / costs.total;
    const targetOperationsPerDollar = 10000; // baseline

    return Math.min(1.0, operationsPerDollar / targetOperationsPerDollar);
  }

  /**
   * Identify savings opportunities
   */
  private identifySavingsOpportunities(usage: ResourceUsage, costs: CostBreakdown): SavingsOpportunity[] {
    const opportunities: SavingsOpportunity[] = [];

    // KV caching opportunity
    if (usage.kv.reads > CLOUDFLARE_PRICING.KV_FREE_READS) {
      opportunities.push({
        service: 'KV Storage',
        description: 'Implement edge caching to reduce KV reads',
        currentCost: costs.kv,
        potentialSavings: costs.kv * 0.3,
        implementationEffort: 'low',
        priority: 1,
      });
    }

    // R2 tiered storage opportunity
    if (usage.r2.storageGB > 100) {
      opportunities.push({
        service: 'R2 Storage',
        description: 'Implement lifecycle policies for infrequently accessed data',
        currentCost: costs.r2,
        potentialSavings: costs.r2 * 0.2,
        implementationEffort: 'medium',
        priority: 2,
      });
    }

    // D1 query optimization
    if (usage.d1.reads > CLOUDFLARE_PRICING.D1_FREE_READS * 0.5) {
      opportunities.push({
        service: 'D1 Database',
        description: 'Optimize queries and implement result caching',
        currentCost: costs.d1,
        potentialSavings: costs.d1 * 0.4,
        implementationEffort: 'medium',
        priority: 1,
      });
    }

    // Durable Objects consolidation
    if (usage.durableObjects.requests > CLOUDFLARE_PRICING.DO_FREE_REQUESTS * 0.8) {
      opportunities.push({
        service: 'Durable Objects',
        description: 'Batch operations to reduce request count',
        currentCost: costs.durableObjects,
        potentialSavings: costs.durableObjects * 0.25,
        implementationEffort: 'high',
        priority: 2,
      });
    }

    // AI Gateway optimization
    if (usage.aiGateway.requests > CLOUDFLARE_PRICING.AI_GATEWAY_FREE_REQUESTS) {
      opportunities.push({
        service: 'AI Gateway',
        description: 'Implement response caching for common queries',
        currentCost: costs.aiGateway,
        potentialSavings: costs.aiGateway * 0.5,
        implementationEffort: 'low',
        priority: 1,
      });
    }

    return opportunities.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Generate cost optimization recommendations
   */
  private generateRecommendations(usage: ResourceUsage, costs: CostBreakdown): CostRecommendation[] {
    const recommendations: CostRecommendation[] = [];

    // Always recommend caching
    recommendations.push({
      category: 'caching',
      description: 'Implement multi-tier caching strategy (Edge → KV → D1)',
      expectedSavings: costs.total * 0.25,
      effort: 'medium',
      timeToImplement: '1-2 weeks',
    });

    // Recommend batching for high-volume operations
    if (usage.workers.requests > 500000) {
      recommendations.push({
        category: 'batching',
        description: 'Batch similar operations to reduce request overhead',
        expectedSavings: costs.workers * 0.15,
        effort: 'medium',
        timeToImplement: '1 week',
      });
    }

    // Recommend tiered storage
    if (usage.r2.storageGB > 50 || usage.kv.storageGB > 1) {
      recommendations.push({
        category: 'tiering',
        description: 'Implement hot/warm/cold storage tiers based on access patterns',
        expectedSavings: (costs.r2 + costs.kv) * 0.3,
        effort: 'high',
        timeToImplement: '2-3 weeks',
      });
    }

    // Architecture recommendations
    recommendations.push({
      category: 'architecture',
      description: 'Use φ-harmonic load balancing for optimal resource distribution',
      expectedSavings: costs.total * 0.1,
      effort: 'low',
      timeToImplement: '3-5 days',
    });

    // Scaling recommendations
    recommendations.push({
      category: 'scaling',
      description: 'Implement predictive auto-scaling based on traffic patterns',
      expectedSavings: costs.total * 0.2,
      effort: 'high',
      timeToImplement: '3-4 weeks',
    });

    return recommendations;
  }

  /**
   * Calculate φ-optimal resource allocation
   */
  private calculatePhiOptimalAllocation(costs: CostBreakdown): PhiOptimalAllocation {
    const total = costs.total || 1;

    // Current ratios
    const currentWorkers = costs.workers / total;
    const currentStorage = (costs.kv + costs.r2 + costs.d1) / total;
    const currentCompute = (costs.durableObjects + costs.aiGateway) / total;
    const currentNetwork = costs.vectorize / total;

    // φ-optimal ratios (based on golden ratio distribution)
    const phiWorkers = PHI_INVERSE; // 0.618
    const phiStorage = PHI_INVERSE * PHI_INVERSE; // 0.382
    const phiCompute = 1 - PHI_INVERSE; // 0.382
    const phiNetwork = (1 - PHI_INVERSE) * PHI_INVERSE; // 0.236

    // Calculate coherence (how close to φ-optimal)
    const workersDelta = Math.abs(currentWorkers - phiWorkers);
    const storageDelta = Math.abs(currentStorage - phiStorage);
    const computeDelta = Math.abs(currentCompute - phiCompute);
    const networkDelta = Math.abs(currentNetwork - phiNetwork);

    const totalDelta = workersDelta + storageDelta + computeDelta + networkDelta;
    const totalPhiCoherence = Math.max(0, 1 - totalDelta);

    return {
      workersRatio: phiWorkers,
      storageRatio: phiStorage,
      computeRatio: phiCompute,
      networkRatio: phiNetwork,
      totalPhiCoherence,
    };
  }

  /**
   * Check budget alerts
   */
  checkBudgetAlerts(costs: CostBreakdown): BudgetAlert[] {
    const alerts: BudgetAlert[] = [];

    const checkBudget = (service: string, current: number, limit: number | undefined) => {
      if (!limit) return;

      const percentUsed = (current / limit) * 100;

      if (percentUsed >= 100) {
        alerts.push({
          level: 'critical',
          service,
          message: `Budget exceeded for ${service}`,
          currentSpend: current,
          budgetLimit: limit,
          percentUsed,
        });
      } else if (percentUsed >= 80) {
        alerts.push({
          level: 'warning',
          service,
          message: `${service} at ${percentUsed.toFixed(1)}% of budget`,
          currentSpend: current,
          budgetLimit: limit,
          percentUsed,
        });
      } else if (percentUsed >= 50) {
        alerts.push({
          level: 'info',
          service,
          message: `${service} usage update`,
          currentSpend: current,
          budgetLimit: limit,
          percentUsed,
        });
      }
    };

    checkBudget('Workers', costs.workers, this.budgetLimits.workers);
    checkBudget('KV', costs.kv, this.budgetLimits.kv);
    checkBudget('R2', costs.r2, this.budgetLimits.r2);
    checkBudget('D1', costs.d1, this.budgetLimits.d1);
    checkBudget('Durable Objects', costs.durableObjects, this.budgetLimits.durableObjects);
    checkBudget('Vectorize', costs.vectorize, this.budgetLimits.vectorize);
    checkBudget('AI Gateway', costs.aiGateway, this.budgetLimits.aiGateway);
    checkBudget('Total', costs.total, this.budgetLimits.total);

    return alerts.sort((a, b) => {
      const levelOrder = { critical: 0, warning: 1, info: 2 };
      return levelOrder[a.level] - levelOrder[b.level];
    });
  }

  /**
   * Set budget limits
   */
  setBudgetLimits(limits: Partial<CostBreakdown>): void {
    this.budgetLimits = { ...this.budgetLimits, ...limits };
  }

  /**
   * Generate cost report
   */
  generateReport(analysis: CostAnalysis): string {
    const lines: string[] = [
      '═══════════════════════════════════════════════════════════════════════════',
      '                       COST OPTIMIZATION REPORT                             ',
      '═══════════════════════════════════════════════════════════════════════════',
      '',
      `Optimizer ID: ${this.id}`,
      `Version: ${this.version}`,
      `Timestamp: ${new Date().toISOString()}`,
      '',
      '─── Current Costs ─────────────────────────────────────────────────────────',
      `  Workers:         $${analysis.currentCosts.workers.toFixed(4)}`,
      `  KV Storage:      $${analysis.currentCosts.kv.toFixed(4)}`,
      `  R2 Storage:      $${analysis.currentCosts.r2.toFixed(4)}`,
      `  D1 Database:     $${analysis.currentCosts.d1.toFixed(4)}`,
      `  Durable Objects: $${analysis.currentCosts.durableObjects.toFixed(4)}`,
      `  Vectorize:       $${analysis.currentCosts.vectorize.toFixed(4)}`,
      `  AI Gateway:      $${analysis.currentCosts.aiGateway.toFixed(4)}`,
      `  ────────────────────────────────────────────`,
      `  TOTAL:           $${analysis.currentCosts.total.toFixed(4)}`,
      '',
      '─── Projected Monthly ─────────────────────────────────────────────────────',
      `  TOTAL:           $${analysis.projectedMonthlyCosts.total.toFixed(2)}`,
      '',
      '─── Efficiency ────────────────────────────────────────────────────────────',
      `  Cost Efficiency: ${(analysis.costEfficiency * 100).toFixed(1)}%`,
      `  φ-Coherence:     ${(analysis.phiOptimalAllocation.totalPhiCoherence * 100).toFixed(1)}%`,
      '',
    ];

    if (analysis.savingsOpportunities.length > 0) {
      lines.push('─── Savings Opportunities ─────────────────────────────────────────────────');
      for (const opp of analysis.savingsOpportunities) {
        lines.push(`  [${opp.priority}] ${opp.service}: ${opp.description}`);
        lines.push(`      Potential Savings: $${opp.potentialSavings.toFixed(2)} (${opp.implementationEffort} effort)`);
      }
      lines.push('');
    }

    if (analysis.recommendations.length > 0) {
      lines.push('─── Recommendations ───────────────────────────────────────────────────────');
      for (const rec of analysis.recommendations) {
        lines.push(`  [${rec.category}] ${rec.description}`);
        lines.push(`      Expected Savings: $${rec.expectedSavings.toFixed(2)}, Time: ${rec.timeToImplement}`);
      }
      lines.push('');
    }

    lines.push('═══════════════════════════════════════════════════════════════════════════');
    return lines.join('\n');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION IV: SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════

export const costOptimizer = new CostOptimizer();
export default CostOptimizer;
