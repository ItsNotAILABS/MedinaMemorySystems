/**
 * XCREW XQueue - Distributed Message Queue System
 * Protocol: XCREW-QUEUE-001
 * 
 * High-performance distributed message queues with φ-harmonic retry backoff
 * and guaranteed delivery.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const PHI_INV = 0.618033988749895;
const PROTOCOL_ID = 'XCREW-QUEUE-001';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface XQueue<T = unknown> {
  send(message: T, options?: XSendOptions): Promise<void>;
  sendBatch(messages: T[], options?: XBatchOptions): Promise<XBatchResult>;
}

export interface XSendOptions {
  delaySeconds?: number;           // Delay before message is available
  contentType?: string;            // Message content type
  deduplicationId?: string;        // For deduplication
}

export interface XBatchOptions {
  delaySeconds?: number;
}

export interface XBatchResult {
  successful: number;
  failed: number;
  errors: XBatchError[];
}

export interface XBatchError {
  index: number;
  message: string;
}

export interface XMessageBatch<T = unknown> {
  queue: string;
  messages: XMessage<T>[];
  ackAll(): void;
  retryAll(): void;
}

export interface XMessage<T = unknown> {
  id: string;
  timestamp: Date;
  body: T;
  attempts: number;
  ack(): void;
  retry(options?: XRetryOptions): void;
}

export interface XRetryOptions {
  delaySeconds?: number;
}

export interface XQueueConfig {
  name: string;
  maxBatchSize: number;           // Max messages per batch (default: 10)
  maxBatchTimeout: number;        // Max wait time in ms (default: 5000)
  maxRetries: number;             // Retry attempts (default: 3)
  deadLetterQueue?: string;       // DLQ for failed messages
  phiBackoff: boolean;            // Use φ-harmonic retry backoff
  visibilityTimeout: number;      // ms before message becomes visible again
  retentionPeriod: number;        // ms to retain messages
}

export interface XQueueConsumerConfig {
  queueName: string;
  handler: XQueueHandler;
  maxBatchSize?: number;
  maxBatchTimeout?: number;
}

export type XQueueHandler<T = unknown> = (batch: XMessageBatch<T>) => Promise<void>;

export interface XQueueMetrics {
  messagesEnqueued: number;
  messagesDequeued: number;
  messagesAcked: number;
  messagesRetried: number;
  messagesFailed: number;
  avgProcessingTimeMs: number;
  queueDepth: number;
  dlqDepth: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERNAL MESSAGE STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════

interface InternalMessage<T = unknown> {
  id: string;
  body: T;
  timestamp: Date;
  visibleAt: Date;
  attempts: number;
  contentType?: string;
  deduplicationId?: string;
  inFlight: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// φ-HARMONIC BACKOFF CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════

export class PhiBackoffCalculator {
  private readonly baseDelay: number;
  private readonly maxDelay: number;
  
  constructor(baseDelayMs: number = 1000, maxDelayMs: number = 300000) {
    this.baseDelay = baseDelayMs;
    this.maxDelay = maxDelayMs;
  }
  
  /**
   * Calculate delay for a given attempt using φ-harmonic progression
   * delay(n) = baseDelay * φ^n
   */
  calculateDelay(attempt: number): number {
    const delay = this.baseDelay * Math.pow(PHI, attempt);
    return Math.min(delay, this.maxDelay);
  }
  
  /**
   * Get all delays for a series of retries
   */
  getDelaySequence(maxAttempts: number): number[] {
    const delays: number[] = [];
    for (let i = 0; i < maxAttempts; i++) {
      delays.push(this.calculateDelay(i));
    }
    return delays;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// XQUEUE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

export class XQueueImpl<T = unknown> implements XQueue<T> {
  private messages: InternalMessage<T>[] = [];
  private deduplicationIds: Set<string> = new Set();
  private readonly config: XQueueConfig;
  private metrics: XQueueMetrics;
  private backoffCalculator: PhiBackoffCalculator;
  private consumers: Map<string, XQueueConsumerConfig> = new Map();
  private processingInterval: NodeJS.Timeout | null = null;
  private deadLetterMessages: InternalMessage<T>[] = [];
  
  constructor(config: Partial<XQueueConfig> & { name: string }) {
    this.config = {
      name: config.name,
      maxBatchSize: config.maxBatchSize || 10,
      maxBatchTimeout: config.maxBatchTimeout || 5000,
      maxRetries: config.maxRetries || 3,
      deadLetterQueue: config.deadLetterQueue,
      phiBackoff: config.phiBackoff ?? true,
      visibilityTimeout: config.visibilityTimeout || 30000,
      retentionPeriod: config.retentionPeriod || 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    
    this.metrics = this.initializeMetrics();
    this.backoffCalculator = new PhiBackoffCalculator();
    
    console.log(`[${PROTOCOL_ID}] Queue ${config.name} initialized`);
  }
  
  private initializeMetrics(): XQueueMetrics {
    return {
      messagesEnqueued: 0,
      messagesDequeued: 0,
      messagesAcked: 0,
      messagesRetried: 0,
      messagesFailed: 0,
      avgProcessingTimeMs: 0,
      queueDepth: 0,
      dlqDepth: 0
    };
  }
  
  /**
   * Send a single message to the queue
   */
  async send(message: T, options?: XSendOptions): Promise<void> {
    // Check deduplication
    if (options?.deduplicationId) {
      if (this.deduplicationIds.has(options.deduplicationId)) {
        return; // Skip duplicate
      }
      this.deduplicationIds.add(options.deduplicationId);
      
      // Clean up old deduplication IDs after 5 minutes
      setTimeout(() => {
        this.deduplicationIds.delete(options.deduplicationId!);
      }, 5 * 60 * 1000);
    }
    
    const visibleAt = new Date();
    if (options?.delaySeconds) {
      visibleAt.setSeconds(visibleAt.getSeconds() + options.delaySeconds);
    }
    
    const internalMessage: InternalMessage<T> = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      body: message,
      timestamp: new Date(),
      visibleAt,
      attempts: 0,
      contentType: options?.contentType,
      deduplicationId: options?.deduplicationId,
      inFlight: false
    };
    
    this.messages.push(internalMessage);
    this.metrics.messagesEnqueued++;
    this.updateQueueDepth();
  }
  
  /**
   * Send multiple messages in a batch
   */
  async sendBatch(messages: T[], options?: XBatchOptions): Promise<XBatchResult> {
    const result: XBatchResult = {
      successful: 0,
      failed: 0,
      errors: []
    };
    
    for (let i = 0; i < messages.length; i++) {
      try {
        await this.send(messages[i], {
          delaySeconds: options?.delaySeconds
        });
        result.successful++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          index: i,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return result;
  }
  
  /**
   * Register a consumer for this queue
   */
  registerConsumer(consumerId: string, handler: XQueueHandler<T>, options?: {
    maxBatchSize?: number;
    maxBatchTimeout?: number;
  }): void {
    this.consumers.set(consumerId, {
      queueName: this.config.name,
      handler: handler as XQueueHandler,
      maxBatchSize: options?.maxBatchSize || this.config.maxBatchSize,
      maxBatchTimeout: options?.maxBatchTimeout || this.config.maxBatchTimeout
    });
    
    // Start processing if not already running
    if (!this.processingInterval) {
      this.startProcessing();
    }
    
    console.log(`[${PROTOCOL_ID}] Consumer ${consumerId} registered for queue ${this.config.name}`);
  }
  
  /**
   * Unregister a consumer
   */
  unregisterConsumer(consumerId: string): void {
    this.consumers.delete(consumerId);
    
    if (this.consumers.size === 0) {
      this.stopProcessing();
    }
  }
  
  /**
   * Start the message processing loop
   */
  private startProcessing(): void {
    if (this.processingInterval) return;
    
    const processInterval = Math.min(this.config.maxBatchTimeout, 1000);
    
    this.processingInterval = setInterval(() => {
      this.processMessages();
    }, processInterval);
  }
  
  /**
   * Stop the message processing loop
   */
  private stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }
  
  /**
   * Process available messages
   */
  private async processMessages(): Promise<void> {
    if (this.consumers.size === 0) return;
    
    const now = new Date();
    const visibleMessages = this.messages.filter(
      m => !m.inFlight && m.visibleAt <= now
    );
    
    if (visibleMessages.length === 0) return;
    
    for (const [consumerId, consumerConfig] of this.consumers) {
      const batchSize = Math.min(
        consumerConfig.maxBatchSize || this.config.maxBatchSize,
        visibleMessages.length
      );
      
      if (batchSize === 0) continue;
      
      const batchMessages = visibleMessages.slice(0, batchSize);
      
      // Mark messages as in-flight
      for (const msg of batchMessages) {
        msg.inFlight = true;
        msg.attempts++;
      }
      
      // Create message batch
      const batch = this.createMessageBatch(batchMessages);
      
      const startTime = Date.now();
      
      try {
        await consumerConfig.handler(batch);
        
        // Update processing time metric
        const processingTime = Date.now() - startTime;
        this.updateAvgProcessingTime(processingTime);
        
      } catch (error) {
        console.error(`[${PROTOCOL_ID}] Consumer ${consumerId} error:`, error);
        
        // Retry all messages on handler error
        batch.retryAll();
      }
    }
  }
  
  /**
   * Create a message batch for consumption
   */
  private createMessageBatch(internalMessages: InternalMessage<T>[]): XMessageBatch<T> {
    const queue = this;
    
    const messages: XMessage<T>[] = internalMessages.map(internal => ({
      id: internal.id,
      timestamp: internal.timestamp,
      body: internal.body,
      attempts: internal.attempts,
      ack() {
        queue.acknowledgeMessage(internal.id);
      },
      retry(options?: XRetryOptions) {
        queue.retryMessage(internal.id, options?.delaySeconds);
      }
    }));
    
    return {
      queue: this.config.name,
      messages,
      ackAll() {
        for (const msg of messages) {
          msg.ack();
        }
      },
      retryAll() {
        for (const msg of messages) {
          msg.retry();
        }
      }
    };
  }
  
  /**
   * Acknowledge (complete) a message
   */
  private acknowledgeMessage(messageId: string): void {
    const index = this.messages.findIndex(m => m.id === messageId);
    if (index >= 0) {
      this.messages.splice(index, 1);
      this.metrics.messagesDequeued++;
      this.metrics.messagesAcked++;
      this.updateQueueDepth();
    }
  }
  
  /**
   * Retry a message
   */
  private retryMessage(messageId: string, delaySeconds?: number): void {
    const message = this.messages.find(m => m.id === messageId);
    if (!message) return;
    
    message.inFlight = false;
    this.metrics.messagesRetried++;
    
    // Check if max retries exceeded
    if (message.attempts >= this.config.maxRetries) {
      this.moveToDeadLetterQueue(message);
      return;
    }
    
    // Calculate delay
    let delay: number;
    if (delaySeconds !== undefined) {
      delay = delaySeconds * 1000;
    } else if (this.config.phiBackoff) {
      delay = this.backoffCalculator.calculateDelay(message.attempts);
    } else {
      delay = 1000 * Math.pow(2, message.attempts); // Standard exponential backoff
    }
    
    message.visibleAt = new Date(Date.now() + delay);
  }
  
  /**
   * Move message to dead letter queue
   */
  private moveToDeadLetterQueue(message: InternalMessage<T>): void {
    const index = this.messages.findIndex(m => m.id === message.id);
    if (index >= 0) {
      this.messages.splice(index, 1);
    }
    
    this.deadLetterMessages.push(message);
    this.metrics.messagesFailed++;
    this.metrics.dlqDepth = this.deadLetterMessages.length;
    this.updateQueueDepth();
    
    console.log(`[${PROTOCOL_ID}] Message ${message.id} moved to DLQ after ${message.attempts} attempts`);
  }
  
  /**
   * Update average processing time
   */
  private updateAvgProcessingTime(newTime: number): void {
    const totalProcessed = this.metrics.messagesAcked + this.metrics.messagesFailed;
    if (totalProcessed === 0) {
      this.metrics.avgProcessingTimeMs = newTime;
    } else {
      this.metrics.avgProcessingTimeMs = 
        (this.metrics.avgProcessingTimeMs * totalProcessed + newTime) / (totalProcessed + 1);
    }
  }
  
  /**
   * Update queue depth metric
   */
  private updateQueueDepth(): void {
    this.metrics.queueDepth = this.messages.filter(m => !m.inFlight).length;
  }
  
  /**
   * Get queue metrics
   */
  getMetrics(): XQueueMetrics {
    return { ...this.metrics };
  }
  
  /**
   * Get queue configuration
   */
  getConfig(): XQueueConfig {
    return { ...this.config };
  }
  
  /**
   * Get dead letter queue messages
   */
  getDeadLetterMessages(): XMessage<T>[] {
    return this.deadLetterMessages.map(internal => ({
      id: internal.id,
      timestamp: internal.timestamp,
      body: internal.body,
      attempts: internal.attempts,
      ack: () => {},
      retry: () => {}
    }));
  }
  
  /**
   * Purge all messages
   */
  purge(): void {
    this.messages = [];
    this.deduplicationIds.clear();
    this.updateQueueDepth();
  }
  
  /**
   * Purge dead letter queue
   */
  purgeDLQ(): void {
    this.deadLetterMessages = [];
    this.metrics.dlqDepth = 0;
  }
  
  /**
   * Clean up old messages beyond retention period
   */
  cleanup(): void {
    const now = Date.now();
    const retentionCutoff = now - this.config.retentionPeriod;
    
    this.messages = this.messages.filter(
      m => m.timestamp.getTime() > retentionCutoff
    );
    
    this.deadLetterMessages = this.deadLetterMessages.filter(
      m => m.timestamp.getTime() > retentionCutoff
    );
    
    this.updateQueueDepth();
    this.metrics.dlqDepth = this.deadLetterMessages.length;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// XQUEUE MANAGER
// ═══════════════════════════════════════════════════════════════════════════

export class XQueueManager {
  private static instance: XQueueManager | null = null;
  
  private queues: Map<string, XQueueImpl<any>> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  private constructor() {
    // Start periodic cleanup
    this.cleanupInterval = setInterval(() => {
      this.cleanupAllQueues();
    }, 60 * 60 * 1000); // Every hour
    
    console.log(`[${PROTOCOL_ID}] XQueue Manager initialized`);
  }
  
  static getInstance(): XQueueManager {
    if (!XQueueManager.instance) {
      XQueueManager.instance = new XQueueManager();
    }
    return XQueueManager.instance;
  }
  
  /**
   * Create or get a queue
   */
  getQueue<T = unknown>(name: string, config?: Partial<XQueueConfig>): XQueueImpl<T> {
    let queue = this.queues.get(name) as XQueueImpl<T> | undefined;
    if (!queue) {
      queue = new XQueueImpl<T>({ name, ...config });
      this.queues.set(name, queue);
    }
    return queue;
  }
  
  /**
   * Delete a queue
   */
  deleteQueue(name: string): boolean {
    const queue = this.queues.get(name);
    if (queue) {
      queue.purge();
      queue.purgeDLQ();
    }
    return this.queues.delete(name);
  }
  
  /**
   * List all queues
   */
  listQueues(): string[] {
    return Array.from(this.queues.keys());
  }
  
  /**
   * Get all queue metrics
   */
  getAllMetrics(): Map<string, XQueueMetrics> {
    const metrics = new Map<string, XQueueMetrics>();
    for (const [name, queue] of this.queues) {
      metrics.set(name, queue.getMetrics());
    }
    return metrics;
  }
  
  /**
   * Clean up all queues
   */
  private cleanupAllQueues(): void {
    for (const queue of this.queues.values()) {
      queue.cleanup();
    }
  }
  
  /**
   * Shutdown manager
   */
  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    for (const queue of this.queues.values()) {
      queue.purge();
    }
    this.queues.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export function getXQueueManager(): XQueueManager {
  return XQueueManager.getInstance();
}

export function createQueue<T = unknown>(name: string, config?: Partial<XQueueConfig>): XQueueImpl<T> {
  return getXQueueManager().getQueue<T>(name, config);
}

export default {
  XQueueManager,
  getXQueueManager,
  createQueue,
  XQueueImpl,
  PhiBackoffCalculator,
  PROTOCOL_ID
};
