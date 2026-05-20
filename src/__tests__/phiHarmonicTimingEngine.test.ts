/**
 * 𓂀 PHI-HARMONIC TIMING ENGINE — TEST SUITE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Tests for the golden-ratio timing system.
 * Charter: PHT-001
 *
 * Sections:
 *   I.   Constants & Harmonic Intervals
 *   II.  Fibonacci Jitter
 *   III. Interval Selection
 *   IV.  Beat Collision Detection
 *   V.   Schedule Recurring Tasks
 *   VI.  Schedule One-Shot Tasks
 *   VII. Phase-Locked Groups
 *   VIII.Tick — Advancing the Clock
 *   IX.  Task Control (pause/resume/cancel)
 *   X.   Statistics
 *   XI.  Factory Helpers
 *   XII. Singleton Lifecycle
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  PhiHarmonicTimingEngine,
  getPhiHarmonicTimingEngine,
  resetPhiHarmonicTimingEngine,
  createSovereignTimingStack,
  fibonacciJitter,
  goldenAngleJitter,
  selectHarmonicForThroughput,
  detectBeatCollision,
  PHI,
  PHI_INVERSE,
  PHI_SQUARED,
  PHI_CUBED,
  PHI_FOURTH,
  SCHUMANN_PERIOD_MS,
  HARMONIC_INTERVALS,
  FIBONACCI,
  type HarmonicLevel,
  type TimedTask,
} from '../lib/phiHarmonicTimingEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION I: CONSTANTS & HARMONIC INTERVALS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Constants', () => {
  test('PHI is the golden ratio', () => {
    expect(PHI).toBeCloseTo(1.618033988749895, 10);
  });

  test('PHI_INVERSE is 1/PHI', () => {
    expect(PHI_INVERSE).toBeCloseTo(0.618033988749895, 10);
  });

  test('PHI × PHI_INVERSE = 1', () => {
    expect(PHI * PHI_INVERSE).toBeCloseTo(1, 10);
  });

  test('PHI_SQUARED = PHI + 1', () => {
    expect(PHI_SQUARED).toBeCloseTo(PHI + 1, 10);
  });

  test('PHI_CUBED = PHI_SQUARED + PHI', () => {
    expect(PHI_CUBED).toBeCloseTo(PHI_SQUARED + PHI, 10);
  });

  test('PHI_FOURTH = PHI_CUBED × PHI', () => {
    expect(PHI_FOURTH).toBeCloseTo(PHI_CUBED * PHI, 10);
  });

  test('SCHUMANN_PERIOD_MS is approx 127.7ms', () => {
    expect(SCHUMANN_PERIOD_MS).toBeCloseTo(1000 / 7.83, 2);
  });

  test('FIBONACCI has 20 elements', () => {
    expect(FIBONACCI.length).toBe(20);
  });

  test('FIBONACCI 8th element is 21', () => {
    expect(FIBONACCI[7]).toBe(21);
  });
});

describe('HARMONIC_INTERVALS', () => {
  const levels: HarmonicLevel[] = [
    'NANO', 'MICRO', 'BASE', 'HEART', 'BREATH',
    'MAJOR', 'PRIMARY', 'DEEP', 'EPOCH', 'CYCLE',
  ];

  test('has 10 levels', () => {
    expect(Object.keys(HARMONIC_INTERVALS).length).toBe(10);
  });

  test('each level is a positive number', () => {
    levels.forEach(level => {
      expect(HARMONIC_INTERVALS[level]).toBeGreaterThan(0);
    });
  });

  test('intervals are ordered ascending', () => {
    for (let i = 1; i < levels.length; i++) {
      expect(HARMONIC_INTERVALS[levels[i]]).toBeGreaterThan(
        HARMONIC_INTERVALS[levels[i - 1]],
      );
    }
  });

  test('PRIMARY ≈ 875ms (φ⁴ × Schumann)', () => {
    expect(HARMONIC_INTERVALS.PRIMARY).toBeCloseTo(SCHUMANN_PERIOD_MS * PHI_FOURTH, 0);
    expect(HARMONIC_INTERVALS.PRIMARY).toBeGreaterThan(870);
    expect(HARMONIC_INTERVALS.PRIMARY).toBeLessThan(880);
  });

  test('each successive interval is ~PHI times the previous', () => {
    for (let i = 1; i < levels.length; i++) {
      const ratio = HARMONIC_INTERVALS[levels[i]] / HARMONIC_INTERVALS[levels[i - 1]];
      expect(ratio).toBeCloseTo(PHI, 0);
    }
  });

  test('BASE equals SCHUMANN_PERIOD_MS', () => {
    expect(HARMONIC_INTERVALS.BASE).toBeCloseTo(SCHUMANN_PERIOD_MS, 5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION II: FIBONACCI JITTER
// ═══════════════════════════════════════════════════════════════════════════════

describe('fibonacciJitter', () => {
  test('returns value in [0, maxJitter]', () => {
    for (let i = 0; i < 30; i++) {
      const j = fibonacciJitter(i, 100);
      expect(j).toBeGreaterThanOrEqual(0);
      expect(j).toBeLessThanOrEqual(100);
    }
  });

  test('is deterministic for same index', () => {
    expect(fibonacciJitter(5, 50)).toBe(fibonacciJitter(5, 50));
  });

  test('produces different values for different indices', () => {
    const vals = new Set(Array.from({ length: 15 }, (_, i) => fibonacciJitter(i, 100)));
    expect(vals.size).toBeGreaterThan(5);
  });
});

describe('goldenAngleJitter', () => {
  test('returns value in [0, intervalMs]', () => {
    for (let i = 0; i < 30; i++) {
      const j = goldenAngleJitter(i, 500);
      expect(j).toBeGreaterThanOrEqual(0);
      expect(j).toBeLessThanOrEqual(500);
    }
  });

  test('is deterministic for same inputs', () => {
    expect(goldenAngleJitter(7, 200)).toBe(goldenAngleJitter(7, 200));
  });

  test('successive values do not repeat immediately', () => {
    const vals = Array.from({ length: 10 }, (_, i) => goldenAngleJitter(i, 1000));
    const unique = new Set(vals);
    expect(unique.size).toBeGreaterThan(5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION III: INTERVAL SELECTION
// ═══════════════════════════════════════════════════════════════════════════════

describe('selectHarmonicForThroughput', () => {
  test('returns a valid HarmonicLevel', () => {
    const level = selectHarmonicForThroughput(1);
    expect(Object.keys(HARMONIC_INTERVALS)).toContain(level);
  });

  test('high throughput (10 Hz) selects short interval', () => {
    const level = selectHarmonicForThroughput(10);
    // 10 Hz → 100ms target → should pick NANO or MICRO
    expect(['NANO', 'MICRO', 'BASE']).toContain(level);
  });

  test('low throughput (0.5 Hz) selects long interval', () => {
    const level = selectHarmonicForThroughput(0.5);
    // 0.5 Hz → 2000ms target
    expect(['EPOCH', 'CYCLE', 'DEEP']).toContain(level);
  });

  test('Schumann frequency (7.83 Hz) selects BASE', () => {
    const level = selectHarmonicForThroughput(7.83);
    expect(level).toBe('BASE');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION IV: BEAT COLLISION DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

describe('detectBeatCollision', () => {
  test('identical intervals produce 0 beat frequency (collision)', () => {
    const { isCollision, beatHz } = detectBeatCollision(100, 100, 0.5);
    expect(beatHz).toBe(0);
    expect(isCollision).toBe(true);
  });

  test('phi-ratio intervals do not collide', () => {
    // PHI-ratio intervals have irrational beat frequencies
    const ms1 = HARMONIC_INTERVALS.BASE;
    const ms2 = HARMONIC_INTERVALS.HEART;
    const { isCollision } = detectBeatCollision(ms1, ms2, 0.5);
    // Should not be a collision
    expect(isCollision).toBe(false);
  });

  test('beatHz is symmetric', () => {
    const { beatHz: ab } = detectBeatCollision(100, 200, 0.5);
    const { beatHz: ba } = detectBeatCollision(200, 100, 0.5);
    expect(ab).toBeCloseTo(ba, 10);
  });

  test('very close intervals collide', () => {
    // 100ms and 102ms → beat ≈ 0.196 Hz < threshold 0.5 Hz
    const { isCollision } = detectBeatCollision(100, 102, 0.5);
    expect(isCollision).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION V: SCHEDULE RECURRING TASKS
// ═══════════════════════════════════════════════════════════════════════════════

describe('scheduleRecurring', () => {
  let engine: PhiHarmonicTimingEngine;

  beforeEach(() => {
    engine = new PhiHarmonicTimingEngine();
  });

  test('returns a TimedTask', () => {
    const task = engine.scheduleRecurring({ name: 'heartbeat', harmonicLevel: 'PRIMARY' });
    expect(task.id).toBeDefined();
    expect(task.name).toBe('heartbeat');
  });

  test('scheduleType is recurring', () => {
    const task = engine.scheduleRecurring({ name: 'test', harmonicLevel: 'BASE' });
    expect(task.scheduleType).toBe('recurring');
  });

  test('intervalMs matches the harmonic level', () => {
    const task = engine.scheduleRecurring({ name: 'test', harmonicLevel: 'HEART' });
    expect(task.intervalMs).toBeCloseTo(HARMONIC_INTERVALS.HEART, 5);
  });

  test('status is scheduled', () => {
    const task = engine.scheduleRecurring({ name: 'test', harmonicLevel: 'MICRO' });
    expect(task.status).toBe('scheduled');
  });

  test('nextFireMs is in the future', () => {
    const before = Date.now();
    const task = engine.scheduleRecurring({ name: 'test', harmonicLevel: 'NANO' });
    expect(task.nextFireMs).toBeGreaterThan(before);
  });

  test('maxExecutions is respected', () => {
    const task = engine.scheduleRecurring({
      name: 'limited', harmonicLevel: 'NANO', maxExecutions: 3,
    });
    expect(task.maxExecutions).toBe(3);
  });

  test('metadata is stored', () => {
    const task = engine.scheduleRecurring({
      name: 'meta', harmonicLevel: 'BASE', metadata: { source: 'test' },
    });
    expect(task.metadata.source).toBe('test');
  });

  test('successive tasks get golden-angle jitter offsets', () => {
    const t1 = engine.scheduleRecurring({ name: 't1', harmonicLevel: 'MAJOR' });
    const t2 = engine.scheduleRecurring({ name: 't2', harmonicLevel: 'MAJOR' });
    // Jitter should differ
    expect(t1.jitterMs).not.toBe(t2.jitterMs);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VI: SCHEDULE ONE-SHOT TASKS
// ═══════════════════════════════════════════════════════════════════════════════

describe('scheduleOneShot', () => {
  let engine: PhiHarmonicTimingEngine;

  beforeEach(() => {
    engine = new PhiHarmonicTimingEngine();
  });

  test('returns a one-shot task', () => {
    const task = engine.scheduleOneShot({ name: 'init', harmonicLevel: 'BREATH' });
    expect(task.scheduleType).toBe('one-shot');
    expect(task.maxExecutions).toBe(1);
  });

  test('completes after one tick', () => {
    const task = engine.scheduleOneShot({ name: 'once', harmonicLevel: 'NANO' });
    // Force fire by setting nextFireMs to the past
    task.nextFireMs = Date.now() - 1;
    engine.tick();
    expect(task.status).toBe('complete');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VII: PHASE-LOCKED GROUPS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Phase-locked groups', () => {
  let engine: PhiHarmonicTimingEngine;

  beforeEach(() => {
    engine = new PhiHarmonicTimingEngine();
  });

  test('createPhaseGroup returns group and tasks', () => {
    const { group, tasks } = engine.createPhaseGroup({
      name: 'sensors',
      harmonicLevel: 'HEART',
      taskNames: ['sense-A', 'sense-B', 'sense-C'],
    });
    expect(group.id).toBeDefined();
    expect(tasks.length).toBe(3);
  });

  test('all tasks share the same harmonic level', () => {
    const { tasks } = engine.createPhaseGroup({
      name: 'shared',
      harmonicLevel: 'MAJOR',
      taskNames: ['t1', 't2'],
    });
    tasks.forEach(t => expect(t.harmonicLevel).toBe('MAJOR'));
  });

  test('tasks have different phase offsets', () => {
    const { tasks } = engine.createPhaseGroup({
      name: 'phased',
      harmonicLevel: 'BREATH',
      taskNames: ['a', 'b', 'c', 'd'],
    });
    const phases = tasks.map(t => t.phase);
    const uniquePhases = new Set(phases);
    expect(uniquePhases.size).toBe(tasks.length);
  });

  test('group is retrievable by id', () => {
    const { group } = engine.createPhaseGroup({
      name: 'retrievable',
      harmonicLevel: 'BASE',
      taskNames: ['x'],
    });
    expect(engine.getGroup(group.id)).toBe(group);
  });

  test('getGroup returns null for unknown id', () => {
    expect(engine.getGroup('unknown')).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VIII: TICK — ADVANCING THE CLOCK
// ═══════════════════════════════════════════════════════════════════════════════

describe('tick()', () => {
  let engine: PhiHarmonicTimingEngine;

  beforeEach(() => {
    engine = new PhiHarmonicTimingEngine();
  });

  test('no tasks fire before their nextFireMs', () => {
    engine.scheduleRecurring({ name: 'future', harmonicLevel: 'CYCLE' });
    const fired = engine.tick(Date.now() - 1);
    expect(fired.length).toBe(0);
  });

  test('task fires at or after nextFireMs', () => {
    const task = engine.scheduleRecurring({ name: 'ready', harmonicLevel: 'NANO' });
    task.nextFireMs = Date.now() - 1;
    const fired = engine.tick();
    expect(fired.some(t => t.id === task.id)).toBe(true);
  });

  test('recurring task reschedules after firing', () => {
    const task = engine.scheduleRecurring({ name: 'recur', harmonicLevel: 'NANO' });
    task.nextFireMs = Date.now() - 1;
    const before = task.nextFireMs;
    engine.tick();
    expect(task.nextFireMs).toBeGreaterThan(before);
    expect(task.status).toBe('scheduled');
  });

  test('one-shot task becomes complete after firing', () => {
    const task = engine.scheduleOneShot({ name: 'once', harmonicLevel: 'NANO' });
    task.nextFireMs = Date.now() - 1;
    engine.tick();
    expect(task.status).toBe('complete');
  });

  test('executionCount increments on fire', () => {
    const task = engine.scheduleRecurring({ name: 'count', harmonicLevel: 'NANO' });
    task.nextFireMs = Date.now() - 1;
    engine.tick();
    expect(task.executionCount).toBe(1);
  });

  test('multiple tasks can fire in one tick', () => {
    const t1 = engine.scheduleRecurring({ name: 'a', harmonicLevel: 'NANO' });
    const t2 = engine.scheduleRecurring({ name: 'b', harmonicLevel: 'MICRO' });
    t1.nextFireMs = Date.now() - 1;
    t2.nextFireMs = Date.now() - 1;
    const fired = engine.tick();
    expect(fired.length).toBeGreaterThanOrEqual(2);
  });

  test('paused tasks do not fire', () => {
    const task = engine.scheduleRecurring({ name: 'paused', harmonicLevel: 'NANO' });
    task.nextFireMs = Date.now() - 1;
    engine.pause(task.id);
    const fired = engine.tick();
    expect(fired.some(t => t.id === task.id)).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION IX: TASK CONTROL
// ═══════════════════════════════════════════════════════════════════════════════

describe('Task control', () => {
  let engine: PhiHarmonicTimingEngine;
  let task: TimedTask;

  beforeEach(() => {
    engine = new PhiHarmonicTimingEngine();
    task = engine.scheduleRecurring({ name: 'ctrl', harmonicLevel: 'HEART' });
  });

  test('pause() sets status to paused', () => {
    expect(engine.pause(task.id)).toBe(true);
    expect(task.status).toBe('paused');
  });

  test('pause() returns false for unknown id', () => {
    expect(engine.pause('ghost')).toBe(false);
  });

  test('resume() sets status to scheduled', () => {
    engine.pause(task.id);
    expect(engine.resume(task.id)).toBe(true);
    expect(task.status).toBe('scheduled');
  });

  test('resume() returns false if not paused', () => {
    expect(engine.resume(task.id)).toBe(false);
  });

  test('cancel() sets status to cancelled', () => {
    expect(engine.cancel(task.id)).toBe(true);
    expect(task.status).toBe('cancelled');
  });

  test('cancel() returns false for unknown id', () => {
    expect(engine.cancel('ghost')).toBe(false);
  });

  test('getTask() returns the task', () => {
    expect(engine.getTask(task.id)).toBe(task);
  });

  test('getTask() returns null for unknown id', () => {
    expect(engine.getTask('ghost')).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION X: STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════

describe('stats()', () => {
  let engine: PhiHarmonicTimingEngine;

  beforeEach(() => {
    engine = new PhiHarmonicTimingEngine();
    engine.scheduleRecurring({ name: 'a', harmonicLevel: 'BASE' });
    engine.scheduleRecurring({ name: 'b', harmonicLevel: 'HEART' });
    engine.scheduleOneShot({ name: 'c', harmonicLevel: 'NANO' });
  });

  test('totalTasks is 3', () => {
    expect(engine.stats().totalTasks).toBe(3);
  });

  test('tasksByLevel tracks counts', () => {
    const { tasksByLevel } = engine.stats();
    expect(tasksByLevel['BASE']).toBe(1);
    expect(tasksByLevel['HEART']).toBe(1);
    expect(tasksByLevel['NANO']).toBe(1);
  });

  test('tasksByStatus starts with all scheduled', () => {
    const { tasksByStatus } = engine.stats();
    expect(tasksByStatus['scheduled']).toBe(3);
    expect(tasksByStatus['paused']).toBe(0);
  });

  test('harmonicIntervals are present in stats', () => {
    const { harmonicIntervals } = engine.stats();
    expect(harmonicIntervals['PRIMARY']).toBeCloseTo(HARMONIC_INTERVALS.PRIMARY, 5);
  });

  test('totalExecutions starts at 0', () => {
    expect(engine.stats().totalExecutions).toBe(0);
  });

  test('allTasks returns array of all tasks', () => {
    expect(engine.allTasks.length).toBe(3);
  });

  test('allGroups starts empty', () => {
    expect(engine.allGroups.length).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION XI: FACTORY HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

describe('createSovereignTimingStack', () => {
  test('returns engine and tasks for all 10 levels', () => {
    const { engine, tasks } = createSovereignTimingStack();
    const levels: HarmonicLevel[] = [
      'NANO', 'MICRO', 'BASE', 'HEART', 'BREATH',
      'MAJOR', 'PRIMARY', 'DEEP', 'EPOCH', 'CYCLE',
    ];
    levels.forEach(level => {
      expect(tasks[level]).toBeDefined();
      expect(tasks[level].harmonicLevel).toBe(level);
    });
    expect(engine.stats().totalTasks).toBe(10);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION XII: SINGLETON LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Singleton', () => {
  afterEach(() => {
    resetPhiHarmonicTimingEngine();
  });

  test('getPhiHarmonicTimingEngine returns same instance', () => {
    const a = getPhiHarmonicTimingEngine();
    const b = getPhiHarmonicTimingEngine();
    expect(a).toBe(b);
  });

  test('reset creates a fresh instance', () => {
    const a = getPhiHarmonicTimingEngine();
    a.scheduleRecurring({ name: 'test', harmonicLevel: 'BASE' });
    resetPhiHarmonicTimingEngine();
    const b = getPhiHarmonicTimingEngine();
    expect(b.stats().totalTasks).toBe(0);
  });
});
