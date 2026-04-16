import { NextRequest, NextResponse } from 'next/server';
import {
  createCampaign,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  listCampaigns,
  launchCampaign,
  pauseCampaign,
  completeCampaign,
  addTarget,
  removeTarget,
  updateTarget,
  addContent,
  removeContent,
  updateContent,
  updateMetrics,
  simulateMetrics,
  getTemplates,
  createFromTemplate,
  getCampaignHistory,
  getCampaignStats,
} from '@/lib/campaignEngine';
import { safeString, senseEdge } from '@/lib/organismEdgeModel';
import type { Campaign, CampaignTarget, CampaignContent, CampaignMetrics } from '@/types';

interface RequestBody {
  action: string;
  id?: string;
  name?: string;
  type?: Campaign['type'];
  templateId?: string;
  updates?: Partial<Campaign>;
  campaignId?: string;
  targetId?: string;
  contentId?: string;
  criteria?: Record<string, unknown>;
  estimatedReach?: number;
  content?: string;
  platform?: string;
  metrics?: Partial<CampaignMetrics>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as RequestBody;

    const { action } = body;

    switch (action) {
      case 'create': {
        const { name, type } = body;
        const campaign = createCampaign(
          safeString(name ?? '', 'New Campaign', 'campaign.create.name'),
          type
        );
        return NextResponse.json({ success: true, campaign });
      }

      case 'create-from-template': {
        const { templateId, name } = body;
        if (!templateId) {
          return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
        }
        const campaign = createFromTemplate(templateId, safeString(name ?? '', 'New Campaign', 'campaign.template.name'));
        if (!campaign) {
          return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, campaign });
      }

      case 'update': {
        const { id, updates } = body;
        if (!id) {
          return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const campaign = updateCampaign(id, updates ?? {});
        if (!campaign) {
          return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, campaign });
      }

      case 'delete': {
        const { id } = body;
        if (!id) {
          return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const success = deleteCampaign(id);
        return NextResponse.json({ success });
      }

      case 'launch': {
        const { id } = body;
        if (!id) {
          return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const campaign = launchCampaign(id);
        if (!campaign) {
          return NextResponse.json({ error: 'Cannot launch campaign' }, { status: 400 });
        }
        return NextResponse.json({ success: true, campaign });
      }

      case 'pause': {
        const { id } = body;
        if (!id) {
          return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const campaign = pauseCampaign(id);
        if (!campaign) {
          return NextResponse.json({ error: 'Cannot pause campaign' }, { status: 400 });
        }
        return NextResponse.json({ success: true, campaign });
      }

      case 'complete': {
        const { id } = body;
        if (!id) {
          return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const campaign = completeCampaign(id);
        if (!campaign) {
          return NextResponse.json({ error: 'Cannot complete campaign' }, { status: 400 });
        }
        return NextResponse.json({ success: true, campaign });
      }

      // Target management
      case 'add-target': {
        const { campaignId, type, criteria, estimatedReach } = body;
        if (!campaignId || !type || !criteria || estimatedReach === undefined) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const target = addTarget(campaignId, type as CampaignTarget['type'], criteria, estimatedReach);
        if (!target) {
          return NextResponse.json({ error: 'Failed to add target' }, { status: 400 });
        }
        return NextResponse.json({ success: true, target });
      }

      case 'remove-target': {
        const { campaignId, targetId } = body;
        if (!campaignId || !targetId) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const success = removeTarget(campaignId, targetId);
        return NextResponse.json({ success });
      }

      case 'update-target': {
        const { campaignId, targetId, updates } = body;
        if (!campaignId || !targetId) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const target = updateTarget(campaignId, targetId, (updates ?? {}) as Partial<CampaignTarget>);
        if (!target) {
          return NextResponse.json({ error: 'Target not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, target });
      }

      // Content management
      case 'add-content': {
        const { campaignId, type, content, platform } = body;
        if (!campaignId || !type || !content) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const contentItem = addContent(campaignId, type as CampaignContent['type'], content, platform);
        if (!contentItem) {
          return NextResponse.json({ error: 'Failed to add content' }, { status: 400 });
        }
        return NextResponse.json({ success: true, content: contentItem });
      }

      case 'remove-content': {
        const { campaignId, contentId } = body;
        if (!campaignId || !contentId) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const success = removeContent(campaignId, contentId);
        return NextResponse.json({ success });
      }

      case 'update-content': {
        const { campaignId, contentId, updates } = body;
        if (!campaignId || !contentId) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const contentItem = updateContent(campaignId, contentId, (updates ?? {}) as Partial<CampaignContent>);
        if (!contentItem) {
          return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, content: contentItem });
      }

      // Metrics
      case 'update-metrics': {
        const { campaignId, metrics } = body;
        if (!campaignId) {
          return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
        }
        const result = updateMetrics(campaignId, metrics ?? {});
        if (!result) {
          return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, metrics: result });
      }

      case 'simulate-metrics': {
        const { campaignId } = body;
        if (!campaignId) {
          return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
        }
        const metricsResult = simulateMetrics(campaignId);
        if (!metricsResult) {
          return NextResponse.json({ error: 'Cannot simulate metrics' }, { status: 400 });
        }
        return NextResponse.json({ success: true, metrics: metricsResult });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

  } catch (error) {
    senseEdge('api-error', 'campaign', String(error), 'warning');
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'list';
    const id = searchParams.get('id');
    const status = searchParams.get('status') as Campaign['status'] | null;
    const type = searchParams.get('type') as Campaign['type'] | null;

    switch (action) {
      case 'get': {
        if (!id) {
          return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const campaign = getCampaign(id);
        if (!campaign) {
          return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }
        return NextResponse.json({ campaign });
      }

      case 'list': {
        const filter: { status?: Campaign['status']; type?: Campaign['type'] } = {};
        if (status) filter.status = status;
        if (type) filter.type = type;
        return NextResponse.json({ campaigns: listCampaigns(filter) });
      }

      case 'templates':
        return NextResponse.json({ templates: getTemplates() });

      case 'history': {
        const campaignId = searchParams.get('campaignId') || undefined;
        return NextResponse.json({ history: getCampaignHistory(campaignId) });
      }

      case 'stats':
        return NextResponse.json({ stats: getCampaignStats() });

      default:
        return NextResponse.json({
          endpoints: {
            GET: ['list', 'get?id=', 'templates', 'history', 'stats'],
            POST: [
              'create', 'create-from-template', 'update', 'delete',
              'launch', 'pause', 'complete',
              'add-target', 'remove-target', 'update-target',
              'add-content', 'remove-content', 'update-content',
              'update-metrics', 'simulate-metrics',
            ],
          },
        });
    }

  } catch (error) {
    senseEdge('api-error', 'campaign', String(error), 'warning');
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
