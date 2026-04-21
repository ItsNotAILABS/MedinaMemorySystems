/**
 * Sub-SDK 3: Knowledge Graph
 * Build living knowledge graphs that evolve with understanding.
 */

export interface KnowledgeNode {
  id: string;
  label: string;
  type: string;
  properties: Record<string, unknown>;
  createdAt: number;
}

export interface KnowledgeEdge {
  id: string;
  from: string;
  to: string;
  relation: string;
  weight: number;
  properties: Record<string, unknown>;
  createdAt: number;
}

export interface KnowledgePath {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  totalWeight: number;
}

export class KnowledgeGraph {
  private nodes: Map<string, KnowledgeNode> = new Map();
  private edges: Map<string, KnowledgeEdge> = new Map();
  private adjacency: Map<string, string[]> = new Map();

  addNode(id: string, label: string, type: string, properties: Record<string, unknown> = {}): KnowledgeNode {
    const node: KnowledgeNode = { id, label, type, properties, createdAt: Date.now() };
    this.nodes.set(id, node);
    if (!this.adjacency.has(id)) this.adjacency.set(id, []);
    return node;
  }

  addEdge(from: string, to: string, relation: string, weight = 1.0, properties: Record<string, unknown> = {}): KnowledgeEdge {
    const id = `edge_${from}_${relation}_${to}`;
    const edge: KnowledgeEdge = { id, from, to, relation, weight, properties, createdAt: Date.now() };
    this.edges.set(id, edge);

    if (!this.adjacency.has(from)) this.adjacency.set(from, []);
    this.adjacency.get(from)!.push(to);
    return edge;
  }

  getNeighbors(nodeId: string): KnowledgeNode[] {
    const neighborIds = this.adjacency.get(nodeId) ?? [];
    return neighborIds.map(id => this.nodes.get(id)).filter(Boolean) as KnowledgeNode[];
  }

  getEdgesBetween(from: string, to: string): KnowledgeEdge[] {
    return Array.from(this.edges.values()).filter(e => e.from === from && e.to === to);
  }

  findByType(type: string): KnowledgeNode[] {
    return Array.from(this.nodes.values()).filter(n => n.type === type);
  }

  search(query: string): KnowledgeNode[] {
    const lower = query.toLowerCase();
    return Array.from(this.nodes.values()).filter(n =>
      n.label.toLowerCase().includes(lower) ||
      n.type.toLowerCase().includes(lower),
    );
  }

  getNode(id: string): KnowledgeNode | undefined {
    return this.nodes.get(id);
  }

  stats(): { nodes: number; edges: number; density: number } {
    const n = this.nodes.size;
    const e = this.edges.size;
    const maxEdges = n * (n - 1);
    return { nodes: n, edges: e, density: maxEdges > 0 ? e / maxEdges : 0 };
  }
}
