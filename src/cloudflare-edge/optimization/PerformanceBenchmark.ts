/**
 * 𓂀 PERFORMANCE BENCHMARK ENGINE 𓂀
 * Phase 3: Optimization - Performance Benchmarking Infrastructure
 * "Measure twice, optimize once. φ guides all metrics."
 *
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 * Charter: OPT-BENCH-001
 */

import { PHI, PHI_INVERSE, SCHUMANN_RESONANCE_MS } from '../CloudflareWorkersBridge';

// ═══════════════════════════════════════════════════════════════════════════
// SECTION I: CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const BENCHMARK_ID = 'OPT-BENCH-001';
export const BENCHMARK_VERSION = '1.0.0';

// φ-Harmonic performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  // Latency thresholds (ms) - φ-scaled
  EXCELLENT_LATENCY: Math.round(SCHUMANN_RESONANCE_MS / PHI), // ~539ms
  GOOD_LATENCY: SCHUMANN_RESONANCE_MS, // 873ms
  ACCEPTABLE_LATENCY: Math.round(SCHUMANN_RESONANCE_MS * PHI), // ~1412ms
  POOR_LATENCY: Math.round(SCHUMANN_RESONANCE_MS * PHI * PHI), // ~2285ms

  // Throughput thresholds (req/s) - Fibonacci-based
  EXCELLENT_THROUGHPUT: 1000,
  GOOD_THROUGHPUT: 610,
  ACCEPTABLE_THROUGHPUT: 377,
  POOR_THROUGHPUT: 233,

  // Memory thresholds (MB) - φ-scaled
  EXCELLENT_MEMORY: 64,
  GOOD_MEMORY: Math.round(64 * PHI), // ~103MB
  ACCEPTABLE_MEMORY: Math.round(64 * PHI * PHI), // ~167MB
  POOR_MEMORY: 256,

  // φ-Coherence thresholds
  EXCELLENT_COHERENCE: 0.854,
  GOOD_COHERENCE: 0.786,
  ACCEPTABLE_COHERENCE: 0.618,
  POOR_COHERENCE: 0.5,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SECTION II: TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface BenchmarkConfig {
  name: string;
  iterations: number;
  warmupIterations: number;
  concurrency: number;
  timeout: number;
  phiHarmonicMode: boolean;
}

export interface BenchmarkResult {
  id: string;
  name: string;
  timestamp: number;
  duration: number;
  iterations: number;
  metrics: PerformanceMetrics;
  analysis: PerformanceAnalysis;
  phiResonance: number;
}

export interface PerformanceMetrics {
  latency: LatencyMetrics;
  throughput: ThroughputMetrics;
  memory: MemoryMetrics;
  cpu: CpuMetrics;
  network: NetworkMetrics;
  custom: Record<string, number>;
}

export interface LatencyMetrics {
  min: number;
  max: number;
  mean: number;
  median: number;
  p50: number;
  p90: number;
  p95: number;
  p99: number;
  stdDev: number;
}

export interface ThroughputMetrics {
  requestsPerSecond: number;
  bytesPerSecond: number;
  operationsPerSecond: number;
  peakThroughput: number;
}

export interface MemoryMetrics {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  peakMemory: number;
  gcPauses: number;
}

export interface CpuMetrics {
  user: number;
  system: number;
  total: number;
  peakUtilization: number;
}

export interface NetworkMetrics {
  requestsSent: number;
  requestsReceived: number;
  bytesSent: number;
  bytesReceived: number;
  errorRate: number;
  retryRate: number;
}

export interface PerformanceAnalysis {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  bottlenecks: Bottleneck[];
  recommendations: Recommendation[];
  comparisonToBaseline: number;
}

export interface Bottleneck {
  component: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  impact: number;
}

export interface Recommendation {
  priority: number;
  category: 'latency' | 'throughput' | 'memory' | 'cpu' | 'network' | 'architecture';
  description: string;
  expectedImprovement: number;
  effort: 'low' | 'medium' | 'high';
}

export interface BenchmarkSuite {
  id: string;
  name: string;
  benchmarks: BenchmarkResult[];
  aggregateMetrics: PerformanceMetrics;
  overallAnalysis: PerformanceAnalysis;
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION III: PERFORMANCE BENCHMARK ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export class PerformanceBenchmark {
  private readonly id = BENCHMARK_ID;
  private readonly version = BENCHMARK_VERSION;
  private config: BenchmarkConfig;
  private results: BenchmarkResult[] = [];
  private startTime: number = 0;

  constructor(config?: Partial<BenchmarkConfig>) {
    this.config = {
      name: 'default-benchmark',
      iterations: 100,
      warmupIterations: 10,
      concurrency: 1,
      timeout: 30000,
      phiHarmonicMode: true,
      ...config,
    };
  }

  /**
   * Run a benchmark with the given function
   */
  async run<T>(
    name: string,
    fn: () => Promise<T> | T,
    customConfig?: Partial<BenchmarkConfig>
  ): Promise<BenchmarkResult> {
    const config = { ...this.config, ...customConfig, name };
    const samples: number[] = [];
    const memorySamples: MemoryMetrics[] = [];

    // Warmup phase
    for (let i = 0; i < config.warmupIterations; i++) {
      await this.executeWithTimeout(fn, config.timeout);
    }

    this.startTime = Date.now();
    const initialMemory = this.getMemoryMetrics();

    // Main benchmark phase
    for (let i = 0; i < config.iterations; i++) {
      const start = performance.now();
      await this.executeWithTimeout(fn, config.timeout);
      const end = performance.now();
      samples.push(end - start);

      // Sample memory periodically
      if (i % 10 === 0) {
        memorySamples.push(this.getMemoryMetrics());
      }
    }

    const duration = Date.now() - this.startTime;
    const finalMemory = this.getMemoryMetrics();

    const latencyMetrics = this.calculateLatencyMetrics(samples);
    const throughputMetrics = this.calculateThroughputMetrics(samples, duration);
    const memoryMetrics = this.aggregateMemoryMetrics(initialMemory, finalMemory, memorySamples);

    const metrics: PerformanceMetrics = {
      latency: latencyMetrics,
      throughput: throughputMetrics,
      memory: memoryMetrics,
      cpu: this.getCpuMetrics(),
      network: this.getNetworkMetrics(),
      custom: {},
    };

    const analysis = this.analyzePerformance(metrics);
    const phiResonance = this.calculatePhiResonance(metrics);

    const result: BenchmarkResult = {
      id: `${this.id}-${Date.now()}`,
      name,
      timestamp: Date.now(),
      duration,
      iterations: config.iterations,
      metrics,
      analysis,
      phiResonance,
    };

    this.results.push(result);
    return result;
  }

  /**
   * Run a suite of benchmarks
   */
  async runSuite(
    name: string,
    benchmarks: Array<{ name: string; fn: () => Promise<any> | any }>
  ): Promise<BenchmarkSuite> {
    const results: BenchmarkResult[] = [];

    for (const benchmark of benchmarks) {
      const result = await this.run(benchmark.name, benchmark.fn);
      results.push(result);
    }

    const aggregateMetrics = this.aggregateSuiteMetrics(results);
    const overallAnalysis = this.analyzePerformance(aggregateMetrics);

    return {
      id: `suite-${Date.now()}`,
      name,
      benchmarks: results,
      aggregateMetrics,
      overallAnalysis,
      timestamp: Date.now(),
    };
  }

  /**
   * Calculate latency metrics from samples
   */
  private calculateLatencyMetrics(samples: number[]): LatencyMetrics {
    const sorted = [...samples].sort((a, b) => a - b);
    const n = sorted.length;

    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    const squaredDiffs = sorted.map(x => Math.pow(x - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / n;
    const stdDev = Math.sqrt(variance);

    return {
      min: sorted[0],
      max: sorted[n - 1],
      mean,
      median: sorted[Math.floor(n / 2)],
      p50: this.percentile(sorted, 50),
      p90: this.percentile(sorted, 90),
      p95: this.percentile(sorted, 95),
      p99: this.percentile(sorted, 99),
      stdDev,
    };
  }

  /**
   * Calculate throughput metrics
   */
  private calculateThroughputMetrics(samples: number[], totalDuration: number): ThroughputMetrics {
    const requestsPerSecond = (samples.length / totalDuration) * 1000;
    const avgLatency = samples.reduce((a, b) => a + b, 0) / samples.length;
    const operationsPerSecond = 1000 / avgLatency;

    return {
      requestsPerSecond,
      bytesPerSecond: requestsPerSecond * 1024, // Estimated
      operationsPerSecond,
      peakThroughput: Math.max(...samples.map(s => 1000 / s)),
    };
  }

  /**
   * Get memory metrics
   */
  private getMemoryMetrics(): MemoryMetrics {
    // In browser/worker environment, use performance.memory if available
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const mem = (performance as any).memory;
      return {
        heapUsed: mem.usedJSHeapSize,
        heapTotal: mem.totalJSHeapSize,
        external: 0,
        rss: mem.jsHeapSizeLimit,
        peakMemory: mem.usedJSHeapSize,
        gcPauses: 0,
      };
    }

    // Fallback for environments without performance.memory
    return {
      heapUsed: 0,
      heapTotal: 0,
      external: 0,
      rss: 0,
      peakMemory: 0,
      gcPauses: 0,
    };
  }

  /**
   * Aggregate memory metrics from samples
   */
  private aggregateMemoryMetrics(
    initial: MemoryMetrics,
    final: MemoryMetrics,
    samples: MemoryMetrics[]
  ): MemoryMetrics {
    const peakMemory = Math.max(
      initial.heapUsed,
      final.heapUsed,
      ...samples.map(s => s.heapUsed)
    );

    return {
      heapUsed: final.heapUsed,
      heapTotal: final.heapTotal,
      external: final.external,
      rss: final.rss,
      peakMemory,
      gcPauses: samples.reduce((a, s) => a + s.gcPauses, 0),
    };
  }

  /**
   * Get CPU metrics (estimated in worker environment)
   */
  private getCpuMetrics(): CpuMetrics {
    return {
      user: 0,
      system: 0,
      total: 0,
      peakUtilization: 0,
    };
  }

  /**
   * Get network metrics (placeholder)
   */
  private getNetworkMetrics(): NetworkMetrics {
    return {
      requestsSent: 0,
      requestsReceived: 0,
      bytesSent: 0,
      bytesReceived: 0,
      errorRate: 0,
      retryRate: 0,
    };
  }

  /**
   * Analyze performance and generate recommendations
   */
  private analyzePerformance(metrics: PerformanceMetrics): PerformanceAnalysis {
    const bottlenecks: Bottleneck[] = [];
    const recommendations: Recommendation[] = [];

    // Analyze latency
    if (metrics.latency.p95 > PERFORMANCE_THRESHOLDS.POOR_LATENCY) {
      bottlenecks.push({
        component: 'latency',
        severity: 'critical',
        description: `P95 latency (${metrics.latency.p95.toFixed(2)}ms) exceeds threshold`,
        impact: 0.8,
      });
      recommendations.push({
        priority: 1,
        category: 'latency',
        description: 'Implement caching to reduce response times',
        expectedImprovement: 0.4,
        effort: 'medium',
      });
    } else if (metrics.latency.p95 > PERFORMANCE_THRESHOLDS.ACCEPTABLE_LATENCY) {
      bottlenecks.push({
        component: 'latency',
        severity: 'high',
        description: `P95 latency (${metrics.latency.p95.toFixed(2)}ms) needs optimization`,
        impact: 0.5,
      });
    }

    // Analyze throughput
    if (metrics.throughput.requestsPerSecond < PERFORMANCE_THRESHOLDS.POOR_THROUGHPUT) {
      bottlenecks.push({
        component: 'throughput',
        severity: 'critical',
        description: `Throughput (${metrics.throughput.requestsPerSecond.toFixed(2)} req/s) below minimum`,
        impact: 0.9,
      });
      recommendations.push({
        priority: 1,
        category: 'throughput',
        description: 'Increase concurrency and connection pooling',
        expectedImprovement: 0.5,
        effort: 'high',
      });
    }

    // Analyze memory
    const memoryMB = metrics.memory.heapUsed / (1024 * 1024);
    if (memoryMB > PERFORMANCE_THRESHOLDS.POOR_MEMORY) {
      bottlenecks.push({
        component: 'memory',
        severity: 'high',
        description: `Memory usage (${memoryMB.toFixed(2)}MB) exceeds threshold`,
        impact: 0.6,
      });
      recommendations.push({
        priority: 2,
        category: 'memory',
        description: 'Implement memory pooling and reduce allocations',
        expectedImprovement: 0.3,
        effort: 'medium',
      });
    }

    // Calculate overall score
    const score = this.calculatePerformanceScore(metrics, bottlenecks);
    const grade = this.getGrade(score);

    return {
      grade,
      score,
      bottlenecks,
      recommendations: recommendations.sort((a, b) => a.priority - b.priority),
      comparisonToBaseline: 1.0,
    };
  }

  /**
   * Calculate overall performance score
   */
  private calculatePerformanceScore(metrics: PerformanceMetrics, bottlenecks: Bottleneck[]): number {
    let score = 100;

    // Latency impact
    const latencyScore = this.normalizeLatency(metrics.latency.p95);
    score -= (1 - latencyScore) * 30;

    // Throughput impact
    const throughputScore = this.normalizeThroughput(metrics.throughput.requestsPerSecond);
    score -= (1 - throughputScore) * 30;

    // Memory impact
    const memoryScore = this.normalizeMemory(metrics.memory.heapUsed);
    score -= (1 - memoryScore) * 20;

    // Bottleneck impact
    for (const bottleneck of bottlenecks) {
      score -= bottleneck.impact * 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Normalize latency to 0-1 scale
   */
  private normalizeLatency(latency: number): number {
    if (latency <= PERFORMANCE_THRESHOLDS.EXCELLENT_LATENCY) return 1;
    if (latency <= PERFORMANCE_THRESHOLDS.GOOD_LATENCY) return 0.8;
    if (latency <= PERFORMANCE_THRESHOLDS.ACCEPTABLE_LATENCY) return 0.6;
    if (latency <= PERFORMANCE_THRESHOLDS.POOR_LATENCY) return 0.4;
    return 0.2;
  }

  /**
   * Normalize throughput to 0-1 scale
   */
  private normalizeThroughput(throughput: number): number {
    if (throughput >= PERFORMANCE_THRESHOLDS.EXCELLENT_THROUGHPUT) return 1;
    if (throughput >= PERFORMANCE_THRESHOLDS.GOOD_THROUGHPUT) return 0.8;
    if (throughput >= PERFORMANCE_THRESHOLDS.ACCEPTABLE_THROUGHPUT) return 0.6;
    if (throughput >= PERFORMANCE_THRESHOLDS.POOR_THROUGHPUT) return 0.4;
    return 0.2;
  }

  /**
   * Normalize memory to 0-1 scale
   */
  private normalizeMemory(heapUsed: number): number {
    const memoryMB = heapUsed / (1024 * 1024);
    if (memoryMB <= PERFORMANCE_THRESHOLDS.EXCELLENT_MEMORY) return 1;
    if (memoryMB <= PERFORMANCE_THRESHOLDS.GOOD_MEMORY) return 0.8;
    if (memoryMB <= PERFORMANCE_THRESHOLDS.ACCEPTABLE_MEMORY) return 0.6;
    if (memoryMB <= PERFORMANCE_THRESHOLDS.POOR_MEMORY) return 0.4;
    return 0.2;
  }

  /**
   * Get grade from score
   */
  private getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Calculate φ-resonance based on metrics
   */
  private calculatePhiResonance(metrics: PerformanceMetrics): number {
    const latencyRatio = PERFORMANCE_THRESHOLDS.EXCELLENT_LATENCY / Math.max(metrics.latency.p50, 1);
    const throughputRatio = metrics.throughput.requestsPerSecond / PERFORMANCE_THRESHOLDS.EXCELLENT_THROUGHPUT;

    // φ-weighted combination
    const resonance = (latencyRatio * PHI_INVERSE + throughputRatio * PHI_INVERSE * PHI_INVERSE) / 2;
    return Math.min(1, Math.max(0, resonance));
  }

  /**
   * Calculate percentile
   */
  private percentile(sorted: number[], p: number): number {
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Execute function with timeout
   */
  private async executeWithTimeout<T>(fn: () => Promise<T> | T, timeout: number): Promise<T> {
    return Promise.race([
      Promise.resolve(fn()),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Benchmark timeout')), timeout)
      ),
    ]);
  }

  /**
   * Aggregate suite metrics
   */
  private aggregateSuiteMetrics(results: BenchmarkResult[]): PerformanceMetrics {
    const latencies = results.map(r => r.metrics.latency);
    const throughputs = results.map(r => r.metrics.throughput);
    const memories = results.map(r => r.metrics.memory);

    return {
      latency: {
        min: Math.min(...latencies.map(l => l.min)),
        max: Math.max(...latencies.map(l => l.max)),
        mean: latencies.reduce((a, l) => a + l.mean, 0) / latencies.length,
        median: latencies.reduce((a, l) => a + l.median, 0) / latencies.length,
        p50: latencies.reduce((a, l) => a + l.p50, 0) / latencies.length,
        p90: latencies.reduce((a, l) => a + l.p90, 0) / latencies.length,
        p95: latencies.reduce((a, l) => a + l.p95, 0) / latencies.length,
        p99: latencies.reduce((a, l) => a + l.p99, 0) / latencies.length,
        stdDev: latencies.reduce((a, l) => a + l.stdDev, 0) / latencies.length,
      },
      throughput: {
        requestsPerSecond: throughputs.reduce((a, t) => a + t.requestsPerSecond, 0) / throughputs.length,
        bytesPerSecond: throughputs.reduce((a, t) => a + t.bytesPerSecond, 0) / throughputs.length,
        operationsPerSecond: throughputs.reduce((a, t) => a + t.operationsPerSecond, 0) / throughputs.length,
        peakThroughput: Math.max(...throughputs.map(t => t.peakThroughput)),
      },
      memory: {
        heapUsed: Math.max(...memories.map(m => m.heapUsed)),
        heapTotal: Math.max(...memories.map(m => m.heapTotal)),
        external: memories.reduce((a, m) => a + m.external, 0),
        rss: Math.max(...memories.map(m => m.rss)),
        peakMemory: Math.max(...memories.map(m => m.peakMemory)),
        gcPauses: memories.reduce((a, m) => a + m.gcPauses, 0),
      },
      cpu: this.getCpuMetrics(),
      network: this.getNetworkMetrics(),
      custom: {},
    };
  }

  /**
   * Get all results
   */
  getResults(): BenchmarkResult[] {
    return [...this.results];
  }

  /**
   * Clear results
   */
  clearResults(): void {
    this.results = [];
  }

  /**
   * Generate benchmark report
   */
  generateReport(): string {
    const lines: string[] = [
      '═══════════════════════════════════════════════════════════════════════════',
      '                    PERFORMANCE BENCHMARK REPORT                           ',
      '═══════════════════════════════════════════════════════════════════════════',
      '',
      `Benchmark ID: ${this.id}`,
      `Version: ${this.version}`,
      `Timestamp: ${new Date().toISOString()}`,
      `Total Benchmarks: ${this.results.length}`,
      '',
    ];

    for (const result of this.results) {
      lines.push(`─── ${result.name} ${'─'.repeat(60 - result.name.length)}`);
      lines.push(`  Grade: ${result.analysis.grade} (Score: ${result.analysis.score.toFixed(1)})`);
      lines.push(`  Latency: p50=${result.metrics.latency.p50.toFixed(2)}ms, p95=${result.metrics.latency.p95.toFixed(2)}ms, p99=${result.metrics.latency.p99.toFixed(2)}ms`);
      lines.push(`  Throughput: ${result.metrics.throughput.requestsPerSecond.toFixed(2)} req/s`);
      lines.push(`  φ-Resonance: ${result.phiResonance.toFixed(4)}`);
      
      if (result.analysis.bottlenecks.length > 0) {
        lines.push(`  Bottlenecks:`);
        for (const b of result.analysis.bottlenecks) {
          lines.push(`    - [${b.severity}] ${b.component}: ${b.description}`);
        }
      }
      
      if (result.analysis.recommendations.length > 0) {
        lines.push(`  Recommendations:`);
        for (const r of result.analysis.recommendations) {
          lines.push(`    ${r.priority}. [${r.category}] ${r.description}`);
        }
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

export const performanceBenchmark = new PerformanceBenchmark();
export default PerformanceBenchmark;
