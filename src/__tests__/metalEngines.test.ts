/**
 * 𓂀 METAL ENGINES — TEST SUITE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Tests for all always-on metal engines
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  GoldEngine,
  TitaniumEngine,
  TungstenEngine,
  IridiumEngine,
  CopperEngine,
  SilverEngine,
  createEngineRegistry,
  getEngineRegistry,
  startAllEngines,
  stopAllEngines,
  getAllEngineMetrics,
} from '../organism/thermodynamics/engines/MetalEngines';

// ═══════════════════════════════════════════════════════════════════════════════
// GOLD ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Metal Engines - Gold', () => {
  let engine: GoldEngine;
  
  beforeEach(() => {
    engine = new GoldEngine();
  });
  
  afterEach(() => {
    engine.stop();
  });
  
  test('Primary formula returns near-perfect corruption resistance', () => {
    const resistance = engine.computePrimary(1);
    expect(resistance).toBeCloseTo(1, 5); // Very close to 1
  });
  
  test('Secondary formulas derive from primary', () => {
    const secondary = engine.computeSecondary(1);
    expect(secondary.oxidationResistance).toBeCloseTo(1, 5);
    expect(secondary.corruptionProbability).toBeCloseTo(0, 5);
    expect(secondary.surfaceIntegrity).toBeCloseTo(1, 5);
  });
  
  test('Process creates checksum for data', () => {
    const result = engine.process({ test: 'data' });
    expect(result.valid).toBe(true);
    expect(result.checksum).toBeGreaterThan(0);
  });
  
  test('Validate detects corruption', () => {
    const original = { test: 'data' };
    const result = engine.process(original);
    
    // Same data should validate
    expect(engine.validate(original, result.checksum)).toBe(true);
    
    // Different data should fail
    expect(engine.validate({ test: 'corrupted' }, result.checksum)).toBe(false);
  });
  
  test('Engine starts and runs cycles', (done) => {
    engine.start();
    expect(engine.isRunning()).toBe(true);
    
    setTimeout(() => {
      const metrics = engine.getMetrics();
      expect(metrics.cycles).toBeGreaterThan(0);
      done();
    }, 250);
  });
  
  test('Engine tracks corruption attempts', () => {
    engine.reportCorruptionAttempt();
    engine.reportCorruptionAttempt();
    
    // Process some items to have integrity checks
    engine.process({ a: 1 });
    engine.process({ a: 2 });
    
    // Engine should track these
    expect(engine.getMetrics()).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TITANIUM ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Metal Engines - Titanium', () => {
  let engine: TitaniumEngine;
  
  beforeEach(() => {
    engine = new TitaniumEngine();
  });
  
  afterEach(() => {
    engine.stop();
  });
  
  test('Primary formula calculates structural integrity', () => {
    // No load = full integrity
    const full = engine.computePrimary(0);
    expect(full).toBe(1);
    
    // Some load = reduced integrity
    const partial = engine.computePrimary(0.5);
    expect(partial).toBeLessThan(1);
    expect(partial).toBeGreaterThan(0);
  });
  
  test('Secondary formulas calculate correctly', () => {
    const secondary = engine.computeSecondary(1);
    expect(secondary.loadCapacity).toBeGreaterThan(0);
    expect(secondary.fatigueResistance).toBeGreaterThan(0);
    expect(secondary.elasticRecovery).toBeGreaterThan(0);
  });
  
  test('Process handles load', () => {
    const result = engine.process(0.1);
    expect(result.supported).toBe(true);
    expect(result.remainingCapacity).toBeLessThanOrEqual(1);
    expect(result.stress).toBeGreaterThan(0);
  });
  
  test('Load accumulates and releases', () => {
    engine.process(0.1);
    engine.process(0.1);
    const loadAfterAdd = engine.getCurrentLoad();
    
    engine.releaseLoad(0.1);
    const loadAfterRelease = engine.getCurrentLoad();
    
    expect(loadAfterRelease).toBeLessThan(loadAfterAdd);
  });
  
  test('Tracks maximum load', () => {
    engine.process(0.5);
    engine.process(0.3);
    
    expect(engine.getMaxLoad()).toBeGreaterThanOrEqual(0.5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TUNGSTEN ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Metal Engines - Tungsten', () => {
  let engine: TungstenEngine;
  
  beforeEach(() => {
    engine = new TungstenEngine();
  });
  
  afterEach(() => {
    engine.stop();
  });
  
  test('Primary formula calculates thermal integrity', () => {
    // Room temp = high integrity (not quite 1 because temp > 0)
    const roomTemp = engine.computePrimary(298);
    expect(roomTemp).toBeGreaterThan(0.9);
    
    // Higher temp = lower integrity
    const highTemp = engine.computePrimary(2000);
    expect(highTemp).toBeLessThan(roomTemp);
    expect(highTemp).toBeGreaterThan(0);
  });
  
  test('Secondary formulas calculate correctly', () => {
    const secondary = engine.computeSecondary(1);
    expect(secondary.thermalStressResistance).toBeGreaterThan(0);
    expect(secondary.heatDissipation).toBeGreaterThan(0);
    expect(secondary.radiationResistance).toBeGreaterThan(0);
  });
  
  test('Process handles thermal events', () => {
    const result = engine.process(100); // Add 100K
    expect(result.survived).toBe(true);
    expect(result.integrity).toBeLessThanOrEqual(1);
    expect(result.dissipated).toBeGreaterThan(0);
  });
  
  test('Temperature dissipates over time', (done) => {
    engine.start();
    engine.process(500); // Heat up
    
    const initialTemp = engine.getCurrentTemp();
    
    setTimeout(() => {
      const laterTemp = engine.getCurrentTemp();
      expect(laterTemp).toBeLessThan(initialTemp);
      done();
    }, 250);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// IRIDIUM ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Metal Engines - Iridium', () => {
  let engine: IridiumEngine;
  
  beforeEach(() => {
    engine = new IridiumEngine();
  });
  
  afterEach(() => {
    engine.stop();
  });
  
  test('Primary formula calculates defense strength', () => {
    // Weak attack = high defense
    const weakAttack = engine.computePrimary(0.01);
    expect(weakAttack).toBeGreaterThan(0.9);
    
    // Strong attack = still good defense (iridium is dense)
    const strongAttack = engine.computePrimary(1);
    expect(strongAttack).toBeGreaterThan(0);
  });
  
  test('Secondary formulas calculate correctly', () => {
    const secondary = engine.computeSecondary(1);
    expect(secondary.penetrationResistance).toBeGreaterThan(0);
    expect(secondary.coreProtection).toBe(1);
    expect(secondary.impactAbsorption).toBeGreaterThan(0);
  });
  
  test('Process defends against attacks', () => {
    const result = engine.process(0.1);
    expect(typeof result.blocked).toBe('boolean');
    expect(result.defenseStrength).toBeGreaterThan(0);
    expect(result.absorbed).toBeGreaterThan(0);
  });
  
  test('Block rate is tracked', () => {
    // Process multiple attacks
    for (let i = 0; i < 100; i++) {
      engine.process(0.1);
    }
    
    const blockRate = engine.getBlockRate();
    expect(blockRate).toBeGreaterThan(0);
    expect(blockRate).toBeLessThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// COPPER ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Metal Engines - Copper', () => {
  let engine: CopperEngine;
  
  beforeEach(() => {
    engine = new CopperEngine();
  });
  
  afterEach(() => {
    engine.stop();
  });
  
  test('Primary formula calculates transmission efficiency', () => {
    const efficiency = engine.computePrimary(1);
    expect(efficiency).toBeGreaterThan(0);
    expect(efficiency).toBeLessThanOrEqual(1);
  });
  
  test('Secondary formulas calculate correctly', () => {
    const secondary = engine.computeSecondary(1);
    expect(secondary.signalEfficiency).toBeGreaterThan(0);
    expect(secondary.currentCapacity).toBeGreaterThan(0);
    expect(secondary.frequencyResponse).toBeGreaterThan(0);
  });
  
  test('Process transmits signals', () => {
    const result = engine.process({ data: 'test' });
    expect(typeof result.transmitted).toBe('boolean');
    expect(result.latency).toBeGreaterThan(0);
    expect(result.efficiency).toBeGreaterThan(0);
  });
  
  test('Transmit returns data', async () => {
    const data = { test: 'signal' };
    const result = await engine.transmit(data);
    expect(result).toEqual(data);
  });
  
  test('Tracks average latency', () => {
    engine.process(1);
    engine.process(2);
    engine.process(3);
    
    expect(engine.getAverageLatency()).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SILVER ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Metal Engines - Silver', () => {
  let engine: SilverEngine;
  
  beforeEach(() => {
    engine = new SilverEngine();
  });
  
  afterEach(() => {
    engine.stop();
  });
  
  test('Primary formula calculates transmission quality', () => {
    const quality = engine.computePrimary(1);
    // Silver has higher conductivity than copper, so quality > 1
    expect(quality).toBeGreaterThan(1);
  });
  
  test('Secondary formulas calculate correctly', () => {
    const secondary = engine.computeSecondary(1);
    expect(secondary.thermalConductivity).toBeGreaterThan(0);
    expect(secondary.signalPurity).toBeGreaterThan(0.99);
    expect(secondary.reflectivity).toBeGreaterThan(0.9);
  });
  
  test('Process purifies data', () => {
    const result = engine.process({ data: 'test' });
    expect(result.purified).toBeDefined();
    expect(result.purity).toBeGreaterThan(0);
    expect(result.quality).toBeGreaterThan(0);
  });
  
  test('Reflect returns exact copy', () => {
    const data = { test: 'reflect' };
    const reflected = engine.reflect(data);
    expect(reflected).toEqual(data);
  });
  
  test('Tracks purity rate', () => {
    for (let i = 0; i < 100; i++) {
      engine.process(i);
    }
    
    const purityRate = engine.getPurityRate();
    expect(purityRate).toBeGreaterThan(0.9); // Very high purity
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

describe('Metal Engines - Registry', () => {
  afterEach(() => {
    stopAllEngines();
  });
  
  test('Create registry returns all engines', () => {
    const registry = createEngineRegistry();
    expect(registry.gold).toBeInstanceOf(GoldEngine);
    expect(registry.titanium).toBeInstanceOf(TitaniumEngine);
    expect(registry.tungsten).toBeInstanceOf(TungstenEngine);
    expect(registry.iridium).toBeInstanceOf(IridiumEngine);
    expect(registry.copper).toBeInstanceOf(CopperEngine);
    expect(registry.silver).toBeInstanceOf(SilverEngine);
  });
  
  test('Get registry returns singleton', () => {
    const registry1 = getEngineRegistry();
    const registry2 = getEngineRegistry();
    expect(registry1).toBe(registry2);
  });
  
  test('Start all engines', (done) => {
    startAllEngines();
    
    const registry = getEngineRegistry();
    expect(registry.gold.isRunning()).toBe(true);
    expect(registry.titanium.isRunning()).toBe(true);
    expect(registry.tungsten.isRunning()).toBe(true);
    expect(registry.iridium.isRunning()).toBe(true);
    expect(registry.copper.isRunning()).toBe(true);
    expect(registry.silver.isRunning()).toBe(true);
    
    done();
  });
  
  test('Get all metrics', () => {
    startAllEngines();
    
    const metrics = getAllEngineMetrics();
    expect(metrics.gold).toBeDefined();
    expect(metrics.titanium).toBeDefined();
    expect(metrics.tungsten).toBeDefined();
    expect(metrics.iridium).toBeDefined();
    expect(metrics.copper).toBeDefined();
    expect(metrics.silver).toBeDefined();
  });
  
  test('Stop all engines', () => {
    startAllEngines();
    stopAllEngines();
    
    const registry = getEngineRegistry();
    expect(registry.gold.isRunning()).toBe(false);
    expect(registry.titanium.isRunning()).toBe(false);
    expect(registry.tungsten.isRunning()).toBe(false);
    expect(registry.iridium.isRunning()).toBe(false);
    expect(registry.copper.isRunning()).toBe(false);
    expect(registry.silver.isRunning()).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE EVENTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Metal Engines - Events', () => {
  test('Engine emits state change events', (done) => {
    const engine = new GoldEngine();
    const events: string[] = [];
    
    engine.subscribe((event) => {
      if (event.type === 'state_change') {
        events.push(event.data as string);
      }
    });
    
    engine.start();
    
    setTimeout(() => {
      engine.stop();
      expect(events).toContain('starting');
      expect(events).toContain('running');
      expect(events).toContain('stopped');
      done();
    }, 50);
  });
  
  test('Engine emits cycle events', (done) => {
    const engine = new GoldEngine();
    let cycleCount = 0;
    
    engine.subscribe((event) => {
      if (event.type === 'cycle') {
        cycleCount++;
      }
    });
    
    engine.start();
    
    setTimeout(() => {
      engine.stop();
      expect(cycleCount).toBeGreaterThan(0);
      done();
    }, 250);
  });
  
  test('Unsubscribe stops events', () => {
    const engine = new GoldEngine();
    let eventCount = 0;
    
    const unsubscribe = engine.subscribe(() => {
      eventCount++;
    });
    
    unsubscribe();
    engine.start();
    engine.stop();
    
    expect(eventCount).toBe(0);
  });
});
