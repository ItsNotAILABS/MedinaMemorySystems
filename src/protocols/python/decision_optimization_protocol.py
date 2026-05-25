"""
PROTO-316 — Decision Optimization Protocol (Python)
Multi-criteria decision optimization with φ-coherent weighting.

Charter: PROTO-316
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Callable
from enum import Enum

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


class OptimizationType(Enum):
    MAXIMIZE = "maximize"
    MINIMIZE = "minimize"
    SATISFY = "satisfy"


@dataclass
class Criterion:
    """A decision criterion."""
    id: str
    name: str
    weight: float = 1.0
    optimization: OptimizationType = OptimizationType.MAXIMIZE
    threshold: Optional[float] = None
    
    def evaluate(self, value: float) -> float:
        """Evaluate criterion satisfaction."""
        if self.optimization == OptimizationType.MAXIMIZE:
            return value * self.weight * PHI_INV
        elif self.optimization == OptimizationType.MINIMIZE:
            return (1 - value) * self.weight * PHI_INV
        else:  # SATISFY
            if self.threshold is not None:
                return self.weight if value >= self.threshold else 0
            return value * self.weight * PHI_INV


@dataclass
class Alternative:
    """A decision alternative."""
    id: str
    name: str
    scores: Dict[str, float] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def overall_score(self, criteria: Dict[str, Criterion]) -> float:
        """Calculate overall score across criteria."""
        total = 0.0
        weight_sum = 0.0
        
        for crit_id, score in self.scores.items():
            if crit_id in criteria:
                criterion = criteria[crit_id]
                total += criterion.evaluate(score)
                weight_sum += criterion.weight
        
        return total / weight_sum if weight_sum > 0 else 0.0


@dataclass
class Decision:
    """A decision outcome."""
    chosen: Alternative
    score: float
    rankings: List[tuple]
    criteria_breakdown: Dict[str, float]
    timestamp: float = field(default_factory=time.time)
    confidence: float = 0.0


class ParetoOptimizer:
    """Pareto-optimal solution finder."""
    
    def dominates(self, a: Alternative, b: Alternative, 
                  criteria: Dict[str, Criterion]) -> bool:
        """Check if a dominates b (better or equal in all, better in at least one)."""
        dominated = False
        strictly_better = False
        
        for crit_id, criterion in criteria.items():
            val_a = a.scores.get(crit_id, 0)
            val_b = b.scores.get(crit_id, 0)
            
            if criterion.optimization == OptimizationType.MINIMIZE:
                val_a, val_b = -val_a, -val_b
            
            if val_a < val_b:
                dominated = True
                break
            elif val_a > val_b:
                strictly_better = True
        
        return not dominated and strictly_better
    
    def pareto_front(self, alternatives: List[Alternative],
                    criteria: Dict[str, Criterion]) -> List[Alternative]:
        """Find Pareto-optimal alternatives."""
        front = []
        
        for candidate in alternatives:
            is_dominated = False
            
            for other in alternatives:
                if other != candidate and self.dominates(other, candidate, criteria):
                    is_dominated = True
                    break
            
            if not is_dominated:
                front.append(candidate)
        
        return front


class ConstraintChecker:
    """Checks decision constraints."""
    
    def __init__(self):
        self.constraints: List[Callable[[Alternative], bool]] = []
    
    def add_constraint(self, constraint: Callable[[Alternative], bool]) -> None:
        """Add a constraint function."""
        self.constraints.append(constraint)
    
    def is_feasible(self, alternative: Alternative) -> bool:
        """Check if alternative satisfies all constraints."""
        return all(c(alternative) for c in self.constraints)
    
    def filter_feasible(self, alternatives: List[Alternative]) -> List[Alternative]:
        """Filter to only feasible alternatives."""
        return [a for a in alternatives if self.is_feasible(a)]


class DecisionOptimizationEngine:
    """
    Main decision optimization engine with φ-coherent processing.
    """
    
    def __init__(self):
        self.criteria: Dict[str, Criterion] = {}
        self.alternatives: Dict[str, Alternative] = {}
        self.pareto = ParetoOptimizer()
        self.constraints = ConstraintChecker()
        self.decisions: List[Decision] = []
        self.beat_count = 0
        self.criterion_counter = 0
        self.alternative_counter = 0
    
    def add_criterion(self, name: str, weight: float = 1.0,
                     optimization: OptimizationType = OptimizationType.MAXIMIZE,
                     threshold: Optional[float] = None) -> Criterion:
        """Add a decision criterion."""
        self.criterion_counter += 1
        criterion = Criterion(
            id=f"crit-{self.criterion_counter}",
            name=name,
            weight=weight,
            optimization=optimization,
            threshold=threshold
        )
        self.criteria[criterion.id] = criterion
        return criterion
    
    def add_alternative(self, name: str, scores: Optional[Dict[str, float]] = None,
                       **metadata) -> Alternative:
        """Add a decision alternative."""
        self.alternative_counter += 1
        
        # Convert criterion names to IDs in scores
        converted_scores = {}
        if scores:
            for key, value in scores.items():
                # Find criterion by name
                crit = next((c for c in self.criteria.values() if c.name == key), None)
                if crit:
                    converted_scores[crit.id] = value
                else:
                    converted_scores[key] = value
        
        alternative = Alternative(
            id=f"alt-{self.alternative_counter}",
            name=name,
            scores=converted_scores,
            metadata=metadata
        )
        self.alternatives[alternative.id] = alternative
        return alternative
    
    def set_score(self, alt_name: str, crit_name: str, score: float) -> bool:
        """Set a score for an alternative on a criterion."""
        alt = next((a for a in self.alternatives.values() if a.name == alt_name), None)
        crit = next((c for c in self.criteria.values() if c.name == crit_name), None)
        
        if alt and crit:
            alt.scores[crit.id] = max(0, min(1, score))
            return True
        return False
    
    def add_constraint(self, constraint: Callable[[Alternative], bool]) -> None:
        """Add a constraint."""
        self.constraints.add_constraint(constraint)
    
    def rank_alternatives(self) -> List[tuple]:
        """Rank all alternatives by overall score."""
        feasible = self.constraints.filter_feasible(list(self.alternatives.values()))
        
        scored = [
            (alt, alt.overall_score(self.criteria))
            for alt in feasible
        ]
        
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored
    
    def decide(self) -> Optional[Decision]:
        """Make a decision."""
        rankings = self.rank_alternatives()
        
        if not rankings:
            return None
        
        chosen, score = rankings[0]
        
        # Calculate criteria breakdown
        breakdown = {}
        for crit_id, criterion in self.criteria.items():
            if crit_id in chosen.scores:
                breakdown[criterion.name] = criterion.evaluate(chosen.scores[crit_id])
        
        # Calculate confidence based on margin
        confidence = 1.0
        if len(rankings) > 1:
            margin = score - rankings[1][1]
            confidence = min(1.0, margin * PHI + PHI_INV)
        
        decision = Decision(
            chosen=chosen,
            score=score,
            rankings=[(a.name, s) for a, s in rankings],
            criteria_breakdown=breakdown,
            confidence=confidence
        )
        
        self.decisions.append(decision)
        return decision
    
    def pareto_optimal(self) -> List[Alternative]:
        """Get Pareto-optimal alternatives."""
        feasible = self.constraints.filter_feasible(list(self.alternatives.values()))
        return self.pareto.pareto_front(feasible, self.criteria)
    
    def sensitivity_analysis(self, criterion_name: str, 
                            delta_range: float = 0.2) -> Dict[str, Any]:
        """Analyze sensitivity to criterion weight changes."""
        crit = next((c for c in self.criteria.values() if c.name == criterion_name), None)
        if not crit:
            return {}
        
        original_weight = crit.weight
        results = []
        
        for delta in [-delta_range, -delta_range/2, 0, delta_range/2, delta_range]:
            crit.weight = max(0.1, original_weight + delta)
            rankings = self.rank_alternatives()
            if rankings:
                results.append({
                    "weight_delta": delta,
                    "weight": crit.weight,
                    "winner": rankings[0][0].name,
                    "score": rankings[0][1]
                })
        
        crit.weight = original_weight
        
        return {
            "criterion": criterion_name,
            "original_weight": original_weight,
            "results": results,
            "stable": len(set(r["winner"] for r in results)) == 1
        }
    
    def what_if(self, changes: Dict[str, Dict[str, float]]) -> Optional[Decision]:
        """What-if analysis with hypothetical score changes."""
        # Save original scores
        saved = {}
        for alt_name, score_changes in changes.items():
            alt = next((a for a in self.alternatives.values() if a.name == alt_name), None)
            if alt:
                saved[alt.id] = dict(alt.scores)
                for crit_name, new_score in score_changes.items():
                    self.set_score(alt_name, crit_name, new_score)
        
        # Make decision
        decision = self.decide()
        
        # Restore original scores
        for alt_id, original_scores in saved.items():
            self.alternatives[alt_id].scores = original_scores
        
        # Remove the hypothetical decision from history
        if decision:
            self.decisions.pop()
        
        return decision
    
    def tick(self) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        return {
            "beat": self.beat_count,
            "criteria": len(self.criteria),
            "alternatives": len(self.alternatives),
            "feasible": len(self.constraints.filter_feasible(list(self.alternatives.values()))),
            "decisions_made": len(self.decisions),
            "pareto_optimal": len(self.pareto_optimal()),
            "phi_coherence": len(self.decisions) * PHI_INV,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate decision optimization report."""
        pareto = self.pareto_optimal()
        
        return {
            "total_criteria": len(self.criteria),
            "total_alternatives": len(self.alternatives),
            "feasible_alternatives": len(self.constraints.filter_feasible(list(self.alternatives.values()))),
            "pareto_optimal": len(pareto),
            "decisions_made": len(self.decisions),
            "avg_confidence": sum(d.confidence for d in self.decisions) / max(1, len(self.decisions)),
            "phi_metric": len(pareto) / max(1, len(self.alternatives)) * PHI,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[DecisionOptimizationEngine] = None

def get_decision_optimization_engine() -> DecisionOptimizationEngine:
    """Get or create the singleton DecisionOptimizationEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = DecisionOptimizationEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-316 Decision Optimization Protocol (Python) ===")
    
    engine = get_decision_optimization_engine()
    
    # Add criteria
    engine.add_criterion("Cost", weight=0.3, optimization=OptimizationType.MINIMIZE)
    engine.add_criterion("Quality", weight=0.5)
    engine.add_criterion("Speed", weight=0.2)
    
    # Add alternatives
    engine.add_alternative("Option A", {"Cost": 0.3, "Quality": 0.8, "Speed": 0.6})
    engine.add_alternative("Option B", {"Cost": 0.5, "Quality": 0.9, "Speed": 0.7})
    engine.add_alternative("Option C", {"Cost": 0.2, "Quality": 0.6, "Speed": 0.9})
    
    # Rank
    rankings = engine.rank_alternatives()
    print(f"Rankings: {rankings}")
    
    # Decide
    decision = engine.decide()
    if decision:
        print(f"Chosen: {decision.chosen.name} (score: {decision.score:.3f})")
        print(f"Confidence: {decision.confidence:.3f}")
    
    # Pareto optimal
    pareto = engine.pareto_optimal()
    print(f"Pareto-optimal: {[a.name for a in pareto]}")
    
    # Sensitivity
    sensitivity = engine.sensitivity_analysis("Quality")
    print(f"Sensitivity: stable={sensitivity['stable']}")
    
    print(f"Report: {engine.coherence_report()}")
