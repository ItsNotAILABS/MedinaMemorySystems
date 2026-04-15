import { v4 as uuidv4 } from 'uuid';
import type { Permission, PermissionGrant, PermissionScope } from '@/types';

// ─── Store ────────────────────────────────────────────────────────────────────

const permissions: Map<string, Permission> = new Map();

// Seed default permissions
(function seed() {
  const now = new Date().toISOString();
  const defaultGrants: PermissionGrant[] = [
    { scope: 'memory:read', grantedTo: 'Public' },
    { scope: 'memory:write', grantedTo: 'Sovereign' },
    { scope: 'memory:delete', grantedTo: 'Sovereign' },
    { scope: 'governance:read', grantedTo: 'Public' },
    { scope: 'governance:propose', grantedTo: 'Operator' },
    { scope: 'governance:vote', grantedTo: 'Operator' },
    { scope: 'governance:enact', grantedTo: 'Sovereign' },
    { scope: 'model:invoke', grantedTo: 'Public' },
    { scope: 'model:configure', grantedTo: 'Sovereign' },
    { scope: 'company:read', grantedTo: 'Operator' },
    { scope: 'company:write', grantedTo: 'Sovereign' },
    { scope: 'replay:read', grantedTo: 'Operator' },
    { scope: 'permissions:manage', grantedTo: 'Sovereign' },
    { scope: 'organism:read', grantedTo: 'Operator' },
    { scope: 'organism:write', grantedTo: 'Sovereign' },
  ];

  for (const grant of defaultGrants) {
    const id = uuidv4();
    permissions.set(id, {
      id,
      scope: grant.scope,
      grantedTo: grant.grantedTo,
      grantedBy: 'System',
      grantedAt: now,
      expiresAt: grant.expiresAt,
      active: true,
    });
  }
})();

// ─── Operations ───────────────────────────────────────────────────────────────

export function listPermissions(): Permission[] {
  return Array.from(permissions.values()).sort((a, b) => a.scope.localeCompare(b.scope));
}

export function grantPermission(grant: PermissionGrant, grantedBy: string): Permission {
  // Check for existing active permission
  const existing = Array.from(permissions.values()).find(
    (p) => p.scope === grant.scope && p.grantedTo === grant.grantedTo && p.active,
  );
  if (existing) return existing;

  const id = uuidv4();
  const perm: Permission = {
    id,
    scope: grant.scope,
    grantedTo: grant.grantedTo,
    grantedBy,
    grantedAt: new Date().toISOString(),
    expiresAt: grant.expiresAt,
    active: true,
  };
  permissions.set(id, perm);
  return perm;
}

export function revokePermission(id: string): Permission | null {
  const perm = permissions.get(id);
  if (!perm || !perm.active) return null;
  const updated = { ...perm, active: false };
  permissions.set(id, updated);
  return updated;
}

export function checkPermission(scope: PermissionScope, principal: string): boolean {
  return Array.from(permissions.values()).some(
    (p) =>
      p.scope === scope &&
      p.active &&
      (p.grantedTo === principal || p.grantedTo === 'Public') &&
      (!p.expiresAt || new Date(p.expiresAt) > new Date()),
  );
}

export function getPermissionsForPrincipal(principal: string): Permission[] {
  return Array.from(permissions.values()).filter(
    (p) =>
      p.active &&
      (p.grantedTo === principal || p.grantedTo === 'Public') &&
      (!p.expiresAt || new Date(p.expiresAt) > new Date()),
  );
}

export function getPermissionStats(): {
  total: number;
  active: number;
  byScope: Record<string, number>;
} {
  const all = Array.from(permissions.values());
  const byScope: Record<string, number> = {};

  for (const p of all) {
    if (p.active) byScope[p.scope] = (byScope[p.scope] ?? 0) + 1;
  }

  return {
    total: all.length,
    active: all.filter((p) => p.active).length,
    byScope,
  };
}
