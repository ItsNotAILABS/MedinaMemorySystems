// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 PHI-HARMONIC TIMING ENGINE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Golden-ratio derived timing intervals for multi-agent coordination, as
 * described in papers/arxiv/PHI_HARMONIC_TIMING.md
 *
 * Primary interval family (base = Schumann ≈ 127.7ms):
 *
 *   τ_nano    = T_base × φ⁻²  ≈  48.8ms   ultra-fast polling
 *   τ_micro   = T_base × φ⁻¹  ≈  78.9ms   fast heartbeat
 *   τ_base    = T_base         ≈ 127.7ms   base Schumann period
 *   τ_heart   = T_base × φ¹   ≈ 206.6ms   cardiac beat
 *   τ_breath  = T_base × φ²   ≈ 334.2ms   breath cycle
 *   τ_major   = T_base × φ³   ≈ 540.8ms   major coordination
 *   τ_primary = T_base × φ⁴   ≈ 875ms     primary sovereign heartbeat
 *   τ_deep    = T_base × φ⁵   ≈ 1415ms    deep resonance
 *   τ_epoch   = T_base × φ⁶   ≈ 2290ms    epoch marker
 *   τ_cycle   = T_base × φ⁷   ≈ 3705ms    full cycle
 *
 * Features:
 *   - Schedule recurring and one-shot tasks on φ-harmonic intervals
 *   - Auto-select the best interval for a given throughput target
 *   - Detect beat-frequency collisions between scheduled tasks
 *   - Fibonacci jitter to prevent thundering herd problems
 *   - Phase-lock multiple task groups
 *
 * Charter: PHT-001
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { sovereignId } from './sovereign-id';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION I: CONSTANTS — THE PHI-HARMONIC INTERVAL FAMILY
// ═══════════════════════════════════════════════════════════════════════════════

/** The golden ratio */
export const PHI = (1 + Math.sqrt(5)) / 2;

/** Inverse golden ratio */
export const PHI_INVERSE = 1 / PHI;

/** Squared golden ratio */
export const PHI_SQUARED = PHI * PHI;

/** Cubed golden ratio */
export const PHI_CUBED = PHI * PHI * PHI;

/** φ⁴ — used for primary heartbeat computation */
export const PHI_FOURTH = PHI_CUBED * PHI;

/** Schumann resonance base (7.83 Hz → period ≈ 127.71ms) */
export const SCHUMANN_PERIOD_MS = 1000 / 7.83;

/** The full Fibonacci sequence up to F₂₀ */
export const FIBONACCI = [
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765,
] as const;

/** Named harmonic intervals derived from φ powers × Schumann base */
export const HARMONIC_INTERVALS = {
  /** Ultra-fast polling: φ⁻² × T_base ≈ 48.8ms */
  NANO:    SCHUMANN_PERIOD_MS * PHI_INVERSE * PHI_INVERSE,
  /** Fast heartbeat: φ⁻¹ × T_base ≈ 78.9ms */
  MICRO:   SCHUMANN_PERIOD_MS * PHI_INVERSE,
  /** Base Schumann period ≈ 127.7ms */
  BASE:    SCHUMANN_PERIOD_MS,
  /** Cardiac beat: φ¹ × T_base ≈ 206.6ms */
  HEART:   SCHUMANN_PERIOD_MS * PHI,
  /** Breath cycle: φ² × T_base ≈ 334.2ms */
  BREATH:  SCHUMANN_PERIOD_MS * PHI_SQUARED,
  /** Major coordination: φ³ × T_base ≈ 540.8ms */
  MAJOR:   SCHUMANN_PERIOD_MS * PHI_CUBED,
  /** Primary sovereign heartbeat: φ⁴ × T_base ≈ 875ms */
  PRIMARY: SCHUMANN_PERIOD_MS * PHI_FOURTH,
  /** Deep resonance: φ⁵ × T_base ≈ 1415ms */
  DEEP:    SCHUMANN_PERIOD_MS * PHI_FOURTH * PHI,
  /** Epoch marker: φ⁶ × T_base ≈ 2290ms */
  EPOCH:   SCHUMANN_PERIOD_MS * PHI_FOURTH * PHI_SQUARED,
  /** Full cycle: φ⁷ × T_base ≈ 3705ms */
  CYCLE:   SCHUMANN_PERIOD_MS * PHI_FOURTH * PHI_CUBED,
} as const;

export type HarmonicLevel = keyof typeof HARMONIC_INTERVALS;

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION II: TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type TaskScheduleType = 'recurring' | 'one-shot' | 'phase-locked';

export type TimingStatus = 'scheduled' | 'running' | 'paused' | 'complete' | 'cancelled';

/** A task scheduled on a phi-harmonic interval */
export interface TimedTask {
  id: string;
  name: string;
  scheduleType: TaskScheduleType;
  harmonicLevel: HarmonicLevel;
  intervalMs: number;
  jitterMs: number;
  phase: number;           // 0–1 fractional phase offset within interval
  nextFireMs: number;      // absolute epoch ms of next fire
  lastFireMs: number;      // absolute epoch ms of last fire
  executionCount: number;
  maxExecutions?: number;  // undefined = infinite
  status: TimingStatus;
  groupId?: string;        // for phase-locked groups
  metadata: Record<string, unknown>;
}

/** A phase-locked group of tasks that share a common beat */
export interface PhaseGroup {
  id: string;
  name: string;
  harmonicLevel: HarmonicLevel;
  memberTaskIds: string[];
  phaseOffsets: Record<string, number>; // taskId → [0, 1) phase
  masterIntervalMs: number;
  createdAt: string;
}

/** Beat-frequency collision between two scheduled tasks */
export interface BeatCollision {
  taskA: string;
  taskB: string;
  beatFrequencyHz: number;
  collisionProbability: number; // 0–1
  recommendation: string;
}

/** Summary of the scheduling engine */
export interface SchedulerStats {
  totalTasks: number;
  tasksByLevel: Record<HarmonicLevel, number>;
  tasksByStatus: Record<TimingStatus, number>;
  totalExecutions: number;
  phaseGroups: number;
  nextFireMs: number;
  harmonicIntervals: Record<HarmonicLevel, number>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION III: FIBONACCI JITTER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute a Fibonacci-based jitter value to prevent thundering herd.
 * Returns a value in [0, maxJitter] derived from the n-th Fibonacci number.
 */
export function fibonacciJitter(taskIndex: number, maxJitter: number): number {
  const fibIdx = taskIndex % FIBONACCI.length;
  const fibVal = FIBONACCI[fibIdx];
  const fibMax = FIBONACCI[FIBONACCI.length - 1];
  return (fibVal / fibMax) * maxJitter;
}

/**
 * φ-golden-ratio jitter that avoids rational beat frequencies.
 * Offsets successive tasks by the golden-angle (≈137.5°) as a fraction of the interval.
 */
export function goldenAngleJitter(taskIndex: number, intervalMs: number): number {
  const goldenAngle = 2 * Math.PI * PHI_INVERSE; // ≈ 2.399963...
  const fraction = (taskIndex * goldenAngle) % (2 * Math.PI);
  return (fraction / (2 * Math.PI)) * intervalMs * PHI_INVERSE;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION IV: INTERVAL SELECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Select the best harmonic level for a given target throughput (calls/sec).
 * Returns the level whose interval most closely matches 1/targetHz.
 */
export function selectHarmonicForThroughput(targetHz: number): HarmonicLevel {
  const targetMs = 1000 / targetHz;
  let bestLevel: HarmonicLevel = 'BASE';
  let bestDiff = Infinity;

  for (const [level, ms] of Object.entries(HARMONIC_INTERVALS) as [HarmonicLevel, number][]) {
    const diff = Math.abs(ms - targetMs);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestLevel = level;
    }
  }
  return bestLevel;
}

/**
 * Detect beat-frequency collisions between two intervals.
 * Two intervals f₁ and f₂ produce a beat at |f₁ - f₂|. If that beat
 * frequency falls below a threshold (causing perceptible interference),
 * it's a collision.
 */
export function detectBeatCollision(
  msA: number,
  msB: number,
  collisionThresholdHz = 0.5,
): { isCollision: boolean; beatHz: number } {
  const fA = 1000 / msA;
  const fB = 1000 / msB;
  const beatHz = Math.abs(fA - fB);
  return { isCollision: beatHz < collisionThresholdHz, beatHz };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION V: PHI-HARMONIC TIMING ENGINE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class PhiHarmonicTimingEngine {
  private tasks: Map<string, TimedTask> = new Map();
  private groups: Map<string, PhaseGroup> = new Map();
  private taskIndex = 0;   // used for jitter calculation
  private totalExecutions = 0;

  // ───────────────────────────────────────────────────────────────────────────
  // SCHEDULE TASKS
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Schedule a recurring task on a phi-harmonic interval.
   * Applies golden-angle jitter automatically to avoid collisions.
   */
  scheduleRecurring(params: {
    name: string;
    harmonicLevel: HarmonicLevel;
    maxExecutions?: number;
    phaseOffset?: number;
    metadata?: Record<string, unknown>;
  }): TimedTask {
    const intervalMs = HARMONIC_INTERVALS[params.harmonicLevel];
    const jitterMs = goldenAngleJitter(this.taskIndex, intervalMs);
    const phase = params.phaseOffset ?? 0;
    const nowMs = Date.now();

    const task: TimedTask = {
      id:             sovereignId(),
      name:           params.name,
      scheduleType:   'recurring',
      harmonicLevel:  params.harmonicLevel,
      intervalMs,
      jitterMs,
      phase,
      nextFireMs:     nowMs + intervalMs + jitterMs,
      lastFireMs:     0,
      executionCount: 0,
      maxExecutions:  params.maxExecutions,
      status:         'scheduled',
      metadata:       params.metadata ?? {},
    };

    this.tasks.set(task.id, task);
    this.taskIndex++;
    return task;
  }

  /**
   * Schedule a one-shot task at a specific harmonic delay.
   */
  scheduleOneShot(params: {
    name: string;
    harmonicLevel: HarmonicLevel;
    metadata?: Record<string, unknown>;
  }): TimedTask {
    const intervalMs = HARMONIC_INTERVALS[params.harmonicLevel];
    const jitterMs = fibonacciJitter(this.taskIndex, intervalMs * PHI_INVERSE);
    const nowMs = Date.now();

    const task: TimedTask = {
      id:             sovereignId(),
      name:           params.name,
      scheduleType:   'one-shot',
      harmonicLevel:  params.harmonicLevel,
      intervalMs,
      jitterMs,
      phase:          0,
      nextFireMs:     nowMs + intervalMs + jitterMs,
      lastFireMs:     0,
      executionCount: 0,
      maxExecutions:  1,
      status:         'scheduled',
      metadata:       params.metadata ?? {},
    };

    this.tasks.set(task.id, task);
    this.taskIndex++;
    return task;
  }

  /**
   * Create a phase-locked group of tasks.
   * All tasks in the group share a common interval but are spread evenly
   * across the cycle using golden-angle offsets.
   */
  createPhaseGroup(params: {
    name: string;
    harmonicLevel: HarmonicLevel;
    taskNames: string[];
    metadata?: Record<string, unknown>;
  }): { group: PhaseGroup; tasks: TimedTask[] } {
    const intervalMs = HARMONIC_INTERVALS[params.harmonicLevel];
    const groupId = sovereignId();
    const phaseOffsets: Record<string, number> = {};
    const tasks: TimedTask[] = [];

    params.taskNames.forEach((taskName, i) => {
      // Distribute tasks evenly using golden angle
      const phase = (i * PHI_INVERSE) % 1;
      const task = this.scheduleRecurring({
        name:          taskName,
        harmonicLevel: params.harmonicLevel,
        phaseOffset:   phase,
        metadata:      { groupId, ...params.metadata },
      });
      task.groupId = groupId;
      // Override nextFireMs with phase-accurate offset
      task.nextFireMs = Date.now() + intervalMs * phase + task.jitterMs;
      phaseOffsets[task.id] = phase;
      tasks.push(task);
    });

    const group: PhaseGroup = {
      id:               groupId,
      name:             params.name,
      harmonicLevel:    params.harmonicLevel,
      memberTaskIds:    tasks.map(t => t.id),
      phaseOffsets,
      masterIntervalMs: intervalMs,
      createdAt:        new Date().toISOString(),
    };

    this.groups.set(groupId, group);
    return { group, tasks };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TICK — advance the clock
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Advance the scheduler to nowMs and return tasks that should fire.
   * Call this in your event loop.
   */
  tick(nowMs: number = Date.now()): TimedTask[] {
    const fired: TimedTask[] = [];

    for (const task of this.tasks.values()) {
      if (task.status !== 'scheduled' && task.status !== 'running') continue;
      if (nowMs < task.nextFireMs) continue;

      task.lastFireMs = nowMs;
      task.executionCount++;
      this.totalExecutions++;
      fired.push(task);

      if (task.scheduleType === 'one-shot' || task.executionCount >= (task.maxExecutions ?? Infinity)) {
        task.status = 'complete';
      } else {
        // Schedule next fire at full interval from now, with golden-angle jitter
        task.jitterMs = goldenAngleJitter(task.executionCount, task.intervalMs);
        task.nextFireMs = nowMs + task.intervalMs + task.jitterMs;
        task.status = 'scheduled';
      }
    }

    return fired;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TASK CONTROL
  // ───────────────────────────────────────────────────────────────────────────

  pause(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task || task.status === 'complete' || task.status === 'cancelled') return false;
    task.status = 'paused';
    return true;
  }

  resume(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'paused') return false;
    task.status = 'scheduled';
    // Re-offset next fire from now
    task.nextFireMs = Date.now() + task.intervalMs + task.jitterMs;
    return true;
  }

  cancel(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    task.status = 'cancelled';
    return true;
  }

  getTask(taskId: string): TimedTask | null {
    return this.tasks.get(taskId) ?? null;
  }

  getGroup(groupId: string): PhaseGroup | null {
    return this.groups.get(groupId) ?? null;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // COLLISION DETECTION
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Scan all scheduled tasks for beat-frequency collisions.
   */
  detectCollisions(thresholdHz = 0.5): BeatCollision[] {
    const active = [...this.tasks.values()].filter(
      t => t.status === 'scheduled' || t.status === 'paused',
    );
    const collisions: BeatCollision[] = [];

    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const { isCollision, beatHz } = detectBeatCollision(
          active[i].intervalMs,
          active[j].intervalMs,
          thresholdHz,
        );
        if (isCollision) {
          collisions.push({
            taskA:               active[i].id,
            taskB:               active[j].id,
            beatFrequencyHz:     beatHz,
            collisionProbability: 1 - Math.min(beatHz / thresholdHz, 1),
            recommendation: `Apply golden-angle phase offset of ${(PHI_INVERSE * active[i].intervalMs).toFixed(1)}ms to one task`,
          });
        }
      }
    }

    return collisions;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STATISTICS
  // ───────────────────────────────────────────────────────────────────────────

  stats(): SchedulerStats {
    const tasksByLevel = {} as Record<HarmonicLevel, number>;
    const tasksByStatus = {} as Record<TimingStatus, number>;

    for (const level of Object.keys(HARMONIC_INTERVALS) as HarmonicLevel[]) {
      tasksByLevel[level] = 0;
    }
    for (const status of ['scheduled', 'running', 'paused', 'complete', 'cancelled'] as TimingStatus[]) {
      tasksByStatus[status] = 0;
    }

    let nextFireMs = Infinity;
    for (const task of this.tasks.values()) {
      tasksByLevel[task.harmonicLevel] = (tasksByLevel[task.harmonicLevel] ?? 0) + 1;
      tasksByStatus[task.status] = (tasksByStatus[task.status] ?? 0) + 1;
      if (task.status === 'scheduled' && task.nextFireMs < nextFireMs) {
        nextFireMs = task.nextFireMs;
      }
    }

    return {
      totalTasks:        this.tasks.size,
      tasksByLevel,
      tasksByStatus,
      totalExecutions:   this.totalExecutions,
      phaseGroups:       this.groups.size,
      nextFireMs:        isFinite(nextFireMs) ? nextFireMs : 0,
      harmonicIntervals: { ...HARMONIC_INTERVALS },
    };
  }

  /** All tasks as an array */
  get allTasks(): TimedTask[] {
    return [...this.tasks.values()];
  }

  /** All groups as an array */
  get allGroups(): PhaseGroup[] {
    return [...this.groups.values()];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VI: SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let _instance: PhiHarmonicTimingEngine | null = null;

export function getPhiHarmonicTimingEngine(): PhiHarmonicTimingEngine {
  if (!_instance) _instance = new PhiHarmonicTimingEngine();
  return _instance;
}

export function resetPhiHarmonicTimingEngine(): void {
  _instance = null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VII: FACTORY HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a pre-configured engine with the standard sovereign timing stack:
 * one task per harmonic level.
 */
export function createSovereignTimingStack(): {
  engine: PhiHarmonicTimingEngine;
  tasks: Record<HarmonicLevel, TimedTask>;
} {
  const engine = new PhiHarmonicTimingEngine();
  const tasks = {} as Record<HarmonicLevel, TimedTask>;

  for (const level of Object.keys(HARMONIC_INTERVALS) as HarmonicLevel[]) {
    tasks[level] = engine.scheduleRecurring({
      name:          `sovereign-${level.toLowerCase()}-heartbeat`,
      harmonicLevel: level,
      metadata:      { sovereign: true, level },
    });
  }

  return { engine, tasks };
}
