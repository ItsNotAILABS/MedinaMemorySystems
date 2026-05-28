"""
PROTO-311 — Symbolic Reasoning Protocol (Python)
Symbolic reasoning with φ-coherent inference.

Charter: PROTO-311
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple, Callable
from enum import Enum

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


class SymbolType(Enum):
    CONSTANT = "constant"
    VARIABLE = "variable"
    PREDICATE = "predicate"
    FUNCTION = "function"
    CONNECTIVE = "connective"


@dataclass
class Symbol:
    """A symbolic element."""
    name: str
    symbol_type: SymbolType
    arity: int = 0
    value: Any = None
    
    def __hash__(self):
        return hash((self.name, self.symbol_type))
    
    def __eq__(self, other):
        return self.name == other.name and self.symbol_type == other.symbol_type


@dataclass
class Term:
    """A term in symbolic logic."""
    symbol: Symbol
    arguments: List["Term"] = field(default_factory=list)
    
    def is_ground(self) -> bool:
        """Check if term contains no variables."""
        if self.symbol.symbol_type == SymbolType.VARIABLE:
            return False
        return all(arg.is_ground() for arg in self.arguments)
    
    def variables(self) -> Set[str]:
        """Get all variables in term."""
        if self.symbol.symbol_type == SymbolType.VARIABLE:
            return {self.symbol.name}
        vars_set = set()
        for arg in self.arguments:
            vars_set.update(arg.variables())
        return vars_set
    
    def substitute(self, bindings: Dict[str, "Term"]) -> "Term":
        """Apply variable substitutions."""
        if self.symbol.symbol_type == SymbolType.VARIABLE:
            if self.symbol.name in bindings:
                return bindings[self.symbol.name]
            return self
        new_args = [arg.substitute(bindings) for arg in self.arguments]
        return Term(self.symbol, new_args)
    
    def __str__(self):
        if not self.arguments:
            return self.symbol.name
        args_str = ", ".join(str(a) for a in self.arguments)
        return f"{self.symbol.name}({args_str})"


@dataclass
class Clause:
    """A clause (disjunction of literals)."""
    literals: List[Tuple[bool, Term]]  # (positive, term)
    confidence: float = 1.0
    
    def is_unit(self) -> bool:
        """Check if clause is a unit clause."""
        return len(self.literals) == 1
    
    def is_empty(self) -> bool:
        """Check if clause is empty (contradiction)."""
        return len(self.literals) == 0
    
    def variables(self) -> Set[str]:
        """Get all variables in clause."""
        vars_set = set()
        for _, term in self.literals:
            vars_set.update(term.variables())
        return vars_set


@dataclass
class Rule:
    """An inference rule."""
    name: str
    premises: List[Term]
    conclusion: Term
    confidence: float = 1.0
    
    def variables(self) -> Set[str]:
        """Get all variables in rule."""
        vars_set = self.conclusion.variables()
        for p in self.premises:
            vars_set.update(p.variables())
        return vars_set


class Unifier:
    """Unification for symbolic terms."""
    
    def unify(self, t1: Term, t2: Term, bindings: Optional[Dict[str, Term]] = None) -> Optional[Dict[str, Term]]:
        """Attempt to unify two terms."""
        if bindings is None:
            bindings = {}
        
        # Apply current bindings
        t1 = t1.substitute(bindings)
        t2 = t2.substitute(bindings)
        
        # Same term
        if str(t1) == str(t2):
            return bindings
        
        # Variable cases
        if t1.symbol.symbol_type == SymbolType.VARIABLE:
            return self._unify_var(t1.symbol.name, t2, bindings)
        if t2.symbol.symbol_type == SymbolType.VARIABLE:
            return self._unify_var(t2.symbol.name, t1, bindings)
        
        # Function/predicate case
        if t1.symbol.name != t2.symbol.name:
            return None
        if len(t1.arguments) != len(t2.arguments):
            return None
        
        for arg1, arg2 in zip(t1.arguments, t2.arguments):
            bindings = self.unify(arg1, arg2, bindings)
            if bindings is None:
                return None
        
        return bindings
    
    def _unify_var(self, var: str, term: Term, bindings: Dict[str, Term]) -> Optional[Dict[str, Term]]:
        """Unify a variable with a term."""
        if var in bindings:
            return self.unify(bindings[var], term, bindings)
        
        # Occurs check
        if var in term.variables():
            return None
        
        new_bindings = dict(bindings)
        new_bindings[var] = term
        return new_bindings


class InferenceEngine:
    """Forward and backward chaining inference."""
    
    def __init__(self):
        self.unifier = Unifier()
        self.inference_steps: List[Dict[str, Any]] = []
    
    def forward_chain(self, facts: List[Term], rules: List[Rule], 
                     max_iterations: int = 100) -> List[Term]:
        """Forward chaining inference."""
        derived = list(facts)
        derived_set = {str(f) for f in facts}
        
        for iteration in range(max_iterations):
            new_facts = []
            
            for rule in rules:
                # Try to match rule premises
                matches = self._match_premises(rule.premises, derived)
                
                for bindings in matches:
                    conclusion = rule.conclusion.substitute(bindings)
                    conclusion_str = str(conclusion)
                    
                    if conclusion_str not in derived_set:
                        new_facts.append(conclusion)
                        derived_set.add(conclusion_str)
                        
                        self.inference_steps.append({
                            "type": "forward",
                            "rule": rule.name,
                            "bindings": {k: str(v) for k, v in bindings.items()},
                            "derived": conclusion_str,
                            "iteration": iteration
                        })
            
            if not new_facts:
                break
            
            derived.extend(new_facts)
        
        return derived
    
    def _match_premises(self, premises: List[Term], facts: List[Term]) -> List[Dict[str, Term]]:
        """Find all ways to match premises against facts."""
        if not premises:
            return [{}]
        
        matches = []
        first_premise = premises[0]
        remaining = premises[1:]
        
        for fact in facts:
            bindings = self.unifier.unify(first_premise, fact)
            if bindings is not None:
                # Recursively match remaining premises
                for rest_bindings in self._match_premises(
                    [p.substitute(bindings) for p in remaining],
                    facts
                ):
                    combined = dict(bindings)
                    combined.update(rest_bindings)
                    matches.append(combined)
        
        return matches
    
    def backward_chain(self, goal: Term, facts: List[Term], rules: List[Rule],
                      depth: int = 10) -> Tuple[bool, Dict[str, Term]]:
        """Backward chaining inference."""
        return self._backward_chain_helper(goal, facts, rules, {}, depth)
    
    def _backward_chain_helper(self, goal: Term, facts: List[Term], rules: List[Rule],
                               bindings: Dict[str, Term], depth: int) -> Tuple[bool, Dict[str, Term]]:
        """Helper for backward chaining."""
        if depth <= 0:
            return False, {}
        
        goal = goal.substitute(bindings)
        
        # Check if goal matches a fact
        for fact in facts:
            new_bindings = self.unifier.unify(goal, fact, dict(bindings))
            if new_bindings is not None:
                self.inference_steps.append({
                    "type": "backward",
                    "matched_fact": str(fact),
                    "goal": str(goal)
                })
                return True, new_bindings
        
        # Try rules
        for rule in rules:
            new_bindings = self.unifier.unify(goal, rule.conclusion, dict(bindings))
            if new_bindings is None:
                continue
            
            # Try to prove all premises
            all_proved = True
            current_bindings = new_bindings
            
            for premise in rule.premises:
                proved, current_bindings = self._backward_chain_helper(
                    premise, facts, rules, current_bindings, depth - 1
                )
                if not proved:
                    all_proved = False
                    break
            
            if all_proved:
                self.inference_steps.append({
                    "type": "backward",
                    "rule": rule.name,
                    "proved": str(goal)
                })
                return True, current_bindings
        
        return False, bindings


class SymbolicReasoningEngine:
    """
    Main symbolic reasoning engine with φ-coherent processing.
    """
    
    def __init__(self):
        self.symbols: Dict[str, Symbol] = {}
        self.facts: List[Term] = []
        self.rules: List[Rule] = []
        self.inference = InferenceEngine()
        self.beat_count = 0
    
    def define_symbol(self, name: str, symbol_type: SymbolType, 
                     arity: int = 0, value: Any = None) -> Symbol:
        """Define a new symbol."""
        symbol = Symbol(name, symbol_type, arity, value)
        self.symbols[name] = symbol
        return symbol
    
    def make_term(self, name: str, *args: str) -> Term:
        """Create a term from symbol name and argument names."""
        symbol = self.symbols.get(name)
        if not symbol:
            symbol = self.define_symbol(name, SymbolType.PREDICATE, len(args))
        
        arg_terms = []
        for arg in args:
            if arg in self.symbols:
                arg_terms.append(Term(self.symbols[arg]))
            else:
                # Assume variable if starts with uppercase, constant otherwise
                sym_type = SymbolType.VARIABLE if arg[0].isupper() else SymbolType.CONSTANT
                arg_symbol = self.define_symbol(arg, sym_type)
                arg_terms.append(Term(arg_symbol))
        
        return Term(symbol, arg_terms)
    
    def add_fact(self, fact: Term) -> None:
        """Add a fact to the knowledge base."""
        self.facts.append(fact)
    
    def add_rule(self, name: str, premises: List[Term], conclusion: Term,
                confidence: float = 1.0) -> Rule:
        """Add an inference rule."""
        rule = Rule(name, premises, conclusion, confidence)
        self.rules.append(rule)
        return rule
    
    def infer_forward(self, max_iterations: int = 100) -> List[Term]:
        """Run forward chaining inference."""
        return self.inference.forward_chain(self.facts, self.rules, max_iterations)
    
    def prove(self, goal: Term, depth: int = 10) -> Tuple[bool, Dict[str, Term]]:
        """Attempt to prove a goal using backward chaining."""
        return self.inference.backward_chain(goal, self.facts, self.rules, depth)
    
    def query(self, predicate: str, *args: str) -> List[Dict[str, Any]]:
        """Query the knowledge base."""
        goal = self.make_term(predicate, *args)
        derived = self.infer_forward()
        
        results = []
        for fact in derived:
            bindings = self.inference.unifier.unify(goal, fact)
            if bindings is not None:
                results.append({
                    "fact": str(fact),
                    "bindings": {k: str(v) for k, v in bindings.items()}
                })
        
        return results
    
    def tick(self) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        return {
            "beat": self.beat_count,
            "symbols": len(self.symbols),
            "facts": len(self.facts),
            "rules": len(self.rules),
            "inference_steps": len(self.inference.inference_steps),
            "phi_coherence": len(self.facts) * PHI_INV / max(1, len(self.rules)),
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate reasoning coherence report."""
        derived = self.infer_forward()
        
        return {
            "symbols": len(self.symbols),
            "initial_facts": len(self.facts),
            "derived_facts": len(derived),
            "rules": len(self.rules),
            "inference_steps": len(self.inference.inference_steps),
            "derivation_ratio": len(derived) / max(1, len(self.facts)),
            "phi_metric": len(derived) * PHI_INV,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[SymbolicReasoningEngine] = None

def get_symbolic_reasoning_engine() -> SymbolicReasoningEngine:
    """Get or create the singleton SymbolicReasoningEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = SymbolicReasoningEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-311 Symbolic Reasoning Protocol (Python) ===")
    
    engine = get_symbolic_reasoning_engine()
    
    # Define symbols
    engine.define_symbol("human", SymbolType.PREDICATE, 1)
    engine.define_symbol("mortal", SymbolType.PREDICATE, 1)
    engine.define_symbol("socrates", SymbolType.CONSTANT)
    engine.define_symbol("plato", SymbolType.CONSTANT)
    
    # Add facts
    engine.add_fact(engine.make_term("human", "socrates"))
    engine.add_fact(engine.make_term("human", "plato"))
    
    # Add rule: human(X) -> mortal(X)
    engine.add_rule(
        "mortality",
        [engine.make_term("human", "X")],
        engine.make_term("mortal", "X")
    )
    
    # Infer
    derived = engine.infer_forward()
    print(f"Derived facts: {[str(f) for f in derived]}")
    
    # Query
    results = engine.query("mortal", "X")
    print(f"Query mortal(X): {results}")
    
    # Prove
    goal = engine.make_term("mortal", "socrates")
    proved, bindings = engine.prove(goal)
    print(f"Prove mortal(socrates): {proved}")
    
    print(f"Report: {engine.coherence_report()}")
