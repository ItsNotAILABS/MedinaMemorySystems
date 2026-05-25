"""
PROTO-308 — Episodic Encoding Protocol (Python)
Encodes experiences into episodic memory traces.

Charter: PROTO-308
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Tuple
from enum import Enum
import hashlib

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


class EpisodeType(Enum):
    EXPERIENCE = "experience"
    OBSERVATION = "observation"
    INTERACTION = "interaction"
    REFLECTION = "reflection"
    DREAM = "dream"


@dataclass
class ContextualBinding:
    """Binds episode to temporal/spatial context."""
    temporal_marker: float
    spatial_marker: Optional[str] = None
    emotional_state: float = 0.0
    attention_focus: str = ""
    concurrent_episodes: List[str] = field(default_factory=list)


@dataclass
class Episode:
    """A single episodic memory."""
    id: str
    content: Any
    episode_type: EpisodeType
    context: ContextualBinding
    encoding_strength: float = 1.0
    retrieval_count: int = 0
    last_retrieved: Optional[float] = None
    created_at: float = field(default_factory=time.time)
    tags: List[str] = field(default_factory=list)
    linked_episodes: List[str] = field(default_factory=list)
    
    def vividness(self) -> float:
        """Calculate episode vividness based on encoding factors."""
        emotional_boost = 1 + abs(self.context.emotional_state) * PHI_INV
        recency = 1.0
        if self.last_retrieved:
            age = time.time() - self.last_retrieved
            recency = math.exp(-age * PHI_INV * 0.0001)
        
        return self.encoding_strength * emotional_boost * recency * PHI_INV
    
    def decay(self, elapsed: float) -> None:
        """Apply forgetting to episode."""
        rate = PHI_INV * 0.001
        self.encoding_strength *= math.exp(-rate * elapsed)
    
    def reinforce(self, amount: float = 0.1) -> None:
        """Reinforce episode through retrieval."""
        self.retrieval_count += 1
        self.last_retrieved = time.time()
        self.encoding_strength = min(1.0, self.encoding_strength + amount * PHI_INV)


class EpisodicBuffer:
    """Buffer for recent episodes before consolidation."""
    
    def __init__(self, capacity: int = 20):
        self.capacity = capacity
        self.buffer: List[Episode] = []
    
    def add(self, episode: Episode) -> None:
        """Add episode to buffer."""
        if len(self.buffer) >= self.capacity:
            self._consolidate_oldest()
        self.buffer.append(episode)
    
    def _consolidate_oldest(self) -> Episode:
        """Remove and return oldest episode."""
        return self.buffer.pop(0)
    
    def get_recent(self, n: int = 5) -> List[Episode]:
        """Get n most recent episodes."""
        return self.buffer[-n:]
    
    def search_buffer(self, query: str) -> List[Episode]:
        """Search buffer by content/tags."""
        results = []
        query_lower = query.lower()
        for ep in self.buffer:
            content_str = str(ep.content).lower()
            if query_lower in content_str or any(query_lower in t.lower() for t in ep.tags):
                results.append(ep)
        return results


class EpisodicStore:
    """Long-term episodic memory store."""
    
    def __init__(self, max_episodes: int = 100000):
        self.episodes: Dict[str, Episode] = {}
        self.max_episodes = max_episodes
        self.temporal_index: Dict[int, List[str]] = {}  # Hour -> episode IDs
        self.tag_index: Dict[str, List[str]] = {}
    
    def store(self, episode: Episode) -> None:
        """Store episode in long-term memory."""
        if len(self.episodes) >= self.max_episodes:
            self._forget_weakest()
        
        self.episodes[episode.id] = episode
        
        # Index by time
        hour = int(episode.created_at / 3600)
        if hour not in self.temporal_index:
            self.temporal_index[hour] = []
        self.temporal_index[hour].append(episode.id)
        
        # Index by tags
        for tag in episode.tags:
            if tag not in self.tag_index:
                self.tag_index[tag] = []
            self.tag_index[tag].append(episode.id)
    
    def retrieve(self, episode_id: str) -> Optional[Episode]:
        """Retrieve episode by ID."""
        episode = self.episodes.get(episode_id)
        if episode:
            episode.reinforce()
        return episode
    
    def search_by_time(self, start: float, end: float) -> List[Episode]:
        """Search episodes by time range."""
        results = []
        for ep in self.episodes.values():
            if start <= ep.created_at <= end:
                results.append(ep)
        return sorted(results, key=lambda e: e.created_at)
    
    def search_by_tag(self, tag: str) -> List[Episode]:
        """Search episodes by tag."""
        episode_ids = self.tag_index.get(tag, [])
        return [self.episodes[eid] for eid in episode_ids if eid in self.episodes]
    
    def _forget_weakest(self) -> int:
        """Forget weakest episodes."""
        sorted_eps = sorted(
            self.episodes.values(),
            key=lambda e: e.vividness()
        )
        
        to_forget = int(len(sorted_eps) * PHI_INV * 0.1)
        for ep in sorted_eps[:to_forget]:
            del self.episodes[ep.id]
            
            # Clean indices
            for tag in ep.tags:
                if tag in self.tag_index and ep.id in self.tag_index[tag]:
                    self.tag_index[tag].remove(ep.id)
        
        return to_forget


class EpisodicEncodingEngine:
    """
    Main engine for episodic memory encoding with φ-coherent processing.
    """
    
    def __init__(self):
        self.buffer = EpisodicBuffer()
        self.store = EpisodicStore()
        self.current_context = ContextualBinding(temporal_marker=time.time())
        self.beat_count = 0
        self.encoding_count = 0
    
    def update_context(self, spatial: Optional[str] = None,
                      emotional: Optional[float] = None,
                      focus: Optional[str] = None) -> None:
        """Update current contextual binding."""
        self.current_context.temporal_marker = time.time()
        if spatial:
            self.current_context.spatial_marker = spatial
        if emotional is not None:
            self.current_context.emotional_state = emotional
        if focus:
            self.current_context.attention_focus = focus
    
    def encode(self, content: Any, episode_type: EpisodeType = EpisodeType.EXPERIENCE,
              tags: Optional[List[str]] = None, emotional_salience: float = 0.0) -> Episode:
        """Encode a new episode."""
        self.encoding_count += 1
        
        # Create context copy
        context = ContextualBinding(
            temporal_marker=time.time(),
            spatial_marker=self.current_context.spatial_marker,
            emotional_state=emotional_salience or self.current_context.emotional_state,
            attention_focus=self.current_context.attention_focus
        )
        
        episode = Episode(
            id=f"ep-{self.encoding_count}-{hashlib.md5(str(content).encode()).hexdigest()[:6]}",
            content=content,
            episode_type=episode_type,
            context=context,
            encoding_strength=1.0 + abs(emotional_salience) * PHI_INV,
            tags=tags or []
        )
        
        # Link to recent episodes
        recent = self.buffer.get_recent(3)
        for r in recent:
            episode.linked_episodes.append(r.id)
            r.linked_episodes.append(episode.id)
        
        self.buffer.add(episode)
        return episode
    
    def consolidate(self) -> int:
        """Consolidate buffer to long-term store."""
        consolidated = 0
        
        # Move strong episodes to store
        to_consolidate = [ep for ep in self.buffer.buffer 
                         if ep.encoding_strength >= PHI_INV]
        
        for ep in to_consolidate:
            self.store.store(ep)
            self.buffer.buffer.remove(ep)
            consolidated += 1
        
        return consolidated
    
    def recall_by_cue(self, cue: str, limit: int = 10) -> List[Episode]:
        """Recall episodes by a cue."""
        results = []
        
        # Search buffer first
        buffer_results = self.buffer.search_buffer(cue)
        results.extend(buffer_results)
        
        # Search store
        store_results = self.store.search_by_tag(cue)
        results.extend(store_results)
        
        # Search by content
        cue_lower = cue.lower()
        for ep in self.store.episodes.values():
            if ep not in results and cue_lower in str(ep.content).lower():
                results.append(ep)
        
        # Sort by vividness
        results.sort(key=lambda e: e.vividness(), reverse=True)
        
        # Reinforce retrieved episodes
        for ep in results[:limit]:
            ep.reinforce()
        
        return results[:limit]
    
    def recall_by_time(self, start: float, end: float) -> List[Episode]:
        """Recall episodes from a time period."""
        return self.store.search_by_time(start, end)
    
    def get_timeline(self, n: int = 20) -> List[Episode]:
        """Get recent timeline of episodes."""
        all_episodes = list(self.buffer.buffer) + list(self.store.episodes.values())
        sorted_eps = sorted(all_episodes, key=lambda e: e.created_at, reverse=True)
        return sorted_eps[:n]
    
    def tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        # Decay episodes
        for ep in self.buffer.buffer:
            ep.decay(elapsed)
        for ep in self.store.episodes.values():
            ep.decay(elapsed)
        
        # Periodic consolidation
        consolidated = 0
        if self.beat_count % int(PHI * 100) == 0:
            consolidated = self.consolidate()
        
        return {
            "beat": self.beat_count,
            "buffer_count": len(self.buffer.buffer),
            "store_count": len(self.store.episodes),
            "encoding_count": self.encoding_count,
            "consolidated": consolidated,
            "phi_coherence": len(self.store.episodes) * PHI_INV / 1000,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate episodic memory report."""
        all_episodes = list(self.buffer.buffer) + list(self.store.episodes.values())
        avg_vividness = sum(e.vividness() for e in all_episodes) / max(1, len(all_episodes))
        
        return {
            "buffer_episodes": len(self.buffer.buffer),
            "stored_episodes": len(self.store.episodes),
            "total_encoded": self.encoding_count,
            "avg_vividness": avg_vividness,
            "unique_tags": len(self.store.tag_index),
            "phi_metric": avg_vividness * PHI,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[EpisodicEncodingEngine] = None

def get_episodic_encoding_engine() -> EpisodicEncodingEngine:
    """Get or create the singleton EpisodicEncodingEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = EpisodicEncodingEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-308 Episodic Encoding Protocol (Python) ===")
    
    engine = get_episodic_encoding_engine()
    
    # Update context
    engine.update_context(spatial="office", emotional=0.5, focus="coding")
    
    # Encode episodes
    ep1 = engine.encode("Started working on new feature", tags=["work", "coding"])
    ep2 = engine.encode("Coffee break with team", episode_type=EpisodeType.INTERACTION,
                       tags=["social", "break"], emotional_salience=0.7)
    ep3 = engine.encode("Fixed critical bug", tags=["work", "success"], emotional_salience=0.8)
    
    print(f"Encoded episodes: {ep1.id}, {ep2.id}, {ep3.id}")
    
    # Recall
    recalled = engine.recall_by_cue("work")
    print(f"Recalled by 'work': {[e.id for e in recalled]}")
    
    # Timeline
    timeline = engine.get_timeline(5)
    print(f"Timeline: {[e.content[:30] for e in timeline]}")
    
    print(f"Report: {engine.coherence_report()}")
