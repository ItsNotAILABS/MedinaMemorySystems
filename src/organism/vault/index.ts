/**
 * 𓂀 ACCESS CONTROL VAULT 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * BACKEND VAULT - OWNER ACCESS ONLY
 * 
 * This is the secured Access Control system that exists ONLY in the backend layer.
 * It is a vault accessible only to the owner (Medina).
 * 
 * The Sovereign Access Controller from the frontend connects to this vault
 * for actual security enforcement, but the vault itself is backend-only.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * VAULT CONTENTS:
 * 
 * 1. MASTER KEYS
 *    - Root access credentials
 *    - Layer bypass tokens
 *    - Emergency overrides
 * 
 * 2. TRUST LEDGER
 *    - All trust scores
 *    - Trust history
 *    - Trust decay rules
 * 
 * 3. PERMISSION MATRIX
 *    - All permission definitions
 *    - Permission inheritance
 *    - Permission conflicts
 * 
 * 4. AUDIT LOG
 *    - All access attempts
 *    - Permission changes
 *    - Security events
 * 
 * 5. SOVEREIGN OVERRIDE
 *    - Owner-only capabilities
 *    - System-level access
 *    - Bypass mechanisms
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * @version 1.0.0
 * @author Sovereign Organism
 * @frequency 417 Hz (Backend/Change)
 * @layer BACKEND (Layer 2)
 * @access OWNER_ONLY
 */

import { AccessDomain, TrustLevel, ACCESS_CONSTANTS } from '../access';

// ═══════════════════════════════════════════════════════════════════════════════
// VAULT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type VaultAccessLevel = 'OWNER' | 'SYSTEM' | 'RESTRICTED' | 'DENIED';

export interface VaultKey {
  id: string;
  type: 'MASTER' | 'LAYER_BYPASS' | 'EMERGENCY' | 'SESSION';
  owner: string;
  created: number;
  expires?: number;
  used: number;
  maxUses?: number;
  hash: string;
}

export interface TrustEntry {
  userId: string;
  score: number;
  level: TrustLevel;
  history: TrustEvent[];
  created: number;
  updated: number;
}

export interface TrustEvent {
  timestamp: number;
  type: 'INCREASE' | 'DECREASE' | 'RESET';
  amount: number;
  reason: string;
  previousScore: number;
  newScore: number;
}

export interface PermissionEntry {
  domain: AccessDomain;
  granted: boolean;
  grantedBy: 'USER' | 'SYSTEM' | 'OWNER' | 'AUTO';
  timestamp: number;
  expires?: number;
  conditions?: string[];
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  type: 'ACCESS_ATTEMPT' | 'PERMISSION_CHANGE' | 'TRUST_CHANGE' | 'SECURITY_EVENT';
  userId: string;
  action: string;
  domain?: AccessDomain;
  success: boolean;
  details: any;
}

export interface SovereignOverride {
  active: boolean;
  activatedAt?: number;
  activatedBy?: string;
  reason?: string;
  expires?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACCESS CONTROL VAULT CLASS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The Access Control Vault
 * Backend-only, Owner access only
 */
export class AccessControlVault {
  private static instance: AccessControlVault | null = null;
  
  // Vault storage
  private masterKeys: Map<string, VaultKey> = new Map();
  private trustLedger: Map<string, TrustEntry> = new Map();
  private permissionMatrix: Map<string, Map<AccessDomain, PermissionEntry>> = new Map();
  private auditLog: AuditEntry[] = [];
  private sovereignOverride: SovereignOverride = { active: false };
  
  // Owner identification
  private ownerId: string = 'medina_sovereign';
  private ownerAuthenticated: boolean = false;
  
  // Vault state
  private sealed: boolean = true;
  private lastAccess: number = 0;
  
  private constructor() {
    this.initializeVault();
  }
  
  /**
   * Get vault instance (singleton)
   */
  static getInstance(): AccessControlVault {
    if (!AccessControlVault.instance) {
      AccessControlVault.instance = new AccessControlVault();
    }
    return AccessControlVault.instance;
  }
  
  /**
   * Initialize vault with default values
   */
  private initializeVault(): void {
    // Create master key for owner
    const masterKey: VaultKey = {
      id: 'master_key_001',
      type: 'MASTER',
      owner: this.ownerId,
      created: Date.now(),
      used: 0,
      hash: this.generateHash('SOVEREIGN_MASTER_KEY'),
    };
    
    this.masterKeys.set(masterKey.id, masterKey);
    
    // Log initialization
    this.log({
      id: this.generateId(),
      timestamp: Date.now(),
      type: 'SECURITY_EVENT',
      userId: 'SYSTEM',
      action: 'VAULT_INITIALIZED',
      success: true,
      details: { sealed: true },
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // VAULT ACCESS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Authenticate as owner
   */
  authenticateOwner(credentials: { userId: string; keyHash: string }): boolean {
    if (credentials.userId !== this.ownerId) {
      this.log({
        id: this.generateId(),
        timestamp: Date.now(),
        type: 'ACCESS_ATTEMPT',
        userId: credentials.userId,
        action: 'OWNER_AUTH_FAILED',
        success: false,
        details: { reason: 'Invalid owner ID' },
      });
      return false;
    }
    
    // Verify key hash
    const masterKey = this.masterKeys.get('master_key_001');
    if (!masterKey || credentials.keyHash !== masterKey.hash) {
      this.log({
        id: this.generateId(),
        timestamp: Date.now(),
        type: 'ACCESS_ATTEMPT',
        userId: credentials.userId,
        action: 'OWNER_AUTH_FAILED',
        success: false,
        details: { reason: 'Invalid key hash' },
      });
      return false;
    }
    
    this.ownerAuthenticated = true;
    this.sealed = false;
    this.lastAccess = Date.now();
    
    this.log({
      id: this.generateId(),
      timestamp: Date.now(),
      type: 'ACCESS_ATTEMPT',
      userId: credentials.userId,
      action: 'OWNER_AUTH_SUCCESS',
      success: true,
      details: { vaultUnsealed: true },
    });
    
    return true;
  }
  
  /**
   * Check if vault is accessible
   */
  isAccessible(): boolean {
    return this.ownerAuthenticated && !this.sealed;
  }
  
  /**
   * Seal the vault
   */
  seal(): void {
    this.sealed = true;
    this.ownerAuthenticated = false;
    
    this.log({
      id: this.generateId(),
      timestamp: Date.now(),
      type: 'SECURITY_EVENT',
      userId: this.ownerId,
      action: 'VAULT_SEALED',
      success: true,
      details: {},
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TRUST MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get trust score for a user
   */
  getTrustScore(userId: string): number {
    const entry = this.trustLedger.get(userId);
    return entry?.score ?? 0.1; // Default trust for new users
  }
  
  /**
   * Set trust score (owner only)
   */
  setTrustScore(userId: string, score: number, reason: string): boolean {
    if (!this.isAccessible()) {
      this.log({
        id: this.generateId(),
        timestamp: Date.now(),
        type: 'ACCESS_ATTEMPT',
        userId: 'UNKNOWN',
        action: 'SET_TRUST_DENIED',
        success: false,
        details: { reason: 'Vault sealed' },
      });
      return false;
    }
    
    const entry = this.trustLedger.get(userId);
    const previousScore = entry?.score ?? 0.1;
    
    const newEntry: TrustEntry = {
      userId,
      score: Math.max(0, Math.min(1, score)),
      level: this.calculateTrustLevel(score),
      history: entry?.history ?? [],
      created: entry?.created ?? Date.now(),
      updated: Date.now(),
    };
    
    newEntry.history.push({
      timestamp: Date.now(),
      type: score > previousScore ? 'INCREASE' : score < previousScore ? 'DECREASE' : 'RESET',
      amount: Math.abs(score - previousScore),
      reason,
      previousScore,
      newScore: score,
    });
    
    this.trustLedger.set(userId, newEntry);
    
    this.log({
      id: this.generateId(),
      timestamp: Date.now(),
      type: 'TRUST_CHANGE',
      userId,
      action: 'TRUST_SET',
      success: true,
      details: { previousScore, newScore: score, reason },
    });
    
    return true;
  }
  
  /**
   * Calculate trust level from score
   */
  private calculateTrustLevel(score: number): TrustLevel {
    if (score >= ACCESS_CONSTANTS.TRUST_THRESHOLDS.SOVEREIGN_PARTNER) return 'SOVEREIGN_PARTNER';
    if (score >= ACCESS_CONSTANTS.TRUST_THRESHOLDS.TRUSTED) return 'TRUSTED';
    if (score >= ACCESS_CONSTANTS.TRUST_THRESHOLDS.FAMILIAR) return 'FAMILIAR';
    if (score >= ACCESS_CONSTANTS.TRUST_THRESHOLDS.ACQUAINTED) return 'ACQUAINTED';
    return 'NEW_USER';
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PERMISSION MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Grant permission
   */
  grantPermission(
    userId: string,
    domain: AccessDomain,
    grantedBy: 'USER' | 'SYSTEM' | 'OWNER' | 'AUTO'
  ): boolean {
    if (grantedBy === 'OWNER' && !this.isAccessible()) {
      return false;
    }
    
    if (!this.permissionMatrix.has(userId)) {
      this.permissionMatrix.set(userId, new Map());
    }
    
    const userPermissions = this.permissionMatrix.get(userId)!;
    userPermissions.set(domain, {
      domain,
      granted: true,
      grantedBy,
      timestamp: Date.now(),
    });
    
    this.log({
      id: this.generateId(),
      timestamp: Date.now(),
      type: 'PERMISSION_CHANGE',
      userId,
      action: 'PERMISSION_GRANTED',
      domain,
      success: true,
      details: { grantedBy },
    });
    
    return true;
  }
  
  /**
   * Revoke permission
   */
  revokePermission(userId: string, domain: AccessDomain): boolean {
    const userPermissions = this.permissionMatrix.get(userId);
    if (!userPermissions) return false;
    
    userPermissions.delete(domain);
    
    this.log({
      id: this.generateId(),
      timestamp: Date.now(),
      type: 'PERMISSION_CHANGE',
      userId,
      action: 'PERMISSION_REVOKED',
      domain,
      success: true,
      details: {},
    });
    
    return true;
  }
  
  /**
   * Check if user has permission
   */
  hasPermission(userId: string, domain: AccessDomain): boolean {
    const userPermissions = this.permissionMatrix.get(userId);
    if (!userPermissions) return false;
    
    const entry = userPermissions.get(domain);
    if (!entry) return false;
    
    // Check expiration
    if (entry.expires && entry.expires < Date.now()) {
      userPermissions.delete(domain);
      return false;
    }
    
    return entry.granted;
  }
  
  /**
   * Get all permissions for a user
   */
  getUserPermissions(userId: string): PermissionEntry[] {
    const userPermissions = this.permissionMatrix.get(userId);
    if (!userPermissions) return [];
    return Array.from(userPermissions.values());
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SOVEREIGN OVERRIDE
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Activate sovereign override (owner only)
   */
  activateSovereignOverride(reason: string): boolean {
    if (!this.isAccessible()) return false;
    
    this.sovereignOverride = {
      active: true,
      activatedAt: Date.now(),
      activatedBy: this.ownerId,
      reason,
    };
    
    this.log({
      id: this.generateId(),
      timestamp: Date.now(),
      type: 'SECURITY_EVENT',
      userId: this.ownerId,
      action: 'SOVEREIGN_OVERRIDE_ACTIVATED',
      success: true,
      details: { reason },
    });
    
    return true;
  }
  
  /**
   * Deactivate sovereign override
   */
  deactivateSovereignOverride(): boolean {
    if (!this.isAccessible()) return false;
    
    this.sovereignOverride = { active: false };
    
    this.log({
      id: this.generateId(),
      timestamp: Date.now(),
      type: 'SECURITY_EVENT',
      userId: this.ownerId,
      action: 'SOVEREIGN_OVERRIDE_DEACTIVATED',
      success: true,
      details: {},
    });
    
    return true;
  }
  
  /**
   * Check if sovereign override is active
   */
  isSovereignOverrideActive(): boolean {
    return this.sovereignOverride.active;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIT LOG
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Log an audit entry
   */
  private log(entry: AuditEntry): void {
    this.auditLog.push(entry);
    
    // Keep log manageable
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-5000);
    }
  }
  
  /**
   * Get audit log (owner only)
   */
  getAuditLog(limit: number = 100): AuditEntry[] {
    if (!this.isAccessible()) return [];
    return this.auditLog.slice(-limit);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════
  
  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateHash(input: string): string {
    // Simple hash for demo - in production use proper cryptography
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// VAULT CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const VAULT_CONSTANTS = {
  LAYER: 'BACKEND',
  FREQUENCY: 417, // Backend layer frequency
  GLYPH: '☥',
  
  ACCESS_LEVELS: {
    OWNER: 'OWNER',
    SYSTEM: 'SYSTEM',
    RESTRICTED: 'RESTRICTED',
    DENIED: 'DENIED',
  },
  
  KEY_TYPES: {
    MASTER: 'MASTER',
    LAYER_BYPASS: 'LAYER_BYPASS',
    EMERGENCY: 'EMERGENCY',
    SESSION: 'SESSION',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  AccessControlVault,
  VAULT_CONSTANTS,
};
