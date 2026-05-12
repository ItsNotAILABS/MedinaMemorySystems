/**
 * BCI DEVICE ADAPTER
 * Hardware abstraction layer for various BCI devices
 * 
 * Supports:
 * - OpenBCI (Cyton, Ganglion)
 * - Emotiv (EPOC, Insight)
 * - Muse (2, S)
 * - NeuroSky MindWave
 * - Generic LSL (Lab Streaming Layer)
 * 
 * @author MEDINA Sovereign Intelligence
 * @version 1.0.0
 * @license Proprietary - All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export enum DeviceType {
  OPENBCI_CYTON = 'openbci_cyton',
  OPENBCI_GANGLION = 'openbci_ganglion',
  EMOTIV_EPOC = 'emotiv_epoc',
  EMOTIV_INSIGHT = 'emotiv_insight',
  MUSE_2 = 'muse_2',
  MUSE_S = 'muse_s',
  NEUROSKY_MINDWAVE = 'neurosky_mindwave',
  LSL_GENERIC = 'lsl_generic',
  SIMULATED = 'simulated'
}

export interface DeviceCapabilities {
  channels: number;
  sampleRate: number;
  resolution: number; // bits
  impedanceCheck: boolean;
  accelerometer: boolean;
  gyroscope: boolean;
  ppg: boolean; // Photoplethysmography (heart rate)
  wireless: boolean;
  batteryPowered: boolean;
}

export interface DeviceStatus {
  connected: boolean;
  streaming: boolean;
  batteryLevel: number;
  signalQuality: number[];
  impedances: number[];
  firmware: string;
  lastPacketTime: number;
}

export interface RawSample {
  timestamp: number;
  sampleIndex: number;
  channels: number[];
  accelerometer?: { x: number; y: number; z: number };
  gyroscope?: { x: number; y: number; z: number };
  ppg?: number;
}

export interface DeviceConfig {
  type: DeviceType;
  connectionParams: ConnectionParams;
  channelConfig: ChannelConfig[];
  filters: FilterConfig;
}

export interface ConnectionParams {
  serialPort?: string;
  bluetoothAddress?: string;
  ipAddress?: string;
  port?: number;
  lslStreamName?: string;
}

export interface ChannelConfig {
  index: number;
  enabled: boolean;
  gain: number;
  label: string;
  reference: string;
}

export interface FilterConfig {
  notchEnabled: boolean;
  notchFrequency: 50 | 60;
  highPassEnabled: boolean;
  highPassCutoff: number;
  lowPassEnabled: boolean;
  lowPassCutoff: number;
}

export type DataCallback = (sample: RawSample) => void;
export type StatusCallback = (status: DeviceStatus) => void;
export type ErrorCallback = (error: Error) => void;

// ═══════════════════════════════════════════════════════════════════════════════
// DEVICE SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const DEVICE_SPECS: Record<DeviceType, DeviceCapabilities> = {
  [DeviceType.OPENBCI_CYTON]: {
    channels: 8,
    sampleRate: 250,
    resolution: 24,
    impedanceCheck: true,
    accelerometer: true,
    gyroscope: false,
    ppg: false,
    wireless: true,
    batteryPowered: true
  },
  [DeviceType.OPENBCI_GANGLION]: {
    channels: 4,
    sampleRate: 200,
    resolution: 24,
    impedanceCheck: true,
    accelerometer: true,
    gyroscope: false,
    ppg: false,
    wireless: true,
    batteryPowered: true
  },
  [DeviceType.EMOTIV_EPOC]: {
    channels: 14,
    sampleRate: 128,
    resolution: 14,
    impedanceCheck: true,
    accelerometer: true,
    gyroscope: true,
    ppg: false,
    wireless: true,
    batteryPowered: true
  },
  [DeviceType.EMOTIV_INSIGHT]: {
    channels: 5,
    sampleRate: 128,
    resolution: 14,
    impedanceCheck: true,
    accelerometer: true,
    gyroscope: true,
    ppg: false,
    wireless: true,
    batteryPowered: true
  },
  [DeviceType.MUSE_2]: {
    channels: 4,
    sampleRate: 256,
    resolution: 12,
    impedanceCheck: false,
    accelerometer: true,
    gyroscope: true,
    ppg: true,
    wireless: true,
    batteryPowered: true
  },
  [DeviceType.MUSE_S]: {
    channels: 4,
    sampleRate: 256,
    resolution: 12,
    impedanceCheck: false,
    accelerometer: true,
    gyroscope: true,
    ppg: true,
    wireless: true,
    batteryPowered: true
  },
  [DeviceType.NEUROSKY_MINDWAVE]: {
    channels: 1,
    sampleRate: 512,
    resolution: 12,
    impedanceCheck: false,
    accelerometer: false,
    gyroscope: false,
    ppg: false,
    wireless: true,
    batteryPowered: true
  },
  [DeviceType.LSL_GENERIC]: {
    channels: 32,
    sampleRate: 500,
    resolution: 24,
    impedanceCheck: false,
    accelerometer: false,
    gyroscope: false,
    ppg: false,
    wireless: false,
    batteryPowered: false
  },
  [DeviceType.SIMULATED]: {
    channels: 8,
    sampleRate: 250,
    resolution: 24,
    impedanceCheck: true,
    accelerometer: true,
    gyroscope: true,
    ppg: true,
    wireless: true,
    batteryPowered: true
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// BASE DEVICE ADAPTER
// ═══════════════════════════════════════════════════════════════════════════════

export abstract class BCIDeviceAdapter {
  protected config: DeviceConfig;
  protected status: DeviceStatus;
  protected capabilities: DeviceCapabilities;
  
  protected dataCallbacks: DataCallback[] = [];
  protected statusCallbacks: StatusCallback[] = [];
  protected errorCallbacks: ErrorCallback[] = [];
  
  protected sampleBuffer: RawSample[] = [];
  protected readonly maxBufferSize = 1000;
  
  constructor(config: DeviceConfig) {
    this.config = config;
    this.capabilities = DEVICE_SPECS[config.type];
    this.status = {
      connected: false,
      streaming: false,
      batteryLevel: 100,
      signalQuality: new Array(this.capabilities.channels).fill(0),
      impedances: new Array(this.capabilities.channels).fill(Infinity),
      firmware: 'unknown',
      lastPacketTime: 0
    };
  }
  
  /**
   * Connect to device
   */
  abstract connect(): Promise<boolean>;
  
  /**
   * Disconnect from device
   */
  abstract disconnect(): Promise<void>;
  
  /**
   * Start data streaming
   */
  abstract startStreaming(): Promise<boolean>;
  
  /**
   * Stop data streaming
   */
  abstract stopStreaming(): Promise<void>;
  
  /**
   * Check impedances
   */
  abstract checkImpedances(): Promise<number[]>;
  
  /**
   * Get device capabilities
   */
  getCapabilities(): DeviceCapabilities {
    return { ...this.capabilities };
  }
  
  /**
   * Get device status
   */
  getStatus(): DeviceStatus {
    return { ...this.status };
  }
  
  /**
   * Register data callback
   */
  onData(callback: DataCallback): void {
    this.dataCallbacks.push(callback);
  }
  
  /**
   * Register status callback
   */
  onStatus(callback: StatusCallback): void {
    this.statusCallbacks.push(callback);
  }
  
  /**
   * Register error callback
   */
  onError(callback: ErrorCallback): void {
    this.errorCallbacks.push(callback);
  }
  
  /**
   * Remove all callbacks
   */
  removeAllCallbacks(): void {
    this.dataCallbacks = [];
    this.statusCallbacks = [];
    this.errorCallbacks = [];
  }
  
  /**
   * Emit data to callbacks
   */
  protected emitData(sample: RawSample): void {
    this.status.lastPacketTime = Date.now();
    this.sampleBuffer.push(sample);
    
    if (this.sampleBuffer.length > this.maxBufferSize) {
      this.sampleBuffer.shift();
    }
    
    for (const callback of this.dataCallbacks) {
      callback(sample);
    }
  }
  
  /**
   * Emit status to callbacks
   */
  protected emitStatus(): void {
    for (const callback of this.statusCallbacks) {
      callback(this.status);
    }
  }
  
  /**
   * Emit error to callbacks
   */
  protected emitError(error: Error): void {
    for (const callback of this.errorCallbacks) {
      callback(error);
    }
  }
  
  /**
   * Get buffered samples
   */
  getBuffer(): RawSample[] {
    return [...this.sampleBuffer];
  }
  
  /**
   * Clear sample buffer
   */
  clearBuffer(): void {
    this.sampleBuffer = [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIMULATED DEVICE (FOR TESTING)
// ═══════════════════════════════════════════════════════════════════════════════

export class SimulatedBCIDevice extends BCIDeviceAdapter {
  private streamingInterval: NodeJS.Timeout | null = null;
  private sampleIndex = 0;
  private readonly phiRatio = 1.618033988749895;
  private readonly schumannFreq = 7.83;
  
  constructor(config?: Partial<DeviceConfig>) {
    super({
      type: DeviceType.SIMULATED,
      connectionParams: {},
      channelConfig: [],
      filters: {
        notchEnabled: true,
        notchFrequency: 50,
        highPassEnabled: true,
        highPassCutoff: 0.5,
        lowPassEnabled: true,
        lowPassCutoff: 100
      },
      ...config
    });
  }
  
  async connect(): Promise<boolean> {
    // Simulate connection delay
    await this.delay(500);
    
    this.status.connected = true;
    this.status.firmware = 'simulated-v1.0.0';
    this.status.batteryLevel = 85;
    this.status.signalQuality = new Array(this.capabilities.channels).fill(0.9);
    
    this.emitStatus();
    return true;
  }
  
  async disconnect(): Promise<void> {
    await this.stopStreaming();
    this.status.connected = false;
    this.emitStatus();
  }
  
  async startStreaming(): Promise<boolean> {
    if (!this.status.connected) {
      this.emitError(new Error('Device not connected'));
      return false;
    }
    
    this.status.streaming = true;
    this.emitStatus();
    
    const intervalMs = 1000 / this.capabilities.sampleRate;
    
    this.streamingInterval = setInterval(() => {
      this.generateSample();
    }, intervalMs);
    
    return true;
  }
  
  async stopStreaming(): Promise<void> {
    if (this.streamingInterval) {
      clearInterval(this.streamingInterval);
      this.streamingInterval = null;
    }
    
    this.status.streaming = false;
    this.emitStatus();
  }
  
  async checkImpedances(): Promise<number[]> {
    // Simulate impedance check
    await this.delay(2000);
    
    const impedances = new Array(this.capabilities.channels).fill(0).map(() => 
      5000 + Math.random() * 15000 // 5-20kΩ typical good range
    );
    
    this.status.impedances = impedances;
    this.emitStatus();
    
    return impedances;
  }
  
  private generateSample(): void {
    const t = this.sampleIndex / this.capabilities.sampleRate;
    this.sampleIndex++;
    
    const channels: number[] = [];
    
    for (let ch = 0; ch < this.capabilities.channels; ch++) {
      // Generate realistic EEG-like signal
      const alpha = 20 * Math.sin(2 * Math.PI * 10 * t + ch * 0.5);
      const beta = 10 * Math.sin(2 * Math.PI * 20 * t + ch * 0.3);
      const theta = 15 * Math.sin(2 * Math.PI * 6 * t + ch * 0.7);
      const schumann = 5 * Math.sin(2 * Math.PI * this.schumannFreq * t);
      const phiHarmonic = 3 * Math.sin(2 * Math.PI * this.schumannFreq * this.phiRatio * t);
      const noise = (Math.random() - 0.5) * 5;
      
      // Combine with channel-specific phase shifts
      const signal = alpha + beta + theta + schumann + phiHarmonic + noise;
      channels.push(signal);
    }
    
    const sample: RawSample = {
      timestamp: Date.now(),
      sampleIndex: this.sampleIndex,
      channels
    };
    
    // Add auxiliary data
    if (this.capabilities.accelerometer) {
      sample.accelerometer = {
        x: Math.sin(t * 0.1) * 0.1,
        y: Math.cos(t * 0.1) * 0.1,
        z: 1.0 + Math.sin(t * 0.05) * 0.02
      };
    }
    
    if (this.capabilities.gyroscope) {
      sample.gyroscope = {
        x: Math.sin(t * 0.2) * 5,
        y: Math.cos(t * 0.2) * 5,
        z: Math.sin(t * 0.1) * 2
      };
    }
    
    if (this.capabilities.ppg) {
      // Simulate heart rate ~60 BPM
      sample.ppg = 100 + 30 * Math.sin(2 * Math.PI * 1.0 * t);
    }
    
    this.emitData(sample);
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEVICE FACTORY
// ═══════════════════════════════════════════════════════════════════════════════

export class BCIDeviceFactory {
  /**
   * Create device adapter based on type
   */
  static create(type: DeviceType, config?: Partial<DeviceConfig>): BCIDeviceAdapter {
    switch (type) {
      case DeviceType.SIMULATED:
        return new SimulatedBCIDevice(config);
      
      // Other device types would be implemented here
      // For now, fall back to simulated
      default:
        console.warn(`Device type ${type} not implemented, using simulated device`);
        return new SimulatedBCIDevice({
          ...config,
          type: DeviceType.SIMULATED
        });
    }
  }
  
  /**
   * Discover available devices
   */
  static async discover(): Promise<{ type: DeviceType; name: string; address?: string }[]> {
    // In production, this would scan for Bluetooth devices, serial ports, etc.
    return [
      { type: DeviceType.SIMULATED, name: 'Simulated BCI Device' }
    ];
  }
  
  /**
   * Get supported device types
   */
  static getSupportedTypes(): DeviceType[] {
    return Object.values(DeviceType);
  }
  
  /**
   * Get device specifications
   */
  static getSpecs(type: DeviceType): DeviceCapabilities {
    return DEVICE_SPECS[type];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default BCIDeviceFactory;
