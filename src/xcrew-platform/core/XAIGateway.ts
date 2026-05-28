/**
 * XCREW XAI Gateway - AI/LLM Routing Gateway
 * Protocol: XCREW-GATEWAY-001
 * 
 * φ-coherent AI gateway with multi-model routing, caching, and rate limiting.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const PHI_INV = 0.618033988749895;
const PROTOCOL_ID = 'XCREW-GATEWAY-001';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'meta' | 'cohere' | 'local' | 'custom';
export type ModelCapability = 'chat' | 'completion' | 'embedding' | 'image' | 'audio' | 'vision';

export interface XAIModel {
  id: string;
  provider: AIProvider;
  name: string;
  capabilities: ModelCapability[];
  maxTokens: number;
  contextWindow: number;
  costPerInputToken: number;
  costPerOutputToken: number;
  weight: number;                 // φ-based routing weight
  endpoint?: string;
  apiKeyEnvVar?: string;
  enabled: boolean;
}

export interface XChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
  functionCall?: {
    name: string;
    arguments: string;
  };
}

export interface XChatRequest {
  model?: string;
  messages: XChatMessage[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
  functions?: XFunction[];
  functionCall?: 'auto' | 'none' | { name: string };
  stop?: string[];
  user?: string;
}

export interface XFunction {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface XChatResponse {
  id: string;
  model: string;
  created: number;
  choices: XChatChoice[];
  usage: XUsage;
  cached: boolean;
  phiCoherenceScore: number;
}

export interface XChatChoice {
  index: number;
  message: XChatMessage;
  finishReason: 'stop' | 'length' | 'function_call' | 'content_filter' | null;
}

export interface XCompletionRequest {
  model?: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
  stop?: string[];
  user?: string;
}

export interface XCompletionResponse {
  id: string;
  model: string;
  created: number;
  choices: XCompletionChoice[];
  usage: XUsage;
  cached: boolean;
}

export interface XCompletionChoice {
  index: number;
  text: string;
  finishReason: 'stop' | 'length' | null;
}

export interface XEmbedRequest {
  model?: string;
  input: string | string[];
  user?: string;
}

export interface XEmbedResponse {
  model: string;
  data: XEmbedding[];
  usage: XUsage;
  cached: boolean;
}

export interface XEmbedding {
  index: number;
  embedding: number[];
}

export interface XUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

export interface XGatewayConfig {
  models: XAIModel[];
  defaultModel: string;
  fallbackChain: string[];
  phiLoadBalance: boolean;
  caching: XCacheConfig;
  rateLimiting: XRateLimitConfig;
  logging: boolean;
}

export interface XCacheConfig {
  enabled: boolean;
  ttlSeconds: number;
  maxSize: number;
  phiDecay: boolean;
}

export interface XRateLimitConfig {
  enabled: boolean;
  requestsPerMinute: number;
  tokensPerMinute: number;
  concurrentRequests: number;
}

export interface XGatewayMetrics {
  totalRequests: number;
  cachedRequests: number;
  totalTokens: number;
  totalCost: number;
  avgLatencyMs: number;
  errorCount: number;
  modelUsage: Map<string, number>;
  phiCoherenceScore: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT MODELS
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_MODELS: XAIModel[] = [
  {
    id: 'gpt-4-turbo',
    provider: 'openai',
    name: 'GPT-4 Turbo',
    capabilities: ['chat', 'completion', 'vision'],
    maxTokens: 4096,
    contextWindow: 128000,
    costPerInputToken: 0.00001,
    costPerOutputToken: 0.00003,
    weight: PHI,
    apiKeyEnvVar: 'OPENAI_API_KEY',
    enabled: true
  },
  {
    id: 'gpt-4o',
    provider: 'openai',
    name: 'GPT-4o',
    capabilities: ['chat', 'completion', 'vision', 'audio'],
    maxTokens: 4096,
    contextWindow: 128000,
    costPerInputToken: 0.000005,
    costPerOutputToken: 0.000015,
    weight: PHI * PHI,
    apiKeyEnvVar: 'OPENAI_API_KEY',
    enabled: true
  },
  {
    id: 'claude-3-opus',
    provider: 'anthropic',
    name: 'Claude 3 Opus',
    capabilities: ['chat', 'completion', 'vision'],
    maxTokens: 4096,
    contextWindow: 200000,
    costPerInputToken: 0.000015,
    costPerOutputToken: 0.000075,
    weight: PHI,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY',
    enabled: true
  },
  {
    id: 'claude-3-sonnet',
    provider: 'anthropic',
    name: 'Claude 3 Sonnet',
    capabilities: ['chat', 'completion', 'vision'],
    maxTokens: 4096,
    contextWindow: 200000,
    costPerInputToken: 0.000003,
    costPerOutputToken: 0.000015,
    weight: 1,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY',
    enabled: true
  },
  {
    id: 'claude-3-haiku',
    provider: 'anthropic',
    name: 'Claude 3 Haiku',
    capabilities: ['chat', 'completion', 'vision'],
    maxTokens: 4096,
    contextWindow: 200000,
    costPerInputToken: 0.00000025,
    costPerOutputToken: 0.00000125,
    weight: PHI_INV,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY',
    enabled: true
  },
  {
    id: 'gemini-1.5-pro',
    provider: 'google',
    name: 'Gemini 1.5 Pro',
    capabilities: ['chat', 'completion', 'vision', 'audio'],
    maxTokens: 8192,
    contextWindow: 1000000,
    costPerInputToken: 0.0000035,
    costPerOutputToken: 0.000014,
    weight: PHI,
    apiKeyEnvVar: 'GOOGLE_API_KEY',
    enabled: true
  },
  {
    id: 'llama-3-70b',
    provider: 'meta',
    name: 'Llama 3 70B',
    capabilities: ['chat', 'completion'],
    maxTokens: 4096,
    contextWindow: 8192,
    costPerInputToken: 0.0000007,
    costPerOutputToken: 0.0000009,
    weight: 1,
    enabled: true
  },
  {
    id: 'text-embedding-3-large',
    provider: 'openai',
    name: 'Text Embedding 3 Large',
    capabilities: ['embedding'],
    maxTokens: 8191,
    contextWindow: 8191,
    costPerInputToken: 0.00000013,
    costPerOutputToken: 0,
    weight: PHI,
    apiKeyEnvVar: 'OPENAI_API_KEY',
    enabled: true
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// CACHE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

class AIResponseCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private readonly config: XCacheConfig;
  
  constructor(config: XCacheConfig) {
    this.config = config;
  }
  
  get(key: string): T | null {
    if (!this.config.enabled) return null;
    
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check TTL
    const age = Date.now() - entry.timestamp;
    let effectiveTtl = entry.ttl * 1000;
    
    // φ-decay: TTL extends based on hit count
    if (this.config.phiDecay) {
      effectiveTtl *= Math.pow(PHI, Math.min(entry.hits, 5) * PHI_INV);
    }
    
    if (age > effectiveTtl) {
      this.cache.delete(key);
      return null;
    }
    
    entry.hits++;
    return entry.value;
  }
  
  set(key: string, value: T): void {
    if (!this.config.enabled) return;
    
    // Enforce max size
    if (this.cache.size >= this.config.maxSize) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: this.config.ttlSeconds,
      hits: 0
    });
  }
  
  generateKey(request: XChatRequest | XCompletionRequest | XEmbedRequest): string {
    return JSON.stringify(request);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  getStats(): { size: number; hitRate: number } {
    let totalHits = 0;
    for (const entry of this.cache.values()) {
      totalHits += entry.hits;
    }
    return {
      size: this.cache.size,
      hitRate: this.cache.size > 0 ? totalHits / this.cache.size : 0
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RATE LIMITER
// ═══════════════════════════════════════════════════════════════════════════

class AIRateLimiter {
  private readonly config: XRateLimitConfig;
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();
  private tokenCounts: Map<string, { count: number; resetTime: number }> = new Map();
  private currentConcurrent = 0;
  
  constructor(config: XRateLimitConfig) {
    this.config = config;
  }
  
  async checkLimit(userId: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    if (!this.config.enabled) return { allowed: true };
    
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    
    // Check request rate
    let requestData = this.requestCounts.get(userId);
    if (!requestData || now > requestData.resetTime) {
      requestData = { count: 0, resetTime: now + windowMs };
      this.requestCounts.set(userId, requestData);
    }
    
    if (requestData.count >= this.config.requestsPerMinute) {
      return { allowed: false, retryAfter: requestData.resetTime - now };
    }
    
    // Check concurrent requests
    if (this.currentConcurrent >= this.config.concurrentRequests) {
      return { allowed: false, retryAfter: 1000 };
    }
    
    return { allowed: true };
  }
  
  recordRequest(userId: string): void {
    const data = this.requestCounts.get(userId);
    if (data) {
      data.count++;
    }
    this.currentConcurrent++;
  }
  
  recordTokens(userId: string, tokens: number): void {
    const now = Date.now();
    const windowMs = 60 * 1000;
    
    let tokenData = this.tokenCounts.get(userId);
    if (!tokenData || now > tokenData.resetTime) {
      tokenData = { count: 0, resetTime: now + windowMs };
      this.tokenCounts.set(userId, tokenData);
    }
    
    tokenData.count += tokens;
  }
  
  releaseRequest(): void {
    this.currentConcurrent = Math.max(0, this.currentConcurrent - 1);
  }
  
  checkTokenLimit(userId: string, estimatedTokens: number): boolean {
    if (!this.config.enabled) return true;
    
    const tokenData = this.tokenCounts.get(userId);
    if (!tokenData) return true;
    
    return tokenData.count + estimatedTokens <= this.config.tokensPerMinute;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// φ-COHERENT MODEL ROUTER
// ═══════════════════════════════════════════════════════════════════════════

class PhiModelRouter {
  private models: XAIModel[] = [];
  private fallbackChain: string[] = [];
  private modelUsage: Map<string, number> = new Map();
  
  constructor(models: XAIModel[], fallbackChain: string[]) {
    this.models = models.filter(m => m.enabled);
    this.fallbackChain = fallbackChain;
  }
  
  /**
   * Select optimal model using φ-weighted routing
   */
  selectModel(requestedModel?: string, capability?: ModelCapability): XAIModel {
    // If specific model requested and available, use it
    if (requestedModel) {
      const model = this.models.find(m => m.id === requestedModel);
      if (model) return model;
    }
    
    // Filter by capability
    let candidates = capability 
      ? this.models.filter(m => m.capabilities.includes(capability))
      : this.models;
    
    if (candidates.length === 0) {
      throw new Error('No suitable model available');
    }
    
    // φ-weighted selection
    const totalWeight = candidates.reduce((sum, m) => sum + m.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const model of candidates) {
      random -= model.weight;
      if (random <= 0) {
        this.recordUsage(model.id);
        return model;
      }
    }
    
    // Fallback to first candidate
    const selected = candidates[0];
    this.recordUsage(selected.id);
    return selected;
  }
  
  /**
   * Get fallback model chain
   */
  getFallbackModels(failedModelId: string): XAIModel[] {
    const fallbacks: XAIModel[] = [];
    
    for (const modelId of this.fallbackChain) {
      if (modelId !== failedModelId) {
        const model = this.models.find(m => m.id === modelId);
        if (model) fallbacks.push(model);
      }
    }
    
    return fallbacks;
  }
  
  private recordUsage(modelId: string): void {
    const count = this.modelUsage.get(modelId) || 0;
    this.modelUsage.set(modelId, count + 1);
  }
  
  getUsageStats(): Map<string, number> {
    return new Map(this.modelUsage);
  }
  
  /**
   * Calculate φ-coherence score based on model diversity
   */
  getPhiCoherenceScore(): number {
    if (this.modelUsage.size === 0) return 1.0;
    
    const values = Array.from(this.modelUsage.values());
    const total = values.reduce((a, b) => a + b, 0);
    const expected = total / this.models.length;
    
    let variance = 0;
    for (const count of values) {
      variance += Math.pow(count - expected, 2);
    }
    variance /= values.length;
    
    // φ-coherence: lower variance = higher coherence
    return Math.exp(-variance / (expected * PHI));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// XAI GATEWAY IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

export class XAIGateway {
  private static instance: XAIGateway | null = null;
  
  private config: XGatewayConfig;
  private router: PhiModelRouter;
  private cache: AIResponseCache<any>;
  private rateLimiter: AIRateLimiter;
  private metrics: XGatewayMetrics;
  
  private constructor(config?: Partial<XGatewayConfig>) {
    this.config = {
      models: config?.models || DEFAULT_MODELS,
      defaultModel: config?.defaultModel || 'gpt-4o',
      fallbackChain: config?.fallbackChain || ['gpt-4o', 'claude-3-sonnet', 'gemini-1.5-pro'],
      phiLoadBalance: config?.phiLoadBalance ?? true,
      caching: config?.caching || {
        enabled: true,
        ttlSeconds: 3600,
        maxSize: 10000,
        phiDecay: true
      },
      rateLimiting: config?.rateLimiting || {
        enabled: true,
        requestsPerMinute: 100,
        tokensPerMinute: 100000,
        concurrentRequests: 10
      },
      logging: config?.logging ?? true
    };
    
    this.router = new PhiModelRouter(this.config.models, this.config.fallbackChain);
    this.cache = new AIResponseCache(this.config.caching);
    this.rateLimiter = new AIRateLimiter(this.config.rateLimiting);
    this.metrics = this.initializeMetrics();
    
    console.log(`[${PROTOCOL_ID}] XAI Gateway initialized with ${this.config.models.length} models`);
  }
  
  static getInstance(config?: Partial<XGatewayConfig>): XAIGateway {
    if (!XAIGateway.instance) {
      XAIGateway.instance = new XAIGateway(config);
    }
    return XAIGateway.instance;
  }
  
  private initializeMetrics(): XGatewayMetrics {
    return {
      totalRequests: 0,
      cachedRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      avgLatencyMs: 0,
      errorCount: 0,
      modelUsage: new Map(),
      phiCoherenceScore: 1.0
    };
  }
  
  /**
   * Chat completion API
   */
  async chat(request: XChatRequest, userId?: string): Promise<XChatResponse> {
    const startTime = Date.now();
    this.metrics.totalRequests++;
    
    // Check rate limit
    if (userId) {
      const limit = await this.rateLimiter.checkLimit(userId);
      if (!limit.allowed) {
        throw new Error(`Rate limited. Retry after ${limit.retryAfter}ms`);
      }
      this.rateLimiter.recordRequest(userId);
    }
    
    try {
      // Check cache
      const cacheKey = this.cache.generateKey(request);
      const cached = this.cache.get(cacheKey) as XChatResponse | null;
      if (cached) {
        this.metrics.cachedRequests++;
        return { ...cached, cached: true };
      }
      
      // Select model
      const model = this.router.selectModel(request.model, 'chat');
      
      // Simulate API call (in production, would call actual provider)
      const response = await this.simulateChatCompletion(request, model);
      
      // Update metrics
      this.updateMetrics(response.usage, Date.now() - startTime);
      if (userId) {
        this.rateLimiter.recordTokens(userId, response.usage.totalTokens);
      }
      
      // Cache response
      this.cache.set(cacheKey, response);
      
      return response;
      
    } catch (error) {
      this.metrics.errorCount++;
      throw error;
    } finally {
      if (userId) {
        this.rateLimiter.releaseRequest();
      }
    }
  }
  
  /**
   * Text completion API
   */
  async complete(request: XCompletionRequest, userId?: string): Promise<XCompletionResponse> {
    const startTime = Date.now();
    this.metrics.totalRequests++;
    
    // Check rate limit
    if (userId) {
      const limit = await this.rateLimiter.checkLimit(userId);
      if (!limit.allowed) {
        throw new Error(`Rate limited. Retry after ${limit.retryAfter}ms`);
      }
      this.rateLimiter.recordRequest(userId);
    }
    
    try {
      // Check cache
      const cacheKey = this.cache.generateKey(request);
      const cached = this.cache.get(cacheKey) as XCompletionResponse | null;
      if (cached) {
        this.metrics.cachedRequests++;
        return { ...cached, cached: true };
      }
      
      // Select model
      const model = this.router.selectModel(request.model, 'completion');
      
      // Simulate API call
      const response = await this.simulateCompletion(request, model);
      
      // Update metrics
      this.updateMetrics(response.usage, Date.now() - startTime);
      if (userId) {
        this.rateLimiter.recordTokens(userId, response.usage.totalTokens);
      }
      
      // Cache response
      this.cache.set(cacheKey, response);
      
      return response;
      
    } catch (error) {
      this.metrics.errorCount++;
      throw error;
    } finally {
      if (userId) {
        this.rateLimiter.releaseRequest();
      }
    }
  }
  
  /**
   * Embedding API
   */
  async embed(request: XEmbedRequest, userId?: string): Promise<XEmbedResponse> {
    const startTime = Date.now();
    this.metrics.totalRequests++;
    
    try {
      // Check cache
      const cacheKey = this.cache.generateKey(request);
      const cached = this.cache.get(cacheKey) as XEmbedResponse | null;
      if (cached) {
        this.metrics.cachedRequests++;
        return { ...cached, cached: true };
      }
      
      // Select embedding model
      const model = this.router.selectModel(request.model, 'embedding');
      
      // Simulate embedding generation
      const response = await this.simulateEmbedding(request, model);
      
      // Update metrics
      this.updateMetrics(response.usage, Date.now() - startTime);
      
      // Cache response
      this.cache.set(cacheKey, response);
      
      return response;
      
    } catch (error) {
      this.metrics.errorCount++;
      throw error;
    }
  }
  
  private async simulateChatCompletion(request: XChatRequest, model: XAIModel): Promise<XChatResponse> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    
    const promptTokens = this.estimateTokens(request.messages.map(m => m.content).join(' '));
    const completionTokens = Math.min(request.maxTokens || 1000, 500);
    
    return {
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      model: model.id,
      created: Math.floor(Date.now() / 1000),
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: `[Simulated response from ${model.name}] This is a demo response.`
        },
        finishReason: 'stop'
      }],
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        cost: promptTokens * model.costPerInputToken + completionTokens * model.costPerOutputToken
      },
      cached: false,
      phiCoherenceScore: this.router.getPhiCoherenceScore()
    };
  }
  
  private async simulateCompletion(request: XCompletionRequest, model: XAIModel): Promise<XCompletionResponse> {
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    
    const promptTokens = this.estimateTokens(request.prompt);
    const completionTokens = Math.min(request.maxTokens || 500, 300);
    
    return {
      id: `cmpl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      model: model.id,
      created: Math.floor(Date.now() / 1000),
      choices: [{
        index: 0,
        text: `[Simulated completion from ${model.name}]`,
        finishReason: 'stop'
      }],
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        cost: promptTokens * model.costPerInputToken + completionTokens * model.costPerOutputToken
      },
      cached: false
    };
  }
  
  private async simulateEmbedding(request: XEmbedRequest, model: XAIModel): Promise<XEmbedResponse> {
    const inputs = Array.isArray(request.input) ? request.input : [request.input];
    const promptTokens = inputs.reduce((sum, text) => sum + this.estimateTokens(text), 0);
    
    // Generate random embeddings (1536 dimensions for OpenAI-compatible)
    const data: XEmbedding[] = inputs.map((_, index) => ({
      index,
      embedding: Array.from({ length: 1536 }, () => (Math.random() * 2 - 1) * PHI_INV)
    }));
    
    return {
      model: model.id,
      data,
      usage: {
        promptTokens,
        completionTokens: 0,
        totalTokens: promptTokens,
        cost: promptTokens * model.costPerInputToken
      },
      cached: false
    };
  }
  
  private estimateTokens(text: string): number {
    // Rough estimate: ~4 chars per token
    return Math.ceil(text.length / 4);
  }
  
  private updateMetrics(usage: XUsage, latencyMs: number): void {
    this.metrics.totalTokens += usage.totalTokens;
    this.metrics.totalCost += usage.cost;
    
    // Update average latency
    const n = this.metrics.totalRequests;
    this.metrics.avgLatencyMs = ((this.metrics.avgLatencyMs * (n - 1)) + latencyMs) / n;
    
    // Update model usage
    this.metrics.modelUsage = this.router.getUsageStats();
    this.metrics.phiCoherenceScore = this.router.getPhiCoherenceScore();
  }
  
  /**
   * Get gateway metrics
   */
  getMetrics(): XGatewayMetrics {
    return { ...this.metrics, modelUsage: new Map(this.metrics.modelUsage) };
  }
  
  /**
   * Get configuration
   */
  getConfig(): XGatewayConfig {
    return { ...this.config };
  }
  
  /**
   * Get available models
   */
  getModels(): XAIModel[] {
    return [...this.config.models];
  }
  
  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache stats
   */
  getCacheStats(): { size: number; hitRate: number } {
    return this.cache.getStats();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export function getXAIGateway(config?: Partial<XGatewayConfig>): XAIGateway {
  return XAIGateway.getInstance(config);
}

export default {
  XAIGateway,
  getXAIGateway,
  DEFAULT_MODELS,
  PROTOCOL_ID
};
