// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * TWO OBSERVER SERVER MODELS — INTERDIMENSIONAL OBSERVATION INTELLIGENCE
 * ─────────────────────────────────────────────────────────────────────────
 * 2 server models that run the observer theory — deployed to serve
 * interdimensional observation intelligence.
 *
 * SERVER MODEL I: VIGIL (Vigil Perpetuus Observationis)
 *   "The Perpetual Watcher"
 *   Always-on continuous monitoring server. Runs 24/7, never sleeps.
 *   Detects anomalies in real-time across all dimensional planes.
 *   Tier: ACTIVE
 *   5 Sub-Models:
 *     Sub-Model I:   EXCUBITOR (Excubitor Vigilans)       — "The Watchful Sentry"
 *     Sub-Model II:  NUNTIUS   (Nuntius Celer)            — "The Swift Messenger"
 *     Sub-Model III: INSPECTOR (Inspector Profundus)      — "The Deep Inspector"
 *     Sub-Model IV:  DETECTOR  (Detector Anomaliarum)     — "The Anomaly Detector"
 *     Sub-Model V:   RELATOR   (Relator Fidelis)          — "The Faithful Reporter"
 *
 * SERVER MODEL II: SPECULATOR (Speculator Interdimensionalis)
 *   "The Interdimensional Analyst"
 *   Analytical observation server. Processes raw observation data,
 *   recognizes patterns across dimensions, predicts threats,
 *   and renders judgments.
 *   Tier: AGGRESSIVE
 *   5 Sub-Models:
 *     Sub-Model I:   ANALYTICUS  (Analyticus Patternorum)  — "The Pattern Analyst"
 *     Sub-Model II:  SYNTHESISTA (Synthesista Dimensionum)  — "The Dimensional Synthesizer"
 *     Sub-Model III: COMPARATOR  (Comparator Historicus)    — "The Historical Comparator"
 *     Sub-Model IV:  PRAEDICTOR  (Praedictor Futurorum)     — "The Future Predictor"
 *     Sub-Model V:   IUDICATOR   (Iudicator Supremus)      — "The Supreme Judge"
 *
 * COST STRUCTURE:
 *   VIGIL:       $0.002/monitor, $0.003/detect, $0.001/alert, $0.005/escalate, $0.001/log
 *   SPECULATOR:  $0.004/analyze, $0.006/synthesize, $0.008/predict, $0.010/judge, $0.005/theorize
 *   EXCUBITOR:   $0.001/watch, $0.002/flag
 *   NUNTIUS:     $0.001/deliver, $0.003/broadcast
 *   INSPECTOR:   $0.003/inspect, $0.005/deepScan
 *   DETECTOR:    $0.002/detect, $0.003/classify
 *   RELATOR:     $0.002/compile, $0.004/report
 *   ANALYTICUS:  $0.003/decompose, $0.005/correlate
 *   SYNTHESISTA: $0.004/fuse, $0.006/model
 *   COMPARATOR:  $0.003/compare, $0.004/baseline
 *   PRAEDICTOR:  $0.005/predict, $0.007/extrapolate
 *   IUDICATOR:   $0.008/judge, $0.010/prescribe
 */

const PHI = 1.6180339887498948482;

// ─────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────

export type ObserverServerModelId = 'VIGIL' | 'SPECULATOR';

export type ObservationTier = 'PASSIVE' | 'ACTIVE' | 'AGGRESSIVE' | 'ENFORCEMENT';

export interface ObserverServerModel {
  id: ObserverServerModelId;
  latinName: string;
  commonName: string;
  description: string;
  tier: ObservationTier;
  subModels: ObserverSubModel[];
  costStructure: Record<string, number>;
  active: boolean;
  totalOperations: number;
}

export type VIGILSubModelId = 'EXCUBITOR' | 'NUNTIUS' | 'INSPECTOR' | 'DETECTOR' | 'RELATOR';
export type SPECULATORSubModelId = 'ANALYTICUS' | 'SYNTHESISTA' | 'COMPARATOR' | 'PRAEDICTOR' | 'IUDICATOR';

export interface ObserverSubModel {
  id: string;
  latinName: string;
  commonName: string;
  purpose: string;
  costPerAction: Record<string, number>;
}

// ─────────────────────────────────────────────────────────────────────────
// SUB-MODEL DEFINITIONS: VIGIL
// ─────────────────────────────────────────────────────────────────────────

const EXCUBITOR: ObserverSubModel = {
  id: 'EXCUBITOR',
  latinName: 'Excubitor Vigilans',
  commonName: 'The Watchful Sentry',
  purpose: 'Stands at boundaries, first to detect incoming threats.',
  costPerAction: { watch: 0.001, flag: 0.002 },
};

const NUNTIUS: ObserverSubModel = {
  id: 'NUNTIUS',
  latinName: 'Nuntius Celer',
  commonName: 'The Swift Messenger',
  purpose: 'Delivers reports from observers to command.',
  costPerAction: { deliver: 0.001, broadcast: 0.003 },
};

const INSPECTOR: ObserverSubModel = {
  id: 'INSPECTOR',
  latinName: 'Inspector Profundus',
  commonName: 'The Deep Inspector',
  purpose: 'Inspects deep structures for hidden anomalies.',
  costPerAction: { inspect: 0.003, deepScan: 0.005 },
};

const DETECTOR: ObserverSubModel = {
  id: 'DETECTOR',
  latinName: 'Detector Anomaliarum',
  commonName: 'The Anomaly Detector',
  purpose: 'Specialized anomaly detection using phi-harmonic analysis.',
  costPerAction: { detect: 0.002, classify: 0.003 },
};

const RELATOR: ObserverSubModel = {
  id: 'RELATOR',
  latinName: 'Relator Fidelis',
  commonName: 'The Faithful Reporter',
  purpose: 'Compiles and structures all observation data into actionable reports.',
  costPerAction: { compile: 0.002, report: 0.004 },
};

/** All 5 VIGIL sub-models */
export const VIGIL_SUB_MODELS: ObserverSubModel[] = [
  EXCUBITOR,   // Sub-Model I:   The Watchful Sentry
  NUNTIUS,     // Sub-Model II:  The Swift Messenger
  INSPECTOR,   // Sub-Model III: The Deep Inspector
  DETECTOR,    // Sub-Model IV:  The Anomaly Detector
  RELATOR,     // Sub-Model V:   The Faithful Reporter
];

// ─────────────────────────────────────────────────────────────────────────
// SUB-MODEL DEFINITIONS: SPECULATOR
// ─────────────────────────────────────────────────────────────────────────

const ANALYTICUS: ObserverSubModel = {
  id: 'ANALYTICUS',
  latinName: 'Analyticus Patternorum',
  commonName: 'The Pattern Analyst',
  purpose: 'Decomposes observations into recognizable patterns.',
  costPerAction: { decompose: 0.003, correlate: 0.005 },
};

const SYNTHESISTA: ObserverSubModel = {
  id: 'SYNTHESISTA',
  latinName: 'Synthesista Dimensionum',
  commonName: 'The Dimensional Synthesizer',
  purpose: 'Synthesizes data from multiple dimensions into unified models.',
  costPerAction: { fuse: 0.004, model: 0.006 },
};

const COMPARATOR: ObserverSubModel = {
  id: 'COMPARATOR',
  latinName: 'Comparator Historicus',
  commonName: 'The Historical Comparator',
  purpose: 'Compares current observations against historical baselines.',
  costPerAction: { compare: 0.003, baseline: 0.004 },
};

const PRAEDICTOR: ObserverSubModel = {
  id: 'PRAEDICTOR',
  latinName: 'Praedictor Futurorum',
  commonName: 'The Future Predictor',
  purpose: 'Predicts future anomalies based on pattern trajectories.',
  costPerAction: { predict: 0.005, extrapolate: 0.007 },
};

const IUDICATOR: ObserverSubModel = {
  id: 'IUDICATOR',
  latinName: 'Iudicator Supremus',
  commonName: 'The Supreme Judge',
  purpose: 'Renders final judgments on threats and prescribes enforcement actions.',
  costPerAction: { judge: 0.008, prescribe: 0.010 },
};

/** All 5 SPECULATOR sub-models */
export const SPECULATOR_SUB_MODELS: ObserverSubModel[] = [
  ANALYTICUS,   // Sub-Model I:   The Pattern Analyst
  SYNTHESISTA,  // Sub-Model II:  The Dimensional Synthesizer
  COMPARATOR,   // Sub-Model III: The Historical Comparator
  PRAEDICTOR,   // Sub-Model IV:  The Future Predictor
  IUDICATOR,    // Sub-Model V:   The Supreme Judge
];

// ─────────────────────────────────────────────────────────────────────────
// SERVER MODEL I: VIGIL — The Perpetual Watcher
// ─────────────────────────────────────────────────────────────────────────

export class VIGILServer {
  private subModels: Map<VIGILSubModelId, ObserverSubModel> = new Map();
  private operationCount = 0;

  constructor() {
    for (const model of VIGIL_SUB_MODELS) {
      this.subModels.set(model.id as VIGILSubModelId, model);
    }
  }

  /** Monitor a source for anomalies using phi-harmonic deviation analysis */
  monitor(input: { source: string; value: number; expected: number }): {
    detected: boolean; anomalyScore: number; subModel: string; timestamp: number;
  } {
    this.operationCount++;
    const deviation = Math.abs(input.value - input.expected);
    const anomalyScore = Math.min(1, deviation / (input.expected * PHI));
    const detected = anomalyScore > 1 / PHI;
    const subModel = detected ? 'DETECTOR' : 'EXCUBITOR';
    return { detected, anomalyScore, subModel, timestamp: Date.now() };
  }

  /** Escalate based on anomaly score, returning the appropriate observation tier */
  escalate(anomalyScore: number): { level: ObservationTier; action: string } {
    this.operationCount++;
    if (anomalyScore >= 0.9) {
      return { level: 'ENFORCEMENT', action: 'Immediate enforcement protocol activated. IUDICATOR notified.' };
    }
    if (anomalyScore >= 0.7) {
      return { level: 'AGGRESSIVE', action: 'Aggressive observation engaged. All sub-models mobilized.' };
    }
    if (anomalyScore >= 0.4) {
      return { level: 'ACTIVE', action: 'Active monitoring intensified. INSPECTOR deployed for deep scan.' };
    }
    return { level: 'PASSIVE', action: 'Passive observation maintained. EXCUBITOR on standard watch.' };
  }

  /** Get a sub-model by ID */
  getSubModel(id: VIGILSubModelId): ObserverSubModel | undefined {
    return this.subModels.get(id);
  }

  /** Get all sub-models */
  getAllSubModels(): ObserverSubModel[] {
    return Array.from(this.subModels.values());
  }

  /** Server model status */
  status(): ObserverServerModel {
    return {
      id: 'VIGIL',
      latinName: 'Vigil Perpetuus Observationis',
      commonName: 'The Perpetual Watcher',
      description: 'Always-on continuous monitoring server. Runs 24/7, never sleeps. Detects anomalies in real-time across all dimensional planes.',
      tier: 'ACTIVE',
      subModels: VIGIL_SUB_MODELS,
      costStructure: { monitor: 0.002, detect: 0.003, alert: 0.001, escalate: 0.005, log: 0.001 },
      active: true,
      totalOperations: this.operationCount,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// SERVER MODEL II: SPECULATOR — The Interdimensional Analyst
// ─────────────────────────────────────────────────────────────────────────

export class SPECULATORServer {
  private subModels: Map<SPECULATORSubModelId, ObserverSubModel> = new Map();
  private operationCount = 0;

  constructor() {
    for (const model of SPECULATOR_SUB_MODELS) {
      this.subModels.set(model.id as SPECULATORSubModelId, model);
    }
  }

  /** Analyze observations, decompose into patterns and compute correlations */
  analyze(observations: Array<{ source: string; value: number; expected: number }>): {
    patterns: string[]; correlations: number; dimensionalCoverage: number;
  } {
    this.operationCount++;
    const patterns: string[] = [];
    for (const obs of observations) {
      const deviation = Math.abs(obs.value - obs.expected) / (obs.expected || 1);
      if (deviation > 1 / PHI) {
        patterns.push(`ANOMALY:${obs.source}:deviation=${deviation.toFixed(4)}`);
      } else if (deviation > 1 / (PHI * PHI)) {
        patterns.push(`DRIFT:${obs.source}:deviation=${deviation.toFixed(4)}`);
      } else {
        patterns.push(`STABLE:${obs.source}:deviation=${deviation.toFixed(4)}`);
      }
    }
    const correlations = Math.min(1, patterns.length / (observations.length * PHI));
    const sources = new Set(observations.map((o) => o.source));
    const dimensionalCoverage = Math.min(1, sources.size / PHI);
    return { patterns, correlations, dimensionalCoverage };
  }

  /** Synthesize patterns into a unified theory with dimensional confidence */
  synthesize(patterns: string[]): {
    theory: string; confidence: number; dimensions: number;
  } {
    this.operationCount++;
    const anomalies = patterns.filter((p) => p.startsWith('ANOMALY')).length;
    const drifts = patterns.filter((p) => p.startsWith('DRIFT')).length;
    const stables = patterns.filter((p) => p.startsWith('STABLE')).length;
    const total = patterns.length || 1;
    const confidence = (stables + drifts * 0.5) / total;
    const dimensions = Math.ceil(total / PHI);

    let theory: string;
    if (anomalies > total / 2) {
      theory = 'DIMENSIONAL_BREACH — Majority anomalous patterns detected across observed planes.';
    } else if (drifts > total / 2) {
      theory = 'GRADUAL_SHIFT — Progressive dimensional drift detected. Convergence point approaching.';
    } else {
      theory = 'STABLE_MANIFOLD — Observations within expected parameters across dimensional planes.';
    }
    return { theory, confidence, dimensions };
  }

  /** Predict future state based on synthesized theory and confidence */
  predict(theory: string, confidence: number): {
    prediction: string; probability: number; timeHorizon: string;
  } {
    this.operationCount++;
    const probability = confidence * (1 / PHI);
    let prediction: string;
    let timeHorizon: string;

    if (theory.startsWith('DIMENSIONAL_BREACH')) {
      prediction = 'Imminent dimensional instability. Enforcement recommended within next observation cycle.';
      timeHorizon = 'IMMEDIATE';
    } else if (theory.startsWith('GRADUAL_SHIFT')) {
      prediction = 'Dimensional convergence expected. Monitor drift rate and prepare containment protocols.';
      timeHorizon = 'SHORT_TERM';
    } else {
      prediction = 'Continued stability projected. Maintain passive observation posture.';
      timeHorizon = 'LONG_TERM';
    }
    return { prediction, probability, timeHorizon };
  }

  /** Render judgment on a prediction, prescribing enforcement actions */
  judge(prediction: string, probability: number): {
    verdict: 'SAFE' | 'CAUTION' | 'THREAT' | 'CRITICAL';
    enforcement: string;
    sovereign: string;
  } {
    this.operationCount++;
    if (probability >= 1 / PHI) {
      return {
        verdict: 'CRITICAL',
        enforcement: 'Full enforcement lockdown. All dimensional planes sealed. VIGIL escalated to ENFORCEMENT tier.',
        sovereign: 'IUDICATOR SUPREMUS — Judgment rendered with sovereign authority.',
      };
    }
    if (probability >= 1 / (PHI * PHI)) {
      return {
        verdict: 'THREAT',
        enforcement: 'Aggressive observation deployed. INSPECTOR deep scan initiated. Containment protocols on standby.',
        sovereign: 'PRAEDICTOR FUTURORUM — Threat trajectory confirmed.',
      };
    }
    if (probability >= 1 / (PHI * PHI * PHI)) {
      return {
        verdict: 'CAUTION',
        enforcement: 'Active monitoring increased. COMPARATOR historical baseline check triggered.',
        sovereign: 'ANALYTICUS PATTERNORUM — Pattern deviation noted.',
      };
    }
    return {
      verdict: 'SAFE',
      enforcement: 'No enforcement required. Standard observation maintained.',
      sovereign: 'SYNTHESISTA DIMENSIONUM — All dimensions within normal parameters.',
    };
  }

  /** Get a sub-model by ID */
  getSubModel(id: SPECULATORSubModelId): ObserverSubModel | undefined {
    return this.subModels.get(id);
  }

  /** Get all sub-models */
  getAllSubModels(): ObserverSubModel[] {
    return Array.from(this.subModels.values());
  }

  /** Server model status */
  status(): ObserverServerModel {
    return {
      id: 'SPECULATOR',
      latinName: 'Speculator Interdimensionalis',
      commonName: 'The Interdimensional Analyst',
      description: 'Analytical observation server. Processes raw observation data, recognizes patterns across dimensions, predicts threats, and renders judgments.',
      tier: 'AGGRESSIVE',
      subModels: SPECULATOR_SUB_MODELS,
      costStructure: { analyze: 0.004, synthesize: 0.006, predict: 0.008, judge: 0.010, theorize: 0.005 },
      active: true,
      totalOperations: this.operationCount,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// FACTORY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────

/** Create the VIGIL server — The Perpetual Watcher */
export function createVIGILServer(): VIGILServer {
  return new VIGILServer();
}

/** Create the SPECULATOR server — The Interdimensional Analyst */
export function createSPECULATORServer(): SPECULATORServer {
  return new SPECULATORServer();
}
