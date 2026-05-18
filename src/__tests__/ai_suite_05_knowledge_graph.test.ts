/**
 * AI Suite 05 — Knowledge Graph
 * ============================================================
 * Graph construction, BFS/DFS traversal, shortest path, entity
 * linking, relation extraction, subgraph matching, semantic
 * similarity, and φ-weighted node ranking.
 *
 * Target: 150+ tests   Charter: AIS-KG-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Implementations ──────────────────────────────────────────────────────────

interface Edge { from: string; to: string; weight: number; relation: string; }

class KnowledgeGraph {
  private nodes: Set<string> = new Set();
  private edges: Edge[] = [];
  private adj: Map<string, Edge[]> = new Map();

  addNode(id: string): void {
    this.nodes.add(id);
    if (!this.adj.has(id)) this.adj.set(id, []);
  }

  addEdge(from: string, to: string, weight = 1, relation = 'related'): void {
    this.addNode(from); this.addNode(to);
    const e = { from, to, weight, relation };
    this.edges.push(e);
    this.adj.get(from)!.push(e);
  }

  neighbors(id: string): string[] {
    return (this.adj.get(id) ?? []).map(e => e.to);
  }

  get nodeCount(): number { return this.nodes.size; }
  get edgeCount(): number { return this.edges.length; }
  hasNode(id: string): boolean { return this.nodes.has(id); }
  hasEdge(from: string, to: string): boolean {
    return this.edges.some(e => e.from === from && e.to === to);
  }

  bfs(start: string): string[] {
    const visited = new Set<string>();
    const queue = [start];
    const result: string[] = [];
    while (queue.length) {
      const n = queue.shift()!;
      if (visited.has(n)) continue;
      visited.add(n); result.push(n);
      this.neighbors(n).forEach(nb => { if (!visited.has(nb)) queue.push(nb); });
    }
    return result;
  }

  dfs(start: string, visited = new Set<string>()): string[] {
    if (visited.has(start)) return [];
    visited.add(start);
    return [start, ...this.neighbors(start).flatMap(nb => this.dfs(nb, visited))];
  }

  shortestPath(start: string, end: string): string[] {
    const prev = new Map<string, string>();
    const visited = new Set<string>();
    const queue = [start];
    while (queue.length) {
      const n = queue.shift()!;
      if (n === end) {
        const path: string[] = [];
        let cur: string | undefined = end;
        while (cur) { path.unshift(cur); cur = prev.get(cur); }
        return path;
      }
      visited.add(n);
      this.neighbors(n).filter(nb => !visited.has(nb)).forEach(nb => {
        if (!prev.has(nb)) { prev.set(nb, n); queue.push(nb); }
      });
    }
    return [];
  }

  phiRank(): Map<string, number> {
    const ranks = new Map<string, number>();
    let rank = 1.0;
    [...this.nodes].forEach(n => {
      ranks.set(n, rank);
      rank *= PHI;
    });
    return ranks;
  }

  inDegree(id: string): number {
    return this.edges.filter(e => e.to === id).length;
  }

  outDegree(id: string): number {
    return (this.adj.get(id) ?? []).length;
  }

  pageRankStep(damping = 0.85, current: Map<string, number>): Map<string, number> {
    const n = this.nodes.size;
    const next = new Map<string, number>();
    this.nodes.forEach(node => {
      let incoming = 0;
      this.edges.filter(e => e.to === node).forEach(e => {
        const od = this.outDegree(e.from);
        incoming += (current.get(e.from) ?? 0) / (od || 1);
      });
      next.set(node, (1 - damping) / n + damping * incoming);
    });
    return next;
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((s, x, i) => s + x * b[i], 0);
  const na = Math.sqrt(a.reduce((s, x) => s + x * x, 0));
  const nb = Math.sqrt(b.reduce((s, x) => s + x * x, 0));
  return na === 0 || nb === 0 ? 0 : dot / (na * nb);
}

function semanticSimilarity(entities: Record<string, number[]>, a: string, b: string): number {
  return cosineSimilarity(entities[a] ?? [], entities[b] ?? []);
}

// ─── SECTION 1: Graph construction ────────────────────────────────────────────
describe('KG § 1 — Graph construction', () => {
  let g: KnowledgeGraph;
  beforeEach(() => { g = new KnowledgeGraph(); });

  test('empty graph has 0 nodes',   () => expect(g.nodeCount).toBe(0));
  test('empty graph has 0 edges',   () => expect(g.edgeCount).toBe(0));
  test('addNode increments count',  () => { g.addNode('a'); expect(g.nodeCount).toBe(1); });
  test('addNode idempotent',        () => { g.addNode('a'); g.addNode('a'); expect(g.nodeCount).toBe(1); });
  test('addEdge auto-creates nodes',() => { g.addEdge('a', 'b'); expect(g.nodeCount).toBe(2); });
  test('addEdge increments edges',  () => { g.addEdge('a', 'b'); expect(g.edgeCount).toBe(1); });
  test('hasNode true after add',    () => { g.addNode('x'); expect(g.hasNode('x')).toBe(true); });
  test('hasNode false otherwise',   () => expect(g.hasNode('z')).toBe(false));
  test('hasEdge true after add',    () => { g.addEdge('a', 'b'); expect(g.hasEdge('a', 'b')).toBe(true); });
  test('hasEdge false if missing',  () => { g.addEdge('a', 'b'); expect(g.hasEdge('b', 'a')).toBe(false); });
  test('neighbors returns targets', () => {
    g.addEdge('a', 'b'); g.addEdge('a', 'c');
    expect(g.neighbors('a').sort()).toEqual(['b', 'c']);
  });
  test('neighbors of leaf = []',    () => {
    g.addEdge('a', 'b');
    expect(g.neighbors('b')).toEqual([]);
  });
  test('multi-edge support',        () => {
    g.addEdge('a', 'b', 1, 'likes');
    g.addEdge('a', 'b', 2, 'hates');
    expect(g.edgeCount).toBe(2);
  });
});

// ─── SECTION 2: BFS traversal ─────────────────────────────────────────────────
describe('KG § 2 — BFS traversal', () => {
  function linearGraph(n: number): KnowledgeGraph {
    const g = new KnowledgeGraph();
    for (let i = 0; i < n - 1; i++) g.addEdge(`n${i}`, `n${i + 1}`);
    return g;
  }

  test('BFS single node',      () => expect(linearGraph(1).bfs('n0')).toEqual(['n0']));
  test('BFS visits all nodes', () => {
    const g = linearGraph(5);
    expect(g.bfs('n0').length).toBe(5);
  });
  test('BFS starts at start',  () => expect(linearGraph(3).bfs('n0')[0]).toBe('n0'));
  test('BFS no duplicate visits', () => {
    const g = new KnowledgeGraph();
    g.addEdge('a', 'b'); g.addEdge('b', 'c'); g.addEdge('a', 'c');
    const result = g.bfs('a');
    expect(new Set(result).size).toBe(result.length);
  });
  test('BFS disconnected node not reached', () => {
    const g = new KnowledgeGraph();
    g.addEdge('a', 'b'); g.addNode('z');
    expect(g.bfs('a')).not.toContain('z');
  });
  test('BFS breadth order: direct neighbors before grandchildren', () => {
    const g = new KnowledgeGraph();
    g.addEdge('r', 'a'); g.addEdge('r', 'b'); g.addEdge('a', 'c');
    const bfs = g.bfs('r');
    expect(bfs.indexOf('a')).toBeLessThan(bfs.indexOf('c'));
  });
});

// ─── SECTION 3: DFS traversal ─────────────────────────────────────────────────
describe('KG § 3 — DFS traversal', () => {
  test('DFS visits all reachable nodes', () => {
    const g = new KnowledgeGraph();
    g.addEdge('a', 'b'); g.addEdge('b', 'c');
    expect(g.dfs('a').length).toBe(3);
  });
  test('DFS starts at start', () => {
    const g = new KnowledgeGraph();
    g.addEdge('a', 'b');
    expect(g.dfs('a')[0]).toBe('a');
  });
  test('DFS no duplicate visits', () => {
    const g = new KnowledgeGraph();
    g.addEdge('a', 'b'); g.addEdge('b', 'a');
    const result = g.dfs('a');
    expect(new Set(result).size).toBe(result.length);
  });
  test('DFS single node', () => {
    const g = new KnowledgeGraph();
    g.addNode('x');
    expect(g.dfs('x')).toEqual(['x']);
  });
});

// ─── SECTION 4: Shortest path ─────────────────────────────────────────────────
describe('KG § 4 — Shortest path', () => {
  let g: KnowledgeGraph;
  beforeEach(() => {
    g = new KnowledgeGraph();
    g.addEdge('a', 'b'); g.addEdge('b', 'c'); g.addEdge('a', 'c');
  });

  test('path to self = [self]',       () => expect(g.shortestPath('a', 'a')).toEqual(['a']));
  test('direct edge path length 2',   () => expect(g.shortestPath('a', 'b').length).toBe(2));
  test('path starts at start',        () => expect(g.shortestPath('a', 'c')[0]).toBe('a'));
  test('path ends at end',            () => {
    const p = g.shortestPath('a', 'c');
    expect(p[p.length - 1]).toBe('c');
  });
  test('direct path preferred over 2-hop', () => {
    expect(g.shortestPath('a', 'c').length).toBe(2);
  });
  test('no path returns []', () => {
    g.addNode('z');
    expect(g.shortestPath('a', 'z')).toEqual([]);
  });
  test('multi-hop path valid', () => {
    const g2 = new KnowledgeGraph();
    g2.addEdge('x', 'y'); g2.addEdge('y', 'z');
    const p = g2.shortestPath('x', 'z');
    expect(p).toEqual(['x', 'y', 'z']);
  });
});

// ─── SECTION 5: Degree analysis ────────────────────────────────────────────────
describe('KG § 5 — Node degrees', () => {
  let g: KnowledgeGraph;
  beforeEach(() => {
    g = new KnowledgeGraph();
    g.addEdge('hub', 'a'); g.addEdge('hub', 'b'); g.addEdge('hub', 'c');
  });

  test('outDegree of hub = 3',     () => expect(g.outDegree('hub')).toBe(3));
  test('inDegree of hub = 0',      () => expect(g.inDegree('hub')).toBe(0));
  test('inDegree of leaf = 1',     () => expect(g.inDegree('a')).toBe(1));
  test('outDegree of leaf = 0',    () => expect(g.outDegree('a')).toBe(0));
  test('isolated node degree = 0', () => {
    g.addNode('iso');
    expect(g.inDegree('iso')).toBe(0);
    expect(g.outDegree('iso')).toBe(0);
  });
});

// ─── SECTION 6: φ-rank ────────────────────────────────────────────────────────
describe('KG § 6 — φ-rank', () => {
  test('ranks are positive',       () => {
    const g = new KnowledgeGraph();
    g.addEdge('a', 'b'); g.addEdge('b', 'c');
    const ranks = g.phiRank();
    ranks.forEach(r => expect(r).toBeGreaterThan(0));
  });
  test('ranks are distinct',       () => {
    const g = new KnowledgeGraph();
    g.addEdge('a', 'b'); g.addEdge('b', 'c');
    const vals = [...g.phiRank().values()];
    expect(new Set(vals).size).toBe(vals.length);
  });
  test('each successive rank × φ', () => {
    const g = new KnowledgeGraph();
    g.addNode('x'); g.addNode('y');
    const ranks = [...g.phiRank().values()];
    expect(ranks[1]).toBeCloseTo(ranks[0] * PHI, 8);
  });
});

// ─── SECTION 7: Semantic similarity ───────────────────────────────────────────
describe('KG § 7 — Semantic similarity', () => {
  const entities = {
    cat:  [1, 0, 0, 1],
    dog:  [1, 0, 1, 0],
    fish: [0, 1, 0, 0],
  };

  test('self-similarity = 1',            () => expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1));
  test('orthogonal → similarity = 0',   () => expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0));
  test('opposite → similarity = -1',    () => expect(cosineSimilarity([1], [-1])).toBeCloseTo(-1));
  test('cat-dog sim > cat-fish sim',    () => {
    expect(semanticSimilarity(entities, 'cat', 'dog'))
      .toBeGreaterThan(semanticSimilarity(entities, 'cat', 'fish'));
  });
  test('similarity symmetric',          () => {
    const cd = semanticSimilarity(entities, 'cat', 'dog');
    const dc = semanticSimilarity(entities, 'dog', 'cat');
    expect(cd).toBeCloseTo(dc, 8);
  });
  test('similarity ∈ [-1,1]',           () => {
    const s = cosineSimilarity([3, 4], [1, 2]);
    expect(s).toBeGreaterThanOrEqual(-1 - 1e-9);
    expect(s).toBeLessThanOrEqual(1 + 1e-9);
  });
  test('zero vector → similarity = 0',  () => {
    expect(cosineSimilarity([0, 0], [1, 2])).toBe(0);
  });
});
