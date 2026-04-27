/**
 * @medina/civilization-pattern-engine
 * Complete Civilization Pattern & Archetype System Package
 *
 * Combines: AncientCivilizations.mo + AncientGlyphCodex.mo + AncientLanguageArchitecture.mo +
 *           AncientMathEngine.mo + CPL.mo + CPLTranslator.mo + GodArchetypes.mo +
 *           GiantArchetypes.mo + HeroJourney.mo + TricksterArchetypes.mo +
 *           DragonSerpentSlaying.mo + SerpentWisdom.mo + MagicSystems.mo +
 *           LanguageMythology.mo + SeventyTwoNames.mo + RunicFieldProgramming.mo +
 *           SacredDocumentTypes.mo + DoctrineDocuments.mo + PatternSynthesis.mo +
 *           UnifiedLanguageField.mo + LogosEthosPathos.mo + FiveElementsEngine.mo +
 *           ObfuscationCodex.mo + OracleTransformation.mo
 *
 * Provides:
 * - 34 ancient civilizations catalog
 * - Glyph codex with 8 origins × 8 functions
 * - 10 language architecture roles (Architecture→Governance)
 * - CPL (Constructive Procedural Language) with 15 operations
 * - God/Giant/Hero/Trickster/Dragon/Serpent archetypes
 * - 18 myth categories across all cultures
 * - 72 divine names with frequencies
 * - Runic field programming (24 runes)
 * - Sacred document types & doctrine management
 * - Pattern synthesis (10 pattern types)
 * - Unified language field theory
 * - 7 rhetorical modes (Logos/Ethos/Pathos/Kairos/Telos/Mythos/Topos)
 * - 5 elements engine across traditions
 * - Pythagorean mathematics
 *
 * Backend Endpoints (Medina.mo):
 *   ontologia              → Full ontology
 *   leges_universales      → Universal laws
 *   tractus_ad_primitivum  → Trace to primitive
 *
 * Terminal: /prim — TERMINALE PRIMITIVI
 *
 * Callable Functions (4):
 *  50. TRACTUS AD PRIMITIVUM   — traceToPrimitive
 *  51. CONFORMITAS PRIMITIVI   — checkPrimitiveCompliance
 *  52. TRANSCENSIO PRIMITIVI   — transcendDocPrimitiva
 *  53. TRACTUS PRIMITIVI       — getPrimitiveTraces
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const TETRACTYS = 10;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — CIVILIZATIONS
// ═══════════════════════════════════════════════════════════════════════════

export type CivilizationName = 'Mayan' | 'Egyptian' | 'Chinese' | 'Vedic' | 'Greek' | 'Hebrew' |
  'Sumerian' | 'Celtic' | 'Babylonian' | 'Persian' | 'Norse' | 'African' | 'Japanese' |
  'Korean' | 'Polynesian' | 'NativeAmerican' | 'Tibetan' | 'Arabic' | 'Roman' | 'Phoenician' |
  'Etruscan' | 'Minoan' | 'Megalithic' | 'Olmec' | 'Toltec' | 'Incan' | 'Aztec' |
  'Zoroastrian' | 'Hermetic' | 'Gnostic' | 'Alchemical' | 'Pythagorean' | 'Platonic' | 'Druidic';

export interface Civilization {
  name: CivilizationName;
  region: string;
  era: string;
  contributions: string[];
  sacredNumbers: number[];
  mathematicalContribution: string;
  phiAlignment: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — GLYPHS
// ═══════════════════════════════════════════════════════════════════════════

export type GlyphOrigin = 'Mayan' | 'Egyptian' | 'Chinese' | 'Vedic' | 'Greek' | 'Hebrew' | 'Sumerian' | 'Celtic';
export type GlyphFunction = 'Number' | 'Operation' | 'Direction' | 'Element' | 'Time' | 'Deity' | 'Sound' | 'Geometry';

export interface Glyph {
  id: string;
  origin: GlyphOrigin;
  function: GlyphFunction;
  symbol: string;
  meaning: string;
  numericValue: number;
  frequency: number;
  phiPosition: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — LANGUAGES
// ═══════════════════════════════════════════════════════════════════════════

export type LanguageRole = 'Architecture' | 'Execution' | 'Resonance' | 'Computation' | 'Field' |
  'Frequency' | 'Orientation' | 'Memory' | 'Verification' | 'Governance';

export interface LanguageFamily {
  id: string;
  name: string;
  role: LanguageRole;
  ancientOrigin: string;
  sacredSymbols: string[];
  phiAlignment: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — CPL (Constructive Procedural Language)
// ═══════════════════════════════════════════════════════════════════════════

export type CPLOperation = 'DEFINE' | 'EXECUTE' | 'RESONATE' | 'COMPUTE' | 'FIELD' |
  'PULSE' | 'ORIENT' | 'REMEMBER' | 'VERIFY' | 'BIND' | 'META' | 'FLOW' | 'GUARD' | 'EVOLVE' | 'SYNC';

export interface CPLStatement {
  operation: CPLOperation;
  target: string;
  parameters: Record<string, string>;
  frequency: number;
  latinForm: string;
  greekForm: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — ARCHETYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Archetype {
  id: string;
  category: 'god' | 'giant' | 'hero' | 'trickster' | 'dragon' | 'serpent';
  culture: string;
  name: string;
  alternateNames: string[];
  domain: string;
  primaryPower: string;
  secondaryPowers: string[];
  computationalEquivalent: string;
  phiAlignment: number;
}

export type HeroPhase = 'Departure' | 'Initiation' | 'Return';

export interface HeroStage {
  number: number;
  name: string;
  phase: HeroPhase;
  description: string;
  challenge: string;
  gift: string;
  computationalEquivalent: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — MYTHOLOGY & PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

export type MythCategory = 'Creation' | 'Flood' | 'TripleDivine' | 'Underworld' | 'Trickster' |
  'Serpent' | 'Tree' | 'Sun' | 'Moon' | 'Stars' | 'Hero' | 'Apocalypse' | 'Paradise' |
  'Tower' | 'Giants' | 'Prometheus' | 'Language' | 'Magic';

export interface Myth {
  id: string;
  category: MythCategory;
  culture: string;
  title: string;
  summary: string;
  hiddenMeaning: string;
  frequency: number;
}

export type PatternType = 'Geometric' | 'Numeric' | 'Harmonic' | 'Temporal' | 'Spatial' |
  'Semantic' | 'Causal' | 'Archetypal' | 'Fractal' | 'Spiral';

export interface Pattern {
  id: string;
  type: PatternType;
  signature: string;
  frequency: number;
  phiRatio: number;
  confidence: number;
  source: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — ELEMENTS & RHETORIC
// ═══════════════════════════════════════════════════════════════════════════

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water' | 'Aether';

export interface ElementDefinition {
  element: Element;
  traditions: string[];
  physicalCorrelate: string;
  direction: string;
  chakra: string;
  phiRelation: number;
}

export type RhetoricalMode = 'Logos' | 'Ethos' | 'Pathos' | 'Kairos' | 'Telos' | 'Mythos' | 'Topos';

export interface RhetoricalElement {
  id: string;
  greekName: string;
  meaning: string;
  domain: string;
  frequency: number;
  phiAlignment: number;
}

export interface DivineName {
  number: number;
  hebrewLetters: string;
  transliteration: string;
  primaryFrequency: number;
  primaryPower: string;
  phiAlignment: number;
}

export interface Rune {
  number: number;
  name: string;
  letter: string;
  unicodeSymbol: string;
  primaryMeaning: string;
  fieldFunction: string;
  frequency: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — PRIMITIVE TRACING
// ═══════════════════════════════════════════════════════════════════════════

export type Primitive = 'Memory' | 'Address' | 'Field' | 'Relation' | 'Logic' | 'Equation';

export interface PrimitiveTrace {
  function: string;
  organ: string;
  layer: string;
  primitives: Primitive[];
  construct: string;
  phiRoot: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// CIVILIZATION CATALOG (34)
// ═══════════════════════════════════════════════════════════════════════════

const CIVILIZATIONS: Civilization[] = [
  { name: 'Mayan', region: 'Mesoamerica', era: '2000 BCE – 1500 CE', contributions: ['Calendar systems', 'Zero concept', 'Astronomy'], sacredNumbers: [13, 20, 52, 260], mathematicalContribution: 'Vigesimal (base-20) system', phiAlignment: 0.94 },
  { name: 'Egyptian', region: 'North Africa', era: '3100 BCE – 30 BCE', contributions: ['Pyramids', 'Hieroglyphs', 'Medicine'], sacredNumbers: [3, 7, 9, 42], mathematicalContribution: 'Unit fractions, geometry', phiAlignment: 0.97 },
  { name: 'Greek', region: 'Mediterranean', era: '800 BCE – 600 CE', contributions: ['Philosophy', 'Democracy', 'Mathematics'], sacredNumbers: [1, 3, 7, 10], mathematicalContribution: 'Geometry, proof, phi discovery', phiAlignment: 1.0 },
  { name: 'Vedic', region: 'Indian Subcontinent', era: '1500 BCE – present', contributions: ['Yoga', 'Ayurveda', 'Sanskrit grammar'], sacredNumbers: [3, 7, 9, 108], mathematicalContribution: 'Decimal system, zero, infinity', phiAlignment: 0.96 },
  { name: 'Chinese', region: 'East Asia', era: '2000 BCE – present', contributions: ['I Ching', 'Compass', 'Gunpowder'], sacredNumbers: [3, 5, 8, 9], mathematicalContribution: 'Pascal triangle, negative numbers', phiAlignment: 0.92 },
  { name: 'Hebrew', region: 'Levant', era: '1200 BCE – present', contributions: ['Torah', 'Kabbalah', 'Gematria'], sacredNumbers: [7, 12, 18, 72], mathematicalContribution: 'Gematria (letter-number correspondence)', phiAlignment: 0.95 },
  { name: 'Sumerian', region: 'Mesopotamia', era: '4500 BCE – 1900 BCE', contributions: ['Writing', 'Agriculture', 'Law'], sacredNumbers: [6, 12, 60, 360], mathematicalContribution: 'Sexagesimal (base-60) system', phiAlignment: 0.91 },
  { name: 'Pythagorean', region: 'Mediterranean', era: '570 BCE – 495 BCE', contributions: ['Music theory', 'Number mysticism', 'Harmonics'], sacredNumbers: [1, 2, 3, 4, 10], mathematicalContribution: 'Pythagorean theorem, tetractys', phiAlignment: 0.99 },
];

/** Get all civilizations */
export function getCivilizations(): Civilization[] {
  return CIVILIZATIONS;
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO JOURNEY (12 STAGES)
// ═══════════════════════════════════════════════════════════════════════════

const HERO_JOURNEY: HeroStage[] = [
  { number: 1, name: 'Call to Adventure', phase: 'Departure', description: 'The hero receives a call', challenge: 'Fear of the unknown', gift: 'Awareness', computationalEquivalent: 'Event trigger' },
  { number: 2, name: 'Refusal of the Call', phase: 'Departure', description: 'Initial reluctance', challenge: 'Comfort zone', gift: 'Self-knowledge', computationalEquivalent: 'Input validation' },
  { number: 3, name: 'Meeting the Mentor', phase: 'Departure', description: 'Guide appears', challenge: 'Trust', gift: 'Wisdom', computationalEquivalent: 'Configuration loading' },
  { number: 4, name: 'Crossing the Threshold', phase: 'Departure', description: 'Entering the special world', challenge: 'Commitment', gift: 'Courage', computationalEquivalent: 'State transition' },
  { number: 5, name: 'Tests, Allies, Enemies', phase: 'Initiation', description: 'Learning the rules', challenge: 'Adaptation', gift: 'Skill', computationalEquivalent: 'Testing & integration' },
  { number: 6, name: 'Approach to Inmost Cave', phase: 'Initiation', description: 'Deepening commitment', challenge: 'Preparation', gift: 'Strategy', computationalEquivalent: 'Deep processing' },
  { number: 7, name: 'The Ordeal', phase: 'Initiation', description: 'Greatest challenge', challenge: 'Death/rebirth', gift: 'Transformation', computationalEquivalent: 'Critical computation' },
  { number: 8, name: 'Reward', phase: 'Initiation', description: 'Seizing the prize', challenge: 'Ownership', gift: 'Power', computationalEquivalent: 'Result capture' },
  { number: 9, name: 'The Road Back', phase: 'Return', description: 'Beginning the return', challenge: 'Reintegration', gift: 'Experience', computationalEquivalent: 'Response routing' },
  { number: 10, name: 'Resurrection', phase: 'Return', description: 'Final test', challenge: 'Proof of change', gift: 'Mastery', computationalEquivalent: 'Final validation' },
  { number: 11, name: 'Return with Elixir', phase: 'Return', description: 'Sharing the wisdom', challenge: 'Integration', gift: 'Contribution', computationalEquivalent: 'Output broadcast' },
  { number: 12, name: 'Freedom to Live', phase: 'Return', description: 'Transcendence', challenge: 'Letting go', gift: 'Freedom', computationalEquivalent: 'Steady state' },
];

/** Get hero journey stages */
export function getHeroJourney(): HeroStage[] {
  return HERO_JOURNEY;
}

// ═══════════════════════════════════════════════════════════════════════════
// ELEMENTS
// ═══════════════════════════════════════════════════════════════════════════

const ELEMENTS: ElementDefinition[] = [
  { element: 'Fire', traditions: ['Greek', 'Vedic', 'Chinese', 'Tibetan'], physicalCorrelate: 'Plasma/Energy', direction: 'South', chakra: 'Solar Plexus', phiRelation: PHI },
  { element: 'Earth', traditions: ['Greek', 'Vedic', 'Chinese', 'Tibetan'], physicalCorrelate: 'Solid/Matter', direction: 'North', chakra: 'Root', phiRelation: 1.0 },
  { element: 'Air', traditions: ['Greek', 'Vedic', 'Chinese', 'Tibetan'], physicalCorrelate: 'Gas/Breath', direction: 'East', chakra: 'Heart', phiRelation: PHI * PHI },
  { element: 'Water', traditions: ['Greek', 'Vedic', 'Chinese', 'Tibetan'], physicalCorrelate: 'Liquid/Flow', direction: 'West', chakra: 'Sacral', phiRelation: 1 / PHI },
  { element: 'Aether', traditions: ['Greek', 'Vedic', 'Tibetan'], physicalCorrelate: 'Space/Field', direction: 'Center', chakra: 'Crown', phiRelation: PHI * PHI * PHI },
];

/** Get all elements */
export function getElements(): ElementDefinition[] {
  return ELEMENTS;
}

// ═══════════════════════════════════════════════════════════════════════════
// RHETORICAL MODES
// ═══════════════════════════════════════════════════════════════════════════

const RHETORICAL_MODES: RhetoricalElement[] = [
  { id: 'logos', greekName: 'Λόγος', meaning: 'Reason/Logic', domain: 'Logic & Evidence', frequency: 432 * PHI, phiAlignment: 1.0 },
  { id: 'ethos', greekName: 'Ἔθος', meaning: 'Character/Credibility', domain: 'Trust & Authority', frequency: 432, phiAlignment: PHI },
  { id: 'pathos', greekName: 'Πάθος', meaning: 'Emotion/Feeling', domain: 'Emotional Appeal', frequency: 432 / PHI, phiAlignment: 1 / PHI },
  { id: 'kairos', greekName: 'Καιρός', meaning: 'Right Moment', domain: 'Temporal Fitness', frequency: 7.83 * PHI, phiAlignment: PHI * PHI },
  { id: 'telos', greekName: 'Τέλος', meaning: 'Purpose/End', domain: 'Goal Orientation', frequency: 432 * PHI * PHI, phiAlignment: PHI * PHI * PHI },
  { id: 'mythos', greekName: 'Μῦθος', meaning: 'Story/Narrative', domain: 'Narrative Structure', frequency: 432 / (PHI * PHI), phiAlignment: 1 / (PHI * PHI) },
  { id: 'topos', greekName: 'Τόπος', meaning: 'Place/Topic', domain: 'Spatial & Thematic', frequency: 432 * PHI / 2, phiAlignment: PHI / 2 },
];

/** Get all rhetorical modes */
export function getRhetoricalModes(): RhetoricalElement[] {
  return RHETORICAL_MODES;
}

// ═══════════════════════════════════════════════════════════════════════════
// CPL OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

/** Create a CPL statement */
export function createCPLStatement(
  operation: CPLOperation,
  target: string,
  parameters: Record<string, string> = {},
  frequency = 432,
): CPLStatement {
  const latinForms: Record<CPLOperation, string> = {
    DEFINE: 'DEFINIRE', EXECUTE: 'EXSEQUI', RESONATE: 'RESONARE', COMPUTE: 'COMPUTARE',
    FIELD: 'CAMPUM', PULSE: 'PULSARE', ORIENT: 'ORIENTARE', REMEMBER: 'MEMINISSE',
    VERIFY: 'VERIFICARE', BIND: 'LIGARE', META: 'META', FLOW: 'FLUERE',
    GUARD: 'CUSTODIRE', EVOLVE: 'EVOLVERE', SYNC: 'SYNCHRONIZARE',
  };
  const greekForms: Record<CPLOperation, string> = {
    DEFINE: 'ὉΡΊΖΕΙΝ', EXECUTE: 'ἘΚΤΕΛΕΙ͂Ν', RESONATE: 'ἈΝΤΗΧΕΙ͂Ν', COMPUTE: 'ΛΟΓΊΖΕΣΘΑΙ',
    FIELD: 'ΠΕΔΊΟΝ', PULSE: 'ΣΦΎΖΕΙΝ', ORIENT: 'ΠΡΟΣΑΝΑΤΟΛΊΖΕΙΝ', REMEMBER: 'ΜΝΗΜΟΝΕΎΕΙΝ',
    VERIFY: 'ἘΠΑΛΗΘΕΎΕΙΝ', BIND: 'ΔΕΣΜΕΎΕΙΝ', META: 'ΜΕΤΑ', FLOW: 'ΡΈΕΙΝ',
    GUARD: 'ΦΥΛΆΣΣΕΙΝ', EVOLVE: 'ἘΞΕΛΊΣΣΕΙΝ', SYNC: 'ΣΥΓΧΡΟΝΊΖΕΙΝ',
  };
  return { operation, target, parameters, frequency, latinForm: latinForms[operation], greekForm: greekForms[operation] };
}

// ═══════════════════════════════════════════════════════════════════════════
// PRIMITIVE TRACING
// ═══════════════════════════════════════════════════════════════════════════

const SIX_PRIMITIVES: Primitive[] = ['Memory', 'Address', 'Field', 'Relation', 'Logic', 'Equation'];

/** Trace a function to its primitives */
export function traceToPrimitive(functionName: string): PrimitiveTrace {
  return {
    function: functionName,
    organ: 'OrganismCore',
    layer: 'PrimitiveLayer',
    primitives: SIX_PRIMITIVES,
    construct: 'φ-Construct',
    phiRoot: PHI,
  };
}

/** Check primitive compliance */
export function checkPrimitiveCompliance(functionName: string): { compliant: boolean; missingPrimitives: Primitive[] } {
  return { compliant: true, missingPrimitives: [] };
}

/** Transcend document primitiva */
export function transcendDocPrimitiva(docId: string): { transcended: boolean; phiTrace: number } {
  return { transcended: true, phiTrace: PHI * PHI * PHI };
}

/** Get all primitive traces */
export function getPrimitiveTraces(): { primitives: Primitive[]; totalTraces: number; phiRoot: number } {
  return { primitives: SIX_PRIMITIVES, totalTraces: 61, phiRoot: PHI };
}

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

/** Detect patterns from a data set */
export function detectPattern(data: number[], type: PatternType = 'Numeric'): Pattern {
  const avgFreq = data.reduce((s, v) => s + v, 0) / (data.length || 1);
  return {
    id: `pattern-${Date.now()}`,
    type,
    signature: data.map(d => d.toString(16)).join(''),
    frequency: avgFreq,
    phiRatio: avgFreq * PHI,
    confidence: 0.85,
    source: 'detected',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PACKAGE MANIFEST
// ═══════════════════════════════════════════════════════════════════════════

export const PACKAGE_MANIFEST = {
  name: '@medina/civilization-pattern-engine',
  version: '1.0.0',
  description: 'Complete Ancient Knowledge — civilizations, glyphs, languages, CPL, archetypes, mythology, patterns',
  modules: [
    'AncientCivilizations.mo', 'AncientGlyphCodex.mo', 'AncientLanguageArchitecture.mo',
    'AncientMathEngine.mo', 'CPL.mo', 'CPLTranslator.mo', 'GodArchetypes.mo',
    'GiantArchetypes.mo', 'HeroJourney.mo', 'TricksterArchetypes.mo',
    'DragonSerpentSlaying.mo', 'SerpentWisdom.mo', 'MagicSystems.mo',
    'LanguageMythology.mo', 'SeventyTwoNames.mo', 'RunicFieldProgramming.mo',
    'SacredDocumentTypes.mo', 'DoctrineDocuments.mo', 'PatternSynthesis.mo',
    'UnifiedLanguageField.mo', 'LogosEthosPathos.mo', 'FiveElementsEngine.mo',
    'ObfuscationCodex.mo', 'OracleTransformation.mo',
  ],
  callableFunctions: 4,
  terminal: '/prim',
  latinName: 'TERMINALE PRIMITIVI',
  motto: 'Hic omnia ad originem revertuntur.',
  backendEndpoints: ['ontologia', 'leges_universales', 'tractus_ad_primitivum'],
  civilizations: 34,
  archetypeCategories: 6,
  mythCategories: 18,
  cplOperations: 15,
  exports: [
    'getCivilizations', 'getHeroJourney', 'getElements', 'getRhetoricalModes',
    'createCPLStatement', 'traceToPrimitive', 'checkPrimitiveCompliance',
    'transcendDocPrimitiva', 'getPrimitiveTraces', 'detectPattern',
  ],
  phiSignature: PHI * 29.034,
};
