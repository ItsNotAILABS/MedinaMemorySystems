// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 MICRO WORKER MANIFEST — 100 ALWAYS-ON SOVEREIGN WORKERS 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * "They're all supposed to be on 24 hours, the whole organism, the whole thing
 * is supposed to be just on. It's not someone turns it on, like it's just
 * passive, like a thousand people could be on the system and it's already
 * working for them."
 *
 * 100 micro web workers across 10 sovereign domains × 10 workers each.
 * Each worker is a named, Latin-named intelligence unit that runs in a
 * background thread. They are always on, always passive, always ready.
 * The organism starts them at boot. No user action required.
 *
 * DOMAINS (10):
 *   I.   MEMORIA     — Memory processing workers
 *   II.  SENSUS      — Sensory perception workers
 *   III. NEXUS       — Network & communication workers
 *   IV.  COGNITIO    — Cognitive processing workers
 *   V.   CUSTODIA    — Security & gate enforcement workers
 *   VI.  GUBERNATIO  — Governance & doctrine workers
 *   VII. FABRICATIO  — Build & compilation workers
 *   VIII.RESONANTIA  — Resonance & frequency workers
 *   IX.  FLUXUS      — Stream & data flow workers
 *   X.   IMPERIUM    — Command & orchestration workers
 *
 * φ = 1.618033988749895
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type WorkerDomainId =
  | 'MEMORIA'
  | 'SENSUS'
  | 'NEXUS'
  | 'COGNITIO'
  | 'CUSTODIA'
  | 'GUBERNATIO'
  | 'FABRICATIO'
  | 'RESONANTIA'
  | 'FLUXUS'
  | 'IMPERIUM';

export type WorkerStatus = 'IDLE' | 'ACTIVE' | 'PROCESSING' | 'ERROR' | 'OFFLINE';

export interface MicroWorkerSpec {
  /** Unique worker ID (e.g. MW-001) */
  id: string;
  /** Sovereign name (e.g. MEMORY_INDEXER) */
  name: string;
  /** Latin name */
  latinName: string;
  /** What this worker does */
  purpose: string;
  /** Parent domain */
  domain: WorkerDomainId;
  /** Position within domain (1–10) */
  rank: number;
  /** Heartbeat interval in ms (φ-derived) */
  heartbeatMs: number;
  /** Max tasks this worker can queue */
  maxQueue: number;
  /** UI accent color */
  color: string;
}

export interface WorkerDomain {
  id: WorkerDomainId;
  latinName: string;
  tagline: string;
  workers: MicroWorkerSpec[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PHI = 1.618033988749895;

/** Base heartbeat — φ⁴ × Schumann ≈ 873ms */
const BASE_HEARTBEAT_MS = 873;

/** Fast heartbeat for critical workers — 618ms (1000/φ) */
const FAST_HEARTBEAT_MS = Math.round(1000 / PHI);

/** Slow heartbeat for background workers — 1414ms (φ³ × Schumann) */
const SLOW_HEARTBEAT_MS = Math.round(BASE_HEARTBEAT_MS * PHI);

// ─────────────────────────────────────────────────────────────────────────────
// I. MEMORIA — Memory Processing Workers
// ─────────────────────────────────────────────────────────────────────────────

export const MEMORIA_DOMAIN: WorkerDomain = {
  id: 'MEMORIA',
  latinName: 'Memoria Perpetua',
  tagline: 'Always-on memory processing. The organism never forgets.',
  workers: [
    { id: 'MW-001', name: 'MEMORY_INDEXER',       latinName: 'Index Memoriae',       purpose: 'Indexes all memory entries for instant retrieval.',                domain: 'MEMORIA', rank: 1,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 100, color: '#8b5cf6' },
    { id: 'MW-002', name: 'SALIENCE_SCORER',      latinName: 'Aestimator Salientiae', purpose: 'Continuously recalculates salience scores across all memories.',  domain: 'MEMORIA', rank: 2,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 50,  color: '#7c3aed' },
    { id: 'MW-003', name: 'LINEAGE_TRACKER',      latinName: 'Vestigator Lineae',    purpose: 'Maintains parent-child lineage chains in real time.',              domain: 'MEMORIA', rank: 3,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 50,  color: '#6d28d9' },
    { id: 'MW-004', name: 'RESONANCE_CALCULATOR', latinName: 'Calculator Resonantiae', purpose: 'Computes φ-harmonic resonance between memory entries.',          domain: 'MEMORIA', rank: 4,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 80,  color: '#5b21b6' },
    { id: 'MW-005', name: 'DECAY_ENGINE',          latinName: 'Motor Decadentiae',    purpose: 'Applies time-based decay to unpinned, low-salience memories.',     domain: 'MEMORIA', rank: 5,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 30,  color: '#4c1d95' },
    { id: 'MW-006', name: 'SEMANTIC_VECTORIZER',   latinName: 'Vector Semanticus',    purpose: 'Generates semantic vectors for similarity search.',               domain: 'MEMORIA', rank: 6,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#7e22ce' },
    { id: 'MW-007', name: 'DUAL_READ_WORKER',      latinName: 'Lector Duplex',        purpose: 'Runs dual-channel reads (semantic + resonance) in background.',   domain: 'MEMORIA', rank: 7,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 60,  color: '#a855f7' },
    { id: 'MW-008', name: 'SPATIAL_MAPPER',         latinName: 'Cartographus Spatii', purpose: 'Maps memories to spatial coordinates (theta, phi, depth, ring).', domain: 'MEMORIA', rank: 8,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#9333ea' },
    { id: 'MW-009', name: 'DOCTRINE_ALIGNER',      latinName: 'Rector Doctrinae',     purpose: 'Scores doctrine alignment for every memory entry.',               domain: 'MEMORIA', rank: 9,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 30,  color: '#c084fc' },
    { id: 'MW-010', name: 'MEMORY_COMPACTOR',      latinName: 'Compressor Memoriae',  purpose: 'Merges redundant memories and compacts storage.',                 domain: 'MEMORIA', rank: 10, heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 20,  color: '#d8b4fe' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// II. SENSUS — Sensory Perception Workers
// ─────────────────────────────────────────────────────────────────────────────

export const SENSUS_DOMAIN: WorkerDomain = {
  id: 'SENSUS',
  latinName: 'Sensus Vigilans',
  tagline: 'Perception is always on. The organism sees, hears, and feels continuously.',
  workers: [
    { id: 'MW-011', name: 'VISION_PREPROCESSOR',  latinName: 'Praeparator Visus',    purpose: 'Preprocesses visual input for Oro Vision pattern detection.',    domain: 'SENSUS', rank: 1,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 80,  color: '#f59e0b' },
    { id: 'MW-012', name: 'AUDIO_ANALYZER',        latinName: 'Analysor Sonorum',     purpose: 'Continuous FFT analysis on audio input for Nova Hearing.',       domain: 'SENSUS', rank: 2,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 100, color: '#d97706' },
    { id: 'MW-013', name: 'FREQUENCY_MONITOR',    latinName: 'Custos Frequentiae',   purpose: 'Monitors organism frequency alignment (432Hz, φ harmonics).',   domain: 'SENSUS', rank: 3,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#b45309' },
    { id: 'MW-014', name: 'INPUT_CLASSIFIER',      latinName: 'Classificator Inputi', purpose: 'Classifies user input type (text, voice, gesture, sensor).',    domain: 'SENSUS', rank: 4,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 60,  color: '#92400e' },
    { id: 'MW-015', name: 'EMOTION_DETECTOR',      latinName: 'Detector Affectuum',   purpose: 'Detects emotional tone in text and voice input.',                domain: 'SENSUS', rank: 5,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#78350f' },
    { id: 'MW-016', name: 'GESTURE_INTERPRETER',   latinName: 'Interpres Gestuum',    purpose: 'Interprets touch, swipe, and device motion gestures.',           domain: 'SENSUS', rank: 6,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 50,  color: '#ea580c' },
    { id: 'MW-017', name: 'DEVICE_SENSOR_BRIDGE',  latinName: 'Pons Sensorum',        purpose: 'Bridges device sensors (accelerometer, gyro, light) to organism.', domain: 'SENSUS', rank: 7,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#f97316' },
    { id: 'MW-018', name: 'CONTEXT_ASSEMBLER',     latinName: 'Compositor Contextus', purpose: 'Assembles multi-sensory context from all input channels.',       domain: 'SENSUS', rank: 8,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 30,  color: '#fb923c' },
    { id: 'MW-019', name: 'ATTENTION_TRACKER',     latinName: 'Observator Attentionis', purpose: 'Tracks user attention patterns (focus, gaze, idle, active).',  domain: 'SENSUS', rank: 9,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 50,  color: '#fdba74' },
    { id: 'MW-020', name: 'PERCEPTION_FUSER',      latinName: 'Fusor Perceptionis',   purpose: 'Fuses all sensory channels into unified perception state.',      domain: 'SENSUS', rank: 10, heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 30,  color: '#fed7aa' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// III. NEXUS — Network & Communication Workers
// ─────────────────────────────────────────────────────────────────────────────

export const NEXUS_DOMAIN: WorkerDomain = {
  id: 'NEXUS',
  latinName: 'Nexus Aeternus',
  tagline: 'The network never sleeps. Every connection is sovereign.',
  workers: [
    { id: 'MW-021', name: 'API_PREFETCHER',       latinName: 'Praefector Datorum',   purpose: 'Prefetches likely-needed API data before user requests it.',     domain: 'NEXUS', rank: 1,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 60,  color: '#10b981' },
    { id: 'MW-022', name: 'SYNC_COORDINATOR',      latinName: 'Coordinator Syncorum', purpose: 'Coordinates data sync between local state and server.',          domain: 'NEXUS', rank: 2,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#059669' },
    { id: 'MW-023', name: 'CACHE_MANAGER',          latinName: 'Custos Repositorii',   purpose: 'Manages intelligent caching — eviction, preloading, freshness.', domain: 'NEXUS', rank: 3,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 30,  color: '#047857' },
    { id: 'MW-024', name: 'WEBSOCKET_SENTINEL',    latinName: 'Sentinella Nexus',     purpose: 'Maintains persistent WebSocket connections for real-time data.', domain: 'NEXUS', rank: 4,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 80,  color: '#065f46' },
    { id: 'MW-025', name: 'REQUEST_BATCHER',        latinName: 'Fasciculor Petitionum', purpose: 'Batches multiple API requests into single optimized calls.',    domain: 'NEXUS', rank: 5,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 50,  color: '#064e3b' },
    { id: 'MW-026', name: 'OFFLINE_QUEUE',           latinName: 'Ordo Absentia',        purpose: 'Queues operations when offline, replays when connected.',        domain: 'NEXUS', rank: 6,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 100, color: '#14532d' },
    { id: 'MW-027', name: 'LATENCY_MONITOR',        latinName: 'Monitor Morae',        purpose: 'Tracks network latency and adjusts request strategies.',         domain: 'NEXUS', rank: 7,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 40,  color: '#166534' },
    { id: 'MW-028', name: 'PROTOCOL_NEGOTIATOR',   latinName: 'Negotiator Protocoli', purpose: 'Negotiates optimal protocol (HTTP/2, WS, SSE) per endpoint.',    domain: 'NEXUS', rank: 8,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 20,  color: '#15803d' },
    { id: 'MW-029', name: 'PEER_DISCOVERY',         latinName: 'Explorator Parium',    purpose: 'Discovers and maintains connections to peer organisms.',          domain: 'NEXUS', rank: 9,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 20,  color: '#16a34a' },
    { id: 'MW-030', name: 'BANDWIDTH_OPTIMIZER',    latinName: 'Optimator Latitudinis', purpose: 'Optimizes bandwidth usage — compression, prioritization.',      domain: 'NEXUS', rank: 10, heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 30,  color: '#22c55e' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// IV. COGNITIO — Cognitive Processing Workers
// ─────────────────────────────────────────────────────────────────────────────

export const COGNITIO_DOMAIN: WorkerDomain = {
  id: 'COGNITIO',
  latinName: 'Cognitio Perpetua',
  tagline: 'The organism thinks continuously. Intelligence never stops.',
  workers: [
    { id: 'MW-031', name: 'PATTERN_RECOGNIZER',   latinName: 'Recognitor Formae',    purpose: 'Runs continuous pattern recognition across all data streams.',   domain: 'COGNITIO', rank: 1,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 60,  color: '#3b82f6' },
    { id: 'MW-032', name: 'MODEL_SCORER',          latinName: 'Aestimator Modeli',    purpose: 'Pre-scores all models against likely prompts for fast routing.', domain: 'COGNITIO', rank: 2,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#2563eb' },
    { id: 'MW-033', name: 'INTENT_CLASSIFIER',     latinName: 'Classificator Intenti', purpose: 'Classifies user intent before routing to models.',              domain: 'COGNITIO', rank: 3,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 80,  color: '#1d4ed8' },
    { id: 'MW-034', name: 'CONTEXT_BUILDER',       latinName: 'Structor Contextus',   purpose: 'Builds rich context objects from conversation history.',         domain: 'COGNITIO', rank: 4,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#1e40af' },
    { id: 'MW-035', name: 'PREDICTION_ENGINE',     latinName: 'Motor Praedictionis',  purpose: 'Predicts next user action for proactive intelligence.',          domain: 'COGNITIO', rank: 5,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 50,  color: '#1e3a8a' },
    { id: 'MW-036', name: 'ANOMALY_DETECTOR',      latinName: 'Detector Anomaliarum', purpose: 'Detects anomalies in data patterns and behavior.',               domain: 'COGNITIO', rank: 6,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#312e81' },
    { id: 'MW-037', name: 'KNOWLEDGE_SYNTHESIZER', latinName: 'Synthesista Scientiae', purpose: 'Synthesizes knowledge from multiple memory and model sources.', domain: 'COGNITIO', rank: 7,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 30,  color: '#4338ca' },
    { id: 'MW-038', name: 'LEARNING_EXTRACTOR',    latinName: 'Extractor Doctrinae',  purpose: 'Extracts learnable patterns from user interactions.',            domain: 'COGNITIO', rank: 8,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 30,  color: '#4f46e5' },
    { id: 'MW-039', name: 'INFERENCE_WORKER',       latinName: 'Operator Illationis',  purpose: 'Runs lightweight inference tasks off the main thread.',          domain: 'COGNITIO', rank: 9,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 60,  color: '#6366f1' },
    { id: 'MW-040', name: 'THOUGHT_COMPOSER',      latinName: 'Compositor Cogitationis', purpose: 'Composes multi-step reasoning chains for complex queries.',  domain: 'COGNITIO', rank: 10, heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 30,  color: '#818cf8' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// V. CUSTODIA — Security & Gate Enforcement Workers
// ─────────────────────────────────────────────────────────────────────────────

export const CUSTODIA_DOMAIN: WorkerDomain = {
  id: 'CUSTODIA',
  latinName: 'Custodia Aeterna',
  tagline: 'Security never sleeps. Every gate is guarded. Every access is watched.',
  workers: [
    { id: 'MW-041', name: 'GATE_A_SENTINEL',       latinName: 'Sentinella Portae A',  purpose: 'Enforces Gate A (constitutional) in real time.',                  domain: 'CUSTODIA', rank: 1,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 40,  color: '#ef4444' },
    { id: 'MW-042', name: 'GATE_B_SENTINEL',       latinName: 'Sentinella Portae B',  purpose: 'Enforces Gate B (operational) in real time.',                     domain: 'CUSTODIA', rank: 2,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 40,  color: '#dc2626' },
    { id: 'MW-043', name: 'GATE_C_SENTINEL',       latinName: 'Sentinella Portae C',  purpose: 'Enforces Gate C (sovereignty) in real time.',                     domain: 'CUSTODIA', rank: 3,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 40,  color: '#b91c1c' },
    { id: 'MW-044', name: 'ACCESS_AUDITOR',         latinName: 'Auditor Accessus',     purpose: 'Audits every access event and logs to sovereign ledger.',         domain: 'CUSTODIA', rank: 4,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 80,  color: '#991b1b' },
    { id: 'MW-045', name: 'THREAT_SCANNER',         latinName: 'Scrutator Minarum',    purpose: 'Scans for security threats, injection, and anomalous patterns.',  domain: 'CUSTODIA', rank: 5,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 60,  color: '#7f1d1d' },
    { id: 'MW-046', name: 'PERMISSION_ENFORCER',   latinName: 'Executor Permissionum', purpose: 'Enforces permission matrix for all operations.',                domain: 'CUSTODIA', rank: 6,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 50,  color: '#f87171' },
    { id: 'MW-047', name: 'PROVENANCE_SEALER',     latinName: 'Signator Originis',    purpose: 'Seals provenance on every artifact and data mutation.',            domain: 'CUSTODIA', rank: 7,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#fca5a5' },
    { id: 'MW-048', name: 'ENCRYPTION_WORKER',     latinName: 'Operator Cryptographiae', purpose: 'Handles all encryption/decryption off the main thread.',      domain: 'CUSTODIA', rank: 8,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 60,  color: '#fecaca' },
    { id: 'MW-049', name: 'INTEGRITY_CHECKER',     latinName: 'Verificator Integritatis', purpose: 'Verifies data integrity hashes and sovereign signatures.',  domain: 'CUSTODIA', rank: 9,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#e11d48' },
    { id: 'MW-050', name: 'BREACH_RESPONDER',      latinName: 'Responsor Violationis', purpose: 'Responds to detected breaches — isolate, alert, remediate.',    domain: 'CUSTODIA', rank: 10, heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 20,  color: '#be123c' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// VI. GUBERNATIO — Governance & Doctrine Workers
// ─────────────────────────────────────────────────────────────────────────────

export const GUBERNATIO_DOMAIN: WorkerDomain = {
  id: 'GUBERNATIO',
  latinName: 'Gubernatio Perpetua',
  tagline: 'Governance runs continuously. Doctrine is always enforced.',
  workers: [
    { id: 'MW-051', name: 'PROPOSAL_PROCESSOR',    latinName: 'Processor Propositi',   purpose: 'Processes governance proposals in background queue.',            domain: 'GUBERNATIO', rank: 1,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 30,  color: '#f59e0b' },
    { id: 'MW-052', name: 'VOTE_TALLIER',           latinName: 'Computator Suffragii',  purpose: 'Tallies votes and computes consensus in real time.',             domain: 'GUBERNATIO', rank: 2,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 40,  color: '#d97706' },
    { id: 'MW-053', name: 'DOCTRINE_DRIFT_DETECTOR', latinName: 'Detector Devii',       purpose: 'Detects drift from established doctrine across all operations.', domain: 'GUBERNATIO', rank: 3,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 20,  color: '#b45309' },
    { id: 'MW-054', name: 'AUDIT_CHAIN_WORKER',    latinName: 'Operator Catenas',      purpose: 'Maintains continuous audit chain for all governance events.',    domain: 'GUBERNATIO', rank: 4,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 60,  color: '#92400e' },
    { id: 'MW-055', name: 'LAW_EVALUATOR',          latinName: 'Aestimator Legis',      purpose: 'Evaluates operations against active sovereign laws.',            domain: 'GUBERNATIO', rank: 5,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 40,  color: '#78350f' },
    { id: 'MW-056', name: 'COMPLIANCE_MONITOR',    latinName: 'Monitor Obtemperantiae', purpose: 'Monitors compliance across all organism subsystems.',           domain: 'GUBERNATIO', rank: 6,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 30,  color: '#451a03' },
    { id: 'MW-057', name: 'QUORUM_CHECKER',         latinName: 'Verificator Quori',     purpose: 'Checks quorum requirements before governance actions execute.', domain: 'GUBERNATIO', rank: 7,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 20,  color: '#fbbf24' },
    { id: 'MW-058', name: 'AMENDMENT_PROCESSOR',   latinName: 'Processor Emendationis', purpose: 'Processes constitutional amendments through proper channels.',  domain: 'GUBERNATIO', rank: 8,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 10,  color: '#fcd34d' },
    { id: 'MW-059', name: 'DELEGATION_ROUTER',     latinName: 'Rector Delegationis',   purpose: 'Routes delegated authority to correct sovereign entities.',      domain: 'GUBERNATIO', rank: 9,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 30,  color: '#fde68a' },
    { id: 'MW-060', name: 'GOVERNANCE_REPORTER',   latinName: 'Relator Gubernationis', purpose: 'Generates real-time governance status reports.',                 domain: 'GUBERNATIO', rank: 10, heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 20,  color: '#fef3c7' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// VII. FABRICATIO — Build & Compilation Workers
// ─────────────────────────────────────────────────────────────────────────────

export const FABRICATIO_DOMAIN: WorkerDomain = {
  id: 'FABRICATIO',
  latinName: 'Fabricatio Continua',
  tagline: 'The organism is always building. Architecture never stops constructing itself.',
  workers: [
    { id: 'MW-061', name: 'WASM_COMPILER',          latinName: 'Compilator Machinae',   purpose: 'Background WASM compilation for sovereign formulas.',            domain: 'FABRICATIO', rank: 1,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 10,  color: '#06b6d4' },
    { id: 'MW-062', name: 'MODULE_BUNDLER',          latinName: 'Fasciculor Modulorum',  purpose: 'Bundles and optimizes sovereign modules in background.',         domain: 'FABRICATIO', rank: 2,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 10,  color: '#0891b2' },
    { id: 'MW-063', name: 'CODE_VALIDATOR',          latinName: 'Validator Codicis',     purpose: 'Validates code integrity and type safety in background.',        domain: 'FABRICATIO', rank: 3,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 30,  color: '#0e7490' },
    { id: 'MW-064', name: 'TEMPLATE_RENDERER',      latinName: 'Renderer Formae',       purpose: 'Pre-renders templates and component trees off main thread.',     domain: 'FABRICATIO', rank: 4,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 40,  color: '#155e75' },
    { id: 'MW-065', name: 'ASSET_OPTIMIZER',         latinName: 'Optimator Opum',        purpose: 'Optimizes images, fonts, and static assets in background.',      domain: 'FABRICATIO', rank: 5,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 20,  color: '#164e63' },
    { id: 'MW-066', name: 'DEPENDENCY_RESOLVER',    latinName: 'Resolver Dependentiae', purpose: 'Resolves module dependencies and manages import graphs.',        domain: 'FABRICATIO', rank: 6,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 20,  color: '#083344' },
    { id: 'MW-067', name: 'HOT_RELOAD_WORKER',     latinName: 'Operator Recalefactionis', purpose: 'Manages hot module replacement and live updates.',            domain: 'FABRICATIO', rank: 7,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 30,  color: '#22d3ee' },
    { id: 'MW-068', name: 'CANISTER_DEPLOYER',     latinName: 'Distributor Canistri',  purpose: 'Manages background canister deployment to ICP.',                  domain: 'FABRICATIO', rank: 8,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 5,   color: '#67e8f9' },
    { id: 'MW-069', name: 'SCHEMA_VALIDATOR',       latinName: 'Validator Schematis',   purpose: 'Validates data schemas and API contracts continuously.',          domain: 'FABRICATIO', rank: 9,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 30,  color: '#a5f3fc' },
    { id: 'MW-070', name: 'BUILD_PIPELINE',          latinName: 'Canalis Fabricationis', purpose: 'Orchestrates the complete build pipeline in background.',        domain: 'FABRICATIO', rank: 10, heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 5,   color: '#cffafe' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// VIII. RESONANTIA — Resonance & Frequency Workers
// ─────────────────────────────────────────────────────────────────────────────

export const RESONANTIA_DOMAIN: WorkerDomain = {
  id: 'RESONANTIA',
  latinName: 'Resonantia Universalis',
  tagline: 'The golden ratio pulses through everything. φ never stops.',
  workers: [
    { id: 'MW-071', name: 'PHI_OSCILLATOR',         latinName: 'Oscillator Aureus',    purpose: 'Generates φ-locked timing signals for the entire organism.',     domain: 'RESONANTIA', rank: 1,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 100, color: '#ec4899' },
    { id: 'MW-072', name: 'BEAT_SYNCHRONIZER',      latinName: 'Synchronizor Pulsuum', purpose: 'Synchronizes organism heartbeat across all subsystems.',         domain: 'RESONANTIA', rank: 2,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 80,  color: '#db2777' },
    { id: 'MW-073', name: 'HARMONIC_ANALYZER',      latinName: 'Analysor Harmoniae',   purpose: 'Analyzes harmonic relationships between organism signals.',      domain: 'RESONANTIA', rank: 3,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#be185d' },
    { id: 'MW-074', name: 'FREQUENCY_ALIGNER',      latinName: 'Rector Frequentiae',   purpose: 'Aligns subsystem frequencies to 432Hz sacred base.',             domain: 'RESONANTIA', rank: 4,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 30,  color: '#9d174d' },
    { id: 'MW-075', name: 'RESONANCE_AMPLIFIER',   latinName: 'Amplificator Resonantiae', purpose: 'Applies RECITAL_PLUS_ONE amplification law continuously.',  domain: 'RESONANTIA', rank: 5,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 50,  color: '#831843' },
    { id: 'MW-076', name: 'WAVE_GENERATOR',          latinName: 'Generator Undarum',    purpose: 'Generates waveforms for audio, visual, and data synthesis.',     domain: 'RESONANTIA', rank: 6,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 60,  color: '#f472b6' },
    { id: 'MW-077', name: 'FIBONACCI_SEQUENCER',   latinName: 'Sequentiator Fibonacci', purpose: 'Generates Fibonacci sequences for timing and data structures.', domain: 'RESONANTIA', rank: 7,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 20,  color: '#f9a8d4' },
    { id: 'MW-078', name: 'PHASE_DETECTOR',          latinName: 'Detector Phasis',      purpose: 'Detects organism phase (awake, integrating, deep, broadcast).', domain: 'RESONANTIA', rank: 8,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 30,  color: '#fbcfe8' },
    { id: 'MW-079', name: 'SCHUMANN_MONITOR',      latinName: 'Monitor Schumannii',   purpose: 'Monitors alignment with Schumann resonance (7.83Hz base).',      domain: 'RESONANTIA', rank: 9,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 20,  color: '#fce7f3' },
    { id: 'MW-080', name: 'ENTRAINMENT_ENGINE',    latinName: 'Motor Aptatationis',   purpose: 'Entrains organism systems to shared resonant frequency.',         domain: 'RESONANTIA', rank: 10, heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 30,  color: '#fdf2f8' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// IX. FLUXUS — Stream & Data Flow Workers
// ─────────────────────────────────────────────────────────────────────────────

export const FLUXUS_DOMAIN: WorkerDomain = {
  id: 'FLUXUS',
  latinName: 'Fluxus Perpetuus',
  tagline: 'Data flows without stopping. The organism is a river, not a lake.',
  workers: [
    { id: 'MW-081', name: 'STREAM_ROUTER',          latinName: 'Rector Fluxus',        purpose: 'Routes data streams between organism subsystems.',               domain: 'FLUXUS', rank: 1,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 100, color: '#14b8a6' },
    { id: 'MW-082', name: 'BACKPRESSURE_GOVERNOR', latinName: 'Gubernator Pressionis', purpose: 'Manages backpressure across all data pipelines.',              domain: 'FLUXUS', rank: 2,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 50,  color: '#0d9488' },
    { id: 'MW-083', name: 'TRANSFORM_PIPELINE',    latinName: 'Canalis Mutationis',   purpose: 'Runs data transform pipelines in background threads.',           domain: 'FLUXUS', rank: 3,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 60,  color: '#0f766e' },
    { id: 'MW-084', name: 'EVENT_DISPATCHER',       latinName: 'Dispensator Eventuum', purpose: 'Dispatches organism events to all subscribed listeners.',        domain: 'FLUXUS', rank: 4,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 100, color: '#115e59' },
    { id: 'MW-085', name: 'QUEUE_PROCESSOR',         latinName: 'Processor Ordinum',    purpose: 'Processes background task queues in priority order.',            domain: 'FLUXUS', rank: 5,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 80,  color: '#134e4a' },
    { id: 'MW-086', name: 'BUFFER_MANAGER',          latinName: 'Custos Receptaculi',   purpose: 'Manages data buffers — ring buffers, overflow, spill to disk.', domain: 'FLUXUS', rank: 6,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#042f2e' },
    { id: 'MW-087', name: 'PIPELINE_OPTIMIZER',     latinName: 'Optimator Canalis',    purpose: 'Optimizes data pipeline topology for throughput.',               domain: 'FLUXUS', rank: 7,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 20,  color: '#2dd4bf' },
    { id: 'MW-088', name: 'FAN_OUT_WORKER',          latinName: 'Divisor Fluxus',       purpose: 'Fans out single data sources to multiple consumers.',            domain: 'FLUXUS', rank: 8,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 60,  color: '#5eead4' },
    { id: 'MW-089', name: 'MERGE_COLLECTOR',         latinName: 'Collector Confluens',  purpose: 'Merges multiple data streams into unified output.',              domain: 'FLUXUS', rank: 9,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 60,  color: '#99f6e4' },
    { id: 'MW-090', name: 'DEAD_LETTER_HANDLER',    latinName: 'Custos Mortuarum',     purpose: 'Captures and retries failed messages — no data loss.',           domain: 'FLUXUS', rank: 10, heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 40,  color: '#ccfbf1' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// X. IMPERIUM — Command & Orchestration Workers
// ─────────────────────────────────────────────────────────────────────────────

export const IMPERIUM_DOMAIN: WorkerDomain = {
  id: 'IMPERIUM',
  latinName: 'Imperium Centrale',
  tagline: 'Command flows from center to edges. The organism orchestrates itself.',
  workers: [
    { id: 'MW-091', name: 'ORCHESTRATOR_PRIME',    latinName: 'Orchestrator Primus',  purpose: 'Master orchestrator — coordinates all other workers.',            domain: 'IMPERIUM', rank: 1,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 100, color: '#a855f7' },
    { id: 'MW-092', name: 'HEALTH_MONITOR',         latinName: 'Monitor Salutis',      purpose: 'Monitors health of all 100 workers continuously.',               domain: 'IMPERIUM', rank: 2,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 100, color: '#9333ea' },
    { id: 'MW-093', name: 'LOAD_BALANCER',           latinName: 'Aequator Oneris',      purpose: 'Balances work across workers based on load and priority.',        domain: 'IMPERIUM', rank: 3,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 80,  color: '#7e22ce' },
    { id: 'MW-094', name: 'SCHEDULER',                latinName: 'Ordinator Temporis',   purpose: 'Schedules tasks across workers using φ-locked timing.',          domain: 'IMPERIUM', rank: 4,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 60,  color: '#6b21a8' },
    { id: 'MW-095', name: 'LIFECYCLE_MANAGER',      latinName: 'Rector Vitae',         purpose: 'Manages worker lifecycle — spawn, restart, terminate.',           domain: 'IMPERIUM', rank: 5,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 30,  color: '#581c87' },
    { id: 'MW-096', name: 'PRIORITY_ROUTER',         latinName: 'Rector Prioritatis',   purpose: 'Routes tasks to workers by priority and domain affinity.',        domain: 'IMPERIUM', rank: 6,  heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 80,  color: '#3b0764' },
    { id: 'MW-097', name: 'METRIC_COLLECTOR',        latinName: 'Collector Metricorum', purpose: 'Collects performance metrics from all workers.',                  domain: 'IMPERIUM', rank: 7,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 100, color: '#c084fc' },
    { id: 'MW-098', name: 'ERROR_AGGREGATOR',       latinName: 'Aggregator Errorum',   purpose: 'Aggregates and classifies errors across all workers.',            domain: 'IMPERIUM', rank: 8,  heartbeatMs: BASE_HEARTBEAT_MS, maxQueue: 50,  color: '#d8b4fe' },
    { id: 'MW-099', name: 'CONFIG_DISTRIBUTOR',     latinName: 'Distributor Configurationis', purpose: 'Distributes configuration updates to all workers.',        domain: 'IMPERIUM', rank: 9,  heartbeatMs: SLOW_HEARTBEAT_MS, maxQueue: 20,  color: '#e9d5ff' },
    { id: 'MW-100', name: 'TELEMETRY_STREAMER',    latinName: 'Flusor Telemetriae',   purpose: 'Streams real-time telemetry from all workers to dashboard.',       domain: 'IMPERIUM', rank: 10, heartbeatMs: FAST_HEARTBEAT_MS, maxQueue: 100, color: '#f3e8ff' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE REGISTRY — ALL 10 DOMAINS, 100 WORKERS
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_WORKER_DOMAINS: WorkerDomain[] = [
  MEMORIA_DOMAIN,
  SENSUS_DOMAIN,
  NEXUS_DOMAIN,
  COGNITIO_DOMAIN,
  CUSTODIA_DOMAIN,
  GUBERNATIO_DOMAIN,
  FABRICATIO_DOMAIN,
  RESONANTIA_DOMAIN,
  FLUXUS_DOMAIN,
  IMPERIUM_DOMAIN,
];

/** Flat list of all 100 micro worker specs */
export const ALL_MICRO_WORKERS: MicroWorkerSpec[] = ALL_WORKER_DOMAINS.flatMap((d) => d.workers);

/** Lookup a worker spec by ID */
export function getWorkerSpec(id: string): MicroWorkerSpec | undefined {
  return ALL_MICRO_WORKERS.find((w) => w.id === id);
}

/** Get all workers for a specific domain */
export function getDomainWorkers(domain: WorkerDomainId): MicroWorkerSpec[] {
  return ALL_MICRO_WORKERS.filter((w) => w.domain === domain);
}

/** Get domain by ID */
export function getWorkerDomain(id: WorkerDomainId): WorkerDomain | undefined {
  return ALL_WORKER_DOMAINS.find((d) => d.id === id);
}
