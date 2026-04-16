/**
 * Tests for memoryEngine.ts
 * Tests CRUD operations, querying, stats, and memory management
 */

// We need to reset the module state between tests
let memoryEngine: typeof import('@/lib/memoryEngine');

beforeEach(() => {
  jest.resetModules();
  // Re-import to get a fresh module with reset state
  memoryEngine = require('@/lib/memoryEngine');
});

describe('memoryEngine', () => {
  describe('storeMemory', () => {
    it('should store a memory with default values', () => {
      const result = memoryEngine.storeMemory('Test content');
      
      expect(result.id).toBeDefined();
      expect(result.content).toBe('Test content');
      expect(result.type).toBe('semantic'); // default type
      expect(result.tags).toEqual([]);
      expect(result.pinned).toBe(false);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should store a memory with specified type', () => {
      const result = memoryEngine.storeMemory('Doctrine content', 'doctrinal');
      expect(result.type).toBe('doctrinal');
    });

    it('should store a memory with tags', () => {
      const tags = ['important', 'review'];
      const result = memoryEngine.storeMemory('Tagged content', 'semantic', tags);
      expect(result.tags).toEqual(tags);
    });

    it('should store a memory with custom coordinates', () => {
      const coords = { theta: 45, phi: 90, depth: 5, ring: 3, beat: 10 };
      const result = memoryEngine.storeMemory('Positioned content', 'spatial', [], coords);
      
      expect(result.coordinates.theta).toBe(45);
      expect(result.coordinates.phi).toBe(90);
      expect(result.coordinates.depth).toBe(5);
      expect(result.coordinates.ring).toBe(3);
      expect(result.coordinates.beat).toBe(10);
    });

    it('should assign random coordinates when not specified', () => {
      const result = memoryEngine.storeMemory('Random position');
      
      expect(result.coordinates.theta).toBeGreaterThanOrEqual(0);
      expect(result.coordinates.theta).toBeLessThanOrEqual(360);
      expect(result.coordinates.phi).toBeGreaterThanOrEqual(0);
      expect(result.coordinates.phi).toBeLessThanOrEqual(180);
    });

    it('should generate salience and doctrineAlignment scores', () => {
      const result = memoryEngine.storeMemory('Scored content');
      
      expect(result.salience).toBeGreaterThanOrEqual(0.5);
      expect(result.salience).toBeLessThanOrEqual(1);
      expect(result.doctrineAlignment).toBeGreaterThanOrEqual(0.6);
      expect(result.doctrineAlignment).toBeLessThanOrEqual(1);
    });

    it('should set lineageId to own id when no parent', () => {
      const result = memoryEngine.storeMemory('Root memory');
      expect(result.lineageId).toBe(result.id);
      expect(result.parentId).toBeUndefined();
    });

    it('should inherit lineageId from parent', () => {
      const parent = memoryEngine.storeMemory('Parent memory');
      const child = memoryEngine.storeMemory('Child memory', 'semantic', [], undefined, parent.id);
      
      expect(child.parentId).toBe(parent.id);
      expect(child.lineageId).toBe(parent.id);
    });
  });

  describe('getMemory', () => {
    it('should retrieve a stored memory by id', () => {
      const stored = memoryEngine.storeMemory('Get test');
      const retrieved = memoryEngine.getMemory(stored.id);
      
      expect(retrieved).toEqual(stored);
    });

    it('should return undefined for non-existent id', () => {
      const result = memoryEngine.getMemory('non-existent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('updateMemory', () => {
    it('should update memory content', () => {
      const stored = memoryEngine.storeMemory('Original content');
      const updated = memoryEngine.updateMemory(stored.id, { content: 'Updated content' });
      
      expect(updated).not.toBeNull();
      expect(updated?.content).toBe('Updated content');
    });

    it('should update memory tags', () => {
      const stored = memoryEngine.storeMemory('Tag test', 'semantic', ['old']);
      const updated = memoryEngine.updateMemory(stored.id, { tags: ['new', 'updated'] });
      
      expect(updated?.tags).toEqual(['new', 'updated']);
    });

    it('should update salience', () => {
      const stored = memoryEngine.storeMemory('Salience test');
      const updated = memoryEngine.updateMemory(stored.id, { salience: 0.95 });
      
      expect(updated?.salience).toBe(0.95);
    });

    it('should preserve id on update', () => {
      const stored = memoryEngine.storeMemory('ID test');
      const updated = memoryEngine.updateMemory(stored.id, { content: 'New content' });
      
      expect(updated?.id).toBe(stored.id);
    });

    it('should set updatedAt timestamp on update', () => {
      const stored = memoryEngine.storeMemory('Timestamp test');
      
      const updated = memoryEngine.updateMemory(stored.id, { content: 'New' });
      
      // Just verify updatedAt is set to a valid timestamp
      expect(updated?.updatedAt).toBeDefined();
      expect(new Date(updated!.updatedAt).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should return null for non-existent memory', () => {
      const result = memoryEngine.updateMemory('fake-id', { content: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('deleteMemory', () => {
    it('should delete a stored memory', () => {
      const stored = memoryEngine.storeMemory('To delete');
      const result = memoryEngine.deleteMemory(stored.id);
      
      expect(result).toBe(true);
      expect(memoryEngine.getMemory(stored.id)).toBeUndefined();
    });

    it('should return false for non-existent memory', () => {
      const result = memoryEngine.deleteMemory('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('pinMemory / unpinMemory', () => {
    it('should pin a memory', () => {
      const stored = memoryEngine.storeMemory('To pin');
      expect(stored.pinned).toBe(false);
      
      const pinned = memoryEngine.pinMemory(stored.id);
      expect(pinned?.pinned).toBe(true);
    });

    it('should unpin a pinned memory', () => {
      const stored = memoryEngine.storeMemory('To unpin');
      memoryEngine.pinMemory(stored.id);
      
      const unpinned = memoryEngine.unpinMemory(stored.id);
      expect(unpinned?.pinned).toBe(false);
    });

    it('should return null for non-existent memory', () => {
      expect(memoryEngine.pinMemory('fake')).toBeNull();
      expect(memoryEngine.unpinMemory('fake')).toBeNull();
    });
  });

  describe('queryMemory', () => {
    beforeEach(() => {
      // Clear and add test memories
      memoryEngine.storeMemory('Alpha test content', 'semantic', ['alpha', 'test']);
      memoryEngine.storeMemory('Beta important document', 'doctrinal', ['beta', 'important']);
      memoryEngine.storeMemory('Gamma procedure steps', 'procedural', ['gamma']);
    });

    it('should find memories by content match', () => {
      const result = memoryEngine.queryMemory({ query: 'alpha' });
      
      expect(result.entries.some(e => e.content.includes('Alpha'))).toBe(true);
    });

    it('should find memories by tag match', () => {
      const result = memoryEngine.queryMemory({ query: 'important' });
      
      expect(result.entries.some(e => e.tags.includes('important'))).toBe(true);
    });

    it('should filter by type', () => {
      const result = memoryEngine.queryMemory({ query: '', type: 'doctrinal' });
      
      expect(result.entries.every(e => e.type === 'doctrinal')).toBe(true);
    });

    it('should filter by minimum salience', () => {
      // Update a memory to have specific salience
      const stored = memoryEngine.storeMemory('High salience');
      memoryEngine.updateMemory(stored.id, { salience: 0.99 });
      
      const result = memoryEngine.queryMemory({ query: '', minSalience: 0.98 });
      
      expect(result.entries.every(e => e.salience >= 0.98)).toBe(true);
    });

    it('should filter by minimum doctrine alignment', () => {
      const result = memoryEngine.queryMemory({ query: '', minDoctrineAlignment: 0.95 });
      
      expect(result.entries.every(e => e.doctrineAlignment >= 0.95)).toBe(true);
    });

    it('should filter by ring', () => {
      const stored = memoryEngine.storeMemory('Ring 5 memory', 'semantic', [], { ring: 5 });
      
      const result = memoryEngine.queryMemory({ query: '', ring: 5 });
      
      expect(result.entries.some(e => e.coordinates.ring === 5)).toBe(true);
    });

    it('should filter by lineageId', () => {
      const parent = memoryEngine.storeMemory('Parent');
      const child1 = memoryEngine.storeMemory('Child 1', 'semantic', [], undefined, parent.id);
      const child2 = memoryEngine.storeMemory('Child 2', 'semantic', [], undefined, parent.id);
      
      const result = memoryEngine.queryMemory({ query: '', lineageId: parent.id });
      
      // Should include parent and both children
      expect(result.entries.length).toBeGreaterThanOrEqual(3);
    });

    it('should respect limit parameter', () => {
      const result = memoryEngine.queryMemory({ query: '', limit: 2 });
      expect(result.entries.length).toBeLessThanOrEqual(2);
    });

    it('should sort results by salience descending', () => {
      const result = memoryEngine.queryMemory({ query: '' });
      
      for (let i = 1; i < result.entries.length; i++) {
        expect(result.entries[i - 1].salience).toBeGreaterThanOrEqual(result.entries[i].salience);
      }
    });

    it('should include query time in result', () => {
      const result = memoryEngine.queryMemory({ query: 'test' });
      expect(typeof result.queryTime).toBe('number');
      expect(result.queryTime).toBeGreaterThanOrEqual(0);
    });

    it('should return totalCount', () => {
      const result = memoryEngine.queryMemory({ query: '' });
      expect(result.totalCount).toBe(result.entries.length);
    });
  });

  describe('listMemories', () => {
    it('should list memories sorted by createdAt descending', () => {
      memoryEngine.storeMemory('First');
      memoryEngine.storeMemory('Second');
      memoryEngine.storeMemory('Third');
      
      const list = memoryEngine.listMemories();
      
      for (let i = 1; i < list.length; i++) {
        expect(new Date(list[i - 1].createdAt).getTime())
          .toBeGreaterThanOrEqual(new Date(list[i].createdAt).getTime());
      }
    });

    it('should respect limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        memoryEngine.storeMemory(`Memory ${i}`);
      }
      
      const list = memoryEngine.listMemories(5);
      expect(list.length).toBeLessThanOrEqual(5);
    });

    it('should default to limit of 20', () => {
      for (let i = 0; i < 25; i++) {
        memoryEngine.storeMemory(`Memory ${i}`);
      }
      
      const list = memoryEngine.listMemories();
      expect(list.length).toBeLessThanOrEqual(20);
    });
  });

  describe('getPinnedMemories', () => {
    it('should return only pinned memories', () => {
      const m1 = memoryEngine.storeMemory('Not pinned');
      const m2 = memoryEngine.storeMemory('Pinned 1');
      const m3 = memoryEngine.storeMemory('Pinned 2');
      
      memoryEngine.pinMemory(m2.id);
      memoryEngine.pinMemory(m3.id);
      
      const pinned = memoryEngine.getPinnedMemories();
      
      // Should include seeds plus our 2 pinned
      expect(pinned.every(m => m.pinned)).toBe(true);
      expect(pinned.some(m => m.id === m2.id)).toBe(true);
      expect(pinned.some(m => m.id === m3.id)).toBe(true);
      expect(pinned.some(m => m.id === m1.id)).toBe(false);
    });
  });

  describe('getMemoryLineage', () => {
    it('should return all memories in a lineage', () => {
      const root = memoryEngine.storeMemory('Root');
      const child1 = memoryEngine.storeMemory('Child 1', 'semantic', [], undefined, root.id);
      const child2 = memoryEngine.storeMemory('Child 2', 'semantic', [], undefined, root.id);
      const grandchild = memoryEngine.storeMemory('Grandchild', 'semantic', [], undefined, child1.id);
      
      const lineage = memoryEngine.getMemoryLineage(root.id);
      
      expect(lineage.length).toBe(4);
      expect(lineage.map(m => m.id)).toContain(root.id);
      expect(lineage.map(m => m.id)).toContain(child1.id);
      expect(lineage.map(m => m.id)).toContain(child2.id);
      expect(lineage.map(m => m.id)).toContain(grandchild.id);
    });

    it('should sort lineage by createdAt ascending', () => {
      const root = memoryEngine.storeMemory('Root');
      memoryEngine.storeMemory('Child', 'semantic', [], undefined, root.id);
      
      const lineage = memoryEngine.getMemoryLineage(root.id);
      
      for (let i = 1; i < lineage.length; i++) {
        expect(new Date(lineage[i - 1].createdAt).getTime())
          .toBeLessThanOrEqual(new Date(lineage[i].createdAt).getTime());
      }
    });

    it('should return empty array for non-existent lineageId', () => {
      const lineage = memoryEngine.getMemoryLineage('non-existent');
      expect(lineage).toEqual([]);
    });
  });

  describe('getRootMemory', () => {
    it('should find a root memory without parent at ring 1', () => {
      const root = memoryEngine.getRootMemory();
      
      // The seed data includes root memories
      expect(root).toBeDefined();
      expect(root?.parentId).toBeUndefined();
      expect(root?.coordinates.ring).toBe(1);
    });
  });

  describe('getMemoryStats', () => {
    it('should return total count', () => {
      const stats = memoryEngine.getMemoryStats();
      expect(typeof stats.total).toBe('number');
      expect(stats.total).toBeGreaterThan(0); // Seed data exists
    });

    it('should return pinned count', () => {
      const m = memoryEngine.storeMemory('To pin');
      memoryEngine.pinMemory(m.id);
      
      const stats = memoryEngine.getMemoryStats();
      expect(stats.pinned).toBeGreaterThan(0);
    });

    it('should return count by type', () => {
      memoryEngine.storeMemory('Semantic', 'semantic');
      memoryEngine.storeMemory('Doctrinal', 'doctrinal');
      memoryEngine.storeMemory('Procedural', 'procedural');
      
      const stats = memoryEngine.getMemoryStats();
      
      expect(stats.byType).toBeDefined();
      expect(stats.byType['semantic']).toBeGreaterThan(0);
    });

    it('should return average salience', () => {
      const stats = memoryEngine.getMemoryStats();
      
      expect(stats.avgSalience).toBeGreaterThan(0);
      expect(stats.avgSalience).toBeLessThanOrEqual(1);
    });
  });
});
