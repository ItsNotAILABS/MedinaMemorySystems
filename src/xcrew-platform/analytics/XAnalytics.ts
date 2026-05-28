/**
 * XCREW XAnalytics - Real-Time Edge Observability
 * Protocol: XCREW-ANALYTICS-001
 * 
 * φ-coherent analytics, metrics, and logging for edge compute.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const PROTOCOL_ID = 'XCREW-ANALYTICS-001';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';

export interface XAnalyticsConfig {
  enabled: boolean;
  sampleRate: number;
  logLevel: LogLevel;
  maxEventsPerSecond: number;
  retentionHours: number;
  phiCoherence: boolean;
}

export interface XMetric {
  name: string;
  type: MetricType;
  value: number;
  labels: Record<string, string>;
  timestamp: number;
}

export interface XLogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  workerId?: string;
  requestId?: string;
  data?: Record<string, any>;
  stackTrace?: string;
}

export interface XEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: number;
  workerId?: string;
  requestId?: string;
  sessionId?: string;
}

export interface XSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags: Record<string, string>;
  logs: XSpanLog[];
  status: 'ok' | 'error' | 'cancelled';
}

export interface XSpanLog {
  timestamp: number;
  message: string;
  fields?: Record<string, any>;
}

export interface XRequestMetrics {
  requestCount: number;
  errorCount: number;
  successCount: number;
  totalDurationMs: number;
  avgDurationMs: number;
  p50DurationMs: number;
  p95DurationMs: number;
  p99DurationMs: number;
  bytesIn: number;
  bytesOut: number;
}

export interface XWorkerMetrics {
  workerId: string;
  cpuTimeMs: number;
  wallTimeMs: number;
  memoryUsedMb: number;
  requestsHandled: number;
  coldStarts: number;
  warmStarts: number;
  errors: number;
  phiCoherenceScore: number;
}

export interface XDashboardMetrics {
  timestamp: number;
  requests: XRequestMetrics;
  workers: Map<string, XWorkerMetrics>;
  edgeLocations: Map<string, XEdgeLocationMetrics>;
  phiCoherenceScore: number;
}

export interface XEdgeLocationMetrics {
  locationId: string;
  requestCount: number;
  errorCount: number;
  avgLatencyMs: number;
  bandwidthInMbps: number;
  bandwidthOutMbps: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// PERCENTILE CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════

class PercentileCalculator {
  private values: number[] = [];
  private readonly maxSize: number;
  
  constructor(maxSize: number = 10000) {
    this.maxSize = maxSize;
  }
  
  add(value: number): void {
    this.values.push(value);
    if (this.values.length > this.maxSize) {
      this.values.shift();
    }
  }
  
  getPercentile(p: number): number {
    if (this.values.length === 0) return 0;
    
    const sorted = [...this.values].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }
  
  getAverage(): number {
    if (this.values.length === 0) return 0;
    return this.values.reduce((a, b) => a + b, 0) / this.values.length;
  }
  
  clear(): void {
    this.values = [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// φ-COHERENCE TRACKER
// ═══════════════════════════════════════════════════════════════════════════

class PhiCoherenceTracker {
  private measurements: number[] = [];
  private readonly windowSize: number = 100;
  
  record(value: number): void {
    this.measurements.push(value);
    if (this.measurements.length > this.windowSize) {
      this.measurements.shift();
    }
  }
  
  getScore(): number {
    if (this.measurements.length < 2) return 1.0;
    
    // Calculate how close the distribution follows φ-harmonic pattern
    let coherence = 0;
    for (let i = 1; i < this.measurements.length; i++) {
      const ratio = this.measurements[i] / this.measurements[i - 1];
      const phiDistance = Math.abs(ratio - PHI);
      coherence += Math.exp(-phiDistance);
    }
    
    return coherence / (this.measurements.length - 1);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// XANALYTICS ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export class XAnalyticsEngine {
  private static instance: XAnalyticsEngine | null = null;
  
  private config: XAnalyticsConfig;
  private metrics: Map<string, XMetric[]> = new Map();
  private logs: XLogEntry[] = [];
  private events: XEvent[] = [];
  private spans: Map<string, XSpan> = new Map();
  private requestLatencies: PercentileCalculator;
  private phiTracker: PhiCoherenceTracker;
  private workerMetrics: Map<string, XWorkerMetrics> = new Map();
  private locationMetrics: Map<string, XEdgeLocationMetrics> = new Map();
  private totalRequests = 0;
  private totalErrors = 0;
  private totalBytesIn = 0;
  private totalBytesOut = 0;
  
  private constructor(config?: Partial<XAnalyticsConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      sampleRate: config?.sampleRate ?? 1.0,
      logLevel: config?.logLevel ?? 'info',
      maxEventsPerSecond: config?.maxEventsPerSecond ?? 1000,
      retentionHours: config?.retentionHours ?? 24,
      phiCoherence: config?.phiCoherence ?? true
    };
    
    this.requestLatencies = new PercentileCalculator();
    this.phiTracker = new PhiCoherenceTracker();
    
    // Start cleanup interval
    setInterval(() => this.cleanup(), 60 * 60 * 1000); // Every hour
    
    console.log(`[${PROTOCOL_ID}] XAnalytics Engine initialized`);
  }
  
  static getInstance(config?: Partial<XAnalyticsConfig>): XAnalyticsEngine {
    if (!XAnalyticsEngine.instance) {
      XAnalyticsEngine.instance = new XAnalyticsEngine(config);
    }
    return XAnalyticsEngine.instance;
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // LOGGING
  // ═══════════════════════════════════════════════════════════════════════
  
  log(level: LogLevel, message: string, data?: Record<string, any>): void {
    if (!this.config.enabled) return;
    if (!this.shouldLog(level)) return;
    
    const entry: XLogEntry = {
      level,
      message,
      timestamp: Date.now(),
      data
    };
    
    this.logs.push(entry);
    
    // Console output
    const prefix = `[${PROTOCOL_ID}]`;
    switch (level) {
      case 'debug': console.debug(prefix, message, data || ''); break;
      case 'info': console.info(prefix, message, data || ''); break;
      case 'warn': console.warn(prefix, message, data || ''); break;
      case 'error': console.error(prefix, message, data || ''); break;
    }
  }
  
  debug(message: string, data?: Record<string, any>): void {
    this.log('debug', message, data);
  }
  
  info(message: string, data?: Record<string, any>): void {
    this.log('info', message, data);
  }
  
  warn(message: string, data?: Record<string, any>): void {
    this.log('warn', message, data);
  }
  
  error(message: string, data?: Record<string, any>): void {
    this.log('error', message, data);
  }
  
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const configIndex = levels.indexOf(this.config.logLevel);
    const messageIndex = levels.indexOf(level);
    return messageIndex >= configIndex;
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // METRICS
  // ═══════════════════════════════════════════════════════════════════════
  
  recordMetric(name: string, type: MetricType, value: number, labels?: Record<string, string>): void {
    if (!this.config.enabled) return;
    if (Math.random() > this.config.sampleRate) return;
    
    const metric: XMetric = {
      name,
      type,
      value,
      labels: labels || {},
      timestamp: Date.now()
    };
    
    const metrics = this.metrics.get(name) || [];
    metrics.push(metric);
    this.metrics.set(name, metrics);
    
    // φ-coherence tracking
    if (this.config.phiCoherence) {
      this.phiTracker.record(value);
    }
  }
  
  increment(name: string, value: number = 1, labels?: Record<string, string>): void {
    this.recordMetric(name, 'counter', value, labels);
  }
  
  gauge(name: string, value: number, labels?: Record<string, string>): void {
    this.recordMetric(name, 'gauge', value, labels);
  }
  
  histogram(name: string, value: number, labels?: Record<string, string>): void {
    this.recordMetric(name, 'histogram', value, labels);
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // EVENTS
  // ═══════════════════════════════════════════════════════════════════════
  
  track(name: string, properties?: Record<string, any>): void {
    if (!this.config.enabled) return;
    if (Math.random() > this.config.sampleRate) return;
    
    const event: XEvent = {
      name,
      properties: properties || {},
      timestamp: Date.now()
    };
    
    this.events.push(event);
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // TRACING
  // ═══════════════════════════════════════════════════════════════════════
  
  startSpan(operationName: string, parentSpanId?: string): XSpan {
    const traceId = parentSpanId 
      ? this.spans.get(parentSpanId)?.traceId || this.generateId()
      : this.generateId();
    
    const span: XSpan = {
      traceId,
      spanId: this.generateId(),
      parentSpanId,
      operationName,
      startTime: Date.now(),
      tags: {},
      logs: [],
      status: 'ok'
    };
    
    this.spans.set(span.spanId, span);
    return span;
  }
  
  endSpan(spanId: string, status?: 'ok' | 'error' | 'cancelled'): void {
    const span = this.spans.get(spanId);
    if (span) {
      span.endTime = Date.now();
      span.duration = span.endTime - span.startTime;
      if (status) span.status = status;
    }
  }
  
  addSpanTag(spanId: string, key: string, value: string): void {
    const span = this.spans.get(spanId);
    if (span) {
      span.tags[key] = value;
    }
  }
  
  addSpanLog(spanId: string, message: string, fields?: Record<string, any>): void {
    const span = this.spans.get(spanId);
    if (span) {
      span.logs.push({
        timestamp: Date.now(),
        message,
        fields
      });
    }
  }
  
  private generateId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // REQUEST TRACKING
  // ═══════════════════════════════════════════════════════════════════════
  
  recordRequest(durationMs: number, success: boolean, bytesIn: number = 0, bytesOut: number = 0): void {
    this.totalRequests++;
    if (!success) this.totalErrors++;
    this.totalBytesIn += bytesIn;
    this.totalBytesOut += bytesOut;
    
    this.requestLatencies.add(durationMs);
    this.histogram('request.duration', durationMs);
    this.increment('request.count');
    if (!success) this.increment('request.errors');
    
    if (this.config.phiCoherence) {
      this.phiTracker.record(durationMs);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // WORKER TRACKING
  // ═══════════════════════════════════════════════════════════════════════
  
  recordWorkerMetrics(metrics: Partial<XWorkerMetrics> & { workerId: string }): void {
    const existing = this.workerMetrics.get(metrics.workerId) || {
      workerId: metrics.workerId,
      cpuTimeMs: 0,
      wallTimeMs: 0,
      memoryUsedMb: 0,
      requestsHandled: 0,
      coldStarts: 0,
      warmStarts: 0,
      errors: 0,
      phiCoherenceScore: 1.0
    };
    
    this.workerMetrics.set(metrics.workerId, {
      ...existing,
      ...metrics,
      phiCoherenceScore: this.phiTracker.getScore()
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // EDGE LOCATION TRACKING
  // ═══════════════════════════════════════════════════════════════════════
  
  recordEdgeLocationMetrics(locationId: string, metrics: Partial<XEdgeLocationMetrics>): void {
    const existing = this.locationMetrics.get(locationId) || {
      locationId,
      requestCount: 0,
      errorCount: 0,
      avgLatencyMs: 0,
      bandwidthInMbps: 0,
      bandwidthOutMbps: 0
    };
    
    this.locationMetrics.set(locationId, { ...existing, ...metrics });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // DASHBOARD METRICS
  // ═══════════════════════════════════════════════════════════════════════
  
  getDashboardMetrics(): XDashboardMetrics {
    return {
      timestamp: Date.now(),
      requests: {
        requestCount: this.totalRequests,
        errorCount: this.totalErrors,
        successCount: this.totalRequests - this.totalErrors,
        totalDurationMs: this.requestLatencies.getAverage() * this.totalRequests,
        avgDurationMs: this.requestLatencies.getAverage(),
        p50DurationMs: this.requestLatencies.getPercentile(50),
        p95DurationMs: this.requestLatencies.getPercentile(95),
        p99DurationMs: this.requestLatencies.getPercentile(99),
        bytesIn: this.totalBytesIn,
        bytesOut: this.totalBytesOut
      },
      workers: new Map(this.workerMetrics),
      edgeLocations: new Map(this.locationMetrics),
      phiCoherenceScore: this.phiTracker.getScore()
    };
  }
  
  getRequestMetrics(): XRequestMetrics {
    return {
      requestCount: this.totalRequests,
      errorCount: this.totalErrors,
      successCount: this.totalRequests - this.totalErrors,
      totalDurationMs: this.requestLatencies.getAverage() * this.totalRequests,
      avgDurationMs: this.requestLatencies.getAverage(),
      p50DurationMs: this.requestLatencies.getPercentile(50),
      p95DurationMs: this.requestLatencies.getPercentile(95),
      p99DurationMs: this.requestLatencies.getPercentile(99),
      bytesIn: this.totalBytesIn,
      bytesOut: this.totalBytesOut
    };
  }
  
  getPhiCoherenceScore(): number {
    return this.phiTracker.getScore();
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // DATA ACCESS
  // ═══════════════════════════════════════════════════════════════════════
  
  getLogs(options?: { level?: LogLevel; limit?: number; since?: number }): XLogEntry[] {
    let result = [...this.logs];
    
    if (options?.level) {
      const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
      const minIndex = levels.indexOf(options.level);
      result = result.filter(log => levels.indexOf(log.level) >= minIndex);
    }
    
    if (options?.since) {
      result = result.filter(log => log.timestamp >= options.since!);
    }
    
    if (options?.limit) {
      result = result.slice(-options.limit);
    }
    
    return result;
  }
  
  getEvents(options?: { name?: string; limit?: number; since?: number }): XEvent[] {
    let result = [...this.events];
    
    if (options?.name) {
      result = result.filter(event => event.name === options.name);
    }
    
    if (options?.since) {
      result = result.filter(event => event.timestamp >= options.since!);
    }
    
    if (options?.limit) {
      result = result.slice(-options.limit);
    }
    
    return result;
  }
  
  getMetricValues(name: string, since?: number): XMetric[] {
    const metrics = this.metrics.get(name) || [];
    
    if (since) {
      return metrics.filter(m => m.timestamp >= since);
    }
    
    return [...metrics];
  }
  
  getSpans(traceId?: string): XSpan[] {
    const spans = Array.from(this.spans.values());
    
    if (traceId) {
      return spans.filter(s => s.traceId === traceId);
    }
    
    return spans;
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════
  
  private cleanup(): void {
    const cutoff = Date.now() - this.config.retentionHours * 60 * 60 * 1000;
    
    // Cleanup logs
    this.logs = this.logs.filter(log => log.timestamp > cutoff);
    
    // Cleanup events
    this.events = this.events.filter(event => event.timestamp > cutoff);
    
    // Cleanup metrics
    for (const [name, metrics] of this.metrics) {
      this.metrics.set(name, metrics.filter(m => m.timestamp > cutoff));
    }
    
    // Cleanup spans
    for (const [spanId, span] of this.spans) {
      if (span.startTime < cutoff) {
        this.spans.delete(spanId);
      }
    }
  }
  
  /**
   * Reset all analytics data
   */
  reset(): void {
    this.metrics.clear();
    this.logs = [];
    this.events = [];
    this.spans.clear();
    this.requestLatencies.clear();
    this.workerMetrics.clear();
    this.locationMetrics.clear();
    this.totalRequests = 0;
    this.totalErrors = 0;
    this.totalBytesIn = 0;
    this.totalBytesOut = 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export function getXAnalytics(config?: Partial<XAnalyticsConfig>): XAnalyticsEngine {
  return XAnalyticsEngine.getInstance(config);
}

// Convenience functions
export const log = (level: LogLevel, message: string, data?: Record<string, any>) => 
  getXAnalytics().log(level, message, data);

export const track = (name: string, properties?: Record<string, any>) => 
  getXAnalytics().track(name, properties);

export const increment = (name: string, value?: number, labels?: Record<string, string>) => 
  getXAnalytics().increment(name, value, labels);

export const gauge = (name: string, value: number, labels?: Record<string, string>) => 
  getXAnalytics().gauge(name, value, labels);

export default {
  XAnalyticsEngine,
  getXAnalytics,
  log,
  track,
  increment,
  gauge,
  PROTOCOL_ID
};
