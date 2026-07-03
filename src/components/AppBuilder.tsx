'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AppProject, DeployTarget, TokenSpec } from '@/types/appBuilder';

const BACKENDS = [
  { id: 'motoko', label: 'Motoko (ICP)' },
  { id: 'python', label: 'Python CRUD' },
  { id: 'rust', label: 'Rust CRUD' },
] as const;

const DEPLOY_TARGETS: { id: DeployTarget; label: string }[] = [
  { id: 'saas-vercel', label: 'SaaS — Vercel' },
  { id: 'saas-cloudflare', label: 'SaaS — Cloudflare' },
  { id: 'icp-mainnet', label: 'ICP Mainnet' },
  { id: 'icp-local', label: 'ICP Local (dfx)' },
  { id: 'wasm-edge', label: 'WASM Edge Capsule' },
  { id: 'blockchain-evm', label: 'Blockchain EVM' },
  { id: 'docker', label: 'Docker' },
  { id: 'artifact-export', label: 'Export Artifacts' },
];

export default function AppBuilder() {
  const [projects, setProjects] = useState<AppProject[]>([]);
  const [selected, setSelected] = useState<AppProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [backend, setBackend] = useState<'motoko' | 'rust' | 'python'>('python');
  const [tier, setTier] = useState<'standard' | 'pro'>('standard');
  const [aiMode, setAiMode] = useState<'local' | 'cloud' | 'hybrid'>('hybrid');
  const [deployTarget, setDeployTarget] = useState<DeployTarget>('saas-vercel');
  const [tokenSymbol, setTokenSymbol] = useState('MED');
  const [log, setLog] = useState<string[]>([]);

  const pushLog = (msg: string) => setLog((l) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...l].slice(0, 20));

  const refresh = useCallback(async () => {
    const res = await fetch('/api/builder?action=projects');
    const data = await res.json();
    if (data.success) setProjects(data.data);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const api = async (action: string, body: Record<string, unknown> = {}) => {
    setLoading(true);
    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...body }),
      });
      const data = await res.json();
      if (data.success) {
        pushLog(`${action} ✓`);
        await refresh();
        if (data.data?.id) setSelected(data.data);
        else if (body.id && data.data) setSelected(data.data);
      } else {
        pushLog(`${action} failed: ${data.error}`);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const create = () => api('create', {
    name: name || 'MyApp',
    backend,
    tier,
    aiMode,
    deployTarget,
    frontend: 'react',
    proStack: tier === 'pro' ? 'node' : undefined,
  });

  const runPipeline = async (project: AppProject) => {
    setSelected(project);
    await api('scaffold', { id: project.id });
    await api('build-capsules', { id: project.id });
    const token: TokenSpec = {
      name: `${project.name} Token`,
      symbol: tokenSymbol,
      decimals: 8,
      initialSupply: '1000000000',
      standard: deployTarget.includes('icp') ? 'ICRC-1' : 'ERC-20',
      mintable: true,
    };
    await api('create-token', { id: project.id, token });
    await api('deploy', { id: project.id, target: deployTarget });
  };

  return (
    <div className="flex h-full bg-[#0a0a0f] text-slate-200">
      {/* Left — projects */}
      <div className="w-64 border-r border-[#1e1e2e] flex flex-col">
        <div className="p-4 border-b border-[#1e1e2e]">
          <h2 className="text-sm font-bold text-indigo-400">App Builder</h2>
          <p className="text-[10px] text-slate-500 mt-1">WASM · Capsules · SaaS · Chain</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                selected?.id === p.id ? 'bg-indigo-900/40 text-white' : 'hover:bg-[#1a1a2e] text-slate-400'
              }`}
            >
              <div className="font-medium truncate">{p.name}</div>
              <div className="text-[10px] opacity-60">{p.backend} · {p.status}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Center — config */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-4">Create App</h3>
          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            <label className="text-xs text-slate-400">
              App name
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full bg-[#12121a] border border-[#1e1e2e] rounded px-3 py-2 text-sm" placeholder="My SaaS App" />
            </label>
            <label className="text-xs text-slate-400">
              Backend (70% stack)
              <select value={backend} onChange={(e) => setBackend(e.target.value as typeof backend)} className="mt-1 w-full bg-[#12121a] border border-[#1e1e2e] rounded px-3 py-2 text-sm">
                {BACKENDS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>
            </label>
            <label className="text-xs text-slate-400">
              Tier
              <select value={tier} onChange={(e) => setTier(e.target.value as typeof tier)} className="mt-1 w-full bg-[#12121a] border border-[#1e1e2e] rounded px-3 py-2 text-sm">
                <option value="standard">Standard (CRUD)</option>
                <option value="pro">Pro (+ Node/Java)</option>
              </select>
            </label>
            <label className="text-xs text-slate-400">
              AI Mode
              <select value={aiMode} onChange={(e) => setAiMode(e.target.value as typeof aiMode)} className="mt-1 w-full bg-[#12121a] border border-[#1e1e2e] rounded px-3 py-2 text-sm">
                <option value="local">Local (Ollama)</option>
                <option value="cloud">Cloud</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </label>
            <label className="text-xs text-slate-400 col-span-2">
              Deploy target
              <select value={deployTarget} onChange={(e) => setDeployTarget(e.target.value as DeployTarget)} className="mt-1 w-full bg-[#12121a] border border-[#1e1e2e] rounded px-3 py-2 text-sm">
                {DEPLOY_TARGETS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            </label>
            <label className="text-xs text-slate-400">
              Token symbol
              <input value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())} className="mt-1 w-full bg-[#12121a] border border-[#1e1e2e] rounded px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={create} disabled={loading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium disabled:opacity-50">
              Create Project
            </button>
            {selected && (
              <button onClick={() => runPipeline(selected)} disabled={loading} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-sm font-medium disabled:opacity-50">
                Full Build + Deploy
              </button>
            )}
          </div>
        </section>

        {selected && (
          <section className="border border-[#1e1e2e] rounded-xl p-4 bg-[#12121a]">
            <h3 className="font-semibold text-indigo-300">{selected.name}</h3>
            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
              <div><span className="text-slate-500">Status</span><div>{selected.status}</div></div>
              <div><span className="text-slate-500">Backend</span><div>{selected.backend}</div></div>
              <div><span className="text-slate-500">Capsules</span><div>{selected.capsules.length}</div></div>
              <div><span className="text-slate-500">Artifacts</span><div>{selected.artifacts.length}</div></div>
              <div><span className="text-slate-500">Token</span><div>{selected.token?.symbol ?? '—'}</div></div>
              <div><span className="text-slate-500">AI</span><div>{selected.aiMode}</div></div>
            </div>
            {selected.artifacts.length > 0 && (
              <div className="mt-4">
                <div className="text-xs text-slate-500 mb-2">Generated files</div>
                <div className="max-h-40 overflow-y-auto text-[10px] font-mono space-y-1">
                  {selected.artifacts.flatMap((a) => a.files.map((f) => (
                    <div key={f.path} className="text-slate-400">{f.path} <span className="text-slate-600">({f.language})</span></div>
                  )))}
                </div>
              </div>
            )}
          </section>
        )}

        <section>
          <h3 className="text-xs text-slate-500 mb-2">Company vault (hidden imports)</h3>
          <p className="text-[10px] text-slate-600">Auth, memory, governance, crypto, WASM cortex — auto-wired into scaffolds.</p>
        </section>
      </div>

      {/* Right — log */}
      <div className="w-56 border-l border-[#1e1e2e] p-3 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 mb-2">Build log</div>
        {log.map((l, i) => <div key={i} className="text-[10px] text-slate-500 mb-1 font-mono">{l}</div>)}
      </div>
    </div>
  );
}
