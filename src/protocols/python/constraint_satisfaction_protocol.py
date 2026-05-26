"""
PROTO-337 — Constraint Satisfaction Protocol (Python)
CSP solving and constraint propagation for MEDINA Memory Systems.

Charter: PROTO-337
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple, Callable
from collections import defaultdict
from enum import Enum

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI

class ConstraintType(Enum):
    UNARY = "unary"
    BINARY = "binary"
    GLOBAL = "global"

@dataclass
class Variable:
    id: str
    domain: Set[Any] = field(default_factory=set)
    assigned_value: Any = None
    
    def is_assigned(self) -> bool:
        return self.assigned_value is not None

@dataclass
class Constraint:
    id: str
    variables: List[str]
    constraint_type: ConstraintType
    check: Callable[..., bool] = None
    
    def is_satisfied(self, assignment: Dict[str, Any]) -> bool:
        if self.check is None:
            return True
        values = [assignment.get(v) for v in self.variables if v in assignment]
        if len(values) != len(self.variables):
            return True
        return self.check(*values)

class ConstraintSatisfactionEngine:
    def __init__(self):
        self.variables: Dict[str, Variable] = {}
        self.constraints: Dict[str, Constraint] = {}
        self.var_constraints: Dict[str, Set[str]] = defaultdict(set)
        self.beat_count = 0
    
    def add_variable(self, id: str, domain: Set[Any]) -> Variable:
        var = Variable(id=id, domain=set(domain))
        self.variables[id] = var
        return var
    
    def add_constraint(self, id: str, variables: List[str], check: Callable) -> Constraint:
        ctype = ConstraintType.UNARY if len(variables) == 1 else (
            ConstraintType.BINARY if len(variables) == 2 else ConstraintType.GLOBAL
        )
        constraint = Constraint(id=id, variables=variables, constraint_type=ctype, check=check)
        self.constraints[id] = constraint
        for var in variables:
            self.var_constraints[var].add(id)
        return constraint
    
    def solve(self) -> Optional[Dict[str, Any]]:
        self.beat_count += 1
        assignment = {}
        return self._backtrack(assignment)
    
    def _backtrack(self, assignment: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if len(assignment) == len(self.variables):
            return assignment
        
        var_id = self._select_variable(assignment)
        var = self.variables[var_id]
        
        for value in self._order_domain(var_id, assignment):
            assignment[var_id] = value
            if self._is_consistent(var_id, assignment):
                result = self._backtrack(assignment)
                if result is not None:
                    return result
            del assignment[var_id]
        
        return None
    
    def _select_variable(self, assignment: Dict[str, Any]) -> str:
        unassigned = [v for v in self.variables if v not in assignment]
        return min(unassigned, key=lambda v: len(self.variables[v].domain))
    
    def _order_domain(self, var_id: str, assignment: Dict[str, Any]) -> List[Any]:
        return list(self.variables[var_id].domain)
    
    def _is_consistent(self, var_id: str, assignment: Dict[str, Any]) -> bool:
        for cid in self.var_constraints[var_id]:
            constraint = self.constraints[cid]
            if not constraint.is_satisfied(assignment):
                return False
        return True
    
    def get_stats(self) -> Dict[str, Any]:
        return {
            "variables": len(self.variables),
            "constraints": len(self.constraints),
            "beat_count": self.beat_count,
            "phi_coherence": len(self.constraints) / (len(self.variables) + 1) * PHI_INV
        }

_csp_engine: Optional[ConstraintSatisfactionEngine] = None

def get_csp_engine() -> ConstraintSatisfactionEngine:
    global _csp_engine
    if _csp_engine is None:
        _csp_engine = ConstraintSatisfactionEngine()
    return _csp_engine

__all__ = ["PHI", "PHI_INV", "ConstraintType", "Variable", "Constraint",
           "ConstraintSatisfactionEngine", "get_csp_engine"]
