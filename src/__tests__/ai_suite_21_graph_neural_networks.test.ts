/**
 * AI Suite 21 — Graph Neural Networks
 * ============================================================
 * Message passing, node embeddings, edge aggregation,
 * graph convolutions, attention mechanisms, pooling operations,
 * φ-coherent graph metrics, and GNN invariants.
 *
 * Target: 100 tests   Charter: AIS-GNN-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Graph Data Structures ────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  features: number[];
  embedding: number[];
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  features: number[];
}

interface Graph {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  directed: boolean;
}

// ─── Implementations ──────────────────────────────────────────────────────────

function createNode(id: string, features: number[]): GraphNode {
  return { id, features, embedding: [...features] };
}

function createGraph(directed: boolean = false): Graph {
  return { nodes: new Map(), edges: [], directed };
}

function addNode(graph: Graph, node: GraphNode): Graph {
  const newNodes = new Map(graph.nodes);
  newNodes.set(node.id, node);
  return { ...graph, nodes: newNodes };
}

function addEdge(graph: Graph, source: string, target: string, weight: number = 1, features: number[] = []): Graph {
  const edge: GraphEdge = { source, target, weight, features };
  return { ...graph, edges: [...graph.edges, edge] };
}

function getNeighbors(graph: Graph, nodeId: string): string[] {
  const neighbors = new Set<string>();
  for (const edge of graph.edges) {
    if (edge.source === nodeId) neighbors.add(edge.target);
    if (!graph.directed && edge.target === nodeId) neighbors.add(edge.source);
  }
  return Array.from(neighbors);
}

function nodeDegree(graph: Graph, nodeId: string): number {
  return getNeighbors(graph, nodeId).length;
}

function messagePass(graph: Graph, nodeId: string, aggregator: (msgs: number[][]) => number[]): number[] {
  const neighbors = getNeighbors(graph, nodeId);
  const messages = neighbors.map(nId => graph.nodes.get(nId)?.embedding || []);
  return aggregator(messages);
}

function sumAggregator(messages: number[][]): number[] {
  if (messages.length === 0) return [];
  const result = new Array(messages[0].length).fill(0);
  for (const msg of messages) {
    for (let i = 0; i < msg.length; i++) result[i] += msg[i];
  }
  return result;
}

function meanAggregator(messages: number[][]): number[] {
  if (messages.length === 0) return [];
  const sum = sumAggregator(messages);
  return sum.map(v => v / messages.length);
}

function maxAggregator(messages: number[][]): number[] {
  if (messages.length === 0) return [];
  const result = [...messages[0]];
  for (let i = 1; i < messages.length; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = Math.max(result[j], messages[i][j]);
    }
  }
  return result;
}

function relu(x: number): number {
  return Math.max(0, x);
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) sum += a[i] * b[i];
  return sum;
}

function normalize(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return norm > 0 ? vec.map(v => v / norm) : vec;
}

function graphConvolution(graph: Graph, weights: number[][]): Graph {
  const newNodes = new Map<string, GraphNode>();
  for (const [id, node] of graph.nodes) {
    const agg = messagePass(graph, id, sumAggregator);
    const combined = node.embedding.map((v, i) => v + (agg[i] || 0));
    const newEmb = weights.length > 0 
      ? combined.map((_, i) => dotProduct(combined, weights[i] || []))
      : combined;
    newNodes.set(id, { ...node, embedding: newEmb.map(relu) });
  }
  return { ...graph, nodes: newNodes };
}

function attentionScore(query: number[], key: number[]): number {
  const d = Math.sqrt(query.length);
  return dotProduct(query, key) / (d || 1);
}

function softmax(values: number[]): number[] {
  const maxVal = Math.max(...values);
  const exps = values.map(v => Math.exp(v - maxVal));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
}

function graphAttention(graph: Graph, nodeId: string): number[] {
  const node = graph.nodes.get(nodeId);
  if (!node) return [];
  const neighbors = getNeighbors(graph, nodeId);
  if (neighbors.length === 0) return node.embedding;
  
  const scores = neighbors.map(nId => {
    const neighbor = graph.nodes.get(nId);
    return neighbor ? attentionScore(node.embedding, neighbor.embedding) : 0;
  });
  const attnWeights = softmax(scores);
  
  const result = new Array(node.embedding.length).fill(0);
  neighbors.forEach((nId, i) => {
    const neighbor = graph.nodes.get(nId);
    if (neighbor) {
      for (let j = 0; j < result.length; j++) {
        result[j] += attnWeights[i] * neighbor.embedding[j];
      }
    }
  });
  return result;
}

function globalMeanPool(graph: Graph): number[] {
  const embeddings = Array.from(graph.nodes.values()).map(n => n.embedding);
  return meanAggregator(embeddings);
}

function globalMaxPool(graph: Graph): number[] {
  const embeddings = Array.from(graph.nodes.values()).map(n => n.embedding);
  return maxAggregator(embeddings);
}

function globalSumPool(graph: Graph): number[] {
  const embeddings = Array.from(graph.nodes.values()).map(n => n.embedding);
  return sumAggregator(embeddings);
}

function phiGraphMetric(graph: Graph): number {
  const n = graph.nodes.size;
  const e = graph.edges.length;
  return (n * PHI + e) / (PHI * PHI);
}

function graphDensity(graph: Graph): number {
  const n = graph.nodes.size;
  if (n < 2) return 0;
  const maxEdges = graph.directed ? n * (n - 1) : n * (n - 1) / 2;
  return graph.edges.length / maxEdges;
}

function averageDegree(graph: Graph): number {
  if (graph.nodes.size === 0) return 0;
  let totalDegree = 0;
  for (const [id] of graph.nodes) {
    totalDegree += nodeDegree(graph, id);
  }
  return totalDegree / graph.nodes.size;
}

function graphDiameter(graph: Graph): number {
  // BFS-based diameter for small graphs
  let maxDist = 0;
  for (const [startId] of graph.nodes) {
    const dist = new Map<string, number>();
    dist.set(startId, 0);
    const queue = [startId];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      const currDist = dist.get(curr)!;
      for (const neighbor of getNeighbors(graph, curr)) {
        if (!dist.has(neighbor)) {
          dist.set(neighbor, currDist + 1);
          queue.push(neighbor);
          maxDist = Math.max(maxDist, currDist + 1);
        }
      }
    }
  }
  return maxDist;
}

function isConnected(graph: Graph): boolean {
  if (graph.nodes.size === 0) return true;
  const visited = new Set<string>();
  const start = graph.nodes.keys().next().value;
  const queue = [start];
  visited.add(start);
  while (queue.length > 0) {
    const curr = queue.shift()!;
    for (const neighbor of getNeighbors(graph, curr)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return visited.size === graph.nodes.size;
}

function clusteringCoefficient(graph: Graph, nodeId: string): number {
  const neighbors = getNeighbors(graph, nodeId);
  if (neighbors.length < 2) return 0;
  let triangles = 0;
  for (let i = 0; i < neighbors.length; i++) {
    for (let j = i + 1; j < neighbors.length; j++) {
      const n1Neighbors = getNeighbors(graph, neighbors[i]);
      if (n1Neighbors.includes(neighbors[j])) triangles++;
    }
  }
  const possibleTriangles = neighbors.length * (neighbors.length - 1) / 2;
  return triangles / possibleTriangles;
}

// ─── SECTION 1: Graph creation ────────────────────────────────────────────────
describe('GNN § 1 — Graph creation', () => {
  test('createNode sets id', () => {
    expect(createNode('a', [1, 2]).id).toBe('a');
  });
  test('createNode sets features', () => {
    expect(createNode('a', [1, 2]).features).toEqual([1, 2]);
  });
  test('createNode initializes embedding from features', () => {
    expect(createNode('a', [1, 2]).embedding).toEqual([1, 2]);
  });
  test('createGraph creates empty graph', () => {
    expect(createGraph().nodes.size).toBe(0);
  });
  test('createGraph default undirected', () => {
    expect(createGraph().directed).toBe(false);
  });
  test('createGraph directed flag', () => {
    expect(createGraph(true).directed).toBe(true);
  });
  test('addNode increases size', () => {
    const g = addNode(createGraph(), createNode('a', [1]));
    expect(g.nodes.size).toBe(1);
  });
  test('addNode is immutable', () => {
    const g1 = createGraph();
    const g2 = addNode(g1, createNode('a', [1]));
    expect(g1.nodes.size).toBe(0);
    expect(g2.nodes.size).toBe(1);
  });
  test('addEdge adds edge', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [2]));
    g = addEdge(g, 'a', 'b');
    expect(g.edges.length).toBe(1);
  });
  test('addEdge sets weight', () => {
    let g = addEdge(createGraph(), 'a', 'b', 0.5);
    expect(g.edges[0].weight).toBe(0.5);
  });
});

// ─── SECTION 2: Neighbor operations ───────────────────────────────────────────
describe('GNN § 2 — Neighbors', () => {
  let g: Graph;
  beforeEach(() => {
    g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [2]));
    g = addNode(g, createNode('c', [3]));
    g = addEdge(g, 'a', 'b');
    g = addEdge(g, 'a', 'c');
  });

  test('getNeighbors returns outgoing', () => {
    expect(getNeighbors(g, 'a').sort()).toEqual(['b', 'c']);
  });
  test('getNeighbors undirected returns incoming', () => {
    expect(getNeighbors(g, 'b')).toContain('a');
  });
  test('nodeDegree counts neighbors', () => {
    expect(nodeDegree(g, 'a')).toBe(2);
  });
  test('isolated node has degree 0', () => {
    g = addNode(g, createNode('d', [4]));
    expect(nodeDegree(g, 'd')).toBe(0);
  });
  test('directed graph respects direction', () => {
    let dg = createGraph(true);
    dg = addNode(dg, createNode('a', [1]));
    dg = addNode(dg, createNode('b', [2]));
    dg = addEdge(dg, 'a', 'b');
    expect(getNeighbors(dg, 'a')).toContain('b');
    expect(getNeighbors(dg, 'b')).not.toContain('a');
  });
  test('self-loop counted', () => {
    g = addEdge(g, 'a', 'a');
    expect(getNeighbors(g, 'a')).toContain('a');
  });
  test('multiple edges same pair', () => {
    g = addEdge(g, 'a', 'b');
    expect(getNeighbors(g, 'a').filter(n => n === 'b').length).toBeLessThanOrEqual(1);
  });
  test('neighbors of non-existent node', () => {
    expect(getNeighbors(g, 'z')).toEqual([]);
  });
});

// ─── SECTION 3: Message passing ───────────────────────────────────────────────
describe('GNN § 3 — Message passing', () => {
  let g: Graph;
  beforeEach(() => {
    g = createGraph();
    g = addNode(g, createNode('a', [1, 0]));
    g = addNode(g, createNode('b', [0, 1]));
    g = addNode(g, createNode('c', [1, 1]));
    g = addEdge(g, 'a', 'b');
    g = addEdge(g, 'a', 'c');
  });

  test('sumAggregator sums messages', () => {
    expect(sumAggregator([[1, 2], [3, 4]])).toEqual([4, 6]);
  });
  test('sumAggregator empty', () => {
    expect(sumAggregator([])).toEqual([]);
  });
  test('meanAggregator averages', () => {
    expect(meanAggregator([[2, 4], [4, 6]])).toEqual([3, 5]);
  });
  test('maxAggregator takes max', () => {
    expect(maxAggregator([[1, 5], [3, 2]])).toEqual([3, 5]);
  });
  test('messagePass with sum', () => {
    const msg = messagePass(g, 'a', sumAggregator);
    expect(msg).toEqual([1, 2]);
  });
  test('messagePass isolated node', () => {
    g = addNode(g, createNode('d', [5, 5]));
    expect(messagePass(g, 'd', sumAggregator)).toEqual([]);
  });
  test('messagePass with mean', () => {
    const msg = messagePass(g, 'a', meanAggregator);
    expect(msg).toEqual([0.5, 1]);
  });
  test('messagePass with max', () => {
    const msg = messagePass(g, 'a', maxAggregator);
    expect(msg).toEqual([1, 1]);
  });
});

// ─── SECTION 4: Activation functions ──────────────────────────────────────────
describe('GNN § 4 — Activations', () => {
  test('relu positive unchanged', () => expect(relu(5)).toBe(5));
  test('relu negative → 0', () => expect(relu(-3)).toBe(0));
  test('relu zero → 0', () => expect(relu(0)).toBe(0));
  test('sigmoid(0) = 0.5', () => expect(sigmoid(0)).toBeCloseTo(0.5));
  test('sigmoid large positive → 1', () => expect(sigmoid(10)).toBeCloseTo(1, 2));
  test('sigmoid large negative → 0', () => expect(sigmoid(-10)).toBeCloseTo(0, 2));
  test('dotProduct calculation', () => expect(dotProduct([1, 2], [3, 4])).toBe(11));
  test('dotProduct empty', () => expect(dotProduct([], [])).toBe(0));
  test('normalize unit vector', () => {
    const n = normalize([3, 4]);
    expect(n[0]).toBeCloseTo(0.6);
    expect(n[1]).toBeCloseTo(0.8);
  });
  test('normalize zero vector', () => expect(normalize([0, 0])).toEqual([0, 0]));
});

// ─── SECTION 5: Graph convolution ─────────────────────────────────────────────
describe('GNN § 5 — Graph convolution', () => {
  let g: Graph;
  beforeEach(() => {
    g = createGraph();
    g = addNode(g, createNode('a', [1, 0]));
    g = addNode(g, createNode('b', [0, 1]));
    g = addEdge(g, 'a', 'b');
  });

  test('graphConvolution updates embeddings', () => {
    const g2 = graphConvolution(g, []);
    expect(g2.nodes.get('a')?.embedding).not.toEqual(g.nodes.get('a')?.embedding);
  });
  test('graphConvolution applies relu', () => {
    const g2 = graphConvolution(g, []);
    const emb = g2.nodes.get('a')?.embedding || [];
    expect(emb.every(v => v >= 0)).toBe(true);
  });
  test('graphConvolution is immutable', () => {
    const orig = g.nodes.get('a')?.embedding;
    graphConvolution(g, []);
    expect(g.nodes.get('a')?.embedding).toEqual(orig);
  });
  test('multiple conv layers', () => {
    let g2 = graphConvolution(g, []);
    g2 = graphConvolution(g2, []);
    expect(g2.nodes.get('a')?.embedding).toBeDefined();
  });
  test('conv preserves graph structure', () => {
    const g2 = graphConvolution(g, []);
    expect(g2.edges.length).toBe(g.edges.length);
    expect(g2.nodes.size).toBe(g.nodes.size);
  });
});

// ─── SECTION 6: Attention mechanism ───────────────────────────────────────────
describe('GNN § 6 — Graph attention', () => {
  test('attentionScore symmetric', () => {
    const s1 = attentionScore([1, 2], [3, 4]);
    const s2 = attentionScore([3, 4], [1, 2]);
    expect(s1).toBeCloseTo(s2);
  });
  test('softmax sums to 1', () => {
    const s = softmax([1, 2, 3]);
    expect(s.reduce((a, b) => a + b)).toBeCloseTo(1);
  });
  test('softmax all equal → uniform', () => {
    const s = softmax([1, 1, 1]);
    expect(s[0]).toBeCloseTo(s[1]);
    expect(s[1]).toBeCloseTo(s[2]);
  });
  test('softmax max gets highest weight', () => {
    const s = softmax([1, 5, 2]);
    expect(s[1]).toBeGreaterThan(s[0]);
    expect(s[1]).toBeGreaterThan(s[2]);
  });
  test('graphAttention returns embedding', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1, 2]));
    g = addNode(g, createNode('b', [3, 4]));
    g = addEdge(g, 'a', 'b');
    const attn = graphAttention(g, 'a');
    expect(attn.length).toBe(2);
  });
  test('graphAttention isolated node returns self', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1, 2]));
    expect(graphAttention(g, 'a')).toEqual([1, 2]);
  });
  test('graphAttention non-existent node', () => {
    expect(graphAttention(createGraph(), 'z')).toEqual([]);
  });
  test('attention weights are valid probabilities', () => {
    const weights = softmax([0.5, 1.5, 2.5]);
    expect(weights.every(w => w >= 0 && w <= 1)).toBe(true);
  });
});

// ─── SECTION 7: Pooling operations ────────────────────────────────────────────
describe('GNN § 7 — Pooling', () => {
  let g: Graph;
  beforeEach(() => {
    g = createGraph();
    g = addNode(g, createNode('a', [1, 2]));
    g = addNode(g, createNode('b', [3, 4]));
    g = addNode(g, createNode('c', [5, 6]));
  });

  test('globalMeanPool averages', () => {
    const pool = globalMeanPool(g);
    expect(pool[0]).toBeCloseTo(3);
    expect(pool[1]).toBeCloseTo(4);
  });
  test('globalMaxPool takes max', () => {
    expect(globalMaxPool(g)).toEqual([5, 6]);
  });
  test('globalSumPool sums', () => {
    expect(globalSumPool(g)).toEqual([9, 12]);
  });
  test('pool empty graph', () => {
    expect(globalMeanPool(createGraph())).toEqual([]);
  });
  test('pool single node', () => {
    let g2 = createGraph();
    g2 = addNode(g2, createNode('x', [7, 8]));
    expect(globalMeanPool(g2)).toEqual([7, 8]);
  });
  test('pooling reduces dimensionality', () => {
    const pool = globalMeanPool(g);
    expect(pool.length).toBe(2);
  });
});

// ─── SECTION 8: Graph metrics ─────────────────────────────────────────────────
describe('GNN § 8 — Graph metrics', () => {
  let g: Graph;
  beforeEach(() => {
    g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [1]));
    g = addNode(g, createNode('c', [1]));
    g = addEdge(g, 'a', 'b');
    g = addEdge(g, 'b', 'c');
  });

  test('phiGraphMetric positive', () => {
    expect(phiGraphMetric(g)).toBeGreaterThan(0);
  });
  test('phiGraphMetric uses phi', () => {
    const m = phiGraphMetric(g);
    expect(m).toBeCloseTo((3 * PHI + 2) / (PHI * PHI));
  });
  test('graphDensity range [0,1]', () => {
    const d = graphDensity(g);
    expect(d).toBeGreaterThanOrEqual(0);
    expect(d).toBeLessThanOrEqual(1);
  });
  test('complete graph density = 1', () => {
    g = addEdge(g, 'a', 'c');
    expect(graphDensity(g)).toBeCloseTo(1);
  });
  test('averageDegree calculation', () => {
    expect(averageDegree(g)).toBeCloseTo(4/3);
  });
  test('empty graph density = 0', () => {
    expect(graphDensity(createGraph())).toBe(0);
  });
  test('single node density = 0', () => {
    let g2 = createGraph();
    g2 = addNode(g2, createNode('x', [1]));
    expect(graphDensity(g2)).toBe(0);
  });
});

// ─── SECTION 9: Graph connectivity ────────────────────────────────────────────
describe('GNN § 9 — Connectivity', () => {
  test('isConnected linear graph', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [1]));
    g = addEdge(g, 'a', 'b');
    expect(isConnected(g)).toBe(true);
  });
  test('isConnected disconnected', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [1]));
    expect(isConnected(g)).toBe(false);
  });
  test('isConnected empty graph', () => {
    expect(isConnected(createGraph())).toBe(true);
  });
  test('graphDiameter linear', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [1]));
    g = addNode(g, createNode('c', [1]));
    g = addEdge(g, 'a', 'b');
    g = addEdge(g, 'b', 'c');
    expect(graphDiameter(g)).toBe(2);
  });
  test('graphDiameter star', () => {
    let g = createGraph();
    g = addNode(g, createNode('center', [1]));
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [1]));
    g = addEdge(g, 'center', 'a');
    g = addEdge(g, 'center', 'b');
    expect(graphDiameter(g)).toBe(2);
  });
  test('single node diameter = 0', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    expect(graphDiameter(g)).toBe(0);
  });
});

// ─── SECTION 10: Clustering coefficient ───────────────────────────────────────
describe('GNN § 10 — Clustering', () => {
  test('triangle has coefficient 1', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [1]));
    g = addNode(g, createNode('c', [1]));
    g = addEdge(g, 'a', 'b');
    g = addEdge(g, 'b', 'c');
    g = addEdge(g, 'a', 'c');
    expect(clusteringCoefficient(g, 'a')).toBeCloseTo(1);
  });
  test('star center has coefficient 0', () => {
    let g = createGraph();
    g = addNode(g, createNode('center', [1]));
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [1]));
    g = addNode(g, createNode('c', [1]));
    g = addEdge(g, 'center', 'a');
    g = addEdge(g, 'center', 'b');
    g = addEdge(g, 'center', 'c');
    expect(clusteringCoefficient(g, 'center')).toBeCloseTo(0);
  });
  test('leaf node coefficient = 0', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [1]));
    g = addEdge(g, 'a', 'b');
    expect(clusteringCoefficient(g, 'a')).toBe(0);
  });
  test('isolated node coefficient = 0', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    expect(clusteringCoefficient(g, 'a')).toBe(0);
  });
  test('coefficient range [0,1]', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [1]));
    g = addNode(g, createNode('c', [1]));
    g = addEdge(g, 'a', 'b');
    g = addEdge(g, 'a', 'c');
    const cc = clusteringCoefficient(g, 'a');
    expect(cc).toBeGreaterThanOrEqual(0);
    expect(cc).toBeLessThanOrEqual(1);
  });
});

// ─── SECTION 11: Additional edge cases ────────────────────────────────────────
describe('GNN § 11 — Edge cases', () => {
  test('empty features', () => {
    const n = createNode('a', []);
    expect(n.features).toEqual([]);
  });
  test('single element features', () => {
    const n = createNode('a', [5]);
    expect(n.features.length).toBe(1);
  });
  test('large graph creation', () => {
    let g = createGraph();
    for (let i = 0; i < 100; i++) {
      g = addNode(g, createNode(`n${i}`, [i]));
    }
    expect(g.nodes.size).toBe(100);
  });
  test('dense graph edges', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [2]));
    g = addNode(g, createNode('c', [3]));
    g = addEdge(g, 'a', 'b');
    g = addEdge(g, 'b', 'c');
    g = addEdge(g, 'a', 'c');
    expect(g.edges.length).toBe(3);
  });
  test('maxAggregator single message', () => {
    expect(maxAggregator([[5, 3]])).toEqual([5, 3]);
  });
  test('meanAggregator single message', () => {
    expect(meanAggregator([[4, 6]])).toEqual([4, 6]);
  });
  test('normalize large values', () => {
    const n = normalize([1000, 0]);
    expect(n[0]).toBeCloseTo(1);
  });
  test('dotProduct single element', () => {
    expect(dotProduct([3], [4])).toBe(12);
  });
  test('sigmoid boundary', () => {
    expect(sigmoid(100)).toBeCloseTo(1);
    expect(sigmoid(-100)).toBeCloseTo(0);
  });
  test('relu boundary', () => {
    expect(relu(-0.001)).toBe(0);
    expect(relu(0.001)).toBeCloseTo(0.001);
  });
});

// ─── SECTION 12: Graph algorithms ─────────────────────────────────────────────
describe('GNN § 12 — Graph algorithms', () => {
  test('BFS traversal implied in diameter', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [1]));
    g = addEdge(g, 'a', 'b');
    expect(graphDiameter(g)).toBe(1);
  });
  test('disconnected graph diameter', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [1]));
    // No edge
    expect(graphDiameter(g)).toBe(0);
  });
  test('cycle graph diameter', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [1]));
    g = addNode(g, createNode('c', [1]));
    g = addEdge(g, 'a', 'b');
    g = addEdge(g, 'b', 'c');
    g = addEdge(g, 'c', 'a');
    expect(graphDiameter(g)).toBe(1);
  });
  test('phi metric scales with nodes', () => {
    let g1 = createGraph();
    g1 = addNode(g1, createNode('a', [1]));
    let g2 = createGraph();
    g2 = addNode(g2, createNode('a', [1]));
    g2 = addNode(g2, createNode('b', [1]));
    expect(phiGraphMetric(g2)).toBeGreaterThan(phiGraphMetric(g1));
  });
  test('average degree complete graph', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1]));
    g = addNode(g, createNode('b', [1]));
    g = addNode(g, createNode('c', [1]));
    g = addEdge(g, 'a', 'b');
    g = addEdge(g, 'b', 'c');
    g = addEdge(g, 'a', 'c');
    expect(averageDegree(g)).toBe(2);
  });
});

// ─── SECTION 13: Pooling variations ───────────────────────────────────────────
describe('GNN § 13 — Pooling', () => {
  test('hierarchical pooling concept', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1, 2]));
    g = addNode(g, createNode('b', [3, 4]));
    const pool1 = globalMeanPool(g);
    expect(pool1.length).toBe(2);
  });
  test('pooling with varied embeddings', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [0, 10]));
    g = addNode(g, createNode('b', [10, 0]));
    const mean = globalMeanPool(g);
    expect(mean[0]).toBe(5);
    expect(mean[1]).toBe(5);
  });
  test('max pool finds extremes', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [-5, 10]));
    g = addNode(g, createNode('b', [5, -10]));
    const max = globalMaxPool(g);
    expect(max[0]).toBe(5);
    expect(max[1]).toBe(10);
  });
  test('sum pool accumulates', () => {
    let g = createGraph();
    g = addNode(g, createNode('a', [1, 1]));
    g = addNode(g, createNode('b', [1, 1]));
    g = addNode(g, createNode('c', [1, 1]));
    const sum = globalSumPool(g);
    expect(sum[0]).toBe(3);
    expect(sum[1]).toBe(3);
  });
});
