import { NextRequest, NextResponse } from 'next/server';
import {
  listProposals,
  getProposal,
  createProposal,
  voteOnProposal,
  openProposal,
  enactProposal,
  getGates,
  getAuditLog,
  getGovernanceStats,
  setGateStatus,
} from '@/lib/governanceEngine';
import type { ApiResponse, GateId, GateStatus } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'list';
  const id = searchParams.get('id');

  try {
    switch (action) {
      case 'list': {
        const status = searchParams.get('status') as any;
        return json({ success: true, data: listProposals(status), timestamp: now() });
      }
      case 'get': {
        if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        const p = getProposal(id);
        if (!p) return json({ success: false, error: 'Not found', timestamp: now() }, 404);
        return json({ success: true, data: p, timestamp: now() });
      }
      case 'gates': {
        return json({ success: true, data: getGates(), timestamp: now() });
      }
      case 'audit': {
        const limit = parseInt(searchParams.get('limit') ?? '50', 10);
        return json({ success: true, data: getAuditLog(limit), timestamp: now() });
      }
      case 'stats': {
        return json({ success: true, data: getGovernanceStats(), timestamp: now() });
      }
      default:
        return json({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      action: string;
      id?: string;
      title?: string;
      description?: string;
      author?: string;
      vote?: 'for' | 'against' | 'abstain';
      voter?: string;
      affectedGates?: GateId[];
      doctrineRef?: string;
      gateId?: GateId;
      status?: GateStatus;
    };

    switch (body.action) {
      case 'create': {
        if (!body.title) return json({ success: false, error: 'Title required', timestamp: now() }, 400);
        const p = createProposal(body.title, body.description ?? '', body.author ?? 'User', body.affectedGates, body.doctrineRef);
        return json({ success: true, data: p, timestamp: now() }, 201);
      }
      case 'open': {
        if (!body.id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        const p = openProposal(body.id);
        return json({ success: !!p, data: p ?? undefined, timestamp: now() });
      }
      case 'vote': {
        if (!body.id || !body.vote) return json({ success: false, error: 'ID and vote required', timestamp: now() }, 400);
        const p = voteOnProposal(body.id, body.vote, body.voter ?? 'User');
        return json({ success: !!p, data: p ?? undefined, timestamp: now() });
      }
      case 'enact': {
        if (!body.id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        const p = enactProposal(body.id);
        return json({ success: !!p, data: p ?? undefined, timestamp: now() });
      }
      case 'gate': {
        if (!body.gateId || !body.status) return json({ success: false, error: 'Gate ID and status required', timestamp: now() }, 400);
        const g = setGateStatus(body.gateId, body.status);
        return json({ success: !!g, data: g ?? undefined, timestamp: now() });
      }
      default:
        return json({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

function json<T>(data: ApiResponse<T>, status = 200) {
  return NextResponse.json(data, { status });
}
function now() { return new Date().toISOString(); }
