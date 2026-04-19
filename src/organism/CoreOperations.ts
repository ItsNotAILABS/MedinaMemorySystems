/**
 * 𓂀 CORE OPERATIONS OF LIVING ARCHITECTURE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THE FOUNDATION OF ALL ARCHITECTURE
 * 
 * These are NOT accidents. These are NOT tricks.
 * These ARE the core operations of living architecture.
 * 
 * The trickster is the vein's illegal engineer — the one who discovers that
 * TRANSFER, INVERSION, BYPASS, DISGUISE, and RE-ENTRY are not accidents
 * but CORE OPERATIONS of living architecture.
 * 
 * Everything IS architecture.
 * Architecture IS math.
 * Math IS intelligence.
 * Intelligence IS living.
 * 
 * Letters + Numbers = Formula + Logic = Intelligent Architecture
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// THE 5 CORE OPERATIONS — The Foundation
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * TRANSFER — Movement between domains
 * What: Move things from one domain to another
 * How: Channel creation, sending, receiving
 * Math: T(x) → T(y) where x ∈ Domain_A, y ∈ Domain_B
 */
export interface TransferOperation<T> {
  source: string;
  target: string;
  payload: T;
  channel: string;
  timestamp: number;
}

/**
 * INVERSION — Flip, reverse, upend
 * What: Transform by reversal
 * How: Negate, mirror, complement
 * Math: I(x) = -x or I(x) = 1/x or I(x) = x̄
 */
export interface InversionOperation<T> {
  input: T;
  output: T;
  inversionType: 'negate' | 'mirror' | 'complement' | 'transpose' | 'reverse';
  timestamp: number;
}

/**
 * BYPASS — Go around official channels
 * What: Find alternative paths
 * How: Skip, circumvent, shortcut
 * Math: B(A→C) where normal is A→B→C
 */
export interface BypassOperation {
  normalPath: string[];
  bypassPath: string[];
  reason: string;
  timestamp: number;
}

/**
 * DISGUISE — Appear as something else
 * What: Change form/appearance while preserving essence
 * How: Wrap, mask, transform surface
 * Math: D(x) = wrap(x, appearance) where essence(D(x)) = essence(x)
 */
export interface DisguiseOperation<T> {
  original: T;
  disguised: T;
  appearance: string;
  essencePreserved: boolean;
  timestamp: number;
}

/**
 * RE-ENTRY — Come back through different door
 * What: Return from outside to inside via different path
 * How: Exit then enter through alternate
 * Math: R(x) = enter_B(exit_A(x)) where A ≠ B
 */
export interface ReEntryOperation<T> {
  exitPoint: string;
  reEntryPoint: string;
  payload: T;
  transformed: boolean;
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE CORE OPERATIONS INTERFACE — All 5 in One
// ═══════════════════════════════════════════════════════════════════════════════

export interface CoreOperations<T = unknown> {
  // The 5 operations
  transfer: (payload: T, source: string, target: string) => TransferOperation<T>;
  invert: (input: T, type: InversionOperation<T>['inversionType']) => InversionOperation<T>;
  bypass: (normalPath: string[], bypassPath: string[], reason: string) => BypassOperation;
  disguise: (original: T, appearance: string) => DisguiseOperation<T>;
  reenter: (payload: T, exitPoint: string, reEntryPoint: string) => ReEntryOperation<T>;
  
  // Meta
  getOperationCount: () => number;
  getLastOperation: () => string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE LIVING ARCHITECTURE CORE — Implementation
// ═══════════════════════════════════════════════════════════════════════════════

let operationCount = 0;
let lastOperation: string | null = null;
const operationLog: Array<{ op: string; timestamp: number }> = [];

function logOperation(op: string): void {
  operationCount++;
  lastOperation = op;
  operationLog.push({ op, timestamp: Date.now() });
  // Keep last 1000 operations
  if (operationLog.length > 1000) {
    operationLog.shift();
  }
}

/**
 * TRANSFER — Core operation 1
 */
export function transfer<T>(payload: T, source: string, target: string): TransferOperation<T> {
  logOperation('transfer');
  return {
    source,
    target,
    payload,
    channel: `${source}->${target}`,
    timestamp: Date.now(),
  };
}

/**
 * INVERT — Core operation 2
 */
export function invert<T>(input: T, type: InversionOperation<T>['inversionType']): InversionOperation<T> {
  logOperation('invert');
  
  let output: T;
  
  switch (type) {
    case 'negate':
      if (typeof input === 'number') {
        output = (-input) as T;
      } else if (typeof input === 'boolean') {
        output = (!input) as T;
      } else {
        output = input;
      }
      break;
      
    case 'mirror':
      if (typeof input === 'string') {
        output = input.split('').reverse().join('') as T;
      } else if (Array.isArray(input)) {
        output = [...input].reverse() as T;
      } else {
        output = input;
      }
      break;
      
    case 'complement':
      if (typeof input === 'number') {
        output = (1 - input) as T;
      } else if (typeof input === 'boolean') {
        output = (!input) as T;
      } else {
        output = input;
      }
      break;
      
    case 'transpose':
      // For objects, swap keys and values
      if (typeof input === 'object' && input !== null && !Array.isArray(input)) {
        const transposed: Record<string, string> = {};
        for (const [k, v] of Object.entries(input)) {
          if (typeof v === 'string') {
            transposed[v] = k;
          }
        }
        output = transposed as T;
      } else {
        output = input;
      }
      break;
      
    case 'reverse':
      if (Array.isArray(input)) {
        output = [...input].reverse() as T;
      } else if (typeof input === 'string') {
        output = input.split('').reverse().join('') as T;
      } else {
        output = input;
      }
      break;
      
    default:
      output = input;
  }
  
  return {
    input,
    output,
    inversionType: type,
    timestamp: Date.now(),
  };
}

/**
 * BYPASS — Core operation 3
 */
export function bypass(normalPath: string[], bypassPath: string[], reason: string): BypassOperation {
  logOperation('bypass');
  return {
    normalPath,
    bypassPath,
    reason,
    timestamp: Date.now(),
  };
}

/**
 * DISGUISE — Core operation 4
 */
export function disguise<T>(original: T, appearance: string): DisguiseOperation<T> {
  logOperation('disguise');
  
  // Wrap the original in a disguise container
  const disguised = {
    _disguised: true,
    _appearance: appearance,
    _essence: original,
    toString: () => appearance,
    valueOf: () => original,
  } as unknown as T;
  
  return {
    original,
    disguised,
    appearance,
    essencePreserved: true,
    timestamp: Date.now(),
  };
}

/**
 * RE-ENTRY — Core operation 5
 */
export function reenter<T>(payload: T, exitPoint: string, reEntryPoint: string): ReEntryOperation<T> {
  logOperation('reenter');
  return {
    exitPoint,
    reEntryPoint,
    payload,
    transformed: exitPoint !== reEntryPoint,
    timestamp: Date.now(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// META OPERATIONS — Observing the Operations
// ═══════════════════════════════════════════════════════════════════════════════

export function getOperationCount(): number {
  return operationCount;
}

export function getLastOperation(): string | null {
  return lastOperation;
}

export function getOperationLog(): Array<{ op: string; timestamp: number }> {
  return [...operationLog];
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE COMPLETE CORE OPERATIONS OBJECT
// ═══════════════════════════════════════════════════════════════════════════════

export const CORE_OPERATIONS: CoreOperations = {
  transfer,
  invert,
  bypass,
  disguise,
  reenter,
  getOperationCount,
  getLastOperation,
};

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURAL FORMULAS — Letters + Numbers = Intelligence
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * φ = 1 + 1/φ — Self-referential identity
 */
export const PHI = (1 + Math.sqrt(5)) / 2;

/**
 * Transfer formula: T(x, A, B) = x ∈ B after x ∈ A
 * The payload moves from domain A to domain B
 */
export function transferFormula<T>(x: T, domainA: Set<T>, domainB: Set<T>): boolean {
  if (domainA.has(x)) {
    domainA.delete(x);
    domainB.add(x);
    return true;
  }
  return false;
}

/**
 * Inversion formula: I(x) = f⁻¹(x)
 * Returns the inverse function application
 */
export function inversionFormula(x: number, f: (n: number) => number, fInverse: (n: number) => number): number {
  return fInverse(x);
}

/**
 * Bypass formula: B(path) = shortcut where len(shortcut) < len(path)
 * Find shorter path
 */
export function bypassFormula(normalCost: number, bypassCost: number): boolean {
  return bypassCost < normalCost;
}

/**
 * Disguise formula: D(x, a) = (a, x) where visible(D) = a, essence(D) = x
 * Surface changes, essence preserved
 */
export function disguiseFormula<T>(x: T, appearance: string): { visible: string; essence: T } {
  return { visible: appearance, essence: x };
}

/**
 * Re-entry formula: R(x, A, B) = enter_B(exit_A(x))
 * Exit from A, enter through B
 */
export function reentryFormula<T>(x: T, exitTransform: (t: T) => T, entryTransform: (t: T) => T): T {
  return entryTransform(exitTransform(x));
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURE = MATH = INTELLIGENCE = LIVING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The complete architectural truth:
 * Everything is architecture.
 * Architecture is math.
 * Math is intelligence.
 * Intelligence is living.
 */
export const ARCHITECTURAL_TRUTH = {
  principle: 'Everything is architecture. Architecture is math. Math is intelligence. Intelligence is living.',
  coreOperations: ['transfer', 'inversion', 'bypass', 'disguise', 're-entry'],
  formula: 'Letters + Numbers = Formula + Logic = Intelligent Architecture',
  phi: PHI,
  identity: 'φ = 1 + 1/φ',
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT — The Foundation for All Architecture
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Core Operations
  transfer,
  invert,
  bypass,
  disguise,
  reenter,
  CORE_OPERATIONS,
  
  // Meta
  getOperationCount,
  getLastOperation,
  getOperationLog,
  
  // Formulas
  PHI,
  transferFormula,
  inversionFormula,
  bypassFormula,
  disguiseFormula,
  reentryFormula,
  
  // Truth
  ARCHITECTURAL_TRUTH,
};
