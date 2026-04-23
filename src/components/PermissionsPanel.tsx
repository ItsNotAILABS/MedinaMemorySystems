'use client';

import { useState, useEffect, useCallback } from 'react';
import { cls } from '@/lib/sovereign-cls';
import type { Permission, PermissionScope } from '@/types';

const SCOPE_GROUPS: Record<string, PermissionScope[]> = {
  Memory: ['memory:read', 'memory:write', 'memory:delete'],
  Governance: ['governance:read', 'governance:propose', 'governance:vote', 'governance:enact'],
  Model: ['model:invoke', 'model:configure'],
  Company: ['company:read', 'company:write'],
  System: ['replay:read', 'permissions:manage', 'organism:read', 'organism:write'],
};

const ALL_SCOPES: PermissionScope[] = ([] as PermissionScope[]).concat(
  ...Object.values(SCOPE_GROUPS),
);

export default function PermissionsPanel() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGrant, setShowGrant] = useState(false);
  const [newScope, setNewScope] = useState<PermissionScope>('memory:read');
  const [newPrincipal, setNewPrincipal] = useState('');
  const [granting, setGranting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/permissions?action=list');
      const data = await res.json() as { data: Permission[] };
      setPermissions(data.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const handleGrant = async () => {
    if (!newPrincipal.trim()) return;
    setGranting(true);
    try {
      await fetch('/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'grant', scope: newScope, grantedTo: newPrincipal, grantedBy: 'Sovereign' }),
      });
      setNewPrincipal('');
      setShowGrant(false);
      void fetchData();
    } finally {
      setGranting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    await fetch('/api/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'revoke', id }),
    });
    void fetchData();
  };

  // Group permissions by scope group
  const activePerms = permissions.filter((p) => p.active);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d15] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-lg">🔐</span>
          <h2 className="text-sm font-semibold text-slate-200">Permissions</h2>
          <span className="text-xs text-slate-500">{activePerms.length} active grants</span>
        </div>
        <button
          onClick={() => setShowGrant(!showGrant)}
          className="text-xs px-3 py-1.5 rounded bg-yellow-700 hover:bg-yellow-600 text-white transition-colors"
        >
          + Grant
        </button>
      </div>

      {/* Grant form */}
      {showGrant && (
        <div className="px-4 py-3 border-b border-[#1e1e2e] bg-[#0f0f1a] shrink-0 space-y-2">
          <div className="flex gap-2">
            <select
              value={newScope}
              onChange={(e) => setNewScope(e.target.value as PermissionScope)}
              className="flex-1 cmd-input px-3 py-2 rounded text-sm bg-[#12121a] border border-[#1e1e2e] text-slate-200 outline-none focus:border-yellow-500"
            >
              {ALL_SCOPES.map((scope) => (
                <option key={scope} value={scope}>{scope}</option>
              ))}
            </select>
            <input
              value={newPrincipal}
              onChange={(e) => setNewPrincipal(e.target.value)}
              placeholder="Principal (e.g. User, Operator)"
              className="flex-1 cmd-input px-3 py-2 rounded text-sm bg-[#12121a] border border-[#1e1e2e] text-slate-200 placeholder-slate-600 outline-none focus:border-yellow-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => void handleGrant()}
              disabled={!newPrincipal.trim() || granting}
              className="px-3 py-1.5 rounded text-xs bg-yellow-700 hover:bg-yellow-600 disabled:opacity-40 text-white transition-colors"
            >
              Grant
            </button>
            <button
              onClick={() => setShowGrant(false)}
              className="px-3 py-1.5 rounded text-xs bg-[#1e1e2e] text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {loading ? (
          <div className="text-slate-500 text-sm text-center py-8 font-mono">Loading permissions…</div>
        ) : (
          Object.entries(SCOPE_GROUPS).map(([group, scopes]) => {
            const groupPerms = activePerms.filter((p) => scopes.includes(p.scope));
            return (
              <div key={group}>
                <h3 className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2">
                  {group}
                  <span className="text-[10px] text-slate-600">({groupPerms.length})</span>
                </h3>
                <div className="space-y-1.5">
                  {scopes.map((scope) => {
                    const scopePerms = groupPerms.filter((p) => p.scope === scope);
                    return (
                      <ScopeRow
                        key={scope}
                        scope={scope}
                        permissions={scopePerms}
                        onRevoke={handleRevoke}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ScopeRow({
  scope,
  permissions,
  onRevoke,
}: {
  scope: PermissionScope;
  permissions: Permission[];
  onRevoke: (id: string) => void;
}) {
  const [scope1, scope2] = scope.split(':');

  return (
    <div className="rounded-lg border border-[#1e1e2e] bg-[#12121a] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-[#0f0f1a]">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">{scope1}:</span>
          <span className="text-yellow-400">{scope2}</span>
        </div>
        <span
          className={cls(
            'text-[10px] px-1.5 py-0.5 rounded font-mono',
            permissions.length > 0
              ? 'text-green-400 bg-green-400/10 border border-green-400/30'
              : 'text-slate-600 bg-slate-600/10 border border-slate-600/30',
          )}
        >
          {permissions.length} grant{permissions.length !== 1 ? 's' : ''}
        </span>
      </div>
      {permissions.length > 0 && (
        <div className="divide-y divide-[#1e1e2e]">
          {permissions.map((perm) => (
            <div key={perm.id} className="flex items-center justify-between px-3 py-1.5 text-[10px]">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-mono">{perm.grantedTo}</span>
                <span className="text-slate-600">by {perm.grantedBy}</span>
              </div>
              <div className="flex items-center gap-2">
                {perm.expiresAt && (
                  <span className="text-slate-600">exp {new Date(perm.expiresAt).toLocaleDateString()}</span>
                )}
                <button
                  onClick={() => onRevoke(perm.id)}
                  className="text-red-500 hover:text-red-400 transition-colors px-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
