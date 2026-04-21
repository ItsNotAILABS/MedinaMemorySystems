// 𓂀 CAMPAIGN ENGINE 𓂀
// "Campaign generator — every dead button gets found, pattern-recognized, and fixed"

import { v4 as uuidv4 } from 'uuid';
import { safeString, safeArray, safeAsync, senseEdge } from './organismEdgeModel';
import type { Campaign, CampaignTarget, CampaignContent, CampaignMetrics } from '@/types';

// ─── Store ────────────────────────────────────────────────────────────────────

const campaigns: Map<string, Campaign> = new Map();
const campaignHistory: CampaignEvent[] = [];

export interface CampaignEvent {
  id: string;
  campaignId: string;
  type: 'created' | 'updated' | 'launched' | 'paused' | 'completed' | 'metric-update';
  timestamp: string;
  data?: Record<string, unknown>;
}

// ─── Campaign CRUD ────────────────────────────────────────────────────────────

export function createCampaign(
  name: string,
  type: Campaign['type'] = 'content'
): Campaign {
  const now = new Date().toISOString();
  const campaign: Campaign = {
    id: uuidv4(),
    name: safeString(name, 'Untitled Campaign', 'createCampaign.name'),
    type,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    targets: [],
    content: [],
    metrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      engagement: 0,
    },
  };

  campaigns.set(campaign.id, campaign);
  recordEvent(campaign.id, 'created');
  return campaign;
}

export function getCampaign(id: string): Campaign | null {
  const campaign = campaigns.get(id);
  if (!campaign) {
    senseEdge('null-value', 'getCampaign', `Campaign not found: ${id}`, 'warning');
    return null;
  }
  return campaign;
}

export function updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
  const campaign = campaigns.get(id);
  if (!campaign) {
    senseEdge('null-value', 'updateCampaign', `Campaign not found: ${id}`, 'warning');
    return null;
  }

  const updated = {
    ...campaign,
    ...updates,
    id, // Preserve ID
    updatedAt: new Date().toISOString(),
  };

  campaigns.set(id, updated);
  recordEvent(id, 'updated', { updates: Object.keys(updates) });
  return updated;
}

export function deleteCampaign(id: string): boolean {
  return campaigns.delete(id);
}

export function listCampaigns(filter?: { status?: Campaign['status']; type?: Campaign['type'] }): Campaign[] {
  let results = Array.from(campaigns.values());

  if (filter?.status) {
    results = results.filter(c => c.status === filter.status);
  }
  if (filter?.type) {
    results = results.filter(c => c.type === filter.type);
  }

  return results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

// ─── Campaign Lifecycle ───────────────────────────────────────────────────────

export function launchCampaign(id: string): Campaign | null {
  const campaign = campaigns.get(id);
  if (!campaign) {
    senseEdge('null-value', 'launchCampaign', `Campaign not found: ${id}`, 'warning');
    return null;
  }

  if (campaign.status !== 'draft' && campaign.status !== 'paused') {
    senseEdge('invalid-input', 'launchCampaign', `Cannot launch campaign in ${campaign.status} state`, 'warning');
    return null;
  }

  // Validate campaign is ready
  if (campaign.targets.length === 0) {
    senseEdge('invalid-input', 'launchCampaign', 'Campaign has no targets', 'warning');
    return null;
  }

  if (campaign.content.length === 0) {
    senseEdge('invalid-input', 'launchCampaign', 'Campaign has no content', 'warning');
    return null;
  }

  campaign.status = 'active';
  campaign.updatedAt = new Date().toISOString();
  campaigns.set(id, campaign);
  recordEvent(id, 'launched');
  return campaign;
}

export function pauseCampaign(id: string): Campaign | null {
  const campaign = campaigns.get(id);
  if (!campaign) {
    senseEdge('null-value', 'pauseCampaign', `Campaign not found: ${id}`, 'warning');
    return null;
  }

  if (campaign.status !== 'active') {
    senseEdge('invalid-input', 'pauseCampaign', `Cannot pause campaign in ${campaign.status} state`, 'warning');
    return null;
  }

  campaign.status = 'paused';
  campaign.updatedAt = new Date().toISOString();
  campaigns.set(id, campaign);
  recordEvent(id, 'paused');
  return campaign;
}

export function completeCampaign(id: string): Campaign | null {
  const campaign = campaigns.get(id);
  if (!campaign) {
    senseEdge('null-value', 'completeCampaign', `Campaign not found: ${id}`, 'warning');
    return null;
  }

  campaign.status = 'completed';
  campaign.updatedAt = new Date().toISOString();
  campaigns.set(id, campaign);
  recordEvent(id, 'completed');
  return campaign;
}

// ─── Targets ──────────────────────────────────────────────────────────────────

export function addTarget(
  campaignId: string,
  type: CampaignTarget['type'],
  criteria: Record<string, unknown>,
  estimatedReach: number
): CampaignTarget | null {
  const campaign = campaigns.get(campaignId);
  if (!campaign) {
    senseEdge('null-value', 'addTarget', `Campaign not found: ${campaignId}`, 'warning');
    return null;
  }

  const target: CampaignTarget = {
    id: uuidv4(),
    type,
    criteria,
    estimatedReach: Math.max(0, estimatedReach),
  };

  campaign.targets.push(target);
  campaign.updatedAt = new Date().toISOString();
  campaigns.set(campaignId, campaign);
  return target;
}

export function removeTarget(campaignId: string, targetId: string): boolean {
  const campaign = campaigns.get(campaignId);
  if (!campaign) return false;

  const index = campaign.targets.findIndex(t => t.id === targetId);
  if (index === -1) return false;

  campaign.targets.splice(index, 1);
  campaign.updatedAt = new Date().toISOString();
  campaigns.set(campaignId, campaign);
  return true;
}

export function updateTarget(
  campaignId: string,
  targetId: string,
  updates: Partial<CampaignTarget>
): CampaignTarget | null {
  const campaign = campaigns.get(campaignId);
  if (!campaign) return null;

  const target = campaign.targets.find(t => t.id === targetId);
  if (!target) return null;

  Object.assign(target, updates);
  campaign.updatedAt = new Date().toISOString();
  campaigns.set(campaignId, campaign);
  return target;
}

// ─── Content ──────────────────────────────────────────────────────────────────

export function addContent(
  campaignId: string,
  type: CampaignContent['type'],
  content: string,
  platform?: string
): CampaignContent | null {
  const campaign = campaigns.get(campaignId);
  if (!campaign) {
    senseEdge('null-value', 'addContent', `Campaign not found: ${campaignId}`, 'warning');
    return null;
  }

  const contentItem: CampaignContent = {
    id: uuidv4(),
    type,
    content: safeString(content, '', 'addContent.content'),
    platform,
  };

  campaign.content.push(contentItem);
  campaign.updatedAt = new Date().toISOString();
  campaigns.set(campaignId, campaign);
  return contentItem;
}

export function removeContent(campaignId: string, contentId: string): boolean {
  const campaign = campaigns.get(campaignId);
  if (!campaign) return false;

  const index = campaign.content.findIndex(c => c.id === contentId);
  if (index === -1) return false;

  campaign.content.splice(index, 1);
  campaign.updatedAt = new Date().toISOString();
  campaigns.set(campaignId, campaign);
  return true;
}

export function updateContent(
  campaignId: string,
  contentId: string,
  updates: Partial<CampaignContent>
): CampaignContent | null {
  const campaign = campaigns.get(campaignId);
  if (!campaign) return null;

  const content = campaign.content.find(c => c.id === contentId);
  if (!content) return null;

  Object.assign(content, updates);
  campaign.updatedAt = new Date().toISOString();
  campaigns.set(campaignId, campaign);
  return content;
}

// ─── Metrics ──────────────────────────────────────────────────────────────────

export function updateMetrics(
  campaignId: string,
  metrics: Partial<CampaignMetrics>
): CampaignMetrics | null {
  const campaign = campaigns.get(campaignId);
  if (!campaign) {
    senseEdge('null-value', 'updateMetrics', `Campaign not found: ${campaignId}`, 'warning');
    return null;
  }

  campaign.metrics = {
    impressions: metrics.impressions ?? campaign.metrics?.impressions ?? 0,
    clicks: metrics.clicks ?? campaign.metrics?.clicks ?? 0,
    conversions: metrics.conversions ?? campaign.metrics?.conversions ?? 0,
    engagement: metrics.engagement ?? campaign.metrics?.engagement ?? 0,
  };

  campaign.updatedAt = new Date().toISOString();
  campaigns.set(campaignId, campaign);
  recordEvent(campaignId, 'metric-update', { metrics: campaign.metrics });
  return campaign.metrics;
}

export function simulateMetrics(campaignId: string): CampaignMetrics | null {
  const campaign = campaigns.get(campaignId);
  if (!campaign || campaign.status !== 'active') return null;

  // Simulate realistic metrics growth
  const totalReach = campaign.targets.reduce((sum, t) => sum + t.estimatedReach, 0);
  const impressionRate = 0.1 + Math.random() * 0.2;
  const clickRate = 0.02 + Math.random() * 0.08;
  const conversionRate = 0.01 + Math.random() * 0.04;
  
  const newImpressions = Math.floor(totalReach * impressionRate);
  const newClicks = Math.floor(newImpressions * clickRate);
  const newConversions = Math.floor(newClicks * conversionRate);
  
  return updateMetrics(campaignId, {
    impressions: (campaign.metrics?.impressions ?? 0) + newImpressions,
    clicks: (campaign.metrics?.clicks ?? 0) + newClicks,
    conversions: (campaign.metrics?.conversions ?? 0) + newConversions,
    engagement: ((campaign.metrics?.engagement ?? 0) + Math.random() * 5) / 2,
  });
}

// ─── Templates & Generators ───────────────────────────────────────────────────

export interface CampaignTemplate {
  id: string;
  name: string;
  type: Campaign['type'];
  description: string;
  defaultTargets: Omit<CampaignTarget, 'id'>[];
  contentSuggestions: string[];
}

const templates: CampaignTemplate[] = [
  {
    id: 'product-launch',
    name: 'Product Launch',
    type: 'advertising',
    description: 'Launch a new product with multi-channel advertising',
    defaultTargets: [
      { type: 'audience', criteria: { interest: 'technology', age: '25-45' }, estimatedReach: 50000 },
      { type: 'segment', criteria: { behavior: 'early-adopters' }, estimatedReach: 15000 },
    ],
    contentSuggestions: [
      'Introduce the product with key benefits',
      'Highlight unique features',
      'Include a compelling call-to-action',
    ],
  },
  {
    id: 'brand-awareness',
    name: 'Brand Awareness',
    type: 'social',
    description: 'Build brand recognition across social platforms',
    defaultTargets: [
      { type: 'audience', criteria: { demographic: 'general', platform: 'all' }, estimatedReach: 100000 },
    ],
    contentSuggestions: [
      'Share your brand story',
      'Highlight company values',
      'Showcase team and culture',
    ],
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation',
    type: 'email',
    description: 'Generate qualified leads through email campaigns',
    defaultTargets: [
      { type: 'segment', criteria: { engagement: 'high', source: 'website' }, estimatedReach: 10000 },
    ],
    contentSuggestions: [
      'Offer valuable content or resource',
      'Clear value proposition',
      'Easy signup or download process',
    ],
  },
  {
    id: 'content-marketing',
    name: 'Content Marketing',
    type: 'content',
    description: 'Distribute valuable content to attract and engage audience',
    defaultTargets: [
      { type: 'audience', criteria: { interest: 'industry-specific' }, estimatedReach: 25000 },
    ],
    contentSuggestions: [
      'Educational blog posts',
      'Infographics and visual content',
      'Video tutorials and guides',
    ],
  },
];

export function getTemplates(): CampaignTemplate[] {
  return templates;
}

export function getTemplate(id: string): CampaignTemplate | undefined {
  return templates.find(t => t.id === id);
}

export function createFromTemplate(templateId: string, name: string): Campaign | null {
  const template = templates.find(t => t.id === templateId);
  if (!template) {
    senseEdge('null-value', 'createFromTemplate', `Template not found: ${templateId}`, 'warning');
    return null;
  }

  const campaign = createCampaign(name, template.type);

  // Add default targets
  for (const target of template.defaultTargets) {
    addTarget(campaign.id, target.type, target.criteria, target.estimatedReach);
  }

  return campaign;
}

// ─── Event Recording ──────────────────────────────────────────────────────────

function recordEvent(
  campaignId: string,
  type: CampaignEvent['type'],
  data?: Record<string, unknown>
): void {
  const event: CampaignEvent = {
    id: uuidv4(),
    campaignId,
    type,
    timestamp: new Date().toISOString(),
    data,
  };

  campaignHistory.push(event);
  if (campaignHistory.length > 1000) {
    campaignHistory.shift();
  }
}

export function getCampaignHistory(campaignId?: string, limit = 50): CampaignEvent[] {
  let events = campaignHistory;
  
  if (campaignId) {
    events = events.filter(e => e.campaignId === campaignId);
  }

  return events.slice(-limit).reverse();
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function getCampaignStats(): {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  totalReach: number;
  totalImpressions: number;
  totalConversions: number;
} {
  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};
  let totalReach = 0;
  let totalImpressions = 0;
  let totalConversions = 0;

  for (const campaign of campaigns.values()) {
    byStatus[campaign.status] = (byStatus[campaign.status] || 0) + 1;
    byType[campaign.type] = (byType[campaign.type] || 0) + 1;
    totalReach += campaign.targets.reduce((sum, t) => sum + t.estimatedReach, 0);
    totalImpressions += campaign.metrics?.impressions ?? 0;
    totalConversions += campaign.metrics?.conversions ?? 0;
  }

  return {
    total: campaigns.size,
    byStatus,
    byType,
    totalReach,
    totalImpressions,
    totalConversions,
  };
}
