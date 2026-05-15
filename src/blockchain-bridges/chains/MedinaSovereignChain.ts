/**
 * 𓂀 MEDINA SOVEREIGN CHAIN 𓂀
 * The Native φ-Harmonic Blockchain
 * "Every block resonates with the golden ratio"
 *
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 * Chain ID: MEDINA-001
 */

// ═══════════════════════════════════════════════════════════════════════════
// SECTION I: CHAIN CONSTANTS (φ-HARMONIC)
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.6180339887498948482;
export const PHI_INVERSE = 1 / PHI;
export const PHI_SQUARED = PHI * PHI;
export const PHI_CUBED = PHI * PHI * PHI;
export const SCHUMANN_RESONANCE = 7.83;
export const BLOCK_TIME_MS = 873; // φ-Harmonic block time

export const CHAIN_ID = 'MEDINA-001';
export const CHAIN_NAME = 'MEDINA Sovereign Chain';
export const CHAIN_VERSION = '1.0.0';
export const GENESIS_TIMESTAMP = Date.now();

// ═══════════════════════════════════════════════════════════════════════════
// SECTION II: TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export type ConsensusType = 'proof-of-intelligence' | 'proof-of-stake' | 'proof-of-work';

export interface ChainConfig {
  chainId: string;
  chainName: string;
  version: string;
  consensus: ConsensusType;
  blockTimeMs: number;
  phiResonance: number;
  genesisTimestamp: number;
  nativeToken: TokenConfig;
}

export interface TokenConfig {
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: bigint;
  mintable: boolean;
  burnable: boolean;
}

export interface BlockHeader {
  blockNumber: bigint;
  previousHash: string;
  stateRoot: string;
  transactionsRoot: string;
  receiptsRoot: string;
  timestamp: number;
  phiNonce: number;
  intelligenceProof: IntelligenceProof;
}

export interface Block {
  header: BlockHeader;
  transactions: Transaction[];
  phiHash: string;
  animaHash: string;
  entanglementSignature: string;
}

export interface Transaction {
  txId: string;
  from: string;
  to: string;
  value: bigint;
  data: Uint8Array;
  nonce: bigint;
  gasLimit: bigint;
  gasPrice: bigint;
  signature: TransactionSignature;
  phiAlignment: number;
  timestamp: number;
}

export interface TransactionSignature {
  v: number;
  r: string;
  s: string;
  animaSeal: string;
}

export interface IntelligenceProof {
  proofId: string;
  validatorId: string;
  cognitiveScore: number;
  reasoningChain: string[];
  phiResonance: number;
  schumannAlignment: number;
  timestamp: number;
}

export interface Account {
  address: string;
  balance: bigint;
  nonce: bigint;
  codeHash: string;
  storageRoot: string;
  intelligenceScore: number;
  reputationScore: number;
}

export interface Validator {
  validatorId: string;
  address: string;
  stake: bigint;
  intelligenceScore: number;
  blocksProduced: bigint;
  rewardsEarned: bigint;
  slashingEvents: SlashingEvent[];
  phiAlignment: number;
  status: ValidatorStatus;
}

export type ValidatorStatus = 'active' | 'inactive' | 'jailed' | 'unbonding';

export interface SlashingEvent {
  eventId: string;
  reason: string;
  amount: bigint;
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION III: φ-HARMONIC HASHING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ANIMA Hash - φ-Fibonacci derived hash
 */
export function animaHash(input: string): string {
  let numericValue = 0;
  for (let i = 0; i < input.length; i++) {
    numericValue += input.charCodeAt(i) * Math.pow(PHI, i % 13);
  }

  const fib = fibonacciTransform(numericValue);
  const phi1 = fib * PHI;
  const phi2 = phi1 * PHI_SQUARED;
  const phi3 = phi2 * PHI_CUBED;
  const schumann = phi3 * SCHUMANN_RESONANCE;

  const rawHash = Math.abs(schumann).toString(16);
  return `ANIMA:${rawHash.padStart(64, '0').substring(0, 64)}`;
}

/**
 * Fibonacci matrix transformation
 */
function fibonacciTransform(value: number): number {
  const iterations = Math.floor(value % 100) + 10;
  let a = 1, b = 1;
  
  for (let i = 0; i < iterations; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  
  return (value * b) % (Number.MAX_SAFE_INTEGER / 1000);
}

/**
 * φ-Hash for blocks
 */
export function phiBlockHash(block: Block): string {
  const headerStr = JSON.stringify(block.header);
  const txRoot = block.transactions.map(tx => tx.txId).join('');
  const combined = `${headerStr}:${txRoot}:${block.header.timestamp}`;
  
  return animaHash(combined);
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION IV: PROOF OF INTELLIGENCE CONSENSUS
// ═══════════════════════════════════════════════════════════════════════════

export interface IntelligenceChallenge {
  challengeId: string;
  type: ChallengeType;
  difficulty: number;
  data: unknown;
  expectedPhiAlignment: number;
  timeLimit: number;
}

export type ChallengeType = 
  | 'pattern_recognition'
  | 'logical_reasoning'
  | 'mathematical_proof'
  | 'semantic_understanding'
  | 'phi_alignment';

export interface IntelligenceSolution {
  solutionId: string;
  challengeId: string;
  validatorId: string;
  solution: unknown;
  cognitiveScore: number;
  reasoningSteps: string[];
  phiResonance: number;
  timestamp: number;
}

/**
 * Proof of Intelligence Validator
 */
export class ProofOfIntelligenceValidator {
  private validators: Map<string, Validator> = new Map();
  private challenges: Map<string, IntelligenceChallenge> = new Map();
  private solutions: Map<string, IntelligenceSolution[]> = new Map();

  /**
   * Generate intelligence challenge for block production
   */
  generateChallenge(blockNumber: bigint): IntelligenceChallenge {
    const challengeId = `challenge-${blockNumber}-${Date.now()}`;
    const difficulty = this.calculateDifficulty(blockNumber);
    
    const challenge: IntelligenceChallenge = {
      challengeId,
      type: this.selectChallengeType(blockNumber),
      difficulty,
      data: this.generateChallengeData(difficulty),
      expectedPhiAlignment: PHI_INVERSE,
      timeLimit: BLOCK_TIME_MS,
    };

    this.challenges.set(challengeId, challenge);
    return challenge;
  }

  /**
   * Validate intelligence solution
   */
  validateSolution(solution: IntelligenceSolution): boolean {
    const challenge = this.challenges.get(solution.challengeId);
    if (!challenge) return false;

    // Verify cognitive score meets minimum threshold
    if (solution.cognitiveScore < challenge.difficulty * 0.618) {
      return false;
    }

    // Verify φ-resonance alignment
    if (Math.abs(solution.phiResonance - challenge.expectedPhiAlignment) > 0.1) {
      return false;
    }

    // Verify reasoning chain coherence
    if (solution.reasoningSteps.length < 3) {
      return false;
    }

    return true;
  }

  /**
   * Select block producer based on intelligence proof
   */
  selectBlockProducer(solutions: IntelligenceSolution[]): string | null {
    const validSolutions = solutions.filter(s => this.validateSolution(s));
    if (validSolutions.length === 0) return null;

    // Sort by combined score: cognitive + phi alignment
    validSolutions.sort((a, b) => {
      const scoreA = a.cognitiveScore * a.phiResonance;
      const scoreB = b.cognitiveScore * b.phiResonance;
      return scoreB - scoreA;
    });

    return validSolutions[0].validatorId;
  }

  private calculateDifficulty(blockNumber: bigint): number {
    return Math.floor(Number(blockNumber) * PHI_INVERSE) % 100 + 10;
  }

  private selectChallengeType(blockNumber: bigint): ChallengeType {
    const types: ChallengeType[] = [
      'pattern_recognition',
      'logical_reasoning',
      'mathematical_proof',
      'semantic_understanding',
      'phi_alignment',
    ];
    return types[Number(blockNumber % BigInt(types.length))];
  }

  private generateChallengeData(difficulty: number): unknown {
    return {
      seed: Math.random() * difficulty,
      phiTarget: PHI_INVERSE,
      complexity: difficulty,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION V: MEDINA SOVEREIGN CHAIN CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class MedinaSovereignChain {
  private config: ChainConfig;
  private blocks: Block[] = [];
  private accounts: Map<string, Account> = new Map();
  private validators: Map<string, Validator> = new Map();
  private pendingTransactions: Transaction[] = [];
  private consensusValidator: ProofOfIntelligenceValidator;

  constructor() {
    this.config = {
      chainId: CHAIN_ID,
      chainName: CHAIN_NAME,
      version: CHAIN_VERSION,
      consensus: 'proof-of-intelligence',
      blockTimeMs: BLOCK_TIME_MS,
      phiResonance: PHI_INVERSE,
      genesisTimestamp: GENESIS_TIMESTAMP,
      nativeToken: {
        symbol: 'M',
        name: 'MEDINA',
        decimals: 18,
        totalSupply: BigInt('1000000000000000000000000000'), // 1 billion
        mintable: true,
        burnable: true,
      },
    };

    this.consensusValidator = new ProofOfIntelligenceValidator();
    this.createGenesisBlock();
  }

  /**
   * Create genesis block
   */
  private createGenesisBlock(): void {
    const genesisBlock: Block = {
      header: {
        blockNumber: 0n,
        previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        stateRoot: animaHash('genesis-state'),
        transactionsRoot: animaHash('empty'),
        receiptsRoot: animaHash('empty'),
        timestamp: GENESIS_TIMESTAMP,
        phiNonce: Math.floor(PHI * 1000000),
        intelligenceProof: {
          proofId: 'genesis-proof',
          validatorId: 'genesis-validator',
          cognitiveScore: 1.0,
          reasoningChain: ['In the beginning was the φ'],
          phiResonance: PHI,
          schumannAlignment: SCHUMANN_RESONANCE,
          timestamp: GENESIS_TIMESTAMP,
        },
      },
      transactions: [],
      phiHash: animaHash('genesis-phi'),
      animaHash: animaHash('genesis-anima'),
      entanglementSignature: 'GENESIS-ENTANGLED',
    };

    this.blocks.push(genesisBlock);
  }

  /**
   * Get current block height
   */
  getBlockHeight(): bigint {
    return BigInt(this.blocks.length - 1);
  }

  /**
   * Get block by number
   */
  getBlock(blockNumber: bigint): Block | undefined {
    return this.blocks[Number(blockNumber)];
  }

  /**
   * Get latest block
   */
  getLatestBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  /**
   * Submit transaction
   */
  submitTransaction(tx: Transaction): string {
    // Validate transaction
    if (!this.validateTransaction(tx)) {
      throw new Error('Invalid transaction');
    }

    this.pendingTransactions.push(tx);
    return tx.txId;
  }

  /**
   * Validate transaction
   */
  private validateTransaction(tx: Transaction): boolean {
    // Check signature
    if (!tx.signature.animaSeal) return false;

    // Check nonce
    const account = this.accounts.get(tx.from);
    if (account && tx.nonce !== account.nonce + 1n) return false;

    // Check balance
    if (account && account.balance < tx.value + tx.gasLimit * tx.gasPrice) return false;

    // Check φ-alignment
    if (tx.phiAlignment < 0.5) return false;

    return true;
  }

  /**
   * Produce new block (called by selected validator)
   */
  async produceBlock(validatorId: string, intelligenceProof: IntelligenceProof): Promise<Block> {
    const previousBlock = this.getLatestBlock();
    const blockNumber = BigInt(this.blocks.length);

    const newBlock: Block = {
      header: {
        blockNumber,
        previousHash: previousBlock.phiHash,
        stateRoot: animaHash(`state-${blockNumber}`),
        transactionsRoot: this.calculateTransactionsRoot(),
        receiptsRoot: animaHash(`receipts-${blockNumber}`),
        timestamp: Date.now(),
        phiNonce: this.calculatePhiNonce(blockNumber),
        intelligenceProof,
      },
      transactions: [...this.pendingTransactions],
      phiHash: '',
      animaHash: '',
      entanglementSignature: '',
    };

    // Calculate hashes
    newBlock.phiHash = phiBlockHash(newBlock);
    newBlock.animaHash = animaHash(JSON.stringify(newBlock.header));
    newBlock.entanglementSignature = this.generateEntanglementSignature(newBlock);

    // Execute transactions
    await this.executeTransactions(newBlock.transactions);

    // Add to chain
    this.blocks.push(newBlock);
    this.pendingTransactions = [];

    return newBlock;
  }

  private calculateTransactionsRoot(): string {
    if (this.pendingTransactions.length === 0) {
      return animaHash('empty');
    }
    const txHashes = this.pendingTransactions.map(tx => tx.txId).join('');
    return animaHash(txHashes);
  }

  private calculatePhiNonce(blockNumber: bigint): number {
    return Math.floor(Number(blockNumber) * PHI * 1000000) % Number.MAX_SAFE_INTEGER;
  }

  private generateEntanglementSignature(block: Block): string {
    return animaHash(`entangle:${block.header.blockNumber}:${block.phiHash}`);
  }

  private async executeTransactions(transactions: Transaction[]): Promise<void> {
    for (const tx of transactions) {
      await this.executeTransaction(tx);
    }
  }

  private async executeTransaction(tx: Transaction): Promise<void> {
    const fromAccount = this.accounts.get(tx.from) || this.createAccount(tx.from);
    const toAccount = this.accounts.get(tx.to) || this.createAccount(tx.to);

    // Transfer value
    fromAccount.balance -= tx.value;
    toAccount.balance += tx.value;

    // Update nonces
    fromAccount.nonce += 1n;

    // Update accounts
    this.accounts.set(tx.from, fromAccount);
    this.accounts.set(tx.to, toAccount);
  }

  private createAccount(address: string): Account {
    const account: Account = {
      address,
      balance: 0n,
      nonce: 0n,
      codeHash: animaHash('empty-code'),
      storageRoot: animaHash('empty-storage'),
      intelligenceScore: 0,
      reputationScore: 0,
    };
    this.accounts.set(address, account);
    return account;
  }

  /**
   * Get chain configuration
   */
  getConfig(): ChainConfig {
    return this.config;
  }

  /**
   * Get chain statistics
   */
  getStatistics(): {
    blockHeight: bigint;
    totalTransactions: number;
    totalAccounts: number;
    totalValidators: number;
    phiResonance: number;
  } {
    return {
      blockHeight: this.getBlockHeight(),
      totalTransactions: this.blocks.reduce((sum, b) => sum + b.transactions.length, 0),
      totalAccounts: this.accounts.size,
      totalValidators: this.validators.size,
      phiResonance: this.config.phiResonance,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION VI: EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const medinaSovereignChain = new MedinaSovereignChain();
