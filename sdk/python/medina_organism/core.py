"""
𓂀 MEDINA ORGANISM SDK — Core Constants and Configuration 𓂀

φ-coherent constants and base configuration for the organism.
"""

from __future__ import annotations
import math
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from enum import Enum

# ═══════════════════════════════════════════════════════════════════════════
# φ-COHERENT CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════

PHI = (1 + math.sqrt(5)) / 2          # 1.618033988749895
PHI_INV = 1 / PHI                      # 0.618033988749895
PHI_SQ = PHI * PHI                     # 2.618033988749895
PHI_CUBED = PHI * PHI * PHI            # 4.236067977499790
SCHUMANN_BASE = 7.83                   # Hz
SOVEREIGN_FREQUENCY = SCHUMANN_BASE * PHI  # ~12.67 Hz
BEAT_INTERVAL_MS = 873                 # ms (~φ^6 rounded)
COHERENCE_ICOSAHEDRAL = 0.9510565     # cos(π/5)
COHERENCE_E8 = 0.9876543              # E8 lattice coherence


class OrganismMode(Enum):
    """Operational modes for the organism SDK."""
    AUTONOMOUS = "autonomous"
    GUIDED = "guided"
    DORMANT = "dormant"
    RESONATING = "resonating"
    ABSORBING = "absorbing"


class ProtocolDomain(Enum):
    """Protocol classification domains."""
    QUANTUM = "quantum"
    TEMPORAL = "temporal"
    SWARM = "swarm"
    MEMORY = "memory"
    PATTERN = "pattern"
    NEURAL = "neural"
    CAUSAL = "causal"
    ATTENTION = "attention"
    PREDICTIVE = "predictive"
    DECISION = "decision"
    EMOTION = "emotion"
    PLANNING = "planning"
    LEARNING = "learning"
    REASONING = "reasoning"
    COMMUNICATION = "communication"


@dataclass
class OrganismConfig:
    """Configuration for creating a Medina Organism instance."""
    organism_id: str = "medina-organism-001"
    mode: OrganismMode = OrganismMode.AUTONOMOUS
    phi_frequency: float = SOVEREIGN_FREQUENCY
    beat_interval_ms: int = BEAT_INTERVAL_MS
    coherence_threshold: float = COHERENCE_ICOSAHEDRAL
    enabled_protocols: List[ProtocolDomain] = field(default_factory=lambda: list(ProtocolDomain))
    max_memory_traces: int = 10000
    swarm_size: int = 50
    quantum_options: int = 8
    temporal_scales: int = 8
    edge_domains: List[str] = field(default_factory=lambda: [
        "memory", "coherence", "sovereignty", "resonance", "computation"
    ])
    metadata: Dict[str, Any] = field(default_factory=dict)


class MedinaOrganism:
    """
    Base class for all Medina Organism components.
    Provides φ-coherent timing and identity.
    """

    def __init__(self, config: Optional[OrganismConfig] = None):
        self.config = config or OrganismConfig()
        self._beat_count = 0
        self._coherence = COHERENCE_ICOSAHEDRAL
        self._phase = 0.0

    @property
    def phi_phase(self) -> float:
        """Current φ-aligned phase."""
        return (self._beat_count * PHI * 360) % 360

    @property
    def coherence(self) -> float:
        """Current organism coherence level."""
        return self._coherence

    def tick(self) -> Dict[str, Any]:
        """Advance one heartbeat tick."""
        self._beat_count += 1
        self._phase = self.phi_phase
        self._coherence = self._compute_coherence()
        return {
            "beat": self._beat_count,
            "phase": self._phase,
            "coherence": self._coherence,
            "frequency": self.config.phi_frequency,
        }

    def _compute_coherence(self) -> float:
        """Compute φ-aligned coherence."""
        beat_factor = math.sin(self._beat_count * PHI_INV) * 0.5 + 0.5
        return min(1.0, beat_factor * PHI_INV + COHERENCE_ICOSAHEDRAL * PHI_INV)
