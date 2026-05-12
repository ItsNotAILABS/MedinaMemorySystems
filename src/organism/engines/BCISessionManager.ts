/**
 * BCI SESSION MANAGER
 * Orchestrates complete BCI sessions with coherence tracking
 * 
 * Manages:
 * - Device connection and calibration
 * - Signal acquisition and processing
 * - State recognition (motor, emotional)
 * - Coherence bridge integration
 * - Session logging and analytics
 * 
 * @author MEDINA Sovereign Intelligence
 * @version 1.0.0
 * @license Proprietary - All Rights Reserved
 */

import BrainComputerInterfaceEngine, {
  NeuralSignal,
  EmotionalState,
  MotorImageryState,
  BCICommand,
  NeurofeedbackSignal
} from './BrainComputerInterface';

import NeuralCoherenceBridge, {
  OrganismState,
  CouplingState,
  IntentionVector,
  BridgeMode
} from './NeuralCoherenceBridge';

import BCIDeviceFactory, {
  BCIDeviceAdapter,
  DeviceType,
  DeviceStatus,
  RawSample,
  DeviceCapabilities
} from './BCIDeviceAdapter';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const DEFAULT_WINDOW_SIZE = 256; // samples
const DEFAULT_OVERLAP = 0.5; // 50% overlap

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export enum SessionPhase {
  IDLE = 'idle',
  CONNECTING = 'connecting',
  CALIBRATING = 'calibrating',
  RUNNING = 'running',
  PAUSED = 'paused',
  CLOSING = 'closing'
}

export interface SessionConfig {
  deviceType: DeviceType;
  windowSize: number;
  overlap: number;
  autoCalibrate: boolean;
  coherenceThreshold: number;
  feedbackEnabled: boolean;
  loggingEnabled: boolean;
}

export interface SessionState {
  id: string;
  phase: SessionPhase;
  startTime: number;
  duration: number;
  sampleCount: number;
  commandCount: number;
  avgCoherence: number;
  peakCoherence: number;
  bridgeMode: BridgeMode;
}

export interface CalibrationResult {
  success: boolean;
  baseline: number[];
  threshold: number[];
  impedances: number[];
  signalQuality: number[];
  duration: number;
}

export interface SessionMetrics {
  totalSamples: number;
  totalCommands: number;
  commandAccuracy: number;
  avgCoherence: number;
  peakCoherence: number;
  timeInCoherence: number; // seconds above threshold
  coherenceEvents: number;
  motorIntents: number;
  emotionalStates: number;
}

export interface SessionLog {
  timestamp: number;
  type: 'info' | 'warning' | 'error' | 'metric';
  message: string;
  data?: unknown;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNAL WINDOWING
// ═══════════════════════════════════════════════════════════════════════════════

class SignalWindower {
  private buffer: number[][] = [];
  private readonly windowSize: number;
  private readonly hopSize: number;
  private readonly numChannels: number;
  
  constructor(numChannels: number, windowSize: number, overlap: number) {
    this.numChannels = numChannels;
    this.windowSize = windowSize;
    this.hopSize = Math.floor(windowSize * (1 - overlap));
    
    // Initialize channel buffers
    for (let ch = 0; ch < numChannels; ch++) {
      this.buffer[ch] = [];
    }
  }
  
  /**
   * Add samples and return complete windows
   */
  addSample(channelData: number[]): number[][] | null {
    // Add to buffers
    for (let ch = 0; ch < this.numChannels; ch++) {
      this.buffer[ch].push(channelData[ch] || 0);
    }
    
    // Check if we have a complete window
    if (this.buffer[0].length >= this.windowSize) {
      // Extract window
      const window: number[][] = [];
      for (let ch = 0; ch < this.numChannels; ch++) {
        window[ch] = this.buffer[ch].slice(0, this.windowSize);
        // Remove hop samples (keep overlap)
        this.buffer[ch] = this.buffer[ch].slice(this.hopSize);
      }
      
      return window;
    }
    
    return null;
  }
  
  /**
   * Clear all buffers
   */
  clear(): void {
    for (let ch = 0; ch < this.numChannels; ch++) {
      this.buffer[ch] = [];
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CALIBRATION MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

class CalibrationManager {
  private baselineData: number[][] = [];
  private readonly calibrationDuration = 30; // seconds
  private readonly numChannels: number;
  
  constructor(numChannels: number) {
    this.numChannels = numChannels;
    for (let ch = 0; ch < numChannels; ch++) {
      this.baselineData[ch] = [];
    }
  }
  
  /**
   * Add calibration sample
   */
  addSample(channelData: number[]): void {
    for (let ch = 0; ch < this.numChannels; ch++) {
      this.baselineData[ch].push(channelData[ch] || 0);
    }
  }
  
  /**
   * Calculate calibration results
   */
  calculateBaseline(): { baseline: number[]; threshold: number[] } {
    const baseline: number[] = [];
    const threshold: number[] = [];
    
    for (let ch = 0; ch < this.numChannels; ch++) {
      const data = this.baselineData[ch];
      if (data.length === 0) {
        baseline[ch] = 0;
        threshold[ch] = 100; // Default threshold
        continue;
      }
      
      // Calculate mean (baseline)
      const mean = data.reduce((a, b) => a + b, 0) / data.length;
      baseline[ch] = mean;
      
      // Calculate standard deviation for threshold
      const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / data.length;
      const std = Math.sqrt(variance);
      
      // Threshold = mean + 2 standard deviations
      threshold[ch] = mean + 2 * std;
    }
    
    return { baseline, threshold };
  }
  
  /**
   * Clear calibration data
   */
  clear(): void {
    for (let ch = 0; ch < this.numChannels; ch++) {
      this.baselineData[ch] = [];
    }
  }
  
  /**
   * Get sample count
   */
  getSampleCount(): number {
    return this.baselineData[0]?.length || 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BCI SESSION MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

export class BCISessionManager {
  private readonly config: SessionConfig;
  private readonly bciEngine: BrainComputerInterfaceEngine;
  private readonly coherenceBridge: NeuralCoherenceBridge;
  
  private device: BCIDeviceAdapter | null = null;
  private windower: SignalWindower | null = null;
  private calibration: CalibrationManager | null = null;
  
  private state: SessionState;
  private metrics: SessionMetrics;
  private logs: SessionLog[] = [];
  private calibrationResult: CalibrationResult | null = null;
  
  // Callbacks
  private onStateChange: ((state: SessionState) => void) | null = null;
  private onCoherence: ((coupling: CouplingState) => void) | null = null;
  private onCommand: ((command: BCICommand) => void) | null = null;
  private onFeedback: ((signal: NeurofeedbackSignal) => void) | null = null;
  
  constructor(config?: Partial<SessionConfig>) {
    this.config = {
      deviceType: DeviceType.SIMULATED,
      windowSize: DEFAULT_WINDOW_SIZE,
      overlap: DEFAULT_OVERLAP,
      autoCalibrate: true,
      coherenceThreshold: 0.6,
      feedbackEnabled: true,
      loggingEnabled: true,
      ...config
    };
    
    this.bciEngine = new BrainComputerInterfaceEngine();
    this.coherenceBridge = new NeuralCoherenceBridge(this.bciEngine);
    
    this.state = this.createInitialState();
    this.metrics = this.createInitialMetrics();
  }
  
  private createInitialState(): SessionState {
    return {
      id: this.generateSessionId(),
      phase: SessionPhase.IDLE,
      startTime: 0,
      duration: 0,
      sampleCount: 0,
      commandCount: 0,
      avgCoherence: 0,
      peakCoherence: 0,
      bridgeMode: 'passive'
    };
  }
  
  private createInitialMetrics(): SessionMetrics {
    return {
      totalSamples: 0,
      totalCommands: 0,
      commandAccuracy: 0,
      avgCoherence: 0,
      peakCoherence: 0,
      timeInCoherence: 0,
      coherenceEvents: 0,
      motorIntents: 0,
      emotionalStates: 0
    };
  }
  
  private generateSessionId(): string {
    return `bci-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Start a new BCI session
   */
  async start(): Promise<boolean> {
    if (this.state.phase !== SessionPhase.IDLE) {
      this.log('warning', 'Session already in progress');
      return false;
    }
    
    try {
      // Connect to device
      this.setPhase(SessionPhase.CONNECTING);
      this.device = BCIDeviceFactory.create(this.config.deviceType);
      
      const connected = await this.device.connect();
      if (!connected) {
        this.log('error', 'Failed to connect to device');
        this.setPhase(SessionPhase.IDLE);
        return false;
      }
      
      this.log('info', `Connected to ${this.config.deviceType}`);
      
      // Setup signal processing
      const caps = this.device.getCapabilities();
      this.windower = new SignalWindower(
        caps.channels,
        this.config.windowSize,
        this.config.overlap
      );
      
      // Calibration
      if (this.config.autoCalibrate) {
        this.setPhase(SessionPhase.CALIBRATING);
        const calibrated = await this.runCalibration();
        if (!calibrated) {
          this.log('warning', 'Calibration incomplete, using defaults');
        }
      }
      
      // Setup data handler
      this.device.onData(this.handleSample.bind(this));
      this.device.onError((error) => this.log('error', error.message));
      
      // Start streaming
      this.setPhase(SessionPhase.RUNNING);
      this.state.startTime = Date.now();
      
      await this.device.startStreaming();
      this.log('info', 'Session started');
      
      return true;
    } catch (error) {
      this.log('error', `Session start failed: ${error}`);
      this.setPhase(SessionPhase.IDLE);
      return false;
    }
  }
  
  /**
   * Pause the current session
   */
  async pause(): Promise<void> {
    if (this.state.phase !== SessionPhase.RUNNING) return;
    
    await this.device?.stopStreaming();
    this.setPhase(SessionPhase.PAUSED);
    this.log('info', 'Session paused');
  }
  
  /**
   * Resume a paused session
   */
  async resume(): Promise<void> {
    if (this.state.phase !== SessionPhase.PAUSED) return;
    
    await this.device?.startStreaming();
    this.setPhase(SessionPhase.RUNNING);
    this.log('info', 'Session resumed');
  }
  
  /**
   * Stop and close the session
   */
  async stop(): Promise<SessionMetrics> {
    if (this.state.phase === SessionPhase.IDLE) {
      return this.metrics;
    }
    
    this.setPhase(SessionPhase.CLOSING);
    
    if (this.device) {
      await this.device.stopStreaming();
      await this.device.disconnect();
      this.device.removeAllCallbacks();
      this.device = null;
    }
    
    // Calculate final metrics
    this.state.duration = Date.now() - this.state.startTime;
    this.finalizeMetrics();
    
    this.log('info', `Session ended. Duration: ${this.state.duration}ms, Samples: ${this.metrics.totalSamples}`);
    
    this.setPhase(SessionPhase.IDLE);
    
    return this.metrics;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CALIBRATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  private async runCalibration(): Promise<boolean> {
    if (!this.device) return false;
    
    const caps = this.device.getCapabilities();
    this.calibration = new CalibrationManager(caps.channels);
    
    this.log('info', 'Starting calibration (30 seconds)...');
    
    // Check impedances first
    const impedances = await this.device.checkImpedances();
    const signalQuality = this.device.getStatus().signalQuality;
    
    // Start streaming for baseline collection
    await this.device.startStreaming();
    
    // Collect baseline data
    const calibrationPromise = new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        const samples = this.calibration!.getSampleCount();
        const targetSamples = caps.sampleRate * 30; // 30 seconds
        
        if (samples >= targetSamples) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 1000);
    });
    
    // Temporary handler for calibration
    const originalHandler = this.handleSample.bind(this);
    this.device.removeAllCallbacks();
    this.device.onData((sample) => {
      this.calibration?.addSample(sample.channels);
    });
    
    await calibrationPromise;
    
    // Stop streaming and calculate baseline
    await this.device.stopStreaming();
    
    const { baseline, threshold } = this.calibration.calculateBaseline();
    
    this.calibrationResult = {
      success: true,
      baseline,
      threshold,
      impedances,
      signalQuality,
      duration: 30000
    };
    
    // Restore handler
    this.device.onData(originalHandler);
    
    this.log('info', 'Calibration complete');
    return true;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SIGNAL PROCESSING
  // ═══════════════════════════════════════════════════════════════════════════
  
  private handleSample(sample: RawSample): void {
    this.state.sampleCount++;
    this.metrics.totalSamples++;
    
    // Window the signal
    const window = this.windower?.addSample(sample.channels);
    if (!window) return;
    
    // Process the window
    this.processWindow(window, sample.timestamp);
  }
  
  private processWindow(channels: number[][], timestamp: number): void {
    const caps = this.device?.getCapabilities();
    if (!caps) return;
    
    // Create neural signal object
    const signal: NeuralSignal = {
      timestamp,
      channels: channels[0], // Simplified - use first channel
      sampleRate: caps.sampleRate,
      electrodePositions: []
    };
    
    // Process through BCI engine
    this.bciEngine.processSignal(signal);
    
    // Decode motor imagery (if we have enough channels)
    if (channels.length >= 4) {
      const motorState = this.bciEngine.decodeMotorIntent(channels);
      if (motorState.confidence > 0.7) {
        this.metrics.motorIntents++;
      }
    }
    
    // Recognize emotional state (simplified - use first two channels as frontal)
    if (channels.length >= 2) {
      const emotionalState = this.bciEngine.recognizeEmotion(
        channels[0],
        channels[1],
        caps.sampleRate
      );
      
      // Update coherence tracking
      this.updateCoherence(emotionalState);
      this.metrics.emotionalStates++;
    }
    
    // Generate feedback if enabled
    if (this.config.feedbackEnabled) {
      this.generateFeedback();
    }
  }
  
  private updateCoherence(emotionalState: EmotionalState): void {
    // Create organism state (simplified)
    const organismState: OrganismState = {
      coherenceIndex: 0.5 + 0.3 * Math.sin(Date.now() / 1000), // Simulated
      harmonyLevel: 0.7,
      activeEngines: ['sovereign', 'bci'],
      cardiacPhase: (Date.now() % 873) / 873, // Based on 873ms cardiac cycle
      respiratoryPhase: (Date.now() % 4000) / 4000 // ~15 breaths/min
    };
    
    // Update bridge
    const coupling = this.coherenceBridge.update(organismState);
    
    // Track coherence metrics
    const coherence = coupling.neuralCoherence;
    this.updateCoherenceMetrics(coherence);
    
    // Emit to callback
    if (this.onCoherence) {
      this.onCoherence(coupling);
    }
    
    // Check for coherence events
    if (coherence > this.config.coherenceThreshold) {
      this.metrics.coherenceEvents++;
    }
  }
  
  private updateCoherenceMetrics(coherence: number): void {
    // Running average
    const n = this.metrics.totalSamples;
    this.metrics.avgCoherence = (this.metrics.avgCoherence * (n - 1) + coherence) / n;
    
    // Peak tracking
    if (coherence > this.metrics.peakCoherence) {
      this.metrics.peakCoherence = coherence;
    }
    
    // Time in coherence
    if (coherence > this.config.coherenceThreshold) {
      const dt = this.config.windowSize / (this.device?.getCapabilities().sampleRate || 250);
      this.metrics.timeInCoherence += dt;
    }
    
    // Update state
    this.state.avgCoherence = this.metrics.avgCoherence;
    this.state.peakCoherence = this.metrics.peakCoherence;
    this.state.bridgeMode = this.coherenceBridge.getMode();
  }
  
  private generateFeedback(): void {
    const feedback = this.bciEngine.generateFeedback(this.config.coherenceThreshold);
    
    if (feedback && this.onFeedback) {
      this.onFeedback(feedback);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  private setPhase(phase: SessionPhase): void {
    this.state.phase = phase;
    this.state.duration = this.state.startTime > 0 ? Date.now() - this.state.startTime : 0;
    
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }
  
  private finalizeMetrics(): void {
    const commands = this.bciEngine.getRecentCommands(1000);
    this.metrics.totalCommands = commands.length;
    
    // Calculate command accuracy (verified vs total)
    const verified = commands.filter(c => c.confidence > 0.7).length;
    this.metrics.commandAccuracy = commands.length > 0 ? verified / commands.length : 0;
    
    this.state.commandCount = this.metrics.totalCommands;
  }
  
  private log(type: SessionLog['type'], message: string, data?: unknown): void {
    if (!this.config.loggingEnabled) return;
    
    const entry: SessionLog = {
      timestamp: Date.now(),
      type,
      message,
      data
    };
    
    this.logs.push(entry);
    
    // Keep log size manageable
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-500);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Set bridge mode
   */
  setBridgeMode(mode: BridgeMode): void {
    this.coherenceBridge.setMode(mode);
    this.state.bridgeMode = mode;
  }
  
  /**
   * Get current state
   */
  getState(): SessionState {
    return { ...this.state };
  }
  
  /**
   * Get current metrics
   */
  getMetrics(): SessionMetrics {
    return { ...this.metrics };
  }
  
  /**
   * Get current intention
   */
  getIntention(): IntentionVector {
    return this.coherenceBridge.getIntention();
  }
  
  /**
   * Get coupling state
   */
  getCouplingState(): CouplingState {
    return this.coherenceBridge.getCouplingState();
  }
  
  /**
   * Get device status
   */
  getDeviceStatus(): DeviceStatus | null {
    return this.device?.getStatus() || null;
  }
  
  /**
   * Get calibration result
   */
  getCalibrationResult(): CalibrationResult | null {
    return this.calibrationResult;
  }
  
  /**
   * Get session logs
   */
  getLogs(limit: number = 100): SessionLog[] {
    return this.logs.slice(-limit);
  }
  
  /**
   * Register callbacks
   */
  setCallbacks(callbacks: {
    onStateChange?: (state: SessionState) => void;
    onCoherence?: (coupling: CouplingState) => void;
    onCommand?: (command: BCICommand) => void;
    onFeedback?: (signal: NeurofeedbackSignal) => void;
  }): void {
    if (callbacks.onStateChange) this.onStateChange = callbacks.onStateChange;
    if (callbacks.onCoherence) this.onCoherence = callbacks.onCoherence;
    if (callbacks.onCommand) this.onCommand = callbacks.onCommand;
    if (callbacks.onFeedback) this.onFeedback = callbacks.onFeedback;
  }
  
  /**
   * Get diagnostics
   */
  getDiagnostics(): object {
    return {
      session: this.state,
      metrics: this.metrics,
      device: this.device?.getStatus(),
      calibration: this.calibrationResult,
      bridge: this.coherenceBridge.getDiagnostics(),
      bci: this.bciEngine.getDiagnostics()
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default BCISessionManager;
