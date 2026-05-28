"""
Temporal Reasoning Engine
Protocol: PROTO-232 / PROTO-322

φ-Harmonic temporal prediction and reasoning:
- Time series prediction using golden ratio harmonics
- Causal graph analysis
- Temporal pattern recognition
- Beat-aligned scheduling

Integrates: src/protocols/python/temporal_reasoning_protocol.py
"""

import math
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

PHI = 1.618033988749895
PHI_INVERSE = 0.6180339887498949


class TemporalReasoningEngine:
    """Temporal reasoning with φ-harmonic prediction."""

    def __init__(self):
        self.predictions_made: int = 0
        self.history: List[Dict[str, Any]] = []

    def predict(
        self,
        series: List[float],
        horizon: int = 5,
        method: str = "phi_harmonic",
    ) -> Dict[str, Any]:
        """Predict future values using φ-harmonic decomposition."""
        self.predictions_made += 1

        if not series:
            return {"predictions": [], "confidence_intervals": []}

        arr = np.array(series, dtype=np.float64)

        if method == "phi_harmonic":
            predictions = self._phi_harmonic_predict(arr, horizon)
        elif method == "exponential_decay":
            predictions = self._exponential_decay_predict(arr, horizon)
        elif method == "linear":
            predictions = self._linear_predict(arr, horizon)
        else:
            predictions = self._phi_harmonic_predict(arr, horizon)

        # Confidence intervals based on historical variance
        std = float(np.std(arr)) if len(arr) > 1 else 0.1
        confidence_intervals = []
        for i, pred in enumerate(predictions):
            # Confidence decreases with horizon (φ-weighted)
            decay = PHI_INVERSE ** (i + 1)
            width = std * (1.0 / decay) * 1.96
            confidence_intervals.append({
                "lower": round(pred - width, 4),
                "upper": round(pred + width, 4),
                "confidence": round(decay, 4),
            })

        return {
            "predictions": [round(p, 4) for p in predictions],
            "confidence_intervals": confidence_intervals,
            "method": method,
        }

    def _phi_harmonic_predict(self, arr: np.ndarray, horizon: int) -> List[float]:
        """Predict using φ-harmonic decomposition."""
        n = len(arr)
        predictions = []

        # Use last few values weighted by φ powers
        window = min(n, 10)
        weights = np.array([PHI ** (-i) for i in range(window)])
        weights /= weights.sum()

        recent = arr[-window:]
        base = float(np.dot(recent, weights))

        # Trend from φ-weighted differences
        if n >= 2:
            diffs = np.diff(arr[-window:])
            diff_weights = np.array([PHI ** (-i) for i in range(len(diffs))])
            diff_weights /= diff_weights.sum()
            trend = float(np.dot(diffs, diff_weights))
        else:
            trend = 0.0

        for i in range(horizon):
            # φ-harmonic oscillation component
            oscillation = math.sin(2 * math.pi * (i + 1) / (PHI * 5)) * float(np.std(arr)) * 0.1
            pred = base + trend * (i + 1) * PHI_INVERSE + oscillation
            predictions.append(pred)

        return predictions

    def _exponential_decay_predict(self, arr: np.ndarray, horizon: int) -> List[float]:
        """Predict using exponential decay toward mean."""
        mean = float(np.mean(arr))
        last = float(arr[-1])
        predictions = []

        for i in range(horizon):
            decay = PHI_INVERSE ** (i + 1)
            pred = last * decay + mean * (1 - decay)
            predictions.append(pred)

        return predictions

    def _linear_predict(self, arr: np.ndarray, horizon: int) -> List[float]:
        """Simple linear extrapolation."""
        n = len(arr)
        if n < 2:
            return [float(arr[-1])] * horizon

        x = np.arange(n, dtype=np.float64)
        slope, intercept = np.polyfit(x, arr, 1)

        predictions = []
        for i in range(horizon):
            pred = slope * (n + i) + intercept
            predictions.append(float(pred))

        return predictions

    def get_status(self) -> Dict[str, Any]:
        return {
            "predictions_made": self.predictions_made,
            "methods": ["phi_harmonic", "exponential_decay", "linear"],
            "protocol": "PROTO-232",
        }
