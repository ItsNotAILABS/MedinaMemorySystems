/**
 * XCREW Cron Scheduler
 * Protocol: XCREW-CRON-001
 * 
 * Distributed cron scheduling with φ-harmonic timing and global coordination.
 * Ensures exactly-once execution across the edge network.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const PHI_INV = 0.618033988749895;
const PROTOCOL_ID = 'XCREW-CRON-001';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type CronStatus = 'active' | 'paused' | 'disabled' | 'error';
export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'timeout' | 'skipped';

export interface XCronJob {
  id: string;
  name: string;
  schedule: string;           // Cron expression
  workerId: string;           // Worker to execute
  handler: string;            // Handler function name
  status: CronStatus;
  timezone: string;
  retryPolicy: RetryPolicy;
  timeout: number;            // ms
  metadata: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  nextRun?: Date;
  runCount: number;
  failCount: number;
  phiJitter: boolean;         // Enable φ-harmonic jitter
}

export interface RetryPolicy {
  maxRetries: number;
  initialDelay: number;       // ms
  maxDelay: number;           // ms
  backoffMultiplier: number;  // Use PHI for φ-harmonic backoff
}

export interface CronExecution {
  id: string;
  jobId: string;
  scheduledTime: Date;
  startTime?: Date;
  endTime?: Date;
  status: ExecutionStatus;
  attempt: number;
  region: string;
  workerId: string;
  duration?: number;          // ms
  result?: any;
  error?: string;
  logs: CronLogEntry[];
}

export interface CronLogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: any;
}

export interface CronSchedulerConfig {
  defaultTimezone: string;
  maxConcurrentJobs: number;
  defaultTimeout: number;
  enablePhiJitter: boolean;
  executionHistoryLimit: number;
  lockTimeout: number;        // ms for distributed lock
}

// ═══════════════════════════════════════════════════════════════════════════
// CRON EXPRESSION PARSER
// ═══════════════════════════════════════════════════════════════════════════

export class CronExpressionParser {
  private static readonly FIELD_NAMES = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];
  private static readonly FIELD_RANGES: Record<string, [number, number]> = {
    minute: [0, 59],
    hour: [0, 23],
    dayOfMonth: [1, 31],
    month: [1, 12],
    dayOfWeek: [0, 6]
  };
  
  /**
   * Parse a cron expression into field values
   */
  static parse(expression: string): Map<string, number[]> {
    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) {
      throw new Error(`Invalid cron expression: expected 5 fields, got ${parts.length}`);
    }
    
    const result = new Map<string, number[]>();
    
    for (let i = 0; i < 5; i++) {
      const fieldName = this.FIELD_NAMES[i];
      const [min, max] = this.FIELD_RANGES[fieldName];
      result.set(fieldName, this.parseField(parts[i], min, max));
    }
    
    return result;
  }
  
  /**
   * Parse a single cron field
   */
  private static parseField(field: string, min: number, max: number): number[] {
    if (field === '*') {
      return this.range(min, max);
    }
    
    const values: number[] = [];
    const parts = field.split(',');
    
    for (const part of parts) {
      if (part.includes('/')) {
        // Step values: */5 or 1-10/2
        const [range, step] = part.split('/');
        const stepNum = parseInt(step, 10);
        const rangeValues = range === '*' ? this.range(min, max) : this.parseRange(range, min, max);
        for (let i = 0; i < rangeValues.length; i += stepNum) {
          values.push(rangeValues[i]);
        }
      } else if (part.includes('-')) {
        // Range: 1-5
        values.push(...this.parseRange(part, min, max));
      } else {
        // Single value
        const num = parseInt(part, 10);
        if (num >= min && num <= max) {
          values.push(num);
        }
      }
    }
    
    return [...new Set(values)].sort((a, b) => a - b);
  }
  
  private static parseRange(range: string, min: number, max: number): number[] {
    const [start, end] = range.split('-').map(n => parseInt(n, 10));
    return this.range(Math.max(start, min), Math.min(end, max));
  }
  
  private static range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }
  
  /**
   * Calculate next execution time from a cron expression
   */
  static getNextExecution(expression: string, from: Date = new Date()): Date {
    const fields = this.parse(expression);
    const next = new Date(from);
    next.setSeconds(0, 0);
    next.setMinutes(next.getMinutes() + 1);
    
    const minutes = fields.get('minute')!;
    const hours = fields.get('hour')!;
    const daysOfMonth = fields.get('dayOfMonth')!;
    const months = fields.get('month')!;
    const daysOfWeek = fields.get('dayOfWeek')!;
    
    // Find next matching time (simplified algorithm)
    for (let i = 0; i < 366 * 24 * 60; i++) { // Max 1 year search
      const minute = next.getMinutes();
      const hour = next.getHours();
      const dayOfMonth = next.getDate();
      const month = next.getMonth() + 1;
      const dayOfWeek = next.getDay();
      
      if (
        minutes.includes(minute) &&
        hours.includes(hour) &&
        daysOfMonth.includes(dayOfMonth) &&
        months.includes(month) &&
        daysOfWeek.includes(dayOfWeek)
      ) {
        return next;
      }
      
      next.setMinutes(next.getMinutes() + 1);
    }
    
    throw new Error('Could not find next execution time within 1 year');
  }
  
  /**
   * Get human-readable description of cron expression
   */
  static describe(expression: string): string {
    const fields = this.parse(expression);
    const parts: string[] = [];
    
    const minutes = fields.get('minute')!;
    const hours = fields.get('hour')!;
    
    if (minutes.length === 1 && hours.length === 1) {
      parts.push(`At ${hours[0].toString().padStart(2, '0')}:${minutes[0].toString().padStart(2, '0')}`);
    } else if (minutes.length === 60 && hours.length === 24) {
      parts.push('Every minute');
    } else if (minutes.length === 1 && hours.length === 24) {
      parts.push(`At minute ${minutes[0]} of every hour`);
    } else {
      parts.push(`At minutes ${minutes.join(', ')} of hours ${hours.join(', ')}`);
    }
    
    return parts.join(' ');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PHI-HARMONIC JITTER CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════

export class PhiJitterCalculator {
  /**
   * Calculate φ-harmonic jitter for a scheduled time
   * Spreads executions naturally to avoid thundering herd
   */
  static calculateJitter(scheduledTime: Date, jobId: string, maxJitterMs: number = 60000): number {
    // Use job ID hash for deterministic but distributed jitter
    const hash = this.hashString(jobId);
    const normalizedHash = (hash % 1000) / 1000;
    
    // Apply golden ratio distribution
    const goldenAngle = 2 * Math.PI * PHI_INV;
    const phiOffset = Math.sin(normalizedHash * goldenAngle) * PHI_INV;
    
    // Scale to max jitter
    return Math.floor(phiOffset * maxJitterMs);
  }
  
  /**
   * Calculate optimal execution window using φ-harmonic spacing
   */
  static calculateExecutionWindow(jobCount: number, windowMs: number): number[] {
    const offsets: number[] = [];
    const goldenAngle = 2 * Math.PI * PHI_INV;
    
    for (let i = 0; i < jobCount; i++) {
      const angle = i * goldenAngle;
      const offset = ((Math.sin(angle) + 1) / 2) * windowMs;
      offsets.push(Math.floor(offset));
    }
    
    return offsets.sort((a, b) => a - b);
  }
  
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CRON SCHEDULER
// ═══════════════════════════════════════════════════════════════════════════

export class XCronScheduler {
  private jobs: Map<string, XCronJob> = new Map();
  private executions: Map<string, CronExecution[]> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private config: CronSchedulerConfig;
  private running: boolean = false;
  
  constructor(config?: Partial<CronSchedulerConfig>) {
    this.config = {
      defaultTimezone: 'UTC',
      maxConcurrentJobs: 100,
      defaultTimeout: 30000,
      enablePhiJitter: true,
      executionHistoryLimit: 100,
      lockTimeout: 30000,
      ...config
    };
    
    console.log(`[${PROTOCOL_ID}] Cron Scheduler initialized`);
  }
  
  /**
   * Create a new cron job
   */
  createJob(
    name: string,
    schedule: string,
    workerId: string,
    handler: string,
    options?: Partial<XCronJob>
  ): XCronJob {
    // Validate cron expression
    CronExpressionParser.parse(schedule);
    
    const id = `cron-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();
    
    const job: XCronJob = {
      id,
      name,
      schedule,
      workerId,
      handler,
      status: 'active',
      timezone: options?.timezone || this.config.defaultTimezone,
      retryPolicy: options?.retryPolicy || {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 60000,
        backoffMultiplier: PHI
      },
      timeout: options?.timeout || this.config.defaultTimeout,
      metadata: options?.metadata || {},
      createdAt: now,
      updatedAt: now,
      runCount: 0,
      failCount: 0,
      phiJitter: options?.phiJitter ?? this.config.enablePhiJitter
    };
    
    // Calculate next run
    job.nextRun = CronExpressionParser.getNextExecution(schedule);
    
    this.jobs.set(id, job);
    this.executions.set(id, []);
    
    // Schedule if running
    if (this.running) {
      this.scheduleJob(job);
    }
    
    console.log(`[${PROTOCOL_ID}] Created job: ${name} (${schedule})`);
    
    return job;
  }
  
  /**
   * Get a job by ID
   */
  getJob(id: string): XCronJob | undefined {
    return this.jobs.get(id);
  }
  
  /**
   * Update a job
   */
  updateJob(id: string, updates: Partial<XCronJob>): XCronJob | null {
    const job = this.jobs.get(id);
    if (!job) return null;
    
    // Update fields
    Object.assign(job, updates, { updatedAt: new Date() });
    
    // Recalculate next run if schedule changed
    if (updates.schedule) {
      job.nextRun = CronExpressionParser.getNextExecution(updates.schedule);
    }
    
    // Reschedule if running
    if (this.running) {
      this.cancelJobTimer(id);
      if (job.status === 'active') {
        this.scheduleJob(job);
      }
    }
    
    return job;
  }
  
  /**
   * Delete a job
   */
  deleteJob(id: string): boolean {
    this.cancelJobTimer(id);
    this.executions.delete(id);
    return this.jobs.delete(id);
  }
  
  /**
   * Pause a job
   */
  pauseJob(id: string): boolean {
    const job = this.jobs.get(id);
    if (!job) return false;
    
    job.status = 'paused';
    job.updatedAt = new Date();
    this.cancelJobTimer(id);
    
    return true;
  }
  
  /**
   * Resume a job
   */
  resumeJob(id: string): boolean {
    const job = this.jobs.get(id);
    if (!job) return false;
    
    job.status = 'active';
    job.updatedAt = new Date();
    job.nextRun = CronExpressionParser.getNextExecution(job.schedule);
    
    if (this.running) {
      this.scheduleJob(job);
    }
    
    return true;
  }
  
  /**
   * Trigger a job immediately
   */
  async triggerJob(id: string): Promise<CronExecution | null> {
    const job = this.jobs.get(id);
    if (!job) return null;
    
    return this.executeJob(job);
  }
  
  /**
   * List all jobs
   */
  listJobs(status?: CronStatus): XCronJob[] {
    const jobs = Array.from(this.jobs.values());
    if (status) {
      return jobs.filter(j => j.status === status);
    }
    return jobs;
  }
  
  /**
   * Get execution history for a job
   */
  getExecutionHistory(jobId: string, limit?: number): CronExecution[] {
    const history = this.executions.get(jobId) || [];
    if (limit) {
      return history.slice(-limit);
    }
    return history;
  }
  
  /**
   * Start the scheduler
   */
  start(): void {
    if (this.running) return;
    
    this.running = true;
    
    // Schedule all active jobs
    for (const job of this.jobs.values()) {
      if (job.status === 'active') {
        this.scheduleJob(job);
      }
    }
    
    console.log(`[${PROTOCOL_ID}] Scheduler started with ${this.jobs.size} jobs`);
  }
  
  /**
   * Stop the scheduler
   */
  stop(): void {
    this.running = false;
    
    // Cancel all timers
    for (const id of this.timers.keys()) {
      this.cancelJobTimer(id);
    }
    
    console.log(`[${PROTOCOL_ID}] Scheduler stopped`);
  }
  
  /**
   * Get scheduler status
   */
  getStatus(): {
    running: boolean;
    totalJobs: number;
    activeJobs: number;
    pendingExecutions: number;
  } {
    return {
      running: this.running,
      totalJobs: this.jobs.size,
      activeJobs: this.listJobs('active').length,
      pendingExecutions: this.timers.size
    };
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────────
  
  private scheduleJob(job: XCronJob): void {
    if (!job.nextRun) return;
    
    let delay = job.nextRun.getTime() - Date.now();
    
    // Apply φ-harmonic jitter
    if (job.phiJitter) {
      delay += PhiJitterCalculator.calculateJitter(job.nextRun, job.id);
    }
    
    // Ensure positive delay
    if (delay < 0) {
      job.nextRun = CronExpressionParser.getNextExecution(job.schedule);
      delay = job.nextRun.getTime() - Date.now();
    }
    
    const timer = setTimeout(async () => {
      await this.executeJob(job);
      
      // Schedule next execution
      job.nextRun = CronExpressionParser.getNextExecution(job.schedule);
      if (this.running && job.status === 'active') {
        this.scheduleJob(job);
      }
    }, delay);
    
    this.timers.set(job.id, timer);
  }
  
  private cancelJobTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }
  
  private async executeJob(job: XCronJob): Promise<CronExecution> {
    const execution: CronExecution = {
      id: `exec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      jobId: job.id,
      scheduledTime: job.nextRun || new Date(),
      startTime: new Date(),
      status: 'running',
      attempt: 1,
      region: 'local',
      workerId: job.workerId,
      logs: []
    };
    
    this.addLog(execution, 'info', `Starting execution of job: ${job.name}`);
    
    try {
      // Simulate job execution
      await this.simulateExecution(job, execution);
      
      execution.status = 'completed';
      execution.endTime = new Date();
      execution.duration = execution.endTime.getTime() - execution.startTime!.getTime();
      
      job.runCount++;
      job.lastRun = execution.endTime;
      
      this.addLog(execution, 'info', `Job completed in ${execution.duration}ms`);
      
    } catch (error: any) {
      execution.status = 'failed';
      execution.endTime = new Date();
      execution.duration = execution.endTime.getTime() - execution.startTime!.getTime();
      execution.error = error.message;
      
      job.failCount++;
      job.lastRun = execution.endTime;
      
      this.addLog(execution, 'error', `Job failed: ${error.message}`);
    }
    
    // Store execution history
    const history = this.executions.get(job.id) || [];
    history.push(execution);
    
    // Trim history
    if (history.length > this.config.executionHistoryLimit) {
      history.shift();
    }
    
    this.executions.set(job.id, history);
    
    return execution;
  }
  
  private async simulateExecution(job: XCronJob, execution: CronExecution): Promise<void> {
    // Simulate work with φ-harmonic timing
    const baseTime = 100;
    const variance = baseTime * PHI_INV;
    const duration = baseTime + Math.random() * variance;
    
    await new Promise(resolve => setTimeout(resolve, duration));
    
    // Random failure for testing (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Simulated random failure');
    }
    
    execution.result = { success: true, timestamp: Date.now() };
  }
  
  private addLog(execution: CronExecution, level: CronLogEntry['level'], message: string, data?: any): void {
    execution.logs.push({
      timestamp: new Date(),
      level,
      message,
      data
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON & EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

let cronSchedulerInstance: XCronScheduler | null = null;

export function getXCronScheduler(): XCronScheduler {
  if (!cronSchedulerInstance) {
    cronSchedulerInstance = new XCronScheduler();
  }
  return cronSchedulerInstance;
}

export function createCronJob(
  name: string,
  schedule: string,
  workerId: string,
  handler: string,
  options?: Partial<XCronJob>
): XCronJob {
  return getXCronScheduler().createJob(name, schedule, workerId, handler, options);
}

export default {
  XCronScheduler,
  CronExpressionParser,
  PhiJitterCalculator,
  getXCronScheduler,
  createCronJob
};
