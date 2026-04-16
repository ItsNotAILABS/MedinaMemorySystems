/**
 * Tests for modelRouter.ts
 * Tests model routing logic, invocation, and statistics
 */

// Reset module state between tests
let modelRouter: typeof import('@/lib/modelRouter');

beforeEach(() => {
  jest.resetModules();
  modelRouter = require('@/lib/modelRouter');
});

describe('modelRouter', () => {
  describe('routeToModel', () => {
    it('should route strategy-related prompts to strategist', () => {
      const prompts = [
        'What is the strategy for this project?',
        'Plan the next steps',
        'Set the vision for the company',
        'Make a macro decision',
      ];
      
      for (const prompt of prompts) {
        const result = modelRouter.routeToModel(prompt);
        expect(result).toBe('strategist');
      }
    });

    it('should route build-related prompts to builder', () => {
      const prompts = [
        'Build a new feature',
        'Create an API endpoint',
        'Generate code for authentication',
        'Implement the login page',
        'Design the database schema',
      ];
      
      for (const prompt of prompts) {
        const result = modelRouter.routeToModel(prompt);
        expect(result).toBe('builder');
      }
    });

    it('should route analysis-related prompts to analyst', () => {
      const prompts = [
        'Analyze the sales data',
        'What patterns do you see?',
        'Show me the trend analysis',
        'Extract insights from this',
      ];
      
      for (const prompt of prompts) {
        const result = modelRouter.routeToModel(prompt);
        expect(result).toBe('analyst');
      }
    });

    it('should route governance-related prompts to governance', () => {
      const prompts = [
        'Create a governance proposal',
        'Vote on this policy',
        'Check doctrine compliance',
        'Audit the system',
      ];
      
      for (const prompt of prompts) {
        const result = modelRouter.routeToModel(prompt);
        expect(result).toBe('governance');
      }
    });

    it('should route memory-related prompts to memory-curator', () => {
      const prompts = [
        'Store this memory',
        'Remember this information',
        'Recall what we discussed',
        'Find the coordinates of that entry',
        'Check the resonance score',
      ];
      
      for (const prompt of prompts) {
        const result = modelRouter.routeToModel(prompt);
        expect(result).toBe('memory-curator');
      }
    });

    it('should route operations-related prompts to operations', () => {
      const prompts = [
        'Operate the system',
        'Run this task',
        'Manage the workflow',
        'Execute the process',
        'Schedule the job',
      ];
      
      for (const prompt of prompts) {
        const result = modelRouter.routeToModel(prompt);
        expect(result).toBe('operations');
      }
    });

    it('should route risk-related prompts to risk', () => {
      // Use prompts with keywords that uniquely match risk family
      const prompts = [
        'risk assessment needed',
        'threat model review',
        'vulnerability scan required',
        'anomaly detection system',
      ];
      
      for (const prompt of prompts) {
        const result = modelRouter.routeToModel(prompt);
        expect(result).toBe('risk');
      }
    });

    it('should route projection-related prompts to projection', () => {
      // Use prompts with keywords that uniquely match projection family
      const prompts = [
        'forecast sales trajectory',
        'predict future outcomes',
        'simulate scenario models',
      ];
      
      for (const prompt of prompts) {
        const result = modelRouter.routeToModel(prompt);
        expect(result).toBe('projection');
      }
    });

    it('should handle case insensitivity', () => {
      expect(modelRouter.routeToModel('STRATEGY PLAN')).toBe('strategist');
      expect(modelRouter.routeToModel('BUILD CODE')).toBe('builder');
      expect(modelRouter.routeToModel('ANALYZE DATA')).toBe('analyst');
    });

    it('should default to strategist for ambiguous prompts', () => {
      const result = modelRouter.routeToModel('Hello world');
      expect(result).toBe('strategist');
    });

    it('should handle prompts with multiple keywords', () => {
      // When multiple keywords match, the one with highest count wins
      const result = modelRouter.routeToModel('build create implement design construct');
      expect(result).toBe('builder');
    });

    it('should handle empty prompt', () => {
      const result = modelRouter.routeToModel('');
      expect(result).toBe('strategist'); // Default
    });
  });

  describe('invokeModel', () => {
    it('should return an invocation result', () => {
      const result = modelRouter.invokeModel('strategist', 'Test prompt');
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('modelId', 'strategist');
      expect(result).toHaveProperty('prompt', 'Test prompt');
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('latency');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('tokens');
    });

    it('should generate response from mock responses', () => {
      const result = modelRouter.invokeModel('builder', 'Build something');
      
      expect(result.response.length).toBeGreaterThan(0);
      // Builder responses contain certain keywords
      expect(
        result.response.includes('Implementation') ||
        result.response.includes('Code') ||
        result.response.includes('System') ||
        result.response.includes('blueprint')
      ).toBe(true);
    });

    it('should track latency', () => {
      const result = modelRouter.invokeModel('analyst', 'Analyze this');
      
      expect(typeof result.latency).toBe('number');
      expect(result.latency).toBeGreaterThan(0);
    });

    it('should calculate tokens based on prompt and response length', () => {
      const prompt = 'This is a test prompt';
      const result = modelRouter.invokeModel('operations', prompt);
      
      expect(typeof result.tokens).toBe('number');
      expect(result.tokens).toBeGreaterThan(0);
    });

    it('should throw error for unknown model', () => {
      expect(() => {
        modelRouter.invokeModel('unknown' as any, 'Test');
      }).toThrow('Unknown model: unknown');
    });

    it('should increment model invocation count', () => {
      const modelBefore = modelRouter.getModel('risk');
      const countBefore = modelBefore?.invocationCount || 0;
      
      modelRouter.invokeModel('risk', 'Test risk');
      
      const modelAfter = modelRouter.getModel('risk');
      expect(modelAfter?.invocationCount).toBe(countBefore + 1);
    });

    it('should set model status to active', () => {
      // Risk model starts as 'idle' in registry
      modelRouter.invokeModel('risk', 'Test');
      
      const model = modelRouter.getModel('risk');
      expect(model?.status).toBe('active');
    });

    it('should add to invocation history', () => {
      const historyBefore = modelRouter.getInvocationHistory();
      
      modelRouter.invokeModel('projection', 'Test projection');
      
      const historyAfter = modelRouter.getInvocationHistory();
      expect(historyAfter.length).toBe(historyBefore.length + 1);
    });
  });

  describe('getModels', () => {
    it('should return all models', () => {
      const models = modelRouter.getModels();
      
      expect(models.length).toBe(8);
    });

    it('should return models with proper structure', () => {
      const models = modelRouter.getModels();
      
      for (const model of models) {
        expect(model).toHaveProperty('id');
        expect(model).toHaveProperty('name');
        expect(model).toHaveProperty('description');
        expect(model).toHaveProperty('capabilities');
        expect(model).toHaveProperty('status');
        expect(model).toHaveProperty('latency');
        expect(model).toHaveProperty('invocationCount');
        expect(model).toHaveProperty('color');
      }
    });

    it('should include all model families', () => {
      const models = modelRouter.getModels();
      const ids = models.map(m => m.id);
      
      expect(ids).toContain('strategist');
      expect(ids).toContain('builder');
      expect(ids).toContain('analyst');
      expect(ids).toContain('governance');
      expect(ids).toContain('memory-curator');
      expect(ids).toContain('operations');
      expect(ids).toContain('risk');
      expect(ids).toContain('projection');
    });

    it('should return array copy', () => {
      const models1 = modelRouter.getModels();
      const models2 = modelRouter.getModels();
      
      // Arrays should be different references
      expect(models1).not.toBe(models2);
      // But contents should be equal
      expect(models1.length).toBe(models2.length);
    });
  });

  describe('getModel', () => {
    it('should return specific model by id', () => {
      const model = modelRouter.getModel('builder');
      
      expect(model).toBeDefined();
      expect(model?.id).toBe('builder');
      expect(model?.name).toBe('Builder');
    });

    it('should return undefined for unknown model', () => {
      const model = modelRouter.getModel('unknown' as any);
      expect(model).toBeUndefined();
    });

    it('should return model with capabilities array', () => {
      const model = modelRouter.getModel('analyst');
      
      expect(Array.isArray(model?.capabilities)).toBe(true);
      expect(model?.capabilities.length).toBeGreaterThan(0);
    });
  });

  describe('getInvocationHistory', () => {
    it('should return invocation history', () => {
      modelRouter.invokeModel('strategist', 'Test 1');
      modelRouter.invokeModel('builder', 'Test 2');
      
      const history = modelRouter.getInvocationHistory();
      
      expect(history.length).toBeGreaterThanOrEqual(2);
    });

    it('should return most recent first', () => {
      modelRouter.invokeModel('analyst', 'First');
      modelRouter.invokeModel('operations', 'Second');
      
      const history = modelRouter.getInvocationHistory();
      
      // Most recent first
      expect(history[0].modelId).toBe('operations');
      expect(history[1].modelId).toBe('analyst');
    });

    it('should respect limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        modelRouter.invokeModel('strategist', `Test ${i}`);
      }
      
      const history = modelRouter.getInvocationHistory(5);
      expect(history.length).toBeLessThanOrEqual(5);
    });

    it('should default to limit of 20', () => {
      for (let i = 0; i < 25; i++) {
        modelRouter.invokeModel('builder', `Test ${i}`);
      }
      
      const history = modelRouter.getInvocationHistory();
      expect(history.length).toBeLessThanOrEqual(20);
    });
  });

  describe('getModelStats', () => {
    it('should return total invocations', () => {
      modelRouter.invokeModel('strategist', 'Test');
      modelRouter.invokeModel('builder', 'Test');
      
      const stats = modelRouter.getModelStats();
      
      expect(stats.totalInvocations).toBeGreaterThanOrEqual(2);
    });

    it('should return active models count', () => {
      const stats = modelRouter.getModelStats();
      
      expect(typeof stats.activeModels).toBe('number');
      expect(stats.activeModels).toBeGreaterThanOrEqual(0);
    });

    it('should return average latency', () => {
      const stats = modelRouter.getModelStats();
      
      expect(typeof stats.avgLatency).toBe('number');
      expect(stats.avgLatency).toBeGreaterThan(0);
    });

    it('should update after invocations', () => {
      const statsBefore = modelRouter.getModelStats();
      
      modelRouter.invokeModel('projection', 'Test');
      modelRouter.invokeModel('risk', 'Test');
      
      const statsAfter = modelRouter.getModelStats();
      
      expect(statsAfter.totalInvocations).toBe(statsBefore.totalInvocations + 2);
    });
  });

  describe('model capabilities', () => {
    it('strategist should have strategic capabilities', () => {
      const model = modelRouter.getModel('strategist');
      
      expect(model?.capabilities).toContain('long-range planning');
      expect(model?.capabilities).toContain('strategic analysis');
    });

    it('builder should have construction capabilities', () => {
      const model = modelRouter.getModel('builder');
      
      expect(model?.capabilities).toContain('code generation');
      expect(model?.capabilities).toContain('system design');
    });

    it('analyst should have analysis capabilities', () => {
      const model = modelRouter.getModel('analyst');
      
      expect(model?.capabilities).toContain('data analysis');
      expect(model?.capabilities).toContain('pattern recognition');
    });

    it('governance should have governance capabilities', () => {
      const model = modelRouter.getModel('governance');
      
      expect(model?.capabilities).toContain('proposal drafting');
      expect(model?.capabilities).toContain('compliance checking');
    });

    it('memory-curator should have memory capabilities', () => {
      const model = modelRouter.getModel('memory-curator');
      
      expect(model?.capabilities).toContain('memory retrieval');
      expect(model?.capabilities).toContain('resonance scoring');
    });
  });
});
