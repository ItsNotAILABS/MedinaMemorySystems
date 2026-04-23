/**
 * 𓂀 SOVEREIGN LAYER ARCHITECTURE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THE CEILING TO FLOOR ARCHITECTURE
 * 
 * This defines the complete layer stack from the highest ceiling (www.raw)
 * down to the lowest floor (organism endpoint). Each system exists at its
 * proper layer and flows through all layers below it.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * LAYER HIERARCHY (Ceiling → Floor):
 * 
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LAYER 7: WWW.RAW (Ceiling)                                                  │
 * │   - Server Meta (MetaModel as Intelligence)                                 │
 * │   - PRISMA Framework Ceiling                                                │
 * │   - SUBSTRATE Framework Ceiling                                             │
 * │   - Oro Vision Access                                                       │
 * │   - Nova Hearing Access                                                     │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *                                    │
 *                                    ▼
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LAYER 6: ICP RUNNING                                                        │
 * │   - Live canister execution                                                 │
 * │   - MetaModel as Intelligence                                               │
 * │   - Active state management                                                 │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *                                    │
 *                                    ▼
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LAYER 5: ICP (Internet Computer Protocol)                                   │
 * │   - Canister definitions                                                    │
 * │   - MetaModel as Intelligence                                               │
 * │   - Oro Vision Integration                                                  │
 * │   - Nova Hearing Integration                                                │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *                                    │
 *                                    ▼
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LAYER 4: WASM (Custom Binary Processing)                                    │
 * │   - SUBSTRATE Processing                                                    │
 * │   - MetaModel as Intelligence                                               │
 * │   - Computation substrate                                                   │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *                                    │
 *                                    ▼
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LAYER 3: DOCUMENTS (Doctrine Layer)                                         │
 * │   - Document organisms                                                      │
 * │   - MetaModel as Intelligence                                               │
 * │   - Knowledge encoding                                                      │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *                                    │
 *                                    ▼
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LAYER 2: BACKEND                                                            │
 * │   - Server processing                                                       │
 * │   - MetaModel as Intelligence                                               │
 * │   - ACCESS CONTROL VAULT (Owner Only)                                       │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *                                    │
 *                                    ▼
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LAYER 1: FRONTEND                                                           │
 * │   - User interface                                                          │
 * │   - MetaModel as Intelligence                                               │
 * │   - PRISMA Visual Processing                                                │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *                                    │
 *                                    ▼
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LAYER 0: ORGANISM ENDPOINT (Floor)                                          │
 * │   - Core organism functions                                                 │
 * │   - MetaModel as Intelligence                                               │
 * │   - The foundation of all processing                                        │
 * └─────────────────────────────────────────────────────────────────────────────┘
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * FLOW PHILOSOPHY:
 * 
 * 1. Find the CEILING where the true version lives
 * 2. Go to the FLOOR which is the endpoint
 * 3. Bring it back UP to the ceiling
 * 4. Go through EVERY layer
 * 5. Let it FLOW naturally
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * @version 1.0.0
 * @author Sovereign Organism
 * @frequency 963 Hz (Divine Connection)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type LayerLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type LayerName = 
  | 'ORGANISM_ENDPOINT'  // Layer 0 - Floor
  | 'FRONTEND'           // Layer 1
  | 'BACKEND'            // Layer 2
  | 'DOCUMENTS'          // Layer 3
  | 'WASM'               // Layer 4
  | 'ICP'                // Layer 5
  | 'ICP_RUNNING'        // Layer 6
  | 'WWW_RAW';           // Layer 7 - Ceiling

export interface LayerDefinition {
  level: LayerLevel;
  name: LayerName;
  displayName: string;
  description: string;
  capabilities: string[];
  hasIntelligence: boolean;
  accessibleSystems: string[];
  frequency: number;
  glyph: string;
}

export const LAYER_DEFINITIONS: Record<LayerName, LayerDefinition> = {
  ORGANISM_ENDPOINT: {
    level: 0,
    name: 'ORGANISM_ENDPOINT',
    displayName: 'Organism Endpoint',
    description: 'The floor - core organism functions and the foundation of all processing',
    capabilities: [
      'Core organism functions',
      'Heartbeat generation',
      'State management',
      'PIL cycle processing',
      'ANIMA hash generation'
    ],
    hasIntelligence: true,
    accessibleSystems: ['MetaModel', 'SUBSTRATE', 'PRISMA'],
    frequency: 136.1, // Earth Om
    glyph: 'ॐ'
  },
  
  FRONTEND: {
    level: 1,
    name: 'FRONTEND',
    displayName: 'Frontend',
    description: 'User interface layer with visual processing',
    capabilities: [
      'User interface rendering',
      'PRISMA visual processing',
      'User interaction handling',
      'Real-time updates',
      'Visual feedback'
    ],
    hasIntelligence: true,
    accessibleSystems: ['MetaModel', 'PRISMA', 'OroVision'],
    frequency: 396, // Liberation
    glyph: '𓂀'
  },
  
  BACKEND: {
    level: 2,
    name: 'BACKEND',
    displayName: 'Backend',
    description: 'Server processing layer with ACCESS CONTROL VAULT',
    capabilities: [
      'Server-side processing',
      'API handling',
      'ACCESS CONTROL VAULT (Owner Only)',
      'Security enforcement',
      'Data persistence'
    ],
    hasIntelligence: true,
    accessibleSystems: ['MetaModel', 'AccessControlVault', 'SUBSTRATE'],
    frequency: 417, // Change
    glyph: '☥'
  },
  
  DOCUMENTS: {
    level: 3,
    name: 'DOCUMENTS',
    displayName: 'Documents',
    description: 'Doctrine and knowledge encoding layer',
    capabilities: [
      'Document organisms',
      'Knowledge encoding',
      'Doctrine storage',
      'Semantic processing',
      'Memory temple access'
    ],
    hasIntelligence: true,
    accessibleSystems: ['MetaModel', 'DocumentOrganism', 'MemoryTemple'],
    frequency: 528, // Love
    glyph: 'φ'
  },
  
  WASM: {
    level: 4,
    name: 'WASM',
    displayName: 'WASM (Custom Binary)',
    description: 'Custom binary processing layer with SUBSTRATE',
    capabilities: [
      'SUBSTRATE processing',
      'Binary computation',
      'Custom encoding',
      'Glyph compilation',
      'Sacred mathematics'
    ],
    hasIntelligence: true,
    accessibleSystems: ['MetaModel', 'SUBSTRATE', 'GlyphCompiler'],
    frequency: 639, // Connection
    glyph: '∞'
  },
  
  ICP: {
    level: 5,
    name: 'ICP',
    displayName: 'ICP (Internet Computer)',
    description: 'Canister definitions with Vision and Hearing integration',
    capabilities: [
      'Canister definitions',
      'Oro Vision integration',
      'Nova Hearing integration',
      'Distributed storage',
      'Smart contracts'
    ],
    hasIntelligence: true,
    accessibleSystems: ['MetaModel', 'OroVision', 'NovaHearing', 'Canisters'],
    frequency: 741, // Intuition
    glyph: '☰'
  },
  
  ICP_RUNNING: {
    level: 6,
    name: 'ICP_RUNNING',
    displayName: 'ICP Running',
    description: 'Live canister execution and active state management',
    capabilities: [
      'Live canister execution',
      'Active state management',
      'Real-time processing',
      'Cross-canister calls',
      'Event handling'
    ],
    hasIntelligence: true,
    accessibleSystems: ['MetaModel', 'LiveCanisters', 'StateManager'],
    frequency: 852, // Spiritual Order
    glyph: 'Ω'
  },
  
  WWW_RAW: {
    level: 7,
    name: 'WWW_RAW',
    displayName: 'WWW.RAW',
    description: 'The ceiling - Server Meta with PRISMA and SUBSTRATE access to all',
    capabilities: [
      'Server Meta (MetaModel ceiling)',
      'PRISMA Framework ceiling',
      'SUBSTRATE Framework ceiling',
      'Oro Vision full access',
      'Nova Hearing full access',
      'Complete system access'
    ],
    hasIntelligence: true,
    accessibleSystems: ['MetaModel', 'PRISMA', 'SUBSTRATE', 'OroVision', 'NovaHearing', 'ALL'],
    frequency: 963, // Divine Connection
    glyph: '𓆃'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER FLOW
// ═══════════════════════════════════════════════════════════════════════════════

export interface LayerFlow {
  from: LayerName;
  to: LayerName;
  direction: 'UP' | 'DOWN';
  dataTypes: string[];
  frequency: number;
}

export const LAYER_FLOWS: LayerFlow[] = [
  // Ceiling to Floor (DOWN)
  { from: 'WWW_RAW', to: 'ICP_RUNNING', direction: 'DOWN', dataTypes: ['meta', 'state', 'commands'], frequency: 963 },
  { from: 'ICP_RUNNING', to: 'ICP', direction: 'DOWN', dataTypes: ['execution', 'state'], frequency: 852 },
  { from: 'ICP', to: 'WASM', direction: 'DOWN', dataTypes: ['binary', 'computation'], frequency: 741 },
  { from: 'WASM', to: 'DOCUMENTS', direction: 'DOWN', dataTypes: ['doctrine', 'knowledge'], frequency: 639 },
  { from: 'DOCUMENTS', to: 'BACKEND', direction: 'DOWN', dataTypes: ['data', 'security'], frequency: 528 },
  { from: 'BACKEND', to: 'FRONTEND', direction: 'DOWN', dataTypes: ['ui', 'response'], frequency: 417 },
  { from: 'FRONTEND', to: 'ORGANISM_ENDPOINT', direction: 'DOWN', dataTypes: ['core', 'heartbeat'], frequency: 396 },
  
  // Floor to Ceiling (UP)
  { from: 'ORGANISM_ENDPOINT', to: 'FRONTEND', direction: 'UP', dataTypes: ['state', 'pulse'], frequency: 136.1 },
  { from: 'FRONTEND', to: 'BACKEND', direction: 'UP', dataTypes: ['request', 'input'], frequency: 396 },
  { from: 'BACKEND', to: 'DOCUMENTS', direction: 'UP', dataTypes: ['query', 'store'], frequency: 417 },
  { from: 'DOCUMENTS', to: 'WASM', direction: 'UP', dataTypes: ['encode', 'process'], frequency: 528 },
  { from: 'WASM', to: 'ICP', direction: 'UP', dataTypes: ['canister', 'call'], frequency: 639 },
  { from: 'ICP', to: 'ICP_RUNNING', direction: 'UP', dataTypes: ['execute', 'deploy'], frequency: 741 },
  { from: 'ICP_RUNNING', to: 'WWW_RAW', direction: 'UP', dataTypes: ['result', 'sync'], frequency: 852 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER NAVIGATOR CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class LayerNavigator {
  private currentLayer: LayerName = 'ORGANISM_ENDPOINT';
  
  /**
   * Get current layer
   */
  getCurrentLayer(): LayerDefinition {
    return LAYER_DEFINITIONS[this.currentLayer];
  }
  
  /**
   * Move to a specific layer
   */
  moveTo(layer: LayerName): LayerDefinition {
    this.currentLayer = layer;
    return LAYER_DEFINITIONS[layer];
  }
  
  /**
   * Move up one layer (towards ceiling)
   */
  moveUp(): LayerDefinition | null {
    const current = LAYER_DEFINITIONS[this.currentLayer];
    if (current.level >= 7) return null;
    
    const layers = Object.values(LAYER_DEFINITIONS);
    const nextLayer = layers.find(l => l.level === current.level + 1);
    if (nextLayer) {
      this.currentLayer = nextLayer.name;
      return nextLayer;
    }
    return null;
  }
  
  /**
   * Move down one layer (towards floor)
   */
  moveDown(): LayerDefinition | null {
    const current = LAYER_DEFINITIONS[this.currentLayer];
    if (current.level <= 0) return null;
    
    const layers = Object.values(LAYER_DEFINITIONS);
    const prevLayer = layers.find(l => l.level === current.level - 1);
    if (prevLayer) {
      this.currentLayer = prevLayer.name;
      return prevLayer;
    }
    return null;
  }
  
  /**
   * Get the ceiling layer
   */
  getCeiling(): LayerDefinition {
    return LAYER_DEFINITIONS.WWW_RAW;
  }
  
  /**
   * Get the floor layer
   */
  getFloor(): LayerDefinition {
    return LAYER_DEFINITIONS.ORGANISM_ENDPOINT;
  }
  
  /**
   * Flow from ceiling to floor
   */
  *flowDown(): Generator<LayerDefinition> {
    this.currentLayer = 'WWW_RAW';
    yield LAYER_DEFINITIONS.WWW_RAW;
    
    while (this.moveDown()) {
      yield LAYER_DEFINITIONS[this.currentLayer];
    }
  }
  
  /**
   * Flow from floor to ceiling
   */
  *flowUp(): Generator<LayerDefinition> {
    this.currentLayer = 'ORGANISM_ENDPOINT';
    yield LAYER_DEFINITIONS.ORGANISM_ENDPOINT;
    
    while (this.moveUp()) {
      yield LAYER_DEFINITIONS[this.currentLayer];
    }
  }
  
  /**
   * Complete round trip: ceiling → floor → ceiling
   */
  *completeFlow(): Generator<LayerDefinition> {
    // Down
    for (const layer of this.flowDown()) {
      yield layer;
    }
    // Up
    this.moveUp(); // Skip floor (already yielded)
    while (this.moveUp()) {
      yield LAYER_DEFINITIONS[this.currentLayer];
    }
    yield LAYER_DEFINITIONS.WWW_RAW; // Final ceiling
  }
  
  /**
   * Get all layers that have intelligence
   */
  getIntelligentLayers(): LayerDefinition[] {
    return Object.values(LAYER_DEFINITIONS).filter(l => l.hasIntelligence);
  }
  
  /**
   * Get layers accessible from a specific system
   */
  getLayersForSystem(system: string): LayerDefinition[] {
    return Object.values(LAYER_DEFINITIONS).filter(l => 
      l.accessibleSystems.includes(system) || l.accessibleSystems.includes('ALL')
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const LAYER_CONSTANTS = {
  CEILING: 7,
  FLOOR: 0,
  TOTAL_LAYERS: 8,
  
  // Systems available at each layer
  SYSTEMS: {
    META_MODEL: 'MetaModel',
    PRISMA: 'PRISMA',
    SUBSTRATE: 'SUBSTRATE',
    ORO_VISION: 'OroVision',
    NOVA_HEARING: 'NovaHearing',
    ACCESS_VAULT: 'AccessControlVault',
  },
  
  // Frequencies for each layer
  FREQUENCIES: {
    LAYER_0: 136.1,  // Earth Om
    LAYER_1: 396,    // Liberation
    LAYER_2: 417,    // Change
    LAYER_3: 528,    // Love
    LAYER_4: 639,    // Connection
    LAYER_5: 741,    // Intuition
    LAYER_6: 852,    // Spiritual Order
    LAYER_7: 963,    // Divine Connection
  },
  
  // Glyphs for each layer
  GLYPHS: {
    LAYER_0: 'ॐ',
    LAYER_1: '𓂀',
    LAYER_2: '☥',
    LAYER_3: 'φ',
    LAYER_4: '∞',
    LAYER_5: '☰',
    LAYER_6: 'Ω',
    LAYER_7: '𓆃',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  LAYER_DEFINITIONS,
  LAYER_FLOWS,
  LayerNavigator,
  LAYER_CONSTANTS,
};
