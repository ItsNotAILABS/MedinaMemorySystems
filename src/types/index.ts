// TypeScript types for NOVA OVO Platform

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
  type: 'memory' | 'governance' | 'model' | 'company' | 'organism' | 'help' | 'error' | 'info';
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

// ─── Device Network ──────────────────────────────────────────────────────────

export type DeviceType = 'phone' | 'tablet' | 'laptop' | 'desktop' | 'wifi' | 'sensor' | 'unknown';

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

export type PanelId = 'chat' | 'memory' | 'governance' | 'models' | 'company' | 'replay' | 'permissions' | 'organism' | 'devices' | 'settings';

export interface NavItem {
  id: PanelId;
  label: string;
  icon: string;
  color: string;
  badge?: number;
}
