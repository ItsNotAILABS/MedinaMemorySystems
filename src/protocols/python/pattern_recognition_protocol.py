"""
PROTO-306 — Pattern Recognition Protocol (Python)
φ-coherent pattern detection and classification.

Charter: PROTO-306
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Callable, Tuple
from collections import defaultdict

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


@dataclass
class Pattern:
    """A recognized pattern with features and activation."""
    id: str
    name: str
    features: List[float]
    activation: float = 0.0
    match_count: int = 0
    last_matched: float = 0.0
    category: str = "unknown"
    confidence: float = 0.0
    
    def match_score(self, input_features: List[float]) -> float:
        """Compute match score against input."""
        if len(self.features) != len(input_features):
            return 0.0
        
        # Cosine similarity
        dot = sum(a * b for a, b in zip(self.features, input_features))
        mag_a = math.sqrt(sum(a**2 for a in self.features)) or 1
        mag_b = math.sqrt(sum(b**2 for b in input_features)) or 1
        
        return max(0, dot / (mag_a * mag_b))
    
    def activate(self, score: float) -> None:
        """Activate pattern based on match score."""
        self.activation = score * PHI
        self.confidence = score
        if score > PHI_INV:
            self.match_count += 1
            self.last_matched = time.time()
    
    def decay(self, rate: float = 0.1) -> None:
        """Decay activation over time."""
        self.activation *= (1 - rate * PHI_INV)


class PatternLibrary:
    """Library of known patterns."""
    
    def __init__(self, max_patterns: int = 1000):
        self.patterns: Dict[str, Pattern] = {}
        self.by_category: Dict[str, List[str]] = defaultdict(list)
        self.max_patterns = max_patterns
    
    def add_pattern(self, pattern: Pattern) -> None:
        """Add a pattern to the library."""
        if len(self.patterns) >= self.max_patterns:
            self._prune_least_used()
        
        self.patterns[pattern.id] = pattern
        self.by_category[pattern.category].append(pattern.id)
    
    def get_pattern(self, pattern_id: str) -> Optional[Pattern]:
        """Get a pattern by ID."""
        return self.patterns.get(pattern_id)
    
    def get_by_category(self, category: str) -> List[Pattern]:
        """Get all patterns in a category."""
        return [self.patterns[pid] for pid in self.by_category.get(category, [])
                if pid in self.patterns]
    
    def _prune_least_used(self) -> None:
        """Remove least used patterns."""
        sorted_patterns = sorted(
            self.patterns.values(),
            key=lambda p: p.match_count
        )
        to_remove = sorted_patterns[:int(len(sorted_patterns) * PHI_INV * 0.1)]
        
        for pattern in to_remove:
            del self.patterns[pattern.id]
            if pattern.id in self.by_category[pattern.category]:
                self.by_category[pattern.category].remove(pattern.id)


class PatternMatcher:
    """Matches input against pattern library."""
    
    def __init__(self, threshold: float = 0.5):
        self.threshold = threshold
        self.match_history: List[Dict[str, Any]] = []
    
    def match(self, input_features: List[float], 
              library: PatternLibrary) -> List[Tuple[Pattern, float]]:
        """Match input against all patterns."""
        matches = []
        
        for pattern in library.patterns.values():
            score = pattern.match_score(input_features)
            pattern.activate(score)
            
            if score >= self.threshold * PHI_INV:
                matches.append((pattern, score))
        
        matches.sort(key=lambda x: x[1], reverse=True)
        
        self.match_history.append({
            "input_dim": len(input_features),
            "match_count": len(matches),
            "top_score": matches[0][1] if matches else 0,
            "timestamp": time.time()
        })
        
        return matches
    
    def match_in_category(self, input_features: List[float],
                         library: PatternLibrary, category: str) -> List[Tuple[Pattern, float]]:
        """Match within a specific category."""
        matches = []
        patterns = library.get_by_category(category)
        
        for pattern in patterns:
            score = pattern.match_score(input_features)
            pattern.activate(score)
            
            if score >= self.threshold * PHI_INV:
                matches.append((pattern, score))
        
        matches.sort(key=lambda x: x[1], reverse=True)
        return matches


class PatternLearner:
    """Learns new patterns from examples."""
    
    def __init__(self, learning_rate: float = 0.1):
        self.learning_rate = learning_rate
        self.examples: List[Tuple[List[float], str]] = []
        self.pattern_counter = 0
    
    def add_example(self, features: List[float], label: str) -> None:
        """Add a learning example."""
        self.examples.append((features, label))
    
    def learn_pattern(self, category: str) -> Optional[Pattern]:
        """Learn a pattern from collected examples."""
        category_examples = [(f, l) for f, l in self.examples if l == category]
        
        if not category_examples:
            return None
        
        # Compute centroid
        dim = len(category_examples[0][0])
        centroid = [0.0] * dim
        
        for features, _ in category_examples:
            for i, v in enumerate(features):
                centroid[i] += v
        
        centroid = [c / len(category_examples) for c in centroid]
        
        self.pattern_counter += 1
        pattern = Pattern(
            id=f"learned-{self.pattern_counter}",
            name=f"Pattern-{category}",
            features=centroid,
            category=category
        )
        
        return pattern
    
    def clear_examples(self, category: Optional[str] = None) -> None:
        """Clear learning examples."""
        if category:
            self.examples = [(f, l) for f, l in self.examples if l != category]
        else:
            self.examples = []


class PatternRecognitionEngine:
    """
    Main engine for pattern recognition with φ-harmonic processing.
    """
    
    def __init__(self, feature_dim: int = 32):
        self.library = PatternLibrary()
        self.matcher = PatternMatcher()
        self.learner = PatternLearner()
        self.feature_dim = feature_dim
        self.beat_count = 0
        self.recognition_history: List[Dict[str, Any]] = []
    
    def add_known_pattern(self, name: str, features: List[float],
                         category: str = "general") -> Pattern:
        """Add a known pattern to the library."""
        pattern = Pattern(
            id=f"pattern-{len(self.library.patterns)+1}",
            name=name,
            features=features[:self.feature_dim] if len(features) > self.feature_dim 
                     else features + [0.0] * (self.feature_dim - len(features)),
            category=category
        )
        self.library.add_pattern(pattern)
        return pattern
    
    def recognize(self, input_features: List[float]) -> Dict[str, Any]:
        """Recognize patterns in input."""
        # Normalize input
        if len(input_features) < self.feature_dim:
            input_features = input_features + [0.0] * (self.feature_dim - len(input_features))
        elif len(input_features) > self.feature_dim:
            input_features = input_features[:self.feature_dim]
        
        matches = self.matcher.match(input_features, self.library)
        
        result = {
            "matches": [
                {"pattern": p.name, "category": p.category, "score": s, "confidence": p.confidence}
                for p, s in matches[:5]
            ],
            "best_match": matches[0][0].name if matches else None,
            "best_score": matches[0][1] if matches else 0.0,
            "total_matches": len(matches),
            "phi_confidence": matches[0][1] * PHI if matches else 0.0,
            "timestamp": time.time()
        }
        
        self.recognition_history.append(result)
        return result
    
    def learn_from_example(self, features: List[float], label: str) -> None:
        """Learn from a labeled example."""
        self.learner.add_example(features, label)
    
    def finalize_learning(self, category: str) -> Optional[Pattern]:
        """Finalize learning and create pattern."""
        pattern = self.learner.learn_pattern(category)
        if pattern:
            self.library.add_pattern(pattern)
            self.learner.clear_examples(category)
        return pattern
    
    def tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        # Decay all pattern activations
        for pattern in self.library.patterns.values():
            pattern.decay(elapsed * 0.1)
        
        return {
            "beat": self.beat_count,
            "pattern_count": len(self.library.patterns),
            "categories": len(self.library.by_category),
            "pending_examples": len(self.learner.examples),
            "phi_coherence": sum(p.activation for p in self.library.patterns.values()) * PHI_INV,
            "timestamp": time.time()
        }
    
    def get_active_patterns(self, threshold: float = 0.5) -> List[Pattern]:
        """Get currently active patterns."""
        return [p for p in self.library.patterns.values() 
                if p.activation >= threshold]
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate pattern recognition report."""
        active = self.get_active_patterns()
        
        return {
            "total_patterns": len(self.library.patterns),
            "active_patterns": len(active),
            "categories": list(self.library.by_category.keys()),
            "recognition_count": len(self.recognition_history),
            "avg_match_score": sum(r.get("best_score", 0) for r in self.recognition_history) /
                              max(1, len(self.recognition_history)),
            "phi_metric": len(active) / max(1, len(self.library.patterns)) * PHI,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[PatternRecognitionEngine] = None

def get_pattern_recognition_engine() -> PatternRecognitionEngine:
    """Get or create the singleton PatternRecognitionEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = PatternRecognitionEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-306 Pattern Recognition Protocol (Python) ===")
    
    engine = get_pattern_recognition_engine()
    
    # Add known patterns
    engine.add_known_pattern("circle", [1, 0, 0, 0] + [0]*28, "shape")
    engine.add_known_pattern("square", [0, 1, 0, 0] + [0]*28, "shape")
    engine.add_known_pattern("triangle", [0, 0, 1, 0] + [0]*28, "shape")
    
    # Recognize input
    result = engine.recognize([0.9, 0.1, 0.1, 0.0] + [0]*28)
    print(f"Recognition result: {result}")
    
    # Learn from examples
    for _ in range(10):
        engine.learn_from_example([0, 0, 0, 1] + [random.gauss(0, 0.1) for _ in range(28)], "hexagon")
    
    learned = engine.finalize_learning("hexagon")
    print(f"Learned pattern: {learned.name if learned else 'None'}")
    
    print(f"Report: {engine.coherence_report()}")
