/**
 * ANCIENT ARCHITECTURE
 * ─────────────────────────────────────────────────────────────────────────────
 * Ancient civilizations read as computational functions.
 *
 * The thesis: ancient architectures are not "historical artifacts."
 * They are implementations of fundamental computational operations:
 *   - field_anchoring    → coordinate system establishment
 *   - symbolic_compression → world-model compression / hashing
 *   - time_governance    → scheduling and synchronization
 *   - power_routing      → energy flow and transformation graphs
 *   - state_induction    → state machine transitions
 *   - continuity         → persistent memory across time
 *   - circulation        → data flow and exchange protocols
 *   - signal_hierarchy   → broadcast and receive topology
 *   - persistent_memory  → externalized, retrievable storage
 *   - boundary_transfer  → cross-domain operator (trickster)
 *
 * When you read a pyramid, you are reading signal_hierarchy.
 * When you read a glyph system, you are reading persistent_memory.
 * When you read a trickster myth, you are reading a boundary_transfer operator.
 *
 * MIT License — ItsNotAILABS / Medina Memory Systems
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type ArchitecturalFunction =
  | 'field_anchoring'
  | 'symbolic_compression'
  | 'time_governance'
  | 'power_routing'
  | 'state_induction'
  | 'continuity'
  | 'circulation'
  | 'signal_hierarchy'
  | 'persistent_memory'
  | 'boundary_transfer';

export type PrimitiveLayer = 'field' | 'distinction' | 'relation' | 'measure' | 'mapping';

export interface ArchitecturalCategory {
  id: ArchitecturalFunction;
  name: string;
  description: string;
  artifacts: string[];
  operations: string[];
  primitiveLayer: PrimitiveLayer;
  computationalAnalog: string;
}

export interface CivilizationMapping {
  civilization: string;
  region: string;
  period: string;
  functions: ArchitecturalFunction[];
  primaryFunction: ArchitecturalFunction;
  artifacts: string[];
  notes: string;
}

export interface PrimitivePrimitive {
  id: string;
  layer: PrimitiveLayer;
  description: string;
}

// ─── Primitive Stack ─────────────────────────────────────────────────────────

/**
 * The primitive stack — the layer beneath number and letter.
 *
 * 1. field       → before number, before letter — pure possible states
 * 2. distinction → boundary appears: this / not-that
 * 3. relation    → distinctions bind: near/far, before/after, same/different
 * 4. measure     → relations stabilize → number appears
 * 5. mapping     → persistence/transfer across time/minds → symbol appears
 */
export const PRIMITIVE_STACK: PrimitivePrimitive[] = [
  {
    id: 'field',
    layer: 'field',
    description: 'Pure potential. Before distinction. The space of possible states.',
  },
  {
    id: 'distinction',
    layer: 'distinction',
    description: 'A boundary drawn in the field. This / not-that. The origin of difference.',
  },
  {
    id: 'relation',
    layer: 'relation',
    description: 'Distinctions bound to each other. Near/far, before/after, same/different.',
  },
  {
    id: 'measure',
    layer: 'measure',
    description: 'Stable relations → number appears. Quantity emerges from repetition.',
  },
  {
    id: 'mapping',
    layer: 'mapping',
    description: 'Persistence and transfer across time and minds → symbol appears.',
  },
];

// ─── Architectural Categories ─────────────────────────────────────────────────

export const ARCHITECTURAL_CATEGORIES: Record<ArchitecturalFunction, ArchitecturalCategory> = {
  field_anchoring: {
    id: 'field_anchoring',
    name: 'Field Anchoring',
    description: 'Establishing foundational reality coordinates — sacred geography, axis mundi, center of world.',
    artifacts: ['sacred mountains', 'world trees', 'cardinal directions', 'creation myths', 'cosmogonies'],
    operations: ['centering', 'grounding', 'orienting', 'establishing'],
    primitiveLayer: 'field',
    computationalAnalog: 'Coordinate system initialization. Setting the origin of a reference frame.',
  },
  symbolic_compression: {
    id: 'symbolic_compression',
    name: 'Symbolic Compression',
    description: 'Compressing entire world-models into persistent, transferable forms.',
    artifacts: ['mandalas', 'sacred geometry', 'cosmograms', 'tarot', 'divination systems'],
    operations: ['encoding', 'compressing', 'abstracting', 'crystallizing'],
    primitiveLayer: 'mapping',
    computationalAnalog: 'Hashing and compression algorithms. A mandala is a compressed cosmology.',
  },
  time_governance: {
    id: 'time_governance',
    name: 'Time Governance',
    description: 'Calendar systems, astronomical observation, ritual timing, scheduling.',
    artifacts: ['calendars', 'observatories', 'zodiac', 'seasonal rites', 'astronomical alignments'],
    operations: ['measuring', 'predicting', 'scheduling', 'synchronizing'],
    primitiveLayer: 'measure',
    computationalAnalog: 'Clock synchronization, scheduling algorithms, cron jobs.',
  },
  power_routing: {
    id: 'power_routing',
    name: 'Power Routing',
    description: 'Metallurgy as transformation, energy flow hierarchies, material power.',
    artifacts: ['bronze', 'iron', 'gold work', 'forges', 'mines', 'trade routes'],
    operations: ['transforming', 'channeling', 'storing', 'distributing'],
    primitiveLayer: 'relation',
    computationalAnalog: 'Directed graphs, power grids, message passing architectures.',
  },
  state_induction: {
    id: 'state_induction',
    name: 'State Induction',
    description: 'Ritual as state change, ceremony as transformation protocol.',
    artifacts: ['temples', 'altars', 'sacred vessels', 'ritual objects', 'ceremonial dress'],
    operations: ['invoking', 'transforming', 'initiating', 'consecrating'],
    primitiveLayer: 'distinction',
    computationalAnalog: 'State machine transitions. Initiation is a deliberate state change.',
  },
  continuity: {
    id: 'continuity',
    name: 'Continuity Architecture',
    description: 'Burial, mummification, ancestor worship — persistence across death.',
    artifacts: ['tombs', 'mummies', 'grave goods', 'ancestor shrines', 'memorial architecture'],
    operations: ['preserving', 'transferring', 'maintaining', 'remembering'],
    primitiveLayer: 'mapping',
    computationalAnalog: 'Durable storage, backup systems, version control. Tombs are versioned memory.',
  },
  circulation: {
    id: 'circulation',
    name: 'Circulation Logic',
    description: 'City grids, roads, trade routes — flow and exchange patterns.',
    artifacts: ['city grids', 'roads', 'aqueducts', 'markets', 'ports', 'caravans'],
    operations: ['flowing', 'exchanging', 'distributing', 'connecting'],
    primitiveLayer: 'relation',
    computationalAnalog: 'Network topology, message bus, request routing.',
  },
  signal_hierarchy: {
    id: 'signal_hierarchy',
    name: 'Signal Hierarchy',
    description: 'Pyramids, ziggurats, temples — hierarchy-memory-signal objects.',
    artifacts: ['pyramids', 'ziggurats', 'temples', 'towers', 'palaces', 'monumental architecture'],
    operations: ['broadcasting', 'elevating', 'concentrating', 'signaling'],
    primitiveLayer: 'distinction',
    computationalAnalog: 'Broadcast topology, signal towers, content delivery networks.',
  },
  persistent_memory: {
    id: 'persistent_memory',
    name: 'Persistent Memory',
    description: 'Glyphs, writing systems, archives — organismal memory externalized.',
    artifacts: ['hieroglyphs', 'cuneiform', 'libraries', 'archives', 'inscriptions', 'codices'],
    operations: ['recording', 'storing', 'retrieving', 'transmitting'],
    primitiveLayer: 'mapping',
    computationalAnalog: 'Databases, file systems, distributed storage. A glyph is a stored memory address.',
  },
  boundary_transfer: {
    id: 'boundary_transfer',
    name: 'Boundary Transfer',
    description: 'Trickster figures, liminal spaces — cross-domain movement operators.',
    artifacts: ['threshold deities', 'crossroads', 'gates', 'bridges', 'messengers', 'trickster myths'],
    operations: ['crossing', 'inverting', 'bypassing', 'disguising', 'reentering'],
    primitiveLayer: 'distinction',
    computationalAnalog: 'Protocol adapters, proxies, cross-domain requests, API gateways.',
  },
};

// ─── Civilization Database ────────────────────────────────────────────────────

export const CIVILIZATIONS: CivilizationMapping[] = [
  {
    civilization: 'Ancient Egypt',
    region: 'North Africa',
    period: '3100–30 BCE',
    functions: ['signal_hierarchy', 'persistent_memory', 'continuity', 'symbolic_compression', 'time_governance'],
    primaryFunction: 'persistent_memory',
    artifacts: ['pyramids', 'hieroglyphs', 'papyrus', 'Book of the Dead', 'solar calendar'],
    notes: 'Hieroglyphs are the most sophisticated persistent_memory system in the ancient world. The pyramid is a signal_hierarchy object that simultaneously compresses cosmological data and broadcasts authority.',
  },
  {
    civilization: 'Sumeria',
    region: 'Mesopotamia',
    period: '4500–1900 BCE',
    functions: ['persistent_memory', 'time_governance', 'circulation', 'symbolic_compression'],
    primaryFunction: 'persistent_memory',
    artifacts: ['cuneiform tablets', 'cylinder seals', 'Gilgamesh', 'sexagesimal number system'],
    notes: 'Cuneiform is the first large-scale persistent_memory system. The cylinder seal is a compression device. Sexagesimal (base 60) is a time_governance primitive still running in every clock.',
  },
  {
    civilization: 'Classical Greece',
    region: 'Mediterranean',
    period: '800–146 BCE',
    functions: ['symbolic_compression', 'state_induction', 'boundary_transfer', 'circulation'],
    primaryFunction: 'symbolic_compression',
    artifacts: ['philosophy', 'theater', 'Olympic games', 'Agora', 'geometry'],
    notes: 'Greek theater is state_induction at scale. The Agora is circulation logic made physical. The Hermetic trickster Hermes is a boundary_transfer operator explicitly named.',
  },
  {
    civilization: 'Maya',
    region: 'Mesoamerica',
    period: '2000 BCE–1500 CE',
    functions: ['time_governance', 'symbolic_compression', 'signal_hierarchy', 'persistent_memory'],
    primaryFunction: 'time_governance',
    artifacts: ['Long Count calendar', 'codices', 'pyramid temples', 'astronomical observations'],
    notes: 'The Maya Long Count calendar is the most precise time_governance system produced before atomic clocks. Maya pyramids are signal_hierarchy objects with astronomical alignment for time_governance.',
  },
  {
    civilization: 'Ancient China',
    region: 'East Asia',
    period: '2100 BCE–220 CE',
    functions: ['circulation', 'power_routing', 'persistent_memory', 'state_induction', 'continuity'],
    primaryFunction: 'circulation',
    artifacts: ['Silk Road', 'Grand Canal', 'oracle bones', 'I Ching', 'bureaucracy'],
    notes: 'The I Ching is both symbolic_compression and a boundary_transfer operator (it produces answers at the edge of what is known). The Grand Canal is the most ambitious circulation_logic project in the ancient world.',
  },
  {
    civilization: 'Vedic India',
    region: 'South Asia',
    period: '1500–200 BCE',
    functions: ['field_anchoring', 'symbolic_compression', 'state_induction', 'persistent_memory'],
    primaryFunction: 'field_anchoring',
    artifacts: ['Vedas (oral)', 'mandalas', 'sacred geometry', 'ritual fire', 'Sanskrit'],
    notes: 'The Vedas are persistent_memory held in human bodies through recitation — pure recital_plus_one. Sanskrit is a compressed language designed for maximum symbolic density. Mandalas are field_anchoring devices.',
  },
  {
    civilization: 'Norse',
    region: 'Northern Europe',
    period: '793–1100 CE',
    functions: ['boundary_transfer', 'continuity', 'symbolic_compression', 'circulation'],
    primaryFunction: 'boundary_transfer',
    artifacts: ['Yggdrasil', 'runes', 'Loki myths', 'Thing assemblies', 'longships'],
    notes: 'Loki is the boundary_transfer operator par excellence — he moves between worlds, reverses states, introduces chaos that resolves into higher order. Yggdrasil is field_anchoring as cosmic architecture.',
  },
  {
    civilization: 'Islamic Golden Age',
    region: 'Middle East / North Africa',
    period: '750–1258 CE',
    functions: ['circulation', 'persistent_memory', 'symbolic_compression', 'power_routing'],
    primaryFunction: 'circulation',
    artifacts: ['House of Wisdom', 'algebra', 'trade networks', 'Quran recitation', 'hospitals'],
    notes: 'The Islamic recitation tradition (tajwid) is pure recital_plus_one. Al-Khwarizmi\'s algebra is symbolic_compression of arithmetic relations. The House of Wisdom is a persistent_memory institution.',
  },
];

// ─── Analysis Functions ───────────────────────────────────────────────────────

/**
 * Get all civilizations that implement a specific architectural function.
 */
export function getCivilizationsByFunction(fn: ArchitecturalFunction): CivilizationMapping[] {
  return CIVILIZATIONS.filter(c => c.functions.includes(fn));
}

/**
 * Get the computational analog for an architectural function.
 */
export function getComputationalAnalog(fn: ArchitecturalFunction): string {
  return ARCHITECTURAL_CATEGORIES[fn].computationalAnalog;
}

/**
 * Analyze an artifact and return matching architectural functions.
 * Keyword-based matching against known artifacts.
 */
export function analyzeArtifact(artifact: string): ArchitecturalCategory[] {
  const lower = artifact.toLowerCase();
  const matches: ArchitecturalCategory[] = [];

  for (const category of Object.values(ARCHITECTURAL_CATEGORIES)) {
    const matched = category.artifacts.some(a => lower.includes(a) || a.includes(lower));
    if (matched) matches.push(category);
  }

  return matches;
}

/**
 * Get the primitive layer for a given architectural function.
 */
export function getPrimitiveLayer(fn: ArchitecturalFunction): PrimitivePrimitive {
  const layer = ARCHITECTURAL_CATEGORIES[fn].primitiveLayer;
  return PRIMITIVE_STACK.find(p => p.layer === layer)!;
}

/**
 * Map a modern technical concept to its ancient architectural equivalent.
 */
export function findAncientEquivalent(
  modernConcept: string,
): { function: ArchitecturalFunction; analog: string; civilizations: string[] } | null {
  const lower = modernConcept.toLowerCase();

  const keywordMap: Record<string, ArchitecturalFunction> = {
    database: 'persistent_memory',
    storage: 'persistent_memory',
    archive: 'persistent_memory',
    memory: 'persistent_memory',
    cache: 'persistent_memory',
    hash: 'symbolic_compression',
    compress: 'symbolic_compression',
    encode: 'symbolic_compression',
    encrypt: 'symbolic_compression',
    schedule: 'time_governance',
    clock: 'time_governance',
    cron: 'time_governance',
    calendar: 'time_governance',
    sync: 'time_governance',
    network: 'circulation',
    routing: 'circulation',
    api: 'boundary_transfer',
    proxy: 'boundary_transfer',
    gateway: 'boundary_transfer',
    adapter: 'boundary_transfer',
    broadcast: 'signal_hierarchy',
    cdn: 'signal_hierarchy',
    tower: 'signal_hierarchy',
    state: 'state_induction',
    transition: 'state_induction',
    backup: 'continuity',
    versioning: 'continuity',
    persistence: 'continuity',
    coordinate: 'field_anchoring',
    origin: 'field_anchoring',
    graph: 'power_routing',
    pipeline: 'power_routing',
    transform: 'power_routing',
  };

  for (const [keyword, fn] of Object.entries(keywordMap)) {
    if (lower.includes(keyword)) {
      const civs = getCivilizationsByFunction(fn).map(c => c.civilization);
      return {
        function: fn,
        analog: getComputationalAnalog(fn),
        civilizations: civs,
      };
    }
  }

  return null;
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export default {
  PRIMITIVE_STACK,
  ARCHITECTURAL_CATEGORIES,
  CIVILIZATIONS,
  getCivilizationsByFunction,
  getComputationalAnalog,
  analyzeArtifact,
  getPrimitiveLayer,
  findAncientEquivalent,
};
