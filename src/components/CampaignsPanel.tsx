'use client';

import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import type { Campaign, CampaignMetrics } from '@/types';

interface CampaignsPanelState {
  campaigns: Campaign[];
  templates: { id: string; name: string; type: Campaign['type']; description: string }[];
  stats: {
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    totalReach: number;
    totalImpressions: number;
    totalConversions: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export default function CampaignsPanel() {
  const [state, setState] = useState<CampaignsPanelState>({
    campaigns: [],
    templates: [],
    stats: null,
    loading: true,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'templates' | 'stats'>('list');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'content' as Campaign['type'],
    templateId: '',
  });

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [campaignsRes, templatesRes, statsRes] = await Promise.all([
        fetch('/api/campaign?action=list'),
        fetch('/api/campaign?action=templates'),
        fetch('/api/campaign?action=stats'),
      ]);

      const campaignsData = await campaignsRes.json() as { campaigns?: Campaign[] };
      const templatesData = await templatesRes.json() as { templates?: CampaignsPanelState['templates'] };
      const statsData = await statsRes.json() as { stats?: CampaignsPanelState['stats'] };

      setState({
        campaigns: campaignsData.campaigns || [],
        templates: templatesData.templates || [],
        stats: statsData.stats || null,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: String(err),
      }));
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleCreate = async (fromTemplate: boolean = false) => {
    if (!newCampaign.name.trim()) return;

    try {
      const body = fromTemplate && newCampaign.templateId
        ? { action: 'create-from-template', templateId: newCampaign.templateId, name: newCampaign.name }
        : { action: 'create', name: newCampaign.name, type: newCampaign.type };

      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setNewCampaign({ name: '', type: 'content', templateId: '' });
        setActiveTab('list');
        void loadData();
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: String(err) }));
    }
  };

  const handleLaunch = async (campaignId: string) => {
    try {
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'launch', id: campaignId }),
      });

      if (res.ok) {
        void loadData();
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: String(err) }));
    }
  };

  const handlePause = async (campaignId: string) => {
    try {
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pause', id: campaignId }),
      });

      if (res.ok) {
        void loadData();
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: String(err) }));
    }
  };

  const handleComplete = async (campaignId: string) => {
    try {
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete', id: campaignId }),
      });

      if (res.ok) {
        void loadData();
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: String(err) }));
    }
  };

  const handleSimulateMetrics = async (campaignId: string) => {
    try {
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate-metrics', campaignId }),
      });

      if (res.ok) {
        void loadData();
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: String(err) }));
    }
  };

  const handleDelete = async (campaignId: string) => {
    try {
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: campaignId }),
      });

      if (res.ok) {
        void loadData();
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: String(err) }));
    }
  };

  const statusColors: Record<string, string> = {
    draft: 'text-slate-400 bg-slate-400/10',
    active: 'text-green-400 bg-green-400/10',
    paused: 'text-amber-400 bg-amber-400/10',
    completed: 'text-blue-400 bg-blue-400/10',
  };

  const typeColors: Record<string, string> = {
    email: 'text-sky-400',
    social: 'text-purple-400',
    content: 'text-green-400',
    advertising: 'text-orange-400',
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d15]">
        <div className="flex items-center gap-2">
          <span className="text-orange-400 text-lg">📢</span>
          <h1 className="text-sm font-semibold text-slate-200">Campaigns</h1>
          <span className="text-xs text-slate-500">Create & Manage</span>
        </div>
        <button
          onClick={() => void loadData()}
          className="px-3 py-1.5 text-xs bg-[#1e1e2e] text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1e1e2e] bg-[#0d0d15]">
        {(['list', 'create', 'templates', 'stats'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'flex-1 px-4 py-2 text-xs font-medium transition-colors',
              activeTab === tab
                ? 'text-orange-400 border-b-2 border-orange-400'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {state.loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-slate-500">Loading...</span>
          </div>
        ) : state.error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <span className="text-red-400 text-sm">{state.error}</span>
          </div>
        ) : (
          <>
            {/* List Tab */}
            {activeTab === 'list' && (
              <div className="space-y-3">
                {state.campaigns.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    No campaigns yet.{' '}
                    <button
                      onClick={() => setActiveTab('create')}
                      className="text-orange-400 hover:underline"
                    >
                      Create one
                    </button>
                  </div>
                ) : (
                  state.campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={clsx('text-xs font-medium', typeColors[campaign.type])}>
                          {campaign.type.toUpperCase()}
                        </span>
                        <span className={clsx('text-xs px-2 py-0.5 rounded', statusColors[campaign.status])}>
                          {campaign.status}
                        </span>
                      </div>
                      <div className="text-sm text-slate-200 font-medium mb-2">{campaign.name}</div>
                      
                      {/* Metrics */}
                      {campaign.metrics && (
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          <div className="bg-[#0a0a0f] rounded p-2 text-center">
                            <div className="text-lg text-slate-200 font-mono">{campaign.metrics.impressions.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-500">Impressions</div>
                          </div>
                          <div className="bg-[#0a0a0f] rounded p-2 text-center">
                            <div className="text-lg text-slate-200 font-mono">{campaign.metrics.clicks.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-500">Clicks</div>
                          </div>
                          <div className="bg-[#0a0a0f] rounded p-2 text-center">
                            <div className="text-lg text-slate-200 font-mono">{campaign.metrics.conversions.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-500">Conversions</div>
                          </div>
                          <div className="bg-[#0a0a0f] rounded p-2 text-center">
                            <div className="text-lg text-slate-200 font-mono">{campaign.metrics.engagement.toFixed(1)}%</div>
                            <div className="text-[10px] text-slate-500">Engagement</div>
                          </div>
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex gap-4 text-xs text-slate-500 mb-3">
                        <span>{campaign.targets.length} targets</span>
                        <span>{campaign.content.length} content items</span>
                        <span>Est. reach: {campaign.targets.reduce((sum, t) => sum + t.estimatedReach, 0).toLocaleString()}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {campaign.status === 'draft' && (
                          <>
                            <button
                              onClick={() => void handleLaunch(campaign.id)}
                              className="px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded hover:bg-green-600/30 transition-colors"
                            >
                              Launch
                            </button>
                            <button
                              onClick={() => void handleDelete(campaign.id)}
                              className="px-3 py-1 bg-red-600/20 text-red-400 text-xs rounded hover:bg-red-600/30 transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {campaign.status === 'active' && (
                          <>
                            <button
                              onClick={() => void handleSimulateMetrics(campaign.id)}
                              className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded hover:bg-blue-600/30 transition-colors"
                            >
                              Simulate
                            </button>
                            <button
                              onClick={() => void handlePause(campaign.id)}
                              className="px-3 py-1 bg-amber-600/20 text-amber-400 text-xs rounded hover:bg-amber-600/30 transition-colors"
                            >
                              Pause
                            </button>
                            <button
                              onClick={() => void handleComplete(campaign.id)}
                              className="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs rounded hover:bg-purple-600/30 transition-colors"
                            >
                              Complete
                            </button>
                          </>
                        )}
                        {campaign.status === 'paused' && (
                          <>
                            <button
                              onClick={() => void handleLaunch(campaign.id)}
                              className="px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded hover:bg-green-600/30 transition-colors"
                            >
                              Resume
                            </button>
                            <button
                              onClick={() => void handleComplete(campaign.id)}
                              className="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs rounded hover:bg-purple-600/30 transition-colors"
                            >
                              Complete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Create Tab */}
            {activeTab === 'create' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Campaign Name</label>
                  <input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter campaign name"
                    className="w-full px-3 py-2 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Type</label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, type: e.target.value as Campaign['type'] }))}
                    className="w-full px-3 py-2 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 outline-none focus:border-orange-500"
                  >
                    <option value="email">Email</option>
                    <option value="social">Social</option>
                    <option value="content">Content</option>
                    <option value="advertising">Advertising</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => void handleCreate(false)}
                    disabled={!newCampaign.name.trim()}
                    className={clsx(
                      'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      newCampaign.name.trim()
                        ? 'bg-orange-600 hover:bg-orange-500 text-white'
                        : 'bg-[#1e1e2e] text-slate-600 cursor-not-allowed'
                    )}
                  >
                    Create Campaign
                  </button>
                </div>
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-3">
                {state.templates.map((template) => (
                  <div key={template.id} className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-200 font-medium">{template.name}</span>
                      <span className={clsx('text-xs', typeColors[template.type])}>{template.type}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{template.description}</p>
                    <button
                      onClick={() => {
                        setNewCampaign(prev => ({ ...prev, templateId: template.id, type: template.type }));
                        setActiveTab('create');
                      }}
                      className="px-3 py-1 bg-orange-600/20 text-orange-400 text-xs rounded hover:bg-orange-600/30 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && state.stats && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4 text-center">
                    <div className="text-2xl text-slate-200 font-mono">{state.stats.total}</div>
                    <div className="text-xs text-slate-500">Total Campaigns</div>
                  </div>
                  <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4 text-center">
                    <div className="text-2xl text-slate-200 font-mono">{state.stats.totalReach.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">Total Reach</div>
                  </div>
                  <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4 text-center">
                    <div className="text-2xl text-slate-200 font-mono">{state.stats.totalConversions.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">Total Conversions</div>
                  </div>
                </div>

                <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
                  <h3 className="text-xs text-slate-500 mb-3">By Status</h3>
                  <div className="space-y-2">
                    {Object.entries(state.stats.byStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className={clsx('text-sm', statusColors[status]?.split(' ')[0] || 'text-slate-400')}>
                          {status}
                        </span>
                        <span className="text-sm text-slate-200 font-mono">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
                  <h3 className="text-xs text-slate-500 mb-3">By Type</h3>
                  <div className="space-y-2">
                    {Object.entries(state.stats.byType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className={clsx('text-sm', typeColors[type] || 'text-slate-400')}>
                          {type}
                        </span>
                        <span className="text-sm text-slate-200 font-mono">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
