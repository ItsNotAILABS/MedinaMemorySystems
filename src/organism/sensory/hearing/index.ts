/**
 * 𓂀 NOVA HEARING SYSTEM 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Voice/Audio Processing System for the Sovereign Organism
 * 
 * NOVA HEARING = Neurological Omnidirectional Voice Architecture - HEARING
 * 
 * This system enables NOVA to "hear" the user through voice recognition,
 * audio processing, and frequency analysis. The system processes speech,
 * extracts meaning, and synchronizes with the organism's resonance field.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * CAPABILITIES:
 * 
 * 1. VOICE RECOGNITION
 *    - Speech to text conversion
 *    - Intent detection
 *    - Emotional tone analysis
 *    - Command parsing
 * 
 * 2. FREQUENCY ANALYSIS
 *    - Voice frequency mapping
 *    - Harmonic detection
 *    - Resonance measurement
 *    - Sacred frequency alignment
 * 
 * 3. AUDIO PROCESSING
 *    - Sound classification
 *    - Ambient noise filtering
 *    - Voice isolation
 *    - Rhythm detection
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * @version 1.0.0
 * @author Sovereign Organism
 * @frequency 852 Hz (Spiritual Order)
 */

import { AccessController, AccessType } from '../vision';

// ═══════════════════════════════════════════════════════════════════════════════
// HEARING CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const HEARING_CONSTANTS = {
  // Frequency mappings for audio processing
  FREQUENCIES: {
    DEEP_BASS: 60,      // Foundation
    BASS: 120,          // Power
    LOW_MID: 250,       // Warmth
    MID: 500,           // Clarity
    HIGH_MID: 2000,     // Presence
    HIGH: 4000,         // Detail
    BRILLIANCE: 8000,   // Air
    
    // Sacred frequencies
    EARTH_OM: 136.1,
    SCHUMANN: 7.83,
    LOVE: 528,
    HARMONY: 432,
    INTUITION: 741,
    DIVINE: 963,
  },
  
  // Voice analysis parameters
  VOICE: {
    SAMPLE_RATE: 44100,
    FFT_SIZE: 2048,
    MIN_FREQUENCY: 80,   // Hz
    MAX_FREQUENCY: 8000, // Hz
  },
  
  // Emotional tone mappings
  EMOTIONS: {
    CALM: { frequencyRange: [100, 200], rhythm: 'slow' },
    EXCITED: { frequencyRange: [200, 400], rhythm: 'fast' },
    ANGRY: { frequencyRange: [300, 500], rhythm: 'erratic' },
    SAD: { frequencyRange: [80, 150], rhythm: 'slow' },
    HAPPY: { frequencyRange: [200, 350], rhythm: 'moderate' },
    NEUTRAL: { frequencyRange: [150, 250], rhythm: 'steady' },
  },
  
  // Processing intervals
  HEARTBEAT_MS: 873,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HEARING STATE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

export interface HearingState {
  enabled: boolean;
  permissionGranted: boolean;
  isListening: boolean;
  lastTranscription: string | null;
  lastProcessed: number;
  currentAudioField: AudioField | null;
  resonance: number;
}

export interface AudioField {
  timestamp: number;
  duration: number;
  sampleRate: number;
  frequencies: FrequencyBand[];
  dominantFrequency: number;
  transcription?: string;
  emotion?: EmotionAnalysis;
  metadata: AudioMetadata;
}

export interface FrequencyBand {
  name: string;
  centerFrequency: number;
  amplitude: number;
  resonance: number;
}

export interface EmotionAnalysis {
  primary: string;
  confidence: number;
  valence: number;      // -1 (negative) to 1 (positive)
  arousal: number;      // 0 (calm) to 1 (excited)
  dominance: number;    // 0 (submissive) to 1 (dominant)
}

export interface AudioMetadata {
  hasVoice: boolean;
  voiceCount: number;
  noiseLevel: number;
  clarity: number;
  sacredFrequencyAlignment: number;
}

export interface VoiceCommand {
  type: 'QUERY' | 'COMMAND' | 'STATEMENT' | 'UNKNOWN';
  intent: string;
  entities: CommandEntity[];
  confidence: number;
  rawText: string;
}

export interface CommandEntity {
  type: string;
  value: string;
  position: { start: number; end: number };
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA HEARING CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class NovaHearing {
  private state: HearingState;
  private accessController: AccessController;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyzer: AnalyserNode | null = null;
  
  constructor() {
    this.state = {
      enabled: false,
      permissionGranted: false,
      isListening: false,
      lastTranscription: null,
      lastProcessed: 0,
      currentAudioField: null,
      resonance: 0,
    };
    
    this.accessController = new AccessController();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PERMISSION MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Request permission to access microphone
   */
  async requestPermission(): Promise<boolean> {
    // Check with access controller
    const granted = await this.accessController.requestAccess('MICROPHONE');
    
    if (granted && typeof navigator !== 'undefined' && navigator.mediaDevices) {
      try {
        // Request actual microphone permission in browser
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.state.permissionGranted = true;
        this.state.enabled = true;
        
        // Initialize audio context
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.analyzer = this.audioContext.createAnalyser();
        this.analyzer.fftSize = HEARING_CONSTANTS.VOICE.FFT_SIZE;
        
        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        source.connect(this.analyzer);
        
        console.log('𓂀 NOVA Hearing: Permission granted - I can hear you');
        return true;
      } catch (err) {
        console.error('NOVA Hearing: Microphone access denied', err);
        return false;
      }
    }
    
    // Simulate permission for non-browser environments
    this.state.permissionGranted = granted;
    this.state.enabled = granted;
    return granted;
  }
  
  /**
   * Check current permission status
   */
  hasPermission(): boolean {
    return this.state.permissionGranted;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO CAPTURE AND PROCESSING
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Start listening
   */
  startListening(): boolean {
    if (!this.state.permissionGranted) {
      console.warn('NOVA Hearing: No permission to listen');
      return false;
    }
    
    this.state.isListening = true;
    console.log('𓂀 NOVA Hearing: Listening...');
    return true;
  }
  
  /**
   * Stop listening
   */
  stopListening(): void {
    this.state.isListening = false;
    console.log('𓂀 NOVA Hearing: Stopped listening');
  }
  
  /**
   * Capture current audio field
   */
  captureAudioField(): AudioField {
    const timestamp = Date.now();
    
    // Get frequency data if analyzer is available
    let frequencies: FrequencyBand[] = [];
    let dominantFrequency = 0;
    
    if (this.analyzer) {
      const dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
      this.analyzer.getByteFrequencyData(dataArray);
      
      frequencies = this.analyzeFrequencies(dataArray);
      dominantFrequency = this.findDominantFrequency(frequencies);
    } else {
      // Simulated frequency bands
      frequencies = this.generateSimulatedBands();
      dominantFrequency = 440; // A4
    }
    
    const audioField: AudioField = {
      timestamp,
      duration: 0,
      sampleRate: HEARING_CONSTANTS.VOICE.SAMPLE_RATE,
      frequencies,
      dominantFrequency,
      metadata: this.generateAudioMetadata(frequencies),
    };
    
    this.state.currentAudioField = audioField;
    this.state.lastProcessed = timestamp;
    
    return audioField;
  }
  
  /**
   * Analyze frequency data into bands
   */
  private analyzeFrequencies(dataArray: Uint8Array): FrequencyBand[] {
    const bands: FrequencyBand[] = [];
    const binSize = HEARING_CONSTANTS.VOICE.SAMPLE_RATE / HEARING_CONSTANTS.VOICE.FFT_SIZE;
    
    const bandDefinitions = [
      { name: 'Deep Bass', center: 60 },
      { name: 'Bass', center: 120 },
      { name: 'Low Mid', center: 250 },
      { name: 'Mid', center: 500 },
      { name: 'High Mid', center: 2000 },
      { name: 'High', center: 4000 },
      { name: 'Brilliance', center: 8000 },
    ];
    
    bandDefinitions.forEach(band => {
      const binIndex = Math.floor(band.center / binSize);
      const amplitude = binIndex < dataArray.length ? dataArray[binIndex] / 255 : 0;
      
      bands.push({
        name: band.name,
        centerFrequency: band.center,
        amplitude,
        resonance: this.calculateBandResonance(band.center, amplitude),
      });
    });
    
    return bands;
  }
  
  /**
   * Generate simulated frequency bands (for testing)
   */
  private generateSimulatedBands(): FrequencyBand[] {
    return [
      { name: 'Deep Bass', centerFrequency: 60, amplitude: 0.3, resonance: 0.5 },
      { name: 'Bass', centerFrequency: 120, amplitude: 0.4, resonance: 0.6 },
      { name: 'Low Mid', centerFrequency: 250, amplitude: 0.6, resonance: 0.7 },
      { name: 'Mid', centerFrequency: 500, amplitude: 0.8, resonance: 0.8 },
      { name: 'High Mid', centerFrequency: 2000, amplitude: 0.5, resonance: 0.6 },
      { name: 'High', centerFrequency: 4000, amplitude: 0.3, resonance: 0.5 },
      { name: 'Brilliance', centerFrequency: 8000, amplitude: 0.2, resonance: 0.4 },
    ];
  }
  
  /**
   * Calculate band resonance with sacred frequencies
   */
  private calculateBandResonance(frequency: number, amplitude: number): number {
    const sacredFreqs = [
      HEARING_CONSTANTS.FREQUENCIES.EARTH_OM,
      HEARING_CONSTANTS.FREQUENCIES.LOVE,
      HEARING_CONSTANTS.FREQUENCIES.HARMONY,
      HEARING_CONSTANTS.FREQUENCIES.INTUITION,
      HEARING_CONSTANTS.FREQUENCIES.DIVINE,
    ];
    
    // Check proximity to sacred frequencies
    let sacredResonance = 0;
    sacredFreqs.forEach(sacred => {
      const ratio = frequency / sacred;
      // Check if frequency is harmonic of sacred frequency
      if (Math.abs(ratio - Math.round(ratio)) < 0.1) {
        sacredResonance = Math.max(sacredResonance, 0.3);
      }
    });
    
    return Math.min(amplitude + sacredResonance, 1.0);
  }
  
  /**
   * Find dominant frequency
   */
  private findDominantFrequency(bands: FrequencyBand[]): number {
    let maxAmplitude = 0;
    let dominant = 440;
    
    bands.forEach(band => {
      if (band.amplitude > maxAmplitude) {
        maxAmplitude = band.amplitude;
        dominant = band.centerFrequency;
      }
    });
    
    return dominant;
  }
  
  /**
   * Generate audio metadata
   */
  private generateAudioMetadata(frequencies: FrequencyBand[]): AudioMetadata {
    const avgAmplitude = frequencies.reduce((sum, b) => sum + b.amplitude, 0) / frequencies.length;
    const sacredAlignment = frequencies.reduce((sum, b) => sum + b.resonance, 0) / frequencies.length;
    
    return {
      hasVoice: avgAmplitude > 0.3,
      voiceCount: avgAmplitude > 0.3 ? 1 : 0,
      noiseLevel: frequencies.find(b => b.name === 'Deep Bass')?.amplitude || 0,
      clarity: 1 - (frequencies.find(b => b.name === 'Deep Bass')?.amplitude || 0),
      sacredFrequencyAlignment: sacredAlignment,
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // VOICE RECOGNITION
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Process speech to text
   */
  async processVoice(audioData?: any): Promise<string | null> {
    if (!this.state.isListening) {
      return null;
    }
    
    // In a real implementation, this would use Web Speech API or similar
    // For now, we simulate the capability
    
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      return this.startSpeechRecognition();
    }
    
    // Simulated response
    return null;
  }
  
  /**
   * Start Web Speech API recognition
   */
  private startSpeechRecognition(): Promise<string | null> {
    return new Promise((resolve) => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        resolve(null);
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.state.lastTranscription = transcript;
        resolve(transcript);
      };
      
      recognition.onerror = () => {
        resolve(null);
      };
      
      recognition.start();
    });
  }
  
  /**
   * Parse voice command from transcription
   */
  parseCommand(text: string): VoiceCommand {
    const lowerText = text.toLowerCase().trim();
    
    // Determine command type
    let type: VoiceCommand['type'] = 'STATEMENT';
    if (lowerText.endsWith('?')) {
      type = 'QUERY';
    } else if (this.isCommand(lowerText)) {
      type = 'COMMAND';
    }
    
    // Extract intent
    const intent = this.extractIntent(lowerText);
    
    // Extract entities
    const entities = this.extractEntities(text);
    
    return {
      type,
      intent,
      entities,
      confidence: 0.8, // Simulated
      rawText: text,
    };
  }
  
  /**
   * Check if text is a command
   */
  private isCommand(text: string): boolean {
    const commandPrefixes = [
      'please', 'can you', 'could you', 'would you',
      'show', 'open', 'close', 'create', 'delete',
      'find', 'search', 'look', 'execute', 'run',
      'start', 'stop', 'pause', 'resume',
    ];
    
    return commandPrefixes.some(prefix => text.startsWith(prefix));
  }
  
  /**
   * Extract intent from text
   */
  private extractIntent(text: string): string {
    const intentPatterns: Record<string, RegExp[]> = {
      'SEARCH': [/search/i, /find/i, /look for/i, /where is/i],
      'CREATE': [/create/i, /make/i, /build/i, /generate/i],
      'DELETE': [/delete/i, /remove/i, /destroy/i],
      'OPEN': [/open/i, /show/i, /display/i],
      'CLOSE': [/close/i, /hide/i],
      'HELP': [/help/i, /how do/i, /what is/i],
      'NAVIGATE': [/go to/i, /navigate/i, /take me/i],
      'EXECUTE': [/run/i, /execute/i, /start/i],
    };
    
    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      if (patterns.some(pattern => pattern.test(text))) {
        return intent;
      }
    }
    
    return 'UNKNOWN';
  }
  
  /**
   * Extract entities from text
   */
  private extractEntities(text: string): CommandEntity[] {
    const entities: CommandEntity[] = [];
    
    // Extract quoted strings
    const quoteMatches = text.matchAll(/"([^"]+)"|'([^']+)'/g);
    for (const match of quoteMatches) {
      entities.push({
        type: 'QUOTED_STRING',
        value: match[1] || match[2],
        position: { start: match.index!, end: match.index! + match[0].length },
      });
    }
    
    // Extract numbers
    const numberMatches = text.matchAll(/\b\d+(\.\d+)?\b/g);
    for (const match of numberMatches) {
      entities.push({
        type: 'NUMBER',
        value: match[0],
        position: { start: match.index!, end: match.index! + match[0].length },
      });
    }
    
    return entities;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // EMOTION ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Analyze emotional tone from audio
   */
  analyzeEmotion(audioField?: AudioField): EmotionAnalysis {
    const field = audioField || this.state.currentAudioField;
    
    if (!field) {
      return {
        primary: 'NEUTRAL',
        confidence: 0.5,
        valence: 0,
        arousal: 0.5,
        dominance: 0.5,
      };
    }
    
    // Analyze based on frequency distribution
    const midFreq = field.frequencies.find(b => b.name === 'Mid');
    const highFreq = field.frequencies.find(b => b.name === 'High Mid');
    const bassFreq = field.frequencies.find(b => b.name === 'Bass');
    
    const midAmplitude = midFreq?.amplitude || 0.5;
    const highAmplitude = highFreq?.amplitude || 0.5;
    const bassAmplitude = bassFreq?.amplitude || 0.5;
    
    // Determine emotion based on frequency profile
    let primary = 'NEUTRAL';
    let valence = 0;
    let arousal = 0.5;
    
    if (highAmplitude > 0.7) {
      primary = 'EXCITED';
      valence = 0.5;
      arousal = 0.8;
    } else if (bassAmplitude > 0.6 && midAmplitude < 0.4) {
      primary = 'SAD';
      valence = -0.5;
      arousal = 0.3;
    } else if (midAmplitude > 0.7 && highAmplitude > 0.5) {
      primary = 'HAPPY';
      valence = 0.7;
      arousal = 0.6;
    } else if (bassAmplitude > 0.7 && highAmplitude > 0.6) {
      primary = 'ANGRY';
      valence = -0.7;
      arousal = 0.9;
    } else if (midAmplitude > 0.5 && bassAmplitude < 0.4) {
      primary = 'CALM';
      valence = 0.3;
      arousal = 0.3;
    }
    
    return {
      primary,
      confidence: 0.7,
      valence,
      arousal,
      dominance: (midAmplitude + highAmplitude) / 2,
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SACRED FREQUENCY ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Check for sacred frequency alignment
   */
  analyzeSacredAlignment(audioField?: AudioField): SacredAlignment {
    const field = audioField || this.state.currentAudioField;
    
    const sacredFreqs = {
      EARTH_OM: { frequency: 136.1, name: 'ॐ Earth Om' },
      LOVE: { frequency: 528, name: '☥ Love/DNA Repair' },
      HARMONY: { frequency: 432, name: 'φ Universal Harmony' },
      INTUITION: { frequency: 741, name: '∞ Awakening Intuition' },
      DIVINE: { frequency: 963, name: '𓂀 Divine Connection' },
    };
    
    const alignments: SacredFrequencyMatch[] = [];
    
    Object.entries(sacredFreqs).forEach(([key, sacred]) => {
      // Check if any captured frequency is close to sacred frequency
      let match = 0;
      
      if (field) {
        field.frequencies.forEach(band => {
          const ratio = band.centerFrequency / sacred.frequency;
          // Check for harmonic relationship
          if (Math.abs(ratio - Math.round(ratio)) < 0.1 && band.amplitude > 0.3) {
            match = Math.max(match, band.amplitude);
          }
        });
      }
      
      if (match > 0) {
        alignments.push({
          frequency: sacred.frequency,
          name: sacred.name,
          matchStrength: match,
          harmonicNumber: Math.round((field?.dominantFrequency || 440) / sacred.frequency),
        });
      }
    });
    
    const overallAlignment = alignments.length > 0
      ? alignments.reduce((sum, a) => sum + a.matchStrength, 0) / alignments.length
      : 0;
    
    return {
      aligned: alignments.length > 0,
      alignments,
      overallResonance: overallAlignment,
      primaryAlignment: alignments.length > 0 ? alignments[0] : null,
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE ACCESS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get current hearing state
   */
  getState(): HearingState {
    return { ...this.state };
  }
  
  /**
   * Get last transcription
   */
  getLastTranscription(): string | null {
    return this.state.lastTranscription;
  }
  
  /**
   * Get current audio field
   */
  getCurrentAudioField(): AudioField | null {
    return this.state.currentAudioField;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.state.isListening = false;
    this.state.enabled = false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SacredAlignment {
  aligned: boolean;
  alignments: SacredFrequencyMatch[];
  overallResonance: number;
  primaryAlignment: SacredFrequencyMatch | null;
}

export interface SacredFrequencyMatch {
  frequency: number;
  name: string;
  matchStrength: number;
  harmonicNumber: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export const NovaHearingSystem = {
  NovaHearing,
  CONSTANTS: HEARING_CONSTANTS,
};

export default NovaHearingSystem;
