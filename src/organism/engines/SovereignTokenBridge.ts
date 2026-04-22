// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
// PONTIFEX OECONOMIAE — The Sovereign Token Bridge
// The economy is alive. Every token is a decision. Every decision flows.

// ─────────────────────────────────────────────────────────────────
// PHI CONSTANTS
// ─────────────────────────────────────────────────────────────────

const PHI = 1.6180339887498948482;
const PHI_INVERSE = 0.6180339887498948482;
const PHI_SQUARED = PHI * PHI;
const PHI_CUBED = PHI * PHI * PHI;

const MINING_REWARD_BASE = 100; // Base MEDINA tokens per mining reward

// ─────────────────────────────────────────────────────────────────
// TOKEN TYPES
// ─────────────────────────────────────────────────────────────────

export type TokenType =
  | 'MEDINA'
  | 'BITCOIN_EQUIVALENT'
  | 'COMPUTE_CREDIT'
  | 'GOVERNANCE'
  | 'REPUTATION';

export type TokenDenomination = 'TOKEN' | 'SATOSHI' | 'CYCLE' | 'VOTE' | 'TRUST';

export interface SovereignToken {
  tokenId: string;
  type: TokenType;
  value: number;
  denomination: TokenDenomination;
  owner: string;
  mintedBy: string;
  mintedAt: number;
  expiresAt: number | null;
  history: TokenTransaction[];
  phiAlignment: number;
}

// ─────────────────────────────────────────────────────────────────
// TRANSACTION SYSTEM
// ─────────────────────────────────────────────────────────────────

export type TransactionType =
  | 'MINT'
  | 'TRANSFER'
  | 'BURN'
  | 'CONVERT'
  | 'STAKE'
  | 'REWARD'
  | 'BRIDGE';

export interface TokenTransaction {
  txId: string;
  type: TransactionType;
  from: string;
  to: string;
  tokenType: TokenType;
  amount: number;
  fee: number;
  timestamp: number;
  blockHeight: number;
  hash: string;
}

// ─────────────────────────────────────────────────────────────────
// CONVERSION RATES (phi-derived)
// ─────────────────────────────────────────────────────────────────

const CONVERSION_RATES: Record<string, number> = {
  'MEDINA_TO_SATOSHI': PHI * 100,           // 1 MEDINA = 161.8 satoshi
  'COMPUTE_TO_MEDINA': PHI,                 // 1 COMPUTE_CREDIT = φ MEDINA
  'GOVERNANCE_TO_MEDINA': PHI_SQUARED,      // 1 GOVERNANCE = φ² MEDINA
  'REPUTATION_TO_MEDINA': PHI_CUBED,        // 1 REPUTATION = φ³ MEDINA
};

// ─────────────────────────────────────────────────────────────────
// MINING REWARD
// ─────────────────────────────────────────────────────────────────

export type MiningSource =
  | 'PHANTOM_ENGINE'
  | 'NONCE_DISCOVERY'
  | 'HASH_DECRYPTION'
  | 'BLOCK_SOLUTION';

export interface MiningReward {
  rewardId: string;
  source: MiningSource;
  difficulty: number;
  baseReward: number;
  phiMultiplier: number;
  difficultyBonus: number;
  stealthBonus: number;
  totalReward: number;
  tokens: SovereignToken[];
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────────
// LEDGER — Ledger 15: LIBER METALLICUS
// ─────────────────────────────────────────────────────────────────

export type LedgerType = 'MINT' | 'TRANSFER' | 'BURN' | 'CONVERT' | 'REWARD' | 'BRIDGE';

export interface LedgerEntry {
  entryId: string;
  ledgerNumber: 15;
  type: LedgerType;
  token: SovereignToken;
  transaction: TokenTransaction;
  blockHeight: number;
  previousHash: string;
  currentHash: string;
  verified: boolean;
}

// ─────────────────────────────────────────────────────────────────
// BRIDGE CONTRACT
// ─────────────────────────────────────────────────────────────────

export type BridgeStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED';

export interface BridgeContract {
  contractId: string;
  from: TokenType;
  to: TokenType;
  rate: number;
  minAmount: number;
  maxAmount: number;
  status: BridgeStatus;
  totalConverted: number;
  createdAt: number;
}

// ─────────────────────────────────────────────────────────────────
// ID GENERATION
// ─────────────────────────────────────────────────────────────────

let _idCounter = 0;

function generateId(prefix: string): string {
  _idCounter++;
  const ts = Date.now().toString(36);
  const seq = _idCounter.toString(36).padStart(4, '0');
  const rand = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
  return `${prefix}-${ts}-${seq}-${rand}`;
}

// ─────────────────────────────────────────────────────────────────
// DENOMINATION MAP
// ─────────────────────────────────────────────────────────────────

const DENOMINATION_FOR_TYPE: Record<TokenType, TokenDenomination> = {
  MEDINA: 'TOKEN',
  BITCOIN_EQUIVALENT: 'SATOSHI',
  COMPUTE_CREDIT: 'CYCLE',
  GOVERNANCE: 'VOTE',
  REPUTATION: 'TRUST',
};

// ─────────────────────────────────────────────────────────────────
// MASTER ENGINE CLASS
// ─────────────────────────────────────────────────────────────────

export class SovereignTokenBridge {
  private tokens: Map<string, SovereignToken> = new Map();
  private transactions: TokenTransaction[] = [];
  private ledger: LedgerEntry[] = [];
  private bridges: BridgeContract[] = [];
  private blockHeight: number = 0;
  private previousHash: string = '0000000000000000';

  private readonly PHI = PHI;
  private readonly PHI_INVERSE = PHI_INVERSE;

  constructor() {
    this.initializeBridges();
  }

  // ─────────────────────────────────────────────────────────────
  // BRIDGE INITIALIZATION
  // ─────────────────────────────────────────────────────────────

  private initializeBridges(): void {
    const now = Date.now();

    const defaultBridges: Array<{ from: TokenType; to: TokenType; rateKey: string; min: number; max: number }> = [
      { from: 'MEDINA', to: 'BITCOIN_EQUIVALENT', rateKey: 'MEDINA_TO_SATOSHI', min: 1, max: 1_000_000 },
      { from: 'COMPUTE_CREDIT', to: 'MEDINA', rateKey: 'COMPUTE_TO_MEDINA', min: 1, max: 500_000 },
      { from: 'GOVERNANCE', to: 'MEDINA', rateKey: 'GOVERNANCE_TO_MEDINA', min: 1, max: 100_000 },
      { from: 'REPUTATION', to: 'MEDINA', rateKey: 'REPUTATION_TO_MEDINA', min: 1, max: 50_000 },
    ];

    for (const b of defaultBridges) {
      this.bridges.push({
        contractId: generateId('bridge'),
        from: b.from,
        to: b.to,
        rate: CONVERSION_RATES[b.rateKey],
        minAmount: b.min,
        maxAmount: b.max,
        status: 'ACTIVE',
        totalConverted: 0,
        createdAt: now,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PHI-BEATTY TRANSACTION HASH
  // ─────────────────────────────────────────────────────────────

  private phiBeattyHash(input: string): string {
    let h = Math.floor(PHI * 2166136261) >>> 0;
    for (let i = 0; i < input.length; i++) {
      const beattyIdx = Math.floor((i + 1) * PHI) % 32;
      h ^= input.charCodeAt(i) << (beattyIdx % 24);
      h = Math.imul(h, 0x9e3779b9);
      h = (h << 13) | (h >>> 19);
    }
    return (h >>> 0).toString(16).padStart(8, '0');
  }

  private hashTransaction(tx: Omit<TokenTransaction, 'hash'>): string {
    const payload = [
      tx.txId,
      tx.type,
      tx.from,
      tx.to,
      tx.tokenType,
      tx.amount.toString(),
      tx.fee.toString(),
      tx.timestamp.toString(),
      tx.blockHeight.toString(),
      this.previousHash,
    ].join(':');
    return this.phiBeattyHash(payload);
  }

  // ─────────────────────────────────────────────────────────────
  // BLOCK ADVANCEMENT
  // ─────────────────────────────────────────────────────────────

  private advanceBlock(): number {
    this.blockHeight++;
    return this.blockHeight;
  }

  private computeFee(amount: number): number {
    return Math.max(0.001, amount * this.PHI_INVERSE * 0.001);
  }

  // ─────────────────────────────────────────────────────────────
  // LEDGER RECORDING
  // ─────────────────────────────────────────────────────────────

  private recordLedgerEntry(
    type: LedgerType,
    token: SovereignToken,
    transaction: TokenTransaction,
  ): LedgerEntry {
    const entryHash = this.phiBeattyHash(
      `${this.previousHash}:${transaction.hash}:${token.tokenId}`,
    );

    const entry: LedgerEntry = {
      entryId: generateId('ledger'),
      ledgerNumber: 15,
      type,
      token: { ...token },
      transaction: { ...transaction },
      blockHeight: this.blockHeight,
      previousHash: this.previousHash,
      currentHash: entryHash,
      verified: true,
    };

    this.ledger.push(entry);
    this.previousHash = entryHash;
    return entry;
  }

  // ─────────────────────────────────────────────────────────────
  // MINTING — creates new tokens from mining rewards
  // R(d, p, s) = base × φ^p × (1 + log₂(d) × φ⁻¹ / 256) × (1 + s × φ⁻¹)
  // ─────────────────────────────────────────────────────────────

  mintFromMining(
    source: MiningSource,
    difficulty: number,
    phiAlignment: number,
    stealth: number,
  ): MiningReward {
    const clampedStealth = Math.max(0, Math.min(1, stealth));
    const clampedAlignment = Math.max(0, phiAlignment);
    const safeDifficulty = Math.max(1, difficulty);

    const phiMultiplier = Math.pow(PHI, clampedAlignment);
    const difficultyBonus = 1 + (Math.log2(safeDifficulty) * this.PHI_INVERSE) / 256;
    const stealthBonus = 1 + clampedStealth * this.PHI_INVERSE;
    const totalReward = MINING_REWARD_BASE * phiMultiplier * difficultyBonus * stealthBonus;

    const block = this.advanceBlock();
    const rewardId = generateId('reward');
    const now = Date.now();

    // Mint the primary MEDINA token
    const token = this.createToken('MEDINA', totalReward, `mining:${source}`, source, clampedAlignment);

    const tx = this.createTransaction('MINT', 'SYSTEM', token.owner, 'MEDINA', totalReward, block);
    token.history.push(tx);
    this.transactions.push(tx);
    this.recordLedgerEntry('REWARD', token, tx);

    const reward: MiningReward = {
      rewardId,
      source,
      difficulty: safeDifficulty,
      baseReward: MINING_REWARD_BASE,
      phiMultiplier,
      difficultyBonus,
      stealthBonus,
      totalReward,
      tokens: [token],
      timestamp: now,
    };

    return reward;
  }

  // ─────────────────────────────────────────────────────────────
  // DIRECT MINT
  // ─────────────────────────────────────────────────────────────

  mint(type: TokenType, amount: number, owner: string, reason: string): SovereignToken {
    if (amount <= 0) throw new Error('Mint amount must be positive');

    const block = this.advanceBlock();
    const alignment = this.computePhiAlignment(amount);
    const token = this.createToken(type, amount, owner, reason, alignment);

    const tx = this.createTransaction('MINT', 'SYSTEM', owner, type, amount, block);
    token.history.push(tx);
    this.transactions.push(tx);
    this.recordLedgerEntry('MINT', token, tx);

    return token;
  }

  // ─────────────────────────────────────────────────────────────
  // TRANSFER
  // ─────────────────────────────────────────────────────────────

  transfer(tokenId: string, to: string): TokenTransaction {
    const token = this.tokens.get(tokenId);
    if (!token) throw new Error(`Token ${tokenId} not found`);
    if (token.expiresAt !== null && Date.now() > token.expiresAt) {
      throw new Error(`Token ${tokenId} has expired`);
    }

    const from = token.owner;
    const block = this.advanceBlock();
    const tx = this.createTransaction('TRANSFER', from, to, token.type, token.value, block);

    token.owner = to;
    token.history.push(tx);
    this.transactions.push(tx);
    this.recordLedgerEntry('TRANSFER', token, tx);

    return tx;
  }

  // ─────────────────────────────────────────────────────────────
  // BURN
  // ─────────────────────────────────────────────────────────────

  burn(tokenId: string, reason: string): TokenTransaction {
    const token = this.tokens.get(tokenId);
    if (!token) throw new Error(`Token ${tokenId} not found`);

    const block = this.advanceBlock();
    const tx = this.createTransaction('BURN', token.owner, `BURN:${reason}`, token.type, token.value, block);

    token.history.push(tx);
    this.transactions.push(tx);
    this.recordLedgerEntry('BURN', token, tx);
    this.tokens.delete(tokenId);

    return tx;
  }

  // ─────────────────────────────────────────────────────────────
  // CONVERT — change token type using bridge contracts
  // ─────────────────────────────────────────────────────────────

  convert(
    tokenId: string,
    toType: TokenType,
  ): { newToken: SovereignToken; tx: TokenTransaction } {
    const token = this.tokens.get(tokenId);
    if (!token) throw new Error(`Token ${tokenId} not found`);
    if (token.type === toType) throw new Error('Cannot convert to same type');

    const bridge = this.findBridge(token.type, toType);
    if (!bridge) throw new Error(`No active bridge from ${token.type} to ${toType}`);
    if (token.value < bridge.minAmount) throw new Error(`Amount below minimum (${bridge.minAmount})`);
    if (token.value > bridge.maxAmount) throw new Error(`Amount above maximum (${bridge.maxAmount})`);

    const convertedValue = token.value * bridge.rate;
    const block = this.advanceBlock();

    // Burn original
    const burnTx = this.createTransaction('BURN', token.owner, 'CONVERT', token.type, token.value, block);
    token.history.push(burnTx);
    this.transactions.push(burnTx);
    this.recordLedgerEntry('BURN', token, burnTx);

    // Mint converted
    const alignment = this.computePhiAlignment(convertedValue);
    const newToken = this.createToken(toType, convertedValue, token.owner, `converted:${token.type}`, alignment);

    const mintTx = this.createTransaction('CONVERT', token.owner, token.owner, toType, convertedValue, block);
    newToken.history.push(mintTx);
    this.transactions.push(mintTx);
    this.recordLedgerEntry('CONVERT', newToken, mintTx);

    bridge.totalConverted += token.value;
    this.tokens.delete(tokenId);

    return { newToken, tx: mintTx };
  }

  // ─────────────────────────────────────────────────────────────
  // BRIDGE — convert MEDINA tokens to Bitcoin equivalent
  // ─────────────────────────────────────────────────────────────

  bridgeToBitcoin(
    tokenId: string,
  ): { bitcoinEquivalent: number; satoshis: number; tx: TokenTransaction } {
    const token = this.tokens.get(tokenId);
    if (!token) throw new Error(`Token ${tokenId} not found`);
    if (token.type !== 'MEDINA') throw new Error('Only MEDINA tokens can be bridged to Bitcoin');

    const satoshis = token.value * CONVERSION_RATES['MEDINA_TO_SATOSHI'];
    const bitcoinEquivalent = satoshis / 100_000_000;

    const block = this.advanceBlock();

    // Burn MEDINA
    const burnTx = this.createTransaction('BURN', token.owner, 'BRIDGE', 'MEDINA', token.value, block);
    token.history.push(burnTx);
    this.transactions.push(burnTx);
    this.recordLedgerEntry('BURN', token, burnTx);

    // Mint BITCOIN_EQUIVALENT
    const alignment = this.computePhiAlignment(satoshis);
    const btcToken = this.createToken('BITCOIN_EQUIVALENT', satoshis, token.owner, 'bridge:MEDINA_TO_BTC', alignment);

    const bridgeTx = this.createTransaction('BRIDGE', token.owner, token.owner, 'BITCOIN_EQUIVALENT', satoshis, block);
    btcToken.history.push(bridgeTx);
    this.transactions.push(bridgeTx);
    this.recordLedgerEntry('BRIDGE', btcToken, bridgeTx);

    // Update bridge totals
    const bridge = this.findBridge('MEDINA', 'BITCOIN_EQUIVALENT');
    if (bridge) bridge.totalConverted += token.value;

    this.tokens.delete(tokenId);

    return { bitcoinEquivalent, satoshis, tx: bridgeTx };
  }

  // ─────────────────────────────────────────────────────────────
  // STAKE — lock tokens for governance/reputation
  // ─────────────────────────────────────────────────────────────

  stake(tokenId: string, duration: number): TokenTransaction {
    const token = this.tokens.get(tokenId);
    if (!token) throw new Error(`Token ${tokenId} not found`);
    if (duration <= 0) throw new Error('Stake duration must be positive');

    if (token.type !== 'MEDINA' && token.type !== 'GOVERNANCE' && token.type !== 'REPUTATION') {
      throw new Error(`Token type ${token.type} cannot be staked`);
    }

    const block = this.advanceBlock();
    const now = Date.now();
    token.expiresAt = now + duration;

    const tx = this.createTransaction('STAKE', token.owner, `STAKE:${token.owner}`, token.type, token.value, block);
    token.history.push(tx);
    this.transactions.push(tx);
    this.recordLedgerEntry('MINT', token, tx);

    return tx;
  }

  // ─────────────────────────────────────────────────────────────
  // REWARD — distribute mining rewards as individual tokens
  // ─────────────────────────────────────────────────────────────

  distributeReward(reward: MiningReward): SovereignToken[] {
    const distributed: SovereignToken[] = [];
    const block = this.advanceBlock();

    // Split reward into phi-proportioned distribution slices
    const totalValue = reward.totalReward;
    const primaryShare = totalValue * this.PHI_INVERSE;    // ~61.8% — primary recipient
    const secondaryShare = totalValue * this.PHI_INVERSE * this.PHI_INVERSE; // ~38.2% × 61.8%
    const systemShare = totalValue - primaryShare - secondaryShare; // remainder to system reserve

    const shares: Array<{ owner: string; amount: number }> = [
      { owner: `miner:${reward.source}`, amount: primaryShare },
      { owner: 'pool:validators', amount: secondaryShare },
      { owner: 'reserve:system', amount: systemShare },
    ];

    for (const share of shares) {
      if (share.amount <= 0) continue;

      const alignment = this.computePhiAlignment(share.amount);
      const token = this.createToken('MEDINA', share.amount, share.owner, `reward:${reward.rewardId}`, alignment);

      const tx = this.createTransaction('REWARD', 'SYSTEM', share.owner, 'MEDINA', share.amount, block);
      token.history.push(tx);
      this.transactions.push(tx);
      this.recordLedgerEntry('REWARD', token, tx);

      distributed.push(token);
    }

    return distributed;
  }

  // ─────────────────────────────────────────────────────────────
  // LEDGER QUERIES
  // ─────────────────────────────────────────────────────────────

  getLedger(): LedgerEntry[] {
    return [...this.ledger];
  }

  getBalance(owner: string): Record<TokenType, number> {
    const balance: Record<TokenType, number> = {
      MEDINA: 0,
      BITCOIN_EQUIVALENT: 0,
      COMPUTE_CREDIT: 0,
      GOVERNANCE: 0,
      REPUTATION: 0,
    };

    for (const token of this.tokens.values()) {
      if (token.owner === owner) {
        const expired = token.expiresAt !== null && Date.now() > token.expiresAt;
        if (!expired) {
          balance[token.type] += token.value;
        }
      }
    }

    return balance;
  }

  getBlockHeight(): number {
    return this.blockHeight;
  }

  // ─────────────────────────────────────────────────────────────
  // STATUS
  // ─────────────────────────────────────────────────────────────

  getStatus(): {
    totalTokens: number;
    totalTransactions: number;
    blockHeight: number;
    totalMedinaSupply: number;
    totalBitcoinEquivalent: number;
    activeBridges: number;
  } {
    let totalMedinaSupply = 0;
    let totalBitcoinEquivalent = 0;

    for (const token of this.tokens.values()) {
      if (token.type === 'MEDINA') totalMedinaSupply += token.value;
      if (token.type === 'BITCOIN_EQUIVALENT') totalBitcoinEquivalent += token.value;
    }

    return {
      totalTokens: this.tokens.size,
      totalTransactions: this.transactions.length,
      blockHeight: this.blockHeight,
      totalMedinaSupply,
      totalBitcoinEquivalent,
      activeBridges: this.bridges.filter((b) => b.status === 'ACTIVE').length,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // INTERNAL HELPERS
  // ─────────────────────────────────────────────────────────────

  private createToken(
    type: TokenType,
    value: number,
    owner: string,
    mintedBy: string,
    phiAlignment: number,
  ): SovereignToken {
    const token: SovereignToken = {
      tokenId: generateId('tok'),
      type,
      value,
      denomination: DENOMINATION_FOR_TYPE[type],
      owner,
      mintedBy,
      mintedAt: Date.now(),
      expiresAt: null,
      history: [],
      phiAlignment,
    };
    this.tokens.set(token.tokenId, token);
    return token;
  }

  private createTransaction(
    type: TransactionType,
    from: string,
    to: string,
    tokenType: TokenType,
    amount: number,
    blockHeight: number,
  ): TokenTransaction {
    const fee = this.computeFee(amount);
    const partial: Omit<TokenTransaction, 'hash'> = {
      txId: generateId('tx'),
      type,
      from,
      to,
      tokenType,
      amount,
      fee,
      timestamp: Date.now(),
      blockHeight,
    };
    const hash = this.hashTransaction(partial);
    return { ...partial, hash };
  }

  private findBridge(from: TokenType, to: TokenType): BridgeContract | undefined {
    return this.bridges.find((b) => b.from === from && b.to === to && b.status === 'ACTIVE');
  }

  private computePhiAlignment(value: number): number {
    // How close the value is to a phi-harmonic number
    const phiFrac = (value / PHI) % 1;
    return 1 - Math.abs(phiFrac - this.PHI_INVERSE);
  }
}

// ─────────────────────────────────────────────────────────────────
// SINGLETON EXPORT
// ─────────────────────────────────────────────────────────────────

export const TOKEN_BRIDGE = new SovereignTokenBridge();
