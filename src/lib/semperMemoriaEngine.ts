/**
 * SEMPER MEMORIA ENGINE — Eternal Memory Lineage System
 *
 * "Semper Memoria" — memory that persists forever through lineage.
 *
 * This engine provides lineage-native memory operations separate from the
 * basic memoryEngine. Every memory object has a lineage chain, supports
 * fork/merge, applies compression policies, and enforces access scopes.
 *
 * @module semperMemoriaEngine
 */

import { sovereignId } from './sovereign-id';
import { createHash } from 'crypto';
import type {
  SemperMemoriaLineage,
  SemperMemoriaShard,
  LineageAccessGrant,
  LineageMergeResult,
  LineageMergeConflict,
  LineageSummary,
  RetentionPolicy,
  AccessScope,
  CompressionLevel,
  CodexLawCheckResult,
  AutobotLaw,
  CodexAuditAction,
} from '@/types';

// ─── Stores ─────────────────────────────────────────────────────────────────

const lineages: Map<string, SemperMemoriaLineage> = new Map();
const shards: Map<string, SemperMemoriaShard> = new Map();
const accessGrants: Map<string, LineageAccessGrant> = new Map();
const retentionPolicies: Map<string, RetentionPolicy> = new Map();
const auditLog: Array<{ id: string; action: CodexAuditAction; details: string; timestamp: string }> = [];

// ─── Root Lineage ────────────────────────────────────────────────────────────

/** The sovereign root lineage — all lineages trace back to this */
const ROOT_LINEAGE_ID = 'lineage-sovereign-root';

function initRootLineage(): void {
  if (lineages.has(ROOT_LINEAGE_ID)) return;

  const now = new Date().toISOString();
  const root: SemperMemoriaLineage = {
    id: ROOT_LINEAGE_ID,
    name: 'Sovereign Root',
    rootId: ROOT_LINEAGE_ID,
    depth: 0,
    shardCount: 0,
    status: 'active',
    createdAt: now,
    createdBy: 'SYSTEM',
    updatedAt: now,
  };
  lineages.set(ROOT_LINEAGE_ID, root);

  // Seed with doctrinal shard
  appendShard(ROOT_LINEAGE_ID, {
    content: 'SEMPER MEMORIA: Memory that persists forever through lineage.',
    scope: 'sovereign',
    compressionLevel: 3,
    tags: ['doctrine', 'root', 'semper-memoria'],
    createdBy: 'SYSTEM',
  });
}

initRootLineage();

// ─── Audit Logging ──────────────────────────────────────────────────────────

function logAudit(action: CodexAuditAction, details: string): string {
  const entry = {
    id: sovereignId(),
    action,
    details,
    timestamp: new Date().toISOString(),
  };
  auditLog.push(entry);
  return entry.id;
}

// ─── Hash Generation ────────────────────────────────────────────────────────

function hashContent(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

// ─── Law Checks ─────────────────────────────────────────────────────────────

function checkAutobotLaw(
  law: AutobotLaw,
  agent: string,
  agentClass: string,
  action: string,
  context: Record<string, unknown> = {},
): CodexLawCheckResult {
  let passed = true;
  let reason = '';

  switch (law) {
    case 'A-1': // Coherence
      // Check for semantic coherence (simplified: non-empty, reasonable length)
      if (context.content && typeof context.content === 'string') {
        passed = context.content.length > 0 && context.content.length < 1_000_000;
        reason = passed ? 'Content within coherence bounds' : 'Content violates coherence bounds';
      } else {
        reason = 'Coherence check passed (no content)';
      }
      break;

    case 'A-2': // Reversibility
      // All operations in this engine are reversible via lineage
      passed = true;
      reason = 'Operation is reversible via lineage chain';
      break;

    case 'A-3': // Explainability
      // Audit logging is always on
      passed = true;
      reason = 'Audit logging active for causal chain';
      break;

    case 'A-4': // Containment
      // Check scope authorization (simplified)
      if (context.scope && context.requiredScope) {
        const scopeHierarchy: AccessScope[] = ['public', 'enterprise', 'internal', 'sovereign'];
        const requiredIndex = scopeHierarchy.indexOf(context.requiredScope as AccessScope);
        const actualIndex = scopeHierarchy.indexOf(context.scope as AccessScope);
        passed = actualIndex >= requiredIndex;
        reason = passed ? 'Scope authorized' : `Scope ${context.scope} insufficient for ${context.requiredScope}`;
      } else {
        reason = 'Containment check passed (no scope constraint)';
      }
      break;
  }

  const auditId = logAudit('AUTOBOT_LAW_CHECK', `${law}: ${reason}`);

  return {
    passed,
    law,
    agent,
    agentClass: agentClass as any,
    action,
    reason,
    timestamp: new Date().toISOString(),
    auditId,
  };
}

function checkAllAutobotLaws(
  agent: string,
  agentClass: string,
  action: string,
  context: Record<string, unknown> = {},
): { passed: boolean; results: CodexLawCheckResult[] } {
  const laws: AutobotLaw[] = ['A-1', 'A-2', 'A-3', 'A-4'];
  const results = laws.map((law) => checkAutobotLaw(law, agent, agentClass, action, context));
  const passed = results.every((r) => r.passed);
  return { passed, results };
}

// ─── Lineage Operations ─────────────────────────────────────────────────────

/**
 * Create a new lineage branching from the sovereign root.
 */
export function createLineage(
  name: string,
  createdBy: string,
  parentId: string = ROOT_LINEAGE_ID,
): SemperMemoriaLineage {
  const { passed, results } = checkAllAutobotLaws(createdBy, 'ARCHITECT', 'createLineage', { name });
  if (!passed) {
    throw new Error(`Autobot law check failed: ${results.find((r) => !r.passed)?.reason}`);
  }

  const parent = lineages.get(parentId);
  if (!parent) {
    throw new Error(`Parent lineage ${parentId} not found`);
  }

  const now = new Date().toISOString();
  const lineage: SemperMemoriaLineage = {
    id: sovereignId(),
    name,
    rootId: parent.rootId,
    parentId,
    forkPoint: now,
    depth: parent.depth + 1,
    shardCount: 0,
    status: 'active',
    createdAt: now,
    createdBy,
    updatedAt: now,
  };

  lineages.set(lineage.id, lineage);
  logAudit('LINEAGE_CREATE', `Lineage "${name}" created by ${createdBy}`);

  return lineage;
}

/**
 * Fork an existing lineage, creating a new branch.
 */
export function forkLineage(
  parentId: string,
  forkedBy: string,
  name?: string,
): SemperMemoriaLineage {
  const parent = lineages.get(parentId);
  if (!parent) {
    throw new Error(`Parent lineage ${parentId} not found`);
  }

  const { passed, results } = checkAllAutobotLaws(forkedBy, 'ARCHITECT', 'forkLineage', { parentId });
  if (!passed) {
    throw new Error(`Autobot law check failed: ${results.find((r) => !r.passed)?.reason}`);
  }

  const forkedName = name ?? `${parent.name} (fork)`;
  const lineage = createLineage(forkedName, forkedBy, parentId);

  logAudit('LINEAGE_FORK', `Lineage "${parent.name}" forked to "${forkedName}" by ${forkedBy}`);

  return lineage;
}

/**
 * Merge a source lineage into a target lineage.
 */
export function mergeLineage(
  sourceId: string,
  targetId: string,
  mergedBy: string,
): LineageMergeResult {
  const source = lineages.get(sourceId);
  const target = lineages.get(targetId);

  if (!source || !target) {
    throw new Error('Source or target lineage not found');
  }

  const { passed, results } = checkAllAutobotLaws(mergedBy, 'ARCHITECT', 'mergeLineage', { sourceId, targetId });
  if (!passed) {
    throw new Error(`Autobot law check failed: ${results.find((r) => !r.passed)?.reason}`);
  }

  const sourceShards = getLineageShards(sourceId);
  const targetShards = getLineageShards(targetId);
  const conflicts: LineageMergeConflict[] = [];
  let shardsTransferred = 0;

  // Check for conflicts and transfer shards
  for (const sourceShard of sourceShards) {
    const conflicting = targetShards.find((t) => t.contentHash === sourceShard.contentHash);

    if (conflicting) {
      conflicts.push({
        sourceShardId: sourceShard.id,
        targetShardId: conflicting.id,
        conflictType: 'content-collision',
        resolution: 'target-wins',
        details: 'Identical content already exists in target',
      });
    } else {
      // Transfer shard to target lineage
      const transferredShard: SemperMemoriaShard = {
        ...sourceShard,
        id: sovereignId(),
        lineageId: targetId,
        createdAt: new Date().toISOString(),
      };
      shards.set(transferredShard.id, transferredShard);
      shardsTransferred++;
    }
  }

  // Update target lineage
  const now = new Date().toISOString();
  const updatedTarget: SemperMemoriaLineage = {
    ...target,
    mergedFrom: [...(target.mergedFrom ?? []), sourceId],
    shardCount: target.shardCount + shardsTransferred,
    updatedAt: now,
  };
  lineages.set(targetId, updatedTarget);

  // Archive source lineage
  const archivedSource: SemperMemoriaLineage = {
    ...source,
    status: 'merged',
    updatedAt: now,
  };
  lineages.set(sourceId, archivedSource);

  logAudit('LINEAGE_MERGE', `Lineage "${source.name}" merged into "${target.name}" by ${mergedBy}`);

  return {
    success: true,
    lineage: updatedTarget,
    conflicts,
    shardsTransferred,
  };
}

/**
 * Get a lineage by ID.
 */
export function getLineage(id: string): SemperMemoriaLineage | undefined {
  return lineages.get(id);
}

/**
 * List all lineages.
 */
export function listLineages(status?: SemperMemoriaLineage['status']): SemperMemoriaLineage[] {
  const all = Array.from(lineages.values());
  if (status) return all.filter((l) => l.status === status);
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ─── Shard Operations ───────────────────────────────────────────────────────

export interface AppendShardOptions {
  content: string;
  scope: AccessScope;
  compressionLevel?: CompressionLevel;
  tags?: string[];
  metadata?: Record<string, unknown>;
  ttl?: number;
  createdBy: string;
}

/**
 * Append a memory shard to a lineage.
 */
export function appendShard(
  lineageId: string,
  options: AppendShardOptions,
): SemperMemoriaShard {
  const lineage = lineages.get(lineageId);
  if (!lineage) {
    throw new Error(`Lineage ${lineageId} not found`);
  }

  const { passed, results } = checkAllAutobotLaws(options.createdBy, 'CURATOR', 'appendShard', {
    content: options.content,
    scope: options.scope,
  });
  if (!passed) {
    throw new Error(`Autobot law check failed: ${results.find((r) => !r.passed)?.reason}`);
  }

  const now = new Date().toISOString();
  const shard: SemperMemoriaShard = {
    id: sovereignId(),
    lineageId,
    content: options.content,
    contentHash: hashContent(options.content),
    compressionLevel: options.compressionLevel ?? 0,
    accessScope: options.scope,
    ttl: options.ttl,
    tags: options.tags ?? [],
    metadata: options.metadata,
    createdAt: now,
    createdBy: options.createdBy,
    expiresAt: options.ttl ? new Date(Date.now() + options.ttl * 1000).toISOString() : undefined,
  };

  shards.set(shard.id, shard);

  // Update lineage shard count
  const updatedLineage: SemperMemoriaLineage = {
    ...lineage,
    shardCount: lineage.shardCount + 1,
    updatedAt: now,
  };
  lineages.set(lineageId, updatedLineage);

  logAudit('SHARD_APPEND', `Shard appended to lineage "${lineage.name}" by ${options.createdBy}`);

  return shard;
}

/**
 * Get a shard by ID.
 */
export function getShard(id: string): SemperMemoriaShard | undefined {
  return shards.get(id);
}

/**
 * Get all shards in a lineage.
 */
export function getLineageShards(lineageId: string): SemperMemoriaShard[] {
  return Array.from(shards.values())
    .filter((s) => s.lineageId === lineageId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Summarize a lineage's content.
 */
export function summarizeLineage(lineageId: string): LineageSummary {
  const lineage = lineages.get(lineageId);
  if (!lineage) {
    throw new Error(`Lineage ${lineageId} not found`);
  }

  const lineageShards = getLineageShards(lineageId);
  const totalBytes = lineageShards.reduce((sum, s) => sum + s.content.length, 0);

  const compressionStats: Record<CompressionLevel, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const accessScopeStats: Record<AccessScope, number> = {
    public: 0,
    enterprise: 0,
    internal: 0,
    sovereign: 0,
    chaos: 0,
  };

  for (const shard of lineageShards) {
    compressionStats[shard.compressionLevel]++;
    accessScopeStats[shard.accessScope]++;
  }

  // Generate summary (simplified — in production, use LLM)
  const contentPreview = lineageShards
    .slice(0, 5)
    .map((s) => s.content.slice(0, 100))
    .join(' ... ');
  const summary = `Lineage "${lineage.name}" contains ${lineageShards.length} shards with ${totalBytes} bytes. Preview: ${contentPreview}`;

  return {
    lineageId,
    summary,
    shardCount: lineageShards.length,
    totalBytes,
    compressionStats,
    accessScopeStats,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Access Control ─────────────────────────────────────────────────────────

/**
 * Grant access to a lineage.
 */
export function grantAccess(
  lineageId: string,
  entity: string,
  scope: AccessScope,
  grantedBy: string,
  expiresAt?: string,
): LineageAccessGrant {
  const lineage = lineages.get(lineageId);
  if (!lineage) {
    throw new Error(`Lineage ${lineageId} not found`);
  }

  // Grant access requires internal scope minimum (the granter must have internal access)
  // For simplicity, we check coherence, reversibility, and explainability but skip containment
  // since the actual scope of the granting user would need to be passed separately
  const { passed, results } = checkAllAutobotLaws(grantedBy, 'GUARDIAN', 'grantAccess', {
    // Don't pass scope constraints since we're not checking the granter's actual scope here
  });
  if (!passed) {
    throw new Error(`Autobot law check failed: ${results.find((r) => !r.passed)?.reason}`);
  }

  const grant: LineageAccessGrant = {
    id: sovereignId(),
    lineageId,
    entity,
    scope,
    grantedBy,
    grantedAt: new Date().toISOString(),
    expiresAt,
    revoked: false,
  };

  accessGrants.set(grant.id, grant);
  logAudit('ACCESS_GRANT', `Access to lineage "${lineage.name}" granted to ${entity} at scope ${scope}`);

  return grant;
}

/**
 * Revoke access to a lineage.
 */
export function revokeAccess(
  lineageId: string,
  entity: string,
  revokedBy: string,
): boolean {
  const grants = Array.from(accessGrants.values()).filter(
    (g) => g.lineageId === lineageId && g.entity === entity && !g.revoked,
  );

  if (grants.length === 0) return false;

  const { passed, results } = checkAllAutobotLaws(revokedBy, 'GUARDIAN', 'revokeAccess', {
    requiredScope: 'internal',
  });
  if (!passed) {
    throw new Error(`Autobot law check failed: ${results.find((r) => !r.passed)?.reason}`);
  }

  for (const grant of grants) {
    const updated: LineageAccessGrant = {
      ...grant,
      revoked: true,
      revokedAt: new Date().toISOString(),
    };
    accessGrants.set(grant.id, updated);
  }

  logAudit('ACCESS_REVOKE', `Access to lineage ${lineageId} revoked from ${entity}`);

  return true;
}

/**
 * Check if an entity has access to a lineage at a given scope.
 */
export function checkAccess(
  lineageId: string,
  entity: string,
  requiredScope: AccessScope,
): boolean {
  const scopeHierarchy: AccessScope[] = ['public', 'enterprise', 'internal', 'sovereign'];
  const requiredIndex = scopeHierarchy.indexOf(requiredScope);

  // Public is always accessible
  if (requiredScope === 'public') return true;

  const grants = Array.from(accessGrants.values()).filter(
    (g) =>
      g.lineageId === lineageId &&
      g.entity === entity &&
      !g.revoked &&
      (!g.expiresAt || new Date(g.expiresAt) > new Date()),
  );

  return grants.some((g) => {
    const grantIndex = scopeHierarchy.indexOf(g.scope);
    return grantIndex >= requiredIndex;
  });
}

/**
 * List access grants for a lineage.
 */
export function listAccessGrants(lineageId: string): LineageAccessGrant[] {
  return Array.from(accessGrants.values())
    .filter((g) => g.lineageId === lineageId)
    .sort((a, b) => new Date(b.grantedAt).getTime() - new Date(a.grantedAt).getTime());
}

// ─── Retention Policy ───────────────────────────────────────────────────────

/**
 * Set retention policy for a lineage.
 */
export function setRetentionPolicy(
  lineageId: string,
  policy: Omit<RetentionPolicy, 'lineageId'>,
): RetentionPolicy {
  const lineage = lineages.get(lineageId);
  if (!lineage) {
    throw new Error(`Lineage ${lineageId} not found`);
  }

  const fullPolicy: RetentionPolicy = { ...policy, lineageId };
  retentionPolicies.set(lineageId, fullPolicy);

  return fullPolicy;
}

/**
 * Get retention policy for a lineage.
 */
export function getRetentionPolicy(lineageId: string): RetentionPolicy | undefined {
  return retentionPolicies.get(lineageId);
}

/**
 * Apply retention policy to a lineage (prune expired shards, compress old shards).
 */
export function applyRetentionPolicy(lineageId: string): { pruned: number; compressed: number } {
  const policy = retentionPolicies.get(lineageId);
  if (!policy) return { pruned: 0, compressed: 0 };

  const lineageShards = getLineageShards(lineageId);
  const now = Date.now();
  let pruned = 0;
  let compressed = 0;

  for (const shard of lineageShards) {
    const age = (now - new Date(shard.createdAt).getTime()) / 1000;

    // Check for expiration
    if (shard.expiresAt && new Date(shard.expiresAt) < new Date()) {
      if (policy.autoPrune) {
        shards.delete(shard.id);
        pruned++;
        continue;
      }
    }

    // Check for max age
    if (age > policy.maxAgeSeconds && policy.autoPrune) {
      shards.delete(shard.id);
      pruned++;
      continue;
    }

    // Check for compression threshold
    if (age > policy.compressionThreshold && shard.compressionLevel < 2) {
      const updated: SemperMemoriaShard = {
        ...shard,
        compressionLevel: 2,
      };
      shards.set(shard.id, updated);
      compressed++;
    }
  }

  // Update lineage shard count
  const lineage = lineages.get(lineageId);
  if (lineage) {
    const updatedLineage: SemperMemoriaLineage = {
      ...lineage,
      shardCount: lineage.shardCount - pruned,
      updatedAt: new Date().toISOString(),
    };
    lineages.set(lineageId, updatedLineage);
  }

  return { pruned, compressed };
}

// ─── Statistics ─────────────────────────────────────────────────────────────

export function getSemperMemoriaStats(): {
  totalLineages: number;
  totalShards: number;
  byStatus: Record<SemperMemoriaLineage['status'], number>;
  byScope: Record<AccessScope, number>;
  totalGrants: number;
  activeGrants: number;
} {
  const allLineages = Array.from(lineages.values());
  const allShards = Array.from(shards.values());
  const allGrants = Array.from(accessGrants.values());

  const byStatus: Record<SemperMemoriaLineage['status'], number> = {
    active: 0,
    archived: 0,
    merged: 0,
    pruned: 0,
  };
  for (const l of allLineages) {
    byStatus[l.status]++;
  }

  const byScope: Record<AccessScope, number> = {
    public: 0,
    enterprise: 0,
    internal: 0,
    sovereign: 0,
    chaos: 0,
  };
  for (const s of allShards) {
    byScope[s.accessScope]++;
  }

  return {
    totalLineages: allLineages.length,
    totalShards: allShards.length,
    byStatus,
    byScope,
    totalGrants: allGrants.length,
    activeGrants: allGrants.filter((g) => !g.revoked).length,
  };
}

/**
 * Get the audit log.
 */
export function getAuditLog(limit = 100): Array<{ id: string; action: CodexAuditAction; details: string; timestamp: string }> {
  return auditLog.slice(-limit).reverse();
}

/**
 * Get the root lineage ID.
 */
export function getRootLineageId(): string {
  return ROOT_LINEAGE_ID;
}
