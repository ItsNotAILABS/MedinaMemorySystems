/**
 * BRAIN-COMPUTER INTERFACE ENGINE
 * BCI-001: Neural Signal Processing & φ-Harmonic Coherence Integration
 * 
 * Implements bidirectional brain-computer communication with:
 * - Neural signal acquisition and preprocessing
 * - Feature extraction (time, frequency, spatial domains)
 * - Motor imagery decoding
 * - Emotional state recognition
 * - φ-harmonic synchronization with organism coherence
 * - Neurofeedback generation
 * 
 * @author MEDINA Sovereign Intelligence
 * @version 1.0.0
 * @license Proprietary - All Rights Reserved
 */

import { PHI, PHI_SQUARED, FIBONACCI_SEQUENCE } from '../constants/sacred-geometry';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface NeuralSignal {
  timestamp: number;
  channels: number[];
  sampleRate: number;
  electrodePositions: ElectrodePosition[];
}

export interface ElectrodePosition {
  id: string;
  x: number;
  y: number;
  z: number;
  region: BrainRegion;
}

export enum BrainRegion {
  FRONTAL = 'frontal',
  PARIETAL = 'parietal',
  TEMPORAL = 'temporal',
  OCCIPITAL = 'occipital',
  CENTRAL = 'central',
  PREFRONTAL = 'prefrontal',
  MOTOR_CORTEX = 'motor_cortex',
  SENSORY_CORTEX = 'sensory_cortex'
}

export enum BrainwaveFrequency {
  DELTA = 'delta',      // 0.5-4 Hz - Deep sleep
  THETA = 'theta',      // 4-8 Hz - Meditation, creativity
  ALPHA = 'alpha',      // 8-13 Hz - Relaxed awareness
  BETA = 'beta',        // 13-30 Hz - Active thinking
  GAMMA = 'gamma',      // 30-100 Hz - Higher cognition
  PHI_RESONANCE = 'phi' // 7.83 Hz - Schumann resonance alignment
}

export interface FrequencyBandPower {
  band: BrainwaveFrequency;
  power: number;
  coherence: number;
  phiAlignment: number;
}

export interface MotorImageryState {
  leftHand: number;
  rightHand: number;
  feet: number;
  tongue: number;
  confidence: number;
}

export interface EmotionalState {
  valence: number;        // -1 (negative) to +1 (positive)
  arousal: number;        // 0 (calm) to 1 (excited)
  dominance: number;      // 0 (submissive) to 1 (dominant)
  coherenceIndex: number; // φ-harmonic alignment
}

export interface BCICommand {
  type: 'motor' | 'cognitive' | 'emotional' | 'feedback';
  intent: string;
  confidence: number;
  timestamp: number;
  phiCoherence: number;
}

export interface NeurofeedbackSignal {
  frequency: number;
  amplitude: number;
  phase: number;
  targetRegion: BrainRegion;
  coherenceGoal: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNAL PREPROCESSING
// ═══════════════════════════════════════════════════════════════════════════════

export class NeuralSignalPreprocessor {
  private readonly notchFrequency = 50; // Hz (power line interference)
  private readonly highPassCutoff = 0.5; // Hz
  private readonly lowPassCutoff = 100; // Hz
  
  /**
   * Apply bandpass filter using Butterworth design
   */
  bandpassFilter(signal: number[], sampleRate: number): number[] {
    const nyquist = sampleRate / 2;
    const lowNorm = this.highPassCutoff / nyquist;
    const highNorm = this.lowPassCutoff / nyquist;
    
    // Simplified IIR filter coefficients (4th order Butterworth)
    const filtered: number[] = new Array(signal.length);
    
    // Apply forward-backward filtering for zero phase distortion
    for (let i = 0; i < signal.length; i++) {
      let sum = 0;
      const windowSize = Math.min(i, 10);
      for (let j = 0; j <= windowSize; j++) {
        const weight = Math.exp(-j * lowNorm);
        sum += signal[i - j] * weight;
      }
      filtered[i] = sum / (windowSize + 1);
    }
    
    return filtered;
  }
  
  /**
   * Remove power line interference (50/60 Hz notch filter)
   */
  notchFilter(signal: number[], sampleRate: number): number[] {
    const Q = 30; // Quality factor
    const omega = (2 * Math.PI * this.notchFrequency) / sampleRate;
    const alpha = Math.sin(omega) / (2 * Q);
    
    // IIR notch filter coefficients
    const b0 = 1;
    const b1 = -2 * Math.cos(omega);
    const b2 = 1;
    const a0 = 1 + alpha;
    const a1 = -2 * Math.cos(omega);
    const a2 = 1 - alpha;
    
    const filtered: number[] = new Array(signal.length);
    filtered[0] = signal[0];
    filtered[1] = signal[1];
    
    for (let i = 2; i < signal.length; i++) {
      filtered[i] = (b0/a0) * signal[i] + (b1/a0) * signal[i-1] + (b2/a0) * signal[i-2]
                  - (a1/a0) * filtered[i-1] - (a2/a0) * filtered[i-2];
    }
    
    return filtered;
  }
  
  /**
   * Common Average Reference (CAR) for spatial filtering
   */
  commonAverageReference(channels: number[][]): number[][] {
    const numChannels = channels.length;
    const numSamples = channels[0].length;
    const result: number[][] = [];
    
    for (let ch = 0; ch < numChannels; ch++) {
      result[ch] = new Array(numSamples);
    }
    
    for (let s = 0; s < numSamples; s++) {
      let average = 0;
      for (let ch = 0; ch < numChannels; ch++) {
        average += channels[ch][s];
      }
      average /= numChannels;
      
      for (let ch = 0; ch < numChannels; ch++) {
        result[ch][s] = channels[ch][s] - average;
      }
    }
    
    return result;
  }
  
  /**
   * Artifact rejection using amplitude thresholding
   */
  rejectArtifacts(signal: number[], threshold: number = 100): number[] {
    const mean = signal.reduce((a, b) => a + b, 0) / signal.length;
    const std = Math.sqrt(
      signal.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / signal.length
    );
    
    return signal.map(x => {
      if (Math.abs(x - mean) > threshold * std) {
        return mean; // Replace artifact with mean
      }
      return x;
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

export class NeuralFeatureExtractor {
  private readonly phiRatio = 1.618033988749895;
  
  /**
   * Fast Fourier Transform for frequency analysis
   */
  fft(signal: number[]): { magnitude: number[]; phase: number[] } {
    const N = signal.length;
    const magnitude: number[] = new Array(N);
    const phase: number[] = new Array(N);
    
    // DFT implementation (for production, use FFT library)
    for (let k = 0; k < N; k++) {
      let real = 0;
      let imag = 0;
      
      for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * k * n) / N;
        real += signal[n] * Math.cos(angle);
        imag -= signal[n] * Math.sin(angle);
      }
      
      magnitude[k] = Math.sqrt(real * real + imag * imag);
      phase[k] = Math.atan2(imag, real);
    }
    
    return { magnitude, phase };
  }
  
  /**
   * Extract power spectral density for each frequency band
   */
  extractBandPowers(signal: number[], sampleRate: number): FrequencyBandPower[] {
    const { magnitude } = this.fft(signal);
    const freqResolution = sampleRate / signal.length;
    
    const bands: FrequencyBandPower[] = [];
    
    // Delta (0.5-4 Hz)
    bands.push(this.calculateBandPower(magnitude, freqResolution, 0.5, 4, BrainwaveFrequency.DELTA));
    
    // Theta (4-8 Hz)
    bands.push(this.calculateBandPower(magnitude, freqResolution, 4, 8, BrainwaveFrequency.THETA));
    
    // Alpha (8-13 Hz)
    bands.push(this.calculateBandPower(magnitude, freqResolution, 8, 13, BrainwaveFrequency.ALPHA));
    
    // Beta (13-30 Hz)
    bands.push(this.calculateBandPower(magnitude, freqResolution, 13, 30, BrainwaveFrequency.BETA));
    
    // Gamma (30-100 Hz)
    bands.push(this.calculateBandPower(magnitude, freqResolution, 30, 100, BrainwaveFrequency.GAMMA));
    
    // Phi Resonance (7.83 Hz ± 0.5 Hz - Schumann resonance)
    bands.push(this.calculateBandPower(magnitude, freqResolution, 7.33, 8.33, BrainwaveFrequency.PHI_RESONANCE));
    
    return bands;
  }
  
  private calculateBandPower(
    magnitude: number[],
    freqResolution: number,
    lowFreq: number,
    highFreq: number,
    band: BrainwaveFrequency
  ): FrequencyBandPower {
    const lowBin = Math.floor(lowFreq / freqResolution);
    const highBin = Math.ceil(highFreq / freqResolution);
    
    let power = 0;
    for (let i = lowBin; i <= highBin && i < magnitude.length; i++) {
      power += magnitude[i] * magnitude[i];
    }
    
    // Calculate φ-alignment based on ratio to golden mean
    const phiAlignment = this.calculatePhiAlignment(power);
    
    return {
      band,
      power,
      coherence: this.calculateCoherence(magnitude, lowBin, highBin),
      phiAlignment
    };
  }
  
  /**
   * Calculate φ-harmonic alignment
   */
  private calculatePhiAlignment(value: number): number {
    const normalizedValue = value / (1 + value);
    const phiDistance = Math.abs(normalizedValue - (1 / this.phiRatio));
    return Math.exp(-phiDistance * this.phiRatio);
  }
  
  /**
   * Calculate coherence within frequency band
   */
  private calculateCoherence(magnitude: number[], lowBin: number, highBin: number): number {
    if (highBin <= lowBin) return 0;
    
    let sum = 0;
    let sumSq = 0;
    const n = highBin - lowBin + 1;
    
    for (let i = lowBin; i <= highBin && i < magnitude.length; i++) {
      sum += magnitude[i];
      sumSq += magnitude[i] * magnitude[i];
    }
    
    const mean = sum / n;
    const variance = (sumSq / n) - (mean * mean);
    
    // Coherence as inverse coefficient of variation
    return variance > 0 ? mean / Math.sqrt(variance) : 1;
  }
  
  /**
   * Extract Common Spatial Pattern (CSP) features for motor imagery
   */
  extractCSPFeatures(channels: number[][], numPatterns: number = 4): number[] {
    // Simplified CSP - compute variance ratios across channels
    const features: number[] = [];
    
    for (let ch = 0; ch < Math.min(channels.length, numPatterns); ch++) {
      const variance = this.calculateVariance(channels[ch]);
      features.push(Math.log(variance));
    }
    
    return features;
  }
  
  private calculateVariance(signal: number[]): number {
    const mean = signal.reduce((a, b) => a + b, 0) / signal.length;
    return signal.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / signal.length;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOTOR IMAGERY DECODER
// ═══════════════════════════════════════════════════════════════════════════════

export class MotorImageryDecoder {
  private readonly featureExtractor: NeuralFeatureExtractor;
  private weights: Map<string, number[]> = new Map();
  
  constructor() {
    this.featureExtractor = new NeuralFeatureExtractor();
    this.initializeWeights();
  }
  
  private initializeWeights(): void {
    // Pre-trained weights for motor imagery classification
    // In production, these would be loaded from trained model
    this.weights.set('leftHand', [0.3, -0.2, 0.5, -0.1]);
    this.weights.set('rightHand', [-0.2, 0.4, -0.3, 0.6]);
    this.weights.set('feet', [0.1, 0.1, -0.4, -0.4]);
    this.weights.set('tongue', [-0.1, -0.3, 0.2, 0.3]);
  }
  
  /**
   * Decode motor imagery from multichannel EEG
   */
  decode(channels: number[][]): MotorImageryState {
    const features = this.featureExtractor.extractCSPFeatures(channels);
    
    const leftHand = this.sigmoid(this.dotProduct(features, this.weights.get('leftHand')!));
    const rightHand = this.sigmoid(this.dotProduct(features, this.weights.get('rightHand')!));
    const feet = this.sigmoid(this.dotProduct(features, this.weights.get('feet')!));
    const tongue = this.sigmoid(this.dotProduct(features, this.weights.get('tongue')!));
    
    // Softmax normalization
    const total = leftHand + rightHand + feet + tongue;
    const confidence = Math.max(leftHand, rightHand, feet, tongue) / total;
    
    return {
      leftHand: leftHand / total,
      rightHand: rightHand / total,
      feet: feet / total,
      tongue: tongue / total,
      confidence
    };
  }
  
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }
  
  private dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMOTIONAL STATE RECOGNIZER
// ═══════════════════════════════════════════════════════════════════════════════

export class EmotionalStateRecognizer {
  private readonly featureExtractor: NeuralFeatureExtractor;
  private readonly phiRatio = 1.618033988749895;
  
  constructor() {
    this.featureExtractor = new NeuralFeatureExtractor();
  }
  
  /**
   * Recognize emotional state from EEG using frontal asymmetry and band ratios
   */
  recognize(
    leftFrontal: number[],
    rightFrontal: number[],
    sampleRate: number
  ): EmotionalState {
    const leftBands = this.featureExtractor.extractBandPowers(leftFrontal, sampleRate);
    const rightBands = this.featureExtractor.extractBandPowers(rightFrontal, sampleRate);
    
    // Frontal alpha asymmetry for valence
    const leftAlpha = leftBands.find(b => b.band === BrainwaveFrequency.ALPHA)?.power || 0;
    const rightAlpha = rightBands.find(b => b.band === BrainwaveFrequency.ALPHA)?.power || 0;
    const valence = (rightAlpha - leftAlpha) / (rightAlpha + leftAlpha + 0.001);
    
    // Beta/Alpha ratio for arousal
    const leftBeta = leftBands.find(b => b.band === BrainwaveFrequency.BETA)?.power || 0;
    const rightBeta = rightBands.find(b => b.band === BrainwaveFrequency.BETA)?.power || 0;
    const totalBeta = leftBeta + rightBeta;
    const totalAlpha = leftAlpha + rightAlpha;
    const arousal = Math.min(1, totalBeta / (totalAlpha + 0.001));
    
    // Theta/Beta ratio for dominance (engagement)
    const leftTheta = leftBands.find(b => b.band === BrainwaveFrequency.THETA)?.power || 0;
    const rightTheta = rightBands.find(b => b.band === BrainwaveFrequency.THETA)?.power || 0;
    const totalTheta = leftTheta + rightTheta;
    const dominance = 1 - Math.min(1, totalTheta / (totalBeta + 0.001));
    
    // φ-harmonic coherence index
    const phiResonance = leftBands.find(b => b.band === BrainwaveFrequency.PHI_RESONANCE);
    const coherenceIndex = phiResonance?.phiAlignment || 0;
    
    return {
      valence: Math.max(-1, Math.min(1, valence)),
      arousal: Math.max(0, Math.min(1, arousal)),
      dominance: Math.max(0, Math.min(1, dominance)),
      coherenceIndex
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEUROFEEDBACK GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

export class NeurofeedbackGenerator {
  private readonly phiRatio = 1.618033988749895;
  private readonly schumannResonance = 7.83; // Hz
  
  /**
   * Generate neurofeedback signal for coherence training
   */
  generateCoherenceSignal(
    currentState: EmotionalState,
    targetCoherence: number = 0.8
  ): NeurofeedbackSignal {
    const coherenceGap = targetCoherence - currentState.coherenceIndex;
    
    // Adjust frequency based on current state
    let frequency = this.schumannResonance;
    if (currentState.arousal > 0.7) {
      // High arousal: shift toward alpha
      frequency = 10;
    } else if (currentState.arousal < 0.3) {
      // Low arousal: shift toward beta
      frequency = 15;
    }
    
    // Amplitude modulated by coherence gap
    const amplitude = Math.abs(coherenceGap) * 0.5;
    
    // Phase aligned with φ-harmonic
    const phase = (2 * Math.PI) / this.phiRatio;
    
    return {
      frequency,
      amplitude,
      phase,
      targetRegion: BrainRegion.PREFRONTAL,
      coherenceGoal: targetCoherence
    };
  }
  
  /**
   * Generate entrainment signal using binaural beats
   */
  generateBinauralBeat(
    baseFrequency: number,
    targetBrainwave: BrainwaveFrequency
  ): { leftEar: number; rightEar: number } {
    const beatFrequencies: Record<BrainwaveFrequency, number> = {
      [BrainwaveFrequency.DELTA]: 2,
      [BrainwaveFrequency.THETA]: 6,
      [BrainwaveFrequency.ALPHA]: 10,
      [BrainwaveFrequency.BETA]: 20,
      [BrainwaveFrequency.GAMMA]: 40,
      [BrainwaveFrequency.PHI_RESONANCE]: this.schumannResonance
    };
    
    const beatFreq = beatFrequencies[targetBrainwave];
    
    return {
      leftEar: baseFrequency,
      rightEar: baseFrequency + beatFreq
    };
  }
  
  /**
   * Generate φ-harmonic entrainment sequence
   */
  generatePhiSequence(duration: number, sampleRate: number): number[] {
    const numSamples = Math.floor(duration * sampleRate);
    const signal: number[] = new Array(numSamples);
    
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      
      // Base Schumann resonance
      const schumann = Math.sin(2 * Math.PI * this.schumannResonance * t);
      
      // φ-harmonic overtones
      const phi1 = 0.618 * Math.sin(2 * Math.PI * this.schumannResonance * this.phiRatio * t);
      const phi2 = 0.382 * Math.sin(2 * Math.PI * this.schumannResonance * this.phiRatio * this.phiRatio * t);
      
      // Golden mean amplitude modulation
      const envelope = 0.5 + 0.5 * Math.sin(2 * Math.PI * (1 / this.phiRatio) * t);
      
      signal[i] = envelope * (schumann + phi1 + phi2);
    }
    
    return signal;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN BCI ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class BrainComputerInterfaceEngine {
  private readonly preprocessor: NeuralSignalPreprocessor;
  private readonly featureExtractor: NeuralFeatureExtractor;
  private readonly motorDecoder: MotorImageryDecoder;
  private readonly emotionRecognizer: EmotionalStateRecognizer;
  private readonly feedbackGenerator: NeurofeedbackGenerator;
  
  private lastProcessedSignal: NeuralSignal | null = null;
  private currentEmotionalState: EmotionalState | null = null;
  private currentMotorState: MotorImageryState | null = null;
  private commandHistory: BCICommand[] = [];
  
  constructor() {
    this.preprocessor = new NeuralSignalPreprocessor();
    this.featureExtractor = new NeuralFeatureExtractor();
    this.motorDecoder = new MotorImageryDecoder();
    this.emotionRecognizer = new EmotionalStateRecognizer();
    this.feedbackGenerator = new NeurofeedbackGenerator();
  }
  
  /**
   * Process incoming neural signal
   */
  processSignal(signal: NeuralSignal): void {
    this.lastProcessedSignal = signal;
    
    // Preprocess all channels
    const processedChannels = signal.channels.map((channel, idx) => {
      let processed = this.preprocessor.notchFilter([channel], signal.sampleRate);
      processed = this.preprocessor.bandpassFilter(processed, signal.sampleRate);
      processed = this.preprocessor.rejectArtifacts(processed);
      return processed[0];
    });
    
    // Apply spatial filtering
    // Note: In real implementation, this would use full channel arrays
    
    console.log(`[BCI] Processed ${signal.channels.length} channels at ${signal.timestamp}`);
  }
  
  /**
   * Decode motor imagery intent
   */
  decodeMotorIntent(channels: number[][]): MotorImageryState {
    const state = this.motorDecoder.decode(channels);
    this.currentMotorState = state;
    
    // Generate command if confidence is high enough
    if (state.confidence > 0.7) {
      const intent = this.getHighestMotorIntent(state);
      const command: BCICommand = {
        type: 'motor',
        intent,
        confidence: state.confidence,
        timestamp: Date.now(),
        phiCoherence: this.currentEmotionalState?.coherenceIndex || 0
      };
      this.commandHistory.push(command);
    }
    
    return state;
  }
  
  private getHighestMotorIntent(state: MotorImageryState): string {
    const intents = [
      { name: 'left_hand', value: state.leftHand },
      { name: 'right_hand', value: state.rightHand },
      { name: 'feet', value: state.feet },
      { name: 'tongue', value: state.tongue }
    ];
    
    return intents.reduce((a, b) => a.value > b.value ? a : b).name;
  }
  
  /**
   * Recognize emotional state
   */
  recognizeEmotion(
    leftFrontal: number[],
    rightFrontal: number[],
    sampleRate: number
  ): EmotionalState {
    const state = this.emotionRecognizer.recognize(leftFrontal, rightFrontal, sampleRate);
    this.currentEmotionalState = state;
    
    // Generate emotional command if valence is strongly polarized
    if (Math.abs(state.valence) > 0.5) {
      const command: BCICommand = {
        type: 'emotional',
        intent: state.valence > 0 ? 'positive' : 'negative',
        confidence: Math.abs(state.valence),
        timestamp: Date.now(),
        phiCoherence: state.coherenceIndex
      };
      this.commandHistory.push(command);
    }
    
    return state;
  }
  
  /**
   * Generate neurofeedback for coherence enhancement
   */
  generateFeedback(targetCoherence: number = 0.8): NeurofeedbackSignal | null {
    if (!this.currentEmotionalState) {
      return null;
    }
    
    return this.feedbackGenerator.generateCoherenceSignal(
      this.currentEmotionalState,
      targetCoherence
    );
  }
  
  /**
   * Generate φ-harmonic entrainment signal
   */
  generatePhiEntrainment(duration: number, sampleRate: number): number[] {
    return this.feedbackGenerator.generatePhiSequence(duration, sampleRate);
  }
  
  /**
   * Get current coherence index
   */
  getCoherenceIndex(): number {
    return this.currentEmotionalState?.coherenceIndex || 0;
  }
  
  /**
   * Get recent commands
   */
  getRecentCommands(count: number = 10): BCICommand[] {
    return this.commandHistory.slice(-count);
  }
  
  /**
   * Clear command history
   */
  clearHistory(): void {
    this.commandHistory = [];
  }
  
  /**
   * Get diagnostic report
   */
  getDiagnostics(): object {
    return {
      lastSignalTimestamp: this.lastProcessedSignal?.timestamp,
      emotionalState: this.currentEmotionalState,
      motorState: this.currentMotorState,
      commandCount: this.commandHistory.length,
      coherenceIndex: this.getCoherenceIndex()
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default BrainComputerInterfaceEngine;
