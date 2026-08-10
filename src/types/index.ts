// TypeScript types for NOVA OVO Platform
// 𓂀 PARALLAX ORGANISM — COMPLETE TYPE SYSTEM 𓂀

// Re-export all organism types (300 models, engines, memory temple)
export * from './organisms';

// Re-export GO System types (50 models, 31 MCP servers, 100 scrapers, 20 workflows)
export * from './goSystem';

// Re-export Call Marketplace types (260 tools, 55 protocols, 5 tiers, settlement/proof)
export * from './marketplace';

// Re-export App Builder types
export * from './appBuilder';

// Re-export Cognitive Language types (42 languages, 11 stacks, 8 meta-classes)
export * from './cognitive-languages';

// Re-export terminal protocol contracts
export * from './terminal-contracts';

// ─── Coordinates ────────────────────────────────────────────────────────────

export interface SpatialCoordinate {
  theta: number;   // 0–360 angular position
  phi: number;     // 0–180 elevation angle
  depth: number;   // 0–100 depth layer
  ring: number;    // 1–12 macro ring (N1–N12)
  beat: number;    // temporal beat index
}

// ─── Memory ─────────────────────────────────────────────────────────────────

export type MemoryType = 'episodic' | 'semantic' | 'procedural' | 'spatial' | 'doctrinal';

export interface MemoryEntry {
  id: string;
  content: string;
  type: MemoryType;
  coordinates: SpatialCoordinate;
  salience: number;       // 0–1
  doctrineAlignment: number; // 0–1
  tags: string[];
  lineageId?: string;
  parentId?: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  resonanceScore?: number;
  semanticVector?: number[];
}

export interface MemoryQuery {
  query: string;
  type?: MemoryType;
  minSalience?: number;
  minDoctrineAlignment?: number;
  ring?: number;
  lineageId?: string;
  limit?: number;
}

export interface MemoryResult {
  entries: MemoryEntry[];
  totalCount: number;
  queryTime: number;
}

// ─── Omni Read ───────────────────────────────────────────────────────────────

/** Shape returned by a single gate check. */
export interface GateCheckResult {
  allowed: boolean;
  gate: {
    id: string;
    name: string;
    status: string;
    description: string;
    lastChecked: string;
  };
  reason: string;
}

/**
 * OmniReadResult — the unified, read-only omnidirectional query response.
 *
 * One call, one return value, every dimension. No mutations. No side effects.
 * This is what "read-only" means when read-only is also information.
 */
export interface OmniReadResult {
  /** The raw query string that was processed. */
  query: string;
  /** The query compressed through the sovereign lexicon. */
  compressed: string;
  /** ISO timestamp of when the read was performed. */
  timestamp: string;
  /** Wall-clock ms for the entire omnidirectional pass. */
  processingMs: number;
  /** Number of independent dimensions processed. */
  dimensionCount: number;

  /** Dimension 1 — Semantic: keyword/content matches ranked by salience. */
  semantic: {
    matches: MemoryEntry[];
    avgSalience: number;
  };

  /** Dimension 2 — Resonance: entries ranked by resonance score. */
  resonance: {
    matches: MemoryEntry[];
    avgScore: number;
  };

  /** Dimension 3 — Doctrinal: entries with doctrine alignment ≥ 0.8. */
  doctrinal: {
    matches: MemoryEntry[];
    avgAlignment: number;
  };

  /** Dimension 4 — Spatial: entries grouped by ring (1–12). */
  spatial: {
    byRing: Record<number, MemoryEntry[]>;
    nearestRing: number | null;
  };

  /** Dimension 5 — Lineage: chains traced from top semantic matches. */
  lineage: {
    chains: Array<{
      lineageId: string;
      entries: MemoryEntry[];
      depth: number;
    }>;
  };

  /** Dimension 6 — Pinned: all pinned memories (always relevant anchors). */
  pinned: MemoryEntry[];

  /** Dimension 7 — Stats: current store aggregate. */
  stats: {
    total: number;
    pinned: number;
    byType: Record<string, number>;
    avgSalience: number;
  };

  /** Dimension 8 — Gates: live gate check across all three sovereign gates. */
  gates: Record<string, GateCheckResult>;

  /** Dimension 9 — Sovereign Symbols: lexicon entries relevant to the query. */
  sovereignSymbols: Array<{
    symbol: string;
    english: string;
    latin: string;
    doctrine: string;
    weight: number;
  }>;

  /** Dimension 10 — Unified: top entries ranked across all dimensions combined. */
  unified: MemoryEntry[];
}

// ─── Organism State (4-Register) ────────────────────────────────────────────

export type OrganismRegister = 'cognitive' | 'affective' | 'somatic' | 'sovereign';

export interface OrganismState {
  cognitive: number;    // 0–100 clarity
  affective: number;    // 0–100 coherence
  somatic: number;      // 0–100 grounding
  sovereign: number;    // 0–100 authority
  phase: 'awake' | 'integrating' | 'deep' | 'broadcast';
  lastBeat: number;
  dominantRegister: OrganismRegister;
}

// ─── Models ─────────────────────────────────────────────────────────────────

export type ModelFamily =
  | 'strategist'
  | 'builder'
  | 'analyst'
  | 'governance'
  | 'memory-curator'
  | 'operations'
  | 'risk'
  | 'projection';

export interface ModelDefinition {
  id: ModelFamily;
  name: string;
  description: string;
  capabilities: string[];
  status: 'active' | 'idle' | 'loading' | 'offline';
  latency: number; // ms
  invocationCount: number;
  color: string;
}

export interface ModelInvocation {
  id: string;
  modelId: ModelFamily;
  prompt: string;
  response: string;
  latency: number;
  timestamp: string;
  tokens: number;
}

// ─── Governance ──────────────────────────────────────────────────────────────

export type ProposalStatus = 'draft' | 'open' | 'approved' | 'rejected' | 'enacted' | 'archived';
export type GateStatus = 'green' | 'amber' | 'red';
export type GateId = 'A' | 'B' | 'C';

export interface Gate {
  id: GateId;
  name: string;
  status: GateStatus;
  description: string;
  lastChecked: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  status: ProposalStatus;
  votes: { for: number; against: number; abstain: number };
  createdAt: string;
  updatedAt: string;
  enactedAt?: string;
  doctrineRef?: string;
  affectedGates: GateId[];
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
  proposalId?: string;
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system' | 'command';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  modelUsed?: ModelFamily;
  commandParsed?: ParsedCommand;
  structuredResponse?: StructuredResponse;
  timestamp: string;
  processing?: boolean;
}

export interface ParsedCommand {
  raw: string;
  verb: string;
  module: string;
  args: string[];
  flags: Record<string, string | boolean>;
  valid: boolean;
  error?: string;
}

export interface StructuredResponse {
  type:
    | 'memory' | 'governance' | 'model' | 'company' | 'organism' | 'help' | 'error' | 'info'
    | 'campaign' | 'voice' | 'message' | 'export' | 'document' | 'device'
    | 'kernel' | 'edge' | 'resonance' | 'recital' | 'gate' | 'encryption' | 'wire'
    | 'icp' | 'contract' | 'ledger' | 'cpl' | 'intelligence' | 'nexus'
    | 'deploy' | 'synthesis' | 'wiring' | 'thermodynamics' | 'quantum' | 'compiler'
    | 'network' | 'os' | 'access' | 'sandbox' | 'sensory' | 'saas' | 'civilization'
    | 'signal' | 'consensus' | 'frequency' | 'bus' | 'vault' | 'translate'
    | 'council' | 'role' | 'substrate' | 'sdk' | 'marketplace'
    | 'graph' | 'palace' | 'temporal' | 'harmonic' | 'token' | 'livingdoc' | 'incentive'
    | 'replay' | 'permissions' | 'agents'
    | 'agi' | 'desktop' | 'extension' | 'tab-control';
  title: string;
  data: unknown;
  actions?: ResponseAction[];
}

export interface ResponseAction {
  label: string;
  command: string;
  variant: 'primary' | 'secondary' | 'danger';
}

// ─── Company Onboarding ──────────────────────────────────────────────────────

export type OnboardingMode = 'connect' | 'internalize' | 'hybrid';
export type ConnectorStatus = 'connected' | 'pending' | 'disconnected' | 'error';
export type ConnectorType =
  | 'crm'
  | 'erp'
  | 'email'
  | 'calendar'
  | 'storage'
  | 'communication'
  | 'analytics'
  | 'custom';

export interface Connector {
  id: string;
  name: string;
  type: ConnectorType;
  status: ConnectorStatus;
  mode: OnboardingMode;
  lastSync?: string;
  dataPoints?: number;
  icon: string;
}

export interface Company {
  id: string;
  name: string;
  mode: OnboardingMode;
  connectors: Connector[];
  onboardedAt: string;
  memoryEntries: number;
  governanceActive: boolean;
}

// ─── Replay / Audit ──────────────────────────────────────────────────────────

export interface ReplayEvent {
  id: string;
  sequenceId: number;
  type: 'command' | 'memory' | 'governance' | 'model' | 'company' | 'system';
  action: string;
  payload: unknown;
  outcome: 'success' | 'failure' | 'partial';
  timestamp: string;
  actor: string;
  duration: number;
}

export interface ReplaySession {
  id: string;
  name: string;
  startTime: string;
  endTime?: string;
  events: ReplayEvent[];
  status: 'recording' | 'paused' | 'complete';
}

// ─── Permissions ─────────────────────────────────────────────────────────────

export type PermissionScope =
  | 'memory:read'
  | 'memory:write'
  | 'memory:delete'
  | 'governance:read'
  | 'governance:propose'
  | 'governance:vote'
  | 'governance:enact'
  | 'model:invoke'
  | 'model:configure'
  | 'company:read'
  | 'company:write'
  | 'replay:read'
  | 'permissions:manage'
  | 'organism:read'
  | 'organism:write'
  | 'device:register'
  | 'device:contract';

export interface Permission {
  id: string;
  scope: PermissionScope;
  grantedTo: string;
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
  active: boolean;
}

export interface PermissionGrant {
  scope: PermissionScope;
  grantedTo: string;
  expiresAt?: string;
}

// ─── Living Document ─────────────────────────────────────────────────────────

export interface LivingDocumentPacket {
  id: string;
  title: string;
  version: string;
  doctrineLevel: number; // 1–12 (N1–N12)
  content: string;
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    ring: number;
    beat: number;
    gateRequired: GateId | null;
  };
  lineage: string[];
  active: boolean;
}

// ─── RECITAL_PLUS_ONE ────────────────────────────────────────────────────────

export interface RecitalPlusOneSequence {
  id: string;
  phase: 'recital' | 'integration' | 'amplification' | 'broadcast';
  currentStep: number;
  totalSteps: number;
  input: string;
  resonance: number;
  output?: string;
  completed: boolean;
}

// ─── Dual Read ───────────────────────────────────────────────────────────────

export interface DualReadResult {
  semanticScore: number;
  resonanceScore: number;
  combinedScore: number;
  semanticMatches: MemoryEntry[];
  resonanceMatches: MemoryEntry[];
  unified: MemoryEntry[];
}

// ─── ULRI (Unified Layered Routing Intelligence) ─────────────────────────────

export interface UlriScore {
  modelId: ModelFamily;
  keywordScore: number;
  organismAffinity: number;
  gateWeight: number;
  compositeScore: number;
}

export interface UlriConsensusInfo {
  models: ModelFamily[];
  agreementScore: number;
}

// ─── Platform Sync ───────────────────────────────────────────────────────────

export interface PlatformSyncState {
  organism: OrganismState;
  gates: Gate[];
  governance: {
    totalProposals: number;
    open: number;
    enacted: number;
    approved: number;
    gateStatuses: Record<GateId, GateStatus>;
  };
  memory: {
    total: number;
    pinned: number;
    byType: Record<string, number>;
    avgSalience: number;
  };
  models: {
    families: ModelDefinition[];
    stats: { totalInvocations: number; activeModels: number; avgLatency: number };
  };
  replay: { totalSessions: number; totalEvents: number; currentlyRecording: boolean };
  recentMemories: MemoryEntry[];
  timestamp: string;
  beat: number;
}

// ─── Device Network ──────────────────────────────────────────────────────────

export interface DeviceNode {
  id: string;
  deviceType: DeviceType;
  frequencySignature: {
    fundamental: number;
    phiModulation: number;
  };
  phiPosition: { x: number; y: number };
  trustScore: number;
  hasContract: boolean;
  permissions: string[];
}

export interface DeviceContract {
  id: string;
  deviceId: string;
  animaHash: number;
  blockchainAnchor: string;
  phiGridSample: number[][];
  createdAt: string;
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  processingTime?: number;
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export type PanelId = 'chat' | 'memory' | 'governance' | 'models' | 'company' | 'replay' | 'permissions' | 'organism' | 'devices' | 'messages' | 'campaigns' | 'export' | 'settings' | 'agents' | 'agi' | 'jarvis' | 'builder';

export interface NavItem {
  id: PanelId;
  label: string;
  icon: string;
  color: string;
  badge?: number;
}

// ─── Voice System ────────────────────────────────────────────────────────────

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  waveform: number[];
}

// ─── Device Sovereignty ──────────────────────────────────────────────────────

export type SensorType = 
  | 'motion'
  | 'orientation'
  | 'location'
  | 'battery'
  | 'network'
  | 'bluetooth'
  | 'camera'
  | 'microphone'
  | 'storage';

export type DeviceType = 
  | 'phone'
  | 'tablet'
  | 'laptop'
  | 'desktop'
  | 'tv'
  | 'wearable'
  | 'iot'
  | 'wifi'
  | 'sensor'
  | 'unknown';

// ─── Export Actions ──────────────────────────────────────────────────────────

export interface ExportConfig {
  format: 'pdf' | 'excel' | 'json' | 'csv';
  dataType: string;
  filters?: Record<string, unknown>;
}

export interface ExportResult {
  success: boolean;
  filename?: string;
  blobUrl?: string;
  error?: string;
}

// ─── Campaign System ─────────────────────────────────────────────────────────

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'content' | 'advertising';
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
  targets: CampaignTarget[];
  content: CampaignContent[];
  metrics?: CampaignMetrics;
}

export interface CampaignTarget {
  id: string;
  type: 'audience' | 'segment' | 'individual';
  criteria: Record<string, unknown>;
  estimatedReach: number;
}

export interface CampaignContent {
  id: string;
  type: 'text' | 'image' | 'video' | 'link';
  content: string;
  platform?: string;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  engagement: number;
}

// ─── Messaging System ────────────────────────────────────────────────────────

export interface MessageDraft {
  id: string;
  to: string[];
  subject?: string;
  body: string;
  attachments: MessageAttachment[];
  channel: 'email' | 'sms' | 'in-app' | 'push';
  scheduledFor?: string;
  status: 'draft' | 'pending-approval' | 'approved' | 'sent' | 'failed';
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

// ─── Approval Workflow ───────────────────────────────────────────────────────

export interface ApprovalRequest {
  id: string;
  type: 'action' | 'message' | 'export' | 'campaign' | 'system';
  title: string;
  description: string;
  payload: unknown;
  requestedAt: string;
  requestedBy: 'oro' | 'nova' | 'system';
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  approvedBy?: string;
}

// ─── Terminal Types ──────────────────────────────────────────────────────────

export interface TerminalLine {
  id: string;
  text: string;
  type: string;
  timestamp: string;
}

export interface TerminalSession {
  id: string;
  task: string;
  startedAt: string;
  thinkingLines: TerminalLine[];
  executionLines: TerminalLine[];
  pendingApprovals: string[];
  status: 'active' | 'paused' | 'completed';
}

// ─── Frontend Technology Intelligence Models (F-MODEL) ──────────────────────

export type FModelCategory =
  | 'markup'
  | 'styling'
  | 'framework'
  | 'state-management'
  | 'build-tools'
  | 'testing'
  | 'graphics'
  | 'communication'
  | 'storage'
  | 'web-api'
  | 'web3';

export interface FrontendIntelligenceModel {
  id: string;                    // F-MODEL-001..F-MODEL-115
  technology: string;            // HTML5, React, etc.
  naturalLanguage: string;       // What it "speaks"
  intelligenceType: string;      // Document Structure Intelligence, etc.
  category: FModelCategory;
  ringAffinity: number[];        // [N1..N12]
  integrationCoefficient: number;// φ-based coefficient
  status: 'active' | 'idle' | 'loading' | 'offline';
}

export interface FModelRegistry {
  models: FrontendIntelligenceModel[];
  totalCount: number;
  categories: Record<FModelCategory, number>;
  ringDistribution: Record<number, string[]>; // Ring -> Model IDs
}

// F-MODEL Categories with counts
export const F_MODEL_CATEGORIES: Record<FModelCategory, { count: number; range: string }> = {
  'markup': { count: 8, range: 'F-MODEL-001..F-MODEL-008' },
  'styling': { count: 15, range: 'F-MODEL-009..F-MODEL-023' },
  'framework': { count: 15, range: 'F-MODEL-024..F-MODEL-038' },
  'state-management': { count: 12, range: 'F-MODEL-039..F-MODEL-050' },
  'build-tools': { count: 10, range: 'F-MODEL-051..F-MODEL-060' },
  'testing': { count: 8, range: 'F-MODEL-061..F-MODEL-068' },
  'graphics': { count: 12, range: 'F-MODEL-069..F-MODEL-080' },
  'communication': { count: 9, range: 'F-MODEL-081..F-MODEL-089' },
  'storage': { count: 5, range: 'F-MODEL-090..F-MODEL-094' },
  'web-api': { count: 12, range: 'F-MODEL-095..F-MODEL-106' },
  'web3': { count: 9, range: 'F-MODEL-107..F-MODEL-115' },
};

// ICP-specific F-MODELs (Sovereign Connection)
export const ICP_INTELLIGENCE_MODELS = [
  'F-MODEL-111', // @dfinity/agent - ICP INTELLIGENCE
  'F-MODEL-112', // @dfinity/auth-client - ICP AUTH INTELLIGENCE
  'F-MODEL-113', // @dfinity/identity - ICP IDENTITY INTELLIGENCE
  'F-MODEL-114', // @dfinity/candid - ICP INTERFACE INTELLIGENCE
] as const;

// ─── Activated Agent Journal Stream ─────────────────────────────────────────

export type AgentJournalPhase =
  | 'activation'
  | 'vault-retrieval'
  | 'doctrine-retrieval'
  | 'reasoning'
  | 'arbitration'
  | 'composition'
  | 'promotion'
  | 'drift-log'
  | 'completion'
  | 'error';

export interface AgentJournalEntry {
  id: string;
  sessionId: string;
  agentId: ModelFamily | 'arbitrator' | 'system';
  phase: AgentJournalPhase;
  action: string;
  detail?: string;
  maturityScore?: number;  // 0–1
  timestamp: string;
}

export type AgentSessionStatus =
  | 'activating'
  | 'retrieving'
  | 'reasoning'
  | 'arbitrating'
  | 'promoting'
  | 'complete'
  | 'failed';

export interface AgentOutput {
  agentId: ModelFamily;
  response: string;
  confidence: number;  // 0–1
  latency: number;     // ms
}

export interface ActivatedAgentSession {
  id: string;
  task: string;
  context?: string;
  taskClass: string;
  activatedAgents: ModelFamily[];
  status: AgentSessionStatus;
  journal: AgentJournalEntry[];
  vaultRetrievals: MemoryEntry[];
  doctrineRetrievals: MemoryEntry[];
  agentOutputs: AgentOutput[];
  arbitratedOutput?: string;
  composedAnswer?: string;
  maturityScore?: number;   // 0–1 overall quality
  promoted: boolean;
  promotedMemoryId?: string;
  startedAt: string;
  completedAt?: string;
}

export interface AgentActivationRequest {
  task: string;
  context?: string;
  agentOverrides?: ModelFamily[];  // force specific agents instead of auto-select
  autoPromote?: boolean;           // auto-promote if maturity > threshold
  promoteThreshold?: number;       // default 0.80
}

// ─── AGI Desktop Runtime ────────────────────────────────────────────────────

/** Status of the AGI kernel running as a desktop-grade autonomous system */
export type AGIKernelStatus = 'booting' | 'running' | 'degraded' | 'shutdown';

/** Capability tier for the AGI runtime */
export type AGICapabilityTier = 'observer' | 'assistant' | 'operator' | 'autonomous';

/** A browser tab controlled by the AGI */
export interface AGITab {
  id: string;
  url: string;
  title: string;
  status: 'loading' | 'ready' | 'navigating' | 'error' | 'closed';
  pinnedByAI: boolean;
  /** Agent assigned to monitor/control this tab */
  assignedAgent?: ModelFamily;
  createdAt: string;
  lastActivity: string;
}

/** An internet action the AGI can perform */
export type InternetActionType =
  | 'navigate'
  | 'search'
  | 'read-page'
  | 'extract-data'
  | 'fill-form'
  | 'click'
  | 'screenshot'
  | 'download'
  | 'api-call';

/** A single internet action request */
export interface InternetAction {
  id: string;
  type: InternetActionType;
  tabId?: string;
  url?: string;
  selector?: string;
  data?: Record<string, unknown>;
  status: 'queued' | 'running' | 'complete' | 'failed';
  result?: string;
  error?: string;
  agentId: ModelFamily | 'system';
  createdAt: string;
  completedAt?: string;
}

/** A deployed AI process running inside the AGI */
export interface DeployedAI {
  id: string;
  name: string;
  description: string;
  agentFamily: ModelFamily;
  status: 'deploying' | 'active' | 'paused' | 'stopped' | 'error';
  capabilities: string[];
  /** Tabs this AI can control */
  assignedTabs: string[];
  /** Task loop — what the AI is doing */
  currentTask?: string;
  actionHistory: InternetAction[];
  metrics: {
    actionsCompleted: number;
    actionsQueued: number;
    uptime: number;        // seconds
    lastHeartbeat: string;
  };
  createdAt: string;
}

/** Browser extension connection state */
export type ExtensionConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/** Extension sidebar panel modes */
export type ExtensionPanelMode = 'chat' | 'page-analysis' | 'memory-write' | 'agent-assist' | 'tab-control';

/** Message from/to the browser extension */
export interface ExtensionMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  type: 'page-context' | 'command' | 'response' | 'heartbeat' | 'tab-event';
  payload: Record<string, unknown>;
  timestamp: string;
}

/** The browser extension state visible to the platform */
export interface ExtensionState {
  connectionStatus: ExtensionConnectionStatus;
  activePanel: ExtensionPanelMode;
  currentPageUrl?: string;
  currentPageTitle?: string;
  connectedTabs: number;
  messageLog: ExtensionMessage[];
  lastHeartbeat?: string;
}

/** Full AGI Desktop state for the platform sync */
export interface AGIDesktopState {
  kernelStatus: AGIKernelStatus;
  capabilityTier: AGICapabilityTier;
  tabs: AGITab[];
  deployedAIs: DeployedAI[];
  actionQueue: InternetAction[];
  extension: ExtensionState;
  stats: {
    totalTabs: number;
    totalDeployedAIs: number;
    totalActionsRun: number;
    totalActionsQueued: number;
    uptime: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CODEX MEMORIA VITA — Autobot/Decepticon, Semper Memoria, Vita Aeterna Types
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Autobot Codex ───────────────────────────────────────────────────────────

/** Autobot law identifiers — must be satisfied for all constructive actions */
export type AutobotLaw = 'A-1' | 'A-2' | 'A-3' | 'A-4';

/** Autobot law definitions */
export const AUTOBOT_LAWS: Record<AutobotLaw, { name: string; description: string }> = {
  'A-1': { name: 'Coherence', description: 'Outputs must maintain semantic and doctrinal coherence' },
  'A-2': { name: 'Reversibility', description: 'Every mutation must be reversible via lineage rollback' },
  'A-3': { name: 'Explainability', description: 'All reasoning must be audit-loggable with causal chains' },
  'A-4': { name: 'Containment', description: 'Actions bounded to authorized scopes; no privilege escalation' },
};

/** Autobot class hierarchy — constructive agent types */
export type AutobotClass =
  | 'PRIME'       // Sovereign-level builder; full doctrine access
  | 'GUARDIAN'    // Gate enforcement and security
  | 'ARCHITECT'   // Memory structure and lineage design
  | 'CURATOR'     // Memory curation and retention policy
  | 'ANALYST'     // Read-only analysis and projection
  | 'OPERATOR'    // Workflow execution within bounds
  | 'SCOUT';      // External reconnaissance (sandboxed output)

/** An active Autobot agent instance */
export interface AutobotInstance {
  id: string;
  class: AutobotClass;
  scope: AccessScope;
  lineageId: string;           // Bound lineage for memory operations
  status: 'spawning' | 'active' | 'suspended' | 'retired';
  lawCheckResults: CodexLawCheckResult[];
  spawnedAt: string;
  spawnedBy: string;
  retiredAt?: string;
}

// ─── Decepticon Codex ────────────────────────────────────────────────────────

/** Decepticon law identifiers — must be satisfied for all adversarial actions */
export type DecepticonLaw = 'D-1' | 'D-2' | 'D-3' | 'D-4';

/** Decepticon law definitions */
export const DECEPTICON_LAWS: Record<DecepticonLaw, { name: string; description: string }> = {
  'D-1': { name: 'Sandboxing', description: 'All actions confined to isolated sandbox' },
  'D-2': { name: 'Telemetry', description: 'Every action emits immutable telemetry to audit log' },
  'D-3': { name: 'Non-Persistence', description: 'Chaos mutations auto-expire; no canonical persistence' },
  'D-4': { name: 'Counterpart', description: 'Every Decepticon class has a mandatory Autobot counterpart' },
};

/** Decepticon class hierarchy — adversarial agent types */
export type DecepticonClass =
  | 'TRICKSTER'   // Input mutation and edge-case generation
  | 'PHANTOM'     // State hallucination probing
  | 'CRAWLER'     // Aggressive boundary scanning
  | 'DISRUPTOR'   // Concurrent stress testing
  | 'MIRAGE';     // False response generation for security testing

/** Decepticon-to-Autobot counterpart mapping */
export const DECEPTICON_COUNTERPARTS: Record<DecepticonClass, AutobotClass> = {
  TRICKSTER: 'GUARDIAN',
  PHANTOM: 'ARCHITECT',
  CRAWLER: 'SCOUT',
  DISRUPTOR: 'OPERATOR',
  MIRAGE: 'ANALYST',
};

/** An active Decepticon agent instance */
export interface DecepticonInstance {
  id: string;
  class: DecepticonClass;
  chaosDomainId: string;        // Bound chaos domain
  counterpartId?: string;       // Linked Autobot counterpart
  status: 'deployed' | 'active' | 'expired';
  telemetryLog: ChaosTelemetryEntry[];
  deployedAt: string;
  expiresAt: string;
}

/** A chaos domain sandbox for Decepticon operations */
export interface ChaosDomain {
  id: string;
  decepticonId: string;
  class: DecepticonClass;
  status: 'active' | 'expired' | 'terminated';
  ttl: number;                   // milliseconds
  createdAt: string;
  expiresAt: string;
  telemetryCount: number;
  mutations: ChaosMutation[];
}

/** A mutation attempted within a chaos domain */
export interface ChaosMutation {
  id: string;
  domainId: string;
  action: string;
  target: string;
  beforeState?: unknown;
  afterState?: unknown;
  timestamp: string;
  reverted: boolean;
}

/** Telemetry entry for chaos-domain actions */
export interface ChaosTelemetryEntry {
  id: string;
  domainId: string;
  decepticonId: string;
  action: string;
  payload?: unknown;
  outcome: 'success' | 'blocked' | 'error';
  lawChecks: CodexLawCheckResult[];
  timestamp: string;
}

// ─── Codex Law Check ─────────────────────────────────────────────────────────

/** Result of a codex law check (Autobot or Decepticon) */
export interface CodexLawCheckResult {
  passed: boolean;
  law: AutobotLaw | DecepticonLaw;
  agent: string;                // Agent ID
  agentClass: AutobotClass | DecepticonClass;
  action: string;               // Attempted action
  reason: string;               // Pass/fail explanation
  timestamp: string;
  auditId: string;              // Reference to audit log entry
}

/** Codex audit action types */
export type CodexAuditAction =
  | 'AUTOBOT_SPAWN'
  | 'AUTOBOT_RETIRE'
  | 'AUTOBOT_LAW_CHECK'
  | 'DECEPTICON_DEPLOY'
  | 'DECEPTICON_TELEMETRY'
  | 'CHAOS_DOMAIN_CREATE'
  | 'CHAOS_DOMAIN_EXPIRE'
  | 'LINEAGE_CREATE'
  | 'LINEAGE_FORK'
  | 'LINEAGE_MERGE'
  | 'SHARD_APPEND'
  | 'ACCESS_GRANT'
  | 'ACCESS_REVOKE'
  | 'LIFECYCLE_TRANSITION'
  | 'QUOTA_EXCEEDED';

// ─── Semper Memoria — Eternal Memory System ─────────────────────────────────

/** Access scope for memory operations */
export type AccessScope =
  | 'public'       // Any reader
  | 'enterprise'   // Authenticated enterprise
  | 'internal'     // Platform operators
  | 'sovereign'    // Doctrine-bound only
  | 'chaos';       // Chaos-domain only (ephemeral)

/** Memory compression level */
export type CompressionLevel = 0 | 1 | 2 | 3;

/** Compression level metadata */
export const COMPRESSION_LEVELS: Record<CompressionLevel, { name: string; retention: string; useCase: string }> = {
  0: { name: 'RAW', retention: '≤ 24h hot', useCase: 'Active working memory' },
  1: { name: 'LIGHT', retention: '≤ 7d warm', useCase: 'Recent context' },
  2: { name: 'STANDARD', retention: '≤ 90d cold', useCase: 'Historical reference' },
  3: { name: 'ARCHIVE', retention: 'Eternal', useCase: 'Doctrinal law, lineage roots' },
};

/** A memory lineage chain in Semper Memoria */
export interface SemperMemoriaLineage {
  id: string;
  name: string;
  rootId: string;               // Ultimate ancestor
  parentId?: string;            // Direct parent (if forked)
  forkPoint?: string;           // ISO timestamp of fork
  mergedFrom?: string[];        // IDs merged into this lineage
  depth: number;                // Distance from root
  shardCount: number;           // Number of shards in this lineage
  status: 'active' | 'archived' | 'merged' | 'pruned';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

/** A memory shard within a lineage */
export interface SemperMemoriaShard {
  id: string;
  lineageId: string;
  content: string;
  contentHash: string;          // SHA-256 of content
  compressionLevel: CompressionLevel;
  accessScope: AccessScope;
  ttl?: number;                 // Seconds until auto-prune (null = eternal)
  tags: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  createdBy: string;            // Agent or user ID
  expiresAt?: string;
}

/** Access grant for a lineage */
export interface LineageAccessGrant {
  id: string;
  lineageId: string;
  entity: string;               // User or agent ID
  scope: AccessScope;
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
  revoked: boolean;
  revokedAt?: string;
}

/** Result of a lineage merge operation */
export interface LineageMergeResult {
  success: boolean;
  lineage: SemperMemoriaLineage;
  conflicts: LineageMergeConflict[];
  shardsTransferred: number;
}

/** A conflict detected during lineage merge */
export interface LineageMergeConflict {
  sourceShardId: string;
  targetShardId: string;
  conflictType: 'content-collision' | 'hash-mismatch' | 'scope-violation';
  resolution: 'source-wins' | 'target-wins' | 'manual' | 'skipped';
  details: string;
}

/** Lineage summary result */
export interface LineageSummary {
  lineageId: string;
  summary: string;
  shardCount: number;
  totalBytes: number;
  compressionStats: Record<CompressionLevel, number>;
  accessScopeStats: Record<AccessScope, number>;
  generatedAt: string;
}

/** Retention policy for a lineage */
export interface RetentionPolicy {
  lineageId: string;
  maxShards: number;
  maxAgeSeconds: number;
  compressionThreshold: number;  // Age in seconds before auto-compression
  autoArchive: boolean;
  autoPrune: boolean;
}

// ─── Vita Aeterna — Immortal Runtime Lifecycle ──────────────────────────────

/** Organism lifecycle states */
export type OrganismLifecycleState =
  | 'template'     // Blueprint, not yet instantiated
  | 'spawning'     // Initialization in progress
  | 'growth'       // Active development, learning
  | 'maturity'     // Stable operation, full capabilities
  | 'retiring'     // Graceful shutdown, state transfer
  | 'archived';    // Preserved for lineage; no longer active

/** Substrate quota configuration */
export interface SubstrateQuota {
  maxConcurrentAgents: number;           // Per-class agent limit
  memoryShardLimit: number;              // Max shards per lineage
  cpuCyclesPerBeat: number;              // Compute budget per heartbeat
  networkCallsPerMinute: number;         // External call rate limit
  chaosDomainTTL: number;                // Max chaos sandbox lifetime (ms)
}

/** Quota tier identifiers */
export type QuotaTier = 'PUBLIC' | 'ENTERPRISE' | 'SOVEREIGN';

/** Default quotas by tier */
export const DEFAULT_QUOTAS: Record<QuotaTier, SubstrateQuota> = {
  PUBLIC: {
    maxConcurrentAgents: 3,
    memoryShardLimit: 100,
    cpuCyclesPerBeat: 1000,
    networkCallsPerMinute: 10,
    chaosDomainTTL: 300_000,
  },
  ENTERPRISE: {
    maxConcurrentAgents: 10,
    memoryShardLimit: 1000,
    cpuCyclesPerBeat: 10_000,
    networkCallsPerMinute: 100,
    chaosDomainTTL: 900_000,
  },
  SOVEREIGN: {
    maxConcurrentAgents: 50,
    memoryShardLimit: 10_000,
    cpuCyclesPerBeat: 100_000,
    networkCallsPerMinute: 1000,
    chaosDomainTTL: 3_600_000,
  },
};

/** An organism template (blueprint) */
export interface OrganismTemplate {
  id: string;
  name: string;
  description: string;
  autobotClass: AutobotClass;
  defaultScope: AccessScope;
  requiredCapabilities: string[];
  quotaTier: QuotaTier;
  version: string;
  createdAt: string;
  createdBy: string;
}

/** An instantiated organism kernel */
export interface OrganismKernel {
  id: string;
  templateId: string;
  name: string;
  state: OrganismLifecycleState;
  autobotId?: string;           // Linked Autobot instance
  lineageId: string;            // Primary memory lineage
  quota: SubstrateQuota;
  quotaUsage: SubstrateQuotaUsage;
  snapshotPolicy: 'on-beat' | 'on-mutation' | 'manual';
  lastSnapshot?: string;
  beat: number;                 // Current heartbeat
  createdAt: string;
  spawnedAt?: string;
  maturedAt?: string;
  retiredAt?: string;
  archivedAt?: string;
}

/** Current usage against substrate quota */
export interface SubstrateQuotaUsage {
  currentAgents: number;
  currentShards: number;
  cyclesUsedThisBeat: number;
  networkCallsThisMinute: number;
  lastResetAt: string;
}

/** Result of an organism lifecycle transition */
export interface LifecycleTransitionResult {
  success: boolean;
  organismId: string;
  fromState: OrganismLifecycleState;
  toState: OrganismLifecycleState;
  lawChecks: CodexLawCheckResult[];
  reason?: string;
  timestamp: string;
}

/** Organism memory binding to Semper Memoria */
export interface OrganismMemoryBinding {
  organismId: string;
  lineageId: string;            // Primary lineage
  shardIds: string[];           // Active shards in working memory
  snapshotPolicy: 'on-beat' | 'on-mutation' | 'manual';
  lastSnapshot: string;
}

/** Statistics for Vita Aeterna runtime */
export interface VitaAeternaStats {
  totalTemplates: number;
  totalKernels: number;
  byState: Record<OrganismLifecycleState, number>;
  byQuotaTier: Record<QuotaTier, number>;
  totalAutobots: number;
  totalDecepticons: number;
  activeChaosDomains: number;
}

// ─── Codex-Aware Agent Extension ─────────────────────────────────────────────

/** Extended agent activation request with codex awareness */
export interface CodexAgentActivationRequest extends AgentActivationRequest {
  autobotClass?: AutobotClass;
  lineageId?: string;
  enableChaos?: boolean;        // Allow Decepticon counterpart
  decepticonClass?: DecepticonClass;
  quotaTier?: QuotaTier;
}

/** Extended agent session with codex awareness */
export interface CodexActivatedAgentSession extends ActivatedAgentSession {
  autobotId?: string;
  autobotClass?: AutobotClass;
  decepticonId?: string;
  decepticonClass?: DecepticonClass;
  chaosDomainId?: string;
  lineageId?: string;
  lawCheckResults: CodexLawCheckResult[];
  quotaTier: QuotaTier;
  quotaUsage: SubstrateQuotaUsage;
}
