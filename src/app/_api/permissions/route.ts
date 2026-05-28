import { NextRequest, NextResponse } from 'next/server';
import {
  listPermissions,
  grantPermission,
  revokePermission,
  checkPermission,
  getPermissionsForPrincipal,
  getPermissionStats,
} from '@/lib/permissionsManager';
import type { ApiResponse, PermissionScope } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'list';
  const scope = searchParams.get('scope') as PermissionScope | null;
  const principal = searchParams.get('principal');

  try {
    switch (action) {
      case 'list':
        return json({ success: true, data: listPermissions(), timestamp: now() });
      case 'check': {
        if (!scope || !principal) return json({ success: false, error: 'scope and principal required', timestamp: now() }, 400);
        const ok = checkPermission(scope, principal);
        return json({ success: true, data: { allowed: ok }, timestamp: now() });
      }
      case 'forPrincipal': {
        if (!principal) return json({ success: false, error: 'principal required', timestamp: now() }, 400);
        const perms = getPermissionsForPrincipal(principal);
        return json({ success: true, data: perms, timestamp: now() });
      }
      case 'stats':
        return json({ success: true, data: getPermissionStats(), timestamp: now() });
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
      action: 'grant' | 'revoke';
      id?: string;
      scope?: PermissionScope;
      grantedTo?: string;
      grantedBy?: string;
      expiresAt?: string;
    };

    switch (body.action) {
      case 'grant': {
        if (!body.scope || !body.grantedTo) return json({ success: false, error: 'scope and grantedTo required', timestamp: now() }, 400);
        const perm = grantPermission({ scope: body.scope, grantedTo: body.grantedTo, expiresAt: body.expiresAt }, body.grantedBy ?? 'System');
        return json({ success: true, data: perm, timestamp: now() }, 201);
      }
      case 'revoke': {
        if (!body.id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        const perm = revokePermission(body.id);
        return json({ success: !!perm, data: perm ?? undefined, timestamp: now() });
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
