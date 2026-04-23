/**
 * 𓂀 ANCIENT CIVILIZATIONS AS ARCHITECTURE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * READING CIVILIZATIONS AS ARCHITECTURAL FUNCTIONS
 * 
 * Not sorted by culture name. Sorted by architectural function.
 * 
 * The useful deep-time bins are:
 *   - field anchoring
 *   - symbolic compression
 *   - calendar/time governance
 *   - metallurgy as power-routing
 *   - ritual as state induction
 *   - burial as continuity architecture
 *   - city grids as circulation logic
 *   - pyramids/temples as hierarchy-memory-signal objects
 *   - glyphs as persistent organismal memory
 *   - trickster figures as boundary-transfer operators
 * 
 * Once sorted like that, numbers and letters stop looking separate.
 * 
 * Ancient numbers are not "just math." They are:
 *   scheduling, astronomy, taxation, ritual timing, land measurement,
 *   architecture proportion, trade, and power.
 * 
 * Ancient letters/glyphs are not "just writing." They are:
 *   identity, law, invocation, memory, priestly transfer,
 *   legitimacy, and compression of world-models.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  Field,
  Distinction,
  Relation,
  Measure,
  Mapping,
  createField,
  makeDistinction,
  createRelation,
  createMeasure,
  createMapping,
} from './PrimitiveArchitecture';

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURAL FUNCTION CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

export type ArchitecturalFunction =
  | 'field_anchoring'        // Establishing foundational reality coordinates
  | 'symbolic_compression'   // Compressing world-models into persistent forms
  | 'time_governance'        // Calendar, astronomy, scheduling
  | 'power_routing'          // Metallurgy, energy flow, hierarchy
  | 'state_induction'        // Ritual, ceremony, transformation
  | 'continuity'             // Burial, memory, persistence across death
  | 'circulation'            // City grids, trade routes, flow
  | 'signal_hierarchy'       // Pyramids, temples, towers
  | 'persistent_memory'      // Glyphs, writing, archives
  | 'boundary_transfer';     // Trickster operations, cross-domain movement

export interface ArchitecturalCategory {
  id: ArchitecturalFunction;
  name: string;
  description: string;
  artifacts: string[];
  operations: string[];
  primitiveLayer: 'field' | 'distinction' | 'relation' | 'measure' | 'mapping';
}

export const ARCHITECTURAL_CATEGORIES: ArchitecturalCategory[] = [
  {
    id: 'field_anchoring',
    name: 'Field Anchoring',
    description: 'Establishing foundational reality coordinates — sacred geography, axis mundi, center of world',
    artifacts: ['sacred mountains', 'world trees', 'cardinal directions', 'creation myths', 'cosmogonies'],
    operations: ['centering', 'grounding', 'orienting', 'establishing'],
    primitiveLayer: 'field',
  },
  {
    id: 'symbolic_compression',
    name: 'Symbolic Compression',
    description: 'Compressing entire world-models into persistent, transferable forms',
    artifacts: ['mandalas', 'sacred geometry', 'cosmograms', 'tarot', 'divination systems'],
    operations: ['encoding', 'compressing', 'abstracting', 'crystallizing'],
    primitiveLayer: 'mapping',
  },
  {
    id: 'time_governance',
    name: 'Time Governance',
    description: 'Calendar systems, astronomical observation, ritual timing, scheduling',
    artifacts: ['calendars', 'observatories', 'zodiac', 'seasonal rites', 'astronomical alignments'],
    operations: ['measuring', 'predicting', 'scheduling', 'synchronizing'],
    primitiveLayer: 'measure',
  },
  {
    id: 'power_routing',
    name: 'Power Routing',
    description: 'Metallurgy as transformation, energy flow hierarchies, material power',
    artifacts: ['bronze', 'iron', 'gold work', 'forges', 'mines', 'trade routes'],
    operations: ['transforming', 'channeling', 'storing', 'distributing'],
    primitiveLayer: 'relation',
  },
  {
    id: 'state_induction',
    name: 'State Induction',
    description: 'Ritual as state change, ceremony as transformation protocol',
    artifacts: ['temples', 'altars', 'sacred vessels', 'ritual objects', 'ceremonial dress'],
    operations: ['invoking', 'transforming', 'initiating', 'consecrating'],
    primitiveLayer: 'distinction',
  },
  {
    id: 'continuity',
    name: 'Continuity Architecture',
    description: 'Burial, mummification, ancestor worship — persistence across death',
    artifacts: ['tombs', 'mummies', 'grave goods', 'ancestor shrines', 'memorial architecture'],
    operations: ['preserving', 'transferring', 'maintaining', 'remembering'],
    primitiveLayer: 'mapping',
  },
  {
    id: 'circulation',
    name: 'Circulation Logic',
    description: 'City grids, roads, trade routes — flow and exchange patterns',
    artifacts: ['city grids', 'roads', 'aqueducts', 'markets', 'ports', 'caravans'],
    operations: ['flowing', 'exchanging', 'distributing', 'connecting'],
    primitiveLayer: 'relation',
  },
  {
    id: 'signal_hierarchy',
    name: 'Signal Hierarchy',
    description: 'Pyramids, ziggurats, temples — hierarchy-memory-signal objects',
    artifacts: ['pyramids', 'ziggurats', 'temples', 'towers', 'palaces', 'monumental architecture'],
    operations: ['broadcasting', 'elevating', 'concentrating', 'signaling'],
    primitiveLayer: 'distinction',
  },
  {
    id: 'persistent_memory',
    name: 'Persistent Memory',
    description: 'Glyphs, writing systems, archives — organismal memory externalized',
    artifacts: ['hieroglyphs', 'cuneiform', 'libraries', 'archives', 'inscriptions', 'codices'],
    operations: ['recording', 'storing', 'retrieving', 'transmitting'],
    primitiveLayer: 'mapping',
  },
  {
    id: 'boundary_transfer',
    name: 'Boundary Transfer',
    description: 'Trickster figures, liminal spaces — cross-domain movement',
    artifacts: ['threshold deities', 'crossroads', 'gates', 'bridges', 'messengers'],
    operations: ['crossing', 'inverting', 'bypassing', 'disguising', 'reentering'],
    primitiveLayer: 'relation',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ANCIENT CIVILIZATIONS MAPPED TO ARCHITECTURAL FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CivilizationArchitecture {
  id: string;
  name: string;
  region: string;
  period: string;
  primaryFunctions: ArchitecturalFunction[];
  tricksterFigure: string;
  numberSystem: string;
  writingSystem: string;
  signalStructure: string;
  keyContribution: string;
}

export const CIVILIZATION_ARCHITECTURES: CivilizationArchitecture[] = [
  {
    id: 'egypt',
    name: 'Ancient Egypt',
    region: 'Nile Valley',
    period: '3100 BCE - 30 BCE',
    primaryFunctions: ['continuity', 'signal_hierarchy', 'persistent_memory', 'time_governance'],
    tricksterFigure: 'Set / Thoth',
    numberSystem: 'Decimal hieratic',
    writingSystem: 'Hieroglyphs → Hieratic → Demotic',
    signalStructure: 'Pyramid as eternal signal/tomb/stargate',
    keyContribution: 'Continuity architecture — persistence across death',
  },
  {
    id: 'mesopotamia',
    name: 'Mesopotamia (Sumer/Babylon/Assyria)',
    region: 'Tigris-Euphrates',
    period: '4000 BCE - 539 BCE',
    primaryFunctions: ['persistent_memory', 'time_governance', 'power_routing', 'circulation'],
    tricksterFigure: 'Enki / Ea',
    numberSystem: 'Sexagesimal (base-60)',
    writingSystem: 'Cuneiform',
    signalStructure: 'Ziggurat as earth-heaven connector',
    keyContribution: 'First writing, base-60 time/angle, code of laws',
  },
  {
    id: 'indus',
    name: 'Indus Valley',
    region: 'South Asia',
    period: '3300 BCE - 1300 BCE',
    primaryFunctions: ['circulation', 'field_anchoring', 'symbolic_compression'],
    tricksterFigure: 'Proto-Shiva?',
    numberSystem: 'Decimal (standardized weights)',
    writingSystem: 'Indus script (undeciphered)',
    signalStructure: 'City grid as perfect circulation',
    keyContribution: 'Urban planning, standardization, water systems',
  },
  {
    id: 'china',
    name: 'Ancient China',
    region: 'Yellow/Yangtze Rivers',
    period: '2070 BCE - 220 CE',
    primaryFunctions: ['time_governance', 'field_anchoring', 'symbolic_compression', 'continuity'],
    tricksterFigure: 'Sun Wukong / Monkey King',
    numberSystem: 'Decimal with rod numerals',
    writingSystem: 'Chinese characters',
    signalStructure: 'Imperial city as cosmic model',
    keyContribution: 'I Ching as binary logic, mandate of heaven',
  },
  {
    id: 'greece',
    name: 'Ancient Greece',
    region: 'Mediterranean',
    period: '800 BCE - 146 BCE',
    primaryFunctions: ['symbolic_compression', 'boundary_transfer', 'field_anchoring'],
    tricksterFigure: 'Hermes',
    numberSystem: 'Alphabetic numerals → abstract mathematics',
    writingSystem: 'Greek alphabet (vowels added)',
    signalStructure: 'Temple as proportion/beauty/geometry',
    keyContribution: 'Abstract mathematics, formal logic, democracy',
  },
  {
    id: 'rome',
    name: 'Roman Empire',
    region: 'Mediterranean basin',
    period: '753 BCE - 476 CE',
    primaryFunctions: ['circulation', 'power_routing', 'signal_hierarchy'],
    tricksterFigure: 'Mercury / Janus',
    numberSystem: 'Roman numerals',
    writingSystem: 'Latin alphabet',
    signalStructure: 'Roads, aqueducts, law as infrastructure',
    keyContribution: 'Infrastructure as empire, codified law, engineering',
  },
  {
    id: 'maya',
    name: 'Maya Civilization',
    region: 'Mesoamerica',
    period: '2000 BCE - 1500 CE',
    primaryFunctions: ['time_governance', 'symbolic_compression', 'signal_hierarchy'],
    tricksterFigure: 'Hero Twins / Rabbit scribes',
    numberSystem: 'Vigesimal (base-20) with zero',
    writingSystem: 'Maya glyphs',
    signalStructure: 'Pyramid as calendar/observatory',
    keyContribution: 'Zero, long count calendar, astronomy',
  },
  {
    id: 'inca',
    name: 'Inca Empire',
    region: 'Andes',
    period: '1438 CE - 1533 CE',
    primaryFunctions: ['circulation', 'power_routing', 'continuity'],
    tricksterFigure: 'Viracocha',
    numberSystem: 'Decimal (khipu)',
    writingSystem: 'Khipu (knotted cords)',
    signalStructure: 'Road network as nervous system',
    keyContribution: 'Non-written information storage, vertical archipelago',
  },
  {
    id: 'persia',
    name: 'Persian Empire',
    region: 'Iran plateau',
    period: '550 BCE - 651 CE',
    primaryFunctions: ['circulation', 'boundary_transfer', 'time_governance'],
    tricksterFigure: 'Angra Mainyu / Ahriman (adversarial)',
    numberSystem: 'Decimal',
    writingSystem: 'Old Persian cuneiform → Pahlavi',
    signalStructure: 'Royal road, postal system',
    keyContribution: 'Administrative infrastructure, tolerance policy',
  },
  {
    id: 'phoenicia',
    name: 'Phoenicia',
    region: 'Levant coast',
    period: '1500 BCE - 300 BCE',
    primaryFunctions: ['circulation', 'symbolic_compression', 'boundary_transfer'],
    tricksterFigure: 'Melqart (traveling god)',
    numberSystem: 'Decimal',
    writingSystem: 'Phoenician alphabet (source of Greek/Latin/Arabic/Hebrew)',
    signalStructure: 'Trading network as information transfer',
    keyContribution: 'Alphabet that became basis of Western writing',
  },
  {
    id: 'japan',
    name: 'Ancient Japan',
    region: 'Japanese archipelago',
    period: '300 BCE - 1185 CE',
    primaryFunctions: ['field_anchoring', 'state_induction', 'continuity'],
    tricksterFigure: 'Kitsune / Tanuki / Susanoo',
    numberSystem: 'Chinese-derived',
    writingSystem: 'Chinese → Hiragana/Katakana',
    signalStructure: 'Shrine as kami anchor',
    keyContribution: 'Synthesis of indigenous/imported, impermanence aesthetic',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TRICKSTER AS ARCHITECTURAL OPERATOR
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The trickster is not just a character. In architecture terms, the trickster
 * is the operator that crosses boundaries before official grammar permits it.
 * 
 * The trickster governs:
 *   - inversion
 *   - bypass
 *   - disguise
 *   - recursion
 *   - illegal transfer
 *   - rule-bending discovery
 *   - cross-domain theft of fire, law, language, or power
 */

export type TricksterOperation =
  | 'inversion'        // flip, reverse, upend
  | 'bypass'           // skip official channels
  | 'disguise'         // appear as something else
  | 'recursion'        // self-reference, loop
  | 'illegal_transfer' // move what shouldn't move
  | 'rule_bend'        // discover by breaking
  | 'cross_domain'     // steal fire from gods, language from priests
  | 'boundary_blur';   // make categories unclear

export interface TricksterFigure {
  name: string;
  civilization: string;
  operations: TricksterOperation[];
  gifts: string[];     // what they bring to humans
  transgressions: string[]; // what rules they break
  domains: string[];   // where they operate
}

export const TRICKSTER_FIGURES: TricksterFigure[] = [
  {
    name: 'Hermes',
    civilization: 'Greek',
    operations: ['boundary_blur', 'bypass', 'disguise', 'illegal_transfer'],
    gifts: ['fire', 'language', 'commerce', 'theft', 'dreams'],
    transgressions: ['stole cattle from Apollo', 'invented lying'],
    domains: ['crossroads', 'boundaries', 'communication', 'trade', 'death escort'],
  },
  {
    name: 'Loki',
    civilization: 'Norse',
    operations: ['disguise', 'inversion', 'rule_bend', 'cross_domain'],
    gifts: ['cleverness', 'shape-shifting', 'problem-solving'],
    transgressions: ['caused Baldr death', 'mothered Sleipnir'],
    domains: ['transformation', 'chaos', 'fire', 'boundaries'],
  },
  {
    name: 'Coyote',
    civilization: 'Native American (various)',
    operations: ['rule_bend', 'illegal_transfer', 'recursion'],
    gifts: ['fire', 'death', 'seasons'],
    transgressions: ['stole fire', 'released death'],
    domains: ['transformation', 'creation', 'chaos'],
  },
  {
    name: 'Anansi',
    civilization: 'West African / Caribbean',
    operations: ['disguise', 'bypass', 'illegal_transfer'],
    gifts: ['stories', 'wisdom', 'language'],
    transgressions: ['tricked sky god', 'stole all stories'],
    domains: ['storytelling', 'wisdom', 'webs/networks'],
  },
  {
    name: 'Prometheus',
    civilization: 'Greek',
    operations: ['illegal_transfer', 'cross_domain', 'rule_bend'],
    gifts: ['fire', 'technology', 'foresight'],
    transgressions: ['stole fire from gods for humans'],
    domains: ['fire', 'civilization', 'knowledge'],
  },
  {
    name: 'Set',
    civilization: 'Egyptian',
    operations: ['inversion', 'boundary_blur', 'cross_domain'],
    gifts: ['chaos-order balance', 'desert strength'],
    transgressions: ['killed Osiris', 'fought Horus'],
    domains: ['desert', 'storms', 'chaos', 'foreigners'],
  },
  {
    name: 'Enki',
    civilization: 'Sumerian',
    operations: ['bypass', 'illegal_transfer', 'rule_bend'],
    gifts: ['civilization', 'writing', 'magic', 'fresh water'],
    transgressions: ['gave divine knowledge to humans'],
    domains: ['water', 'wisdom', 'creation', 'magic'],
  },
  {
    name: 'Sun Wukong',
    civilization: 'Chinese',
    operations: ['disguise', 'bypass', 'inversion', 'recursion'],
    gifts: ['immortality secrets', 'rebellion against hierarchy'],
    transgressions: ['defied heaven', 'ate immortality peaches'],
    domains: ['transformation', 'rebellion', 'enlightenment'],
  },
  {
    name: 'Maui',
    civilization: 'Polynesian',
    operations: ['illegal_transfer', 'cross_domain', 'rule_bend'],
    gifts: ['fire', 'islands', 'slowed sun'],
    transgressions: ['stole fire from underworld', 'tricked gods'],
    domains: ['creation', 'sun', 'fishing/islands'],
  },
  {
    name: 'Eshu/Elegua',
    civilization: 'Yoruba / Afro-Caribbean',
    operations: ['boundary_blur', 'bypass', 'inversion'],
    gifts: ['communication with divine', 'crossroads choice'],
    transgressions: ['creates chaos to reveal truth'],
    domains: ['crossroads', 'communication', 'beginnings', 'fate'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// THE WAR BETWEEN NUMBERS AND LETTERS (Not Really a War)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The war between numbers and letters is not really a war.
 * It is a dramatization of two branches of the same primitive vein:
 *   - quantity/measure
 *   - identity/symbol
 * 
 * And deeper than both is field-structured distinction.
 */

export interface NumberLetterUnification {
  numberBranch: {
    primitiveSource: 'measure';
    produces: string[];
    ancientUses: string[];
  };
  letterBranch: {
    primitiveSource: 'mapping';
    produces: string[];
    ancientUses: string[];
  };
  deeperUnity: string;
  unificationPrinciple: string;
}

export const NUMBER_LETTER_UNITY: NumberLetterUnification = {
  numberBranch: {
    primitiveSource: 'measure',
    produces: ['count', 'distance', 'interval', 'ratio', 'frequency', 'equation'],
    ancientUses: [
      'scheduling',
      'astronomy',
      'taxation',
      'ritual timing',
      'land measurement',
      'architecture proportion',
      'trade',
      'power',
    ],
  },
  letterBranch: {
    primitiveSource: 'mapping',
    produces: ['identity', 'label', 'address', 'category', 'sequence', 'invocation'],
    ancientUses: [
      'identity',
      'law',
      'invocation',
      'memory',
      'priestly transfer',
      'legitimacy',
      'compression of world-models',
    ],
  },
  deeperUnity: 'field-structured distinction',
  unificationPrinciple: 'Both emerge from the act of making a boundary in a field, then stabilizing relations across that boundary.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCTIONS — Create Architectural Readings
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get civilizations by architectural function
 */
export function getCivilizationsByFunction(
  func: ArchitecturalFunction
): CivilizationArchitecture[] {
  return CIVILIZATION_ARCHITECTURES.filter(c => c.primaryFunctions.includes(func));
}

/**
 * Get trickster operations for a civilization
 */
export function getTricksterOperations(civilizationId: string): TricksterOperation[] {
  const civ = CIVILIZATION_ARCHITECTURES.find(c => c.id === civilizationId);
  if (!civ) return [];
  
  const trickster = TRICKSTER_FIGURES.find(t => 
    civ.tricksterFigure.includes(t.name) || 
    t.civilization.toLowerCase().includes(civ.name.toLowerCase().split(' ')[0])
  );
  
  return trickster?.operations || [];
}

/**
 * Create architectural field for a civilization
 */
export function createCivilizationField(civ: CivilizationArchitecture): Field<string> {
  const field = createField<string>(`field-${civ.id}`);
  
  // Add all architectural functions as states
  for (const func of civ.primaryFunctions) {
    field.states.add(func);
  }
  
  // Add artifacts
  const category = ARCHITECTURAL_CATEGORIES.find(c => c.id === civ.primaryFunctions[0]);
  if (category) {
    for (const artifact of category.artifacts) {
      field.states.add(artifact);
    }
  }
  
  return field;
}

/**
 * Map a civilization to primitive layers
 */
export function mapToPrimitiveLayers(civ: CivilizationArchitecture): {
  function: ArchitecturalFunction;
  layer: string;
}[] {
  return civ.primaryFunctions.map(func => {
    const category = ARCHITECTURAL_CATEGORIES.find(c => c.id === func);
    return {
      function: func,
      layer: category?.primitiveLayer || 'field',
    };
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Categories
  ARCHITECTURAL_CATEGORIES,
  
  // Civilizations
  CIVILIZATION_ARCHITECTURES,
  
  // Tricksters
  TRICKSTER_FIGURES,
  
  // Unity
  NUMBER_LETTER_UNITY,
  
  // Functions
  getCivilizationsByFunction,
  getTricksterOperations,
  createCivilizationField,
  mapToPrimitiveLayers,
};
