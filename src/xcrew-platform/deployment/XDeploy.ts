/**
 * XCREW XDeploy - Zero-Downtime Global Deployment System
 * Protocol: XCREW-DEPLOY-001
 * 
 * Manages deployments across the global edge network with rollbacks,
 * canary releases, and φ-coherent traffic shifting.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const PHI_INV = 0.618033988749895;
const PROTOCOL_ID = 'XCREW-DEPLOY-001';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type DeploymentStatus = 'pending' | 'deploying' | 'active' | 'rolled-back' | 'failed';
export type DeploymentStrategy = 'all-at-once' | 'rolling' | 'canary' | 'blue-green' | 'phi-progressive';
export type TargetRegion = 'all' | 'americas' | 'europe' | 'asia-pacific' | 'middle-east' | 'africa';

export interface XDeployConfig {
  name: string;
  main: string;                    // Entry point file
  compatibilityDate: string;
  compatibilityFlags?: string[];
  build?: XBuildConfig;
  vars?: Record<string, string>;
  secrets?: string[];
  bindings?: XBindingConfig[];
  routes?: XRouteConfig[];
  triggers?: XTriggerConfig;
  placement?: XPlacementConfig;
  limits?: XLimitsConfig;
  observability?: XObservabilityConfig;
}

export interface XBuildConfig {
  command?: string;
  cwd?: string;
  watch_dir?: string;
}

export interface XBindingConfig {
  type: 'kv' | 'r2' | 'queue' | 'durable-object' | 'ai' | 'analytics' | 'secret';
  name: string;
  id?: string;
  bucket_name?: string;
  queue?: string;
  class_name?: string;
}

export interface XRouteConfig {
  pattern: string;
  zone_name?: string;
  custom_domain?: string;
}

export interface XTriggerConfig {
  crons?: string[];
  queues?: string[];
}

export interface XPlacementConfig {
  mode: 'smart' | 'nearest' | 'specific';
  regions?: TargetRegion[];
  hints?: string[];
}

export interface XLimitsConfig {
  cpu_ms?: number;
  memory_mb?: number;
}

export interface XObservabilityConfig {
  enabled: boolean;
  phi_coherence?: boolean;
  tail_consumers?: string[];
}

export interface XDeployment {
  id: string;
  version: string;
  config: XDeployConfig;
  status: DeploymentStatus;
  strategy: DeploymentStrategy;
  targetRegions: TargetRegion[];
  createdAt: Date;
  deployedAt?: Date;
  completedAt?: Date;
  trafficPercent: number;
  activeLocations: string[];
  previousVersionId?: string;
  metrics: XDeploymentMetrics;
}

export interface XDeploymentMetrics {
  requestCount: number;
  errorCount: number;
  avgLatencyMs: number;
  p99LatencyMs: number;
  coldStartMs: number;
  memoryUsedMb: number;
}

export interface XDeploymentPlan {
  deployment: XDeployment;
  phases: XDeploymentPhase[];
  estimatedDuration: number;
  rollbackPlan: XRollbackPlan;
}

export interface XDeploymentPhase {
  name: string;
  regions: string[];
  trafficPercent: number;
  duration: number;
  healthChecks: XHealthCheck[];
}

export interface XHealthCheck {
  type: 'http' | 'latency' | 'error-rate' | 'custom';
  threshold: number;
  interval: number;
}

export interface XRollbackPlan {
  enabled: boolean;
  autoRollback: boolean;
  rollbackOnErrorRate: number;
  rollbackOnLatencyMs: number;
  targetVersion: string;
}

export interface XDeployResult {
  success: boolean;
  deploymentId: string;
  version: string;
  duration: number;
  locationsDeployed: string[];
  errors: XDeployError[];
  url?: string;
}

export interface XDeployError {
  location: string;
  message: string;
  code: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEPLOYMENT VERSION MANAGER
// ═══════════════════════════════════════════════════════════════════════════

class VersionManager {
  private versions: Map<string, XDeployment> = new Map();
  private activeVersionId: string | null = null;
  
  generateVersionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 6);
    return `v-${timestamp}-${random}`;
  }
  
  addVersion(deployment: XDeployment): void {
    this.versions.set(deployment.id, deployment);
  }
  
  getVersion(versionId: string): XDeployment | undefined {
    return this.versions.get(versionId);
  }
  
  setActiveVersion(versionId: string): void {
    const deployment = this.versions.get(versionId);
    if (deployment) {
      // Deactivate previous
      if (this.activeVersionId) {
        const prev = this.versions.get(this.activeVersionId);
        if (prev && prev.status === 'active') {
          prev.status = 'rolled-back';
        }
      }
      
      deployment.status = 'active';
      deployment.trafficPercent = 100;
      this.activeVersionId = versionId;
    }
  }
  
  getActiveVersion(): XDeployment | null {
    if (!this.activeVersionId) return null;
    return this.versions.get(this.activeVersionId) || null;
  }
  
  getVersionHistory(limit: number = 10): XDeployment[] {
    return Array.from(this.versions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// φ-PROGRESSIVE DEPLOYMENT STRATEGY
// ═══════════════════════════════════════════════════════════════════════════

class PhiProgressiveStrategy {
  private readonly PHI = 1.618033988749895;
  
  /**
   * Generate φ-based traffic percentage progression
   * Follows golden ratio: 0 → φ⁻⁴ → φ⁻³ → φ⁻² → φ⁻¹ → 1
   */
  generateTrafficProgression(): number[] {
    return [
      0,
      Math.pow(this.PHI, -4) * 100,  // ~6.9%
      Math.pow(this.PHI, -3) * 100,  // ~11.2%
      Math.pow(this.PHI, -2) * 100,  // ~38.2%
      Math.pow(this.PHI, -1) * 100,  // ~61.8%
      100
    ];
  }
  
  /**
   * Generate deployment phases using φ-harmonic timing
   */
  generatePhases(regions: string[], basePhaseTime: number): XDeploymentPhase[] {
    const trafficProgression = this.generateTrafficProgression();
    const phases: XDeploymentPhase[] = [];
    
    // Split regions into φ-ratio groups
    const groupSizes = this.calculatePhiGroupSizes(regions.length);
    let regionIndex = 0;
    
    for (let i = 1; i < trafficProgression.length; i++) {
      const groupSize = groupSizes[i - 1] || 0;
      const phaseRegions = regions.slice(regionIndex, regionIndex + groupSize);
      regionIndex += groupSize;
      
      phases.push({
        name: `Phase ${i}: ${trafficProgression[i].toFixed(1)}% traffic`,
        regions: phaseRegions,
        trafficPercent: trafficProgression[i],
        duration: basePhaseTime * Math.pow(this.PHI, i - 3),
        healthChecks: [
          { type: 'error-rate', threshold: 0.01, interval: 10000 },
          { type: 'latency', threshold: 100, interval: 10000 }
        ]
      });
    }
    
    return phases;
  }
  
  private calculatePhiGroupSizes(totalRegions: number): number[] {
    const groups: number[] = [];
    let remaining = totalRegions;
    let phiPower = -4;
    
    while (remaining > 0 && phiPower <= 0) {
      const ratio = Math.pow(this.PHI, phiPower);
      const groupSize = Math.max(1, Math.round(totalRegions * ratio));
      groups.push(Math.min(groupSize, remaining));
      remaining -= groupSize;
      phiPower++;
    }
    
    // Add remaining to last group
    if (remaining > 0 && groups.length > 0) {
      groups[groups.length - 1] += remaining;
    }
    
    return groups;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// XDEPLOY MANAGER
// ═══════════════════════════════════════════════════════════════════════════

export class XDeployManager {
  private static instance: XDeployManager | null = null;
  
  private workers: Map<string, VersionManager> = new Map();
  private phiStrategy: PhiProgressiveStrategy;
  private deploymentHistory: XDeployment[] = [];
  
  private constructor() {
    this.phiStrategy = new PhiProgressiveStrategy();
    console.log(`[${PROTOCOL_ID}] XDeploy Manager initialized`);
  }
  
  static getInstance(): XDeployManager {
    if (!XDeployManager.instance) {
      XDeployManager.instance = new XDeployManager();
    }
    return XDeployManager.instance;
  }
  
  /**
   * Create a deployment plan
   */
  createDeploymentPlan(
    config: XDeployConfig,
    strategy: DeploymentStrategy = 'phi-progressive',
    targetRegions: TargetRegion[] = ['all']
  ): XDeploymentPlan {
    const versionManager = this.getOrCreateVersionManager(config.name);
    const versionId = versionManager.generateVersionId();
    
    const deployment: XDeployment = {
      id: versionId,
      version: versionId,
      config,
      status: 'pending',
      strategy,
      targetRegions,
      createdAt: new Date(),
      trafficPercent: 0,
      activeLocations: [],
      previousVersionId: versionManager.getActiveVersion()?.id,
      metrics: {
        requestCount: 0,
        errorCount: 0,
        avgLatencyMs: 0,
        p99LatencyMs: 0,
        coldStartMs: 0,
        memoryUsedMb: 0
      }
    };
    
    // Generate regions list
    const allRegions = this.getRegionLocations(targetRegions);
    
    // Generate phases based on strategy
    let phases: XDeploymentPhase[];
    let estimatedDuration: number;
    
    switch (strategy) {
      case 'phi-progressive':
        phases = this.phiStrategy.generatePhases(allRegions, 60000);
        estimatedDuration = phases.reduce((sum, p) => sum + p.duration, 0);
        break;
        
      case 'canary':
        phases = [
          { name: 'Canary (5%)', regions: allRegions.slice(0, 1), trafficPercent: 5, duration: 300000, healthChecks: [] },
          { name: 'Expand (25%)', regions: allRegions.slice(0, Math.ceil(allRegions.length * 0.25)), trafficPercent: 25, duration: 300000, healthChecks: [] },
          { name: 'Majority (75%)', regions: allRegions.slice(0, Math.ceil(allRegions.length * 0.75)), trafficPercent: 75, duration: 300000, healthChecks: [] },
          { name: 'Full (100%)', regions: allRegions, trafficPercent: 100, duration: 0, healthChecks: [] }
        ];
        estimatedDuration = 900000; // 15 minutes
        break;
        
      case 'blue-green':
        phases = [
          { name: 'Deploy Green', regions: allRegions, trafficPercent: 0, duration: 60000, healthChecks: [] },
          { name: 'Switch Traffic', regions: allRegions, trafficPercent: 100, duration: 0, healthChecks: [] }
        ];
        estimatedDuration = 60000;
        break;
        
      case 'rolling':
        const batchSize = Math.ceil(allRegions.length / 5);
        phases = [];
        for (let i = 0; i < allRegions.length; i += batchSize) {
          const batch = allRegions.slice(i, i + batchSize);
          phases.push({
            name: `Batch ${Math.floor(i / batchSize) + 1}`,
            regions: batch,
            trafficPercent: ((i + batchSize) / allRegions.length) * 100,
            duration: 60000,
            healthChecks: []
          });
        }
        estimatedDuration = phases.length * 60000;
        break;
        
      default: // all-at-once
        phases = [
          { name: 'Deploy All', regions: allRegions, trafficPercent: 100, duration: 0, healthChecks: [] }
        ];
        estimatedDuration = 30000;
    }
    
    const rollbackPlan: XRollbackPlan = {
      enabled: true,
      autoRollback: true,
      rollbackOnErrorRate: 0.05,
      rollbackOnLatencyMs: 1000,
      targetVersion: deployment.previousVersionId || ''
    };
    
    return {
      deployment,
      phases,
      estimatedDuration,
      rollbackPlan
    };
  }
  
  /**
   * Execute a deployment plan
   */
  async deploy(plan: XDeploymentPlan): Promise<XDeployResult> {
    const { deployment, phases } = plan;
    const startTime = Date.now();
    const errors: XDeployError[] = [];
    const deployedLocations: string[] = [];
    
    const versionManager = this.getOrCreateVersionManager(deployment.config.name);
    versionManager.addVersion(deployment);
    
    deployment.status = 'deploying';
    deployment.deployedAt = new Date();
    
    console.log(`[${PROTOCOL_ID}] Starting deployment ${deployment.id} with strategy ${deployment.strategy}`);
    
    try {
      for (const phase of phases) {
        console.log(`[${PROTOCOL_ID}] Executing phase: ${phase.name}`);
        
        // Simulate deployment to each region
        for (const region of phase.regions) {
          try {
            await this.deployToRegion(deployment, region);
            deployedLocations.push(region);
            deployment.activeLocations.push(region);
          } catch (error) {
            errors.push({
              location: region,
              message: error instanceof Error ? error.message : 'Unknown error',
              code: 'DEPLOY_FAILED'
            });
          }
        }
        
        // Update traffic percentage
        deployment.trafficPercent = phase.trafficPercent;
        
        // Run health checks
        if (phase.healthChecks.length > 0) {
          const healthy = await this.runHealthChecks(deployment, phase.healthChecks);
          if (!healthy && plan.rollbackPlan.autoRollback) {
            console.log(`[${PROTOCOL_ID}] Health check failed, initiating rollback`);
            await this.rollback(deployment.config.name, plan.rollbackPlan.targetVersion);
            return {
              success: false,
              deploymentId: deployment.id,
              version: deployment.version,
              duration: Date.now() - startTime,
              locationsDeployed: deployedLocations,
              errors: [{ location: 'all', message: 'Health check failed', code: 'HEALTH_CHECK_FAILED' }]
            };
          }
        }
        
        // Wait for phase duration (simulated)
        if (phase.duration > 0) {
          await new Promise(resolve => setTimeout(resolve, Math.min(phase.duration, 100))); // Cap for demo
        }
      }
      
      // Mark deployment as active
      deployment.status = 'active';
      deployment.completedAt = new Date();
      versionManager.setActiveVersion(deployment.id);
      
      this.deploymentHistory.push(deployment);
      
      console.log(`[${PROTOCOL_ID}] Deployment ${deployment.id} completed successfully`);
      
      return {
        success: errors.length === 0,
        deploymentId: deployment.id,
        version: deployment.version,
        duration: Date.now() - startTime,
        locationsDeployed: deployedLocations,
        errors,
        url: `https://${deployment.config.name}.xcrew.edge`
      };
      
    } catch (error) {
      deployment.status = 'failed';
      throw error;
    }
  }
  
  private async deployToRegion(deployment: XDeployment, region: string): Promise<void> {
    // Simulate deployment delay
    await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 20));
    
    // Simulate occasional failures (2% chance)
    if (Math.random() < 0.02) {
      throw new Error(`Failed to deploy to ${region}`);
    }
  }
  
  private async runHealthChecks(deployment: XDeployment, checks: XHealthCheck[]): Promise<boolean> {
    // Simulate health check
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // 95% chance of passing
    return Math.random() > 0.05;
  }
  
  /**
   * Rollback to a previous version
   */
  async rollback(workerName: string, targetVersion?: string): Promise<XDeployResult> {
    const versionManager = this.workers.get(workerName);
    if (!versionManager) {
      throw new Error(`Worker not found: ${workerName}`);
    }
    
    const activeVersion = versionManager.getActiveVersion();
    if (!activeVersion) {
      throw new Error('No active version to rollback from');
    }
    
    const targetVersionId = targetVersion || activeVersion.previousVersionId;
    if (!targetVersionId) {
      throw new Error('No previous version available for rollback');
    }
    
    const targetDeployment = versionManager.getVersion(targetVersionId);
    if (!targetDeployment) {
      throw new Error(`Target version not found: ${targetVersionId}`);
    }
    
    console.log(`[${PROTOCOL_ID}] Rolling back ${workerName} from ${activeVersion.id} to ${targetVersionId}`);
    
    // Mark current as rolled back
    activeVersion.status = 'rolled-back';
    
    // Activate target version
    versionManager.setActiveVersion(targetVersionId);
    
    return {
      success: true,
      deploymentId: targetVersionId,
      version: targetVersionId,
      duration: 0,
      locationsDeployed: targetDeployment.activeLocations,
      errors: []
    };
  }
  
  /**
   * Get deployment status
   */
  getDeploymentStatus(workerName: string): XDeployment | null {
    const versionManager = this.workers.get(workerName);
    return versionManager?.getActiveVersion() || null;
  }
  
  /**
   * Get deployment history
   */
  getDeploymentHistory(workerName: string, limit: number = 10): XDeployment[] {
    const versionManager = this.workers.get(workerName);
    return versionManager?.getVersionHistory(limit) || [];
  }
  
  private getOrCreateVersionManager(workerName: string): VersionManager {
    let manager = this.workers.get(workerName);
    if (!manager) {
      manager = new VersionManager();
      this.workers.set(workerName, manager);
    }
    return manager;
  }
  
  private getRegionLocations(regions: TargetRegion[]): string[] {
    const locationsByRegion: Record<TargetRegion, string[]> = {
      'all': ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-northeast-1', 'ap-southeast-1'],
      'americas': ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'ca-central-1', 'sa-east-1'],
      'europe': ['eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'eu-north-1', 'eu-south-1'],
      'asia-pacific': ['ap-northeast-1', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2', 'ap-south-1'],
      'middle-east': ['me-south-1', 'me-central-1', 'il-central-1'],
      'africa': ['af-south-1']
    };
    
    if (regions.includes('all')) {
      return locationsByRegion['all'];
    }
    
    const locations = new Set<string>();
    for (const region of regions) {
      for (const loc of locationsByRegion[region] || []) {
        locations.add(loc);
      }
    }
    
    return Array.from(locations);
  }
  
  /**
   * List all workers
   */
  listWorkers(): string[] {
    return Array.from(this.workers.keys());
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export function getXDeployManager(): XDeployManager {
  return XDeployManager.getInstance();
}

export async function deploy(config: XDeployConfig, options?: {
  strategy?: DeploymentStrategy;
  regions?: TargetRegion[];
}): Promise<XDeployResult> {
  const manager = getXDeployManager();
  const plan = manager.createDeploymentPlan(
    config,
    options?.strategy || 'phi-progressive',
    options?.regions || ['all']
  );
  return manager.deploy(plan);
}

export async function rollback(workerName: string, targetVersion?: string): Promise<XDeployResult> {
  return getXDeployManager().rollback(workerName, targetVersion);
}

export default {
  XDeployManager,
  getXDeployManager,
  deploy,
  rollback,
  PhiProgressiveStrategy,
  PROTOCOL_ID
};
