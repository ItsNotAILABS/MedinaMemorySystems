import { NextRequest, NextResponse } from 'next/server';
import {
  listCompanies,
  getCompany,
  createCompany,
  setCompanyMode,
  connectConnector,
  syncConnector,
  getOnboardingStats,
  getDefaultCompany,
} from '@/lib/companyOnboarding';
import type { ApiResponse, OnboardingMode } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'list';
  const id = searchParams.get('id');

  try {
    switch (action) {
      case 'list':
        return json({ success: true, data: listCompanies(), timestamp: now() });
      case 'get': {
        if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        const c = getCompany(id);
        if (!c) return json({ success: false, error: 'Not found', timestamp: now() }, 404);
        return json({ success: true, data: c, timestamp: now() });
      }
      case 'default': {
        const c = getDefaultCompany();
        return json({ success: !!c, data: c ?? undefined, timestamp: now() });
      }
      case 'stats': {
        const companyId = id ?? getDefaultCompany()?.id ?? '';
        const stats = getOnboardingStats(companyId);
        return json({ success: !!stats, data: stats ?? undefined, timestamp: now() });
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
      name?: string;
      mode?: OnboardingMode;
      companyId?: string;
      connectorId?: string;
    };

    const companyId = body.companyId ?? getDefaultCompany()?.id ?? '';

    switch (body.action) {
      case 'create': {
        if (!body.name) return json({ success: false, error: 'Name required', timestamp: now() }, 400);
        const c = createCompany(body.name, body.mode ?? 'connect');
        return json({ success: true, data: c, timestamp: now() }, 201);
      }
      case 'setMode': {
        if (!body.mode) return json({ success: false, error: 'Mode required', timestamp: now() }, 400);
        const c = setCompanyMode(companyId, body.mode);
        return json({ success: !!c, data: c ?? undefined, timestamp: now() });
      }
      case 'connect': {
        if (!body.connectorId) return json({ success: false, error: 'Connector ID required', timestamp: now() }, 400);
        const conn = connectConnector(companyId, body.connectorId);
        return json({ success: !!conn, data: conn ?? undefined, timestamp: now() });
      }
      case 'sync': {
        if (!body.connectorId) return json({ success: false, error: 'Connector ID required', timestamp: now() }, 400);
        const conn = syncConnector(companyId, body.connectorId);
        return json({ success: !!conn, data: conn ?? undefined, timestamp: now() });
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
