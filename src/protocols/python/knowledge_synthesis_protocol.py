"""
PROTO-314 — Knowledge Synthesis Protocol (Python)
Synthesizes knowledge from multiple sources with φ-coherent integration.

Charter: PROTO-314
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
import hashlib
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple
from collections import defaultdict

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


@dataclass
class KnowledgeUnit:
    """A unit of knowledge."""
    id: str
    content: str
    source: str
    confidence: float = 1.0
    domain: str = "general"
    timestamp: float = field(default_factory=time.time)
    citations: List[str] = field(default_factory=list)
    related: List[str] = field(default_factory=list)
    
    def age(self) -> float:
        """Get age in seconds."""
        return time.time() - self.timestamp
    
    def decay(self, rate: float = 0.0001) -> None:
        """Apply confidence decay."""
        self.confidence *= math.exp(-rate * self.age() * PHI_INV)


@dataclass
class SynthesisRule:
    """A rule for synthesizing knowledge."""
    id: str
    name: str
    input_patterns: List[str]
    output_template: str
    confidence_combination: str = "min"  # min, max, avg, product
    
    def apply(self, units: List[KnowledgeUnit]) -> Optional[str]:
        """Apply rule to generate synthesized content."""
        # Simple template substitution
        result = self.output_template
        for i, unit in enumerate(units):
            result = result.replace(f"{{input_{i}}}", unit.content)
        return result
    
    def combine_confidence(self, confidences: List[float]) -> float:
        """Combine confidences according to rule."""
        if not confidences:
            return 0.0
        
        if self.confidence_combination == "min":
            return min(confidences)
        elif self.confidence_combination == "max":
            return max(confidences)
        elif self.confidence_combination == "avg":
            return sum(confidences) / len(confidences)
        elif self.confidence_combination == "product":
            result = 1.0
            for c in confidences:
                result *= c
            return result
        
        return min(confidences) * PHI_INV


class KnowledgeBase:
    """Storage for knowledge units."""
    
    def __init__(self, max_units: int = 100000):
        self.units: Dict[str, KnowledgeUnit] = {}
        self.by_domain: Dict[str, List[str]] = defaultdict(list)
        self.by_source: Dict[str, List[str]] = defaultdict(list)
        self.max_units = max_units
    
    def add(self, unit: KnowledgeUnit) -> None:
        """Add a knowledge unit."""
        if len(self.units) >= self.max_units:
            self._prune()
        
        self.units[unit.id] = unit
        self.by_domain[unit.domain].append(unit.id)
        self.by_source[unit.source].append(unit.id)
    
    def get(self, unit_id: str) -> Optional[KnowledgeUnit]:
        """Get a knowledge unit by ID."""
        return self.units.get(unit_id)
    
    def search(self, query: str, domain: Optional[str] = None) -> List[KnowledgeUnit]:
        """Search knowledge base."""
        results = []
        query_lower = query.lower()
        
        candidates = self.units.values()
        if domain:
            candidate_ids = self.by_domain.get(domain, [])
            candidates = [self.units[uid] for uid in candidate_ids if uid in self.units]
        
        for unit in candidates:
            if query_lower in unit.content.lower():
                results.append(unit)
        
        return sorted(results, key=lambda u: u.confidence, reverse=True)
    
    def get_by_domain(self, domain: str) -> List[KnowledgeUnit]:
        """Get all units in a domain."""
        ids = self.by_domain.get(domain, [])
        return [self.units[uid] for uid in ids if uid in self.units]
    
    def _prune(self) -> int:
        """Remove low-confidence units."""
        sorted_units = sorted(self.units.values(), key=lambda u: u.confidence)
        to_remove = int(len(sorted_units) * PHI_INV * 0.1)
        
        for unit in sorted_units[:to_remove]:
            del self.units[unit.id]
        
        return to_remove


class ConflictResolver:
    """Resolves conflicts between knowledge units."""
    
    def __init__(self):
        self.resolution_count = 0
    
    def detect_conflict(self, unit1: KnowledgeUnit, unit2: KnowledgeUnit) -> bool:
        """Detect if two units conflict."""
        # Simple heuristic: same domain but contradictory content
        if unit1.domain != unit2.domain:
            return False
        
        # Check for negation patterns
        content1 = unit1.content.lower()
        content2 = unit2.content.lower()
        
        negation_patterns = [
            ("is", "is not"),
            ("can", "cannot"),
            ("will", "will not"),
            ("true", "false"),
            ("yes", "no")
        ]
        
        for pos, neg in negation_patterns:
            if (pos in content1 and neg in content2) or (neg in content1 and pos in content2):
                return True
        
        return False
    
    def resolve(self, unit1: KnowledgeUnit, unit2: KnowledgeUnit) -> KnowledgeUnit:
        """Resolve conflict by selecting higher confidence unit."""
        self.resolution_count += 1
        
        # Weight by confidence and recency
        score1 = unit1.confidence * math.exp(-unit1.age() * PHI_INV * 0.0001)
        score2 = unit2.confidence * math.exp(-unit2.age() * PHI_INV * 0.0001)
        
        if score1 >= score2:
            return unit1
        return unit2


class KnowledgeSynthesizer:
    """Synthesizes new knowledge from existing units."""
    
    def __init__(self):
        self.rules: Dict[str, SynthesisRule] = {}
        self.synthesis_count = 0
    
    def add_rule(self, rule: SynthesisRule) -> None:
        """Add a synthesis rule."""
        self.rules[rule.id] = rule
    
    def synthesize(self, units: List[KnowledgeUnit], rule_id: str) -> Optional[KnowledgeUnit]:
        """Synthesize new knowledge using a rule."""
        rule = self.rules.get(rule_id)
        if not rule:
            return None
        
        content = rule.apply(units)
        if not content:
            return None
        
        self.synthesis_count += 1
        confidences = [u.confidence for u in units]
        
        return KnowledgeUnit(
            id=f"synth-{self.synthesis_count}-{hashlib.md5(content.encode()).hexdigest()[:6]}",
            content=content,
            source="synthesis",
            confidence=rule.combine_confidence(confidences) * PHI_INV,
            domain=units[0].domain if units else "general",
            citations=[u.id for u in units]
        )
    
    def auto_synthesize(self, units: List[KnowledgeUnit]) -> List[KnowledgeUnit]:
        """Automatically apply applicable rules."""
        synthesized = []
        
        for rule in self.rules.values():
            if len(units) >= len(rule.input_patterns):
                result = self.synthesize(units[:len(rule.input_patterns)], rule.id)
                if result:
                    synthesized.append(result)
        
        return synthesized


class KnowledgeSynthesisEngine:
    """
    Main knowledge synthesis engine with φ-coherent processing.
    """
    
    def __init__(self):
        self.knowledge_base = KnowledgeBase()
        self.synthesizer = KnowledgeSynthesizer()
        self.resolver = ConflictResolver()
        self.beat_count = 0
        self.unit_counter = 0
    
    def add_knowledge(self, content: str, source: str = "input",
                     confidence: float = 1.0, domain: str = "general") -> KnowledgeUnit:
        """Add new knowledge."""
        self.unit_counter += 1
        
        unit = KnowledgeUnit(
            id=f"ku-{self.unit_counter}",
            content=content,
            source=source,
            confidence=confidence,
            domain=domain
        )
        
        # Check for conflicts
        existing = self.knowledge_base.search(content[:50], domain)
        for existing_unit in existing:
            if self.resolver.detect_conflict(unit, existing_unit):
                winner = self.resolver.resolve(unit, existing_unit)
                if winner == existing_unit:
                    return existing_unit
        
        self.knowledge_base.add(unit)
        return unit
    
    def add_synthesis_rule(self, name: str, input_patterns: List[str],
                          output_template: str, confidence_combo: str = "min") -> SynthesisRule:
        """Add a synthesis rule."""
        rule = SynthesisRule(
            id=f"rule-{len(self.synthesizer.rules)}",
            name=name,
            input_patterns=input_patterns,
            output_template=output_template,
            confidence_combination=confidence_combo
        )
        self.synthesizer.add_rule(rule)
        return rule
    
    def query(self, query: str, domain: Optional[str] = None, limit: int = 10) -> List[KnowledgeUnit]:
        """Query the knowledge base."""
        return self.knowledge_base.search(query, domain)[:limit]
    
    def synthesize_from_query(self, query: str, rule_id: str) -> Optional[KnowledgeUnit]:
        """Query and synthesize."""
        units = self.query(query, limit=5)
        if len(units) < 2:
            return None
        
        result = self.synthesizer.synthesize(units[:2], rule_id)
        if result:
            self.knowledge_base.add(result)
        return result
    
    def integrate_sources(self, units: List[KnowledgeUnit]) -> KnowledgeUnit:
        """Integrate knowledge from multiple sources."""
        if not units:
            return None
        
        # Combine content
        combined_content = " | ".join(u.content for u in units)
        
        # Average confidence with φ-weighting
        weights = [PHI_INV ** i for i in range(len(units))]
        total_weight = sum(weights)
        weighted_conf = sum(u.confidence * w for u, w in zip(units, weights)) / total_weight
        
        return self.add_knowledge(
            content=combined_content,
            source="integration",
            confidence=weighted_conf,
            domain=units[0].domain
        )
    
    def find_related(self, unit_id: str, limit: int = 5) -> List[KnowledgeUnit]:
        """Find related knowledge units."""
        unit = self.knowledge_base.get(unit_id)
        if not unit:
            return []
        
        # Search by content keywords
        words = unit.content.split()[:3]
        related = []
        
        for word in words:
            if len(word) > 3:
                results = self.query(word, unit.domain)
                for r in results:
                    if r.id != unit_id and r not in related:
                        related.append(r)
        
        return related[:limit]
    
    def tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        # Decay all units
        for unit in self.knowledge_base.units.values():
            unit.decay(0.0001 * elapsed)
        
        return {
            "beat": self.beat_count,
            "knowledge_units": len(self.knowledge_base.units),
            "domains": len(self.knowledge_base.by_domain),
            "sources": len(self.knowledge_base.by_source),
            "synthesis_count": self.synthesizer.synthesis_count,
            "conflict_resolutions": self.resolver.resolution_count,
            "phi_coherence": len(self.knowledge_base.units) * PHI_INV / 1000,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate knowledge synthesis report."""
        avg_confidence = sum(u.confidence for u in self.knowledge_base.units.values()) / \
                        max(1, len(self.knowledge_base.units))
        
        return {
            "total_units": len(self.knowledge_base.units),
            "domains": list(self.knowledge_base.by_domain.keys()),
            "sources": list(self.knowledge_base.by_source.keys()),
            "avg_confidence": avg_confidence,
            "synthesis_rules": len(self.synthesizer.rules),
            "synthesis_count": self.synthesizer.synthesis_count,
            "conflict_resolutions": self.resolver.resolution_count,
            "phi_metric": avg_confidence * PHI,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[KnowledgeSynthesisEngine] = None

def get_knowledge_synthesis_engine() -> KnowledgeSynthesisEngine:
    """Get or create the singleton KnowledgeSynthesisEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = KnowledgeSynthesisEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-314 Knowledge Synthesis Protocol (Python) ===")
    
    engine = get_knowledge_synthesis_engine()
    
    # Add knowledge
    engine.add_knowledge("Python is a programming language", domain="programming")
    engine.add_knowledge("Python was created by Guido van Rossum", domain="programming")
    engine.add_knowledge("Python supports multiple paradigms", domain="programming")
    
    # Add synthesis rule
    engine.add_synthesis_rule(
        "combine_facts",
        ["fact1", "fact2"],
        "Combined: {input_0} AND {input_1}",
        "avg"
    )
    
    # Query
    results = engine.query("Python")
    print(f"Query results: {[r.content[:40] for r in results]}")
    
    # Synthesize
    synth = engine.synthesize_from_query("Python", "rule-0")
    if synth:
        print(f"Synthesized: {synth.content[:60]}")
    
    print(f"Report: {engine.coherence_report()}")
