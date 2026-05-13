/**
 * NEURAL COHERENCE BRIDGE
 * Connects BCI to Sovereign Organism Coherence System
 * 
 * Implements bidirectional coupling between:
 * - Human neural signals (via BCI)
 * - Organism φ-harmonic coherence field
 * - Sovereign intelligence core
 * 
 * @author MEDINA Sovereign Intelligence
 * @version 1.0.0
 * @license Proprietary - All Rights Reserved
 */

import BrainComputerInterfaceEngine, {
  EmotionalState,
  MotorImageryState,
  NeurofeedbackSignal,
  BCICommand,
  BrainwaveFrequency
} from './BrainComputerInterface';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const SCHUMANN_RESONANCE = 7.83; // Hz
const CARDIAC_CYCLE_MS = 873; // ms - φ-harmonic heart rhythm

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface OrganismState {
  coherenceIndex: number;
  harmonyLevel: number;
  activeEngines: string[];
  cardiacPhase: number;
  respiratoryPhase: number;
}

export interface CouplingState {
  neuralCoherence: number;
  organismCoherence: number;
  resonanceStrength: number;
  phaseAlignment: number;
  bidirectionalFlow: number;
}

export interface IntentionVector {
  direction: 'inward' | 'outward' | 'balanced';
  magnitude: number;
  focus: string;
  clarity: number;
}

export interface CoherenceEvent {
  timestamp: number;
  type: 'peak' | 'valley' | 'transition' | 'resonance';
  value: number;
  source: 'neural' | 'organism' | 'coupled';
}

export type BridgeMode = 'passive' | 'active' | 'entrained' | 'sovereign';

// ═══════════════════════════════════════════════════════════════════════════════
// COHERENCE CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════════

class CoherenceCalculator {
  private readonly phiRatio = PHI;
  private history: number[] = [];
  private readonly maxHistory = 100;
  
  /**
   * Calculate coupling strength between two coherence signals
   */
  calculateCoupling(neural: number, organism: number): number {
    // Cross-correlation at zero lag
    const product = neural * organism;
    
    // φ-harmonic weighting
    const phiWeight = Math.pow(this.phiRatio, -Math.abs(neural - organism));
    
    return product * phiWeight;
  }
  
  /**
   * Calculate phase alignment between neural and organism rhythms
   */
  calculatePhaseAlignment(neuralPhase: number, organismPhase: number): number {
    const phaseDiff = Math.abs(neuralPhase - organismPhase);
    const normalizedDiff = Math.min(phaseDiff, 2 * Math.PI - phaseDiff);
    
    // Perfect alignment at 0 or π (in-phase or anti-phase coupling)
    return Math.cos(normalizedDiff);
  }
  
  /**
   * Calculate resonance strength using φ-harmonic analysis
   */
  calculateResonance(frequencies: number[]): number {
    let resonance = 0;
    
    for (let i = 0; i < frequencies.length; i++) {
      for (let j = i + 1; j < frequencies.length; j++) {
        const ratio = frequencies[i] / frequencies[j];
        const phiDistance = Math.abs(ratio - this.phiRatio);
        resonance += Math.exp(-phiDistance);
      }
    }
    
    return resonance / Math.max(1, frequencies.length * (frequencies.length - 1) / 2);
  }
  
  /**
   * Update coherence history and calculate trend
   */
  updateHistory(value: number): { trend: number; stability: number } {
    this.history.push(value);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    
    // Calculate trend (positive = improving, negative = declining)
    const recent = this.history.slice(-10);
    const older = this.history.slice(-20, -10);
    
    const recentMean = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderMean = older.length > 0 
      ? older.reduce((a, b) => a + b, 0) / older.length 
      : recentMean;
    
    const trend = recentMean - olderMean;
    
    // Calculate stability (inverse of variance)
    const variance = recent.reduce((sum, x) => sum + Math.pow(x - recentMean, 2), 0) / recent.length;
    const stability = 1 / (1 + Math.sqrt(variance));
    
    return { trend, stability };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTENTION DECODER
// ═══════════════════════════════════════════════════════════════════════════════

class IntentionDecoder {
  /**
   * Decode intention from combined neural and emotional states
   */
  decode(
    motor: MotorImageryState | null,
    emotion: EmotionalState | null,
    commands: BCICommand[]
  ): IntentionVector {
    let direction: 'inward' | 'outward' | 'balanced' = 'balanced';
    let magnitude = 0;
    let focus = 'neutral';
    let clarity = 0;
    
    // Analyze emotional direction
    if (emotion) {
      if (emotion.valence > 0.3 && emotion.arousal > 0.5) {
        direction = 'outward';
        focus = 'engagement';
      } else if (emotion.valence < -0.3 || emotion.arousal < 0.3) {
        direction = 'inward';
        focus = 'reflection';
      }
      
      magnitude = Math.abs(emotion.valence) * emotion.arousal;
      clarity = emotion.coherenceIndex;
    }
    
    // Analyze motor intent
    if (motor && motor.confidence > 0.5) {
      magnitude = Math.max(magnitude, motor.confidence);
      
      if (motor.leftHand > 0.4 || motor.rightHand > 0.4) {
        focus = 'action';
        direction = 'outward';
      }
    }
    
    // Analyze command consistency
    if (commands.length > 3) {
      const recentCommands = commands.slice(-5);
      const motorCommands = recentCommands.filter(c => c.type === 'motor').length;
      const emotionalCommands = recentCommands.filter(c => c.type === 'emotional').length;
      
      if (motorCommands > emotionalCommands) {
        focus = 'motor_control';
      } else if (emotionalCommands > motorCommands) {
        focus = 'emotional_expression';
      }
      
      // Calculate clarity from command confidence consistency
      const confidences = recentCommands.map(c => c.confidence);
      const meanConf = confidences.reduce((a, b) => a + b, 0) / confidences.length;
      clarity = Math.max(clarity, meanConf);
    }
    
    return { direction, magnitude, focus, clarity };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESONANCE GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

class ResonanceGenerator {
  private phase = 0;
  private readonly phiRatio = PHI;
  
  /**
   * Generate organism-to-neural feedback signal
   */
  generateFeedback(
    organismState: OrganismState,
    intention: IntentionVector
  ): NeurofeedbackSignal {
    // Base frequency on organism coherence
    let frequency = SCHUMANN_RESONANCE;
    
    if (organismState.coherenceIndex > 0.7) {
      // High coherence: reinforce with alpha
      frequency = 10;
    } else if (organismState.coherenceIndex < 0.3) {
      // Low coherence: boost with theta
      frequency = 6;
    }
    
    // Amplitude based on intention clarity
    const amplitude = intention.clarity * 0.5;
    
    // Phase aligned with cardiac cycle
    this.phase = (organismState.cardiacPhase * 2 * Math.PI) % (2 * Math.PI);
    
    // Target region based on intention direction
    const targetRegion = intention.direction === 'outward' 
      ? 'motor_cortex' as const
      : 'prefrontal' as const;
    
    return {
      frequency,
      amplitude,
      phase: this.phase,
      targetRegion,
      coherenceGoal: Math.min(1, organismState.coherenceIndex + 0.1)
    };
  }
  
  /**
   * Generate φ-harmonic entrainment pulse
   */
  generateEntrainmentPulse(t: number): number {
    // Multi-frequency φ-harmonic signal
    const f0 = SCHUMANN_RESONANCE;
    const f1 = f0 * this.phiRatio;
    const f2 = f0 / this.phiRatio;
    
    const s0 = Math.sin(2 * Math.PI * f0 * t);
    const s1 = (1 / this.phiRatio) * Math.sin(2 * Math.PI * f1 * t);
    const s2 = (1 / (this.phiRatio * this.phiRatio)) * Math.sin(2 * Math.PI * f2 * t);
    
    return s0 + s1 + s2;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEURAL COHERENCE BRIDGE
// ═══════════════════════════════════════════════════════════════════════════════

export class NeuralCoherenceBridge {
  private readonly bciEngine: BrainComputerInterfaceEngine;
  private readonly coherenceCalc: CoherenceCalculator;
  private readonly intentionDecoder: IntentionDecoder;
  private readonly resonanceGen: ResonanceGenerator;
  
  private mode: BridgeMode = 'passive';
  private couplingState: CouplingState;
  private eventLog: CoherenceEvent[] = [];
  private lastUpdate: number = 0;
  
  constructor(bciEngine: BrainComputerInterfaceEngine) {
    this.bciEngine = bciEngine;
    this.coherenceCalc = new CoherenceCalculator();
    this.intentionDecoder = new IntentionDecoder();
    this.resonanceGen = new ResonanceGenerator();
    
    this.couplingState = {
      neuralCoherence: 0,
      organismCoherence: 0,
      resonanceStrength: 0,
      phaseAlignment: 0,
      bidirectionalFlow: 0
    };
  }
  
  /**
   * Update bridge with current organism state
   */
  update(organismState: OrganismState): CouplingState {
    const now = Date.now();
    const dt = (now - this.lastUpdate) / 1000;
    this.lastUpdate = now;
    
    // Get neural coherence from BCI
    const neuralCoherence = this.bciEngine.getCoherenceIndex();
    
    // Calculate coupling
    const coupling = this.coherenceCalc.calculateCoupling(
      neuralCoherence,
      organismState.coherenceIndex
    );
    
    // Calculate phase alignment (using cardiac phase as reference)
    const phaseAlignment = this.coherenceCalc.calculatePhaseAlignment(
      this.estimateNeuralPhase(),
      organismState.cardiacPhase * 2 * Math.PI
    );
    
    // Calculate resonance from active frequencies
    const frequencies = [SCHUMANN_RESONANCE, 10, 1 / (CARDIAC_CYCLE_MS / 1000)];
    const resonance = this.coherenceCalc.calculateResonance(frequencies);
    
    // Calculate bidirectional flow
    const bidirectionalFlow = this.calculateBidirectionalFlow(
      neuralCoherence,
      organismState.coherenceIndex,
      dt
    );
    
    // Update state
    this.couplingState = {
      neuralCoherence,
      organismCoherence: organismState.coherenceIndex,
      resonanceStrength: resonance,
      phaseAlignment,
      bidirectionalFlow
    };
    
    // Update history
    const { trend, stability } = this.coherenceCalc.updateHistory(coupling);
    
    // Log events
    this.logCoherenceEvent(coupling, trend);
    
    // Auto-adjust mode based on coupling strength
    this.autoAdjustMode(coupling, stability);
    
    return this.couplingState;
  }
  
  private estimateNeuralPhase(): number {
    // Estimate neural oscillation phase from recent commands
    const commands = this.bciEngine.getRecentCommands(5);
    if (commands.length === 0) return 0;
    
    const avgCoherence = commands.reduce((sum, c) => sum + c.phiCoherence, 0) / commands.length;
    return avgCoherence * 2 * Math.PI;
  }
  
  private calculateBidirectionalFlow(
    neural: number,
    organism: number,
    dt: number
  ): number {
    // Positive flow = neural → organism influence dominant
    // Negative flow = organism → neural influence dominant
    const diff = neural - organism;
    const flowRate = diff * dt * PHI;
    
    return Math.tanh(flowRate); // Bounded to [-1, 1]
  }
  
  private logCoherenceEvent(coupling: number, trend: number): void {
    let type: CoherenceEvent['type'] = 'transition';
    
    if (coupling > 0.8) {
      type = 'peak';
    } else if (coupling < 0.2) {
      type = 'valley';
    } else if (Math.abs(this.couplingState.phaseAlignment) > 0.9) {
      type = 'resonance';
    }
    
    const event: CoherenceEvent = {
      timestamp: Date.now(),
      type,
      value: coupling,
      source: 'coupled'
    };
    
    this.eventLog.push(event);
    
    // Keep only recent events
    if (this.eventLog.length > 1000) {
      this.eventLog = this.eventLog.slice(-500);
    }
  }
  
  private autoAdjustMode(coupling: number, stability: number): void {
    if (this.mode === 'sovereign') return; // Manual override
    
    if (coupling > 0.8 && stability > 0.7) {
      this.mode = 'entrained';
    } else if (coupling > 0.5 || stability > 0.5) {
      this.mode = 'active';
    } else {
      this.mode = 'passive';
    }
  }
  
  /**
   * Get current intention from neural state
   */
  getIntention(): IntentionVector {
    const commands = this.bciEngine.getRecentCommands(10);
    const diagnostics = this.bciEngine.getDiagnostics() as {
      emotionalState: EmotionalState | null;
      motorState: MotorImageryState | null;
    };
    
    return this.intentionDecoder.decode(
      diagnostics.motorState,
      diagnostics.emotionalState,
      commands
    );
  }
  
  /**
   * Generate feedback signal for organism
   */
  generateOrganismFeedback(organismState: OrganismState): NeurofeedbackSignal {
    const intention = this.getIntention();
    return this.resonanceGen.generateFeedback(organismState, intention);
  }
  
  /**
   * Set bridge mode
   */
  setMode(mode: BridgeMode): void {
    this.mode = mode;
  }
  
  /**
   * Get current mode
   */
  getMode(): BridgeMode {
    return this.mode;
  }
  
  /**
   * Get coupling state
   */
  getCouplingState(): CouplingState {
    return { ...this.couplingState };
  }
  
  /**
   * Get recent coherence events
   */
  getRecentEvents(count: number = 20): CoherenceEvent[] {
    return this.eventLog.slice(-count);
  }
  
  /**
   * Get bridge diagnostics
   */
  getDiagnostics(): object {
    return {
      mode: this.mode,
      couplingState: this.couplingState,
      intention: this.getIntention(),
      recentEvents: this.getRecentEvents(5),
      bciDiagnostics: this.bciEngine.getDiagnostics()
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default NeuralCoherenceBridge;
