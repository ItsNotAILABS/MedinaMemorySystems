// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE.
import { NextRequest, NextResponse } from 'next/server';
import {
  buildTerminalProtocolDescriptor,
  determineTerminalHealth,
  negotiateTerminalProtocol,
  TERMINAL_API_VERSION,
  TERMINAL_PROTOCOL_VERSION,
} from '@/lib/terminalProtocol';
import type {
  SubTerminalSession,
  TerminalCapability,
  TerminalCompatibilityContract,
  TerminalLifecycleState,
  TerminalNegotiationRequest,
  TerminalProtocolDescriptor,
} from '@/types/terminal-contracts';

// ─── Subsystem Terminal Registry ──────────────────────────────────────────────

const PHI = 1.6180339887498948482;

export type TerminalStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'STANDBY' | 'ACTIVATING';

export interface SubsystemTerminal {
  terminalId: string;
  name: string;
  subsystem: string;
  status: TerminalStatus;
  description: string;
  endpoint?: string;
  /** φ-coherence score 0-1 */
  coherence: number;
  lastHeartbeat: number;
  commands: string[];
  protocol: TerminalProtocolDescriptor;
  compatibility: TerminalCompatibilityContract;
}

interface TerminalRuntimeState {
  lifecycleState: TerminalLifecycleState;
  status: TerminalStatus;
  lastHeartbeat: number;
  sessionId?: string;
  commandCount: number;
}

interface TerminalCommandRequest {
  action: string;
  terminalId?: string;
  command?: string;
  args?: Record<string, unknown>;
  requestedApiVersion?: string;
  requestedCapabilities?: TerminalCapability[];
  clientProtocolVersion?: string;
}

const DEFAULT_COMPATIBILITY: TerminalCompatibilityContract = {
  minimumProtocolVersion: '1.0.0',
  compatibleApiVersions: ['v1'],
  requiredCapabilities: ['command-execution', 'lifecycle-control'],
};

// Static terminal registry — these map to Medina.mo canisters and lib modules
const TERMINALS: SubsystemTerminal[] = [
  {
    terminalId: 'terminal-organism',
    name: 'Organism Core',
    subsystem: 'Organism.mo',
    status: 'STANDBY',
    description: 'Primary organism canister — neural core, kernel execution, heartbeat',
    endpoint: '/api/health',
    coherence: 1.0,
    lastHeartbeat: Date.now(),
    commands: ['status', 'heartbeat', 'phase', 'registers', 'frequency'],
    protocol: buildTerminalProtocolDescriptor('terminal-organism', [
      'command-execution',
      'command-routing',
      'health-check',
      'lifecycle-control',
      'session-management',
    ]),
    compatibility: DEFAULT_COMPATIBILITY,
  },
  {
    terminalId: 'terminal-memory',
    name: 'Memory Temple',
    subsystem: 'MemoryTempleStable.mo',
    status: 'STANDBY',
    description: 'Spatial and temporal memory — nodes, salience, lineage tracking',
    endpoint: '/api/health?action=full',
    coherence: 1 / PHI,
    lastHeartbeat: Date.now(),
    commands: ['list', 'store', 'retrieve', 'stats', 'pin', 'prune'],
    protocol: buildTerminalProtocolDescriptor('terminal-memory'),
    compatibility: DEFAULT_COMPATIBILITY,
  },
  {
    terminalId: 'terminal-governance',
    name: 'Governance Core',
    subsystem: 'Governance.mo',
    status: 'STANDBY',
    description: 'Proposal lifecycle, voting, gate enforcement, audit log',
    endpoint: '/api/govern',
    coherence: 1 / PHI,
    lastHeartbeat: Date.now(),
    commands: ['list-proposals', 'create', 'vote', 'gates', 'audit', 'stats'],
    protocol: buildTerminalProtocolDescriptor('terminal-governance', [
      'command-execution',
      'command-routing',
      'health-check',
      'lifecycle-control',
      'session-management',
      'governance-audit',
    ]),
    compatibility: DEFAULT_COMPATIBILITY,
  },
  {
    terminalId: 'terminal-models',
    name: 'Model Router',
    subsystem: 'ModelRouter.mo',
    status: 'STANDBY',
    description: 'Model routing, invocation tracking, latency monitoring',
    endpoint: '/api/health?action=full',
    coherence: 0.854,
    lastHeartbeat: Date.now(),
    commands: ['list', 'invoke', 'stats', 'latency', 'route'],
    protocol: buildTerminalProtocolDescriptor('terminal-models'),
    compatibility: DEFAULT_COMPATIBILITY,
  },
  {
    terminalId: 'terminal-permissions',
    name: 'Permissions Gate',
    subsystem: 'QuantumResistantPrincipalLock.mo',
    status: 'STANDBY',
    description: 'Principal-based permission grants, revocations, and audit trail',
    endpoint: '/api/permissions',
    coherence: 1.0,
    lastHeartbeat: Date.now(),
    commands: ['list', 'grant', 'revoke', 'check', 'stats'],
    protocol: buildTerminalProtocolDescriptor('terminal-permissions'),
    compatibility: DEFAULT_COMPATIBILITY,
  },
  {
    terminalId: 'terminal-devices',
    name: 'Device Sovereignty',
    subsystem: 'deviceSovereignty.ts',
    status: 'STANDBY',
    description: 'Device fingerprinting, beat sync, resonance scoring',
    endpoint: '/api/devices',
    coherence: 0.618,
    lastHeartbeat: Date.now(),
    commands: ['state', 'register', 'sync', 'resonance', 'fingerprint'],
    protocol: buildTerminalProtocolDescriptor('terminal-devices'),
    compatibility: DEFAULT_COMPATIBILITY,
  },
  {
    terminalId: 'terminal-messages',
    name: 'Message Engine',
    subsystem: 'messageEngine.ts',
    status: 'STANDBY',
    description: 'Sovereign message drafting, threading, and delivery',
    endpoint: '/api/message',
    coherence: 1 / PHI,
    lastHeartbeat: Date.now(),
    commands: ['list', 'send', 'draft', 'stats', 'thread'],
    protocol: buildTerminalProtocolDescriptor('terminal-messages'),
    compatibility: DEFAULT_COMPATIBILITY,
  },
  {
    terminalId: 'terminal-campaigns',
    name: 'Campaign Engine',
    subsystem: 'campaignEngine.ts',
    status: 'STANDBY',
    description: 'Campaign lifecycle, reach tracking, performance analytics',
    endpoint: '/api/campaign',
    coherence: 0.618,
    lastHeartbeat: Date.now(),
    commands: ['list', 'create', 'activate', 'stats', 'reach'],
    protocol: buildTerminalProtocolDescriptor('terminal-campaigns'),
    compatibility: DEFAULT_COMPATIBILITY,
  },
  {
    terminalId: 'terminal-design-os',
    name: 'Sovereign Design OS',
    subsystem: 'SovereignDesignOS.mo',
    status: 'STANDBY',
    description: '10 MACHINA design models — GPU, 3D, PHOTO, INTERFAX, MOTUS, PROCEDIT, REALIS, MATERIA, COMPOSIT, INTERAC',
    endpoint: '/api/design-os',
    coherence: PHI - 1,
    lastHeartbeat: Date.now(),
    commands: ['models', 'model', 'status', 'invoke', 'phi-compute'],
    protocol: buildTerminalProtocolDescriptor('terminal-design-os'),
    compatibility: DEFAULT_COMPATIBILITY,
  },
  {
    terminalId: 'terminal-intelligence-wire',
    name: 'Intelligence Wire',
    subsystem: 'intelligenceWire.ts',
    status: 'STANDBY',
    description: 'FrontendBackendSync — routes all 20 components to endpoints, φ-latency audit',
    endpoint: '/api/intelligence-wire',
    coherence: 1.0,
    lastHeartbeat: Date.now(),
    commands: ['stats', 'audit', 'routes', 'phi-coherence', 'ping'],
    protocol: buildTerminalProtocolDescriptor('terminal-intelligence-wire', [
      'command-execution',
      'command-routing',
      'health-check',
      'lifecycle-control',
      'session-management',
      'streaming-output',
    ]),
    compatibility: DEFAULT_COMPATIBILITY,
  },
  {
    terminalId: 'terminal-nova-encryption',
    name: 'Nova Sovereign Encryption',
    subsystem: 'NovaSovereignEncryption.mo',
    status: 'STANDBY',
    description: 'φ-Beatty key generation, E8/Leech lattice rotation, organism-as-key',
    coherence: 1.0,
    lastHeartbeat: Date.now(),
    commands: ['status', 'key-tier', 'coherence-score', 'beat-interval'],
    protocol: buildTerminalProtocolDescriptor('terminal-nova-encryption'),
    compatibility: DEFAULT_COMPATIBILITY,
  },
  {
    terminalId: 'terminal-replay',
    name: 'Replay Engine',
    subsystem: 'replayEngine.ts',
    status: 'STANDBY',
    description: 'Session capture, event ledger, deterministic replay, time travel',
    endpoint: '/api/health?action=full',
    coherence: 0.618,
    lastHeartbeat: Date.now(),
    commands: ['sessions', 'start', 'stop', 'replay', 'stats'],
    protocol: buildTerminalProtocolDescriptor('terminal-replay'),
    compatibility: DEFAULT_COMPATIBILITY,
  },
];

const runtimeState: Map<string, TerminalRuntimeState> = new Map(
  TERMINALS.map((terminal) => [
    terminal.terminalId,
    {
      lifecycleState: 'registered',
      status: 'STANDBY',
      lastHeartbeat: terminal.lastHeartbeat,
      commandCount: 0,
    },
  ]),
);

const terminalSessions: Map<string, SubTerminalSession> = new Map();

function getTerminal(terminalId: string): SubsystemTerminal {
  const terminal = TERMINALS.find((t) => t.terminalId === terminalId);
  if (!terminal) throw new Error(`Terminal ${terminalId} not found`);
  return terminal;
}

function getRuntime(terminalId: string): TerminalRuntimeState {
  const state = runtimeState.get(terminalId);
  if (!state) throw new Error(`Runtime state missing for terminal ${terminalId}`);
  return state;
}

function generateSessionId(terminalId: string): string {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `${terminalId}-session-${suffix}`;
}

function executeCommand(terminalId: string, command: string, args?: Record<string, unknown>): unknown {
  const terminal = getTerminal(terminalId);
  const runtime = getRuntime(terminalId);
  if (runtime.lifecycleState !== 'active') {
    throw new Error(`Terminal ${terminalId} is not active. Current lifecycle: ${runtime.lifecycleState}`);
  }

  switch (command) {
    case 'status':
      return {
        terminalId,
        status: runtime.status,
        coherence: terminal.coherence,
        name: terminal.name,
        lifecycleState: runtime.lifecycleState,
      };
    case 'ping':
      return { pong: true, terminalId, latencyMs: Math.round(PHI * 10), timestamp: Date.now() };
    case 'phi-coherence':
      return { coherence: terminal.coherence, phiBeat: Math.round(1000 / PHI), ratio: terminal.coherence / PHI };
    default:
      if (terminal.commands.includes(command)) {
        return {
          executed: command,
          terminalId,
          args: args ?? {},
          routedEndpoint: terminal.endpoint ?? null,
          timestamp: Date.now(),
          sovereign: true,
        };
      }
      throw new Error(
        `Command '${command}' not available on terminal ${terminalId}. Available: ${terminal.commands.join(', ')}`,
      );
  }
}

function hydrateTerminal(terminal: SubsystemTerminal) {
  const runtime = getRuntime(terminal.terminalId);
  const session = runtime.sessionId ? terminalSessions.get(runtime.sessionId) : undefined;
  const health = determineTerminalHealth(runtime.lastHeartbeat);
  return {
    ...terminal,
    status: runtime.status === 'STANDBY' ? runtime.status : health,
    lifecycleState: runtime.lifecycleState,
    protocolVersion: terminal.protocol.protocolVersion,
    apiVersion: terminal.protocol.apiVersion,
    session,
  };
}

function ensureSession(terminalId: string): SubTerminalSession {
  const runtime = getRuntime(terminalId);
  if (runtime.sessionId) {
    const existing = terminalSessions.get(runtime.sessionId);
    if (existing) return existing;
  }

  const sessionId = generateSessionId(terminalId);
  const created: SubTerminalSession = {
    sessionId,
    terminalId,
    createdAt: new Date().toISOString(),
    state: 'created',
    commandCount: 0,
    enabledCapabilities: [],
  };
  terminalSessions.set(sessionId, created);
  runtimeState.set(terminalId, {
    ...runtime,
    sessionId,
    lifecycleState: 'created',
    status: 'STANDBY',
  });
  return created;
}

function setRuntime(terminalId: string, updates: Partial<TerminalRuntimeState>) {
  const runtime = getRuntime(terminalId);
  runtimeState.set(terminalId, { ...runtime, ...updates });
}

function json<T>(data: T, status = 200) { return NextResponse.json(data, { status }); }
function now() { return new Date().toISOString(); }

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'list';
  const terminalId = searchParams.get('terminalId');

  try {
    switch (action) {
      case 'list':
        return json({
          success: true,
          data: TERMINALS.map(hydrateTerminal),
          count: TERMINALS.length,
          active: Array.from(runtimeState.values()).filter((r) => r.lifecycleState === 'active').length,
          timestamp: now(),
        });

      case 'get': {
        if (!terminalId) return json({ success: false, error: 'terminalId required', timestamp: now() }, 400);
        return json({ success: true, data: hydrateTerminal(getTerminal(terminalId)), timestamp: now() });
      }

      case 'status': {
        if (!terminalId) return json({ success: false, error: 'terminalId required', timestamp: now() }, 400);
        const terminal = getTerminal(terminalId);
        const runtime = getRuntime(terminalId);
        const session = runtime.sessionId ? terminalSessions.get(runtime.sessionId) : undefined;
        return json({
          success: true,
          data: {
            terminalId,
            lifecycleState: runtime.lifecycleState,
            status: runtime.status === 'STANDBY' ? 'STANDBY' : determineTerminalHealth(runtime.lastHeartbeat),
            commandCount: runtime.commandCount,
            endpoint: terminal.endpoint ?? null,
            session,
          },
          timestamp: now(),
        });
      }

      case 'sessions':
        return json({
          success: true,
          data: Array.from(terminalSessions.values()),
          count: terminalSessions.size,
          timestamp: now(),
        });

      case 'health': {
        const healthByTerminal = TERMINALS.map((terminal) => ({
          terminalId: terminal.terminalId,
          health: determineTerminalHealth(getRuntime(terminal.terminalId).lastHeartbeat),
        }));
        const summary = {
          total: TERMINALS.length,
          online: healthByTerminal.filter((terminal) => terminal.health === 'ONLINE').length,
          degraded: healthByTerminal.filter((terminal) => terminal.health === 'DEGRADED').length,
          offline: healthByTerminal.filter((terminal) => terminal.health === 'OFFLINE').length,
          active: Array.from(runtimeState.values()).filter((runtime) => runtime.lifecycleState === 'active').length,
          avgCoherence: TERMINALS.reduce((s, t) => s + t.coherence, 0) / TERMINALS.length,
          terminals: TERMINALS.map((terminal) => hydrateTerminal(terminal)),
        };
        return json({ success: true, data: summary, timestamp: now() });
      }

      default:
        return json({ success: false, error: `Unknown action: ${action}`, timestamp: now() }, 400);
    }
  } catch (error) {
    return json({ success: false, error: String(error), timestamp: now() }, 500);
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as TerminalCommandRequest;

    switch (body.action) {
      case 'create': {
        if (!body.terminalId) return json({ success: false, error: 'terminalId required', timestamp: now() }, 400);
        getTerminal(body.terminalId);
        const session = ensureSession(body.terminalId);
        return json({ success: true, data: session, timestamp: now() }, 201);
      }

      case 'activate': {
        if (!body.terminalId) return json({ success: false, error: 'terminalId required', timestamp: now() }, 400);
        const terminal = getTerminal(body.terminalId);
        const session = ensureSession(body.terminalId);
        setRuntime(body.terminalId, { lifecycleState: 'activating', status: 'ACTIVATING' });

        const negotiationRequest: TerminalNegotiationRequest = {
          terminalId: body.terminalId,
          requestedApiVersion: body.requestedApiVersion ?? TERMINAL_API_VERSION,
          requestedCapabilities: body.requestedCapabilities ?? terminal.protocol.capabilities,
          clientProtocolVersion: (body.clientProtocolVersion ?? TERMINAL_PROTOCOL_VERSION) as `${number}.${number}.${number}`,
        };

        const negotiation = negotiateTerminalProtocol(
          terminal.protocol,
          terminal.compatibility,
          negotiationRequest,
        );

        if (!negotiation.compatible) {
          setRuntime(body.terminalId, { lifecycleState: 'error', status: 'DEGRADED' });
          return json({ success: false, error: 'Protocol negotiation failed', data: negotiation, timestamp: now() }, 409);
        }

        const activatedAt = new Date().toISOString();
        terminalSessions.set(session.sessionId, {
          ...session,
          state: 'active',
          activatedAt,
          negotiatedApiVersion: negotiation.agreedApiVersion,
          enabledCapabilities: negotiation.enabledCapabilities,
        });

        setRuntime(body.terminalId, {
          lifecycleState: 'active',
          status: 'ONLINE',
          lastHeartbeat: Date.now(),
          sessionId: session.sessionId,
        });

        return json({
          success: true,
          data: {
            terminalId: body.terminalId,
            lifecycleState: 'active',
            status: 'ONLINE',
            negotiation,
            session: terminalSessions.get(session.sessionId),
          },
          timestamp: now(),
        });
      }

      case 'deactivate': {
        if (!body.terminalId) return json({ success: false, error: 'terminalId required', timestamp: now() }, 400);
        getTerminal(body.terminalId);
        const runtime = getRuntime(body.terminalId);
        if (runtime.sessionId) {
          const session = terminalSessions.get(runtime.sessionId);
          if (session) {
            terminalSessions.set(runtime.sessionId, {
              ...session,
              state: 'deactivated',
              deactivatedAt: new Date().toISOString(),
            });
          }
        }
        setRuntime(body.terminalId, {
          lifecycleState: 'deactivated',
          status: 'STANDBY',
        });
        return json({ success: true, data: { terminalId: body.terminalId, state: 'deactivated' }, timestamp: now() });
      }

      case 'compatibility-check': {
        if (!body.terminalId) return json({ success: false, error: 'terminalId required', timestamp: now() }, 400);
        const terminal = getTerminal(body.terminalId);
        const negotiation = negotiateTerminalProtocol(
          terminal.protocol,
          terminal.compatibility,
          {
            terminalId: body.terminalId,
            requestedApiVersion: body.requestedApiVersion ?? TERMINAL_API_VERSION,
            requestedCapabilities: body.requestedCapabilities ?? terminal.protocol.capabilities,
            clientProtocolVersion: (body.clientProtocolVersion ?? TERMINAL_PROTOCOL_VERSION) as `${number}.${number}.${number}`,
          },
        );
        return json({ success: negotiation.compatible, data: negotiation, timestamp: now() }, negotiation.compatible ? 200 : 409);
      }

      case 'status': {
        if (!body.terminalId) return json({ success: false, error: 'terminalId required', timestamp: now() }, 400);
        const terminal = getTerminal(body.terminalId);
        const runtime = getRuntime(body.terminalId);
        const session = runtime.sessionId ? terminalSessions.get(runtime.sessionId) : undefined;
        return json({
          success: true,
          data: {
            terminalId: body.terminalId,
            subsystem: terminal.subsystem,
            lifecycleState: runtime.lifecycleState,
            status: runtime.status === 'STANDBY' ? 'STANDBY' : determineTerminalHealth(runtime.lastHeartbeat),
            commandCount: runtime.commandCount,
            session,
          },
          timestamp: now(),
        });
      }

      case 'exec':
      case 'execute': {
        const { terminalId, command, args } = body;
        if (!terminalId || !command) {
          return json({ success: false, error: 'terminalId and command required', timestamp: now() }, 400);
        }

        const runtime = getRuntime(terminalId);
        if (runtime.lifecycleState !== 'active') {
          return json({ success: false, error: `Terminal ${terminalId} not active`, timestamp: now() }, 409);
        }

        const start = Date.now();
        const output = executeCommand(terminalId, command, args);
        const nowIso = new Date().toISOString();

        setRuntime(terminalId, {
          commandCount: runtime.commandCount + 1,
          lastHeartbeat: Date.now(),
        });

        if (runtime.sessionId) {
          const session = terminalSessions.get(runtime.sessionId);
          if (session) {
            terminalSessions.set(runtime.sessionId, {
              ...session,
              commandCount: session.commandCount + 1,
              lastCommandAt: nowIso,
            });
          }
        }

        return json({
          success: true,
          data: { output, latencyMs: Date.now() - start },
          timestamp: now(),
        });
      }

      default:
        return json({ success: false, error: `Unknown action: ${body.action}`, timestamp: now() }, 400);
    }
  } catch (error) {
    return json({ success: false, error: String(error), timestamp: now() }, 500);
  }
}
