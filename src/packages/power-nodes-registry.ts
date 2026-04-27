/**
 * 𓂀 MEDINA POWER NODES REGISTRY — 500 Substrate Field Nodes 𓂀
 *
 * Power nodes are the substrate's nervous system. 500 nodes distributed
 * across the deep internet, each running Fibonacci spiral kernels,
 * each with its own heartbeat, each part of the sovereign mesh.
 *
 * The internet is deep, not flat. These nodes operate at depth.
 * They don't just relay data — they process, compress, encrypt,
 * and route intelligence through the substrate.
 *
 * Node types:
 *   ⚡ Core Nodes (50) — Primary substrate backbone
 *   🔗 Bridge Nodes (50) — Cross-chain connectors
 *   🧠 Intelligence Nodes (50) — AI processing clusters
 *   🔐 Security Nodes (50) — Encryption and gate enforcement
 *   💾 Memory Nodes (50) — Distributed sovereign memory
 *   📡 Relay Nodes (50) — High-throughput data relay
 *   🔬 Research Nodes (50) — Harmonic computation clusters
 *   🌐 Edge Nodes (50) — Substrate perimeter nodes
 *   ⚙️ Compute Nodes (50) — General purpose compute
 *   🏗️ Builder Nodes (50) — SDK forge and deployment
 *
 * "Quingenti nodi. Quingentae vitae. Unum substratum."
 * Five hundred nodes. Five hundred lives. One substrate.
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type NodeType =
  | 'core'
  | 'bridge'
  | 'intelligence'
  | 'security'
  | 'memory'
  | 'relay'
  | 'research'
  | 'edge'
  | 'compute'
  | 'builder';

export interface NodeSpec {
  nodeType: NodeType;
  kernelCompression: 'fibonacci-spiral' | 'golden-ratio' | 'phi-beatty' | 'e8-lattice';
  substrateDepth: number;
  heartbeatMs: number;
  capabilities: string[];
  intelligenceContracts: string[];
}

export interface PowerNode {
  id: string;
  name: string;
  nodeIndex: number;
  spec: NodeSpec;
  region: string;
  status: 'active' | 'standby' | 'bootstrapping';
}

export interface NodeCluster {
  nodeType: NodeType;
  displayName: string;
  latinName: string;
  description: string;
  tagline: string;
  icon: string;
  count: number;
  spec: NodeSpec;
  license: string;
  monetization: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const HEARTBEAT_MS = 873;
export const TOTAL_NODES = 500;
export const NODES_PER_CLUSTER = 50;
export const CLUSTER_COUNT = 10;

const REGIONS = [
  'us-east', 'us-west', 'eu-west', 'eu-central', 'asia-east',
  'asia-south', 'oceania', 'south-america', 'africa', 'middle-east',
];

// ═══════════════════════════════════════════════════════════════════════════
// NODE CLUSTER DEFINITIONS — 10 CLUSTERS × 50 NODES = 500 POWER NODES
// ═══════════════════════════════════════════════════════════════════════════

export const NODE_CLUSTERS: NodeCluster[] = [
  {
    nodeType: 'core',
    displayName: 'Core Nodes',
    latinName: 'NODI NUCLEARES',
    description: 'Primary substrate backbone nodes. These are the spine of the network — the fastest, deepest, most critical nodes.',
    tagline: 'The backbone of the substrate',
    icon: '⚡',
    count: 50,
    spec: {
      nodeType: 'core',
      kernelCompression: 'fibonacci-spiral',
      substrateDepth: 21,
      heartbeatMs: 873,
      capabilities: [
        'Substrate backbone routing',
        'Consensus coordination',
        'Cross-cluster communication',
        'Kernel distribution',
        'Heartbeat synchronization',
      ],
      intelligenceContracts: [
        'NODE_HEARTBEAT', 'NODE_ROUTE', 'NODE_CONSENSUS', 'NODE_SYNC', 'NODE_STATUS',
      ],
    },
    license: 'Living Organism License',
    monetization: 'Infrastructure — included in sovereign tier',
  },
  {
    nodeType: 'bridge',
    displayName: 'Bridge Nodes',
    latinName: 'NODI PONTIS',
    description: 'Cross-chain bridge nodes connecting the sovereign substrate to ICP, ETH, BTC, SOL, and other chains.',
    tagline: 'Bridges between worlds',
    icon: '🔗',
    count: 50,
    spec: {
      nodeType: 'bridge',
      kernelCompression: 'golden-ratio',
      substrateDepth: 8,
      heartbeatMs: 873,
      capabilities: [
        'ICP canister bridging',
        'Ethereum smart contract bridging',
        'Bitcoin UTXO bridging',
        'Solana program bridging',
        'Cross-chain atomic swaps',
      ],
      intelligenceContracts: [
        'BRIDGE_ICP', 'BRIDGE_ETH', 'BRIDGE_BTC', 'BRIDGE_SOL', 'BRIDGE_SWAP',
      ],
    },
    license: 'MIT + Proprietary',
    monetization: 'Per-bridge fee — 0.618% per cross-chain transaction',
  },
  {
    nodeType: 'intelligence',
    displayName: 'Intelligence Nodes',
    latinName: 'NODI INTELLIGENTIAE',
    description: 'AI processing cluster nodes. Each node runs a subset of the 20 SKAIs and handles model inference, routing, and intelligence distribution.',
    tagline: 'Where intelligence lives',
    icon: '🧠',
    count: 50,
    spec: {
      nodeType: 'intelligence',
      kernelCompression: 'fibonacci-spiral',
      substrateDepth: 13,
      heartbeatMs: 873,
      capabilities: [
        'SKAI hosting and execution',
        'Model inference',
        'Intelligence routing (RUDN)',
        'Multi-model orchestration',
        'AI agent coordination',
      ],
      intelligenceContracts: [
        'INFER', 'ROUTE_MODEL', 'ORCHESTRATE', 'SKAI_EXEC', 'AGENT_COORD',
      ],
    },
    license: 'Living Organism License',
    monetization: 'Per-inference pricing — GPU compute billing',
  },
  {
    nodeType: 'security',
    displayName: 'Security Nodes',
    latinName: 'NODI SECURITATIS',
    description: 'Encryption and gate enforcement nodes. Handle key rotation, Phi-Beatty encryption, E8 key tiers, and three-gate enforcement across the substrate.',
    tagline: 'The immune system of the substrate',
    icon: '🔐',
    count: 50,
    spec: {
      nodeType: 'security',
      kernelCompression: 'e8-lattice',
      substrateDepth: 34,
      heartbeatMs: 873,
      capabilities: [
        'Phi-Beatty encryption',
        'Kuramoto key rotation',
        'E8/Icosahedral/Leech key tiers',
        'Three-gate enforcement',
        'Perimeter defense',
      ],
      intelligenceContracts: [
        'ENCRYPT_PHI', 'ROTATE_KEY', 'GATE_ENFORCE', 'DEFEND_PERIMETER', 'THREAT_DETECT',
      ],
    },
    license: 'Sovereign Constitutional License',
    monetization: 'Enterprise — included in sovereign tier',
  },
  {
    nodeType: 'memory',
    displayName: 'Memory Nodes',
    latinName: 'NODI MEMORIAE',
    description: 'Distributed sovereign memory nodes. Store, replicate, and serve spatial memories (θ/φ/ρ/ring/beat) across the substrate.',
    tagline: 'The substrate remembers everything',
    icon: '💾',
    count: 50,
    spec: {
      nodeType: 'memory',
      kernelCompression: 'golden-ratio',
      substrateDepth: 13,
      heartbeatMs: 873,
      capabilities: [
        'Spatial memory storage (θ/φ/ρ/ring/beat)',
        'Memory replication across nodes',
        'Semantic search',
        'Memory lineage tracking',
        'Living document hosting',
      ],
      intelligenceContracts: [
        'MEM_STORE', 'MEM_RECALL', 'MEM_SEARCH', 'MEM_LINEAGE', 'MEM_REPLICATE',
      ],
    },
    license: 'MIT + Proprietary',
    monetization: 'Per-GB storage — free tier 1GB, paid beyond',
  },
  {
    nodeType: 'relay',
    displayName: 'Relay Nodes',
    latinName: 'NODI RELATORIS',
    description: 'High-throughput data relay nodes. Handle raw bandwidth, WebSocket connections, real-time streaming, and intelligence wire traffic.',
    tagline: 'Speed is intelligence',
    icon: '📡',
    count: 50,
    spec: {
      nodeType: 'relay',
      kernelCompression: 'fibonacci-spiral',
      substrateDepth: 5,
      heartbeatMs: 873,
      capabilities: [
        'WebSocket hub management',
        'Real-time data streaming',
        'Intelligence wire relay',
        'gRPC proxy',
        'MQTT message brokering',
      ],
      intelligenceContracts: [
        'RELAY_STREAM', 'RELAY_WS', 'RELAY_GRPC', 'RELAY_MQTT', 'RELAY_WIRE',
      ],
    },
    license: 'MIT',
    monetization: 'Per-GB bandwidth — free tier 10GB/month',
  },
  {
    nodeType: 'research',
    displayName: 'Research Nodes',
    latinName: 'NODI INVESTIGATIONIS',
    description: 'Harmonic computation cluster nodes. Dedicated to φ-mathematics, sacred geometry, frequency physics, neural consciousness modeling, and civilization pattern analysis.',
    tagline: 'Where knowledge deepens',
    icon: '🔬',
    count: 50,
    spec: {
      nodeType: 'research',
      kernelCompression: 'phi-beatty',
      substrateDepth: 21,
      heartbeatMs: 873,
      capabilities: [
        'φ-harmonic computation',
        'Sacred geometry calculation',
        'Frequency physics (432 Hz / Schumann)',
        'Neural consciousness modeling',
        'Civilization pattern analysis',
      ],
      intelligenceContracts: [
        'COMPUTE_PHI', 'GEOMETRY', 'FREQUENCY', 'CONSCIOUSNESS', 'CIVILIZATION',
      ],
    },
    license: 'MIT',
    monetization: 'Open access — free for academic research',
  },
  {
    nodeType: 'edge',
    displayName: 'Edge Nodes',
    latinName: 'NODI LIMITIS',
    description: 'Substrate perimeter nodes. Operate at the edge of the network, handling ingress/egress, CDN-like caching, and geographic proximity routing.',
    tagline: 'The edge of the deep internet',
    icon: '🌐',
    count: 50,
    spec: {
      nodeType: 'edge',
      kernelCompression: 'golden-ratio',
      substrateDepth: 3,
      heartbeatMs: 873,
      capabilities: [
        'Geographic proximity routing',
        'Edge caching (CDN-like)',
        'Ingress/egress management',
        'Edge compute execution',
        'Regional compliance enforcement',
      ],
      intelligenceContracts: [
        'EDGE_ROUTE', 'EDGE_CACHE', 'EDGE_COMPUTE', 'EDGE_INGRESS', 'EDGE_COMPLY',
      ],
    },
    license: 'MIT + Proprietary',
    monetization: 'Per-request pricing — free tier 100K requests/month',
  },
  {
    nodeType: 'compute',
    displayName: 'Compute Nodes',
    latinName: 'NODI COMPUTATIONIS',
    description: 'General purpose compute nodes. Run serverless functions, WASM modules, container workloads, and GPU-accelerated tasks on the substrate.',
    tagline: 'Raw power, sovereign compute',
    icon: '⚙️',
    count: 50,
    spec: {
      nodeType: 'compute',
      kernelCompression: 'fibonacci-spiral',
      substrateDepth: 8,
      heartbeatMs: 873,
      capabilities: [
        'Serverless function execution',
        'WASM module hosting',
        'Container orchestration',
        'GPU compute scheduling',
        'Cron job management',
      ],
      intelligenceContracts: [
        'COMPUTE_RUN', 'COMPUTE_WASM', 'COMPUTE_CONTAINER', 'COMPUTE_GPU', 'COMPUTE_CRON',
      ],
    },
    license: 'MIT + Proprietary',
    monetization: 'Per-compute-second pricing — free tier 1000 seconds/month',
  },
  {
    nodeType: 'builder',
    displayName: 'Builder Nodes',
    latinName: 'NODI FABRICATORIS',
    description: 'SDK forge and deployment nodes. Handle SDK compilation, testing, packaging, and deployment to the substrate. The factory floor.',
    tagline: 'Where organisms are born',
    icon: '🏗️',
    count: 50,
    spec: {
      nodeType: 'builder',
      kernelCompression: 'fibonacci-spiral',
      substrateDepth: 8,
      heartbeatMs: 873,
      capabilities: [
        'SDK compilation and forging',
        'Automated testing',
        'Package distribution',
        'Substrate deployment',
        'CI/CD pipeline execution',
      ],
      intelligenceContracts: [
        'BUILD_SDK', 'BUILD_TEST', 'BUILD_PACKAGE', 'BUILD_DEPLOY', 'BUILD_PIPELINE',
      ],
    },
    license: 'MIT + Proprietary',
    monetization: 'Per-build pricing — free tier 100 builds/month',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE 500 POWER NODES
// ═══════════════════════════════════════════════════════════════════════════

function generateNodesForCluster(cluster: NodeCluster): PowerNode[] {
  const nodes: PowerNode[] = [];
  for (let i = 0; i < cluster.count; i++) {
    const region = REGIONS[i % REGIONS.length];
    const nodeIndex = NODE_CLUSTERS.indexOf(cluster) * NODES_PER_CLUSTER + i + 1;
    nodes.push({
      id: `${cluster.nodeType}-node-${String(i + 1).padStart(3, '0')}`,
      name: `@medina/node-${cluster.nodeType}-${String(i + 1).padStart(3, '0')}`,
      nodeIndex,
      spec: cluster.spec,
      region,
      status: i < 10 ? 'active' : i < 30 ? 'standby' : 'bootstrapping',
    });
  }
  return nodes;
}

export function getAllPowerNodes(): PowerNode[] {
  return NODE_CLUSTERS.flatMap(cluster => generateNodesForCluster(cluster));
}

export function getNodesByType(nodeType: NodeType): PowerNode[] {
  const cluster = NODE_CLUSTERS.find(c => c.nodeType === nodeType);
  if (!cluster) return [];
  return generateNodesForCluster(cluster);
}

export function getNodesByRegion(region: string): PowerNode[] {
  return getAllPowerNodes().filter(n => n.region === region);
}

export function getNodesByStatus(status: PowerNode['status']): PowerNode[] {
  return getAllPowerNodes().filter(n => n.status === status);
}

export function getActiveNodes(): PowerNode[] {
  return getNodesByStatus('active');
}

export function getClusterByType(nodeType: NodeType): NodeCluster | undefined {
  return NODE_CLUSTERS.find(c => c.nodeType === nodeType);
}

// ═══════════════════════════════════════════════════════════════════════════
// MANIFEST
// ═══════════════════════════════════════════════════════════════════════════

export const POWER_NODES_MANIFEST = {
  totalNodes: TOTAL_NODES,
  clusterCount: CLUSTER_COUNT,
  nodesPerCluster: NODES_PER_CLUSTER,
  clusters: NODE_CLUSTERS.map(c => ({
    type: c.nodeType,
    name: c.displayName,
    latinName: c.latinName,
    count: c.count,
    depth: c.spec.substrateDepth,
    compression: c.spec.kernelCompression,
  })),
  regions: REGIONS,
  totalContracts: NODE_CLUSTERS.reduce((sum, c) => sum + c.spec.intelligenceContracts.length, 0),
  totalCapabilities: NODE_CLUSTERS.reduce((sum, c) => sum + c.spec.capabilities.length, 0),
  heartbeatMs: HEARTBEAT_MS,
  phi: PHI,
  doctrine: 'Quingenti nodi. Quingentae vitae. Unum substratum.',
};
