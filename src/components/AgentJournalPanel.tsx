'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cls } from '@/lib/sovereign-cls';
import type {
  ActivatedAgentSession,
  AgentJournalEntry,
  ModelFamily,
  AgentJournalPhase,
} from '@/types';

// ─── Constants ─────────────────────────────────────────────────────────────

const PHASE_COLORS: Record<AgentJournalPhase, string> = {
  activation:         '#3b82f6',
  'vault-retrieval':  '#8b5cf6',
  'doctrine-retrieval': '#10b981',
  reasoning:          '#6366f1',
  arbitration:        '#f59e0b',
  composition:        '#06b6d4',
  promotion:          '#ec4899',
  'drift-log':        '#ef4444',
  completion:         '#10b981',
  error:              '#ef4444',
};

const PHASE_ICONS: Record<AgentJournalPhase, string> = {
  activation:           '⚡',
  'vault-retrieval':    '🗄️',
  'doctrine-retrieval': '📜',
  reasoning:            '🧠',
  arbitration:          '⚖️',
  composition:          '✍️',
  promotion:            '🚀',
  'drift-log':          '⚠️',
  completion:           '✅',
  error:                '❌',
};

const STATUS_COLORS: Record<string, string> = {
  activating:  '#3b82f6',
  retrieving:  '#8b5cf6',
  reasoning:   '#6366f1',
  arbitrating: '#f59e0b',
  promoting:   '#ec4899',
  complete:    '#10b981',
  failed:      '#ef4444',
};

const AGENT_COLORS: Partial<Record<ModelFamily | 'arbitrator' | 'system', string>> = {
  strategist:       '#3b82f6',
  builder:          '#10b981',
  analyst:          '#6366f1',
  governance:       '#f59e0b',
  'memory-curator': '#8b5cf6',
  operations:       '#ec4899',
  risk:             '#ef4444',
  projection:       '#06b6d4',
  arbitrator:       '#f97316',
  system:           '#6b7280',
};

const ALL_AGENTS: ModelFamily[] = [
  'strategist', 'builder', 'analyst', 'governance',
  'memory-curator', 'operations', 'risk', 'projection',
];

// ─── Sub-components ────────────────────────────────────────────────────────

function JournalLine({ entry }: { entry: AgentJournalEntry }) {
  const color = PHASE_COLORS[entry.phase] ?? '#6b7280';
  const agentColor = AGENT_COLORS[entry.agentId as keyof typeof AGENT_COLORS] ?? '#6b7280';
  const icon = PHASE_ICONS[entry.phase] ?? '·';

  return (
    <div className="flex items-start gap-2 py-1 px-2 rounded hover:bg-[#1a1a26] transition-colors">
      <span className="text-xs mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: agentColor + '22', color: agentColor }}>
            {entry.agentId}
          </span>
          <span className="text-[10px] font-mono" style={{ color }}>{entry.phase}</span>
          <span className="text-xs text-slate-300 truncate">{entry.action}</span>
          {entry.maturityScore !== undefined && (
            <span className="text-[10px] font-mono text-slate-500 ml-auto shrink-0">
              {(entry.maturityScore * 100).toFixed(0)}%
            </span>
          )}
        </div>
        {entry.detail && (
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono leading-tight truncate">{entry.detail}</p>
        )}
      </div>
      <span className="text-[9px] text-slate-600 font-mono shrink-0 mt-0.5">
        {new Date(entry.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
}

function MaturityBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[11px] font-mono" style={{ color }}>{pct}%</span>
    </div>
  );
}

// ─── Main Panel ────────────────────────────────────────────────────────────

export default function AgentJournalPanel() {
  const [sessions, setSessions] = useState<ActivatedAgentSession[]>([]);
  const [selected, setSelected] = useState<ActivatedAgentSession | null>(null);
  const [stats, setStats] = useState<{
    totalSessions: number;
    completedSessions: number;
    totalAgentActivations: number;
    totalPromotions: number;
    avgMaturityScore: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [promoting, setPromoting] = useState(false);

  // Activation form
  const [task, setTask] = useState('');
  const [context, setContext] = useState('');
  const [agentOverrides, setAgentOverrides] = useState<ModelFamily[]>([]);
  const [autoPromote, setAutoPromote] = useState(false);

  const journalEndRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, stRes] = await Promise.all([
        fetch('/api/agents?action=list&limit=30'),
        fetch('/api/agents?action=stats'),
      ]);
      const [sData, stData] = await Promise.all([
        sRes.json() as Promise<{ data: ActivatedAgentSession[] }>,
        stRes.json() as Promise<{ data: typeof stats }>,
      ]);
      setSessions(sData.data ?? []);
      setStats(stData.data ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  // Auto-scroll journal
  useEffect(() => {
    journalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.journal.length]);

  const handleActivate = async () => {
    if (!task.trim()) return;
    setActivating(true);
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: task.trim(),
          context: context.trim() || undefined,
          agentOverrides: agentOverrides.length > 0 ? agentOverrides : undefined,
          autoPromote,
          promoteThreshold: 0.80,
        }),
      });
      const data = await res.json() as { data: ActivatedAgentSession };
      setSelected(data.data);
      setTask('');
      setContext('');
      setAgentOverrides([]);
      await fetchData();
    } finally {
      setActivating(false);
    }
  };

  const handlePromote = async () => {
    if (!selected) return;
    setPromoting(true);
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // threshold: 0.0 — manual promotion bypasses the maturity gate entirely;
        // the user has explicitly chosen to promote regardless of score.
        body: JSON.stringify({ action: 'promote', sessionId: selected.id, threshold: 0.0 }),
      });
      const data = await res.json() as { data: { promoted: boolean; memory: { id: string } } };
      if (data.data.promoted) {
        // Refresh session
        const sRes = await fetch(`/api/agents?action=session&id=${selected.id}`);
        const sData = await sRes.json() as { data: ActivatedAgentSession };
        setSelected(sData.data);
        await fetchData();
      }
    } finally {
      setPromoting(false);
    }
  };

  const toggleAgentOverride = (agent: ModelFamily) => {
    setAgentOverrides((prev) =>
      prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent],
    );
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Session list + activation form */}
      <div className="w-72 shrink-0 flex flex-col border-r border-[#1e1e2e] bg-[#0d0d15]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#1e1e2e] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-lg">⚡</span>
            <h2 className="text-sm font-semibold text-slate-200">Agent Journal</h2>
            {stats && (
              <span className="ml-auto text-[10px] font-mono text-slate-500">
                {stats.totalSessions} sessions
              </span>
            )}
          </div>
          {stats && (
            <div className="grid grid-cols-2 gap-1 mt-2">
              {[
                { label: 'Activations', value: stats.totalAgentActivations },
                { label: 'Promotions', value: stats.totalPromotions },
                { label: 'Completed', value: stats.completedSessions },
                { label: 'Avg Maturity', value: `${Math.round(stats.avgMaturityScore * 100)}%` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#12121a] rounded p-1.5">
                  <div className="text-[9px] text-slate-500 font-mono">{label}</div>
                  <div className="text-xs font-bold text-slate-200">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activation form */}
        <div className="px-3 py-3 border-b border-[#1e1e2e] space-y-2 shrink-0">
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Task for agents…"
            rows={2}
            className="w-full bg-[#12121a] border border-[#2a2a3e] rounded px-2.5 py-2 text-xs text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-yellow-500/40"
          />
          <input
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Optional context…"
            className="w-full bg-[#12121a] border border-[#2a2a3e] rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-yellow-500/40"
          />

          {/* Agent override selector */}
          <div>
            <div className="text-[10px] text-slate-500 font-mono mb-1">Override agents (optional)</div>
            <div className="flex flex-wrap gap-1">
              {ALL_AGENTS.map((agent) => {
                const color = AGENT_COLORS[agent] ?? '#6b7280';
                const active = agentOverrides.includes(agent);
                return (
                  <button
                    key={agent}
                    onClick={() => toggleAgentOverride(agent)}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded border transition-all"
                    style={{
                      borderColor: active ? color : '#2a2a3e',
                      background: active ? color + '22' : 'transparent',
                      color: active ? color : '#64748b',
                    }}
                  >
                    {agent}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoPromote}
                onChange={(e) => setAutoPromote(e.target.checked)}
                className="w-3 h-3 accent-yellow-500"
              />
              <span className="text-[10px] text-slate-400 font-mono">Auto-promote</span>
            </label>
            <button
              onClick={() => void handleActivate()}
              disabled={!task.trim() || activating}
              className={cls(
                'ml-auto px-3 py-1.5 rounded text-xs font-semibold transition-all',
                activating || !task.trim()
                  ? 'bg-[#1e1e2e] text-slate-600 cursor-not-allowed'
                  : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border border-yellow-500/30',
              )}
            >
              {activating ? 'Activating…' : '⚡ Activate'}
            </button>
          </div>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto">
          {loading && !sessions.length ? (
            <div className="text-xs text-slate-600 p-4 text-center">Loading…</div>
          ) : sessions.length === 0 ? (
            <div className="text-xs text-slate-600 p-4 text-center">No sessions yet</div>
          ) : (
            sessions.map((s) => {
              const isActive = selected?.id === s.id;
              const statusColor = STATUS_COLORS[s.status] ?? '#6b7280';
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={cls(
                    'w-full text-left px-3 py-2.5 border-b border-[#1e1e2e] transition-colors',
                    isActive ? 'bg-[#1a1a2e]' : 'hover:bg-[#12121f]',
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: statusColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-200 truncate">{s.task}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] font-mono text-slate-500">{s.taskClass}</span>
                        <span className="text-[9px] font-mono text-slate-600">·</span>
                        <span className="text-[9px] font-mono" style={{ color: statusColor }}>{s.status}</span>
                        {s.maturityScore !== undefined && (
                          <>
                            <span className="text-[9px] font-mono text-slate-600">·</span>
                            <span className="text-[9px] font-mono text-slate-400">
                              {Math.round(s.maturityScore * 100)}% maturity
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-0.5 mt-1">
                        {s.activatedAgents.map((a) => (
                          <span
                            key={a}
                            className="text-[8px] font-mono px-1 py-0 rounded"
                            style={{ background: (AGENT_COLORS[a] ?? '#6b7280') + '22', color: AGENT_COLORS[a] ?? '#6b7280' }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right: Session detail + journal stream */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">
            <div className="text-center space-y-2">
              <div className="text-4xl">⚡</div>
              <p>Activate agents to begin a journal stream</p>
              <p className="text-xs text-slate-700">
                Agents recruit specialized reasoning, arbitrate outputs, and promote into the vault
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Session header */}
            <div className="px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d15] shrink-0">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 truncate">{selected.task}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: (STATUS_COLORS[selected.status] ?? '#6b7280') + '22', color: STATUS_COLORS[selected.status] ?? '#6b7280' }}
                    >
                      {selected.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{selected.taskClass}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {selected.activatedAgents.length} agents · {selected.journal.length} entries
                    </span>
                    <span className="text-[10px] font-mono text-slate-600 truncate">
                      ID: {selected.id.slice(0, 8)}…
                    </span>
                  </div>
                </div>
                {selected.maturityScore !== undefined && (
                  <div className="w-32 shrink-0">
                    <div className="text-[9px] text-slate-500 font-mono mb-1">Maturity</div>
                    <MaturityBar score={selected.maturityScore} />
                  </div>
                )}
                {!selected.promoted && selected.status === 'complete' && (
                  <button
                    onClick={() => void handlePromote()}
                    disabled={promoting}
                    className="px-2.5 py-1.5 rounded text-[11px] font-semibold border border-pink-500/30 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20 transition-colors disabled:opacity-50 shrink-0"
                  >
                    {promoting ? '…' : '🚀 Promote'}
                  </button>
                )}
                {selected.promoted && (
                  <span className="text-[11px] font-mono text-pink-400 shrink-0">🚀 Promoted</span>
                )}
              </div>

              {/* Agent chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selected.activatedAgents.map((agent) => {
                  const color = AGENT_COLORS[agent] ?? '#6b7280';
                  const agentOutput = selected.agentOutputs.find((o) => o.agentId === agent);
                  return (
                    <div
                      key={agent}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono"
                      style={{ background: color + '18', border: `1px solid ${color}40`, color }}
                    >
                      {agent}
                      {agentOutput && (
                        <span className="text-[9px] opacity-70">
                          {Math.round(agentOutput.confidence * 100)}%
                        </span>
                      )}
                    </div>
                  );
                })}
                {selected.vaultRetrievals.length > 0 && (
                  <span className="px-2 py-1 rounded text-[10px] font-mono bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    🗄️ {selected.vaultRetrievals.length} vault
                  </span>
                )}
                {selected.doctrineRetrievals.length > 0 && (
                  <span className="px-2 py-1 rounded text-[10px] font-mono bg-green-500/10 border border-green-500/30 text-green-400">
                    📜 {selected.doctrineRetrievals.length} doctrine
                  </span>
                )}
              </div>
            </div>

            {/* Journal stream + composed answer */}
            <div className="flex flex-1 overflow-hidden">
              {/* Journal stream */}
              <div className="flex-1 flex flex-col overflow-hidden border-r border-[#1e1e2e]">
                <div className="px-3 py-2 border-b border-[#1e1e2e] shrink-0">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Journal Stream</span>
                </div>
                <div className="flex-1 overflow-y-auto py-1">
                  {selected.journal.map((entry) => (
                    <JournalLine key={entry.id} entry={entry} />
                  ))}
                  <div ref={journalEndRef} />
                </div>
              </div>

              {/* Composed answer + vault context */}
              <div className="w-80 shrink-0 flex flex-col overflow-hidden">
                {selected.composedAnswer && (
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Composed Answer</div>
                      <div className="bg-[#12121a] border border-[#2a2a3e] rounded p-2.5 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selected.composedAnswer}
                      </div>
                    </div>

                    {selected.vaultRetrievals.length > 0 && (
                      <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Vault Context</div>
                        <div className="space-y-1">
                          {selected.vaultRetrievals.map((entry) => (
                            <div key={entry.id} className="bg-[#12121a] border border-purple-900/30 rounded p-2 text-[11px] text-slate-400">
                              <span className="text-purple-400 font-mono text-[9px]">{entry.type}</span>
                              <p className="mt-0.5 leading-tight">{entry.content.slice(0, 120)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selected.doctrineRetrievals.length > 0 && (
                      <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Doctrine Applied</div>
                        <div className="space-y-1">
                          {selected.doctrineRetrievals.map((entry) => (
                            <div key={entry.id} className="bg-[#12121a] border border-green-900/30 rounded p-2 text-[11px] text-slate-400">
                              <span className="text-green-400 font-mono text-[9px]">doctrinal</span>
                              <p className="mt-0.5 leading-tight">{entry.content.slice(0, 120)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
