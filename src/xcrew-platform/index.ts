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

// ═══════════════════════════════════════════════════════════════════════════
// PLATFORM CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const XCREW_VERSION = '1.0.0';
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
    deploy: getXDeployManager()
  };
  
  console.log(`[${XCREW_PROTOCOL}] Platform initialized successfully`);
  console.log(`[${XCREW_PROTOCOL}] Edge locations: ${platformInstance.network.getAllLocations().length}`);
  console.log(`[${XCREW_PROTOCOL}] Healthy locations: ${platformInstance.network.getHealthyLocationCount()}`);
  
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
      deploy: true
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
  deploy: getXDeployManager
};
