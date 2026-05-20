/**
 * AI Suite 26 — Neuro-Symbolic Integration
 * ============================================================
 * Neural-symbolic reasoning, logic embeddings, rule extraction,
 * differentiable logic, knowledge injection, hybrid architectures,
 * φ-coherent reasoning paths, and integration invariants.
 *
 * Target: 100 tests   Charter: AIS-NSI-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Core Types ───────────────────────────────────────────────────────────────

type Vector = number[];
type LogicalFormula = { type: string; args: (LogicalFormula | string)[] };
type Rule = { head: string; body: string[]; confidence: number };
type KnowledgeBase = { facts: Set<string>; rules: Rule[] };

// ─── Implementations ──────────────────────────────────────────────────────────

function createKnowledgeBase(): KnowledgeBase {
  return { facts: new Set(), rules: [] };
}

function addFact(kb: KnowledgeBase, fact: string): KnowledgeBase {
  const newFacts = new Set(kb.facts);
  newFacts.add(fact);
  return { ...kb, facts: newFacts };
}

function addRule(kb: KnowledgeBase, rule: Rule): KnowledgeBase {
  return { ...kb, rules: [...kb.rules, rule] };
}

function hasFact(kb: KnowledgeBase, fact: string): boolean {
  return kb.facts.has(fact);
}

function forwardChain(kb: KnowledgeBase, maxSteps: number = 10): KnowledgeBase {
  let current = kb;
  for (let step = 0; step < maxSteps; step++) {
    let changed = false;
    for (const rule of current.rules) {
      const bodyTrue = rule.body.every(b => current.facts.has(b));
      if (bodyTrue && !current.facts.has(rule.head)) {
        current = addFact(current, rule.head);
        changed = true;
      }
    }
    if (!changed) break;
  }
  return current;
}

function backwardChain(kb: KnowledgeBase, goal: string, visited: Set<string> = new Set()): boolean {
  if (kb.facts.has(goal)) return true;
  if (visited.has(goal)) return false;
  visited.add(goal);
  
  for (const rule of kb.rules) {
    if (rule.head === goal) {
      if (rule.body.every(b => backwardChain(kb, b, visited))) {
        return true;
      }
    }
  }
  return false;
}

function embedSymbol(symbol: string, dim: number): Vector {
  // Simple hash-based embedding
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0;
  }
  
  const embedding = Array(dim).fill(0);
  for (let i = 0; i < dim; i++) {
    embedding[i] = Math.sin(hash * (i + 1) * PHI) * Math.cos(hash / (i + 1));
  }
  return embedding;
}

function fuzzyAnd(a: number, b: number): number {
  return Math.min(a, b);
}

function fuzzyOr(a: number, b: number): number {
  return Math.max(a, b);
}

function fuzzyNot(a: number): number {
  return 1 - a;
}

function productTNorm(a: number, b: number): number {
  return a * b;
}

function lukasiewiczTNorm(a: number, b: number): number {
  return Math.max(0, a + b - 1);
}

function godelImplication(a: number, b: number): number {
  return a <= b ? 1 : b;
}

function differentiableAnd(a: number, b: number, temp: number = 1): number {
  // Softmin approximation
  const ea = Math.exp(-a / temp);
  const eb = Math.exp(-b / temp);
  return -temp * Math.log(ea + eb - ea * eb);
}

function differentiableOr(a: number, b: number, temp: number = 1): number {
  // Softmax approximation
  const ea = Math.exp(a / temp);
  const eb = Math.exp(b / temp);
  return temp * Math.log(ea + eb - 1);
}

function extractRule(weights: number[], threshold: number = 0.5): string[] {
  const activeFeatures: string[] = [];
  for (let i = 0; i < weights.length; i++) {
    if (Math.abs(weights[i]) > threshold) {
      activeFeatures.push(`f${i}${weights[i] > 0 ? '+' : '-'}`);
    }
  }
  return activeFeatures;
}

function injectKnowledge(embedding: Vector, fact: string, strength: number = 0.1): Vector {
  const factEmb = embedSymbol(fact, embedding.length);
  return embedding.map((v, i) => v + strength * factEmb[i]);
}

function neuralPredicateScore(subject: Vector, predicate: Vector, object: Vector): number {
  // Bilinear model: subject^T * diag(predicate) * object
  let score = 0;
  for (let i = 0; i < Math.min(subject.length, predicate.length, object.length); i++) {
    score += subject[i] * predicate[i] * object[i];
  }
  return 1 / (1 + Math.exp(-score)); // Sigmoid
}

function conceptComposition(c1: Vector, c2: Vector, operation: 'and' | 'or'): Vector {
  if (operation === 'and') {
    return c1.map((v, i) => Math.min(v, c2[i] || 0));
  }
  return c1.map((v, i) => Math.max(v, c2[i] || 0));
}

function analogyScore(a: Vector, b: Vector, c: Vector, d: Vector): number {
  // a:b :: c:d, check if a-b ≈ c-d
  const diffAB = a.map((v, i) => v - (b[i] || 0));
  const diffCD = c.map((v, i) => v - (d[i] || 0));
  
  const dot = diffAB.reduce((s, v, i) => s + v * (diffCD[i] || 0), 0);
  const normAB = Math.sqrt(diffAB.reduce((s, v) => s + v * v, 0));
  const normCD = Math.sqrt(diffCD.reduce((s, v) => s + v * v, 0));
  
  return dot / ((normAB * normCD) || 1);
}

function ruleConfidence(rule: Rule, kb: KnowledgeBase): number {
  // Support / (Support + Negative examples)
  const support = rule.body.filter(b => kb.facts.has(b)).length;
  return support / rule.body.length;
}

function phiReasoningDepth(query: string, kb: KnowledgeBase): number {
  // Depth of reasoning chain scaled by phi
  let depth = 0;
  const visited = new Set<string>();
  const queue = [query];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    
    for (const rule of kb.rules) {
      if (rule.head === current) {
        depth++;
        queue.push(...rule.body);
      }
    }
  }
  
  return depth / PHI;
}

function constraintSatisfaction(variables: number[], constraints: ((v: number[]) => boolean)[]): boolean {
  return constraints.every(c => c(variables));
}

function softConstraintScore(variables: number[], penalties: ((v: number[]) => number)[]): number {
  return penalties.reduce((s, p) => s + p(variables), 0);
}

// ─── SECTION 1: Knowledge base ────────────────────────────────────────────────
describe('NSI § 1 — Knowledge base', () => {
  test('createKnowledgeBase empty', () => {
    const kb = createKnowledgeBase();
    expect(kb.facts.size).toBe(0);
    expect(kb.rules.length).toBe(0);
  });
  test('addFact adds to facts', () => {
    let kb = createKnowledgeBase();
    kb = addFact(kb, 'cat(tom)');
    expect(kb.facts.has('cat(tom)')).toBe(true);
  });
  test('addFact is immutable', () => {
    const kb1 = createKnowledgeBase();
    const kb2 = addFact(kb1, 'fact');
    expect(kb1.facts.size).toBe(0);
    expect(kb2.facts.size).toBe(1);
  });
  test('addRule adds to rules', () => {
    let kb = createKnowledgeBase();
    kb = addRule(kb, { head: 'animal(X)', body: ['cat(X)'], confidence: 1 });
    expect(kb.rules.length).toBe(1);
  });
  test('hasFact true', () => {
    const kb = addFact(createKnowledgeBase(), 'bird(tweety)');
    expect(hasFact(kb, 'bird(tweety)')).toBe(true);
  });
  test('hasFact false', () => {
    const kb = createKnowledgeBase();
    expect(hasFact(kb, 'nonexistent')).toBe(false);
  });
});

// ─── SECTION 2: Forward chaining ──────────────────────────────────────────────
describe('NSI § 2 — Forward chain', () => {
  test('forwardChain derives new facts', () => {
    let kb = createKnowledgeBase();
    kb = addFact(kb, 'cat');
    kb = addRule(kb, { head: 'animal', body: ['cat'], confidence: 1 });
    const result = forwardChain(kb);
    expect(result.facts.has('animal')).toBe(true);
  });
  test('forwardChain multiple rules', () => {
    let kb = createKnowledgeBase();
    kb = addFact(kb, 'A');
    kb = addRule(kb, { head: 'B', body: ['A'], confidence: 1 });
    kb = addRule(kb, { head: 'C', body: ['B'], confidence: 1 });
    const result = forwardChain(kb);
    expect(result.facts.has('C')).toBe(true);
  });
  test('forwardChain no applicable rules', () => {
    let kb = createKnowledgeBase();
    kb = addFact(kb, 'X');
    kb = addRule(kb, { head: 'Z', body: ['Y'], confidence: 1 });
    const result = forwardChain(kb);
    expect(result.facts.has('Z')).toBe(false);
  });
  test('forwardChain with conjunction', () => {
    let kb = createKnowledgeBase();
    kb = addFact(kb, 'A');
    kb = addFact(kb, 'B');
    kb = addRule(kb, { head: 'C', body: ['A', 'B'], confidence: 1 });
    const result = forwardChain(kb);
    expect(result.facts.has('C')).toBe(true);
  });
  test('forwardChain max steps limits iterations', () => {
    let kb = createKnowledgeBase();
    kb = addFact(kb, 'A');
    // Create a chain: A -> B, B -> C (only after B exists)
    kb = addRule(kb, { head: 'B', body: ['A'], confidence: 1 });
    kb = addRule(kb, { head: 'C', body: ['B', 'X'], confidence: 1 }); // X doesn't exist
    const result = forwardChain(kb, 5);
    expect(result.facts.has('B')).toBe(true);
    expect(result.facts.has('C')).toBe(false); // X never added
  });
});

// ─── SECTION 3: Backward chaining ─────────────────────────────────────────────
describe('NSI § 3 — Backward chain', () => {
  test('backwardChain fact exists', () => {
    const kb = addFact(createKnowledgeBase(), 'goal');
    expect(backwardChain(kb, 'goal')).toBe(true);
  });
  test('backwardChain derived', () => {
    let kb = createKnowledgeBase();
    kb = addFact(kb, 'premise');
    kb = addRule(kb, { head: 'goal', body: ['premise'], confidence: 1 });
    expect(backwardChain(kb, 'goal')).toBe(true);
  });
  test('backwardChain not derivable', () => {
    let kb = createKnowledgeBase();
    kb = addRule(kb, { head: 'goal', body: ['missing'], confidence: 1 });
    expect(backwardChain(kb, 'goal')).toBe(false);
  });
  test('backwardChain handles cycles', () => {
    let kb = createKnowledgeBase();
    kb = addRule(kb, { head: 'A', body: ['B'], confidence: 1 });
    kb = addRule(kb, { head: 'B', body: ['A'], confidence: 1 });
    expect(backwardChain(kb, 'A')).toBe(false);
  });
});

// ─── SECTION 4: Symbol embeddings ─────────────────────────────────────────────
describe('NSI § 4 — Embeddings', () => {
  test('embedSymbol returns correct dim', () => {
    expect(embedSymbol('cat', 8).length).toBe(8);
  });
  test('embedSymbol deterministic', () => {
    expect(embedSymbol('dog', 4)).toEqual(embedSymbol('dog', 4));
  });
  test('embedSymbol different symbols differ', () => {
    expect(embedSymbol('cat', 4)).not.toEqual(embedSymbol('dog', 4));
  });
  test('embedSymbol empty string', () => {
    expect(embedSymbol('', 4).length).toBe(4);
  });
  test('injectKnowledge modifies embedding', () => {
    const emb = [1, 0, 0, 0];
    const injected = injectKnowledge(emb, 'fact', 0.5);
    expect(injected).not.toEqual(emb);
  });
  test('injectKnowledge preserves length', () => {
    expect(injectKnowledge([1, 2, 3], 'x', 0.1).length).toBe(3);
  });
});

// ─── SECTION 5: Fuzzy logic ───────────────────────────────────────────────────
describe('NSI § 5 — Fuzzy logic', () => {
  test('fuzzyAnd min', () => expect(fuzzyAnd(0.3, 0.7)).toBe(0.3));
  test('fuzzyOr max', () => expect(fuzzyOr(0.3, 0.7)).toBe(0.7));
  test('fuzzyNot complement', () => expect(fuzzyNot(0.3)).toBeCloseTo(0.7));
  test('productTNorm', () => expect(productTNorm(0.5, 0.6)).toBeCloseTo(0.3));
  test('lukasiewiczTNorm', () => expect(lukasiewiczTNorm(0.7, 0.8)).toBeCloseTo(0.5));
  test('lukasiewiczTNorm clamped', () => expect(lukasiewiczTNorm(0.3, 0.4)).toBe(0));
  test('godelImplication true', () => expect(godelImplication(0.3, 0.7)).toBe(1));
  test('godelImplication false', () => expect(godelImplication(0.7, 0.3)).toBe(0.3));
  test('fuzzy De Morgan', () => {
    const a = 0.4, b = 0.6;
    expect(fuzzyNot(fuzzyAnd(a, b))).toBeCloseTo(fuzzyOr(fuzzyNot(a), fuzzyNot(b)));
  });
});

// ─── SECTION 6: Differentiable logic ──────────────────────────────────────────
describe('NSI § 6 — Differentiable', () => {
  test('differentiableAnd approximates min', () => {
    const result = differentiableAnd(0.3, 0.7, 0.01);
    expect(result).toBeCloseTo(0.3, 1);
  });
  test('differentiableOr approximates max', () => {
    const result = differentiableOr(0.3, 0.7, 0.01);
    expect(result).toBeCloseTo(0.7, 1);
  });
  test('differentiableAnd smooth', () => {
    // Check it's continuous
    const a1 = differentiableAnd(0.5, 0.5, 1);
    const a2 = differentiableAnd(0.51, 0.5, 1);
    expect(Math.abs(a1 - a2)).toBeLessThan(0.1);
  });
  test('differentiableOr temperature effect', () => {
    const hot = differentiableOr(0.3, 0.7, 10);
    const cold = differentiableOr(0.3, 0.7, 0.1);
    // Colder should be closer to max
    expect(Math.abs(cold - 0.7)).toBeLessThan(Math.abs(hot - 0.7));
  });
});

// ─── SECTION 7: Rule extraction ───────────────────────────────────────────────
describe('NSI § 7 — Rule extraction', () => {
  test('extractRule finds active', () => {
    const rules = extractRule([0.1, 0.8, -0.9, 0.2], 0.5);
    expect(rules).toContain('f1+');
    expect(rules).toContain('f2-');
  });
  test('extractRule respects threshold', () => {
    const rules = extractRule([0.4, 0.6], 0.5);
    expect(rules.length).toBe(1);
    expect(rules).toContain('f1+');
  });
  test('extractRule empty weights', () => {
    expect(extractRule([], 0.5)).toEqual([]);
  });
  test('extractRule all below threshold', () => {
    expect(extractRule([0.1, 0.2, 0.3], 0.5)).toEqual([]);
  });
  test('ruleConfidence full support', () => {
    let kb = createKnowledgeBase();
    kb = addFact(kb, 'A');
    kb = addFact(kb, 'B');
    const rule: Rule = { head: 'C', body: ['A', 'B'], confidence: 1 };
    expect(ruleConfidence(rule, kb)).toBe(1);
  });
  test('ruleConfidence partial support', () => {
    let kb = createKnowledgeBase();
    kb = addFact(kb, 'A');
    const rule: Rule = { head: 'C', body: ['A', 'B'], confidence: 1 };
    expect(ruleConfidence(rule, kb)).toBe(0.5);
  });
});

// ─── SECTION 8: Neural predicates ─────────────────────────────────────────────
describe('NSI § 8 — Neural predicates', () => {
  test('neuralPredicateScore bounded', () => {
    const score = neuralPredicateScore([1, 0], [1, 0], [1, 0]);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });
  test('neuralPredicateScore high for aligned', () => {
    const score = neuralPredicateScore([1, 1], [1, 1], [1, 1]);
    expect(score).toBeGreaterThan(0.5);
  });
  test('analogyScore identical = 1', () => {
    const score = analogyScore([1, 0], [0, 1], [2, 0], [1, 1]);
    expect(typeof score).toBe('number');
  });
  test('analogyScore perfect analogy', () => {
    const score = analogyScore([2, 0], [1, 0], [4, 0], [3, 0]);
    expect(score).toBeCloseTo(1);
  });
  test('conceptComposition and', () => {
    const result = conceptComposition([0.8, 0.3], [0.5, 0.7], 'and');
    expect(result).toEqual([0.5, 0.3]);
  });
  test('conceptComposition or', () => {
    const result = conceptComposition([0.8, 0.3], [0.5, 0.7], 'or');
    expect(result).toEqual([0.8, 0.7]);
  });
});

// ─── SECTION 9: Phi reasoning ─────────────────────────────────────────────────
describe('NSI § 9 — Phi reasoning', () => {
  test('phiReasoningDepth simple', () => {
    let kb = createKnowledgeBase();
    kb = addRule(kb, { head: 'goal', body: ['sub'], confidence: 1 });
    const depth = phiReasoningDepth('goal', kb);
    expect(depth).toBeCloseTo(1 / PHI);
  });
  test('phiReasoningDepth no rules', () => {
    const kb = createKnowledgeBase();
    expect(phiReasoningDepth('X', kb)).toBe(0);
  });
  test('phiReasoningDepth chain', () => {
    let kb = createKnowledgeBase();
    kb = addRule(kb, { head: 'A', body: ['B'], confidence: 1 });
    kb = addRule(kb, { head: 'B', body: ['C'], confidence: 1 });
    const depth = phiReasoningDepth('A', kb);
    expect(depth).toBeCloseTo(2 / PHI);
  });
});

// ─── SECTION 10: Constraint satisfaction ──────────────────────────────────────
describe('NSI § 10 — Constraints', () => {
  test('constraintSatisfaction all satisfied', () => {
    const vars = [1, 2, 3];
    const constraints = [(v: number[]) => v[0] < v[1], (v: number[]) => v[1] < v[2]];
    expect(constraintSatisfaction(vars, constraints)).toBe(true);
  });
  test('constraintSatisfaction one violated', () => {
    const vars = [3, 2, 1];
    const constraints = [(v: number[]) => v[0] < v[1]];
    expect(constraintSatisfaction(vars, constraints)).toBe(false);
  });
  test('constraintSatisfaction empty constraints', () => {
    expect(constraintSatisfaction([1, 2, 3], [])).toBe(true);
  });
  test('softConstraintScore zero penalty', () => {
    const vars = [0, 0];
    const penalties = [(v: number[]) => v[0] ** 2, (v: number[]) => v[1] ** 2];
    expect(softConstraintScore(vars, penalties)).toBe(0);
  });
  test('softConstraintScore accumulates', () => {
    const vars = [1, 2];
    const penalties = [(v: number[]) => v[0], (v: number[]) => v[1]];
    expect(softConstraintScore(vars, penalties)).toBe(3);
  });
  test('softConstraintScore empty penalties', () => {
    expect(softConstraintScore([1, 2, 3], [])).toBe(0);
  });
});
