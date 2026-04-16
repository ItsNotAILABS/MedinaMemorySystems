import { NextRequest, NextResponse } from 'next/server';
import {
  createDraft,
  updateDraft,
  deleteDraft,
  getDraft,
  listDrafts,
  sendMessage,
  sendWithApproval,
  approveAndSend,
  rejectMessage,
  getTemplates,
  createFromTemplate,
  scheduleDraft,
  getSentMessages,
  getPendingApprovals,
  getMessageStats,
} from '@/lib/messageEngine';
import { safeString, safeArray, senseEdge } from '@/lib/organismEdgeModel';

interface RequestBody {
  action: string;
  id?: string;
  to?: string[];
  body?: string;
  channel?: 'email' | 'sms' | 'in-app' | 'push';
  subject?: string;
  updates?: Record<string, unknown>;
  requireApproval?: boolean;
  approvalId?: string;
  reason?: string;
  sendAt?: string;
  templateId?: string;
  variables?: Record<string, string>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as RequestBody;

    const { action } = body;

    switch (action) {
      case 'create': {
        const { to, body: msgBody, channel, subject } = body;
        const draft = createDraft(
          safeArray(to ?? [], 'message.create.to'),
          safeString(msgBody ?? '', '', 'message.create.body'),
          channel || 'email',
          subject
        );
        return NextResponse.json({ success: true, draft });
      }

      case 'update': {
        const { id, updates } = body;
        if (!id) {
          return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const draft = updateDraft(id, updates ?? {});
        if (!draft) {
          return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, draft });
      }

      case 'delete': {
        const { id } = body;
        if (!id) {
          return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const success = deleteDraft(id);
        return NextResponse.json({ success });
      }

      case 'send': {
        const { id, requireApproval } = body;
        if (!id) {
          return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        if (requireApproval) {
          const approval = await sendWithApproval(id);
          if (!approval) {
            return NextResponse.json({ error: 'Failed to create approval request' }, { status: 400 });
          }
          return NextResponse.json({ success: true, approval, status: 'pending-approval' });
        }
        const sent = await sendMessage(id);
        if (!sent) {
          return NextResponse.json({ error: 'Failed to send message' }, { status: 400 });
        }
        return NextResponse.json({ success: true, message: sent });
      }

      case 'approve': {
        const { approvalId } = body;
        if (!approvalId) {
          return NextResponse.json({ error: 'Approval ID required' }, { status: 400 });
        }
        const sent = await approveAndSend(approvalId);
        if (!sent) {
          return NextResponse.json({ error: 'Failed to approve and send' }, { status: 400 });
        }
        return NextResponse.json({ success: true, message: sent });
      }

      case 'reject': {
        const { approvalId, reason } = body;
        if (!approvalId) {
          return NextResponse.json({ error: 'Approval ID required' }, { status: 400 });
        }
        const success = rejectMessage(approvalId, reason);
        return NextResponse.json({ success });
      }

      case 'schedule': {
        const { id, sendAt } = body;
        if (!id || !sendAt) {
          return NextResponse.json({ error: 'ID and sendAt required' }, { status: 400 });
        }
        const draft = scheduleDraft(id, new Date(sendAt));
        if (!draft) {
          return NextResponse.json({ error: 'Failed to schedule' }, { status: 400 });
        }
        return NextResponse.json({ success: true, draft });
      }

      case 'create-from-template': {
        const { templateId, to, variables } = body;
        if (!templateId) {
          return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
        }
        const draft = createFromTemplate(templateId, safeArray(to ?? [], 'message.template.to'), variables ?? {});
        if (!draft) {
          return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, draft });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

  } catch (error) {
    senseEdge('api-error', 'message', String(error), 'warning');
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'list';
    const id = searchParams.get('id');

    switch (action) {
      case 'get': {
        if (!id) {
          return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const draft = getDraft(id);
        if (!draft) {
          return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
        }
        return NextResponse.json({ draft });
      }

      case 'list':
        return NextResponse.json({ drafts: listDrafts() });

      case 'templates':
        return NextResponse.json({ templates: getTemplates() });

      case 'sent':
        return NextResponse.json({ messages: getSentMessages() });

      case 'pending':
        return NextResponse.json({ approvals: getPendingApprovals() });

      case 'stats':
        return NextResponse.json({ stats: getMessageStats() });

      default:
        return NextResponse.json({
          endpoints: {
            GET: ['list', 'get?id=', 'templates', 'sent', 'pending', 'stats'],
            POST: ['create', 'update', 'delete', 'send', 'approve', 'reject', 'schedule', 'create-from-template'],
          },
        });
    }

  } catch (error) {
    senseEdge('api-error', 'message', String(error), 'warning');
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
