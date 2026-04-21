/**
 * Tests for campaignEngine.ts
 * Tests campaign CRUD, lifecycle, targets, content, and metrics
 */

// Reset module state between tests
let campaignEngine: typeof import('@/lib/campaignEngine');

beforeEach(() => {
  jest.resetModules();
  campaignEngine = require('@/lib/campaignEngine');
});

describe('campaignEngine', () => {
  describe('createCampaign', () => {
    it('should create a campaign with draft status', () => {
      const campaign = campaignEngine.createCampaign('Test Campaign', 'email');
      
      expect(campaign.id).toBeDefined();
      expect(campaign.name).toBe('Test Campaign');
      expect(campaign.type).toBe('email');
      expect(campaign.status).toBe('draft');
    });

    it('should default to content type', () => {
      const campaign = campaignEngine.createCampaign('Content Campaign');
      
      expect(campaign.type).toBe('content');
    });

    it('should initialize empty targets', () => {
      const campaign = campaignEngine.createCampaign('Targets Test');
      
      expect(campaign.targets).toEqual([]);
    });

    it('should initialize empty content', () => {
      const campaign = campaignEngine.createCampaign('Content Test');
      
      expect(campaign.content).toEqual([]);
    });

    it('should initialize metrics to zero', () => {
      const campaign = campaignEngine.createCampaign('Metrics Test');
      
      expect(campaign.metrics).toEqual({
        impressions: 0,
        clicks: 0,
        conversions: 0,
        engagement: 0,
      });
    });

    it('should set createdAt timestamp', () => {
      const campaign = campaignEngine.createCampaign('Timestamp Test');
      
      expect(campaign.createdAt).toBeDefined();
    });

    it('should handle null/undefined name safely', () => {
      const campaign = campaignEngine.createCampaign(null as any);
      
      expect(campaign.name).toBe('Untitled Campaign');
    });
  });

  describe('getCampaign', () => {
    it('should return campaign by id', () => {
      const created = campaignEngine.createCampaign('Get Test');
      const retrieved = campaignEngine.getCampaign(created.id);
      
      expect(retrieved).toEqual(created);
    });

    it('should return null for non-existent id', () => {
      const result = campaignEngine.getCampaign('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('updateCampaign', () => {
    it('should update campaign name', () => {
      const campaign = campaignEngine.createCampaign('Original');
      const updated = campaignEngine.updateCampaign(campaign.id, { name: 'Updated' });
      
      expect(updated?.name).toBe('Updated');
    });

    it('should update campaign type', () => {
      const campaign = campaignEngine.createCampaign('Type Test', 'email');
      const updated = campaignEngine.updateCampaign(campaign.id, { type: 'social' });
      
      expect(updated?.type).toBe('social');
    });

    it('should preserve id', () => {
      const campaign = campaignEngine.createCampaign('ID Test');
      const updated = campaignEngine.updateCampaign(campaign.id, { name: 'New' });
      
      expect(updated?.id).toBe(campaign.id);
    });

    it('should set updatedAt timestamp on update', () => {
      const campaign = campaignEngine.createCampaign('Timestamp Update');
      const updated = campaignEngine.updateCampaign(campaign.id, { name: 'New' });
      
      // Just verify updatedAt is set to a valid timestamp
      expect(updated?.updatedAt).toBeDefined();
      expect(new Date(updated!.updatedAt).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should return null for non-existent campaign', () => {
      const result = campaignEngine.updateCampaign('fake', { name: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('deleteCampaign', () => {
    it('should delete campaign', () => {
      const campaign = campaignEngine.createCampaign('To Delete');
      const result = campaignEngine.deleteCampaign(campaign.id);
      
      expect(result).toBe(true);
      expect(campaignEngine.getCampaign(campaign.id)).toBeNull();
    });

    it('should return false for non-existent campaign', () => {
      const result = campaignEngine.deleteCampaign('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('listCampaigns', () => {
    it('should return all campaigns', () => {
      campaignEngine.createCampaign('Campaign 1');
      campaignEngine.createCampaign('Campaign 2');
      
      const campaigns = campaignEngine.listCampaigns();
      
      expect(campaigns.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter by status', () => {
      const c1 = campaignEngine.createCampaign('Draft Campaign');
      const c2 = campaignEngine.createCampaign('Another Draft');
      
      // Add targets and content so we can launch one
      campaignEngine.addTarget(c1.id, 'audience', {}, 1000);
      campaignEngine.addContent(c1.id, 'text', 'Content');
      campaignEngine.launchCampaign(c1.id);
      
      const drafts = campaignEngine.listCampaigns({ status: 'draft' });
      const active = campaignEngine.listCampaigns({ status: 'active' });
      
      expect(drafts.every(c => c.status === 'draft')).toBe(true);
      expect(active.every(c => c.status === 'active')).toBe(true);
    });

    it('should filter by type', () => {
      campaignEngine.createCampaign('Email', 'email');
      campaignEngine.createCampaign('Social', 'social');
      
      const emailCampaigns = campaignEngine.listCampaigns({ type: 'email' });
      const socialCampaigns = campaignEngine.listCampaigns({ type: 'social' });
      
      expect(emailCampaigns.every(c => c.type === 'email')).toBe(true);
      expect(socialCampaigns.every(c => c.type === 'social')).toBe(true);
    });

    it('should sort by updatedAt descending', () => {
      const campaigns = campaignEngine.listCampaigns();
      
      for (let i = 1; i < campaigns.length; i++) {
        expect(new Date(campaigns[i - 1].updatedAt).getTime())
          .toBeGreaterThanOrEqual(new Date(campaigns[i].updatedAt).getTime());
      }
    });
  });

  describe('launchCampaign', () => {
    it('should change status to active', () => {
      const campaign = campaignEngine.createCampaign('Launch Test');
      campaignEngine.addTarget(campaign.id, 'audience', {}, 1000);
      campaignEngine.addContent(campaign.id, 'text', 'Content');
      
      const launched = campaignEngine.launchCampaign(campaign.id);
      
      expect(launched?.status).toBe('active');
    });

    it('should return null without targets', () => {
      const campaign = campaignEngine.createCampaign('No Targets');
      campaignEngine.addContent(campaign.id, 'text', 'Content');
      
      const result = campaignEngine.launchCampaign(campaign.id);
      
      expect(result).toBeNull();
    });

    it('should return null without content', () => {
      const campaign = campaignEngine.createCampaign('No Content');
      campaignEngine.addTarget(campaign.id, 'audience', {}, 1000);
      
      const result = campaignEngine.launchCampaign(campaign.id);
      
      expect(result).toBeNull();
    });

    it('should return null for already active campaign', () => {
      const campaign = campaignEngine.createCampaign('Already Active');
      campaignEngine.addTarget(campaign.id, 'audience', {}, 1000);
      campaignEngine.addContent(campaign.id, 'text', 'Content');
      campaignEngine.launchCampaign(campaign.id);
      
      const result = campaignEngine.launchCampaign(campaign.id);
      
      expect(result).toBeNull();
    });

    it('should allow launching paused campaign', () => {
      const campaign = campaignEngine.createCampaign('Pause Resume');
      campaignEngine.addTarget(campaign.id, 'audience', {}, 1000);
      campaignEngine.addContent(campaign.id, 'text', 'Content');
      campaignEngine.launchCampaign(campaign.id);
      campaignEngine.pauseCampaign(campaign.id);
      
      const resumed = campaignEngine.launchCampaign(campaign.id);
      
      expect(resumed?.status).toBe('active');
    });
  });

  describe('pauseCampaign', () => {
    it('should change status to paused', () => {
      const campaign = campaignEngine.createCampaign('Pause Test');
      campaignEngine.addTarget(campaign.id, 'audience', {}, 1000);
      campaignEngine.addContent(campaign.id, 'text', 'Content');
      campaignEngine.launchCampaign(campaign.id);
      
      const paused = campaignEngine.pauseCampaign(campaign.id);
      
      expect(paused?.status).toBe('paused');
    });

    it('should return null for non-active campaign', () => {
      const campaign = campaignEngine.createCampaign('Not Active');
      
      const result = campaignEngine.pauseCampaign(campaign.id);
      
      expect(result).toBeNull();
    });
  });

  describe('completeCampaign', () => {
    it('should change status to completed', () => {
      const campaign = campaignEngine.createCampaign('Complete Test');
      
      const completed = campaignEngine.completeCampaign(campaign.id);
      
      expect(completed?.status).toBe('completed');
    });

    it('should return null for non-existent campaign', () => {
      const result = campaignEngine.completeCampaign('fake');
      expect(result).toBeNull();
    });
  });

  describe('addTarget', () => {
    it('should add target to campaign', () => {
      const campaign = campaignEngine.createCampaign('Target Test');
      const target = campaignEngine.addTarget(campaign.id, 'audience', { age: '25-35' }, 5000);
      
      expect(target).not.toBeNull();
      expect(target?.id).toBeDefined();
      expect(target?.type).toBe('audience');
      expect(target?.criteria).toEqual({ age: '25-35' });
      expect(target?.estimatedReach).toBe(5000);
    });

    it('should ensure non-negative estimated reach', () => {
      const campaign = campaignEngine.createCampaign('Negative Reach');
      const target = campaignEngine.addTarget(campaign.id, 'segment', {}, -100);
      
      expect(target?.estimatedReach).toBe(0);
    });

    it('should return null for non-existent campaign', () => {
      const result = campaignEngine.addTarget('fake', 'audience', {}, 1000);
      expect(result).toBeNull();
    });
  });

  describe('removeTarget', () => {
    it('should remove target from campaign', () => {
      const campaign = campaignEngine.createCampaign('Remove Target');
      const target = campaignEngine.addTarget(campaign.id, 'audience', {}, 1000);
      
      const result = campaignEngine.removeTarget(campaign.id, target!.id);
      
      expect(result).toBe(true);
    });

    it('should return false for non-existent target', () => {
      const campaign = campaignEngine.createCampaign('No Target');
      
      const result = campaignEngine.removeTarget(campaign.id, 'fake');
      
      expect(result).toBe(false);
    });
  });

  describe('addContent', () => {
    it('should add content to campaign', () => {
      const campaign = campaignEngine.createCampaign('Content Test');
      const content = campaignEngine.addContent(campaign.id, 'text', 'Hello World', 'twitter');
      
      expect(content).not.toBeNull();
      expect(content?.id).toBeDefined();
      expect(content?.type).toBe('text');
      expect(content?.content).toBe('Hello World');
      expect(content?.platform).toBe('twitter');
    });

    it('should handle null content safely', () => {
      const campaign = campaignEngine.createCampaign('Null Content');
      const content = campaignEngine.addContent(campaign.id, 'text', null as any);
      
      expect(content?.content).toBe('');
    });

    it('should return null for non-existent campaign', () => {
      const result = campaignEngine.addContent('fake', 'text', 'Content');
      expect(result).toBeNull();
    });
  });

  describe('removeContent', () => {
    it('should remove content from campaign', () => {
      const campaign = campaignEngine.createCampaign('Remove Content');
      const content = campaignEngine.addContent(campaign.id, 'text', 'To Remove');
      
      const result = campaignEngine.removeContent(campaign.id, content!.id);
      
      expect(result).toBe(true);
    });

    it('should return false for non-existent content', () => {
      const campaign = campaignEngine.createCampaign('No Content');
      
      const result = campaignEngine.removeContent(campaign.id, 'fake');
      
      expect(result).toBe(false);
    });
  });

  describe('updateMetrics', () => {
    it('should update campaign metrics', () => {
      const campaign = campaignEngine.createCampaign('Metrics Update');
      const updated = campaignEngine.updateMetrics(campaign.id, {
        impressions: 1000,
        clicks: 100,
        conversions: 10,
      });
      
      expect(updated?.impressions).toBe(1000);
      expect(updated?.clicks).toBe(100);
      expect(updated?.conversions).toBe(10);
    });

    it('should preserve existing metrics', () => {
      const campaign = campaignEngine.createCampaign('Preserve Metrics');
      campaignEngine.updateMetrics(campaign.id, { impressions: 500 });
      
      const updated = campaignEngine.updateMetrics(campaign.id, { clicks: 50 });
      
      expect(updated?.impressions).toBe(500);
      expect(updated?.clicks).toBe(50);
    });

    it('should return null for non-existent campaign', () => {
      const result = campaignEngine.updateMetrics('fake', { impressions: 100 });
      expect(result).toBeNull();
    });
  });

  describe('simulateMetrics', () => {
    it('should generate metrics for active campaign', () => {
      const campaign = campaignEngine.createCampaign('Simulate Test');
      campaignEngine.addTarget(campaign.id, 'audience', {}, 10000);
      campaignEngine.addContent(campaign.id, 'text', 'Content');
      campaignEngine.launchCampaign(campaign.id);
      
      const metrics = campaignEngine.simulateMetrics(campaign.id);
      
      expect(metrics).not.toBeNull();
      expect(metrics?.impressions).toBeGreaterThan(0);
    });

    it('should return null for non-active campaign', () => {
      const campaign = campaignEngine.createCampaign('Not Active');
      
      const result = campaignEngine.simulateMetrics(campaign.id);
      
      expect(result).toBeNull();
    });
  });

  describe('templates', () => {
    it('should return available templates', () => {
      const templates = campaignEngine.getTemplates();
      
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should return template by id', () => {
      const template = campaignEngine.getTemplate('product-launch');
      
      expect(template).toBeDefined();
      expect(template?.name).toBe('Product Launch');
    });

    it('should return undefined for unknown template', () => {
      const template = campaignEngine.getTemplate('unknown');
      expect(template).toBeUndefined();
    });

    it('should create campaign from template', () => {
      const campaign = campaignEngine.createFromTemplate('brand-awareness', 'My Brand Campaign');
      
      expect(campaign).not.toBeNull();
      expect(campaign?.name).toBe('My Brand Campaign');
      expect(campaign?.type).toBe('social');
      expect(campaign?.targets.length).toBeGreaterThan(0);
    });

    it('should return null for unknown template', () => {
      const campaign = campaignEngine.createFromTemplate('unknown', 'Test');
      expect(campaign).toBeNull();
    });
  });

  describe('getCampaignHistory', () => {
    it('should return campaign events', () => {
      const campaign = campaignEngine.createCampaign('History Test');
      
      const history = campaignEngine.getCampaignHistory(campaign.id);
      
      expect(history.some(e => e.type === 'created')).toBe(true);
    });

    it('should return events for specific campaign', () => {
      const c1 = campaignEngine.createCampaign('Campaign 1');
      campaignEngine.createCampaign('Campaign 2');
      
      const history = campaignEngine.getCampaignHistory(c1.id);
      
      expect(history.every(e => e.campaignId === c1.id)).toBe(true);
    });

    it('should respect limit parameter', () => {
      const campaign = campaignEngine.createCampaign('Limit Test');
      campaignEngine.updateCampaign(campaign.id, { name: 'Updated 1' });
      campaignEngine.updateCampaign(campaign.id, { name: 'Updated 2' });
      
      const history = campaignEngine.getCampaignHistory(campaign.id, 2);
      
      expect(history.length).toBeLessThanOrEqual(2);
    });
  });

  describe('getCampaignStats', () => {
    it('should return total campaigns', () => {
      campaignEngine.createCampaign('Stats Test');
      
      const stats = campaignEngine.getCampaignStats();
      
      expect(stats.total).toBeGreaterThan(0);
    });

    it('should return by status breakdown', () => {
      const stats = campaignEngine.getCampaignStats();
      
      expect(stats.byStatus).toBeDefined();
    });

    it('should return by type breakdown', () => {
      campaignEngine.createCampaign('Email', 'email');
      campaignEngine.createCampaign('Social', 'social');
      
      const stats = campaignEngine.getCampaignStats();
      
      expect(stats.byType).toBeDefined();
    });

    it('should return total reach', () => {
      const campaign = campaignEngine.createCampaign('Reach Test');
      campaignEngine.addTarget(campaign.id, 'audience', {}, 5000);
      
      const stats = campaignEngine.getCampaignStats();
      
      expect(stats.totalReach).toBeGreaterThanOrEqual(5000);
    });
  });
});
