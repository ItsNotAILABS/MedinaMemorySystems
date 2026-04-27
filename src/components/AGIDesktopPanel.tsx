'use client';

import { useState, useEffect, useCallback } from 'react';
import { cls } from '@/lib/sovereign-cls';
import type {
  AGIDesktopState,
  AGIKernelStatus,
  AGICapabilityTier,
  AGITab,
  DeployedAI,
  InternetAction,
  ModelFamily,
} from '@/types';

// ─── Constants ─────────────────────────────────────────────────────────────

const TIER_COLORS: Record<AGICapabilityTier, string> = {
  observer:   '#6b7280',
  assistant:  '#3b82f6',
  operator:   '#f59e0b',
  autonomous: '#10b981',
};

const TIER_LABELS: Record<AGICapabilityTier, string> = {
  observer:   '👁️ Observer',
  assistant:  '🤖 Assistant',
  operator:   '⚙️ Operator',
  autonomous: '🧠 Autonomous',
};

const KERNEL_COLORS: Record<AGIKernelStatus, string> = {
  booting:  '#f59e0b',
  running:  '#10b981',
  degraded: '#ef4444',
  shutdown: '#6b7280',
};

const STATUS_ICONS: Record<string, string> = {
  active:    '🟢',
  paused:    '🟡',
  stopped:   '🔴',
  deploying: '🔵',
  error:     '❌',
  loading:   '⏳',
  ready:     '✅',
  navigating: '🔄',
  closed:    '⬛',
  queued:    '📋',
  running:   '⚡',
  complete:  '✅',
  failed:    '❌',
};

const AGENT_OPTIONS: ModelFamily[] = [
  'strategist', 'builder', 'analyst', 'governance',
  'memory-curator', 'operations', 'risk', 'projection',
];

// ─── Sub-components ────────────────────────────────────────────────────────

function KernelStatusBar({ state, onBoot, onShutdown, onSetTier }: {
  state: AGIDesktopState;
  onBoot: (tier: AGICapabilityTier) => void;
  onShutdown: () => void;
  onSetTier: (tier: AGICapabilityTier) => void;
}) {
  const isRunning = state.kernelStatus === 'running';
  const color = KERNEL_COLORS[state.kernelStatus];

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#12121a] border-b border-[#1e1e2e] rounded-t-lg">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: color, boxShadow: `0 0 8px ${color}66` }} />
        <span className="text-sm font-bold text-white uppercase tracking-wider">AGI Kernel</span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: color + '22', color }}>{state.kernelStatus}</span>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {isRunning && (
          <select
            className="text-[10px] bg-[#1a1a2e] text-slate-300 border border-[#2a2a3e] rounded px-2 py-1 font-mono"
            value={state.capabilityTier}
            onChange={(e) => onSetTier(e.target.value as AGICapabilityTier)}
          >
            {Object.entries(TIER_LABELS).map(([tier, label]) => (
              <option key={tier} value={tier}>{label}</option>
            ))}
          </select>
        )}

        {!isRunning ? (
          <button onClick={() => onBoot('assistant')} className="text-[10px] px-3 py-1 rounded bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors font-mono">
            ⚡ Boot
          </button>
        ) : (
          <button onClick={onShutdown} className="text-[10px] px-3 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors font-mono">
            ⏹ Shutdown
          </button>
        )}
      </div>
    </div>
  );
}

function StatsRow({ state }: { state: AGIDesktopState }) {
  const tierColor = TIER_COLORS[state.capabilityTier];
  return (
    <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-[#0d0d14] border-b border-[#1e1e2e]">
      {[
        { label: 'Tabs', value: state.stats.totalTabs, color: '#3b82f6' },
        { label: 'AIs', value: state.stats.totalDeployedAIs, color: '#10b981' },
        { label: 'Actions', value: state.stats.totalActionsRun, color: '#f59e0b' },
        { label: 'Queued', value: state.stats.totalActionsQueued, color: '#6366f1' },
        { label: 'Extension', value: state.extension.connectionStatus === 'connected' ? '🟢' : '⚫', color: tierColor },
      ].map((s) => (
        <div key={s.label} className="text-center">
          <div className="text-xs font-bold" style={{ color: s.color }}>{s.value}</div>
          <div className="text-[9px] text-slate-500 font-mono">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function TabList({ tabs, onClose, onNavigate, onPin }: {
  tabs: AGITab[];
  onClose: (id: string) => void;
  onNavigate: (id: string, url: string) => void;
  onPin: (id: string) => void;
}) {
  const [newUrl, setNewUrl] = useState('');
  const [editingTab, setEditingTab] = useState<string | null>(null);

  return (
    <div className="space-y-1">
      {tabs.length === 0 && (
        <div className="text-xs text-slate-500 text-center py-4 font-mono">No open tabs</div>
      )}
      {tabs.map((tab) => (
        <div key={tab.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#12121a] hover:bg-[#1a1a26] transition-colors group">
          <span className="text-xs shrink-0">{STATUS_ICONS[tab.status] ?? '·'}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-white truncate">{tab.title}</div>
            <div className="text-[9px] text-slate-500 truncate font-mono">{tab.url}</div>
          </div>
          {tab.assignedAgent && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 font-mono shrink-0">{tab.assignedAgent}</span>
          )}
          {tab.pinnedByAI && <span className="text-[9px] shrink-0">📌</span>}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={() => onPin(tab.id)} className="text-[9px] px-1 py-0.5 rounded bg-[#2a2a3e] text-slate-400 hover:text-white">📌</button>
            {editingTab === tab.id ? (
              <div className="flex gap-1">
                <input
                  className="text-[9px] bg-[#1a1a2e] text-white border border-[#2a2a3e] rounded px-1 py-0.5 w-32 font-mono"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  onKeyDown={(e) => { if (e.key === 'Enter') { onNavigate(tab.id, newUrl); setEditingTab(null); setNewUrl(''); } }}
                />
                <button
                  onClick={() => { onNavigate(tab.id, newUrl); setEditingTab(null); setNewUrl(''); }}
                  className="text-[9px] px-1 py-0.5 rounded bg-blue-600/20 text-blue-400"
                >Go</button>
              </div>
            ) : (
              <button onClick={() => setEditingTab(tab.id)} className="text-[9px] px-1 py-0.5 rounded bg-[#2a2a3e] text-slate-400 hover:text-white">🔗</button>
            )}
            <button onClick={() => onClose(tab.id)} className="text-[9px] px-1 py-0.5 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DeployedAIList({ ais, onPause, onResume, onStop, onRunTask }: {
  ais: DeployedAI[];
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onStop: (id: string) => void;
  onRunTask: (id: string, task: string) => void;
}) {
  const [taskInputs, setTaskInputs] = useState<Record<string, string>>({});

  return (
    <div className="space-y-2">
      {ais.length === 0 && (
        <div className="text-xs text-slate-500 text-center py-4 font-mono">No deployed AIs</div>
      )}
      {ais.map((ai) => (
        <div key={ai.id} className="px-3 py-2 rounded-lg bg-[#12121a] border border-[#1e1e2e]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs">{STATUS_ICONS[ai.status] ?? '·'}</span>
            <span className="text-xs font-bold text-white">{ai.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-600/20 text-purple-400 font-mono">{ai.agentFamily}</span>
            <span className="text-[9px] text-slate-500 ml-auto font-mono">{ai.metrics.actionsCompleted} actions</span>
          </div>
          {ai.currentTask && (
            <div className="text-[10px] text-slate-400 truncate mb-1">📋 {ai.currentTask}</div>
          )}
          <div className="flex items-center gap-1 mt-1">
            {ai.status === 'active' && (
              <button onClick={() => onPause(ai.id)} className="text-[9px] px-2 py-0.5 rounded bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30">⏸ Pause</button>
            )}
            {ai.status === 'paused' && (
              <button onClick={() => onResume(ai.id)} className="text-[9px] px-2 py-0.5 rounded bg-green-600/20 text-green-400 hover:bg-green-600/30">▶ Resume</button>
            )}
            {(ai.status === 'active' || ai.status === 'paused') && (
              <button onClick={() => onStop(ai.id)} className="text-[9px] px-2 py-0.5 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30">⏹ Stop</button>
            )}
            {ai.status === 'active' && (
              <div className="flex gap-1 ml-auto">
                <input
                  className="text-[9px] bg-[#1a1a2e] text-white border border-[#2a2a3e] rounded px-1.5 py-0.5 w-36 font-mono"
                  placeholder="Run task..."
                  value={taskInputs[ai.id] ?? ''}
                  onChange={(e) => setTaskInputs({ ...taskInputs, [ai.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && taskInputs[ai.id]?.trim()) {
                      onRunTask(ai.id, taskInputs[ai.id].trim());
                      setTaskInputs({ ...taskInputs, [ai.id]: '' });
                    }
                  }}
                />
                <button
                  onClick={() => { if (taskInputs[ai.id]?.trim()) { onRunTask(ai.id, taskInputs[ai.id].trim()); setTaskInputs({ ...taskInputs, [ai.id]: '' }); } }}
                  className="text-[9px] px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                >▶</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionHistoryList({ actions }: { actions: InternetAction[] }) {
  return (
    <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
      {actions.length === 0 && (
        <div className="text-xs text-slate-500 text-center py-4 font-mono">No actions yet</div>
      )}
      {actions.map((action) => (
        <div key={action.id} className="flex items-start gap-2 px-3 py-1.5 rounded bg-[#12121a] hover:bg-[#1a1a26] transition-colors">
          <span className="text-[10px] shrink-0 mt-0.5">{STATUS_ICONS[action.status] ?? '·'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2a2a3e] text-slate-300">{action.type}</span>
              <span className="text-[9px] text-slate-500 font-mono">{action.agentId}</span>
            </div>
            {action.result && (
              <div className="text-[9px] text-slate-400 truncate mt-0.5">{action.result}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExtensionStatus({ state }: { state: AGIDesktopState }) {
  const ext = state.extension;
  const isConnected = ext.connectionStatus === 'connected';

  return (
    <div className="px-3 py-2 rounded-lg bg-[#12121a] border border-[#1e1e2e]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs">{isConnected ? '🟢' : '⚫'}</span>
        <span className="text-xs font-bold text-white">Browser Extension</span>
        <span className="text-[9px] text-slate-500 font-mono ml-auto">{ext.connectionStatus}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[10px] text-blue-400 font-bold">{ext.connectedTabs}</div>
          <div className="text-[8px] text-slate-500">Tabs</div>
        </div>
        <div>
          <div className="text-[10px] text-purple-400 font-bold">{ext.activePanel}</div>
          <div className="text-[8px] text-slate-500">Panel</div>
        </div>
        <div>
          <div className="text-[10px] text-emerald-400 font-bold">{ext.messageLog.length}</div>
          <div className="text-[8px] text-slate-500">Messages</div>
        </div>
      </div>
      {ext.currentPageUrl && (
        <div className="text-[9px] text-slate-400 truncate mt-2 font-mono">
          📄 {ext.currentPageTitle ?? ext.currentPageUrl}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

type Tab = 'overview' | 'tabs' | 'ais' | 'actions' | 'extension';

export default function AGIDesktopPanel() {
  const [state, setState] = useState<AGIDesktopState | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);
  const [newTabUrl, setNewTabUrl] = useState('');
  const [newTabAgent, setNewTabAgent] = useState<ModelFamily | ''>('');
  const [taskInput, setTaskInput] = useState('');
  const [deployName, setDeployName] = useState('');
  const [deployFamily, setDeployFamily] = useState<ModelFamily>('operations');
  const [deployTask, setDeployTask] = useState('');

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/agi?action=state');
      const data = await res.json();
      if (data.success) setState(data.data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [fetchState]);

  const [error, setError] = useState<string | null>(null);

  const apiPost = async (endpoint: string, body: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? 'Request failed');
      }
      await fetchState();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const bootKernel = (tier: AGICapabilityTier) => apiPost('/api/agi', { action: 'boot', tier });
  const shutdownKernel = () => apiPost('/api/agi', { action: 'shutdown' });
  const setTier = (tier: AGICapabilityTier) => apiPost('/api/agi', { action: 'set-tier', tier });

  const openTab = () => {
    if (!newTabUrl.trim()) return;
    const body: Record<string, unknown> = { action: 'open-tab', url: newTabUrl.trim() };
    if (newTabAgent) body.agent = newTabAgent;
    apiPost('/api/desktop', body);
    setNewTabUrl('');
    setNewTabAgent('');
  };
  const closeTab = (tabId: string) => apiPost('/api/desktop', { action: 'close-tab', tabId });
  const navigateTab = (tabId: string, url: string) => apiPost('/api/desktop', { action: 'navigate-tab', tabId, url });
  const pinTab = (tabId: string) => apiPost('/api/desktop', { action: 'pin-tab', tabId });

  const deployAI = () => {
    if (!deployName.trim()) return;
    apiPost('/api/desktop', {
      action: 'deploy-ai',
      name: deployName.trim(),
      agentFamily: deployFamily,
      capabilities: ['internet-control', 'tab-management', 'data-extraction'],
      initialTask: deployTask.trim() || undefined,
    });
    setDeployName('');
    setDeployTask('');
  };
  const pauseAI = (aiId: string) => apiPost('/api/desktop', { action: 'pause-ai', aiId });
  const resumeAI = (aiId: string) => apiPost('/api/desktop', { action: 'resume-ai', aiId });
  const stopAI = (aiId: string) => apiPost('/api/desktop', { action: 'stop-ai', aiId });
  const runTask = (aiId: string, task: string) => apiPost('/api/desktop', { action: 'run-task', aiId, task });

  const executeAGITask = () => {
    if (!taskInput.trim()) return;
    apiPost('/api/agi', { action: 'execute', task: taskInput.trim() });
    setTaskInput('');
  };

  if (!state) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-sm font-mono">
        Loading AGI Desktop...
      </div>
    );
  }

  const isRunning = state.kernelStatus === 'running';

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '🖥️' },
    { id: 'tabs', label: 'Tabs', icon: '🌐' },
    { id: 'ais', label: 'AIs', icon: '🤖' },
    { id: 'actions', label: 'Actions', icon: '⚡' },
    { id: 'extension', label: 'Extension', icon: '🧩' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-white">
      <KernelStatusBar state={state} onBoot={bootKernel} onShutdown={shutdownKernel} onSetTier={setTier} />
      <StatsRow state={state} />

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border-b border-red-800/30 text-red-400 text-xs font-mono">
          <span>❌ {error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-300">✕</button>
        </div>
      )}

      {/* AGI Task Input */}
      {isRunning && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0d0d14] border-b border-[#1e1e2e]">
          <input
            className="flex-1 text-xs bg-[#1a1a2e] text-white border border-[#2a2a3e] rounded-lg px-3 py-2 font-mono placeholder-slate-600"
            placeholder="Describe a task for the AGI (opens tabs, deploys AI, executes actions)..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') executeAGITask(); }}
          />
          <button
            onClick={executeAGITask}
            disabled={loading || !taskInput.trim()}
            className={cls(
              'text-xs px-4 py-2 rounded-lg font-mono transition-colors',
              taskInput.trim()
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                : 'bg-[#2a2a3e] text-slate-600 cursor-not-allowed',
            )}
          >
            {loading ? '⏳' : '🚀'} Execute
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 px-4 py-2 border-b border-[#1e1e2e]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cls(
              'text-[10px] px-3 py-1.5 rounded-lg font-mono transition-colors',
              activeTab === tab.id
                ? 'bg-[#1a1a2e] text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-[#1a1a26]',
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar">
        {activeTab === 'overview' && (
          <>
            <SectionHeader title="Browser Tabs" count={state.tabs.length} />
            <TabList tabs={state.tabs.slice(0, 5)} onClose={closeTab} onNavigate={navigateTab} onPin={pinTab} />
            <SectionHeader title="Deployed AIs" count={state.deployedAIs.length} />
            <DeployedAIList ais={state.deployedAIs.slice(0, 3)} onPause={pauseAI} onResume={resumeAI} onStop={stopAI} onRunTask={runTask} />
            <SectionHeader title="Extension" />
            <ExtensionStatus state={state} />
          </>
        )}

        {activeTab === 'tabs' && (
          <>
            {isRunning && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#12121a] border border-[#1e1e2e]">
                <input
                  className="flex-1 text-[10px] bg-[#1a1a2e] text-white border border-[#2a2a3e] rounded px-2 py-1.5 font-mono"
                  placeholder="https://..."
                  value={newTabUrl}
                  onChange={(e) => setNewTabUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') openTab(); }}
                />
                <select
                  className="text-[10px] bg-[#1a1a2e] text-slate-300 border border-[#2a2a3e] rounded px-1 py-1.5 font-mono"
                  value={newTabAgent}
                  onChange={(e) => setNewTabAgent(e.target.value as ModelFamily | '')}
                >
                  <option value="">No agent</option>
                  {AGENT_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
                <button onClick={openTab} className="text-[10px] px-3 py-1.5 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 font-mono">+ Open</button>
              </div>
            )}
            <TabList tabs={state.tabs} onClose={closeTab} onNavigate={navigateTab} onPin={pinTab} />
          </>
        )}

        {activeTab === 'ais' && (
          <>
            {isRunning && (
              <div className="p-3 rounded-lg bg-[#12121a] border border-[#1e1e2e] space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 text-[10px] bg-[#1a1a2e] text-white border border-[#2a2a3e] rounded px-2 py-1.5 font-mono"
                    placeholder="AI name..."
                    value={deployName}
                    onChange={(e) => setDeployName(e.target.value)}
                  />
                  <select
                    className="text-[10px] bg-[#1a1a2e] text-slate-300 border border-[#2a2a3e] rounded px-1 py-1.5 font-mono"
                    value={deployFamily}
                    onChange={(e) => setDeployFamily(e.target.value as ModelFamily)}
                  >
                    {AGENT_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 text-[10px] bg-[#1a1a2e] text-white border border-[#2a2a3e] rounded px-2 py-1.5 font-mono"
                    placeholder="Initial task (optional)..."
                    value={deployTask}
                    onChange={(e) => setDeployTask(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') deployAI(); }}
                  />
                  <button onClick={deployAI} disabled={!deployName.trim()} className="text-[10px] px-3 py-1.5 rounded bg-green-600/20 text-green-400 hover:bg-green-600/30 font-mono">🚀 Deploy</button>
                </div>
              </div>
            )}
            <DeployedAIList ais={state.deployedAIs} onPause={pauseAI} onResume={resumeAI} onStop={stopAI} onRunTask={runTask} />
          </>
        )}

        {activeTab === 'actions' && (
          <ActionHistoryList actions={state.actionQueue.length > 0
            ? [...state.actionQueue, ...(state.deployedAIs.flatMap((ai) => ai.actionHistory).slice(-30))]
            : state.deployedAIs.flatMap((ai) => ai.actionHistory).slice(-50)
          } />
        )}

        {activeTab === 'extension' && (
          <ExtensionStatus state={state} />
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
      {count !== undefined && (
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#2a2a3e] text-slate-500 font-mono">{count}</span>
      )}
      <div className="flex-1 border-t border-[#1e1e2e]" />
    </div>
  );
}
