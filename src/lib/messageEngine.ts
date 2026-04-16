// 𓂀 MESSAGE ENGINE 𓂀
// "Message send — every dead button gets found, pattern-recognized, and fixed"

import { v4 as uuidv4 } from 'uuid';
import { safeString, safeArray, safeAsync, senseEdge } from './organismEdgeModel';
import type { MessageDraft, MessageAttachment, ApprovalRequest } from '@/types';

// ─── Store ────────────────────────────────────────────────────────────────────

const drafts: Map<string, MessageDraft> = new Map();
const sentMessages: Map<string, SentMessage> = new Map();
const approvalQueue: Map<string, ApprovalRequest> = new Map();

export interface SentMessage extends MessageDraft {
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  errorMessage?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  channel: MessageDraft['channel'];
  subject?: string;
  body: string;
  variables: string[];
}

// ─── Templates ────────────────────────────────────────────────────────────────

const templates: MessageTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Message',
    channel: 'email',
    subject: 'Welcome to {{company}}',
    body: 'Hello {{name}},\n\nWelcome to {{company}}! We\'re excited to have you on board.\n\nBest regards,\nThe {{company}} Team',
    variables: ['name', 'company'],
  },
  {
    id: 'notification',
    name: 'System Notification',
    channel: 'in-app',
    body: '{{title}}: {{message}}',
    variables: ['title', 'message'],
  },
  {
    id: 'approval-request',
    name: 'Approval Request',
    channel: 'email',
    subject: 'Action Required: {{action}}',
    body: 'Hello {{name}},\n\nAn action requires your approval:\n\n{{action}}\n\nPlease review and respond.\n\nThank you,\n{{sender}}',
    variables: ['name', 'action', 'sender'],
  },
  {
    id: 'alert',
    name: 'System Alert',
    channel: 'push',
    body: '⚠️ {{title}}: {{message}}',
    variables: ['title', 'message'],
  },
];

// ─── Draft Management ─────────────────────────────────────────────────────────

export function createDraft(
  to: string[],
  body: string,
  channel: MessageDraft['channel'] = 'email',
  subject?: string
): MessageDraft {
  const draft: MessageDraft = {
    id: uuidv4(),
    to: safeArray(to, 'createDraft.to'),
    subject: channel === 'email' ? safeString(subject, 'No Subject', 'createDraft.subject') : undefined,
    body: safeString(body, '', 'createDraft.body'),
    attachments: [],
    channel,
    status: 'draft',
  };

  drafts.set(draft.id, draft);
  return draft;
}

export function updateDraft(id: string, updates: Partial<MessageDraft>): MessageDraft | null {
  const draft = drafts.get(id);
  if (!draft) {
    senseEdge('null-value', 'updateDraft', `Draft not found: ${id}`, 'warning');
    return null;
  }

  const updated = { ...draft, ...updates, id }; // Preserve ID
  drafts.set(id, updated);
  return updated;
}

export function deleteDraft(id: string): boolean {
  return drafts.delete(id);
}

export function getDraft(id: string): MessageDraft | null {
  return drafts.get(id) || null;
}

export function listDrafts(): MessageDraft[] {
  return Array.from(drafts.values());
}

// ─── Attachments ──────────────────────────────────────────────────────────────

export function addAttachment(draftId: string, file: File): MessageAttachment | null {
  const draft = drafts.get(draftId);
  if (!draft) {
    senseEdge('null-value', 'addAttachment', `Draft not found: ${draftId}`, 'warning');
    return null;
  }

  const attachment: MessageAttachment = {
    id: uuidv4(),
    name: file.name,
    type: file.type,
    size: file.size,
  };

  draft.attachments.push(attachment);
  drafts.set(draftId, draft);
  return attachment;
}

export function removeAttachment(draftId: string, attachmentId: string): boolean {
  const draft = drafts.get(draftId);
  if (!draft) return false;

  const index = draft.attachments.findIndex(a => a.id === attachmentId);
  if (index === -1) return false;

  draft.attachments.splice(index, 1);
  drafts.set(draftId, draft);
  return true;
}

// ─── Sending ──────────────────────────────────────────────────────────────────

export async function sendMessage(id: string): Promise<SentMessage | null> {
  const draft = drafts.get(id);
  if (!draft) {
    senseEdge('null-value', 'sendMessage', `Draft not found: ${id}`, 'warning');
    return null;
  }

  // Validate before sending
  if (draft.to.length === 0) {
    senseEdge('invalid-input', 'sendMessage', 'No recipients specified', 'warning');
    return null;
  }

  if (!draft.body.trim()) {
    senseEdge('invalid-input', 'sendMessage', 'Message body is empty', 'warning');
    return null;
  }

  // Create sent message
  const sent: SentMessage = {
    ...draft,
    status: 'sent',
    sentAt: new Date().toISOString(),
  };

  // Simulate sending based on channel
  const result = await safeAsync(
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
      
      // Random delivery simulation
      if (Math.random() > 0.95) {
        throw new Error('Delivery failed');
      }

      sent.deliveredAt = new Date().toISOString();
      return sent;
    },
    { ...sent, status: 'failed', errorMessage: 'Failed to send message' },
    'sendMessage'
  );

  // Move from drafts to sent
  drafts.delete(id);
  sentMessages.set(result.id, result);

  return result;
}

export async function sendWithApproval(id: string): Promise<ApprovalRequest | null> {
  const draft = drafts.get(id);
  if (!draft) {
    senseEdge('null-value', 'sendWithApproval', `Draft not found: ${id}`, 'warning');
    return null;
  }

  draft.status = 'pending-approval';
  drafts.set(id, draft);

  const approval: ApprovalRequest = {
    id: uuidv4(),
    type: 'message',
    title: `Send ${draft.channel} to ${draft.to.length} recipient(s)`,
    description: draft.body.slice(0, 100) + (draft.body.length > 100 ? '...' : ''),
    payload: { draftId: id },
    requestedAt: new Date().toISOString(),
    requestedBy: 'oro',
    status: 'pending',
  };

  approvalQueue.set(approval.id, approval);
  return approval;
}

export async function approveAndSend(approvalId: string): Promise<SentMessage | null> {
  const approval = approvalQueue.get(approvalId);
  if (!approval || approval.status !== 'pending') {
    senseEdge('null-value', 'approveAndSend', `Approval not found or already processed: ${approvalId}`, 'warning');
    return null;
  }

  const draftId = (approval.payload as { draftId: string }).draftId;
  const draft = drafts.get(draftId);
  if (!draft) {
    senseEdge('null-value', 'approveAndSend', `Draft not found: ${draftId}`, 'warning');
    return null;
  }

  // Update approval
  approval.status = 'approved';
  approval.approvedAt = new Date().toISOString();
  approval.approvedBy = 'user';
  approvalQueue.set(approvalId, approval);

  // Update draft and send
  draft.status = 'approved';
  drafts.set(draftId, draft);

  return sendMessage(draftId);
}

export function rejectMessage(approvalId: string, reason?: string): boolean {
  const approval = approvalQueue.get(approvalId);
  if (!approval || approval.status !== 'pending') {
    return false;
  }

  approval.status = 'rejected';
  approval.approvedAt = new Date().toISOString();
  approvalQueue.set(approvalId, approval);

  // Update draft status
  const draftId = (approval.payload as { draftId: string }).draftId;
  const draft = drafts.get(draftId);
  if (draft) {
    draft.status = 'draft'; // Return to draft
    drafts.set(draftId, draft);
  }

  return true;
}

// ─── Templates ────────────────────────────────────────────────────────────────

export function getTemplates(): MessageTemplate[] {
  return templates;
}

export function getTemplate(id: string): MessageTemplate | undefined {
  return templates.find(t => t.id === id);
}

export function applyTemplate(
  templateId: string,
  variables: Record<string, string>
): { subject?: string; body: string } | null {
  const template = templates.find(t => t.id === templateId);
  if (!template) {
    senseEdge('null-value', 'applyTemplate', `Template not found: ${templateId}`, 'warning');
    return null;
  }

  let body = template.body;
  let subject = template.subject;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    body = body.replace(regex, value);
    if (subject) {
      subject = subject.replace(regex, value);
    }
  }

  return { subject, body };
}

export function createFromTemplate(
  templateId: string,
  to: string[],
  variables: Record<string, string>
): MessageDraft | null {
  const template = templates.find(t => t.id === templateId);
  if (!template) {
    senseEdge('null-value', 'createFromTemplate', `Template not found: ${templateId}`, 'warning');
    return null;
  }

  const applied = applyTemplate(templateId, variables);
  if (!applied) return null;

  return createDraft(to, applied.body, template.channel, applied.subject);
}

// ─── Scheduling ───────────────────────────────────────────────────────────────

export function scheduleDraft(id: string, sendAt: Date): MessageDraft | null {
  const draft = drafts.get(id);
  if (!draft) {
    senseEdge('null-value', 'scheduleDraft', `Draft not found: ${id}`, 'warning');
    return null;
  }

  if (sendAt <= new Date()) {
    senseEdge('invalid-input', 'scheduleDraft', 'Scheduled time must be in the future', 'warning');
    return null;
  }

  draft.scheduledFor = sendAt.toISOString();
  drafts.set(id, draft);
  return draft;
}

export function cancelSchedule(id: string): MessageDraft | null {
  const draft = drafts.get(id);
  if (!draft) return null;

  draft.scheduledFor = undefined;
  drafts.set(id, draft);
  return draft;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function getMessageStats(): {
  drafts: number;
  sent: number;
  pending: number;
  failed: number;
  byChannel: Record<string, number>;
} {
  const byChannel: Record<string, number> = {};
  
  for (const msg of sentMessages.values()) {
    byChannel[msg.channel] = (byChannel[msg.channel] || 0) + 1;
  }

  return {
    drafts: drafts.size,
    sent: Array.from(sentMessages.values()).filter(m => m.status === 'sent').length,
    pending: Array.from(approvalQueue.values()).filter(a => a.status === 'pending').length,
    failed: Array.from(sentMessages.values()).filter(m => m.status === 'failed').length,
    byChannel,
  };
}

export function getSentMessages(limit = 20): SentMessage[] {
  return Array.from(sentMessages.values())
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    .slice(0, limit);
}

export function getPendingApprovals(): ApprovalRequest[] {
  return Array.from(approvalQueue.values()).filter(a => a.status === 'pending');
}
