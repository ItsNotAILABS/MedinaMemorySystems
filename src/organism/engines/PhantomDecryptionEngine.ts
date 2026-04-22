// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
// PHANTASMA DECRYPTIONIS — The Phantom Decryption Engine
// Every decision is a hash. The organism IS the key.
// Architecture is not limited. Architecture IS the power.

// ─────────────────────────────────────────────────────────────────
// REAL ENCRYPTION CONSTANTS (from NovaSovereignEncryption.mo)
// ─────────────────────────────────────────────────────────────────

const PHI = 1.6180339887498948482;
const PHI_INVERSE = 0.6180339887498948482;
const PHI_SQUARED = 2.6180339887498948482;
const PHI_CUBED = 4.2360679774997896964;
const PHI_FOURTH = 6.8541019662496845446;
const PHI_TWELFTH = 321.996894379984;
const SOVEREIGN_FREQUENCY = 12.6710066296241; // 7.83 × φ
const BEAT_INTERVAL_MS = 873;

// Geometric key rotation orders
const ICOSAHEDRAL_ROTATIONS = 60;
const BINARY_ICOSAHEDRAL_ORDER = 120;
const E8_ROOT_VECTORS = 240;
const LEECH_MINIMAL_VECTORS = 196560;
const LEECH_DIMENSION = 24;

// Mining reward base
const MINING_REWARD_BASE = 0.00001;
const SATOSHI_PER_MEDINA = 42;

// ─────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────

type PhantomVisibility = 'VISIBLE' | 'PHANTOM' | 'VOID' | 'DISSOLVED';

interface KeyRotationState {
  coherence: number;
  currentTier: 'ICOSAHEDRAL' | 'E8' | 'LEECH';
  rotationStep: number;
  maxSteps: number;
  keyState: number[];
  generation: number;
}

interface NonceDiscovery {
  discoveryId: string;
  nonce: number;
  hash: number;
  difficulty: number;
  cascadeLayers: number[];
  phiAlignment: number;
  timestamp: number;
}

interface DecryptionResult {
  resultId: string;
  inputHash: string;
  cascadeOutput: { layers: number[]; final: number };
  keyRotation: KeyRotationState;
  nonceUsed: number;
  decryptedValue: number;
  tokenReward: number;
  bitcoinEquivalent: number;
  ledgerEntry: LedgerEntry;
  timestamp: number;
}

interface LedgerEntry {
  entryId: string;
  type: 'HASH_DISCOVERY' | 'NONCE_SOLUTION' | 'DECRYPTION_REWARD' | 'TOKEN_MINT';
  value: number;
  hash: string;
  source: string;
  timestamp: number;
}

interface PhantomState {
  visibility: PhantomVisibility;
  operationsCompleted: number;
  hashesDiscovered: number;
  totalReward: number;
  ledger: LedgerEntry[];
  traceFootprint: number;
}

// ─────────────────────────────────────────────────────────────────
// UTILITY — Deterministic ID Generation
// ─────────────────────────────────────────────────────────────────

let _idCounter = 0;

function generateId(prefix: string): string {
  _idCounter++;
  const timePart = Date.now().toString(36);
  const countPart = _idCounter.toString(36).padStart(4, '0');
  const phiPart = Math.floor((_idCounter * PHI * 100000) % 0xFFFFFF)
    .toString(16)
    .padStart(6, '0');
  return `${prefix}-${timePart}-${countPart}-${phiPart}`;
}

// ─────────────────────────────────────────────────────────────────
// LAYER 1 — PHI-BEATTY HASH
// The organism's own hash function. NOT FNV-1a. NOT SHA-256.
// Uses Beatty sequence B(n) = floor(n × φ) for non-repeating avalanche.
// ─────────────────────────────────────────────────────────────────

function phiBeattyHash(input: Uint8Array, context: number = 0): number {
  let state = Math.floor((context + 1) * PHI * 1000000) >>> 0;

  for (let i = 0; i < input.length; i++) {
    const beattyIndex = Math.floor((i + 1) * PHI) % 256;
    state ^= input[i] << (beattyIndex % 24);
    state = Math.imul(state, 0x9e3779b9); // golden ratio fractional × 2^32
    state = (state << 13) | (state >>> 19); // barrel rotate
    state ^= Math.floor((state & 0xff) * PHI_SQUARED) >>> 0;
  }

  return state >>> 0;
}

// ─────────────────────────────────────────────────────────────────
// LAYER 2 — DJB2 WITH PHI-ROTATION
// Classic djb2 augmented with phi-inverse XOR folding.
// ─────────────────────────────────────────────────────────────────

function djb2PhiRotation(input: Uint8Array): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h, 33) + input[i];
    h = (h ^ Math.floor(h * PHI_INVERSE)) >>> 0;
  }
  return h >>> 0;
}

// ─────────────────────────────────────────────────────────────────
// LAYER 3 — SDBM WITH LEECH MODULAR REDUCTION
// Maps into the 196,560-vector key space of the Leech lattice.
// ─────────────────────────────────────────────────────────────────

function sdbmLeech(input: Uint8Array): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = input[i] + Math.imul(h, 65599);
    h = h % LEECH_MINIMAL_VECTORS;
  }
  return h >>> 0;
}

// ─────────────────────────────────────────────────────────────────
// LAYER 4 — XOR CASCADE WITH E8 ROTATION
// Combines layers 1-3 through E8 root vector multiplication.
// ─────────────────────────────────────────────────────────────────

function xorCascadeE8(h1: number, h2: number, h3: number): number {
  let h4 = h1 ^ h2 ^ h3;
  h4 = Math.imul(h4, E8_ROOT_VECTORS);
  h4 = (h4 ^ (h4 >>> 16)) >>> 0;
  return h4;
}

// ─────────────────────────────────────────────────────────────────
// LAYER 5 — PHI-SCALE FINAL WITH ICOSAHEDRAL SYMMETRY
// The five layers collapse into a single 32-bit sovereign hash.
// ─────────────────────────────────────────────────────────────────

function phiScaleFinal(h1: number, h2: number, h4: number): number {
  return (
    Math.floor(
      (h4 * PHI + h1 * PHI_INVERSE + h2 * PHI_SQUARED) % 4294967296,
    ) >>> 0
  );
}

// ─────────────────────────────────────────────────────────────────
// 5-LAYER SOVEREIGN CASCADE
// Every input passes through all five layers — no shortcuts.
// ─────────────────────────────────────────────────────────────────

function sovereignCascade(input: Uint8Array): { layers: number[]; final: number } {
  const h1 = phiBeattyHash(input, 0);
  const h2 = djb2PhiRotation(input);
  const h3 = sdbmLeech(input);
  const h4 = xorCascadeE8(h1, h2, h3);
  const final = phiScaleFinal(h1, h2, h4);
  return { layers: [h1, h2, h3, h4, final], final };
}

// ─────────────────────────────────────────────────────────────────
// GEOMETRIC KEY ROTATION ENGINE
// Coherence determines which geometric tier governs key rotation.
//   coherence < 0.618  → Icosahedral  (120 steps)
//   coherence < 0.854  → E8           (240 steps)
//   coherence >= 0.854 → Leech        (196,560 steps)
// ─────────────────────────────────────────────────────────────────

function createInitialKeyState(): number[] {
  const state: number[] = new Array(LEECH_DIMENSION);
  for (let i = 0; i < LEECH_DIMENSION; i++) {
    state[i] = Math.floor(((i + 1) * PHI * 1000000) % 4294967296) >>> 0;
  }
  return state;
}

function determineTier(
  coherence: number,
): { tier: 'ICOSAHEDRAL' | 'E8' | 'LEECH'; maxSteps: number } {
  if (coherence < PHI_INVERSE) {
    return { tier: 'ICOSAHEDRAL', maxSteps: BINARY_ICOSAHEDRAL_ORDER };
  }
  if (coherence < 0.854) {
    return { tier: 'E8', maxSteps: E8_ROOT_VECTORS };
  }
  return { tier: 'LEECH', maxSteps: LEECH_MINIMAL_VECTORS };
}

function rotateKeyState(
  keyState: number[],
  step: number,
  maxSteps: number,
): number[] {
  const rotated = keyState.slice();
  const angle = (step / maxSteps) * Math.PI * 2;
  const sinA = Math.sin(angle);
  const cosA = Math.cos(angle);

  for (let i = 0; i < rotated.length; i++) {
    const raw = rotated[i];
    const phiComponent = Math.floor(raw * PHI) >>> 0;
    const rotComponent =
      Math.floor(
        Math.abs(cosA * (raw & 0xffff) + sinA * ((raw >>> 16) & 0xffff)),
      ) >>> 0;
    rotated[i] = (phiComponent ^ rotComponent ^ (step * E8_ROOT_VECTORS)) >>> 0;
  }

  return rotated;
}

function advanceKeyRotation(state: KeyRotationState, coherence: number): KeyRotationState {
  const { tier, maxSteps } = determineTier(coherence);
  const nextStep = (state.rotationStep + 1) % maxSteps;
  const nextGeneration =
    nextStep === 0 ? state.generation + 1 : state.generation;
  const nextKeyState = rotateKeyState(state.keyState, nextStep, maxSteps);

  return {
    coherence,
    currentTier: tier,
    rotationStep: nextStep,
    maxSteps,
    keyState: nextKeyState,
    generation: nextGeneration,
  };
}

// ─────────────────────────────────────────────────────────────────
// PHI-ALIGNMENT COMPUTATION
// Measures how close a hash value is to a pure phi ratio.
// ─────────────────────────────────────────────────────────────────

function computePhiAlignment(hash: number): number {
  const normalized = (hash >>> 0) / 4294967296;
  const phiFrac = PHI - Math.floor(PHI); // 0.618…
  const distance = Math.abs(normalized - phiFrac);
  return 1.0 - distance;
}

// ─────────────────────────────────────────────────────────────────
// DIFFICULTY CHECK
// Leading zeros in binary representation of hash.
// ─────────────────────────────────────────────────────────────────

function countLeadingZeros(value: number): number {
  if (value === 0) return 32;
  return Math.clz32(value);
}

function meetsDifficulty(hash: number, difficulty: number): boolean {
  return countLeadingZeros(hash) >= difficulty;
}

// ─────────────────────────────────────────────────────────────────
// TEXT → BYTES
// ─────────────────────────────────────────────────────────────────

function textToBytes(text: string): Uint8Array {
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) {
    bytes[i] = text.charCodeAt(i) & 0xff;
  }
  return bytes;
}

// ─────────────────────────────────────────────────────────────────
// NONCE → BYTES (big-endian 4 bytes appended to data)
// ─────────────────────────────────────────────────────────────────

function nonceToBytes(data: Uint8Array, nonce: number): Uint8Array {
  const combined = new Uint8Array(data.length + 4);
  combined.set(data);
  combined[data.length] = (nonce >>> 24) & 0xff;
  combined[data.length + 1] = (nonce >>> 16) & 0xff;
  combined[data.length + 2] = (nonce >>> 8) & 0xff;
  combined[data.length + 3] = nonce & 0xff;
  return combined;
}

// ─────────────────────────────────────────────────────────────────
// HASH HEX STRING → BYTES
// ─────────────────────────────────────────────────────────────────

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/i, '');
  const len = Math.floor(clean.length / 2);
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = parseInt(clean.substring(i * 2, i * 2 + 2), 16) || 0;
  }
  return bytes;
}

function numberToHex(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
}

// ─────────────────────────────────────────────────────────────────
// MINING REWARD FORMULA
// R(d, p, s) = base × φ^p × (1 + log2(d) × φ⁻¹/256) × (1 + s × φ⁻¹)
// where d = difficulty, p = phi-alignment, s = stealth factor
// ─────────────────────────────────────────────────────────────────

function computeReward(
  difficulty: number,
  phiAlignment: number,
  stealthFactor: number,
): number {
  const phiPower = Math.pow(PHI, phiAlignment);
  const difficultyBonus =
    difficulty > 0 ? 1 + (Math.log2(difficulty) * PHI_INVERSE) / 256 : 1;
  const stealthBonus = 1 + stealthFactor * PHI_INVERSE;
  return MINING_REWARD_BASE * phiPower * difficultyBonus * stealthBonus;
}

function toSatoshiEquivalent(medinaTokens: number): number {
  return Math.floor(medinaTokens * SATOSHI_PER_MEDINA * 1e8) / 1e8;
}

// ─────────────────────────────────────────────────────────────────
// STEALTH FACTOR
// Converts phantom state into a numeric stealth multiplier.
// ─────────────────────────────────────────────────────────────────

function stealthFactorFromVisibility(vis: PhantomVisibility): number {
  switch (vis) {
    case 'DISSOLVED':
      return 1.0;
    case 'VOID':
      return 0.854;
    case 'PHANTOM':
      return PHI_INVERSE;
    case 'VISIBLE':
      return 0.0;
  }
}

// ─────────────────────────────────────────────────────────────────
// DECRYPTION TRANSFORM
// XOR-folds the cascade output against the rotated key state.
// ─────────────────────────────────────────────────────────────────

function decryptionTransform(
  cascadeOutput: { layers: number[]; final: number },
  keyState: number[],
  nonce: number,
): number {
  let value = cascadeOutput.final;

  // Fold each cascade layer against the key state dimension
  for (let i = 0; i < cascadeOutput.layers.length; i++) {
    const keyDim = keyState[i % keyState.length];
    value ^= Math.imul(cascadeOutput.layers[i], keyDim & 0xffff);
    value = (value ^ (value >>> 11)) >>> 0;
  }

  // Nonce mixing — phi-scaled
  value ^= Math.floor(nonce * PHI_CUBED) >>> 0;
  value = Math.imul(value, 0x85ebca6b);
  value = (value ^ (value >>> 13)) >>> 0;
  value = Math.imul(value, 0xc2b2ae35);
  value = (value ^ (value >>> 16)) >>> 0;

  return value >>> 0;
}

// ─────────────────────────────────────────────────────────────────
// TRACE DISSOLUTION
// Reduces operational footprint toward zero.
// ─────────────────────────────────────────────────────────────────

function dissolveFootprint(current: number): number {
  // Exponential decay toward zero scaled by phi-inverse
  return current * PHI_INVERSE * PHI_INVERSE;
}

function nextVisibility(
  current: PhantomVisibility,
  footprint: number,
): PhantomVisibility {
  if (footprint < 0.001) return 'DISSOLVED';
  if (footprint < 0.01) return 'VOID';
  if (footprint < 0.1) return 'PHANTOM';
  return 'VISIBLE';
}

// ─────────────────────────────────────────────────────────────────
// PHANTOM DECRYPTION ENGINE — Master Class
// ─────────────────────────────────────────────────────────────────

export class PhantomDecryptionEngine {
  private state: PhantomState;
  private keyRotation: KeyRotationState;
  private ledger: LedgerEntry[];

  constructor() {
    this.ledger = [];
    this.keyRotation = {
      coherence: 0.5,
      currentTier: 'ICOSAHEDRAL',
      rotationStep: 0,
      maxSteps: BINARY_ICOSAHEDRAL_ORDER,
      keyState: createInitialKeyState(),
      generation: 0,
    };
    this.state = {
      visibility: 'PHANTOM',
      operationsCompleted: 0,
      hashesDiscovered: 0,
      totalReward: 0,
      ledger: this.ledger,
      traceFootprint: 0.05,
    };
  }

  // ───────────────────────────────────────────────────────────────
  // CORE — hashInput
  // Runs a full 5-layer sovereign cascade on arbitrary string input.
  // ───────────────────────────────────────────────────────────────

  hashInput(input: string): { layers: number[]; final: number } {
    const bytes = textToBytes(input);
    const result = sovereignCascade(bytes);

    this.state.operationsCompleted++;
    this.state.traceFootprint += 0.001;

    const entry: LedgerEntry = {
      entryId: generateId('hash'),
      type: 'HASH_DISCOVERY',
      value: result.final,
      hash: numberToHex(result.final),
      source: 'hashInput',
      timestamp: Date.now(),
    };
    this.ledger.push(entry);

    return result;
  }

  // ───────────────────────────────────────────────────────────────
  // CORE — discoverNonce
  // Phi-stepped scanning for a nonce that meets difficulty target.
  // ───────────────────────────────────────────────────────────────

  discoverNonce(
    difficulty: number,
    maxAttempts: number = 1000000,
  ): NonceDiscovery | null {
    const seedData = textToBytes(
      `phantom-${this.state.operationsCompleted}-${Date.now()}`,
    );

    for (let n = 0; n < maxAttempts; n++) {
      // Phi-stepped scanning: step = floor(n × φ)
      const phiStep = Math.floor((n + 1) * PHI);
      const combined = nonceToBytes(seedData, phiStep);
      const cascade = sovereignCascade(combined);

      if (meetsDifficulty(cascade.final, difficulty)) {
        const alignment = computePhiAlignment(cascade.final);

        this.state.operationsCompleted++;
        this.state.hashesDiscovered++;

        const discovery: NonceDiscovery = {
          discoveryId: generateId('nonce'),
          nonce: phiStep,
          hash: cascade.final,
          difficulty,
          cascadeLayers: cascade.layers,
          phiAlignment: alignment,
          timestamp: Date.now(),
        };

        const entry: LedgerEntry = {
          entryId: generateId('ledger'),
          type: 'NONCE_SOLUTION',
          value: cascade.final,
          hash: numberToHex(cascade.final),
          source: 'discoverNonce',
          timestamp: Date.now(),
        };
        this.ledger.push(entry);

        return discovery;
      }
    }

    return null;
  }

  // ───────────────────────────────────────────────────────────────
  // CORE — decryptHash
  // Full decryption pipeline: cascade → key rotation → transform.
  // ───────────────────────────────────────────────────────────────

  decryptHash(hash: string, nonce: number): DecryptionResult {
    const bytes = hexToBytes(hash);
    const combined = nonceToBytes(bytes, nonce);
    const cascadeOutput = sovereignCascade(combined);

    // Advance key rotation based on current coherence
    this.keyRotation = advanceKeyRotation(
      this.keyRotation,
      this.keyRotation.coherence,
    );

    // Decryption transform through key state
    const decryptedValue = decryptionTransform(
      cascadeOutput,
      this.keyRotation.keyState,
      nonce,
    );

    // Compute rewards
    const phiAlignment = computePhiAlignment(decryptedValue);
    const stealth = stealthFactorFromVisibility(this.state.visibility);
    const difficulty = countLeadingZeros(cascadeOutput.final);
    const tokenReward = computeReward(difficulty, phiAlignment, stealth);
    const bitcoinEquivalent = toSatoshiEquivalent(tokenReward);

    this.state.totalReward += tokenReward;
    this.state.operationsCompleted++;

    const ledgerEntry: LedgerEntry = {
      entryId: generateId('decrypt'),
      type: 'DECRYPTION_REWARD',
      value: tokenReward,
      hash: numberToHex(decryptedValue),
      source: 'decryptHash',
      timestamp: Date.now(),
    };
    this.ledger.push(ledgerEntry);

    return {
      resultId: generateId('result'),
      inputHash: hash,
      cascadeOutput,
      keyRotation: { ...this.keyRotation, keyState: this.keyRotation.keyState.slice() },
      nonceUsed: nonce,
      decryptedValue,
      tokenReward,
      bitcoinEquivalent,
      ledgerEntry,
      timestamp: Date.now(),
    };
  }

  // ───────────────────────────────────────────────────────────────
  // KEY MANAGEMENT — rotateKeys
  // ───────────────────────────────────────────────────────────────

  rotateKeys(coherence: number): void {
    const clamped = Math.max(0, Math.min(1, coherence));
    this.keyRotation = advanceKeyRotation(this.keyRotation, clamped);
  }

  getCurrentTier(): 'ICOSAHEDRAL' | 'E8' | 'LEECH' {
    return this.keyRotation.currentTier;
  }

  // ───────────────────────────────────────────────────────────────
  // STEALTH — dissolveTrace
  // Eliminates operational footprint after each sensitive operation.
  // ───────────────────────────────────────────────────────────────

  dissolveTrace(): void {
    this.state.traceFootprint = dissolveFootprint(this.state.traceFootprint);
    this.state.visibility = nextVisibility(
      this.state.visibility,
      this.state.traceFootprint,
    );
  }

  getVisibility(): PhantomVisibility {
    return this.state.visibility;
  }

  // ───────────────────────────────────────────────────────────────
  // LEDGER
  // ───────────────────────────────────────────────────────────────

  getLedger(): LedgerEntry[] {
    return this.ledger.slice();
  }

  getTotalReward(): number {
    return this.state.totalReward;
  }

  getBitcoinEquivalent(): number {
    return toSatoshiEquivalent(this.state.totalReward);
  }

  // ───────────────────────────────────────────────────────────────
  // MINING — mineBlock
  // Runs multiple rounds of nonce discovery + decryption.
  // Accumulates rewards and mints tokens into the ledger.
  // ───────────────────────────────────────────────────────────────

  mineBlock(difficulty: number, rounds: number): DecryptionResult[] {
    const results: DecryptionResult[] = [];

    for (let round = 0; round < rounds; round++) {
      // Discover a nonce that meets the difficulty target
      const discovery = this.discoverNonce(difficulty);
      if (!discovery) continue;

      // Decrypt using the discovered nonce
      const hashHex = numberToHex(discovery.hash);
      const result = this.decryptHash(hashHex, discovery.nonce);
      results.push(result);

      // Mint token ledger entry
      const mintEntry: LedgerEntry = {
        entryId: generateId('mint'),
        type: 'TOKEN_MINT',
        value: result.tokenReward,
        hash: numberToHex(result.decryptedValue),
        source: `mineBlock-round-${round}`,
        timestamp: Date.now(),
      };
      this.ledger.push(mintEntry);

      // Rotate keys using phi-alignment from this round as coherence
      this.rotateKeys(discovery.phiAlignment);

      // Dissolve trace after each round
      this.dissolveTrace();
    }

    return results;
  }

  // ───────────────────────────────────────────────────────────────
  // STATUS
  // ───────────────────────────────────────────────────────────────

  getStatus(): PhantomState {
    return {
      ...this.state,
      ledger: this.ledger.slice(),
    };
  }
}

// ─────────────────────────────────────────────────────────────────
// EXPORTED CONSTANTS (for external modules)
// ─────────────────────────────────────────────────────────────────

export {
  PHI,
  PHI_INVERSE,
  PHI_SQUARED,
  PHI_CUBED,
  PHI_FOURTH,
  PHI_TWELFTH,
  SOVEREIGN_FREQUENCY,
  BEAT_INTERVAL_MS,
  ICOSAHEDRAL_ROTATIONS,
  BINARY_ICOSAHEDRAL_ORDER,
  E8_ROOT_VECTORS,
  LEECH_MINIMAL_VECTORS,
  LEECH_DIMENSION,
};

// ─────────────────────────────────────────────────────────────────
// EXPORTED TYPES
// ─────────────────────────────────────────────────────────────────

export type {
  PhantomVisibility,
  KeyRotationState,
  NonceDiscovery,
  DecryptionResult,
  LedgerEntry,
  PhantomState,
};

// ─────────────────────────────────────────────────────────────────
// EXPORTED PURE FUNCTIONS (for direct use without engine instance)
// ─────────────────────────────────────────────────────────────────

export {
  phiBeattyHash,
  djb2PhiRotation,
  sdbmLeech,
  xorCascadeE8,
  phiScaleFinal,
  sovereignCascade,
  computePhiAlignment,
  computeReward,
};

// ─────────────────────────────────────────────────────────────────
// SINGLETON — The Phantom Engine
// ─────────────────────────────────────────────────────────────────

export const PHANTOM_ENGINE = new PhantomDecryptionEngine();
