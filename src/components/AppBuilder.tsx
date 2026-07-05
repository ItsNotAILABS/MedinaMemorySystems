'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AppProject, AppTemplate, DeployTarget } from '@/types/appBuilder';
import type { StudioCapabilities } from '@/lib/studioCapabilities';
import { SERVER_MODE_HINT } from '@/lib/studioCapabilities';
import BuilderCodeStudio from '@/components/BuilderCodeStudio';
import BuilderGitHubPanel from '@/components/BuilderGitHubPanel';
import type { GitHubRepo } from '@/lib/githubRepos';
import BuilderGitGraph from '@/components/BuilderGitGraph';
import BuilderLiveTerminal from '@/components/BuilderLiveTerminal';
import BuilderAppPreview from '@/components/BuilderAppPreview';
import BuilderAgentPanel from '@/components/BuilderAgentPanel';
import BuilderTitleBar from '@/components/builder/BuilderTitleBar';
import BuilderStatusBar from '@/components/builder/BuilderStatusBar';
import {
  IconFiles, IconGit, IconGithub, IconRocket, IconCode, IconGlobe, IconPlus, IconPlay, IconChevronDown,
} from '@/components/builder/BuilderIcons';

type CenterView = 'code' | 'preview' | 'github' | 'templates' | 'create';
type ActivityId = 'explorer' | 'git' | 'github' | 'deploy';
type ShellKind = 'powershell' | 'wsl' | 'bash';

interface DeployTargetInfo {
  id: DeployTarget;
  label: string;
  category: string;
  cli: string;
}

function defaultShell(): ShellKind {
  if (typeof window !== 'undefined' && navigator.userAgent.includes('Windows')) return 'powershell';
  return 'bash';
}

export default function AppBuilder() {
  const [centerView, setCenterView] = useState<CenterView>('code');
  const [activity, setActivity] = useState<ActivityId>('explorer');
  const [showAgent, setShowAgent] = useState(true);
  const [showBottom, setShowBottom] = useState(true);
  const [projects, setProjects] = useState<AppProject[]>([]);
  const [templates, setTemplates] = useState<AppTemplate[]>([]);
  const [deployTargets, setDeployTargets] = useState<DeployTargetInfo[]>([]);
  const [capabilities, setCapabilities] = useState<StudioCapabilities | null>(null);
  const [selected, setSelected] = useState<AppProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [aiMode, setAiMode] = useState<'local' | 'cloud' | 'hybrid'>('hybrid');
  const [deployTarget, setDeployTarget] = useState<DeployTarget>('saas-vercel');
  const [deployPlan, setDeployPlan] = useState<{ steps?: string[]; commands?: string[] } | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState('MED');
  const [log, setLog] = useState<string[]>([]);
  const [changes, setChanges] = useState<string[]>([]);
  const [githubRepo, setGithubRepo] = useState<GitHubRepo | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDir, setPreviewDir] = useState<string | null>(null);
  const [orchestrating, setOrchestrating] = useState(false);
  const [shell, setShell] = useState<ShellKind>(defaultShell);
  const sessionId = 'medina-builder';

  const pushLog = (msg: string) => setLog((l) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...l].slice(0, 50));

  const applyBuildResult = (data: { previewUrl?: string; projectDir?: string; project?: AppProject; error?: string }) => {
    if (data.project) setSelected(data.project);
    if (data.previewUrl) {
      setPreviewUrl(data.previewUrl);
      setPreviewDir(data.projectDir ?? null);
      setCenterView('preview');
    }
  };

  const refresh = useCallback(async () => {
    const [pRes, tRes, mRes, cRes] = await Promise.all([
      fetch('/api/builder?action=projects'),
      fetch('/api/builder?action=templates'),
      fetch('/api/builder?action=deploy-targets'),
      fetch('/api/builder?action=capabilities'),
    ]);
    const [p, t, m, c] = await Promise.all([pRes.json(), tRes.json(), mRes.json(), cRes.json()]);
    if (p.success) setProjects(p.data);
    if (t.success) setTemplates(t.data);
    if (m.success) setDeployTargets(m.data);
    if (c.success) setCapabilities(c.data);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const loadDeployPlan = useCallback(async (projectId: string, target: DeployTarget) => {
    const res = await fetch(`/api/builder?action=deploy-plan&id=${projectId}&target=${target}`);
    const data = await res.json();
    if (data.success) setDeployPlan(data.data);
  }, []);

  useEffect(() => {
    if (selected && activity === 'deploy') loadDeployPlan(selected.id, deployTarget);
  }, [selected, deployTarget, activity, loadDeployPlan]);

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
        else if (body.id && data.data && !data.data.previewUrl) setSelected(data.data);
      } else {
        pushLog(`${action} ✗ ${data.error ?? data.hint ?? 'failed'}`);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const create = () => api('create', { name: name || 'MyApp', templateId: templateId || undefined, aiMode, deployTarget });

  const createAndRun = async (opts: { name: string; templateId?: string; deployTarget?: DeployTarget }) => {
    if (!capabilities?.serverMode) {
      pushLog(`Server mode required — ${SERVER_MODE_HINT}`);
      return;
    }
    setOrchestrating(true);
    setPreviewUrl(null);
    setCenterView('preview');
    pushLog(`Creating ${opts.name} → build & run…`);
    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-and-run',
          name: opts.name,
          templateId: opts.templateId,
          deployTarget: opts.deployTarget ?? deployTarget,
          aiMode,
          sessionId,
          shell,
        }),
      });
      const data = await res.json();
      if (data.success) {
        applyBuildResult({ ...data.data, project: data.data?.project });
        pushLog(`Live → ${data.data?.previewUrl ?? 'built'}`);
        await refresh();
      } else {
        pushLog(`Failed: ${data.error ?? 'unknown'}`);
      }
    } catch (e) {
      pushLog(`Create error: ${e}`);
    } finally {
      setOrchestrating(false);
    }
  };

  const createFromTemplate = (t: AppTemplate) => createAndRun({ name: t.name, templateId: t.id, deployTarget: t.deployTargets[0] });

  const buildAndRun = async () => {
    if (!selected) {
      pushLog('Create or select a project first');
      return;
    }
    if (!capabilities?.serverMode) {
      pushLog(`Server mode required — ${SERVER_MODE_HINT}`);
      return;
    }
    setOrchestrating(true);
    setPreviewUrl(null);
    setCenterView('preview');
    pushLog('Orchestrating: write files → npm install → npm run dev…');
    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'build-and-run', id: selected.id, sessionId, shell }),
      });
      const data = await res.json();
      if (data.success && data.data?.previewUrl) {
        applyBuildResult(data.data);
        pushLog(`App live → ${data.data.previewUrl}`);
      } else {
        pushLog(`Build failed: ${data.error ?? data.data?.error ?? 'unknown'}`);
      }
    } catch (e) {
      pushLog(`Build error: ${e}`);
    } finally {
      setOrchestrating(false);
    }
  };

  const askAI = async (prompt: string) => {
    if (!selected) return ['Create a project first, then ask me to build and run it.'];

    const wantsBuild = /build|run|create|deploy|launch|start|preview|app|make/i.test(prompt);
    if (wantsBuild && capabilities?.serverMode) {
      setOrchestrating(true);
      try {
        const res = await fetch('/api/builder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'from-prompt', id: selected.id, prompt, sessionId, shell }),
        });
        const data = await res.json();
        if (data.success && data.data?.previewUrl) {
          applyBuildResult(data.data);
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

  const attachDeployScripts = async () => {
    if (!selected) return;
    await api('attach-scripts', { id: selected.id, target: deployTarget });
  };

  const runDeploy = async () => {
    if (!selected) return;
    const data = await api('deploy', { id: selected.id, target: deployTarget });
    if (data?.success) pushLog(`Deploy queued → ${deployTarget}`);
  };

  const openRepo = (repo: GitHubRepo) => {
    setGithubRepo(repo);
    setCenterView('github');
  };

  const shellLabel = shell === 'powershell' ? 'PowerShell' : shell === 'wsl' ? 'WSL' : 'bash';

  const ACTIVITY: { id: ActivityId; Icon: typeof IconFiles; title: string }[] = [
    { id: 'explorer', Icon: IconFiles, title: 'Explorer' },
    { id: 'git', Icon: IconGit, title: 'Source Control' },
    { id: 'github', Icon: IconGithub, title: 'GitHub' },
    { id: 'deploy', Icon: IconRocket, title: 'Deploy' },
  ];

  return (
    <div className="mb-shell flex flex-col h-full">
      <BuilderTitleBar
        title={selected?.name ?? 'MedinaMemorySystems'}
        onToggleAgent={() => setShowAgent((s) => !s)}
        agentOpen={showAgent}
      />

      {capabilities && !capabilities.serverMode && (
        <div
          className="shrink-0 px-4 py-2 text-[12px] border-b"
          style={{ background: '#3d2e00', borderColor: '#5c4a00', color: '#f0c040' }}
        >
          Static mode — terminal, live preview, and disk export need server mode. {SERVER_MODE_HINT}
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* Activity bar */}
        <nav
          className="shrink-0 flex flex-col items-center py-2 border-r"
          style={{ width: 'var(--mb-activity-w)', background: 'var(--mb-bg-base)', borderColor: 'var(--mb-border)' }}
        >
          {ACTIVITY.map(({ id, Icon, title }) => (
            <button
              key={id}
              type="button"
              title={title}
              onClick={() => {
                setActivity(id);
                if (id === 'github') setCenterView('github');
                if (id === 'explorer') setCenterView('code');
                if (id === 'deploy') setCenterView('templates');
              }}
              className={`mb-activity-btn ${activity === id ? 'mb-activity-btn-active' : ''}`}
            >
              <Icon size={20} />
            </button>
          ))}
        </nav>

        {/* Sidebar */}
        <aside
          className="shrink-0 flex flex-col min-h-0 border-r overflow-hidden"
          style={{ width: 'var(--mb-sidebar-w)', background: 'var(--mb-bg-surface)', borderColor: 'var(--mb-border)' }}
        >
          {activity === 'explorer' && (
            <>
              <SidebarSection title="Projects">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { setSelected(p); setCenterView('code'); }}
                    className="w-full text-left px-3 py-1.5 text-[12px] truncate transition-colors"
                    style={{
                      color: selected?.id === p.id ? 'var(--mb-text-primary)' : 'var(--mb-text-muted)',
                      background: selected?.id === p.id ? 'var(--mb-bg-active)' : 'transparent',
                    }}
                  >
                    {p.name}
                    <span className="ml-1 text-[10px]" style={{ color: 'var(--mb-text-faint)' }}>{p.status}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCenterView('create')}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] transition-colors"
                  style={{ color: 'var(--mb-accent)' }}
                >
                  <IconPlus size={12} /> New Project
                </button>
              </SidebarSection>
              <SidebarSection title="Quick Start">
                <div className="max-h-36 overflow-y-auto">
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
                  className="mx-3 mb-2 w-[calc(100%-1.5rem)] mb-btn mb-btn-primary text-[11px] justify-center"
                  onClick={() => { setShowAgent(true); askAI('Review my project for issues and improvements'); }}
                >
                  Find Issues
                </button>
              </SidebarSection>
              <div className="flex-1 min-h-0 border-t" style={{ borderColor: 'var(--mb-border)' }}>
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
            <>
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
              {selected && deployPlan && (
                <SidebarSection title="Deploy Plan">
                  <div className="px-3 space-y-2">
                    {(deployPlan.steps ?? deployPlan.commands ?? []).slice(0, 5).map((step, i) => (
                      <div key={i} className="text-[10px] font-mono text-[#858585] truncate" title={step}>
                        {i + 1}. {step}
                      </div>
                    ))}
                    <div className="flex flex-col gap-1 pt-1">
                      <button type="button" onClick={attachDeployScripts} disabled={loading} className="mb-btn mb-btn-ghost text-[10px] justify-center">
                        Attach Scripts
                      </button>
                      <button type="button" onClick={exportToDisk} disabled={loading} className="mb-btn mb-btn-ghost text-[10px] justify-center">
                        Export to Disk
                      </button>
                      <button type="button" onClick={runDeploy} disabled={loading} className="mb-btn mb-btn-primary text-[10px] justify-center">
                        Deploy
                      </button>
                    </div>
                  </div>
                </SidebarSection>
              )}
              {!selected && (
                <p className="px-3 text-[10px] text-[#858585]">Select a project to deploy</p>
              )}
            </>
          )}
        </aside>

        {/* Workspace */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0" style={{ background: 'var(--mb-bg-panel)' }}>
          {/* Tab bar */}
          <div className="flex items-center shrink-0 border-b" style={{ borderColor: 'var(--mb-border)', background: 'var(--mb-bg-surface)' }}>
            {([
              { id: 'code' as const, label: selected?.name ?? 'Editor', icon: IconCode },
              { id: 'preview' as const, label: 'Preview', icon: IconGlobe },
              { id: 'github' as const, label: githubRepo?.name ?? 'GitHub', icon: IconGithub },
              { id: 'templates' as const, label: 'Templates', icon: IconFiles },
              { id: 'create' as const, label: 'New', icon: IconPlus },
            ]).map(({ id, label, icon: TabIcon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setCenterView(id)}
                className={`mb-tab ${centerView === id ? 'mb-tab-active' : ''}`}
              >
                <TabIcon size={13} />
                {label}
              </button>
            ))}
            <div className="flex-1" />
            <button
              type="button"
              onClick={buildAndRun}
              disabled={orchestrating || !selected}
              className="mb-btn mb-btn-success text-[11px] mx-2 my-1"
            >
              <IconPlay size={12} />
              {orchestrating ? 'Building…' : 'Build & Run'}
            </button>
            <button
              type="button"
              onClick={() => setShowBottom((b) => !b)}
              className="mb-btn mb-btn-ghost text-[10px] mx-2 my-1 border-0"
            >
              <IconChevronDown size={12} className={showBottom ? '' : 'rotate-180'} />
              Terminal
            </button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            <div className={`${showBottom ? 'flex-[3]' : 'flex-1'} min-h-0 overflow-hidden`}>
              {centerView === 'code' && (
                <div className="flex h-full min-h-0">
                  <div className={previewUrl ? 'w-1/2 border-r' : 'w-full'} style={{ borderColor: 'var(--mb-border)' }}>
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
                <div className="h-full overflow-y-auto p-6">
                  <h3 className="text-[15px] font-semibold mb-1" style={{ color: 'var(--mb-text-primary)' }}>Template Library</h3>
                  <p className="text-[12px] mb-5" style={{ color: 'var(--mb-text-muted)' }}>{templates.length} production-ready scaffolds</p>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => createFromTemplate(t)}
                        className="text-left p-4 rounded-xl transition-all hover:scale-[1.01]"
                        style={{
                          background: 'var(--mb-bg-elevated)',
                          border: '1px solid var(--mb-border)',
                        }}
                      >
                        {t.popular && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium mb-2 inline-block" style={{ background: 'var(--mb-accent-muted)', color: 'var(--mb-accent)' }}>
                            Popular
                          </span>
                        )}
                        <div className="text-[13px] font-medium" style={{ color: 'var(--mb-text-primary)' }}>{t.name}</div>
                        <div className="text-[11px] mt-1.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--mb-text-muted)' }}>{t.description}</div>
                        <div className="flex gap-1.5 mt-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: 'var(--mb-bg-active)', color: 'var(--mb-text-secondary)' }}>{t.backend}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: 'var(--mb-bg-active)', color: 'var(--mb-text-secondary)' }}>{t.category}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {centerView === 'create' && (
                <div className="h-full overflow-y-auto p-8 max-w-md mx-auto">
                  <h3 className="text-[18px] font-semibold mb-1" style={{ color: 'var(--mb-text-primary)' }}>New Project</h3>
                  <p className="text-[13px] mb-6" style={{ color: 'var(--mb-text-muted)' }}>Scaffold a real app — build, run, preview in one click</p>
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-[12px] font-medium" style={{ color: 'var(--mb-text-secondary)' }}>App name</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1.5 w-full rounded-lg px-3 py-2.5 text-[13px] outline-none transition-colors focus:ring-2"
                        style={{ background: 'var(--mb-bg-input)', border: '1px solid var(--mb-border)', color: 'var(--mb-text-primary)' }}
                      />
                    </label>
                    <label className="block">
                      <span className="text-[12px] font-medium" style={{ color: 'var(--mb-text-secondary)' }}>Template</span>
                      <select
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                        className="mt-1.5 w-full rounded-lg px-3 py-2.5 text-[13px] outline-none"
                        style={{ background: 'var(--mb-bg-input)', border: '1px solid var(--mb-border)', color: 'var(--mb-text-primary)' }}
                      >
                        <option value="">Custom scaffold</option>
                        {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </label>
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={create} disabled={loading} className="mb-btn mb-btn-primary flex-1 justify-center">Create</button>
                      <button
                        type="button"
                        onClick={() => createAndRun({ name: name || 'MyApp', templateId: templateId || undefined, deployTarget })}
                        disabled={orchestrating || !capabilities?.serverMode}
                        className="mb-btn mb-btn-success flex-1 justify-center"
                      >
                        <IconPlay size={12} /> Create & Run
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {showBottom && (
              <div
                className="shrink-0 border-t"
                style={{ minHeight: 'var(--mb-terminal-min)', maxHeight: 280, borderColor: 'var(--mb-border)' }}
              >
                <BuilderLiveTerminal
                  sessionId={sessionId}
                  shell={shell}
                  onShellChange={setShell}
                  onBuildAndRun={buildAndRun}
                  building={orchestrating}
                />
              </div>
            )}
          </div>
        </div>

        {showAgent && (
          <BuilderAgentPanel projectName={selected?.name} onAsk={askAI} loading={loading || orchestrating} />
        )}
      </div>

      <BuilderStatusBar
        project={selected?.name}
        previewUrl={previewUrl}
        orchestrating={orchestrating}
        shell={shellLabel}
      />
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b" style={{ borderColor: 'var(--mb-border)' }}>
      <div className="mb-panel-header">
        <IconChevronDown size={10} />
        {title}
      </div>
      <div className="pb-2">{children}</div>
    </div>
  );
}
