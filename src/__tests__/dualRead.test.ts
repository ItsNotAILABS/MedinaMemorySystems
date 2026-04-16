/**
 * Tests for dualRead.ts
 * Tests combined semantic and resonance search functionality
 */

// Reset module state between tests
let dualRead: typeof import('@/lib/dualRead');
let memoryEngine: typeof import('@/lib/memoryEngine');

beforeEach(() => {
  jest.resetModules();
  dualRead = require('@/lib/dualRead');
  memoryEngine = require('@/lib/memoryEngine');
});

describe('dualRead', () => {
  describe('dualRead function', () => {
    it('should return a DualReadResult', () => {
      const result = dualRead.dualRead('test query');
      
      expect(result).toHaveProperty('semanticScore');
      expect(result).toHaveProperty('resonanceScore');
      expect(result).toHaveProperty('combinedScore');
      expect(result).toHaveProperty('semanticMatches');
      expect(result).toHaveProperty('resonanceMatches');
      expect(result).toHaveProperty('unified');
    });

    it('should return semantic matches', () => {
      // Add memories with searchable content
      memoryEngine.storeMemory('Alpha semantic test content', 'semantic', ['alpha']);
      memoryEngine.storeMemory('Beta semantic test content', 'semantic', ['beta']);
      
      const result = dualRead.dualRead('semantic test');
      
      expect(result.semanticMatches.length).toBeGreaterThan(0);
    });

    it('should return resonance matches sorted by score', () => {
      // Add memories with resonance scores
      const m1 = memoryEngine.storeMemory('High resonance memory', 'semantic');
      const m2 = memoryEngine.storeMemory('Low resonance memory', 'semantic');
      
      memoryEngine.updateMemory(m1.id, { resonanceScore: 0.95 });
      memoryEngine.updateMemory(m2.id, { resonanceScore: 0.5 });
      
      const result = dualRead.dualRead('memory');
      
      // Resonance matches should be sorted by resonance score descending
      const resonanceScores = result.resonanceMatches.map(e => e.resonanceScore || 0);
      for (let i = 1; i < resonanceScores.length; i++) {
        expect(resonanceScores[i - 1]).toBeGreaterThanOrEqual(resonanceScores[i]);
      }
    });

    it('should return unified results combining both reads', () => {
      memoryEngine.storeMemory('Unified test content', 'semantic', ['unified']);
      
      const result = dualRead.dualRead('unified');
      
      expect(result.unified.length).toBeGreaterThan(0);
    });

    it('should respect limit parameter for semantic matches', () => {
      // Add multiple memories
      for (let i = 0; i < 10; i++) {
        memoryEngine.storeMemory(`Limited content ${i}`, 'semantic', ['limited']);
      }
      
      const result = dualRead.dualRead('limited', 3);
      
      expect(result.semanticMatches.length).toBeLessThanOrEqual(3);
    });

    it('should respect limit parameter for resonance matches', () => {
      // Add multiple memories
      for (let i = 0; i < 10; i++) {
        const m = memoryEngine.storeMemory(`Resonance test ${i}`, 'semantic');
        memoryEngine.updateMemory(m.id, { resonanceScore: Math.random() });
      }
      
      const result = dualRead.dualRead('resonance', 3);
      
      expect(result.resonanceMatches.length).toBeLessThanOrEqual(3);
    });

    it('should respect limit parameter for unified results', () => {
      for (let i = 0; i < 10; i++) {
        memoryEngine.storeMemory(`Unified limit ${i}`, 'semantic');
      }
      
      const result = dualRead.dualRead('unified', 5);
      
      expect(result.unified.length).toBeLessThanOrEqual(5);
    });

    it('should calculate semantic score', () => {
      memoryEngine.storeMemory('High salience content', 'doctrinal');
      
      const result = dualRead.dualRead('salience');
      
      expect(typeof result.semanticScore).toBe('number');
      expect(result.semanticScore).toBeGreaterThanOrEqual(0);
      expect(result.semanticScore).toBeLessThanOrEqual(1);
    });

    it('should calculate resonance score', () => {
      const m = memoryEngine.storeMemory('Resonance test', 'semantic');
      memoryEngine.updateMemory(m.id, { resonanceScore: 0.8 });
      
      const result = dualRead.dualRead('resonance');
      
      expect(typeof result.resonanceScore).toBe('number');
      expect(result.resonanceScore).toBeGreaterThanOrEqual(0);
      expect(result.resonanceScore).toBeLessThanOrEqual(1);
    });

    it('should calculate combined score as average', () => {
      const m = memoryEngine.storeMemory('Combined score test', 'semantic');
      memoryEngine.updateMemory(m.id, { resonanceScore: 0.8, salience: 0.9 });
      
      const result = dualRead.dualRead('combined');
      
      expect(typeof result.combinedScore).toBe('number');
      // Combined score is average of semantic and resonance
      expect(result.combinedScore).toBeCloseTo((result.semanticScore + result.resonanceScore) / 2, 2);
    });

    it('should handle empty query', () => {
      const result = dualRead.dualRead('');
      
      // Should return results (all memories match empty query)
      expect(result).toBeDefined();
      expect(Array.isArray(result.semanticMatches)).toBe(true);
    });

    it('should handle query with no matches', () => {
      const result = dualRead.dualRead('xyznonexistent123');
      
      // Should return empty or minimal results
      expect(result).toBeDefined();
      expect(Array.isArray(result.unified)).toBe(true);
    });

    it('should default limit to 10', () => {
      // Add many memories
      for (let i = 0; i < 20; i++) {
        memoryEngine.storeMemory(`Default limit ${i}`, 'semantic', ['default']);
      }
      
      const result = dualRead.dualRead('default');
      
      // Default limit should be 10
      expect(result.unified.length).toBeLessThanOrEqual(10);
    });

    it('should find memories by tags', () => {
      memoryEngine.storeMemory('Tagged memory', 'semantic', ['special-tag']);
      
      const result = dualRead.dualRead('special-tag');
      
      expect(result.semanticMatches.some(m => m.tags.includes('special-tag'))).toBe(true);
    });

    it('should prioritize high combined scores in unified results', () => {
      // Create memories with different scores
      const low = memoryEngine.storeMemory('Low score content', 'semantic');
      const high = memoryEngine.storeMemory('High score content', 'semantic');
      
      memoryEngine.updateMemory(low.id, { salience: 0.3, resonanceScore: 0.3 });
      memoryEngine.updateMemory(high.id, { salience: 0.95, resonanceScore: 0.95 });
      
      const result = dualRead.dualRead('score content');
      
      // High score memory should appear in unified results
      expect(result.unified.some(m => m.id === high.id)).toBe(true);
    });

    it('should include memories in unified even if only in one read', () => {
      // Memory with good semantic match but lower resonance
      const semantic = memoryEngine.storeMemory('Semantic only keyword match', 'semantic');
      memoryEngine.updateMemory(semantic.id, { resonanceScore: 0.1, salience: 0.9 });
      
      // Memory with good resonance but poor semantic
      const resonance = memoryEngine.storeMemory('Different content', 'semantic');
      memoryEngine.updateMemory(resonance.id, { resonanceScore: 0.95, salience: 0.9 });
      
      const result = dualRead.dualRead('keyword');
      
      // Unified should combine both
      expect(result.unified.length).toBeGreaterThan(0);
    });
  });

  describe('score calculations', () => {
    it('should have semantic score based on salience', () => {
      // Create memory with specific salience
      const m = memoryEngine.storeMemory('Salience test memory', 'doctrinal');
      memoryEngine.updateMemory(m.id, { salience: 0.85 });
      
      const result = dualRead.dualRead('salience test');
      
      // Semantic score should be influenced by salience
      expect(result.semanticScore).toBeGreaterThan(0);
    });

    it('should have resonance score based on resonanceScore field', () => {
      const m = memoryEngine.storeMemory('Resonance field test', 'semantic');
      memoryEngine.updateMemory(m.id, { resonanceScore: 0.9 });
      
      const result = dualRead.dualRead('resonance');
      
      expect(result.resonanceScore).toBeGreaterThan(0);
    });

    it('should return zero scores for empty results', () => {
      // Query that matches nothing
      const result = dualRead.dualRead('xyznonexistent987654321');
      
      // Scores should be 0 when no matches
      if (result.semanticMatches.length === 0) {
        expect(result.semanticScore).toBe(0);
      }
    });
  });

  describe('integration with memoryEngine', () => {
    it('should use memoryEngine.queryMemory for semantic search', () => {
      // This test verifies integration
      memoryEngine.storeMemory('Integration semantic search', 'semantic', ['integration']);
      
      const result = dualRead.dualRead('integration');
      
      // Should find the memory through semantic search
      expect(result.semanticMatches.some(m => 
        m.content.includes('Integration') || m.tags.includes('integration')
      )).toBe(true);
    });

    it('should use memoryEngine.listMemories for resonance search', () => {
      // Add memories with resonance scores
      const m = memoryEngine.storeMemory('Resonance integration test', 'semantic');
      memoryEngine.updateMemory(m.id, { resonanceScore: 0.85 });
      
      const result = dualRead.dualRead('resonance');
      
      // Should include memories with resonance scores
      expect(result.resonanceMatches.some(m => m.resonanceScore !== undefined)).toBe(true);
    });

    it('should work with different memory types', () => {
      memoryEngine.storeMemory('Doctrinal type', 'doctrinal', ['doctrinal-test']);
      memoryEngine.storeMemory('Procedural type', 'procedural', ['procedural-test']);
      memoryEngine.storeMemory('Episodic type', 'episodic', ['episodic-test']);
      
      const doctrinalResult = dualRead.dualRead('doctrinal-test');
      const proceduralResult = dualRead.dualRead('procedural-test');
      const episodicResult = dualRead.dualRead('episodic-test');
      
      expect(doctrinalResult.semanticMatches.length).toBeGreaterThan(0);
      expect(proceduralResult.semanticMatches.length).toBeGreaterThan(0);
      expect(episodicResult.semanticMatches.length).toBeGreaterThan(0);
    });
  });
});
