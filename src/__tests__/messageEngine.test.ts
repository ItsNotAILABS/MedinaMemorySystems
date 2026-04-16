/**
 * Tests for messageEngine.ts
 * Tests draft management, templates, sending, and scheduling
 */

// Reset module state between tests
let messageEngine: typeof import('@/lib/messageEngine');

beforeEach(() => {
  jest.resetModules();
  messageEngine = require('@/lib/messageEngine');
});

describe('messageEngine', () => {
  describe('createDraft', () => {
    it('should create a draft with required fields', () => {
      const draft = messageEngine.createDraft(
        ['user@example.com'],
        'Hello World',
        'email',
        'Test Subject'
      );
      
      expect(draft.id).toBeDefined();
      expect(draft.to).toEqual(['user@example.com']);
      expect(draft.body).toBe('Hello World');
      expect(draft.channel).toBe('email');
      expect(draft.subject).toBe('Test Subject');
      expect(draft.status).toBe('draft');
    });

    it('should default to email channel', () => {
      const draft = messageEngine.createDraft(
        ['user@example.com'],
        'Body'
      );
      
      expect(draft.channel).toBe('email');
    });

    it('should set subject only for email channel', () => {
      const emailDraft = messageEngine.createDraft(
        ['user@example.com'],
        'Body',
        'email',
        'Subject'
      );
      
      const smsDraft = messageEngine.createDraft(
        ['user@example.com'],
        'Body',
        'sms',
        'Subject'
      );
      
      expect(emailDraft.subject).toBe('Subject');
      expect(smsDraft.subject).toBeUndefined();
    });

    it('should initialize empty attachments', () => {
      const draft = messageEngine.createDraft(
        ['user@example.com'],
        'Body'
      );
      
      expect(draft.attachments).toEqual([]);
    });

    it('should handle null/undefined recipients safely', () => {
      const draft = messageEngine.createDraft(
        null as any,
        'Body'
      );
      
      expect(draft.to).toEqual([]);
    });

    it('should handle null body safely', () => {
      const draft = messageEngine.createDraft(
        ['user@example.com'],
        null as any
      );
      
      expect(draft.body).toBe('');
    });

    it('should support all channel types', () => {
      const channels: Array<'email' | 'sms' | 'in-app' | 'push'> = ['email', 'sms', 'in-app', 'push'];
      
      for (const channel of channels) {
        const draft = messageEngine.createDraft(['user'], 'Body', channel);
        expect(draft.channel).toBe(channel);
      }
    });
  });

  describe('updateDraft', () => {
    it('should update draft body', () => {
      const draft = messageEngine.createDraft(['user'], 'Original');
      const updated = messageEngine.updateDraft(draft.id, { body: 'Updated' });
      
      expect(updated?.body).toBe('Updated');
    });

    it('should update draft recipients', () => {
      const draft = messageEngine.createDraft(['user1'], 'Body');
      const updated = messageEngine.updateDraft(draft.id, { to: ['user1', 'user2'] });
      
      expect(updated?.to).toEqual(['user1', 'user2']);
    });

    it('should preserve id', () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      const updated = messageEngine.updateDraft(draft.id, { body: 'New' });
      
      expect(updated?.id).toBe(draft.id);
    });

    it('should return null for non-existent draft', () => {
      const result = messageEngine.updateDraft('fake', { body: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('deleteDraft', () => {
    it('should delete draft', () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      const result = messageEngine.deleteDraft(draft.id);
      
      expect(result).toBe(true);
      expect(messageEngine.getDraft(draft.id)).toBeNull();
    });

    it('should return false for non-existent draft', () => {
      const result = messageEngine.deleteDraft('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('getDraft', () => {
    it('should return draft by id', () => {
      const created = messageEngine.createDraft(['user'], 'Body');
      const retrieved = messageEngine.getDraft(created.id);
      
      expect(retrieved).toEqual(created);
    });

    it('should return null for non-existent draft', () => {
      const result = messageEngine.getDraft('fake');
      expect(result).toBeNull();
    });
  });

  describe('listDrafts', () => {
    it('should return all drafts', () => {
      messageEngine.createDraft(['user1'], 'Draft 1');
      messageEngine.createDraft(['user2'], 'Draft 2');
      
      const drafts = messageEngine.listDrafts();
      
      expect(drafts.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('attachments', () => {
    it('should add attachment to draft', () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      
      const attachment = messageEngine.addAttachment(draft.id, file);
      
      expect(attachment).not.toBeNull();
      expect(attachment?.name).toBe('test.txt');
      expect(attachment?.type).toBe('text/plain');
    });

    it('should return null for non-existent draft', () => {
      const file = new File(['content'], 'test.txt');
      
      const result = messageEngine.addAttachment('fake', file);
      expect(result).toBeNull();
    });

    it('should remove attachment from draft', () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      const file = new File(['content'], 'test.txt');
      const attachment = messageEngine.addAttachment(draft.id, file);
      
      const result = messageEngine.removeAttachment(draft.id, attachment!.id);
      
      expect(result).toBe(true);
    });

    it('should return false for non-existent attachment', () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      
      const result = messageEngine.removeAttachment(draft.id, 'fake');
      expect(result).toBe(false);
    });
  });

  describe('sendMessage', () => {
    it('should send draft and return sent message', async () => {
      const draft = messageEngine.createDraft(['user@example.com'], 'Hello');
      
      const sent = await messageEngine.sendMessage(draft.id);
      
      // May succeed or fail based on random simulation
      expect(sent).not.toBeNull();
      expect(sent?.sentAt).toBeDefined();
    });

    it('should return null for non-existent draft', async () => {
      const result = await messageEngine.sendMessage('fake');
      expect(result).toBeNull();
    });

    it('should return null for empty recipients', async () => {
      const draft = messageEngine.createDraft([], 'Hello');
      
      const result = await messageEngine.sendMessage(draft.id);
      expect(result).toBeNull();
    });

    it('should return null for empty body', async () => {
      const draft = messageEngine.createDraft(['user'], '');
      
      const result = await messageEngine.sendMessage(draft.id);
      expect(result).toBeNull();
    });

    it('should return null for whitespace-only body', async () => {
      const draft = messageEngine.createDraft(['user'], '   ');
      
      const result = await messageEngine.sendMessage(draft.id);
      expect(result).toBeNull();
    });

    it('should remove from drafts after sending', async () => {
      const draft = messageEngine.createDraft(['user'], 'Content');
      
      await messageEngine.sendMessage(draft.id);
      
      expect(messageEngine.getDraft(draft.id)).toBeNull();
    });
  });

  describe('sendWithApproval', () => {
    it('should create approval request', async () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      
      const approval = await messageEngine.sendWithApproval(draft.id);
      
      expect(approval).not.toBeNull();
      expect(approval?.type).toBe('message');
      expect(approval?.status).toBe('pending');
    });

    it('should update draft status to pending-approval', async () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      
      await messageEngine.sendWithApproval(draft.id);
      
      const updated = messageEngine.getDraft(draft.id);
      expect(updated?.status).toBe('pending-approval');
    });

    it('should return null for non-existent draft', async () => {
      const result = await messageEngine.sendWithApproval('fake');
      expect(result).toBeNull();
    });
  });

  describe('approveAndSend', () => {
    it('should approve and send message', async () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      const approval = await messageEngine.sendWithApproval(draft.id);
      
      const sent = await messageEngine.approveAndSend(approval!.id);
      
      expect(sent).not.toBeNull();
    });

    it('should return null for non-existent approval', async () => {
      const result = await messageEngine.approveAndSend('fake');
      expect(result).toBeNull();
    });
  });

  describe('rejectMessage', () => {
    it('should reject pending approval', async () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      const approval = await messageEngine.sendWithApproval(draft.id);
      
      const result = messageEngine.rejectMessage(approval!.id);
      
      expect(result).toBe(true);
    });

    it('should return draft to draft status', async () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      const approval = await messageEngine.sendWithApproval(draft.id);
      
      messageEngine.rejectMessage(approval!.id);
      
      const updated = messageEngine.getDraft(draft.id);
      expect(updated?.status).toBe('draft');
    });

    it('should return false for non-pending approval', async () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      const approval = await messageEngine.sendWithApproval(draft.id);
      
      // Reject once
      messageEngine.rejectMessage(approval!.id);
      
      // Try to reject again
      const result = messageEngine.rejectMessage(approval!.id);
      expect(result).toBe(false);
    });
  });

  describe('templates', () => {
    it('should return available templates', () => {
      const templates = messageEngine.getTemplates();
      
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should return template by id', () => {
      const template = messageEngine.getTemplate('welcome');
      
      expect(template).toBeDefined();
      expect(template?.name).toBe('Welcome Message');
    });

    it('should return undefined for unknown template', () => {
      const template = messageEngine.getTemplate('unknown');
      expect(template).toBeUndefined();
    });

    it('should apply template with variables', () => {
      const result = messageEngine.applyTemplate('welcome', {
        name: 'John',
        company: 'ACME',
      });
      
      expect(result).not.toBeNull();
      expect(result?.body).toContain('John');
      expect(result?.body).toContain('ACME');
      expect(result?.subject).toContain('ACME');
    });

    it('should return null for unknown template', () => {
      const result = messageEngine.applyTemplate('unknown', {});
      expect(result).toBeNull();
    });

    it('should create draft from template', () => {
      const draft = messageEngine.createFromTemplate('welcome', ['user@test.com'], {
        name: 'Jane',
        company: 'TestCo',
      });
      
      expect(draft).not.toBeNull();
      expect(draft?.body).toContain('Jane');
      expect(draft?.to).toEqual(['user@test.com']);
    });

    it('should return null for unknown template when creating draft', () => {
      const draft = messageEngine.createFromTemplate('unknown', ['user'], {});
      expect(draft).toBeNull();
    });
  });

  describe('scheduling', () => {
    it('should schedule draft for future', () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      const futureDate = new Date(Date.now() + 86400000); // +1 day
      
      const scheduled = messageEngine.scheduleDraft(draft.id, futureDate);
      
      expect(scheduled?.scheduledFor).toBe(futureDate.toISOString());
    });

    it('should return null for past date', () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      const pastDate = new Date(Date.now() - 86400000); // -1 day
      
      const result = messageEngine.scheduleDraft(draft.id, pastDate);
      
      expect(result).toBeNull();
    });

    it('should return null for non-existent draft', () => {
      const result = messageEngine.scheduleDraft('fake', new Date());
      expect(result).toBeNull();
    });

    it('should cancel schedule', () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      const futureDate = new Date(Date.now() + 86400000);
      messageEngine.scheduleDraft(draft.id, futureDate);
      
      const canceled = messageEngine.cancelSchedule(draft.id);
      
      expect(canceled?.scheduledFor).toBeUndefined();
    });

    it('should return null for non-existent draft when canceling', () => {
      const result = messageEngine.cancelSchedule('fake');
      expect(result).toBeNull();
    });
  });

  describe('getMessageStats', () => {
    it('should return draft count', () => {
      messageEngine.createDraft(['user'], 'Draft 1');
      messageEngine.createDraft(['user'], 'Draft 2');
      
      const stats = messageEngine.getMessageStats();
      
      expect(stats.drafts).toBeGreaterThanOrEqual(2);
    });

    it('should return pending count', async () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      await messageEngine.sendWithApproval(draft.id);
      
      const stats = messageEngine.getMessageStats();
      
      expect(stats.pending).toBeGreaterThanOrEqual(1);
    });

    it('should return by channel breakdown', async () => {
      const draft = messageEngine.createDraft(['user'], 'Body', 'email');
      await messageEngine.sendMessage(draft.id);
      
      const stats = messageEngine.getMessageStats();
      
      expect(stats.byChannel).toBeDefined();
    });
  });

  describe('getSentMessages', () => {
    it('should return sent messages', async () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      await messageEngine.sendMessage(draft.id);
      
      const sent = messageEngine.getSentMessages();
      
      expect(sent.length).toBeGreaterThan(0);
    });

    it('should respect limit parameter', async () => {
      for (let i = 0; i < 5; i++) {
        const draft = messageEngine.createDraft(['user'], `Body ${i}`);
        await messageEngine.sendMessage(draft.id);
      }
      
      const sent = messageEngine.getSentMessages(2);
      
      expect(sent.length).toBeLessThanOrEqual(2);
    });

    it('should sort by sentAt descending', async () => {
      const sent = messageEngine.getSentMessages();
      
      for (let i = 1; i < sent.length; i++) {
        expect(new Date(sent[i - 1].sentAt).getTime())
          .toBeGreaterThanOrEqual(new Date(sent[i].sentAt).getTime());
      }
    });
  });

  describe('getPendingApprovals', () => {
    it('should return pending approval requests', async () => {
      const draft = messageEngine.createDraft(['user'], 'Body');
      await messageEngine.sendWithApproval(draft.id);
      
      const pending = messageEngine.getPendingApprovals();
      
      expect(pending.length).toBeGreaterThanOrEqual(1);
      expect(pending.every(a => a.status === 'pending')).toBe(true);
    });
  });
});
