/**
 * 𓂀 NEXUS TOKEN ECONOMY: UNIVERSAL BINDING LAYER 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THE VISION:
 * 
 * Tokens bind EVERYTHING:
 * - Every decision
 * - Every contract
 * - Every area
 * 
 * We have UNLIMITED tokens with powerful weight.
 * Tokens are used where needed, not fought over.
 * 
 * @version 1.1.2 (Fibonacci)
 * @designation (NEXUS-TOKENS)
 */

import { PHI, phiHash } from '../blockchain/NexusBlockchain';

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type TokenType = 
  | 'DECISION'        // Binds decisions
  | 'CONTRACT'        // Binds contracts
  | 'KNOWLEDGE'       // Holds knowledge weight
  | 'ACCESS'          // Grants access
  | 'COMPUTE'         // Computation units
  | 'MEMORY'          // Memory allocation
  | 'NETWORK'         // Network operations
  | 'GOVERNANCE';     // Governance voting

export interface NexusToken {
  id: string;
  type: TokenType;
  weight: number;           // Knowledge/power weight
  created: number;
  owner: string;
  boundTo: string[];        // What this token binds
  metadata: TokenMetadata;
  active: boolean;
}

export interface TokenMetadata {
  purpose: string;
  frequency: number;
  phiAlignment: number;     // 0-1 alignment with φ
  layer: number;            // Which layer this token operates at
}

export interface TokenAllocation {
  entityId: string;
  entityType: 'MODEL' | 'AGENT' | 'TOOL' | 'USER' | 'CONTRACT' | 'DECISION';
  tokens: NexusToken[];
  totalWeight: number;
  unlimited: boolean;       // Organism has unlimited
}

export interface TokenBinding {
  id: string;
  tokenId: string;
  sourceEntity: string;
  targetEntity: string;
  bindingType: 'DECISION' | 'CONTRACT' | 'ACCESS' | 'EXECUTION';
  strength: number;         // 0-1 binding strength
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN WEIGHTS (Fibonacci-based)
// ═══════════════════════════════════════════════════════════════════════════════

export const TOKEN_WEIGHTS = {
  // Fibonacci sequence for token weights
  MINIMAL: 1,
  SMALL: 1,
  BASE: 2,
  MEDIUM: 3,
  STANDARD: 5,
  LARGE: 8,
  POWERFUL: 13,
  MASSIVE: 21,
  CRITICAL: 34,
  SUPREME: 55,
  INFINITE: 89,           // For organism-level tokens
  UNLIMITED: Infinity,    // For core system tokens
};

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN ECONOMY ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class NexusTokenEconomy {
  public readonly designation = '(NEXUS-TOKEN-ECONOMY)';
  
  private tokens: Map<string, NexusToken> = new Map();
  private allocations: Map<string, TokenAllocation> = new Map();
  private bindings: Map<string, TokenBinding> = new Map();
  private tokenCounter = 0;
  private bindingCounter = 0;
  
  constructor() {
    // Initialize core system tokens
    this.initializeSystemTokens();
  }
  
  /**
   * Initialize unlimited tokens for the organism
   */
  private initializeSystemTokens(): void {
    // Create unlimited tokens for each type
    const types: TokenType[] = [
      'DECISION', 'CONTRACT', 'KNOWLEDGE', 'ACCESS',
      'COMPUTE', 'MEMORY', 'NETWORK', 'GOVERNANCE'
    ];
    
    for (const type of types) {
      this.mintToken(
        type,
        TOKEN_WEIGHTS.UNLIMITED,
        'NEXUS_ORGANISM',
        `System ${type} token`,
        963
      );
    }
    
    console.log(`${this.designation} System tokens initialized`);
  }
  
  /**
   * Mint a new token
   */
  mintToken(
    type: TokenType,
    weight: number,
    owner: string,
    purpose: string,
    frequency: number = 528
  ): NexusToken {
    const token: NexusToken = {
      id: `token_${++this.tokenCounter}_${Date.now()}`,
      type,
      weight,
      created: Date.now(),
      owner,
      boundTo: [],
      metadata: {
        purpose,
        frequency,
        phiAlignment: this.calculatePhiAlignment(weight),
        layer: this.getLayerForType(type),
      },
      active: true,
    };
    
    this.tokens.set(token.id, token);
    
    // Add to owner's allocation
    this.addToAllocation(owner, token);
    
    return token;
  }
  
  /**
   * Bind a token to an entity
   */
  bindToken(
    tokenId: string,
    sourceEntity: string,
    targetEntity: string,
    bindingType: TokenBinding['bindingType']
  ): TokenBinding | null {
    const token = this.tokens.get(tokenId);
    if (!token || !token.active) return null;
    
    const binding: TokenBinding = {
      id: `binding_${++this.bindingCounter}_${Date.now()}`,
      tokenId,
      sourceEntity,
      targetEntity,
      bindingType,
      strength: this.calculateBindingStrength(token.weight),
      timestamp: Date.now(),
    };
    
    token.boundTo.push(targetEntity);
    this.bindings.set(binding.id, binding);
    
    return binding;
  }
  
  /**
   * Allocate tokens for a decision
   */
  allocateForDecision(
    decisionId: string,
    modelId: string,
    weight: number = TOKEN_WEIGHTS.STANDARD
  ): NexusToken {
    const token = this.mintToken(
      'DECISION',
      weight,
      'NEXUS_ORGANISM',
      `Decision binding for ${decisionId}`,
      852
    );
    
    this.bindToken(token.id, modelId, decisionId, 'DECISION');
    
    return token;
  }
  
  /**
   * Allocate tokens for a contract
   */
  allocateForContract(
    contractId: string,
    parties: string[],
    weight: number = TOKEN_WEIGHTS.POWERFUL
  ): NexusToken[] {
    const tokens: NexusToken[] = [];
    
    for (const party of parties) {
      const token = this.mintToken(
        'CONTRACT',
        weight,
        party,
        `Contract binding for ${contractId}`,
        741
      );
      
      this.bindToken(token.id, party, contractId, 'CONTRACT');
      tokens.push(token);
    }
    
    return tokens;
  }
  
  /**
   * Allocate access tokens
   */
  allocateAccess(
    entityId: string,
    resourceId: string,
    weight: number = TOKEN_WEIGHTS.MEDIUM
  ): NexusToken {
    const token = this.mintToken(
      'ACCESS',
      weight,
      entityId,
      `Access to ${resourceId}`,
      639
    );
    
    this.bindToken(token.id, entityId, resourceId, 'ACCESS');
    
    return token;
  }
  
  /**
   * Get tokens for an entity
   */
  getTokensFor(entityId: string): NexusToken[] {
    const allocation = this.allocations.get(entityId);
    return allocation ? allocation.tokens : [];
  }
  
  /**
   * Get total weight for an entity
   */
  getTotalWeight(entityId: string): number {
    const allocation = this.allocations.get(entityId);
    return allocation ? allocation.totalWeight : 0;
  }
  
  /**
   * Check if entity has sufficient tokens
   */
  hasSufficientTokens(
    entityId: string,
    type: TokenType,
    requiredWeight: number
  ): boolean {
    const tokens = this.getTokensFor(entityId);
    const typeTokens = tokens.filter(t => t.type === type && t.active);
    const totalWeight = typeTokens.reduce((sum, t) => sum + t.weight, 0);
    return totalWeight >= requiredWeight;
  }
  
  /**
   * Add token to entity allocation
   */
  private addToAllocation(entityId: string, token: NexusToken): void {
    let allocation = this.allocations.get(entityId);
    
    if (!allocation) {
      allocation = {
        entityId,
        entityType: this.inferEntityType(entityId),
        tokens: [],
        totalWeight: 0,
        unlimited: entityId === 'NEXUS_ORGANISM',
      };
      this.allocations.set(entityId, allocation);
    }
    
    allocation.tokens.push(token);
    allocation.totalWeight = token.weight === Infinity 
      ? Infinity 
      : allocation.totalWeight + token.weight;
  }
  
  /**
   * Calculate φ alignment for a weight
   */
  private calculatePhiAlignment(weight: number): number {
    if (weight === Infinity) return 1;
    const phiProduct = weight * PHI;
    const deviation = Math.abs(phiProduct - Math.round(phiProduct));
    return 1 - Math.min(deviation, 1);
  }
  
  /**
   * Calculate binding strength
   */
  private calculateBindingStrength(weight: number): number {
    if (weight === Infinity) return 1;
    return Math.min(weight / TOKEN_WEIGHTS.SUPREME, 1);
  }
  
  /**
   * Get layer for token type
   */
  private getLayerForType(type: TokenType): number {
    const layers: Record<TokenType, number> = {
      GOVERNANCE: 10,
      CONTRACT: 9,
      KNOWLEDGE: 8,
      DECISION: 7,
      ACCESS: 6,
      COMPUTE: 5,
      MEMORY: 4,
      NETWORK: 3,
    };
    return layers[type];
  }
  
  /**
   * Infer entity type from ID
   */
  private inferEntityType(entityId: string): TokenAllocation['entityType'] {
    if (entityId.startsWith('model_')) return 'MODEL';
    if (entityId.startsWith('agent_')) return 'AGENT';
    if (entityId.startsWith('tool_')) return 'TOOL';
    if (entityId.startsWith('decision_')) return 'DECISION';
    if (entityId.startsWith('contract_')) return 'CONTRACT';
    return 'USER';
  }
  
  /**
   * Get statistics
   */
  getStats(): {
    totalTokens: number;
    totalBindings: number;
    totalAllocations: number;
    tokensByType: Record<TokenType, number>;
    totalWeight: number;
  } {
    const tokensByType: Record<TokenType, number> = {
      DECISION: 0,
      CONTRACT: 0,
      KNOWLEDGE: 0,
      ACCESS: 0,
      COMPUTE: 0,
      MEMORY: 0,
      NETWORK: 0,
      GOVERNANCE: 0,
    };
    
    let totalWeight = 0;
    
    const tokensArray = Array.from(this.tokens.values());
    for (const token of tokensArray) {
      tokensByType[token.type]++;
      if (token.weight !== Infinity) {
        totalWeight += token.weight;
      }
    }
    
    return {
      totalTokens: this.tokens.size,
      totalBindings: this.bindings.size,
      totalAllocations: this.allocations.size,
      tokensByType,
      totalWeight,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const TOKEN_CONSTANTS = {
  TYPES: [
    'DECISION', 'CONTRACT', 'KNOWLEDGE', 'ACCESS',
    'COMPUTE', 'MEMORY', 'NETWORK', 'GOVERNANCE'
  ],
  
  WEIGHTS: TOKEN_WEIGHTS,
  
  LAYERS: {
    GOVERNANCE: 10,
    CONTRACT: 9,
    KNOWLEDGE: 8,
    DECISION: 7,
    ACCESS: 6,
    COMPUTE: 5,
    MEMORY: 4,
    NETWORK: 3,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let economyInstance: NexusTokenEconomy | null = null;

export function getNexusTokenEconomy(): NexusTokenEconomy {
  if (!economyInstance) {
    economyInstance = new NexusTokenEconomy();
  }
  return economyInstance;
}

export default {
  NexusTokenEconomy,
  getNexusTokenEconomy,
  TOKEN_WEIGHTS,
  TOKEN_CONSTANTS,
};
