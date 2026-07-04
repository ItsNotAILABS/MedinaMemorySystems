'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AppProject, AppTemplate, DeployTarget, TokenSpec } from '@/types/appBuilder';
import BuilderCodeStudio from '@/components/BuilderCodeStudio';
import BuilderGitHubPanel from '@/components/BuilderGitHubPanel';
import type { GitHubRepo } from '@/lib/githubRepos';
import BuilderGitGraph from '@/components/BuilderGitGraph';
import BuilderLiveTerminal from '@/components/BuilderLiveTerminal';
import BuilderAppPreview from '@/components/BuilderAppPreview';
import BuilderAgentPanel from '@/components/BuilderAgentPanel';

type CenterView = 'code' | 'preview' | 'github' | 'templates' | 'create';
type ActivityId = 'explorer' | 'git' | 'github' | 'deploy';

interface DeployTargetInfo {
  id: DeployTarget;
  label: string;
  category: string;
  cli: string;
}

export default function AppBuilder() {
  const [centerView, setCenterView] = useState<CenterView>('code');
  const [activity, setActivity] = useState<ActivityId>('explorer');
  const [showAgent, setShowAgent] = useState(true);
  const [showBottom, setShowBottom] = useState(true);
  const [projects, setProjects] = useState<AppProject[]>([]);
  const [templates, setTemplates] = useState<AppTemplate[]>([]);
  const [deployTargets, setDeployTargets] = useState<DeployTargetInfo[]>([]);
  const [selected, setSelected] = useState<AppProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [aiMode, setAiMode] = useState<'local' | 'cloud' | 'hybrid'>('hybrid');
  const [deployTarget, setDeployTarget] = useState<DeployTarget>('saas-vercel');
  const [tokenSymbol, setTokenSymbol] = useState('MED');
  const [log, setLog] = useState<string[]>([]);
  const [changes, setChanges] = useState<string[]>([]);
  const [githubRepo, setGithubRepo] = useState<GitHubRepo | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDir, setPreviewDir] = useState<string | null>(null);
  const [orchestrating, setOrchestrating] = useState(false);
  const sessionId = 'medina-builder';

  const pushLog = (msg: string) => setLog((l) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...l].slice(0, 50));

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
        else if (body.id) setSelected(data.data);
      } else {
        pushLog(`${action} ✗ ${data.error}`);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const create = () => api('create', { name: name || 'MyApp', templateId: templateId || undefined, aiMode, deployTarget });

  const createFromTemplate = (t: AppTemplate) => {
    setTemplateId(t.id);
    setName(t.name);
    setDeployTarget(t.deployTargets[0]);
    setCenterView('create');
  };

  const buildAndRun = async () => {
    if (!selected) {
      pushLog('Create or select a project first');
      return;
    }
    setOrchestrating(true);
    setPreviewUrl(null);
    setCenterView('preview');
    pushLog('Orchestrating: write files → npm install → npm run dev…');
    try {
      const res = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'build-and-run',
          projectId: selected.id,
          sessionId,
          shell: 'powershell',
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.previewUrl) {
        setPreviewUrl(data.data.previewUrl);
        setPreviewDir(data.data.projectDir);
        pushLog(`App live → ${data.data.previewUrl}`);
        setCenterView('preview');
      } else {
        pushLog(`Build failed: ${data.error ?? data.data?.error ?? 'unknown'}`);
      }
    } catch (e) {
      pushLog(`Orchestrate error: ${e}`);
    } finally {
      setOrchestrating(false);
    }
  };

  const askAI = async (prompt: string) => {
    if (!selected) return ['Create a project first, then ask me to build and run it.'];

    const wantsBuild = /build|run|create|deploy|launch|start|preview|app|make/i.test(prompt);
    if (wantsBuild) {
      setOrchestrating(true);
      try {
        const res = await fetch('/api/orchestrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'from-prompt',
            projectId: selected.id,
            prompt,
            sessionId,
          }),
        });
        const data = await res.json();
        if (data.success && data.data?.previewUrl) {
          setPreviewUrl(data.data.previewUrl);
          setPreviewDir(data.data.projectDir);
          setCenterView('preview');
        }
        const aiRes = await fetch('/api/builder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'ai-assist', id: selected.id, prompt }),
        });
        const aiData = await aiRes.json();
        const suggestions = aiData.data?.suggestions ?? [];
        return [
          data.data?.message ?? (data.success ? 'Build complete.' : data.error),
          ...suggestions,
        ];
      } finally {
        setOrchestrating(false);
      }
    }

    const data = await api('ai-assist', { id: selected.id, prompt });
    return data?.success ? data.data?.suggestions : undefined;
  };

  const exportToDisk = async () => {
    if (!selected) return;
    const data = await api('export-disk', { id: selected.id });
    if (data?.success) pushLog(`Exported → ${data.data?.outputDir}`);
  };

  const openRepo = (repo: GitHubRepo) => {
    setGithubRepo(repo);
    setCenterView('github');
  };

  const ACTIVITY: { id: ActivityId; icon: string; title: string }[] = [
    { id: 'explorer', icon: '📁', title: 'Explorer' },
    { id: 'git', icon: '⎇', title: 'Source Control' },
    { id: 'github', icon: '◉', title: 'GitHub' },
    { id: 'deploy', icon: '▶', title: 'Deploy' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc]">
      {/* Title bar */}
      <div className="h-9 flex items-center justify-center shrink-0 bg-[#323233] border-b border-[#2d2d2d] relative">
        <span className="text-xs text-[#cccccc]">MedinaMemorySystems</span>
        <button
          type="button"
          onClick={() => setShowAgent((s) => !s)}
          className="absolute right-3 text-[10px] px-2 py-0.5 rounded bg-[#007acc] text-white hover:bg-[#1c8ad9]"
        >
          Agents Window
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Activity bar */}
        <div className="w-12 shrink-0 flex flex-col items-center py-2 gap-1 bg-[#333333] border-r border-[#2d2d2d]">
          {ACTIVITY.map((a) => (
            <button
              key={a.id}
              type="button"
              title={a.title}
              onClick={() => {
                setActivity(a.id);
                if (a.id === 'github') setCenterView('github');
                if (a.id === 'explorer') setCenterView('code');
                if (a.id === 'deploy') setCenterView('templates');
              }}
              className={`w-10 h-10 flex items-center justify-center text-lg rounded ${
                activity === a.id ? 'text-white border-l-2 border-[#007acc]' : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            >
              {a.icon}
            </button>
          ))}
        </div>

        {/* Left sidebar */}
        <div className="w-64 shrink-0 flex flex-col border-r border-[#2d2d2d] bg-[#252526] min-h-0">
          {activity === 'explorer' && (
            <>
              <SidebarSection title="Projects">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { setSelected(p); setCenterView('code'); }}
                    className={`w-full text-left px-3 py-1 text-[11px] truncate ${
                      selected?.id === p.id ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e]'
                    }`}
                  >
                    <span className="text-[#519aba] mr-1">◇</span>{p.name}
                    <span className="text-[#858585] ml-1">· {p.status}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCenterView('create')}
                  className="w-full text-left px-3 py-1 text-[11px] text-[#007acc] hover:bg-[#2a2d2e]"
                >
                  + New Project
                </button>
              </SidebarSection>
              <SidebarSection title="Templates" collapsed>
                <div className="max-h-32 overflow-y-auto">
                  {templates.slice(0, 6).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => createFromTemplate(t)}
                      className="w-full text-left px-3 py-0.5 text-[10px] text-[#858585] hover:text-[#cccccc] truncate"
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </SidebarSection>
            </>
          )}

          {activity === 'git' && (
            <>
              <SidebarSection title={`Changes (${changes.length})`}>
                {changes.length === 0 ? (
                  <p className="px-3 text-[10px] text-[#858585]">No modified files</p>
                ) : (
                  changes.map((path) => (
                    <div key={path} className="px-3 py-0.5 text-[10px] font-mono text-[#e2c08d] truncate" title={path}>
                      M {path.split('/').pop()}
                    </div>
                  ))
                )}
              </SidebarSection>
              <SidebarSection title="Agent Review">
                <button
                  type="button"
                  className="mx-3 mb-2 w-[calc(100%-1.5rem)] py-1.5 text-[11px] bg-[#007acc] text-white rounded hover:bg-[#1c8ad9]"
                  onClick={() => { setShowAgent(true); askAI('Review my project for issues and improvements'); }}
                >
                  Find Issues
                </button>
              </SidebarSection>
              <div className="flex-1 min-h-0 border-t border-[#2d2d2d]">
                <BuilderGitGraph />
              </div>
            </>
          )}

          {activity === 'github' && (
            <SidebarSection title="ItsNotAILABS">
              <p className="px-3 text-[10px] text-[#858585] mb-2">Org repositories — click to open in center panel</p>
              <button
                type="button"
                onClick={() => { setGithubRepo(null); setCenterView('github'); }}
                className="w-full text-left px-3 py-1 text-[11px] text-[#58a6ff] hover:bg-[#2a2d2e]"
              >
                View all repositories →
              </button>
            </SidebarSection>
          )}

          {activity === 'deploy' && (
            <SidebarSection title="Deploy Targets">
              {deployTargets.slice(0, 10).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDeployTarget(d.id)}
                  className={`w-full text-left px-3 py-1 text-[10px] truncate ${
                    deployTarget === d.id ? 'bg-[#37373d]' : 'hover:bg-[#2a2d2e]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </SidebarSection>
          )}
        </div>

        {/* Center */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Center tabs */}
          <div className="flex items-center bg-[#252526] border-b border-[#2d2d2d] shrink-0">
            {([
              { id: 'code' as const, label: selected ? `Code — ${selected.name}` : 'Code Studio' },
              { id: 'preview' as const, label: previewUrl ? `Preview — ${previewUrl.replace('http://', '')}` : 'Live Preview' },
              { id: 'github' as const, label: githubRepo ? `GitHub — ${githubRepo.name}` : 'GitHub' },
              { id: 'templates' as const, label: 'Templates' },
              { id: 'create' as const, label: 'Create' },
            ]).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setCenterView(t.id)}
                className={`px-4 py-2 text-[11px] border-r border-[#2d2d2d] ${
                  centerView === t.id ? 'bg-[#1e1e1e] text-white' : 'text-[#858585] hover:text-[#cccccc]'
                }`}
              >
                {t.label}
              </button>
            ))}
            <button
              type="button"
              onClick={buildAndRun}
              disabled={orchestrating || !selected}
              className="ml-auto px-3 py-1.5 text-[10px] bg-[#238636] text-white rounded disabled:opacity-40 hover:bg-[#2ea043]"
            >
              {orchestrating ? 'Building…' : '▶ Build & Run'}
            </button>
            <button
              type="button"
              onClick={() => setShowBottom((b) => !b)}
              className="px-3 py-2 text-[10px] text-[#858585] hover:text-white"
            >
              {showBottom ? '▼' : '▲'} Terminal
            </button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            <div className={`${showBottom ? 'flex-[3]' : 'flex-1'} min-h-0 overflow-hidden`}>
              {centerView === 'code' && (
                <div className="flex h-full min-h-0">
                  <div className={previewUrl ? 'w-1/2 border-r border-[#2d2d2d]' : 'w-full'}>
                    <BuilderCodeStudio
                      projectId={selected?.id ?? null}
                      projectName={selected?.name ?? 'app'}
                      onLog={pushLog}
                      onChangesUpdate={setChanges}
                    />
                  </div>
                  {previewUrl && (
                    <div className="w-1/2">
                      <BuilderAppPreview url={previewUrl} projectDir={previewDir ?? undefined} loading={orchestrating} />
                    </div>
                  )}
                </div>
              )}
              {centerView === 'preview' && (
                <BuilderAppPreview url={previewUrl} projectDir={previewDir ?? undefined} loading={orchestrating} />
              )}
              {centerView === 'github' && (
                <BuilderGitHubPanel
                  embedded
                  selectedRepo={githubRepo}
                  onOpenRepo={openRepo}
                  onBack={() => setGithubRepo(null)}
                />
              )}
              {centerView === 'templates' && (
                <div className="h-full overflow-y-auto p-4 bg-[#1e1e1e]">
                  <h3 className="text-sm font-semibold mb-3">Template Library</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => createFromTemplate(t)}
                        className="text-left p-3 rounded border border-[#3c3c3c] bg-[#252526] hover:border-[#007acc] text-[11px]"
                      >
                        <div className="font-medium text-[#cccccc]">{t.name}</div>
                        <div className="text-[#858585] mt-1 line-clamp-2">{t.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {centerView === 'create' && (
                <div className="h-full overflow-y-auto p-6 bg-[#1e1e1e] max-w-lg">
                  <h3 className="text-sm font-semibold mb-4">Create Project</h3>
                  <div className="space-y-3 text-[11px]">
                    <label className="block">
                      <span className="text-[#858585]">App name</span>
                      <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full bg-[#3c3c3c] border border-[#3c3c3c] rounded px-2 py-1.5 text-[#cccccc] outline-none focus:border-[#007acc]" />
                    </label>
                    <label className="block">
                      <span className="text-[#858585]">Template</span>
                      <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="mt-1 w-full bg-[#3c3c3c] rounded px-2 py-1.5 outline-none">
                        <option value="">Custom</option>
                        {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </label>
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={create} disabled={loading} className="px-3 py-1.5 bg-[#007acc] rounded text-white disabled:opacity-50">Create</button>
                      {selected && (
                        <>
                          <button type="button" onClick={() => setCenterView('code')} className="px-3 py-1.5 bg-[#37373d] rounded">Open in Code Studio</button>
                      <button type="button" onClick={buildAndRun} disabled={orchestrating || !selected} className="px-3 py-1.5 bg-[#238636] rounded text-white disabled:opacity-50">Build & Run Live</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {showBottom && (
              <div className="flex-[1] min-h-[140px] max-h-[280px] border-t border-[#2d2d2d] shrink-0">
                <BuilderLiveTerminal
                  sessionId={sessionId}
                  onBuildAndRun={buildAndRun}
                  building={orchestrating}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right — Agent */}
        {showAgent && (
          <div className="w-80 shrink-0 min-h-0">
            <BuilderAgentPanel projectName={selected?.name} onAsk={askAI} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarSection({
  title,
  children,
  collapsed,
}: {
  title: string;
  children: React.ReactNode;
  collapsed?: boolean;
}) {
  return (
    <div className={`${collapsed ? '' : 'border-b border-[#2d2d2d]'}`}>
      <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#bbbbbb] flex items-center gap-1">
        <span>▼</span> {title}
      </div>
      <div className="pb-2">{children}</div>
    </div>
  );
}
