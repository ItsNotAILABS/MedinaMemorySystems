/**
 * SEMPER MEMORIA ENGINE TESTS
 *
 * Tests for the eternal memory lineage system.
 */

import {
  createLineage,
  forkLineage,
  mergeLineage,
  getLineage,
  listLineages,
  appendShard,
  getShard,
  getLineageShards,
  summarizeLineage,
  grantAccess,
  revokeAccess,
  checkAccess,
  listAccessGrants,
  setRetentionPolicy,
  getRetentionPolicy,
  applyRetentionPolicy,
  getSemperMemoriaStats,
  getRootLineageId,
} from '../lib/semperMemoriaEngine';

describe('Semper Memoria Engine', () => {
  describe('Lineage Operations', () => {
    it('should have a root lineage', () => {
      const rootId = getRootLineageId();
      expect(rootId).toBeDefined();
      expect(typeof rootId).toBe('string');

      const root = getLineage(rootId);
      expect(root).toBeDefined();
      expect(root?.name).toBe('Sovereign Root');
      expect(root?.depth).toBe(0);
    });

    it('should create a new lineage', () => {
      const lineage = createLineage('Test Lineage', 'test-user');
      
      expect(lineage.id).toBeDefined();
      expect(lineage.name).toBe('Test Lineage');
      expect(lineage.depth).toBeGreaterThan(0);
      expect(lineage.status).toBe('active');
      expect(lineage.createdBy).toBe('test-user');
    });

    it('should fork an existing lineage', () => {
      const parent = createLineage('Parent Lineage', 'test-user');
      const forked = forkLineage(parent.id, 'fork-user', 'Forked Lineage');
      
      expect(forked.id).not.toBe(parent.id);
      expect(forked.parentId).toBe(parent.id);
      expect(forked.depth).toBe(parent.depth + 1);
      expect(forked.name).toBe('Forked Lineage');
    });

    it('should list lineages with optional status filter', () => {
      const allLineages = listLineages();
      expect(Array.isArray(allLineages)).toBe(true);
      expect(allLineages.length).toBeGreaterThan(0);

      const activeLineages = listLineages('active');
      expect(activeLineages.every((l) => l.status === 'active')).toBe(true);
    });

    it('should merge two lineages', () => {
      const source = createLineage('Source Lineage', 'merge-test');
      appendShard(source.id, { content: 'Source content', scope: 'internal', createdBy: 'merge-test' });

      const target = createLineage('Target Lineage', 'merge-test');
      
      const result = mergeLineage(source.id, target.id, 'merge-test');
      
      expect(result.success).toBe(true);
      expect(result.shardsTransferred).toBeGreaterThanOrEqual(0);
      expect(result.lineage.mergedFrom).toContain(source.id);

      // Source should be marked as merged
      const mergedSource = getLineage(source.id);
      expect(mergedSource?.status).toBe('merged');
    });

    it('should report conflicts during merge', () => {
      const source = createLineage('Conflict Source', 'conflict-test');
      const target = createLineage('Conflict Target', 'conflict-test');

      // Add same content to both
      appendShard(source.id, { content: 'Duplicate content', scope: 'internal', createdBy: 'conflict-test' });
      appendShard(target.id, { content: 'Duplicate content', scope: 'internal', createdBy: 'conflict-test' });

      const result = mergeLineage(source.id, target.id, 'conflict-test');
      
      expect(result.success).toBe(true);
      expect(result.conflicts.length).toBeGreaterThan(0);
      expect(result.conflicts[0].conflictType).toBe('content-collision');
    });
  });

  describe('Shard Operations', () => {
    it('should append a shard to a lineage', () => {
      const lineage = createLineage('Shard Test Lineage', 'shard-test');
      
      const shard = appendShard(lineage.id, {
        content: 'Test shard content',
        scope: 'internal',
        tags: ['test', 'shard'],
        createdBy: 'shard-test',
      });

      expect(shard.id).toBeDefined();
      expect(shard.lineageId).toBe(lineage.id);
      expect(shard.content).toBe('Test shard content');
      expect(shard.contentHash).toBeDefined();
      expect(shard.tags).toContain('test');
    });

    it('should get a shard by ID', () => {
      const lineage = createLineage('Get Shard Lineage', 'shard-test');
      const created = appendShard(lineage.id, {
        content: 'Get me',
        scope: 'public',
        createdBy: 'shard-test',
      });

      const retrieved = getShard(created.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.content).toBe('Get me');
    });

    it('should list shards in a lineage', () => {
      const lineage = createLineage('List Shards Lineage', 'shard-test');
      
      appendShard(lineage.id, { content: 'First', scope: 'internal', createdBy: 'shard-test' });
      appendShard(lineage.id, { content: 'Second', scope: 'internal', createdBy: 'shard-test' });
      appendShard(lineage.id, { content: 'Third', scope: 'internal', createdBy: 'shard-test' });

      const shards = getLineageShards(lineage.id);
      expect(shards.length).toBe(3);
    });

    it('should summarize a lineage', () => {
      const lineage = createLineage('Summary Lineage', 'summary-test');
      appendShard(lineage.id, { content: 'Summary content', scope: 'enterprise', createdBy: 'summary-test' });

      const summary = summarizeLineage(lineage.id);
      
      expect(summary.lineageId).toBe(lineage.id);
      expect(summary.shardCount).toBeGreaterThan(0);
      expect(summary.totalBytes).toBeGreaterThan(0);
      expect(summary.summary).toContain('Summary Lineage');
    });

    it('should support different compression levels', () => {
      const lineage = createLineage('Compression Lineage', 'compression-test');
      
      const raw = appendShard(lineage.id, { content: 'Raw', scope: 'internal', compressionLevel: 0, createdBy: 'compression-test' });
      const archive = appendShard(lineage.id, { content: 'Archive', scope: 'sovereign', compressionLevel: 3, createdBy: 'compression-test' });

      expect(raw.compressionLevel).toBe(0);
      expect(archive.compressionLevel).toBe(3);
    });
  });

  describe('Access Control', () => {
    it('should grant access to a lineage', () => {
      const lineage = createLineage('Access Lineage', 'access-test');
      
      const grant = grantAccess(lineage.id, 'user-123', 'enterprise', 'admin');
      
      expect(grant.id).toBeDefined();
      expect(grant.lineageId).toBe(lineage.id);
      expect(grant.entity).toBe('user-123');
      expect(grant.scope).toBe('enterprise');
      expect(grant.revoked).toBe(false);
    });

    it('should check access correctly', () => {
      const lineage = createLineage('Check Access Lineage', 'access-test');
      grantAccess(lineage.id, 'user-456', 'internal', 'admin');

      // User should have access at granted scope
      expect(checkAccess(lineage.id, 'user-456', 'internal')).toBe(true);
      expect(checkAccess(lineage.id, 'user-456', 'enterprise')).toBe(true);
      
      // User should not have higher scope access
      expect(checkAccess(lineage.id, 'user-456', 'sovereign')).toBe(false);

      // Public is always accessible
      expect(checkAccess(lineage.id, 'unknown-user', 'public')).toBe(true);
    });

    it('should revoke access', () => {
      const lineage = createLineage('Revoke Access Lineage', 'access-test');
      grantAccess(lineage.id, 'user-789', 'enterprise', 'admin');
      
      expect(checkAccess(lineage.id, 'user-789', 'enterprise')).toBe(true);
      
      const revoked = revokeAccess(lineage.id, 'user-789', 'admin');
      expect(revoked).toBe(true);
      
      expect(checkAccess(lineage.id, 'user-789', 'enterprise')).toBe(false);
    });

    it('should list access grants', () => {
      const lineage = createLineage('List Grants Lineage', 'access-test');
      grantAccess(lineage.id, 'user-a', 'public', 'admin');
      grantAccess(lineage.id, 'user-b', 'enterprise', 'admin');

      const grants = listAccessGrants(lineage.id);
      expect(grants.length).toBe(2);
    });
  });

  describe('Retention Policy', () => {
    it('should set and get retention policy', () => {
      const lineage = createLineage('Retention Lineage', 'retention-test');
      
      const policy = setRetentionPolicy(lineage.id, {
        maxShards: 100,
        maxAgeSeconds: 86400,
        compressionThreshold: 3600,
        autoArchive: true,
        autoPrune: false,
      });

      expect(policy.lineageId).toBe(lineage.id);
      expect(policy.maxShards).toBe(100);

      const retrieved = getRetentionPolicy(lineage.id);
      expect(retrieved).toEqual(policy);
    });

    it('should apply retention policy', () => {
      const lineage = createLineage('Apply Retention Lineage', 'retention-test');
      appendShard(lineage.id, { content: 'Test', scope: 'internal', createdBy: 'retention-test' });
      
      setRetentionPolicy(lineage.id, {
        maxShards: 1000,
        maxAgeSeconds: 999999,
        compressionThreshold: 1,
        autoArchive: false,
        autoPrune: false,
      });

      const result = applyRetentionPolicy(lineage.id);
      expect(typeof result.pruned).toBe('number');
      expect(typeof result.compressed).toBe('number');
    });
  });

  describe('Statistics', () => {
    it('should return correct statistics', () => {
      const stats = getSemperMemoriaStats();
      
      expect(stats.totalLineages).toBeGreaterThan(0);
      expect(stats.totalShards).toBeGreaterThan(0);
      expect(stats.byStatus).toBeDefined();
      expect(stats.byScope).toBeDefined();
      expect(typeof stats.totalGrants).toBe('number');
      expect(typeof stats.activeGrants).toBe('number');
    });
  });
});
