'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AppProject, AppTemplate, DeployPlan, DeployTarget, TokenSpec } from '@/types/appBuilder';

type Tab = 'templates' | 'create' | 'deploy' | 'ai';

interface DeployTargetInfo {
  id: DeployTarget;
  label: string;
  category: string;
  cli: string;
}

export default function AppBuilder() {
  const [tab, setTab] = useState<Tab>('templates');
  const [projects, setProjects] = useState<AppProject[]>([]);
  const [templates, setTemplates] = useState<AppTemplate[]>([]);
  const [deployTargets, setDeployTargets] = useState<DeployTargetInfo[]>([]);
  const [selected, setSelected] = useState<AppProject | null>(null);
  const [deployPlan, setDeployPlan] = useState<DeployPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [aiMode, setAiMode] = useState<'local' | 'cloud' | 'hybrid'>('hybrid');
  const [deployTarget, setDeployTarget] = useState<DeployTarget>('saas-vercel');
  const [tokenSymbol, setTokenSymbol] = useState('MED');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const pushLog = (msg: string) => setLog((l) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...l].slice(0, 25));

  const refresh = useCallback(async () => {
    const [pRes, tRes, mRes] = await Promise.all([
      fetch('/api/builder?action=projects'),
      fetch('/api/builder?action=templates'),
      fetch('/api/builder?action=deploy-targets'),
    ]);
    const [p, t, m] = await Promise.all([pRes.json(), tRes.json(), mRes.json()]);
    if (p.success) setProjects(p.data);
    if (t.success) setTemplates(t.data);
    if (m.success) setDeployTargets(m.data);
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
        if (data.data?.id && !body.id) setSelected(data.data);
        else if (body.id) {
          setSelected(data.data);
          if (action === 'deploy-plan' || action === 'deploy') setDeployPlan(data.data?.deployPlan ?? data.data);
        }
      } else {
        pushLog(`${action} ✗ ${data.error}`);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const createFromTemplate = (t: AppTemplate) => {
    setTemplateId(t.id);
    setName(t.name);
    setDeployTarget(t.deployTargets[0]);
    setTab('create');
  };

  const create = () => api('create', {
    name: name || 'MyApp',
    templateId: templateId || undefined,
    aiMode,
    deployTarget,
  });

  const runPipeline = async (project: AppProject) => {
    setSelected(project);
    await api('scaffold', { id: project.id });
    await api('build-capsules', { id: project.id });
    if (!project.token) {
      await api('create-token', {
        id: project.id,
        token: {
          name: `${project.name} Token`,
          symbol: tokenSymbol,
          decimals: 8,
          initialSupply: '1000000000',
          standard: deployTarget.includes('icp') ? 'ICRC-1' : 'ERC-20',
          mintable: true,
        } satisfies TokenSpec,
      });
    }
    await api('deploy-plan', { id: project.id, target: deployTarget });
    await api('deploy', { id: project.id, target: deployTarget });
  };

  const askAI = async () => {
    if (!selected || !aiPrompt.trim()) return;
    const data = await api('ai-assist', { id: selected.id, prompt: aiPrompt });
    if (data?.success && data.data?.suggestions) setAiResult(data.data.suggestions);
  };

  const copyCli = (cmd: string) => {
    navigator.clipboard?.writeText(cmd);
    pushLog(`Copied: ${cmd}`);
  };

  return (
    <div className="flex h-full bg-[#0a0a0f] text-slate-200">
      {/* Sidebar — projects */}
      <div className="w-52 border-r border-[#1e1e2e] flex flex-col shrink-0">
        <div className="p-3 border-b border-[#1e1e2e]">
          <h2 className="text-sm font-bold text-indigo-400">Medina Builder</h2>
          <p className="text-[10px] text-slate-500">Templates · CLI · Deploy</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelected(p); setDeployPlan(null); }}
              className={`w-full text-left px-2 py-2 rounded text-xs ${selected?.id === p.id ? 'bg-indigo-900/40 text-white' : 'text-slate-400 hover:bg-[#1a1a2e]'}`}
            >
              <div className="truncate font-medium">{p.name}</div>
              <div className="text-[10px] opacity-60">{p.templateId ?? p.backend} · {p.status}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-[#1e1e2e] px-4 gap-1 shrink-0">
          {(['templates', 'create', 'deploy', 'ai'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs capitalize ${tab === t ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {t === 'ai' ? 'AI Assist' : t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'templates' && (
            <section>
              <h3 className="text-lg font-semibold mb-1">Template Library</h3>
              <p className="text-xs text-slate-500 mb-4">{templates.length} built-in templates — pick one to start</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => createFromTemplate(t)}
                    className="text-left p-4 rounded-xl border border-[#1e1e2e] bg-[#12121a] hover:border-indigo-600/50 transition-colors"
                  >
                    {t.popular && <span className="text-[10px] bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full">Popular</span>}
                    <div className="font-medium text-sm mt-1">{t.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">{t.description}</div>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      <span className="text-[10px] bg-[#1a1a2e] px-2 py-0.5 rounded">{t.backend}</span>
                      <span className="text-[10px] bg-[#1a1a2e] px-2 py-0.5 rounded">{t.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {tab === 'create' && (
            <section className="max-w-xl space-y-4">
              <h3 className="text-lg font-semibold">Create Project</h3>
              <label className="block text-xs text-slate-400">
                App name
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full bg-[#12121a] border border-[#1e1e2e] rounded px-3 py-2 text-sm" />
              </label>
              <label className="block text-xs text-slate-400">
                Template
                <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="mt-1 w-full bg-[#12121a] border border-[#1e1e2e] rounded px-3 py-2 text-sm">
                  <option value="">Custom (no template)</option>
                  {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </label>
              <label className="block text-xs text-slate-400">
                AI mode
                <select value={aiMode} onChange={(e) => setAiMode(e.target.value as typeof aiMode)} className="mt-1 w-full bg-[#12121a] border border-[#1e1e2e] rounded px-3 py-2 text-sm">
                  <option value="hybrid">Hybrid (local + cloud)</option>
                  <option value="local">Local (Ollama)</option>
                  <option value="cloud">Cloud</option>
                </select>
              </label>
              <div className="flex gap-2">
                <button onClick={create} disabled={loading} className="px-4 py-2 bg-indigo-600 rounded-lg text-sm disabled:opacity-50">Create</button>
                {selected && (
                  <button onClick={() => runPipeline(selected)} disabled={loading} className="px-4 py-2 bg-emerald-700 rounded-lg text-sm disabled:opacity-50">
                    Build + Deploy
                  </button>
                )}
              </div>
            </section>
          )}

          {tab === 'deploy' && (
            <section>
              <h3 className="text-lg font-semibold mb-1">Deploy Anywhere</h3>
              <p className="text-xs text-slate-500 mb-4">medina-deploy CLI — copy command and run locally</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
                {deployTargets.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => { setDeployTarget(d.id); copyCli(d.cli); }}
                    className={`text-left p-3 rounded-lg border text-xs ${deployTarget === d.id ? 'border-indigo-500 bg-indigo-900/20' : 'border-[#1e1e2e] bg-[#12121a] hover:border-slate-600'}`}
                  >
                    <div className="text-[10px] text-slate-500">{d.category}</div>
                    <div className="font-medium">{d.label}</div>
                    <code className="text-[10px] text-indigo-300 block mt-1 truncate">{d.cli}</code>
                  </button>
                ))}
              </div>
              {selected && (
                <button
                  onClick={async () => {
                    const data = await api('deploy-plan', { id: selected.id, target: deployTarget });
                    if (data?.success) setDeployPlan(data.data);
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-slate-700 rounded-lg text-sm mb-4"
                >
                  Generate deploy plan for {selected.name}
                </button>
              )}
              {deployPlan && (
                <div className="border border-[#1e1e2e] rounded-xl p-4 bg-[#12121a] text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-indigo-300">Deploy plan: {deployPlan.target}</span>
                    <button onClick={() => copyCli(deployPlan.cliCommand)} className="text-indigo-400 hover:underline">Copy CLI</button>
                  </div>
                  <code className="block bg-[#0a0a0f] p-2 rounded font-mono text-indigo-200">{deployPlan.cliCommand}</code>
                  <div>
                    <div className="text-slate-500 mb-1">Prerequisites</div>
                    <ul className="list-disc pl-4 text-slate-400">{deployPlan.prerequisites.map((p) => <li key={p}>{p}</li>)}</ul>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Steps</div>
                    <ol className="list-decimal pl-4 text-slate-400">{deployPlan.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                  </div>
                  {deployPlan.scripts.length > 0 && (
                    <div>
                      <div className="text-slate-500 mb-1">Generated scripts</div>
                      {deployPlan.scripts.map((s) => (
                        <div key={s.name} className="flex justify-between items-center py-1">
                          <span className="font-mono text-slate-400">{s.name}</span>
                          <button onClick={() => copyCli(s.content)} className="text-[10px] text-indigo-400">Copy</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {tab === 'ai' && (
            <section className="max-w-xl space-y-4">
              <h3 className="text-lg font-semibold">MEDINA AI Assist</h3>
              <p className="text-xs text-slate-500">ULRI routing · Memory Temple · template + deploy recommendations</p>
              {!selected && <p className="text-sm text-amber-500/80">Select or create a project first</p>}
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your app: token launcher on ICP, marketplace with Python, deploy to Railway…"
                className="w-full h-24 bg-[#12121a] border border-[#1e1e2e] rounded px-3 py-2 text-sm"
              />
              <button onClick={askAI} disabled={loading || !selected} className="px-4 py-2 bg-purple-700 rounded-lg text-sm disabled:opacity-50">Ask MEDINA AI</button>
              {aiResult.length > 0 && (
                <ul className="text-xs space-y-2 text-slate-400">
                  {aiResult.map((s, i) => <li key={i} className="border-l-2 border-purple-600 pl-3">{s}</li>)}
                </ul>
              )}
            </section>
          )}

          {selected && tab !== 'deploy' && (
            <section className="mt-6 border border-[#1e1e2e] rounded-xl p-4 bg-[#12121a] text-xs">
              <div className="font-semibold text-indigo-300">{selected.name}</div>
              <div className="grid grid-cols-4 gap-2 mt-2 text-slate-400">
                <div>Status: {selected.status}</div>
                <div>Artifacts: {selected.artifacts.length}</div>
                <div>Capsules: {selected.capsules.length}</div>
                <div>Token: {selected.token?.symbol ?? '—'}</div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Log */}
      <div className="w-48 border-l border-[#1e1e2e] p-2 overflow-y-auto shrink-0">
        <div className="text-[10px] font-semibold text-slate-500 mb-2">Log</div>
        {log.map((l, i) => <div key={i} className="text-[10px] text-slate-600 font-mono mb-1">{l}</div>)}
      </div>
    </div>
  );
}
