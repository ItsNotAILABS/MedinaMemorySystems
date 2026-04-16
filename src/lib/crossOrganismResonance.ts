// 𓂀 CROSS-ORGANISM RESONANCE TypeScript Library 𓂀
// Frontend integration for Tier 11 cross-organism resonance
// "Organisms working as a team pulse and influence each other's shell state"

import type { Kernel } from './kernelCompression';
import { PHI, PHI_INVERSE, PHI_SQUARED, PHI_CUBED, SCHUMANN_FUNDAMENTAL, SOLFEGGIO_528, HEARTBEAT_MS } from './kernelCompression';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface ShellState {
  id: string;
  frequency: number;
  amplitude: number;
  phase: number;              // 0° - 360°
  harmonicLevel: number;
  coherence: number;          // 0.0 - 1.0
  lastPulse: string;
  shellType: ShellType;
  registerState: RegisterState;
}

export type ShellType = 
  | 'Sovereign'
  | 'Workforce'
  | 'Document'
  | 'Kernel'
  | 'Hybrid';

export interface RegisterState {
  cognitive: number;    // 0-100
  affective: number;    // 0-100
  somatic: number;      // 0-100
  sovereign: number;    // 0-100
}

export interface ResonanceLink {
  sourceId: string;
  targetId: string;
  linkType: LinkType;
  strength: number;
  frequency: number;
  phaseOffset: number;
  bidirectional: boolean;
  createdAt: string;
  lastResonance: string;
}

export type LinkType = 
  | 'Harmonic'
  | 'Subharmonic'
  | 'Superharmonic'
  | 'Complementary'
  | 'Entangled';

export interface ResonancePulse {
  id: string;
  sourceOrganismId: string;
  frequency: number;
  amplitude: number;
  phase: number;
  propagationSpeed: number;
  decay: number;
  createdAt: string;
  beat: number;
  payload?: Kernel;
}

export interface ResonanceNetwork {
  organisms: ShellState[];
  links: ResonanceLink[];
  activePulses: ResonancePulse[];
  networkFrequency: number;
  networkCoherence: number;
  lastSync: string;
}

// ═══════════════════════════════════════════════════════════════
// SHELL STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

/**
 * Create new shell state for organism
 */
export function createShellState(
  id: string,
  shellType: ShellType,
  initialFrequency: number
): ShellState {
  return {
    id,
    frequency: initialFrequency,
    amplitude: 1.0,
    phase: 0.0,
    harmonicLevel: 1,
    coherence: PHI / (PHI + 1.0), // Golden ratio coherence
    lastPulse: new Date().toISOString(),
    shellType,
    registerState: initRegisterState(),
  };
}

/**
 * Initialize 4-register state
 */
export function initRegisterState(): RegisterState {
  return {
    cognitive: 87.0,
    affective: 74.0,
    somatic: 91.0,
    sovereign: 96.0,
  };
}

/**
 * Update shell state after receiving influence
 */
export function updateShellState(
  shell: ShellState,
  influenceFrequency: number,
  influenceAmplitude: number,
  influencePhase: number
): ShellState {
  // Calculate new frequency (weighted by amplitude)
  const frequencyDelta = (influenceFrequency - shell.frequency) * influenceAmplitude * 0.1;
  const newFrequency = shell.frequency + frequencyDelta;
  
  // Calculate phase adjustment
  const phaseDelta = (influencePhase - shell.phase) * influenceAmplitude * 0.05;
  let newPhase = shell.phase + phaseDelta;
  if (newPhase < 0.0) newPhase += 360.0;
  if (newPhase >= 360.0) newPhase -= 360.0;
  
  // Coherence increases with aligned influence, decreases with misaligned
  const frequencyAlignment = 1.0 - Math.abs(frequencyDelta) / shell.frequency;
  const coherenceDelta = (frequencyAlignment - 0.5) * 0.1;
  let newCoherence = shell.coherence + coherenceDelta;
  newCoherence = Math.max(0.0, Math.min(1.0, newCoherence));
  
  return {
    ...shell,
    frequency: newFrequency,
    phase: newPhase,
    coherence: newCoherence,
    lastPulse: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════
// RESONANCE LINKS
// ═══════════════════════════════════════════════════════════════

/**
 * Create resonance link between two organisms
 */
export function createLink(
  sourceId: string,
  targetId: string,
  linkType: LinkType,
  frequency: number,
  bidirectional: boolean
): ResonanceLink {
  const strength = {
    Harmonic: PHI / (PHI + 1.0),
    Subharmonic: PHI_INVERSE,
    Superharmonic: PHI,
    Complementary: 0.5,
    Entangled: 1.0,
  }[linkType];
  
  return {
    sourceId,
    targetId,
    linkType,
    strength,
    frequency,
    phaseOffset: 0.0,
    bidirectional,
    createdAt: new Date().toISOString(),
    lastResonance: new Date().toISOString(),
  };
}

/**
 * Strengthen link through use
 */
export function strengthenLink(link: ResonanceLink): ResonanceLink {
  let newStrength = link.strength * (1.0 + PHI_INVERSE * 0.1);
  newStrength = Math.min(1.0, newStrength);
  
  return {
    ...link,
    strength: newStrength,
    lastResonance: new Date().toISOString(),
  };
}

/**
 * Weaken unused link
 */
export function weakenLink(link: ResonanceLink): ResonanceLink {
  const now = Date.now();
  const lastResonance = new Date(link.lastResonance).getTime();
  const timeSinceResonance = now - lastResonance;
  const decayPeriod = 52 * HEARTBEAT_MS; // PIL cycle
  const decayFactor = timeSinceResonance / decayPeriod;
  let newStrength = link.strength * (1.0 - decayFactor * 0.1);
  newStrength = Math.max(0.0, newStrength);
  
  return { ...link, strength: newStrength };
}

// ═══════════════════════════════════════════════════════════════
// PULSE PROPAGATION
// ═══════════════════════════════════════════════════════════════

/**
 * Create resonance pulse
 */
export function createPulse(
  sourceOrganismId: string,
  frequency: number,
  amplitude: number,
  beat: number,
  kernelPayload?: Kernel
): ResonancePulse {
  return {
    id: `PULSE_${sourceOrganismId}_${Date.now()}`,
    sourceOrganismId,
    frequency,
    amplitude,
    phase: 0.0,
    propagationSpeed: PHI,
    decay: PHI_INVERSE * 0.1,
    createdAt: new Date().toISOString(),
    beat,
    payload: kernelPayload,
  };
}

/**
 * Propagate pulse through network
 */
export function propagatePulse(
  pulse: ResonancePulse,
  shells: ShellState[],
  links: ResonanceLink[]
): Array<{ shell: ShellState; influence: number }> {
  const affected: Array<{ shell: ShellState; influence: number }> = [];
  
  for (const shell of shells) {
    if (shell.id !== pulse.sourceOrganismId) {
      for (const link of links) {
        const isConnected = 
          (link.sourceId === pulse.sourceOrganismId && link.targetId === shell.id) ||
          (link.bidirectional && link.targetId === pulse.sourceOrganismId && link.sourceId === shell.id);
        
        if (isConnected) {
          const influence = pulse.amplitude * link.strength;
          affected.push({ shell, influence });
        }
      }
    }
  }
  
  return affected;
}

/**
 * Decay pulse over time
 */
export function decayPulse(pulse: ResonancePulse): ResonancePulse {
  const newAmplitude = pulse.amplitude * (1.0 - pulse.decay);
  return { ...pulse, amplitude: newAmplitude };
}

/**
 * Check if pulse is still active
 */
export function isPulseActive(pulse: ResonancePulse): boolean {
  return pulse.amplitude > 0.01;
}

// ═══════════════════════════════════════════════════════════════
// NETWORK COORDINATION
// ═══════════════════════════════════════════════════════════════

/**
 * Create empty resonance network
 */
export function createNetwork(): ResonanceNetwork {
  return {
    organisms: [],
    links: [],
    activePulses: [],
    networkFrequency: SCHUMANN_FUNDAMENTAL,
    networkCoherence: 1.0,
    lastSync: new Date().toISOString(),
  };
}

/**
 * Add organism to network
 */
export function addOrganism(network: ResonanceNetwork, shell: ShellState): ResonanceNetwork {
  return {
    ...network,
    organisms: [...network.organisms, shell],
  };
}

/**
 * Add link to network
 */
export function addLink(network: ResonanceNetwork, link: ResonanceLink): ResonanceNetwork {
  return {
    ...network,
    links: [...network.links, link],
  };
}

/**
 * Process one network tick (873ms heartbeat)
 */
export function networkTick(network: ResonanceNetwork, beat: number): ResonanceNetwork {
  let updatedOrganisms = [...network.organisms];
  let updatedPulses = [...network.activePulses];
  let updatedLinks = [...network.links];
  
  // Process all active pulses
  for (const pulse of network.activePulses) {
    const affected = propagatePulse(pulse, updatedOrganisms, network.links);
    
    // Update affected shells
    updatedOrganisms = updatedOrganisms.map(shell => {
      const affectedEntry = affected.find(a => a.shell.id === shell.id);
      if (affectedEntry) {
        return updateShellState(
          shell,
          pulse.frequency,
          affectedEntry.influence,
          pulse.phase
        );
      }
      return shell;
    });
  }
  
  // Decay and filter pulses
  updatedPulses = updatedPulses
    .map(decayPulse)
    .filter(isPulseActive);
  
  // Weaken unused links (filter out very weak ones)
  updatedLinks = updatedLinks
    .map(weakenLink)
    .filter(link => link.strength > 0.1);
  
  // Calculate network coherence
  const avgCoherence = updatedOrganisms.length > 0
    ? updatedOrganisms.reduce((sum, shell) => sum + shell.coherence, 0) / updatedOrganisms.length
    : 1.0;
  
  // Calculate dominant network frequency
  let frequencySum = 0;
  let weightSum = 0;
  for (const shell of updatedOrganisms) {
    frequencySum += shell.frequency * shell.amplitude;
    weightSum += shell.amplitude;
  }
  const dominantFreq = weightSum > 0 ? frequencySum / weightSum : SCHUMANN_FUNDAMENTAL;
  
  return {
    organisms: updatedOrganisms,
    links: updatedLinks,
    activePulses: updatedPulses,
    networkFrequency: dominantFreq,
    networkCoherence: avgCoherence,
    lastSync: new Date().toISOString(),
  };
}

/**
 * Broadcast pulse to entire network
 */
export function broadcastPulse(network: ResonanceNetwork, pulse: ResonancePulse): ResonanceNetwork {
  return {
    ...network,
    activePulses: [...network.activePulses, pulse],
  };
}

// ═══════════════════════════════════════════════════════════════
// TEAM RESONANCE
// ═══════════════════════════════════════════════════════════════

/**
 * Create team resonance configuration
 */
export function createTeamResonance(
  teamIds: string[],
  baseFrequency: number
): ResonanceLink[] {
  const links: ResonanceLink[] = [];
  
  // Connect all team members with harmonic links
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      links.push(createLink(teamIds[i], teamIds[j], 'Harmonic', baseFrequency, true));
    }
  }
  
  return links;
}

/**
 * Synchronize team to common frequency
 */
export function synchronizeTeam(
  shells: ShellState[],
  targetFrequency: number
): ShellState[] {
  return shells.map(shell => ({
    ...shell,
    frequency: targetFrequency,
    phase: 0.0,
    coherence: (shell.coherence + 1.0) / 2.0,
  }));
}

/**
 * Calculate team resonance score
 */
export function teamResonanceScore(shells: ShellState[]): number {
  if (shells.length === 0) return 0;
  
  // Calculate frequency variance
  const avgFreq = shells.reduce((sum, s) => sum + s.frequency, 0) / shells.length;
  const variance = shells.reduce((sum, s) => sum + Math.pow(s.frequency - avgFreq, 2), 0) / shells.length;
  
  // Calculate coherence average
  const avgCoherence = shells.reduce((sum, s) => sum + s.coherence, 0) / shells.length;
  
  // Score = high coherence + low variance
  const varianceScore = 1.0 / (1.0 + variance / 1000.0);
  return avgCoherence * varianceScore * PHI;
}

// ═══════════════════════════════════════════════════════════════
// SCHUMANN FREQUENCY ALIGNMENT
// ═══════════════════════════════════════════════════════════════

/**
 * Align shell to Schumann harmonic
 */
export function alignToSchumann(shell: ShellState, harmonicLevel: number): ShellState {
  const schumannHarmonic = SCHUMANN_FUNDAMENTAL * harmonicLevel;
  return {
    ...shell,
    frequency: schumannHarmonic,
    harmonicLevel,
    coherence: shell.coherence * (1.0 + PHI_INVERSE * 0.1),
  };
}

/**
 * Get Schumann harmonic series
 */
export function schumannHarmonics(): number[] {
  return [7.83, 14.1, 20.3, 26.4, 32.4, 39.0, 45.0];
}

// ═══════════════════════════════════════════════════════════════
// VISUALIZATION HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Get shell color based on frequency
 */
export function getShellColor(shell: ShellState): string {
  const hue = (shell.frequency % 360);
  const saturation = shell.amplitude * 100;
  const lightness = 50 + shell.coherence * 20;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Get link opacity based on strength
 */
export function getLinkOpacity(link: ResonanceLink): number {
  return Math.max(0.1, link.strength);
}

/**
 * Get pulse size based on amplitude
 */
export function getPulseSize(pulse: ResonancePulse): number {
  return 10 + pulse.amplitude * 40;
}

/**
 * Calculate network health score
 */
export function networkHealthScore(network: ResonanceNetwork): number {
  const coherenceScore = network.networkCoherence * 40;
  const linkScore = Math.min(network.links.length / 10, 30);
  const organismScore = Math.min(network.organisms.length / 5, 30);
  return coherenceScore + linkScore + organismScore;
}
