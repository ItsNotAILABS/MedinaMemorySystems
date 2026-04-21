'use client';

import { useState, useEffect, useCallback } from 'react';
import { cls } from '@/lib/sovereign-cls';
import type { Company, Connector, OnboardingMode } from '@/types';

const MODE_INFO: Record<OnboardingMode, { label: string; desc: string; color: string; icon: string }> = {
  connect: {
    label: 'CONNECT',
    desc: 'API bridge mode. Systems stay in place. NOVA reads and writes via connectors.',
    color: '#3b82f6',
    icon: '🔌',
  },
  internalize: {
    label: 'INTERNALIZE',
    desc: 'Full ingestion mode. Data is absorbed into NOVA memory for sovereign access.',
    color: '#8b5cf6',
    icon: '🧠',
  },
  hybrid: {
    label: 'HYBRID',
    desc: 'Selective mode. Choose per-system whether to connect, internalize, or ignore.',
    color: '#10b981',
    icon: '⚡',
  },
};

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  connected: { color: '#10b981', label: 'Connected' },
  pending: { color: '#f59e0b', label: 'Pending' },
  disconnected: { color: '#6b7280', label: 'Disconnected' },
  error: { color: '#ef4444', label: 'Error' },
};

export default function CompanyOnboarding() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/company?action=default');
      const data = await res.json() as { data: Company };
      setCompany(data.data ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const handleModeChange = async (mode: OnboardingMode) => {
    if (!company) return;
    const res = await fetch('/api/company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setMode', mode, companyId: company.id }),
    });
    const data = await res.json() as { data: Company };
    if (data.data) setCompany(data.data);
  };

  const handleConnect = async (connectorId: string) => {
    if (!company) return;
    setConnecting(connectorId);
    try {
      const res = await fetch('/api/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', companyId: company.id, connectorId }),
      });
      await res.json();
      void fetchData();
    } finally {
      setConnecting(null);
    }
  };

  const handleSync = async (connectorId: string) => {
    if (!company) return;
    setConnecting(connectorId);
    try {
      await fetch('/api/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', companyId: company.id, connectorId }),
      });
      void fetchData();
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d15] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-pink-400 text-lg">🏢</span>
          <h2 className="text-sm font-semibold text-slate-200">Company Onboarding</h2>
          {company && (
            <span className="text-xs text-slate-500">{company.name}</span>
          )}
        </div>
        {company && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 mr-1">Mode:</span>
            {(['connect', 'internalize', 'hybrid'] as OnboardingMode[]).map((mode) => {
              const info = MODE_INFO[mode];
              return (
                <button
                  key={mode}
                  onClick={() => void handleModeChange(mode)}
                  className={cls(
                    'text-[10px] font-mono px-2 py-1 rounded transition-all',
                    company.mode === mode
                      ? 'text-white'
                      : 'text-slate-500 bg-[#1e1e2e] hover:text-slate-300',
                  )}
                  style={company.mode === mode ? { background: info.color } : {}}
                >
                  {mode.toUpperCase()}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm text-center py-8 font-mono">Loading company data…</div>
      ) : !company ? (
        <div className="text-slate-600 text-sm text-center py-8">No company configured</div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Mode cards */}
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(MODE_INFO) as [OnboardingMode, typeof MODE_INFO.connect][]).map(([mode, info]) => (
              <button
                key={mode}
                onClick={() => void handleModeChange(mode)}
                className={cls(
                  'rounded-lg border p-4 text-left transition-all',
                  company.mode === mode
                    ? 'border-opacity-50 bg-[#12121e]'
                    : 'border-[#1e1e2e] bg-[#12121a] hover:border-[#2d2d42]',
                )}
                style={company.mode === mode ? { borderColor: `${info.color}60` } : {}}
              >
                <div className="text-2xl mb-2">{info.icon}</div>
                <div
                  className="text-sm font-bold mb-1"
                  style={{ color: company.mode === mode ? info.color : '#94a3b8' }}
                >
                  {info.label}
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed">{info.desc}</div>
                {company.mode === mode && (
                  <div
                    className="mt-2 text-[10px] font-mono px-1.5 py-0.5 rounded inline-block"
                    style={{ color: info.color, background: `${info.color}18`, border: `1px solid ${info.color}30` }}
                  >
                    ACTIVE
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <StatCard
              label="Connected"
              value={company.connectors.filter((c) => c.status === 'connected').length}
              color="#10b981"
            />
            <StatCard
              label="Pending"
              value={company.connectors.filter((c) => c.status === 'pending').length}
              color="#f59e0b"
            />
            <StatCard
              label="Memory Entries"
              value={company.memoryEntries}
              color="#8b5cf6"
            />
            <StatCard
              label="Data Points"
              value={company.connectors.reduce((sum, c) => sum + (c.dataPoints ?? 0), 0)}
              color="#3b82f6"
            />
          </div>

          {/* Connectors */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 mb-3">System Connectors</h3>
            <div className="grid grid-cols-2 gap-3">
              {company.connectors.map((connector) => (
                <ConnectorCard
                  key={connector.id}
                  connector={connector}
                  busy={connecting === connector.id}
                  onConnect={() => void handleConnect(connector.id)}
                  onSync={() => void handleSync(connector.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConnectorCard({
  connector,
  busy,
  onConnect,
  onSync,
}: {
  connector: Connector;
  busy: boolean;
  onConnect: () => void;
  onSync: () => void;
}) {
  const statusStyle = STATUS_STYLES[connector.status] ?? STATUS_STYLES.disconnected;

  return (
    <div className="rounded-lg border border-[#1e1e2e] bg-[#12121a] p-3 text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{connector.icon}</span>
          <div>
            <div className="text-slate-200 font-medium">{connector.name}</div>
            <div className="text-slate-600 text-[10px]">{connector.type}</div>
          </div>
        </div>
        <span
          className="text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{
            color: statusStyle.color,
            background: `${statusStyle.color}18`,
            border: `1px solid ${statusStyle.color}30`,
          }}
        >
          {statusStyle.label}
        </span>
      </div>

      {connector.status === 'connected' && connector.dataPoints !== undefined && (
        <div className="text-slate-500 text-[10px] mb-2 font-mono">
          {connector.dataPoints.toLocaleString()} data points
          {connector.lastSync && ` · ${new Date(connector.lastSync).toLocaleDateString()}`}
        </div>
      )}

      <div className="flex gap-1.5">
        {connector.status !== 'connected' ? (
          <button
            onClick={onConnect}
            disabled={busy}
            className="px-2 py-1 rounded bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white text-[10px] transition-colors"
          >
            {busy ? '…' : 'Connect'}
          </button>
        ) : (
          <button
            onClick={onSync}
            disabled={busy}
            className="px-2 py-1 rounded bg-[#1e1e2e] hover:bg-[#2a2a3e] disabled:opacity-40 text-slate-400 text-[10px] transition-colors"
          >
            {busy ? '…' : '↻ Sync'}
          </button>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-3 text-center">
      <div className="text-xl font-bold font-mono" style={{ color }}>{value.toLocaleString()}</div>
      <div className="text-[11px] text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}
