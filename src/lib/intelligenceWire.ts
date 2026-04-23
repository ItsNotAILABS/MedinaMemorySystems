// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE.
/**
 * intelligenceWire.ts — FrontendBackendSync
 * ─────────────────────────────────────────────────────────────────────────────
 * The intelligence wire connecting all 20 frontend components to their
 * backend API endpoints. Every component call routes through this module.
 *
 * Architecture:
 *   Frontend Component
 *       ↓
 *   IntelligenceWire (this file) — typed, audited, φ-timed
 *       ↓
 *   Next.js API Route (/api/*)
 *       ↓
 *   Backend lib/* or ICP canister (Medina.mo)
 *
 * All requests are:
 *   (1) Typed end-to-end
 *   (2) Latency-tracked (φ-beat baseline: 618ms)
 *   (3) Auto-retried with φ-backoff on transient failure
 *   (4) Audited via the sovereignty ledger
 *
 * ISIL-1.1 — Production use requires commercial license + AUT.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── φ Constants ─────────────────────────────────────────────────────────────

const PHI = 1.6180339887498948482;
const PHI_BEAT_MS = 618; // 1000 / φ ≈ 618ms — sovereign request baseline
const PHI_BACKOFF_BASE_MS = 381; // 1000 / φ² ≈ 382ms — first retry wait

// ─── Wire Types ───────────────────────────────────────────────────────────────

export type WireEndpoint =
  | '/api/health'
  | '/api/govern'
  | '/api/message'
  | '/api/campaign'
  | '/api/company'
  | '/api/permissions'
  | '/api/devices'
  | '/api/design-os'
  | '/api/intelligence-wire'
  | '/api/subsystem-terminals';

export type WireMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface WireRequest<T = unknown> {
  endpoint: WireEndpoint;
  method: WireMethod;
  params?: Record<string, string>;
  body?: T;
  /** Component making the call — for audit trail */
  caller: ComponentId;
  /** Max retries — defaults to 3 */
  maxRetries?: number;
}

export interface WireResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  latencyMs: number;
  retries: number;
  timestamp: string;
  /** Whether the response was served from wire cache */
  cached: boolean;
}

export interface WireAuditEntry {
  requestId: string;
  caller: ComponentId;
  endpoint: WireEndpoint;
  method: WireMethod;
  latencyMs: number;
  success: boolean;
  retries: number;
  timestamp: number;
  phiRatio: number; // latencyMs / PHI_BEAT_MS — how close to golden latency
}

// ─── Component IDs — all 20 frontend components ───────────────────────────────

export type ComponentId =
  | 'ArchitectureSurface'
  | 'CampaignsPanel'
  | 'CompanyOnboarding'
  | 'DesignerHub'
  | 'DevicesPanel'
  | 'ExportPanel'
  | 'FormaLeaderboard'
  | 'GovernancePanel'
  | 'MemoryTemple'
  | 'MessagesPanel'
  | 'ModelRuntime'
  | 'OVOChat'
  | 'OrganismField'
  | 'OrganismPanel'
  | 'OroTerminal'
  | 'PermissionsPanel'
  | 'ReplayPanel'
  | 'Sidebar'
  | 'TheWorld'
  | 'WaveformVisualizer';

// ─── Component → Endpoint Routing Map ────────────────────────────────────────

export const COMPONENT_ROUTE_MAP: Record<ComponentId, WireEndpoint[]> = {
  ArchitectureSurface:  ['/api/health', '/api/intelligence-wire'],
  CampaignsPanel:       ['/api/campaign'],
  CompanyOnboarding:    ['/api/company'],
  DesignerHub:          ['/api/design-os', '/api/health'],
  DevicesPanel:         ['/api/devices'],
  ExportPanel:          ['/api/health', '/api/intelligence-wire'],
  FormaLeaderboard:     ['/api/govern', '/api/health'],
  GovernancePanel:      ['/api/govern'],
  MemoryTemple:         ['/api/health', '/api/intelligence-wire'],
  MessagesPanel:        ['/api/message'],
  ModelRuntime:         ['/api/health', '/api/intelligence-wire'],
  OVOChat:              ['/api/message', '/api/health'],
  OrganismField:        ['/api/health', '/api/intelligence-wire'],
  OrganismPanel:        ['/api/health', '/api/subsystem-terminals'],
  OroTerminal:          ['/api/health', '/api/subsystem-terminals'],
  PermissionsPanel:     ['/api/permissions'],
  ReplayPanel:          ['/api/health', '/api/intelligence-wire'],
  Sidebar:              ['/api/health'],
  TheWorld:             ['/api/health', '/api/subsystem-terminals'],
  WaveformVisualizer:   ['/api/health', '/api/intelligence-wire'],
};

// ─── Wire Audit Ledger ────────────────────────────────────────────────────────

const _auditLedger: WireAuditEntry[] = [];
let _requestCounter = 0;

function _auditEntry(entry: Omit<WireAuditEntry, 'requestId' | 'phiRatio'>): void {
  _auditLedger.push({
    ...entry,
    requestId: `wire-${++_requestCounter}-${Date.now()}`,
    phiRatio: entry.latencyMs / PHI_BEAT_MS,
  });
  // Keep last 500 entries
  if (_auditLedger.length > 500) _auditLedger.splice(0, _auditLedger.length - 500);
}

export function getWireAuditLog(limit = 100): WireAuditEntry[] {
  return _auditLedger.slice(-limit).reverse();
}

export function getWireStats() {
  const total = _auditLedger.length;
  const successes = _auditLedger.filter(e => e.success).length;
  const avgLatency = total > 0
    ? _auditLedger.reduce((s, e) => s + e.latencyMs, 0) / total
    : 0;
  const avgPhiRatio = total > 0
    ? _auditLedger.reduce((s, e) => s + e.phiRatio, 0) / total
    : 0;
  const byComponent = Object.fromEntries(
    (Object.keys(COMPONENT_ROUTE_MAP) as ComponentId[]).map(id => [
      id,
      _auditLedger.filter(e => e.caller === id).length,
    ])
  );
  return {
    total,
    successes,
    failures: total - successes,
    successRate: total > 0 ? successes / total : 1,
    avgLatencyMs: Math.round(avgLatency),
    avgPhiRatio: Math.round(avgPhiRatio * 1000) / 1000,
    phiBeat: PHI_BEAT_MS,
    byComponent,
  };
}

// ─── φ-Backoff Retry ─────────────────────────────────────────────────────────

function _phiBackoff(attempt: number): number {
  // Wait = base × φⁿ — golden exponential backoff
  return Math.round(PHI_BACKOFF_BASE_MS * Math.pow(PHI, attempt));
}

function _sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Core Wire Fetch ─────────────────────────────────────────────────────────

async function _wireFetch<TBody, TResult>(
  req: WireRequest<TBody>
): Promise<WireResponse<TResult>> {
  const maxRetries = req.maxRetries ?? 3;
  let attempt = 0;
  let lastError = '';
  const start = Date.now();

  while (attempt <= maxRetries) {
    try {
      // Build URL with query params
      let url = req.endpoint as string;
      if (req.params && Object.keys(req.params).length > 0) {
        url += '?' + new URLSearchParams(req.params).toString();
      }

      const fetchInit: RequestInit = {
        method: req.method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (req.body && (req.method === 'POST' || req.method === 'PUT')) {
        fetchInit.body = JSON.stringify(req.body);
      }

      const res = await fetch(url, fetchInit);
      const latencyMs = Date.now() - start;
      const json = await res.json() as { success?: boolean; data?: TResult; error?: string } & TResult;

      const success = res.ok && (json.success !== false);
      _auditEntry({
        caller: req.caller,
        endpoint: req.endpoint,
        method: req.method,
        latencyMs,
        success,
        retries: attempt,
        timestamp: Date.now(),
      });

      return {
        success,
        data: json.data ?? json as TResult,
        error: success ? undefined : (json.error ?? `HTTP ${res.status}`),
        latencyMs,
        retries: attempt,
        timestamp: new Date().toISOString(),
        cached: false,
      };

    } catch (err) {
      lastError = String(err);
      attempt++;
      if (attempt <= maxRetries) await _sleep(_phiBackoff(attempt - 1));
    }
  }

  const latencyMs = Date.now() - start;
  _auditEntry({
    caller: req.caller, endpoint: req.endpoint, method: req.method,
    latencyMs, success: false, retries: attempt - 1, timestamp: Date.now(),
  });

  return {
    success: false,
    error: lastError,
    latencyMs,
    retries: attempt - 1,
    timestamp: new Date().toISOString(),
    cached: false,
  };
}

// ─── PUBLIC WIRE — per-component strongly-typed methods ──────────────────────

/**
 * IntelligenceWire
 * The single point of truth for all frontend→backend communication.
 * Every component calls through here. Everything is typed, audited, φ-timed.
 */
export const IntelligenceWire = {

  // ── ORGANISM / HEALTH ──────────────────────────────────────────────────────

  /** Full system health — used by ArchitectureSurface, OrganismField, Sidebar, etc. */
  getHealth: (caller: ComponentId) =>
    _wireFetch<never, Record<string, unknown>>({
      endpoint: '/api/health',
      method: 'GET',
      params: { action: 'full' },
      caller,
    }),

  /** Quick health check — low-overhead polling */
  quickHealth: (caller: ComponentId) =>
    _wireFetch<never, { status: string; organism: unknown }>({
      endpoint: '/api/health',
      method: 'GET',
      params: { action: 'quick' },
      caller,
    }),

  /** Edge stats — ArchitectureSurface, ReplayPanel */
  getEdges: (caller: ComponentId) =>
    _wireFetch<never, { stats: unknown; recent: unknown[] }>({
      endpoint: '/api/health',
      method: 'GET',
      params: { action: 'edges' },
      caller,
    }),

  clearEdges: (caller: ComponentId) =>
    _wireFetch<{ action: string }, { success: boolean }>({
      endpoint: '/api/health',
      method: 'POST',
      body: { action: 'clear-edges' },
      caller,
    }),

  // ── GOVERNANCE — GovernancePanel, FormaLeaderboard ─────────────────────────

  listProposals: (caller: ComponentId, status?: string) =>
    _wireFetch<never, unknown[]>({
      endpoint: '/api/govern',
      method: 'GET',
      params: status ? { action: 'list', status } : { action: 'list' },
      caller,
    }),

  getGates: (caller: ComponentId) =>
    _wireFetch<never, Record<string, string>>({
      endpoint: '/api/govern',
      method: 'GET',
      params: { action: 'gates' },
      caller,
    }),

  getGovernanceStats: (caller: ComponentId) =>
    _wireFetch<never, Record<string, unknown>>({
      endpoint: '/api/govern',
      method: 'GET',
      params: { action: 'stats' },
      caller,
    }),

  createProposal: (caller: ComponentId, payload: Record<string, unknown>) =>
    _wireFetch<Record<string, unknown>, { success: boolean; data: unknown }>({
      endpoint: '/api/govern',
      method: 'POST',
      body: { action: 'create', ...payload },
      caller,
    }),

  voteOnProposal: (caller: ComponentId, proposalId: string, vote: unknown) =>
    _wireFetch<Record<string, unknown>, { success: boolean }>({
      endpoint: '/api/govern',
      method: 'POST',
      body: { action: 'vote', proposalId, vote },
      caller,
    }),

  // ── MESSAGING — MessagesPanel, OVOChat ─────────────────────────────────────

  listMessages: (caller: ComponentId, filter?: Record<string, string>) =>
    _wireFetch<never, unknown[]>({
      endpoint: '/api/message',
      method: 'GET',
      params: { action: 'list', ...filter },
      caller,
    }),

  sendMessage: (caller: ComponentId, message: Record<string, unknown>) =>
    _wireFetch<Record<string, unknown>, { success: boolean; data: unknown }>({
      endpoint: '/api/message',
      method: 'POST',
      body: { action: 'send', ...message },
      caller,
    }),

  getMessageStats: (caller: ComponentId) =>
    _wireFetch<never, Record<string, unknown>>({
      endpoint: '/api/message',
      method: 'GET',
      params: { action: 'stats' },
      caller,
    }),

  // ── CAMPAIGNS — CampaignsPanel ─────────────────────────────────────────────

  listCampaigns: (caller: ComponentId) =>
    _wireFetch<never, unknown[]>({
      endpoint: '/api/campaign',
      method: 'GET',
      params: { action: 'list' },
      caller,
    }),

  createCampaign: (caller: ComponentId, campaign: Record<string, unknown>) =>
    _wireFetch<Record<string, unknown>, { success: boolean; data: unknown }>({
      endpoint: '/api/campaign',
      method: 'POST',
      body: { action: 'create', ...campaign },
      caller,
    }),

  getCampaignStats: (caller: ComponentId) =>
    _wireFetch<never, Record<string, unknown>>({
      endpoint: '/api/campaign',
      method: 'GET',
      params: { action: 'stats' },
      caller,
    }),

  // ── COMPANY — CompanyOnboarding ────────────────────────────────────────────

  getCompanyState: (caller: ComponentId) =>
    _wireFetch<never, Record<string, unknown>>({
      endpoint: '/api/company',
      method: 'GET',
      params: { action: 'state' },
      caller,
    }),

  submitCompanyOnboarding: (caller: ComponentId, data: Record<string, unknown>) =>
    _wireFetch<Record<string, unknown>, { success: boolean; data: unknown }>({
      endpoint: '/api/company',
      method: 'POST',
      body: { action: 'onboard', ...data },
      caller,
    }),

  // ── PERMISSIONS — PermissionsPanel ────────────────────────────────────────

  listPermissions: (caller: ComponentId) =>
    _wireFetch<never, unknown[]>({
      endpoint: '/api/permissions',
      method: 'GET',
      params: { action: 'list' },
      caller,
    }),

  grantPermission: (caller: ComponentId, permission: Record<string, unknown>) =>
    _wireFetch<Record<string, unknown>, { success: boolean }>({
      endpoint: '/api/permissions',
      method: 'POST',
      body: { action: 'grant', ...permission },
      caller,
    }),

  revokePermission: (caller: ComponentId, permissionId: string) =>
    _wireFetch<{ action: string; permissionId: string }, { success: boolean }>({
      endpoint: '/api/permissions',
      method: 'POST',
      body: { action: 'revoke', permissionId },
      caller,
    }),

  // ── DEVICES — DevicesPanel ─────────────────────────────────────────────────

  getDeviceState: (caller: ComponentId) =>
    _wireFetch<never, Record<string, unknown>>({
      endpoint: '/api/devices',
      method: 'GET',
      params: { action: 'state' },
      caller,
    }),

  registerDevice: (caller: ComponentId, device: Record<string, unknown>) =>
    _wireFetch<Record<string, unknown>, { success: boolean; data: unknown }>({
      endpoint: '/api/devices',
      method: 'POST',
      body: { action: 'register', ...device },
      caller,
    }),

  // ── SOVEREIGN DESIGN OS — DesignerHub ────────────────────────────────────

  /** Get all 10 MACHINA design model specs */
  getDesignModels: (caller: ComponentId) =>
    _wireFetch<never, Record<string, unknown>[]>({
      endpoint: '/api/design-os',
      method: 'GET',
      params: { action: 'models' },
      caller,
    }),

  /** Get a specific MACHINA model */
  getDesignModel: (caller: ComponentId, modelId: string) =>
    _wireFetch<never, Record<string, unknown>>({
      endpoint: '/api/design-os',
      method: 'GET',
      params: { action: 'model', modelId },
      caller,
    }),

  /** Get SovereignDesignOS status */
  getDesignOSStatus: (caller: ComponentId) =>
    _wireFetch<never, Record<string, unknown>>({
      endpoint: '/api/design-os',
      method: 'GET',
      params: { action: 'status' },
      caller,
    }),

  /** Invoke a MACHINA model use-case computation */
  invokeDesignModel: (caller: ComponentId, modelId: string, useId: string, input: number) =>
    _wireFetch<{ action: string; modelId: string; useId: string; input: number }, Record<string, unknown>>({
      endpoint: '/api/design-os',
      method: 'POST',
      body: { action: 'invoke', modelId, useId, input },
      caller,
    }),

  // ── INTELLIGENCE WIRE META — ArchitectureSurface, ExportPanel ───────────

  /** Get IntelligenceWire stats — latency, phi-ratio, per-component call counts */
  getWireStats: (caller: ComponentId) =>
    _wireFetch<never, Record<string, unknown>>({
      endpoint: '/api/intelligence-wire',
      method: 'GET',
      params: { action: 'stats' },
      caller,
    }),

  /** Get wire audit log */
  getWireAuditLog: (caller: ComponentId, limit = 100) =>
    _wireFetch<never, WireAuditEntry[]>({
      endpoint: '/api/intelligence-wire',
      method: 'GET',
      params: { action: 'audit', limit: String(limit) },
      caller,
    }),

  // ── SUBSYSTEM TERMINALS — OrganismPanel, OroTerminal, TheWorld ───────────

  /** List all active subsystem terminals */
  listSubsystemTerminals: (caller: ComponentId) =>
    _wireFetch<never, Record<string, unknown>[]>({
      endpoint: '/api/subsystem-terminals',
      method: 'GET',
      params: { action: 'list' },
      caller,
    }),

  /** Get a specific subsystem terminal state */
  getSubsystemTerminal: (caller: ComponentId, terminalId: string) =>
    _wireFetch<never, Record<string, unknown>>({
      endpoint: '/api/subsystem-terminals',
      method: 'GET',
      params: { action: 'get', terminalId },
      caller,
    }),

  /** Execute a command on a subsystem terminal */
  execSubsystemCommand: (
    caller: ComponentId,
    terminalId: string,
    command: string,
    args?: Record<string, unknown>
  ) =>
    _wireFetch<Record<string, unknown>, { success: boolean; output: unknown; latencyMs: number }>({
      endpoint: '/api/subsystem-terminals',
      method: 'POST',
      body: { action: 'exec', terminalId, command, args },
      caller,
    }),

  /** Get subsystem terminal health summary */
  getSubsystemHealth: (caller: ComponentId) =>
    _wireFetch<never, Record<string, unknown>>({
      endpoint: '/api/subsystem-terminals',
      method: 'GET',
      params: { action: 'health' },
      caller,
    }),
};

// ─── FrontendBackendSync — the sync bridge (referenced from Medina.mo) ───────

export interface FrontendSyncState {
  connectedComponents: ComponentId[];
  lastSyncAt: number;
  pendingRequests: number;
  phiBeat: number;
  health: 'synced' | 'degraded' | 'disconnected';
}

let _syncState: FrontendSyncState = {
  connectedComponents: [],
  lastSyncAt: 0,
  pendingRequests: 0,
  phiBeat: PHI_BEAT_MS,
  health: 'disconnected',
};

export const FrontendBackendSync = {

  /** Register a component as connected to the wire */
  connect: (componentId: ComponentId): void => {
    if (!_syncState.connectedComponents.includes(componentId)) {
      _syncState.connectedComponents.push(componentId);
    }
    _syncState.lastSyncAt = Date.now();
    _syncState.health = 'synced';
  },

  /** Deregister a component */
  disconnect: (componentId: ComponentId): void => {
    _syncState.connectedComponents = _syncState.connectedComponents.filter(c => c !== componentId);
    if (_syncState.connectedComponents.length === 0) _syncState.health = 'disconnected';
  },

  /** Get the current sync state */
  getState: (): FrontendSyncState => ({ ..._syncState }),

  /** Ping the backend — used by Sidebar and health monitors */
  ping: async (caller: ComponentId): Promise<boolean> => {
    const res = await IntelligenceWire.quickHealth(caller);
    _syncState.lastSyncAt = Date.now();
    _syncState.health = res.success ? 'synced' : 'degraded';
    return res.success;
  },

  /** Get the φ-beat baseline latency target */
  getPhiBeat: (): number => PHI_BEAT_MS,

  /** How close is the current avg latency to the golden baseline? */
  getPhiCoherence: (): number => {
    const stats = getWireStats();
    if (stats.total === 0) return 1.0;
    return 1.0 - Math.abs(stats.avgLatencyMs - PHI_BEAT_MS) / (PHI_BEAT_MS * PHI);
  },
};

// ─── Default export ───────────────────────────────────────────────────────────

export default IntelligenceWire;
