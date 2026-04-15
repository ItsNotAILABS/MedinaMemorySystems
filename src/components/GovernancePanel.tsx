'use client';

import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import type { Proposal, Gate, AuditEntry } from '@/types';

const STATUS_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  draft: { color: '#6b7280', bg: '#6b728018', border: '#6b728030' },
  open: { color: '#3b82f6', bg: '#3b82f618', border: '#3b82f630' },
  approved: { color: '#10b981', bg: '#10b98118', border: '#10b98130' },
  enacted: { color: '#f59e0b', bg: '#f59e0b18', border: '#f59e0b30' },
  rejected: { color: '#ef4444', bg: '#ef444418', border: '#ef444430' },
  archived: { color: '#374151', bg: '#37415118', border: '#37415130' },
};

const GATE_STYLES: Record<string, { color: string; label: string }> = {
  green: { color: '#10b981', label: 'GREEN' },
  amber: { color: '#f59e0b', label: 'AMBER' },
  red: { color: '#ef4444', label: 'RED' },
};

export default function GovernancePanel() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [gates, setGates] = useState<Gate[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'proposals' | 'audit'>('proposals');
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, gRes, aRes] = await Promise.all([
        fetch('/api/govern?action=list'),
        fetch('/api/govern?action=gates'),
        fetch('/api/govern?action=audit&limit=20'),
      ]);
      const [pData, gData, aData] = await Promise.all([
        pRes.json() as Promise<{ data: Proposal[] }>,
        gRes.json() as Promise<{ data: Gate[] }>,
        aRes.json() as Promise<{ data: AuditEntry[] }>,
      ]);
      setProposals(pData.data ?? []);
      setGates(gData.data ?? []);
      setAuditLog(aData.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await fetch('/api/govern', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', title: newTitle, description: newDesc, author: 'User' }),
    });
    setNewTitle('');
    setNewDesc('');
    setShowCreate(false);
    void fetchData();
  };

  const handleVote = async (id: string, vote: 'for' | 'against' | 'abstain') => {
    await fetch('/api/govern', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'vote', id, vote, voter: 'User' }),
    });
    void fetchData();
  };

  const handleOpen = async (id: string) => {
    await fetch('/api/govern', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'open', id }),
    });
    void fetchData();
  };

  const handleEnact = async (id: string) => {
    await fetch('/api/govern', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'enact', id }),
    });
    void fetchData();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d15] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-lg">⚖️</span>
          <h2 className="text-sm font-semibold text-slate-200">Governance Panel</h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Gates */}
          {gates.map((gate) => {
            const style = GATE_STYLES[gate.status];
            return (
              <span
                key={gate.id}
                className="text-[10px] font-mono px-2 py-1 rounded"
                style={{ color: style.color, background: `${style.color}18`, border: `1px solid ${style.color}30` }}
              >
                Gate {gate.id}: {style.label}
              </span>
            );
          })}
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="text-xs px-3 py-1.5 rounded bg-green-700 hover:bg-green-600 text-white transition-colors"
          >
            + Propose
          </button>
        </div>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="px-4 py-3 border-b border-[#1e1e2e] bg-[#0f0f1a] shrink-0 space-y-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Proposal title…"
            className="w-full cmd-input px-3 py-2 rounded text-sm bg-[#12121a] border border-[#1e1e2e] text-slate-200 placeholder-slate-600 outline-none focus:border-green-500"
          />
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)…"
            rows={2}
            className="w-full cmd-input px-3 py-2 rounded text-sm bg-[#12121a] border border-[#1e1e2e] text-slate-200 placeholder-slate-600 outline-none focus:border-green-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => void handleCreate()}
              disabled={!newTitle.trim()}
              className="px-3 py-1.5 rounded text-xs bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 rounded text-xs bg-[#1e1e2e] text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 px-4 border-b border-[#1e1e2e] bg-[#0a0a0f] shrink-0">
        {(['proposals', 'audit'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'py-2.5 text-xs font-medium border-b-2 transition-colors capitalize',
              activeTab === tab
                ? 'border-green-500 text-green-400'
                : 'border-transparent text-slate-500 hover:text-slate-300',
            )}
          >
            {tab === 'proposals' ? `Proposals (${proposals.length})` : `Audit Log (${auditLog.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-slate-500 text-sm text-center py-8 font-mono">Loading governance…</div>
        ) : activeTab === 'proposals' ? (
          <div className="space-y-3">
            {proposals.map((p) => (
              <ProposalCard
                key={p.id}
                proposal={p}
                onVote={handleVote}
                onOpen={handleOpen}
                onEnact={handleEnact}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {auditLog.map((entry) => (
              <AuditRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProposalCard({
  proposal,
  onVote,
  onOpen,
  onEnact,
}: {
  proposal: Proposal;
  onVote: (id: string, vote: 'for' | 'against' | 'abstain') => void;
  onOpen: (id: string) => void;
  onEnact: (id: string) => void;
}) {
  const style = STATUS_STYLES[proposal.status] ?? STATUS_STYLES.draft;

  return (
    <div className="rounded-lg border border-[#1e1e2e] bg-[#12121a] p-4 text-xs space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-1.5 py-0.5 rounded font-mono text-[10px]"
              style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}
            >
              {proposal.status.toUpperCase()}
            </span>
            {proposal.doctrineRef && (
              <span className="text-slate-600 font-mono text-[10px]">{proposal.doctrineRef}</span>
            )}
          </div>
          <div className="text-slate-200 font-medium text-sm">{proposal.title}</div>
          <div className="text-slate-500 mt-1 leading-relaxed">{proposal.description}</div>
        </div>
      </div>

      {/* Votes */}
      <div className="flex items-center gap-4">
        <span className="text-green-400">For: {proposal.votes.for}</span>
        <span className="text-red-400">Against: {proposal.votes.against}</span>
        <span className="text-slate-500">Abstain: {proposal.votes.abstain}</span>
      </div>

      {/* Vote bar */}
      {proposal.votes.for + proposal.votes.against + proposal.votes.abstain > 0 && (
        <div className="w-full h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{
              width: `${(proposal.votes.for / (proposal.votes.for + proposal.votes.against + proposal.votes.abstain)) * 100}%`,
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {proposal.status === 'draft' && (
          <button
            onClick={() => onOpen(proposal.id)}
            className="px-2.5 py-1 rounded bg-blue-700 hover:bg-blue-600 text-white transition-colors"
          >
            Open for Voting
          </button>
        )}
        {proposal.status === 'open' && (
          <>
            <button onClick={() => onVote(proposal.id, 'for')} className="px-2.5 py-1 rounded bg-green-700 hover:bg-green-600 text-white transition-colors">
              Vote For
            </button>
            <button onClick={() => onVote(proposal.id, 'against')} className="px-2.5 py-1 rounded bg-red-700/70 hover:bg-red-700 text-white transition-colors">
              Against
            </button>
            <button onClick={() => onVote(proposal.id, 'abstain')} className="px-2.5 py-1 rounded bg-[#1e1e2e] text-slate-400 hover:text-slate-200 transition-colors">
              Abstain
            </button>
          </>
        )}
        {proposal.status === 'approved' && (
          <button
            onClick={() => onEnact(proposal.id)}
            className="px-2.5 py-1 rounded bg-yellow-600 hover:bg-yellow-500 text-white transition-colors"
          >
            ⚡ Enact
          </button>
        )}
      </div>

      <div className="text-slate-600 text-[10px] font-mono">
        {proposal.author} · {new Date(proposal.createdAt).toLocaleDateString()}
        {proposal.affectedGates.length > 0 && ` · Gates: ${proposal.affectedGates.join(', ')}`}
      </div>
    </div>
  );
}

function AuditRow({ entry }: { entry: AuditEntry }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-[#1e1e2e] text-xs">
      <span className="text-green-400 font-mono shrink-0">{new Date(entry.timestamp).toLocaleTimeString()}</span>
      <span className="text-blue-400 font-mono shrink-0">{entry.actor}</span>
      <span className="text-slate-300 flex-1">{entry.details}</span>
      <span className="text-slate-600 font-mono shrink-0">{entry.action}</span>
    </div>
  );
}
