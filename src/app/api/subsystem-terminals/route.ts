// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE.
import { NextRequest, NextResponse } from 'next/server';

// ─── Subsystem Terminal Registry ──────────────────────────────────────────────

const PHI = 1.6180339887498948482;

export type TerminalStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'STANDBY';

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
}

// Static terminal registry — these map to Medina.mo canisters and lib modules
const TERMINALS: SubsystemTerminal[] = [
  {
    terminalId: 'terminal-organism',
    name: 'Organism Core',
    subsystem: 'Organism.mo',
    status: 'ONLINE',
    description: 'Primary organism canister — neural core, kernel execution, heartbeat',
    endpoint: '/api/health',
    coherence: 1.0,
    lastHeartbeat: Date.now(),
    commands: ['status', 'heartbeat', 'phase', 'registers', 'frequency'],
  },
  {
    terminalId: 'terminal-memory',
    name: 'Memory Temple',
    subsystem: 'MemoryTempleStable.mo',
    status: 'ONLINE',
    description: 'Spatial and temporal memory — nodes, salience, lineage tracking',
    endpoint: '/api/health?action=full',
    coherence: 1 / PHI,
    lastHeartbeat: Date.now(),
    commands: ['list', 'store', 'retrieve', 'stats', 'pin', 'prune'],
  },
  {
    terminalId: 'terminal-governance',
    name: 'Governance Core',
    subsystem: 'Governance.mo',
    status: 'ONLINE',
    description: 'Proposal lifecycle, voting, gate enforcement, audit log',
    endpoint: '/api/govern',
    coherence: 1 / PHI,
    lastHeartbeat: Date.now(),
    commands: ['list-proposals', 'create', 'vote', 'gates', 'audit', 'stats'],
  },
  {
    terminalId: 'terminal-models',
    name: 'Model Router',
    subsystem: 'ModelRouter.mo',
    status: 'ONLINE',
    description: 'Model routing, invocation tracking, latency monitoring',
    endpoint: '/api/health?action=full',
    coherence: 0.854,
    lastHeartbeat: Date.now(),
    commands: ['list', 'invoke', 'stats', 'latency', 'route'],
  },
  {
    terminalId: 'terminal-permissions',
    name: 'Permissions Gate',
    subsystem: 'QuantumResistantPrincipalLock.mo',
    status: 'ONLINE',
    description: 'Principal-based permission grants, revocations, and audit trail',
    endpoint: '/api/permissions',
    coherence: 1.0,
    lastHeartbeat: Date.now(),
    commands: ['list', 'grant', 'revoke', 'check', 'stats'],
  },
  {
    terminalId: 'terminal-devices',
    name: 'Device Sovereignty',
    subsystem: 'deviceSovereignty.ts',
    status: 'ONLINE',
    description: 'Device fingerprinting, beat sync, resonance scoring',
    endpoint: '/api/devices',
    coherence: 0.618,
    lastHeartbeat: Date.now(),
    commands: ['state', 'register', 'sync', 'resonance', 'fingerprint'],
  },
  {
    terminalId: 'terminal-messages',
    name: 'Message Engine',
    subsystem: 'messageEngine.ts',
    status: 'ONLINE',
    description: 'Sovereign message drafting, threading, and delivery',
    endpoint: '/api/message',
    coherence: 1 / PHI,
    lastHeartbeat: Date.now(),
    commands: ['list', 'send', 'draft', 'stats', 'thread'],
  },
  {
    terminalId: 'terminal-campaigns',
    name: 'Campaign Engine',
    subsystem: 'campaignEngine.ts',
    status: 'ONLINE',
    description: 'Campaign lifecycle, reach tracking, performance analytics',
    endpoint: '/api/campaign',
    coherence: 0.618,
    lastHeartbeat: Date.now(),
    commands: ['list', 'create', 'activate', 'stats', 'reach'],
  },
  {
    terminalId: 'terminal-design-os',
    name: 'Sovereign Design OS',
    subsystem: 'SovereignDesignOS.mo',
    status: 'ONLINE',
    description: '10 MACHINA design models — GPU, 3D, PHOTO, INTERFAX, MOTUS, PROCEDIT, REALIS, MATERIA, COMPOSIT, INTERAC',
    endpoint: '/api/design-os',
    coherence: PHI - 1,  // = 1/φ = 0.618
    lastHeartbeat: Date.now(),
    commands: ['models', 'model', 'status', 'invoke', 'phi-compute'],
  },
  {
    terminalId: 'terminal-intelligence-wire',
    name: 'Intelligence Wire',
    subsystem: 'intelligenceWire.ts',
    status: 'ONLINE',
    description: 'FrontendBackendSync — routes all 20 components to endpoints, φ-latency audit',
    endpoint: '/api/intelligence-wire',
    coherence: 1.0,
    lastHeartbeat: Date.now(),
    commands: ['stats', 'audit', 'routes', 'phi-coherence', 'ping'],
  },
  {
    terminalId: 'terminal-nova-encryption',
    name: 'Nova Sovereign Encryption',
    subsystem: 'NovaSovereignEncryption.mo',
    status: 'ONLINE',
    description: 'φ-Beatty key generation, E8/Leech lattice rotation, organism-as-key',
    endpoint: null as unknown as string,
    coherence: 1.0,
    lastHeartbeat: Date.now(),
    commands: ['status', 'key-tier', 'coherence-score', 'beat-interval'],
  },
  {
    terminalId: 'terminal-replay',
    name: 'Replay Engine',
    subsystem: 'replayEngine.ts',
    status: 'ONLINE',
    description: 'Session capture, event ledger, deterministic replay, time travel',
    endpoint: '/api/health?action=full',
    coherence: 0.618,
    lastHeartbeat: Date.now(),
    commands: ['sessions', 'start', 'stop', 'replay', 'stats'],
  },
];

// ─── Command Execution ────────────────────────────────────────────────────────

function executeCommand(terminalId: string, command: string, args?: Record<string, unknown>): unknown {
  const terminal = TERMINALS.find(t => t.terminalId === terminalId);
  if (!terminal) throw new Error(`Terminal ${terminalId} not found`);

  switch (command) {
    case 'status':
      return { terminalId, status: terminal.status, coherence: terminal.coherence, name: terminal.name };
    case 'ping':
      return { pong: true, terminalId, latencyMs: Math.round(PHI * 10), timestamp: Date.now() };
    case 'phi-coherence':
      return { coherence: terminal.coherence, phiBeat: Math.round(1000 / PHI), ratio: terminal.coherence / PHI };
    default:
      // Return a mock success for any registered command
      if (terminal.commands.includes(command)) {
        return { executed: command, terminalId, args: args ?? {}, timestamp: Date.now(), sovereign: true };
      }
      throw new Error(`Command '${command}' not available on terminal ${terminalId}. Available: ${terminal.commands.join(', ')}`);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
          data: TERMINALS,
          count: TERMINALS.length,
          online: TERMINALS.filter(t => t.status === 'ONLINE').length,
          timestamp: now(),
        });

      case 'get': {
        if (!terminalId) return json({ success: false, error: 'terminalId required', timestamp: now() }, 400);
        const terminal = TERMINALS.find(t => t.terminalId === terminalId);
        if (!terminal) return json({ success: false, error: `Terminal ${terminalId} not found`, timestamp: now() }, 404);
        return json({ success: true, data: terminal, timestamp: now() });
      }

      case 'health': {
        const summary = {
          total: TERMINALS.length,
          online: TERMINALS.filter(t => t.status === 'ONLINE').length,
          degraded: TERMINALS.filter(t => t.status === 'DEGRADED').length,
          offline: TERMINALS.filter(t => t.status === 'OFFLINE').length,
          avgCoherence: TERMINALS.reduce((s, t) => s + t.coherence, 0) / TERMINALS.length,
          phiCoherence: TERMINALS.every(t => t.status === 'ONLINE') ? 1.0 : 0.618,
          terminals: TERMINALS.map(t => ({
            terminalId: t.terminalId, name: t.name, status: t.status, coherence: t.coherence,
          })),
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
    const body = await req.json() as { action: string; terminalId?: string; command?: string; args?: Record<string, unknown> };

    switch (body.action) {
      case 'exec': {
        const { terminalId, command, args } = body;
        if (!terminalId || !command) {
          return json({ success: false, error: 'terminalId and command required', timestamp: now() }, 400);
        }
        const start = Date.now();
        const output = executeCommand(terminalId, command, args);
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
