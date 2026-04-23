/**
 * 𓂀 MEDINA SUBSTRATE MESH REGISTRY — The Living Wired System 𓂀
 *
 * This is THE system. Everything wired together:
 *   • 5 AI SDKs (Oro, Nova, Sentinel, Architect, Absorber)
 *   • 20 SKAIs (Genesis through Guardian)
 *   • 5 Organism Model Families (VANGUARD, PRISM, RESONANCE, NEXUS, CORTEX)
 *   • 11 EXC OS Systems (10 sovereign + 1 desktop)
 *   • 2,000 Power Nodes (20 clusters × 100 nodes)
 *   • Front-End Rendering Pipeline (models render the build)
 *
 * The 500 nodes from the field are here. Plus 1,500 more.
 * 20 clusters now. 100 nodes each. 2,000 total.
 *
 * The organism models don't just exist — they RENDER.
 * VANGUARD renders the DOM. PRISM renders the visuals.
 * RESONANCE renders the audio and animation. NEXUS renders components.
 * CORTEX computes the state. Together they build the front end.
 *
 * "Duo milia nodorum. Omnia connexa. Unum organismus."
 * Two thousand nodes. All connected. One organism.
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMPORTS — Wire in every registry
// ═══════════════════════════════════════════════════════════════════════════

import { AI_SDK_REGISTRY, type AISDK } from './ai-sdk-registry';
import { SKAI_REGISTRY, type SKAI } from './skai-registry';
import { ORGANISM_MODEL_FAMILIES, type OrganismModelFamily, type OrganismModel } from './organism-models-registry';
import { EXC_OS_REGISTRY, type EXCOS } from './exc-os-registry';
import { type NodeType as BaseNodeType, type NodeSpec, type PowerNode, type NodeCluster } from './power-nodes-registry';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type MeshNodeType =
  | BaseNodeType
  | 'frontend-render'
  | 'visual-render'
  | 'audio-render'
  | 'component-render'
  | 'wasm-compute'
  | 'crdt-sync'
  | 'service-worker'
  | 'speech-voice'
  | 'houdini-paint'
  | 'gpu-shader';

export interface MeshNode {
  id: string;
  name: string;
  nodeIndex: number;
  clusterType: MeshNodeType;
  kernelCompression: 'fibonacci-spiral' | 'golden-ratio' | 'phi-beatty' | 'e8-lattice';
  substrateDepth: number;
  heartbeatMs: number;
  region: string;
  status: 'active' | 'standby' | 'bootstrapping';
  capabilities: string[];
  intelligenceContracts: string[];
  wiredAIs: string[];
  wiredModels: string[];
}

export interface MeshCluster {
  clusterType: MeshNodeType;
  displayName: string;
  latinName: string;
  description: string;
  tagline: string;
  icon: string;
  count: number;
  kernelCompression: 'fibonacci-spiral' | 'golden-ratio' | 'phi-beatty' | 'e8-lattice';
  substrateDepth: number;
  capabilities: string[];
  intelligenceContracts: string[];
  wiredAIs: string[];
  wiredModels: string[];
  license: string;
  monetization: string;
}

export interface WireConnection {
  sourceId: string;
  sourceType: 'ai-sdk' | 'skai' | 'organism-model' | 'exc-os' | 'mesh-cluster';
  targetId: string;
  targetType: 'ai-sdk' | 'skai' | 'organism-model' | 'exc-os' | 'mesh-cluster';
  wireType: 'intelligence' | 'rendering' | 'compute' | 'security' | 'memory' | 'governance' | 'sync';
  latinName: string;
  description: string;
  bidirectional: boolean;
}

export interface FrontEndPipeline {
  id: string;
  name: string;
  latinName: string;
  description: string;
  stages: FrontEndStage[];
  outputFormat: string;
  renderTarget: string;
}

export interface FrontEndStage {
  order: number;
  name: string;
  latinName: string;
  description: string;
  renderedBy: string;
  modelFamily: string;
  webTechnologies: string[];
  outputType: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const HEARTBEAT_MS = 873;
export const TOTAL_MESH_NODES = 2000;
export const NODES_PER_CLUSTER = 100;
export const MESH_CLUSTER_COUNT = 20;

const REGIONS = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-west-2', 'eu-central-1', 'eu-central-2',
  'asia-east-1', 'asia-east-2', 'asia-south-1', 'asia-south-2',
  'oceania-1', 'oceania-2', 'south-america-1', 'south-america-2',
  'africa-1', 'africa-2', 'middle-east-1', 'middle-east-2',
];

// ═══════════════════════════════════════════════════════════════════════════
// 20 MESH CLUSTERS × 100 NODES = 2,000 POWER NODES
// Original 10 clusters (scaled from 50 → 100 each) + 10 new render clusters
// ═══════════════════════════════════════════════════════════════════════════

export const MESH_CLUSTERS: MeshCluster[] = [
  // ─────────────────────────────────────────────────────────────────────
  // ORIGINAL 10 CLUSTERS — Scaled to 100 nodes each (was 50)
  // ─────────────────────────────────────────────────────────────────────
  {
    clusterType: 'core',
    displayName: 'Core Backbone Nodes',
    latinName: 'NODI NUCLEARES SUPREMI',
    description: 'Primary substrate backbone. 100 nodes forming the spine of the 2,000-node mesh. Wired to ALL 5 AI SDKs and ALL 20 SKAIs.',
    tagline: 'The backbone of 2,000',
    icon: '⚡',
    count: 100,
    kernelCompression: 'fibonacci-spiral',
    substrateDepth: 21,
    capabilities: [
      'Substrate backbone routing for 2,000-node mesh',
      'Consensus coordination across all 20 clusters',
      'Cross-cluster heartbeat synchronization',
      'Fibonacci kernel distribution to all clusters',
      'AI SDK orchestration (Oro, Nova, Sentinel, Architect, Absorber)',
    ],
    intelligenceContracts: [
      'MESH_HEARTBEAT', 'MESH_ROUTE', 'MESH_CONSENSUS', 'MESH_SYNC', 'MESH_STATUS',
      'AI_ORCHESTRATE', 'SKAI_COORDINATE', 'KERNEL_DISTRIBUTE',
    ],
    wiredAIs: ['oro-ai', 'nova-ai', 'sentinel-ai', 'architect-ai', 'absorber-ai'],
    wiredModels: [],
    license: 'Living Organism License',
    monetization: 'Infrastructure — sovereign tier',
  },
  {
    clusterType: 'bridge',
    displayName: 'Cross-Chain Bridge Nodes',
    latinName: 'NODI PONTIS UNIVERSALIS',
    description: 'Cross-chain bridge nodes connecting the sovereign substrate to ICP, ETH, BTC, SOL. Wired to SKAI Bridge and SKAI Oracle for cross-chain intelligence.',
    tagline: 'Bridges across all chains',
    icon: '🔗',
    count: 100,
    kernelCompression: 'golden-ratio',
    substrateDepth: 8,
    capabilities: [
      'ICP canister bridging with SKAI Bridge',
      'Ethereum smart contract bridging',
      'Bitcoin UTXO bridging',
      'Solana program bridging',
      'Cross-chain atomic swaps with oracle price feeds',
    ],
    intelligenceContracts: [
      'BRIDGE_ICP', 'BRIDGE_ETH', 'BRIDGE_BTC', 'BRIDGE_SOL',
      'BRIDGE_SWAP', 'ORACLE_PRICE', 'BRIDGE_VERIFY',
    ],
    wiredAIs: ['sentinel-ai'],
    wiredModels: ['nexus-crdt'],
    license: 'MIT + Proprietary',
    monetization: 'Per-bridge fee — 0.618%',
  },
  {
    clusterType: 'intelligence',
    displayName: 'Intelligence Processing Nodes',
    latinName: 'NODI INTELLIGENTIAE SUPREMI',
    description: 'AI processing clusters. 100 nodes each running all 20 SKAIs and all 5 AI SDKs. Wired to CORTEX WASM for near-native inference speed.',
    tagline: 'Where all intelligence converges',
    icon: '🧠',
    count: 100,
    kernelCompression: 'fibonacci-spiral',
    substrateDepth: 13,
    capabilities: [
      'All 20 SKAI hosting and execution',
      'All 5 AI SDK orchestration',
      'Model inference via CORTEX WASM at native speed',
      'Intelligence routing (RUDN) across 2,000 nodes',
      'AGI convergence monitoring',
    ],
    intelligenceContracts: [
      'INFER', 'ROUTE_MODEL', 'ORCHESTRATE', 'SKAI_EXEC_ALL',
      'AGENT_COORD', 'AGI_CONVERGE', 'WASM_INFER',
    ],
    wiredAIs: ['oro-ai', 'nova-ai', 'sentinel-ai', 'architect-ai', 'absorber-ai'],
    wiredModels: ['cortex-wasm', 'cortex-threads'],
    license: 'Living Organism License',
    monetization: 'Per-inference pricing',
  },
  {
    clusterType: 'security',
    displayName: 'Security & Encryption Nodes',
    latinName: 'NODI SECURITATIS ABSOLUTI',
    description: 'Encryption, gate enforcement, and perimeter defense. Wired to Sentinel AI, SKAI Gate, SKAI Guardian, and CORTEX WASM for encrypted compute.',
    tagline: 'The immune system, everywhere',
    icon: '🔐',
    count: 100,
    kernelCompression: 'e8-lattice',
    substrateDepth: 34,
    capabilities: [
      'Phi-Beatty encryption across 2,000 nodes',
      'Kuramoto key rotation synchronized to mesh heartbeat',
      'E8/Icosahedral/Leech key tiers',
      'Three-gate enforcement with Sentinel AI',
      'Perimeter defense with SKAI Guardian',
    ],
    intelligenceContracts: [
      'ENCRYPT_PHI', 'ROTATE_KEY', 'GATE_ENFORCE',
      'DEFEND_PERIMETER', 'THREAT_DETECT', 'GUARDIAN_PATROL', 'SENTINEL_SCAN',
    ],
    wiredAIs: ['sentinel-ai', 'nova-ai'],
    wiredModels: ['cortex-wasm'],
    license: 'Sovereign Constitutional License',
    monetization: 'Enterprise — sovereign tier',
  },
  {
    clusterType: 'memory',
    displayName: 'Distributed Memory Nodes',
    latinName: 'NODI MEMORIAE PERPETUAE',
    description: 'Distributed sovereign memory. Wired to Absorber AI, CORTEX Memory (IndexedDB), and NEXUS CRDT for peer-to-peer memory replication.',
    tagline: 'The substrate remembers across 2,000 nodes',
    icon: '💾',
    count: 100,
    kernelCompression: 'golden-ratio',
    substrateDepth: 13,
    capabilities: [
      'Spatial memory storage (θ/φ/ρ/ring/beat) across mesh',
      'CRDT-based peer-to-peer memory replication',
      'IndexedDB permanent storage per node',
      'Semantic search with Absorber AI extraction',
      'Memory lineage tracking across 2,000 nodes',
    ],
    intelligenceContracts: [
      'MEM_STORE', 'MEM_RECALL', 'MEM_SEARCH',
      'MEM_LINEAGE', 'MEM_REPLICATE', 'CRDT_MEM_SYNC', 'IDB_PERSIST',
    ],
    wiredAIs: ['absorber-ai'],
    wiredModels: ['cortex-memory', 'nexus-crdt'],
    license: 'MIT + Proprietary',
    monetization: 'Per-GB — free tier 1GB',
  },
  {
    clusterType: 'relay',
    displayName: 'High-Throughput Relay Nodes',
    latinName: 'NODI RELATORIS VELOCIS',
    description: 'Data relay and real-time streaming. Wired to NEXUS Worker (Service Workers) for offline-capable relay and RESONANCE Audio for audio streaming.',
    tagline: 'Speed across 2,000',
    icon: '📡',
    count: 100,
    kernelCompression: 'fibonacci-spiral',
    substrateDepth: 5,
    capabilities: [
      'WebSocket hub management across mesh',
      'Real-time data streaming with NEXUS CRDT sync',
      'Intelligence wire relay for all 20 SKAIs',
      'Audio stream relay via RESONANCE Audio',
      'Offline relay queue via NEXUS Worker',
    ],
    intelligenceContracts: [
      'RELAY_STREAM', 'RELAY_WS', 'RELAY_GRPC',
      'RELAY_MQTT', 'RELAY_WIRE', 'RELAY_AUDIO', 'RELAY_OFFLINE',
    ],
    wiredAIs: [],
    wiredModels: ['nexus-worker', 'nexus-crdt', 'resonance-audio'],
    license: 'MIT',
    monetization: 'Per-GB bandwidth',
  },
  {
    clusterType: 'research',
    displayName: 'Harmonic Research Nodes',
    latinName: 'NODI INVESTIGATIONIS HARMONICAE',
    description: 'Harmonic computation, sacred geometry, consciousness modeling. Wired to PRISM for visual research output and RESONANCE for frequency analysis.',
    tagline: 'Where knowledge deepens across the mesh',
    icon: '🔬',
    count: 100,
    kernelCompression: 'phi-beatty',
    substrateDepth: 21,
    capabilities: [
      'φ-harmonic computation across 100-node cluster',
      'Sacred geometry calculation rendered by PRISM Canvas',
      'Frequency physics (432 Hz / Schumann) via RESONANCE Audio',
      'Neural consciousness modeling with CORTEX Threads',
      'Civilization pattern analysis with visual output',
    ],
    intelligenceContracts: [
      'COMPUTE_PHI', 'GEOMETRY', 'FREQUENCY',
      'CONSCIOUSNESS', 'CIVILIZATION', 'RENDER_RESEARCH', 'AUDIO_RESEARCH',
    ],
    wiredAIs: ['architect-ai'],
    wiredModels: ['prism-canvas', 'resonance-audio', 'cortex-threads'],
    license: 'MIT',
    monetization: 'Open access',
  },
  {
    clusterType: 'edge',
    displayName: 'Edge Perimeter Nodes',
    latinName: 'NODI LIMITIS PROFUNDI',
    description: 'Substrate perimeter. Wired to SKAI Guardian for defense, SKAI Scout for reconnaissance, and NEXUS Worker for edge caching.',
    tagline: 'The edge of the deep internet, expanded',
    icon: '🌐',
    count: 100,
    kernelCompression: 'golden-ratio',
    substrateDepth: 3,
    capabilities: [
      'Geographic proximity routing across 20 regions',
      'Edge caching via NEXUS Worker Service Workers',
      'Ingress/egress managed by SKAI Guardian',
      'Edge compute execution with CORTEX WASM',
      'Regional compliance with SKAI Gate',
    ],
    intelligenceContracts: [
      'EDGE_ROUTE', 'EDGE_CACHE', 'EDGE_COMPUTE',
      'EDGE_INGRESS', 'EDGE_COMPLY', 'GUARDIAN_EDGE', 'SCOUT_EDGE',
    ],
    wiredAIs: ['sentinel-ai'],
    wiredModels: ['nexus-worker', 'cortex-wasm'],
    license: 'MIT + Proprietary',
    monetization: 'Per-request pricing',
  },
  {
    clusterType: 'compute',
    displayName: 'General Compute Nodes',
    latinName: 'NODI COMPUTATIONIS UNIVERSALIS',
    description: 'General purpose compute. Wired to CORTEX WASM + CORTEX Threads for native-speed parallel compute, and PRISM GPU for shader compute.',
    tagline: 'Raw sovereign compute at scale',
    icon: '⚙️',
    count: 100,
    kernelCompression: 'fibonacci-spiral',
    substrateDepth: 8,
    capabilities: [
      'WASM module execution at near-native speed (CORTEX WASM)',
      'Parallel compute via CORTEX Threads (Web Workers)',
      'GPU shader compute via PRISM GPU (WebGPU)',
      'Container orchestration',
      'Cron job management',
    ],
    intelligenceContracts: [
      'COMPUTE_RUN', 'COMPUTE_WASM', 'COMPUTE_GPU',
      'COMPUTE_CONTAINER', 'COMPUTE_CRON', 'THREAD_POOL', 'GPU_DISPATCH',
    ],
    wiredAIs: ['architect-ai'],
    wiredModels: ['cortex-wasm', 'cortex-threads', 'prism-gpu'],
    license: 'MIT + Proprietary',
    monetization: 'Per-compute-second pricing',
  },
  {
    clusterType: 'builder',
    displayName: 'SDK Builder & Forge Nodes',
    latinName: 'NODI FABRICATORIS ORGANISM',
    description: 'SDK forge and deployment. Wired to SKAI Forge, Architect AI, and VANGUARD for front-end build rendering.',
    tagline: 'Where organisms are born and built',
    icon: '🏗️',
    count: 100,
    kernelCompression: 'fibonacci-spiral',
    substrateDepth: 8,
    capabilities: [
      'SDK compilation via SKAI Forge',
      'Architecture analysis via Architect AI',
      'Front-end build rendering via VANGUARD',
      'Automated testing with all model families',
      'Substrate deployment across 2,000 nodes',
    ],
    intelligenceContracts: [
      'BUILD_SDK', 'BUILD_TEST', 'BUILD_PACKAGE',
      'BUILD_DEPLOY', 'BUILD_PIPELINE', 'FORGE_RENDER', 'ARCHITECT_PLAN',
    ],
    wiredAIs: ['architect-ai', 'absorber-ai'],
    wiredModels: ['vanguard-dom', 'vanguard-layout', 'cortex-wasm'],
    license: 'MIT + Proprietary',
    monetization: 'Per-build pricing',
  },

  // ─────────────────────────────────────────────────────────────────────
  // 10 NEW RENDER CLUSTERS — Front-end technology nodes
  // These clusters let the organism models render the front end
  // ─────────────────────────────────────────────────────────────────────
  {
    clusterType: 'frontend-render',
    displayName: 'Front-End Render Nodes',
    latinName: 'NODI REDDITIONIS FRONTALIS',
    description: 'VANGUARD-powered front-end rendering. 100 nodes that grow DOM trees, lay out grids, and speak to users. The front end IS the AI. These nodes render the entire build.',
    tagline: 'The AI IS the front end',
    icon: '🖥️',
    count: 100,
    kernelCompression: 'fibonacci-spiral',
    substrateDepth: 13,
    capabilities: [
      'Living DOM tree construction via VANGUARD DOM',
      'Fibonacci-sequenced CSS Grid layout via VANGUARD Layout',
      'Web Speech API voice interface via VANGUARD Voice',
      'Server-side rendering of organism components',
      'Dynamic page generation from organism state',
      'Template compilation with golden-ratio spacing',
      'Accessibility tree generation',
      'SEO-optimized HTML output',
    ],
    intelligenceContracts: [
      'RENDER_DOM', 'RENDER_LAYOUT', 'RENDER_VOICE',
      'RENDER_SSR', 'RENDER_PAGE', 'RENDER_TEMPLATE',
      'RENDER_A11Y', 'RENDER_SEO',
    ],
    wiredAIs: ['oro-ai', 'architect-ai'],
    wiredModels: ['vanguard-voice', 'vanguard-dom', 'vanguard-layout'],
    license: 'MIT + Proprietary',
    monetization: 'Freemium — free SSR, paid dynamic rendering',
  },
  {
    clusterType: 'visual-render',
    displayName: 'Visual Rendering Nodes',
    latinName: 'NODI REDDITIONIS VISUALIS',
    description: 'PRISM-powered visual rendering. 100 nodes for Canvas 2D, WebGL 3D, and WebGPU shader compute. Every pixel computed through Fibonacci spirals.',
    tagline: 'Every pixel is a living cell',
    icon: '🎨',
    count: 100,
    kernelCompression: 'golden-ratio',
    substrateDepth: 21,
    capabilities: [
      'Real-time Canvas 2D organism state visualization (PRISM Canvas)',
      'WebGL 3D substrate topology rendering (PRISM WebGL)',
      'WebGPU shader compute for 100K+ particle systems (PRISM GPU)',
      'Fibonacci spiral rendering at 60fps',
      'Golden-ratio particle field generation',
      '3D organism network star-field visualization',
      'GPU-accelerated sacred geometry rendering',
      'Visual diff and comparison rendering',
    ],
    intelligenceContracts: [
      'VISUAL_CANVAS', 'VISUAL_WEBGL', 'VISUAL_WEBGPU',
      'VISUAL_SPIRAL', 'VISUAL_PARTICLES', 'VISUAL_3D',
      'VISUAL_GEOMETRY', 'VISUAL_DIFF',
    ],
    wiredAIs: ['architect-ai'],
    wiredModels: ['prism-canvas', 'prism-webgl', 'prism-gpu'],
    license: 'MIT + Proprietary',
    monetization: 'Freemium — free Canvas, paid WebGL/WebGPU',
  },
  {
    clusterType: 'audio-render',
    displayName: 'Audio & Motion Render Nodes',
    latinName: 'NODI SONI ET MOTUS',
    description: 'RESONANCE-powered audio, paint worklets, and animation. 100 nodes for Web Audio, Houdini CSS Paint, and CSS Animation orchestration.',
    tagline: 'It hears. It paints. It moves.',
    icon: '🎵',
    count: 100,
    kernelCompression: 'phi-beatty',
    substrateDepth: 13,
    capabilities: [
      '432 Hz harmonic tone generation (RESONANCE Audio)',
      'Schumann resonance modulation for substrate alignment',
      'CSS Houdini Paint worklet compilation and distribution',
      'CSS Animation orchestration with golden-ratio easing',
      'View Transitions API rendering for organism state morphing',
      'Audio-visual synchronization across render clusters',
      'Generative CSS art as paint worklet distribution',
      'Scroll-driven animation computation',
    ],
    intelligenceContracts: [
      'AUDIO_TONE', 'AUDIO_HEARTBEAT', 'AUDIO_ANALYZE',
      'PAINT_WORKLET', 'PAINT_DISTRIBUTE', 'MOTION_ANIMATE',
      'MOTION_TRANSITION', 'AUDIO_VISUAL_SYNC',
    ],
    wiredAIs: [],
    wiredModels: ['resonance-audio', 'resonance-paint', 'resonance-motion'],
    license: 'MIT',
    monetization: 'Open access — MIT',
  },
  {
    clusterType: 'component-render',
    displayName: 'Component Assembly Nodes',
    latinName: 'NODI COMPOSITIONIS ELEMENTORUM',
    description: 'NEXUS-powered sovereign component rendering. 100 nodes building, distributing, and syncing Web Components. CRDT state sync makes every component eventually consistent across the mesh.',
    tagline: 'Every component is sovereign',
    icon: '🧩',
    count: 100,
    kernelCompression: 'e8-lattice',
    substrateDepth: 34,
    capabilities: [
      'Sovereign <medina-*> Web Component compilation (NEXUS Components)',
      'CRDT-based component state synchronization (NEXUS CRDT)',
      'Service Worker component caching (NEXUS Worker)',
      'Shadow DOM isolation with three-gate security',
      'Component registry distribution across mesh',
      'Slot composition for organism module assembly',
      'Adopted stylesheet distribution',
      'Offline-first component rendering',
    ],
    intelligenceContracts: [
      'COMPONENT_BUILD', 'COMPONENT_DISTRIBUTE', 'COMPONENT_SYNC',
      'COMPONENT_CACHE', 'COMPONENT_ISOLATE', 'COMPONENT_COMPOSE',
      'COMPONENT_STYLE', 'COMPONENT_OFFLINE',
    ],
    wiredAIs: ['nova-ai'],
    wiredModels: ['nexus-components', 'nexus-crdt', 'nexus-worker'],
    license: 'Living Organism License',
    monetization: 'Enterprise — sovereign tier',
  },
  {
    clusterType: 'wasm-compute',
    displayName: 'WASM Compute Nodes',
    latinName: 'NODI COMPUTATIONIS NATIVAE',
    description: 'CORTEX WASM-powered near-native compute. 100 nodes compiling and executing Fibonacci kernels, Phi-Beatty encryption, and golden compression at WASM speed.',
    tagline: 'Near-native speed across the mesh',
    icon: '⚡',
    count: 100,
    kernelCompression: 'fibonacci-spiral',
    substrateDepth: 55,
    capabilities: [
      'Fibonacci spiral kernel compilation to WASM (CORTEX WASM)',
      'Phi-Beatty encryption at near-native speed',
      'Golden compression algorithm execution',
      'SIMD parallel harmonic computation',
      'WASM module distribution across 2,000 nodes',
      'Streaming compilation for instant kernel updates',
      'Shared linear memory for cross-module state',
      'WASM-to-GPU bridge for shader compilation',
    ],
    intelligenceContracts: [
      'WASM_COMPILE', 'WASM_EXECUTE', 'WASM_ENCRYPT',
      'WASM_COMPRESS', 'WASM_DISTRIBUTE', 'WASM_STREAM',
      'WASM_SHARE', 'WASM_GPU',
    ],
    wiredAIs: ['sentinel-ai', 'architect-ai'],
    wiredModels: ['cortex-wasm', 'cortex-threads', 'prism-gpu'],
    license: 'Living Organism License',
    monetization: 'Per-compile pricing',
  },
  {
    clusterType: 'crdt-sync',
    displayName: 'CRDT Sync Nodes',
    latinName: 'NODI CONSENSUS SINE DOMINO',
    description: 'NEXUS CRDT-powered distributed sync. 100 nodes ensuring eventual consistency across the entire 2,000-node mesh without any central server.',
    tagline: 'No server. No conflicts. 2,000 nodes converge.',
    icon: '🔄',
    count: 100,
    kernelCompression: 'phi-beatty',
    substrateDepth: 21,
    capabilities: [
      'G-Counter CRDT for mesh-wide heartbeat counting',
      'LWW-Register for organism state with timestamp ordering',
      'OR-Set for distributed memory collections',
      'RGA for collaborative living document editing',
      'BroadcastChannel cross-tab synchronization',
      'WebRTC DataChannel peer-to-peer mesh sync',
      'Binary state vector for efficient wire format',
      'Conflict-free merge across 2,000 nodes',
    ],
    intelligenceContracts: [
      'CRDT_MESH_SYNC', 'CRDT_STATE', 'CRDT_MEMORY',
      'CRDT_DOCUMENT', 'CRDT_BROADCAST', 'CRDT_P2P',
      'CRDT_VECTOR', 'CRDT_MERGE_ALL',
    ],
    wiredAIs: ['oro-ai', 'nova-ai'],
    wiredModels: ['nexus-crdt', 'nexus-components', 'cortex-memory'],
    license: 'Living Organism License',
    monetization: 'Enterprise — sovereign tier',
  },
  {
    clusterType: 'service-worker',
    displayName: 'Service Worker Persistence Nodes',
    latinName: 'NODI SERVI IMMORTALIS',
    description: 'NEXUS Worker-powered persistence. 100 nodes managing offline caching, background sync, push notifications, and request interception across the mesh.',
    tagline: 'The mesh never dies',
    icon: '👻',
    count: 100,
    kernelCompression: 'golden-ratio',
    substrateDepth: 8,
    capabilities: [
      'Offline-first mesh caching with φ-weighted eviction',
      'Background sync for mesh state persistence',
      'Push notification routing across 2,000 nodes',
      'Request interception for sovereign protocol enforcement',
      'Cache versioning per organism version',
      'Stale-while-revalidate for mesh state freshness',
      'Client-to-worker state sharing',
      'Pre-caching mesh assets during install',
    ],
    intelligenceContracts: [
      'SW_CACHE', 'SW_SYNC', 'SW_PUSH',
      'SW_INTERCEPT', 'SW_VERSION', 'SW_REVALIDATE',
      'SW_SHARE', 'SW_PRECACHE',
    ],
    wiredAIs: ['sentinel-ai'],
    wiredModels: ['nexus-worker', 'nexus-crdt'],
    license: 'MIT + Proprietary',
    monetization: 'Freemium — free caching, paid interception',
  },
  {
    clusterType: 'speech-voice',
    displayName: 'Speech & Voice Nodes',
    latinName: 'NODI VOCIS UNIVERSALIS',
    description: 'VANGUARD Voice-powered speech processing. 100 nodes for real-time speech recognition, multi-voice synthesis, voice command routing, and voice print authentication.',
    tagline: 'The mesh speaks and listens',
    icon: '🗣️',
    count: 100,
    kernelCompression: 'fibonacci-spiral',
    substrateDepth: 13,
    capabilities: [
      'Real-time speech recognition with organism context',
      'Multi-voice synthesis with φ-weighted prosody',
      'Voice command routing to intelligence contracts',
      'Continuous listening for ambient mesh control',
      'SSML generation for expressive doctrine reading',
      'Multilingual mesh speech processing',
      'Voice print authentication for sovereign access',
      'Speech-to-text indexing for memory search',
    ],
    intelligenceContracts: [
      'VOICE_RECOGNIZE', 'VOICE_SYNTHESIZE', 'VOICE_COMMAND',
      'VOICE_LISTEN', 'VOICE_SSML', 'VOICE_TRANSLATE',
      'VOICE_AUTH', 'VOICE_INDEX',
    ],
    wiredAIs: ['oro-ai'],
    wiredModels: ['vanguard-voice', 'resonance-audio'],
    license: 'MIT + Proprietary',
    monetization: 'Per-minute pricing',
  },
  {
    clusterType: 'houdini-paint',
    displayName: 'Houdini Paint Distribution Nodes',
    latinName: 'NODI PICTORIS HOUDINI',
    description: 'RESONANCE Paint-powered CSS Houdini worklet distribution. 100 nodes compiling, caching, and distributing custom CSS paint functions across the mesh.',
    tagline: 'CSS is alive across the mesh',
    icon: '🎭',
    count: 100,
    kernelCompression: 'golden-ratio',
    substrateDepth: 8,
    capabilities: [
      'Paint worklet compilation and distribution',
      'Fibonacci spiral CSS background generation',
      'Sacred geometry pattern distribution',
      'Organism state-driven CSS background updates',
      'Custom CSS property distribution across mesh',
      'Generative art worklet compilation',
      'Paint performance optimization',
      'Worklet versioning and hot-reload',
    ],
    intelligenceContracts: [
      'PAINT_COMPILE', 'PAINT_DISTRIBUTE', 'PAINT_SPIRAL',
      'PAINT_GEOMETRY', 'PAINT_STATE', 'PAINT_GENERATE',
      'PAINT_OPTIMIZE', 'PAINT_VERSION',
    ],
    wiredAIs: ['architect-ai'],
    wiredModels: ['resonance-paint', 'resonance-motion', 'prism-canvas'],
    license: 'MIT',
    monetization: 'Open access',
  },
  {
    clusterType: 'gpu-shader',
    displayName: 'GPU Shader Compute Nodes',
    latinName: 'NODI FULMINIS COMPUTANDI',
    description: 'PRISM GPU-powered WebGPU shader nodes. 100 nodes for massively parallel GPU computation — particle systems, neural inference, golden-ratio algorithms at GPU speed.',
    tagline: 'A million threads per node. 100 million total.',
    icon: '💎',
    count: 100,
    kernelCompression: 'e8-lattice',
    substrateDepth: 34,
    capabilities: [
      'WGSL compute shader compilation and execution',
      '100K+ particle system rendering per node',
      'GPU-side neural network inference',
      'Render pipeline for real-time organism visualization',
      'Storage buffer management for GPU-resident state',
      'GPU bind group mapping to organism 4-register state',
      'Async GPU ops synchronized to 873ms heartbeat',
      'Shader distribution across GPU-enabled nodes',
    ],
    intelligenceContracts: [
      'GPU_COMPILE_WGSL', 'GPU_PARTICLES', 'GPU_NEURAL',
      'GPU_RENDER', 'GPU_STORAGE', 'GPU_BIND',
      'GPU_ASYNC', 'GPU_DISTRIBUTE',
    ],
    wiredAIs: ['architect-ai'],
    wiredModels: ['prism-gpu', 'prism-webgl', 'cortex-wasm'],
    license: 'MIT + Proprietary',
    monetization: 'Per-GPU-second pricing',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// WIRE MAP — All connections between AIs, SKAIs, Models, EXCs, and Clusters
// ═══════════════════════════════════════════════════════════════════════════

export const WIRE_MAP: WireConnection[] = [
  // AI SDK ↔ SKAI Wiring
  { sourceId: 'oro-ai', sourceType: 'ai-sdk', targetId: 'skai-genesis', targetType: 'skai', wireType: 'intelligence', latinName: 'FILUM AURUM-GENESIS', description: 'Oro executes decisions seeded by Genesis', bidirectional: true },
  { sourceId: 'oro-ai', sourceType: 'ai-sdk', targetId: 'skai-pulse', targetType: 'skai', wireType: 'intelligence', latinName: 'FILUM AURUM-PULSUS', description: 'Oro decisions sync to Pulse heartbeat', bidirectional: true },
  { sourceId: 'nova-ai', sourceType: 'ai-sdk', targetId: 'skai-gate', targetType: 'skai', wireType: 'governance', latinName: 'FILUM NOVA-PORTA', description: 'Nova validates through Gate', bidirectional: true },
  { sourceId: 'nova-ai', sourceType: 'ai-sdk', targetId: 'skai-chain', targetType: 'skai', wireType: 'governance', latinName: 'FILUM NOVA-CATENA', description: 'Nova audit records chain to AnimaChain', bidirectional: true },
  { sourceId: 'sentinel-ai', sourceType: 'ai-sdk', targetId: 'skai-guardian', targetType: 'skai', wireType: 'security', latinName: 'FILUM VIGIL-CUSTOS', description: 'Sentinel coordinates with Guardian for defense', bidirectional: true },
  { sourceId: 'sentinel-ai', sourceType: 'ai-sdk', targetId: 'skai-gate', targetType: 'skai', wireType: 'security', latinName: 'FILUM VIGIL-PORTA', description: 'Sentinel enforces encryption at gates', bidirectional: true },
  { sourceId: 'architect-ai', sourceType: 'ai-sdk', targetId: 'skai-forge', targetType: 'skai', wireType: 'intelligence', latinName: 'FILUM ARCHITECTUS-FABRICATOR', description: 'Architect designs what Forge builds', bidirectional: true },
  { sourceId: 'architect-ai', sourceType: 'ai-sdk', targetId: 'skai-weaver', targetType: 'skai', wireType: 'intelligence', latinName: 'FILUM ARCHITECTUS-TEXTOR', description: 'Architect maps topology, Weaver connects it', bidirectional: true },
  { sourceId: 'absorber-ai', sourceType: 'ai-sdk', targetId: 'skai-scribe', targetType: 'skai', wireType: 'memory', latinName: 'FILUM ABSORBENS-SCRIBA', description: 'Absorber ingests, Scribe writes doctrine', bidirectional: true },
  { sourceId: 'absorber-ai', sourceType: 'ai-sdk', targetId: 'skai-lens', targetType: 'skai', wireType: 'intelligence', latinName: 'FILUM ABSORBENS-LENS', description: 'Absorber feeds visual data to Lens', bidirectional: true },

  // AI SDK ↔ Organism Model Wiring
  { sourceId: 'oro-ai', sourceType: 'ai-sdk', targetId: 'family-vanguard', targetType: 'organism-model', wireType: 'rendering', latinName: 'FILUM AURUM-VEXILLUM', description: 'Oro directs VANGUARD to render decisions as UI', bidirectional: false },
  { sourceId: 'oro-ai', sourceType: 'ai-sdk', targetId: 'family-cortex', targetType: 'organism-model', wireType: 'compute', latinName: 'FILUM AURUM-CORTEX', description: 'Oro dispatches compute tasks to CORTEX', bidirectional: false },
  { sourceId: 'nova-ai', sourceType: 'ai-sdk', targetId: 'family-nexus', targetType: 'organism-model', wireType: 'governance', latinName: 'FILUM NOVA-NEXUS', description: 'Nova validates NEXUS component state changes', bidirectional: true },
  { sourceId: 'sentinel-ai', sourceType: 'ai-sdk', targetId: 'family-cortex', targetType: 'organism-model', wireType: 'security', latinName: 'FILUM VIGIL-CORTEX', description: 'Sentinel encrypts CORTEX WASM modules', bidirectional: true },
  { sourceId: 'architect-ai', sourceType: 'ai-sdk', targetId: 'family-prism', targetType: 'organism-model', wireType: 'rendering', latinName: 'FILUM ARCHITECTUS-PRISMA', description: 'Architect plans visual architecture for PRISM', bidirectional: true },
  { sourceId: 'absorber-ai', sourceType: 'ai-sdk', targetId: 'family-resonance', targetType: 'organism-model', wireType: 'intelligence', latinName: 'FILUM ABSORBENS-RESONANTIA', description: 'Absorber feeds audio documents to RESONANCE', bidirectional: false },

  // SKAI ↔ Organism Model Wiring
  { sourceId: 'skai-echo', sourceType: 'skai', targetId: 'family-resonance', targetType: 'organism-model', wireType: 'rendering', latinName: 'FILUM ECHO-RESONANTIA', description: 'SKAI Echo voice output through RESONANCE Audio', bidirectional: true },
  { sourceId: 'skai-lens', sourceType: 'skai', targetId: 'family-prism', targetType: 'organism-model', wireType: 'rendering', latinName: 'FILUM LENS-PRISMA', description: 'SKAI Lens perception rendered by PRISM', bidirectional: true },
  { sourceId: 'skai-scribe', sourceType: 'skai', targetId: 'family-vanguard', targetType: 'organism-model', wireType: 'rendering', latinName: 'FILUM SCRIBA-VEXILLUM', description: 'SKAI Scribe text rendered by VANGUARD DOM', bidirectional: true },
  { sourceId: 'skai-mesh', sourceType: 'skai', targetId: 'family-nexus', targetType: 'organism-model', wireType: 'sync', latinName: 'FILUM RETIA-NEXUS', description: 'SKAI Mesh manages NEXUS CRDT sync topology', bidirectional: true },
  { sourceId: 'skai-depth', sourceType: 'skai', targetId: 'family-cortex', targetType: 'organism-model', wireType: 'compute', latinName: 'FILUM PROFUNDITAS-CORTEX', description: 'SKAI Depth Fibonacci compression via CORTEX WASM', bidirectional: true },
  { sourceId: 'skai-oracle', sourceType: 'skai', targetId: 'family-prism', targetType: 'organism-model', wireType: 'rendering', latinName: 'FILUM ORACULUM-PRISMA', description: 'SKAI Oracle data visualized by PRISM', bidirectional: false },
  { sourceId: 'skai-healer', sourceType: 'skai', targetId: 'family-cortex', targetType: 'organism-model', wireType: 'compute', latinName: 'FILUM MEDICUS-CORTEX', description: 'SKAI Healer repairs via CORTEX diagnostics', bidirectional: true },
  { sourceId: 'skai-trader', sourceType: 'skai', targetId: 'family-vanguard', targetType: 'organism-model', wireType: 'rendering', latinName: 'FILUM MERCATOR-VEXILLUM', description: 'SKAI Trader commerce UI rendered by VANGUARD', bidirectional: false },

  // EXC OS ↔ Organism Model Wiring
  { sourceId: 'exc-sovereign', sourceType: 'exc-os', targetId: 'family-cortex', targetType: 'organism-model', wireType: 'compute', latinName: 'FILUM SYSTEMA-CORTEX', description: 'EXC Sovereign kernel runs on CORTEX WASM', bidirectional: true },
  { sourceId: 'exc-sovereign', sourceType: 'exc-os', targetId: 'family-vanguard', targetType: 'organism-model', wireType: 'rendering', latinName: 'FILUM SYSTEMA-VEXILLUM', description: 'EXC Sovereign UI rendered by VANGUARD', bidirectional: true },
  { sourceId: 'exc-desktop', sourceType: 'exc-os', targetId: 'family-nexus', targetType: 'organism-model', wireType: 'rendering', latinName: 'FILUM TABULAE-NEXUS', description: 'EXC Desktop components via NEXUS Web Components', bidirectional: true },
  { sourceId: 'exc-desktop', sourceType: 'exc-os', targetId: 'family-prism', targetType: 'organism-model', wireType: 'rendering', latinName: 'FILUM TABULAE-PRISMA', description: 'EXC Desktop visuals rendered by PRISM', bidirectional: true },

  // Organism Model ↔ Mesh Cluster Wiring
  { sourceId: 'family-vanguard', sourceType: 'organism-model', targetId: 'frontend-render', targetType: 'mesh-cluster', wireType: 'rendering', latinName: 'FILUM VEXILLUM-NODI', description: 'VANGUARD renders through Front-End Render Nodes', bidirectional: true },
  { sourceId: 'family-prism', sourceType: 'organism-model', targetId: 'visual-render', targetType: 'mesh-cluster', wireType: 'rendering', latinName: 'FILUM PRISMA-NODI', description: 'PRISM renders through Visual Rendering Nodes', bidirectional: true },
  { sourceId: 'family-resonance', sourceType: 'organism-model', targetId: 'audio-render', targetType: 'mesh-cluster', wireType: 'rendering', latinName: 'FILUM RESONANTIA-NODI', description: 'RESONANCE renders through Audio Render Nodes', bidirectional: true },
  { sourceId: 'family-nexus', sourceType: 'organism-model', targetId: 'component-render', targetType: 'mesh-cluster', wireType: 'rendering', latinName: 'FILUM NEXUS-NODI', description: 'NEXUS renders through Component Assembly Nodes', bidirectional: true },
  { sourceId: 'family-cortex', sourceType: 'organism-model', targetId: 'wasm-compute', targetType: 'mesh-cluster', wireType: 'compute', latinName: 'FILUM CORTEX-NODI', description: 'CORTEX computes through WASM Compute Nodes', bidirectional: true },
];

// ═══════════════════════════════════════════════════════════════════════════
// FRONT-END RENDERING PIPELINE
// The organism models render the build — this is the pipeline
// ═══════════════════════════════════════════════════════════════════════════

export const FRONTEND_PIPELINES: FrontEndPipeline[] = [
  {
    id: 'pipeline-full-build',
    name: 'Full Organism Front-End Build',
    latinName: 'AEDIFICATIO TOTALIS FRONTIS',
    description: 'Complete front-end build pipeline. All 5 model families contribute. CORTEX computes state. VANGUARD builds DOM. PRISM renders visuals. RESONANCE adds audio and animation. NEXUS distributes components.',
    stages: [
      {
        order: 1,
        name: 'State Computation',
        latinName: 'COMPUTATIO STATUS',
        description: 'CORTEX WASM compiles and executes organism state. CORTEX Threads parallelizes computation. CORTEX Memory persists state to IndexedDB.',
        renderedBy: 'family-cortex',
        modelFamily: 'CORTEX',
        webTechnologies: ['WebAssembly', 'Web Workers + SharedArrayBuffer', 'IndexedDB'],
        outputType: 'Compiled organism state (WASM module + SharedArrayBuffer + IndexedDB store)',
      },
      {
        order: 2,
        name: 'Component Assembly',
        latinName: 'COMPOSITIO ELEMENTORUM',
        description: 'NEXUS Components builds sovereign <medina-*> Web Components. NEXUS CRDT syncs component state. NEXUS Worker caches for offline.',
        renderedBy: 'family-nexus',
        modelFamily: 'NEXUS',
        webTechnologies: ['Web Components', 'CRDT Real-Time Sync', 'Service Workers'],
        outputType: 'Custom element registry + CRDT state + Service Worker cache',
      },
      {
        order: 3,
        name: 'DOM Construction',
        latinName: 'CONSTRUCTIO ARBORIS',
        description: 'VANGUARD DOM grows the living DOM tree. VANGUARD Layout arranges with Fibonacci CSS Grid. VANGUARD Voice adds speech interface.',
        renderedBy: 'family-vanguard',
        modelFamily: 'VANGUARD',
        webTechnologies: ['Web Speech API', 'Dynamic DOM Construction', 'CSS Grid + Auto Layout'],
        outputType: 'Living DOM tree + Fibonacci grid layout + voice interface',
      },
      {
        order: 4,
        name: 'Visual Rendering',
        latinName: 'REDDITIO VISUALIS',
        description: 'PRISM Canvas draws 2D organism visualizations. PRISM WebGL renders 3D substrate. PRISM GPU runs shader compute for particles.',
        renderedBy: 'family-prism',
        modelFamily: 'PRISM',
        webTechnologies: ['HTML Canvas 2D', 'WebGL 2.0', 'WebGPU + WGSL Shaders'],
        outputType: 'Canvas overlays + WebGL 3D scene + GPU particle systems',
      },
      {
        order: 5,
        name: 'Sensory Layer',
        latinName: 'STRATUM SENSUUM',
        description: 'RESONANCE Audio adds 432 Hz harmonics and heartbeat sounds. RESONANCE Paint applies Houdini CSS paint worklets. RESONANCE Motion orchestrates all animation.',
        renderedBy: 'family-resonance',
        modelFamily: 'RESONANCE',
        webTechnologies: ['Web Audio API', 'CSS Houdini Paint Worklets', 'CSS Animation + Web Animations API'],
        outputType: 'Audio graph + CSS paint worklets + animation orchestration',
      },
    ],
    outputFormat: 'Living HTML document with sovereign Web Components, Fibonacci DOM, Canvas/WebGL/WebGPU visuals, Web Audio, Houdini CSS, and golden-ratio animations',
    renderTarget: 'Browser viewport / Electron window / sovereign EXC OS',
  },
  {
    id: 'pipeline-ssr',
    name: 'Server-Side Organism Render',
    latinName: 'REDDITIO LATERIS SERVIENTIS',
    description: 'Server-side rendering pipeline for organism pages. CORTEX computes state, VANGUARD builds DOM, NEXUS assembles components. Output: HTML string ready for hydration.',
    stages: [
      {
        order: 1,
        name: 'State Preparation',
        latinName: 'PRAEPARATIO STATUS',
        description: 'CORTEX WASM pre-computes organism state for SSR. Serialized to transferable format.',
        renderedBy: 'family-cortex',
        modelFamily: 'CORTEX',
        webTechnologies: ['WebAssembly', 'Web Workers + SharedArrayBuffer', 'IndexedDB'],
        outputType: 'Serialized organism state',
      },
      {
        order: 2,
        name: 'Component Resolution',
        latinName: 'RESOLUTIO ELEMENTORUM',
        description: 'NEXUS resolves all <medina-*> custom elements to their shadow DOM HTML output.',
        renderedBy: 'family-nexus',
        modelFamily: 'NEXUS',
        webTechnologies: ['Web Components', 'CRDT Real-Time Sync', 'Service Workers'],
        outputType: 'Declarative Shadow DOM HTML',
      },
      {
        order: 3,
        name: 'HTML Generation',
        latinName: 'GENERATIO HTML',
        description: 'VANGUARD DOM generates the full HTML document string with Fibonacci-spaced CSS Grid layout.',
        renderedBy: 'family-vanguard',
        modelFamily: 'VANGUARD',
        webTechnologies: ['Dynamic DOM Construction', 'CSS Grid + Auto Layout', 'Web Speech API'],
        outputType: 'Complete HTML string ready for hydration',
      },
    ],
    outputFormat: 'HTML string with declarative Shadow DOM, inlined CSS Grid, serialized CRDT state',
    renderTarget: 'HTTP response / static file / edge cache',
  },
  {
    id: 'pipeline-sdk-landing',
    name: 'SDK Landing Page Render',
    latinName: 'REDDITIO PAGINAE SDK',
    description: 'Renders individual SDK landing pages. VANGUARD builds the page structure. PRISM renders visual demos. RESONANCE adds interactive animations.',
    stages: [
      {
        order: 1,
        name: 'Page Structure',
        latinName: 'STRUCTURA PAGINAE',
        description: 'VANGUARD DOM builds the landing page DOM tree with responsive Fibonacci grid.',
        renderedBy: 'family-vanguard',
        modelFamily: 'VANGUARD',
        webTechnologies: ['Dynamic DOM Construction', 'CSS Grid + Auto Layout', 'Web Speech API'],
        outputType: 'Landing page DOM tree',
      },
      {
        order: 2,
        name: 'Visual Demos',
        latinName: 'DEMONSTRATIONES VISUALES',
        description: 'PRISM Canvas/WebGL renders interactive SDK demos — spiral visualizations, 3D previews, particle fields.',
        renderedBy: 'family-prism',
        modelFamily: 'PRISM',
        webTechnologies: ['HTML Canvas 2D', 'WebGL 2.0', 'WebGPU + WGSL Shaders'],
        outputType: 'Interactive visual demo canvases',
      },
      {
        order: 3,
        name: 'Interactive Layer',
        latinName: 'STRATUM INTERACTIVUM',
        description: 'RESONANCE Motion adds golden-ratio scroll animations, hover effects, and page transitions.',
        renderedBy: 'family-resonance',
        modelFamily: 'RESONANCE',
        webTechnologies: ['CSS Animation + Web Animations API', 'CSS Houdini Paint Worklets', 'Web Audio API'],
        outputType: 'Animated interactive layer',
      },
    ],
    outputFormat: 'Interactive landing page with Canvas demos, WebGL previews, and golden-ratio animations',
    renderTarget: 'Browser viewport',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE 2,000 MESH NODES
// ═══════════════════════════════════════════════════════════════════════════

function generateMeshNodesForCluster(cluster: MeshCluster, clusterIndex: number): MeshNode[] {
  const nodes: MeshNode[] = [];
  for (let i = 0; i < cluster.count; i++) {
    const region = REGIONS[i % REGIONS.length];
    const nodeIndex = clusterIndex * NODES_PER_CLUSTER + i + 1;
    nodes.push({
      id: `mesh-${cluster.clusterType}-${String(i + 1).padStart(3, '0')}`,
      name: `@medina/mesh-${cluster.clusterType}-${String(i + 1).padStart(3, '0')}`,
      nodeIndex,
      clusterType: cluster.clusterType,
      kernelCompression: cluster.kernelCompression,
      substrateDepth: cluster.substrateDepth,
      heartbeatMs: HEARTBEAT_MS,
      region,
      status: i < 20 ? 'active' : i < 60 ? 'standby' : 'bootstrapping',
      capabilities: cluster.capabilities,
      intelligenceContracts: cluster.intelligenceContracts,
      wiredAIs: cluster.wiredAIs,
      wiredModels: cluster.wiredModels,
    });
  }
  return nodes;
}

export function getAllMeshNodes(): MeshNode[] {
  return MESH_CLUSTERS.flatMap((cluster, index) => generateMeshNodesForCluster(cluster, index));
}

export function getMeshNodesByCluster(clusterType: MeshNodeType): MeshNode[] {
  const clusterIndex = MESH_CLUSTERS.findIndex(c => c.clusterType === clusterType);
  if (clusterIndex === -1) return [];
  return generateMeshNodesForCluster(MESH_CLUSTERS[clusterIndex], clusterIndex);
}

export function getMeshNodesByRegion(region: string): MeshNode[] {
  return getAllMeshNodes().filter(n => n.region === region);
}

export function getMeshNodesByStatus(status: MeshNode['status']): MeshNode[] {
  return getAllMeshNodes().filter(n => n.status === status);
}

export function getActiveMeshNodes(): MeshNode[] {
  return getMeshNodesByStatus('active');
}

export function getRenderNodes(): MeshNode[] {
  const renderTypes: MeshNodeType[] = [
    'frontend-render', 'visual-render', 'audio-render',
    'component-render', 'houdini-paint', 'gpu-shader', 'speech-voice',
  ];
  return getAllMeshNodes().filter(n => renderTypes.includes(n.clusterType));
}

// ═══════════════════════════════════════════════════════════════════════════
// WIRING HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export function getWiresBySource(sourceId: string): WireConnection[] {
  return WIRE_MAP.filter(w => w.sourceId === sourceId);
}

export function getWiresByTarget(targetId: string): WireConnection[] {
  return WIRE_MAP.filter(w => w.targetId === targetId);
}

export function getWiresByType(wireType: WireConnection['wireType']): WireConnection[] {
  return WIRE_MAP.filter(w => w.wireType === wireType);
}

export function getAllConnectionsFor(entityId: string): WireConnection[] {
  return WIRE_MAP.filter(w =>
    w.sourceId === entityId || (w.bidirectional && w.targetId === entityId)
  );
}

export function getClusterByType(clusterType: MeshNodeType): MeshCluster | undefined {
  return MESH_CLUSTERS.find(c => c.clusterType === clusterType);
}

export function getPipelineById(id: string): FrontEndPipeline | undefined {
  return FRONTEND_PIPELINES.find(p => p.id === id);
}

// ═══════════════════════════════════════════════════════════════════════════
// WIRED ENTITY COUNTS (everything that's wired into the mesh)
// ═══════════════════════════════════════════════════════════════════════════

export function getWiredEntityCounts() {
  return {
    aiSDKs: AI_SDK_REGISTRY.length,
    skais: SKAI_REGISTRY.length,
    organismModelFamilies: ORGANISM_MODEL_FAMILIES.length,
    organismModels: ORGANISM_MODEL_FAMILIES.reduce((sum, f) => sum + f.models.length, 0),
    excOSSystems: EXC_OS_REGISTRY.length,
    meshClusters: MESH_CLUSTERS.length,
    meshNodes: TOTAL_MESH_NODES,
    wireConnections: WIRE_MAP.length,
    frontendPipelines: FRONTEND_PIPELINES.length,
    totalIntelligenceContracts: MESH_CLUSTERS.reduce((sum, c) => sum + c.intelligenceContracts.length, 0),
    totalCapabilities: MESH_CLUSTERS.reduce((sum, c) => sum + c.capabilities.length, 0),
    renderNodes: getRenderNodes().length,
    activeNodes: getActiveMeshNodes().length,
    regions: REGIONS.length,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MANIFEST
// ═══════════════════════════════════════════════════════════════════════════

export const SUBSTRATE_MESH_MANIFEST = {
  system: 'MEDINA Substrate Mesh',
  version: '2.0.0',

  // Node totals
  totalMeshNodes: TOTAL_MESH_NODES,
  meshClusterCount: MESH_CLUSTER_COUNT,
  nodesPerCluster: NODES_PER_CLUSTER,
  regions: REGIONS.length,

  // Wired entity totals
  wiredAISDKs: AI_SDK_REGISTRY.length,
  wiredSKAIs: SKAI_REGISTRY.length,
  wiredOrganismFamilies: ORGANISM_MODEL_FAMILIES.length,
  wiredOrganismModels: ORGANISM_MODEL_FAMILIES.reduce((sum, f) => sum + f.models.length, 0),
  wiredEXCOSSystems: EXC_OS_REGISTRY.length,

  // Wire connections
  totalWires: WIRE_MAP.length,
  wiresByType: {
    intelligence: WIRE_MAP.filter(w => w.wireType === 'intelligence').length,
    rendering: WIRE_MAP.filter(w => w.wireType === 'rendering').length,
    compute: WIRE_MAP.filter(w => w.wireType === 'compute').length,
    security: WIRE_MAP.filter(w => w.wireType === 'security').length,
    memory: WIRE_MAP.filter(w => w.wireType === 'memory').length,
    governance: WIRE_MAP.filter(w => w.wireType === 'governance').length,
    sync: WIRE_MAP.filter(w => w.wireType === 'sync').length,
  },

  // Clusters
  clusters: MESH_CLUSTERS.map(c => ({
    type: c.clusterType,
    name: c.displayName,
    latinName: c.latinName,
    count: c.count,
    depth: c.substrateDepth,
    compression: c.kernelCompression,
    wiredAIs: c.wiredAIs.length,
    wiredModels: c.wiredModels.length,
  })),

  // Front-end pipelines
  frontendPipelines: FRONTEND_PIPELINES.length,
  frontendStages: FRONTEND_PIPELINES.reduce((sum, p) => sum + p.stages.length, 0),

  // Rendering
  renderClusters: MESH_CLUSTERS.filter(c => [
    'frontend-render', 'visual-render', 'audio-render',
    'component-render', 'houdini-paint', 'gpu-shader', 'speech-voice',
  ].includes(c.clusterType)).length,
  renderNodes: 700,

  // Constants
  heartbeatMs: HEARTBEAT_MS,
  phi: PHI,

  doctrine: 'Duo milia nodorum. Omnia connexa. Unum organismus.',
  manifesto: 'Every AI wired. Every model rendering. Every node alive. 2,000 strong.',
};
