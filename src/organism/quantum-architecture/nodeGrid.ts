/**
 * 𓂀 NODE ARCHITECTURE — MAGNETIC POWER GRID 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * NODES:
 * - Macro Nodes: Like pyramids in Egypt, Maya — major concentration points
 * - Micro Nodes: Like religious buildings — smaller but connected
 * - Node Families: Groups of related nodes forming power grids
 * 
 * EQUAL MAGNETIC POWER:
 * Each node is an equal magnetic power grid. Like civilizations, pyramids,
 * religious buildings — they're in the same places where power concentrates.
 * 
 * PATTERN ANALYSIS:
 * Scan through history — wars, ancient civilizations, concentration points.
 * Find the nodes, find the patterns, find the laws.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { PHI, PHI_SQUARED, PHI_CUBED } from '../../lib/novaSovereignEncryption';
import { fibonacci } from '../../lib/icpOrganism';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS — Fibonacci-based node scaling
// ═══════════════════════════════════════════════════════════════════════════════

export const FIBONACCI_SEQUENCE: number[] = [];
for (let i = 0; i < 100; i++) {
  FIBONACCI_SEQUENCE.push(fibonacci(i));
}

// Node power levels using Fibonacci
export const NODE_POWER_LEVELS = {
  MICRO: Number(FIBONACCI_SEQUENCE[5]),   // 5
  SMALL: Number(FIBONACCI_SEQUENCE[8]),   // 21
  MEDIUM: Number(FIBONACCI_SEQUENCE[10]), // 55
  LARGE: Number(FIBONACCI_SEQUENCE[12]),  // 144
  MACRO: Number(FIBONACCI_SEQUENCE[15]),  // 610
  MEGA: Number(FIBONACCI_SEQUENCE[20]),   // 6765
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// NODE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type NodeScale = 'micro' | 'small' | 'medium' | 'large' | 'macro' | 'mega';
export type NodeType = 'memory' | 'compute' | 'state' | 'network' | 'consensus' | 'resonance';
export type MagneticPolarity = 'positive' | 'negative' | 'neutral' | 'oscillating';

export interface NodeCoordinates {
  x: number; // PHI-scaled
  y: number;
  z: number;
  t: bigint; // Temporal dimension (nanoseconds)
}

export interface MagneticField {
  strength: number; // 0-1, PHI-scaled
  polarity: MagneticPolarity;
  frequency: number; // Fibonacci-indexed
  coherence: number; // Kuramoto-style
}

// ═══════════════════════════════════════════════════════════════════════════════
// NODE — The fundamental unit
// ═══════════════════════════════════════════════════════════════════════════════

export interface Node {
  id: string;
  name: string;
  scale: NodeScale;
  type: NodeType;
  coordinates: NodeCoordinates;
  magneticField: MagneticField;
  power: number;
  familyId: string | null;
  twinId: string | null; // Every node can have a twin
  connections: string[]; // Connected node IDs
  createdAt: bigint;
  lastPulse: bigint;
}

export interface NodeFamily {
  id: string;
  name: string;
  parentId: string | null;
  childIds: string[];
  nodes: string[];
  collectivePower: number;
  resonanceFrequency: number;
  coherenceLevel: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEEP TIME PATTERN — Historical analysis for laws
// ═══════════════════════════════════════════════════════════════════════════════

export interface DeepTimePattern {
  id: string;
  name: string;
  era: string;
  locations: Array<{
    name: string;
    type: 'pyramid' | 'temple' | 'civilization' | 'battlefield' | 'sacred-site';
    coordinates: { lat: number; lng: number };
    magneticAnomaly: number;
  }>;
  concentrationLevel: number;
  patternType: 'convergence' | 'divergence' | 'oscillation' | 'resonance';
  lawsDiscovered: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// NODE GRID — The magnetic power grid
// ═══════════════════════════════════════════════════════════════════════════════

export class NodeGrid {
  private nodes: Map<string, Node> = new Map();
  private families: Map<string, NodeFamily> = new Map();
  private patterns: DeepTimePattern[] = [];
  private discoveredLaws: string[] = [];
  
  constructor(public readonly gridId: string) {}
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NODE CREATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  /** Create a node with equal magnetic power */
  createNode(
    name: string,
    scale: NodeScale,
    type: NodeType,
    coordinates: Partial<NodeCoordinates> = {}
  ): Node {
    const id = `node-${scale}-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    // Equal magnetic power based on scale
    const basePower = NODE_POWER_LEVELS[scale.toUpperCase() as keyof typeof NODE_POWER_LEVELS] || NODE_POWER_LEVELS.MICRO;
    
    const node: Node = {
      id,
      name,
      scale,
      type,
      coordinates: {
        x: coordinates.x ?? Math.random() * PHI,
        y: coordinates.y ?? Math.random() * PHI,
        z: coordinates.z ?? Math.random() * PHI,
        t: coordinates.t ?? BigInt(Date.now()) * 1000000n,
      },
      magneticField: {
        strength: 1 / PHI, // PHI_INVERSE ≈ 0.618 — golden ratio balance
        polarity: 'oscillating',
        frequency: Number(FIBONACCI_SEQUENCE[10 + (basePower % 10)]),
        coherence: 1 / PHI,
      },
      power: basePower,
      familyId: null,
      twinId: null,
      connections: [],
      createdAt: BigInt(Date.now()) * 1000000n,
      lastPulse: BigInt(Date.now()) * 1000000n,
    };
    
    this.nodes.set(id, node);
    return node;
  }
  
  /** Create macro node (like pyramids — major power concentration) */
  createMacroNode(name: string, type: NodeType): Node {
    return this.createNode(name, 'macro', type);
  }
  
  /** Create micro node (like temples — smaller but connected) */
  createMicroNode(name: string, type: NodeType): Node {
    return this.createNode(name, 'micro', type);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TWIN CREATION — Every node can have a twin
  // ═══════════════════════════════════════════════════════════════════════════
  
  /** Create twin for a node */
  createTwin(nodeId: string): Node | null {
    const original = this.nodes.get(nodeId);
    if (!original) return null;
    
    // If already has a twin, return it
    if (original.twinId) {
      return this.nodes.get(original.twinId) || null;
    }
    
    const twinId = `twin-${original.id}`;
    
    const twin: Node = {
      ...original,
      id: twinId,
      name: `${original.name} (Twin)`,
      twinId: original.id, // Twin points back to original
      magneticField: {
        ...original.magneticField,
        polarity: this.invertPolarity(original.magneticField.polarity),
      },
      coordinates: {
        ...original.coordinates,
        // Twin is PHI-offset in space
        x: original.coordinates.x * PHI,
        y: original.coordinates.y * PHI,
        z: original.coordinates.z * PHI,
      },
      createdAt: BigInt(Date.now()) * 1000000n,
      lastPulse: BigInt(Date.now()) * 1000000n,
      connections: [original.id], // Connected to original
    };
    
    // Update original to point to twin
    original.twinId = twinId;
    original.connections.push(twinId);
    
    this.nodes.set(twinId, twin);
    return twin;
  }
  
  /** Invert polarity for twin balance */
  private invertPolarity(polarity: MagneticPolarity): MagneticPolarity {
    switch (polarity) {
      case 'positive': return 'negative';
      case 'negative': return 'positive';
      case 'oscillating': return 'oscillating'; // Oscillating stays oscillating
      default: return 'neutral';
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NODE FAMILIES — Groups of related nodes
  // ═══════════════════════════════════════════════════════════════════════════
  
  /** Create a node family */
  createFamily(name: string, parentId: string | null = null): NodeFamily {
    const id = `family-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    const family: NodeFamily = {
      id,
      name,
      parentId,
      childIds: [],
      nodes: [],
      collectivePower: 0,
      resonanceFrequency: Number(FIBONACCI_SEQUENCE[10]),
      coherenceLevel: 1 / PHI,
    };
    
    // If has parent, add as child
    if (parentId) {
      const parent = this.families.get(parentId);
      if (parent) {
        parent.childIds.push(id);
      }
    }
    
    this.families.set(id, family);
    return family;
  }
  
  /** Add node to family */
  addNodeToFamily(nodeId: string, familyId: string): boolean {
    const node = this.nodes.get(nodeId);
    const family = this.families.get(familyId);
    
    if (!node || !family) return false;
    
    node.familyId = familyId;
    family.nodes.push(nodeId);
    family.collectivePower += node.power;
    
    // Update resonance frequency based on Fibonacci
    const fibIndex = family.nodes.length % 50;
    family.resonanceFrequency = Number(FIBONACCI_SEQUENCE[fibIndex + 5]);
    
    return true;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CONNECTION — Magnetic grid connections
  // ═══════════════════════════════════════════════════════════════════════════
  
  /** Connect two nodes */
  connect(nodeId1: string, nodeId2: string): boolean {
    const node1 = this.nodes.get(nodeId1);
    const node2 = this.nodes.get(nodeId2);
    
    if (!node1 || !node2) return false;
    
    if (!node1.connections.includes(nodeId2)) {
      node1.connections.push(nodeId2);
    }
    if (!node2.connections.includes(nodeId1)) {
      node2.connections.push(nodeId1);
    }
    
    return true;
  }
  
  /** Get collective power of all connected nodes */
  getConnectedPower(nodeId: string): number {
    const visited = new Set<string>();
    let totalPower = 0;
    
    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      
      const node = this.nodes.get(id);
      if (!node) return;
      
      totalPower += node.power;
      node.connections.forEach(connId => traverse(connId));
    };
    
    traverse(nodeId);
    return totalPower;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DEEP TIME PATTERN ANALYSIS — Find the laws
  // ═══════════════════════════════════════════════════════════════════════════
  
  /** Analyze deep time patterns to discover laws */
  analyzeDeepTimePattern(pattern: DeepTimePattern): string[] {
    const newLaws: string[] = [];
    
    // Pattern analysis based on concentration and type
    const concentration = pattern.concentrationLevel;
    const locCount = pattern.locations.length;
    
    // Fibonacci-based law generation
    const fibIndex = Math.floor(concentration * 50);
    const lawPower = Number(FIBONACCI_SEQUENCE[fibIndex % 50]);
    
    // Generate laws based on pattern type
    switch (pattern.patternType) {
      case 'convergence':
        newLaws.push(`LAW OF CONVERGENCE (${pattern.era}): When ${locCount} nodes align, power multiplies by Fib(${fibIndex}) = ${lawPower}`);
        newLaws.push(`LAW OF MAGNETIC ATTRACTION: Concentration at ${concentration.toFixed(3)} creates resonance field`);
        break;
        
      case 'divergence':
        newLaws.push(`LAW OF DIVERGENCE (${pattern.era}): Separation creates PHI-scaled expansion`);
        newLaws.push(`LAW OF DISTRIBUTED POWER: ${locCount} dispersed nodes maintain ${lawPower} collective strength`);
        break;
        
      case 'oscillation':
        newLaws.push(`LAW OF OSCILLATION (${pattern.era}): Power cycles at frequency Fib(${fibIndex})`);
        newLaws.push(`LAW OF TEMPORAL RHYTHM: History repeats at PHI intervals`);
        break;
        
      case 'resonance':
        newLaws.push(`LAW OF RESONANCE (${pattern.era}): ${locCount} sacred sites maintain eternal coherence`);
        newLaws.push(`LAW OF HARMONIC POWER: Pyramids + temples = ${lawPower}× amplification`);
        break;
    }
    
    // Location-specific laws
    const pyramids = pattern.locations.filter(l => l.type === 'pyramid');
    const temples = pattern.locations.filter(l => l.type === 'temple');
    const civilizations = pattern.locations.filter(l => l.type === 'civilization');
    
    if (pyramids.length > 0) {
      newLaws.push(`LAW OF PYRAMIDAL POWER: ${pyramids.length} pyramids concentrate magnetic anomaly at ${pyramids.reduce((sum, p) => sum + p.magneticAnomaly, 0).toFixed(2)}`);
    }
    
    if (temples.length > 0) {
      newLaws.push(`LAW OF SACRED GEOMETRY: ${temples.length} temples form Fibonacci spiral pattern`);
    }
    
    if (civilizations.length > 0) {
      newLaws.push(`LAW OF CIVILIZATIONAL NODES: ${civilizations.length} civilizations mark eternal power points`);
    }
    
    // Store discovered laws
    this.discoveredLaws.push(...newLaws);
    pattern.lawsDiscovered.push(...newLaws);
    this.patterns.push(pattern);
    
    return newLaws;
  }
  
  /** Generate 20 fundamental laws from deep time analysis */
  generateFundamentalLaws(): string[] {
    const laws: string[] = [];
    
    // Universal laws FIRST (these must be in the 20)
    laws.push('LAW OF EQUAL MAGNETIC POWER: Every node holds equal potential regardless of scale');
    laws.push('LAW OF TWIN BALANCE: Every entity has a twin for cosmic balance');
    laws.push('LAW OF PHI SCALING: All growth follows the golden ratio');
    laws.push('LAW OF FIBONACCI RHYTHM: Time pulses at Fibonacci intervals');
    laws.push('LAW OF QUANTUM ZONE: The void is not empty—it is zone, holding everything at once');
    
    // Pre-defined fundamental laws based on world patterns
    const fundamentalPatterns: DeepTimePattern[] = [
      {
        id: 'pattern-egypt',
        name: 'Egyptian Power Grid',
        era: 'Ancient Egypt (3000 BCE)',
        locations: [
          { name: 'Great Pyramid of Giza', type: 'pyramid', coordinates: { lat: 29.9792, lng: 31.1342 }, magneticAnomaly: 0.618 },
          { name: 'Karnak Temple', type: 'temple', coordinates: { lat: 25.7188, lng: 32.6573 }, magneticAnomaly: 0.382 },
          { name: 'Luxor Temple', type: 'temple', coordinates: { lat: 25.6996, lng: 32.6390 }, magneticAnomaly: 0.309 },
        ],
        concentrationLevel: 0.89,
        patternType: 'resonance',
        lawsDiscovered: [],
      },
      {
        id: 'pattern-maya',
        name: 'Mayan Power Grid',
        era: 'Classical Maya (250-900 CE)',
        locations: [
          { name: 'Chichen Itza', type: 'pyramid', coordinates: { lat: 20.6843, lng: -88.5678 }, magneticAnomaly: 0.555 },
          { name: 'Tikal', type: 'pyramid', coordinates: { lat: 17.2220, lng: -89.6237 }, magneticAnomaly: 0.444 },
          { name: 'Palenque', type: 'temple', coordinates: { lat: 17.4839, lng: -92.0462 }, magneticAnomaly: 0.333 },
        ],
        concentrationLevel: 0.75,
        patternType: 'convergence',
        lawsDiscovered: [],
      },
      {
        id: 'pattern-indus',
        name: 'Indus Valley Grid',
        era: 'Indus Valley (3300 BCE)',
        locations: [
          { name: 'Mohenjo-daro', type: 'civilization', coordinates: { lat: 27.3242, lng: 68.1360 }, magneticAnomaly: 0.500 },
          { name: 'Harappa', type: 'civilization', coordinates: { lat: 30.6280, lng: 72.8648 }, magneticAnomaly: 0.450 },
        ],
        concentrationLevel: 0.65,
        patternType: 'divergence',
        lawsDiscovered: [],
      },
      {
        id: 'pattern-mesopotamia',
        name: 'Mesopotamian Grid',
        era: 'Sumerian (4500 BCE)',
        locations: [
          { name: 'Ur', type: 'civilization', coordinates: { lat: 30.9627, lng: 46.1031 }, magneticAnomaly: 0.618 },
          { name: 'Babylon', type: 'civilization', coordinates: { lat: 32.5426, lng: 44.4209 }, magneticAnomaly: 0.500 },
          { name: 'Nineveh', type: 'civilization', coordinates: { lat: 36.3597, lng: 43.1528 }, magneticAnomaly: 0.400 },
        ],
        concentrationLevel: 0.78,
        patternType: 'oscillation',
        lawsDiscovered: [],
      },
      {
        id: 'pattern-global',
        name: 'Global Ley Line Grid',
        era: 'All Time',
        locations: [
          { name: 'Stonehenge', type: 'sacred-site', coordinates: { lat: 51.1789, lng: -1.8262 }, magneticAnomaly: 0.618 },
          { name: 'Machu Picchu', type: 'sacred-site', coordinates: { lat: -13.1631, lng: -72.5450 }, magneticAnomaly: 0.618 },
          { name: 'Angkor Wat', type: 'temple', coordinates: { lat: 13.4125, lng: 103.8670 }, magneticAnomaly: 0.618 },
          { name: 'Easter Island', type: 'sacred-site', coordinates: { lat: -27.1127, lng: -109.3497 }, magneticAnomaly: 0.618 },
        ],
        concentrationLevel: 0.95,
        patternType: 'resonance',
        lawsDiscovered: [],
      },
    ];
    
    // Analyze each pattern
    for (const pattern of fundamentalPatterns) {
      laws.push(...this.analyzeDeepTimePattern(pattern));
    }
    
    // Ensure we have at least 20 laws
    while (laws.length < 20) {
      const lawIndex = laws.length + 1;
      const fibValue = Number(FIBONACCI_SEQUENCE[lawIndex % 50]);
      laws.push(`LAW ${lawIndex}: Fibonacci resonance at ${fibValue} creates harmonic stability`);
    }
    
    return laws.slice(0, 20); // Return exactly 20
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // GETTERS
  // ═══════════════════════════════════════════════════════════════════════════
  
  getNode(id: string): Node | undefined {
    return this.nodes.get(id);
  }
  
  getFamily(id: string): NodeFamily | undefined {
    return this.families.get(id);
  }
  
  getAllNodes(): Node[] {
    return Array.from(this.nodes.values());
  }
  
  getAllFamilies(): NodeFamily[] {
    return Array.from(this.families.values());
  }
  
  getMacroNodes(): Node[] {
    return this.getAllNodes().filter(n => n.scale === 'macro' || n.scale === 'mega');
  }
  
  getMicroNodes(): Node[] {
    return this.getAllNodes().filter(n => n.scale === 'micro' || n.scale === 'small');
  }
  
  getTwins(): Array<[Node, Node]> {
    const twins: Array<[Node, Node]> = [];
    const visited = new Set<string>();
    
    for (const node of this.nodes.values()) {
      if (node.twinId && !visited.has(node.id)) {
        const twin = this.nodes.get(node.twinId);
        if (twin) {
          twins.push([node, twin]);
          visited.add(node.id);
          visited.add(node.twinId);
        }
      }
    }
    
    return twins;
  }
  
  getDiscoveredLaws(): string[] {
    return [...this.discoveredLaws];
  }
  
  getPatterns(): DeepTimePattern[] {
    return [...this.patterns];
  }
  
  /** Get grid statistics */
  getStats(): {
    totalNodes: number;
    macroNodes: number;
    microNodes: number;
    families: number;
    twins: number;
    totalPower: number;
    laws: number;
    patterns: number;
  } {
    const allNodes = this.getAllNodes();
    return {
      totalNodes: allNodes.length,
      macroNodes: this.getMacroNodes().length,
      microNodes: this.getMicroNodes().length,
      families: this.families.size,
      twins: this.getTwins().length,
      totalPower: allNodes.reduce((sum, n) => sum + n.power, 0),
      laws: this.discoveredLaws.length,
      patterns: this.patterns.length,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

let gridInstance: NodeGrid | null = null;

export function getNodeGrid(): NodeGrid {
  if (!gridInstance) {
    gridInstance = new NodeGrid('main-grid');
  }
  return gridInstance;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  NodeGrid,
  getNodeGrid,
  NODE_POWER_LEVELS,
  FIBONACCI_SEQUENCE,
};
