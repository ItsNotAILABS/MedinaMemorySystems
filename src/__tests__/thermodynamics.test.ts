/**
 * 𓂀 THERMODYNAMICS SUBSTRATE — TEST SUITE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Tests for:
 * - All metals and their properties
 * - Primary and secondary formulas
 * - Alpha models
 * - Layer mappings
 * - Alloy compatibility
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  ThermodynamicsSubstrate,
  getThermodynamicsSubstrate,
  METALS,
  ALPHA_MODELS,
  type Metal,
  type MetalSymbol,
  type ArchitectureLayer,
} from '../organism/thermodynamics';

import { PHI } from '../lib/novaSovereignEncryption';

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: METALS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Thermodynamics - Metals', () => {
  let substrate: ThermodynamicsSubstrate;
  
  beforeEach(() => {
    substrate = new ThermodynamicsSubstrate();
  });
  
  test('Has 20 metals defined', () => {
    expect(substrate.getAllMetals().length).toBe(20);
  });
  
  test('Gold (Au) has anti-corruption formula', () => {
    const gold = substrate.getMetal('Au');
    
    expect(gold).toBeDefined();
    expect(gold!.name).toBe('Gold');
    expect(gold!.primaryFormula.name).toBe('Gibbs Free Energy of Oxidation');
    expect(gold!.primaryFormula.value).toBe(Number.POSITIVE_INFINITY);
  });
  
  test('Titanium (Ti) has structural integrity formula', () => {
    const titanium = substrate.getMetal('Ti');
    
    expect(titanium).toBeDefined();
    expect(titanium!.primaryFormula.name).toBe('Yield Strength Ratio');
    expect(titanium!.primaryFormula.value).toBeCloseTo(53.2, 1);
  });
  
  test('Tungsten (W) has highest melting point', () => {
    const tungsten = substrate.getMetal('W');
    
    expect(tungsten).toBeDefined();
    expect(tungsten!.meltingPoint).toBe(3422);
    expect(tungsten!.primaryFormula.name).toBe('Maximum Operating Temperature');
  });
  
  test('Iridium (Ir) has density shield formula', () => {
    const iridium = substrate.getMetal('Ir');
    
    expect(iridium).toBeDefined();
    expect(iridium!.density).toBeCloseTo(22.56, 1);
    expect(iridium!.primaryFormula.name).toBe('Density Shield Factor');
  });
  
  test('Copper (Cu) has conductivity formula', () => {
    const copper = substrate.getMetal('Cu');
    
    expect(copper).toBeDefined();
    expect(copper!.category).toBe('conductive');
    expect(copper!.primaryFormula.name).toBe('Electrical Conductivity');
    expect(copper!.primaryFormula.value).toBeCloseTo(5.96e7, -5);
  });
  
  test('Silver (Ag) has highest conductivity', () => {
    const silver = substrate.getMetal('Ag');
    
    expect(silver).toBeDefined();
    expect(silver!.primaryFormula.name).toBe('Ultimate Conductivity');
    expect(silver!.primaryFormula.value).toBeCloseTo(6.30e7, -5);
  });
  
  test('Platinum (Pt) has catalytic formula', () => {
    const platinum = substrate.getMetal('Pt');
    
    expect(platinum).toBeDefined();
    expect(platinum!.category).toBe('catalytic');
    expect(platinum!.primaryFormula.name).toBe('Catalytic Activity');
  });
  
  test('Osmium (Os) has highest bulk modulus', () => {
    const osmium = substrate.getMetal('Os');
    
    expect(osmium).toBeDefined();
    expect(osmium!.density).toBeCloseTo(22.59, 1); // Densest
    expect(osmium!.primaryFormula.name).toBe('Bulk Modulus');
    expect(osmium!.primaryFormula.value).toBe(462e9);
  });
  
  test('Uranium (U) has fission energy formula', () => {
    const uranium = substrate.getMetal('U');
    
    expect(uranium).toBeDefined();
    expect(uranium!.category).toBe('power');
    expect(uranium!.primaryFormula.name).toBe('Fission Energy');
  });
  
  test('Lead (Pb) has radiation shielding formula', () => {
    const lead = substrate.getMetal('Pb');
    
    expect(lead).toBeDefined();
    expect(lead!.category).toBe('shielding');
    expect(lead!.primaryFormula.name).toBe('Radiation Shielding');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: FORMULAS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Thermodynamics - Formulas', () => {
  let substrate: ThermodynamicsSubstrate;
  
  beforeEach(() => {
    substrate = new ThermodynamicsSubstrate();
  });
  
  test('Each metal has at least 7 secondary formulas', () => {
    for (const metal of substrate.getAllMetals()) {
      expect(metal.secondaryFormulas.length).toBeGreaterThanOrEqual(7);
    }
  });
  
  test('Gold has PHI-scaled protection formula', () => {
    const formulas = substrate.getSecondaryFormulas('Au');
    const phiFormula = formulas.find(f => f.name === 'PHI-Scaled Protection');
    
    expect(phiFormula).toBeDefined();
    expect(phiFormula!.symbol).toBe('P(φ)');
  });
  
  test('Titanium has fatigue resistance formula', () => {
    const formulas = substrate.getSecondaryFormulas('Ti');
    const fatigueFormula = formulas.find(f => f.name === 'Fatigue Resistance');
    
    expect(fatigueFormula).toBeDefined();
    expect(fatigueFormula!.value).toBe(1e9); // cycles
  });
  
  test('All formulas have derivedFrom reference', () => {
    for (const metal of substrate.getAllMetals()) {
      for (const formula of metal.secondaryFormulas) {
        expect(formula.derivedFrom).toBeDefined();
        expect(formula.derivedFrom.length).toBeGreaterThan(0);
      }
    }
  });
  
  test('Calculate formula returns PHI-scaled value', () => {
    const value = substrate.calculateFormula('Au', 'Gibbs Free Energy of Oxidation');
    // Primary formula value is POSITIVE_INFINITY, so result is also infinite
    expect(value).toBe(Number.POSITIVE_INFINITY);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: METAL USES
// ═══════════════════════════════════════════════════════════════════════════════

describe('Thermodynamics - Metal Uses', () => {
  let substrate: ThermodynamicsSubstrate;
  
  beforeEach(() => {
    substrate = new ThermodynamicsSubstrate();
  });
  
  test('Each metal has at least 8 uses', () => {
    for (const metal of substrate.getAllMetals()) {
      expect(metal.uses.length).toBeGreaterThanOrEqual(8);
    }
  });
  
  test('Uses cover all architecture layers', () => {
    const layers: ArchitectureLayer[] = ['core', 'kernel', 'memory', 'network', 'interface', 'defense', 'endpoint', 'tool'];
    
    for (const metal of substrate.getAllMetals()) {
      const usedLayers = new Set(metal.uses.map(u => u.layer));
      
      for (const layer of layers) {
        expect(usedLayers.has(layer)).toBe(true);
      }
    }
  });
  
  test('Gold has defense use with intensity 1', () => {
    const gold = substrate.getMetal('Au');
    const defenseUse = gold!.uses.find(u => u.layer === 'defense');
    
    expect(defenseUse).toBeDefined();
    expect(defenseUse!.intensity).toBe(1);
    expect(defenseUse!.purpose).toContain('corruption');
  });
  
  test('Gets metals for specific layer', () => {
    const coreMetals = substrate.getMetalsForLayer('core');
    
    expect(coreMetals.length).toBe(20); // All metals have core use
    
    // Check that results are sorted by intensity (highest first)
    for (let i = 0; i < coreMetals.length - 1; i++) {
      expect(coreMetals[i].use.intensity).toBeGreaterThanOrEqual(coreMetals[i + 1].use.intensity);
    }
  });
  
  test('Calculate layer protection returns positive value', () => {
    const protection = substrate.calculateLayerProtection('core');
    expect(protection).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: ALPHA MODELS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Thermodynamics - Alpha Models', () => {
  let substrate: ThermodynamicsSubstrate;
  
  beforeEach(() => {
    substrate = new ThermodynamicsSubstrate();
  });
  
  test('Has exactly 10 alpha models', () => {
    expect(substrate.getAllAlphaModels().length).toBe(10);
  });
  
  test('Alpha models have unique IDs', () => {
    const models = substrate.getAllAlphaModels();
    const ids = new Set(models.map(m => m.id));
    
    expect(ids.size).toBe(10);
  });
  
  test('Each alpha model references valid metals', () => {
    const validSymbols = new Set(substrate.getAllMetals().map(m => m.symbol));
    
    for (const model of substrate.getAllAlphaModels()) {
      for (const symbol of model.metals) {
        expect(validSymbols.has(symbol)).toBe(true);
      }
    }
  });
  
  test('Entropy Shield model uses noble metals', () => {
    const entropyShield = substrate.getAlphaModel('alpha-001');
    
    expect(entropyShield).toBeDefined();
    expect(entropyShield!.name).toBe('Entropy Shield');
    expect(entropyShield!.metals).toContain('Au');
  });
  
  test('Gibbs Stability model focuses on stability', () => {
    const gibbsStability = substrate.getAlphaModel('alpha-002');
    
    expect(gibbsStability).toBeDefined();
    expect(gibbsStability!.governingLaw).toContain('Gibbs');
  });
  
  test('Heat Engine model uses refractory metals', () => {
    const heatEngine = substrate.getAlphaModel('alpha-003');
    
    expect(heatEngine).toBeDefined();
    expect(heatEngine!.metals).toContain('W'); // Tungsten for high temp
  });
  
  test('Conduction Flow model uses conductive metals', () => {
    const conduction = substrate.getAlphaModel('alpha-004');
    
    expect(conduction).toBeDefined();
    expect(conduction!.metals).toContain('Ag'); // Silver - highest conductivity
    expect(conduction!.metals).toContain('Cu'); // Copper - second highest
  });
  
  test('Apply alpha model returns effectiveness', () => {
    const effectiveness = substrate.applyAlphaModel('alpha-001', 1);
    expect(effectiveness).toBeGreaterThan(0);
  });
  
  test('Get models for specific metal', () => {
    const goldModels = substrate.getModelsForMetal('Au');
    
    expect(goldModels.length).toBeGreaterThan(0);
    
    // Gold should be in entropy shield, gibbs stability, conduction flow
    const modelIds = goldModels.map(m => m.id);
    expect(modelIds).toContain('alpha-001'); // Entropy Shield
    expect(modelIds).toContain('alpha-002'); // Gibbs Stability
    expect(modelIds).toContain('alpha-004'); // Conduction Flow
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: ALLOYS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Thermodynamics - Alloys', () => {
  let substrate: ThermodynamicsSubstrate;
  
  beforeEach(() => {
    substrate = new ThermodynamicsSubstrate();
  });
  
  test('Gold alloys well with silver', () => {
    expect(substrate.alloysWell('Au', 'Ag')).toBe(true);
  });
  
  test('Gold alloys well with copper', () => {
    expect(substrate.alloysWell('Au', 'Cu')).toBe(true);
  });
  
  test('Titanium alloys well with aluminum', () => {
    expect(substrate.alloysWell('Ti', 'Al')).toBe(true);
  });
  
  test('Platinum group metals alloy well', () => {
    expect(substrate.alloysWell('Pt', 'Ir')).toBe(true);
    expect(substrate.alloysWell('Pt', 'Rh')).toBe(true);
    expect(substrate.alloysWell('Pt', 'Pd')).toBe(true);
  });
  
  test('Alloy strength combines primary formula values', () => {
    const strength = substrate.getAlloyStrength(['Au', 'Ag', 'Cu']);
    expect(strength).toBeGreaterThan(0);
  });
  
  test('Compatible alloys have synergy bonus', () => {
    // Use finite metals (Titanium and Aluminum) for this test
    const titaniumAlone = substrate.getAlloyStrength(['Ti']);
    const titaniumAluminum = substrate.getAlloyStrength(['Ti', 'Al']);
    
    // Ti + Al should be more than Ti alone due to synergy
    expect(titaniumAluminum).toBeGreaterThan(titaniumAlone);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

describe('Thermodynamics - Categories', () => {
  let substrate: ThermodynamicsSubstrate;
  
  beforeEach(() => {
    substrate = new ThermodynamicsSubstrate();
  });
  
  test('Gets noble metals', () => {
    const noble = substrate.getMetalsByCategory('noble');
    expect(noble.length).toBeGreaterThan(0);
    expect(noble.map(m => m.symbol)).toContain('Au');
  });
  
  test('Gets refractory metals', () => {
    const refractory = substrate.getMetalsByCategory('refractory');
    expect(refractory.length).toBeGreaterThan(0);
    expect(refractory.map(m => m.symbol)).toContain('W');
    expect(refractory.map(m => m.symbol)).toContain('Ir');
    expect(refractory.map(m => m.symbol)).toContain('Os');
  });
  
  test('Gets structural metals', () => {
    const structural = substrate.getMetalsByCategory('structural');
    expect(structural.length).toBeGreaterThan(0);
    expect(structural.map(m => m.symbol)).toContain('Ti');
    expect(structural.map(m => m.symbol)).toContain('Fe');
  });
  
  test('Gets conductive metals', () => {
    const conductive = substrate.getMetalsByCategory('conductive');
    expect(conductive.length).toBe(2);
    expect(conductive.map(m => m.symbol)).toContain('Cu');
    expect(conductive.map(m => m.symbol)).toContain('Ag');
  });
  
  test('Gets catalytic metals', () => {
    const catalytic = substrate.getMetalsByCategory('catalytic');
    expect(catalytic.length).toBeGreaterThan(0);
    expect(catalytic.map(m => m.symbol)).toContain('Pt');
    expect(catalytic.map(m => m.symbol)).toContain('Pd');
    expect(catalytic.map(m => m.symbol)).toContain('Rh');
  });
  
  test('Gets power metals', () => {
    const power = substrate.getMetalsByCategory('power');
    expect(power.length).toBe(2);
    expect(power.map(m => m.symbol)).toContain('U');
    expect(power.map(m => m.symbol)).toContain('Th');
  });
  
  test('Gets shielding metals', () => {
    const shielding = substrate.getMetalsByCategory('shielding');
    expect(shielding.length).toBe(1);
    expect(shielding[0].symbol).toBe('Pb');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Thermodynamics - Statistics', () => {
  let substrate: ThermodynamicsSubstrate;
  
  beforeEach(() => {
    substrate = new ThermodynamicsSubstrate();
  });
  
  test('Stats show 20 metals', () => {
    const stats = substrate.getStats();
    expect(stats.totalMetals).toBe(20);
  });
  
  test('Stats show 10 alpha models', () => {
    const stats = substrate.getStats();
    expect(stats.alphaModels).toBe(10);
  });
  
  test('Stats show at least 160 formulas (20 metals × 8 min each)', () => {
    const stats = substrate.getStats();
    expect(stats.totalFormulas).toBeGreaterThanOrEqual(160);
  });
  
  test('Stats show at least 160 uses (20 metals × 8 layers)', () => {
    const stats = substrate.getStats();
    expect(stats.totalUses).toBeGreaterThanOrEqual(160);
  });
  
  test('Stats show all 8 layers used', () => {
    const stats = substrate.getStats();
    const layers: ArchitectureLayer[] = ['core', 'kernel', 'memory', 'network', 'interface', 'defense', 'endpoint', 'tool'];
    
    for (const layer of layers) {
      expect(stats.layers[layer]).toBeGreaterThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

describe('Thermodynamics - Singleton', () => {
  test('getThermodynamicsSubstrate returns same instance', () => {
    const instance1 = getThermodynamicsSubstrate();
    const instance2 = getThermodynamicsSubstrate();
    
    expect(instance1).toBe(instance2);
  });
  
  test('Singleton has all metals', () => {
    const instance = getThermodynamicsSubstrate();
    expect(instance.getAllMetals().length).toBe(20);
  });
});
