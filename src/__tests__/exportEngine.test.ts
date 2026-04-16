/**
 * Tests for exportEngine.ts
 * Tests PDF, Excel, JSON export and content generation
 */

// Reset module state between tests
let exportEngine: typeof import('@/lib/exportEngine');

beforeEach(() => {
  jest.resetModules();
  exportEngine = require('@/lib/exportEngine');
});

describe('exportEngine', () => {
  describe('generatePDF', () => {
    it('should generate PDF successfully', async () => {
      const result = await exportEngine.generatePDF('Test Document', { key: 'value' });
      
      expect(result.success).toBe(true);
      expect(result.filename).toContain('test-document');
      expect(result.filename).toContain('.pdf');
    });

    it('should include timestamp in filename', async () => {
      const result = await exportEngine.generatePDF('Test', {});
      
      expect(result.filename).toMatch(/test-\d+\.pdf/);
    });

    it('should create blob URL', async () => {
      const result = await exportEngine.generatePDF('Test', {});
      
      expect(result.blobUrl).toBeDefined();
    });

    it('should handle complex nested content', async () => {
      const content = {
        level1: {
          level2: {
            level3: 'deep value',
          },
          array: [1, 2, 3],
        },
      };
      
      const result = await exportEngine.generatePDF('Nested Test', content);
      
      expect(result.success).toBe(true);
    });

    it('should handle arrays in content', async () => {
      const content = {
        items: ['item1', 'item2', 'item3'],
      };
      
      const result = await exportEngine.generatePDF('Array Test', content);
      
      expect(result.success).toBe(true);
    });

    it('should handle null values in content', async () => {
      const content = {
        nullValue: null,
        undefinedValue: undefined,
      };
      
      const result = await exportEngine.generatePDF('Null Test', content);
      
      expect(result.success).toBe(true);
    });
  });

  describe('generateExcel', () => {
    it('should generate CSV successfully from array', async () => {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ];
      
      const result = await exportEngine.generateExcel('Test Data', data);
      
      expect(result.success).toBe(true);
      expect(result.filename).toContain('.csv');
    });

    it('should generate CSV from single object', async () => {
      const data = { name: 'Single', value: 42 };
      
      const result = await exportEngine.generateExcel('Single Object', data);
      
      expect(result.success).toBe(true);
    });

    it('should handle empty array', async () => {
      const result = await exportEngine.generateExcel('Empty', []);
      
      expect(result.success).toBe(true);
    });

    it('should handle objects with different keys', async () => {
      const data = [
        { a: 1, b: 2 },
        { b: 3, c: 4 },
        { a: 5, c: 6 },
      ];
      
      const result = await exportEngine.generateExcel('Different Keys', data);
      
      expect(result.success).toBe(true);
    });

    it('should escape CSV special characters', async () => {
      const data = [
        { text: 'Hello, World', quoted: 'He said "Hi"' },
        { text: 'Line\nBreak', quoted: 'Normal' },
      ];
      
      const result = await exportEngine.generateExcel('Special Chars', data);
      
      expect(result.success).toBe(true);
    });

    it('should handle nested objects in CSV', async () => {
      const data = [
        { name: 'Test', nested: { key: 'value' } },
      ];
      
      const result = await exportEngine.generateExcel('Nested', data);
      
      expect(result.success).toBe(true);
    });
  });

  describe('generateJSON', () => {
    it('should generate JSON successfully', async () => {
      const data = { key: 'value', number: 42 };
      
      const result = await exportEngine.generateJSON('Test JSON', data);
      
      expect(result.success).toBe(true);
      expect(result.filename).toContain('.json');
    });

    it('should handle arrays', async () => {
      const data = [1, 2, 3, 'a', 'b', 'c'];
      
      const result = await exportEngine.generateJSON('Array JSON', data);
      
      expect(result.success).toBe(true);
    });

    it('should handle deeply nested structures', async () => {
      const data = {
        level1: {
          level2: {
            level3: {
              level4: 'deep',
            },
          },
        },
      };
      
      const result = await exportEngine.generateJSON('Deep JSON', data);
      
      expect(result.success).toBe(true);
    });
  });

  describe('exportMemories', () => {
    it('should export memories as PDF', async () => {
      const memories = [
        {
          id: 'mem-1',
          content: 'Test memory',
          type: 'semantic' as const,
          coordinates: { theta: 0, phi: 0, depth: 1, ring: 1, beat: 1 },
          salience: 0.8,
          doctrineAlignment: 0.9,
          tags: ['test'],
          pinned: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      const result = await exportEngine.exportMemories(memories, 'pdf');
      
      expect(result.success).toBe(true);
      expect(result.filename).toContain('memory-export');
    });

    it('should export memories as Excel', async () => {
      const memories = [
        {
          id: 'mem-1',
          content: 'Test memory',
          type: 'semantic' as const,
          coordinates: { theta: 0, phi: 0, depth: 1, ring: 1, beat: 1 },
          salience: 0.8,
          doctrineAlignment: 0.9,
          tags: ['test', 'export'],
          pinned: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      const result = await exportEngine.exportMemories(memories, 'excel');
      
      expect(result.success).toBe(true);
      expect(result.filename).toContain('.csv');
    });

    it('should export memories as JSON', async () => {
      const memories = [
        {
          id: 'mem-1',
          content: 'Test memory',
          type: 'doctrinal' as const,
          coordinates: { theta: 45, phi: 90, depth: 5, ring: 3, beat: 10 },
          salience: 0.95,
          doctrineAlignment: 0.98,
          tags: [],
          pinned: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      const result = await exportEngine.exportMemories(memories, 'json');
      
      expect(result.success).toBe(true);
      expect(result.filename).toContain('.json');
    });

    it('should handle empty memories array', async () => {
      const result = await exportEngine.exportMemories([], 'pdf');
      
      expect(result.success).toBe(true);
    });
  });

  describe('exportProposals', () => {
    it('should export proposals as PDF', async () => {
      const proposals = [
        {
          id: 'prop-1',
          title: 'Test Proposal',
          description: 'Description',
          author: 'Author',
          status: 'open' as const,
          votes: { for: 3, against: 1, abstain: 0 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          affectedGates: ['A' as const],
          auditLog: [],
        },
      ];
      
      const result = await exportEngine.exportProposals(proposals, 'pdf');
      
      expect(result.success).toBe(true);
    });

    it('should export proposals as Excel', async () => {
      const proposals = [
        {
          id: 'prop-1',
          title: 'Test Proposal',
          description: 'Description',
          author: 'Author',
          status: 'enacted' as const,
          votes: { for: 5, against: 0, abstain: 1 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          enactedAt: new Date().toISOString(),
          affectedGates: [],
          auditLog: [],
        },
      ];
      
      const result = await exportEngine.exportProposals(proposals, 'excel');
      
      expect(result.success).toBe(true);
    });

    it('should export proposals as JSON', async () => {
      const proposals = [
        {
          id: 'prop-1',
          title: 'Test Proposal',
          description: 'Description',
          author: 'Author',
          status: 'draft' as const,
          votes: { for: 0, against: 0, abstain: 0 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          affectedGates: ['B' as const],
          auditLog: [],
        },
      ];
      
      const result = await exportEngine.exportProposals(proposals, 'json');
      
      expect(result.success).toBe(true);
    });
  });

  describe('exportCompanyReport', () => {
    it('should export company report as PDF', async () => {
      const company = {
        id: 'comp-1',
        name: 'Test Company',
        mode: 'hybrid' as const,
        connectors: [
          {
            id: 'conn-1',
            name: 'CRM',
            type: 'crm' as const,
            status: 'connected' as const,
            mode: 'hybrid' as const,
            dataPoints: 1000,
            icon: '🔵',
          },
        ],
        onboardedAt: new Date().toISOString(),
        memoryEntries: 50,
        governanceActive: true,
      };
      
      const result = await exportEngine.exportCompanyReport(company, 'pdf');
      
      expect(result.success).toBe(true);
      expect(result.filename).toContain('test-company');
    });

    it('should export company report as Excel', async () => {
      const company = {
        id: 'comp-1',
        name: 'Excel Company',
        mode: 'connect' as const,
        connectors: [],
        onboardedAt: new Date().toISOString(),
        memoryEntries: 0,
        governanceActive: false,
      };
      
      const result = await exportEngine.exportCompanyReport(company, 'excel');
      
      expect(result.success).toBe(true);
    });

    it('should export company report as JSON', async () => {
      const company = {
        id: 'comp-1',
        name: 'JSON Company',
        mode: 'internalize' as const,
        connectors: [],
        onboardedAt: new Date().toISOString(),
        memoryEntries: 100,
        governanceActive: true,
      };
      
      const result = await exportEngine.exportCompanyReport(company, 'json');
      
      expect(result.success).toBe(true);
    });
  });

  describe('generateBusinessPlan', () => {
    it('should generate business plan as PDF', async () => {
      const input = {
        companyName: 'New Startup',
        industry: 'Technology',
        mission: 'To innovate',
        vision: 'To be the best',
        objectives: ['Grow revenue', 'Expand market'],
        targetMarket: 'Enterprise',
        competitiveAdvantage: 'Unique technology',
      };
      
      const result = await exportEngine.generateBusinessPlan(input, 'pdf');
      
      expect(result.success).toBe(true);
      expect(result.filename).toContain('business-plan');
    });

    it('should generate business plan as JSON', async () => {
      const input = {
        companyName: 'JSON Startup',
        industry: 'Healthcare',
        mission: 'To heal',
        vision: 'Healthy world',
        objectives: ['Research', 'Development'],
        targetMarket: 'Hospitals',
        competitiveAdvantage: 'Expert team',
      };
      
      const result = await exportEngine.generateBusinessPlan(input, 'json');
      
      expect(result.success).toBe(true);
      expect(result.filename).toContain('.json');
    });

    it('should default to PDF format', async () => {
      const input = {
        companyName: 'Default Format',
        industry: 'Finance',
        mission: 'Mission',
        vision: 'Vision',
        objectives: [],
        targetMarket: 'Banks',
        competitiveAdvantage: 'Speed',
      };
      
      const result = await exportEngine.generateBusinessPlan(input);
      
      expect(result.success).toBe(true);
      expect(result.filename).toContain('.pdf');
    });
  });

  describe('generateSocialContent', () => {
    it('should generate content for multiple platforms', async () => {
      const input = {
        topic: 'AI Technology',
        tone: 'professional' as const,
        platforms: ['twitter' as const, 'linkedin' as const],
      };
      
      const result = await exportEngine.generateSocialContent(input);
      
      expect(result.length).toBe(2);
      expect(result.some(r => r.platform === 'twitter')).toBe(true);
      expect(result.some(r => r.platform === 'linkedin')).toBe(true);
    });

    it('should include hashtags', async () => {
      const input = {
        topic: 'Cloud Computing',
        tone: 'educational' as const,
        platforms: ['instagram' as const],
        hashtags: ['#cloud', '#tech'],
      };
      
      const result = await exportEngine.generateSocialContent(input);
      
      expect(result[0].hashtags).toEqual(['#cloud', '#tech']);
    });

    it('should generate hashtags if not provided', async () => {
      const input = {
        topic: 'Machine Learning',
        tone: 'casual' as const,
        platforms: ['facebook' as const],
      };
      
      const result = await exportEngine.generateSocialContent(input);
      
      expect(result[0].hashtags.length).toBeGreaterThan(0);
    });

    it('should include character count', async () => {
      const input = {
        topic: 'Data Science',
        tone: 'inspirational' as const,
        platforms: ['twitter' as const],
      };
      
      const result = await exportEngine.generateSocialContent(input);
      
      expect(result[0].characterCount).toBe(result[0].content.length);
    });

    it('should include media recommendation', async () => {
      const input = {
        topic: 'Marketing',
        tone: 'professional' as const,
        platforms: ['linkedin' as const, 'instagram' as const],
      };
      
      const result = await exportEngine.generateSocialContent(input);
      
      expect(result.every(r => r.mediaRecommendation !== undefined)).toBe(true);
    });

    it('should respect platform character limits', async () => {
      const input = {
        topic: 'This is a very long topic that might generate lengthy content that could exceed platform limits',
        tone: 'educational' as const,
        platforms: ['twitter' as const],
      };
      
      const result = await exportEngine.generateSocialContent(input);
      
      // Twitter limit is 280
      expect(result[0].characterCount).toBeLessThanOrEqual(280);
    });

    it('should handle all tone options', async () => {
      const tones = ['professional', 'casual', 'inspirational', 'educational'] as const;
      
      for (const tone of tones) {
        const input = {
          topic: 'Test Topic',
          tone,
          platforms: ['twitter' as const],
        };
        
        const result = await exportEngine.generateSocialContent(input);
        expect(result.length).toBe(1);
        expect(result[0].content.length).toBeGreaterThan(0);
      }
    });

    it('should handle all platform types', async () => {
      const input = {
        topic: 'Universal Topic',
        tone: 'professional' as const,
        platforms: ['twitter' as const, 'linkedin' as const, 'instagram' as const, 'facebook' as const],
      };
      
      const result = await exportEngine.generateSocialContent(input);
      
      expect(result.length).toBe(4);
    });
  });

  describe('executeExport', () => {
    it('should handle memory data type', async () => {
      const config = {
        format: 'pdf' as const,
        dataType: 'memory',
      };
      
      const result = await exportEngine.executeExport(config);
      
      expect(result.success).toBe(true);
    });

    it('should handle governance data type', async () => {
      const config = {
        format: 'json' as const,
        dataType: 'governance',
      };
      
      const result = await exportEngine.executeExport(config);
      
      expect(result.success).toBe(true);
    });

    it('should return error for company without data', async () => {
      const config = {
        format: 'pdf' as const,
        dataType: 'company',
      };
      
      const result = await exportEngine.executeExport(config);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Company data required');
    });

    it('should return error for unknown data type', async () => {
      const config = {
        format: 'pdf' as const,
        dataType: 'unknown',
      };
      
      const result = await exportEngine.executeExport(config);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown data type');
    });
  });
});
