"""
𓂀 MEDINA ORGANISM SDK — Unified Protocol Interface 𓂀

"The organism IS the computation. All protocols unified into a single living SDK."

This SDK combines ALL 44+ protocols from the Medina Memory Systems organism
into a super-usable Python interface. Every cognitive subsystem — quantum coherence,
temporal reasoning, swarm intelligence, memory consolidation, pattern recognition,
neural binding, and more — accessible through one coherent API.

Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | 2026
License: ISIL-1.1
"""

__version__ = "1.0.0"
__author__ = "Alfredo Medina Hernandez"
__license__ = "ISIL-1.1"

from medina_organism.core import (
    MedinaOrganism,
    OrganismConfig,
    PHI,
    PHI_INV,
    PHI_SQ,
)
from medina_organism.protocols import (
    QuantumCoherenceProtocol,
    TemporalReasoningProtocol,
    SwarmIntelligenceProtocol,
    MemoryConsolidationProtocol,
    PatternRecognitionProtocol,
    NeuralBindingProtocol,
    CausalInferenceProtocol,
    AttentionMechanismProtocol,
    PredictiveCodingProtocol,
    DecisionOptimizationProtocol,
)
from medina_organism.organism import (
    OrganismSDK,
    create_organism,
)

__all__ = [
    "MedinaOrganism",
    "OrganismConfig",
    "OrganismSDK",
    "create_organism",
    "PHI",
    "PHI_INV",
    "PHI_SQ",
    # Protocols
    "QuantumCoherenceProtocol",
    "TemporalReasoningProtocol",
    "SwarmIntelligenceProtocol",
    "MemoryConsolidationProtocol",
    "PatternRecognitionProtocol",
    "NeuralBindingProtocol",
    "CausalInferenceProtocol",
    "AttentionMechanismProtocol",
    "PredictiveCodingProtocol",
    "DecisionOptimizationProtocol",
]
