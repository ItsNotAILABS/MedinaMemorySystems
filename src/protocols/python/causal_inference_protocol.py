"""
PROTO-315 — Causal Inference Protocol (Python)
Causal reasoning with φ-coherent inference.

Charter: PROTO-315
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple
from collections import defaultdict

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


@dataclass
class CausalVariable:
    """A variable in the causal model."""
    id: str
    name: str
    values: List[Any] = field(default_factory=lambda: [True, False])
    current_value: Any = None
    is_intervention: bool = False
    
    def set_value(self, value: Any, intervention: bool = False) -> None:
        """Set variable value."""
        self.current_value = value
        self.is_intervention = intervention


@dataclass
class CausalEdge:
    """A directed causal edge."""
    cause_id: str
    effect_id: str
    strength: float = 1.0
    mechanism: Optional[str] = None
    confidence: float = 1.0


class CausalGraph:
    """Directed acyclic graph representing causal structure."""
    
    def __init__(self):
        self.variables: Dict[str, CausalVariable] = {}
        self.edges: List[CausalEdge] = []
        self.parents: Dict[str, List[str]] = defaultdict(list)
        self.children: Dict[str, List[str]] = defaultdict(list)
    
    def add_variable(self, var: CausalVariable) -> None:
        """Add a variable to the graph."""
        self.variables[var.id] = var
    
    def add_edge(self, cause_id: str, effect_id: str, 
                strength: float = 1.0, mechanism: Optional[str] = None) -> CausalEdge:
        """Add a causal edge."""
        edge = CausalEdge(cause_id, effect_id, strength, mechanism)
        self.edges.append(edge)
        self.parents[effect_id].append(cause_id)
        self.children[cause_id].append(effect_id)
        return edge
    
    def get_ancestors(self, var_id: str) -> Set[str]:
        """Get all ancestors of a variable."""
        ancestors = set()
        to_visit = list(self.parents[var_id])
        
        while to_visit:
            current = to_visit.pop()
            if current not in ancestors:
                ancestors.add(current)
                to_visit.extend(self.parents[current])
        
        return ancestors
    
    def get_descendants(self, var_id: str) -> Set[str]:
        """Get all descendants of a variable."""
        descendants = set()
        to_visit = list(self.children[var_id])
        
        while to_visit:
            current = to_visit.pop()
            if current not in descendants:
                descendants.add(current)
                to_visit.extend(self.children[current])
        
        return descendants
    
    def is_d_separated(self, x: str, y: str, z: Set[str]) -> bool:
        """Check if X and Y are d-separated given Z."""
        # Simplified d-separation check
        # A path is blocked if:
        # 1. There's a chain/fork and the middle node is in Z
        # 2. There's a collider and neither it nor its descendants are in Z
        
        paths = self._find_paths(x, y)
        
        for path in paths:
            if self._is_path_blocked(path, z):
                continue
            return False  # Found unblocked path
        
        return True
    
    def _find_paths(self, start: str, end: str, max_length: int = 10) -> List[List[str]]:
        """Find all paths between two variables."""
        paths = []
        
        def dfs(current: str, path: List[str], visited: Set[str]):
            if len(path) > max_length:
                return
            
            if current == end:
                paths.append(list(path))
                return
            
            # Try parents and children
            neighbors = self.parents[current] + self.children[current]
            for neighbor in neighbors:
                if neighbor not in visited:
                    visited.add(neighbor)
                    path.append(neighbor)
                    dfs(neighbor, path, visited)
                    path.pop()
                    visited.remove(neighbor)
        
        dfs(start, [start], {start})
        return paths
    
    def _is_path_blocked(self, path: List[str], z: Set[str]) -> bool:
        """Check if a path is blocked by conditioning set Z."""
        if len(path) < 3:
            return False
        
        for i in range(1, len(path) - 1):
            node = path[i]
            prev_node = path[i-1]
            next_node = path[i+1]
            
            # Check if this is a collider (both arrows point in)
            is_collider = (next_node in self.parents[node] and prev_node in self.parents[node])
            
            if is_collider:
                # Collider: blocked unless node or descendant in Z
                descendants = self.get_descendants(node)
                if node not in z and not descendants.intersection(z):
                    return True
            else:
                # Chain/fork: blocked if node in Z
                if node in z:
                    return True
        
        return False


class InterventionCalculator:
    """Calculates effects of interventions."""
    
    def __init__(self, graph: CausalGraph):
        self.graph = graph
        self.intervention_history: List[Dict[str, Any]] = []
    
    def do(self, var_id: str, value: Any) -> Dict[str, Any]:
        """Perform an intervention do(X=x)."""
        var = self.graph.variables.get(var_id)
        if not var:
            return {}
        
        # Set intervention
        old_value = var.current_value
        var.set_value(value, intervention=True)
        
        # Propagate effects
        effects = self._propagate_effects(var_id)
        
        self.intervention_history.append({
            "variable": var_id,
            "value": value,
            "old_value": old_value,
            "effects": effects,
            "timestamp": time.time()
        })
        
        return effects
    
    def _propagate_effects(self, source_id: str) -> Dict[str, Any]:
        """Propagate causal effects from source."""
        effects = {}
        source = self.graph.variables[source_id]
        
        # BFS through descendants
        to_visit = list(self.graph.children[source_id])
        visited = {source_id}
        
        while to_visit:
            current_id = to_visit.pop(0)
            if current_id in visited:
                continue
            
            visited.add(current_id)
            current = self.graph.variables[current_id]
            
            # Calculate effect based on parent values
            effect_value = self._calculate_effect(current_id)
            current.current_value = effect_value
            effects[current_id] = effect_value
            
            to_visit.extend(self.graph.children[current_id])
        
        return effects
    
    def _calculate_effect(self, var_id: str) -> Any:
        """Calculate effect on variable from its parents."""
        parents = self.graph.parents[var_id]
        if not parents:
            return self.graph.variables[var_id].current_value
        
        # Simple weighted combination
        total_strength = 0
        weighted_sum = 0
        
        for parent_id in parents:
            parent = self.graph.variables[parent_id]
            edge = next((e for e in self.graph.edges 
                        if e.cause_id == parent_id and e.effect_id == var_id), None)
            
            if edge and parent.current_value is not None:
                strength = edge.strength
                val = 1.0 if parent.current_value else 0.0
                weighted_sum += val * strength
                total_strength += strength
        
        if total_strength > 0:
            probability = weighted_sum / total_strength * PHI_INV
            return random.random() < probability
        
        return self.graph.variables[var_id].current_value


class CounterfactualReasoner:
    """Reasons about counterfactuals."""
    
    def __init__(self, graph: CausalGraph, calculator: InterventionCalculator):
        self.graph = graph
        self.calculator = calculator
        self.counterfactual_count = 0
    
    def what_if(self, var_id: str, value: Any) -> Dict[str, Any]:
        """Answer: What if X had been x?"""
        self.counterfactual_count += 1
        
        # Save current state
        saved_state = {
            vid: v.current_value 
            for vid, v in self.graph.variables.items()
        }
        
        # Perform intervention
        effects = self.calculator.do(var_id, value)
        
        result = {
            "intervention": {"variable": var_id, "value": value},
            "effects": effects,
            "comparison": {}
        }
        
        # Compare to original
        for vid, new_val in effects.items():
            old_val = saved_state.get(vid)
            if old_val != new_val:
                result["comparison"][vid] = {
                    "original": old_val,
                    "counterfactual": new_val
                }
        
        # Restore state
        for vid, val in saved_state.items():
            self.graph.variables[vid].set_value(val, False)
        
        return result


class CausalInferenceEngine:
    """
    Main causal inference engine with φ-coherent processing.
    """
    
    def __init__(self):
        self.graph = CausalGraph()
        self.calculator = InterventionCalculator(self.graph)
        self.counterfactual = CounterfactualReasoner(self.graph, self.calculator)
        self.beat_count = 0
        self.var_counter = 0
    
    def add_variable(self, name: str, values: Optional[List[Any]] = None) -> CausalVariable:
        """Add a causal variable."""
        self.var_counter += 1
        var = CausalVariable(
            id=f"var-{self.var_counter}",
            name=name,
            values=values or [True, False]
        )
        self.graph.add_variable(var)
        return var
    
    def add_cause(self, cause_name: str, effect_name: str, 
                 strength: float = 1.0) -> Optional[CausalEdge]:
        """Add a causal relationship."""
        cause = next((v for v in self.graph.variables.values() if v.name == cause_name), None)
        effect = next((v for v in self.graph.variables.values() if v.name == effect_name), None)
        
        if cause and effect:
            return self.graph.add_edge(cause.id, effect.id, strength)
        return None
    
    def set_observation(self, var_name: str, value: Any) -> bool:
        """Set an observed value."""
        var = next((v for v in self.graph.variables.values() if v.name == var_name), None)
        if var:
            var.set_value(value, intervention=False)
            return True
        return False
    
    def intervene(self, var_name: str, value: Any) -> Dict[str, Any]:
        """Perform an intervention."""
        var = next((v for v in self.graph.variables.values() if v.name == var_name), None)
        if var:
            return self.calculator.do(var.id, value)
        return {}
    
    def query_counterfactual(self, var_name: str, value: Any) -> Dict[str, Any]:
        """Query a counterfactual."""
        var = next((v for v in self.graph.variables.values() if v.name == var_name), None)
        if var:
            return self.counterfactual.what_if(var.id, value)
        return {}
    
    def is_cause_of(self, cause_name: str, effect_name: str) -> bool:
        """Check if one variable is a cause of another."""
        cause = next((v for v in self.graph.variables.values() if v.name == cause_name), None)
        effect = next((v for v in self.graph.variables.values() if v.name == effect_name), None)
        
        if cause and effect:
            return effect.id in self.graph.get_descendants(cause.id)
        return False
    
    def find_common_cause(self, var1_name: str, var2_name: str) -> List[str]:
        """Find common causes of two variables."""
        var1 = next((v for v in self.graph.variables.values() if v.name == var1_name), None)
        var2 = next((v for v in self.graph.variables.values() if v.name == var2_name), None)
        
        if var1 and var2:
            ancestors1 = self.graph.get_ancestors(var1.id)
            ancestors2 = self.graph.get_ancestors(var2.id)
            common = ancestors1.intersection(ancestors2)
            return [self.graph.variables[vid].name for vid in common]
        return []
    
    def causal_effect(self, cause_name: str, effect_name: str) -> float:
        """Estimate average causal effect."""
        var_cause = next((v for v in self.graph.variables.values() if v.name == cause_name), None)
        var_effect = next((v for v in self.graph.variables.values() if v.name == effect_name), None)
        
        if not var_cause or not var_effect:
            return 0.0
        
        # Monte Carlo estimation
        effect_when_true = []
        effect_when_false = []
        
        for _ in range(100):
            # Intervene do(cause=True)
            self.calculator.do(var_cause.id, True)
            effect_when_true.append(1.0 if var_effect.current_value else 0.0)
            
            # Intervene do(cause=False)
            self.calculator.do(var_cause.id, False)
            effect_when_false.append(1.0 if var_effect.current_value else 0.0)
        
        ace = (sum(effect_when_true) - sum(effect_when_false)) / 100
        return ace * PHI_INV
    
    def tick(self) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        return {
            "beat": self.beat_count,
            "variables": len(self.graph.variables),
            "edges": len(self.graph.edges),
            "interventions": len(self.calculator.intervention_history),
            "counterfactuals": self.counterfactual.counterfactual_count,
            "phi_coherence": len(self.graph.edges) / max(1, len(self.graph.variables)) * PHI_INV,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate causal inference report."""
        return {
            "variables": len(self.graph.variables),
            "causal_edges": len(self.graph.edges),
            "intervention_count": len(self.calculator.intervention_history),
            "counterfactual_count": self.counterfactual.counterfactual_count,
            "graph_density": len(self.graph.edges) / max(1, len(self.graph.variables)**2),
            "phi_metric": len(self.graph.edges) * PHI_INV,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[CausalInferenceEngine] = None

def get_causal_inference_engine() -> CausalInferenceEngine:
    """Get or create the singleton CausalInferenceEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = CausalInferenceEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-315 Causal Inference Protocol (Python) ===")
    
    engine = get_causal_inference_engine()
    
    # Build causal model: Smoking -> Cancer, Smoking -> Yellow Fingers
    engine.add_variable("Smoking")
    engine.add_variable("Cancer")
    engine.add_variable("YellowFingers")
    engine.add_variable("Genetics")
    
    engine.add_cause("Smoking", "Cancer", 0.3)
    engine.add_cause("Smoking", "YellowFingers", 0.8)
    engine.add_cause("Genetics", "Smoking", 0.2)
    engine.add_cause("Genetics", "Cancer", 0.1)
    
    # Set observation
    engine.set_observation("Smoking", True)
    
    # Intervene
    effects = engine.intervene("Smoking", True)
    print(f"Intervention effects: {effects}")
    
    # Counterfactual
    cf = engine.query_counterfactual("Smoking", False)
    print(f"Counterfactual (what if no smoking): {cf['comparison']}")
    
    # Check causality
    is_cause = engine.is_cause_of("Smoking", "Cancer")
    print(f"Smoking causes Cancer: {is_cause}")
    
    # Find common cause
    common = engine.find_common_cause("Cancer", "YellowFingers")
    print(f"Common causes of Cancer and YellowFingers: {common}")
    
    print(f"Report: {engine.coherence_report()}")
