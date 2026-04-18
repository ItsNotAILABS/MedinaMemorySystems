'use client';

import { useState, useEffect, useCallback } from 'react';
import { cls } from '@/lib/sovereign-cls';
import type { ModelDefinition, ModelFamily, ModelInvocation } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  active: '#10b981',
  idle: '#f59e0b',
  loading: '#3b82f6',
  offline: '#ef4444',
};

export default function ModelRuntime() {
  const [models, setModels] = useState<ModelDefinition[]>([]);
  const [history, setHistory] = useState<ModelInvocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ModelFamily | null>(null);
  const [prompt, setPrompt] = useState('');
  const [invoking, setInvoking] = useState(false);
  const [lastResult, setLastResult] = useState<ModelInvocation | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [mRes, hRes] = await Promise.all([
        fetch('/api/model?action=list'),
        fetch('/api/model?action=history&limit=10'),
      ]);
      const [mData, hData] = await Promise.all([
        mRes.json() as Promise<{ data: ModelDefinition[] }>,
        hRes.json() as Promise<{ data: ModelInvocation[] }>,
      ]);
      setModels(mData.data ?? []);
      setHistory(hData.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const handleInvoke = async () => {
    if (!selected || !prompt.trim()) return;
    setInvoking(true);
    try {
      const res = await fetch('/api/model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId: selected, prompt: prompt.trim() }),
      });
      const data = await res.json() as { data: ModelInvocation };
      setLastResult(data.data);
      setPrompt('');
      void fetchData();
    } finally {
      setInvoking(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d15] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 text-lg">⚡</span>
          <h2 className="text-sm font-semibold text-slate-200">Model Runtime</h2>
          <span className="text-xs text-slate-500">{models.filter((m) => m.status === 'active').length}/{models.length} active</span>
        </div>
        <button
          onClick={() => void fetchData()}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded bg-[#1e1e2e]"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Model grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-slate-500 text-sm text-center py-8 font-mono">Loading models…</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {models.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  selected={selected === model.id}
                  onSelect={() => setSelected(selected === model.id ? null : model.id)}
                />
              ))}
            </div>
          )}

          {/* Invoke panel */}
          {selected && (
            <div className="mt-4 bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4 space-y-3">
              <div className="text-xs text-slate-400 font-mono">
                Invoke: <span style={{ color: models.find((m) => m.id === selected)?.color ?? '#3b82f6' }}>{selected}</span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter prompt…"
                rows={3}
                className="w-full cmd-input px-3 py-2 rounded text-sm bg-[#0a0a0f] border border-[#1e1e2e] text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500 resize-none font-mono"
              />
              <button
                onClick={() => void handleInvoke()}
                disabled={!prompt.trim() || invoking}
                className="px-4 py-2 rounded text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
              >
                {invoking ? 'Invoking…' : `⚡ Invoke ${selected}`}
              </button>
              {lastResult && (
                <div className="bg-[#0a0a0f] rounded p-3 text-xs font-mono space-y-1">
                  <div className="text-slate-500">Response ({lastResult.latency}ms · {lastResult.tokens} tokens):</div>
                  <div className="text-slate-300 leading-relaxed">{lastResult.response}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="w-72 border-l border-[#1e1e2e] bg-[#0d0d15] flex flex-col overflow-hidden shrink-0">
            <div className="px-3 py-2.5 border-b border-[#1e1e2e] text-xs text-slate-400 font-semibold">
              Recent Invocations
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {history.map((inv) => (
                <InvocationRow key={inv.id} invocation={inv} models={models} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ModelCard({
  model,
  selected,
  onSelect,
}: {
  model: ModelDefinition;
  selected: boolean;
  onSelect: () => void;
}) {
  const statusColor = STATUS_COLORS[model.status] ?? '#6b7280';

  return (
    <button
      onClick={onSelect}
      className={cls(
        'rounded-lg border p-4 text-left transition-all',
        selected
          ? 'border-indigo-500/50 bg-[#12121e]'
          : 'border-[#1e1e2e] bg-[#12121a] hover:border-[#2d2d42]',
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div
          className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold text-white"
          style={{ background: model.color }}
        >
          {model.name[0]}
        </div>
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: statusColor }}
          />
          <span className="text-[10px] font-mono" style={{ color: statusColor }}>
            {model.status}
          </span>
        </div>
      </div>
      <div className="text-sm font-semibold text-slate-200 mb-1">{model.name}</div>
      <div className="text-[11px] text-slate-500 mb-2 leading-relaxed line-clamp-2">{model.description}</div>
      <div className="flex items-center justify-between text-[10px] text-slate-600 font-mono">
        <span>{model.latency}ms avg</span>
        <span>{model.invocationCount} calls</span>
      </div>
    </button>
  );
}

function InvocationRow({ invocation, models }: { invocation: ModelInvocation; models: ModelDefinition[] }) {
  const model = models.find((m) => m.id === invocation.modelId);
  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded p-2 text-[10px] space-y-1">
      <div className="flex items-center justify-between">
        <span
          className="font-mono px-1.5 py-0.5 rounded"
          style={{
            color: model?.color ?? '#6b7280',
            background: `${model?.color ?? '#6b7280'}18`,
            border: `1px solid ${model?.color ?? '#6b7280'}30`,
          }}
        >
          {invocation.modelId}
        </span>
        <span className="text-slate-600">{invocation.latency}ms</span>
      </div>
      <div className="text-slate-400 truncate">{invocation.response.slice(0, 60)}…</div>
    </div>
  );
}
