"""
Toroidal Memory Engine
Protocol: TMN-001

5-coordinate toroidal memory system:
- θ (theta): angular position on torus major circle
- φ (phi): angular position on torus minor circle
- ρ (rho): radial distance from torus center
- ring: discrete ring index (0-11)
- beat: temporal coordinate

φ-weighted toroidal distance for k-NN search.

Integrates: src/lib/toroidalMemoryNavigator.ts
"""

import math
import random
import time
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

PHI = 1.618033988749895
TAU = 2 * math.pi
NUM_RINGS = 12


class MemoryCoordinate:
    """5-dimensional toroidal coordinate."""

    def __init__(self, theta: float, phi: float, rho: float, ring: int, beat: int):
        self.theta = theta % TAU
        self.phi = phi % TAU
        self.rho = max(0.0, min(1.0, rho))
        self.ring = ring % NUM_RINGS
        self.beat = beat

    def to_dict(self) -> Dict[str, Any]:
        return {
            "theta": round(self.theta, 6),
            "phi": round(self.phi, 6),
            "rho": round(self.rho, 6),
            "ring": self.ring,
            "beat": self.beat,
        }


class MemoryEntry:
    """Single memory stored in the toroidal space."""

    def __init__(self, memory_id: str, data: Any, coord: MemoryCoordinate, weight: float = 1.0):
        self.id = memory_id
        self.data = data
        self.coord = coord
        self.weight = weight
        self.access_count = 0


class ToroidalMemoryEngine:
    """Toroidal memory navigation engine."""

    def __init__(self):
        self.memories: Dict[str, MemoryEntry] = {}

    def store(
        self,
        memory_id: str,
        data: Any,
        theta: Optional[float] = None,
        phi: Optional[float] = None,
        rho: Optional[float] = None,
        ring: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Store data at a toroidal coordinate."""
        coord = MemoryCoordinate(
            theta=theta if theta is not None else random.random() * TAU,
            phi=phi if phi is not None else random.random() * TAU,
            rho=rho if rho is not None else 0.5 + random.random() * 0.5,
            ring=ring if ring is not None else random.randint(0, NUM_RINGS - 1),
            beat=int(time.time() * 1000),
        )

        entry = MemoryEntry(memory_id, data, coord)
        self.memories[memory_id] = entry
        return coord.to_dict()

    def retrieve(self, memory_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve memory by ID."""
        entry = self.memories.get(memory_id)
        if entry is None:
            return None

        entry.access_count += 1
        return {
            "id": entry.id,
            "data": entry.data,
            "coordinate": entry.coord.to_dict(),
            "weight": entry.weight,
            "access_count": entry.access_count,
        }

    def find_nearest(
        self,
        theta: float,
        phi: float,
        rho: float,
        ring: int,
        k: int = 5,
    ) -> List[Dict[str, Any]]:
        """Find k nearest memories using φ-weighted toroidal distance."""
        target = MemoryCoordinate(theta, phi, rho, ring, 0)

        distances = []
        for entry in self.memories.values():
            dist = self._toroidal_distance(target, entry.coord)
            distances.append((dist, entry))

        distances.sort(key=lambda x: x[0])

        results = []
        for dist, entry in distances[:k]:
            results.append({
                "id": entry.id,
                "distance": round(dist, 6),
                "data": entry.data,
                "coordinate": entry.coord.to_dict(),
            })

        return results

    def _toroidal_distance(self, a: MemoryCoordinate, b: MemoryCoordinate) -> float:
        """Calculate φ-weighted toroidal distance."""
        # Angular distances wrap around
        d_theta = min(abs(a.theta - b.theta), TAU - abs(a.theta - b.theta))
        d_phi = min(abs(a.phi - b.phi), TAU - abs(a.phi - b.phi))
        d_rho = abs(a.rho - b.rho)

        # Ring distance wraps around
        d_ring = min(abs(a.ring - b.ring), NUM_RINGS - abs(a.ring - b.ring))

        # φ-weighted Euclidean combination
        return math.sqrt(
            d_theta ** 2
            + d_phi ** 2
            + (d_rho * PHI) ** 2
            + (d_ring / NUM_RINGS) ** 2
        )

    def get_status(self) -> Dict[str, Any]:
        return {
            "total_memories": len(self.memories),
            "rings": NUM_RINGS,
            "dimensions": 5,
            "protocol": "TMN-001",
        }
