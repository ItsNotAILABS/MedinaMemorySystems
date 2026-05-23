/**
 * XCREW Global Edge Network Orchestrator
 * Protocol: XCREW-NETWORK-001
 * 
 * Manages 52+ edge locations with φ-optimized routing and global load balancing.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const PHI_INV = 0.618033988749895;
const PROTOCOL_ID = 'XCREW-NETWORK-001';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type EdgeRegion = 'americas' | 'europe' | 'asia-pacific' | 'middle-east' | 'africa';
export type EdgeStatus = 'healthy' | 'degraded' | 'unhealthy' | 'maintenance';

export interface EdgeLocation {
  id: string;
  name: string;
  region: EdgeRegion;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  status: EdgeStatus;
  capacity: EdgeCapacity;
  metrics: EdgeMetrics;
}

export interface EdgeCapacity {
  maxWorkers: number;
  currentWorkers: number;
  maxRequestsPerSecond: number;
  currentRequestsPerSecond: number;
  memoryTotalMb: number;
  memoryUsedMb: number;
  cpuCores: number;
  cpuUsagePercent: number;
}

export interface EdgeMetrics {
  requestCount: number;
  errorCount: number;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  bandwidthInMbps: number;
  bandwidthOutMbps: number;
  phiCoherenceScore: number;
}

export interface RoutingDecision {
  primaryEdge: EdgeLocation;
  fallbackEdges: EdgeLocation[];
  latencyEstimate: number;
  phiScore: number;
  reason: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  country?: string;
  city?: string;
  asn?: number;
}

export interface NetworkConfig {
  enablePhiRouting: boolean;
  maxFallbacks: number;
  healthCheckInterval: number;
  loadBalanceStrategy: 'round-robin' | 'least-connections' | 'phi-weighted' | 'geo-nearest';
}

// ═══════════════════════════════════════════════════════════════════════════
// EDGE LOCATIONS DATA
// ═══════════════════════════════════════════════════════════════════════════

const EDGE_LOCATIONS: EdgeLocation[] = [
  // AMERICAS (8)
  { id: 'us-east-1', name: 'N. Virginia', region: 'americas', city: 'Ashburn', country: 'USA', latitude: 39.0438, longitude: -77.4874, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'us-east-2', name: 'Ohio', region: 'americas', city: 'Columbus', country: 'USA', latitude: 39.9612, longitude: -82.9988, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'us-west-1', name: 'N. California', region: 'americas', city: 'San Jose', country: 'USA', latitude: 37.3382, longitude: -121.8863, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'us-west-2', name: 'Oregon', region: 'americas', city: 'Portland', country: 'USA', latitude: 45.5152, longitude: -122.6784, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'ca-central-1', name: 'Montreal', region: 'americas', city: 'Montreal', country: 'Canada', latitude: 45.5017, longitude: -73.5673, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'sa-east-1', name: 'São Paulo', region: 'americas', city: 'São Paulo', country: 'Brazil', latitude: -23.5505, longitude: -46.6333, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'mx-central-1', name: 'Mexico City', region: 'americas', city: 'Mexico City', country: 'Mexico', latitude: 19.4326, longitude: -99.1332, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'cl-south-1', name: 'Santiago', region: 'americas', city: 'Santiago', country: 'Chile', latitude: -33.4489, longitude: -70.6693, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  
  // EUROPE (8)
  { id: 'eu-west-1', name: 'Dublin', region: 'europe', city: 'Dublin', country: 'Ireland', latitude: 53.3498, longitude: -6.2603, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'eu-west-2', name: 'London', region: 'europe', city: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'eu-west-3', name: 'Paris', region: 'europe', city: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'eu-central-1', name: 'Frankfurt', region: 'europe', city: 'Frankfurt', country: 'Germany', latitude: 50.1109, longitude: 8.6821, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'eu-north-1', name: 'Stockholm', region: 'europe', city: 'Stockholm', country: 'Sweden', latitude: 59.3293, longitude: 18.0686, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'eu-south-1', name: 'Milan', region: 'europe', city: 'Milan', country: 'Italy', latitude: 45.4642, longitude: 9.1900, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'ch-zurich-1', name: 'Zurich', region: 'europe', city: 'Zurich', country: 'Switzerland', latitude: 47.3769, longitude: 8.5417, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'pl-central-1', name: 'Warsaw', region: 'europe', city: 'Warsaw', country: 'Poland', latitude: 52.2297, longitude: 21.0122, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  
  // ASIA-PACIFIC (9)
  { id: 'ap-northeast-1', name: 'Tokyo', region: 'asia-pacific', city: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'ap-northeast-2', name: 'Seoul', region: 'asia-pacific', city: 'Seoul', country: 'South Korea', latitude: 37.5665, longitude: 126.9780, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'ap-northeast-3', name: 'Osaka', region: 'asia-pacific', city: 'Osaka', country: 'Japan', latitude: 34.6937, longitude: 135.5023, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'ap-southeast-1', name: 'Singapore', region: 'asia-pacific', city: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'ap-southeast-2', name: 'Sydney', region: 'asia-pacific', city: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'ap-south-1', name: 'Mumbai', region: 'asia-pacific', city: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'ap-east-1', name: 'Hong Kong', region: 'asia-pacific', city: 'Hong Kong', country: 'China', latitude: 22.3193, longitude: 114.1694, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'ap-southeast-3', name: 'Jakarta', region: 'asia-pacific', city: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'ap-southeast-4', name: 'Melbourne', region: 'asia-pacific', city: 'Melbourne', country: 'Australia', latitude: -37.8136, longitude: 144.9631, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  
  // MIDDLE EAST (3)
  { id: 'me-south-1', name: 'Bahrain', region: 'middle-east', city: 'Manama', country: 'Bahrain', latitude: 26.2285, longitude: 50.5860, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'me-central-1', name: 'UAE', region: 'middle-east', city: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'il-central-1', name: 'Tel Aviv', region: 'middle-east', city: 'Tel Aviv', country: 'Israel', latitude: 32.0853, longitude: 34.7818, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  
  // AFRICA (1)
  { id: 'af-south-1', name: 'Cape Town', region: 'africa', city: 'Cape Town', country: 'South Africa', latitude: -33.9249, longitude: 18.4241, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  
  // SPECIALIZED (12) - GPU, High-Memory, ARM, etc.
  { id: 'gpu-a100-1', name: 'GPU A100', region: 'americas', city: 'Las Vegas', country: 'USA', latitude: 36.1699, longitude: -115.1398, status: 'healthy', capacity: createGPUCapacity(), metrics: createMetrics() },
  { id: 'gpu-h100-1', name: 'GPU H100', region: 'americas', city: 'Phoenix', country: 'USA', latitude: 33.4484, longitude: -112.0740, status: 'healthy', capacity: createGPUCapacity(), metrics: createMetrics() },
  { id: 'gpu-l40s-1', name: 'GPU L40S', region: 'europe', city: 'Amsterdam', country: 'Netherlands', latitude: 52.3676, longitude: 4.9041, status: 'healthy', capacity: createGPUCapacity(), metrics: createMetrics() },
  { id: 'himem-1tb-1', name: 'HiMem 1TB', region: 'americas', city: 'Dallas', country: 'USA', latitude: 32.7767, longitude: -96.7970, status: 'healthy', capacity: createHighMemCapacity(1024), metrics: createMetrics() },
  { id: 'himem-2tb-1', name: 'HiMem 2TB', region: 'europe', city: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050, status: 'healthy', capacity: createHighMemCapacity(2048), metrics: createMetrics() },
  { id: 'arm64-g3-1', name: 'ARM Graviton3', region: 'americas', city: 'Atlanta', country: 'USA', latitude: 33.7490, longitude: -84.3880, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'arm64-g4-1', name: 'ARM Graviton4', region: 'asia-pacific', city: 'Osaka', country: 'Japan', latitude: 34.6937, longitude: 135.5023, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'macos-m2u-1', name: 'macOS M2 Ultra', region: 'americas', city: 'Cupertino', country: 'USA', latitude: 37.3230, longitude: -122.0322, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'macos-m3m-1', name: 'macOS M3 Max', region: 'americas', city: 'Austin', country: 'USA', latitude: 30.2672, longitude: -97.7431, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'win-x64-1', name: 'Windows x64', region: 'americas', city: 'Seattle', country: 'USA', latitude: 47.6062, longitude: -122.3321, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'win-arm64-1', name: 'Windows ARM64', region: 'europe', city: 'Cambridge', country: 'UK', latitude: 52.2053, longitude: 0.1218, status: 'healthy', capacity: createCapacity(), metrics: createMetrics() },
  { id: 'quantum-sim-1', name: 'Quantum Simulator', region: 'americas', city: 'Boulder', country: 'USA', latitude: 40.0150, longitude: -105.2705, status: 'healthy', capacity: createQuantumCapacity(), metrics: createMetrics() },
];

function createCapacity(): EdgeCapacity {
  return {
    maxWorkers: 10000,
    currentWorkers: 0,
    maxRequestsPerSecond: 100000,
    currentRequestsPerSecond: 0,
    memoryTotalMb: 65536,
    memoryUsedMb: 0,
    cpuCores: 64,
    cpuUsagePercent: 0
  };
}

function createGPUCapacity(): EdgeCapacity {
  return {
    maxWorkers: 1000,
    currentWorkers: 0,
    maxRequestsPerSecond: 10000,
    currentRequestsPerSecond: 0,
    memoryTotalMb: 81920, // 80GB HBM
    memoryUsedMb: 0,
    cpuCores: 128,
    cpuUsagePercent: 0
  };
}

function createHighMemCapacity(memGb: number): EdgeCapacity {
  return {
    maxWorkers: 5000,
    currentWorkers: 0,
    maxRequestsPerSecond: 50000,
    currentRequestsPerSecond: 0,
    memoryTotalMb: memGb * 1024,
    memoryUsedMb: 0,
    cpuCores: 96,
    cpuUsagePercent: 0
  };
}

function createQuantumCapacity(): EdgeCapacity {
  return {
    maxWorkers: 100,
    currentWorkers: 0,
    maxRequestsPerSecond: 1000,
    currentRequestsPerSecond: 0,
    memoryTotalMb: 262144, // 256GB for quantum state simulation
    memoryUsedMb: 0,
    cpuCores: 256,
    cpuUsagePercent: 0
  };
}

function createMetrics(): EdgeMetrics {
  return {
    requestCount: 0,
    errorCount: 0,
    avgLatencyMs: 0,
    p50LatencyMs: 0,
    p95LatencyMs: 0,
    p99LatencyMs: 0,
    bandwidthInMbps: 0,
    bandwidthOutMbps: 0,
    phiCoherenceScore: 1.0
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GEO UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate Haversine distance between two points
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Estimate latency based on distance (simplified model)
 * Uses speed of light in fiber (~200km/ms) plus processing overhead
 */
function estimateLatency(distanceKm: number): number {
  const fiberLatency = distanceKm / 200; // ~200km per ms in fiber
  const processingOverhead = 0.5; // Base processing time
  return fiberLatency + processingOverhead;
}

// ═══════════════════════════════════════════════════════════════════════════
// φ-HARMONIC ROUTING
// ═══════════════════════════════════════════════════════════════════════════

export class PhiRoutingEngine {
  private readonly PHI = 1.618033988749895;
  
  /**
   * Calculate φ-weighted routing score
   */
  calculateScore(distance: number, capacity: EdgeCapacity, metrics: EdgeMetrics): number {
    // Distance factor (closer is better)
    const distanceFactor = Math.pow(this.PHI, -distance / 5000);
    
    // Capacity factor (more available capacity is better)
    const capacityUsage = capacity.currentWorkers / capacity.maxWorkers;
    const capacityFactor = Math.pow(this.PHI, -capacityUsage * 5);
    
    // Health factor (lower latency is better)
    const healthFactor = Math.pow(this.PHI, -metrics.avgLatencyMs / 100);
    
    // φ-coherence bonus
    const coherenceBonus = metrics.phiCoherenceScore;
    
    // Combine with φ-weighted formula
    return (distanceFactor * Math.pow(this.PHI, 2) + 
            capacityFactor * this.PHI + 
            healthFactor + 
            coherenceBonus * Math.pow(this.PHI, -1)) / 
           (Math.pow(this.PHI, 2) + this.PHI + 1 + Math.pow(this.PHI, -1));
  }
  
  /**
   * Get φ-optimized fallback order
   */
  getFallbackOrder(edges: EdgeLocation[], scores: Map<string, number>): EdgeLocation[] {
    return edges.sort((a, b) => {
      const scoreA = scores.get(a.id) || 0;
      const scoreB = scores.get(b.id) || 0;
      return scoreB - scoreA;
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// XNETWORK ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════

export class XNetworkOrchestrator {
  private static instance: XNetworkOrchestrator | null = null;
  
  private locations: Map<string, EdgeLocation> = new Map();
  private routingEngine: PhiRoutingEngine;
  private config: NetworkConfig;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  
  private constructor() {
    this.routingEngine = new PhiRoutingEngine();
    this.config = {
      enablePhiRouting: true,
      maxFallbacks: 3,
      healthCheckInterval: 30000, // 30 seconds
      loadBalanceStrategy: 'phi-weighted'
    };
    this.initializeLocations();
  }
  
  static getInstance(): XNetworkOrchestrator {
    if (!XNetworkOrchestrator.instance) {
      XNetworkOrchestrator.instance = new XNetworkOrchestrator();
    }
    return XNetworkOrchestrator.instance;
  }
  
  private initializeLocations(): void {
    for (const location of EDGE_LOCATIONS) {
      this.locations.set(location.id, { ...location });
    }
    console.log(`[${PROTOCOL_ID}] Initialized ${this.locations.size} edge locations`);
  }
  
  /**
   * Find optimal edge location for a request
   */
  findOptimalEdge(clientLocation: GeoLocation): RoutingDecision {
    const healthyLocations = Array.from(this.locations.values())
      .filter(loc => loc.status === 'healthy' || loc.status === 'degraded');
    
    if (healthyLocations.length === 0) {
      throw new Error('No healthy edge locations available');
    }
    
    // Calculate scores for all locations
    const scores = new Map<string, number>();
    for (const location of healthyLocations) {
      const distance = haversineDistance(
        clientLocation.latitude, clientLocation.longitude,
        location.latitude, location.longitude
      );
      const score = this.routingEngine.calculateScore(
        distance, location.capacity, location.metrics
      );
      scores.set(location.id, score);
    }
    
    // Sort by score
    const sortedLocations = this.routingEngine.getFallbackOrder(healthyLocations, scores);
    
    const primaryEdge = sortedLocations[0];
    const fallbackEdges = sortedLocations.slice(1, this.config.maxFallbacks + 1);
    
    const primaryDistance = haversineDistance(
      clientLocation.latitude, clientLocation.longitude,
      primaryEdge.latitude, primaryEdge.longitude
    );
    
    return {
      primaryEdge,
      fallbackEdges,
      latencyEstimate: estimateLatency(primaryDistance),
      phiScore: scores.get(primaryEdge.id) || 0,
      reason: `φ-optimized routing to ${primaryEdge.name}`
    };
  }
  
  /**
   * Find edge by region preference
   */
  findEdgeByRegion(region: EdgeRegion): EdgeLocation | null {
    const regionLocations = Array.from(this.locations.values())
      .filter(loc => loc.region === region && loc.status === 'healthy');
    
    if (regionLocations.length === 0) {
      return null;
    }
    
    // Return least loaded in region
    return regionLocations.sort((a, b) => 
      (a.capacity.currentWorkers / a.capacity.maxWorkers) - 
      (b.capacity.currentWorkers / b.capacity.maxWorkers)
    )[0];
  }
  
  /**
   * Find specialized compute edge
   */
  findSpecializedEdge(type: 'gpu' | 'high-memory' | 'arm64' | 'macos' | 'windows' | 'quantum'): EdgeLocation | null {
    const typeMap: Record<string, string[]> = {
      'gpu': ['gpu-a100-1', 'gpu-h100-1', 'gpu-l40s-1'],
      'high-memory': ['himem-1tb-1', 'himem-2tb-1'],
      'arm64': ['arm64-g3-1', 'arm64-g4-1'],
      'macos': ['macos-m2u-1', 'macos-m3m-1'],
      'windows': ['win-x64-1', 'win-arm64-1'],
      'quantum': ['quantum-sim-1']
    };
    
    const locationIds = typeMap[type] || [];
    for (const id of locationIds) {
      const location = this.locations.get(id);
      if (location && location.status === 'healthy') {
        return location;
      }
    }
    
    return null;
  }
  
  /**
   * Get all edge locations
   */
  getAllLocations(): EdgeLocation[] {
    return Array.from(this.locations.values());
  }
  
  /**
   * Get locations by region
   */
  getLocationsByRegion(region: EdgeRegion): EdgeLocation[] {
    return Array.from(this.locations.values())
      .filter(loc => loc.region === region);
  }
  
  /**
   * Get healthy location count
   */
  getHealthyLocationCount(): number {
    return Array.from(this.locations.values())
      .filter(loc => loc.status === 'healthy').length;
  }
  
  /**
   * Update location metrics
   */
  updateLocationMetrics(locationId: string, metrics: Partial<EdgeMetrics>): void {
    const location = this.locations.get(locationId);
    if (location) {
      location.metrics = { ...location.metrics, ...metrics };
    }
  }
  
  /**
   * Update location status
   */
  updateLocationStatus(locationId: string, status: EdgeStatus): void {
    const location = this.locations.get(locationId);
    if (location) {
      location.status = status;
    }
  }
  
  /**
   * Update location capacity
   */
  updateLocationCapacity(locationId: string, capacity: Partial<EdgeCapacity>): void {
    const location = this.locations.get(locationId);
    if (location) {
      location.capacity = { ...location.capacity, ...capacity };
    }
  }
  
  /**
   * Get global network metrics
   */
  getGlobalMetrics(): {
    totalLocations: number;
    healthyLocations: number;
    totalRequests: number;
    avgLatency: number;
    phiCoherenceScore: number;
  } {
    const locations = Array.from(this.locations.values());
    const healthyLocations = locations.filter(loc => loc.status === 'healthy');
    
    const totalRequests = locations.reduce((sum, loc) => sum + loc.metrics.requestCount, 0);
    const avgLatency = locations.reduce((sum, loc) => sum + loc.metrics.avgLatencyMs, 0) / locations.length;
    const phiCoherenceScore = locations.reduce((sum, loc) => sum + loc.metrics.phiCoherenceScore, 0) / locations.length;
    
    return {
      totalLocations: locations.length,
      healthyLocations: healthyLocations.length,
      totalRequests,
      avgLatency,
      phiCoherenceScore
    };
  }
  
  /**
   * Start health check loop
   */
  startHealthChecks(): void {
    if (this.healthCheckInterval) return;
    
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.healthCheckInterval);
    
    console.log(`[${PROTOCOL_ID}] Started health checks every ${this.config.healthCheckInterval}ms`);
  }
  
  /**
   * Stop health check loop
   */
  stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
  
  private async performHealthChecks(): Promise<void> {
    for (const location of this.locations.values()) {
      // Simulated health check
      const isHealthy = Math.random() > 0.01; // 99% healthy
      location.status = isHealthy ? 'healthy' : 'unhealthy';
      
      // Update φ-coherence based on performance
      location.metrics.phiCoherenceScore = isHealthy ? 
        0.9 + Math.random() * 0.1 : 
        0.5 + Math.random() * 0.3;
    }
  }
  
  /**
   * Get configuration
   */
  getConfig(): NetworkConfig {
    return { ...this.config };
  }
  
  /**
   * Update configuration
   */
  updateConfig(config: Partial<NetworkConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export function getXNetworkOrchestrator(): XNetworkOrchestrator {
  return XNetworkOrchestrator.getInstance();
}

export const TOTAL_EDGE_LOCATIONS = EDGE_LOCATIONS.length;

export default {
  XNetworkOrchestrator,
  getXNetworkOrchestrator,
  PhiRoutingEngine,
  TOTAL_EDGE_LOCATIONS,
  PROTOCOL_ID
};
