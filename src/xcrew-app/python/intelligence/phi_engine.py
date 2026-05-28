"""
φ-Harmonic Timing Engine
Protocol: PHT-001

10 harmonic levels from NANO to CYCLE:
- Phase-locked groups
- Golden-angle jitter
- Beat collision detection
- φ-power interval scaling

Integrates: src/lib/phiHarmonicTimingEngine.ts
"""

import math
import time
from typing import Any, Dict, List, Optional

PHI = 1.618033988749895
PHI_INVERSE = 0.6180339887498949
GOLDEN_ANGLE = 2.39996322972865332  # radians


class PhiHarmonicEngine:
    """φ-Harmonic timing and scheduling engine."""

    LEVELS = [
        "NANO",    # 0: ~6.2ms
        "MICRO",   # 1: ~10ms
        "MILLI",   # 2: ~16.2ms
        "CENTI",   # 3: ~26.2ms
        "DECI",    # 4: ~42.4ms
        "UNIT",    # 5: 1000ms (base)
        "DECA",    # 6: ~1618ms
        "HECTO",   # 7: ~2618ms
        "KILO",    # 8: ~4236ms
        "CYCLE",   # 9: ~6854ms
    ]

    def __init__(self):
        self.scheduled_events: List[Dict[str, Any]] = []
        self.beats_generated: int = 0

    def get_interval_ms(self, level: int) -> float:
        """Get interval for harmonic level (φ^(level-5) * 1000ms)."""
        return math.pow(PHI, level - 5) * 1000.0

    def get_level_name(self, level: int) -> str:
        """Get name for harmonic level."""
        if 0 <= level < len(self.LEVELS):
            return self.LEVELS[level]
        return "UNKNOWN"

    def next_beat(self, level: int) -> Dict[str, Any]:
        """Calculate next φ-aligned beat time."""
        self.beats_generated += 1
        interval = self.get_interval_ms(level)
        now = time.time() * 1000  # ms
        next_time = math.ceil(now / interval) * interval
        delay = next_time - now

        return {
            "level": level,
            "level_name": self.get_level_name(level),
            "interval_ms": round(interval, 3),
            "next_beat_ms": round(next_time, 3),
            "delay_ms": round(delay, 3),
            "phi_alignment": round(delay / interval, 6),
        }

    def golden_angle_jitter(self, index: int) -> float:
        """Calculate golden-angle based jitter for even distribution."""
        return (index * GOLDEN_ANGLE) % (2 * math.pi)

    def detect_beat_collision(self, level_a: int, level_b: int) -> Dict[str, Any]:
        """Detect when two harmonic levels will collide (synchronize)."""
        interval_a = self.get_interval_ms(level_a)
        interval_b = self.get_interval_ms(level_b)

        # LCM gives collision period
        # For φ-based intervals, collisions occur at φ^|a-b| beats
        collision_interval = interval_a * interval_b / math.gcd(
            int(interval_a * 1000), int(interval_b * 1000)
        ) * 1000

        return {
            "level_a": level_a,
            "level_b": level_b,
            "interval_a_ms": round(interval_a, 3),
            "interval_b_ms": round(interval_b, 3),
            "collision_interval_ms": round(collision_interval, 3),
            "phi_ratio": round(interval_b / interval_a, 6) if interval_a > 0 else 0,
        }

    def get_all_intervals(self) -> List[Dict[str, Any]]:
        """Get all harmonic level intervals."""
        return [
            {
                "level": i,
                "name": self.LEVELS[i],
                "interval_ms": round(self.get_interval_ms(i), 3),
            }
            for i in range(len(self.LEVELS))
        ]

    def get_status(self) -> Dict[str, Any]:
        return {
            "levels": len(self.LEVELS),
            "beats_generated": self.beats_generated,
            "golden_angle": round(GOLDEN_ANGLE, 6),
            "protocol": "PHT-001",
        }
