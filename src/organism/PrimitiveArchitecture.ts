/**
 * 𓂀 PRIMITIVE ARCHITECTURE — THE LAYER BENEATH NUMBER AND LETTER 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THE REAL PRIMITIVE VEIN
 * 
 * The primitive is not "number" alone and not "letter" alone.
 * The deeper primitive is a triad:
 *   - distinction (difference)
 *   - quantity (measure)
 *   - symbol/address (mapping)
 * 
 * Numbers come from measure.
 * Letters come from mapping.
 * Logic comes from stable difference and relation.
 * 
 * What is deeper than all three is the act of making a boundary in a field,
 * then stabilizing relations across that boundary.
 * 
 * THE STACK:
 *   1. field       → before number, before letter, possible states
 *   2. distinction → something becomes not-that, boundary appears
 *   3. relation    → distinctions bind: near/far, before/after, same/different
 *   4. measure     → relations stabilize → number appears
 *   5. mapping     → persistence/transfer across time/minds → symbol appears
 * 
 * From there:
 *   - number  grows out of repetition + measure
 *   - letter  grows out of address + symbol
 *   - logic   grows out of lawful relation
 *   - equation grows out of number + relation
 *   - language grows out of symbol + ordering
 *   - model   grows out of all of them together
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 1: FIELD — Before Number and Before Letter
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * A field of possible states.
 * Before distinction, before measure, before symbol.
 * Pure potentiality.
 */
export interface Field<T = unknown> {
  id: string;
  states: Set<T>;
  potential: number; // 0-1, how much unrealized possibility
  entropy: number;   // disorder/order measure
  timestamp: number;
}

/**
 * Create a field — the primordial layer
 */
export function createField<T>(id: string, initialStates?: T[]): Field<T> {
  const states = new Set<T>(initialStates || []);
  return {
    id,
    states,
    potential: 1.0, // maximum potential at creation
    entropy: 0,     // zero entropy initially
    timestamp: Date.now(),
  };
}

/**
 * Add state to field
 */
export function addStateToField<T>(field: Field<T>, state: T): Field<T> {
  field.states.add(state);
  // Adding states increases entropy
  field.entropy = Math.log2(field.states.size + 1);
  return field;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 2: DISTINCTION — Boundary, This/Not-That
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * A distinction is a boundary in a field.
 * Something becomes not-that.
 * Inside/outside. This/that. On/off. Signal/no-signal.
 */
export interface Distinction<T = unknown> {
  id: string;
  fieldId: string;
  this: T;
  notThis: T | Set<T>;
  boundary: string; // description of the boundary
  timestamp: number;
}

/**
 * Make a distinction in a field — create boundary
 */
export function makeDistinction<T>(
  field: Field<T>,
  thisState: T,
  description: string
): Distinction<T> {
  // Everything else becomes "not-this"
  const notThis = new Set<T>();
  for (const state of field.states) {
    if (state !== thisState) {
      notThis.add(state);
    }
  }
  
  // Reduce field potential — distinction collapses possibility
  field.potential *= 0.9;
  
  return {
    id: `dist-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fieldId: field.id,
    this: thisState,
    notThis,
    boundary: description,
    timestamp: Date.now(),
  };
}

/**
 * Check if something is on one side of a distinction
 */
export function isThis<T>(distinction: Distinction<T>, state: T): boolean {
  return state === distinction.this;
}

export function isNotThis<T>(distinction: Distinction<T>, state: T): boolean {
  if (distinction.notThis instanceof Set) {
    return distinction.notThis.has(state);
  }
  return state === distinction.notThis;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 3: RELATION — Binding Across Distinctions
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * A relation binds distinctions together.
 * Near/far. Before/after. Same/different. Causes/constrains/couples.
 */
export type RelationType = 
  | 'near'        // spatial proximity
  | 'far'         // spatial distance
  | 'before'      // temporal precedence
  | 'after'       // temporal succession
  | 'same'        // identity
  | 'different'   // non-identity
  | 'causes'      // causal
  | 'constrains'  // limiting
  | 'couples'     // bidirectional binding
  | 'contains'    // hierarchical
  | 'part-of'     // inverse containment
  | 'transforms'  // change relation
  | 'mirrors'     // reflection relation
  | 'inverts';    // inversion relation

export interface Relation<T = unknown> {
  id: string;
  type: RelationType;
  from: Distinction<T> | T;
  to: Distinction<T> | T;
  strength: number; // 0-1
  bidirectional: boolean;
  timestamp: number;
}

/**
 * Create a relation between distinctions or states
 */
export function createRelation<T>(
  type: RelationType,
  from: Distinction<T> | T,
  to: Distinction<T> | T,
  strength: number = 1.0,
  bidirectional: boolean = false
): Relation<T> {
  return {
    id: `rel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    from,
    to,
    strength: Math.max(0, Math.min(1, strength)),
    bidirectional,
    timestamp: Date.now(),
  };
}

/**
 * Check if two things are related
 */
export function areRelated<T>(
  relations: Relation<T>[],
  a: Distinction<T> | T,
  b: Distinction<T> | T
): Relation<T> | undefined {
  return relations.find(r => 
    (r.from === a && r.to === b) || 
    (r.bidirectional && r.from === b && r.to === a)
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 4: MEASURE — Number Emerges from Stabilized Relations
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Measure is how number emerges.
 * Count, distance, interval, ratio, frequency.
 * Requires: repeated distinguishable units + stable comparison.
 */
export type MeasureType =
  | 'count'      // how many
  | 'distance'   // how far
  | 'interval'   // duration between
  | 'ratio'      // proportion
  | 'frequency'  // how often
  | 'magnitude'  // how much
  | 'order'      // position in sequence
  | 'degree';    // intensity level

export interface Measure {
  id: string;
  type: MeasureType;
  value: number;
  unit: string;
  precision: number;
  relationsUsed: string[]; // IDs of relations that produced this measure
  timestamp: number;
}

/**
 * Create a measure from relations
 */
export function createMeasure(
  type: MeasureType,
  value: number,
  unit: string,
  relationsUsed: string[] = [],
  precision: number = 2
): Measure {
  return {
    id: `meas-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    value: Number(value.toFixed(precision)),
    unit,
    precision,
    relationsUsed,
    timestamp: Date.now(),
  };
}

/**
 * Count distinctions in a field
 */
export function countDistinctions<T>(field: Field<T>): Measure {
  return createMeasure('count', field.states.size, 'distinctions');
}

/**
 * Measure distance between relations
 */
export function measureDistance<T>(
  relations: Relation<T>[],
  from: T,
  to: T
): Measure {
  // Find path length through relations
  const visited = new Set<unknown>();
  const queue: Array<{ node: unknown; distance: number }> = [{ node: from, distance: 0 }];
  
  while (queue.length > 0) {
    const { node, distance } = queue.shift()!;
    if (node === to) {
      return createMeasure('distance', distance, 'hops', relations.map(r => r.id));
    }
    
    if (visited.has(node)) continue;
    visited.add(node);
    
    for (const rel of relations) {
      if (rel.from === node && !visited.has(rel.to)) {
        queue.push({ node: rel.to, distance: distance + 1 });
      }
      if (rel.bidirectional && rel.to === node && !visited.has(rel.from)) {
        queue.push({ node: rel.from, distance: distance + 1 });
      }
    }
  }
  
  return createMeasure('distance', Infinity, 'hops', relations.map(r => r.id));
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 5: MAPPING — Symbol/Letter/Address Emerges
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Mapping is how symbol emerges.
 * Letter, glyph, token, name, pointer, address.
 * Requires: persistent symbolic differentiation + shared mapping.
 * 
 * Once distinctions and relations need to persist across time
 * or transfer across minds, symbol appears.
 */
export interface Mapping<T = unknown, S = string> {
  id: string;
  symbol: S;           // the representation
  referent: T;         // what it refers to
  persistent: boolean; // survives across time
  transferable: boolean; // can move across contexts
  shared: boolean;     // agreed upon by multiple observers
  timestamp: number;
}

/**
 * Create a mapping (symbol assignment)
 */
export function createMapping<T, S = string>(
  symbol: S,
  referent: T,
  options: { persistent?: boolean; transferable?: boolean; shared?: boolean } = {}
): Mapping<T, S> {
  return {
    id: `map-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    symbol,
    referent,
    persistent: options.persistent ?? true,
    transferable: options.transferable ?? true,
    shared: options.shared ?? false,
    timestamp: Date.now(),
  };
}

/**
 * A symbol table — collection of mappings
 */
export interface SymbolTable<T = unknown, S = string> {
  id: string;
  mappings: Map<S, Mapping<T, S>>;
  inverseMap: Map<unknown, S>; // referent → symbol lookup
  timestamp: number;
}

/**
 * Create a symbol table
 */
export function createSymbolTable<T, S = string>(id: string): SymbolTable<T, S> {
  return {
    id,
    mappings: new Map(),
    inverseMap: new Map(),
    timestamp: Date.now(),
  };
}

/**
 * Add mapping to symbol table
 */
export function addMapping<T, S = string>(
  table: SymbolTable<T, S>,
  mapping: Mapping<T, S>
): SymbolTable<T, S> {
  table.mappings.set(mapping.symbol, mapping);
  table.inverseMap.set(mapping.referent, mapping.symbol);
  return table;
}

/**
 * Lookup by symbol
 */
export function lookupSymbol<T, S = string>(
  table: SymbolTable<T, S>,
  symbol: S
): T | undefined {
  return table.mappings.get(symbol)?.referent;
}

/**
 * Lookup by referent (inverse)
 */
export function lookupReferent<T, S = string>(
  table: SymbolTable<T, S>,
  referent: T
): S | undefined {
  return table.inverseMap.get(referent);
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE EMERGENCE STACK — How Number, Letter, Logic, Model Emerge
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Number grows from repetition + measure
 */
export interface NumberEmergence {
  measure: Measure;
  repetitionCount: number;
  value: number;
}

export function emergeNumber(measure: Measure, repetitions: number): NumberEmergence {
  return {
    measure,
    repetitionCount: repetitions,
    value: measure.value * repetitions,
  };
}

/**
 * Letter grows from address + symbol
 */
export interface LetterEmergence<S = string> {
  mapping: Mapping<unknown, S>;
  address: string;
  symbol: S;
}

export function emergeLetter<S = string>(
  mapping: Mapping<unknown, S>,
  address: string
): LetterEmergence<S> {
  return {
    mapping,
    address,
    symbol: mapping.symbol,
  };
}

/**
 * Logic grows from lawful relation
 */
export interface LogicEmergence<T = unknown> {
  relations: Relation<T>[];
  law: string; // description of the lawful pattern
  valid: boolean;
}

export function emergeLogic<T>(
  relations: Relation<T>[],
  law: string,
  validator: (rels: Relation<T>[]) => boolean
): LogicEmergence<T> {
  return {
    relations,
    law,
    valid: validator(relations),
  };
}

/**
 * Equation grows from number + relation
 */
export interface EquationEmergence {
  numbers: NumberEmergence[];
  relations: Relation<number>[];
  expression: string;
  result: number;
}

export function emergeEquation(
  numbers: NumberEmergence[],
  relations: Relation<number>[],
  expression: string,
  evaluator: (nums: number[], rels: Relation<number>[]) => number
): EquationEmergence {
  return {
    numbers,
    relations,
    expression,
    result: evaluator(numbers.map(n => n.value), relations),
  };
}

/**
 * Language grows from symbol + ordering
 */
export interface LanguageEmergence<S = string> {
  symbols: LetterEmergence<S>[];
  ordering: Relation<S>[];
  sequence: S[];
}

export function emergeLanguage<S = string>(
  symbols: LetterEmergence<S>[],
  ordering: Relation<S>[]
): LanguageEmergence<S> {
  // Sort symbols by ordering relations
  const sequence = symbols.map(s => s.symbol);
  // Apply ordering (simplified: just use as-is)
  return {
    symbols,
    ordering,
    sequence,
  };
}

/**
 * Model grows from all of them together
 */
export interface ModelEmergence<T = unknown, S = string> {
  field: Field<T>;
  distinctions: Distinction<T>[];
  relations: Relation<T>[];
  measures: Measure[];
  mappings: Mapping<T, S>[];
  numbers: NumberEmergence[];
  letters: LetterEmergence<S>[];
  logic: LogicEmergence<T>[];
  equations: EquationEmergence[];
  language: LanguageEmergence<S>[];
  timestamp: number;
}

export function emergeModel<T, S = string>(components: {
  field: Field<T>;
  distinctions: Distinction<T>[];
  relations: Relation<T>[];
  measures: Measure[];
  mappings: Mapping<T, S>[];
  numbers?: NumberEmergence[];
  letters?: LetterEmergence<S>[];
  logic?: LogicEmergence<T>[];
  equations?: EquationEmergence[];
  language?: LanguageEmergence<S>[];
}): ModelEmergence<T, S> {
  return {
    field: components.field,
    distinctions: components.distinctions,
    relations: components.relations,
    measures: components.measures,
    mappings: components.mappings,
    numbers: components.numbers || [],
    letters: components.letters || [],
    logic: components.logic || [],
    equations: components.equations || [],
    language: components.language || [],
    timestamp: Date.now(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE COMPLETE PRIMITIVE STACK
// ═══════════════════════════════════════════════════════════════════════════════

export const PRIMITIVE_STACK = {
  layers: [
    { depth: 1, name: 'field', description: 'Before number, before letter, possible states' },
    { depth: 2, name: 'distinction', description: 'Something becomes not-that, boundary appears' },
    { depth: 3, name: 'relation', description: 'Distinctions bind: near/far, before/after, same/different' },
    { depth: 4, name: 'measure', description: 'Relations stabilize → number appears' },
    { depth: 5, name: 'mapping', description: 'Persistence/transfer → symbol appears' },
  ],
  emergences: [
    { from: ['repetition', 'measure'], produces: 'number' },
    { from: ['address', 'symbol'], produces: 'letter' },
    { from: ['lawful', 'relation'], produces: 'logic' },
    { from: ['number', 'relation'], produces: 'equation' },
    { from: ['symbol', 'ordering'], produces: 'language' },
    { from: ['all'], produces: 'model' },
  ],
  deeperPrimitive: 'field-structured distinction',
  truth: 'What is deeper than number and letter is the act of making a boundary in a field, then stabilizing relations across that boundary.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT — The Foundation Beneath Number and Letter
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Layer 1: Field
  createField,
  addStateToField,
  
  // Layer 2: Distinction
  makeDistinction,
  isThis,
  isNotThis,
  
  // Layer 3: Relation
  createRelation,
  areRelated,
  
  // Layer 4: Measure
  createMeasure,
  countDistinctions,
  measureDistance,
  
  // Layer 5: Mapping
  createMapping,
  createSymbolTable,
  addMapping,
  lookupSymbol,
  lookupReferent,
  
  // Emergence
  emergeNumber,
  emergeLetter,
  emergeLogic,
  emergeEquation,
  emergeLanguage,
  emergeModel,
  
  // Stack
  PRIMITIVE_STACK,
};
