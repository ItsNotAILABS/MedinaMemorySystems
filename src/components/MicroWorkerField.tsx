'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  bootMicroWorkers,
  getRuntimeState,
  getWorkerSummary,
  type MicroWorkerRuntimeState,
} from '@/organism/workers/MicroWorkerRuntime';

/**
 * MicroWorkerField — Live worker status in the OrganismField bar.
 * Shows total online workers, processing count, and tasks completed.
 * Always on. Always passive.
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
    // Boot workers on mount — always-on, passive
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
        title={`${summary.online}/${summary.total} workers online · ${summary.tasks} tasks · ${summary.uptime} uptime`}
      >
        {/* Pulse indicator */}
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: allOnline ? '#10b981' : '#ef4444' }}
        />
        <span className="font-mono text-[10px]" style={{ color: allOnline ? '#10b981' : '#ef4444' }}>
          {summary.online}
        </span>
        <span className="text-[10px] text-slate-600">MW</span>
        {summary.processing > 0 && (
          <span className="font-mono text-[10px] text-blue-400">
            ⚡{summary.processing}
          </span>
        )}
      </button>

      {/* Expanded domain breakdown */}
      {expanded && (
        <div
          className="absolute top-full right-0 mt-1 w-72 bg-[#0d0d15] border border-[#1e1e2e] rounded-lg shadow-xl z-50 overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-[#1e1e2e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-300">MICRO WORKERS</span>
              <span className="text-[10px] text-slate-500 font-mono">{summary.total}</span>
            </div>
            <span className="text-[10px] text-slate-600 font-mono">{summary.uptime}</span>
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
                    style={{ background: domain.activeCount === 10 ? '#10b981' : '#f59e0b' }}
                  />
                  <span className="text-[10px] font-mono text-slate-400 truncate">
                    {domain.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-slate-500">
                    {domain.activeCount}/10
                  </span>
                  <span className="text-[10px] font-mono text-slate-600">
                    {domain.totalTasks}t
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-3 py-1.5 border-t border-[#1e1e2e] flex items-center justify-between">
            <span className="text-[10px] text-slate-500">Tasks processed</span>
            <span className="text-[10px] font-mono text-slate-400">{summary.tasks}</span>
          </div>
        </div>
      )}
    </div>
  );
}
