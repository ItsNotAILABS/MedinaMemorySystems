'use client';

import { useState, useEffect, useCallback } from 'react';
import { cls } from '@/lib/sovereign-cls';
import type { ReplaySession, ReplayEvent } from '@/types';

const EVENT_COLORS: Record<string, string> = {
  command: '#3b82f6',
  memory: '#8b5cf6',
  governance: '#10b981',
  model: '#6366f1',
  company: '#ec4899',
  system: '#6b7280',
};

const OUTCOME_COLORS = {
  success: '#10b981',
  failure: '#ef4444',
  partial: '#f59e0b',
};

export default function ReplayPanel() {
  const [sessions, setSessions] = useState<ReplaySession[]>([]);
  const [selected, setSelected] = useState<ReplaySession | null>(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [stats, setStats] = useState<{ totalSessions: number; totalEvents: number; currentlyRecording: boolean } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, stRes] = await Promise.all([
        fetch('/api/replay?action=list'),
        fetch('/api/replay?action=stats'),
      ]);
      const [sData, stData] = await Promise.all([
        sRes.json() as Promise<{ data: ReplaySession[] }>,
        stRes.json() as Promise<{ data: typeof stats }>,
      ]);
      setSessions(sData.data ?? []);
      setStats(stData.data ?? null);
      setRecording(stData.data?.currentlyRecording ?? false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const handleStart = async () => {
    await fetch('/api/replay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start', name: `Session ${new Date().toLocaleString()}` }),
    });
    setRecording(true);
    void fetchData();
  };

  const handleStop = async () => {
    await fetch('/api/replay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'stop' }),
    });
    setRecording(false);
    void fetchData();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d15] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-lg">⏮️</span>
          <h2 className="text-sm font-semibold text-slate-200">Replay & Audit</h2>
          {stats && (
            <span className="text-xs text-slate-500">
              {stats.totalSessions} sessions · {stats.totalEvents} events
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {recording ? (
            <button
              onClick={() => void handleStop()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-red-700 hover:bg-red-600 text-white transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-red-300 animate-pulse" />
              Stop Recording
            </button>
          ) : (
            <button
              onClick={() => void handleStart()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-cyan-700 hover:bg-cyan-600 text-white transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-300" />
              Start Recording
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sessions list */}
        <div className={cls('overflow-y-auto p-4 space-y-2', selected ? 'w-64 border-r border-[#1e1e2e]' : 'flex-1')}>
          {loading ? (
            <div className="text-slate-500 text-sm text-center py-8 font-mono">Loading sessions…</div>
          ) : sessions.length === 0 ? (
            <div className="text-slate-600 text-sm text-center py-8">No replay sessions</div>
          ) : (
            sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                selected={selected?.id === session.id}
                onSelect={() => setSelected(selected?.id === session.id ? null : session)}
              />
            ))
          )}
        </div>

        {/* Event detail */}
        {selected && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d15]">
              <div className="text-xs font-semibold text-slate-300">{selected.name}</div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {selected.events.length === 0 ? (
                <div className="text-slate-600 text-sm text-center py-8">No events recorded</div>
              ) : (
                selected.events.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SessionCard({
  session,
  selected,
  onSelect,
}: {
  session: ReplaySession;
  selected: boolean;
  onSelect: () => void;
}) {
  const isRecording = session.status === 'recording';

  return (
    <button
      onClick={onSelect}
      className={cls(
        'w-full rounded-lg border p-3 text-left transition-all text-xs',
        selected
          ? 'border-cyan-500/50 bg-[#0d1a1e]'
          : 'border-[#1e1e2e] bg-[#12121a] hover:border-[#2d2d42]',
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-200 font-medium truncate">{session.name}</span>
        <span
          className={cls(
            'text-[10px] font-mono px-1.5 py-0.5 rounded ml-2 shrink-0',
            isRecording ? 'text-red-400 bg-red-400/10 border border-red-400/30' : 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/30',
          )}
        >
          {isRecording ? '● REC' : '✓ DONE'}
        </span>
      </div>
      <div className="text-slate-500 text-[10px] font-mono">
        {session.events.length} events · {new Date(session.startTime).toLocaleDateString()}
      </div>
    </button>
  );
}

function EventRow({ event }: { event: ReplayEvent }) {
  const typeColor = EVENT_COLORS[event.type] ?? '#6b7280';
  const outcomeColor = OUTCOME_COLORS[event.outcome];

  return (
    <div className="flex items-start gap-3 py-2 border-b border-[#1e1e2e] text-[10px] font-mono">
      <span className="text-slate-600 w-6 shrink-0 text-right">{event.sequenceId}</span>
      <span
        className="px-1.5 py-0.5 rounded shrink-0"
        style={{ color: typeColor, background: `${typeColor}18`, border: `1px solid ${typeColor}30` }}
      >
        {event.type}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-slate-300">{event.action}</div>
        <div className="text-slate-600 text-[9px] mt-0.5 truncate">
          {event.actor} · {new Date(event.timestamp).toLocaleTimeString()} · {event.duration}ms
        </div>
      </div>
      <span
        className="shrink-0 px-1 py-0.5 rounded"
        style={{ color: outcomeColor, background: `${outcomeColor}18` }}
      >
        {event.outcome}
      </span>
    </div>
  );
}
