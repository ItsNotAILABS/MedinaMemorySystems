'use client';

import { useState, useEffect, useCallback } from 'react';
import { cls } from '@/lib/sovereign-cls';
import type { MemoryEntry } from '@/types';

const TYPE_COLORS: Record<string, string> = {
  episodic: '#3b82f6',
  semantic: '#8b5cf6',
  procedural: '#10b981',
  spatial: '#06b6d4',
  doctrinal: '#f59e0b',
};

export default function MemoryTemple() {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [selected, setSelected] = useState<MemoryEntry | null>(null);
  const [filter, setFilter] = useState('');
  const [minSalience, setMinSalience] = useState(0);
  const [view, setView] = useState<'list' | 'spatial'>('list');
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState('');
  const [storing, setStoring] = useState(false);

  const fetchMemories = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter
        ? `/api/memory?action=search&query=${encodeURIComponent(filter)}&limit=30`
        : `/api/memory?action=list&limit=30`;
      const res = await fetch(url);
      const data = await res.json() as { data: MemoryEntry[] | { entries: MemoryEntry[] } };
      let entries: MemoryEntry[] = [];
      if (Array.isArray(data.data)) {
        entries = data.data;
      } else if (data.data && 'entries' in (data.data as object)) {
        entries = (data.data as { entries: MemoryEntry[] }).entries;
      }
      setEntries(entries.filter((e) => e.salience >= minSalience));
    } finally {
      setLoading(false);
    }
  }, [filter, minSalience]);

  useEffect(() => { void fetchMemories(); }, [fetchMemories]);

  const handlePin = async (id: string, pinned: boolean) => {
    await fetch('/api/memory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: pinned ? 'unpin' : 'pin' }),
    });
    void fetchMemories();
  };

  const handleStore = async () => {
    if (!newContent.trim()) return;
    setStoring(true);
    try {
      await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent.trim(), type: 'semantic', tags: ['manual'] }),
      });
      setNewContent('');
      void fetchMemories();
    } finally {
      setStoring(false);
    }
  };

  const navigateToRoot = async () => {
    const res = await fetch('/api/memory?action=root');
    const data = await res.json() as { data: MemoryEntry };
    if (data.data) setSelected(data.data);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main panel */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d15] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-lg">🧠</span>
            <h2 className="text-sm font-semibold text-slate-200">Memory Temple</h2>
            <span className="text-[10px] text-slate-500">({entries.length} entries)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={navigateToRoot}
              className="text-[11px] px-2 py-1 rounded bg-[#1e1e2e] text-slate-400 hover:text-slate-200 transition-colors"
            >
              → Root
            </button>
            <button
              onClick={() => setView(view === 'list' ? 'spatial' : 'list')}
              className="text-[11px] px-2 py-1 rounded bg-[#1e1e2e] text-slate-400 hover:text-slate-200 transition-colors"
            >
              {view === 'list' ? '⊞ Spatial' : '≡ List'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#1e1e2e] bg-[#0a0a0f] shrink-0">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search memories…"
            className="cmd-input flex-1 px-3 py-1.5 rounded text-xs bg-[#12121a] border border-[#1e1e2e] text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500"
          />
          <label className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            Salience ≥
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={minSalience}
              onChange={(e) => setMinSalience(parseFloat(e.target.value))}
              className="w-16 accent-purple-500"
            />
            <span className="text-purple-400 font-mono w-6">{minSalience.toFixed(1)}</span>
          </label>
        </div>

        {/* Store new */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1e1e2e] bg-[#0a0a0f] shrink-0">
          <input
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void handleStore()}
            placeholder="Store new memory…"
            className="cmd-input flex-1 px-3 py-1.5 rounded text-xs bg-[#12121a] border border-[#1e1e2e] text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500"
          />
          <button
            onClick={() => void handleStore()}
            disabled={!newContent.trim() || storing}
            className="px-3 py-1.5 rounded text-xs bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
          >
            {storing ? '…' : '+ Store'}
          </button>
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-slate-500 text-sm text-center py-8 font-mono">Loading memories…</div>
          ) : entries.length === 0 ? (
            <div className="text-slate-600 text-sm text-center py-8">No memories found</div>
          ) : view === 'list' ? (
            <div className="space-y-2">
              {entries.map((entry) => (
                <MemoryCard
                  key={entry.id}
                  entry={entry}
                  selected={selected?.id === entry.id}
                  onSelect={() => setSelected(entry)}
                  onPin={() => void handlePin(entry.id, entry.pinned)}
                />
              ))}
            </div>
          ) : (
            <SpatialView entries={entries} onSelect={setSelected} />
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-80 border-l border-[#1e1e2e] bg-[#12121a] flex flex-col overflow-hidden shrink-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e]">
            <span className="text-xs font-semibold text-slate-300">Memory Detail</span>
            <button
              onClick={() => setSelected(null)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            <div>
              <div className="text-slate-500 mb-1">Content</div>
              <div className="text-slate-200 leading-relaxed">{selected.content}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Type" value={selected.type} color={TYPE_COLORS[selected.type]} />
              <Field label="Salience" value={(selected.salience * 100).toFixed(0) + '%'} />
              <Field label="Doctrine Align" value={(selected.doctrineAlignment * 100).toFixed(0) + '%'} />
              <Field label="Ring" value={`N${selected.coordinates.ring}`} />
              <Field label="Beat" value={String(selected.coordinates.beat)} />
              <Field label="Depth" value={String(selected.coordinates.depth)} />
            </div>
            <div>
              <div className="text-slate-500 mb-1">Coordinates</div>
              <div className="font-mono text-slate-400 bg-[#0a0a0f] rounded p-2 text-[10px]">
                θ:{selected.coordinates.theta.toFixed(1)}° φ:{selected.coordinates.phi.toFixed(1)}°
              </div>
            </div>
            {selected.tags.length > 0 && (
              <div>
                <div className="text-slate-500 mb-1">Tags</div>
                <div className="flex flex-wrap gap-1">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 bg-[#1e1e2e] rounded text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="text-slate-500 mb-1">ID</div>
              <div className="font-mono text-slate-600 text-[10px] break-all">{selected.id}</div>
            </div>
            {selected.resonanceScore !== undefined && (
              <Field label="Resonance" value={(selected.resonanceScore * 100).toFixed(0) + '%'} color="#8b5cf6" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MemoryCard({
  entry,
  selected,
  onSelect,
  onPin,
}: {
  entry: MemoryEntry;
  selected: boolean;
  onSelect: () => void;
  onPin: () => void;
}) {
  const typeColor = TYPE_COLORS[entry.type] ?? '#6b7280';
  return (
    <div
      onClick={onSelect}
      className={cls(
        'rounded-lg border p-3 cursor-pointer transition-all text-xs',
        selected
          ? 'border-purple-500/50 bg-[#1a1228]'
          : 'border-[#1e1e2e] bg-[#12121a] hover:border-[#2d2d42] hover:bg-[#14141e]',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-mono"
              style={{ color: typeColor, background: `${typeColor}18`, border: `1px solid ${typeColor}30` }}
            >
              {entry.type}
            </span>
            <span className="text-slate-600 font-mono">N{entry.coordinates.ring}</span>
            {entry.pinned && <span className="text-yellow-400 text-[10px]">📌</span>}
          </div>
          <div className="text-slate-300 leading-relaxed truncate">{entry.content}</div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-purple-400 font-mono">{(entry.salience * 100).toFixed(0)}%</span>
          <button
            onClick={(e) => { e.stopPropagation(); onPin(); }}
            className="text-slate-600 hover:text-yellow-400 transition-colors"
          >
            {entry.pinned ? '📌' : '○'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SpatialView({ entries, onSelect }: { entries: MemoryEntry[]; onSelect: (e: MemoryEntry) => void }) {
  return (
    <div className="relative w-full h-full min-h-96 bg-[#08080f] rounded-lg border border-[#1e1e2e] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Rings */}
        {[1, 2, 3, 4, 5].map((ring) => (
          <div
            key={ring}
            className="absolute rounded-full border border-[#1e1e2e]"
            style={{ width: ring * 80, height: ring * 80, opacity: 0.4 }}
          />
        ))}
        {/* Memory dots */}
        {entries.slice(0, 40).map((entry) => {
          const rad = (entry.coordinates.theta * Math.PI) / 180;
          const r = (entry.coordinates.ring / 6) * 200;
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r;
          const color = TYPE_COLORS[entry.type] ?? '#6b7280';
          return (
            <button
              key={entry.id}
              title={entry.content.slice(0, 80)}
              onClick={() => onSelect(entry)}
              className="absolute w-3 h-3 rounded-full transition-transform hover:scale-150 hover:z-10"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                background: color,
                opacity: 0.4 + entry.salience * 0.6,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-[#0a0a0f] rounded p-2">
      <div className="text-slate-600 text-[10px] mb-0.5">{label}</div>
      <div className="font-mono text-[11px]" style={{ color: color ?? '#94a3b8' }}>{value}</div>
    </div>
  );
}
