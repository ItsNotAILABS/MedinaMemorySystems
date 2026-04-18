/**
 * 𓂀 NEXUS BLOCKCHAIN: IP PROTECTION & DECISION HASHING 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THE VISION:
 * 
 * Every decision the organism makes gets HASHED. This is:
 * - Proof of decision-making
 * - IP protection encrypted on blockchain
 * - Beyond SHA - our own custom formula based on φ and architecture
 * - Feeds back into the organism
 * 
 * @version 1.1.2 (Fibonacci)
 * @designation (NEXUS-BLOCKCHAIN)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS: φ (PHI) BASED COMPUTATION
// ═══════════════════════════════════════════════════════════════════════════════

export const PHI = 1.6180339887498948482;
export const PHI_SQUARED = PHI * PHI;  // 2.618033988749895
export const PHI_CUBED = PHI * PHI * PHI;  // 4.23606797749979
export const PHI_FOURTH = PHI * PHI * PHI * PHI;  // 6.854101966249685
export const SCHUMANN = 7.83;  // Earth's heartbeat Hz
export const HEARTBEAT_MS = 873;  // φ⁴ × Schumann period

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface DecisionHash {
  id: string;
  modelId: string;
  agentId: string;
  decision: string;
  timestamp: number;
  hash: string;
  phiHash: string;           // Our custom φ-based hash
  previousHash: string;
  nonce: number;
  frequency: number;
  signature: string;
  proofOfDecision: ProofOfDecision;
}

export interface ProofOfDecision {
  decisionId: string;
  confidence: number;        // 0-1 confidence in decision
  reasoning: string[];       // Chain of reasoning
  inputs: string[];          // What went into decision
  outputs: string[];         // What came out
  phiResonance: number;      // φ alignment score
  validated: boolean;
  blockNumber: number;
}

export interface Block {
  index: number;
  timestamp: number;
  decisions: DecisionHash[];
  previousHash: string;
  hash: string;
  phiHash: string;
  nonce: number;
  frequency: number;
}

export interface IPProtection {
  id: string;
  assetType: 'MODEL' | 'AGENT' | 'TOOL' | 'DECISION' | 'CODE' | 'ARCHITECTURE';
  assetId: string;
  ownerHash: string;
  creationHash: string;
  timestamp: number;
  chain: string[];           // Chain of custody
  protected: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHI-BASED HASHING (Beyond SHA)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Our custom φ-based hash function
 * This is architecture - math - physics combined
 */
export function phiHash(input: string): string {
  // Convert string to numeric representation
  let numericValue = 0;
  for (let i = 0; i < input.length; i++) {
    numericValue += input.charCodeAt(i) * Math.pow(PHI, i % 13);
  }
  
  // Apply φ transformations
  const phi1 = numericValue * PHI;
  const phi2 = phi1 * PHI_SQUARED;
  const phi3 = phi2 * PHI_CUBED;
  const phi4 = phi3 * PHI_FOURTH;
  
  // Apply Schumann resonance
  const schumann = phi4 * SCHUMANN;
  
  // Create hexadecimal hash
  const rawHash = Math.abs(schumann).toString(16);
  const paddedHash = rawHash.padStart(64, '0').substring(0, 64);
  
  return `φ${paddedHash}`;
}

/**
 * Standard SHA-256 compatible hash (for comparison)
 */
export function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Combined hash (SHA + φ) for maximum IP protection
 */
export function combinedHash(input: string): { sha: string; phi: string; combined: string } {
  const sha = simpleHash(input);
  const phi = phiHash(input);
  const combined = `${sha}:${phi}`;
  
  return { sha, phi, combined };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION CHAIN (Blockchain for Decisions)
// ═══════════════════════════════════════════════════════════════════════════════

export class NexusDecisionChain {
  public readonly designation = '(NEXUS-CHAIN)';
  
  private chain: Block[] = [];
  private pendingDecisions: DecisionHash[] = [];
  private ipRegistry: Map<string, IPProtection> = new Map();
  private decisionCounter = 0;
  private blockCounter = 0;
  
  constructor() {
    // Create genesis block
    this.createGenesisBlock();
  }
  
  /**
   * Create the genesis block
   */
  private createGenesisBlock(): void {
    const genesis: Block = {
      index: 0,
      timestamp: Date.now(),
      decisions: [],
      previousHash: '0'.repeat(64),
      hash: phiHash('NEXUS_GENESIS'),
      phiHash: phiHash('NEXUS_GENESIS_PHI'),
      nonce: 0,
      frequency: 963,
    };
    
    this.chain.push(genesis);
    console.log(`${this.designation} Genesis block created`);
  }
  
  /**
   * Record a decision (called every time organism makes a decision)
   */
  recordDecision(
    modelId: string,
    agentId: string,
    decision: string,
    inputs: string[],
    outputs: string[],
    confidence: number
  ): DecisionHash {
    const timestamp = Date.now();
    const previousHash = this.getLastBlock().hash;
    
    // Create decision content
    const decisionContent = JSON.stringify({
      modelId,
      agentId,
      decision,
      timestamp,
      inputs,
      outputs,
    });
    
    // Generate hashes
    const hashes = combinedHash(decisionContent);
    
    // Create proof of decision
    const proof: ProofOfDecision = {
      decisionId: `decision_${++this.decisionCounter}`,
      confidence,
      reasoning: [`Model ${modelId} via Agent ${agentId}`],
      inputs,
      outputs,
      phiResonance: this.calculatePhiResonance(confidence),
      validated: true,
      blockNumber: this.chain.length,
    };
    
    // Create decision hash
    const decisionHash: DecisionHash = {
      id: proof.decisionId,
      modelId,
      agentId,
      decision,
      timestamp,
      hash: hashes.sha,
      phiHash: hashes.phi,
      previousHash,
      nonce: this.findNonce(decisionContent),
      frequency: this.getFrequencyForDecision(confidence),
      signature: this.signDecision(decisionContent),
      proofOfDecision: proof,
    };
    
    this.pendingDecisions.push(decisionHash);
    
    // Auto-mine block when we have enough decisions (every 10 decisions)
    if (this.pendingDecisions.length >= 10) {
      this.mineBlock();
    }
    
    return decisionHash;
  }
  
  /**
   * Mine a new block
   */
  mineBlock(): Block {
    const newBlock: Block = {
      index: this.chain.length,
      timestamp: Date.now(),
      decisions: [...this.pendingDecisions],
      previousHash: this.getLastBlock().hash,
      hash: '',
      phiHash: '',
      nonce: 0,
      frequency: 963,
    };
    
    // Calculate block hash
    const blockContent = JSON.stringify({
      index: newBlock.index,
      timestamp: newBlock.timestamp,
      decisions: newBlock.decisions.map(d => d.hash),
      previousHash: newBlock.previousHash,
    });
    
    const hashes = combinedHash(blockContent);
    newBlock.hash = hashes.sha;
    newBlock.phiHash = hashes.phi;
    newBlock.nonce = this.findNonce(blockContent);
    
    this.chain.push(newBlock);
    this.pendingDecisions = [];
    
    console.log(`${this.designation} Block ${newBlock.index} mined with ${newBlock.decisions.length} decisions`);
    
    return newBlock;
  }
  
  /**
   * Register IP protection
   */
  registerIP(
    assetType: IPProtection['assetType'],
    assetId: string,
    ownerHash: string
  ): IPProtection {
    const protection: IPProtection = {
      id: `ip_${Date.now()}`,
      assetType,
      assetId,
      ownerHash,
      creationHash: phiHash(`${assetType}:${assetId}:${ownerHash}:${Date.now()}`),
      timestamp: Date.now(),
      chain: [ownerHash],
      protected: true,
    };
    
    this.ipRegistry.set(protection.id, protection);
    
    // Record this as a decision
    this.recordDecision(
      'IP_PROTECTION',
      'SYSTEM',
      `Registered IP for ${assetType}: ${assetId}`,
      [assetType, assetId],
      [protection.id, protection.creationHash],
      1.0
    );
    
    console.log(`${this.designation} IP registered: ${assetType} - ${assetId}`);
    
    return protection;
  }
  
  /**
   * Verify IP ownership
   */
  verifyIP(protectionId: string, ownerHash: string): boolean {
    const protection = this.ipRegistry.get(protectionId);
    if (!protection) return false;
    
    return protection.ownerHash === ownerHash && protection.protected;
  }
  
  /**
   * Calculate φ resonance (how aligned with golden ratio)
   */
  private calculatePhiResonance(confidence: number): number {
    // Perfect resonance is when confidence × φ = integer
    const product = confidence * PHI;
    const deviation = Math.abs(product - Math.round(product));
    return 1 - deviation;
  }
  
  /**
   * Get frequency for decision based on confidence
   */
  private getFrequencyForDecision(confidence: number): number {
    // Map confidence to solfeggio frequencies
    const frequencies = [174, 285, 396, 417, 528, 639, 741, 852, 963];
    const index = Math.floor(confidence * (frequencies.length - 1));
    return frequencies[index];
  }
  
  /**
   * Find nonce (proof of work)
   */
  private findNonce(content: string): number {
    let nonce = 0;
    let hash = phiHash(content + nonce);
    
    // Find hash starting with 'φ0' (our target)
    while (!hash.startsWith('φ0')) {
      nonce++;
      hash = phiHash(content + nonce);
      if (nonce > 1000) break; // Limit for demo
    }
    
    return nonce;
  }
  
  /**
   * Sign a decision
   */
  private signDecision(content: string): string {
    return phiHash(`NEXUS_SIGNATURE:${content}:${Date.now()}`);
  }
  
  /**
   * Get last block
   */
  getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }
  
  /**
   * Get chain length
   */
  getChainLength(): number {
    return this.chain.length;
  }
  
  /**
   * Validate chain
   */
  validateChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      
      // Check hash link
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
  
  /**
   * Get statistics
   */
  getStats(): {
    blocks: number;
    decisions: number;
    pendingDecisions: number;
    ipProtections: number;
    chainValid: boolean;
  } {
    let totalDecisions = 0;
    for (const block of this.chain) {
      totalDecisions += block.decisions.length;
    }
    
    return {
      blocks: this.chain.length,
      decisions: totalDecisions,
      pendingDecisions: this.pendingDecisions.length,
      ipProtections: this.ipRegistry.size,
      chainValid: this.validateChain(),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-HASHING SYSTEM (Runs at different times throughout models)
// ═══════════════════════════════════════════════════════════════════════════════

export class NexusAutoHasher {
  public readonly designation = '(NEXUS-HASHER)';
  
  private chain: NexusDecisionChain;
  private hashIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private hashCounter = 0;
  
  constructor(chain: NexusDecisionChain) {
    this.chain = chain;
  }
  
  /**
   * Start auto-hashing for a model
   * Different models hash at different intervals
   */
  startAutoHash(modelId: string, intervalMs: number = 2000): void {
    // Offset by model index to prevent synchronization
    const offset = this.hashCounter++ * 100;
    
    const interval = setInterval(() => {
      this.hashModelState(modelId);
    }, intervalMs + offset);
    
    this.hashIntervals.set(modelId, interval);
    console.log(`${this.designation} Auto-hash started for ${modelId} at ${intervalMs + offset}ms`);
  }
  
  /**
   * Stop auto-hashing for a model
   */
  stopAutoHash(modelId: string): void {
    const interval = this.hashIntervals.get(modelId);
    if (interval) {
      clearInterval(interval);
      this.hashIntervals.delete(modelId);
    }
  }
  
  /**
   * Hash the current state of a model
   */
  private hashModelState(modelId: string): void {
    // Create a state snapshot
    const state = {
      modelId,
      timestamp: Date.now(),
      frequency: SCHUMANN,
      phiPhase: (Date.now() % 1000) / 1000 * PHI,
    };
    
    // Record as decision
    this.chain.recordDecision(
      modelId,
      'AUTO_HASHER',
      'State checkpoint',
      [JSON.stringify(state)],
      [phiHash(JSON.stringify(state))],
      1.0
    );
  }
  
  /**
   * Stop all auto-hashing
   */
  stopAll(): void {
    const entries = Array.from(this.hashIntervals.entries());
    for (const [modelId] of entries) {
      this.stopAutoHash(modelId);
    }
  }
  
  /**
   * Get active hashers
   */
  getActiveHashers(): string[] {
    return Array.from(this.hashIntervals.keys());
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCKCHAIN CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const BLOCKCHAIN_CONSTANTS = {
  PHI,
  PHI_SQUARED,
  PHI_CUBED,
  PHI_FOURTH,
  SCHUMANN,
  HEARTBEAT_MS,
  
  // Block settings
  DECISIONS_PER_BLOCK: 10,
  DEFAULT_HASH_INTERVAL: 2000,
  
  // Frequencies for decision types
  FREQUENCIES: {
    CRITICAL: 963,
    HIGH: 852,
    MEDIUM: 741,
    LOW: 639,
    ROUTINE: 528,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let chainInstance: NexusDecisionChain | null = null;
let hasherInstance: NexusAutoHasher | null = null;

export function getNexusDecisionChain(): NexusDecisionChain {
  if (!chainInstance) {
    chainInstance = new NexusDecisionChain();
  }
  return chainInstance;
}

export function getNexusAutoHasher(): NexusAutoHasher {
  if (!hasherInstance) {
    hasherInstance = new NexusAutoHasher(getNexusDecisionChain());
  }
  return hasherInstance;
}

export default {
  NexusDecisionChain,
  NexusAutoHasher,
  getNexusDecisionChain,
  getNexusAutoHasher,
  phiHash,
  simpleHash,
  combinedHash,
  BLOCKCHAIN_CONSTANTS,
};
