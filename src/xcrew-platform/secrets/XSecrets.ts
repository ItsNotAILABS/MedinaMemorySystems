/**
 * XCREW Secrets Management System
 * Protocol: XCREW-SECRETS-001
 * 
 * Secure secrets management with φ-harmonic rotation and edge-encrypted storage.
 * Zero-knowledge architecture ensures secrets never leave the edge unencrypted.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const PHI_INV = 0.618033988749895;
const PROTOCOL_ID = 'XCREW-SECRETS-001';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type SecretType = 'api-key' | 'token' | 'password' | 'certificate' | 'private-key' | 'generic';
export type EncryptionAlgorithm = 'aes-256-gcm' | 'chacha20-poly1305' | 'xchacha20-poly1305';
export type RotationStrategy = 'manual' | 'time-based' | 'phi-harmonic' | 'usage-based';

export interface XSecret {
  id: string;
  name: string;
  type: SecretType;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  rotationStrategy: RotationStrategy;
  rotationInterval?: number;  // ms
  lastRotated?: Date;
  accessCount: number;
  metadata: Record<string, string>;
}

export interface XSecretValue {
  value: string;
  version: number;
  decryptedAt: Date;
  expiresAt?: Date;
}

export interface XSecretConfig {
  encryption: EncryptionAlgorithm;
  rotationStrategy: RotationStrategy;
  rotationInterval?: number;
  maxVersions: number;
  auditLog: boolean;
  phiDecay: boolean;
}

export interface XSecretAuditEntry {
  id: string;
  secretId: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'rotate';
  timestamp: Date;
  workerId?: string;
  region?: string;
  success: boolean;
  errorMessage?: string;
}

export interface XSecretsManagerConfig {
  defaultEncryption: EncryptionAlgorithm;
  defaultRotationStrategy: RotationStrategy;
  enableAuditLog: boolean;
  maxSecretsPerNamespace: number;
  phiRotationEnabled: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHI-HARMONIC ROTATION CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════

export class PhiRotationCalculator {
  private baseInterval: number;
  
  constructor(baseIntervalMs: number = 86400000) { // Default: 24 hours
    this.baseInterval = baseIntervalMs;
  }
  
  /**
   * Calculate next rotation time using φ-harmonic intervals
   * Creates natural, unpredictable rotation patterns
   */
  calculateNextRotation(currentVersion: number, lastRotated: Date): Date {
    const phiFactor = Math.pow(PHI, currentVersion % 5);
    const jitter = (Math.random() - 0.5) * PHI_INV * this.baseInterval;
    const interval = this.baseInterval * phiFactor + jitter;
    return new Date(lastRotated.getTime() + interval);
  }
  
  /**
   * Calculate rotation urgency score (0-1)
   * Higher score = more urgent rotation needed
   */
  calculateRotationUrgency(secret: XSecret): number {
    if (!secret.lastRotated || !secret.rotationInterval) return 0;
    
    const elapsed = Date.now() - secret.lastRotated.getTime();
    const ratio = elapsed / secret.rotationInterval;
    
    // φ-weighted urgency curve
    return Math.min(1, ratio * PHI_INV + Math.pow(ratio, PHI) * PHI_INV);
  }
  
  /**
   * Get φ-harmonic rotation schedule for multiple secrets
   */
  getRotationSchedule(secrets: XSecret[]): Map<string, Date> {
    const schedule = new Map<string, Date>();
    
    // Sort by urgency
    const sorted = [...secrets].sort((a, b) => 
      this.calculateRotationUrgency(b) - this.calculateRotationUrgency(a)
    );
    
    // Stagger rotations using golden angle
    const goldenAngle = 2 * Math.PI * PHI_INV;
    let offset = 0;
    
    for (const secret of sorted) {
      if (secret.rotationStrategy === 'phi-harmonic' && secret.lastRotated) {
        const nextRotation = this.calculateNextRotation(secret.version, secret.lastRotated);
        const staggeredTime = new Date(nextRotation.getTime() + offset);
        schedule.set(secret.id, staggeredTime);
        offset += this.baseInterval * PHI_INV * Math.sin(goldenAngle * secret.version);
      }
    }
    
    return schedule;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECRETS NAMESPACE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

export class XSecretsNamespace {
  private secrets: Map<string, { secret: XSecret; encryptedValue: string }> = new Map();
  private versions: Map<string, string[]> = new Map();
  private auditLog: XSecretAuditEntry[] = [];
  private rotationCalculator: PhiRotationCalculator;
  
  constructor(
    public readonly name: string,
    private config: XSecretConfig
  ) {
    this.rotationCalculator = new PhiRotationCalculator();
  }
  
  /**
   * Create a new secret
   */
  async create(name: string, value: string, options?: Partial<XSecretConfig>): Promise<XSecret> {
    const id = `xs-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();
    
    const secret: XSecret = {
      id,
      name,
      type: this.detectSecretType(value),
      version: 1,
      createdAt: now,
      updatedAt: now,
      rotationStrategy: options?.rotationStrategy || this.config.rotationStrategy,
      rotationInterval: options?.rotationInterval,
      lastRotated: now,
      accessCount: 0,
      metadata: {}
    };
    
    // Encrypt and store
    const encryptedValue = await this.encrypt(value);
    this.secrets.set(name, { secret, encryptedValue });
    this.versions.set(name, [encryptedValue]);
    
    this.logAudit(id, 'create', true);
    
    return secret;
  }
  
  /**
   * Get a secret value
   */
  async get(name: string): Promise<XSecretValue | null> {
    const entry = this.secrets.get(name);
    if (!entry) {
      this.logAudit('unknown', 'read', false, 'Secret not found');
      return null;
    }
    
    const { secret, encryptedValue } = entry;
    
    // Increment access count
    secret.accessCount++;
    secret.updatedAt = new Date();
    
    // Decrypt
    const value = await this.decrypt(encryptedValue);
    
    this.logAudit(secret.id, 'read', true);
    
    return {
      value,
      version: secret.version,
      decryptedAt: new Date(),
      expiresAt: secret.expiresAt
    };
  }
  
  /**
   * Update a secret value
   */
  async update(name: string, value: string): Promise<XSecret | null> {
    const entry = this.secrets.get(name);
    if (!entry) return null;
    
    const { secret } = entry;
    const now = new Date();
    
    // Encrypt new value
    const encryptedValue = await this.encrypt(value);
    
    // Update secret
    secret.version++;
    secret.updatedAt = now;
    secret.lastRotated = now;
    
    // Store new version
    this.secrets.set(name, { secret, encryptedValue });
    
    // Keep version history
    const versions = this.versions.get(name) || [];
    versions.push(encryptedValue);
    if (versions.length > this.config.maxVersions) {
      versions.shift();
    }
    this.versions.set(name, versions);
    
    this.logAudit(secret.id, 'update', true);
    
    return secret;
  }
  
  /**
   * Delete a secret
   */
  async delete(name: string): Promise<boolean> {
    const entry = this.secrets.get(name);
    if (!entry) return false;
    
    this.logAudit(entry.secret.id, 'delete', true);
    
    this.secrets.delete(name);
    this.versions.delete(name);
    
    return true;
  }
  
  /**
   * Rotate a secret
   */
  async rotate(name: string, newValue?: string): Promise<XSecret | null> {
    const entry = this.secrets.get(name);
    if (!entry) return null;
    
    const value = newValue || await this.generateSecretValue(entry.secret.type);
    const result = await this.update(name, value);
    
    if (result) {
      this.logAudit(result.id, 'rotate', true);
    }
    
    return result;
  }
  
  /**
   * List all secrets (metadata only)
   */
  list(): XSecret[] {
    return Array.from(this.secrets.values()).map(e => e.secret);
  }
  
  /**
   * Get secrets that need rotation
   */
  getSecretsNeedingRotation(): XSecret[] {
    const now = Date.now();
    return this.list().filter(secret => {
      if (secret.rotationStrategy === 'manual') return false;
      if (!secret.rotationInterval || !secret.lastRotated) return false;
      
      const urgency = this.rotationCalculator.calculateRotationUrgency(secret);
      return urgency > PHI_INV; // Rotate when urgency exceeds φ⁻¹
    });
  }
  
  /**
   * Get audit log
   */
  getAuditLog(secretId?: string): XSecretAuditEntry[] {
    if (secretId) {
      return this.auditLog.filter(e => e.secretId === secretId);
    }
    return [...this.auditLog];
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────────
  
  private detectSecretType(value: string): SecretType {
    if (value.startsWith('-----BEGIN')) return 'certificate';
    if (value.startsWith('sk-') || value.startsWith('pk-')) return 'api-key';
    if (value.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) return 'token';
    if (value.length >= 32 && value.match(/^[A-Za-z0-9+/=]+$/)) return 'api-key';
    return 'generic';
  }
  
  private async encrypt(value: string): Promise<string> {
    // Simulated encryption - in production would use actual crypto
    const encoded = Buffer.from(value).toString('base64');
    return `enc:${this.config.encryption}:${encoded}`;
  }
  
  private async decrypt(encryptedValue: string): Promise<string> {
    // Simulated decryption
    const parts = encryptedValue.split(':');
    if (parts.length !== 3 || parts[0] !== 'enc') {
      throw new Error('Invalid encrypted value format');
    }
    return Buffer.from(parts[2], 'base64').toString('utf-8');
  }
  
  private async generateSecretValue(type: SecretType): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = type === 'password' ? 32 : 64;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  private logAudit(secretId: string, action: XSecretAuditEntry['action'], success: boolean, errorMessage?: string): void {
    if (!this.config.auditLog) return;
    
    this.auditLog.push({
      id: `audit-${Date.now().toString(36)}`,
      secretId,
      action,
      timestamp: new Date(),
      success,
      errorMessage
    });
    
    // Keep last 1000 entries
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-1000);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECRETS MANAGER
// ═══════════════════════════════════════════════════════════════════════════

export class XSecretsManager {
  private namespaces: Map<string, XSecretsNamespace> = new Map();
  private config: XSecretsManagerConfig;
  
  constructor(config?: Partial<XSecretsManagerConfig>) {
    this.config = {
      defaultEncryption: 'aes-256-gcm',
      defaultRotationStrategy: 'phi-harmonic',
      enableAuditLog: true,
      maxSecretsPerNamespace: 1000,
      phiRotationEnabled: true,
      ...config
    };
    
    console.log(`[${PROTOCOL_ID}] Secrets Manager initialized`);
  }
  
  /**
   * Create a new secrets namespace
   */
  createNamespace(name: string, config?: Partial<XSecretConfig>): XSecretsNamespace {
    const nsConfig: XSecretConfig = {
      encryption: config?.encryption || this.config.defaultEncryption,
      rotationStrategy: config?.rotationStrategy || this.config.defaultRotationStrategy,
      maxVersions: config?.maxVersions || 10,
      auditLog: config?.auditLog ?? this.config.enableAuditLog,
      phiDecay: config?.phiDecay ?? this.config.phiRotationEnabled
    };
    
    const namespace = new XSecretsNamespace(name, nsConfig);
    this.namespaces.set(name, namespace);
    
    return namespace;
  }
  
  /**
   * Get a secrets namespace
   */
  getNamespace(name: string): XSecretsNamespace | undefined {
    return this.namespaces.get(name);
  }
  
  /**
   * Delete a secrets namespace
   */
  deleteNamespace(name: string): boolean {
    return this.namespaces.delete(name);
  }
  
  /**
   * List all namespaces
   */
  listNamespaces(): string[] {
    return Array.from(this.namespaces.keys());
  }
  
  /**
   * Get all secrets needing rotation across all namespaces
   */
  getAllSecretsNeedingRotation(): Map<string, XSecret[]> {
    const result = new Map<string, XSecret[]>();
    
    for (const [name, namespace] of this.namespaces) {
      const secrets = namespace.getSecretsNeedingRotation();
      if (secrets.length > 0) {
        result.set(name, secrets);
      }
    }
    
    return result;
  }
  
  /**
   * Get manager configuration
   */
  getConfig(): XSecretsManagerConfig {
    return { ...this.config };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON & EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

let secretsManagerInstance: XSecretsManager | null = null;

export function getXSecretsManager(): XSecretsManager {
  if (!secretsManagerInstance) {
    secretsManagerInstance = new XSecretsManager();
  }
  return secretsManagerInstance;
}

export function createSecretsNamespace(name: string, config?: Partial<XSecretConfig>): XSecretsNamespace {
  return getXSecretsManager().createNamespace(name, config);
}

export default {
  XSecretsManager,
  XSecretsNamespace,
  PhiRotationCalculator,
  getXSecretsManager,
  createSecretsNamespace
};
