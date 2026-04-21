/**
 * CHAOS FLOW
 * ─────────────────────────────────────────────────────────────────────────────
 * Micro chaos models for AI workflow recovery.
 *
 * When a workflow reaches an unstable state — a mishap, a loop, a deadlock,
 * an unexpected output — chaos-flow uses attractor basin analysis to:
 *   1. Detect the type of instability (LOOP, DEADLOCK, DRIFT, CASCADE, STALL)
 *   2. Identify the nearest stable attractor basin
 *   3. Reroute execution into that basin
 *   4. Restore coherence
 *
 * Inspired by:
 *   - Lorenz attractors and basin theory
 *   - Kuramoto oscillator synchronization
 *   - Resilience engineering (graceful degradation)
 *   - AI workflow orchestration patterns
 *
 * MIT License — ItsNotAILABS / Medina Memory Systems
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type InstabilityType =
  | 'LOOP'        // Infinite or near-infinite cycle
  | 'DEADLOCK'    // Two or more steps waiting on each other
  | 'DRIFT'       // Gradual deviation from intended behavior
  | 'CASCADE'     // One failure triggering many downstream failures
  | 'STALL'       // Complete halt — no output, no error
  | 'OSCILLATION' // Alternating between two incompatible states
  | 'UNKNOWN';    // Unclassified instability

export type RecoveryStrategy =
  | 'RESTART'         // Hard restart of the step
  | 'REROUTE'         // Skip the step, use alternate path
  | 'FALLBACK'        // Use a fallback value / behavior
  | 'REDUCE'          // Reduce scope / complexity and retry
  | 'CHECKPOINT'      // Roll back to last stable checkpoint
  | 'ISOLATE'         // Quarantine the failing step
  | 'HUMAN_ESCALATE'; // Escalate to human review

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETE' | 'FAILED' | 'SKIPPED';
  startedAt?: number;
  completedAt?: number;
  retryCount: number;
  lastError?: string;
  output?: unknown;
  dependencies: string[];
}

export interface WorkflowState {
  id: string;
  steps: Map<string, WorkflowStep>;
  currentStep?: string;
  startedAt: number;
  lastHealthyAt: number;
  coherence: number;  // 0–1, how stable is the workflow
  beat: number;
}

export interface ChaosEvent {
  id: string;
  workflowId: string;
  stepId: string;
  timestamp: number;
  instability: InstabilityType;
  severity: number;   // 0–1
  description: string;
  suggestedStrategy: RecoveryStrategy;
}

export interface RecoveryResult {
  success: boolean;
  strategy: RecoveryStrategy;
  stepsAffected: string[];
  coherenceBefore: number;
  coherenceAfter: number;
  description: string;
  timestamp: number;
}

export interface AttractorBasin {
  id: string;
  name: string;
  stability: number;    // 0–1 how stable this basin is
  entryConditions: string[];
  associatedSteps: string[];
}

// ─── Instability Detection ────────────────────────────────────────────────────

/**
 * Detect instability type from a workflow state.
 */
export function detectInstability(
  state: WorkflowState,
  history: WorkflowStep[][] = [],
): ChaosEvent | null {
  const steps = Array.from(state.steps.values());
  const failedSteps = steps.filter(s => s.status === 'FAILED');
  const runningSteps = steps.filter(s => s.status === 'RUNNING');
  const now = Date.now();

  // LOOP: any step has retried too many times
  const loopingStep = steps.find(s => s.retryCount >= 3);
  if (loopingStep) {
    return {
      id: `chaos_${now}`,
      workflowId: state.id,
      stepId: loopingStep.id,
      timestamp: now,
      instability: 'LOOP',
      severity: Math.min(1, loopingStep.retryCount / 10),
      description: `Step "${loopingStep.name}" has retried ${loopingStep.retryCount} times.`,
      suggestedStrategy: 'REROUTE',
    };
  }

  // DEADLOCK: multiple steps running but none completing
  if (runningSteps.length >= 2) {
    const stalledRunning = runningSteps.filter(
      s => s.startedAt && now - s.startedAt > 30000,
    );
    if (stalledRunning.length >= 2) {
      return {
        id: `chaos_${now}`,
        workflowId: state.id,
        stepId: stalledRunning[0].id,
        timestamp: now,
        instability: 'DEADLOCK',
        severity: 0.8,
        description: `${stalledRunning.length} steps appear deadlocked.`,
        suggestedStrategy: 'RESTART',
      };
    }
  }

  // STALL: a running step hasn't produced output in too long
  const stalledStep = runningSteps.find(
    s => s.startedAt && now - s.startedAt > 60000,
  );
  if (stalledStep) {
    return {
      id: `chaos_${now}`,
      workflowId: state.id,
      stepId: stalledStep.id,
      timestamp: now,
      instability: 'STALL',
      severity: 0.6,
      description: `Step "${stalledStep.name}" has been running for over 60 seconds.`,
      suggestedStrategy: 'RESTART',
    };
  }

  // CASCADE: multiple steps failed
  if (failedSteps.length >= 3) {
    return {
      id: `chaos_${now}`,
      workflowId: state.id,
      stepId: failedSteps[0].id,
      timestamp: now,
      instability: 'CASCADE',
      severity: Math.min(1, failedSteps.length / steps.length),
      description: `${failedSteps.length} steps have failed — potential cascade.`,
      suggestedStrategy: 'CHECKPOINT',
    };
  }

  // DRIFT: coherence has been declining (requires history)
  if (history.length >= 3) {
    const recentCoherence = history.slice(-3).map(snapshot =>
      snapshot.filter(s => s.status === 'COMPLETE').length / Math.max(snapshot.length, 1),
    );
    const declining = recentCoherence.every((v, i) => i === 0 || v <= recentCoherence[i - 1]);
    if (declining && recentCoherence[recentCoherence.length - 1] < 0.5) {
      return {
        id: `chaos_${now}`,
        workflowId: state.id,
        stepId: state.currentStep ?? 'unknown',
        timestamp: now,
        instability: 'DRIFT',
        severity: 1 - recentCoherence[recentCoherence.length - 1],
        description: 'Workflow coherence has been declining across multiple beats.',
        suggestedStrategy: 'REDUCE',
      };
    }
  }

  return null; // No instability detected
}

// ─── Attractor Basins ─────────────────────────────────────────────────────────

/**
 * Built-in attractor basins for common recovery patterns.
 */
export const ATTRACTOR_BASINS: AttractorBasin[] = [
  {
    id: 'stable_serial',
    name: 'Stable Serial Execution',
    stability: 0.95,
    entryConditions: ['single step running', 'no parallel dependencies'],
    associatedSteps: [],
  },
  {
    id: 'fallback_chain',
    name: 'Fallback Chain',
    stability: 0.80,
    entryConditions: ['primary path failed', 'fallback defined'],
    associatedSteps: [],
  },
  {
    id: 'minimal_viable',
    name: 'Minimal Viable Output',
    stability: 0.70,
    entryConditions: ['multiple failures', 'some output still possible'],
    associatedSteps: [],
  },
  {
    id: 'checkpoint_recovery',
    name: 'Checkpoint Recovery',
    stability: 0.85,
    entryConditions: ['checkpoint exists', 'state is restorable'],
    associatedSteps: [],
  },
  {
    id: 'human_loop',
    name: 'Human-in-the-Loop',
    stability: 1.0,
    entryConditions: ['all automated recovery failed'],
    associatedSteps: [],
  },
];

/**
 * Find the nearest stable attractor basin for a given chaos event.
 */
export function findNearestAttractor(event: ChaosEvent): AttractorBasin {
  const map: Record<InstabilityType, string> = {
    LOOP: 'fallback_chain',
    DEADLOCK: 'stable_serial',
    DRIFT: 'minimal_viable',
    CASCADE: 'checkpoint_recovery',
    STALL: 'stable_serial',
    OSCILLATION: 'fallback_chain',
    UNKNOWN: 'human_loop',
  };

  const basinId = map[event.instability];
  return ATTRACTOR_BASINS.find(b => b.id === basinId) ?? ATTRACTOR_BASINS[ATTRACTOR_BASINS.length - 1];
}

// ─── Recovery Engine ──────────────────────────────────────────────────────────

/**
 * Apply a recovery strategy to a workflow state.
 * Returns the updated state and the recovery result.
 */
export function applyRecovery(
  state: WorkflowState,
  event: ChaosEvent,
  strategy?: RecoveryStrategy,
): { state: WorkflowState; result: RecoveryResult } {
  const effectiveStrategy = strategy ?? event.suggestedStrategy;
  const coherenceBefore = state.coherence;
  const stepsAffected: string[] = [];
  let description = '';

  const step = state.steps.get(event.stepId);

  switch (effectiveStrategy) {
    case 'RESTART': {
      if (step) {
        step.status = 'PENDING';
        step.retryCount += 1;
        step.startedAt = undefined;
        step.lastError = undefined;
        stepsAffected.push(step.id);
        description = `Step "${step.name}" restarted (retry ${step.retryCount}).`;
      }
      state.coherence = Math.min(1, state.coherence + 0.1);
      break;
    }

    case 'REROUTE': {
      if (step) {
        step.status = 'SKIPPED';
        stepsAffected.push(step.id);
        description = `Step "${step.name}" skipped — rerouting workflow.`;
      }
      state.coherence = Math.min(1, state.coherence + 0.15);
      break;
    }

    case 'FALLBACK': {
      if (step) {
        step.status = 'COMPLETE';
        step.output = { fallback: true, reason: event.description };
        stepsAffected.push(step.id);
        description = `Step "${step.name}" resolved with fallback output.`;
      }
      state.coherence = Math.min(1, state.coherence + 0.2);
      break;
    }

    case 'REDUCE': {
      // Mark all non-critical pending steps as skipped
      for (const s of state.steps.values()) {
        if (s.status === 'PENDING' && s.dependencies.length === 0) {
          s.status = 'SKIPPED';
          stepsAffected.push(s.id);
        }
      }
      description = `Workflow reduced to critical path. ${stepsAffected.length} optional steps skipped.`;
      state.coherence = Math.min(1, state.coherence + 0.25);
      break;
    }

    case 'CHECKPOINT': {
      // Reset all failed and running steps to pending
      for (const s of state.steps.values()) {
        if (s.status === 'FAILED' || s.status === 'RUNNING') {
          s.status = 'PENDING';
          s.retryCount = 0;
          s.lastError = undefined;
          stepsAffected.push(s.id);
        }
      }
      description = `Rolled back to last stable checkpoint. ${stepsAffected.length} steps reset.`;
      state.coherence = 0.7; // Partial recovery
      break;
    }

    case 'ISOLATE': {
      if (step) {
        step.status = 'SKIPPED';
        // Also skip dependent steps
        for (const s of state.steps.values()) {
          if (s.dependencies.includes(step.id)) {
            s.status = 'SKIPPED';
            stepsAffected.push(s.id);
          }
        }
        stepsAffected.unshift(step.id);
        description = `Step "${step.name}" and ${stepsAffected.length - 1} dependents isolated.`;
      }
      state.coherence = Math.min(1, state.coherence + 0.1);
      break;
    }

    case 'HUMAN_ESCALATE': {
      description = `Workflow escalated to human review. Instability: ${event.instability}.`;
      stepsAffected.push(event.stepId);
      state.coherence = state.coherence; // No change — pending human
      break;
    }
  }

  state.lastHealthyAt = Date.now();
  state.beat += 1;

  return {
    state,
    result: {
      success: effectiveStrategy !== 'HUMAN_ESCALATE',
      strategy: effectiveStrategy,
      stepsAffected,
      coherenceBefore,
      coherenceAfter: state.coherence,
      description,
      timestamp: Date.now(),
    },
  };
}

// ─── ChaosMonitor ─────────────────────────────────────────────────────────────

/**
 * A lightweight chaos monitor that wraps a workflow and auto-recovers.
 */
export class ChaosMonitor {
  private history: WorkflowStep[][] = [];
  private events: ChaosEvent[] = [];

  constructor(
    private state: WorkflowState,
    private options: {
      autoRecover?: boolean;
      maxRecoveryAttempts?: number;
      onEvent?: (event: ChaosEvent) => void;
      onRecovery?: (result: RecoveryResult) => void;
    } = {},
  ) {
    this.options = {
      autoRecover: options.autoRecover ?? true,
      maxRecoveryAttempts: options.maxRecoveryAttempts ?? 3,
      ...options,
    };
  }

  /**
   * Run a health check. Detects instability and optionally recovers.
   */
  check(): ChaosEvent | null {
    // Take a snapshot for drift detection
    this.history.push(Array.from(this.state.steps.values()).map(s => ({ ...s })));
    if (this.history.length > 10) this.history.shift();

    const event = detectInstability(this.state, this.history);

    if (!event) {
      this.state.coherence = Math.min(1, this.state.coherence + 0.01);
      return null;
    }

    this.events.push(event);
    this.options.onEvent?.(event);

    if (this.options.autoRecover) {
      this.recover(event);
    }

    return event;
  }

  /**
   * Manually trigger recovery for an event.
   */
  recover(event: ChaosEvent, strategy?: RecoveryStrategy): RecoveryResult {
    const { state, result } = applyRecovery(this.state, event, strategy);
    this.state = state;
    this.options.onRecovery?.(result);
    return result;
  }

  /**
   * Get all chaos events recorded.
   */
  getEvents(): ChaosEvent[] {
    return [...this.events];
  }

  /**
   * Get the current workflow state.
   */
  getState(): WorkflowState {
    return this.state;
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Create a new workflow state.
 */
export function createWorkflow(
  id: string,
  steps: Omit<WorkflowStep, 'status' | 'retryCount'>[],
): WorkflowState {
  const stepMap = new Map<string, WorkflowStep>();

  for (const s of steps) {
    stepMap.set(s.id, {
      ...s,
      status: 'PENDING',
      retryCount: 0,
    });
  }

  return {
    id,
    steps: stepMap,
    startedAt: Date.now(),
    lastHealthyAt: Date.now(),
    coherence: 1.0,
    beat: 0,
  };
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export default {
  detectInstability,
  findNearestAttractor,
  applyRecovery,
  createWorkflow,
  ChaosMonitor,
  ATTRACTOR_BASINS,
};
