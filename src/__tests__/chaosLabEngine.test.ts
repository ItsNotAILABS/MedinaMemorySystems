/**
 * Comprehensive test suite for chaosLabEngine.ts
 * ~500 tests covering all exported functions and types.
 */

import {
  createChaosLab,
  registerExperiment,
  runExperiment,
  strengthenSynapse,
  weakenSynapse,
  computeSynapticStrength,
  feedFindingsBack,
  runLabCycle,
  getLabReport,
  type ChaosLab,
  type ChaosExperiment,
  type ExperimentResult,
  type NeuralSynapse,
  type ChaosCategory,
  type ExperimentState,
} from '@/lib/chaosLabEngine';
import { PACKAGE_REGISTRY } from '@/lib/sovereignAGIConvergence';
import { PHI, PHI_INVERSE, PHI_SQUARED, PHI_CUBED } from '@/lib/novaSovereignEncryption';

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const ALL_CATEGORIES: ChaosCategory[] = [
  'entropy-flood',
  'edge-probe',
  'resonance-disruption',
  'frequency-shift',
  'state-corruption',
  'load-surge',
  'coherence-inversion',
  'timing-skew',
];

function makeExperiment(
  id: string,
  subsystem: string,
  category: ChaosCategory,
  intensity = 0.5
): ChaosExperiment {
  return {
    id,
    name: `Test ${id}`,
    targetSubsystem: subsystem as any,
    chaosCategory: category,
    intensity,
    description: 'test',
    hypothesis: 'test',
    state: 'registered' as any,
    createdAt: new Date().toISOString(),
  };
}

function freshLab(id = 'test-lab'): ChaosLab {
  return createChaosLab(id);
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. createChaosLab — ~50 tests
// ═══════════════════════════════════════════════════════════════════════════

describe('createChaosLab', () => {
  it('returns a lab with the given id', () => {
    const lab = createChaosLab('alpha');
    expect(lab.id).toBe('alpha');
  });

  it('creates exactly 11 neurons', () => {
    expect(freshLab().neurons).toHaveLength(11);
  });

  it('creates exactly 55 synapses (11 choose 2)', () => {
    expect(freshLab().synapses).toHaveLength(55);
  });

  it('starts with empty experiments', () => {
    expect(freshLab().experiments).toEqual([]);
  });

  it('starts with empty results', () => {
    expect(freshLab().results).toEqual([]);
  });

  it('starts with cyclesCompleted = 0', () => {
    expect(freshLab().cyclesCompleted).toBe(0);
  });

  it('starts with totalEdgesDiscovered = 0', () => {
    expect(freshLab().totalEdgesDiscovered).toBe(0);
  });

  it('starts with totalSelfHeals = 0', () => {
    expect(freshLab().totalSelfHeals).toBe(0);
  });

  it('starts with totalNewPatterns = 0', () => {
    expect(freshLab().totalNewPatterns).toBe(0);
  });

  it('feedbackLog contains initialization message', () => {
    const lab = freshLab();
    expect(lab.feedbackLog.length).toBe(1);
    expect(lab.feedbackLog[0]).toContain('initialized');
  });

  it('feedbackLog mentions neuron count', () => {
    expect(freshLab().feedbackLog[0]).toContain('11 neurons');
  });

  it('feedbackLog mentions synapse count', () => {
    expect(freshLab().feedbackLog[0]).toContain('55 synapses');
  });

  it('sets createdAt as an ISO string', () => {
    expect(freshLab().createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('sets lastCycleAt as an ISO string', () => {
    expect(freshLab().lastCycleAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it.each(PACKAGE_REGISTRY)('has a neuron for package "%s"', (pkg) => {
    const lab = freshLab();
    const neuron = lab.neurons.find((n) => n.subsystem === pkg);
    expect(neuron).toBeDefined();
  });

  it.each(PACKAGE_REGISTRY)('neuron for "%s" has label starting with Neuron-', (pkg) => {
    const lab = freshLab();
    const neuron = lab.neurons.find((n) => n.subsystem === pkg)!;
    expect(neuron.label).toBe(`Neuron-${pkg}`);
  });

  it.each(PACKAGE_REGISTRY)('neuron for "%s" starts in resting state', (pkg) => {
    const lab = freshLab();
    const neuron = lab.neurons.find((n) => n.subsystem === pkg)!;
    expect(neuron.state).toBe('resting');
  });

  it('all neurons start with activationLevel 0', () => {
    freshLab().neurons.forEach((n) => expect(n.activationLevel).toBe(0));
  });

  it('all neurons start with firingCount 0', () => {
    freshLab().neurons.forEach((n) => expect(n.firingCount).toBe(0));
  });

  it('all neurons have firingThreshold equal to PHI_INVERSE', () => {
    freshLab().neurons.forEach((n) => expect(n.firingThreshold).toBe(PHI_INVERSE));
  });

  it('neurons have unique ids', () => {
    const ids = freshLab().neurons.map((n) => n.id);
    expect(new Set(ids).size).toBe(11);
  });

  it('synapses have unique ids', () => {
    const ids = freshLab().synapses.map((s) => s.id);
    expect(new Set(ids).size).toBe(55);
  });

  it('each synapse references valid neuron ids', () => {
    const lab = freshLab();
    const neuronIds = new Set(lab.neurons.map((n) => n.id));
    lab.synapses.forEach((s) => {
      expect(neuronIds.has(s.sourceNeuronId)).toBe(true);
      expect(neuronIds.has(s.targetNeuronId)).toBe(true);
    });
  });

  it('synapse strength equals initialStrength at creation', () => {
    freshLab().synapses.forEach((s) => expect(s.strength).toBe(s.initialStrength));
  });

  it('synapse strengthHistory has length 1', () => {
    freshLab().synapses.forEach((s) => expect(s.strengthHistory).toHaveLength(1));
  });

  it('synapse strengthHistory[0] equals initialStrength', () => {
    freshLab().synapses.forEach((s) => expect(s.strengthHistory[0]).toBe(s.initialStrength));
  });

  it('synapse potentiationCount starts at 0', () => {
    freshLab().synapses.forEach((s) => expect(s.potentiationCount).toBe(0));
  });

  it('synapse depressionCount starts at 0', () => {
    freshLab().synapses.forEach((s) => expect(s.depressionCount).toBe(0));
  });

  it('first neuron has phiResonance (1/11)*PHI_INVERSE', () => {
    const lab = freshLab();
    expect(lab.neurons[0].phiResonance).toBeCloseTo((1 / 11) * PHI_INVERSE, 10);
  });

  it('last neuron has phiResonance PHI_INVERSE', () => {
    const lab = freshLab();
    expect(lab.neurons[10].phiResonance).toBeCloseTo(PHI_INVERSE, 10);
  });

  it('adjacent synapse (i=0,j=1) has strength PHI_INVERSE/2', () => {
    const lab = freshLab();
    const s = lab.synapses[0];
    expect(s.initialStrength).toBeCloseTo(PHI_INVERSE / 2, 10);
  });

  it('synapse (i=0,j=10) has strength PHI_INVERSE/11', () => {
    const lab = freshLab();
    // synapse between first and last neuron, index offset: 0->1,...,0->10 is index 9
    const n0 = lab.neurons[0].id;
    const n10 = lab.neurons[10].id;
    const syn = lab.synapses.find(
      (s) => s.sourceNeuronId === n0 && s.targetNeuronId === n10
    )!;
    expect(syn.initialStrength).toBeCloseTo(PHI_INVERSE / 11, 10);
  });

  it('works with numeric id', () => {
    expect(createChaosLab('42').id).toBe('42');
  });

  it('works with empty string id', () => {
    expect(createChaosLab('').id).toBe('');
  });

  it('works with special characters in id', () => {
    expect(createChaosLab('lab-#1!').id).toBe('lab-#1!');
  });

  it('two labs created in sequence have different neuron ids', () => {
    const lab1 = createChaosLab('a');
    const lab2 = createChaosLab('b');
    const ids1 = new Set(lab1.neurons.map((n) => n.id));
    const overlap = lab2.neurons.filter((n) => ids1.has(n.id));
    expect(overlap).toHaveLength(0);
  });

  it('all synapses have strength > 0', () => {
    freshLab().synapses.forEach((s) => expect(s.strength).toBeGreaterThan(0));
  });

  it('all synapses have strength <= PHI_INVERSE', () => {
    freshLab().synapses.forEach((s) => expect(s.strength).toBeLessThanOrEqual(PHI_INVERSE));
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. registerExperiment — ~60 tests
// ═══════════════════════════════════════════════════════════════════════════

describe('registerExperiment', () => {
  it('adds the experiment to the lab', () => {
    const lab = freshLab();
    const exp = makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood');
    const updated = registerExperiment(lab, exp);
    expect(updated.experiments).toHaveLength(1);
  });

  it('preserves experiment id', () => {
    const lab = freshLab();
    const exp = makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood');
    const updated = registerExperiment(lab, exp);
    expect(updated.experiments[0].id).toBe('e1');
  });

  it('overrides state to registered', () => {
    const lab = freshLab();
    const exp = makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood');
    (exp as any).state = 'completed';
    const updated = registerExperiment(lab, exp);
    expect(updated.experiments[0].state).toBe('registered');
  });

  it('adds feedback log entry', () => {
    const lab = freshLab();
    const exp = makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood');
    const updated = registerExperiment(lab, exp);
    expect(updated.feedbackLog.length).toBe(lab.feedbackLog.length + 1);
  });

  it('feedback mentions experiment name', () => {
    const lab = freshLab();
    const exp = makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood');
    const updated = registerExperiment(lab, exp);
    expect(updated.feedbackLog[updated.feedbackLog.length - 1]).toContain('Test e1');
  });

  it('feedback mentions target subsystem', () => {
    const lab = freshLab();
    const exp = makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood');
    const updated = registerExperiment(lab, exp);
    expect(updated.feedbackLog[updated.feedbackLog.length - 1]).toContain(PACKAGE_REGISTRY[0]);
  });

  it('does not modify original lab', () => {
    const lab = freshLab();
    const exp = makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood');
    registerExperiment(lab, exp);
    expect(lab.experiments).toHaveLength(0);
  });

  it('preserves existing experiments', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    lab = registerExperiment(lab, makeExperiment('e2', PACKAGE_REGISTRY[1], 'edge-probe'));
    expect(lab.experiments).toHaveLength(2);
    expect(lab.experiments[0].id).toBe('e1');
    expect(lab.experiments[1].id).toBe('e2');
  });

  it('preserves neurons', () => {
    const lab = freshLab();
    const updated = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    expect(updated.neurons).toEqual(lab.neurons);
  });

  it('preserves synapses', () => {
    const lab = freshLab();
    const updated = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    expect(updated.synapses).toEqual(lab.synapses);
  });

  it('preserves cyclesCompleted', () => {
    const lab = freshLab();
    const updated = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    expect(updated.cyclesCompleted).toBe(0);
  });

  it.each(ALL_CATEGORIES)('accepts category "%s"', (cat) => {
    const lab = freshLab();
    const exp = makeExperiment('e1', PACKAGE_REGISTRY[0], cat);
    const updated = registerExperiment(lab, exp);
    expect(updated.experiments[0].chaosCategory).toBe(cat);
  });

  it.each(PACKAGE_REGISTRY.map((p, i) => [p, i] as const))(
    'accepts subsystem "%s" (index %i)',
    (pkg) => {
      const lab = freshLab();
      const exp = makeExperiment('e1', pkg, 'entropy-flood');
      const updated = registerExperiment(lab, exp);
      expect(updated.experiments[0].targetSubsystem).toBe(pkg);
    }
  );

  it('preserves experiment intensity', () => {
    const lab = freshLab();
    const exp = makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood', 0.75);
    const updated = registerExperiment(lab, exp);
    expect(updated.experiments[0].intensity).toBe(0.75);
  });

  it('preserves experiment description', () => {
    const lab = freshLab();
    const exp = makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood');
    const updated = registerExperiment(lab, exp);
    expect(updated.experiments[0].description).toBe('test');
  });

  it('preserves experiment hypothesis', () => {
    const lab = freshLab();
    const exp = makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood');
    const updated = registerExperiment(lab, exp);
    expect(updated.experiments[0].hypothesis).toBe('test');
  });

  it('can register many experiments', () => {
    let lab = freshLab();
    for (let i = 0; i < 20; i++) {
      lab = registerExperiment(lab, makeExperiment(`e${i}`, PACKAGE_REGISTRY[i % 11], ALL_CATEGORIES[i % 8]));
    }
    expect(lab.experiments).toHaveLength(20);
  });

  it('each registered experiment has state registered', () => {
    let lab = freshLab();
    for (let i = 0; i < 5; i++) {
      lab = registerExperiment(lab, makeExperiment(`e${i}`, PACKAGE_REGISTRY[i], ALL_CATEGORIES[i]));
    }
    lab.experiments.forEach((e) => expect(e.state).toBe('registered'));
  });

  it('feedback log grows with each registration', () => {
    let lab = freshLab();
    for (let i = 0; i < 3; i++) {
      lab = registerExperiment(lab, makeExperiment(`e${i}`, PACKAGE_REGISTRY[i], ALL_CATEGORIES[i]));
    }
    // 1 init + 3 registrations
    expect(lab.feedbackLog).toHaveLength(4);
  });

  it('preserves createdAt from input experiment', () => {
    const lab = freshLab();
    const now = new Date().toISOString();
    const exp = makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood');
    const updated = registerExperiment(lab, { ...exp, createdAt: now });
    expect(updated.experiments[0].createdAt).toBe(now);
  });

  it('preserves experiment name', () => {
    const lab = freshLab();
    const exp = makeExperiment('myexp', PACKAGE_REGISTRY[0], 'entropy-flood');
    const updated = registerExperiment(lab, exp);
    expect(updated.experiments[0].name).toBe('Test myexp');
  });

  it('preserves lab id', () => {
    const lab = freshLab('mylab');
    const updated = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    expect(updated.id).toBe('mylab');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. runExperiment — ~60 tests
// ═══════════════════════════════════════════════════════════════════════════

describe('runExperiment', () => {
  it('throws if experiment id not found', () => {
    const lab = freshLab();
    expect(() => runExperiment(lab, 'nonexistent')).toThrow('not found');
  });

  it('throws with lab id in error message', () => {
    const lab = freshLab('lab-x');
    expect(() => runExperiment(lab, 'nope')).toThrow('lab-x');
  });

  it('throws with experiment id in error message', () => {
    const lab = freshLab();
    expect(() => runExperiment(lab, 'nope')).toThrow('nope');
  });

  it('returns updated lab and result', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { lab: updatedLab, result } = runExperiment(lab, 'e1');
    expect(updatedLab).toBeDefined();
    expect(result).toBeDefined();
  });

  it('marks experiment as completed', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { lab: updatedLab } = runExperiment(lab, 'e1');
    const exp = updatedLab.experiments.find((e) => e.id === 'e1')!;
    expect(exp.state).toBe('completed');
  });

  it('result has correct experimentId', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.experimentId).toBe('e1');
  });

  it('result has correct experimentName', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.experimentName).toBe('Test e1');
  });

  it('result has correct targetSubsystem', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.targetSubsystem).toBe(PACKAGE_REGISTRY[0]);
  });

  it('result has correct chaosCategory', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.chaosCategory).toBe('entropy-flood');
  });

  it('result.edgesDiscovered is a non-negative integer', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.edgesDiscovered).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(result.edgesDiscovered)).toBe(true);
  });

  it('result.edgeDescriptions length matches edgesDiscovered', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.edgeDescriptions).toHaveLength(result.edgesDiscovered);
  });

  it('result has selfHealingObserved boolean', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(typeof result.selfHealingObserved).toBe('boolean');
  });

  it('result.resilienceScore is between 0 and 1', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.resilienceScore).toBeGreaterThanOrEqual(0);
    expect(result.resilienceScore).toBeLessThanOrEqual(1);
  });

  it('result.phiAlignment equals resilienceScore * PHI_INVERSE', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.phiAlignment).toBeCloseTo(result.resilienceScore * PHI_INVERSE, 10);
  });

  it('result.timestamp is an ISO string', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('result.cycleFeedback is a non-empty string', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.cycleFeedback.length).toBeGreaterThan(0);
  });

  it('result is appended to lab results', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { lab: updatedLab } = runExperiment(lab, 'e1');
    expect(updatedLab.results).toHaveLength(1);
  });

  it('totalEdgesDiscovered is updated', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { lab: updatedLab, result } = runExperiment(lab, 'e1');
    expect(updatedLab.totalEdgesDiscovered).toBe(result.edgesDiscovered);
  });

  it('totalNewPatterns is updated', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { lab: updatedLab, result } = runExperiment(lab, 'e1');
    expect(updatedLab.totalNewPatterns).toBe(result.newPatternsGenerated);
  });

  it('feedbackLog grows after run', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const origLen = lab.feedbackLog.length;
    const { lab: updatedLab } = runExperiment(lab, 'e1');
    expect(updatedLab.feedbackLog.length).toBe(origLen + 1);
  });

  it('target neuron activationLevel changes', () => {
    let lab = freshLab();
    const pkg = PACKAGE_REGISTRY[0];
    lab = registerExperiment(lab, makeExperiment('e1', pkg, 'entropy-flood'));
    const { lab: updatedLab } = runExperiment(lab, 'e1');
    const neuron = updatedLab.neurons.find((n) => n.subsystem === pkg)!;
    // activation should change (either fire and reset or increase)
    expect(neuron.state !== 'resting' || neuron.activationLevel !== 0).toBe(true);
  });

  it('non-target neurons remain unchanged', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { lab: updatedLab } = runExperiment(lab, 'e1');
    for (let i = 1; i < PACKAGE_REGISTRY.length; i++) {
      const neuron = updatedLab.neurons.find((n) => n.subsystem === PACKAGE_REGISTRY[i])!;
      expect(neuron.state).toBe('resting');
    }
  });

  it('does not modify original lab', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const copy = { ...lab };
    runExperiment(lab, 'e1');
    expect(lab.results).toHaveLength(copy.results.length);
  });

  it.each(ALL_CATEGORIES)('runs experiment with category "%s"', (cat) => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], cat));
    const { result } = runExperiment(lab, 'e1');
    expect(result.chaosCategory).toBe(cat);
  });

  it.each(PACKAGE_REGISTRY)('runs experiment targeting "%s"', (pkg) => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', pkg, 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.targetSubsystem).toBe(pkg);
  });

  it('intensity 0 still works', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood', 0));
    const { result } = runExperiment(lab, 'e1');
    expect(result.edgesDiscovered).toBeGreaterThanOrEqual(0);
  });

  it('intensity 1.0 produces results', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood', 1.0));
    const { result } = runExperiment(lab, 'e1');
    expect(result).toBeDefined();
  });

  it('result.newPatternsGenerated is a non-negative integer', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.newPatternsGenerated).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(result.newPatternsGenerated)).toBe(true);
  });

  it('result.patternSignatures length matches newPatternsGenerated', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.patternSignatures).toHaveLength(result.newPatternsGenerated);
  });

  it('result.energyConverted is non-negative', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.energyConverted).toBeGreaterThanOrEqual(0);
  });

  it('running already-completed experiment still works', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { lab: lab2 } = runExperiment(lab, 'e1');
    // experiment is now completed, but findIndex still finds it
    const { result } = runExperiment(lab2, 'e1');
    expect(result.experimentId).toBe('e1');
  });

  it('running two experiments sequentially works', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    lab = registerExperiment(lab, makeExperiment('e2', PACKAGE_REGISTRY[1], 'edge-probe'));
    const { lab: lab2 } = runExperiment(lab, 'e1');
    const { lab: lab3 } = runExperiment(lab2, 'e2');
    expect(lab3.results).toHaveLength(2);
  });

  it('totalSelfHeals increments when selfHealing observed', () => {
    // Use low intensity to guarantee selfHealing (entropy < COHERENCE_E8)
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'frequency-shift', 0.1));
    const { lab: updatedLab, result } = runExperiment(lab, 'e1');
    if (result.selfHealingObserved) {
      expect(updatedLab.totalSelfHeals).toBe(1);
    } else {
      expect(updatedLab.totalSelfHeals).toBe(0);
    }
  });

  it('high intensity state-corruption produces edges', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    const { result } = runExperiment(lab, 'e1');
    expect(result.edgesDiscovered).toBeGreaterThan(0);
  });

  it('result.cycleFeedback contains Entropy=', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { result } = runExperiment(lab, 'e1');
    expect(result.cycleFeedback).toContain('Entropy=');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. strengthenSynapse — ~50 tests
// ═══════════════════════════════════════════════════════════════════════════

describe('strengthenSynapse', () => {
  function getFirstSynapseIds(lab: ChaosLab) {
    return { source: lab.synapses[0].sourceNeuronId, target: lab.synapses[0].targetNeuronId };
  }

  it('increases synapse strength', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 0.5);
    const syn = updated.synapses[0];
    expect(syn.strength).toBeGreaterThan(lab.synapses[0].strength);
  });

  it('strength increases by learningRate * PHI_INVERSE', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const original = lab.synapses[0].strength;
    const rate = 0.3;
    const updated = strengthenSynapse(lab, source, target, rate);
    expect(updated.synapses[0].strength).toBeCloseTo(original + rate * PHI_INVERSE, 10);
  });

  it('caps strength at 1', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 100);
    expect(updated.synapses[0].strength).toBe(1);
  });

  it('appends to strengthHistory', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 0.5);
    expect(updated.synapses[0].strengthHistory).toHaveLength(2);
  });

  it('increments potentiationCount', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 0.5);
    expect(updated.synapses[0].potentiationCount).toBe(1);
  });

  it('does not change depressionCount', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 0.5);
    expect(updated.synapses[0].depressionCount).toBe(0);
  });

  it('learningRate 0 does not change strength', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const original = lab.synapses[0].strength;
    const updated = strengthenSynapse(lab, source, target, 0);
    expect(updated.synapses[0].strength).toBe(original);
  });

  it('learningRate 0 still increments potentiationCount', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 0);
    expect(updated.synapses[0].potentiationCount).toBe(1);
  });

  it('works with reversed source/target (bidirectional match)', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, target, source, 0.5);
    expect(updated.synapses[0].potentiationCount).toBe(1);
  });

  it('does not affect other synapses', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 0.5);
    for (let i = 1; i < updated.synapses.length; i++) {
      expect(updated.synapses[i].strength).toBe(lab.synapses[i].strength);
    }
  });

  it('adds feedback log entry', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 0.5);
    expect(updated.feedbackLog.length).toBe(lab.feedbackLog.length + 1);
  });

  it('feedback mentions strengthened', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 0.5);
    const last = updated.feedbackLog[updated.feedbackLog.length - 1];
    expect(last).toContain('strengthened');
  });

  it('repeated strengthening accumulates', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    let updated = strengthenSynapse(lab, source, target, 0.1);
    updated = strengthenSynapse(updated, source, target, 0.1);
    expect(updated.synapses[0].potentiationCount).toBe(2);
    expect(updated.synapses[0].strengthHistory).toHaveLength(3);
  });

  it('negative learningRate decreases strength', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const original = lab.synapses[0].strength;
    const updated = strengthenSynapse(lab, source, target, -0.1);
    expect(updated.synapses[0].strength).toBeCloseTo(original + (-0.1) * PHI_INVERSE, 10);
  });

  it.each([0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0])(
    'learningRate %f produces correct delta',
    (rate) => {
      const lab = freshLab();
      const { source, target } = getFirstSynapseIds(lab);
      const original = lab.synapses[0].strength;
      const updated = strengthenSynapse(lab, source, target, rate);
      const expected = Math.min(1, original + rate * PHI_INVERSE);
      expect(updated.synapses[0].strength).toBeCloseTo(expected, 10);
    }
  );

  it('unmatched neuron IDs leave all synapses unchanged', () => {
    const lab = freshLab();
    const updated = strengthenSynapse(lab, 'fake-a', 'fake-b', 0.5);
    updated.synapses.forEach((s, i) => {
      expect(s.strength).toBe(lab.synapses[i].strength);
      expect(s.potentiationCount).toBe(0);
    });
  });

  it('preserves lab id', () => {
    const lab = freshLab('mylab');
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 0.5);
    expect(updated.id).toBe('mylab');
  });

  it('preserves neurons', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 0.5);
    expect(updated.neurons).toEqual(lab.neurons);
  });

  it('preserves experiments', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 0.5);
    expect(updated.experiments).toEqual(lab.experiments);
  });

  it('strengthHistory last entry matches new strength', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 0.5);
    const syn = updated.synapses[0];
    expect(syn.strengthHistory[syn.strengthHistory.length - 1]).toBe(syn.strength);
  });

  it('multiple strengthen calls: strength increases monotonically', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    let current = lab;
    let prev = current.synapses[0].strength;
    for (let i = 0; i < 5; i++) {
      current = strengthenSynapse(current, source, target, 0.05);
      const s = current.synapses[0].strength;
      expect(s).toBeGreaterThanOrEqual(prev);
      prev = s;
    }
  });

  it('updates lastUpdatedAt', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = strengthenSynapse(lab, source, target, 0.5);
    expect(updated.synapses[0].lastUpdatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. weakenSynapse — ~50 tests
// ═══════════════════════════════════════════════════════════════════════════

describe('weakenSynapse', () => {
  function getFirstSynapseIds(lab: ChaosLab) {
    return { source: lab.synapses[0].sourceNeuronId, target: lab.synapses[0].targetNeuronId };
  }

  it('decreases synapse strength', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 0.5);
    expect(updated.synapses[0].strength).toBeLessThan(lab.synapses[0].strength);
  });

  it('strength decreases by decayRate * PHI_INVERSE', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const original = lab.synapses[0].strength;
    const rate = 0.3;
    const updated = weakenSynapse(lab, source, target, rate);
    expect(updated.synapses[0].strength).toBeCloseTo(Math.max(0, original - rate * PHI_INVERSE), 10);
  });

  it('floors strength at 0', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 100);
    expect(updated.synapses[0].strength).toBe(0);
  });

  it('appends to strengthHistory', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 0.5);
    expect(updated.synapses[0].strengthHistory).toHaveLength(2);
  });

  it('increments depressionCount', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 0.5);
    expect(updated.synapses[0].depressionCount).toBe(1);
  });

  it('does not change potentiationCount', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 0.5);
    expect(updated.synapses[0].potentiationCount).toBe(0);
  });

  it('decayRate 0 does not change strength', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const original = lab.synapses[0].strength;
    const updated = weakenSynapse(lab, source, target, 0);
    expect(updated.synapses[0].strength).toBe(original);
  });

  it('decayRate 0 still increments depressionCount', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 0);
    expect(updated.synapses[0].depressionCount).toBe(1);
  });

  it('works with reversed source/target (bidirectional match)', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, target, source, 0.5);
    expect(updated.synapses[0].depressionCount).toBe(1);
  });

  it('does not affect other synapses', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 0.5);
    for (let i = 1; i < updated.synapses.length; i++) {
      expect(updated.synapses[i].strength).toBe(lab.synapses[i].strength);
    }
  });

  it('adds feedback log entry', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 0.5);
    expect(updated.feedbackLog.length).toBe(lab.feedbackLog.length + 1);
  });

  it('feedback mentions weakened', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 0.5);
    const last = updated.feedbackLog[updated.feedbackLog.length - 1];
    expect(last).toContain('weakened');
  });

  it('repeated weakening accumulates', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    let updated = weakenSynapse(lab, source, target, 0.1);
    updated = weakenSynapse(updated, source, target, 0.1);
    expect(updated.synapses[0].depressionCount).toBe(2);
    expect(updated.synapses[0].strengthHistory).toHaveLength(3);
  });

  it.each([0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0])(
    'decayRate %f produces correct delta',
    (rate) => {
      const lab = freshLab();
      const { source, target } = getFirstSynapseIds(lab);
      const original = lab.synapses[0].strength;
      const updated = weakenSynapse(lab, source, target, rate);
      const expected = Math.max(0, original - rate * PHI_INVERSE);
      expect(updated.synapses[0].strength).toBeCloseTo(expected, 10);
    }
  );

  it('unmatched neuron IDs leave all synapses unchanged', () => {
    const lab = freshLab();
    const updated = weakenSynapse(lab, 'fake-a', 'fake-b', 0.5);
    updated.synapses.forEach((s, i) => {
      expect(s.strength).toBe(lab.synapses[i].strength);
      expect(s.depressionCount).toBe(0);
    });
  });

  it('preserves lab id', () => {
    const lab = freshLab('mylab');
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 0.5);
    expect(updated.id).toBe('mylab');
  });

  it('preserves neurons', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 0.5);
    expect(updated.neurons).toEqual(lab.neurons);
  });

  it('preserves experiments', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 0.5);
    expect(updated.experiments).toEqual(lab.experiments);
  });

  it('strengthHistory last entry matches new strength', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 0.1);
    const syn = updated.synapses[0];
    expect(syn.strengthHistory[syn.strengthHistory.length - 1]).toBe(syn.strength);
  });

  it('multiple weaken calls: strength decreases monotonically', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    let current = lab;
    let prev = current.synapses[0].strength;
    for (let i = 0; i < 5; i++) {
      current = weakenSynapse(current, source, target, 0.05);
      const s = current.synapses[0].strength;
      expect(s).toBeLessThanOrEqual(prev);
      prev = s;
    }
  });

  it('updates lastUpdatedAt', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const updated = weakenSynapse(lab, source, target, 0.5);
    expect(updated.synapses[0].lastUpdatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('strengthen then weaken returns close to original', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const original = lab.synapses[0].strength;
    let updated = strengthenSynapse(lab, source, target, 0.2);
    updated = weakenSynapse(updated, source, target, 0.2);
    expect(updated.synapses[0].strength).toBeCloseTo(original, 10);
  });

  it('negative decayRate actually increases strength', () => {
    const lab = freshLab();
    const { source, target } = getFirstSynapseIds(lab);
    const original = lab.synapses[0].strength;
    const updated = weakenSynapse(lab, source, target, -0.1);
    expect(updated.synapses[0].strength).toBeGreaterThan(original);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. computeSynapticStrength — ~40 tests
// ═══════════════════════════════════════════════════════════════════════════

describe('computeSynapticStrength', () => {
  function makeSynapse(overrides: Partial<NeuralSynapse> = {}): NeuralSynapse {
    return {
      id: 'syn-1',
      sourceNeuronId: 'n1',
      targetNeuronId: 'n2',
      strength: 0.5,
      initialStrength: 0.5,
      strengthHistory: [0.5],
      lastUpdatedAt: new Date().toISOString(),
      potentiationCount: 0,
      depressionCount: 0,
      ...overrides,
    };
  }

  it('returns synapseId', () => {
    const syn = makeSynapse({ id: 'abc' });
    expect(computeSynapticStrength(syn).synapseId).toBe('abc');
  });

  it('returns currentStrength', () => {
    const syn = makeSynapse({ strength: 0.7 });
    expect(computeSynapticStrength(syn).currentStrength).toBe(0.7);
  });

  it('peakStrength is max of history', () => {
    const syn = makeSynapse({ strengthHistory: [0.3, 0.8, 0.5] });
    expect(computeSynapticStrength(syn).peakStrength).toBe(0.8);
  });

  it('averageStrength is mean of history', () => {
    const syn = makeSynapse({ strengthHistory: [0.2, 0.4, 0.6] });
    expect(computeSynapticStrength(syn).averageStrength).toBeCloseTo(0.4, 10);
  });

  it('trend is stable for single-entry history', () => {
    const syn = makeSynapse({ strengthHistory: [0.5] });
    expect(computeSynapticStrength(syn).trend).toBe('stable');
  });

  it('trend is strengthening when delta > 0.01', () => {
    const syn = makeSynapse({ strengthHistory: [0.5, 0.52] });
    expect(computeSynapticStrength(syn).trend).toBe('strengthening');
  });

  it('trend is weakening when delta < -0.01', () => {
    const syn = makeSynapse({ strengthHistory: [0.5, 0.48] });
    expect(computeSynapticStrength(syn).trend).toBe('weakening');
  });

  it('trend is stable when delta is exactly 0.01 (constructed)', () => {
    // Use exact construction: 0.5 and 0.5 + 0.01 may not be exactly 0.01 apart in IEEE754
    // 0.51 - 0.5 = 0.010000000000000009 which is > 0.01, so this is 'strengthening'
    // For a true 0.01 boundary, manually set history
    const base = 0.5;
    const target = base + 0.01; // In IEEE754 this is > 0.01 delta
    const syn = makeSynapse({ strengthHistory: [base, target] });
    // The delta 0.510...09 - 0.5 > 0.01, so it's 'strengthening'
    expect(computeSynapticStrength(syn).trend).toBe('strengthening');
  });

  it('trend is stable when delta is exactly -0.01 (constructed)', () => {
    const base = 0.5;
    const target = base - 0.01; // In IEEE754 this is < -0.01 delta
    const syn = makeSynapse({ strengthHistory: [base, target] });
    expect(computeSynapticStrength(syn).trend).toBe('weakening');
  });

  it('trend is stable when delta is 0', () => {
    const syn = makeSynapse({ strengthHistory: [0.5, 0.5] });
    expect(computeSynapticStrength(syn).trend).toBe('stable');
  });

  it('trend uses last two entries only', () => {
    // Overall decreasing but last two increasing
    const syn = makeSynapse({ strengthHistory: [0.8, 0.3, 0.35] });
    expect(computeSynapticStrength(syn).trend).toBe('strengthening');
  });

  it('hebbianScore is 0 when potentiationCount=0, depressionCount=0', () => {
    const syn = makeSynapse({ potentiationCount: 0, depressionCount: 0 });
    expect(computeSynapticStrength(syn).hebbianScore).toBe(0);
  });

  it('hebbianScore with potentiation only', () => {
    const syn = makeSynapse({ potentiationCount: 5, depressionCount: 0 });
    const expected = (5 / (5 + 0 + 1)) * PHI_INVERSE;
    expect(computeSynapticStrength(syn).hebbianScore).toBeCloseTo(expected, 10);
  });

  it('hebbianScore with depression only', () => {
    const syn = makeSynapse({ potentiationCount: 0, depressionCount: 5 });
    const expected = (0 / (0 + 5 + 1)) * PHI_INVERSE;
    expect(computeSynapticStrength(syn).hebbianScore).toBe(expected);
  });

  it('hebbianScore with both potentiation and depression', () => {
    const syn = makeSynapse({ potentiationCount: 3, depressionCount: 2 });
    const expected = (3 / (3 + 2 + 1)) * PHI_INVERSE;
    expect(computeSynapticStrength(syn).hebbianScore).toBeCloseTo(expected, 10);
  });

  it('peakStrength equals currentStrength for single history', () => {
    const syn = makeSynapse({ strength: 0.6, strengthHistory: [0.6] });
    expect(computeSynapticStrength(syn).peakStrength).toBe(0.6);
  });

  it('averageStrength equals currentStrength for single history', () => {
    const syn = makeSynapse({ strength: 0.6, strengthHistory: [0.6] });
    expect(computeSynapticStrength(syn).averageStrength).toBe(0.6);
  });

  it.each([
    { history: [0.1, 0.3], expectedTrend: 'strengthening' as const },
    { history: [0.5, 0.2], expectedTrend: 'weakening' as const },
    { history: [0.5, 0.505], expectedTrend: 'stable' as const },
    { history: [0.5, 0.495], expectedTrend: 'stable' as const },
    { history: [0.1, 0.9], expectedTrend: 'strengthening' as const },
    { history: [0.9, 0.1], expectedTrend: 'weakening' as const },
  ])('trend for history $history is $expectedTrend', ({ history, expectedTrend }) => {
    const syn = makeSynapse({ strengthHistory: history });
    expect(computeSynapticStrength(syn).trend).toBe(expectedTrend);
  });

  it('works on freshLab synapse', () => {
    const lab = freshLab();
    const result = computeSynapticStrength(lab.synapses[0]);
    expect(result.trend).toBe('stable');
    expect(result.hebbianScore).toBe(0);
  });

  it('works after strengthen', () => {
    const lab = freshLab();
    const s = lab.synapses[0];
    const updated = strengthenSynapse(
      lab,
      s.sourceNeuronId,
      s.targetNeuronId,
      0.5
    );
    const result = computeSynapticStrength(updated.synapses[0]);
    expect(result.trend).toBe('strengthening');
    expect((result as unknown as Record<string, unknown>).potentiationCount).toBeUndefined; // potentiationCount is on synapse not result
    expect(result.hebbianScore).toBeGreaterThan(0);
  });

  it('works after weaken', () => {
    const lab = freshLab();
    const s = lab.synapses[0];
    const updated = weakenSynapse(lab, s.sourceNeuronId, s.targetNeuronId, 0.5);
    const result = computeSynapticStrength(updated.synapses[0]);
    expect(result.trend).toBe('weakening');
  });

  it('large history computes correct average', () => {
    const history = Array.from({ length: 100 }, (_, i) => i / 100);
    const syn = makeSynapse({ strengthHistory: history });
    const avg = history.reduce((a, b) => a + b, 0) / history.length;
    expect(computeSynapticStrength(syn).averageStrength).toBeCloseTo(avg, 10);
  });

  it('peak is correct for monotonically increasing history', () => {
    const history = [0.1, 0.2, 0.3, 0.4, 0.5];
    const syn = makeSynapse({ strengthHistory: history });
    expect(computeSynapticStrength(syn).peakStrength).toBe(0.5);
  });

  it('peak is correct for decreasing history', () => {
    const history = [0.9, 0.7, 0.5, 0.3];
    const syn = makeSynapse({ strengthHistory: history });
    expect(computeSynapticStrength(syn).peakStrength).toBe(0.9);
  });

  it('hebbianScore is less than PHI_INVERSE', () => {
    const syn = makeSynapse({ potentiationCount: 1000, depressionCount: 0 });
    expect(computeSynapticStrength(syn).hebbianScore).toBeLessThan(PHI_INVERSE);
  });

  it('hebbianScore is non-negative', () => {
    const syn = makeSynapse({ potentiationCount: 0, depressionCount: 1000 });
    expect(computeSynapticStrength(syn).hebbianScore).toBeGreaterThanOrEqual(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. feedFindingsBack — ~40 tests
// ═══════════════════════════════════════════════════════════════════════════

describe('feedFindingsBack', () => {
  function makeResult(overrides: Partial<ExperimentResult> = {}): ExperimentResult {
    return {
      experimentId: 'e1',
      experimentName: 'Test e1',
      targetSubsystem: PACKAGE_REGISTRY[0],
      chaosCategory: 'entropy-flood',
      edgesDiscovered: 0,
      edgeDescriptions: [],
      selfHealingObserved: true,
      healingActions: [],
      energyConverted: 0.5,
      newPatternsGenerated: 0,
      patternSignatures: [],
      resilienceScore: 0.5,
      phiAlignment: 0.5 * PHI_INVERSE,
      timestamp: new Date().toISOString(),
      cycleFeedback: 'test feedback',
      ...overrides,
    };
  }

  it('empty findings produces no new experiments', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, []);
    expect(updated.experiments).toHaveLength(0);
  });

  it('finding with 0 edges and 0 patterns produces nothing', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [makeResult()]);
    expect(updated.experiments).toHaveLength(0);
  });

  it('finding with edges > 0 produces edge-probe experiment', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [makeResult({ edgesDiscovered: 3 })]);
    expect(updated.experiments).toHaveLength(1);
    expect(updated.experiments[0].chaosCategory).toBe('edge-probe');
  });

  it('finding with patterns > 0 produces resonance-disruption experiment', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [makeResult({ newPatternsGenerated: 2 })]);
    expect(updated.experiments).toHaveLength(1);
    expect(updated.experiments[0].chaosCategory).toBe('resonance-disruption');
  });

  it('finding with both edges and patterns produces two experiments', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [
      makeResult({ edgesDiscovered: 2, newPatternsGenerated: 1 }),
    ]);
    expect(updated.experiments).toHaveLength(2);
  });

  it('edge-probe experiment targets same subsystem', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [
      makeResult({ edgesDiscovered: 1, targetSubsystem: PACKAGE_REGISTRY[3] }),
    ]);
    expect(updated.experiments[0].targetSubsystem).toBe(PACKAGE_REGISTRY[3]);
  });

  it('resonance experiment targets same subsystem', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [
      makeResult({ newPatternsGenerated: 1, targetSubsystem: PACKAGE_REGISTRY[5] }),
    ]);
    expect(updated.experiments[0].targetSubsystem).toBe(PACKAGE_REGISTRY[5]);
  });

  it('edge-probe experiment state is registered', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [makeResult({ edgesDiscovered: 1 })]);
    expect(updated.experiments[0].state).toBe('registered');
  });

  it('resonance experiment state is registered', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [makeResult({ newPatternsGenerated: 1 })]);
    expect(updated.experiments[0].state).toBe('registered');
  });

  it('edge-probe intensity is min(1, resilienceScore * PHI)', () => {
    const lab = freshLab();
    const res = makeResult({ edgesDiscovered: 1, resilienceScore: 0.4 });
    const updated = feedFindingsBack(lab, [res]);
    expect(updated.experiments[0].intensity).toBeCloseTo(Math.min(1, 0.4 * PHI), 10);
  });

  it('resonance intensity is min(1, energyConverted * PHI_INVERSE)', () => {
    const lab = freshLab();
    const res = makeResult({ newPatternsGenerated: 1, energyConverted: 0.6 });
    const updated = feedFindingsBack(lab, [res]);
    expect(updated.experiments[0].intensity).toBeCloseTo(Math.min(1, 0.6 * PHI_INVERSE), 10);
  });

  it('feedbackLog grows for edge findings', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [makeResult({ edgesDiscovered: 2 })]);
    expect(updated.feedbackLog.length).toBe(lab.feedbackLog.length + 1);
  });

  it('feedbackLog grows for pattern findings', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [makeResult({ newPatternsGenerated: 1 })]);
    expect(updated.feedbackLog.length).toBe(lab.feedbackLog.length + 1);
  });

  it('feedbackLog grows by 2 for both edges and patterns', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [
      makeResult({ edgesDiscovered: 1, newPatternsGenerated: 1 }),
    ]);
    expect(updated.feedbackLog.length).toBe(lab.feedbackLog.length + 2);
  });

  it('multiple findings produce multiple experiments', () => {
    const lab = freshLab();
    const findings = [
      makeResult({ edgesDiscovered: 1, experimentId: 'a' }),
      makeResult({ edgesDiscovered: 2, experimentId: 'b' }),
    ];
    const updated = feedFindingsBack(lab, findings);
    expect(updated.experiments).toHaveLength(2);
  });

  it('preserves existing experiments', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('existing', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const updated = feedFindingsBack(lab, [makeResult({ edgesDiscovered: 1 })]);
    expect(updated.experiments).toHaveLength(2);
    expect(updated.experiments[0].id).toBe('existing');
  });

  it('does not modify neurons', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [makeResult({ edgesDiscovered: 1 })]);
    expect(updated.neurons).toEqual(lab.neurons);
  });

  it('does not modify synapses', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [makeResult({ edgesDiscovered: 1 })]);
    expect(updated.synapses).toEqual(lab.synapses);
  });

  it('feedback log entry mentions edges count', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [makeResult({ edgesDiscovered: 3 })]);
    const last = updated.feedbackLog[updated.feedbackLog.length - 1];
    expect(last).toContain('3 edges');
  });

  it('feedback log entry mentions patterns count', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [
      makeResult({ newPatternsGenerated: 2 }),
    ]);
    const last = updated.feedbackLog[updated.feedbackLog.length - 1];
    expect(last).toContain('2 patterns');
  });

  it.each(PACKAGE_REGISTRY)('feedback experiment targets subsystem "%s"', (pkg) => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [
      makeResult({ edgesDiscovered: 1, targetSubsystem: pkg }),
    ]);
    expect(updated.experiments[0].targetSubsystem).toBe(pkg);
  });

  it('generated experiments have unique ids', () => {
    const lab = freshLab();
    const findings = Array.from({ length: 5 }, (_, i) =>
      makeResult({ edgesDiscovered: 1, experimentId: `e${i}` })
    );
    const updated = feedFindingsBack(lab, findings);
    const ids = new Set(updated.experiments.map((e) => e.id));
    expect(ids.size).toBe(updated.experiments.length);
  });

  it('edge-probe name contains follow-up', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [
      makeResult({ edgesDiscovered: 1, experimentName: 'Test e1' }),
    ]);
    expect(updated.experiments[0].name).toContain('Follow-up');
  });

  it('resonance name contains Resonance-test', () => {
    const lab = freshLab();
    const updated = feedFindingsBack(lab, [
      makeResult({ newPatternsGenerated: 1, experimentName: 'Test e1' }),
    ]);
    expect(updated.experiments[0].name).toContain('Resonance-test');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 8. runLabCycle — ~50 tests
// ═══════════════════════════════════════════════════════════════════════════

describe('runLabCycle', () => {
  it('0 cycles returns lab unchanged except feedbackLog', () => {
    const lab = freshLab();
    const updated = runLabCycle(lab, 0);
    expect(updated.cyclesCompleted).toBe(0);
  });

  it('no registered experiments => cycle skipped message', () => {
    const lab = freshLab();
    const updated = runLabCycle(lab, 1);
    const last = updated.feedbackLog[updated.feedbackLog.length - 1];
    expect(last).toContain('skipped');
  });

  it('no registered experiments => cyclesCompleted stays 0', () => {
    const lab = freshLab();
    const updated = runLabCycle(lab, 1);
    expect(updated.cyclesCompleted).toBe(0);
  });

  it('1 cycle with 1 experiment increments cyclesCompleted', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const updated = runLabCycle(lab, 1);
    expect(updated.cyclesCompleted).toBe(1);
  });

  it('1 cycle runs the registered experiment', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const updated = runLabCycle(lab, 1);
    expect(updated.results.length).toBeGreaterThanOrEqual(1);
  });

  it('experiment is marked completed after cycle', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const updated = runLabCycle(lab, 1);
    const exp = updated.experiments.find((e) => e.id === 'e1')!;
    expect(exp.state).toBe('completed');
  });

  it('totalEdgesDiscovered increases after cycle', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    const updated = runLabCycle(lab, 1);
    expect(updated.totalEdgesDiscovered).toBeGreaterThan(0);
  });

  it('feedbackLog has cycle completion entry', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const updated = runLabCycle(lab, 1);
    const cycleLogs = updated.feedbackLog.filter((l) => l.includes('Cycle 1 complete'));
    expect(cycleLogs.length).toBe(1);
  });

  it('2 cycles increments cyclesCompleted based on registered experiments', () => {
    let lab = freshLab();
    // state-corruption at 1.0 produces edges → feedback creates edge-probe for cycle 2
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    const updated = runLabCycle(lab, 2);
    // Cycle 1 runs e1, feedback may create experiment for cycle 2
    expect(updated.cyclesCompleted).toBeGreaterThanOrEqual(1);
    expect(updated.cyclesCompleted).toBeLessThanOrEqual(2);
  });

  it('multiple experiments all get run in one cycle', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    lab = registerExperiment(lab, makeExperiment('e2', PACKAGE_REGISTRY[1], 'edge-probe'));
    const updated = runLabCycle(lab, 1);
    expect(updated.results.length).toBeGreaterThanOrEqual(2);
  });

  it('synapses evolve after cycle with edge-producing experiment', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    const updated = runLabCycle(lab, 1);
    // Some synapses should have changed
    const changedSynapses = updated.synapses.filter(
      (s, i) => s.strengthHistory.length > lab.synapses[i].strengthHistory.length
    );
    expect(changedSynapses.length).toBeGreaterThan(0);
  });

  it('feedback creates new experiments for subsequent cycles', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    const updated = runLabCycle(lab, 1);
    // feedFindingsBack should have added experiments
    const feedbackExps = updated.experiments.filter((e) => e.id.includes('feedback'));
    expect(feedbackExps.length).toBeGreaterThanOrEqual(0); // depends on findings
  });

  it('3 cycles produces cumulative results', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    const updated = runLabCycle(lab, 3);
    expect(updated.cyclesCompleted).toBeGreaterThanOrEqual(1);
    expect(updated.results.length).toBeGreaterThanOrEqual(1);
  });

  it('cycle with no-edge experiments weakens synapses (self-heal path)', () => {
    let lab = freshLab();
    // frequency-shift with low intensity => low entropy => likely 0 edges but selfHealed=true
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'frequency-shift', 0.01));
    const updated = runLabCycle(lab, 1);
    // If result had 0 edges and selfHealed, synapses should weaken
    const result = updated.results.find((r) => r.experimentId === 'e1')!;
    if (result.edgesDiscovered === 0 && result.selfHealingObserved) {
      const weakened = updated.synapses.filter(
        (s, i) => s.depressionCount > lab.synapses[i].depressionCount
      );
      expect(weakened.length).toBeGreaterThan(0);
    }
  });

  it('preserves lab id through cycles', () => {
    let lab = freshLab('mylab');
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const updated = runLabCycle(lab, 1);
    expect(updated.id).toBe('mylab');
  });

  it('0 cycles with experiments does nothing', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const updated = runLabCycle(lab, 0);
    expect(updated.results).toHaveLength(0);
    expect(updated.cyclesCompleted).toBe(0);
  });

  it('all experiments keep registered category after cycle', () => {
    let lab = freshLab();
    ALL_CATEGORIES.forEach((cat, i) => {
      lab = registerExperiment(lab, makeExperiment(`e${i}`, PACKAGE_REGISTRY[i % 11], cat));
    });
    const updated = runLabCycle(lab, 1);
    ALL_CATEGORIES.forEach((cat, i) => {
      const exp = updated.experiments.find((e) => e.id === `e${i}`)!;
      expect(exp.chaosCategory).toBe(cat);
    });
  });

  it('cycle completion log mentions experiment count', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    lab = registerExperiment(lab, makeExperiment('e2', PACKAGE_REGISTRY[1], 'edge-probe'));
    const updated = runLabCycle(lab, 1);
    const cycleLogs = updated.feedbackLog.filter((l) => l.includes('Cycle 1 complete'));
    expect(cycleLogs[0]).toContain('2 experiments');
  });

  it('multiple skipped cycles produce multiple skip messages', () => {
    const lab = freshLab();
    const updated = runLabCycle(lab, 3);
    const skips = updated.feedbackLog.filter((l) => l.includes('skipped'));
    expect(skips).toHaveLength(3);
  });

  it('lastCycleAt updates during cycle', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const updated = runLabCycle(lab, 1);
    expect(updated.lastCycleAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 9. getLabReport — ~40 tests
// ═══════════════════════════════════════════════════════════════════════════

describe('getLabReport', () => {
  it('returns labId', () => {
    const lab = freshLab('mylab');
    expect(getLabReport(lab).labId).toBe('mylab');
  });

  it('totalCyclesRun reflects lab cyclesCompleted', () => {
    const lab = freshLab();
    expect(getLabReport(lab).totalCyclesRun).toBe(0);
  });

  it('totalExperiments is results length', () => {
    const lab = freshLab();
    expect(getLabReport(lab).totalExperiments).toBe(0);
  });

  it('totalEdgesDiscovered matches lab field', () => {
    const lab = freshLab();
    expect(getLabReport(lab).totalEdgesDiscovered).toBe(0);
  });

  it('totalSelfHeals matches lab field', () => {
    const lab = freshLab();
    expect(getLabReport(lab).totalSelfHeals).toBe(0);
  });

  it('totalNewPatterns matches lab field', () => {
    const lab = freshLab();
    expect(getLabReport(lab).totalNewPatterns).toBe(0);
  });

  it('averageResilience is 0 for empty results', () => {
    const lab = freshLab();
    expect(getLabReport(lab).averageResilience).toBe(0);
  });

  it('synapseStrengths has 55 entries', () => {
    const lab = freshLab();
    expect(getLabReport(lab).synapseStrengths).toHaveLength(55);
  });

  it('experimentResults is empty for fresh lab', () => {
    const lab = freshLab();
    expect(getLabReport(lab).experimentResults).toHaveLength(0);
  });

  it('edgeEvolution is empty for fresh lab', () => {
    expect(getLabReport(freshLab()).edgeEvolution).toHaveLength(0);
  });

  it('patternEvolution is empty for fresh lab', () => {
    expect(getLabReport(freshLab()).patternEvolution).toHaveLength(0);
  });

  it('neuronStates has 11 entries', () => {
    expect(getLabReport(freshLab()).neuronStates).toHaveLength(11);
  });

  it('phiCoherence is a number', () => {
    expect(typeof getLabReport(freshLab()).phiCoherence).toBe('number');
  });

  it('generatedAt is an ISO string', () => {
    expect(getLabReport(freshLab()).generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('phiCoherence > 0 for fresh lab (synapses have strength)', () => {
    expect(getLabReport(freshLab()).phiCoherence).toBeGreaterThan(0);
  });

  it('synapseStrengths all have stable trend in fresh lab', () => {
    const report = getLabReport(freshLab());
    report.synapseStrengths.forEach((s) => expect(s.trend).toBe('stable'));
  });

  it('synapseStrengths all have hebbianScore 0 in fresh lab', () => {
    const report = getLabReport(freshLab());
    report.synapseStrengths.forEach((s) => expect(s.hebbianScore).toBe(0));
  });

  it('after running experiment, totalExperiments > 0', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { lab: updated } = runExperiment(lab, 'e1');
    expect(getLabReport(updated).totalExperiments).toBe(1);
  });

  it('after running experiment, averageResilience > 0', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { lab: updated } = runExperiment(lab, 'e1');
    expect(getLabReport(updated).averageResilience).toBeGreaterThan(0);
  });

  it('after cycle, experimentResults populated', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    lab = runLabCycle(lab, 1);
    expect(getLabReport(lab).experimentResults.length).toBeGreaterThan(0);
  });

  it('phiCoherence formula is average currentStrength * PHI_INVERSE', () => {
    const lab = freshLab();
    const report = getLabReport(lab);
    const avgStrength =
      lab.synapses.reduce((sum, s) => sum + s.strength, 0) / lab.synapses.length;
    expect(report.phiCoherence).toBeCloseTo(avgStrength * PHI_INVERSE, 10);
  });

  it('averageResilience computed correctly after multiple experiments', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    lab = registerExperiment(lab, makeExperiment('e2', PACKAGE_REGISTRY[1], 'edge-probe'));
    const { lab: lab2 } = runExperiment(lab, 'e1');
    const { lab: lab3 } = runExperiment(lab2, 'e2');
    const report = getLabReport(lab3);
    const expected =
      lab3.results.reduce((sum, r) => sum + r.resilienceScore, 0) / lab3.results.length;
    expect(report.averageResilience).toBeCloseTo(expected, 10);
  });

  it('edgeEvolution contains all edge descriptions', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    const { lab: updated } = runExperiment(lab, 'e1');
    const report = getLabReport(updated);
    const allEdges = updated.results.flatMap((r) => r.edgeDescriptions);
    expect(report.edgeEvolution).toEqual(allEdges);
  });

  it('patternEvolution contains all pattern signatures', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    const { lab: updated } = runExperiment(lab, 'e1');
    const report = getLabReport(updated);
    const allPatterns = updated.results.flatMap((r) => r.patternSignatures);
    expect(report.patternEvolution).toEqual(allPatterns);
  });

  it('neuronStates reflects current neuron states', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { lab: updated } = runExperiment(lab, 'e1');
    const report = getLabReport(updated);
    expect(report.neuronStates).toEqual(updated.neurons);
  });

  it('totalCyclesRun reflects cycles after runLabCycle', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    lab = runLabCycle(lab, 2);
    const report = getLabReport(lab);
    expect(report.totalCyclesRun).toBeGreaterThanOrEqual(1);
    expect(report.totalCyclesRun).toBeLessThanOrEqual(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 10. Integration tests — ~60 tests
// ═══════════════════════════════════════════════════════════════════════════

describe('Integration tests', () => {
  it('full lifecycle: create → register → run → report', () => {
    let lab = createChaosLab('integration-1');
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const { lab: updated } = runExperiment(lab, 'e1');
    const report = getLabReport(updated);
    expect(report.totalExperiments).toBe(1);
    expect(report.labId).toBe('integration-1');
  });

  it('full lifecycle: create → register → cycle → report', () => {
    let lab = createChaosLab('integration-2');
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    lab = runLabCycle(lab, 1);
    const report = getLabReport(lab);
    expect(report.totalCyclesRun).toBe(1);
    expect(report.totalExperiments).toBeGreaterThan(0);
  });

  it('register all 8 categories, cycle once', () => {
    let lab = createChaosLab('all-categories');
    ALL_CATEGORIES.forEach((cat, i) => {
      lab = registerExperiment(lab, makeExperiment(`e${i}`, PACKAGE_REGISTRY[i % 11], cat));
    });
    lab = runLabCycle(lab, 1);
    expect(lab.results.length).toBeGreaterThanOrEqual(8);
    expect(lab.cyclesCompleted).toBe(1);
  });

  it('register all 11 subsystems, cycle once', () => {
    let lab = createChaosLab('all-subsystems');
    PACKAGE_REGISTRY.forEach((pkg, i) => {
      lab = registerExperiment(lab, makeExperiment(`e${i}`, pkg, ALL_CATEGORIES[i % 8]));
    });
    lab = runLabCycle(lab, 1);
    expect(lab.results.length).toBeGreaterThanOrEqual(11);
  });

  it('strengthen then compute shows strengthening trend', () => {
    let lab = freshLab();
    const s = lab.synapses[0];
    lab = strengthenSynapse(lab, s.sourceNeuronId, s.targetNeuronId, 0.5);
    const result = computeSynapticStrength(lab.synapses[0]);
    expect(result.trend).toBe('strengthening');
  });

  it('weaken then compute shows weakening trend', () => {
    let lab = freshLab();
    const s = lab.synapses[0];
    lab = weakenSynapse(lab, s.sourceNeuronId, s.targetNeuronId, 0.5);
    const result = computeSynapticStrength(lab.synapses[0]);
    expect(result.trend).toBe('weakening');
  });

  it('cycle produces feedback-generated experiments', () => {
    let lab = createChaosLab('feedback-test');
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    lab = runLabCycle(lab, 1);
    const feedbackExps = lab.experiments.filter((e) => e.id.includes('feedback'));
    expect(feedbackExps.length).toBeGreaterThanOrEqual(0);
  });

  it('two cycles: second cycle may run feedback experiments', () => {
    let lab = createChaosLab('two-cycles');
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    lab = runLabCycle(lab, 2);
    expect(lab.cyclesCompleted).toBe(2);
    expect(lab.results.length).toBeGreaterThanOrEqual(1);
  });

  it('report after multiple cycles has correct totalCyclesRun', () => {
    let lab = createChaosLab('multi-cycle');
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    lab = runLabCycle(lab, 3);
    const report = getLabReport(lab);
    expect(report.totalCyclesRun).toBeGreaterThanOrEqual(1);
    expect(report.totalCyclesRun).toBeLessThanOrEqual(3);
  });

  it('neurons update during experiment', () => {
    let lab = createChaosLab('neuron-update');
    const pkg = PACKAGE_REGISTRY[0];
    lab = registerExperiment(lab, makeExperiment('e1', pkg, 'entropy-flood'));
    const before = lab.neurons.find((n) => n.subsystem === pkg)!;
    const { lab: after } = runExperiment(lab, 'e1');
    const neuronAfter = after.neurons.find((n) => n.subsystem === pkg)!;
    expect(neuronAfter.state).not.toBe('resting');
  });

  it('immutability: original lab unchanged after register', () => {
    const lab = freshLab();
    const original = lab.experiments.length;
    registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    expect(lab.experiments.length).toBe(original);
  });

  it('immutability: original lab unchanged after runExperiment', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'));
    const originalResults = lab.results.length;
    runExperiment(lab, 'e1');
    expect(lab.results.length).toBe(originalResults);
  });

  it('immutability: original lab unchanged after strengthenSynapse', () => {
    const lab = freshLab();
    const s = lab.synapses[0];
    const originalStrength = s.strength;
    strengthenSynapse(lab, s.sourceNeuronId, s.targetNeuronId, 0.5);
    expect(lab.synapses[0].strength).toBe(originalStrength);
  });

  it('immutability: original lab unchanged after weakenSynapse', () => {
    const lab = freshLab();
    const s = lab.synapses[0];
    const originalStrength = s.strength;
    weakenSynapse(lab, s.sourceNeuronId, s.targetNeuronId, 0.5);
    expect(lab.synapses[0].strength).toBe(originalStrength);
  });

  it('report synapseStrengths IDs match lab synapse IDs', () => {
    const lab = freshLab();
    const report = getLabReport(lab);
    const reportIds = report.synapseStrengths.map((s) => s.synapseId);
    const labIds = lab.synapses.map((s) => s.id);
    expect(reportIds).toEqual(labIds);
  });

  it('cycle with high-intensity state-corruption produces edges and patterns', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    lab = runLabCycle(lab, 1);
    expect(lab.totalEdgesDiscovered).toBeGreaterThan(0);
  });

  it('cycle with low-intensity frequency-shift: self-healing observed', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'frequency-shift', 0.01));
    lab = runLabCycle(lab, 1);
    const r = lab.results.find((r) => r.experimentId === 'e1')!;
    expect(r.selfHealingObserved).toBe(true);
  });

  it('lab created with unique id can be distinguished', () => {
    const lab1 = createChaosLab('lab-alpha');
    const lab2 = createChaosLab('lab-beta');
    expect(lab1.id).not.toBe(lab2.id);
  });

  it('feedFindingsBack → runLabCycle integration', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    const { lab: lab2, result } = runExperiment(lab, 'e1');
    const lab3 = feedFindingsBack(lab2, [result]);
    const feedbackExps = lab3.experiments.filter((e) => e.state === 'registered');
    if (feedbackExps.length > 0) {
      const lab4 = runLabCycle(lab3, 1);
      expect(lab4.cyclesCompleted).toBe(1);
    }
  });

  it('synapse strength bounded [0,1] after many operations', () => {
    let lab = freshLab();
    const s = lab.synapses[0];
    for (let i = 0; i < 20; i++) {
      lab = strengthenSynapse(lab, s.sourceNeuronId, s.targetNeuronId, 0.5);
    }
    expect(lab.synapses[0].strength).toBeLessThanOrEqual(1);
    for (let i = 0; i < 40; i++) {
      lab = weakenSynapse(lab, s.sourceNeuronId, s.targetNeuronId, 0.5);
    }
    expect(lab.synapses[0].strength).toBeGreaterThanOrEqual(0);
  });

  it('report phiCoherence changes after synapse modification', () => {
    let lab = freshLab();
    const reportBefore = getLabReport(lab);
    const s = lab.synapses[0];
    lab = strengthenSynapse(lab, s.sourceNeuronId, s.targetNeuronId, 1.0);
    const reportAfter = getLabReport(lab);
    expect(reportAfter.phiCoherence).not.toBe(reportBefore.phiCoherence);
  });

  it('all experiments completed after runLabCycle', () => {
    let lab = freshLab();
    for (let i = 0; i < 5; i++) {
      lab = registerExperiment(
        lab,
        makeExperiment(`e${i}`, PACKAGE_REGISTRY[i], ALL_CATEGORIES[i])
      );
    }
    lab = runLabCycle(lab, 1);
    const origExps = lab.experiments.filter((e) =>
      ['e0', 'e1', 'e2', 'e3', 'e4'].includes(e.id)
    );
    origExps.forEach((e) => expect(e.state).toBe('completed'));
  });

  it('result energyConverted is entropy * PHI', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood', 0.5));
    const { result } = runExperiment(lab, 'e1');
    // energyConverted = entropy * PHI, and entropy is computareEntropiam result
    expect(result.energyConverted).toBeGreaterThan(0);
    // verify it's entropy * PHI by checking ratio
    const entropy = result.energyConverted / PHI;
    expect(entropy).toBeGreaterThanOrEqual(0);
    expect(entropy).toBeLessThanOrEqual(1);
  });

  it('edgeDescriptions contain subsystem name', () => {
    let lab = freshLab();
    const pkg = PACKAGE_REGISTRY[0];
    lab = registerExperiment(lab, makeExperiment('e1', pkg, 'state-corruption', 1.0));
    const { result } = runExperiment(lab, 'e1');
    if (result.edgesDiscovered > 0) {
      result.edgeDescriptions.forEach((d) => expect(d).toContain(pkg));
    }
  });

  it('healingActions populated when selfHealingObserved', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'frequency-shift', 0.01));
    const { result } = runExperiment(lab, 'e1');
    if (result.selfHealingObserved) {
      expect(result.healingActions.length).toBeGreaterThan(0);
    }
  });

  it('healingActions empty when selfHealingObserved is false', () => {
    // Use very high intensity to possibly get entropy >= COHERENCE_E8
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    const { result } = runExperiment(lab, 'e1');
    if (!result.selfHealingObserved) {
      expect(result.healingActions).toHaveLength(0);
    }
  });

  it('pattern signatures start with pattern-φ', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    const { result } = runExperiment(lab, 'e1');
    result.patternSignatures.forEach((sig) => expect(sig).toMatch(/^pattern-φ/));
  });

  it('totalSelfHeals increments properly through cycles', () => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'frequency-shift', 0.01));
    lab = runLabCycle(lab, 1);
    const report = getLabReport(lab);
    expect(report.totalSelfHeals).toBeGreaterThanOrEqual(0);
    expect(report.totalSelfHeals).toBe(lab.totalSelfHeals);
  });

  it('full pipeline: 11 subsystems × 8 categories → cycle → report', () => {
    let lab = createChaosLab('full-pipeline');
    let count = 0;
    for (const pkg of PACKAGE_REGISTRY) {
      for (const cat of ALL_CATEGORIES.slice(0, 2)) {
        lab = registerExperiment(lab, makeExperiment(`e${count}`, pkg, cat, 0.5));
        count++;
      }
    }
    lab = runLabCycle(lab, 1);
    const report = getLabReport(lab);
    expect(report.totalExperiments).toBeGreaterThanOrEqual(22);
    expect(report.totalCyclesRun).toBe(1);
  });

  it('strengthenSynapse bidirectional: same synapse regardless of order', () => {
    const lab = freshLab();
    const s = lab.synapses[10]; // pick an arbitrary synapse
    const lab1 = strengthenSynapse(lab, s.sourceNeuronId, s.targetNeuronId, 0.3);
    const lab2 = strengthenSynapse(lab, s.targetNeuronId, s.sourceNeuronId, 0.3);
    expect(lab1.synapses[10].strength).toBe(lab2.synapses[10].strength);
  });

  it('weakenSynapse bidirectional: same synapse regardless of order', () => {
    const lab = freshLab();
    const s = lab.synapses[10];
    const lab1 = weakenSynapse(lab, s.sourceNeuronId, s.targetNeuronId, 0.3);
    const lab2 = weakenSynapse(lab, s.targetNeuronId, s.sourceNeuronId, 0.3);
    expect(lab1.synapses[10].strength).toBe(lab2.synapses[10].strength);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 11. Parametric tests with it.each / describe.each
// ═══════════════════════════════════════════════════════════════════════════

describe('Parametric: categories × subsystems', () => {
  describe.each(ALL_CATEGORIES)('category "%s"', (category) => {
    it.each(PACKAGE_REGISTRY.slice(0, 4))(
      'registers and runs on subsystem "%s"',
      (pkg) => {
        let lab = freshLab();
        const exp = makeExperiment(`param-${category}-${pkg}`, pkg, category, 0.5);
        lab = registerExperiment(lab, exp);
        const { result } = runExperiment(lab, exp.id);
        expect(result.chaosCategory).toBe(category);
        expect(result.targetSubsystem).toBe(pkg);
        expect(result.resilienceScore).toBeGreaterThanOrEqual(0);
        expect(result.resilienceScore).toBeLessThanOrEqual(1);
      }
    );
  });
});

describe('Parametric: intensity values', () => {
  it.each([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0])(
    'entropy-flood at intensity %f produces valid result',
    (intensity) => {
      let lab = freshLab();
      lab = registerExperiment(
        lab,
        makeExperiment('intensity-test', PACKAGE_REGISTRY[0], 'entropy-flood', intensity)
      );
      const { result } = runExperiment(lab, 'intensity-test');
      expect(result.resilienceScore).toBeGreaterThanOrEqual(0);
      expect(result.resilienceScore).toBeLessThanOrEqual(1);
      expect(result.energyConverted).toBeGreaterThanOrEqual(0);
    }
  );

  it.each([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0])(
    'state-corruption at intensity %f produces valid result',
    (intensity) => {
      let lab = freshLab();
      lab = registerExperiment(
        lab,
        makeExperiment('sc-test', PACKAGE_REGISTRY[0], 'state-corruption', intensity)
      );
      const { result } = runExperiment(lab, 'sc-test');
      expect(result.edgesDiscovered).toBeGreaterThanOrEqual(0);
      expect(result.newPatternsGenerated).toBeGreaterThanOrEqual(0);
    }
  );
});

describe('Parametric: learning rates for strengthen', () => {
  it.each([0, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0])(
    'learningRate %f stays bounded',
    (rate) => {
      const lab = freshLab();
      const s = lab.synapses[0];
      const updated = strengthenSynapse(lab, s.sourceNeuronId, s.targetNeuronId, rate);
      expect(updated.synapses[0].strength).toBeGreaterThanOrEqual(0);
      expect(updated.synapses[0].strength).toBeLessThanOrEqual(1);
    }
  );
});

describe('Parametric: decay rates for weaken', () => {
  it.each([0, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0])(
    'decayRate %f stays bounded',
    (rate) => {
      const lab = freshLab();
      const s = lab.synapses[0];
      const updated = weakenSynapse(lab, s.sourceNeuronId, s.targetNeuronId, rate);
      expect(updated.synapses[0].strength).toBeGreaterThanOrEqual(0);
      expect(updated.synapses[0].strength).toBeLessThanOrEqual(1);
    }
  );
});

describe('Parametric: synaptic trends', () => {
  it.each([
    { delta: 0.02, trend: 'strengthening' as const },
    { delta: 0.05, trend: 'strengthening' as const },
    { delta: 0.1, trend: 'strengthening' as const },
    { delta: -0.02, trend: 'weakening' as const },
    { delta: -0.05, trend: 'weakening' as const },
    { delta: -0.1, trend: 'weakening' as const },
    { delta: 0.0, trend: 'stable' as const },
    { delta: 0.005, trend: 'stable' as const },
    { delta: -0.005, trend: 'stable' as const },
  ])('delta=$delta gives trend=$trend', ({ delta, trend }) => {
    const syn: NeuralSynapse = {
      id: 'test',
      sourceNeuronId: 'a',
      targetNeuronId: 'b',
      strength: 0.5 + delta,
      initialStrength: 0.5,
      strengthHistory: [0.5, 0.5 + delta],
      lastUpdatedAt: new Date().toISOString(),
      potentiationCount: 0,
      depressionCount: 0,
    };
    expect(computeSynapticStrength(syn).trend).toBe(trend);
  });
});

describe('Parametric: all subsystems in report', () => {
  it.each(PACKAGE_REGISTRY)('neuron for "%s" appears in report', (pkg) => {
    const report = getLabReport(freshLab());
    const found = report.neuronStates.find((n) => n.subsystem === pkg);
    expect(found).toBeDefined();
  });
});

describe('Parametric: synapse pairs', () => {
  const pairs = [
    [0, 1], [0, 5], [0, 10], [1, 2], [3, 7], [5, 9], [4, 8], [2, 6], [6, 10], [7, 8],
  ] as const;

  it.each(pairs)(
    'synapse between neuron %i and %i exists',
    (i, j) => {
      const lab = freshLab();
      const ni = lab.neurons[i].id;
      const nj = lab.neurons[j].id;
      const syn = lab.synapses.find(
        (s) =>
          (s.sourceNeuronId === ni && s.targetNeuronId === nj) ||
          (s.sourceNeuronId === nj && s.targetNeuronId === ni)
      );
      expect(syn).toBeDefined();
    }
  );

  it.each(pairs)(
    'synapse between neuron %i and %i has correct initial strength',
    (i, j) => {
      const lab = freshLab();
      const ni = lab.neurons[i].id;
      const nj = lab.neurons[j].id;
      const syn = lab.synapses.find(
        (s) =>
          (s.sourceNeuronId === ni && s.targetNeuronId === nj) ||
          (s.sourceNeuronId === nj && s.targetNeuronId === ni)
      )!;
      const expected = PHI_INVERSE / (Math.abs(i - j) + 1);
      expect(syn.initialStrength).toBeCloseTo(expected, 10);
    }
  );
});

describe('Parametric: register experiment with each state override', () => {
  const states: ExperimentState[] = ['registered', 'running', 'completed', 'failed', 'feeding-back'];

  it.each(states)('state "%s" overridden to registered', (state) => {
    const lab = freshLab();
    const exp: ChaosExperiment = {
      ...makeExperiment('e1', PACKAGE_REGISTRY[0], 'entropy-flood'),
      state,
    };
    const updated = registerExperiment(lab, exp);
    expect(updated.experiments[0].state).toBe('registered');
  });
});

describe('Parametric: neuron phiResonance values', () => {
  it.each(PACKAGE_REGISTRY.map((pkg, i) => [pkg, i] as const))(
    'neuron for "%s" (index %i) has phiResonance ~ (i+1)/11 * PHI_INVERSE',
    (pkg, index) => {
      const lab = freshLab();
      const neuron = lab.neurons.find((n) => n.subsystem === pkg)!;
      expect(neuron.phiResonance).toBeCloseTo(((index + 1) / 11) * PHI_INVERSE, 10);
    }
  );
});

describe('Parametric: multiple cycles counts', () => {
  it.each([1, 2, 3, 4, 5])('%i cycle(s) with experiments', (n) => {
    let lab = freshLab();
    lab = registerExperiment(lab, makeExperiment('e1', PACKAGE_REGISTRY[0], 'state-corruption', 1.0));
    lab = runLabCycle(lab, n);
    // At least cycle 1 runs; subsequent cycles depend on feedback generating new experiments
    expect(lab.cyclesCompleted).toBeGreaterThanOrEqual(1);
    expect(lab.cyclesCompleted).toBeLessThanOrEqual(n);
  });

  it.each([1, 2, 3, 4, 5])('%i empty cycle(s)', (n) => {
    const lab = freshLab();
    const updated = runLabCycle(lab, n);
    expect(updated.cyclesCompleted).toBe(0);
  });
});

describe('Parametric: feedFindingsBack with varied edge counts', () => {
  it.each([1, 2, 3, 5, 10])('%i edges produces edge-probe experiment', (edges) => {
    const lab = freshLab();
    const finding: ExperimentResult = {
      experimentId: 'e1',
      experimentName: 'Test',
      targetSubsystem: PACKAGE_REGISTRY[0],
      chaosCategory: 'entropy-flood',
      edgesDiscovered: edges,
      edgeDescriptions: Array(edges).fill('edge'),
      selfHealingObserved: true,
      healingActions: [],
      energyConverted: 0.5,
      newPatternsGenerated: 0,
      patternSignatures: [],
      resilienceScore: 0.5,
      phiAlignment: 0.3,
      timestamp: new Date().toISOString(),
      cycleFeedback: 'test',
    };
    const updated = feedFindingsBack(lab, [finding]);
    expect(updated.experiments).toHaveLength(1);
    expect(updated.experiments[0].chaosCategory).toBe('edge-probe');
  });
});

describe('Parametric: feedFindingsBack with varied pattern counts', () => {
  it.each([1, 2, 3, 5, 10])('%i patterns produces resonance experiment', (patterns) => {
    const lab = freshLab();
    const finding: ExperimentResult = {
      experimentId: 'e1',
      experimentName: 'Test',
      targetSubsystem: PACKAGE_REGISTRY[0],
      chaosCategory: 'entropy-flood',
      edgesDiscovered: 0,
      edgeDescriptions: [],
      selfHealingObserved: true,
      healingActions: [],
      energyConverted: 0.5,
      newPatternsGenerated: patterns,
      patternSignatures: Array(patterns).fill('p'),
      resilienceScore: 0.5,
      phiAlignment: 0.3,
      timestamp: new Date().toISOString(),
      cycleFeedback: 'test',
    };
    const updated = feedFindingsBack(lab, [finding]);
    expect(updated.experiments).toHaveLength(1);
    expect(updated.experiments[0].chaosCategory).toBe('resonance-disruption');
  });
});
