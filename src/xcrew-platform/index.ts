/**
 * XCREW Edge Computing Platform
 * Protocol: XCREW-PLATFORM-001
 * 
 * The sovereign edge computing platform that beats them all.
 * 
 * "Execute anywhere, instantly, at zero marginal cost."
 */

// ═══════════════════════════════════════════════════════════════════════════
// CORE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

// XWorker Runtime
export {
  XWorkerRuntime,
  getXWorkerRuntime,
  createXWorker,
  XExecutionContext,
  PhiHarmonicScheduler,
  type XWorkerConfig,
  type XWorkerInstance,
  type XWorkerHandler,
  type XWorkerMetrics,
  type XRuntime,
  type XEnv,
  type XContext,
  type XRequest,
  type XBinding,
  type XScheduledEvent,
  type XMessageBatch,
  type XMessage
} from './core/XWorkerRuntime';

// XNetwork Orchestrator
export {
  XNetworkOrchestrator,
  getXNetworkOrchestrator,
  PhiRoutingEngine,
  TOTAL_EDGE_LOCATIONS,
  type EdgeLocation,
  type EdgeRegion,
  type EdgeStatus,
  type EdgeCapacity,
  type EdgeMetrics,
  type RoutingDecision,
  type GeoLocation,
  type NetworkConfig
} from './network/XNetworkOrchestrator';

// XStore (KV + R2)
export {
  XStoreManager,
  getXStoreManager,
  createKVNamespace,
  createR2Bucket,
  XKVNamespaceImpl,
  XR2BucketImpl,
  type XKVNamespace,
  type XKVGetOptions,
  type XKVPutOptions,
  type XKVListOptions,
  type XKVListResult,
  type XR2Bucket,
  type XR2Object,
  type XR2ObjectBody,
  type XR2PutOptions,
  type XR2GetOptions
} from './storage/XStore';

// XQueue
export {
  XQueueManager,
  getXQueueManager,
  createQueue,
  XQueueImpl,
  PhiBackoffCalculator,
  type XQueue,
  type XQueueConfig,
  type XQueueHandler,
  type XQueueMetrics,
  type XSendOptions,
  type XBatchOptions,
  type XBatchResult
} from './queues/XQueue';

// XDurable Objects
export {
  XDurableManager,
  getXDurableManager,
  registerDurableObject,
  getDurableObjectNamespace,
  XDurableObject,
  type DurableObjectId,
  type DurableObjectNamespace,
  type DurableObjectStub,
  type DurableObjectState,
  type DurableObjectStorage
} from './workers/XDurable';

// XAI Gateway
export {
  XAIGateway,
  getXAIGateway,
  DEFAULT_MODELS,
  type XAIModel,
  type AIProvider,
  type XChatRequest,
  type XChatResponse,
  type XChatMessage,
  type XCompletionRequest,
  type XCompletionResponse,
  type XEmbedRequest,
  type XEmbedResponse,
  type XGatewayConfig,
  type XGatewayMetrics
} from './core/XAIGateway';

// XAnalytics
export {
  XAnalyticsEngine,
  getXAnalytics,
  log,
  track,
  increment,
  gauge,
  type XAnalyticsConfig,
  type XMetric,
  type XLogEntry,
  type XEvent,
  type XSpan,
  type XRequestMetrics,
  type XWorkerMetrics as XWorkerAnalyticsMetrics,
  type XDashboardMetrics,
  type LogLevel
} from './analytics/XAnalytics';

// XDeploy
export {
  XDeployManager,
  getXDeployManager,
  deploy,
  rollback,
  PhiProgressiveStrategy,
  type XDeployConfig,
  type XDeployment,
  type XDeploymentPlan,
  type XDeploymentPhase,
  type XDeployResult,
  type DeploymentStatus,
  type DeploymentStrategy,
  type TargetRegion
} from './deployment/XDeploy';

// XSecrets
export {
  XSecretsManager,
  XSecretsNamespace,
  PhiRotationCalculator,
  getXSecretsManager,
  createSecretsNamespace,
  type XSecret,
  type XSecretValue,
  type XSecretConfig,
  type XSecretAuditEntry,
  type XSecretsManagerConfig,
  type SecretType,
  type EncryptionAlgorithm,
  type RotationStrategy
} from './secrets/XSecrets';

// XCron
export {
  XCronScheduler,
  CronExpressionParser,
  PhiJitterCalculator,
  getXCronScheduler,
  createCronJob,
  type XCronJob,
  type CronExecution,
  type CronLogEntry,
  type CronSchedulerConfig,
  type CronStatus,
  type ExecutionStatus,
  type RetryPolicy
} from './cron/XCron';

// XRealtime (WebSocket, SSE, PubSub)
export {
  XRealtimeManager,
  XWebSocketServer,
  XSSEServer,
  XPubSub,
  PhiBackpressureController,
  getXRealtimeManager,
  getXWebSocket,
  getXSSE,
  getXPubSub,
  type XWebSocketConnection,
  type XWebSocketMessage,
  type XWebSocketConfig,
  type XSSEConnection,
  type XSSEEvent,
  type XSSEConfig,
  type XPubSubChannel,
  type XPubSubMessage,
  type ConnectionState,
  type MessageType
} from './realtime/XRealtime';

// XCLI
export {
  XCREWCLI,
  CLIOutput,
  getXCREWCLI,
  type CLICommand,
  type CLIOption,
  type CLIArgs,
  type CLIContext,
  type CLIResult,
  type XCREWConfig,
  type RouteConfig,
  type KVNamespaceConfig,
  type R2BucketConfig,
  type DurableObjectConfig,
  type QueueConfig,
  type AIConfig,
  type BuildConfig,
  type DevConfig
} from './cli/XCLI';

// ═══════════════════════════════════════════════════════════════════════════
// PLATFORM CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const XCREW_VERSION = '1.1.0';
export const XCREW_PROTOCOL = 'XCREW-PLATFORM-001';
export const PHI = 1.618033988749895;
export const PHI_INV = 0.618033988749895;

// ═══════════════════════════════════════════════════════════════════════════
// PLATFORM INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

export interface XCREWPlatform {
  version: string;
  protocol: string;
  workers: ReturnType<typeof getXWorkerRuntime>;
  network: ReturnType<typeof getXNetworkOrchestrator>;
  store: ReturnType<typeof getXStoreManager>;
  queues: ReturnType<typeof getXQueueManager>;
  durable: ReturnType<typeof getXDurableManager>;
  ai: ReturnType<typeof getXAIGateway>;
  analytics: ReturnType<typeof getXAnalytics>;
  deploy: ReturnType<typeof getXDeployManager>;
  secrets: ReturnType<typeof getXSecretsManager>;
  cron: ReturnType<typeof getXCronScheduler>;
  realtime: ReturnType<typeof getXRealtimeManager>;
  cli: ReturnType<typeof getXCREWCLI>;
}

let platformInstance: XCREWPlatform | null = null;

/**
 * Initialize the XCREW Platform
 */
export function initXCREW(): XCREWPlatform {
  if (platformInstance) {
    return platformInstance;
  }
  
  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║    ██╗  ██╗ ██████╗██████╗ ███████╗██╗    ██╗                               ║
║    ╚██╗██╔╝██╔════╝██╔══██╗██╔════╝██║    ██║                               ║
║     ╚███╔╝ ██║     ██████╔╝█████╗  ██║ █╗ ██║                               ║
║     ██╔██╗ ██║     ██╔══██╗██╔══╝  ██║███╗██║                               ║
║    ██╔╝ ██╗╚██████╗██║  ██║███████╗╚███╔███╔╝                               ║
║    ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝ ╚══╝╚══╝                                ║
║                                                                              ║
║    XCREW Edge Computing Platform v${XCREW_VERSION}                                     ║
║    Protocol: ${XCREW_PROTOCOL}                                          ║
║    φ = ${PHI}                                                  ║
║                                                                              ║
║    "Execute anywhere, instantly, at zero marginal cost."                     ║
║                                                                              ║
║    Components: Workers, Network, Store, Queues, Durable Objects,             ║
║                AI Gateway, Analytics, Deploy, Secrets, Cron, Realtime, CLI   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

  platformInstance = {
    version: XCREW_VERSION,
    protocol: XCREW_PROTOCOL,
    workers: getXWorkerRuntime(),
    network: getXNetworkOrchestrator(),
    store: getXStoreManager(),
    queues: getXQueueManager(),
    durable: getXDurableManager(),
    ai: getXAIGateway(),
    analytics: getXAnalytics(),
    deploy: getXDeployManager(),
    secrets: getXSecretsManager(),
    cron: getXCronScheduler(),
    realtime: getXRealtimeManager(),
    cli: getXCREWCLI()
  };
  
  console.log(`[${XCREW_PROTOCOL}] Platform initialized successfully`);
  console.log(`[${XCREW_PROTOCOL}] Edge locations: ${platformInstance.network.getAllLocations().length}`);
  console.log(`[${XCREW_PROTOCOL}] Healthy locations: ${platformInstance.network.getHealthyLocationCount()}`);
  console.log(`[${XCREW_PROTOCOL}] Components: 12 active modules`);
  
  return platformInstance;
}

/**
 * Get the XCREW Platform instance
 */
export function getXCREW(): XCREWPlatform {
  if (!platformInstance) {
    return initXCREW();
  }
  return platformInstance;
}

/**
 * Get platform health status
 */
export function getXCREWHealth(): {
  status: 'healthy' | 'degraded' | 'unhealthy';
  components: Record<string, boolean>;
  metrics: {
    edgeLocations: number;
    healthyLocations: number;
    activeWorkers: number;
    phiCoherence: number;
  };
} {
  const platform = getXCREW();
  
  const edgeLocations = platform.network.getAllLocations().length;
  const healthyLocations = platform.network.getHealthyLocationCount();
  const activeWorkers = platform.workers.getAllWorkers().length;
  const phiCoherence = platform.workers.getPhiCoherenceScore();
  
  const healthyRatio = healthyLocations / edgeLocations;
  
  return {
    status: healthyRatio > 0.95 ? 'healthy' : healthyRatio > 0.8 ? 'degraded' : 'unhealthy',
    components: {
      workers: true,
      network: healthyRatio > 0.5,
      store: true,
      queues: true,
      durable: true,
      ai: true,
      analytics: true,
      deploy: true,
      secrets: true,
      cron: true,
      realtime: true,
      cli: true
    },
    metrics: {
      edgeLocations,
      healthyLocations,
      activeWorkers,
      phiCoherence
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default {
  // Platform
  initXCREW,
  getXCREW,
  getXCREWHealth,
  XCREW_VERSION,
  XCREW_PROTOCOL,
  PHI,
  PHI_INV,
  
  // Components
  workers: getXWorkerRuntime,
  network: getXNetworkOrchestrator,
  store: getXStoreManager,
  queues: getXQueueManager,
  durable: getXDurableManager,
  ai: getXAIGateway,
  analytics: getXAnalytics,
  deploy: getXDeployManager,
  secrets: getXSecretsManager,
  cron: getXCronScheduler,
  realtime: getXRealtimeManager,
  cli: getXCREWCLI
};
