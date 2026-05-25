"""
PROTO-301 — Cognitive Graph Protocol (Python)
Graph-based cognitive structure for MEDINA Memory Systems.

Charter: PROTO-301
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple
from collections import defaultdict

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


@dataclass
class CognitiveNode:
    """A node in the cognitive graph representing a concept or memory."""
    id: str
    label: str
    activation: float = 1.0
    decay_rate: float = field(default_factory=lambda: PHI_INV * 0.1)
    created_at: float = field(default_factory=time.time)
    last_accessed: float = field(default_factory=time.time)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def activate(self, strength: float = 1.0) -> None:
        """Boost activation level."""
        self.activation = min(1.0, self.activation + strength * PHI_INV)
        self.last_accessed = time.time()
    
    def decay(self, elapsed: float) -> None:
        """Apply time-based decay."""
        self.activation *= math.exp(-self.decay_rate * elapsed * PHI_INV)
    
    def salience(self) -> float:
        """Calculate node salience based on activation and recency."""
        age = time.time() - self.last_accessed
        recency = math.exp(-age * PHI_INV * 0.001)
        return self.activation * recency * PHI


@dataclass
class CognitiveEdge:
    """A weighted edge connecting two cognitive nodes."""
    source_id: str
    target_id: str
    weight: float = 1.0
    edge_type: str = "association"
    created_at: float = field(default_factory=time.time)
    access_count: int = 0
    
    def strengthen(self, delta: float = 0.1) -> None:
        """Strengthen the connection (Hebbian learning)."""
        self.weight = min(PHI, self.weight + delta * PHI_INV)
        self.access_count += 1
    
    def weaken(self, delta: float = 0.05) -> None:
        """Weaken the connection."""
        self.weight = max(0.01, self.weight - delta)


class CognitiveGraph:
    """
    A graph structure for cognitive processing with φ-coherent dynamics.
    """
    
    def __init__(self, max_nodes: int = 10000):
        self.nodes: Dict[str, CognitiveNode] = {}
        self.edges: Dict[Tuple[str, str], CognitiveEdge] = {}
        self.adjacency: Dict[str, Set[str]] = defaultdict(set)
        self.max_nodes = max_nodes
        self.global_activation = 1.0
        self.beat_count = 0
    
    def add_node(self, id: str, label: str, **metadata) -> CognitiveNode:
        """Add a new cognitive node."""
        if len(self.nodes) >= self.max_nodes:
            self._prune_inactive()
        
        node = CognitiveNode(id=id, label=label, metadata=metadata)
        self.nodes[id] = node
        return node
    
    def add_edge(self, source_id: str, target_id: str, 
                 weight: float = 1.0, edge_type: str = "association") -> Optional[CognitiveEdge]:
        """Add or strengthen an edge between nodes."""
        if source_id not in self.nodes or target_id not in self.nodes:
            return None
        
        key = (source_id, target_id)
        if key in self.edges:
            self.edges[key].strengthen()
            return self.edges[key]
        
        edge = CognitiveEdge(source_id, target_id, weight, edge_type)
        self.edges[key] = edge
        self.adjacency[source_id].add(target_id)
        return edge
    
    def spread_activation(self, source_id: str, depth: int = 3, 
                         decay: float = PHI_INV) -> Dict[str, float]:
        """Spread activation from a source node through the graph."""
        if source_id not in self.nodes:
            return {}
        
        activations = {source_id: 1.0}
        frontier = {source_id}
        
        for d in range(depth):
            next_frontier = set()
            for node_id in frontier:
                current_activation = activations[node_id]
                for neighbor_id in self.adjacency[node_id]:
                    edge_key = (node_id, neighbor_id)
                    if edge_key in self.edges:
                        edge = self.edges[edge_key]
                        propagated = current_activation * edge.weight * decay
                        if neighbor_id in activations:
                            activations[neighbor_id] = max(activations[neighbor_id], propagated)
                        else:
                            activations[neighbor_id] = propagated
                        next_frontier.add(neighbor_id)
            frontier = next_frontier
        
        # Apply activations to nodes
        for node_id, activation in activations.items():
            self.nodes[node_id].activate(activation)
        
        return activations
    
    def find_path(self, start_id: str, end_id: str, 
                  max_length: int = 10) -> Optional[List[str]]:
        """Find shortest path between two nodes using BFS."""
        if start_id not in self.nodes or end_id not in self.nodes:
            return None
        
        if start_id == end_id:
            return [start_id]
        
        visited = {start_id}
        queue = [(start_id, [start_id])]
        
        while queue and len(queue[0][1]) <= max_length:
            current, path = queue.pop(0)
            for neighbor in self.adjacency[current]:
                if neighbor == end_id:
                    return path + [neighbor]
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, path + [neighbor]))
        
        return None
    
    def cluster_coefficient(self, node_id: str) -> float:
        """Calculate local clustering coefficient for a node."""
        neighbors = list(self.adjacency[node_id])
        k = len(neighbors)
        if k < 2:
            return 0.0
        
        edges_between = 0
        for i, n1 in enumerate(neighbors):
            for n2 in neighbors[i+1:]:
                if (n1, n2) in self.edges or (n2, n1) in self.edges:
                    edges_between += 1
        
        max_edges = k * (k - 1) / 2
        return edges_between / max_edges if max_edges > 0 else 0.0
    
    def get_central_nodes(self, k: int = 10) -> List[Tuple[str, float]]:
        """Get top-k most central nodes by degree centrality."""
        centrality = [
            (node_id, len(self.adjacency[node_id]) / max(1, len(self.nodes) - 1))
            for node_id in self.nodes
        ]
        centrality.sort(key=lambda x: x[1], reverse=True)
        return centrality[:k]
    
    def _prune_inactive(self) -> int:
        """Remove least active nodes when at capacity."""
        nodes_by_salience = sorted(
            self.nodes.items(),
            key=lambda x: x[1].salience()
        )
        
        to_remove = len(self.nodes) - int(self.max_nodes * PHI_INV)
        removed = 0
        
        for node_id, _ in nodes_by_salience[:to_remove]:
            self._remove_node(node_id)
            removed += 1
        
        return removed
    
    def _remove_node(self, node_id: str) -> None:
        """Remove a node and its edges."""
        if node_id not in self.nodes:
            return
        
        del self.nodes[node_id]
        
        # Remove edges
        edges_to_remove = [
            key for key in self.edges 
            if node_id in key
        ]
        for key in edges_to_remove:
            del self.edges[key]
        
        # Update adjacency
        del self.adjacency[node_id]
        for neighbors in self.adjacency.values():
            neighbors.discard(node_id)
    
    def tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one time step of the cognitive graph."""
        self.beat_count += 1
        
        # Apply decay to all nodes
        for node in self.nodes.values():
            node.decay(elapsed)
        
        # Update global activation
        if self.nodes:
            self.global_activation = sum(
                n.activation for n in self.nodes.values()
            ) / len(self.nodes)
        
        return {
            "beat": self.beat_count,
            "node_count": len(self.nodes),
            "edge_count": len(self.edges),
            "global_activation": self.global_activation,
            "phi_coherence": self.global_activation * PHI,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate a coherence report for the cognitive graph."""
        avg_clustering = 0.0
        if self.nodes:
            avg_clustering = sum(
                self.cluster_coefficient(nid) for nid in self.nodes
            ) / len(self.nodes)
        
        return {
            "nodes": len(self.nodes),
            "edges": len(self.edges),
            "global_activation": self.global_activation,
            "avg_clustering": avg_clustering,
            "central_nodes": self.get_central_nodes(5),
            "phi_metric": self.global_activation * avg_clustering * PHI,
            "beat": self.beat_count,
            "timestamp": time.time()
        }


class CognitiveGraphEngine:
    """
    Engine for managing multiple cognitive graphs with φ-harmonic coordination.
    """
    
    def __init__(self):
        self.graphs: Dict[str, CognitiveGraph] = {}
        self.active_graph: Optional[str] = None
        self.history: List[Dict[str, Any]] = []
    
    def create_graph(self, name: str, max_nodes: int = 10000) -> CognitiveGraph:
        """Create a new cognitive graph."""
        graph = CognitiveGraph(max_nodes)
        self.graphs[name] = graph
        if self.active_graph is None:
            self.active_graph = name
        return graph
    
    def get_graph(self, name: str) -> Optional[CognitiveGraph]:
        """Get a cognitive graph by name."""
        return self.graphs.get(name)
    
    def switch_graph(self, name: str) -> bool:
        """Switch the active cognitive graph."""
        if name in self.graphs:
            self.active_graph = name
            return True
        return False
    
    def merge_graphs(self, source: str, target: str, 
                    weight_factor: float = PHI_INV) -> bool:
        """Merge source graph into target graph."""
        if source not in self.graphs or target not in self.graphs:
            return False
        
        src = self.graphs[source]
        tgt = self.graphs[target]
        
        # Copy nodes
        for node_id, node in src.nodes.items():
            if node_id not in tgt.nodes:
                tgt.add_node(node_id, node.label, **node.metadata)
        
        # Copy edges with weight adjustment
        for (s, t), edge in src.edges.items():
            tgt.add_edge(s, t, edge.weight * weight_factor, edge.edge_type)
        
        return True
    
    def global_tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one time step for all graphs."""
        results = {}
        for name, graph in self.graphs.items():
            results[name] = graph.tick(elapsed)
        
        self.history.append({
            "timestamp": time.time(),
            "results": results
        })
        
        return results


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[CognitiveGraphEngine] = None

def get_cognitive_graph_engine() -> CognitiveGraphEngine:
    """Get or create the singleton CognitiveGraphEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = CognitiveGraphEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-301 Cognitive Graph Protocol (Python) ===")
    
    engine = get_cognitive_graph_engine()
    graph = engine.create_graph("main")
    
    # Add nodes
    graph.add_node("concept_1", "Memory", category="episodic")
    graph.add_node("concept_2", "Learning", category="semantic")
    graph.add_node("concept_3", "Attention", category="cognitive")
    graph.add_node("concept_4", "Processing", category="executive")
    
    # Add edges
    graph.add_edge("concept_1", "concept_2", 0.8)
    graph.add_edge("concept_2", "concept_3", 0.9)
    graph.add_edge("concept_3", "concept_4", 0.7)
    graph.add_edge("concept_1", "concept_4", 0.5)
    
    # Spread activation
    activations = graph.spread_activation("concept_1")
    print(f"Activations from concept_1: {activations}")
    
    # Find path
    path = graph.find_path("concept_1", "concept_4")
    print(f"Path: {path}")
    
    # Report
    report = graph.coherence_report()
    print(f"Coherence Report: {report}")
