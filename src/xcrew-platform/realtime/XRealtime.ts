/**
 * XCREW Real-time Communication System
 * Protocol: XCREW-REALTIME-001
 * 
 * WebSocket and Server-Sent Events support with φ-harmonic connection management.
 * Enables real-time bidirectional communication at the edge.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const PHI_INV = 0.618033988749895;
const PROTOCOL_ID = 'XCREW-REALTIME-001';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type ConnectionState = 'connecting' | 'open' | 'closing' | 'closed' | 'error';
export type MessageType = 'text' | 'binary' | 'ping' | 'pong' | 'close';

export interface XWebSocketConnection {
  id: string;
  state: ConnectionState;
  clientId?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  lastActivity: Date;
  messageCount: number;
  bytesReceived: number;
  bytesSent: number;
  region: string;
  protocol?: string;
  extensions: string[];
}

export interface XWebSocketMessage {
  id: string;
  connectionId: string;
  type: MessageType;
  data: string | ArrayBuffer;
  timestamp: Date;
  size: number;
}

export interface XWebSocketConfig {
  maxConnections: number;
  maxMessageSize: number;          // bytes
  heartbeatInterval: number;       // ms
  connectionTimeout: number;       // ms
  enableCompression: boolean;
  phiBackpressure: boolean;        // φ-harmonic backpressure
  allowedOrigins: string[];
}

export interface XSSEConnection {
  id: string;
  state: ConnectionState;
  clientId?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  lastEventId?: string;
  eventCount: number;
  bytesSent: number;
  region: string;
}

export interface XSSEEvent {
  id?: string;
  event?: string;
  data: string;
  retry?: number;
}

export interface XSSEConfig {
  maxConnections: number;
  heartbeatInterval: number;
  retryInterval: number;
  enableCompression: boolean;
}

export interface XPubSubChannel {
  id: string;
  name: string;
  subscribers: Set<string>;
  messageCount: number;
  createdAt: Date;
  lastActivity: Date;
  metadata: Record<string, any>;
}

export interface XPubSubMessage {
  channel: string;
  event: string;
  data: any;
  timestamp: Date;
  sender?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHI-HARMONIC BACKPRESSURE CONTROLLER
// ═══════════════════════════════════════════════════════════════════════════

export class PhiBackpressureController {
  private windowSize: number;
  private messageQueue: XWebSocketMessage[] = [];
  private sendRate: number = 0;
  private lastAdjustment: number = Date.now();
  
  constructor(initialWindowSize: number = 16) {
    this.windowSize = initialWindowSize;
  }
  
  /**
   * Calculate optimal send rate using φ-harmonic adjustment
   */
  adjustRate(ackLatency: number, targetLatency: number): number {
    const ratio = targetLatency / Math.max(ackLatency, 1);
    
    if (ratio > PHI) {
      // Under capacity - increase window
      this.windowSize = Math.min(this.windowSize * PHI, 1024);
    } else if (ratio < PHI_INV) {
      // Over capacity - decrease window
      this.windowSize = Math.max(this.windowSize * PHI_INV, 1);
    }
    
    this.sendRate = this.windowSize / targetLatency * 1000;
    this.lastAdjustment = Date.now();
    
    return this.sendRate;
  }
  
  /**
   * Check if message can be sent
   */
  canSend(): boolean {
    return this.messageQueue.length < this.windowSize;
  }
  
  /**
   * Queue a message for sending
   */
  enqueue(message: XWebSocketMessage): boolean {
    if (this.messageQueue.length >= this.windowSize) {
      return false;
    }
    this.messageQueue.push(message);
    return true;
  }
  
  /**
   * Acknowledge message delivery
   */
  acknowledge(messageId: string): void {
    const index = this.messageQueue.findIndex(m => m.id === messageId);
    if (index !== -1) {
      this.messageQueue.splice(index, 1);
    }
  }
  
  /**
   * Get current window size
   */
  getWindowSize(): number {
    return this.windowSize;
  }
  
  /**
   * Get queue depth
   */
  getQueueDepth(): number {
    return this.messageQueue.length;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// WEBSOCKET SERVER
// ═══════════════════════════════════════════════════════════════════════════

export class XWebSocketServer {
  private connections: Map<string, XWebSocketConnection> = new Map();
  private messageHandlers: Map<string, (conn: XWebSocketConnection, msg: XWebSocketMessage) => void> = new Map();
  private backpressureControllers: Map<string, PhiBackpressureController> = new Map();
  private config: XWebSocketConfig;
  
  constructor(config?: Partial<XWebSocketConfig>) {
    this.config = {
      maxConnections: 10000,
      maxMessageSize: 1024 * 1024,  // 1MB
      heartbeatInterval: 30000,
      connectionTimeout: 60000,
      enableCompression: true,
      phiBackpressure: true,
      allowedOrigins: ['*'],
      ...config
    };
    
    console.log(`[${PROTOCOL_ID}] WebSocket Server initialized`);
  }
  
  /**
   * Handle new WebSocket connection
   */
  handleUpgrade(request: Request): XWebSocketConnection {
    if (this.connections.size >= this.config.maxConnections) {
      throw new Error('Maximum connections reached');
    }
    
    const id = `ws-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();
    
    const connection: XWebSocketConnection = {
      id,
      state: 'connecting',
      metadata: {},
      createdAt: now,
      lastActivity: now,
      messageCount: 0,
      bytesReceived: 0,
      bytesSent: 0,
      region: 'local',
      extensions: []
    };
    
    this.connections.set(id, connection);
    
    if (this.config.phiBackpressure) {
      this.backpressureControllers.set(id, new PhiBackpressureController());
    }
    
    // Simulate connection open
    connection.state = 'open';
    
    console.log(`[${PROTOCOL_ID}] WebSocket connection opened: ${id}`);
    
    return connection;
  }
  
  /**
   * Send message to a connection
   */
  send(connectionId: string, data: string | ArrayBuffer): boolean {
    const connection = this.connections.get(connectionId);
    if (!connection || connection.state !== 'open') {
      return false;
    }
    
    const size = typeof data === 'string' ? data.length : data.byteLength;
    
    if (size > this.config.maxMessageSize) {
      throw new Error(`Message size ${size} exceeds maximum ${this.config.maxMessageSize}`);
    }
    
    // Check backpressure
    if (this.config.phiBackpressure) {
      const controller = this.backpressureControllers.get(connectionId);
      if (controller && !controller.canSend()) {
        return false;
      }
    }
    
    connection.bytesSent += size;
    connection.lastActivity = new Date();
    
    return true;
  }
  
  /**
   * Broadcast message to all connections
   */
  broadcast(data: string | ArrayBuffer, filter?: (conn: XWebSocketConnection) => boolean): number {
    let sent = 0;
    
    for (const [id, connection] of this.connections) {
      if (connection.state === 'open' && (!filter || filter(connection))) {
        if (this.send(id, data)) {
          sent++;
        }
      }
    }
    
    return sent;
  }
  
  /**
   * Handle incoming message
   */
  handleMessage(connectionId: string, data: string | ArrayBuffer): void {
    const connection = this.connections.get(connectionId);
    if (!connection) return;
    
    const size = typeof data === 'string' ? data.length : data.byteLength;
    
    const message: XWebSocketMessage = {
      id: `msg-${Date.now().toString(36)}`,
      connectionId,
      type: typeof data === 'string' ? 'text' : 'binary',
      data,
      timestamp: new Date(),
      size
    };
    
    connection.messageCount++;
    connection.bytesReceived += size;
    connection.lastActivity = new Date();
    
    // Call registered handlers
    for (const handler of this.messageHandlers.values()) {
      handler(connection, message);
    }
  }
  
  /**
   * Close a connection
   */
  close(connectionId: string, code?: number, reason?: string): void {
    const connection = this.connections.get(connectionId);
    if (!connection) return;
    
    connection.state = 'closed';
    this.connections.delete(connectionId);
    this.backpressureControllers.delete(connectionId);
    
    console.log(`[${PROTOCOL_ID}] WebSocket connection closed: ${connectionId}`);
  }
  
  /**
   * Register message handler
   */
  onMessage(name: string, handler: (conn: XWebSocketConnection, msg: XWebSocketMessage) => void): void {
    this.messageHandlers.set(name, handler);
  }
  
  /**
   * Get connection by ID
   */
  getConnection(id: string): XWebSocketConnection | undefined {
    return this.connections.get(id);
  }
  
  /**
   * Get all connections
   */
  getConnections(): XWebSocketConnection[] {
    return Array.from(this.connections.values());
  }
  
  /**
   * Get connection count
   */
  getConnectionCount(): number {
    return this.connections.size;
  }
  
  /**
   * Get server stats
   */
  getStats(): {
    connections: number;
    totalMessages: number;
    totalBytesReceived: number;
    totalBytesSent: number;
  } {
    let totalMessages = 0;
    let totalBytesReceived = 0;
    let totalBytesSent = 0;
    
    for (const conn of this.connections.values()) {
      totalMessages += conn.messageCount;
      totalBytesReceived += conn.bytesReceived;
      totalBytesSent += conn.bytesSent;
    }
    
    return {
      connections: this.connections.size,
      totalMessages,
      totalBytesReceived,
      totalBytesSent
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVER-SENT EVENTS
// ═══════════════════════════════════════════════════════════════════════════

export class XSSEServer {
  private connections: Map<string, XSSEConnection> = new Map();
  private config: XSSEConfig;
  
  constructor(config?: Partial<XSSEConfig>) {
    this.config = {
      maxConnections: 10000,
      heartbeatInterval: 30000,
      retryInterval: 3000,
      enableCompression: true,
      ...config
    };
    
    console.log(`[${PROTOCOL_ID}] SSE Server initialized`);
  }
  
  /**
   * Create new SSE connection
   */
  createConnection(clientId?: string): XSSEConnection {
    if (this.connections.size >= this.config.maxConnections) {
      throw new Error('Maximum connections reached');
    }
    
    const id = `sse-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();
    
    const connection: XSSEConnection = {
      id,
      state: 'open',
      clientId,
      metadata: {},
      createdAt: now,
      eventCount: 0,
      bytesSent: 0,
      region: 'local'
    };
    
    this.connections.set(id, connection);
    
    console.log(`[${PROTOCOL_ID}] SSE connection opened: ${id}`);
    
    return connection;
  }
  
  /**
   * Send event to a connection
   */
  sendEvent(connectionId: string, event: XSSEEvent): boolean {
    const connection = this.connections.get(connectionId);
    if (!connection || connection.state !== 'open') {
      return false;
    }
    
    // Format SSE message
    let message = '';
    if (event.id) message += `id: ${event.id}\n`;
    if (event.event) message += `event: ${event.event}\n`;
    if (event.retry) message += `retry: ${event.retry}\n`;
    message += `data: ${event.data}\n\n`;
    
    connection.eventCount++;
    connection.bytesSent += message.length;
    connection.lastEventId = event.id;
    
    return true;
  }
  
  /**
   * Broadcast event to all connections
   */
  broadcast(event: XSSEEvent, filter?: (conn: XSSEConnection) => boolean): number {
    let sent = 0;
    
    for (const [id, connection] of this.connections) {
      if (connection.state === 'open' && (!filter || filter(connection))) {
        if (this.sendEvent(id, event)) {
          sent++;
        }
      }
    }
    
    return sent;
  }
  
  /**
   * Close a connection
   */
  close(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (!connection) return;
    
    connection.state = 'closed';
    this.connections.delete(connectionId);
    
    console.log(`[${PROTOCOL_ID}] SSE connection closed: ${connectionId}`);
  }
  
  /**
   * Get connection count
   */
  getConnectionCount(): number {
    return this.connections.size;
  }
  
  /**
   * Get all connections
   */
  getConnections(): XSSEConnection[] {
    return Array.from(this.connections.values());
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PUB/SUB SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

export class XPubSub {
  private channels: Map<string, XPubSubChannel> = new Map();
  private subscriptions: Map<string, Set<string>> = new Map(); // clientId -> channels
  private messageHandlers: Map<string, (msg: XPubSubMessage) => void> = new Map();
  
  constructor() {
    console.log(`[${PROTOCOL_ID}] PubSub system initialized`);
  }
  
  /**
   * Create a channel
   */
  createChannel(name: string, metadata?: Record<string, any>): XPubSubChannel {
    if (this.channels.has(name)) {
      return this.channels.get(name)!;
    }
    
    const channel: XPubSubChannel = {
      id: `ch-${Date.now().toString(36)}`,
      name,
      subscribers: new Set(),
      messageCount: 0,
      createdAt: new Date(),
      lastActivity: new Date(),
      metadata: metadata || {}
    };
    
    this.channels.set(name, channel);
    
    return channel;
  }
  
  /**
   * Subscribe to a channel
   */
  subscribe(clientId: string, channelName: string): boolean {
    let channel = this.channels.get(channelName);
    if (!channel) {
      channel = this.createChannel(channelName);
    }
    
    channel.subscribers.add(clientId);
    
    // Track client subscriptions
    if (!this.subscriptions.has(clientId)) {
      this.subscriptions.set(clientId, new Set());
    }
    this.subscriptions.get(clientId)!.add(channelName);
    
    return true;
  }
  
  /**
   * Unsubscribe from a channel
   */
  unsubscribe(clientId: string, channelName: string): boolean {
    const channel = this.channels.get(channelName);
    if (!channel) return false;
    
    channel.subscribers.delete(clientId);
    
    const clientSubs = this.subscriptions.get(clientId);
    if (clientSubs) {
      clientSubs.delete(channelName);
    }
    
    return true;
  }
  
  /**
   * Publish message to a channel
   */
  publish(channelName: string, event: string, data: any, sender?: string): number {
    const channel = this.channels.get(channelName);
    if (!channel) return 0;
    
    const message: XPubSubMessage = {
      channel: channelName,
      event,
      data,
      timestamp: new Date(),
      sender
    };
    
    channel.messageCount++;
    channel.lastActivity = new Date();
    
    // Notify handlers
    for (const handler of this.messageHandlers.values()) {
      handler(message);
    }
    
    return channel.subscribers.size;
  }
  
  /**
   * Register message handler
   */
  onMessage(name: string, handler: (msg: XPubSubMessage) => void): void {
    this.messageHandlers.set(name, handler);
  }
  
  /**
   * Get channel info
   */
  getChannel(name: string): XPubSubChannel | undefined {
    return this.channels.get(name);
  }
  
  /**
   * List all channels
   */
  listChannels(): XPubSubChannel[] {
    return Array.from(this.channels.values());
  }
  
  /**
   * Get client subscriptions
   */
  getClientSubscriptions(clientId: string): string[] {
    return Array.from(this.subscriptions.get(clientId) || []);
  }
  
  /**
   * Delete a channel
   */
  deleteChannel(name: string): boolean {
    const channel = this.channels.get(name);
    if (!channel) return false;
    
    // Remove from all client subscriptions
    for (const clientSubs of this.subscriptions.values()) {
      clientSubs.delete(name);
    }
    
    return this.channels.delete(name);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// REALTIME MANAGER
// ═══════════════════════════════════════════════════════════════════════════

export class XRealtimeManager {
  public readonly websocket: XWebSocketServer;
  public readonly sse: XSSEServer;
  public readonly pubsub: XPubSub;
  
  constructor(
    wsConfig?: Partial<XWebSocketConfig>,
    sseConfig?: Partial<XSSEConfig>
  ) {
    this.websocket = new XWebSocketServer(wsConfig);
    this.sse = new XSSEServer(sseConfig);
    this.pubsub = new XPubSub();
    
    console.log(`[${PROTOCOL_ID}] Realtime Manager initialized`);
  }
  
  /**
   * Get combined stats
   */
  getStats(): {
    websocket: ReturnType<XWebSocketServer['getStats']>;
    sse: { connections: number };
    pubsub: { channels: number; totalSubscribers: number };
  } {
    const channels = this.pubsub.listChannels();
    const totalSubscribers = channels.reduce((sum, ch) => sum + ch.subscribers.size, 0);
    
    return {
      websocket: this.websocket.getStats(),
      sse: { connections: this.sse.getConnectionCount() },
      pubsub: { channels: channels.length, totalSubscribers }
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON & EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

let realtimeManagerInstance: XRealtimeManager | null = null;

export function getXRealtimeManager(): XRealtimeManager {
  if (!realtimeManagerInstance) {
    realtimeManagerInstance = new XRealtimeManager();
  }
  return realtimeManagerInstance;
}

export function getXWebSocket(): XWebSocketServer {
  return getXRealtimeManager().websocket;
}

export function getXSSE(): XSSEServer {
  return getXRealtimeManager().sse;
}

export function getXPubSub(): XPubSub {
  return getXRealtimeManager().pubsub;
}

export default {
  XRealtimeManager,
  XWebSocketServer,
  XSSEServer,
  XPubSub,
  PhiBackpressureController,
  getXRealtimeManager,
  getXWebSocket,
  getXSSE,
  getXPubSub
};
