'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  bootMicroWorkers,
  getRuntimeState,
  getWorkerSummary,
  type MicroWorkerRuntimeState,
} from '@/organism/workers/MicroWorkerRuntime';

const STAGE_COLORS: Record<string, string> = {
  APPRENTICE: '#3b82f6',
  JOURNEYMAN: '#f59e0b',
  MASTER: '#10b981',
  SOVEREIGN: '#a855f7',
};

const STAGE_ICONS: Record<string, string> = {
  APPRENTICE: '◇',
  JOURNEYMAN: '◈',
  MASTER: '◆',
  SOVEREIGN: '𓂀',
};

/**
 * MicroWorkerField — Live career status in the OrganismField bar.
 * Shows careers flowing, stage distribution, and flow cycles.
 * Always on. Always flowing. Careers, not tasks.
 */
export default function MicroWorkerField() {
  const [summary, setSummary] = useState<ReturnType<typeof getWorkerSummary> | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [domainStats, setDomainStats] = useState<MicroWorkerRuntimeState['domains']>([]);

  const refresh = useCallback(() => {
    const s = getWorkerSummary();
    setSummary(s);
    if (expanded) {
      const state = getRuntimeState();
      setDomainStats(state.domains);
    }
  }, [expanded]);

  useEffect(() => {
    bootMicroWorkers();
    refresh();

    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (!summary) return null;

  const allOnline = summary.online === summary.total;

  return (
    <div className="relative">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 px-2 py-0.5 rounded-full transition-all hover:bg-[#1e1e2e]"
        style={{
          background: allOnline ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${allOnline ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
        }}
        title={`${summary.online}/${summary.total} careers flowing · ${summary.flowCycles} cycles · ${summary.uptime} uptime`}
      >
        {/* Pulse indicator */}
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: allOnline ? '#10b981' : '#ef4444' }}
        />
        <span className="font-mono text-[10px]" style={{ color: allOnline ? '#10b981' : '#ef4444' }}>
          {summary.online}
        </span>
        <span className="text-[10px] text-slate-600">careers</span>
        {summary.flowing > 0 && (
          <span className="font-mono text-[10px] text-emerald-400">
            ≋{summary.flowing}
          </span>
        )}
      </button>

      {/* Expanded domain breakdown */}
      {expanded && (
        <div
          className="absolute top-full right-0 mt-1 w-80 bg-[#0d0d15] border border-[#1e1e2e] rounded-lg shadow-xl z-50 overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-[#1e1e2e]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-300">CAREERS FLOWING</span>
              <span className="text-[10px] text-slate-600 font-mono">{summary.uptime}</span>
            </div>
            {/* Career stage distribution */}
            <div className="flex items-center gap-2">
              {(['APPRENTICE', 'JOURNEYMAN', 'MASTER', 'SOVEREIGN'] as const).map((stage) => (
                <div key={stage} className="flex items-center gap-0.5">
                  <span className="text-[9px]" style={{ color: STAGE_COLORS[stage] }}>
                    {STAGE_ICONS[stage]}
                  </span>
                  <span className="text-[9px] font-mono" style={{ color: STAGE_COLORS[stage] }}>
                    {summary.careers[stage]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {domainStats.map((domain) => (
              <div
                key={domain.id}
                className="flex items-center justify-between px-3 py-1.5 border-b border-[#1e1e2e]/50 hover:bg-[#12121a]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: domain.onlineCount === 10 ? '#10b981' : '#f59e0b' }}
                  />
                  <span className="text-[10px] font-mono text-slate-400 truncate">
                    {domain.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-slate-500">
                    {domain.onlineCount}/10
                  </span>
                  <span className="text-[10px] font-mono text-slate-600">
                    {domain.totalFlowCycles}c
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-3 py-1.5 border-t border-[#1e1e2e] flex items-center justify-between">
            <span className="text-[10px] text-slate-500">Total flow cycles</span>
            <span className="text-[10px] font-mono text-slate-400">{summary.flowCycles}</span>
          </div>
        </div>
      )}
    </div>
  );
}
