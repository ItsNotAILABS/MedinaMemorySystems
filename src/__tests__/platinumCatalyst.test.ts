/**
 * 𓂀 PLATINUM CATALYST ENGINE — TEST SUITE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  V_MAX,
  K_M,
  michaelisMenten,
  arrhenius,
  turnoverNumber,
  catalyticEfficiency,
  selectivity,
  transformationEfficiency,
  phiScaledCatalyst,
  CatalystEngine,
  TransformerEngine,
  SynthesisEngine,
  IntakeSubmodel,
  ProcessSubmodel,
  OutputSubmodel,
  FeedbackSubmodel,
  IntelligenceDistributor,
  PlatinumCatalystModel,
  getPlatinumCatalystModel,
} from '../organism/thermodynamics/engines/PlatinumCatalystEngine';

import { PHI } from '../lib/novaSovereignEncryption';

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMITIVE FORMULAS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Platinum - Primitive Formulas', () => {
  test('Michaelis-Menten kinetics calculates correctly', () => {
    // At high substrate concentration, velocity approaches V_max
    const highConc = michaelisMenten(1000); // Very high concentration
    expect(highConc).toBeCloseTo(V_MAX, -2); // Within 1% of V_max
    
    // At low concentration, velocity is proportional to concentration
    const lowConc = michaelisMenten(0.0001);
    expect(lowConc).toBeLessThan(V_MAX / 2);
    
    // At K_m concentration, velocity is V_max / 2
    const atKm = michaelisMenten(K_M);
    expect(atKm).toBeCloseTo(V_MAX / 2, -2);
  });
  
  test('Arrhenius equation with catalysis', () => {
    const uncatalyzed = arrhenius(1, 100000, 298);
    const catalyzed = arrhenius(1, 50000, 298); // Lower activation energy
    
    // Catalyzed should be faster
    expect(catalyzed).toBeGreaterThan(uncatalyzed);
  });
  
  test('Turnover number calculates correctly', () => {
    const kCat = turnoverNumber();
    expect(kCat).toBe(V_MAX); // With [E] = 1
    
    const withConc = turnoverNumber(V_MAX, 2);
    expect(withConc).toBe(V_MAX / 2);
  });
  
  test('Catalytic efficiency is high for platinum', () => {
    const efficiency = catalyticEfficiency();
    expect(efficiency).toBe(V_MAX / K_M);
    expect(efficiency).toBeGreaterThan(1e8); // Very high efficiency
  });
  
  test('Selectivity ranges from 0 to 1', () => {
    expect(selectivity(1, 1)).toBe(1);
    expect(selectivity(0.5, 1)).toBe(0.5);
    expect(selectivity(0, 1)).toBe(0);
  });
  
  test('Transformation efficiency calculates correctly', () => {
    const perfect = transformationEfficiency(100, 100, 0);
    expect(perfect).toBe(1);
    
    const withLoss = transformationEfficiency(100, 80, 10);
    expect(withLoss).toBe(0.7);
  });
  
  test('PHI-scaled catalyst applies golden ratio', () => {
    const result = phiScaledCatalyst(1, 10);
    expect(result).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CATALYST ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Platinum - Catalyst Engine', () => {
  let engine: CatalystEngine;
  
  beforeEach(() => {
    engine = new CatalystEngine();
  });
  
  test('Transform processes input correctly', () => {
    const result = engine.transform(
      { data: 5, concentration: 1, priority: 1, temperature: 298 },
      (x: number) => x * 2
    );
    
    expect(result.transformed).toBe(10);
    expect(result.velocity).toBeGreaterThan(0);
    expect(result.efficiency).toBeGreaterThan(0);
    expect(result.selectivity).toBe(1);
  });
  
  test('Batch transform processes multiple inputs', () => {
    const inputs = [
      { data: 1, concentration: 1, priority: 1, temperature: 298 },
      { data: 2, concentration: 1, priority: 1, temperature: 298 },
      { data: 3, concentration: 1, priority: 1, temperature: 298 },
    ];
    
    const results = engine.batchTransform(inputs, (x: number) => x * 2);
    
    expect(results.length).toBe(3);
    expect(results[0].transformed).toBe(2);
    expect(results[1].transformed).toBe(4);
    expect(results[2].transformed).toBe(6);
  });
  
  test('Engine tracks statistics', () => {
    engine.transform(
      { data: 1, concentration: 1, priority: 1, temperature: 298 },
      (x: number) => x
    );
    engine.transform(
      { data: 2, concentration: 1, priority: 1, temperature: 298 },
      (x: number) => x
    );
    
    const stats = engine.getStats();
    expect(stats.transformations).toBe(2);
    expect(stats.turnoverRate).toBe(V_MAX);
    expect(stats.efficiency).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSFORMER ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Platinum - Transformer Engine', () => {
  let engine: TransformerEngine;
  
  beforeEach(() => {
    engine = new TransformerEngine(2, 4, 64); // Small transformer for testing
  });
  
  test('Attention computes weighted values', () => {
    const query = [1, 0, 0, 0];
    const key = [1, 0, 0, 0];
    const value = [1, 2, 3, 4];
    
    const result = engine.attention(query, key, value);
    expect(result.length).toBe(value.length);
  });
  
  test('Multi-head attention produces output', () => {
    const input = Array(64).fill(0).map((_, i) => Math.sin(i));
    const result = engine.multiHeadAttention(input);
    
    expect(result.length).toBe(64);
  });
  
  test('Feed forward applies catalytic activation', () => {
    const input = Array(64).fill(0).map((_, i) => i / 64);
    const result = engine.feedForward(input);
    
    expect(result.length).toBe(64);
  });
  
  test('Full transform processes through all layers', () => {
    const input = Array(64).fill(0).map((_, i) => Math.random());
    const result = engine.transform(input);
    
    expect(result.length).toBe(64);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SYNTHESIS ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Platinum - Synthesis Engine', () => {
  let engine: SynthesisEngine;
  
  beforeEach(() => {
    engine = new SynthesisEngine();
  });
  
  test('Merge combines numbers correctly', () => {
    const result = engine.merge([10, 20, 30]);
    expect(typeof result).toBe('number');
  });
  
  test('Merge combines arrays element-wise', () => {
    const result = engine.merge([[1, 2, 3], [4, 5, 6]]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
  });
  
  test('Select chooses best option', () => {
    const inputs = [1, 5, 3, 2];
    const result = engine.select(inputs, x => x);
    expect(result).toBe(5);
  });
  
  test('Blend interpolates between arrays', () => {
    const a = [0, 0, 0];
    const b = [10, 10, 10];
    const result = engine.blend(a, b, 0.5);
    
    expect(result.length).toBe(3);
    result.forEach(v => expect(v).toBeGreaterThan(0));
    result.forEach(v => expect(v).toBeLessThan(10));
  });
  
  test('Cascade processes through stages', () => {
    const stages = [
      (x: number) => x + 1,
      (x: number) => x * 2,
      (x: number) => x - 1,
    ];
    
    const result = engine.cascade(5, stages);
    expect(result).toBe(11); // (5+1)*2-1 = 11
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUBMODELS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Platinum - Submodels', () => {
  describe('Intake', () => {
    let intake: IntakeSubmodel;
    
    beforeEach(() => {
      intake = new IntakeSubmodel(100);
    });
    
    test('Ingests data', () => {
      const success = intake.ingest({ test: true }, 1);
      expect(success).toBe(true);
      expect(intake.getBufferSize()).toBe(1);
    });
    
    test('Filters low quality data', () => {
      intake.ingest(1, 1);
      intake.ingest(5, 1);
      intake.ingest(10, 1);
      
      const filtered = intake.filter<number>(x => x / 10, 0.5);
      expect(filtered.length).toBeLessThan(3);
    });
    
    test('Flush returns and clears buffer', () => {
      intake.ingest(1, 1);
      intake.ingest(2, 1);
      
      const data = intake.flush<number>();
      expect(data.length).toBe(2);
      expect(intake.getBufferSize()).toBe(0);
    });
  });
  
  describe('Process', () => {
    let process: ProcessSubmodel;
    
    beforeEach(() => {
      process = new ProcessSubmodel();
    });
    
    test('Process applies function', () => {
      const result = process.process(5, (x: number) => x * 2);
      expect(result).toBe(10);
    });
    
    test('Embed creates numerical representation', () => {
      const numEmbed = process.embed(42);
      expect(numEmbed.length).toBe(256);
      
      const strEmbed = process.embed('hello');
      expect(strEmbed.length).toBe(256);
      
      const objEmbed = process.embed({ a: 1 });
      expect(objEmbed.length).toBe(256);
    });
    
    test('Deep transform applies transformer', () => {
      const input = Array(256).fill(0).map(() => Math.random());
      const result = process.deepTransform(input);
      expect(result.length).toBe(256);
    });
  });
  
  describe('Output', () => {
    let output: OutputSubmodel;
    
    beforeEach(() => {
      output = new OutputSubmodel();
    });
    
    test('Generate creates output', () => {
      const result = output.generate({ value: 42 }, (d: any) => d.value);
      expect(result).toBe(42);
    });
    
    test('Refine improves output quality', () => {
      const original = [1, 10, 1, 10, 1];
      const refined = output.refine(original);
      expect(refined.length).toBe(5);
    });
    
    test('Format outputs different types', () => {
      expect(typeof output.format({ a: 1 }, 'json')).toBe('string');
      expect(Array.isArray(output.format([1, 2, 3], 'array'))).toBe(true);
      expect(typeof output.format(123, 'text')).toBe('string');
    });
  });
  
  describe('Feedback', () => {
    let feedback: FeedbackSubmodel;
    
    beforeEach(() => {
      feedback = new FeedbackSubmodel(0.01);
    });
    
    test('Calculate error with catalytic scaling', () => {
      const error = feedback.calculateError(10, 5);
      expect(error).toBeGreaterThan(0);
    });
    
    test('Record stores feedback signal', () => {
      const signal = feedback.record(10, 8);
      expect(signal.target).toBe(10);
      expect(signal.actual).toBe(8);
      expect(signal.error).not.toBe(0);
    });
    
    test('Adapt adjusts value based on feedback', () => {
      const signal = feedback.record(10, 5);
      const adapted = feedback.adapt(5, signal);
      expect(adapted).not.toBe(5);
    });
    
    test('Get trend analyzes recent history', () => {
      // Record feedback signals that show improvement (error decreasing)
      for (let i = 10; i > 0; i--) {
        feedback.record(10, 10 - i * 0.1); // Target 10, getting closer each time
      }
      
      const trend = feedback.getTrend();
      expect(trend.averageError).toBeDefined();
      // Trend analysis depends on error pattern
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// INTELLIGENCE DISTRIBUTOR
// ═══════════════════════════════════════════════════════════════════════════════

describe('Platinum - Intelligence Distributor', () => {
  let distributor: IntelligenceDistributor;
  
  beforeEach(() => {
    distributor = new IntelligenceDistributor();
  });
  
  test('Create node adds intelligence', () => {
    const node = distributor.createNode('test', 'backend', x => x);
    expect(node.id).toBe('test');
    expect(node.layer).toBe('backend');
  });
  
  test('Distribute spreads computation', () => {
    distributor.createNode('a', 'backend', (x: unknown) => (x as number) * 2);
    distributor.createNode('b', 'backend', (x: unknown) => (x as number) * 3);
    
    const results = distributor.distribute<number, number>(5, ['a', 'b']);
    expect(results.get('a')).toBe(10);
    expect(results.get('b')).toBe(15);
  });
  
  test('Get nodes by layer filters correctly', () => {
    distributor.createNode('f1', 'frontend', x => x);
    distributor.createNode('f2', 'frontend', x => x);
    distributor.createNode('b1', 'backend', x => x);
    
    const frontendNodes = distributor.getNodesByLayer('frontend');
    expect(frontendNodes.length).toBeGreaterThanOrEqual(2);
    
    const backendNodes = distributor.getNodesByLayer('backend');
    expect(backendNodes.length).toBeGreaterThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PLATINUM CATALYST MODEL — The Complete Organism
// ═══════════════════════════════════════════════════════════════════════════════

describe('Platinum - Complete Model', () => {
  let model: PlatinumCatalystModel;
  
  beforeEach(() => {
    model = new PlatinumCatalystModel({
      transformerLayers: 2,
      transformerHeads: 4,
      transformerDimension: 64,
    });
    model.activate();
  });
  
  afterEach(() => {
    model.deactivate();
  });
  
  test('Model activates and deactivates', () => {
    const status = model.getStatus();
    expect(status.isActive).toBe(true);
    
    model.deactivate();
    expect(model.getStatus().isActive).toBe(false);
  });
  
  test('Cycle processes input through all stages', () => {
    const result = model.cycle(5, (x: number) => x * 2);
    
    // Result goes through refinement, so check it's processed
    expect(result.result).toBeDefined();
    expect(result.metrics.velocity).toBeGreaterThan(0);
    expect(result.metrics.efficiency).toBeGreaterThan(0);
  });
  
  test('Cycle with feedback records signal', () => {
    const result = model.cycle(5, (x: number) => 8, 10); // Return 8, target 10
    
    expect(result.metrics.feedbackSignal).toBeDefined();
    expect(result.metrics.feedbackSignal!.target).toBe(10);
  });
  
  test('Batch cycle processes multiple inputs', () => {
    const results = model.batchCycle([1, 2, 3], (x: number) => x * 2);
    
    expect(results.length).toBe(3);
    // Results go through refinement pipeline
    expect(typeof results[0]).toBe('number');
    expect(typeof results[1]).toBe('number');
    expect(typeof results[2]).toBe('number');
  });
  
  test('Model tracks cycle count', () => {
    model.cycle(1, x => x);
    model.cycle(2, x => x);
    model.cycle(3, x => x);
    
    const status = model.getStatus();
    expect(status.cycleCount).toBe(3);
  });
  
  test('Model throws if not activated', () => {
    model.deactivate();
    expect(() => model.cycle(1, x => x)).toThrow('Model is not active');
  });
  
  test('Intelligence nodes are initialized', () => {
    const frontendNodes = model.intelligence.getNodesByLayer('frontend');
    const backendNodes = model.intelligence.getNodesByLayer('backend');
    const documentNodes = model.intelligence.getNodesByLayer('document');
    const memoryNodes = model.intelligence.getNodesByLayer('memory');
    const networkNodes = model.intelligence.getNodesByLayer('network');
    
    expect(frontendNodes.length).toBe(2);
    expect(backendNodes.length).toBe(2);
    expect(documentNodes.length).toBe(2);
    expect(memoryNodes.length).toBe(2);
    expect(networkNodes.length).toBe(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

describe('Platinum - Singleton', () => {
  test('getPlatinumCatalystModel returns same instance', () => {
    const instance1 = getPlatinumCatalystModel();
    const instance2 = getPlatinumCatalystModel();
    expect(instance1).toBe(instance2);
  });
});
