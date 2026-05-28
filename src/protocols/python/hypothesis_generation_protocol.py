"""
PROTO-338 — Hypothesis Generation Protocol (Python)
Abductive reasoning and hypothesis formation for MEDINA Memory Systems.

Charter: PROTO-338
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set
from enum import Enum

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI

class HypothesisStatus(Enum):
    PROPOSED = "proposed"
    SUPPORTED = "supported"
    REFUTED = "refuted"
    CONFIRMED = "confirmed"

@dataclass
class Observation:
    id: str
    content: str
    confidence: float = 0.8
    timestamp: float = field(default_factory=time.time)

@dataclass
class Hypothesis:
    id: str
    explanation: str
    explains: Set[str] = field(default_factory=set)
    prior: float = 0.5
    likelihood: float = 0.5
    posterior: float = 0.5
    status: HypothesisStatus = HypothesisStatus.PROPOSED
    supporting_evidence: List[str] = field(default_factory=list)
    refuting_evidence: List[str] = field(default_factory=list)
    
    def update_posterior(self) -> float:
        support = len(self.supporting_evidence) + 1
        refute = len(self.refuting_evidence) + 1
        self.posterior = (self.prior * self.likelihood * support) / (support + refute) * PHI_INV
        return self.posterior

class HypothesisGenerationEngine:
    def __init__(self):
        self.observations: Dict[str, Observation] = {}
        self.hypotheses: Dict[str, Hypothesis] = {}
        self.beat_count = 0
    
    def add_observation(self, id: str, content: str, confidence: float = 0.8) -> Observation:
        obs = Observation(id=id, content=content, confidence=confidence)
        self.observations[id] = obs
        return obs
    
    def generate_hypothesis(self, id: str, explanation: str, 
                           explains: Set[str], prior: float = 0.5) -> Hypothesis:
        hyp = Hypothesis(id=id, explanation=explanation, explains=explains, prior=prior)
        hyp.update_posterior()
        self.hypotheses[id] = hyp
        self.beat_count += 1
        return hyp
    
    def add_evidence(self, hyp_id: str, obs_id: str, supports: bool) -> bool:
        if hyp_id not in self.hypotheses or obs_id not in self.observations:
            return False
        
        hyp = self.hypotheses[hyp_id]
        if supports:
            hyp.supporting_evidence.append(obs_id)
            if hyp.posterior > PHI_INV:
                hyp.status = HypothesisStatus.SUPPORTED
        else:
            hyp.refuting_evidence.append(obs_id)
            if len(hyp.refuting_evidence) > len(hyp.supporting_evidence) * PHI:
                hyp.status = HypothesisStatus.REFUTED
        
        hyp.update_posterior()
        return True
    
    def get_best_hypotheses(self, n: int = 5) -> List[Hypothesis]:
        active = [h for h in self.hypotheses.values() 
                 if h.status not in [HypothesisStatus.REFUTED]]
        return sorted(active, key=lambda h: h.posterior, reverse=True)[:n]
    
    def get_stats(self) -> Dict[str, Any]:
        by_status = {}
        for h in self.hypotheses.values():
            by_status[h.status.value] = by_status.get(h.status.value, 0) + 1
        
        posteriors = [h.posterior for h in self.hypotheses.values()]
        return {
            "total_observations": len(self.observations),
            "total_hypotheses": len(self.hypotheses),
            "by_status": by_status,
            "mean_posterior": sum(posteriors) / len(posteriors) if posteriors else 0,
            "beat_count": self.beat_count,
            "phi_coherence": sum(posteriors) / len(posteriors) * PHI_INV if posteriors else 0
        }

_hypothesis_engine: Optional[HypothesisGenerationEngine] = None

def get_hypothesis_engine() -> HypothesisGenerationEngine:
    global _hypothesis_engine
    if _hypothesis_engine is None:
        _hypothesis_engine = HypothesisGenerationEngine()
    return _hypothesis_engine

__all__ = ["PHI", "PHI_INV", "HypothesisStatus", "Observation", "Hypothesis",
           "HypothesisGenerationEngine", "get_hypothesis_engine"]
