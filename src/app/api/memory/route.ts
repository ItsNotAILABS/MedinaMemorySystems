import { NextRequest, NextResponse } from 'next/server';
import {
  queryMemory,
  storeMemory,
  getMemory,
  updateMemory,
  deleteMemory,
  pinMemory,
  unpinMemory,
  listMemories,
  getMemoryStats,
  getPinnedMemories,
  getMemoryLineage,
  getRootMemory,
} from '@/lib/memoryEngine';
import { dualRead } from '@/lib/dualRead';
import { omniRead } from '@/lib/omniRead';
import {
  createLineage,
  forkLineage,
  mergeLineage,
  getLineage,
  listLineages,
  appendShard,
  getShard,
  getLineageShards,
  summarizeLineage,
  grantAccess,
  revokeAccess,
  checkAccess,
  listAccessGrants,
  setRetentionPolicy,
  getRetentionPolicy,
  applyRetentionPolicy,
  getSemperMemoriaStats,
  getAuditLog as getSemperMemoriaAuditLog,
  getRootLineageId,
} from '@/lib/semperMemoriaEngine';
import type { ApiResponse, AccessScope, CompressionLevel } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'list';
  const id = searchParams.get('id');
  const query = searchParams.get('query') ?? '';
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);

  try {
    switch (action) {
      // ─── Legacy Memory Actions ─────────────────────────────────────────────
      case 'list': {
        const entries = listMemories(limit);
        return json({ success: true, data: entries, timestamp: now() });
      }
      case 'get': {
        if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        const entry = getMemory(id);
        if (!entry) return json({ success: false, error: 'Not found', timestamp: now() }, 404);
        return json({ success: true, data: entry, timestamp: now() });
      }
      case 'search': {
        const result = queryMemory({ query, limit });
        return json({ success: true, data: result, timestamp: now() });
      }
      case 'pinned': {
        const entries = getPinnedMemories();
        return json({ success: true, data: entries, timestamp: now() });
      }
      case 'stats': {
        const stats = getMemoryStats();
        return json({ success: true, data: stats, timestamp: now() });
      }
      case 'lineage': {
        if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        const entries = getMemoryLineage(id);
        return json({ success: true, data: entries, timestamp: now() });
      }
      case 'root': {
        const root = getRootMemory();
        return json({ success: true, data: root ?? null, timestamp: now() });
      }
      case 'dual': {
        const result = dualRead(query, limit);
        return json({ success: true, data: result, timestamp: now() });
      }
      case 'omni': {
        const result = omniRead(query, limit);
        return json({ success: true, data: result, timestamp: now() });
      }

      // ─── Semper Memoria Actions ────────────────────────────────────────────
      case 'semper.stats': {
        const stats = getSemperMemoriaStats();
        return json({ success: true, data: stats, timestamp: now() });
      }
      case 'semper.audit': {
        const log = getSemperMemoriaAuditLog(limit);
        return json({ success: true, data: log, timestamp: now() });
      }
      case 'semper.root': {
        const rootId = getRootLineageId();
        const root = getLineage(rootId);
        return json({ success: true, data: { rootId, lineage: root }, timestamp: now() });
      }

      // Lineage read actions
      case 'lineage.get': {
        if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        const lineage = getLineage(id);
        if (!lineage) return json({ success: false, error: 'Lineage not found', timestamp: now() }, 404);
        return json({ success: true, data: lineage, timestamp: now() });
      }
      case 'lineage.list': {
        const status = searchParams.get('status') as any;
        const lineages = listLineages(status);
        return json({ success: true, data: lineages, timestamp: now() });
      }
      case 'lineage.shards': {
        if (!id) return json({ success: false, error: 'Lineage ID required', timestamp: now() }, 400);
        const shards = getLineageShards(id);
        return json({ success: true, data: shards, timestamp: now() });
      }
      case 'lineage.summary': {
        if (!id) return json({ success: false, error: 'Lineage ID required', timestamp: now() }, 400);
        const summary = summarizeLineage(id);
        return json({ success: true, data: summary, timestamp: now() });
      }

      // Shard read actions
      case 'shard.get': {
        if (!id) return json({ success: false, error: 'Shard ID required', timestamp: now() }, 400);
        const shard = getShard(id);
        if (!shard) return json({ success: false, error: 'Shard not found', timestamp: now() }, 404);
        return json({ success: true, data: shard, timestamp: now() });
      }

      // Access control read actions
      case 'access.list': {
        if (!id) return json({ success: false, error: 'Lineage ID required', timestamp: now() }, 400);
        const grants = listAccessGrants(id);
        return json({ success: true, data: grants, timestamp: now() });
      }
      case 'access.check': {
        const lineageId = searchParams.get('lineageId');
        const entity = searchParams.get('entity');
        const scope = searchParams.get('scope') as AccessScope;
        if (!lineageId || !entity || !scope) {
          return json({ success: false, error: 'lineageId, entity, and scope required', timestamp: now() }, 400);
        }
        const hasAccess = checkAccess(lineageId, entity, scope);
        return json({ success: true, data: { hasAccess }, timestamp: now() });
      }

      // Retention policy read
      case 'retention.get': {
        if (!id) return json({ success: false, error: 'Lineage ID required', timestamp: now() }, 400);
        const policy = getRetentionPolicy(id);
        return json({ success: true, data: policy ?? null, timestamp: now() });
      }

      default:
        return json({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      action?: string;
      // Legacy memory fields
      content?: string;
      type?: string;
      tags?: string[];
      coordinates?: Record<string, number>;
      parentId?: string;
      // Semper Memoria fields
      name?: string;
      lineageId?: string;
      sourceId?: string;
      targetId?: string;
      createdBy?: string;
      scope?: AccessScope;
      compressionLevel?: CompressionLevel;
      ttl?: number;
      metadata?: Record<string, unknown>;
      entity?: string;
      grantedBy?: string;
      expiresAt?: string;
      revokedBy?: string;
      maxShards?: number;
      maxAgeSeconds?: number;
      compressionThreshold?: number;
      autoArchive?: boolean;
      autoPrune?: boolean;
    };

    // ─── Semper Memoria Actions ──────────────────────────────────────────────
    switch (body.action) {
      // Lineage operations
      case 'lineage.create': {
        if (!body.name || !body.createdBy) {
          return json({ success: false, error: 'name and createdBy required', timestamp: now() }, 400);
        }
        const lineage = createLineage(body.name, body.createdBy, body.parentId);
        return json({ success: true, data: lineage, timestamp: now() }, 201);
      }

      case 'lineage.fork': {
        if (!body.parentId || !body.createdBy) {
          return json({ success: false, error: 'parentId and createdBy required', timestamp: now() }, 400);
        }
        const forked = forkLineage(body.parentId, body.createdBy, body.name);
        return json({ success: true, data: forked, timestamp: now() }, 201);
      }

      case 'lineage.merge': {
        if (!body.sourceId || !body.targetId || !body.createdBy) {
          return json({ success: false, error: 'sourceId, targetId, and createdBy required', timestamp: now() }, 400);
        }
        const result = mergeLineage(body.sourceId, body.targetId, body.createdBy);
        return json({ success: true, data: result, timestamp: now() });
      }

      // Shard operations
      case 'shard.append': {
        if (!body.lineageId || !body.content || !body.createdBy) {
          return json({ success: false, error: 'lineageId, content, and createdBy required', timestamp: now() }, 400);
        }
        const shard = appendShard(body.lineageId, {
          content: body.content,
          scope: body.scope ?? 'internal',
          compressionLevel: body.compressionLevel,
          tags: body.tags,
          metadata: body.metadata,
          ttl: body.ttl,
          createdBy: body.createdBy,
        });
        return json({ success: true, data: shard, timestamp: now() }, 201);
      }

      // Access control operations
      case 'access.grant': {
        if (!body.lineageId || !body.entity || !body.scope || !body.grantedBy) {
          return json({ success: false, error: 'lineageId, entity, scope, and grantedBy required', timestamp: now() }, 400);
        }
        const grant = grantAccess(body.lineageId, body.entity, body.scope, body.grantedBy, body.expiresAt);
        return json({ success: true, data: grant, timestamp: now() }, 201);
      }

      case 'access.revoke': {
        if (!body.lineageId || !body.entity || !body.revokedBy) {
          return json({ success: false, error: 'lineageId, entity, and revokedBy required', timestamp: now() }, 400);
        }
        const revoked = revokeAccess(body.lineageId, body.entity, body.revokedBy);
        return json({ success: revoked, timestamp: now() });
      }

      // Retention policy operations
      case 'retention.set': {
        if (!body.lineageId) {
          return json({ success: false, error: 'lineageId required', timestamp: now() }, 400);
        }
        const policy = setRetentionPolicy(body.lineageId, {
          maxShards: body.maxShards ?? 1000,
          maxAgeSeconds: body.maxAgeSeconds ?? 86400 * 90, // 90 days
          compressionThreshold: body.compressionThreshold ?? 86400 * 7, // 7 days
          autoArchive: body.autoArchive ?? false,
          autoPrune: body.autoPrune ?? false,
        });
        return json({ success: true, data: policy, timestamp: now() });
      }

      case 'retention.apply': {
        if (!body.lineageId) {
          return json({ success: false, error: 'lineageId required', timestamp: now() }, 400);
        }
        const result = applyRetentionPolicy(body.lineageId);
        return json({ success: true, data: result, timestamp: now() });
      }
    }

    // ─── Legacy Memory Create ────────────────────────────────────────────────
    if (!body.content) {
      return json({ success: false, error: 'Content required', timestamp: now() }, 400);
    }

    const entry = storeMemory(
      body.content,
      (body.type as any) ?? 'semantic',
      body.tags ?? [],
      body.coordinates,
      body.parentId,
    );

    return json({ success: true, data: entry, timestamp: now() }, 201);
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as { id: string; action?: string; updates?: Record<string, unknown> };
    if (!body.id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);

    if (body.action === 'pin') {
      const entry = pinMemory(body.id);
      return json({ success: !!entry, data: entry ?? undefined, timestamp: now() });
    }
    if (body.action === 'unpin') {
      const entry = unpinMemory(body.id);
      return json({ success: !!entry, data: entry ?? undefined, timestamp: now() });
    }

    const entry = updateMemory(body.id, body.updates ?? {});
    return json({ success: !!entry, data: entry ?? undefined, timestamp: now() });
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
    const ok = deleteMemory(id);
    return json({ success: ok, timestamp: now() });
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

function json<T>(data: ApiResponse<T>, status = 200) {
  return NextResponse.json(data, { status });
}

function now() {
  return new Date().toISOString();
}
