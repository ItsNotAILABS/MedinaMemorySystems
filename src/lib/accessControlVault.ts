/**
 * MEDINA Access Control Vault
 *
 * Backend-only, owner-only secure storage with full audit trail. Every
 * operation — successful or not — is recorded in an immutable audit log,
 * providing complete forensic traceability for the organism's most sensitive
 * configuration and secret material.
 *
 * The vault enforces strict ownership: only the actor who stored a value may
 * retrieve or revoke it. Even failed access attempts are logged so that the
 * sovereign layer maintains total visibility over who touched what, and when.
 *
 * @module accessControlVault
 */

import { sovereignId } from './sovereign-id';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface VaultEntry {
  key: string;
  value: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export type VaultAction =
  | 'STORE'
  | 'RETRIEVE'
  | 'RETRIEVE_DENIED'
  | 'REVOKE'
  | 'REVOKE_DENIED'
  | 'LIST'
  | 'OWNERSHIP_CHECK';

export interface VaultAuditEntry {
  id: string;
  action: VaultAction;
  actor: string;
  key: string;
  success: boolean;
  timestamp: string;
  details: string;
}

export interface VaultKeyInfo {
  key: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── State ──────────────────────────────────────────────────────────────────

const vault: Map<string, VaultEntry> = new Map();
const auditLog: VaultAuditEntry[] = [];

// ─── Audit Helper ───────────────────────────────────────────────────────────

function recordAudit(
  action: VaultAction,
  actor: string,
  key: string,
  success: boolean,
  details: string,
): void {
  auditLog.push({
    id: sovereignId(),
    action,
    actor,
    key,
    success,
    timestamp: new Date().toISOString(),
    details,
  });
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Store a secret or config value in the vault. If the key already exists and
 * is owned by the same owner, the value is updated. If owned by a different
 * actor, the store is denied.
 */
export function vaultStore(
  key: string,
  value: string,
  ownerId: string,
): VaultEntry | null {
  const existing = vault.get(key);
  const now = new Date().toISOString();

  if (existing && existing.ownerId !== ownerId) {
    recordAudit('STORE', ownerId, key, false, 'Key exists under different owner.');
    return null;
  }

  const entry: VaultEntry = {
    key,
    value,
    ownerId,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  vault.set(key, entry);
  recordAudit(
    'STORE',
    ownerId,
    key,
    true,
    existing ? 'Value updated.' : 'New entry stored.',
  );
  return entry;
}

/**
 * Retrieve a vault entry. Only succeeds if the requesterId matches the
 * entry's ownerId. Failed attempts are logged.
 */
export function vaultRetrieve(
  key: string,
  requesterId: string,
): VaultEntry | null {
  const entry = vault.get(key);

  if (!entry) {
    recordAudit('RETRIEVE', requesterId, key, false, 'Key not found.');
    return null;
  }

  if (entry.ownerId !== requesterId) {
    recordAudit('RETRIEVE_DENIED', requesterId, key, false, 'Ownership mismatch.');
    return null;
  }

  recordAudit('RETRIEVE', requesterId, key, true, 'Value retrieved.');
  return entry;
}

/**
 * Returns recent audit entries. Every access attempt — successful or not —
 * appears in this log.
 */
export function vaultAuditLog(limit = 50): VaultAuditEntry[] {
  return auditLog.slice(-limit).reverse();
}

/**
 * Revoke (delete) a vault entry. Only the owner may revoke.
 */
export function vaultRevoke(
  key: string,
  ownerId: string,
): boolean {
  const entry = vault.get(key);

  if (!entry) {
    recordAudit('REVOKE', ownerId, key, false, 'Key not found.');
    return false;
  }

  if (entry.ownerId !== ownerId) {
    recordAudit('REVOKE_DENIED', ownerId, key, false, 'Ownership mismatch.');
    return false;
  }

  vault.delete(key);
  recordAudit('REVOKE', ownerId, key, true, 'Entry revoked.');
  return true;
}

/**
 * List all keys owned by this owner. Values are NOT returned for safety.
 */
export function vaultList(ownerId: string): VaultKeyInfo[] {
  recordAudit('LIST', ownerId, '*', true, 'Listed owned keys.');

  const results: VaultKeyInfo[] = [];
  for (const entry of vault.values()) {
    if (entry.ownerId === ownerId) {
      results.push({
        key: entry.key,
        ownerId: entry.ownerId,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      });
    }
  }
  return results;
}

/**
 * Check whether a given requester owns the specified key.
 */
export function isOwner(key: string, requesterId: string): boolean {
  const entry = vault.get(key);
  const owns = !!entry && entry.ownerId === requesterId;
  recordAudit(
    'OWNERSHIP_CHECK',
    requesterId,
    key,
    true,
    owns ? 'Requester is owner.' : 'Requester is not owner.',
  );
  return owns;
}
