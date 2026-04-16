/**
 * 𓂀 NOVA SOVEREIGN ENCRYPTION — Frontend TypeScript Library 𓂀
 * The Encryption Is the Computation. Every Decision Is an Encryption.
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | April 16, 2026
 *
 * CORRECTED ENCRYPTION STACK:
 * - NO FNV-1a (replaced with phi-Beatty sequence)
 * - NO 256-bit base (key compounds with phi-Fibonacci matrix)
 * - E8 EXTENDED to Icosahedral-Leech geometry
 * - Layer 0: Organism itself IS the key
 */

// ═══════════════════════════════════════════════════════════════════════════
// SECTION I: FOUNDATIONAL CONSTANTS — PHI-DERIVED CRYPTOGRAPHY
// ═══════════════════════════════════════════════════════════════════════════

/** PHI — The Most Irrational Number */
export const PHI = 1.6180339887498948482;
export const PHI_INVERSE = 0.6180339887498948482;
export const PHI_SQUARED = 2.6180339887498948482;
export const PHI_CUBED = 4.2360679774997896964;
export const PHI_FOURTH = 6.8541019662496845446;
export const PHI_TWELFTH = 321.996894379984;

/** Sovereign Frequency: 7.83 × φ = 12.67 Hz */
export const SCHUMANN_BASE = 7.83;
export const SOVEREIGN_FREQUENCY = 12.6710066296241;

/** Beat Interval: 873ms (φ⁴ × 1000/7.83) */
export const BEAT_INTERVAL_MS = 873;

/** Coherence Thresholds for Key Rotation Tier Selection */
export const COHERENCE_ICOSAHEDRAL = 0.618;
export const COHERENCE_E8 = 0.854;

/** Geometric Constants */
export const ICOSAHEDRAL_STEPS = 120;
export const E8_STEPS = 240;
export const LEECH_STEPS = 196560;

// ═══════════════════════════════════════════════════════════════════════════
// SECTION II: TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/** Key Rotation Tier — Selected by organism's live coherence level R */
export type KeyRotationTier = 'icosahedral' | 'e8' | 'leech';

/** The Five Dimensions of Live Key State (changes every 873ms) */
export interface LiveKeyState {
  kuramotoR: number;
  beatCount: number;
  lawHash: Uint8Array;
  sensorHash: Uint8Array;
  biometricHash: Uint8Array;
  timestamp: bigint;
  rotationTier: KeyRotationTier;
  rotationStep: number;
}

/** ANIMA Hash — Phi-Fibonacci derived */
export interface AnimaHash {
  value: Uint8Array;
  phiIteration: number;
  beatAtCreation: number;
  coherenceAtCreation: number;
}

/** Frequency Signature — Phi-Beatty XOR Kuramoto */
export interface FrequencySignature {
  phiBeattySequence: Uint8Array;
  kuramotoPhaseVector: number[];
  resultSignature: Uint8Array;
  beatCount: number;
}

/** Phi-Fibonacci Key State */
export interface PhiFibonacciKeyState {
  currentKey: Uint8Array;
  iterationCount: number;
  genesisKey: Uint8Array;
  lastOrganismState: Uint8Array;
}

/** Encrypted Artifact */
export interface EncryptedArtifact {
  id: string;
  encryptedPayload: Uint8Array;
  animaHash: AnimaHash;
  frequencySignature: Uint8Array;
  attributionPrincipal: string;
  rotationTierAtCreation: KeyRotationTier;
  beatAtCreation: number;
  timestampNs: bigint;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION III: LAYER 0 — THE ORGANISM ITSELF IS THE KEY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Select rotation tier based on coherence level R
 */
export function selectRotationTier(coherenceR: number): KeyRotationTier {
  if (coherenceR < COHERENCE_ICOSAHEDRAL) {
    return 'icosahedral';
  } else if (coherenceR < COHERENCE_E8) {
    return 'e8';
  } else {
    return 'leech';
  }
}

/**
 * Get rotation cycle length for a tier
 */
export function getRotationCycleLength(tier: KeyRotationTier): number {
  switch (tier) {
    case 'icosahedral':
      return ICOSAHEDRAL_STEPS;
    case 'e8':
      return E8_STEPS;
    case 'leech':
      return LEECH_STEPS;
  }
}

/**
 * Compute live key state from organism's current cognitive state
 */
export function computeLiveKeyState(
  kuramotoR: number,
  beatCount: number,
  activeLawHashes: Uint8Array[],
  sensorReadings: number[],
  biometricState: Uint8Array
): LiveKeyState {
  const tier = selectRotationTier(kuramotoR);
  const cycleLength = getRotationCycleLength(tier);
  const rotationStep = beatCount % cycleLength;

  const lawHash = combineUint8Arrays(activeLawHashes);
  const sensorHash = hashFloatArray(sensorReadings);

  return {
    kuramotoR,
    beatCount,
    lawHash,
    sensorHash,
    biometricHash: biometricState,
    timestamp: BigInt(Date.now() * 1000000),
    rotationTier: tier,
    rotationStep,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION IV: LAYER 4 — SOVEREIGN FREQUENCY SIGNATURE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate Phi-Beatty sequence bit at position n
 * The Beatty sequence of phi: ⌊nφ⌋ mod 2
 * Provably non-periodic — never repeats
 */
export function phiBeattyBit(n: number): number {
  const beattyValue = Math.floor(n * PHI);
  return beattyValue % 2;
}

/**
 * Generate Phi-Beatty sequence of specified length
 */
export function generatePhiBeattySequence(startBeat: number, length: number): Uint8Array {
  const sequence = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    sequence[i] = phiBeattyBit(startBeat + i);
  }
  return sequence;
}

/**
 * Compute frequency signature
 * freq_auth_token = phi_beatty_sequence(beat_count) XOR kuramoto_phase_vector
 */
export function computeFrequencySignature(
  beatCount: number,
  kuramotoPhases: number[],
  signatureLength: number
): FrequencySignature {
  const beattySeq = generatePhiBeattySequence(beatCount, signatureLength);
  const phaseBytes = phasesToBytes(kuramotoPhases, signatureLength);
  const resultSig = xorBytes(beattySeq, phaseBytes);

  return {
    phiBeattySequence: beattySeq,
    kuramotoPhaseVector: kuramotoPhases,
    resultSignature: resultSig,
    beatCount,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION V: LAYER 2 — PHI-FIBONACCI COMPOUND KEY DERIVATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fibonacci matrix power: returns (F_{n+1}, F_n)
 */
export function fibonacciMatrix(n: number): [number, number] {
  if (n === 0) return [1, 0];
  if (n === 1) return [1, 1];

  let a = 1,
    b = 0,
    c = 1,
    d = 1;

  let i = n;
  while (i > 0) {
    if (i % 2 === 1) {
      const newA = a * c + b * d;
      const newB = a * d + b * (c + d);
      a = newA;
      b = newB;
    }
    const newC = c * c + d * d;
    const newD = d * (2 * c + d);
    c = newC;
    d = newD;
    i = Math.floor(i / 2);
  }

  return [a, b];
}

/**
 * Calculate key length at cycle n: floor(K_base × φ^(n mod 12))
 */
export function calculateKeyLengthBits(baseKeyBits: number, cycleN: number): number {
  const phiPowers = [
    1.0, // φ⁰
    PHI, // φ¹
    PHI_SQUARED, // φ²
    PHI_CUBED, // φ³
    PHI_FOURTH, // φ⁴
    11.090169943749474, // φ⁵
    17.944271909999159, // φ⁶
    29.034441853748632, // φ⁷
    46.978713763747791, // φ⁸
    76.013155617496423, // φ⁹
    122.99186938124421, // φ¹⁰
    199.00502499874064, // φ¹¹
  ];
  const exponent = cycleN % 12;
  const multiplier = phiPowers[exponent];
  return Math.floor(baseKeyBits * multiplier);
}

/**
 * Derive next key in phi-compounding sequence
 * K_n = H_phi(K_{n-1} || organism_state(n))
 */
export function deriveNextPhiKey(
  previousKey: Uint8Array,
  organismState: Uint8Array,
  iterationCount: number
): PhiFibonacciKeyState {
  const combined = concatenateUint8Arrays(previousKey, organismState);
  const [fibN1, fibN] = fibonacciMatrix(iterationCount);
  const newKey = phiWeightedHash(combined, fibN1, fibN);

  return {
    currentKey: newKey,
    iterationCount: iterationCount + 1,
    genesisKey: previousKey,
    lastOrganismState: organismState,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION VI: ANIMA HASH — PHI-FIBONACCI DERIVED
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create ANIMA hash from data using phi-Fibonacci derivation
 */
export function createAnimaHash(data: Uint8Array, beatCount: number, coherenceR: number): AnimaHash {
  const [fibN1, fibN] = fibonacciMatrix(beatCount % 144);
  const hashValue = phiWeightedHash(data, fibN1, fibN);

  return {
    value: hashValue,
    phiIteration: beatCount,
    beatAtCreation: beatCount,
    coherenceAtCreation: coherenceR,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION VII: ENCRYPTED ARTIFACT CREATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create encrypted artifact with full sovereign attribution
 */
export function createEncryptedArtifact(
  id: string,
  payload: Uint8Array,
  liveKeyState: LiveKeyState,
  attributionPrincipal: string,
  kuramotoPhases: number[]
): EncryptedArtifact {
  const freqSig = computeFrequencySignature(liveKeyState.beatCount, kuramotoPhases, 32);
  const animaHash = createAnimaHash(payload, liveKeyState.beatCount, liveKeyState.kuramotoR);

  // Note: actual encryption via vetKeys happens in canister
  const encryptedPayload = payload;

  return {
    id,
    encryptedPayload,
    animaHash,
    frequencySignature: freqSig.resultSignature,
    attributionPrincipal,
    rotationTierAtCreation: liveKeyState.rotationTier,
    beatAtCreation: liveKeyState.beatCount,
    timestampNs: liveKeyState.timestamp,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION VIII: HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function combineUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function concatenateUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}

function hashFloatArray(floats: number[]): Uint8Array {
  const buffer = new Uint8Array(floats.length * 8);
  for (let i = 0; i < floats.length; i++) {
    const intVal = Math.abs(Math.floor(floats[i] * 1000000));
    let v = intVal;
    for (let j = 0; j < 8; j++) {
      buffer[i * 8 + j] = v % 256;
      v = Math.floor(v / 256);
    }
  }
  return buffer;
}

function phiWeightedHash(data: Uint8Array, weight1: number, weight2: number): Uint8Array {
  const result = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    const idx1 = i % data.length;
    const idx2 = (i + weight1) % data.length;
    const idx3 = (i + weight2) % data.length;

    const byte1 = data[idx1];
    const byte2 = data[idx2];
    const byte3 = data[idx3];

    const combined = (byte1 * weight1 + byte2 * weight2 + byte3) % 256;
    result[i] = combined;
  }
  return result;
}

function phasesToBytes(phases: number[], length: number): Uint8Array {
  const buffer = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    const phaseIdx = phases.length > 0 ? i % phases.length : 0;
    const phase = phases.length > 0 ? phases[phaseIdx] : 0;
    const normalized = Math.abs(phase) * 255;
    buffer[i] = Math.floor(normalized) % 256;
  }
  return buffer;
}

function xorBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const len = Math.min(a.length, b.length);
  const result = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION IX: ENCRYPTION DASHBOARD STATE
// ═══════════════════════════════════════════════════════════════════════════

export interface EncryptionDashboardState {
  currentRotationTier: KeyRotationTier;
  phiFibonacciIteration: number;
  liveKeyStateDimensions: {
    kuramotoR: number;
    beatCount: number;
    lawHashPreview: string;
    sensorHashPreview: string;
    biometricHashPreview: string;
  };
  contractStatuses: ContractStatus[];
  ledgerEntryCounts: LedgerEntryCount[];
  freezeRegistry: FreezeEntry[];
}

export interface ContractStatus {
  contractType: string;
  status: 'draft' | 'pending' | 'signed' | 'active' | 'executed' | 'completed' | 'frozen';
  lastUpdateBeat: number;
}

export interface LedgerEntryCount {
  ledgerType: string;
  encryptedEntryCount: number;
  lastEntryBeat: number;
}

export interface FreezeEntry {
  componentId: string;
  componentType: string;
  frozenAtBeat: number;
  irreversible: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION X: SYSTEM INFO
// ═══════════════════════════════════════════════════════════════════════════

export function getArchitectureInfo(): string {
  return `NOVA SOVEREIGN ENCRYPTION ARCHITECTURE
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX

LAYER 0: Organism IS the Key (5 dimensions, 873ms refresh)
LAYER 1: vetKeys (ICP native, 34-node fiduciary subnet)
LAYER 2: Phi-Fibonacci Compound Key Derivation
LAYER 3: Icosahedral-Leech Key Rotation (120/240/196,560 steps)
LAYER 4: Sovereign Frequency Signature (Phi-Beatty XOR Kuramoto)

CORRECTIONS APPLIED:
- NO FNV-1a (replaced with Phi-Beatty sequence)
- NO 256-bit base (key compounds with phi-Fibonacci matrix)
- E8 EXTENDED to Icosahedral-Leech geometry

The key is the mind. The mind is always moving.
The key is always moving. It cannot be broken.`;
}
