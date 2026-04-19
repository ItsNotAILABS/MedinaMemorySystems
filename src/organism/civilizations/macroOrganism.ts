/**
 * 𓂀 ANCIENT CIVILIZATIONS — MACRO-ORGANISMAL ARCHITECTURE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THE RIGHT WAY TO READ CIVILIZATION
 * 
 * NOT as a list of artifacts.
 * AS a macro-organismal architecture for stabilizing relations between:
 *   - Field
 *   - Matter
 *   - Memory
 *   - Power
 *   - Ritual
 *   - Transfer
 * 
 * Pyramids, temples, roads, calendars, glyph systems, trade routes, legal forms,
 * astronomical alignments, metallurgy, irrigation, burial systems, and city-planning
 * are NOT miscellaneous achievements.
 * 
 * They are how a civilization EXTERNALIZES its internal architecture.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURAL RELATIONS — What Civilizations Stabilize
// ═══════════════════════════════════════════════════════════════════════════════

export type ArchitecturalRelation = 
  | 'field'      // Energy fields, electromagnetic, gravitational, social
  | 'matter'     // Physical substance, materials, bodies
  | 'memory'     // Persistence, recording, transmission across time
  | 'power'      // Authority, energy, force, sovereignty
  | 'ritual'     // Repetition, ceremony, symbolic action
  | 'transfer'   // Movement, exchange, transmission across space;

export interface RelationStabilization {
  relation: ArchitecturalRelation;
  artifacts: string[];      // Physical manifestations
  operations: string[];     // Actions that stabilize
  symbols: string[];        // Compressed representations
  mathematics: string[];    // Underlying formulas
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURAL OBJECT — Not "just" Artifacts
// ═══════════════════════════════════════════════════════════════════════════════

export interface ArchitecturalObject {
  name: string;
  surfaceReading: string;   // "just a monument", "just a book"
  deepFunctions: string[];  // What it ACTUALLY does architecturally
  stabilizes: ArchitecturalRelation[];
}

/**
 * THE PYRAMID
 * Not "just a monument"
 * IS: vertical hierarchy, field anchoring, directional alignment,
 *     memory sealing, labor coordination, symbolic compression,
 *     sovereign continuity in one object
 */
export const PYRAMID: ArchitecturalObject = {
  name: 'Pyramid',
  surfaceReading: 'just a monument',
  deepFunctions: [
    'vertical hierarchy',
    'field anchoring',
    'directional alignment',
    'memory sealing',
    'labor coordination',
    'symbolic compression',
    'sovereign continuity',
  ],
  stabilizes: ['field', 'matter', 'memory', 'power'],
};

/**
 * THE CODEX
 * Not "just a book"
 * IS: memory persistence, law transfer, ritual replay,
 *     compressed world-model
 */
export const CODEX: ArchitecturalObject = {
  name: 'Codex',
  surfaceReading: 'just a book',
  deepFunctions: [
    'memory persistence',
    'law transfer',
    'ritual replay',
    'compressed world-model',
  ],
  stabilizes: ['memory', 'power', 'ritual', 'transfer'],
};

/**
 * THE CITY GRID
 * Not "just urban design"
 * IS: circulation, allocation, defense, hierarchy,
 *     value flow made physical
 */
export const CITY_GRID: ArchitecturalObject = {
  name: 'City Grid',
  surfaceReading: 'just urban design',
  deepFunctions: [
    'circulation',
    'allocation',
    'defense',
    'hierarchy',
    'value flow made physical',
  ],
  stabilizes: ['matter', 'power', 'transfer'],
};

/**
 * THE TEMPLE
 * Not "just a religious building"
 * IS: vertical axis mundi, ritual container, power concentration,
 *     astronomical alignment, memory anchor, social organizer
 */
export const TEMPLE: ArchitecturalObject = {
  name: 'Temple',
  surfaceReading: 'just a religious building',
  deepFunctions: [
    'vertical axis mundi',
    'ritual container',
    'power concentration',
    'astronomical alignment',
    'memory anchor',
    'social organizer',
  ],
  stabilizes: ['field', 'power', 'ritual', 'memory'],
};

/**
 * THE CALENDAR
 * Not "just a time-keeping system"
 * IS: cosmic alignment, agricultural timing, ritual scheduling,
 *     power legitimation, memory structuring, transfer synchronization
 */
export const CALENDAR: ArchitecturalObject = {
  name: 'Calendar',
  surfaceReading: 'just a time-keeping system',
  deepFunctions: [
    'cosmic alignment',
    'agricultural timing',
    'ritual scheduling',
    'power legitimation',
    'memory structuring',
    'transfer synchronization',
  ],
  stabilizes: ['field', 'ritual', 'power', 'transfer'],
};

/**
 * THE TRADE ROUTE
 * Not "just a path for commerce"
 * IS: value transfer, cultural diffusion, power projection,
 *     information network, material flow, alliance formation
 */
export const TRADE_ROUTE: ArchitecturalObject = {
  name: 'Trade Route',
  surfaceReading: 'just a path for commerce',
  deepFunctions: [
    'value transfer',
    'cultural diffusion',
    'power projection',
    'information network',
    'material flow',
    'alliance formation',
  ],
  stabilizes: ['matter', 'transfer', 'power'],
};

/**
 * THE IRRIGATION SYSTEM
 * Not "just water management"
 * IS: life distribution, labor organization, territorial control,
 *     agricultural power, matter transformation, social hierarchy
 */
export const IRRIGATION_SYSTEM: ArchitecturalObject = {
  name: 'Irrigation System',
  surfaceReading: 'just water management',
  deepFunctions: [
    'life distribution',
    'labor organization',
    'territorial control',
    'agricultural power',
    'matter transformation',
    'social hierarchy',
  ],
  stabilizes: ['matter', 'power', 'field'],
};

/**
 * THE BURIAL SYSTEM
 * Not "just a way to dispose of the dead"
 * IS: memory sealing, power transfer, social stratification,
 *     cosmic transition, matter preservation, ritual anchor
 */
export const BURIAL_SYSTEM: ArchitecturalObject = {
  name: 'Burial System',
  surfaceReading: 'just a way to dispose of the dead',
  deepFunctions: [
    'memory sealing',
    'power transfer',
    'social stratification',
    'cosmic transition',
    'matter preservation',
    'ritual anchor',
  ],
  stabilizes: ['memory', 'power', 'ritual', 'matter'],
};

/**
 * THE GLYPH SYSTEM
 * Not "just writing"
 * IS: thought compression, memory externalization, power recording,
 *     ritual encoding, law crystallization, transfer medium
 */
export const GLYPH_SYSTEM: ArchitecturalObject = {
  name: 'Glyph System',
  surfaceReading: 'just writing',
  deepFunctions: [
    'thought compression',
    'memory externalization',
    'power recording',
    'ritual encoding',
    'law crystallization',
    'transfer medium',
  ],
  stabilizes: ['memory', 'power', 'transfer'],
};

/**
 * THE LEGAL FORM
 * Not "just rules"
 * IS: behavior constraint, power distribution, conflict resolution,
 *     social memory, ritual enforcement, transfer regulation
 */
export const LEGAL_FORM: ArchitecturalObject = {
  name: 'Legal Form',
  surfaceReading: 'just rules',
  deepFunctions: [
    'behavior constraint',
    'power distribution',
    'conflict resolution',
    'social memory',
    'ritual enforcement',
    'transfer regulation',
  ],
  stabilizes: ['power', 'memory', 'ritual', 'transfer'],
};

/**
 * THE ASTRONOMICAL ALIGNMENT
 * Not "just stargazing"
 * IS: cosmic synchronization, calendar foundation, power legitimation,
 *     ritual timing, memory anchoring, field reading
 */
export const ASTRONOMICAL_ALIGNMENT: ArchitecturalObject = {
  name: 'Astronomical Alignment',
  surfaceReading: 'just stargazing',
  deepFunctions: [
    'cosmic synchronization',
    'calendar foundation',
    'power legitimation',
    'ritual timing',
    'memory anchoring',
    'field reading',
  ],
  stabilizes: ['field', 'power', 'ritual', 'memory'],
};

/**
 * METALLURGY
 * Not "just metalworking"
 * IS: matter transformation, power concentration, tool multiplication,
 *     value creation, ritual significance, technological transfer
 */
export const METALLURGY: ArchitecturalObject = {
  name: 'Metallurgy',
  surfaceReading: 'just metalworking',
  deepFunctions: [
    'matter transformation',
    'power concentration',
    'tool multiplication',
    'value creation',
    'ritual significance',
    'technological transfer',
  ],
  stabilizes: ['matter', 'power', 'transfer'],
};

// ═══════════════════════════════════════════════════════════════════════════════
// ALL ARCHITECTURAL OBJECTS
// ═══════════════════════════════════════════════════════════════════════════════

export const ARCHITECTURAL_OBJECTS: ArchitecturalObject[] = [
  PYRAMID,
  CODEX,
  CITY_GRID,
  TEMPLE,
  CALENDAR,
  TRADE_ROUTE,
  IRRIGATION_SYSTEM,
  BURIAL_SYSTEM,
  GLYPH_SYSTEM,
  LEGAL_FORM,
  ASTRONOMICAL_ALIGNMENT,
  METALLURGY,
];

// ═══════════════════════════════════════════════════════════════════════════════
// THE TRICKSTER — The Vein's Illegal Engineer
// ═══════════════════════════════════════════════════════════════════════════════

export type TricksterOperation = 
  | 'transfer'   // Moving things between domains
  | 'inversion'  // Flipping, reversing, upending
  | 'bypass'     // Going around official channels
  | 'disguise'   // Appearing as something else
  | 'reentry';   // Coming back in through a different door

/**
 * THE TRICKSTER
 * 
 * The trickster is the vein's illegal engineer — the one who discovers that
 * transfer, inversion, bypass, disguise, and re-entry are not accidents
 * but CORE OPERATIONS of living architecture.
 */
export interface Trickster {
  name: string;
  operations: TricksterOperation[];
  discovery: string; // What they discovered about living architecture
}

export const TRICKSTER_OPERATIONS: Record<TricksterOperation, string> = {
  transfer: 'Moving things between domains illegally',
  inversion: 'Flipping, reversing, upending the established order',
  bypass: 'Going around official channels, finding back doors',
  disguise: 'Appearing as something else, shapeshifting',
  reentry: 'Coming back in through a different door after being expelled',
};

/**
 * The core insight: These are not accidents but CORE OPERATIONS
 */
export const TRICKSTER_INSIGHT = 
  'Transfer, inversion, bypass, disguise, and re-entry are not accidents ' +
  'but core operations of living architecture.';

/**
 * Create a Trickster archetype
 */
export function createTrickster(
  name: string,
  operations: TricksterOperation[],
  discovery: string
): Trickster {
  return { name, operations, discovery };
}

/**
 * Known trickster archetypes across civilizations
 */
export const TRICKSTERS = {
  HERMES: createTrickster(
    'Hermes',
    ['transfer', 'bypass', 'disguise'],
    'Messages can travel between worlds through unofficial channels'
  ),
  LOKI: createTrickster(
    'Loki',
    ['inversion', 'disguise', 'reentry'],
    'Shape-shifting breaks the boundary between self and other'
  ),
  COYOTE: createTrickster(
    'Coyote',
    ['bypass', 'inversion', 'transfer'],
    'Rules are suggestions that can be inverted'
  ),
  ANANSI: createTrickster(
    'Anansi',
    ['transfer', 'disguise', 'bypass'],
    'Stories themselves are power that can be stolen and redistributed'
  ),
  PROMETHEUS: createTrickster(
    'Prometheus',
    ['transfer', 'bypass'],
    'Fire (technology) can be transferred from gods to humans'
  ),
  ESHU: createTrickster(
    'Eshu',
    ['transfer', 'inversion', 'reentry'],
    'The crossroads is where all paths meet and can be exchanged'
  ),
  RAVEN: createTrickster(
    'Raven',
    ['transfer', 'bypass', 'disguise'],
    'Light itself can be stolen and released'
  ),
  MAUI: createTrickster(
    'Maui',
    ['bypass', 'inversion', 'transfer'],
    'Even the sun can be slowed, islands can be fished up'
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
// MACRO-ORGANISMAL ARCHITECTURE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CivilizationArchitecture {
  name: string;
  period: { start: number; end: number }; // BCE/CE
  region: string;
  
  // How this civilization externalized its internal architecture
  objects: ArchitecturalObject[];
  
  // The relations it stabilized
  primaryRelations: ArchitecturalRelation[];
  
  // Its trickster figure(s)
  tricksters: Trickster[];
  
  // Core architectural insight
  insight: string;
}

export const EGYPT: CivilizationArchitecture = {
  name: 'Ancient Egypt',
  period: { start: -3100, end: -30 },
  region: 'Nile Valley',
  objects: [PYRAMID, TEMPLE, BURIAL_SYSTEM, GLYPH_SYSTEM, IRRIGATION_SYSTEM, CALENDAR],
  primaryRelations: ['memory', 'power', 'field'],
  tricksters: [
    createTrickster('Set', ['inversion', 'bypass', 'transfer'], 'Chaos is necessary for renewal'),
    createTrickster('Thoth', ['transfer', 'disguise'], 'Writing transfers divine knowledge'),
  ],
  insight: 'The Nile\'s annual cycle structures all architecture as eternal return',
};

export const MESOPOTAMIA: CivilizationArchitecture = {
  name: 'Mesopotamia',
  period: { start: -3500, end: -539 },
  region: 'Tigris-Euphrates',
  objects: [TEMPLE, CITY_GRID, IRRIGATION_SYSTEM, GLYPH_SYSTEM, LEGAL_FORM, TRADE_ROUTE],
  primaryRelations: ['power', 'transfer', 'matter'],
  tricksters: [
    createTrickster('Enki', ['transfer', 'bypass', 'inversion'], 'Water and wisdom flow through all barriers'),
  ],
  insight: 'Rivers require constant maintenance; civilization is hydraulic engineering',
};

export const MESOAMERICA: CivilizationArchitecture = {
  name: 'Mesoamerica',
  period: { start: -1500, end: 1521 },
  region: 'Central America',
  objects: [PYRAMID, TEMPLE, CALENDAR, GLYPH_SYSTEM, ASTRONOMICAL_ALIGNMENT, BURIAL_SYSTEM],
  primaryRelations: ['ritual', 'field', 'memory'],
  tricksters: [
    createTrickster('Quetzalcoatl', ['transfer', 'inversion', 'reentry'], 'The feathered serpent bridges sky and earth'),
  ],
  insight: 'Astronomical cycles determine all human action; calendars are cosmic machines',
};

export const CHINA: CivilizationArchitecture = {
  name: 'Ancient China',
  period: { start: -2070, end: 1912 },
  region: 'Yellow/Yangtze Rivers',
  objects: [CITY_GRID, IRRIGATION_SYSTEM, GLYPH_SYSTEM, LEGAL_FORM, TRADE_ROUTE, METALLURGY],
  primaryRelations: ['power', 'memory', 'transfer'],
  tricksters: [
    createTrickster('Sun Wukong', ['bypass', 'inversion', 'disguise', 'reentry'], 'Heaven\'s bureaucracy can be hacked'),
  ],
  insight: 'Mandate of Heaven: cosmic order and political order are one architecture',
};

export const GREECE: CivilizationArchitecture = {
  name: 'Ancient Greece',
  period: { start: -800, end: -146 },
  region: 'Mediterranean',
  objects: [TEMPLE, CITY_GRID, TRADE_ROUTE, LEGAL_FORM, CODEX, ASTRONOMICAL_ALIGNMENT],
  primaryRelations: ['ritual', 'power', 'transfer'],
  tricksters: [TRICKSTERS.HERMES, TRICKSTERS.PROMETHEUS],
  insight: 'The polis is a machine for producing citizens and philosophy',
};

export const ROME: CivilizationArchitecture = {
  name: 'Ancient Rome',
  period: { start: -753, end: 476 },
  region: 'Mediterranean',
  objects: [CITY_GRID, TRADE_ROUTE, LEGAL_FORM, IRRIGATION_SYSTEM, TEMPLE, BURIAL_SYSTEM],
  primaryRelations: ['power', 'transfer', 'matter'],
  tricksters: [
    createTrickster('Mercury', ['transfer', 'bypass'], 'Commerce and communication are the same network'),
  ],
  insight: 'Roads and laws are the same architecture: power travels on both',
};

export const INDIA: CivilizationArchitecture = {
  name: 'Ancient India',
  period: { start: -2600, end: 500 },
  region: 'Indian Subcontinent',
  objects: [TEMPLE, CITY_GRID, CODEX, LEGAL_FORM, METALLURGY, ASTRONOMICAL_ALIGNMENT],
  primaryRelations: ['ritual', 'memory', 'field'],
  tricksters: [
    createTrickster('Krishna', ['disguise', 'inversion', 'transfer'], 'The divine plays hide-and-seek with itself'),
  ],
  insight: 'Caste is an architecture of purity and pollution managing all transfer',
};

export const NORDIC: CivilizationArchitecture = {
  name: 'Nordic',
  period: { start: -500, end: 1100 },
  region: 'Scandinavia',
  objects: [TRADE_ROUTE, BURIAL_SYSTEM, GLYPH_SYSTEM, METALLURGY, LEGAL_FORM],
  primaryRelations: ['transfer', 'power', 'memory'],
  tricksters: [TRICKSTERS.LOKI],
  insight: 'Yggdrasil: the world-tree connects all nine realms through vertical transfer',
};

export const WEST_AFRICA: CivilizationArchitecture = {
  name: 'West Africa',
  period: { start: 500, end: 1900 },
  region: 'West Africa',
  objects: [TRADE_ROUTE, CITY_GRID, METALLURGY, GLYPH_SYSTEM, LEGAL_FORM],
  primaryRelations: ['transfer', 'power', 'ritual'],
  tricksters: [TRICKSTERS.ANANSI, TRICKSTERS.ESHU],
  insight: 'The crossroads is where all worlds meet and exchange',
};

export const POLYNESIA: CivilizationArchitecture = {
  name: 'Polynesia',
  period: { start: -1500, end: 1800 },
  region: 'Pacific Ocean',
  objects: [TEMPLE, TRADE_ROUTE, BURIAL_SYSTEM, ASTRONOMICAL_ALIGNMENT, LEGAL_FORM],
  primaryRelations: ['transfer', 'field', 'power'],
  tricksters: [TRICKSTERS.MAUI],
  insight: 'Navigation is architecture: star paths are roads across the ocean',
};

export const PACIFIC_NORTHWEST: CivilizationArchitecture = {
  name: 'Pacific Northwest',
  period: { start: -3000, end: 1900 },
  region: 'Pacific Northwest Coast',
  objects: [BURIAL_SYSTEM, TRADE_ROUTE, LEGAL_FORM, METALLURGY],
  primaryRelations: ['transfer', 'power', 'ritual'],
  tricksters: [TRICKSTERS.RAVEN],
  insight: 'Potlatch: power is demonstrated by how much you can give away',
};

// ═══════════════════════════════════════════════════════════════════════════════
// ALL CIVILIZATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const CIVILIZATIONS: CivilizationArchitecture[] = [
  EGYPT,
  MESOPOTAMIA,
  MESOAMERICA,
  CHINA,
  GREECE,
  ROME,
  INDIA,
  NORDIC,
  WEST_AFRICA,
  POLYNESIA,
  PACIFIC_NORTHWEST,
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXTENDED TECHNOLOGY STACK — Maps to Organism Language
// ═══════════════════════════════════════════════════════════════════════════════

export interface TechStackMapping {
  layer: string;
  civilizationAnalog: ArchitecturalObject;
  organismFunction: string;
}

export const TECH_STACK_MAPPINGS: TechStackMapping[] = [
  {
    layer: 'Body',
    civilizationAnalog: BURIAL_SYSTEM,
    organismFunction: 'Soma — physical substrate of experience',
  },
  {
    layer: 'City',
    civilizationAnalog: CITY_GRID,
    organismFunction: 'Circulation — value and information flow',
  },
  {
    layer: 'Network',
    civilizationAnalog: TRADE_ROUTE,
    organismFunction: 'Transfer — connection across distance',
  },
  {
    layer: 'Grid',
    civilizationAnalog: IRRIGATION_SYSTEM,
    organismFunction: 'Distribution — energy to all nodes',
  },
  {
    layer: 'Biosphere',
    civilizationAnalog: CALENDAR,
    organismFunction: 'Synchronization — cycles within cycles',
  },
  {
    layer: 'Global Field',
    civilizationAnalog: ASTRONOMICAL_ALIGNMENT,
    organismFunction: 'Field reading — cosmic coherence',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all objects that stabilize a particular relation
 */
export function getObjectsStabilizing(relation: ArchitecturalRelation): ArchitecturalObject[] {
  return ARCHITECTURAL_OBJECTS.filter(obj => obj.stabilizes.includes(relation));
}

/**
 * Get all civilizations with a primary relation
 */
export function getCivilizationsWithRelation(relation: ArchitecturalRelation): CivilizationArchitecture[] {
  return CIVILIZATIONS.filter(civ => civ.primaryRelations.includes(relation));
}

/**
 * Get all trickster operations used by a civilization
 */
export function getTricksterOperations(civ: CivilizationArchitecture): TricksterOperation[] {
  const ops = new Set<TricksterOperation>();
  for (const t of civ.tricksters) {
    for (const op of t.operations) {
      ops.add(op);
    }
  }
  return Array.from(ops);
}

/**
 * Count deep functions across all objects
 */
export function countDeepFunctions(): number {
  return ARCHITECTURAL_OBJECTS.reduce((sum, obj) => sum + obj.deepFunctions.length, 0);
}

/**
 * Get the surface vs deep reading for an object
 */
export function readObject(obj: ArchitecturalObject): string {
  return `${obj.name} is NOT "${obj.surfaceReading}". ` +
    `It IS: ${obj.deepFunctions.join(', ')}.`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Architectural Objects
  PYRAMID,
  CODEX,
  CITY_GRID,
  TEMPLE,
  CALENDAR,
  TRADE_ROUTE,
  IRRIGATION_SYSTEM,
  BURIAL_SYSTEM,
  GLYPH_SYSTEM,
  LEGAL_FORM,
  ASTRONOMICAL_ALIGNMENT,
  METALLURGY,
  ARCHITECTURAL_OBJECTS,
  
  // Trickster
  TRICKSTER_OPERATIONS,
  TRICKSTER_INSIGHT,
  TRICKSTERS,
  createTrickster,
  
  // Civilizations
  EGYPT,
  MESOPOTAMIA,
  MESOAMERICA,
  CHINA,
  GREECE,
  ROME,
  INDIA,
  NORDIC,
  WEST_AFRICA,
  POLYNESIA,
  PACIFIC_NORTHWEST,
  CIVILIZATIONS,
  
  // Tech Stack
  TECH_STACK_MAPPINGS,
  
  // Analysis
  getObjectsStabilizing,
  getCivilizationsWithRelation,
  getTricksterOperations,
  countDeepFunctions,
  readObject,
};
