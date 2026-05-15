/**
 * 𓂀 PHASE 3 OPTIMIZATION TESTS 𓂀
 * Test suite for Performance, Cost, and Hardening modules
 *
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 */

import {
  PerformanceBenchmark,
  BENCHMARK_ID,
  BENCHMARK_VERSION,
  PERFORMANCE_THRESHOLDS,
} from '../cloudflare-edge/optimization/PerformanceBenchmark';

import {
  CostOptimizer,
  COST_OPTIMIZER_ID,
  CLOUDFLARE_PRICING,
  ResourceUsage,
} from '../cloudflare-edge/optimization/CostOptimizer';

import {
  ProductionHardening,
  HARDENING_ID,
  SECURITY_LEVELS,
  BUILT_IN_CHECKS,
} from '../cloudflare-edge/optimization/ProductionHardening';

import {
  OptimizationController,
  optimizationController,
} from '../cloudflare-edge/optimization';

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE BENCHMARK TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('PerformanceBenchmark', () => {
  let benchmark: PerformanceBenchmark;

  beforeEach(() => {
    benchmark = new PerformanceBenchmark({
      iterations: 10,
      warmupIterations: 2,
    });
  });

  it('should have correct ID and version', () => {
    expect(BENCHMARK_ID).toBe('OPT-BENCH-001');
    expect(BENCHMARK_VERSION).toBe('1.0.0');
  });

  it('should have φ-scaled performance thresholds', () => {
    expect(PERFORMANCE_THRESHOLDS.EXCELLENT_LATENCY).toBeLessThan(PERFORMANCE_THRESHOLDS.GOOD_LATENCY);
    expect(PERFORMANCE_THRESHOLDS.GOOD_LATENCY).toBeLessThan(PERFORMANCE_THRESHOLDS.ACCEPTABLE_LATENCY);
    expect(PERFORMANCE_THRESHOLDS.ACCEPTABLE_LATENCY).toBeLessThan(PERFORMANCE_THRESHOLDS.POOR_LATENCY);
    
    // Throughput should be in descending order (higher is better)
    expect(PERFORMANCE_THRESHOLDS.EXCELLENT_THROUGHPUT).toBeGreaterThan(PERFORMANCE_THRESHOLDS.GOOD_THROUGHPUT);
    expect(PERFORMANCE_THRESHOLDS.GOOD_THROUGHPUT).toBeGreaterThan(PERFORMANCE_THRESHOLDS.ACCEPTABLE_THROUGHPUT);
  });

  it('should run a simple benchmark', async () => {
    const result = await benchmark.run('simple-test', () => {
      let sum = 0;
      for (let i = 0; i < 1000; i++) {
        sum += i;
      }
      return sum;
    });

    expect(result.name).toBe('simple-test');
    expect(result.iterations).toBe(10);
    expect(result.metrics.latency.min).toBeGreaterThanOrEqual(0);
    expect(result.metrics.latency.max).toBeGreaterThanOrEqual(result.metrics.latency.min);
    expect(result.metrics.latency.mean).toBeGreaterThan(0);
    expect(result.analysis.grade).toMatch(/^[ABCDF]$/);
    expect(result.analysis.score).toBeGreaterThanOrEqual(0);
    expect(result.analysis.score).toBeLessThanOrEqual(100);
    expect(result.phiResonance).toBeGreaterThanOrEqual(0);
    expect(result.phiResonance).toBeLessThanOrEqual(1);
  });

  it('should run async benchmarks', async () => {
    const result = await benchmark.run('async-test', async () => {
      await new Promise(resolve => setTimeout(resolve, 1));
      return 'done';
    });

    expect(result.name).toBe('async-test');
    expect(result.metrics.latency.min).toBeGreaterThan(0);
  });

  it('should calculate percentiles correctly', async () => {
    const result = await benchmark.run('percentile-test', () => Math.random());

    expect(result.metrics.latency.p50).toBeLessThanOrEqual(result.metrics.latency.p90);
    expect(result.metrics.latency.p90).toBeLessThanOrEqual(result.metrics.latency.p95);
    expect(result.metrics.latency.p95).toBeLessThanOrEqual(result.metrics.latency.p99);
  });

  it('should store results and allow retrieval', async () => {
    await benchmark.run('stored-test', () => 1);
    
    const results = benchmark.getResults();
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('stored-test');
  });

  it('should generate a report', async () => {
    await benchmark.run('report-test', () => 1);
    
    const report = benchmark.generateReport();
    expect(report).toContain('PERFORMANCE BENCHMARK REPORT');
    expect(report).toContain('report-test');
  });

  it('should clear results', async () => {
    await benchmark.run('clear-test', () => 1);
    benchmark.clearResults();
    
    expect(benchmark.getResults().length).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// COST OPTIMIZER TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('CostOptimizer', () => {
  let optimizer: CostOptimizer;
  const sampleUsage: ResourceUsage = {
    workers: {
      requests: 150000,
      cpuTimeMs: 50000,
      errors: 10,
    },
    kv: {
      reads: 200000,
      writes: 5000,
      storageGB: 0.5,
    },
    r2: {
      storageGB: 10,
      classAOps: 10000,
      classBOps: 50000,
      egressGB: 1,
    },
    d1: {
      reads: 1000000,
      writes: 50000,
      storageGB: 0.1,
    },
    durableObjects: {
      requests: 500000,
      durationGBHours: 10,
      websocketMessages: 10000,
    },
    vectorize: {
      queries: 100000,
      storedVectors: 50000,
    },
    aiGateway: {
      requests: 15000,
      tokensProcessed: 1000000,
    },
  };

  beforeEach(() => {
    optimizer = new CostOptimizer();
  });

  it('should have correct ID', () => {
    expect(COST_OPTIMIZER_ID).toBe('OPT-COST-001');
  });

  it('should have Cloudflare pricing constants', () => {
    expect(CLOUDFLARE_PRICING.WORKERS_FREE_REQUESTS).toBe(100000);
    expect(CLOUDFLARE_PRICING.WORKERS_PAID_REQUESTS_PER_MILLION).toBe(0.50);
    expect(CLOUDFLARE_PRICING.KV_FREE_READS).toBe(100000);
    expect(CLOUDFLARE_PRICING.R2_STORAGE_PER_GB).toBe(0.015);
  });

  it('should calculate costs from usage', () => {
    const costs = optimizer.calculateCosts(sampleUsage);

    expect(costs.workers).toBeGreaterThanOrEqual(0);
    expect(costs.kv).toBeGreaterThanOrEqual(0);
    expect(costs.r2).toBeGreaterThanOrEqual(0);
    expect(costs.d1).toBeGreaterThanOrEqual(0);
    expect(costs.durableObjects).toBeGreaterThanOrEqual(0);
    expect(costs.vectorize).toBeGreaterThanOrEqual(0);
    expect(costs.aiGateway).toBeGreaterThanOrEqual(0);
    expect(costs.total).toBe(
      costs.workers + costs.kv + costs.r2 + costs.d1 +
      costs.durableObjects + costs.vectorize + costs.aiGateway
    );
  });

  it('should analyze costs and generate recommendations', () => {
    const analysis = optimizer.analyze(sampleUsage);

    expect(analysis.currentCosts.total).toBeGreaterThanOrEqual(0);
    expect(analysis.projectedMonthlyCosts.total).toBeGreaterThan(0);
    expect(analysis.costEfficiency).toBeGreaterThanOrEqual(0);
    expect(analysis.costEfficiency).toBeLessThanOrEqual(1);
    expect(analysis.savingsOpportunities).toBeDefined();
    expect(analysis.recommendations).toBeDefined();
    expect(analysis.phiOptimalAllocation).toBeDefined();
    expect(analysis.phiOptimalAllocation.totalPhiCoherence).toBeGreaterThanOrEqual(0);
    expect(analysis.phiOptimalAllocation.totalPhiCoherence).toBeLessThanOrEqual(1);
  });

  it('should check budget alerts', () => {
    optimizer.setBudgetLimits({ total: 0.01 }); // Very low limit
    const costs = optimizer.calculateCosts(sampleUsage);
    const alerts = optimizer.checkBudgetAlerts(costs);

    // Should have at least one alert with a $0.01 budget
    expect(alerts.length).toBeGreaterThan(0);
    expect(['critical', 'warning', 'info']).toContain(alerts[0].level);
  });

  it('should generate cost report', () => {
    const analysis = optimizer.analyze(sampleUsage);
    const report = optimizer.generateReport(analysis);

    expect(report).toContain('COST OPTIMIZATION REPORT');
    expect(report).toContain('Workers:');
    expect(report).toContain('TOTAL:');
    expect(report).toContain('Projected Monthly');
  });

  it('should calculate φ-optimal allocation', () => {
    const analysis = optimizer.analyze(sampleUsage);

    expect(analysis.phiOptimalAllocation.workersRatio).toBeCloseTo(0.618, 2);
    expect(analysis.phiOptimalAllocation.storageRatio).toBeCloseTo(0.382, 2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTION HARDENING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ProductionHardening', () => {
  let hardening: ProductionHardening;

  beforeEach(() => {
    hardening = new ProductionHardening();
  });

  it('should have correct ID', () => {
    expect(HARDENING_ID).toBe('OPT-HARD-001');
  });

  it('should have security levels defined', () => {
    expect(SECURITY_LEVELS.MAXIMUM).toBe('maximum');
    expect(SECURITY_LEVELS.HIGH).toBe('high');
    expect(SECURITY_LEVELS.STANDARD).toBe('standard');
    expect(SECURITY_LEVELS.DEVELOPMENT).toBe('development');
  });

  it('should have built-in checks covering all categories', () => {
    const categories = new Set(BUILT_IN_CHECKS.map(c => c.category));
    
    expect(categories.has('security')).toBe(true);
    expect(categories.has('reliability')).toBe(true);
    expect(categories.has('scalability')).toBe(true);
    expect(categories.has('observability')).toBe(true);
    expect(categories.has('compliance')).toBe(true);
  });

  it('should have critical security checks', () => {
    const criticalSecurityChecks = BUILT_IN_CHECKS.filter(
      c => c.category === 'security' && c.severity === 'critical'
    );
    
    expect(criticalSecurityChecks.length).toBeGreaterThan(0);
    expect(criticalSecurityChecks.some(c => c.name.includes('HTTPS'))).toBe(true);
    expect(criticalSecurityChecks.some(c => c.name.includes('Input Validation'))).toBe(true);
  });

  it('should run all checks and generate report', async () => {
    const report = await hardening.runChecks();

    expect(report.id).toContain(HARDENING_ID);
    expect(report.timestamp).toBeGreaterThan(0);
    expect(report.overallScore).toBeGreaterThanOrEqual(0);
    expect(report.overallScore).toBeLessThanOrEqual(100);
    expect(report.overallGrade).toMatch(/^[ABCDF]$/);
    expect(report.categories.length).toBe(5);
    expect(report.checks.length).toBe(BUILT_IN_CHECKS.length);
    expect(report.phiResilience).toBeGreaterThanOrEqual(0);
    expect(report.phiResilience).toBeLessThanOrEqual(1);
  });

  it('should add custom checks', async () => {
    hardening.addCheck({
      id: 'CUSTOM-001',
      name: 'Custom Check',
      category: 'security',
      severity: 'low',
      description: 'A custom test check',
      checker: () => ({ passed: true, score: 100, details: 'Custom check passed' }),
    });

    const report = await hardening.runChecks();
    const customCheck = report.checks.find(c => c.check.id === 'CUSTOM-001');
    
    expect(customCheck).toBeDefined();
    expect(customCheck?.result.passed).toBe(true);
  });

  it('should remove checks by ID', () => {
    const initialCount = BUILT_IN_CHECKS.length;
    const removed = hardening.removeCheck('SEC-001');
    
    expect(removed).toBe(true);
    
    // Removing non-existent check should return false
    const removedAgain = hardening.removeCheck('NON-EXISTENT');
    expect(removedAgain).toBe(false);
  });

  it('should generate text report', async () => {
    const report = await hardening.runChecks();
    const text = hardening.generateReportText(report);

    expect(text).toContain('PRODUCTION HARDENING REPORT');
    expect(text).toContain('Grade:');
    expect(text).toContain('φ-Resilience:');
    expect(text).toContain('SECURITY');
    expect(text).toContain('RELIABILITY');
  });

  it('should identify critical issues when checks fail', async () => {
    hardening.addCheck({
      id: 'FAIL-001',
      name: 'Failing Check',
      category: 'security',
      severity: 'critical',
      description: 'A check that fails',
      checker: () => ({ passed: false, score: 0, details: 'This check failed' }),
    });

    const report = await hardening.runChecks();
    const issue = report.criticalIssues.find(i => i.checkId === 'FAIL-001');
    
    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('critical');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// OPTIMIZATION CONTROLLER TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('OptimizationController', () => {
  let controller: OptimizationController;

  beforeEach(() => {
    controller = new OptimizationController();
  });

  it('should return correct status', () => {
    const status = controller.getStatus();

    expect(status.phase).toBe('Phase 3');
    expect(status.version).toBe('1.0.0');
    expect(status.components.performanceBenchmark).toBe(true);
    expect(status.components.costOptimizer).toBe(true);
    expect(status.components.productionHardening).toBe(true);
    expect(status.phiCoherence).toBeCloseTo(0.854, 2);
  });

  it('should provide access to component instances', () => {
    expect(controller.getBenchmark()).toBeInstanceOf(PerformanceBenchmark);
    expect(controller.getCostOptimizer()).toBeInstanceOf(CostOptimizer);
    expect(controller.getHardening()).toBeInstanceOf(ProductionHardening);
  });

  it('should run full optimization analysis', async () => {
    const usage: ResourceUsage = {
      workers: { requests: 100000, cpuTimeMs: 10000, errors: 0 },
      kv: { reads: 50000, writes: 1000, storageGB: 0.1 },
      r2: { storageGB: 1, classAOps: 1000, classBOps: 5000, egressGB: 0.1 },
      d1: { reads: 100000, writes: 10000, storageGB: 0.05 },
      durableObjects: { requests: 50000, durationGBHours: 1, websocketMessages: 1000 },
      vectorize: { queries: 10000, storedVectors: 5000 },
      aiGateway: { requests: 5000, tokensProcessed: 100000 },
    };

    const report = await controller.runFullAnalysis(usage);

    expect(report.timestamp).toBeGreaterThan(0);
    expect(report.performanceGrade).toMatch(/^[ABCDF]$/);
    expect(report.performanceScore).toBeGreaterThanOrEqual(0);
    expect(report.costEfficiency).toBeGreaterThanOrEqual(0);
    expect(report.costEfficiency).toBeLessThanOrEqual(1);
    expect(report.projectedMonthlyCost).toBeGreaterThanOrEqual(0);
    expect(report.hardeningGrade).toMatch(/^[ABCDF]$/);
    expect(report.hardeningScore).toBeGreaterThanOrEqual(0);
    expect(report.overallPhiResonance).toBeGreaterThanOrEqual(0);
    expect(report.overallPhiResonance).toBeLessThanOrEqual(1);
    expect(report.summary).toContain('PHASE 3 OPTIMIZATION SUMMARY');
  });

  it('should use singleton instance', () => {
    expect(optimizationController).toBeInstanceOf(OptimizationController);
    expect(optimizationController.getStatus().phase).toBe('Phase 3');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// INTEGRATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Phase 3 Integration', () => {
  it('should have all modules properly exported', () => {
    const exports = require('../cloudflare-edge/optimization');
    
    // Performance Benchmark exports
    expect(exports.PerformanceBenchmark).toBeDefined();
    expect(exports.performanceBenchmark).toBeDefined();
    expect(exports.BENCHMARK_ID).toBe('OPT-BENCH-001');
    
    // Cost Optimizer exports
    expect(exports.CostOptimizer).toBeDefined();
    expect(exports.costOptimizer).toBeDefined();
    expect(exports.COST_OPTIMIZER_ID).toBe('OPT-COST-001');
    
    // Production Hardening exports
    expect(exports.ProductionHardening).toBeDefined();
    expect(exports.productionHardening).toBeDefined();
    expect(exports.HARDENING_ID).toBe('OPT-HARD-001');
    
    // Controller exports
    expect(exports.OptimizationController).toBeDefined();
    expect(exports.optimizationController).toBeDefined();
  });

  it('should maintain φ-coherence across all modules', async () => {
    const benchmark = new PerformanceBenchmark();
    const costOptimizer = new CostOptimizer();
    const hardening = new ProductionHardening();

    // Run all analyses
    const benchResult = await benchmark.run('phi-test', () => 1, { iterations: 5, warmupIterations: 1 });
    const costResult = costOptimizer.analyze({
      workers: { requests: 100000, cpuTimeMs: 1000, errors: 0 },
      kv: { reads: 50000, writes: 500, storageGB: 0.1 },
      r2: { storageGB: 1, classAOps: 100, classBOps: 500, egressGB: 0 },
      d1: { reads: 100000, writes: 1000, storageGB: 0.05 },
      durableObjects: { requests: 10000, durationGBHours: 0.1, websocketMessages: 100 },
      vectorize: { queries: 1000, storedVectors: 500 },
      aiGateway: { requests: 1000, tokensProcessed: 10000 },
    });
    const hardResult = await hardening.runChecks();

    // All should have φ-coherence metrics
    expect(benchResult.phiResonance).toBeGreaterThanOrEqual(0);
    expect(costResult.phiOptimalAllocation.totalPhiCoherence).toBeGreaterThanOrEqual(0);
    expect(hardResult.phiResilience).toBeGreaterThanOrEqual(0);
  });
});
