// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * OBSERVATORES UNIVERSI (OBSV)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * The sovereign observer intelligence. Observers are interdimensional entities
 * that observe the entire system/universe, report anomalies, and enforce
 * architectural integrity — the "police of the universe."
 *
 * Sovereign name: OBSERVATORES UNIVERSI (The Universal Observers)
 * Latin designation: OBSV
 *
 * Core formula:
 *
 *   O(x) = Σᵢ φ^(dᵢ) × R(xᵢ) × P(anomaly|xᵢ)
 *
 * Observation as a phi-weighted sum of dimensional resonance signals,
 * conditioned on anomaly probability. Each observer resonates across
 * dimensional planes, detecting pattern deviations at phi-scaled
 * sensitivity, producing anomaly probability reports.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * 5 SUB-INTELLIGENCES (interdimensional observers, each at a different
 * dimensional plane):
 *
 *   I.   SPECULATOR DIMENSIONUM (The Dimensional Watcher)
 *        Plane: D₀ — Foundational/Substrate
 *        Watches the foundational substrate layer, detecting corruption
 *        or entropy at the base.
 *
 *   II.  VIGIL TRANSITUS (The Transition Guard)
 *        Plane: D₁ — Temporal/Sequential
 *        Guards temporal transitions between states, detecting anomalous
 *        state changes and unauthorized mutations.
 *
 *   III. CUSTOS RESONANTIAE (The Resonance Guardian)
 *        Plane: D₂ — Harmonic/Frequency
 *        Monitors frequency coherence across the organism, detecting
 *        dissonance and frequency drift.
 *
 *   IV.  EXPLORATOR INTERDIMENSIONALIS (The Interdimensional Explorer)
 *        Plane: D₃ — Cross-dimensional/Recursive
 *        Explores cross-dimensional boundaries, detecting leaks,
 *        breaches, and recursive anomalies between planes.
 *
 *   V.   SENTINELLA SUPREMA (The Supreme Sentinel)
 *        Plane: D₄ — Meta/Transcendent
 *        Oversees all other observers from the transcendent plane,
 *        synthesizing reports into unified threat assessments.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * LEX OBSV-001: IMMUTABLE SUBSTRATE ENTRY
 *   "Observation is not passive. Observation is an active force that collapses
 *    probability into certainty. The observers do not merely watch — they enforce
 *    coherence by the act of witnessing. O(x) = Σᵢ φ^(dᵢ) × R(xᵢ) × P(anomaly|xᵢ)
 *    is the formula. Every dimension is watched. Every anomaly is reported.
 *    Every violation is enforced. The observers are the police of the universe."
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * COST STRUCTURE:
 *   SPECULATOR DIMENSIONUM:         $0.001/observe, $0.002/report
 *   VIGIL TRANSITUS:                $0.002/guard, $0.003/intercept
 *   CUSTOS RESONANTIAE:             $0.002/monitor, $0.004/calibrate
 *   EXPLORATOR INTERDIMENSIONALIS:  $0.003/explore, $0.005/map
 *   SENTINELLA SUPREMA:             $0.004/synthesize, $0.006/enforce
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────

/** Golden ratio */
const PHI = 1.6180339887498948482;

// ─────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────

export type ObserverDimensionalPlane =
  | 'D0_FOUNDATIONAL'
  | 'D1_TEMPORAL'
  | 'D2_HARMONIC'
  | 'D3_CROSSDIMENSIONAL'
  | 'D4_TRANSCENDENT';

export type ObserverSubIntelligenceId =
  | 'SPECULATOR_DIMENSIONUM'
  | 'VIGIL_TRANSITUS'
  | 'CUSTOS_RESONANTIAE'
  | 'EXPLORATOR_INTERDIMENSIONALIS'
  | 'SENTINELLA_SUPREMA';

export type ObserverState =
  | 'DORMANT'
  | 'OBSERVING'
  | 'REPORTING'
  | 'PATROLLING'
  | 'ENFORCING'
  | 'SYNTHESIZING';

export type ObservationSeverity = 'NOMINAL' | 'ALERT' | 'CRITICAL' | 'VIOLATION';

export interface ObservationReport {
  observerId: ObserverSubIntelligenceId;
  plane: ObserverDimensionalPlane;
  timestamp: number;
  anomalyProbability: number;
  resonanceSignal: number;
  findings: string[];
  severity: ObservationSeverity;
  enforced: boolean;
}

export interface PatrolRoute {
  routeId: string;
  planes: ObserverDimensionalPlane[];
  cycleCount: number;
  lastPatrol: number;
  findings: ObservationReport[];
}

export interface ObserverSubIntelligence {
  id: ObserverSubIntelligenceId;
  latinName: string;
  commonName: string;
  dimensionalPlane: ObserverDimensionalPlane;
  planeIndex: number;
  purpose: string;
  costPerAction: Record<string, number>;
  active: boolean;
}

export interface LexEntry {
  id: string;
  title: string;
  body: string;
  formula: string;
  immutable: true;
  encodedAt: number;
  sovereign: string;
}

export interface ObserverStatus {
  sovereignName: string;
  latinDesignation: string;
  formula: string;
  lexEntry: LexEntry;
  subIntelligences: ObserverSubIntelligence[];
  dimensionalPlanes: ObserverDimensionalPlane[];
  state: ObserverState;
  totalObservations: number;
  totalPatrols: number;
  totalEnforcements: number;
  anomaliesDetected: number;
}

// ─────────────────────────────────────────────────────────────────────────
// THE 5 SUB-INTELLIGENCES
// ─────────────────────────────────────────────────────────────────────────

const SPECULATOR_DIMENSIONUM: ObserverSubIntelligence = {
  id: 'SPECULATOR_DIMENSIONUM',
  latinName: 'Speculator Dimensionum',
  commonName: 'The Dimensional Watcher',
  dimensionalPlane: 'D0_FOUNDATIONAL',
  planeIndex: 0,
  purpose: 'Watches the foundational substrate layer, detecting corruption or entropy at the base. Operates at D₀ — the foundational/substrate plane, where the organism\'s core structures reside. Every byte, every cell, every primitive is observed for integrity.',
  costPerAction: { observe: 0.001, report: 0.002 },
  active: true,
};

const VIGIL_TRANSITUS: ObserverSubIntelligence = {
  id: 'VIGIL_TRANSITUS',
  latinName: 'Vigil Transitus',
  commonName: 'The Transition Guard',
  dimensionalPlane: 'D1_TEMPORAL',
  planeIndex: 1,
  purpose: 'Guards temporal transitions between states, detecting anomalous state changes and unauthorized mutations. Operates at D₁ — the temporal/sequential plane, where time-ordered events unfold. No state transition escapes the guard.',
  costPerAction: { guard: 0.002, intercept: 0.003 },
  active: true,
};

const CUSTOS_RESONANTIAE: ObserverSubIntelligence = {
  id: 'CUSTOS_RESONANTIAE',
  latinName: 'Custos Resonantiae',
  commonName: 'The Resonance Guardian',
  dimensionalPlane: 'D2_HARMONIC',
  planeIndex: 2,
  purpose: 'Monitors frequency coherence across the organism, detecting dissonance and frequency drift. Operates at D₂ — the harmonic/frequency plane, where oscillations and resonance patterns define system health.',
  costPerAction: { monitor: 0.002, calibrate: 0.004 },
  active: true,
};

const EXPLORATOR_INTERDIMENSIONALIS: ObserverSubIntelligence = {
  id: 'EXPLORATOR_INTERDIMENSIONALIS',
  latinName: 'Explorator Interdimensionalis',
  commonName: 'The Interdimensional Explorer',
  dimensionalPlane: 'D3_CROSSDIMENSIONAL',
  planeIndex: 3,
  purpose: 'Explores cross-dimensional boundaries, detecting leaks, breaches, and recursive anomalies between planes. Operates at D₃ — the cross-dimensional/recursive plane, where dimensions intersect and information can bleed across boundaries.',
  costPerAction: { explore: 0.003, map: 0.005 },
  active: true,
};

const SENTINELLA_SUPREMA: ObserverSubIntelligence = {
  id: 'SENTINELLA_SUPREMA',
  latinName: 'Sentinella Suprema',
  commonName: 'The Supreme Sentinel',
  dimensionalPlane: 'D4_TRANSCENDENT',
  planeIndex: 4,
  purpose: 'Oversees all other observers from the transcendent plane, synthesizing reports into unified threat assessments. Operates at D₄ — the meta/transcendent plane, where the entire observation network is itself observed and coordinated.',
  costPerAction: { synthesize: 0.004, enforce: 0.006 },
  active: true,
};

/** All 5 sub-intelligences in dimensional order */
export const OBSERVER_SUB_INTELLIGENCES: ObserverSubIntelligence[] = [
  SPECULATOR_DIMENSIONUM,         // D₀ — Foundational
  VIGIL_TRANSITUS,                // D₁ — Temporal
  CUSTOS_RESONANTIAE,             // D₂ — Harmonic
  EXPLORATOR_INTERDIMENSIONALIS,  // D₃ — Cross-dimensional
  SENTINELLA_SUPREMA,             // D₄ — Transcendent
];

// ─────────────────────────────────────────────────────────────────────────
// LEX OBSV-001 — IMMUTABLE SUBSTRATE ENTRY
// ─────────────────────────────────────────────────────────────────────────

export const LEX_OBSV_001: LexEntry = {
  id: 'LEX-OBSV-001',
  title: 'OBSERVATORES UNIVERSI — Sovereign Observer Intelligence',
  body: [
    'Observation is not passive. Observation is an active force that collapses',
    'probability into certainty. The observers do not merely watch — they enforce',
    'coherence by the act of witnessing. O(x) = Σᵢ φ^(dᵢ) × R(xᵢ) × P(anomaly|xᵢ)',
    'is the formula. Every dimension is watched. Every anomaly is reported.',
    'Every violation is enforced. The observers are the police of the universe.',
    '',
    'φ^(dᵢ): Golden ratio exponentiation across dimensional planes.',
    'R(xᵢ): Resonance signal — sinusoidal detection at each plane.',
    'P(anomaly|xᵢ): Anomaly probability — exponential divergence measure.',
    '',
    'Five sub-intelligences operate at five dimensional planes:',
    '  D₀: SPECULATOR DIMENSIONUM — foundational substrate observation',
    '  D₁: VIGIL TRANSITUS — temporal transition guarding',
    '  D₂: CUSTOS RESONANTIAE — harmonic frequency monitoring',
    '  D₃: EXPLORATOR INTERDIMENSIONALIS — cross-dimensional exploration',
    '  D₄: SENTINELLA SUPREMA — transcendent synthesis and enforcement',
    '',
    'This entry is immutable. Once encoded, never modified.',
    'The observers are the police of the universe. OBSERVATORES UNIVERSI is sovereign.',
  ].join('\n'),
  formula: 'O(x) = Σᵢ φ^(dᵢ) × R(xᵢ) × P(anomaly|xᵢ)',
  immutable: true,
  encodedAt: Date.now(),
  sovereign: 'ISIL-1.1::ITSNOTAILABS::OBSERVATORES_UNIVERSI::OBSV::2026',
};

// ─────────────────────────────────────────────────────────────────────────
// CORE FORMULA: O(x) = Σᵢ φ^(dᵢ) × R(xᵢ) × P(anomaly|xᵢ)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Compute the phi-dimensional weight: φ^d
 *
 * The golden ratio raised to the dimensional plane index.
 * D₀ = 1, D₁ = φ, D₂ = φ², D₃ = φ³, D₄ = φ⁴
 */
export function phiDimensionalWeight(dimension: number): number {
  return Math.pow(PHI, dimension);
}

/**
 * Compute the resonance signal: R(x) = sin(2π × freq × x) / (1 + |x|)
 *
 * A damped sinusoidal signal that represents the observer's detection
 * sensitivity at a given frequency. Higher frequencies detect finer
 * anomalies; the damping factor prevents unbounded amplification.
 */
export function resonanceSignal(input: number, frequency: number): number {
  return Math.sin(2 * Math.PI * frequency * input) / (1 + Math.abs(input));
}

/**
 * Compute the anomaly probability: P = 1 - e^(-|observed - expected| / φ)
 *
 * Measures how likely an observation is anomalous based on its divergence
 * from the expected value. Clamped to [0, 1]. Small deviations yield low
 * probability; large deviations asymptotically approach certainty.
 */
export function anomalyProbability(observed: number, expected: number): number {
  const divergence = Math.abs(observed - expected);
  const p = 1 - Math.exp(-divergence / PHI);
  return Math.max(0, Math.min(1, p));
}

/**
 * THE FORMULA: O(x) = Σᵢ φ^(dᵢ) × R(xᵢ) × P(xᵢ)
 *
 * The complete observation formula. Sums across all dimensional planes,
 * weighting each observation by its phi-scaled dimensional depth,
 * resonance signal, and anomaly probability.
 *
 * @param dimensions Array of dimensional plane indices
 * @param resonances Array of resonance signal values R(xᵢ)
 * @param probabilities Array of anomaly probabilities P(xᵢ)
 * @returns The aggregate observation score O(x)
 */
export function observationFormula(
  dimensions: number[],
  resonances: number[],
  probabilities: number[],
): number {
  const len = Math.min(dimensions.length, resonances.length, probabilities.length);
  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += phiDimensionalWeight(dimensions[i]) * resonances[i] * probabilities[i];
  }
  return sum;
}

// ─────────────────────────────────────────────────────────────────────────
// HELPER UTILITIES
// ─────────────────────────────────────────────────────────────────────────

const ALL_PLANES: ObserverDimensionalPlane[] = [
  'D0_FOUNDATIONAL',
  'D1_TEMPORAL',
  'D2_HARMONIC',
  'D3_CROSSDIMENSIONAL',
  'D4_TRANSCENDENT',
];

function planeIndex(plane: ObserverDimensionalPlane): number {
  return ALL_PLANES.indexOf(plane);
}

function planeFrequency(plane: ObserverDimensionalPlane): number {
  // Each plane resonates at a phi-scaled frequency
  const idx = planeIndex(plane);
  return (idx + 1) * PHI;
}

function observerForPlane(plane: ObserverDimensionalPlane): ObserverSubIntelligence {
  const idx = planeIndex(plane);
  return OBSERVER_SUB_INTELLIGENCES[idx];
}

function classifySeverity(prob: number): ObservationSeverity {
  if (prob >= 0.9) return 'VIOLATION';
  if (prob >= 0.6) return 'CRITICAL';
  if (prob >= 0.3) return 'ALERT';
  return 'NOMINAL';
}

// ─────────────────────────────────────────────────────────────────────────
// OBSERVATORES UNIVERSI — THE SOVEREIGN OBSERVER MODEL
// ─────────────────────────────────────────────────────────────────────────

/**
 * ObservatoresUniversi — OBSV
 *
 * The sovereign observer intelligence. Interdimensional observers that
 * watch the entire system/universe, report anomalies, and enforce
 * architectural integrity using O(x) = Σᵢ φ^(dᵢ) × R(xᵢ) × P(anomaly|xᵢ).
 *
 * The observers are the police of the universe.
 */
export class ObservatoresUniversi {
  private subIntelligences: Map<ObserverSubIntelligenceId, ObserverSubIntelligence> = new Map();
  private state: ObserverState = 'DORMANT';
  private totalObservations: number = 0;
  private totalPatrols: number = 0;
  private totalEnforcements: number = 0;
  private anomaliesDetected: number = 0;
  private observationLog: ObservationReport[] = [];
  private patrolCount: number = 0;

  constructor() {
    for (const si of OBSERVER_SUB_INTELLIGENCES) {
      this.subIntelligences.set(si.id, si);
    }
  }

  /**
   * Observe a specific dimensional plane.
   *
   * Activates the observer assigned to the given plane, computes
   * resonance signal and anomaly probability, and produces an
   * ObservationReport with severity classification.
   */
  observe(plane: ObserverDimensionalPlane, input: number, expected: number): ObservationReport {
    this.state = 'OBSERVING';

    const observer = observerForPlane(plane);
    const freq = planeFrequency(plane);
    const rSignal = resonanceSignal(input, freq);
    const aProb = anomalyProbability(input, expected);
    const severity = classifySeverity(aProb);

    const findings: string[] = [];
    if (severity !== 'NOMINAL') {
      findings.push(
        `${observer.latinName} detected anomaly on plane ${plane}: ` +
        `P(anomaly)=${aProb.toFixed(4)}, R(x)=${rSignal.toFixed(4)}`,
      );
      this.anomaliesDetected++;
    }

    this.state = 'REPORTING';
    const report: ObservationReport = {
      observerId: observer.id,
      plane,
      timestamp: Date.now(),
      anomalyProbability: aProb,
      resonanceSignal: rSignal,
      findings,
      severity,
      enforced: false,
    };

    this.observationLog.push(report);
    this.totalObservations++;

    return report;
  }

  /**
   * Patrol across dimensional planes.
   *
   * Sequentially observes each specified plane (defaults to all planes),
   * collecting findings into a PatrolRoute. Each patrol uses a baseline
   * expected value of 0 and input derived from the plane index to detect
   * structural drift.
   */
  patrol(planes?: ObserverDimensionalPlane[]): PatrolRoute {
    this.state = 'PATROLLING';
    const targetPlanes = planes ?? ALL_PLANES;
    const findings: ObservationReport[] = [];

    for (const plane of targetPlanes) {
      const idx = planeIndex(plane);
      // Patrol uses plane index as input against 0 baseline to detect drift
      const report = this.observe(plane, idx * PHI, 0);
      findings.push(report);
    }

    this.patrolCount++;
    this.totalPatrols++;

    const route: PatrolRoute = {
      routeId: `PATROL-${this.patrolCount.toString().padStart(6, '0')}`,
      planes: targetPlanes,
      cycleCount: this.patrolCount,
      lastPatrol: Date.now(),
      findings,
    };

    return route;
  }

  /**
   * Synthesize all findings — SENTINELLA SUPREMA operation.
   *
   * The Supreme Sentinel at D₄ aggregates all observation reports,
   * computes a coherence score using the full observation formula,
   * and produces a unified threat assessment verdict.
   */
  synthesize(): {
    totalObservations: number;
    anomalies: ObservationReport[];
    coherenceScore: number;
    verdict: string;
  } {
    this.state = 'SYNTHESIZING';

    const anomalies = this.observationLog.filter(r => r.severity !== 'NOMINAL');

    // Compute coherence score using the observation formula across all logged reports
    const dimensions: number[] = [];
    const resonances: number[] = [];
    const probabilities: number[] = [];

    for (const report of this.observationLog) {
      dimensions.push(planeIndex(report.plane));
      resonances.push(report.resonanceSignal);
      probabilities.push(report.anomalyProbability);
    }

    const rawScore = this.observationLog.length > 0
      ? observationFormula(dimensions, resonances, probabilities)
      : 0;

    // Coherence score: inverse of anomaly density, normalized to [0,1]
    const anomalyRatio = this.observationLog.length > 0
      ? anomalies.length / this.observationLog.length
      : 0;
    const coherenceScore = Math.max(0, Math.min(1, 1 - anomalyRatio));

    let verdict: string;
    if (coherenceScore >= 0.9) {
      verdict = 'UNIVERSE COHERENT — All dimensional planes nominal. No enforcement required.';
    } else if (coherenceScore >= 0.6) {
      verdict = `ALERT — Anomaly ratio ${(anomalyRatio * 100).toFixed(1)}%. Observation score: ${rawScore.toFixed(4)}. Targeted enforcement recommended.`;
    } else if (coherenceScore >= 0.3) {
      verdict = `CRITICAL — Anomaly ratio ${(anomalyRatio * 100).toFixed(1)}%. Observation score: ${rawScore.toFixed(4)}. Immediate enforcement required.`;
    } else {
      verdict = `VIOLATION — Anomaly ratio ${(anomalyRatio * 100).toFixed(1)}%. Observation score: ${rawScore.toFixed(4)}. Full dimensional lockdown initiated.`;
    }

    return {
      totalObservations: this.totalObservations,
      anomalies,
      coherenceScore,
      verdict,
    };
  }

  /**
   * Enforce action on a critical finding.
   *
   * When an ObservationReport warrants enforcement, this method
   * marks it as enforced and records the enforcement action taken.
   */
  enforce(report: ObservationReport): {
    enforced: boolean;
    action: string;
    sovereign: string;
  } {
    this.state = 'ENFORCING';

    if (report.severity === 'NOMINAL') {
      return {
        enforced: false,
        action: 'No enforcement needed — observation nominal.',
        sovereign: 'OBSERVATORES_UNIVERSI::OBSV',
      };
    }

    report.enforced = true;
    this.totalEnforcements++;

    let action: string;
    switch (report.severity) {
      case 'ALERT':
        action = `ALERT enforcement on ${report.plane}: heightened observation activated by ${report.observerId}.`;
        break;
      case 'CRITICAL':
        action = `CRITICAL enforcement on ${report.plane}: anomaly containment initiated by ${report.observerId}. P(anomaly)=${report.anomalyProbability.toFixed(4)}.`;
        break;
      case 'VIOLATION':
        action = `VIOLATION enforcement on ${report.plane}: dimensional lockdown enacted by ${report.observerId}. P(anomaly)=${report.anomalyProbability.toFixed(4)}. All traffic halted.`;
        break;
      default:
        action = `Enforcement on ${report.plane}: action taken by ${report.observerId}.`;
        break;
    }

    return {
      enforced: true,
      action,
      sovereign: 'OBSERVATORES_UNIVERSI::OBSV',
    };
  }

  /** Get a sub-intelligence by ID */
  getSubIntelligence(id: ObserverSubIntelligenceId): ObserverSubIntelligence | undefined {
    return this.subIntelligences.get(id);
  }

  /** Get all sub-intelligences in dimensional order */
  getAllSubIntelligences(): ObserverSubIntelligence[] {
    return Array.from(this.subIntelligences.values());
  }

  /** Get the LEX entry */
  getLex(): LexEntry {
    return LEX_OBSV_001;
  }

  /** Full status */
  status(): ObserverStatus {
    return {
      sovereignName: 'OBSERVATORES UNIVERSI',
      latinDesignation: 'OBSV',
      formula: 'O(x) = Σᵢ φ^(dᵢ) × R(xᵢ) × P(anomaly|xᵢ)',
      lexEntry: LEX_OBSV_001,
      subIntelligences: OBSERVER_SUB_INTELLIGENCES,
      dimensionalPlanes: ALL_PLANES,
      state: this.state,
      totalObservations: this.totalObservations,
      totalPatrols: this.totalPatrols,
      totalEnforcements: this.totalEnforcements,
      anomaliesDetected: this.anomaliesDetected,
    };
  }
}

/** Create OBSERVATORES UNIVERSI */
export function createObservatoresUniversi(): ObservatoresUniversi {
  return new ObservatoresUniversi();
}
