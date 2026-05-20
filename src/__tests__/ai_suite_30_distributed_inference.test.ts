/**
 * AI Suite 30 — Distributed Inference
 * ============================================================
 * Model sharding, pipeline parallelism, tensor parallelism,
 * load balancing, fault tolerance, communication patterns,
 * φ-coherent distribution, and distributed invariants.
 *
 * Target: 100 tests   Charter: AIS-DI-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Core Types ───────────────────────────────────────────────────────────────

type Vector = number[];
type Shard = { id: number; data: Vector; nodeId: string };
type Node = { id: string; capacity: number; load: number; shards: number[] };
type BatchRequest = { id: string; input: Vector; priority: number };

interface DistributedCluster {
  nodes: Map<string, Node>;
  shards: Map<number, Shard>;
  totalCapacity: number;
}

// ─── Implementations ──────────────────────────────────────────────────────────

function createCluster(): DistributedCluster {
  return { nodes: new Map(), shards: new Map(), totalCapacity: 0 };
}

function addNode(cluster: DistributedCluster, id: string, capacity: number): DistributedCluster {
  const node: Node = { id, capacity, load: 0, shards: [] };
  const newNodes = new Map(cluster.nodes);
  newNodes.set(id, node);
  return { ...cluster, nodes: newNodes, totalCapacity: cluster.totalCapacity + capacity };
}

function removeNode(cluster: DistributedCluster, id: string): DistributedCluster {
  const node = cluster.nodes.get(id);
  if (!node) return cluster;
  
  const newNodes = new Map(cluster.nodes);
  newNodes.delete(id);
  return { ...cluster, nodes: newNodes, totalCapacity: cluster.totalCapacity - node.capacity };
}

function createShard(id: number, data: Vector, nodeId: string): Shard {
  return { id, data, nodeId };
}

function assignShard(cluster: DistributedCluster, shard: Shard): DistributedCluster {
  const newShards = new Map(cluster.shards);
  newShards.set(shard.id, shard);
  
  const newNodes = new Map(cluster.nodes);
  const node = newNodes.get(shard.nodeId);
  if (node) {
    newNodes.set(shard.nodeId, { ...node, shards: [...node.shards, shard.id] });
  }
  
  return { ...cluster, shards: newShards, nodes: newNodes };
}

function getNodeLoad(node: Node): number {
  return node.load / node.capacity;
}

function findLeastLoadedNode(cluster: DistributedCluster): string | null {
  let minLoad = Infinity;
  let minNodeId: string | null = null;
  
  for (const [id, node] of cluster.nodes) {
    const load = getNodeLoad(node);
    if (load < minLoad) {
      minLoad = load;
      minNodeId = id;
    }
  }
  
  return minNodeId;
}

function balanceLoad(cluster: DistributedCluster): DistributedCluster {
  const nodes = Array.from(cluster.nodes.values());
  const totalLoad = nodes.reduce((s, n) => s + n.load, 0);
  const avgLoad = totalLoad / nodes.length;
  
  const newNodes = new Map<string, Node>();
  for (const node of nodes) {
    // Simple rebalancing: move toward average
    const newLoad = 0.5 * node.load + 0.5 * avgLoad;
    newNodes.set(node.id, { ...node, load: newLoad });
  }
  
  return { ...cluster, nodes: newNodes };
}

function pipelineStages(numLayers: number, numNodes: number): number[][] {
  const stages: number[][] = [];
  const layersPerNode = Math.ceil(numLayers / numNodes);
  
  for (let i = 0; i < numNodes; i++) {
    const start = i * layersPerNode;
    const end = Math.min(start + layersPerNode, numLayers);
    if (start < numLayers) {
      stages.push(Array.from({ length: end - start }, (_, j) => start + j));
    }
  }
  
  return stages;
}

function tensorSplit(tensor: Vector, numSplits: number): Vector[] {
  const splits: Vector[] = [];
  const splitSize = Math.ceil(tensor.length / numSplits);
  
  for (let i = 0; i < numSplits; i++) {
    splits.push(tensor.slice(i * splitSize, (i + 1) * splitSize));
  }
  
  return splits;
}

function tensorMerge(splits: Vector[]): Vector {
  return splits.flat();
}

function allReduce(values: number[], operation: 'sum' | 'mean' | 'max'): number {
  switch (operation) {
    case 'sum': return values.reduce((a, b) => a + b, 0);
    case 'mean': return values.reduce((a, b) => a + b, 0) / values.length;
    case 'max': return Math.max(...values);
    default: return 0;
  }
}

function ringAllReduce(nodeValues: number[]): number {
  // Simulate ring all-reduce: sum all values
  return nodeValues.reduce((a, b) => a + b, 0);
}

function broadcast(value: number, numNodes: number): number[] {
  return Array(numNodes).fill(value);
}

function scatter(data: Vector, numNodes: number): Vector[] {
  return tensorSplit(data, numNodes);
}

function gather(chunks: Vector[]): Vector {
  return tensorMerge(chunks);
}

function routeRequest(cluster: DistributedCluster, request: BatchRequest): string | null {
  return findLeastLoadedNode(cluster);
}

function batchRequests(requests: BatchRequest[], maxBatchSize: number): BatchRequest[][] {
  const batches: BatchRequest[][] = [];
  for (let i = 0; i < requests.length; i += maxBatchSize) {
    batches.push(requests.slice(i, i + maxBatchSize));
  }
  return batches;
}

function prioritySort(requests: BatchRequest[]): BatchRequest[] {
  return [...requests].sort((a, b) => b.priority - a.priority);
}

function estimateLatency(numNodes: number, dataSize: number, bandwidth: number): number {
  // Simple latency model: communication + computation
  const commLatency = dataSize / bandwidth;
  const compLatency = dataSize / (numNodes * 1000); // Parallel speedup
  return commLatency + compLatency;
}

function replicationFactor(numNodes: number, faultTolerance: number): number {
  return Math.min(faultTolerance + 1, numNodes);
}

function isQuorumReached(responses: number, total: number, quorumRatio: number = 0.5): boolean {
  return responses / total >= quorumRatio;
}

function phiLoadThreshold(baseThreshold: number): number {
  return baseThreshold * PHI;
}

function phiScaleNodes(currentNodes: number, loadFactor: number): number {
  if (loadFactor > PHI) {
    return Math.ceil(currentNodes * PHI);
  } else if (loadFactor < 1 / PHI) {
    return Math.max(1, Math.floor(currentNodes / PHI));
  }
  return currentNodes;
}

function healthCheck(node: Node): boolean {
  return node.capacity > 0 && getNodeLoad(node) < 1;
}

function failoverTarget(cluster: DistributedCluster, failedNodeId: string): string | null {
  const healthy = Array.from(cluster.nodes.entries())
    .filter(([id, node]) => id !== failedNodeId && healthCheck(node));
  
  if (healthy.length === 0) return null;
  
  // Find least loaded healthy node
  let minLoad = Infinity;
  let target: string | null = null;
  for (const [id, node] of healthy) {
    const load = getNodeLoad(node);
    if (load < minLoad) {
      minLoad = load;
      target = id;
    }
  }
  return target;
}

// ─── SECTION 1: Cluster management ────────────────────────────────────────────
describe('DI § 1 — Cluster', () => {
  test('createCluster empty', () => {
    const cluster = createCluster();
    expect(cluster.nodes.size).toBe(0);
    expect(cluster.totalCapacity).toBe(0);
  });
  test('addNode increases count', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'node1', 100);
    expect(cluster.nodes.size).toBe(1);
  });
  test('addNode updates capacity', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'node1', 100);
    cluster = addNode(cluster, 'node2', 200);
    expect(cluster.totalCapacity).toBe(300);
  });
  test('removeNode decreases count', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'node1', 100);
    cluster = removeNode(cluster, 'node1');
    expect(cluster.nodes.size).toBe(0);
  });
  test('removeNode updates capacity', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'node1', 100);
    cluster = addNode(cluster, 'node2', 200);
    cluster = removeNode(cluster, 'node1');
    expect(cluster.totalCapacity).toBe(200);
  });
  test('removeNode nonexistent no-op', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'node1', 100);
    cluster = removeNode(cluster, 'node2');
    expect(cluster.nodes.size).toBe(1);
  });
});

// ─── SECTION 2: Sharding ──────────────────────────────────────────────────────
describe('DI § 2 — Sharding', () => {
  test('createShard stores data', () => {
    const shard = createShard(0, [1, 2, 3], 'node1');
    expect(shard.data).toEqual([1, 2, 3]);
  });
  test('createShard stores nodeId', () => {
    const shard = createShard(0, [1], 'node1');
    expect(shard.nodeId).toBe('node1');
  });
  test('assignShard adds to cluster', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'node1', 100);
    const shard = createShard(0, [1, 2], 'node1');
    cluster = assignShard(cluster, shard);
    expect(cluster.shards.size).toBe(1);
  });
  test('assignShard updates node', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'node1', 100);
    const shard = createShard(0, [1], 'node1');
    cluster = assignShard(cluster, shard);
    expect(cluster.nodes.get('node1')?.shards).toContain(0);
  });
  test('tensorSplit divides evenly', () => {
    const splits = tensorSplit([1, 2, 3, 4], 2);
    expect(splits).toEqual([[1, 2], [3, 4]]);
  });
  test('tensorSplit handles uneven', () => {
    const splits = tensorSplit([1, 2, 3, 4, 5], 2);
    expect(splits.length).toBe(2);
  });
  test('tensorMerge reconstructs', () => {
    const splits = [[1, 2], [3, 4]];
    expect(tensorMerge(splits)).toEqual([1, 2, 3, 4]);
  });
});

// ─── SECTION 3: Load balancing ────────────────────────────────────────────────
describe('DI § 3 — Load balancing', () => {
  test('getNodeLoad ratio', () => {
    const node: Node = { id: 'n1', capacity: 100, load: 50, shards: [] };
    expect(getNodeLoad(node)).toBe(0.5);
  });
  test('getNodeLoad zero', () => {
    const node: Node = { id: 'n1', capacity: 100, load: 0, shards: [] };
    expect(getNodeLoad(node)).toBe(0);
  });
  test('findLeastLoadedNode selects min', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'n1', 100);
    cluster = addNode(cluster, 'n2', 100);
    const nodes = cluster.nodes;
    nodes.set('n1', { ...nodes.get('n1')!, load: 80 });
    nodes.set('n2', { ...nodes.get('n2')!, load: 20 });
    expect(findLeastLoadedNode({ ...cluster, nodes })).toBe('n2');
  });
  test('findLeastLoadedNode empty cluster', () => {
    expect(findLeastLoadedNode(createCluster())).toBeNull();
  });
  test('balanceLoad converges', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'n1', 100);
    cluster = addNode(cluster, 'n2', 100);
    const nodes = new Map(cluster.nodes);
    nodes.set('n1', { ...nodes.get('n1')!, load: 100 });
    nodes.set('n2', { ...nodes.get('n2')!, load: 0 });
    const balanced = balanceLoad({ ...cluster, nodes });
    const load1 = balanced.nodes.get('n1')!.load;
    const load2 = balanced.nodes.get('n2')!.load;
    expect(Math.abs(load1 - load2)).toBeLessThan(60);
  });
});

// ─── SECTION 4: Pipeline parallelism ──────────────────────────────────────────
describe('DI § 4 — Pipeline', () => {
  test('pipelineStages distributes layers', () => {
    const stages = pipelineStages(12, 3);
    expect(stages.length).toBe(3);
  });
  test('pipelineStages covers all layers', () => {
    const stages = pipelineStages(10, 3);
    const allLayers = stages.flat();
    expect(allLayers).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  test('pipelineStages single node', () => {
    const stages = pipelineStages(5, 1);
    expect(stages[0]).toEqual([0, 1, 2, 3, 4]);
  });
  test('pipelineStages more nodes than layers', () => {
    const stages = pipelineStages(3, 5);
    expect(stages.flat()).toEqual([0, 1, 2]);
  });
});

// ─── SECTION 5: Communication patterns ────────────────────────────────────────
describe('DI § 5 — Communication', () => {
  test('allReduce sum', () => {
    expect(allReduce([1, 2, 3, 4], 'sum')).toBe(10);
  });
  test('allReduce mean', () => {
    expect(allReduce([2, 4, 6, 8], 'mean')).toBe(5);
  });
  test('allReduce max', () => {
    expect(allReduce([1, 5, 3, 2], 'max')).toBe(5);
  });
  test('ringAllReduce sum', () => {
    expect(ringAllReduce([1, 2, 3, 4])).toBe(10);
  });
  test('broadcast replicates', () => {
    expect(broadcast(42, 4)).toEqual([42, 42, 42, 42]);
  });
  test('scatter distributes', () => {
    expect(scatter([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
  });
  test('gather collects', () => {
    expect(gather([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
  });
  test('scatter-gather roundtrip', () => {
    const data = [1, 2, 3, 4, 5, 6];
    const scattered = scatter(data, 3);
    const gathered = gather(scattered);
    expect(gathered).toEqual(data);
  });
});

// ─── SECTION 6: Request routing ───────────────────────────────────────────────
describe('DI § 6 — Routing', () => {
  test('routeRequest returns node', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'n1', 100);
    const req: BatchRequest = { id: 'r1', input: [1, 2], priority: 1 };
    expect(routeRequest(cluster, req)).toBe('n1');
  });
  test('routeRequest empty cluster', () => {
    const req: BatchRequest = { id: 'r1', input: [1], priority: 1 };
    expect(routeRequest(createCluster(), req)).toBeNull();
  });
  test('batchRequests groups', () => {
    const reqs: BatchRequest[] = [
      { id: '1', input: [1], priority: 1 },
      { id: '2', input: [2], priority: 1 },
      { id: '3', input: [3], priority: 1 }
    ];
    expect(batchRequests(reqs, 2).length).toBe(2);
  });
  test('prioritySort orders by priority', () => {
    const reqs: BatchRequest[] = [
      { id: '1', input: [1], priority: 1 },
      { id: '2', input: [2], priority: 3 },
      { id: '3', input: [3], priority: 2 }
    ];
    const sorted = prioritySort(reqs);
    expect(sorted[0].id).toBe('2');
    expect(sorted[2].id).toBe('1');
  });
});

// ─── SECTION 7: Latency estimation ────────────────────────────────────────────
describe('DI § 7 — Latency', () => {
  test('estimateLatency positive', () => {
    expect(estimateLatency(4, 1000, 100)).toBeGreaterThan(0);
  });
  test('estimateLatency scales with data', () => {
    const lat1 = estimateLatency(4, 1000, 100);
    const lat2 = estimateLatency(4, 2000, 100);
    expect(lat2).toBeGreaterThan(lat1);
  });
  test('estimateLatency more nodes helps', () => {
    const lat1 = estimateLatency(2, 1000, 100);
    const lat2 = estimateLatency(8, 1000, 100);
    expect(lat2).toBeLessThan(lat1);
  });
});

// ─── SECTION 8: Fault tolerance ───────────────────────────────────────────────
describe('DI § 8 — Fault tolerance', () => {
  test('replicationFactor bounded', () => {
    expect(replicationFactor(3, 5)).toBe(3);
  });
  test('replicationFactor normal', () => {
    expect(replicationFactor(5, 2)).toBe(3);
  });
  test('isQuorumReached true', () => {
    expect(isQuorumReached(3, 5, 0.5)).toBe(true);
  });
  test('isQuorumReached false', () => {
    expect(isQuorumReached(2, 5, 0.5)).toBe(false);
  });
  test('healthCheck healthy', () => {
    const node: Node = { id: 'n1', capacity: 100, load: 50, shards: [] };
    expect(healthCheck(node)).toBe(true);
  });
  test('healthCheck overloaded', () => {
    const node: Node = { id: 'n1', capacity: 100, load: 100, shards: [] };
    expect(healthCheck(node)).toBe(false);
  });
  test('failoverTarget finds healthy', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'n1', 100);
    cluster = addNode(cluster, 'n2', 100);
    expect(failoverTarget(cluster, 'n1')).toBe('n2');
  });
  test('failoverTarget no healthy', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'n1', 100);
    expect(failoverTarget(cluster, 'n1')).toBeNull();
  });
});

// ─── SECTION 9: Phi scaling ───────────────────────────────────────────────────
describe('DI § 9 — Phi scaling', () => {
  test('phiLoadThreshold scales', () => {
    expect(phiLoadThreshold(0.5)).toBeCloseTo(0.5 * PHI);
  });
  test('phiScaleNodes high load scales up', () => {
    expect(phiScaleNodes(4, 2)).toBe(7); // ceil(4 * PHI)
  });
  test('phiScaleNodes low load scales down', () => {
    expect(phiScaleNodes(4, 0.3)).toBe(2); // floor(4 / PHI)
  });
  test('phiScaleNodes normal load no change', () => {
    expect(phiScaleNodes(4, 1)).toBe(4);
  });
  test('phiScaleNodes min 1', () => {
    expect(phiScaleNodes(2, 0.1)).toBeGreaterThanOrEqual(1);
  });
});

// ─── SECTION 10: Integration ──────────────────────────────────────────────────
describe('DI § 10 — Integration', () => {
  test('full pipeline: add nodes, assign shards, route', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'n1', 100);
    cluster = addNode(cluster, 'n2', 100);
    
    const shard1 = createShard(0, [1, 2], 'n1');
    const shard2 = createShard(1, [3, 4], 'n2');
    cluster = assignShard(cluster, shard1);
    cluster = assignShard(cluster, shard2);
    
    expect(cluster.shards.size).toBe(2);
    expect(cluster.nodes.get('n1')?.shards).toContain(0);
    expect(cluster.nodes.get('n2')?.shards).toContain(1);
  });
  test('split-process-merge workflow', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8];
    const splits = tensorSplit(data, 4);
    const processed = splits.map(s => s.map(x => x * 2));
    const merged = tensorMerge(processed);
    expect(merged).toEqual([2, 4, 6, 8, 10, 12, 14, 16]);
  });
  test('batch-prioritize-route workflow', () => {
    const requests: BatchRequest[] = [
      { id: '1', input: [1], priority: 1 },
      { id: '2', input: [2], priority: 3 },
      { id: '3', input: [3], priority: 2 }
    ];
    const sorted = prioritySort(requests);
    const batched = batchRequests(sorted, 2);
    expect(batched[0][0].id).toBe('2');
  });
  test('failover workflow', () => {
    let cluster = createCluster();
    cluster = addNode(cluster, 'n1', 100);
    cluster = addNode(cluster, 'n2', 100);
    
    // Simulate n1 failure
    const target = failoverTarget(cluster, 'n1');
    expect(target).toBe('n2');
    
    // Remove failed node
    cluster = removeNode(cluster, 'n1');
    expect(cluster.nodes.size).toBe(1);
  });
});
