// 𓂀 KERNEL COMPRESSION TypeScript Library 𓂀
// Frontend integration for the kernel compression system
// "The symbol holds everything. The organism reads the symbol and knows everything behind it."

import type { SpatialCoordinate, MemoryEntry } from '@/types';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface Kernel {
  id: string;
  glyphSignature: string;
  frequencyKey: number;
  compressionRatio: number;
  originalSize: number;
  createdAt: string;
  version: number;
  parentKernelId: string | null;
  phiDepth: number;
  torusCoordinate: TorusCoordinate;
  stateMachineState: KernelState;
}

export interface TorusCoordinate {
  theta: number;   // 0° - 360°
  phi: number;     // 0° - 180°
  rho: number;     // Distance from center
  ring: number;    // 1 - 12
  beat: number;    // Temporal position
}

export type KernelState = 
  | 'Compressed'
  | 'Expanding'
  | 'Executing'
  | 'Resonating'
  | 'Contracting'
  | 'Transcending';

export interface GlyphMapping {
  dataType: string;
  glyph: string;
  frequency: number;
  geometry: number;
}

export interface ExpansionResult {
  fullContent: string;
  executionReady: boolean;
  resonanceLevel: number;
  expansionTime: number;
}

export interface DocumentKernelContract {
  documentId: string;
  kernelId: string;
  contractType: ContractType;
  bindingStrength: number;
  lastSync: string;
  mutations: number;
  consensusRequired: boolean;
}

export type ContractType = 
  | 'Sovereign'
  | 'Guardian'
  | 'Executor'
  | 'Resonator'
  | 'Translator';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

export const PHI = 1.6180339887498948482;
export const PHI_INVERSE = 0.6180339887498948482;
export const PHI_SQUARED = 2.6180339887498948482;
export const PHI_CUBED = 4.2360679774997896964;
export const SCHUMANN_FUNDAMENTAL = 7.83;
export const SOLFEGGIO_528 = 528.0;
export const HEARTBEAT_MS = 873;

// Glyph symbol table
export const GLYPH_TABLE: GlyphMapping[] = [
  // Egyptian Glyphs
  { dataType: 'human', glyph: '𓀀', frequency: 396.0, geometry: 4 },
  { dataType: 'water', glyph: '𓈖', frequency: 417.0, geometry: 3 },
  { dataType: 'sun', glyph: '𓇳', frequency: 528.0, geometry: 12 },
  { dataType: 'book', glyph: '𓏛', frequency: 639.0, geometry: 4 },
  { dataType: 'mouth', glyph: '𓂋', frequency: 741.0, geometry: 2 },
  { dataType: 'scarab', glyph: '𓆃', frequency: 852.0, geometry: 6 },
  { dataType: 'net', glyph: '𓊃', frequency: 285.0, geometry: 9 },
  { dataType: 'throne', glyph: '𓋴', frequency: 963.0, geometry: 5 },
  { dataType: 'line', glyph: '𓏤', frequency: 174.0, geometry: 2 },
  { dataType: 'scorpion', glyph: '𓆣', frequency: 432.0, geometry: 8 },
  { dataType: 'eye', glyph: '𓂀', frequency: 528.0, geometry: 5 },
  { dataType: 'ankh', glyph: '☥', frequency: 963.0, geometry: 5 },
  { dataType: 'djed', glyph: '𓊽', frequency: 7.83, geometry: 4 },
  
  // Chinese Elements
  { dataType: 'wood', glyph: '木', frequency: 396.0, geometry: 4 },
  { dataType: 'fire', glyph: '火', frequency: 417.0, geometry: 4 },
  { dataType: 'earth', glyph: '土', frequency: 528.0, geometry: 3 },
  { dataType: 'metal', glyph: '金', frequency: 639.0, geometry: 8 },
  { dataType: 'flow', glyph: '水', frequency: 741.0, geometry: 4 },
  
  // I Ching Trigrams
  { dataType: 'heaven', glyph: '☰', frequency: 963.0, geometry: 3 },
  { dataType: 'lake', glyph: '☱', frequency: 852.0, geometry: 3 },
  { dataType: 'flame', glyph: '☲', frequency: 741.0, geometry: 3 },
  { dataType: 'thunder', glyph: '☳', frequency: 639.0, geometry: 3 },
  { dataType: 'wind', glyph: '☴', frequency: 528.0, geometry: 3 },
  { dataType: 'abyss', glyph: '☵', frequency: 417.0, geometry: 3 },
  { dataType: 'mountain', glyph: '☶', frequency: 396.0, geometry: 3 },
  { dataType: 'ground', glyph: '☷', frequency: 285.0, geometry: 3 },
  
  // Sacred Geometry
  { dataType: 'phi', glyph: 'φ', frequency: 698.7, geometry: 5 },
  { dataType: 'pi', glyph: 'π', frequency: 432.0, geometry: 3 },
  { dataType: 'infinity', glyph: '∞', frequency: 963.0, geometry: 2 },
  { dataType: 'omega', glyph: 'Ω', frequency: 852.0, geometry: 1 },
  { dataType: 'aleph', glyph: 'א', frequency: 136.1, geometry: 3 },
  { dataType: 'om', glyph: 'ॐ', frequency: 136.1, geometry: 3 },
];

// ═══════════════════════════════════════════════════════════════
// COMPRESSION FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Simple hash function for strings
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate a glyph signature from content
 */
export function generateGlyphSignature(content: string): string {
  const hash = hashString(content);
  let signature = '';
  
  // Generate 6-glyph signature (optimal φ compression)
  for (let i = 0; i < 6; i++) {
    const glyphIndex = Math.floor(hash / Math.pow(256, i)) % GLYPH_TABLE.length;
    signature += GLYPH_TABLE[glyphIndex].glyph;
  }
  
  return signature;
}

/**
 * Calculate unique frequency key for expansion
 */
export function calculateFrequencyKey(content: string): number {
  const hash = hashString(content);
  const modulation = (hash % 1000) / 1000.0;
  return SOLFEGGIO_528 * PHI * (1.0 + modulation * SCHUMANN_FUNDAMENTAL / 100.0);
}

/**
 * Calculate how many φ compressions deep
 */
export function calculatePhiDepth(originalSize: number): number {
  let depth = 0;
  let size = originalSize;
  
  while (size > PHI) {
    size = size / PHI;
    depth++;
  }
  
  return depth;
}

/**
 * Compress content into a kernel
 */
export function compressToKernel(
  content: string,
  documentId: string,
  ring: number,
  beat: number
): Kernel {
  const originalSize = content.length;
  const compressionRatio = PHI * Math.log(originalSize + 1);
  const glyphSignature = generateGlyphSignature(content);
  const frequencyKey = calculateFrequencyKey(content);
  
  const theta = hashString(content) % 360;
  const phi = hashString(documentId) % 180;
  const rho = compressionRatio;
  
  return {
    id: `KERNEL_${documentId}_${Date.now()}_B${beat}`,
    glyphSignature,
    frequencyKey,
    compressionRatio,
    originalSize,
    createdAt: new Date().toISOString(),
    version: 1,
    parentKernelId: null,
    phiDepth: calculatePhiDepth(originalSize),
    torusCoordinate: { theta, phi, rho, ring, beat },
    stateMachineState: 'Compressed',
  };
}

/**
 * Expand kernel back to full content
 */
export function expandKernel(
  kernel: Kernel,
  storedContent: string
): ExpansionResult {
  const startTime = Date.now();
  
  const expectedSignature = generateGlyphSignature(storedContent);
  const signatureMatches = expectedSignature === kernel.glyphSignature;
  
  const resonanceLevel = signatureMatches 
    ? PHI / (PHI + 1.0) 
    : 0.0;
  
  const endTime = Date.now();
  const expansionTime = Math.floor((endTime - startTime) / HEARTBEAT_MS);
  
  return {
    fullContent: storedContent,
    executionReady: signatureMatches,
    resonanceLevel,
    expansionTime,
  };
}

// ═══════════════════════════════════════════════════════════════
// STATE MACHINE TRANSITIONS
// ═══════════════════════════════════════════════════════════════

const VALID_TRANSITIONS: Record<KernelState, KernelState[]> = {
  Compressed: ['Expanding', 'Transcending'],
  Expanding: ['Executing'],
  Executing: ['Resonating', 'Contracting'],
  Resonating: ['Contracting'],
  Contracting: ['Compressed'],
  Transcending: ['Compressed'],
};

/**
 * Transition kernel state
 */
export function transitionState(kernel: Kernel, newState: KernelState): Kernel {
  const validTransitions = VALID_TRANSITIONS[kernel.stateMachineState];
  
  if (validTransitions.includes(newState)) {
    return { ...kernel, stateMachineState: newState };
  }
  
  return kernel; // Return unchanged if invalid transition
}

/**
 * Check if kernel is active (not compressed)
 */
export function isKernelActive(kernel: Kernel): boolean {
  return kernel.stateMachineState !== 'Compressed';
}

// ═══════════════════════════════════════════════════════════════
// TORUS NAVIGATION
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate distance between two torus coordinates
 */
export function torusDistance(a: TorusCoordinate, b: TorusCoordinate): number {
  const thetaDiff = Math.abs(a.theta - b.theta);
  const phiDiff = Math.abs(a.phi - b.phi);
  const rhoDiff = Math.abs(a.rho - b.rho);
  const ringDiff = Math.abs(a.ring - b.ring);
  
  // φ-weighted distance
  return Math.sqrt(
    (thetaDiff * thetaDiff) +
    (phiDiff * phiDiff * PHI) +
    (rhoDiff * rhoDiff * PHI_SQUARED) +
    (ringDiff * ringDiff * PHI_CUBED)
  );
}

/**
 * Find nearest kernels by torus coordinate
 */
export function findNearestKernels(
  target: TorusCoordinate,
  kernels: Kernel[],
  maxDistance: number
): Kernel[] {
  return kernels.filter(k => torusDistance(target, k.torusCoordinate) <= maxDistance);
}

/**
 * Convert spatial coordinate to torus coordinate
 */
export function spatialToTorus(spatial: SpatialCoordinate): TorusCoordinate {
  return {
    theta: spatial.theta,
    phi: spatial.phi,
    rho: spatial.depth,
    ring: spatial.ring,
    beat: spatial.beat,
  };
}

// ═══════════════════════════════════════════════════════════════
// CONTRACT MANAGEMENT
// ═══════════════════════════════════════════════════════════════

/**
 * Create contract between document and kernel
 */
export function createContract(
  documentId: string,
  kernelId: string,
  contractType: ContractType,
  requireConsensus: boolean
): DocumentKernelContract {
  return {
    documentId,
    kernelId,
    contractType,
    bindingStrength: PHI / (PHI + 1.0),
    lastSync: new Date().toISOString(),
    mutations: 0,
    consensusRequired: requireConsensus,
  };
}

/**
 * Update contract after mutation
 */
export function mutateContract(contract: DocumentKernelContract): DocumentKernelContract {
  return {
    ...contract,
    mutations: contract.mutations + 1,
    lastSync: new Date().toISOString(),
    bindingStrength: contract.bindingStrength * PHI_INVERSE,
  };
}

/**
 * Verify contract integrity
 */
export function verifyContract(contract: DocumentKernelContract): boolean {
  const now = Date.now();
  const lastSync = new Date(contract.lastSync).getTime();
  const timeSinceSync = now - lastSync;
  const maxSyncAge = 52 * HEARTBEAT_MS; // 52 beats (PIL cycle)
  
  return contract.bindingStrength > 0.5 && timeSinceSync < maxSyncAge;
}

// ═══════════════════════════════════════════════════════════════
// KERNEL EVOLUTION
// ═══════════════════════════════════════════════════════════════

/**
 * Evolve kernel to deeper compression
 */
export function transcendKernel(kernel: Kernel): Kernel {
  return {
    ...kernel,
    phiDepth: kernel.phiDepth + 1,
    version: kernel.version + 1,
    parentKernelId: kernel.id,
    compressionRatio: kernel.compressionRatio * PHI,
    stateMachineState: 'Transcending',
  };
}

/**
 * Merge multiple kernels into super-kernel
 */
export function mergeKernels(kernels: Kernel[], ring: number, beat: number): Kernel {
  let combinedGlyph = '';
  let totalSize = 0;
  let maxFreq = 0;
  
  for (const k of kernels) {
    combinedGlyph += k.glyphSignature;
    totalSize += k.originalSize;
    if (k.frequencyKey > maxFreq) {
      maxFreq = k.frequencyKey;
    }
  }
  
  // Truncate to 12 glyphs max
  if (combinedGlyph.length > 12) {
    combinedGlyph = combinedGlyph.slice(0, 12);
  }
  
  return {
    id: `SUPERKERNEL_${Date.now()}`,
    glyphSignature: combinedGlyph,
    frequencyKey: maxFreq * PHI,
    compressionRatio: PHI * Math.log(totalSize + 1),
    originalSize: totalSize,
    createdAt: new Date().toISOString(),
    version: 1,
    parentKernelId: null,
    phiDepth: kernels.length,
    torusCoordinate: {
      theta: 0,
      phi: 0,
      rho: kernels.length,
      ring,
      beat,
    },
    stateMachineState: 'Compressed',
  };
}

// ═══════════════════════════════════════════════════════════════
// GLYPH UTILITIES
// ═══════════════════════════════════════════════════════════════

/**
 * Get glyph by data type
 */
export function getGlyphByType(dataType: string): GlyphMapping | undefined {
  return GLYPH_TABLE.find(g => g.dataType === dataType);
}

/**
 * Get glyph frequency
 */
export function getGlyphFrequency(glyph: string): number {
  const mapping = GLYPH_TABLE.find(g => g.glyph === glyph);
  return mapping?.frequency ?? SOLFEGGIO_528;
}

/**
 * Decode glyph signature to data types
 */
export function decodeGlyphSignature(signature: string): string[] {
  const dataTypes: string[] = [];
  
  for (const char of signature) {
    const mapping = GLYPH_TABLE.find(g => g.glyph === char);
    if (mapping) {
      dataTypes.push(mapping.dataType);
    }
  }
  
  return dataTypes;
}

/**
 * Calculate total frequency of glyph signature
 */
export function calculateSignatureFrequency(signature: string): number {
  let total = 0;
  
  for (const char of signature) {
    total += getGlyphFrequency(char);
  }
  
  return total / signature.length;
}
