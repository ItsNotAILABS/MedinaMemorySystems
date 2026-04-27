// TypeScript types for NOVA OVO Platform
// 𓂀 PARALLAX ORGANISM — COMPLETE TYPE SYSTEM 𓂀

// Re-export all organism types (300 models, engines, memory temple)
export * from './organisms';

// Re-export GO System types (50 models, 30 MCP servers, 100 scrapers, 20 workflows)
export * from './goSystem';

// Re-export Call Marketplace types (260 tools, 55 protocols, 5 tiers, settlement/proof)
export * from './marketplace';

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
    | 'replay' | 'permissions';
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

export type PanelId = 'chat' | 'memory' | 'governance' | 'models' | 'company' | 'replay' | 'permissions' | 'organism' | 'devices' | 'messages' | 'campaigns' | 'export' | 'settings' | 'jarvis';

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
