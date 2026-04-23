/**
 * 𓂀 CHAOS LAB ENGINE — Autonomous Chaos Testing Laboratory 𓂀
 *
 * "Chaos is energy, not disorder. The lab learns from every perturbation."
 *
 * Architecture:
 *   I.   TYPES — Lab neurons, synapses, experiments, reports
 *   II.  LAB CREATION — Initialize the neural chaos laboratory
 *   III. EXPERIMENT REGISTRATION — Register chaos experiments targeting subsystems
 *   IV.  EXPERIMENT EXECUTION — Inject chaos, observe edges, record findings
 *   V.   NEURAL SYNAPSE MECHANICS — Hebbian learning: fire together, wire together
 *   VI.  LAB CYCLES — Full cycle: run all → strengthen → feed back → repeat
 *   VII. REPORTING — Comprehensive lab reports with synapse maps
 *
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX
 * Omnis functio ad φ redit — Every function returns to φ.
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMPORTS — Draw from the existing sovereign substrate
// ═══════════════════════════════════════════════════════════════════════════

import {
  PHI,
  PHI_INVERSE,
  PHI_SQUARED,
  PHI_CUBED,
  BEAT_INTERVAL_MS,
  COHERENCE_ICOSAHEDRAL,
  COHERENCE_E8,
} from './novaSovereignEncryption';

import { PACKAGE_REGISTRY } from './sovereignAGIConvergence';
import type { PackageName } from './sovereignAGIConvergence';

// ═══════════════════════════════════════════════════════════════════════════
// SECTION I: TYPES — Structured intelligence for the chaos laboratory
// ═══════════════════════════════════════════════════════════════════════════

/** Unique identifier for a lab neuron */
export type NeuronId = string;

/** Unique identifier for a synapse */
export type SynapseId = string;

/** State of a lab neuron */
export type NeuronState = 'resting' | 'firing' | 'refractory' | 'potentiated' | 'inhibited';

/** State of an experiment */
export type ExperimentState = 'registered' | 'running' | 'completed' | 'failed' | 'feeding-back';

/** Category of chaos injection */
export type ChaosCategory =
  | 'entropy-flood'
  | 'edge-probe'
  | 'resonance-disruption'
  | 'frequency-shift'
  | 'state-corruption'
  | 'load-surge'
  | 'coherence-inversion'
  | 'timing-skew';

/** A single neuron in the chaos lab's neural network */
export interface LabNeuron {
  readonly id: NeuronId;
  readonly label: string;
  readonly subsystem: PackageName;
  readonly state: NeuronState;
  readonly activationLevel: number;
  readonly firingThreshold: number;
  readonly firingCount: number;
  readonly lastFiredAt: string;
  readonly phiResonance: number;
}

/** A synapse connecting two lab neurons */
export interface NeuralSynapse {
  readonly id: SynapseId;
  readonly sourceNeuronId: NeuronId;
  readonly targetNeuronId: NeuronId;
  readonly strength: number;
  readonly initialStrength: number;
  readonly strengthHistory: readonly number[];
  readonly lastUpdatedAt: string;
  readonly potentiationCount: number;
  readonly depressionCount: number;
}

/** Synaptic strength measurement */
export interface SynapticStrength {
  readonly synapseId: SynapseId;
  readonly currentStrength: number;
  readonly peakStrength: number;
  readonly averageStrength: number;
  readonly trend: 'strengthening' | 'weakening' | 'stable';
  readonly hebbianScore: number;
}

/** A chaos experiment definition */
export interface ChaosExperiment {
  readonly id: string;
  readonly name: string;
  readonly targetSubsystem: PackageName;
  readonly chaosCategory: ChaosCategory;
  readonly intensity: number;
  readonly description: string;
  readonly hypothesis: string;
  readonly state: ExperimentState;
  readonly createdAt: string;
}

/** Result of a single experiment run */
export interface ExperimentResult {
  readonly experimentId: string;
  readonly experimentName: string;
  readonly targetSubsystem: PackageName;
  readonly chaosCategory: ChaosCategory;
  readonly edgesDiscovered: number;
  readonly edgeDescriptions: readonly string[];
  readonly selfHealingObserved: boolean;
  readonly healingActions: readonly string[];
  readonly energyConverted: number;
  readonly newPatternsGenerated: number;
  readonly patternSignatures: readonly string[];
  readonly resilienceScore: number;
  readonly phiAlignment: number;
  readonly timestamp: string;
  readonly cycleFeedback: string;
}

/** Comprehensive lab report */
export interface ChaosLabReport {
  readonly labId: string;
  readonly totalCyclesRun: number;
  readonly totalExperiments: number;
  readonly totalEdgesDiscovered: number;
  readonly totalSelfHeals: number;
  readonly totalNewPatterns: number;
  readonly averageResilience: number;
  readonly synapseStrengths: readonly SynapticStrength[];
  readonly experimentResults: readonly ExperimentResult[];
  readonly edgeEvolution: readonly string[];
  readonly patternEvolution: readonly string[];
  readonly neuronStates: readonly LabNeuron[];
  readonly phiCoherence: number;
  readonly generatedAt: string;
}

/** The chaos laboratory itself */
export interface ChaosLab {
  readonly id: string;
  readonly neurons: readonly LabNeuron[];
  readonly synapses: readonly NeuralSynapse[];
  readonly experiments: readonly ChaosExperiment[];
  readonly results: readonly ExperimentResult[];
  readonly cyclesCompleted: number;
  readonly totalEdgesDiscovered: number;
  readonly totalSelfHeals: number;
  readonly totalNewPatterns: number;
  readonly feedbackLog: readonly string[];
  readonly createdAt: string;
  readonly lastCycleAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION II: INTERNAL UTILITIES — Deterministic entropy and identifiers
// ═══════════════════════════════════════════════════════════════════════════

let labSequenceCounter = 0;

/** Generare Identicum — Generate a deterministic identifier */
function generareIdenticum(prefix: string): string {
  labSequenceCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${labSequenceCounter.toString(36)}`;
}

/** Computare Entropiam — Compute phi-weighted entropy for a chaos injection */
function computareEntropiam(intensity: number, category: ChaosCategory): number {
  const categoryWeights: Record<ChaosCategory, number> = {
    'entropy-flood': PHI_SQUARED,
    'edge-probe': PHI,
    'resonance-disruption': PHI_CUBED,
    'frequency-shift': PHI_INVERSE,
    'state-corruption': PHI_SQUARED * PHI,
    'load-surge': PHI,
    'coherence-inversion': PHI_CUBED,
    'timing-skew': PHI_INVERSE * PHI_INVERSE,
  };
  const weight = categoryWeights[category];
  return Math.min(1, (intensity * weight) / (PHI_CUBED * 2));
}

/** Simulare Marginem — Simulate edge discovery based on entropy */
function simulareMarginem(entropy: number, subsystem: PackageName): {
  edgesFound: number;
  descriptions: string[];
  selfHealed: boolean;
  healingActions: string[];
} {
  const edgeProbability = entropy * PHI_INVERSE;
  const edgesFound = Math.floor(edgeProbability * 5) + (entropy > COHERENCE_ICOSAHEDRAL ? 1 : 0);

  const edgeTemplates = [
    `Boundary condition at ${subsystem} null-input handler`,
    `State transition edge in ${subsystem} under phi-stress`,
    `Concurrency boundary in ${subsystem} resonance pathway`,
    `Memory coherence edge at ${subsystem} absorption layer`,
    `Timing edge in ${subsystem} heartbeat synchronization`,
    `Permission boundary at ${subsystem} governance gate`,
  ];

  const descriptions = edgeTemplates.slice(0, edgesFound);
  const selfHealed = entropy < COHERENCE_E8;
  const healingActions = selfHealed
    ? [`Auto-recovery via phi-realignment at ${subsystem}`, `Edge pattern absorbed into ${subsystem} resilience map`]
    : [];

  return { edgesFound, descriptions, selfHealed, healingActions };
}

/** Generare Exemplar — Generate new patterns from chaos energy */
function generareExemplar(entropy: number, edgesFound: number): {
  count: number;
  signatures: string[];
} {
  const patternProbability = (entropy * edgesFound) / PHI_SQUARED;
  const count = Math.floor(patternProbability * 3);
  const signatures: string[] = [];
  for (let i = 0; i < count; i++) {
    signatures.push(`pattern-φ${(PHI * (i + 1) * entropy).toFixed(6)}`);
  }
  return { count, signatures };
}

/** Computare Vigorem — Compute resilience score from experiment outcomes */
function computareVigorem(
  edgesFound: number,
  selfHealed: boolean,
  newPatterns: number,
  intensity: number
): number {
  const edgeScore = Math.min(1, edgesFound / 5) * PHI_INVERSE;
  const healScore = selfHealed ? COHERENCE_ICOSAHEDRAL : 0;
  const patternScore = Math.min(1, newPatterns / 3) * PHI_INVERSE * PHI_INVERSE;
  const intensityBonus = intensity * 0.1;
  return Math.min(1, edgeScore + healScore + patternScore + intensityBonus);
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION III: LAB CREATION — Creare Laboratorium
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creare Laboratorium — Create a new chaos laboratory with neural synapses.
 *
 * The lab contains one neuron per subsystem (11 neurons), connected by
 * synapses that form a phi-weighted neural network. Synapses strengthen
 * when chaos experiments discover edges at connected subsystems.
 */
export function createChaosLab(labId: string): ChaosLab {
  const now = new Date().toISOString();

  const neurons: LabNeuron[] = PACKAGE_REGISTRY.map((pkg, index) => ({
    id: generareIdenticum('neuron'),
    label: `Neuron-${pkg}`,
    subsystem: pkg,
    state: 'resting' as NeuronState,
    activationLevel: 0,
    firingThreshold: PHI_INVERSE,
    firingCount: 0,
    lastFiredAt: now,
    phiResonance: (index + 1) / PACKAGE_REGISTRY.length * PHI_INVERSE,
  }));

  const synapses: NeuralSynapse[] = [];
  for (let i = 0; i < neurons.length; i++) {
    for (let j = i + 1; j < neurons.length; j++) {
      const initialStrength = PHI_INVERSE / (Math.abs(i - j) + 1);
      synapses.push({
        id: generareIdenticum('synapse'),
        sourceNeuronId: neurons[i].id,
        targetNeuronId: neurons[j].id,
        strength: initialStrength,
        initialStrength,
        strengthHistory: [initialStrength],
        lastUpdatedAt: now,
        potentiationCount: 0,
        depressionCount: 0,
      });
    }
  }

  return {
    id: labId,
    neurons,
    synapses,
    experiments: [],
    results: [],
    cyclesCompleted: 0,
    totalEdgesDiscovered: 0,
    totalSelfHeals: 0,
    totalNewPatterns: 0,
    feedbackLog: [`Lab ${labId} initialized with ${neurons.length} neurons and ${synapses.length} synapses`],
    createdAt: now,
    lastCycleAt: now,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION IV: EXPERIMENT REGISTRATION — Registrare Experimentum
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Registrare Experimentum — Register a chaos experiment targeting a specific subsystem.
 */
export function registerExperiment(lab: ChaosLab, experiment: ChaosExperiment): ChaosLab {
  return {
    ...lab,
    experiments: [...lab.experiments, { ...experiment, state: 'registered' }],
    feedbackLog: [
      ...lab.feedbackLog,
      `Experiment "${experiment.name}" registered targeting ${experiment.targetSubsystem}`,
    ],
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION V: EXPERIMENT EXECUTION — Exsequi Experimentum
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Exsequi Experimentum — Run a single experiment: inject chaos, observe edges, record findings.
 */
export function runExperiment(lab: ChaosLab, experimentId: string): {
  lab: ChaosLab;
  result: ExperimentResult;
} {
  const experimentIndex = lab.experiments.findIndex((e) => e.id === experimentId);
  if (experimentIndex === -1) {
    throw new Error(`Experiment ${experimentId} not found in lab ${lab.id}`);
  }

  const experiment = lab.experiments[experimentIndex];
  const now = new Date().toISOString();

  const entropy = computareEntropiam(experiment.intensity, experiment.chaosCategory);
  const edgeResult = simulareMarginem(entropy, experiment.targetSubsystem);
  const patternResult = generareExemplar(entropy, edgeResult.edgesFound);
  const resilienceScore = computareVigorem(
    edgeResult.edgesFound,
    edgeResult.selfHealed,
    patternResult.count,
    experiment.intensity
  );

  const result: ExperimentResult = {
    experimentId: experiment.id,
    experimentName: experiment.name,
    targetSubsystem: experiment.targetSubsystem,
    chaosCategory: experiment.chaosCategory,
    edgesDiscovered: edgeResult.edgesFound,
    edgeDescriptions: edgeResult.descriptions,
    selfHealingObserved: edgeResult.selfHealed,
    healingActions: edgeResult.healingActions,
    energyConverted: entropy * PHI,
    newPatternsGenerated: patternResult.count,
    patternSignatures: patternResult.signatures,
    resilienceScore,
    phiAlignment: resilienceScore * PHI_INVERSE,
    timestamp: now,
    cycleFeedback: `Entropy=${entropy.toFixed(4)} → ${edgeResult.edgesFound} edges → ${patternResult.count} patterns → resilience=${resilienceScore.toFixed(4)}`,
  };

  const updatedExperiments = lab.experiments.map((e, i) =>
    i === experimentIndex ? { ...e, state: 'completed' as ExperimentState } : e
  );

  const updatedNeurons = lab.neurons.map((n) => {
    if (n.subsystem === experiment.targetSubsystem) {
      const newActivation = Math.min(1, n.activationLevel + entropy * PHI_INVERSE);
      const shouldFire = newActivation >= n.firingThreshold;
      return {
        ...n,
        activationLevel: shouldFire ? 0 : newActivation,
        state: (shouldFire ? 'firing' : 'potentiated') as NeuronState,
        firingCount: shouldFire ? n.firingCount + 1 : n.firingCount,
        lastFiredAt: shouldFire ? now : n.lastFiredAt,
        phiResonance: Math.min(1, n.phiResonance + resilienceScore * PHI_INVERSE * 0.1),
      };
    }
    return n;
  });

  const updatedLab: ChaosLab = {
    ...lab,
    experiments: updatedExperiments,
    results: [...lab.results, result],
    neurons: updatedNeurons,
    totalEdgesDiscovered: lab.totalEdgesDiscovered + edgeResult.edgesFound,
    totalSelfHeals: lab.totalSelfHeals + (edgeResult.selfHealed ? 1 : 0),
    totalNewPatterns: lab.totalNewPatterns + patternResult.count,
    feedbackLog: [
      ...lab.feedbackLog,
      `Experiment "${experiment.name}": ${result.cycleFeedback}`,
    ],
    lastCycleAt: now,
  };

  return { lab: updatedLab, result };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION VI: NEURAL SYNAPSE MECHANICS — Mechanica Synapticum
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Roborare Synapsin — Strengthen the connection between two lab neurons.
 *
 * Implements Hebbian learning: "Neurons that fire together wire together."
 * When both source and target neurons are active during an experiment,
 * their connecting synapse strengthens by learningRate × φ⁻¹.
 */
export function strengthenSynapse(
  lab: ChaosLab,
  sourceNeuronId: NeuronId,
  targetNeuronId: NeuronId,
  learningRate: number
): ChaosLab {
  const now = new Date().toISOString();
  const updatedSynapses = lab.synapses.map((s) => {
    if (
      (s.sourceNeuronId === sourceNeuronId && s.targetNeuronId === targetNeuronId) ||
      (s.sourceNeuronId === targetNeuronId && s.targetNeuronId === sourceNeuronId)
    ) {
      const delta = learningRate * PHI_INVERSE;
      const newStrength = Math.min(1, s.strength + delta);
      return {
        ...s,
        strength: newStrength,
        strengthHistory: [...s.strengthHistory, newStrength],
        lastUpdatedAt: now,
        potentiationCount: s.potentiationCount + 1,
      };
    }
    return s;
  });

  return {
    ...lab,
    synapses: updatedSynapses,
    feedbackLog: [
      ...lab.feedbackLog,
      `Synapse ${sourceNeuronId} → ${targetNeuronId} strengthened by ${(learningRate * PHI_INVERSE).toFixed(4)}`,
    ],
  };
}

/**
 * Debilitare Synapsin — Decay unused synapses.
 *
 * Synapses that are not reinforced gradually weaken, allowing the network
 * to prune irrelevant connections and focus on productive pathways.
 */
export function weakenSynapse(
  lab: ChaosLab,
  sourceNeuronId: NeuronId,
  targetNeuronId: NeuronId,
  decayRate: number
): ChaosLab {
  const now = new Date().toISOString();
  const updatedSynapses = lab.synapses.map((s) => {
    if (
      (s.sourceNeuronId === sourceNeuronId && s.targetNeuronId === targetNeuronId) ||
      (s.sourceNeuronId === targetNeuronId && s.targetNeuronId === sourceNeuronId)
    ) {
      const delta = decayRate * PHI_INVERSE;
      const newStrength = Math.max(0, s.strength - delta);
      return {
        ...s,
        strength: newStrength,
        strengthHistory: [...s.strengthHistory, newStrength],
        lastUpdatedAt: now,
        depressionCount: s.depressionCount + 1,
      };
    }
    return s;
  });

  return {
    ...lab,
    synapses: updatedSynapses,
    feedbackLog: [
      ...lab.feedbackLog,
      `Synapse ${sourceNeuronId} → ${targetNeuronId} weakened by ${(decayRate * PHI_INVERSE).toFixed(4)}`,
    ],
  };
}

/**
 * Computare Vim Synapticam — Compute the synaptic strength measurement for a synapse.
 */
export function computeSynapticStrength(synapse: NeuralSynapse): SynapticStrength {
  const history = synapse.strengthHistory;
  const peakStrength = Math.max(...history);
  const averageStrength = history.reduce((sum, s) => sum + s, 0) / history.length;

  let trend: 'strengthening' | 'weakening' | 'stable';
  if (history.length < 2) {
    trend = 'stable';
  } else {
    const recent = history[history.length - 1];
    const previous = history[history.length - 2];
    const delta = recent - previous;
    if (delta > 0.01) trend = 'strengthening';
    else if (delta < -0.01) trend = 'weakening';
    else trend = 'stable';
  }

  const hebbianScore =
    (synapse.potentiationCount / (synapse.potentiationCount + synapse.depressionCount + 1)) * PHI_INVERSE;

  return {
    synapseId: synapse.id,
    currentStrength: synapse.strength,
    peakStrength,
    averageStrength,
    trend,
    hebbianScore,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION VII: FEEDBACK MECHANISM — Referre Inventa
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Referre Inventa — Take findings from previous cycle and convert them into
 * new chaos probes. The lab improves itself: each cycle's outputs become
 * the next cycle's inputs.
 */
export function feedFindingsBack(
  lab: ChaosLab,
  findings: readonly ExperimentResult[]
): ChaosLab {
  const newExperiments: ChaosExperiment[] = [];
  const feedbackEntries: string[] = [];

  for (const finding of findings) {
    if (finding.edgesDiscovered > 0) {
      const followUp: ChaosExperiment = {
        id: generareIdenticum('feedback-exp'),
        name: `Follow-up: ${finding.experimentName} edge-probe`,
        targetSubsystem: finding.targetSubsystem,
        chaosCategory: 'edge-probe',
        intensity: Math.min(1, finding.resilienceScore * PHI),
        description: `Auto-generated follow-up probing ${finding.edgesDiscovered} edges found in ${finding.targetSubsystem}`,
        hypothesis: `Deeper probing of edges in ${finding.targetSubsystem} will reveal nested boundary conditions`,
        state: 'registered',
        createdAt: new Date().toISOString(),
      };
      newExperiments.push(followUp);
      feedbackEntries.push(
        `Feedback: ${finding.edgesDiscovered} edges at ${finding.targetSubsystem} → new edge-probe generated`
      );
    }

    if (finding.newPatternsGenerated > 0) {
      const resonanceProbe: ChaosExperiment = {
        id: generareIdenticum('feedback-res'),
        name: `Resonance-test: ${finding.experimentName} patterns`,
        targetSubsystem: finding.targetSubsystem,
        chaosCategory: 'resonance-disruption',
        intensity: Math.min(1, finding.energyConverted * PHI_INVERSE),
        description: `Testing resonance stability of ${finding.newPatternsGenerated} new patterns`,
        hypothesis: `New patterns at ${finding.targetSubsystem} will resonate with adjacent subsystems`,
        state: 'registered',
        createdAt: new Date().toISOString(),
      };
      newExperiments.push(resonanceProbe);
      feedbackEntries.push(
        `Feedback: ${finding.newPatternsGenerated} patterns at ${finding.targetSubsystem} → resonance test generated`
      );
    }
  }

  return {
    ...lab,
    experiments: [...lab.experiments, ...newExperiments],
    feedbackLog: [...lab.feedbackLog, ...feedbackEntries],
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION VIII: LAB CYCLES — Currere Cyclum Laboratorii
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Currere Cyclum Laboratorii — Run the full lab for N cycles.
 *
 * Each cycle:
 *   1. Run all registered experiments
 *   2. Strengthen synapses based on edge discoveries (Hebbian learning)
 *   3. Weaken synapses for experiments that found stability
 *   4. Feed results back as NEW inputs for the next cycle
 *   5. Advance cycle counter
 */
export function runLabCycle(lab: ChaosLab, cycles: number): ChaosLab {
  let currentLab = lab;

  for (let cycle = 0; cycle < cycles; cycle++) {
    const registeredExperiments = currentLab.experiments.filter(
      (e) => e.state === 'registered'
    );

    if (registeredExperiments.length === 0) {
      currentLab = {
        ...currentLab,
        feedbackLog: [
          ...currentLab.feedbackLog,
          `Cycle ${cycle + 1}: No registered experiments — cycle skipped`,
        ],
      };
      continue;
    }

    const cycleResults: ExperimentResult[] = [];

    for (const experiment of registeredExperiments) {
      const { lab: updatedLab, result } = runExperiment(currentLab, experiment.id);
      currentLab = updatedLab;
      cycleResults.push(result);
    }

    // Hebbian synapse updates based on findings
    for (const result of cycleResults) {
      const targetNeuron = currentLab.neurons.find(
        (n) => n.subsystem === result.targetSubsystem
      );
      if (!targetNeuron) continue;

      for (const neuron of currentLab.neurons) {
        if (neuron.id === targetNeuron.id) continue;

        if (result.edgesDiscovered > 0) {
          const learningRate = result.resilienceScore * (result.edgesDiscovered / 5);
          currentLab = strengthenSynapse(
            currentLab,
            targetNeuron.id,
            neuron.id,
            learningRate
          );
        } else if (result.selfHealingObserved) {
          currentLab = weakenSynapse(
            currentLab,
            targetNeuron.id,
            neuron.id,
            0.05
          );
        }
      }
    }

    // Feed findings back as new experiments
    currentLab = feedFindingsBack(currentLab, cycleResults);

    currentLab = {
      ...currentLab,
      cyclesCompleted: currentLab.cyclesCompleted + 1,
      feedbackLog: [
        ...currentLab.feedbackLog,
        `Cycle ${cycle + 1} complete: ${cycleResults.length} experiments, ${cycleResults.reduce((s, r) => s + r.edgesDiscovered, 0)} edges, ${cycleResults.reduce((s, r) => s + r.newPatternsGenerated, 0)} new patterns`,
      ],
    };
  }

  return currentLab;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION IX: REPORTING — Relatio Laboratorii
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtinere Relationem — Get comprehensive lab report with synapse strengths,
 * experiment results, edge discoveries, and pattern evolution.
 */
export function getLabReport(lab: ChaosLab): ChaosLabReport {
  const synapseStrengths = lab.synapses.map(computeSynapticStrength);

  const allEdgeDescriptions = lab.results.flatMap((r) => r.edgeDescriptions);
  const allPatternSignatures = lab.results.flatMap((r) => r.patternSignatures);

  const averageResilience =
    lab.results.length > 0
      ? lab.results.reduce((sum, r) => sum + r.resilienceScore, 0) / lab.results.length
      : 0;

  const phiCoherence =
    synapseStrengths.length > 0
      ? synapseStrengths.reduce((sum, s) => sum + s.currentStrength, 0) /
        synapseStrengths.length *
        PHI_INVERSE
      : 0;

  return {
    labId: lab.id,
    totalCyclesRun: lab.cyclesCompleted,
    totalExperiments: lab.results.length,
    totalEdgesDiscovered: lab.totalEdgesDiscovered,
    totalSelfHeals: lab.totalSelfHeals,
    totalNewPatterns: lab.totalNewPatterns,
    averageResilience,
    synapseStrengths,
    experimentResults: lab.results,
    edgeEvolution: allEdgeDescriptions,
    patternEvolution: allPatternSignatures,
    neuronStates: lab.neurons,
    phiCoherence,
    generatedAt: new Date().toISOString(),
  };
}
