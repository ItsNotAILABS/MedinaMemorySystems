"""
PROTO-320 — Emergence Detection Protocol (Python)
Detects emergent patterns and behaviors with φ-coherent analysis.

Charter: PROTO-320
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Callable, Set
from collections import defaultdict

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


@dataclass
class SystemState:
    """A snapshot of system state."""
    timestamp: float
    variables: Dict[str, float]
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def complexity(self) -> float:
        """Estimate state complexity."""
        if not self.variables:
            return 0.0
        values = list(self.variables.values())
        
        # Entropy-based complexity
        min_val = min(values)
        max_val = max(values)
        if max_val == min_val:
            return 0.0
        
        normalized = [(v - min_val) / (max_val - min_val) for v in values]
        entropy = 0.0
        for p in normalized:
            if 0 < p < 1:
                entropy -= p * math.log2(p + 1e-10) + (1-p) * math.log2(1-p + 1e-10)
        
        return entropy / len(values) * PHI_INV


@dataclass
class EmergentPattern:
    """A detected emergent pattern."""
    id: str
    name: str
    description: str
    confidence: float
    complexity_gain: float
    contributing_variables: List[str]
    first_detected: float = field(default_factory=time.time)
    persistence: int = 0
    
    def significance(self) -> float:
        """Calculate pattern significance."""
        return self.confidence * self.complexity_gain * (1 + math.log1p(self.persistence)) * PHI_INV


class ComplexityAnalyzer:
    """Analyzes system complexity over time."""
    
    def __init__(self, window_size: int = 100):
        self.history: List[SystemState] = []
        self.window_size = window_size
        self.complexity_history: List[float] = []
    
    def add_state(self, state: SystemState) -> float:
        """Add a state and return its complexity."""
        if len(self.history) >= self.window_size:
            self.history.pop(0)
        self.history.append(state)
        
        complexity = state.complexity()
        self.complexity_history.append(complexity)
        if len(self.complexity_history) > self.window_size:
            self.complexity_history.pop(0)
        
        return complexity
    
    def complexity_trend(self) -> float:
        """Calculate complexity trend (positive = increasing)."""
        if len(self.complexity_history) < 2:
            return 0.0
        
        recent = self.complexity_history[-20:]
        if len(recent) < 2:
            return 0.0
        
        # Linear regression
        x = list(range(len(recent)))
        y = recent
        
        x_mean = sum(x) / len(x)
        y_mean = sum(y) / len(y)
        
        numerator = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))
        denominator = sum((xi - x_mean) ** 2 for xi in x) or 1
        
        return numerator / denominator
    
    def complexity_variance(self) -> float:
        """Calculate complexity variance."""
        if len(self.complexity_history) < 2:
            return 0.0
        
        mean = sum(self.complexity_history) / len(self.complexity_history)
        variance = sum((c - mean) ** 2 for c in self.complexity_history) / len(self.complexity_history)
        return variance


class CorrelationDetector:
    """Detects correlations between variables."""
    
    def __init__(self, threshold: float = 0.7):
        self.threshold = threshold
        self.variable_history: Dict[str, List[float]] = defaultdict(list)
        self.max_history = 100
    
    def update(self, variables: Dict[str, float]) -> None:
        """Update variable history."""
        for name, value in variables.items():
            if len(self.variable_history[name]) >= self.max_history:
                self.variable_history[name].pop(0)
            self.variable_history[name].append(value)
    
    def correlate(self, var1: str, var2: str) -> float:
        """Calculate correlation between two variables."""
        if var1 not in self.variable_history or var2 not in self.variable_history:
            return 0.0
        
        x = self.variable_history[var1]
        y = self.variable_history[var2]
        n = min(len(x), len(y))
        
        if n < 3:
            return 0.0
        
        x = x[-n:]
        y = y[-n:]
        
        x_mean = sum(x) / n
        y_mean = sum(y) / n
        
        numerator = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))
        denominator = math.sqrt(
            sum((xi - x_mean) ** 2 for xi in x) * 
            sum((yi - y_mean) ** 2 for yi in y)
        ) or 1
        
        return numerator / denominator
    
    def find_correlated_pairs(self) -> List[tuple]:
        """Find all significantly correlated pairs."""
        pairs = []
        variables = list(self.variable_history.keys())
        
        for i, v1 in enumerate(variables):
            for v2 in variables[i+1:]:
                corr = abs(self.correlate(v1, v2))
                if corr >= self.threshold:
                    pairs.append((v1, v2, corr))
        
        return pairs


class EmergenceDetector:
    """Detects emergent patterns in system behavior."""
    
    def __init__(self):
        self.patterns: Dict[str, EmergentPattern] = {}
        self.detectors: List[Callable[[List[SystemState]], Optional[EmergentPattern]]] = []
        self.pattern_counter = 0
    
    def add_detector(self, detector: Callable[[List[SystemState]], Optional[EmergentPattern]]) -> None:
        """Add a pattern detector function."""
        self.detectors.append(detector)
    
    def detect(self, states: List[SystemState]) -> List[EmergentPattern]:
        """Run all detectors on state history."""
        detected = []
        
        for detector in self.detectors:
            pattern = detector(states)
            if pattern:
                if pattern.name in self.patterns:
                    self.patterns[pattern.name].persistence += 1
                    self.patterns[pattern.name].confidence = max(
                        self.patterns[pattern.name].confidence,
                        pattern.confidence
                    )
                else:
                    self.pattern_counter += 1
                    pattern.id = f"pattern-{self.pattern_counter}"
                    self.patterns[pattern.name] = pattern
                detected.append(pattern)
        
        return detected
    
    def get_significant_patterns(self, threshold: float = 0.5) -> List[EmergentPattern]:
        """Get patterns above significance threshold."""
        return [p for p in self.patterns.values() if p.significance() >= threshold]


class EmergenceDetectionEngine:
    """
    Main emergence detection engine with φ-coherent processing.
    """
    
    def __init__(self):
        self.complexity_analyzer = ComplexityAnalyzer()
        self.correlation_detector = CorrelationDetector()
        self.emergence_detector = EmergenceDetector()
        self.state_history: List[SystemState] = []
        self.max_history = 1000
        self.beat_count = 0
        
        # Add built-in detectors
        self._add_builtin_detectors()
    
    def _add_builtin_detectors(self) -> None:
        """Add built-in pattern detectors."""
        
        # Complexity spike detector
        def complexity_spike(states: List[SystemState]) -> Optional[EmergentPattern]:
            if len(states) < 10:
                return None
            
            recent = [s.complexity() for s in states[-10:]]
            earlier = [s.complexity() for s in states[-20:-10]] if len(states) >= 20 else []
            
            if not earlier:
                return None
            
            recent_avg = sum(recent) / len(recent)
            earlier_avg = sum(earlier) / len(earlier)
            
            if recent_avg > earlier_avg * PHI:  # Significant increase
                return EmergentPattern(
                    id="",
                    name="complexity_spike",
                    description="Sudden increase in system complexity",
                    confidence=min(1.0, (recent_avg - earlier_avg) / earlier_avg) if earlier_avg > 0 else 0,
                    complexity_gain=recent_avg - earlier_avg,
                    contributing_variables=list(states[-1].variables.keys())[:5]
                )
            return None
        
        # Synchronization detector
        def synchronization(states: List[SystemState]) -> Optional[EmergentPattern]:
            if len(states) < 5:
                return None
            
            recent = states[-5:]
            variables = list(recent[0].variables.keys())
            
            if len(variables) < 2:
                return None
            
            # Check for synchronized changes
            sync_score = 0
            for i in range(1, len(recent)):
                changes_same_direction = 0
                for var in variables:
                    if var in recent[i].variables and var in recent[i-1].variables:
                        delta = recent[i].variables[var] - recent[i-1].variables[var]
                        if abs(delta) > 0.01:
                            changes_same_direction += 1 if delta > 0 else -1
                
                if abs(changes_same_direction) == len(variables):
                    sync_score += 1
            
            if sync_score >= 3:
                return EmergentPattern(
                    id="",
                    name="synchronization",
                    description="Variables moving in synchronization",
                    confidence=sync_score / (len(recent) - 1),
                    complexity_gain=0.5,
                    contributing_variables=variables
                )
            return None
        
        self.emergence_detector.add_detector(complexity_spike)
        self.emergence_detector.add_detector(synchronization)
    
    def observe(self, variables: Dict[str, float], 
               metadata: Optional[Dict[str, Any]] = None) -> SystemState:
        """Observe current system state."""
        state = SystemState(
            timestamp=time.time(),
            variables=dict(variables),
            metadata=metadata or {}
        )
        
        if len(self.state_history) >= self.max_history:
            self.state_history.pop(0)
        self.state_history.append(state)
        
        # Update analyzers
        self.complexity_analyzer.add_state(state)
        self.correlation_detector.update(variables)
        
        return state
    
    def detect_emergence(self) -> List[EmergentPattern]:
        """Run emergence detection on current history."""
        return self.emergence_detector.detect(self.state_history)
    
    def get_correlations(self) -> List[tuple]:
        """Get correlated variable pairs."""
        return self.correlation_detector.find_correlated_pairs()
    
    def complexity_analysis(self) -> Dict[str, Any]:
        """Get complexity analysis."""
        return {
            "current_complexity": self.complexity_analyzer.complexity_history[-1] 
                                 if self.complexity_analyzer.complexity_history else 0,
            "trend": self.complexity_analyzer.complexity_trend(),
            "variance": self.complexity_analyzer.complexity_variance(),
            "history_size": len(self.complexity_analyzer.complexity_history)
        }
    
    def add_custom_detector(self, 
                           detector: Callable[[List[SystemState]], Optional[EmergentPattern]]) -> None:
        """Add a custom pattern detector."""
        self.emergence_detector.add_detector(detector)
    
    def tick(self) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        patterns = self.detect_emergence()
        correlations = self.get_correlations()
        complexity = self.complexity_analysis()
        
        return {
            "beat": self.beat_count,
            "state_count": len(self.state_history),
            "new_patterns": len(patterns),
            "total_patterns": len(self.emergence_detector.patterns),
            "correlations": len(correlations),
            "complexity": complexity["current_complexity"],
            "complexity_trend": complexity["trend"],
            "phi_coherence": (complexity["current_complexity"] + len(patterns) * 0.1) * PHI_INV,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate emergence detection report."""
        significant = self.emergence_detector.get_significant_patterns()
        
        return {
            "state_history_size": len(self.state_history),
            "total_patterns": len(self.emergence_detector.patterns),
            "significant_patterns": len(significant),
            "pattern_names": [p.name for p in significant],
            "correlations": len(self.get_correlations()),
            "complexity_analysis": self.complexity_analysis(),
            "phi_metric": sum(p.significance() for p in significant) * PHI_INV,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[EmergenceDetectionEngine] = None

def get_emergence_detection_engine() -> EmergenceDetectionEngine:
    """Get or create the singleton EmergenceDetectionEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = EmergenceDetectionEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-320 Emergence Detection Protocol (Python) ===")
    
    engine = get_emergence_detection_engine()
    
    # Simulate system with emergent behavior
    print("Simulating system...")
    
    for i in range(50):
        # Normal state
        variables = {
            "var_a": 0.5 + random.gauss(0, 0.1),
            "var_b": 0.5 + random.gauss(0, 0.1),
            "var_c": 0.5 + random.gauss(0, 0.1)
        }
        
        # Introduce emergence at step 30
        if i >= 30:
            # Synchronized increase
            boost = (i - 30) * 0.05
            variables["var_a"] += boost
            variables["var_b"] += boost
            variables["var_c"] += boost
        
        engine.observe(variables)
    
    # Analyze
    patterns = engine.detect_emergence()
    print(f"Detected patterns: {[p.name for p in patterns]}")
    
    correlations = engine.get_correlations()
    print(f"Correlations: {correlations}")
    
    complexity = engine.complexity_analysis()
    print(f"Complexity: {complexity}")
    
    print(f"Report: {engine.coherence_report()}")
