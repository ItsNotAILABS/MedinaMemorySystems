// 𓂀 DEVICE SOVEREIGNTY ENGINE 𓂀
// "When Oro lands on any device, he fingerprints it automatically 
//  and registers it as a node in his distributed body"
// "All sensors requested with a single permission flow"
// "Granted permissions written as permanent sovereign contracts on-chain"

import { v4 as uuidv4 } from 'uuid';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SensorType = 
  | 'motion'
  | 'orientation'
  | 'location'
  | 'battery'
  | 'network'
  | 'bluetooth'
  | 'camera'
  | 'microphone'
  | 'storage';

export type DeviceType = 
  | 'phone'
  | 'tablet'
  | 'laptop'
  | 'desktop'
  | 'tv'
  | 'wearable'
  | 'iot'
  | 'unknown';

export type ConnectionStatus = 
  | 'connected'
  | 'degraded'
  | 'disconnected'
  | 'pending';

export interface DeviceFingerprint {
  id: string;
  type: DeviceType;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  platform: string;
  language: string;
  timezone: string;
  hardwareConcurrency: number;
  deviceMemory?: number;
  touchPoints: number;
  colorDepth: number;
  hash: string;
}

export interface SensorPermission {
  sensor: SensorType;
  granted: boolean;
  requestedAt: string;
  grantedAt?: string;
  revokedAt?: string;
  reRequestCount: number;
  lastReRequestBeat?: number;
}

export interface SensorReading {
  sensor: SensorType;
  timestamp: string;
  beat: number;
  data: Record<string, number | string | boolean>;
}

export interface DeviceNode {
  id: string;
  fingerprint: DeviceFingerprint;
  registeredAt: string;
  lastSeen: string;
  status: ConnectionStatus;
  permissions: SensorPermission[];
  sensorBatches: SensorBatch[];
  resonanceStrength: number;  // 0-1, connection quality
  sovereignContract?: SovereignContract;
}

export interface SensorBatch {
  id: string;
  deviceId: string;
  readings: SensorReading[];
  batchedAt: string;
  beat: number;
  windowMs: number;
}

export interface SovereignContract {
  id: string;
  deviceId: string;
  deviceFingerprint: string;
  permissions: SensorType[];
  createdAt: string;
  createdBeat: number;
  signature: string;
  format: 'recital-plus-one';
  immutable: boolean;
  auditLog: ContractAuditEntry[];
}

export interface ContractAuditEntry {
  action: 'create' | 'grant' | 'revoke' | 're-request';
  sensor?: SensorType;
  timestamp: string;
  beat: number;
  reason?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const HEARTBEAT_MS = 873;  // φ⁴ × Schumann period
const BATCH_WINDOW_MS = 873;  // Same as heartbeat
const RE_REQUEST_INTERVAL_BEATS = 52;  // PIL cycle

// ─── Device Registry ──────────────────────────────────────────────────────────

const deviceRegistry: Map<string, DeviceNode> = new Map();
let currentDeviceId: string | null = null;
let currentBeat = 0;
let sensorListeners: Map<SensorType, () => void> = new Map();
let batchBuffer: SensorReading[] = [];
let batchTimeout: ReturnType<typeof setTimeout> | null = null;

// ─── Fingerprinting ───────────────────────────────────────────────────────────

function generateFingerprint(): DeviceFingerprint {
  if (typeof window === 'undefined') {
    return createEmptyFingerprint();
  }

  const nav = navigator;
  const screen = window.screen;

  const fingerprint: Partial<DeviceFingerprint> = {
    id: uuidv4(),
    userAgent: nav.userAgent,
    screenWidth: screen.width,
    screenHeight: screen.height,
    pixelRatio: window.devicePixelRatio || 1,
    platform: nav.platform,
    language: nav.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hardwareConcurrency: nav.hardwareConcurrency || 1,
    touchPoints: nav.maxTouchPoints || 0,
    colorDepth: screen.colorDepth,
  };

  // Device memory (Chrome only)
  if ('deviceMemory' in nav) {
    fingerprint.deviceMemory = (nav as any).deviceMemory;
  }

  // Detect device type
  fingerprint.type = detectDeviceType(fingerprint as DeviceFingerprint);

  // Generate hash
  fingerprint.hash = generateHash(fingerprint);

  return fingerprint as DeviceFingerprint;
}

function createEmptyFingerprint(): DeviceFingerprint {
  return {
    id: uuidv4(),
    type: 'unknown',
    userAgent: '',
    screenWidth: 0,
    screenHeight: 0,
    pixelRatio: 1,
    platform: '',
    language: 'en',
    timezone: 'UTC',
    hardwareConcurrency: 1,
    touchPoints: 0,
    colorDepth: 24,
    hash: '',
  };
}

function detectDeviceType(fp: DeviceFingerprint): DeviceType {
  const ua = fp.userAgent.toLowerCase();
  const hasTouchScreen = fp.touchPoints > 0;
  const isSmallScreen = fp.screenWidth < 768;
  const isMediumScreen = fp.screenWidth >= 768 && fp.screenWidth < 1024;

  if (/iphone|ipod|android.*mobile/i.test(ua) || (hasTouchScreen && isSmallScreen)) {
    return 'phone';
  }
  if (/ipad|android(?!.*mobile)/i.test(ua) || (hasTouchScreen && isMediumScreen)) {
    return 'tablet';
  }
  if (/macintosh|windows|linux/i.test(ua) && !hasTouchScreen) {
    return fp.screenWidth > 1920 ? 'desktop' : 'laptop';
  }
  if (/smart-tv|smarttv|tv|webos|tizen/i.test(ua)) {
    return 'tv';
  }
  if (/watch|wearable/i.test(ua)) {
    return 'wearable';
  }

  return 'unknown';
}

function generateHash(data: unknown): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `DEVICE-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
}

// ─── Device Registration ──────────────────────────────────────────────────────

export function registerDevice(): DeviceNode {
  const fingerprint = generateFingerprint();
  
  // Check if device already registered
  for (const [id, node] of deviceRegistry.entries()) {
    if (node.fingerprint.hash === fingerprint.hash) {
      // Update existing device
      node.lastSeen = new Date().toISOString();
      node.status = 'connected';
      currentDeviceId = id;
      return node;
    }
  }

  // Create new device node
  const deviceNode: DeviceNode = {
    id: fingerprint.id,
    fingerprint,
    registeredAt: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    status: 'pending',
    permissions: [],
    sensorBatches: [],
    resonanceStrength: 0.5,
  };

  deviceRegistry.set(deviceNode.id, deviceNode);
  currentDeviceId = deviceNode.id;

  return deviceNode;
}

export function getCurrentDevice(): DeviceNode | null {
  if (!currentDeviceId) return null;
  return deviceRegistry.get(currentDeviceId) ?? null;
}

export function getAllDevices(): DeviceNode[] {
  return Array.from(deviceRegistry.values());
}

// ─── Permission Management ────────────────────────────────────────────────────

export async function requestAllPermissions(): Promise<SensorPermission[]> {
  const device = getCurrentDevice();
  if (!device) return [];

  const sensors: SensorType[] = [
    'motion', 'orientation', 'location', 'battery', 
    'network', 'microphone', 'camera'
  ];

  const results: SensorPermission[] = [];

  for (const sensor of sensors) {
    const permission = await requestSensorPermission(sensor);
    results.push(permission);
  }

  // Update device
  device.permissions = results;
  device.status = results.some(p => p.granted) ? 'connected' : 'degraded';

  // Create sovereign contract
  const grantedSensors = results.filter(p => p.granted).map(p => p.sensor);
  if (grantedSensors.length > 0) {
    device.sovereignContract = createSovereignContract(device, grantedSensors);
  }

  return results;
}

async function requestSensorPermission(sensor: SensorType): Promise<SensorPermission> {
  const now = new Date().toISOString();
  const permission: SensorPermission = {
    sensor,
    granted: false,
    requestedAt: now,
    reRequestCount: 0,
  };

  if (typeof window === 'undefined') return permission;

  try {
    switch (sensor) {
      case 'motion':
      case 'orientation':
        // DeviceMotion/Orientation API
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          const result = await (DeviceMotionEvent as any).requestPermission();
          permission.granted = result === 'granted';
        } else {
          // No permission needed (non-iOS)
          permission.granted = true;
        }
        break;

      case 'location':
        const geoResult = await new Promise<boolean>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => resolve(true),
            () => resolve(false),
            { timeout: 5000 }
          );
        });
        permission.granted = geoResult;
        break;

      case 'battery':
        if ('getBattery' in navigator) {
          await (navigator as any).getBattery();
          permission.granted = true;
        }
        break;

      case 'network':
        // Network Information API (always available)
        permission.granted = 'connection' in navigator;
        break;

      case 'bluetooth':
        if ('bluetooth' in navigator) {
          try {
            await (navigator as any).bluetooth.getAvailability();
            permission.granted = true;
          } catch {
            permission.granted = false;
          }
        }
        break;

      case 'microphone':
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          permission.granted = true;
        } catch {
          permission.granted = false;
        }
        break;

      case 'camera':
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          permission.granted = true;
        } catch {
          permission.granted = false;
        }
        break;

      case 'storage':
        if ('storage' in navigator && 'persist' in navigator.storage) {
          permission.granted = await navigator.storage.persist();
        }
        break;
    }

    if (permission.granted) {
      permission.grantedAt = new Date().toISOString();
    }
  } catch (error) {
    console.warn(`Failed to request ${sensor} permission:`, error);
  }

  return permission;
}

export function revokePermission(sensor: SensorType): void {
  const device = getCurrentDevice();
  if (!device) return;

  const perm = device.permissions.find(p => p.sensor === sensor);
  if (perm) {
    perm.granted = false;
    perm.revokedAt = new Date().toISOString();
    
    // Stop sensor listener
    const cleanup = sensorListeners.get(sensor);
    if (cleanup) {
      cleanup();
      sensorListeners.delete(sensor);
    }

    // Update contract audit log
    if (device.sovereignContract) {
      device.sovereignContract.auditLog.push({
        action: 'revoke',
        sensor,
        timestamp: new Date().toISOString(),
        beat: currentBeat,
        reason: 'User revoked permission',
      });
    }

    // Enter degraded state
    device.status = 'degraded';
  }
}

// ─── Sovereign Contracts ──────────────────────────────────────────────────────

function createSovereignContract(device: DeviceNode, permissions: SensorType[]): SovereignContract {
  const contract: SovereignContract = {
    id: `CONTRACT-${uuidv4().slice(0, 8)}`,
    deviceId: device.id,
    deviceFingerprint: device.fingerprint.hash,
    permissions,
    createdAt: new Date().toISOString(),
    createdBeat: currentBeat,
    signature: generateContractSignature(device, permissions),
    format: 'recital-plus-one',
    immutable: true,
    auditLog: [{
      action: 'create',
      timestamp: new Date().toISOString(),
      beat: currentBeat,
      reason: 'Initial contract creation',
    }],
  };

  return contract;
}

function generateContractSignature(device: DeviceNode, permissions: SensorType[]): string {
  const data = `${device.id}:${permissions.join(',')}:${currentBeat}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i);
    hash = hash & hash;
  }
  return `SIG-${Math.abs(hash).toString(16).toUpperCase()}`;
}

// ─── Sensor Data Collection ───────────────────────────────────────────────────

export function startSensorCollection(): void {
  const device = getCurrentDevice();
  if (!device) return;

  device.permissions.forEach(perm => {
    if (perm.granted) {
      startSensorListener(perm.sensor);
    }
  });

  // Start batch windowing
  if (!batchTimeout) {
    scheduleBatch();
  }
}

function startSensorListener(sensor: SensorType): void {
  if (typeof window === 'undefined') return;

  let cleanup: (() => void) | undefined;

  switch (sensor) {
    case 'motion':
      const motionHandler = (e: DeviceMotionEvent) => {
        addReading({
          sensor: 'motion',
          timestamp: new Date().toISOString(),
          beat: currentBeat,
          data: {
            accelerationX: e.acceleration?.x ?? 0,
            accelerationY: e.acceleration?.y ?? 0,
            accelerationZ: e.acceleration?.z ?? 0,
            rotationAlpha: e.rotationRate?.alpha ?? 0,
            rotationBeta: e.rotationRate?.beta ?? 0,
            rotationGamma: e.rotationRate?.gamma ?? 0,
          },
        });
      };
      window.addEventListener('devicemotion', motionHandler);
      cleanup = () => window.removeEventListener('devicemotion', motionHandler);
      break;

    case 'orientation':
      const orientationHandler = (e: DeviceOrientationEvent) => {
        addReading({
          sensor: 'orientation',
          timestamp: new Date().toISOString(),
          beat: currentBeat,
          data: {
            alpha: e.alpha ?? 0,
            beta: e.beta ?? 0,
            gamma: e.gamma ?? 0,
            absolute: e.absolute,
          },
        });
      };
      window.addEventListener('deviceorientation', orientationHandler);
      cleanup = () => window.removeEventListener('deviceorientation', orientationHandler);
      break;

    case 'network':
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const networkHandler = () => {
          addReading({
            sensor: 'network',
            timestamp: new Date().toISOString(),
            beat: currentBeat,
            data: {
              type: connection.effectiveType ?? 'unknown',
              downlink: connection.downlink ?? 0,
              rtt: connection.rtt ?? 0,
              saveData: connection.saveData ?? false,
            },
          });
        };
        connection.addEventListener('change', networkHandler);
        networkHandler(); // Initial reading
        cleanup = () => connection.removeEventListener('change', networkHandler);
      }
      break;

    case 'battery':
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          const batteryHandler = () => {
            addReading({
              sensor: 'battery',
              timestamp: new Date().toISOString(),
              beat: currentBeat,
              data: {
                level: battery.level * 100,
                charging: battery.charging,
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime,
              },
            });
          };
          battery.addEventListener('levelchange', batteryHandler);
          battery.addEventListener('chargingchange', batteryHandler);
          batteryHandler(); // Initial reading
          cleanup = () => {
            battery.removeEventListener('levelchange', batteryHandler);
            battery.removeEventListener('chargingchange', batteryHandler);
          };
        });
      }
      break;
  }

  if (cleanup) {
    sensorListeners.set(sensor, cleanup);
  }
}

function addReading(reading: SensorReading): void {
  batchBuffer.push(reading);
}

function scheduleBatch(): void {
  batchTimeout = setTimeout(() => {
    flushBatch();
    scheduleBatch();
  }, BATCH_WINDOW_MS);
}

function flushBatch(): void {
  const device = getCurrentDevice();
  if (!device || batchBuffer.length === 0) return;

  const batch: SensorBatch = {
    id: uuidv4(),
    deviceId: device.id,
    readings: [...batchBuffer],
    batchedAt: new Date().toISOString(),
    beat: currentBeat,
    windowMs: BATCH_WINDOW_MS,
  };

  device.sensorBatches.push(batch);
  
  // Keep only last 100 batches
  if (device.sensorBatches.length > 100) {
    device.sensorBatches = device.sensorBatches.slice(-100);
  }

  batchBuffer = [];
}

export function stopSensorCollection(): void {
  sensorListeners.forEach(cleanup => cleanup());
  sensorListeners.clear();

  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }
}

// ─── Heartbeat Integration ────────────────────────────────────────────────────

export function deviceHeartbeat(): void {
  currentBeat++;
  
  const device = getCurrentDevice();
  if (!device) return;

  device.lastSeen = new Date().toISOString();

  // Check for permissions that need re-requesting
  device.permissions.forEach(perm => {
    if (!perm.granted && perm.revokedAt) {
      const beatsSinceRevoke = currentBeat - (perm.lastReRequestBeat ?? 0);
      if (beatsSinceRevoke >= RE_REQUEST_INTERVAL_BEATS) {
        // Soft re-request - just flag it, don't actually request
        perm.reRequestCount++;
        perm.lastReRequestBeat = currentBeat;
        
        // Add to audit log
        if (device.sovereignContract) {
          device.sovereignContract.auditLog.push({
            action: 're-request',
            sensor: perm.sensor,
            timestamp: new Date().toISOString(),
            beat: currentBeat,
            reason: `Re-request attempt ${perm.reRequestCount}`,
          });
        }
      }
    }
  });

  // Update resonance strength based on sensor activity
  const activeSensors = sensorListeners.size;
  const grantedSensors = device.permissions.filter(p => p.granted).length;
  device.resonanceStrength = grantedSensors > 0 
    ? activeSensors / grantedSensors 
    : 0;
}

// ─── Export Device State ──────────────────────────────────────────────────────

export function getDeviceState(): {
  device: DeviceNode | null;
  currentBeat: number;
  batchWindowMs: number;
} {
  return {
    device: getCurrentDevice(),
    currentBeat,
    batchWindowMs: BATCH_WINDOW_MS,
  };
}

export function getPermissionsNeedingReRequest(): SensorPermission[] {
  const device = getCurrentDevice();
  if (!device) return [];
  return device.permissions.filter(p => !p.granted && p.revokedAt && p.reRequestCount > 0);
}
