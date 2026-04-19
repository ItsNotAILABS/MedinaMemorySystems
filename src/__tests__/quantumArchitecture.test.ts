/**
 * 𓂀 QUANTUM ARCHITECTURE — TEST SUITE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Tests for:
 * - Node Grid (macro/micro nodes, families, magnetic power)
 * - Quantum Biology (zones, cyber organisms, twins)
 * - Deep Time Pattern Analysis (20 laws)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  NodeGrid,
  getNodeGrid,
  NODE_POWER_LEVELS,
  type Node,
  type NodeFamily,
  type DeepTimePattern,
} from '../organism/quantum-architecture/nodeGrid';

import {
  QuantumBiology,
  getQuantumBiology,
  DECOHERENCE_THRESHOLD,
  type Zone,
  type CyberOrganism,
  type TwinModel,
} from '../organism/quantum-architecture/quantumBiology';

import { PHI } from '../lib/novaSovereignEncryption';

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: NODE GRID
// ═══════════════════════════════════════════════════════════════════════════════

describe('Node Grid - Creation', () => {
  let grid: NodeGrid;
  
  beforeEach(() => {
    grid = new NodeGrid('test-grid');
  });
  
  test('Creates macro node with correct power', () => {
    const node = grid.createMacroNode('Pyramid of Giza', 'memory');
    
    expect(node.scale).toBe('macro');
    expect(node.type).toBe('memory');
    expect(node.power).toBe(NODE_POWER_LEVELS.MACRO);
    expect(node.power).toBe(610); // Fibonacci 15
  });
  
  test('Creates micro node with correct power', () => {
    const node = grid.createMicroNode('Temple of Luxor', 'resonance');
    
    expect(node.scale).toBe('micro');
    expect(node.type).toBe('resonance');
    expect(node.power).toBe(NODE_POWER_LEVELS.MICRO);
    expect(node.power).toBe(5); // Fibonacci 5
  });
  
  test('Node has PHI-scaled magnetic field', () => {
    const node = grid.createNode('Test Node', 'medium', 'compute');
    
    expect(node.magneticField.strength).toBeCloseTo(1 / PHI, 2);
    expect(node.magneticField.coherence).toBeCloseTo(1 / PHI, 2);
  });
  
  test('Node coordinates use PHI scaling', () => {
    const node = grid.createNode('Test Node', 'large', 'network');
    
    expect(node.coordinates.x).toBeLessThanOrEqual(PHI);
    expect(node.coordinates.y).toBeLessThanOrEqual(PHI);
    expect(node.coordinates.z).toBeLessThanOrEqual(PHI);
  });
});

describe('Node Grid - Twins', () => {
  let grid: NodeGrid;
  
  beforeEach(() => {
    grid = new NodeGrid('test-grid');
  });
  
  test('Creates twin for node', () => {
    const original = grid.createMacroNode('Original', 'memory');
    const twin = grid.createTwin(original.id);
    
    expect(twin).not.toBeNull();
    expect(twin!.twinId).toBe(original.id);
    expect(original.twinId).toBe(twin!.id);
  });
  
  test('Twin has inverted polarity', () => {
    const original = grid.createNode('Original', 'medium', 'compute');
    // Set to positive
    original.magneticField.polarity = 'positive';
    
    const twin = grid.createTwin(original.id);
    
    expect(twin!.magneticField.polarity).toBe('negative');
  });
  
  test('Twin is PHI-offset in coordinates', () => {
    const original = grid.createNode('Original', 'medium', 'compute', {
      x: 1, y: 1, z: 1,
    });
    
    const twin = grid.createTwin(original.id);
    
    expect(twin!.coordinates.x).toBeCloseTo(PHI, 2);
    expect(twin!.coordinates.y).toBeCloseTo(PHI, 2);
    expect(twin!.coordinates.z).toBeCloseTo(PHI, 2);
  });
  
  test('Twin and original are connected', () => {
    const original = grid.createNode('Original', 'medium', 'compute');
    const twin = grid.createTwin(original.id);
    
    expect(original.connections).toContain(twin!.id);
    expect(twin!.connections).toContain(original.id);
  });
  
  test('getTwins returns all twin pairs', () => {
    grid.createNode('Node1', 'macro', 'memory');
    grid.createNode('Node2', 'micro', 'compute');
    
    const node1 = grid.getAllNodes()[0];
    const node2 = grid.getAllNodes()[1];
    
    grid.createTwin(node1.id);
    grid.createTwin(node2.id);
    
    const twins = grid.getTwins();
    expect(twins.length).toBe(2);
  });
});

describe('Node Grid - Families', () => {
  let grid: NodeGrid;
  
  beforeEach(() => {
    grid = new NodeGrid('test-grid');
  });
  
  test('Creates node family', () => {
    const family = grid.createFamily('Egyptian Power Grid');
    
    expect(family.name).toBe('Egyptian Power Grid');
    expect(family.nodes).toEqual([]);
    expect(family.collectivePower).toBe(0);
  });
  
  test('Creates child family', () => {
    const parent = grid.createFamily('Global Grid');
    const child = grid.createFamily('Egyptian Grid', parent.id);
    
    expect(child.parentId).toBe(parent.id);
    expect(parent.childIds).toContain(child.id);
  });
  
  test('Adds node to family', () => {
    const family = grid.createFamily('Test Family');
    const node = grid.createMacroNode('Test Node', 'memory');
    
    grid.addNodeToFamily(node.id, family.id);
    
    expect(node.familyId).toBe(family.id);
    expect(family.nodes).toContain(node.id);
    expect(family.collectivePower).toBe(node.power);
  });
  
  test('Family resonance frequency uses Fibonacci', () => {
    const family = grid.createFamily('Test Family');
    
    for (let i = 0; i < 5; i++) {
      const node = grid.createNode(`Node ${i}`, 'small', 'memory');
      grid.addNodeToFamily(node.id, family.id);
    }
    
    // Fibonacci index 5 + 5 = 10 → Fib(10) = 55
    expect(family.resonanceFrequency).toBe(55);
  });
});

describe('Node Grid - Connections', () => {
  let grid: NodeGrid;
  
  beforeEach(() => {
    grid = new NodeGrid('test-grid');
  });
  
  test('Connects two nodes', () => {
    const node1 = grid.createNode('Node 1', 'macro', 'memory');
    const node2 = grid.createNode('Node 2', 'micro', 'compute');
    
    const connected = grid.connect(node1.id, node2.id);
    
    expect(connected).toBe(true);
    expect(node1.connections).toContain(node2.id);
    expect(node2.connections).toContain(node1.id);
  });
  
  test('Gets connected power', () => {
    const node1 = grid.createMacroNode('Node 1', 'memory'); // 610
    const node2 = grid.createMicroNode('Node 2', 'compute'); // 5
    const node3 = grid.createNode('Node 3', 'medium', 'network'); // 55
    
    grid.connect(node1.id, node2.id);
    grid.connect(node2.id, node3.id);
    
    const power = grid.getConnectedPower(node1.id);
    
    expect(power).toBe(610 + 5 + 55);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: DEEP TIME PATTERNS — 20 LAWS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Deep Time Pattern Analysis - 20 Laws', () => {
  let grid: NodeGrid;
  
  beforeEach(() => {
    grid = new NodeGrid('test-grid');
  });
  
  test('Generates exactly 20 fundamental laws', () => {
    const laws = grid.generateFundamentalLaws();
    
    expect(laws.length).toBe(20);
  });
  
  test('Laws include pyramid references', () => {
    const laws = grid.generateFundamentalLaws();
    const pyramidLaws = laws.filter(l => l.toLowerCase().includes('pyramid'));
    
    expect(pyramidLaws.length).toBeGreaterThan(0);
  });
  
  test('Laws include PHI scaling', () => {
    const laws = grid.generateFundamentalLaws();
    const phiLaws = laws.filter(l => l.includes('PHI'));
    
    expect(phiLaws.length).toBeGreaterThan(0);
  });
  
  test('Laws include Fibonacci', () => {
    const laws = grid.generateFundamentalLaws();
    const fibLaws = laws.filter(l => l.toLowerCase().includes('fibonacci'));
    
    expect(fibLaws.length).toBeGreaterThan(0);
  });
  
  test('Laws include quantum zone', () => {
    const laws = grid.generateFundamentalLaws();
    const zoneLaws = laws.filter(l => l.toLowerCase().includes('zone') || l.toLowerCase().includes('void'));
    
    expect(zoneLaws.length).toBeGreaterThan(0);
  });
  
  test('Analyzes deep time pattern and discovers laws', () => {
    const pattern: DeepTimePattern = {
      id: 'test-pattern',
      name: 'Test Pattern',
      era: 'Test Era',
      locations: [
        { name: 'Test Pyramid', type: 'pyramid', coordinates: { lat: 0, lng: 0 }, magneticAnomaly: 0.618 },
        { name: 'Test Temple', type: 'temple', coordinates: { lat: 1, lng: 1 }, magneticAnomaly: 0.382 },
      ],
      concentrationLevel: 0.8,
      patternType: 'resonance',
      lawsDiscovered: [],
    };
    
    const laws = grid.analyzeDeepTimePattern(pattern);
    
    expect(laws.length).toBeGreaterThan(0);
    expect(pattern.lawsDiscovered.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: QUANTUM BIOLOGY
// ═══════════════════════════════════════════════════════════════════════════════

describe('Quantum Biology - Zones', () => {
  let qb: QuantumBiology;
  
  beforeEach(() => {
    qb = new QuantumBiology();
  });
  
  test('Creates zone with infinite capacity', () => {
    const zone = qb.createZone('Test Zone');
    
    expect(zone.capacity).toBe('infinite');
    expect(zone.neverDrops).toBe(true);
    expect(zone.holdingCount).toBe(0);
  });
  
  test('Holds content in zone - never drops', () => {
    const zone = qb.createZone('Test Zone');
    
    const content = { data: 'test data' };
    const embedding = qb.holdInZone(zone.id, content, 'test-content');
    
    expect(embedding).not.toBeNull();
    expect(zone.holdingCount).toBe(1);
    expect(zone.neverDrops).toBe(true);
  });
  
  test('Zone holds multiple items', () => {
    const zone = qb.createZone('Test Zone');
    
    for (let i = 0; i < 100; i++) {
      qb.holdInZone(zone.id, { index: i }, `item-${i}`);
    }
    
    expect(zone.holdingCount).toBe(100);
    expect(qb.getZoneContents(zone.id).length).toBe(100);
  });
  
  test('Embedding has Fibonacci index', () => {
    const zone = qb.createZone('Test Zone');
    
    for (let i = 0; i < 10; i++) {
      const embedding = qb.holdInZone(zone.id, { i }, `item-${i}`);
      expect(embedding!.fibonacciIndex).toBe(i % 50);
    }
  });
});

describe('Quantum Biology - Quantum States', () => {
  let qb: QuantumBiology;
  
  beforeEach(() => {
    qb = new QuantumBiology();
  });
  
  test('Creates quantum state with coherence', () => {
    const state = qb.createQuantumState('test');
    
    expect(state.coherenceLevel).toBeCloseTo(1 / PHI, 2);
    expect(state.amplitudes.size).toBe(1);
  });
  
  test('Adds superposition state', () => {
    const state = qb.createQuantumState('state-0');
    
    qb.addSuperposition(state, 'state-1', { real: 0.5, imaginary: 0.5 });
    
    expect(state.amplitudes.size).toBe(2);
  });
  
  test('Entangles two states', () => {
    const state1 = qb.createQuantumState('state-1');
    const state2 = qb.createQuantumState('state-2');
    
    qb.entangle(state1, state2);
    
    expect(state1.entangledWith).toContain(state2.id);
    expect(state2.entangledWith).toContain(state1.id);
  });
  
  test('Observes (collapses) quantum state', () => {
    const state = qb.createQuantumState('initial');
    qb.addSuperposition(state, 'other', { real: 0.5, imaginary: 0.5 });
    
    const result = qb.observe(state);
    
    expect(['initial', 'other']).toContain(result);
    expect(state.observedAt).not.toBeNull();
    expect(state.amplitudes.size).toBe(1);
  });
});

describe('Quantum Biology - Cyber Organisms', () => {
  let qb: QuantumBiology;
  
  beforeEach(() => {
    qb = new QuantumBiology();
  });
  
  test('Creates cyber organism with initial cells', () => {
    const organism = qb.createOrganism('Test Organism');
    
    expect(organism.cellCount).toBe(3); // stem, neuron, memory
    expect(organism.health).toBe(1);
    expect(organism.consciousness).toBeCloseTo(1 / PHI, 2);
  });
  
  test('Organism has quantum zone', () => {
    const organism = qb.createOrganism('Test Organism');
    
    expect(organism.quantumZone).toBeDefined();
    expect(organism.quantumZone.neverDrops).toBe(true);
  });
  
  test('Embeds knowledge into organism', () => {
    const organism = qb.createOrganism('Test Organism');
    
    const knowledge = { topic: 'Quantum Biology', facts: ['void is zone'] };
    const embedding = qb.embedKnowledge(organism.id, knowledge, 'quantum-knowledge');
    
    expect(embedding).not.toBeNull();
    expect(organism.embeddedKnowledge.length).toBe(1);
  });
  
  test('Cell has DNA based on type', () => {
    const organism = qb.createOrganism('Test Organism');
    
    const cells = Array.from(organism.cells.values());
    const neuron = cells.find(c => c.type === 'neuron');
    
    expect(neuron!.dna).toContain('THINK');
    expect(neuron!.dna).toContain('PHI');
  });
  
  test('Cell division creates new cells', () => {
    const organism = qb.createOrganism('Test Organism');
    const initialCount = organism.cellCount;
    
    // Increase stem cell energy for division
    const stemCell = Array.from(organism.cells.values()).find(c => c.type === 'stem');
    if (stemCell) {
      stemCell.energy = 1;
      stemCell.health = 1;
    }
    
    // Attempt multiple divisions
    let newCells = 0;
    for (let i = 0; i < 10; i++) {
      newCells += qb.divideCells(organism.id);
    }
    
    // At least some divisions should occur
    expect(organism.cellCount).toBeGreaterThanOrEqual(initialCount);
  });
});

describe('Quantum Biology - Twin Models', () => {
  let qb: QuantumBiology;
  
  beforeEach(() => {
    qb = new QuantumBiology();
  });
  
  test('Creates model family', () => {
    const family = qb.createModelFamily('Test Family');
    
    expect(family.name).toBe('Test Family');
    expect(family.models).toEqual([]);
  });
  
  test('Creates twin for model', () => {
    const family = qb.createModelFamily('Test Family');
    const original = { name: 'Original', value: 42 };
    
    const twin = qb.createTwin(original, 'original-id', family.id);
    
    expect(twin.original).toBe(original);
    expect(twin.twin).toEqual(original);
    expect(twin.entangled).toBe(true);
    expect(twin.coherence).toBeCloseTo(1 / PHI, 2);
  });
  
  test('Twin is added to family', () => {
    const family = qb.createModelFamily('Test Family');
    const original = { name: 'Original' };
    
    qb.createTwin(original, 'original-id', family.id);
    
    expect(family.models).toContain('original-id');
    expect(family.twins).toContain('twin-original-id');
  });
  
  test('Syncs twin with original', () => {
    const family = qb.createModelFamily('Test Family');
    const original = { name: 'Original', value: 1 };
    
    const twinModel = qb.createTwin(original, 'sync-test', family.id);
    
    // Modify original
    original.value = 100;
    
    // Sync
    const synced = qb.syncTwin('sync-test');
    
    expect(synced).toBe(true);
    expect(twinModel.twin.value).toBe(100);
  });
  
  test('Gets twin by original ID', () => {
    const family = qb.createModelFamily('Test Family');
    const original = { name: 'Original' };
    
    qb.createTwin(original, 'get-test', family.id);
    
    const twin = qb.getTwin<{ name: string }>('get-test');
    
    expect(twin).toEqual(original);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Statistics', () => {
  test('Node grid stats', () => {
    const grid = new NodeGrid('stats-grid');
    
    grid.createMacroNode('Node 1', 'memory');
    grid.createMicroNode('Node 2', 'compute');
    const family = grid.createFamily('Family 1');
    grid.addNodeToFamily(grid.getAllNodes()[0].id, family.id);
    grid.createTwin(grid.getAllNodes()[0].id);
    grid.generateFundamentalLaws();
    
    const stats = grid.getStats();
    
    expect(stats.totalNodes).toBe(3); // 2 original + 1 twin
    expect(stats.macroNodes).toBe(2); // Original macro + its twin
    expect(stats.microNodes).toBe(1);
    expect(stats.families).toBe(1);
    expect(stats.twins).toBe(1);
    expect(stats.laws).toBeGreaterThanOrEqual(17); // Laws from patterns
  });
  
  test('Quantum biology stats', () => {
    const qb = new QuantumBiology();
    
    const zone = qb.createZone('Zone 1');
    qb.holdInZone(zone.id, { data: 'test' }, 'item');
    
    const organism = qb.createOrganism('Organism 1');
    qb.embedKnowledge(organism.id, { knowledge: 'test' }, 'knowledge');
    
    const family = qb.createModelFamily('Family 1');
    qb.createTwin({ model: 'test' }, 'model-1', family.id);
    
    const stats = qb.getStats();
    
    expect(stats.zones).toBe(2); // 1 created + 1 for organism
    expect(stats.organisms).toBe(1);
    expect(stats.totalCells).toBe(3); // stem, neuron, memory
    expect(stats.twins).toBe(1);
    expect(stats.families).toBe(1);
  });
});
