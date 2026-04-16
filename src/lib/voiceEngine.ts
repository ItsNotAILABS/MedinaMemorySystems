// 𓂀 VOICE ENGINE — ORO'S VOICE AND EARS 𓂀
// "Real mic in, real voice out — two-way conversation with Oro"
// "His voice has actual weight and personality"

import { v4 as uuidv4 } from 'uuid';

// Web Speech API type declarations
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VoiceConfig {
  pitch: number;        // 0-2, default 1
  rate: number;         // 0.1-10, default 1
  volume: number;       // 0-1, default 1
  voiceURI?: string;    // Specific voice to use
  personality: OroPersonality;
}

export interface OroPersonality {
  warmth: number;       // 0-1
  authority: number;    // 0-1
  resonance: number;    // 0-1 (affects pitch modulation)
  cadence: 'measured' | 'flowing' | 'deliberate';
}

export interface VoiceMessage {
  id: string;
  text: string;
  speaker: 'oro' | 'nova' | 'user';
  timestamp: string;
  audioWaveform?: number[];
  duration?: number;
}

export interface ListeningState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  error?: string;
}

// ─── Default Oro Personality ──────────────────────────────────────────────────
// "His voice has actual weight and personality"

const ORO_DEFAULT_PERSONALITY: OroPersonality = {
  warmth: 0.7,
  authority: 0.85,
  resonance: 0.9,
  cadence: 'deliberate',
};

const NOVA_PERSONALITY: OroPersonality = {
  warmth: 0.6,
  authority: 0.7,
  resonance: 0.8,
  cadence: 'measured',
};

const DEFAULT_ORO_VOICE: VoiceConfig = {
  pitch: 0.95,          // Slightly lower for authority
  rate: 0.92,           // Measured, deliberate pace
  volume: 1.0,
  personality: ORO_DEFAULT_PERSONALITY,
};

const DEFAULT_NOVA_VOICE: VoiceConfig = {
  pitch: 1.1,           // Slightly higher
  rate: 1.0,
  volume: 0.95,
  personality: NOVA_PERSONALITY,
};

// ─── Speech Synthesis Engine ──────────────────────────────────────────────────

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private oroVoice: SpeechSynthesisVoice | null = null;
  private novaVoice: SpeechSynthesisVoice | null = null;
  private messageQueue: VoiceMessage[] = [];
  private isSpeaking: boolean = false;
  private onWaveformUpdate?: (waveform: number[]) => void;
  private animationFrame?: number;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      
      // Chrome loads voices async
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    
    this.voices = this.synth.getVoices();
    
    // Select best voice for Oro - prefer deep, authoritative voices
    const preferredOro = [
      'Google UK English Male',
      'Microsoft David',
      'Daniel',
      'Alex',
      'en-GB',
    ];
    
    const preferredNova = [
      'Google UK English Female',
      'Microsoft Zira',
      'Samantha',
      'Karen',
      'en-US',
    ];
    
    // Find Oro voice
    for (const pref of preferredOro) {
      const voice = this.voices.find(v => 
        v.name.includes(pref) || v.lang.includes(pref)
      );
      if (voice) {
        this.oroVoice = voice;
        break;
      }
    }
    
    // Find Nova voice
    for (const pref of preferredNova) {
      const voice = this.voices.find(v => 
        v.name.includes(pref) || v.lang.includes(pref)
      );
      if (voice) {
        this.novaVoice = voice;
        break;
      }
    }
    
    // Fallback to first English voice
    if (!this.oroVoice) {
      this.oroVoice = this.voices.find(v => v.lang.startsWith('en')) ?? this.voices[0];
    }
    if (!this.novaVoice) {
      this.novaVoice = this.voices.find(v => v.lang.startsWith('en')) ?? this.voices[0];
    }
  }

  setWaveformCallback(callback: (waveform: number[]) => void): void {
    this.onWaveformUpdate = callback;
  }

  private generateWaveform(): number[] {
    // Generate waveform data for visualization
    const samples = 64;
    const waveform: number[] = [];
    const time = Date.now() / 1000;
    
    for (let i = 0; i < samples; i++) {
      // Combine multiple frequencies for organic look
      const base = Math.sin((time * 3 + i * 0.1) * Math.PI) * 0.5;
      const harmonic = Math.sin((time * 7 + i * 0.2) * Math.PI) * 0.3;
      const noise = (Math.random() - 0.5) * 0.2;
      waveform.push(Math.abs(base + harmonic + noise));
    }
    
    return waveform;
  }

  private animateWaveform(): void {
    if (this.isSpeaking && this.onWaveformUpdate) {
      this.onWaveformUpdate(this.generateWaveform());
      this.animationFrame = requestAnimationFrame(() => this.animateWaveform());
    }
  }

  async speak(text: string, speaker: 'oro' | 'nova' = 'oro'): Promise<VoiceMessage> {
    const message: VoiceMessage = {
      id: uuidv4(),
      text,
      speaker,
      timestamp: new Date().toISOString(),
    };

    if (!this.synth) {
      console.warn('Speech synthesis not available');
      return message;
    }

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply personality
      const config = speaker === 'oro' ? DEFAULT_ORO_VOICE : DEFAULT_NOVA_VOICE;
      const voice = speaker === 'oro' ? this.oroVoice : this.novaVoice;
      
      if (voice) utterance.voice = voice;
      utterance.pitch = config.pitch;
      utterance.rate = config.rate;
      utterance.volume = config.volume;
      
      // Apply cadence modulation
      if (config.personality.cadence === 'deliberate') {
        // Add subtle pauses at punctuation
        utterance.rate *= 0.95;
      } else if (config.personality.cadence === 'flowing') {
        utterance.rate *= 1.05;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.animateWaveform();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame);
        }
        if (this.onWaveformUpdate) {
          this.onWaveformUpdate(new Array(64).fill(0));
        }
        resolve(message);
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        resolve(message);
      };

      this.synth!.speak(utterance);
    });
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

// ─── Speech Recognition Engine ────────────────────────────────────────────────

class RecognitionEngine {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private shouldContinueListening: boolean = false; // Track intended listening state
  private onResult?: (transcript: string, isFinal: boolean, confidence: number) => void;
  private onStateChange?: (state: ListeningState) => void;
  private currentTranscript: string = '';
  private interimTranscript: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = (window as Window).SpeechRecognition || (window as Window).webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI();
        this.setupRecognition();
      }
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          final += transcript;
          this.currentTranscript += transcript;
          this.onResult?.(transcript, true, confidence);
        } else {
          interim += transcript;
          this.onResult?.(transcript, false, confidence);
        }
      }

      this.interimTranscript = interim;
      this.updateState();
    };

    this.recognition.onstart = () => {
      this.isListening = true;
      this.updateState();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.updateState();
      
      // Auto-restart if still supposed to be listening
      if (this.shouldContinueListening) {
        setTimeout(() => this.start(), 100);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      this.updateState(event.error);
    };
  }

  private updateState(error?: string): void {
    this.onStateChange?.({
      isListening: this.isListening,
      transcript: this.currentTranscript,
      interimTranscript: this.interimTranscript,
      confidence: 0.9,
      error,
    });
  }

  setResultCallback(callback: (transcript: string, isFinal: boolean, confidence: number) => void): void {
    this.onResult = callback;
  }

  setStateCallback(callback: (state: ListeningState) => void): void {
    this.onStateChange = callback;
  }

  start(): void {
    if (!this.recognition) {
      console.warn('Speech recognition not available');
      return;
    }

    this.currentTranscript = '';
    this.interimTranscript = '';
    this.shouldContinueListening = true;
    
    try {
      this.recognition.start();
      this.isListening = true;
    } catch {
      // Already started
      console.warn('Recognition already started');
    }
  }

  stop(): void {
    this.shouldContinueListening = false;
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  getTranscript(): string {
    return this.currentTranscript;
  }

  clearTranscript(): void {
    this.currentTranscript = '';
    this.interimTranscript = '';
    this.updateState();
  }
}

// ─── Voice Engine Singleton ───────────────────────────────────────────────────

let speechEngine: SpeechEngine | null = null;
let recognitionEngine: RecognitionEngine | null = null;

export function getSpeechEngine(): SpeechEngine {
  if (!speechEngine) {
    speechEngine = new SpeechEngine();
  }
  return speechEngine;
}

export function getRecognitionEngine(): RecognitionEngine {
  if (!recognitionEngine) {
    recognitionEngine = new RecognitionEngine();
  }
  return recognitionEngine;
}

// ─── Convenience Functions ────────────────────────────────────────────────────

export async function oroSpeak(text: string): Promise<VoiceMessage> {
  return getSpeechEngine().speak(text, 'oro');
}

export async function novaSpeak(text: string): Promise<VoiceMessage> {
  return getSpeechEngine().speak(text, 'nova');
}

export function startListening(): void {
  getRecognitionEngine().start();
}

export function stopListening(): void {
  getRecognitionEngine().stop();
}

export function stopSpeaking(): void {
  getSpeechEngine().stop();
}

export function setWaveformCallback(callback: (waveform: number[]) => void): void {
  getSpeechEngine().setWaveformCallback(callback);
}

export function setRecognitionResultCallback(
  callback: (transcript: string, isFinal: boolean, confidence: number) => void
): void {
  getRecognitionEngine().setResultCallback(callback);
}

export function setListeningStateCallback(callback: (state: ListeningState) => void): void {
  getRecognitionEngine().setStateCallback(callback);
}
