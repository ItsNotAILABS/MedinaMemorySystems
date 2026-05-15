/**
 * Intelligence Token Exchange Tests
 */

import {
  IntTokExchange,
  getIntTokExchange,
  resetIntTokExchange,
  ALL_BRIDGES,
  OPENAI_BRIDGE,
  ANTHROPIC_BRIDGE,
  getExchangeStatusColor,
  getProviderGlyph,
  formatExchange,
  type ExternalAIProvider,
  type IntTokType,
  type ExchangeProtocol,
} from '../lib/intelligenceTokenExchange';

describe('IntTokExchange', () => {
  let exchange: IntTokExchange;

  beforeEach(() => {
    resetIntTokExchange();
    exchange = getIntTokExchange();
  });

  describe('bridge definitions', () => {
    it('should have 8 external AI bridges', () => {
      expect(ALL_BRIDGES.length).toBe(8);
    });

    it('should have unique providers', () => {
      const providers = ALL_BRIDGES.map((b) => b.provider);
      const uniqueProviders = new Set(providers);
      expect(uniqueProviders.size).toBe(providers.length);
    });

    it('OPENAI_BRIDGE should have correct models', () => {
      expect(OPENAI_BRIDGE.models.length).toBeGreaterThan(0);
      const modelIds = OPENAI_BRIDGE.models.map((m) => m.id);
      expect(modelIds).toContain('gpt-4o');
      expect(modelIds).toContain('o1');
    });

    it('ANTHROPIC_BRIDGE should have Claude models', () => {
      expect(ANTHROPIC_BRIDGE.models.length).toBeGreaterThan(0);
      const modelIds = ANTHROPIC_BRIDGE.models.map((m) => m.id);
      expect(modelIds).toContain('claude-3-5-sonnet');
    });
  });

  describe('bridge initialization', () => {
    it('should initialize with all 8 bridges', () => {
      const bridges = exchange.getAllBridges();
      expect(bridges.length).toBe(8);
    });

    it('should initialize all bridges as ACTIVE', () => {
      const bridges = exchange.getAllBridges();
      for (const bridge of bridges) {
        expect(bridge.status).toBe('ACTIVE');
      }
    });
  });

  describe('bridge queries', () => {
    it('should get bridge by provider', () => {
      const bridge = exchange.getBridge('OPENAI');
      expect(bridge).toBeDefined();
      expect(bridge?.provider).toBe('OPENAI');
    });

    it('should get active bridges', () => {
      const active = exchange.getActiveBridges();
      expect(active.length).toBe(8);
    });

    it('should get models for provider', () => {
      const models = exchange.getModelsForProvider('ANTHROPIC');
      expect(models.length).toBeGreaterThan(0);
    });

    it('should find best model for capability', () => {
      const model = exchange.findBestModelForCapability('chat');
      expect(model).toBeDefined();
      expect(model?.capabilities).toContain('chat');
    });
  });

  describe('bridge status management', () => {
    it('should update bridge status', () => {
      const result = exchange.updateBridgeStatus('OPENAI', 'RATE_LIMITED');
      expect(result).toBe(true);
      
      const bridge = exchange.getBridge('OPENAI');
      expect(bridge?.status).toBe('RATE_LIMITED');
    });

    it('should return false for invalid provider', () => {
      const result = exchange.updateBridgeStatus('INVALID' as ExternalAIProvider, 'ACTIVE');
      expect(result).toBe(false);
    });
  });

  describe('token minting', () => {
    it('should mint INT-TOK tokens', () => {
      const token = exchange.mintTokens(
        'INT-TOK-COMPUTE',
        1000,
        'test-owner',
        'Testing'
      );
      
      expect(token.id).toBeDefined();
      expect(token.type).toBe('INT-TOK-COMPUTE');
      expect(token.amount).toBe(1000);
      expect(token.owner).toBe('test-owner');
      expect(token.active).toBe(true);
    });

    it('should get token by ID', () => {
      const minted = exchange.mintTokens('INT-TOK-INFERENCE', 500, 'owner1', 'Test');
      const retrieved = exchange.getToken(minted.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(minted.id);
    });

    it('should get tokens by owner', () => {
      exchange.mintTokens('INT-TOK-COMPUTE', 100, 'user1', 'Test1');
      exchange.mintTokens('INT-TOK-MEMORY', 200, 'user1', 'Test2');
      exchange.mintTokens('INT-TOK-COMPUTE', 300, 'user2', 'Test3');
      
      const user1Tokens = exchange.getTokensByOwner('user1');
      expect(user1Tokens.length).toBe(2);
    });

    it('should calculate token balance by type', () => {
      exchange.mintTokens('INT-TOK-COMPUTE', 100, 'user1', 'Test1');
      exchange.mintTokens('INT-TOK-COMPUTE', 200, 'user1', 'Test2');
      exchange.mintTokens('INT-TOK-MEMORY', 300, 'user1', 'Test3');
      
      const computeBalance = exchange.getTokenBalance('user1', 'INT-TOK-COMPUTE');
      expect(computeBalance).toBe(300);
    });
  });

  describe('token transfer', () => {
    it('should transfer tokens to new owner', () => {
      const token = exchange.mintTokens('INT-TOK-COMPUTE', 100, 'owner1', 'Test');
      const result = exchange.transferTokens(token.id, 'owner2');
      
      expect(result).toBe(true);
      
      const updated = exchange.getToken(token.id);
      expect(updated?.owner).toBe('owner2');
    });

    it('should return false for non-existent token', () => {
      const result = exchange.transferTokens('invalid-id', 'owner2');
      expect(result).toBe(false);
    });
  });

  describe('token burning', () => {
    it('should burn (deactivate) tokens', () => {
      const token = exchange.mintTokens('INT-TOK-COMPUTE', 100, 'owner1', 'Test');
      const result = exchange.burnTokens(token.id);
      
      expect(result).toBe(true);
      
      const burned = exchange.getToken(token.id);
      expect(burned?.active).toBe(false);
    });

    it('should not include burned tokens in balance', () => {
      const token = exchange.mintTokens('INT-TOK-COMPUTE', 100, 'owner1', 'Test');
      exchange.burnTokens(token.id);
      
      const balance = exchange.getTokenBalance('owner1', 'INT-TOK-COMPUTE');
      expect(balance).toBe(0);
    });
  });

  describe('exchange creation', () => {
    it('should create a token exchange', () => {
      const ex = exchange.createExchange({
        provider: 'OPENAI',
        model: 'gpt-4o',
        protocol: 'DIRECT',
        intTokType: 'INT-TOK-INFERENCE',
        intTokAmount: 100,
        prompt: 'Test prompt',
        maxTokens: 1000,
      });
      
      expect(ex.id).toBeDefined();
      expect(ex.status).toBe('PENDING');
      expect(ex.targetProvider).toBe('OPENAI');
      expect(ex.targetModel).toBe('gpt-4o');
    });

    it('should throw error for inactive bridge', () => {
      exchange.updateBridgeStatus('OPENAI', 'INACTIVE');
      
      expect(() => {
        exchange.createExchange({
          provider: 'OPENAI',
          model: 'gpt-4o',
          protocol: 'DIRECT',
          intTokType: 'INT-TOK-INFERENCE',
          intTokAmount: 100,
          prompt: 'Test',
          maxTokens: 1000,
        });
      }).toThrow();
    });

    it('should throw error for invalid model', () => {
      expect(() => {
        exchange.createExchange({
          provider: 'OPENAI',
          model: 'invalid-model',
          protocol: 'DIRECT',
          intTokType: 'INT-TOK-INFERENCE',
          intTokAmount: 100,
          prompt: 'Test',
          maxTokens: 1000,
        });
      }).toThrow();
    });
  });

  describe('exchange execution', () => {
    it('should execute a token exchange', async () => {
      const ex = exchange.createExchange({
        provider: 'OPENAI',
        model: 'gpt-4o',
        protocol: 'DIRECT',
        intTokType: 'INT-TOK-INFERENCE',
        intTokAmount: 100,
        prompt: 'Test prompt',
        maxTokens: 1000,
      });
      
      const result = await exchange.executeExchange(ex.id);
      
      expect(result.success).toBe(true);
      expect(result.tokensUsed).toBeGreaterThan(0);
      expect(result.latencyMs).toBeGreaterThan(0);
      expect(result.qualityScore).toBeGreaterThan(0);
    });

    it('should update exchange status after execution', async () => {
      const ex = exchange.createExchange({
        provider: 'ANTHROPIC',
        model: 'claude-3-5-sonnet',
        protocol: 'DIRECT',
        intTokType: 'INT-TOK-INFERENCE',
        intTokAmount: 50,
        prompt: 'Test',
        maxTokens: 500,
      });
      
      await exchange.executeExchange(ex.id);
      
      const updated = exchange.getExchange(ex.id);
      expect(updated?.status).toBe('COMPLETED');
      expect(updated?.result).toBeDefined();
    });

    it('should throw error for non-existent exchange', async () => {
      await expect(exchange.executeExchange('invalid-id')).rejects.toThrow();
    });
  });

  describe('exchange queries', () => {
    it('should get exchanges by status', () => {
      exchange.createExchange({
        provider: 'OPENAI',
        model: 'gpt-4o',
        protocol: 'DIRECT',
        intTokType: 'INT-TOK-INFERENCE',
        intTokAmount: 100,
        prompt: 'Test',
        maxTokens: 1000,
      });
      
      const pending = exchange.getExchangesByStatus('PENDING');
      expect(pending.length).toBeGreaterThan(0);
    });

    it('should get exchanges by provider', () => {
      exchange.createExchange({
        provider: 'GOOGLE',
        model: 'gemini-pro',
        protocol: 'DIRECT',
        intTokType: 'INT-TOK-COMPUTE',
        intTokAmount: 50,
        prompt: 'Test',
        maxTokens: 500,
      });
      
      const googleExchanges = exchange.getExchangesByProvider('GOOGLE');
      expect(googleExchanges.length).toBe(1);
    });
  });

  describe('exchange cancellation', () => {
    it('should cancel a pending exchange', () => {
      const ex = exchange.createExchange({
        provider: 'OPENAI',
        model: 'gpt-4o',
        protocol: 'DIRECT',
        intTokType: 'INT-TOK-INFERENCE',
        intTokAmount: 100,
        prompt: 'Test',
        maxTokens: 1000,
      });
      
      const result = exchange.cancelExchange(ex.id);
      expect(result).toBe(true);
      
      const cancelled = exchange.getExchange(ex.id);
      expect(cancelled?.status).toBe('CANCELLED');
    });

    it('should not cancel completed exchange', async () => {
      const ex = exchange.createExchange({
        provider: 'OPENAI',
        model: 'gpt-4o',
        protocol: 'DIRECT',
        intTokType: 'INT-TOK-INFERENCE',
        intTokAmount: 100,
        prompt: 'Test',
        maxTokens: 1000,
      });
      
      await exchange.executeExchange(ex.id);
      const result = exchange.cancelExchange(ex.id);
      
      expect(result).toBe(false);
    });
  });

  describe('statistics', () => {
    it('should provide accurate statistics', async () => {
      exchange.mintTokens('INT-TOK-COMPUTE', 1000, 'user1', 'Test');
      
      const ex = exchange.createExchange({
        provider: 'OPENAI',
        model: 'gpt-4o',
        protocol: 'DIRECT',
        intTokType: 'INT-TOK-INFERENCE',
        intTokAmount: 100,
        prompt: 'Test',
        maxTokens: 1000,
      });
      
      await exchange.executeExchange(ex.id);
      
      const stats = exchange.getStatistics();
      
      expect(stats.totalBridges).toBe(8);
      expect(stats.activeBridges).toBe(8);
      expect(stats.totalTokensMinted).toBe(1000);
      expect(stats.totalExchanges).toBe(1);
      expect(stats.completedExchanges).toBe(1);
    });
  });

  describe('singleton', () => {
    it('should return same instance', () => {
      const instance1 = getIntTokExchange();
      const instance2 = getIntTokExchange();
      expect(instance1).toBe(instance2);
    });

    it('should reset singleton', () => {
      const instance1 = getIntTokExchange();
      resetIntTokExchange();
      const instance2 = getIntTokExchange();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('utility functions', () => {
    it('should get color for exchange status', () => {
      expect(getExchangeStatusColor('PENDING')).toBe('#6b7280');
      expect(getExchangeStatusColor('COMPLETED')).toBe('#10b981');
      expect(getExchangeStatusColor('FAILED')).toBe('#ef4444');
    });

    it('should get glyph for provider', () => {
      expect(getProviderGlyph('OPENAI')).toBe('🤖');
      expect(getProviderGlyph('ANTHROPIC')).toBe('🧠');
      expect(getProviderGlyph('GOOGLE')).toBe('♊');
    });

    it('should format exchange for display', () => {
      const ex = exchange.createExchange({
        provider: 'OPENAI',
        model: 'gpt-4o',
        protocol: 'DIRECT',
        intTokType: 'INT-TOK-INFERENCE',
        intTokAmount: 100,
        prompt: 'Test',
        maxTokens: 1000,
      });
      
      const formatted = formatExchange(ex);
      expect(formatted).toContain('OPENAI');
      expect(formatted).toContain('gpt-4o');
      expect(formatted).toContain('PENDING');
    });
  });
});
